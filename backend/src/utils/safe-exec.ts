import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Whitelist of allowed commands
const ALLOWED_COMMANDS = [
  'pm2',
  'nginx',
  'certbot',
  'git',
  'npm',
  'yarn',
  'pnpm',
  'node',
  'systemctl',
  'psql',
  'mysql',
  'mongosh',
  'redis-cli',
  'ln',
  'sudo',
  'openssl',
  'tail',
  'mkdir',
  'rm',
  'mv',
  'cp',
  'find',
];

export interface ExecResult {
  success: boolean;
  stdout?: string;
  stderr?: string;
  error?: string;
}

/**
 * Safely execute a shell command with validation and sanitization
 */
export async function safeExec(
  command: string,
  allowedCmd?: string
): Promise<ExecResult> {
  try {
    // Get the first word of the command
    const cmdStart = command.trim().split(/\s+/)[0];

    // Validate against whitelist
    if (allowedCmd && !command.trim().startsWith(allowedCmd)) {
      throw new Error(`Command must start with ${allowedCmd}`);
    }

    if (!ALLOWED_COMMANDS.includes(cmdStart) && !cmdStart.startsWith('sudo')) {
      throw new Error(`Command '${cmdStart}' is not allowed`);
    }

    // Prevent basic command injection (not foolproof, be careful!)
    const dangerousChars = [';', '&&', '||', '|', '`', '$()'];
    for (const char of dangerousChars) {
      if (command.includes(char) && !allowedCmd?.includes(char)) {
        throw new Error('Command contains potentially dangerous characters');
      }
    }

    // Execute with timeout and buffer limits
    const { stdout, stderr } = await execPromise(command, {
      timeout: 60000, // 60s timeout
      maxBuffer: 1024 * 1024 * 10, // 10MB max output
    });

    return {
      success: true,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stderr: error.stderr,
    };
  }
}

/**
 * Execute a command and stream output
 */
export function safeExecStream(
  command: string,
  onData: (data: string) => void,
  onError: (error: string) => void,
  onClose: (code: number) => void
) {
  const { spawn } = require('child_process');
  const cmdParts = command.split(/\s+/);
  const cmd = cmdParts[0];
  const args = cmdParts.slice(1);

  if (!ALLOWED_COMMANDS.includes(cmd)) {
    onError(`Command '${cmd}' is not allowed`);
    return null;
  }

  const proc = spawn(cmd, args);

  proc.stdout.on('data', (data: Buffer) => {
    onData(data.toString());
  });

  proc.stderr.on('data', (data: Buffer) => {
    onError(data.toString());
  });

  proc.on('close', (code: number) => {
    onClose(code);
  });

  return proc;
}
