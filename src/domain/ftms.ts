import type { TipAparat } from '@/data/types';

/**
 * FTMS — Fitness Machine Service, standardul Bluetooth prin care aparatele
 * de sală își transmit datele (0x1826). Aici stă DOAR decodarea octeților,
 * fără nimic din Web Bluetooth, ca să putem testa totul din fixture-uri.
 *
 * ⚠️ Capcana numărul unu: bitul 0 din flags se numește „More Data" și are
 * înțelesul INVERS față de restul biților — viteza instantanee (bandă) și
 * ritmul + numărul de lopătări (rower) sunt prezente când bitul 0 e **0**.
 * Toți ceilalți biți înseamnă „câmpul e prezent" când sunt 1.
 *
 * Alte capcane: distanța e pe 3 octeți (uint24), înclinația e cu semn
 * (sint16 × 0,1 %), iar „energia consumată" e un TRIPLET:
 * total (uint16 kcal) + pe oră (uint16) + pe minut (uint8).
 */

// ── UUID-uri ────────────────────────────────────────────────────────
export const UUID_FTMS = 0x1826;
export const UUID_FEATURE = 0x2acc;

/** Caracteristicile de date, în ordinea în care le căutăm pe aparat. */
export const CARACTERISTICI_DATE: { uuid: number; tip: TipAparat }[] = [
  { uuid: 0x2acd, tip: 'banda' },
  { uuid: 0x2ad1, tip: 'rower' },
  { uuid: 0x2ad2, tip: 'bicicleta' },
  { uuid: 0x2ace, tip: 'eliptica' },
  { uuid: 0x2ad0, tip: 'stepper' },
];

// Numele aparatelor sunt acum mesaje: `t(`domeniu.aparat.${tip}`)`.
// Emoji-urile rămân aici — nu depind de limbă.
export const EMOJI_APARAT: Record<TipAparat, string> = {
  banda: '🏃',
  rower: '🚣',
  bicicleta: '🚴',
  eliptica: '⛷️',
  stepper: '🪜',
};

/** Un eșantion normalizat, indiferent de ce fel de aparat l-a trimis. */
export interface DateAparat {
  vitezaKmh?: number;
  inclinatieProcent?: number;
  distantaM?: number;
  /** lopătări/min (rower), rotații/min (bicicletă), pași/min (eliptică) */
  cadenta?: number;
  putereW?: number;
  /** ritm în secunde pe 500 m (rower) */
  pasSec?: number;
  kcalTotal?: number;
  bpm?: number;
  /** MET-ul raportat chiar de aparat, dacă îl transmite */
  met?: number;
  timpSec?: number;
  nivelRezistenta?: number;
}

/** Citește un uint24 little-endian (distanța totală, în metri). */
function uint24(dv: DataView, i: number): number {
  return dv.getUint8(i) | (dv.getUint8(i + 1) << 8) | (dv.getUint8(i + 2) << 16);
}

/**
 * Cursor peste buffer care nu iese niciodată din el: dacă aparatul trimite
 * un pachet mai scurt decât spun flag-urile (se întâmplă), ne oprim curat
 * în loc să aruncăm excepții în mijlocul antrenamentului.
 */
class Cursor {
  private i = 0;
  constructor(private readonly dv: DataView) {}

  private are(octeti: number): boolean {
    return this.i + octeti <= this.dv.byteLength;
  }

  u8(): number | undefined {
    if (!this.are(1)) return undefined;
    const v = this.dv.getUint8(this.i);
    this.i += 1;
    return v;
  }

  u16(): number | undefined {
    if (!this.are(2)) return undefined;
    const v = this.dv.getUint16(this.i, true);
    this.i += 2;
    return v;
  }

  s16(): number | undefined {
    if (!this.are(2)) return undefined;
    const v = this.dv.getInt16(this.i, true);
    this.i += 2;
    return v;
  }

  u24(): number | undefined {
    if (!this.are(3)) return undefined;
    const v = uint24(this.dv, this.i);
    this.i += 3;
    return v;
  }

  /** sare peste n octeți (câmpuri prezente care nu ne interesează) */
  sari(octeti: number): void {
    this.i = Math.min(this.i + octeti, this.dv.byteLength);
  }
}

