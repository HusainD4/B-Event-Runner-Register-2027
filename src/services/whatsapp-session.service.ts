import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  type WASocket,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import pino from 'pino';
import prisma from '../config/database';

export interface WhatsAppSessionState {
  status: 'DISCONNECTED' | 'SCAN_QR' | 'CONNECTED';
  qrCodeUrl: string | null;
  connectedNumber: string | null;
  deviceName: string | null;
  syncedAt: string | null;
  error?: string | null;
}

interface QrWaiter {
  resolve: (url: string) => void;
  reject: (err: Error) => void;
}

const AUTH_DIR = path.join(process.cwd(), 'auth_info_baileys');
const QR_TIMEOUT_MS = 60000;
const RECONNECT_DELAY_MS = 3000;
const AUTO_RECONNECT_DELAY_MS = 5000;
const MAX_QR_RETRIES = 3;

class WhatsAppSessionService {
  private sock: WASocket | null = null;
  private currentQrDataUrl: string | null = null;
  private currentStatus: WhatsAppSessionState['status'] = 'DISCONNECTED';
  private connectedNumber: string | null = null;
  private deviceName: string | null = null;
  private syncedAt: string | null = null;
  private isConnecting: boolean = false;
  private isDisconnecting: boolean = false;
  private qrWaiters: QrWaiter[] = [];
  private reconnectAttempts: number = 0;

  constructor() {
    this.ensureAuthDir();
    this.autoRestoreSession().catch((err) => {
      console.warn('⚠️ Gagal auto-restore sesi WhatsApp:', err.message);
    });
  }

