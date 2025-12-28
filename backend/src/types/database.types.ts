export interface DatabaseInfo {
  hasDatabase: boolean;
  dbType: 'postgresql' | 'mysql' | 'sqlite' | null;
  connected: boolean;
  databaseUrl?: string;
  hasDrizzle: boolean;
  configPath?: string;
}

export interface Migration {
  id: string;
  name: string;
  filePath: string;
  createdAt: string;
}

export interface DatabaseStatusResponse {
  success: boolean;
  database: DatabaseInfo;
}

export interface MigrationsListResponse {
  success: boolean;
  migrations: Migration[];
}

export interface DatabaseActionResponse {
  success: boolean;
  message: string;
  output?: string;
}

export type DatabaseAction = 'push' | 'generate' | 'migrate';
