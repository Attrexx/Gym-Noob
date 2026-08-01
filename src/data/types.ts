// ── Metadate de sincronizare ────────────────────────────────────────

/**
 * Câmpuri adăugate în schema v2 pe fiecare rând persistat. Opționale pentru
 * că rândurile create înainte de v2 le primesc abia la upgrade (același
 * tipar ca `economizor !== false` la setări).
 */
export interface SyncMeta {
  /** identitate stabilă între dispozitive (uuid sau uid derivat) */
  uid?: string;
  /** ultima modificare locală (ISO) — baza last-write-wins la sincronizare */
  updatedAt?: string;
  /** 1 = modificat local, netrimis încă (0/1 pentru că boolean nu se poate indexa) */
  dirty?: 0 | 1;
}

// ── Entități de bază ────────────────────────────────────────────────

export type Sex = 'M' | 'F';

/** Nivel de activitate zilnică (în afara sălii) — multiplicator TDEE */
export type ActivityLevel = 'sedentar' | 'usor' | 'moderat' | 'activ' | 'foarte_activ';

export interface Profile extends SyncMeta {
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

export interface BodyMetric extends SyncMeta {
  id?: number;
  profileId: number;
  profileUid?: string;
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

export interface Goal extends SyncMeta {
  id?: number;
  profileId: number;
  profileUid?: string;
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
  /**
   * Notița vine din catalog (e text de-al nostru, traductibil) — `notite`
   * rămâne fallback-ul pentru ce a scris utilizatorul. Se anulează când
   * utilizatorul editează notița: din acel moment e a lui.
   */
  notaDinCatalog?: boolean;
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

export interface Template extends SyncMeta {
  id?: number;
  profileId: number;
  profileUid?: string;
  nume: string;
  descriere?: string;
  etichete: string[];
  items: TemplateItem[];
  creatLa: string;
  modificatLa: string;
  /** șablon livrat cu aplicația (nu poate fi șters, doar duplicat) */
  predefinit?: boolean;
  /**
   * De unde vine textul șablonului: `starter:<index>` sau
   * `program:<programId>/<workoutId>`.
   *
   * Există pentru că textul catalogului se COPIAZĂ în datele utilizatorului la
   * import. Fără proveniență, un plan importat ar rămâne pe veci în limba în
   * care a fost importat.
   *
   * ATENȚIE: nu rescriem niciodată `nume`/`descriere` în baza de date la
   * schimbarea limbii. Sincronizarea e last-write-wins pe rând, deci un
   * telefon în română și o tabletă în engleză s-ar rescrie reciproc la
   * nesfârșit. Traducem la afișare, prin `numeSablon()`.
   */
  sursaText?: string;
  /** utilizatorul a redenumit șablonul → e al lui, nu-l mai atingem */
  textEditat?: boolean;
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

export interface Session extends SyncMeta {
  id?: number;
  profileId: number;
  profileUid?: string;
  templateId?: number;
  templateUid?: string;
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

/** Tipurile de aparate de cardio pe care le înțelegem prin Bluetooth (FTMS). */
export type TipAparat = 'banda' | 'rower' | 'bicicleta' | 'eliptica' | 'stepper';

export interface SetLog extends SyncMeta {
  id?: number;
  sessionId: number;
  sessionUid?: string;
  profileId: number;
  profileUid?: string;
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
  // ── date de la aparatul conectat prin Bluetooth (toate opționale) ──
  /** ce fel de aparat a transmis datele */
  aparatTip?: TipAparat;
  /** modelul aparatului, ex. „Star Trac 8TR" — ca să știm pe care l-am folosit */
  aparatModel?: string;
  distantaM?: number;
  /** ritm mediu: lopătări/min (rower) sau rotații/min (bicicletă) */
  cadentaMedie?: number;
  putereMedieW?: number;
  /** caloriile pe care le-a raportat aparatul însuși (noi le calculăm separat) */
  kcalAparat?: number;
}

export interface WaterLog extends SyncMeta {
  id?: number;
  sessionId: number;
  sessionUid?: string;
  profileId: number;
  profileUid?: string;
  ml: number;
  data: string;
}

// ── Realizări ───────────────────────────────────────────────────────

export interface AchievementUnlock extends SyncMeta {
  id?: number;
  profileId: number;
  profileUid?: string;
  achievementId: string;
  data: string;
}

/**
 * Partea invariantă a unei realizări. Numele și descrierea (glumele!) sunt
 * mesaje: `realizari.<id>.nume` / `realizari.<id>.descriere`.
 */
export interface AchievementDef {
  id: string;
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

export interface Settings extends SyncMeta {
  id?: number;
  profileId: number;
  profileUid?: string;
  tema: 'zi' | 'noapte' | 'auto';
  sunete: boolean;
  /** indicații vocale (TTS) */
  vocale: boolean;
  vibratii: boolean;
  /** sugestii automate în sesiune */
  sugestiiAutomate: boolean;
  /** economizor de ecran (stil ceas) în timpul sesiunii */
  economizor: boolean;
  /** caută singur ceasul cu puls la începutul sesiunii (implicit da) */
  pulsAuto?: boolean;
  /** numele ultimului ceas conectat — ca să-l recunoaștem și să-l anunțăm pe nume */
  pulsUltimulDispozitiv?: string;
  /** caută singur aparatul de cardio la începutul sesiunii (implicit da) */
  aparatAuto?: boolean;
  /** numele ultimului aparat conectat */
  aparatUltimulDispozitiv?: string;
  /**
   * Limba interfeței. Lipsă = „auto" (limba browserului, cu româna ca plasă).
   * Câmp opțional și neindexat, deci NU cere versiune nouă de schemă Dexie și
   * nici schimbări pe server (magazinul de rânduri e generic).
   *
   * Se sincronizează ca orice setare, deci limba te urmează pe toate
   * dispozitivele — la fel ca tema.
   */
  limba?: 'ro' | 'en' | 'auto';
}

export const SETARI_IMPLICITE: Omit<Settings, 'id' | 'profileId'> = {
  tema: 'zi',
  sunete: true,
  vocale: false,
  vibratii: true,
  sugestiiAutomate: true,
  economizor: true,
};

// ── Sincronizare (tabele locale, nu se exportă în backup) ───────────

/**
 * Jurnalul ștergerilor locale („outbox"). Rândurile se șterg definitiv din
 * tabelele lor (nu ținem cadavre prin interogări), dar ștergerea rămâne
 * notată aici până ajunge la server. Cheia primară e chiar `uid`.
 */
export interface DeletionRecord {
  uid: string;
  tabel: string;
  profileUid?: string;
  deletedAt: string;
  dirty: 0 | 1;
}

/**
 * Starea contului de sincronizare, per profil (un cont = un profil).
 * Stă în Dexie, nu în localStorage: cursorul trebuie să avanseze în
 * ACEEAȘI tranzacție cu rândurile aplicate dintr-un pull.
 */
export interface SyncStateRow {
  profileUid: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  /** ultimul seq primit de la server (cursor de pull) */
  cursor: number;
  lastSyncLa?: string;
  lastError?: string;
}
