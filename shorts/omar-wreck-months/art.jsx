// art.jsx — "It Won't Hurt As Long As You Think" (Ted type 2, Omar ep. 6 with Grace). 972×1728 card; captions sit in
// the top third, so subjects stay in the lower 60%. Pure functions of T and t. People via <T2Bust>.
// Impact / durability bias: Gilbert, Pinel, Wilson, Blumberg & Wheatley 1998 (JPSP, "Immune neglect") — assistant
// professors predicted years of unhappiness if denied tenure; former professors who were denied were about as happy as
// those promoted. People neglect the psychological immune system. No invented numbers on screen.
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
/* a round avatar token with a face */
function Avatar({ x, y, r = 80, col, k = 1, sad = 0, label }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${k})`}><circle r={r} fill={col} />
    <circle cx={-r * 0.3} cy={-r * 0.1} r={r * 0.11} fill={INK} /><circle cx={r * 0.3} cy={-r * 0.1} r={r * 0.11} fill={INK} />
    <path d={sad > 0.5 ? `M${-r * 0.3} ${r * 0.42} Q0 ${r * 0.22} ${r * 0.3} ${r * 0.42}` : `M${-r * 0.3} ${r * 0.25} Q0 ${r * 0.48} ${r * 0.3} ${r * 0.25}`} fill="none" stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />
    {label && <text y={r + 56} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff">{label}</text>}</g>);
}
/* a rain cloud (or sun when sunny) */
function Cloud({ x, y, s = 1, T = 0, rain = true, col = '#5B6475' }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {rain && [0, 1, 2, 3].map((i) => { const ph = ((T * 1.6 + i * 0.27) % 1); return <line key={i} x1={-60 + i * 40} y1={40 + ph * 90} x2={-70 + i * 40} y2={70 + ph * 90} stroke="#8FB8E8" strokeWidth="8" strokeLinecap="round" opacity={1 - ph} />; })}
    <circle cx="-50" cy="0" r="50" fill={col} /><circle cx="10" cy="-26" r="64" fill={col} /><circle cx="70" cy="4" r="46" fill={col} /><rect x="-100" y="0" width="216" height="50" rx="25" fill={col} /></g>);
}
function Sun({ x, y, s = 1, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${T * 20})`}>{[...Array(10)].map((_, i) => <rect key={i} x="-8" y="-110" width="16" height="36" rx="8" fill={YEL} transform={`rotate(${i * 36})`} />)}<circle r="62" fill={YEL} /></g>);
}
/* a medal on a ribbon */
function Medal({ x, y, s = 1, rot = 0, col = '#C9CED6', n = '2' }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><path d="M-40 -150 L-10 -40 L10 -40 L40 -150 Z" fill={RED} />
    <circle cy="20" r="62" fill={col} /><circle cy="20" r="44" fill="none" stroke="#fff" strokeWidth="6" opacity="0.6" />
    <text y="44" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="64" fill={INK}>{n}</text></g>);
}
/* forecast board: a row of weather icons labelled ahead in time */
function Forecast({ x, y, T, sunny = 0, labels = ['NEXT WEEK', 'NEXT MONTH', 'NEXT YEAR'] }) {
  return (<g transform={`translate(${x} ${y})`}><rect x="-420" y="-230" width="840" height="460" rx="36" fill="#F7F4EC" />
    <text y="-160" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={INK}>MY FEELINGS FORECAST</text>
    {labels.map((l, i) => { const cx = -280 + i * 280, k = cl(sunny * 3 - i);
      return (<g key={i}><g opacity={1 - k}><Cloud x={cx} y={-10} s={0.75} T={T + i * 0.3} /></g><g opacity={k}><Sun x={cx} y={-10} s={0.75} T={T} /></g>
        <text x={cx} y="160" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>{l}</text></g>); })}</g>);
}

