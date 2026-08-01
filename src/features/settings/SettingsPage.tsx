import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/state/profileStore';
import { BigButton, SectionTitle, Sticker } from '@/design/components';
import { downloadBackup, exportBackup, importBackup } from '@/data/backup';
import { updateProfile } from '@/data/repo';
import { ContSection } from './ContSection';
import { AparateSection } from './AparateSection';
import type { ActivityLevel, Settings } from '@/data/types';
import { ACTIVITY_LABEL } from '@/domain/goals';
import { spune } from '@/services/tts';

export function SettingsPage() {
  const { profil, setari, actualizeazaSetari, reincarcaProfil, incarca } = useProfile();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mesajImport, setMesajImport] = useState('');

  if (!profil || !setari) return <div className="pagina" />;

  const set = (c: Partial<Settings>) => void actualizeazaSetari(c);

  const importa = async (f: File) => {
    if (!confirm('Importul ÎNLOCUIEȘTE toate datele actuale ale aplicației cu cele din fișier. Continui?')) return;
    try {
      await importBackup(await f.text());
      await incarca();
      // restaurarea e autoritară și pentru cloud (sau dezleagă contul — vezi engine)
      const { dupaRestaurareBackup } = await import('@/data/sync/engine');
      const nota = await dupaRestaurareBackup();
      setMesajImport(`✅ Datele au fost restaurate.${nota ? ` ${nota}` : ''}`);
    } catch (e) {
      setMesajImport(`❌ ${(e as Error).message}`);
    }
  };

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">reglaje fine</div>
        <h1>Setări</h1>
      </div>

      <SectionTitle supratitlu="aspect">Temă</SectionTitle>
      <Sticker>
        <div className="rand">
          {(['zi', 'noapte', 'auto'] as const).map((t) => (
            <BigButton key={t} varianta={setari.tema === t ? 'accent' : 'contur'} onClick={() => set({ tema: t })}>
              {t === 'zi' ? '☀️ Zi' : t === 'noapte' ? '🌙 Noapte' : '🌗 Auto'}
            </BigButton>
          ))}
        </div>
        <p className="mic estompat" style={{ margin: '8px 0 0' }}>
          „Noapte" = sală întunecată cu accente galbene — pentru antrenamentele târzii.
        </p>
      </Sticker>

      <SectionTitle supratitlu="în sesiune">Sunete și indicații</SectionTitle>
      <Sticker>
        <Comutator eticheta="🔔 Sunete (bipuri, cronometre)" activ={setari.sunete} onChange={(v) => set({ sunete: v })} />
        <Comutator
          eticheta="🗣️ Indicații vocale în căști"
          activ={setari.vocale}
          onChange={(v) => {
            set({ vocale: v });
            if (v) spune('Indicațiile vocale sunt active. Spor la antrenament!');
          }}
        />
        <Comutator eticheta="📳 Vibrații" activ={setari.vibratii} onChange={(v) => set({ vibratii: v })} />
        <Comutator eticheta="💡 Sugestii automate de exerciții" activ={setari.sugestiiAutomate} onChange={(v) => set({ sugestiiAutomate: v })} />
        <Comutator
          eticheta="🌘 Economizor de ecran în sesiune"
          activ={setari.economizor !== false}
          onChange={(v) => set({ economizor: v })}
        />
        <p className="mic estompat" style={{ margin: '8px 0 0' }}>
          Economizorul: după 45 de secunde fără atingeri, ecranul devine negru cu cronometrul estompat — ca pe un
          ceas. Se trezește la atingere sau la mișcarea telefonului. Ecranul nu se stinge niciodată în sesiune.
        </p>
      </Sticker>

      <AparateSection setari={setari} onChange={set} />

      <SectionTitle supratitlu="despre tine">Profil</SectionTitle>
      <Sticker>
        <label htmlFor="s-nume">Nume</label>
        <input
          id="s-nume"
          defaultValue={profil.nume}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v && v !== profil.nume) void updateProfile(profil.id!, { nume: v }).then(reincarcaProfil);
          }}
        />
        <label htmlFor="s-inaltime">Înălțime (cm)</label>
        <input
          id="s-inaltime"
          type="number"
          defaultValue={profil.inaltime}
          onBlur={(e) => {
            const v = Number(e.target.value);
            if (v >= 120 && v <= 230 && v !== profil.inaltime) void updateProfile(profil.id!, { inaltime: v }).then(reincarcaProfil);
          }}
        />
        <label htmlFor="s-activitate">Nivel de activitate zilnică</label>
        <select
          id="s-activitate"
          value={profil.activitate}
          onChange={(e) => void updateProfile(profil.id!, { activitate: e.target.value as ActivityLevel }).then(reincarcaProfil)}
        >
          {Object.entries(ACTIVITY_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <div style={{ marginTop: 12 }}>
          <BigButton onClick={() => nav('/profiluri')}>👥 Schimbă profilul</BigButton>
        </div>
      </Sticker>

      <ContSection />

      <SectionTitle supratitlu="datele tale">Backup</SectionTitle>
      <Sticker>
        <p className="mic">
          Totul stă doar pe acest dispozitiv. Fă periodic un backup — mai ales înainte să schimbi telefonul.
        </p>
        <div className="rand">
          <BigButton varianta="accent" onClick={() => void exportBackup().then(downloadBackup)}>
            ⬇ Exportă tot
          </BigButton>
          <BigButton onClick={() => fileRef.current?.click()}>⬆ Restaurează</BigButton>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importa(f);
          }}
        />
        {mesajImport && <p style={{ marginTop: 8, fontWeight: 700 }}>{mesajImport}</p>}
      </Sticker>

      <p className="mic estompat centrat" style={{ marginTop: 20 }}>
        Gym Noob · v1.1 · făcută cu 💪 — datele stau la tine, sincronizarea e opțională
      </p>
    </div>
  );
}

function Comutator(props: { eticheta: string; activ: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => props.onChange(!props.activ)}
      role="switch"
      aria-checked={props.activ}
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        borderBottom: '2px solid var(--linie)',
        padding: '12px 2px',
        color: 'inherit',
        fontSize: '0.95rem',
        fontWeight: 700,
      }}
    >
      <span>{props.eticheta}</span>
      <span
        aria-hidden
        style={{
          width: 52,
          height: 28,
          borderRadius: 999,
          border: '3px solid var(--contur)',
          background: props.activ ? 'var(--accent)' : 'var(--panou)',
          position: 'relative',
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 1,
            left: props.activ ? 24 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--contur)',
            transition: 'left 0.15s',
          }}
        />
      </span>
    </button>
  );
}
