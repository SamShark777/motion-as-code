// art.jsx — "Say the Colour, Not the Word" (Otto ep. 1 + Lila, retro modern illustration). Full 1080×1920 frames with
// retro-kit.jsx; retro-engine adds grain, vignette and captions (centre y ≈ 1540 unless the line sets capY).
// Props: T, t (s into scene), dur, beats (each caption chunk's start within the scene).
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const CW = [['BLUE', P.yel], ['RED', P.blue], ['YELLOW', P.pink], ['PINK', P.red], ['RED', P.yel], ['BLUE', P.red]];
const FONT = "'Oswald', sans-serif";

// a cream card with a hard black shadow showing a colour word in a clashing ink
function Card({ x, y, word, ink, s = 1, rot = 0, k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * BK(k)})`}>
    <rect x="-260" y="-150" width="520" height="300" fill={P.blk} transform="translate(18 18)" />
    <rect x="-260" y="-150" width="520" height="300" fill={P.cream} stroke={P.blk} strokeWidth="8" />
    <text y={word.length > 4 ? 52 : 62} textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize={word.length > 4 ? 150 : 180} fill={ink} stroke={P.blk} strokeWidth="5" paintOrder="stroke">{word}</text></g>);
}

/* 1 — hook: Otto, certain no test can trick him */
function STHook({ T, t, beats }) {
  return (<g><RMBg kind="red" />
    <RMOtto x={540} y={1000} s={1.05} mouth="smile" brow="up" lid={0.45} look={[0.2, -0.1]} />
    <RMChip x={540} y={190} text="OTTO · THE BOSS" pop={t / 0.2} size={50} />
    <RMSpeech x={640} y={420} text='"NOTHING TRICKS ME."' k={(t - bt(beats, 1) + 0.1) / 0.3} size={62} /></g>);
}

/* 2 — Lila holds up one card: RED, printed in blue */
function STCard({ T, t, beats }) {
  return (<g><RMBg kind="blue" />
    <Card x={560} y={600} word="RED" ink={P.blue} k={(t - 0.3) / 0.35} rot={-3 + OS(T, 2.5) * 1.5} />
    <RMLila x={360} y={1200} s={0.9} mouth="smile" brow="up" lid={0.2} look={[0.6, -0.6]} />
    <RMChip x={540} y={190} text="SAY THE COLOUR" col={P.cream} pop={(t - bt(beats, 2)) / 0.25} size={50} /></g>);
}

/* 3 — the viewer's turn: cards flip fast, full frame */
function STQuiz({ T, t, dur }) {
  const i = Math.max(0, Math.min(CW.length - 1, Math.floor(t / 0.42))), lt = Math.max(0, t - i * 0.42);
  return (<g><RMBg kind="dark" waves={false} />
    <Card x={540} y={900} word={CW[i][0]} ink={CW[i][1]} s={1.55} rot={(i % 2 ? 2 : -2)} k={lt / 0.12} />
    <RMChip x={540} y={240} text={`YOUR TURN · ${i + 1}/${CW.length}`} col={P.yel} pop={t / 0.2} size={50} />
    <RMAlarm x={900} y={1380} T={T} s={0.7} ring={1} /></g>);
}

/* 4 — Otto reads the word every time: shouts the wrong answer */
function STFail({ T, t, beats }) {
  const sh = Math.sin(t * 50) * 8 * Math.exp(-t * 2);
  return (<g><RMBg kind="red" />
    <Card x={300} y={330} word="BLUE" ink={P.yel} s={0.55} rot={-6} />
    <RMOtto x={540 + sh} y={1000} s={1.05} mouth="shout" brow="angry" lid={0} wide stress />
    <RMSpeech x={760} y={360} text='"BLUE!"' k={(t - 0.1) / 0.25} size={96} col={P.blue} />
    {t > bt(beats, 1) && <g transform={`translate(760 360) scale(${BK((t - bt(beats, 1)) / 0.3)})`}>
      <path d="M-120 -120 L120 120 M120 -120 L-120 120" stroke={P.blk} strokeWidth="44" strokeLinecap="round" />
      <path d="M-120 -120 L120 120 M120 -120 L-120 120" stroke={P.cream} strokeWidth="26" strokeLinecap="round" /></g>}
    {[...Array(8)].map((_, i) => { const a = -Math.PI + i * Math.PI / 7; return <RMBolt key={i} x={540 + Math.cos(a) * 320} y={660 + Math.sin(a) * 260} len={120} ang={a} seed={i + 5} T={T} />; })}</g>);
}

/* 5 — 1935: John Ridley Stroop times a hundred students */
function STStudy({ T, t }) {
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={200} text="J. R. STROOP · 1935" col={P.cream} pop={t / 0.2} size={50} />
    <g transform="translate(540 850) rotate(-2)"><rect x="-380" y="-330" width="760" height="660" fill={P.blk} transform="translate(20 20)" />
      <rect x="-380" y="-330" width="760" height="660" fill={P.cream} stroke={P.blk} strokeWidth="8" />
      {[...Array(20)].map((_, i) => { const w = CW[(i * 5 + 1) % CW.length], k = cl((t - 0.2 - i * 0.05) / 0.2);
        return <text key={i} x={-330 + (i % 4) * 175} y={-230 + Math.floor(i / 4) * 120} fontFamily={FONT} fontWeight="700" fontSize="46" fill={w[1]} opacity={k}>{w[0]}</text>; })}</g>
    <RMAlarm x={230} y={1330} T={T} s={0.75} ring={0.6} />
    <RMChip x={720} y={1330} text="100 STUDENTS" col={P.yel} pop={(t - 0.8) / 0.25} size={48} /></g>);
}

/* 6 — the result: clashing ink took ~74% longer */
function STStat({ T, t, beats }) {
  const g = EO((t - 0.2) / 1.2), e = bt(beats, beats.length - 2, 2);
  const bar = (x, h, col, lab) => (<g><rect x={x - 130} y={1250 - h * g} width="260" height={h * g} fill={P.blk} transform="translate(16 0)" />
    <rect x={x - 130} y={1250 - h * g} width="260" height={h * g} fill={col} stroke={P.blk} strokeWidth="7" />
    <RMChip x={x} y={1320} text={lab} col={P.cream} size={34} /></g>);
  const k = BK((t - e) / 0.35);
  return (<g><RMBg kind="redDark" />
    {bar(310, 380, P.blue, 'COLOUR PATCHES')}{bar(770, 660, P.yel, 'CLASHING WORDS')}
    <rect x="80" y="1250" width="920" height="10" fill={P.blk} />
    {k > 0 && <g transform={`translate(330 560) rotate(-8) scale(${k})`}><RMBadge x={0} y={0} r={150} k={1} col={P.cream} />
      <text y="38" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="84" fill={P.red} stroke={P.blk} strokeWidth="4" paintOrder="stroke">+74%</text></g>}</g>);
}

/* 7 — the turn: a switch in Otto's brain stuck on READING; a hand can't flip it */
function STSwitch({ T, t, beats }) {
  const tug = Math.max(0, Math.sin(t * 9)) * SM(0.4, 0.8, t);
  return (<g><RMBg kind="red" />
    <RMBrain cx={540} cy={1130} w={720} h={600} seed={7} />
    <g transform="translate(540 1050)"><rect x="-150" y="-200" width="300" height="400" fill={P.blk} transform="translate(16 16)" />
      <rect x="-150" y="-200" width="300" height="400" fill={P.cream} stroke={P.blk} strokeWidth="8" />
      <rect x="-40" y="-140" width="80" height="280" rx="40" fill={P.blk} />
      <g transform={`translate(0 ${-80 + tug * 18})`}><rect x="-70" y="-50" width="140" height="100" fill={P.yel} stroke={P.blk} strokeWidth="7" /></g>
      <text y="180" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="44" fill={P.blk}>READING: ON</text></g>
    <RMHand x={600} y={lp(200, 520, EO(t / 0.5)) + tug * 30} s={1} rot={0.15} press={tug} />
    {t > bt(beats, 3) && [...Array(6)].map((_, i) => <RMBolt key={i} x={540 + (i - 2.5) * 60} y={820} len={110} ang={-Math.PI / 2 + (i - 2.5) * 0.3} seed={i + 30} T={T} />)}
    <RMChip x={540} y={200} text="AUTOMATIC" pop={(t - bt(beats, 3)) / 0.25} size={54} /></g>);
}

/* 8 — name it: macro eye, the clashing word in the pupil */
function STName({ T, t }) {
  return (<g><RMEyeMacro open={EO(t / 0.5)}>
      <text x="540" y="1050" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="120" fill={P.yel} stroke={P.blk} strokeWidth="5" paintOrder="stroke">RED</text></RMEyeMacro>
    <RMTitle lines={[['STROOP', P.cream, 170], ['EFFECT', P.yel, 170]]} y={230} a={EO((t - 0.4) / 0.4)} /></g>);
}

/* 9 — payoff: Otto's problem is being too good at reading; Lila grins */
function STPayoff({ T, t, beats }) {
  const e = bt(beats, beats.length - 2, 1.5);
  return (<g><RMBg kind="redDark" />
    <RMOtto x={380} y={1040} s={0.85} mouth={t > e ? 'smile' : 'flat'} brow={t > e ? 'up' : 'sad'} lid={0.35} look={[0.6, 0]} />
    <RMLila x={800} y={1180} s={0.7} mouth="open" brow="up" lid={0.2} look={[-0.7, 0]} />
    <Card x={540} y={360} word="GENIUS" ink={P.pink} s={0.8} rot={4} k={(t - e) / 0.35} />
    <RMChip x={540} y={150} text="TOO GOOD AT READING" col={P.yel} pop={(t - e) / 0.25} size={46} /></g>);
}

Object.assign(window, { STHook, STCard, STQuiz, STFail, STStudy, STStat, STSwitch, STName, STPayoff });
})();
