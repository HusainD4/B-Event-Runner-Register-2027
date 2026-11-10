import type { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * Controller untuk mengambil daftar seluruh event yang tersedia
 */
export const getAllEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        benefits: true,
        jerseys: true,
        bibConfig: true,
        _count: { select: { participants: true } }
      }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil daftar event.',
      data: events.map(event => ({
        ...event,
        price: Number(event.price),
        registeredCount: event._count?.participants || 0,
        remainingStock: Math.max(0, event.stock - (event._count?.participants || 0)),
      })),
    });
  } catch (error: any) {
    console.error('🚨 [EVENT ERROR] Gagal mengambil daftar event:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server.',
    });
  }
};

/**
 * Controller untuk mengambil detail event berdasarkan ID
 */
export const getEventById = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        benefits: true,
        jerseys: true,
        bibConfig: true,
        _count: { select: { participants: true } },
      },
    });

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event tidak ditemukan.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil detail event.',
      data: {
        ...event,
        price: Number(event.price),
        registeredCount: event._count?.participants || 0,
        remainingStock: Math.max(0, event.stock - (event._count?.participants || 0)),
      },
    });
  } catch (error: any) {
    console.error('🚨 [EVENT ERROR] Gagal mengambil detail event:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server.',
    });
  }
};