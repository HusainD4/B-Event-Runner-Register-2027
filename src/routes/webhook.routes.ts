import { Router } from 'express';
import { handleMidtransWebhook } from '../controllers/webhook.controller';
import { verifyMidtransSignature } from '../middlewares/verifySignature';

const router = Router();

/**
 * POST /api/webhook/midtrans
 * Endpoint penerima notifikasi otomatis (webhook) dari server Midtrans.
 * Dilengkapi dengan verifikasi Signature Key (SHA512) untuk keamanan tingkat enterprise.
 */
router.post('/midtrans', verifyMidtransSignature, handleMidtransWebhook);

export default router;