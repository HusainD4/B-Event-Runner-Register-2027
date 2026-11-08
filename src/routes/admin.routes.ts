import { Router } from 'express';
import { getAdminStats, getAllParticipants, generateBibNumbers } from '../controllers/admin.controller';
import { verifyAuthToken, verifyAdminRole } from '../middlewares/auth';

const router = Router();

// Semua rute admin di bawah ini wajib melewati verifikasi token JWT dan hak akses ADMIN
router.use(verifyAuthToken, verifyAdminRole);

/**
 * GET /api/admin/stats
 * Mengambil ringkasan statistik dashboard admin
 */
router.get('/stats', getAdminStats);

/**
 * GET /api/admin/participants
 * Mengambil daftar seluruh peserta yang terdaftar
 */
router.get('/participants', getAllParticipants);

/**
 * POST /api/admin/generate-bib
 * Mengenerate nomor BIB peserta secara otomatis berdasarkan event
 */
router.post('/generate-bib', generateBibNumbers);

export default router;
