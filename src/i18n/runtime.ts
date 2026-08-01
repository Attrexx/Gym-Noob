import type { CheieMesaj, Mesaj, Params, Plural } from './types';
import { pachetActiv } from './store';
import { categoriePlural, nr } from './format';

/**
 * Traducerea. Sincronă și fără React, deci merge oriunde — inclusiv în
 * serviciile și mesajele de eroare care nu sunt componente.
 *
 *   t('comun.exercitii', { n: 28 })  → „28 de exerciții"
 *   t('sesiune.tinta', { kg: 9.5 })  → „Ținta: 9,5 kg"
 *
 * Dacă mesajul e un obiect de plural, categoria se alege după `p.n`.
 * Numerele din `p` trec automat prin `nr()`, ca să respecte separatorul zecimal
 * al limbii fără să se gândească fiecare apelant la asta.
 */
export function t(cheie: CheieMesaj, p?: Params): string {
  const pachet = pachetActiv();
  if (!pachet) throw new Error(`i18n: nicio limbă încărcată (cheia „${cheie}")`);

  const mesaj: Mesaj | undefined = (pachet.mesaje as Record<string, Mesaj>)[cheie];
  if (mesaj === undefined) {
    // nu aruncăm: un text lipsă nu trebuie să dărâme un ecran întreg
    if (import.meta.env?.DEV) console.warn(`i18n: cheie lipsă „${cheie}"`);
    return cheie;
  }

  const sablon = typeof mesaj === 'string' ? mesaj : alegePlural(mesaj, p);
  return interpoleaza(sablon, p);
}

function alegePlural(mesaj: Plural, p?: Params): string {
  const n = typeof p?.n === 'number' ? p.n : 0;
  return mesaj[categoriePlural(n)] ?? mesaj.other;
}

function interpoleaza(sablon: string, p?: Params): string {
  if (!p) return sablon;
  return sablon.replace(/\{(\w+)\}/g, (intreg, nume: string) => {
    const v = p[nume];
    if (v === undefined) return intreg;
    return typeof v === 'number' ? nr(v) : v;
  });
}
