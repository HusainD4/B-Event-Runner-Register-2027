import prisma from '../config/database';

export class TicketService {
  /**
   * Mengecek ketersediaan stok tiket untuk sebuah event
   */
  public static async checkTicketAvailability(eventId: string, requestedQuantity: number): Promise<{ available: boolean; remainingStock: number; eventName: string; price: number }> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        ticketName: true,
        price: true,
        stock: true,
      },
    });

    if (!event) {
      throw new Error("Event atau kategori tiket tidak ditemukan.");
    }

    const available = event.stock >= requestedQuantity;

    return {
      available,
      remainingStock: event.stock,
      eventName: event.ticketName,
      price: Number(event.price),
    };
  }

  /**
   * Menghitung total harga pembayaran berdasarkan jumlah peserta dan harga tiket
   */
  public static calculateTotalAmount(ticketPrice: number, quantity: number): number {
    return Math.round(ticketPrice * quantity);
  }

  /**
   * Mengambil ringkasan statistik tiket event (untuk dashboard admin)
   */
  public static async getEventTicketSummary(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    if (!event) {
      throw new Error("Event tidak ditemukan.");
    }

    // Hitung total order yang lunas (SETTLEMENT)
    const settlementOrdersCount = await prisma.order.count({
      where: {
        status: 'SETTLEMENT',
        participants: {
          some: { eventId },
        },
      },
    });

    return {
      eventId: event.id,
      ticketName: event.ticketName,
      initialStock: event.stock + event._count.participants, // Perkiraan stok awal
      currentStock: event.stock,
      soldCount: event._count.participants,
      settledOrdersCount: settlementOrdersCount,
    };
  }
}