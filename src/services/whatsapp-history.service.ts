import prisma from '../config/database';

export async function sendWithWhatsAppHistory(
  orderId: string,
  message: string,
  kind: 'TEXT' | 'PDF',
  send: () => Promise<unknown>,
  adminId?: string,
) {
  const entry = await prisma.log.create({
    data: {
      action: 'WHATSAPP_CONSOLE_MESSAGE',
      description: 'Pengiriman WhatsApp dari sistem.',
      entityType: 'Order',
      entityId: orderId,
      adminId,
      metadata: { message, kind, status: 'PENDING' },
    },
  });
  try {
    await send();
  } catch (error) {
    try {
      await prisma.log.updateMany({
        where: { id: entry.id, action: 'WHATSAPP_CONSOLE_MESSAGE' },
        data: { metadata: { message, kind, status: 'UNKNOWN' } },
      });
    } catch (historyError) {
      console.error('[WHATSAPP HISTORY UPDATE ERROR]', historyError);
    }
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`${reason} Status pengiriman tidak pasti; periksa WhatsApp sebelum mengirim ulang.`);
  }
  try {
    const updated = await prisma.log.updateMany({
      where: { id: entry.id, action: 'WHATSAPP_CONSOLE_MESSAGE' },
      data: { metadata: { message, kind, status: 'SENT' } },
    });
    if (!updated.count) throw new Error('Riwayat telah dibersihkan saat pengiriman berlangsung.');
  } catch (error) {
    console.error('[WHATSAPP HISTORY UPDATE ERROR]', error);
    throw new Error('Pesan mungkin sudah terkirim, tetapi status riwayat gagal disimpan. Periksa WhatsApp sebelum mengirim ulang.');
  }
}