  private ensureAuthDir() {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }
  }

  private hasStoredCredentials(): boolean {
    const credsPath = path.join(AUTH_DIR, 'creds.json');
    if (!fs.existsSync(credsPath)) return false;
    try {
      const data = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
      // Pastikan creds sudah benar-benar terdaftar (bukan file kosong hasil generate QR)
      return !!(data && data.me && data.me.id);
    } catch {
      return false;
    }
  }

  private async autoRestoreSession() {
    if (this.hasStoredCredentials()) {
      await this.initSocket();
    }
  }

  /**
   * Bersihkan socket lama dan putuskan sambungan sebelum membuat instance baru
   */
  private cleanUpExistingSocket() {
    if (this.sock) {
      try {
        this.sock.ev.removeAllListeners('connection.update');
        this.sock.ev.removeAllListeners('creds.update');
        this.sock.end(undefined);
      } catch {}
      this.sock = null;
    }
    this.isConnecting = false;
  }

  /**
   * Tolak semua request yang sedang menunggu QR dengan pesan error
   */
  private rejectAllQrWaiters(msg: string) {
    const err = new Error(msg);
    while (this.qrWaiters.length > 0) {
      this.qrWaiters.shift()?.reject(err);
    }
  }

  /**
   * Inisialisasi koneksi langsung WhatsApp Web (Baileys) tanpa pihak ketiga
   */
  async initSocket(): Promise<WASocket> {
    if (this.sock && this.currentStatus === 'CONNECTED') {
      return this.sock;
    }

    if (this.isConnecting && this.sock) {
      return this.sock;
    }

    // Bersihkan socket gantung sebelumnya agar tidak terjadi duplikasi koneksi (penyebab utama kode 428)
    this.cleanUpExistingSocket();
    this.isConnecting = true;
    this.ensureAuthDir();

    try {
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
      // Gunakan default versi Baileys v7.0.0 resmi (terbaru & teruji)
      let version: [number, number, number] = [2, 3000, 1043857760];

      try {
        const latest = await fetchLatestBaileysVersion();
        if (latest && Array.isArray(latest.version)) {
          version = latest.version;
        }
      } catch {
        // Fallback ke versi stabil
      }

      const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Desktop'),
        printQRInTerminal: false,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        syncFullHistory: false,
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: false,
      });

      this.sock = sock;

      sock.ev.on('creds.update', saveCreds);

      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // 1. QR Code diterbitkan oleh WhatsApp Server
        if (qr) {
          try {
            const qrDataUrl = await QRCode.toDataURL(qr, {
              margin: 2,
              scale: 8,
              color: { dark: '#000000', light: '#FFFFFF' },
            });

            this.currentQrDataUrl = qrDataUrl;
            this.currentStatus = 'SCAN_QR';
            this.reconnectAttempts = 0;

            // Segera kirimkan ke semua request yang sedang menunggu
            while (this.qrWaiters.length > 0) {
              this.qrWaiters.shift()?.resolve(qrDataUrl);
            }

            prisma.appSetting.upsert({
              where: { key: 'wa_session_status' },
              update: { value: 'SCAN_QR' },
              create: { key: 'wa_session_status', value: 'SCAN_QR' },
            }).catch(() => {});
          } catch (qrErr) {
            console.error('🚨 Gagal render QR DataURL:', qrErr);
          }
        }

        // 2. Koneksi Berhasil (Ponsel berhasil scan QR / sesi terotentikasi)
        if (connection === 'open') {
          this.currentStatus = 'CONNECTED';
          this.currentQrDataUrl = null;
          this.isConnecting = false;
          this.reconnectAttempts = 0;

          this.rejectAllQrWaiters('WhatsApp berhasil terhubung.');

          const rawId = sock.user?.id || '';
          const phoneNum = rawId.split(':')[0]?.split('@')[0] || '';
          this.connectedNumber = phoneNum ? `+${phoneNum}` : '+628xxxxxxxx';
          this.deviceName = 'WhatsApp Web (Backend Direct / macOS)';
          this.syncedAt = new Date().toISOString();

          const connectedSettings = [
            { key: 'wa_session_status', value: 'CONNECTED' },
            { key: 'wa_session_number', value: this.connectedNumber },
            { key: 'wa_session_device', value: this.deviceName },
            { key: 'wa_session_synced_at', value: this.syncedAt },
          ];

          for (const item of connectedSettings) {
            try {
              await prisma.appSetting.upsert({
                where: { key: item.key },
                update: { value: item.value },
                create: { key: item.key, value: item.value },
              });
            } catch {
              await prisma.appSetting.updateMany({
                where: { key: item.key },
                data: { value: item.value },
              }).catch(() => {});
            }
          }

          console.log(`✅ [WHATSAPP NATIVE] Terhubung sebagai ${this.connectedNumber}`);
        }

        // 3. Koneksi Terputus
        if (connection === 'close') {
          this.isConnecting = false;
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const isLoggedOut = statusCode === DisconnectReason.loggedOut;

          console.warn(`⚠️ [WHATSAPP NATIVE] Koneksi terputus. Kode: ${statusCode}. LoggedOut: ${isLoggedOut}`);

          // Bersihkan event listener socket lama agar tidak ada leak
          try {
            sock.ev.removeAllListeners('connection.update');
            sock.ev.removeAllListeners('creds.update');
            sock.end(undefined);
          } catch {}
          if (this.sock === sock) {
            this.sock = null;
          }

          if (isLoggedOut) {
            this.rejectAllQrWaiters('Sesi WhatsApp telah logout. Silakan scan QR Code baru.');
            await this.disconnectSession();
          } else {
            this.currentStatus = 'DISCONNECTED';

            if (this.qrWaiters.length > 0) {
              this.reconnectAttempts++;
              if (this.reconnectAttempts > MAX_QR_RETRIES) {
                this.rejectAllQrWaiters(`Koneksi ke WhatsApp Web terputus (Kode: ${statusCode || '428'}). Pastikan server backend memiliki akses internet ke web.whatsapp.com.`);
                this.reconnectAttempts = 0;
                return;
              }

              console.log(`🔄 [WHATSAPP NATIVE] Reconnecting untuk mendapatkan QR (${this.qrWaiters.length} waiter, percobaan ${this.reconnectAttempts}/${MAX_QR_RETRIES})...`);
              setTimeout(() => {
                if (this.qrWaiters.length > 0) {
                  this.initSocket().catch((err) => {
                    this.rejectAllQrWaiters(`Gagal terhubung ke WhatsApp: ${err.message}`);
                  });
                }
              }, RECONNECT_DELAY_MS);
            } else if (this.hasStoredCredentials()) {
              setTimeout(() => {
                if (this.currentStatus !== 'CONNECTED' && this.hasStoredCredentials()) {
                  this.initSocket().catch(() => {});
                }
              }, AUTO_RECONNECT_DELAY_MS);
            }
          }
        }
      });

      return sock;
    } catch (err: any) {
      this.isConnecting = false;
      this.sock = null;
      this.rejectAllQrWaiters(`Gagal inisialisasi socket: ${err.message}`);
      throw err;
    }
  }

  /**
   * Mengambil status sesi WhatsApp Web saat ini
   */
  async getSession(): Promise<WhatsAppSessionState> {
    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['wa_session_status', 'wa_session_number', 'wa_session_device', 'wa_session_synced_at'],
        },
      },
    });

    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });

    const status =
      this.currentStatus !== 'DISCONNECTED'
        ? this.currentStatus
        : ((map.wa_session_status as WhatsAppSessionState['status']) || 'DISCONNECTED');

    return {
      status,
      qrCodeUrl: status === 'SCAN_QR' ? this.currentQrDataUrl : null,
      connectedNumber: this.connectedNumber || map.wa_session_number || null,
      deviceName: this.deviceName || map.wa_session_device || null,
      syncedAt: this.syncedAt || map.wa_session_synced_at || null,
    };
  }

  /**
   * Menghasilkan / Mengambil QR Code Resmi dari WhatsApp Web Server langsung
   */
  async generateQrCode(): Promise<WhatsAppSessionState> {
    if (this.currentStatus === 'CONNECTED' && this.sock) {
      return this.getSession();
    }

    if (this.currentQrDataUrl && this.currentStatus === 'SCAN_QR') {
      return {
        status: 'SCAN_QR',
        qrCodeUrl: this.currentQrDataUrl,
        connectedNumber: null,
        deviceName: 'WhatsApp Web (Backend Direct)',
        syncedAt: new Date().toISOString(),
      };
    }

    this.reconnectAttempts = 0;
    this.cleanUpExistingSocket();
    this.currentQrDataUrl = null;

    const qrPromise = new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.qrWaiters = this.qrWaiters.filter((w) => w.resolve !== resolve);
        reject(
          new Error(
            'Waktu tunggu QR habis (60 detik). Pastikan server memiliki akses internet ke web.whatsapp.com dan coba lagi.'
          )
        );
      }, QR_TIMEOUT_MS);

      this.qrWaiters.push({
        resolve: (url: string) => {
          clearTimeout(timeout);
          resolve(url);
        },
        reject: (err: Error) => {
          clearTimeout(timeout);
          reject(err);
        },
      });
    });

    this.initSocket().catch((err) => {
      console.error('🚨 initSocket error:', err.message);
    });

    const qrDataUrl = await qrPromise;

    return {
      status: 'SCAN_QR',
      qrCodeUrl: qrDataUrl,
      connectedNumber: null,
      deviceName: 'WhatsApp Web (Backend Direct)',
      syncedAt: new Date().toISOString(),
    };
  }

  /**
   * Mengirim pesan teks langsung ke nomor tujuan via Baileys
   */
  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    if (!this.sock || this.currentStatus !== 'CONNECTED') {
      if (this.hasStoredCredentials()) {
        await this.initSocket();
        await new Promise((r) => setTimeout(r, 2000));
      }

      if (!this.sock || this.currentStatus !== 'CONNECTED') {
        throw new Error('WhatsApp Web belum terhubung. Silakan pindai (scan) QR Code terlebih dahulu di Portal Admin.');
      }
    }

    let clean = phoneNumber.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    if (!clean.startsWith('62')) clean = '62' + clean;

    const jid = `${clean}@s.whatsapp.net`;

    await this.sock.sendMessage(jid, { text: message });

    return true;
  }

  /**
   * Memutuskan sesi WhatsApp Web (Logout & Hapus Kredensial Lokal)
   */
  async disconnectSession(): Promise<WhatsAppSessionState> {
    if (this.isDisconnecting) {
      return this.getSession();
    }
    this.isDisconnecting = true;

    try {
      if (this.sock) {
        const s = this.sock;
        this.sock = null;
        // Hapus listeners agar tidak memicu event 'close' -> loop disconnect berulang
        s.ev.removeAllListeners('connection.update');
        s.ev.removeAllListeners('creds.update');
        await s.logout().catch(() => {});
        s.end(undefined);
      }
    } catch {}

    this.currentQrDataUrl = null;
    this.currentStatus = 'DISCONNECTED';
    this.connectedNumber = null;
    this.deviceName = null;
    this.syncedAt = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;

    if (fs.existsSync(AUTH_DIR)) {
      try {
        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      } catch (err: any) {
        console.warn('⚠️ Gagal menghapus folder auth:', err.message);
      }
    }

    const resetSettings = [
      { key: 'wa_session_status', value: 'DISCONNECTED' },
      { key: 'wa_session_number', value: '' },
      { key: 'wa_session_device', value: '' },
      { key: 'wa_session_synced_at', value: '' },
    ];

    for (const item of resetSettings) {
      try {
        await prisma.appSetting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value },
        });
      } catch {
        await prisma.appSetting.updateMany({
          where: { key: item.key },
          data: { value: item.value },
        }).catch(() => {});
      }
    }

    this.isDisconnecting = false;

    return {
      status: 'DISCONNECTED',
      qrCodeUrl: null,
      connectedNumber: null,
      deviceName: null,
      syncedAt: null,
    };
  }

  async isConnected(): Promise<boolean> {
    return this.currentStatus === 'CONNECTED' && !!this.sock;
  }
}

export const whatsappSessionService = new WhatsAppSessionService();
