// art.jsx — "Ten Cents" (Maya ep. 1, the bat-and-ball question). Stick cast from stick-kit.jsx; ground at y=1150.
const GY = 1150, Y = '#F5D33A', W = '#F2F2F2', CORAL = '#FF6B5B';
const HW = "'Caveat Brush', cursive";
function Bat({ x, y, s = 1, rot = -30 }) { return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><path d="M-14 120 L-10 -10 Q0 -150 10 -10 L14 120 Z" fill="none" stroke={W} strokeWidth="8" strokeLinejoin="round" /><line x1="-16" y1="128" x2="16" y2="128" stroke={W} strokeWidth="8" strokeLinecap="round" /></g>; }
function Ball({ x, y, r = 34, col = W }) { return <g><circle cx={x} cy={y} r={r} fill="none" stroke={col} strokeWidth="8" /><path d={`M${x - r * 0.6} ${y - r * 0.7} q${r * 0.5} ${r * 0.7} 0 ${r * 1.4}`} fill="none" stroke={col} strokeWidth="5" /></g>; }
function Tag({ x, y, txt, col = Y, size = 70 }) { return <text x={x} y={y} textAnchor="middle" fontFamily={HW} fontSize={size} fill={col}>{txt}</text>; }

/* 1 — Arjun reads the riddle off his phone; bat + ball = $1.10 */
function ArtS5Riddle({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={230} y={GY} pose="phone" mood="happy" T={T} />
    <Stick who="maya" x={880} y={GY} pose="cross" mood="smug" T={T} dir={-1} />
    <Bat x={470} y={600} s={0.9} /><Tag x={560} y={620} txt="+" col={W} size={90} /><Ball x={640} y={600} />
    <Tag x={560} y={500} txt="= $1.10" size={84} />
  </g>);
}

/* 2 — the catch: the bat costs $1 more */
function ArtS5Catch({ T, t }) {
  return (<g><StickGround y={GY} />
    <Bat x={420} y={700} s={1.3} rot={0} /><Ball x={720} y={820} r={44} />
    <path d="M500 560 Q620 470 720 740" fill="none" stroke={Y} strokeWidth="8" strokeDasharray="20 14" />
    <Tag x={640} y={500} txt="$1 more" size={80} />
    <Stick who="arjun" x={160} y={GY} pose="point" mood="happy" T={T} s={0.7} />
  </g>);
}

/* 3 — Maya, instant answer: 10¢ */
function ArtS5Instant({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="maya" x={360} y={GY} pose="hips" mood="smug" T={T} />
    <StickBubble x={760} y={600} w={340} h={180} text="10¢" size={110} color={CORAL} tail={-1} />
    <Stick who="arjun" x={900} y={GY} pose="stand" mood="shocked" T={T} s={0.75} dir={-1} />
  </g>);
}

/* 4 — Arjun checks: 10¢ + $1.10 = $1.20 */
function ArtS5Check({ T, t }) {
  const p = Math.min(1, t / 1.2);
  return (<g><StickGround y={GY} />
    <g transform="translate(560 680)"><rect x="-260" y="-200" width="520" height="340" rx="14" fill="#0b0b0b" stroke={W} strokeWidth="8" />
      <Tag x={0} y={-110} txt="ball  10¢" col={W} size={64} /><Tag x={0} y={-30} txt="bat  $1.10" col={W} size={64} />
      <line x1="-180" y1="10" x2="180" y2="10" stroke={W} strokeWidth="6" />
      <g opacity={p}><Tag x={0} y={100} txt="= $1.20" col={CORAL} size={84} /></g></g>
    <Stick who="arjun" x={200} y={GY} pose="point" mood="smug" T={T} s={0.75} />
    {t > 1.2 && <StickMark x={920} y={620} kind="✗" T={T} size={130} color={CORAL} />}
  </g>);
}

/* 5 — Maya isn't bad at math: a confident brain sprinting past a slow one */
function ArtS5But({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="maya" x={300} y={GY} pose="shrug" mood="worried" T={T} />
    <StickBubble x={740} y={640} w={420} h={300} think text="" tail={-1} />
    <Tag x={740} y={620} txt="fast ⚡" size={70} /><Tag x={740} y={720} txt="slow 🐢" col="#8a8a8a" size={60} />
  </g>);
}

/* 6 — 2005: three campuses, half the students raise "10¢" */
function ArtS5Study({ T, t }) {
  return (<g><StickGround y={GY} />
    {[0, 1, 2, 3, 4, 5].map((i) => { const x = 140 + i * 160, up = i % 2 === 0;
      return <g key={i}><Stick who="extra" x={x} y={GY} pose={up ? 'wave' : 'stand'} mood={up ? 'smug' : 'neutral'} T={T} ph={i * 0.3} s={0.62} />
        {up && <Tag x={x + 40} y={760} txt="10¢" col={CORAL} size={54} />}</g>; })}
    <Tag x={540} y={560} txt="≈ 1 in 2" size={110} />
  </g>);
}

/* 7 — two brains: the fast answer jumps the queue */
function ArtS5Name({ T, t }) {
  const p = Math.min(1, t / 1.0);
  return (<g><StickGround y={GY} />
    <Stick who="maya" x={220} y={GY} pose="stand" mood="smug" T={T} s={0.8} />
    <rect x="420" y="620" width="560" height="120" rx="60" fill="none" stroke={W} strokeWidth="8" />
    <rect x="420" y="820" width="560" height="120" rx="60" fill="none" stroke="#8a8a8a" strokeWidth="8" />
    <Tag x={460 + p * 400} y={700} txt="10¢" col={CORAL} size={64} />
    <Tag x={460 + p * 80} y={900} txt="check…" col="#8a8a8a" size={54} />
    <Tag x={700} y={560} txt="feels right" size={70} />
  </g>);
}

/* 8 — the answer 5¢; Maya arms crossed, "rigged" */
function ArtS5Answer({ T, t }) {
  return (<g><StickGround y={GY} />
    <Ball x={540} y={560} r={60} col={Y} /><Tag x={540} y={720} txt="5¢" size={130} />
    <Stick who="maya" x={300} y={GY} pose="cross" mood="angry" T={T} s={0.85} />
    <Stick who="arjun" x={820} y={GY} pose="shrug" mood="happy" T={T} s={0.85} dir={-1} />
    {t > 1.4 && <StickBubble x={320} y={540} w={260} h={110} text="rigged" size={56} color={CORAL} tail={-1} />}
  </g>);
}

Object.assign(window, { ArtS5Answer, ArtS5But, ArtS5Catch, ArtS5Check, ArtS5Instant, ArtS5Name, ArtS5Riddle, ArtS5Study });
