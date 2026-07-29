import type { Sex } from '@/data/types';

/**
 * Estimarea caloriilor arse.
 *
 * Baza: formula MET — kcal = MET × 3.5 × kg / 200 × minute.
 * MET-ul fiecărui exercițiu vine din catalog (valori din
 * Compendium of Physical Activities).
 *
 * Ajustare după efortul perceput (RPE 1-10): MET-ul din catalog
 * corespunde unui efort moderat (RPE ~6). Sub/peste, scalăm liniar
 * cu ±6% pe punct RPE, limitat la [0.7, 1.3].
 */
export function kcalMet(met: number, greutateKg: number, secunde: number, rpe?: number): number {
  const minute = secunde / 60;
  const factor = rpe ? Math.min(1.3, Math.max(0.7, 1 + (rpe - 6) * 0.06)) : 1;
  return (met * factor * 3.5 * greutateKg * minute) / 200;
}

/**
 * Un set de forță nu înseamnă doar secundele sub tensiune — corpul
 * lucrează și în jur. Estimăm durata efectivă a unui set din repetări
 * (~3 s/rep la tempo normal, sau tempo-ul explicit) + 15 s overhead.
 */
export function durataSetSec(repetari: number, tempo?: string): number {
  let secPerRep = 3;
  if (tempo) {
    const parts = tempo.split('-').map(Number).filter((n) => !Number.isNaN(n));
    if (parts.length >= 2) secPerRep = parts.reduce((a, b) => a + b, 0);
  }
  return repetari * secPerRep + 15;
}

/**
 * MET pentru banda de alergare din viteză + înclinație — ecuațiile
 * metabolice ACSM. Mult mai precis decât un MET fix, pentru că userul
 * schimbă des setările pe bandă.
 *  - mers  (< 8 km/h):  VO2 = 0,1·S + 1,8·S·G + 3,5
 *  - alergare (≥ 8):    VO2 = 0,2·S + 0,9·S·G + 3,5
 * unde S = viteza în m/min, G = panta (fracție). MET = VO2 / 3,5.
 */
export function metBanda(vitezaKmh: number, inclinatieProcent: number): number {
  const S = (Math.max(0, vitezaKmh) * 1000) / 60;
  const G = Math.max(0, inclinatieProcent) / 100;
  const vo2 = vitezaKmh >= 8 ? 0.2 * S + 0.9 * S * G + 3.5 : 0.1 * S + 1.8 * S * G + 3.5;
  return Math.max(1, Math.round((vo2 / 3.5) * 100) / 100);
}

/** Media ponderată a MET-ului pe segmente (schimbări de viteză/înclinație). */
export interface SegmentBanda {
  /** secunda din cronometru la care a intrat în vigoare setarea */
  startSec: number;
  viteza: number;
  inclinatie: number;
}

export function metMediuBanda(segmente: SegmentBanda[], totalSec: number): number {
  if (segmente.length === 0 || totalSec <= 0) return metBanda(5, 0);
  let suma = 0;
  for (let i = 0; i < segmente.length; i++) {
    const start = Math.min(segmente[i].startSec, totalSec);
    const end = i + 1 < segmente.length ? Math.min(segmente[i + 1].startSec, totalSec) : totalSec;
    if (end > start) suma += metBanda(segmente[i].viteza, segmente[i].inclinatie) * (end - start);
  }
  return Math.round((suma / totalSec) * 100) / 100;
}

/**
 * Formula Keytel — kcal/min din puls, mai precisă decât MET când avem
 * date de la ceas. Valabilă pentru efort aerob (puls 90-150+).
 */
export function kcalKeytel(
  sex: Sex,
  pulsMediu: number,
  greutateKg: number,
  varstaAni: number,
  secunde: number,
): number {
  const min = secunde / 60;
  const perMin =
    sex === 'M'
      ? (-55.0969 + 0.6309 * pulsMediu + 0.1988 * greutateKg + 0.2017 * varstaAni) / 4.184
      : (-20.4022 + 0.4472 * pulsMediu - 0.1263 * greutateKg + 0.074 * varstaAni) / 4.184;
  return Math.max(0, perMin) * min;
}

/**
 * Estimarea finală pentru un set/interval: dacă avem puls de la ceas
 * folosim Keytel, altfel MET ajustat cu RPE.
 */
export function kcalSet(params: {
  met: number;
  greutateKg: number;
  secunde: number;
  rpe?: number;
  sex?: Sex;
  varsta?: number;
  pulsMediu?: number;
}): number {
  const { met, greutateKg, secunde, rpe, sex, varsta, pulsMediu } = params;
  if (pulsMediu && pulsMediu >= 90 && sex && varsta) {
    return kcalKeytel(sex, pulsMediu, greutateKg, varsta, secunde);
  }
  return kcalMet(met, greutateKg, secunde, rpe);
}
