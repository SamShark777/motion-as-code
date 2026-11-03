// art.jsx — "They Liked You More Than You Think" (Mae ep. 4, retro modern illustration). The liking gap
// (Boothby, Cooney, Sandstrom & Clark 2018). Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
// the new neighbour (an extra, drawn with the kit's human)
const NB = { skin: P.pink, skinD: P.pinkD, hair: 'curly', hairCol: P.blk, moustache: false, jacket: P.blue };

// apartment door frame
function Door({ x, y, w = 300, h = 640, col = P.blue }) {
  return (<g><rect x={x - w / 2 - 30} y={y - h - 30} width={w + 60} height={h + 30} fill={P.blk} />
    <rect x={x - w / 2} y={y - h} width={w} height={h} fill={col} {...ink(6)} />
    <circle cx={x + w / 2 - 40} cy={y - h / 2} r={14} fill={P.yel} {...ink(4)} /></g>);
}
// little "blah" dashes between two talkers
function Chatter({ x, y, t }) {
  return <g>{[0, 1, 2].map((k) => { const kk = ((t * 1.3 + k / 3) % 1); return <rect key={k} x={x - 60 + kk * 120} y={y + k * 34 - 34} width={50} height={14} rx={7} fill={P.cream} opacity={1 - Math.abs(kk - 0.5) * 2} />; })}</g>;
}

/* 1 — Mae and the new neighbour in the hallway, chatting; a 5:00 chip counts */
function RMMeetNeighbour({ T, t }) {
  const s = Math.min(300, Math.floor(t * 40));
  return (<g><RMBg kind="red" />
    <Door x={220} y={1280} /><Door x={860} y={1280} col={P.yel} />
    <rect x="-300" y="1280" width="1680" height="900" fill={P.redD} />
    <RMMae x={300} y={900} s={0.62} mouth="smile" brow="up" lid={0.2} look={[0.8, 0]} />
    <RMHuman x={790} y={900} s={0.62} who={NB} mouth="smile" brow="flat" lid={0.25} look={[-0.8, 0]} />
    <Chatter x={545} y={720} t={t} />
    <RMChip x={540} y={220} text={`SMALL TALK · ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`} pop={t / 0.2} size={46} /></g>);
}

/* 2 — night; the Critic rises behind Mae and opens his eyes */
function RMCriticArrives({ T, t, beats }) {
  const up = EO((t - 0.2) / 0.7);
  return (<g><RMBg kind="dark" /><RMBulb x={820} y={300} T={T} />
    <RMCritic x={540} y={lp(1300, 760, up)} s={0.95} mouth={t > bt(beats, 2) ? 'grin' : 'flat'} lid={0.45} blink={t < 0.9 ? 1 - SM(0.6, 0.9, t) : 0} look={[0, 0.5]} />
    <RMMae x={540} y={1150} s={0.8} mouth="flat" brow="flat" lid={0.3} look={[0, 0]} />
    {t > bt(beats, 2) && <RMChip x={540} y={200} text="▶ REPLAY" col={P.cream} size={52} pop={(t - bt(beats, 2)) / 0.25} />}</g>);
}

/* 3 — the Critic's verdict loops round Mae */
function RMAwfulJoke({ T, t, beats }) {
  const c = bt(beats, 3);
  return (<g><RMBg kind="red" waves={false} /><RMLoopRings T={t} text="YOU TALKED TOO MUCH" cx={540} cy={920} />
    <RMMae x={540} y={1000} s={0.9} mouth="frown" brow="sad" lid={0.35} look={[0.3, 0.4]} tear={t > c ? t - c : null} stress />
    <RMHand x={800} y={lp(-300, 360, EO(t / 0.5))} s={0.9} rot={0.5} press={0.6} />
    {t > c && <RMSpeech x={560} y={300} text='"AWFUL."' k={(t - c) / 0.3} size={110} />}</g>);
}

/* 4 — bedtime: Mae awake on a grid pillow, 11:48 PM, the neighbour's door in her head */
function RMBedtime({ T, t }) {
  return (<g><RMBg kind="dark" /><RMBulb x={760} y={420} T={T} />
    <RMGrid x={80} y={860} w={920} h={520} />
    <RMMae x={470} y={1140} s={0.72} rot={-1.45} body={false} brow="sad" lid={0} wide look={[0.4, -1]} stress />
    <path d="M-40 1300 L1120 1260 L1120 2000 L-40 2000 Z" fill={P.green} />
    {[...Array(6)].map((_, k) => <path key={k} d={`M0 ${1330 + k * 60} Q540 ${1290 + k * 60} 1100 ${1310 + k * 60}`} fill="none" stroke={P.blk} strokeOpacity="0.3" strokeWidth="3" />)}
    <RMChip x={540} y={200} text="11:48 PM" col={P.cream} size={56} pop={t / 0.2} />
    <RMSpeech x={720} y={560} text="HE HATES ME" k={(t - 0.6) / 0.3} size={70} col={P.pink} rot={0.05} /></g>);
}

