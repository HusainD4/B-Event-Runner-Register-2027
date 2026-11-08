import { Router } from 'express';
import { registerEvent } from '../controllers/register.controller';
import { validate, registerPayloadSchema } from '../middlewares/validate';
import { botDetectionMiddleware } from '../middlewares/botDetection';
import { warTicketLimiter } from '../middlewares/rateLimiter';
import { sanitizeInput } from '../middlewares/sanitize';

const router = Router();

/**
 * POST /api/register
 * Endpoint utama untuk pendaftaran event / war tiket Tegal Run 2027
 * Menggunakan pengaman berlapis:
 * 1. Rate Limiter (Mencegah spam request per IP)
 * 2. Bot Detection (Mencegah script/bot otomatis)
 * 3. Sanitasi Input (Mencegah XSS/Injeksi)
 * 4. Zod Validation (Memastikan struktur data valid)
 */
router.post(
  '/',
  warTicketLimiter,
  botDetectionMiddleware,
  sanitizeInput,
  validate(registerPayloadSchema),
  registerEvent
);

export default router;