import type { Application as ApiApplication } from '@/api';

export interface AppDisplay {
  id: string;
  name: string;
  repository: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  memory: string;
  cpu: string;
  restarts: number;
  lastDeployed: string;
}

export function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatCpu(cpu: number): string {
  return `${cpu.toFixed(1)}%`;
}

export function apiAppToDisplay(app: ApiApplication): AppDisplay {
  const statusMap: Record<string, 'running' | 'stopped' | 'error'> = {
    online: 'running',
    stopped: 'stopped',
    error: 'error',
  };

  return {
    id: app.id,
    name: app.name,
    repository: `App #${app.id}`, // We don't have repository in API response
    status: statusMap[app.status] || 'error',
    uptime: formatUptime(app.uptime),
    memory: formatBytes(app.memory),
    cpu: formatCpu(app.cpu),
    restarts: app.restarts,
    lastDeployed: new Date().toISOString().split('T')[0], // Placeholder
  };
}
