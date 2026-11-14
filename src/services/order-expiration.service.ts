import prisma from '../config/database';
import { coreApi } from '../config/midtrans';
import { emitDataChanged, emitStockUpdate } from '../sockets/index';
import { queueAutomaticPdfDeliveries } from './pdf-delivery.service';
import { sendOrderNotification } from './notification.service';

const EXPIRY_KEY_PREFIX = 'payment_expiry_';

const activeExpirations = new Set<string>();

export async function expirePendingOrders(orderId?: string): Promise<void> {
  const pendingOrders = await prisma.order.findMany({
    where: { status: 'PENDING', ...(orderId ? { id: orderId } : {}) },
    select: {
      id: true,
      midtransOrderId: true,
      createdAt: true,
      participants: { select: { eventId: true } },
    },
  });
  if (pendingOrders.length === 0) return;

  const expirySettings = await prisma.appSetting.findMany({
    where: { key: { in: pendingOrders.map(order => `${EXPIRY_KEY_PREFIX}${order.id}`) } },
    select: { key: true, value: true },
  });
  const expiryByOrder = new Map(expirySettings.map(setting => [setting.key, setting.value]));
  const timerSetting = await prisma.appSetting.findUnique({ where: { key: 'payment_timer_minutes' } });
  const legacyTimerMinutes = Math.max(5, Number.parseInt(timerSetting?.value || '30', 10) || 30);
  const now = Date.now();

  for (const order of pendingOrders) {
    if (activeExpirations.has(order.id)) continue;
    const savedExpiry = expiryByOrder.get(`${EXPIRY_KEY_PREFIX}${order.id}`);
    const expiresAt = savedExpiry
      ? new Date(savedExpiry).getTime()
      : order.createdAt.getTime() + legacyTimerMinutes * 60_000;
    if (!Number.isFinite(expiresAt) || expiresAt > now) continue;

    activeExpirations.add(order.id);
    try {
    const midtransOrderId = order.midtransOrderId;
    let remoteStatus = 'pending';
    if (midtransOrderId && !midtransOrderId.startsWith('OFFLINE-')) {
      try {
        const status = await coreApi.transaction.status(midtransOrderId);
        remoteStatus = String(status?.transaction_status || '').toLowerCase();
        if (remoteStatus === 'settlement' || (remoteStatus === 'capture' && status?.fraud_status === 'accept')) {
          const updated = await prisma.$transaction(async tx => {
            const result = await tx.order.updateMany({
              where: { id: order.id, status: 'PENDING' },
              data: { status: 'SETTLEMENT' },
            });
            if (result.count) {
              await queueAutomaticPdfDeliveries(tx, order.id);
              await tx.appSetting.deleteMany({ where: { key: `${EXPIRY_KEY_PREFIX}${order.id}` } });
            }
            return result;
          });
          if (updated.count > 0) {
            emitDataChanged(['dashboard', 'orders', 'participants', 'logs']);
            sendOrderNotification({ orderId: order.id, type: 'PAID' })
              .catch(error => console.warn('[ORDER EXPIRY] Gagal mengirim notifikasi pembayaran:', error));
          }
          continue;
        }

        if (remoteStatus === 'pending') {
          const cancelled = await coreApi.transaction.cancel(midtransOrderId);
          remoteStatus = String(cancelled?.transaction_status || '').toLowerCase();
          if (!['expire', 'cancel', 'deny'].includes(remoteStatus)) {
            console.warn(`[ORDER EXPIRY] Pembatalan ${midtransOrderId} belum terkonfirmasi; pembatalan lokal ditunda.`);
            continue;
          }
        } else if (!['expire', 'cancel', 'deny'].includes(remoteStatus)) {
          console.warn(`[ORDER EXPIRY] Status Midtrans ${remoteStatus || 'unknown'} untuk ${midtransOrderId}; pembatalan lokal ditunda.`);
          continue;
        }
      } catch (error) {
        console.error(`[ORDER EXPIRY] Gagal membatalkan/memeriksa transaksi Midtrans ${midtransOrderId}:`, error);
        continue;
      }
    }

    const restoredStock: Array<{ eventId: string; stock: number }> = [];
    try {
      const expired = await prisma.$transaction(async tx => {
        const update = await tx.order.updateMany({
          where: { id: order.id, status: 'PENDING' },
          data: { status: 'EXPIRE' },
        });
        if (update.count !== 1) return false;

        const counts = new Map<string, number>();
        for (const participant of order.participants) {
          counts.set(participant.eventId, (counts.get(participant.eventId) || 0) + 1);
        }
        for (const [eventId, count] of counts) {
          const event = await tx.event.update({
            where: { id: eventId },
            data: { stock: { increment: count } },
            select: { stock: true },
          });
          restoredStock.push({ eventId, stock: event.stock });
        }

        await tx.log.create({
          data: {
            action: 'ORDER_EXPIRED',
            description: `Order ${order.id} dibatalkan otomatis karena expired time.`,
            entityType: 'Order',
            entityId: order.id,
            metadata: {
              reason: 'expired time',
              midtransOrderId,
              expiresAt: new Date(expiresAt).toISOString(),
              midtransStatus: remoteStatus,
            },
          },
        });
        return true;
      });

      if (expired) {
        await prisma.appSetting.deleteMany({ where: { key: `${EXPIRY_KEY_PREFIX}${order.id}` } });
        for (const event of restoredStock) emitStockUpdate(event.eventId, event.stock);
        emitDataChanged(['dashboard', 'orders', 'participants', 'racepack', 'logs', 'public:events']);
      }
    } catch (error) {
      console.error(`[ORDER EXPIRY] Gagal menyimpan pembatalan untuk order ${order.id}:`, error);
    }
    } finally {
      activeExpirations.delete(order.id);
    }
  }
}
