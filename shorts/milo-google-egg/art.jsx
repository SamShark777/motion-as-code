// art.jsx — "Why You Forget Things You Just Googled" (Milo ep. 7, with Nia; ted-MG motion graphics).
// Google effect: Sparrow, Liu & Wegner 2011 (Science) — people told the computer would save trivia statements recalled them
// less well than people told they'd be erased, and remembered where facts were saved better than the facts. No numbers
// on screen. Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const MILO = '#f7f5f0', MILO_SKIN = '#F4EFE4';

// a search bar (centre x,y, width w) with typed text and a magnifier
function Search({ x, y, w = 760, text = '', k = 1, cursor = true, T = 0 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}><rect x={-w / 2} y="-56" width={w} height="112" rx="56" fill="#fff" stroke={K} strokeWidth="7" />
    <circle cx={-w / 2 + 64} cy="-6" r="22" fill="none" stroke={K} strokeWidth="7" /><line x1={-w / 2 + 80} y1="10" x2={-w / 2 + 100} y2="30" stroke={K} strokeWidth="8" strokeLinecap="round" />
    <text x={-w / 2 + 120} y="14" fontFamily={OS} fontWeight="500" fontSize="40" fill="#1a1720">{text}</text>
    {cursor && Math.sin(T * 8) > 0 && <rect x={-w / 2 + 124 + text.length * 19} y="-24" width="4" height="48" fill={R} />}</g>);
}
function Pot({ x, y, T }) {
  return (<g transform={`translate(${x} ${y})`}>
    {[0, 1, 2].map((i) => { const ph = (T * 0.9 + i / 3) % 1; return <path key={i} d={`M${(i - 1) * 60} ${-120 - ph * 150} q16 -22 0 -44 q-16 -22 0 -44`} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity={Math.sin(ph * Math.PI) * 0.8} />; })}
    <rect x="-150" y="-110" width="300" height="190" rx="20" fill="#9aa3b5" stroke={K} strokeWidth="8" /><rect x="-175" y="-120" width="350" height="34" rx="12" fill="#c3cad6" stroke={K} strokeWidth="7" />
    <rect x="150" y="-90" width="120" height="26" rx="12" fill="#3a3a46" stroke={K} strokeWidth="6" />
    <ellipse cx="-20" cy="-120" rx="44" ry="56" fill="#fbf6ea" stroke={K} strokeWidth="6" transform={`rotate(${Math.sin(T * 6) * 6} -20 -120)`} />
    <rect x="-200" y="80" width="400" height="40" rx="10" fill="#3a3a46" stroke={K} strokeWidth="6" /></g>);
}
function Folder({ x, y, s = 1, label, col = '#6a7bd1', lit = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>{lit > 0 && <MGGlow x={0} y={0} r={200} col={A} a={0.6 * lit} />}
    <path d="M-120 -80 L-40 -80 L-20 -60 L120 -60 L120 80 L-120 80 Z" fill={col} stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <rect x="-120" y="-40" width="240" height="120" rx="8" fill={col} stroke={K} strokeWidth="7" opacity="0.9" />
    <text y="40" textAnchor="middle" fontFamily={BB} fontSize="48" fill="#fff">{label}</text></g>);
}

/* 1 — Milo in the kitchen, egg pot steaming, typing "boiled egg time"; history chips stack up: MON, WED, FRI */
function MGMiloGoogle({ T, t, beats }) {
  const q = 'boiled egg time', n = Math.floor(q.length * EO((t - 0.1) / 0.7)), c2 = b(beats, 2, 1.3);
  return (<g><MGBg kind="wall" c1="#ffe2b8" c2="#e9b98a" />
    <rect x="-300" y="1250" width="1680" height="700" fill="#8c6a4a" /><rect x="-300" y="1230" width="1680" height="30" fill="#6b4d33" />
    <Pot x={800} y={1150} T={T} />
    <MGBust x={300} y={840} r={140} who="milo" mouth="flat" brow="worried" look={[0.6, -0.8]} bl={BL(T)} />
    <Search x={540} y={250} w={840} text={q.slice(0, n)} T={T} />
    {['MON', 'WED', 'FRI'].map((d, i) => { const s0 = i === 2 ? c2 : 0.5 + i * 0.25; return t > s0 && <MGChip key={d} x={800} y={420 + i * 90} text={`${d}: boiled egg time`} outline size={30} pop={(t - s0) / 0.25} />; })}
    {t > c2 && <MGChip x={360} y={560} text="3RD TIME" col={R} txt="#fff" size={46} pop={(t - c2) / 0.25} />}</g>);
}

