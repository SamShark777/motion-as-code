// art.jsx — scene illustrations for "Tetris Dreams" (Stickgold et al. · Science 2000). Pure functions of T.
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
const pop = (t, s, d = 0.45) => Easing.easeOutBack(clamp((t - s) / d, 0, 1));
const FONT = 'Montserrat, sans-serif';

function TeEye({ cx, cy, T, ph = 0, rx = 19, ry = 18, look = 0 }) {
  const b = blink(T, ph);
  return (<g><ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" /><circle cx={cx + look} cy={cy + 2} r={10 * Math.min(1, b * 1.6)} fill={INK} /></g>);
}

/* a person: head centred at (x, y), torso below */
function TePerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} /><circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <TeEye cx={-40} cy={4} T={T} ph={ph} look={look} /><TeEye cx={40} cy={4} T={T} ph={ph} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      {mouth === 'sad' && <path d="M-30 70 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" /><ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a rounded label pill */
function TePill({ x, y, w = 360, fill = INK, ink = CREAM, text, size = 60 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y="-52" width={w} height="104" rx="52" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* a big counting number that pops in */
function TeBig({ x = 486, y = 1150, t, to, suffix = '', size = 260, fill = INK, s = 0.1, d = 1.0 }) {
  const n = Math.round(to * tw(t, s, d));
  return (<text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size * (0.85 + 0.15 * pop(t, s))} fill={fill}>{n}{suffix}</text>);
}

/* a speech bubble with text */
function TeBubble({ x, y, w = 420, h = 160, text, size = 52, fill = '#fff', ink = INK, tail = -1 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 4} l${tail * 50} 70 l${-tail * 10} -70 Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* floor shadow + ground line */
function TeGround({ y = 1600, fill = 'rgba(0,0,0,.18)' }) { return <ellipse cx="486" cy={y} rx="380" ry="40" fill={fill} />; }

/* shared — one Tetris piece */
const TE_SHAPES = [[[0,0],[1,0],[2,0],[1,1]], [[0,0],[1,0],[0,1],[1,1]], [[0,0],[1,0],[2,0],[3,0]], [[0,0],[0,1],[1,1],[2,1]], [[1,0],[2,0],[0,1],[1,1]]];
const TE_COLS = ['#E8C547', '#E07A2E', '#6FA8C9', '#B3202A', '#8FD18B'];
function TePiece({ x, y, k = 0, u = 46, r = 0, op = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${r})`} opacity={op}>
    {TE_SHAPES[k % 5].map(([a, b], i) => <rect key={i} x={a * u - u} y={b * u - u / 2} width={u - 4} height={u - 4} rx="6" fill={TE_COLS[k % 5]} stroke="rgba(0,0,0,.25)" strokeWidth="3" />)}
  </g>);
}
function TeRain({ T, n = 7, y0 = 760, h = 900, op = 1 }) {
  return (<g>{Array.from({ length: n }).map((_, i) => { const p = ((T * 0.25 + hsh(i)) % 1); return <TePiece key={i} x={120 + (i * 137) % 760} y={y0 + p * h} k={i} r={Math.floor(p * 4) * 90} op={op * (p < 0.9 ? 1 : (1 - p) * 10)} />; })}</g>);
}

/* 1 — someone asleep, blocks fall above the head */
function ArtTeBed({ T, t }) {
  return (<g>
    <TeRain T={T} n={6} y0={700} h={520} op={0.9} />
    <rect x="120" y="1360" width="732" height="160" rx="30" fill="#E9E4D8" /><rect x="120" y="1500" width="732" height="40" fill="#6B4A2E" />
    <ellipse cx="300" cy="1340" rx="120" ry="60" fill="#fff" />
    <g transform="translate(320 1290) rotate(-80)"><ellipse rx="70" ry="78" fill={SKIN} /><path d="M-70 0 C-70 -70 70 -70 70 0 C40 -30 -40 -30 -70 0 Z" fill={INK} /></g>
    <path d="M300 1330 q10 6 20 0" stroke={INK} strokeWidth="6" fill="none" /><path d="M260 1320 l20 0 M330 1320 l20 0" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    <path d="M400 1380 C500 1330 700 1330 852 1380 L852 1460 L400 1460 Z" fill="#6A3FA0" />
    <text x="620" y="1260" fontFamily={FONT} fontWeight="900" fontSize="70" fill="#fff" opacity={0.6 + 0.4 * osc(T, 2)}>z z z</text>
  </g>);
}

/* 2 — a player at a screen */
function ArtTePlay({ T, t }) {
  return (<g>
    <rect x="236" y="780" width="500" height="420" rx="20" fill={INK} /><rect x="266" y="810" width="440" height="360" rx="8" fill="#1F2430" />
    <TeRain T={T} n={4} y0={780} h={360} />
    <rect x="236" y="760" width="500" height="50" fill="#E9E4D8" /><rect x="236" y="1200" width="500" height="80" fill="#E9E4D8" />
    <TePerson x={486} y={1420} T={T} shirt="#2B6E7A" mouth="flat" s={0.6} look={0} />
    <g transform={`translate(780 900) scale(${pop(t, 0.3)})`}><circle r="80" fill="#B3202A" /><text y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="54" fill="#fff">3 d</text></g>
  </g>);
}

/* 3 — 60%+ of heads show falling blocks */
function ArtTeSixty({ T, t }) {
  const lit = Math.round(10 * 0.63 * tw(t, 0.2, 1.2));
  return (<g>
    {Array.from({ length: 10 }).map((_, i) => { const c = i % 5, r = Math.floor(i / 5); const on = i < lit; return (<g key={i} transform={`translate(${170 + c * 158} ${930 + r * 300})`}>
      <circle cx="0" cy="0" r="56" fill={on ? SKIN : 'rgba(255,255,255,.3)'} /><path d="M-70 150 C-70 70 -40 60 0 60 C40 60 70 70 70 150 Z" fill={on ? '#E8C547' : 'rgba(255,255,255,.3)'} />
      {on && <TePiece x={10} y={-110 + ((T * 0.6 + i * 0.2) % 1) * 40} k={i} u={22} />}
    </g>); })}
    <TeBig x={486} y={1590} t={t} to={60} suffix="%+" size={150} fill="#fff" />
  </g>);
}

/* 4 — an amnesia patient: blank memory, blocks still falling */
function ArtTeAmnesia({ T, t }) {
  return (<g>
    <TePerson x={486} y={1120} T={T} shirt="#E9E4D8" mouth="o" brow={8} />
    <g transform="translate(486 830)"><rect x="-170" y="-80" width="340" height="120" rx="20" fill="#fff" /><text y="0" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="48" fill="#C9C2B2">memory: ???</text></g>
    <TeRain T={T} n={4} y0={700} h={260} />
    <TePill x={486} y={1570} w={420} text="3 of 5" fill={INK} />
  </g>);
}

/* 5 — a replay button over a brain */
function ArtTeReplay({ T, t }) {
  const a = T * 120;
  return (<g>
    <g transform="translate(486 1150)"><ellipse rx="300" ry="230" fill="#F2A7B5" /><path d="M0 -230 V230 M-200 -120 q80 60 0 120 M200 -120 q-80 60 0 120 M-120 60 q60 50 0 100 M120 60 q-60 50 0 100" stroke="#C46A7E" strokeWidth="14" fill="none" /></g>
    <g transform={`translate(486 1150) scale(${pop(t, 0.3)})`}><circle r="120" fill="#fff" /><g transform={`rotate(${-a})`}><path d="M-60 -20 A64 64 0 1 1 -40 50" fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" /><path d="M-90 -40 l30 30 l20 -40 Z" fill={INK} /></g></g>
  </g>);
}

/* 6 — practice loop: the same piece again and again */
function ArtTeEffect({ T, t }) {
  return (<g>
    <path d="M486 830 A280 280 0 1 1 485 830" fill="none" stroke={INK} strokeWidth="16" strokeDasharray="30 26" transform={`rotate(${T * 30} 486 1110)`} />
    {[0, 1, 2, 3].map((k) => { const ang = (T * 0.5 + k / 4) * TAU; return <TePiece key={k} x={486 + Math.cos(ang) * 280} y={1110 + Math.sin(ang) * 280} k={k} u={40} />; })}
    <TePerson x={486} y={1080} T={T} shirt="#6A3FA0" mouth="smile" s={0.55} />
  </g>);
}

/* 7 — a book on the pillow at bedtime */
function ArtTeFeed({ T, t }) {
  return (<g>
    <circle cx="780" cy="860" r="80" fill="#E9E4D8" /><circle cx="815" cy="840" r="70" fill="#1F3B73" />
    {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={150 + k * 150} cy={820 + (k % 2) * 60} r="6" fill="#fff" opacity={0.5 + 0.5 * osc(T, 1.5, k * 0.2)} />)}
    <rect x="160" y="1300" width="652" height="200" rx="30" fill="#E9E4D8" /><ellipse cx="320" cy="1290" rx="130" ry="60" fill="#fff" />
    <g transform={`translate(560 ${1200 + osc(T, 2) * 8})`}><path d="M-150 -70 L0 -40 L150 -70 L150 70 L0 100 L-150 70 Z" fill="#fff" stroke={INK} strokeWidth="6" /><line x1="0" y1="-40" x2="0" y2="100" stroke={INK} strokeWidth="6" />
      <text x="-75" y="30" textAnchor="middle" fontSize="60">💡</text><text x="75" y="30" textAnchor="middle" fontSize="60">🎯</text></g>
  </g>);
}

Object.assign(window, { ArtTeAmnesia, ArtTeBed, ArtTeEffect, ArtTeFeed, ArtTePlay, ArtTeReplay, ArtTeSixty });
