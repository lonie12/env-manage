export type UserRole = 'admin' | 'developer' | 'viewer';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: UserRole;
  };
}

export interface UserPayload {
  id: string;
  username: string;
  role: UserRole;
}
