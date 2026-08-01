import { Link } from 'react-router-dom';
import { Sticker } from '@/design/components';
import { Flexu } from '@/design/Flexu';
import { useProfile } from '@/state/profileStore';
import { useT } from '@/i18n';

// „Programe celebre" a plecat de aici: trăiește în tabul Programe → Ale aplicației
const LINKURI = [
  { la: '/statistici', emoji: '📊', cheie: 'maiMult.statistici' },
  { la: '/greutate', emoji: '⚖️', cheie: 'maiMult.greutate' },
  { la: '/realizari', emoji: '🏅', cheie: 'maiMult.realizari' },
  { la: '/ghid', emoji: '🎓', cheie: 'maiMult.ghid' },
  { la: '/setari', emoji: '⚙️', cheie: 'maiMult.setari' },
] as const;

export function MorePage() {
  const { t } = useT();
  const { profil } = useProfile();
  return (
    <div className="pagina">
      <div className="coperta" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Flexu poza="salut" marime={72} />
        <div>
          <div className="supratitlu">{t('maiMult.supratitlu')}</div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{t('maiMult.titlu')}</h1>
          {profil && <div className="mic estompat">{t('maiMult.profil', { nume: profil.nume })}</div>}
        </div>
      </div>
      {LINKURI.map((l) => (
        <Link key={l.la} to={l.la} style={{ textDecoration: 'none' }}>
          <Sticker>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.7rem' }} aria-hidden>
                {l.emoji}
              </span>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: '1.05rem' }}>{t(`${l.cheie}.nume`)}</b>
                <div className="mic estompat">{t(`${l.cheie}.desc`)}</div>
              </div>
              <span aria-hidden>→</span>
            </div>
          </Sticker>
        </Link>
      ))}
    </div>
  );
}
