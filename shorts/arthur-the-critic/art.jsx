// art.jsx — "Why One Insult Beats Ten Compliments" (Arthur ep. 1, retro modern illustration). Reference example for
// format "retro". Every scene draws the full 1080×1920 frame with retro-kit.jsx; retro-engine adds the stipple texture,
// vignette and captions (centre y ≈ 1540, keep faces out of y ≈ 1420–1660 unless the line sets "capY").
// Props: T, t (s into scene), dur, beats (each caption chunk's start within the scene).
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BADGES = [[170, 330], [900, 300], [110, 700], [970, 680], [250, 1080], [860, 1050], [420, 230], [690, 210], [110, 1300], [980, 1290]];

/* 1 — ten smiley badges pop around Arthur… then one jagged "COULD BE BETTER." */
function RMHook({ T, t, beats }) {
  const c = bt(beats, 3), bad = t >= c, lt = t - c;
  const n = Math.min(10, Math.max(0, Math.floor((t - 0.15) / 0.12) + 1));
  return (<g><RMBg kind="red" />
    <RMArthur x={540} y={980} s={1.05} mouth={bad ? 'frown' : 'smile'} brow={bad ? 'sad' : 'up'} lid={bad ? 0.35 : 0.15} look={bad ? [0.6, -0.4] : [0, -0.2]} />
    <g opacity={bad ? 1 - SM(0, 0.4, lt) : 1}>{BADGES.map(([x, y], i) => <RMBadge key={i} x={x} y={y + Math.sin(T * 2 + i) * 8 + (bad ? lt * 200 : 0)} k={(t - 0.15 - i * 0.12) / 0.25} />)}</g>
    {!bad && <RMChip x={540} y={170} text={'COMPLIMENTS: ' + n} pop={t / 0.2} size={48} />}
    {bad && <RMSpeech x={700} y={330} text='"COULD BE BETTER."' k={(lt - 0.05) / 0.3} />}</g>);
}

/* 2 — 2:00 AM: Arthur wide awake on a grid-paper pillow under a hanging bulb */
function RMNight({ T, t }) {
  return (<g><RMBg kind="dark" /><RMBulb x={760} y={420} T={T} />
    <RMGrid x={80} y={860} w={920} h={520} />
    <RMArthur x={470} y={1140} s={0.72} rot={-1.45} body={false} brow="sad" lid={0} wide look={[0.4, -1]} stress />
    <path d="M-40 1300 L1120 1260 L1120 2000 L-40 2000 Z" fill={P.blk} />
    {[...Array(6)].map((_, k) => <path key={k} d={`M0 ${1330 + k * 60} Q540 ${1290 + k * 60} 1100 ${1310 + k * 60}`} fill="none" stroke={P.pink} strokeOpacity="0.35" strokeWidth="3" />)}
    <RMChip x={540} y={200} text="2:00 AM" col={P.cream} size={56} pop={t / 0.2} /></g>);
}

/* 3 — the Critic rises into frame, opens his eyes, grins */
function RMMeet({ T, t }) {
  return (<g><RMBg kind="redDark" />
    <RMCritic x={540} y={lp(1250, 980, EO(t / 0.6))} s={1.15} mouth={t > 0.9 ? 'grin' : 'flat'} blink={t < 0.5 ? 1 - SM(0.3, 0.5, t) : (T % 3.4 > 3.28 ? 1 : 0)} look={[0, 0.3]} lid={0.45} />
    <RMChip x={540} y={230} text="THE CRITIC" col={P.cream} size={52} pop={(t - 0.3) / 0.25} /></g>);
}

/* 4 — his long hand presses Arthur's brain (sparks) → Arthur jolts */
function RMZap({ T, t, beats }) {
  const c = bt(beats, 2);
  if (t < c) { const press = SM(c - 0.6, c - 0.35, t);
    return (<g><RMBg kind="red" /><RMBrain cx={540} cy={1250} w={620} h={520} seed={3} />
      <RMHand x={540} y={lp(300, 560, press)} s={1.2} rot={0.02} press={press} />
      {press > 0.5 && [...Array(9)].map((_, i) => <RMBolt key={i} x={540 + (i - 4) * 20} y={820} len={160 + (i % 3) * 50} ang={Math.PI * 0.25 + i * Math.PI * 0.07} seed={i} T={T} />)}
      {press > 0.5 && <rect x="-300" y="-300" width="1680" height="2520" fill={P.cyan} opacity={0.12 * (0.5 + 0.5 * Math.sin(T * 90))} />}</g>); }
  const lt = t - c, sh = Math.sin(lt * 60) * 10 * Math.exp(-lt * 3);
  return (<g><RMBg kind="red" /><RMArthur x={540 + sh} y={1000} s={1.05} mouth="open" brow="angry" lid={0} wide stress />
    {[...Array(10)].map((_, i) => { const a = -Math.PI + i * Math.PI / 9; return <RMBolt key={i} x={540 + Math.cos(a) * 300} y={640 + Math.sin(a) * 260} len={140} ang={a} seed={i + 20} T={T} />; })}
    <RMHand x={300} y={lp(-200, 40, EO(lt / 0.4))} s={0.9} rot={-0.2} press={1} /></g>);
}

