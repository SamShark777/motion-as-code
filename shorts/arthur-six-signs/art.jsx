// art.jsx — "6 Signs You Think Everyone's Watching You" (Arthur, with Mae + The Critic; retro modern illustration).
// Signs-list experiment (Shivam 2026-11-05, competitor scan). Spotlight effect: Gilovich, Medvec & Savitsky 2000, JPSP —
// students in an embarrassing T-shirt guessed about half the room noticed; only about a quarter did.
// Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540; keep faces/numbers out of 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, eo: EO, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif", OSW = "'Oswald', sans-serif";

// big numbered sign card at the top: number badge + short label
function SignCard({ n, label, t, col = P.yel }) {
  const k = EO(t / 0.3);
  return (<g opacity={k} transform={`translate(0 ${lp(-40, 0, k)})`}>
    <circle cx={190} cy={250} r={96} fill={P.blk} transform="translate(10 10)" /><circle cx={190} cy={250} r={96} fill={col} {...ink(8)} />
    <text x={190} y={292} textAnchor="middle" fontFamily={BEB} fontSize="130" fill={P.blk}>{n}</text>
    <text x={320} y={235} fontFamily={OSW} fontWeight="700" fontSize="46" fill={P.cream}>SIGN {n} OF 6</text>
    <text x={320} y={300} fontFamily={BEB} fontSize="62" letterSpacing="2" fill={col}>{label}</text></g>);
}
// a ring of staring eyes (the imagined audience)
function Eyes({ cx = 540, cy = 760, r = 380, n = 9, open = 1, T = 0 }) {
  return (<g>{[...Array(n)].map((_, i) => { const a = (i / n) * Math.PI * 2 + 0.3, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.75, bl = (Math.sin(T * 3 + i) > 0.97) ? 0.1 : 1;
    return (<g key={i} transform={`translate(${x} ${y})`}><ellipse rx={58} ry={34 * open * bl} fill={P.cream} {...ink(6)} />
      <circle cx={Math.cos(a + Math.PI) * 14} cy={Math.sin(a + Math.PI) * 8} r={16 * open * bl} fill={P.blk} /></g>); })}</g>);
}
function Cup({ x, y, s = 1, rot = 0, spill = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-60 -70 L60 -70 L46 70 L-46 70 Z" fill={P.cream} {...ink(7)} /><rect x={-66} y={-92} width={132} height={26} rx={8} fill={P.red} {...ink(6)} />
    {spill > 0 && <path d={`M40 -60 q${60 * spill} 20 ${110 * spill} ${140 * spill} q-30 40 -80 30`} fill="#6B3B22" {...ink(5)} />}</g>);
}
function Mirror({ x, y, s = 1, children }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx={190} ry={260} fill={P.blk} transform="translate(12 12)" />
    <ellipse rx={190} ry={260} fill={P.yel} {...ink(8)} /><ellipse rx={155} ry={222} fill={P.cyan} opacity="0.55" {...ink(6)} />{children}</g>);
}

