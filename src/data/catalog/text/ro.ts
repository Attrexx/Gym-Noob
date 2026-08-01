import type { PachetCatalog } from './types';
import { EXERCITII_RO } from './ro-exercitii';
import {
  ARTICOLE_RO,
  INCURAJARI_FINAL_RO,
  INCURAJARI_SET_RO,
  OBIECTIVE_RO,
  PROGRAME_RO,
  SABLOANE_START_RO,
  SFATURI_RO,
} from './ro-continut';

/**
 * Textul românesc al catalogului.
 *
 * Exercițiile stau în `ro-exercitii.ts` (e un fișier lung — ~98 de intrări).
 * Aici rămâne taxonomia: grupele musculare, dificultățile, categoriile.
 *
 * Denumirile aparatelor sunt cele uzuale în sălile din România (helcometru,
 * presă de picioare, vaslit) — vocabular real de sală, nu traduceri.
 */
export const catalogRo: PachetCatalog = {
  exercitii: EXERCITII_RO,

  grupeMuschi: {
    piept: 'Piept',
    spate: 'Spate',
    umeri: 'Umeri',
    biceps: 'Biceps',
    triceps: 'Triceps',
    abdomen: 'Abdomen',
    fesieri: 'Fesieri',
    cvadriceps: 'Cvadriceps',
    ischiogambieri: 'Ischiogambieri',
    gambe: 'Gambe',
    lombari: 'Lombari',
    antebrate: 'Antebrațe',
    cardio: 'Cardio',
  },

  dificultate: {
    1: 'Pentru noobi',
    2: 'Intermediar',
    3: 'Avansat',
  },

  categorii: {
    calistenice: {
      nume: 'Calistenice',
      descriere: 'Doar greutatea corpului: bara fixă, paralele, sol. Zero abonament necesar.',
    },
    greutati_libere: {
      nume: 'Greutăți libere',
      descriere: 'Haltere, gantere, kettlebell, mingi, benzi. Mai greu de învățat, mai mult mușchi la final.',
    },
    aparate: {
      nume: 'Aparate & cabluri',
      descriere: 'Traseu ghidat, risc mic — locul unde începe orice noob.',
    },
    powerlifting: {
      nume: 'Ridicările mari',
      descriere: 'Genuflexiuni, îndreptări, împins, presă militară — baza tuturor programelor celebre.',
    },
    cardio: { nume: 'Cardio', descriere: 'Inimă, plămâni, calorii arse.' },
    mobilitate: {
      nume: 'Mobilitate',
      descriere: 'Încălzire și întinderi — 5 minute care îți salvează lunile următoare.',
    },
  },

  programe: PROGRAME_RO,
  obiective: OBIECTIVE_RO,
  articole: ARTICOLE_RO,
  sabloaneStart: SABLOANE_START_RO,
  sfaturi: SFATURI_RO,
  incurajariSet: INCURAJARI_SET_RO,
  incurajariFinal: INCURAJARI_FINAL_RO,
};
