export interface Application {
  id: string;
  name: string;
  repository: string;
  branch: string;
  path: string;
  status: "running" | "stopped" | "error";
  port: number;
  uptime: string;
  memory: string;
  cpu: string;
  restarts: number;
  lastDeployed: string;
}

export const mockApps: Application[] = [
  {
    id: "1",
    name: "api-backend",
    repository: "github.com/user/api-backend",
    branch: "main",
    path: "/var/www/api-backend",
    status: "running",
    port: 3000,
    uptime: "15d 4h 32m",
    memory: "256 MB",
    cpu: "12%",
    restarts: 0,
    lastDeployed: "2025-12-10 14:30:00",
  },
  {
    id: "2",
    name: "frontend-app",
    repository: "github.com/user/frontend-app",
    branch: "production",
    path: "/var/www/frontend-app",
    status: "running",
    port: 3001,
    uptime: "7d 12h 15m",
    memory: "512 MB",
    cpu: "8%",
    restarts: 2,
    lastDeployed: "2025-12-16 09:15:00",
  },
  {
    id: "3",
    name: "worker-service",
    repository: "github.com/user/worker-service",
    branch: "main",
    path: "/var/www/worker-service",
    status: "stopped",
    port: 3002,
    uptime: "0m",
    memory: "0 MB",
    cpu: "0%",
    restarts: 5,
    lastDeployed: "2025-12-08 16:45:00",
  },
];
