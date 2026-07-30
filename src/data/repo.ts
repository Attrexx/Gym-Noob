import { db } from './db';
import { achievementUid, newUid, settingsUid } from './ids';
import { starterTemplates } from './catalog/starterTemplates';
import {
  SETARI_IMPLICITE,
  type BodyMetric,
  type Goal,
  type ProgramDef,
  type Profile,
  type Session,
  type SetLog,
  type Settings,
  type Template,
  type WaterLog,
} from './types';

const now = () => new Date().toISOString();

/**
 * Fiecare scriere de aici stampilează metadatele de sincronizare:
 * `uid` (identitatea rândului între dispozitive), oglinzile de chei străine
 * (`profileUid`/`sessionUid`/`templateUid`) și `updatedAt` + `dirty: 1`.
 * Pentru cine nu are cont, `dirty` e inert — motorul de sync nu rulează.
 */
async function profileUidOf(profileId: number): Promise<string | undefined> {
  return (await db.profiles.get(profileId))?.uid;
}

// ── Profiluri ───────────────────────────────────────────────────────

export async function createProfile(
  p: Omit<Profile, 'id' | 'creatLa' | 'folositLa'>,
  greutateInitiala: number,
  masuri?: { talie?: number; gat?: number; sold?: number },
): Promise<number> {
  const uid = newUid();
  const id = (await db.profiles.add({
    ...p,
    uid,
    updatedAt: now(),
    dirty: 1,
    creatLa: now(),
    folositLa: now(),
  })) as number;
  await db.bodyMetrics.add({
    profileId: id,
    profileUid: uid,
    uid: newUid(),
    updatedAt: now(),
    dirty: 1,
    data: now(),
    greutate: greutateInitiala,
    ...masuri,
    sursa: 'manual',
  });
  await db.settings.add({
    ...SETARI_IMPLICITE,
    profileId: id,
    profileUid: uid,
    uid: settingsUid(uid),
    updatedAt: now(),
    dirty: 1,
  });
  return id;
}

export async function touchProfile(id: number) {
  await db.profiles.update(id, { folositLa: now(), updatedAt: now(), dirty: 1 });
}

export async function updateProfile(
  id: number,
  changes: Partial<Pick<Profile, 'nume' | 'inaltime' | 'activitate' | 'tintaApaSesiune'>>,
) {
  await db.profiles.update(id, { ...changes, updatedAt: now(), dirty: 1 });
}

export async function lastUsedProfile(): Promise<Profile | undefined> {
  return (await db.profiles.orderBy('folositLa').reverse().first()) ?? undefined;
}

// ── Metrici corporale / greutate ───────────────────────────────────

export async function addBodyMetric(m: Omit<BodyMetric, 'id'>): Promise<number> {
  const profileUid = m.profileUid ?? (await profileUidOf(m.profileId));
  return (await db.bodyMetrics.add({
    ...m,
    profileUid,
    uid: m.uid ?? newUid(),
    updatedAt: now(),
    dirty: 1,
  })) as number;
}

/**
 * Import în masă de cântăriri (Freefit sau alt CSV de cântar) — sare peste
 * zilele deja înregistrate. Întoarce câte rânduri noi a adăugat.
 */
export async function importBodyMetrics(
  profileId: number,
  rows: { data: string; greutate: number }[],
): Promise<number> {
  const profileUid = await profileUidOf(profileId);
  const existente = await db.bodyMetrics.where({ profileId }).toArray();
  const zileExistente = new Set(existente.map((m) => m.data.slice(0, 10)));
  const noi = rows.filter((r) => !zileExistente.has(r.data.slice(0, 10)));
  await db.bodyMetrics.bulkAdd(
    noi.map((r) => ({
      profileId,
      profileUid,
      uid: newUid(),
      updatedAt: now(),
      dirty: 1 as const,
      data: r.data,
      greutate: r.greutate,
      sursa: 'freefit' as const,
    })),
  );
  return noi.length;
}

export async function latestMetric(profileId: number): Promise<BodyMetric | undefined> {
  return db.bodyMetrics.where('[profileId+data]').between([profileId, ''], [profileId, '￿']).last();
}