/* 1 — hook: Arthur spills coffee in a café; a ring of eyes snaps open around him */
function RMSpillCafe({ T, t, beats }) {
  const c = bt(beats, 0, 0.3), sp = EO((t - c) / 0.5), o = EO((t - 0.6) / 0.4);
  return (<g><RMBg kind="red" />
    <Eyes cx={540} cy={820} r={420} n={10} open={o} T={T} />
    <RMArthur x={540} y={1080} s={0.62} mouth="open" brow="up" lid={0.05} look={[0, -0.2]} stress />
    <Cup x={760} y={1180} s={0.9} rot={lp(0, 70, sp)} spill={sp} />
    <RMChip x={540} y={200} text="EVERYONE SAW." col={P.cream} pop={(t - 0.5) / 0.25} size={58} /></g>);
}
/* 2 — snap to the viewer: "6 SIGNS" title, the Critic smirks; the twist promise */
function RMSixSigns({ T, t, beats }) {
  const c = bt(beats, 3, 1.8);
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['6 SIGNS', P.yel, 210], ['YOU DO THIS', P.cream, 120]]} y={260} a={EO(t / 0.35)} />
    <RMCritic x={540} y={1050} s={0.6} mouth="grin" lid={0.4} look={[0, 0.3]} />
    {t > c && <RMChip x={540} y={1330} text="+ A TWIST" col={P.yel} pop={(t - c) / 0.25} size={52} />}</g>);
}
/* 3 — sign 1: a tiny mistake on loop for days */
function RMSign1({ T, t }) {
  return (<g><RMBg kind="redDark" /><SignCard n={1} label="TINY MISTAKE, ON LOOP" t={t} />
    <RMLoopRings T={T} text="WHY DID I SAY THAT" cx={540} cy={860} />
    <RMArthur x={540} y={960} s={0.55} mouth="frown" brow="sad" lid={0.4} look={[0, -0.4]} />
    <RMChip x={540} y={1330} text="DAY 3" col={P.cream} pop={(t - 0.8) / 0.25} size={46} /></g>);
}
/* 4 — sign 2: checks the mirror before walking into a room */
function RMSign2({ T, t }) {
  const k = EO((t - 0.3) / 0.5);
  return (<g><RMBg kind="blue" /><SignCard n={2} label="MIRROR CHECK. AGAIN." t={t} col={P.pink} />
    <Mirror x={720} y={860} s={0.95}><g transform={`translate(0 40) scale(${lp(0.8, 1, k)})`}><RMArthur x={0} y={120} s={0.42} body={false} mouth="flat" brow="sad" lid={0.3} look={[-0.6, 0]} /></g></Mirror>
    <RMArthur x={260} y={1150} s={0.55} mouth="flat" brow="up" lid={0.2} look={[0.9, -0.2]} /></g>);
}
/* 5 — sign 3: one bad hair day ruins the mood (a single hair sticks up; a raincloud over Arthur) */
function RMSign3({ T, t }) {
  const k = EO((t - 0.4) / 0.5);
  return (<g><RMBg kind="red" /><SignCard n={3} label="BAD HAIR, BAD DAY" t={t} col={P.cream} />
    <RMArthur x={540} y={1100} s={0.62} mouth="frown" brow="sad" lid={0.45} look={[0, -0.6]} />
    <path d={`M560 ${lp(560, 470, k)} q30 -60 0 -110`} fill="none" stroke={P.blk} strokeWidth="9" strokeLinecap="round" />
    <g opacity={k} transform="translate(540 430)"><ellipse rx={190} ry={80} fill={P.blue} {...ink(7)} />
      {[...Array(7)].map((_, i) => { const ph = (T * 1.6 + i * 0.17) % 1; return <line key={i} x1={-150 + i * 50} y1={80 + ph * 160} x2={-158 + i * 50} y2={110 + ph * 160} stroke={P.cyan} strokeWidth="7" strokeLinecap="round" />; })}</g></g>);
}
/* 6 — sign 4: rehearsing a two-word order for the waiter */
function RMSign4({ T, t }) {
  const n = Math.floor(cl(t / 2.4) * 4);
  return (<g><RMBg kind="blue" /><SignCard n={4} label="REHEARSING THE ORDER" t={t} col={P.yel} />
    <RMArthur x={330} y={1150} s={0.58} mouth="open" brow="sad" lid={0.2} look={[0.7, -0.3]} />
    <RMSpeech x={650} y={560} text={['"A LATTE…"', '"ONE LATTE."', '"A LATTE, PLEASE."', '"…HI."'][n]} size={64} k={t / 0.3} />
    <RMChip x={760} y={1250} text={`TAKE ${n + 1}`} col={P.cream} pop={(t - 0.3) / 0.25} size={46} /></g>);
}
/* 7 — sign 5: one weird look keeps him up all night */
function RMSign5({ T, t }) {
  return (<g><RMBg kind="redDark" /><SignCard n={5} label="ONE LOOK, ALL NIGHT" t={t} col={P.pink} />
    <rect x={120} y={980} width={840} height={150} rx={30} fill={P.blue} {...ink(8)} /><rect x={150} y={900} width={260} height={110} rx={40} fill={P.cream} {...ink(7)} />
    <RMArthur x={560} y={1010} s={0.5} body={false} mouth="flat" brow="sad" lid={0.0} look={[0, -1]} />
    <RMAlarm x={840} y={600} T={T} ring={0} s={0.45} />
    <RMChip x={840} y={760} text="3:12 AM" col={P.cream} pop={(t - 0.4) / 0.25} size={44} /></g>);
}
/* 8 — sign 6: sure everyone still remembers his worst moment (a giant replay screen in the sky) */
function RMSign6({ T, t }) {
  return (<g><RMBg kind="red" /><SignCard n={6} label="THEY STILL REMEMBER" t={t} col={P.yel} />
    <g transform="translate(540 700)"><rect x={-330 + 14} y={-190 + 14} width={660} height={380} fill={P.blk} /><rect x={-330} y={-190} width={660} height={380} fill={P.blue} {...ink(8)} />
      <Cup x={0} y={10} s={1.1} rot={70} spill={1} /><text x={-300} y={-140} fontFamily={OSW} fontWeight="700" fontSize="34" fill={P.cream}>2019 · REPLAY</text></g>
    <RMArthur x={540} y={1180} s={0.5} mouth="frown" brow="sad" lid={0.3} look={[0, -1]} /></g>);
}
/* 9 — the study: the embarrassing T-shirt, two bars: GUESSED ~HALF vs ACTUAL ~A QUARTER */
function RMShirtStudy({ T, t, beats }) {
  const c = bt(beats, 4, 2.6), a = EO((t - 0.6) / 0.8), b = EO((t - c) / 0.8);
  return (<g><RMBg kind="blue" /><RMChip x={540} y={190} text="CORNELL · 2000" pop={t / 0.25} size={46} />
    <g transform="translate(300 620)"><path d="M-170 -150 L-60 -190 Q0 -150 60 -190 L170 -150 L210 -40 L130 -10 L130 200 L-130 200 L-130 -10 L-210 -40 Z" fill={P.yel} {...ink(8)} />
      <circle cx={0} cy={40} r={70} fill={P.pink} {...ink(6)} /><text x={0} y={150} textAnchor="middle" fontFamily={BEB} fontSize="48" fill={P.blk}>CRINGE</text></g>
    {[['GUESSED', P.cream, 0.5 * a, 'ABOUT HALF', 960], ['ACTUAL', P.yel, 0.25 * b, 'ABOUT 1 IN 4', 1150]].map(([l, col, k, v, y]) => (<g key={l}>
      <text x={100} y={y - 20} fontFamily={OSW} fontWeight="700" fontSize="40" fill={P.cream}>{l}</text>
      <rect x={100} y={y} width={880} height={80} fill={P.blueD} {...ink(6)} /><rect x={100} y={y} width={880 * k * 2} height={80} fill={col} {...ink(6)} />
      {k > 0.01 && <text x={120 + 880 * k * 2} y={y + 58} fontFamily={BEB} fontSize="54" fill={P.cream}>{v}</text>}</g>))}
    <g transform="translate(790 560)"><RMArthur x={0} y={0} s={0.34} body={false} mouth={t > c ? 'open' : 'frown'} brow={t > c ? 'up' : 'sad'} lid={0.1} look={[-0.6, 0.4]} /></g></g>);
}
/* 10 — name it: SPOTLIGHT EFFECT; a stage spotlight that is much smaller than Arthur thinks */
function RMNameSpotlight({ T, t }) {
  const k = EO((t - 0.5) / 0.8);
  return (<g><RMBg kind="redDark" />
    <RMTitle lines={[['THE SPOTLIGHT', P.cream, 130], ['EFFECT', P.yel, 190]]} y={230} a={EO(t / 0.35)} />
    <path d={`M540 560 L${lp(140, 400, k)} 1240 L${lp(940, 680, k)} 1240 Z`} fill={P.yel} opacity="0.35" />
    <ellipse cx={540} cy={1240} rx={lp(400, 140, k)} ry={lp(70, 26, k)} fill={P.yel} opacity="0.55" />
    <RMArthur x={540} y={1200} s={0.52} mouth="flat" brow="up" lid={0.2} look={[0, -0.8]} /></g>);
}
/* 11 — reframe: everyone has their own little spotlight; Mae winks, Arthur relaxes */
function RMOwnSpotlights({ T, t, beats }) {
  const c = bt(beats, 3, 2.0);
  return (<g><RMBg kind="blue" />
    {[[200, 'mae'], [540, 'arthur'], [880, 'lila']].map(([x, w], i) => (<g key={w}>
      <ellipse cx={x} cy={1190} rx={140} ry={30} fill={P.yel} opacity="0.5" /><path d={`M${x} 560 L${x - 130} 1190 L${x + 130} 1190 Z`} fill={P.yel} opacity="0.18" />
      <RMHuman who={w} x={x} y={1150} s={0.4} mouth={i === 1 ? (t > c ? 'smile' : 'flat') : 'flat'} brow="up" lid={0.3} look={[i === 0 ? 0.3 : -0.3, 0.6]} /></g>))}
    {t > c && <RMChip x={540} y={300} text="YOU'RE FREE" col={P.yel} pop={(t - c) / 0.25} size={64} />}</g>);
}
/* 12 — end card: SEND THIS → the friend who checked all 6 (a tick list) */
function RMEndSend({ T, t }) {
  return (<g><RMBg kind="red" />
    <rect x={150 + 14} y={420 + 14} width={780} height={760} fill={P.blk} /><rect x={150} y={420} width={780} height={760} fill={P.cream} {...ink(8)} />
    {[...Array(6)].map((_, i) => { const k = EO((t - 0.2 - i * 0.18) / 0.25);
      return (<g key={i}><rect x={210} y={480 + i * 112} width={70} height={70} fill={P.cream} {...ink(6)} />
        {k > 0 && <path d={`M222 ${515 + i * 112} l20 22 l${32 * k} ${-44 * k}`} fill="none" stroke={P.red} strokeWidth="11" strokeLinecap="round" />}
        <rect x={310} y={500 + i * 112} width={540 - (i % 3) * 70} height={26} fill={P.blk} opacity="0.2" /></g>); })}
    <RMChip x={540} y={240} text="SEND THIS" col={P.yel} pop={(t - 1.2) / 0.25} size={70} />
    <RMArthur x={850} y={1290} s={0.36} body={false} mouth="smile" brow="up" lid={0.2} look={[-0.6, -0.4]} /></g>);
}

Object.assign(window, { RMSpillCafe, RMSixSigns, RMSign1, RMSign2, RMSign3, RMSign4, RMSign5, RMSign6, RMShirtStudy, RMNameSpotlight, RMOwnSpotlights, RMEndSend });
})();
