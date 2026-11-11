import axios from 'axios';
import nodemailer from 'nodemailer';
import prisma from '../config/database';
import { whatsappSessionService } from './whatsapp-session.service';
import { allowedOrigins } from '../config/cors';

export interface NotificationPayload {
  orderId: string;
  type: 'PAID' | 'PENDING' | 'CANCEL';
  customNote?: string;
  isManualTrigger?: boolean;
  siteOrigin?: string;
}

function resolveSiteBaseUrl(siteOrigin?: string): string {
  if (siteOrigin) {
    try {
      const parsedOrigin = new URL(siteOrigin);
      const isExactOrigin = parsedOrigin.origin === siteOrigin;
      const isAllowedLocalOrigin = /^http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$/.test(siteOrigin);
      if (isExactOrigin && (allowedOrigins.includes(siteOrigin) || isAllowedLocalOrigin)) {
        return parsedOrigin.origin;
      }
    } catch {
      // Use the configured public URL when the request origin is malformed or untrusted.
    }
  }
  return (process.env.APP_URL || 'http://localhost:5173').replace(/\/+$/, '');
}

/**
 * Format string template dengan mengganti placeholder {key} dengan data aktual
 */
function compileTemplate(template: string, data: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, value != null ? String(value) : '');
  }
  return result;
}

/**
 * Mengirim notifikasi otomatis (WhatsApp & Email) untuk transaksi & tiket
 */
