import { describe, expect, it } from 'vitest';
import {
  bmr,
  tdee,
  bmi,
  bmiCategorie,
  bugetZilnic,
  clampRitm,
  deficitZilnic,
  saptamaniPanaLaTinta,
  tintaApaSesiune,
  tintaApaZi,
  varstaDinData,
} from '@/domain/goals';

describe('BMR Mifflin-St Jeor', () => {
  it('bărbat 100kg / 180cm / 35 ani', () => {
    // 10*100 + 6.25*180 - 5*35 + 5 = 1955
    expect(bmr('M', 100, 180, 35)).toBe(1955);
  });
  it('femeie 70kg / 165cm / 30 ani', () => {
    // 10*70 + 6.25*165 - 5*30 - 161 = 1420.25 → 1420
    expect(bmr('F', 70, 165, 30)).toBe(1420);
  });
});

describe('TDEE', () => {
  it('aplică factorul de activitate', () => {
    expect(tdee(2000, 'sedentar')).toBe(2400);
    expect(tdee(2000, 'moderat')).toBe(3100);
  });
});

describe('BMI', () => {
  it('calculează și clasifică', () => {
    expect(bmi(100, 180)).toBe(30.9);
    // clasificatorul întoarce id-uri; textul îl pune interfața prin t()
    expect(bmiCategorie(30.9)).toBe('obezitate1');
    expect(bmiCategorie(22)).toBe('normal');
  });
});

describe('ritm și deficit', () => {
  it('limitează ritmul la max 1 kg/săpt', () => {
    expect(clampRitm(2)).toBe(1);
    expect(clampRitm(-1)).toBe(0);
    expect(clampRitm(0.5)).toBe(0.5);
  });
  it('deficit pentru 0.5 kg/săpt ≈ 550 kcal/zi', () => {
    expect(deficitZilnic(0.5)).toBe(550);
  });
});

describe('buget zilnic', () => {
  const base = {
    sex: 'M' as const,
    greutate: 100,
    inaltime: 180,
    varsta: 35,
    activitate: 'usor' as const,
    ritmKgSaptamana: 0.5,
  };
  it('adaugă caloriile arse la antrenament în bugetul zilei', () => {
    const fara = bugetZilnic({ ...base, arseAntrenament: 0 });
    const cu = bugetZilnic({ ...base, arseAntrenament: 400 });
    expect(cu.aportMaximAzi - fara.aportMaximAzi).toBe(400);
    expect(fara.aportMaximAzi).toBe(fara.tdee - fara.deficit);
  });
  it('nu coboară sub pragul de siguranță', () => {
    const b = bugetZilnic({
      sex: 'F',
      greutate: 50,
      inaltime: 155,
      varsta: 60,
      activitate: 'sedentar',
      ritmKgSaptamana: 1,
      arseAntrenament: 0,
    });
    expect(b.aportMaximAzi).toBeGreaterThanOrEqual(b.pragMinim);
    expect(b.pragMinim).toBeGreaterThanOrEqual(1200);
  });
});

describe('ETA obiectiv', () => {
  it('estimează săptămânile rămase', () => {
    expect(saptamaniPanaLaTinta(100, 90, 0.5)).toBe(20);
    expect(saptamaniPanaLaTinta(90, 90, 0.5)).toBeNull();
    expect(saptamaniPanaLaTinta(100, 90, 0)).toBeNull();
  });
});

describe('apă', () => {
  it('ținte rezonabile', () => {
    expect(tintaApaZi(100)).toBe(3300);
    expect(tintaApaSesiune(100)).toBe(700);
    expect(tintaApaSesiune(40)).toBe(500); // minim
  });
});

describe('vârsta', () => {
  it('calculează corect înainte și după ziua de naștere', () => {
    expect(varstaDinData('1990-06-15', new Date('2026-06-14'))).toBe(35);
    expect(varstaDinData('1990-06-15', new Date('2026-06-15'))).toBe(36);
  });
});
