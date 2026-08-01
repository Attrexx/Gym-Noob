import { useLiveQuery } from 'dexie-react-hooks';
import { BigButton } from '@/design/components';
import { setLogsForExercise } from '@/data/repo';
import type { TemplateItem } from '@/data/types';
import { descrieSetLog, setariDeReluat, ultimaPerformanta } from '@/domain/sesiuni';
import { greutatePentruReps } from '@/domain/oneRm';
import { epley1Rm } from '@/domain/oneRm';
import { useT } from '@/i18n';

/**
 * „Data trecută" — memoria pe care o ține aplicația în locul tău.
 *
 * Arată ce ai făcut ultima oară la exercițiul ăsta: pe ce aparat, cu ce
 * setări, cu ce cifre. Butonul reia setările direct în câmpuri, ca să nu
 * stai să-ți aduci aminte pe ce treaptă era banda sau câte kilograme aveai.
 *
 * Merge pentru orice exercițiu, nu doar pentru aparate — e același cod, iar
 * la fier e la fel de util.
 */
export function UltimaData(props: {
  profileId: number;
  exerciseId: string;
  sessionIdCurent?: number;
  onReia?: (setari: Partial<TemplateItem>) => void;
}) {
  const { t, fmt } = useT();
  const istoric = useLiveQuery(
    () => setLogsForExercise(props.profileId, props.exerciseId),
    [props.profileId, props.exerciseId],
  );

  const u = istoric ? ultimaPerformanta(istoric, props.sessionIdCurent) : null;
  if (!u || u.seturi.length === 0) return null;

  const zile = Math.round((Date.now() - Date.parse(u.data)) / 86_400_000);
  // „azi" îl spunem noi — Intl ar da doar „azi", pierzând nuanța „mai devreme"
  const cand = zile <= 0 ? t('timp.aziMaiDevreme') : fmt.relativZile(zile);

  // ținta de azi: cu cât mai mult decât data trecută, dacă are sens
  const celMaiBun = u.seturi.reduce<{ e: number; g: number; r: number } | null>((best, l) => {
    if (l.greutate === undefined || l.repetari === undefined) return best;
    const e = epley1Rm(l.greutate, l.repetari);
    return !best || e > best.e ? { e, g: l.greutate, r: l.repetari } : best;
  }, null);
  const tinta = celMaiBun ? greutatePentruReps(celMaiBun.e * 1.025, celMaiBun.r) : null;

  return (
    <div
      data-testid="ultima-data"
      style={{
        margin: '0 0 10px',
        padding: '8px 10px',
        border: '2px dashed var(--linie)',
        borderRadius: 10,
        background: 'var(--crem)',
        color: 'var(--negru)',
      }}
    >
      <div className="supratitlu-mic">data trecută · {cand}</div>
      {u.aparatModel && (
        <div className="mic" style={{ fontWeight: 800 }}>
          🔌 {u.aparatModel}
        </div>
      )}
      <div className="mic" style={{ marginTop: 2 }}>
        {u.seturi.map((l, i) => (
          <div key={i}>
            {i + 1}. {descrieSetLog(l)}
          </div>
        ))}
      </div>
      {tinta && tinta > (celMaiBun?.g ?? 0) && (
        <div className="mic" style={{ marginTop: 4, fontWeight: 800 }}>
          🎯 Dacă azi merge ușor: încearcă {String(tinta).replace('.', ',')} kg × {celMaiBun!.r}
        </div>
      )}
      {props.onReia && (
        <div style={{ marginTop: 8 }}>
          <BigButton varianta="contur" onClick={() => props.onReia!(setariDeReluat(u))}>
            ↩ Reia setările
          </BigButton>
        </div>
      )}
    </div>
  );
}
