import { useState } from 'react';
import { BigButton, Modal, SectionTitle, Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';
import { useCont } from '@/data/sync/authStore';
import { deconecteaza, legaCont, reAutentifica, rezolvaConflict, runSync, stergeCont } from '@/data/sync/engine';
import { mesajEroare } from '@/data/sync/api';
import { downloadBackup, exportBackup } from '@/data/backup';
import { dataOra } from '@/i18n/format';

/** „Cont și sincronizare" din Setări — toate stările contului, cu Flexu de serviciu. */
export function ContSection() {
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
      setEroareForm('Parola trebuie să aibă minim 8 caractere.');
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
      <label htmlFor="cont-email">Email</label>
      <input
        id="cont-email"
        type="email"
        autoComplete="email"
        value={cont.sesiuneExpirata ? cont.email ?? email : email}
        disabled={cont.sesiuneExpirata}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@exemplu.ro"
      />
      <label htmlFor="cont-parola">Parolă</label>
      <input
        id="cont-parola"
        type="password"
        autoComplete="current-password"
        value={parola}
        onChange={(e) => setParola(e.target.value)}
        placeholder="minim 8 caractere"
      />
      {eroareForm && (
        <p className="mic" style={{ color: 'var(--rosu)', fontWeight: 700, marginTop: 8 }}>
          ❌ {eroareForm}
        </p>
      )}
      <div className="rand" style={{ marginTop: 12 }}>
        {cont.sesiuneExpirata ? (
          <BigButton varianta="accent" onClick={() => void trimite('login')} disabled={lucrez}>
            {lucrez ? 'Intru…' : 'Intră din nou'}
          </BigButton>
        ) : (
          <>
            <BigButton varianta="accent" onClick={() => void trimite('inregistrare')} disabled={lucrez}>
              {lucrez ? 'O clipă…' : 'Creează cont'}
            </BigButton>
            <BigButton varianta="contur" onClick={() => void trimite('login')} disabled={lucrez}>
              Am deja cont
            </BigButton>
          </>
        )}
      </div>
      <p className="mic estompat" style={{ marginTop: 8 }}>
        Nu uita parola — deocamdată n-avem resetare prin email (serios, n-o uita).
      </p>
    </>
  );

  const cand = (iso?: string) => (iso ? dataOra(iso) : '—');

  return (
    <>
      <SectionTitle supratitlu="pe mai multe dispozitive">Cont și sincronizare</SectionTitle>
      <Sticker>
        {cont.stare === 'nelegat' && (
          <>
            <FlexuSpune poza="explica">
              Vrei datele pe două telefoane? Fă-ți un cont și car eu ghiozdanul cu date între ele. Fără cont, totul
              rămâne doar aici — ca până acum.
            </FlexuSpune>
            {formular}
          </>
        )}

        {cont.stare === 'sincronizez' && (
          <FlexuSpune poza="obosit">Car ganterele cu date… o secundă.</FlexuSpune>
        )}

        {cont.stare === 'legat' && (
          <>
            <p style={{ margin: '4px 0', fontWeight: 800 }}>✅ Sincronizat</p>
            <p className="mic" style={{ margin: '4px 0' }}>
              Cont: <b>{cont.email}</b>
              <br />
              Ultima sincronizare: {cand(cont.lastSyncLa)}
              {cont.quota && (
                <>
                  <br />
                  Spațiu folosit: {(cont.quota.usedBytes / 1024 / 1024).toFixed(2)} MB din{' '}
                  {Math.round(cont.quota.quotaBytes / 1024 / 1024)} MB
                </>
              )}
            </p>
            <div className="rand" style={{ marginTop: 10 }}>
              <BigButton varianta="accent" onClick={() => void runSync('manual')}>
                🔄 Sincronizează acum
              </BigButton>
              <BigButton varianta="contur" onClick={() => void deconecteaza()}>
                Deconectează
              </BigButton>
            </div>
            <p className="mic estompat" style={{ margin: '8px 0 0' }}>
              „Deconectează" doar dezleagă contul — datele rămân pe telefon.
            </p>
            <div style={{ marginTop: 10 }}>
              <BigButton varianta="pericol" onClick={() => setModalStergere(true)}>
                Șterge contul din cloud
              </BigButton>
            </div>
          </>
        )}

        {cont.stare === 'eroare' && cont.sesiuneExpirata && (
          <>
            <FlexuSpune poza="avertizeaza">Sesiunea a expirat — intră din nou și continuăm de unde am rămas.</FlexuSpune>
            {formular}
          </>
        )}

        {cont.stare === 'eroare' && !cont.sesiuneExpirata && (
          <>
            <FlexuSpune poza={cont.cotaPlina ? 'avertizeaza' : 'ganditor'}>
              {cont.cotaPlina
                ? 'Contul e plin (25 MB de gains!). Sincronizarea ia o pauză — scrie-i lui Attrexx.'
                : cont.lastError ?? 'Nu ajung la server acum. Nicio grijă — totul e salvat aici și trimit eu când prind semnal.'}
            </FlexuSpune>
            <BigButton varianta="accent" onClick={() => void runSync('reincercare')}>
              🔄 Mai încearcă
            </BigButton>
          </>
        )}

        {cont.stare === 'conflict' && (
          <FlexuSpune poza="avertizeaza">Contul are alt set de date — alege în fereastra de mai jos.</FlexuSpune>
        )}
      </Sticker>

      {/* dialogul de conflict (fork): contul are deja alte date */}
      <Modal deschis={cont.stare === 'conflict'} onInchide={() => void rezolvaConflict('renunt')} titlu="Ho! Două seturi de date">
        <FlexuSpune poza="avertizeaza">
          Contul <b>{cont.email}</b> are deja un set de date, și telefonul ăsta are altul. Ca la sală: nu punem două
          discuri pe același cârlig. Pe care îl păstrăm?
        </FlexuSpune>
        <div style={{ display: 'grid', gap: 8 }}>
          <BigButton varianta="accent" onClick={() => void rezolvaConflict('cloud')}>
            ☁️ Folosesc varianta din cloud
          </BigButton>
          <p className="mic estompat" style={{ margin: 0 }}>
            Profilul din cloud devine activ. Profilul local NU se șterge — rămâne în lista de profiluri, nelegat.
          </p>
          <BigButton onClick={() => void rezolvaConflict('local')}>📱 Trimit varianta locală</BigButton>
          <p className="mic estompat" style={{ margin: 0 }}>
            Datele din cloud se înlocuiesc cu ce e pe telefonul ăsta.
          </p>
          <BigButton varianta="contur" onClick={() => void exportBackup().then(downloadBackup)}>
            ⬇ Descarcă întâi un backup
          </BigButton>
          <BigButton varianta="contur" onClick={() => void rezolvaConflict('renunt')}>
            Renunț
          </BigButton>
        </div>
      </Modal>

      {/* ștergerea contului — cere parola (confirmarea naturală) */}
      <Modal deschis={modalStergere} onInchide={() => setModalStergere(false)} titlu="Ștergi contul din cloud?">
        <FlexuSpune poza="avertizeaza">
          Se șterg contul și TOATE datele din cloud. Datele de pe telefon rămân neatinse. Confirmă cu parola.
        </FlexuSpune>
        <label htmlFor="cont-parola-stergere">Parola contului</label>
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
            {lucrez ? 'Șterg…' : 'Da, șterge tot din cloud'}
          </BigButton>
          <BigButton varianta="contur" onClick={() => setModalStergere(false)}>
            Anulează
          </BigButton>
        </div>
      </Modal>
    </>
  );
}
