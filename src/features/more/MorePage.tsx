import { Link } from 'react-router-dom';
import { Sticker } from '@/design/components';
import { Flexu } from '@/design/Flexu';
import { useProfile } from '@/state/profileStore';

const LINKURI = [
  { la: '/programe', emoji: '📖', nume: 'Programe celebre', desc: 'PPL, 5/3/1, Upper/Lower, Full Body, calistenice' },
  { la: '/statistici', emoji: '📊', nume: 'Statistici', desc: 'grafice, volume, recorduri, calendar' },
  { la: '/greutate', emoji: '⚖️', nume: 'Greutate & obiectiv', desc: 'cântăriri, țintă, import Freefit' },
  { la: '/realizari', emoji: '🏅', nume: 'Realizări', desc: 'colecția de insigne' },
  { la: '/ghid', emoji: '🎓', nume: 'Ghidul Noobului', desc: 'lecțiile esențiale, pe scurt' },
  { la: '/setari', emoji: '⚙️', nume: 'Setări', desc: 'temă, sunete, profil, backup' },
];

export function MorePage() {
  const { profil } = useProfile();
  return (
    <div className="pagina">
      <div className="coperta" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Flexu poza="salut" marime={72} />
        <div>
          <div className="supratitlu">restul aplicației</div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Mai mult</h1>
          {profil && <div className="mic estompat">profil: {profil.nume}</div>}
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
                <b style={{ fontSize: '1.05rem' }}>{l.nume}</b>
                <div className="mic estompat">{l.desc}</div>
              </div>
              <span aria-hidden>→</span>
            </div>
          </Sticker>
        </Link>
      ))}
    </div>
  );
}
