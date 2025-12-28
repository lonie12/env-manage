import { Request, Response } from 'express';
import { envVarService } from '../services/env-var.service';
import { applicationService } from '../services/application.service';
import type { CreateEnvVarDto } from '../types/env-var.types';

export class EnvVarController {
  /**
   * GET /api/applications/:id/env-vars
   * List environment variables for an app
   */
  async getEnvVars(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get app name from ID
      const apps = await applicationService.listApplications();
      const app = apps.find((a) => a.id.toString() === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      const variables = await envVarService.getEnvVars(app.name);
      res.json({ variables });
    } catch (error: any) {
      console.error('Error reading env vars:', error);
      res.status(500).json({ error: error.message || 'Failed to read environment variables' });
    }
  }

  /**
   * POST /api/applications/:id/env-vars
   * Add or update environment variable
   */
  async setEnvVar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { key, value } = req.body;

      if (!key || value === undefined) {
        res.status(400).json({ error: 'Key and value are required' });
        return;
      }

      // Get app name from ID
      const apps = await applicationService.listApplications();
      const app = apps.find((a) => a.id.toString() === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      const variable = await envVarService.setEnvVar({ app: app.name, key, value });

      res.json({
        message: 'Environment variable saved successfully',
        variable,
      });
    } catch (error: any) {
      console.error('Error saving env var:', error);
      res.status(500).json({ error: error.message || 'Failed to save environment variable' });
    }
  }

  /**
   * DELETE /api/applications/:id/env-vars/:key
   * Delete an environment variable
   */
  async deleteEnvVar(req: Request, res: Response): Promise<void> {
    try {
      const { id, key } = req.params;

      // Get app name from ID
      const apps = await applicationService.listApplications();
      const app = apps.find((a) => a.id.toString() === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      await envVarService.deleteEnvVar(app.name, key);

      res.json({
        message: 'Environment variable deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting env var:', error);
      res.status(500).json({ error: error.message || 'Failed to delete environment variable' });
    }
  }
}

export const envVarController = new EnvVarController();
