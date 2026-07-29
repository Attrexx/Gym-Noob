import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { BigButton, Sticker } from '@/design/components';
import { getExercise } from '@/data/catalog/exercises';
import { saveTemplate } from '@/data/repo';
import type { Template } from '@/data/types';
import { useSession } from '@/state/sessionStore';

export function TemplatesPage() {
  const { profil } = useProfile();
  const nav = useNavigate();
  const statusSesiune = useSession((s) => s.status);
  const sabloane = useLiveQuery(
    async () => (profil?.id ? db.templates.where({ profileId: profil.id }).toArray() : []),
    [profil?.id],
  );

  const dubleaza = async (t: Template) => {
    const { id: _id, ...rest } = t;
    await saveTemplate({ ...rest, nume: `${t.nume} (copie)`, predefinit: false, creatLa: '', modificatLa: '' } as Template);
  };

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">planurile tale</div>
        <h1>Antrenamente</h1>
      </div>

      <BigButton varianta="accent" mare onClick={() => nav('/antrenamente/nou')}>
        + Antrenament nou
      </BigButton>

      <div style={{ height: 14 }} />
      {(sabloane ?? []).map((t) => {
        const minute = Math.round(
          t.items.reduce((a, i) => a + i.seturi * ((i.durataSec ?? 40) + i.pauzaSec), 0) / 60,
        );
        return (
          <Sticker key={t.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: '1.05rem' }}>{t.nume}</b>{' '}
                {t.predefinit && <span className="eticheta-mica">de la Flexu</span>}
                <div className="mic estompat" style={{ marginTop: 2 }}>
                  {t.items.length} exerciții · ~{minute} min ·{' '}
                  {t.items
                    .slice(0, 3)
                    .map((i) => getExercise(i.exerciseId)?.nume ?? i.exerciseId)
                    .join(', ')}
                  {t.items.length > 3 ? '…' : ''}
                </div>
                {t.descriere && (
                  <p className="mic" style={{ margin: '6px 0 0' }}>
                    {t.descriere}
                  </p>
                )}
              </div>
            </div>
            <div className="rand" style={{ marginTop: 10 }}>
              <BigButton
                varianta="accent"
                onClick={() => nav('/sala', { state: { templateId: t.id } })}
                disabled={statusSesiune !== 'inactiva'}
              >
                ▶ Începe
              </BigButton>
              <BigButton onClick={() => nav(`/antrenamente/${t.id}`)}>Editează</BigButton>
              <BigButton varianta="contur" onClick={() => void dubleaza(t)}>
                Copiază
              </BigButton>
            </div>
          </Sticker>
        );
      })}
      {sabloane && sabloane.length === 0 && (
        <p className="estompat centrat">
          Niciun antrenament salvat. Creează unul sau vezi <Link to="/biblioteca">biblioteca de exerciții</Link>.
        </p>
      )}
    </div>
  );
}
