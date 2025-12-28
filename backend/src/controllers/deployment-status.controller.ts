import { Request, Response } from 'express';
import { deploymentStatusService } from '../services/deployment-status.service';
import { applicationService } from '../services/application.service';
import { appRegistryService } from '../services/app-registry.service';

class DeploymentStatusController {
  /**
   * Get deployment status for an application by ID
   */
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get app name from PM2 by ID
      const apps = await applicationService.listApplications();
      const app = apps.find((a) => a.id.toString() === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      const status = await deploymentStatusService.getStatus(app.name);
      res.json({ status });
    } catch (error) {
      console.error('Error getting deployment status:', error);
      res.status(500).json({ error: 'Failed to get deployment status' });
    }
  }

  /**
   * Clear deployment status for an application by ID
   */
  async clearStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get app name from PM2 by ID
      const apps = await applicationService.listApplications();
      const app = apps.find((a) => a.id.toString() === id);

      if (!app) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      await deploymentStatusService.clearStatus(app.name);
      res.json({ message: 'Deployment status cleared successfully' });
    } catch (error) {
      console.error('Error clearing deployment status:', error);
      res.status(500).json({ error: 'Failed to clear deployment status' });
    }
  }
}

export const deploymentStatusController = new DeploymentStatusController();
