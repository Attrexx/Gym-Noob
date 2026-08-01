import { BigButton, Sticker } from '@/design/components';
import { secundeActive, secundeTotale, useSession } from '@/state/sessionStore';
import { useLive } from '@/state/liveStore';
import { descrieAparat, EMOJI_APARAT } from '@/domain/ftms';
import { fmtDurata } from './useTick';

/**
 * Antetul care nu pleacă de pe ecran cât ești în sesiune.
 *
 * Cronometrul mare arată timpul de pe ceasul de perete — „de când am intrat
 * în sală" — pentru că asta e întrebarea pe care ți-o pui între seturi.
 * Împărțirea activ/pauză stă dedesubt, cu restul cifrelor.
 *
 * Caloriile includ și setul aflat în desfășurare (`kcalParial`): pe bandă,
 * altfel stăteau la zero 25 de minute și abia la final săreau.
 */
export function SumarHud(props: {
  numeCeas?: string | null;
  cautaCeas?: boolean;
  onConecteazaPuls: () => void;
  onStop: () => void;
}) {
  const s = useSession();
  const aparat = useLive((l) => l.aparat);
  const ultim = useLive((l) => l.ultim);
  const kcalParial = useLive((l) => l.kcalParial);

  const total = secundeTotale(s);
  const activ = secundeActive(s);
  const pauza = Math.max(0, total - activ);
  const kcal = Math.round(s.kcal + kcalParial);
  const telemetrie = aparat && ultim ? descrieAparat(aparat.tip, ultim) : '';

  return (
    <Sticker style={{ position: 'sticky', top: 8, zIndex: 20, padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="supratitlu-mic">la sală de</div>
          <div style={{ fontFamily: 'var(--font-titlu)', fontSize: '2rem', lineHeight: 1 }}>{fmtDurata(total)}</div>
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
        <BigButton varianta="pericol" onClick={props.onStop} ariaLabel="Oprește sesiunea">
          ⏹
        </BigButton>
      </div>

      {/* cifrele care contează, mereu la vedere */}
      <div
        data-testid="hud-cifre"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          marginTop: 10,
          borderTop: '2px solid var(--linie)',
          paddingTop: 8,
        }}
      >
        <Cifra emoji="🔥" valoare={`${kcal}`} unitate="kcal" />
        {props.numeCeas ? (
          <Cifra emoji="♥" valoare={s.hrUltim ? `${s.hrUltim}` : '—'} unitate="bpm" accent={!!s.hrUltim} />
        ) : (
          <button
            onClick={props.onConecteazaPuls}
            aria-label="Conectează ceasul cu puls"
            className={props.cautaCeas ? '' : 'tresarire'}
            style={{
              border: '2px solid var(--accent)',
              borderRadius: 'var(--raza)',
              background: 'var(--panou)',
              color: 'var(--panou-fg)',
              padding: '2px 4px',
              fontWeight: 800,
              fontSize: '0.72rem',
              lineHeight: 1.15,
              textTransform: 'uppercase',
            }}
          >
            {props.cautaCeas ? '♥ caut…' : '♥ conectează'}
          </button>
        )}
        <Cifra emoji="💧" valoare={`${s.apaMl}`} unitate="ml" />
        <Cifra emoji="⚡" valoare={fmtDurata(activ)} unitate={pauza > 0 ? `+${fmtDurata(pauza)} pauză` : 'activ'} />
      </div>

      {/* telemetria aparatului — bară inversată, ca pe un display de aparat */}
      {aparat && (
        <div
          data-testid="hud-aparat"
          style={{
            marginTop: 8,
            background: 'var(--contur)',
            color: 'var(--bg)',
            borderRadius: 'var(--raza)',
            padding: '6px 10px',
            fontFamily: 'var(--font-titlu)',
            fontSize: '0.82rem',
            letterSpacing: '0.02em',
            display: 'flex',
            gap: 8,
            alignItems: 'baseline',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{EMOJI_APARAT[aparat.tip]}</span>
          <span style={{ opacity: 0.75 }}>{aparat.model}</span>
          <span>{telemetrie || 'aștept date…'}</span>
        </div>
      )}

      {s.status === 'pauza' && (
        <p className="mic centrat" style={{ margin: '8px 0 0', fontWeight: 800 }}>
          ⏸ SESIUNE ÎN PAUZĂ — cronometrul de lucru stă pe loc
        </p>
      )}
    </Sticker>
  );
}

function Cifra(props: { emoji: string; valoare: string; unitate: string; accent?: boolean }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 0 }}>
      <div
        style={{
          fontFamily: 'var(--font-titlu)',
          fontSize: '1.05rem',
          lineHeight: 1.1,
          color: props.accent ? 'var(--accent)' : 'inherit',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {props.emoji} {props.valoare}
      </div>
      <div className="mic estompat" style={{ fontSize: '0.66rem', textTransform: 'uppercase', fontWeight: 800 }}>
        {props.unitate}
      </div>
    </div>
  );
}
