import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/data/db';
import { exportBackup, importBackup } from '@/data/backup';
import { createProfile, saveTemplate } from '@/data/repo';

const T1 = '2025-06-01T10:00:00.000Z';
const T2 = '2025-06-02T18:30:00.000Z';

/** Un backup v1 realist: fără uid-uri, cu id-uri numerice și FK-uri întregi. */
const BACKUP_V1 = JSON.stringify({
  app: 'gym-noob',
  versiune: 1,
  exportatLa: T2,
  date: {
    profiles: [{
      id: 1, nume: 'Vechiul', sex: 'M', dataNasterii: '1990-01-01', inaltime: 180,
      activitate: 'usor', tintaApaSesiune: 600, creatLa: T1, folositLa: T2,
    }],
    bodyMetrics: [{ id: 51, profileId: 1, data: T1, greutate: 90, sursa: 'manual' }],
    goals: [],
    templates: [{ id: 11, profileId: 1, nume: 'FB', etichete: [], items: [], creatLa: T1, modificatLa: T2 }],
    sessions: [{
      id: 21, profileId: 1, templateId: 11, status: 'terminata', inceput: T1, sfarsit: T2,
      durataActivaSec: 100, apaMl: 0, kcal: 10,
    }],
    setLogs: [{ id: 31, sessionId: 21, profileId: 1, exerciseId: 'plank', setIndex: 1, kcal: 5, data: T2 }],
    waterLogs: [],
    achievements: [{ id: 71, profileId: 1, achievementId: 'prima-sesiune', data: T2 }],
    settings: [{
      id: 81, profileId: 1, tema: 'zi', sunete: true, vocale: false, vibratii: true,
      sugestiiAutomate: true, economizor: true,
    }],
  },
});

beforeEach(async () => {
  await db.delete();
  await db.open();
});

describe('backup v2', () => {
  it('importul unui backup v1 generează uid-uri, oglinzi FK și dirty=1', async () => {
    await importBackup(BACKUP_V1);

    const p = await db.profiles.get(1);
    expect(p?.uid).toBeTruthy();
    expect(p?.dirty).toBe(1);

    const t = await db.templates.get(11);
    expect(t?.profileUid).toBe(p!.uid);

    const s = await db.sessions.get(21);
    expect(s?.templateUid).toBe(t!.uid);

    const set = await db.setLogs.get(31);
    expect(set?.sessionUid).toBe(s!.uid);
    expect(set?.profileUid).toBe(p!.uid);

    expect((await db.achievements.get(71))?.uid).toBe(`${p!.uid}-ach-prima-sesiune`);
    expect((await db.settings.get(81))?.uid).toBe(`${p!.uid}-settings`);
  });

  it('exportul e versiunea 2 și round-trip-ul păstrează uid-urile', async () => {
    const id = await createProfile(
      { nume: 'Testel', sex: 'M', dataNasterii: '1990-01-01', inaltime: 180, activitate: 'usor', tintaApaSesiune: 600 },
      90,
    );
    await saveTemplate({ profileId: id, nume: 'FB', etichete: [], items: [], creatLa: '', modificatLa: '' });
    const inainte = await db.profiles.get(id);

    const backup = await exportBackup();
    expect(backup.versiune).toBe(2);

    await importBackup(JSON.stringify(backup));
    const dupa = await db.profiles.get(id);
    expect(dupa?.uid).toBe(inainte!.uid);
    expect((await db.settings.where({ profileId: id }).first())?.uid).toBe(`${inainte!.uid}-settings`);
  });

  it('respinge fișiere din versiuni necunoscute (mai noi)', async () => {
    await expect(
      importBackup(JSON.stringify({ app: 'gym-noob', versiune: 3, exportatLa: T2, date: {} })),
    ).rejects.toThrow(/versiune mai nouă/);
  });

  it('restaurarea nu atinge jurnalul de ștergeri și starea contului', async () => {
    await db.deletions.put({ uid: 'x-1', tabel: 'templates', deletedAt: T2, dirty: 1 });
    await db.syncState.put({ profileUid: 'p-1', email: 'a@b.ro', accessToken: 'a', refreshToken: 'r', cursor: 5 });

    await importBackup(BACKUP_V1);

    expect(await db.deletions.count()).toBe(1);
    expect((await db.syncState.get('p-1'))?.cursor).toBe(5);
  });
});
