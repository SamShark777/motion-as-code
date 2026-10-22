// art.jsx — scene illustrations for "The 5-Minute Sigh" (Balban et al. · Cell Reports Medicine 2023). Pure functions of T.
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
const pop = (t, s, d = 0.45) => Easing.easeOutBack(clamp((t - s) / d, 0, 1));
const FONT = 'Montserrat, sans-serif';

function CsEye({ cx, cy, T, ph = 0, rx = 19, ry = 18, look = 0 }) {
  const b = blink(T, ph);
  return (<g><ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" /><circle cx={cx + look} cy={cy + 2} r={10 * Math.min(1, b * 1.6)} fill={INK} /></g>);
}

/* a person: head centred at (x, y), torso below */
function CsPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} /><circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <CsEye cx={-40} cy={4} T={T} ph={ph} look={look} /><CsEye cx={40} cy={4} T={T} ph={ph} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      {mouth === 'sad' && <path d="M-30 70 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" /><ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a rounded label pill */
function CsPill({ x, y, w = 360, fill = INK, ink = CREAM, text, size = 60 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y="-52" width={w} height="104" rx="52" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* a big counting number that pops in */
function CsBig({ x = 486, y = 1150, t, to, suffix = '', size = 260, fill = INK, s = 0.1, d = 1.0 }) {
  const n = Math.round(to * tw(t, s, d));
  return (<text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size * (0.85 + 0.15 * pop(t, s))} fill={fill}>{n}{suffix}</text>);
}

/* a speech bubble with text */
function CsBubble({ x, y, w = 420, h = 160, text, size = 52, fill = '#fff', ink = INK, tail = -1 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 4} l${tail * 50} 70 l${-tail * 10} -70 Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* floor shadow + ground line */
function CsGround({ y = 1600, fill = 'rgba(0,0,0,.18)' }) { return <ellipse cx="486" cy={y} rx="380" ry="40" fill={fill} />; }

/* shared — a pair of lungs that inflate with v (0..1) */
function CsLungsShape({ x = 486, y = 1200, v = 0.5, fill = '#F2A7B5' }) {
  const s = 0.8 + 0.3 * v;
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-14" y="-260" width="28" height="160" rx="14" fill="#E9E4D8" />
    <path d="M-14 -110 C-40 -80 -60 -60 -70 -40" stroke="#E9E4D8" strokeWidth="20" fill="none" strokeLinecap="round" />
    <path d="M14 -110 C40 -80 60 -60 70 -40" stroke="#E9E4D8" strokeWidth="20" fill="none" strokeLinecap="round" />
    <path d="M-30 -60 C-120 -150 -260 -40 -230 140 C-210 260 -80 260 -40 200 C-20 140 -20 0 -30 -60 Z" fill={fill} />
    <path d="M30 -60 C120 -150 260 -40 230 140 C210 260 80 260 40 200 C20 140 20 0 30 -60 Z" fill={fill} />
  </g>);
}

/* 1 — lungs breathing, a little trophy */
function ArtCsLungs({ T, t }) {
  return (
    <g>
      <CsLungsShape v={0.5 + 0.5 * osc(T, 4)} />
      <g transform={`translate(760 880) scale(${pop(t, 0.4)})`}><path d="M-60 -60 h120 v40 c0 60 -40 80 -60 80 c-20 0 -60 -20 -60 -80 Z" fill="#E8C547" /><rect x="-14" y="60" width="28" height="40" fill="#E8C547" /><rect x="-50" y="100" width="100" height="24" rx="8" fill="#E8C547" /></g>
      <CsPill x={486} y={1570} w={300} text="5 min" fill="#fff" ink={INK} />
    </g>
  );
}

/* 2 — slow inhale */
function ArtCsIn({ T, t }) {
  const v = tw(t, 0.1, 2.4) * 0.75;
  return (<g><CsLungsShape v={v} />
    {[0, 1, 2].map((k) => { const p = ((T * 0.5 + k / 3) % 1); return <path key={k} d={`M${300 + k * 180} ${760 + p * 200} q30 40 0 80`} fill="none" stroke="#6FA8C9" strokeWidth="12" strokeLinecap="round" opacity={1 - p} />; })}
    <CsPill x={486} y={1570} w={340} text="IN…" fill={INK} /></g>);
}

/* 3 — the second top-up inhale */
function ArtCsTop({ T, t }) {
  const v = 0.75 + 0.25 * pop(t, 0.3);
  return (<g><CsLungsShape v={v} />
    <g transform={`translate(780 880) scale(${pop(t, 0.3)})`}><circle r="70" fill={INK} /><text y="28" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="80" fill="#E8C547">+1</text></g>
    <CsPill x={486} y={1570} w={340} text="+ in" fill={INK} /></g>);
}

/* 4 — the long exhale */
function ArtCsOut({ T, t }) {
  const v = 1 - tw(t, 0.1, 2.8);
  return (<g><CsLungsShape v={v} />
    {[0, 1, 2, 3].map((k) => { const p = ((T * 0.35 + k / 4) % 1); return <path key={k} d={`M${486 - 200 + p * 40} ${820 - p * 60} q${200} ${-40} ${400} 0`} fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" opacity={(1 - p) * 0.8} />; })}
    <CsPill x={486} y={1570} w={420} text="OUT……" fill="#fff" ink={INK} /></g>);
}

/* 5 — a month of check marks */
function ArtCsMonth({ T, t }) {
  const shown = Math.round(28 * tw(t, 0.2, 1.6));
  return (<g>
    <rect x="186" y="880" width="600" height="600" rx="30" fill="#fff" />
    {Array.from({ length: 28 }).map((_, i) => { const c = i % 7, r = Math.floor(i / 7); return (<g key={i}><rect x={216 + c * 80} y={920 + r * 130} width="62" height="100" rx="10" fill="#F1ECE0" />
      {i < shown && <path d={`M${230 + c * 80} ${972 + r * 130} l14 16 l24 -34`} fill="none" stroke="#2B6E7A" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />}</g>); })}
    <CsPill x={486} y={1570} w={360} text="5 min/day" fill={INK} /></g>);
}

/* 6 — two mood bars: both up, sighing higher */
function ArtCsWin({ T, t }) {
  const bars = [['meditate', 0.55, '#fff'], ['sigh', 0.85, '#E8C547']];
  return (<g>
    {bars.map(([l, v, c], i) => { const h = 560 * v * tw(t, 0.2 + i * 0.2, 1.0); return (<g key={i} transform={`translate(${320 + i * 330} 1540)`}>
      <rect x="-100" y={-h} width="200" height={h} rx="16" fill={c} />
      <text y="70" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="48" fill="#fff">{l}</text>
      <text y={-h - 30} textAnchor="middle" fontSize="80">{i ? '😊' : '🙂'}</text></g>); })}
  </g>);
}

/* 7 — two calm breaths, a smiling person */
function ArtCsTry({ T, t }) {
  return (<g><CsPerson x={486} y={1100} T={T} shirt="#E8C547" mouth="smile" s={0.95} />
    <g transform={`translate(486 1540) scale(${1 + 0.05 * osc(T, 4)})`}><CsPill x={0} y={0} w={420} text="× 2  NOW" fill={INK} /></g></g>);
}

Object.assign(window, { ArtCsIn, ArtCsLungs, ArtCsMonth, ArtCsOut, ArtCsTop, ArtCsTry, ArtCsWin });
