import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import confetti from 'canvas-confetti';
import { db } from '@/data/db';
import { useProfile } from '@/state/profileStore';
import { secundeActive, setGreutateCurenta, useSession } from '@/state/sessionStore';
import { BigButton, Modal, ProgressBar, StatTile, Sticker, Stepper, formatNr } from '@/design/components';
import { Flexu, FlexuSpune } from '@/design/Flexu';
import { getExercise } from '@/data/catalog/exercises';
import type { Template, TemplateItem } from '@/data/types';
import { fmtDurata, useTick } from './useTick';
import { Metronom, sunete, vibreaza } from '@/services/audio';
import { spune } from '@/services/tts';
import { elibereazaEcranul, reactiveazaLaRevenire, tineEcranAprins } from '@/services/wakeLock';
import { aleator, INCURAJARI_FINAL, INCURAJARI_SET } from '@/data/catalog/tips';
import { PR_LABEL, type PrHit } from '@/domain/pr';
import { suggestNext, type Suggestion } from '@/domain/suggestions';
import { verificaRealizari } from '@/services/achievementService';
import { ACHIEVEMENTS } from '@/domain/achievements';
import { bleDisponibil, conecteazaPuls, type HrConnection } from '@/services/bleHeartRate';
import { latestMetric, sessionsDesc, setLogsForSession } from '@/data/repo';

interface Sumar {
  durataSec: number;
  kcal: number;
  apaMl: number;
  seturi: number;
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
  const { profil } = useProfile();
  const loc = useLocation();
  const porneste = useSession((st) => st.porneste);
  const [alesId, setAlesId] = useState<number | 'liber' | null>((loc.state as { templateId?: number })?.templateId ?? null);

  const sabloane = useLiveQuery(
    async () => (profil?.id ? db.templates.where({ profileId: profil.id }).toArray() : []),
    [profil?.id],
  );

  useEffect(() => {
    if (profil?.id) void latestMetric(profil.id).then((m) => m && setGreutateCurenta(m.greutate));
  }, [profil?.id]);

  const start = async () => {
    if (!profil || alesId === null) return;
    let plan: TemplateItem[] = [];
    let opts: { templateId?: number; templateNume?: string } = {};
    if (alesId !== 'liber') {
      const t = (sabloane ?? []).find((x) => x.id === alesId);
      if (t) {
        plan = t.items.map((i) => ({ ...i }));
        opts = { templateId: t.id, templateNume: t.nume };
      }
    }
    await porneste(profil, plan, opts);
    sunete.start();
    void tineEcranAprins();
  };

  return (
    <div className="pagina">
      <div className="coperta">
        <div className="supratitlu">e ora de sală</div>
        <h1>Începe sesiunea</h1>
      </div>
      <FlexuSpune poza="flex">
        Alege un plan sau pornește o <b>sesiune liberă</b> și adaugi exercițiile pe parcurs. Cronometrul, apa și
        caloriile — le țin eu socoteala.
      </FlexuSpune>

      {(sabloane ?? []).map((t: Template) => (
        <Sticker
          key={t.id}
          onClick={() => setAlesId(t.id!)}
          style={alesId === t.id ? { outline: '4px solid var(--accent)' } : undefined}
        >
          <b>{t.nume}</b> {t.predefinit && <span className="eticheta-mica">de la Flexu</span>}
          <div className="mic estompat">{t.items.length} exerciții</div>
        </Sticker>
      ))}
      <Sticker onClick={() => setAlesId('liber')} style={alesId === 'liber' ? { outline: '4px solid var(--accent)' } : undefined}>
        <b>Sesiune liberă</b>
        <div className="mic estompat">fără plan — adaugi exercițiile din mers</div>
      </Sticker>

      <BigButton varianta="accent" mare disabled={alesId === null} onClick={() => void start()}>
        ▶ START
      </BigButton>
    </div>
  );
}

// ─────────────────────────── ECRANUL LIVE ───────────────────────────

