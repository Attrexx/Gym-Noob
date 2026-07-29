import type { Sex } from '@/data/types';

/**
 * Estimarea procentului de grăsime corporală — formula US Navy.
 * Cere talie + gât (și șold la femei), toate în cm. Returnează
 * procent (0-100) sau null dacă lipsesc măsurătorile.
 */
export function bodyFatNavy(
  sex: Sex,
  inaltimeCm: number,
  talieCm?: number,
  gatCm?: number,
  soldCm?: number,
): number | null {
  if (!talieCm || !gatCm) return null;
  if (sex === 'M') {
    if (talieCm - gatCm <= 0) return null;
    const v = 495 / (1.0324 - 0.19077 * Math.log10(talieCm - gatCm) + 0.15456 * Math.log10(inaltimeCm)) - 450;
    return clamp(v);
  }
  if (!soldCm) return null;
  if (talieCm + soldCm - gatCm <= 0) return null;
  const v =
    495 / (1.29579 - 0.35004 * Math.log10(talieCm + soldCm - gatCm) + 0.221 * Math.log10(inaltimeCm)) - 450;
  return clamp(v);
}

function clamp(v: number): number | null {
  if (!Number.isFinite(v)) return null;
  return Math.round(Math.min(60, Math.max(2, v)) * 10) / 10;
}
