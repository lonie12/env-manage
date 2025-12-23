export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  app: string;
  isSecret: boolean;
}

export const mockEnvVars: EnvironmentVariable[] = [
  {
    id: "1",
    key: "DATABASE_URL",
    value: "postgresql://user:****@localhost:5432/mydb",
    app: "api-backend",
    isSecret: true,
  },
  {
    id: "2",
    key: "NODE_ENV",
    value: "production",
    app: "api-backend",
    isSecret: false,
  },
  {
    id: "3",
    key: "PORT",
    value: "3000",
    app: "api-backend",
    isSecret: false,
  },
  {
    id: "4",
    key: "JWT_SECRET",
    value: "************************************",
    app: "api-backend",
    isSecret: true,
  },
  {
    id: "5",
    key: "API_URL",
    value: "https://api.example.com",
    app: "frontend-app",
    isSecret: false,
  },
  {
    id: "6",
    key: "VITE_APP_NAME",
    value: "My Frontend App",
    app: "frontend-app",
    isSecret: false,
  },
];
