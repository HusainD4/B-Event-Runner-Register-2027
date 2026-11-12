import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { corsConfig } from '../config/cors';
import { env } from '../config/env';
import prisma from '../config/database';
import { ADMIN_SESSION_COOKIE, readCookie } from '../config/admin-session';

let io: Server | null = null;

/**
 * Menginisialisasi server Socket.IO yang menempel pada instance HTTP Server Express
 */
export const initSocketServer = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: corsConfig.origin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = readCookie(socket.handshake.headers.cookie, ADMIN_SESSION_COOKIE);
    if (!token) return next();

    try {
      const payload = jwt.verify(String(token), env.JWT_SECRET) as { adminId?: string; tokenVersion?: number };
      if (!payload.adminId) return next(new Error('Autentikasi admin tidak valid.'));

      const admin = await prisma.admin.findUnique({
        where: { id: payload.adminId },
        select: { id: true, isActive: true, tokenVersion: true, fullName: true, role: { select: { id: true, name: true } } },
      });
      if (!admin?.isActive) return next(new Error('Akun admin tidak aktif.'));
      if (Number(payload.tokenVersion ?? 0) !== admin.tokenVersion) {
        return next(new Error('Sesi admin telah dicabut oleh Superadmin.'));
      }

      socket.data.adminId = admin.id;
      socket.data.adminName = admin.fullName;
      socket.data.roleId = admin.role.id;
      socket.data.roleName = admin.role.name;
      return next();
    } catch {
      return next(new Error('Sesi admin tidak valid.'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 [SOCKET] Klien terhubung: ${socket.id}`);
    socket.join('public');
    if (socket.data.adminId) {
      socket.join('admin');
      socket.join(`admin:${socket.data.adminId}`);
      io?.to('admin').emit('admin:presence_changed');
    }

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
      if (socket.data.adminId) io?.to('admin').emit('admin:presence_changed');
    });
  });

  console.log('✅ [SOCKET.IO] Server WebSocket berhasil diinisialisasi.');
  return io;
};

export const emitDataChanged = (topics: string[]) => {
  if (!io || topics.length === 0) return;
  const event = { topics: [...new Set(topics)], updatedAt: new Date().toISOString() };
  io.to('admin').emit('admin:data_changed', event);
  if (topics.some(topic => topic.startsWith('public:'))) {
    io.to('public').emit('public:data_changed', {
      topics: event.topics.filter(topic => topic.startsWith('public:')).map(topic => topic.slice(7)),
      updatedAt: event.updatedAt,
    });
  }
};

export const emitAdminEvent = (eventName: string, payload: unknown) => {
  io?.to('admin').emit(eventName, payload);
};

export const emitAdminEventTo = (adminId: string, eventName: string, payload: unknown) => {
  if (!adminId) return;
  io?.to(`admin:${adminId}`).emit(eventName, payload);
};

export const getConnectedAdminIds = async (): Promise<Set<string>> => {
  if (!io) return new Set();
  const sockets = await io.in('admin').fetchSockets();
  const adminIds = sockets
    .map(socket => socket.data.adminId)
    .filter((adminId): adminId is string => typeof adminId === 'string');
  return new Set(adminIds);
};

export const disconnectAdmins = async (adminIds: string[]): Promise<void> => {
  if (!io) return;
  const targetAdminIds = new Set(adminIds);
  if (targetAdminIds.size === 0) return;
  const sockets = await io.in('admin').fetchSockets();
  for (const socket of sockets) {
    if (!targetAdminIds.has(socket.data.adminId)) continue;
    socket.emit('admin:force_logout', { message: 'Sesi Anda telah diakhiri oleh Superadmin.' });
    socket.disconnect(true);
  }
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