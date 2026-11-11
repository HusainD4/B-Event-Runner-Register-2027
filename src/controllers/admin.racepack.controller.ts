import type { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import { decryptQrPayload } from '../services/qr-crypto.service';
import { getGlobalBibSettings, assignBibToParticipant } from '../services/bib.service';
import { emitDataChanged } from '../sockets';

const checkinSchema = z.object({
  participantId: z.string().min(1, 'Participant ID wajib diisi'),
  items: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const queueSchema = z.object({
  participantId: z.string().min(1, 'Participant ID wajib diisi'),
});

// Helper: ambil peta checkin dari app_settings
async function getRacepackCheckinsMap(): Promise<Record<string, any>> {
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'racepack_checkins' },
    });
    if (!setting || !setting.value) return {};
    return JSON.parse(setting.value);
  } catch {
    return {};
  }
}

// Helper: simpan peta checkin ke app_settings
async function saveRacepackCheckinsMap(map: Record<string, any>): Promise<void> {
  await prisma.appSetting.upsert({
    where: { key: 'racepack_checkins' },
    update: { value: JSON.stringify(map) },
    create: {
      key: 'racepack_checkins',
      value: JSON.stringify(map),
      description: 'Penyimpanan status check-in dan serah terima racepack peserta',
    },
  });
}

/**
 * Cari dan verifikasi data peserta berdasarkan kode QR / barcode / Order ID / BIB / NIK
 */
