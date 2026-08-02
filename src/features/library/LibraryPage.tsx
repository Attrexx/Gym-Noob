import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  areCategorie,
  categorii,
  exercitii,
  grupeMuschi,
  numeDificultate,
  numeGrupa,
} from '@/data/catalog/exercises';
import type { ExerciseCategory, MuscleGroup } from '@/data/types';
import { Chip, Sticker } from '@/design/components';
import { useT } from '@/i18n';

export function LibraryPage() {
  const { t, limba } = useT();
  const [categorie, setCategorie] = useState<ExerciseCategory | 'toate'>('toate');
  const [grupa, setGrupa] = useState<MuscleGroup | 'toate'>('toate');
  const [cauta, setCauta] = useState('');

  const toate = exercitii();
  const lista = useMemo(() => {
    const q = cauta.trim().toLowerCase();
    return toate.filter(
      (e) =>
        (categorie === 'toate' || areCategorie(e, categorie)) &&
        (grupa === 'toate' || e.muschi.includes(grupa) || e.muschiSecundari?.includes(grupa)) &&
        (!q || e.nume.toLowerCase().includes(q) || e.echipamentNume.toLowerCase().includes(q)),
    );
    // `limba` e în dependențe fiindcă numele după care se caută se traduc
  }, [toate, categorie, grupa, cauta, limba]);

  const catActiva = categorii().find((c) => c.id === categorie);

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">{t('biblioteca.supratitlu')}</div>
        <h1>{t('biblioteca.titlu')}</h1>
        <p className="mic estompat" style={{ margin: 0 }}>
          {t('biblioteca.descriere', { ce: t('comun.exercitii', { n: toate.length }) })}
        </p>
      </div>

      <input
        type="search"
        placeholder={t('biblioteca.cauta.placeholder')}
        value={cauta}
        onChange={(e) => setCauta(e.target.value)}
        aria-label={t('biblioteca.cauta.aria')}
        style={{ marginBottom: 10 }}
      />

      <div className="supratitlu" style={{ fontSize: '0.7rem', marginBottom: 4 }}>
        {t('biblioteca.filtru.categorie')}
      </div>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
        <Chip activ={categorie === 'toate'} onClick={() => setCategorie('toate')} nume={t('comun.toate')} />
        {categorii().map((c) => (
          <Chip
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
        {t('biblioteca.filtru.grupa')}
      </div>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
        <Chip activ={grupa === 'toate'} onClick={() => setGrupa('toate')} nume={t('comun.toate')} />
        {grupeMuschi().map((g) => (
          <Chip key={g.id} activ={grupa === g.id} onClick={() => setGrupa(g.id)} nume={g.nume} />
        ))}
      </div>

      <p className="mic estompat" style={{ margin: '0 0 8px' }}>
        {t('comun.exercitii', { n: lista.length })}
      </p>

      {lista.map((e) => (
        <Link key={e.id} to={`/biblioteca/${e.id}`} style={{ textDecoration: 'none' }}>
          <Sticker>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
              <b style={{ fontSize: '1.02rem' }}>{e.nume}</b>
              <span className="eticheta-mica" style={{ flexShrink: 0 }}>
                {numeDificultate(e.dificultate)}
              </span>
            </div>
            <div className="mic estompat">
              {e.echipamentNume} · {e.muschi.map(numeGrupa).join(', ')}
            </div>
          </Sticker>
        </Link>
      ))}
      {lista.length === 0 && <p className="estompat centrat">{t('biblioteca.gol')}</p>}
    </div>
  );
}

