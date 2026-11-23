// art.jsx — "5 Signs Your Brain Is Stuck on Replay" (Arthur ep. 13, with The Critic; retro modern illustration; signs-list).
// Rumination and nature: Bratman, Hamilton, Hahn, Daily & Gross 2015 (PNAS) — a 90-minute walk in a natural area (vs beside
// a busy road) lowered self-reported rumination and subgenual prefrontal cortex activity. No numbers on screen beyond 90 MIN.
// Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540; keep faces/numbers out of 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif", OSW = "'Oswald', sans-serif";
const blink = (T, ph = 0) => (((T + ph) % 3.3) > 3.18 ? 1 : 0);

// numbered sign card at the top (same layout as the other signs-list episodes)
function SignCard({ n, label, t, col = P.yel }) {
  const k = EO(t / 0.3);
  return (<g opacity={k} transform={`translate(0 ${lp(-40, 0, k)})`}>
    <circle cx={190} cy={250} r={96} fill={P.blk} transform="translate(10 10)" /><circle cx={190} cy={250} r={96} fill={col} {...ink(8)} />
    <text x={190} y={292} textAnchor="middle" fontFamily={BEB} fontSize="130" fill={P.blk}>{n}</text>
    <text x={320} y={235} fontFamily={OSW} fontWeight="700" fontSize="46" fill={P.cream}>SIGN {n} OF 5</text>
    <text x={320} y={300} fontFamily={BEB} fontSize="62" letterSpacing="2" fill={col}>{label}</text></g>);
}
// a walking shoe (side view), toe to the right
function Shoe({ x, y, s = 1, rot = 0, col = P.red }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-170 40 L-170 -90 Q-160 -130 -110 -120 L-40 -100 Q40 -40 150 -20 Q200 -10 200 40 Z" fill={P.blk} transform="translate(10 10)" />
    <path d="M-170 40 L-170 -90 Q-160 -130 -110 -120 L-40 -100 Q40 -40 150 -20 Q200 -10 200 40 Z" fill={col} {...ink(7)} />
    <rect x="-176" y="30" width="382" height="34" rx="10" fill={P.cream} {...ink(6)} />
    {[0, 1, 2].map((i) => <line key={i} x1={-70 + i * 40} y1={-88 + i * 20} x2={-30 + i * 40} y2={-104 + i * 20} {...ink(6)} />)}</g>);
}
// stylised tree: indigo canopy + black trunk
function Tree({ x, y, s = 1, seed = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-18" y="-40" width="36" height="160" fill={P.blk} />
    {[...Array(5)].map((_, i) => <circle key={i} cx={-70 + hsh(seed + i) * 140} cy={-120 - hsh(seed + i + 9) * 120} r={70 + hsh(seed + i + 20) * 30} fill={i % 2 ? P.blue : '#243C74'} {...ink(5)} />)}</g>);
}
// a car seen from the side
function Car({ x, y, col = P.yel, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-120 0 L-110 -50 L-50 -90 L60 -90 L110 -50 L130 0 Z" fill={col} {...ink(6)} />
    <rect x="-40" y="-80" width="80" height="34" fill={P.cream} {...ink(4)} /><circle cx="-70" cy="4" r="24" fill={P.blk} /><circle cx="80" cy="4" r="24" fill={P.blk} /></g>);
}
// replay button
function Replay({ x, y, r = 110, press = 0 }) {
  return (<g transform={`translate(${x} ${y + press * 14})`}><circle r={r} fill={P.blk} transform={`translate(${12 - press * 10} ${12 - press * 10})`} /><circle r={r} fill={P.red} {...ink(8)} />
    <path d={`M${-r * 0.45} ${-r * 0.15} A${r * 0.5} ${r * 0.5} 0 1 1 ${-r * 0.3} ${r * 0.35}`} fill="none" stroke={P.cream} strokeWidth={r * 0.14} strokeLinecap="round" />
    <path d={`M${-r * 0.7} ${-r * 0.35} L${-r * 0.42} ${r * 0.08} L${-r * 0.15} ${-r * 0.3} Z`} fill={P.cream} /></g>);
}

