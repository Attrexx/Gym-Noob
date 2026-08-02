import { useState } from 'react';
import { BigButton, SectionTitle, Sticker } from '@/design/components';
import { bleDisponibil, bleSilentiosDisponibil } from '@/services/ble';
import { raportText, scaneazaAparat, type RaportAparat } from '@/services/bleMachine';
import type { Settings } from '@/data/types';
import { T, useT } from '@/i18n';

/**
 * „Ceas și aparate" — comutatoarele de căutare automată plus scanerul.
 *
 * Scanerul e unealta cu care aflăm ce vorbește, de fapt, un aparat din sală.
 * Rowerul StairMaster e FTMS standard și ar trebui să apară cu 0x1826; despre
 * banda Star Trac 8TR nu știm încă. Raportul se copiază și se trimite, ca să
 * adăugăm suport pe baza a ce am văzut, nu pe baza a ce am presupus.
 */
export function AparateSection(props: {
  setari: Settings;
  onChange: (c: Partial<Settings>) => void;
}) {
  const { t } = useT();
  const { setari } = props;
  const [raport, setRaport] = useState<RaportAparat | null>(null);
  const [scanez, setScanez] = useState(false);
  const [eroare, setEroare] = useState('');
  const [uuidExtra, setUuidExtra] = useState('');
  const [copiat, setCopiat] = useState(false);

  if (!bleDisponibil) {
    return (
      <>
        <SectionTitle supratitlu={t('aparate.supratitlu')}>{t('aparate.titlu')}</SectionTitle>
        <Sticker>
          <p className="mic" style={{ margin: 0 }}>
            {t('aparate.faraBle')}
          </p>
        </Sticker>
      </>
    );
  }

  const scaneaza = async () => {
    setScanez(true);
    setEroare('');
    setCopiat(false);
    try {
      const extra = uuidExtra
        .split(/[\s,]+/)
        .map((u) => u.trim().toLowerCase())
        .filter(Boolean);
      setRaport(await scaneazaAparat(extra));
    } catch (e) {
      setEroare((e as Error).message);
    } finally {
      setScanez(false);
    }
  };

  const copiaza = async () => {
    if (!raport) return;
    try {
      await navigator.clipboard.writeText(raportText(raport));
      setCopiat(true);
    } catch {
      setEroare(t('aparate.scaner.eroareCopiere'));
    }
  };

  return (
    <>
      <SectionTitle supratitlu={t('aparate.supratitlu')}>{t('aparate.titlu')}</SectionTitle>
      <Sticker>
        <Comutator
          eticheta={t('aparate.pulsAuto')}
          activ={setari.pulsAuto !== false}
          onChange={(v) => props.onChange({ pulsAuto: v })}
        />
        <Comutator
          eticheta={t('aparate.aparatAuto')}
          activ={setari.aparatAuto !== false}
          onChange={(v) => props.onChange({ aparatAuto: v })}
        />
        {(setari.pulsUltimulDispozitiv || setari.aparatUltimulDispozitiv) && (
          <p className="mic estompat" style={{ margin: '8px 0 0' }}>
            {t('aparate.tinuteMinte', {
              lista: [setari.pulsUltimulDispozitiv, setari.aparatUltimulDispozitiv].filter(Boolean).join(' · '),
            })}
          </p>
        )}
        <p className="mic estompat" style={{ margin: '8px 0 0' }}>
          {t(bleSilentiosDisponibil() ? 'aparate.silentios' : 'aparate.cuAtingere')}
        </p>
      </Sticker>

      <Sticker>
        <b>{t('aparate.scaner.titlu')}</b>
        <p className="mic" style={{ margin: '4px 0 10px' }}>
          {t('aparate.scaner.explicatie')}
        </p>
        <BigButton varianta="accent" disabled={scanez} onClick={() => void scaneaza()}>
          {t(scanez ? 'aparate.scaner.scanez' : 'aparate.scaner.scaneaza')}
        </BigButton>

        <div style={{ marginTop: 10 }}>
          <label htmlFor="uuid-extra">{t('aparate.scaner.uuid')}</label>
          <input
            id="uuid-extra"
            value={uuidExtra}
            onChange={(e) => setUuidExtra(e.target.value)}
            placeholder={t('aparate.scaner.uuidPlaceholder')}
          />
          <p className="mic estompat" style={{ margin: '6px 0 0' }}>
            <T k="aparate.scaner.uuidExplicatie" />
          </p>
        </div>

        {eroare && (
          <p className="mic" style={{ marginTop: 10, fontWeight: 800, color: 'var(--accent)' }}>
            {eroare}
          </p>
        )}

        {raport && (
          <div style={{ marginTop: 12 }}>
            <div className="rand" style={{ alignItems: 'center' }}>
              <b>{raport.nume}</b>
              <BigButton varianta="contur" onClick={() => void copiaza()}>
                {t(copiat ? 'aparate.scaner.copiat' : 'aparate.scaner.copiaza')}
              </BigButton>
            </div>
            <pre
              style={{
                marginTop: 8,
                padding: 10,
                border: '2px solid var(--linie)',
                borderRadius: 8,
                background: 'var(--crem)',
                color: 'var(--negru)',
                fontSize: '0.72rem',
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}
            >
              {raportText(raport)}
            </pre>
            <p className="mic estompat" style={{ margin: '6px 0 0' }}>
              <T k="aparate.scaner.cauti" />
            </p>
          </div>
        )}
      </Sticker>
    </>
  );
}

function Comutator(props: { eticheta: string; activ: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={props.activ}
        onChange={(e) => props.onChange(e.target.checked)}
        style={{ width: 22, height: 22, flexShrink: 0 }}
      />
      <span style={{ fontWeight: 700 }}>{props.eticheta}</span>
    </label>
  );
}
