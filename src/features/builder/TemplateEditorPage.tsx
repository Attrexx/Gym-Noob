import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { BigButton, Modal, Sticker, formatNr } from '@/design/components';
import { getExercise, numeGrupa } from '@/data/catalog/exercises';
import { deleteTemplate, saveTemplate } from '@/data/repo';
import type { Template, TemplateItem } from '@/data/types';
import { AlegeExercitiu, ParametriExercitiu } from './AlegeExercitiu';

export function TemplateEditorPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { profil } = useProfile();
  const nou = id === 'nou';

  const [nume, setNume] = useState('');
  const [descriere, setDescriere] = useState('');
  const [etichete, setEtichete] = useState<string[]>([]);
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [templateId, setTemplateId] = useState<number | undefined>();
  const [alegeExercitiu, setAlegeExercitiu] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!nou && id) {
      void db.templates.get(Number(id)).then((t) => {
        if (t) {
          setNume(t.nume);
          setDescriere(t.descriere ?? '');
          setEtichete(t.etichete ?? []);
          setItems(t.items);
          setTemplateId(t.id);
        }
      });
    }
  }, [id, nou]);

  const salveaza = async () => {
    if (!profil?.id || !nume.trim() || items.length === 0) return;
    await saveTemplate({
      id: templateId,
      profileId: profil.id,
      nume: nume.trim(),
      descriere: descriere.trim() || undefined,
      etichete,
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
              {ex.masura === 'timp'
                ? `${Math.round((it.durataSec ?? 0) / 60)} min`
                : it.repetari
                  ? `${it.repetari} rep.`
                  : 'maxim (AMRAP)'}
              {it.greutate ? ` @ ${formatNr(it.greutate)} kg` : ''} · pauză {it.pauzaSec}s
              {it.tempo ? ` · tempo ${it.tempo}` : ''}
              {it.notite && (
                <div className="estompat" style={{ marginTop: 2 }}>
                  ↳ {it.notite}
                </div>
              )}
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

      <AlegeExercitiu
        deschis={alegeExercitiu}
        onInchide={() => setAlegeExercitiu(false)}
        actiune="+ Adaugă în plan"
        onAlege={(it) => {
          setItems([...items, it]);
          setAlegeExercitiu(false);
        }}
      />

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
  const ex = getExercise(props.item.exerciseId)!;
  return (
    <Modal deschis onInchide={props.onInchide} titlu={ex.nume}>
      <ParametriExercitiu item={props.item} onChange={props.onChange} detaliat />
      <div style={{ height: 14 }} />
      <BigButton varianta="accent" onClick={props.onInchide}>
        Gata
      </BigButton>
    </Modal>
  );
}
