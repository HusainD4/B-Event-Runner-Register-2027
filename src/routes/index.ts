import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../config/database';

// Import sub-rute utama
import registerRoutes from './register.routes';
import webhookRoutes from './webhook.routes';
import eventRoutes from './event.routes';
import adminRoutes from './admin.routes';
import { getPublicCountdownSettings, getWebsiteSettings, getPublicCheckoutConfig } from '../controllers/settings.controller';
import { getRouteOverview, getRoutePoints } from '../controllers/route.controller';
import {
  searchTickets,
  getETicketData,
  cancelOrder,
  syncMidtransStatus,
  getOrderSnapToken,
} from '../controllers/ticket.controller';

const router = Router();

// Health check untuk router API
let readiness: { checkedAt: number; ready: boolean } | null = null;
let readinessCheck: Promise<boolean> | null = null;

async function databaseReady(): Promise<boolean> {
  if (readiness && Date.now() - readiness.checkedAt < 5000) return readiness.ready;
  if (!readinessCheck) {
    readinessCheck = prisma.$queryRaw`SELECT 1`
      .then(() => true)
      .catch(error => {
        console.error('[READINESS] Database tidak tersedia:', error);
        return false;
      })
      .then(ready => {
        readiness = { checkedAt: Date.now(), ready };
        return ready;
      })
      .finally(() => { readinessCheck = null; });
  }
  return readinessCheck;
}

router.get('/', async (_req: Request, res: Response) => {
  if (!(await databaseReady())) {
    return res.status(503).json({ status: 'error', message: 'Database tidak tersedia.' });
  }
  return res.status(200).json({ status: 'success', message: 'API dan database tersedia.' });
});

// Pendaftaran / War Tiket
router.use('/register', registerRoutes);

// Webhook Pembayaran Midtrans
router.use('/webhook', webhookRoutes);

// Informasi Event & CMS Website Settings
router.use('/events', eventRoutes);

// Pengaturan Global Countdown & Status Event
router.get('/settings/countdown', getPublicCountdownSettings);
router.get('/settings/checkout-config', getPublicCheckoutConfig);

// Pengaturan Konten & CMS Website Publik
router.get('/settings/website', getWebsiteSettings);

// Rute Lari Resmi & Titik Kumpul (Public)
router.get('/routes', getRouteOverview);
router.get('/routes/points', getRoutePoints);

// Layanan Cek Tiket & E-Tiket Publik
router.get('/tickets/search', searchTickets);
router.get('/tickets/e-ticket/:orderId', getETicketData);
router.post('/orders/:orderId/cancel', cancelOrder);
router.post('/orders/:orderId/sync-midtrans', syncMidtransStatus);
router.all('/orders/:orderId/snap-token', getOrderSnapToken);

// Manajemen Admin
router.use('/admin', adminRoutes);

export default router;