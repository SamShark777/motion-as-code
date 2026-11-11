// art.jsx — "Why You Go Even When You Don't Want To" (Dev ep. 8, with Nia; ted-MG motion graphics).
// Sunk cost effect: Arkes & Blumer 1985 (OBHDP) — Ohio University theater season tickets sold at randomly assigned prices;
// full-price buyers attended more plays in the first half of the season. No numbers on screen. Full 1080×1920 frames with
// tedmg-kit.jsx; captions at y ≈ 1480 — faces stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GREEN = '#4f9d78', BLUE = '#3f7fbf';

function Ticket({ x, y, s = 1, rot = 0, label = 'CONCERT', sub = 'ADMIT ONE', col = A, k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k) * s})`}>
    <path d="M-230 -100 L230 -100 L230 -30 A30 30 0 0 0 230 30 L230 100 L-230 100 L-230 30 A30 30 0 0 0 -230 -30 Z" fill={col} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <line x1="120" y1="-90" x2="120" y2="90" stroke={K} strokeWidth="5" strokeDasharray="12 10" />
    <text x="-50" y="10" textAnchor="middle" fontFamily={BB} fontSize="80" fill="#1a1720">{label}</text>
    <text x="-50" y="60" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="28" fill="#1a1720">{sub}</text>
    <text x="175" y="18" textAnchor="middle" fontFamily={BB} fontSize="50" fill="#1a1720" transform="rotate(-90 175 0)">PAID</text></g>);
}
function Rain({ T, a = 1, n = 36 }) {
  return <g>{[...Array(n)].map((_, i) => { const x = hsh(i) * 1100, sp = 1000 + hsh(i + 9) * 500, y = ((T * sp + hsh(i + 3) * 2000) % 1500) - 100; return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 50} stroke="#e6f2ff" strokeWidth="5" strokeLinecap="round" opacity={0.7 * a} />; })}</g>;
}
function Thermo({ x, y, s = 1, T }) {
  return (<g transform={`translate(${x} ${y}) rotate(-25) scale(${s})`}><rect x="-16" y="-120" width="32" height="160" rx="16" fill="#fff" stroke={K} strokeWidth="6" />
    <rect x="-7" y={-100 + Math.sin(T * 3) * 6} width="14" height={130 - Math.sin(T * 3) * 6} rx="7" fill={R} /><circle cx="0" cy="50" r="26" fill={R} stroke={K} strokeWidth="6" /></g>);
}

/* 1 — Dev at the window, rain outside, scarf + thermometer, the PAID concert ticket held up */
function MGDevTicket({ T, t, beats }) {
  const c2 = b(beats, 2, 1.3);
  return (<g><MGBg kind="roomNight" />
    <g transform="translate(540 520)"><rect x="-330" y="-300" width="660" height="560" rx="20" fill="#2a3150" stroke={K} strokeWidth="10" /><line x1="0" y1="-300" x2="0" y2="260" stroke={K} strokeWidth="10" /><line x1="-330" y1="-20" x2="330" y2="-20" stroke={K} strokeWidth="10" /></g>
    <Rain T={T} a={SM(0, 0.4, t)} n={26} />
    <MGBust x={420} y={980} r={150} who="dev" mouth="frown" brow="worried" look={[0.6, -0.4]} bl={BL(T)} sweat={t > c2 ? 1 : null} />
    <path d={`M${260} ${1120} Q420 ${1180} 580 1120 L600 1200 Q420 1260 240 1200 Z`} fill={R} stroke={K} strokeWidth="7" />
    <Thermo x={290} y={1030} s={0.9} T={T} />
    <Ticket x={780} y={720 + Math.sin(T * 1.6) * 8} s={0.95} rot={-8} k={(t - 0.1) / 0.3} />
    {t > c2 && <MGChip x={420} y={250} text="SICK + POURING" col={R} txt="#fff" size={50} pop={(t - c2) / 0.25} />}</g>);
}

/* 2 — you: a stack of PAID things (gym card, ticket, course, buffet plate) all pointing at a tired figure: HAVE TO */
function MGYouPaid({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1);
  const items = [['GYM PASS', 250, 360, -8, '#6a7bd1'], ['ONLINE COURSE', 800, 330, 6, GREEN], ['BUFFET', 270, 660, 5, '#f08a4b'], ['TICKET', 810, 650, -5, A]];
  return (<g><MGBg kind="room" />
    {items.map(([l, x, y, r, c], i) => <Ticket key={l} x={x} y={y} s={0.68} rot={r} label={l} sub="ALREADY PAID" col={c} k={(t - 0.1 - i * 0.15) / 0.3} />)}
    <MGPerson x={540} y={1320} s={2.7} who="dev" mouth="frown" brow="worried" look={[0, -1]} bl={BL(T)} />
    {t > c2 && <MGChip x={540} y={900} text="HAVE TO" col={R} txt="#fff" size={60} pop={(t - c2) / 0.25} />}</g>);
}

/* 3 — snapback: the money flies out of an open wallet and away; going or not, the wallet stays empty */
function MGMoneyGone({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <g transform="translate(540 960)"><rect x="-220" y="-130" width="440" height="260" rx="30" fill="#8c5a3c" stroke={K} strokeWidth="9" /><rect x="-220" y="-130" width="440" height="90" rx="30" fill="#a8744c" stroke={K} strokeWidth="9" />
      <circle cx="160" cy="0" r="22" fill={A} stroke={K} strokeWidth="5" /></g>
    {[...Array(6)].map((_, i) => { const p = cl((t - 0.1 - i * 0.12) / 1.4), x = 540 + (i - 2.5) * 70 + Math.sin(p * 6 + i) * 60 * p, y = 860 - p * 760;
      return p > 0 && p < 1 && <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(T * 4 + i) * 25})`}><rect x="-70" y="-36" width="140" height="72" rx="8" fill="#9fd8b6" stroke={K} strokeWidth="5" /><circle r="20" fill="none" stroke={K} strokeWidth="4" /></g>; })}
    {t > c3 && <MGChip x={540} y={1210} text="GONE EITHER WAY" col={A} size={54} pop={(t - c3) / 0.25} />}</g>);
}

