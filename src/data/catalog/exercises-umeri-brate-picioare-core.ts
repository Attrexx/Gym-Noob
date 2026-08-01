import type { ExerciseCore } from './text/types';

/**
 * Umeri, brațe, picioare, core — structura.
 *
 * Aici stau doar cifrele și clasificările (MET, mușchi, echipament,
 * dificultate) — adică partea care NU depinde de limbă. Numele, cues-urile de
 * formă, greșelile și ponturile sunt în `text/ro.ts` / `text/en.ts`.
 */
export const EXERCITII_2: ExerciseCore[] = [
  { id: 'presa-umeri-gantere', echipament: 'gantere', tip: 'forta', dificultate: 2, muschi: ['umeri'], muschiSecundari: ['triceps'], met: 4.5, masura: 'repetari', anim: 'presa-sus' },
  { id: 'presa-umeri-aparat', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['umeri'], muschiSecundari: ['triceps'], met: 3.8, masura: 'repetari', anim: 'presa-sus' },
  { id: 'ridicari-laterale', echipament: 'gantere', tip: 'forta', dificultate: 1, muschi: ['umeri'], met: 3.5, masura: 'repetari', anim: 'lateral' },
  { id: 'ridicari-frontale', echipament: 'gantere', tip: 'forta', dificultate: 1, muschi: ['umeri'], met: 3.5, masura: 'repetari', anim: 'frontal' },
  { id: 'fluturari-inverse', echipament: 'aparat', tip: 'forta', dificultate: 2, muschi: ['umeri'], muschiSecundari: ['spate'], met: 3.5, masura: 'repetari', anim: 'invers' },
  { id: 'flexii-gantere', echipament: 'gantere', tip: 'forta', dificultate: 1, muschi: ['biceps'], muschiSecundari: ['antebrate'], met: 3.5, masura: 'repetari', anim: 'flexie' },
  { id: 'flexii-bara-z', echipament: 'haltera', tip: 'forta', dificultate: 2, muschi: ['biceps'], muschiSecundari: ['antebrate'], met: 3.8, masura: 'repetari', anim: 'flexie' },
  { id: 'flexii-ciocan', echipament: 'gantere', tip: 'forta', dificultate: 1, muschi: ['biceps'], muschiSecundari: ['antebrate'], met: 3.5, masura: 'repetari', anim: 'flexie' },
  { id: 'flexii-cablu', echipament: 'cablu', tip: 'forta', dificultate: 1, muschi: ['biceps'], met: 3.5, masura: 'repetari', anim: 'flexie' },
  { id: 'extensii-cablu-triceps', echipament: 'cablu', tip: 'forta', dificultate: 1, muschi: ['triceps'], met: 3.5, masura: 'repetari', anim: 'extensie-jos' },
  { id: 'extensii-ganteră-cap', echipament: 'gantere', tip: 'forta', dificultate: 2, muschi: ['triceps'], met: 3.5, masura: 'repetari', anim: 'extensie-sus' },
  { id: 'fondari-paralele', echipament: 'aparat', tip: 'forta', dificultate: 3, muschi: ['triceps'], muschiSecundari: ['piept', 'umeri'], met: 5, masura: 'repetari', anim: 'fondare' },
  { id: 'dips-banca', echipament: 'corp', tip: 'forta', dificultate: 1, muschi: ['triceps'], muschiSecundari: ['umeri'], met: 3.8, masura: 'repetari', anim: 'fondare' },
  { id: 'presa-picioare', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['cvadriceps'], muschiSecundari: ['fesieri', 'ischiogambieri'], met: 5, masura: 'repetari', anim: 'presa-picioare' },
  { id: 'genuflexiuni-corp', echipament: 'corp', tip: 'forta', dificultate: 1, muschi: ['cvadriceps'], muschiSecundari: ['fesieri', 'abdomen'], met: 5, masura: 'repetari', anim: 'genuflexiune' },
  { id: 'genuflexiuni-smith', echipament: 'aparat', tip: 'forta', dificultate: 2, muschi: ['cvadriceps'], muschiSecundari: ['fesieri', 'ischiogambieri'], met: 5.5, masura: 'repetari', anim: 'genuflexiune' },
  { id: 'extensii-cvadriceps', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['cvadriceps'], met: 3.8, masura: 'repetari', anim: 'extensie-picior' },
  { id: 'flexii-ischiogambieri', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['ischiogambieri'], muschiSecundari: ['gambe'], met: 3.8, masura: 'repetari', anim: 'flexie-picior' },
  { id: 'fandari-gantere', echipament: 'gantere', tip: 'forta', dificultate: 2, muschi: ['cvadriceps'], muschiSecundari: ['fesieri', 'ischiogambieri'], met: 5.5, masura: 'repetari', anim: 'fandare' },
  { id: 'ridicari-gambe', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['gambe'], met: 3.5, masura: 'repetari', anim: 'gambe' },
  { id: 'hip-thrust', echipament: 'haltera', tip: 'forta', dificultate: 2, muschi: ['fesieri'], muschiSecundari: ['ischiogambieri', 'lombari'], met: 4.5, masura: 'repetari', anim: 'hip-thrust' },
  { id: 'abductii-aparat', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['fesieri'], met: 3.5, masura: 'repetari', anim: 'abductie' },
  { id: 'plank', echipament: 'corp', tip: 'izometric', dificultate: 1, muschi: ['abdomen'], muschiSecundari: ['lombari', 'umeri'], met: 3.3, masura: 'timp', anim: 'plank' },
  { id: 'crunch-saltea', echipament: 'corp', tip: 'forta', dificultate: 1, muschi: ['abdomen'], met: 3, masura: 'repetari', anim: 'crunch' },
  { id: 'crunch-aparat', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['abdomen'], met: 3.5, masura: 'repetari', anim: 'crunch' },
  { id: 'ridicari-picioare', echipament: 'aparat', tip: 'forta', dificultate: 2, muschi: ['abdomen'], muschiSecundari: ['antebrate'], met: 3.8, masura: 'repetari', anim: 'ridicare-genunchi' },
  { id: 'russian-twist', echipament: 'minge', tip: 'forta', dificultate: 2, muschi: ['abdomen'], met: 3.8, masura: 'repetari', anim: 'rasucire' },
  { id: 'mountain-climbers', echipament: 'corp', tip: 'cardio', dificultate: 2, muschi: ['abdomen'], muschiSecundari: ['umeri', 'cvadriceps', 'cardio'], met: 8, masura: 'timp', anim: 'catarator' },
  { id: 'kettlebell-swing', echipament: 'kettlebell', tip: 'forta', dificultate: 2, muschi: ['fesieri'], muschiSecundari: ['ischiogambieri', 'lombari', 'umeri', 'cardio'], met: 9.5, masura: 'repetari', anim: 'balans' },
  { id: 'farmers-walk', echipament: 'gantere', tip: 'forta', dificultate: 1, muschi: ['antebrate'], muschiSecundari: ['abdomen', 'umeri', 'gambe'], met: 5.5, masura: 'timp', anim: 'mers-greutati' },
  { id: 'burpee', echipament: 'corp', tip: 'cardio', dificultate: 3, muschi: ['cardio'], muschiSecundari: ['piept', 'cvadriceps', 'abdomen'], met: 8, masura: 'repetari', anim: 'burpee' },
];
