import { create } from 'zustand';
import type { QuotaInfo } from '../../../shared/wire';
import { db } from '../db';

/**
 * Starea CONTULUI pentru profilul activ — doar stare de UI (Zustand), fără
 * logică de rețea: motorul (engine.ts) o împinge de acolo. Sursa durabilă e
 * `db.syncState`; aici e doar oglinda pentru randare.
 */

export type StareCont = 'nelegat' | 'legat' | 'sincronizez' | 'eroare' | 'conflict';

interface ContState {
  stare: StareCont;
  email?: string;
  lastSyncLa?: string;
  lastError?: string;
  /** sesiunea a expirat → formularul de login reapare cu emailul completat */
  sesiuneExpirata: boolean;
  /** eroarea e de cotă → fără reîncercare automată, mesaj dedicat */
  cotaPlina: boolean;
  quota?: QuotaInfo;
  hidrateaza: (profileUid: string | undefined) => Promise<void>;
}

export const useCont = create<ContState>((set) => ({
  stare: 'nelegat',
  sesiuneExpirata: false,
  cotaPlina: false,

  hidrateaza: async (profileUid) => {
    if (!profileUid) {
      set({ stare: 'nelegat', email: undefined, lastSyncLa: undefined, lastError: undefined, sesiuneExpirata: false, cotaPlina: false, quota: undefined });
      return;
    }
    const rand = await db.syncState.get(profileUid);
    if (!rand) {
      set({ stare: 'nelegat', email: undefined, lastSyncLa: undefined, lastError: undefined, sesiuneExpirata: false, cotaPlina: false, quota: undefined });
    } else if (!rand.refreshToken) {
      set({
        stare: 'eroare',
        email: rand.email,
        lastSyncLa: rand.lastSyncLa,
        lastError: 'Sesiunea a expirat — intră din nou în cont.',
        sesiuneExpirata: true,
        cotaPlina: false,
      });
    } else {
      set({
        stare: 'legat',
        email: rand.email,
        lastSyncLa: rand.lastSyncLa,
        lastError: rand.lastError || undefined,
        sesiuneExpirata: false,
        cotaPlina: false,
      });
    }
  },
}));
