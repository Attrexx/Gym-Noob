import type { ExerciseDef, MuscleGroup } from '../types';
import { EXERCITII_1 } from './exercises-cardio-impins-tras';
import { EXERCITII_2 } from './exercises-umeri-brate-picioare-core';

export const EXERCITII: ExerciseDef[] = [...EXERCITII_1, ...EXERCITII_2];

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
