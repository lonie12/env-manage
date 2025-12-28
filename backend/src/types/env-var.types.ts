export interface EnvironmentVariable {
  key: string;
  value: string;
}

export interface CreateEnvVarDto {
  app: string;
  key: string;
  value: string;
}

export interface GetEnvVarsQuery {
  app: string;
}
