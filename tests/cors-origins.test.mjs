import test from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedOrigin } from '../src/config/cors.ts';

test('production CORS allows the configured site and its Vercel preview deployments', () => {
  for (const origin of [
    'https://siexa.haisen.my.id',
    'https://f-event-runner-register-2027.vercel.app',
    'https://f-event-runner-register-2027-44192u1ku-husain-mulyansyah.vercel.app',
    'https://f-event-runner-register-2027-n0xj8zc0m-mysensid-1738.vercel.app',
    'https://f-event-runner-register-2027-1hpyvtlky-mysensid-1738.vercel.app',
  ]) {
    assert.equal(isAllowedOrigin(origin, 'production'), true, `${origin} should be allowed`);
  }
});

test('production CORS rejects untrusted, malformed, and insecure origins', () => {
  for (const origin of [
    'https://attacker.vercel.app',
    'https://f-event-runner-register-2027-44192u1ku-unknown-team.vercel.app',
    'https://f-event-runner-register-2027-preview-husain-mulyansyah.vercel.app',
    'http://f-event-runner-register-2027-44192u1ku-husain-mulyansyah.vercel.app',
    'https://f-event-runner-register-2027-44192u1ku-husain-mulyansyah.vercel.app/',
  ]) {
    assert.equal(isAllowedOrigin(origin, 'production'), false, `${origin} should be rejected`);
  }
});

test('development CORS retains local development origins', () => {
  assert.equal(isAllowedOrigin('http://localhost:5173', 'development'), true);
  assert.equal(isAllowedOrigin('http://192.168.1.20:5174', 'development'), true);
  assert.equal(isAllowedOrigin('https://attacker.vercel.app', 'development'), false);
});
