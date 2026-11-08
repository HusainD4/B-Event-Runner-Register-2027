import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

/**
 * Menginisialisasi server Socket.IO yang menempel pada instance HTTP Server Express
 */
export const initSocketServer = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://haisen.my.id',
        'https://www.haisen.my.id',
        'https://tegalrun2027.com',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 [SOCKET] Klien terhubung: ${socket.id}`);

    // Event saat klien bergabung ke room khusus event (misal: 'event_tegal_run_2027')
    socket.on('join_event_room', (eventId: string) => {
      socket.join(`event_${eventId}`);
      console.log(`👤 [SOCKET] Klien ${socket.id} bergabung ke room event: ${eventId}`);
    });

    // Event saat klien meninggalkan room
    socket.on('leave_event_room', (eventId: string) => {
      socket.leave(`event_${eventId}`);
      console.log(`👋 [SOCKET] Klien ${socket.id} meninggalkan room event: ${eventId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 [SOCKET] Klien terputus (${socket.id}): ${reason}`);
    });
  });

  console.log('✅ [SOCKET.IO] Server WebSocket berhasil diinisialisasi.');
  return io;
};

/**
 * Mendapatkan instance io yang aktif agar bisa dipanggil dari controller/service manapun
 */
export const getIo = (): Server => {
  if (!io) {
    throw new Error('Socket.IO belum diinisialisasi! Panggil initSocketServer terlebih dahulu.');
  }
  return io;
};

/**
 * Helper untuk menyiarkan pembaruan stok tiket secara real-time ke semua peserta di room event
 */
export const emitStockUpdate = (eventId: string, remainingStock: number) => {
  if (io) {
    io.to(`event_${eventId}`).emit('stock_update', {
      eventId,
      remainingStock,
      updatedAt: new Date().toISOString(),
    });
  }
};