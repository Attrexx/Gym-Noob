/**
 * Demonstrații animate de execuție — omuleț „stick figure" în stil de
 * manual, animat cu SMIL (fără librării, merge offline).
 *
 * Fiecare exercițiu din catalog are un `anim` care se mapează pe una
 * dintre scenele de mai jos.
 */
import { useT } from '@/i18n';

const MAPARE: Record<string, string> = {
  mers: 'cardio', alergare: 'cardio', trepte: 'cardio', coarda: 'cardio', catarator: 'cardio',
  bicicleta: 'bicicleta', eliptica: 'bicicleta',
  vaslit: 'ramat',
  impins: 'impins', 'impins-culcat': 'culcat', fluturari: 'fluturari', 'fluturari-culcat': 'culcat',
  flotare: 'flotare', fondare: 'flotare', burpee: 'flotare',
  'tras-vertical': 'tras-vertical', 'tras-fata': 'ramat', ramat: 'ramat', 'ramat-aplecat': 'ramat',
  'presa-sus': 'presa-sus', lateral: 'lateral', frontal: 'lateral', invers: 'lateral',
  flexie: 'flexie', 'extensie-jos': 'extensie-jos', 'extensie-sus': 'presa-sus',
  genuflexiune: 'genuflexiune', fandare: 'genuflexiune', 'presa-picioare': 'presa-picioare',
  indreptare: 'indreptare', balans: 'indreptare', 'hip-thrust': 'hip-thrust', hiperextensie: 'hip-thrust',
  gambe: 'gambe', 'extensie-picior': 'extensie-picior', 'flexie-picior': 'extensie-picior', abductie: 'gambe',
  plank: 'plank', crunch: 'crunch', 'ridicare-genunchi': 'crunch', rasucire: 'crunch',
  'mers-greutati': 'cardio',
};

export function ExerciseAnim(props: { anim?: string; marime?: number }) {
  const { t } = useT();
  const scena = MAPARE[props.anim ?? ''] ?? 'impins';
  const s = props.marime ?? 160;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 120 120"
      role="img"
      aria-label={t('biblioteca.anim.aria')}
      style={{ background: 'var(--crem, #fff8e0)', border: '3px solid var(--contur)', borderRadius: 10 }}
    >
      <g stroke="var(--fg, #171310)" strokeWidth="5" strokeLinecap="round" fill="none">
        {SCENE[scena]}
      </g>
    </svg>
  );
}

const D = '2.4s';
const loop = { dur: D, repeatCount: 'indefinite' as const };

/** cap + trunchi vertical reutilizabil */
const CapTrunchi = ({ x = 60, y = 30 }: { x?: number; y?: number }) => (
  <>
    <circle cx={x} cy={y - 12} r="8" fill="var(--crem, #fff8e0)" />
    <line x1={x} y1={y - 4} x2={x} y2={y + 28} />
  </>
);

