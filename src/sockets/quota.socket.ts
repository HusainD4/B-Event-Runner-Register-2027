import { Server, Socket } from 'socket.io';
import prisma from '../config/database';

/**
 * Mendaftarkan event handler khusus untuk pemantauan kuota tiket (Quota Socket)
 */
export const registerQuotaHandlers = (io: Server, socket: Socket): void => {
  /**
   * Klien meminta informasi sisa kuota terbaru secara real-time
   */
  socket.on('get_live_quota', async (eventId: string, callback?: (data: any) => void) => {
    try {
      if (!eventId) {
        if (callback) callback({ status: 'error', message: 'Event ID tidak valid.' });
        return;
      }

      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true, ticketName: true, stock: true, price: true },
      });

      if (!event) {
        if (callback) callback({ status: 'error', message: 'Event tidak ditemukan.' });
        return;
      }

      // Kirim data kuota terkini kembali ke klien melalui callback atau event socket
      if (callback) {
        callback({
          status: 'success',
          data: {
            eventId: event.id,
            ticketName: event.ticketName,
            remainingStock: event.stock,
            price: Number(event.price),
          },
        });
      }
    } catch (error: any) {
      console.error(`🚨 [SOCKET ERROR] Gagal mengambil kuota real-time untuk event ${eventId}:`, error.message);
      if (callback) {
        callback({ status: 'error', message: 'Gagal mengambil data kuota.' });
      }
    }
  });

  /**
   * Klien bergabung ke room khusus untuk memantau perubahan kuota event tertentu
   */
  socket.on('subscribe_quota', (eventId: string) => {
    if (eventId) {
      socket.join(`quota_room_${eventId}`);
      console.log(`📡 [SOCKET] Klien ${socket.id} berlangganan siaran kuota untuk event: ${eventId}`);
    }
  });

  /**
   * Klien berhenti memantau perubahan kuota
   */
  socket.on('unsubscribe_quota', (eventId: string) => {
    if (eventId) {
      socket.leave(`quota_room_${eventId}`);
      console.log(`🔕 [SOCKET] Klien ${socket.id} berhenti berlangganan siaran kuota untuk event: ${eventId}`);
    }
  });
};

/**
 * Helper untuk menyiarkan perubahan kuota ke semua klien yang berada di room kuota event tersebut
 */
export const broadcastQuotaUpdate = (io: Server, eventId: string, remainingStock: number) => {
  io.to(`quota_room_${eventId}`).emit('quota_updated', {
    eventId,
    remainingStock,
    timestamp: new Date().toISOString(),
  });
};