/** Ține ecranul aprins în timpul sesiunii (unde browserul o permite). */
let lock: WakeLockSentinel | null = null;

export async function tineEcranAprins() {
  try {
    if ('wakeLock' in navigator && !lock) {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => {
        lock = null;
      });
    }
  } catch {
    // refuzat (baterie mică etc.) — nu e critic
  }
}

export function elibereazaEcranul() {
  void lock?.release();
  lock = null;
}

/** La revenirea în tab, browserul eliberează lock-ul — îl recerem. */
export function reactiveazaLaRevenire(cand: () => boolean): () => void {
  const handler = () => {
    if (document.visibilityState === 'visible' && cand()) void tineEcranAprins();
  };
  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
}