/** Împarte în 0,1 — dar păstrează `undefined` dacă lipsea câmpul. */
function scala(v: number | undefined, factor: number): number | undefined {
  return v === undefined ? undefined : Math.round((v * factor) * 100) / 100;
}

/** Blocul „energie consumată": total kcal + kcal/oră + kcal/minut. */
function citesteEnergie(c: Cursor): number | undefined {
  const total = c.u16();
  c.u16(); // pe oră — nu ne trebuie, dar ocupă loc
  c.u8(); // pe minut
  // 0xFFFF înseamnă „nu știu" în FTMS
  return total === undefined || total === 0xffff ? undefined : total;
}

/** Treadmill Data — 0x2ACD */
export function parseBanda(dv: DataView): DateAparat {
  const flags = dv.getUint16(0, true);
  const c = new Cursor(dv);
  c.sari(2);
  const d: DateAparat = {};

  // bit 0 „More Data": viteza instantanee e prezentă când bitul e ZERO
  if (!(flags & 0x0001)) d.vitezaKmh = scala(c.u16(), 0.01);
  if (flags & 0x0002) c.sari(2); // viteză medie
  if (flags & 0x0004) d.distantaM = c.u24();
  if (flags & 0x0008) {
    d.inclinatieProcent = scala(c.s16(), 0.1);
    c.sari(2); // unghiul rampei
  }
  if (flags & 0x0010) c.sari(4); // câștig de altitudine (+ / −)
  if (flags & 0x0020) c.sari(1); // ritm instantaneu
  if (flags & 0x0040) c.sari(1); // ritm mediu
  if (flags & 0x0080) d.kcalTotal = citesteEnergie(c);
  if (flags & 0x0100) d.bpm = c.u8();
  if (flags & 0x0200) d.met = scala(c.u8(), 0.1);
  if (flags & 0x0400) d.timpSec = c.u16();
  if (flags & 0x0800) c.sari(2); // timp rămas
  if (flags & 0x1000) {
    c.sari(2); // forța pe bandă
    d.putereW = c.s16();
  }
  return d;
}

/** Rower Data — 0x2AD1 */
export function parseRower(dv: DataView): DateAparat {
  const flags = dv.getUint16(0, true);
  const c = new Cursor(dv);
  c.sari(2);
  const d: DateAparat = {};

  // bit 0 „More Data": ritmul și numărul de lopătări sunt prezente când e ZERO
  if (!(flags & 0x0001)) {
    d.cadenta = scala(c.u8(), 0.5); // lopătări/min, rezoluție 0,5
    c.sari(2); // total lopătări
  }
  if (flags & 0x0002) c.sari(1); // ritm mediu
  if (flags & 0x0004) d.distantaM = c.u24();
  if (flags & 0x0008) d.pasSec = c.u16();
  if (flags & 0x0010) c.sari(2); // pas mediu
  if (flags & 0x0020) d.putereW = c.s16();
  if (flags & 0x0040) c.sari(2); // putere medie
  if (flags & 0x0080) d.nivelRezistenta = c.s16();
  if (flags & 0x0100) d.kcalTotal = citesteEnergie(c);
  if (flags & 0x0200) d.bpm = c.u8();
  if (flags & 0x0400) d.met = scala(c.u8(), 0.1);
  if (flags & 0x0800) d.timpSec = c.u16();
  if (flags & 0x1000) c.sari(2); // timp rămas
  return d;
}

/** Indoor Bike Data — 0x2AD2 */
export function parseBicicleta(dv: DataView): DateAparat {
  const flags = dv.getUint16(0, true);
  const c = new Cursor(dv);
  c.sari(2);
  const d: DateAparat = {};

  if (!(flags & 0x0001)) d.vitezaKmh = scala(c.u16(), 0.01);
  if (flags & 0x0002) c.sari(2); // viteză medie
  if (flags & 0x0004) d.cadenta = scala(c.u16(), 0.5); // rotații/min, rezoluție 0,5
  if (flags & 0x0008) c.sari(2); // cadență medie
  if (flags & 0x0010) d.distantaM = c.u24();
  if (flags & 0x0020) d.nivelRezistenta = c.s16();
  if (flags & 0x0040) d.putereW = c.s16();
  if (flags & 0x0080) c.sari(2); // putere medie
  if (flags & 0x0100) d.kcalTotal = citesteEnergie(c);
  if (flags & 0x0200) d.bpm = c.u8();
  if (flags & 0x0400) d.met = scala(c.u8(), 0.1);
  if (flags & 0x0800) d.timpSec = c.u16();
  if (flags & 0x1000) c.sari(2); // timp rămas
  return d;
}

