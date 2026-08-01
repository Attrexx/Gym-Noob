/**
 * Formatarea numerelor și a datelor, dependentă de limbă.
 *
 * Înlocuiește `formatNr` (care avea virgula românească hardcodată) și cele 11
 * apeluri `toLocaleDateString('ro-RO')`. Formatoarele `Intl.*` sunt scumpe de
 * construit, așa că se fac o singură dată, la schimbarea limbii.
 *
 * Atenție: aplicația e METRICĂ prin design (kg, km, ml, kcal) în orice limbă —
 * engleza e en-GB. Aici NU se convertesc unități, doar se formatează cifrele.
 */

interface Formatoare {
  tag: string;
  nr: Intl.NumberFormat;
  km: Intl.NumberFormat;
  viteza: Intl.NumberFormat;
  plural: Intl.PluralRules;
  relativ: Intl.RelativeTimeFormat;
  data: Record<StilData, Intl.DateTimeFormat>;
  dataOra: Intl.DateTimeFormat;
}

export type StilData =
  /** 29.07.2026 — implicit */
  | 'scurt'
  /** 29 iul. */
  | 'ziLunaScurt'
  /** 29 iulie */
  | 'ziLunaLung'
  /** miercuri, 29 iulie */
  | 'zilnic'
  /** iulie 2026 */
  | 'lunaAn';

const STILURI: Record<StilData, Intl.DateTimeFormatOptions> = {
  scurt: { day: '2-digit', month: '2-digit', year: 'numeric' },
  ziLunaScurt: { day: 'numeric', month: 'short' },
  ziLunaLung: { day: 'numeric', month: 'long' },
  zilnic: { weekday: 'long', day: 'numeric', month: 'long' },
  lunaAn: { month: 'long', year: 'numeric' },
};

let f: Formatoare | null = null;

/** Apelat de `incarcaLimba()`. */
export function construiesteFormatoare(tag: string): void {
  f = {
    tag,
    // fără grupare: 1000 rămâne „1000", nu „1.000" — altfel s-ar schimba
    // ieșirea de azi și ar trebui rescrise selectoarele din smoke
    nr: new Intl.NumberFormat(tag, { maximumFractionDigits: 1, useGrouping: false }),
    km: new Intl.NumberFormat(tag, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }),
    viteza: new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: false }),
    plural: new Intl.PluralRules(tag),
    relativ: new Intl.RelativeTimeFormat(tag, { numeric: 'auto' }),
    data: Object.fromEntries(
      (Object.keys(STILURI) as StilData[]).map((s) => [s, new Intl.DateTimeFormat(tag, STILURI[s])]),
    ) as Record<StilData, Intl.DateTimeFormat>,
    dataOra: new Intl.DateTimeFormat(tag, { dateStyle: 'short', timeStyle: 'short' }),
  };
}

function fmt(): Formatoare {
  if (!f) throw new Error('i18n: formatoarele nu sunt construite — cheamă incarcaLimba() înainte');
  return f;
}

/**
 * Numărul „obișnuit": întreg fără zecimale, altfel o zecimală.
 * `nr(40)` → „40"; `nr(9.5)` → „9,5" (ro) / „9.5" (en).
 */
export function nr(v: number, zecimale?: number): string {
  if (zecimale === undefined) return fmt().nr.format(v);
  return new Intl.NumberFormat(fmt().tag, {
    minimumFractionDigits: zecimale,
    maximumFractionDigits: zecimale,
    useGrouping: false,
  }).format(v);
}

/** Distanță: sub 1 km în metri, peste în km cu 2 zecimale fixe („3,10 km"). */
export function km(metri: number): string {
  if (metri < 1000) return `${Math.round(metri)} m`;
  return `${fmt().km.format(metri / 1000)} km`;
}

/** Viteză: mereu o zecimală („10,0"), spre deosebire de `nr` care ar da „10". */
export function viteza(v: number): string {
  return fmt().viteza.format(v);
}

/** Categoria de plural pentru `n`, după regulile CLDR ale limbii active. */
export function categoriePlural(n: number): Intl.LDMLPluralRule {
  return fmt().plural.select(n);
}

export function data(valoare: string | Date, stil: StilData = 'scurt'): string {
  return fmt().data[stil].format(typeof valoare === 'string' ? new Date(valoare) : valoare);
}

export function dataOra(valoare: string | Date): string {
  return fmt().dataOra.format(typeof valoare === 'string' ? new Date(valoare) : valoare);
}

/**
 * „ieri", „alaltăieri", „acum 3 zile", „acum 30 de zile".
 * `numeric: 'auto'` e cel care dă cuvintele în loc de „acum 1 zi".
 * Cazul „azi" îl tratează apelantul — `Intl` ar da „azi", pierzând nuanța
 * „azi mai devreme".
 */
export function relativZile(zile: number): string {
  return fmt().relativ.format(-zile, 'day');
}
