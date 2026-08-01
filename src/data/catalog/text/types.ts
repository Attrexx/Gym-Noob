import type { ExerciseCategory, ExerciseDef, MuscleGroup } from '@/data/types';
import type { ExerciseId } from '../ids';

/**
 * Catalogul, împărțit în „structură" și „text".
 *
 * Structura (MET, mușchi, echipament, dificultate, animație, variante) e una
 * singură și nu depinde de limbă — dacă ar fi duplicată pe limbi, cifrele ar
 * ajunge inevitabil să difere între ele.
 *
 * Textul vine pe limbă, indexat după id. Fiind `Record<XId, …>`, un exercițiu
 * nou strică la compilare toate limbile deodată, până când sunt completate.
 */

/** Un exercițiu, fără textul lui. */
export type ExerciseCore = Omit<
  ExerciseDef,
  'nume' | 'echipamentNume' | 'forma' | 'utilizare' | 'greseli' | 'ponturi'
> & { id: ExerciseId };

/** Partea scrisă a unui exercițiu. */
export type TextExercitiu = Pick<
  ExerciseDef,
  'nume' | 'echipamentNume' | 'forma' | 'utilizare' | 'greseli' | 'ponturi'
>;

/**
 * Tot textul catalogului, pentru o limbă.
 *
 * Fiecare `Record<XId, …>` e exhaustiv: dacă apare un id nou în `ids.ts`,
 * TypeScript se plânge în TOATE limbile până sunt completate. Asta e plasa
 * care ține cele două (și, mai târziu, N) limbi sincronizate.
 */
export interface PachetCatalog {
  exercitii: Record<ExerciseId, TextExercitiu>;
  grupeMuschi: Record<MuscleGroup, string>;
  dificultate: Record<1 | 2 | 3, string>;
  categorii: Record<ExerciseCategory, { nume: string; descriere: string }>;
}
