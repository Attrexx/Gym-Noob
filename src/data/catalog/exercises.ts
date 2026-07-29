import type { ExerciseCategory, ExerciseDef, MuscleGroup } from '../types';
import { EXERCITII_1 } from './exercises-cardio-impins-tras';
import { EXERCITII_2 } from './exercises-umeri-brate-picioare-core';
import { EXERCITII_3 } from './exercises-haltera-calistenice';

export const EXERCITII: ExerciseDef[] = [...EXERCITII_1, ...EXERCITII_2, ...EXERCITII_3];

const byId = new Map(EXERCITII.map((e) => [e.id, e]));

export function getExercise(id: string): ExerciseDef | undefined {
  return byId.get(id);
}

export const GRUPE_MUSCHI: { id: MuscleGroup; nume: string }[] = [
  { id: 'piept', nume: 'Piept' },
  { id: 'spate', nume: 'Spate' },
  { id: 'umeri', nume: 'Umeri' },
  { id: 'biceps', nume: 'Biceps' },
  { id: 'triceps', nume: 'Triceps' },
  { id: 'abdomen', nume: 'Abdomen' },
  { id: 'fesieri', nume: 'Fesieri' },
  { id: 'cvadriceps', nume: 'Cvadriceps' },
  { id: 'ischiogambieri', nume: 'Ischiogambieri' },
  { id: 'gambe', nume: 'Gambe' },
  { id: 'lombari', nume: 'Lombari' },
  { id: 'antebrate', nume: 'Antebrațe' },
  { id: 'cardio', nume: 'Cardio' },
];

export function numeGrupa(id: MuscleGroup): string {
  return GRUPE_MUSCHI.find((g) => g.id === id)?.nume ?? id;
}

export const DIFICULTATE_LABEL: Record<number, string> = {
  1: 'Pentru noobi',
  2: 'Intermediar',
  3: 'Avansat',
};

// ── Categorii (subcategorii de filtrare în bibliotecă) ──────────────

export const CATEGORII: { id: ExerciseCategory; nume: string; emoji: string; descriere: string }[] = [
  {
    id: 'calistenice',
    nume: 'Calistenice',
    emoji: '🤸',
    descriere: 'Doar greutatea corpului: bara fixă, paralele, sol. Zero abonament necesar.',
  },
  {
    id: 'greutati_libere',
    nume: 'Greutăți libere',
    emoji: '🏋️',
    descriere: 'Haltere, gantere, kettlebell, mingi, benzi. Mai greu de învățat, mai mult mușchi la final.',
  },
  {
    id: 'aparate',
    nume: 'Aparate & cabluri',
    emoji: '⚙️',
    descriere: 'Traseu ghidat, risc mic — locul unde începe orice noob.',
  },
  {
    id: 'powerlifting',
    nume: 'Ridicările mari',
    emoji: '💪',
    descriere: 'Genuflexiuni, îndreptări, împins, presă militară — baza tuturor programelor celebre.',
  },
  { id: 'cardio', nume: 'Cardio', emoji: '🏃', descriere: 'Inimă, plămâni, calorii arse.' },
  {
    id: 'mobilitate',
    nume: 'Mobilitate',
    emoji: '🧘',
    descriere: 'Încălzire și întinderi — 5 minute care îți salvează lunile următoare.',
  },
];

export function numeCategorie(id: ExerciseCategory): string {
  return CATEGORII.find((c) => c.id === id)?.nume ?? id;
}

/**
 * Categoriile unui exercițiu: cele deduse din echipament/tip, plus cele
 * declarate explicit pe exercițiu. Deducerea ține catalogul curat —
 * `categorii` se scrie doar unde nu e evident (ex. „ridicările mari").
 */
export function categoriiExercitiu(e: ExerciseDef): ExerciseCategory[] {
  const set = new Set<ExerciseCategory>(e.categorii ?? []);
  if (e.tip === 'cardio') set.add('cardio');
  if (e.tip === 'mobilitate') set.add('mobilitate');
  switch (e.echipament) {
    case 'corp':
    case 'bara_tractiuni':
    case 'paralele':
    case 'trx':
      // greutatea corpului = calistenic, mai puțin întinderile/încălzirile
      if (e.tip !== 'mobilitate') set.add('calistenice');
      break;
    case 'gantere':
    case 'haltera':
    case 'kettlebell':
    case 'minge':
    case 'banda_elastica':
      set.add('greutati_libere');
      break;
    case 'aparat':
    case 'cablu':
      set.add('aparate');
      break;
    default:
      break;
  }
  return [...set];
}

const categoriiCache = new Map(EXERCITII.map((e) => [e.id, categoriiExercitiu(e)]));

export function areCategorie(e: ExerciseDef, c: ExerciseCategory): boolean {
  return (categoriiCache.get(e.id) ?? categoriiExercitiu(e)).includes(c);
}
