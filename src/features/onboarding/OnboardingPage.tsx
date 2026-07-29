import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BigButton, ProgressBar, Sticker, StatTile, formatNr } from '@/design/components';
import { Flexu, FlexuSpune } from '@/design/Flexu';
import type { ActivityLevel, Sex } from '@/data/types';
import {
  ACTIVITY_LABEL,
  bmi,
  bmiCategorie,
  bmr,
  bugetZilnic,
  clampRitm,
  saptamaniPanaLaTinta,
  tdee,
  tintaApaSesiune,
  varstaDinData,
} from '@/domain/goals';
import { bodyFatNavy } from '@/domain/bodyFat';
import { createProfile, setGoal } from '@/data/repo';
import { db } from '@/data/db';
import { starterTemplates } from '@/data/catalog/starterTemplates';
import { useProfile } from '@/state/profileStore';

const PASI = 5;

export function OnboardingPage() {
  const nav = useNavigate();
  const { incarca } = useProfile();
  const [pas, setPas] = useState(0);

  const [nume, setNume] = useState('');
  const [sex, setSex] = useState<Sex>('M');
  const [dataNasterii, setDataNasterii] = useState('1990-01-01');
  const [inaltime, setInaltime] = useState(175);
  const [greutate, setGreutate] = useState(90);
  const [talie, setTalie] = useState<number | ''>('');
  const [gat, setGat] = useState<number | ''>('');
  const [sold, setSold] = useState<number | ''>('');
  const [activitate, setActivitate] = useState<ActivityLevel>('usor');
  const [tinta, setTinta] = useState(80);
  const [ritm, setRitm] = useState(0.5);
  const [salvez, setSalvez] = useState(false);

  const varsta = varstaDinData(dataNasterii);
  const calcule = useMemo(() => {
    const b = bmr(sex, greutate, inaltime, varsta);
    const t = tdee(b, activitate);
    const buget = bugetZilnic({ sex, greutate, inaltime, varsta, activitate, ritmKgSaptamana: ritm, arseAntrenament: 0 });
    const grasime = bodyFatNavy(sex, inaltime, talie || undefined, gat || undefined, sold || undefined);
    const saptamani = saptamaniPanaLaTinta(greutate, tinta, ritm);
    return { b, t, buget, grasime, saptamani, imc: bmi(greutate, inaltime) };
  }, [sex, greutate, inaltime, varsta, activitate, ritm, tinta, talie, gat, sold]);

  const finalizeaza = async () => {
    if (salvez) return;
    setSalvez(true);
    const profileId = await createProfile(
      {
        nume: nume.trim() || 'Noob',
        sex,
        dataNasterii,
        inaltime,
        activitate,
        tintaApaSesiune: tintaApaSesiune(greutate),
      },
      greutate,
      { talie: talie || undefined, gat: gat || undefined, sold: sold || undefined },
    );
    await setGoal(profileId, tinta, clampRitm(ritm));
    await db.templates.bulkAdd(starterTemplates(profileId) as never[]);
    await incarca(profileId);
    nav('/');
  };

  return (
    <div className="pagina" style={{ paddingBottom: 24 }}>
      {pas > 0 && (
        <div style={{ marginBottom: 14 }}>
          <ProgressBar procent={(pas / (PASI - 1)) * 100} eticheta={`Pasul ${pas} din ${PASI - 1}`} />
        </div>
      )}

      {pas === 0 && (
        <div className="centrat pop">
          <div className="coperta" style={{ padding: '26px 18px', marginTop: 24 }}>
            <div className="supratitlu">Ghidul complet al începătorului absolut</div>
            <h1 style={{ fontSize: '2.6rem', margin: '6px 0' }}>
              GYM
              <br />
              pentru NOOBI
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <Flexu poza="flex" marime={150} />
            </div>
            <p className="estompat mic">
              Antrenamente, jurnal de greutăți, calorii și încurajări — totul în română, totul pe telefonul tău,
              nimic trimis pe internet.
            </p>
          </div>
          <FlexuSpune poza="salut">
            <b>Salut! Eu sunt Flexu</b> — am fost cel mai noob noob din sală, așa că știu exact prin ce treci.
            Hai să te cunosc în 2 minute și îți pregătesc totul.
          </FlexuSpune>
          <BigButton varianta="accent" mare onClick={() => setPas(1)}>
            Să începem! 💪
          </BigButton>
          <p className="mic estompat" style={{ marginTop: 12 }}>
            Ai mai folosit aplicația pe alt profil?{' '}
            <a href="#/profiluri" style={{ fontWeight: 700 }}>
              Alege profilul
            </a>
          </p>
        </div>
      )}

      {pas === 1 && (
        <div className="pop">
          <h1>Cine ești?</h1>
          <FlexuSpune poza="explica">Datele astea rămân doar pe telefonul tău — le folosesc pentru calorii și recomandări.</FlexuSpune>
          <Sticker>
            <label htmlFor="ob-nume">Cum îți spunem?</label>
            <input id="ob-nume" value={nume} onChange={(e) => setNume(e.target.value)} placeholder="Numele tău" />
            <label>Sex (pentru formulele de calorii)</label>
            <div className="rand">
              <BigButton varianta={sex === 'M' ? 'accent' : 'contur'} onClick={() => setSex('M')}>
                Masculin
              </BigButton>
              <BigButton varianta={sex === 'F' ? 'accent' : 'contur'} onClick={() => setSex('F')}>
                Feminin
              </BigButton>
            </div>
            <label htmlFor="ob-data">Data nașterii</label>
            <input id="ob-data" type="date" value={dataNasterii} onChange={(e) => setDataNasterii(e.target.value)} />
            <label htmlFor="ob-inaltime">Înălțime (cm)</label>
            <input
              id="ob-inaltime"
              type="number"
              min={120}
              max={230}
              value={inaltime}
              onChange={(e) => setInaltime(Number(e.target.value))}
            />
          </Sticker>
          <div className="rand">
            <BigButton onClick={() => setPas(0)}>Înapoi</BigButton>
            <BigButton varianta="accent" onClick={() => setPas(2)} disabled={!inaltime || !dataNasterii}>
              Mai departe
            </BigButton>
          </div>
        </div>
      )}

      {pas === 2 && (
        <div className="pop">
          <h1>Corpul de start</h1>
          <FlexuSpune poza="explica">
            Măsurătorile cu banda (opționale) îmi permit să estimez procentul de grăsime — un indicator mult mai
            util decât cântarul singur.
          </FlexuSpune>
          <Sticker>
            <label htmlFor="ob-greutate">Greutatea actuală (kg)</label>
            <input
              id="ob-greutate"
              type="number"
              min={30}
              max={300}
              step={0.1}
              value={greutate}
              onChange={(e) => setGreutate(Number(e.target.value))}
            />
            <label htmlFor="ob-activitate">Cât de activ ești în afara sălii?</label>
            <select id="ob-activitate" value={activitate} onChange={(e) => setActivitate(e.target.value as ActivityLevel)}>
              {Object.entries(ACTIVITY_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <div className="rand" style={{ marginTop: 8 }}>
              <div>
                <label htmlFor="ob-talie">Talie (cm)</label>
                <input id="ob-talie" type="number" placeholder="opțional" value={talie} onChange={(e) => setTalie(e.target.value ? Number(e.target.value) : '')} />
              </div>
              <div>
                <label htmlFor="ob-gat">Gât (cm)</label>
                <input id="ob-gat" type="number" placeholder="opțional" value={gat} onChange={(e) => setGat(e.target.value ? Number(e.target.value) : '')} />
              </div>
              {sex === 'F' && (
                <div>
                  <label htmlFor="ob-sold">Șold (cm)</label>
                  <input id="ob-sold" type="number" placeholder="opțional" value={sold} onChange={(e) => setSold(e.target.value ? Number(e.target.value) : '')} />
                </div>
              )}
            </div>
            {calcule.grasime !== null && (
              <p className="mic" style={{ marginTop: 8 }}>
                Grăsime corporală estimată (formula US Navy): <b>{formatNr(calcule.grasime)}%</b>
              </p>
            )}
          </Sticker>
          <div className="rand">
            <BigButton onClick={() => setPas(1)}>Înapoi</BigButton>
            <BigButton varianta="accent" onClick={() => setPas(3)} disabled={!greutate}>
              Mai departe
            </BigButton>
          </div>
        </div>
      )}

      {pas === 3 && (
        <div className="pop">
          <h1>Obiectivul</h1>
          <FlexuSpune poza="ganditor">
            Recomand un ritm de <b>0,5 kg pe săptămână</b> — suficient de rapid să se vadă, suficient de blând să
            păstrezi mușchii și să nu suferi de foame.
          </FlexuSpune>
          <Sticker>
            <label htmlFor="ob-tinta">Greutatea țintă (kg)</label>
            <input id="ob-tinta" type="number" min={40} max={250} step={0.5} value={tinta} onChange={(e) => setTinta(Number(e.target.value))} />
            <label htmlFor="ob-ritm">Ritm de slăbire: {formatNr(ritm)} kg / săptămână</label>
            <input id="ob-ritm" type="range" min={0.25} max={1} step={0.25} value={ritm} onChange={(e) => setRitm(Number(e.target.value))} />
            <div className="rand mic estompat" style={{ justifyContent: 'space-between' }}>
              <span>relaxat</span>
              <span style={{ textAlign: 'right' }}>hotărât</span>
            </div>
            {calcule.saptamani !== null ? (
              <p style={{ marginTop: 10 }}>
                🗓️ La ritmul ales, ajungi la <b>{formatNr(tinta)} kg</b> în aproximativ <b>{calcule.saptamani} săptămâni</b>{' '}
                ({dataEta(calcule.saptamani)}).
              </p>
            ) : (
              <p style={{ marginTop: 10 }}>Ținta e egală sau peste greutatea actuală — setează o țintă mai mică pentru slăbit.</p>
            )}
          </Sticker>
          <div className="rand">
            <BigButton onClick={() => setPas(2)}>Înapoi</BigButton>
            <BigButton varianta="accent" onClick={() => setPas(4)}>
              Mai departe
            </BigButton>
          </div>
        </div>
      )}

      {pas === 4 && (
        <div className="pop">
          <h1>Planul tău</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <StatTile valoare={formatNr(calcule.imc)} eticheta="IMC" sub={bmiCategorie(calcule.imc)} />
            <StatTile valoare={`${calcule.b}`} eticheta="BMR (kcal)" sub="arse doar existând" />
            <StatTile valoare={`${calcule.t}`} eticheta="TDEE (kcal)" sub="consum zilnic total" />
            <StatTile valoare={`${calcule.buget.aportMaximBaza}`} eticheta="Buget zilnic" sub="kcal, în zi fără sală" accent />
          </div>
          <FlexuSpune poza="sarbatoreste">
            <b>{nume.trim() || 'Noob'}, planul e gata!</b> Ți-am pregătit și 4 antrenamente de start, croite pentru
            început de drum. În zilele cu sală, bugetul de calorii crește automat cu ce arzi. Ne vedem la aparate!
          </FlexuSpune>
          <BigButton varianta="accent" mare onClick={() => void finalizeaza()} disabled={salvez}>
            {salvez ? 'Pregătesc totul…' : 'Creează profilul 🚀'}
          </BigButton>
          <div style={{ marginTop: 10 }}>
            <BigButton onClick={() => setPas(3)}>Înapoi</BigButton>
          </div>
        </div>
      )}
    </div>
  );
}

function dataEta(saptamani: number): string {
  const d = new Date();
  d.setDate(d.getDate() + saptamani * 7);
  return d.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
}
