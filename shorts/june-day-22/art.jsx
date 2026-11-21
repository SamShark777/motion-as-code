// art.jsx — "5 Signs Your New Habit Is Actually Working" (June ep. 9, with Theo; ted-MG motion graphics, signs-list).
// Habit formation: Lally, van Jaarsveld, Potts & Wardle 2010 (EJSP) — 96 volunteers, peak automaticity took 66 days on
// average (18 to a predicted 254), a single missed day had little effect. The "21 days" idea traces to a 1960 self-help book
// by a plastic surgeon (no likeness drawn). Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces and labels
// stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const PAPER = '#fbf7ee', GOOD = '#5fbf7a', JTOP = '#5bb3b0', JSKIN = '#f2dccb';

function Shoe({ x, y, s = 1, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-120 20 Q-120 -50 -60 -60 L0 -60 Q40 -20 110 -10 Q140 0 140 30 L140 40 L-120 40 Z" fill={R} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <rect x="-124" y="34" width="268" height="26" rx="12" fill="#fff" stroke={K} strokeWidth="7" />
    {[0, 1, 2].map((i) => <line key={i} x1={-30 + i * 24} y1={-52 + i * 10} x2={-6 + i * 24} y2={-40 + i * 10} stroke="#fff" strokeWidth="6" strokeLinecap="round" />)}</g>);
}
/* month grid: n days, marks = per-day 'x' | 'v' | '' ; hot = index ringed */
function Cal({ x, y, s = 1, n = 28, marks = () => '', head = 'NOVEMBER', show = 99 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-330" y="-300" width="660" height="600" rx="22" fill={PAPER} stroke={K} strokeWidth="9" />
    <rect x="-330" y="-300" width="660" height="100" rx="22" fill={R} stroke={K} strokeWidth="9" />
    <text x="0" y="-228" textAnchor="middle" fontFamily={BB} fontSize="70" letterSpacing="6" fill="#fff">{head}</text>
    {[...Array(n)].map((_, i) => { const cx = -270 + (i % 7) * 90, cy = -140 + Math.floor(i / 7) * 100, m = i < show ? marks(i) : '';
      return (<g key={i}><text x={cx} y={cy + 14} textAnchor="middle" fontFamily={OS} fontWeight="500" fontSize="30" fill="#9a9384">{i + 1}</text>
        {m === 'v' && <path d={`M${cx - 24} ${cy} L${cx - 6} ${cy + 22} L${cx + 26} ${cy - 22}`} stroke={GOOD} strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        {m === 'x' && <path d={`M${cx - 22} ${cy - 22} L${cx + 22} ${cy + 22} M${cx + 22} ${cy - 22} L${cx - 22} ${cy + 22}`} stroke={R} strokeWidth="11" strokeLinecap="round" />}</g>); })}
  </g>);
}
function BigNo({ n, t }) {
  return (<g transform={`translate(170 260) scale(${BK(t / 0.3)})`}><circle r="110" fill={A} stroke={K} strokeWidth="9" />
    <text x="0" y="52" textAnchor="middle" fontFamily={BB} fontSize="170" fill={K}>{n}</text></g>);
}

/* 1 — June on day 22, laced up, glaring at the calendar */
function MGDay22({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9), c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="room" />
    <Cal x={720} y={560} s={0.72} marks={(i) => (i < 22 ? 'v' : '')} show={22} />
    {t > c2 && <MGRing cx={526} cy={675} rx={50} ry={46} p={(t - c2) / 0.4} />}
    <MGBust x={290} y={930} r={150} who="june" look={[0.9, -0.5]} brow={t > c3 ? 'angry' : 'flat'} mouth={t > c3 ? 'frown' : 'flat'} sweat={(T * 0.6) % 1} bl={BL(T)} />
    <Shoe x={800} y={1180} s={0.9} rot={-6} />
    {t > c3 && <MGBubble x={360} y={640} text="SHOULD BE|AUTOMATIC" k={(t - c3) / 0.3} size={44} />}
    <MGChip x={540} y={150} text="DAY 22 · 6:30 AM" size={42} pop={t / 0.25} /></g>);
}

