import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { SetLog, TemplateItem } from '@/data/types';
import {
  fmtOra,
  impartireTimp,
  planDinSeturi,
  setariDeReluat,
  ultimaPerformanta,
} from '@/domain/sesiuni';
// `descrieSetLog` a plecat din domain/ în i18n/ — lipea text, nu calcula nimic.
// Aserțiile de mai jos au rămas identice octet cu octet: ele sunt dovada că
// mutarea nu a schimbat româna.
import { descrieSetLog } from '@/i18n/descrieri';
import { incarcaLimba } from '@/i18n/store';

beforeAll(async () => {
  await incarcaLimba('ro');
});

function log(p: Partial<SetLog> & { exerciseId: string; data: string }): SetLog {
  return {
    sessionId: 1,
    profileId: 1,
    setIndex: 1,
    kcal: 10,
    ...p,
  } as SetLog;
}

describe('împărțirea timpului la sală', () => {
  it('total = activ + pauză', () => {
    const t = impartireTimp({
      inceput: '2026-08-01T18:00:00.000Z',
      sfarsit: '2026-08-01T19:20:00.000Z',
      durataActivaSec: 58 * 60,
    });
    expect(t.totalSec).toBe(80 * 60);
    expect(t.activSec).toBe(58 * 60);
    expect(t.pauzaSec).toBe(22 * 60);
    expect(t.activSec + t.pauzaSec).toBe(t.totalSec);
  });

  it('fără pauze, tot timpul e activ', () => {
    const t = impartireTimp({
      inceput: '2026-08-01T18:00:00.000Z',
      sfarsit: '2026-08-01T18:30:00.000Z',
      durataActivaSec: 30 * 60,
    });
    expect(t.pauzaSec).toBe(0);
  });

  it('pauza nu poate ieși negativă dacă ceasul telefonului o ia razna', () => {
    const t = impartireTimp({
      inceput: '2026-08-01T18:00:00.000Z',
      sfarsit: '2026-08-01T18:10:00.000Z',
      durataActivaSec: 30 * 60, // mai mult decât intervalul: ceas dat înapoi
    });
    expect(t.pauzaSec).toBe(0);
    expect(t.totalSec).toBe(30 * 60);
  });

  it('o sesiune neîncheiată se măsoară până la momentul dat', () => {
    const t = impartireTimp(
      { inceput: '2026-08-01T18:00:00.000Z', durataActivaSec: 600 },
      '2026-08-01T18:15:00.000Z',
    );
    expect(t.totalSec).toBe(900);
    expect(t.pauzaSec).toBe(300);
  });

  it('date invalide nu produc NaN', () => {
    const t = impartireTimp({ inceput: 'nu-i o dată', sfarsit: 'nici asta', durataActivaSec: 120 });
    expect(t).toEqual({ totalSec: 120, activSec: 120, pauzaSec: 0 });
  });
});

describe('ora afișată', () => {
  it('formatează ora locală cu două cifre', () => {
    const d = new Date(2026, 7, 1, 8, 5);
    expect(fmtOra(d.toISOString())).toBe('08:05');
  });
  it('fără dată, o liniuță', () => {
    expect(fmtOra(undefined)).toBe('—');
    expect(fmtOra('aiurea')).toBe('—');
  });
});

