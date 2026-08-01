import type { Mesaje } from './types';

/**
 * Tot ce ține de o limbă, într-un singur obiect încărcat leneș.
 * La etapa 4 primește și `catalog: PachetCatalog` (textul celor 98 de exerciții,
 * al programelor și al articolelor).
 */
export interface Pachet {
  mesaje: Mesaje;
}
