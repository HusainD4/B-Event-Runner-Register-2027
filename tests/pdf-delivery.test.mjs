import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { Worker } from 'node:worker_threads';
import { getDocument, OPS, Util } from 'pdfjs-dist/legacy/build/pdf.mjs';

function imageSizes(operators) {
  let matrix = [1, 0, 0, 1, 0, 0];
  const stack = [];
  const sizes = [];
  operators.fnArray.forEach((op, index) => {
    if (op === OPS.save) stack.push(matrix);
    if (op === OPS.restore) matrix = stack.pop();
    if (op === OPS.transform) matrix = Util.transform(matrix, operators.argsArray[index]);
    if (op === OPS.paintImageXObject) sizes.push([Math.hypot(matrix[0], matrix[1]), Math.hypot(matrix[2], matrix[3])]);
  });
  return sizes;
}

const sandbox = await mkdtemp(path.join(tmpdir(), 'event-pdf-test-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  WHATSAPP_AUTH_DIR: path.join(sandbox, 'auth'),
});
const { default: prisma } = await import('../src/config/database.ts');
const { whatsappSessionService } = await import('../src/services/whatsapp-session.service.ts');
const { queuePdfDeliveries, processNextPdfDelivery, queueAutomaticPdfDeliveries, startPdfDeliveryWorker, stopPdfDeliveryWorker } = await import('../src/services/pdf-delivery.service.ts');

