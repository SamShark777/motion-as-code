// art.jsx — "Why Trying to Be Happy Ruins the Night" (Rosa ep. 7, with Nia; ted-MG motion graphics).
// Valuing happiness backfires: Mauss, Tamir, Anderson & Savino 2011 (Emotion) — people who read an article praising
// happiness felt less happy during a happy film clip than controls; disappointment explained it. No numbers on screen.
// Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GOOD = '#5fbf7a', PAPER = '#fbf7ee';

/* clipboard checklist; items = [[text, done]], ring = index to circle, rp = ring progress */
function Checklist({ x, y, s = 1, rot = 0, title = 'PERFECT NIGHT', items, ring = -1, rp = 0, ticks = 99 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-230" y="-300" width="460" height="600" rx="26" fill="#b98e62" stroke={K} strokeWidth="9" />
    <rect x="-200" y="-250" width="400" height="530" rx="10" fill={PAPER} stroke={K} strokeWidth="6" />
    <rect x="-80" y="-325" width="160" height="60" rx="14" fill="#9a9a9a" stroke={K} strokeWidth="7" />
    <text x="0" y="-180" textAnchor="middle" fontFamily={BB} fontSize="58" letterSpacing="3" fill={K}>{title}</text>
    {items.map(([txt, done], i) => { const yy = -90 + i * 92; return (<g key={i}>
      <rect x="-165" y={yy - 34} width="54" height="54" rx="8" fill="#fff" stroke={K} strokeWidth="6" />
      {done && i < ticks && <path d={`M-156 ${yy - 8} L-140 ${yy + 10} L-112 ${yy - 30}`} fill="none" stroke={GOOD} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />}
      <text x="-90" y={yy + 8} fontFamily={BB} fontSize="54" letterSpacing="2" fill={K}>{txt}</text></g>); })}
    {ring >= 0 && <MGRing cx={30} cy={-98 + ring * 92} rx={190} ry={56} p={rp} rot={-4} />}
  </g>);
}
/* party balloons on strings */
function Balloons({ T, x = 900, y = 520 }) {
  return (<g>{[['#E5483B', -70], ['#F6B92E', 10], ['#a46fd1', 90]].map(([c, dx], i) => { const sy = osc(T, 2.4, i * 0.3) * 10;
    return (<g key={i}><path d={`M${x + dx} ${y + 80 + sy} Q${x + dx - 20} ${y + 200} ${x + 10} ${y + 330}`} stroke={K} strokeWidth="4" fill="none" />
      <ellipse cx={x + dx} cy={y + sy} rx="62" ry="78" fill={c} stroke={K} strokeWidth="6" /><ellipse cx={x + dx - 20} cy={y - 26 + sy} rx="12" ry="20" fill="#fff" opacity="0.4" /></g>); })}</g>);
}
/* birthday cake with candles; tilt in degrees */
function Cake({ x, y, s = 1, rot = 0, T = 0, lit = true }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx="0" cy="70" rx="200" ry="34" fill="#e9e2d4" stroke={K} strokeWidth="7" />
    <rect x="-150" y="-60" width="300" height="130" rx="20" fill="#f08a9b" stroke={K} strokeWidth="8" />
    <path d="M-150 -30 Q-110 10 -75 -30 Q-37 10 0 -30 Q37 10 75 -30 Q110 10 150 -30" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
    {[-80, 0, 80].map((cx, i) => (<g key={i}><rect x={cx - 9} y="-130" width="18" height="70" rx="5" fill="#7fd6ff" stroke={K} strokeWidth="5" />
      {lit && <path d={`M${cx} -170 Q${cx + 14 + osc(T, 0.3, i) * 4} -146 ${cx} -134 Q${cx - 14} -146 ${cx} -170 Z`} fill={A} stroke={K} strokeWidth="4" />}</g>))}
  </g>);
}
/* a happiness gauge: needle 0..1 */
function Gauge({ x, y, v, label, s = 1 }) {
  const a = lp(-80, 80, cl(v));
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-170 0 A170 170 0 0 1 170 0 Z" fill={PAPER} stroke={K} strokeWidth="9" />
    <path d="M-150 -6 A150 150 0 0 1 -60 -136" fill="none" stroke={R} strokeWidth="22" /><path d="M60 -136 A150 150 0 0 1 150 -6" fill="none" stroke={GOOD} strokeWidth="22" />
    <line x1="0" y1="0" x2="0" y2="-130" stroke={K} strokeWidth="12" strokeLinecap="round" transform={`rotate(${a})`} /><circle r="16" fill={K} />
    {label && <text x="0" y="70" textAnchor="middle" fontFamily={BB} fontSize="56" letterSpacing="3" fill="#fff">{label}</text>}</g>);
}