/* 5 — the study: pairs of strangers chatting on a grid sheet */
function RMStudyPairs({ T, t, beats }) {
  const PAIRS = [[300, 640], [300, 1020], [780, 640], [780, 1020]];
  const SK = [[P.pink, P.pinkD], [P.yel, '#D9A62A'], [P.cream, '#D9C2A0']];
  return (<g><RMBg kind="blue" /><RMGrid x={70} y={400} w={940} h={900} />
    <RMChip x={540} y={240} text="PSYCHOLOGICAL SCIENCE · 2018" pop={t / 0.25} size={40} />
    {PAIRS.map(([x, y], i) => { const k = BK((t - bt(beats, 1) - i * 0.12) / 0.3); if (k <= 0) return null;
      return (<g key={i} transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
        {[-1, 1].map((sd) => { const c = SK[(i + (sd > 0 ? 1 : 0)) % 3];
          return <RMHuman key={sd} x={x + sd * 120} y={y} s={0.26} who={{ skin: c[0], skinD: c[1], hair: sd > 0 ? 'flat' : 'curly', hairCol: P.blk, moustache: false, jacket: [P.red, P.green, P.blue][(i + sd + 3) % 3] }} mouth="smile" lid={0.3} look={[-sd * 0.9, 0]} />; })}
        <Chatter x={x} y={y - 60} t={t + i} /></g>); })}
    <RMChip x={540} y={1380} text="STRANGERS · FIRST CHAT" col={P.cream} size={38} pop={(t - bt(beats, 2)) / 0.25} /></g>);
}

/* 6 — two bars: how much the partner liked them vs their guess (direction only, no numbers) */
function RMGuessLow({ T, t, beats }) {
  const c = bt(beats, 4), real = EO((t - 0.3) / 0.7), guess = t < c ? real * 0.95 : lp(real * 0.95, 0.55, EO((t - c) / 0.6));
  const bar = (x, h, col, label) => (<g><rect x={x - 130} y={1250 - 760 * h} width={260} height={760 * h} fill={col} {...ink(7)} />
    <RMChip x={x} y={1320} text={label} col={P.cream} size={34} /></g>);
  return (<g><RMBg kind="red" /><rect x="60" y="1250" width="960" height="12" fill={P.blk} />
    {bar(300, real, P.yel, 'THEY LIKED YOU')}{bar(780, guess, P.pink, 'YOUR GUESS')}
    {t > c + 0.6 && <g><path d={`M780 ${1250 - 760 * 0.55 - 40} L780 ${1250 - 760 * 0.98}`} stroke={P.blk} strokeWidth="8" strokeDasharray="20 14" />
      <RMChip x={780} y={1250 - 760 * 0.76} text="GAP" size={48} pop={(t - c - 0.6) / 0.25} /></g>}
    <RMChip x={540} y={230} text="AFTER THE CHAT" pop={t / 0.25} size={46} /></g>);
}

/* 7 — name it: the eye macro with Mae in the pupil */
function RMNameGap({ T, t }) {
  return (<g><RMEyeMacro open={EO(t / 0.5)}><RMMae x={540} y={1010} s={0.3} mouth="frown" brow="sad" lid={0.3} /></RMEyeMacro>
    <RMTitle lines={[['THE LIKING', P.cream, 170], ['GAP', P.yel, 190]]} y={210} a={EO((t - 0.4) / 0.4)} /></g>);
}

/* 8 — inside: the Critic's hand on Mae's buzzing brain → outside: the neighbour just sees her smile */
function RMInsideOutside({ T, t, beats }) {
  const c = bt(beats, 2);
  if (t < c) return (<g><RMBg kind="redDark" /><RMBrain cx={540} cy={1200} w={640} h={540} seed={5} />
    <RMHand x={540} y={560} s={1.2} rot={0.02} press={1} />
    {[...Array(9)].map((_, i) => <RMBolt key={i} x={540 + (i - 4) * 22} y={820} len={150 + (i % 3) * 50} ang={Math.PI * 0.25 + i * Math.PI * 0.07} seed={i + 7} T={T} />)}
    <RMChip x={540} y={220} text="WHAT MAE HEARS" col={P.cream} size={46} pop={t / 0.2} /></g>);
  const lt = t - c;
  return (<g><RMBg kind="red" />
    <rect x="140" y="330" width="800" height="960" fill={P.cream} {...ink(10)} /><rect x="170" y="360" width="740" height="900" fill={P.blue} />
    <RMMae x={540} y={860} s={0.85} mouth="smile" brow="up" lid={0.15} look={[0, 0]} />
    {[[220, 420], [860, 470], [230, 1150], [850, 1120]].map(([x, y], i) => <RMBadge key={i} x={x} y={y} r={55} k={(lt - 0.1 - i * 0.12) / 0.25} />)}
    <RMChip x={540} y={220} text="WHAT HE SAW" pop={lt / 0.2} size={46} /></g>);
}

