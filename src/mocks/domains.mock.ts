export interface Domain {
  id: string;
  domain: string;
  app: string;
  status: "active" | "pending" | "error";
  ssl: boolean;
  createdAt: string;
}

export const mockDomains: Domain[] = [
  {
    id: "1",
    domain: "myapp.com",
    app: "my-app",
    status: "active",
    ssl: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    domain: "api.myapp.com",
    app: "my-app",
    status: "active",
    ssl: true,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    domain: "blog.example.com",
    app: "blog-app",
    status: "pending",
    ssl: false,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    domain: "shop.store.com",
    app: "ecommerce",
    status: "active",
    ssl: true,
    createdAt: "2024-02-10",
  },
];
