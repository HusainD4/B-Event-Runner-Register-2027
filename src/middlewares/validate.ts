import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// 1. Skema Validasi untuk 1 Data Peserta
const participantSchema = z.object({
  fullNameKtp: z.string().min(3, "Nama KTP minimal 3 karakter"),
  bibName: z.string().max(15, "Nama BIB maksimal 15 karakter agar muat dicetak"),
  
  // NIK Wajib 16 digit angka
  nik: z.string().regex(/^\d{16}$/, "NIK harus berupa 16 digit angka"),
  
  gender: z.enum(['MALE', 'FEMALE']),
  birthPlace: z.string().min(3, "Tempat lahir wajib diisi"),
  
  // Menerima format YYYY-MM-DD maupun ISO 8601 lengkap
  birthDate: z.string().regex(
    /^\d{4}-\d{2}-\d{2}(T.*)?$/, 
    "Format tanggal lahir tidak valid (Gunakan format YYYY-MM-DD)"
  ),
  
  fullAddress: z.string().min(10, "Alamat lengkap wajib diisi minimal 10 karakter"),
  bloodType: z.enum(['A', 'B', 'AB', 'O']),
  
  // Field Opsional (Boleh tidak dikirim / null / string kosong)
  medicalHistory: z.string().nullable().optional(),
  
  emergencyContactName: z.string().min(3, "Nama kontak darurat wajib diisi"),
  emergencyContactPhone: z.string().regex(
    /^\+628\d{8,12}$/, 
    "Nomor telepon darurat harus diawali +628 (contoh: +628123456789)"
  ),
  
  // Opsional karena mungkin ada kategori tiket tanpa Jersey
  jerseyId: z.string().uuid("Jersey ID tidak valid").nullable().optional(),
  selectedSize: z.string().nullable().optional(),
  communityName: z.string().nullable().optional(),
});

// 2. Skema Validasi Utama untuk Body Request
export const registerPayloadSchema = z.object({
  body: z.object({
    userId: z.string().uuid("User ID (Pemesan) tidak valid"),
    eventId: z.string().uuid("Event ID tidak valid"),
    participants: z.array(participantSchema)
      .min(1, "Minimal harus mendaftarkan 1 peserta")
      .max(10, "Maksimal 10 peserta dalam 1 kali transaksi"),
  })
});

// 3. Fungsi Middleware Pengeksekusi Zod
export const validate = (schema: z.AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next(); // Data valid, lolos ke Controller!
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Data pendaftaran tidak valid",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return next(error);
    }
  };
};