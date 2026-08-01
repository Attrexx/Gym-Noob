import { create } from 'zustand';
import type { Profile, Settings } from '@/data/types';
import { db } from '@/data/db';
import { getSettings, touchProfile } from '@/data/repo';
import { incarcaLimba, rezolvaLimba } from '@/i18n/store';
import { t } from '@/i18n/runtime';
import { CHEIE_LIMBA } from '@/i18n/boot';

interface ProfileState {
  incarcat: boolean;
  profil: Profile | null;
  setari: Settings | null;
  incarca: (profileId?: number) => Promise<void>;
  alegeProfil: (p: Profile) => Promise<void>;
  reincarcaProfil: () => Promise<void>;
  actualizeazaSetari: (s: Partial<Settings>) => Promise<void>;
  iesire: () => void;
}

const KEY_ACTIV = 'gym-noob-profil-activ';

export const useProfile = create<ProfileState>((set, get) => ({
  incarcat: false,
  profil: null,
  setari: null,

  incarca: async (profileId?: number) => {
    const id = profileId ?? Number(localStorage.getItem(KEY_ACTIV) ?? 0);
    let profil: Profile | null = null;
    if (id) profil = (await db.profiles.get(id)) ?? null;
    if (!profil) {
      // un singur profil existent → îl alegem automat
      const toate = await db.profiles.toArray();
      if (toate.length === 1) profil = toate[0];
    }
    if (profil) {
      localStorage.setItem(KEY_ACTIV, String(profil.id));
      const setari = await getSettings(profil.id!);
      aplicaTema(setari.tema);
      // înainte de `incarcat: true`, ca App să nu deseneze în limba greșită
      await aplicaLimba(setari.limba);
      set({ profil, setari, incarcat: true });
      void touchProfile(profil.id!);
    } else {
      set({ profil: null, setari: null, incarcat: true });
    }
  },

  alegeProfil: async (p: Profile) => {
    localStorage.setItem(KEY_ACTIV, String(p.id));
    await get().incarca(p.id);
  },

  reincarcaProfil: async () => {
    const { profil } = get();
    if (profil?.id) {
      const proaspat = await db.profiles.get(profil.id);
      if (proaspat) set({ profil: proaspat });
    }
  },

  actualizeazaSetari: async (changes) => {
    const { profil, setari } = get();
    if (!profil?.id || !setari) return;
    const noi = { ...setari, ...changes };
    set({ setari: noi });
    aplicaTema(noi.tema);
    if (changes.limba !== undefined) await aplicaLimba(noi.limba);
    const { updateSettings } = await import('@/data/repo');
    await updateSettings(profil.id, changes);
  },

  iesire: () => {
    localStorage.removeItem(KEY_ACTIV);
    set({ profil: null, setari: null });
  },
}));

/**
 * Perechea lui `aplicaTema`, pentru limbă. Asincronă fiindcă pachetul limbii
 * se încarcă leneș — `versiune` crește abia după ce e gata, deci interfața nu
 * apucă să deseneze un cadru pe jumătate tradus.
 *
 * Aici stă tot ce atinge browserul (localStorage, `<html lang>`, meta), ca
 * `src/i18n/store.ts` să rămână curat și testabil sub vitest.
 */
export async function aplicaLimba(setare: Settings['limba']) {
  const limba = rezolvaLimba(setare);
  try {
    // indiciul de pornire: la următoarea deschidere nimerim din prima
    localStorage.setItem(CHEIE_LIMBA, limba);
  } catch {
    // stocare blocată — mergem mai departe, doar că pornirea va negocia iar
  }
  await incarcaLimba(limba);
  document.documentElement.lang = limba;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', t('meta.descriere'));
}

export function aplicaTema(tema: Settings['tema']) {
  const noapte =
    tema === 'noapte' || (tema === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = noapte ? 'noapte' : 'zi';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', noapte ? '#14110c' : '#F5C518');
}
