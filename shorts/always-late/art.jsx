// art.jsx — scene illustrations for "Always Late?" (Buehler, Griffin & Ross · 1994). Pure functions of T.
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
const pop = (t, s, d = 0.45) => Easing.easeOutBack(clamp((t - s) / d, 0, 1));
const FONT = 'Montserrat, sans-serif';

function PlEye({ cx, cy, T, ph = 0, rx = 19, ry = 18, look = 0 }) {
  const b = blink(T, ph);
  return (<g><ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" /><circle cx={cx + look} cy={cy + 2} r={10 * Math.min(1, b * 1.6)} fill={INK} /></g>);
}

/* a person: head centred at (x, y), torso below */
function PlPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} /><circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <PlEye cx={-40} cy={4} T={T} ph={ph} look={look} /><PlEye cx={40} cy={4} T={T} ph={ph} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      {mouth === 'sad' && <path d="M-30 70 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" /><ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a rounded label pill */
function PlPill({ x, y, w = 360, fill = INK, ink = CREAM, text, size = 60 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y="-52" width={w} height="104" rx="52" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* a big counting number that pops in */
function PlBig({ x = 486, y = 1150, t, to, suffix = '', size = 260, fill = INK, s = 0.1, d = 1.0 }) {
  const n = Math.round(to * tw(t, s, d));
  return (<text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size * (0.85 + 0.15 * pop(t, s))} fill={fill}>{n}{suffix}</text>);
}

/* a speech bubble with text */
function PlBubble({ x, y, w = 420, h = 160, text, size = 52, fill = '#fff', ink = INK, tail = -1 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 4} l${tail * 50} 70 l${-tail * 10} -70 Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* floor shadow + ground line */
function PlGround({ y = 1600, fill = 'rgba(0,0,0,.18)' }) { return <ellipse cx="486" cy={y} rx="380" ry="40" fill={fill} />; }

/* shared — a clock face */
function PlClock({ x, y, r = 200, T, speed = 1, fill = '#fff' }) {
  const a = T * 360 * speed, b = T * 30 * speed;
  return (<g transform={`translate(${x} ${y})`}><circle r={r} fill={fill} stroke={INK} strokeWidth="14" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x="-5" y={-r + 16} width="10" height="26" rx="5" fill={INK} transform={`rotate(${i * 30})`} />)}
    <rect x="-7" y={-r * 0.75} width="14" height={r * 0.75} rx="7" fill={INK} transform={`rotate(${a})`} />
    <rect x="-9" y={-r * 0.5} width="18" height={r * 0.5} rx="9" fill="#B3202A" transform={`rotate(${b})`} />
    <circle r="16" fill={INK} /></g>);
}

/* 1 — a person runs, the clock spins */
function ArtPlClock({ T, t }) {
  return (
    <g>
      <PlClock x={486} y={980} T={T} speed={1.4} r={230} />
      <g transform={`translate(${486 + osc(T, 0.35) * 30} ${1300})`}>
        <PlPerson x={0} y={0} T={T} shirt="#1F3B73" mouth="o" s={0.6} brow={8} />
        {[0, 1, 2].map((k) => <line key={k} x1={-150 - k * 30} y1={60 + k * 50} x2={-260 - k * 30} y2={60 + k * 50} stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity={0.6} />)}
      </g>
    </g>
  );
}

/* 2 — a student writes "34 days" on a sticky note */
function ArtPlGuess({ T, t }) {
  return (
    <g>
      <PlPerson x={330} y={1120} T={T} shirt="#2B6E7A" mouth="smile" s={0.75} look={16} />
      <g transform={`translate(680 1060) rotate(${4 + osc(T, 2) * 2}) scale(${pop(t, 0.3)})`}>
        <rect x="-170" y="-150" width="340" height="300" fill="#E8C547" />
        <text y="10" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="120" fill={INK}>34</text>
        <text y="90" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="54" fill={INK}>days</text>
      </g>
      <rect x="160" y="1500" width="652" height="40" rx="12" fill="#6B4A2E" />
    </g>
  );
}

/* 3 — worst case 49 */
function ArtPlWorst({ T, t }) {
  return (
    <g>
      <g transform={`translate(486 1080) rotate(${osc(T, 0.2) * 2})`}>
        <path d="M0 -260 L270 210 L-270 210 Z" fill="#E8C547" stroke={INK} strokeWidth="14" strokeLinejoin="round" />
        <text y="150" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="230" fill={INK}>!</text>
      </g>
      <PlBig x={486} y={1600} t={t} to={49} suffix=" days" size={150} fill="#fff" />
    </g>
  );
}

/* 4 — actual 55, a bar that overshoots */
function ArtPlActual({ T, t }) {
  const bars = [[34, '#fff', 'guess'], [49, '#E8C547', 'worst'], [55, INK, 'real']];
  return (
    <g>
      {bars.map(([v, c, l], i) => {
        const h = v * 11 * tw(t, 0.15 * i, 0.8);
        return (<g key={i} transform={`translate(${246 + i * 240} 1560)`}>
          <rect x="-80" y={-h} width="160" height={h} rx="14" fill={c} />
          <text y={-h - 24} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#fff">{Math.round(v * tw(t, 0.15 * i, 0.8))}</text>
          <text y="70" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" fill="#fff">{l}</text>
        </g>);
      })}
    </g>
  );
}

/* 5 — only 3 of 10 make the finish line */
function ArtPlThird({ T, t }) {
  return (
    <g>
      <rect x="760" y="820" width="24" height="800" fill={INK} />
      {[0, 1, 2, 3].map((k) => <rect key={k} x="784" y={820 + k * 40} width="40" height="40" fill={k % 2 ? '#fff' : INK} />)}
      {Array.from({ length: 10 }).map((_, i) => {
        const made = i < 3;
        const p = tw(t, 0.1 + i * 0.05, 1.2) * (made ? 1 : 0.55 + hsh(i) * 0.25);
        return (<g key={i} transform={`translate(${140 + p * 560} ${880 + i * 72})`}>
          <circle r="26" fill={made ? '#2B6E7A' : 'rgba(20,24,33,.35)'} />
        </g>);
      })}
      <PlPill x={486} y={1660} w={300} text="30%" fill={INK} />
    </g>
  );
}

/* 6 — the dream plan: a straight line; reality: a scribble */
function ArtPlDream({ T, t }) {
  const p = tw(t, 0.2, 1.4);
  return (
    <g>
      <g transform="translate(486 1000)"><text y="-120" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="56" fill="#fff">the plan</text>
        <line x1="-300" y1="0" x2={-300 + 600 * p} y2="0" stroke="#E8C547" strokeWidth="18" strokeLinecap="round" /></g>
      <g transform="translate(486 1380)"><text y="-150" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="56" fill="#fff">real life</text>
        <path d="M-300 0 C-240 -120 -200 120 -140 0 S-40 -140 0 30 S80 140 120 -40 S220 -100 300 20" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round"
          strokeDasharray="1400" strokeDashoffset={1400 * (1 - p)} /></g>
    </g>
  );
}

/* 7 — last time's clock informs this time */
function ArtPlFix({ T, t }) {
  return (
    <g>
      <g opacity={0.55}><PlClock x={290} y={1100} T={T * 0.2} r={150} /></g>
      <text x="290" y="1340" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill="#fff">last time</text>
      <path d={`M420 1100 L${500 + 40 * tw(t, 0.3, 0.6)} 1100`} stroke="#E8C547" strokeWidth="20" strokeLinecap="round" />
      <path d="M520 1060 l40 40 l-40 40" fill="none" stroke="#E8C547" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <PlClock x={720} y={1100} T={T * 0.2} r={150} />
      <text x="720" y="1340" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill="#fff">this time</text>
      <PlPill x={486} y={1580} w={420} text="+ buffer" fill="#E8C547" ink={INK} />
    </g>
  );
}

Object.assign(window, { ArtPlActual, ArtPlClock, ArtPlDream, ArtPlFix, ArtPlGuess, ArtPlThird, ArtPlWorst });
