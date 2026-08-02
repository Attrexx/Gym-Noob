import type { PachetCatalog } from '@/data/catalog/text/types';
import type { Mesaje, Traducere } from './types';

/**
 * Tot ce ține de o limbă, într-un singur obiect încărcat leneș: mesajele
 * interfeței + textul catalogului. Împreună, ca să nu existe niciun cadru
 * desenat pe jumătate tradus.
 *
 * `mesaje` e `Traducere<Mesaje>`, nu `Mesaje`: aceleași chei, dar categoriile
 * de plural sunt ale limbii. Româna are `one/few/other` („20 DE exerciții"),
 * engleza doar `one/other` — dacă tipul ar fi `Mesaje`, engleza ar trebui să
 * inventeze un `few` pe care `Intl.PluralRules` nu-l cere niciodată.
 */
export interface Pachet {
  mesaje: Traducere<Mesaje>;
  catalog: PachetCatalog;
}