/* 1 — Omar loses the final: scoreboard, silver medal, slumped */
function OMFinal({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={ORG} />
    <g transform="translate(486 760)"><rect x="-330" y="-120" width="660" height="240" rx="28" fill={INK} />
      <text x="-160" y="-50" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff" opacity="0.7">OMAR</text>
      <text x="160" y="-50" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff" opacity="0.7">RIVAL</text>
      <text x="-160" y="70" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="120" fill={RED}>2</text>
      <text x="160" y="70" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="120" fill={YEL}>3</text>
      <text y="60" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="80" fill="#fff">–</text></g>
    <Chip x={486} y={620} text="THE FINAL · FULL TIME" k={pop(t, 0.05)} size={30} />
    <T2Bust who="omar" x={486} y={1370} s={0.62} T={T} mood={t > c1 ? 'sad' : 'shocked'} look={0} disc={false} />
    <Medal x={720} y={1560} s={0.9} rot={osc(T, 2.2) * 6} />
  </g>);
}
/* 2 — the 1998 study: a tenure letter, DENIED, and a stormy forecast */
function OMTenure({ T, t, beats }) {
  const c4 = bt(beats, 4, 1.8);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={NAVY} />
    <Chip x={486} y={640} text="STUDY · 1998" k={pop(t, 0.05)} size={34} />
    <g transform={`translate(486 ${lerp(1500, 1000, tw(t, 0.1, 0.5))}) rotate(-4)`}>
      <rect x="-300" y="-200" width="600" height="400" rx="16" fill="#F7F4EC" />
      <text y="-110" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={INK}>UNIVERSITY</text>
      <rect x="-240" y="-70" width="480" height="14" rx="7" fill="#D8D0C0" /><rect x="-240" y="-30" width="380" height="14" rx="7" fill="#D8D0C0" />
      <text y="70" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="64" fill={INK}>TENURE:</text>
      {t > c4 - 0.2 && <g transform={`rotate(-10) scale(${pop(t, c4 - 0.2)})`}><rect x="-170" y="90" width="340" height="90" rx="10" fill="none" stroke={RED} strokeWidth="10" />
        <text y="160" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="64" fill={RED}>DENIED?</text></g>}</g>
    <Cloud x={250} y={1420} s={0.8} T={T} /><Cloud x={720} y={1460} s={0.7} T={T + 0.4} />
    <T2Bust who="sam" x={486} y={1560} s={0.3} T={T} mood="nervous" disc={false} />
  </g>);
}
/* 3 — snapback: the stormy forecast gets a big red X */
function OMWrong({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.8);
  const x = tw(t, c2 - 0.1, 0.35);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={RED} opacity="0.9" />
    <Forecast x={486} y={1050} T={T} />
    <g opacity={x} stroke={INK} strokeWidth="38" strokeLinecap="round"><line x1={150} y1={800} x2={lerp(150, 822, x)} y2={lerp(800, 1300, x)} /><line x1={822} y1={800} x2={lerp(822, 150, x)} y2={lerp(800, 1300, x)} /></g>
    <T2Bust who="omar" x={780} y={1545} s={0.32} T={T} mood="shocked" disc={false} look={-8} />
  </g>);
}
/* 4 — result: DENIED and PROMOTED, both about as happy */
function OMHappyAnyway({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  const lift = tw(t, c3 - 0.2, 0.5);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#7A1A22" />
    <Avatar x={280} y={1080} r={130} col={ORG} k={pop(t, 0.05)} sad={1 - lift} label="DENIED" />
    <Avatar x={692} y={1080} r={130} col={GRN} k={pop(t, 0.25)} label="PROMOTED" />
    {[280, 692].map((x, i) => { const v = i ? 0.82 : lerp(0.35, 0.78, lift); return (<g key={i}>
      <rect x={x - 40} y={1300} width="80" height="300" rx="20" fill="#F7F4EC" opacity="0.25" />
      <rect x={x - 40} y={1600 - 300 * v} width="80" height={300 * v} rx="20" fill={YEL} /></g>); })}
    <Chip x={486} y={760} text="YEARS LATER" k={pop(t, 0.1)} size={34} />
    {t > c3 && <Chip x={486} y={1690} text="HAPPINESS: ABOUT THE SAME" fill="#fff" k={pop(t, c3)} size={28} />}
  </g>);
}
/* 5 — you too: Sam with a storm cloud and a calendar of "ruined" months */
function OMWreck({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.2);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#C9C0AE" />
    <Cloud x={486} y={820} s={1.3} T={T} col="#4A5263" />
    {t > c3 && <g>{[...Array(5)].map((_, i) => { const a = i * 0.45 - 0.9; return <path key={i} d={`M${486 + Math.sin(a) * 120} ${940} l${-20 + i * 8} 60 l30 -10 l-14 70`} fill="none" stroke={YEL} strokeWidth="10" strokeLinejoin="round" opacity={tw(t, c3 + i * 0.05, 0.15)} />; })}</g>}
    <T2Bust who="sam" x={486} y={1381} s={0.6} T={T} mood="nervous" disc={false} />
  </g>);
}
/* 6 — the turn: a shield-heart with plasters fending off the grey cloud */
function OMImmune({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.9);
  const g = tw(t, c2 - 0.2, 0.5);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={PURP} />
    <g opacity={1 - g * 0.8} transform={`translate(${lerp(0, 220, g)} ${lerp(0, -120, g)})`}><Cloud x={420} y={860} s={1.1} T={T} col="#4A5263" /></g>
    <g transform={`translate(486 1180) scale(${1 + 0.04 * osc(T, 0.9)})`}>
      <path d="M0 160 C-260 0 -230 -200 -90 -200 C-40 -200 -10 -170 0 -140 C10 -170 40 -200 90 -200 C230 -200 260 0 0 160 Z" fill={RED} />
      <g transform="rotate(-30)"><rect x="-120" y="-34" width="240" height="68" rx="20" fill="#F2C9A4" /><circle cx="-20" cy="0" r="6" fill="#C79B7A" /><circle cx="20" cy="0" r="6" fill="#C79B7A" /></g>
      <path d="M-200 -260 L0 -330 L200 -260 L180 40 Q100 220 0 280 Q-100 220 -180 40 Z" fill="none" stroke={YEL} strokeWidth="18" strokeLinejoin="round" opacity={g} /></g>
    <Chip x={486} y={1660} text="PSYCHOLOGICAL IMMUNE SYSTEM" k={pop(t, c2)} size={26} />
  </g>);
}
/* 7 — proof: a cracked heart on a phone gets stitched up as calendar pages fly off */
function OMBreakup({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  const st = tw(t, c3 - 0.1, 0.8);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={TEAL} />
    {[0, 1, 2, 3].map((i) => { const k = tw(t, 0.2 + i * 0.25, 0.6); return (<g key={i} opacity={k > 0 ? 1 - k : 0} transform={`translate(${200 + k * 120 * (i % 2 ? 1 : -1)} ${820 - k * 200}) rotate(${k * 40})`}>
      <rect x="-80" y="-90" width="160" height="180" rx="12" fill="#F7F4EC" /><rect x="-80" y="-90" width="160" height="50" rx="12" fill={RED} /></g>); })}
    <g transform="translate(560 1180)">
      <path d="M0 200 C-320 0 -280 -250 -110 -250 C-50 -250 -12 -210 0 -170 C12 -210 50 -250 110 -250 C280 -250 320 0 0 200 Z" fill={RED} />
      <path d={`M0 -170 L-30 -80 L25 -10 L-20 80 L0 200`} fill="none" stroke={INK} strokeWidth="14" strokeLinejoin="round" opacity={1 - st} />
      {[...Array(5)].map((_, i) => <line key={i} x1="-30" y1={-130 + i * 65} x2="30" y2={-110 + i * 65} stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity={tw(t, c3 + i * 0.1, 0.2)} />)}</g>
  </g>);
}
/* 8 — outro: Grace smiling, sun coming out; Omar behind, medal on, grinning */
function OMGrace({ T, t, beats }) {
  return (<g>
    <circle cx="486" cy="1180" r="430" fill={NAVY} />
    <Sun x={780} y={760} s={1.1} T={T} />
    <T2Bust who="omar" x={760} y={1520} s={0.36} T={T} mood="happy" disc={false} look={-8} ph={0.6} />
    <T2Bust who="grace" x={400} y={1381} s={0.6} T={T} mood="happy" disc={false} look={6} />
    <Chip x={486} y={680} text="BEEN THERE?" k={pop(t, 0.6)} size={34} />
  </g>);
}

Object.assign(window, { OMFinal, OMTenure, OMWrong, OMHappyAnyway, OMWreck, OMImmune, OMBreakup, OMGrace });
})();
