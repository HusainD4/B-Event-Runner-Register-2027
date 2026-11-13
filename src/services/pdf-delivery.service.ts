import { Worker } from 'node:worker_threads';
import prisma from '../config/database';
import { createEmailTransport } from './email.service';
import { loadRacepackInstructions } from './racepack-instructions.service';
import { generateMasterQrString, generateSingleQrString } from './qr-crypto.service';
import { whatsappSessionService } from './whatsapp-session.service';
import type { Prisma } from '../generated/client';
import { DEFAULT_WEBSITE_SETTINGS } from '../controllers/settings.controller';
import { sendWithWhatsAppHistory } from './whatsapp-history.service';

export type PdfChannel = 'WA' | 'EMAIL';

export async function queueManualPdfDelivery(db: Prisma.TransactionClient, orderId: string, channel: PdfChannel, confirmResend: boolean) {
  if (confirmResend) {
    const updated = await db.pdfDelivery.updateMany({
      where: { orderId, channel, status: { in: ['FAILED', 'SENT'] } },
      data: { status: 'PENDING', error: null },
    });
    if (updated.count) return 'PENDING' as const;
  }
  const delivery = await db.pdfDelivery.upsert({
    where: { orderId_channel: { orderId, channel } },
    create: { orderId, channel },
    update: {},
  });
  return delivery.status;
}

export async function queuePdfDeliveries(orderId: string, selection: string, manual: boolean, db: Prisma.TransactionClient = prisma) {
  const channels: PdfChannel[] = selection === 'BOTH' ? ['WA', 'EMAIL']
    : selection === 'WA' || selection === 'EMAIL' ? [selection] : [];
  if (!channels.length && selection !== 'DISABLED') throw new Error('Saluran PDF tidak valid.');
  let queued = false;
  for (const channel of channels) {
    const delivery = await db.pdfDelivery.upsert({
      where: { orderId_channel: { orderId, channel } },
      create: { orderId, channel },
      update: {},
    });
    if (['PENDING', 'PROCESSING', 'SENDING'].includes(delivery.status)) queued = true;
    if (manual) {
      const updated = await db.pdfDelivery.updateMany({
        where: { orderId, channel, status: 'FAILED' },
        data: { status: 'PENDING', error: null },
      });
      if (updated.count) queued = true;
    }
  }
  return queued;
}

export async function queueAutomaticPdfDeliveries(db: Prisma.TransactionClient, orderId: string) {
  const settings = await db.appSetting.findMany({
    where: { key: { in: ['wa_dispatch_mode', 'pdf_delivery_channel'] } },
  });
  const cfg: Record<string, string> = {};
  settings.forEach(setting => { cfg[setting.key] = setting.value; });
  if (cfg.wa_dispatch_mode !== 'MANUAL') {
    await queuePdfDeliveries(orderId, cfg.pdf_delivery_channel || 'DISABLED', false, db);
  }
}

async function renderPdf(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, participants: { include: { event: { include: { benefits: true } }, jersey: true } } },
  });
  if (!order) throw new Error('Pesanan tidak ditemukan.');
  if (!['SETTLEMENT', 'CAPTURE'].includes(order.status)) throw new Error('Pesanan tidak lagi berstatus lunas.');
  if (!order.participants.length) throw new Error('Pesanan tidak memiliki peserta.');
  const websiteKeys = Object.keys(DEFAULT_WEBSITE_SETTINGS).filter(key =>
    key.startsWith('theme_') || key === 'navbar_title' || key === 'contact_address' || key === 'hero_animation',
  );
  const settings = await prisma.appSetting.findMany({
    where: { key: { in: [...websiteKeys, 'email_smtp_host', 'email_smtp_port', 'email_smtp_user', 'email_smtp_pass', 'email_from_name'] } },
  });
  const cfg: Record<string, string> = {};
  settings.forEach(setting => { cfg[setting.key] = setting.value; });
  const websiteSettings: Record<string, string> = {};
  for (const key of websiteKeys) websiteSettings[key] = cfg[key] ?? DEFAULT_WEBSITE_SETTINGS[key];
  const participants = await Promise.all(order.participants.map(async participant => ({
    fullNameKtp: participant.fullNameKtp,
    nik: participant.nik,
    bloodType: participant.bloodType,
    emergencyContactPhone: participant.emergencyContactPhone,
    emergencyContactName: participant.emergencyContactName,
    event: {
      ticketName: participant.event.ticketName,
      category: participant.event.category,
      eventDate: participant.event.eventDate,
      benefits: participant.event.benefits.map(benefit => ({ name: benefit.name })),
    },
    jersey: participant.jersey ? { name: participant.jersey.name, type: participant.jersey.type } : null,
    selectedSize: participant.selectedSize,
    qrPayload: await generateSingleQrString(participant.id),
  })));
  const masterQrPayload = participants.length > 1 ? await generateMasterQrString(order.id) : null;
  const worker = new Worker(new URL('../../scripts/render-ticket-pdf.mjs', import.meta.url), {
    workerData: {
      order: {
        id: order.id,
        midtransOrderId: order.midtransOrderId,
        participants,
        racepackInstructions: await loadRacepackInstructions(),
        masterQrPayload,
      },
      websiteSettings,
    },
  });
  const pdf = await new Promise<Buffer>((resolve, reject) => {
    const timer = setTimeout(() => {
      void worker.terminate();
      reject(new Error('Pembuatan PDF melebihi batas waktu.'));
    }, 60_000);
    worker.once('message', (message: { buffer?: Uint8Array; error?: string }) => {
      clearTimeout(timer);
      if (message.error) reject(new Error(message.error));
      else if (message.buffer) resolve(Buffer.from(message.buffer));
      else reject(new Error('Pembuatan PDF tidak menghasilkan dokumen.'));
    });
    worker.once('error', error => { clearTimeout(timer); reject(error); });
    worker.once('exit', code => { clearTimeout(timer); reject(new Error(`Worker PDF berhenti tanpa hasil (${code}).`)); });
  });
  return { order, cfg, pdf };
}

