import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import confetti from 'canvas-confetti';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { greutateCurenta, secundeActive, setGreutateCurenta, useSession, type RezumatSesiune } from '@/state/sessionStore';
import { useLive } from '@/state/liveStore';
import { BigButton, Modal, ProgressBar, StatTile, Sticker, Stepper } from '@/design/components';
import { data, nr } from '@/i18n/format';
import { Flexu, FlexuSpune } from '@/design/Flexu';
import { getExercise } from '@/data/catalog/exercises';
import { numeSablon } from '@/data/catalog/text/rezolva';
import type { Template, TemplateItem } from '@/data/types';
import { fmtDurata, useTick } from './useTick';
import { kcalSet, metBanda, metDinPutere, metMediuBanda, type SegmentBanda } from '@/domain/calories';
import { fmtOra, planDinSeturi } from '@/domain/sesiuni';
import { varstaDinData } from '@/domain/goals';
import { EMOJI_APARAT } from '@/domain/ftms';
import { Screensaver } from './Screensaver';
import { SumarHud } from './SumarHud';
import { UltimaData } from './UltimaData';
import { AlegeExercitiu, itemNou } from '../builder/AlegeExercitiu';
import { Metronom, sunete, vibreaza } from '@/services/audio';
import { spune } from '@/services/tts';
import { elibereazaEcranul, reactiveazaLaRevenire, tineEcranAprins } from '@/services/wakeLock';
import { aleator, incurajariFinal, incurajariSet } from '@/data/catalog/tips';
import { type PrHit } from '@/domain/pr';
import { descrieMotiv, descriereRealizare, numeRealizare } from '@/i18n/descrieri';
import { T, t as tr, useT } from '@/i18n';
import { suggestNext, type Suggestion } from '@/domain/suggestions';
import { verificaRealizari } from '@/services/achievementService';
import { ACHIEVEMENTS } from '@/domain/achievements';
import { bleDisponibil, conecteazaPuls, reconectareSilentioasa, type HrConnection } from '@/services/bleHeartRate';
import { conecteazaAparat, reconectareAparat, type MachineConnection } from '@/services/bleMachine';
import { latestMetric, saveTemplate, sessionsDesc, setLogsForSession, updateSettings } from '@/data/repo';

interface Sumar extends RezumatSesiune {
  realizariNoi: string[];
}

export function SessionPage() {
  const status = useSession((st) => st.status);
  // sumarul trăiește aici: la oprire store-ul devine „inactiva" și
  // ecranul live se demontează — rezumatul trebuie să supraviețuiască
  const [sumar, setSumar] = useState<Sumar | null>(null);
  if (sumar) return <SummaryScreen sumar={sumar} />;
  return status === 'inactiva' ? <StartScreen /> : <LiveScreen onSumar={setSumar} />;
}

// ─────────────────────────── ECRANUL DE START ───────────────────────────

function StartScreen() {
  const { t } = useT();
  const { profil } = useProfile();
  const loc = useLocation();
  const porneste = useSession((st) => st.porneste);
  const [alesId, setAlesId] = useState<number | null>((loc.state as { templateId?: number })?.templateId ?? null);
  const [modLiber, setModLiber] = useState(false);

  const sabloane = useLiveQuery(
    async () => (profil?.id ? db.templates.where({ profileId: profil.id }).toArray() : []),
    [profil?.id],
  );

  useEffect(() => {
    if (profil?.id) void latestMetric(profil.id).then((m) => m && setGreutateCurenta(m.greutate));
  }, [profil?.id]);

  const porneșteCu = async (plan: TemplateItem[], opts: { templateId?: number; templateNume?: string } = {}) => {
    if (!profil) return;
    await porneste(profil, plan, opts);
    sunete.start();
    void tineEcranAprins();
  };

  const start = async () => {
    if (alesId === null) return;
    const sablon = (sabloane ?? []).find((x) => x.id === alesId);
    if (!sablon) return;
    await porneșteCu(
      sablon.items.map((i) => ({ ...i })),
      { templateId: sablon.id, templateNume: numeSablon(sablon) },
    );
  };

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">{t('sesiune.start.supratitlu')}</div>
        <h1>{t('sesiune.start.titlu')}</h1>
      </div>
      <FlexuSpune poza="flex">
        <T k="sesiune.start.flexu" />
      </FlexuSpune>

      {/* calea rapidă: de la ușa sălii la primul set în trei atingeri */}
      <Sticker accent inclinat onClick={() => setModLiber(true)} style={{ marginBottom: 14 }}>
        <b id="mod-liber" style={{ fontSize: '1.15rem' }}>
          {t('sesiune.start.modLiber')}
        </b>
        <div className="mic">{t('sesiune.start.modLiberSub')}</div>
      </Sticker>

      {(sabloane ?? []).length > 0 && <h2 style={{ marginTop: 4 }}>{t('sesiune.start.planurile')}</h2>}
      {(sabloane ?? []).map((sablon: Template) => (
        <Sticker
          key={sablon.id}
          onClick={() => setAlesId(sablon.id!)}
          style={alesId === sablon.id ? { outline: '4px solid var(--accent)' } : undefined}
        >
          <b>{numeSablon(sablon)}</b>{' '}
          {sablon.predefinit && <span className="eticheta-mica">{t('planuri.deLaFlexu')}</span>}
          <div className="mic estompat">{t('comun.exercitii', { n: sablon.items.length })}</div>
        </Sticker>
      ))}

      <BigButton varianta="accent" mare disabled={alesId === null} onClick={() => void start()}>
        {t('sesiune.start.buton')}
      </BigButton>

      <AlegeExercitiu
        deschis={modLiber}
        onInchide={() => setModLiber(false)}
        actiune={t('sesiune.start.incepeCuAsta')}
        onAlege={(item) => {
          setModLiber(false);
          void porneșteCu([item]);
        }}
        extra={{
          text: t('sesiune.start.pornescGol'),
          onClick: () => {
            setModLiber(false);
            void porneșteCu([]);
          },
        }}
      />
    </div>
  );
}

