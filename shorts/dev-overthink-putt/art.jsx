// art.jsx — "Why Overthinking Makes You Miss" (Dev ep. 5, with Theo; ted-MG motion graphics). Choking / explicit
// monitoring: Beilock, Carr, MacMahon & Starkes 2002 (J Exp Psych: Applied) — experienced golfers putted more accurately
// with a distracting second task than when attending to each step; novices the opposite. No numbers on screen (none verified).
// Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — keep faces and labels out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const DEV = '#3f7fbf', DEV_SKIN = '#c99b74', THEO = '#4f9d78';
const GREEN = '#3f9a5c', GREEN2 = '#2f7f49';

// a mini-golf green seen at an angle: carpet band with a brick border, hole + flag at (hx, hy)
function Green({ y0 = 1080, hx = 820, hy = 1250, flag = true, T = 0 }) {
  return (<g>
    <rect x="-300" y={y0} width="1680" height="1200" fill={GREEN2} />
    <path d={`M-300 ${y0 + 40} L1380 ${y0 + 40} L1380 1920 L-300 1920 Z`} fill={GREEN} stroke={K} strokeWidth="8" />
    <rect x="-300" y={y0} width="1680" height="44" fill="#c46a3f" stroke={K} strokeWidth="8" />
    {[...Array(12)].map((_, i) => <line key={i} x1={-100 + i * 110} y1={y0 + 44} x2={-100 + i * 110} y2={y0 + 44 + 12} stroke={K} strokeWidth="5" />)}
    <ellipse cx={hx} cy={hy} rx="62" ry="22" fill="#14211a" stroke={K} strokeWidth="6" />
    {flag && <g><line x1={hx} y1={hy} x2={hx} y2={hy - 330} stroke={K} strokeWidth="10" />
      <path d={`M${hx} ${hy - 330} L${hx + 130 + Math.sin(T * 5) * 8} ${hy - 290} L${hx} ${hy - 250} Z`} fill={R} stroke={K} strokeWidth="6" strokeLinejoin="round" /></g>}
  </g>);
}
function Ball({ x, y, r = 20 }) { return <circle cx={x} cy={y} r={r} fill="#fff" stroke={K} strokeWidth="5" />; }
// putter: grip at (x1,y1), head at (x2,y2)
function Putter({ x1, y1, x2, y2 }) {
  return (<g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={K} strokeWidth="16" strokeLinecap="round" /><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b9c2c9" strokeWidth="8" strokeLinecap="round" />
    <rect x={x2 - 46} y={y2 - 16} width="92" height="32" rx="10" fill="#4a4f58" stroke={K} strokeWidth="6" /></g>);
}
// golfer at (x, feet y) leaning over a ball to the right, putter swinging by angle sw (radians)
function Golfer({ x, y, s = 2, who = 'dev', sw = 0, T, ...f }) {
  const hx = x + 50 * s, hy = y - 95 * s, L = 120 * s;
  return (<g><Putter x1={hx} y1={hy} x2={hx + Math.sin(0.35 + sw) * L} y2={hy + Math.cos(0.35 + sw) * L} />
    <MGPerson x={x} y={y} s={s} who={who} bl={BL(T)} {...f} /></g>);
}
// music note
function Note({ x, y, s = 1, a = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}><ellipse cx="0" cy="40" rx="26" ry="20" fill={A} stroke={K} strokeWidth="5" transform="rotate(-20 0 40)" />
    <line x1="22" y1="34" x2="22" y2="-60" stroke={K} strokeWidth="8" /><path d="M22 -60 Q60 -40 50 0" fill="none" stroke={K} strokeWidth="8" /></g>);
}
// little checklist card; ticks: number of green ticks shown
function Checklist({ x, y, items, ticks = 0, k = 1, rot = 0 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k)})`}>
    <rect x="-210" y="-40" width="420" height={items.length * 72 + 60} rx="22" fill="#f4efe4" stroke={K} strokeWidth="7" />
    {items.map((it, i) => <g key={it}><rect x="-180" y={-10 + i * 72} width="40" height="40" rx="8" fill="#fff" stroke={K} strokeWidth="5" />
      {i < ticks && <path d={`M-174 ${12 + i * 72} L-160 ${26 + i * 72} L-140 ${-4 + i * 72}`} fill="none" stroke="#2f9a5a" strokeWidth="9" strokeLinecap="round" />}
      <text x="-120" y={22 + i * 72} fontFamily={OS} fontWeight="700" fontSize="38" fill="#1a1720">{it}</text></g>)}</g>);
}

/* 1 — last hole: Dev stands over a short putt; thought bubbles pile up: GRIP? ELBOWS? BREATHE? */
function MGPuttHook({ T, t, beats }) {
  const c = b(beats, 2, 1.2), bub = [['GRIP?', 200, 520], ['ELBOWS?', 540, 440], ['BREATHE?', 840, 540]];
  return (<g><MGBg kind="wall" c1="#bfe0f2" c2="#f6d8a8" />
    <Green T={T} y0={1150} hx={860} hy={1330} />
    <Ball x={700} y={1350} r={24} />
    <Golfer x={330} y={1380} s={3.0} who="dev" sw={Math.sin(T * 1.5) * 0.04} T={T} mouth={t > c ? 'wave' : 'flat'} brow={t > c ? 'worried' : 'flat'} look={[0.6, 0.6]} />
    {bub.map(([w, x, y], i) => t > c + i * 0.25 && <MGBubble key={w} x={x} y={y + 90} text={w} size={44} k={(t - c - i * 0.25) / 0.3} />)}
    <MGChip x={540} y={240} text="LAST HOLE · 2 FEET" outline size={44} pop={t / 0.25} /></g>);
}

/* 2 — "you": close-up of Dev, sweating, thoughts circling; an inset shows the ball lipping out */
function MGThinkWorse({ T, t, beats }) {
  const c = b(beats, 2, 1.4), roll = EO((t - 0.2) / 1.2);
  return (<g><MGBg kind="wall" c1="#4a3a66" c2="#261c3a" />
    {['GRIP', 'STANCE', 'ANGLE', 'SPEED', 'BREATHE'].map((w, i) => { const an = T * 0.9 + i * Math.PI * 2 / 5;
      return <text key={w} x={540 + Math.cos(an) * 360} y={760 + Math.sin(an) * 150} textAnchor="middle" fontFamily={BB} fontSize="64" letterSpacing="4" fill="#fff" opacity={0.35 + 0.35 * (Math.sin(an) + 1) / 2}>{w}</text>; })}
    <MGBust x={540} y={760} r={190} who="dev" mouth="wave" brow="worried" look={[0, -0.6]} sweat={T * 0.8} bl={BL(T)} />
    <g transform="translate(230 330)"><circle r="130" fill={GREEN} stroke={K} strokeWidth="8" /><ellipse cx="0" cy="10" rx="44" ry="16" fill="#14211a" />
      <Ball x={lp(-130, 70, roll)} y={lp(60, -30, roll) + Math.sin(roll * 9) * 8 * (1 - roll)} r={16} /></g>
    {t > c && <MGChip x={790} y={330} text="WORSE" col={R} txt="#fff" size={64} pop={(t - c) / 0.25} />}</g>);
}

/* 3 — snapback: spotlight; NERVES gets crossed out; a magnifier hovers over Dev's hands on the putter */
function MGSnapAttention({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5), c2 = b(beats, 2, 1.0), x = SM(c1, c1 + 0.3, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={720} a={0.55 * SM(0, 0.3, t)} />
    <MGHead x={540} y={760} r={120} who="dev" mouth="flat" brow="worried" look={[0.3, 1]} bl={BL(T)} />
    <Putter x1={520} y1={900} x2={600} y2={1200} />
    <Ball x={700} y={1215} r={22} />
    {t > c2 && <g transform={`translate(${620 + Math.sin(T * 2) * 12} 1190) scale(${BK((t - c2) / 0.3)})`}>
      <circle r="150" fill="rgba(200,240,255,0.25)" stroke={K} strokeWidth="18" /><circle r="150" fill="none" stroke={A} strokeWidth="8" />
      <line x1="110" y1="-110" x2="240" y2="-240" stroke={K} strokeWidth="40" strokeLinecap="round" /><line x1="110" y1="-110" x2="240" y2="-240" stroke={A} strokeWidth="22" strokeLinecap="round" /></g>}
    <g opacity={SM(0, 0.25, t)}><text x={540} y={420} textAnchor="middle" fontFamily={BB} fontSize="150" letterSpacing="8" fill="#fff">NERVES</text>
      <line x1={330} y1={380} x2={330 + 420 * x} y2={380} stroke={R} strokeWidth="22" strokeLinecap="round" /></g>
    {t > c2 && <MGChip x={540} y={560} text="ATTENTION" size={60} pop={(t - c2) / 0.25} />}</g>);
}

/* 4 — the study: two lanes, two ways to putt. Chip with the journal + year */
function MGGolfLab({ T, t, beats }) {
  const c = b(beats, 3, 1.6);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={240} text="J. EXP. PSYCHOLOGY · 2002" outline size={40} pop={t / 0.25} />
    {[0, 1].map((i) => { const y = 760 + i * 520, k = EO((t - c - i * 0.25) / 0.4);
      return (<g key={i}><rect x="80" y={y - 180} width="920" height="300" rx="30" fill={GREEN} stroke={K} strokeWidth="8" />
        <ellipse cx="860" cy={y + 20} rx="46" ry="16" fill="#14211a" />
        <Golfer x={230} y={y + 70} s={1.4} who={MG.extra(i + 3)} T={T} mouth="flat" look={[1, 0.5]} />
        <Ball x={360} y={y + 60} r={14} />
        {k > 0 && <MGChip x={600} y={y - 110} text={i ? '+ A SECOND TASK' : 'FOCUS ON EACH STEP'} size={40} col={i ? '#7fd6ff' : A} pop={k} />}</g>); })}
    <MGChip x={540} y={420} text="SKILLED GOLFERS" size={48} pop={(t - b(beats, 2, 1)) / 0.25} /></g>);
}

/* 5 — step-focus lane: a checklist ticks; the ball slides past the hole; red ring on the miss */
function MGStepFocus({ T, t, beats }) {
  const c = b(beats, 3, 1.4), roll = EO((t - 0.9) / 1.0);
  return (<g><MGBg kind="wall" c1="#e8d9b8" c2="#b9a27c" />
    <Green y0={980} hx={820} hy={1180} flag={false} T={T} />
    <Checklist x={330} y={420} items={['HANDS', 'ANGLE', 'FOLLOW-THROUGH']} ticks={Math.floor(cl(t / 0.9) * 3.99)} k={t / 0.3} rot={-3} />
    <Golfer x={230} y={1300} s={2.0} who={MG.extra(3)} sw={-0.3 * SM(0.6, 0.9, t)} T={T} mouth="wave" brow="worried" look={[0.8, 0.4]} />
    <Ball x={lp(420, 960, roll)} y={lp(1270, 1110, roll)} />
    <MGRing cx={880} cy={1150} rx={120} ry={70} p={(t - c + 0.3) / 0.4} />
    {t > c && <MGChip x={760} y={820} text="LESS ACCURATE" col={R} txt="#fff" size={50} pop={(t - c) / 0.25} />}</g>);
}

/* 6 — distracted lane: BEEP chips flash, the golfer counts; the ball drops in */
function MGDistracted({ T, t, beats }) {
  const c = b(beats, 2, 1.3), roll = EO((t - 0.5) / 0.9), inHole = roll > 0.98;
  return (<g><MGBg kind="wall" c1="#cfe3dc" c2="#94b9b0" />
    <Green y0={980} hx={820} hy={1180} flag={false} T={T} />
    {[0, 1, 2].map((i) => { const ph = (T * 1.2 + i / 3) % 1; return <MGChip key={i} x={240 + i * 300} y={520 + (i % 2) * 90} text="BEEP" col="#7fd6ff" size={48} pop={1} a={1 - ph} />; })}
    <Golfer x={230} y={1300} s={2.0} who={MG.extra(4)} sw={-0.15 * SM(0.2, 0.5, t)} T={T} mouth="smile" look={[0, -0.8]} />
    {!inHole && <Ball x={lp(420, 820, roll)} y={lp(1270, 1180, roll)} />}
    {inHole && <MGGlow x={820} y={1170} r={160} col="#ffd36e" a={0.8} />}
    {t > c && <MGChip x={760} y={820} text="MORE ACCURATE" size={50} pop={(t - c) / 0.25} />}</g>);
}

/* 7 — name it: spotlight, big title, Dev's head peeking with a thought loop */
function MGNameChoke({ T, t }) {
  const a = SM(0, 0.3, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={680} a={0.55 * a} />
    <MGTitle lines={[['CHOKING', A, 190], ['UNDER PRESSURE', '#fff', 90]]} y={330} a={EO((t - 0.2) / 0.35)} />
    <MGHead x={540} y={1050} r={150} who="dev" mouth="wave" brow="worried" look={[0, -0.5]} sweat={T} bl={BL(T)} />
    {[0, 1, 2].map((i) => { const an = T * 2 + i * 2.1; return <circle key={i} cx={540 + Math.cos(an) * 220} cy={830 + Math.sin(an) * 60} r="16" fill={A} opacity="0.8" />; })}</g>);
}

/* 8 — beginners: a newbie with the same checklist gets green ticks and the ball goes in */
function MGBeginners({ T, t, beats }) {
  const c = b(beats, 3, 1.6), roll = EO((t - c + 0.2) / 0.9), inHole = roll > 0.98;
  return (<g><MGBg kind="wall" c1="#f3e2c0" c2="#d9b98a" />
    <Green y0={980} hx={820} hy={1180} flag T={T} />
    <Checklist x={720} y={460} items={['HANDS', 'ANGLE', 'FOLLOW-THROUGH']} ticks={Math.floor(cl(t / 1.4) * 3.99)} k={t / 0.3} rot={3} />
    <Golfer x={230} y={1300} s={2.0} who={MG.extra(6)} sw={-0.2 * SM(c - 0.6, c - 0.2, t)} T={T} mouth={inHole ? 'grin' : 'flat'} brow={inHole ? 'up' : 'flat'} look={[0.8, 0.4]} />
    {!inHole && <Ball x={lp(420, 820, roll)} y={lp(1270, 1180, roll)} />}
    {inHole && <MGGlow x={820} y={1170} r={160} col="#ffd36e" a={0.8} />}
    <MGChip x={540} y={240} text="BEGINNERS" outline size={48} pop={t / 0.25} /></g>);
}

/* 9 — self-proof: Dev walks to the ball like a robot while Theo watches; "WALK NORMAL" */
function MGWalkNormal({ T, t, beats }) {
  const x = lp(380, 760, cl(t / 3)), stiff = Math.sign(Math.sin(T * 6)) * 0.6;
  return (<g><MGBg kind="wall" c1="#bfe0f2" c2="#f6d8a8" />
    <Green T={T} hx={920} hy={1250} />
    <MGPerson x={x} y={1290} s={2.3} who="dev" walk={stiff} mouth="wave" brow="worried" look={[1, 0]} bl={BL(T)} sweat={T} />
    <MGPerson x={140} y={1260} s={2.1} who="theo" mouth="smile" brow="up" look={[1, 0]} bl={BL(T, 1)} />
    <MGChip x={x} y={560} text="WALK. NORMAL." size={50} pop={t / 0.25} />
    <MGArrows x={x} y={900} t={t - 0.6} n={4} from={520} to={240} /></g>);
}

/* 10 — payoff: Theo hums, notes float; Dev relaxes and the ball drops in */
function MGTheoHum({ T, t, beats }) {
  const c = b(beats, 2, 1.5), roll = EO((t - c + 0.4) / 0.8), inHole = roll > 0.98;
  return (<g><MGBg kind="wall" c1="#bfe0f2" c2="#f6d8a8" />
    <Green T={T} hx={760} hy={1250} />
    {[0, 1, 2, 3].map((i) => { const ph = (T * 0.5 + i / 4) % 1; return <Note key={i} x={900 - ph * 260 + Math.sin(T * 3 + i) * 30} y={1000 - ph * 450} s={0.9} a={Math.sin(ph * Math.PI)} />; })}
    <MGPerson x={975} y={1250} s={2.1} who="theo" mouth="o" brow="up" look={[-1, -0.3]} bl={BL(T, 1)} />
    <Golfer x={300} y={1300} s={2.3} who="dev" sw={-0.25 * SM(c - 0.6, c - 0.4, t)} T={T} mouth={inHole ? 'grin' : 'smile'} brow={inHole ? 'up' : 'flat'} look={[0.6, 0.5]} />
    {!inHole && <Ball x={lp(560, 760, roll)} y={lp(1270, 1250, roll)} />}
    {inHole && <g><MGGlow x={760} y={1240} r={180} col="#ffd36e" a={0.9} /><MGChip x={760} y={760} text="IN!" size={80} pop={(t - c - 0.4) / 0.25} /></g>}</g>);
}

/* 11 — end: Dev and Theo high-five on the green; flag waving */
function MGEndWatch({ T, t, beats }) {
  const c = b(beats, 3, 1.6), hi = EO(t / 0.5);
  return (<g><MGBg kind="wall" c1="#f6d8a8" c2="#e08a5a" />
    <Green T={T} hx={900} hy={1240} />
    <MGGlow x={540} y={760} r={260} col="#fff6c8" a={0.6 * hi} />
    <MGPerson x={lp(250, 400, hi)} y={1300} s={2.3} who="dev" mouth="grin" brow="up" look={[1, -0.4]} bl={BL(T)} />
    <MGPerson x={lp(830, 680, hi)} y={1290} s={2.2} who="theo" mouth="grin" brow="up" look={[-1, -0.4]} bl={BL(T, 1)} />
    <MGArm x1={lp(310, 460, hi)} y1={1030} x2={540} y2={lp(1000, 800, hi)} sleeve={DEV} skin={DEV_SKIN} w={40} />
    <MGArm x1={lp(770, 620, hi)} y1={1030} x2={560} y2={lp(1000, 790, hi)} sleeve={THEO} skin="#e9d2b8" w={40} />
    <MGChip x={540} y={240} text="SCORECARD · DEV: 1 UNDER" outline size={40} pop={t / 0.25} />
    {t > c && <MGChip x={540} y={420} text="STOP WATCHING. PLAY." size={56} pop={(t - c) / 0.25} />}</g>);
}

Object.assign(window, { MGPuttHook, MGThinkWorse, MGSnapAttention, MGGolfLab, MGStepFocus, MGDistracted, MGNameChoke, MGBeginners, MGWalkNormal, MGTheoHum, MGEndWatch });
})();
