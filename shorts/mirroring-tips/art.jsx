// art.jsx — scene illustrations for "Say It Back" (van Baaren et al. · 2003). Pure functions of T.
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
const pop = (t, s, d = 0.45) => Easing.easeOutBack(clamp((t - s) / d, 0, 1));
const FONT = 'Montserrat, sans-serif';

function MiEye({ cx, cy, T, ph = 0, rx = 19, ry = 18, look = 0 }) {
  const b = blink(T, ph);
  return (<g><ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" /><circle cx={cx + look} cy={cy + 2} r={10 * Math.min(1, b * 1.6)} fill={INK} /></g>);
}

/* a person: head centred at (x, y), torso below */
function MiPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} /><circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <MiEye cx={-40} cy={4} T={T} ph={ph} look={look} /><MiEye cx={40} cy={4} T={T} ph={ph} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      {mouth === 'sad' && <path d="M-30 70 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" /><ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a rounded label pill */
function MiPill({ x, y, w = 360, fill = INK, ink = CREAM, text, size = 60 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y="-52" width={w} height="104" rx="52" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* a big counting number that pops in */
function MiBig({ x = 486, y = 1150, t, to, suffix = '', size = 260, fill = INK, s = 0.1, d = 1.0 }) {
  const n = Math.round(to * tw(t, s, d));
  return (<text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size * (0.85 + 0.15 * pop(t, s))} fill={fill}>{n}{suffix}</text>);
}

/* a speech bubble with text */
function MiBubble({ x, y, w = 420, h = 160, text, size = 52, fill = '#fff', ink = INK, tail = -1 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 4} l${tail * 50} 70 l${-tail * 10} -70 Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* floor shadow + ground line */
function MiGround({ y = 1600, fill = 'rgba(0,0,0,.18)' }) { return <ellipse cx="486" cy={y} rx="380" ry="40" fill={fill} />; }

/* shared — a waitress with a notepad */
function MiWaiter({ x, y, T, s = 1, mouth = 'smile' }) {
  return (<g>
    <MiPerson x={x} y={y} T={T} shirt="#141821" hair="#6B4A2E" mouth={mouth} s={s} />
    <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-60 250 L60 250 L80 600 L-80 600 Z" fill="#fff" /><rect x="110" y="300" width="110" height="140" rx="10" fill="#fff" stroke={INK} strokeWidth="6" />
      {[0, 1, 2].map((k) => <line key={k} x1="130" y1={340 + k * 30} x2="200" y2={340 + k * 30} stroke="#C9C2B2" strokeWidth="8" />)}</g>
  </g>);
}
function MiCoins({ x, y, n, T }) {
  return (<g>{Array.from({ length: n }).map((_, i) => <g key={i} transform={`translate(${x + (i % 4) * 70 - 105} ${y - Math.floor(i / 4) * 26})`}><ellipse rx="34" ry="14" fill="#C9A13B" /><ellipse cy="-6" rx="34" ry="14" fill="#E8C547" stroke="#C9A13B" strokeWidth="3" /></g>)}</g>);
}

/* 1 — a tray with a tip jar filling up */
function ArtMiTray({ T, t }) {
  return (<g>
    <MiWaiter x={330} y={1050} T={T} s={0.7} />
    <g transform="translate(700 1450)"><path d="M-110 -260 L110 -260 L95 40 L-95 40 Z" fill="rgba(255,255,255,.35)" stroke="#fff" strokeWidth="8" />
      <text y="-280" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill="#fff">TIPS</text>
      <MiCoins x={0} y={20} n={Math.round(12 * tw(t, 0.3, 1.5))} T={T} /></g>
  </g>);
}

/* 2 — "Coming right up!" */
function ArtMiComing({ T, t }) {
  return (<g>
    <MiWaiter x={360} y={1060} T={T} s={0.75} />
    <g transform={`translate(640 860) scale(${pop(t, 0.2)})`}><MiBubble x={0} y={0} w={420} h={150} text="Coming right up!" size={42} tail={-1} /></g>
    <MiPerson x={760} y={1250} T={T} ph={0.3} shirt="#2B6E7A" mouth="flat" s={0.5} look={-10} />
  </g>);
}

/* 3 — the order echoes back word for word */
function ArtMiRepeat({ T, t }) {
  return (<g>
    <MiPerson x={260} y={1150} T={T} shirt="#E07A2E" mouth="smile" s={0.6} look={10} />
    <MiWaiter x={720} y={1150} T={T} s={0.6} mouth="o" />
    <g transform={`translate(260 850) scale(${pop(t, 0.1)})`}><MiBubble x={0} y={0} w={300} h={110} text="pasta, please" size={36} tail={1} /></g>
    <g transform={`translate(720 850) scale(${pop(t, 0.6)})`}><MiBubble x={0} y={0} w={300} h={110} text="pasta, please" size={36} tail={-1} fill="#E8C547" /></g>
  </g>);
}

/* 4 — two tip jars, one nearly double */
function ArtMiTips({ T, t }) {
  return (<g>
    {[[300, 5, '"coming up"'], [680, 10, 'word for word']].map(([x, n, l], i) => (
      <g key={i} transform={`translate(${x} 1420)`}>
        <path d="M-110 -320 L110 -320 L95 40 L-95 40 Z" fill="rgba(255,255,255,.5)" stroke={INK} strokeWidth="8" />
        <MiCoins x={0} y={20} n={Math.round(n * tw(t, 0.2 + i * 0.3, 1.2))} T={T} />
        <text y="130" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={INK}>{l}</text>
      </g>
    ))}
    <MiPill x={486} y={830} w={300} text="× 2" fill={INK} />
  </g>);
}

/* 5 — two people nodding together */
function ArtMiUnderstood({ T, t }) {
  const nod = osc(T, 0.9) * 6;
  return (<g>
    <g transform={`rotate(${nod} 300 1100)`}><MiPerson x={300} y={1100} T={T} shirt="#E8C547" mouth="smile" s={0.7} look={14} /></g>
    <g transform={`rotate(${-nod} 680 1100)`}><MiPerson x={680} y={1100} T={T} ph={0.5} shirt="#2B6E7A" mouth="smile" s={0.7} look={-14} /></g>
    <text x="486" y="860" textAnchor="middle" fontSize="120">❤️</text>
  </g>);
}

/* 6 — a person and their mirrored reflection */
function ArtMiMirror({ T, t }) {
  const sway = osc(T, 2) * 20;
  return (<g>
    <line x1="486" y1="760" x2="486" y2="1560" stroke="#fff" strokeWidth="8" strokeDasharray="20 16" />
    <g transform={`translate(${-sway} 0)`}><MiPerson x={290} y={1130} T={T} shirt="#E07A2E" mouth="smile" s={0.7} look={12} /></g>
    <g transform={`translate(972 0) scale(-1 1) translate(${-sway} 0)`} opacity={0.85}><MiPerson x={290} y={1130} T={T} shirt="#E07A2E" mouth="smile" s={0.7} look={12} /></g>
  </g>);
}

/* 7 — speech bubbles: their words, echoed */
function ArtMiTry({ T, t }) {
  return (<g>
    <MiPerson x={486} y={1180} T={T} shirt="#E8C547" mouth="smile" s={0.8} />
    <g transform={`translate(300 860) scale(${pop(t, 0.2)})`}><MiBubble x={0} y={0} w={300} h={110} text="their words" size={40} tail={1} /></g>
    <g transform={`translate(690 920) scale(${pop(t, 0.6)})`}><MiBubble x={0} y={0} w={300} h={110} text="↩ back" size={44} tail={-1} fill="#E8C547" /></g>
  </g>);
}

Object.assign(window, { ArtMiComing, ArtMiMirror, ArtMiRepeat, ArtMiTips, ArtMiTray, ArtMiTry, ArtMiUnderstood });
