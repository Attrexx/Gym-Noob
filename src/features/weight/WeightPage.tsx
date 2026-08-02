import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { BigButton, Modal, SectionTitle, StatTile, Sticker } from '@/design/components';
import { data, nr } from '@/i18n/format';
import { T, useT } from '@/i18n';
import { FlexuSpune } from '@/design/Flexu';
import { addBodyMetric, setGoal } from '@/data/repo';
import { bmi, bmiCategorie, clampRitm, saptamaniPanaLaTinta } from '@/domain/goals';
import { bodyFatNavy } from '@/domain/bodyFat';
import { FreefitImport } from '../settings/FreefitImport';

export function WeightPage() {
  const { t } = useT();
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
        <div className="supratitlu">{t('greutate.supratitlu')}</div>
        <h1>{t('greutate.titlu')}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatTile
          valoare={`${nr(kg)} kg`}
          eticheta={t('greutate.acum')}
          sub={ultima ? data(ultima.data) : '—'}
          accent
        />
        <StatTile
          valoare={`${nr(Math.max(0, maxKg - kg))} kg`}
          eticheta={t('greutate.slabite')}
          sub={t('greutate.deLaMaxim', { kg: maxKg })}
        />
        <StatTile valoare={nr(imc)} eticheta={t('greutate.imc')} sub={t(`domeniu.imc.${bmiCategorie(imc)}`)} />
        <StatTile
          valoare={grasime !== null ? `${nr(grasime)}%` : '—'}
          eticheta={t('greutate.grasime')}
          sub={t(grasime === null ? 'greutate.grasimeGol' : 'greutate.grasimeFormula')}
        />
      </div>

      <BigButton varianta="accent" mare onClick={() => setAdaug(true)}>
        {t('greutate.cantarireNoua')}
      </BigButton>

      <SectionTitle supratitlu={t('greutate.obiectiv.supratitlu')}>{t('greutate.obiectiv.titlu')}</SectionTitle>
      {date.goal ? (
        <Sticker>
          <p style={{ margin: 0 }}>
            {saptamani !== null ? (
              <T
                k="greutate.obiectiv.cuRest"
                p={{
                  tinta: date.goal.greutateTinta,
                  ritm: date.goal.ritmKgSaptamana,
                  rest: Math.max(0, kg - date.goal.greutateTinta),
                  saptamani: t('comun.saptamani', { n: saptamani }),
                }}
                c={[<b key="b0" />, <b key="b1" />, <b key="b2" />, <b key="b3" />]}
              />
            ) : (
              <T
                k="greutate.obiectiv.atins"
                p={{ tinta: date.goal.greutateTinta, ritm: date.goal.ritmKgSaptamana }}
                c={[<b key="b0" />, <b key="b1" />]}
              />
            )}
          </p>
          <div style={{ marginTop: 10 }}>
            <BigButton onClick={() => setEditGoal(true)}>{t('greutate.obiectiv.schimba')}</BigButton>
          </div>
        </Sticker>
      ) : (
        <Sticker>
          <p>{t('greutate.obiectiv.gol')}</p>
          <BigButton varianta="accent" onClick={() => setEditGoal(true)}>
            {t('greutate.obiectiv.seteaza')}
          </BigButton>
        </Sticker>
      )}

      {prima && ultima && prima !== ultima && (
        <FlexuSpune poza={maxKg - kg >= 1 ? 'sarbatoreste' : 'explica'}>
          {maxKg - kg >= 1 ? (
            <T
              k="greutate.flexu.progres"
              p={{ maxim: maxKg, acum: kg }}
              c={[<b key="b0" />, <b key="b1" />]}
            />
          ) : (
            t('greutate.flexu.sfat')
          )}
        </FlexuSpune>
      )}

      <SectionTitle supratitlu={t('greutate.istoric.supratitlu')}>{t('greutate.istoric.titlu')}</SectionTitle>
      {[...date.metrici].reverse().slice(0, 30).map((m) => (
        <Sticker key={m.id} style={{ padding: '8px 12px', marginBottom: 8 }}>
          <div className="rand" style={{ justifyContent: 'space-between' }}>
            <b>{nr(m.greutate)} kg</b>
            <span className="mic estompat">
              {data(m.data)} · {t(m.sursa === 'freefit' ? 'greutate.sursa.freefit' : 'greutate.sursa.manual')}
            </span>
          </div>
        </Sticker>
      ))}

      <SectionTitle supratitlu={t('greutate.import.supratitlu')}>{t('greutate.import.titlu')}</SectionTitle>
      <Sticker>
        <p className="mic">{t('greutate.import.explicatie')}</p>
        <BigButton onClick={() => setImportFreefit(true)}>{t('greutate.import.buton')}</BigButton>
      </Sticker>

      {adaug && <AdaugaCantarire onInchide={() => setAdaug(false)} />}
      {editGoal && <EditeazaObiectiv onInchide={() => setEditGoal(false)} kgCurent={kg} goal={date.goal} />}
      <Modal deschis={importFreefit} onInchide={() => setImportFreefit(false)} titlu={t('greutate.import.modal')}>
        <FreefitImport onGata={() => setImportFreefit(false)} />
      </Modal>
    </div>
  );
}

