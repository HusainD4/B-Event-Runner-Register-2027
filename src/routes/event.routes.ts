import { Router } from 'express';
import { getAllEvents, getEventById } from '../controllers/event.controller';

const router = Router();

// =======================================================================
// RUTE PUBLIK (Tidak memerlukan middleware Autentikasi / JWT)
// Semua pengunjung website dapat mengakses endpoint ini untuk melihat tiket
// =======================================================================

// Endpoint: GET /api/events
// Fungsi: Mengambil semua daftar event beserta harga dan sisa kuotanya
router.get('/', getAllEvents);

// Endpoint: GET /api/events/:id
// Fungsi: Mengambil detail spesifik satu event (untuk halaman Checkout)
// Contoh URL: /api/events/d33918-abc-123
router.get('/:id', getEventById);

export default router;