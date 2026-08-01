import 'fake-indexeddb/auto';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/data/db';
import { incarcaLimba } from '@/i18n/store';
import {
  addBodyMetric,
  addSetLog,
  addStarterTemplates,
  addWater,
  createProfile,
  createSession,
  deleteTemplate,
  importaProgram,
  importBodyMetrics,
  saveTemplate,
  setGoal,
  unlockAchievement,
  updateProfile,
  updateSession,
} from '@/data/repo';
import type { ProgramDef } from '@/data/types';

// șabloanele livrate își iau numele din pachetul limbii
beforeAll(async () => {
  await incarcaLimba('ro');
});

/** Fiecare scriere din repo trebuie să stampileze uid/updatedAt/dirty + oglinzile FK. */

async function profilNou(): Promise<number> {
  return createProfile(
    { nume: 'Testel', sex: 'M', dataNasterii: '1990-01-01', inaltime: 180, activitate: 'usor', tintaApaSesiune: 600 },
    90,
  );
}

const PROGRAM_TEST: ProgramDef = {
  id: 'test-prog',
  nume: 'Program de test',
  subtitlu: 'doar pentru teste',
  origine: 'tests/',
  descriere: '',
  nivel: 1,
  obiective: ['forta'],
  frecventa: '3 zile',
  durata: '30 min',
  saptamana: [],
  progresie: [],
  etichete: ['test'],
  antrenamente: [
    { id: 'a', nume: 'Ziua A', items: [{ exerciseId: 'plank', seturi: 2, durataSec: 30, pauzaSec: 60 }] },
    { id: 'b', nume: 'Ziua B', items: [{ exerciseId: 'plank', seturi: 3, durataSec: 40, pauzaSec: 60 }] },
  ],
};

beforeEach(async () => {
  await db.delete();
  await db.open();
});

