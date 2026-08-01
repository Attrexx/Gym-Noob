import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useParams } from 'react-router-dom';
import { DIFICULTATE_LABEL, getExercise, numeGrupa } from '@/data/catalog/exercises';
import { SectionTitle, StatTile, Sticker } from '@/design/components';
import { data, nr } from '@/i18n/format';
import { FlexuSpune } from '@/design/Flexu';
import { MuscleDiagram } from './MuscleDiagram';
import { ExerciseAnim } from './ExerciseAnim';
import { useProfile } from '@/state/profileStore';
import { setLogsForExercise } from '@/data/repo';
import { bestRecords, PR_LABEL, type PrType } from '@/domain/pr';

export function ExercisePage() {
  const { id } = useParams();
  const { profil } = useProfile();
  const ex = id ? getExercise(id) : undefined;

  const istoric = useLiveQuery(
    async () => (profil?.id && ex ? setLogsForExercise(profil.id, ex.id) : []),
    [profil?.id, ex?.id],
  );

  if (!ex) {
    return (
      <div className="pagina">
        <p>Exercițiul nu există.</p>
        <Link to="/biblioteca">← Înapoi la bibliotecă</Link>
      </div>
    );
  }

  const recorduri = istoric && istoric.length ? bestRecords(istoric) : null;
  const variante = (ex.variante ?? []).map(getExercise).filter((v) => v !== undefined);

  return (
    <div className="pagina">
      <Link to="/biblioteca" className="mic" style={{ fontWeight: 700 }}>
        ← Biblioteca
      </Link>
      <div className="coperta" style={{ marginTop: 8 }}>
        <div className="supratitlu">{ex.echipamentNume}</div>
        <h1 style={{ fontSize: '1.5rem' }}>{ex.nume}</h1>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="eticheta-mica">{DIFICULTATE_LABEL[ex.dificultate]}</span>
          {ex.muschi.map((m) => (
            <span key={m} className="eticheta-mica" style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}>
              {numeGrupa(m)}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <ExerciseAnim anim={ex.anim} marime={170} />
        <MuscleDiagram principale={ex.muschi} secundare={ex.muschiSecundari} marime={175} />
      </div>

      <SectionTitle supratitlu="pas cu pas">Execuția corectă</SectionTitle>
      <Sticker>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {ex.forma.map((f, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {f}
            </li>
          ))}
        </ol>
      </Sticker>

      <SectionTitle supratitlu="aparatul">Cum îl folosești</SectionTitle>
      <Sticker>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {ex.utilizare.map((f, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {f}
            </li>
          ))}
        </ul>
      </Sticker>

      <SectionTitle supratitlu="atenție">Greșeli frecvente</SectionTitle>
      <FlexuSpune poza="avertizeaza">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {ex.greseli.map((g, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {g}
            </li>
          ))}
        </ul>
      </FlexuSpune>

      <SectionTitle supratitlu="de la Flexu">Ponturi</SectionTitle>
      <Sticker accent>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {ex.ponturi.map((p, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {p}
            </li>
          ))}
        </ul>
      </Sticker>

      {variante.length > 0 && (
        <>
          <SectionTitle supratitlu="mai ușor, mai greu, altfel">Variante înrudite</SectionTitle>
          {variante.map((v) => (
            <Link key={v.id} to={`/biblioteca/${v.id}`} style={{ textDecoration: 'none' }}>
              <Sticker>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                  <b>{v.nume}</b>
                  <span className="eticheta-mica" style={{ flexShrink: 0 }}>
                    {DIFICULTATE_LABEL[v.dificultate]}
                  </span>
                </div>
                <div className="mic estompat">{v.echipamentNume}</div>
              </Sticker>
            </Link>
          ))}
        </>
      )}

      {recorduri && (
        <>
          <SectionTitle supratitlu="ale tale">Recorduri personale</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(Object.keys(recorduri) as PrType[])
              .filter((t) => recorduri[t])
              .map((t) => (
                <StatTile
                  key={t}
                  valoare={`${nr(recorduri[t]!.valoare)}${t === 'repetari' ? '' : ' kg'}`}
                  eticheta={PR_LABEL[t]}
                  sub={data(recorduri[t]!.data)}
                />
              ))}
          </div>
          <p className="mic estompat">
            {istoric!.length} seturi înregistrate la acest exercițiu, în total.
          </p>
        </>
      )}
    </div>
  );
}
