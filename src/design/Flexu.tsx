/**
 * Flexu — mascota aplicației. Un noob simpatic cu bandană roșie,
 * desenat în stilul ghidurilor din anii '90. Fiecare „poză" schimbă
 * brațele, gura și recuzita.
 */
export type FlexuPose =
  | 'salut'
  | 'explica'
  | 'sarbatoreste'
  | 'avertizeaza'
  | 'obosit'
  | 'hidratare'
  | 'flex'
  | 'ganditor';

export function Flexu(props: { poza?: FlexuPose; marime?: number }) {
  const poza = props.poza ?? 'salut';
  const s = props.marime ?? 110;
  const negru = 'var(--fg, #171310)';
  const piele = '#F8C89A';
  const rosu = '#D0342C';
  const alb = '#FFFDF5';

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Flexu — ${poza}`}
      style={{ flexShrink: 0, overflow: 'visible' }}
    >
      <g stroke={negru} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* corp — maiou alb */}
        <path d={`M42 74 L42 108 L78 108 L78 74 Q60 66 42 74 Z`} fill={alb} />
        {/* umeri/brațe în funcție de poză */}
        {arms(poza, piele, alb, rosu)}
        {/* gât + cap */}
        <rect x="53" y="58" width="14" height="10" fill={piele} />
        <circle cx="60" cy="38" r="24" fill={piele} />
        {/* bandană */}
        <path d="M38 30 Q60 18 82 30 L82 38 Q60 27 38 38 Z" fill={rosu} />
        <path d="M82 32 l10 -6 l-3 10" fill={rosu} />
        {/* față */}
        {face(poza, negru)}
      </g>
      {/* accesorii fără contur comun */}
      {extras(poza, negru, rosu)}
    </svg>
  );
}

function face(poza: FlexuPose, negru: string) {
  const ochiNormali = (
    <>
      <circle cx="52" cy="38" r="2.6" fill={negru} stroke="none" />
      <circle cx="68" cy="38" r="2.6" fill={negru} stroke="none" />
    </>
  );
  switch (poza) {
    case 'sarbatoreste':
      return (
        <>
          <path d="M49 37 q3 -4 6 0" fill="none" />
          <path d="M65 37 q3 -4 6 0" fill="none" />
          <path d="M50 46 q10 9 20 0" fill="none" />
        </>
      );
    case 'obosit':
      return (
        <>
          <path d="M49 39 h6" fill="none" />
          <path d="M65 39 h6" fill="none" />
          <path d="M53 50 q7 -3 14 0" fill="none" />
          <circle cx="78" cy="26" r="2.4" fill="#7EC8E3" stroke={negru} strokeWidth="1.5" />
        </>
      );
    case 'avertizeaza':
      return (
        <>
          {ochiNormali}
          <path d="M47 32 l8 2" fill="none" />
          <path d="M73 32 l-8 2" fill="none" />
          <path d="M53 49 h14" fill="none" />
        </>
      );
    case 'ganditor':
      return (
        <>
          {ochiNormali}
          <path d="M54 49 q6 3 12 -1" fill="none" />
        </>
      );
    default:
      return (
        <>
          {ochiNormali}
          <path d="M52 47 q8 6 16 0" fill="none" />
        </>
      );
  }
}

function arms(poza: FlexuPose, piele: string, _alb: string, _rosu: string) {
  switch (poza) {
    case 'salut':
      return (
        <>
          {/* stânga jos, dreapta sus flutură */}
          <path d="M42 78 Q30 84 28 96" fill="none" strokeWidth="7" stroke={piele} />
          <path d="M78 78 Q92 70 96 56" fill="none" strokeWidth="7" stroke={piele} />
          <circle cx="97" cy="53" r="5.5" fill={piele} />
          <circle cx="27" cy="98" r="5.5" fill={piele} />
        </>
      );
    case 'explica':
      return (
        <>
          <path d="M42 78 Q30 84 28 96" fill="none" strokeWidth="7" stroke={piele} />
          <path d="M78 78 Q94 76 102 68" fill="none" strokeWidth="7" stroke={piele} />
          <circle cx="104" cy="66" r="5.5" fill={piele} />
          <circle cx="27" cy="98" r="5.5" fill={piele} />
        </>
      );
    case 'sarbatoreste':
      return (
        <>
          <path d="M42 76 Q28 66 24 50" fill="none" strokeWidth="7" stroke={piele} />
          <path d="M78 76 Q92 66 96 50" fill="none" strokeWidth="7" stroke={piele} />
          <circle cx="23" cy="47" r="5.5" fill={piele} />
          <circle cx="97" cy="47" r="5.5" fill={piele} />
        </>
      );
    case 'avertizeaza':
      return (
        <>
          <path d="M42 78 Q30 84 28 96" fill="none" strokeWidth="7" stroke={piele} />
          <path d="M78 76 Q90 66 92 54" fill="none" strokeWidth="7" stroke={piele} />
          <path d="M92 54 l1 -9" strokeWidth="4.5" stroke={piele} fill="none" />
          <circle cx="27" cy="98" r="5.5" fill={piele} />
        </>
      );
    case 'obosit':
      return (
        <>
          <path d="M42 78 Q34 92 34 102" fill="none" strokeWidth="7" stroke={piele} />
          <path d="M78 78 Q86 92 86 102" fill="none" strokeWidth="7" stroke={piele} />
          <circle cx="34" cy="104" r="5.5" fill={piele} />
          <circle cx="86" cy="104" r="5.5" fill={piele} />
        </>
      );
    case 'hidratare':
      return (
        <>
          <path d="M42 78 Q30 84 28 96" fill="none" strokeWidth="7" stroke={piele} />
          <path d="M78 76 Q90 62 84 48" fill="none" strokeWidth="7" stroke={piele} />
          <circle cx="83" cy="46" r="5.5" fill={piele} />
          <circle cx="27" cy="98" r="5.5" fill={piele} />
        </>
      );
    case 'flex':
      return (
        <>
          <path d="M42 76 Q26 74 22 60 Q20 52 26 50" fill="none" strokeWidth="8" stroke={piele} />
          <path d="M78 76 Q94 74 98 60 Q100 52 94 50" fill="none" strokeWidth="8" stroke={piele} />
          <circle cx="26" cy="48" r="6" fill={piele} />
          <circle cx="94" cy="48" r="6" fill={piele} />
        </>
      );
    case 'ganditor':
      return (
        <>
          <path d="M42 78 Q30 84 28 96" fill="none" strokeWidth="7" stroke={piele} />
          <path d="M78 78 Q84 70 74 60" fill="none" strokeWidth="7" stroke={piele} />
          <circle cx="72" cy="58" r="5.5" fill={piele} />
          <circle cx="27" cy="98" r="5.5" fill={piele} />
        </>
      );
  }
}

function extras(poza: FlexuPose, negru: string, rosu: string) {
  switch (poza) {
    case 'hidratare':
      return (
        <g stroke={negru} strokeWidth="2.5" strokeLinejoin="round">
          <rect x="76" y="26" width="13" height="22" rx="3" fill="#7EC8E3" />
          <rect x="79" y="21" width="7" height="6" rx="1.5" fill={rosu} />
        </g>
      );
    case 'sarbatoreste':
      return (
        <g fill={rosu} stroke="none">
          <circle cx="14" cy="30" r="3" />
          <circle cx="106" cy="30" r="3" fill="#1565C0" />
          <rect x="18" y="12" width="6" height="6" transform="rotate(20 21 15)" fill="#2E7D32" />
          <rect x="96" y="10" width="6" height="6" transform="rotate(-15 99 13)" />
        </g>
      );
    case 'ganditor':
      return (
        <g fill="none" stroke={negru} strokeWidth="2">
          <circle cx="96" cy="20" r="2" />
          <circle cx="103" cy="12" r="3" />
        </g>
      );
    default:
      return null;
  }
}

/** Bulă de dialog a lui Flexu. */
export function FlexuSpune(props: { poza?: FlexuPose; children: React.ReactNode; marime?: number }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', margin: '10px 0 14px' }}>
      <Flexu poza={props.poza} marime={props.marime ?? 84} />
      <div
        style={{
          border: 'var(--grosime) solid var(--contur)',
          background: 'var(--panou)',
          color: 'var(--panou-fg)',
          borderRadius: 'var(--raza)',
          boxShadow: 'var(--umbra-mica)',
          padding: '10px 12px',
          fontSize: '0.95rem',
          position: 'relative',
          flex: 1,
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: -11,
            top: 22,
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '11px solid var(--contur)',
          }}
        />
        {props.children}
      </div>
    </div>
  );
}