export async function metricsAsc(profileId: number): Promise<BodyMetric[]> {
  return db.bodyMetrics.where('[profileId+data]').between([profileId, ''], [profileId, '￿']).toArray();
}

// ── Obiective ───────────────────────────────────────────────────────

export async function setGoal(profileId: number, greutateTinta: number, ritmKgSaptamana: number) {
  const profileUid = await profileUidOf(profileId);
  await db.transaction('rw', db.goals, async () => {
    await db.goals.where({ profileId }).modify({ activ: false, updatedAt: now(), dirty: 1 });
    await db.goals.add({
      profileId,
      profileUid,
      uid: newUid(),
      updatedAt: now(),
      dirty: 1,
      greutateTinta,
      ritmKgSaptamana,
      activ: true,
      creatLa: now(),
    });
  });
}

export async function activeGoal(profileId: number): Promise<Goal | undefined> {
  return db.goals.where({ profileId }).filter((g) => g.activ).first();
}

// ── Șabloane ────────────────────────────────────────────────────────

export async function saveTemplate(t: Template): Promise<number> {
  t.modificatLa = now();
  t.updatedAt = now();
  t.dirty = 1;
  t.uid ??= newUid();
  t.profileUid ??= await profileUidOf(t.profileId);
  if (t.id) {
    await db.templates.put(t);
    return t.id;
  }
  t.creatLa = now();
  return (await db.templates.add(t)) as number;
}

export async function deleteTemplate(id: number) {
  const t = await db.templates.get(id);
  await db.transaction('rw', db.templates, db.deletions, async () => {
    await db.templates.delete(id);
    if (t?.uid) {
      await db.deletions.put({ uid: t.uid, tabel: 'templates', profileUid: t.profileUid, deletedAt: now(), dirty: 1 });
    }
  });
}

/** Șabloanele livrate cu aplicația, copiate în profilul proaspăt creat. */
export async function addStarterTemplates(profileId: number) {
  const profileUid = await profileUidOf(profileId);
  await db.templates.bulkAdd(
    starterTemplates(profileId).map((t) => ({
      ...t,
      profileUid,
      uid: newUid(),
      updatedAt: now(),
      dirty: 1 as const,
    })),
  );
}

/** Eticheta pusă pe șabloanele venite dintr-un program celebru. */
export function etichetaProgram(programId: string): string {
  return `program:${programId}`;
}

/**
 * Copiază toate antrenamentele unui program în șabloanele profilului.
 * Rulat din nou pe același program, înlocuiește copiile anterioare —
 * altfel lista s-ar umple de duplicate la fiecare apăsare.
 */
export async function importaProgram(profileId: number, p: ProgramDef): Promise<number> {
  const eticheta = etichetaProgram(p.id);
  const profileUid = await profileUidOf(profileId);
  return db.transaction('rw', db.templates, db.deletions, async () => {
    const vechi = await db.templates.where({ profileId }).filter((t) => t.etichete.includes(eticheta)).toArray();
    await db.templates.bulkDelete(vechi.map((t) => t.id!).filter(Boolean));
    await db.deletions.bulkPut(
      vechi
        .filter((t) => t.uid)
        .map((t) => ({ uid: t.uid!, tabel: 'templates', profileUid: t.profileUid, deletedAt: now(), dirty: 1 as const })),
    );
    await db.templates.bulkAdd(
      p.antrenamente.map((w) => ({
        profileId,
        profileUid,
        uid: newUid(),
        updatedAt: now(),
        dirty: 1 as const,
        nume: `${w.nume}`,
        descriere: w.descriere ?? p.subtitlu,
        etichete: [eticheta, ...p.etichete],
        items: w.items.map((i) => ({ ...i })),
        creatLa: now(),
        modificatLa: now(),
        predefinit: false,
      })),
    );
    return p.antrenamente.length;
  });
}

/** Șabloanele deja importate dintr-un program (ca să știm ce e adăugat). */
export async function templatesDinProgram(profileId: number, programId: string): Promise<Template[]> {
  const eticheta = etichetaProgram(programId);
  return db.templates.where({ profileId }).filter((t) => t.etichete.includes(eticheta)).toArray();
}

// ── Sesiuni ─────────────────────────────────────────────────────────

