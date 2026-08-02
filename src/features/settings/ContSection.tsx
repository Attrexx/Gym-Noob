import { useState } from 'react';
import { BigButton, Modal, SectionTitle, Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';
import { useCont } from '@/data/sync/authStore';
import { deconecteaza, legaCont, reAutentifica, rezolvaConflict, runSync, stergeCont } from '@/data/sync/engine';
import { mesajEroare } from '@/data/sync/api';
import { downloadBackup, exportBackup } from '@/data/backup';
import { dataOra } from '@/i18n/format';
import { T, useT } from '@/i18n';

/** „Cont și sincronizare" din Setări — toate stările contului, cu Flexu de serviciu. */
export function ContSection() {
  const { t } = useT();
  const cont = useCont();
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [lucrez, setLucrez] = useState(false);
  const [eroareForm, setEroareForm] = useState('');
  const [modalStergere, setModalStergere] = useState(false);
  const [parolaStergere, setParolaStergere] = useState('');

  const trimite = async (mod: 'inregistrare' | 'login') => {
    if (lucrez) return;
    setEroareForm('');
    if (parola.length < 8) {
      setEroareForm(t('cont.parolaScurta'));
      return;
    }
    setLucrez(true);
    try {
      if (cont.sesiuneExpirata) await reAutentifica(email.trim() || cont.email || '', parola);
      else await legaCont(mod, email.trim(), parola);
      setParola('');
    } catch (e) {
      setEroareForm(mesajEroare(e));
    } finally {
      setLucrez(false);
    }
  };

  const sterge = async () => {
    if (lucrez) return;
    setLucrez(true);
    try {
      await stergeCont(parolaStergere);
      setModalStergere(false);
      setParolaStergere('');
    } catch (e) {
      setEroareForm(mesajEroare(e));
    } finally {
      setLucrez(false);
    }
  };

  const formular = (
    <>
      <label htmlFor="cont-email">{t('cont.email')}</label>
      <input
        id="cont-email"
        type="email"
        autoComplete="email"
        value={cont.sesiuneExpirata ? cont.email ?? email : email}
        disabled={cont.sesiuneExpirata}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('cont.emailPlaceholder')}
      />
      <label htmlFor="cont-parola">{t('cont.parola')}</label>
      <input
        id="cont-parola"
        type="password"
        autoComplete="current-password"
        value={parola}
        onChange={(e) => setParola(e.target.value)}
        placeholder={t('cont.parolaPlaceholder')}
      />
      {eroareForm && (
        <p className="mic" style={{ color: 'var(--rosu)', fontWeight: 700, marginTop: 8 }}>
          ❌ {eroareForm}
        </p>
      )}
      <div className="rand" style={{ marginTop: 12 }}>
        {cont.sesiuneExpirata ? (
          <BigButton varianta="accent" onClick={() => void trimite('login')} disabled={lucrez}>
            {t(lucrez ? 'cont.intru' : 'cont.intraDinNou')}
          </BigButton>
        ) : (
          <>
            <BigButton varianta="accent" onClick={() => void trimite('inregistrare')} disabled={lucrez}>
              {t(lucrez ? 'cont.oClipa' : 'cont.creeaza')}
            </BigButton>
            <BigButton varianta="contur" onClick={() => void trimite('login')} disabled={lucrez}>
              {t('cont.amDejaCont')}
            </BigButton>
          </>
        )}
      </div>
      <p className="mic estompat" style={{ marginTop: 8 }}>
        {t('cont.nuUitaParola')}
      </p>
    </>
  );

  const cand = (iso?: string) => (iso ? dataOra(iso) : '—');

  return (
    <>
      <SectionTitle supratitlu={t('cont.supratitlu')}>{t('cont.titlu')}</SectionTitle>
      <Sticker>
        {cont.stare === 'nelegat' && (
          <>
            <FlexuSpune poza="explica">{t('cont.nelegat')}</FlexuSpune>
            {formular}
          </>
        )}

        {cont.stare === 'sincronizez' && <FlexuSpune poza="obosit">{t('cont.sincronizez')}</FlexuSpune>}

        {cont.stare === 'legat' && (
          <>
            <p style={{ margin: '4px 0', fontWeight: 800 }}>{t('cont.sincronizat')}</p>
            <p className="mic" style={{ margin: '4px 0' }}>
              <T k="cont.contEste" p={{ email: cont.email ?? '' }} />
              <br />
              {t('cont.ultimaSincronizare', { cand: cand(cont.lastSyncLa) })}
              {cont.quota && (
                <>
                  <br />
                  {t('cont.spatiu', {
                    folosit: (cont.quota.usedBytes / 1024 / 1024).toFixed(2),
                    total: Math.round(cont.quota.quotaBytes / 1024 / 1024),
                  })}
                </>
              )}
            </p>
            <div className="rand" style={{ marginTop: 10 }}>
              <BigButton varianta="accent" onClick={() => void runSync('manual')}>
                {t('cont.sincronizeazaAcum')}
              </BigButton>
              <BigButton varianta="contur" onClick={() => void deconecteaza()}>
                {t('cont.deconecteaza')}
              </BigButton>
            </div>
            <p className="mic estompat" style={{ margin: '8px 0 0' }}>
              {t('cont.deconecteazaExplicatie')}
            </p>
            <div style={{ marginTop: 10 }}>
              <BigButton varianta="pericol" onClick={() => setModalStergere(true)}>
                {t('cont.stergeCloud')}
              </BigButton>
            </div>
          </>
        )}

        {cont.stare === 'eroare' && cont.sesiuneExpirata && (
          <>
            <FlexuSpune poza="avertizeaza">{t('cont.sesiuneExpirata')}</FlexuSpune>
            {formular}
          </>
        )}

        {cont.stare === 'eroare' && !cont.sesiuneExpirata && (
          <>
            <FlexuSpune poza={cont.cotaPlina ? 'avertizeaza' : 'ganditor'}>
              {cont.cotaPlina ? t('cont.cotaPlina') : (cont.lastError ?? t('cont.eroareGenerica'))}
            </FlexuSpune>
            <BigButton varianta="accent" onClick={() => void runSync('reincercare')}>
              {t('cont.maiIncearca')}
            </BigButton>
          </>
        )}

        {cont.stare === 'conflict' && <FlexuSpune poza="avertizeaza">{t('cont.conflictScurt')}</FlexuSpune>}
      </Sticker>

      {/* dialogul de conflict (fork): contul are deja alte date */}
      <Modal
        deschis={cont.stare === 'conflict'}
        onInchide={() => void rezolvaConflict('renunt')}
        titlu={t('cont.conflict.titlu')}
      >
        <FlexuSpune poza="avertizeaza">
          <T k="cont.conflict.explicatie" p={{ email: cont.email ?? '' }} />
        </FlexuSpune>
        <div style={{ display: 'grid', gap: 8 }}>
          <BigButton varianta="accent" onClick={() => void rezolvaConflict('cloud')}>
            {t('cont.conflict.cloud')}
          </BigButton>
          <p className="mic estompat" style={{ margin: 0 }}>
            {t('cont.conflict.cloudExplicatie')}
          </p>
          <BigButton onClick={() => void rezolvaConflict('local')}>{t('cont.conflict.local')}</BigButton>
          <p className="mic estompat" style={{ margin: 0 }}>
            {t('cont.conflict.localExplicatie')}
          </p>
          <BigButton varianta="contur" onClick={() => void exportBackup().then(downloadBackup)}>
            {t('cont.conflict.backup')}
          </BigButton>
          <BigButton varianta="contur" onClick={() => void rezolvaConflict('renunt')}>
            {t('cont.conflict.renunt')}
          </BigButton>
        </div>
      </Modal>

      {/* ștergerea contului — cere parola (confirmarea naturală) */}
      <Modal deschis={modalStergere} onInchide={() => setModalStergere(false)} titlu={t('cont.stergere.titlu')}>
        <FlexuSpune poza="avertizeaza">{t('cont.stergere.explicatie')}</FlexuSpune>
        <label htmlFor="cont-parola-stergere">{t('cont.stergere.parola')}</label>
        <input
          id="cont-parola-stergere"
          type="password"
          autoComplete="current-password"
          value={parolaStergere}
          onChange={(e) => setParolaStergere(e.target.value)}
        />
        {eroareForm && (
          <p className="mic" style={{ color: 'var(--rosu)', fontWeight: 700, marginTop: 8 }}>
            ❌ {eroareForm}
          </p>
        )}
        <div className="rand" style={{ marginTop: 12 }}>
          <BigButton varianta="pericol" onClick={() => void sterge()} disabled={lucrez || parolaStergere.length < 8}>
            {t(lucrez ? 'cont.stergere.sterg' : 'cont.stergere.confirma')}
          </BigButton>
          <BigButton varianta="contur" onClick={() => setModalStergere(false)}>
            {t('comun.anuleaza')}
          </BigButton>
        </div>
      </Modal>
    </>
  );
}
