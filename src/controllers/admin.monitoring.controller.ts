import type { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { disconnectAdmins, emitAdminEvent, getConnectedAdminIds } from '../sockets';

const targetSchema = z.object({
  roleId: z.string().uuid('Role tidak valid.'),
  adminId: z.string().uuid('Akun admin tidak valid.'),
});

export const getRoleMonitoring = async (_req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const [roles, connectedAdminIds] = await Promise.all([
      prisma.role.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          admins: {
            orderBy: { fullName: 'asc' },
            select: { id: true, username: true, fullName: true, isActive: true },
          },
        },
      }),
      getConnectedAdminIds(),
    ]);

    return res.status(200).json({
      status: 'success',
      data: roles.map(role => ({
        id: role.id,
        name: role.name,
        totalAdmins: role.admins.length,
        activeAdmins: role.admins.filter(admin => admin.isActive).length,
        onlineAdmins: role.admins.filter(admin => connectedAdminIds.has(admin.id)).length,
        admins: role.admins.map(admin => ({
          id: admin.id,
          username: admin.username,
          fullName: admin.fullName,
          isActive: admin.isActive,
          isOnline: connectedAdminIds.has(admin.id),
        })),
      })),
    });
  } catch (error) {
    console.error('Gagal memuat pemantauan role admin:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memuat pemantauan role admin.' });
  }
};

export const forceLogoutAdmin = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parsedTarget = targetSchema.safeParse(req.params);
    if (!parsedTarget.success) {
      return res.status(400).json({ status: 'error', message: parsedTarget.error.issues[0]?.message || 'Role atau akun tidak valid.' });
    }

    const role = await prisma.role.findUnique({
      where: { id: parsedTarget.data.roleId },
      select: { id: true, name: true },
    });
    if (!role) {
      return res.status(404).json({ status: 'error', message: 'Role tidak ditemukan.' });
    }
    if (role.name === 'SUPERADMIN') {
      return res.status(403).json({ status: 'error', message: 'Akun dengan role SUPERADMIN tidak dapat di-logout paksa.' });
    }
    if (!req.admin) {
      return res.status(401).json({ status: 'error', message: 'Autentikasi admin diperlukan.' });
    }
    const actingAdmin = req.admin;

    const targetAdmin = await prisma.admin.findUnique({
      where: { id: parsedTarget.data.adminId },
      select: { id: true, fullName: true, isActive: true, roleId: true },
    });
    if (!targetAdmin || targetAdmin.roleId !== role.id) {
      return res.status(404).json({ status: 'error', message: 'Akun tidak ditemukan pada role yang dipilih.' });
    }
    if (targetAdmin.id === actingAdmin.adminId) {
      return res.status(403).json({ status: 'error', message: 'Anda tidak dapat mencabut sesi akun sendiri.' });
    }
    if (!targetAdmin.isActive) {
      return res.status(409).json({ status: 'error', message: 'Akun admin tidak aktif.' });
    }

    const revoked = await prisma.$transaction(async transaction => {
      const updateResult = await transaction.admin.updateMany({
        where: { id: targetAdmin.id, roleId: role.id, isActive: true },
        data: { tokenVersion: { increment: 1 } },
      });
      if (updateResult.count === 0) return false;
      await transaction.log.create({
        data: {
          action: 'ADMIN_FORCE_LOGOUT',
          description: `Superadmin ${actingAdmin.username} mencabut sesi ${targetAdmin.fullName} pada role ${role.name}.`,
          adminId: actingAdmin.adminId,
          entityType: 'Admin',
          entityId: targetAdmin.id,
        },
      });
      return true;
    });

    if (!revoked) {
      return res.status(409).json({ status: 'error', message: 'Sesi akun tidak dapat dicabut karena status akun berubah.' });
    }

    await disconnectAdmins([targetAdmin.id]);
    emitAdminEvent('admin:presence_changed', {});
    emitAdminEvent('admin:data_changed', { topics: ['admins'], updatedAt: new Date().toISOString() });

    return res.status(200).json({
      status: 'success',
      message: `Sesi ${targetAdmin.fullName} (${role.name}) berhasil dicabut.`,
      data: { roleId: role.id, roleName: role.name, adminId: targetAdmin.id, adminName: targetAdmin.fullName },
    });
  } catch (error) {
    console.error('Gagal mencabut sesi admin:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mencabut sesi admin.' });
  }
};