let timer: NodeJS.Timeout | null = null;
let active: Promise<void> | null = null;
let stopping = false;

async function withSendTimeout(send: Promise<unknown>) {
  let timeout: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      send,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Pengiriman PDF melebihi batas waktu.')), 90_000);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function processNextPdfDelivery() {
  const job = await prisma.pdfDelivery.findFirst({ where: { status: 'PENDING' }, orderBy: { createdAt: 'asc' } });
  if (!job) return;
  const claimed = await prisma.pdfDelivery.updateMany({
    where: { id: job.id, status: 'PENDING' }, data: { status: 'PROCESSING', error: null },
  });
  if (!claimed.count) return;
  let sending = false;
  try {
    const { order, cfg, pdf } = await renderPdf(job.orderId);
    const latest = await prisma.order.findUnique({ where: { id: order.id }, select: { status: true } });
    if (!latest || !['SETTLEMENT', 'CAPTURE'].includes(latest.status)) throw new Error('Pesanan tidak lagi berstatus lunas.');
    await prisma.pdfDelivery.update({ where: { id: job.id }, data: { status: 'SENDING' } });
    sending = true;
    const filename = `e-ticket-${order.id}.pdf`;
    if (job.channel === 'WA') {
      if (!order.user.phoneNumber) throw new Error('Nomor WhatsApp tidak tersedia.');
      await sendWithWhatsAppHistory(order.id, filename, 'PDF', () =>
        withSendTimeout(whatsappSessionService.sendPdf(order.user.phoneNumber, pdf, filename)));
    } else if (job.channel === 'EMAIL') {
      if (!order.user.email) throw new Error('Alamat email tidak tersedia.');
      const transport = createEmailTransport(cfg);
      await withSendTimeout(transport.sendMail({
        from: { name: cfg.email_from_name || 'Panitia', address: cfg.email_smtp_user },
        to: order.user.email,
        subject: `E-Tiket PDF - ${order.midtransOrderId || order.id}`,
        text: 'E-Tiket resmi Anda terlampir. Simpan dokumen ini untuk pengambilan racepack.',
        attachments: [{ filename, content: pdf, contentType: 'application/pdf' }],
      }));
    } else {
      throw new Error(`Saluran PDF tidak dikenal: ${job.channel}`);
    }
    await prisma.pdfDelivery.update({ where: { id: job.id }, data: { status: 'SENT', error: null } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[PDF DELIVERY ERROR]', job.id, message);
    await prisma.pdfDelivery.updateMany({
      where: { id: job.id, status: { in: ['PROCESSING', 'SENDING'] } },
      data: { status: 'FAILED', error: sending ? `${message} Status pengiriman mungkin tidak pasti; periksa sebelum mengirim ulang.` : message },
    });
  }
}

function tick() {
  if (active || stopping) return;
  active = processNextPdfDelivery().catch(error => console.error('[PDF QUEUE ERROR]', error)).finally(() => { active = null; });
}

export async function startPdfDeliveryWorker() {
  stopping = false;
  await prisma.pdfDelivery.updateMany({ where: { status: 'PROCESSING' }, data: { status: 'PENDING' } });
  await prisma.pdfDelivery.updateMany({
    where: { status: 'SENDING' },
    data: { status: 'FAILED', error: 'Server berhenti saat mengirim. Status pengiriman tidak pasti; periksa sebelum mengirim ulang.' },
  });
  timer = setInterval(tick, 2000);
  timer.unref();
  tick();
}

export async function stopPdfDeliveryWorker() {
  stopping = true;
  if (timer) clearInterval(timer);
  timer = null;
  if (active) await active;
}
