import type { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';

const updateUserSchema = z.object({
  fullName: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(8).optional(),
});

export const getAdminUsers = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const search = req.query.search ? String(req.query.search).trim() : undefined;

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { phoneNumber: { contains: search } },
      ];
    }

    const [total, users]: [number, any[]] = await Promise.all([
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: whereClause,
        include: {
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: users.map((u) => ({ ...u, totalOrders: u._count?.orders || 0 })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('🚨 [GET USERS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil data user pemesan.' });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const user: any = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            participants: {
              include: { event: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User pemesan tidak ditemukan.' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...user,
        orders: (user.orders || []).map((o: any) => ({
          ...o,
          totalAmount: Number(o.totalAmount),
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil detail user pemesan.' });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const parseResult = updateUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi data gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'User tidak ditemukan.' });
    }

    if (parseResult.data.email && parseResult.data.email !== existing.email) {
      const emailExists = await prisma.user.findUnique({ where: { email: parseResult.data.email } });
      if (emailExists) {
        return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar pada user lain.' });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: parseResult.data,
    });

    await prisma.log.create({
      data: {
        action: 'USER_UPDATE',
        description: `Admin memperbarui data user pemesan: ${updated.email}`,
        adminId: req.admin?.adminId,
        entityType: 'User',
        entityId: updated.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Data user pemesan berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui user pemesan.' });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const user: any = await prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User tidak ditemukan.' });
    }

    if (user._count?.orders > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Tidak dapat menghapus user karena memiliki ${user._count.orders} riwayat transaksi aktif. Hapus transaksi terkait terlebih dahulu.`,
      });
    }

    await prisma.user.delete({ where: { id } });

    await prisma.log.create({
      data: {
        action: 'USER_DELETE',
        description: `Admin menghapus akun user pemesan: ${user.email}`,
        adminId: req.admin?.adminId,
        entityType: 'User',
        entityId: id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `User '${user.fullName}' berhasil dihapus.`,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus user.' });
  }
};

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 30));
    const skip = (page - 1) * limit;

    const action = req.query.action ? String(req.query.action) : undefined;
    const entityType = req.query.entityType ? String(req.query.entityType) : undefined;

    const whereClause: any = {};
    if (action) whereClause.action = { contains: action };
    if (entityType) whereClause.entityType = entityType;

    const [total, logs] = await Promise.all([
      prisma.log.count({ where: whereClause }),
      prisma.log.findMany({
        where: whereClause,
        include: {
          admin: { select: { id: true, username: true, fullName: true, role: { select: { name: true } } } },
          user: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: logs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('🚨 [GET LOGS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil riwayat log aktivitas.' });
  }
};
