// art.jsx — "The Last Day Ruined the Whole Trip" (Arthur ep. 2 with Mae, retro modern illustration).
// Peak-end rule: Kahneman, Fredrickson, Schreiber & Redelmeier 1993 (cold-water study).
// Full 1080×1920 frames with retro-kit.jsx; captions sit at y ≈ 1540 (band 1420–1660) unless a line sets capY.
// Pure functions of T, t, dur, beats. t can be negative before a scene starts — everything is clamped.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const FONT = "'Oswald', sans-serif";
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/* a small sun (good day) */
function Sun({ x, y, r = 34, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${T * 30})`}>
    {[...Array(8)].map((_, i) => <rect key={i} x={-6} y={-r - 22} width={12} height={18} fill={P.yel} stroke={P.blk} strokeWidth="3" transform={`rotate(${i * 45})`} />)}
    <circle r={r} fill={P.yel} stroke={P.blk} strokeWidth="5" /></g>);
}
/* one calendar day card; bad = black with a storm */
function Day({ x, y, i, k, bad, T }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${1.3 * BK(k)}) rotate(${(i % 2 ? 3 : -3)})`}>
    <rect x={-62 + 7} y={-80 + 7} width={124} height={160} fill={P.blk} />
    <rect x={-62} y={-80} width={124} height={160} fill={bad ? P.blk : P.cream} stroke={P.blk} strokeWidth="6" />
    <rect x={-62} y={-80} width={124} height={38} fill={bad ? P.redD : P.red} stroke={P.blk} strokeWidth="6" />
    <text y={-50} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="26" fill={P.cream}>{DAYS[i]}</text>
    {bad ? <g>{[0, 1, 2].map((j) => <RMBolt key={j} x={-30 + j * 30} y={-10} len={70} ang={Math.PI / 2 + (j - 1) * 0.3} seed={j + 9} T={T} w={4} />)}</g>
      : <Sun x={0} y={18} r={26} T={T + i} />}</g>);
}
/* bucket of ice water */
function Bucket({ x, y, T, s = 1, warm = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-230 -160 L230 -160 L190 200 L-190 200 Z" fill={P.blk} transform="translate(14 14)" />
    <path d="M-230 -160 L230 -160 L190 200 L-190 200 Z" fill={P.blue} stroke={P.blk} strokeWidth="9" />
    <ellipse cx={0} cy={-160} rx={230} ry={46} fill={warm > 0 ? P.pink : P.cyan} opacity={0.9} stroke={P.blk} strokeWidth="8" />
    {[...Array(5)].map((_, i) => <rect key={i} x={-160 + i * 70 + Math.sin(T * 2 + i) * 6} y={-185 + Math.sin(T * 3 + i * 2) * 5} width={46} height={40} fill={P.cream} stroke={P.blk} strokeWidth="4" transform={`rotate(${(i - 2) * 12} ${-137 + i * 70} -165)`} opacity={1 - warm * 0.6} />)}
    {[0, 1, 2].map((k) => <path key={k} d={`M-180 ${-60 + k * 70} Q0 ${-40 + k * 70} 180 ${-60 + k * 70}`} fill="none" stroke={P.blueD} strokeWidth="6" />)}
  </g>);
}
/* a pink forearm + hand going down into the water */
function Arm({ x, y, s = 1, dip = 0, shiver = 0, T = 0 }) {
  const sh = Math.sin(T * 40) * 6 * shiver;
  return (<g transform={`translate(${x + sh} ${y + dip * 140}) scale(${s})`}>
    <path d="M-60 -700 L60 -700 L58 -40 L-58 -40 Z" fill={P.blk} />
    <path d="M-62 -700 L62 -700 L62 -120 L-62 -120 Z" fill={P.pink} stroke={P.blk} strokeWidth="7" />
    {[-36, -12, 12, 36].map((fx, i) => <rect key={i} x={fx - 11} y={-130} width={22} height={95 + (i === 1 || i === 2 ? 15 : 0)} rx={11} fill={P.pink} stroke={P.blk} strokeWidth="5" />)}
    {[0, 1, 2].map((k) => <line key={k} x1={-40} y1={-500 + k * 28} x2={40} y2={-505 + k * 28} stroke={P.blk} strokeOpacity="0.5" strokeWidth="4" />)}
  </g>);
}

