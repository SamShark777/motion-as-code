// art.jsx — "Why You Should Never Shop Hungry" (Otto ep. 9, with Lila; retro modern illustration).
// Hot-cold empathy gap: Read & van Leeuwen 1998 (OBHDP) — 200 employees in Amsterdam chose a snack to get a week later;
// those choosing while hungry picked unhealthy snacks more often, whatever their hunger would be later. No numbers on screen
// except "200". Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540 — faces stay out of y 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";

/* flat snack props: chips | donut | bar | cookie | candy | pretzel | milk | apple | banana */
function Snack({ kind, x, y, s = 1, rot = 0, k = 1 }) {
  if (k <= 0) return null;
  let g = null;
  if (kind === 'chips') g = (<g><path d="M-70 -100 L70 -100 L60 100 L-60 100 Z" fill={P.red} {...ink(6)} /><path d="M-70 -100 L-60 -120 L-40 -100 L-20 -120 L0 -100 L20 -120 L40 -100 L60 -120 L70 -100" fill={P.red} {...ink(5)} />
    <circle cy="10" r="40" fill={P.yel} {...ink(5)} /><text y="24" textAnchor="middle" fontFamily={BEB} fontSize="40" fill={P.blk}>CRISP</text></g>);
  else if (kind === 'donut') g = (<g><circle r="80" fill="#C9965A" {...ink(6)} /><path d="M-70 -20 C-60 -80 60 -80 70 -20 C60 10 30 -10 0 10 C-30 -10 -50 20 -70 -20 Z" fill={P.pink} {...ink(5)} /><circle r="24" fill={P.red} {...ink(5)} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-44 + i * 20} y={-48 + (i % 2) * 14} width="12" height="5" fill={P.yel} transform={`rotate(${i * 40} ${-38 + i * 20} -46)`} />)}</g>);
  else if (kind === 'bar') g = (<g><rect x="-110" y="-45" width="220" height="90" fill="#5a2e1f" {...ink(6)} /><rect x="-60" y="-45" width="170" height="90" fill={P.blue} {...ink(6)} /><text x="25" y="16" textAnchor="middle" fontFamily={BEB} fontSize="46" fill={P.yel}>CHOCO</text></g>);
  else if (kind === 'cookie') g = (<g><circle r="70" fill="#D9A660" {...ink(6)} />{[[-25, -20], [20, -30], [10, 20], [-30, 25], [35, 10]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r="10" fill="#4a2618" />)}</g>);
  else if (kind === 'candy') g = (<g><path d="M-120 -40 L-60 0 L-120 40 Z M120 -40 L60 0 L120 40 Z" fill={P.yel} {...ink(5)} /><ellipse rx="70" ry="48" fill={P.pink} {...ink(6)} /><path d="M-40 -40 L-10 40 M10 -45 L40 40" stroke={P.cream} strokeWidth="9" /></g>);
  else if (kind === 'pretzel') g = (<g><path d="M0 40 C-90 -40 -90 -100 -30 -90 C20 -80 10 -10 -60 60 M0 40 C90 -40 90 -100 30 -90 C-20 -80 -10 -10 60 60" fill="none" stroke="#8C5228" strokeWidth="30" strokeLinecap="round" />
    <path d="M0 40 C-90 -40 -90 -100 -30 -90 C20 -80 10 -10 -60 60 M0 40 C90 -40 90 -100 30 -90 C-20 -80 -10 -10 60 60" fill="none" stroke={P.blk} strokeWidth="5" strokeLinecap="round" /></g>);
  else if (kind === 'milk') g = (<g><path d="M-60 -60 L0 -120 L60 -60 L60 120 L-60 120 Z" fill={P.cream} {...ink(6)} /><path d="M-60 -60 L60 -60" {...ink(5)} /><rect x="-60" y="10" width="120" height="60" fill={P.blue} {...ink(5)} />
    <text y="54" textAnchor="middle" fontFamily={BEB} fontSize="46" fill={P.cream}>MILK</text></g>);
  else if (kind === 'apple') g = (<g><path d="M0 -50 C-60 -90 -110 -30 -90 30 C-70 90 -30 100 0 80 C30 100 70 90 90 30 C110 -30 60 -90 0 -50 Z" fill={P.green} {...ink(6)} /><path d="M0 -50 L10 -100" {...ink(7)} /><ellipse cx="30" cy="-95" rx="26" ry="12" fill={P.green} {...ink(4)} transform="rotate(-25 30 -95)" /></g>);
  else if (kind === 'banana') g = (<g><path d="M-120 -30 C-60 80 90 80 130 -40 C80 20 -60 30 -120 -30 Z" fill={P.yel} {...ink(6)} /><path d="M-120 -30 L-140 -50" {...ink(10)} /></g>);
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k) * s})`}>{g}</g>;
}
const JUNK = ['chips', 'donut', 'bar', 'cookie', 'candy', 'pretzel'];
function Growl({ x, y, T, a = 1 }) {
  return <g opacity={a}>{[0, 1, 2].map((i) => { const r = 40 + i * 28 + ((T * 60) % 28); return <path key={i} d={`M${x - r} ${y - r * 0.4} Q${x} ${y - r * 0.9} ${x + r} ${y - r * 0.4}`} fill="none" stroke={P.yel} strokeWidth="6" strokeLinecap="round" />; })}</g>;
}

/* 1 — the checkout: Otto behind a conveyor belt; one milk, then six snacks pop on; LIST: MILK → +6 SNACKS */
function RMOttoCheckout({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  return (<g><RMBg kind="red" />
    <RMOtto x={540} y={640} s={0.58} mouth="smile" brow="up" lid={0.2} look={[0, 1]} wide />
    <rect x="-20" y="1040" width="1120" height="200" fill={P.blk} /><rect x="-20" y="1040" width="1120" height="40" fill="#3a3240" />
    {[...Array(12)].map((_, i) => <line key={i} x1={((i * 110 - T * 80) % 1210 + 1210) % 1210 - 60} y1={1084} x2={((i * 110 - T * 80) % 1210 + 1210) % 1210 - 60} y2={1236} stroke="#3a3240" strokeWidth="6" />)}
    <Snack kind="milk" x={150} y={920} s={0.85} k={(t - 0.1) / 0.3} />
    {JUNK.map((kd, i) => <Snack key={kd} kind={kd} x={300 + (i % 3) * 240} y={i < 3 ? 960 : 830} s={0.72} rot={(i - 2) * 6} k={(t - c2 + 0.2 - i * 0.12) / 0.3} />)}
    <RMChip x={260} y={170} text="LIST: MILK" col={P.cream} size={46} pop={t / 0.25} />
    {t > c2 && <RMChip x={540} y={1330} text="+ 6 SNACKS" col={P.yel} size={56} pop={(t - c2) / 0.25} rot={0.04} />}</g>);
}

/* 2 — you: the snack aisle glows; every packet sparkles; Otto's stomach growls */
function RMHungryAisle({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.7);
  return (<g><RMBg kind="redDark" />
    {[0, 1].map((r) => <g key={r}><rect x="60" y={330 + r * 300} width="960" height="24" fill={P.blk} />
      {[0, 1, 2, 3].map((c) => { const kd = JUNK[(r * 4 + c) % 6], x = 180 + c * 240, y = 240 + r * 300, glow = 0.5 + 0.5 * Math.sin(T * 5 + r + c);
        return (<g key={c}>{t > c1 && <circle cx={x} cy={y} r={95 + glow * 10} fill={P.yel} opacity={0.35 * SM(c1, c1 + 0.4, t)} />}<Snack kind={kd} x={x} y={y} s={0.62} /></g>); })}</g>)}
    <RMOtto x={330} y={1130} s={0.55} mouth="open" brow="up" lid={0} look={[1, -1]} wide body={false} />
    <Growl x={330} y={1360} T={T} a={SM(0, 0.4, t)} />
    {t > c1 && <RMSpeech x={740} y={860} text="NEED IT" size={80} k={(t - c1) / 0.3} col={P.yel} rot={0.05} />}</g>);
}

/* 3 — snapback: a NEXT WEEK calendar page; a hungry hand keeps stuffing snacks into a box for future Otto */
function RMNextWeek({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g><RMBg kind="blue" />
    <g transform="translate(540 380)"><rect x="-300" y="-200" width="600" height="400" fill={P.cream} {...ink(8)} /><rect x="-300" y="-200" width="600" height="110" fill={P.red} {...ink(8)} />
      <text y="-122" textAnchor="middle" fontFamily={BEB} fontSize="80" letterSpacing="6" fill={P.cream}>NEXT WEEK</text>
      {[...Array(7)].map((_, i) => <rect key={i} x={-270 + i * 78} y={-60} width="66" height="66" fill="none" {...ink(4)} />)}
      {[...Array(7)].map((_, i) => <rect key={'b' + i} x={-270 + i * 78} y={30} width="66" height="66" fill="none" {...ink(4)} />)}</g>
    <g transform="translate(540 1080)"><path d="M-260 -120 L260 -120 L230 200 L-230 200 Z" fill="#C9965A" {...ink(8)} /><path d="M-260 -120 L-330 -200 M260 -120 L330 -200" {...ink(8)} />
      <text y="80" textAnchor="middle" fontFamily={BEB} fontSize="64" letterSpacing="4" fill={P.blk}>FUTURE OTTO</text></g>
    {JUNK.map((kd, i) => { const p = cl((t - 0.2 - i * 0.28) / 0.5); return p > 0 && <Snack key={kd} kind={kd} x={lp(180 + (i % 2) * 720, 380 + (i % 3) * 90, p)} y={lp(700, 960 - (i % 2) * 30, p)} s={0.55} rot={i * 20 - 40} />; })}
    {t > c3 && <RMChip x={540} y={1340} text="HUNGER SHOPS AHEAD" col={P.yel} size={50} pop={(t - c3) / 0.25} />}</g>);
}

/* 4 — the study: AMSTERDAM · 1998; workers' hands choosing between an apple and a chocolate bar, delivery tag +7 DAYS */
function RMSnackStudy({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={170} text="AMSTERDAM · 1998" col={P.cream} size={48} pop={t / 0.25} />
    <RMGrid x={130} y={360} w={820} h={880} />
    {[...Array(10)].map((_, i) => <g key={i} transform={`translate(${220 + i * 71} ${560}) scale(${BK((t - 0.3 - i * 0.04) / 0.25)})`}><path d="M-26 70 L-22 6 L22 6 L26 70 Z" fill={[P.blue, P.red, P.green, P.yel][i % 4]} {...ink(4)} /><circle cy={-18} r={22} fill={i % 3 ? P.pink : P.yel} {...ink(4)} /></g>)}
    <text x="540" y="760" textAnchor="middle" fontFamily={BEB} fontSize="96" letterSpacing="6" fill={P.blk} opacity={SM(0.6, 0.9, t)}>200 WORKERS</text>
    <Snack kind="apple" x={330} y={930} s={1.0} k={(t - 0.8) / 0.3} />
    <text x="540" y="950" textAnchor="middle" fontFamily={BEB} fontSize="90" fill={P.blk} opacity={SM(0.9, 1.1, t)}>OR</text>
    <Snack kind="bar" x={760} y={930} s={0.9} k={(t - 1.0) / 0.3} />
    {t > c3 && <RMChip x={540} y={1150} text="DELIVERED IN 7 DAYS" col={P.yel} size={42} pop={(t - c3) / 0.25} rot={0.03} />}</g>);
}

/* 5 — result: a scale; HUNGRY NOW tips it hard toward the junk pan, however full later */
function RMJunkPick({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.8), tilt = 0.28 * EO((t - c1 + 0.2) / 0.6);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={170} text="CHOSEN WHILE HUNGRY" col={P.cream} size={44} pop={t / 0.25} />
    <RMScale tilt={tilt} left={(x, y) => <Snack kind="apple" x={x} y={y - 80} s={0.8} />}
      right={(x, y) => <g>{['chips', 'donut', 'bar'].map((kd, i) => <Snack key={kd} kind={kd} x={x - 60 + i * 60} y={y - 70 - i * 60} s={0.55} rot={i * 12 - 10} />)}</g>} />
    {t > bt(beats, 2, 1.4) && <RMChip x={540} y={420} text="FULL LATER? STILL JUNK" col={P.yel} size={40} pop={(t - bt(beats, 2, 1.4)) / 0.25} />}</g>);
}

/* 6 — name it: HOT-COLD EMPATHY GAP; a red-hot 'NOW' cliff and an icy 'LATER' cliff with a gap between */
function RMNameGap({ T, t }) {
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['HOT-COLD', P.yel, 150], ['EMPATHY GAP', P.cream, 140]]} y={250} a={EO((t - 0.15) / 0.35)} />
    <path d="M-40 760 L420 760 L380 860 L440 1000 L360 1120 L400 1380 L-40 1380 Z" fill={P.red} {...ink(9)} />
    <path d="M1120 760 L660 760 L700 880 L630 1010 L720 1150 L680 1380 L1120 1380 Z" fill={P.cream} {...ink(9)} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${120 + i * 90} ${720 - ((T * 70 + i * 30) % 90)} q20 -30 0 -60`} fill="none" stroke={P.yel} strokeWidth="8" strokeLinecap="round" />)}
    <text x="200" y="960" textAnchor="middle" fontFamily={BEB} fontSize="84" letterSpacing="5" fill={P.cream}>NOW</text>
    <text x="890" y="960" textAnchor="middle" fontFamily={BEB} fontSize="84" letterSpacing="5" fill={P.blue}>LATER</text>
    <Snack kind="donut" x={200} y={1170} s={0.7} /><Snack kind="apple" x={880} y={1170} s={0.7} /></g>);
}

