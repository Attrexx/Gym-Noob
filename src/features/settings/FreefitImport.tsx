import { useRef, useState } from 'react';
import { BigButton, Sticker } from '@/design/components';
import { parseFreefitCsv, type ParsedWeight } from '@/domain/freefit';
import { useProfile } from '@/state/profileStore';
import { db } from '@/data/db';

/**
 * Import de istoric de greutate din Freefit (sau alte aplicații de
 * cântar). Freefit nu are API public, deci fluxul e: export CSV din
 * aplicația lor → fișierul se citește aici, local.
 */
export function FreefitImport(props: { onGata: () => void }) {
  const { profil } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);
  const [previzualizare, setPrevizualizare] = useState<ParsedWeight[] | null>(null);
  const [eroare, setEroare] = useState('');
  const [gata, setGata] = useState<number | null>(null);

  const citeste = async (f: File) => {
    setEroare('');
    const text = await f.text();
    const rows = parseFreefitCsv(text);
    if (rows.length === 0) {
      setEroare('Nu am găsit coloane de dată + greutate în fișier. Verifică exportul (trebuie să fie CSV).');
      return;
    }
    setPrevizualizare(rows);
  };

  const importa = async () => {
    if (!profil?.id || !previzualizare) return;
    const pid = profil.id;
    const existente = await db.bodyMetrics.where({ profileId: pid }).toArray();
    const zileExistente = new Set(existente.map((m) => m.data.slice(0, 10)));
    const noi = previzualizare.filter((p) => !zileExistente.has(p.data.slice(0, 10)));
    await db.bodyMetrics.bulkAdd(
      noi.map((p) => ({ profileId: pid, data: p.data, greutate: p.greutate, sursa: 'freefit' as const })),
    );
    setGata(noi.length);
  };

  if (gata !== null) {
    return (
      <div className="centrat">
        <p>
          ✅ Import reușit: <b>{gata}</b> cântăriri noi adăugate
          {previzualizare && gata < previzualizare.length ? ` (${previzualizare.length - gata} erau deja înregistrate)` : ''}
          .
        </p>
        <BigButton varianta="accent" onClick={props.onGata}>
          Super!
        </BigButton>
      </div>
    );
  }

  return (
    <div>
      {!previzualizare && (
        <>
          <p className="mic">Cum scoți datele din Freefit:</p>
          <ol className="mic" style={{ paddingLeft: 18, marginTop: 0 }}>
            <li>Deschide Freefit → profil / setări → caută „Export date" sau „Istoric măsurători".</li>
            <li>Alege formatul CSV (sau Excel salvat ca CSV) și trimite-ți fișierul (email, Drive etc.).</li>
            <li>Alege fișierul aici — totul se procesează local, nimic nu pleacă de pe telefon.</li>
          </ol>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void citeste(f);
            }}
          />
          <p className="mic estompat" style={{ marginTop: 8 }}>
            Merge cu orice CSV care are o coloană de dată și una de greutate (kg) — inclusiv exporturi din alte
            aplicații de cântar.
          </p>
        </>
      )}
      {eroare && <p style={{ color: 'var(--rosu)', fontWeight: 700 }}>{eroare}</p>}
      {previzualizare && (
        <>
          <p>
            Am găsit <b>{previzualizare.length}</b> cântăriri, între {previzualizare[0].data.slice(0, 10)} și{' '}
            {previzualizare[previzualizare.length - 1].data.slice(0, 10)}.
          </p>
          <Sticker style={{ maxHeight: 180, overflowY: 'auto' }}>
            {previzualizare.slice(-10).map((p) => (
              <div key={p.data} className="rand mic" style={{ justifyContent: 'space-between' }}>
                <span>{p.data.slice(0, 10)}</span>
                <b>{p.greutate} kg</b>
              </div>
            ))}
            {previzualizare.length > 10 && <p className="mic estompat">…și încă {previzualizare.length - 10}</p>}
          </Sticker>
          <div className="rand">
            <BigButton varianta="accent" onClick={() => void importa()}>
              Importă
            </BigButton>
            <BigButton varianta="contur" onClick={() => setPrevizualizare(null)}>
              Alt fișier
            </BigButton>
          </div>
        </>
      )}
    </div>
  );
}
