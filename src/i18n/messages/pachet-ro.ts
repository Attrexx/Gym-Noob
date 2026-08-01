/**
 * Pachetul complet al unei limbi — ținta unui singur `import()`.
 *
 * Mesajele UI și textul catalogului pleacă împreună, într-un singur chunk: o
 * singură stare de încărcare, fără cadre pe jumătate traduse. Textul
 * catalogului se adaugă aici la etapa 4 (`@/data/catalog/text/ro`).
 */
import { catalogRo } from '@/data/catalog/text/ro';
import { ro } from './ro';
import type { Pachet } from '../types-pachet';

export const pachet: Pachet = { mesaje: ro, catalog: catalogRo };
