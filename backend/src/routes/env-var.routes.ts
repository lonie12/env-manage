import { Router } from 'express';
import { requireAuth, requireDeveloper } from '../middleware/auth.middleware';
import { envVarController } from '../controllers/env-var.controller';

const router = Router();

router.get('/', requireAuth, (req, res) => envVarController.getEnvVars(req, res));
router.post('/', requireDeveloper, (req, res) => envVarController.setEnvVar(req, res));

export default router;
