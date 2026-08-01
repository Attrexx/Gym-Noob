import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DIFICULTATE_LABEL } from '@/data/catalog/exercises';
import { numaraExercitii, numeObiectiv, OBIECTIVE, PROGRAME } from '@/data/catalog/programs';
import type { ProgramGoal } from '@/data/types';
import { Chip, pluralRo, Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';

/**
 * Programele care vin cu aplicația — un tab din pagina Programe.
 * Nu-și pune singur `.pagina` sau copertă: le are gazda.
 */
export function ProgrameAplicatie() {
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
                {DIFICULTATE_LABEL[p.nivel]}
              </span>
            </div>
            <p className="mic" style={{ margin: '6px 0' }}>
              {p.subtitlu}
            </p>
            <div className="mic estompat">
              {p.frecventa} · {pluralRo(p.antrenamente.length, 'antrenament', 'antrenamente')} ·{' '}
              {pluralRo(numaraExercitii(p), 'exercițiu', 'exerciții')} · {p.durata}
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