export async function sendOrderNotification(payload: NotificationPayload): Promise<{
  whatsappSent: boolean;
  emailSent: boolean;
  isManualPending?: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  let whatsappSent = false;
  let emailSent = false;

  try {
    // 1. Ambil data order, user & participants dari database
    const order = await prisma.order.findUnique({
      where: { id: payload.orderId },
      include: {
        user: true,
        participants: {
          include: { event: true },
        },
      },
    });

    if (!order) {
      errors.push(`Order ID ${payload.orderId} tidak ditemukan.`);
      return { whatsappSent: false, emailSent: false, errors };
    }

    // 2. Ambil seluruh konfigurasi notifikasi dari tabel app_settings
    const settingsList = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [
            'notif_channel',
            'wa_dispatch_mode', // 'AUTO' atau 'MANUAL'
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
          ],
        },
      },
    });

    const cfg: Record<string, string> = {};
    settingsList.forEach((s) => {
      cfg[s.key] = s.value;
    });

    const dispatchMode = cfg.wa_dispatch_mode || 'AUTO';

    // Cek apakah mode pengiriman adalah MANUAL dan bukan dipicu manual oleh admin
    if (dispatchMode === 'MANUAL' && !payload.isManualTrigger) {
      await prisma.log.create({
        data: {
          action: 'NOTIFICATION_PENDING_MANUAL',
          description: `Notifikasi ${payload.type} untuk ${order.user?.fullName || 'Peserta'} disimpan ke antrean pengiriman manual (Mode Manual Aktif).`,
          entityType: 'Order',
          entityId: order.id,
          metadata: {
            orderId: order.id,
            midtransOrderId: order.midtransOrderId,
            type: payload.type,
            customerName: order.user?.fullName,
            customerPhone: order.user?.phoneNumber,
            customerEmail: order.user?.email,
            status: 'PENDING_MANUAL',
            totalAmount: Number(order.totalAmount),
            createdAt: new Date().toISOString(),
          },
        },
      });

      return {
        whatsappSent: false,
        emailSent: false,
        isManualPending: true,
        errors: [],
      };
    }

    const channel = cfg.notif_channel || 'WA'; // 'WA', 'EMAIL', 'BOTH', 'DISABLED'
    if (channel === 'DISABLED') {
      return { whatsappSent: false, emailSent: false, errors: ['Notifikasi dinonaktifkan di pengaturan admin.'] };
    }

    const firstP = order.participants[0];
    const ticketName = firstP?.event?.ticketName || 'Tegal Run 2027';
    const bibNumbers = order.participants.map((p) => p.bibNumber).filter(Boolean).join(', ') || 'Sedang Diproses';
    const recipientPhone = order.user?.phoneNumber || firstP?.emergencyContactPhone;
    const recipientEmail = order.user?.email;
    const recipientName = order.user?.fullName || firstP?.fullNameKtp || 'Pelari';

    const baseUrl = resolveSiteBaseUrl(payload.siteOrigin);
    const eTicketUrl = `${baseUrl}/e-ticket.html?orderId=${order.id}`;
    const paymentUrl = `${baseUrl}/payment.html?orderId=${order.id}`;
    const pdfUrl = `${baseUrl}/e-ticket.html?orderId=${order.id}&print=pdf`;

    const templateData: Record<string, any> = {
      fullName: recipientName,
      ticketName,
      bibNumber: bibNumbers,
      orderId: order.midtransOrderId || order.id,
      totalAmount: `Rp ${Number(order.totalAmount).toLocaleString('id-ID')}`,
      status: order.status,
      eTicketUrl,
      paymentUrl,
      pdfUrl,
      participantCount: order.participants.length,
      note: payload.customNote || '',
    };

    // Default template pesan otomatis lengkap dengan status pembayaran, link file E-Tiket PDF, dan ucapan terima kasih
    const defaultTemplates = {
      PAID: `Halo {fullName}! 🏃‍♂️🎉\n\nTerima kasih banyak telah menyelesaikan pembayaran pendaftaran Tegal Run 2027. Pembayaran tiket {ticketName} (Order ID: {orderId}) sebesar {totalAmount} telah BERHASIL diverifikasi dan LUNAS!\n\n📋 Detail Registrasi:\n• Kategori: {ticketName}\n• Nomor BIB Dada: {bibNumber}\n• Status Pembayaran: LUNAS (SETTLEMENT)\n\n📄 File E-Tiket Resmi (PDF):\nSilakan unduh dan simpan berkas E-Tiket resmi Anda melalui tautan berikut:\n👉 {eTicketUrl}\n\n🙏 Ucapan Terima Kasih:\nPanitia Tegal Run 2027 mengucapkan selamat bergabung kepada {fullName}! Persiapkan fisik dan stamina terbaik Anda. Sampai jumpa di garis start Alun-Alun Kota Tegal!\n\nSalam Hangat,\nPanitia Pelaksana Tegal Run 2027`,
      PENDING: `Halo {fullName}! 👋\n\nPendaftaran tiket {ticketName} (Order ID: {orderId}) sebesar {totalAmount} telah kami terima dan saat ini sedang MENUNGGU PEMBAYARAN.\n\nSegera selesaikan transaksi Anda sebelum batas waktu habis melalui tautan pembayaran resmi berikut:\n👉 {paymentUrl}\n\nSetelah pembayaran terverifikasi, sistem akan otomatis mengirimkan E-Tiket resmi dalam format digital PDF beserta nomor BIB Anda.\n\nTerima kasih,\nPanitia Tegal Run 2027`,
      CANCEL: `Halo {fullName},\n\nPesanan tiket {ticketName} (Order ID: {orderId}) telah DIBATALKAN. Kuota tiket telah dilepaskan kembali ke sistem.\n\nJika ingin mendaftar kembali, silakan kunjungi website resmi Tegal Run 2027.`,
    };

    let messageBody = '';
    if (payload.type === 'PAID') {
      messageBody = compileTemplate(cfg.template_msg_paid || defaultTemplates.PAID, templateData);
    } else if (payload.type === 'PENDING') {
      messageBody = compileTemplate(cfg.template_msg_pending || defaultTemplates.PENDING, templateData);
    } else {
      messageBody = compileTemplate(cfg.template_msg_cancel || defaultTemplates.CANCEL, templateData);
    }

    // 3. Eksekusi Pengiriman WhatsApp Langsung dari Backend (Tanpa Pihak Ketiga)
    if ((channel === 'WA' || channel === 'BOTH') && recipientPhone) {
      try {
        await whatsappSessionService.sendMessage(recipientPhone, messageBody);
        whatsappSent = true;
      } catch (waErr: any) {
        console.warn('⚠️ [WA DIRECT SEND ERROR]:', waErr.message);
        errors.push(`WhatsApp Backend: ${waErr.message}`);
      }
    }

    // 4. Eksekusi Pengiriman Email jika channel EMAIL atau BOTH
    if ((channel === 'EMAIL' || channel === 'BOTH') && recipientEmail && cfg.email_smtp_host) {
      try {
        const transporter = nodemailer.createTransport({
          host: cfg.email_smtp_host,
          port: parseInt(cfg.email_smtp_port || '587', 10),
          secure: parseInt(cfg.email_smtp_port || '587', 10) === 465,
          auth: {
            user: cfg.email_smtp_user,
            pass: cfg.email_smtp_pass,
          },
        });

        const fromName = cfg.email_from_name || 'Tegal Run 2027';
        const subject =
          payload.type === 'PAID'
            ? `✅ E-Tiket Resmi Lunas & Berkas PDF: ${ticketName} - ${recipientName}`
            : payload.type === 'PENDING'
            ? `⏳ Menunggu Pembayaran: ${ticketName} - ${recipientName}`
            : `❌ Pesanan Dibatalkan: ${ticketName} - ${recipientName}`;

        const htmlBody = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
            <div style="background: #FF6B00; color: #FFF; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 1.4rem;">TEGAL RUN 2027</h2>
              <p style="margin: 4px 0 0; font-size: 0.9rem; opacity: 0.9;">Notifikasi Resmi Tiket & Pembayaran</p>
            </div>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 0.95rem;">${messageBody}</pre>
            <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #E2E8F0; font-size: 0.8rem; color: #64748B; text-align: center;">
              Pesan ini dikirim secara otomatis oleh Sistem Portal Resmi Tegal Run 2027.
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"${fromName}" <${cfg.email_smtp_user}>`,
          to: recipientEmail,
          subject,
          text: messageBody,
          html: htmlBody,
        });
        emailSent = true;
      } catch (emailErr: any) {
        console.warn('⚠️ [EMAIL NOTIF ERROR]:', emailErr.message);
        errors.push(`Email: ${emailErr.message}`);
      }
    }

    // 5. Catat Log Pengiriman Notifikasi ke Tabel Log
    await prisma.log.create({
      data: {
        action: 'NOTIFICATION_DISPATCH',
        description: `Notifikasi ${payload.type} dikirim ke ${recipientName} (${recipientPhone || '-'} / ${recipientEmail || '-'}). WA: ${whatsappSent ? 'SUKSES' : 'GAGAL/SKIP'}, Email: ${emailSent ? 'SUKSES' : 'GAGAL/SKIP'}. Mode: ${payload.isManualTrigger ? 'MANUAL (ADMIN)' : 'OTOMATIS'}`,
        entityType: 'Order',
        entityId: order.id,
        metadata: {
          channel,
          type: payload.type,
          recipientPhone,
          recipientEmail,
          recipientName,
          orderId: order.id,
          midtransOrderId: order.midtransOrderId,
          ticketName,
          totalAmount: Number(order.totalAmount),
          whatsappSent,
          emailSent,
          isManual: !!payload.isManualTrigger,
          errors,
          sentAt: new Date().toISOString(),
        },
      },
    });

    return { whatsappSent, emailSent, isManualPending: false, errors };
  } catch (err: any) {
    console.error('🚨 [NOTIFICATION SERVICE FATAL ERROR]:', err);
    errors.push(err.message);
    return { whatsappSent: false, emailSent: false, errors };
  }
}
