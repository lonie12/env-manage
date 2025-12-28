import path from 'path';
import fs from 'fs/promises';
import { safeExec } from '../utils/safe-exec';
import { safeWriteFile, SAFE_DIRECTORIES } from '../utils/safe-file';
import { errorService } from './error.service';
import { deploymentStatusService } from './deployment-status.service';
import { appRegistryService } from './app-registry.service';
import type { Application, DeployApplicationDto, PM2App } from '../types/application.types';

export class ApplicationService {
  /**
   * Discover apps in /var/www that have package.json
   */
  private async discoverApps(): Promise<string[]> {
    const appsDir = SAFE_DIRECTORIES.apps;

    try {
      const items = await fs.readdir(appsDir, { withFileTypes: true });
      const discoveredApps: string[] = [];

      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('.')) {
          const packageJsonPath = path.join(appsDir, item.name, 'package.json');
          try {
            await fs.access(packageJsonPath);
            discoveredApps.push(item.name);
          } catch {
            // No package.json, skip this directory
          }
        }
      }

      return discoveredApps;
    } catch {
      return [];
    }
  }

  /**
   * List all applications (merge registry, PM2 data, and discovered apps)
   */
  async listApplications(): Promise<Application[]> {
    const result = await safeExec('pm2 jlist', 'pm2');

    if (!result.success) {
      throw new Error(result.error || 'Failed to list applications');
    }

    // Validate and parse PM2 output
    const stdout = result.stdout?.trim() || '[]';
    let pm2Apps: PM2App[] = [];

    if (stdout.startsWith('[') || stdout.startsWith('{')) {
      try {
        pm2Apps = JSON.parse(stdout);
      } catch (error) {
        console.error('Failed to parse PM2 output:', stdout);
      }
    }

    const registryApps = await appRegistryService.getAll();
    const discoveredAppNames = await this.discoverApps();
    const applications: Application[] = [];

    // Add all apps from registry
    for (const regApp of registryApps) {
      const pm2App = pm2Apps.find(p => p.pm_id === regApp.pm2Id || p.name === regApp.name);

      applications.push({
        id: regApp.id,
        name: regApp.name,
        status: (pm2App?.pm2_env?.status as any) || 'stopped',
        uptime: pm2App?.pm2_env?.pm_uptime || 0,
        restarts: pm2App?.pm2_env?.restart_time || 0,
        cpu: pm2App?.monit?.cpu || 0,
        memory: pm2App?.monit?.memory || 0,
      });
    }

    // Add discovered apps that are not in registry
    for (const appName of discoveredAppNames) {
      const existsInRegistry = registryApps.some(r => r.name === appName);

      if (!existsInRegistry) {
        const pm2App = pm2Apps.find(p => p.name === appName);

        applications.push({
          id: `discovered-${appName}`,
          name: appName,
          status: (pm2App?.pm2_env?.status as any) || 'stopped',
          uptime: pm2App?.pm2_env?.pm_uptime || 0,
          restarts: pm2App?.pm2_env?.restart_time || 0,
          cpu: pm2App?.monit?.cpu || 0,
          memory: pm2App?.monit?.memory || 0,
        });
      }
    }

    return applications;
  }

  /**
   * Deploy a new application from git repository
   */
  async deployApplication(data: DeployApplicationDto): Promise<any> {
    const { name, repository, branch = 'main', port = 3000 } = data;
    const appPath = path.join(SAFE_DIRECTORIES.apps, name);
    let hasErrors = false;

    // Check if app already exists in registry
    let appRecord = await appRegistryService.getByName(name);

    // If it exists, delete it from PM2 and registry first
    if (appRecord) {
      // Delete from PM2 if it has a PM2 ID (ignore errors if not found)
      if (appRecord.pm2Id !== undefined) {
        await safeExec(`pm2 delete ${appRecord.pm2Id}`, 'pm2');
      } else {
        // Try by name (ignore errors if not found)
        await safeExec(`pm2 delete ${name}`, 'pm2');
      }
      await safeExec('pm2 save', 'pm2');

      // Delete from registry
      await appRegistryService.delete(appRecord.id);
    }

    // Create new app record in our registry (this gives us a UUID immediately)
    appRecord = await appRegistryService.create({
      name,
      repository,
      branch,
      port,
    });

    // Remove existing directory if it exists
    await safeExec(`rm -rf "${appPath}"`, 'rm');

    // Initialize deployment status
    await deploymentStatusService.initializeDeployment(name);

    // Clone repository
    await deploymentStatusService.updateStep(name, 'cloning', 'in_progress');
    const cloneResult = await safeExec(
      `git clone -b ${branch} "${repository}" "${appPath}"`,
      'git'
    );

    if (cloneResult.success) {
      await deploymentStatusService.updateStep(name, 'cloning', 'success');
    } else {
      hasErrors = true;
      await deploymentStatusService.updateStep(
        name,
        'cloning',
        'error',
        cloneResult.error || cloneResult.stderr
      );
      await errorService.addError(name, {
        type: 'deployment',
        title: 'Git Clone Failed',
        message: `Failed to clone repository ${repository}`,
        details: cloneResult.error || cloneResult.stderr,
      });

      // Create empty directory with basic package.json so we can still create PM2 app
      await safeExec(`mkdir -p "${appPath}"`, 'mkdir');
      const basicPackageJson = {
        name,
        version: '1.0.0',
        scripts: {
          start: 'echo "Application failed to deploy. Check errors for details." && exit 1'
        }
      };
      await safeWriteFile(
        path.join(appPath, 'package.json'),
        JSON.stringify(basicPackageJson, null, 2),
        'apps'
      );
    }

    // Install dependencies (only if clone succeeded)
    if (!hasErrors) {
      await deploymentStatusService.updateStep(name, 'installing', 'in_progress');
      const installResult = await safeExec(
        `npm install --production --prefix "${appPath}"`,
        'npm'
      );

      if (!installResult.success) {
        hasErrors = true;
        await deploymentStatusService.updateStep(
          name,
          'installing',
          'error',
          installResult.error || installResult.stderr
        );
        await errorService.addError(name, {
          type: 'build',
          title: 'npm install Failed',
          message: 'Failed to install dependencies',
          details: installResult.error || installResult.stderr,
        });
      } else {
        await deploymentStatusService.updateStep(name, 'installing', 'success');
      }

      // Attempt to run build script if present, capture build errors
      try {
        const pkgPath = path.join(appPath, 'package.json');
        const pkgRaw = await fs.readFile(pkgPath, 'utf-8');
        const pkg = JSON.parse(pkgRaw) as any;
        if (pkg && pkg.scripts && pkg.scripts.build) {
          await deploymentStatusService.updateStep(name, 'building', 'in_progress');
          const buildResult = await safeExec(`npm run build --prefix "${appPath}"`, 'npm');
          if (!buildResult.success) {
            hasErrors = true;
            await deploymentStatusService.updateStep(
              name,
              'building',
              'error',
              buildResult.error || buildResult.stderr || buildResult.stdout
            );
            await errorService.addError(name, {
              type: 'build',
              title: 'Build Failed',
              message: 'Failed to build application',
              details: buildResult.error || buildResult.stderr || buildResult.stdout,
            });
          } else {
            await deploymentStatusService.updateStep(name, 'building', 'success');
          }
        } else {
          // No build script, mark as success
          await deploymentStatusService.updateStep(name, 'building', 'success');
        }
      } catch (e) {
        // If package.json can't be read, mark building as success (skip it)
        await deploymentStatusService.updateStep(name, 'building', 'success');
      }
    } else {
      // If clone failed, mark installing and building as error
      await deploymentStatusService.updateStep(name, 'installing', 'error', 'Skipped due to clone failure');
      await deploymentStatusService.updateStep(name, 'building', 'error', 'Skipped due to clone failure');
    }

    // Create PM2 ecosystem config
    // Detect if project is ESM to choose the right extension
    let isESM = false;
    try {
      const pkgPath = path.join(appPath, 'package.json');
      const pkgRaw = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(pkgRaw) as any;
      isESM = pkg?.type === 'module';
    } catch {
      // Default to CommonJS if can't read
    }

    const ecosystemExtension = isESM ? 'cjs' : 'js';
    const ecosystemPath = path.join(appPath, `ecosystem.config.${ecosystemExtension}`);

    const pm2Config = {
      apps: [
        {
          name,
          script: 'npm',
          args: 'start',
          cwd: appPath,
          env: {
            PORT: port,
            NODE_ENV: 'production',
          },
          env_file: '.env', // Load .env file automatically
          instances: 1,
          autorestart: true,
          watch: false,
          max_memory_restart: '1G',
        },
      ],
    };

    await safeWriteFile(
      ecosystemPath,
      `module.exports = ${JSON.stringify(pm2Config, null, 2)}`,
      'apps'
    );

    // Start the app with PM2
    await deploymentStatusService.updateStep(name, 'starting', 'in_progress');
    const startResult = await safeExec(
      `pm2 start "${ecosystemPath}"`,
      'pm2'
    );

    if (!startResult.success) {
      hasErrors = true;
      await deploymentStatusService.updateStep(
        name,
        'starting',
        'error',
        startResult.error || startResult.stderr
      );
      await errorService.addError(name, {
        type: 'runtime',
        title: 'PM2 Start Failed',
        message: 'Failed to start application with PM2',
        details: startResult.error || startResult.stderr,
      });
    } else {
      await deploymentStatusService.updateStep(name, 'starting', 'success');

      // Get PM2 ID and update registry
      const result = await safeExec('pm2 jlist', 'pm2');
      if (result.success) {
        const stdout = result.stdout?.trim() || '[]';
        if (stdout.startsWith('[') || stdout.startsWith('{')) {
          try {
            const pm2Apps: PM2App[] = JSON.parse(stdout);
            const pm2App = pm2Apps.find(p => p.name === name);
            if (pm2App && pm2App.pm_id !== undefined) {
              await appRegistryService.updatePm2Id(appRecord.id, pm2App.pm_id);
            }
          } catch (error) {
            console.error('Failed to parse PM2 output:', stdout);
          }
        }
      }
    }

    // Save PM2 config
    await safeExec('pm2 save', 'pm2');

    return {
      id: appRecord.id, // Return our UUID
      name,
      path: appPath,
      port,
      status: hasErrors ? 'error' : 'online',
      hasErrors,
    };
  }

  /**
   * Find existing ecosystem config file (.js or .cjs)
   */
  private async findEcosystemConfig(appName: string): Promise<string | null> {
    const appPath = path.join(SAFE_DIRECTORIES.apps, appName);
    const possibleFiles = [
      path.join(appPath, 'ecosystem.config.js'),
      path.join(appPath, 'ecosystem.config.cjs'),
    ];

    for (const filePath of possibleFiles) {
      try {
        await fs.access(filePath);
        return filePath; // Found it
      } catch {
        // Doesn't exist, try next
      }
    }

    return null; // Not found
  }

  /**
   * Ensure ecosystem.config exists for an app (create if missing)
   * Returns the path to the ecosystem config file
   */
  private async ensureEcosystemConfig(appName: string): Promise<string> {
    const appPath = path.join(SAFE_DIRECTORIES.apps, appName);

    // Check if ecosystem.config already exists (.js or .cjs)
    const existingEcosystem = await this.findEcosystemConfig(appName);
    if (existingEcosystem) {
      return existingEcosystem; // Already exists, return path
    }

    // Read package.json to get app info
    let packageJson: any = {};
    let isESM = false;
    try {
      const pkgPath = path.join(appPath, 'package.json');
      const pkgContent = await fs.readFile(pkgPath, 'utf-8');
      packageJson = JSON.parse(pkgContent);
      isESM = packageJson.type === 'module';
    } catch (error) {
      console.warn(`Could not read package.json for ${appName}:`, error);
    }

    // Determine the start script
    let script = 'npm';
    let args = 'start';

    // Check if package.json has a start script
    if (packageJson.scripts?.start) {
      script = 'npm';
      args = 'start';
    } else if (packageJson.main) {
      script = 'node';
      args = packageJson.main;
    } else {
      // Default to index.js
      script = 'node';
      args = 'index.js';
    }

    // Determine file extension: use .cjs if project is ESM, otherwise .js
    const extension = isESM ? 'cjs' : 'js';
    const ecosystemPath = path.join(appPath, `ecosystem.config.${extension}`);

    // Create ecosystem.config
    const pm2Config = {
      apps: [
        {
          name: appName,
          script,
          args,
          cwd: appPath,
          env_file: '.env', // Automatically load .env file
          instances: 1,
          autorestart: true,
          watch: false,
          max_memory_restart: '1G',
        },
      ],
    };

    await safeWriteFile(
      ecosystemPath,
      `module.exports = ${JSON.stringify(pm2Config, null, 2)}`,
      'apps'
    );

    console.log(`Created ecosystem.config.${extension} for ${appName}`);
    return ecosystemPath;
  }

  /**
   * Get app name from ID (handles both registry UUIDs and discovered-* IDs)
   */
  private async getAppName(id: string): Promise<string | null> {
    // Check if it's a discovered app
    if (id.startsWith('discovered-')) {
      return id.replace('discovered-', '');
    }

    // Otherwise, look it up in the registry
    const app = await appRegistryService.getById(id);
    return app?.name || null;
  }

  /**
   * Get PM2 identifier (ID or name) from our UUID
   */
  private async getPm2Identifier(uuid: string): Promise<string | number | null> {
    // Check if it's a discovered app
    if (uuid.startsWith('discovered-')) {
      return uuid.replace('discovered-', '');
    }

    const app = await appRegistryService.getById(uuid);
    if (!app) return null;

    // Prefer PM2 ID if available, otherwise use name
    return app.pm2Id !== undefined ? app.pm2Id : app.name;
  }

  /**
   * Start an application by UUID
   */
  async startApplication(id: string): Promise<void> {
    const appName = await this.getAppName(id);
    if (!appName) {
      throw new Error('Application not found');
    }

    // Ensure ecosystem.config exists (create if missing, supports .js and .cjs)
    const ecosystemPath = await this.ensureEcosystemConfig(appName);

    // If it's a discovered app that's never been started, start with ecosystem
    if (id.startsWith('discovered-')) {
      const result = await safeExec(`pm2 start "${ecosystemPath}"`, 'pm2');

      if (!result.success) {
        throw new Error(result.error || 'Failed to start application');
      }

      // Save PM2 config
      await safeExec('pm2 save', 'pm2');
      return;
    }

    // For registry apps, use the PM2 identifier
    const pm2Identifier = await this.getPm2Identifier(id);
    if (pm2Identifier === null) {
      throw new Error('Application not found');
    }

    const result = await safeExec(`pm2 start ${pm2Identifier}`, 'pm2');

    if (!result.success) {
      throw new Error(result.error || 'Failed to start application');
    }
  }

  /**
   * Stop an application by UUID
   */
  async stopApplication(id: string): Promise<void> {
    const pm2Identifier = await this.getPm2Identifier(id);
    if (pm2Identifier === null) {
      throw new Error('Application not found');
    }

    const result = await safeExec(`pm2 stop ${pm2Identifier}`, 'pm2');

    if (!result.success) {
      throw new Error(result.error || 'Failed to stop application');
    }
  }

  /**
   * Restart an application by UUID
   */
  async restartApplication(id: string): Promise<void> {
    const appName = await this.getAppName(id);
    if (!appName) {
      throw new Error('Application not found');
    }

    // Ensure ecosystem.config.js exists (create if missing)
    await this.ensureEcosystemConfig(appName);

    const pm2Identifier = await this.getPm2Identifier(id);
    if (pm2Identifier === null) {
      throw new Error('Application not found');
    }

    const result = await safeExec(`pm2 restart ${pm2Identifier}`, 'pm2');

    if (!result.success) {
      throw new Error(result.error || 'Failed to restart application');
    }
  }

  /**
   * Remove an application by UUID
   */
  async removeApplication(id: string): Promise<void> {
    // Check if it's a discovered app
    if (id.startsWith('discovered-')) {
      const appName = id.replace('discovered-', '');

      // Delete from PM2 (ignore errors if not found)
      await safeExec(`pm2 delete ${appName}`, 'pm2');
      await safeExec('pm2 save', 'pm2');

      // Remove app directory
      const appPath = path.join(SAFE_DIRECTORIES.apps, appName);
      await safeExec(`rm -rf "${appPath}"`, 'rm');

      return;
    }

    const app = await appRegistryService.getById(id);
    if (!app) {
      throw new Error('Application not found');
    }

    // Delete from PM2 if it has a PM2 ID (ignore errors if not found)
    if (app.pm2Id !== undefined) {
      await safeExec(`pm2 delete ${app.pm2Id}`, 'pm2');
    } else {
      // Try by name if no PM2 ID (ignore errors if not found)
      await safeExec(`pm2 delete ${app.name}`, 'pm2');
    }
    await safeExec('pm2 save', 'pm2');

    // Remove from our registry
    await appRegistryService.delete(id);

    // Remove app directory
    const appPath = path.join(SAFE_DIRECTORIES.apps, app.name);
    await safeExec(`rm -rf "${appPath}"`, 'rm');
  }

  /**
   * Get logs for an application by UUID
   */
  async getApplicationLogs(id: string, lines: number = 100): Promise<any[]> {
    const appName = await this.getAppName(id);
    if (!appName) {
      return [];
    }

    // Get application info to find log file paths
    const result = await safeExec(`pm2 jlist`, 'pm2');

    if (!result.success) {
      throw new Error(result.error || 'Failed to get application info');
    }

    // Validate and parse PM2 output
    const stdout = result.stdout?.trim() || '[]';
    let apps: PM2App[] = [];

    if (stdout.startsWith('[') || stdout.startsWith('{')) {
      try {
        apps = JSON.parse(stdout);
      } catch (error) {
        console.error('Failed to parse PM2 output:', stdout);
        return [];
      }
    }

    const app = apps.find((a) => a.name === appName);

    if (!app) {
      return [];
    }

    const logs: any[] = [];

    // Get error logs
    if (app.pm2_env?.pm_err_log_path) {
      const errorLogResult = await safeExec(
        `tail -n ${lines} ${app.pm2_env.pm_err_log_path}`,
        'tail'
      );

      if (errorLogResult.success && errorLogResult.stdout) {
        const errorLines = errorLogResult.stdout.trim().split('\n');
        errorLines.forEach((line, index) => {
          if (line.trim()) {
            logs.push({
              id: `error-${Date.now()}-${index}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              app: appName,
              level: 'error',
              message: line,
            });
          }
        });
      }
    }

    // Get output logs
    if (app.pm2_env?.pm_out_log_path) {
      const outLogResult = await safeExec(
        `tail -n ${lines} ${app.pm2_env.pm_out_log_path}`,
        'tail'
      );

      if (outLogResult.success && outLogResult.stdout) {
        const outLines = outLogResult.stdout.trim().split('\n');
        outLines.forEach((line, index) => {
          if (line.trim()) {
            logs.push({
              id: `out-${Date.now()}-${index}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              app: appName,
              level: 'info',
              message: line,
            });
          }
        });
      }
    }

    // Sort by timestamp (most recent first)
    return logs.slice(-lines);
  }
}

export const applicationService = new ApplicationService();
