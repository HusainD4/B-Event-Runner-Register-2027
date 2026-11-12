import { Router } from 'express';
import type { Request, Response } from 'express';
import registerRoutes from './register.routes.js';
// Import sub-rute utama
// import registerRoutes from './register.routes';
import webhookRoutes from './webhook.routes.js';
import eventRoutes from './event.routes.js';
import adminRoutes from './admin.routes.js';
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
router.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'success',
    message: '✨ API Gateway Tegal Run 2027 aktif dan berjalan normal.',
  });
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