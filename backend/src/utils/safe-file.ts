import path from 'path';
import fs from 'fs/promises';

// Define safe directories - using getter to ensure NODE_ENV is loaded
let _cachedDirectories: any = null;

export function getSAFE_DIRECTORIES() {
  if (!_cachedDirectories) {
    const isDev = process.env.NODE_ENV === 'development';
    _cachedDirectories = {
      apps: isDev ? `${process.env.HOME}/var/www` : '/var/www',
      nginx: '/etc/nginx/sites-available',
      nginxEnabled: '/etc/nginx/sites-enabled',
      ssl: '/etc/letsencrypt/live',
      logs: isDev ? `${process.env.HOME}/var/log` : '/var/log',
      pm2: `${process.env.HOME}/.pm2`,
    };
  }
  return _cachedDirectories;
}

// For backward compatibility
export const SAFE_DIRECTORIES = new Proxy({}, {
  get(target, prop) {
    return getSAFE_DIRECTORIES()[prop as string];
  }
});

/**
 * Validate that a path is within an allowed directory
 */
export function validatePath(filePath: string, allowedDir: string): boolean {
  const normalizedPath = path.normalize(path.resolve(filePath));
  const normalizedAllowed = path.normalize(path.resolve(allowedDir));
  return normalizedPath.startsWith(normalizedAllowed);
}

/**
 * Safely read a file from an allowed directory
 */
export async function safeReadFile(
  filePath: string,
  directory: keyof typeof SAFE_DIRECTORIES
): Promise<string> {
  const allowedDir = SAFE_DIRECTORIES[directory];

  if (!validatePath(filePath, allowedDir)) {
    throw new Error('Access denied: Path outside allowed directory');
  }

  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error: any) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

/**
 * Safely write to a file in an allowed directory
 */
export async function safeWriteFile(
  filePath: string,
  content: string,
  directory: keyof typeof SAFE_DIRECTORIES
): Promise<void> {
  const allowedDir = SAFE_DIRECTORIES[directory];

  if (!validatePath(filePath, allowedDir)) {
    throw new Error('Access denied: Path outside allowed directory');
  }

  try {
    // Ensure parent directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Backup original file if it exists
    try {
      await fs.copyFile(filePath, `${filePath}.backup-${Date.now()}`);
    } catch {
      // File doesn't exist, that's okay
    }

    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error: any) {
    throw new Error(`Failed to write file: ${error.message}`);
  }
}

/**
 * Safely delete a file from an allowed directory
 */
export async function safeDeleteFile(
  filePath: string,
  directory: keyof typeof SAFE_DIRECTORIES
): Promise<void> {
  const allowedDir = SAFE_DIRECTORIES[directory];

  if (!validatePath(filePath, allowedDir)) {
    throw new Error('Access denied: Path outside allowed directory');
  }

  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
