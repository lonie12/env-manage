import { apiClient } from './client';

export interface EnvVar {
  key: string;
  value: string;
}

export interface EnvVarsResponse {
  variables: EnvVar[];
}

export interface EnvVarData {
  key: string;
  value: string;
}

interface EnvVarMessageResponse {
  message: string;
  variable?: EnvVar;
}

export const envVarApi = {
  async list(appId: string): Promise<EnvVarsResponse> {
    return apiClient.get<EnvVarsResponse>(`/api/applications/${appId}/env-vars`);
  },

  async create(appId: string, data: EnvVarData): Promise<EnvVarMessageResponse> {
    return apiClient.post<EnvVarMessageResponse>(`/api/applications/${appId}/env-vars`, data);
  },

  async delete(appId: string, key: string): Promise<EnvVarMessageResponse> {
    return apiClient.delete<EnvVarMessageResponse>(`/api/applications/${appId}/env-vars/${key}`);
  },
};
