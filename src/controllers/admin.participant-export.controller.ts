import type { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';

const filtersSchema = z.object({
  tab: z.enum(['ALL', 'SETTLED', 'PENDING', 'CANCELLED', 'RACEPACK_DONE', 'RACEPACK_PENDING']),
  category: z.enum(['', '5K', '10K']),
  search: z.string().max(200),
}).strict();

const headers = [
  'ID Peserta', 'Nama KTP', 'Nama BIB', 'Nomor BIB', 'NIK', 'Nomor HP Peserta',
  'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir (UTC)', 'Alamat', 'Negara',
  'Golongan Darah', 'Riwayat Kesehatan', 'Nama Kontak Darurat', 'Nomor Kontak Darurat',
  'Komunitas', 'ID Event', 'Nama Tiket', 'Kategori', 'Harga Event Saat Ini',
  'ID Jersey', 'Nama Jersey', 'Jenis Jersey', 'Ukuran Jersey', 'Tanggal Peserta Dibuat (UTC)',
  'ID Order', 'ID Order Midtrans', 'Status Order', 'Total Order', 'Tanggal Order Dibuat (UTC)',
  'Tanggal Order Diperbarui (UTC)', 'ID Pemesan', 'Nama Pemesan', 'Email Pemesan', 'Nomor HP Pemesan',
  'Status Racepack', 'Waktu Racepack', 'Petugas Racepack', 'Barang Racepack', 'Catatan Racepack',
];

function csvCell(value: unknown, preserveDigits = false): string {
  let text = value == null ? '' : value instanceof Date ? value.toISOString() : String(value);
  if ((preserveDigits && text) || /^[\t\r\n]/.test(text) || /^[\s\u0000-\u001f]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

async function writeChunk(res: Response, chunk: string): Promise<void> {
  if (res.destroyed) throw new Error('Unduhan terputus.');
  if (res.write(chunk)) return;
  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      res.removeListener('drain', onDrain);
      res.removeListener('close', onClose);
      res.removeListener('error', onError);
    };
    const onDrain = () => { cleanup(); resolve(); };
    const onClose = () => { cleanup(); reject(new Error('Unduhan terputus.')); };
    const onError = (error: Error) => { cleanup(); reject(error); };
    res.once('drain', onDrain);
    res.once('close', onClose);
    res.once('error', onError);
    if (res.destroyed) onClose();
  });
}

export async function exportParticipantsCsv(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = filtersSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ status: 'error', message: 'Filter ekspor tidak valid.' });
    return;
  }
  const { tab, category, search } = parsed.data;
  const query = search.trim().toLowerCase();
  try {
    await prisma.$transaction(async tx => {
      const setting = await tx.appSetting.findUnique({ where: { key: 'racepack_checkins' } });
      const checkins: Record<string, { checkedIn?: boolean; checkedInAt?: string; checkedInBy?: string; items?: unknown; notes?: string }> = setting?.value ? JSON.parse(setting.value) : {};
      if (!checkins || typeof checkins !== 'object' || Array.isArray(checkins)) throw new Error('Data racepack tidak valid.');
      res.setHeader('Cache-Control', 'private, no-store, max-age=0');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Disposition', 'attachment; filename="peserta-transaksi.csv"');
      res.type('text/csv');
      await writeChunk(res, `\uFEFF${headers.map(value => csvCell(value)).join(',')}\r\n`);
      let lastId: string | undefined;
      let count = 0;
      while (true) {
        const participants = await tx.participant.findMany({
          where: lastId ? { id: { gt: lastId } } : {},
          orderBy: { id: 'asc' },
          take: 500,
          include: {
            event: { select: { id: true, ticketName: true, category: true, price: true } },
            jersey: { select: { id: true, name: true, type: true } },
            order: { select: { id: true, midtransOrderId: true, status: true, totalAmount: true, createdAt: true, updatedAt: true, user: { select: { id: true, fullName: true, email: true, phoneNumber: true } } } },
          },
        });
        if (!participants.length) break;
        lastId = participants[participants.length - 1].id;
        for (const p of participants) {
          const checkin = checkins[p.id];
          const checkedIn = checkin?.checkedIn === true;
          const status = p.order.status;
          if (tab === 'SETTLED' && !['SETTLEMENT', 'CAPTURE', 'PAID'].includes(status)) continue;
          if (tab === 'PENDING' && status !== 'PENDING') continue;
          if (tab === 'CANCELLED' && !['CANCEL', 'EXPIRE', 'DENY', 'REFUND'].includes(status)) continue;
          if (tab === 'RACEPACK_DONE' && !checkedIn) continue;
          if (tab === 'RACEPACK_PENDING' && checkin?.checkedIn) continue;
          if (category && !p.event.category.includes(category)) continue;
          if (query && ![p.fullNameKtp, p.bibName, p.bibNumber, p.nik, p.order.midtransOrderId, p.emergencyContactPhone].some(value => value?.toLowerCase().includes(query))) continue;
          const values: unknown[] = [
            p.id, p.fullNameKtp, p.bibName, p.bibNumber, p.nik, p.phoneNumber,
            p.gender, p.birthPlace, p.birthDate, p.fullAddress, p.country, p.bloodType, p.medicalHistory,
            p.emergencyContactName, p.emergencyContactPhone, p.communityName, p.event.id, p.event.ticketName,
            p.event.category, p.event.price, p.jerseyId, p.jersey?.name, p.jersey?.type, p.selectedSize, p.createdAt,
            p.order.id, p.order.midtransOrderId, p.order.status, p.order.totalAmount, p.order.createdAt, p.order.updatedAt,
            p.order.user.id, p.order.user.fullName, p.order.user.email, p.order.user.phoneNumber,
            checkedIn ? 'Sudah diambil' : 'Belum diambil', checkin?.checkedInAt, checkin?.checkedInBy,
            Array.isArray(checkin?.items) ? JSON.stringify(checkin.items) : '', checkin?.notes,
          ];
          await writeChunk(res, `${values.map((value, index) => csvCell(value, [4, 5, 14, 34].includes(index))).join(',')}\r\n`);
          count++;
        }
        if (participants.length < 500) break;
      }
      await tx.log.create({
        data: {
          action: 'PARTICIPANTS_CSV_EXPORT',
          description: `Admin mengunduh ekspor peserta dan transaksi (${count} peserta).`,
          adminId: req.admin?.adminId,
          entityType: 'Participant',
          metadata: { count, tab, category, hasSearch: !!search },
        },
      });
    }, { isolationLevel: 'RepeatableRead', maxWait: 10_000, timeout: 120_000 });
    if (!res.destroyed) res.end();
  } catch (error) {
    console.error('[PARTICIPANT CSV EXPORT] Gagal mengekspor peserta:', error);
    if (res.headersSent) {
      res.destroy(error instanceof Error ? error : undefined);
      return;
    }
    res.removeHeader('Content-Disposition');
    res.status(500).json({ status: 'error', message: 'Gagal mengekspor peserta. Periksa log server.' });
  }
}
