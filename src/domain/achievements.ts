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

export const ACHIEVEMENTS: (AchievementDef & { conditie: (c: AchievementContext) => boolean })[] = [
  // ── Început ──
  { id: 'prima-sesiune', nume: 'Primul pas', descriere: 'Ai terminat prima sesiune de antrenament. De aici începe totul!', emoji: '🐣', categorie: 'inceput', conditie: (c) => c.sesiuniTerminate >= 1 },
  { id: 'trei-sesiuni', nume: 'Nu a fost un accident', descriere: '3 sesiuni terminate. Începe să semene a obicei.', emoji: '🌱', categorie: 'inceput', conditie: (c) => c.sesiuniTerminate >= 3 },
  { id: 'zece-sesiuni', nume: 'Abonat serios', descriere: '10 sesiuni terminate. Recepția te salută deja.', emoji: '💳', categorie: 'inceput', conditie: (c) => c.sesiuniTerminate >= 10 },
  { id: 'douazecicinci-sesiuni', nume: 'Mobilier al sălii', descriere: '25 de sesiuni. Faci parte din peisaj.', emoji: '🏋️', categorie: 'inceput', conditie: (c) => c.sesiuniTerminate >= 25 },
  { id: 'cincizeci-sesiuni', nume: 'Jumătate de sută', descriere: '50 de sesiuni terminate. Cine mai e noob acum?', emoji: '🎖️', categorie: 'inceput', conditie: (c) => c.sesiuniTerminate >= 50 },
  { id: 'o-suta-sesiuni', nume: 'Centurion', descriere: '100 de sesiuni. Legendă locală.', emoji: '🏛️', categorie: 'inceput', conditie: (c) => c.sesiuniTerminate >= 100 },

  // ── Consecvență ──
  { id: 'streak-2', nume: 'Două la rând', descriere: '2 săptămâni consecutive cu antrenamente.', emoji: '🔥', categorie: 'consecventa', conditie: (c) => c.streakSaptamani >= 2 },
  { id: 'streak-4', nume: 'Luna de foc', descriere: '4 săptămâni consecutive cu antrenamente.', emoji: '🔥🔥', categorie: 'consecventa', conditie: (c) => c.streakSaptamani >= 4 },
  { id: 'streak-12', nume: 'Trimestrul de oțel', descriere: '12 săptămâni consecutive. Disciplina bate motivația.', emoji: '⚙️', categorie: 'consecventa', conditie: (c) => c.streakSaptamani >= 12 },
  { id: 'zile-30', nume: '30 de zile la sală', descriere: '30 de zile distincte cu antrenament.', emoji: '📅', categorie: 'consecventa', conditie: (c) => c.zileAntrenament.length >= 30 },
  { id: 'ore-24', nume: 'O zi din viață', descriere: '24 de ore cumulate de antrenament activ.', emoji: '⏰', categorie: 'consecventa', conditie: (c) => c.oreLaSala >= 24 },

  // ── Volum ──
  { id: 'volum-1t', nume: 'Prima tonă', descriere: 'Ai ridicat în total 1.000 kg. O tonă întreagă!', emoji: '🚗', categorie: 'volum', conditie: (c) => c.volumTotalKg >= 1_000 },
  { id: 'volum-10t', nume: 'Camionagiu', descriere: '10 tone ridicate în total. Cam cât un camion.', emoji: '🚚', categorie: 'volum', conditie: (c) => c.volumTotalKg >= 10_000 },
  { id: 'volum-100t', nume: 'Locomotiva', descriere: '100 de tone ridicate în total. Șșș-șșș.', emoji: '🚂', categorie: 'volum', conditie: (c) => c.volumTotalKg >= 100_000 },
  { id: 'kcal-1000', nume: 'Cuptor pornit', descriere: '1.000 kcal arse la antrenamente.', emoji: '🕯️', categorie: 'volum', conditie: (c) => c.kcalTotal >= 1_000 },
  { id: 'kcal-10000', nume: 'Furnal', descriere: '10.000 kcal arse la antrenamente.', emoji: '🌋', categorie: 'volum', conditie: (c) => c.kcalTotal >= 10_000 },
  { id: 'explorator', nume: 'Explorator', descriere: 'Ai încercat 15 exerciții diferite.', emoji: '🧭', categorie: 'volum', conditie: (c) => c.exercitiiDistincte >= 15 },

  // ── Greutate corporală ──
  { id: 'slabit-1', nume: 'Primul kilogram', descriere: 'Primul kilogram dat jos. S-a urnit trenul!', emoji: '📉', categorie: 'greutate', conditie: (c) => c.kgSlabite >= 1 },
  { id: 'slabit-5', nume: 'Minus 5', descriere: '5 kg date jos. Se vede deja.', emoji: '🎯', categorie: 'greutate', conditie: (c) => c.kgSlabite >= 5 },
  { id: 'slabit-10', nume: 'Minus 10', descriere: '10 kg date jos. Garderobă nouă?', emoji: '👕', categorie: 'greutate', conditie: (c) => c.kgSlabite >= 10 },

  // ── Hidratare ──
  { id: 'apa-prima', nume: 'Buretele', descriere: 'Prima sesiune cu ținta de apă atinsă.', emoji: '💧', categorie: 'hidratare', conditie: (c) => c.sesiuniCuApaLaTinta >= 1 },
  { id: 'apa-10', nume: 'Fântâna arteziană', descriere: '10 sesiuni cu ținta de apă atinsă.', emoji: '⛲', categorie: 'hidratare', conditie: (c) => c.sesiuniCuApaLaTinta >= 10 },
  { id: 'apa-total', nume: 'Lacul Vidraru', descriere: '20 de litri de apă băuți la sală, în total.', emoji: '🌊', categorie: 'hidratare', conditie: (c) => c.apaTotalMl >= 20_000 },

  // ── Recorduri ──
  { id: 'pr-primul', nume: 'Recordman', descriere: 'Primul record personal doborât.', emoji: '🥇', categorie: 'recorduri', conditie: (c) => c.prCount >= 1 },
  { id: 'pr-10', nume: 'Vânător de recorduri', descriere: '10 recorduri personale doborâte.', emoji: '🏹', categorie: 'recorduri', conditie: (c) => c.prCount >= 10 },
  { id: 'pr-25', nume: 'Mașina de PR-uri', descriere: '25 de recorduri personale doborâte.', emoji: '🤖', categorie: 'recorduri', conditie: (c) => c.prCount >= 25 },
];

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
