import { Request, Response } from 'express';
import { applicationService } from '../services/application.service';
import type { DeployApplicationDto } from '../types/application.types';

export class ApplicationController {
  /**
   * GET /api/applications
   * List all PM2 applications
   */
  async listApplications(req: Request, res: Response): Promise<void> {
    try {
      const applications = await applicationService.listApplications();
      res.json({ applications });
    } catch (error: any) {
      console.error('Error listing applications:', error);
      res.status(500).json({ error: error.message || 'Failed to list applications' });
    }
  }

  /**
   * POST /api/applications
   * Deploy a new application
   */
  async deployApplication(req: Request, res: Response): Promise<void> {
    try {
      const { name, repository, branch, port }: DeployApplicationDto = req.body;

      if (!name || !repository) {
        res.status(400).json({ error: 'Name and repository are required' });
        return;
      }

      const application = await applicationService.deployApplication({
        name,
        repository,
        branch,
        port,
      });

      res.json({
        message: 'Application deployed successfully',
        application,
      });
    } catch (error: any) {
      console.error('Error deploying application:', error);
      res.status(500).json({ error: error.message || 'Failed to deploy application' });
    }
  }

  /**
   * POST /api/applications/:id/start
   * Start an application
   */
  async startApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await applicationService.startApplication(id);
      res.json({ message: 'Application started successfully' });
    } catch (error: any) {
      console.error('Error starting application:', error);
      res.status(500).json({ error: error.message || 'Failed to start application' });
    }
  }

  /**
   * POST /api/applications/:id/stop
   * Stop an application
   */
  async stopApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await applicationService.stopApplication(id);
      res.json({ message: 'Application stopped successfully' });
    } catch (error: any) {
      console.error('Error stopping application:', error);
      res.status(500).json({ error: error.message || 'Failed to stop application' });
    }
  }

  /**
   * POST /api/applications/:id/restart
   * Restart an application
   */
  async restartApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await applicationService.restartApplication(id);
      res.json({ message: 'Application restarted successfully' });
    } catch (error: any) {
      console.error('Error restarting application:', error);
      res.status(500).json({ error: error.message || 'Failed to restart application' });
    }
  }

  /**
   * DELETE /api/applications/:id
   * Remove an application
   */
  async removeApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await applicationService.removeApplication(id);
      res.json({ message: 'Application removed successfully' });
    } catch (error: any) {
      console.error('Error removing application:', error);
      res.status(500).json({ error: error.message || 'Failed to remove application' });
    }
  }

  /**
   * GET /api/applications/:id/logs
   * Get logs for an application
   */
  async getApplicationLogs(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lines = parseInt(req.query.lines as string) || 100;
      const logs = await applicationService.getApplicationLogs(id, lines);
      res.json({ logs });
    } catch (error: any) {
      console.error('Error getting application logs:', error);
      res.status(500).json({ error: error.message || 'Failed to get application logs' });
    }
  }
}

export const applicationController = new ApplicationController();
