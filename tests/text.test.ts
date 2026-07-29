import { describe, expect, it } from 'vitest';
import { pluralRo } from '../src/design/components';

describe('acordul cu „de" din română', () => {
  it('folosește singularul pentru 1', () => {
    expect(pluralRo(1, 'exercițiu', 'exerciții')).toBe('1 exercițiu');
  });

  it('nu pune „de" pentru 2-19', () => {
    expect(pluralRo(2, 'exercițiu', 'exerciții')).toBe('2 exerciții');
    expect(pluralRo(7, 'exercițiu', 'exerciții')).toBe('7 exerciții');
    expect(pluralRo(19, 'exercițiu', 'exerciții')).toBe('19 exerciții');
  });

  it('pune „de" pentru 20-99 și pentru sutele rotunde', () => {
    expect(pluralRo(20, 'exercițiu', 'exerciții')).toBe('20 de exerciții');
    expect(pluralRo(98, 'exercițiu', 'exerciții')).toBe('98 de exerciții');
    expect(pluralRo(100, 'exercițiu', 'exerciții')).toBe('100 de exerciții');
    expect(pluralRo(0, 'exercițiu', 'exerciții')).toBe('0 de exerciții');
  });

  it('reia regula peste 100', () => {
    expect(pluralRo(101, 'exercițiu', 'exerciții')).toBe('101 exerciții');
    expect(pluralRo(112, 'exercițiu', 'exerciții')).toBe('112 exerciții');
    expect(pluralRo(125, 'exercițiu', 'exerciții')).toBe('125 de exerciții');
  });
});