/* 1 — six sunny days pop… the seventh turns black: CANCELLED */
function PEHook({ T, t, beats }) {
  const c = bt(beats, 3), bad = t >= c, lt = t - c;
  const sh = bad ? Math.sin(lt * 55) * 10 * Math.exp(-lt * 3) : 0;
  return (<g><RMBg kind="red" />
    {DAYS.map((_, i) => { const row = i < 4 ? 0 : 1, col = i < 4 ? i : i - 4;
      const x = row ? 270 + col * 270 : 135 + col * 270, y = 250 + row * 260;
      return <Day key={i} x={x} y={y} i={i} T={T} bad={i === 6 && bad} k={i < 6 ? (t - 0.1 - i * 0.16) / 0.25 : (t - 1.0) / 0.25} />; })}
    <RMArthur x={540 + sh} y={1040} s={1.0} mouth={bad ? 'open' : 'smile'} brow={bad ? 'angry' : 'up'} lid={bad ? 0 : 0.15} wide={bad} look={bad ? [0.6, -1] : [0, -0.6]} stress={bad} />
    {bad && <g transform={`translate(810 450) rotate(-12) scale(${BK(lt / 0.3)})`}>
      <rect x={-250 + 10} y={-60 + 10} width={500} height={120} fill={P.blk} />
      <rect x={-250} y={-60} width={500} height={120} fill={P.cream} stroke={P.redD} strokeWidth="12" />
      <text y={30} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="96" letterSpacing="6" fill={P.redD}>CANCELLED</text></g>}</g>);
}

/* 2 — a night on the airport floor under the departures board */
function PEFloor({ T, t }) {
  const rows = ['LDN 21:40', 'PAR 22:15', 'HOME 22:50', 'ROM 23:05'];
  return (<g><RMBg kind="dark" />
    <g transform="translate(540 330)"><rect x={-430 + 12} y={-190 + 12} width={860} height={380} fill="#000" />
      <rect x={-430} y={-190} width={860} height={380} fill={P.blk} stroke={P.cream} strokeWidth="6" />
      <text x={-390} y={-125} fontFamily={FONT} fontWeight="700" fontSize="44" letterSpacing="4" fill={P.yel}>DEPARTURES</text>
      {rows.map((r, i) => { const blink = Math.floor(((T * 2) % 2 + 2) % 2) === 0;
        return (<g key={i}><text x={-390} y={-50 + i * 70} fontFamily={FONT} fontWeight="500" fontSize="42" fill={P.cream}>{r}</text>
          <text x={390} y={-50 + i * 70} textAnchor="end" fontFamily={FONT} fontWeight="700" fontSize="42" fill={P.red} opacity={i === 2 && !blink ? 0.3 : 1}>CANCELLED</text></g>); })}</g>
    <rect x="-300" y="1180" width="1680" height="900" fill={P.redD} />
    <RMGrid x={150} y={1010} w={780} h={250} step={40} />
    <RMArthur x={470} y={1080} s={0.62} rot={-1.5} body={false} brow="sad" lid={0.45} look={[0.4, -1]} stress />
    <g transform={`translate(860 880) scale(0.5)`}><RMAlarm x={0} y={0} T={T} ring={0} /></g>
    <RMChip x={540} y={700} text="8 HOURS LATER" col={P.cream} size={44} pop={(t - 0.6) / 0.25} /></g>);
}

/* 3 — Monday: Mae asks how the trip was */
function PEAsk({ T, t, beats }) {
  return (<g><RMBg kind="red" />
    <RMMae x={330} y={1060} s={0.82} mouth="smile" brow="up" lid={0.2} look={[0.8, 0]} />
    <RMArthur x={800} y={1180} s={0.72} mouth="flat" brow="sad" lid={0.55} look={[-0.8, 0.2]} />
    <RMSpeech x={560} y={420} text='"HOW WAS THE TRIP?"' size={72} col={P.yel} k={(t - bt(beats, 1, 0.4)) / 0.3} />
    <RMChip x={260} y={170} text="MONDAY" col={P.cream} size={46} pop={t / 0.2} /></g>);
}

/* 4 — "A total DISASTER." Arthur explodes */
function PEDisaster({ T, t }) {
  const sh = Math.sin(t * 60) * 9 * Math.exp(-Math.max(0, t) * 2);
  return (<g><RMBg kind="redDark" waves={false} />
    {[...Array(12)].map((_, i) => { const a = -Math.PI + i * Math.PI / 11; return <RMBolt key={i} x={540 + Math.cos(a) * 340} y={700 + Math.sin(a) * 300} len={150} ang={a} seed={i + 40} T={T} />; })}
    <RMArthur x={540 + sh} y={1000} s={1.05} mouth="shout" brow="angry" lid={0} wide stress />
    <RMSpeech x={560} y={330} text='"DISASTER!"' size={110} col={P.yel} k={(t - 0.15) / 0.3} rot={0.05} /></g>);
}

