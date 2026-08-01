import type { AchievementDef, Session } from '@/data/types';

/**
 * Realizările („insignele") aplicației. Evaluarea primește un context
 * agregat și returnează id-urile îndeplinite — stratul UI decide ce e
 * nou deblocat și sărbătorește.
 */
export interface AchievementContext {
  sesiuniTerminate: number;
  /** zile distincte cu antrenament, ordonate crescător, format 'yyyy-MM-dd' */
  zileAntrenament: string[];
  streakSaptamani: number;
  volumTotalKg: number;
  kcalTotal: number;
  apaTotalMl: number;
  prCount: number;
  kgSlabite: number;
  sesiuniCuApaLaTinta: number;
  exercitiiDistincte: number;
  oreLaSala: number;
}

/**
 * Numele și descrierile (adică glumele) stau în mesaje, la
 * `realizari.<id>.nume` / `realizari.<id>.descriere`. Aici rămân doar id-ul,
 * emoji-ul, categoria și condiția — adică partea care nu depinde de limbă.
 */
export const ACHIEVEMENTS = [
  // ── Început ──
  { id: 'prima-sesiune', emoji: '🐣', categorie: 'inceput', conditie: (c: AchievementContext) => c.sesiuniTerminate >= 1 },
  { id: 'trei-sesiuni', emoji: '🌱', categorie: 'inceput', conditie: (c: AchievementContext) => c.sesiuniTerminate >= 3 },
  { id: 'zece-sesiuni', emoji: '💳', categorie: 'inceput', conditie: (c: AchievementContext) => c.sesiuniTerminate >= 10 },
  { id: 'douazecicinci-sesiuni', emoji: '🏋️', categorie: 'inceput', conditie: (c: AchievementContext) => c.sesiuniTerminate >= 25 },
  { id: 'cincizeci-sesiuni', emoji: '🎖️', categorie: 'inceput', conditie: (c: AchievementContext) => c.sesiuniTerminate >= 50 },
  { id: 'o-suta-sesiuni', emoji: '🏛️', categorie: 'inceput', conditie: (c: AchievementContext) => c.sesiuniTerminate >= 100 },

  // ── Consecvență ──
  { id: 'streak-2', emoji: '🔥', categorie: 'consecventa', conditie: (c: AchievementContext) => c.streakSaptamani >= 2 },
  { id: 'streak-4', emoji: '🔥🔥', categorie: 'consecventa', conditie: (c: AchievementContext) => c.streakSaptamani >= 4 },
  { id: 'streak-12', emoji: '⚙️', categorie: 'consecventa', conditie: (c: AchievementContext) => c.streakSaptamani >= 12 },
  { id: 'zile-30', emoji: '📅', categorie: 'consecventa', conditie: (c: AchievementContext) => c.zileAntrenament.length >= 30 },
  { id: 'ore-24', emoji: '⏰', categorie: 'consecventa', conditie: (c: AchievementContext) => c.oreLaSala >= 24 },

  // ── Volum ──
  { id: 'volum-1t', emoji: '🚗', categorie: 'volum', conditie: (c: AchievementContext) => c.volumTotalKg >= 1_000 },
  { id: 'volum-10t', emoji: '🚚', categorie: 'volum', conditie: (c: AchievementContext) => c.volumTotalKg >= 10_000 },
  { id: 'volum-100t', emoji: '🚂', categorie: 'volum', conditie: (c: AchievementContext) => c.volumTotalKg >= 100_000 },
  { id: 'kcal-1000', emoji: '🕯️', categorie: 'volum', conditie: (c: AchievementContext) => c.kcalTotal >= 1_000 },
  { id: 'kcal-10000', emoji: '🌋', categorie: 'volum', conditie: (c: AchievementContext) => c.kcalTotal >= 10_000 },
  { id: 'explorator', emoji: '🧭', categorie: 'volum', conditie: (c: AchievementContext) => c.exercitiiDistincte >= 15 },

  // ── Greutate corporală ──
  { id: 'slabit-1', emoji: '📉', categorie: 'greutate', conditie: (c: AchievementContext) => c.kgSlabite >= 1 },
  { id: 'slabit-5', emoji: '🎯', categorie: 'greutate', conditie: (c: AchievementContext) => c.kgSlabite >= 5 },
  { id: 'slabit-10', emoji: '👕', categorie: 'greutate', conditie: (c: AchievementContext) => c.kgSlabite >= 10 },

  // ── Hidratare ──
  { id: 'apa-prima', emoji: '💧', categorie: 'hidratare', conditie: (c: AchievementContext) => c.sesiuniCuApaLaTinta >= 1 },
  { id: 'apa-10', emoji: '⛲', categorie: 'hidratare', conditie: (c: AchievementContext) => c.sesiuniCuApaLaTinta >= 10 },
  { id: 'apa-total', emoji: '🌊', categorie: 'hidratare', conditie: (c: AchievementContext) => c.apaTotalMl >= 20_000 },

  // ── Recorduri ──
  { id: 'pr-primul', emoji: '🥇', categorie: 'recorduri', conditie: (c: AchievementContext) => c.prCount >= 1 },
  { id: 'pr-10', emoji: '🏹', categorie: 'recorduri', conditie: (c: AchievementContext) => c.prCount >= 10 },
  { id: 'pr-25', emoji: '🤖', categorie: 'recorduri', conditie: (c: AchievementContext) => c.prCount >= 25 },
] as const satisfies readonly (AchievementDef & { conditie: (c: AchievementContext) => boolean })[];

/** Id-urile realizărilor, ca uniune — testul de paritate se plimbă pe ele. */
export type AchievementId = (typeof ACHIEVEMENTS)[number]['id'];

export function evaluateAchievements(ctx: AchievementContext): string[] {
  return ACHIEVEMENTS.filter((a) => a.conditie(ctx)).map((a) => a.id);
}

/**
 * Streak-ul în săptămâni: numărul de săptămâni calendaristice
 * consecutive (terminând cu săptămâna curentă sau cea trecută)
 * în care există cel puțin un antrenament.
 */
export function weeklyStreak(zileAntrenament: string[], azi = new Date()): number {
  if (zileAntrenament.length === 0) return 0;
  const weeks = new Set(zileAntrenament.map((z) => weekKey(new Date(z + 'T12:00:00'))));
  let streak = 0;
  const cursor = new Date(azi);
  // săptămâna curentă poate fi în desfășurare — dacă nu are antrenament, pornim de la cea trecută
  if (!weeks.has(weekKey(cursor))) cursor.setDate(cursor.getDate() - 7);
  while (weeks.has(weekKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 7);
  }
  return streak;
}

/** Cheia săptămânii ISO (luni ca prima zi). */
export function weekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-S${String(week).padStart(2, '0')}`;
}

/** Zile distincte de antrenament din sesiuni terminate. */
export function trainingDays(sesiuni: Session[]): string[] {
  const days = new Set(sesiuni.filter((s) => s.status === 'terminata').map((s) => s.inceput.slice(0, 10)));
  return [...days].sort();
}
