// art.jsx — "You Can't Explain How a Zipper Works" (Dev ep. 10, with Theo; ted-MG motion graphics).
// Illusion of explanatory depth: Rozenblit & Keil 2002 (Cognitive Science) — Yale students rated how well they understood
// everyday devices, wrote explanations, and their self-ratings dropped. No numbers on screen (bars only).
// Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GOOD = '#5fbf7a', PAPER = '#fbf7ee', BOARD = '#f7f5ef';

/* a big zipper: two tapes of teeth with a slider at height `open` (0 closed..1 open) */
function Zipper({ x, y, s = 1, rot = 0, open = 0.4 }) {
  const n = 12, gap = (i) => (i / n < open ? lp(0, 46, SM(0, 1, (open - i / n) * 3)) : 0);
  const sy = -300 + open * 600;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-1, 1].map((sd) => <rect key={sd} x={sd < 0 ? -150 : 40} y="-320" width="110" height="640" rx="10" fill="#3f7fbf" stroke={K} strokeWidth="7" />)}
    {[...Array(n)].map((_, i) => { const yy = -290 + i * 50, g = gap(i); return (<g key={i}>
      <rect x={-46 - g} y={yy} width="44" height="28" rx="6" fill="#d9d4c7" stroke={K} strokeWidth="5" />
      <rect x={2 + g} y={yy + 22} width="44" height="28" rx="6" fill="#d9d4c7" stroke={K} strokeWidth="5" /></g>); })}
    <g transform={`translate(0 ${sy})`}><path d="M-60 -40 L60 -40 L44 50 L-44 50 Z" fill="#b8b8b8" stroke={K} strokeWidth="7" strokeLinejoin="round" />
      <rect x="-22" y="40" width="44" height="120" rx="20" fill="#9a9a9a" stroke={K} strokeWidth="7" /></g>
  </g>);
}
function Toilet({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-70" y="-200" width="140" height="120" rx="14" fill="#fff" stroke={K} strokeWidth="7" />
    <path d="M-110 -70 L110 -70 Q100 40 40 70 L40 120 L-40 120 L-40 70 Q-100 40 -110 -70 Z" fill="#fff" stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <rect x="40" y="-180" width="40" height="14" rx="6" fill="#b8b8b8" stroke={K} strokeWidth="4" /></g>);
}
function Fridge({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-170" y="-330" width="340" height="660" rx="30" fill="#e8eef2" stroke={K} strokeWidth="9" />
    <line x1="-170" y1="-90" x2="170" y2="-90" stroke={K} strokeWidth="7" />
    <rect x="120" y="-280" width="18" height="140" rx="8" fill="#9a9a9a" stroke={K} strokeWidth="5" /><rect x="120" y="-40" width="18" height="200" rx="8" fill="#9a9a9a" stroke={K} strokeWidth="5" />
    {[['#E5483B', -90, -200], ['#F6B92E', -30, -230], ['#5fbf7a', -110, 30]].map(([c, mx, my], i) => <circle key={i} cx={mx} cy={my} r="20" fill={c} stroke={K} strokeWidth="4" />)}</g>);
}
function MiniPhone({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-80" y="-150" width="160" height="300" rx="26" fill="#18161d" stroke={K} strokeWidth="7" /><rect x="-64" y="-126" width="128" height="252" rx="14" fill="#3a4a8a" /></g>);
}
function Tick({ x, y, k }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}><circle r="44" fill={GOOD} stroke={K} strokeWidth="6" /><path d="M-20 2 L-5 18 L22 -14" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>);
}
/* whiteboard on an easel */
function Board({ x, y, w = 760, h = 560, children }) {
  return (<g><path d={`M${x - w * 0.3} ${y + h / 2} L${x - w * 0.4} ${y + h / 2 + 360} M${x + w * 0.3} ${y + h / 2} L${x + w * 0.4} ${y + h / 2 + 360}`} stroke="#6b4d33" strokeWidth="18" strokeLinecap="round" />
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="14" fill={BOARD} stroke={K} strokeWidth="10" />{children}</g>);
}
/* understanding bars for 4 devices; v[i] 0..1 */
function Bars({ v, hot = -1 }) {
  const names = ['ZIPPER', 'TOILET', 'LOCK', 'SPEEDOMETER'];
  return (<g>{names.map((n, i) => { const y = 560 + i * 170; return (<g key={i}>
    <text x="150" y={y} fontFamily={BB} fontSize="58" letterSpacing="3" fill="#fff">{n}</text>
    <rect x="150" y={y + 22} width="780" height="56" rx="28" fill="#2a3150" stroke="#fff" strokeWidth="4" />
    <rect x="156" y={y + 28} width={Math.max(0, 768 * cl(v[i]))} height="44" rx="22" fill={i === hot ? R : A} /></g>); })}
    <text x="150" y="450" fontFamily={OS} fontWeight="700" fontSize="36" letterSpacing="4" fill="#fff" opacity="0.7">"HOW WELL DO I UNDERSTAND IT?"</text></g>);
}

