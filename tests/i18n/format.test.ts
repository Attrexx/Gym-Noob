import { beforeAll, describe, expect, it } from 'vitest';
import { incarcaLimba } from '@/i18n/store';
import { categoriePlural, data, km, nr, relativZile, viteza } from '@/i18n/format';
import { t } from '@/i18n/runtime';

/**
 * Notă: datele NU se compară exact — ieșirea CLDR se schimbă între versiuni de
 * ICU/Node și ar face suita fragilă. Verificăm forma, nu octeții.
 */

describe('formatare în română', () => {
  beforeAll(async () => {
    await incarcaLimba('ro');
  });

  it('nr(): întregii fără zecimale, restul cu una, virgulă zecimală', () => {
    expect(nr(40)).toBe('40');
    expect(nr(9.5)).toBe('9,5');
    expect(nr(0.5)).toBe('0,5');
    // fără grupare: 1000 rămâne „1000", nu „1.000"
    expect(nr(1000)).toBe('1000');
    expect(nr(12345)).toBe('12345');
  });

  it('nr() cu zecimale fixe', () => {
    expect(nr(3.1, 2)).toBe('3,10');
    expect(nr(10, 1)).toBe('10,0');
  });

  it('km(): metri sub 1 km, altfel două zecimale fixe', () => {
    expect(km(800)).toBe('800 m');
    expect(km(1250)).toBe('1,25 km');
    expect(km(3100)).toBe('3,10 km');
  });

  it('viteza(): mereu o zecimală', () => {
    expect(viteza(9.5)).toBe('9,5');
    expect(viteza(10)).toBe('10,0');
  });

  it('data(): stiluri diferite, toate în română', () => {
    const zi = '2026-07-29T10:00:00.000Z';
    expect(data(zi)).toMatch(/29\.07\.2026/);
    expect(data(zi, 'ziLunaLung')).toContain('iulie');
    expect(data(zi, 'zilnic')).toContain('miercuri');
    expect(data(zi, 'lunaAn')).toMatch(/iulie.*2026/);
  });

  it('relativZile(): cuvinte, nu cifre, unde limba le are', () => {
    expect(relativZile(1)).toBe('ieri');
    expect(relativZile(2)).toBe('alaltăieri');
    expect(relativZile(3)).toBe('acum 3 zile');
    // regula lui „de" vine gratis din CLDR
    expect(relativZile(30)).toBe('acum 30 de zile');
  });
});

describe('reguli de plural (canar pentru ICU complet)', () => {
  beforeAll(async () => {
    await incarcaLimba('ro');
  });

  // dacă Node e compilat fără ICU complet, tabelul ăsta pică primul și explică de ce
  it.each([
    [0, 'few'],
    [1, 'one'],
    [2, 'few'],
    [19, 'few'],
    [20, 'other'],
    [98, 'other'],
    [100, 'other'],
    [101, 'few'],
    [125, 'other'],
  ])('categoriePlural(%i) = %s', (n, asteptat) => {
    expect(categoriePlural(n)).toBe(asteptat);
  });

  it('acordul cu „de" din română, prin t()', () => {
    expect(t('comun.exercitii', { n: 1 })).toBe('1 exercițiu');
    expect(t('comun.exercitii', { n: 5 })).toBe('5 exerciții');
    expect(t('comun.exercitii', { n: 19 })).toBe('19 exerciții');
    expect(t('comun.exercitii', { n: 20 })).toBe('20 de exerciții');
    expect(t('comun.exercitii', { n: 101 })).toBe('101 exerciții');
    expect(t('comun.exercitii', { n: 125 })).toBe('125 de exerciții');
    // schimbare asumată față de vechiul pluralRo: CLDR spune „0 exerciții"
    expect(t('comun.exercitii', { n: 0 })).toBe('0 exerciții');
  });
});

describe('interpolare', () => {
  beforeAll(async () => {
    await incarcaLimba('ro');
  });

  it('numerele trec prin nr(), deci respectă separatorul zecimal', () => {
    expect(t('comun.exercitii', { n: 3 })).toBe('3 exerciții');
  });

  it('o cheie lipsă întoarce cheia, nu aruncă', () => {
    // @ts-expect-error — testăm exact cazul pe care tipurile îl interzic
    expect(t('nu.exista.cheia')).toBe('nu.exista.cheia');
  });
});
