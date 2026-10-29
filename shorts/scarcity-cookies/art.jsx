// art.jsx — "Only 2 Left? Read This First" (Lila ep. 2 with The Doubt and Mae, retro modern illustration).
// Scarcity effect: Worchel, Lee & Adewole 1975 (cookie-jar study).
// Full 1080×1920 frames with retro-kit.jsx; captions sit at y ≈ 1540 (band 1420–1660) unless a line sets capY.
// Pure functions of T, t, dur, beats. t can be negative before a scene starts — everything is clamped.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const FONT = "'Oswald', sans-serif";
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);

/* a mustard cookie with ink chocolate chips */
function Cookie({ x, y, r = 42, seed = 1, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r} fill={P.yel} stroke={P.blk} strokeWidth={Math.max(3, r * 0.12)} />
    <circle r={r * 0.78} fill="none" stroke="#D9A62A" strokeWidth={r * 0.1} />
    {[...Array(5)].map((_, i) => { const a = hsh(seed * 7 + i) * Math.PI * 2, d = r * (0.2 + hsh(seed * 13 + i) * 0.5);
      return <path key={i} d={`M${Math.cos(a) * d - r * 0.1} ${Math.sin(a) * d + r * 0.08} L${Math.cos(a) * d} ${Math.sin(a) * d - r * 0.13} L${Math.cos(a) * d + r * 0.11} ${Math.sin(a) * d + r * 0.08} Z`} fill={P.blk} />; })}</g>);
}
/* glass jar holding n cookies (local: body 300×400 centred on x,y) */
function Jar({ x, y, s = 1, n = 10, glow = 0, seed = 0 }) {
  const k = Math.max(0, Math.min(10, Math.round(n)));
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0 && <ellipse cx={0} cy={0} rx={260} ry={300} fill={P.cyan} opacity={0.25 * glow} style={{ filter: 'blur(20px)' }} />}
    <rect x={-150 + 14} y={-200 + 14} width={300} height={400} rx={40} fill={P.blk} />
    <rect x={-150} y={-200} width={300} height={400} rx={40} fill={P.cream} fillOpacity="0.85" />
    {[...Array(k)].map((_, i) => { const row = Math.floor(i / 3), col = i % 3;
      return <Cookie key={i} x={-90 + col * 90 + (row % 2) * 18} y={145 - row * 72} r={44} seed={i + seed} rot={i * 37} />; })}
    <rect x={-150} y={-200} width={300} height={400} rx={40} fill="none" stroke={P.blk} strokeWidth="9" />
    <path d="M-110 -160 L-110 120" stroke="#fff" strokeOpacity="0.6" strokeWidth="14" strokeLinecap="round" />
    <rect x={-120} y={-250} width={240} height={60} rx={10} fill={P.blue} stroke={P.blk} strokeWidth="8" /></g>);
}
/* hand-lettered shop sign */
function Sign({ x, y, text, sub, k = 1, rot = -4, col = P.cream, small = false }) {
  const w = small ? 760 : 480, fs = small ? 96 : 110;
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)}) rotate(${rot})`}>
    <rect x={-w / 2 + 12} y={-110 + 12} width={w} height={220} fill={P.blk} />
    <rect x={-w / 2} y={-110} width={w} height={220} fill={col} stroke={P.blk} strokeWidth="8" />
    <text y={sub ? -5 : 35} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize={fs} letterSpacing="4" fill={P.redD}>{text}</text>
    {sub && <text y={75} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="44" letterSpacing="4" fill={P.blk}>{sub}</text>}</g>);
}
/* bakery window with striped awning */
function Shop({ T }) {
  return (<g><rect x={60} y={360} width={960} height={900} fill={P.redD} stroke={P.blk} strokeWidth="10" />
    <rect x={130} y={520} width={820} height={660} fill={P.blue} stroke={P.blk} strokeWidth="9" />
    {[...Array(8)].map((_, i) => <path key={i} d={`M${60 + i * 120} 330 L${180 + i * 120} 330 L${170 + i * 120} 450 Q${120 + i * 120} 490 ${70 + i * 120} 450 Z`} fill={i % 2 ? P.cream : P.red} stroke={P.blk} strokeWidth="7" />)}
    <rect x={40} y={290} width={1000} height={50} fill={P.blk} />
    <text x={540} y={330} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="44" letterSpacing="14" fill={P.yel}>BAKERY</text>
    <path d="M130 1100 L950 1100" stroke={P.blk} strokeWidth="10" /></g>);
}

/* 1 — Lila passes a bakery sign: ONLY 2 LEFT */
function SCHook({ T, t, beats }) {
  const e = bt(beats, 2, 0.8);
  return (<g><RMBg kind="red" /><Shop T={T} />
    <Jar x={330} y={880} s={0.85} n={2} glow={SM(e, e + 0.4, t)} />
    <Sign x={700} y={700} text="ONLY 2 LEFT!" k={(t - e) / 0.3} rot={-6} />
    <RMLila x={780} y={1180} s={0.62} mouth="open" brow="up" lid={0} wide look={[-0.9, -0.7]} /></g>);
}

/* 2 — she wasn't even hungry */
function SCHungry({ T, t }) {
  return (<g><RMBg kind="redDark" />
    <RMLila x={540} y={1000} s={1.0} mouth="flat" brow="flat" lid={0.45} look={[0.5, -0.4]} />
    <RMChip x={540} y={240} text="JUST HAD LUNCH" col={P.cream} size={54} pop={(t - 0.2) / 0.25} rot={0.03} />
    <Cookie x={880} y={420} r={70} seed={4} rot={T * 20} /></g>);
}

/* 3 — The Doubt pops up behind her: "WHAT IF THEY'RE GONE?" */
function SCDoubt({ T, t, beats }) {
  const up = EO((t - 0.1) / 0.5), e = bt(beats, 2, 1);
  return (<g><RMBg kind="red" />
    <RMDoubt x={780} y={lp(1300, 760, up)} s={0.85} T={T} mood="sly" look={[-0.8, 0.5]} blink={T % 3 > 2.88 ? 1 : 0} />
    <RMLila x={400} y={1080} s={0.9} mouth="frown" brow="sad" lid={0} wide stress look={[0.8, -0.4]} />
    <RMSpeech x={560} y={300} text={"“WHAT IF THEY'RE GONE?”"} size={60} col={P.yel} k={(t - e + 0.2) / 0.3} /></g>);
}

/* 4 — she buys both */
function SCBuy({ T, t }) {
  const k = BK((t - 0.15) / 0.35);
  return (<g><RMBg kind="redDark" />
    <RMLila x={540} y={1060} s={0.95} mouth="smile" brow="up" lid={0.1} look={[0, -0.8]} />
    <g transform={`translate(540 500) scale(${k}) rotate(${Math.sin(T * 3) * 4})`}>
      <path d="M-170 -120 L170 -120 L200 200 L-200 200 Z" fill={P.blk} transform="translate(12 12)" />
      <path d="M-170 -120 L170 -120 L200 200 L-200 200 Z" fill={P.cream} stroke={P.blk} strokeWidth="8" />
      <path d="M-170 -120 L-130 -170 L-90 -120 L-50 -170 L-10 -120 L30 -170 L70 -120 L110 -170 L150 -120" fill="none" stroke={P.blk} strokeWidth="6" />
      <Cookie x={-70} y={-150} r={70} seed={2} rot={-20} /><Cookie x={60} y={-170} r={70} seed={9} rot={30} />
      <text y={90} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="80" letterSpacing="6" fill={P.redD}>BOTH!</text></g>
    <RMDoubt x={930} y={1250} s={0.32} T={T} mood="sly" look={[-1, -0.5]} /></g>);
}

/* 5 — the turn: inside, Mae shows a full tray of the same cookies */
function SCTray({ T, t, beats }) {
  const e = bt(beats, 1, 0.6);
  return (<g><RMBg kind="blue" />
    <g transform={`translate(540 560) rotate(-3) scale(${BK((t - e + 0.3) / 0.35)})`}>
      <rect x={-420 + 14} y={-260 + 14} width={840} height={520} fill={P.blk} />
      <RMGrid x={-420} y={-260} w={840} h={520} step={40} />
      {[...Array(24)].map((_, i) => <Cookie key={i} x={-350 + (i % 6) * 140} y={-190 + Math.floor(i / 6) * 128} r={52} seed={i + 30} rot={i * 23} />)}</g>
    <RMMae x={300} y={1200} s={0.72} mouth="smile" brow="up" lid={0.35} look={[0.6, -0.8]} />
    <RMLila x={790} y={1220} s={0.66} mouth="open" brow="up" lid={0} wide look={[-0.4, -1]} />
    <RMChip x={540} y={190} text="IN THE BACK" col={P.cream} size={50} pop={(t - e) / 0.25} /></g>);
}

/* 6 — name it: macro eye, a lone cookie in the pupil */
function SCName({ T, t }) {
  return (<g><RMEyeMacro open={EO(t / 0.5)}><Cookie x={540} y={985} r={78} seed={5} rot={T * 15} /></RMEyeMacro>
    <RMTitle lines={[['SCARCITY', P.cream, 170], ['EFFECT', P.yel, 170]]} y={230} a={EO((t - 0.4) / 0.4)} /></g>);
}

/* 7 — 1975: a jar of ten vs a jar of two */
function SCStudy({ T, t, beats }) {
  const e = bt(beats, beats.length - 1, 2);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={190} text="WORCHEL, LEE & ADEWOLE · 1975" col={P.cream} size={40} pop={t / 0.25} />
    <Jar x={290} y={860} s={0.95} n={10} seed={3} />
    <Jar x={790} y={860} s={0.95} n={2} seed={7} glow={SM(e, e + 0.4, t)} />
    <RMChip x={290} y={1190} text="JAR OF 10" col={P.cream} size={44} pop={(t - 0.6) / 0.25} />
    <RMChip x={790} y={1190} text="JAR OF 2" col={P.yel} size={44} pop={(t - e) / 0.25} /></g>);
}

/* 8 — same cookie, rated: the near-empty jar's wins */
function SCRated({ T, t, beats }) {
  const g = EO((t - 0.4) / 1.0);
  const bar = (x, h, col, lab) => (<g><rect x={x - 120 + 14} y={1150 - h * g + 14} width={240} height={h * g} fill={P.blk} />
    <rect x={x - 120} y={1150 - h * g} width={240} height={h * g} fill={col} stroke={P.blk} strokeWidth="7" />
    <RMChip x={x} y={1215} text={lab} col={P.cream} size={36} /></g>);
  return (<g><RMBg kind="redDark" />
    <RMChip x={540} y={190} text="HOW DESIRABLE?" col={P.cream} size={52} pop={t / 0.25} />
    <Cookie x={300} y={400} r={80} seed={3} /><Cookie x={780} y={400} r={80} seed={3} />
    <text x={540} y={430} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="110" fill={P.cream}>=</text>
    {bar(300, 330, P.blue, 'FROM 10')}{bar(780, 560, P.yel, 'FROM 2')}
    <rect x={100} y={1150} width={880} height={10} fill={P.blk} />
    {g > 0.95 && <RMBadge x={900} y={540} r={70} k={(t - 1.4) / 0.25} />}</g>);
}

/* 9 — the jar empties because OTHER people grab them: valued highest of all */
function SCDemand({ T, t, beats }) {
  const e = bt(beats, beats.length - 1, 2.4), take = cl((t - 0.3) / Math.max(0.6, e - 0.5));
  const n = Math.round(lp(10, 2, take));
  return (<g><RMBg kind="red" />
    {[0, 1, 2, 3].map((i) => { const a = -0.9 + i * 0.6, ph = SM(0.3 + i * 0.4, 0.6 + i * 0.4, t) * (1 - SM(0.7 + i * 0.4, 1.0 + i * 0.4, t));
      return <g key={i} transform={`translate(${540 + Math.sin(a) * 700} ${300 + i * 60}) rotate(${-a * 57 - 0})`}>
        <g transform={`translate(0 ${ph * 260})`}><rect x={-45} y={-500} width={90} height={420} fill={i % 2 ? P.pink : P.cream} stroke={P.blk} strokeWidth="7" />
          {[-30, -10, 10, 30].map((fx) => <rect key={fx} x={fx - 9} y={-90} width={18} height={60} rx={9} fill={i % 2 ? P.pink : P.cream} stroke={P.blk} strokeWidth="4" />)}</g></g>; })}
    <Jar x={540} y={900} s={1.05} n={n} seed={11} glow={SM(e, e + 0.4, t)} />
    <RMChip x={540} y={1240} text={`LEFT: ${n}`} col={P.cream} size={48} />
    <RMChip x={540} y={1360} text="OTHERS WANTED THEM" col={P.yel} size={48} pop={(t - e) / 0.25} /></g>);
}

/* 10 — Lila's new rule: would I want it if there were TEN? The Doubt shrinks away */
function SCTip({ T, t, beats }) {
  const e = bt(beats, 2, 1.4), flip = SM(e - 0.1, e + 0.25, t);
  return (<g><RMBg kind="redDark" />
    <g transform={`translate(540 430) scale(1 ${Math.abs(1 - 2 * flip) || 0.02})`}>
      {flip < 0.5 ? <Sign x={0} y={0} text="ONLY 2 LEFT!" k={(t - 0.1) / 0.3} rot={-4} />
        : <Sign x={0} y={0} text="IF THERE WERE 10?" sub="WOULD I STILL WANT IT?" k={1} rot={3} col={P.yel} small />}</g>
    <RMLila x={540} y={1110} s={0.92} mouth={flip > 0.5 ? 'smile' : 'flat'} brow={flip > 0.5 ? 'up' : 'flat'} lid={0.25} look={[0, -0.8]} />
    <RMDoubt x={lp(900, 1250, flip)} y={1180} s={lp(0.42, 0.2, flip)} T={T} mood={flip > 0.5 ? 'shocked' : 'sly'} look={[-1, -0.3]} /></g>);
}

Object.assign(window, { SCHook, SCHungry, SCDoubt, SCBuy, SCTray, SCName, SCStudy, SCRated, SCDemand, SCTip });
})();
