import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import nodemailer from 'nodemailer';
import { createEmailTransport } from '../src/services/email.service.ts';

test('SMTP port 465 uses implicit TLS and other ports require STARTTLS', () => {
  const original = nodemailer.createTransport;
  const options = [];
  nodemailer.createTransport = config => { options.push(config); return {}; };
  try {
    const cfg = { email_smtp_host: 'smtp.example.test', email_smtp_user: 'test', email_smtp_pass: 'test' };
    createEmailTransport({ ...cfg, email_smtp_port: '465' });
    createEmailTransport({ ...cfg, email_smtp_port: '587' });
    assert.equal(options[0].secure, true);
    assert.equal(options[0].requireTLS, false);
    assert.equal(options[1].secure, false);
    assert.equal(options[1].requireTLS, true);
  } finally {
    nodemailer.createTransport = original;
  }
});

test('SMTP without STARTTLS fails before sending authentication', async () => {
  const commands = [];
  const server = createServer(socket => {
    socket.setEncoding('utf8');
    socket.write('220 smtp.example.test ready\r\n');
    let buffer = '';
    socket.on('data', data => {
      buffer += data;
      const lines = buffer.split('\r\n');
      buffer = lines.pop();
      for (const line of lines) {
        commands.push(line);
        if (/^(EHLO|HELO)/i.test(line)) socket.write('250-smtp.example.test\r\n250 AUTH PLAIN LOGIN\r\n');
        else if (/^STARTTLS/i.test(line)) socket.write('502 STARTTLS unavailable\r\n');
        else socket.write('500 command not supported\r\n');
      }
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const transport = createEmailTransport({
    email_smtp_host: '127.0.0.1',
    email_smtp_port: String(server.address().port),
    email_smtp_user: 'test',
    email_smtp_pass: 'test',
  });
  try {
    await assert.rejects(transport.sendMail({ from: 'test@example.test', to: 'other@example.test', subject: 'test', text: 'test' }));
    assert.ok(commands.some(command => /^STARTTLS/i.test(command)));
    assert.ok(commands.every(command => !/^AUTH/i.test(command)));
  } finally {
    transport.close();
    await new Promise(resolve => server.close(resolve));
  }
});