test('paid PDF jobs are durable per channel, rendered in a worker and sent as PDF attachments', async () => {
  const jobs = [];
  const history = [];
  prisma.log.create = async ({ data }) => {
    const entry = { id: `history-${history.length}`, ...data };
    history.push(entry);
    return entry;
  };
  prisma.log.updateMany = async ({ where, data }) => {
    const entry = history.find(item => item.id === where.id);
    if (!entry) return { count: 0 };
    Object.assign(entry, data);
    return { count: 1 };
  };
  const order = {
    id: 'order-1', midtransOrderId: 'ref-1', status: 'SETTLEMENT',
    user: { fullName: 'Pembeli', phoneNumber: '08123456789', email: 'runner@example.test' },
    participants: [{
      id: 'p-1', fullNameKtp: 'Pelari', selectedSize: 'M',
      nik: '1234567890123456', bloodType: 'O', emergencyContactPhone: '08123456789', emergencyContactName: 'Keluarga',
      event: { ticketName: 'Tiket 5K', category: '5K', eventDate: new Date('2027-01-02T00:00:00Z'), benefits: [{ name: 'Medali' }] },
      jersey: { name: 'Jersey' },
    }],
  };
  prisma.pdfDelivery.upsert = async ({ where, create }) => {
    const key = where.orderId_channel;
    if (!jobs.some(job => job.orderId === key.orderId && job.channel === key.channel)) {
      jobs.push({ id: `job-${jobs.length}`, ...create, status: 'PENDING', error: null });
    }
    return jobs.find(job => job.orderId === key.orderId && job.channel === key.channel);
  };
  prisma.pdfDelivery.findFirst = async () => jobs.find(job => job.status === 'PENDING') || null;
  prisma.pdfDelivery.updateMany = async ({ where, data }) => {
    const matches = jobs.filter(job => (!where.id || job.id === where.id) &&
      (!where.orderId || job.orderId === where.orderId) && (!where.channel || job.channel === where.channel) &&
      (!where.status || (typeof where.status === 'string' ? job.status === where.status : where.status.in.includes(job.status))));
    for (const job of matches) Object.assign(job, data);
    return { count: matches.length };
  };
  prisma.pdfDelivery.update = async ({ where, data }) => Object.assign(jobs.find(job => job.id === where.id), data);
  prisma.order.findUnique = async ({ select }) => select ? { status: order.status } : order;
  prisma.appSetting.findUnique = async ({ where }) => where.key === 'qr_prefix'
    ? { value: 'RACE' } : { value: JSON.stringify({ title: 'Petunjuk', points: ['Bawa identitas'] }) };
  prisma.appSetting.findMany = async () => [
    { key: 'navbar_title', value: 'Race' }, { key: 'email_smtp_host', value: 'smtp.example.test' },
    { key: 'email_smtp_user', value: 'sender@example.test' }, { key: 'email_smtp_pass', value: 'test' },
  ];
  prisma.qrToken.findUnique = async () => ({ token: '0123456789' });
  let waPdf, email;
  const previousSendPdf = whatsappSessionService.sendPdf;
  const previousTransport = nodemailer.createTransport;
  whatsappSessionService.sendPdf = async (phone, pdf, name) => { waPdf = { phone, pdf, name }; };
  nodemailer.createTransport = () => ({ sendMail: async mail => { email = mail; } });
  try {
    await queuePdfDeliveries(order.id, 'BOTH', false);
    await queuePdfDeliveries(order.id, 'BOTH', false);
    assert.equal(jobs.length, 2);
    await processNextPdfDelivery();
    await processNextPdfDelivery();
    assert.deepEqual(jobs.map(job => job.status), ['SENT', 'SENT']);
    assert.equal(history[0].metadata.kind, 'PDF');
    assert.equal(history[0].metadata.status, 'SENT');
    assert.equal(waPdf.phone, order.user.phoneNumber);
    assert.equal(waPdf.pdf.subarray(0, 5).toString(), '%PDF-');
    const singlePdf = await getDocument({ data: new Uint8Array(waPdf.pdf), useSystemFonts: true }).promise;
    try {
      assert.equal(singlePdf.numPages, 2);
      const secondPage = await singlePdf.getPage(2);
      const text = (await secondPage.getTextContent()).items.map(item => item.str).join(' ');
      assert.match(text, /QR Pengambilan Racepack/);
      assert.match(text, /Pelari/);
      const operators = await secondPage.getOperatorList();
      assert.ok(operators.fnArray.includes(OPS.paintImageXObject));
      assert.ok(imageSizes(operators).some(([width, height]) => width >= 250 && height >= 250),
      'racepack QR should be at least 250pt wide and tall');
    } finally {
      await singlePdf.destroy();
    }
    assert.equal(email.to, order.user.email);
    assert.equal(email.attachments[0].content.subarray(0, 5).toString(), '%PDF-');
    assert.equal(email.attachments[0].contentType, 'application/pdf');
    await queuePdfDeliveries(order.id, 'BOTH', true);
    assert.deepEqual(jobs.map(job => job.status), ['SENT', 'SENT']);
    jobs[0].status = 'FAILED';
    await queuePdfDeliveries(order.id, 'BOTH', true);
    assert.deepEqual(jobs.map(job => job.status), ['PENDING', 'SENT']);
    order.status = 'CANCEL';
    const originalError = console.error;
    console.error = () => {};
    try {
      await processNextPdfDelivery();
    } finally {
      console.error = originalError;
    }
    assert.equal(jobs[0].status, 'FAILED');
    assert.match(jobs[0].error, /tidak lagi berstatus lunas/);
    order.status = 'SETTLEMENT';
    await queuePdfDeliveries(order.id, 'WA', true);
    whatsappSessionService.sendPdf = async () => { throw new Error('Koneksi terputus'); };
    console.error = () => {};
    try {
      await processNextPdfDelivery();
    } finally {
      console.error = originalError;
    }
    assert.equal(jobs[0].status, 'FAILED');
    assert.match(jobs[0].error, /tidak pasti/);
  } finally {
    whatsappSessionService.sendPdf = previousSendPdf;
    nodemailer.createTransport = previousTransport;
  }
});

test('automatic enqueue respects manual mode and PDF channel selection', async () => {
  const created = [];
  const db = {
    appSetting: { findMany: async () => [{ key: 'wa_dispatch_mode', value: 'MANUAL' }, { key: 'pdf_delivery_channel', value: 'BOTH' }] },
    pdfDelivery: { upsert: async ({ create }) => { created.push(create.channel); return { status: 'PENDING' }; } },
  };
  await queueAutomaticPdfDeliveries(db, 'order-1');
  assert.deepEqual(created, []);
  db.appSetting.findMany = async () => [{ key: 'pdf_delivery_channel', value: 'BOTH' }];
  await queueAutomaticPdfDeliveries(db, 'order-1');
  assert.deepEqual(created, ['WA', 'EMAIL']);
});

