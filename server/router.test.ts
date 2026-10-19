import { describe, expect, it } from 'vitest';
import { clientIp } from './router.js';

describe('clientIp', () => {
  const spoofed = { 'x-forwarded-for': '6.6.6.6, 10.0.0.2' };

  it('ignores X-Forwarded-For when no trusted proxy is configured', () => {
    expect(clientIp(spoofed, '127.0.0.1', {})).toBe('127.0.0.1');
  });

  it('behind a trusted proxy, takes the hop the proxy appended, not the one the client wrote', () => {
    expect(clientIp(spoofed, '10.0.0.1', { TRUST_PROXY: '1' })).toBe('10.0.0.2');
    expect(clientIp({}, '10.0.0.1', { TRUST_PROXY: '1' })).toBe('10.0.0.1');
  });

  it('on Vercel, uses the address its edge sets', () => {
    expect(clientIp({ 'x-real-ip': '1.2.3.4', 'x-forwarded-for': '1.2.3.4' }, '169.254.0.1', { VERCEL: '1' })).toBe('1.2.3.4');
    expect(clientIp({ 'x-forwarded-for': '1.2.3.4' }, '169.254.0.1', { VERCEL: '1' })).toBe('1.2.3.4');
  });
});
