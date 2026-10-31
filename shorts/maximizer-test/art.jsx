// art.jsx — "Maximizer or Satisficer?" (Ted type 2, Sam + Leo). 972×1728 card; captions sit in the top third,
// so subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene; may be negative). People via <T2Bust>.
// Schwartz et al. 2002: maximizers report less happiness and optimism, more regret (correlational).
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';

/* a phone charger (plug + cable + connector), stars = rating */
function Charger({ x, y, s = 1, rot = 0, col = '#fff', stars = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-60" y="-70" width="120" height="120" rx="22" fill={col} stroke="#C9C0AE" strokeWidth="6" />
    <rect x="-30" y="-110" width="16" height="44" rx="4" fill="#9FA7B5" /><rect x="14" y="-110" width="16" height="44" rx="4" fill="#9FA7B5" />
    <path d="M0 50 C0 130 120 110 120 190" fill="none" stroke={col === '#fff' ? '#E9E4D8' : col} strokeWidth="14" strokeLinecap="round" />
    <rect x="104" y="186" width="32" height="50" rx="8" fill="#5B6474" />
    {stars > 0 && [...Array(5)].map((_, i) => <path key={i} d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4 Z" fill={i < stars ? YEL : '#C9C0AE'} transform={`translate(${-48 + i * 24} 90)`} />)}</g>);
}
/* a browser tab strip with n tabs (shrinking as they multiply) */
function Tabs({ x, y, w, n, T }) {
  const tw_ = Math.max(14, w / Math.max(1, n));
  return (<g transform={`translate(${x} ${y})`}>
    <rect x="0" y="0" width={w} height="380" rx="18" fill="#fff" />
    <rect x="0" y="0" width={w} height="70" rx="18" fill="#D8D0BF" />
    {[...Array(n)].map((_, i) => <rect key={i} x={8 + i * (tw_ - 1)} y={12} width={tw_ - 4} height={58} rx="8" fill={i === n - 1 ? '#fff' : ['#B9AF9B', '#C9C0AE'][i % 2]} />)}
    <rect x="30" y="100" width={w - 60} height="40" rx="20" fill="#EFEAE0" />
    <Charger x={w * 0.28} y={250} s={0.6} stars={3 + (n % 3)} col={['#fff', '#141821', '#E8C547'][n % 3]} />
    {[0, 1, 2].map((k) => <rect key={k} x={w * 0.5} y={190 + k * 40} width={w * 0.4 - k * 30} height="18" rx="9" fill="#C9C0AE" />)}
    <text x={w * 0.5} y={340} fontFamily={BOLD} fontWeight="900" fontSize="34" fill={RED}>${(19 + (n * 7) % 23)}.99</text></g>);
}
const Clock = ({ x, y, r = 70, h = 0, k = 1, col = '#fff' }) => (<g transform={`translate(${x} ${y}) scale(${k})`}>
  <circle r={r} fill={col} stroke={INK} strokeWidth="8" /><line x1="0" y1="0" x2="0" y2={-r * 0.7} stroke={INK} strokeWidth="8" strokeLinecap="round" transform={`rotate(${h * 360 * 12})`} />
  <line x1="0" y1="0" x2={r * 0.45} y2="0" stroke={INK} strokeWidth="10" strokeLinecap="round" transform={`rotate(${h * 360 - 90})`} /></g>);

/* 1 — hook: a podium with a gold BEST trophy … and a tiny wilting smile */
function MXHook({ T, t }) {
  const k = pop(t, 0.3, 0.45);
  return (<g>
    <circle cx="486" cy="1200" r="420" fill="#264684" />
    {[[260, 1450, 220, '#9FA7B5', '2'], [486, 1380, 290, YEL, '1'], [712, 1500, 170, '#C98A62', '3']].map(([x, y, h, c, n], i) => (<g key={i}>
      <rect x={x - 110} y={y} width="220" height={1728 - y} fill={c} /><text x={x} y={y + 110} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="90" fill={INK}>{n}</text></g>))}
    <g transform={`translate(486 ${1180 + osc(T, 2) * 8}) scale(${k})`}>
      <path d="M-120 -170 L120 -170 C120 -40 60 20 0 20 C-60 20 -120 -40 -120 -170 Z" fill={YEL} />
      <path d="M-120 -140 C-200 -140 -200 -40 -100 -40 M120 -140 C200 -140 200 -40 100 -40" fill="none" stroke={YEL} strokeWidth="22" />
      <rect x="-26" y="20" width="52" height="80" fill={YEL} /><rect x="-90" y="100" width="180" height="40" rx="10" fill={INK} />
      <text y="-80" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="56" fill={INK}>BEST</text></g>
    {[...Array(8)].map((_, i) => { const a = i / 8 * TAU + T * 0.6; return <path key={i} d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill="#fff" opacity={0.7 * k} transform={`translate(${486 + Math.cos(a) * 300} ${1080 + Math.sin(a) * 120})`} />; })}
  </g>);
}

/* 2 — Sam at 1:00 AM, forty tabs */
function MXTabs({ T, t, dur }) {
  const D = Math.max(3, dur || 5), n = Math.max(1, Math.round(40 * Easing.easeInCubic(cl(t / (D * 0.85)))));
  return (<g>
    <circle cx="486" cy="1230" r="420" fill="#264684" />
    <Tabs x={136} y={640} w={700} n={n} T={T} />
    <T2Bust who="sam" x={486} y={1380} s={0.6} T={T} mood={n > 25 ? 'nervous' : 'calm'} look={osc(T, 0.7) * 14} disc={false} />
    <Clock x={820} y={1150} r={60} h={cl(t / D) * 0.25 + 0.04} k={pop(t, 0.2)} />
    <g transform={`translate(180 1150) scale(${pop(t, 0.4)})`}><rect x="-80" y="-34" width="160" height="68" rx="34" fill={INK} />
      <text y="16" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={YEL}>{n} TABS</text></g>
  </g>);
}

/* 3 — Leo: grabs the first good one, done */
function MXLeo({ T, t, dur }) {
  const D = Math.max(2.5, dur || 4), done = t > D * 0.55;
  return (<g>
    <T2Bust who="leo" x={486} y={1270} T={T} mood={done ? 'happy' : 'calm'} look={osc(T, 2) * 6} />
    <g transform={`translate(${lp_(780, 650, tw(t, 0.4, 0.5))} ${930 + osc(T, 1.6) * 8}) rotate(-12)`}><Charger x={0} y={0} s={0.75} stars={4} /></g>
    {done && <g transform={`translate(250 820) rotate(-10) scale(${pop(t, D * 0.55, 0.35)})`}><circle r="95" fill="#3E8E5A" />
      <path d="M-45 0 L-12 32 L48 -36" fill="none" stroke="#fff" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" /></g>}
    <Clock x={760} y={640} r={64} h={0.02 + cl(t / D) * 0.01} k={pop(t, 0.2)} col={YEL} />
  </g>);
}
function lp_(a, b, k) { return a + (b - a) * k; }

/* 4 — name tags: MAXIMIZER (Sam) vs satisficer (Leo) */
function MXName({ T, t, dur }) {
  const D = Math.max(3, dur || 5);
  const tag = (x, y, txt, col, k, rot) => (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
    <rect x="-200" y="-60" width="400" height="120" rx="18" fill={col} /><rect x="-200" y="-60" width="400" height="38" rx="18" fill="rgba(0,0,0,0.15)" />
    <text y="-30" textAnchor="middle" fontFamily={BOLD} fontWeight="800" fontSize="20" fill="#fff">HELLO, I'M A</text>
    <text y="40" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="46" fill={INK}>{txt}</text></g>);
  return (<g>
    <T2Bust who="sam" x={270} y={1300} s={0.55} T={T} mood="nervous" look={10} />
    <T2Bust who="leo" x={710} y={1330} s={0.5} T={T} mood="happy" look={-10} />
    {tag(270, 900, 'MAXIMIZER', YEL, pop(t, D * 0.3), -5)}
    {tag(710, 960, 'SATISFICER', '#9FE8C8', pop(t, D * 0.7), 5)}
  </g>);
}

/* 5 — 2002: a questionnaire with a slider from "good enough" to "the best" */
function MXStudy({ T, t, dur }) {
  const D = Math.max(3, dur || 5), s = 0.5 + 0.42 * osc(T, 2.4);
  return (<g>
    <circle cx="486" cy="1200" r="420" fill="#8E1820" />
    <g transform={`translate(486 1160) rotate(-3) scale(${pop(t, 0.1, 0.45)})`}>
      <rect x="-320" y="-380" width="640" height="760" rx="22" fill={CREAM} />
      <text y="-300" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="42" fill={RED}>2002 · SURVEY</text>
      <text y="-250" textAnchor="middle" fontFamily={BOLD} fontWeight="800" fontSize="28" fill={INK}>MAXIMIZATION SCALE</text>
      {[0, 1, 2].map((i) => { const v = cl(0.2 + hsh(i + 4) * 0.7 + 0.08 * osc(T, 1.5 + i * 0.3)), k = tw(t, 0.6 + i * D * 0.15, 0.4);
        return (<g key={i} transform={`translate(0 ${-130 + i * 170})`} opacity={k}>
          {[0, 1].map((j) => <rect key={j} x="-260" y={-60 + j * 30} width={j ? 300 : 460} height="14" rx="7" fill="#C9C0AE" />)}
          <rect x="-260" y="20" width="520" height="16" rx="8" fill="#B9AF9B" /><circle cx={-260 + 520 * v} cy="28" r="28" fill={i === 1 ? YEL : TEAL} />
          <text x="-260" y="80" fontFamily={BOLD} fontWeight="800" fontSize="22" fill="#6B6F7A">GOOD ENOUGH</text>
          <text x="260" y="80" textAnchor="end" fontFamily={BOLD} fontWeight="800" fontSize="22" fill="#6B6F7A">THE BEST</text></g>); })}</g>
    <T2Bust who="sam" x={800} y={1560} s={0.32} T={T} mood="nervous" disc={false} look={-14} />
  </g>);
}

/* 6 — results: happiness and optimism gauges sink, regret swells (Sam's side) */
function MXResults({ T, t, dur }) {
  const D = Math.max(3, dur || 5);
  const gauge = (x, lab, v, col, s) => { const g = tw(t, s, 0.6), h = 420 * (1 + (v - 1) * g);
    return (<g key={lab}><rect x={x - 90} y={1540 - 420} width="180" height="420" rx="18" fill="rgba(255,255,255,0.12)" />
      <rect x={x - 90} y={1540 - h} width="180" height={h} rx="18" fill={col} />
      <text x={x} y="1600" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill="#fff">{lab}</text>
      <path d={v < 1 ? 'M0 -26 L0 26 M-22 6 L0 28 L22 6' : 'M0 26 L0 -26 M-22 -6 L0 -28 L22 -6'} transform={`translate(${x} ${1060 - (v > 1 ? 120 : 0)})`} stroke={v < 1 ? '#FF8A7A' : YEL} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={g} /></g>); };
  return (<g>
    <text x="486" y="980" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill="#fff" opacity={tw(t, 0.1, 0.3)}>MAXIMIZERS REPORTED</text>
    {gauge(220, 'HAPPINESS', 0.55, '#9FE8C8', D * 0.2)}
    {gauge(486, 'OPTIMISM', 0.6, '#9FE8FF', D * 0.42)}
    {gauge(752, 'REGRET', 1.25, '#FF8A7A', D * 0.7)}
  </g>);
}

/* 7 — the turn: Sam's charger is barely better; a ghost of tab 39 hovers over his head */
function MXBut({ T, t, dur }) {
  const D = Math.max(3, dur || 5), g = tw(t, D * 0.5, 0.5);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#B85A1E" />
    <T2Bust who="sam" x={486} y={1300} s={0.78} T={T} mood={t > D * 0.5 ? 'sad' : 'calm'} look={osc(T, 3) * 10} disc={false} />
    <g transform={`translate(170 1420) rotate(-8)`}><Charger x={0} y={0} s={0.6} stars={5} col="#141821" /></g>
    <g transform="translate(486 1640)"><rect x="-180" y="-40" width="360" height="70" rx="35" fill={INK} opacity={tw(t, 0.4, 0.3)} />
      <text y="10" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={YEL} opacity={tw(t, 0.4, 0.3)}>BARELY BETTER</text></g>
    <g transform={`translate(${730 + osc(T, 3) * 16} ${800 + osc(T, 2.2) * 14}) scale(${0.6 + 0.4 * g})`} opacity={g * (0.75 + 0.25 * osc(T, 1.1))}>
      <rect x="-150" y="-100" width="300" height="200" rx="16" fill="#fff" /><rect x="-150" y="-100" width="300" height="50" rx="16" fill="#D8D0BF" />
      <text y="-62" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="26" fill={INK}>TAB 39</text>
      <Charger x={-60} y={10} s={0.45} col={YEL} /><text x="50" y="40" fontFamily={BOLD} fontWeight="900" fontSize="60" fill={RED}>?</text></g>
  </g>);
}

/* 8 — outro: a ruler with a GOOD ENOUGH line; Leo hands Sam the laptop lid to close */
function MXMove({ T, t, dur }) {
  const D = Math.max(3, dur || 5), m = tw(t, D * 0.3, 0.6), shut = tw(t, D * 0.72, 0.4);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#264684" />
    <g transform="translate(160 760)"><rect x="-40" y="0" width="80" height="560" rx="12" fill={YEL} />
      {[...Array(11)].map((_, i) => <rect key={i} x="-40" y={20 + i * 50} width={i % 5 ? 30 : 50} height="6" fill={INK} />)}
      <g opacity={m}><rect x="-60" y={20 + 3 * 50 - 4} width={300 * m} height="14" rx="7" fill="#9FE8C8" />
        <text x="60" y={20 + 3 * 50 - 20} fontFamily={BOLD} fontWeight="900" fontSize="30" fill="#fff">GOOD ENOUGH</text></g></g>
    <T2Bust who="sam" x={620} y={1330} s={0.6} T={T} mood={shut > 0.5 ? 'happy' : 'calm'} look={-10} disc={false} />
    <g transform={`translate(486 760) rotate(-4) scale(${pop(t, D * 0.72, 0.4)})`}><rect x="-230" y="-55" width="460" height="110" rx="55" fill="#9FE8C8" />
      <text y="18" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="46" fill={INK}>39 TABS CLOSED</text></g>
    <T2Bust who="leo" x={830} y={1500} s={0.3} T={T} mood="smug" disc={false} look={-14} />
  </g>);
}

Object.assign(window, { MXHook, MXTabs, MXLeo, MXName, MXStudy, MXResults, MXBut, MXMove });
})();
