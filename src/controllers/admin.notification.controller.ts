import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/database';
import axios from 'axios';
import { whatsappSessionService } from '../services/whatsapp-session.service';
import { sendOrderNotification } from '../services/notification.service';
import { createEmailTransport } from '../services/email.service';
import { DEFAULT_EMAIL_TEMPLATES } from '../services/email-templates';
import { queueManualPdfDelivery } from '../services/pdf-delivery.service';
import { z } from 'zod';
import { sendWithWhatsAppHistory } from '../services/whatsapp-history.service';

/**
 * 1. MENGAMBIL SELURUH PENGATURAN NOTIFIKASI & OTOMASI WHATSAPP / EMAIL
 */
export const getNotificationSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const keys = [
      'notif_channel',
      'pdf_delivery_channel',
      'wa_dispatch_mode', // 'AUTO' | 'MANUAL'
      'wa_gateway_url',
      'wa_api_token',
      'wa_sender_number',
      'email_smtp_host',
      'email_smtp_port',
      'email_smtp_user',
      'email_smtp_pass',
      'email_from_name',
      'template_msg_paid',
      'template_msg_pending',
      'template_msg_cancel',
      'template_email_paid',
      'template_email_pending',
      'template_email_cancel',
    ];

    const settings = await prisma.appSetting.findMany({
      where: { key: { in: keys } },
    });

    const config: Record<string, string> = {
      notif_channel: 'WA',
      pdf_delivery_channel: 'DISABLED',
      wa_dispatch_mode: 'AUTO',
      wa_gateway_url: '',
      wa_api_token: '',
      wa_sender_number: '',
      email_smtp_host: 'smtp.gmail.com',
      email_smtp_port: '587',
      email_smtp_user: '',
      email_smtp_pass: '',
      email_from_name: 'Panitia Resmi Tegal Run 2026',
      template_msg_paid: `Halo {fullName}! 🏃‍♂️🎉\n\nTerima kasih banyak telah menyelesaikan pembayaran pendaftaran Tegal Run 2026. Pembayaran tiket {ticketName} (Order ID: {orderId}) sebesar {totalAmount} telah BERHASIL diverifikasi dan LUNAS!\n\n📋 Detail Registrasi:\n• Kategori: {ticketName}\n• Nomor BIB Dada: {bibNumber}\n• Status Pembayaran: LUNAS (SETTLEMENT)\n\n📄 File E-Tiket Resmi (PDF):\nSilakan unduh dan simpan berkas E-Tiket resmi Anda melalui tautan berikut:\n👉 {eTicketUrl}\n\n🙏 Ucapan Terima Kasih:\nPanitia Tegal Run 2026 mengucapkan selamat bergabung kepada {fullName}! Persiapkan fisik dan stamina terbaik Anda. Sampai jumpa di garis start Alun-Alun Kota Tegal!\n\nSalam Hangat,\nPanitia Pelaksana Tegal Run 2026`,
      template_msg_pending: `Halo {fullName}! 👋\n\nPendaftaran tiket {ticketName} (Order ID: {orderId}) sebesar {totalAmount} telah kami terima dan saat ini sedang MENUNGGU PEMBAYARAN.\n\nSegera selesaikan transaksi Anda sebelum batas waktu habis melalui tautan pembayaran resmi berikut:\n👉 {paymentUrl}\n\nSetelah pembayaran terverifikasi, E-Tiket dapat dibuka dan disimpan sebagai PDF melalui halaman E-Tiket.\n\nTerima kasih,\nPanitia Tegal Run 2026`,
      template_msg_cancel: `Halo {fullName},\n\nPesanan tiket {ticketName} (Order ID: {orderId}) telah DIBATALKAN. Kuota tiket telah dikembalikan ke sistem.`,
      template_email_paid: DEFAULT_EMAIL_TEMPLATES.PAID,
      template_email_pending: DEFAULT_EMAIL_TEMPLATES.PENDING,
      template_email_cancel: DEFAULT_EMAIL_TEMPLATES.CANCEL,
    };

    settings.forEach((s) => {
      config[s.key] = s.value;
    });

    // Ambil juga status sesi WhatsApp Web
    const waSession = await whatsappSessionService.getSession();

    return res.status(200).json({
      status: 'success',
      data: {
        ...config,
        email_template_defaults: DEFAULT_EMAIL_TEMPLATES,
        wa_session: waSession,
      },
    });
  } catch (error: any) {
    console.error('🚨 [GET NOTIF SETTINGS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil pengaturan notifikasi dari database.',
    });
  }
};

