import { describe, expect, it } from 'vitest';
import type { AuthResponse, MeResponse, TokenPair } from '../../shared/wire.ts';
import { get, inregistrare, post, testApp } from './helpers.ts';

describe('autentificare', () => {
  it('register → 201 cu tokenuri; /me răspunde', async () => {
    const { app } = testApp();
    const auth = await inregistrare(app);
    expect(auth.accessToken).toBeTruthy();
    expect(auth.refreshToken).toBeTruthy();
    expect(auth.user.email).toBe('testel@exemplu.ro');

    const me = await app.request('/auth/me', get(auth.accessToken));
    expect(me.status).toBe(200);
    const corp = (await me.json()) as MeResponse;
    expect(corp.profileUid).toBeNull();
    expect(corp.usedBytes).toBe(0);
    expect(corp.quotaBytes).toBeGreaterThan(0);
  });

  it('emailul e unic (case-insensitive) → 409', async () => {
    const { app } = testApp();
    await inregistrare(app, 'dublu@exemplu.ro');
    const res = await app.request('/auth/register', post({ email: 'DUBLU@exemplu.ro', parola: 'parola123' }));
    expect(res.status).toBe(409);
    expect((await res.json()).error.code).toBe('EMAIL_TAKEN');
  });

  it('validare: email strâmb și parolă scurtă → 400', async () => {
    const { app } = testApp();
    expect((await app.request('/auth/register', post({ email: 'nu-e-email', parola: 'parola123' }))).status).toBe(400);
    expect((await app.request('/auth/register', post({ email: 'ok@exemplu.ro', parola: 'scurt' }))).status).toBe(400);
  });

  it('login: parolă greșită → 401, corectă → tokenuri', async () => {
    const { app } = testApp();
    await inregistrare(app);
    const gresit = await app.request('/auth/login', post({ email: 'testel@exemplu.ro', parola: 'parolaRea99' }));
    expect(gresit.status).toBe(401);
    const bun = await app.request('/auth/login', post({ email: 'testel@exemplu.ro', parola: 'parola123' }));
    expect(bun.status).toBe(200);
    expect(((await bun.json()) as AuthResponse).accessToken).toBeTruthy();
  });

  it('refresh se rotește; refolosirea unuia consumat omoară familia', async () => {
    const { app } = testApp();
    const auth = await inregistrare(app);

    const r1 = await app.request('/auth/refresh', post({ refreshToken: auth.refreshToken }));
    expect(r1.status).toBe(200);
    const pereche = (await r1.json()) as TokenPair;
    expect(pereche.refreshToken).not.toBe(auth.refreshToken);

    // refolosire = furt → 401 și toată familia moare
    expect((await app.request('/auth/refresh', post({ refreshToken: auth.refreshToken }))).status).toBe(401);
    expect((await app.request('/auth/refresh', post({ refreshToken: pereche.refreshToken }))).status).toBe(401);
  });

  it('logout revocă familia', async () => {
    const { app } = testApp();
    const auth = await inregistrare(app);
    expect((await app.request('/auth/logout', post({ refreshToken: auth.refreshToken }))).status).toBe(204);
    expect((await app.request('/auth/refresh', post({ refreshToken: auth.refreshToken }))).status).toBe(401);
  });

  it('/me fără token → 401; token stricat → 401', async () => {
    const { app } = testApp();
    expect((await app.request('/auth/me')).status).toBe(401);
    expect((await app.request('/auth/me', get('gunoaie'))).status).toBe(401);
  });

  it('ștergerea contului cere parola și șterge tot (CASCADE)', async () => {
    const { app, db } = testApp();
    const auth = await inregistrare(app);
    await app.request('/sync', post({ profileUid: 'p-1', cursor: 0, changes: { upserts: [{ tabel: 'profiles', uid: 'p-1', payload: { nume: 'X' }, updatedAt: new Date().toISOString() }], deletions: [] } }, auth.accessToken));

    const gresit = await app.request('/auth/account', { ...post({ parola: 'alta-parola' }, auth.accessToken), method: 'DELETE' });
    expect(gresit.status).toBe(401);

    const ok = await app.request('/auth/account', { ...post({ parola: 'parola123' }, auth.accessToken), method: 'DELETE' });
    expect(ok.status).toBe(204);
    expect((db.prepare('SELECT COUNT(*) AS n FROM rows').get() as { n: number }).n).toBe(0);
    expect((db.prepare('SELECT COUNT(*) AS n FROM refresh_tokens').get() as { n: number }).n).toBe(0);
    expect((await app.request('/auth/login', post({ email: 'testel@exemplu.ro', parola: 'parola123' }))).status).toBe(401);
  });
});
