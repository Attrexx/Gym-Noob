import { useState } from 'react';
import { BigButton, SectionTitle, Sticker } from '@/design/components';
import { bleDisponibil, bleSilentiosDisponibil } from '@/services/ble';
import { raportText, scaneazaAparat, type RaportAparat } from '@/services/bleMachine';
import type { Settings } from '@/data/types';

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
  const { setari } = props;
  const [raport, setRaport] = useState<RaportAparat | null>(null);
  const [scanez, setScanez] = useState(false);
  const [eroare, setEroare] = useState('');
  const [uuidExtra, setUuidExtra] = useState('');
  const [copiat, setCopiat] = useState(false);

  if (!bleDisponibil) {
    return (
      <>
        <SectionTitle supratitlu="senzori">Ceas și aparate</SectionTitle>
        <Sticker>
          <p className="mic" style={{ margin: 0 }}>
            Browserul acesta nu are Web Bluetooth, așa că nu pot citi nici pulsul de la ceas, nici datele de pe
            aparate. Pe iPhone nu există deloc — pe Android, folosește Chrome. Restul aplicației merge normal.
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
      setEroare('Nu am putut copia. Selectează textul de mai jos manual.');
    }
  };

  return (
    <>
      <SectionTitle supratitlu="senzori">Ceas și aparate</SectionTitle>
      <Sticker>
        <Comutator
          eticheta="♥ Caută ceasul automat la începutul sesiunii"
          activ={setari.pulsAuto !== false}
          onChange={(v) => props.onChange({ pulsAuto: v })}
        />
        <Comutator
          eticheta="🔌 Caută aparatul de cardio automat"
          activ={setari.aparatAuto !== false}
          onChange={(v) => props.onChange({ aparatAuto: v })}
        />
        {(setari.pulsUltimulDispozitiv || setari.aparatUltimulDispozitiv) && (
          <p className="mic estompat" style={{ margin: '8px 0 0' }}>
            Ținute minte: {[setari.pulsUltimulDispozitiv, setari.aparatUltimulDispozitiv].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="mic estompat" style={{ margin: '8px 0 0' }}>
          {bleSilentiosDisponibil()
            ? 'Browserul tău îmi permite să mă reconectez singur — nu mai trebuie să apeși nimic.'
            : 'Browserul cere o atingere ca să aleagă dispozitivul, așa că îți pun un buton mare în antetul sesiunii. Odată conectat, dacă pierd semnalul mă reconectez singur.'}
        </p>
      </Sticker>

      <Sticker>
        <b>🔍 Scanează un aparat</b>
        <p className="mic" style={{ margin: '4px 0 10px' }}>
          Dacă un aparat nu se conectează, pornește-i Bluetooth-ul și scanează-l de aici. Îți spun exact ce
          servicii expune, iar de acolo știm dacă putem citi datele lui.
        </p>
        <BigButton varianta="accent" disabled={scanez} onClick={() => void scaneaza()}>
          {scanez ? 'Scanez…' : '🔍 Scanează'}
        </BigButton>

        <div style={{ marginTop: 10 }}>
          <label htmlFor="uuid-extra">UUID-uri suplimentare (opțional)</label>
          <input
            id="uuid-extra"
            value={uuidExtra}
            onChange={(e) => setUuidExtra(e.target.value)}
            placeholder="ex. 0000fff0-0000-1000-8000-00805f9b34fb"
          />
          <p className="mic estompat" style={{ margin: '6px 0 0' }}>
            Important de știut: browserul îmi arată <b>doar serviciile pe care le cer dinainte</b>. Un serviciu
            proprietar necunoscut nu apare până nu-i știm UUID-ul — de aceea există câmpul ăsta.
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
                {copiat ? '✅ Copiat' : '📋 Copiază raportul'}
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
              Cauți <b>0x1826</b> (Fitness Machine) — dacă apare, aparatul vorbește standardul și îl putem citi.
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
