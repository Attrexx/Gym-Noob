import { describe, expect, it } from 'vitest';
import type { MeResponse } from '../../shared/wire.ts';
import { get, inregistrare, post, rand, testApp } from './helpers.ts';

const T1 = '2026-07-01T10:00:00.000Z';

describe('cota de stocare', () => {
  it('un push peste cotă → 413 și NIMIC aplicat (atomic); pull-only merge în continuare', async () => {
    const { app } = testApp({ QUOTA_BYTES: '300' });
    const a = await inregistrare(app);

    const mic = await app.request(
      '/sync',
      post({ profileUid: 'p', cursor: 0, changes: { upserts: [rand('profiles', 'p', T1, { nume: 'mic' })], deletions: [] } }, a.accessToken),
    );
    expect(mic.status).toBe(200);
    const folositInainte = ((await mic.json()) as { quota: { usedBytes: number } }).quota.usedBytes;

    const urias = await app.request(
      '/sync',
      post(
        {
          profileUid: 'p',
          cursor: 1,
          changes: {
            upserts: [
              rand('setLogs', 's1', T1, { notite: 'x'.repeat(400) }),
              rand('setLogs', 's2', T1, { notite: 'y' }),
            ],
            deletions: [],
          },
        },
        a.accessToken,
      ),
    );
    expect(urias.status).toBe(413);
    expect((await urias.json()).error.code).toBe('QUOTA_EXCEEDED');

    // nimic din push-ul respins nu s-a aplicat — nici măcar rândul mic s2
    const me = (await (await app.request('/auth/me', get(a.accessToken))).json()) as MeResponse;
    expect(me.usedBytes).toBe(folositInainte);

    const doarPull = await app.request(
      '/sync',
      post({ profileUid: 'p', cursor: 0, changes: { upserts: [], deletions: [] } }, a.accessToken),
    );
    expect(doarPull.status).toBe(200);
  });
});

describe('limitele de rată', () => {
  it('auth pe IP: a treia cerere în fereastră → 429 cu Retry-After', async () => {
    const { app } = testApp({ RATE_AUTH_PER_15MIN: '2' });
    const init = post({ email: 'nu-conteaza@exemplu.ro', parola: 'parola123' });
    await app.request('/auth/login', init);
    await app.request('/auth/login', init);
    const res = await app.request('/auth/login', init);
    expect(res.status).toBe(429);
    expect((await res.json()).error.code).toBe('RATE_LIMITED');
    expect(Number(res.headers.get('retry-after'))).toBeGreaterThan(0);
  });

  it('sync per utilizator: peste limită → 429', async () => {
    const { app } = testApp({ RATE_SYNC_PER_MIN: '2' });
    const a = await inregistrare(app);
    const corp = () => post({ profileUid: 'p', cursor: 0, changes: { upserts: [], deletions: [] } }, a.accessToken);
    expect((await app.request('/sync', corp())).status).toBe(200);
    expect((await app.request('/sync', corp())).status).toBe(200);
    expect((await app.request('/sync', corp())).status).toBe(429);
  });
});
