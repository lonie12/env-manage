export interface LogEntry {
  id: string;
  timestamp: string;
  app: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
}

export const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2025-12-23 22:45:12",
    app: "api-backend",
    level: "info",
    message: "Server started on port 3000",
  },
  {
    id: "2",
    timestamp: "2025-12-23 22:45:15",
    app: "api-backend",
    level: "info",
    message: "Database connected successfully",
  },
  {
    id: "3",
    timestamp: "2025-12-23 22:46:00",
    app: "api-backend",
    level: "info",
    message: "GET /api/users - 200 OK (45ms)",
  },
  {
    id: "4",
    timestamp: "2025-12-23 22:46:30",
    app: "frontend-app",
    level: "info",
    message: "Application built successfully",
  },
  {
    id: "5",
    timestamp: "2025-12-23 22:47:00",
    app: "api-backend",
    level: "warn",
    message: "High memory usage detected: 85%",
  },
  {
    id: "6",
    timestamp: "2025-12-23 22:47:15",
    app: "worker-service",
    level: "error",
    message: "Failed to connect to Redis: Connection timeout",
  },
  {
    id: "7",
    timestamp: "2025-12-23 22:48:00",
    app: "api-backend",
    level: "info",
    message: "POST /api/auth/login - 200 OK (123ms)",
  },
  {
    id: "8",
    timestamp: "2025-12-23 22:48:30",
    app: "api-backend",
    level: "debug",
    message: "Cache hit for key: user:12345",
  },
];
