import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { numeDificultate } from '@/data/catalog/exercises';
import { numaraExercitii, numeObiectiv, OBIECTIVE, PROGRAME } from '@/data/catalog/programs';
import type { ProgramGoal } from '@/data/types';
import { Chip, Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';
import { useT } from '@/i18n';

/**
 * Programele care vin cu aplicația — un tab din pagina Programe.
 * Nu-și pune singur `.pagina` sau copertă: le are gazda.
 */
export function ProgrameAplicatie() {
  const { t } = useT();
  const [obiectiv, setObiectiv] = useState<ProgramGoal | 'toate'>('toate');

  const lista = useMemo(
    () => (obiectiv === 'toate' ? PROGRAME : PROGRAME.filter((p) => p.obiective.includes(obiectiv))),
    [obiectiv],
  );

  return (
    <>
      <FlexuSpune poza="explica">
        Cel mai bun program e cel pe care <b>chiar îl faci</b>, săptămână de săptămână. Nu-l alege pe cel mai
        complicat — alege-l pe cel care îți intră în program și rămâi la el trei luni.
      </FlexuSpune>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '10px 0 8px' }}>
        <Chip activ={obiectiv === 'toate'} onClick={() => setObiectiv('toate')} nume="Toate" />
        {OBIECTIVE.map((o) => (
          <Chip
            key={o.id}
            activ={obiectiv === o.id}
            onClick={() => setObiectiv(o.id)}
            nume={`${o.emoji} ${o.nume}`}
          />
        ))}
      </div>

      {lista.map((p) => (
        <Link key={p.id} to={`/programe/${p.id}`} style={{ textDecoration: 'none' }}>
          <Sticker>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
              <b style={{ fontSize: '1.08rem' }}>{p.nume}</b>
              <span className="eticheta-mica" style={{ flexShrink: 0 }}>
                {numeDificultate(p.nivel)}
              </span>
            </div>
            <p className="mic" style={{ margin: '6px 0' }}>
              {p.subtitlu}
            </p>
            <div className="mic estompat">
              {p.frecventa} · {t('comun.antrenamente', { n: p.antrenamente.length })} ·{' '}
              {t('comun.exercitii', { n: numaraExercitii(p) })} · {p.durata}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
              {p.obiective.map((o) => (
                <span key={o} className="eticheta-mica">
                  {numeObiectiv(o)}
                </span>
              ))}
            </div>
          </Sticker>
        </Link>
      ))}
    </>
  );
}
