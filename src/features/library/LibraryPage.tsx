import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  areCategorie,
  CATEGORII,
  DIFICULTATE_LABEL,
  EXERCITII,
  GRUPE_MUSCHI,
  numeGrupa,
} from '@/data/catalog/exercises';
import type { ExerciseCategory, MuscleGroup } from '@/data/types';
import { pluralRo, Sticker } from '@/design/components';

export function LibraryPage() {
  const [categorie, setCategorie] = useState<ExerciseCategory | 'toate'>('toate');
  const [grupa, setGrupa] = useState<MuscleGroup | 'toate'>('toate');
  const [cauta, setCauta] = useState('');

  const lista = useMemo(() => {
    const q = cauta.trim().toLowerCase();
    return EXERCITII.filter(
      (e) =>
        (categorie === 'toate' || areCategorie(e, categorie)) &&
        (grupa === 'toate' || e.muschi.includes(grupa) || e.muschiSecundari?.includes(grupa)) &&
        (!q || e.nume.toLowerCase().includes(q) || e.echipamentNume.toLowerCase().includes(q)),
    );
  }, [categorie, grupa, cauta]);

  const catActiva = CATEGORII.find((c) => c.id === categorie);

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">biblioteca de mișcări</div>
        <h1>Exerciții</h1>
        <p className="mic estompat" style={{ margin: 0 }}>
          {pluralRo(EXERCITII.length, 'exercițiu', 'exerciții')} cu sfaturi de formă, utilizare a aparatelor și
          demonstrații.
        </p>
      </div>

      <input
        type="search"
        placeholder="🔍 Caută exercițiu sau aparat…"
        value={cauta}
        onChange={(e) => setCauta(e.target.value)}
        aria-label="Caută exercițiu"
        style={{ marginBottom: 10 }}
      />

      <div className="supratitlu" style={{ fontSize: '0.7rem', marginBottom: 4 }}>
        categorie
      </div>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
        <FiltruChip activ={categorie === 'toate'} onClick={() => setCategorie('toate')} nume="Toate" />
        {CATEGORII.map((c) => (
          <FiltruChip
            key={c.id}
            activ={categorie === c.id}
            onClick={() => setCategorie(c.id)}
            nume={`${c.emoji} ${c.nume}`}
          />
        ))}
      </div>
      {catActiva && (
        <p className="mic estompat" style={{ margin: '0 0 8px' }}>
          {catActiva.descriere}
        </p>
      )}

      <div className="supratitlu" style={{ fontSize: '0.7rem', marginBottom: 4 }}>
        grupă musculară
      </div>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
        <FiltruChip activ={grupa === 'toate'} onClick={() => setGrupa('toate')} nume="Toate" />
        {GRUPE_MUSCHI.map((g) => (
          <FiltruChip key={g.id} activ={grupa === g.id} onClick={() => setGrupa(g.id)} nume={g.nume} />
        ))}
      </div>

      <p className="mic estompat" style={{ margin: '0 0 8px' }}>
        {pluralRo(lista.length, 'exercițiu', 'exerciții')}
      </p>

      {lista.map((e) => (
        <Link key={e.id} to={`/biblioteca/${e.id}`} style={{ textDecoration: 'none' }}>
          <Sticker>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
              <b style={{ fontSize: '1.02rem' }}>{e.nume}</b>
              <span className="eticheta-mica" style={{ flexShrink: 0 }}>
                {DIFICULTATE_LABEL[e.dificultate]}
              </span>
            </div>
            <div className="mic estompat">
              {e.echipamentNume} · {e.muschi.map(numeGrupa).join(', ')}
            </div>
          </Sticker>
        </Link>
      ))}
      {lista.length === 0 && (
        <p className="estompat centrat">Nimic găsit. Încearcă alt termen, altă grupă sau altă categorie.</p>
      )}
    </div>
  );
}

function FiltruChip(props: { activ: boolean; onClick: () => void; nume: string }) {
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
