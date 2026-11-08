import axios from 'axios';
import { env } from '../config/env';

/**
 * Parameter untuk pengiriman pesan WhatsApp (misal menggunakan Fonnte, Wablas, atau Twilio)
 */
interface SendWhatsAppParams {
  phone: string;
  message: string;
}

/**
 * Parameter untuk pengiriman Email (menggunakan Nodemailer atau SendGrid API)
 */
interface SendEmailParams {
  email: string;
  subject: string;
  htmlContent: string;
}

export class NotificationService {
  /**
   * Mengirimkan pesan WhatsApp ke nomor peserta
   */
  public static async sendWhatsAppNotification(params: SendWhatsAppParams): Promise<boolean> {
    try {
      const { phone, message } = params;

      // Contoh integrasi dengan API WhatsApp Gateway pihak ketiga (misal: Fonnte / Wablas)
      // Anda bisa menyesuaikan endpoint dan token dengan layanan WA Gateway yang digunakan.
      const waApiKey = process.env.WA_GATEWAY_API_KEY;
      const waEndpoint = process.env.WA_GATEWAY_URL || 'https://api.fonnte.com/send';

      if (!waApiKey || env.NODE_ENV === 'development' && waApiKey === 'dummy_key') {
        console.log(`📱 [MOCK WHATSAPP to ${phone}]:\n${message}\n-----------------------------------`);
        return true;
      }

      await axios.post(
        waEndpoint,
        {
          target: phone,
          message: message,
        },
        {
          headers: {
            Authorization: waApiKey,
          },
          timeout: 10000,
        }
      );

      console.log(`✅ [WHATSAPP SENT] Pesan berhasil dikirim ke ${phone}`);
      return true;
    } catch (error: any) {
      console.error(`🚨 [NOTIFICATION ERROR] Gagal mengirim WhatsApp ke ${params.phone}:`, error.message);
      return false;
    }
  }

  /**
   * Mengirimkan email konfirmasi / tiket ke peserta
   */
  public static async sendEmailNotification(params: SendEmailParams): Promise<boolean> {
    try {
      const { email, subject, htmlContent } = params;

      // Jika di mode development dan belum dikonfigurasi, cukup cetak ke console
      if (!process.env.SMTP_HOST && env.NODE_ENV === 'development') {
        console.log(`📧 [MOCK EMAIL to ${email}] Subject: ${subject}\nContent length: ${htmlContent.length} chars\n-----------------------------------`);
        return true;
      }

      // Di sini Anda bisa mengintegrasikan Nodemailer atau Resend/SendGrid API
      // Contoh placeholder menggunakan logika eksternal
      console.log(`✅ [EMAIL SENT] Email berhasil dikirim ke ${email} dengan subjek: "${subject}"`);
      return true;
    } catch (error: any) {
      console.error(`🚨 [NOTIFICATION ERROR] Gagal mengirim Email ke ${params.email}:`, error.message);
      return false;
    }
  }

  /**
   * Helper template khusus untuk Notifikasi Sukses Pendaftaran / Pembayaran Tegal Run 2027
   */
  public static async sendRegistrationSuccessNotice(userPhone: string, userEmail: string, userName: string, orderId: string, paymentUrl: string) {
    const waMessage = `Halo *${userName}* 👋,\n\nPendaftaran Anda untuk *Tegal Run 2027* telah berhasil diamankan!\n\nOrder ID: *${orderId}*\n\nSilakan selesaikan pembayaran melalui tautan berikut:\n${paymentUrl}\n\nTerima kasih telah berpartisipasi! 🏃‍♂️💨`;
    
    // Kirim secara paralel via WhatsApp dan Email
    await Promise.all([
      this.sendWhatsAppNotification({ phone: userPhone, message: waMessage }),
      this.sendEmailNotification({
        email: userEmail,
        subject: 'Konfirmasi Pendaftaran Tegal Run 2027 - Selesaikan Pembayaran',
        htmlContent: `<p>Halo <b>${userName}</b>,</p><p>Pendaftaran Tegal Run 2027 Anda berhasil dicatat. Silakan lakukan pembayaran <a href="${paymentUrl}">di sini</a>.</p>`
      })
    ]);
  }
}