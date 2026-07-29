import { db } from '@/data/db';
import type { Profile } from '@/data/types';
import {
  evaluateAchievements,
  trainingDays,
  weeklyStreak,
  type AchievementContext,
} from '@/domain/achievements';
import { unlockAchievement, unlockedAchievements } from '@/data/repo';
import { epley1Rm } from '@/domain/oneRm';

/** Construiește contextul agregat pentru evaluarea realizărilor. */
export async function computeContext(profil: Profile): Promise<AchievementContext> {
  const profileId = profil.id!;
  const [sesiuni, seturi, ape, metrici] = await Promise.all([
    db.sessions.where({ profileId }).toArray(),
    db.setLogs.where({ profileId }).toArray(),
    db.waterLogs.where({ profileId }).toArray(),
    db.bodyMetrics.where({ profileId }).toArray(),
  ]);
  const terminate = sesiuni.filter((s) => s.status === 'terminata');
  const zile = trainingDays(terminate);

  const volumTotalKg = seturi.reduce((a, l) => a + (l.greutate ?? 0) * (l.repetari ?? 0), 0);
  const kcalTotal = terminate.reduce((a, s) => a + (s.kcal ?? 0), 0);
  const apaTotalMl = ape.reduce((a, w) => a + w.ml, 0);

  const greutati = metrici.map((m) => m.greutate);
  const kgSlabite = greutati.length ? Math.max(0, Math.max(...greutati) - greutati[greutati.length - 1]) : 0;

  const sesiuniCuApaLaTinta = terminate.filter((s) => (s.apaMl ?? 0) >= profil.tintaApaSesiune).length;
  const oreLaSala = terminate.reduce((a, s) => a + s.durataActivaSec, 0) / 3600;

  return {
    sesiuniTerminate: terminate.length,
    zileAntrenament: zile,
    streakSaptamani: weeklyStreak(zile),
    volumTotalKg,
    kcalTotal,
    apaTotalMl,
    prCount: numaraPrs(seturi),
    kgSlabite,
    sesiuniCuApaLaTinta,
    exercitiiDistincte: new Set(seturi.map((l) => l.exerciseId)).size,
    oreLaSala,
  };
}

/**
 * Numărul total de PR-uri: rejucăm istoricul cronologic per exercițiu
 * și numărăm îmbunătățirile stricte pe fiecare metrică. Determinist,
 * fără să stocăm contoare separate.
 */
export function numaraPrs(seturi: { exerciseId: string; data: string; greutate?: number; repetari?: number }[]): number {
  const perEx = new Map<string, typeof seturi>();
  for (const l of seturi) {
    if (!perEx.has(l.exerciseId)) perEx.set(l.exerciseId, []);
    perEx.get(l.exerciseId)!.push(l);
  }
  let count = 0;
  for (const list of perEx.values()) {
    list.sort((a, b) => a.data.localeCompare(b.data));
    const best = { g: 0, r: 0, v: 0, rm: 0 };
    let primul = true;
    for (const l of list) {
      const g = l.greutate ?? 0;
      const r = l.repetari ?? 0;
      const v = g * r;
      const rm = epley1Rm(g, r);
      if (!primul) {
        if (g > best.g && best.g > 0) count++;
        if (r > best.r && best.r > 0) count++;
        if (v > best.v && best.v > 0) count++;
        if (rm > best.rm && best.rm > 0) count++;
      }
      best.g = Math.max(best.g, g);
      best.r = Math.max(best.r, r);
      best.v = Math.max(best.v, v);
      best.rm = Math.max(best.rm, rm);
      primul = false;
    }
  }
  return count;
}

/** Evaluează și deblochează ce e nou. Returnează id-urile proaspăt deblocate. */
export async function verificaRealizari(profil: Profile): Promise<string[]> {
  const ctx = await computeContext(profil);
  const indeplinite = evaluateAchievements(ctx);
  const deja = await unlockedAchievements(profil.id!);
  const noi: string[] = [];
  for (const id of indeplinite) {
    if (!deja.has(id)) {
      const ok = await unlockAchievement(profil.id!, id);
      if (ok) noi.push(id);
    }
  }
  return noi;
}
