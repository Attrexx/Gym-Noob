import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  fmtPas,
  parseBanda,
  parseBicicleta,
  parseDateAparat,
  parseRower,
} from '@/domain/ftms';
// `descrieAparat` a plecat din domain/ în i18n/. Aserțiile rămân identice —
// dovada că trecerea pe Intl nu a schimbat ieșirea în română.
import { descrieAparat } from '@/i18n/descrieri';
import { incarcaLimba } from '@/i18n/store';

beforeAll(async () => {
  await incarcaLimba('ro');
});

/**
 * Construiește un pachet FTMS din bucăți, ca să scriem fixture-urile în
 * aceeași ordine în care le trimite aparatul.
 */
class Pachet {
  private o: number[] = [];

  constructor(flags: number) {
    this.u16(flags);
  }

  u8(v: number) {
    this.o.push(v & 0xff);
    return this;
  }

  u16(v: number) {
    this.o.push(v & 0xff, (v >> 8) & 0xff);
    return this;
  }

  s16(v: number) {
    return this.u16(v < 0 ? v + 0x10000 : v);
  }

  u24(v: number) {
    this.o.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff);
    return this;
  }

  dv(): DataView {
    return new DataView(new Uint8Array(this.o).buffer);
  }
}

describe('bandă de alergare (0x2ACD)', () => {
  it('bitul 0 „More Data" e INVERS: 0 înseamnă că viteza E prezentă', () => {
    // flags = 0 → doar viteza instantanee
    const d = parseBanda(new Pachet(0x0000).u16(950).dv());
    expect(d.vitezaKmh).toBeCloseTo(9.5, 2);
  });

  it('cu bitul 0 pus pe 1, viteza lipsește și nu decalează restul', () => {
    // flags: bit0 (fără viteză) + bit2 (distanță)
    const d = parseBanda(new Pachet(0x0005).u24(1250).dv());
    expect(d.vitezaKmh).toBeUndefined();
    expect(d.distantaM).toBe(1250);
  });

  it('citește distanța pe 3 octeți, peste pragul de 16 biți', () => {
    const d = parseBanda(new Pachet(0x0004).u16(950).u24(70_000).dv());
    expect(d.distantaM).toBe(70_000);
  });

  it('înclinația e cu semn (pantă negativă la coborâre)', () => {
    // bit3: înclinație + unghi rampă
    const urcare = parseBanda(new Pachet(0x0008).u16(950).s16(25).s16(0).dv());
    expect(urcare.inclinatieProcent).toBeCloseTo(2.5, 2);
    const coborare = parseBanda(new Pachet(0x0008).u16(950).s16(-30).s16(0).dv());
    expect(coborare.inclinatieProcent).toBeCloseTo(-3, 2);
  });

  it('energia e un triplet: total, pe oră, pe minut — luăm doar totalul', () => {
    // bit7 energie + bit8 puls: pulsul trebuie să vină DUPĂ cei 5 octeți de energie
    const d = parseBanda(new Pachet(0x0180).u16(950).u16(310).u16(700).u8(12).u8(142).dv());
    expect(d.kcalTotal).toBe(310);
    expect(d.bpm).toBe(142);
  });

  it('0xFFFF la energie înseamnă „nu știu", nu 65535 kcal', () => {
    const d = parseBanda(new Pachet(0x0080).u16(950).u16(0xffff).u16(0).u8(0).dv());
    expect(d.kcalTotal).toBeUndefined();
  });

  it('citește un pachet complet, cu toate câmpurile la locul lor', () => {
    // viteză + distanță + înclinație + energie + puls + MET + timp
    const flags = 0x0004 | 0x0008 | 0x0080 | 0x0100 | 0x0200 | 0x0400;
    const d = parseBanda(
      new Pachet(flags)
        .u16(1020) // 10,2 km/h
        .u24(3100) // 3100 m
        .s16(15) // 1,5 %
        .s16(0)
        .u16(280) // 280 kcal
        .u16(600)
        .u8(10)
        .u8(151) // puls
        .u8(95) // 9,5 MET
        .u16(1500) // 25 min
        .dv(),
    );
    expect(d).toMatchObject({ distantaM: 3100, kcalTotal: 280, bpm: 151, timpSec: 1500 });
    expect(d.vitezaKmh).toBeCloseTo(10.2, 2);
    expect(d.inclinatieProcent).toBeCloseTo(1.5, 2);
    expect(d.met).toBeCloseTo(9.5, 2);
  });
});

