/**
 * Indicații vocale în română prin SpeechSynthesis (merge în căști,
 * offline pe majoritatea telefoanelor). Dezactivat implicit — se
 * activează din Setări.
 */
let voceRo: SpeechSynthesisVoice | null | undefined;

function gasesteVoce(): SpeechSynthesisVoice | null {
  if (voceRo !== undefined) return voceRo;
  const voci = window.speechSynthesis?.getVoices() ?? [];
  voceRo = voci.find((v) => v.lang.toLowerCase().startsWith('ro')) ?? null;
  return voceRo;
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    voceRo = undefined;
    gasesteVoce();
  };
}

export function spune(text: string) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ro-RO';
  const voce = gasesteVoce();
  if (voce) u.voice = voce;
  u.rate = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
