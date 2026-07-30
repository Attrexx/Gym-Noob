import { useEffect } from 'react';
import { useProfile } from '@/state/profileStore';
import { useCont } from '@/data/sync/authStore';
import { runSync } from '@/data/sync/engine';

/**
 * Declanșatoarele sincronizării, montate o dată în App:
 * la pornire / schimbare de profil, la revenirea în prim-plan și la
 * recăpătarea conexiunii. (Al patrulea declanșator — încheierea sesiunii —
 * trăiește în sessionStore.opreste.)
 */
export function SyncBoot() {
  const profilUid = useProfile((s) => s.profil?.uid);

  useEffect(() => {
    void useCont.getState().hidrateaza(profilUid);
    if (profilUid) void runSync('pornire');
  }, [profilUid]);

  useEffect(() => {
    const laVizibil = () => {
      if (document.visibilityState === 'visible') void runSync('vizibil');
    };
    const laOnline = () => void runSync('online');
    document.addEventListener('visibilitychange', laVizibil);
    window.addEventListener('online', laOnline);
    return () => {
      document.removeEventListener('visibilitychange', laVizibil);
      window.removeEventListener('online', laOnline);
    };
  }, []);

  return null;
}