/* 4 — the study: a 1980s theater box office; tickets stamped FULL PRICE or DISCOUNT at random */
function MGArkesStudy({ T, t, beats }) {
  const c2 = b(beats, 2, 1.2);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="OHIO UNIVERSITY THEATER · 1985" outline size={38} pop={t / 0.25} />
    <g transform="translate(540 560)"><rect x="-380" y="-200" width="760" height="420" rx="20" fill="#b8321f" stroke={K} strokeWidth="9" />
      <rect x="-380" y="-260" width="760" height="100" rx="16" fill={A} stroke={K} strokeWidth="8" /><text y="-190" textAnchor="middle" fontFamily={BB} fontSize="74" fill="#1a1720">SEASON TICKETS</text>
      <rect x="-260" y="-110" width="520" height="250" rx="12" fill="#2a3150" stroke={K} strokeWidth="7" />
      <MGHead x={0} y={20} r={80} who={MG.extra(5)} mouth="smile" brow="up" look={[0, 0.4]} bl={BL(T)} /></g>
    {[0, 1, 2].map((i) => { const k = (t - c2 + 0.3 - i * 0.25) / 0.3, full = i !== 1; return <Ticket key={i} x={200 + i * 340} y={1080 + (i % 2) * 60} s={0.7} rot={(i - 1) * 8} label={full ? 'FULL PRICE' : 'DISCOUNT'} sub="SEASON 1985" col={full ? A : '#9fd8b6'} k={k} />; })}</g>);
}

/* 5 — result: two rows of seats; the FULL PRICE row is busier in the first half of the season */
function MGFullPrice({ T, t, beats }) {
  const c1 = b(beats, 1, 0.8), fill = SM(c1 - 0.2, c1 + 0.6, t);
  const row = (y, label, n, col) => (<g><text x="540" y={y - 170} textAnchor="middle" fontFamily={BB} fontSize="60" fill={col}>{label}</text>
    {[...Array(6)].map((_, i) => { const x = 140 + i * 160, on = i < n * fill; return <g key={i}><rect x={x - 60} y={y - 20} width="120" height="110" rx="20" fill="#7a2b3a" stroke={K} strokeWidth="6" />
      {on && <MGHead x={x} y={y - 40} r={52} who={MG.extra(i + (n > 3 ? 0 : 6))} mouth="smile" brow="up" look={[0, -0.5]} bl={BL(T, i * 0.4)} />}</g>; })}</g>);
  return (<g><MGBg kind="stage" />
    <MGChip x={540} y={200} text="FIRST HALF OF THE SEASON" outline size={42} pop={t / 0.25} />
    {row(560, 'PAID FULL PRICE', 5, A)}
    {row(1010, 'GOT A DISCOUNT', 3, '#9fd8b6')}</g>);
}

/* 6 — turn: one stage, one show; only the price tag on each ticket differs */
function MGSamePlays({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.45 * SM(0, 0.3, t)} />
    <MGPerson x={540} y={1000} s={2.4} who={MG.extra(3)} mouth="o" brow="up" look={[0, 0]} bl={BL(T)} />
    <MGChip x={540} y={330} text="SAME SHOW" col={A} size={60} pop={t / 0.25} />
    <Ticket x={300} y={1150} s={0.6} rot={-6} label="$$$" sub="SAME SEAT VIEW" col={A} k={(t - 0.2) / 0.3} />
    <Ticket x={780} y={1150} s={0.6} rot={6} label="$" sub="SAME SEAT VIEW" col="#9fd8b6" k={(t - 0.4) / 0.3} />
    {t > c2 && <MGRing cx={540} cy={1150} rx={470} ry={110} p={(t - c2) / 0.4} rot={0} />}</g>);
}

