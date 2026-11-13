import test from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const sandbox = await mkdtemp(path.join(tmpdir(), 'event-notification-test-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  DATABASE_URL: 'mysql://test:test@127.0.0.1:1/test',
  MIDTRANS_SERVER_KEY: 'test-server-key',
  MIDTRANS_CLIENT_KEY: 'test-client-key',
  JWT_SECRET: 'test-only-secret-at-least-32-characters',
  WHATSAPP_AUTH_DIR: path.join(sandbox, 'auth'),
});

test.after(async () => { await rm(sandbox, { recursive: true, force: true }); });

const { default: prisma } = await import('../src/config/database.ts');
const { sendOrderNotification } = await import('../src/services/notification.service.ts');
const { loadRacepackInstructions, DEFAULT_INSTRUCTIONS } = await import('../src/services/racepack-instructions.service.ts');
const { getRacepackInstructions } = await import('../src/controllers/admin.bib.controller.ts');
const { getNotificationSettings, updateNotificationSettings, sendTestNotification } = await import('../src/controllers/admin.notification.controller.ts');
const { DEFAULT_EMAIL_TEMPLATES } = await import('../src/services/email-templates.ts');

function response() {
  return {
    code: 0,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('racepack instructions use saved data, fall back only when absent, and surface errors', async () => {
  const saved = { title: 'Jadwal RPC', points: ['Bawa identitas', '<b>Lokasi</b>'] };
  prisma.appSetting.findUnique = async () => ({ value: JSON.stringify(saved) });
  assert.deepEqual(await loadRacepackInstructions(), saved);
  prisma.appSetting.findUnique = async () => null;
  assert.deepEqual(await loadRacepackInstructions(), DEFAULT_INSTRUCTIONS);
  prisma.appSetting.findUnique = async () => ({ value: '{broken' });
  await assert.rejects(loadRacepackInstructions());

  const res = response();
  const originalError = console.error;
  console.error = () => {};
  try {
    await getRacepackInstructions({}, res);
    assert.equal(res.code, 500);
    assert.equal(res.body.status, 'error');
  } finally {
    console.error = originalError;
  }
});

test('email templates are accepted by settings and SMTP test reports success and failures', async () => {
  const saved = new Map();
  prisma.appSetting.upsert = async ({ where, create }) => { saved.set(where.key, create.value); };
  prisma.log.create = async () => ({});
  const settingsRes = response();
  await updateNotificationSettings({
    body: { template_email_paid: 'Lunas {fullName}', template_email_pending: 'Pending', template_email_cancel: 'Batal' },
    admin: { adminId: 'admin-1' },
  }, settingsRes);
  assert.equal(settingsRes.body.status, 'success');
  assert.equal(saved.get('template_email_paid'), 'Lunas {fullName}');
  assert.equal(saved.get('template_email_pending'), 'Pending');
  assert.equal(saved.get('template_email_cancel'), 'Batal');

  prisma.appSetting.findMany = async () => [
    { key: 'email_smtp_host', value: 'smtp.example.test' },
    { key: 'email_smtp_user', value: 'sender@example.test' },
    { key: 'email_smtp_pass', value: 'test-password' },
  ];
  const originalTransport = nodemailer.createTransport;
  let mail;
  nodemailer.createTransport = () => ({ sendMail: async message => { mail = message; } });
  try {
    const res = response();
    await sendTestNotification({ body: { channel: 'EMAIL', targetEmail: 'runner@example.test', message: 'Test' } }, res);
    assert.equal(res.body.data.emailSuccess, true);
    assert.equal(mail.to, 'runner@example.test');
    assert.equal(mail.text, 'Test');

    prisma.appSetting.findMany = async () => [];
    const failure = response();
    const originalWarn = console.warn;
    console.warn = () => {};
    try {
      await sendTestNotification({ body: { channel: 'EMAIL', targetEmail: 'runner@example.test' } }, failure);
    } finally {
      console.warn = originalWarn;
    }
    assert.equal(failure.body.status, 'error');
    assert.match(failure.body.message, /SMTP/);
  } finally {
    nodemailer.createTransport = originalTransport;
  }
});

test('settings expose default email templates while preserving custom and explicitly empty values', async () => {
  prisma.appSetting.findMany = async () => [
    { key: 'template_email_paid', value: 'Email khusus {fullName}' },
    { key: 'template_email_pending', value: '' },
  ];
  const res = response();
  await getNotificationSettings({}, res);
  assert.equal(res.body.data.template_email_paid, 'Email khusus {fullName}');
  assert.equal(res.body.data.template_email_pending, '');
  assert.equal(res.body.data.template_email_cancel, DEFAULT_EMAIL_TEMPLATES.CANCEL);
  assert.deepEqual(res.body.data.email_template_defaults, DEFAULT_EMAIL_TEMPLATES);
});

test('unsaved email templates use status-specific defaults and configured event name', async () => {
  const sent = [];
  const originalTransport = nodemailer.createTransport;
  nodemailer.createTransport = () => ({ sendMail: async message => { sent.push(message); } });
  let orderStatus = 'SETTLEMENT';
  prisma.order.findUnique = async () => ({
    id: 'order-1', midtransOrderId: 'ref-1', status: orderStatus, totalAmount: 1000,
    user: { fullName: 'Pelari', email: 'runner@example.test', phoneNumber: '08123456789' },
    participants: [{ bibNumber: null, event: { ticketName: '5K' } }],
  });
  prisma.appSetting.findMany = async () => [
    { key: 'notif_channel', value: 'EMAIL' },
    { key: 'email_smtp_host', value: 'smtp.example.test' },
    { key: 'email_smtp_user', value: 'sender@example.test' },
    { key: 'email_smtp_pass', value: 'test-password' },
    { key: 'navbar_title', value: 'Festival <Lari>' },
  ];
  prisma.log.create = async () => ({});
  try {
    for (const [type, status] of [['PAID', 'SETTLEMENT'], ['PENDING', 'PENDING'], ['CANCEL', 'CANCEL']]) {
      orderStatus = status;
      const result = await sendOrderNotification({ orderId: 'order-1', type });
      assert.equal(result.emailSent, true);
    }
    assert.match(sent[0].text, /berhasil diverifikasi/);
    assert.match(sent[0].text, /e-ticket\.html\?orderId=order-1/);
    assert.match(sent[1].text, /payment\.html\?orderId=order-1/);
    assert.match(sent[2].text, /telah dibatalkan/);
    for (const message of sent) {
      assert.match(message.text, /Festival <Lari>/);
      assert.match(message.html, /Festival &lt;Lari&gt;/);
      assert.doesNotMatch(message.text, /\{(?:fullName|eventName|orderId|ticketName|participantCount|totalAmount|eTicketUrl|paymentUrl)\}/);
    }
  } finally {
    nodemailer.createTransport = originalTransport;
  }
});

test('email uses its own status template, escapes HTML, and falls back to WhatsApp template', async () => {
  let mail;
  const originalTransport = nodemailer.createTransport;
  nodemailer.createTransport = () => ({ sendMail: async message => { mail = message; } });
  prisma.order.findUnique = async () => ({
    id: 'order-1', midtransOrderId: 'ref-1', status: 'SETTLEMENT', totalAmount: 1000,
    user: { fullName: '<Peserta>', email: 'runner@example.test', phoneNumber: '08123456789' },
    participants: [{ bibNumber: '01-1', event: { ticketName: '5K' } }],
  });
  let emailTemplate = 'Email {fullName} {orderId}';
  prisma.appSetting.findMany = async () => [
    { key: 'notif_channel', value: 'EMAIL' },
    { key: 'email_smtp_host', value: 'smtp.example.test' },
    { key: 'email_smtp_user', value: 'sender@example.test' },
    { key: 'email_smtp_pass', value: 'test-password' },
    { key: 'template_msg_paid', value: 'WA {fullName}' },
    { key: 'template_email_paid', value: emailTemplate },
  ];
  prisma.log.create = async () => ({});
  try {
    let result = await sendOrderNotification({ orderId: 'order-1', type: 'PAID' });
    assert.equal(result.emailSent, true);
    assert.equal(mail.text, 'Email <Peserta> ref-1');
    assert.match(mail.html, /Email &lt;Peserta&gt; ref-1/);
    emailTemplate = '';
    result = await sendOrderNotification({ orderId: 'order-1', type: 'PAID' });
    assert.equal(result.emailSent, true);
    assert.equal(mail.text, 'WA <Peserta>');
  } finally {
    nodemailer.createTransport = originalTransport;
  }
});
