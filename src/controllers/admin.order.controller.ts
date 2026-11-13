import type { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { coreApi } from '../config/midtrans';
import { queueAutomaticPdfDeliveries } from '../services/pdf-delivery.service';

const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'SETTLEMENT', 'CAPTURE', 'CANCEL', 'EXPIRE', 'DENY', 'REFUND']),
  reason: z.string().optional(),
});

export const getAdminOrders = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const status = req.query.status as any;
    const search = req.query.search ? String(req.query.search).trim() : undefined;

    const whereClause: any = {};
    if (status) whereClause.status = status;

    if (search) {
      whereClause.OR = [
        { midtransOrderId: { contains: search } },
        { id: { contains: search } },
        { user: { fullName: { contains: search } } },
        { user: { email: { contains: search } } },
        { user: { phoneNumber: { contains: search } } },
      ];
    }

    const [total, orders]: [number, any[]] = await Promise.all([
      prisma.order.count({ where: whereClause }),
      prisma.order.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, fullName: true, email: true, phoneNumber: true } },
          _count: { select: { participants: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const formatted = orders.map((o) => ({
      ...o,
      totalAmount: Number(o.totalAmount),
      participantsCount: o._count?.participants || 0,
    }));

    return res.status(200).json({
      status: 'success',
      data: formatted,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('🚨 [GET ORDERS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil data pesanan.' });
  }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        participants: {
          include: {
            event: true,
            jersey: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        ...order,
        totalAmount: Number(order.totalAmount),
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil detail pesanan.' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const parseResult = updateOrderStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Status order tidak valid.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const { status, reason } = parseResult.data;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
    }

    const updated = await prisma.$transaction(async tx => {
      const result = await tx.order.update({
        where: { id },
        data: { status },
        include: { user: true },
      });
      if (['SETTLEMENT', 'CAPTURE'].includes(status) && !['SETTLEMENT', 'CAPTURE'].includes(existing.status)) {
        await queueAutomaticPdfDeliveries(tx, id);
      }
      return result;
    });

    await prisma.log.create({
      data: {
        action: 'ORDER_STATUS_UPDATE',
        description: `Admin (${req.admin?.username}) mengubah status Order ${id} dari ${existing.status} ke ${status}. Alasan: ${reason || '-'}`,
        adminId: req.admin?.adminId,
        entityType: 'Order',
        entityId: id,
        metadata: { oldStatus: existing.status, newStatus: status, reason },
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Status pesanan berhasil diubah menjadi ${status}.`,
      data: { ...updated, totalAmount: Number(updated.totalAmount) },
    });
  } catch (error) {
    console.error('🚨 [UPDATE ORDER STATUS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengubah status pesanan.' });
  }
};

export const deleteOrder = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const existing: any = await prisma.order.findUnique({
      where: { id },
      include: { _count: { select: { participants: true } } },
    });

    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
    }

    await prisma.order.delete({ where: { id } });

    await prisma.log.create({
      data: {
        action: 'ORDER_DELETE',
        description: `Admin menghapus Order ${id} (Status: ${existing.status}) beserta ${existing._count?.participants || 0} data peserta di dalamnya.`,
        adminId: req.admin?.adminId,
        entityType: 'Order',
        entityId: id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Pesanan dan peserta terkait berhasil dihapus.',
    });
  } catch (error) {
    console.error('🚨 [DELETE ORDER ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus pesanan.' });
  }
};

/**
 * Controller khusus divisi KEUANGAN: Ringkasan pendapatan, breakdown per event, status settlement
 */
export const getFinancialSummary = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const statusGroups = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { totalAmount: true },
    });

    let totalSettledRevenue = 0;
    let pendingPotentialRevenue = 0;

    const breakdownByStatus = statusGroups.map((group) => {
      const sum = Number(group._sum.totalAmount || 0);
      if (group.status === 'SETTLEMENT' || group.status === 'CAPTURE') {
        totalSettledRevenue += sum;
      } else if (group.status === 'PENDING') {
        pendingPotentialRevenue += sum;
      }
      return {
        status: group.status,
        count: group._count.id,
        totalAmount: sum,
      };
    });

    const events = await prisma.event.findMany({
      include: {
        participants: {
          where: { order: { status: 'SETTLEMENT' } },
        },
      },
    });

    const revenueByEvent = events.map((ev) => {
      const paidParticipants = (ev.participants || []).length;
      const revenue = paidParticipants * Number(ev.price);
      return {
        eventId: ev.id,
        ticketName: ev.ticketName,
        category: ev.category,
        price: Number(ev.price),
        paidParticipants,
        totalRevenue: revenue,
      };
    });

    return res.status(200).json({
      status: 'success',
      data: {
        totalSettledRevenue,
        pendingPotentialRevenue,
        breakdownByStatus,
        revenueByEvent,
      },
    });
  } catch (error) {
    console.error('🚨 [FINANCE SUMMARY ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil ringkasan keuangan.' });
  }
};

/**
 * Controller untuk mensinkronkan seluruh order PENDING dengan status resmi Midtrans Core API
 */
export const syncAllMidtransOrders = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        midtransOrderId: { not: null },
        NOT: { midtransOrderId: { startsWith: 'OFFLINE-' } },
      },
      include: {
        participants: {
          include: {
            event: { include: { bibConfig: true } },
          },
        },
      },
    });

    let updatedSettlement = 0;
    let updatedCancelled = 0;

    for (const order of pendingOrders) {
      if (!order.midtransOrderId) continue;
      try {
        const statusRes = await coreApi.transaction.status(order.midtransOrderId);
        const midtransStatus = statusRes?.transaction_status?.toLowerCase();
        const fraudStatus = statusRes?.fraud_status || 'accept';

        if (midtransStatus === 'settlement' || (midtransStatus === 'capture' && fraudStatus === 'accept')) {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: order.id },
              data: { status: 'SETTLEMENT' },
            });
            await queueAutomaticPdfDeliveries(tx, order.id);

            for (const p of order.participants || []) {
              if (!p.bibNumber) {
                const prefix = p.event?.category === '10K' ? '10' : '05';
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                const bibNum = `${prefix}-${randomNum}`;

                await tx.participant.update({
                  where: { id: p.id },
                  data: { bibNumber: bibNum },
                });
              }
            }

            await tx.log.create({
              data: {
                action: 'ORDER_SYNC_SETTLEMENT',
                description: `Order ${order.id} berhasil disinkronkan ke SETTLEMENT dari Midtrans Core API.`,
                entityType: 'Order',
                entityId: order.id,
              },
            });
          });
          updatedSettlement++;
        } else if (['cancel', 'deny', 'expire'].includes(midtransStatus)) {
          const newStatus = midtransStatus === 'expire' ? 'EXPIRE' : 'CANCEL';
          await prisma.order.update({
            where: { id: order.id },
            data: { status: newStatus },
          });
          updatedCancelled++;
        }
      } catch (err: any) {
        console.warn('[SYNC ALL MIDTRANS] Gagal memproses order:', order.id, err.message);
      }
    }

    return res.status(200).json({
      status: 'success',
      message: `Sinkronisasi Midtrans selesai: ${updatedSettlement} order LUNAS (Settlement), ${updatedCancelled} order dibatalkan/kadaluarsa.`,
      data: {
        checkedCount: pendingOrders.length,
        updatedSettlement,
        updatedCancelled,
      },
    });
  } catch (error: any) {
    console.error('🚨 [SYNC ALL MIDTRANS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
