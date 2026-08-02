import { describe, expect, it } from 'vitest';
import { LIMBI, TAG, type Mesaj, type Plural } from '@/i18n/types';
import { ro } from '@/i18n/messages/ro';
import { en } from '@/i18n/messages/en';

/**
 * Paritatea între limbi, verificată la rulare.
 *
 * Compilatorul acoperă deja forma (`satisfies Traducere<Mesaje>` refuză o cheie
 * lipsă sau un text unde româna are plural). Ce NU poate vedea tipul e conținutul:
 * un `{param}` scris greșit, un `<0>` uitat, o categorie de plural care lipsește
 * pentru limba respectivă. Alea se sparg abia pe telefonul cuiva — deci aici.
 *
 * Lista de mai jos e explicită și NU se ia din `LIMBI`, ca o limbă să poată fi
 * scrisă și verificată înainte de a fi înregistrată (engleza a stat aici o etapă
 * întreagă înainte să apară în selector). Testul cere însă și invers: orice limbă
 * înregistrată trebuie să fie în listă, ca să nu poată intra una neverificată.
 */

const PACHETE: Record<string, { tag: string; mesaje: Record<string, Mesaj> }> = {
  ro: { tag: 'ro-RO', mesaje: ro },
  en: { tag: 'en-GB', mesaje: en },
};

const CHEI_RO = Object.keys(ro).sort();

/** Numele din `{acolade}`, ca set sortat. */
function parametri(text: string): string[] {
  return [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();
}

/** Indicii sloturilor `<0>…</0>`, ca set sortat. */
function sloturi(text: string): string[] {
  return [...new Set([...text.matchAll(/<(\d+)>/g)].map((m) => m[1]))].sort();
}

/** Toate variantele unui mesaj, fie text simplu, fie plural. */
function variante(m: Mesaj): string[] {
  return typeof m === 'string' ? [m] : Object.values(m as Plural);
}

describe('registrul de limbi', () => {
  it('nu are limbă înregistrată care să scape de test', () => {
    for (const l of LIMBI) {
      expect(PACHETE[l], `limba „${l}" e în LIMBI dar nu în testul de paritate`).toBeDefined();
    }
  });

  it('folosește pentru fiecare limbă înregistrată eticheta din TAG', () => {
    for (const l of LIMBI) expect(PACHETE[l].tag).toBe(TAG[l]);
  });
});

describe.each(Object.entries(PACHETE))('pachetul de mesaje „%s"', (limba, pachet) => {
  const categorii = new Intl.PluralRules(pachet.tag).resolvedOptions().pluralCategories;

  it('are exact aceleași chei ca româna', () => {
    expect(Object.keys(pachet.mesaje).sort()).toEqual(CHEI_RO);
  });

  it('nu are nicio valoare goală', () => {
    for (const [cheie, mesaj] of Object.entries(pachet.mesaje)) {
      for (const v of variante(mesaj)) {
        expect(v.trim().length, `${limba}/${cheie}`).toBeGreaterThan(0);
      }
    }
  });

  it('acoperă toate categoriile de plural ale limbii', () => {
    for (const [cheie, mesaj] of Object.entries(pachet.mesaje)) {
      if (typeof mesaj === 'string') continue;
      // categoriile vin din Intl, nu dintr-o listă scrisă de mână: adaugi „pl"
      // și testul îți spune singur că-i lipsește „many"
      expect(Object.keys(mesaj).sort(), `${limba}/${cheie}`).toEqual([...categorii].sort());
    }
  });

  it('folosește exact parametrii din română', () => {
    for (const cheie of CHEI_RO) {
      const asteptat = parametri(variante((ro as Record<string, Mesaj>)[cheie]).join(' '));
      const primit = parametri(variante(pachet.mesaje[cheie]).join(' '));
      expect(primit, `${limba}/${cheie}`).toEqual(asteptat);
    }
  });

  it('folosește exact sloturile de text bogat din română', () => {
    for (const cheie of CHEI_RO) {
      const asteptat = sloturi(variante((ro as Record<string, Mesaj>)[cheie]).join(' '));
      const primit = sloturi(variante(pachet.mesaje[cheie]).join(' '));
      // un slot lipsă înseamnă un `<b>` care rămâne gol pe ecran
      expect(primit, `${limba}/${cheie}`).toEqual(asteptat);
    }
  });

  it('închide fiecare slot pe care îl deschide', () => {
    for (const [cheie, mesaj] of Object.entries(pachet.mesaje)) {
      for (const v of variante(mesaj)) {
        for (const idx of sloturi(v)) {
          expect(v, `${limba}/${cheie}/<${idx}>`).toContain(`</${idx}>`);
        }
      }
    }
  });
});

describe('engleza nu e o traducere pe jumătate', () => {
  it('nu are diacritice românești rămase', () => {
    const scapate = Object.entries(en)
      .flatMap(([cheie, mesaj]) => variante(mesaj).map((v) => [cheie, v] as const))
      .filter(([, v]) => /[ăâîșțĂÂÎȘȚ]/.test(v));
    expect(scapate).toEqual([]);
  });

  it('chiar diferă de română acolo unde e o propoziție', () => {
    // Etichetele scurte pot coincide legitim („Rower", „Stepper", „+30s"), dar o
    // propoziție întreagă identică înseamnă că a fost copiată, nu tradusă.
    // Se numără doar cuvintele: „🎵 Tempo {tempo} — {faza}" e identic în ambele
    // limbi fiindcă e aproape tot simboluri și parametri, și e în regulă așa.
    const cuvinte = (text: string) =>
      text
        .replace(/\{[^}]*\}/g, ' ')
        .replace(/<\/?\d+>/g, ' ')
        .match(/\p{L}+/gu) ?? [];
    const copiate = CHEI_RO.filter((cheie) => {
      const r = variante((ro as Record<string, Mesaj>)[cheie]).join(' ');
      const e = variante((en as Record<string, Mesaj>)[cheie]).join(' ');
      return r === e && cuvinte(r).length > 4;
    });
    expect(copiate).toEqual([]);
  });
});
