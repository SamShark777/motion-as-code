// art.jsx — "5 Signs You Talk More Than You Ask" (Otto ep. 14, with Lila; retro modern illustration, signs-list).
// Question-asking increases liking: Huang, Yeomans, Brooks, Minson & Gino 2017 (JPSP) — in chats and speed dates, people who
// asked more questions, especially follow-up questions, were liked more; speed daters who asked more got more second dates.
// No invented numbers on screen. Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540; keep faces/numbers out of 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";

// a cafe table seen from the front with two cups
function Table({ y = 1180 }) {
  return (<g><rect x={140 + 14} y={y + 14} width={800} height={50} fill={P.blk} /><rect x={140} y={y} width={800} height={50} fill={P.yel} {...ink(7)} />
    <rect x={510} y={y + 50} width={60} height={220} fill={P.blk} /><rect x={400} y={y + 250} width={280} height={30} fill={P.blk} />
    {[330, 750].map((x) => <g key={x}><path d={`M${x - 50} ${y - 90} L${x + 50} ${y - 90} L${x + 38} ${y} L${x - 38} ${y} Z`} fill={P.cream} {...ink(6)} />
      <path d={`M${x + 48} ${y - 70} q40 0 30 34 q-8 20 -36 16`} fill="none" {...ink(6)} /></g>)}</g>);
}
// big round sign number with a hard shadow (top-left)
function SignNo({ n, t }) {
  return (<g transform={`translate(170 280) scale(${BK(t / 0.3)})`}><circle cx="10" cy="10" r="110" fill={P.blk} />
    <circle r="110" fill={P.yel} {...ink(8)} /><text x="0" y="55" textAnchor="middle" fontFamily={BEB} fontSize="170" fill={P.blk}>{n}</text></g>);
}
// a stack of Otto's words: rectangles of blah lines coming out of his mouth
function WordStream({ x, y, t, n = 6, dir = 1 }) {
  return (<g>{[...Array(n)].map((_, i) => { const k = cl(t * 3 - i * 0.5); if (k <= 0) return null;
    return <g key={i} transform={`translate(${x + dir * (40 + i * 60)} ${y - i * 95}) rotate(${(hsh(i) - 0.5) * 16}) scale(${BK(k)})`}>
      <rect x="-150" y="-40" width="300" height="80" fill={P.blk} /><text x="0" y="22" textAnchor="middle" fontFamily={BEB} fontSize="60" letterSpacing="4" fill={P.cream}>{['BLAH', 'AND THEN I', 'MY BOAT', 'ANYWAY, ME', 'BLAH BLAH', 'SO I SAID'][i % 6]}</text></g>; })}</g>);
}

