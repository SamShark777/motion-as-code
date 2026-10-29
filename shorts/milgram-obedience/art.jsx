// art.jsx — "Would You Have Stopped?" (Ted type 2, Sam + Grace, Priya cameo). Milgram 1963, kept serious and non-graphic:
// no one is shown being hurt — the drama lives on the switch panel. 972×1728 card; captions sit in the top third, subjects
// stay in the lower 60%. Pure functions of T (global s) and t (s into the scene; may be negative). People via <T2Bust>.
(function () {
const INK = '#141821', CREAM = '#E9E4D8', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';

/* the shock-generator panel: a row of switches 15…450 V; `lit` switches flipped (0–30) */
function Panel({ x, y, s = 1, lit = 0, T }) {
  const n = 10, on = cl(lit, 0, n);
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-400" y="-170" width="800" height="340" rx="26" fill="#3A3F4B" />
    <rect x="-380" y="-150" width="760" height="70" rx="12" fill="#2A2E37" />
    <text x="0" y="-102" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill="#D8D0BF">SHOCK GENERATOR</text>
    {[...Array(n)].map((_, i) => { const v = Math.round(15 + (450 - 15) * i / (n - 1)), f = cl(on - i), red = i >= n - 2;
      return (<g key={i} transform={`translate(${-340 + i * 75.5} 0)`}>
        <circle cy="-30" r="14" fill={f > 0.5 ? (red ? '#FF4D4D' : '#FFD23F') : '#565C69'} opacity={f > 0.5 ? 0.75 + 0.25 * osc(T, 0.4, i / 7) : 1} />
        <rect x="-16" y="0" width="32" height="70" rx="8" fill="#20232B" />
        <rect x="-10" y={f > 0.5 ? 4 : 36} width="20" height="30" rx="6" fill={red ? '#E0262F' : CREAM} />
        <text y="112" textAnchor="middle" fontFamily={BOLD} fontWeight="800" fontSize="20" fill="#D8D0BF">{v}</text></g>); })}
    <rect x="200" y="132" width="180" height="26" rx="6" fill="#B3202A" />
    <text x="290" y="152" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="18" fill="#fff">DANGER</text>
  </g>);
}
const Chip = ({ x, y, text, k, fill = '#FFD23F', col = INK, size = 40, w }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <rect x={-(w || text.length * size * 0.66 + 60) / 2} y={-size * 0.85} width={w || text.length * size * 0.66 + 60} height={size * 1.7} rx={size * 0.85} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={col}>{text}</text></g>);

/* 1 — hook: switches flip one by one all the way to 450 */
function ArtDial({ T, t, dur }) {
  const D = Math.max(2.5, dur || 4);
  const lit = 10 * tw(t, 0.2, D * 0.8);
  const shake = lit > 9.5 ? osc(T, 0.09) * 3 : 0;
  return (<g>
    <circle cx="486" cy="1180" r="420" fill="#264684" />
    <g transform={`translate(${shake} 0)`}><Panel x={486} y={1120} s={1.05} lit={lit} T={T} /></g>
    <g transform={`translate(${170 + 61 * 1.05 * Math.min(9, Math.floor(Math.max(0, lit - 0.01)))} 1330)`}>
      <path d="M0 0 L-18 -40 L18 -40 Z" fill="#FFD23F" /></g>
    <Chip x={486} y={1540} text="450 VOLTS" k={pop(t, D * 0.85, 0.35)} fill="#B3202A" col="#fff" size={48} />
  </g>);
}

/* 2 — Sam is sure he'd stop */
function ArtSure({ T, t }) {
  const k = pop(t, 0.4, 0.4);
  return (<g>
    <T2Bust who="sam" x={486} y={1260} T={T} mood="smug" />
    <g transform={`translate(560 800) scale(${k})`}>
      <circle cx="-150" cy="170" r="18" fill="#fff" /><circle cx="-110" cy="120" r="26" fill="#fff" />
      <ellipse cx="40" cy="0" rx="250" ry="120" fill="#fff" />
      <text x="40" y="24" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="72" fill={INK}>I'D STOP.</text></g>
  </g>);
}

/* 3 — Yale 1963: a volunteer at the panel; through the wall a speaker — the learner is an actor (theatre masks) */
function ArtYale({ T, t }) {
  return (<g>
    <rect x="0" y="640" width="972" height="1088" fill="#1F5560" />
    <rect x="560" y="640" width="30" height="1088" fill="#163F47" />
    <Chip x={300} y={740} text="YALE · 1963" k={pop(t, 0.1)} size={42} />
    <T2Bust who="sam" x={270} y={1240} s={0.62} T={T} mood="nervous" look={18} disc={false} />
    <Panel x={290} y={1570} s={0.62} lit={2} T={T} />
    <g transform="translate(780 1020)"><rect x="-90" y="-110" width="180" height="220" rx="24" fill="#3A3F4B" />
      {[...Array(5)].map((_, i) => <rect key={i} x="-60" y={-70 + i * 30} width="120" height="12" rx="6" fill="#20232B" />)}
      {[0, 1, 2].map((i) => { const p = ((T * 0.8 + i / 3) % 1); return <path key={i} d={`M${-120 - p * 60} ${-40} Q${-140 - p * 60} 0 ${-120 - p * 60} 40`} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity={(1 - p) * 0.8} />; })}</g>
    <g transform={`translate(780 1340) scale(${pop(t, 1.2, 0.4)})`}>
      <path d="M-110 -70 Q-40 -90 0 -70 L0 20 Q-50 90 -110 20 Z" fill="#FFD23F" />
      <circle cx="-74" cy="-30" r="12" fill={INK} /><circle cx="-36" cy="-30" r="12" fill={INK} /><path d="M-80 20 Q-55 45 -30 20" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M10 -60 Q70 -80 110 -60 L110 30 Q60 100 10 30 Z" fill={CREAM} />
      <circle cx="46" cy="-20" r="12" fill={INK} /><circle cx="84" cy="-20" r="12" fill={INK} /><path d="M40 50 Q65 25 90 50" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" /></g>
    <Chip x={780} y={1520} text="ACTOR" k={pop(t, 1.4, 0.35)} size={40} />
  </g>);
}

/* 4 — the experts' guess: one lit dot in a field of a thousand */
function ArtGuess({ T, t }) {
  const cols = 40, rows = 25, g = tw(t, 0.1, 1.0), hot = pop(t, 1.2, 0.4);
  const dots = [];
  for (let i = 0; i < cols * rows; i++) { const c = i % cols, r = Math.floor(i / cols);
    if (hsh(i * 3.1) > g) continue;
    dots.push(<circle key={i} cx={126 + c * 18.5} cy={760 + r * 26} r="6" fill={INK} opacity="0.28" />); }
  return (<g>
    <rect x="96" y="730" width="780" height="690" rx="30" fill="#F2D86E" />
    {dots}
    <g transform={`translate(${126 + 23 * 18.5} ${760 + 11 * 26})`}><circle r={30 * hot} fill="#B3202A" opacity="0.25" /><circle r={9 + 4 * hot} fill="#B3202A" /></g>
    <Chip x={486} y={1500} text="EXPERTS' GUESS: 1 IN 1,000" k={pop(t, 0.5, 0.35)} fill={INK} col="#fff" size={36} />
  </g>);
}

/* 5 — the result: 26 of 40 heads light up; a lab-coat clipboard says "please continue" */
function ArtResult({ T, t, dur }) {
  const D = Math.max(3, dur || 6), n = Math.round(26 * tw(t, 0.3, D * 0.45));
  return (<g>
    <g transform="translate(486 1000)">{[...Array(40)].map((_, i) => { const c = i % 8, r = Math.floor(i / 8), on = i < n;
      return (<g key={i} transform={`translate(${(c - 3.5) * 92} ${(r - 2) * 98})`}>
        <circle cy="-16" r="22" fill={on ? '#FFD23F' : '#7E1A22'} /><path d="M-34 34 Q-34 6 0 6 Q34 6 34 34 Z" fill={on ? '#FFD23F' : '#7E1A22'} /></g>); })}</g>
    <text x="486" y="1350" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="96" fill="#fff">{n} / 40</text>
    <g transform={`translate(486 1530) rotate(-3) scale(${pop(t, D * 0.6, 0.4)})`}>
      <rect x="-250" y="-62" width="500" height="124" rx="20" fill="#fff" />
      <path d="M-250 -62 L-180 -62 L-215 -10 Z" fill="#E9E4D8" />
      <text y="18" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="46" fill={INK}>"PLEASE CONTINUE."</text></g>
  </g>);
}

/* 6 — the turn: two volunteers refuse → the count drops from 26 to 4 */
function ArtRefuse({ T, t, dur }) {
  const D = Math.max(3, dur || 5), r = tw(t, 0.3, 0.5), drop = tw(t, D * 0.45, 0.9), n = Math.round(26 - 22 * drop);
  return (<g>
    <T2Bust who="priya" x={230} y={1250} s={0.5} T={T} mood="angry" disc={false} />
    <T2Bust who="sam" x={742} y={1250} s={0.5} T={T} mood="angry" disc={false} />
    {[230, 742].map((x, i) => <g key={i} transform={`translate(${x} ${1010 - 30 * r}) scale(${pop(t, 0.3 + i * 0.2, 0.35)})`}>
      <rect x="-90" y="-50" width="180" height="100" rx="18" fill="#141821" /><text y="22" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="60" fill="#fff">NO</text></g>)}
    <g transform="translate(486 1500)"><rect x="-200" y="-90" width="400" height="180" rx="30" fill="#fff" />
      <text y="38" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="110" fill={drop > 0.5 ? '#3E8E5A' : '#B3202A'}>{n}/40</text></g>
  </g>);
}

/* 7 — name it: Grace, and an empty lab coat on a hanger casting a giant shadow */
function ArtGrace({ T, t }) {
  const sw = osc(T, 2.4) * 4;
  return (<g>
    <T2Bust who="grace" x={600} y={1300} s={0.85} T={T} mood="calm" look={-12} />
    <g transform={`translate(220 760) rotate(${sw}) scale(${pop(t, 0.2, 0.4)})`}>
      <path d="M0 -40 Q0 -70 22 -70 Q40 -70 40 -52" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
      <path d="M-120 20 L0 -40 L120 20" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      <path d="M-110 20 L-40 0 L0 120 L40 0 L110 20 L130 380 L-130 380 Z" fill="#F7F4EE" />
      <path d="M-40 0 L0 120 L40 0" fill="none" stroke="#C9C0AE" strokeWidth="8" />
      <rect x="40" y="170" width="60" height="70" rx="8" fill="#E1DACB" /><rect x="58" y="150" width="8" height="40" rx="4" fill="#264684" />
      <Chip x={0} y={460} text="AUTHORITY" k={1} fill={INK} col="#fff" size={34} /></g>
  </g>);
}

/* 8 — outro: Sam says NO and the ripple turns the others' lights green */
function ArtVoice({ T, t }) {
  const k = pop(t, 0.3, 0.4);
  return (<g>
    <T2Bust who="sam" x={486} y={1300} s={0.85} T={T} mood="calm" />
    {[0, 1, 2].map((i) => { const p = ((T * 0.5 + i / 3) % 1); return <circle key={i} cx="486" cy="900" r={120 + p * 380} fill="none" stroke="#FFD23F" strokeWidth="8" opacity={(1 - p) * 0.7 * k} />; })}
    <g transform={`translate(486 900) scale(${k})`}><rect x="-140" y="-80" width="280" height="160" rx="40" fill="#FFD23F" />
      <path d="M-30 78 L-60 140 L20 78 Z" fill="#FFD23F" />
      <text y="38" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="110" fill={INK}>NO.</text></g>
    {[...Array(6)].map((_, i) => { const a = -Math.PI * (0.1 + i * 0.16), on = tw(t, 1.0 + i * 0.2, 0.3);
      return (<g key={i} transform={`translate(${486 + Math.cos(a) * 400} ${1150 + Math.sin(a) * 300 * -1 + 0})`}>
        <circle cy="-14" r="20" fill={on > 0.5 ? '#3E8E5A' : '#9FA7B5'} /><path d="M-30 30 Q-30 6 0 6 Q30 6 30 30 Z" fill={on > 0.5 ? '#3E8E5A' : '#9FA7B5'} /></g>); })}
  </g>);
}

Object.assign(window, { ArtDial, ArtSure, ArtYale, ArtGuess, ArtResult, ArtRefuse, ArtGrace, ArtVoice });
})();
