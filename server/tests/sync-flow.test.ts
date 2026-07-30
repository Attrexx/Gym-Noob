import { describe, expect, it } from 'vitest';
import type { SnapshotResponse, SyncResponse } from '../../shared/wire.ts';
import { get, inregistrare, post, rand, testApp } from './helpers.ts';

const T1 = '2026-07-01T10:00:00.000Z';
const T2 = '2026-07-02T10:00:00.000Z';
const T3 = '2026-07-03T10:00:00.000Z';

/** Două „dispozitive" = două perechi de tokenuri pe același cont, cursoare separate. */
describe('fluxul de sincronizare', () => {
  it('push-ul leagă profilul, nu-și primește propriul ecou, iar alt dispozitiv trage schimbările', async () => {
    const { app } = testApp();
    const a = await inregistrare(app);

    const push = await app.request(
      '/sync',
      post(
        {
          profileUid: 'prof-1',
          cursor: 0,
          changes: {
            upserts: [rand('profiles', 'prof-1', T1, { nume: 'Testel' }), rand('templates', 'tpl-1', T1, { nume: 'FB A' })],
            deletions: [],
          },
        },
        a.accessToken,
      ),
    );
    expect(push.status).toBe(200);
    const r1 = (await push.json()) as SyncResponse;
    expect(r1.cursor).toBe(2);
    expect(r1.changes.upserts).toHaveLength(0); // fără ecou
    expect(r1.quota.usedBytes).toBeGreaterThan(0);

    // „dispozitivul B": login separat, pull de la cursor 0
    const loginB = await app.request('/auth/login', post({ email: 'testel@exemplu.ro', parola: 'parola123' }));
    const b = await loginB.json();
    const pullB = await app.request(
      '/sync',
      post({ profileUid: 'prof-1', cursor: 0, changes: { upserts: [], deletions: [] } }, b.accessToken),
    );
    const r2 = (await pullB.json()) as SyncResponse;
    expect(r2.changes.upserts.map((u) => u.uid).sort()).toEqual(['prof-1', 'tpl-1']);
    expect(r2.cursor).toBe(2);
  });

  it('LWW: mai nou câștigă, mai vechi e ignorat, egalul păstrează serverul', async () => {
    const { app, db } = testApp();
    const a = await inregistrare(app);
    const push = (corp: unknown) => app.request('/sync', post(corp, a.accessToken));

    await push({ profileUid: 'p', cursor: 0, changes: { upserts: [rand('templates', 't', T2, { nume: 'v2' })], deletions: [] } });
    // mai vechi → respins fără seq nou
    await push({ profileUid: 'p', cursor: 2, changes: { upserts: [rand('templates', 't', T1, { nume: 'v1' })], deletions: [] } });
    // egal → respins (serverul rămâne)
    await push({ profileUid: 'p', cursor: 2, changes: { upserts: [rand('templates', 't', T2, { nume: 'v2-alt' })], deletions: [] } });
    // mai nou → acceptat
    await push({ profileUid: 'p', cursor: 2, changes: { upserts: [rand('templates', 't', T3, { nume: 'v3' })], deletions: [] } });

    const stocat = db.prepare("SELECT payload FROM rows WHERE tabel = 'templates' AND uid = 't'").get() as { payload: string };
    expect(JSON.parse(stocat.payload).nume).toBe('v3');
  });

  it('ștergerile se propagă; o editare mai nouă decât ștergerea învie rândul', async () => {
    const { app } = testApp();
    const a = await inregistrare(app);
    const push = (corp: unknown) => app.request('/sync', post(corp, a.accessToken));

    await push({ profileUid: 'p', cursor: 0, changes: { upserts: [rand('templates', 't1', T1), rand('templates', 't2', T1)], deletions: [] } });
    const dupaStergere = (await (
      await push({ profileUid: 'p', cursor: 2, changes: { upserts: [], deletions: [{ tabel: 'templates', uid: 't1', deletedAt: T2 }] } })
    ).json()) as SyncResponse;

    // alt dispozitiv (cursor 2) vede ștergerea
    const pull = (await (await push({ profileUid: 'p', cursor: 2, changes: { upserts: [], deletions: [] } })).json()) as SyncResponse;
    expect(pull.changes.deletions).toEqual([{ tabel: 'templates', uid: 't1', deletedAt: T2 }]);

    // înviere: editare cu timestamp peste ștergere
    await push({ profileUid: 'p', cursor: dupaStergere.cursor, changes: { upserts: [rand('templates', 't1', T3, { nume: 'înviat' })], deletions: [] } });
    const snap = (await (await app.request('/sync/snapshot', get(a.accessToken))).json()) as SnapshotResponse;
    expect(snap.rows.filter((r) => r.uid === 't1')).toHaveLength(1);

    // ștergere mai VECHE decât editarea → ignorată
    await push({ profileUid: 'p', cursor: snap.cursor, changes: { upserts: [], deletions: [{ tabel: 'templates', uid: 't1', deletedAt: T2 }] } });
    const snap2 = (await (await app.request('/sync/snapshot', get(a.accessToken))).json()) as SnapshotResponse;
    expect(snap2.rows.filter((r) => r.uid === 't1')).toHaveLength(1);
  });

  it('contul e legat de UN profil: alt profileUid → 409 PROFILE_MISMATCH', async () => {
    const { app } = testApp();
    const a = await inregistrare(app);
    await app.request('/sync', post({ profileUid: 'p-bun', cursor: 0, changes: { upserts: [], deletions: [] } }, a.accessToken));
    const strain = await app.request(
      '/sync',
      post({ profileUid: 'p-strain', cursor: 0, changes: { upserts: [], deletions: [] } }, a.accessToken),
    );
    expect(strain.status).toBe(409);
    expect((await strain.json()).error.code).toBe('PROFILE_MISMATCH');
  });

  it('replace: absentele devin tombstone, primitele bat orice push întârziat, relegarea e permisă', async () => {
    const { app } = testApp();
    const a = await inregistrare(app);
    const push = (corp: unknown) => app.request('/sync', post(corp, a.accessToken));

    await push({ profileUid: 'p', cursor: 0, changes: { upserts: [rand('templates', 'ramane', T1), rand('templates', 'dispare', T1)], deletions: [] } });

    const replace = await app.request(
      '/sync/replace',
      post({ profileUid: 'p', rows: [rand('templates', 'ramane', T1, { nume: 'nou' })] }, a.accessToken),
    );
    expect(replace.status).toBe(200);

    const snap = (await (await app.request('/sync/snapshot', get(a.accessToken))).json()) as SnapshotResponse;
    expect(snap.rows.map((r) => r.uid)).toEqual(['ramane']);

    // un pull de pe alt cursor vede tombstone-ul pentru 'dispare'
    const pull = (await (await push({ profileUid: 'p', cursor: 2, changes: { upserts: [], deletions: [] } })).json()) as SyncResponse;
    expect(pull.changes.deletions.map((d) => d.uid)).toContain('dispare');

    // push întârziat cu timestamp vechi pierde în fața replace-ului (stamp = acum)
    await push({ profileUid: 'p', cursor: pull.cursor, changes: { upserts: [rand('templates', 'ramane', T3, { nume: 'întârziat' })], deletions: [] } });
    const snap2 = (await (await app.request('/sync/snapshot', get(a.accessToken))).json()) as SnapshotResponse;
    expect((snap2.rows[0].payload as { nume: string }).nume).toBe('nou');

    // relegare: replace pe ALT profil e permis (acțiune explicită), apoi push pe cel vechi → 409
    expect((await app.request('/sync/replace', post({ profileUid: 'p2', rows: [] }, a.accessToken))).status).toBe(200);
    expect((await push({ profileUid: 'p', cursor: 0, changes: { upserts: [], deletions: [] } })).status).toBe(409);
  });

  it('snapshot întoarce doar rândurile vii + profilul legat', async () => {
    const { app } = testApp();
    const a = await inregistrare(app);
    await app.request(
      '/sync',
      post(
        {
          profileUid: 'p',
          cursor: 0,
          changes: { upserts: [rand('profiles', 'p', T1)], deletions: [{ tabel: 'templates', uid: 'mort', deletedAt: T1 }] },
        },
        a.accessToken,
      ),
    );
    const snap = (await (await app.request('/sync/snapshot', get(a.accessToken))).json()) as SnapshotResponse;
    expect(snap.profileUid).toBe('p');
    expect(snap.rows.map((r) => r.uid)).toEqual(['p']);
    expect(snap.cursor).toBe(2);
  });

  it('validare: tabel necunoscut → 400', async () => {
    const { app } = testApp();
    const a = await inregistrare(app);
    const res = await app.request(
      '/sync',
      post({ profileUid: 'p', cursor: 0, changes: { upserts: [rand('parole', 'x', T1)], deletions: [] } }, a.accessToken),
    );
    expect(res.status).toBe(400);
  });
});
