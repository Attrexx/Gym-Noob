import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '@/data/db';
import { addSetLog, createProfile, createSession, deleteTemplate, saveTemplate, setGoal, updateSession } from '@/data/repo';
import { colecteazaSchimbari, colecteazaTot } from '@/data/sync/collect';
import { aplicaRaspunsSync, curataDupaReplace, importaProfilDinCloud } from '@/data/sync/apply';
import { syncApi } from '@/data/sync/api';
import type { SyncResponse, WireRow } from '../../shared/wire';

const T_VECHI = '2026-01-01T00:00:00.000Z';
const T_NOU = '2026-06-01T00:00:00.000Z';

async function profilLegat() {
  const id = await createProfile(
    { nume: 'Testel', sex: 'M', dataNasterii: '1990-01-01', inaltime: 180, activitate: 'usor', tintaApaSesiune: 600 },
    90,
  );
  const profil = (await db.profiles.get(id))!;
  await db.syncState.put({ profileUid: profil.uid!, email: 'a@b.ro', accessToken: 'x', refreshToken: 'y', cursor: 0 });
  return { id, uid: profil.uid! };
}

beforeEach(async () => {
  await db.delete();
  await db.open();
});

describe('colectarea schimbărilor', () => {
  it('exclude sesiunile live și jurnalele lor; payload-ul nu are id-uri locale', async () => {
    const { id, uid } = await profilLegat();
    const sid = await createSession({
      profileId: id, status: 'activa', inceput: T_NOU, durataActivaSec: 0, apaMl: 0, kcal: 0,
    });
    await addSetLog({ sessionId: sid, profileId: id, exerciseId: 'plank', setIndex: 1, kcal: 5, data: T_NOU });

    const inainte = await colecteazaSchimbari(uid);
    expect(inainte.upserts.some((u) => u.tabel === 'sessions')).toBe(false);
    expect(inainte.upserts.some((u) => u.tabel === 'setLogs')).toBe(false);
    // profilul, cântărirea și setările pleacă normal
    expect(inainte.upserts.some((u) => u.tabel === 'profiles')).toBe(true);

    await updateSession(sid, { status: 'terminata', sfarsit: T_NOU });
    const dupa = await colecteazaSchimbari(uid);
    expect(dupa.upserts.some((u) => u.tabel === 'sessions')).toBe(true);
    expect(dupa.upserts.some((u) => u.tabel === 'setLogs')).toBe(true);

    for (const u of dupa.upserts) {
      expect(u.payload).not.toHaveProperty('id');
      expect(u.payload).not.toHaveProperty('dirty');
      expect(u.payload).not.toHaveProperty('profileId');
      expect(u.payload).not.toHaveProperty('sessionId');
    }
  });

  it('colecteazaTot ia și rândurile curate (nelegate încă de server)', async () => {
    const { uid } = await profilLegat();
    await db.profiles.where({ uid }).modify({ dirty: 0 });
    const tot = await colecteazaTot(uid);
    expect(tot.some((u) => u.tabel === 'profiles')).toBe(true);
  });
});

