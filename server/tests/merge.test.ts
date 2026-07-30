import { describe, expect, it } from 'vitest';
import { CLOCK_SLACK_MS, acceptaDeletion, acceptaUpsert, clampTimestamp } from '../src/sync/merge.ts';

const ACUM = Date.parse('2026-07-29T12:00:00.000Z');

describe('clampTimestamp', () => {
  it('normalizează la formatul fix toISOString', () => {
    expect(clampTimestamp('2025-06-01T10:00:00Z', ACUM)).toBe('2025-06-01T10:00:00.000Z');
    expect(clampTimestamp('2025-06-01T12:00:00+02:00', ACUM)).toBe('2025-06-01T10:00:00.000Z');
  });
  it('timestamp invalid → acum', () => {
    expect(clampTimestamp('n-am ceas', ACUM)).toBe(new Date(ACUM).toISOString());
    expect(clampTimestamp(undefined, ACUM)).toBe(new Date(ACUM).toISOString());
  });
  it('viitorul îndepărtat e tras înapoi la acum + 5 min', () => {
    expect(clampTimestamp('2030-01-01T00:00:00.000Z', ACUM)).toBe(new Date(ACUM + CLOCK_SLACK_MS).toISOString());
  });
  it('viitorul apropiat (sub toleranță) trece', () => {
    const aproape = new Date(ACUM + 60_000).toISOString();
    expect(clampTimestamp(aproape, ACUM)).toBe(aproape);
  });
});

describe('acceptaUpsert — strict mai nou câștigă', () => {
  const t1 = '2026-01-01T00:00:00.000Z';
  const t2 = '2026-01-02T00:00:00.000Z';
  it('rând nou (nu există) → da', () => expect(acceptaUpsert(undefined, t1)).toBe(true));
  it('mai vechi → nu', () => expect(acceptaUpsert(t2, t1)).toBe(false));
  it('egal → nu (rămâne ce e pe server)', () => expect(acceptaUpsert(t1, t1)).toBe(false));
  it('mai nou → da', () => expect(acceptaUpsert(t1, t2)).toBe(true));
});

describe('acceptaDeletion — egalitatea favorizează ștergerea', () => {
  const t1 = '2026-01-01T00:00:00.000Z';
  const t2 = '2026-01-02T00:00:00.000Z';
  it('rând necunoscut → da (tombstone preventiv)', () => expect(acceptaDeletion(undefined, t1)).toBe(true));
  it('ștergere mai veche decât editarea → nu (învie editarea)', () => expect(acceptaDeletion(t2, t1)).toBe(false));
  it('egal → da', () => expect(acceptaDeletion(t1, t1)).toBe(true));
  it('mai nouă → da', () => expect(acceptaDeletion(t1, t2)).toBe(true));
});
