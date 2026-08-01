import type { ProgramDef, ProgramGoal, TemplateItem } from '../types';
import type { ProgramId } from './ids';
import { pachetCatalog } from './text/activ';

/**
 * Programele celebre — STRUCTURA.
 *
 * Aici stau doar id-urile, nivelul, obiectivele și seturile/repetările.
 * Numele, descrierile, planul săptămânal și notele stau în
 * `text/<limbă>.ts` și se lipesc la încărcarea limbii.
 *
 * Greutățile din `items` sunt puncte de plecare orientative pentru cineva
 * care începe — se reglează la prima sesiune. Unde programul original cere
 * procente dintr-un maxim (Wendler 5/3/1) sau «cât poți» (AMRAP), greutatea
 * lipsește intenționat, iar instrucțiunea stă în notița din pachetul de text.
 */

export interface ProgramCore {
  id: ProgramId;
  nivel: 1 | 2 | 3;
  obiective: ProgramGoal[];
  antrenamente: { id: string; items: TemplateItem[] }[];
}

export const PROGRAME_CORE: ProgramCore[] = [
  {
    id: 'full-body-3x',
    nivel: 1,
    obiective: ['forta', 'masa', 'tehnica'],
    antrenamente: [
      {
        id: 'a',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
        { exerciseId: 'genuflexiuni-haltera', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
        { exerciseId: 'impins-haltera-banca', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
        { exerciseId: 'ramat-haltera-aplecat', seturi: 3, repetari: 8, greutate: 25, pauzaSec: 120 },
        { exerciseId: 'plank', seturi: 3, durataSec: 30, pauzaSec: 60 },
        ],
      },
      {
        id: 'b',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
        { exerciseId: 'genuflexiuni-haltera', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
        { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
        { exerciseId: 'indreptari-clasice', seturi: 1, repetari: 5, greutate: 40, pauzaSec: 180 },
        { exerciseId: 'tractiuni-helcometru', seturi: 3, repetari: 10, greutate: 30, pauzaSec: 120 },
        ],
      },
    ],
  },
  {
    id: 'powerbuilding-periodizat',
    nivel: 2,
    obiective: ['masa', 'forta'],
    antrenamente: [
      {
        id: 'r1a',
        items: [
        { exerciseId: 'indreptari-clasice', seturi: 3, repetari: 8, greutate: 40, pauzaSec: 150 },
        { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
        { exerciseId: 'impins-haltera-banca', seturi: 3, repetari: 8, greutate: 25, pauzaSec: 150 },
        { exerciseId: 'flexii-gantere', seturi: 3, repetari: 10, greutate: 8, pauzaSec: 60 },
        { exerciseId: 'extensii-ganteră-cap', seturi: 3, repetari: 10, greutate: 8, pauzaSec: 60 },
        { exerciseId: 'ridicari-gambe', seturi: 3, repetari: 20, greutate: 40, pauzaSec: 60 },
        { exerciseId: 'ridicari-trunchi', seturi: 3, repetari: 20, pauzaSec: 60 },
        ],
      },
      {
        id: 'r1b',
        items: [
        { exerciseId: 'genuflexiuni-haltera', seturi: 3, repetari: 8, greutate: 30, pauzaSec: 150 },
        { exerciseId: 'ramat-haltera-aplecat', seturi: 3, repetari: 8, greutate: 30, pauzaSec: 150 },
        { exerciseId: 'impins-haltera-inclinat', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
        { exerciseId: 'flexii-bara-z', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 60 },
        { exerciseId: 'ridicari-laterale', seturi: 3, repetari: 10, greutate: 5, pauzaSec: 60 },
        { exerciseId: 'extensii-cablu-triceps', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 60 },
        { exerciseId: 'rasuciri-cablu-oblici', seturi: 3, repetari: 20, greutate: 10, pauzaSec: 60 },
        ],
      },
      {
        id: 'r1c',
        items: [
        { exerciseId: 'fandari-bulgaresti', seturi: 3, repetari: 8, greutate: 8, pauzaSec: 150 },
        { exerciseId: 'impins-priza-ingusta', seturi: 3, repetari: 8, greutate: 20, pauzaSec: 150 },
        { exerciseId: 'impins-gantere-banca', seturi: 3, repetari: 8, greutate: 12, pauzaSec: 150 },
        { exerciseId: 'flexii-inclinat-gantere', seturi: 3, repetari: 10, greutate: 6, pauzaSec: 60 },
        { exerciseId: 'tractiuni-helcometru', seturi: 3, repetari: 10, greutate: 30, pauzaSec: 60 },
        { exerciseId: 'face-pull', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 60 },
        { exerciseId: 'ridicari-picioare-atarnat', seturi: 3, repetari: 20, pauzaSec: 60 },
        ],
      },
      {
        id: 'r2a',
        items: [
        { exerciseId: 'genuflexiuni-haltera', seturi: 3, repetari: 8, greutate: 35, pauzaSec: 180 },
        { exerciseId: 'ramat-haltera-aplecat', seturi: 3, repetari: 8, greutate: 32.5, pauzaSec: 150 },
        { exerciseId: 'impins-haltera-banca', seturi: 3, repetari: 8, greutate: 30, pauzaSec: 180 },
        { exerciseId: 'tractiuni-supinat', seturi: 3, pauzaSec: 60 },
        { exerciseId: 'fondari-paralele-libere', seturi: 3, pauzaSec: 60 },
        { exerciseId: 'ridicari-gambe', seturi: 3, repetari: 20, greutate: 40, pauzaSec: 60 },
        { exerciseId: 'ridicari-trunchi', seturi: 3, repetari: 20, pauzaSec: 60 },
        ],
      },
      {
        id: 'r2b',
        items: [
        { exerciseId: 'indreptari-clasice', seturi: 3, repetari: 8, greutate: 45, pauzaSec: 180 },
        { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 8, greutate: 22.5, pauzaSec: 180 },
        { exerciseId: 'tractiuni-bara', seturi: 3, pauzaSec: 150 },
        { exerciseId: 'ridicari-laterale', seturi: 3, repetari: 10, greutate: 5, pauzaSec: 60 },
        { exerciseId: 'face-pull', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 60 },
        { exerciseId: 'ridicari-umeri-haltera', seturi: 3, repetari: 10, greutate: 40, pauzaSec: 60 },
        { exerciseId: 'rasuciri-cablu-oblici', seturi: 3, repetari: 20, greutate: 10, pauzaSec: 60 },
        ],
      },
    ],
  },
  {
    id: 'ppl',
    nivel: 2,
    obiective: ['masa', 'forta'],
    antrenamente: [
      {
        id: 'push',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
        { exerciseId: 'impins-haltera-banca', seturi: 4, repetari: 8, greutate: 30, pauzaSec: 150 },
        { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 10, greutate: 20, pauzaSec: 120 },
        { exerciseId: 'impins-gantere-inclinat', seturi: 3, repetari: 10, greutate: 12, pauzaSec: 90 },
        { exerciseId: 'ridicari-laterale', seturi: 3, repetari: 15, greutate: 5, pauzaSec: 60 },
        { exerciseId: 'extensii-cablu-triceps', seturi: 3, repetari: 12, greutate: 15, pauzaSec: 60 },
        { exerciseId: 'flotari-diamant', seturi: 2, repetari: 10, pauzaSec: 60 },
        ],
      },
      {
        id: 'pull',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
        { exerciseId: 'ramat-haltera-aplecat', seturi: 4, repetari: 8, greutate: 30, pauzaSec: 150 },
        { exerciseId: 'tractiuni-helcometru', seturi: 3, repetari: 10, greutate: 35, pauzaSec: 120 },
        { exerciseId: 'ramat-cablu-un-brat', seturi: 3, repetari: 12, greutate: 20, pauzaSec: 90 },
        { exerciseId: 'face-pull', seturi: 3, repetari: 15, greutate: 15, pauzaSec: 60 },
        { exerciseId: 'flexii-bara-z', seturi: 3, repetari: 12, greutate: 15, pauzaSec: 60 },
        { exerciseId: 'flexii-ciocan', seturi: 2, repetari: 12, greutate: 8, pauzaSec: 60 },
        ],
      },
      {
        id: 'legs',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
        { exerciseId: 'genuflexiuni-haltera', seturi: 4, repetari: 8, greutate: 35, pauzaSec: 180 },
        { exerciseId: 'indreptari-romanesti', seturi: 3, repetari: 10, greutate: 30, pauzaSec: 120 },
        { exerciseId: 'presa-picioare', seturi: 3, repetari: 12, greutate: 60, pauzaSec: 120 },
        { exerciseId: 'flexii-ischiogambieri', seturi: 3, repetari: 12, greutate: 25, pauzaSec: 90 },
        { exerciseId: 'ridicari-gambe', seturi: 4, repetari: 15, greutate: 40, pauzaSec: 60 },
        { exerciseId: 'plank', seturi: 3, durataSec: 40, pauzaSec: 60 },
        ],
      },
    ],
  },
  {
    id: 'upper-lower',
    nivel: 2,
    obiective: ['masa', 'forta'],
    antrenamente: [
      {
        id: 'sus-a',
        items: [
        { exerciseId: 'impins-haltera-banca', seturi: 4, repetari: 6, greutate: 32.5, pauzaSec: 180 },
        { exerciseId: 'ramat-haltera-aplecat', seturi: 4, repetari: 6, greutate: 32.5, pauzaSec: 180 },
        { exerciseId: 'presa-umeri-haltera', seturi: 3, repetari: 8, greutate: 22.5, pauzaSec: 150 },
        { exerciseId: 'tractiuni-supinat', seturi: 3, pauzaSec: 120 },
        { exerciseId: 'extensii-triceps-frunte', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 75 },
        { exerciseId: 'flexii-bara-z', seturi: 3, repetari: 10, greutate: 15, pauzaSec: 75 },
        ],
      },
      {
        id: 'jos-a',
        items: [
        { exerciseId: 'genuflexiuni-haltera', seturi: 4, repetari: 6, greutate: 40, pauzaSec: 180 },
        { exerciseId: 'indreptari-romanesti', seturi: 3, repetari: 8, greutate: 35, pauzaSec: 150 },
        { exerciseId: 'presa-picioare', seturi: 3, repetari: 10, greutate: 70, pauzaSec: 120 },
        { exerciseId: 'ridicari-gambe', seturi: 4, repetari: 12, greutate: 45, pauzaSec: 60 },
        { exerciseId: 'ridicari-picioare-atarnat', seturi: 3, repetari: 10, pauzaSec: 60 },
        ],
      },
      {
        id: 'sus-b',
        items: [
        { exerciseId: 'impins-gantere-inclinat', seturi: 4, repetari: 12, greutate: 12, pauzaSec: 90 },
        { exerciseId: 'tractiuni-helcometru', seturi: 4, repetari: 12, greutate: 35, pauzaSec: 90 },
        { exerciseId: 'presa-umeri-gantere', seturi: 3, repetari: 12, greutate: 10, pauzaSec: 75 },
        { exerciseId: 'ramat-cablu-asezat', seturi: 3, repetari: 12, greutate: 35, pauzaSec: 75 },
        { exerciseId: 'ridicari-laterale', seturi: 4, repetari: 15, greutate: 5, pauzaSec: 45 },
        { exerciseId: 'face-pull', seturi: 3, repetari: 15, greutate: 15, pauzaSec: 45 },
        { exerciseId: 'flexii-ciocan', seturi: 3, repetari: 12, greutate: 8, pauzaSec: 45 },
        ],
      },
      {
        id: 'jos-b',
        items: [
        { exerciseId: 'fandari-bulgaresti', seturi: 3, repetari: 12, greutate: 8, pauzaSec: 90 },
        { exerciseId: 'extensii-cvadriceps', seturi: 3, repetari: 15, greutate: 25, pauzaSec: 60 },
        { exerciseId: 'flexii-ischiogambieri', seturi: 3, repetari: 15, greutate: 25, pauzaSec: 60 },
        { exerciseId: 'hip-thrust', seturi: 3, repetari: 12, greutate: 40, pauzaSec: 90 },
        { exerciseId: 'gambe-asezat', seturi: 4, repetari: 15, greutate: 25, pauzaSec: 45 },
        { exerciseId: 'plank-lateral', seturi: 4, durataSec: 30, pauzaSec: 45 },
        ],
      },
    ],
  },
  {
    id: 'wendler-531',
    nivel: 3,
    obiective: ['forta', 'masa'],
    antrenamente: [
      {
        id: 'presa',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
        { exerciseId: 'presa-umeri-haltera', seturi: 1, repetari: 5, greutate: 20, pauzaSec: 120 },
        { exerciseId: 'presa-umeri-haltera', seturi: 1, repetari: 5, greutate: 25, pauzaSec: 150 },
        { exerciseId: 'presa-umeri-haltera', seturi: 1, repetari: 5, greutate: 27.5, pauzaSec: 180 },
        { exerciseId: 'presa-umeri-haltera', seturi: 5, repetari: 10, greutate: 17.5, pauzaSec: 90 },
        { exerciseId: 'tractiuni-helcometru', seturi: 5, repetari: 10, greutate: 30, pauzaSec: 90 },
        ],
      },
      {
        id: 'indreptari',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
        { exerciseId: 'indreptari-clasice', seturi: 1, repetari: 5, greutate: 50, pauzaSec: 150 },
        { exerciseId: 'indreptari-clasice', seturi: 1, repetari: 5, greutate: 60, pauzaSec: 180 },
        { exerciseId: 'indreptari-clasice', seturi: 1, repetari: 5, greutate: 65, pauzaSec: 210 },
        { exerciseId: 'indreptari-clasice', seturi: 5, repetari: 10, greutate: 40, pauzaSec: 120 },
        { exerciseId: 'ridicari-picioare-atarnat', seturi: 5, repetari: 10, pauzaSec: 60 },
        ],
      },
      {
        id: 'impins',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
        { exerciseId: 'impins-haltera-banca', seturi: 1, repetari: 5, greutate: 30, pauzaSec: 120 },
        { exerciseId: 'impins-haltera-banca', seturi: 1, repetari: 5, greutate: 35, pauzaSec: 150 },
        { exerciseId: 'impins-haltera-banca', seturi: 1, repetari: 5, greutate: 40, pauzaSec: 180 },
        { exerciseId: 'impins-haltera-banca', seturi: 5, repetari: 10, greutate: 25, pauzaSec: 90 },
        { exerciseId: 'ramat-cablu-asezat', seturi: 5, repetari: 10, greutate: 35, pauzaSec: 90 },
        ],
      },
      {
        id: 'genuflexiuni',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 300, pauzaSec: 60 },
        { exerciseId: 'genuflexiuni-haltera', seturi: 1, repetari: 5, greutate: 40, pauzaSec: 150 },
        { exerciseId: 'genuflexiuni-haltera', seturi: 1, repetari: 5, greutate: 45, pauzaSec: 180 },
        { exerciseId: 'genuflexiuni-haltera', seturi: 1, repetari: 5, greutate: 52.5, pauzaSec: 210 },
        { exerciseId: 'genuflexiuni-haltera', seturi: 5, repetari: 10, greutate: 32.5, pauzaSec: 120 },
        { exerciseId: 'flexii-ischiogambieri', seturi: 5, repetari: 10, greutate: 25, pauzaSec: 60 },
        ],
      },
    ],
  },
  {
    id: 'calistenice-start',
    nivel: 1,
    obiective: ['forta', 'slabit', 'rezistenta'],
    antrenamente: [
      {
        id: 'cal-a',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 240, pauzaSec: 45 },
        { exerciseId: 'flotari-inclinate', seturi: 4, repetari: 10, pauzaSec: 90 },
        { exerciseId: 'fondari-paralele-libere', seturi: 3, repetari: 6, pauzaSec: 90 },
        { exerciseId: 'flotari-diamant', seturi: 3, repetari: 8, pauzaSec: 75 },
        { exerciseId: 'plank', seturi: 3, durataSec: 40, pauzaSec: 60 },
        { exerciseId: 'plank-lateral', seturi: 2, durataSec: 30, pauzaSec: 45 },
        ],
      },
      {
        id: 'cal-b',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 240, pauzaSec: 45 },
        { exerciseId: 'atarnare-bara', seturi: 3, durataSec: 30, pauzaSec: 60 },
        { exerciseId: 'tractiuni-negative', seturi: 4, repetari: 4, pauzaSec: 120 },
        { exerciseId: 'ramat-orizontal-bara', seturi: 4, repetari: 10, pauzaSec: 90 },
        { exerciseId: 'superman', seturi: 3, repetari: 12, pauzaSec: 45 },
        { exerciseId: 'birddog', seturi: 3, repetari: 10, pauzaSec: 45 },
        ],
      },
      {
        id: 'cal-c',
        items: [
        { exerciseId: 'incalzire-articulara', seturi: 1, durataSec: 240, pauzaSec: 45 },
        { exerciseId: 'genuflexiuni-corp', seturi: 4, repetari: 15, pauzaSec: 75 },
        { exerciseId: 'fandari-mers', seturi: 3, repetari: 12, pauzaSec: 75 },
        { exerciseId: 'urcari-banca', seturi: 3, repetari: 12, pauzaSec: 60 },
        { exerciseId: 'pod-fesier-sol', seturi: 3, repetari: 15, pauzaSec: 60 },
        { exerciseId: 'ridicari-picioare-atarnat', seturi: 3, repetari: 8, pauzaSec: 60 },
        { exerciseId: 'catarare-frankie', seturi: 3, durataSec: 30, pauzaSec: 60 },
        ],
      },
    ],
  },
];

