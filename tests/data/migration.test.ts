import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { describe, expect, it } from 'vitest';

/**
 * Testul migrației v1 → v2: construim o bază EXACT ca în producție înainte
 * de sincronizare (schema version(1), fără uid-uri), o închidem, apoi
 * deschidem clasa reală a aplicației peste ea și verificăm backfill-ul.
 */

const T0 = '2025-01-01T10:00:00.000Z';
const T1 = '2025-06-01T10:00:00.000Z';
const T2 = '2025-06-02T18:30:00.000Z';

async function seedV1() {
  const v1 = new Dexie('gym-noob');
  v1.version(1).stores({
    profiles: '++id, nume, folositLa',
    bodyMetrics: '++id, profileId, data, [profileId+data]',
    goals: '++id, profileId, activ',
    templates: '++id, profileId, nume',
    sessions: '++id, profileId, status, inceput, [profileId+inceput]',
    setLogs: '++id, sessionId, profileId, exerciseId, data, [profileId+exerciseId], [profileId+data]',
    waterLogs: '++id, sessionId, profileId, data',
    achievements: '++id, profileId, achievementId, [profileId+achievementId]',
    settings: '++id, profileId',
  });
  await v1.open();
  await v1.table('profiles').add({
    id: 1, nume: 'Testel', sex: 'M', dataNasterii: '1990-01-01', inaltime: 180,
    activitate: 'usor', tintaApaSesiune: 600, creatLa: T0, folositLa: T1,
  });
  await v1.table('templates').add({
    id: 11, profileId: 1, nume: 'Full Body A', etichete: [], items: [], creatLa: T0, modificatLa: T2,
  });
  await v1.table('sessions').add({
    id: 21, profileId: 1, templateId: 11, templateNume: 'Full Body A', status: 'terminata',
    inceput: T1, sfarsit: T2, durataActivaSec: 3600, apaMl: 500, kcal: 300,
  });
  await v1.table('setLogs').add({
    id: 31, sessionId: 21, profileId: 1, exerciseId: 'plank', setIndex: 1, durataSec: 30, kcal: 5, data: T2,
  });
  await v1.table('waterLogs').add({ id: 41, sessionId: 21, profileId: 1, ml: 250, data: T2 });
  await v1.table('bodyMetrics').add({ id: 51, profileId: 1, data: T1, greutate: 90, sursa: 'manual' });
  await v1.table('goals').add({
    id: 61, profileId: 1, greutateTinta: 80, ritmKgSaptamana: 0.5, activ: true, creatLa: T0,
  });
  await v1.table('achievements').add({ id: 71, profileId: 1, achievementId: 'prima-sesiune', data: T2 });
  await v1.table('settings').add({
    id: 81, profileId: 1, tema: 'zi', sunete: true, vocale: false, vibratii: true,
    sugestiiAutomate: true, economizor: true,
  });
  v1.close();
}

describe('migrația Dexie v1 → v2', () => {
  it('backfill: uid unic, updatedAt din timestampuri de domeniu, dirty=1, oglinzi FK, uid-uri derivate', async () => {
    await seedV1();
    const { db } = await import('@/data/db');

    const profil = await db.profiles.get(1);
    expect(profil?.uid).toBeTruthy();
    expect(profil?.updatedAt).toBe(T1); // folositLa
    expect(profil?.dirty).toBe(1);

    const template = await db.templates.get(11);
    expect(template?.uid).toBeTruthy();
    expect(template?.profileUid).toBe(profil!.uid);
    expect(template?.updatedAt).toBe(T2); // modificatLa

    const sesiune = await db.sessions.get(21);
    expect(sesiune?.profileUid).toBe(profil!.uid);
    expect(sesiune?.templateUid).toBe(template!.uid);
    expect(sesiune?.updatedAt).toBe(T2); // sfarsit

    const set = await db.setLogs.get(31);
    expect(set?.profileUid).toBe(profil!.uid);
    expect(set?.sessionUid).toBe(sesiune!.uid);
    expect(set?.updatedAt).toBe(T2); // data

    const apa = await db.waterLogs.get(41);
    expect(apa?.sessionUid).toBe(sesiune!.uid);

    const metric = await db.bodyMetrics.get(51);
    expect(metric?.profileUid).toBe(profil!.uid);
    expect(metric?.updatedAt).toBe(T1);

    const obiectiv = await db.goals.get(61);
    expect(obiectiv?.profileUid).toBe(profil!.uid);
    expect(obiectiv?.updatedAt).toBe(T0); // creatLa (fără atinsLa)

    // uid-uri DERIVATE — identice pe orice dispozitiv pentru același rând logic
    const realizare = await db.achievements.get(71);
    expect(realizare?.uid).toBe(`${profil!.uid}-ach-prima-sesiune`);
    const setari = await db.settings.get(81);
    expect(setari?.uid).toBe(`${profil!.uid}-settings`);

    // toate uid-urile sunt distincte între ele
    const uids = [profil, template, sesiune, set, apa, metric, obiectiv, realizare, setari].map((r) => r!.uid);
    expect(new Set(uids).size).toBe(uids.length);

    // tabelele noi există și sunt goale
    expect(await db.deletions.count()).toBe(0);
    expect(await db.syncState.count()).toBe(0);

    db.close();
  });
});