/* 5 — the turn: Mae's chart — six great days, one bad one */
function PEGreat({ T, t, beats }) {
  const g = EO((t - 0.15) / 1.0), e = bt(beats, 3, 1.2);
  return (<g><RMBg kind="blue" />
    <g transform="translate(540 760)"><rect x={-450 + 14} y={-420 + 14} width={900} height={760} fill={P.blk} />
      <rect x={-450} y={-420} width={900} height={760} fill={P.cream} stroke={P.blk} strokeWidth="9" />
      <text y={-345} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="46" letterSpacing="4" fill={P.blk}>ARTHUR'S WEEK</text>
      <line x1={-400} y1={250} x2={400} y2={250} stroke={P.blk} strokeWidth="8" />
      {DAYS.map((d, i) => { const bad = i === 6, h = (bad ? 90 : 360 + hsh(i + 3) * 120) * g, x = -345 + i * 115;
        return (<g key={i}><rect x={x - 42} y={250 - h} width={84} height={h} fill={bad ? P.blk : P.yel} stroke={P.blk} strokeWidth="6" />
          {!bad && g > 0.9 && <Sun x={x} y={250 - h - 50} r={20} T={T + i} />}
          <text x={x} y={300} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="30" fill={P.blk}>{d}</text></g>); })}
      {t > e && <g transform={`translate(-60 -260) scale(${BK((t - e) / 0.3)}) rotate(-6)`}><RMChip x={0} y={0} text="6 OF 7: GREAT" col={P.yel} size={52} /></g>}</g>
    <RMMae x={860} y={1330} s={0.55} mouth="smile" brow="up" lid={0.3} look={[-0.9, -0.6]} /></g>);
}

/* 6 — a film strip of the week: only the worst frame and the LAST frame stay lit, wired into his brain */
function PELast({ T, t, beats }) {
  const fade = SM(0.3, 1.2, t), e = bt(beats, 3, 1.6), last = SM(e, e + 0.3, t);
  return (<g><RMBg kind="red" waves={false} />
    <g transform={`translate(${lp(80, 0, EO(t / 1.2))} 0)`}>
      <rect x={-60} y={250} width={1200} height={300} fill={P.blk} />
      {[...Array(14)].map((_, i) => <g key={i}><rect x={-40 + i * 86} y={265} width={40} height={26} fill={P.cream} /><rect x={-40 + i * 86} y={510} width={40} height={26} fill={P.cream} /></g>)}
      {DAYS.map((d, i) => { const keep = i === 6, lit = keep ? 1 : 1 - fade * 0.8, x = 20 + i * 150;
        return (<g key={i} opacity={lit}><rect x={x} y={310} width={130} height={180} fill={keep ? P.redD : P.yel} stroke={keep ? P.cyan : P.blk} strokeWidth={keep ? 10 * (0.5 + 0.5 * last) : 4}
          style={keep && last > 0 ? { filter: 'drop-shadow(0 0 16px #8FEFFF)' } : null} />
          {keep ? <text x={x + 65} y={420} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="54" fill={P.cream}>FLOOR</text> : <Sun x={x + 65} y={400} r={30} T={T + i} />}</g>); })}</g>
    <RMBrain cx={540} cy={1080} w={560} h={420} seed={5} />
    {fade > 0.6 && [...Array(5)].map((_, i) => <RMBolt key={i} x={980 - i * 10} y={520} len={260 + i * 40} ang={Math.PI * 0.62 + i * 0.05} seed={i + 60} T={T} />)}
    <RMChip x={540} y={160} text="WHAT HIS BRAIN KEPT" col={P.cream} size={46} pop={(t - 0.3) / 0.25} /></g>);
}

/* 7 — name it: macro eye, a sun and a storm in the pupil, title */
function PEName({ T, t }) {
  return (<g><RMEyeMacro open={EO(t / 0.5)}>
      <Sun x={490} y={1000} r={40} T={T} /><g transform="translate(610 960)">{[0, 1].map((j) => <RMBolt key={j} x={j * 30 - 15} y={0} len={90} ang={Math.PI / 2} seed={j + 3} T={T} w={5} />)}</g></RMEyeMacro>
    <RMTitle lines={[['PEAK-END', P.cream, 170], ['RULE', P.yel, 170]]} y={230} a={EO((t - 0.4) / 0.4)} /></g>);
}

