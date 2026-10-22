// art.jsx — scene illustrations for "The Coffee Spill" (Aronson, Willerman & Floyd · 1966). Pure functions of T.
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
const pop = (t, s, d = 0.45) => Easing.easeOutBack(clamp((t - s) / d, 0, 1));
const FONT = 'Montserrat, sans-serif';

function PfEye({ cx, cy, T, ph = 0, rx = 19, ry = 18, look = 0 }) {
  const b = blink(T, ph);
  return (<g><ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" /><circle cx={cx + look} cy={cy + 2} r={10 * Math.min(1, b * 1.6)} fill={INK} /></g>);
}

/* a person: head centred at (x, y), torso below */
function PfPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} /><circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <PfEye cx={-40} cy={4} T={T} ph={ph} look={look} /><PfEye cx={40} cy={4} T={T} ph={ph} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      {mouth === 'sad' && <path d="M-30 70 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" /><ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a rounded label pill */
function PfPill({ x, y, w = 360, fill = INK, ink = CREAM, text, size = 60 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y="-52" width={w} height="104" rx="52" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* a big counting number that pops in */
function PfBig({ x = 486, y = 1150, t, to, suffix = '', size = 260, fill = INK, s = 0.1, d = 1.0 }) {
  const n = Math.round(to * tw(t, s, d));
  return (<text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size * (0.85 + 0.15 * pop(t, s))} fill={fill}>{n}{suffix}</text>);
}

/* a speech bubble with text */
function PfBubble({ x, y, w = 420, h = 160, text, size = 52, fill = '#fff', ink = INK, tail = -1 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 4} l${tail * 50} 70 l${-tail * 10} -70 Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* floor shadow + ground line */
function PfGround({ y = 1600, fill = 'rgba(0,0,0,.18)' }) { return <ellipse cx="486" cy={y} rx="380" ry="40" fill={fill} />; }

/* shared — a coffee cup */
function PfCup({ x, y, r = 0, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}><path d="M-60 -80 h120 l-14 160 h-92 Z" fill="#fff" stroke={INK} strokeWidth="8" />
    <path d="M60 -40 c50 0 50 70 0 70" fill="none" stroke={INK} strokeWidth="10" /><rect x="-62" y="-90" width="124" height="20" rx="8" fill="#6B4A2E" /></g>);
}

/* 1 — a cup tips, a person grins sheepishly */
function ArtPfSpill({ T, t }) {
  const r = 70 * tw(t, 0.3, 0.5);
  return (<g>
    <PfPerson x={420} y={1080} T={T} shirt="#E9E4D8" mouth="o" s={0.85} look={20} brow={6} />
    <PfCup x={700} y={1260} r={r} />
    <ellipse cx="760" cy={1430} rx={140 * tw(t, 0.6, 0.6)} ry={30 * tw(t, 0.6, 0.6)} fill="#6B4A2E" />
  </g>);
}

/* 2 — quiz scoreboard climbs to 92% */
function ArtPfQuiz({ T, t }) {
  return (<g>
    <rect x="186" y="860" width="600" height="420" rx="30" fill={INK} />
    <PfBig x={486} y={1140} t={t} to={92} suffix="%" size={200} fill="#E8C547" s={0.1} d={1.4} />
    <text x="486" y="1230" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" fill="#fff">correct</text>
    {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={230 + i * 102} cy={1340} r="20" fill={osc(T, 0.6, i * 0.15) > 0 ? '#E8C547' : '#B3202A'} />)}
    <PfPerson x={486} y={1500} T={T} shirt="#1F3B73" mouth="smile" s={0.45} />
  </g>);
}

/* 3 — coffee all over his shirt */
function ArtPfOops({ T, t }) {
  return (<g>
    <PfPerson x={486} y={1080} T={T} shirt="#fff" mouth="o" brow={10} />
    <path d="M420 1380 c20 -40 60 -10 80 -40 c30 30 70 0 60 60 c40 30 -10 80 -60 70 c-40 40 -100 0 -90 -40 c-40 -10 -20 -50 10 -50 Z" fill="#6B4A2E" transform={`scale(${1}) `} opacity={tw(t, 0.2, 0.4)} />
    <PfCup x={720} y={1560} r={110} s={0.8} />
  </g>);
}

/* 4 — likability meter goes up */
function ArtPfMore({ T, t }) {
  const v = 0.6 + 0.35 * tw(t, 0.2, 1.0);
  return (<g>
    <rect x="386" y="840" width="200" height="720" rx="100" fill="#fff" stroke={INK} strokeWidth="10" />
    <rect x="406" y={860 + 680 * (1 - v)} width="160" height={680 * v} rx="80" fill="#2B6E7A" />
    {[0, 1, 2].map((k) => { const p = ((T * 0.7 + k / 3) % 1); return <text key={k} x={680 + k * 50} y={1400 - p * 400} fontSize="70" opacity={1 - p}>❤️</text>; })}
    <path d="M250 1300 L250 1000 M200 1060 L250 1000 L300 1060" fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
  </g>);
}

/* 5 — the average contestant: meter drops */
function ArtPfLess({ T, t }) {
  const v = 0.5 - 0.3 * tw(t, 0.3, 1.0);
  return (<g>
    <rect x="386" y="840" width="200" height="720" rx="100" fill="#fff" stroke={INK} strokeWidth="10" />
    <rect x="406" y={860 + 680 * (1 - v)} width="160" height={680 * v} rx="80" fill="#B3202A" />
    <path d="M250 1000 L250 1300 M200 1240 L250 1300 L300 1240" fill="none" stroke="#fff" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
    <PfPill x={486} y={1570} w={360} text="average" fill="#fff" ink={INK} />
  </g>);
}

/* 6 — a statue turns into a waving person */
function ArtPfHuman({ T, t }) {
  const p = tw(t, 0.2, 0.9);
  return (<g>
    <rect x="300" y="1440" width="372" height="120" rx="12" fill="#C9C2B2" />
    <g opacity={1 - p}><PfPerson x={486} y={1060} T={0} shirt="#C9C2B2" hair="#A9A293" skin="#D9D3C4" mouth="flat" s={0.85} /></g>
    <g opacity={p}><PfPerson x={486} y={1060} T={T} shirt="#E8C547" mouth="smile" s={0.85} /></g>
  </g>);
}

/* 7 — a small flaw badge worn proudly */
function ArtPfFlaws({ T, t }) {
  return (<g>
    <PfPerson x={486} y={1060} T={T} shirt="#1F3B73" mouth="smile" />
    <g transform={`translate(560 1420) rotate(${-8 + osc(T, 1.5) * 4}) scale(${pop(t, 0.3)})`}><circle r="80" fill="#E8C547" stroke={INK} strokeWidth="8" /><text y="16" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill={INK}>oops ☕</text></g>
  </g>);
}

Object.assign(window, { ArtPfFlaws, ArtPfHuman, ArtPfLess, ArtPfMore, ArtPfOops, ArtPfQuiz, ArtPfSpill });
