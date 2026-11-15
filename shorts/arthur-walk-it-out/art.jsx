// art.jsx — "Stuck on a Problem? Stand Up" (Arthur ep. 10, with Mae; retro modern illustration).
// Walking and creativity: Oppezzo & Schwartz 2014 (JEP:LMC, Stanford) — 176 people; most produced more creative ideas walking
// than sitting, even on a treadmill facing a blank wall; in one experiment walkers doubled their novel responses; part of the
// boost carried over after sitting back down. Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540, faces stay above y 1400.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";
const WALKER = { name: 'Walker', kind: 'human', skin: P.yel, skinD: '#D9A62A', hair: 'flat', hairCol: P.blue, moustache: false, jacket: P.green };

/* an old beige monitor with a blank email draft and a blinking cursor */
function Monitor({ x, y, s = 1, T = 0, text = 'RE: ', glow = 0 }) {
  const on = Math.floor(T * 2) % 2 === 0;
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0 && <circle r={420} fill={P.cyan} opacity={0.12 * glow} />}
    <rect x={-330} y={-250} width={660} height={480} rx={26} fill={P.cream} {...ink(9)} />
    <rect x={-280} y={-200} width={560} height={370} fill={P.blue} {...ink(6)} />
    <rect x={-250} y={-170} width={500} height={60} fill={P.cream} opacity="0.9" />
    <text x={-232} y={-125} fontFamily={BEB} fontSize="44" letterSpacing="3" fill={P.blk}>{text}</text>
    {[0, 1, 2, 3].map((k) => <rect key={k} x={-250} y={-80 + k * 50} width={k === 0 ? 30 : 0} height={34} fill={P.cream} opacity={on ? 1 : 0} />)}
    <path d={RM.pts([[-90, 230], [90, 230], [130, 330], [-130, 330]])} fill={P.cream} {...ink(8)} />
  </g>);
}
/* skinny black trouser legs that swing (walking) */
function Legs({ x, y, s = 1, T = 0, walk = 1, col = P.blk }) {
  const a = osc(T, 0.9) * 0.45 * walk;
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>{[-1, 1].map((sd) => { const an = a * sd;
    return (<g key={sd} transform={`translate(${sd * 70} 0) rotate(${an * 57.3})`}><path d="M-38 0 L38 0 L34 380 L-34 380 Z" fill={col} {...ink(6)} />
      <path d="M-40 380 L70 380 L70 420 L-40 420 Z" fill={P.blk} {...ink(5)} /></g>); })}</g>);
}
/* thought bulb that pops in (k) and glows */
function IdeaBulb({ x, y, k = 1, T = 0, s = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(cl(k)) * s})`}>
    <circle r={95} fill="#ffe9a0" opacity={0.25 + 0.08 * Math.sin(T * 6 + x)} />
    <circle r={58} fill={P.yel} {...ink(6)} /><rect x={-26} y={50} width={52} height={36} fill={P.blk} />
    <path d="M-18 10 L-6 -14 L6 10 L18 -14" fill="none" stroke={P.redD} strokeWidth="5" strokeLinecap="round" /></g>);
}

/* 1 — 11:00 → 12:04: Arthur glaring at a blank email; the clock chip jumps an hour */
function RMStuckDesk({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6), c3 = bt(beats, 3, 1.6);
  return (<g><RMBg kind="red" />
    <RMArthur x={540} y={560} s={0.62} mouth="frown" brow="angry" lid={0.35} look={[0, 1]} stress={t > c1} body={false} />
    <path d={RM.pts([[180, 1500], [210, 800], [360, 740], [720, 740], [870, 800], [900, 1500]])} fill={P.blk} />
    <Monitor x={540} y={1010} s={0.95} T={T} />
    <rect x={-20} y={1330} width={1120} height={60} fill={P.blueD} {...ink(6)} />
    <RMChip x={540} y={170} text={t < c3 ? '11:00 AM' : '12:04 PM'} col={t < c3 ? P.cream : P.yel} size={58} pop={t < c3 ? t / 0.25 : (t - c3) / 0.25} />
    {t > c1 && <RMChip x={830} y={300} text="STUCK" col={P.pink} size={46} pop={(t - c1) / 0.25} rot={0.06} />}</g>);
}

/* 2 — you too: extreme close-up, eyes wide, the loop rings "THINK HARDER" spin behind */
function RMStareHarder({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.9);
  return (<g><RMBg kind="redDark" /><RMLoopRings T={T} text="THINK HARDER" cx={540} cy={760} />
    <RMArthur x={540} y={lp(760, 730, EO(t / 1.5))} s={lp(0.95, 1.08, EO((t - c2) / 0.5))} mouth="flat" brow="angry" lid={t > c2 ? 0 : 0.3} wide={t > c2} look={[0, 0]} stress body={false} />
    <g opacity={SM(c2, c2 + 0.3, t)}>{[0, 1, 2, 3].map((i) => <path key={i} d={`M${200 + i * 30} ${330 - i * 10} l-30 -40`} {...ink(9)} />)}{[0, 1, 2, 3].map((i) => <path key={'r' + i} d={`M${880 - i * 30} ${330 - i * 10} l30 -40`} {...ink(9)} />)}</g></g>);
}

/* 3 — snapback: the empty office chair under a spotlight, a heavy ball and chain on it */
function RMChairProblem({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  const sw = Math.sin(T * 1.4) * 0.03;
  return (<g><RMBg kind="blue" />
    <path d="M540 -40 L180 1400 L900 1400 Z" fill={P.cream} opacity="0.12" />
    <g transform={`translate(540 900) rotate(${sw * 57.3})`}>
      <rect x={-210} y={-420} width={420} height={420} rx={50} fill={P.blk} {...ink(8)} />
      <rect x={-250} y={0} width={500} height={110} rx={30} fill={P.blk} {...ink(8)} />
      <rect x={-20} y={110} width={40} height={180} fill={P.blk} />
      {[-1, 0, 1].map((k) => <g key={k}><path d={`M0 290 L${k * 220} 360`} {...ink(18)} /><circle cx={k * 220} cy={372} r={24} fill={P.blk} /></g>)}
      {[...Array(6)].map((_, i) => <ellipse key={i} cx={-180 + i * 40} cy={60 + Math.sin(i) * 6} rx={26} ry={16} fill="none" stroke={P.cream} strokeWidth="9" />)}
      <circle cx={130} cy={-30} r={85} fill={P.blk} stroke={P.cream} strokeWidth="6" />
      <text x={130} y={-12} textAnchor="middle" fontFamily={BEB} fontSize="54" fill={P.cream}>SIT</text></g>
    <RMChip x={540} y={230} text="SITTING STILL" col={P.cream} size={54} pop={t / 0.25} />
    {t > c2 && <RMChip x={540} y={1330} text="THE PROBLEM?" col={P.yel} size={62} pop={(t - c2) / 0.25} rot={0.03} />}</g>);
}

/* 4 — the study: STANFORD · 2014; a walker on a treadmill facing a blank grid-paper wall */
function RMTreadmill({ T, t, beats }) {
  const c4 = bt(beats, 4, 1.8);
  const belt = (T * 220) % 60;
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={170} text="STANFORD · 2014" col={P.cream} size={50} pop={t / 0.25} />
    <RMGrid x={110} y={290} w={860} h={560} />
    {t > c4 && <RMChip x={540} y={570} text="BLANK WALL" col={P.yel} size={58} pop={(t - c4) / 0.25} />}
    <Legs x={540} y={1060} s={0.62} T={T} />
    <RMHuman who={WALKER} x={540} y={790} s={0.42} mouth="flat" lid={0.2} look={[0, -1]} />
    <path d={RM.pts([[120, 1330], [960, 1330], [1000, 1400], [80, 1400]])} fill={P.blk} />
    <g>{[...Array(16)].map((_, i) => { const xx = 130 + ((i * 60 + belt) % 860); return <line key={i} x1={xx} y1={1338} x2={xx - 10} y2={1392} stroke="#3a3240" strokeWidth="6" />; })}</g>
    <path d="M880 1330 L940 960 L990 960" fill="none" {...ink(14)} /><rect x={900} y={920} width={140} height={60} rx={10} fill={P.red} {...ink(6)} />
    <text x={970} y={963} textAnchor="middle" fontFamily={BEB} fontSize="40" fill={P.cream}>{(3 + Math.floor(T * 3) % 7).toFixed(0)}.0</text></g>);
}

/* 5 — result: SITTING vs WALKING, idea bulbs pop over each; the walking pile doubles */
function RMIdeaBulbs({ T, t, beats }) {
  const c4 = bt(beats, 4, 1.8);
  const left = [[230, 420], [350, 330]], right = [[650, 420], [770, 330], [890, 420], [710, 220], [830, 220], [770, 120]];
  return (<g><RMBg kind="red" />
    <line x1={540} y1={150} x2={540} y2={1330} stroke={P.blk} strokeWidth="8" strokeDasharray="30 22" />
    <RMChip x={290} y={1300} text="SITTING" col={P.cream} size={50} pop={t / 0.25} />
    <RMChip x={790} y={1300} text="WALKING" col={P.yel} size={50} pop={(t - 0.15) / 0.25} />
    <g transform="translate(290 0)"><path d={RM.pts([[-150, 1220], [-150, 1000], [150, 1000], [150, 1220]])} fill={P.blk} /></g>
    <RMHuman who={WALKER} x={290} y={830} s={0.36} mouth="flat" lid={0.45} look={[0, -1]} />
    <Legs x={790} y={1000} s={0.5} T={T} />
    <RMHuman who={WALKER} x={790} y={800} s={0.36} mouth="smile" brow="up" lid={0.1} look={[0, -1]} />
    {left.map(([x, y], i) => <IdeaBulb key={i} x={x} y={y + 200} s={0.85} T={T} k={(t - 0.4 - i * 0.3) / 0.3} />)}
    {right.map(([x, y], i) => <IdeaBulb key={i} x={x} y={y + 200} s={0.85} T={T} k={(i < 3 ? (t - 0.5 - i * 0.25) : (t - c4 - (i - 3) * 0.12)) / 0.3} />)}
    {t > c4 && <RMChip x={790} y={140} text="2× NEW IDEAS" col={P.yel} size={52} pop={(t - c4) / 0.25} rot={0.04} />}</g>);
}

/* 6 — name it: the brain dome lights up with cyan bolts while footprints march across a blank wall */
function RMWalkingItself({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.7);
  const steps = Math.floor(cl((t - 0.1) / 0.18, 0, 8));
  return (<g><RMBg kind="blue" />
    <RMGrid x={90} y={170} w={900} h={420} />
    <text x={540} y={410} textAnchor="middle" fontFamily={BEB} fontSize="90" letterSpacing="10" fill={P.redD} opacity={1 - SM(0, c1, t) * 0.75}>NO VIEW</text>
    {[...Array(steps)].map((_, i) => <g key={i} transform={`translate(${170 + i * 105} ${i % 2 ? 470 : 530}) rotate(90)`}><ellipse rx={30} ry={18} fill={P.blk} /><circle cx={-38} cy={0} r={11} fill={P.blk} /></g>)}
    <RMBrain cx={540} cy={1180} w={560} h={480} />
    {t > c1 && [0, 1, 2, 3, 4].map((i) => <RMBolt key={i} x={540 + (i - 2) * 120} y={900 + Math.abs(i - 2) * 50} len={190} ang={-1.57 + (i - 2) * 0.35} seed={i + 3} T={T} />)}
    {t > c1 && <RMChip x={540} y={700} text="THE WALKING ITSELF" col={P.yel} size={54} pop={(t - c1) / 0.25} />}</g>);
}

/* 7 — self-proof: Mae mid-stride at dusk, a bulb pops over her head */
function RMMidWalk({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.3);
  const bob = Math.abs(Math.sin(T * 3.4)) * 14;
  return (<g><RMBg kind="redDark" />
    <circle cx={820} cy={330} r={120} fill={P.yel} opacity="0.85" />
    {[...Array(5)].map((_, i) => <rect key={i} x={-60 + i * 250 - ((T * 60) % 250)} y={760 - (i % 3) * 90} width={170} height={700} fill={P.blk} opacity="0.55" />)}
    <Legs x={540} y={1130 - bob} s={0.6} T={T} />
    <RMMae x={540} y={790 - bob} s={0.5} mouth={t > c3 ? 'smile' : 'flat'} brow={t > c3 ? 'up' : 'flat'} lid={t > c3 ? 0 : 0.3} wide={t > c3} look={[0.3, t > c3 ? -1 : 0]} />
    <IdeaBulb x={720} y={340} s={1.3} T={T} k={(t - c3) / 0.3} />
    {t > c3 && [0, 1, 2, 3, 4, 5].map((i) => { const a = -2.6 + i * 0.25; return <line key={i} x1={720 + Math.cos(a) * 130} y1={340 + Math.sin(a) * 130} x2={720 + Math.cos(a) * 170} y2={340 + Math.sin(a) * 170} {...ink(8)} />; })}
    <RMChip x={260} y={190} text="ON THE WAY HOME" col={P.cream} size={44} pop={t / 0.25} rot={-0.03} /></g>);
}

/* 8 — payoff: Mae walks Arthur round the block; bulbs keep popping over Arthur (and stay when he sits back down) */
function RMRoundBlock({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2);
  const bob = (ph) => Math.abs(Math.sin(T * 3.4 + ph)) * 12;
  const n = Math.floor(cl((t - c2) / 0.22, 0, 6));
  const spots = [[250, 250], [400, 170], [560, 250], [180, 400], [470, 380], [620, 140]];
  return (<g><RMBg kind="red" />
    <g transform="translate(860 330)"><rect x={-130} y={-130} width={260} height={260} fill="none" stroke={P.cream} strokeWidth="10" strokeDasharray="26 18" />
      <circle cx={-130 + ((t * 300) % 520 < 260 ? (t * 300) % 260 : 260)} cy={-130 + ((t * 300) % 520 < 260 ? 0 : ((t * 300) % 520) - 260)} r={18} fill={P.yel} {...ink(5)} /></g>
    <RMChip x={860} y={540} text="ROUND THE BLOCK" col={P.cream} size={36} pop={t / 0.25} />
    <Legs x={330} y={1160 - bob(0)} s={0.55} T={T} />
    <Legs x={760} y={1160 - bob(1)} s={0.55} T={T + 0.4} col={P.blue} />
    <RMArthur x={330} y={850 - bob(0)} s={0.46} mouth={n > 0 ? 'smile' : 'flat'} brow={n > 0 ? 'up' : 'flat'} lid={n > 0 ? 0.05 : 0.3} look={[0.4, n > 0 ? -1 : 0]} />
    <RMMae x={760} y={850 - bob(1)} s={0.46} mouth="smile" lid={0.2} look={[-0.6, 0]} />
    {spots.slice(0, n).map(([x, y], i) => <IdeaBulb key={i} x={x} y={y + 160} s={0.7} T={T} k={(t - c2 - i * 0.22) / 0.3} />)}
    {t > c2 && <RMChip x={330} y={190} text={'IDEAS: ' + n} col={P.yel} size={50} pop={(t - c2) / 0.25} />}</g>);
}

/* 9 — end: the chair pushed back, Arthur on his feet; question + send line chips */
function RMEndStandUp({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2), c4 = bt(beats, 4, 2.6);
  return (<g><RMBg kind="dark" />
    <g transform="translate(830 1050) rotate(14)"><rect x={-120} y={-260} width={240} height={250} rx={30} fill={P.blk} stroke={P.cream} strokeWidth="5" /><rect x={-150} y={-10} width={300} height={70} rx={20} fill={P.blk} stroke={P.cream} strokeWidth="5" />
      <rect x={-12} y={60} width={24} height={110} fill={P.cream} /></g>
    <Legs x={420} y={1000} s={0.55} T={T} walk={SM(0.2, 0.6, t)} />
    <RMArthur x={420} y={700} s={0.46} mouth="smile" brow="up" lid={0.1} look={[0.5, -0.4]} />
    <IdeaBulb x={620} y={330} s={0.9} T={T} k={(t - 0.3) / 0.3} />
    <RMChip x={540} y={150} text="STUCK? STAND UP." col={P.yel} size={54} pop={t / 0.25} />
    {t > c2 && <RMChip x={540} y={1300} text="WHERE DO YOUR IDEAS HIT?" col={P.pink} size={40} pop={(t - c2) / 0.25} rot={0.02} />}
    {t > c4 && <RMChip x={760} y={500} text="SEND IT" col={P.cream} size={44} pop={(t - c4) / 0.25} rot={-0.05} />}</g>);
}

Object.assign(window, { RMStuckDesk, RMStareHarder, RMChairProblem, RMTreadmill, RMIdeaBulbs, RMWalkingItself, RMMidWalk, RMRoundBlock, RMEndStandUp });
})();
