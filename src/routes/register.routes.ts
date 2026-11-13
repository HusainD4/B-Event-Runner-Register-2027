import { Router } from 'express';
import { checkParticipantNiks, registerEvent } from '../controllers/register.controller';
import { validate, checkParticipantNiksSchema, registerPayloadSchema } from '../middlewares/validate';
import { botDetectionMiddleware } from '../middlewares/botDetection';
import { participantNikCheckLimiter, warTicketLimiter } from '../middlewares/rateLimiter';
import { sanitizeInput } from '../middlewares/sanitize';

const router = Router();

router.post(
  '/check-nik',
  participantNikCheckLimiter,
  botDetectionMiddleware,
  sanitizeInput,
  validate(checkParticipantNiksSchema),
  checkParticipantNiks
);

/**
 * POST /api/register
 * Endpoint utama untuk pendaftaran event / war tiket Tegal Run 2026
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