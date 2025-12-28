import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { User, LoginDto, AuthResponse, UserPayload } from '../types/auth.types';

// Mock user database (replace with real database)
const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: '$2a$10$KpL/TA8jx5btO.4Zrv.AdOr7lU0GAAamA4AA8opgyBjqo/qqXHL9u', // "admin123"
    role: 'admin',
  },
];

export class AuthService {
  /**
   * Find user by username
   */
  private findUserByUsername(username: string): User | undefined {
    return users.find((u) => u.username === username);
  }

  /**
   * Verify password
   */
  private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate JWT token
   */
  private generateToken(payload: UserPayload): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  /**
   * Login user and return token
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const { username, password } = data;

    // Find user
    const user = this.findUserByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const validPassword = await this.verifyPassword(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}

export const authService = new AuthService();
