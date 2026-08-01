import { create } from 'zustand';
import { LIMBI, TAG, type Limba } from './types';
import type { Pachet } from './types-pachet';
import { PACHETE } from './messages';
import { aplicaTextCatalog } from '@/data/catalog/exercises';
import { construiesteFormatoare } from './format';

/**
 * Starea limbii — store separat de `profileStore`, din două motive:
 *
 * 1. Zeci de locuri NON-React au nevoie de `t()` sincron (mesaje de eroare din
 *    `data/sync/api.ts`, `data/backup.ts`, `services/bleMachine.ts`). Un pachet
 *    global le servește pe toate; un context React nu poate.
 * 2. `profileStore → repo → catalog → i18n` — dacă i18n ar citi profileStore,
 *    s-ar închide un ciclu de importuri.
 *
 * Modulul NU atinge `window`/`document` (rulează și în vitest, environment node).
 * Partea de DOM — `<html lang>`, localStorage — stă în `profileStore.aplicaLimba`.
 */
interface StareI18n {
  limba: Limba;
  /** crește la fiecare schimbare — pe ea se abonează componentele */
  versiune: number;
  gata: boolean;
}

export const useI18n = create<StareI18n>(() => ({
  limba: LIMBI[0],
  versiune: 0,
  gata: false,
}));

let activ: Pachet | null = null;
const cache = new Map<Limba, Pachet>();

/** Pachetul activ. Citit de `t()` și de formatoare. */
export function pachetActiv(): Pachet | null {
  return activ;
}

export function limbaActiva(): Limba {
  return useI18n.getState().limba;
}

/**
 * Încarcă (leneș) și activează o limbă. Idempotent: a doua oară e un hit de cache.
 * `versiune` crește DOAR după ce pachetul e pe deplin aplicat, ca interfața să nu
 * apuce să deseneze un cadru pe jumătate tradus.
 */
export async function incarcaLimba(limba: Limba): Promise<void> {
  if (activ && limbaActiva() === limba && useI18n.getState().gata) return;

  const pachet = cache.get(limba) ?? (await PACHETE[limba]());
  cache.set(limba, pachet);
  activ = pachet;

  // formatoarele Intl sunt scumpe de construit — o dată per limbă
  construiesteFormatoare(TAG[limba]);
  // catalogul își ia numele și cues-urile din pachet
  aplicaTextCatalog(pachet.catalog);

  useI18n.setState((s) => ({ limba, versiune: s.versiune + 1, gata: true }));
}

/**
 * Alege limba efectivă dintr-o setare, negociind cu browserul pentru „auto".
 *
 * Primește `string`, nu `LimbaSetare`, intenționat: setarea vine din baza de
 * date și se sincronizează între dispozitive, deci un telefon cu o versiune
 * mai nouă poate trimite o limbă pe care build-ul ăsta n-o cunoaște încă.
 * Într-un asemenea caz cădem elegant pe negociere, nu crăpăm.
 *
 * `limbiBrowser` e injectabil ca să fie testabil fără `navigator`.
 */
export function rezolvaLimba(setare: string | undefined, limbiBrowser?: readonly string[]): Limba {
  const cunoscuta = LIMBI.find((l) => l === setare);
  if (cunoscuta) return cunoscuta;
  const preferate = limbiBrowser ?? (typeof navigator !== 'undefined' ? navigator.languages : undefined) ?? [];
  for (const tag of preferate) {
    const primar = tag.toLowerCase().split('-')[0];
    const gasit = LIMBI.find((l) => l === primar);
    if (gasit) return gasit;
  }
  return LIMBI[0];
}
