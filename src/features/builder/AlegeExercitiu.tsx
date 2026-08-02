import { useMemo, useState } from 'react';
import { BigButton, Chip, Modal, Sticker, Stepper } from '@/design/components';
import { areCategorie, categorii, exercitii, getExercise, numeGrupa } from '@/data/catalog/exercises';
import type { ExerciseCategory, TemplateItem } from '@/data/types';
import type { Suggestion } from '@/domain/suggestions';
import { descrieMotiv } from '@/i18n/descrieri';
import { useT } from '@/i18n';

/**
 * Alegerea unui exercițiu + reglarea lui, într-un singur loc.
 *
 * Înainte, sala și editorul de planuri aveau fiecare varianta lor: în sală
 * puteai adăuga doar din sugestiile lui Flexu, cu 3×10 @ 10 kg bătute în cui.
 * Acum amândouă folosesc asta: cauți, filtrezi, îi pui parametrii, gata.
 */

/** Valorile de pornire pentru un exercițiu proaspăt adăugat. */
export function itemNou(exerciseId: string): TemplateItem {
  const ex = getExercise(exerciseId)!;
  return ex.masura === 'timp'
    ? { exerciseId, seturi: 1, durataSec: 300, pauzaSec: 60 }
    : { exerciseId, seturi: 3, repetari: 10, greutate: 10, pauzaSec: 90 };
}

export function AlegeExercitiu(props: {
  deschis: boolean;
  onInchide: () => void;
  onAlege: (item: TemplateItem) => void;
  /** sugestiile lui Flexu, dacă avem de unde (în sală) */
  sugestii?: Suggestion[] | null;
  /** textul butonului final */
  actiune?: string;
  /** al doilea buton, ex. „pornesc gol" din ecranul de start */
  extra?: { text: string; onClick: () => void };
}) {
  const { t } = useT();
  const [cauta, setCauta] = useState('');
  const [categorie, setCategorie] = useState<ExerciseCategory | 'toate'>('toate');
  const [ales, setAles] = useState<TemplateItem | null>(null);

  const toate = exercitii();
  const lista = useMemo(() => {
    const q = cauta.trim().toLowerCase();
    return toate.filter(
      (e) =>
        (categorie === 'toate' || areCategorie(e, categorie)) &&
        (!q || e.nume.toLowerCase().includes(q) || e.echipamentNume.toLowerCase().includes(q)),
    );
  }, [toate, cauta, categorie]);

  const inchide = () => {
    setAles(null);
    setCauta('');
    setCategorie('toate');
    props.onInchide();
  };

  const confirma = () => {
    if (!ales) return;
    props.onAlege(ales);
    setAles(null);
    setCauta('');
    setCategorie('toate');
  };

  if (!props.deschis) return null;

  // pasul 2: reglajele exercițiului ales
  if (ales) {
    const ex = getExercise(ales.exerciseId)!;
    return (
      <Modal deschis onInchide={() => setAles(null)} titlu={ex.nume}>
        <p className="mic estompat" style={{ margin: '0 0 12px' }}>
          {ex.echipamentNume} · {ex.muschi.map(numeGrupa).join(', ')}
        </p>
        <ParametriExercitiu item={ales} onChange={setAles} />
        <div style={{ height: 14 }} />
        <BigButton varianta="accent" mare onClick={confirma}>
          {props.actiune ?? t('alege.actiune')}
        </BigButton>
        <div style={{ height: 8 }} />
        <BigButton varianta="contur" onClick={() => setAles(null)}>
          {t('alege.altExercitiu')}
        </BigButton>
      </Modal>
    );
  }

  // pasul 1: căutarea
  return (
    <Modal deschis onInchide={inchide} titlu={t('alege.titlu')}>
      {props.sugestii && props.sugestii.length > 0 && (
        <>
          <div className="supratitlu-mic">{t('alege.flexuPropune')}</div>
          {props.sugestii.map((sg) => (
            <Sticker key={sg.exercise.id} onClick={() => setAles(itemNou(sg.exercise.id))} style={{ padding: 10 }}>
              <b>{sg.exercise.nume}</b>
              <div className="mic estompat">{descrieMotiv(sg.motiv)}</div>
            </Sticker>
          ))}
          <div style={{ height: 12 }} />
        </>
      )}

      <input
        id="alege-cauta"
        type="search"
        placeholder={t('alege.cauta.placeholder')}
        value={cauta}
        onChange={(e) => setCauta(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
        <Chip activ={categorie === 'toate'} onClick={() => setCategorie('toate')} nume={t('comun.toate')} />
        {categorii().map((c) => (
          <Chip key={c.id} activ={categorie === c.id} onClick={() => setCategorie(c.id)} nume={`${c.emoji} ${c.nume}`} />
        ))}
      </div>

      <div style={{ maxHeight: '42vh', overflowY: 'auto' }}>
        {lista.map((e) => (
          <button
            key={e.id}
            onClick={() => setAles(itemNou(e.id))}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              borderBottom: '2px solid var(--linie)',
              padding: '10px 4px',
              color: 'inherit',
              fontSize: '0.95rem',
            }}
          >
            <b>{e.nume}</b>
            <div className="mic estompat">
              {e.echipamentNume} · {e.muschi.map(numeGrupa).join(', ')}
            </div>
          </button>
        ))}
        {lista.length === 0 && <p className="estompat centrat">{t('alege.gol')}</p>}
      </div>

      {props.extra && (
        <>
          <div style={{ height: 10 }} />
          <BigButton varianta="contur" onClick={props.extra.onClick}>
            {props.extra.text}
          </BigButton>
        </>
      )}
    </Modal>
  );
}

