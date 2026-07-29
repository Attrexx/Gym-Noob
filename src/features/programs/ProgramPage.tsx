import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '@/data/db';
import { DIFICULTATE_LABEL, getExercise } from '@/data/catalog/exercises';
import { getProgram, minuteEstimate, numeObiectiv } from '@/data/catalog/programs';
import { etichetaProgram, importaProgram } from '@/data/repo';
import type { ProgramWorkout, TemplateItem } from '@/data/types';
import { BigButton, Sticker, formatNr } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';
import { useProfile } from '@/state/profileStore';

export function ProgramPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { profil } = useProfile();
  const program = getProgram(id ?? '');
  const [importat, setImportat] = useState(false);

  const adaugate = useLiveQuery(
    async () =>
      profil?.id && program
        ? db.templates
            .where({ profileId: profil.id })
            .filter((t) => t.etichete.includes(etichetaProgram(program.id)))
            .count()
        : 0,
    [profil?.id, program?.id],
  );

  if (!program) {
    return (
      <div className="pagina">
        <p className="estompat centrat">Programul nu există.</p>
        <BigButton onClick={() => nav('/programe')}>Înapoi la programe</BigButton>
      </div>
    );
  }

  const adauga = async () => {
    if (!profil?.id) return;
    await importaProgram(profil.id, program);
    setImportat(true);
  };

  const faze = [...new Set(program.antrenamente.map((w) => w.faza ?? ''))];

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">program · {DIFICULTATE_LABEL[program.nivel].toLowerCase()}</div>
        <h1 style={{ fontSize: '1.45rem' }}>{program.nume}</h1>
        <p className="mic" style={{ margin: '4px 0 0' }}>
          {program.subtitlu}
        </p>
      </div>

      <Sticker>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {program.obiective.map((o) => (
            <span key={o} className="eticheta-mica">
              {numeObiectiv(o)}
            </span>
          ))}
        </div>
        <p style={{ margin: 0 }}>{program.descriere}</p>
        <div className="mic estompat" style={{ marginTop: 10 }}>
          <div>
            🗓 <b>{program.frecventa}</b>
          </div>
          <div>⏱ {program.durata} pe antrenament</div>
          <div>📜 {program.origine}</div>
        </div>
      </Sticker>

      <Lista titlu="Săptămâna arată așa" randuri={program.saptamana} />
      <Lista titlu="Cum crești greutățile" randuri={program.progresie} />
      {program.note && <Lista titlu="De reținut" randuri={program.note} />}

      <div style={{ height: 6 }} />
      <BigButton varianta="accent" mare onClick={() => void adauga()} disabled={!profil?.id}>
        {importat || (adaugate ?? 0) > 0
          ? `↻ Reîmprospătează cele ${program.antrenamente.length} antrenamente`
          : `+ Adaugă cele ${program.antrenamente.length} antrenamente la mine`}
      </BigButton>
      {(importat || (adaugate ?? 0) > 0) && (
        <p className="mic estompat centrat" style={{ margin: '8px 0 0' }}>
          {importat ? 'Gata! ' : ''}Le găsești în{' '}
          <Link to="/antrenamente">Planuri</Link>. Le poți edita fără să strici programul original.
        </p>
      )}

      <div style={{ height: 18 }} />
      {faze.map((faza) => (
        <div key={faza}>
          {faza && (
            <div className="supratitlu" style={{ margin: '10px 0 6px', fontWeight: 900 }}>
              {faza}
            </div>
          )}
          {program.antrenamente
            .filter((w) => (w.faza ?? '') === faza)
            .map((w) => (
              <Antrenament key={w.id} w={w} />
            ))}
        </div>
      ))}

      <FlexuSpune poza="avertizeaza">
        Greutățile din șabloane sunt doar un punct de plecare pentru cineva care începe. La prima sesiune
        reglează-le: ultimele 1-2 repetări trebuie să fie grele, dar curate.
      </FlexuSpune>
    </div>
  );
}

function Lista(props: { titlu: string; randuri: string[] }) {
  return (
    <Sticker>
      <b>{props.titlu}</b>
      <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
        {props.randuri.map((r, i) => (
          <li key={i} className="mic" style={{ marginBottom: 5 }}>
            {r}
          </li>
        ))}
      </ul>
    </Sticker>
  );
}

function Antrenament(props: { w: ProgramWorkout }) {
  const { w } = props;
  return (
    <Sticker>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
        <b style={{ fontSize: '1.05rem' }}>{w.nume}</b>
        <span className="eticheta-mica" style={{ flexShrink: 0 }}>
          ~{minuteEstimate(w.items)} min
        </span>
      </div>
      {w.descriere && (
        <p className="mic estompat" style={{ margin: '4px 0 8px' }}>
          {w.descriere}
        </p>
      )}
      <ol style={{ margin: 0, paddingLeft: 20 }}>
        {w.items.map((it, i) => {
          const ex = getExercise(it.exerciseId);
          if (!ex) return null;
          return (
            <li key={i} style={{ marginBottom: 7 }}>
              <Link to={`/biblioteca/${ex.id}`} style={{ fontWeight: 700 }}>
                {ex.nume}
              </Link>
              <div className="mic estompat">{descriereSet(it)}</div>
              {it.notite && (
                <div className="mic" style={{ marginTop: 2 }}>
                  ↳ {it.notite}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Sticker>
  );
}

/** „3 × 8 @ 40 kg · pauză 2:30" — formatul din cărțile de antrenament. */
export function descriereSet(it: TemplateItem): string {
  const ex = getExercise(it.exerciseId);
  const cantitate =
    ex?.masura === 'timp'
      ? `${Math.round((it.durataSec ?? 0) / 60)} min`
      : it.repetari
        ? `${it.repetari} rep.`
        : 'maxim (AMRAP)';
  const greutate = it.greutate ? ` @ ${formatNr(it.greutate)} kg` : '';
  const pauza = it.pauzaSec >= 60 ? `${Math.floor(it.pauzaSec / 60)}:${String(it.pauzaSec % 60).padStart(2, '0')}` : `${it.pauzaSec}s`;
  return `${it.seturi} × ${cantitate}${greutate} · pauză ${pauza}`;
}