export const verifyRacepackCode = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const rawCode = String(req.params.code || req.query.code || '').trim();
    if (!rawCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Kode E-Tiket, Order ID, BIB, atau NIK tidak boleh kosong.',
      });
    }

    // Bisa berupa URL e-ticket e.g. http://localhost:5173/e-ticket.html?orderId=...
    let cleanCode = rawCode;
    try {
      if (rawCode.includes('orderId=')) {
        const url = new URL(rawCode.startsWith('http') ? rawCode : `http://localhost/${rawCode}`);
        const qOrderId = url.searchParams.get('orderId');
        if (qOrderId) cleanCode = qOrderId;
      }
    } catch {
      // ignore
    }

    // 1. Cek apakah format terenkripsi BEBASNAMA|enkripsi_teks
    if (cleanCode.includes('|')) {
      const parts = cleanCode.split('|').map((s) => s.trim()).filter(Boolean);
      const cipherCandidate = parts.length > 1 ? parts[1] : parts[0];
      const decrypted = decryptQrPayload(cipherCandidate);

      if (decrypted) {
        if (decrypted.t === 'master') {
          // Cari pesanan dan semua peserta di dalamnya untuk Master QR
          const order = await prisma.order.findFirst({
            where: {
              OR: [
                { id: decrypted.o },
                { midtransOrderId: decrypted.o },
              ],
            },
            include: {
              user: true,
              participants: {
                include: {
                  event: { include: { benefits: true } },
                  jersey: true,
                },
              },
            },
          });

          if (order && order.participants.length > 0) {
            const checkinsMap = await getRacepackCheckinsMap();
            const participantsWithCheckin = order.participants.map((pt: any) => ({
              ...pt,
              racepack: checkinsMap[pt.id] || { checkedIn: false },
            }));

            const isPaid = order.status === 'SETTLEMENT' || order.status === 'CAPTURE';
            return res.status(200).json({
              status: 'success',
              data: {
                isMaster: true,
                order,
                participants: participantsWithCheckin,
                isPaid,
              },
            });
          }
        } else if (decrypted.t === 'single') {
          // Cari peserta berdasarkan participant ID atau BIB/NIK dari hasil dekripsi
          const participant = await prisma.participant.findFirst({
            where: {
              OR: [
                { id: decrypted.p },
                ...(decrypted.b ? [{ bibNumber: decrypted.b }] : []),
                { nik: decrypted.n },
              ],
            },
            include: {
              event: { include: { benefits: true } },
              jersey: true,
              order: { include: { user: true } },
            },
          });

          if (participant) {
            const checkinsMap = await getRacepackCheckinsMap();
            const checkinInfo = checkinsMap[participant.id] || {
              checkedIn: false,
              checkedInAt: null,
              checkedInBy: null,
              items: [],
              notes: '',
            };
            const isPaid = participant.order?.status === 'SETTLEMENT' || participant.order?.status === 'CAPTURE';
            return res.status(200).json({
              status: 'success',
              data: {
                isMaster: false,
                participant,
                isPaid,
                racepack: checkinInfo,
              },
            });
          }
        }
      }
    }

    // Ekstrak kandidat jika format QR pipe-delimited unencrypted: PREFIX|ORDER_ID|BIB_NUMBER|NIK
    const candidates: string[] = [cleanCode];
    let candidateBib: string | null = null;
    let candidateNik: string | null = null;
    let candidateOrderId: string | null = null;

    if (cleanCode.includes('|')) {
      const parts = cleanCode.split('|').map((s) => s.trim()).filter(Boolean);
      for (const p of parts) {
        if (p !== 'TEGALRUN2027') {
          candidates.push(p);
        }
      }
      // Pemetaan standar jika format: TEGALRUN2027|ORDER_ID|BIB_NUMBER|NIK
      if (parts.length >= 2) {
        candidateOrderId = parts[1] || null;
      }
      if (parts.length >= 3) {
        candidateBib = parts[2] || null;
      }
      if (parts.length >= 4) {
        candidateNik = parts[3] || null;
      }
    }

    // Jika tidak mencari BIB / NIK spesifik, periksa apakah input merupakan Order ID dengan banyak peserta
    if (!candidateBib && !candidateNik) {
      const targetOrderSearch = candidateOrderId || cleanCode;
      const potentialOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { id: targetOrderSearch },
            { midtransOrderId: targetOrderSearch },
          ],
        },
        include: {
          user: true,
          participants: {
            include: {
              event: { include: { benefits: true } },
              jersey: true,
            },
          },
        },
      });

      if (potentialOrder && potentialOrder.participants.length > 1) {
        const checkinsMap = await getRacepackCheckinsMap();
        const participantsWithCheckin = potentialOrder.participants.map((pt: any) => ({
          ...pt,
          racepack: checkinsMap[pt.id] || { checkedIn: false },
        }));

        const isPaid = potentialOrder.status === 'SETTLEMENT' || potentialOrder.status === 'CAPTURE';
        return res.status(200).json({
          status: 'success',
          data: {
            isMaster: true,
            order: potentialOrder,
            participants: participantsWithCheckin,
            isPaid,
          },
        });
      }
    }

    // Bangun kueri pencarian berlapis
    // 1. Jika ada BIB spesifik (dan bukan default 0000/-)
    let participant = null;
    if (candidateBib && candidateBib !== '0000' && candidateBib !== '-') {
      participant = await prisma.participant.findFirst({
        where: { bibNumber: candidateBib },
        include: {
          event: {
            select: { id: true, ticketName: true, category: true, eventDate: true },
          },
          jersey: {
            select: { id: true, name: true, type: true },
          },
          order: {
            select: {
              id: true,
              midtransOrderId: true,
              totalAmount: true,
              status: true,
              createdAt: true,
              user: {
                select: { fullName: true, email: true, phoneNumber: true },
              },
            },
          },
        },
      });
    }

    // 2. Jika belum ditemukan dan ada NIK spesifik
    if (!participant && candidateNik) {
      participant = await prisma.participant.findFirst({
        where: {
          nik: candidateNik,
          ...(candidateOrderId
            ? {
                OR: [
                  { orderId: candidateOrderId },
                  { order: { midtransOrderId: candidateOrderId } },
                ],
              }
            : {}),
        },
        include: {
          event: {
            select: { id: true, ticketName: true, category: true, eventDate: true },
          },
          jersey: {
            select: { id: true, name: true, type: true },
          },
          order: {
            select: {
              id: true,
              midtransOrderId: true,
              totalAmount: true,
              status: true,
              createdAt: true,
              user: {
                select: { fullName: true, email: true, phoneNumber: true },
              },
            },
          },
        },
      });
    }

    // 3. Fallback: Cocokkan ke seluruh daftar kandidat
    if (!participant) {
      participant = await prisma.participant.findFirst({
        where: {
          OR: [
            { id: { in: candidates } },
            { bibNumber: { in: candidates } },
            { nik: { in: candidates } },
            { orderId: { in: candidates } },
            { order: { midtransOrderId: { in: candidates } } },
            { fullNameKtp: { in: candidates } },
          ],
        },
        include: {
          event: {
            select: { id: true, ticketName: true, category: true, eventDate: true },
          },
          jersey: {
            select: { id: true, name: true, type: true },
          },
          order: {
            select: {
              id: true,
              midtransOrderId: true,
              totalAmount: true,
              status: true,
              createdAt: true,
              user: {
                select: { fullName: true, email: true, phoneNumber: true },
              },
            },
          },
        },
      });
    }

    if (!participant) {
      return res.status(404).json({
        status: 'error',
        message: `Data peserta dengan kode "${cleanCode}" tidak ditemukan dalam sistem.`,
      });
    }

    const checkinsMap = await getRacepackCheckinsMap();
    const checkinInfo = checkinsMap[participant.id] || {
      checkedIn: false,
      checkedInAt: null,
      checkedInBy: null,
      items: [],
      notes: '',
    };

    const isPaid =
      participant.order?.status === 'SETTLEMENT' ||
      participant.order?.status === 'CAPTURE';

    return res.status(200).json({
      status: 'success',
      data: {
        participant,
        isPaid,
        racepack: checkinInfo,
      },
    });
  } catch (error: any) {
    console.error('verifyRacepackCode error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memverifikasi kode racepack: ' + error.message,
    });
  }
};

