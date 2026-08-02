import type { MuscleGroup } from '@/data/types';
import { useT } from '@/i18n';

/**
 * Diagrama corpului (față + spate) cu grupele lucrate evidențiate.
 * Roșu plin = grupă principală, hașurat deschis = secundară.
 */
export function MuscleDiagram(props: { principale: MuscleGroup[]; secundare?: MuscleGroup[]; marime?: number }) {
  const { t } = useT();
  const h = props.marime ?? 190;
  const on = (g: MuscleGroup) => props.principale.includes(g);
  const sec = (g: MuscleGroup) => props.secundare?.includes(g) ?? false;
  const f = (g: MuscleGroup) => (on(g) ? 'var(--rosu, #D0342C)' : sec(g) ? 'var(--rosu-pal, #EAA4A0)' : 'var(--panou, #FFF8E0)');
  const contur = 'var(--fg, #171310)';

  return (
    <svg
      height={h}
      viewBox="0 0 220 260"
      role="img"
      aria-label={t('biblioteca.diagrama.aria')}
      style={{ maxWidth: '100%' }}
    >
      <g stroke={contur} strokeWidth="2" strokeLinejoin="round">
        {/* ── FAȚĂ ── */}
        <g transform="translate(10,6)">
          <circle cx="45" cy="16" r="13" fill="var(--panou, #FFF8E0)" />
          <rect x="38" y="29" width="14" height="8" fill="var(--panou, #FFF8E0)" />
          {/* umeri */}
          <ellipse cx="20" cy="45" rx="11" ry="9" fill={f('umeri')} />
          <ellipse cx="70" cy="45" rx="11" ry="9" fill={f('umeri')} />
          {/* piept */}
          <path d="M28 40 h34 v18 q-17 8 -34 0 Z" fill={f('piept')} />
          {/* abdomen */}
          <path d="M32 60 h26 v30 q-13 6 -26 0 Z" fill={f('abdomen')} />
          {/* biceps */}
          <rect x="6" y="52" width="12" height="24" rx="6" fill={f('biceps')} />
          <rect x="72" y="52" width="12" height="24" rx="6" fill={f('biceps')} />
          {/* antebrațe */}
          <rect x="4" y="78" width="10" height="26" rx="5" fill={f('antebrate')} />
          <rect x="76" y="78" width="10" height="26" rx="5" fill={f('antebrate')} />
          {/* cvadriceps */}
          <rect x="26" y="94" width="17" height="42" rx="8" fill={f('cvadriceps')} />
          <rect x="47" y="94" width="17" height="42" rx="8" fill={f('cvadriceps')} />
          {/* tibie/gambe față */}
          <rect x="28" y="140" width="13" height="38" rx="6" fill="var(--panou, #FFF8E0)" />
          <rect x="49" y="140" width="13" height="38" rx="6" fill="var(--panou, #FFF8E0)" />
          <text x="45" y="200" textAnchor="middle" fontSize="11" fontWeight="800" fill={contur} stroke="none">
            {t('biblioteca.diagrama.fata')}
          </text>
        </g>
        {/* ── SPATE ── */}
        <g transform="translate(120,6)">
          <circle cx="45" cy="16" r="13" fill="var(--panou, #FFF8E0)" />
          <rect x="38" y="29" width="14" height="8" fill="var(--panou, #FFF8E0)" />
          <ellipse cx="20" cy="45" rx="11" ry="9" fill={f('umeri')} />
          <ellipse cx="70" cy="45" rx="11" ry="9" fill={f('umeri')} />
          {/* spate (lat + trapez) */}
          <path d="M28 38 h34 l-4 34 q-13 8 -26 0 Z" fill={f('spate')} />
          {/* lombari */}
          <path d="M34 74 h22 v14 q-11 5 -22 0 Z" fill={f('lombari')} />
          {/* triceps */}
          <rect x="6" y="52" width="12" height="24" rx="6" fill={f('triceps')} />
          <rect x="72" y="52" width="12" height="24" rx="6" fill={f('triceps')} />
          <rect x="4" y="78" width="10" height="26" rx="5" fill={f('antebrate')} />
          <rect x="76" y="78" width="10" height="26" rx="5" fill={f('antebrate')} />
          {/* fesieri */}
          <path d="M28 90 h34 v16 q-17 9 -34 0 Z" fill={f('fesieri')} />
          {/* ischiogambieri */}
          <rect x="26" y="108" width="17" height="30" rx="8" fill={f('ischiogambieri')} />
          <rect x="47" y="108" width="17" height="30" rx="8" fill={f('ischiogambieri')} />
          {/* gambe */}
          <rect x="28" y="140" width="13" height="38" rx="6" fill={f('gambe')} />
          <rect x="49" y="140" width="13" height="38" rx="6" fill={f('gambe')} />
          <text x="45" y="200" textAnchor="middle" fontSize="11" fontWeight="800" fill={contur} stroke="none">
            {t('biblioteca.diagrama.spate')}
          </text>
        </g>
        {/* inimă pentru cardio */}
        {(on('cardio') || sec('cardio')) && (
          <path
            d="M110 224 c-6 -8 -18 -6 -18 4 c0 8 12 14 18 18 c6 -4 18 -10 18 -18 c0 -10 -12 -12 -18 -4 Z"
            fill={on('cardio') ? 'var(--rosu,#D0342C)' : 'var(--rosu-pal, #EAA4A0)'}
          >
            <animate attributeName="opacity" values="1;0.55;1" dur="1s" repeatCount="indefinite" />
          </path>
        )}
      </g>
    </svg>
  );
}
