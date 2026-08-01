import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { BigButton, Modal, SectionTitle, StatTile, Sticker } from '@/design/components';
import { data, nr } from '@/i18n/format';
import { FlexuSpune } from '@/design/Flexu';
import { addBodyMetric, setGoal } from '@/data/repo';
import { bmi, bmiCategorie, clampRitm, saptamaniPanaLaTinta } from '@/domain/goals';
import { bodyFatNavy } from '@/domain/bodyFat';
import { FreefitImport } from '../settings/FreefitImport';

export function WeightPage() {
  const { profil } = useProfile();
  const [adaug, setAdaug] = useState(false);
  const [editGoal, setEditGoal] = useState(false);
  const [importFreefit, setImportFreefit] = useState(false);

  const date = useLiveQuery(async () => {
    if (!profil?.id) return null;
    const pid = profil.id;
    const [metrici, goal] = await Promise.all([
      db.bodyMetrics.where('[profileId+data]').between([pid, ''], [pid, '￿']).toArray(),
      db.goals.where({ profileId: pid }).filter((g) => g.activ).first(),
    ]);
    return { metrici, goal };
  }, [profil?.id]);

  if (!profil || !date) return <div className="pagina" />;

  const ultima = date.metrici[date.metrici.length - 1];
  const prima = date.metrici[0];
  const kg = ultima?.greutate ?? 0;
  const maxKg = date.metrici.length ? Math.max(...date.metrici.map((m) => m.greutate)) : 0;
  const imc = bmi(kg, profil.inaltime);
  const grasime = ultima ? bodyFatNavy(profil.sex, profil.inaltime, ultima.talie, ultima.gat, ultima.sold) : null;
  const saptamani = date.goal ? saptamaniPanaLaTinta(kg, date.goal.greutateTinta, date.goal.ritmKgSaptamana) : null;

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">cântarul, îmblânzit</div>
        <h1>Greutate & obiectiv</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatTile valoare={`${nr(kg)} kg`} eticheta="acum" sub={ultima ? data(ultima.data) : '—'} accent />
        <StatTile valoare={`${nr(Math.max(0, maxKg - kg))} kg`} eticheta="slăbite" sub={`de la maximul de ${nr(maxKg)} kg`} />
        <StatTile valoare={nr(imc)} eticheta="IMC" sub={bmiCategorie(imc)} />
        <StatTile valoare={grasime !== null ? `${nr(grasime)}%` : '—'} eticheta="grăsime est." sub={grasime === null ? 'adaugă măsurători' : 'formula US Navy'} />
      </div>

      <BigButton varianta="accent" mare onClick={() => setAdaug(true)}>
        + Cântărire nouă
      </BigButton>

      <SectionTitle supratitlu="ținta">Obiectivul activ</SectionTitle>
      {date.goal ? (
        <Sticker>
          <p style={{ margin: 0 }}>
            🎯 <b>{nr(date.goal.greutateTinta)} kg</b> în ritm de <b>{nr(date.goal.ritmKgSaptamana)} kg/săpt.</b>
            {saptamani !== null ? (
              <>
                {' '}
                — încă <b>{nr(Math.max(0, kg - date.goal.greutateTinta))} kg</b>, aproximativ{' '}
                <b>{saptamani} săptămâni</b>.
              </>
            ) : (
              <> — obiectiv atins! 🎉 Setează unul nou.</>
            )}
          </p>
          <div style={{ marginTop: 10 }}>
            <BigButton onClick={() => setEditGoal(true)}>Schimbă obiectivul</BigButton>
          </div>
        </Sticker>
      ) : (
        <Sticker>
          <p>Niciun obiectiv activ.</p>
          <BigButton varianta="accent" onClick={() => setEditGoal(true)}>
            Setează un obiectiv
          </BigButton>
        </Sticker>
      )}

      {prima && ultima && prima !== ultima && (
        <FlexuSpune poza={maxKg - kg >= 1 ? 'sarbatoreste' : 'explica'}>
          {maxKg - kg >= 1 ? (
            <>
              De la <b>{nr(maxKg)} kg</b> la <b>{nr(kg)} kg</b> — se mișcă treaba! Ține ritmul, nu
              graba.
            </>
          ) : (
            <>Cântărește-te la aceeași oră (ideal dimineața) și urmărește media pe 7 zile din Statistici, nu fiecare zi în parte.</>
          )}
        </FlexuSpune>
      )}

      <SectionTitle supratitlu="istoric">Cântăriri</SectionTitle>
      {[...date.metrici].reverse().slice(0, 30).map((m) => (
        <Sticker key={m.id} style={{ padding: '8px 12px', marginBottom: 8 }}>
          <div className="rand" style={{ justifyContent: 'space-between' }}>
            <b>{nr(m.greutate)} kg</b>
            <span className="mic estompat">
              {data(m.data)} · {m.sursa === 'freefit' ? 'import Freefit' : 'manual'}
            </span>
          </div>
        </Sticker>
      ))}

      <SectionTitle supratitlu="date externe">Import din Freefit</SectionTitle>
      <Sticker>
        <p className="mic">
          Folosești un cântar Bluetooth cu aplicația Freefit? Istoricul de greutate poate fi adus aici dintr-un
          fișier CSV exportat.
        </p>
        <BigButton onClick={() => setImportFreefit(true)}>📥 Importă istoric</BigButton>
      </Sticker>

      {adaug && <AdaugaCantarire onInchide={() => setAdaug(false)} />}
      {editGoal && <EditeazaObiectiv onInchide={() => setEditGoal(false)} kgCurent={kg} goal={date.goal} />}
      <Modal deschis={importFreefit} onInchide={() => setImportFreefit(false)} titlu="Import Freefit">
        <FreefitImport onGata={() => setImportFreefit(false)} />
      </Modal>
    </div>
  );
}

