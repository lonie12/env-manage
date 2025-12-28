import { apiClient } from './client';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'developer' | 'viewer';
  };
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'developer' | 'viewer';
}

export const authApi = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      username,
      password,
    });

    // Store token
    apiClient.setToken(response.token);

    return response;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
    apiClient.clearToken();
  },

  async getCurrentUser(): Promise<{ user: User }> {
    return apiClient.get<{ user: User }>('/api/auth/me');
  },

  getToken(): string | null {
    return apiClient.getToken();
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },
};
