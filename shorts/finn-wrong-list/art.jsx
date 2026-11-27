// art.jsx — "Your Brain Lists What Went Wrong Every Night" (Finn ep. 3, experiment log; Ivy cameo).
// Counting blessings: Emmons & McCullough 2003 (JPSP): ten weeks of weekly lists — hassles, neutral events or things people
// were grateful for; the gratitude group felt better about their lives as a whole, was more optimistic about the coming week,
// reported fewer physical symptoms and exercised more. No invented numbers on screen.
// Each scene draws ONLY the 1080×608 panel with xplog-kit.jsx; the engine draws the HUD + caption.
(function () {
const { ACC: A, RED: R, INK: K, CREAM: C, NAVY: N, GREY: G, GREEN: GR, BLUE: BL, clamp: cl, eo: EO, back: BK, osc: OS, hsh, beat: B } = XL;
const blink = (T, ph = 0) => (((T + ph) % 3.4) > 3.26 ? 1 : 0);

/* a lined paper list; items = [[text, col]], n = how many are shown (fractional = writing in), tick = 'x' | 'v' */
function List({ x, y, w = 420, title, items, n = 99, tick = 'x', rot = 0, size = 26 }) {
  const h = 110 + items.length * 64;
  return (<g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
    <rect x={x + 10} y={y + 12} width={w} height={h} rx="14" fill="#000" opacity="0.3" />
    <XLCard x={x} y={y} w={w} h={h} r={14} />
    <XLText x={x + w / 2} y={y + 58} size={30} fill={tick === 'x' ? R : '#1F9E63'} anchor="middle">{title}</XLText>
    <line x1={x + 24} y1={y + 78} x2={x + w - 24} y2={y + 78} stroke={K} strokeWidth="5" />
    {items.map(([s], i) => { const k = cl(n - i); if (k <= 0) return null;
      const yy = y + 126 + i * 64;
      return (<g key={i} opacity={k}>
        {tick === 'x' ? <path d={`M${x + 34} ${yy - 22} l22 22 m0 -22 l-22 22`} stroke={R} strokeWidth="7" strokeLinecap="round" />
          : <path d={`M${x + 32} ${yy - 10} l10 12 l18 -24`} stroke="#1F9E63" strokeWidth="7" fill="none" strokeLinecap="round" />}
        <XLText x={x + 76} y={yy} size={size} fill={K}>{s}</XLText></g>); })}</g>);
}
const WRONG = [['THE TYPO'], ['THE WEIRD WAVE'], ['TALKED TOO MUCH'], ['NO EMOJI'], ['THAT THING IN 2014']];
const RIGHT = [['GOOD COFFEE'], ['IVY LAUGHED'], ['BUS ON TIME']];

/* bed seen from the side, Finn's head on the pillow (night) */
function Bed({ T, mood = 'worried', bl, sweat }) {
  return (<g>
    <rect x="80" y="420" width="920" height="110" rx="16" fill={BL} stroke={K} strokeWidth="7" />
    <rect x="60" y="300" width="36" height="270" fill="#3B2A24" stroke={K} strokeWidth="6" />
    <rect x="110" y="370" width="230" height="70" rx="34" fill="#fff" stroke={K} strokeWidth="6" />
    <path d="M300 430 Q600 330 990 400 L990 450 L300 450 Z" fill={R} stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <g transform="rotate(-80 230 330)"><XLChar x={230} y={330} s={0.62} who="finn" mood={mood} look={[0, -10]} bl={bl} sweat={sweat} /></g></g>);
}

/* 1 — hook: Finn in bed at 11:48, a glowing list of what went wrong floats above */
function XFBed({ T, t, beats }) {
  const b3 = B(beats, 3, 1.5);
  return (<g><XLBg kind="room" /><rect width="1080" height="608" fill="#05070F" opacity="0.35" />
    <Bed T={T} mood="worried" bl={blink(T)} />
    <XLFade t={t} at={0.3}><List x={560} y={20} w={430} title="WENT WRONG" items={WRONG.slice(0, 3)} n={(t - 0.6) * 2.5} rot={3} /></XLFade>
    <XLPop t={t} at={b3}><XLStamp x={790} y={330} text="TODAY" size={40} rot={-8} /></XLPop></g>);
}
/* 2 — lean: the typo and the weird wave, crossed off on the list */
function XFTypoWave({ T, t, beats }) {
  const b1 = B(beats, 1, 0.6);
  return (<g><XLBg kind="wallDark" />
    <XLFade t={t} at={0}><XLCard x={70} y={60} w={420} h={230} r={18} />
      <XLText x={100} y={120} size={26} fill={G}>RE: MEETING</XLText>
      <XLText x={100} y={180} size={34} fill={K}>THANKS, SEE YOU</XLText>
      <XLText x={100} y={232} size={34} fill={K}>TOMORROW, </XLText><XLText x={318} y={232} size={34} fill={R}>JOHN</XLText>
      <ellipse cx="365" cy="221" rx="72" ry="34" fill="none" stroke={R} strokeWidth="7" /></XLFade>
    <XLFade t={t} at={b1}><g transform="translate(780 330)"><XLWiggle T={T} amp={14} p={0.35}><g>
      <rect x="-30" y="-150" width="60" height="150" rx="28" fill="#F0B27A" stroke={K} strokeWidth="6" />
      <rect x="-60" y="-80" width="120" height="110" rx="40" fill="#F0B27A" stroke={K} strokeWidth="6" /></g></XLWiggle>
      <XLChip x={0} y={150} text="WAVED BACK AT NO ONE" fill={A} col={K} size={24} /></g></XLFade>
    <XLPop t={t} at={B(beats, 3, 1.5)}><XLChip x={280} y={420} text="YOUR LIST, EVERY NIGHT" size={28} /></XLPop>
    <XLChar x={240} y={560} s={0.45} who="finn" mood="squint" look={[10, -8]} bl={blink(T)} /></g>);
}
/* 3 — snapback: one list in the spotlight, an empty second list in the dark */
function XFOneList({ T, t, beats }) {
  const b2 = B(beats, 2, 1.0), k = cl((t - b2) / 0.4);
  return (<g><XLBg kind="wallDark" />
    <XLGlow x={330} y={300} r={330} col={R} a={0.35} />
    <List x={130} y={60} w={400} title="WENT WRONG" items={WRONG.slice(0, 4)} n={4} />
    <g opacity={0.25 + 0.75 * k}><List x={580} y={60} w={400} title="WENT RIGHT" items={RIGHT.map(() => ['. . . . .'])} n={k * 3} tick="v" /></g>
    {k > 0 && <XLPop t={t} at={b2 + 0.1}><XLStamp x={780} y={420} text="NEVER USED" size={36} rot={-6} col={A} /></XLPop>}</g>);
}
/* 4 — minute 6: a meeting table, a speech bubble that won't stop */
function XFMeeting({ T, t, beats }) {
  const n = Math.max(1, Math.min(6, Math.floor(t * 3) + 1));
  return (<g><XLBg kind="wall" />
    <rect x="120" y="430" width="840" height="60" rx="12" fill="#6B4A3A" stroke={K} strokeWidth="7" />
    {[220, 860].map((x, i) => <g key={i}><XLAvatar x={x} y={360} r={60} /></g>)}
    <XLChar x={540} y={330} s={0.6} who="finn" mood="wide" look={[0, 0]} bl={0} />
    <XLCard x={340} y={20} w={400} h={60 + n * 18} r={22} fill="#fff" />
    {[...Array(n)].map((_, i) => <rect key={i} x={370} y={50 + i * 18} width={340 - hsh(i) * 120} height={8} rx="4" fill={G} />)}
    <XLPop t={t} at={B(beats, 3, 1.5)}><XLChip x={830} y={140} text="TOO MUCH" size={30} /></XLPop></g>);
}
/* 5 — minute 19: the sent text with no emoji, read receipt */
function XFNoEmoji({ T, t, beats }) {
  return (<XLChat name="IVY" status="SEEN 9:14 PM" input={null}>
    <XLBubble x={500} y={150} w={400} lines={['SOUNDS GOOD.']} mine />
    <XLPop t={t} at={B(beats, 2, 1.0)}><g><circle cx="860" cy="290" r="44" fill={A} stroke={K} strokeWidth="6" />
      <XLText x={860} y={304} size={40} fill={K} anchor="middle">?</XLText>
      <path d="M800 250 L920 330" stroke={R} strokeWidth="10" strokeLinecap="round" /></g></XLPop>
    <XLFade t={t} at={B(beats, 2, 1.0) + 0.2}><XLText x={200} y={420} size={26} fill={R}>…SHE THINKS I'M MAD.</XLText></XLFade>
  </XLChat>);
}
/* 6 — minute 34: a dusty 2014 file pulled from the back of the drawer */
function XFOld({ T, t, beats }) {
  const k = EO(t / 0.8);
  return (<g><XLBg kind="woodDark" />
    <rect x="260" y="330" width="560" height="260" fill="#5A4A3E" stroke={K} strokeWidth="8" />
    <rect x="300" y="360" width="480" height="40" rx="10" fill="#3D2B23" />
    <g transform={`translate(0 ${(1 - k) * 220})`}><XLCard x={330} y={80} w={420} h={290} r={10} fill="#E8D9A8" />
      <XLText x={540} y={150} size={34} fill={K} anchor="middle">CASE FILE · 2014</XLText>
      <XLText x={540} y={220} size={26} fill={K} anchor="middle">SAID "YOU TOO"</XLText>
      <XLText x={540} y={262} size={26} fill={K} anchor="middle">TO THE WAITER</XLText>
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={380 + hsh(i) * 320} cy={300 + hsh(i + 9) * 50} r={5} fill="#9A8A60" />)}</g>
    <XLPop t={t} at={B(beats, 3, 1.6)}><XLStamp x={540} y={530} text="STILL OPEN" size={44} /></XLPop>
    <XLChar x={940} y={520} s={0.5} who="finn" mood="sleepy" look={[-12, -6]} bl={0} /></g>);
}
/* 7 — the study: a ten-week calendar with one list per week */
function XFStudy({ T, t, beats }) {
  return (<g><XLBg kind="wood" />
    <XLCard x={110} y={40} w={860} h={530} r={14} rot={-1} />
    <XLText x={540} y={110} size={34} fill={K} anchor="middle">WEEKLY LIST STUDY · 2003</XLText>
    {[...Array(10)].map((_, i) => { const x = 190 + (i % 5) * 150, y = 200 + Math.floor(i / 5) * 170, at = 0.3 + i * 0.18;
      return (<XLPop key={i} t={t} at={at}><g><rect x={x} y={y} width={120} height={140} rx="10" fill="#fff" stroke={K} strokeWidth="5" />
        <rect x={x} y={y} width={120} height={36} rx="10" fill={R} stroke={K} strokeWidth="5" />
        <XLText x={x + 60} y={y + 28} size={20} fill="#fff" anchor="middle">{`WEEK ${i + 1}`}</XLText>
        {[0, 1, 2].map((j) => <rect key={j} x={x + 16} y={y + 60 + j * 24} width={88 - hsh(i * 3 + j) * 30} height={8} rx="4" fill={G} />)}</g></XLPop>); })}</g>);
}
/* 8 — three groups: hassles / events / grateful */
function XFGroups({ T, t, beats }) {
  const b3 = B(beats, 3, 1.6);
  const cols = [['HASSLES', R, 0.1], ['JUST EVENTS', G, 0.7], ['GRATEFUL', GR, b3 - 0.2]];
  return (<g><XLBg kind="wall" />
    {cols.map(([lab, col, at], i) => <XLPop key={i} t={t} at={at}><g>
      <XLCard x={90 + i * 310} y={110} w={280} h={360} r={20} fill={i === 2 && t > b3 ? '#E9F8EE' : C} />
      <rect x={90 + i * 310} y={110} width={280} height={70} rx="20" fill={col} stroke={K} strokeWidth="7" />
      <XLText x={230 + i * 310} y={158} size={28} fill={i === 1 ? K : '#fff'} anchor="middle">{lab}</XLText>
      {[0, 1, 2, 3].map((j) => <rect key={j} x={120 + i * 310} y={220 + j * 56} width={200 - hsh(i * 7 + j) * 70} height={12} rx="6" fill={G} />)}</g></XLPop>)}
    {t > b3 && <XLGlow x={850} y={290} r={260} col={GR} a={0.35} />}</g>);
}
/* 9 — result: two dials — life rating and next-week optimism, the grateful list ahead */
function XFResult({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" />
    <XLBars t={t} title="AFTER TEN WEEKS: FELT ABOUT LIFE" note="Emmons & McCullough 2003 · illustrative, no scale"
      bars={[{ label: ['HASSLES'], v: 0.48, col: R, at: 0.2 }, { label: ['EVENTS'], v: 0.48, col: G, at: 0.4 }, { label: ['GRATEFUL'], v: 0.72, col: GR, at: B(beats, 2, 1.0) - 0.3 }]} /></g>);
}
/* 10 — body: running shoes + a shrinking ache icon */
function XFBody({ T, t, beats }) {
  const b2 = B(beats, 2, 1.0), k = cl((t - b2) / 0.4);
  return (<g><XLBg kind="wall" />
    <XLPop t={t} at={0.2}><g transform={`translate(300 300) rotate(${OS(T, 0.5) * 6})`}>
      <path d="M-170 40 Q-170 -60 -90 -70 L-20 -70 Q10 -20 80 -10 Q170 0 170 60 L170 80 L-170 80 Z" fill={R} stroke={K} strokeWidth="8" strokeLinejoin="round" />
      <rect x="-175" y="70" width="350" height="34" rx="14" fill="#fff" stroke={K} strokeWidth="7" />
      {[0, 1, 2].map((i) => <line key={i} x1={-70 + i * 30} y1={-55} x2={-40 + i * 30} y2={-30} stroke="#fff" strokeWidth="6" />)}</g></XLPop>
    <XLChip x={300} y={500} text="MORE EXERCISE" fill={GR} col={K} size={28} />
    <g transform={`translate(780 280) scale(${1 - 0.55 * k})`}><circle r="130" fill={A} stroke={K} strokeWidth="8" />
      <path d="M-50 -20 l30 30 m0 -30 l-30 30 M20 -20 l30 30 m0 -30 l-30 30" stroke={K} strokeWidth="8" strokeLinecap="round" />
      <path d="M-40 70 Q0 40 40 70" fill="none" stroke={K} strokeWidth="8" strokeLinecap="round" /></g>
    <XLChip x={780} y={500} text="FEWER ACHES" fill={A} col={K} size={28} /></g>);
}
/* 11 — the truth: the two lists side by side, the RIGHT list now filled */
function XFTruth({ T, t, beats }) {
  const b4 = B(beats, 4, 2.0), k = cl((t - b4 + 0.2) / 0.6);
  return (<g><XLBg kind="wallDark" />
    <List x={120} y={60} w={400} title="WENT WRONG" items={WRONG.slice(0, 4)} n={4} />
    <XLGlow x={770} y={300} r={300} col={GR} a={0.25 * k} />
    <List x={570} y={60} w={400} title="WENT RIGHT" items={RIGHT} n={k * 3} tick="v" />
    <XLChar x={540} y={560} s={0.42} who="finn" mood={k > 0.5 ? 'relief' : 'neutral'} look={[12, -10]} bl={blink(T)} /></g>);
}
/* 12 — tonight: Finn in bed writing three good things, lamp on */
function XFTonight({ T, t, beats }) {
  return (<g><XLBg kind="room" /><rect width="1080" height="608" fill="#05070F" opacity="0.25" />
    <Bed T={T} mood="relief" bl={blink(T)} />
    <List x={560} y={20} w={430} title="WENT RIGHT" items={RIGHT} n={(t - 0.3) * 2} tick="v" rot={-3} /></g>);
}
/* 13 — your turn: an empty "went right" card with a pen */
function XFAsk({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <XLCard x={250} y={70} w={580} h={440} r={22} />
    <XLText x={540} y={150} size={40} fill="#1F9E63" anchor="middle">ONE GOOD THING</XLText>
    <XLText x={540} y={200} size={26} fill={G} anchor="middle">FROM TODAY</XLText>
    {[0, 1, 2].map((i) => <line key={i} x1="310" y1={290 + i * 70} x2="770" y2={290 + i * 70} stroke={G} strokeWidth="5" strokeDasharray="14 10" />)}
    <g transform={`translate(${720 + OS(T, 0.8) * 20} 330) rotate(35)`}><rect x="-16" y="-130" width="32" height="200" rx="8" fill={A} stroke={K} strokeWidth="6" />
      <path d="M-16 70 L0 110 L16 70 Z" fill={C} stroke={K} strokeWidth="6" /></g>
    <XLPop t={t} at={B(beats, 2, 1.0)}><XLChip x={540} y={560} text="TELL ME IN THE COMMENTS" fill={A} col={K} size={26} /></XLPop></g>);
}
/* 14 — share: Finn passes the list to Ivy */
function XFShare({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" />
    <XLChar x={250} y={330} s={0.85} who="finn" mood="smile" look={[14, 0]} bl={blink(T)} />
    <XLChar x={830} y={330} s={0.85} who="ivy" mood="wide" look={[-14, 0]} bl={blink(T, 1.3)} />
    <g transform={`translate(${380 + EO(t / 1.2) * 200} ${120 + OS(T, 1.5) * 8}) rotate(-6)`}><List x={-150} y={-60} w={300} title="WENT RIGHT" items={RIGHT} tick="v" size={20} /></g></g>);
}

Object.assign(window, { XFBed, XFTypoWave, XFOneList, XFMeeting, XFNoEmoji, XFOld, XFStudy, XFGroups, XFResult, XFBody, XFTruth, XFTonight, XFAsk, XFShare });
})();