/* 2 — yesterday vs today: the fact in Milo's thought cloud fades to "?"; Nia laughs beside him */
function MGGoneToday({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), fade = SM(c3 - 0.4, c3, t);
  return (<g><MGBg kind="room" />
    <MGChip x={540} y={200} text={t > c3 ? 'TODAY' : 'YESTERDAY'} col={t > c3 ? R : A} txt={t > c3 ? '#fff' : '#1a1720'} size={54} pop={t > c3 ? (t - c3) / 0.25 : t / 0.25} />
    <g transform="translate(440 520)">{[[-150, 0, 110], [-50, -60, 120], [70, -50, 120], [160, 10, 100], [60, 60, 110], [-70, 60, 110]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" stroke={K} strokeWidth="7" />)}
      {[[-150, 0, 102], [-50, -60, 112], [70, -50, 112], [160, 10, 92], [60, 60, 102], [-70, 60, 102], [0, 0, 130]].map(([cx, cy, r], i) => <circle key={'f' + i} cx={cx} cy={cy} r={r} fill="#fff" />)}
      <text y="30" textAnchor="middle" fontFamily={BB} fontSize="84" fill={K} opacity={1 - fade}>EGG TIME: GOT IT</text>
      <text y="50" textAnchor="middle" fontFamily={BB} fontSize="170" fill={R} opacity={fade}>?</text></g>
    <MGPerson x={360} y={1300} s={2.4} who="milo" mouth={t > c3 ? 'o' : 'flat'} brow="worried" look={[0.2, -1]} bl={BL(T)} />
    <MGPerson x={820} y={1300} s={2.4} who="nia" mouth="grin" brow="up" look={[-1, -0.2]} bl={BL(T, 1)} /></g>);
}

/* 3 — snapback: a filing drawer slides out of Milo's head labelled STORED IN: PHONE */
function MGEfficient({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1), out = EO((t - c2) / 0.5);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGHead x={540} y={820} r={230} who="milo" mouth={t > c2 ? 'smile' : 'o'} brow="up" look={[0.3, -0.5]} bl={BL(T)} />
    <g transform={`translate(${540 + out * 260} ${560})`} opacity={SM(c2 - 0.1, c2 + 0.1, t)}><rect x="-150" y="-80" width="300" height="160" rx="10" fill="#c9965a" stroke={K} strokeWidth="8" />
      <rect x="-60" y="-12" width="120" height="24" rx="10" fill="#6b4d33" /><rect x="-120" y="-150" width="240" height="70" rx="8" fill="#fff" stroke={K} strokeWidth="5" />
      <text y="-103" textAnchor="middle" fontFamily={BB} fontSize="40" fill={K}>STORED IN: PHONE</text></g>
    {t > c2 && <MGChip x={540} y={1210} text="EFFICIENT, NOT BROKEN" col={A} size={48} pop={(t - c2) / 0.25} />}</g>);
}

/* 4 — the study: a monitor shows a trivia statement being typed; journal chip */
function MGTriviaStudy({ T, t, beats }) {
  const s1 = "AN OSTRICH'S EYE IS", s2 = 'BIGGER THAN ITS BRAIN.', n = Math.floor((s1.length + s2.length) * EO((t - 0.3) / 1.6));
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="SCIENCE · 2011" outline size={44} pop={t / 0.25} />
    <g transform="translate(540 700)"><rect x="-400" y="-260" width="800" height="500" rx="30" fill="#2a2a34" stroke={K} strokeWidth="10" />
      <rect x="-365" y="-225" width="730" height="430" rx="12" fill="#f4efe4" /><rect x="-60" y="240" width="120" height="90" fill="#2a2a34" /><rect x="-200" y="320" width="400" height="30" rx="10" fill="#2a2a34" />
      <text x="-320" y="-60" fontFamily={OS} fontWeight="700" fontSize="46" fill="#1a1720">{s1.slice(0, Math.min(n, s1.length))}</text>
      <text x="-320" y="20" fontFamily={OS} fontWeight="700" fontSize="46" fill="#1a1720">{s2.slice(0, Math.max(0, n - s1.length))}</text></g>
    <MGPerson x={540} y={1340} s={1.9} who={MG.extra(5)} mouth="flat" brow="flat" look={[0, -1]} bl={BL(T)} />
    <rect x="300" y="1150" width="480" height="60" rx="14" fill="#3a3a46" stroke={K} strokeWidth="6" /></g>);
}

/* 5 — two monitors: "WILL BE SAVED" vs "WILL BE ERASED"; the saved side's memory bubble is nearly empty */
function MGSavedLess({ T, t, beats }) {
  const c3 = b(beats, 2, 1.4);
  return (<g><MGBg kind="navy" />
    {[[290, 'WILL BE SAVED', '#4f9d78', 1], [790, 'WILL BE ERASED', R, 4]].map(([x, w, col, n], i) => (<g key={i}>
      <rect x={x - 220} y={300} width="440" height="280" rx="24" fill="#2a2a34" stroke={K} strokeWidth="8" /><rect x={x - 195} y={325} width="390" height="230" rx="10" fill={col} />
      <text x={x} y={460} textAnchor="middle" fontFamily={BB} fontSize="56" fill="#fff">{w}</text>
      <MGHead x={x} y={1040} r={110} who={MG.extra(i ? 8 : 3)} mouth={i ? 'smile' : 'flat'} brow={i ? 'up' : 'worried'} look={[0, -1]} bl={BL(T, i)} />
      {[...Array(n)].map((_, k) => <rect key={k} x={x - 150 + (k % 2) * 160} y={700 + Math.floor(k / 2) * 90} width="140" height="60" rx="14" fill="#fff" stroke={K} strokeWidth="5" opacity={SM(0.3 + k * 0.15, 0.6 + k * 0.15, t)} />)}</g>))}
    {t > c3 && <MGChip x={290} y={1220} text="REMEMBERED LESS" col={R} txt="#fff" size={42} pop={(t - c3) / 0.25} />}</g>);
}