export const OBIECTIVE_IDS: ProgramGoal[] = ['forta', 'masa', 'slabit', 'rezistenta', 'tehnica'];

/** Emoji-urile obiectivelor — nu depind de limbă. */
export const EMOJI_OBIECTIV: Record<ProgramGoal, string> = {
  forta: '🏋️',
  masa: '💪',
  slabit: '🔥',
  rezistenta: '🫀',
  tehnica: '🎯',
};

export function numeObiectiv(id: ProgramGoal): string {
  return pachetCatalog().obiective[id] ?? id;
}

export function obiective(): { id: ProgramGoal; nume: string; emoji: string }[] {
  return OBIECTIVE_IDS.map((id) => ({ id, nume: numeObiectiv(id), emoji: EMOJI_OBIECTIV[id] }));
}

/** Programele, cu textul limbii active lipit peste structură. */
export function programe(): ProgramDef[] {
  const text = pachetCatalog().programe;
  return PROGRAME_CORE.map((c) => {
    const t = text[c.id];
    return {
      ...c,
      nume: t.nume,
      subtitlu: t.subtitlu,
      origine: t.origine,
      descriere: t.descriere,
      frecventa: t.frecventa,
      durata: t.durata,
      etichete: t.etichete,
      saptamana: t.saptamana,
      progresie: t.progresie,
      note: t.note,
      antrenamente: c.antrenamente.map((w, i) => ({
        ...w,
        nume: t.antrenamente[i].nume,
        descriere: t.antrenamente[i].descriere,
        faza: t.antrenamente[i].faza,
        items: w.items.map((it, j) => ({ ...it, notite: t.antrenamente[i].notite[j] })),
      })),
    };
  });
}

export function getProgram(id: string): ProgramDef | undefined {
  return programe().find((p) => p.id === id);
}

export function numaraExercitii(p: ProgramDef): number {
  return p.antrenamente.reduce((a, w) => a + w.items.length, 0);
}

/** Estimarea de minute a unui antrenament: lucru + pauze. */
export function minuteEstimate(items: TemplateItem[]): number {
  return Math.round(items.reduce((a, i) => a + i.seturi * ((i.durataSec ?? 40) + i.pauzaSec), 0) / 60);
}
