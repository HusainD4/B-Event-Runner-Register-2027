import type { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { emitAdminEvent, emitDataChanged, emitStockUpdate } from '../sockets';

const participantAdminSchema = z.object({
  eventId: z.string().uuid('Event ID tidak valid'),
  orderId: z.string().uuid('Order ID tidak valid').optional(),
  fullNameKtp: z.string().min(3, 'Nama KTP minimal 3 karakter'),
  bibName: z.string().max(15, 'Nama BIB maksimal 15 karakter'),
  nik: z.string().regex(/^\d{16}$/, 'NIK harus 16 digit'),
  gender: z.enum(['MALE', 'FEMALE']),
  birthPlace: z.string().min(2),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Format tanggal harus YYYY-MM-DD'),
  fullAddress: z.string().min(5),
  country: z.string().default('Indonesia'),
  bloodType: z.enum(['A', 'B', 'AB', 'O']),
  medicalHistory: z.string().nullable().optional(),
  emergencyContactName: z.string().min(3),
  emergencyContactPhone: z.string().min(8),
  jerseyId: z.string().uuid().nullable().optional(),
  selectedSize: z.string().nullable().optional(),
  communityName: z.string().nullable().optional(),
  bibNumber: z.string().nullable().optional(),
});

export const clearParticipantData = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  if (!req.is('application/json')) {
    return res.status(415).json({ status: 'error', message: 'Permintaan harus menggunakan application/json.' });
  }
  if (req.body?.confirmation !== 'KOSONGKAN DATA PESERTA') {
    return res.status(400).json({ status: 'error', message: 'Ketik KOSONGKAN DATA PESERTA untuk mengonfirmasi.' });
  }
  try {
    const result = await prisma.$transaction(async tx => {
      const maintenance = await tx.appSetting.findUnique({ where: { key: 'maintenance_enabled' } });
      if (maintenance?.value !== 'true') throw new Error('RESET_MAINTENANCE_REQUIRED');

      const pending = await tx.order.count({ where: { status: 'PENDING' } });
      if (pending) throw new Error('RESET_PENDING_ORDERS');

      const manualLogs = await tx.log.findMany({
        where: { action: 'PARTICIPANT_MANUAL_CREATE', entityType: 'Participant', entityId: { not: null } },
        select: { entityId: true },
      });
      const manualIds = new Set(manualLogs.map(log => log.entityId).filter((id): id is string => id !== null));
      const participants = await tx.participant.findMany({
        select: { id: true, eventId: true, order: { select: { status: true, midtransOrderId: true } } },
      });
      const restoreByEvent = new Map<string, number>();
      for (const participant of participants) {
        const order = participant.order;
        if (['SETTLEMENT', 'CAPTURE'].includes(order.status) && order.midtransOrderId &&
            !order.midtransOrderId.startsWith('OFFLINE-') && !manualIds.has(participant.id)) {
          restoreByEvent.set(participant.eventId, (restoreByEvent.get(participant.eventId) || 0) + 1);
        }
      }

      const stockUpdates: Array<{ eventId: string; stock: number; restored: number }> = [];
      for (const [eventId, restored] of restoreByEvent) {
        const event = await tx.event.update({
          where: { id: eventId },
          data: { stock: { increment: restored } },
          select: { stock: true },
        });
        stockUpdates.push({ eventId, stock: event.stock, restored });
      }
      const qrTokens = await tx.qrToken.deleteMany();
      const deletedParticipants = await tx.participant.deleteMany();
      const orders = await tx.order.deleteMany();
      await tx.appSetting.deleteMany({
        where: { OR: [{ key: 'racepack_checkins' }, { key: { startsWith: 'payment_expiry_' } }] },
      });
      const restored = stockUpdates.reduce((sum, item) => sum + item.restored, 0);
      await tx.log.create({
        data: {
          action: 'PARTICIPANT_DATA_CLEARED',
          description: 'Superadmin mengosongkan data peserta, pesanan, QR, dan catatan racepack.',
          adminId: req.admin?.adminId,
          entityType: 'Participant',
          metadata: { participants: deletedParticipants.count, orders: orders.count, qrTokens: qrTokens.count, restoredStock: restored },
        },
      });
      return { participants: deletedParticipants.count, orders: orders.count, qrTokens: qrTokens.count, restoredStock: restored, stockUpdates };
    }, { isolationLevel: 'Serializable', maxWait: 10_000, timeout: 60_000 });

    for (const item of result.stockUpdates) emitStockUpdate(item.eventId, item.stock);
    emitAdminEvent('admin:racepack_queue_changed', { type: 'reset' });
    emitDataChanged(['participants', 'orders', 'racepack', 'racepack-view', 'dashboard', 'bib-settings', 'events', 'logs', 'public:events']);
    return res.status(200).json({
      status: 'success',
      message: 'Data peserta dan pesanan berhasil dikosongkan.',
      data: { participants: result.participants, orders: result.orders, qrTokens: result.qrTokens, restoredStock: result.restoredStock },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'RESET_MAINTENANCE_REQUIRED') {
      return res.status(409).json({ status: 'error', message: 'Aktifkan mode pemeliharaan sebelum mengosongkan data.' });
    }
    if (error instanceof Error && error.message === 'RESET_PENDING_ORDERS') {
      return res.status(409).json({ status: 'error', message: 'Masih ada pesanan menunggu pembayaran. Selesaikan atau batalkan pesanan melalui prosedur pembayaran sebelum melanjutkan.' });
    }
    console.error('🚨 [CLEAR PARTICIPANT DATA ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Pengosongan data gagal atau hasilnya tidak dapat dipastikan. Periksa data dan log audit sebelum mencoba lagi.' });
  }
};

