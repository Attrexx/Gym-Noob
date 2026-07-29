import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, SetLog, TemplateItem } from '@/data/types';
import { createSession, addSetLog, addWater as repoAddWater, setLogsForExercise, updateSession } from '@/data/repo';
import { kcalSet, durataSetSec } from '@/domain/calories';
import { detectPrs, type PrHit } from '@/domain/pr';
import { getExercise } from '@/data/catalog/exercises';
import { varstaDinData } from '@/domain/goals';

/**
 * Starea sesiunii live de la sală. Persistată în localStorage ca să
 * supraviețuiască unui refresh sau unei blocări de ecran — jurnalele
 * propriu-zise (seturi, apă) se scriu imediat în IndexedDB.
 */

export type LiveStatus = 'inactiva' | 'activa' | 'pauza';

export interface LiveState {
  status: LiveStatus;
  sessionId: number | null;
  profileId: number | null;
  templateNume?: string;
  plan: TemplateItem[];
  /** seturi terminate per element din plan */
  seturiFacute: number[];
  exIndex: number;
  inceput: string | null;
  /** secunde active acumulate până la ultima pauză */
  activeSecBaza: number;
  /** momentul ultimei porniri/reluări (epoch ms) */
  reluatLaMs: number | null;
  /** pauza dintre seturi: momentul încheierii (epoch ms) */
  restEndsMs: number | null;
  restTotalSec: number;
  kcal: number;
  apaMl: number;
  /** puls: agregare pentru medie */
  hrUltim: number | null;
  hrSuma: number;
  hrNr: number;

  porneste: (profil: Profile, plan: TemplateItem[], opts?: { templateId?: number; templateNume?: string }) => Promise<void>;
  pauza: () => Promise<void>;
  reia: () => Promise<void>;
  opreste: (abandon?: boolean) => Promise<{ durataSec: number; kcal: number; apaMl: number; seturi: number } | null>;
  logSet: (profil: Profile, planIdx: number, date: { repetari?: number; greutate?: number; durataSec?: number; rpe?: number }) => Promise<PrHit[]>;
  bea: (ml: number) => Promise<void>;
  sareLa: (idx: number) => void;
  adaugaInPlan: (item: TemplateItem) => void;
  scoateDinPlan: (idx: number) => void;
  startRest: (sec: number) => void;
  stopRest: () => void;
  hrSample: (bpm: number) => void;
}

const GOL = {
  status: 'inactiva' as LiveStatus,
  sessionId: null,
  profileId: null,
  templateNume: undefined,
  plan: [] as TemplateItem[],
  seturiFacute: [] as number[],
  exIndex: 0,
  inceput: null,
  activeSecBaza: 0,
  reluatLaMs: null,
  restEndsMs: null,
  restTotalSec: 0,
  kcal: 0,
  apaMl: 0,
  hrUltim: null,
  hrSuma: 0,
  hrNr: 0,
};

export function secundeActive(s: Pick<LiveState, 'status' | 'activeSecBaza' | 'reluatLaMs'>): number {
  const extra = s.status === 'activa' && s.reluatLaMs ? (Date.now() - s.reluatLaMs) / 1000 : 0;
  return Math.floor(s.activeSecBaza + extra);
}

