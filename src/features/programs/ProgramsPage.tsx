import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DIFICULTATE_LABEL } from '@/data/catalog/exercises';
import { numaraExercitii, numeObiectiv, OBIECTIVE, PROGRAME } from '@/data/catalog/programs';
import type { ProgramGoal } from '@/data/types';
import { pluralRo, Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';

export function ProgramsPage() {
  const [obiectiv, setObiectiv] = useState<ProgramGoal | 'toate'>('toate');

  const lista = useMemo(
    () => (obiectiv === 'toate' ? PROGRAME : PROGRAME.filter((p) => p.obiective.includes(obiectiv))),
    [obiectiv],
  );

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">programe celebre</div>
        <h1>Programe</h1>
        <p className="mic estompat" style={{ margin: 0 }}>
          {pluralRo(PROGRAME.length, 'program', 'programe')} verificate de timp, traduse și explicate. Alegi
          unul, îl copiezi în antrenamentele tale, îl reglezi cum vrei.
        </p>
      </div>

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
    </div>
  );
}

function Chip(props: { activ: boolean; onClick: () => void; nume: string }) {
  return (
    <button
      onClick={props.onClick}
      style={{
        flexShrink: 0,
        border: '2px solid var(--contur)',
        borderRadius: 999,
        padding: '6px 12px',
        fontWeight: 800,
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        background: props.activ ? 'var(--accent)' : 'var(--panou)',
        color: props.activ ? 'var(--accent-fg)' : 'var(--panou-fg)',
      }}
    >
      {props.nume}
    </button>
  );
}
