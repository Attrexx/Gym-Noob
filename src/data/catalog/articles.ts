import type { ArticleId } from './ids';
import { pachetCatalog } from './text/activ';

/**
 * Ghidul — STRUCTURA. Titlurile, rezumatele și paragrafele stau în
 * `text/<limbă>.ts`.
 */
export interface Article {
  id: ArticleId;
  titlu: string;
  emoji: string;
  rezumat: string;
  /** paragrafe; rândurile care încep cu «• » devin liste */
  continut: string[];
}

/** Emoji-urile articolelor — nu depind de limbă. */
export const EMOJI_ARTICOL: Record<ArticleId, string> = {
  'eticheta': '🤝',
  'incalzire': '🔥',
  'febra': '🤕',
  'supraincarcarea': '📈',
  'nutritie': '🍽️',
  'hidratare': '💧',
  'somn': '😴',
  'primele-saptamani': '🗓️',
};

const ORDINE: ArticleId[] = ['eticheta', 'incalzire', 'febra', 'supraincarcarea', 'nutritie', 'hidratare', 'somn', 'primele-saptamani'];

export function articole(): Article[] {
  const text = pachetCatalog().articole;
  return ORDINE.map((id) => ({ id, emoji: EMOJI_ARTICOL[id], ...text[id] }));
}

export function getArticol(id: string): Article | undefined {
  return articole().find((a) => a.id === id);
}
