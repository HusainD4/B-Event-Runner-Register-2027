import { Router } from 'express';
import type { Request, Response } from 'express';

// Import sub-rute utama
import registerRoutes from './register.routes';
import webhookRoutes from './webhook.routes';
import eventRoutes from './event.routes';
import adminRoutes from './admin.routes';

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

// Informasi Event
router.use('/events', eventRoutes);

// Manajemen Admin
router.use('/admin', adminRoutes);

export default router;