function AdaugaCantarire(props: { onInchide: () => void }) {
  const { profil } = useProfile();
  const [kg, setKg] = useState('');
  const [talie, setTalie] = useState('');
  const [gat, setGat] = useState('');
  const [sold, setSold] = useState('');

  const salveaza = async () => {
    const v = parseFloat(kg.replace(',', '.'));
    if (!profil?.id || !Number.isFinite(v) || v < 25 || v > 350) return;
    await addBodyMetric({
      profileId: profil.id,
      data: new Date().toISOString(),
      greutate: Math.round(v * 10) / 10,
      talie: talie ? Number(talie) : undefined,
      gat: gat ? Number(gat) : undefined,
      sold: sold ? Number(sold) : undefined,
      sursa: 'manual',
    });
    props.onInchide();
  };

  return (
    <Modal deschis onInchide={props.onInchide} titlu="Cântărire nouă">
      <label htmlFor="w-kg">Greutate (kg)</label>
      <input id="w-kg" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="ex. 92,4" autoFocus />
      <div className="rand">
        <div>
          <label htmlFor="w-talie">Talie (cm)</label>
          <input id="w-talie" inputMode="numeric" value={talie} onChange={(e) => setTalie(e.target.value)} placeholder="opț." />
        </div>
        <div>
          <label htmlFor="w-gat">Gât (cm)</label>
          <input id="w-gat" inputMode="numeric" value={gat} onChange={(e) => setGat(e.target.value)} placeholder="opț." />
        </div>
        {profil?.sex === 'F' && (
          <div>
            <label htmlFor="w-sold">Șold (cm)</label>
            <input id="w-sold" inputMode="numeric" value={sold} onChange={(e) => setSold(e.target.value)} placeholder="opț." />
          </div>
        )}
      </div>
      <div style={{ marginTop: 14 }}>
        <BigButton varianta="accent" mare onClick={() => void salveaza()}>
          Salvează
        </BigButton>
      </div>
    </Modal>
  );
}

function EditeazaObiectiv(props: { onInchide: () => void; kgCurent: number; goal?: { greutateTinta: number; ritmKgSaptamana: number } }) {
  const { profil } = useProfile();
  const [tinta, setTinta] = useState(props.goal?.greutateTinta ?? Math.round(props.kgCurent * 0.9));
  const [ritm, setRitm] = useState(props.goal?.ritmKgSaptamana ?? 0.5);
  const saptamani = saptamaniPanaLaTinta(props.kgCurent, tinta, ritm);

  const salveaza = async () => {
    if (!profil?.id) return;
    await setGoal(profil.id, tinta, clampRitm(ritm));
    props.onInchide();
  };

  return (
    <Modal deschis onInchide={props.onInchide} titlu="Obiectivul de greutate">
      <label htmlFor="g-tinta">Greutatea țintă (kg)</label>
      <input id="g-tinta" type="number" step={0.5} min={40} max={250} value={tinta} onChange={(e) => setTinta(Number(e.target.value))} />
      <label htmlFor="g-ritm">Ritm: {nr(ritm)} kg / săptămână</label>
      <input id="g-ritm" type="range" min={0.25} max={1} step={0.25} value={ritm} onChange={(e) => setRitm(Number(e.target.value))} />
      {saptamani !== null && (
        <p className="mic" style={{ marginTop: 8 }}>
          Estimare: ~{saptamani} săptămâni până la țintă.
        </p>
      )}
      <BigButton varianta="accent" mare onClick={() => void salveaza()}>
        Salvează obiectivul
      </BigButton>
    </Modal>
  );
}
