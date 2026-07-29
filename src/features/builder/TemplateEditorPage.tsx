import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { BigButton, Modal, Sticker, Stepper, formatNr } from '@/design/components';
import { EXERCITII, getExercise, numeGrupa } from '@/data/catalog/exercises';
import { deleteTemplate, saveTemplate } from '@/data/repo';
import type { Template, TemplateItem } from '@/data/types';

function itemNou(exerciseId: string): TemplateItem {
  const ex = getExercise(exerciseId)!;
  return ex.masura === 'timp'
    ? { exerciseId, seturi: 1, durataSec: 300, pauzaSec: 60 }
    : { exerciseId, seturi: 3, repetari: 10, greutate: 10, pauzaSec: 90 };
}

export function TemplateEditorPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { profil } = useProfile();
  const nou = id === 'nou';

  const [nume, setNume] = useState('');
  const [descriere, setDescriere] = useState('');
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [templateId, setTemplateId] = useState<number | undefined>();
  const [alegeExercitiu, setAlegeExercitiu] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [cauta, setCauta] = useState('');

  useEffect(() => {
    if (!nou && id) {
      void db.templates.get(Number(id)).then((t) => {
        if (t) {
          setNume(t.nume);
          setDescriere(t.descriere ?? '');
          setItems(t.items);
          setTemplateId(t.id);
        }
      });
    }
  }, [id, nou]);

  const listaCautare = useMemo(() => {
    const q = cauta.trim().toLowerCase();
    return EXERCITII.filter((e) => !q || e.nume.toLowerCase().includes(q) || e.echipamentNume.toLowerCase().includes(q));
  }, [cauta]);

  const salveaza = async () => {
    if (!profil?.id || !nume.trim() || items.length === 0) return;
    await saveTemplate({
      id: templateId,
      profileId: profil.id,
      nume: nume.trim(),
      descriere: descriere.trim() || undefined,
      etichete: [],
      items,
      creatLa: '',
      modificatLa: '',
      predefinit: false,
    } as Template);
    nav('/antrenamente');
  };

  const sterge = async () => {
    if (templateId && confirm('Ștergi definitiv acest antrenament?')) {
      await deleteTemplate(templateId);
      nav('/antrenamente');
    }
  };

  const muta = (idx: number, dir: -1 | 1) => {
    const tinta = idx + dir;
    if (tinta < 0 || tinta >= items.length) return;
    const copie = [...items];
    [copie[idx], copie[tinta]] = [copie[tinta], copie[idx]];
    setItems(copie);
  };

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">{nou ? 'plan nou' : 'editare'}</div>
        <h1 style={{ fontSize: '1.5rem' }}>{nou ? 'Antrenament nou' : nume || '…'}</h1>
      </div>

      <label htmlFor="t-nume">Numele antrenamentului</label>
      <input id="t-nume" value={nume} onChange={(e) => setNume(e.target.value)} placeholder="ex. Ziua de împins" />
      <label htmlFor="t-desc">Descriere (opțional)</label>
      <input id="t-desc" value={descriere} onChange={(e) => setDescriere(e.target.value)} placeholder="scopul planului…" />

      <div style={{ height: 14 }} />
      {items.map((it, idx) => {
        const ex = getExercise(it.exerciseId);
        if (!ex) return null;
        return (
          <Sticker key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <b>{ex.nume}</b>
              <span className="mic estompat">{numeGrupa(ex.muschi[0])}</span>
            </div>
            <div className="mic" style={{ margin: '4px 0 8px' }}>
              {it.seturi} {it.seturi === 1 ? 'set' : 'seturi'} ×{' '}
              {ex.masura === 'timp' ? `${Math.round((it.durataSec ?? 0) / 60)} min` : `${it.repetari} rep.`}
              {it.greutate ? ` @ ${formatNr(it.greutate)} kg` : ''} · pauză {it.pauzaSec}s
              {it.tempo ? ` · tempo ${it.tempo}` : ''}
            </div>
            <div className="rand">
              <BigButton onClick={() => setEditIdx(idx)}>Reglează</BigButton>
              <BigButton varianta="contur" onClick={() => muta(idx, -1)} ariaLabel="Mută mai sus">
                ↑
              </BigButton>
              <BigButton varianta="contur" onClick={() => muta(idx, 1)} ariaLabel="Mută mai jos">
                ↓
              </BigButton>
              <BigButton varianta="contur" onClick={() => setItems(items.filter((_, i) => i !== idx))} ariaLabel="Șterge exercițiul">
                🗑
              </BigButton>
            </div>
          </Sticker>
        );
      })}

      <BigButton mare onClick={() => setAlegeExercitiu(true)}>
        + Adaugă exercițiu
      </BigButton>
      <div style={{ height: 10 }} />
      <BigButton varianta="accent" mare onClick={() => void salveaza()} disabled={!nume.trim() || items.length === 0}>
        💾 Salvează antrenamentul
      </BigButton>
      {!nou && templateId && (
        <>
          <div style={{ height: 10 }} />
          <BigButton varianta="pericol" onClick={() => void sterge()}>
            Șterge
          </BigButton>
        </>
      )}

      <Modal deschis={alegeExercitiu} onInchide={() => setAlegeExercitiu(false)} titlu="Alege exercițiul">
        <input
          type="search"
          placeholder="Caută…"
          value={cauta}
          onChange={(e) => setCauta(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <div style={{ maxHeight: '48vh', overflowY: 'auto' }}>
          {listaCautare.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                setItems([...items, itemNou(e.id)]);
                setAlegeExercitiu(false);
                setCauta('');
              }}
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
        </div>
      </Modal>

      {editIdx !== null && items[editIdx] && (
        <ItemEditor
          item={items[editIdx]}
          onChange={(it) => setItems(items.map((x, i) => (i === editIdx ? it : x)))}
          onInchide={() => setEditIdx(null)}
        />
      )}
    </div>
  );
}