/* 9 — next morning: the neighbour at her door with cookies; the Critic shrinks, mouth open */
function RMCookies({ T, t, beats }) {
  const c = bt(beats, 3), lt = t - c;
  return (<g><RMBg kind="red" />
    <Door x={760} y={1300} w={420} h={1000} col={P.yel} />
    <RMHuman x={760} y={760} s={0.62} who={NB} mouth="smile" brow="up" lid={0.2} look={[-0.9, 0.1]} />
    <rect x="-300" y="1300" width="1680" height="900" fill={P.redD} />
    <g transform={`translate(700 ${1060 + Math.sin(T * 3) * 6}) scale(${lt > -0.2 ? BK((lt + 0.2) / 0.35) : 0})`}>
      <ellipse rx="190" ry="50" fill={P.cream} {...ink(6)} />
      {[[-90, -20], [0, -35], [90, -20], [-45, -55], [45, -55]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={46} fill="#C98A3A" {...ink(5)} />
        {[0, 1, 2].map((k) => <circle key={k} cx={x - 16 + k * 16 + hsh(i * 3 + k) * 8} cy={y - 10 + hsh(i + k * 7) * 20} r={6} fill={P.blk} />)}</g>)}</g>
    <RMMae x={260} y={1020} s={0.7} mouth={lt > 0 ? 'open' : 'flat'} brow="up" lid={0} wide look={[0.9, 0.3]} />
    <RMCritic x={120} y={430} s={0.25 * (1 - SM(0, 1.2, lt) * 0.5)} mouth="o" lid={0.2} look={[1, 0.5]} body={false} />
    <RMChip x={540} y={200} text="NEXT MORNING" pop={t / 0.2} size={46} /></g>);
}

/* 3b — snapback: the Critic's replay tape gets a big WRONG stamp; he gapes */
function RMSnapWrong({ T, t, beats }) {
  const c = bt(beats, 1, 0.6), k = EO((t - c) / 0.25);
  return (<g><RMBg kind="blue" />
    <rect x="160" y="420" width="760" height="460" fill={P.blk} /><rect x="190" y="450" width="700" height="400" fill={P.cream} />
    {[0, 1].map((i) => <circle key={i} cx={380 + i * 320} cy={650} r={110} fill={P.blk} stroke={P.yel} strokeWidth="10" transform={`rotate(${T * 120 * (t < c ? 1 : 0.1)} ${380 + i * 320} 650)`} />)}
    <RMCritic x={540} y={1180} s={0.7} mouth={t > c ? 'o' : 'grin'} lid={t > c ? 0 : 0.45} look={[0, -0.6]} />
    {t > c && <g transform={`translate(540 640) rotate(-8) scale(${1.6 - 0.6 * k})`} opacity={k}>
      <rect x="-330" y="-110" width="660" height="220" fill="none" stroke={P.red} strokeWidth="22" />
      <text y="70" textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="190" fill={P.red}>WRONG</text></g>}
    <RMChip x={540} y={230} text="▶ REPLAY" col={P.cream} size={48} pop={t / 0.2} /></g>);
}

/* 10 — end: Mae smiling at her door, cookies in hand, the Critic tiny and quiet; comment prompt */
function RMEndGotMe({ T, t, beats }) {
  const c = bt(beats, 2, 1.2);
  return (<g><RMBg kind="red" />
    <RMMae x={540} y={1000} s={0.85} mouth="smile" brow="up" lid={0.15} look={[0, 0]} />
    <RMCritic x={860} y={420} s={0.2} mouth="o" lid={0.3} look={[-1, 0.5]} body={false} />
    {[[200, 520], [880, 900], [190, 1150]].map(([x, y], i) => <RMBadge key={i} x={x} y={y} r={50} k={(t - 0.2 - i * 0.12) / 0.25} />)}
    <RMChip x={540} y={230} text={t > c ? 'COMMENT: GOT ME' : "NOT THEIR REVIEW"} pop={t / 0.2} size={46} /></g>);
}

Object.assign(window, { RMSnapWrong, RMEndGotMe, RMMeetNeighbour, RMCriticArrives, RMAwfulJoke, RMBedtime, RMStudyPairs, RMGuessLow, RMNameGap, RMInsideOutside, RMCookies });
})();
