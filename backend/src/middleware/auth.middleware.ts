import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: 'admin' | 'developer' | 'viewer';
  };
}

/**
 * Middleware to require authentication
 */
export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as AuthRequest['user'];
    req.user = decoded;

    next();
  } catch (error: any) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to require admin role
 */
export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // First authenticate
  requireAuth(req, res, () => {
    // Then check role
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  });
}

/**
 * Middleware to require admin or developer role
 */
export function requireDeveloper(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // First authenticate
  requireAuth(req, res, () => {
    // Then check role
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'developer') {
      return res.status(403).json({ error: 'Developer access required' });
    }

    next();
  });
}