describe('rower (0x2AD1)', () => {
  it('ritmul și numărul de lopătări sunt prezente când bitul 0 e 0', () => {
    // rezoluția ritmului e 0,5 → 56 înseamnă 28 lopătări/min
    const d = parseRower(new Pachet(0x0000).u8(56).u16(120).dv());
    expect(d.cadenta).toBeCloseTo(28, 2);
  });

  it('pas, putere și distanță — pachetul obișnuit de vâslit', () => {
    const flags = 0x0004 | 0x0008 | 0x0020;
    const d = parseRower(new Pachet(flags).u8(56).u16(120).u24(1500).u16(125).s16(180).dv());
    expect(d).toMatchObject({ distantaM: 1500, pasSec: 125, putereW: 180 });
    expect(d.cadenta).toBeCloseTo(28, 2);
  });

  it('nu confundă puterea cu rezistența când lipsește ritmul', () => {
    // bit0 = 1 (fără ritm) + bit5 putere + bit7 rezistență
    const d = parseRower(new Pachet(0x00a1).s16(210).s16(7).dv());
    expect(d.cadenta).toBeUndefined();
    expect(d.putereW).toBe(210);
    expect(d.nivelRezistenta).toBe(7);
  });
});

describe('bicicletă (0x2AD2)', () => {
  it('cadența are tot rezoluția 0,5 rotații/min', () => {
    const d = parseBicicleta(new Pachet(0x0004).u16(2500).u16(180).dv());
    expect(d.vitezaKmh).toBeCloseTo(25, 2);
    expect(d.cadenta).toBeCloseTo(90, 2);
  });
});

describe('robustețe', () => {
  it('un pachet trunchiat nu aruncă, doar întoarce ce a apucat să citească', () => {
    // flag-urile promit distanță și energie, dar octeții s-au terminat
    const scurt = parseBanda(new Pachet(0x0084).u16(950).dv());
    expect(scurt.vitezaKmh).toBeCloseTo(9.5, 2);
    expect(scurt.distantaM).toBeUndefined();
    expect(scurt.kcalTotal).toBeUndefined();
  });

  it('un pachet gol nu produce nimic', () => {
    expect(parseDateAparat('banda', new DataView(new Uint8Array([0x00]).buffer))).toEqual({});
  });

  it('parseDateAparat alege parserul după tipul aparatului', () => {
    const octeti = new Pachet(0x0000).u8(56).u16(120).dv();
    expect(parseDateAparat('rower', octeti).cadenta).toBeCloseTo(28, 2);
  });
});

describe('afișare', () => {
  it('ritmul de rower se scrie ca pe consolă', () => {
    expect(fmtPas(125)).toBe('2:05/500m');
    expect(fmtPas(90)).toBe('1:30/500m');
  });

  it('rândul de telemetrie e în limba română, cu virgulă zecimală', () => {
    const text = descrieAparat('banda', { vitezaKmh: 9.5, inclinatieProcent: 2, distantaM: 1250 });
    expect(text).toBe('9,5 km/h · 2% · 1,25 km');
  });

  it('sub un kilometru rămâne în metri', () => {
    expect(descrieAparat('rower', { distantaM: 800 })).toBe('800 m');
  });

  describe('în engleză', () => {
    beforeAll(async () => {
      await incarcaLimba('en');
    });
    afterAll(async () => {
      await incarcaLimba('ro');
    });

    it('același rând, cu punct zecimal', () => {
      const text = descrieAparat('banda', { vitezaKmh: 9.5, inclinatieProcent: 2, distantaM: 1250 });
      expect(text).toBe('9.5 km/h · 2% · 1.25 km');
    });

    it('ritmul de rower e locale-invariant, deci nu se schimbă', () => {
      expect(fmtPas(125)).toBe('2:05/500m');
    });
  });
});
