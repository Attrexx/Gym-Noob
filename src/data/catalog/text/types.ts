import type { ExerciseCategory, ExerciseDef, MuscleGroup, ProgramGoal } from '@/data/types';
import type { ArticleId, ExerciseId, ProgramId } from '../ids';

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
/** Partea scrisă a unui program celebru. */
export interface TextProgram {
  nume: string;
  subtitlu: string;
  origine: string;
  descriere: string;
  frecventa: string;
  durata: string;
  etichete: string[];
  saptamana: string[];
  progresie: string[];
  note?: string[];
  /** aliniat, ca ordine, cu `antrenamente` din structură */
  antrenamente: {
    nume: string;
    descriere?: string;
    /** gruparea în faze/blocuri, când programul e periodizat */
    faza?: string;
    /** aliniat, ca ordine, cu `items` din structura antrenamentului */
    notite: (string | undefined)[];
  }[];
}

export interface TextArticol {
  titlu: string;
  rezumat: string;
  /** paragrafe; rândurile care încep cu „• " devin liste — păstrează marcatorul */
  continut: string[];
}

export interface TextSablonStart {
  nume: string;
  descriere: string;
  etichete: string[];
}

export interface PachetCatalog {
  exercitii: Record<ExerciseId, TextExercitiu>;
  grupeMuschi: Record<MuscleGroup, string>;
  dificultate: Record<1 | 2 | 3, string>;
  categorii: Record<ExerciseCategory, { nume: string; descriere: string }>;
  programe: Record<ProgramId, TextProgram>;
  obiective: Record<ProgramGoal, string>;
  articole: Record<ArticleId, TextArticol>;
  /** aliniate, ca ordine, cu șabloanele din starterTemplates.ts */
  sabloaneStart: TextSablonStart[];
  /**
   * Liste libere — singurul loc unde limbile NU trebuie să aibă aceeași
   * lungime. `sfatulZilei` face `SFATURI[zi % SFATURI.length]`, deci merge
   * cu orice număr de sfaturi.
   */
  sfaturi: string[];
  incurajariSet: string[];
  incurajariFinal: string[];
}
