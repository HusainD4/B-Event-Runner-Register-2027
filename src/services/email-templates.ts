export const DEFAULT_EMAIL_TEMPLATES = {
  PAID: `Halo {fullName},

Terima kasih, pembayaran pendaftaran Anda telah berhasil diverifikasi.

Detail pesanan:
Kategori tiket: {ticketName}
Nomor pesanan: {orderId}
Jumlah peserta: {participantCount}
Total pembayaran: {totalAmount}
Status: Lunas

Buka E-Tiket resmi Anda melalui tautan berikut:
{eTicketUrl}

Simpan E-Tiket dan ikuti petunjuk pengambilan racepack yang tercantum di dalamnya.

Sampai jumpa di acara!
Salam,
Panitia {eventName}`,
  PENDING: `Halo {fullName},

Terima kasih telah mendaftar. Pesanan Anda masih menunggu pembayaran.

Detail pesanan:
Kategori tiket: {ticketName}
Nomor pesanan: {orderId}
Jumlah peserta: {participantCount}
Total pembayaran: {totalAmount}

Silakan selesaikan pembayaran sebelum batas waktu melalui tautan berikut:
{paymentUrl}

Setelah pembayaran terverifikasi, E-Tiket dapat diakses melalui halaman cek tiket.

Salam,
Panitia {eventName}`,
  CANCEL: `Halo {fullName},

Pesanan Anda telah dibatalkan.

Detail pesanan:
Kategori tiket: {ticketName}
Nomor pesanan: {orderId}
Jumlah peserta: {participantCount}
Total pembayaran: {totalAmount}

Jika masih ingin mengikuti acara, silakan lakukan pendaftaran kembali melalui situs resmi.

Salam,
Panitia {eventName}`,
} as const;