/**
 * 2. MENYIMPAN PENGATURAN NOTIFIKASI & OTOMASI WHATSAPP / EMAIL
 */
export const updateNotificationSettings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const payload = req.body?.settings || req.body || {};

    const allowedKeys = [
      'notif_channel',
      'pdf_delivery_channel',
      'wa_dispatch_mode',
      'wa_gateway_url',
      'wa_api_token',
      'wa_sender_number',
      'email_smtp_host',
      'email_smtp_port',
      'email_smtp_user',
      'email_smtp_pass',
      'email_from_name',
      'template_msg_paid',
      'template_msg_pending',
      'template_msg_cancel',
      'template_email_paid',
      'template_email_pending',
      'template_email_cancel',
    ];

    if (payload.pdf_delivery_channel !== undefined && !['DISABLED', 'WA', 'EMAIL', 'BOTH'].includes(payload.pdf_delivery_channel)) {
      return res.status(400).json({ status: 'error', message: 'Pilihan saluran PDF tidak valid.' });
    }
    for (const key of allowedKeys) {
      if (payload[key] !== undefined) {
        await prisma.appSetting.upsert({
          where: { key },
          update: { value: String(payload[key]) },
          create: { key, value: String(payload[key]) },
        });
      }
    }

    await prisma.log.create({
      data: {
        action: 'NOTIFICATION_SETTINGS_UPDATE',
        description: `Admin (${req.admin?.username || 'admin'}) memperbarui pengaturan notifikasi: ${allowedKeys.filter(key => payload[key] !== undefined).join(', ')}.`,
        adminId: req.admin?.adminId,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Konfigurasi notifikasi WhatsApp & Email berhasil diperbarui!',
    });
  } catch (error: any) {
    console.error('🚨 [UPDATE NOTIF SETTINGS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menyimpan pengaturan notifikasi ke database.',
    });
  }
};

/**
 * 3. WHATSAPP WEB SESSION CONTROLLERS (QR CODE, PAIRING, STATUS, DISCONNECT)
 */
export const getWhatsAppSessionStatus = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const session = await whatsappSessionService.getSession();
    return res.status(200).json({
      status: 'success',
      data: session,
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const generateWhatsAppQr = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const session = await whatsappSessionService.generateQrCode();
    return res.status(200).json({
      status: 'success',
      message: 'QR Code WhatsApp Web resmi berhasil dimuat. Pindai melalui WhatsApp > Perangkat Tertaut (Linked Devices) di ponsel Anda.',
      data: session,
    });
  } catch (error: any) {
    return res.status(400).json({ status: 'error', message: error.message });
  }
};