test('worker recovery requeues rendering but marks interrupted sends as uncertain', async () => {
  const updates = [];
  prisma.pdfDelivery.updateMany = async args => { updates.push(args); return { count: 1 }; };
  prisma.pdfDelivery.findFirst = async () => null;
  await startPdfDeliveryWorker();
  await stopPdfDeliveryWorker();
  assert.equal(updates[0].where.status, 'PROCESSING');
  assert.equal(updates[0].data.status, 'PENDING');
  assert.equal(updates[1].where.status, 'SENDING');
  assert.equal(updates[1].data.status, 'FAILED');
  assert.match(updates[1].data.error, /tidak pasti/);
});

test('PDF uses the e-ticket layout with all 10 participant tickets, master QR and admin instructions', async () => {
  const qr = 'RACE|0123456789';
  const participants = Array.from({ length: 10 }, (_, index) => ({
    fullNameKtp: `Pelari Contoh ${index + 1}`,
    nik: '1234567890123456',
    bloodType: 'O',
    emergencyContactPhone: '08123456789',
    emergencyContactName: 'Keluarga',
    event: { ticketName: 'Kategori 10K', category: '10K', eventDate: '2027-01-02T00:00:00Z', benefits: [{ name: 'Medali' }] },
    jersey: { name: 'Jersey' },
    selectedSize: 'M',
    qrPayload: qr,
  }));
  const worker = new Worker(new URL('../scripts/render-ticket-pdf.mjs', import.meta.url), {
    workerData: {
      order: {
        id: 'fixture', midtransOrderId: 'REF-TEST', participants,
        masterQrPayload: qr,
        racepackInstructions: { title: 'Petunjuk khusus', points: ['Bawa identitas resmi'] },
      },
      websiteSettings: { navbar_title: 'EVENT CONTOH', contact_address: 'Lokasi Contoh' },
    },
  });
  const bytes = await new Promise((resolve, reject) => {
    worker.once('message', message => message.error ? reject(new Error(message.error)) : resolve(message.buffer));
    worker.once('error', reject);
  });
  const pdf = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true }).promise;
  try {
    assert.equal(pdf.numPages, 11);
    const qrPage = await pdf.getPage(2);
    const qrText = (await qrPage.getTextContent()).items.map(item => item.str).join(' ');
    assert.match(qrText, /QR Pengambilan Racepack/);
    assert.match(qrText, /QR MASTER/);
    const qrOperators = await qrPage.getOperatorList();
    assert.ok(qrOperators.fnArray.includes(OPS.paintImageXObject));
    assert.ok(imageSizes(qrOperators).some(([width, height]) => width >= 250 && height >= 250));
    let text = '';
    let imageCount = 0;
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      text += ' ' + (await page.getTextContent()).items.map(item => item.str).join(' ');
      const operators = await page.getOperatorList();
      imageCount += operators.fnArray.filter(op => op === OPS.paintImageXObject).length;
    }
    for (const participant of participants) assert.ok(text.includes(participant.fullNameKtp));
    assert.match(text, /QR MASTER/);
    assert.match(text, /Petunjuk khusus/);
    assert.match(text, /Bawa identitas resmi/);
    assert.match(text, /123456\*{6}3456/);
    assert.doesNotMatch(text, /1234567890123456/);
    assert.ok(imageCount >= 11, 'individual and master QR images must be included');
  } finally {
    await pdf.destroy();
  }
});

test('missing browser fails explicitly instead of producing a fake PDF', async () => {
  const worker = new Worker(new URL('../scripts/render-ticket-pdf.mjs', import.meta.url), {
    env: { ...process.env, PDF_CHROME_PATH: path.join(sandbox, 'missing-browser') },
    workerData: { order: { participants: [{ qrPayload: 'RACE|0123456789' }] } },
  });
  const result = await new Promise((resolve, reject) => {
    worker.once('message', resolve);
    worker.once('error', reject);
  });
  assert.match(result.error, /Chromium tidak ditemukan/);
  assert.equal(result.buffer, undefined);
});

test.after(async () => { await rm(sandbox, { recursive: true, force: true }); });