// ─────────────────────────── ECRANUL LIVE ───────────────────────────

function LiveScreen(props: { onSumar: (s: Sumar) => void }) {
  const { t } = useT();
  const s = useSession();
  const { profil, setari } = useProfile();
  const nav = useNavigate();
  useTick(1000);

  const [prCelebration, setPrCelebration] = useState<PrHit[] | null>(null);
  const [sugestii, setSugestii] = useState<Suggestion[] | null>(null);
  const [adaugExercitiu, setAdaugExercitiu] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);
  const [hrCon, setHrCon] = useState<HrConnection | null>(null);
  const [cautCeas, setCautCeas] = useState(false);
  const [aparatCon, setAparatCon] = useState<MachineConnection | null>(null);
  const [cautAparat, setCautAparat] = useState(false);
  const ultimulSetLa = useRef(Date.now());
  const [sugestieAuto, setSugestieAuto] = useState<Suggestion | null>(null);

  const sec = secundeActive(s);
  const restRamas = s.restEndsMs ? Math.ceil((s.restEndsMs - Date.now()) / 1000) : null;

  // wake lock pe durata sesiunii (recerut și la revenirea în aplicație)
  useEffect(() => {
    void tineEcranAprins();
    const scoate = reactiveazaLaRevenire(() => useSession.getState().status !== 'inactiva');
    return () => {
      scoate();
      elibereazaEcranul();
    };
  }, []);

  // la începutul sesiunii încercăm singuri ceasul și aparatul, în tăcere.
  // dacă browserul nu ne lasă (vezi services/ble.ts), rămâne butonul din antet.
  useEffect(() => {
    if (!bleDisponibil) return;
    let anulat = false;
    void (async () => {
      if (setari?.pulsAuto !== false) {
        setCautCeas(true);
        const con = await reconectareSilentioasa(
          (bpm) => useSession.getState().hrSample(bpm),
          () => setHrCon(null),
          setari?.pulsUltimulDispozitiv,
        );
        if (anulat) con?.deconecteaza();
        else {
          if (con) setHrCon(con);
          setCautCeas(false);
        }
      }
      if (setari?.aparatAuto !== false) {
        setCautAparat(true);
        const con = await reconectareAparat(
          (d) => useLive.getState().esantion(d),
          () => {
            setAparatCon(null);
            useLive.getState().setAparat(null);
          },
          setari?.aparatUltimulDispozitiv,
        );
        if (anulat) con?.deconecteaza();
        else {
          if (con) {
            setAparatCon(con);
            useLive.getState().setAparat(con);
          }
          setCautAparat(false);
        }
      }
    })();
    return () => {
      anulat = true;
    };
    // pornim o singură dată pe sesiune, după ce avem setările
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!setari]);

  // bipuri la finalul pauzei
  const restNotificat = useRef(false);
  useEffect(() => {
    if (restRamas === null) {
      restNotificat.current = false;
      return;
    }
    if (restRamas <= 3 && restRamas > 0 && setari?.sunete) sunete.tic();
    if (restRamas <= 0 && !restNotificat.current) {
      restNotificat.current = true;
      if (setari?.sunete) sunete.gata();
      if (setari?.vibratii) vibreaza([200, 100, 200]);
      if (setari?.vocale) spune(t('sesiune.vocal.pauzaTerminata'));
      s.stopRest();
    }
  }, [restRamas, setari, s]);

  // sugestii automate: 4 minute fără set înregistrat
  useEffect(() => {
    if (!setari?.sugestiiAutomate || s.status !== 'activa' || restRamas) return;
    const idleMs = Date.now() - ultimulSetLa.current;
    if (idleMs > 4 * 60_000 && !sugestieAuto && !sugestii) {
      void construiesteSugestii().then((list) => {
        if (list.length) setSugestieAuto(list[0]);
        ultimulSetLa.current = Date.now(); // nu insista imediat din nou
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sec]);

  const construiesteSugestii = useCallback(async () => {
    if (!profil?.id || !s.sessionId) return [] as Suggestion[];
    const [seturiAzi, recente] = await Promise.all([setLogsForSession(s.sessionId), sessionsDesc(profil.id, 5)]);
    const grupeRecente = new Set<string>();
    for (const ses of recente) {
      const logs = await setLogsForSession(ses.id!);
      for (const l of logs) getExercise(l.exerciseId)?.muschi.forEach((m) => grupeRecente.add(m));
    }
    const { exercitii } = await import('@/data/catalog/exercises');
    return suggestNext({
      catalog: exercitii(),
      seturiAzi,
      inPlan: s.plan.map((i) => i.exerciseId),
      grupeRecente: [...grupeRecente] as never[],
      minuteScurse: sec / 60,
    });
  }, [profil?.id, s.sessionId, s.plan, sec]);

  const dupaSet = async (planIdx: number, date: DateSet) => {
    if (!profil) return;
    // ce a măsurat aparatul pe setul ăsta pleacă în jurnal odată cu setul
    const prs = await s.logSet(profil, planIdx, { ...useLive.getState().rezumatSet(), ...date });
    useLive.getState().reseteazaSet();
    ultimulSetLa.current = Date.now();
    if (setari?.sunete) sunete.set();
    if (prs.length > 0) {
      setPrCelebration(prs);
      if (setari?.sunete) sunete.record();
      if (setari?.vibratii) vibreaza([100, 50, 100, 50, 300]);
      if (setari?.vocale) spune(t('sesiune.vocal.record'));
      void confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
    } else if (setari?.vocale) {
      spune(aleator(incurajariSet()));
    }
    const item = s.plan[planIdx];
    if (item && item.pauzaSec > 0) s.startRest(item.pauzaSec);
  };

  const opresteSesiunea = async (abandon: boolean) => {
    try {
      hrCon?.deconecteaza();
      aparatCon?.deconecteaza();
      useLive.getState().setAparat(null);
      useLive.getState().reseteazaSet();
      const rez = await s.opreste(abandon);
      elibereazaEcranul();
      if (setari?.sunete) sunete.stop();
      if (abandon || !rez) {
        nav('/');
        return;
      }
      const realizariNoi = profil ? await verificaRealizari(profil) : [];
      if (realizariNoi.length) void confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
      props.onSumar({ ...rez, realizariNoi });
    } catch (e) {
      console.error('Eroare la închiderea sesiunii', e);
      nav('/');
    }
  };

  const conectezCeasul = async () => {
    try {
      const con = await conecteazaPuls(
        (bpm) => useSession.getState().hrSample(bpm),
        () => setHrCon(null),
      );
      setHrCon(con);
      setCautCeas(false);
      // ținem minte ceasul ca să-l putem căuta singuri data viitoare
      if (profil?.id) void updateSettings(profil.id, { pulsUltimulDispozitiv: con.deviceName });
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const conectezAparatul = async () => {
    try {
      const con = await conecteazaAparat(
        (d) => useLive.getState().esantion(d),
        () => {
          setAparatCon(null);
          useLive.getState().setAparat(null);
        },
      );
      setAparatCon(con);
      useLive.getState().setAparat(con);
      setCautAparat(false);
      if (profil?.id) void updateSettings(profil.id, { aparatUltimulDispozitiv: con.deviceName });
    } catch (e) {
      alert((e as Error).message);
    }
  };

  /** Exercițiul nou intră în plan ȘI devine cel activ — asta ceruse sala. */
  const adaugaSiTreciLa = (it: TemplateItem) => {
    s.adaugaInPlan(it);
    s.sareLa(useSession.getState().plan.length - 1);
    useLive.getState().reseteazaSet();
  };

  const item = s.plan[s.exIndex];

  return (
    <div className="pagina">
      <Screensaver activ={setari?.economizor !== false} />
      {/* ── sumarul live: timp, calorii, puls, apă, aparat ── */}
      <SumarHud
        numeCeas={hrCon?.deviceName ?? null}
        cautaCeas={cautCeas}
        onConecteazaPuls={() => void conectezCeasul()}
        onStop={() => setConfirmStop(true)}
      />

      {/* ── pauza dintre seturi ── */}
      {restRamas !== null && restRamas > 0 && (
        <Sticker accent className="pop">
          <div className="centrat">
            <div className="supratitlu-mic" style={{ color: 'inherit' }}>
              {t('sesiune.pauzaIntre')}
            </div>
            <div style={{ fontFamily: 'var(--font-titlu)', fontSize: '3rem', lineHeight: 1.1 }}>{fmtDurata(restRamas)}</div>
            <ProgressBar procent={(1 - restRamas / s.restTotalSec) * 100} />
            <div className="rand" style={{ marginTop: 10 }}>
              <BigButton onClick={() => s.startRest(restRamas + 30)}>{t('sesiune.plus30')}</BigButton>
              <BigButton onClick={() => s.stopRest()}>{t('sesiune.sarPeste')}</BigButton>
            </div>
          </div>
        </Sticker>
      )}

      {/* ── sugestie automată ── */}
      {sugestieAuto && (
        <Sticker className="pop">
          <FlexuSpune poza="ganditor" marime={60}>
            <T
              k="sesiune.sugestie.ceZici"
              p={{ motiv: descrieMotiv(sugestieAuto.motiv), exercitiu: sugestieAuto.exercise.nume }}
            />
          </FlexuSpune>
          <div className="rand">
            <BigButton
              varianta="accent"
              onClick={() => {
                adaugaSiTreciLa(itemNou(sugestieAuto.exercise.id));
                setSugestieAuto(null);
              }}
            >
              {t('sesiune.sugestie.adauga')}
            </BigButton>
            <BigButton varianta="contur" onClick={() => setSugestieAuto(null)}>
              {t('sesiune.sugestie.nuAcum')}
            </BigButton>
          </div>
        </Sticker>
      )}

      {/* ── exercițiul curent ── */}
      {item ? (
        <ExercitiuCurent key={s.exIndex} planIdx={s.exIndex} onSet={dupaSet} />
      ) : (
        <>
          <FlexuSpune poza="explica">{t('sesiune.golFlexu')}</FlexuSpune>
          <BigButton varianta="accent" mare onClick={() => setAdaugExercitiu(true)}>
            {t('sesiune.alegePrimul')}
          </BigButton>
        </>
      )}

      {/* ── planul sesiunii ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16 }}>
        <h2 style={{ margin: 0 }}>{t('sesiune.planAzi')}</h2>
        <button
          onClick={() => {
            setAdaugExercitiu(true);
            void construiesteSugestii().then(setSugestii);
          }}
          style={{ background: 'none', border: 'none', fontWeight: 800, textDecoration: 'underline', color: 'inherit', fontSize: '0.85rem' }}
        >
          {t('sesiune.ceUrmeaza')}
        </button>
      </div>
      {s.plan.map((it, idx) => {
        const ex = getExercise(it.exerciseId);
        if (!ex) return null;
        const gata = s.seturiFacute[idx] >= it.seturi;
        return (
          <Sticker
            key={idx}
            onClick={() => s.sareLa(idx)}
            style={{
              padding: 10,
              opacity: gata ? 0.55 : 1,
              outline: idx === s.exIndex ? '4px solid var(--accent)' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <div>
                <b>{gata ? '✅ ' : ''}{ex.nume}</b>{' '}
                {idx === s.exIndex && <span className="eticheta-mica">{t('sesiune.activ')}</span>}
                <div className="mic estompat">
                  {t('sesiune.seturiFacute', { facute: s.seturiFacute[idx], total: it.seturi })}
                  {ex.masura === 'repetari'
                    ? ` · ${it.repetari ? t('descriere.repetari', { n: it.repetari }) : t('sesiune.repMaxim')} @ ${nr(it.greutate ?? 0)} kg`
                    : ` · ${Math.round((it.durataSec ?? 0) / 60)} min`}
                </div>
                {it.notite && (
                  <div className="mic" style={{ marginTop: 2 }}>
                    ↳ {it.notite}
                  </div>
                )}
              </div>
              {s.seturiFacute[idx] === 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    s.scoateDinPlan(idx);
                  }}
                  aria-label={t('sesiune.scoateDinPlan', { exercitiu: ex.nume })}
                  style={{ background: 'none', border: 'none', fontSize: '1.1rem', color: 'inherit' }}
                >
                  ✕
                </button>
              )}
            </div>
          </Sticker>
        );
      })}
      <BigButton
        mare
        onClick={() => {
          setAdaugExercitiu(true);
          void construiesteSugestii().then(setSugestii);
        }}
      >
        {t('sesiune.adaugaExercitiu')}
      </BigButton>
      <p className="mic estompat centrat" style={{ margin: '6px 0 0' }}>
        {t('sesiune.notaAdaugare')}
      </p>

      {/* ── apă ── */}
      <h2 style={{ marginTop: 18 }}>{t('sesiune.apa.titlu')}</h2>
      <Sticker>
        <ProgressBar
          procent={(s.apaMl / (profil?.tintaApaSesiune ?? 700)) * 100}
          eticheta={t('sesiune.apa.progres', { bauti: s.apaMl, tinta: profil?.tintaApaSesiune ?? 700 })}
          culoare="#1565C0"
        />
        <div className="rand" style={{ marginTop: 10 }}>
          {[150, 250, 500].map((ml) => (
            <BigButton key={ml} onClick={() => void s.bea(ml)}>
              {t('sesiune.apa.buton', { ml })}
            </BigButton>
          ))}
        </div>
      </Sticker>

      {/* ── ceas și aparat ── */}
      {bleDisponibil && (
        <>
          <h2 style={{ marginTop: 18 }}>{t('sesiune.ble.titlu')}</h2>
          <Sticker>
            {hrCon ? (
              <div className="rand">
                <span>
                  ♥ <b>{s.hrUltim ?? '—'} bpm</b> <span className="mic estompat">({hrCon.deviceName})</span>
                </span>
                <BigButton varianta="contur" onClick={() => { hrCon.deconecteaza(); setHrCon(null); }}>
                  {t('sesiune.ble.deconecteaza')}
                </BigButton>
              </div>
            ) : (
              <>
                <div className="rand">
                  <span className="mic">
                    {t(cautCeas ? 'sesiune.ble.cautCeasul' : 'sesiune.ble.ceasIntrebare')}
                  </span>
                  <BigButton onClick={() => void conectezCeasul()}>{t('sesiune.ble.conecteazaCeas')}</BigButton>
                </div>
                <p className="mic estompat" style={{ margin: '6px 0 0' }}>
                  {t('sesiune.ble.ceasExplicatie')}
                </p>
              </>
            )}
          </Sticker>

          <Sticker>
            {aparatCon ? (
              <div className="rand">
                <span>
                  {EMOJI_APARAT[aparatCon.tip]} <b>{aparatCon.model}</b>{' '}
                  <span className="mic estompat">({tr(`domeniu.aparat.${aparatCon.tip}`)})</span>
                </span>
                <BigButton
                  varianta="contur"
                  onClick={() => {
                    aparatCon.deconecteaza();
                    setAparatCon(null);
                    useLive.getState().setAparat(null);
                  }}
                >
                  {t('sesiune.ble.deconecteaza')}
                </BigButton>
              </div>
            ) : (
              <>
                <div className="rand">
                  <span className="mic">
                    {t(cautAparat ? 'sesiune.ble.cautAparatul' : 'sesiune.ble.aparatIntrebare')}
                  </span>
                  <BigButton id="conecteaza-aparat" onClick={() => void conectezAparatul()}>
                    {t('sesiune.ble.conecteazaAparat')}
                  </BigButton>
                </div>
                <p className="mic estompat" style={{ margin: '6px 0 0' }}>
                  {t('sesiune.ble.aparatExplicatie')}
                </p>
              </>
            )}
          </Sticker>
        </>
      )}

      {/* ── modale ── */}
      <AlegeExercitiu
        deschis={adaugExercitiu}
        onInchide={() => setAdaugExercitiu(false)}
        sugestii={sugestii}
        actiune={t('sesiune.treciLaEl')}
        onAlege={(it) => {
          setAdaugExercitiu(false);
          adaugaSiTreciLa(it);
        }}
      />

      <Modal deschis={!!prCelebration} onInchide={() => setPrCelebration(null)} titlu={t('sesiune.pr.titlu')}>
        <div className="centrat">
          <Flexu poza="sarbatoreste" marime={110} />
          {(prCelebration ?? []).map((pr) => (
            <p key={pr.tip} style={{ fontWeight: 800 }}>
              <T
                k="sesiune.pr.linie"
                p={{ tip: t(`domeniu.pr.${pr.tip}`), valoare: nr(pr.valoare) }}
              />
              {pr.valoareVeche ? (
                <span className="estompat mic">
                  {' '}
                  ({t('sesiune.pr.vechiul', { valoare: nr(pr.valoareVeche) })})
                </span>
              ) : null}
            </p>
          ))}
          <BigButton varianta="accent" mare onClick={() => setPrCelebration(null)}>
            {t('sesiune.pr.maiDeparte')}
          </BigButton>
        </div>
      </Modal>

      <Modal deschis={confirmStop} onInchide={() => setConfirmStop(false)} titlu={t('sesiune.stop.titlu')}>
        <p>
          {t('sesiune.stop.rezumat', {
            timp: fmtDurata(sec),
            seturi: t('comun.seturi', { n: s.seturiFacute.reduce((a, b) => a + b, 0) }),
          })}
        </p>
        <div style={{ display: 'grid', gap: 10 }}>
          <BigButton varianta="accent" mare onClick={() => void opresteSesiunea(false)}>
            {t('sesiune.stop.da')}
          </BigButton>
          <BigButton onClick={() => setConfirmStop(false)}>{t('sesiune.stop.nu')}</BigButton>
          <BigButton
            varianta="pericol"
            onClick={() => {
              if (confirm(t('sesiune.stop.abandonConfirmare'))) void opresteSesiunea(true);
            }}
          >
            {t('sesiune.stop.abandon')}
          </BigButton>
        </div>
      </Modal>
    </div>
  );
}

/** Calculatorul de discuri: bară olimpică de 20 kg, discuri standard. */
export function discuriPeParte(total: number): string {
  let ramas = (total - 20) / 2;
  const discuri = [25, 20, 15, 10, 5, 2.5, 1.25];
  const folosite: number[] = [];
  for (const d of discuri) {
    while (ramas >= d - 0.001) {
      folosite.push(d);
      ramas -= d;
    }
  }
  // nu e componentă, deci `tr` sincron; „+" și „kg" sunt simboluri, rămân în cod
  return folosite.length ? folosite.map((d) => nr(d)).join(' + ') + ' kg' : tr('sesiune.discuriNimic');
}

// ─────────────────────── CARDUL EXERCIȚIULUI CURENT ───────────────────────

/** Ce trimite cardul mai departe când bifezi un set. */
interface DateSet {
  repetari?: number;
  greutate?: number;
  durataSec?: number;
  rpe?: number;
  met?: number;
  viteza?: number;
  inclinatie?: number;
}

function ExercitiuCurent(props: {
  planIdx: number;
  onSet: (planIdx: number, date: DateSet) => Promise<void>;
}) {
  const { t } = useT();
  const s = useSession();
  const { profil } = useProfile();
  const item = s.plan[props.planIdx];
  const ex = getExercise(item.exerciseId)!;
  const [greutate, setGreutate] = useState(item.greutate ?? 0);
  const [repetari, setRepetari] = useState(item.repetari ?? 10);
  const [rpe, setRpe] = useState(6);
  const [crono, setCrono] = useState(0);
  const [cronoActiv, setCronoActiv] = useState(false);
  const metronomRef = useRef<Metronom | null>(null);
  const [metronomActiv, setMetronomActiv] = useState(false);
  const [fazaTempo, setFazaTempo] = useState('');
  useTick(1000, cronoActiv);
  const cronoStart = useRef(0);

  // banda de alergare: viteză + înclinație, cu segmente pentru calorii
  const banda = ex.echipament === 'banda_alergare';
  const [viteza, setViteza] = useState(item.viteza ?? 5);
  const [inclinatie, setInclinatie] = useState(item.inclinatie ?? 0);
  const segmente = useRef<SegmentBanda[]>([]);

  const aparat = useLive((l) => l.aparat);
  const dateAparat = useLive((l) => l.ultim);

  useEffect(() => () => metronomRef.current?.stop(), []);

  const cronoSec = cronoActiv ? Math.floor((Date.now() - cronoStart.current) / 1000) : crono;
  const gata = s.seturiFacute[props.planIdx] >= item.seturi;

  const schimbaBanda = (v: number, inc: number) => {
    setViteza(v);
    setInclinatie(inc);
    segmente.current.push({ startSec: cronoSec, viteza: v, inclinatie: inc });
  };

  /**
   * Aparatul conectat înlocuiește stepperele ca sursă de adevăr: fiecare
   * schimbare de viteză/înclinație intră în ACELEAȘI segmente pe care le
   * scria mâna, deci calculul de calorii ACSM rămâne neatins.
   */
  useEffect(() => {
    if (!banda || aparat?.tip !== 'banda' || !dateAparat || !cronoActiv) return;
    const v = dateAparat.vitezaKmh ?? viteza;
    const inc = dateAparat.inclinatieProcent ?? inclinatie;
    if (Math.abs(v - viteza) < 0.05 && Math.abs(inc - inclinatie) < 0.05) return;
    setViteza(v);
    setInclinatie(inc);
    segmente.current.push({ startSec: cronoSec, viteza: v, inclinatie: inc });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateAparat, cronoActiv, banda, aparat?.tip]);

  /** MET-ul de acum: aparatul are ultimul cuvânt, apoi ACSM, apoi catalogul. */
  const metCurent = (): number => {
    if (banda) return metBanda(viteza, inclinatie);
    if (aparat && dateAparat?.met) return dateAparat.met;
    if (aparat && dateAparat?.putereW && dateAparat.putereW > 0) {
      return metDinPutere(dateAparat.putereW, greutateCurenta());
    }
    return ex.met;
  };

  /**
   * Caloriile setului în curs, ca să nu stea antetul pe zero 25 de minute
   * pe bandă. E doar pentru afișare — cifra care se scrie în jurnal se
   * calculează la bifarea setului, ca până acum.
   */
  useEffect(() => {
    if (!cronoActiv || ex.masura !== 'timp') {
      useLive.getState().setKcalParial(0);
      return;
    }
    useLive.getState().setKcalParial(
      kcalSet({
        met: metCurent(),
        greutateKg: greutateCurenta(),
        secunde: cronoSec,
        sex: profil?.sex,
        varsta: profil ? varstaDinData(profil.dataNasterii) : undefined,
        pulsMediu: s.hrNr > 0 ? Math.round(s.hrSuma / s.hrNr) : undefined,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cronoSec, cronoActiv]);

  /** mediile ponderate cu timpul, pentru jurnal */
  const mediiBanda = (totalSec: number) => {
    const segs = segmente.current.length ? segmente.current : [{ startSec: 0, viteza, inclinatie }];
    let sv = 0;
    let si = 0;
    for (let i = 0; i < segs.length; i++) {
      const a = Math.min(segs[i].startSec, totalSec);
      const b = i + 1 < segs.length ? Math.min(segs[i + 1].startSec, totalSec) : totalSec;
      if (b > a) {
        sv += segs[i].viteza * (b - a);
        si += segs[i].inclinatie * (b - a);
      }
    }
    return totalSec > 0
      ? { viteza: Math.round((sv / totalSec) * 10) / 10, inclinatie: Math.round((si / totalSec) * 10) / 10 }
      : { viteza, inclinatie };
  };

  const toggleMetronom = () => {
    if (!metronomRef.current) metronomRef.current = new Metronom();
    if (metronomActiv) {
      metronomRef.current.stop();
      setMetronomActiv(false);
      setFazaTempo('');
    } else if (item.tempo) {
      metronomRef.current.start(item.tempo, (nume) => setFazaTempo(nume));
      setMetronomActiv(true);
    }
  };

  return (
    <Sticker className="pop" style={{ borderWidth: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <h2 style={{ margin: 0 }}>{ex.nume}</h2>
        <a href={`#/biblioteca/${ex.id}`} className="mic" style={{ fontWeight: 700, flexShrink: 0 }}>
          {t('sesiune.cumSeFace')}
        </a>
      </div>
      <div className="mic estompat" style={{ marginBottom: item.notite ? 4 : 10 }}>
        {t('sesiune.setulDin', {
          n: Math.min(s.seturiFacute[props.planIdx] + 1, item.seturi),
          total: item.seturi,
          echipament: ex.echipamentNume,
        })}
      </div>
      {item.notite && (
        <div
          className="mic"
          style={{
            marginBottom: 10,
            padding: '6px 8px',
            border: '2px dashed var(--linie)',
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          📌 {item.notite}
        </div>
      )}

      {profil?.id && !gata && (
        <UltimaData
          profileId={profil.id}
          exerciseId={ex.id}
          sessionIdCurent={s.sessionId ?? undefined}
          onReia={(set) => {
            if (set.greutate !== undefined) setGreutate(set.greutate);
            if (set.repetari !== undefined) setRepetari(set.repetari);
            if (set.viteza !== undefined) setViteza(set.viteza);
            if (set.inclinatie !== undefined) setInclinatie(set.inclinatie);
          }}
        />
      )}

      {gata ? (
        <FlexuSpune poza="sarbatoreste" marime={64}>
          {t('sesiune.toateSeturile')}
        </FlexuSpune>
      ) : ex.masura === 'repetari' ? (
        <>
          <div className="rand" style={{ alignItems: 'flex-start' }}>
            <Stepper
              eticheta={t('parametri.greutate')}
              valoare={greutate}
              pas={2.5}
              unitate="kg"
              onChange={setGreutate}
              max={500}
            />
            <Stepper
              eticheta={t('parametri.repetari')}
              valoare={repetari}
              pas={1}
              onChange={setRepetari}
              min={1}
              max={100}
            />
          </div>
          <div style={{ margin: '10px 0' }}>
            <div className="stepper-eticheta" style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
              {t('sesiune.rpe.intrebare', { rpe })}
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              aria-label={t('sesiune.rpe.aria')}
              style={{ width: '100%' }}
            />
            <div className="rand mic estompat" style={{ justifyContent: 'space-between' }}>
              <span>{t('sesiune.rpe.lejer')}</span>
              <span>{t('sesiune.rpe.maxim')}</span>
            </div>
          </div>
          {item.tempo && (
            <div className="rand" style={{ marginBottom: 10 }}>
              <BigButton varianta={metronomActiv ? 'accent' : 'contur'} onClick={toggleMetronom}>
                {metronomActiv && fazaTempo
                  ? t('sesiune.tempo.cuFaza', { tempo: item.tempo, faza: fazaTempo })
                  : t('sesiune.tempo.buton', { tempo: item.tempo })}
              </BigButton>
            </div>
          )}
          {ex.echipament === 'haltera' && greutate > 20 && (
            <p className="mic estompat centrat" style={{ margin: '0 0 10px' }}>
              <T k="sesiune.discuri" p={{ greutate, discuri: discuriPeParte(greutate) }} />
            </p>
          )}
          <BigButton varianta="accent" mare onClick={() => void props.onSet(props.planIdx, { repetari, greutate, rpe })}>
            {t('sesiune.amTerminatSetul')}
          </BigButton>
        </>
      ) : (
        <>
          <div className="centrat" style={{ margin: '8px 0' }}>
            <div style={{ fontFamily: 'var(--font-titlu)', fontSize: '3rem' }}>{fmtDurata(cronoSec)}</div>
            <div className="mic estompat">{t('sesiune.tinta', { timp: fmtDurata(item.durataSec ?? 300) })}</div>
          </div>
          {banda && (
            <div style={{ border: '2px dashed var(--linie)', borderRadius: 10, padding: '10px 6px', margin: '0 0 10px' }}>
              <div style={{ display: 'grid', gap: 10 }}>
                <Stepper
                  eticheta={t('sesiune.banda.viteza')}
                  valoare={viteza}
                  pas={0.5}
                  min={0.5}
                  max={22}
                  unitate="km/h"
                  onChange={(v) => schimbaBanda(v, inclinatie)}
                />
                <Stepper
                  eticheta={t('sesiune.banda.inclinatie')}
                  valoare={inclinatie}
                  pas={1}
                  min={0}
                  max={20}
                  unitate="%"
                  onChange={(v) => schimbaBanda(viteza, v)}
                />
              </div>
              <p className="mic estompat centrat" style={{ margin: '6px 0 0' }}>
                <T k="sesiune.banda.explicatie" p={{ met: metBanda(viteza, inclinatie).toFixed(1) }} />
              </p>
            </div>
          )}
          <div className="rand">
            {!cronoActiv ? (
              <BigButton
                varianta="accent"
                onClick={() => {
                  cronoStart.current = Date.now() - crono * 1000;
                  if (banda && segmente.current.length === 0) segmente.current.push({ startSec: 0, viteza, inclinatie });
                  setCronoActiv(true);
                }}
              >
                {t(crono > 0 ? 'sesiune.crono.continua' : 'sesiune.crono.porneste')}
              </BigButton>
            ) : (
              <BigButton
                onClick={() => {
                  setCrono(Math.floor((Date.now() - cronoStart.current) / 1000));
                  setCronoActiv(false);
                }}
              >
                {t('sesiune.crono.opreste')}
              </BigButton>
            )}
            <BigButton varianta="contur" onClick={() => { setCrono(0); setCronoActiv(false); segmente.current = []; }}>
              {t('sesiune.crono.reset')}
            </BigButton>
          </div>
          <div style={{ margin: '10px 0' }}>
            <input
              type="range"
              min={1}
              max={10}
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              aria-label={t('sesiune.rpe.aria')}
              style={{ width: '100%' }}
            />
            <div className="rand mic estompat" style={{ justifyContent: 'space-between' }}>
              <span>{t('sesiune.rpe.lejer')}</span>
              <span>{t('sesiune.rpe.maximCu', { rpe })}</span>
            </div>
          </div>
          <BigButton
            varianta="accent"
            mare
            disabled={cronoSec === 0}
            onClick={() => {
              setCronoActiv(false);
              // banda are ACSM din segmente; rowerul/bicicleta, MET din wați —
              // în ambele cazuri MET-ul e obiectiv, deci RPE nu-l mai scalează
              const rezumatAparat = useLive.getState().rezumatSet();
              const metObiectiv = banda
                ? metMediuBanda(segmente.current.length ? segmente.current : [{ startSec: 0, viteza, inclinatie }], cronoSec)
                : rezumatAparat.putereMedieW
                  ? metDinPutere(rezumatAparat.putereMedieW, greutateCurenta())
                  : undefined;
              const extra: DateSet = banda
                ? { met: metObiectiv, ...mediiBanda(cronoSec) }
                : metObiectiv !== undefined
                  ? { met: metObiectiv }
                  : {};
              void props.onSet(props.planIdx, { durataSec: cronoSec, rpe, ...extra }).then(() => {
                setCrono(0);
                segmente.current = [];
              });
            }}
          >
            {t('sesiune.amTerminat', { timp: fmtDurata(cronoSec) })}
          </BigButton>
        </>
      )}
    </Sticker>
  );
}

// ─────────────────────────── REZUMATUL FINAL ───────────────────────────

function SummaryScreen(props: { sumar: Sumar }) {
  const { t } = useT();
  const nav = useNavigate();
  const { sumar } = props;
  return (
    <div className="pagina pop">
      <div className="coperta centrat">
        <div className="supratitlu">{t('sesiune.rezumat.supratitlu')}</div>
        <h1>{t('sesiune.rezumat.titlu')}</h1>
        <Flexu poza="sarbatoreste" marime={130} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <StatTile
          valoare={fmtDurata(sumar.totalSec)}
          eticheta={t('sesiune.rezumat.laSala')}
          sub={`${fmtOra(sumar.inceput)} → ${fmtOra(sumar.sfarsit)}`}
        />
        <StatTile valoare={sumar.kcal} eticheta={t('sesiune.rezumat.kcal')} accent />
        <StatTile
          valoare={fmtDurata(sumar.activSec)}
          eticheta={t('sesiune.rezumat.timpActiv')}
          sub={t('sesiune.rezumat.pauze', { timp: fmtDurata(sumar.pauzaSec) })}
        />
        <StatTile valoare={sumar.seturi} eticheta={t('sesiune.rezumat.seturi')} />
        <StatTile valoare={`${sumar.apaMl} ml`} eticheta={t('sesiune.rezumat.apa')} />
        <StatTile
          valoare={sumar.totalSec > 0 ? `${Math.round((sumar.activSec / sumar.totalSec) * 100)}%` : '—'}
          eticheta={t('sesiune.rezumat.catAiLucrat')}
        />
      </div>

      <SalveazaCaPlan sumar={sumar} />

      {sumar.realizariNoi.length > 0 && (
        <>
          <h2>{t('sesiune.rezumat.realizari')}</h2>
          {sumar.realizariNoi.map((id) => {
            const a = ACHIEVEMENTS.find((x) => x.id === id);
            return a ? (
              <Sticker key={id} accent inclinat>
                <b style={{ fontSize: '1.1rem' }}>
                  {a.emoji} {numeRealizare(a.id)}
                </b>
                <div className="mic">{descriereRealizare(a.id)}</div>
              </Sticker>
            ) : null;
          })}
        </>
      )}
      <FlexuSpune poza="obosit">{aleator(incurajariFinal())}</FlexuSpune>
      <BigButton varianta="accent" mare onClick={() => nav('/')}>
        {t('sesiune.rezumat.acasa')}
      </BigButton>
    </div>
  );
}

/**
 * Salvarea sesiunii ca plan, la final. Planul se construiește din ce ai
 * FĂCUT, nu din ce plănuiseși: dacă ai urcat de la 40 la 45 kg, planul
 * salvat spune 45. Din planul original păstrăm doar pauzele și notițele.
 */
function SalveazaCaPlan(props: { sumar: Sumar }) {
  const { t } = useT();
  const { profil } = useProfile();
  const [deschis, setDeschis] = useState(false);
  const [nume, setNume] = useState(
    t('sesiune.numePlanImplicit', { data: data(props.sumar.inceput, 'ziLunaLung') }),
  );
  const [salvat, setSalvat] = useState(false);

  if (props.sumar.seturi === 0) return null;

  const salveaza = async () => {
    if (!profil?.id || !nume.trim()) return;
    const logs = await setLogsForSession(props.sumar.sessionId);
    const items = planDinSeturi(logs, props.sumar.plan);
    if (items.length === 0) return;
    await saveTemplate({
      profileId: profil.id,
      nume: nume.trim(),
      // planul e al utilizatorului din start (n-are `sursaText`), deci textul
      // rămâne cum a fost scris acum — vezi rezolva.ts
      descriere: t('sesiune.salvatDescriere'),
      etichete: [],
      items,
      creatLa: '',
      modificatLa: '',
      predefinit: false,
    } as Template);
    setSalvat(true);
    setDeschis(false);
  };

  if (salvat) {
    return (
      <Sticker accent inclinat style={{ marginBottom: 14 }}>
        <b>{t('sesiune.salvat.titlu')}</b>
        <div className="mic">{t('sesiune.salvat.unde')}</div>
      </Sticker>
    );
  }

  return (
    <>
      <BigButton id="salveaza-plan" onClick={() => setDeschis(true)} style={{ marginBottom: 14 }}>
        {t('sesiune.salveazaPlan.buton')}
      </BigButton>
      <Modal deschis={deschis} onInchide={() => setDeschis(false)} titlu={t('sesiune.salveazaPlan.titlu')}>
        <p className="mic">{t('sesiune.salveazaPlan.explicatie')}</p>
        <label htmlFor="nume-plan">{t('sesiune.salveazaPlan.nume')}</label>
        <input id="nume-plan" value={nume} onChange={(e) => setNume(e.target.value)} />
        <div style={{ height: 12 }} />
        <BigButton varianta="accent" mare disabled={!nume.trim()} onClick={() => void salveaza()}>
          {t('sesiune.salveazaPlan.salveaza')}
        </BigButton>
      </Modal>
    </>
  );
}