export const disconnectWhatsAppSession = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const session = await whatsappSessionService.disconnectSession();

    await prisma.log.create({
      data: {
        action: 'WHATSAPP_SESSION_DISCONNECTED',
        description: `Sesi WhatsApp Web diputuskan oleh admin (${req.admin?.username || 'admin'}).`,
        adminId: req.admin?.adminId,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Sesi WhatsApp Web telah berhasil diputuskan.',
      data: session,
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * 4. LOG PENGIRIMAN NOTIFIKASI & STATUS PENGIRIMAN DATA PESERTA
 */
export const getNotificationLogs = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const search = req.query.search ? String(req.query.search).trim() : '';
    if (search.length > 200) return res.status(400).json({ status: 'error', message: 'Pencarian maksimal 200 karakter.' });
    const statusFilter = req.query.status ? String(req.query.status).trim() : ''; // 'SENT', 'UNSENT'

    // Cari di database sebelum membatasi jumlah order yang ditampilkan.
    const orders = await prisma.order.findMany({
      where: search ? {
        OR: [
          { id: { contains: search } },
          { midtransOrderId: { contains: search } },
          { user: { fullName: { contains: search } } },
          { user: { phoneNumber: { contains: search } } },
          { user: { email: { contains: search } } },
          { participants: { some: { fullNameKtp: { contains: search } } } },
          { participants: { some: { bibNumber: { contains: search } } } },
        ],
      } : {},
      include: {
        user: true,
        participants: {
          include: { event: true },
        },
        pdfDeliveries: { select: { channel: true, status: true, error: true, updatedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 150,
    });

    // 2. Ambil seluruh log pengiriman notifikasi
    const dispatchLogs = await prisma.log.findMany({
      where: {
        entityId: { in: orders.map(order => order.id) },
        action: {
          in: ['NOTIFICATION_DISPATCH', 'NOTIFICATION_PENDING_MANUAL'],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Petakan log terakhir per orderId
    const logMap: Record<string, any> = {};
    dispatchLogs.forEach((l) => {
      if (l.entityId && !logMap[l.entityId]) {
        logMap[l.entityId] = {
          ...l,
          metadata: l.metadata as any,
        };
      }
    });

    // Susun data daftar peserta dan status notifikasinya
    let items = orders.map((ord) => {
      const firstP = ord.participants[0];
      const log = logMap[ord.id];
      const isSent = log?.metadata?.whatsappSent === true || log?.metadata?.emailSent === true;
      const isPendingManual = log?.action === 'NOTIFICATION_PENDING_MANUAL' || (!log && ord.status === 'PENDING');

      let deliveryStatus: 'SENT' | 'PENDING' | 'FAILED' = 'PENDING';
      if (isSent) {
        deliveryStatus = 'SENT';
      } else if (log && !isSent && log.action === 'NOTIFICATION_DISPATCH') {
        deliveryStatus = 'FAILED';
      }

      return {
        orderId: ord.id,
        midtransOrderId: ord.midtransOrderId || ord.id,
        orderStatus: ord.status,
        customerName: ord.user?.fullName || firstP?.fullNameKtp || 'Pelari',
        customerPhone: ord.user?.phoneNumber || firstP?.emergencyContactPhone || '-',
        customerEmail: ord.user?.email || '-',
        participantCount: ord.participants.length,
        ticketCategory: firstP?.event?.category || '10K',
        ticketName: firstP?.event?.ticketName || 'Tegal Run 2026',
        bibNumbers: ord.participants.map((p) => p.bibNumber).filter(Boolean).join(', ') || '-',
        totalAmount: Number(ord.totalAmount),
        createdAt: ord.createdAt,
        deliveryStatus,
        whatsappSent: log?.metadata?.whatsappSent ?? false,
        emailSent: log?.metadata?.emailSent ?? false,
        lastDispatchedAt: log?.metadata?.sentAt || (isSent ? log?.createdAt : null),
        lastError: log?.metadata?.errors?.[0] || null,
        isManualPending: isPendingManual,
        pdfDeliveries: ord.pdfDeliveries,
      };
    });

    if (statusFilter === 'SENT') {
      items = items.filter((it) => it.deliveryStatus === 'SENT');
    } else if (statusFilter === 'UNSENT') {
      items = items.filter((it) => it.deliveryStatus !== 'SENT');
    }

    // Hitung ringkasan statistik
    const totalOrders = orders.length;
    const sentCount = orders.filter((o) => logMap[o.id]?.metadata?.whatsappSent || logMap[o.id]?.metadata?.emailSent).length;
    const pendingCount = totalOrders - sentCount;

    const [dispatchModeSetting, channelSetting] = await Promise.all([
      prisma.appSetting.findUnique({ where: { key: 'wa_dispatch_mode' } }),
      prisma.appSetting.findUnique({ where: { key: 'notif_channel' } }),
    ]);
    const notificationChannel = channelSetting?.value ?? 'WA';
    if (!['WA', 'EMAIL', 'BOTH', 'DISABLED'].includes(notificationChannel)) {
      throw new Error('Saluran notifikasi yang tersimpan tidak valid.');
    }

    return res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalOrders,
          sentCount,
          pendingCount,
          dispatchMode: dispatchModeSetting?.value || 'AUTO',
          notificationChannel,
        },
        items,
      },
    });
  } catch (error: any) {
    console.error('🚨 [GET NOTIF LOGS ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memuat log pengiriman notifikasi.',
    });
  }
};

/**
 * 5. PENGIRIMAN MANUAL NOTIFIKASI UNTUK 1 ORDER
 */
export const dispatchSingleNotification = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ status: 'error', message: 'Parameter orderId wajib disertakan.' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
    }

    const type = order.status === 'SETTLEMENT' || order.status === 'CAPTURE' ? 'PAID' : (order.status === 'CANCEL' ? 'CANCEL' : 'PENDING');

    const result = await sendOrderNotification({
      orderId,
      type,
      isManualTrigger: true,
      siteOrigin: req.get('origin'),
    });

    return res.status(200).json({
      status: result.whatsappSent || result.emailSent || result.pdfQueued ? 'success' : 'error',
      message: result.whatsappSent || result.emailSent || result.pdfQueued
        ? `Notifikasi diproses.${result.pdfQueued ? ' PDF dimasukkan ke antrean; lihat status PDF pada log.' : ''}`
        : `Tidak ada pengiriman baru yang berhasil. ${result.errors.join(' ')}`,
      data: result,
    });
  } catch (error: any) {
    console.error('🚨 [DISPATCH NOTIF ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Gagal mengirimkan notifikasi.',
    });
  }
};