function LiveScreen(props: { onSumar: (s: Sumar) => void }) {
  const s = useSession();
  const { profil, setari } = useProfile();
  const nav = useNavigate();
  useTick(1000);

  const [prCelebration, setPrCelebration] = useState<PrHit[] | null>(null);
  const [sugestii, setSugestii] = useState<Suggestion[] | null>(null);
  const [confirmStop, setConfirmStop] = useState(false);
  const [hrCon, setHrCon] = useState<HrConnection | null>(null);
  const ultimulSetLa = useRef(Date.now());
  const [sugestieAuto, setSugestieAuto] = useState<Suggestion | null>(null);

  const sec = secundeActive(s);
  const restRamas = s.restEndsMs ? Math.ceil((s.restEndsMs - Date.now()) / 1000) : null;

  // wake lock pe durata sesiunii
  useEffect(() => {
    void tineEcranAprins();
    reactiveazaLaRevenire(() => useSession.getState().status !== 'inactiva');
    return () => elibereazaEcranul();
  }, []);

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
      if (setari?.vocale) spune('Pauza s-a terminat. Următorul set!');
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
    const { EXERCITII } = await import('@/data/catalog/exercises');
    return suggestNext({
      catalog: EXERCITII,
      seturiAzi,
      inPlan: s.plan.map((i) => i.exerciseId),
      grupeRecente: [...grupeRecente] as never[],
      minuteScurse: sec / 60,
    });
  }, [profil?.id, s.sessionId, s.plan, sec]);

  const dupaSet = async (planIdx: number, date: { repetari?: number; greutate?: number; durataSec?: number; rpe?: number }) => {
    if (!profil) return;
    const prs = await s.logSet(profil, planIdx, date);
    ultimulSetLa.current = Date.now();
    if (setari?.sunete) sunete.set();
    if (prs.length > 0) {
      setPrCelebration(prs);
      if (setari?.sunete) sunete.record();
      if (setari?.vibratii) vibreaza([100, 50, 100, 50, 300]);
      if (setari?.vocale) spune('Record personal! Felicitări!');
      void confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
    } else if (setari?.vocale) {
      spune(aleator(INCURAJARI_SET));
    }
    const item = s.plan[planIdx];
    if (item && item.pauzaSec > 0) s.startRest(item.pauzaSec);
  };

  const opresteSesiunea = async (abandon: boolean) => {
    try {
      hrCon?.deconecteaza();
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
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const item = s.plan[s.exIndex];

  return (
    <div className="pagina">
      {/* ── antet cu cronometru și comenzi ── */}
      <Sticker style={{ position: 'sticky', top: 8, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-titlu)', fontSize: '2rem', lineHeight: 1 }}>{fmtDurata(sec)}</div>
            <div className="mic estompat">
              {Math.round(s.kcal)} kcal · {s.apaMl} ml apă
              {s.hrUltim ? ` · ♥ ${s.hrUltim} bpm` : ''}
            </div>
          </div>
          {s.status === 'activa' ? (
            <BigButton onClick={() => void s.pauza()} ariaLabel="Pauză">
              ⏸ Pauză
            </BigButton>
          ) : (
            <BigButton varianta="accent" onClick={() => void s.reia()} ariaLabel="Reia">
              ▶ Reia
            </BigButton>
          )}
          <BigButton varianta="pericol" onClick={() => setConfirmStop(true)} ariaLabel="Oprește sesiunea">
            ⏹
          </BigButton>
        </div>
        {s.status === 'pauza' && (
          <p className="mic centrat" style={{ margin: '8px 0 0', fontWeight: 800 }}>
            ⏸ SESIUNE ÎN PAUZĂ — cronometrul stă pe loc
          </p>
        )}
      </Sticker>

      {/* ── pauza dintre seturi ── */}
      {restRamas !== null && restRamas > 0 && (
        <Sticker accent className="pop">
          <div className="centrat">
            <div className="supratitlu-mic" style={{ color: 'inherit' }}>
              pauză între seturi
            </div>
            <div style={{ fontFamily: 'var(--font-titlu)', fontSize: '3rem', lineHeight: 1.1 }}>{fmtDurata(restRamas)}</div>
            <ProgressBar procent={(1 - restRamas / s.restTotalSec) * 100} />
            <div className="rand" style={{ marginTop: 10 }}>
              <BigButton onClick={() => s.startRest(restRamas + 30)}>+30s</BigButton>
              <BigButton onClick={() => s.stopRest()}>Sar peste</BigButton>
            </div>
          </div>
        </Sticker>
      )}

      {/* ── sugestie automată ── */}
      {sugestieAuto && (
        <Sticker className="pop">
          <FlexuSpune poza="ganditor" marime={60}>
            {sugestieAuto.motiv} Ce zici de <b>{sugestieAuto.exercise.nume}</b>?
          </FlexuSpune>
          <div className="rand">
            <BigButton
              varianta="accent"
              onClick={() => {
                s.adaugaInPlan(itemDinExercitiu(sugestieAuto.exercise.id));
                setSugestieAuto(null);
              }}
            >
              Adaugă
            </BigButton>
            <BigButton varianta="contur" onClick={() => setSugestieAuto(null)}>
              Nu acum
            </BigButton>
          </div>
        </Sticker>
      )}

      {/* ── exercițiul curent ── */}
      {item ? (
        <ExercitiuCurent key={s.exIndex} planIdx={s.exIndex} onSet={dupaSet} />
      ) : (
        <FlexuSpune poza="explica">
          Plan gol — adaugă un exercițiu cu butonul de mai jos sau cere-mi o sugestie!
        </FlexuSpune>
      )}

      {/* ── planul sesiunii ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16 }}>
        <h2 style={{ margin: 0 }}>Planul de azi</h2>
        <button
          onClick={() => void construiesteSugestii().then(setSugestii)}
          style={{ background: 'none', border: 'none', fontWeight: 800, textDecoration: 'underline', color: 'inherit', fontSize: '0.85rem' }}
        >
          💡 Ce urmează?
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
                <b>{gata ? '✅ ' : ''}{ex.nume}</b>
                <div className="mic estompat">
                  {s.seturiFacute[idx]}/{it.seturi} seturi
                  {ex.masura === 'repetari' ? ` · ${it.repetari} rep. @ ${formatNr(it.greutate ?? 0)} kg` : ` · ${Math.round((it.durataSec ?? 0) / 60)} min`}
                </div>
              </div>
              {s.seturiFacute[idx] === 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    s.scoateDinPlan(idx);
                  }}
                  aria-label={`Scoate ${ex.nume} din plan`}
                  style={{ background: 'none', border: 'none', fontSize: '1.1rem', color: 'inherit' }}
                >
                  ✕
                </button>
              )}
            </div>
          </Sticker>
        );
      })}
      <BigButton mare onClick={() => void construiesteSugestii().then(setSugestii)}>
        + Adaugă exercițiu
      </BigButton>

      {/* ── apă ── */}
      <h2 style={{ marginTop: 18 }}>💧 Apă</h2>
      <Sticker>
        <ProgressBar
          procent={(s.apaMl / (profil?.tintaApaSesiune ?? 700)) * 100}
          eticheta={`${s.apaMl} / ${profil?.tintaApaSesiune ?? 700} ml`}
          culoare="#1565C0"
        />
        <div className="rand" style={{ marginTop: 10 }}>
          {[150, 250, 500].map((ml) => (
            <BigButton key={ml} onClick={() => void s.bea(ml)}>
              +{ml} ml
            </BigButton>
          ))}
        </div>
      </Sticker>

      {/* ── puls ── */}
      {bleDisponibil && (
        <Sticker>
          {hrCon ? (
            <div className="rand">
              <span>
                ♥ <b>{s.hrUltim ?? '—'} bpm</b> <span className="mic estompat">({hrCon.deviceName})</span>
              </span>
              <BigButton varianta="contur" onClick={() => { hrCon.deconecteaza(); setHrCon(null); }}>
                Deconectează
              </BigButton>
            </div>
          ) : (
            <>
              <div className="rand">
                <span className="mic">Ceas cu difuzare de puls (ex. Huawei GT4)?</span>
                <BigButton onClick={() => void conectezCeasul()}>♥ Conectează</BigButton>
              </div>
              <p className="mic estompat" style={{ margin: '6px 0 0' }}>
                Pe ceas: pornește un antrenament și activează „Difuzare ritm cardiac", apoi apasă Conectează.
              </p>
            </>
          )}
        </Sticker>
      )}

      {/* ── modale ── */}
      <Modal deschis={!!sugestii} onInchide={() => setSugestii(null)} titlu="Flexu propune">
        {(sugestii ?? []).map((sg) => (
          <Sticker key={sg.exercise.id}>
            <b>{sg.exercise.nume}</b>
            <p className="mic" style={{ margin: '4px 0 8px' }}>
              {sg.motiv}
            </p>
            <BigButton
              varianta="accent"
              onClick={() => {
                s.adaugaInPlan(itemDinExercitiu(sg.exercise.id));
                setSugestii(null);
              }}
            >
              Adaugă în plan
            </BigButton>
          </Sticker>
        ))}
        {sugestii && sugestii.length === 0 && <p>Nu am idei noi acum — ai acoperit tot ce trebuia azi! 💪</p>}
      </Modal>

      <Modal deschis={!!prCelebration} onInchide={() => setPrCelebration(null)} titlu="🏆 RECORD PERSONAL!">
        <div className="centrat">
          <Flexu poza="sarbatoreste" marime={110} />
          {(prCelebration ?? []).map((pr) => (
            <p key={pr.tip} style={{ fontWeight: 800 }}>
              {PR_LABEL[pr.tip]}: <b>{formatNr(pr.valoare)}</b>
              {pr.valoareVeche ? <span className="estompat mic"> (vechiul record: {formatNr(pr.valoareVeche)})</span> : null}
            </p>
          ))}
          <BigButton varianta="accent" mare onClick={() => setPrCelebration(null)}>
            Mergem mai departe! 🚀
          </BigButton>
        </div>
      </Modal>

      <Modal deschis={confirmStop} onInchide={() => setConfirmStop(false)} titlu="Închei sesiunea?">
        <p>
          Ai {fmtDurata(sec)} de antrenament activ și {s.seturiFacute.reduce((a, b) => a + b, 0)} seturi înregistrate.
        </p>
        <div style={{ display: 'grid', gap: 10 }}>
          <BigButton varianta="accent" mare onClick={() => void opresteSesiunea(false)}>
            ✅ Da, închei — salvează tot
          </BigButton>
          <BigButton onClick={() => setConfirmStop(false)}>Nu, mă întorc la treabă</BigButton>
          <BigButton varianta="pericol" onClick={() => { if (confirm('Sigur? Sesiunea va fi marcată ca abandonată.')) void opresteSesiunea(true); }}>
            Abandonez sesiunea
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
  return folosite.length ? folosite.map((d) => formatNr(d)).join(' + ') + ' kg' : 'nimic';
}

function itemDinExercitiu(exerciseId: string): TemplateItem {
  const ex = getExercise(exerciseId)!;
  return ex.masura === 'timp'
    ? { exerciseId, seturi: 1, durataSec: 300, pauzaSec: 60 }
    : { exerciseId, seturi: 3, repetari: 10, greutate: 10, pauzaSec: 90 };
}

// ─────────────────────── CARDUL EXERCIȚIULUI CURENT ───────────────────────

function ExercitiuCurent(props: {
  planIdx: number;
  onSet: (planIdx: number, date: { repetari?: number; greutate?: number; durataSec?: number; rpe?: number }) => Promise<void>;
}) {
  const s = useSession();
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

  useEffect(() => () => metronomRef.current?.stop(), []);

  const cronoSec = cronoActiv ? Math.floor((Date.now() - cronoStart.current) / 1000) : crono;
  const gata = s.seturiFacute[props.planIdx] >= item.seturi;

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
          cum se face? →
        </a>
      </div>
      <div className="mic estompat" style={{ marginBottom: 10 }}>
        Setul {Math.min(s.seturiFacute[props.planIdx] + 1, item.seturi)} din {item.seturi} · {ex.echipamentNume}
      </div>

      {gata ? (
        <FlexuSpune poza="sarbatoreste" marime={64}>
          Toate seturile bifate la exercițiul ăsta! Alege următorul din plan. 💪
        </FlexuSpune>
      ) : ex.masura === 'repetari' ? (
        <>
          <div className="rand" style={{ alignItems: 'flex-start' }}>
            <Stepper eticheta="Greutate" valoare={greutate} pas={2.5} unitate="kg" onChange={setGreutate} max={500} />
            <Stepper eticheta="Repetări" valoare={repetari} pas={1} onChange={setRepetari} min={1} max={100} />
          </div>
          <div style={{ margin: '10px 0' }}>
            <div className="stepper-eticheta" style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
              Cât de greu a fost? (RPE {rpe})
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              aria-label="Efort perceput"
              style={{ width: '100%' }}
            />
            <div className="rand mic estompat" style={{ justifyContent: 'space-between' }}>
              <span>lejer</span>
              <span>maxim</span>
            </div>
          </div>
          {item.tempo && (
            <div className="rand" style={{ marginBottom: 10 }}>
              <BigButton varianta={metronomActiv ? 'accent' : 'contur'} onClick={toggleMetronom}>
                🎵 Tempo {item.tempo} {metronomActiv && fazaTempo ? `— ${fazaTempo}` : ''}
              </BigButton>
            </div>
          )}
          {ex.echipament === 'haltera' && greutate > 20 && (
            <p className="mic estompat centrat" style={{ margin: '0 0 10px' }}>
              🏋️ {formatNr(greutate)} kg = bara (20 kg) + <b>{discuriPeParte(greutate)}</b> pe fiecare parte
            </p>
          )}
          <BigButton varianta="accent" mare onClick={() => void props.onSet(props.planIdx, { repetari, greutate, rpe })}>
            ✔ Am terminat setul
          </BigButton>
        </>
      ) : (
        <>
          <div className="centrat" style={{ margin: '8px 0' }}>
            <div style={{ fontFamily: 'var(--font-titlu)', fontSize: '3rem' }}>{fmtDurata(cronoSec)}</div>
            <div className="mic estompat">țintă: {fmtDurata(item.durataSec ?? 300)}</div>
          </div>
          <div className="rand">
            {!cronoActiv ? (
              <BigButton
                varianta="accent"
                onClick={() => {
                  cronoStart.current = Date.now() - crono * 1000;
                  setCronoActiv(true);
                }}
              >
                ▶ {crono > 0 ? 'Continuă' : 'Pornește'}
              </BigButton>
            ) : (
              <BigButton
                onClick={() => {
                  setCrono(Math.floor((Date.now() - cronoStart.current) / 1000));
                  setCronoActiv(false);
                }}
              >
                ⏸ Oprește
              </BigButton>
            )}
            <BigButton varianta="contur" onClick={() => { setCrono(0); setCronoActiv(false); }}>
              ↺ Reset
            </BigButton>
          </div>
          <div style={{ margin: '10px 0' }}>
            <input
              type="range"
              min={1}
              max={10}
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              aria-label="Efort perceput"
              style={{ width: '100%' }}
            />
            <div className="rand mic estompat" style={{ justifyContent: 'space-between' }}>
              <span>lejer</span>
              <span>maxim (RPE {rpe})</span>
            </div>
          </div>
          <BigButton
            varianta="accent"
            mare
            disabled={cronoSec === 0}
            onClick={() => {
              setCronoActiv(false);
              void props.onSet(props.planIdx, { durataSec: cronoSec, rpe }).then(() => setCrono(0));
            }}
          >
            ✔ Am terminat ({fmtDurata(cronoSec)})
          </BigButton>
        </>
      )}
    </Sticker>
  );
}

// ─────────────────────────── REZUMATUL FINAL ───────────────────────────

function SummaryScreen(props: { sumar: Sumar }) {
  const nav = useNavigate();
  const { sumar } = props;
  return (
    <div className="pagina pop">
      <div className="coperta centrat">
        <div className="supratitlu">sesiune încheiată</div>
        <h1>BRAVO! 🎉</h1>
        <Flexu poza="sarbatoreste" marime={130} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <StatTile valoare={fmtDurata(sumar.durataSec)} eticheta="timp activ" />
        <StatTile valoare={sumar.kcal} eticheta="kcal arse" accent />
        <StatTile valoare={sumar.seturi} eticheta="seturi" />
        <StatTile valoare={`${sumar.apaMl} ml`} eticheta="apă băută" />
      </div>
      {sumar.realizariNoi.length > 0 && (
        <>
          <h2>Realizări deblocate!</h2>
          {sumar.realizariNoi.map((id) => {
            const a = ACHIEVEMENTS.find((x) => x.id === id);
            return a ? (
              <Sticker key={id} accent inclinat>
                <b style={{ fontSize: '1.1rem' }}>
                  {a.emoji} {a.nume}
                </b>
                <div className="mic">{a.descriere}</div>
              </Sticker>
            ) : null;
          })}
        </>
      )}
      <FlexuSpune poza="obosit">{aleator(INCURAJARI_FINAL)}</FlexuSpune>
      <BigButton varianta="accent" mare onClick={() => nav('/')}>
        Acasă
      </BigButton>
    </div>
  );
}
