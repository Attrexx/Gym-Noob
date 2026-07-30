import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BigButton, Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';
import { loginPeDispozitivNou } from '@/data/sync/engine';
import { mesajEroare } from '@/data/sync/api';

/**
 * Login pe un dispozitiv PROASPĂT (din onboarding): trage snapshot-ul
 * contului și construiește profilul local — fără să treci prin onboarding.
 */
export function LoginCont(props: { onInapoi: () => void }) {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [lucrez, setLucrez] = useState(false);
  const [mesaj, setMesaj] = useState('');

  const intra = async () => {
    if (lucrez) return;
    setMesaj('');
    setLucrez(true);
    try {
      const rezultat = await loginPeDispozitivNou(email.trim(), parola);
      if (rezultat === 'gol') {
        setMesaj('Contul există, dar încă n-are date. Fă onboarding-ul normal, apoi leagă contul din Setări.');
      } else {
        nav('/');
      }
    } catch (e) {
      setMesaj(`❌ ${mesajEroare(e)}`);
    } finally {
      setLucrez(false);
    }
  };

  return (
    <div className="pop">
      <div className="coperta">
        <div className="supratitlu">bine ai revenit</div>
        <h1 style={{ fontSize: '1.6rem', margin: 0 }}>Adu-ți datele</h1>
      </div>
      <FlexuSpune poza="salut">
        Ai deja cont? Intră și îți aduc tot ghiozdanul: profil, antrenamente, istoric, realizări. Ca și cum n-ai fi
        schimbat telefonul.
      </FlexuSpune>
      <Sticker>
        <label htmlFor="lc-email">Email</label>
        <input
          id="lc-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@exemplu.ro"
        />
        <label htmlFor="lc-parola">Parolă</label>
        <input
          id="lc-parola"
          type="password"
          autoComplete="current-password"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
          placeholder="parola ta"
        />
        {mesaj && (
          <p className="mic" style={{ fontWeight: 700, marginTop: 8 }}>
            {mesaj}
          </p>
        )}
        <div className="rand" style={{ marginTop: 12 }}>
          <BigButton varianta="accent" onClick={() => void intra()} disabled={lucrez}>
            {lucrez ? 'Aduc datele…' : 'Intră în cont'}
          </BigButton>
          <BigButton varianta="contur" onClick={props.onInapoi}>
            Înapoi
          </BigButton>
        </div>
      </Sticker>
    </div>
  );
}
