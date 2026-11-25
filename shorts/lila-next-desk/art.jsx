// art.jsx — "Why Your Best Friend Is Probably Your Neighbour" (Lila ep. 13, with Mae; retro modern illustration).
// Proximity / propinquity: Festinger, Schachter & Back 1950 (MIT Westgate housing) — friendships formed most between
// next-door neighbours; residents by the stairways made more friends on other floors. No invented numbers on screen.
// Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540; keep faces/numbers out of 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif", OSW = "'Oswald', sans-serif";

// office desk (front view) with a monitor
function Desk({ x, y, w = 420, col = P.blue, screen = P.cream }) {
  return (<g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 + 12} y={12} width={w} height={46} fill={P.blk} /><rect x={-w / 2} y={0} width={w} height={46} fill={P.yel} {...ink(6)} />
    <rect x={-w / 2 + 30} y={46} width={30} height={230} fill={P.blk} /><rect x={w / 2 - 60} y={46} width={30} height={230} fill={P.blk} />
    <rect x={-90} y={-170} width={180} height={130} fill={col} {...ink(6)} /><rect x={-72} y={-152} width={144} height={94} fill={screen} />
    <rect x={-16} y={-40} width={32} height={40} fill={P.blk} /></g>);
}
// a heart, pops with k
function Heart({ x, y, s = 1, k = 1, col = P.red }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${s * BK(k)})`}>
    <path d="M0 40 C-80 -10 -70 -80 -30 -80 C-10 -80 0 -60 0 -50 C0 -60 10 -80 30 -80 C70 -80 80 -10 0 40 Z" fill={P.blk} transform="translate(8 8)" />
    <path d="M0 40 C-80 -10 -70 -80 -30 -80 C-10 -80 0 -60 0 -50 C0 -60 10 -80 30 -80 C70 -80 80 -10 0 40 Z" fill={col} {...ink(6)} /></g>);
}
// apartment door seen from the front
function Door({ x, y, w = 150, h = 260, col = P.blue, label = '', open = 0 }) {
  return (<g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 + 10} y={-h + 10} width={w} height={h} fill={P.blk} />
    <rect x={-w / 2} y={-h} width={w} height={h} fill={P.blk} />
    <g transform={`translate(${-w / 2} 0) scale(${1 - 0.7 * open} 1) translate(${w / 2} 0)`}><rect x={-w / 2} y={-h} width={w} height={h} fill={col} {...ink(6)} />
      <rect x={-w / 2 + 18} y={-h + 20} width={w - 36} height={h * 0.38} fill="none" stroke={P.blk} strokeOpacity="0.5" strokeWidth="4" />
      <circle cx={w / 2 - 26} cy={-h * 0.45} r={9} fill={P.yel} {...ink(3)} />
      {label && <text x={0} y={-h * 0.72} textAnchor="middle" fontFamily={BEB} fontSize={w * 0.32} fill={P.cream}>{label}</text>}</g></g>);
}

/* 1 — hook: Lila and Mae at two desks side by side, a heart pops between them */
function RPDesks({ T, t, beats }) {
  const c3 = bt(beats, 2, 1.2);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={230} text="BEST FRIEND AT WORK?" col={P.yel} size={54} pop={t / 0.25} />
    <RMLila x={300} y={760} s={0.42} mouth="smile" brow="up" lid={0.2} look={[0.6, 0]} />
    <RMMae x={780} y={760} s={0.42} mouth="smile" brow="flat" lid={0.3} look={[-0.6, 0]} />
    <Desk x={300} y={1080} w={430} /><Desk x={780} y={1080} w={430} col={P.redD} />
    <Heart x={540} y={600 + osc(T, 1.4) * 10} s={0.9} k={(t - 0.6) / 0.35} />
    <g opacity={SM(c3 - 0.2, c3 + 0.2, t)}><path d="M330 1360 L750 1360" fill="none" stroke={P.cream} strokeWidth="8" strokeDasharray="22 14" />
      <path d="M320 1340 L300 1360 L320 1380 M760 1340 L780 1360 L760 1380" fill="none" stroke={P.cream} strokeWidth="8" />
      <RMChip x={540} y={1300} text="THE NEXT DESK" col={P.cream} size={40} pop={(t - c3) / 0.25} /></g></g>);
}
/* 2 — to the viewer: "we clicked because of the humour" — Lila laughing, smiley badges */
function RPHumour({ T, t, beats }) {
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={230} text="YOU: 'WE JUST CLICKED'" col={P.cream} size={50} pop={t / 0.25} />
    <RMLila x={540} y={720} s={0.62} mouth="open" brow="up" lid={0.15} look={[0, -0.2]} />
    {[[200, 520], [880, 480], [170, 900], [910, 860]].map(([x, y], i) => <RMBadge key={i} x={x} y={y + osc(T, 1.2, i * 0.3) * 12} r={62} k={(t - 0.3 - i * 0.25) / 0.3} />)}
    <RMSpeech x={540} y={1250} text="HA HA HA" k={(t - bt(beats, 4, 1.6) + 0.1) / 0.3} size={90} col={P.yel} /></g>);
}
/* 3 — snapback: a big door slams down in front of everything */
function RPDoor({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.8), k = EO((t - c2 + 0.25) / 0.3);
  return (<g><RMBg kind="redDark" />
    <g opacity={1 - 0.7 * k}><RMLila x={540} y={720} s={0.5} mouth="smile" brow="up" lid={0.2} /></g>
    <g transform={`translate(0 ${(1 - k) * -1500})`}><Door x={540} y={1340} w={520} h={1000} col={P.blue} label="2B" /></g>
    {k > 0.9 && <RMChip x={540} y={240} text="NOT THE HUMOUR. THE DOOR." col={P.yel} size={46} pop={(t - c2 - 0.1) / 0.25} />}</g>);
}
/* 4 — the study: a floor plan of the Westgate buildings on grid paper */
function RPHousing({ T, t, beats }) {
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={220} text="MIT · STUDENT HOUSING · 1950" col={P.cream} size={44} pop={t / 0.25} />
    <RMGrid x={90} y={340} w={900} h={980} />
    {[0, 1].map((fl) => <g key={fl}>
      <text x={130} y={fl ? 470 : 930} fontFamily={OSW} fontWeight="700" fontSize="40" fill={P.blk}>FLOOR {2 - fl}</text>
      {[0, 1, 2, 3, 4].map((i) => <Door key={i} x={210 + i * 165} y={fl ? 860 : 1300} w={120} h={330} col={[P.red, P.yel, P.blue, P.pink, P.red][i]} label={`${i + 1}`} open={0} />)}</g>)}
    <g opacity={SM(0.6, 1.2, t)}><RMSpeech x={720} y={1210} text="WHO'S YOUR FRIEND?" k={(t - 0.9) / 0.3} size={50} col={P.yel} rot={0.04} /></g></g>);
}
/* 5 — the result: hearts between next-door neighbours; the stairs flat links up a floor */
function RPStairs({ T, t, beats }) {
  const c3 = bt(beats, 2, 1.2);
  const doorX = (i) => 220 + i * 160;
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={220} text="NEXT DOOR WINS" col={P.yel} size={56} pop={t / 0.25} />
    {[0, 1].map((fl) => <g key={fl}><rect x={80} y={fl ? 460 : 870} width={920} height={20} fill={P.blk} />
      {[0, 1, 2, 3, 4].map((i) => <Door key={i} x={doorX(i)} y={fl ? 760 : 1170} w={110} h={260} col={fl ? P.blue : [P.red, P.yel, P.blue, P.pink, P.yel][i]} />)}</g>)}
    {[0, 1, 2, 3].map((i) => <Heart key={i} x={doorX(i) + 80} y={1240} s={0.45} k={(t - 0.3 - i * 0.2) / 0.3} />)}
    {/* stairs at the left end, a line from the stairs flat up to floor 2 */}
    <g opacity={SM(c3 - 0.3, c3, t)}>{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={40 + i * 10} y={1170 - i * 70} width={60} height={20} fill={P.cream} {...ink(4)} />)}
      <path d={`M${doorX(0)} 1000 C 120 900 120 700 ${doorX(1)} 640`} fill="none" stroke={P.cyan} strokeWidth="10" strokeDasharray="20 12" strokeDashoffset={-T * 60} />
      <Heart x={doorX(1)} y={560} s={0.5} k={(t - c3) / 0.3} col={P.yel} />
      <RMChip x={600} y={1330} text="BY THE STAIRS = MORE FRIENDS UPSTAIRS" col={P.cream} size={30} pop={(t - c3) / 0.25} /></g></g>);
}
/* 6 — name it: Lila and Mae keep bumping into each other in the hall; a cyan spark at each bump */
function RPEffect({ T, t, beats }) {
  const ph = (T * 0.8) % 1, d = Math.abs(Math.sin(ph * Math.PI)) * 170;
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['PROXIMITY', P.cream, 150], ['EFFECT', P.yel, 150]]} y={250} a={EO(t / 0.35)} />
    <RMLila x={540 - 110 - d} y={820} s={0.4} mouth="smile" brow="up" lid={0.2} look={[0.6, 0]} />
    <RMMae x={540 + 110 + d} y={820} s={0.4} mouth="smile" brow="flat" lid={0.25} look={[-0.6, 0]} />
    {d < 30 && [0, 1, 2, 3, 4].map((i) => <RMBolt key={i} x={540} y={700} len={120} ang={-Math.PI / 2 + (i - 2) * 0.5} seed={i + 3} T={T} />)}
    <RMChip x={540} y={1330} text="WE LIKE WHO WE BUMP INTO" col={P.yel} size={42} pop={(t - bt(beats, 2, 1.1)) / 0.25} /></g>);
}
/* 7 — self-proof: a row of school desks; one seat glows */
function RPSchool({ T, t, beats }) {
  const c4 = bt(beats, 4, 1.8), g = SM(c4 - 0.2, c4 + 0.2, t);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={230} text="YOUR FIRST SCHOOL FRIEND" col={P.cream} size={46} pop={t / 0.25} />
    <rect x={120} y={340} width={840} height={300} fill="#24301f" {...ink(10)} />
    <text x={540} y={520} textAnchor="middle" fontFamily={BEB} fontSize="120" fill={P.cream} opacity="0.85">A B C</text>
    {[0, 1].map((r) => [0, 1, 2].map((c) => { const x = 230 + c * 310, y = 860 + r * 280, me = r === 0 && c === 1;
      return (<g key={r + '' + c}>{me && <circle cx={x} cy={y - 20} r={150} fill={P.yel} opacity={0.35 * g} />}
        <rect x={x - 120} y={y - 20} width={240} height={34} fill={me ? P.yel : P.cream} {...ink(6)} />
        <rect x={x - 100} y={y + 14} width={20} height={120} fill={P.blk} /><rect x={x + 80} y={y + 14} width={20} height={120} fill={P.blk} /></g>); }))}
    <RMChip x={540} y={1360} text="WHERE DID THEY SIT?" col={P.yel} size={42} pop={(t - c4 + 0.1) / 0.25} /></g>);
}
/* 8 — the turn: Lila has moved to a far desk; Mae walks over anyway with two mugs */
function RPMove({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.4), walk = SM(0.6, c2 + 0.3, t);
  const mug = (x, y) => (<g transform={`translate(${x} ${y})`}><rect x={-26} y={-34} width={52} height={64} fill={P.cream} {...ink(5)} /><path d="M26 -20 q26 0 26 20 q0 20 -26 20" fill="none" {...ink(6)} />
    {[0, 1].map((i) => <path key={i} d={`M${-10 + i * 18} -44 q-10 -16 0 -32`} fill="none" stroke={P.cream} strokeWidth="5" opacity={0.5 + 0.5 * osc(T, 0.8, i)} />)}</g>);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={230} text="NEW DESK · OTHER END" col={P.cream} size={48} pop={t / 0.25} />
    <RMLila x={830} y={790} s={0.36} mouth={walk > 0.9 ? 'smile' : 'flat'} brow="up" lid={0.25} look={[-0.7, 0]} />
    <Desk x={830} y={1060} w={360} col={P.redD} />
    <rect x={740} y={980} width={120} height={80} fill="#c9a36b" {...ink(5)} />
    <g transform={`translate(${lp(120, 560, walk)} ${Math.abs(osc(T, 0.5)) * -14})`}>
      <RMMae x={0} y={760} s={0.36} mouth="smile" brow="flat" lid={0.25} look={[0.7, 0]} />{mug(150, 1010)}{mug(220, 1030)}</g>
    <RMChip x={540} y={1330} text="ANYWAY." col={P.yel} size={56} pop={(t - c2) / 0.25} /></g>);
}
/* 9 — payoff: a die (chance → MEET) and a heart (choice → STAYS) */
function RPChoice({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1), roll = (1 - SM(0, 0.8, t)) * 360;
  return (<g><RMBg kind="blue" />
    <g transform={`translate(300 760) rotate(${roll + osc(T, 2) * 4})`}>
      <rect x={-130 + 12} y={-130 + 12} width={260} height={260} rx={30} fill={P.blk} /><rect x={-130} y={-130} width={260} height={260} rx={30} fill={P.cream} {...ink(8)} />
      {[[-65, -65], [65, -65], [0, 0], [-65, 65], [65, 65]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={24} fill={P.red} />)}</g>
    <RMChip x={300} y={1040} text="CHANCE: WHO YOU MEET" col={P.cream} size={34} pop={t / 0.25} />
    <Heart x={790} y={790} s={2.4 + 0.08 * osc(T, 0.9)} k={(t - c2 + 0.1) / 0.35} />
    <RMChip x={790} y={1040} text="YOU: WHO STAYS" col={P.yel} size={34} pop={(t - c2) / 0.25} /></g>);
}
/* 10 — end: two desks, title + send line */
function RPEnd({ T, t, beats }) {
  return (<g><RMBg kind="red" />
    <RMTitle lines={[['MET YOURS', P.cream, 140], ['BY CHANCE?', P.yel, 140]]} y={250} a={EO(t / 0.35)} />
    <RMLila x={330} y={720} s={0.36} mouth="smile" brow="up" lid={0.2} look={[0.6, 0]} />
    <RMMae x={750} y={720} s={0.36} mouth="smile" brow="flat" lid={0.25} look={[-0.6, 0]} />
    <Desk x={330} y={1000} w={380} /><Desk x={750} y={1000} w={380} col={P.redD} />
    <Heart x={540} y={600 + osc(T, 1.2) * 10} s={0.8} k={(t - 0.4) / 0.3} />
    <RMChip x={540} y={1320} text="SEND IT TO YOUR NEXT-DESK FRIEND" col={P.yel} size={36} pop={(t - 1.6) / 0.25} /></g>);
}

Object.assign(window, { RPDesks, RPHumour, RPDoor, RPHousing, RPStairs, RPEffect, RPSchool, RPMove, RPChoice, RPEnd });
})();
