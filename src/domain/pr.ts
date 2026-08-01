import type { SetLog } from '@/data/types';
import { epley1Rm } from './oneRm';

export type PrType = 'greutate' | 'volum_set' | 'repetari' | '1rm';

/** Tipurile, în ordinea de afișat. Etichetele sunt mesaje: `t(`domeniu.pr.${tip}`)`. */
export const TIPURI_PR: PrType[] = ['greutate', 'volum_set', 'repetari', '1rm'];

export interface PrHit {
  tip: PrType;
  valoare: number;
  valoareVeche: number | null;
}

function metrics(l: SetLog) {
  const greutate = l.greutate ?? 0;
  const repetari = l.repetari ?? 0;
  return {
    greutate,
    repetari,
    volum_set: greutate * repetari,
    '1rm': epley1Rm(greutate, repetari),
  };
}

/**
 * Detectează recordurile personale atinse de un set nou, comparat cu
 * istoricul aceluiași exercițiu (istoricul NU include setul nou).
 */
export function detectPrs(setNou: SetLog, istoric: SetLog[]): PrHit[] {
  const m = metrics(setNou);
  const hits: PrHit[] = [];
  const best = { greutate: 0, repetari: 0, volum_set: 0, '1rm': 0 };
  for (const l of istoric) {
    const h = metrics(l);
    best.greutate = Math.max(best.greutate, h.greutate);
    best.repetari = Math.max(best.repetari, h.repetari);
    best.volum_set = Math.max(best.volum_set, h.volum_set);
    best['1rm'] = Math.max(best['1rm'], h['1rm']);
  }
  // Un PR fără istoric nu e PR — e prima încercare. Cerem istoric nenul.
  if (istoric.length === 0) return [];
  const check = (tip: PrType, nou: number, vechi: number) => {
    if (nou > vechi && vechi > 0) hits.push({ tip, valoare: nou, valoareVeche: vechi });
  };
  check('greutate', m.greutate, best.greutate);
  check('repetari', m.repetari, best.repetari);
  check('volum_set', m.volum_set, best.volum_set);
  check('1rm', m['1rm'], best['1rm']);
  return hits;
}

/** Recordurile absolute ale unui exercițiu, din tot istoricul. */
export function bestRecords(istoric: SetLog[]): Record<PrType, { valoare: number; data: string } | null> {
  const out: Record<PrType, { valoare: number; data: string } | null> = {
    greutate: null,
    repetari: null,
    volum_set: null,
    '1rm': null,
  };
  for (const l of istoric) {
    const m = metrics(l);
    for (const tip of ['greutate', 'repetari', 'volum_set', '1rm'] as PrType[]) {
      const v = m[tip === 'volum_set' ? 'volum_set' : tip === '1rm' ? '1rm' : tip];
      if (v > 0 && (!out[tip] || v > out[tip]!.valoare)) out[tip] = { valoare: v, data: l.data };
    }
  }
  return out;
}
