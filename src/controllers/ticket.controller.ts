import type { Request, Response } from 'express';
import QRCode from 'qrcode';
import prisma from '../config/database';
import { emitStockUpdate } from '../sockets/index';
import { sendOrderNotification } from '../services/notification.service';
import { snap, coreApi } from '../config/midtrans';

import { getGlobalBibSettings, assignBibToParticipant } from '../services/bib.service';
import { generateSingleQrString, generateMasterQrString, decryptQrPayload } from '../services/qr-crypto.service';
import { loadRacepackInstructions } from '../services/racepack-instructions.service';
import { queueAutomaticPdfDeliveries } from '../services/pdf-delivery.service';
import { expirePendingOrders } from '../services/order-expiration.service';

/**
 * 1. PENCARIAN TIKET & STATUS OLEH PESERTA (PUBLIC)
 * Wajib validasi format input dan menggunakan EXACT MATCH (equals)
 * untuk mencegah kebocoran data tiket antar peserta.
 */
export const searchTickets = async (req: Request, res: Response): Promise<any> => {
  try {
    let rawQ = req.query.q ? String(req.query.q).trim() : '';
    const type = req.query.type ? String(req.query.type).trim() : 'all';

    if (!rawQ) {
      return res.status(400).json({
        status: 'error',
        message: 'Masukkan kata kunci pencarian (Email, Nomor WhatsApp, NIK 16 digit, atau Order ID).',
      });
    }

    const cleanQ = rawQ.replace(/\s+/g, '');
    let matchedType = type;

    // 0. Deteksi jika input berupa payload QR Code terenkripsi / pipe-delimited
    if (rawQ.includes('|')) {
      const parts = rawQ.split('|').map((s) => s.trim()).filter(Boolean);
      const cipher = parts.length > 1 ? parts[1] : parts[0];
      const decrypted = decryptQrPayload(cipher);

      if (decrypted) {
        if (decrypted.t === 'master') {
          matchedType = 'orderId';
          rawQ = decrypted.o;
        } else if (decrypted.t === 'single') {
          if (decrypted.o) {
            matchedType = 'orderId';
            rawQ = decrypted.o;
          } else if (decrypted.n) {
            matchedType = 'nik';
            rawQ = decrypted.n;
          }
        }
      } else if (parts.length >= 2) {
        // Legacy: PREFIX|ORDER_ID|BIB|NIK
        matchedType = 'orderId';
        rawQ = parts[1];
      }
    }

    // Deteksi otomatis jika type = 'all'
    if (matchedType === 'all') {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawQ)) {
        matchedType = 'email';
      } else if (/^\d{16}$/.test(cleanQ)) {
        matchedType = 'nik';
      } else if (/^(\+62|62|08)\d{8,13}$/.test(cleanQ)) {
        matchedType = 'phone';
      } else if (/^TR-[\w-]+$/i.test(rawQ) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawQ)) {
        matchedType = 'orderId';
      } else if (/^[\w]+-\d+$/i.test(rawQ)) {
        matchedType = 'bib';
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Format pencarian tidak sesuai. Gunakan Email valid, Nomor WhatsApp (contoh: 08123456789), NIK KTP (16 digit), Nomor BIB (contoh: 10-1001), atau Order ID resmi (TR-xxx).',
        });
      }
    }

    let whereClause: any = null;

    if (matchedType === 'bib') {
      whereClause = {
        participants: {
          some: { bibNumber: rawQ },
        },
      };
    } else if (matchedType === 'nik') {
      if (!/^\d{16}$/.test(cleanQ)) {
        return res.status(400).json({
          status: 'error',
          message: 'Format NIK tidak valid. NIK KTP wajib terdiri dari tepat 16 digit angka.',
        });
      }
      whereClause = {
        participants: {
          some: { nik: cleanQ },
        },
      };
    } else if (matchedType === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawQ)) {
        return res.status(400).json({
          status: 'error',
          message: 'Format Email tidak valid. Contoh: pelari@gmail.com',
        });
      }
      whereClause = {
        user: { email: rawQ.toLowerCase() },
      };
    } else if (matchedType === 'phone') {
      let phoneVariants = [cleanQ];
      if (cleanQ.startsWith('08')) {
        phoneVariants.push('628' + cleanQ.slice(2));
        phoneVariants.push('+628' + cleanQ.slice(2));
      } else if (cleanQ.startsWith('628')) {
        phoneVariants.push('08' + cleanQ.slice(3));
        phoneVariants.push('+' + cleanQ);
      } else if (cleanQ.startsWith('+628')) {
        phoneVariants.push('08' + cleanQ.slice(4));
        phoneVariants.push(cleanQ.slice(1));
      }

      if (cleanQ.length < 10) {
        return res.status(400).json({
          status: 'error',
          message: 'Nomor WhatsApp minimal 10 digit angka.',
        });
      }

      whereClause = {
        OR: [
          { user: { phoneNumber: { in: phoneVariants } } },
          { participants: { some: { emergencyContactPhone: { in: phoneVariants } } } },
          { participants: { some: { phoneNumber: { in: phoneVariants } } } },
        ],
      };
    } else if (matchedType === 'orderId') {
      if (rawQ.length < 5) {
        return res.status(400).json({
          status: 'error',
          message: 'Order ID tidak valid.',
        });
      }
      whereClause = {
        OR: [{ id: rawQ }, { midtransOrderId: rawQ }],
      };
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Tipe pencarian tidak dikenali.',
      });
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: { select: { fullName: true, email: true, phoneNumber: true } },
        participants: {
          include: {
            event: { select: { id: true, ticketName: true, category: true, price: true, ticketImage: true, medalImage: true, eventDate: true } },
            jersey: { select: { id: true, name: true, type: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Sinkronkan status realtime dari Midtrans jika masih PENDING
    for (const ord of orders) {
      if (ord.status === 'PENDING') {
        await syncOrderWithMidtrans(ord, req.get('origin'));
      }
    }

    const pending = orders.filter(order => order.status === 'PENDING');
    const expirySettings = await prisma.appSetting.findMany({
      where: { key: { in: pending.map(order => `payment_expiry_${order.id}`) } },
      select: { key: true, value: true },
    });
    const expiryMap = new Map(expirySettings.map(setting => [setting.key, setting.value]));
    const timerSetting = pending.length
      ? await prisma.appSetting.findUnique({ where: { key: 'payment_timer_minutes' } })
      : null;
    const minutes = Math.max(5, Number.parseInt(timerSetting?.value || '30', 10) || 30);
    return res.status(200).json({
      status: 'success',
      data: orders.map(order => ({
        ...order,
        paymentExpiresAt: order.status === 'PENDING'
          ? expiryMap.get(`payment_expiry_${order.id}`) || new Date(order.createdAt.getTime() + minutes * 60_000).toISOString()
          : null,
      })),
    });
  } catch (error: any) {
    console.error('🚨 [SEARCH TICKETS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal melakukan pencarian tiket di server.',
    });
  }
};

/**
 * Helper sinkronisasi status transaksi dari Midtrans Core API secara otomatis
 */
async function syncOrderWithMidtrans(order: any, siteOrigin?: string): Promise<boolean> {
  if (!order || order.status === 'SETTLEMENT' || !order.midtransOrderId || order.midtransOrderId.startsWith('OFFLINE-')) {
    return false;
  }

  try {
    const statusRes = await coreApi.transaction.status(order.midtransOrderId);
    const midtransStatus = statusRes?.transaction_status?.toLowerCase();
    const fraudStatus = statusRes?.fraud_status || 'accept';

    if (midtransStatus === 'settlement' || (midtransStatus === 'capture' && fraudStatus === 'accept')) {
      const changed = await prisma.$transaction(async (tx) => {
        const update = await tx.order.updateMany({
          where: { id: order.id, status: 'PENDING' },
          data: { status: 'SETTLEMENT' },
        });
        if (!update.count) return false;
        await queueAutomaticPdfDeliveries(tx, order.id);

        for (const p of order.participants || []) {
          if (!p.bibNumber) {
            const prefix = p.event?.category === '10K' ? '10' : '05';
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const bib = `${prefix}-${randomNum}`;
            await tx.participant.update({
              where: { id: p.id },
              data: { bibNumber: bib },
            });
            p.bibNumber = bib;
          }
        }

        await tx.log.create({
          data: {
            action: 'ORDER_SYNC_SETTLEMENT',
            description: `Status Order ${order.id} (${order.midtransOrderId}) disinkronkan ke SETTLEMENT via Midtrans API.`,
            entityType: 'Order',
            entityId: order.id,
            metadata: { midtransStatus, fraudStatus },
          },
        }).catch(() => null);
        return true;
      });

      if (!changed) {
        const current = await prisma.order.findUnique({ where: { id: order.id }, select: { status: true } });
        if (current) order.status = current.status;
        return false;
      }
      order.status = 'SETTLEMENT';

      // Kirim notifikasi pembayaran lunas & E-Tiket ke WhatsApp & Email
      sendOrderNotification({
        orderId: order.id,
        type: 'PAID',
        siteOrigin,
      }).catch((err) => console.warn('Notif paid sync warning:', err));

      return true;
    } else if (['cancel', 'deny', 'expire'].includes(midtransStatus)) {
      await closePendingOrder(order, midtransStatus === 'expire' ? 'EXPIRE' : 'CANCEL');
      const current = await prisma.order.findUnique({ where: { id: order.id }, select: { status: true } });
      if (current) order.status = current.status;
      return true;
    }

  } catch (err: any) {
    console.warn(`ℹ️ Midtrans status check for ${order.midtransOrderId}:`, err.message);
  }

  return false;
}

async function closePendingOrder(order: any, status: 'CANCEL' | 'EXPIRE'): Promise<void> {
  const updates = await prisma.$transaction(async tx => {
    const changed = await tx.order.updateMany({ where: { id: order.id, status: 'PENDING' }, data: { status } });
    if (!changed.count) return [];
    const counts = new Map<string, number>();
    for (const participant of order.participants) {
      counts.set(participant.eventId, (counts.get(participant.eventId) || 0) + 1);
    }
    const stock: Array<{ eventId: string; stock: number }> = [];
    for (const [eventId, count] of counts) {
      const event = await tx.event.update({ where: { id: eventId }, data: { stock: { increment: count } }, select: { stock: true } });
      stock.push({ eventId, stock: event.stock });
    }
    await tx.appSetting.deleteMany({ where: { key: `payment_expiry_${order.id}` } });
    return stock;
  });
  for (const update of updates) emitStockUpdate(update.eventId, update.stock);
}

export const verifyOrderExpiry = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = String(req.params.orderId);
    const order = await prisma.order.findUnique({ where: { id }, select: { id: true } });
    if (!order) return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
    await expirePendingOrders(order.id);
    const current = await prisma.order.findUnique({ where: { id }, select: { status: true } });
    return res.json({ status: 'success', data: { status: current?.status } });
  } catch (error) {
    console.error('[ORDER EXPIRY] Gagal memeriksa pesanan:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memverifikasi batas waktu pembayaran.' });
  }
};

