import { apiClient } from './client';

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

export interface SchemaResponse {
  success: boolean;
  schema?: string;
  error?: string;
}

export type DatabaseAction = 'push' | 'generate' | 'migrate';

export const databaseApi = {
  /**
   * Get database status for an application
   */
  getStatus: async (appId: string): Promise<DatabaseStatusResponse> => {
    return apiClient.get<DatabaseStatusResponse>(
      `/api/applications/${appId}/database/status`
    );
  },

  /**
   * List migrations for an application
   */
  listMigrations: async (appId: string): Promise<MigrationsListResponse> => {
    return apiClient.get<MigrationsListResponse>(
      `/api/applications/${appId}/database/migrations`
    );
  },

  /**
   * Execute a database action (push, generate, migrate)
   */
  executeAction: async (
    appId: string,
    action: DatabaseAction
  ): Promise<DatabaseActionResponse> => {
    return apiClient.post<DatabaseActionResponse>(
      `/api/applications/${appId}/database/${action}`
    );
  },

  /**
   * Sync database schema (drizzle-kit push)
   */
  syncDatabase: async (appId: string): Promise<DatabaseActionResponse> => {
    return databaseApi.executeAction(appId, 'push');
  },

  /**
   * Generate migration
   */
  generateMigration: async (appId: string): Promise<DatabaseActionResponse> => {
    return databaseApi.executeAction(appId, 'generate');
  },

  /**
   * Run migrations
   */
  runMigrations: async (appId: string): Promise<DatabaseActionResponse> => {
    return databaseApi.executeAction(appId, 'migrate');
  },

  /**
   * Get database schema content
   */
  getSchema: async (appId: string): Promise<SchemaResponse> => {
    return apiClient.get<SchemaResponse>(
      `/api/applications/${appId}/database/schema`
    );
  },
};