/**
 * Konfirmasi serah terima & check-in racepack
 */
export const checkinRacepack = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parseResult = checkinSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: parseResult.error.errors[0]?.message || 'Validasi gagal',
      });
    }

    const { participantId, items = [], notes = '' } = parseResult.data;

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: {
        order: { select: { status: true, midtransOrderId: true } },
        event: { select: { category: true } },
      },
    });

    if (!participant) {
      return res.status(404).json({
        status: 'error',
        message: 'Peserta tidak ditemukan.',
      });
    }

    const isPaid =
      participant.order?.status === 'SETTLEMENT' ||
      participant.order?.status === 'CAPTURE';

    // Verifikasi pembayaran lunas (kecuali superadmin override)
    const userRole = typeof req.user?.role === 'string' ? req.user.role : (req.user?.role as any)?.name;
    if (!isPaid && userRole !== 'SUPERADMIN') {
      return res.status(400).json({
        status: 'error',
        message: `Pembayaran belum lunas (Status: ${participant.order?.status}). Racepack hanya boleh diserahkan jika pembayaran telah terverifikasi.`,
      });
    }

    // Jika belum punya nomor BIB dan timing adalah RACEPACK_CHECKIN, generate otomatis sekarang
    const bibSettings = await getGlobalBibSettings();
    let currentBibNumber = participant.bibNumber;
    if (!currentBibNumber && bibSettings.timing === 'RACEPACK_CHECKIN') {
      currentBibNumber = await assignBibToParticipant(participant.id);
    }

    const checkinsMap = await getRacepackCheckinsMap();
    if (!checkinsMap[participant.id]?.queued) {
      return res.status(400).json({
        status: 'error',
        message: 'Data peserta belum dikirim ke tampilan antrean racepack.',
      });
    }
    const currentAdminId = req.admin?.adminId || req.user?.userId || null;
    const admin = currentAdminId
      ? await prisma.admin.findUnique({ where: { id: currentAdminId }, select: { fullName: true, username: true } })
      : null;
    const adminIdentifier = admin?.fullName || admin?.username || req.admin?.username || 'Petugas RPC';

    const checkinData = {
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
      checkedInBy: adminIdentifier,
      adminId: currentAdminId,
      queued: false,
      items: items.length > 0 ? items : [
        `Nomor BIB (${currentBibNumber || 'Ditetapkan'})`,
        `Jersey (${participant.selectedSize || 'M'})`,
        'Timing Chip PASI',
        'Goodie Bag & Panduan',
        'Suplemen Sponsor'
      ],
      notes,
    };

    checkinsMap[participant.id] = checkinData;
    await saveRacepackCheckinsMap(checkinsMap);
    emitDataChanged(['dashboard', 'racepack']);

    // Audit log
    await prisma.log.create({
      data: {
        action: 'RACEPACK_CHECKIN',
        description: `Serah terima racepack untuk peserta ${participant.fullNameKtp} (BIB: ${currentBibNumber || '-'}) berhasil dilakukan oleh ${adminIdentifier}`,
        adminId: currentAdminId,
        entityType: 'Participant',
        entityId: participant.id,
        metadata: checkinData,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: `Racepack berhasil diserahkan kepada ${participant.fullNameKtp}!`,
      data: {
        ...checkinData,
        bibNumber: currentBibNumber,
      },
    });
  } catch (error: any) {
    console.error('checkinRacepack error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal melakukan check-in racepack: ' + error.message,
    });
  }
};

