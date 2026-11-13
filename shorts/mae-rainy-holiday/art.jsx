// art.jsx — "Your Best Holiday Wasn't That Great (While You Were There)" (Mae ep. 8, with Arthur; retro modern illustration).
// Rosy retrospection: Mitchell, Thompson, Peterson & Cronk 1997 (JESP) — 3-week California bike tour: 5% expected to be
// disappointed, 61% felt disappointed during, a week later only 11% remembered being disappointed. Full 1080×1920 frames
// with retro-kit.jsx; captions at y ≈ 1540 — faces and numbers stay out of y 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";
const RIDER = { kind: 'human', skin: P.pink, skinD: P.pinkD, hair: 'flat', hairCol: P.blk, moustache: false, jacket: P.yel };

function Sun({ x, y, r = 70, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${T * 12})`}>{[...Array(10)].map((_, i) => <path key={i} transform={`rotate(${i * 36})`} d={`M${r + 12} -12 L${r + 50} 0 L${r + 12} 12 Z`} fill={P.yel} {...ink(4)} />)}
    <circle r={r} fill={P.yel} {...ink(6)} /></g>);
}
function Cloud({ x, y, s = 1, col = P.blueD }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-150 40 C-190 40 -200 -20 -150 -30 C-150 -90 -70 -100 -50 -60 C-30 -120 60 -120 70 -50 C120 -80 180 -40 160 10 C200 20 190 40 150 40 Z" fill={col} {...ink(7)} /></g>);
}
function RainLines({ T, x0 = 0, x1 = 1080, y0 = 0, y1 = 1300, n = 30, a = 1, col = P.cream }) {
  return <g>{[...Array(n)].map((_, i) => { const x = x0 + hsh(i + 4) * (x1 - x0), sp = 700 + hsh(i + 8) * 400, h = y1 - y0, y = y0 + ((T * sp + hsh(i + 2) * h) % h);
    return <line key={i} x1={x} y1={y} x2={x - 12} y2={y + 46} stroke={col} strokeWidth="5" strokeLinecap="round" opacity={0.75 * a} />; })}</g>;
}
/* a cream photo print with a sunny beach inside */
function Photo({ x, y, s = 1, rot = 0, T = 0, k = 1, rain = 0 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k) * s})`}>
    <rect x="-190" y="-160" width="380" height="330" fill={P.cream} {...ink(7)} />
    <rect x="-160" y="-130" width="320" height="230" fill={rain > 0.5 ? P.blueD : P.pink} {...ink(5)} />
    <rect x="-160" y="40" width="320" height="60" fill={P.blue} />
    {rain > 0.5 ? <g><Cloud x={0} y={-50} s={0.7} col={P.blk} />{[...Array(7)].map((_, i) => <line key={i} x1={-110 + i * 36} y1={0} x2={-120 + i * 36} y2={34} stroke={P.cream} strokeWidth="5" strokeLinecap="round" />)}</g>
      : <Sun x={40} y={-40} r={40} T={T} />}
    <path d="M-160 100 L-60 40 L40 100 Z" fill={P.yel} {...ink(4)} /></g>);
}
function Bike({ x, y, s = 1, T = 0, spin = 1 }) {
  const a = T * 300 * spin;
  const wheel = (cx) => (<g transform={`translate(${cx} 0) rotate(${a})`}><circle r="110" fill="none" {...ink(12)} />{[0, 1, 2, 3].map((i) => <line key={i} x1={0} y1={-104} x2={0} y2={104} transform={`rotate(${i * 45})`} stroke={P.blk} strokeWidth="3" />)}</g>);
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>{wheel(-190)}{wheel(190)}
    <path d="M-190 0 L-40 -150 L130 -150 L190 0 M-40 -150 L20 0 L130 -150 M20 0 L-190 0" fill="none" stroke={P.red} strokeWidth="14" strokeLinejoin="round" />
    <path d="M-60 -175 L-10 -175" {...ink(14)} /><path d="M130 -150 L120 -220 L170 -230" fill="none" {...ink(10)} /></g>);
}
function Glasses({ x, y, s = 1, tint = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((sd) => <g key={sd}><ellipse cx={sd * 170} cy={0} rx={140} ry={110} fill={P.pink} opacity={0.4 + 0.5 * tint} /><ellipse cx={sd * 170} cy={0} rx={140} ry={110} fill="none" {...ink(16)} />
      <path d={`M${sd * 170 - 70} -40 Q${sd * 170 - 30} -70 ${sd * 170 + 10} -60`} fill="none" stroke={P.cream} strokeWidth="10" strokeLinecap="round" opacity="0.8" /></g>)}
    <path d="M-30 -10 Q0 -40 30 -10" fill="none" {...ink(14)} /><path d="M-310 -20 L-400 -60 M310 -20 L400 -60" {...ink(14)} /></g>);
}

