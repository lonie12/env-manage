import path from 'path';
import { safeReadFile, safeWriteFile, SAFE_DIRECTORIES } from '../utils/safe-file';
import { safeExec } from '../utils/safe-exec';

export interface ErrorLog {
  id: string;
  timestamp: string;
  type: 'build' | 'deployment' | 'runtime' | 'system';
  title: string;
  message: string;
  details?: string;
}

export class ErrorService {
  private getErrorFilePath(appName: string): string {
    return path.join(SAFE_DIRECTORIES.apps, appName, '.errors.json');
  }

  private async ensureAppDirectoryExists(appName: string): Promise<void> {
    const appDir = path.join(SAFE_DIRECTORIES.apps, appName);
    await safeExec(`mkdir -p "${appDir}"`, 'mkdir');
  }

  /**
   * Get errors for an application
   */
  async getErrors(appName: string): Promise<ErrorLog[]> {
    const errorPath = this.getErrorFilePath(appName);

    try {
      const content = await safeReadFile(errorPath, 'apps');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  /**
   * Add an error log
   */
  async addError(appName: string, error: Omit<ErrorLog, 'id' | 'timestamp'>): Promise<void> {
    const errors = await this.getErrors(appName);

    const newError: ErrorLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...error,
    };

    errors.unshift(newError);

    // Keep only last 50 errors
    const limitedErrors = errors.slice(0, 50);

    const errorPath = this.getErrorFilePath(appName);
    await safeWriteFile(errorPath, JSON.stringify(limitedErrors, null, 2), 'apps');
  }

  /**
   * Clear all errors for an application
   */
  async clearErrors(appName: string): Promise<void> {
    const errorPath = this.getErrorFilePath(appName);
    await safeWriteFile(errorPath, JSON.stringify([], null, 2), 'apps');
  }
}

export const errorService = new ErrorService();
