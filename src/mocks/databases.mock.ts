export interface Database {
  id: string;
  name: string;
  type: "postgresql" | "mysql" | "mongodb" | "redis";
  status: "online" | "offline" | "maintenance";
  host: string;
  port: number;
  size: string;
  connections: number;
  maxConnections: number;
  createdAt: string;
}

export const mockDatabases: Database[] = [
  {
    id: "1",
    name: "production-db",
    type: "postgresql",
    status: "online",
    host: "localhost",
    port: 5432,
    size: "2.4 GB",
    connections: 12,
    maxConnections: 100,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "cache-store",
    type: "redis",
    status: "online",
    host: "localhost",
    port: 6379,
    size: "156 MB",
    connections: 5,
    maxConnections: 50,
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "app-mysql",
    type: "mysql",
    status: "online",
    host: "localhost",
    port: 3306,
    size: "1.8 GB",
    connections: 8,
    maxConnections: 150,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "analytics-mongo",
    type: "mongodb",
    status: "maintenance",
    host: "localhost",
    port: 27017,
    size: "5.2 GB",
    connections: 0,
    maxConnections: 200,
    createdAt: "2024-02-10",
  },
];
