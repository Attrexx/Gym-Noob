import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { ACHIEVEMENTS } from '@/domain/achievements';
import { Sticker } from '@/design/components';
import { FlexuSpune } from '@/design/Flexu';

const CATEGORII: Record<string, string> = {
  inceput: 'Începuturi',
  consecventa: 'Consecvență',
  volum: 'Volum și calorii',
  greutate: 'Greutate corporală',
  hidratare: 'Hidratare',
  recorduri: 'Recorduri',
};

export function AchievementsPage() {
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
        <div className="supratitlu">colecția de medalii</div>
        <h1>Realizări</h1>
        <p className="mic estompat" style={{ margin: 0 }}>
          {nr} din {ACHIEVEMENTS.length} deblocate
        </p>
      </div>

      {nr === 0 && (
        <FlexuSpune poza="explica">
          Prima insignă te așteaptă la prima sesiune terminată. Nu e departe — hai la sală! 💪
        </FlexuSpune>
      )}

      {Object.entries(CATEGORII).map(([cat, nume]) => {
        const din = ACHIEVEMENTS.filter((a) => a.categorie === cat);
        if (!din.length) return null;
        return (
          <div key={cat}>
            <h2 style={{ marginTop: 20 }}>{nume}</h2>
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
                    <b style={{ fontSize: '0.9rem' }}>{a.nume}</b>
                    <div className="mic" style={{ opacity: 0.85 }}>
                      {a.descriere}
                    </div>
                    {cand && <div className="mic" style={{ marginTop: 4, fontWeight: 800 }}>{new Date(cand).toLocaleDateString('ro-RO')}</div>}
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
