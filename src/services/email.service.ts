import nodemailer from 'nodemailer';

export function createEmailTransport(cfg: Record<string, string>) {
  if (!cfg.email_smtp_host || !cfg.email_smtp_user || !cfg.email_smtp_pass) {
    throw new Error('Pengaturan host, akun, dan password SMTP harus dilengkapi.');
  }
  const port = Number(cfg.email_smtp_port || '587');
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Port SMTP tidak valid.');
  }
  return nodemailer.createTransport({
    host: cfg.email_smtp_host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    connectionTimeout: 30_000,
    greetingTimeout: 30_000,
    socketTimeout: 60_000,
    auth: { user: cfg.email_smtp_user, pass: cfg.email_smtp_pass },
  });
}
