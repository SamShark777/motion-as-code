// art.jsx — "Would You Wear This Sign?" (Milo ep. 9, with Theo; ted-MG motion graphics; pattern: test).
// False consensus effect: Ross, Greene & House 1977 (JESP) — Stanford students asked to wear an "Eat at Joe's" sandwich board
// for 30 minutes; those who agreed estimated ~62% of peers would agree, those who refused thought only ~33% would (≈67% refuse).
// Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces and numbers stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GREEN = '#4f9d78', BLUE = '#3f7fbf';

/* the sandwich board: two boards on straps; text "EAT AT JOE'S" */
function Board({ x, y, s = 1, rot = 0, k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k) * s})`}>
    <path d="M-120 -250 L-80 -330 M120 -250 L80 -330" stroke={K} strokeWidth="10" strokeLinecap="round" />
    <rect x="-170" y="-260" width="340" height="420" rx="12" fill="#f4efe4" stroke={K} strokeWidth="10" />
    <text y="-140" textAnchor="middle" fontFamily={BB} fontSize="96" fill={R}>EAT AT</text>
    <text y="-20" textAnchor="middle" fontFamily={BB} fontSize="116" fill={K}>JOE'S</text>
    <path d="M-110 60 Q0 120 110 60" fill="none" stroke={A} strokeWidth="14" strokeLinecap="round" /></g>);
}
function Thought({ x, y, w = 200, h = 130, k = 1, children }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}><ellipse rx={w / 2} ry={h / 2} fill="#fff" stroke={K} strokeWidth="6" />
    <circle cx={-w * 0.25} cy={h * 0.62} r="14" fill="#fff" stroke={K} strokeWidth="5" /><circle cx={-w * 0.35} cy={h * 0.85} r="8" fill="#fff" stroke={K} strokeWidth="4" />{children}</g>);
}
function Tick({ s = 1 }) { return <path transform={`scale(${s})`} d="M-30 0 L-8 24 L32 -26" fill="none" stroke={GREEN} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />; }
function Cross({ s = 1 }) { return <g transform={`scale(${s})`}><path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke={R} strokeWidth="14" strokeLinecap="round" /></g>; }
/* a big percentage dial (p 0..1 shows the fill) */
function Pct({ x, y, val, col, label, p = 1 }) {
  const a = (val / 100) * Math.PI * 2 * cl(p), r = 150;
  const arc = `M0 ${-r} A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${Math.sin(a) * r} ${-Math.cos(a) * r}`;
  return (<g transform={`translate(${x} ${y})`}><circle r={r} fill="none" stroke="#2a3150" strokeWidth="40" />
    {p > 0 && <path d={arc} fill="none" stroke={col} strokeWidth="40" strokeLinecap="round" />}
    <text y="34" textAnchor="middle" fontFamily={BB} fontSize="110" fill="#fff">{Math.round(val * cl(p))}%</text>
    <text y={r + 90} textAnchor="middle" fontFamily={BB} fontSize="54" fill={col}>{label}</text></g>);
}

/* 1 — Milo at the party; every guest has the same thought bubble as Milo (his own face) — he's sure */
function MGMiloSure({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6);
  return (<g><MGBg kind="party" />
    {[0, 1, 2, 3, 4, 5].map((i) => { const x = 110 + i * 172, y = 1000 + (i % 2) * 50;
      return <g key={i}><MGPerson x={x} y={y + 260} s={2} who={MG.extra(i + 2)} mouth="smile" look={[(540 - x) / 600, 0]} bl={BL(T, i * 0.5)} />
        <Thought x={x + 30} y={y - 260} w={130} h={90} k={(t - c1 - i * 0.08) / 0.3}><Tick s={0.9} /></Thought></g>; })}
    <MGBust x={540} y={560} r={120} who="milo" mouth="grin" brow="up" look={[0, 0]} bl={BL(T)} />
    <Thought x={790} y={300} w={240} h={150} k={(t - 0.1) / 0.3}><Tick s={1.4} /></Thought>
    <MGChip x={260} y={200} text="MILO · 100% SURE" size={44} pop={t / 0.25} /></g>);
}

/* 2 — the test: the sandwich board on a stand under a spotlight; YES / NO buttons; "PAUSE" chip pulses */
function MGPauseSign({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1), pl = 1 + Math.sin(T * 5) * 0.04;
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={700} a={0.5 * SM(0, 0.3, t)} />
    <g transform={`translate(540 250) scale(${pl})`}><MGChip x={0} y={0} text="⏸ PAUSE AND PICK" col={A} size={56} pop={t / 0.25} /></g>
    <Board x={540} y={860} s={1.15} rot={Math.sin(T * 1.2) * 2} k={(t - c2 + 0.5) / 0.35} />
    {[[300, 'YES', GREEN], [780, 'NO', R]].map(([x, l, c], i) => <g key={l} transform={`translate(${x} 1240) scale(${BK((t - 0.4 - i * 0.15) / 0.3)})`}>
      <rect x="-150" y="-70" width="300" height="140" rx="40" fill={c} stroke={K} strokeWidth="9" /><text y="30" textAnchor="middle" fontFamily={BB} fontSize="96" fill="#fff">{l}</text></g>)}</g>);
}

/* 3 — snapback: the viewer's pick (a tick) multiplies into a sea of identical ticks — "MOST PEOPLE" */
function MGMostPicked({ T, t, beats }) {
  const c2 = b(beats, 2, 1.2), n = Math.floor(SM(c2 - 0.6, c2 + 0.8, t) * 30);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={220} text="YOUR GUESS ABOUT OTHERS" outline size={44} pop={t / 0.25} />
    {[...Array(30)].map((_, i) => { const x = 140 + (i % 6) * 160, y = 420 + Math.floor(i / 6) * 160; if (i >= n) return null;
      return <g key={i} transform={`translate(${x} ${y + Math.sin(T * 2 + i) * 5})`}><circle r="60" fill="#151a2c" stroke={i === 14 ? A : '#3a4266'} strokeWidth="6" /><Tick s={0.9} /></g>; })}
    <g transform="translate(540 1230)"><MGHead x={0} y={0} r={110} who="milo" mouth="o" brow="up" look={[0, -1]} bl={BL(T)} /></g></g>);
}

/* 4 — the study: campus path, a student in the sandwich board; data chip Stanford 1977; 30 MIN timer */
function MGStanfordBoard({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1), w = T * 6;
  return (<g><MGBg kind="street" />
    <MGChip x={540} y={200} text="STANFORD · 1977" outline size={48} pop={t / 0.25} />
    <MGChip x={540} y={290} text="30 MINUTES ON CAMPUS" col={A} size={40} pop={(t - 0.3) / 0.25} />
    <MGPerson x={540 + Math.sin(T * 0.8) * 40} y={1250} s={2.6} who={MG.extra(3)} walk={w} mouth="wave" brow="worried" look={[0, 0]} bl={BL(T)} />
    <Board x={540 + Math.sin(T * 0.8) * 40} y={1000} s={0.62} k={1} />
    {t > c2 && <MGChip x={540} y={560} text="THE DARE" col={R} txt="#fff" size={60} pop={(t - c2) / 0.25} />}</g>);
}

/* 5 — yes-sayers: a smiling student in the board; dial fills to 62% "WILL SAY YES" */
function MGYesGuess({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="SAID YES · THEIR GUESS" col={GREEN} txt="#fff" size={46} pop={t / 0.25} />
    <Pct x={540} y={620} val={62} col={GREEN} label="OTHERS WILL SAY YES" p={SM(0.2, c2 + 0.3, t)} />
    <MGBust x={540} y={1180} r={120} who={MG.extra(1)} mouth="grin" brow="up" look={[0, -0.8]} bl={BL(T)} /></g>);
}

/* 6 — refusers: an arms-crossed student; dial fills to 67% "WILL REFUSE" (they guessed only 33% would agree) */
function MGNoGuess({ T, t, beats }) {
  const c1 = b(beats, 1, 0.8);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="SAID NO · THEIR GUESS" col={R} txt="#fff" size={46} pop={t / 0.25} />
    <Pct x={540} y={620} val={67} col={R} label="OTHERS WILL REFUSE" p={SM(0.2, c1 + 0.5, t)} />
    <MGBust x={540} y={1180} r={120} who={MG.extra(6)} mouth="frown" brow="angry" look={[0, -0.8]} bl={BL(T, 1)} /></g>);
}

/* 7 — name it: FALSE CONSENSUS EFFECT; Milo looks into a mirror crowd — every face is his own */
function MGNameConsensus({ T, t }) {
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGTitle lines={[['THE FALSE', '#fff', 140], ['CONSENSUS', A, 150], ['EFFECT', '#fff', 140]]} y={230} a={EO((t - 0.15) / 0.35)} />
    {[0, 1, 2, 3, 4].map((i) => { const x = 140 + i * 200, k = BK((t - 0.6 - Math.abs(i - 2) * 0.15) / 0.3);
      return k > 0 && <g key={i} transform={`translate(${x} 960) scale(${k})`}><MGHead x={0} y={0} r={i === 2 ? 110 : 80} who="milo" mouth={i === 2 ? 'grin' : 'smile'} brow="up" look={[(2 - i) * 0.4, 0]} bl={BL(T, i * 0.3)} /></g>; })}
    <MGChip x={540} y={1200} text="EVERYONE = ME?" col={A} size={50} pop={(t - 1.2) / 0.25} /></g>);
}

/* 8 — self-proof: Milo mid-sentence at dinner, speech bubble "EVERYONE KNOWS THAT", two friends exchange a look */
function MGEveryoneKnows({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="room" />
    <rect x="-40" y="1080" width="1160" height="80" fill="#a87a52" stroke={K} strokeWidth="8" />
    <MGPerson x={540} y={1120} s={2.4} who="milo" mouth="grin" brow="up" look={[0, 0]} bl={BL(T)} />
    <MGPerson x={190} y={1150} s={2.1} who={MG.extra(4)} mouth="flat" brow={t > c3 ? 'up' : 'flat'} look={t > c3 ? [1, 0] : [0.8, -0.3]} bl={BL(T, 1)} />
    <MGPerson x={890} y={1150} s={2.1} who={MG.extra(7)} mouth="flat" brow={t > c3 ? 'up' : 'flat'} look={t > c3 ? [-1, 0] : [-0.8, -0.3]} bl={BL(T, 2)} />
    <MGBubble x={540} y={330} text="EVERYONE KNOWS THAT!" k={(t - 0.2) / 0.3} size={54} />
    {t > c3 && <MGChip x={540} y={1260} text="...DO THEY?" col={A} size={50} pop={(t - c3) / 0.25} />}</g>);
}

/* 9 — end: Theo holds up a tally — YES | NO split; Milo shrugs and laughs; question + send chips */
function MGEndNormal({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1), c3 = b(beats, 3, 1.6);
  return (<g><MGBg kind="party" />
    <MGPerson x={300} y={1300} s={2.4} who="theo" mouth="smile" brow="up" look={[1, 0]} bl={BL(T)} />
    <MGPerson x={800} y={1300} s={2.4} who="milo" mouth="grin" brow="up" look={[-1, 0]} bl={BL(T, 1)} />
    <g transform="translate(540 680)"><rect x="-230" y="-150" width="460" height="300" rx="20" fill="#f4efe4" stroke={K} strokeWidth="9" />
      <line x1="0" y1="-120" x2="0" y2="120" stroke={K} strokeWidth="6" />
      <text x="-115" y="-70" textAnchor="middle" fontFamily={BB} fontSize="64" fill={GREEN}>YES</text><text x="115" y="-70" textAnchor="middle" fontFamily={BB} fontSize="64" fill={R}>NO</text>
      {[0, 1].map((side) => [...Array(5)].map((_, i) => (t > 0.3 + i * 0.15 + side * 0.1) && <line key={side + '-' + i} x1={(side ? 50 : -180) + i * 28} y1="0" x2={(side ? 50 : -180) + i * 28} y2="90" stroke={K} strokeWidth="8" strokeLinecap="round" />))}</g>
    <MGChip x={540} y={200} text="YOUR NORMAL ≠ EVERYONE'S" col="#fff" size={44} pop={t / 0.25} />
    {t > c2 && <MGChip x={540} y={300} text="YES OR NO? COMMENT IT" col={A} size={44} pop={(t - c2) / 0.25} />}
    {t > c3 && <MGChip x={540} y={400} text="SEND IT TO THAT FRIEND" outline size={40} pop={(t - c3) / 0.25} />}</g>);
}

Object.assign(window, { MGMiloSure, MGPauseSign, MGMostPicked, MGStanfordBoard, MGYesGuess, MGNoGuess, MGNameConsensus, MGEveryoneKnows, MGEndNormal });
})();
