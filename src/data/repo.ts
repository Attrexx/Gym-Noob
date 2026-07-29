import { db } from './db';
import {
  SETARI_IMPLICITE,
  type BodyMetric,
  type Goal,
  type Profile,
  type Session,
  type SetLog,
  type Settings,
  type Template,
  type WaterLog,
} from './types';

const now = () => new Date().toISOString();

// ── Profiluri ───────────────────────────────────────────────────────

export async function createProfile(
  p: Omit<Profile, 'id' | 'creatLa' | 'folositLa'>,
  greutateInitiala: number,
  masuri?: { talie?: number; gat?: number; sold?: number },
): Promise<number> {
  const id = (await db.profiles.add({ ...p, creatLa: now(), folositLa: now() })) as number;
  await db.bodyMetrics.add({
    profileId: id,
    data: now(),
    greutate: greutateInitiala,
    ...masuri,
    sursa: 'manual',
  });
  await db.settings.add({ ...SETARI_IMPLICITE, profileId: id });
  return id;
}

export async function touchProfile(id: number) {
  await db.profiles.update(id, { folositLa: now() });
}

export async function lastUsedProfile(): Promise<Profile | undefined> {
  return (await db.profiles.orderBy('folositLa').reverse().first()) ?? undefined;
}

// ── Metrici corporale / greutate ───────────────────────────────────

export async function addBodyMetric(m: Omit<BodyMetric, 'id'>): Promise<number> {
  return (await db.bodyMetrics.add(m)) as number;
}

export async function latestMetric(profileId: number): Promise<BodyMetric | undefined> {
  return db.bodyMetrics.where('[profileId+data]').between([profileId, ''], [profileId, '￿']).last();
}

export async function metricsAsc(profileId: number): Promise<BodyMetric[]> {
  return db.bodyMetrics.where('[profileId+data]').between([profileId, ''], [profileId, '￿']).toArray();
}

// ── Obiective ───────────────────────────────────────────────────────

export async function setGoal(profileId: number, greutateTinta: number, ritmKgSaptamana: number) {
  await db.transaction('rw', db.goals, async () => {
    await db.goals.where({ profileId }).modify({ activ: false });
    await db.goals.add({ profileId, greutateTinta, ritmKgSaptamana, activ: true, creatLa: now() });
  });
}

export async function activeGoal(profileId: number): Promise<Goal | undefined> {
  return db.goals.where({ profileId }).filter((g) => g.activ).first();
}

// ── Șabloane ────────────────────────────────────────────────────────

export async function saveTemplate(t: Template): Promise<number> {
  t.modificatLa = now();
  if (t.id) {
    await db.templates.put(t);
    return t.id;
  }
  t.creatLa = now();
  return (await db.templates.add(t)) as number;
}

export async function deleteTemplate(id: number) {
  await db.templates.delete(id);
}

// ── Sesiuni ─────────────────────────────────────────────────────────

export async function createSession(s: Omit<Session, 'id'>): Promise<number> {
  return (await db.sessions.add(s)) as number;
}

export async function updateSession(id: number, changes: Partial<Session>) {
  await db.sessions.update(id, changes);
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
  return (await db.setLogs.add(l)) as number;
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
  await db.waterLogs.add(l);
  const s = await db.sessions.get(l.sessionId);
  if (s) await db.sessions.update(l.sessionId, { apaMl: (s.apaMl ?? 0) + l.ml });
}

// ── Realizări ───────────────────────────────────────────────────────

export async function unlockedAchievements(profileId: number): Promise<Set<string>> {
  const rows = await db.achievements.where({ profileId }).toArray();
  return new Set(rows.map((r) => r.achievementId));
}

export async function unlockAchievement(profileId: number, achievementId: string): Promise<boolean> {
  const exists = await db.achievements.where('[profileId+achievementId]').equals([profileId, achievementId]).count();
  if (exists) return false;
  await db.achievements.add({ profileId, achievementId, data: now() });
  return true;
}

// ── Setări ──────────────────────────────────────────────────────────

export async function getSettings(profileId: number): Promise<Settings> {
  const s = await db.settings.where({ profileId }).first();
  if (s) return s;
  const id = await db.settings.add({ ...SETARI_IMPLICITE, profileId });
  return { ...SETARI_IMPLICITE, profileId, id: id as number };
}

export async function updateSettings(profileId: number, changes: Partial<Settings>) {
  const s = await getSettings(profileId);
  await db.settings.update(s.id!, changes);
}