/**
 * 2. MENGAMBIL DATA E-TIKET RESMI (SETTLEMENT ONLY)
 */
export const getETicketData = async (req: Request, res: Response): Promise<any> => {
  try {
    const rawParam = String(req.params.orderId).trim();
    let targetOrderId = rawParam;

    // QR encrypted legacy payloads are still accepted for old tickets.
    if (rawParam.includes('|')) {
      const parts = rawParam.split('|').map((s) => s.trim()).filter(Boolean);
      const cipher = parts.length > 1 ? parts[1] : parts[0];
      const decrypted = decryptQrPayload(cipher);
      if (decrypted && decrypted.o) {
        targetOrderId = decrypted.o;
      } else if (parts.length > 1) {
        targetOrderId = parts[1];
      }
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: targetOrderId },
          { midtransOrderId: targetOrderId },
          { participants: { some: { id: targetOrderId } } },
          { participants: { some: { bibNumber: targetOrderId } } },
          { participants: { some: { nik: targetOrderId } } },
        ],
      },
      include: {
        user: true,
        participants: {
          include: {
            event: {
              include: {
                benefits: true,
              },
            },
            jersey: true,
          },
        },
      },
    }) as any;

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Data E-Tiket tidak ditemukan. Periksa kembali ID Pesanan Anda.',
      });
    }

    // Periksa status real-time ke Midtrans jika belum SETTLEMENT / CAPTURE
    const isPaidStatus = order.status === 'SETTLEMENT' || order.status === 'CAPTURE';
    if (!isPaidStatus) {
      await syncOrderWithMidtrans(order, req.get('origin'));
    }

    const isNowPaid = order.status === 'SETTLEMENT' || order.status === 'CAPTURE';
    if (!isNowPaid) {
      return res.status(400).json({
        status: 'error',
        message: `Tiket belum berstatus Lunas (Status saat ini: ${order.status}). E-Tiket hanya dapat diterbitkan setelah pembayaran terverifikasi.`,
        orderStatus: order.status,
        orderId: order.id,
      });
    }

    // Buat token QR ringkas untuk setiap peserta (nomor BIB tidak diekspos di E-Tiket publik)
    for (const p of order.participants) {
      p.qrPayload = await generateSingleQrString(p.id);
      p.qrImageDataUrl = await QRCode.toDataURL(p.qrPayload, {
        width: 480,
        margin: 4,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      delete p.bibNumber; // Bersihkan nomor BIB dari response E-Tiket publik demi keamanan
    }

    // Buat Master QR Code jika pesanan memiliki lebih dari 1 tiket
    let masterQrPayload: string | null = null;
    let masterQrImageDataUrl: string | null = null;
    if (order.participants.length > 1) {
      masterQrPayload = await generateMasterQrString(order.id);
      masterQrImageDataUrl = await QRCode.toDataURL(masterQrPayload, {
        width: 480,
        margin: 4,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#FFFFFF' },
      });
    }

    // Ambil petunjuk racepack dari database
    const racepackInstructions = await loadRacepackInstructions();

    return res.status(200).json({
      status: 'success',
      data: {
        ...order,
        masterQrPayload,
        masterQrImageDataUrl,
        racepackInstructions,
      },
    });
  } catch (error: any) {
    console.error('🚨 [GET E-TICKET ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memuat data E-Tiket.',
    });
  }
};