/* 1 — Mae at the rainy window, proudly holding up a sunny holiday photo; DAY 3 · STILL RAINING */
function RMMaeAlbum({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2);
  return (<g><RMBg kind="blue" />
    <rect x="80" y="140" width="520" height="620" fill={P.blueD} {...ink(9)} /><line x1="340" y1="140" x2="340" y2="760" {...ink(8)} /><line x1="80" y1="450" x2="600" y2="450" {...ink(8)} />
    <RainLines T={T} x0={90} x1={590} y0={150} y1={750} n={22} a={SM(0, 0.3, t)} />
    <RMMae x={330} y={1010} s={0.6} mouth="smile" brow="up" lid={0.15} look={[1, -0.2]} />
    <Photo x={780} y={760 + Math.sin(T * 1.5) * 8} s={0.95} rot={6} T={T} k={(t - 0.1) / 0.3} />
    <RMChip x={780} y={520} text="PERFECT!" col={P.yel} size={48} pop={(t - 0.5) / 0.25} rot={0.05} />
    {t > c2 && <RMChip x={540} y={1300} text="DAY 3 · STILL RAINING" col={P.cream} size={44} pop={(t - c2) / 0.25} />}</g>);
}

/* 2 — shock: a cyclist grinding up a hill in the rain; 61% DISAPPOINTED counts up */
function RMBikeTour({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4), n = Math.round(61 * EO((t - 0.6) / 1.0));
  return (<g><RMBg kind="redDark" />
    <RMChip x={540} y={170} text="3-WEEK BIKE TOUR · CALIFORNIA" col={P.cream} size={38} pop={t / 0.25} />
    <path d="M-100 1380 L1180 1000 L1180 1420 L-100 1420 Z" fill={P.blk} />
    <Cloud x={620} y={600} s={1.2} />
    <RainLines T={T} x0={420} x1={860} y0={660} y1={1150} n={16} />
    <g transform={`rotate(-16 540 1150)`}><Bike x={540} y={1150} s={0.9} T={T} spin={0.3} />
      <path d="M460 920 L560 900 L600 1010 L500 1030 Z" fill={RIDER.jacket} {...ink(6)} />
      <RMHuman x={540} y={820} s={0.26} who={RIDER} body={false} mouth="frown" brow="sad" lid={0.5} look={[1, 0.4]} stress /></g>
    {t > 0.6 && <RMTitle lines={[[`${n}%`, P.yel, 200]]} y={320} />}
    {t > c3 && <RMChip x={540} y={1300} text="DISAPPOINTED" col={P.yel} size={50} pop={(t - c3) / 0.25} rot={0.03} />}</g>);
}

/* 3 — snapback: the rainy photo gets painted over pink and sunny; ONLY 11% REMEMBERED */
function RMForgotten({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2), wipe = SM(0.3, 1.4, t), u = 'rf' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={170} text="ONE WEEK LATER" col={P.cream} size={46} pop={t / 0.25} />
    <g transform="translate(540 850)"><rect x="-340" y="-300" width="680" height="560" fill={P.cream} {...ink(9)} />
      <rect x="-300" y="-260" width="600" height="420" fill={P.blueD} {...ink(6)} />
      <clipPath id={u}><rect x="-300" y="-260" width={600 * wipe} height="420" /></clipPath>
      <Cloud x={0} y={-120} s={1} col={P.blk} />
      <g clipPath={`url(#${u})`}><rect x="-300" y="-260" width="600" height="420" fill={P.pink} /><Sun x={60} y={-100} r={70} T={T} /></g>
      <rect x="-300" y="90" width="600" height="70" fill={P.blue} /><path d="M-300 160 L-140 60 L20 160 Z" fill={P.yel} {...ink(5)} /></g>
    <RMHand x={lp(140, 940, wipe)} y={360} s={0.55} rot={-0.4} col={P.pink} />
    {t > c2 - 0.4 && <RMTitle lines={[['ONLY 11%', P.yel, 150]]} y={1270} a={EO((t - c2 + 0.4) / 0.3)} />}</g>);
}

