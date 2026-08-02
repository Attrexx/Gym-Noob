import type { Limba } from '../types';
import type { Pachet } from '../types-pachet';

/**
 * Registrul limbilor. O limbă nouă = o linie aici + fișierele ei.
 * Fiecare pachet e un `import()` separat, deci în bundle intră doar limba activă.
 */
export const PACHETE: Record<Limba, () => Promise<Pachet>> = {
  ro: () => import('./pachet-ro').then((m) => m.pachet),
  en: () => import('./pachet-en').then((m) => m.pachet),
};
