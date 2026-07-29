/**
 * Sunete generate cu Web Audio — fără fișiere, funcționează offline.
 * Toate respectă setarea „sunete" a profilului (verificată de apelant).
 */
let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function ton(frecventa: number, durataMs: number, cand = 0, volum = 0.25, tip: OscillatorType = 'square') {
  const a = ac();
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = tip;
  osc.frequency.value = frecventa;
  const t0 = a.currentTime + cand / 1000;
  const t1 = t0 + durataMs / 1000;
  gain.gain.setValueAtTime(volum, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t1);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t1);
}

export const sunete = {
  /** bip scurt de numărătoare inversă (ultimele 3 secunde) */
  tic: () => ton(880, 90, 0, 0.15),
  /** pauza s-a terminat — înapoi la treabă */
  gata: () => {
    ton(660, 120);
    ton(880, 120, 140);
    ton(1100, 220, 300);
  },
  /** set înregistrat */
  set: () => ton(520, 100, 0, 0.18, 'triangle'),
  /** record personal! */
  record: () => {
    ton(523, 130);
    ton(659, 130, 140);
    ton(784, 130, 280);
    ton(1047, 320, 420);
  },
  /** start sesiune */
  start: () => {
    ton(392, 110);
    ton(523, 200, 130);
  },
  /** sfârșit sesiune */
  stop: () => {
    ton(523, 110);
    ton(392, 250, 130);
  },
  metronomTic: (accent: boolean) => ton(accent ? 1200 : 800, 45, 0, accent ? 0.22 : 0.12),
};

export function vibreaza(model: number | number[]) {
  if ('vibrate' in navigator) navigator.vibrate(model);
}

/**
 * Metronom pentru cadență (tempo). Rulează pe interval JS — suficient
 * de precis pentru uz uman la sală.
 */
export class Metronom {
  private timer: ReturnType<typeof setInterval> | null = null;
  private faza = 0;
  /** faze: coborâre-pauză-ridicare, în secunde */
  start(tempo: string, onFaza?: (nume: string, idx: number) => void) {
    this.stop();
    const parti = tempo.split('-').map(Number).filter((n) => n > 0);
    if (parti.length < 2) return;
    const nume = parti.length === 3 ? ['Coboară', 'Ține', 'Ridică'] : ['Coboară', 'Ridică'];
    let sec = 0;
    this.faza = 0;
    sunete.metronomTic(true);
    onFaza?.(nume[0], 0);
    this.timer = setInterval(() => {
      sec++;
      if (sec >= parti[this.faza]) {
        sec = 0;
        this.faza = (this.faza + 1) % parti.length;
        sunete.metronomTic(this.faza === 0);
        onFaza?.(nume[this.faza], this.faza);
      } else {
        sunete.metronomTic(false);
      }
    }, 1000);
  }
  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
  get activ() {
    return this.timer !== null;
  }
}
