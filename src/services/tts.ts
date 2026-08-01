import { TAG, type Limba } from '@/i18n/types';
import { limbaActiva } from '@/i18n/store';

/**
 * Indicații vocale prin SpeechSynthesis (merg în căști, offline pe
 * majoritatea telefoanelor). Dezactivate implicit — se activează din Setări.
 *
 * Vocile se cachează pe eticheta BCP-47, nu într-o variabilă unică: la
 * schimbarea limbii pur și simplu nimerim altă cheie, deci nu e nevoie de
 * nicio invalidare explicită.
 *
 * De știut: multe telefoane Android nu au voce românească instalată, iar
 * atunci vorbitorul implicit citește româna cu accentul lui. Engleza e
 * practic mereu prezentă, deci acolo sună chiar bine.
 */
const voci = new Map<string, SpeechSynthesisVoice | null>();

function gasesteVoce(tag: string): SpeechSynthesisVoice | null {
  const dinCache = voci.get(tag);
  if (dinCache !== undefined) return dinCache;
  const primar = tag.slice(0, 2).toLowerCase();
  const toate = window.speechSynthesis?.getVoices() ?? [];
  const gasita =
    toate.find((v) => v.lang.toLowerCase().replace('_', '-') === tag.toLowerCase()) ??
    toate.find((v) => v.lang.toLowerCase().startsWith(primar)) ??
    null;
  voci.set(tag, gasita);
  return gasita;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => voci.clear();
}

export function spune(text: string, limba: Limba = limbaActiva()) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const tag = TAG[limba];
  const u = new SpeechSynthesisUtterance(text);
  u.lang = tag;
  const voce = gasesteVoce(tag);
  if (voce) u.voice = voce;
  u.rate = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