class PdfResendConfirmationRequired extends Error {}

export const dispatchManualPdf = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  const parsed = z.object({
    orderId: z.string().trim().min(1).max(191),
    channel: z.enum(['WA', 'EMAIL', 'BOTH']),
    confirmResend: z.boolean().optional().default(false),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ status: 'error', message: 'ID pesanan atau pilihan saluran PDF tidak valid.' });
  }
  const { orderId, channel, confirmResend } = parsed.data;
  const channels = channel === 'BOTH' ? ['WA', 'EMAIL'] as const : [channel];
  try {
    const result = await prisma.$transaction(async tx => {
      const channelSetting = await tx.appSetting.findUnique({ where: { key: 'notif_channel' } });
      const configuredChannel = channelSetting?.value ?? 'WA';
      if (!['WA', 'EMAIL', 'BOTH', 'DISABLED'].includes(configuredChannel)) {
        throw new Error('Saluran notifikasi yang tersimpan tidak valid.');
      }
      if (configuredChannel === 'DISABLED') {
        return { error: 'Saluran pengiriman dinonaktifkan. Aktifkan saluran notifikasi di konfigurasi.', code: 400 };
      }
      if (configuredChannel !== channel) {
        return { error: 'Saluran pengiriman telah berubah. Segarkan log dan konfirmasi kembali.', code: 409 };
      }
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: { status: true, user: { select: { phoneNumber: true, email: true } }, _count: { select: { participants: true } } },
      });
      if (!order) return { error: 'Pesanan tidak ditemukan.', code: 404 };
      if (!['SETTLEMENT', 'CAPTURE'].includes(order.status) || !order._count.participants) {
        return { error: 'PDF hanya dapat dikirim untuk pesanan lunas yang memiliki peserta.', code: 400 };
      }
      if (channels.includes('WA') && !order.user.phoneNumber?.trim()) {
        return { error: 'Nomor WhatsApp pembeli tidak tersedia.', code: 400 };
      }
      if (channels.includes('EMAIL') && !order.user.email?.trim()) {
        return { error: 'Alamat email pembeli tidak tersedia.', code: 400 };
      }
      const statuses: Record<string, string> = {};
      for (const target of channels) {
        statuses[target] = await queueManualPdfDelivery(tx, orderId, target, confirmResend);
        if (!confirmResend && ['SENT', 'FAILED'].includes(statuses[target])) {
          throw new PdfResendConfirmationRequired();
        }
      }
      await tx.log.create({
        data: {
          action: 'PDF_DELIVERY_MANUAL_REQUEST',
          description: `Admin meminta pengiriman PDF untuk pesanan ${orderId}.`,
          entityType: 'Order',
          entityId: orderId,
          adminId: req.admin?.adminId,
          metadata: { channels: [...channels], statuses, confirmResend },
        },
      });
      return { statuses };
    });
    if ('error' in result && result.error) {
      return res.status(result.code).json({ status: 'error', message: result.error });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Permintaan PDF diproses. Periksa status setiap saluran di log.',
      data: { channels: result.statuses },
    });
  } catch (error) {
    if (error instanceof PdfResendConfirmationRequired) {
      return res.status(409).json({ status: 'error', message: 'Status PDF berubah atau sudah terkirim/gagal. Segarkan log dan konfirmasi pengiriman ulang.' });
    }
    console.error('[MANUAL PDF DISPATCH ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memasukkan PDF ke antrean.' });
  }
};

