import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { EXERCISE_IDS } from '@/data/catalog/ids';
import { exercitii } from '@/data/catalog/exercises';
import { catalogRo } from '@/data/catalog/text/ro';
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

const PACHETE: Record<string, PachetCatalog> = { ro: catalogRo };

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
});