/** Cross Trainer Data — 0x2ACE (eliptica) */
export function parseEliptica(dv: DataView): DateAparat {
  // aici flags are 24 de biți: 16 + încă 8
  const flags = dv.getUint16(0, true) | (dv.byteLength > 2 ? dv.getUint8(2) << 16 : 0);
  const c = new Cursor(dv);
  c.sari(3);
  const d: DateAparat = {};

  if (!(flags & 0x000001)) d.vitezaKmh = scala(c.u16(), 0.01);
  if (flags & 0x000002) c.sari(2); // viteză medie
  if (flags & 0x000004) d.distantaM = c.u24();
  if (flags & 0x000008) c.sari(4); // pași / pași pe minut
  if (flags & 0x000010) c.sari(2); // lungimea pasului
  if (flags & 0x000020) c.sari(4); // câștig de altitudine
  if (flags & 0x000040) c.sari(2); // înclinație + unghi rampă
  if (flags & 0x000080) d.nivelRezistenta = c.s16();
  if (flags & 0x000100) d.putereW = c.s16();
  if (flags & 0x000200) c.sari(2); // putere medie
  if (flags & 0x000400) d.kcalTotal = citesteEnergie(c);
  if (flags & 0x000800) d.bpm = c.u8();
  if (flags & 0x001000) d.met = scala(c.u8(), 0.1);
  if (flags & 0x002000) d.timpSec = c.u16();
  if (flags & 0x004000) c.sari(2); // timp rămas
  return d;
}

/** Stair Climber Data — 0x2AD0 */
export function parseStepper(dv: DataView): DateAparat {
  const flags = dv.getUint16(0, true);
  const c = new Cursor(dv);
  c.sari(2);
  const d: DateAparat = {};

  if (!(flags & 0x0001)) {
    c.sari(2); // trepte pe minut
    c.sari(2); // trepte medii pe minut
  }
  if (flags & 0x0002) c.sari(2); // etaje urcate
  if (flags & 0x0004) d.cadenta = c.u16(); // trepte/min
  if (flags & 0x0008) c.sari(2); // cadență medie
  if (flags & 0x0010) d.kcalTotal = citesteEnergie(c);
  if (flags & 0x0020) d.bpm = c.u8();
  if (flags & 0x0040) d.met = scala(c.u8(), 0.1);
  if (flags & 0x0080) d.timpSec = c.u16();
  if (flags & 0x0100) c.sari(2); // timp rămas
  return d;
}

const PARSERE: Record<TipAparat, (dv: DataView) => DateAparat> = {
  banda: parseBanda,
  rower: parseRower,
  bicicleta: parseBicicleta,
  eliptica: parseEliptica,
  stepper: parseStepper,
};

/** Decodează un eșantion după tipul aparatului. Nu aruncă niciodată. */
export function parseDateAparat(tip: TipAparat, dv: DataView): DateAparat {
  if (dv.byteLength < 2) return {};
  try {
    return PARSERE[tip](dv);
  } catch {
    return {};
  }
}

/** „2:05/500m" — ritmul de rower, cum îl arată aparatul. */
export function fmtPas(secPe500m: number): string {
  const m = Math.floor(secPe500m / 60);
  const s = Math.round(secPe500m % 60);
  return `${m}:${String(s).padStart(2, '0')}/500m`;
}

// `descrieAparat` a plecat în `src/i18n/descrieri.ts`, lângă `t()` și `nr()`.
// `fmtPas` rămâne aici: „2:05/500m" arată la fel în orice limbă.