/* 1 — Rosa at her birthday party, beaming too hard, clutching a checklist */
function MGHappiestNight({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  return (<g><MGBg kind="party" T={T} /><Balloons T={T} x={880} y={470} />
    <MGBust x={420} y={780} r={175} who="rosa" look={[0.4, -0.2]} brow="up" mouth="grin" bl={BL(T)} />
    <Checklist x={800} y={1050} s={0.58} rot={8} title="TONIGHT" items={[['CAKE', 1], ['LIGHTS', 1], ['HAPPIEST', 0]]} ring={t > c2 ? 2 : -1} rp={(t - c2) / 0.4} />
    <MGChip x={540} y={170} text="ROSA'S BIRTHDAY · 8:00 PM" size={40} pop={t / 0.25} /></g>);
}

/* 2 — you too: the big checklist, every box ticked except PERFECT */
function MGHadToBe({ T, t, beats }) {
  const c4 = b(beats, 4, 1.6);
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <Checklist x={540} y={860} s={1.15} title="THE BIG NIGHT" items={[['OUTFIT', 1], ['PLAYLIST', 1], ['PHOTOS', 1], ['PERFECT', 0]]} ticks={Math.floor(t / 0.35) + 1} ring={t > c4 ? 3 : -1} rp={(t - c4) / 0.4} />
    <MGHead x={170} y={1250} r={95} who={MG.extra(4)} look={[1, -0.6]} brow="worried" mouth="wave" bl={BL(T, 0.3)} /></g>);
}

/* 3 — snapback: Rosa's grin is strained, sweat, the effort meter maxes out */
function MGTryingHard({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6);
  const v = SM(c1 - 0.2, c1 + 0.5, t);
  return (<g><MGBg kind="party" T={T} dim={0.35} />
    <MGBust x={540} y={760} r={190} who="rosa" look={[0, 0]} brow="worried" mouth="grin" sweat={T * 0.9} bl={BL(T)} />
    <g transform="translate(540 300)"><rect x="-300" y="-50" width="600" height="100" rx="50" fill="rgba(10,10,16,0.8)" stroke="#fff" strokeWidth="6" />
      <rect x="-286" y="-36" width={572 * lp(0.35, 1, v)} height="72" rx="36" fill={v > 0.6 ? R : A} />
      <text x="0" y="-80" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="40" letterSpacing="4" fill="#fff">TRYING TO BE HAPPY</text></g>
    {t > c1 && <MGArrows x={540} y={760} t={t - c1} n={6} from={720} to={300} />}</g>);
}

/* 4 — she keeps checking: the party goes on while "HAPPY YET?" bubbles pile up over Rosa */
function MGHappyYet({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9);
  const times = ['8:05', '8:20', '8:40'];
  return (<g><MGBg kind="party" T={T} />
    <MGCrowd T={T} t={t} skip={[1, 4, 6]} />
    <MGPerson x={540} y={1290} s={2.6} who="rosa" look={[0, -0.6]} brow="worried" mouth="flat" bl={BL(T)} />
    {times.map((tm, i) => { const k = (t - 0.15 - i * 0.45) / 0.3; return (<g key={i}>
      <MGBubble x={[330, 760, 540][i]} y={[600, 560, 380][i]} text={'HAPPY|YET?'} k={k} size={46} />
      {k > 0 && <MGChip x={[330, 760, 540][i]} y={[340, 300, 120][i]} text={tm} outline size={32} pop={k} />}</g>); })}
    {t > c2 && <MGRing cx={540} cy={330} rx={180} ry={120} p={(t - c2) / 0.4} />}</g>);
}