/* 1 — hook: Arthur at his desk, day three, the same worry circling */
function RMRWorry({ T, t, beats }) {
  return (<g><RMBg kind="red" waves={false} /><RMLoopRings T={T * 0.6} text="DID I SAY IT WRONG?" cx={540} cy={860} />
    <RMArthur x={540} y={880} s={0.6} mouth="frown" brow="sad" lid={0.5} look={[0, -0.3]} />
    <RMChip x={540} y={220} text="DAY 3 · SAME WORRY" col={P.yel} size={54} pop={t / 0.25} />
    <rect x="120" y="1290" width="840" height="60" fill={P.blk} /></g>);
}
/* 2 — to the viewer: "5 SIGNS" title; the Critic hovers over the replay button */
function RMRFive({ T, t, beats }) {
  const press = SM(bt(beats, 2, 0.9) - 0.1, bt(beats, 2, 0.9) + 0.15, t);
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['5 SIGNS', P.yel, 210], ['YOUR BRAIN\'S ON REPLAY', P.cream, 92]]} y={260} a={EO(t / 0.35)} />
    <RMCritic x={540} y={1010} s={0.75} mouth="grin" lid={0.45} look={[0.4, 0.5]} blink={blink(T)} />
    <Replay x={820} y={1280} r={100} press={press} />
    <RMHand x={840} y={lp(500, 1080, EO(t / 0.6)) + press * 30} s={0.55} rot={0.12} press={press} /></g>);
}
/* 3 — snapback: the loop rings fade; a pair of walking shoes drops in */
function RMRShoes({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.3), k = EO((t - c3 + 0.1) / 0.4);
  return (<g><RMBg kind="redDark" />
    <g opacity={1 - 0.8 * k}><RMLoopRings T={T * 0.6} text="WHAT IF WHAT IF" cx={540} cy={1000} /></g>
    <RMTitle lines={[['THE FIX ISN\'T', P.cream, 110], ['IN YOUR HEAD', P.cream, 110]]} y={240} a={EO(t / 0.3)} />
    {k > 0 && <g transform={`translate(0 ${(1 - k) * -500})`}><Shoe x={400} y={1100} s={1.1} rot={-6} /><Shoe x={700} y={1200} s={1.1} rot={4} col={P.yel} /></g>}
    {k > 0 && <RMChip x={540} y={760} text="IT'S IN YOUR SHOES" col={P.yel} size={58} pop={(t - c3) / 0.25} />}</g>);
}
/* 4 — sign 1: the sentence you said, on replay */
function RMRSign1({ T, t, beats }) {
  const n = Math.max(0, Math.min(3, Math.floor(t / 0.45) + 1));
  return (<g><RMBg kind="red" /><SignCard n={1} label="REPLAYING WHAT YOU SAID" t={t} />
    {[...Array(n)].map((_, i) => <RMSpeech key={i} x={400 + i * 70} y={560 + i * 160} text={'"SO, UM… YEAH"'} k={1} size={64} col={i === n - 1 ? P.red : '#7a6a64'} />)}
    <RMArthur x={800} y={1080} s={0.38} mouth="frown" brow="sad" lid={0.55} look={[-0.6, -0.4]} />
    <Replay x={250} y={1180} r={90} press={osc(T, 0.6) > 0 ? 1 : 0} /></g>);
}
/* 5 — sign 2: winning arguments in the shower */
function RMRSign2({ T, t, beats }) {
  return (<g><RMBg kind="blue" /><SignCard n={2} label="SHOWER ARGUMENTS" t={t} />
    <path d="M960 420 L960 520 Q960 560 920 560 L820 560" fill="none" {...ink(14)} />
    <path d="M760 540 L900 540 L880 590 L780 590 Z" fill={P.cream} {...ink(6)} />
    {[...Array(14)].map((_, i) => { const x = 790 + (i % 7) * 16, y = 620 + (((T * 900 + hsh(i) * 500) % 500)); return <line key={i} x1={x - (i % 7) * 4} y1={y} x2={x - (i % 7) * 4 - 6} y2={y + 30} stroke="#8FEFFF" strokeWidth="6" strokeLinecap="round" />; })}
    <RMArthur x={760} y={1020} s={0.5} body={false} mouth="shout" brow="angry" lid={0.2} look={[-0.5, 0]} />
    <RMSpeech x={380} y={720} text="AND ANOTHER THING!" k={(t - bt(beats, 2, 0.9) + 0.2) / 0.3} size={54} rot={-0.08} />
    <RMChip x={560} y={1300} text="WINNER: YOU (0 WITNESSES)" col={P.yel} size={36} pop={(t - bt(beats, 2, 0.9)) / 0.25} /></g>);
}
/* 6 — sign 3: bedtime, the loop gets louder */
function RMRSign3({ T, t, beats }) {
  const loud = SM(0, bt(beats, 2, 0.9) + 0.3, t);
  return (<g><RMBg kind="dark" />
    <g opacity={0.4 + 0.6 * loud}><RMLoopRings T={T * (0.6 + loud)} text="WHAT IF WHAT IF" cx={540} cy={960} /></g>
    <rect x="80" y="130" width="920" height="230" fill={P.blk} opacity="0.92" /><SignCard n={3} label="IT GETS LOUDER AT NIGHT" t={t} />
    <RMBulb x={860} y={430} T={T} on />
    <g transform="translate(540 1000) rotate(-90)"><RMArthur x={0} y={0} s={0.45} body={false} mouth="flat" brow="sad" lid={0.15} look={[0, -0.6]} /></g>
    <RMGrid x={170} y={1130} w={740} h={180} /></g>);
}
/* 7 — sign 4: "relaxing" on the sofa while gears grind overhead */
function RMRSign4({ T, t, beats }) {
  const gear = (cx, cy, r, dir) => (<g transform={`translate(${cx} ${cy}) rotate(${T * 60 * dir})`}>{[...Array(10)].map((_, i) => <rect key={i} x={-14} y={-r - 26} width="28" height="40" fill={P.yel} {...ink(5)} transform={`rotate(${i * 36})`} />)}
    <circle r={r} fill={P.yel} {...ink(7)} /><circle r={r * 0.35} fill={P.red} {...ink(6)} /></g>);
  return (<g><RMBg kind="red" /><SignCard n={4} label="'RELAXING'" t={t} />
    {gear(430, 560, 90, 1)}{gear(620, 520, 70, -1.3)}{gear(560, 690, 50, 1.6)}
    <RMArthur x={540} y={1020} s={0.45} mouth="flat" brow="flat" lid={0.6} look={[0, -0.6]} />
    <rect x="200" y="1180" width="680" height="150" rx="30" fill={P.blue} {...ink(8)} />
    <RMChip x={540} y={1240} text="DAY OFF" col={P.cream} size={44} pop={(t - 0.3) / 0.25} /></g>);
}
/* 8 — sign 5: the Critic sprints in a hamster wheel labelled THINKING IT OVER */
function RMRSign5({ T, t, beats }) {
  const r = 330, cx = 540, cy = 920;
  return (<g><RMBg kind="blue" /><SignCard n={5} label="OVERTHINKING = FIXING?" t={t} />
    <circle cx={cx} cy={cy} r={r} fill={P.cream} {...ink(10)} />
    <g transform={`translate(${cx} ${cy}) rotate(${T * 140})`}>{[...Array(16)].map((_, i) => <line key={i} x1={0} y1={0} x2={0} y2={-r} stroke={P.blk} strokeWidth="5" transform={`rotate(${i * 22.5})`} opacity="0.5" />)}</g>
    <circle cx={cx} cy={cy} r={r - 30} fill="none" stroke={P.red} strokeWidth="16" />
    <RMCritic x={cx} y={cy + 40 + Math.abs(osc(T, 0.3)) * 20} s={0.38} body={false} mouth="o" lid={0.2} look={[0.6, 0]} pin />
    <path d={`M${cx - 90} ${cy + 260} L${cx + 90} ${cy + 260} L${cx + 150} 1340 L${cx - 150} 1340 Z`} fill={P.blk} />
    <RMChip x={540} y={1290} text="PROGRESS: 0" col={P.yel} size={44} pop={(t - bt(beats, 3, 1.2)) / 0.25} /></g>);
}
/* 9 — the study: two 90-minute walks, nature vs traffic */
function RMRStudy({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.3), c4 = bt(beats, 4, 1.8);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={220} text="STANFORD · 2015 · 90 MIN" col={P.cream} size={48} pop={t / 0.25} />
    <g opacity={t > c3 - 0.2 ? 1 : 0.35}>
      <rect x="90" y="330" width="900" height="480" fill={P.blk} transform="translate(12 12)" /><rect x="90" y="330" width="900" height="480" fill={P.pink} {...ink(7)} />
      <rect x="90" y="680" width="900" height="130" fill={P.yel} {...ink(7)} />
      <Tree x={250} y={640} s={0.9} seed={2} /><Tree x={820} y={630} s={1} seed={7} /><Tree x={540} y={620} s={0.7} seed={4} />
      <RMFlower x={400} y={740} s={0.5} /><RMFlower x={700} y={760} s={0.45} />
      <RMChip x={540} y={400} text="NATURE" col={P.yel} size={48} pop={1} /></g>
    <g opacity={t > c4 - 0.1 ? 1 : 0.35}>
      <rect x="90" y="880" width="900" height="420" fill={P.blk} transform="translate(12 12)" /><rect x="90" y="880" width="900" height="420" fill={P.redD} {...ink(7)} />
      <rect x="90" y="1130" width="900" height="170" fill={P.blk} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={((i * 220 - T * 300) % 1100 + 1100) % 1100} y="1205" width="120" height="16" fill={P.cream} />)}
      <Car x={((T * 260) % 1200) - 60} y={1180} col={P.yel} s={0.9} /><Car x={1100 - ((T * 200 + 500) % 1200)} y={1270} col={P.blue} s={0.8} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={140 + i * 220} y={960 + hsh(i) * 40} width="150" height={170 - hsh(i) * 40} fill={P.blue} {...ink(5)} />)}
      <RMChip x={540} y={950} text="TRAFFIC" col={P.cream} size={48} pop={1} /></g></g>);
}
/* 10 — the scan: the replay spot dims only after the nature walk */
function RMRScan({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.3), k = SM(c3 - 0.3, c3 + 0.3, t);
  const spot = (cx, cy, on) => (<g><circle cx={cx} cy={cy} r={60 + 10 * osc(T, 0.5)} fill="#8FEFFF" opacity={0.25 * on} /><circle cx={cx} cy={cy} r={30} fill={on > 0.5 ? '#8FEFFF' : P.blue} {...ink(5)} /></g>);
  return (<g><RMBg kind="dark" />
    <RMChip x={540} y={220} text="AFTER THE WALK" col={P.yel} size={50} pop={t / 0.25} />
    {[280, 800].map((cx, j) => (<g key={j}><ellipse cx={cx + 12} cy={712} rx="220" ry="170" fill={P.blk} /><ellipse cx={cx} cy={700} rx="220" ry="170" fill={P.pink} {...ink(8)} />
      {[...Array(6)].map((_, i) => <path key={i} d={`M${cx - 190 + i * 10} ${600 + i * 34} q60 -40 120 0 t120 0 t120 0`} fill="none" {...ink(6)} />)}
      <path d={`M${cx - 40} 860 q10 80 -10 140`} fill="none" {...ink(14)} /></g>))}
    {spot(200, 760, 1)}{spot(720, 760, 1 - k)}
    <RMChip x={280} y={1000} text="TRAFFIC" col={P.cream} size={44} pop={1} />
    <RMChip x={800} y={1000} text="NATURE" col={P.yel} size={44} pop={1} />
    <text x={540} y={1180} textAnchor="middle" fontFamily={OSW} fontWeight="700" fontSize="40" fill={P.cream}>REPLAY AREA OF THE BRAIN</text>
    <text x={540} y={1240} textAnchor="middle" fontFamily={OSW} fontWeight="700" fontSize="34" fill={P.pink}>(SUBGENUAL PREFRONTAL CORTEX)</text></g>);
}
/* 11 — self-proof: the last walk that cleared your head */
function RMRProof({ T, t, beats }) {
  const n = Math.max(0, Math.min(8, Math.floor(t / 0.25) + 1));
  return (<g><RMBg kind="red" />
    {[...Array(n)].map((_, i) => <ellipse key={i} cx={200 + i * 95} cy={1250 - i * 85 + (i % 2) * 40} rx="26" ry="42" fill={P.blk} transform={`rotate(30 ${200 + i * 95} ${1250 - i * 85 + (i % 2) * 40})`} />)}
    <RMArthur x={760} y={560} s={0.38} mouth="smile" brow="up" lid={0.25} look={[-0.4, 0.3]} />
    <RMChip x={330} y={330} text="THE LAST WALK" col={P.yel} size={52} pop={t / 0.25} />
    <RMChip x={330} y={460} text="'CLEARED MY HEAD'" col={P.cream} size={40} pop={(t - bt(beats, 3, 1.1)) / 0.25} /></g>);
}
/* 12 — payoff: Arthur in the park; the Critic dozes off */
function RMRPark({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.2), q = SM(c3 - 0.2, c3 + 0.3, t);
  return (<g><RMBg kind="red" />
    <rect x="-20" y="1180" width="1120" height="200" fill={P.yel} {...ink(7)} />
    <Tree x={160} y={1060} s={1.1} seed={1} /><Tree x={940} y={1040} s={1.2} seed={8} />
    <RMFlower x={300} y={1260} s={0.6} /><RMFlower x={820} y={1280} s={0.55} />
    <RMArthur x={lp(420, 560, SM(0, 2.5, t))} y={820} s={0.48} mouth="smile" brow="flat" lid={0.3} look={[0.3, -0.2]} />
    <g transform={`translate(830 ${lp(560, 600, q)})`}><RMCritic x={0} y={0} s={0.28} body={false} mouth="flat" lid={lp(0.4, 1, q)} sad /></g>
    {q > 0.5 && <text x={930} y={430} fontFamily={BEB} fontSize="80" fill={P.cream} opacity={q}>Z z</text>}
    <RMChip x={540} y={230} text="90 MIN · THE PARK" col={P.yel} size={50} pop={t / 0.25} /></g>);
}
/* 13 — end: the five-sign checklist + send line */
function RMREnd({ T, t, beats }) {
  const signs = ['REPLAY WHAT YOU SAID', 'SHOWER ARGUMENTS', 'LOUDER AT NIGHT', "'RELAXING'", 'OVERTHINKING = FIXING'];
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['NOT BROKEN.', P.cream, 130], ['JUST INDOORS.', P.yel, 130]]} y={250} a={EO(t / 0.35)} />
    {signs.map((s, i) => { const at = 0.6 + i * 0.35, k = SM(at, at + 0.2, t);
      return (<g key={i}><rect x="170" y={600 + i * 130} width="70" height="70" fill={P.cream} {...ink(6)} />
        {k > 0 && <path d={`M182 ${636 + i * 130} l20 22 l34 -46`} fill="none" stroke={P.red} strokeWidth="12" strokeLinecap="round" opacity={k} />}
        <text x={270} y={658 + i * 130} fontFamily={OSW} fontWeight="700" fontSize="52" fill={P.cream}>{s}</text></g>); })}
    <RMChip x={540} y={1330} text="SEND IT TO THE FRIEND WHO CHECKED ALL 5" col={P.yel} size={34} pop={(t - 2.6) / 0.25} /></g>);
}

Object.assign(window, { RMRWorry, RMRFive, RMRShoes, RMRSign1, RMRSign2, RMRSign3, RMRSign4, RMRSign5, RMRStudy, RMRScan, RMRProof, RMRPark, RMREnd });
})();
