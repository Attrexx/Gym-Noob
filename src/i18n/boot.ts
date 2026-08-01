import { LIMBI, type Limba } from './types';
import { rezolvaLimba } from './store';

export { incarcaLimba } from './store';

/**
 * Partea care atinge browserul. Stă separat de `store.ts` fiindcă acela e
 * importat și de teste (vitest rulează pe environment „node", fără `window`).
 */

/** Indiciul de pornire — scris de `aplicaLimba`, citit înainte de primul render. */
export const CHEIE_LIMBA = 'gym-noob-limba';

/**
 * Limba cu care pornim, înainte să știm ce scrie în profil:
 * indiciul salvat → limba browserului → prima limbă din registru.
 *
 * Adevărul rămâne `Settings.limba`; `aplicaLimba()` corectează după încărcarea
 * profilului. În regim normal indiciul e deja corect, deci nu se vede nimic.
 */
export function limbaInitiala(): Limba {
  let salvat: string | null = null;
  try {
    salvat = localStorage.getItem(CHEIE_LIMBA);
  } catch {
    // modul privat / stocare blocată — mergem mai departe pe browser
  }
  const dinIndiciu = LIMBI.find((l) => l === salvat);
  return dinIndiciu ?? rezolvaLimba('auto');
}
