import type { Request, Response } from 'express';
import prisma from '../config/database';
import { emitStockUpdate } from '../sockets/index';
import { sendOrderNotification } from '../services/notification.service';

/**
 * Controller untuk menangani notifikasi webhook dari server Midtrans secara otomatis.
 */
export const handleMidtransWebhook = async (req: Request, res: Response): Promise<any> => {
  try {
    const notification = req.body;
    const { order_id, transaction_status, fraud_status, gross_amount } = notification;

    if (!order_id) {
      return res.status(400).json({ status: 'error', message: 'Order ID tidak ditemukan dalam payload webhook.' });
    }

    // Cari order berdasarkan midtransOrderId
    const order = await prisma.order.findUnique({
      where: { midtransOrderId: order_id },
      include: {
        participants: {
          include: { event: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ status: 'error', message: `Order dengan ID ${order_id} tidak ditemukan di database.` });
    }

    let newStatus: any = order.status;

    // Tentukan status berdasarkan respons Midtrans
    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        newStatus = 'PENDING';
      } else if (fraud_status === 'accept') {
        newStatus = 'SETTLEMENT';
      }
    } else if (transaction_status === 'settlement') {
      newStatus = 'SETTLEMENT';
    } else if (transaction_status === 'pending') {
      newStatus = 'PENDING';
    } else if (transaction_status === 'deny') {
      newStatus = 'DENY';
    } else if (transaction_status === 'expire') {
      newStatus = 'EXPIRE';
    } else if (transaction_status === 'cancel') {
      newStatus = 'CANCEL';
    } else if (transaction_status === 'refund') {
      newStatus = 'REFUND';
    }

    // Gunakan transaksi database untuk memperbarui status order & mengembalikan kuota jika dibatalkan/kadaluarsa
    const restoredStock = await prisma.$transaction(async (tx) => {
      const update = await tx.order.updateMany({
        where: { id: order.id, status: order.status },
        data: { status: newStatus },
      });

      const stockUpdates: Array<{ eventId: string; stock: number }> = [];
      if (update.count === 1 && order.status === 'PENDING' && ['CANCEL', 'EXPIRE', 'DENY'].includes(newStatus)) {
        const eventCounts = new Map<string, number>();
        for (const participant of order.participants) {
          eventCounts.set(participant.eventId, (eventCounts.get(participant.eventId) || 0) + 1);
        }
        for (const [eventId, count] of eventCounts) {
          const event = await tx.event.update({
            where: { id: eventId },
            data: { stock: { increment: count } },
            select: { stock: true },
          });
          stockUpdates.push({ eventId, stock: event.stock });
        }
      }

      if (['SETTLEMENT', 'CAPTURE', 'CANCEL', 'EXPIRE', 'DENY', 'REFUND'].includes(newStatus)) {
        await tx.appSetting.deleteMany({ where: { key: `payment_expiry_${order.id}` } });
      }

      // Catat log aktivitas webhook
      await tx.log.create({
        data: {
          action: 'WEBHOOK_NOTIFICATION_RECEIVED',
          description: `Midtrans webhook untuk order ${order_id} mengubah status menjadi ${newStatus}`,
          entityType: 'Order',
          entityId: order.id,
          metadata: { transaction_status, fraud_status, gross_amount },
        },
      });
      return stockUpdates;
    });
    for (const update of restoredStock) emitStockUpdate(update.eventId, update.stock);

    // Kirim notifikasi WhatsApp/Email secara asinkron
    if (newStatus === 'SETTLEMENT') {
      sendOrderNotification({ orderId: order.id, type: 'PAID' }).catch((err) =>
        console.warn('⚠️ Webhook notification dispatch failed:', err.message)
      );
    } else if (['CANCEL', 'EXPIRE', 'DENY'].includes(newStatus)) {
      sendOrderNotification({ orderId: order.id, type: 'CANCEL' }).catch((err) =>
        console.warn('⚠️ Webhook cancel notification dispatch failed:', err.message)
      );
    }

    return res.status(200).json({ status: 'success', message: 'Webhook berhasil diproses.' });
  } catch (error: any) {
    console.error('🚨 [WEBHOOK ERROR] Gagal memproses webhook Midtrans:', error);
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan internal pada server webhook.' });
  }
};
