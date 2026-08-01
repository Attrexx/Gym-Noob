import type { ActivityLevel, Sex } from '@/data/types';

/** 1 kg de grăsime ≈ 7700 kcal */
export const KCAL_PER_KG = 7700;

export const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentar: 1.2,
  usor: 1.375,
  moderat: 1.55,
  activ: 1.725,
  foarte_activ: 1.9,
};

/**
 * Nivelurile, în ordinea de afișat. Etichetele sunt mesaje
 * (`t(`domeniu.activitate.${nivel}`)`) — aici păstrăm doar ordinea și factorii.
 */
export const NIVELURI: ActivityLevel[] = ['sedentar', 'usor', 'moderat', 'activ', 'foarte_activ'];

export function varstaDinData(dataNasterii: string, azi = new Date()): number {
  const n = new Date(dataNasterii);
  let v = azi.getFullYear() - n.getFullYear();
  const m = azi.getMonth() - n.getMonth();
  if (m < 0 || (m === 0 && azi.getDate() < n.getDate())) v--;
  return v;
}

/** Rata metabolică bazală — formula Mifflin-St Jeor (kcal/zi). */
export function bmr(sex: Sex, greutateKg: number, inaltimeCm: number, varstaAni: number): number {
  const base = 10 * greutateKg + 6.25 * inaltimeCm - 5 * varstaAni;
  return Math.round(sex === 'M' ? base + 5 : base - 161);
}

/** Consum energetic zilnic total, fără antrenamentele din aplicație. */
export function tdee(bmrKcal: number, activitate: ActivityLevel): number {
  return Math.round(bmrKcal * ACTIVITY_FACTOR[activitate]);
}

export function bmi(greutateKg: number, inaltimeCm: number): number {
  const m = inaltimeCm / 100;
  return Math.round((greutateKg / (m * m)) * 10) / 10;
}

export type CategorieImc =
  | 'subponderal'
  | 'normal'
  | 'supraponderal'
  | 'obezitate1'
  | 'obezitate2'
  | 'obezitate3';

/** Clasificarea OMS. Întoarce un id — textul îl pune interfața, prin `t()`. */
export function bmiCategorie(v: number): CategorieImc {
  if (v < 18.5) return 'subponderal';
  if (v < 25) return 'normal';
  if (v < 30) return 'supraponderal';
  if (v < 35) return 'obezitate1';
  if (v < 40) return 'obezitate2';
  return 'obezitate3';
}

/**
 * Ritm sănătos de slăbire: max 1 kg/săpt. și nu mai jos decât
 * ~80% din BMR ca aport zilnic. Returnează ritmul ajustat (kg/săpt.).
 */
export function clampRitm(ritmKgSaptamana: number): number {
  return Math.min(Math.max(ritmKgSaptamana, 0), 1);
}

/** Deficitul caloric zilnic necesar pentru ritmul dat. */
export function deficitZilnic(ritmKgSaptamana: number): number {
  return Math.round((clampRitm(ritmKgSaptamana) * KCAL_PER_KG) / 7);
}

export interface DailyBudget {
  bmr: number;
  tdee: number;
  deficit: number;
  /** kcal arse la sală azi */
  arseAntrenament: number;
  /** aportul maxim recomandat azi pentru a rămâne pe traiectoria obiectivului */
  aportMaximAzi: number;
  /** aportul maxim recomandat într-o zi fără sală */
  aportMaximBaza: number;
  /** pragul de siguranță sub care nu coborâm aportul */
  pragMinim: number;
}

/**
 * Bugetul caloric al zilei: TDEE + arse la antrenament − deficit.
 * Nu coborâm niciodată sub pragul minim de siguranță (80% din BMR,
 * dar nu mai puțin de 1200 kcal) — slăbitul nu e înfometare.
 */
export function bugetZilnic(params: {
  sex: Sex;
  greutate: number;
  inaltime: number;
  varsta: number;
  activitate: ActivityLevel;
  ritmKgSaptamana: number;
  arseAntrenament: number;
}): DailyBudget {
  const b = bmr(params.sex, params.greutate, params.inaltime, params.varsta);
  const t = tdee(b, params.activitate);
  const deficit = deficitZilnic(params.ritmKgSaptamana);
  const pragMinim = Math.max(1200, Math.round(b * 0.8));
  const aportMaximBaza = Math.max(pragMinim, t - deficit);
  const aportMaximAzi = Math.max(pragMinim, t + Math.round(params.arseAntrenament) - deficit);
  return {
    bmr: b,
    tdee: t,
    deficit,
    arseAntrenament: Math.round(params.arseAntrenament),
    aportMaximAzi,
    aportMaximBaza,
    pragMinim,
  };
}

/** Săptămâni estimate până la greutatea țintă. null dacă obiectivul e deja atins. */
export function saptamaniPanaLaTinta(
  greutateCurenta: number,
  greutateTinta: number,
  ritmKgSaptamana: number,
): number | null {
  const dif = greutateCurenta - greutateTinta;
  if (dif <= 0) return null;
  const ritm = clampRitm(ritmKgSaptamana);
  if (ritm === 0) return null;
  return Math.ceil(dif / ritm);
}

/** Ținta de apă pe zi (ml) — ~33 ml/kg, rotunjită la 100 ml. */
export function tintaApaZi(greutateKg: number): number {
  return Math.round((greutateKg * 33) / 100) * 100;
}

/** Ținta de apă pe sesiune de sală (ml) — ~7 ml/kg/oră, min. 500 ml. */
export function tintaApaSesiune(greutateKg: number): number {
  return Math.max(500, Math.round((greutateKg * 7) / 50) * 50);
}