/**
 * 3. PEMBATALAN PESANAN OLEH PESERTA (HANYA STATUS PENDING)
 */
export const cancelOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const orderId = String(req.params.orderId);
    const { reason, note } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        participants: true,
        user: true,
      },
    }) as any;

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
    }

    // Guard ketat: Tiket yang sudah berstatus SETTLEMENT TIDAK BOLEH dibatalkan mandiri!
    if (order.status === 'SETTLEMENT') {
      return res.status(400).json({
        status: 'error',
        message: '🚨 Tiket yang sudah berstatus LUNAS (SETTLEMENT) TIDAK DAPAT dibatalkan secara mandiri. Silakan hubungi panitia penyelenggara resmi Tegal Run 2026.',
      });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({
        status: 'error',
        message: 'Pesanan ini sudah dibatalkan sebelumnya.',
      });
    }

    // Kembalikan kuota tiket ke event
    const participantCount = order.participants.length;
    const eventId = order.participants[0]?.eventId;

    const cancelled = await prisma.$transaction(async (tx) => {
      // 1. Ubah status order menjadi CANCEL
      const update = await tx.order.updateMany({
        where: { id: order.id, status: 'PENDING' },
        data: { status: 'CANCEL' },
      });
      if (!update.count) return false;

      // 2. Kembalikan kuota event jika sebelumnya PENDING
      if (eventId && order.status === 'PENDING') {
        const updatedEvent = await tx.event.update({
          where: { id: eventId },
          data: { stock: { increment: participantCount } },
        });

        // Broadcast sisa stok terbaru ke semua klien via WebSocket
        emitStockUpdate(eventId, updatedEvent.stock);
      }

      // 3. Catat audit log pembatalan
      await tx.log.create({
        data: {
          action: 'ORDER_CANCELLED_BY_USER',
          description: `Pesanan ${order.midtransOrderId || order.id} dibatalkan oleh peserta. Alasan: ${reason || '-'}. Catatan: ${note || '-'}`,
          userId: order.userId,
          entityType: 'Order',
          entityId: order.id,
          metadata: { reason, note, previousStatus: order.status },
        },
      });
      return true;
    });

    if (!cancelled) {
      return res.status(409).json({ status: 'error', message: 'Status pesanan telah berubah. Silakan periksa kembali.' });
    }
    // Kirim notifikasi pembatalan via WhatsApp/Email
    sendOrderNotification({
      orderId: order.id,
      type: 'CANCEL',
      customNote: reason,
      siteOrigin: req.get('origin'),
    }).catch((err) => console.warn('Notif cancel warning:', err));

    return res.status(200).json({
      status: 'success',
      message: 'Pesanan tiket Anda berhasil dibatalkan. Kuota tiket telah dikembalikan ke sistem.',
    });
  } catch (error: any) {
    console.error('🚨 [CANCEL ORDER ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan sistem saat memproses pembatalan tiket.',
    });
  }
};

