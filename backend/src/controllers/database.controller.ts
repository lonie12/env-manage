import type { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service.js';
import { applicationService } from '../services/application.service.js';
import type { DatabaseAction } from '../types/database.types.js';
import type { Application } from '../types/application.types.js';

export class DatabaseController {
  /**
   * GET /api/applications/:id/database/status
   */
  static async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get app path from applicationService
      const apps = await applicationService.listApplications();
      const app = apps.find((a: Application) => a.id === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      const result = await DatabaseService.getDatabaseStatus(app.name);
      res.json(result);
    } catch (error) {
      console.error('Database status error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/applications/:id/database/migrations
   */
  static async listMigrations(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const apps = await applicationService.listApplications();
      const app = apps.find((a: Application) => a.id === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      const result = await DatabaseService.listMigrations(app.name);
      res.json(result);
    } catch (error) {
      console.error('List migrations error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/applications/:id/database/:action
   */
  static async executeAction(req: Request, res: Response): Promise<void> {
    try {
      const { id, action } = req.params;

      if (!['push', 'generate', 'migrate'].includes(action)) {
        res.status(400).json({ error: 'Invalid action' });
        return;
      }

      const apps = await applicationService.listApplications();
      const app = apps.find((a: Application) => a.id === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      const result = await DatabaseService.executeDatabaseAction(
        app.name,
        action as DatabaseAction
      );

      res.json(result);
    } catch (error) {
      console.error(`Database ${req.params.action} error:`, error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