/* 1 — Dev, smug, next to a giant zipper; "EASY." chip */
function MGZipperBet({ T, t, beats }) {
  const c3 = b(beats, 3, 1.5);
  return (<g><MGBg kind="room" />
    <MGBust x={380} y={800} r={175} who="dev" look={[0.6, -0.2]} brow="up" mouth="grin" bl={BL(T)} />
    <Zipper x={820} y={760} s={0.8} rot={8} open={0.35 + 0.15 * osc(T, 1.6)} />
    {t > c3 && <MGRing cx={825} cy={760} rx={170} ry={300} p={(t - c3) / 0.4} rot={8} />}
    <MGChip x={540} y={170} text="THEO'S FLAT · 8:15 PM" size={40} pop={t / 0.25} />
    <MGChip x={380} y={420} text="EASY." size={52} pop={(t - 0.2) / 0.25} /></g>);
}

/* 2 — you too: zipper, toilet, phone, each gets a confident green tick */
function MGYouNod({ T, t, beats }) {
  return (<g><MGBg kind="wall" c1="#2f3d5c" c2="#1a2238" />
    <Zipper x={220} y={760} s={0.5} open={0.4} /><Toilet x={540} y={800} s={1.2} /><MiniPhone x={860} y={780} s={1.3} />
    {[220, 540, 860].map((x, i) => <Tick key={i} x={x + 70} y={500} k={(t - 0.2 - i * 0.3) / 0.3} />)}
    <MGChip x={540} y={240} text="I KNOW HOW IT WORKS" size={42} pop={(t - 0.1) / 0.25} />
    <MGHead x={540} y={1230} r={110} who={MG.extra(4)} look={[0, -0.8]} brow="up" mouth="smile" bl={BL(T, 0.4)} /></g>);
}

/* 3 — snapback: Theo hands Dev a marker; empty whiteboard; Dev blanks */
function MGExplainIt({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  const blank = t > c2;
  return (<g><MGBg kind="room" dim={0.25} />
    <Board x={540} y={520} w={760} h={480}>
      <text x="540" y="430" textAnchor="middle" fontFamily={BB} fontSize="60" letterSpacing="3" fill={K}>HOW A ZIPPER WORKS:</text>
      {blank && <text x="540" y={640 + osc(T, 0.8) * 6} textAnchor="middle" fontFamily={BB} fontSize="180" fill={R} opacity={SM(c2, c2 + 0.3, t)}>?</text>}
    </Board>
    <MGBust x={280} y={1110} r={130} who="theo" look={[0.8, -0.3]} brow="up" mouth="smile" bl={BL(T, 0.5)} />
    <MGBust x={800} y={1090} r={150} who="dev" look={blank ? [0, 0] : [-0.8, -0.3]} brow={blank ? 'flat' : 'up'} mouth={blank ? 'flat' : 'grin'} tiny={blank} sweat={blank ? T * 0.9 : null} bl={BL(T)} />
    <MGChip x={280} y={880} text="EXPLAIN IT." size={40} pop={(t - 0.1) / 0.25} /></g>);
}

/* 4 — Dev's attempt: a scribble of teeth, an arrow to "SLIDEY BIT?", "CLICKS??" */
function MGTeethDraw({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1);
  const d = SM(0, 0.9, t);
  return (<g><MGBg kind="room" dim={0.25} />
    <Board x={540} y={560} w={860} h={640}>
      <path d={`M220 420 ${[...Array(8)].map((_, i) => `L${250 + i * 40} ${i % 2 ? 470 : 420}`).join(' ')}`} stroke={K} strokeWidth="9" fill="none" strokeLinejoin="round" strokeDasharray="900" strokeDashoffset={900 * (1 - d)} />
      <text x="230" y="560" fontFamily={BB} fontSize="64" fill={K} opacity={SM(0.2, 0.4, t)}>TEETH</text>
      <path d="M700 420 Q760 520 650 600" stroke={R} strokeWidth="10" fill="none" opacity={SM(0.5, 0.7, t)} />
      <text x="600" y="400" fontFamily={BB} fontSize="64" fill={K} opacity={SM(0.5, 0.7, t)}>SLIDEY BIT?</text>
      {t > c2 && <text x="540" y="770" textAnchor="middle" fontFamily={BB} fontSize="120" fill={R} transform={`rotate(-6 540 740)`}>CLICKS??</text>}
    </Board>
    <MGBust x={540} y={1180} r={115} who="dev" look={[0, -0.8]} brow="worried" mouth="wave" sweat={T * 1.1} bl={BL(T)} /></g>);
}

/* 5 — study 2002: rating bars rise high */
function MGYaleRate({ T, t, beats }) {
  const k = EO(t / 0.9);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="YALE STUDY · 2002" size={44} pop={t / 0.25} />
    <Bars v={[0.85, 0.8, 0.82, 0.78].map((v) => v * k)} /></g>);
}

