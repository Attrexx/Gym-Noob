import { beforeAll, describe, expect, it } from 'vitest';
import { incarcaLimba } from '@/i18n/store';
import { categoriePlural } from '@/i18n/format';
import { t } from '@/i18n/runtime';

/**
 * Urmașul lui `tests/text.test.ts`.
 *
 * Regula cu „de" nu mai e scrisă de mână (`pluralRo`), ci vine din CLDR prin
 * `Intl.PluralRules`. Cazurile de mai jos sunt exact cele din testul vechi —
 * dacă trec, înseamnă că înlocuirea nu a schimbat româna.
 *
 * Singura abatere asumată: n = 0. Vechiul `pluralRo` zicea „0 DE exerciții";
 * CLDR îl pune la categoria `few`, deci „0 exerciții" — cum se și citește.
 */

const EX = (n: number) => t('comun.exercitii', { n });

describe('acordul cu „de" din română', () => {
  beforeAll(async () => {
    await incarcaLimba('ro');
  });

  it('folosește singularul pentru 1', () => {
    expect(EX(1)).toBe('1 exercițiu');
  });

  it('nu pune „de" pentru 2-19', () => {
    expect(EX(2)).toBe('2 exerciții');
    expect(EX(7)).toBe('7 exerciții');
    expect(EX(19)).toBe('19 exerciții');
  });

  it('pune „de" pentru 20-99 și pentru sutele rotunde', () => {
    expect(EX(20)).toBe('20 de exerciții');
    expect(EX(98)).toBe('98 de exerciții');
    expect(EX(100)).toBe('100 de exerciții');
  });

  it('reia regula peste 100', () => {
    expect(EX(101)).toBe('101 exerciții');
    expect(EX(112)).toBe('112 exerciții');
    expect(EX(125)).toBe('125 de exerciții');
  });

  it('zero merge după CLDR, nu după vechea regulă', () => {
    expect(EX(0)).toBe('0 exerciții');
  });

  it('și celelalte mesaje cu plural respectă aceeași regulă', () => {
    expect(t('comun.antrenamente', { n: 1 })).toBe('1 antrenament');
    expect(t('comun.antrenamente', { n: 3 })).toBe('3 antrenamente');
    expect(t('comun.antrenamente', { n: 20 })).toBe('20 de antrenamente');
    expect(t('comun.programeCelebre', { n: 6 })).toBe('6 programe celebre');
  });
});

describe('categoriile CLDR (canar pentru un Node fără ICU complet)', () => {
  beforeAll(async () => {
    await incarcaLimba('ro');
  });

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
});