/* 7 — self-proof: full after dinner, Otto writes HEALTHY WEEK; a donut later lands on the plan */
function RMHealthyPlan({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4), drop = EO((t - c3 - 0.2) / 0.5);
  const rows = ['MON · SALAD', 'TUE · SALAD', 'WED · SOUP', 'THU · SALAD'];
  return (<g><RMBg kind="redDark" />
    <RMOtto x={780} y={720} s={0.5} mouth="smile" brow="up" lid={0.45} look={[-1, 0.6]} />
    <g transform="translate(330 860) rotate(-4)"><rect x="-250" y="-330" width="500" height="660" fill={P.cream} {...ink(8)} />
      <text y="-250" textAnchor="middle" fontFamily={BEB} fontSize="66" letterSpacing="4" fill={P.red}>HEALTHY WEEK</text>
      {rows.map((r, i) => <text key={r} x="-200" y={-150 + i * 100} fontFamily={BEB} fontSize="56" letterSpacing="3" fill={P.blk} opacity={SM(0.2 + i * 0.25, 0.4 + i * 0.25, t)}>{r}</text>)}</g>
    <g transform="translate(770 1200)"><ellipse rx="190" ry="60" fill={P.cream} {...ink(7)} /><ellipse rx="120" ry="34" fill="none" {...ink(4)} /></g>
    <RMChip x={770} y={1330} text="AFTER DINNER" col={P.yel} size={40} pop={(t - 0.3) / 0.25} />
    {drop > 0 && <Snack kind="donut" x={330} y={lp(200, 800, drop)} s={1.1} rot={drop * 40} />}</g>);
}

