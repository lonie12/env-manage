import path from 'path';
import fs from 'fs/promises';
import { safeReadFile, safeWriteFile, SAFE_DIRECTORIES } from '../utils/safe-file';
import type { EnvironmentVariable, CreateEnvVarDto } from '../types/env-var.types';

export class EnvVarService {
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
   * Ensure ecosystem.config has env_file configured (supports .js and .cjs)
   */
  private async ensureEcosystemHasEnvFile(appName: string): Promise<void> {
    const ecosystemPath = await this.findEcosystemConfig(appName);

    if (!ecosystemPath) {
      // No ecosystem config found, skip
      return;
    }

    try {
      // Check if ecosystem.config exists
      const content = await fs.readFile(ecosystemPath, 'utf-8');

      // Check if it already has env_file configured
      if (content.includes('env_file')) {
        return; // Already configured
      }

      // Parse and add env_file
      // This is a simple string replacement approach
      // For production, you might want a more robust parser
      const updatedContent = content.replace(
        /apps:\s*\[\s*\{/,
        'apps: [{\n          env_file: \'.env\','
      );

      await fs.writeFile(ecosystemPath, updatedContent, 'utf-8');
      const extension = ecosystemPath.endsWith('.cjs') ? '.cjs' : '.js';
      console.log(`Added env_file to ecosystem.config${extension} for ${appName}`);
    } catch (error) {
      console.warn(`Could not update ecosystem.config for ${appName}:`, error);
    }
  }

  /**
   * Get environment variables for an app
   */
  async getEnvVars(app: string): Promise<EnvironmentVariable[]> {
    const envPath = path.join(SAFE_DIRECTORIES.apps, app, '.env');

    try {
      const envContent = await safeReadFile(envPath, 'apps');

      // Parse .env file
      const vars = envContent
        .split('\n')
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
          const [key, ...valueParts] = line.split('=');
          return {
            key: key.trim(),
            value: valueParts.join('=').trim(),
          };
        });

      return vars;
    } catch {
      // .env file doesn't exist
      return [];
    }
  }

  /**
   * Add or update environment variable
   */
  async setEnvVar(data: CreateEnvVarDto): Promise<EnvironmentVariable> {
    const { app, key, value } = data;
    const envPath = path.join(SAFE_DIRECTORIES.apps, app, '.env');

    // Ensure ecosystem.config.js has env_file configured
    await this.ensureEcosystemHasEnvFile(app);

    // Read existing .env
    let envContent = '';
    try {
      envContent = await safeReadFile(envPath, 'apps');
    } catch {
      // File doesn't exist, create new
    }

    // Parse and update
    const lines = envContent.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(`${key}=`)) {
        lines[i] = `${key}=${value}`;
        updated = true;
        break;
      }
    }

    if (!updated) {
      lines.push(`${key}=${value}`);
    }

    // Write back
    await safeWriteFile(envPath, lines.join('\n'), 'apps');

    return { key, value };
  }

  /**
   * Delete an environment variable
   */
  async deleteEnvVar(app: string, key: string): Promise<void> {
    const envPath = path.join(SAFE_DIRECTORIES.apps, app, '.env');

    // Read existing .env
    let envContent = '';
    try {
      envContent = await safeReadFile(envPath, 'apps');
    } catch {
      // File doesn't exist
      return;
    }

    // Parse and remove
    const lines = envContent
      .split('\n')
      .filter((line) => !line.startsWith(`${key}=`));

    // Write back
    await safeWriteFile(envPath, lines.join('\n'), 'apps');
  }
}

export const envVarService = new EnvVarService();
