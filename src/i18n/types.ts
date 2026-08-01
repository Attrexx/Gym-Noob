/**
 * Tipurile de bază ale stratului multilingv.
 *
 * Regula de aur: `messages/ro.ts` e SURSA DE ADEVĂR. Orice altă limbă se declară
 * `satisfies Traducere<Mesaje>`, deci compilatorul refuză o cheie lipsă, una în
 * plus sau un text acolo unde româna are un plural.
 *
 * Ca să adaugi o limbă: pui codul în `LIMBI`, eticheta în `TAG`, scrii
 * `messages/<cod>.ts` + `data/catalog/text/<cod>.ts` și le înregistrezi în
 * `messages/index.ts`. Nicio componentă nu se schimbă.
 */

export const LIMBI = ['ro'] as const;
export type Limba = (typeof LIMBI)[number];

/** Ce se salvează în `Settings.limba`; „auto" = urmează browserul. */
export type LimbaSetare = Limba | 'auto';

/**
 * Eticheta BCP-47 folosită pentru `Intl.*` și pentru vocea TTS.
 * Engleza va fi `en-GB` (metric, ca restul aplicației).
 */
export const TAG: Record<Limba, string> = {
  ro: 'ro-RO',
};

/**
 * Numele limbilor, în limba lor. NU se traduc niciodată: cine a comutat din
 * greșeală trebuie să-și recunoască limba în listă ca să se poată întoarce.
 * Cheile sunt `string`, nu `Limba`, ca să poți pregăti un nume înainte să
 * înregistrezi limba.
 */
export const AUTONIM: Record<string, string> = {
  ro: '🇷🇴 Română',
  en: '🇬🇧 English',
};

/**
 * Un mesaj cu plural. `other` e obligatoriu — e categoria pe care CLDR o are în
 * orice limbă. Restul (`one`, `few`, `many`, …) depind de limbă și sunt
 * verificate de `tests/i18n/paritate.test.ts` cu `Intl.PluralRules`.
 *
 * În română: one = 1, few = 0 și 2–19, other = 20+ („20 DE exerciții").
 */
export type Plural = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export type Mesaj = string | Plural;

/** Valorile interpolate în `{acolade}`. Numerele trec automat prin `nr()`. */
export type Params = Record<string, string | number>;

export type Mesaje = typeof import('./messages/ro').ro;
export type CheieMesaj = keyof Mesaje & string;

/**
 * Paritate la compilare: aceleași chei, aceeași formă (text simplu vs. plural).
 * Costă zero la rulare — e doar un tip.
 */
export type Traducere<M> = { [K in keyof M]: M[K] extends string ? string : Plural };