describe('aplicarea răspunsului', () => {
  it('ack: dirty=0 pe ce am împins; cursorul avansează în aceeași tranzacție', async () => {
    const { uid } = await profilLegat();
    const colectare = await colecteazaSchimbari(uid);
    const raspuns: SyncResponse = { cursor: 7, changes: { upserts: [], deletions: [] }, quota: { usedBytes: 1, quotaBytes: 2 } };

    await aplicaRaspunsSync(uid, raspuns, colectare);

    expect((await db.profiles.get({ uid }))!.dirty).toBe(0);
    expect((await db.syncState.get(uid))!.cursor).toBe(7);
  });

  it('LWW local: un rând dirty mai NOU decât ce vine nu e călcat', async () => {
    const { id, uid } = await profilLegat();
    const tid = await saveTemplate({ profileId: id, nume: 'Al meu, proaspăt', etichete: [], items: [], creatLa: '', modificatLa: '' });
    const t = (await db.templates.get(tid))!;

    const incoming: WireRow = {
      tabel: 'templates',
      uid: t.uid!,
      payload: { uid: t.uid, profileUid: uid, nume: 'Vechi din cloud', etichete: [], items: [], creatLa: T_VECHI, modificatLa: T_VECHI, updatedAt: T_VECHI },
      updatedAt: T_VECHI, // mai vechi decât editarea locală
    };
    await aplicaRaspunsSync(uid, { cursor: 1, changes: { upserts: [incoming], deletions: [] }, quota: { usedBytes: 0, quotaBytes: 1 } }, { upserts: [], deletions: [], snapshotTs: new Map() });

    expect((await db.templates.get(tid))!.nume).toBe('Al meu, proaspăt');

    // varianta mai NOUĂ trece și lasă rândul curat
    const maiNou: WireRow = { ...incoming, payload: { ...incoming.payload, nume: 'Nou din cloud', updatedAt: '2027-01-01T00:00:00.000Z' }, updatedAt: '2027-01-01T00:00:00.000Z' };
    await aplicaRaspunsSync(uid, { cursor: 2, changes: { upserts: [maiNou], deletions: [] }, quota: { usedBytes: 0, quotaBytes: 1 } }, { upserts: [], deletions: [], snapshotTs: new Map() });
    const dupa = (await db.templates.get(tid))!;
    expect(dupa.nume).toBe('Nou din cloud');
    expect(dupa.dirty).toBe(0);
    expect(dupa.id).toBe(tid); // id-ul local se păstrează
  });

  it('ștergerile primite se aplică; jurnalele orfane (părinte șters) se sar', async () => {
    const { id, uid } = await profilLegat();
    const tid = await saveTemplate({ profileId: id, nume: 'De șters din cloud', etichete: [], items: [], creatLa: '', modificatLa: '' });
    const t = (await db.templates.get(tid))!;
    await db.templates.update(tid, { dirty: 0 });

    const raspuns: SyncResponse = {
      cursor: 3,
      changes: {
        upserts: [
          { tabel: 'setLogs', uid: 'orfan-1', payload: { uid: 'orfan-1', profileUid: uid, sessionUid: 'sesiune-inexistenta', exerciseId: 'plank', setIndex: 1, kcal: 1, data: T_NOU, updatedAt: T_NOU }, updatedAt: T_NOU },
        ],
        deletions: [{ tabel: 'templates', uid: t.uid!, deletedAt: '2027-01-01T00:00:00.000Z' }],
      },
      quota: { usedBytes: 0, quotaBytes: 1 },
    };
    const rezultat = await aplicaRaspunsSync(uid, raspuns, { upserts: [], deletions: [], snapshotTs: new Map() });

    expect(await db.templates.get(tid)).toBeUndefined();
    expect(await db.setLogs.get({ uid: 'orfan-1' }).catch(() => undefined)).toBeUndefined();
    expect(rezultat.sarite).toBe(1);
  });

  it('repară invarianta obiectivelor: un singur activ (cel mai nou)', async () => {
    const { id, uid } = await profilLegat();
    await setGoal(id, 80, 0.5);
    // simulăm un pull care aduce un AL DOILEA obiectiv activ (creat mai târziu pe alt dispozitiv)
    const strain: WireRow = {
      tabel: 'goals',
      uid: 'goal-strain',
      payload: { uid: 'goal-strain', profileUid: uid, greutateTinta: 78, ritmKgSaptamana: 0.5, activ: true, creatLa: '2027-01-01T00:00:00.000Z', updatedAt: '2027-01-01T00:00:00.000Z' },
      updatedAt: '2027-01-01T00:00:00.000Z',
    };
    await aplicaRaspunsSync(uid, { cursor: 1, changes: { upserts: [strain], deletions: [] }, quota: { usedBytes: 0, quotaBytes: 1 } }, { upserts: [], deletions: [], snapshotTs: new Map() });

    const active = await db.goals.where({ profileId: id }).filter((g) => g.activ).toArray();
    expect(active).toHaveLength(1);
    expect(active[0].uid).toBe('goal-strain'); // cel mai nou creatLa câștigă, determinist
  });
});

describe('importul unui profil din cloud (dispozitiv proaspăt)', () => {
  it('reconstruiește id-urile locale și scrie starea contului', async () => {
    const rows: WireRow[] = [
      { tabel: 'profiles', uid: 'p-cloud', payload: { uid: 'p-cloud', nume: 'DinCloud', sex: 'F', dataNasterii: '1995-05-05', inaltime: 165, activitate: 'usor', tintaApaSesiune: 500, creatLa: T_VECHI, folositLa: T_NOU, updatedAt: T_NOU }, updatedAt: T_NOU },
      { tabel: 'templates', uid: 't-cloud', payload: { uid: 't-cloud', profileUid: 'p-cloud', nume: 'FB Cloud', etichete: [], items: [], creatLa: T_VECHI, modificatLa: T_NOU, updatedAt: T_NOU }, updatedAt: T_NOU },
      { tabel: 'sessions', uid: 's-cloud', payload: { uid: 's-cloud', profileUid: 'p-cloud', templateUid: 't-cloud', status: 'terminata', inceput: T_VECHI, sfarsit: T_NOU, durataActivaSec: 100, apaMl: 0, kcal: 10, updatedAt: T_NOU }, updatedAt: T_NOU },
      { tabel: 'setLogs', uid: 'l-cloud', payload: { uid: 'l-cloud', profileUid: 'p-cloud', sessionUid: 's-cloud', exerciseId: 'plank', setIndex: 1, kcal: 5, data: T_NOU, updatedAt: T_NOU }, updatedAt: T_NOU },
      { tabel: 'settings', uid: 'p-cloud-settings', payload: { uid: 'p-cloud-settings', profileUid: 'p-cloud', tema: 'noapte', sunete: true, vocale: false, vibratii: true, sugestiiAutomate: true, economizor: true, updatedAt: T_NOU }, updatedAt: T_NOU },
    ];

    const idNou = await importaProfilDinCloud(rows, {
      profileUid: 'p-cloud', email: 'c@d.ro', accessToken: 'a', refreshToken: 'r', cursor: 42,
    });

    const profil = (await db.profiles.get(idNou))!;
    expect(profil.nume).toBe('DinCloud');
    const template = (await db.templates.get({ uid: 't-cloud' }))!;
    const sesiune = (await db.sessions.get({ uid: 's-cloud' }))!;
    expect(sesiune.profileId).toBe(idNou);
    expect(sesiune.templateId).toBe(template.id);
    const jurnal = (await db.setLogs.get({ uid: 'l-cloud' }))!;
    expect(jurnal.sessionId).toBe(sesiune.id);
    expect(jurnal.dirty).toBe(0);
    expect((await db.syncState.get('p-cloud'))!.cursor).toBe(42);
  });
});