export const getAdminParticipants = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const search = req.query.search ? String(req.query.search).trim() : undefined;
    const eventId = req.query.eventId ? String(req.query.eventId) : undefined;
    const gender = req.query.gender as 'MALE' | 'FEMALE' | undefined;

    const whereClause: any = {};
    if (eventId) whereClause.eventId = eventId;
    if (gender && (gender === 'MALE' || gender === 'FEMALE')) whereClause.gender = gender;

    if (search) {
      whereClause.OR = [
        { fullNameKtp: { contains: search } },
        { bibName: { contains: search } },
        { nik: { contains: search } },
        { bibNumber: { contains: search } },
        { emergencyContactName: { contains: search } },
        { communityName: { contains: search } },
      ];
    }

    const [total, participants, checkinSetting] = await Promise.all([
      prisma.participant.count({ where: whereClause }),
      prisma.participant.findMany({
        where: whereClause,
        include: {
          event: { select: { id: true, ticketName: true, category: true } },
          jersey: { select: { id: true, name: true, type: true } },
          order: {
            select: {
              id: true,
              midtransOrderId: true,
              status: true,
              user: { select: { fullName: true, email: true, phoneNumber: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.appSetting.findUnique({ where: { key: 'racepack_checkins' } }).catch(() => null),
    ]);

    let checkinsMap: Record<string, any> = {};
    if (checkinSetting && checkinSetting.value) {
      try {
        checkinsMap = JSON.parse(checkinSetting.value);
      } catch {
        checkinsMap = {};
      }
    }

    const enrichedParticipants = participants.map((p) => {
      const checkin = checkinsMap[p.id] || null;
      return {
        ...p,
        racepack: checkin || {
          checkedIn: false,
          checkedInAt: null,
          checkedInBy: null,
          items: [],
        },
      };
    });

    return res.status(200).json({
      status: 'success',
      data: enrichedParticipants,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('🚨 [GET PARTICIPANTS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil data peserta.' });
  }
};

export const getParticipantById = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        event: true,
        jersey: true,
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!participant) {
      return res.status(404).json({ status: 'error', message: 'Peserta tidak ditemukan.' });
    }

    return res.status(200).json({ status: 'success', data: participant });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil detail peserta.' });
  }
};

export const createManualParticipant = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parseResult = participantAdminSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi data peserta gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const data = parseResult.data;

    // Pastikan event ada
    const event = await prisma.event.findUnique({ where: { id: data.eventId } });
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event tidak ditemukan.' });
    }

    // Cek apakah NIK sudah terdaftar di event ini
    const existing = await prisma.participant.findFirst({
      where: { eventId: data.eventId, nik: data.nik },
    });
    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: `Peserta dengan NIK ${data.nik} sudah terdaftar pada event ini.`,
      });
    }

    let orderId = data.orderId;

    // Jika tidak ada orderId yang disertakan, buat dummy order internal (Offline registration)
    if (!orderId) {
      let offlineUser = await prisma.user.findFirst({ where: { email: 'offline-admin@tegalrun.id' } });
      if (!offlineUser) {
        offlineUser = await prisma.user.create({
          data: {
            fullName: 'Admin Offline Registration',
            email: 'offline-admin@tegalrun.id',
            phoneNumber: '+628000000000',
          },
        });
      }

      const order = await prisma.order.create({
        data: {
          userId: offlineUser.id,
          totalAmount: event.price,
          status: 'SETTLEMENT',
          midtransOrderId: `OFFLINE-${Date.now()}`,
        },
      });
      orderId = order.id;
    }

    const participant = await prisma.participant.create({
      data: {
        orderId,
        eventId: data.eventId,
        fullNameKtp: data.fullNameKtp,
        bibName: data.bibName,
        nik: data.nik,
        gender: data.gender,
        birthPlace: data.birthPlace,
        birthDate: new Date(data.birthDate),
        fullAddress: data.fullAddress,
        country: data.country || 'Indonesia',
        bloodType: data.bloodType,
        medicalHistory: data.medicalHistory || null,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        jerseyId: data.jerseyId || null,
        selectedSize: data.selectedSize || null,
        communityName: data.communityName || null,
        bibNumber: data.bibNumber || null,
      },
    });

    await prisma.log.create({
      data: {
        action: 'PARTICIPANT_MANUAL_CREATE',
        description: `Admin mendaftarkan peserta manual: ${participant.fullNameKtp} (${participant.nik})`,
        adminId: req.admin?.adminId,
        entityType: 'Participant',
        entityId: participant.id,
      },
    }).catch(() => null);

    return res.status(201).json({
      status: 'success',
      message: 'Peserta berhasil didaftarkan.',
      data: participant,
    });
  } catch (error) {
    console.error('🚨 [CREATE PARTICIPANT ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menambahkan peserta.' });
  }
};

