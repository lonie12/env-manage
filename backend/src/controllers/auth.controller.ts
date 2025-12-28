import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import type { LoginDto } from '../types/auth.types';
import type { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  /**
   * POST /api/auth/login
   * Login and get JWT token
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password }: LoginDto = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'Username and password required' });
        return;
      }

      const result = await authService.login({ username, password });
      res.json(result);
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.message === 'Invalid credentials') {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * GET /api/auth/me
   * Get current user info
   */
  getCurrentUser(req: AuthRequest, res: Response): void {
    res.json({ user: req.user });
  }

  /**
   * POST /api/auth/logout
   * Logout (client-side token removal)
   */
  logout(req: Request, res: Response): void {
    res.json({ message: 'Logged out successfully' });
  }
}

export const authController = new AuthController();
