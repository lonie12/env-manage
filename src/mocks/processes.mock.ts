export interface Process {
  id: string;
  name: string;
  pid: number;
  status: "online" | "stopped" | "errored";
  uptime: string;
  restarts: number;
  cpu: string;
  memory: string;
  watching: boolean;
}

export const mockProcesses: Process[] = [
  {
    id: "1",
    name: "api-backend",
    pid: 12345,
    status: "online",
    uptime: "15d 4h 32m",
    restarts: 0,
    cpu: "12%",
    memory: "256 MB",
    watching: true,
  },
  {
    id: "2",
    name: "frontend-app",
    pid: 12346,
    status: "online",
    uptime: "7d 12h 15m",
    restarts: 2,
    cpu: "8%",
    memory: "512 MB",
    watching: true,
  },
  {
    id: "3",
    name: "worker-service",
    pid: 0,
    status: "stopped",
    uptime: "0m",
    restarts: 5,
    cpu: "0%",
    memory: "0 MB",
    watching: false,
  },
];
