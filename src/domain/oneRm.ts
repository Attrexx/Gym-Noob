/**
 * Estimarea maximului pe o repetare (1RM) — formula Epley.
 * Validă rezonabil pentru 1-12 repetări; peste, subestimează.
 */
export function epley1Rm(greutate: number, repetari: number): number {
  if (repetari <= 0 || greutate <= 0) return 0;
  if (repetari === 1) return greutate;
  return Math.round(greutate * (1 + repetari / 30) * 10) / 10;
}

/** Greutatea recomandată pentru un număr de repetări, dat 1RM-ul. */
export function greutatePentruReps(oneRm: number, repetari: number): number {
  if (repetari <= 1) return oneRm;
  return Math.round((oneRm / (1 + repetari / 30)) * 2) / 2; // rotunjit la 0.5 kg
}
