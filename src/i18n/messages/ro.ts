/**
 * SURSA DE ADEVĂR pentru toate textele din interfață.
 *
 * Convenții:
 * - chei plate, cu puncte: `<zonă>.<secțiune>.<rol>` (vezi docs/CONTEXT.md).
 *   Zonele sunt numele rutelor românești: sesiune, setari, biblioteca, realizari, ghid…
 *   Rolurile vin dintr-un set închis: titlu, supratitlu, descriere, eticheta, buton,
 *   placeholder, aria, gol, eroare, confirmare, succes.
 * - interpolare cu `{nume}`; numerele trec automat prin `nr()`, deci
 *   `{greutate} kg` iese „9,5 kg" în română și „9.5 kg" în engleză.
 * - plural: obiect `{ one, few, other }` selectat după `p.n` cu `Intl.PluralRules`.
 *   În română `other` e forma cu „de": 20 DE exerciții.
 * - text bogat: `<0>…</0>` marchează un slot; implicit devine `<b>`. Vezi `rich.tsx`.
 *
 * Cheile sunt în română intenționat — restul codului folosește identificatori
 * românești (greutate, sesiune, realizari), vezi CLAUDE.md.
 */

export const ro = {
  // ── numere de lucruri (plural) ──────────────────────────────────────
  'comun.exercitii': {
    one: '{n} exercițiu',
    few: '{n} exerciții',
    other: '{n} de exerciții',
  },
  'comun.antrenamente': {
    one: '{n} antrenament',
    few: '{n} antrenamente',
    other: '{n} de antrenamente',
  },
  'comun.programeCelebre': {
    one: '{n} program celebru',
    few: '{n} programe celebre',
    other: '{n} de programe celebre',
  },

  // ── timp relativ („data trecută") ───────────────────────────────────
  'timp.aziMaiDevreme': 'azi mai devreme',

  // ── meta ────────────────────────────────────────────────────────────
  'meta.descriere':
    'Ghidul complet al începătorului absolut la sală. Antrenamente, jurnale, calorii și statistici — totul în română.',
};
