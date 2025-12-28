export interface Application {
  id: string; // UUID instead of PM2 ID
  name: string;
  status: 'online' | 'stopped' | 'error';
  uptime: number;
  restarts: number;
  cpu: number;
  memory: number;
}

export interface DeployApplicationDto {
  name: string;
  repository: string;
  branch?: string;
  port?: number;
}

export interface PM2App {
  pm_id: number;
  name: string;
  pm2_env?: {
    status?: string;
    pm_uptime?: number;
    restart_time?: number;
    pm_err_log_path?: string;
    pm_out_log_path?: string;
  };
  monit?: {
    cpu?: number;
    memory?: number;
  };
}
