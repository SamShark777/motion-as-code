// art.jsx — "You Said No to the Invite. They Barely Minded." (Mae ep. 14, with The Doubt + Otto; retro modern illustration).
// Givi & Kirk 2023 (JPSP, "Saying no"): five experiments, 2,000+ people; decliners overestimated how angry/disappointed
// inviters would be and how unlikely to invite them again. No invented numbers on screen.
// Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540; keep faces/numbers out of 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";

// invitation card with a hard shadow; `no` 0..1 stamps a red NO across it
function Invite({ x, y, s = 1, rot = -0.05, no = 0, title = "OTTO'S BBQ", sub = 'SATURDAY · 2PM' }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot * 57.3}) scale(${s})`}>
    <rect x={-250 + 14} y={-170 + 14} width={500} height={340} fill={P.blk} />
    <rect x={-250} y={-170} width={500} height={340} fill={P.cream} {...ink(7)} />
    <rect x={-220} y={-140} width={440} height={280} fill="none" stroke={P.red} strokeWidth="6" />
    <text x="0" y="-30" textAnchor="middle" fontFamily={BEB} fontSize="96" letterSpacing="6" fill={P.blue}>{title}</text>
    <text x="0" y="50" textAnchor="middle" fontFamily={BEB} fontSize="54" letterSpacing="4" fill={P.blk}>{sub}</text>
    <g transform="translate(-60 105)">{[0, 1, 2].map((i) => <circle key={i} cx={i * 60} cy="0" r="14" fill={[P.red, P.yel, P.blue][i]} {...ink(4)} />)}</g>
    {no > 0 && <g transform={`rotate(-14) scale(${BK(no) * 1.0})`} opacity={cl(no * 2)}>
      <rect x="-160" y="-80" width="320" height="160" fill="none" stroke={P.red} strokeWidth="16" />
      <text x="0" y="52" textAnchor="middle" fontFamily={BEB} fontSize="150" letterSpacing="10" fill={P.red}>NO</text></g>}</g>);
}
// a bed seen from the side with someone lying in it (the head is drawn by the caller)
function Bed({ y = 1180 }) {
  return (<g><rect x={90} y={y} width={900} height={130} fill={P.blue} {...ink(8)} />
    <rect x={70} y={y - 160} width={40} height={360} fill={P.blk} /><rect x={970} y={y - 90} width={40} height={290} fill={P.blk} />
    <path d={`M330 ${y} Q620 ${y - 120} 960 ${y - 20} L960 ${y + 40} L330 ${y + 40} Z`} fill={P.pink} {...ink(7)} /></g>);
}
// grill with smoke puffs
function Grill({ x, y, s = 1, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => { const ph = ((T * 0.5 + i / 3) % 1); return <circle key={i} cx={-40 + i * 40 + Math.sin(ph * 6 + i) * 20} cy={-120 - ph * 220} r={30 + ph * 40} fill={P.cream} opacity={0.6 * (1 - ph)} />; })}
    <path d="M-170 -60 L170 -60 Q160 60 0 70 Q-160 60 -170 -60 Z" fill={P.blk} />
    {[-110, -55, 0, 55, 110].map((gx) => <rect key={gx} x={gx - 4} y={-70} width={8} height={14} fill={P.yel} />)}
    <path d="M-80 60 L-120 220 M80 60 L120 220 M0 70 L0 220" stroke={P.blk} strokeWidth="14" strokeLinecap="round" /></g>);
}

/* 1 — hook: the invitation with NO stamped on it; Mae awake in bed under it, the clock at 2 AM */
function RMNoCard({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), c4 = bt(beats, 4, 1.8);
  return (<g><RMBg kind={t > c4 ? 'dark' : 'red'} />
    {t > c4 && <RMBulb x={540} y={200} T={T} on={false} />}
    <Invite x={540} y={t > c4 ? lp(520, 470, SM(c4, c4 + 0.4, t)) : 520} s={t > c4 ? lp(1.1, 0.75, SM(c4, c4 + 0.4, t)) : 1.1} no={(t - c1) / 0.3} />
    {t <= c4 && <RMMae x={540} y={980} s={0.42} mouth="flat" brow="sad" lid={0.3} look={[0, -1]} body />}
    {t > c4 && <g><Bed y={1200} /><RMMae x={250} y={1060} s={0.3} rot={-1.4} body={false} mouth="frown" brow="sad" lid={0} look={[0, -1]} wide />
      <RMChip x={800} y={900} text="2:14 AM" col={P.cream} size={50} pop={(t - c4) / 0.25} /></g>}</g>);
}
/* 2 — to the viewer: one tiny NO vs a huge GUILT weight */
function RMYouToo({ T, t, beats }) {
  const c4 = bt(beats, 4, 1.8), drop = EO((t - c4 + 0.2) / 0.35);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={230} text="YOU, EVERY TIME" col={P.cream} size={50} pop={t / 0.25} />
    <Invite x={300} y={620} s={0.45} no={(t - 0.3) / 0.3} />
    <text x="300" y="800" textAnchor="middle" fontFamily={BEB} fontSize="60" fill={P.cream} opacity={SM(0.4, 0.8, t)}>ONE SMALL NO</text>
    <g transform={`translate(760 ${lp(-300, 860, drop)})`}>
      <path d="M-200 220 L200 220 L150 -120 L-150 -120 Z" fill={P.blk} />
      <rect x="-40" y="-190" width="80" height="80" rx="30" fill="none" stroke={P.blk} strokeWidth="22" />
      <text x="0" y="110" textAnchor="middle" fontFamily={BEB} fontSize="110" letterSpacing="6" fill={P.yel}>GUILT</text></g>
    <RMMae x={330} y={1060} s={0.3} mouth="frown" brow="sad" lid={0.3} look={[1, -0.5]} /></g>);
}
/* 3 — snapback: The Doubt holding a crystal ball that cracks */
function RMGuessWrong({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.9), crack = SM(c2 - 0.1, c2 + 0.25, t);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={230} text="THE GUILT'S GUESS" col={P.yel} size={50} pop={t / 0.25} />
    <g transform="translate(540 700)"><circle r="230" fill={P.cyan} opacity="0.85" {...ink(9)} />
      <text x="0" y="-10" textAnchor="middle" fontFamily={BEB} fontSize="80" fill={P.blue} opacity={1 - crack}>HE HATES</text>
      <text x="0" y="70" textAnchor="middle" fontFamily={BEB} fontSize="80" fill={P.blue} opacity={1 - crack}>YOU NOW</text>
      {crack > 0 && <path d="M-180 -130 L-60 -40 L-110 40 L20 60 L-20 150 L120 120 L190 170" fill="none" stroke={P.blk} strokeWidth="12" strokeDasharray={`${700 * crack} 999`} />}
      {crack > 0.5 && <text x="0" y="40" textAnchor="middle" fontFamily={BEB} fontSize="150" letterSpacing="8" fill={P.red} transform={`scale(${BK((crack - 0.5) * 2)})`}>WRONG</text>}
      <rect x="-150" y="215" width="300" height="70" fill={P.blk} /></g>
    <RMDoubt x={540} y={1150} s={0.6} T={T} mood={crack > 0.5 ? 'shocked' : 'sly'} look={[0, -1]} /></g>);
}
/* 4 — The Doubt on Mae's shoulder whispering FURIOUS */
function RMDoubtWhisper({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  return (<g><RMBg kind="redDark" />
    <RMMae x={480} y={760} s={0.62} mouth="frown" brow="sad" lid={0.25} look={[0.8, 0]} stress />
    <RMDoubt x={880} y={560 + osc(T, 1.1) * 8} s={0.42} T={T} mood="sly" look={[-1, 0.2]} />
    <RMSpeech x={720} y={230} text="FURIOUS." k={(t - c2 + 0.1) / 0.3} size={110} col={P.red} /></g>);
}
/* 5 — never again: an empty mailbox for months, calendar pages flying */
function RMNeverAgain({ T, t, beats }) {
  const k = SM(0.1, 1.4, t);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  return (<g><RMBg kind="dark" />
    {months.map((m, i) => { const f = cl(k * 6 - i); return (<g key={m} transform={`translate(${200 + i * 136 + f * 60} ${380 - f * 160}) rotate(${f * (hsh(i) - 0.5) * 60})`} opacity={f > 0 ? 1 - f * 0.6 : 1}>
      <rect x="-60" y="-70" width="120" height="140" fill={P.cream} {...ink(5)} /><rect x="-60" y="-70" width="120" height="34" fill={P.red} />
      <text x="0" y="40" textAnchor="middle" fontFamily={BEB} fontSize="56" fill={P.blk}>{m}</text></g>); })}
    <g transform="translate(540 1000)"><rect x="-26" y="40" width="52" height="300" fill={P.blk} />
      <path d="M-200 60 L-200 -100 Q-200 -220 0 -220 Q200 -220 200 -100 L200 60 Z" fill={P.blue} {...ink(8)} />
      <rect x="-150" y="-60" width="300" height="100" fill={P.blk} />
      <text x="0" y="12" textAnchor="middle" fontFamily={BEB} fontSize="50" letterSpacing="4" fill={P.cream}>NO INVITES</text>
      <path d="M200 -40 L200 -200 L280 -170 L200 -140" fill={P.red} {...ink(5)} transform={`rotate(${-80 * (1 - SM(0.2, 0.6, t))} 200 -40)`} /></g>
    <RMDoubt x={850} y={1230} s={0.3} T={T} mood="sly" look={[-1, -0.6]} /></g>);
}
/* 6 — the study: five experiment folders + 2,000+ people grid */
function RMStudy2023({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.3);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={230} text="INVITATION STUDY · 2023" col={P.yel} size={48} pop={t / 0.25} />
    {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${170 + i * 185} 470) scale(${BK((t - 0.15 - i * 0.12) / 0.3)})`}>
      <rect x="-70" y="-90" width="150" height="170" fill={P.blk} transform="translate(10 10)" /><rect x="-80" y="-100" width="150" height="170" fill={P.cream} {...ink(6)} />
      <text x="-5" y="30" textAnchor="middle" fontFamily={BEB} fontSize="110" fill={P.red}>{i + 1}</text></g>)}
    {[...Array(60)].map((_, i) => { const x = 150 + (i % 12) * 70, y = 720 + Math.floor(i / 12) * 90, on = SM(c2 - 0.6 + i * 0.012, c2 - 0.3 + i * 0.012, t);
      return <g key={i} opacity={on}><circle cx={x} cy={y} r={20} fill={i % 3 ? P.pink : P.yel} {...ink(4)} /><path d={`M${x - 26} ${y + 50} Q${x} ${y + 18} ${x + 26} ${y + 50} Z`} fill={P.cream} {...ink(4)} /></g>; })}
    {t > c2 && <RMChip x={540} y={1260} text="2,000+ PEOPLE" col={P.cream} size={64} pop={(t - c2) / 0.25} />}</g>);
}
/* 7 — result: scale of guessed upset (heavy) vs real upset (light) */
function RMScaleNo({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), tilt = 0.3 * SM(c1, c1 + 0.6, t);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={230} text="HOW UPSET WAS OTTO?" col={P.yel} size={50} pop={t / 0.25} />
    <RMScale tilt={tilt}
      left={(x, y) => (<g><RMChip x={x} y={y + 120} text="REAL" col={P.cream} size={40} pop={1} />
        <RMOtto x={x} y={y - 20} s={0.2} body={false} mouth="smile" brow="flat" lid={0.4} /></g>)}
      right={(x, y) => (<g><RMChip x={x} y={y + 120} text="GUESSED" col={P.yel} size={40} pop={1} />
        <RMSpiky x={x} y={y - 10} s={0.8} /></g>)} /></g>);
}
/* 8 — name it: a giant NO that's actually tiny once measured with a ruler */
function RMNoName({ T, t, beats }) {
  const k = SM(0.5, 1.4, t);
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['A KIND NO', P.cream, 150], ['HURTS LESS', P.yel, 150]]} y={300} a={EO(t / 0.35)} />
    <g transform={`translate(540 ${lp(880, 960, k)}) scale(${lp(1.6, 0.6, k)})`}>
      <text x="10" y="80" textAnchor="middle" fontFamily={BEB} fontSize="300" letterSpacing="10" fill={P.blk}>NO</text>
      <text x="0" y="70" textAnchor="middle" fontFamily={BEB} fontSize="300" letterSpacing="10" fill={P.red}>NO</text></g>
    <g opacity={k}><rect x="240" y="1160" width="600" height="80" fill={P.yel} {...ink(6)} />
      {[...Array(13)].map((_, i) => <RMLine key={i} x1={260 + i * 46} y1={1160} x2={260 + i * 46} y2={i % 2 ? 1190 : 1210} w={5} />)}</g>
    <RMDoubt x={900} y={1250} s={0.22} T={T} mood={k > 0.6 ? 'worried' : 'sly'} look={[-1, -0.6]} /></g>);
}
/* 9 — payoff: Monday at work, Otto shrugs; The Doubt shrinks to a pea */
function RMMonday({ T, t, beats }) {
  const c4 = bt(beats, 4, 2.2), shrink = SM(c4 - 0.2, c4 + 0.4, t);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={150} text="MONDAY · 9:02 AM" col={P.cream} size={48} pop={t / 0.25} />
    <RMOtto x={300} y={700} s={0.5} mouth="smile" brow="up" lid={0.35} look={[1, 0]} />
    <RMMae x={800} y={760} s={0.45} mouth={shrink > 0.5 ? 'smile' : 'flat'} brow="up" lid={0.2} look={[-1, 0]} />
    <RMSpeech x={360} y={380} text="NEXT MONTH, THEN!" k={(t - 0.4) / 0.3} size={70} col={P.yel} />
    <RMDoubt x={lp(960, 990, shrink)} y={lp(560, 600, shrink)} s={lp(0.32, 0.06, shrink)} T={T} mood={shrink > 0.5 ? 'shocked' : 'worried'} look={[-1, 0]} /></g>);
}
/* 10 — end: the question + Mae writing a polite NO, THANKS */
function RMEndNo({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.6);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={230} text="EVER SAID YES TO DODGE THE GUILT?" col={P.yel} size={40} pop={t / 0.25} />
    <Invite x={540} y={620} s={0.9} rot={0.04} title="ANY PARTY" sub="YES  /  NO, THANKS" />
    {t > c3 && <ellipse cx={668} cy={652} rx={150} ry={50} fill="none" stroke={P.red} strokeWidth="10" strokeDasharray={`${900 * SM(c3, c3 + 0.4, t)} 999`} />}
    <RMMae x={540} y={1010} s={0.3} mouth="smile" brow="up" lid={0.2} look={[0, -1]} /></g>);
}

Object.assign(window, { RMNoCard, RMYouToo, RMGuessWrong, RMDoubtWhisper, RMNeverAgain, RMStudy2023, RMScaleNo, RMNoName, RMMonday, RMEndNo });
})();
