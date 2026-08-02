import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BigButton, ProgressBar, Sticker, StatTile } from '@/design/components';
import { data, nr } from '@/i18n/format';
import { T, useT } from '@/i18n';
import { FlexuBula, FlexuSpune } from '@/design/Flexu';
import { Sigla } from '@/design/Sigla';
import type { ActivityLevel, Sex } from '@/data/types';
import {
  NIVELURI,
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
import { addStarterTemplates, createProfile, setGoal } from '@/data/repo';
import { useProfile } from '@/state/profileStore';
import { LoginCont } from './LoginCont';

const PASI = 5;

export function OnboardingPage() {
  const nav = useNavigate();
  const { t } = useT();
  const { incarca } = useProfile();
  const [pas, setPas] = useState(0);
  const [arataLogin, setArataLogin] = useState(false);

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
        nume: nume.trim() || t('onboarding.noob'),
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
    await addStarterTemplates(profileId);
    await incarca(profileId);
    nav('/');
  };

  if (arataLogin) {
    return (
      <div className="pagina" style={{ paddingBottom: 24 }}>
        <LoginCont onInapoi={() => setArataLogin(false)} />
      </div>
    );
  }

  return (
    <div className="pagina" style={{ paddingBottom: 24 }}>
      {pas > 0 && (
        <div style={{ marginBottom: 14 }}>
          <ProgressBar
            procent={(pas / (PASI - 1)) * 100}
            eticheta={t('onboarding.pasul', { pas, total: PASI - 1 })}
          />
        </div>
      )}

      {pas === 0 && (
        <div className="centrat pop">
          <div className="coperta" style={{ padding: '26px 18px', marginTop: 24 }}>
            <div className="supratitlu">{t('onboarding.intro.supratitlu')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 14px' }}>
              <Sigla latime={340} />
            </div>
            <p className="estompat mic">
              <T k="onboarding.intro.text" />
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 16px' }}>
            <FlexuBula text={t('onboarding.intro.bula')} latime={360} />
          </div>
          <BigButton varianta="accent" mare onClick={() => setPas(1)}>
            {t('onboarding.intro.start')}
          </BigButton>
          <p className="mic estompat" style={{ marginTop: 12 }}>
            <T
              k="onboarding.intro.altProfil"
              c={[<a key="a" href="#/profiluri" style={{ fontWeight: 700 }} />]}
            />
          </p>
          <p className="mic estompat" style={{ marginTop: 4 }}>
            <T
              k="onboarding.intro.amCont"
              c={[
                <button
                  key="b"
                  onClick={() => setArataLogin(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'inherit',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    font: 'inherit',
                  }}
                />,
              ]}
            />
          </p>
        </div>
      )}

      {pas === 1 && (
        <div className="pop">
          <div className="coperta">
            <div className="supratitlu">{t('onboarding.pas1.supratitlu')}</div>
            <h1 style={{ fontSize: '1.6rem', margin: 0 }}>{t('onboarding.pas1.titlu')}</h1>
          </div>
          <FlexuSpune poza="explica">{t('onboarding.pas1.flexu')}</FlexuSpune>
          <Sticker>
            <label htmlFor="ob-nume">{t('onboarding.pas1.nume')}</label>
            <input
              id="ob-nume"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              placeholder={t('onboarding.pas1.numePlaceholder')}
            />
            <label>{t('onboarding.pas1.sex')}</label>
            <div className="rand">
              <BigButton varianta={sex === 'M' ? 'accent' : 'contur'} onClick={() => setSex('M')}>
                {t('onboarding.pas1.masculin')}
              </BigButton>
              <BigButton varianta={sex === 'F' ? 'accent' : 'contur'} onClick={() => setSex('F')}>
                {t('onboarding.pas1.feminin')}
              </BigButton>
            </div>
            <label htmlFor="ob-data">{t('onboarding.pas1.dataNasterii')}</label>
            <input id="ob-data" type="date" value={dataNasterii} onChange={(e) => setDataNasterii(e.target.value)} />
            <label htmlFor="ob-inaltime">{t('comun.inaltime')}</label>
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
            <BigButton onClick={() => setPas(0)}>{t('comun.inapoi')}</BigButton>
            <BigButton varianta="accent" onClick={() => setPas(2)} disabled={!inaltime || !dataNasterii}>
              {t('comun.maiDeparte')}
            </BigButton>
          </div>
        </div>
      )}

      {pas === 2 && (
        <div className="pop">
          <div className="coperta">
            <div className="supratitlu">{t('onboarding.pas2.supratitlu')}</div>
            <h1 style={{ fontSize: '1.6rem', margin: 0 }}>{t('onboarding.pas2.titlu')}</h1>
          </div>
          <FlexuSpune poza="explica">{t('onboarding.pas2.flexu')}</FlexuSpune>
          <Sticker>
            <label htmlFor="ob-greutate">{t('onboarding.pas2.greutate')}</label>
            <input
              id="ob-greutate"
              type="number"
              min={30}
              max={300}
              step={0.1}
              value={greutate}
              onChange={(e) => setGreutate(Number(e.target.value))}
            />
            <label htmlFor="ob-activitate">{t('onboarding.pas2.activitate')}</label>
            <select id="ob-activitate" value={activitate} onChange={(e) => setActivitate(e.target.value as ActivityLevel)}>
              {NIVELURI.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {t(`domeniu.activitate.${nivel}`)}
                </option>
              ))}
            </select>
            <div className="rand" style={{ marginTop: 8 }}>
              <div>
                <label htmlFor="ob-talie">{t('comun.talie')}</label>
                <input
                  id="ob-talie"
                  type="number"
                  placeholder={t('comun.optional')}
                  value={talie}
                  onChange={(e) => setTalie(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
              <div>
                <label htmlFor="ob-gat">{t('comun.gat')}</label>
                <input
                  id="ob-gat"
                  type="number"
                  placeholder={t('comun.optional')}
                  value={gat}
                  onChange={(e) => setGat(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
              {sex === 'F' && (
                <div>
                  <label htmlFor="ob-sold">{t('comun.sold')}</label>
                  <input
                    id="ob-sold"
                    type="number"
                    placeholder={t('comun.optional')}
                    value={sold}
                    onChange={(e) => setSold(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
              )}
            </div>
            {calcule.grasime !== null && (
              <p className="mic" style={{ marginTop: 8 }}>
                <T k="onboarding.pas2.grasime" p={{ procent: calcule.grasime }} />
              </p>
            )}
          </Sticker>
          <div className="rand">
            <BigButton onClick={() => setPas(1)}>{t('comun.inapoi')}</BigButton>
            <BigButton varianta="accent" onClick={() => setPas(3)} disabled={!greutate}>
              {t('comun.maiDeparte')}
            </BigButton>
          </div>
        </div>
      )}

      {pas === 3 && (
        <div className="pop">
          <div className="coperta">
            <div className="supratitlu">{t('onboarding.pas3.supratitlu')}</div>
            <h1 style={{ fontSize: '1.6rem', margin: 0 }}>{t('onboarding.pas3.titlu')}</h1>
          </div>
          <FlexuSpune poza="ganditor">
            <T k="onboarding.pas3.flexu" />
          </FlexuSpune>
          <Sticker>
            <label htmlFor="ob-tinta">{t('comun.greutateTinta')}</label>
            <input id="ob-tinta" type="number" min={40} max={250} step={0.5} value={tinta} onChange={(e) => setTinta(Number(e.target.value))} />
            <label htmlFor="ob-ritm">{t('onboarding.pas3.ritm', { ritm })}</label>
            <input id="ob-ritm" type="range" min={0.25} max={1} step={0.25} value={ritm} onChange={(e) => setRitm(Number(e.target.value))} />
            <div className="rand mic estompat" style={{ justifyContent: 'space-between' }}>
              <span>{t('onboarding.pas3.relaxat')}</span>
              <span style={{ textAlign: 'right' }}>{t('onboarding.pas3.hotarat')}</span>
            </div>
            {calcule.saptamani !== null ? (
              <p style={{ marginTop: 10 }}>
                <T
                  k="onboarding.pas3.eta"
                  p={{
                    tinta,
                    saptamani: t('comun.saptamani', { n: calcule.saptamani }),
                    cand: dataEta(calcule.saptamani),
                  }}
                  c={[<b key="b0" />, <b key="b1" />]}
                />
              </p>
            ) : (
              <p style={{ marginTop: 10 }}>{t('onboarding.pas3.tintaPreaMare')}</p>
            )}
          </Sticker>
          <div className="rand">
            <BigButton onClick={() => setPas(2)}>{t('comun.inapoi')}</BigButton>
            <BigButton varianta="accent" onClick={() => setPas(4)}>
              {t('comun.maiDeparte')}
            </BigButton>
          </div>
        </div>
      )}

      {pas === 4 && (
        <div className="pop">
          <div className="coperta">
            <div className="supratitlu">{t('onboarding.pas4.supratitlu')}</div>
            <h1 style={{ fontSize: '1.6rem', margin: 0 }}>{t('onboarding.pas4.titlu')}</h1>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <StatTile
              valoare={nr(calcule.imc)}
              eticheta={t('onboarding.pas4.imc')}
              sub={t(`domeniu.imc.${bmiCategorie(calcule.imc)}`)}
            />
            <StatTile
              valoare={`${calcule.b}`}
              eticheta={t('onboarding.pas4.bmr')}
              sub={t('onboarding.pas4.bmrSub')}
            />
            <StatTile
              valoare={`${calcule.t}`}
              eticheta={t('onboarding.pas4.tdee')}
              sub={t('onboarding.pas4.tdeeSub')}
            />
            <StatTile
              valoare={`${calcule.buget.aportMaximBaza}`}
              eticheta={t('onboarding.pas4.buget')}
              sub={t('onboarding.pas4.bugetSub')}
              accent
            />
          </div>
          <FlexuSpune poza="sarbatoreste">
            <T k="onboarding.pas4.flexu" p={{ nume: nume.trim() || t('onboarding.noob') }} />
          </FlexuSpune>
          <BigButton varianta="accent" mare onClick={() => void finalizeaza()} disabled={salvez}>
            {t(salvez ? 'onboarding.pas4.pregatesc' : 'onboarding.pas4.creeaza')}
          </BigButton>
          <div style={{ marginTop: 10 }}>
            <BigButton onClick={() => setPas(3)}>{t('comun.inapoi')}</BigButton>
          </div>
        </div>
      )}
    </div>
  );
}

function dataEta(saptamani: number): string {
  const d = new Date();
  d.setDate(d.getDate() + saptamani * 7);
  return data(d, 'lunaAn');
}
