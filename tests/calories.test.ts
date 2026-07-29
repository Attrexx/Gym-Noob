import { describe, expect, it } from 'vitest';
import { durataSetSec, kcalKeytel, kcalMet, kcalSet } from '@/domain/calories';

describe('kcal MET', () => {
  it('formula de bază: MET 8, 100kg, 30 min ≈ 420 kcal', () => {
    expect(kcalMet(8, 100, 30 * 60)).toBeCloseTo(420, 0);
  });
  it('RPE modulează efortul', () => {
    const moderat = kcalMet(6, 90, 600);
    expect(kcalMet(6, 90, 600, 6)).toBeCloseTo(moderat, 5);
    expect(kcalMet(6, 90, 600, 9)).toBeGreaterThan(moderat);
    expect(kcalMet(6, 90, 600, 2)).toBeLessThan(moderat);
    // limitele de siguranță
    expect(kcalMet(6, 90, 600, 10)).toBeLessThanOrEqual(moderat * 1.3 + 0.001);
  });
});

describe('durata unui set', () => {
  it('estimează din repetări', () => {
    expect(durataSetSec(10)).toBe(45); // 10*3 + 15
  });
  it('respectă tempo-ul explicit', () => {
    expect(durataSetSec(10, '3-1-2')).toBe(75); // 10*6 + 15
  });
});

describe('Keytel (puls)', () => {
  it('bărbat 90kg, 140 bpm, 35 ani, 30 min — ordin de mărime corect', () => {
    const kcal = kcalKeytel('M', 140, 90, 35, 30 * 60);
    expect(kcal).toBeGreaterThan(250);
    expect(kcal).toBeLessThan(450);
  });
  it('nu returnează negativ la puls mic', () => {
    expect(kcalKeytel('F', 60, 50, 20, 600)).toBeGreaterThanOrEqual(0);
  });
});

describe('kcalSet — alegerea formulei', () => {
  it('folosește pulsul când există și e relevant', () => {
    const cuPuls = kcalSet({ met: 3.5, greutateKg: 90, secunde: 600, pulsMediu: 150, sex: 'M', varsta: 35 });
    const faraPuls = kcalSet({ met: 3.5, greutateKg: 90, secunde: 600 });
    expect(cuPuls).not.toBeCloseTo(faraPuls, 1);
  });
  it('ignoră pulsul sub 90 (nu e efort aerob)', () => {
    const v = kcalSet({ met: 3.5, greutateKg: 90, secunde: 600, pulsMediu: 70, sex: 'M', varsta: 35 });
    expect(v).toBeCloseTo(kcalMet(3.5, 90, 600), 5);
  });
});
