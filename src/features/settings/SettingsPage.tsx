import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/state/profileStore';
import { BigButton, SectionTitle, Sticker } from '@/design/components';
import { downloadBackup, exportBackup, importBackup } from '@/data/backup';
import { updateProfile } from '@/data/repo';
import { ContSection } from './ContSection';
import { AparateSection } from './AparateSection';
import type { ActivityLevel, Settings } from '@/data/types';
import { NIVELURI } from '@/domain/goals';
import { AUTONIM, LIMBI, useT } from '@/i18n';
import { spune } from '@/services/tts';

export function SettingsPage() {
  const { t } = useT();
  const { profil, setari, actualizeazaSetari, reincarcaProfil, incarca } = useProfile();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mesajImport, setMesajImport] = useState('');

  if (!profil || !setari) return <div className="pagina" />;

  const set = (c: Partial<Settings>) => void actualizeazaSetari(c);

  const importa = async (f: File) => {
    if (!confirm(t('setari.backup.confirmare'))) return;
    try {
      await importBackup(await f.text());
      await incarca();
      // restaurarea e autoritară și pentru cloud (sau dezleagă contul — vezi engine)
      const { dupaRestaurareBackup } = await import('@/data/sync/engine');
      const nota = await dupaRestaurareBackup();
      setMesajImport(`${t('setari.backup.succes')}${nota ? ` ${nota}` : ''}`);
    } catch (e) {
      setMesajImport(`❌ ${(e as Error).message}`);
    }
  };

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">{t('setari.supratitlu')}</div>
        <h1>{t('setari.titlu')}</h1>
      </div>

      {/* Limba stă prima: e cel mai global reglaj, și primul lucru de care are
          nevoie cineva care a nimerit aplicația într-o limbă pe care n-o știe.
          Se arată doar când chiar există de ales. */}
      {LIMBI.length > 1 && (
        <>
          <SectionTitle supratitlu={t('setari.limba.supratitlu')}>{t('setari.limba.titlu')}</SectionTitle>
          <Sticker>
            <div className="rand">
              {([...LIMBI, 'auto'] as const).map((l) => (
                <BigButton
                  key={l}
                  id={`limba-${l}`}
                  varianta={(setari.limba ?? 'auto') === l ? 'accent' : 'contur'}
                  onClick={() => set({ limba: l })}
                >
                  {l === 'auto' ? `🌐 ${t('setari.limba.auto')}` : (AUTONIM[l] ?? l)}
                </BigButton>
              ))}
            </div>
            <p className="mic estompat" style={{ margin: '8px 0 0' }}>
              {t('setari.limba.explicatie')}
            </p>
          </Sticker>
        </>
      )}

      <SectionTitle supratitlu={t('setari.tema.supratitlu')}>{t('setari.tema.titlu')}</SectionTitle>
      <Sticker>
        <div className="rand">
          {(['zi', 'noapte', 'auto'] as const).map((tema) => (
            <BigButton
              key={tema}
              varianta={setari.tema === tema ? 'accent' : 'contur'}
              onClick={() => set({ tema })}
            >
              {t(`setari.tema.${tema}`)}
            </BigButton>
          ))}
        </div>
        <p className="mic estompat" style={{ margin: '8px 0 0' }}>
          {t('setari.tema.explicatie')}
        </p>
      </Sticker>

      <SectionTitle supratitlu={t('setari.sunete.supratitlu')}>{t('setari.sunete.titlu')}</SectionTitle>
      <Sticker>
        <Comutator
          eticheta={t('setari.sunete.bipuri')}
          activ={setari.sunete}
          onChange={(v) => set({ sunete: v })}
        />
        <Comutator
          eticheta={t('setari.sunete.vocale')}
          activ={setari.vocale}
          onChange={(v) => {
            set({ vocale: v });
            if (v) spune(t('setari.vocale.confirmare'));
          }}
        />
        <Comutator
          eticheta={t('setari.sunete.vibratii')}
          activ={setari.vibratii}
          onChange={(v) => set({ vibratii: v })}
        />
        <Comutator
          eticheta={t('setari.sunete.sugestii')}
          activ={setari.sugestiiAutomate}
          onChange={(v) => set({ sugestiiAutomate: v })}
        />
        <Comutator
          eticheta={t('setari.sunete.economizor')}
          activ={setari.economizor !== false}
          onChange={(v) => set({ economizor: v })}
        />
        <p className="mic estompat" style={{ margin: '8px 0 0' }}>
          {t('setari.sunete.economizorExplicatie')}
        </p>
      </Sticker>

      <AparateSection setari={setari} onChange={set} />

      <SectionTitle supratitlu={t('setari.profil.supratitlu')}>{t('setari.profil.titlu')}</SectionTitle>
      <Sticker>
        <label htmlFor="s-nume">{t('setari.profil.nume')}</label>
        <input
          id="s-nume"
          defaultValue={profil.nume}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v && v !== profil.nume) void updateProfile(profil.id!, { nume: v }).then(reincarcaProfil);
          }}
        />
        <label htmlFor="s-inaltime">{t('comun.inaltime')}</label>
        <input
          id="s-inaltime"
          type="number"
          defaultValue={profil.inaltime}
          onBlur={(e) => {
            const v = Number(e.target.value);
            if (v >= 120 && v <= 230 && v !== profil.inaltime) void updateProfile(profil.id!, { inaltime: v }).then(reincarcaProfil);
          }}
        />
        <label htmlFor="s-activitate">{t('setari.profil.activitate')}</label>
        <select
          id="s-activitate"
          value={profil.activitate}
          onChange={(e) => void updateProfile(profil.id!, { activitate: e.target.value as ActivityLevel }).then(reincarcaProfil)}
        >
          {NIVELURI.map((nivel) => (
            <option key={nivel} value={nivel}>
              {t(`domeniu.activitate.${nivel}`)}
            </option>
          ))}
        </select>
        <div style={{ marginTop: 12 }}>
          <BigButton onClick={() => nav('/profiluri')}>{t('setari.profil.schimba')}</BigButton>
        </div>
      </Sticker>

      <ContSection />

      <SectionTitle supratitlu={t('setari.backup.supratitlu')}>{t('setari.backup.titlu')}</SectionTitle>
      <Sticker>
        <p className="mic">{t('setari.backup.explicatie')}</p>
        <div className="rand">
          <BigButton varianta="accent" onClick={() => void exportBackup().then(downloadBackup)}>
            {t('setari.backup.exporta')}
          </BigButton>
          <BigButton onClick={() => fileRef.current?.click()}>{t('setari.backup.restaureaza')}</BigButton>
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
        {t('setari.versiune', { versiune: '1.1' })}
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
