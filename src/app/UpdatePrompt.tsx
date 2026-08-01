import { useRegisterSW } from 'virtual:pwa-register/react';
import { BigButton } from '@/design/components';
import { useT } from '@/i18n';

/** Notificare discretă când există o versiune nouă a aplicației. */
export function UpdatePrompt() {
  const { t } = useT();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true });

  if (!needRefresh) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 200,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        background: 'var(--panou)',
        color: 'var(--panou-fg)',
        border: 'var(--grosime) solid var(--contur)',
        borderRadius: 'var(--raza)',
        boxShadow: 'var(--umbra-dura)',
        padding: '10px 12px',
        maxWidth: 560,
        margin: '0 auto',
      }}
    >
      <span style={{ flex: 1, fontWeight: 700, fontSize: '0.9rem' }}>{t('actualizare.disponibila')}</span>
      <BigButton varianta="accent" onClick={() => void updateServiceWorker(true)}>
        {t('actualizare.acum')}
      </BigButton>
      <BigButton varianta="contur" onClick={() => setNeedRefresh(false)}>
        {t('actualizare.maiTarziu')}
      </BigButton>
    </div>
  );
}
