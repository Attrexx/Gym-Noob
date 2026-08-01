import type { PachetCatalog } from './types';

/**
 * Pachetul de text al limbii active.
 *
 * Stă într-un modul propriu, mic, fiindcă îl citesc toate fișierele de catalog
 * (exerciții, programe, articole, sfaturi, șabloane) — dacă ar sta în unul
 * dintre ele, celelalte ar depinde de el fără motiv.
 *
 * Îl scrie `incarcaLimba()`, prin `aplicaTextCatalog()`.
 */
let activ: PachetCatalog | null = null;

export function seteazaPachetCatalog(p: PachetCatalog): void {
  activ = p;
}

export function pachetCatalog(): PachetCatalog {
  if (!activ) throw new Error('catalog: nicio limbă încărcată — cheamă incarcaLimba() înainte');
  return activ;
}
