import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/database';

export interface AdminTokenPayload {
  adminId: string;
  username: string;
  email: string;
  roleId: string;
  roleName: string;
  permissions: string[];
  tokenVersion?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
  admin?: AdminTokenPayload;
}

/**
 * Middleware untuk memverifikasi token JWT Admin pada header Authorization
 */
export const verifyAuthToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
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

    const decoded = jwt.verify(token, secret) as any;

    // Jika payload adalah token Admin
    if (decoded.adminId) {
      // Validasi langsung ke database untuk memastikan akun admin masih aktif
      const adminInDb = await prisma.admin.findUnique({
        where: { id: decoded.adminId },
        include: { role: true },
      });

      if (!adminInDb || !adminInDb.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'Akun admin telah dinonaktifkan atau tidak ditemukan.',
        });
      }
      if (Number(decoded.tokenVersion ?? 0) !== adminInDb.tokenVersion) {
        return res.status(401).json({
          status: 'error',
          message: 'Sesi admin telah dicabut oleh Superadmin. Silakan login kembali.',
        });
      }

      const permissions = Array.isArray(adminInDb.role.permissions)
        ? (adminInDb.role.permissions as string[])
        : [];

      req.admin = {
        adminId: adminInDb.id,
        username: adminInDb.username,
        email: adminInDb.email,
        roleId: adminInDb.roleId,
        roleName: adminInDb.role.name,
        permissions,
      };

      // Kompatibilitas mundur
      req.user = {
        userId: adminInDb.id,
        email: adminInDb.email,
        role: adminInDb.role.name,
      };

      return next();
    }

    // Jika payload adalah token User biasa (pemesan)
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Sesi kedaluwarsa atau token tidak valid. Silakan login kembali.',
    });
  }
};

/**
 * Middleware khusus untuk memverifikasi bahwa akun yang login adalah Admin aktif
 */
export const verifyAdminRole = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
  if (!req.admin) {
    return res.status(403).json({
      status: 'error',
      message: 'Akses ditolak: Anda tidak memiliki hak akses administrator.',
    });
  }
  return next();
};

/**
 * Middleware untuk memverifikasi hak akses spesifik (Granular RBAC & Page-Based RBAC)
 * Contoh: requirePermission('events:create'), requirePermission('orders:update', 'page:orders')
 */
export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
    if (!req.admin) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak: Autentikasi admin diperlukan.',
      });
    }

    const { permissions, roleName } = req.admin;

    // Hanya role SUPERADMIN yang memiliki akses tak terbatas.
    if (roleName === 'SUPERADMIN') {
      return next();
    }

    // Evaluasi apakah admin memiliki minimal salah satu hak akses yang dipersyaratkan
    const hasAccess = requiredPermissions.some((perm) => {
      // 1. Izin langsung cocok
      if (permissions.includes(perm)) return true;

      // 2. Wildcard kategori (misal 'events:*' cocok untuk 'events:read')
      const category = perm.split(':')[0];
      if (permissions.includes(`${category}:*`)) return true;

      return false;
    });

    if (hasAccess) {
      return next();
    }

    return res.status(403).json({
      status: 'error',
      message: `Akses ditolak: Role '${roleName}' tidak memiliki izin '${requiredPermissions.join(' / ')}'.`,
    });
  };
};

/**
 * Middleware khusus akun dengan role SUPERADMIN
 */
export const requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
  if (!req.admin) {
    return res.status(403).json({
      status: 'error',
      message: 'Akses ditolak: Autentikasi admin diperlukan.',
    });
  }

  const { roleName } = req.admin;
  const isAuthorized = roleName === 'SUPERADMIN';

  if (!isAuthorized) {
    return res.status(403).json({
      status: 'error',
      message: 'Akses ditolak: Operasi ini hanya diizinkan untuk SUPERADMIN.',
    });
  }
  return next();
};