export const enqueueRacepackCheckin = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parsed = queueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', message: parsed.error.errors[0]?.message || 'Data peserta tidak valid.' });
    }

    const participant = await prisma.participant.findUnique({
      where: { id: parsed.data.participantId },
      include: { order: { select: { status: true } } },
    });
    if (!participant) return res.status(404).json({ status: 'error', message: 'Peserta tidak ditemukan.' });
    if (!['SETTLEMENT', 'CAPTURE'].includes(participant.order?.status || '')) {
      return res.status(400).json({ status: 'error', message: 'Racepack hanya dapat diantrekan untuk pesanan yang sudah lunas.' });
    }

    const checkinsMap = await getRacepackCheckinsMap();
    if (checkinsMap[participant.id]?.checkedIn) {
      return res.status(409).json({ status: 'error', message: 'Racepack peserta ini sudah diserahkan.' });
    }

    const admin = req.admin?.adminId
      ? await prisma.admin.findUnique({ where: { id: req.admin.adminId }, select: { fullName: true, username: true } })
      : null;
    const adminIdentifier = admin?.fullName || admin?.username || req.admin?.username || 'Admin';
    checkinsMap[participant.id] = {
      ...(checkinsMap[participant.id] || {}),
      queued: true,
      queuedAt: new Date().toISOString(),
      queuedBy: adminIdentifier,
    };
    await saveRacepackCheckinsMap(checkinsMap);

    await prisma.log.create({
      data: {
        action: 'RACEPACK_QUEUED',
        description: `Data racepack peserta ${participant.fullNameKtp} dikirim ke tampilan antrean oleh ${adminIdentifier}.`,
        adminId: req.admin?.adminId,
        entityType: 'Participant',
        entityId: participant.id,
      },
    });

    return res.status(200).json({ status: 'success', message: 'Data peserta dikirim ke antrean racepack.' });
  } catch (error: any) {
    console.error('enqueueRacepackCheckin error:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengirim peserta ke antrean: ' + error.message });
  }
};