/* 5 — study 2011: a newspaper praising happiness; a reader takes it in */
function MGHappyArticle({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  const k = EO(t / 0.5);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="STUDY · 2011" size={44} pop={t / 0.25} />
    <g transform={`translate(540 ${lp(1300, 820, k)}) rotate(${lp(12, -3, k)})`}>
      <rect x="-360" y="-330" width="720" height="660" rx="10" fill={PAPER} stroke={K} strokeWidth="9" />
      <text x="0" y="-250" textAnchor="middle" fontFamily={BB} fontSize="64" letterSpacing="6" fill={K}>THE DAILY NEWS</text>
      <line x1="-320" y1="-220" x2="320" y2="-220" stroke={K} strokeWidth="6" />
      <text x="0" y="-130" textAnchor="middle" fontFamily={BB} fontSize="92" fill={K}>HAPPINESS IS</text>
      <text x="0" y="-40" textAnchor="middle" fontFamily={BB} fontSize="92" fill={t > c3 ? R : K}>EVERYTHING</text>
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="-320" y={20 + i * 46} width={i % 2 ? 280 : 300} height="18" rx="9" fill="#d8d0c2" />)}
      <rect x="20" y="10" width="300" height="220" rx="8" fill="#ffe08a" stroke={K} strokeWidth="6" />
      <MGHead x={170} y={120} r={70} who={MG.extra(2)} mouth="grin" brow="up" bl={BL(T, 0.6)} /></g>
    {t > c3 && <MGChip x={540} y={1260} text="BE HAPPY. IT MATTERS." size={40} pop={(t - c3) / 0.25} />}</g>);
}

/* 6 — then a happy film: the article group watches a winning skater and feels LESS */
function MGHappyFilm({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  const drop = SM(c3, c3 + 0.6, t);
  return (<g><MGBg kind="dark" />
    <rect x="140" y="250" width="800" height="470" rx="24" fill="#18161d" stroke={K} strokeWidth="10" />
    <rect x="170" y="280" width="740" height="410" rx="12" fill="#bfe6ff" />
    <rect x="170" y="560" width="740" height="130" fill="#eaf6ff" />
    <MGPerson x={540 + osc(T, 1.6) * 60} y={640} s={1.5} who={MG.extra(6)} mouth="grin" brow="up" bl={BL(T)} />
    <g transform="translate(700 380)"><circle r="44" fill={A} stroke={K} strokeWidth="6" /><text y="16" textAnchor="middle" fontFamily={BB} fontSize="48" fill={K}>1</text></g>
    <MGChip x={540} y={200} text="A HAPPY FILM" size={40} pop={t / 0.25} />
    <Gauge x={300} y={1060} v={0.82} label="OTHERS" s={0.9} />
    <Gauge x={780} y={1060} v={lp(0.82, 0.4, drop)} label="READ IT" s={0.9} />
    {t > c3 && <MGRing cx={780} cy={1010} rx={190} ry={150} p={(t - c3) / 0.4} />}</g>);
}

/* 7 — name it: chasing happiness turns the night into a test; Rosa grades it with a red pen */
function MGGradeIt({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9), c3 = b(beats, 3, 1.5);
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <MGBust x={330} y={830} r={150} who="rosa" look={[1, 0.4]} brow={t > c3 ? 'worried' : 'flat'} mouth={t > c3 ? 'frown' : 'flat'} bl={BL(T)} />
    <g transform="translate(790 820) rotate(6)"><rect x="-200" y="-250" width="400" height="500" rx="16" fill={PAPER} stroke={K} strokeWidth="9" />
      <text x="0" y="-160" textAnchor="middle" fontFamily={BB} fontSize="56" letterSpacing="3" fill={K}>TONIGHT</text>
      {[0, 1, 2].map((i) => <rect key={i} x="-150" y={-110 + i * 50} width="300" height="18" rx="9" fill="#d8d0c2" />)}
      {t > c2 && <text x="0" y="170" textAnchor="middle" fontFamily={BB} fontSize={180 * BK(cl((t - c2) / 0.3))} fill={R}>C+</text>}</g>
    <MGTitle lines={[['GRADING', '#fff', 150], ['THE FUN', A, 120]]} y={260} a={SM(0, 0.3, t)} />
    {t > c3 && <MGChip x={790} y={1210} text="DISAPPOINTED" outline size={40} pop={(t - c3) / 0.25} />}</g>);
}

