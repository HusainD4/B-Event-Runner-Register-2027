import type { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';
import {
  getGlobalBibSettings,
  saveGlobalBibSettings,
  bulkGenerateBibs,
  type BibGenerationTiming,
} from '../services/bib.service';
import { getQrPrefix, saveQrPrefix } from '../services/qr-crypto.service';
import { DEFAULT_INSTRUCTIONS, loadRacepackInstructions } from '../services/racepack-instructions.service';

/**
 * 1. Ambil Pengaturan BIB Lengkap (Global + Daftar Event Config)
 */
export const getAdminBibSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const globalSettings = await getGlobalBibSettings();
    const qrPrefix = await getQrPrefix();

    const events = await prisma.event.findMany({
      include: {
        bibConfig: true,
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const unassignedCount = await prisma.participant.count({
      where: {
        bibNumber: null,
        order: { status: { in: ['SETTLEMENT', 'CAPTURE'] } },
      },
    });

    const assignedCount = await prisma.participant.count({
      where: {
        bibNumber: { not: null },
      },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        settings: globalSettings,
        qrPrefix,
        events,
        unassignedCount,
        assignedCount,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil pengaturan BIB: ' + err.message });
  }
};

/**
 * 2. Simpan Pengaturan Global BIB
 */
export const saveAdminBibSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { timing, defaultPrefix, digitLength, startNumber, suffix } = req.body;

    const updated = await saveGlobalBibSettings({
      timing: timing as BibGenerationTiming,
      defaultPrefix,
      digitLength: digitLength ? Number(digitLength) : undefined,
      startNumber: startNumber ? Number(startNumber) : undefined,
      suffix,
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE_BIB_SETTINGS',
        description: `Admin memperbarui aturan penomoran BIB (Timing: ${updated.timing}, Format: ${updated.defaultPrefix}####${updated.suffix || ''})`,
        adminId: req.user?.userId || null,
        metadata: updated as any,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Pengaturan aturan penomoran BIB berhasil disimpan!',
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal menyimpan pengaturan BIB: ' + err.message });
  }
};

/**
 * 3. Eksekusi Generate BIB Massal
 */
export const triggerBulkGenerateBib = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { eventId } = req.body;
    const result = await bulkGenerateBibs(eventId);

    await prisma.log.create({
      data: {
        action: 'BULK_GENERATE_BIB',
        description: `Admin melakukan generate massal nomor BIB: ${result.message}`,
        adminId: req.user?.userId || null,
        metadata: result as any,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: result.message,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal generate BIB: ' + err.message });
  }
};

/**
 * 4. Pengaturan Prefix & Format QR Code
 */
export const getAdminQrSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const prefix = await getQrPrefix();
    return res.status(200).json({
      status: 'success',
      data: { prefix, formatPattern: `${prefix}|##########` },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const saveAdminQrSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { prefix } = req.body;
    if (!prefix || !String(prefix).trim()) {
      return res.status(400).json({ status: 'error', message: 'Prefix QR code tidak boleh kosong.' });
    }

    const savedPrefix = await saveQrPrefix(prefix);

    await prisma.log.create({
      data: {
        action: 'UPDATE_QR_PREFIX',
        description: `Admin mengubah awalan QR Code E-Tiket menjadi: ${savedPrefix}`,
        adminId: req.user?.userId || null,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: `Awalan QR Code berhasil disimpan sebagai "${savedPrefix}". QR baru menggunakan format ${savedPrefix}|10_digit_acak.`,
      data: { prefix: savedPrefix },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * 5. Pengaturan Petunjuk Pengambilan Racepack & Race Day
 */
export const getRacepackInstructions = async (req: any, res: Response): Promise<any> => {
  try {
    return res.status(200).json({
      status: 'success',
      data: await loadRacepackInstructions(),
    });
  } catch (error) {
    console.error('[GET RACEPACK INSTRUCTIONS ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil petunjuk racepack.' });
  }
};

export const saveRacepackInstructions = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { title, points } = req.body;
    const cleanTitle = String(title || DEFAULT_INSTRUCTIONS.title).trim();
    const cleanPoints = Array.isArray(points)
      ? points.map((p) => String(p).trim()).filter(Boolean)
      : typeof points === 'string'
      ? points.split('\n').map((p) => p.trim()).filter(Boolean)
      : DEFAULT_INSTRUCTIONS.points;

    const dataToSave = {
      title: cleanTitle,
      points: cleanPoints,
    };

    await prisma.appSetting.upsert({
      where: { key: 'racepack_instructions' },
      update: { value: JSON.stringify(dataToSave) },
      create: {
        key: 'racepack_instructions',
        value: JSON.stringify(dataToSave),
        description: 'Petunjuk Pengambilan Racepack & Race Day pada E-Tiket',
      },
    });

    await prisma.log.create({
      data: {
        action: 'UPDATE_RPC_INSTRUCTIONS',
        description: 'Admin memperbarui teks petunjuk pengambilan racepack & race day',
        adminId: req.user?.userId || null,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Petunjuk pengambilan racepack berhasil diperbarui!',
      data: dataToSave,
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * 6. Pengaturan Biaya Layanan & Timer Pembayaran (Admin)
 */
export const getPaymentAndFeeSettings = async (req: any, res: Response): Promise<any> => {
  try {
    const [timerSetting, feeEnabledSetting, feeTypeSetting, feeAmountSetting] = await Promise.all([
      prisma.appSetting.findUnique({ where: { key: 'payment_timer_minutes' } }),
      prisma.appSetting.findUnique({ where: { key: 'fee_enabled' } }),
      prisma.appSetting.findUnique({ where: { key: 'fee_type' } }),
      prisma.appSetting.findUnique({ where: { key: 'fee_amount' } }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        paymentTimerMinutes: timerSetting ? parseInt(timerSetting.value, 10) || 30 : 30,
        feeEnabled: feeEnabledSetting ? feeEnabledSetting.value === 'true' : true,
        feeType: feeTypeSetting?.value || 'PER_TRANSACTION',
        feeAmount: feeAmountSetting ? Number(feeAmountSetting.value) || 0 : 5000,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const savePaymentAndFeeSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { paymentTimerMinutes, feeEnabled, feeType, feeAmount } = req.body;

    const timerVal = String(Math.max(5, parseInt(paymentTimerMinutes, 10) || 30));
    const feeEnabledVal = feeEnabled === true || feeEnabled === 'true' ? 'true' : 'false';
    const feeTypeVal = feeType === 'PER_TICKET' ? 'PER_TICKET' : 'PER_TRANSACTION';
    const feeAmountVal = String(Math.max(0, Number(feeAmount) || 0));

    await Promise.all([
      prisma.appSetting.upsert({
        where: { key: 'payment_timer_minutes' },
        update: { value: timerVal },
        create: { key: 'payment_timer_minutes', value: timerVal, description: 'Batas waktu pembayaran (menit)' },
      }),
      prisma.appSetting.upsert({
        where: { key: 'fee_enabled' },
        update: { value: feeEnabledVal },
        create: { key: 'fee_enabled', value: feeEnabledVal, description: 'Status aktif biaya layanan' },
      }),
      prisma.appSetting.upsert({
        where: { key: 'fee_type' },
        update: { value: feeTypeVal },
        create: { key: 'fee_type', value: feeTypeVal, description: 'Tipe biaya layanan (PER_TRANSACTION / PER_TICKET)' },
      }),
      prisma.appSetting.upsert({
        where: { key: 'fee_amount' },
        update: { value: feeAmountVal },
        create: { key: 'fee_amount', value: feeAmountVal, description: 'Nominal biaya layanan (Rupiah)' },
      }),
    ]);

    await prisma.log.create({
      data: {
        action: 'UPDATE_PAYMENT_FEE_SETTINGS',
        description: `Admin memperbarui pengaturan pembayaran: Timer ${timerVal}m, Biaya ${feeEnabledVal === 'true' ? `Rp ${feeAmountVal} (${feeTypeVal})` : 'Nonaktif'}`,
        adminId: req.user?.userId || null,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Pengaturan biaya layanan dan timer pembayaran berhasil disimpan!',
      data: {
        paymentTimerMinutes: parseInt(timerVal, 10),
        feeEnabled: feeEnabledVal === 'true',
        feeType: feeTypeVal,
        feeAmount: Number(feeAmountVal),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