export const getRacepackQueue = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const [participants, checkinsMap] = await Promise.all([
      prisma.participant.findMany({
        where: { order: { status: { in: ['SETTLEMENT', 'CAPTURE'] } } },
        include: {
          event: { select: { ticketName: true, category: true } },
          jersey: { select: { name: true, type: true } },
          order: {
            select: {
              id: true,
              midtransOrderId: true,
              totalAmount: true,
              status: true,
              createdAt: true,
              user: { select: { fullName: true, email: true, phoneNumber: true } },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      getRacepackCheckinsMap(),
    ]);

    const queue = participants
      .filter(participant => checkinsMap[participant.id]?.queued && !checkinsMap[participant.id]?.checkedIn)
      .sort((a, b) => new Date(checkinsMap[a.id].queuedAt || a.createdAt).getTime() - new Date(checkinsMap[b.id].queuedAt || b.createdAt).getTime())
      .map(participant => ({
        ...participant,
        order: participant.order ? { ...participant.order, totalAmount: Number(participant.order.totalAmount) } : null,
        queue: checkinsMap[participant.id],
      }));

    return res.status(200).json({ status: 'success', data: queue });
  } catch (error: any) {
    console.error('getRacepackQueue error:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memuat antrean racepack.' });
  }
};

/**
 * Batalkan (revert) check-in racepack jika ada kesalahan
 */
export const revertRacepack = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { participantId } = req.body;
    if (!participantId) {
      return res.status(400).json({
        status: 'error',
        message: 'Participant ID wajib diisi.',
      });
    }

    const checkinsMap = await getRacepackCheckinsMap();
    if (checkinsMap[participantId]) {
      delete checkinsMap[participantId];
      await saveRacepackCheckinsMap(checkinsMap);
      emitDataChanged(['dashboard', 'racepack']);
    }

    // Audit log
    const revertAdminId = req.user?.userId || (req.user as any)?.id || null;
    const revertAdminEmail = req.user?.email || 'Admin';
    await prisma.log.create({
      data: {
        action: 'RACEPACK_REVERT',
        description: `Pembatalan check-in racepack peserta ID: ${participantId} oleh ${revertAdminEmail}`,
        adminId: revertAdminId,
        entityType: 'Participant',
        entityId: participantId,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Status check-in racepack berhasil dibatalkan.',
    });
  } catch (error: any) {
    console.error('revertRacepack error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal membatalkan check-in racepack: ' + error.message,
    });
  }
};

/**
 * Kirim seluruh peserta pada QR Master ke antrean konfirmasi.
 */
export const batchCheckinRacepack = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { orderId, participantIds = [] } = req.body;
    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Daftar ID peserta tidak boleh kosong.' });
    }

    const participants = await prisma.participant.findMany({
      where: { id: { in: participantIds } },
      include: {
        order: { select: { status: true, midtransOrderId: true } },
      },
    });

    const checkinsMap = await getRacepackCheckinsMap();
    const currentAdminId = req.admin?.adminId;
    const admin = currentAdminId
      ? await prisma.admin.findUnique({ where: { id: currentAdminId }, select: { fullName: true, username: true } })
      : null;
    const adminIdentifier = admin?.fullName || admin?.username || req.admin?.username || 'Petugas RPC';
    let queuedCount = 0;

    for (const p of participants) {
      const isPaid = p.order?.status === 'SETTLEMENT' || p.order?.status === 'CAPTURE';
      if (!isPaid || checkinsMap[p.id]?.checkedIn) continue;

      checkinsMap[p.id] = {
        ...(checkinsMap[p.id] || {}),
        queued: true,
        queuedAt: checkinsMap[p.id]?.queuedAt || new Date().toISOString(),
        queuedBy: adminIdentifier,
      };
      queuedCount++;
    }

    await saveRacepackCheckinsMap(checkinsMap);

    await prisma.log.create({
      data: {
        action: 'RACEPACK_BATCH_QUEUED',
        description: `${queuedCount} peserta pada pesanan ${orderId} dikirim ke antrean racepack oleh ${adminIdentifier}`,
        adminId: currentAdminId,
        metadata: { orderId, count: queuedCount },
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `${queuedCount} peserta dikirim ke antrean konfirmasi racepack.`,
      data: { count: queuedCount, queuedCount },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal check-in massal: ' + error.message });
  }
};


/**
 * Ringkasan statistik & daftar checkin racepack
 */
export const getRacepackStats = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const [totalParticipants, paidParticipants] = await Promise.all([
      prisma.participant.count(),
      prisma.participant.count({
        where: {
          order: {
            status: { in: ['SETTLEMENT', 'CAPTURE'] },
          },
        },
      }),
    ]);

    const checkinsMap = await getRacepackCheckinsMap();
    const checkedInCount = Object.values(checkinsMap).filter((checkin: any) => checkin?.checkedIn).length;
    const remainingToCollect = Math.max(0, paidParticipants - checkedInCount);

    return res.status(200).json({
      status: 'success',
      data: {
        totalParticipants,
        paidParticipants,
        checkedInCount,
        remainingToCollect,
        percentage: paidParticipants > 0 ? Math.round((checkedInCount / paidParticipants) * 100) : 0,
      },
    });
  } catch (error: any) {
    console.error('getRacepackStats error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memuat statistik racepack: ' + error.message,
    });
  }
};