/* 4 — the study: three panels BEFORE / DURING / AFTER; the faces go smile → frown → smile */
function RMThreeStages({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.6);
  const P3 = [['BEFORE', 'smile', 'up', P.yel], ['DURING', 'frown', 'sad', P.cream], ['AFTER', 'smile', 'up', P.yel]];
  return (<g><RMBg kind="redDark" />
    <RMChip x={540} y={170} text="J. EXP. SOCIAL PSYCHOLOGY · 1997" col={P.cream} size={36} pop={t / 0.25} />
    {P3.map(([lab, m, b, col], i) => { const k = (t - 0.4 - i * 0.45) / 0.3, x = 190 + i * 350; return k > 0 && (<g key={i} transform={`translate(${x} 800) scale(${BK(k)})`}>
      <rect x="-155" y="-330" width="310" height="560" fill={col} {...ink(8)} />
      <RMHuman x={0} y={-80} s={0.42} who={RIDER} body={false} mouth={m} brow={b} lid={m === 'frown' ? 0.5 : 0.15} look={[0, 0]} />
      {m === 'frown' && <Cloud x={0} y={-270} s={0.45} />}
      <rect x="-155" y="150" width="310" height="80" fill={P.blk} /><text y="208" textAnchor="middle" fontFamily={BEB} fontSize="58" letterSpacing="5" fill={P.cream}>{lab}</text></g>); })}
    {t > c3 && <RMChip x={540} y={1270} text="EUROPE · THANKSGIVING · BIKE TOUR" col={P.yel} size={34} pop={(t - c3) / 0.25} />}</g>);
}

/* 5 — result: a U-shaped line on grid paper; the two ends glow, the middle sags */
function RMGlowEnds({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2), p = EO((t - 0.2) / 1.2);
  const pts = [...Array(41)].map((_, i) => { const u = i / 40, x = 180 + u * 720, y = 560 + Math.pow(Math.sin(u * Math.PI), 1.4) * 420; return [x, y]; });
  const shown = pts.slice(0, Math.max(2, Math.round(p * 41)));
  return (<g><RMBg kind="red" />
    <RMGrid x={110} y={360} w={860} h={860} />
    <path d={'M' + shown.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L')} fill="none" stroke={P.blk} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    {[[180, 560, 'PLANNING'], [900, 560, 'REMEMBERING']].map(([x, y, l], i) => (t > c2 - 0.3 + i * 0.2) && (<g key={l}><circle cx={x} cy={y} r={60 + Math.sin(T * 4 + i) * 6} fill={P.yel} {...ink(6)} />
      <RMChip x={x < 540 ? 300 : 780} y={450} text={l} col={P.yel} size={34} pop={(t - c2 + 0.3 - i * 0.2) / 0.25} /></g>))}
    {p > 0.5 && <RMChip x={540} y={1090} text="BEING THERE" col={P.cream} size={40} pop={(p - 0.5) / 0.2} rot={0.03} />}</g>);
}

/* 6 — name it: ROSY RETROSPECTION over a giant pair of rose-tinted glasses */
function RMNameRosy({ T, t }) {
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['ROSY', P.pink, 190], ['RETROSPECTION', P.yel, 124]]} y={260} a={EO((t - 0.15) / 0.35)} />
    <g transform={`translate(540 ${960 + Math.sin(T * 2) * 12}) rotate(${Math.sin(T) * 3})`}><Glasses x={0} y={0} s={1.15} tint={SM(0.3, 1.2, t)} />
      {[-1, 1].map((sd) => <Sun key={sd} x={sd * 195} y={0} r={36} T={T} />)}</g></g>);
}