describe('stampilarea din repo', () => {
  it('createProfile stampilează profilul, prima cântărire și setările (uid derivat)', async () => {
    const id = await profilNou();
    const p = await db.profiles.get(id);
    expect(p?.uid).toBeTruthy();
    expect(p?.dirty).toBe(1);
    expect(p?.updatedAt).toBeTruthy();

    const m = await db.bodyMetrics.where({ profileId: id }).first();
    expect(m?.uid).toBeTruthy();
    expect(m?.profileUid).toBe(p!.uid);

    const s = await db.settings.where({ profileId: id }).first();
    expect(s?.uid).toBe(`${p!.uid}-settings`);
    expect(s?.profileUid).toBe(p!.uid);
  });

  it('updateProfile / addBodyMetric / setGoal stampilează și oglindesc profileUid', async () => {
    const id = await profilNou();
    const p = await db.profiles.get(id);

    await updateProfile(id, { inaltime: 182 });
    expect((await db.profiles.get(id))?.inaltime).toBe(182);

    await addBodyMetric({ profileId: id, data: new Date().toISOString(), greutate: 89, sursa: 'manual' });
    const metrici = await db.bodyMetrics.where({ profileId: id }).toArray();
    expect(metrici).toHaveLength(2);
    expect(metrici.every((m) => m.uid && m.profileUid === p!.uid && m.dirty === 1)).toBe(true);

    await setGoal(id, 80, 0.5); // createProfile nu setează obiectiv
    await setGoal(id, 78, 0.5); // al doilea dezactivează primul
    const goals = await db.goals.where({ profileId: id }).toArray();
    expect(goals).toHaveLength(2);
    expect(goals.every((g) => g.uid && g.profileUid === p!.uid && g.dirty === 1 && g.updatedAt)).toBe(true);
    expect(goals.filter((g) => g.activ)).toHaveLength(1);
  });

  it('deleteTemplate scrie în jurnalul de ștergeri', async () => {
    const id = await profilNou();
    const tid = await saveTemplate({
      profileId: id, nume: 'De șters', etichete: [], items: [], creatLa: '', modificatLa: '',
    });
    const t = await db.templates.get(tid);
    expect(t?.uid).toBeTruthy();

    await deleteTemplate(tid);
    expect(await db.templates.get(tid)).toBeUndefined();
    const del = await db.deletions.get(t!.uid!);
    expect(del).toMatchObject({ tabel: 'templates', profileUid: t!.profileUid, dirty: 1 });
    expect(del?.deletedAt).toBeTruthy();
  });

  it('importaProgram înlocuiește copiile vechi și le notează ștergerea', async () => {
    const id = await profilNou();
    expect(await importaProgram(id, PROGRAM_TEST)).toBe(2);
    const primele = await db.templates.where({ profileId: id }).filter((t) => !t.predefinit).toArray();
    expect(primele.every((t) => t.uid && t.profileUid && t.dirty === 1)).toBe(true);

    expect(await importaProgram(id, PROGRAM_TEST)).toBe(2);
    const dupa = await db.templates.where({ profileId: id }).filter((t) => !t.predefinit).toArray();
    expect(dupa).toHaveLength(2); // înlocuite, nu dublate
    expect(await db.deletions.count()).toBe(2); // copiile vechi, notate
  });

  it('createSession/updateSession/addSetLog/addWater oglindesc uid-urile părinților', async () => {
    const id = await profilNou();
    const p = await db.profiles.get(id);
    const tid = await saveTemplate({
      profileId: id, nume: 'FB', etichete: [], items: [], creatLa: '', modificatLa: '',
    });
    const template = await db.templates.get(tid);

    const sid = await createSession({
      profileId: id, templateId: tid, templateNume: 'FB', status: 'activa',
      inceput: new Date().toISOString(), durataActivaSec: 0, apaMl: 0, kcal: 0,
    });
    const s = await db.sessions.get(sid);
    expect(s?.uid).toBeTruthy();
    expect(s?.profileUid).toBe(p!.uid);
    expect(s?.templateUid).toBe(template!.uid);

    await addSetLog({
      sessionId: sid, profileId: id, exerciseId: 'plank', setIndex: 1, durataSec: 30, kcal: 5,
      data: new Date().toISOString(),
    });
    const set = await db.setLogs.where({ sessionId: sid }).first();
    expect(set?.sessionUid).toBe(s!.uid);
    expect(set?.profileUid).toBe(p!.uid);

    await addWater({ sessionId: sid, profileId: id, ml: 250, data: new Date().toISOString() });
    const apa = await db.waterLogs.where({ sessionId: sid }).first();
    expect(apa?.sessionUid).toBe(s!.uid);
    expect((await db.sessions.get(sid))?.apaMl).toBe(250);

    const inainte = (await db.sessions.get(sid))!.updatedAt!;
    await new Promise((r) => setTimeout(r, 5));
    await updateSession(sid, { status: 'terminata' });
    const dupa = await db.sessions.get(sid);
    expect(dupa?.dirty).toBe(1);
    expect(dupa!.updatedAt! >= inainte).toBe(true);
  });

  it('datele de la aparatul Bluetooth se salvează pe set, cu stampilele obișnuite', async () => {
    const id = await profilNou();
    const p = await db.profiles.get(id);
    const sid = await createSession({
      profileId: id, status: 'activa', inceput: new Date().toISOString(),
      durataActivaSec: 0, apaMl: 0, kcal: 0,
    });

    await addSetLog({
      sessionId: sid, profileId: id, exerciseId: 'banda-alergare', setIndex: 1,
      durataSec: 1500, kcal: 280, data: new Date().toISOString(),
      viteza: 9.5, inclinatie: 2,
      aparatTip: 'banda', aparatModel: 'Star Trac 8TR',
      distantaM: 3100, cadentaMedie: 168, putereMedieW: 210, kcalAparat: 265,
    });

    const set = await db.setLogs.where({ sessionId: sid }).first();
    expect(set).toMatchObject({
      aparatTip: 'banda',
      aparatModel: 'Star Trac 8TR',
      distantaM: 3100,
      cadentaMedie: 168,
      putereMedieW: 210,
      kcalAparat: 265,
    });
    // câmpurile noi nu au voie să strice contractul de sincronizare
    expect(set?.uid).toBeTruthy();
    expect(set?.dirty).toBe(1);
    expect(set?.profileUid).toBe(p!.uid);
  });

  it('unlockAchievement folosește uid derivat și rămâne idempotent', async () => {
    const id = await profilNou();
    const p = await db.profiles.get(id);
    expect(await unlockAchievement(id, 'prima-sesiune')).toBe(true);
    expect(await unlockAchievement(id, 'prima-sesiune')).toBe(false);
    const rows = await db.achievements.where({ profileId: id }).toArray();
    expect(rows).toHaveLength(1);
    expect(rows[0].uid).toBe(`${p!.uid}-ach-prima-sesiune`);
  });

  it('addStarterTemplates și importBodyMetrics stampilează în masă', async () => {
    const id = await profilNou();
    const p = await db.profiles.get(id);

    await addStarterTemplates(id);
    const templates = await db.templates.where({ profileId: id }).toArray();
    expect(templates.length).toBeGreaterThan(0);
    expect(templates.every((t) => t.uid && t.profileUid === p!.uid && t.dirty === 1)).toBe(true);

    // prima cântărire există deja azi → importul sare ziua respectivă
    const azi = new Date().toISOString();
    const n = await importBodyMetrics(id, [
      { data: azi, greutate: 91 },
      { data: '2025-05-05T08:00:00.000Z', greutate: 92 },
    ]);
    expect(n).toBe(1);
    const importate = await db.bodyMetrics.where({ profileId: id }).filter((m) => m.sursa === 'freefit').toArray();
    expect(importate).toHaveLength(1);
    expect(importate[0].profileUid).toBe(p!.uid);
    expect(importate[0].dirty).toBe(1);
  });
});
