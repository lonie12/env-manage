import path from 'path';
import { SAFE_DIRECTORIES, safeReadFile, safeWriteFile } from '../utils/safe-file';
import { safeExec } from '../utils/safe-exec';

export type DeploymentStep = 'cloning' | 'installing' | 'building' | 'starting';
export type StepStatus = 'pending' | 'in_progress' | 'success' | 'error';

export interface DeploymentStatus {
  currentStep: DeploymentStep;
  steps: {
    cloning: StepStatus;
    installing: StepStatus;
    building: StepStatus;
    starting: StepStatus;
  };
  error?: {
    step: DeploymentStep;
    message: string;
  };
  completedAt?: string;
}

class DeploymentStatusService {
  private getStatusFilePath(appName: string): string {
    // Store deployment status in a separate directory to avoid conflicts with git clone
    const statusDir = path.join(SAFE_DIRECTORIES.apps, '.deployment-status');
    return path.join(statusDir, `${appName}.json`);
  }

  async initializeDeployment(appName: string): Promise<void> {
    const status: DeploymentStatus = {
      currentStep: 'cloning',
      steps: {
        cloning: 'pending',
        installing: 'pending',
        building: 'pending',
        starting: 'pending',
      },
    };

    // Ensure .deployment-status directory exists (NOT the app directory)
    const statusDir = path.join(SAFE_DIRECTORIES.apps, '.deployment-status');
    await safeExec(`mkdir -p "${statusDir}"`, 'mkdir');

    const statusPath = this.getStatusFilePath(appName);
    await safeWriteFile(statusPath, JSON.stringify(status, null, 2), 'apps');
  }

  async updateStep(
    appName: string,
    step: DeploymentStep,
    status: StepStatus,
    errorMessage?: string
  ): Promise<void> {
    const currentStatus = await this.getStatus(appName);

    currentStatus.currentStep = step;
    currentStatus.steps[step] = status;

    if (status === 'error' && errorMessage) {
      currentStatus.error = {
        step,
        message: errorMessage,
      };
    }

    // Mark as completed if all steps are done (success or error)
    const allSteps: DeploymentStep[] = ['cloning', 'installing', 'building', 'starting'];
    const allDone = allSteps.every(
      (s) => currentStatus.steps[s] === 'success' || currentStatus.steps[s] === 'error'
    );

    if (allDone && !currentStatus.completedAt) {
      currentStatus.completedAt = new Date().toISOString();
    }

    const statusPath = this.getStatusFilePath(appName);
    await safeWriteFile(statusPath, JSON.stringify(currentStatus, null, 2), 'apps');
  }

  async getStatus(appName: string): Promise<DeploymentStatus> {
    const statusPath = this.getStatusFilePath(appName);

    try {
      const content = await safeReadFile(statusPath, 'apps');
      return JSON.parse(content);
    } catch {
      // Return default status if file doesn't exist
      return {
        currentStep: 'cloning',
        steps: {
          cloning: 'pending',
          installing: 'pending',
          building: 'pending',
          starting: 'pending',
        },
      };
    }
  }

  async clearStatus(appName: string): Promise<void> {
    const statusPath = this.getStatusFilePath(appName);

    try {
      await safeExec(`rm -f "${statusPath}"`, 'rm');
    } catch {
      // Ignore if file doesn't exist
    }
  }
}

export const deploymentStatusService = new DeploymentStatusService();
