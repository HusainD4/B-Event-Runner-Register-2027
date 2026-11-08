import type { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * Controller untuk mengambil ringkasan statistik dashboard admin (Total Pendaftar, Total Pemasukan, Sisa Kuota)
 */
export const getAdminStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const totalEvents = await prisma.event.count();
    const totalParticipants = await prisma.participant.count();
    
    // Hitung total pemasukan dari order yang sudah lunas (SETTLEMENT)
    const paidOrders = await prisma.order.findMany({
      where: { status: 'SETTLEMENT' },
      select: { totalAmount: true }
    });

    const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    // Ambil daftar event beserta sisa stoknya
    const events = await prisma.event.findMany({
      select: { id: true, ticketName: true, stock: true, price: true }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil data statistik dashboard admin.',
      data: {
        totalEvents,
        totalParticipants,
        totalRevenue,
        events: events.map(e => ({ ...e, price: Number(e.price) }))
      }
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
 * Controller untuk mengambil daftar seluruh peserta yang terdaftar
 */
export const getAllParticipants = async (req: Request, res: Response): Promise<any> => {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        event: { select: { ticketName: true } },
        order: { select: { midtransOrderId: true, status: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil daftar seluruh peserta.',
      data: participants
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
 * Controller untuk mengenerate nomor BIB (Race Number) peserta secara otomatis berdasarkan kategori event
 */
export const generateBibNumbers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ status: 'error', message: 'Event ID wajib disertakan.' });
    }

    // Ambil semua peserta pada event tersebut yang belum memiliki BIB number
    const participants = await prisma.participant.findMany({
      where: { eventId, bibNumber: null },
      orderBy: { createdAt: 'asc' }
    });

    if (participants.length === 0) {
      return res.status(200).json({ status: 'success', message: 'Semua peserta pada event ini sudah memiliki nomor BIB.' });
    }

    // Tentukan prefix nomor BIB berdasarkan event (contoh: 5K -> 05, 10K -> 10)
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    const prefix = event?.ticketName.toLowerCase().includes('10k') ? '10' : '05';

    let counter = 1;
    for (const p of participants) {
      const bibNumber = `${prefix}${String(counter).padStart(4, '0')}`; // Contoh: 050001, 100042
      
      await prisma.participant.update({
        where: { id: p.id },
        data: { bibNumber }
      });

      counter++;
    }

    return res.status(200).json({
      status: 'success',
      message: `Berhasil mengenerate ${participants.length} nomor BIB untuk peserta event.`,
    });
  } catch (error: any) {
    console.error('🚨 [ADMIN ERROR] Gagal mengenerate nomor BIB:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server saat mengenerate BIB.',
    });
  }
};