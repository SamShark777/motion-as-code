// art.jsx — "Just the Couch" (Maya ep. 2, door-in-the-face). Stick cast from stick-kit.jsx; ground at y=1150.
const GY = 1150, Y = '#F5D33A', W = '#F2F2F2', CORAL = '#FF6B5B', TEAL = '#3FC1C9';
const HW = "'Caveat Brush', cursive";
function Box({ x, y, s = 1 }) { return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-70" y="-110" width="140" height="110" fill="#0b0b0b" stroke={W} strokeWidth="7" /><line x1="-70" y1="-80" x2="70" y2="-80" stroke={W} strokeWidth="5" /></g>; }
function Couch({ x, y, s = 1, col = W }) { return <g transform={`translate(${x} ${y}) scale(${s})`}>
  <path d="M-170 0 L-170 -90 L-130 -90 L-130 -40 L130 -40 L130 -90 L170 -90 L170 0" fill="none" stroke={col} strokeWidth="9" strokeLinejoin="round" />
  <path d="M-130 -40 L-130 -150 L130 -150 L130 -40" fill="none" stroke={col} strokeWidth="9" strokeLinejoin="round" /><line x1="-150" y1="0" x2="-150" y2="20" stroke={col} strokeWidth="9" /><line x1="150" y1="0" x2="150" y2="20" stroke={col} strokeWidth="9" /></g>; }
function Door({ x, y, open = 0 }) { return <g><rect x={x} y={y} width="220" height={GY - y} fill="none" stroke={W} strokeWidth="9" />
  <g transform={`translate(${x} ${y}) scale(${1 - open * 0.8} 1)`}><rect x="0" y="0" width="220" height={GY - y} fill="#0b0b0b" stroke={W} strokeWidth="9" /><circle cx="190" cy={(GY - y) / 2} r="11" fill={W} /></g></g>; }

/* 1 — Maya with a mountain of boxes, asking Kabir */
function ArtS9Move({ T, t }) {
  return (<g><StickGround y={GY} />
    {[[600, 1150], [740, 1150], [880, 1150], [670, 1040], [810, 1040], [740, 930]].map(([x, y], i) => <Box key={i} x={x} y={y} s={1} />)}
    <text x="740" y="760" textAnchor="middle" fontFamily={HW} fontSize="64" fill={CORAL}>Sat + Sun</text>
    <Stick who="maya" x={420} y={GY} pose="point" mood="smug" T={T} />
    <Stick who="kabir" x={170} y={GY} pose="stand" mood="happy" T={T} s={0.85} />
  </g>);
}

/* 2 — Kabir: NO. Maya: just the couch? */
function ArtS9No({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="kabir" x={280} y={GY} pose="cross" mood="angry" T={T} />
    <StickBubble x={300} y={520} w={240} h={120} text="nope" size={64} tail={1} />
    <Stick who="maya" x={800} y={GY} pose="shrug" mood="happy" T={T} dir={-1} />
    {t > 1.1 && <StickBubble x={740} y={500} w={380} h={120} text="just the couch?" size={50} color={CORAL} tail={1} />}
  </g>);
}

/* 3 — Kabir already carrying the couch, confused */
function ArtS9Couch({ T, t }) {
  const x = 300 + Math.min(1, t / 2.2) * 340;
  return (<g><StickGround y={GY} />
    <g transform={`translate(${x} 0)`}><Couch x={0} y={540} s={0.8} col={TEAL} /></g>
    <Stick who="kabir" x={x} y={GY} pose="head" mood="happy" T={T} />
    {t > 1.2 && <StickMark x={x + 150} y={560} kind="?" T={T} size={100} color={W} />}
    <Stick who="maya" x={940} y={GY} pose="hips" mood="smug" T={T} dir={-1} s={0.8} />
  </g>);
}

/* 4 — the real ask was small all along: the boxes fade, the couch glows */
function ArtS9But({ T, t }) {
  const f = Math.min(1, t / 1.0);
  return (<g><StickGround y={GY} />
    <g opacity={1 - 0.8 * f}>{[[180, 1150], [320, 1150], [250, 1040]].map(([x, y], i) => <Box key={i} x={x} y={y} s={0.9} />)}</g>
    <Couch x={700} y={1130} s={1} col={f > 0.5 ? Y : W} />
    <Stick who="maya" x={700} y={900} pose="cross" mood="smug" T={T} s={0.45} />
  </g>);
}

/* 5 — 1975: a tiny zoo-trip flyer, only 17% sign up */
function ArtS9Zoo({ T, t }) {
  return (<g><StickGround y={GY} />
    <g transform="translate(540 680)"><rect x="-230" y="-200" width="460" height="320" rx="14" fill="#0b0b0b" stroke={W} strokeWidth="8" />
      <text y="-110" textAnchor="middle" fontFamily={HW} fontSize="58" fill={W}>1 day at the zoo</text>
      <text y="-30" textAnchor="middle" fontFamily={HW} fontSize="44" fill="#8a8a8a">chaperone needed</text>
      <text y="80" textAnchor="middle" fontFamily={HW} fontSize="110" fill={Y}>17%</text></g>
    {[0, 1, 2, 3, 4, 5].map((i) => <Stick key={i} who="extra" x={140 + i * 160} y={GY} pose={i === 2 ? 'wave' : 'stand'} mood={i === 2 ? 'happy' : 'neutral'} T={T} ph={i * 0.2} s={0.4} op={i === 2 ? 1 : 0.55} />)}
  </g>);
}

/* 6 — the huge ask first (2 years!) → rejected → zoo yes 50% */
function ArtS9Years({ T, t }) {
  const p = Math.min(1, t / 0.8), q = Math.min(1, Math.max(0, (t - 1.3) / 0.6));
  return (<g><StickGround y={GY} />
    <g transform="translate(320 640)"><rect x="-200" y="-140" width="400" height="230" rx="14" fill="#0b0b0b" stroke={W} strokeWidth="8" />
      <text y="-50" textAnchor="middle" fontFamily={HW} fontSize="58" fill={W}>volunteer</text>
      <text y="30" textAnchor="middle" fontFamily={HW} fontSize="70" fill={CORAL}>2 YEARS</text>
      <path d={`M-170 -110 L${-170 + 340 * p} ${-110 + 180 * p}`} stroke={CORAL} strokeWidth="12" strokeLinecap="round" /></g>
    <g opacity={q}><text x="780" y="700" textAnchor="middle" fontFamily={HW} fontSize="60" fill={W}>zoo trip?</text>
      <text x="780" y="830" textAnchor="middle" fontFamily={HW} fontSize="140" fill={Y}>50%</text></g>
    {[0, 1, 2, 3].map((i) => <Stick key={i} who="extra" x={640 + i * 100} y={GY} pose={i % 2 ? 'stand' : 'wave'} mood="happy" T={T} ph={i * 0.3} s={0.4} op={q} />)}
  </g>);
}

/* 7 — door in the face: a door slams (big no), then a small door opens */
function ArtS9Name({ T, t }) {
  const o = Math.min(1, Math.max(0, (t - 1.0) / 0.6));
  return (<g><StickGround y={GY} />
    <Door x={160} y={640} open={0} />
    <text x="270" y="580" textAnchor="middle" fontFamily={HW} fontSize="64" fill={CORAL}>big no</text>
    <Door x={680} y={820} open={o} />
    <text x="790" y="770" textAnchor="middle" fontFamily={HW} fontSize="64" fill={Y}>small yes</text>
    <Stick who="maya" x={540} y={GY} pose="stand" mood="smug" T={T} s={0.6} />
  </g>);
}

/* 8 — Kabir relieved on the couch; Maya smiling, a bookshelf behind her */
function ArtS9End({ T, t }) {
  return (<g><StickGround y={GY} />
    <Couch x={330} y={1130} s={0.9} col={TEAL} />
    <Stick who="kabir" x={330} y={1100} pose="sit" mood="happy" T={T} s={0.7} />
    <path d="M760 1150 L760 700 L960 700 L960 1150 M760 850 L960 850 M760 1000 L960 1000" fill="none" stroke={W} strokeWidth="8" strokeLinejoin="round" />
    <Stick who="maya" x={640} y={GY} pose="hips" mood="smug" T={T} dir={-1} s={0.85} />
    {t > 1.3 && <StickMark x={860} y={640} kind="next…" T={T} size={60} color={CORAL} />}
  </g>);
}

Object.assign(window, { ArtS9But, ArtS9Couch, ArtS9End, ArtS9Move, ArtS9Name, ArtS9No, ArtS9Years, ArtS9Zoo });