describe('planul construit din seturile făcute', () => {
  it('grupează pe exercițiu și numără seturile chiar făcute', () => {
    const items = planDinSeturi([
      log({ exerciseId: 'impins-piept', data: '2026-08-01T18:05:00.000Z', repetari: 10, greutate: 40 }),
      log({ exerciseId: 'impins-piept', data: '2026-08-01T18:09:00.000Z', repetari: 10, greutate: 45 }),
      log({ exerciseId: 'impins-piept', data: '2026-08-01T18:13:00.000Z', repetari: 8, greutate: 45 }),
    ]);
    expect(items).toHaveLength(1);
    expect(items[0].seturi).toBe(3);
  });

  it('ia mediana, nu primul set — încălzirea nu devine plan', () => {
    const items = planDinSeturi([
      log({ exerciseId: 'genuflexiuni', data: '2026-08-01T18:00:00.000Z', repetari: 10, greutate: 20 }),
      log({ exerciseId: 'genuflexiuni', data: '2026-08-01T18:05:00.000Z', repetari: 10, greutate: 60 }),
      log({ exerciseId: 'genuflexiuni', data: '2026-08-01T18:10:00.000Z', repetari: 10, greutate: 60 }),
    ]);
    expect(items[0].greutate).toBe(60);
    expect(items[0].repetari).toBe(10);
  });

  it('păstrează ordinea în care ai făcut exercițiile', () => {
    const items = planDinSeturi([
      log({ exerciseId: 'b', data: '2026-08-01T18:20:00.000Z', repetari: 8, greutate: 30 }),
      log({ exerciseId: 'a', data: '2026-08-01T18:00:00.000Z', repetari: 8, greutate: 30 }),
      log({ exerciseId: 'b', data: '2026-08-01T18:25:00.000Z', repetari: 8, greutate: 30 }),
    ]);
    expect(items.map((i) => i.exerciseId)).toEqual(['a', 'b']);
  });

  it('exercițiile pe timp păstrează durata și setările benzii', () => {
    const items = planDinSeturi([
      log({ exerciseId: 'banda', data: '2026-08-01T18:00:00.000Z', durataSec: 1500, viteza: 9.5, inclinatie: 2 }),
    ]);
    expect(items[0]).toMatchObject({ durataSec: 1500, viteza: 9.5, inclinatie: 2, pauzaSec: 60 });
    expect(items[0].repetari).toBeUndefined();
  });

  it('preia pauza, tempo-ul și notița din planul original', () => {
    const original: TemplateItem[] = [
      { exerciseId: 'tractiuni', seturi: 3, pauzaSec: 150, tempo: '3-1-2', notite: 'cu priză largă' },
    ];
    const items = planDinSeturi(
      [log({ exerciseId: 'tractiuni', data: '2026-08-01T18:00:00.000Z', repetari: 6, greutate: 0 })],
      original,
    );
    expect(items[0]).toMatchObject({ pauzaSec: 150, tempo: '3-1-2', notite: 'cu priză largă' });
  });

  it('un set fără repetări rămâne AMRAP și capătă notița care explică', () => {
    const items = planDinSeturi([log({ exerciseId: 'flotari', data: '2026-08-01T18:00:00.000Z' })]);
    expect(items[0].repetari).toBeUndefined();
    expect(items[0].notite).toMatch(/AMRAP/i);
  });

  it('fără seturi, niciun plan', () => {
    expect(planDinSeturi([])).toEqual([]);
  });
});

describe('ce ai făcut data trecută', () => {
  const istoric = [
    log({ exerciseId: 'impins', data: '2026-07-25T18:00:00.000Z', sessionId: 5, repetari: 10, greutate: 40, setIndex: 1 }),
    log({ exerciseId: 'impins', data: '2026-07-25T18:05:00.000Z', sessionId: 5, repetari: 10, greutate: 40, setIndex: 2 }),
    log({ exerciseId: 'impins', data: '2026-07-29T18:00:00.000Z', sessionId: 7, repetari: 8, greutate: 45, setIndex: 1 }),
    log({ exerciseId: 'impins', data: '2026-08-01T18:00:00.000Z', sessionId: 9, repetari: 8, greutate: 50, setIndex: 1 }),
  ];

  it('sare peste sesiunea curentă — vrem memoria, nu ecoul', () => {
    const u = ultimaPerformanta(istoric, 9);
    expect(u?.sessionId).toBe(7);
    expect(u?.seturi[0].greutate).toBe(45);
  });

  it('fără sesiune curentă dată, ia pur și simplu ultima', () => {
    expect(ultimaPerformanta(istoric)?.sessionId).toBe(9);
  });

  it('exclude DOAR sesiunea curentă, nu tot ce e după ea', () => {
    // sesiunea 9 e mai nouă decât 7, deci rămâne cea mai recentă „altă" sesiune
    expect(ultimaPerformanta(istoric, 7)?.sessionId).toBe(9);
  });

  it('întoarce toate seturile din acea sesiune, în ordinea lor', () => {
    const doarDouaSesiuni = [istoric[0], istoric[1], istoric[3]];
    const u = ultimaPerformanta(doarDouaSesiuni, 9);
    expect(u?.sessionId).toBe(5);
    expect(u?.seturi.map((s) => s.setIndex)).toEqual([1, 2]);
  });

  it('la primul contact cu exercițiul nu există „data trecută"', () => {
    expect(ultimaPerformanta([], 1)).toBeNull();
    expect(ultimaPerformanta([istoric[3]], 9)).toBeNull();
  });

  it('scoate la iveală modelul aparatului folosit atunci', () => {
    const u = ultimaPerformanta([
      log({
        exerciseId: 'banda',
        data: '2026-07-29T18:00:00.000Z',
        sessionId: 3,
        durataSec: 1500,
        aparatModel: 'Star Trac 8TR',
      }),
    ]);
    expect(u?.aparatModel).toBe('Star Trac 8TR');
  });
});

