import { apiClient } from './client';

export interface Application {
  id: string;
  name: string;
  status: 'online' | 'stopped' | 'error';
  uptime: number;
  restarts: number;
  cpu: number;
  memory: number;
}

export interface DeployApplicationData {
  name: string;
  repository: string;
  branch?: string;
  port?: number;
}

export interface ApplicationsResponse {
  applications: Application[];
}

export interface DeployResponse {
  message: string;
  application: {
    name: string;
    path: string;
    port: number;
    status: string;
  };
}

export interface MessageResponse {
  message: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  app: string;
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
}

export interface LogsResponse {
  logs: LogEntry[];
}

export const applicationApi = {
  async list(): Promise<ApplicationsResponse> {
    return apiClient.get<ApplicationsResponse>('/api/applications');
  },

  async deploy(data: DeployApplicationData): Promise<DeployResponse> {
    return apiClient.post<DeployResponse>('/api/applications', data);
  },

  async start(id: string): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>(`/api/applications/${id}/start`);
  },

  async stop(id: string): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>(`/api/applications/${id}/stop`);
  },

  async restart(id: string): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>(`/api/applications/${id}/restart`);
  },

  async delete(id: string): Promise<MessageResponse> {
    return apiClient.delete<MessageResponse>(`/api/applications/${id}`);
  },

  async getLogs(id: string, lines: number = 100): Promise<LogsResponse> {
    return apiClient.get<LogsResponse>(`/api/applications/${id}/logs?lines=${lines}`);
  },
};