describe('curățenia după replace', () => {
  it('dirty=0 pe rândurile profilului și golește jurnalul de ștergeri', async () => {
    const { id, uid } = await profilLegat();
    const tid = await saveTemplate({ profileId: id, nume: 'Efemer', etichete: [], items: [], creatLa: '', modificatLa: '' });
    await deleteTemplate(tid);
    expect(await db.deletions.count()).toBe(1);

    await curataDupaReplace({ profileUid: uid, email: 'a@b.ro', accessToken: 'a', refreshToken: 'r', cursor: 9 });

    expect(await db.deletions.count()).toBe(0);
    expect((await db.profiles.get({ uid }))!.dirty).toBe(0);
    expect((await db.settings.where({ profileId: id }).first())!.dirty).toBe(0);
    expect((await db.syncState.get(uid))!.cursor).toBe(9);
  });
});

describe('restaurarea unui backup cu cont legat (restaurarea e autoritară)', () => {
  it('profilul contului nu mai există (backup v1, uid-uri noi) → contul se dezleagă', async () => {
    await db.syncState.put({ profileUid: 'uid-disparut', email: 'x@y.ro', accessToken: 'a', refreshToken: 'r', cursor: 3 });
    const { dupaRestaurareBackup } = await import('@/data/sync/engine');
    const nota = await dupaRestaurareBackup();
    expect(nota).toMatch(/leagă contul din nou/);
    expect(await db.syncState.get('uid-disparut')).toBeUndefined();
  });

  it('profilul există (backup v2, același uid) → replace autoritar + rândurile rămân curate', async () => {
    const { uid } = await profilLegat();
    const fetchFals = vi.fn(async (url: RequestInfo | URL) => {
      if (String(url).endsWith('/sync/replace')) {
        return new Response(JSON.stringify({ cursor: 11, quota: { usedBytes: 5, quotaBytes: 100 } }), { status: 200 });
      }
      return new Response('{}', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchFals);
    try {
      const { dupaRestaurareBackup } = await import('@/data/sync/engine');
      const nota = await dupaRestaurareBackup();
      expect(nota).toMatch(/adus la varianta restaurată/);
      expect((await db.syncState.get(uid))!.cursor).toBe(11);
      expect((await db.profiles.get({ uid }))!.dirty).toBe(0);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('replace eșuat (offline) → dezlegăm, nu lăsăm un merge tăcut pe mai târziu', async () => {
    const { uid } = await profilLegat();
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 500 })));
    try {
      const { dupaRestaurareBackup } = await import('@/data/sync/engine');
      const nota = await dupaRestaurareBackup();
      expect(nota).toMatch(/leagă contul din nou/);
      expect(await db.syncState.get(uid)).toBeUndefined();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('clientul API — refresh single-flight', () => {
  it('două cereri 401 simultane fac UN singur refresh', async () => {
    // (fără localStorage în node — config.ts cade pe URL-ul implicit, iar fetch-ul e oricum fals)
    await db.syncState.put({ profileUid: 'p1', email: 'a@b.ro', accessToken: 'vechi', refreshToken: 'r1', cursor: 0 });

    let refreshuri = 0;
    const fetchFals = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const cale = String(url);
      const auth = (init?.headers as Record<string, string>)?.authorization ?? '';
      if (cale.endsWith('/auth/refresh')) {
        refreshuri++;
        await new Promise((r) => setTimeout(r, 20)); // lasă ambele cereri să pice pe 401 întâi
        return new Response(JSON.stringify({ accessToken: 'nou', refreshToken: 'r2' }), { status: 200 });
      }
      if (cale.endsWith('/sync')) {
        if (auth === 'Bearer vechi') {
          return new Response(JSON.stringify({ error: { code: 'TOKEN_EXPIRED' } }), { status: 401 });
        }
        return new Response(
          JSON.stringify({ cursor: 1, changes: { upserts: [], deletions: [] }, quota: { usedBytes: 0, quotaBytes: 1 } }),
          { status: 200 },
        );
      }
      return new Response('{}', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchFals);
    try {
      const corp = { profileUid: 'p1', cursor: 0, changes: { upserts: [], deletions: [] } };
      const [a, b] = await Promise.all([syncApi('p1', corp), syncApi('p1', corp)]);
      expect(a.cursor).toBe(1);
      expect(b.cursor).toBe(1);
      expect(refreshuri).toBe(1);
      expect((await db.syncState.get('p1'))!.refreshToken).toBe('r2');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
