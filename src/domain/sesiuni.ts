import type { Session, SetLog, TemplateItem } from '@/data/types';

/**
 * Calcule pure despre o sesiune încheiată: cât ai stat la sală, ce ai
 * făcut data trecută, și cum transformi ce ai făcut într-un plan.
 * Fără React, fără Dexie — doar aritmetică.
 */

export interface ImpartireTimp {
  /** de la intrare la ieșire, ceasul de pe perete */
  totalSec: number;
  /** cât ai lucrat efectiv (cronometrul sesiunii) */
  activSec: number;
  /** cât ai stat cu sesiunea pe pauză */
  pauzaSec: number;
}

/**
 * Timpul petrecut la sală. `durataActivaSec` e deja pe rând; totalul îl
 * scoatem din început→sfârșit, iar pauza e diferența. Nu ținem o coloană
 * separată pentru pauză tocmai ca să nu poată ieși din sincron cu restul.
 */
export function impartireTimp(
  s: Pick<Session, 'inceput' | 'sfarsit' | 'durataActivaSec'>,
  acum?: string,
): ImpartireTimp {
  const start = Date.parse(s.inceput);
  const capat = Date.parse(s.sfarsit ?? acum ?? s.inceput);
  const activSec = Math.max(0, Math.round(s.durataActivaSec || 0));
  if (Number.isNaN(start) || Number.isNaN(capat)) return { totalSec: activSec, activSec, pauzaSec: 0 };
  // ceasul telefonului se mai poate da peste cap: totalul nu are voie
  // să fie mai mic decât timpul activ deja măsurat
  const totalSec = Math.max(activSec, Math.round((capat - start) / 1000));
  return { totalSec, activSec, pauzaSec: totalSec - activSec };
}

/** „18:05" — ora de pe perete, nu data. */
export function fmtOra(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Mediana — mai rezistentă la un set ratat decât media. */
function mediana(valori: number[]): number | undefined {
  const v = valori.filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
  if (v.length === 0) return undefined;
  const mij = Math.floor(v.length / 2);
  return v.length % 2 ? v[mij] : (v[mij - 1] + v[mij]) / 2;
}

const la05 = (n: number) => Math.round(n * 2) / 2;

/**
 * Transformă seturile chiar făcute într-un plan reutilizabil.
 *
 * Pornim de la ce s-a întâmplat, nu de la ce era plănuit — dacă ai plănuit
 * 3×10 cu 40 kg și ai făcut 4 seturi cu 45, planul salvat trebuie să spună
 * 45. Din planul original păstrăm doar ce nu se vede în jurnal: pauza,
 * tempo-ul și notițele.
 */
export function planDinSeturi(logs: SetLog[], planOriginal: TemplateItem[] = []): TemplateItem[] {
  const grupe = new Map<string, SetLog[]>();
  // ordonăm cronologic ca ordinea exercițiilor din plan să fie ordinea reală
  for (const l of [...logs].sort((a, b) => a.data.localeCompare(b.data))) {
    const lista = grupe.get(l.exerciseId);
    if (lista) lista.push(l);
    else grupe.set(l.exerciseId, [l]);
  }

  const items: TemplateItem[] = [];
  for (const [exerciseId, seturi] of grupe) {
    const original = planOriginal.find((i) => i.exerciseId === exerciseId);
    const peTimp = seturi.some((s) => s.durataSec !== undefined && s.repetari === undefined);
    const item: TemplateItem = {
      exerciseId,
      seturi: seturi.length,
      pauzaSec: original?.pauzaSec ?? (peTimp ? 60 : 90),
    };
    if (original?.tempo) item.tempo = original.tempo;
    if (original?.notite) item.notite = original.notite;

    if (peTimp) {
      const d = mediana(seturi.map((s) => s.durataSec ?? 0));
      if (d) item.durataSec = Math.round(d);
      const v = mediana(seturi.map((s) => s.viteza).filter((n): n is number => n !== undefined));
      if (v) item.viteza = Math.round(v * 10) / 10;
      const inc = mediana(seturi.map((s) => s.inclinatie).filter((n): n is number => n !== undefined));
      if (inc !== undefined) item.inclinatie = Math.round(inc * 10) / 10;
    } else {
      const r = mediana(seturi.map((s) => s.repetari).filter((n): n is number => n !== undefined));
      // fără repetări = AMRAP; păstrăm sensul, deci și notița care îl explică
      if (r) item.repetari = Math.round(r);
      else item.notite = item.notite ?? 'Cât poți (AMRAP) — până nu mai iese o repetare curată.';
      const g = mediana(seturi.map((s) => s.greutate).filter((n): n is number => n !== undefined));
      if (g !== undefined) item.greutate = la05(g);
    }
    items.push(item);
  }
  return items;
}

export interface UltimaPerformanta {
  sessionId: number;
  data: string;
  seturi: SetLog[];
  aparatModel?: string;
}

/**
 * Ce ai făcut ultima oară la exercițiul ăsta — toate seturile din cea mai
 * recentă sesiune ANTERIOARĂ. Sesiunea curentă e exclusă: reamintirea are
 * rost doar dacă vine din altă zi, altfel îți arată propriul set de acum.
 */
export function ultimaPerformanta(logs: SetLog[], sessionIdCurent?: number): UltimaPerformanta | null {
  const vechi = logs.filter((l) => l.sessionId !== sessionIdCurent);
  if (vechi.length === 0) return null;
  const ultim = vechi.reduce((a, b) => (a.data >= b.data ? a : b));
  const seturi = vechi
    .filter((l) => l.sessionId === ultim.sessionId)
    .sort((a, b) => a.setIndex - b.setIndex);
  return {
    sessionId: ultim.sessionId,
    data: ultim.data,
    seturi,
    aparatModel: seturi.find((s) => s.aparatModel)?.aparatModel,
  };
}

// `descrieSetLog` a plecat în `src/i18n/descrieri.ts` — lipea text, nu calcula
// nimic, iar `domain/` rămâne matematică pură, fără dependențe de limbă.

/**
 * Setările de reluat data viitoare: exact ce a mers ultima dată, ca să nu
 * trebuiască să ții tu minte pe ce treaptă era banda.
 */
export function setariDeReluat(u: UltimaPerformanta): Partial<TemplateItem> {
  const cuGreutate = [...u.seturi].reverse().find((s) => s.greutate !== undefined);
  const cuViteza = [...u.seturi].reverse().find((s) => s.viteza !== undefined);
  const ultim = u.seturi[u.seturi.length - 1];
  const out: Partial<TemplateItem> = {};
  if (cuGreutate?.greutate !== undefined) out.greutate = cuGreutate.greutate;
  if (ultim?.repetari !== undefined) out.repetari = ultim.repetari;
  if (ultim?.durataSec !== undefined && ultim.repetari === undefined) out.durataSec = ultim.durataSec;
  if (cuViteza?.viteza !== undefined) out.viteza = cuViteza.viteza;
  if (cuViteza?.inclinatie !== undefined) out.inclinatie = cuViteza.inclinatie;
  return out;
}
