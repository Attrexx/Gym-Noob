import { useMemo } from 'react';
import { limbaActiva, useI18n } from './store';
import { t } from './runtime';
import * as fmt from './format';

/**
 * Abonamentul componentelor la limbă.
 *
 * `versiune` e singurul lucru pe care îl citim din store, deci o componentă se
 * redesenează exact când se schimbă limba — nu la orice modificare de setări.
 *
 *   const { t } = useT();
 *   <h1>{t('setari.titlu')}</h1>
 *
 * De la etapa 4 tot de aici vin și accesoarele de catalog, ca orice componentă
 * care afișează text din catalog să fie automat abonată.
 */
export function useT() {
  const versiune = useI18n((s) => s.versiune);
  return useMemo(() => ({ t, fmt, limba: limbaActiva() }), [versiune]);
}
