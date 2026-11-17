// art.jsx — "The $5 That Makes You Happier (Not on You)" (Lila ep. 12, with Otto; retro modern illustration).
// Prosocial spending: Dunn, Aknin & Norton 2008 (Science) — people given $5 or $20 to spend by 5 p.m. on themselves or on
// others; those who spent on others reported feeling happier at the end of the day. Full 1080×1920 frames with
// retro-kit.jsx; captions at y ≈ 1540, faces and numbers stay above y 1400.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";

/* big over-ear headphones drawn over a Human at (x,y) scale s */
function Phones({ x, y, s }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-270 -40 C-270 -420 270 -420 270 -40" fill="none" stroke={P.blk} strokeWidth="58" strokeLinecap="round" />
    <path d="M-270 -40 C-270 -420 270 -420 270 -40" fill="none" stroke={P.blue} strokeWidth="40" strokeLinecap="round" />
    {[-1, 1].map((sd) => <rect key={sd} x={sd * 270 - 55} y={-120} width={110} height={190} rx={40} fill={P.yel} {...ink(8)} />)}</g>);
}
function Note({ x, y, s = 1, a = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}><ellipse cx={0} cy={0} rx={26} ry={20} fill={P.cyan} transform="rotate(-20)" />
    <rect x={20} y={-90} width={9} height={90} fill={P.cyan} /><path d="M29 -90 Q70 -70 50 -30" fill="none" stroke={P.cyan} strokeWidth="9" /></g>);
}
/* takeaway coffee cup */
function Coffee({ x, y, s = 1, rot = 0, T = 0, steam = true }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {steam && [0, 1, 2].map((i) => <path key={i} d={`M${-40 + i * 40} -170 q${18 + osc(T, 1.1, i * 0.3) * 8} -40 0 -80 q-18 -40 0 -80`} fill="none" stroke={P.cream} strokeWidth="8" strokeLinecap="round" opacity="0.7" />)}
    <path d={pts([[-100, -130], [100, -130], [80, 150], [-80, 150]])} fill={P.cream} {...ink(8)} />
    <rect x={-112} y={-160} width={224} height={40} rx={10} fill={P.blk} />
    <path d={pts([[-92, -20], [92, -20], [86, 60], [-86, 60]])} fill={P.red} {...ink(6)} /></g>);
}
const pts = (a) => 'M' + a.map((p) => p[0] + ' ' + p[1]).join(' L') + ' Z';
/* a dollar bill / envelope with an amount */
function Bill({ x, y, amt, s = 1, rot = 0, k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(cl(k)) * s})`}>
    <rect x={-210} y={-110} width={430} height={230} fill={P.blk} />
    <rect x={-220} y={-120} width={430} height={230} fill={P.green} {...ink(8)} />
    <rect x={-190} y={-90} width={370} height={170} fill="none" stroke={P.cream} strokeWidth="5" />
    <circle cx={-5} cy={-5} r={62} fill={P.cream} {...ink(5)} />
    <text x={-5} y={22} textAnchor="middle" fontFamily={BEB} fontSize="80" fill={P.blk}>{amt}</text></g>);
}
/* simple token face for groups */
function Tok({ x, y, r = 70, glow = 0, happy = 0.5, col = P.pink }) {
  return (<g transform={`translate(${x} ${y})`}>
    {glow > 0 && <circle r={r * 1.5} fill={P.cyan} opacity={0.35 * glow} style={{ filter: 'blur(8px)' }} />}
    <path d={pts([[-r, -r * 0.9], [r * 0.9, -r], [r, r * 0.6], [-r * 0.9, r * 0.7]])} fill={col} {...ink(6)} />
    <circle cx={-r * 0.35} cy={-r * 0.2} r={r * 0.17} fill={P.yel} {...ink(3)} /><circle cx={r * 0.35} cy={-r * 0.2} r={r * 0.17} fill={P.yel} {...ink(3)} />
    <path d={pts([[0, -r * 0.2], [-r * 0.2, r * 0.25], [r * 0.18, r * 0.22]])} fill={P.nose} />
    <path d={`M${-r * 0.35} ${r * 0.42} Q0 ${r * (0.42 + 0.3 * (happy - 0.5))} ${r * 0.35} ${r * 0.42}`} fill="none" {...ink(r * 0.08)} /></g>);
}

/* 1 — payday: Lila in new headphones, bag in hand, music notes floating */
function RMPayday({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.5);
  return (<g><RMBg kind="blue" />
    <RMChip x={280} y={160} text="PAYDAY" col={P.yel} size={58} pop={t / 0.25} />
    <RMLila x={500} y={900} s={0.6} mouth="smile" brow="up" lid={0.25} look={[0.5, -0.3]} />
    {t > c3 - 0.3 && <Phones x={500} y={900} s={0.6} />}
    {t > c3 - 0.3 && [0, 1, 2].map((i) => { const ph = (T * 0.5 + i / 3) % 1; return <Note key={i} x={820 + i * 30 - ph * 60} y={760 - ph * 380} s={0.9} a={1 - ph} />; })}
    <g transform={`translate(170 ${1130 + osc(T, 1.4) * 6})`}><path d={pts([[-90, -60], [90, -60], [110, 160], [-110, 160]])} fill={P.cream} {...ink(7)} /><path d="M-40 -60 Q0 -150 40 -60" fill="none" {...ink(8)} />
      <text x={0} y={70} textAnchor="middle" fontFamily={BEB} fontSize="50" fill={P.red}>NEW!</text></g>
    <RMChip x={820} y={1270} text="TREAT YOURSELF" col={P.cream} size={40} pop={(t - 0.6) / 0.25} rot={0.03} /></g>);
}

/* 2 — the buzz lasts an hour: an hourglass drains while Lila's grin goes flat */
function RMHappyHour({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6);
  const d = SM(c1 - 0.2, c1 + 1.0, t);
  return (<g><RMBg kind="redDark" />
    <RMLila x={360} y={880} s={0.72} mouth={d > 0.6 ? 'flat' : 'smile'} brow={d > 0.6 ? 'sad' : 'up'} lid={lp(0.2, 0.55, d)} look={[1, 0]} />
    <Phones x={360} y={880} s={0.72} />
    <g transform="translate(860 760)"><rect x={-120} y={-260} width={240} height={30} fill={P.blk} /><rect x={-120} y={230} width={240} height={30} fill={P.blk} />
      <path d="M-95 -230 L95 -230 L10 0 L95 230 L-95 230 L-10 0 Z" fill={P.cream} {...ink(7)} />
      <path d={`M${-80 * (1 - d) - 6} ${-215 + 200 * d} L${80 * (1 - d) + 6} ${-215 + 200 * d} L8 -6 L-8 -6 Z`} fill={P.yel} />
      <path d={`M-90 225 L90 225 L${80 * (1 - d * 0.9)} ${225 - 200 * d} L${-80 * (1 - d * 0.9)} ${225 - 200 * d} Z`} fill={P.yel} />
      <line x1="0" y1="0" x2="0" y2="220" stroke={P.yel} strokeWidth="5" opacity={d < 1 ? 1 : 0} /></g>
    <RMChip x={860} y={1120} text="1 HOUR LATER" col={P.cream} size={40} pop={(t - c1) / 0.25} rot={-0.03} /></g>);
}

/* 3 — snapback: a scale — "ME" (headphones) rises, "SOMEONE ELSE" (a coffee) sinks heavy */
function RMWrongPerson({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1);
  const tilt = lp(-0.18, 0.2, EO((t - c2 + 0.4) / 0.7));
  return (<g><RMBg kind="blue" />
    <RMScale tilt={tilt}
      left={(x, y) => <g><Phones x={x} y={y + 40} s={0.32} /><RMChip x={x} y={y + 140} text="ME" col={P.cream} size={42} /></g>}
      right={(x, y) => <g><Coffee x={x} y={y - 20} s={0.62} T={T} /><RMChip x={x} y={y + 140} text="SOMEONE ELSE" col={P.yel} size={40} /></g>} />
    <RMTitle lines={[['HAPPIER?', P.cream, 150]]} y={330} a={SM(0, 0.3, t)} /></g>);
}

/* 4 — 2008: a $5 bill and a $20 bill, a ringing clock: spend it by 5 p.m. */
function RMEnvelopes({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), c4 = bt(beats, 4, 2.2);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={170} text="STUDY · 2008" col={P.cream} size={50} pop={t / 0.25} />
    <Bill x={360} y={560} amt="$5" rot={-8} k={(t - c2) / 0.3} />
    <Bill x={720} y={800} amt="$20" rot={6} k={(t - c2 - 0.2) / 0.3} />
    {t > c4 - 0.2 && <RMAlarm x={540} y={1180} T={T} s={0.55} ring={1} />}
    {t > c4 - 0.2 && <RMChip x={830} y={1180} text="BY 5 P.M." col={P.yel} size={46} pop={(t - c4 + 0.2) / 0.25} rot={0.04} />}</g>);
}

/* 5 — the split: grid paper divided — ON ME (a shopping bag) | ON SOMEONE (a gift) */
function RMHalfHalf({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g><RMBg kind="blue" />
    <RMGrid x={110} y={300} w={420} h={900} /><RMGrid x={550} y={300} w={420} h={900} />
    <RMChip x={320} y={300} text="ON ME" col={P.cream} size={44} pop={t / 0.25} />
    <g transform="translate(320 760)"><path d={pts([[-110, -80], [110, -80], [130, 200], [-130, 200]])} fill={P.red} {...ink(8)} /><path d="M-50 -80 Q0 -180 50 -80" fill="none" {...ink(9)} /></g>
    {t > c3 - 0.3 && <g><RMChip x={760} y={300} text="ON SOMEONE" col={P.yel} size={44} pop={(t - c3 + 0.3) / 0.25} />
      <g transform={`translate(760 760) scale(${BK(cl((t - c3 + 0.2) / 0.35))})`}><rect x={-140} y={-80} width={280} height={260} fill={P.yel} {...ink(8)} /><rect x={-160} y={-130} width={320} height={60} fill={P.yel} {...ink(8)} />
        <rect x={-22} y={-130} width={44} height={310} fill={P.red} /><path d="M0 -130 C-90 -230 -140 -150 0 -130 C140 -150 90 -230 0 -130 Z" fill={P.red} {...ink(6)} /></g></g>}</g>);
}

/* 6 — that evening: the givers glow cyan and grin; the self-spenders stay so-so */
function RMGiversGlow({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1), c3 = bt(beats, 3, 1.7);
  const g = SM(c2 - 0.3, c2 + 0.4, t);
  return (<g><RMBg kind="dark" />
    <RMBulb x={540} y={200} T={T} />
    <RMChip x={540} y={380} text="THAT EVENING" col={P.cream} size={46} pop={t / 0.25} />
    {[0, 1, 2].map((i) => <Tok key={'s' + i} x={250} y={620 + i * 230} r={80} happy={0.55} col={[P.pink, P.cream, P.yel][i]} />)}
    {[0, 1, 2].map((i) => <Tok key={'g' + i} x={800} y={620 + i * 230} r={80} glow={g} happy={lp(0.55, 1.3, g)} col={[P.yel, P.pink, P.cream][i]} />)}
    <RMChip x={250} y={1320} text="ON ME" col={P.cream} size={40} pop={(t - 0.3) / 0.25} />
    <RMChip x={800} y={1320} text="GIVERS: HAPPIER" col={P.yel} size={40} pop={(t - c2) / 0.25} rot={0.03} />
    {t > c3 && <Bill x={540} y={1120} amt="$5" s={0.45} rot={-6} k={(t - c3) / 0.3} />}</g>);
}

/* 7 — name: PROSOCIAL SPENDING; a coin drops into a glowing heart */
function RMProsocial({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.9);
  const fall = EO((t - 0.2) / 0.6);
  return (<g><RMBg kind="red" />
    <RMTitle lines={[['PROSOCIAL', P.cream, 150], ['SPENDING', P.yel, 150]]} y={260} a={SM(c1 - 0.3, c1 + 0.1, t)} />
    <g transform="translate(540 920)"><path d="M0 240 C-320 20 -300 -260 -120 -260 C-40 -260 0 -190 0 -150 C0 -190 40 -260 120 -260 C300 -260 320 20 0 240 Z" fill={P.pink} {...ink(10)} />
      <rect x={-90} y={-170} width={180} height={22} rx={10} fill={P.blk} />
      {[0, 1, 2, 3].map((i) => <RMBolt key={i} x={0} y={0} len={200} ang={i * 1.57 + 0.4} seed={i + 5} T={T} w={4} />)}</g>
    {fall < 1 && <g transform={`translate(540 ${lp(500, 760, fall)})`}><ellipse rx={60} ry={60} fill={P.yel} {...ink(7)} /><text y={24} textAnchor="middle" fontFamily={BEB} fontSize="70" fill={P.blk}>$</text></g>}</g>);
}

/* 8 — self-proof: a wrapped gift and a jittery alarm clock — can't wait to give it */
function RMGiftWait({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  const jig = Math.sin(T * 14) * 4 * SM(c3 - 0.3, c3, t);
  return (<g><RMBg kind="blue" />
    <g transform={`translate(${540 + jig} 860) rotate(${jig * 0.6})`}><rect x={-230} y={-140} width={460} height={380} fill={P.red} {...ink(10)} /><rect x={-260} y={-220} width={520} height={100} fill={P.red} {...ink(10)} />
      <rect x={-34} y={-220} width={68} height={460} fill={P.yel} {...ink(6)} />
      <path d="M0 -220 C-140 -380 -230 -250 0 -220 C230 -250 140 -380 0 -220 Z" fill={P.yel} {...ink(8)} /></g>
    <RMAlarm x={850} y={420} T={T} s={0.5} ring={SM(c3 - 0.3, c3, t)} />
    {t > c3 && <RMChip x={540} y={1300} text="CAN'T WAIT" col={P.yel} size={56} pop={(t - c3) / 0.25} rot={0.03} />}</g>);
}

/* 9 — payoff: Lila hands Otto a coffee; the loud boss is speechless, then beams */
function RMOttoCoffee({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6), c2 = bt(beats, 2, 1.2);
  const hand = EO((t - 0.1) / 0.6);
  return (<g><RMBg kind="dark" /><RMBulb x={300} y={160} T={T} />
    <RMLila x={290} y={940} s={0.5} mouth="smile" brow="up" lid={0.2} look={[1, 0]} />
    <RMOtto x={800} y={920} s={0.52} mouth={t > c2 ? 'smile' : 'open'} brow="up" lid={t > c2 ? 0.35 : 0.05} look={[-1, 0.3]} wide={t < c2} />
    <Coffee x={lp(430, 590, hand)} y={1030} s={0.55} T={T} rot={lp(-6, 4, hand)} />
    {t > c1 && <RMSpeech x={780} y={340} text="FOR ME?!" size={88} k={(t - c1) / 0.3} col={P.yel} rot={0.05} />}
    {t > c2 && <RMChip x={290} y={440} text="$5 · BEST BUY" col={P.cream} size={42} pop={(t - c2) / 0.25} rot={-0.03} />}</g>);
}

/* end — two cups clink; question + send chips */
function RMEndCoffee({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.7), c3 = bt(beats, 3, 1.8);
  const cl2 = Math.max(0, Math.sin(T * 2.4)) * 10;
  return (<g><RMBg kind="dark" />
    <RMBulb x={540} y={200} T={T} />
    <Coffee x={420 + cl2} y={860} s={0.9} T={T} rot={10} />
    <Coffee x={660 - cl2} y={860} s={0.9} T={T + 0.5} rot={-10} />
    <RMChip x={540} y={420} text="TREAT SOMEONE" col={P.yel} size={58} pop={t / 0.25} />
    {t > c1 && <RMChip x={540} y={1210} text="WHO'S GETTING YOUR COFFEE?" col={P.cream} size={40} pop={(t - c1) / 0.25} rot={0.02} />}
    {t > c3 && <RMChip x={860} y={1320} text="SEND IT" col={P.yel} size={42} pop={(t - c3) / 0.25} rot={-0.04} />}</g>);
}

Object.assign(window, { RMPayday, RMHappyHour, RMWrongPerson, RMEnvelopes, RMHalfHalf, RMGiversGlow, RMProsocial, RMGiftWait, RMOttoCoffee, RMEndCoffee });
})();
