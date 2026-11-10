import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/database';
import { env } from '../config/env';
import { verifyPassword, hashPassword } from '../utils/password';
import type { AuthenticatedRequest } from '../middlewares/auth';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Username atau email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
});

/**
 * Login untuk Administrator / Staff
 */
export const adminLogin = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Data login tidak valid.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const { identifier, password } = parseResult.data;

    // Cari admin berdasarkan email atau username
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      include: {
        role: true,
      },
    });

    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Username / Email atau password salah.',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Akun Anda dinonaktifkan. Silakan hubungi Superadmin.',
      });
    }

    // Verifikasi password secara aman
    const isPasswordValid = await verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Username / Email atau password salah.',
      });
    }

    const permissions = Array.isArray(admin.role.permissions)
      ? (admin.role.permissions as string[])
      : [];

    const tokenPayload = {
      adminId: admin.id,
      username: admin.username,
      email: admin.email,
      roleId: admin.roleId,
      roleName: admin.role.name,
      permissions,
    };

    const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Catat log login
    await prisma.log.create({
      data: {
        action: 'ADMIN_LOGIN',
        description: `Admin ${admin.username} (${admin.role.name}) berhasil login.`,
        adminId: admin.id,
        entityType: 'Admin',
        entityId: admin.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil.',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName,
          role: {
            id: admin.role.id,
            name: admin.role.name,
            description: admin.role.description,
            permissions,
          },
        },
      },
    });
  } catch (error: any) {
    console.error('🚨 [ADMIN LOGIN ERROR]:', error);
    if (error?.message?.includes('Can\'t reach database server') || error?.name === 'PrismaClientInitializationError') {
      return res.status(503).json({
        status: 'error',
        message: 'Tidak dapat terhubung ke MySQL di localhost:3306. Pastikan modul MySQL di XAMPP Control Panel sudah dinyalakan (Start).',
      });
    }
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Terjadi kesalahan pada server saat proses login.',
    });
  }
};

/**
 * Mengambil profil admin yang sedang login saat ini
 */
export const getAdminProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.admin) {
      return res.status(401).json({ status: 'error', message: 'Tidak terotentikasi.' });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.adminId },
      include: { role: true },
    });

    if (!admin) {
      return res.status(404).json({ status: 'error', message: 'Admin tidak ditemukan.' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        isActive: admin.isActive,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error('🚨 [ADMIN PROFILE ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil profil admin.' });
  }
};

/**
 * Ganti password admin sendiri
 */
export const changeAdminPassword = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.admin) {
      return res.status(401).json({ status: 'error', message: 'Tidak terotentikasi.' });
    }

    const parseResult = changePasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const { currentPassword, newPassword } = parseResult.data;

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.adminId },
    });

    if (!admin) {
      return res.status(404).json({ status: 'error', message: 'Admin tidak ditemukan.' });
    }

    const isCurrentValid = await verifyPassword(currentPassword, admin.password);
    if (!isCurrentValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Password saat ini salah.',
      });
    }

    const newHashedPassword = await hashPassword(newPassword);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: newHashedPassword },
    });

    await prisma.log.create({
      data: {
        action: 'ADMIN_CHANGE_PASSWORD',
        description: `Admin ${admin.username} memperbarui passwordnya sendiri.`,
        adminId: admin.id,
        entityType: 'Admin',
        entityId: admin.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Password berhasil diubah. Silakan gunakan password baru pada sesi berikutnya.',
    });
  } catch (error) {
    console.error('🚨 [CHANGE PASSWORD ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengubah password.' });
  }
};