/* 7 — name it: SUNK COST EFFECT, a ticket slowly sinking into water */
function MGNameSunk({ T, t }) {
  const sink = SM(0.3, 2.4, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGTitle lines={[['THE SUNK', '#fff', 150], ['COST EFFECT', A, 170]]} y={250} a={EO((t - 0.15) / 0.35)} />
    <Ticket x={540} y={820 + sink * 180} s={0.9} rot={Math.sin(T * 1.5) * 6} />
    <path d={`M-60 940 ${[...Array(14)].map((_, i) => `Q${i * 90 - 15} ${940 + (i % 2 ? 20 : -20) + Math.sin(T * 2 + i) * 8} ${i * 90 + 30} 940`).join(' ')} L1140 1400 L-60 1400 Z`} fill="#3f7fbf" opacity="0.85" />
    {[0, 1, 2].map((i) => { const p = (T * 0.8 + i / 3) % 1; return <circle key={i} cx={500 + i * 40} cy={1000 - p * 80} r={8 + i * 3} fill="none" stroke="#fff" strokeWidth="4" opacity={(1 - p) * sink} />; })}</g>);
}

/* 8 — self-proof: cinema seat, a terrible movie (1 STAR), Dev slumped; the watch keeps going */
function MGBadMovie({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="dark" />
    <rect x="80" y="220" width="920" height="520" rx="16" fill="#e9e2d4" stroke={K} strokeWidth="9" opacity={0.9 + Math.sin(T * 13) * 0.05} />
    <text x="540" y="470" textAnchor="middle" fontFamily={BB} fontSize="110" fill="#1a1720">ROBOT COWBOYS 4</text>
    <g transform="translate(540 600)">{[0, 1, 2, 3, 4].map((i) => <path key={i} transform={`translate(${(i - 2) * 80} 0)`} d="M0 -30 L9 -9 L31 -9 L13 4 L20 26 L0 13 L-20 26 L-13 4 L-31 -9 L-9 -9 Z" fill={i === 0 ? A : '#9aa3b5'} stroke={K} strokeWidth="4" />)}</g>
    {[...Array(3)].map((_, i) => <rect key={i} x={140 + i * 300} y="1120" width="240" height="220" rx="30" fill="#7a2b3a" stroke={K} strokeWidth="7" />)}
    <MGBust x={540} y={1000} r={120} who="dev" mouth="flat" brow="worried" look={[0, -0.8]} bl={BL(T)} />
    {t > c3 && <MGChip x={540} y={820} text="BUT I PAID..." col={R} txt="#fff" size={52} pop={(t - c3) / 0.25} />}</g>);
}

/* 9 — end: Dev on the sofa with soup and a blanket, the ticket pinned to the fridge; Nia gives a thumbs up; chips */
function MGEndHome({ T, t, beats }) {
  const c2 = b(beats, 2, 1.2), c3 = b(beats, 3, 1.6), c5 = b(beats, 5, 2.6);
  return (<g><MGBg kind="room" />
    <rect x="80" y="1060" width="600" height="220" rx="60" fill="#3f7fbf" stroke={K} strokeWidth="8" /><rect x="40" y="980" width="120" height="300" rx="50" fill="#2f6aa6" stroke={K} strokeWidth="7" />
    <MGPerson x={380} y={1300} s={2.3} who="dev" mouth="smile" brow="up" look={[1, -0.3]} bl={BL(T)} />
    <path d="M220 1120 Q380 1060 540 1120 L560 1280 L200 1280 Z" fill="#e8b33e" stroke={K} strokeWidth="7" />
    <MGPerson x={880} y={1300} s={2.3} who="nia" mouth="grin" brow="up" look={[-1, -0.3]} bl={BL(T, 1)} />
    <Ticket x={760} y={620} s={0.45} rot={12} label="CONCERT" sub="NEXT TIME" />
    {t > c2 && <MGChip x={540} y={800} text="YOUR EVENING COSTS TOO" col="#fff" size={42} pop={(t - c2) / 0.25} />}
    {t > c3 && <MGChip x={540} y={240} text="WHAT DID YOU SIT THROUGH?" col={A} size={44} pop={(t - c3) / 0.25} />}
    {t > c5 && <MGChip x={540} y={340} text="SEND IT TO THAT FRIEND" outline size={40} pop={(t - c5) / 0.25} />}</g>);
}

Object.assign(window, { MGDevTicket, MGYouPaid, MGMoneyGone, MGArkesStudy, MGFullPrice, MGSamePlays, MGNameSunk, MGBadMovie, MGEndHome });
})();
