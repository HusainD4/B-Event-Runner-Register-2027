import type { Response } from 'express';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { coreApi } from '../config/midtrans';

/**
 * Controller untuk mengambil ringkasan statistik dashboard admin (Total Pendaftar, Total Pemasukan, Sisa Kuota, Rekonsiliasi Midtrans)
 */
export const getAdminStats = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    // 1. Auto-sync hingga 15 pending order terbaru dari Midtrans jika ada
    try {
      const pendingOrders = await prisma.order.findMany({
        where: {
          status: 'PENDING',
          midtransOrderId: { not: null },
          NOT: { midtransOrderId: { startsWith: 'OFFLINE-' } },
        },
        take: 15,
        orderBy: { createdAt: 'desc' },
      });

      for (const ord of pendingOrders) {
        if (!ord.midtransOrderId) continue;
        try {
          const statusRes = await coreApi.transaction.status(ord.midtransOrderId);
          const mStatus = statusRes?.transaction_status?.toLowerCase();
          const fStatus = statusRes?.fraud_status || 'accept';

          if (mStatus === 'settlement' || (mStatus === 'capture' && fStatus === 'accept')) {
            await prisma.order.update({
              where: { id: ord.id },
              data: { status: 'SETTLEMENT' },
            });
          } else if (['cancel', 'deny'].includes(mStatus)) {
            await prisma.order.update({
              where: { id: ord.id },
              data: { status: 'CANCEL' },
            });
          } else if (mStatus === 'expire') {
            await prisma.order.update({
              where: { id: ord.id },
              data: { status: 'EXPIRE' },
            });
          }
        } catch {
          // Abaikan error individual Midtrans (order belum terbuat / sandbox)
        }
      }
    } catch {
      // Abaikan jika Midtrans offline
    }

    const totalEvents = await prisma.event.count();
    const totalParticipants = await prisma.participant.count();
    const totalUsers = await prisma.user.count();
    
    // 2. Query seluruh order beserta tiket peserta untuk rincian finansial & biaya layanan komprehensif
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        totalAmount: true,
        participants: {
          select: {
            event: {
              select: { price: true }
            }
          }
        }
      },
    });

    let settledCount = 0;
    let settledGrossAmount = 0; // Omzet kotor sukses / lunas
    let settledServiceFee = 0;   // Akumulasi biaya layanan dari order lunas

    let pendingCount = 0;
    let pendingGrossAmount = 0; // Menunggu pembayaran

    let cancelledCount = 0;
    let cancelledGrossAmount = 0; // Dibatalkan / Kadaluarsa

    for (const o of allOrders) {
      const totalAmt = Number(o.totalAmount || 0);
      let ticketSubtotal = 0;
      if (Array.isArray(o.participants) && o.participants.length > 0) {
        ticketSubtotal = o.participants.reduce((sum, p) => sum + Number(p.event?.price || 0), 0);
      }
      const feeAmt = Math.max(0, totalAmt - ticketSubtotal);

      if (o.status === 'SETTLEMENT' || o.status === 'CAPTURE') {
        settledCount++;
        settledGrossAmount += totalAmt;
        settledServiceFee += feeAmt;
      } else if (o.status === 'PENDING') {
        pendingCount++;
        pendingGrossAmount += totalAmt;
      } else if (['CANCEL', 'EXPIRE', 'DENY', 'REFUND'].includes(o.status)) {
        cancelledCount++;
        cancelledGrossAmount += totalAmt;
      }
    }

    // HASIL AKHIR MURNI (BERSIH) = Total Transaksi Lunas - Total Biaya Layanan
    const netRevenue = Math.max(0, settledGrossAmount - settledServiceFee);

    // Ambil daftar event beserta sisa stok dan jumlah peserta
    const events = await prisma.event.findMany({
      include: {
        _count: { select: { participants: true } },
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil data statistik dashboard admin.',
      data: {
        totalEvents,
        totalParticipants,
        totalUsers,
        totalRevenue: settledGrossAmount, // Total Omzet Kotor (Lunas)
        totalServiceFee: settledServiceFee, // Total Seluruh Biaya Layanan
        netRevenue, // Total HASIL AKHIR MURNI (BERSIH) yang sudah dipotong biaya layanan
        financials: {
          settled: { count: settledCount, amount: settledGrossAmount },
          pending: { count: pendingCount, amount: pendingGrossAmount },
          cancelled: { count: cancelledCount, amount: cancelledGrossAmount },
          serviceFee: { count: settledCount, amount: settledServiceFee },
          netRevenue,
        },
        events: events.map((e) => ({
          id: e.id,
          ticketName: e.ticketName,
          category: e.category,
          stock: e.stock,
          registeredCount: e._count.participants,
          remainingStock: Math.max(0, e.stock - e._count.participants),
          price: Number(e.price),
        })),
      },
    });
  } catch (error: any) {
    console.error('🚨 [ADMIN ERROR] Gagal mengambil statistik admin:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server.',
    });
  }
};

/**
 * Controller untuk mengambil daftar seluruh peserta yang terdaftar (ringkas / backward compatible)
 */
export const getAllParticipants = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        event: { select: { ticketName: true, category: true } },
        order: { select: { midtransOrderId: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil daftar seluruh peserta.',
      data: participants,
    });
  } catch (error: any) {
    console.error('🚨 [ADMIN ERROR] Gagal mengambil daftar peserta:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server.',
    });
  }
};

/**
 * Controller untuk mengenerate nomor BIB peserta secara otomatis berdasarkan BibConfiguration event
 */
export const generateBibNumbers = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ status: 'error', message: 'Event ID wajib disertakan.' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { bibConfig: true },
    });

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event tidak ditemukan.' });
    }

    // Ambil semua peserta pada event tersebut yang belum memiliki BIB number
    const participants = await prisma.participant.findMany({
      where: { eventId, bibNumber: null },
      orderBy: { createdAt: 'asc' },
    });

    if (participants.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Semua peserta pada event ini sudah memiliki nomor BIB.',
      });
    }

    // Konfigurasi format BIB
    const prefix = event.bibConfig?.prefix || (event.ticketName.toLowerCase().includes('10k') ? '10' : '05');
    const digitLength = event.bibConfig?.digitLength || 4;
    const startNumber = event.bibConfig?.startNumber || 1;
    const suffix = event.bibConfig?.suffix || '';

    // Cari nomor terakhir yang sudah dipakai agar tidak duplikat
    let counter = startNumber;
    let generatedCount = 0;

    for (const p of participants) {
      let bibNumber = '';
      let isDuplicate = true;

      // Cari nomor berikutnya yang belum terpakai di DB
      while (isDuplicate) {
        const paddedNum = String(counter).padStart(digitLength, '0');
        bibNumber = `${prefix}${paddedNum}${suffix}`;

        const existing = await prisma.participant.findUnique({ where: { bibNumber } });
        if (!existing) {
          isDuplicate = false;
        }
        counter++;
      }

      await prisma.participant.update({
        where: { id: p.id },
        data: { bibNumber },
      });

      generatedCount++;
    }

    await prisma.log.create({
      data: {
        action: 'GENERATE_BIB',
        description: `Admin mengenerate ${generatedCount} nomor BIB untuk event ${event.ticketName}.`,
        adminId: req.admin?.adminId,
        entityType: 'Event',
        entityId: event.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Berhasil mengenerate ${generatedCount} nomor BIB untuk peserta event ${event.ticketName}.`,
    });
  } catch (error: any) {
    console.error('🚨 [ADMIN ERROR] Gagal mengenerate nomor BIB:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server saat mengenerate BIB.',
    });
  }
};