/* 8 — 1993: a hand goes into a bucket of ice water */
function PEStudy({ T, t }) {
  const dip = EO((t - 0.6) / 0.6);
  return (<g><RMBg kind="blue" />
    <Arm x={540} y={lp(560, 760, dip)} s={1} dip={0} shiver={dip} T={T} />
    <Bucket x={540} y={1050} T={T} s={1.1} />
    <RMChip x={540} y={190} text="KAHNEMAN ET AL · 1993" col={P.cream} size={48} pop={t / 0.25} />
    <RMChip x={830} y={760} text="14°C" col={P.cyan} size={56} pop={(t - 1.0) / 0.25} rot={0.05} /></g>);
}

/* 9 — two trials: 60 s cold vs 90 s, the last 30 a bit warmer */
function PETimers({ T, t, beats }) {
  const b2 = bt(beats, 2, 1.2), w = SM(bt(beats, 4, 2.2), bt(beats, 4, 2.2) + 0.4, t);
  const bar = (y, lab, secs, k, extra) => (<g>
    <RMChip x={200} y={y - 80} text={lab} col={P.cream} size={40} />
    <rect x={90 + 10} y={y - 40 + 10} width={secs * 9.4} height={90} fill={P.blk} opacity={k > 0 ? 1 : 0} />
    <rect x={90} y={y - 40} width={60 * 9.4 * cl(k)} height={90} fill={P.cyan} stroke={P.blk} strokeWidth="6" />
    {extra > 0 && <rect x={90 + 564} y={y - 40} width={282 * cl(extra)} height={90} fill={lp(0, 1, w) > 0.5 ? P.pink : P.cyan} stroke={P.blk} strokeWidth="6" />}
    <text x={90 + secs * 9.4 + 20} y={y + 22} fontFamily={FONT} fontWeight="700" fontSize="60" fill={P.cream} opacity={cl(k * 2)}>{secs}s</text></g>);
  return (<g><RMBg kind="redDark" />
    {bar(450, 'TRIAL A', 60, (t - 0.1) / 0.8, 0)}
    {bar(820, 'TRIAL B', 90, (t - b2) / 0.8, (t - b2 - 0.8) / 0.5)}
    <Bucket x={300} y={1180} T={T} s={0.45} /><Bucket x={780} y={1180} T={T} s={0.45} warm={w} />
    {w > 0 && <RMChip x={780} y={960} text="A BIT WARMER" col={P.pink} size={40} pop={w} rot={0.04} />}</g>);
}

/* 10 — the vote: 7 of 10 heads pick the LONGER trial */
function PEVote({ T, t, beats }) {
  const e = bt(beats, 2, 1);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={200} text="WHICH ONE AGAIN?" col={P.cream} size={50} pop={t / 0.25} />
    {[...Array(10)].map((_, i) => { const x = 160 + (i % 5) * 190, y = 520 + Math.floor(i / 5) * 280, pick = i !== 2 && i !== 6 && i !== 9;
      const on = pick && t > e + i * 0.06;
      return (<g key={i}><RMBadge x={x} y={y + Math.sin(T * 3 + i) * 6} r={78} k={(t - 0.15 - i * 0.05) / 0.25} col={on ? P.yel : P.cream} />
        {on && <RMChip x={x} y={y + 115} text="90s" col={P.yel} size={30} pop={(t - e - i * 0.06) / 0.2} />}</g>); })}
    <g transform={`translate(540 1180) scale(${BK((t - e - 0.6) / 0.3)}) translate(-540 0)`}><RMTitle lines={[['7 IN 10', P.yel, 150]]} y={-30} a={1} /></g></g>);
}

/* 11 — Mae's tip: end on a high */
function PETip({ T, t, beats }) {
  const items = ['DATE', 'WORKOUT', 'MEETING'], e = bt(beats, beats.length - 1, 2);
  return (<g><RMBg kind="redDark" />
    {items.map((w, i) => <RMChip key={w} x={230 + i * 310} y={300 + (i % 2) * 60} text={w} col={P.cream} size={46} pop={(t - bt(beats, 1, 0.5) - i * 0.25) / 0.25} rot={(i - 1) * 0.04} />)}
    {t > e && <g transform={`translate(540 560) scale(${BK((t - e) / 0.35)})`}><Sun x={0} y={0} r={90} T={T} /></g>}
    <RMMae x={540} y={1120} s={0.95} mouth="smile" brow="up" lid={0.25} look={[0, -0.8]} />
    <g transform={`translate(890 1290) rotate(${Math.sin(T * 2) * 4})`}><RMArthur x={0} y={0} s={0.38} mouth="smile" brow="up" lid={0.2} look={[-1, -0.5]} /></g></g>);
}

Object.assign(window, { PEHook, PEFloor, PEAsk, PEDisaster, PEGreat, PELast, PEName, PEStudy, PETimers, PEVote, PETip });
})();
