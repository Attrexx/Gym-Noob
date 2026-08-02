import { useRef, useState } from 'react';
import { BigButton, Sticker } from '@/design/components';
import { parseFreefitCsv, type ParsedWeight } from '@/domain/freefit';
import { useProfile } from '@/state/profileStore';
import { importBodyMetrics } from '@/data/repo';
import { T, useT } from '@/i18n';

/**
 * Import de istoric de greutate din Freefit (sau alte aplicații de
 * cântar). Freefit nu are API public, deci fluxul e: export CSV din
 * aplicația lor → fișierul se citește aici, local.
 */
export function FreefitImport(props: { onGata: () => void }) {
  const { t } = useT();
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
      setEroare(t('freefit.eroareColoane'));
      return;
    }
    setPrevizualizare(rows);
  };

  const importa = async () => {
    if (!profil?.id || !previzualizare) return;
    setGata(await importBodyMetrics(profil.id, previzualizare));
  };

  if (gata !== null) {
    const dubluri = previzualizare ? previzualizare.length - gata : 0;
    return (
      <div className="centrat">
        <p>
          {dubluri > 0 ? (
            <T k="freefit.succesCuDubluri" p={{ n: gata, dubluri }} />
          ) : (
            <T k="freefit.succes" p={{ n: gata }} />
          )}
        </p>
        <BigButton varianta="accent" onClick={props.onGata}>
          {t('freefit.super')}
        </BigButton>
      </div>
    );
  }

  return (
    <div>
      {!previzualizare && (
        <>
          <p className="mic">{t('freefit.cum')}</p>
          <ol className="mic" style={{ paddingLeft: 18, marginTop: 0 }}>
            <li>{t('freefit.pas1')}</li>
            <li>{t('freefit.pas2')}</li>
            <li>{t('freefit.pas3')}</li>
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
            {t('freefit.oriceCsv')}
          </p>
        </>
      )}
      {eroare && <p style={{ color: 'var(--rosu)', fontWeight: 700 }}>{eroare}</p>}
      {previzualizare && (
        <>
          <p>
            <T
              k="freefit.amGasit"
              p={{
                n: previzualizare.length,
                prima: previzualizare[0].data.slice(0, 10),
                ultima: previzualizare[previzualizare.length - 1].data.slice(0, 10),
              }}
            />
          </p>
          <Sticker style={{ maxHeight: 180, overflowY: 'auto' }}>
            {previzualizare.slice(-10).map((p) => (
              <div key={p.data} className="rand mic" style={{ justifyContent: 'space-between' }}>
                <span>{p.data.slice(0, 10)}</span>
                <b>{p.greutate} kg</b>
              </div>
            ))}
            {previzualizare.length > 10 && (
              <p className="mic estompat">{t('freefit.siIncaN', { n: previzualizare.length - 10 })}</p>
            )}
          </Sticker>
          <div className="rand">
            <BigButton varianta="accent" onClick={() => void importa()}>
              {t('freefit.importa')}
            </BigButton>
            <BigButton varianta="contur" onClick={() => setPrevizualizare(null)}>
              {t('freefit.altFisier')}
            </BigButton>
          </div>
        </>
      )}
    </div>
  );
}
