/**
 * Import de istoric de greutate din fișiere exportate de aplicații de
 * cântar (Freefit / Fitdays / etc.). Aceste aplicații nu au API public,
 * dar pot exporta CSV. Parserul e tolerant: găsește singur coloanele
 * de dată și greutate după numele lor (en/ro) sau după formatul valorii.
 */
export interface ParsedWeight {
  data: string; // ISO date
  greutate: number; // kg
}

const DATE_HEADERS = /^(date|time|data|dată|datetime|measure ?time|timp|created)/i;
const WEIGHT_HEADERS = /^(weight|greutate|body ?weight|masa|weight ?\(kg\)|kg)/i;

export function parseFreefitCsv(text: string): ParsedWeight[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const sep = detectSeparator(lines[0]);
  const header = splitCsvLine(lines[0], sep).map((h) => h.replace(/^"|"$/g, '').trim());
  let dateIdx = header.findIndex((h) => DATE_HEADERS.test(h));
  let weightIdx = header.findIndex((h) => WEIGHT_HEADERS.test(h));

  const rows = lines.slice(1).map((l) => splitCsvLine(l, sep).map((c) => c.replace(/^"|"$/g, '').trim()));

  // fără antet recunoscut: ghicim după conținut
  if (dateIdx === -1 || weightIdx === -1) {
    const sample = rows[0] ?? [];
    if (dateIdx === -1) dateIdx = sample.findIndex((c) => parseDate(c) !== null);
    if (weightIdx === -1)
      weightIdx = sample.findIndex((c, i) => i !== dateIdx && plausibleWeight(parseNumber(c)));
  }
  if (dateIdx === -1 || weightIdx === -1) return [];

  const out: ParsedWeight[] = [];
  for (const cells of rows) {
    const d = parseDate(cells[dateIdx] ?? '');
    const w = parseNumber(cells[weightIdx] ?? '');
    if (d && plausibleWeight(w)) out.push({ data: d, greutate: Math.round(w * 10) / 10 });
  }
  // deduplicare pe zi (păstrăm ultima măsurătoare din zi)
  const byDay = new Map<string, ParsedWeight>();
  for (const p of out) byDay.set(p.data.slice(0, 10), p);
  return [...byDay.values()].sort((a, b) => a.data.localeCompare(b.data));
}

function detectSeparator(headerLine: string): string {
  const counts: [string, number][] = [',', ';', '\t'].map((s) => [s, headerLine.split(s).length]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][0];
}

function splitCsvLine(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') inQ = !inQ;
    else if (ch === sep && !inQ) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function parseNumber(s: string): number {
  return parseFloat(s.replace(',', '.'));
}

function plausibleWeight(n: number): boolean {
  return Number.isFinite(n) && n >= 25 && n <= 350;
}

/** Acceptă yyyy-MM-dd, dd.MM.yyyy, dd/MM/yyyy, MM/dd/yyyy (dezambiguizat), cu oră opțională. */
export function parseDate(s: string): string | null {
  if (!s) return null;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})([T ].*)?$/);
  if (iso) return toIso(+iso[1], +iso[2], +iso[3]);
  const eu = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (eu) {
    let [, a, b, y] = eu.map(Number) as unknown as [number, number, number, number];
    // dd.MM sau MM/dd — dacă prima parte > 12, sigur e ziua; altfel presupunem european (dd.MM)
    if (a > 12) return toIso(y, b, a);
    if (b > 12) return toIso(y, a, b);
    return toIso(y, b, a);
  }
  return null;
}

function toIso(y: number, m: number, d: number): string | null {
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T08:00:00.000Z`;
}
