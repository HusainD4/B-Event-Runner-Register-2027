import type { Request, Response } from 'express';
import prisma from '../config/database';
import { emitStockUpdate } from '../sockets/index';
import { sendOrderNotification } from '../services/notification.service';
import { queueAutomaticPdfDeliveries } from '../services/pdf-delivery.service';

function amountInMinorUnits(value: unknown): bigint | null {
  const amount = String(value);
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(amount);
  if (!match) return null;
  return BigInt(match[1]) * 100n + BigInt((match[2] || '').padEnd(2, '0') || '0');
}

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

    if (amountInMinorUnits(gross_amount) !== amountInMinorUnits(order.totalAmount)) {
      console.error(`[WEBHOOK SECURITY] Nominal Midtrans tidak cocok untuk order ${order.id}.`);
      return res.status(403).json({ status: 'error', message: 'Nominal transaksi tidak cocok dengan pesanan.' });
    }

    let requestedStatus: typeof order.status | null = null;

    // Tentukan status berdasarkan respons Midtrans
    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        requestedStatus = 'PENDING';
      } else if (fraud_status === 'accept') {
        requestedStatus = 'SETTLEMENT';
      }
    } else if (transaction_status === 'settlement') {
      requestedStatus = 'SETTLEMENT';
    } else if (transaction_status === 'pending') {
      requestedStatus = 'PENDING';
    } else if (transaction_status === 'deny') {
      requestedStatus = 'DENY';
    } else if (transaction_status === 'expire') {
      requestedStatus = 'EXPIRE';
    } else if (transaction_status === 'cancel') {
      requestedStatus = 'CANCEL';
    } else if (transaction_status === 'refund') {
      requestedStatus = 'REFUND';
    }

    // Gunakan transaksi database untuk memperbarui status order & mengembalikan kuota jika dibatalkan/kadaluarsa
    const result = await prisma.$transaction(async (tx) => {
      const currentStatus = order.status;
      const settledStatuses = ['SETTLEMENT', 'CAPTURE'];
      const closedStatuses = ['CANCEL', 'EXPIRE', 'DENY', 'REFUND'];
      const lateSettlement = !!requestedStatus && settledStatuses.includes(requestedStatus) &&
        closedStatuses.includes(currentStatus);
      const mayTransition = requestedStatus !== null &&
        ((currentStatus === 'PENDING' &&
          ['PENDING', 'SETTLEMENT', 'CANCEL', 'EXPIRE', 'DENY'].includes(requestedStatus)) ||
          (settledStatuses.includes(currentStatus) && requestedStatus === 'REFUND'));
      const nextStatus = lateSettlement || !mayTransition || !requestedStatus || requestedStatus === currentStatus
        ? currentStatus
        : requestedStatus;
      let changed = false;

      const stockUpdates: Array<{ eventId: string; stock: number }> = [];
      if (nextStatus !== currentStatus) {
        const update = await tx.order.updateMany({
          where: { id: order.id, status: currentStatus },
          data: { status: nextStatus },
        });
        changed = update.count === 1;
      }

      if (changed && currentStatus === 'PENDING' && ['CANCEL', 'EXPIRE', 'DENY'].includes(nextStatus)) {
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

      if (changed && ['SETTLEMENT', 'CAPTURE', 'CANCEL', 'EXPIRE', 'DENY', 'REFUND'].includes(nextStatus)) {
        await tx.appSetting.deleteMany({ where: { key: `payment_expiry_${order.id}` } });
      }
      if (changed && nextStatus === 'SETTLEMENT') {
        await queueAutomaticPdfDeliveries(tx, order.id);
      }

      // Catat log aktivitas webhook
      await tx.log.create({
        data: {
          action: 'WEBHOOK_NOTIFICATION_RECEIVED',
          description: lateSettlement
            ? `PEMERIKSAAN MANUAL: Midtrans melaporkan pembayaran ${requestedStatus} untuk order ${order_id} yang sudah berstatus ${currentStatus}. Kuota tidak dibuka kembali otomatis.`
            : `Midtrans webhook untuk order ${order_id}: ${changed ? `status menjadi ${nextStatus}` : `status tetap ${currentStatus}`}.`,
          entityType: 'Order',
          entityId: order.id,
          metadata: { transaction_status, fraud_status, gross_amount },
        },
      });
      return { stockUpdates, changed, nextStatus };
    });
    for (const update of result.stockUpdates) emitStockUpdate(update.eventId, update.stock);

    // Only the transaction that changes the order may trigger a notification.
    if (result.changed && result.nextStatus === 'SETTLEMENT') {
      sendOrderNotification({ orderId: order.id, type: 'PAID' }).catch((err) =>
        console.warn('⚠️ Webhook notification dispatch failed:', err.message)
      );
    } else if (result.changed && ['CANCEL', 'EXPIRE', 'DENY'].includes(result.nextStatus)) {
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