/* 8 — end: Lila hands Otto a banana before he walks in; his basket holds just the milk; question + send chips */
function RMEndBanana({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), c3 = bt(beats, 3, 1.5), p = EO((t - 0.2) / 0.6);
  return (<g><RMBg kind="dark" />
    <RMLila x={270} y={860} s={0.58} mouth="smile" brow="up" lid={0.15} look={[1, 0.3]} />
    <RMOtto x={810} y={860} s={0.58} mouth="smile" brow="up" lid={0.25} look={[-1, 0.4]} />
    <Snack kind="banana" x={lp(380, 600, p)} y={lp(1180, 1120, p)} s={0.9} rot={-10} />
    <g transform="translate(860 1240)"><path d="M-130 -60 L130 -60 L100 100 L-100 100 Z" fill={P.blue} {...ink(7)} /><path d="M-100 -60 Q0 -200 100 -60" fill="none" {...ink(9)} /><Snack kind="milk" x={0} y={-60} s={0.55} /></g>
    {t > c2 && <RMChip x={540} y={170} text="EAT, THEN SHOP" col={P.yel} size={50} pop={(t - c2) / 0.25} />}
    {t > c3 && <RMChip x={540} y={300} text="WHICH SNACK SNEAKS IN?" col={P.pink} size={42} pop={(t - c3) / 0.25} rot={0.03} />}</g>);
}

Object.assign(window, { RMOttoCheckout, RMHungryAisle, RMNextWeek, RMSnackStudy, RMJunkPick, RMNameGap, RMHealthyPlan, RMEndBanana });
})();