export const useSession = create<LiveState>()(
  persist(
    (set, get) => ({
      ...GOL,

      porneste: async (profil, plan, opts) => {
        const inceput = new Date().toISOString();
        const sessionId = await createSession({
          profileId: profil.id!,
          templateId: opts?.templateId,
          templateNume: opts?.templateNume,
          status: 'activa',
          inceput,
          durataActivaSec: 0,
          apaMl: 0,
          kcal: 0,
        });
        set({
          ...GOL,
          status: 'activa',
          sessionId,
          profileId: profil.id!,
          templateNume: opts?.templateNume,
          plan,
          seturiFacute: plan.map(() => 0),
          inceput,
          reluatLaMs: Date.now(),
        });
      },

      pauza: async () => {
        const s = get();
        if (s.status !== 'activa') return;
        set({ status: 'pauza', activeSecBaza: secundeActive(s), reluatLaMs: null });
        if (s.sessionId) await updateSession(s.sessionId, { status: 'pauza', durataActivaSec: secundeActive(s) });
      },

      reia: async () => {
        const s = get();
        if (s.status !== 'pauza') return;
        set({ status: 'activa', reluatLaMs: Date.now() });
        if (s.sessionId) await updateSession(s.sessionId, { status: 'activa' });
      },

      opreste: async (abandon = false) => {
        const s = get();
        if (s.status === 'inactiva' || !s.sessionId) return null;
        const durataSec = secundeActive(s);
        const seturi = s.seturiFacute.reduce((a, b) => a + b, 0);
        await updateSession(s.sessionId, {
          status: abandon ? 'abandonata' : 'terminata',
          sfarsit: new Date().toISOString(),
          durataActivaSec: durataSec,
          kcal: Math.round(s.kcal),
          pulsMediu: s.hrNr > 0 ? Math.round(s.hrSuma / s.hrNr) : undefined,
        });
        const rezumat = { durataSec, kcal: Math.round(s.kcal), apaMl: s.apaMl, seturi };
        set({ ...GOL });
        return abandon ? null : rezumat;
      },

      logSet: async (profil, planIdx, date) => {
        const s = get();
        if (!s.sessionId || !s.profileId) return [];
        const item = s.plan[planIdx];
        const ex = getExercise(item.exerciseId);
        if (!ex) return [];
        const secunde = date.durataSec ?? durataSetSec(date.repetari ?? 0, item.tempo);
        const kcal = kcalSet({
          met: ex.met,
          greutateKg: profilGreutate(profil),
          secunde,
          rpe: date.rpe,
          sex: profil.sex,
          varsta: varstaDinData(profil.dataNasterii),
          pulsMediu: s.hrNr > 0 ? Math.round(s.hrSuma / s.hrNr) : undefined,
        });
        const istoric = await setLogsForExercise(s.profileId, item.exerciseId);
        const setIndex = s.seturiFacute[planIdx] + 1;
        const logNou: Omit<SetLog, 'id'> = {
          sessionId: s.sessionId,
          profileId: s.profileId,
          exerciseId: item.exerciseId,
          setIndex,
          repetari: date.repetari,
          greutate: date.greutate,
          durataSec: date.durataSec,
          rpe: date.rpe,
          tempo: item.tempo,
          kcal: Math.round(kcal * 10) / 10,
          data: new Date().toISOString(),
        };
        await addSetLog(logNou);
        const facute = [...s.seturiFacute];
        facute[planIdx] = setIndex;
        set({ seturiFacute: facute, kcal: s.kcal + kcal });
        if (s.sessionId) void updateSession(s.sessionId, { kcal: Math.round((s.kcal + kcal) * 10) / 10 });
        // PR-urile se compară doar cu seturile din sesiunile anterioare
        const istoricVechi = istoric.filter((l) => l.sessionId !== s.sessionId);
        return detectPrs({ ...logNou, id: undefined }, istoricVechi);
      },

      bea: async (ml) => {
        const s = get();
        if (!s.sessionId || !s.profileId) return;
        await repoAddWater({ sessionId: s.sessionId, profileId: s.profileId, ml, data: new Date().toISOString() });
        set({ apaMl: s.apaMl + ml });
      },

      sareLa: (idx) => set({ exIndex: idx }),

      adaugaInPlan: (item) => {
        const s = get();
        set({ plan: [...s.plan, item], seturiFacute: [...s.seturiFacute, 0] });
      },

      scoateDinPlan: (idx) => {
        const s = get();
        if (s.seturiFacute[idx] > 0) return; // nu scoatem exerciții cu seturi deja făcute
        set({
          plan: s.plan.filter((_, i) => i !== idx),
          seturiFacute: s.seturiFacute.filter((_, i) => i !== idx),
          exIndex: Math.min(s.exIndex, Math.max(0, s.plan.length - 2)),
        });
      },

      startRest: (sec) => set({ restEndsMs: Date.now() + sec * 1000, restTotalSec: sec }),
      stopRest: () => set({ restEndsMs: null, restTotalSec: 0 }),

      hrSample: (bpm) => {
        const s = get();
        set({ hrUltim: bpm, hrSuma: s.hrSuma + bpm, hrNr: s.hrNr + 1 });
      },
    }),
    { name: 'gym-noob-sesiune' },
  ),
);

/** Greutatea curentă e necesară pentru calorii; o citim din cache-ul paginii. */
let greutateCache = 80;
export function setGreutateCurenta(kg: number) {
  greutateCache = kg;
}
function profilGreutate(_p: Profile): number {
  return greutateCache;
}
