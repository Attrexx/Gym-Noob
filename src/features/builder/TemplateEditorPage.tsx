import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { BigButton, Modal, Sticker } from '@/design/components';
import { nr } from '@/i18n/format';
import { useT } from '@/i18n';
import { descriereSablon, numeSablon } from '@/data/catalog/text/rezolva';
import { getExercise, numeGrupa } from '@/data/catalog/exercises';
import { deleteTemplate, saveTemplate } from '@/data/repo';
import type { Template, TemplateItem } from '@/data/types';
import { AlegeExercitiu, ParametriExercitiu } from './AlegeExercitiu';

export function TemplateEditorPage() {
  const { t } = useT();
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

  // proveniența textului, dusă prin editor: dacă utilizatorul redenumește,
  // șablonul devine al lui și nu-l mai traducem niciodată
  const [sursaText, setSursaText] = useState<string | undefined>();
  const [textEditat, setTextEditat] = useState(false);

  useEffect(() => {
    if (!nou && id) {
      void db.templates.get(Number(id)).then((t) => {
        if (t) {
          // în câmp intră numele din limba curentă, nu cel înghețat în baza de date
          setNume(numeSablon(t));
          setDescriere(descriereSablon(t) ?? '');
          setEtichete(t.etichete ?? []);
          setItems(t.items);
          setTemplateId(t.id);
          setSursaText(t.sursaText);
          setTextEditat(t.textEditat ?? false);
        }
      });
    }
  }, [id, nou]);

  const salveaza = async () => {
    if (!profil?.id || !nume.trim() || items.length === 0) return;
    // zăvorul: dacă textul diferă de cel din catalog, e al utilizatorului
    const aScrisSingur =
      textEditat ||
      !sursaText ||
      nume.trim() !== numeSablon({ nume: '', sursaText } as Template) ||
      (descriere.trim() || undefined) !== descriereSablon({ descriere: undefined, sursaText } as Template);
    await saveTemplate({
      id: templateId,
      profileId: profil.id,
      nume: nume.trim(),
      descriere: descriere.trim() || undefined,
      etichete,
      items,
      sursaText,
      textEditat: aScrisSingur || undefined,
      creatLa: '',
      modificatLa: '',
      predefinit: false,
    } as Template);
    nav('/antrenamente');
  };

  const sterge = async () => {
    if (templateId && confirm(t('editor.stergeConfirmare'))) {
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
        <div className="supratitlu">{t(nou ? 'editor.supratitlu.nou' : 'editor.supratitlu.editare')}</div>
        <h1 style={{ fontSize: '1.5rem' }}>{nou ? t('editor.titlu.nou') : nume || '…'}</h1>
      </div>

      <label htmlFor="t-nume">{t('editor.nume.eticheta')}</label>
      <input
        id="t-nume"
        value={nume}
        onChange={(e) => setNume(e.target.value)}
        placeholder={t('editor.nume.placeholder')}
      />
      <label htmlFor="t-desc">{t('editor.descriere.eticheta')}</label>
      <input
        id="t-desc"
        value={descriere}
        onChange={(e) => setDescriere(e.target.value)}
        placeholder={t('editor.descriere.placeholder')}
      />

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
              {t('editor.item.seturi', { n: it.seturi })} ×{' '}
              {ex.masura === 'timp'
                ? `${Math.round((it.durataSec ?? 0) / 60)} min`
                : it.repetari
                  ? t('descriere.repetari', { n: it.repetari })
                  : t('plan.set.amrap')}
              {it.greutate ? ` @ ${nr(it.greutate)} kg` : ''} · {t('editor.item.pauza', { sec: it.pauzaSec })}
              {it.tempo ? ` · ${t('editor.item.tempo')} ${it.tempo}` : ''}
              {it.notite && (
                <div className="estompat" style={{ marginTop: 2 }}>
                  ↳ {it.notite}
                </div>
              )}
            </div>
            <div className="rand">
              <BigButton onClick={() => setEditIdx(idx)}>{t('editor.regleaza')}</BigButton>
              <BigButton varianta="contur" onClick={() => muta(idx, -1)} ariaLabel={t('editor.mutaSus')}>
                ↑
              </BigButton>
              <BigButton varianta="contur" onClick={() => muta(idx, 1)} ariaLabel={t('editor.mutaJos')}>
                ↓
              </BigButton>
              <BigButton
                varianta="contur"
                onClick={() => setItems(items.filter((_, i) => i !== idx))}
                ariaLabel={t('editor.stergeExercitiu')}
              >
                🗑
              </BigButton>
            </div>
          </Sticker>
        );
      })}

      <BigButton mare onClick={() => setAlegeExercitiu(true)}>
        {t('editor.adaugaExercitiu')}
      </BigButton>
      <div style={{ height: 10 }} />
      <BigButton varianta="accent" mare onClick={() => void salveaza()} disabled={!nume.trim() || items.length === 0}>
        {t('editor.salveaza')}
      </BigButton>
      {!nou && templateId && (
        <>
          <div style={{ height: 10 }} />
          <BigButton varianta="pericol" onClick={() => void sterge()}>
            {t('editor.sterge')}
          </BigButton>
        </>
      )}

      <AlegeExercitiu
        deschis={alegeExercitiu}
        onInchide={() => setAlegeExercitiu(false)}
        actiune={t('editor.adaugaInPlan')}
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
  const { t } = useT();
  const ex = getExercise(props.item.exerciseId)!;
  return (
    <Modal deschis onInchide={props.onInchide} titlu={ex.nume}>
      <ParametriExercitiu item={props.item} onChange={props.onChange} detaliat />
      <div style={{ height: 14 }} />
      <BigButton varianta="accent" onClick={props.onInchide}>
        {t('editor.gata')}
      </BigButton>
    </Modal>
  );
}