function ItemEditor(props: { item: TemplateItem; onChange: (it: TemplateItem) => void; onInchide: () => void }) {
  const { item, onChange } = props;
  const ex = getExercise(item.exerciseId)!;
  return (
    <Modal deschis onInchide={props.onInchide} titlu={ex.nume}>
      <div style={{ display: 'grid', gap: 14 }}>
        <Stepper eticheta="Seturi" valoare={item.seturi} min={1} max={10} onChange={(v) => onChange({ ...item, seturi: v })} />
        {ex.masura === 'repetari' ? (
          <>
            <Stepper eticheta="Repetări" valoare={item.repetari ?? 10} min={1} max={50} onChange={(v) => onChange({ ...item, repetari: v })} />
            <Stepper
              eticheta="Greutate"
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
              eticheta="Durată (minute)"
              valoare={Math.round((item.durataSec ?? 300) / 60)}
              min={1}
              max={90}
              unitate="min"
              onChange={(v) => onChange({ ...item, durataSec: v * 60 })}
            />
            {ex.echipament === 'banda_alergare' && (
              <>
                <Stepper
                  eticheta="Viteză de pornire"
                  valoare={item.viteza ?? 5}
                  pas={0.5}
                  min={0.5}
                  max={22}
                  unitate="km/h"
                  onChange={(v) => onChange({ ...item, viteza: v })}
                />
                <Stepper
                  eticheta="Înclinație de pornire"
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
        <Stepper eticheta="Pauză între seturi" valoare={item.pauzaSec} pas={15} min={0} max={600} unitate="sec" onChange={(v) => onChange({ ...item, pauzaSec: v })} />
        <div>
          <label htmlFor="tempo-sel">Cadență (tempo) — opțional</label>
          <select
            id="tempo-sel"
            value={item.tempo ?? ''}
            onChange={(e) => onChange({ ...item, tempo: e.target.value || undefined })}
          >
            <option value="">fără</option>
            <option value="2-0-1">2-0-1 (normal)</option>
            <option value="3-1-2">3-1-2 (controlat)</option>
            <option value="4-2-1">4-2-1 (lent, intens)</option>
          </select>
        </div>
        <BigButton varianta="accent" onClick={props.onInchide}>
          Gata
        </BigButton>
      </div>
    </Modal>
  );
}
