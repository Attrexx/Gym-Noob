import type { ExerciseCore } from './text/types';

/**
 * Cardio, împins și tras — structura.
 *
 * Aici stau doar cifrele și clasificările (MET, mușchi, echipament,
 * dificultate) — adică partea care NU depinde de limbă. Numele, cues-urile de
 * formă, greșelile și ponturile sunt în `text/ro.ts` / `text/en.ts`.
 */
export const EXERCITII_1: ExerciseCore[] = [
  { id: 'mers-inclinat-banda', echipament: 'banda_alergare', tip: 'cardio', dificultate: 1, muschi: ['cardio'], muschiSecundari: ['gambe', 'fesieri'], met: 5.3, masura: 'timp', anim: 'mers' },
  { id: 'alergare-banda', echipament: 'banda_alergare', tip: 'cardio', dificultate: 2, muschi: ['cardio'], muschiSecundari: ['cvadriceps', 'gambe'], met: 8.8, masura: 'timp', anim: 'alergare' },
  { id: 'bicicleta-stationara', echipament: 'bicicleta', tip: 'cardio', dificultate: 1, muschi: ['cardio'], muschiSecundari: ['cvadriceps', 'gambe'], met: 6.8, masura: 'timp', anim: 'bicicleta' },
  { id: 'eliptica', echipament: 'eliptica', tip: 'cardio', dificultate: 1, muschi: ['cardio'], muschiSecundari: ['fesieri', 'cvadriceps'], met: 5, masura: 'timp', anim: 'eliptica' },
  { id: 'vaslit-aparat', echipament: 'vaslit', tip: 'cardio', dificultate: 2, muschi: ['cardio'], muschiSecundari: ['spate', 'cvadriceps', 'biceps'], met: 7, masura: 'timp', anim: 'vaslit' },
  { id: 'stepper', echipament: 'aparat', tip: 'cardio', dificultate: 2, muschi: ['cardio'], muschiSecundari: ['fesieri', 'cvadriceps', 'gambe'], met: 6.5, masura: 'timp', anim: 'trepte' },
  { id: 'sarituri-coarda', echipament: 'corp', tip: 'cardio', dificultate: 2, muschi: ['cardio'], muschiSecundari: ['gambe', 'umeri'], met: 10, masura: 'timp', anim: 'coarda' },
  { id: 'impins-piept-aparat', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['piept'], muschiSecundari: ['triceps', 'umeri'], met: 3.8, masura: 'repetari', anim: 'impins' },
  { id: 'impins-gantere-banca', echipament: 'gantere', tip: 'forta', dificultate: 2, muschi: ['piept'], muschiSecundari: ['triceps', 'umeri'], met: 5, masura: 'repetari', anim: 'impins-culcat' },
  { id: 'impins-haltera-banca', echipament: 'haltera', tip: 'forta', dificultate: 3, muschi: ['piept'], muschiSecundari: ['triceps', 'umeri'], met: 6, masura: 'repetari', anim: 'impins-culcat' },
  { id: 'fluturari-aparat', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['piept'], muschiSecundari: ['umeri'], met: 3.5, masura: 'repetari', anim: 'fluturari' },
  { id: 'fluturari-gantere', echipament: 'gantere', tip: 'forta', dificultate: 2, muschi: ['piept'], muschiSecundari: ['umeri'], met: 3.8, masura: 'repetari', anim: 'fluturari-culcat' },
  { id: 'flotari', echipament: 'corp', tip: 'forta', dificultate: 2, muschi: ['piept'], muschiSecundari: ['triceps', 'umeri', 'abdomen'], met: 3.8, masura: 'repetari', anim: 'flotare' },
  { id: 'cablu-crossover', echipament: 'cablu', tip: 'forta', dificultate: 2, muschi: ['piept'], muschiSecundari: ['umeri'], met: 3.5, masura: 'repetari', anim: 'fluturari' },
  { id: 'tractiuni-helcometru', echipament: 'cablu', tip: 'forta', dificultate: 1, muschi: ['spate'], muschiSecundari: ['biceps', 'antebrate'], met: 4, masura: 'repetari', anim: 'tras-vertical' },
  { id: 'ramat-cablu-asezat', echipament: 'cablu', tip: 'forta', dificultate: 1, muschi: ['spate'], muschiSecundari: ['biceps', 'lombari'], met: 4, masura: 'repetari', anim: 'ramat' },
  { id: 'ramat-gantera', echipament: 'gantere', tip: 'forta', dificultate: 2, muschi: ['spate'], muschiSecundari: ['biceps', 'umeri'], met: 4.5, masura: 'repetari', anim: 'ramat-aplecat' },
  { id: 'ramat-aparat', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['spate'], muschiSecundari: ['biceps'], met: 3.8, masura: 'repetari', anim: 'ramat' },
  { id: 'hiperextensii', echipament: 'aparat', tip: 'forta', dificultate: 1, muschi: ['lombari'], muschiSecundari: ['fesieri', 'ischiogambieri'], met: 3.5, masura: 'repetari', anim: 'hiperextensie' },
  { id: 'indreptari-romanesti', echipament: 'haltera', tip: 'forta', dificultate: 3, muschi: ['ischiogambieri'], muschiSecundari: ['fesieri', 'lombari', 'antebrate'], met: 6, masura: 'repetari', anim: 'indreptare' },
  { id: 'face-pull', echipament: 'cablu', tip: 'forta', dificultate: 2, muschi: ['umeri'], muschiSecundari: ['spate'], met: 3.5, masura: 'repetari', anim: 'tras-fata' },
  { id: 'tractiuni-bara', echipament: 'bara_tractiuni', tip: 'forta', dificultate: 3, muschi: ['spate'], muschiSecundari: ['biceps', 'antebrate', 'abdomen'], met: 5, masura: 'repetari', anim: 'tras-vertical' },
];
