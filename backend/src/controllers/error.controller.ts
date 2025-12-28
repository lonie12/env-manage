import { Request, Response } from 'express';
import { errorService } from '../services/error.service';
import { applicationService } from '../services/application.service';

export class ErrorController {
  /**
   * GET /api/applications/:id/errors
   * Get errors for an application
   */
  async getErrors(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get app name from ID
      const apps = await applicationService.listApplications();
      const app = apps.find((a) => a.id.toString() === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      const errors = await errorService.getErrors(app.name);
      res.json({ errors });
    } catch (error: any) {
      console.error('Error fetching errors:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch errors' });
    }
  }

  /**
   * DELETE /api/applications/:id/errors
   * Clear all errors for an application
   */
  async clearErrors(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get app name from ID
      const apps = await applicationService.listApplications();
      const app = apps.find((a) => a.id.toString() === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      await errorService.clearErrors(app.name);
      res.json({ message: 'Errors cleared successfully' });
    } catch (error: any) {
      console.error('Error clearing errors:', error);
      res.status(500).json({ error: error.message || 'Failed to clear errors' });
    }
  }
}

export const errorController = new ErrorController();