/* 2 — shock: an old 1960 paperback; the "21 DAYS" stamp; NOT A STUDY */
function MGOldBook({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c3 = b(beats, 3, 1.6);
  const k = EO(t / 0.45);
  return (<g><MGBg kind="wall" c1="#5a4632" c2="#2e2419" />
    <g transform={`translate(540 ${lp(1300, 760, k)}) rotate(-5)`}>
      <rect x="-260" y="-360" width="520" height="720" rx="10" fill="#d9c49a" stroke={K} strokeWidth="9" />
      <rect x="-260" y="-360" width="56" height="720" fill="#b59a6a" stroke={K} strokeWidth="6" />
      <rect x="-180" y="-280" width="380" height="140" fill="#2e4b8f" stroke={K} strokeWidth="6" />
      <text x="10" y="-188" textAnchor="middle" fontFamily={BB} fontSize="70" letterSpacing="4" fill="#fff">SELF-HELP</text>
      <text x="10" y="-60" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="42" fill={K}>BY A PLASTIC</text>
      <text x="10" y="-10" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="42" fill={K}>SURGEON</text>
      <text x="10" y="300" textAnchor="middle" fontFamily={BB} fontSize="80" letterSpacing="6" fill="#6e5a3a">1960</text>
      {t > 0.3 && <g transform={`translate(10 140) rotate(8) scale(${BK((t - 0.3) / 0.3)})`}><circle r="95" fill={A} stroke={K} strokeWidth="7" />
        <text x="0" y="0" textAnchor="middle" fontFamily={BB} fontSize="80" fill={K}>21</text><text x="0" y="50" textAnchor="middle" fontFamily={BB} fontSize="40" fill={K}>DAYS</text></g>}
    </g>
    {t > c3 && <g transform={`translate(540 1180) rotate(-8) scale(${lp(1.6, 1, EO((t - c3) / 0.22))})`} opacity={cl((t - c3) * 6)}>
      <rect x="-280" y="-70" width="560" height="140" rx="12" fill="none" stroke={R} strokeWidth="12" />
      <text x="0" y="40" textAnchor="middle" fontFamily={BB} fontSize="110" letterSpacing="8" fill={R}>NOT A STUDY</text></g>}
    <MGChip x={540} y={150} text={t > c1 ? 'WHERE "21 DAYS" CAME FROM' : 'THE 21-DAY RULE'} size={38} pop={t / 0.25} /></g>);
}

/* 3 — snapback: the real curve rises slowly and flattens; 21 crossed out, 66 ringed */
function MGHabitCurve({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c2 = b(beats, 2, 1.3);
  const X0 = 160, Y0 = 1180, Wd = 780, Ht = 560, mx = 120;
  const px = (d) => X0 + (d / mx) * Wd, py = (v) => Y0 - v * Ht;
  const p = EO(t / 1.4) * mx;
  const curve = [...Array(61)].map((_, i) => { const d = (i / 60) * p; return [px(d), py(1 - Math.exp(-d / 24))]; });
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={170} text="STUDY · 2010 · 96 VOLUNTEERS" size={36} pop={t / 0.25} />
    <path d={`M${X0} ${Y0 - Ht - 20} V${Y0} H${X0 + Wd + 20}`} stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />
    <text x={X0 - 20} y={Y0 - Ht + 20} textAnchor="end" fontFamily={OS} fontWeight="700" fontSize="28" fill="#fff" opacity="0.7" transform={`rotate(-90 ${X0 - 40} ${Y0 - Ht / 2})`}>AUTOMATIC</text>
    <text x={X0 + Wd} y={Y0 + 60} textAnchor="end" fontFamily={OS} fontWeight="700" fontSize="30" fill="#fff" opacity="0.7">DAYS →</text>
    <path d={'M' + curve.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L')} stroke={A} strokeWidth="14" fill="none" strokeLinecap="round" />
    <g opacity={SM(0.3, 0.6, t)}><line x1={px(21)} y1={Y0} x2={px(21)} y2={Y0 - Ht} stroke="#8a8fa0" strokeWidth="6" strokeDasharray="16 12" />
      <text x={px(21)} y={Y0 + 60} textAnchor="middle" fontFamily={BB} fontSize="64" fill="#8a8fa0">21</text>
      {t > c1 && <path d={`M${px(21) - 34} ${Y0 + 10} L${px(21) + 34} ${Y0 + 70}`} stroke={R} strokeWidth="10" strokeLinecap="round" />}</g>
    {t > c1 && <g><line x1={px(66)} y1={Y0} x2={px(66)} y2={Y0 - Ht} stroke={A} strokeWidth="6" strokeDasharray="16 12" />
      <text x={px(66)} y={Y0 + 70} textAnchor="middle" fontFamily={BB} fontSize="84" fill={A}>66</text>
      <MGRing cx={px(66)} cy={Y0 + 44} rx={80} ry={62} p={(t - c1) / 0.4} /></g>}
    {t > c2 && <MGChip x={px(86)} y={py(1.1)} text="SOME: WAY LONGER →" size={30} col="#fff" pop={(t - c2) / 0.25} />}</g>);
}

/* 4 — sign 1: still feels like work — June mid-run, sweating */
function MGSignWork({ T, t, beats }) {
  const bob = Math.abs(osc(T, 0.5)) * 18;
  return (<g><MGBg kind="street" />
    <BigNo n="1" t={t} />
    <MGPerson x={560} y={1290 - bob} s={3.2} who="june" walk={T * 9} look={[1, 0]} brow="worried" mouth="o" sweat={(T * 0.8) % 1} bl={BL(T)} />
    {t > b(beats, 2, 1) && <MGChip x={760} y={520} text="STILL HARD = NORMAL" size={38} pop={(t - b(beats, 2, 1)) / 0.25} />}</g>);
}
/* 5 — sign 2: one red X in a row of ticks; the ticks carry on */
function MGSignMissed({ T, t, beats }) {
  const show = Math.floor(lp(8, 22, SM(0, 2.2, t)));
  return (<g><MGBg kind="wall" c1="#2f3d5c" c2="#1a2238" />
    <BigNo n="2" t={t} />
    <Cal x={540} y={800} s={1.1} marks={(i) => (i === 10 ? 'x' : 'v')} show={show} />
    {show > 10 && <MGRing cx={540 + (-270 + 3 * 90) * 1.1} cy={800 + (-140 + 100) * 1.1} rx={70} ry={64} p={(t - 0.6) / 0.4} />}
    {t > b(beats, 2, 1.2) && <MGChip x={540} y={1250} text="1 MISSED DAY: LITTLE EFFECT" size={34} col={GOOD} txt="#fff" pop={(t - b(beats, 2, 1.2)) / 0.25} />}</g>);
}
/* 6 — sign 3: the phone alarm RUN · 6:30 */
function MGSignReminder({ T, t, beats }) {
  return (<g><MGBg kind="roomNight" />
    <BigNo n="3" t={t} />
    <g transform={`rotate(${t < 1.6 ? osc(T, 0.12) * 3 : 0} 600 820)`}><MGPhone x={600} y={820} rot={-4} time="6:30" day="MONDAY" from="⏰ REMINDER" msg="RUN. YES, TODAY." k={(t - 0.3) / 0.4} /></g>
    <MGArm x1={-100} y1={1650} x2={lp(260, 380, SM(1, 1.6, t))} y2={1180} sleeve={JTOP} skin={JSKIN} w={90} /></g>);
}
/* 7 — sign 4: a backpack of rocks gets lighter — WEEK 1 vs NOW on a scale */
function MGSignEasier({ T, t, beats }) {
  const k = SM(0.4, b(beats, 2, 1.2) + 0.3, t);
  const tilt = lp(0, 10, k);
  const pan = (x, lab, rocks, dy) => (<g transform={`translate(${x} ${dy})`}>
    <line x1="0" y1="-170" x2="-110" y2="0" stroke={K} strokeWidth="5" /><line x1="0" y1="-170" x2="110" y2="0" stroke={K} strokeWidth="5" />
    <path d="M-150 0 H150 Q130 60 0 60 Q-130 60 -150 0 Z" fill="#cfd6dc" stroke={K} strokeWidth="7" />
    {[...Array(rocks)].map((_, i) => <ellipse key={i} cx={-80 + (i % 4) * 54} cy={-26 - Math.floor(i / 4) * 40} rx="34" ry="26" fill="#8a8fa0" stroke={K} strokeWidth="6" />)}
    <text x="0" y="130" textAnchor="middle" fontFamily={BB} fontSize="64" letterSpacing="4" fill="#fff">{lab}</text></g>);
  return (<g><MGBg kind="navy" />
    <BigNo n="4" t={t} />
    <rect x="525" y="560" width="30" height="620" fill="#b98e62" stroke={K} strokeWidth="7" /><path d="M420 1200 H660 L620 1160 H460 Z" fill="#b98e62" stroke={K} strokeWidth="7" />
    <g transform={`rotate(${-tilt} 540 580)`}><rect x="230" y="565" width="620" height="30" rx="12" fill="#b98e62" stroke={K} strokeWidth="7" /></g>
    {pan(260, 'WEEK 1', 8, 760 + tilt * 5.3)}{pan(820, 'NOW', 3, 760 - tilt * 5.3)}</g>);
}
/* 8 — sign 5: you, watching this — a phone playing "5 SIGNS" with a check */
function MGSignWatching({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="roomNight" />
    <BigNo n="5" t={t} />
    <g transform="translate(560 820) rotate(4)">
      <rect x="-250" y="-460" width="500" height="920" rx="60" fill="#18161d" stroke={K} strokeWidth="10" />
      <rect x="-222" y="-420" width="444" height="840" rx="40" fill="#2a1c45" />
      <text x="0" y="-250" textAnchor="middle" fontFamily={BB} fontSize="110" fill="#fff">5 SIGNS</text>
      <text x="0" y="-160" textAnchor="middle" fontFamily={BB} fontSize="70" fill={A}>IT'S WORKING</text>
      <MGHead x={0} y={60} r={110} who="june" look={[0, 0]} brow="up" mouth="smile" bl={BL(T)} />
      <rect x="-180" y="300" width="360" height="12" rx="6" fill="#4a3f63" /><rect x="-180" y="300" width={360 * cl(t / 4)} height="12" rx="6" fill={R} />
    </g>
    {t > c3 && <g transform={`translate(830 470) scale(${BK((t - c3) / 0.3)})`}><circle r="70" fill={GOOD} stroke={K} strokeWidth="7" />
      <path d="M-32 2 L-8 28 L34 -24" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
    {t > c3 && <MGChip x={560} y={1330} text="NOT QUITTING" col={GOOD} txt="#fff" size={40} pop={(t - c3) / 0.25} />}</g>);
}
/* 9 — payoff: Theo by the door, June lacing up and heading out */
function MGTheoRule({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0), c4 = b(beats, 4, 2.0);
  const go = SM(c4, c4 + 1.2, t);
  return (<g><MGBg kind="street" />
    <MGPerson x={250} y={1280} s={3} who="theo" look={[1, -0.2]} brow="up" mouth="smile" bl={BL(T, 0.4)} />
    <MGPerson x={lp(740, 1000, go)} y={1280} s={3} who="june" walk={go > 0 ? T * 9 : 0} look={[t > c4 ? 1 : -1, -0.2]} brow="up" mouth={t > c2 ? 'grin' : 'o'} bl={BL(T)} />
    <MGBubble x={300} y={560} text={t > c2 ? "THE RULE|WAS WRONG." : "YOU'RE NOT|LATE."} k={(t - 0.15) / 0.3} size={46} />
    <MGChip x={540} y={150} text="DAY 23 · 6:30 AM" size={40} pop={t / 0.25} /></g>);
}
/* 10 — end: the calendar keeps going past 22; count your checks */
function MGEndHabit({ T, t, beats }) {
  const show = Math.floor(lp(22, 28, SM(0, 2, t)));
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <Cal x={540} y={700} s={0.95} marks={(i) => (i === 10 ? 'x' : 'v')} show={show} />
    <MGBust x={540} y={1180} r={100} who="june" look={[0, -0.8]} brow="up" mouth="grin" bl={BL(T)} />
    <MGChip x={540} y={170} text="HOW MANY DID YOU CHECK?" size={40} pop={t / 0.25} /></g>);
}

Object.assign(window, { MGDay22, MGOldBook, MGHabitCurve, MGSignWork, MGSignMissed, MGSignReminder, MGSignEasier, MGSignWatching, MGTheoRule, MGEndHabit });
})();
