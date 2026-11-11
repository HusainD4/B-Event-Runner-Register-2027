import prisma from '../config/database';
import { coreApi } from '../config/midtrans';
import { emitDataChanged, emitStockUpdate } from '../sockets/index';

const EXPIRY_KEY_PREFIX = 'payment_expiry_';

export async function expirePendingOrders(): Promise<void> {
  const pendingOrders = await prisma.order.findMany({
    where: { status: 'PENDING' },
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
    const savedExpiry = expiryByOrder.get(`${EXPIRY_KEY_PREFIX}${order.id}`);
    const expiresAt = savedExpiry
      ? new Date(savedExpiry).getTime()
      : order.createdAt.getTime() + legacyTimerMinutes * 60_000;
    if (!Number.isFinite(expiresAt) || expiresAt > now) continue;

    const midtransOrderId = order.midtransOrderId;
    let remoteStatus = 'pending';
    if (midtransOrderId && !midtransOrderId.startsWith('OFFLINE-')) {
      try {
        const status = await coreApi.transaction.status(midtransOrderId);
        remoteStatus = String(status?.transaction_status || '').toLowerCase();
        if (remoteStatus === 'settlement' || remoteStatus === 'capture') {
          const updated = await prisma.order.updateMany({
            where: { id: order.id, status: 'PENDING' },
            data: { status: remoteStatus === 'capture' ? 'CAPTURE' : 'SETTLEMENT' },
          });
          await prisma.appSetting.deleteMany({ where: { key: `${EXPIRY_KEY_PREFIX}${order.id}` } });
          if (updated.count > 0) emitDataChanged(['dashboard', 'orders', 'participants', 'logs']);
          continue;
        }

        if (remoteStatus === 'pending') {
          await coreApi.transaction.cancel(midtransOrderId);
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
  }
}