/* 5 — the comment on a loop: rotating rings of "COULD BE BETTER", a cyan tear, the Critic patting his head */
function RMReplay({ T, t }) {
  return (<g><RMBg kind="red" waves={false} /><RMLoopRings T={t} text="COULD BE BETTER" />
    <RMArthur x={540} y={1000} s={0.95} mouth="frown" brow="sad" lid={0.4} look={[0, 0.3]} tear={t} stress />
    <RMHand x={780} y={lp(-300, 380, EO(t / 0.5))} s={0.9} rot={0.5} press={0.6} /></g>);
}

/* 6 — name it: macro of the Critic's eye, Arthur reflected in the pupil */
function RMName({ T, t }) {
  return (<g><RMEyeMacro open={EO(t / 0.5)}><RMArthur x={540} y={1010} s={0.3} mouth="frown" brow="sad" lid={0.3} /></RMEyeMacro>
    <RMTitle lines={[['NEGATIVITY', P.cream, 170], ['BIAS', P.yel, 170]]} y={230} a={EO((t - 0.6) / 0.4)} /></g>);
}

/* 7 — a scale: one small reward vs one heavy threat */
function RMWhy({ T, t }) {
  const tilt = lp(0, 0.32, EO((t - 0.4) / 0.8)) + Math.sin(T * 3) * 0.01;
  return (<g><RMBg kind="red" /><RMScale tilt={tilt}
      left={(x, y) => <g><RMFlower x={x} y={y - 10} /><RMChip x={x} y={y + 90} text="REWARD" col={P.cream} size={36} /></g>}
      right={(x, y) => <g><RMSpiky x={x} y={y - 110} /><RMChip x={x} y={y + 90} text="THREAT" size={36} /></g>} /></g>);
}

/* 8 — a wilting flower (no harm) vs a bush whose eyes open (danger) */
function RMBushScene({ T, t, beats }) {
  const dang = SM(bt(beats, 2), bt(beats, 2) + 0.25, t);
  return (<g><RMBg kind="redDark" />
    <RMFlower x={260} y={1250} stem={180} droop={SM(0.3, 1.2, t)} s={0.85} />
    <RMBush x={770} y={1050} eyes={dang} />
    {dang > 0 && <rect x="-300" y="-300" width="1680" height="2520" fill="#000" opacity={0.35 * dang} />}
    <rect x="-300" y="1320" width="1680" height="900" fill={P.redD} /></g>);
}

/* 9 — the Critic, softer, holding up a ringing antique alarm clock */
function RMOldAlarm({ T, t }) {
  return (<g><RMBg kind="red" /><RMCritic x={540} y={1050} s={0.95} mouth="flat" sad lid={0.55} look={[0, -0.6]} blink={T % 3.1 > 2.98 ? 1 : 0} />
    <RMAlarm x={540} y={470} T={T} />
    <RMChip x={540} y={1260} text="FACTORY SETTING" col={P.cream} size={38} pop={(t - 0.6) / 0.25} /></g>);
}

/* 10 — Arthur squares up to the Critic → PART 2 */
function RMCliff({ T, t, beats, dur }) {
  const turn = bt(beats, 2), end = turn + 0.9, k = EO((t - end) / 0.35);
  return (<g><RMBg kind="redDark" />
    <RMCritic x={760} y={700} s={0.85} mouth={t > turn ? 'o' : 'grin'} look={[-0.7, 0.6]} lid={0.4} pin={t > turn} />
    <RMArthur x={330} y={1300} s={0.95} mouth={t > turn ? 'shout' : 'flat'} brow="angry" lid={0.1} look={[0.9, -0.8]} />
    {t > end && <g><rect x="-300" y="-300" width="1680" height="2520" fill={P.blk} opacity={0.6 * k} />
      <RMTitle lines={[['PART 2', P.yel, 240], ["FOLLOW SO YOU DON'T MISS IT", P.cream, 70]]} y={800} a={k} /></g>}</g>);
}

Object.assign(window, { RMHook, RMNight, RMMeet, RMZap, RMReplay, RMName, RMWhy, RMBushScene, RMOldAlarm, RMCliff });
})();