/**
 * Reglajele unui element de plan. Folosit și în foaia de mai sus, și în
 * editorul de planuri — o singură definiție a ce înseamnă „seturi, repetări,
 * greutate, pauză, tempo, notiță".
 */
export function ParametriExercitiu(props: {
  item: TemplateItem;
  onChange: (it: TemplateItem) => void;
  /** tempo și notița n-au sens în foaia rapidă din sală */
  detaliat?: boolean;
}) {
  const { t } = useT();
  const { item, onChange } = props;
  const ex = getExercise(item.exerciseId)!;
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <Stepper
        eticheta={t('parametri.seturi')}
        valoare={item.seturi}
        min={1}
        max={10}
        onChange={(v) => onChange({ ...item, seturi: v })}
      />
      {ex.masura === 'repetari' ? (
        <>
          {item.repetari === undefined ? (
            <div className="rand" style={{ alignItems: 'center' }}>
              <b>{t('parametri.amrap')}</b>
              <BigButton varianta="contur" onClick={() => onChange({ ...item, repetari: 10 })}>
                {t('parametri.puneNumar')}
              </BigButton>
            </div>
          ) : (
            <>
              <Stepper
                eticheta={t('parametri.repetari')}
                valoare={item.repetari}
                min={1}
                max={50}
                onChange={(v) => onChange({ ...item, repetari: v })}
              />
              <BigButton varianta="contur" onClick={() => onChange({ ...item, repetari: undefined })}>
                {t('parametri.faAmrap')}
              </BigButton>
            </>
          )}
          <Stepper
            eticheta={t('parametri.greutate')}
            valoare={item.greutate ?? 0}
            pas={2.5}
            min={0}
            max={400}
            unitate="kg"
            onChange={(v) => onChange({ ...item, greutate: v })}
          />
        </>
      ) : (
        <>
          <Stepper
            eticheta={t('parametri.durata')}
            valoare={Math.round((item.durataSec ?? 300) / 60)}
            min={1}
            max={90}
            unitate="min"
            onChange={(v) => onChange({ ...item, durataSec: v * 60 })}
          />
          {ex.echipament === 'banda_alergare' && (
            <>
              <Stepper
                eticheta={t('parametri.viteza')}
                valoare={item.viteza ?? 5}
                pas={0.5}
                min={0.5}
                max={22}
                unitate="km/h"
                onChange={(v) => onChange({ ...item, viteza: v })}
              />
              <Stepper
                eticheta={t('parametri.inclinatie')}
                valoare={item.inclinatie ?? 0}
                pas={1}
                min={0}
                max={20}
                unitate="%"
                onChange={(v) => onChange({ ...item, inclinatie: v })}
              />
            </>
          )}
        </>
      )}
      <Stepper
        eticheta={t('parametri.pauza')}
        valoare={item.pauzaSec}
        pas={15}
        min={0}
        max={600}
        unitate="sec"
        onChange={(v) => onChange({ ...item, pauzaSec: v })}
      />
      {props.detaliat && (
        <>
          <div>
            <label htmlFor="tempo-sel">{t('parametri.tempo.eticheta')}</label>
            <select
              id="tempo-sel"
              value={item.tempo ?? ''}
              onChange={(e) => onChange({ ...item, tempo: e.target.value || undefined })}
            >
              <option value="">{t('parametri.tempo.fara')}</option>
              <option value="2-0-1">{t('parametri.tempo.normal')}</option>
              <option value="3-1-2">{t('parametri.tempo.controlat')}</option>
              <option value="4-2-1">{t('parametri.tempo.lent')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="item-notite">{t('parametri.notita.eticheta')}</label>
            <input
              id="item-notite"
              value={item.notite ?? ''}
              onChange={(e) => onChange({ ...item, notite: e.target.value || undefined })}
              placeholder={t('parametri.notita.placeholder')}
            />
          </div>
        </>
      )}
    </div>
  );
}
