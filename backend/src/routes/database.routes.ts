import { Router } from 'express';
import { DatabaseController } from '../controllers/database.controller.js';

const router = Router();

// Get database status for an application
router.get('/:id/database/status', DatabaseController.getStatus);

// List migrations
router.get('/:id/database/migrations', DatabaseController.listMigrations);

// Execute database action (push, generate, migrate)
router.post('/:id/database/:action', DatabaseController.executeAction);

export default router;