/* 1 — hook: lunch table, Otto talking a tower of words, Lila buried behind it */
function RLLunch({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={110} text={t > c3 ? 'LUNCH · 1:58 PM' : 'LUNCH · 12:30 PM'} col={P.cream} size={44} pop={t / 0.25} />
    <RMOtto x={300} y={800} s={0.42} mouth={osc(T, 0.25) > 0 ? 'open' : 'smile'} brow="up" lid={0.35} look={[1, 0]} />
    <RMLila x={790} y={820} s={0.4} mouth="flat" brow="sad" lid={0.6} look={[-1, 0.3]} />
    <WordStream x={420} y={660} t={t} n={5} />
    <Table y={1180} />
    {t > c3 && <RMChip x={300} y={1340} text="'GREAT CHAT!'" col={P.yel} size={44} pop={(t - c3) / 0.25} />}</g>);
}
/* 2 — to the viewer: "5 SIGNS" stacked title, Otto beaming */
function RLFiveSigns({ T, t, beats }) {
  return (<g><RMBg kind="red" />
    <RMTitle lines={[['5 SIGNS', P.yel, 220], ['YOU TALK MORE', P.cream, 110], ['THAN YOU ASK', P.cream, 110]]} y={300} a={EO(t / 0.35)} />
    <RMOtto x={540} y={940} s={0.45} mouth="smile" brow="up" lid={0.3} look={[0, 0]} /></g>);
}
/* 3 — snapback: a scale: INTERESTING (megaphone) vs INTERESTED (ear) — the ear wins */
function RLNotTrick({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.9), tilt = 0.3 * SM(c2 - 0.2, c2 + 0.4, t);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={230} text="THE REAL TRICK?" col={P.yel} size={54} pop={t / 0.25} />
    <RMScale tilt={tilt}
      left={(x, y) => (<g><path d={`M${x - 90} ${y - 20} L${x + 40} ${y - 80} L${x + 40} ${y + 40} Z`} fill={P.cream} {...ink(6)} />
        <rect x={x - 120} y={y - 40} width={40} height={40} fill={P.blk} /><RMChip x={x} y={y + 120} text="INTERESTING" col={P.cream} size={34} pop={1} /></g>)}
      right={(x, y) => (<g><path d={`M${x - 40} ${y + 40} C${x - 80} ${y - 60} ${x + 60} ${y - 110} ${x + 70} ${y - 10} C${x + 70} ${y + 40} ${x + 10} ${y + 30} ${x + 10} ${y + 70}`} fill={P.pink} {...ink(7)} />
        <RMChip x={x} y={y + 120} text="INTERESTED" col={P.yel} size={34} pop={(t - c2) / 0.25} /></g>)} /></g>);
}
/* 4 — sign 1: planning the next line, a script in Otto's head while Lila talks */
function RLSignLine({ T, t, beats }) {
  return (<g><RMBg kind="redDark" />
    <SignNo n="1" t={t} />
    <RMLila x={280} y={820} s={0.36} mouth={osc(T, 0.3) > 0 ? 'open' : 'flat'} brow="up" lid={0.2} look={[1, 0]} />
    <RMOtto x={780} y={820} s={0.36} mouth="flat" brow="flat" lid={0.5} look={[0, -1]} />
    <g transform={`translate(760 420) scale(${BK((t - 0.3) / 0.3)})`}><rect x="-210" y="-120" width="420" height="240" fill={P.blk} transform="translate(10 10)" />
      <rect x="-210" y="-120" width="420" height="240" fill={P.cream} {...ink(6)} />
      <text x="0" y="-60" textAnchor="middle" fontFamily={BEB} fontSize="50" fill={P.red}>MY NEXT LINE:</text>
      {[0, 1, 2].map((i) => <rect key={i} x={-170} y={-20 + i * 40} width={340 - hsh(i) * 120} height="14" fill={P.blue} opacity={cl(t * 2 - i * 0.6)} />)}</g>
    <path d="M760 560 L740 640" stroke={P.cream} strokeWidth="8" strokeDasharray="12 10" /></g>);
}
/* 5 — sign 2: Lila's speech bubble gets shoved aside by Otto's SAME! */
function RLSignSame({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6), push = SM(c1 - 0.1, c1 + 0.35, t);
  return (<g><RMBg kind="dark" />
    <SignNo n="2" t={t} />
    <g transform={`translate(${-420 * push} 0) rotate(${-10 * push} 540 520)`}><RMSpeech x={560} y={520} text="MY DOG GOT LOST…" k={1} size={64} col={P.cream} /></g>
    <RMSpeech x={560} y={560} text="SAME! ONCE I…" k={(t - c1 + 0.1) / 0.3} size={84} col={P.yel} />
    <RMOtto x={720} y={960} s={0.36} mouth="open" brow="up" lid={0.3} look={[-0.6, -0.4]} />
    <RMLila x={260} y={1000} s={0.3} mouth="frown" brow="sad" lid={0.4} look={[1, -0.4]} /></g>);
}
/* 6 — sign 3: silence = an alarm clock going off */
function RLSignSilence({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), ring = t > c2 - 0.1 ? 1 : 0;
  return (<g><RMBg kind={ring ? 'red' : 'dark'} />
    <SignNo n="3" t={t} />
    <RMChip x={760} y={300} text="2 SECONDS OF SILENCE" col={P.cream} size={40} pop={(t - 0.2) / 0.25} />
    <RMAlarm x={540} y={720} T={T} ring={ring} s={1.1} />
    <RMOtto x={540} y={1070} s={0.3} mouth={ring ? 'shout' : 'flat'} brow={ring ? 'up' : 'flat'} lid={0.1} look={[0, -1]} wide={!!ring} /></g>);
}
/* 7 — sign 4: "HOW ARE YOU?" bubble, the answer bubble popped before it finishes */
function RLSignHowAre({ T, t, beats }) {
  const c4 = bt(beats, 4, 1.8);
  return (<g><RMBg kind="redDark" />
    <SignNo n="4" t={t} />
    <RMSpeech x={600} y={420} text="HOW ARE YOU?" k={(t - 0.2) / 0.3} size={80} col={P.yel} />
    {t < c4 ? <g transform={`translate(560 760) scale(${BK((t - 0.9) / 0.3)})`}><rect x="-260" y="-70" width="520" height="140" fill={P.cream} {...ink(6)} />
      <text x="0" y="22" textAnchor="middle" fontFamily={BEB} fontSize="64" fill={P.blk}>WELL, ACTUALLY…</text></g>
      : [...Array(8)].map((_, i) => { const a = i / 8 * Math.PI * 2, r = 80 + (t - c4) * 500; return <rect key={i} x={560 + Math.cos(a) * r - 18} y={760 + Math.sin(a) * r - 18} width="36" height="36" fill={P.cream} {...ink(4)} opacity={1 - cl((t - c4) / 0.6)} />; })}
    <RMOtto x={300} y={1000} s={0.3} mouth="smile" brow="flat" lid={0.4} look={[1, -0.6]} />
    <RMLila x={800} y={1000} s={0.3} mouth="open" brow="up" lid={0.2} look={[-1, -0.6]} /></g>);
}
/* 8 — sign 5: a file on Lila stamped EMPTY */
function RLSignNothing({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  return (<g><RMBg kind="redDark" />
    <SignNo n="5" t={t} />
    <g transform="translate(540 820) rotate(-3)"><rect x="-330" y="-380" width="660" height="760" fill={P.blk} transform="translate(14 14)" />
      <rect x="-330" y="-380" width="660" height="760" fill={P.cream} {...ink(7)} />
      <text x="0" y="-290" textAnchor="middle" fontFamily={BEB} fontSize="60" letterSpacing="4" fill={P.blue}>WHAT I KNOW ABOUT LILA</text>
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="-270" y1={-180 + i * 110} x2="270" y2={-180 + i * 110} stroke={P.blue} strokeOpacity="0.4" strokeWidth="4" />)}
      {t > c2 && <g transform={`rotate(-12) scale(${BK((t - c2) / 0.3)})`}><rect x="-250" y="-90" width="500" height="180" fill="none" stroke={P.red} strokeWidth="16" />
        <text x="0" y="55" textAnchor="middle" fontFamily={BEB} fontSize="160" letterSpacing="10" fill={P.red}>EMPTY</text></g>}</g></g>);
}
/* 9 — the study: chat windows + speed-date table with a bell */
function RLStudy({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={220} text="QUESTION STUDY · 2017" col={P.yel} size={50} pop={t / 0.25} />
    {[0, 1].map((i) => <g key={i} transform={`translate(${300 + i * 480} 520) scale(${BK((t - 0.3 - i * 0.2) / 0.3)})`}>
      <rect x="-200" y="-150" width="400" height="300" fill={P.blk} transform="translate(10 10)" /><rect x="-200" y="-150" width="400" height="300" fill={P.cream} {...ink(6)} />
      <rect x="-200" y="-150" width="400" height="50" fill={P.red} {...ink(6)} />
      <rect x={i ? -40 : -170} y="-70" width="210" height="50" fill={i ? P.yel : '#fff'} {...ink(4)} /><rect x={i ? -170 : -40} y="10" width="210" height="50" fill={i ? '#fff' : P.yel} {...ink(4)} />
      <text x={i ? 65 : -65} y="-33" textAnchor="middle" fontFamily={BEB} fontSize="36" fill={P.blk}>?</text></g>)}
    {t > c3 - 0.2 && <g opacity={SM(c3 - 0.2, c3 + 0.2, t)}><rect x="200" y="1000" width="680" height="40" fill={P.yel} {...ink(6)} />
      {[...Array(5)].map((_, i) => <g key={i}><circle cx={250 + i * 145} cy={960} r={30} fill={i % 2 ? P.pink : P.cream} {...ink(4)} /></g>)}
      <g transform="translate(860 960)"><path d="M-40 30 Q-40 -40 0 -40 Q40 -40 40 30 Z" fill={P.yel} {...ink(6)} /><circle cy="-50" r="10" fill={P.blk} /></g>
      <RMChip x={540} y={1200} text="SPEED DATES" col={P.cream} size={48} pop={(t - c3) / 0.25} /></g>}</g>);
}
/* 10 — result: FOLLOW-UP questions lift the liking meter */
function RLFollowUp({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), k = SM(c2, c2 + 0.8, t);
  return (<g><RMBg kind="red" />
    <RMTitle lines={[['FOLLOW-UP', P.yel, 170], ['QUESTIONS', P.cream, 120]]} y={260} a={EO(t / 0.35)} />
    <RMSpeech x={540} y={700} text="WAIT, THEN WHAT?" k={(t - c2 + 0.1) / 0.3} size={80} col={P.yel} />
    <g transform="translate(180 1000)"><text x="0" y="-30" fontFamily={BEB} fontSize="56" letterSpacing="4" fill={P.cream}>LIKED</text>
      <rect x="0" y="0" width="720" height="90" fill={P.blk} transform="translate(10 10)" /><rect x="0" y="0" width="720" height="90" fill={P.cream} {...ink(6)} />
      <rect x="8" y="8" width={704 * (0.35 + 0.5 * k)} height="74" fill={P.blue} /></g>
    {[...Array(5)].map((_, i) => <RMBadge key={i} x={200 + i * 170} y={1250 + osc(T, 1.2, i * 0.2) * 10} r={46} k={(k - i * 0.15) * 2} />)}</g>);
}
/* 11 — speed dates: a "SECOND DATE?" card ticked YES */
function RLSecondDate({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  return (<g><RMBg kind="blue" />
    <g transform="translate(540 700) rotate(-3)"><rect x="-330" y="-260" width="660" height="520" fill={P.blk} transform="translate(14 14)" />
      <rect x="-330" y="-260" width="660" height="520" fill={P.cream} {...ink(7)} />
      <text x="0" y="-150" textAnchor="middle" fontFamily={BEB} fontSize="100" letterSpacing="6" fill={P.red}>SECOND DATE?</text>
      {['YES', 'NO'].map((s, i) => <g key={s} transform={`translate(${-140 + i * 280} 60)`}><rect x="-70" y="-70" width="140" height="140" fill="#fff" {...ink(7)} />
        <text x="0" y="140" textAnchor="middle" fontFamily={BEB} fontSize="70" fill={P.blk}>{s}</text>
        {i === 0 && t > c2 - 0.1 && <path d="M-45 0 L-10 40 L55 -50" fill="none" stroke={P.red} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${200 * SM(c2 - 0.1, c2 + 0.3, t)} 300`} />}</g>)}</g>
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${220 + i * 320} ${1180 + osc(T, 1.4, i * 0.3) * 14}) scale(${BK((t - c2 - i * 0.12) / 0.3) * 0.7})`}>
      <path d="M0 40 C-80 -10 -70 -80 -30 -80 C-10 -80 0 -60 0 -50 C0 -60 10 -80 30 -80 C70 -80 80 -10 0 40 Z" fill={P.red} {...ink(6)} /></g>)}</g>);
}
/* 12 — payoff: next lunch, Otto leans in and listens; Lila talking happily, clock runs late */
function RLThenWhat({ T, t, beats }) {
  const c4 = bt(beats, 4, 2.0);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={200} text="NEXT LUNCH" col={P.cream} size={48} pop={t / 0.25} />
    <RMOtto x={300} y={800} s={0.42} mouth="smile" brow="up" lid={0.2} look={[1, 0]} rot={0.08} />
    <RMLila x={790} y={800} s={0.42} mouth={t > c4 ? 'smile' : osc(T, 0.3) > 0 ? 'open' : 'smile'} brow="up" lid={0.15} look={[-1, 0]} />
    <RMSpeech x={330} y={450} text="THEN WHAT HAPPENED?" k={(t - 0.5) / 0.3} size={60} col={P.yel} />
    <Table y={1180} />
    {t > c4 && <RMChip x={790} y={1340} text="STAYS FOR DESSERT" col={P.yel} size={40} pop={(t - c4) / 0.25} />}</g>);
}
/* 13 — end: the five-sign checklist */
function RLEndSigns({ T, t, beats }) {
  const signs = ['PLAN YOUR NEXT LINE', "'SAME! ONCE I…'", 'SILENCE = EMERGENCY', 'SKIP THE ANSWER', 'LEARN NOTHING NEW'];
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={200} text="HOW MANY DID YOU CHECK?" col={P.yel} size={48} pop={t / 0.25} />
    {signs.map((s, i) => { const at = 0.4 + i * 0.3, k = SM(at, at + 0.2, t);
      return (<g key={i}><rect x="150" y={350 + i * 150} width="90" height="90" fill={P.cream} {...ink(7)} />
        {k > 0 && <path d={`M165 ${395 + i * 150} l25 28 l45 -58`} fill="none" stroke={P.red} strokeWidth="14" strokeLinecap="round" opacity={k} />}
        <text x={280} y={420 + i * 150} fontFamily={BEB} fontSize="64" letterSpacing="3" fill={P.cream}>{s}</text></g>); })}
    <RMOtto x={880} y={1200} s={0.2} mouth="frown" brow="up" lid={0.3} look={[-1, -0.5]} body={false} /></g>);
}

Object.assign(window, { RLLunch, RLFiveSigns, RLNotTrick, RLSignLine, RLSignSame, RLSignSilence, RLSignHowAre, RLSignNothing, RLStudy, RLFollowUp, RLSecondDate, RLThenWhat, RLEndSigns });
})();
