/**
 * The complete English pack — the target of a single `import()`.
 *
 * UI messages and catalogue text travel together in one chunk: one loading
 * state, and never a half-translated frame on screen. Same shape as
 * `pachet-ro.ts`; adding a third language means one more file like this.
 */
import { catalogEn } from '@/data/catalog/text/en';
import { en } from './en';
import type { Pachet } from '../types-pachet';

export const pachet: Pachet = { mesaje: en, catalog: catalogEn };
