import { beforeAll, describe, expect, it } from 'vitest';
import {
  areCategorie,
  categorii,
  categoriiExercitiu,
  exercitii,
  getExercise,
  grupeMuschi,
} from '../src/data/catalog/exercises';
import { programe, getProgram, minuteEstimate, numaraExercitii } from '../src/data/catalog/programs';
import { starterTemplates } from '../src/data/catalog/starterTemplates';
import { incarcaLimba } from '../src/i18n/store';

// catalogul își ia textul din pachetul limbii, deci trebuie încărcată una
beforeAll(async () => {
  await incarcaLimba('ro');
});

describe('catalogul de exerciții', () => {
  it('are id-uri unice', () => {
    const ids = exercitii().map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('are conținut complet pe fiecare exercițiu', () => {
    for (const e of exercitii()) {
      expect(e.nume.length, e.id).toBeGreaterThan(2);
      expect(e.echipamentNume.length, e.id).toBeGreaterThan(2);
      expect(e.muschi.length, e.id).toBeGreaterThan(0);
      expect(e.forma.length, e.id).toBeGreaterThan(0);
      expect(e.utilizare.length, e.id).toBeGreaterThan(0);
      expect(e.ponturi.length, e.id).toBeGreaterThan(0);
      expect(e.met, e.id).toBeGreaterThan(1);
      expect(e.met, e.id).toBeLessThan(20);
    }
  });

  it('folosește doar grupe musculare cunoscute', () => {
    const grupe = new Set(grupeMuschi().map((g) => g.id));
    for (const e of exercitii()) {
      for (const m of [...e.muschi, ...(e.muschiSecundari ?? [])]) {
        expect(grupe.has(m), `${e.id} → ${m}`).toBe(true);
      }
    }
  });

  it('are variante care trimit spre exerciții existente și nu spre ele însele', () => {
    for (const e of exercitii()) {
      for (const v of e.variante ?? []) {
        expect(getExercise(v), `${e.id} → ${v}`).toBeDefined();
        expect(v, `${e.id} se referă la sine`).not.toBe(e.id);
      }
    }
  });

  it('pune fiecare exercițiu în cel puțin o categorie cunoscută', () => {
    const cunoscute = new Set(categorii().map((c) => c.id));
    for (const e of exercitii()) {
      const cat = categoriiExercitiu(e);
      expect(cat.length, e.id).toBeGreaterThan(0);
      for (const c of cat) expect(cunoscute.has(c), `${e.id} → ${c}`).toBe(true);
    }
  });

  it('clasifică exercițiile cu greutatea corpului drept calistenice', () => {
    expect(areCategorie(getExercise('tractiuni-supinat')!, 'calistenice')).toBe(true);
    expect(areCategorie(getExercise('flotari-diamant')!, 'calistenice')).toBe(true);
    expect(areCategorie(getExercise('fondari-paralele-libere')!, 'calistenice')).toBe(true);
    // aparatele nu sunt calistenice
    expect(areCategorie(getExercise('presa-picioare')!, 'calistenice')).toBe(false);
    expect(areCategorie(getExercise('presa-picioare')!, 'aparate')).toBe(true);
    // ridicările mari sunt marcate explicit
    expect(areCategorie(getExercise('genuflexiuni-haltera')!, 'powerlifting')).toBe(true);
    expect(areCategorie(getExercise('genuflexiuni-haltera')!, 'greutati_libere')).toBe(true);
    // întinderile sunt mobilitate, nu calistenice
    expect(areCategorie(getExercise('intindere-finala')!, 'mobilitate')).toBe(true);
    expect(areCategorie(getExercise('intindere-finala')!, 'calistenice')).toBe(false);
  });

  it('are cel puțin un exercițiu în fiecare categorie', () => {
    for (const c of categorii()) {
      expect(exercitii().some((e) => areCategorie(e, c.id)), c.id).toBe(true);
    }
  });
});

describe('programele celebre', () => {
  it('au id-uri unice', () => {
    const ids = programe().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('trimit doar spre exerciții existente în catalog', () => {
    for (const p of programe()) {
      for (const w of p.antrenamente) {
        for (const it of w.items) {
          expect(getExercise(it.exerciseId), `${p.id}/${w.id} → ${it.exerciseId}`).toBeDefined();
        }
      }
    }
  });

  it('au antrenamente cu id-uri unice și cel puțin 4 exerciții', () => {
    for (const p of programe()) {
      const ids = p.antrenamente.map((w) => w.id);
      expect(new Set(ids).size, p.id).toBe(ids.length);
      expect(p.antrenamente.length, p.id).toBeGreaterThan(1);
      for (const w of p.antrenamente) {
        expect(w.items.length, `${p.id}/${w.id}`).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it('au seturi, pauze și ținte plauzibile', () => {
    for (const p of programe()) {
      for (const w of p.antrenamente) {
        for (const it of w.items) {
          const ex = getExercise(it.exerciseId)!;
          expect(it.seturi, `${p.id}/${w.id}/${it.exerciseId}`).toBeGreaterThan(0);
          expect(it.seturi, `${p.id}/${w.id}/${it.exerciseId}`).toBeLessThanOrEqual(10);
          expect(it.pauzaSec, `${p.id}/${w.id}/${it.exerciseId}`).toBeGreaterThanOrEqual(0);
          expect(it.pauzaSec, `${p.id}/${w.id}/${it.exerciseId}`).toBeLessThanOrEqual(300);
          if (ex.masura === 'timp') {
            expect(it.durataSec, `${p.id}/${w.id}/${it.exerciseId} fără durată`).toBeGreaterThan(0);
          } else if (it.repetari !== undefined) {
            // repetari lipsă = AMRAP, e intenționat
            expect(it.repetari, `${p.id}/${w.id}/${it.exerciseId}`).toBeGreaterThan(0);
            expect(it.repetari, `${p.id}/${w.id}/${it.exerciseId}`).toBeLessThanOrEqual(30);
          }
        }
      }
    }
  });

  it('explică seturile AMRAP într-o notiță', () => {
    for (const p of programe()) {
      for (const w of p.antrenamente) {
        for (const it of w.items) {
          const ex = getExercise(it.exerciseId)!;
          if (ex.masura === 'repetari' && it.repetari === undefined) {
            expect(it.notite, `${p.id}/${w.id}/${it.exerciseId}`).toBeTruthy();
          }
        }
      }
    }
  });

  it('au textele explicative completate', () => {
    for (const p of programe()) {
      expect(p.subtitlu.length, p.id).toBeGreaterThan(20);
      expect(p.descriere.length, p.id).toBeGreaterThan(80);
      expect(p.origine.length, p.id).toBeGreaterThan(5);
      expect(p.saptamana.length, p.id).toBeGreaterThan(1);
      expect(p.progresie.length, p.id).toBeGreaterThan(0);
      expect(p.obiective.length, p.id).toBeGreaterThan(0);
      expect(p.etichete.length, p.id).toBeGreaterThan(0);
    }
  });

  it('estimează durate realiste pentru fiecare antrenament', () => {
    for (const p of programe()) {
      for (const w of p.antrenamente) {
        const min = minuteEstimate(w.items);
        expect(min, `${p.id}/${w.id}`).toBeGreaterThan(15);
        expect(min, `${p.id}/${w.id}`).toBeLessThan(150);
      }
    }
  });

  it('acoperă programele cerute și se pot regăsi după id', () => {
    for (const id of ['ppl', 'wendler-531', 'upper-lower', 'full-body-3x', 'calistenice-start', 'powerbuilding-periodizat']) {
      expect(getProgram(id), id).toBeDefined();
    }
    expect(getProgram('nu-exista')).toBeUndefined();
  });

  it('numără corect exercițiile dintr-un program', () => {
    const p = getProgram('powerbuilding-periodizat')!;
    expect(p.antrenamente).toHaveLength(5);
    expect(numaraExercitii(p)).toBe(p.antrenamente.reduce((a, w) => a + w.items.length, 0));
    // rutinele originale au 7 exerciții pe antrenament
    for (const w of p.antrenamente) expect(w.items.length, w.id).toBe(7);
  });
});

describe('șabloanele de start', () => {
  it('trimit doar spre exerciții existente', () => {
    for (const t of starterTemplates(1)) {
      for (const it of t.items) {
        expect(getExercise(it.exerciseId), `${t.nume} → ${it.exerciseId}`).toBeDefined();
      }
    }
  });
});
