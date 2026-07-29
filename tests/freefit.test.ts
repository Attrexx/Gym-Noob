import { describe, expect, it } from 'vitest';
import { parseDate, parseFreefitCsv } from '@/domain/freefit';

describe('parseDate', () => {
  it('ISO', () => {
    expect(parseDate('2026-07-29')).toMatch(/^2026-07-29/);
  });
  it('european dd.MM.yyyy', () => {
    expect(parseDate('29.07.2026')).toMatch(/^2026-07-29/);
    expect(parseDate('29/07/2026 08:15')).toMatch(/^2026-07-29/);
  });
  it('american MM/dd/yyyy dezambiguizat prin >12', () => {
    expect(parseDate('07/29/2026')).toMatch(/^2026-07-29/);
  });
  it('respins ce nu e dată', () => {
    expect(parseDate('abc')).toBeNull();
    expect(parseDate('99.99.2026')).toBeNull();
  });
});

describe('parseFreefitCsv', () => {
  it('CSV standard cu antet englezesc', () => {
    const csv = 'Time,Weight(kg),BMI\n2026-07-01 08:00,102.4,31.6\n2026-07-08 08:05,101.1,31.2';
    const rows = parseFreefitCsv(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0].greutate).toBe(102.4);
    expect(rows[0].data).toMatch(/^2026-07-01/);
  });
  it('separator punct-și-virgulă, virgulă zecimală, antet românesc', () => {
    const csv = 'Data;Greutate;Observatii\n01.07.2026;102,4;dimineata\n08.07.2026;101,1;';
    const rows = parseFreefitCsv(csv);
    expect(rows).toHaveLength(2);
    expect(rows[1].greutate).toBe(101.1);
  });
  it('deduplică pe zi păstrând ultima măsurătoare', () => {
    const csv = 'Date,Weight\n2026-07-01,102.5\n2026-07-01,102.1';
    const rows = parseFreefitCsv(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0].greutate).toBe(102.1);
  });
  it('ignoră rânduri fără greutate plauzibilă', () => {
    const csv = 'Date,Weight\n2026-07-01,102.5\n2026-07-02,0\n2026-07-03,999';
    expect(parseFreefitCsv(csv)).toHaveLength(1);
  });
  it('ghicește coloanele fără antet recunoscut', () => {
    const csv = 'A,B\n2026-07-01,95.5\n2026-07-02,95.1';
    const rows = parseFreefitCsv(csv);
    expect(rows).toHaveLength(2);
  });
});
