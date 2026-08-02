import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { BigButton, Chip, Sticker } from '@/design/components';
import { T, useT } from '@/i18n';
import { getExercise } from '@/data/catalog/exercises';
import { descriereSablon, numeSablon } from '@/data/catalog/text/rezolva';
import { getProgram, programe } from '@/data/catalog/programs';
import { etichetaProgram, saveTemplate } from '@/data/repo';
import type { Template } from '@/data/types';
import { useSession } from '@/state/sessionStore';
import { ProgrameAplicatie } from '../programs/ProgramsPage';

/**
 * Programe = planuri. Un singur loc, două rafturi.
 *
 * Înainte erau două pagini care spuneau același lucru: „Planuri" (ale tale)
 * în bara de jos și „Programe celebre" ascunse în Mai mult. Proprietarul a
 * spus-o simplu: *„Programe = Planuri. same stuff"* — deci le-am pus împreună,
 * cu un tab pentru ale tale și unul pentru cele care vin cu aplicația.
 */

const PREFIX_PROGRAM = etichetaProgram('');

/** Numele programului din care provine șablonul, dacă e cazul. */
function numeleProgramului(t: Template): string | undefined {
  const eticheta = t.etichete.find((e) => e.startsWith(PREFIX_PROGRAM));
  return eticheta ? getProgram(eticheta.slice(PREFIX_PROGRAM.length))?.nume : undefined;
}

export function TemplatesPage(props: { tabInitial?: 'mele' | 'aplicatie' }) {
  const { t } = useT();
  const [tab, setTab] = useState<'mele' | 'aplicatie'>(props.tabInitial ?? 'mele');

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">{t('planuri.supratitlu')}</div>
        <h1>{t('planuri.titlu')}</h1>
        <p className="mic estompat" style={{ margin: 0 }}>
          {t('planuri.descriere', { ce: t('comun.programeCelebre', { n: programe().length }) })}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '4px 0 12px' }}>
        <Chip id="tab-mele" activ={tab === 'mele'} onClick={() => setTab('mele')} nume={t('planuri.tab.mele')} />
        <Chip
          id="tab-aplicatie"
          activ={tab === 'aplicatie'}
          onClick={() => setTab('aplicatie')}
          nume={t('planuri.tab.aplicatie')}
        />
      </div>

      {tab === 'mele' ? <PlanurileMele /> : <ProgrameAplicatie />}
    </div>
  );
}

function PlanurileMele() {
  const { t } = useT();
  const { profil } = useProfile();
  const nav = useNavigate();
  const statusSesiune = useSession((s) => s.status);
  const sabloane = useLiveQuery(
    async () => (profil?.id ? db.templates.where({ profileId: profil.id }).toArray() : []),
    [profil?.id],
  );

  const dubleaza = async (sablon: Template) => {
    const { id: _id, sursaText: _s, ...rest } = sablon;
    // copia e a utilizatorului: îi înghețăm numele din limba curentă și îi
    // tăiem proveniența, ca să nu se mai schimbe sub el
    await saveTemplate({
      ...rest,
      nume: t('planuri.copie', { nume: numeSablon(sablon) }),
      descriere: descriereSablon(sablon),
      textEditat: true,
      predefinit: false,
      creatLa: '',
      modificatLa: '',
    } as Template);
  };

  return (
    <>
      <BigButton varianta="accent" mare onClick={() => nav('/antrenamente/nou')}>
        {t('planuri.nou')}
      </BigButton>

      <div style={{ height: 14 }} />
      {(sabloane ?? []).map((sablon) => {
        const minute = Math.round(
          sablon.items.reduce((a, i) => a + i.seturi * ((i.durataSec ?? 40) + i.pauzaSec), 0) / 60,
        );
        return (
          <Sticker key={sablon.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: '1.05rem' }}>{numeSablon(sablon)}</b>{' '}
                {sablon.predefinit && <span className="eticheta-mica">{t('planuri.deLaFlexu')}</span>}
                {numeleProgramului(sablon) && <span className="eticheta-mica">{numeleProgramului(sablon)}</span>}
                <div className="mic estompat" style={{ marginTop: 2 }}>
                  {t('comun.exercitii', { n: sablon.items.length })} · ~{minute} min ·{' '}
                  {sablon.items
                    .slice(0, 3)
                    .map((i) => getExercise(i.exerciseId)?.nume ?? i.exerciseId)
                    .join(', ')}
                  {sablon.items.length > 3 ? '…' : ''}
                </div>
                {descriereSablon(sablon) && (
                  <p className="mic" style={{ margin: '6px 0 0' }}>
                    {descriereSablon(sablon)}
                  </p>
                )}
              </div>
            </div>
            <div className="rand" style={{ marginTop: 10 }}>
              <BigButton
                varianta="accent"
                onClick={() => nav('/sala', { state: { templateId: sablon.id } })}
                disabled={statusSesiune !== 'inactiva'}
              >
                {t('planuri.incepe')}
              </BigButton>
              <BigButton onClick={() => nav(`/antrenamente/${sablon.id}`)}>{t('planuri.editeaza')}</BigButton>
              <BigButton varianta="contur" onClick={() => void dubleaza(sablon)}>
                {t('planuri.copiaza')}
              </BigButton>
            </div>
          </Sticker>
        );
      })}
      {sabloane && sabloane.length === 0 && (
        <p className="estompat centrat">
          <T k="planuri.gol" c={[<b key="b" />, <Link key="l" to="/biblioteca" />]} />
        </p>
      )}
    </>
  );
}