/**
 * 6. PENGIRIMAN MANUAL MASSAL (BATCH) UNTUK SEMUA PESERTA BELUM TERKIRIM
 */
export const dispatchBatchNotifications = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    // Ambil order yang berstatus SETTLEMENT atau PENDING
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['SETTLEMENT', 'PENDING'] },
      },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    let successCount = 0;
    let failedCount = 0;

    for (const ord of orders) {
      try {
        const type = ord.status === 'SETTLEMENT' ? 'PAID' : 'PENDING';
        const resDispatch = await sendOrderNotification({
          orderId: ord.id,
          type,
          isManualTrigger: true,
          siteOrigin: req.get('origin'),
        });
        if (resDispatch.whatsappSent || resDispatch.emailSent || resDispatch.pdfQueued) {
          successCount++;
        } else {
          failedCount++;
        }
      } catch {
        failedCount++;
      }
    }

    return res.status(200).json({
      status: 'success',
      message: `Proses batch selesai: ${successCount} diproses atau masuk antrean PDF, ${failedCount} gagal/pending. Periksa status PDF di log.`,
      data: { successCount, failedCount },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Gagal memproses batch pengiriman notifikasi.',
    });
  }
};

/**
 * 7. MENGIRIM PESAN UJI COBA (TEST NOTIFICATION)
 */
export const sendTestNotification = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { targetPhone, targetEmail, channel, message } = req.body;

    const notifChannel = channel || 'WA';
    let waSuccess = false;
    let emailSuccess = false;
    const errors: string[] = [];

    const testMessage = message || '🧪 [TEST] Ini adalah pesan uji coba dari Sistem Notifikasi Otomatis Tegal Run 2026.';

    if ((notifChannel === 'WA' || notifChannel === 'BOTH') && targetPhone) {
      try {
        await whatsappSessionService.sendMessage(targetPhone, testMessage);
        waSuccess = true;
      } catch (waErr: any) {
        console.warn('Test WA direct error:', waErr.message);
        errors.push(`WhatsApp Backend: ${waErr.message}`);
      }
    }

    if (notifChannel === 'EMAIL' || notifChannel === 'BOTH') {
      try {
        if (!targetEmail) throw new Error('Alamat email tujuan harus diisi.');
        const settings = await prisma.appSetting.findMany({
          where: { key: { in: ['email_smtp_host', 'email_smtp_port', 'email_smtp_user', 'email_smtp_pass', 'email_from_name'] } },
        });
        const cfg: Record<string, string> = {};
        settings.forEach(setting => { cfg[setting.key] = setting.value; });
        const transporter = createEmailTransport(cfg);
        await transporter.sendMail({
          from: { name: cfg.email_from_name || 'Panitia', address: cfg.email_smtp_user },
          to: targetEmail,
          subject: 'Uji coba notifikasi',
          text: testMessage,
        });
        emailSuccess = true;
      } catch (emailErr: any) {
        console.warn('Test email error:', emailErr.message);
        errors.push(`Email: ${emailErr.message}`);
      }
    }

    return res.status(200).json({
      status: waSuccess || emailSuccess ? 'success' : 'error',
      message: waSuccess || emailSuccess ? 'Pesan uji coba berhasil terkirim!' : `Pesan uji coba gagal terkirim. ${errors.join(' ')}`,
      data: {
        waSuccess,
        emailSuccess,
        errors,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Gagal mengirim pesan uji coba.',
    });
  }
};

