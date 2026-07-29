import { useEffect, useState } from 'react';

/** Re-randează componenta la fiecare `ms` milisecunde (pentru cronometre). */
export function useTick(ms = 1000, activ = true) {
  const [, setT] = useState(0);
  useEffect(() => {
    if (!activ) return;
    const id = setInterval(() => setT((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms, activ]);
}

export function fmtDurata(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
}
