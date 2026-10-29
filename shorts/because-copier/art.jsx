// art.jsx — "One Word Gets a Yes" (Ted type 2, Omar + Leo + Priya). 972×1728 card; captions sit in the top third,
// so subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene; may be negative). People via <T2Bust>.
(function () {
const INK = '#141821', CREAM = '#E9E4D8', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';

/* the copy machine (shared prop): body, lid, glowing scan bar, a page sliding out */
function Copier({ x, y, s = 1, T, busy = true }) {
  const scan = (T * 0.9) % 1, pg = (T * 0.7) % 1;
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-170" y="-40" width="340" height="300" rx="22" fill="#D8D0BF" />
    <rect x="-170" y="200" width="340" height="60" rx="16" fill="#B9AF9B" />
    <rect x="-190" y="-90" width="380" height="70" rx="16" fill="#F1ECE2" />
    <rect x="-150" y="-110" width="250" height="26" rx="8" fill="#9FA7B5" />
    {busy && <rect x={-150 + scan * 250} y="-112" width="22" height="30" rx="6" fill="#9FE8FF" opacity="0.9" />}
    <rect x="70" y="10" width="80" height="44" rx="8" fill={INK} /><circle cx="90" cy="32" r="8" fill="#3E8E5A" /><circle cx="122" cy="32" r="8" fill="#E8C547" />
    <rect x="-130" y="60" width="200" height="16" rx="8" fill="#B9AF9B" />
    {busy && <g transform={`translate(${-60 - pg * 160} 120) rotate(-6)`}><rect x="-70" y="-50" width="140" height="100" rx="6" fill="#fff" />
      {[0, 1, 2].map((i) => <rect key={i} x="-50" y={-28 + i * 24} width={90 - i * 20} height="10" rx="5" fill="#C9C0AE" />)}</g>}
  </g>);
}
const Bubble = ({ x, y, k, w = 420, h = 150, tail = -1, fill = '#fff', children }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 6} L${tail * 120} ${h / 2 + 70} L${tail * 0} ${h / 2 - 6} Z`} fill={fill} />{children}</g>);

/* 1 — hook: the copier, a queue arrow, and the one word floating like a key */
function ArtHook({ T, t }) {
  const k = pop(t, 0.5, 0.45);
  return (<g>
    <circle cx="486" cy="1200" r="420" fill="#264684" />
    <Copier x={486} y={1240} s={1.15} T={T} />
    {[0, 1, 2, 3].map((i) => <path key={i} d="M0 -22 L30 0 L0 22 Z" fill="#E8C547" opacity={0.35 + 0.65 * (((T * 1.4 - i * 0.25) % 1 + 1) % 1)} transform={`translate(${170 + i * 60} 1620)`} />)}
    <g transform={`translate(486 ${790 + osc(T, 2.2) * 10}) rotate(${-4 + osc(T, 3) * 3}) scale(${k})`}>
      <rect x="-230" y="-70" width="460" height="140" rx="70" fill="#FFD23F" />
      <text y="26" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="76" fill={INK}>BECAUSE</text>
      <circle cx="-270" cy="0" r="46" fill="none" stroke="#FFD23F" strokeWidth="22" /></g>
    {[...Array(8)].map((_, i) => { const a = i / 8 * TAU + T * 0.4, r = 300 + 20 * osc(T, 1.3, i / 8);
      return <circle key={i} cx={486 + Math.cos(a) * r} cy={790 + Math.sin(a) * r * 0.35} r={6 + 4 * hsh(i)} fill="#fff" opacity={0.5 * k} />; })}
  </g>);
}

/* 2 — Leo asks to cut in, no reason; Omar (next in line) says NO */
function ArtNo({ T, t, dur }) {
  const no = pop(t, Math.max(0.6, dur - 1.0), 0.3);
  return (<g>
    <Copier x={780} y={1000} s={0.6} T={T} />
    <T2Bust who="leo" x={250} y={1330} s={0.55} T={T} mood="nervous" look={12} disc={false} />
    <T2Bust who="omar" x={600} y={1250} s={0.8} T={T} mood={no > 0.5 ? 'angry' : 'calm'} look={-12} />
    <g transform={`translate(640 760) rotate(-8) scale(${no})`}>
      <rect x="-150" y="-90" width="300" height="180" rx="22" fill="#B3202A" />
      <rect x="-134" y="-74" width="268" height="148" rx="14" fill="none" stroke="#fff" strokeWidth="6" />
      <text y="38" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="110" fill="#fff">NO</text></g>
    <g transform={`translate(230 900) scale(${pop(t, 0.3)})`}><circle r="70" fill="#fff" />
      <text y="30" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="90" fill={INK}>?</text></g>
  </g>);
}

/* 3 — Leo tries again with a "because" */
function ArtBecause({ T, t }) {
  const k = pop(t, 0.3, 0.4), hl = tw(t, 1.0, 0.5);
  return (<g>
    <T2Bust who="leo" x={486} y={1260} T={T} mood="smug" look={osc(T, 1.9) * 6} />
    <Bubble x={486} y={790} k={k} w={700} h={190} tail={-1}>
      <rect x={-300} y={-52} width={330 * hl} height="104" rx="18" fill="#FFD23F" />
      <text x="-280" y="-6" fontFamily={BOLD} fontWeight="900" fontSize="58" fill={INK}>BECAUSE</text>
      <text x="-280" y="50" fontFamily={BOLD} fontWeight="800" fontSize="42" fill={INK}>I have to make copies…</text></Bubble>
    {[0, 1, 2].map((i) => <path key={i} d="M0 -18 L5 -5 L18 0 L5 5 L0 18 L-5 5 L-18 0 L-5 -5 Z" fill="#fff" opacity={Math.max(0, osc(T, 1.1, i / 3))} transform={`translate(${760 + i * 40} ${1000 + i * 70}) scale(${1.2 + 0.4 * osc(T, 0.9, i / 3)})`} />)}
  </g>);
}

/* 4 — the turn: Omar steps aside… then notices everyone in the queue holds copies */
function ArtAside({ T, t }) {
  const step = tw(t, 0.1, 0.8), q = pop(t, 1.0, 0.4);
  return (<g>
    <circle cx="486" cy="1220" r="410" fill="#1F5560" />
    <Copier x={250} y={1060} s={0.6} T={T} />
    <T2Bust who="leo" x={260 + 30 * step} y={1420} s={0.45} T={T} mood="happy" disc={false} />
    <T2Bust who="omar" x={520 + 180 * step} y={1300} s={0.62} T={T} mood={q > 0.5 ? 'shocked' : 'calm'} look={-14} disc={false} />
    {[0, 1, 2, 3].map((i) => { const k = pop(t, 1.1 + i * 0.15, 0.3);
      return (<g key={i} transform={`translate(${170 + i * 210} 780) rotate(${(i % 2 ? 6 : -6)}) scale(${k})`}>
        <rect x="-70" y="-85" width="140" height="170" rx="8" fill="#fff" />
        {[0, 1, 2, 3].map((j) => <rect key={j} x="-50" y={-58 + j * 30} width={100 - (j % 2) * 30} height="12" rx="6" fill="#C9C0AE" />)}
        <rect x="-70" y="56" width="140" height="30" rx="8" fill="#FFD23F" />
        <text y="80" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="22" fill={INK}>COPIES</text></g>); })}
    <g transform={`translate(${700 + 180 * step - 180} 1010) scale(${q})`}><circle r="56" fill="#FFD23F" />
      <text y="26" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="76" fill={INK}>!</text></g>
  </g>);
}

/* 5 — 1978: Ellen Langer's field test at a real copier — a clipboard with three scripts */
function ArtLanger({ T, t }) {
  const rows = ['NO REASON', 'REAL REASON', 'FAKE REASON'];
  return (<g>
    <circle cx="486" cy="1180" r="420" fill="#8E1820" />
    <Copier x={700} y={1330} s={0.75} T={T} />
    <g transform={`translate(330 1080) rotate(-5) scale(${pop(t, 0.1, 0.4)})`}>
      <rect x="-200" y="-260" width="400" height="520" rx="22" fill="#C9A63A" />
      <rect x="-175" y="-225" width="350" height="465" rx="10" fill="#fff" />
      <rect x="-70" y="-285" width="140" height="56" rx="14" fill="#6B6F7A" />
      <text y="-160" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill="#B3202A">1978</text>
      <text y="-115" textAnchor="middle" fontFamily={BOLD} fontWeight="800" fontSize="24" fill={INK}>COPIER LINE TEST</text>
      {rows.map((r, i) => { const k = tw(t, 0.6 + i * 0.35, 0.3); return (<g key={i} transform={`translate(-140 ${-40 + i * 95})`} opacity={k}>
        <rect x="0" y="-30" width="44" height="44" rx="8" fill="none" stroke={INK} strokeWidth="6" />
        <path d="M6 -8 L20 6 L48 -36" fill="none" stroke="#3E8E5A" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <text x="66" y="4" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>{r}</text></g>); })}</g>
  </g>);
}

/* 6 — the numbers: 60 / 94 / 93 — the fake reason is almost as good as the real one */
function ArtStats({ T, t, dur }) {
  const D = Math.max(3, dur || 6);
  const bars = [['NO REASON', 60, '#9FA7B5', 0.15], ['REAL REASON', 94, '#3E8E5A', D * 0.38], ['FAKE REASON', 93, '#FFD23F', D * 0.66]];
  return (<g>
    <rect x="90" y="1560" width="792" height="10" rx="5" fill="#fff" opacity="0.6" />
    {bars.map(([lab, v, c, s], i) => { const g = tw(t, s, 0.7), h = 760 * v / 100 * g, x = 220 + i * 266;
      return (<g key={i}>
        <rect x={x - 90} y={1560 - h} width="180" height={h} rx="18" fill={c} />
        <text x={x} y={1540 - h} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="64" fill="#fff" opacity={g}>{Math.round(v * g)}%</text>
        <text x={x} y={1625} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="27" fill="#fff">{lab}</text></g>); })}
    <g transform={`translate(752 ${720}) rotate(10) scale(${pop(t, D * 0.72, 0.35)})`}>
      <circle r="78" fill="#B3202A" /><text y="-8" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill="#fff">ALMOST</text>
      <text y="28" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill="#fff">SAME</text></g>
  </g>);
}

/* 7 — Priya explains: "because" is a key that turns the autopilot lock */
function ArtPriya({ T, t }) {
  const turn = tw(t, 0.9, 0.6);
  return (<g>
    <T2Bust who="priya" x={486} y={1270} T={T} mood="smug" />
    <g transform={`translate(486 800) scale(${pop(t, 0.15, 0.4)})`}>
      <rect x="-120" y="-40" width="240" height="190" rx="30" fill="#E9E4D8" />
      <path d={`M-80 -40 L-80 -100 A80 80 0 0 1 80 -100 L80 ${-40 - 40 * turn}`} fill="none" stroke="#E9E4D8" strokeWidth="34" />
      <circle cx="0" cy="40" r="26" fill={INK} /><rect x="-10" y="40" width="20" height="60" rx="6" fill={INK} />
      <g transform={`translate(0 55) rotate(${-90 + 90 * turn})`}>
        <rect x="20" y="-14" width="230" height="28" rx="14" fill="#FFD23F" />
        <circle cx="280" cy="0" r="52" fill="none" stroke="#FFD23F" strokeWidth="24" />
        <text x="130" y="-28" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff">BECAUSE</text></g></g>
    <text x="486" y="1050" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill="#fff" opacity={tw(t, 1.4, 0.4)}>AUTOPILOT: ON</text>
  </g>);
}

/* 8 — outro: twenty pages — Omar won't fall for it now */
function ArtReal({ T, t }) {
  const n = Math.round(cl(t / 1.2) * 20);
  return (<g>
    <circle cx="486" cy="1220" r="410" fill="#264684" />
    <T2Bust who="omar" x={640} y={1300} s={0.7} T={T} mood="smug" disc={false} />
    <T2Bust who="leo" x={250} y={1420} s={0.5} T={T} mood="nervous" disc={false} />
    <g transform="translate(250 1140)">{[...Array(n)].map((_, i) => <rect key={i} x={-80 + (hsh(i) - 0.5) * 16} y={-i * 16} width="160" height="14" rx="4" fill={i % 2 ? '#fff' : '#E9E4D8'} />)}
      <text y={-n * 16 - 30} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="56" fill="#FFD23F">{n} PAGES</text></g>
    <g transform={`translate(610 880) rotate(5) scale(${pop(t, 1.4, 0.4)})`}>
      <rect x="-190" y="-60" width="380" height="120" rx="20" fill="#FFD23F" />
      <text y="20" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="50" fill={INK}>REAL REASON?</text></g>
  </g>);
}

Object.assign(window, { ArtHook, ArtNo, ArtBecause, ArtAside, ArtLanger, ArtStats, ArtPriya, ArtReal });
})();
