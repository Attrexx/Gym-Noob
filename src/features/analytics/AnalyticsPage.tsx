import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { SectionTitle, StatTile, Sticker } from '@/design/components';
import { data, nr } from '@/i18n/format';
import { useT } from '@/i18n';
import { getExercise, numeGrupa } from '@/data/catalog/exercises';
import { epley1Rm } from '@/domain/oneRm';
import { weekKey } from '@/domain/achievements';
import { fmtOra, impartireTimp } from '@/domain/sesiuni';
import { fmtDurata } from '../session/useTick';

type Interval = 7 | 30 | 90 | 9999;

export function AnalyticsPage() {
  const { t } = useT();
  const { profil } = useProfile();
  const [interval, setInterval_] = useState<Interval>(30);
  const [exSelectat, setExSelectat] = useState('');

  const date = useLiveQuery(async () => {
    if (!profil?.id) return null;
    const pid = profil.id;
    const [sesiuni, seturi, metrici] = await Promise.all([
      db.sessions.where({ profileId: pid }).toArray(),
      db.setLogs.where({ profileId: pid }).toArray(),
      db.bodyMetrics.where('[profileId+data]').between([pid, ''], [pid, '￿']).toArray(),
    ]);
    return { sesiuni: sesiuni.filter((s) => s.status === 'terminata'), seturi, metrici };
  }, [profil?.id]);

  const prag = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - interval);
    return d.toISOString();
  }, [interval]);

  const filtrat = useMemo(() => {
    if (!date) return null;
    return {
      sesiuni: date.sesiuni.filter((s) => s.inceput >= prag),
      seturi: date.seturi.filter((s) => s.data >= prag),
      metrici: date.metrici.filter((m) => m.data >= prag),
    };
  }, [date, prag]);

  if (!date || !filtrat) return <div className="pagina" />;

  // ── agregate ──
  const kcalTotal = Math.round(filtrat.sesiuni.reduce((a, s) => a + (s.kcal ?? 0), 0));
  const volumTotal = Math.round(filtrat.seturi.reduce((a, l) => a + (l.greutate ?? 0) * (l.repetari ?? 0), 0));
  const apaTotal = filtrat.sesiuni.reduce((a, s) => a + (s.apaMl ?? 0), 0);

  // timpul petrecut la sală: total de pe ceasul de perete vs. timp de lucru
  const timpuri = filtrat.sesiuni.map((s) => impartireTimp(s));
  const timpActiv = timpuri.reduce((a, x) => a + x.activSec, 0);
  const timpLaSala = timpuri.reduce((a, x) => a + x.totalSec, 0);
  const timpPauza = timpLaSala - timpActiv;

  // greutate + medie mobilă 7 zile
  const greutateData = date.metrici.map((m, i, arr) => {
    const fereastra = arr.slice(Math.max(0, i - 6), i + 1);
    return {
      zi: m.data.slice(5, 10),
      kg: m.greutate,
      medie: Math.round((fereastra.reduce((a, x) => a + x.greutate, 0) / fereastra.length) * 10) / 10,
    };
  });

  // volum pe săptămână
  const volumSaptamani = new Map<string, number>();
  for (const l of date.seturi) {
    const k = weekKey(new Date(l.data));
    volumSaptamani.set(k, (volumSaptamani.get(k) ?? 0) + (l.greutate ?? 0) * (l.repetari ?? 0));
  }
  const volumData = [...volumSaptamani.entries()].sort().slice(-12).map(([sapt, v]) => ({ sapt: sapt.slice(5), volum: Math.round(v) }));

  // echilibru muscular (seturi per grupă în interval)
  const grupe = new Map<string, number>();
  for (const l of filtrat.seturi) {
    const ex = getExercise(l.exerciseId);
    if (!ex || ex.muschi[0] === 'cardio') continue;
    grupe.set(ex.muschi[0], (grupe.get(ex.muschi[0]) ?? 0) + 1);
  }
  const radarData = [...grupe.entries()].map(([g, n]) => ({ grupa: numeGrupa(g as never), seturi: n }));

  // kcal + durată pe sesiune
  const kcalData = filtrat.sesiuni.slice(-15).map((s) => ({
    zi: s.inceput.slice(5, 10),
    kcal: Math.round(s.kcal ?? 0),
    apa: s.apaMl ?? 0,
    minute: Math.round(impartireTimp(s).totalSec / 60),
  }));

  // ultimele sesiuni, cu ora de intrare și de ieșire
  const ultimeleSesiuni = [...filtrat.sesiuni]
    .sort((a, b) => b.inceput.localeCompare(a.inceput))
    .slice(0, 8)
    .map((s) => ({ s, timp: impartireTimp(s), seturi: filtrat.seturi.filter((l) => l.sessionId === s.id).length }));

  // progresie exercițiu selectat (1RM estimat pe sesiune)
  const exercitiiFolosite = [...new Set(date.seturi.map((l) => l.exerciseId))]
    .map((id) => getExercise(id))
    .filter(Boolean);
  const exId = exSelectat || exercitiiFolosite[0]?.id || '';
  const progresie = (() => {
    const byDay = new Map<string, number>();
    for (const l of date.seturi.filter((x) => x.exerciseId === exId)) {
      const rm = epley1Rm(l.greutate ?? 0, l.repetari ?? 0);
      const zi = l.data.slice(0, 10);
      byDay.set(zi, Math.max(byDay.get(zi) ?? 0, rm));
    }
    return [...byDay.entries()].sort().map(([zi, rm]) => ({ zi: zi.slice(5), rm }));
  })();

  // heatmap frecvență (ultimele 12 săptămâni)
  const zileAntrenament = new Set(date.sesiuni.map((s) => s.inceput.slice(0, 10)));

  const exportaCsv = () => {
    const rows = [
      'data,exercitiu,set,repetari,greutate_kg,durata_sec,rpe,kcal,viteza_kmh,inclinatie_pct,aparat,distanta_m,putere_w,cadenta',
      ...date.seturi.map((l) =>
        [
          l.data,
          l.exerciseId,
          l.setIndex,
          l.repetari ?? '',
          l.greutate ?? '',
          l.durataSec ?? '',
          l.rpe ?? '',
          l.kcal,
          l.viteza ?? '',
          l.inclinatie ?? '',
          // modelul aparatului poate conține virgule — îl punem între ghilimele
          l.aparatModel ? `"${l.aparatModel.replace(/"/g, '""')}"` : '',
          l.distantaM ?? '',
          l.putereMedieW ?? '',
          l.cadentaMedie ?? '',
        ].join(','),
      ),
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gym-noob-seturi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const tickStyle = { fontSize: 11, fill: 'var(--fg)' } as const;

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">{t('statistici.supratitlu')}</div>
        <h1>{t('statistici.titlu')}</h1>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {([7, 30, 90, 9999] as Interval[]).map((i) => (
          <button
            key={i}
            onClick={() => setInterval_(i)}
            style={{
              flex: 1,
              border: '2px solid var(--contur)',
              borderRadius: 8,
              padding: '8px 0',
              fontWeight: 800,
              background: interval === i ? 'var(--accent)' : 'var(--panou)',
              color: interval === i ? 'var(--accent-fg)' : 'var(--panou-fg)',
            }}
          >
            {i === 9999 ? t('statistici.tot') : t('statistici.zile', { n: i })}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatTile valoare={filtrat.sesiuni.length} eticheta={t('statistici.sesiuni')} />
        <StatTile
          valoare={fmtDurata(timpLaSala)}
          eticheta={t('statistici.timpLaSala')}
          sub={
            timpLaSala > 0
              ? t('statistici.lucrat', { procent: Math.round((timpActiv / timpLaSala) * 100) })
              : undefined
          }
        />
        <StatTile
          valoare={fmtDurata(timpActiv)}
          eticheta={t('statistici.timpActiv')}
          sub={t('statistici.pauze', { timp: fmtDurata(timpPauza) })}
        />
        <StatTile valoare={kcalTotal} eticheta={t('statistici.kcalArse')} accent />
        <StatTile
          valoare={`${(volumTotal / 1000).toFixed(1)} t`}
          eticheta={t('statistici.volum')}
          sub={`${volumTotal} kg`}
        />
        <StatTile valoare={filtrat.seturi.length} eticheta={t('statistici.seturi')} />
        <StatTile valoare={`${(apaTotal / 1000).toFixed(1)} l`} eticheta={t('statistici.apa')} />
      </div>

      {ultimeleSesiuni.length > 0 && (
        <>
          <SectionTitle supratitlu={t('statistici.jurnal.supratitlu')}>
            {t('statistici.jurnal.titlu')}
          </SectionTitle>
          <Sticker>
            {ultimeleSesiuni.map(({ s, timp, seturi }) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '7px 0',
                  borderBottom: '2px solid var(--linie)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <b>{data(s.inceput, 'ziLunaScurt')}</b>{' '}
                  <span className="mic estompat">
                    {fmtOra(s.inceput)} → {fmtOra(s.sfarsit)}
                  </span>
                  <div className="mic estompat">
                    {s.templateNume ?? t('statistici.sesiuneLibera')} · {t('comun.seturi', { n: seturi })}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <b>{fmtDurata(timp.totalSec)}</b>
                  <div className="mic estompat">
                    {t('statistici.activPauza', {
                      activ: fmtDurata(timp.activSec),
                      pauza: fmtDurata(timp.pauzaSec),
                    })}
                  </div>
                  <div className="mic estompat">{Math.round(s.kcal ?? 0)} kcal</div>
                </div>
              </div>
            ))}
          </Sticker>
        </>
      )}

      {greutateData.length > 1 && (
        <>
          <SectionTitle supratitlu={t('statistici.greutate.supratitlu')}>
            {t('statistici.greutate.titlu')}
          </SectionTitle>
          <Sticker>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={greutateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--linie)" />
                <XAxis dataKey="zi" tick={tickStyle} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={tickStyle} width={38} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="kg"
                  stroke="var(--estompat)"
                  dot={{ r: 2 }}
                  strokeWidth={1.5}
                  name={t('statistici.greutate.masurat')}
                />
                <Line
                  type="monotone"
                  dataKey="medie"
                  stroke="var(--rosu)"
                  strokeWidth={3}
                  dot={false}
                  name={t('statistici.greutate.medie')}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="mic estompat" style={{ margin: 0 }}>
              {t('statistici.greutate.nota')}
            </p>
          </Sticker>
        </>
      )}

      {volumData.length > 0 && (
        <>
          <SectionTitle supratitlu={t('statistici.volum.supratitlu')}>
            {t('statistici.volum.titlu')}
          </SectionTitle>
          <Sticker>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={volumData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--linie)" />
                <XAxis dataKey="sapt" tick={tickStyle} />
                <YAxis tick={tickStyle} width={44} />
                <Tooltip />
                <Bar dataKey="volum" fill="var(--rosu)" name={t('statistici.volum.serie')} />
              </BarChart>
            </ResponsiveContainer>
          </Sticker>
        </>
      )}

      {radarData.length >= 3 && (
        <>
          <SectionTitle supratitlu={t('statistici.echilibru.supratitlu')}>
            {t('statistici.echilibru.titlu')}
          </SectionTitle>
          <Sticker>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--linie)" />
                <PolarAngleAxis dataKey="grupa" tick={{ fontSize: 10, fill: 'var(--fg)' }} />
                <Radar dataKey="seturi" stroke="var(--rosu)" fill="var(--rosu)" fillOpacity={0.45} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <p className="mic estompat" style={{ margin: 0 }}>
              {t('statistici.echilibru.nota')}
            </p>
          </Sticker>
        </>
      )}

      {exercitiiFolosite.length > 0 && (
        <>
          <SectionTitle supratitlu={t('statistici.forta.supratitlu')}>
            {t('statistici.forta.titlu')}
          </SectionTitle>
          <Sticker>
            <select value={exId} onChange={(e) => setExSelectat(e.target.value)} style={{ marginBottom: 10 }}>
              {exercitiiFolosite.map((e) => (
                <option key={e!.id} value={e!.id}>
                  {e!.nume}
                </option>
              ))}
            </select>
            {progresie.length > 1 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={progresie}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--linie)" />
                  <XAxis dataKey="zi" tick={tickStyle} />
                  <YAxis tick={tickStyle} width={38} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rm"
                    stroke="var(--rosu)"
                    strokeWidth={3}
                    name={t('statistici.forta.serie')}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="mic estompat">{t('statistici.forta.gol')}</p>
            )}
          </Sticker>
        </>
      )}

      {kcalData.length > 0 && (
        <>
          <SectionTitle supratitlu={t('statistici.sesiune.supratitlu')}>
            {t('statistici.sesiune.titlu')}
          </SectionTitle>
          <Sticker>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={kcalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--linie)" />
                <XAxis dataKey="zi" tick={tickStyle} />
                <YAxis tick={tickStyle} width={38} />
                <Tooltip />
                <Bar dataKey="kcal" fill="var(--rosu)" name="kcal" />
                <Bar dataKey="apa" fill="#1565C0" name={t('statistici.sesiune.apa')} />
                <Bar dataKey="minute" fill="var(--verde)" name={t('statistici.sesiune.minute')} />
              </BarChart>
            </ResponsiveContainer>
          </Sticker>
        </>
      )}

      <SectionTitle supratitlu={t('statistici.calendar.supratitlu')}>
        {t('statistici.calendar.titlu')}
      </SectionTitle>
      <Sticker>
        <Heatmap zile={zileAntrenament} />
      </Sticker>

      <SectionTitle supratitlu={t('statistici.export.supratitlu')}>{t('statistici.export.titlu')}</SectionTitle>
      <Sticker>
        <p className="mic">{t('statistici.export.explicatie')}</p>
        <button
          onClick={exportaCsv}
          style={{ border: '3px solid var(--contur)', borderRadius: 10, padding: '10px 16px', fontWeight: 800, background: 'var(--panou)', color: 'var(--panou-fg)' }}
        >
          {t('statistici.export.buton', { ce: t('comun.seturi', { n: date.seturi.length }) })}
        </button>
      </Sticker>
      <p className="mic estompat">
        {t('statistici.total', {
          sesiuni: t('comun.sesiuni', { n: date.sesiuni.length }),
          tone: nr(
            Math.round(date.seturi.reduce((a, l) => a + (l.greutate ?? 0) * (l.repetari ?? 0), 0) / 1000),
          ),
        })}
      </p>
    </div>
  );
}

/** Ultimele 12 săptămâni, stil GitHub. */
function Heatmap(props: { zile: Set<string> }) {
  const azi = new Date();
  const celule: { cheie: string; facut: boolean }[][] = [];
  const start = new Date(azi);
  start.setDate(azi.getDate() - ((azi.getDay() + 6) % 7) - 77); // luni, acum 12 săptămâni
  for (let w = 0; w < 12; w++) {
    const col: { cheie: string; facut: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const zi = new Date(start);
      zi.setDate(start.getDate() + w * 7 + d);
      const cheie = zi.toISOString().slice(0, 10);
      col.push({ cheie, facut: props.zile.has(cheie) });
    }
    celule.push(col);
  }
  return (
    <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
      {celule.map((col, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {col.map((c) => (
            <div
              key={c.cheie}
              title={c.cheie}
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                border: '1.5px solid var(--contur)',
                background: c.facut ? 'var(--rosu)' : 'var(--panou)',
                opacity: c.cheie > new Date().toISOString().slice(0, 10) ? 0.2 : 1,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
