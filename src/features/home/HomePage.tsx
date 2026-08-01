import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/data/db';
import { BigButton, ProgressBar, SectionTitle, StatTile, Sticker } from '@/design/components';
import { data, nr } from '@/i18n/format';
import { FlexuSpune } from '@/design/Flexu';
import { useProfile } from '@/state/profileStore';
import { bugetZilnic, saptamaniPanaLaTinta, varstaDinData } from '@/domain/goals';
import { sfatulZilei } from '@/data/catalog/tips';
import { setGreutateCurenta, useSession } from '@/state/sessionStore';
import { weeklyStreak, trainingDays } from '@/domain/achievements';

export function HomePage() {
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
        <h1>Salut, {profil.nume}!</h1>
        {streak > 0 && <span className="eticheta-mica">🔥 {streak} săpt. consecutive</span>}
      </div>

      {statusSesiune !== 'inactiva' ? (
        <BigButton varianta="accent" mare onClick={() => nav('/sala')}>
          ● Continuă sesiunea
        </BigButton>
      ) : (
        <BigButton varianta="accent" mare onClick={() => nav('/sala')}>
          {antrenamentAzi ? 'Încă o sesiune azi? 😎' : 'Începe antrenamentul'}
        </BigButton>
      )}

      <SectionTitle supratitlu="calorii" actiune={<Link to="/greutate" className="mic">detalii →</Link>}>
        Bugetul zilei
      </SectionTitle>
      <Sticker>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <StatTile valoare={buget.tdee} eticheta="consumi" sub="kcal/zi estimat" />
          <StatTile valoare={arseAzi > 0 ? `+${Math.round(arseAzi)}` : '0'} eticheta="arse la sală" sub="azi" />
          <StatTile valoare={buget.aportMaximAzi} eticheta="poți mânca" sub="kcal azi" accent />
        </div>
        <p className="mic estompat" style={{ margin: '10px 0 0' }}>
          {date.goal
            ? `Ținta: ${nr(date.goal.greutateTinta)} kg în ritm de ${nr(date.goal.ritmKgSaptamana)} kg/săpt. (deficit ${buget.deficit} kcal/zi).${
                saptamani ? ` Mai ai ~${saptamani} săptămâni.` : ' Obiectiv atins! 🎉'
              }`
            : 'Nu ai un obiectiv activ — setează unul din pagina Greutate.'}
        </p>
      </Sticker>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatTile valoare={`${nr(greutate)} kg`} eticheta="greutatea curentă" sub={ultima ? data(ultima.data) : ''} />
        <StatTile
          valoare={date.goal ? `${nr(Math.max(0, greutate - date.goal.greutateTinta))} kg` : '—'}
          eticheta="până la țintă"
          sub={date.goal ? `țintă ${nr(date.goal.greutateTinta)} kg` : ''}
        />
      </div>

      <SectionTitle supratitlu="Flexu zice">Sfatul zilei</SectionTitle>
      <FlexuSpune poza="explica">{sfatulZilei()}</FlexuSpune>

      <SectionTitle supratitlu="progres" actiune={<Link to="/statistici" className="mic">toate →</Link>}>
        Săptămâna asta
      </SectionTitle>
      <SaptamanaCurenta zile={trainingDays(date.toateSesiunile)} />
    </div>
  );
}

function SaptamanaCurenta(props: { zile: string[] }) {
  const azi = new Date();
  const luni = new Date(azi);
  luni.setDate(azi.getDate() - ((azi.getDay() + 6) % 7));
  const nume = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];
  const set = new Set(props.zile);
  const zile = nume.map((n, i) => {
    const d = new Date(luni);
    d.setDate(luni.getDate() + i);
    const cheie = d.toISOString().slice(0, 10);
    return { n, facut: set.has(cheie), azi: cheie === new Date().toISOString().slice(0, 10) };
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
      <ProgressBar procent={(facute / 3) * 100} eticheta={`${facute} din 3 antrenamente recomandate`} />
    </Sticker>
  );
}
