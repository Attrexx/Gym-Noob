// ── Entități de bază ────────────────────────────────────────────────

export type Sex = 'M' | 'F';

/** Nivel de activitate zilnică (în afara sălii) — multiplicator TDEE */
export type ActivityLevel = 'sedentar' | 'usor' | 'moderat' | 'activ' | 'foarte_activ';

export interface Profile {
  id?: number;
  nume: string;
  sex: Sex;
  /** an-lună-zi ISO */
  dataNasterii: string;
  /** cm */
  inaltime: number;
  activitate: ActivityLevel;
  /** ml pe sesiune recomandați */
  tintaApaSesiune: number;
  creatLa: string;
  /** ultima folosire — pentru selecție automată */
  folositLa: string;
}

export interface BodyMetric {
  id?: number;
  profileId: number;
  data: string; // ISO datetime
  /** kg */
  greutate: number;
  /** cm, opționale — pentru estimarea grăsimii corporale (formula US Navy) */
  talie?: number;
  gat?: number;
  sold?: number;
  /** sursa: manual | freefit */
  sursa: 'manual' | 'freefit';
}

export interface Goal {
  id?: number;
  profileId: number;
  /** kg */
  greutateTinta: number;
  /** kg pe săptămână (pozitiv = slăbire) */
  ritmKgSaptamana: number;
  activ: boolean;
  creatLa: string;
  atinsLa?: string;
}

// ── Catalog de exerciții (static, livrat cu aplicația) ──────────────

export type MuscleGroup =
  | 'piept'
  | 'spate'
  | 'umeri'
  | 'biceps'
  | 'triceps'
  | 'abdomen'
  | 'fesieri'
  | 'cvadriceps'
  | 'ischiogambieri'
  | 'gambe'
  | 'lombari'
  | 'antebrate'
  | 'cardio';

export type Difficulty = 1 | 2 | 3; // 1=noob friendly, 3=avansat

export type ExerciseKind = 'forta' | 'cardio' | 'izometric' | 'mobilitate';

export type Equipment =
  | 'corp'
  | 'gantere'
  | 'haltera'
  | 'aparat'
  | 'cablu'
  | 'kettlebell'
  | 'banda_elastica'
  | 'banda_alergare'
  | 'bicicleta'
  | 'eliptica'
  | 'vaslit'
  | 'minge'
  | 'bara_tractiuni'
  | 'paralele'
  | 'trx'
  | 'sanie';

/**
 * Categorii de filtrare în bibliotecă. Majoritatea se deduc automat din
 * `echipament`/`tip` (vezi `categoriiExercitiu`), dar pot fi și declarate
 * explicit pe exercițiu când deducerea nu e suficientă (ex. genuflexiunile
 * cu bara sunt „powerlifting", nu doar „greutăți libere").
 */
export type ExerciseCategory =
  | 'calistenice'
  | 'greutati_libere'
  | 'aparate'
  | 'cardio'
  | 'powerlifting'
  | 'mobilitate';

export interface ExerciseDef {
  /** id stabil, ex. "impins-piept-aparat" */
  id: string;
  nume: string;
  /** numele aparatului / uneltei, în română */
  echipamentNume: string;
  echipament: Equipment;
  tip: ExerciseKind;
  dificultate: Difficulty;
  /** grupe principale (prima = dominantă) */
  muschi: MuscleGroup[];
  /** grupe secundare */
  muschiSecundari?: MuscleGroup[];
  /** MET la efort moderat — baza estimării caloriilor */
  met: number;
  /** măsurat în repetări sau în timp */
  masura: 'repetari' | 'timp';
  /** sfaturi de execuție (formă corectă), pas cu pas */
  forma: string[];
  /** cum folosești aparatul/unealta */
  utilizare: string[];
  /** greșeli frecvente */
  greseli: string[];
  /** tips & tricks */
  ponturi: string[];
  /** id-ul animației stick-figure (cheie în registrul de animații) */
  anim?: string;
  /** categorii suplimentare peste cele deduse din echipament/tip */
  categorii?: ExerciseCategory[];
  /** exerciții înrudite / variante (id-uri din catalog) */
  variante?: string[];
}

// ── Șabloane (serii compuse de utilizator) ──────────────────────────

export interface TemplateItem {
  exerciseId: string;
  seturi: number;
  /** ținte per set */
  repetari?: number;
  greutate?: number; // kg
  durataSec?: number; // pentru exerciții pe timp
  pauzaSec: number;
  /** cadență: secunde coborâre-pauză-ridicare, ex. "3-1-2" */
  tempo?: string;
  /** banda de alergare: viteza (km/h) și înclinația (%) planificate */
  viteza?: number;
  inclinatie?: number;
  notite?: string;
}

