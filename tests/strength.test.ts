import { describe, expect, it } from 'vitest';
import { epley1Rm, greutatePentruReps } from '@/domain/oneRm';
import { bodyFatNavy } from '@/domain/bodyFat';
import { detectPrs } from '@/domain/pr';
import type { SetLog } from '@/data/types';

describe('1RM Epley', () => {
  it('100kg × 10 reps → 133.3', () => {
    expect(epley1Rm(100, 10)).toBe(133.3);
  });
  it('1 rep = greutatea însăși', () => {
    expect(epley1Rm(120, 1)).toBe(120);
  });
  it('invers: greutate pentru reps', () => {
    expect(greutatePentruReps(133.3, 10)).toBeCloseTo(100, 0);
  });
});

describe('grăsime corporală US Navy', () => {
  it('bărbat: talie 100, gât 40, 180cm — în intervalul realist', () => {
    const v = bodyFatNavy('M', 180, 100, 40);
    expect(v).not.toBeNull();
    expect(v!).toBeGreaterThan(20);
    expect(v!).toBeLessThan(35);
  });
  it('femeie: cere și șoldul', () => {
    expect(bodyFatNavy('F', 165, 80, 34)).toBeNull();
    const v = bodyFatNavy('F', 165, 80, 34, 100);
    expect(v).not.toBeNull();
  });
  it('null la date lipsă', () => {
    expect(bodyFatNavy('M', 180)).toBeNull();
  });
});

const log = (over: Partial<SetLog>): SetLog => ({
  sessionId: 1,
  profileId: 1,
  exerciseId: 'x',
  setIndex: 1,
  kcal: 5,
  data: '2026-01-01T10:00:00Z',
  greutate: 50,
  repetari: 10,
  ...over,
});

describe('detectare PR', () => {
  it('fără istoric nu există PR (prima încercare nu e record)', () => {
    expect(detectPrs(log({ greutate: 100 }), [])).toEqual([]);
  });
  it('detectează greutate + 1RM noi', () => {
    const istoric = [log({ greutate: 50, repetari: 10 }), log({ greutate: 60, repetari: 5 })];
    const hits = detectPrs(log({ greutate: 65, repetari: 5 }), istoric);
    const tipuri = hits.map((h) => h.tip);
    expect(tipuri).toContain('greutate');
    expect(tipuri).toContain('1rm');
    expect(tipuri).not.toContain('repetari');
  });
  it('nu dă PR la egalare', () => {
    const istoric = [log({ greutate: 60, repetari: 10 })];
    expect(detectPrs(log({ greutate: 60, repetari: 10 }), istoric)).toEqual([]);
  });
});