const SCENE: Record<string, React.ReactNode> = {
  // împins din așezat (chest press) — brațele se întind orizontal
  impins: (
    <>
      <line x1="40" y1="88" x2="80" y2="88" strokeWidth="3" opacity="0.35" />
      <CapTrunchi x={45} y={40} />
      <line x1="45" y1="68" x2="45" y2="100" />
      <line x1="45" y1="100" x2="62" y2="100" />
      <g>
        <line x1="45" y1="50" x2="70" y2="50">
          <animate attributeName="x2" values="58;84;58" keyTimes="0;0.5;1" {...loop} />
        </line>
        <line x1="70" y1="42" x2="70" y2="58" strokeWidth="4">
          <animate attributeName="x1" values="58;84;58" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="x2" values="58;84;58" keyTimes="0;0.5;1" {...loop} />
        </line>
      </g>
    </>
  ),
  // culcat pe bancă — bara urcă/coboară
  culcat: (
    <>
      <rect x="28" y="72" width="64" height="8" strokeWidth="3" fill="var(--crem,#fff8e0)" />
      <line x1="36" y1="80" x2="36" y2="96" strokeWidth="3" />
      <line x1="84" y1="80" x2="84" y2="96" strokeWidth="3" />
      <circle cx="34" cy="66" r="7" fill="var(--crem,#fff8e0)" />
      <line x1="42" y1="68" x2="74" y2="68" />
      <line x1="74" y1="68" x2="88" y2="60" />
      <line x1="55" y1="68" x2="55" y2="46">
        <animate attributeName="y2" values="58;36;58" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="40" y1="46" x2="70" y2="46" strokeWidth="6">
        <animate attributeName="y1" values="58;36;58" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="58;36;58" keyTimes="0;0.5;1" {...loop} />
      </line>
    </>
  ),
  // fluturări — brațele se deschid/închid în arc
  fluturari: (
    <>
      <CapTrunchi x={60} y={42} />
      <line x1="60" y1="70" x2="60" y2="98" />
      <line x1="60" y1="98" x2="48" y2="112" />
      <line x1="60" y1="98" x2="72" y2="112" />
      <g>
        <line x1="60" y1="52" x2="30" y2="52">
          <animate attributeName="x2" values="30;56;30" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="y2" values="52;40;52" keyTimes="0;0.5;1" {...loop} />
        </line>
        <line x1="60" y1="52" x2="90" y2="52">
          <animate attributeName="x2" values="90;64;90" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="y2" values="52;40;52" keyTimes="0;0.5;1" {...loop} />
        </line>
      </g>
    </>
  ),
  // flotare / fondare — corpul urcă și coboară
  flotare: (
    <g>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 10;0 0" keyTimes="0;0.5;1" {...loop} />
      <circle cx="26" cy="62" r="8" fill="var(--crem,#fff8e0)" />
      <line x1="33" y1="66" x2="86" y2="80" />
      <line x1="86" y1="80" x2="102" y2="94" />
      <line x1="44" y1="70" x2="44" y2="94">
        <animate attributeName="y1" values="70;76;70" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="20" y1="96" x2="108" y2="96" strokeWidth="3" opacity="0.35">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" keyTimes="0;0.5;1" {...loop} />
      </line>
    </g>
  ),
  // tracțiuni la helcometru — bara coboară spre piept
  'tras-vertical': (
    <>
      <CapTrunchi x={60} y={52} />
      <line x1="60" y1="80" x2="60" y2="100" />
      <line x1="60" y1="100" x2="45" y2="112" />
      <line x1="60" y1="100" x2="75" y2="112" />
      <line x1="34" y1="20" x2="86" y2="20" strokeWidth="6">
        <animate attributeName="y1" values="20;44;20" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="20;44;20" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="42" y1="24" x2="60" y2="60" strokeWidth="2" opacity="0.3" />
      <line x1="60" y1="60" x2="40" y2="24">
        <animate attributeName="x2" values="40;44;40" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="24;46;24" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="60" y1="60" x2="80" y2="24">
        <animate attributeName="x2" values="80;76;80" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="24;46;24" keyTimes="0;0.5;1" {...loop} />
      </line>
    </>
  ),
  // ramat — mânerul vine spre abdomen
  ramat: (
    <>
      <CapTrunchi x={44} y={46} />
      <line x1="44" y1="74" x2="44" y2="96" />
      <line x1="44" y1="96" x2="70" y2="96" />
      <line x1="44" y1="56" x2="86" y2="60">
        <animate attributeName="x2" values="86;56;86" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="86" y1="52" x2="86" y2="68" strokeWidth="4">
        <animate attributeName="x1" values="86;56;86" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="x2" values="86;56;86" keyTimes="0;0.5;1" {...loop} />
      </line>
    </>
  ),
  // presă deasupra capului
  'presa-sus': (
    <>
      <CapTrunchi x={60} y={52} />
      <line x1="60" y1="80" x2="60" y2="102" />
      <line x1="60" y1="102" x2="46" y2="114" />
      <line x1="60" y1="102" x2="74" y2="114" />
      <line x1="60" y1="58" x2="46" y2="34">
        <animate attributeName="y2" values="50;22;50" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="60" y1="58" x2="74" y2="34">
        <animate attributeName="y2" values="50;22;50" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="38" y1="34" x2="82" y2="34" strokeWidth="6">
        <animate attributeName="y1" values="50;22;50" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="50;22;50" keyTimes="0;0.5;1" {...loop} />
      </line>
    </>
  ),
  // ridicări laterale
  lateral: (
    <>
      <CapTrunchi x={60} y={48} />
      <line x1="60" y1="76" x2="60" y2="100" />
      <line x1="60" y1="100" x2="46" y2="114" />
      <line x1="60" y1="100" x2="74" y2="114" />
      <line x1="60" y1="56" x2="34" y2="76">
        <animate attributeName="x2" values="40;26;40" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="80;54;80" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="60" y1="56" x2="86" y2="76">
        <animate attributeName="x2" values="80;94;80" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="80;54;80" keyTimes="0;0.5;1" {...loop} />
      </line>
    </>
  ),
  // flexii biceps
  flexie: (
    <>
      <CapTrunchi x={60} y={46} />
      <line x1="60" y1="74" x2="60" y2="100" />
      <line x1="60" y1="100" x2="46" y2="114" />
      <line x1="60" y1="100" x2="74" y2="114" />
      <line x1="60" y1="54" x2="76" y2="70" />
      <line x1="76" y1="70" x2="88" y2="82">
        <animate attributeName="x2" values="88;74;88" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="82;52;82" keyTimes="0;0.5;1" {...loop} />
      </line>
      <circle cx="88" cy="84" r="5" fill="var(--fg,#171310)" strokeWidth="2">
        <animate attributeName="cx" values="88;74;88" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="cy" values="84;54;84" keyTimes="0;0.5;1" {...loop} />
      </circle>
    </>
  ),
  // extensii triceps la cablu
  'extensie-jos': (
    <>
      <line x1="88" y1="8" x2="88" y2="46" strokeWidth="2" opacity="0.4" />
      <CapTrunchi x={60} y={46} />
      <line x1="60" y1="74" x2="60" y2="100" />
      <line x1="60" y1="100" x2="46" y2="114" />
      <line x1="60" y1="100" x2="74" y2="114" />
      <line x1="60" y1="54" x2="76" y2="66" />
      <line x1="76" y1="66" x2="88" y2="52">
        <animate attributeName="x2" values="88;86;88" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="52;86;52" keyTimes="0;0.5;1" {...loop} />
      </line>
    </>
  ),
  // genuflexiune
  genuflexiune: (
    <>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 16;0 0" keyTimes="0;0.5;1" {...loop} />
        <circle cx="60" cy="26" r="8" fill="var(--crem,#fff8e0)" />
        <line x1="60" y1="34" x2="60" y2="62" />
        <line x1="60" y1="42" x2="42" y2="52" />
        <line x1="60" y1="42" x2="78" y2="52" />
      </g>
      <line x1="60" y1="62" x2="48" y2="86" strokeWidth="5">
        <animate attributeName="y1" values="62;78;62" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="x2" values="52;40;52" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="60" y1="62" x2="72" y2="86" strokeWidth="5">
        <animate attributeName="y1" values="62;78;62" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="x2" values="68;80;68" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="40" y1="110" x2="52" y2="86" />
      <line x1="80" y1="110" x2="68" y2="86" />
      <line x1="28" y1="112" x2="92" y2="112" strokeWidth="3" opacity="0.35" />
    </>
  ),
  // presa de picioare — platforma împinsă cu picioarele
  'presa-picioare': (
    <>
      <line x1="20" y1="100" x2="100" y2="100" strokeWidth="3" opacity="0.35" />
      <circle cx="28" cy="66" r="8" fill="var(--crem,#fff8e0)" />
      <line x1="34" y1="72" x2="52" y2="84" />
      <line x1="52" y1="84" x2="52" y2="98" />
      <line x1="52" y1="84" x2="74" y2="66">
        <animate attributeName="x2" values="68;84;68" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="72;56;72" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="78" y1="40" x2="96" y2="62" strokeWidth="7">
        <animateTransform attributeName="transform" type="translate" values="-8 8;8 -8;-8 8" keyTimes="0;0.5;1" {...loop} />
      </line>
    </>
  ),
  // îndreptare / balans — aplecare din șold
  indreptare: (
    <>
      <line x1="24" y1="112" x2="96" y2="112" strokeWidth="3" opacity="0.35" />
      <line x1="56" y1="112" x2="56" y2="76" />
      <g>
        <circle cx="56" cy="30" r="8" fill="var(--crem,#fff8e0)">
          <animate attributeName="cx" values="56;86;56" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="cy" values="30;56;30" keyTimes="0;0.5;1" {...loop} />
        </circle>
        <line x1="56" y1="76" x2="56" y2="38">
          <animate attributeName="x2" values="56;80;56" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="y2" values="38;58;38" keyTimes="0;0.5;1" {...loop} />
        </line>
        <line x1="56" y1="48" x2="50" y2="76" strokeWidth="4">
          <animate attributeName="x1" values="56;74;56" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="y1" values="48;62;48" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="x2" values="50;62;50" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="y2" values="76;92;76" keyTimes="0;0.5;1" {...loop} />
        </line>
        <line x1="38" y1="76" x2="62" y2="76" strokeWidth="6">
          <animate attributeName="x1" values="38;50;38" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="x2" values="62;74;62" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="y1" values="76;92;76" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="y2" values="76;92;76" keyTimes="0;0.5;1" {...loop} />
        </line>
      </g>
    </>
  ),
  // hip thrust — șoldurile urcă
  'hip-thrust': (
    <>
      <line x1="20" y1="108" x2="100" y2="108" strokeWidth="3" opacity="0.35" />
      <rect x="14" y="68" width="18" height="40" strokeWidth="3" fill="var(--crem,#fff8e0)" />
      <circle cx="34" cy="58" r="8" fill="var(--crem,#fff8e0)" />
      <line x1="40" y1="64" x2="66" y2="76">
        <animate attributeName="y2" values="86;68;86" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="66" y1="76" x2="80" y2="108">
        <animate attributeName="y1" values="86;68;86" keyTimes="0;0.5;1" {...loop} />
      </line>
      <circle cx="66" cy="72" r="6" fill="var(--fg,#171310)" strokeWidth="2">
        <animate attributeName="cy" values="82;64;82" keyTimes="0;0.5;1" {...loop} />
      </circle>
    </>
  ),
  // ridicări pe vârfuri
  gambe: (
    <g>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" keyTimes="0;0.5;1" {...loop} />
      <circle cx="60" cy="24" r="8" fill="var(--crem,#fff8e0)" />
      <line x1="60" y1="32" x2="60" y2="66" />
      <line x1="60" y1="42" x2="46" y2="58" />
      <line x1="60" y1="42" x2="74" y2="58" />
      <line x1="60" y1="66" x2="52" y2="96" />
      <line x1="60" y1="66" x2="68" y2="96" />
      <line x1="52" y1="96" x2="58" y2="104" strokeWidth="4" />
      <line x1="68" y1="96" x2="74" y2="104" strokeWidth="4" />
    </g>
  ),
  // extensii/flexii picior la aparat
  'extensie-picior': (
    <>
      <rect x="30" y="52" width="26" height="40" strokeWidth="3" fill="var(--crem,#fff8e0)" />
      <circle cx="44" cy="36" r="8" fill="var(--crem,#fff8e0)" />
      <line x1="44" y1="44" x2="44" y2="70" />
      <line x1="44" y1="70" x2="66" y2="80" />
      <line x1="66" y1="80" x2="72" y2="104">
        <animate attributeName="x2" values="72;92;72" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="104;80;104" keyTimes="0;0.5;1" {...loop} />
      </line>
    </>
  ),
  // planșa — statică, cu mic tremur
  plank: (
    <g>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 1.5;0 0" dur="0.9s" repeatCount="indefinite" />
      <circle cx="26" cy="66" r="8" fill="var(--crem,#fff8e0)" />
      <line x1="34" y1="70" x2="90" y2="78" />
      <line x1="90" y1="78" x2="104" y2="94" />
      <line x1="42" y1="72" x2="42" y2="94" />
      <line x1="36" y1="94" x2="50" y2="94" strokeWidth="4" />
      <line x1="18" y1="96" x2="110" y2="96" strokeWidth="3" opacity="0.35" />
    </g>
  ),
  // crunch
  crunch: (
    <>
      <line x1="16" y1="100" x2="106" y2="100" strokeWidth="3" opacity="0.35" />
      <line x1="70" y1="98" x2="82" y2="76" />
      <line x1="82" y1="76" x2="94" y2="98" />
      <g>
        <circle cx="34" cy="92" r="8" fill="var(--crem,#fff8e0)">
          <animate attributeName="cx" values="34;44;34" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="cy" values="92;74;92" keyTimes="0;0.5;1" {...loop} />
        </circle>
        <line x1="70" y1="98" x2="42" y2="94">
          <animate attributeName="x2" values="42;50;42" keyTimes="0;0.5;1" {...loop} />
          <animate attributeName="y2" values="94;80;94" keyTimes="0;0.5;1" {...loop} />
        </line>
      </g>
    </>
  ),
  // cardio — alergare
  cardio: (
    <>
      <line x1="16" y1="108" x2="104" y2="108" strokeWidth="3" opacity="0.35" />
      <circle cx="60" cy="26" r="8" fill="var(--crem,#fff8e0)" />
      <line x1="60" y1="34" x2="58" y2="64" />
      <line x1="59" y1="44" x2="44" y2="56">
        <animate attributeName="x2" values="44;74;44" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="56;52;56" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="59" y1="44" x2="76" y2="52">
        <animate attributeName="x2" values="76;46;76" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="52;56;52" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="58" y1="64" x2="44" y2="88">
        <animate attributeName="x2" values="44;72;44" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="44" y1="88" x2="40" y2="106">
        <animate attributeName="x1" values="44;72;44" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="x2" values="40;80;40" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="y2" values="106;96;106" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="58" y1="64" x2="74" y2="84">
        <animate attributeName="x2" values="74;46;74" keyTimes="0;0.5;1" {...loop} />
      </line>
      <line x1="74" y1="84" x2="82" y2="104">
        <animate attributeName="x1" values="74;46;74" keyTimes="0;0.5;1" {...loop} />
        <animate attributeName="x2" values="82;42;82" keyTimes="0;0.5;1" {...loop} />
      </line>
    </>
  ),
  // bicicletă
  bicicleta: (
    <>
      <circle cx="44" cy="92" r="14" strokeWidth="3" opacity="0.5" />
      <circle cx="60" cy="92" r="5" strokeWidth="3" />
      <circle cx="42" cy="46" r="8" fill="var(--crem,#fff8e0)" />
      <line x1="44" y1="53" x2="52" y2="74" />
      <line x1="46" y1="58" x2="66" y2="66" />
      <line x1="66" y1="66" x2="70" y2="74" strokeWidth="3" />
      <line x1="52" y1="74" x2="60" y2="92">
        <animate attributeName="x2" values="60;64;60;56;60" keyTimes="0;0.25;0.5;0.75;1" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="86;92;98;92;86" keyTimes="0;0.25;0.5;0.75;1" dur="1.2s" repeatCount="indefinite" />
      </line>
    </>
  ),
};