/**
 * 4. SINKRONISASI STATUS MIDTRANS (REALTIME CHECK KE MIDTRANS CORE API)
 */
export const syncMidtransStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const orderId = String(req.params.orderId);

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { midtransOrderId: orderId }],
      },
      include: {
        participants: {
          include: { event: true },
        },
        user: true,
      },
    }) as any;

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order tidak ditemukan.' });
    }

    let midtransStatus: string = order.status.toLowerCase();
    let fraudStatus: string = 'accept';

    try {
      if (order.midtransOrderId) {
        const statusRes = await coreApi.transaction.status(order.midtransOrderId);
        if (statusRes && statusRes.transaction_status) {
          midtransStatus = statusRes.transaction_status.toLowerCase();
          fraudStatus = statusRes.fraud_status || 'accept';
        }
      }
    } catch (e: any) {
      console.log('ℹ️ Midtrans transaction check:', e.message);
    }

    let finalStatus: any = order.status;
    if (midtransStatus === 'settlement' || (midtransStatus === 'capture' && fraudStatus === 'accept')) {
      finalStatus = 'SETTLEMENT';
    } else if (['cancel', 'deny'].includes(midtransStatus)) {
      finalStatus = 'CANCEL';
    } else if (midtransStatus === 'expire') {
      finalStatus = 'EXPIRE';
    } else if (midtransStatus === 'pending') {
      finalStatus = 'PENDING';
    }

    // Jika terjadi perubahan status dari PENDING ke SETTLEMENT
    if (finalStatus === 'SETTLEMENT' && order.status !== 'SETTLEMENT') {
      const changed = await prisma.$transaction(async (tx) => {
        const update = await tx.order.updateMany({
          where: { id: order.id, status: 'PENDING' },
          data: { status: 'SETTLEMENT' },
        });
        if (!update.count) return false;
        await queueAutomaticPdfDeliveries(tx, order.id);

        // Generate nomor BIB dada resmi
        for (const p of order.participants) {
          if (!p.bibNumber) {
            const prefix = p.event?.category === '10K' ? '10' : '05';
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const bib = `${prefix}-${randomNum}`;
            await tx.participant.update({
              where: { id: p.id },
              data: { bibNumber: bib },
            });
            p.bibNumber = bib;
          }
        }

        await tx.log.create({
          data: {
            action: 'ORDER_SYNC_SETTLEMENT',
            description: `Status Order ${order.id} berhasil disinkronkan ke SETTLEMENT via Midtrans Core API.`,
            entityType: 'Order',
            entityId: order.id,
            metadata: { midtransStatus, fraudStatus },
          },
        });
        return true;
      });

      // Kirim notifikasi pembayaran lunas & E-Tiket ke WhatsApp / Email
      if (changed) {
        sendOrderNotification({
          orderId: order.id,
          type: 'PAID',
          siteOrigin: req.get('origin'),
        }).catch((err) => console.warn('Notif paid sync warning:', err));
      }
    } else if (['CANCEL', 'EXPIRE'].includes(finalStatus) && order.status === 'PENDING') {
      await closePendingOrder(order, finalStatus);
    }

    const current = await prisma.order.findUnique({ where: { id: order.id }, select: { status: true } });
    finalStatus = current?.status || order.status;
    return res.status(200).json({
      status: 'success',
      message: `Status terkini: ${finalStatus}`,
      data: {
        orderId: order.id,
        midtransOrderId: order.midtransOrderId,
        status: finalStatus,
        isPaid: finalStatus === 'SETTLEMENT',
      },
    });
  } catch (error: any) {
    console.error('🚨 [SYNC MIDTRANS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal melakukan sinkronisasi status Midtrans.',
    });
  }
};

