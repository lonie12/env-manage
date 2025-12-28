import path from 'path';
import { randomUUID } from 'crypto';
import { getSAFE_DIRECTORIES } from '../utils/safe-file';

export interface AppRecord {
  id: string; // Our UUID
  name: string;
  pm2Id?: number; // PM2 ID (only after app is started)
  repository: string;
  branch: string;
  port: number;
  createdAt: string;
  updatedAt: string;
}

class AppRegistryService {
  private getRegistryPath(): string {
    return path.join(getSAFE_DIRECTORIES().apps, '.app-registry.json');
  }

  async getAll(): Promise<AppRecord[]> {
    const registryPath = this.getRegistryPath();
    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(registryPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<AppRecord | null> {
    const apps = await this.getAll();
    return apps.find(app => app.id === id) || null;
  }

  async getByName(name: string): Promise<AppRecord | null> {
    const apps = await this.getAll();
    return apps.find(app => app.name === name) || null;
  }

  async create(data: {
    name: string;
    repository: string;
    branch: string;
    port: number;
  }): Promise<AppRecord> {
    const apps = await this.getAll();

    const newApp: AppRecord = {
      id: randomUUID(),
      name: data.name,
      repository: data.repository,
      branch: data.branch,
      port: data.port,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    apps.push(newApp);
    await this.save(apps);

    return newApp;
  }

  async updatePm2Id(id: string, pm2Id: number): Promise<void> {
    const apps = await this.getAll();
    const app = apps.find(a => a.id === id);

    if (app) {
      app.pm2Id = pm2Id;
      app.updatedAt = new Date().toISOString();
      await this.save(apps);
    }
  }

  async delete(id: string): Promise<void> {
    const apps = await this.getAll();
    const filtered = apps.filter(a => a.id !== id);
    await this.save(filtered);
  }

  private async save(apps: AppRecord[]): Promise<void> {
    const registryDir = path.dirname(this.getRegistryPath());
    const { safeExec } = await import('../utils/safe-exec');
    await safeExec(`mkdir -p "${registryDir}"`, 'mkdir');

    const registryPath = this.getRegistryPath();
    const fs = await import('fs/promises');
    await fs.writeFile(registryPath, JSON.stringify(apps, null, 2), 'utf-8');
  }
}

export const appRegistryService = new AppRegistryService();
