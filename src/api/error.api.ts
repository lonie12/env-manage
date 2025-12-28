import { apiClient } from './client';

export interface ErrorLog {
  id: string;
  timestamp: string;
  type: 'build' | 'deployment' | 'runtime' | 'system';
  title: string;
  message: string;
  details?: string;
}

export interface ErrorsResponse {
  errors: ErrorLog[];
}

interface ErrorMessageResponse {
  message: string;
}

export const errorApi = {
  async list(appId: string): Promise<ErrorsResponse> {
    return apiClient.get<ErrorsResponse>(`/api/applications/${appId}/errors`);
  },

  async clear(appId: string): Promise<ErrorMessageResponse> {
    return apiClient.delete<ErrorMessageResponse>(`/api/applications/${appId}/errors`);
  },
};
