import midtransClient from 'midtrans-client';
import { env } from './env';

// Inisialisasi Midtrans Snap Client
export const snap = new midtransClient.Snap({
  isProduction: env.MIDTRANS_IS_PRODUCTION === 'true' || env.MIDTRANS_IS_PRODUCTION === true,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
});

// Inisialisasi Midtrans Core API Client (jika diperlukan untuk pengecekan status manual)
export const coreApi = new midtransClient.CoreApi({
  isProduction: env.MIDTRANS_IS_PRODUCTION === 'true' || env.MIDTRANS_IS_PRODUCTION === true,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
});