export const updateParticipant = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const parseResult = participantAdminSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi update peserta gagal.',
        errors: parseResult.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    const existing = await prisma.participant.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Peserta tidak ditemukan.' });
    }

    const updatePayload: any = { ...parseResult.data };
    if (updatePayload.birthDate) {
      updatePayload.birthDate = new Date(updatePayload.birthDate);
    }

    const updated = await prisma.participant.update({
      where: { id },
      data: updatePayload,
      include: { event: true, jersey: true },
    });

    await prisma.log.create({
      data: {
        action: 'PARTICIPANT_UPDATE',
        description: `Admin memperbarui data peserta: ${updated.fullNameKtp}`,
        adminId: req.admin?.adminId,
        entityType: 'Participant',
        entityId: updated.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Data peserta berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    console.error('🚨 [UPDATE PARTICIPANT ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui data peserta.' });
  }
};

export const deleteParticipant = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const participant = await prisma.participant.findUnique({ where: { id } });
    if (!participant) {
      return res.status(404).json({ status: 'error', message: 'Peserta tidak ditemukan.' });
    }

    await prisma.participant.delete({ where: { id } });

    await prisma.log.create({
      data: {
        action: 'PARTICIPANT_DELETE',
        description: `Admin menghapus peserta: ${participant.fullNameKtp} (BIB: ${participant.bibNumber || '-'})`,
        adminId: req.admin?.adminId,
        entityType: 'Participant',
        entityId: id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Peserta '${participant.fullNameKtp}' berhasil dihapus.`,
    });
  } catch (error) {
    console.error('🚨 [DELETE PARTICIPANT ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus peserta.' });
  }
};

export const updateParticipantBib = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const { bibNumber } = req.body;

    if (!bibNumber || typeof bibNumber !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Nomor BIB wajib berupa teks valid.' });
    }

    const checkDuplicate = await prisma.participant.findFirst({
      where: { bibNumber, id: { not: id } },
    });
    if (checkDuplicate) {
      return res.status(400).json({
        status: 'error',
        message: `Nomor BIB ${bibNumber} sudah dipakai oleh peserta lain (${checkDuplicate.fullNameKtp}).`,
      });
    }

    const updated = await prisma.participant.update({
      where: { id },
      data: { bibNumber },
    });

    return res.status(200).json({
      status: 'success',
      message: `Nomor BIB berhasil diperbarui menjadi ${bibNumber}.`,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengubah nomor BIB.' });
  }
};