function AdaugaCantarire(props: { onInchide: () => void }) {
  const { t } = useT();
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
    <Modal deschis onInchide={props.onInchide} titlu={t('greutate.adauga.titlu')}>
      <label htmlFor="w-kg">{t('greutate.adauga.kg')}</label>
      <input
        id="w-kg"
        inputMode="decimal"
        value={kg}
        onChange={(e) => setKg(e.target.value)}
        placeholder={t('greutate.adauga.kgPlaceholder')}
        autoFocus
      />
      <div className="rand">
        <div>
          <label htmlFor="w-talie">{t('comun.talie')}</label>
          <input
            id="w-talie"
            inputMode="numeric"
            value={talie}
            onChange={(e) => setTalie(e.target.value)}
            placeholder={t('comun.optScurt')}
          />
        </div>
        <div>
          <label htmlFor="w-gat">{t('comun.gat')}</label>
          <input
            id="w-gat"
            inputMode="numeric"
            value={gat}
            onChange={(e) => setGat(e.target.value)}
            placeholder={t('comun.optScurt')}
          />
        </div>
        {profil?.sex === 'F' && (
          <div>
            <label htmlFor="w-sold">{t('comun.sold')}</label>
            <input
              id="w-sold"
              inputMode="numeric"
              value={sold}
              onChange={(e) => setSold(e.target.value)}
              placeholder={t('comun.optScurt')}
            />
          </div>
        )}
      </div>
      <div style={{ marginTop: 14 }}>
        <BigButton varianta="accent" mare onClick={() => void salveaza()}>
          {t('comun.salveaza')}
        </BigButton>
      </div>
    </Modal>
  );
}

function EditeazaObiectiv(props: { onInchide: () => void; kgCurent: number; goal?: { greutateTinta: number; ritmKgSaptamana: number } }) {
  const { t } = useT();
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
    <Modal deschis onInchide={props.onInchide} titlu={t('greutate.editObiectiv.titlu')}>
      <label htmlFor="g-tinta">{t('comun.greutateTinta')}</label>
      <input id="g-tinta" type="number" step={0.5} min={40} max={250} value={tinta} onChange={(e) => setTinta(Number(e.target.value))} />
      <label htmlFor="g-ritm">{t('greutate.editObiectiv.ritm', { ritm })}</label>
      <input id="g-ritm" type="range" min={0.25} max={1} step={0.25} value={ritm} onChange={(e) => setRitm(Number(e.target.value))} />
      {saptamani !== null && (
        <p className="mic" style={{ marginTop: 8 }}>
          {t('greutate.editObiectiv.estimare', { saptamani: t('comun.saptamani', { n: saptamani }) })}
        </p>
      )}
      <BigButton varianta="accent" mare onClick={() => void salveaza()}>
        {t('greutate.editObiectiv.salveaza')}
      </BigButton>
    </Modal>
  );
}
