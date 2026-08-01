import type { SetLog, TipAparat } from '@/data/types';
import type { DateAparat } from '@/domain/ftms';
import { fmtPas } from '@/domain/ftms';
import type { AchievementId } from '@/domain/achievements';
import type { MotivSugestie } from '@/domain/suggestions';
import { numeGrupa } from '@/data/catalog/exercises';
import { km, nr } from './format';
import { t } from './runtime';

/**
 * Rezumatele de o linie — mutate aici din `src/domain/`.
 *
 * Motivul mutării: `src/domain/` e matematică pură, testată unitar, fără
 * dependențe (vezi CLAUDE.md). Funcțiile astea două nu calculau nimic — doar
 * lipeau text. Acum stau lângă `t()` și `nr()`, unde le e locul, iar
 * `domain/` a rămas curat.
 *
 * Simbolurile SI (kg, km, m, W, %, min) rămân literale: sunt identice în orice
 * limbă metrică. Prin mesaje trec doar prescurtările care chiar sunt cuvinte
 * („rep." → „reps", „maxim" → „max").
 */

/**
 * Rezumatul unui set, pentru banda „data trecută".
 * Pentru cardio spunem minutele și setările; pentru forță, kg × repetări.
 */
export function descrieSetLog(l: SetLog): string {
  const p: string[] = [];
  if (l.repetari !== undefined) p.push(t('descriere.repetari', { n: l.repetari }));
  else if (l.durataSec === undefined) p.push(t('descriere.maxim'));
  if (l.greutate !== undefined && l.greutate > 0) p.push(`${nr(l.greutate)} kg`);
  if (l.durataSec !== undefined && l.repetari === undefined) p.push(`${Math.round(l.durataSec / 60)} min`);
  if (l.viteza !== undefined) p.push(`${nr(l.viteza)} km/h`);
  if (l.inclinatie !== undefined && l.inclinatie > 0) p.push(`${nr(l.inclinatie)}%`);
  if (l.distantaM !== undefined) p.push(km(l.distantaM));
  if (l.putereMedieW !== undefined) p.push(`${Math.round(l.putereMedieW)} W`);
  if (l.cadentaMedie !== undefined) p.push(`${Math.round(l.cadentaMedie)} spm`);
  if (l.rpe !== undefined) p.push(`RPE ${l.rpe}`);
  return p.join(' · ');
}

/** Rândul de telemetrie din antet: „9,5 km/h · 2% · 1,25 km". */
export function descrieAparat(tip: TipAparat, d: DateAparat): string {
  const p: string[] = [];
  // viteza de pe aparat are mereu o zecimală („10,0"), spre deosebire de cea
  // dintr-un set salvat, care e deja rotunjită
  if (d.vitezaKmh !== undefined) p.push(`${nr(d.vitezaKmh, 1)} km/h`);
  if (d.pasSec !== undefined && d.pasSec > 0) p.push(fmtPas(d.pasSec));
  if (d.inclinatieProcent !== undefined) p.push(`${nr(d.inclinatieProcent)}%`);
  if (d.cadenta !== undefined) p.push(`${Math.round(d.cadenta)} ${tip === 'bicicleta' ? 'rpm' : 'spm'}`);
  if (d.putereW !== undefined && d.putereW > 0) p.push(`${Math.round(d.putereW)} W`);
  if (d.distantaM !== undefined) p.push(km(d.distantaM));
  return p.join(' · ');
}

/**
 * De ce propune Flexu exercițiul. Motorul de sugestii dă un motiv structurat;
 * aici îl facem propoziție, cu numele tradus al grupei musculare.
 */
export function descrieMotiv(m: MotivSugestie): string {
  switch (m.tip) {
    case 'antagonist':
      return t('sugestii.antagonist', {
        seturi: m.seturi,
        grupa: numeGrupa(m.grupa),
        anti: numeGrupa(m.anti),
      });
    case 'neatins':
      return t('sugestii.neatins', { grupa: numeGrupa(m.grupa) });
    default:
      return t(`sugestii.${m.tip}`);
  }
}

/** Numele și descrierea unei realizări — singurul loc cu cheia compusă. */
export const numeRealizare = (id: AchievementId): string => t(`realizari.${id}.nume`);
export const descriereRealizare = (id: AchievementId): string => t(`realizari.${id}.descriere`);