describe('reluarea setărilor de data trecută', () => {
  it('ia greutatea și repetările ultimului set', () => {
    const u = ultimaPerformanta([
      log({ exerciseId: 'x', data: '2026-07-29T18:00:00.000Z', sessionId: 3, repetari: 10, greutate: 40, setIndex: 1 }),
      log({ exerciseId: 'x', data: '2026-07-29T18:05:00.000Z', sessionId: 3, repetari: 8, greutate: 45, setIndex: 2 }),
    ])!;
    expect(setariDeReluat(u)).toMatchObject({ greutate: 45, repetari: 8 });
  });

  it('pentru bandă reia viteza și înclinația, nu greutatea', () => {
    const u = ultimaPerformanta([
      log({ exerciseId: 'banda', data: '2026-07-29T18:00:00.000Z', sessionId: 3, durataSec: 1500, viteza: 9.5, inclinatie: 2 }),
    ])!;
    expect(setariDeReluat(u)).toMatchObject({ viteza: 9.5, inclinatie: 2, durataSec: 1500 });
  });
});

describe('descrierea unui set', () => {
  it('la fier: repetări, kilograme și efortul', () => {
    expect(descrieSetLog(log({ exerciseId: 'x', data: 'd', repetari: 10, greutate: 40, rpe: 7 }))).toBe(
      '10 rep. · 40 kg · RPE 7',
    );
  });

  it('la aparat: minute, setări și ce a măsurat el', () => {
    const text = descrieSetLog(
      log({ exerciseId: 'banda', data: 'd', durataSec: 1500, viteza: 9.5, inclinatie: 2, distantaM: 3100 }),
    );
    expect(text).toContain('25 min');
    expect(text).toContain('9,5 km/h');
    expect(text).toContain('3,10 km');
  });
});

/**
 * Aceleași cifre, în engleză. Rostul e separatorul zecimal: aceeași funcție,
 * fără nicio ramură pe limbă în cod, scrie „9.5" în loc de „9,5" — dovada că
 * formatarea vine din `Intl`, nu din text scris de mână.
 */
describe('descrierea unui set, în engleză', () => {
  beforeAll(async () => {
    await incarcaLimba('en');
  });
  afterAll(async () => {
    await incarcaLimba('ro');
  });

  it('la fier: reps, kilograme și efortul', () => {
    expect(descrieSetLog(log({ exerciseId: 'x', data: 'd', repetari: 10, greutate: 40, rpe: 7 }))).toBe(
      '10 reps · 40 kg · RPE 7',
    );
  });

  it('la aparat: punctul zecimal, nu virgula', () => {
    const text = descrieSetLog(
      log({ exerciseId: 'banda', data: 'd', durataSec: 1500, viteza: 9.5, inclinatie: 2, distantaM: 3100 }),
    );
    expect(text).toContain('25 min');
    expect(text).toContain('9.5 km/h');
    expect(text).toContain('3.10 km');
  });
});
