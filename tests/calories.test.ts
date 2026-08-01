import { describe, expect, it } from 'vitest';
import {
  durataSetSec,
  kcalKeytel,
  kcalMet,
  kcalSet,
  metBanda,
  metDinPutere,
  metMediuBanda,
} from '@/domain/calories';

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

describe('MET din puterea aparatului (rower, bicicletă)', () => {
  it('fără putere înseamnă efort de repaus', () => {
    expect(metDinPutere(0, 80)).toBe(1);
    expect(metDinPutere(-50, 80)).toBe(1);
    expect(metDinPutere(200, 0)).toBe(1);
  });

  it('200 W la 80 kg cade într-o zonă plauzibilă de vâslit intens', () => {
    const met = metDinPutere(200, 80);
    expect(met).toBeGreaterThan(8);
    expect(met).toBeLessThan(16);
  });

  it('crește cu wații și scade cu greutatea corporală', () => {
    expect(metDinPutere(250, 80)).toBeGreaterThan(metDinPutere(150, 80));
    // același efort mecanic e relativ mai ușor pentru un corp mai mare
    expect(metDinPutere(200, 100)).toBeLessThan(metDinPutere(200, 70));
  });

  it('dus prin kcalSet dă calorii pe oră rezonabile', () => {
    const kcal = kcalSet({ met: metDinPutere(200, 80), greutateKg: 80, secunde: 3600 });
    expect(kcal).toBeGreaterThan(500);
    expect(kcal).toBeLessThan(1200);
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

describe('MET banda de alergare (ACSM)', () => {
  it('mers 5 km/h pe plat ≈ 3,4 MET', () => {
    expect(metBanda(5, 0)).toBeGreaterThan(3.1);
    expect(metBanda(5, 0)).toBeLessThan(3.7);
  });
  it('înclinația crește semnificativ efortul', () => {
    expect(metBanda(5.5, 12)).toBeGreaterThan(metBanda(5.5, 0) * 2);
  });
  it('alergare 10 km/h ≈ 10,5 MET (formula de alergare)', () => {
    expect(metBanda(10, 0)).toBeGreaterThan(9.5);
    expect(metBanda(10, 0)).toBeLessThan(11.5);
  });
  it('media ponderată pe segmente', () => {
    // 60 s la setarea A, 60 s la setarea B → media aritmetică a MET-urilor
    const a = metBanda(5, 0);
    const b = metBanda(8, 5);
    const mediu = metMediuBanda(
      [
        { startSec: 0, viteza: 5, inclinatie: 0 },
        { startSec: 60, viteza: 8, inclinatie: 5 },
      ],
      120,
    );
    expect(mediu).toBeCloseTo((a + b) / 2, 1);
  });
  it('segmente cu același start (schimbări rapide) nu strică media', () => {
    const mediu = metMediuBanda(
      [
        { startSec: 0, viteza: 5, inclinatie: 0 },
        { startSec: 0, viteza: 6, inclinatie: 0 },
        { startSec: 0, viteza: 7, inclinatie: 0 },
      ],
      100,
    );
    expect(mediu).toBeCloseTo(metBanda(7, 0), 1);
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
