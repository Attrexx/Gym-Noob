import { useEffect, useRef, useState } from 'react';
import { secundeTotale, useSession } from '@/state/sessionStore';
import { useLive } from '@/state/liveStore';
import { getExercise } from '@/data/catalog/exercises';
import { descrieAparat } from '@/i18n/descrieri';
import { useT } from '@/i18n';
import { fmtDurata, useTick } from './useTick';

const PRAG_INACTIVITATE_MS = 45_000;
const PRAG_MISCARE = 4; // m/s² diferență față de citirea anterioară

/**
 * Economizor de ecran în timpul sesiunii — ca pe un ceas smart:
 * după 45 s fără atingeri, ecranul devine negru cu esențialul estompat
 * (alb + galben). Se trezește la atingere sau la mișcarea telefonului.
 * Împreună cu wake lock-ul, ecranul nu se stinge, dar nici nu orbește
 * și nu mănâncă bateria cu fundalul galben la luminozitate maximă.
 */
export function Screensaver(props: { activ: boolean }) {
  const { t } = useT();
  const [adormit, setAdormit] = useState(false);
  const ultimaAtingere = useRef(Date.now());
  const ultimaAcc = useRef<number | null>(null);
  useTick(1000);

  useEffect(() => {
    const trezeste = () => {
      ultimaAtingere.current = Date.now();
      setAdormit(false);
    };
    const laMiscar = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null) return;
      const mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2);
      if (ultimaAcc.current !== null && Math.abs(mag - ultimaAcc.current) > PRAG_MISCARE) trezeste();
      ultimaAcc.current = mag;
    };
    window.addEventListener('pointerdown', trezeste, { passive: true });
    window.addEventListener('keydown', trezeste);
    window.addEventListener('devicemotion', laMiscar);
    return () => {
      window.removeEventListener('pointerdown', trezeste);
      window.removeEventListener('keydown', trezeste);
      window.removeEventListener('devicemotion', laMiscar);
    };
  }, []);

  // adormim după pragul de inactivitate (verificat la fiecare tick)
  useEffect(() => {
    if (props.activ && !adormit && Date.now() - ultimaAtingere.current > PRAG_INACTIVITATE_MS) {
      setAdormit(true);
    }
  });

  const s = useSession();
  const aparat = useLive((l) => l.aparat);
  const ultimAparat = useLive((l) => l.ultim);
  const kcalParial = useLive((l) => l.kcalParial);
  if (!props.activ || !adormit) return null;

  // aceleași cifre ca în antet, ca să nu trebuiască să trezești ecranul
  const sec = secundeTotale(s);
  const restRamas = s.restEndsMs ? Math.max(0, Math.ceil((s.restEndsMs - Date.now()) / 1000)) : null;
  const ex = s.plan[s.exIndex] ? getExercise(s.plan[s.exIndex].exerciseId) : undefined;
  const telemetrie = aparat && ultimAparat ? descrieAparat(aparat.tip, ultimAparat) : '';

  return (
    <div
      onPointerDown={() => setAdormit(false)}
      role="button"
      aria-label={t('economizor.aria')}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {restRamas !== null && restRamas > 0 ? (
        <>
          <div style={{ color: 'rgba(245,197,24,0.55)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
            {t('economizor.pauza')}
          </div>
          <div style={{ fontFamily: 'var(--font-titlu)', fontSize: '5.5rem', color: 'rgba(245,197,24,0.85)', lineHeight: 1 }}>
            {fmtDurata(restRamas)}
          </div>
        </>
      ) : (
        <div style={{ fontFamily: 'var(--font-titlu)', fontSize: '4.5rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}>
          {fmtDurata(sec)}
        </div>
      )}
      {ex && (
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', fontWeight: 700, textAlign: 'center', padding: '0 24px' }}>
          {ex.nume}
        </div>
      )}
      {telemetrie && (
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', fontWeight: 700, textAlign: 'center', padding: '0 24px' }}>
          {telemetrie}
        </div>
      )}
      <div style={{ display: 'flex', gap: 18, color: 'rgba(245,197,24,0.5)', fontSize: '0.9rem', fontWeight: 700 }}>
        <span>🔥 {Math.round(s.kcal + kcalParial)} kcal</span>
        <span>💧 {s.apaMl} ml</span>
        {s.hrUltim ? <span>♥ {s.hrUltim}</span> : null}
        {s.status === 'pauza' ? <span>{t('economizor.pauzaScurt')}</span> : null}
      </div>
      <div style={{ position: 'absolute', bottom: 28, color: 'rgba(255,255,255,0.22)', fontSize: '0.75rem' }}>
        {t('economizor.reveni')}
      </div>
    </div>
  );
}
