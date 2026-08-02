import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BigButton, Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';
import { loginPeDispozitivNou } from '@/data/sync/engine';
import { mesajEroare } from '@/data/sync/api';
import { useT } from '@/i18n';

/**
 * Login pe un dispozitiv PROASPĂT (din onboarding): trage snapshot-ul
 * contului și construiește profilul local — fără să treci prin onboarding.
 */
export function LoginCont(props: { onInapoi: () => void }) {
  const { t } = useT();
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
        setMesaj(t('login.contGol'));
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
        <div className="supratitlu">{t('login.supratitlu')}</div>
        <h1 style={{ fontSize: '1.6rem', margin: 0 }}>{t('login.titlu')}</h1>
      </div>
      <FlexuSpune poza="salut">{t('login.flexu')}</FlexuSpune>
      <Sticker>
        <label htmlFor="lc-email">{t('cont.email')}</label>
        <input
          id="lc-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('cont.emailPlaceholder')}
        />
        <label htmlFor="lc-parola">{t('cont.parola')}</label>
        <input
          id="lc-parola"
          type="password"
          autoComplete="current-password"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
          placeholder={t('login.parolaPlaceholder')}
        />
        {mesaj && (
          <p className="mic" style={{ fontWeight: 700, marginTop: 8 }}>
            {mesaj}
          </p>
        )}
        <div className="rand" style={{ marginTop: 12 }}>
          <BigButton varianta="accent" onClick={() => void intra()} disabled={lucrez}>
            {t(lucrez ? 'login.aduc' : 'login.intra')}
          </BigButton>
          <BigButton varianta="contur" onClick={props.onInapoi}>
            {t('comun.inapoi')}
          </BigButton>
        </div>
      </Sticker>
    </div>
  );
}
