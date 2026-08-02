import type { PachetCatalog } from './types';
import { EXERCITII_EN } from './en-exercitii';
import {
  ARTICOLE_EN,
  INCURAJARI_FINAL_EN,
  INCURAJARI_SET_EN,
  OBIECTIVE_EN,
  PROGRAME_EN,
  SABLOANE_START_EN,
  SFATURI_EN,
} from './en-continut';

/**
 * The English text of the catalogue.
 *
 * The exercises live in `en-exercitii.ts` (it is a long file — 98 entries).
 * What stays here is the taxonomy: muscle groups, difficulties, categories.
 *
 * The equipment names are what people actually say in a British gym — lat
 * pulldown, leg press, pec deck, cross-trainer — the same principle as the
 * Romanian pack, which uses real Romanian gym vocabulary rather than
 * translations.
 */
export const catalogEn: PachetCatalog = {
  exercitii: EXERCITII_EN,

  grupeMuschi: {
    piept: 'Chest',
    spate: 'Back',
    umeri: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    abdomen: 'Abs',
    fesieri: 'Glutes',
    cvadriceps: 'Quads',
    ischiogambieri: 'Hamstrings',
    gambe: 'Calves',
    lombari: 'Lower back',
    antebrate: 'Forearms',
    cardio: 'Cardio',
  },

  dificultate: {
    1: 'For noobs',
    2: 'Intermediate',
    3: 'Advanced',
  },

  categorii: {
    calistenice: {
      nume: 'Calisthenics',
      descriere: 'Bodyweight only: the fixed bar, the dip bars, the floor. No membership required.',
    },
    greutati_libere: {
      nume: 'Free weights',
      descriere:
        'Barbells, dumbbells, kettlebells, balls, bands. Harder to learn, more muscle at the end of it.',
    },
    aparate: {
      nume: 'Machines & cables',
      descriere: 'A guided path, low risk — where every noob starts.',
    },
    powerlifting: {
      nume: 'The big lifts',
      descriere:
        'Squat, deadlift, bench, overhead press — the foundation of every famous programme there is.',
    },
    cardio: { nume: 'Cardio', descriere: 'Heart, lungs, calories burnt.' },
    mobilitate: {
      nume: 'Mobility',
      descriere: 'Warm-ups and stretches — 5 minutes that save you the months ahead.',
    },
  },

  programe: PROGRAME_EN,
  obiective: OBIECTIVE_EN,
  articole: ARTICOLE_EN,
  sabloaneStart: SABLOANE_START_EN,
  sfaturi: SFATURI_EN,
  incurajariSet: INCURAJARI_SET_EN,
  incurajariFinal: INCURAJARI_FINAL_EN,
};