export async function createSession(s: Omit<Session, 'id'>): Promise<number> {
  const profileUid = s.profileUid ?? (await profileUidOf(s.profileId));
  const templateUid =
    s.templateUid ?? (s.templateId != null ? (await db.templates.get(s.templateId))?.uid : undefined);
  return (await db.sessions.add({
    ...s,
    profileUid,
    templateUid,
    uid: s.uid ?? newUid(),
    updatedAt: now(),
    dirty: 1,
  })) as number;
}

export async function updateSession(id: number, changes: Partial<Session>) {
  await db.sessions.update(id, { ...changes, updatedAt: now(), dirty: 1 });
}

export async function openSession(profileId: number): Promise<Session | undefined> {
  return db.sessions
    .where({ profileId })
    .filter((s) => s.status === 'activa' || s.status === 'pauza')
    .last();
}

export async function sessionsDesc(profileId: number, limit = 100): Promise<Session[]> {
  const all = await db.sessions
    .where('[profileId+inceput]')
    .between([profileId, ''], [profileId, '￿'])
    .toArray();
  return all.filter((s) => s.status === 'terminata').reverse().slice(0, limit);
}

// ── Jurnale de seturi și apă ────────────────────────────────────────

export async function addSetLog(l: Omit<SetLog, 'id'>): Promise<number> {
  const s = await db.sessions.get(l.sessionId);
  return (await db.setLogs.add({
    ...l,
    profileUid: l.profileUid ?? s?.profileUid,
    sessionUid: l.sessionUid ?? s?.uid,
    uid: l.uid ?? newUid(),
    updatedAt: now(),
    dirty: 1,
  })) as number;
}

export async function setLogsForSession(sessionId: number): Promise<SetLog[]> {
  return db.setLogs.where({ sessionId }).toArray();
}

export async function setLogsForExercise(profileId: number, exerciseId: string): Promise<SetLog[]> {
  return db.setLogs.where('[profileId+exerciseId]').equals([profileId, exerciseId]).toArray();
}

export async function allSetLogs(profileId: number): Promise<SetLog[]> {
  return db.setLogs.where('[profileId+data]').between([profileId, ''], [profileId, '￿']).toArray();
}

export async function addWater(l: Omit<WaterLog, 'id'>) {
  const s = await db.sessions.get(l.sessionId);
  await db.waterLogs.add({
    ...l,
    profileUid: l.profileUid ?? s?.profileUid,
    sessionUid: l.sessionUid ?? s?.uid,
    uid: l.uid ?? newUid(),
    updatedAt: now(),
    dirty: 1,
  });
  if (s) await db.sessions.update(l.sessionId, { apaMl: (s.apaMl ?? 0) + l.ml, updatedAt: now(), dirty: 1 });
}

// ── Realizări ───────────────────────────────────────────────────────

export async function unlockedAchievements(profileId: number): Promise<Set<string>> {
  const rows = await db.achievements.where({ profileId }).toArray();
  return new Set(rows.map((r) => r.achievementId));
}

export async function unlockAchievement(profileId: number, achievementId: string): Promise<boolean> {
  const exists = await db.achievements.where('[profileId+achievementId]').equals([profileId, achievementId]).count();
  if (exists) return false;
  const profileUid = await profileUidOf(profileId);
  await db.achievements.add({
    profileId,
    profileUid,
    uid: profileUid ? achievementUid(profileUid, achievementId) : newUid(),
    updatedAt: now(),
    dirty: 1,
    achievementId,
    data: now(),
  });
  return true;
}

// ── Setări ──────────────────────────────────────────────────────────

export async function getSettings(profileId: number): Promise<Settings> {
  const s = await db.settings.where({ profileId }).first();
  if (s) return s;
  const profileUid = await profileUidOf(profileId);
  const row: Settings = {
    ...SETARI_IMPLICITE,
    profileId,
    profileUid,
    uid: profileUid ? settingsUid(profileUid) : newUid(),
    updatedAt: now(),
    dirty: 1,
  };
  const id = await db.settings.add(row);
  return { ...row, id: id as number };
}

export async function updateSettings(profileId: number, changes: Partial<Settings>) {
  const s = await getSettings(profileId);
  await db.settings.update(s.id!, { ...changes, updatedAt: now(), dirty: 1 });
}
