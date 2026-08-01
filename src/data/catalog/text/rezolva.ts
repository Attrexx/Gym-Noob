import type { Template } from '@/data/types';
import { PROGRAME_CORE } from '../programs';
import { pachetCatalog } from './activ';

/**
 * Textul șabloanelor care au venit de la noi, în limba curentă.
 *
 * Problema pe care o rezolvă: la import (șabloane de start, program celebru)
 * textul catalogului se COPIAZĂ în datele utilizatorului. Dacă am lăsa așa,
 * un plan importat ar rămâne pe veci în limba din ziua importului.
 *
 * Soluția NU e să rescriem rândurile la schimbarea limbii — sincronizarea e
 * last-write-wins, deci două dispozitive cu limbi diferite s-ar rescrie
 * reciproc la infinit. În schimb, ținem minte PROVENIENȚA (`sursaText`) și
 * traducem la afișare.
 *
 * `nume` rămâne în baza de date ca ultimă valoare scrisă, deci exportul,
 * backup-ul și orice cod care nu trece pe aici arată tot ceva sensibil — și e
 * plasa de siguranță când `sursaText` trimite spre un program care nu mai
 * există, caz pe care codul de azi nu-l trata deloc.
 */

export const sursaStarter = (index: number): string => `starter:${index}`;
export const sursaProgram = (programId: string, workoutId: string): string =>
  `program:${programId}/${workoutId}`;

interface TextSablon {
  nume: string;
  descriere?: string;
}

function dinSursa(sursa: string): TextSablon | undefined {
  const pachet = pachetCatalog();

  if (sursa.startsWith('starter:')) {
    const i = Number(sursa.slice('starter:'.length));
    const t = pachet.sabloaneStart[i];
    return t ? { nume: t.nume, descriere: t.descriere } : undefined;
  }

  if (sursa.startsWith('program:')) {
    const [programId, workoutId] = sursa.slice('program:'.length).split('/');
    const text = pachet.programe[programId as keyof typeof pachet.programe];
    if (!text) return undefined;
    const core = PROGRAME_CORE.find((p) => p.id === programId);
    const i = core?.antrenamente.findIndex((w) => w.id === workoutId) ?? -1;
    if (i < 0) return undefined;
    const w = text.antrenamente[i];
    return w ? { nume: w.nume, descriere: w.descriere ?? text.subtitlu } : undefined;
  }

  return undefined;
}

/** Numele de afișat: al utilizatorului dacă l-a atins, altfel cel din catalog. */
export function numeSablon(t: Template): string {
  if (t.textEditat || !t.sursaText) return t.nume;
  return dinSursa(t.sursaText)?.nume ?? t.nume;
}

export function descriereSablon(t: Template): string | undefined {
  if (t.textEditat || !t.sursaText) return t.descriere;
  return dinSursa(t.sursaText)?.descriere ?? t.descriere;
}
