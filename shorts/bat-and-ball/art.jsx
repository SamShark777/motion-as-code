// art.jsx — scene illustrations for "Bat & Ball" (Frederick 2005 · Cognitive Reflection Test). Pure functions of T.
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
const pop = (t, s, d = 0.45) => Easing.easeOutBack(clamp((t - s) / d, 0, 1));
const FONT = 'Montserrat, sans-serif';

function BbEye({ cx, cy, T, ph = 0, rx = 19, ry = 18, look = 0 }) {
  const b = blink(T, ph);
  return (<g><ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" /><circle cx={cx + look} cy={cy + 2} r={10 * Math.min(1, b * 1.6)} fill={INK} /></g>);
}

/* a person: head centred at (x, y), torso below */
function BbPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} /><circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <BbEye cx={-40} cy={4} T={T} ph={ph} look={look} /><BbEye cx={40} cy={4} T={T} ph={ph} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      {mouth === 'sad' && <path d="M-30 70 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" /><ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a rounded label pill */
function BbPill({ x, y, w = 360, fill = INK, ink = CREAM, text, size = 60 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y="-52" width={w} height="104" rx="52" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* a big counting number that pops in */
function BbBig({ x = 486, y = 1150, t, to, suffix = '', size = 260, fill = INK, s = 0.1, d = 1.0 }) {
  const n = Math.round(to * tw(t, s, d));
  return (<text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size * (0.85 + 0.15 * pop(t, s))} fill={fill}>{n}{suffix}</text>);
}

/* a speech bubble with text */
function BbBubble({ x, y, w = 420, h = 160, text, size = 52, fill = '#fff', ink = INK, tail = -1 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 4} l${tail * 50} 70 l${-tail * 10} -70 Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* floor shadow + ground line */
function BbGround({ y = 1600, fill = 'rgba(0,0,0,.18)' }) { return <ellipse cx="486" cy={y} rx="380" ry="40" fill={fill} />; }

/* shared — a baseball bat and a ball */
function BbBat({ x, y, r = -30, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}><path d="M-260 -12 L180 -46 C230 -48 250 -20 250 0 C250 20 230 48 180 46 L-260 12 Z" fill="#C98A62" stroke={INK} strokeWidth="6" /><rect x="-300" y="-16" width="50" height="32" rx="8" fill={INK} /></g>);
}
function BbBall({ x, y, r = 70, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`}><circle r={r} fill="#fff" stroke={INK} strokeWidth="6" /><path d={`M${-r * 0.6} ${-r * 0.75} C${-r * 0.2} ${-r * 0.3} ${-r * 0.2} ${r * 0.3} ${-r * 0.6} ${r * 0.75} M${r * 0.6} ${-r * 0.75} C${r * 0.2} ${-r * 0.3} ${r * 0.2} ${r * 0.3} ${r * 0.6} ${r * 0.75}`} fill="none" stroke="#B3202A" strokeWidth="6" strokeDasharray="10 8" /></g>);
}
function BbTag({ x, y, text, fill = '#E8C547', s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-120 -50 L90 -50 L130 0 L90 50 L-120 50 Z" fill={fill} stroke={INK} strokeWidth="6" /><circle cx="90" cy="0" r="10" fill={INK} />
    <text x="-14" y="18" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="52" fill={INK}>{text}</text></g>);
}

/* 1 — bat + ball with a $1.10 tag */
function ArtBbTitle({ T, t }) {
  return (<g>
    <BbBat x={420} y={1150} r={-25 + osc(T, 2) * 3} />
    <BbBall x={720} y={1350 + Math.abs(osc(T, 0.7)) * -40} />
    <BbTag x={486} y={1560} text="$1.10" s={pop(t, 0.3)} />
  </g>);
}

/* 2 — bat tag says "ball + $1" */
function ArtBbMore({ T, t }) {
  return (<g>
    <BbBat x={486} y={980} r={-8} s={1.1} />
    <BbBall x={486} y={1330} r={90} rot={T * 30} />
    <g transform={`translate(486 1530) scale(${pop(t, 0.3)})`}><rect x="-230" y="-50" width="460" height="100" rx="50" fill={INK} /><text y="18" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="52" fill="#E8C547">bat = ball + $1</text></g>
  </g>);
}

/* 3 — a 3-second countdown */
function ArtBbTimer({ T, t }) {
  const left = Math.max(0, 3 - Math.floor(t));
  const p = t % 1;
  return (<g>
    <circle cx="486" cy="1150" r="300" fill="#fff" />
    <path d={`M486 850 A300 300 0 ${p > 0.5 ? 1 : 0} 1 ${486 + 300 * Math.sin(p * TAU)} ${1150 - 300 * Math.cos(p * TAU)}`} fill="none" stroke="#E8C547" strokeWidth="40" />
    <text x="486" y="1240" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="260" fill={INK}>{left || '?'}</text>
  </g>);
}

/* 4 — 10¢ + $1.10 = $1.20 ✗ */
function ArtBbTen({ T, t }) {
  return (<g>
    <BbTag x={300} y={900} text="10¢" fill="#fff" />
    <BbTag x={680} y={900} text="$1.10" fill="#fff" />
    <text x="486" y="925" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="80" fill={INK}>+</text>
    <g transform={`translate(486 1240) scale(${pop(t, 0.6)})`}><text textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="200" fill="#B3202A">$1.20</text></g>
    <g transform={`translate(486 1180) scale(${pop(t, 1.0)})`} opacity={0.9}><path d="M-260 -160 L260 120 M260 -160 L-260 120" stroke="#B3202A" strokeWidth="30" strokeLinecap="round" /></g>
  </g>);
}

/* 5 — the right answer: 5¢ + $1.05 */
function ArtBbFive({ T, t }) {
  return (<g>
    <BbBall x={300} y={1000} r={90} rot={T * 40} /><BbBat x={720} y={1000} r={-60} s={0.7} />
    <BbTag x={300} y={1220} text="5¢" s={pop(t, 0.2)} /><BbTag x={700} y={1220} text="$1.05" s={pop(t, 0.4)} />
    <g transform={`translate(486 1490) scale(${pop(t, 0.7)})`}><circle r="90" fill="#8FD18B" /><path d="M-40 0 l28 30 l52 -60" fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" /></g>
  </g>);
}

/* 6 — a hare (fast brain) races ahead of a tortoise (slow brain) */
function ArtBbFast({ T, t }) {
  const x = 200 + ((T * 0.35) % 1) * 600;
  return (<g>
    <rect x="0" y="1460" width="972" height="20" fill="rgba(255,255,255,.3)" />
    <g transform={`translate(${x} ${1380 + Math.abs(osc(T, 0.3)) * -40})`}><ellipse rx="70" ry="44" fill="#E9E4D8" /><circle cx="64" cy="-30" r="34" fill="#E9E4D8" /><ellipse cx="60" cy="-90" rx="12" ry="40" fill="#E9E4D8" /><ellipse cx="84" cy="-86" rx="12" ry="40" fill="#E9E4D8" /><circle cx="76" cy="-34" r="6" fill={INK} /></g>
    <g transform="translate(240 1420)"><ellipse rx="90" ry="56" fill="#8FD18B" stroke={INK} strokeWidth="6" /><circle cx="-100" cy="10" r="30" fill="#8FD18B" stroke={INK} strokeWidth="6" /></g>
    <BbPill x={300} y={1000} w={260} text="fast" fill="#E8C547" ink={INK} /><BbPill x={680} y={1000} w={260} text="slow" fill={INK} />
    <text x="486" y="1220" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="70" fill="#fff">50%+ said 10¢</text>
  </g>);
}

/* 7 — a comment bubble with 5¢ */
function ArtBbScore({ T, t }) {
  return (<g>
    <g transform={`translate(486 ${1100 + osc(T, 2) * 10}) scale(${pop(t, 0.2)})`}><BbBubble x={0} y={0} w={520} h={200} text="5¢ ✅" size={100} tail={-1} /></g>
    <BbPerson x={300} y={1400} T={T} shirt="#E8C547" mouth="smile" s={0.55} look={10} />
    <BbPerson x={680} y={1400} T={T} ph={0.4} shirt="#E07A2E" mouth="o" s={0.55} look={-10} />
  </g>);
}

Object.assign(window, { ArtBbFast, ArtBbFive, ArtBbMore, ArtBbScore, ArtBbTen, ArtBbTimer, ArtBbTitle });
