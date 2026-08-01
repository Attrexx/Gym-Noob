import type { ExerciseDef, MuscleGroup, SetLog } from '@/data/types';

/**
 * Motorul de sugestii din timpul sesiunii.
 *
 * Reguli (în ordinea priorității):
 *  1. Echilibru muscular — dacă azi ai lucrat mult o grupă și deloc
 *     antagonistul ei, propunem antagonistul.
 *  2. Grupe neatinse recent — o grupă nelucrată în ultimele N sesiuni.
 *  3. Progresie — un exercițiu făcut des, unde poți crește greutatea.
 *  4. Final de sesiune — abdomen/cardio ușor ca încheiere.
 */

const ANTAGONIST: Partial<Record<MuscleGroup, MuscleGroup>> = {
  piept: 'spate',
  spate: 'piept',
  biceps: 'triceps',
  triceps: 'biceps',
  cvadriceps: 'ischiogambieri',
  ischiogambieri: 'cvadriceps',
  abdomen: 'lombari',
  lombari: 'abdomen',
};

/**
 * De ce propunem exercițiul. Structurat, nu propoziție gata făcută: motorul
 * ăsta e matematică pură, iar textul (și grupa musculară, care are și ea nume
 * traduse) îl compune interfața cu `t()`.
 */
export type MotivSugestie =
  | { tip: 'antagonist'; grupa: MuscleGroup; anti: MuscleGroup; seturi: number }
  | { tip: 'neatins'; grupa: MuscleGroup }
  | { tip: 'finalAbdomen' }
  | { tip: 'finalCardio' }
  | { tip: 'incalzire' };

export interface Suggestion {
  exercise: ExerciseDef;
  motiv: MotivSugestie;
}

export function suggestNext(params: {
  catalog: ExerciseDef[];
  seturiAzi: SetLog[];
  /** id-urile exercițiilor deja în planul sesiunii */
  inPlan: string[];
  /** grupele lucrate în ultimele sesiuni (pentru regula 2) */
  grupeRecente: MuscleGroup[];
  /** minute scurse din sesiune */
  minuteScurse: number;
  dificultateMax?: number;
}): Suggestion[] {
  const { catalog, seturiAzi, inPlan, grupeRecente, minuteScurse } = params;
  const dificultateMax = params.dificultateMax ?? 2;
  const byId = new Map(catalog.map((e) => [e.id, e]));
  const out: Suggestion[] = [];
  const propuse = new Set<string>();

  const disponibile = catalog.filter(
    (e) => e.dificultate <= dificultateMax && !inPlan.includes(e.id) && !seturiAzi.some((s) => s.exerciseId === e.id),
  );

  // seturi pe grupă azi
  const seturiPeGrupa = new Map<MuscleGroup, number>();
  for (const s of seturiAzi) {
    const ex = byId.get(s.exerciseId);
    if (!ex) continue;
    for (const g of ex.muschi) seturiPeGrupa.set(g, (seturiPeGrupa.get(g) ?? 0) + 1);
  }

  const adauga = (ex: ExerciseDef | undefined, motiv: MotivSugestie) => {
    if (ex && !propuse.has(ex.id)) {
      propuse.add(ex.id);
      out.push({ exercise: ex, motiv });
    }
  };

  // 1. antagonist neglijat azi
  for (const [grupa, seturi] of [...seturiPeGrupa.entries()].sort((a, b) => b[1] - a[1])) {
    if (seturi < 3) continue;
    const anti = ANTAGONIST[grupa];
    if (!anti || (seturiPeGrupa.get(anti) ?? 0) > 0) continue;
    adauga(disponibile.find((e) => e.muschi[0] === anti), { tip: 'antagonist', grupa, anti, seturi });
  }

  // 2. grupă neatinsă în sesiunile recente
  const toateGrupele: MuscleGroup[] = ['piept', 'spate', 'umeri', 'cvadriceps', 'ischiogambieri', 'fesieri', 'abdomen'];
  for (const g of toateGrupele) {
    if (out.length >= 3) break;
    if (grupeRecente.includes(g) || (seturiPeGrupa.get(g) ?? 0) > 0) continue;
    adauga(disponibile.find((e) => e.muschi[0] === g), { tip: 'neatins', grupa: g });
  }

  // 3. final de sesiune → core / cardio ușor
  if (minuteScurse >= 40 && out.length < 3) {
    adauga(disponibile.find((e) => e.muschi[0] === 'abdomen'), { tip: 'finalAbdomen' });
    adauga(disponibile.find((e) => e.tip === 'cardio' && e.dificultate === 1), { tip: 'finalCardio' });
  }

  // fallback: măcar o propunere pentru începutul sesiunii
  if (out.length === 0) {
    adauga(disponibile.find((e) => e.tip === 'cardio' && e.dificultate === 1), { tip: 'incalzire' });
  }

  return out.slice(0, 3);
}