/**
 * 5. GET OR REGENERATE MIDTRANS SNAP TOKEN FOR PENDING ORDER
 */
export const getOrderSnapToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const maintenanceSetting = await prisma.appSetting.findUnique({ where: { key: 'maintenance_enabled' } });
    if (maintenanceSetting?.value === 'true') {
      const messageSetting = await prisma.appSetting.findUnique({ where: { key: 'maintenance_message' } });
      return res.status(503).json({
        status: 'error',
        code: 'MAINTENANCE_MODE',
        message: messageSetting?.value || 'Layanan pembayaran sementara tidak tersedia karena website dalam pemeliharaan.'
      });
    }

    const orderId = req.params.orderId ? String(req.params.orderId) : '';
    if (!orderId) {
      return res.status(400).json({ status: 'error', message: 'Order ID wajib diisi.' });
    }

    const order: any = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { midtransOrderId: orderId }],
      },
      include: {
        user: true,
        participants: {
          include: { event: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order tiket tidak ditemukan.' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({
        status: 'error',
        message: `Order berstatus ${order.status}. Pembayaran Snap hanya untuk pesanan PENDING.`,
      });
    }

    // Jika snapToken sudah tersimpan dan valid
    if (order.snapToken) {
      return res.status(200).json({
        status: 'success',
        data: {
          orderId: order.id,
          midtransOrderId: order.midtransOrderId,
          snapToken: order.snapToken,
        },
      });
    }

    // Ambil timer setting
    const timerSetting = await prisma.appSetting.findUnique({ where: { key: 'payment_timer_minutes' } });
    const timerMinutes = timerSetting ? Math.max(5, parseInt(timerSetting.value, 10) || 30) : 30;

    // Hitung item details
    const itemDetails: any[] = [];
    const eventCounts: Record<string, { count: number; event: any }> = {};

    for (const p of order.participants) {
      if (!eventCounts[p.eventId]) {
        eventCounts[p.eventId] = { count: 0, event: p.event };
      }
      eventCounts[p.eventId].count += 1;
    }

    let itemsSum = 0;
    for (const item of Object.values(eventCounts)) {
      const price = Math.round(Number(item.event.price));
      itemsSum += price * item.count;
      itemDetails.push({
        id: item.event.id,
        price,
        quantity: item.count,
        name: item.event.ticketName.substring(0, 50),
      });
    }

    const totalAmount = Math.round(Number(order.totalAmount));
    const feeDiff = totalAmount - itemsSum;
    if (feeDiff > 0) {
      itemDetails.push({
        id: 'SERVICE_FEE',
        price: feeDiff,
        quantity: 1,
        name: 'Biaya Layanan & Administrasi',
      });
    }

    const midtransPayload: any = {
      transaction_details: {
        order_id: order.midtransOrderId,
        gross_amount: totalAmount,
      },
      customer_details: {
        first_name: order.user.fullName,
        email: order.user.email,
        phone: order.user.phoneNumber,
      },
      item_details: itemDetails,
      custom_expiry: {
        expiry_duration: timerMinutes,
        unit: 'minute',
      },
    };

    const snapResponse = await snap.createTransaction(midtransPayload);

    if (snapResponse?.token) {
      await prisma.order.update({
        where: { id: order.id },
        data: { snapToken: snapResponse.token },
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        orderId: order.id,
        midtransOrderId: order.midtransOrderId,
        snapToken: snapResponse.token,
        paymentUrl: snapResponse.redirect_url,
      },
    });
  } catch (error: any) {
    console.error('🚨 [GET SNAP TOKEN ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal membuat sesi pembayaran Midtrans: ' + (error.message || 'Server error'),
    });
  }
};
