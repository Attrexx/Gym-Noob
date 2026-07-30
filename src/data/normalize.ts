import type { Transaction } from 'dexie';
import { achievementUid, newUid, settingsUid } from './ids';
import type {
  AchievementUnlock,
  BodyMetric,
  Goal,
  Profile,
  Session,
  SetLog,
  Settings,
  SyncMeta,
  Template,
  WaterLog,
} from './types';

/**
 * Completează metadatele de sincronizare pe rândurile care nu le au:
 * `uid` (uuid, sau derivat la setări/realizări), oglinzile de chei străine
 * (`profileUid`, `sessionUid`, `templateUid`), `updatedAt` (din cel mai bun
 * timestamp de domeniu existent) și `dirty = 1` peste tot.
 *
 * Folosită în două locuri, cu aceeași logică:
 *  - upgrade-ul Dexie v1 → v2 (rulează o singură dată per dispozitiv);
 *  - importul unui backup (fișierele v1 nu au uid-uri; la v2 doar remarcăm
 *    totul ca dirty — uid-urile existente se păstrează prin `??=`).
 *
 * Ordinea contează: părinții întâi (profiluri → șabloane → sesiuni), ca să
 * avem hărțile id → uid gata când stampilăm copiii.
 */
export async function normalizeazaBaza(tx: Transaction, acum = new Date().toISOString()): Promise<void> {
  const stamp = (r: SyncMeta, updatedAt?: string) => {
    r.uid ??= newUid();
    r.updatedAt ??= updatedAt ?? acum;
    r.dirty = 1;
  };

  // 1. Profiluri — toate celelalte tabele au nevoie de uid-urile lor.
  const profiles = (await tx.table('profiles').toArray()) as Profile[];
  const pUid = new Map<number, string>();
  for (const p of profiles) {
    stamp(p, p.folositLa ?? p.creatLa);
    pUid.set(p.id!, p.uid!);
  }
  await tx.table('profiles').bulkPut(profiles);

  // 2. Șabloane, apoi sesiuni (sesiunile pot referi un șablon).
  const templates = (await tx.table('templates').toArray()) as Template[];
  const tUid = new Map<number, string>();
  for (const t of templates) {
    stamp(t, t.modificatLa ?? t.creatLa);
    t.profileUid ??= pUid.get(t.profileId);
    tUid.set(t.id!, t.uid!);
  }
  await tx.table('templates').bulkPut(templates);

  const sessions = (await tx.table('sessions').toArray()) as Session[];
  const sUid = new Map<number, string>();
  for (const s of sessions) {
    stamp(s, s.sfarsit ?? s.inceput);
    s.profileUid ??= pUid.get(s.profileId);
    if (s.templateId != null) s.templateUid ??= tUid.get(s.templateId);
    sUid.set(s.id!, s.uid!);
  }
  await tx.table('sessions').bulkPut(sessions);

  // 3. Copiii cu uid aleatoriu.
  const bodyMetrics = (await tx.table('bodyMetrics').toArray()) as BodyMetric[];
  for (const m of bodyMetrics) {
    stamp(m, m.data);
    m.profileUid ??= pUid.get(m.profileId);
  }
  await tx.table('bodyMetrics').bulkPut(bodyMetrics);

  const goals = (await tx.table('goals').toArray()) as Goal[];
  for (const g of goals) {
    stamp(g, g.atinsLa ?? g.creatLa);
    g.profileUid ??= pUid.get(g.profileId);
  }
  await tx.table('goals').bulkPut(goals);

  const setLogs = (await tx.table('setLogs').toArray()) as SetLog[];
  for (const l of setLogs) {
    stamp(l, l.data);
    l.profileUid ??= pUid.get(l.profileId);
    l.sessionUid ??= sUid.get(l.sessionId);
  }
  await tx.table('setLogs').bulkPut(setLogs);

  const waterLogs = (await tx.table('waterLogs').toArray()) as WaterLog[];
  for (const w of waterLogs) {
    stamp(w, w.data);
    w.profileUid ??= pUid.get(w.profileId);
    w.sessionUid ??= sUid.get(w.sessionId);
  }
  await tx.table('waterLogs').bulkPut(waterLogs);

  // 4. Copiii cu uid DERIVAT — același uid pe orice dispozitiv (v. ids.ts).
  const achievements = (await tx.table('achievements').toArray()) as AchievementUnlock[];
  for (const a of achievements) {
    a.profileUid ??= pUid.get(a.profileId);
    a.uid ??= a.profileUid ? achievementUid(a.profileUid, a.achievementId) : newUid();
    a.updatedAt ??= a.data ?? acum;
    a.dirty = 1;
  }
  await tx.table('achievements').bulkPut(achievements);

  const settings = (await tx.table('settings').toArray()) as Settings[];
  for (const s of settings) {
    s.profileUid ??= pUid.get(s.profileId);
    s.uid ??= s.profileUid ? settingsUid(s.profileUid) : newUid();
    s.updatedAt ??= acum;
    s.dirty = 1;
  }
  await tx.table('settings').bulkPut(settings);
}
