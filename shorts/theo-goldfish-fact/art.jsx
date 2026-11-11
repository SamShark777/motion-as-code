// art.jsx — "Why You Believe Things You've Heard Twice" (Theo ep. 8, with Milo; ted-MG motion graphics).
// Illusory truth effect: Hasher, Goldstein & Toppino 1977 (repeated plausible statements rated more valid, true or false);
// Fazio et al. 2015 (knowledge does not protect). No study numbers on screen. Full 1080×1920 frames with tedmg-kit.jsx;
// captions at y ≈ 1480 — faces stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GREEN = '#4f9d78';

// goldfish bowl with a fish swimming a slow figure-eight (centre x,y, scale s)
function Bowl({ x, y, s = 1, T }) {
  const fx = Math.sin(T * 0.9) * 70, fy = Math.sin(T * 1.8) * 22, dir = Math.cos(T * 0.9) >= 0 ? 1 : -1;
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="150" rx="150" ry="22" fill="#000" opacity="0.18" />
    <path d="M-110 -150 Q-200 -40 -150 80 Q-110 150 0 150 Q110 150 150 80 Q200 -40 110 -150 Z" fill="#bfe6f2" stroke={K} strokeWidth="8" opacity="0.95" />
    <path d="M-178 -30 Q0 -10 178 -30 Q200 60 150 80 Q110 150 0 150 Q-110 150 -150 80 Q-200 60 -178 -30 Z" fill="#6cc3dd" opacity="0.8" />
    <ellipse cx="0" cy="-150" rx="112" ry="20" fill="#e3f4fa" stroke={K} strokeWidth="7" />
    {[0, 1, 2].map((i) => { const p = (T * 0.5 + i / 3) % 1; return <circle key={i} cx={fx * 0.5 + 30 + i * 12} cy={40 - p * 160} r={6 + i * 2} fill="none" stroke="#fff" strokeWidth="3" opacity={1 - p} />; })}
    <g transform={`translate(${fx} ${50 + fy}) scale(${dir} 1)`}>
      <path d="M-40 0 L-80 -32 L-72 0 L-80 32 Z" fill="#f08a2b" stroke={K} strokeWidth="5" strokeLinejoin="round" transform={`rotate(${Math.sin(T * 9) * 8} -40 0)`} />
      <ellipse cx="0" cy="0" rx="50" ry="32" fill="#f39c3a" stroke={K} strokeWidth="6" />
      <circle cx="24" cy="-6" r="8" fill="#fff" stroke={K} strokeWidth="3" /><circle cx="26" cy="-6" r="4" fill={K} /></g>
    <path d="M-120 -110 Q-150 -20 -120 60" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
  </g>);
}
function Table({ y = 1230 }) {
  return (<g><rect x="-60" y={y} width="1200" height="40" rx="12" fill="#8c6a4a" stroke={K} strokeWidth="6" /><rect x="-60" y={y + 40} width="1200" height="700" fill="#6b4d33" /></g>);
}
// a cream card with a statement, an optional verdict stamp
function Card({ x, y, w = 700, text, k = 1, rot = 0, col = '#fff', size = 46 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k)})`}><rect x={-w / 2} y="-70" width={w} height="140" rx="22" fill={col} stroke={K} strokeWidth="7" />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BB} fontSize={size} fill="#1a1720">{text}</text></g>);
}

/* 1 — Theo at the kitchen table tells the goldfish "fact"; the same bubble echoes, a HEARD IT counter ticks up to 100× */
function MGTheoGoldfish({ T, t, beats }) {
  const c1 = b(beats, 1, 0.8), n = Math.round(lp(1, 100, EO((t - c1) / 1.4)));
  return (<g><MGBg kind="wall" c1="#ffe2b8" c2="#e9b98a" />
    <Table y={1230} />
    <Bowl x={790} y={1060} s={1.05} T={T} />
    <MGBust x={290} y={820} r={150} who="theo" mouth="o" brow="up" look={[0.8, 0.2]} bl={BL(T)} />
    {[0, 1, 2].map((i) => { const s0 = i * 0.45; const k = (t - s0) / 0.3; return k > 0 && <g key={i} opacity={i === 2 ? 1 : 0.35 + i * 0.2}><MGBubble x={580 - i * 20} y={260 + i * 130} text="GOLDFISH FORGET|IN 3 SECONDS" size={[42, 50, 64][i]} k={k} /></g>; })}
    {t > c1 && <MGChip x={300} y={1130} text={`HEARD IT: ${n}×`} col={A} size={46} pop={(t - c1) / 0.25} />}</g>);
}

/* 2 — you: the same "fact" arrives from everywhere (TV, friend, phone, poster); the CHECKED box stays empty */
function MGYouHeard({ T, t, beats }) {
  const c2 = b(beats, 2, 1.4);
  const src = [['TV', 260, 300, -6], ['A FRIEND', 820, 280, 5], ['A POST', 260, 660, 4], ['A QUIZ', 820, 680, -4], ['UNCLE', 540, 480, 0]];
  return (<g><MGBg kind="room" />
    {src.map(([s, x, y, r], i) => <g key={s}><Card x={x} y={y} w={440} text={`${s}: "3 SECONDS"`} size={50} rot={r} k={(t - 0.1 - i * 0.18) / 0.3} col={i % 2 ? '#fff6e0' : '#fff'} /></g>)}
    <MGPerson x={460} y={1330} s={2.9} who="milo" mouth="smile" brow="up" look={[0, -1]} bl={BL(T)} />
    <g transform="translate(830 1060)"><rect x="-150" y="-60" width="300" height="120" rx="18" fill="#fff" stroke={K} strokeWidth="7" />
      <rect x="-125" y="-30" width="60" height="60" rx="8" fill="none" stroke={K} strokeWidth="7" />
      <text x="-45" y="18" fontFamily={BB} fontSize="52" fill="#1a1720">CHECKED</text></g>
    <MGRing cx={830} cy={1060} rx={200} ry={100} p={(t - c2) / 0.4} /></g>);
}

/* 3 — snapback: a big dial swings from EASY into TRUE with a green tick; Theo's head under a spotlight */
function MGEasyTrue({ T, t, beats }) {
  const c2 = b(beats, 2, 1.2), sw = EO((t - c2) / 0.5), ang = lp(-60, 60, sw) + Math.sin(T * 6) * 2 * sw;
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <g transform="translate(540 640)"><path d="M-330 0 A330 330 0 0 1 330 0 Z" fill="#fff" stroke={K} strokeWidth="9" />
      <path d="M-330 0 A330 330 0 0 1 0 -330 L0 0 Z" fill="#f6d68a" /><path d="M0 -330 A330 330 0 0 1 330 0 L0 0 Z" fill="#9fd8b6" />
      <text x="-170" y="-90" textAnchor="middle" fontFamily={BB} fontSize="74" fill="#1a1720">EASY</text>
      <text x="170" y="-90" textAnchor="middle" fontFamily={BB} fontSize="74" fill="#1a1720">TRUE</text>
      <g transform={`rotate(${ang})`}><path d="M-14 0 L0 -290 L14 0 Z" fill={R} stroke={K} strokeWidth="5" /></g><circle r="30" fill={K} />
      {sw > 0.6 && <g transform={`translate(230 -260) scale(${BK((t - c2 - 0.3) / 0.3)})`}><circle r="50" fill={GREEN} stroke={K} strokeWidth="6" /><path d="M-22 0 L-6 18 L24 -18" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" /></g>}</g>
    <MGHead x={540} y={1010} r={150} who="theo" mouth={t > c2 ? 'o' : 'flat'} brow="up" look={[0.4, -0.8]} bl={BL(T)} /></g>);
}

/* 4 — the study: statement cards on a desk, a calendar flips WEEK 0 → 2 → 4 */
function MGHasherStudy({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), wk = t < c3 ? 0 : t < c3 + 0.6 ? 2 : 4;
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="1977 STUDY" outline size={46} pop={t / 0.25} />
    <g transform={`translate(540 520)`}><rect x="-200" y="-150" width="400" height="300" rx="24" fill="#fff" stroke={K} strokeWidth="8" /><rect x="-200" y="-150" width="400" height="90" rx="24" fill={R} stroke={K} strokeWidth="8" />
      <text y="-88" textAnchor="middle" fontFamily={BB} fontSize="56" fill="#fff">SESSION</text>
      <text y="100" textAnchor="middle" fontFamily={BB} fontSize="130" fill="#1a1720">{`WEEK ${wk}`}</text></g>
    {['TRUE OR FALSE?', 'TRUE OR FALSE?', 'TRUE OR FALSE?'].map((s, i) => <Card key={i} x={540 + (i - 1) * 40} y={880 + i * 90} w={720} text={s} size={50} rot={(i - 1) * 3} k={(t - c3 + 0.6 - i * 0.12) / 0.3} col={i === 2 ? '#fff6e0' : '#fff'} />)}
    <MGPerson x={190} y={1330} s={1.7} who={MG.extra(2)} mouth="flat" brow="flat" look={[1, -0.4]} bl={BL(T)} />
    <MGPerson x={890} y={1330} s={1.7} who={MG.extra(7)} mouth="flat" brow="worried" look={[-1, -0.4]} bl={BL(T, 1)} /></g>);
}

/* 5 — two piles: NEW vs SEEN BEFORE; the SEEN pile's "feels true" bar rises higher; a FALSE card sneaks in, still rising */
function MGRepeatTrue({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c2 = b(beats, 2, 1.3), hNew = 220 * EO((t - 0.2) / 0.8), hOld = 420 * EO((t - c1) / 0.9);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="FEELS TRUE" col={A} size={52} pop={t / 0.25} />
    {[[300, 'NEW', hNew, '#6a7bd1'], [780, 'SEEN BEFORE', hOld, GREEN]].map(([x, l, h, col], i) => (<g key={i}>
      <rect x={x - 120} y={1100 - h} width="240" height={h} rx="16" fill={col} stroke={K} strokeWidth="8" />
      <rect x={x - 180} y="1100" width="360" height="16" rx="8" fill="#fff" />
      <text x={x} y="1190" textAnchor="middle" fontFamily={BB} fontSize="60" fill="#fff">{l}</text></g>))}
    {t > c2 && <g transform={`translate(780 ${1100 - hOld - 110}) rotate(-6) scale(${BK((t - c2) / 0.3)})`}><rect x="-150" y="-50" width="300" height="100" rx="14" fill="#fff" stroke={R} strokeWidth="8" />
      <text y="20" textAnchor="middle" fontFamily={BB} fontSize="60" fill={R}>FALSE ONES TOO</text></g>}</g>);
}

/* 6 — turn: Milo holds a FACTS book like a shield; the repeated bubble bounces off it and still cracks it */
function MGKnowBetter({ T, t, beats }) {
  const c2 = b(beats, 1, 0.9), hit = SM(c2 - 0.3, c2, t), crack = SM(c2, c2 + 0.3, t);
  const bx = lp(1200, 700, hit);
  return (<g><MGBg kind="wall" c1="#d9e3ee" c2="#9fb0c4" />
    <MGBust x={330} y={760} r={150} who="milo" mouth={t > c2 ? 'o' : 'flat'} brow="worried" look={[1, 0]} bl={BL(T)} />
    <g transform={`translate(560 1010) rotate(${-8 + hit * 6 * Math.sin(T * 30) * (1 - crack)})`}><path d="M-120 -170 L120 -170 L120 60 Q120 170 0 210 Q-120 170 -120 60 Z" fill="#6a7bd1" stroke={K} strokeWidth="9" />
      <text y="-40" textAnchor="middle" fontFamily={BB} fontSize="64" fill="#fff">I KNOW</text><text y="30" textAnchor="middle" fontFamily={BB} fontSize="64" fill="#fff">BETTER</text>
      {crack > 0 && <path d="M40 -170 L10 -90 L50 -40 L0 40 L30 110" fill="none" stroke={K} strokeWidth="8" strokeLinecap="round" strokeDasharray="420" strokeDashoffset={420 * (1 - crack)} />}</g>
    <g transform={`translate(${bx} 560)`}><MGBubble x={0} y={0} text="3 SECONDS!|3 SECONDS!" size={58} k={1} /></g>
    {t > c2 + 0.2 && <MGChip x={540} y={240} text="NOT FULLY PROTECTED" col={R} txt="#fff" size={46} pop={(t - c2 - 0.2) / 0.25} />}</g>);
}

/* 7 — name it: ILLUSORY TRUTH EFFECT title, the bowl glowing under the spotlight */
function MGNameTruth({ T, t }) {
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGTitle lines={[['THE ILLUSORY', '#fff', 130], ['TRUTH EFFECT', A, 170]]} y={250} a={EO((t - 0.15) / 0.35)} />
    <MGGlow x={540} y={1000} r={330} col={A} a={0.35} />
    <Bowl x={540} y={1000} s={1.4} T={T} /></g>);
}

/* 8 — self-proof: a corkboard of "facts" with question marks; one card gets ringed */
function MGNeverChecked({ T, t, beats }) {
  const c2 = b(beats, 2, 1.6);
  const facts = [['GUM: 7 YEARS?', 300, 380, -5], ['10% OF YOUR BRAIN?', 760, 400, 4], ['WAIT 24 HOURS?', 290, 700, 3], ['???', 770, 720, -3]];
  return (<g><MGBg kind="wall" c1="#e9d3f0" c2="#b48ac9" />
    <rect x="80" y="210" width="920" height="720" rx="24" fill="#c9965a" stroke={K} strokeWidth="9" />
    {facts.map(([s, x, y, r], i) => <g key={i}><Card x={x} y={y} w={400} text={s} size={42} rot={r} k={(t - 0.1 - i * 0.18) / 0.3} col="#fff6e0" />
      <circle cx={x} cy={y - 66} r="12" fill={R} stroke={K} strokeWidth="4" opacity={SM(0.2 + i * 0.18, 0.4 + i * 0.18, t)} /></g>)}
    <MGRing cx={770} cy={720} rx={240} ry={110} p={(t - c2) / 0.4} rot={-4} />
    <MGBust x={540} y={1170} r={120} who="milo" mouth="wave" brow="worried" look={[0.4, -1]} bl={BL(T)} /></g>);
}

/* 9 — end: Theo reads his phone (GOLDFISH MEMORY: MONTHS), Milo laughs; question + send chips */
function MGEndGoldfish({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c4 = b(beats, 4, 2.0), c6 = b(beats, 6, 3.0);
  return (<g><MGBg kind="room" />
    <Table y={1240} />
    <Bowl x={860} y={1080} s={0.75} T={T} />
    <MGPerson x={250} y={1300} s={2.3} who="theo" mouth={t > c1 ? 'o' : 'flat'} brow="up" look={[0.6, -0.6]} bl={BL(T)} />
    <MGPerson x={600} y={1300} s={2.3} who="milo" mouth="grin" brow="up" look={[-1, -0.2]} bl={BL(T, 1)} />
    <g transform={`translate(330 640) rotate(-4)`}><rect x="-170" y="-200" width="340" height="400" rx="40" fill="#18161d" stroke={K} strokeWidth="8" /><rect x="-148" y="-172" width="296" height="344" rx="24" fill="#3a4a8a" />
      <text y="-90" textAnchor="middle" fontFamily={OS} fontWeight="500" fontSize="32" fill="#fff">goldfish memory</text>
      {t > c1 - 0.2 && <g transform={`scale(${BK((t - c1 + 0.2) / 0.3)})`}><text y="40" textAnchor="middle" fontFamily={BB} fontSize="110" fill={A}>MONTHS</text></g>}</g>
    {t > c4 && <MGChip x={700} y={240} text="WHICH 'FACT' FOOLED YOU?" col={A} size={42} pop={(t - c4) / 0.25} />}
    {t > c6 && <MGChip x={700} y={340} text="SEND IT TO THAT FRIEND" outline size={38} pop={(t - c6) / 0.25} />}</g>);
}

Object.assign(window, { MGTheoGoldfish, MGYouHeard, MGEasyTrue, MGHasherStudy, MGRepeatTrue, MGKnowBetter, MGNameTruth, MGNeverChecked, MGEndGoldfish });
})();
