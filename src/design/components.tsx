import { type CSSProperties, type ReactNode } from 'react';
import './components.css';

/** Card „abțibild" cu contur gros și umbră dură, opțional ușor înclinat. */
export function Sticker(props: {
  children: ReactNode;
  inclinat?: boolean;
  accent?: boolean;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}) {
  const cls = ['sticker', props.inclinat ? 'sticker-inclinat' : '', props.accent ? 'sticker-accent' : '', props.className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={props.style} onClick={props.onClick} role={props.onClick ? 'button' : undefined}>
      {props.children}
    </div>
  );
}

/** Butonul mare al aplicației. */
export function BigButton(props: {
  children: ReactNode;
  onClick?: () => void;
  varianta?: 'accent' | 'normal' | 'contur' | 'pericol';
  disabled?: boolean;
  mare?: boolean;
  style?: CSSProperties;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}) {
  const cls = ['btn', `btn-${props.varianta ?? 'normal'}`, props.mare ? 'btn-mare' : ''].filter(Boolean).join(' ');
  return (
    <button
      type={props.type ?? 'button'}
      className={cls}
      onClick={props.onClick}
      disabled={props.disabled}
      style={props.style}
      aria-label={props.ariaLabel}
    >
      {props.children}
    </button>
  );
}

/** Titlu de secțiune în stilul copertei. */
export function SectionTitle(props: { supratitlu?: string; children: ReactNode; actiune?: ReactNode }) {
  return (
    <div className="titlu-sectiune">
      <div>
        {props.supratitlu && <div className="supratitlu-mic">{props.supratitlu}</div>}
        <h2>{props.children}</h2>
      </div>
      {props.actiune}
    </div>
  );
}

/** Casetă de statistică. */
export function StatTile(props: { valoare: ReactNode; eticheta: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`stat-tile ${props.accent ? 'stat-accent' : ''}`}>
      <div className="stat-valoare">{props.valoare}</div>
      <div className="stat-eticheta">{props.eticheta}</div>
      {props.sub && <div className="stat-sub">{props.sub}</div>}
    </div>
  );
}

/** Bară de progres cu contur. */
export function ProgressBar(props: { procent: number; eticheta?: string; culoare?: string }) {
  const p = Math.max(0, Math.min(100, props.procent));
  return (
    <div
      className="bara-progres"
      role="progressbar"
      aria-valuenow={Math.round(p)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={props.eticheta}
    >
      <div className="bara-umplere" style={{ width: `${p}%`, background: props.culoare }} />
      {props.eticheta && <span className="bara-text">{props.eticheta}</span>}
    </div>
  );
}

/** Dialog modal simplu. */
export function Modal(props: { deschis: boolean; onInchide: () => void; titlu?: string; children: ReactNode }) {
  if (!props.deschis) return null;
  return (
    <div className="modal-fundal" onClick={props.onInchide}>
      <div className="modal-corp pop" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={props.titlu}>
        <div className="modal-cap">
          {props.titlu && <h3 style={{ margin: 0 }}>{props.titlu}</h3>}
          <button className="modal-x" onClick={props.onInchide} aria-label="Închide">
            ✕
          </button>
        </div>
        {props.children}
      </div>
    </div>
  );
}

/** Stepper numeric cu butoane mari ± (pentru kg / repetări). */
export function Stepper(props: {
  valoare: number;
  onChange: (v: number) => void;
  pas?: number;
  min?: number;
  max?: number;
  unitate?: string;
  eticheta?: string;
}) {
  const pas = props.pas ?? 1;
  const min = props.min ?? 0;
  const max = props.max ?? 999;
  const set = (v: number) => props.onChange(Math.max(min, Math.min(max, Math.round(v * 100) / 100)));
  return (
    <div className="stepper">
      {props.eticheta && <div className="stepper-eticheta">{props.eticheta}</div>}
      <div className="stepper-rand">
        <button className="stepper-btn" onClick={() => set(props.valoare - pas)} aria-label={`Scade ${props.eticheta ?? ''}`}>
          −
        </button>
        <div className="stepper-valoare">
          {formatNr(props.valoare)}
          {props.unitate && <span className="stepper-unitate"> {props.unitate}</span>}
        </div>
        <button className="stepper-btn" onClick={() => set(props.valoare + pas)} aria-label={`Crește ${props.eticheta ?? ''}`}>
          +
        </button>
      </div>
    </div>
  );
}

export function formatNr(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1).replace('.', ',');
}
