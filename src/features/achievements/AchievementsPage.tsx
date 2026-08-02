import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { ACHIEVEMENTS } from '@/domain/achievements';
import { Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';
import { data } from '@/i18n/format';
import { descriereRealizare, numeRealizare } from '@/i18n/descrieri';
import { useT } from '@/i18n';

/** Categoriile, în ordinea în care se afișează; textul vine din mesaje. */
const CATEGORII = [
  ['inceput', 'realizari.cat.inceput'],
  ['consecventa', 'realizari.cat.consecventa'],
  ['volum', 'realizari.cat.volum'],
  ['greutate', 'realizari.cat.greutate'],
  ['hidratare', 'realizari.cat.hidratare'],
  ['recorduri', 'realizari.cat.recorduri'],
] as const;

export function AchievementsPage() {
  const { t } = useT(); // abonament la limbă — numele insignelor vin din mesaje
  const { profil } = useProfile();
  const deblocate = useLiveQuery(async () => {
    if (!profil?.id) return new Map<string, string>();
    const rows = await db.achievements.where({ profileId: profil.id }).toArray();
    return new Map(rows.map((r) => [r.achievementId, r.data]));
  }, [profil?.id]);

  if (!deblocate) return <div className="pagina" />;
  const nr = deblocate.size;

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">{t('realizari.supratitlu')}</div>
        <h1>{t('realizari.titlu')}</h1>
        <p className="mic estompat" style={{ margin: 0 }}>
          {t('realizari.progres', { nr, total: ACHIEVEMENTS.length })}
        </p>
      </div>

      {nr === 0 && <FlexuSpune poza="explica">{t('realizari.gol')}</FlexuSpune>}

      {CATEGORII.map(([cat, cheieNume]) => {
        const din = ACHIEVEMENTS.filter((a) => a.categorie === cat);
        if (!din.length) return null;
        return (
          <div key={cat}>
            <h2 style={{ marginTop: 20 }}>{t(cheieNume)}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {din.map((a) => {
                const cand = deblocate.get(a.id);
                return (
                  <Sticker
                    key={a.id}
                    style={{
                      margin: 0,
                      opacity: cand ? 1 : 0.45,
                      filter: cand ? 'none' : 'grayscale(0.9)',
                      textAlign: 'center',
                    }}
                    accent={!!cand}
                  >
                    <div style={{ fontSize: '1.9rem' }}>{cand ? a.emoji : '🔒'}</div>
                    <b style={{ fontSize: '0.9rem' }}>{numeRealizare(a.id)}</b>
                    <div className="mic" style={{ opacity: 0.85 }}>
                      {descriereRealizare(a.id)}
                    </div>
                    {cand && <div className="mic" style={{ marginTop: 4, fontWeight: 800 }}>{data(cand)}</div>}
                  </Sticker>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
