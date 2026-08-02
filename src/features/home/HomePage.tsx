import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/data/db';
import { BigButton, ProgressBar, SectionTitle, StatTile, Sticker } from '@/design/components';
import { data } from '@/i18n/format';
import { useT } from '@/i18n';
import { FlexuSpune } from '@/design/Flexu';
import { useProfile } from '@/state/profileStore';
import { bugetZilnic, saptamaniPanaLaTinta, varstaDinData } from '@/domain/goals';
import { sfatulZilei } from '@/data/catalog/tips';
import { setGreutateCurenta, useSession } from '@/state/sessionStore';
import { weeklyStreak, trainingDays } from '@/domain/achievements';

export function HomePage() {
  const { t, fmt } = useT();
  const { profil } = useProfile();
  const nav = useNavigate();
  const statusSesiune = useSession((s) => s.status);
  const azi = new Date().toISOString().slice(0, 10);

  const date = useLiveQuery(async () => {
    if (!profil?.id) return null;
    const pid = profil.id;
    const [metrici, goal, sesiuniAzi, toateSesiunile] = await Promise.all([
      db.bodyMetrics.where('[profileId+data]').between([pid, ''], [pid, '￿']).toArray(),
      db.goals.where({ profileId: pid }).filter((g) => g.activ).first(),
      db.sessions.where('[profileId+inceput]').between([pid, azi], [pid, azi + '￿']).toArray(),
      db.sessions.where({ profileId: pid }).toArray(),
    ]);
    return { metrici, goal, sesiuniAzi, toateSesiunile };
  }, [profil?.id, azi]);

  if (!profil || !date) return <div className="pagina" />;

  const ultima = date.metrici[date.metrici.length - 1];
  const greutate = ultima?.greutate ?? 80;
  setGreutateCurenta(greutate);
  const arseAzi = date.sesiuniAzi.reduce((a, s) => a + (s.kcal ?? 0), 0);
  const buget = bugetZilnic({
    sex: profil.sex,
    greutate,
    inaltime: profil.inaltime,
    varsta: varstaDinData(profil.dataNasterii),
    activitate: profil.activitate,
    ritmKgSaptamana: date.goal?.ritmKgSaptamana ?? 0,
    arseAntrenament: arseAzi,
  });
  const streak = weeklyStreak(trainingDays(date.toateSesiunile));
  const saptamani = date.goal ? saptamaniPanaLaTinta(greutate, date.goal.greutateTinta, date.goal.ritmKgSaptamana) : null;
  const antrenamentAzi = date.sesiuniAzi.some((s) => s.status === 'terminata');

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">{data(new Date(), 'zilnic')}</div>
        <h1>{t('acasa.salut', { nume: profil.nume })}</h1>
        {streak > 0 && <span className="eticheta-mica">🔥 {t('acasa.streak', { n: streak })}</span>}
      </div>

      {statusSesiune !== 'inactiva' ? (
        <BigButton varianta="accent" mare onClick={() => nav('/sala')}>
          ● {t('acasa.continua')}
        </BigButton>
      ) : (
        <BigButton varianta="accent" mare onClick={() => nav('/sala')}>
          {t(antrenamentAzi ? 'acasa.incaOSesiune' : 'acasa.incepe')}
        </BigButton>
      )}

      <SectionTitle
        supratitlu={t('acasa.buget.supratitlu')}
        actiune={
          <Link to="/greutate" className="mic">
            {t('comun.detalii')}
          </Link>
        }
      >
        {t('acasa.buget.titlu')}
      </SectionTitle>
      <Sticker>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <StatTile valoare={buget.tdee} eticheta={t('acasa.buget.consumi')} sub={t('acasa.buget.consumiSub')} />
          <StatTile
            valoare={arseAzi > 0 ? `+${Math.round(arseAzi)}` : '0'}
            eticheta={t('acasa.buget.arse')}
            sub={t('acasa.buget.arseSub')}
          />
          <StatTile
            valoare={buget.aportMaximAzi}
            eticheta={t('acasa.buget.potiManca')}
            sub={t('acasa.buget.potiMancaSub')}
            accent
          />
        </div>
        <p className="mic estompat" style={{ margin: '10px 0 0' }}>
          {date.goal
            ? `${t('acasa.tinta.text', {
                tinta: date.goal.greutateTinta,
                ritm: date.goal.ritmKgSaptamana,
                deficit: buget.deficit,
              })} ${saptamani ? t('acasa.tinta.maiAi', { n: saptamani }) : t('acasa.tinta.atins')}`
            : t('acasa.tinta.gol')}
        </p>
      </Sticker>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatTile
          valoare={`${fmt.nr(greutate)} kg`}
          eticheta={t('acasa.greutateCurenta')}
          sub={ultima ? data(ultima.data) : ''}
        />
        <StatTile
          valoare={date.goal ? `${fmt.nr(Math.max(0, greutate - date.goal.greutateTinta))} kg` : '—'}
          eticheta={t('acasa.panaLaTinta')}
          sub={date.goal ? t('acasa.tintaKg', { kg: date.goal.greutateTinta }) : ''}
        />
      </div>

      <SectionTitle supratitlu={t('acasa.sfat.supratitlu')}>{t('acasa.sfat.titlu')}</SectionTitle>
      <FlexuSpune poza="explica">{sfatulZilei()}</FlexuSpune>

      <SectionTitle
        supratitlu={t('acasa.progres.supratitlu')}
        actiune={
          <Link to="/statistici" className="mic">
            {t('comun.toateLink')}
          </Link>
        }
      >
        {t('acasa.progres.titlu')}
      </SectionTitle>
      <SaptamanaCurenta zile={trainingDays(date.toateSesiunile)} />
    </div>
  );
}

/** Cheile inițialelor, de luni la duminică — ordinea e a săptămânii europene. */
const ZILE = [
  'acasa.zi.luni',
  'acasa.zi.marti',
  'acasa.zi.miercuri',
  'acasa.zi.joi',
  'acasa.zi.vineri',
  'acasa.zi.sambata',
  'acasa.zi.duminica',
] as const;

function SaptamanaCurenta(props: { zile: string[] }) {
  const { t } = useT();
  const azi = new Date();
  const luni = new Date(azi);
  luni.setDate(azi.getDate() - ((azi.getDay() + 6) % 7));
  const set = new Set(props.zile);
  const zile = ZILE.map((cheieZi, i) => {
    const d = new Date(luni);
    d.setDate(luni.getDate() + i);
    const cheie = d.toISOString().slice(0, 10);
    return { n: t(cheieZi), facut: set.has(cheie), azi: cheie === new Date().toISOString().slice(0, 10) };
  });
  const facute = zile.filter((z) => z.facut).length;
  return (
    <Sticker>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', marginBottom: 8 }}>
        {zile.map((z, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '8px 0',
              border: '2px solid var(--contur)',
              borderRadius: 8,
              fontWeight: 800,
              fontSize: '0.8rem',
              background: z.facut ? 'var(--accent)' : 'var(--panou)',
              color: z.facut ? 'var(--accent-fg)' : 'var(--panou-fg)',
              outline: z.azi ? '3px solid var(--contur)' : 'none',
            }}
          >
            {z.n}
            <div style={{ fontSize: '0.9rem' }}>{z.facut ? '✓' : '·'}</div>
          </div>
        ))}
      </div>
      <ProgressBar
        procent={(facute / 3) * 100}
        eticheta={t('acasa.recomandate', { facute, total: 3 })}
      />
    </Sticker>
  );
}
