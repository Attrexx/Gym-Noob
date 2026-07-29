import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, evaluateAchievements, weeklyStreak, type AchievementContext } from '@/domain/achievements';

const ctx = (over: Partial<AchievementContext>): AchievementContext => ({
  sesiuniTerminate: 0,
  zileAntrenament: [],
  streakSaptamani: 0,
  volumTotalKg: 0,
  kcalTotal: 0,
  apaTotalMl: 0,
  prCount: 0,
  kgSlabite: 0,
  sesiuniCuApaLaTinta: 0,
  exercitiiDistincte: 0,
  oreLaSala: 0,
  ...over,
});

describe('realizări', () => {
  it('id-urile sunt unice', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('nimic deblocat la context gol', () => {
    expect(evaluateAchievements(ctx({}))).toEqual([]);
  });
  it('prima sesiune deblochează „Primul pas"', () => {
    expect(evaluateAchievements(ctx({ sesiuniTerminate: 1 }))).toEqual(['prima-sesiune']);
  });
  it('pragurile de volum sunt cumulative', () => {
    const ids = evaluateAchievements(ctx({ volumTotalKg: 15000 }));
    expect(ids).toContain('volum-1t');
    expect(ids).toContain('volum-10t');
    expect(ids).not.toContain('volum-100t');
  });
});

describe('streak săptămânal', () => {
  it('0 fără antrenamente', () => {
    expect(weeklyStreak([], new Date('2026-07-29'))).toBe(0);
  });
  it('numără săptămânile consecutive', () => {
    // miercuri 29 iulie 2026; antrenamente în săptămâna curentă și cele 2 precedente
    const zile = ['2026-07-28', '2026-07-22', '2026-07-15'];
    expect(weeklyStreak(zile, new Date('2026-07-29'))).toBe(3);
  });
  it('săptămâna curentă fără antrenament nu rupe streak-ul', () => {
    const zile = ['2026-07-22', '2026-07-15'];
    expect(weeklyStreak(zile, new Date('2026-07-29'))).toBe(2);
  });
  it('gaura de o săptămână rupe streak-ul', () => {
    const zile = ['2026-07-28', '2026-07-08'];
    expect(weeklyStreak(zile, new Date('2026-07-29'))).toBe(1);
  });
});
