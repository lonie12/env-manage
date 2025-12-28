import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', requireAuth, (req, res) => authController.getCurrentUser(req as any, res));
router.post('/logout', requireAuth, (req, res) => authController.logout(req, res));

export default router;