/* 6 — folders: the fact is fuzzy, but the folder it was saved in lights up */
function MGRememberWhere({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6);
  return (<g><MGBg kind="wall" c1="#d9e3ee" c2="#9fb0c4" />
    <MGChip x={540} y={200} text="WHERE > WHAT" col={A} size={56} pop={t / 0.25} />
    {[['FACTS', 260, 560], ['ITEMS', 800, 560], ['DATA', 260, 960], ['NAMES', 800, 960]].map(([l, x, y], i) => <Folder key={l} x={x} y={y} s={1.3} label={l} col={i === 2 ? '#e0743a' : '#6a7bd1'} lit={i === 2 ? SM(c1, c1 + 0.3, t) : 0} />)}
    <MGRing cx={260} cy={960} rx={230} ry={170} p={(t - c1) / 0.4} />
    <g opacity={0.35}><text x={800} y={1240} textAnchor="middle" fontFamily={BB} fontSize="64" fill="#5a6378">OSTRICH... EYE... ?</text></g></g>);
}

/* 7 — name it: GOOGLE EFFECT title with a pulsing search bar */
function MGNameGoogle({ T, t }) {
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGTitle lines={[['THE GOOGLE', A, 170], ['EFFECT', '#fff', 150]]} y={250} a={EO((t - 0.15) / 0.35)} />
    <g transform={`translate(0 ${Math.sin(T * 2) * 10})`}><Search x={540} y={900} w={760} text="" k={(t - 0.4) / 0.4} T={T} /></g>
    <MGPerson x={540} y={1300} s={1.7} who="milo" mouth="smile" brow="up" look={[0, -1]} bl={BL(T)} /></g>);
}

/* 8 — self-proof: search autocomplete full of repeats; a ring lands on one */
function MGReGoogle({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6);
  const items = ['how long to boil an egg', 'how many grams in a cup', 'how to spell necessary', 'is it affect or effect'];
  return (<g><MGBg kind="wall" c1="#e9d3f0" c2="#b48ac9" />
    <Search x={540} y={360} w={880} text="how" T={T} />
    <rect x="100" y="430" width="880" height={items.length * 120 + 20} rx="30" fill="#fff" stroke={K} strokeWidth="7" />
    {items.map((s, i) => <g key={i} opacity={SM(0.2 + i * 0.15, 0.5 + i * 0.15, t)}><text x="170" y={515 + i * 120} fontFamily={OS} fontWeight="500" fontSize="40" fill="#1a1720">{s}</text>
      <circle cx="900" cy={502 + i * 120} r="22" fill="none" stroke="#9aa3b5" strokeWidth="5" /><path d={`M900 ${490 + i * 120} L900 ${502 + i * 120} L910 ${508 + i * 120}`} fill="none" stroke="#9aa3b5" strokeWidth="5" /></g>)}
    <MGRing cx={540} cy={622} rx={450} ry={70} p={(t - c3) / 0.4} rot={-3} />
    <MGBust x={540} y={1180} r={120} who="milo" mouth="wave" brow="worried" look={[0, -1]} bl={BL(T)} /></g>);
}

/* 9 — end: Milo and Nia; a giant phone between them holds a folder "MILO'S MEMORY"; question + send chips */
function MGEndFiled({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), c4 = b(beats, 4, 2.0), c6 = b(beats, 6, 3.0);
  return (<g><MGBg kind="room" />
    <MGPerson x={220} y={1300} s={2.3} who="milo" mouth="grin" brow="up" look={[1, -0.3]} bl={BL(T)} />
    <MGPerson x={860} y={1300} s={2.3} who="nia" mouth="smile" brow="up" look={[-1, -0.3]} bl={BL(T, 1)} />
    <g transform={`translate(540 860) rotate(${Math.sin(T * 1.5) * 2})`}><rect x="-170" y="-310" width="340" height="620" rx="46" fill="#18161d" stroke={K} strokeWidth="8" /><rect x="-148" y="-280" width="296" height="560" rx="28" fill="#3a4a8a" />
      <Folder x={0} y={0} s={0.9} label="MEMORY" col="#e0743a" lit={SM(c3 - 0.2, c3 + 0.2, t)} /></g>
    {t > c4 && <MGChip x={540} y={240} text="WHAT DO YOU RE-GOOGLE?" col={A} size={46} pop={(t - c4) / 0.25} />}
    {t > c6 && <MGChip x={540} y={350} text="SEND IT TO THAT FRIEND" outline size={40} pop={(t - c6) / 0.25} />}</g>);
}

Object.assign(window, { MGMiloGoogle, MGGoneToday, MGEfficient, MGTriviaStudy, MGSavedLess, MGRememberWhere, MGNameGoogle, MGReGoogle, MGEndFiled });
})();
