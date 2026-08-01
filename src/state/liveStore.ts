import { create } from 'zustand';
import type { TipAparat } from '@/data/types';
import type { DateAparat } from '@/domain/ftms';

/**
 * Date live care NU au ce căuta în localStorage: conexiunea la aparatul
 * Bluetooth și estimările în curs. `sessionStore` se persistă în întregime,
 * iar un handle GATT sau un eșantion de acum 3 secunde n-au sens după un
 * refresh — de aceea stau aici, într-un store separat și volatil.
 */

export interface AparatConectat {
  tip: TipAparat;
  /** ce scrie pe aparat: „Star Trac 8TR" (din Device Information sau numele BLE) */
  model: string;
  deviceName: string;
  deconecteaza: () => void;
}

/** Mediile pe setul curent, calculate din eșantioanele primite. */
export interface RezumatSetAparat {
  aparatTip?: TipAparat;
  aparatModel?: string;
  distantaM?: number;
  cadentaMedie?: number;
  putereMedieW?: number;
  kcalAparat?: number;
}

interface Acumulator {
  putereSuma: number;
  putereNr: number;
  cadentaSuma: number;
  cadentaNr: number;
  /** distanța/caloriile aparatului sunt cumulative de la pornirea lui,
   *  deci reținem valoarea de la începutul setului și scădem */
  distantaStart?: number;
  distantaUltim?: number;
  kcalStart?: number;
  kcalUltim?: number;
}

const ACUMULATOR_GOL: Acumulator = { putereSuma: 0, putereNr: 0, cadentaSuma: 0, cadentaNr: 0 };

export interface LiveExtraState {
  aparat: AparatConectat | null;
  ultim: DateAparat | null;
  acum: Acumulator;
  /** calorii estimate pentru setul aflat în desfășurare (doar pentru afișare) */
  kcalParial: number;

  setAparat: (a: AparatConectat | null) => void;
  esantion: (d: DateAparat) => void;
  reseteazaSet: () => void;
  rezumatSet: () => RezumatSetAparat;
  setKcalParial: (kcal: number) => void;
}

export const useLive = create<LiveExtraState>()((set, get) => ({
  aparat: null,
  ultim: null,
  acum: { ...ACUMULATOR_GOL },
  kcalParial: 0,

  setAparat: (a) => set({ aparat: a, ultim: null, acum: { ...ACUMULATOR_GOL } }),

  esantion: (d) => {
    const a = { ...get().acum };
    if (d.putereW !== undefined && d.putereW > 0) {
      a.putereSuma += d.putereW;
      a.putereNr += 1;
    }
    if (d.cadenta !== undefined && d.cadenta > 0) {
      a.cadentaSuma += d.cadenta;
      a.cadentaNr += 1;
    }
    if (d.distantaM !== undefined) {
      if (a.distantaStart === undefined) a.distantaStart = d.distantaM;
      // dacă aparatul s-a resetat în timpul setului, repornim de la el
      if (d.distantaM < (a.distantaUltim ?? 0)) a.distantaStart = d.distantaM;
      a.distantaUltim = d.distantaM;
    }
    if (d.kcalTotal !== undefined) {
      if (a.kcalStart === undefined) a.kcalStart = d.kcalTotal;
      if (d.kcalTotal < (a.kcalUltim ?? 0)) a.kcalStart = d.kcalTotal;
      a.kcalUltim = d.kcalTotal;
    }
    set({ ultim: d, acum: a });
  },

  reseteazaSet: () => set({ acum: { ...ACUMULATOR_GOL }, kcalParial: 0 }),

  rezumatSet: () => {
    const { aparat, acum } = get();
    if (!aparat) return {};
    const r: RezumatSetAparat = { aparatTip: aparat.tip, aparatModel: aparat.model };
    if (acum.distantaUltim !== undefined && acum.distantaStart !== undefined) {
      const d = acum.distantaUltim - acum.distantaStart;
      if (d > 0) r.distantaM = Math.round(d);
    }
    if (acum.kcalUltim !== undefined && acum.kcalStart !== undefined) {
      const k = acum.kcalUltim - acum.kcalStart;
      if (k > 0) r.kcalAparat = Math.round(k);
    }
    if (acum.putereNr > 0) r.putereMedieW = Math.round(acum.putereSuma / acum.putereNr);
    if (acum.cadentaNr > 0) r.cadentaMedie = Math.round((acum.cadentaSuma / acum.cadentaNr) * 10) / 10;
    return r;
  },

  setKcalParial: (kcal) => set({ kcalParial: kcal }),
}));