/* 6 — after explaining: a pencil writes, the bars drop */
function MGRatingsDrop({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  const dr = SM(c2 - 0.1, c2 + 0.6, t);
  const v = [0.85, 0.8, 0.82, 0.78].map((x, i) => lp(x, x * [0.45, 0.5, 0.55, 0.4][i], dr));
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="AFTER EXPLAINING" size={44} col={R} txt="#fff" pop={t / 0.25} />
    <Bars v={v} hot={dr > 0.2 ? 0 : -1} />
    <g transform={`translate(${lp(700, 860, SM(0, c2, t))} ${1230 + osc(T, 0.25) * 8}) rotate(35)`}>
      <rect x="-18" y="-120" width="36" height="200" rx="6" fill={A} stroke={K} strokeWidth="6" /><path d="M-18 80 L0 130 L18 80 Z" fill="#e9d2b8" stroke={K} strokeWidth="5" /></g></g>);
}

/* 7 — name it: an iceberg — tiny "KNOW" tip, a huge hidden "?" body */
function MGIllusion({ T, t, beats }) {
  const c3 = b(beats, 3, 1.5);
  const dive = SM(0.2, 1.2, t);
  return (<g><MGBg kind="navy" />
    <rect x="-300" y="560" width="1680" height="1500" fill="#1f4f74" opacity="0.9" />
    <path d="M-300 560 Q-150 540 0 560 T300 560 T600 560 T900 560 T1200 560 T1500 560" stroke="#bfe3ef" strokeWidth="8" fill="none" />
    <path d="M440 560 L520 400 L600 460 L650 560 Z" fill="#fff" stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <text x="545" y="535" textAnchor="middle" fontFamily={BB} fontSize="60" fill={K}>KNOW</text>
    <g opacity={dive}><path d="M440 560 L230 820 L300 1150 L560 1300 L820 1130 L880 820 L650 560 Z" fill="#cfe9f2" opacity="0.55" stroke="#fff" strokeWidth="6" />
      <text x="555" y="1010" textAnchor="middle" fontFamily={BB} fontSize="260" fill={R} opacity="0.85">?</text></g>
    <MGTitle y={210} lines={[['ILLUSION OF', '#fff', 84], ['EXPLANATORY DEPTH', t > c3 ? A : '#fff', 88]]} a={SM(0, 0.3, t)} /></g>);
}

/* 8 — your turn: a fridge, a "HOW?" and a countdown chip */
function MGYourTurn({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  const sec = Math.max(0, 5 - Math.floor(t / 0.4));
  return (<g><MGBg kind="room" />
    <Fridge x={540} y={760} s={1.2} />
    <MGChip x={540} y={220} text="YOUR TURN · HOW DOES IT STAY COLD?" size={34} pop={t / 0.25} />
    {t > c3 ? <MGRing cx={540} cy={760} rx={260} ry={420} p={(t - c3) / 0.4} rot={-4} />
      : <MGChip x={840} y={1240} text={`0:0${sec}`} size={52} outline pop={1} />}
    <MGHead x={200} y={1240} r={95} who={MG.extra(7)} look={[1, -0.7]} brow="worried" mouth="wave" sweat={T} bl={BL(T, 0.2)} /></g>);
}

/* 9 — payoff: Dev laughs it off; Theo grins */
function MGDevLaughs({ T, t, beats }) {
  const c3 = b(beats, 3, 1.3);
  const hop = Math.abs(osc(T, 0.5)) * 14;
  return (<g><MGBg kind="room" />
    <MGPerson x={330} y={1300} s={2.5} who="theo" look={[1, -0.3]} mouth="grin" brow="up" bl={BL(T, 0.3)} />
    <MGPerson x={760} y={1300 - hop} s={2.5} who="dev" look={[-1, -0.3]} mouth="grin" brow="up" bl={BL(T)} />
    <MGBubble x={760} y={560} text={'I KNOW HOW|TO USE ONE'} k={(t - 0.3) / 0.3} size={46} />
    {t > c3 && <MGChip x={760} y={250} text="USE ≠ UNDERSTAND" size={40} pop={(t - c3) / 0.25} />}</g>);
}

/* 10 — end: Dev zips his jacket, cheerfully; the question chip */
function MGEndZip({ T, t, beats }) {
  const z = SM(0.1, 1.0, t);
  return (<g><MGBg kind="street" T={T} />
    <MGBust x={540} y={760} r={170} who="dev" shirt="#c9574a" look={[0, -0.2]} brow="up" mouth="grin" bl={BL(T)} />
    <rect x="526" y={lp(1700, 990, z)} width="28" height="900" fill="#d9d4c7" stroke={K} strokeWidth="5" />
    <g transform={`translate(540 ${lp(1700, 990, z)})`}><rect x="-26" y="-30" width="52" height="60" rx="8" fill="#b8b8b8" stroke={K} strokeWidth="6" /><rect x="-12" y="26" width="24" height="70" rx="10" fill="#9a9a9a" stroke={K} strokeWidth="5" /></g>
    <MGChip x={540} y={200} text="COULD YOU EXPLAIN IT?" size={44} pop={t / 0.25} /></g>);
}

Object.assign(window, { MGZipperBet, MGYouNod, MGExplainIt, MGTeethDraw, MGYaleRate, MGRatingsDrop, MGIllusion, MGYourTurn, MGDevLaughs, MGEndZip });
})();