export interface Template {
  id?: number;
  profileId: number;
  nume: string;
  descriere?: string;
  etichete: string[];
  items: TemplateItem[];
  creatLa: string;
  modificatLa: string;
  /** șablon livrat cu aplicația (nu poate fi șters, doar duplicat) */
  predefinit?: boolean;
}

// ── Programe celebre (statice, livrate cu aplicația) ────────────────

/** Ce urmărește programul, pentru filtrare și pentru recomandări. */
export type ProgramGoal = 'forta' | 'masa' | 'slabit' | 'rezistenta' | 'tehnica';

export interface ProgramWorkout {
  /** id stabil în cadrul programului, ex. "a" / "push" */
  id: string;
  nume: string;
  descriere?: string;
  /** gruparea în faze/blocuri, când programul e periodizat */
  faza?: string;
  items: TemplateItem[];
}

export interface ProgramDef {
  id: string;
  nume: string;
  /** o propoziție care spune despre ce e vorba */
  subtitlu: string;
  /** cine l-a inventat / de unde vine */
  origine: string;
  descriere: string;
  nivel: Difficulty;
  obiective: ProgramGoal[];
  /** ex. "3 zile pe săptămână" */
  frecventa: string;
  /** ex. "45-70 min" */
  durata: string;
  /** programul săptămânal, linie cu linie */
  saptamana: string[];
  /** cum crești greutățile */
  progresie: string[];
  /** avertismente, adaptări, note de periodizare */
  note?: string[];
  etichete: string[];
  antrenamente: ProgramWorkout[];
}

// ── Sesiuni și jurnale ──────────────────────────────────────────────

export type SessionStatus = 'activa' | 'pauza' | 'terminata' | 'abandonata';

export interface Session {
  id?: number;
  profileId: number;
  templateId?: number;
  templateNume?: string;
  status: SessionStatus;
  inceput: string; // ISO
  sfarsit?: string;
  /** durata activă totală în secunde (fără pauze) */
  durataActivaSec: number;
  /** momentul ultimei porniri/reluări — pentru calcul live */
  reluatLa?: string;
  apaMl: number;
  kcal: number;
  /** puls mediu dacă a fost conectat ceasul */
  pulsMediu?: number;
  notite?: string;
}

export interface SetLog {
  id?: number;
  sessionId: number;
  profileId: number;
  exerciseId: string;
  /** indexul setului în cadrul exercițiului (1-based) */
  setIndex: number;
  repetari?: number;
  greutate?: number; // kg
  durataSec?: number;
  /** efort perceput 1-10 */
  rpe?: number;
  tempo?: string;
  /** banda de alergare: setările folosite (medii pe durata setului) */
  viteza?: number;
  inclinatie?: number;
  kcal: number;
  data: string; // ISO
}

export interface WaterLog {
  id?: number;
  sessionId: number;
  profileId: number;
  ml: number;
  data: string;
}

// ── Realizări ───────────────────────────────────────────────────────

export interface AchievementUnlock {
  id?: number;
  profileId: number;
  achievementId: string;
  data: string;
}

export interface AchievementDef {
  id: string;
  nume: string;
  descriere: string;
  emoji: string;
  /** categoria pentru afișare */
  categorie: 'inceput' | 'consecventa' | 'volum' | 'greutate' | 'hidratare' | 'recorduri';
}

// ── Recorduri personale ─────────────────────────────────────────────

export interface PersonalRecord {
  exerciseId: string;
  tip: 'greutate' | 'volum_set' | 'repetari' | '1rm';
  valoare: number;
  data: string;
  sessionId?: number;
}

// ── Setări ──────────────────────────────────────────────────────────

export interface Settings {
  id?: number;
  profileId: number;
  tema: 'zi' | 'noapte' | 'auto';
  sunete: boolean;
  /** indicații vocale (TTS) */
  vocale: boolean;
  vibratii: boolean;
  /** sugestii automate în sesiune */
  sugestiiAutomate: boolean;
  /** economizor de ecran (stil ceas) în timpul sesiunii */
  economizor: boolean;
}

export const SETARI_IMPLICITE: Omit<Settings, 'id' | 'profileId'> = {
  tema: 'zi',
  sunete: true,
  vocale: false,
  vibratii: true,
  sugestiiAutomate: true,
  economizor: true,
};
