import type { Request, Response } from 'express';
import type { OrderStatus } from '../generated/client';
import prisma from '../config/database';
import { getEventRegistrationStatus } from '../utils/event-timing';

const activeOrderStatuses: OrderStatus[] = ['PENDING', 'SETTLEMENT', 'CAPTURE'];
const paidOrderStatuses: OrderStatus[] = ['SETTLEMENT', 'CAPTURE'];

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
        }
      });
    const eventCounts = await Promise.all(events.map(async event => {
      const [registeredCount, paidCount] = await Promise.all([
        prisma.participant.count({
          where: { eventId: event.id, order: { status: { in: activeOrderStatuses } } }
        }),
        prisma.participant.count({
          where: { eventId: event.id, order: { status: { in: paidOrderStatuses } } }
        })
      ]);
      return [event.id, { registeredCount, paidCount }] as const;
    }));
    const countsByEvent = new Map(eventCounts);

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil daftar event.',
      data: events.map(event => ({
        ...event,
        ...getEventRegistrationStatus(event.eventDate, event.isClosed),
        price: Number(event.price),
        registeredCount: countsByEvent.get(event.id)?.registeredCount || 0,
        paidCount: countsByEvent.get(event.id)?.paidCount || 0,
        remainingStock: Math.max(0, event.stock),
        totalCapacity: Math.max(0, event.stock) + (countsByEvent.get(event.id)?.registeredCount || 0),
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

    const [event, registeredCount, paidCount] = await Promise.all([
      prisma.event.findUnique({
        where: { id },
        include: {
          benefits: true,
          jerseys: true,
          bibConfig: true,
        },
      }),
      prisma.participant.count({
        where: { eventId: id, order: { status: { in: activeOrderStatuses } } }
      }),
      prisma.participant.count({
        where: { eventId: id, order: { status: { in: paidOrderStatuses } } }
      })
    ]);

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
        ...getEventRegistrationStatus(event.eventDate, event.isClosed),
        price: Number(event.price),
        registeredCount,
        paidCount,
        remainingStock: Math.max(0, event.stock),
        totalCapacity: Math.max(0, event.stock) + registeredCount,
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