/**
 * 7. KIRIM PESAN WHATSAPP LANGSUNG DARI ADMIN CONSOLE (LIVE CHAT)
 */
export const sendWhatsAppDirectMessage = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const parsed = z.object({ orderId: z.string().trim().min(1).max(191), message: z.string().trim().min(1).max(10000) }).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', message: 'Pesanan dan pesan (maksimal 10.000 karakter) wajib diisi.' });
    }
    const { orderId, message } = parsed.data;
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { user: { select: { phoneNumber: true } } } });
    if (!order) return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
    const phoneNumber = order.user.phoneNumber;
    if (!phoneNumber?.trim()) return res.status(400).json({ status: 'error', message: 'Nomor WhatsApp pembeli tidak tersedia.' });

    const isConnected = await whatsappSessionService.isConnected();
    if (!isConnected) {
      return res.status(400).json({
        status: 'error',
        message: 'WhatsApp belum terhubung. Silakan pindai QR Code terlebih dahulu.',
      });
    }

    await sendWithWhatsAppHistory(orderId, message, 'TEXT', () => whatsappSessionService.sendMessage(phoneNumber, message), req.admin?.adminId);

    return res.status(200).json({
      status: 'success',
      message: `Pesan WhatsApp berhasil dikirim ke ${phoneNumber}`,
    });
  } catch (error: any) {
    console.error('🚨 [DIRECT WA SEND ERROR]:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Gagal mengirim pesan WhatsApp.',
    });
  }
};

export const getWhatsAppHistory = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const orderId = z.string().trim().min(1).max(191).parse(req.params.orderId);
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true } });
    if (!order) return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
    const logs = await prisma.log.findMany({
      where: { action: 'WHATSAPP_CONSOLE_MESSAGE', entityType: 'Order', entityId: orderId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 100,
      select: { id: true, metadata: true, createdAt: true },
    });
    return res.status(200).json({ status: 'success', data: { items: logs.reverse(), limit: 100 } });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ status: 'error', message: 'ID pesanan tidak valid.' });
    console.error('[WHATSAPP HISTORY ERROR]', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memuat riwayat WhatsApp.' });
  }
};

export const clearWhatsAppHistory = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const orderId = z.string().trim().min(1).max(191).parse(req.params.orderId);
    const result = await prisma.$transaction(async tx => {
      const order = await tx.order.findUnique({ where: { id: orderId }, select: { id: true } });
      if (!order) return null;
      const deleted = await tx.log.deleteMany({ where: { action: 'WHATSAPP_CONSOLE_MESSAGE', entityType: 'Order', entityId: orderId } });
      await tx.log.create({ data: { action: 'WHATSAPP_CONSOLE_CLEAR', description: 'Riwayat console WhatsApp dibersihkan.', entityType: 'Order', entityId: orderId, adminId: req.admin?.adminId, metadata: { deletedCount: deleted.count } } });
      return deleted.count;
    });
    if (result === null) return res.status(404).json({ status: 'error', message: 'Pesanan tidak ditemukan.' });
    return res.status(200).json({ status: 'success', message: 'Riwayat console peserta dibersihkan.' });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ status: 'error', message: 'ID pesanan tidak valid.' });
    console.error('[WHATSAPP HISTORY CLEAR ERROR]', error);
    return res.status(500).json({ status: 'error', message: 'Gagal membersihkan riwayat console.' });
  }
};
