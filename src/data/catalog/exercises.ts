import type { ExerciseCategory, ExerciseDef, MuscleGroup } from '../types';
import { EXERCITII_1 } from './exercises-cardio-impins-tras';
import { EXERCITII_2 } from './exercises-umeri-brate-picioare-core';
import { EXERCITII_3 } from './exercises-haltera-calistenice';
import type { ExerciseCore, PachetCatalog } from './text/types';

/**
 * Punctul unde structura se împreunează cu textul limbii active.
 *
 * `EXERCITII` era o constantă; acum e `exercitii()`, o funcție. Schimbarea e
 * intenționată: pune „lucrul ăsta depinde de limbă" chiar la locul apelului,
 * în loc să ascundă asta într-un binding ESM care se schimbă pe tăcute.
 *
 * `getExercise()` rămâne sincron — sessionStore citește din el doar `met`,
 * un număr, și nu vrem să-l facem async pentru atât.
 */

const CORE: ExerciseCore[] = [...EXERCITII_1, ...EXERCITII_2, ...EXERCITII_3];

let lista: ExerciseDef[] = [];
let index = new Map<string, ExerciseDef>();
let categoriiCache = new Map<string, ExerciseCategory[]>();
let text: PachetCatalog | null = null;

/** Chemat de `incarcaLimba()` — singura cale prin care catalogul își ia textul. */
export function aplicaTextCatalog(pachet: PachetCatalog): void {
  text = pachet;
  lista = CORE.map((c) => ({ ...c, ...pachet.exercitii[c.id] }));
  index = new Map(lista.map((e) => [e.id, e]));
  categoriiCache = new Map(lista.map((e) => [e.id, categoriiExercitiu(e)]));
}

function pachet(): PachetCatalog {
  if (!text) throw new Error('catalog: nicio limbă încărcată — cheamă incarcaLimba() înainte');
  return text;
}

export function exercitii(): ExerciseDef[] {
  return lista;
}

export function getExercise(id: string): ExerciseDef | undefined {
  return index.get(id);
}

// ── Taxonomie (grupe, dificultăți, categorii) ───────────────────────

/** Grupele musculare, în ordinea de afișare. Numele vin din pachetul de limbă. */
export const GRUPE_MUSCHI_IDS: MuscleGroup[] = [
  'piept',
  'spate',
  'umeri',
  'biceps',
  'triceps',
  'abdomen',
  'fesieri',
  'cvadriceps',
  'ischiogambieri',
  'gambe',
  'lombari',
  'antebrate',
  'cardio',
];

export function numeGrupa(id: MuscleGroup): string {
  return pachet().grupeMuschi[id] ?? id;
}

export function grupeMuschi(): { id: MuscleGroup; nume: string }[] {
  return GRUPE_MUSCHI_IDS.map((id) => ({ id, nume: numeGrupa(id) }));
}

export function numeDificultate(nivel: number): string {
  return pachet().dificultate[nivel as 1 | 2 | 3] ?? String(nivel);
}

export const CATEGORII_IDS: ExerciseCategory[] = [
  'calistenice',
  'greutati_libere',
  'aparate',
  'powerlifting',
  'cardio',
  'mobilitate',
];

/** Emoji-urile categoriilor — nu depind de limbă, deci stau aici. */
export const EMOJI_CATEGORIE: Record<ExerciseCategory, string> = {
  calistenice: '🤸',
  greutati_libere: '🏋️',
  aparate: '⚙️',
  powerlifting: '💪',
  cardio: '🏃',
  mobilitate: '🧘',
};

export function numeCategorie(id: ExerciseCategory): string {
  return pachet().categorii[id]?.nume ?? id;
}

export function categorii(): { id: ExerciseCategory; nume: string; emoji: string; descriere: string }[] {
  const p = pachet();
  return CATEGORII_IDS.map((id) => ({
    id,
    nume: p.categorii[id].nume,
    emoji: EMOJI_CATEGORIE[id],
    descriere: p.categorii[id].descriere,
  }));
}

/**
 * Categoriile unui exercițiu: cele deduse din echipament/tip, plus cele
 * declarate explicit pe exercițiu. Deducerea ține catalogul curat —
 * `categorii` se scrie doar unde nu e evident (ex. „ridicările mari").
 */
export function categoriiExercitiu(e: ExerciseDef | ExerciseCore): ExerciseCategory[] {
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

export function areCategorie(e: ExerciseDef, c: ExerciseCategory): boolean {
  return (categoriiCache.get(e.id) ?? categoriiExercitiu(e)).includes(c);
}
