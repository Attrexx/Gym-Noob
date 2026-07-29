import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '@/data/db';
import { BigButton, Sticker } from '@/design/components';
import { Flexu } from '@/design/Flexu';
import { useProfile } from '@/state/profileStore';
import type { Profile } from '@/data/types';

export function ProfilesPage() {
  const nav = useNavigate();
  const { alegeProfil, iesire, profil } = useProfile();
  const profiluri = useLiveQuery(() => db.profiles.toArray(), []);

  const alege = async (p: Profile) => {
    await alegeProfil(p);
    nav('/');
  };

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">GYM pentru NOOBI</div>
        <h1>Profiluri</h1>
      </div>
      {(profiluri ?? []).map((p) => (
        <Sticker key={p.id} onClick={() => void alege(p)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Flexu poza="salut" marime={56} />
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: '1.1rem' }}>{p.nume}</b>
              {profil?.id === p.id && <span className="eticheta-mica" style={{ marginLeft: 8 }}>activ</span>}
              <div className="mic estompat">creat {new Date(p.creatLa).toLocaleDateString('ro-RO')}</div>
            </div>
            <span aria-hidden style={{ fontSize: '1.4rem' }}>→</span>
          </div>
        </Sticker>
      ))}
      {profiluri && profiluri.length === 0 && <p className="estompat">Niciun profil încă.</p>}
      <BigButton
        varianta="accent"
        mare
        onClick={() => {
          iesire();
          nav('/');
        }}
      >
        + Profil nou
      </BigButton>
    </div>
  );
}