/* 8 — self-proof: New Year's Eve, an over-planned itinerary unrolls to the floor at 11:59 */
function MGNewYears({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  const L = lp(120, 760, EO((t - c2 + 0.2) / 0.8));
  const plan = ['8:00 DINNER', '9:15 BAR', '10:00 PARTY', '11:00 ROOFTOP', '11:59 PERFECT KISS', '12:00 BEST YEAR'];
  return (<g><MGBg kind="street" T={T} />
    {[0, 1, 2].map((i) => { const ph = ((T * 0.5 + i * 0.33) % 1); return <g key={i} opacity={1 - ph}>{[...Array(10)].map((_, k) => { const a = k / 10 * Math.PI * 2, r = 30 + ph * 140;
      return <circle key={k} cx={[260, 820, 560][i] + Math.cos(a) * r} cy={[260, 330, 160][i] + Math.sin(a) * r} r="9" fill={['#ff6f91', '#ffcf5a', '#7fd6ff'][i]} />; })}</g>; })}
    <MGChip x={540} y={470} text="DEC 31 · 11:59 PM" size={42} pop={t / 0.25} />
    <MGPerson x={300} y={1300} s={2.4} who={MG.extra(8)} look={[1, 0.2]} brow="worried" mouth="wave" bl={BL(T)} />
    <g transform="translate(640 600)"><rect x="-10" y="0" width="340" height={L} fill={PAPER} stroke={K} strokeWidth="7" />
      {plan.map((p, i) => (i * 120 + 90 < L ? <text key={i} x="10" y={70 + i * 120} fontFamily={BB} fontSize="44" fill={i === 4 ? R : K}>{p}</text> : null))}
      <rect x="-30" y="-30" width="380" height="50" rx="25" fill="#b98e62" stroke={K} strokeWidth="7" /></g></g>);
}

/* 9 — payoff: Nia drops the cake, splat; Rosa finally laughs for real */
function MGCakeDrop({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c3 = b(beats, 3, 1.6);
  const f = EO((t - c1 + 0.2) / 0.45), landed = t > c1 + 0.25;
  return (<g><MGBg kind="party" T={T} />
    <MGPerson x={260} y={1290} s={2.5} who="nia" look={[1, 0.6]} brow="up" mouth="o" bl={BL(T, 0.4)} />
    {!landed ? <Cake x={lp(380, 540, f)} y={lp(840, 1200, f)} rot={lp(0, 70, f)} T={T} s={0.8} />
      : <g><ellipse cx="560" cy="1260" rx="230" ry="48" fill="#f08a9b" stroke={K} strokeWidth="7" />
        {[...Array(9)].map((_, i) => <circle key={i} cx={560 + (hsh(i) - 0.5) * 520} cy={1230 - hsh(i + 9) * 90} r={14 + hsh(i + 20) * 14} fill={i % 2 ? '#fff' : '#f08a9b'} stroke={K} strokeWidth="4" />)}</g>}
    <MGPerson x={820} y={1290} s={2.5} who="rosa" look={[-1, 0.6]} brow={t > c3 ? 'up' : 'worried'} mouth={t > c3 ? 'grin' : 'o'} bl={BL(T)} />
    {t > c3 && <Checklist x={lp(820, 1180, EO((t - c3) / 0.7))} y={lp(900, 300, EO((t - c3) / 0.7))} s={0.35} rot={lp(0, 260, EO((t - c3) / 0.7))} items={[['HAPPIEST', 0]]} />}
    {t > c3 && <MGChip x={540} y={230} text="FINALLY. REAL FUN." size={42} pop={(t - c3) / 0.25} />}</g>);
}

/* end: Rosa and Nia dance; the checklist sits crumpled; question + send chips */
function MGEndNoList({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c3 = b(beats, 3, 1.7);
  return (<g><MGBg kind="party" T={T} /><Balloons T={T} x={160} y={420} />
    <MGPerson x={380} y={1290 - Math.abs(osc(T, 0.8)) * 30} s={2.4} who="rosa" look={[1, 0]} mouth="grin" brow="up" bl={BL(T)} />
    <MGPerson x={720} y={1290 - Math.abs(osc(T, 0.8, 0.5)) * 30} s={2.4} who="nia" look={[-1, 0]} mouth="grin" brow="up" bl={BL(T, 0.5)} />
    <MGChip x={540} y={200} text="STOP GRADING" size={56} pop={t / 0.25} />
    {t > c1 && <MGChip x={540} y={320} text="WHICH NIGHT WAS YOURS?" outline size={38} pop={(t - c1) / 0.25} />}
    {t > c3 && <MGChip x={820} y={1260} text="SEND IT" size={42} pop={(t - c3) / 0.25} />}</g>);
}

Object.assign(window, { MGHappiestNight, MGHadToBe, MGTryingHard, MGHappyYet, MGHappyArticle, MGHappyFilm, MGGradeIt, MGNewYears, MGCakeDrop, MGEndNoList });
})();
