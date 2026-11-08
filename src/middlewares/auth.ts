import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// Perluas interface Express Request agar mengenali properti user hasil dekode JWT
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware untuk memverifikasi token JWT Admin/User pada header Authorization
 */
export const verifyAuthToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Akses ditolak: Token autentikasi tidak ditemukan atau format salah.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = env.JWT_SECRET || 'fallback-secret';

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    return next();
  } catch (error) {
    console.error('🚨 [AUTH ERROR] Token tidak valid:', error);
    return res.status(403).json({
      status: 'error',
      message: 'Sesi kedaluwarsa atau token tidak valid. Silakan login kembali.',
    });
  }
};

/**
 * Middleware khusus untuk memverifikasi hak akses Admin
 */
export const verifyAdminRole = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Akses ditolak: Anda tidak memiliki hak akses administrator.',
    });
  }
  return next();
};