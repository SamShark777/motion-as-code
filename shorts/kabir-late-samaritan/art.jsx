// art.jsx — "Running Late" (Kabir ep. 3, the Good Samaritan experiment). Stick cast from stick-kit.jsx; ground at y=1150.
const GY = 1150, Y = '#F5D33A', W = '#F2F2F2', TEAL = '#3FC1C9';
const HW = "'Caveat Brush', cursive";
function Clock({ x, y, r = 90, T = 0, fast = 1 }) { const a = T * 360 * fast;
  return <g transform={`translate(${x} ${y})`}><circle r={r} fill="#0b0b0b" stroke={W} strokeWidth="8" />
    <line x1="0" y1="0" x2="0" y2={-r * 0.55} stroke={W} strokeWidth="8" strokeLinecap="round" transform={`rotate(${a / 12})`} />
    <line x1="0" y1="0" x2="0" y2={-r * 0.8} stroke={Y} strokeWidth="6" strokeLinecap="round" transform={`rotate(${a})`} /></g>; }
function Doorway({ x = 760 }) { return <path d={`M${x - 140} ${GY} L${x - 140} 700 L${x + 140} 700 L${x + 140} ${GY}`} fill="none" stroke={W} strokeWidth="9" strokeLinejoin="round" />; }
function Slumped({ x, T }) { // a stranger sitting slumped against the doorway, head down
  return <g transform={`translate(${x} 0)`}><Stick who="extra" x={0} y={GY} pose="sit" mood="sad" T={T} s={0.8} />
    <text x="70" y={760 + STICK.osc(T, 1.1) * 6} fontFamily={HW} fontSize="54" fill="#8a8a8a">cough</text></g>;
}
function Paper({ x, y, rot }) { return <g transform={`translate(${x} ${y}) rotate(${rot})`}><rect x="-36" y="-46" width="72" height="92" rx="4" fill="#0b0b0b" stroke={W} strokeWidth="6" /><line x1="-20" y1="-16" x2="20" y2="-16" stroke={W} strokeWidth="4" /><line x1="-20" y1="6" x2="14" y2="6" stroke={W} strokeWidth="4" /></g>; }

/* 1 — Kabir, alarm clock spinning, exam sign */
function ArtS8Late({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="kabir" x={330} y={GY} pose="head" mood="shocked" T={T} />
    <Clock x={760} y={640} r={130} T={T} fast={2} />
    <text x="760" y="900" textAnchor="middle" fontFamily={HW} fontSize="80" fill={Y}>EXAM 9:00</text>
  </g>);
}

/* 2 — sprinting, notes flying behind */
function ArtS8Run({ T, t }) {
  const x = 200 + ((t * 260) % 760);
  return (<g><StickGround y={GY} />
    {[0, 1, 2, 3].map((i) => { const p = ((T * 0.9 + i / 4) % 1); return <Paper key={i} x={x - 120 - p * 320} y={700 + p * 300 + i * 20} rot={p * 300 + i * 40} />; })}
    <Stick who="kabir" x={x} y={GY} pose="walk" mood="worried" T={T * 2} />
    {[0, 1, 2].map((i) => <line key={i} x1={x - 130} y1={800 + i * 70} x2={x - 230} y2={800 + i * 70} stroke="#8a8a8a" strokeWidth="6" strokeLinecap="round" />)}
  </g>);
}

/* 3 — a man slumped in a doorway; Kabir runs right past */
function ArtS8Past({ T, t }) {
  const x = 980 - Math.min(1, t / 2.4) * 860;
  return (<g><StickGround y={GY} />
    <Doorway x={600} /><Slumped x={600} T={T} />
    <Stick who="kabir" x={x} y={GY} pose="walk" mood="worried" T={T * 2} dir={-1} />
  </g>);
}

/* 4 — kindness ✓, time ✗ : a heart and a ticking clock */
function ArtS8But({ T, t }) {
  return (<g><StickGround y={GY} />
    <path transform="translate(330 700) scale(1.8)" d="M0 30 C-60 -10 -40 -60 0 -30 C40 -60 60 -10 0 30 Z" fill="none" stroke={W} strokeWidth="5" />
    <text x="330" y="900" textAnchor="middle" fontFamily={HW} fontSize="80" fill={W}>✓</text>
    <Clock x={750} y={690} r={120} T={T} fast={3} />
    <text x="750" y="900" textAnchor="middle" fontFamily={HW} fontSize="80" fill={Y}>✗</text>
    <Stick who="kabir" x={540} y={GY} pose="shrug" mood="sad" T={T} s={0.55} />
  </g>);
}

/* 5 — 1973: seminary student with "Good Samaritan" talk notes, same doorway */
function ArtS8Study({ T, t }) {
  return (<g><StickGround y={GY} />
    <Doorway x={780} /><Slumped x={780} T={T} />
    <Stick who="extra" x={300} y={GY} pose="phone" mood="worried" T={T} />
    <g transform="translate(300 560)"><rect x="-190" y="-60" width="380" height="110" rx="10" fill="#0b0b0b" stroke={Y} strokeWidth="7" />
      <text y="16" textAnchor="middle" fontFamily={HW} fontSize="50" fill={Y}>talk: Good Samaritan</text></g>
  </g>);
}

/* 6 — two bars: 63% (time to spare) vs 10% (late) */
function ArtS8Bars({ T, t }) {
  const p = Math.min(1, t / 1.2), q = Math.min(1, Math.max(0, (t - 1.6) / 0.8));
  return (<g><StickGround y={GY} />
    <rect x="250" y={1140 - 600 * p * 0.63 * 1.4} width="200" height={600 * p * 0.63 * 1.4} fill={W} rx="8" />
    <rect x="630" y={1140 - 600 * q * 0.10 * 1.4} width="200" height={600 * q * 0.10 * 1.4} fill={Y} rx="8" />
    <text x="350" y={1110 - 600 * p * 0.63 * 1.4} textAnchor="middle" fontFamily={HW} fontSize="90" fill={W}>63%</text>
    {q > 0 && <text x="730" y={1110 - 600 * q * 0.10 * 1.4} textAnchor="middle" fontFamily={HW} fontSize="90" fill={Y}>10%</text>}
    <Clock x={730} y={760} r={60} T={T} fast={3} />
  </g>);
}

/* 7 — situation beats character: a huge clock looming over a tiny figure */
function ArtS8Name({ T, t }) {
  return (<g><StickGround y={GY} />
    <Clock x={620} y={700} r={230} T={T} fast={1.5} />
    <Stick who="extra" x={240} y={GY} pose="walk" mood="worried" T={T * 2} s={0.7} />
    <Slumped x={860} T={T} />
  </g>);
}

/* 8 — next time: Kabir crouches to help… clock still says late */
function ArtS8Again({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="kabir" x={480} y={GY} pose="point" mood="happy" T={T} />
    <Slumped x={720} T={T} />
    {t > 1.6 && <g><Clock x={240} y={600} r={90} T={T} fast={3} /><text x="240" y="760" textAnchor="middle" fontFamily={HW} fontSize="64" fill={Y}>late. again.</text></g>}
  </g>);
}

Object.assign(window, { ArtS8Again, ArtS8Bars, ArtS8But, ArtS8Late, ArtS8Name, ArtS8Past, ArtS8Run, ArtS8Study });
