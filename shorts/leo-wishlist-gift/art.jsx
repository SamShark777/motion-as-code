// art.jsx — "Wishlist or Surprise? Pause and Pick" (Ted type 2, Leo ep. 9 with Priya; pattern: test). 972×1728 card;
// captions sit in the top third, so subjects stay in the lower 60%. Pure functions of T and t. People via <T2Bust>.
// Gift giving: Gino & Flynn 2011 (JESP, "Give them what they want") — five experiments: recipients appreciated requested
// gifts more than unrequested ones and saw them as more thoughtful; givers expected the opposite. No numbers on screen.
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', NAVY = '#1F3B73', PURP = '#6A3FA0', ORG = '#E07A2E', GRN = '#4E9A6A', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const BOLD = 'Montserrat, sans-serif';
const bt = (beats, i, fb) => (beats && beats[i] != null ? beats[i] : fb);

function Chip({ x, y, text, k = 1, fill = YEL, col = INK, size = 34, w, rot = 0 }) {
  if (k <= 0) return null;
  const W = w || text.length * size * 0.72 + 60;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}><rect x={-W / 2} y="-34" width={W} height="68" rx="34" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={col}>{text}</text></g>);
}
/* a wrapped present; open 0..1 lifts the lid */
function Gift({ x, y, s = 1, col = RED, rib = YEL, open = 0, rot = 0, q = false }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-130" y="-100" width="260" height="200" rx="14" fill={col} /><rect x="-22" y="-100" width="44" height="200" fill={rib} />
    <g transform={`translate(0 ${-open * 90}) rotate(${-open * 14})`}><rect x="-150" y="-150" width="300" height="60" rx="12" fill={col} /><rect x="-22" y="-150" width="44" height="60" fill={rib} />
      <path d="M0 -150 C-70 -230 -120 -170 0 -150 C120 -170 70 -230 0 -150 Z" fill={rib} /></g>
    {q && <text y="60" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="120" fill="#fff" opacity="0.9">?</text>}</g>);
}
/* a wishlist card with ticked rows */
function ListCard({ x, y, s = 1, rot = 0, items = ['HEADPHONES', 'BOOK: DUNE', 'RUNNING SOCKS'], hi = -1, cross = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-230" y="-260" width="460" height="520" rx="22" fill="#F7F4EC" />
    <rect x="-230" y="-260" width="460" height="100" rx="22" fill={TEAL} /><text y="-192" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill="#fff">WISHLIST</text>
    {items.map((it, i) => (<g key={i}><rect x="-190" y={-120 + i * 110} width="56" height="56" rx="10" fill="#fff" stroke={INK} strokeWidth="6" />
      {i === hi && <path d={`M-180 ${-92 + i * 110} l16 18 l30 -38`} fill="none" stroke={GRN} strokeWidth="10" strokeLinecap="round" />}
      <text x="-110" y={-78 + i * 110} fontFamily={BOLD} fontWeight="900" fontSize="36" fill={INK}>{it}</text></g>))}
    {cross > 0 && <g stroke={RED} strokeWidth="24" strokeLinecap="round"><line x1="-200" y1="-230" x2={lerp(-200, 200, cross)} y2={lerp(-230, 230, cross)} /></g>}</g>);
}
/* a big heart meter */
function Meter({ x, y, v, label, col }) {
  return (<g transform={`translate(${x} ${y})`}><rect x="-60" y="-300" width="120" height="300" rx="30" fill="#fff" opacity="0.25" />
    <rect x="-60" y={-300 * v} width="120" height={300 * v} rx="30" fill={col} />
    <path d="M0 -330 C-50 -370 -80 -330 0 -290 C80 -330 50 -370 0 -330 Z" fill={RED} transform={`translate(0 ${300 - 300 * v})`} />
    <text y="70" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff">{label}</text></g>);
}

/* 1 — hook: Leo shoves the wishlist aside, eyes on a mystery present */
function LWList({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={TEAL} />
    <ListCard x={250} y={880} s={0.62} rot={-8} cross={tw(t, c1, 0.4)} />
    <Gift x={720} y={880 + osc(T, 1.4) * 10} s={0.8} col={PURP} q />
    <T2Bust who="leo" x={486} y={1400} s={0.58} T={T} mood={t > c1 ? 'smug' : 'calm'} disc={false} />
    <Chip x={720} y={680} text="'THOUGHTFUL'" k={pop(t, bt(beats, 3, 1.2))} size={32} />
  </g>);
}
/* 2 — the test: pause and pick — two big buttons */
function LWPick({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.9), c3 = bt(beats, 3, 1.3);
  const btn = (x, label, col, at, child) => (<g transform={`translate(${x} 1150) scale(${pop(t, at)})`}>
    <rect x="-200" y="-220" width="400" height="440" rx="40" fill={col} />{child}
    <text y="180" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill="#fff">{label}</text></g>);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={NAVY} />
    <g transform={`translate(486 760) scale(${1 + 0.05 * osc(T, 0.8)})`}><rect x="-60" y="-70" width="40" height="140" rx="10" fill="#fff" /><rect x="20" y="-70" width="40" height="140" rx="10" fill="#fff" /></g>
    {btn(270, 'WISHLIST', TEAL, c2 - 0.1, <ListCard x={0} y={-30} s={0.42} />)}
    {btn(702, 'SURPRISE', PURP, c3 - 0.1, <Gift x={0} y={0} s={0.7} col={RED} q />)}
    <text x="486" y="1170" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="54" fill={YEL}>OR</text>
  </g>);
}
/* 3 — snapback: giver wants SURPRISE, receiver wants LIST — the stamp lands */
function LWSplit({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.3);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#C9C0AE" />
    <T2Bust who="leo" x={260} y={1420} s={0.4} T={T} mood="smug" disc={false} look={8} />
    <T2Bust who="priya" x={712} y={1420} s={0.4} T={T} mood={t > c3 ? 'happy' : 'calm'} disc={false} look={-8} ph={0.5} />
    <Chip x={260} y={780} text="GIVER" fill={INK} col="#fff" k={pop(t, 0.05)} size={34} />
    <Gift x={260} y={980} s={0.55} col={PURP} q />
    <Chip x={712} y={780} text="RECEIVER" fill={INK} col="#fff" k={pop(t, bt(beats, 2, 0.9))} size={34} />
    {t > c3 - 0.1 && <ListCard x={712} y={990} s={0.4} hi={0} rot={4} />}
  </g>);
}
/* 4 — the 2011 study: a lab card with a ticked wishlist gift and the authors */
function LWStudy({ T, t, beats }) {
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={NAVY} />
    <Chip x={486} y={680} text="GINO & FLYNN · 2011" k={pop(t, 0.05)} size={32} />
    <g transform={`translate(486 ${lerp(1500, 1080, tw(t, 0.1, 0.5))})`}>
      <ListCard x={-120} y={0} s={0.7} rot={-5} hi={t > bt(beats, 4, 1.8) - 0.1 ? 0 : -1} />
      <Gift x={210} y={160} s={0.6} col={ORG} open={0.4 + 0.1 * osc(T, 1.2)} /></g>
    <Chip x={486} y={1620} text="5 EXPERIMENTS" fill="#fff" k={pop(t, bt(beats, 2, 1))} size={30} />
  </g>);
}
/* 5 — result: "thoughtful" meter — asked-for beats surprise */
function LWThoughtful({ T, t, beats }) {
  const g = tw(t, bt(beats, 1, 0.5) - 0.2, 0.7);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#7A1A22" />
    <Chip x={486} y={700} text="HOW THOUGHTFUL?" k={pop(t, 0.05)} size={34} />
    <Meter x={300} y={1450} v={lerp(0.1, 0.85, g)} label="ASKED FOR" col={YEL} />
    <Meter x={672} y={1450} v={lerp(0.1, 0.55, g)} label="SURPRISE" col="#C9CED6" />
    <text x="486" y="1650" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="24" fill="#fff" opacity="0.7">SCHEMATIC · RECEIVERS' RATINGS</text>
  </g>);
}
/* 6 — self-proof: a drawer of unused "surprises" */
function LWDrawer({ T, t, beats }) {
  const o = tw(t, 0.1, 0.6);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={ORG} />
    <rect x="166" y="1000" width="640" height="420" rx="26" fill="#6E4224" />
    <g transform={`translate(0 ${o * 140})`}><rect x="196" y="1060" width="580" height="300" rx="18" fill="#8A5A34" />
      <g transform="translate(330 1060) rotate(-12)"><rect x="-60" y="-120" width="120" height="150" rx="20" fill={PURP} /><text y="-30" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill="#fff">?!</text></g>
      <g transform="translate(486 1040) rotate(6)"><rect x="-90" y="-130" width="180" height="160" rx="20" fill={TEAL} /><circle cy="-50" r="40" fill={YEL} /></g>
      <g transform="translate(650 1060) rotate(-4)"><rect x="-70" y="-110" width="140" height="140" rx="10" fill={RED} /><rect x="-12" y="-110" width="24" height="140" fill={YEL} /></g>
      <rect x="436" y="1280" width="100" height="30" rx="15" fill={YEL} /></g>
    <Chip x={486} y={760} text="NEVER USED" fill={RED} col="#fff" k={pop(t, bt(beats, 2, 0.9))} size={36} rot={-4} />
  </g>);
}
/* 7 — the turn: Priya, a big ear, listening = thoughtful */
function LWPriya({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.9);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={PURP} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${740 + i * 40} ${860 - i * 30} q50 70 0 160`} fill="none" stroke={YEL} strokeWidth="12" strokeLinecap="round" opacity={0.3 + 0.7 * Math.abs(osc(T, 0.9, i * 0.2))} />)}
    <T2Bust who="priya" x={486} y={1400} s={0.6} T={T} mood={t > c2 ? 'happy' : 'calm'} disc={false} />
    <Chip x={486} y={700} text="THEY ALREADY TOLD YOU" k={pop(t, c2)} size={30} />
  </g>);
}
/* 8 — outro: Leo unboxes the wishlist gift for his friend — headphones — Priya grins */
function LWOutro({ T, t, beats }) {
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={TEAL} />
    <Gift x={486} y={900} s={0.8} col={RED} open={tw(t, 0.2, 0.6)} />
    {t > 0.5 && <g transform={`translate(486 ${lerp(900, 760, tw(t, 0.5, 0.5))})`}><path d="M-90 30 A90 90 0 0 1 90 30" fill="none" stroke={INK} strokeWidth="20" /><rect x="-120" y="20" width="60" height="90" rx="20" fill={INK} /><rect x="60" y="20" width="60" height="90" rx="20" fill={INK} /></g>}
    <T2Bust who="leo" x={300} y={1480} s={0.42} T={T} mood="happy" disc={false} look={6} />
    <T2Bust who="priya" x={680} y={1480} s={0.42} T={T} mood="smug" disc={false} look={-6} ph={0.4} />
    <Chip x={486} y={680} text="WISHLIST OR SURPRISE?" k={pop(t, bt(beats, 1, 0.4))} size={30} />
  </g>);
}

Object.assign(window, { LWList, LWPick, LWSplit, LWStudy, LWThoughtful, LWDrawer, LWPriya, LWOutro });
})();
