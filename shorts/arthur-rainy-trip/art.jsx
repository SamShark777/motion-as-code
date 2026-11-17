// art.jsx — "Why Your Worst Trip Is Now Your Favourite Story" (Arthur ep. 12, with Mae; retro modern illustration).
// Fading affect bias: Walker, Vogl & Thompson 1997 (Applied Cognitive Psychology) — in diary studies, the unpleasant
// feeling attached to memories faded faster than the pleasant feeling. No numbers on screen. Full 1080×1920 frames with
// retro-kit.jsx; captions at y ≈ 1540, faces stay above y 1400.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";

/* rain streaks over a box (x,y,w,h); fade 0..1 thins them out */
function Rain({ x, y, w, h, T, fade = 0, n = 26, col = P.cyan }) {
  return (<g opacity={1 - fade}>{[...Array(n)].map((_, i) => { const rx = x + hsh(i + 3) * w, ry = y + ((hsh(i + 30) * h + T * 900) % h);
    return <line key={i} x1={rx} y1={ry} x2={rx - 14} y2={Math.min(y + h, ry + 46)} stroke={col} strokeWidth="5" strokeLinecap="round" opacity="0.85" />; })}</g>);
}
/* a polaroid of the camping trip; washed = 0..1 how much the bad stuff has faded */
function Polaroid({ x, y, s = 1, rot = 0, T, washed = 0, smile = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-262} y={-252} width={540} height={620} fill={P.blk} />
    <rect x={-270} y={-260} width={540} height={620} fill={P.cream} {...ink(8)} />
    <clipPath id="arthurPhotoClip"><rect x={-230} y={-220} width={460} height={440} /></clipPath>
    <g clipPath="url(#arthurPhotoClip)">
      <rect x={-230} y={-220} width={460} height={440} fill={washed > 0.5 ? P.yel : P.blue} />
      <rect x={-230} y={-220} width={460} height={440} fill={P.yel} opacity={washed} />
      {washed < 0.95 && [[-150, -150], [20, -170], [140, -130]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={120} ry={60} fill="#55607a" opacity={1 - washed} {...ink(5)} />)}
      {washed > 0.3 && <circle cx={150} cy={-140} r={60} fill={P.cream} opacity={washed} {...ink(5)} />}
      <rect x={-230} y={120} width={460} height={100} fill={washed > 0.5 ? P.green : P.blueD} />
      <path d={pts([[-160, 140], [-20, -40], [120, 140]])} fill={P.red} {...ink(7)} /><path d={pts([[-20, -40], [-60, 140], [20, 140]])} fill={P.blk} />
      <path d={`M-230 ${150 - 40 * (1 - washed)} Q0 ${130 - 40 * (1 - washed)} 230 ${150 - 40 * (1 - washed)} L230 220 L-230 220 Z`} fill={P.cyan} opacity={0.75 * (1 - washed)} />
      <Rain x={-230} y={-220} w={460} h={440} T={T} fade={washed} />
    </g>
    <text x={0} y={310} textAnchor="middle" fontFamily={BEB} fontSize="54" letterSpacing="4" fill={P.blk}>{smile > 0.5 ? 'BEST. TRIP. EVER.' : 'CAMPING · DAY 4'}</text></g>);
}
const pts = (a) => 'M' + a.map((p) => p[0] + ' ' + p[1]).join(' L') + ' Z';
/* a small happy / sad face token */
function Face({ x, y, r = 70, happy, a = 1, k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(cl(k))})`} opacity={a}><circle r={r} fill={happy ? P.yel : P.blue} {...ink(6)} />
    <circle cx={-r * 0.32} cy={-r * 0.15} r={r * 0.11} fill={P.blk} /><circle cx={r * 0.32} cy={-r * 0.15} r={r * 0.11} fill={P.blk} />
    <path d={happy ? `M${-r * 0.37} ${r * 0.2} A${r * 0.45} ${r * 0.45} 0 0 0 ${r * 0.37} ${r * 0.2}` : `M${-r * 0.37} ${r * 0.45} A${r * 0.45} ${r * 0.45} 0 0 1 ${r * 0.37} ${r * 0.45}`} fill="none" {...ink(r * 0.1)} /></g>);
}

/* 1 — Arthur holds the worst holiday photo: rain, a flooded tent */
function RMWorstTrip({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), c4 = bt(beats, 4, 2.2);
  return (<g><RMBg kind="blue" />
    <Polaroid x={600} y={560} s={0.95} rot={6} T={T} washed={0} />
    <RMArthur x={300} y={1020} s={0.5} mouth="frown" brow="sad" lid={0.45} look={[0.8, -0.6]} />
    <RMChip x={300} y={150} text="OLD PHOTOS" col={P.cream} size={46} pop={t / 0.25} />
    {t > c1 && <RMChip x={760} y={1110} text="WORST TRIP EVER" col={P.yel} size={48} pop={(t - c1) / 0.25} rot={0.03} />}
    {t > c4 && <RMChip x={760} y={1240} text="TENT: FLOODED" col={P.cream} size={40} pop={(t - c4) / 0.25} rot={-0.03} />}</g>);
}

/* 2 — and he's smiling: close-up grin, the photo now captioned "BEST STORY" */
function RMNowSmiling({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.5);
  return (<g><RMBg kind="red" />
    <RMArthur x={540} y={820} s={0.95} mouth="smile" brow="up" lid={0.15} look={[0.4, 0.4]} />
    <RMSpeech x={560} y={210} text="BEST STORY!" size={86} k={(t - c3) / 0.3} col={P.yel} rot={0.04} /></g>);
}

/* 3 — snapback: a giant pencil eraser rubs out the rain clouds on the photo (cyan sparks) */
function RMEditing({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1);
  const w = SM(c2 - 0.6, c2 + 0.7, t);
  const ex = 600 + Math.sin(T * 9) * 120, ey = 380 + Math.cos(T * 7) * 40;
  return (<g><RMBg kind="blue" />
    <Polaroid x={540} y={700} s={1.25} T={T} washed={w} />
    <g transform={`translate(${ex} ${ey}) rotate(35)`}><rect x={-45} y={-420} width={90} height={360} fill={P.yel} {...ink(7)} />
      <rect x={-45} y={-80} width={90} height={40} fill="#b8b8b8" {...ink(6)} /><rect x={-45} y={-40} width={90} height={70} rx={8} fill={P.pink} {...ink(7)} /></g>
    {[0, 1, 2].map((i) => <RMBolt key={i} x={ex - 30} y={ey + 40} len={110} ang={1.2 + i * 0.7} seed={i + 2} T={T} w={4} />)}
    <RMChip x={540} y={1300} text="EDITING..." col={P.yel} size={58} pop={(t - c2) / 0.25} /></g>);
}

/* 4 — 1997: diary pages of good and bad days, each stamped with a face */
function RMDiaries({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1);
  const days = [1, 0, 1, 1, 0, 1, 0, 1];
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={170} text="DIARY STUDY · 1997" col={P.cream} size={48} pop={t / 0.25} />
    <g transform="rotate(-3 540 760)"><RMGrid x={150} y={300} w={380} h={920} /><RMGrid x={550} y={300} w={380} h={920} /><RMLine x1={540} y1={300} x2={540} y2={1220} w={10} /></g>
    {days.map((h, i) => { const x = i < 4 ? 340 : 740, y = 410 + (i % 4) * 215;
      return (<g key={i}><text x={x - 120} y={y + 16} fontFamily={BEB} fontSize="44" fill={P.blk}>DAY {i + 1}</text><Face x={x + 90} y={y} r={62} happy={!!h} k={(t - c2 + 0.4 - i * 0.12) / 0.3} /></g>); })}</g>);
}

/* 5 — rated again later: the sad faces fade away fast, the happy ones stay bright */
function RMFadeRates({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.4);
  const f = SM(c2 - 0.3, c2 + 0.9, t);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={170} text="LATER..." col={P.cream} size={50} pop={t / 0.25} />
    {[0, 1, 2].map((i) => <Face key={'g' + i} x={300} y={420 + i * 280} r={110} happy a={lp(1, 0.8, f)} />)}
    {[0, 1, 2].map((i) => <Face key={'b' + i} x={780} y={420 + i * 280} r={110 * lp(1, 0.55, f)} happy={false} a={lp(1, 0.15, f)} />)}
    <RMChip x={300} y={1270} text="GOOD: STAYS" col={P.yel} size={42} pop={(t - 0.3) / 0.25} rot={0.02} />
    <RMChip x={780} y={1270} text="BAD: FADES" col={P.cream} size={42} pop={(t - c2) / 0.25} rot={-0.03} /></g>);
}

/* 6 — name: FADING AFFECT BIAS; the photo turns sunny while Arthur's eye glows */
function RMFadingTitle({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.9);
  return (<g><RMBg kind="red" />
    <RMEyeMacroLite T={T} t={t} />
    <RMTitle lines={[['FADING AFFECT', P.cream, 130], ['BIAS', P.yel, 170]]} y={250} a={SM(c1 - 0.2, c1 + 0.2, t)} /></g>);
}
/* the Arthur eye macro with the polaroid reflected in the pupil, slowly turning sunny */
function RMEyeMacroLite({ T, t }) {
  return (<g transform="translate(0 260)"><RMEyeMacro open={SM(0, 0.6, t)}>
    <g transform="translate(540 980) scale(0.26)"><Polaroid x={0} y={-40} T={T} washed={SM(0.4, 2.0, t)} /></g></RMEyeMacro></g>);
}

/* 7 — self-proof: the trip that went wrong — a broken umbrella, a suitcase with a snapped wheel, cyan rain */
function RMThatTrip({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), c3 = bt(beats, 3, 1.7);
  const dry = SM(c3, c3 + 0.6, t);
  return (<g><RMBg kind="blue" />
    <Rain x={0} y={0} w={1080} h={1380} T={T} fade={dry} n={40} />
    <g transform="translate(380 900)"><rect x={-180} y={-220} width={360} height={440} rx={30} fill={P.red} {...ink(9)} />
      <rect x={-80} y={-290} width={160} height={80} rx={20} fill="none" {...ink(14)} />
      <RMLine x1={-180} y1={-40} x2={180} y2={-40} w={8} /><circle cx={-110} cy={250} r={34} fill={P.blk} /><circle cx={130} cy={280} r={34} fill={P.blk} transform="rotate(25 130 280)" /></g>
    <g transform={`translate(760 760) rotate(${-20 + osc(T, 0.8) * 6})`}><path d="M-200 0 Q-180 -170 0 -190 Q180 -170 200 0 L120 -30 L60 10 L0 -40 L-60 10 L-120 -30 Z" fill={P.yel} {...ink(8)} />
      <path d="M0 -40 L20 300 Q20 340 -20 340" fill="none" {...ink(10)} /><path d="M0 -190 L-40 -100" {...ink(8)} /></g>
    {t > c2 && <RMChip x={540} y={240} text="THE TRIP THAT WENT WRONG" col={P.cream} size={44} pop={(t - c2) / 0.25} />}
    {t > c3 && <RMChip x={540} y={1300} text="FUNNY NOW?" col={P.yel} size={56} pop={(t - c3) / 0.25} rot={0.03} />}</g>);
}

/* 8 — payoff: Mae waves a camping brochure; Arthur, beaming: OBVIOUSLY */
function RMGoAgain({ T, t, beats }) {
  const c1 = bt(beats, 1, 1.3);
  return (<g><RMBg kind="red" />
    <RMMae x={300} y={930} s={0.5} mouth="smile" brow="up" lid={0.2} look={[1, 0]} />
    <RMArthur x={790} y={950} s={0.5} mouth={t > c1 ? 'open' : 'flat'} brow="up" lid={0.15} look={[-1, 0]} />
    <g transform={`translate(420 ${560 + osc(T, 0.9) * 8}) rotate(-8)`}><rect x={-150} y={-110} width={300} height={220} fill={P.cream} {...ink(7)} />
      <path d={pts([[-80, 60], [0, -60], [80, 60]])} fill={P.red} {...ink(6)} /><circle cx={90} cy={-60} r={30} fill={P.yel} {...ink(5)} />
      <text x={0} y={95} textAnchor="middle" fontFamily={BEB} fontSize="40" fill={P.blk}>CAMPING?</text></g>
    {t > c1 && <RMSpeech x={720} y={330} text="OBVIOUSLY!" size={90} k={(t - c1) / 0.3} col={P.yel} rot={0.05} />}</g>);
}

/* end: a photo album where every bad photo has gone golden; question + send chips */
function RMEndStory({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.8), c3 = bt(beats, 3, 1.8);
  return (<g><RMBg kind="dark" />
    <RMBulb x={540} y={220} T={T} />
    {[[300, 700, -8], [780, 680, 7], [540, 1030, -2]].map(([x, y, r], i) => <Polaroid key={i} x={x} y={y} s={0.55} rot={r} T={T + i} washed={SM(0.2 + i * 0.25, 0.9 + i * 0.25, t)} smile={1} />)}
    <RMChip x={540} y={420} text="BAD DAYS FADE" col={P.yel} size={54} pop={t / 0.25} />
    {t > c1 && <RMChip x={540} y={1330} text="YOUR WORST TRIP?" col={P.cream} size={46} pop={(t - c1) / 0.25} rot={0.02} />}
    {t > c3 && <RMChip x={860} y={1230} text="SEND IT" col={P.yel} size={42} pop={(t - c3) / 0.25} rot={-0.04} />}</g>);
}

Object.assign(window, { RMWorstTrip, RMNowSmiling, RMEditing, RMDiaries, RMFadeRates, RMFadingTitle, RMThatTrip, RMGoAgain, RMEndStory });
})();
