import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { ARTICLE_IDS, EXERCISE_IDS, PROGRAM_IDS } from '@/data/catalog/ids';
import { exercitii } from '@/data/catalog/exercises';
import { PROGRAME_CORE } from '@/data/catalog/programs';
import { catalogRo } from '@/data/catalog/text/ro';
import { catalogEn } from '@/data/catalog/text/en';
import { incarcaLimba } from '@/i18n/store';
import type { PachetCatalog } from '@/data/catalog/text/types';

/**
 * Două lucruri diferite se verifică aici:
 *
 * 1. Că separarea „structură / text" nu a schimbat nicio literă. Fixture-ul
 *    `catalog-inainte.json` e catalogul fotografiat înainte de mutare; dacă
 *    reconstrucția e identică cu el, mutarea a fost curată. Fixture-ul se
 *    poate șterge după ce engleza e scrisă și ai încredere în structură.
 *
 * 2. Că fiecare limbă acoperă tot registrul de id-uri, fără orfani.
 */

const PACHETE: Record<string, PachetCatalog> = { ro: catalogRo, en: catalogEn };

beforeAll(async () => {
  await incarcaLimba('ro');
});

describe('mutarea textului nu a schimbat catalogul', () => {
  it('reconstruiește exact exercițiile de dinainte', () => {
    const inainte = JSON.parse(readFileSync('tests/fixtures/catalog-inainte.json', 'utf8')) as {
      exercitii: unknown[];
    };
    // JSON.parse/stringify normalizează ordinea cheilor, deci comparăm structural
    expect(JSON.parse(JSON.stringify(exercitii()))).toEqual(inainte.exercitii);
  });
});

describe.each(Object.entries(PACHETE))('pachetul de catalog „%s"', (limba, p) => {
  it('acoperă fiecare exercițiu din registru, fără orfani', () => {
    for (const id of EXERCISE_IDS) {
      const tx = p.exercitii[id];
      expect(tx, `${limba}/${id}`).toBeDefined();
      expect(tx.nume.length, `${limba}/${id}/nume`).toBeGreaterThan(2);
      expect(tx.echipamentNume.length, `${limba}/${id}/echipamentNume`).toBeGreaterThan(2);
      for (const camp of ['forma', 'utilizare', 'ponturi'] as const) {
        expect(tx[camp].length, `${limba}/${id}/${camp}`).toBeGreaterThan(0);
      }
    }
    expect(Object.keys(p.exercitii)).toHaveLength(EXERCISE_IDS.length);
  });

  it('are taxonomia completă', () => {
    expect(Object.keys(p.grupeMuschi).length).toBeGreaterThanOrEqual(13);
    expect(Object.keys(p.dificultate)).toHaveLength(3);
    expect(Object.keys(p.categorii)).toHaveLength(6);
    for (const [id, c] of Object.entries(p.categorii)) {
      expect(c.nume.length, `${limba}/${id}/nume`).toBeGreaterThan(2);
      expect(c.descriere.length, `${limba}/${id}/descriere`).toBeGreaterThan(10);
    }
  });

  it('acoperă fiecare program și articol din registru', () => {
    for (const id of PROGRAM_IDS) {
      const pr = p.programe[id];
      expect(pr, `${limba}/${id}`).toBeDefined();
      for (const camp of ['saptamana', 'progresie'] as const) {
        expect(pr[camp].length, `${limba}/${id}/${camp}`).toBeGreaterThan(0);
      }
    }
    expect(Object.keys(p.programe)).toHaveLength(PROGRAM_IDS.length);
    for (const id of ARTICLE_IDS) {
      const a = p.articole[id];
      expect(a, `${limba}/${id}`).toBeDefined();
      expect(a.continut.length, `${limba}/${id}/continut`).toBeGreaterThan(2);
    }
    expect(Object.keys(p.articole)).toHaveLength(ARTICLE_IDS.length);
  });

  /**
   * `notite` e POZIȚIONAL: intrarea `i` aparține exercițiului `i` din structură.
   * Un array mai scurt sau mai lung nu strică nimic la compilare, dar lipește
   * nota greșită pe exercițiul greșit — exact genul de eroare care se vede abia
   * pe telefon, la sală.
   */
  it('are notițele programelor aliniate cu structura', () => {
    for (const core of PROGRAME_CORE) {
      const text = p.programe[core.id];
      expect(text.antrenamente.length, `${limba}/${core.id}/antrenamente`).toBe(
        core.antrenamente.length,
      );
      core.antrenamente.forEach((w, i) => {
        expect(text.antrenamente[i].notite.length, `${limba}/${core.id}/${w.id}/notite`).toBe(
          w.items.length,
        );
      });
    }
  });

  it('păstrează convenția de bullet „• " din articole', () => {
    for (const id of ARTICLE_IDS) {
      for (const paragraf of p.articole[id].continut) {
        // ArticlePage grupează în listă exact rândurile care încep cu „• ";
        // un bullet fără spațiu după el ar deveni text normal, în silence
        if (paragraf.trimStart().startsWith('•')) {
          expect(paragraf, `${limba}/${id}`).toMatch(/^• \S/);
        }
      }
    }
  });
});

describe('catalogul în engleză nu e o traducere pe jumătate', () => {
  /** Nume care au voie să fie identice: sunt englezisme și în română. */
  const NUME_PERMISE_IDENTICE = ['Burpee'];

  const toateTexteleEn = () => {
    const out: string[] = [];
    for (const tx of Object.values(catalogEn.exercitii)) {
      out.push(tx.nume, tx.echipamentNume, ...tx.forma, ...tx.utilizare, ...tx.greseli, ...tx.ponturi);
    }
    for (const pr of Object.values(catalogEn.programe)) {
      out.push(pr.nume, pr.subtitlu, pr.origine, pr.descriere, pr.frecventa, pr.durata);
      out.push(...pr.etichete, ...pr.saptamana, ...pr.progresie, ...(pr.note ?? []));
      for (const w of pr.antrenamente) {
        out.push(w.nume, w.descriere ?? '', w.faza ?? '', ...w.notite.filter((n) => n !== undefined));
      }
    }
    for (const a of Object.values(catalogEn.articole)) out.push(a.titlu, a.rezumat, ...a.continut);
    for (const s of catalogEn.sabloaneStart) out.push(s.nume, s.descriere, ...s.etichete);
    out.push(...catalogEn.sfaturi, ...catalogEn.incurajariSet, ...catalogEn.incurajariFinal);
    out.push(...Object.values(catalogEn.grupeMuschi), ...Object.values(catalogEn.obiective));
    for (const c of Object.values(catalogEn.categorii)) out.push(c.nume, c.descriere);
    return out;
  };

  it('nu are diacritice românești rămase nicăieri', () => {
    const scapate = toateTexteleEn().filter((t) => /[ăâîșțĂÂÎȘȚ]/.test(t));
    expect(scapate).toEqual([]);
  });

  it('are nume de exerciții chiar diferite de cele românești', () => {
    const copiate = EXERCISE_IDS.filter(
      (id) =>
        catalogEn.exercitii[id].nume === catalogRo.exercitii[id].nume &&
        !NUME_PERMISE_IDENTICE.includes(catalogEn.exercitii[id].nume),
    );
    expect(copiate).toEqual([]);
  });

  it('nu a lăsat virgula zecimală românească în cifre', () => {
    // „1,6-2 g" e corect în română și greșit în engleză; „1.6-2 g" e invers
    const cuVirgula = toateTexteleEn().filter((t) => /\d,\d/.test(t));
    expect(cuVirgula).toEqual([]);
  });
});
