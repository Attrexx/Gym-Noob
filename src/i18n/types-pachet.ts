import type { PachetCatalog } from '@/data/catalog/text/types';
import type { Mesaje } from './types';

/**
 * Tot ce ține de o limbă, într-un singur obiect încărcat leneș: mesajele
 * interfeței + textul catalogului. Împreună, ca să nu existe niciun cadru
 * desenat pe jumătate tradus.
 */
export interface Pachet {
  mesaje: Mesaje;
  catalog: PachetCatalog;
}
