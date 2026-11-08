import { snap, coreApi } from '../config/midtrans';

/**
 * Payload data yang dibutuhkan untuk membuat transaksi pembayaran Midtrans Snap
 */
export interface CreateMidtransTransactionParams {
  orderId: string;          // ID unik pesanan (misal: TR-1729000000-1234)
  grossAmount: number;      // Total harga (wajib integer / bilangan bulat)
  customerDetails: {
    firstName: string;
    email: string;
    phone: string;
  };
  itemDetails: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export class MidtransService {
  /**
   * Membuat token pembayaran dan URL redirect Snap dari Midtrans
   */
  public static async createSnapTransaction(params: CreateMidtransTransactionParams) {
    try {
      const parameter = {
        transaction_details: {
          order_id: params.orderId,
          gross_amount: Math.round(params.grossAmount), // Pastikan bulat
        },
        customer_details: {
          first_name: params.customerDetails.firstName,
          email: params.customerDetails.email,
          phone: params.customerDetails.phone,
        },
        item_details: params.itemDetails.map(item => ({
          id: item.id,
          price: Math.round(item.price),
          quantity: item.quantity,
          name: item.name.substring(0, 50), // Batasi panjang nama item sesuai aturan Midtrans (maks 50 char)
        })),
        // Pengaturan tambahan untuk masa kedaluwarsa pembayaran (misal: 1 jam / 60 menit)
        expiry: {
          unit: 'minutes',
          duration: 60,
        },
      };

      const transaction = await snap.createTransaction(parameter);
      
      return {
        token: transaction.token,
        redirectUrl: transaction.redirect_url,
      };
    } catch (error: any) {
      console.error('🚨 [MIDTRANS SERVICE ERROR] Gagal membuat Snap Transaction:', error.ApiResponse || error.message || error);
      throw new Error('Gagal menginisialisasi pembayaran dengan Midtrans.');
    }
  }

  /**
   * Memeriksa status transaksi secara manual melalui Core API Midtrans
   * Berguna jika webhook tertunda atau perlu sinkronisasi status secara real-time.
   */
  public static async checkTransactionStatus(orderId: string) {
    try {
      const statusResponse = await coreApi.transaction.status(orderId);
      return statusResponse;
    } catch (error: any) {
      console.error(`🚨 [MIDTRANS SERVICE ERROR] Gagal mengecek status order ${orderId}:`, error.message);
      throw new Error('Gagal memeriksa status pembayaran ke server Midtrans.');
    }
  }

  /**
   * Membatalkan transaksi secara manual melalui Core API (jika diperlukan oleh admin)
   */
  public static async cancelTransaction(orderId: string) {
    try {
      const cancelResponse = await coreApi.transaction.cancel(orderId);
      return cancelResponse;
    } catch (error: any) {
      console.error(`🚨 [MIDTRANS SERVICE ERROR] Gagal membatalkan order ${orderId}:`, error.message);
      throw new Error('Gagal membatalkan transaksi di server Midtrans.');
    }
  }
}