/* 7 — self-proof: a long zigzag airport queue; a pink hand erases it from the memory card */
function RMQueueMemory({ T, t, beats }) {
  const c4 = bt(beats, 4, 1.8), wipe = SM(c4 - 0.2, c4 + 1.2, t);
  const people = [...Array(18)].map((_, i) => { const row = Math.floor(i / 6), col = row % 2 ? 5 - (i % 6) : i % 6; return [200 + col * 136, 620 + row * 220]; });
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={170} text="QUEUE · 3 HOURS" col={P.cream} size={46} pop={t / 0.25} />
    <rect x="110" y="380" width="860" height="860" fill={P.cream} {...ink(9)} />
    {people.map(([x, y], i) => { const gone = x < 110 + 860 * wipe + 20; return !gone && (<g key={i} transform={`translate(${x} ${y + Math.sin(T * 2 + i) * 4})`}>
      <path d="M-34 90 L-28 10 L28 10 L34 90 Z" fill={[P.blue, P.red, P.green, P.yel][i % 4]} {...ink(5)} /><circle cy={-20} r={30} fill={i % 3 ? P.pink : P.cream} {...ink(5)} /></g>); })}
    {[0, 1, 2].map((r) => <line key={r} x1={150} y1={720 + r * 220} x2={930} y2={720 + r * 220} stroke={P.blk} strokeWidth="6" strokeDasharray="20 14" opacity={1 - wipe} />)}
    {wipe > 0 && <RMHand x={110 + 860 * wipe} y={500} s={0.5} rot={-0.3} col={P.pink} />}</g>);
}

/* 8 — payoff: Mae laughing under a sieve: the rain drips through, the sunshine stays */
function RMKeepGood({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g><RMBg kind="blue" />
    <g transform="translate(540 430)"><path d="M-330 -40 Q0 220 330 -40 Z" fill={P.cream} {...ink(8)} />
      {[...Array(9)].map((_, i) => <line key={i} x1={-280 + i * 70} y1={-30} x2={-240 + i * 60} y2={60} stroke={P.blk} strokeWidth="3" />)}
      <rect x="-360" y="-60" width="720" height="34" fill={P.red} {...ink(7)} />
      {[[-150, -110], [20, -130], [170, -105]].map(([x, y], i) => <Sun key={i} x={x} y={y + Math.sin(T * 2 + i) * 6} r={42} T={T + i} />)}</g>
    <RainLines T={T} x0={300} x1={780} y0={560} y1={760} n={12} col={P.cyan} />
    <RMMae x={540} y={980} s={0.62} mouth="open" brow="up" lid={0.25} look={[0, -0.6]} />
    {t > c3 && <RMChip x={540} y={1330} text="KEEPS THE GOOD PARTS" col={P.yel} size={44} pop={(t - c3) / 0.25} />}</g>);
}

/* 9 — end: Mae and Arthur flick through the album; Arthur points at the window, Mae just smiles; question + send chips */
function RMEndRosy({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  return (<g><RMBg kind="red" />
    <RMMae x={300} y={900} s={0.6} mouth="smile" brow="up" lid={0.15} look={[0.6, 0.3]} />
    <RMArthur x={790} y={900} s={0.6} mouth="flat" brow="angry" lid={0.35} look={[-0.6, 0.3]} />
    <Photo x={545} y={1240} s={0.7} rot={-4} T={T} />
    <RMChip x={540} y={170} text="WHICH TRIP GOT BETTER?" col={P.yel} size={44} pop={t / 0.25} />
    {t > c2 && <RMChip x={540} y={300} text="SEND IT TO THAT FRIEND" col={P.cream} size={40} pop={(t - c2) / 0.25} rot={0.03} />}</g>);
}

Object.assign(window, { RMMaeAlbum, RMBikeTour, RMForgotten, RMThreeStages, RMGlowEnds, RMNameRosy, RMQueueMemory, RMKeepGood, RMEndRosy });
})();
