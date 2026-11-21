// art.jsx — "Why the New Thing Stops Making You Happy" (Dev ep. 11, with Nia; ted-MG motion graphics).
// Experiential vs material purchases: Van Boven & Gilovich 2003 JPSP "To do or to have?" — national survey of 12,000+
// Americans: most said their experiential purchase made them happier. No percentages on screen (none verified).
// Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const PAPER = '#fbf7ee', GOOD = '#5fbf7a', DEVTOP = '#3f7fbf', DEVSKIN = '#c99b74';

/* smart watch: face lit = 0..1 */
function Watch({ x, y, s = 1, lit = 1, rot = 0, time = '6:30', dull = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-55" y="-230" width="110" height="460" rx="40" fill="#2b2838" stroke={K} strokeWidth="8" />
    <rect x="-110" y="-120" width="220" height="240" rx="56" fill="#18161d" stroke={K} strokeWidth="10" />
    <rect x="-92" y="-102" width="184" height="204" rx="42" fill={lit > 0 ? (dull > 0.5 ? '#3a4160' : '#1f3b73') : '#0d0c12'} />
    {lit > 0 && <g opacity={lit * (1 - dull * 0.6)}><text x="0" y="20" textAnchor="middle" fontFamily={BB} fontSize="88" fill="#fff">{time}</text>
      <circle cx="0" cy="0" r="80" fill="none" stroke={dull > 0.5 ? '#8a8fa0' : GOOD} strokeWidth="8" strokeDasharray="300 600" transform="rotate(-90)" /></g>}
  </g>);
}
function Ticket({ x, y, s = 1, rot = 0, label = 'GIG', sub = 'SAT · 8 PM' }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-180 -90 H180 V-30 A30 30 0 0 0 180 30 V90 H-180 V30 A30 30 0 0 0 -180 -30 Z" fill={A} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <line x1="90" y1="-80" x2="90" y2="80" stroke={K} strokeWidth="5" strokeDasharray="12 10" />
    <text x="-40" y="10" textAnchor="middle" fontFamily={BB} fontSize="84" letterSpacing="4" fill={K}>{label}</text>
    <text x="-40" y="60" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="28" fill={K}>{sub}</text>
    <text x="135" y="12" textAnchor="middle" fontFamily={BB} fontSize="40" fill={K} transform="rotate(-90 135 0)">ADMIT 1</text></g>);
}
function Parcel({ x, y, s = 1, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-120" y="-100" width="240" height="200" rx="10" fill="#c99a5e" stroke={K} strokeWidth="8" />
    <rect x="-20" y="-100" width="40" height="200" fill="#e3c17f" opacity="0.7" /><rect x="-120" y="-20" width="240" height="40" fill="#e3c17f" opacity="0.5" /></g>);
}
function Calendar({ x, y, page = 'WEEK 1', k = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}>
    <rect x="-150" y="-130" width="300" height="260" rx="16" fill={PAPER} stroke={K} strokeWidth="8" />
    <rect x="-150" y="-130" width="300" height="80" rx="16" fill={R} stroke={K} strokeWidth="8" />
    <text x="0" y="40" textAnchor="middle" fontFamily={BB} fontSize="84" letterSpacing="4" fill={K}>{page}</text></g>);
}
/* talking sparkles / story lines rising from a head */
function StoryBits({ x, y, t, n = 5 }) {
  return <g>{[...Array(n)].map((_, i) => { const k = ((t * 0.5 + i / n) % 1); const yy = y - k * 380, xx = x + Math.sin(i * 2.1 + t) * 60;
    return <g key={i} opacity={Math.sin(k * Math.PI)}><rect x={xx - 60} y={yy - 26} width="120" height="52" rx="26" fill="#fff" stroke={K} strokeWidth="5" />
      {[0, 1, 2].map((j) => <circle key={j} cx={xx - 30 + j * 30} cy={yy} r="8" fill={K} />)}</g>; })}</g>;
}

/* 1 — Dev unboxes the watch, all confidence */
function MGNewWatch({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5), c2 = b(beats, 2, 1.0);
  const up = EO((t - c1) / 0.4);
  return (<g><MGBg kind="room" />
    <MGBust x={540} y={760} r={170} who="dev" look={[0.3, 0.7]} brow="up" mouth={t > c2 ? 'grin' : 'smile'} bl={BL(T)} />
    <Parcel x={260} y={1240} s={0.9} rot={-8} />
    <MGArm x1={1150} y1={1700} x2={lp(900, 800, up)} y2={lp(1500, 1180, up)} sleeve={DEVTOP} skin={DEVSKIN} w={96} />
    <Watch x={lp(900, 800, up)} y={lp(1500, 1180, up) - 140} s={0.85} lit={SM(c1, c1 + 0.3, t)} />
    {t > c2 && <MGBubble x={540} y={430} text="HAPPY FOR|YEARS." k={(t - c2) / 0.3} size={50} />}
    <MGChip x={540} y={150} text="PAYDAY · 6:30 PM" size={40} pop={t / 0.25} /></g>);
}

/* 2 — proof: a crowd votes; most walk to the ticket side */
function MGSurvey({ T, t, beats }) {
  const c4 = b(beats, 4, 1.8);
  const side = (i) => (i % 3 === 2 ? 0 : 1); // 1 = experience
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={170} text="SURVEY · 12,000+ AMERICANS" size={40} pop={t / 0.25} />
    <Parcel x={270} y={500} s={1.1} />
    <Ticket x={790} y={500} s={1.1} rot={-6} label="TRIP" sub="EXPERIENCE" />
    <text x="270" y="680" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="42" letterSpacing="3" fill="#fff" opacity="0.8">THING</text>
    {[...Array(12)].map((_, i) => { const x0 = 140 + (i % 6) * 160, y0 = 1180 - Math.floor(i / 6) * 0;
      const k = EO((t - 0.4 - i * 0.07) / 0.6), tx = side(i) ? 640 + (i % 4) * 95 : 170 + (i % 3) * 95, ty = 900 + Math.floor(i / 4) * 120;
      return <MGHead key={i} x={lp(x0, tx, k)} y={lp(y0 + (i >= 6 ? 140 : 0), ty, k)} r={60} who={MG.extra(i)} look={[side(i) ? 0.6 : -0.6, -0.5]} mouth={side(i) ? 'grin' : 'flat'} bl={BL(T, i * 0.3)} />; })}
    {t > c4 && <MGRing cx={790} cy={1020} rx={250} ry={190} p={(t - c4) / 0.4} />}
    {t > c4 && <MGChip x={790} y={1290} text="MOST" col={GOOD} txt="#fff" size={44} pop={(t - c4) / 0.25} />}</g>);
}

/* 3 — snapback: week three, the watch is just a watch; Dev barely glances */
function MGJustAWatch({ T, t, beats }) {
  const c3 = b(beats, 3, 1.3);
  const d = SM(0.2, c3, t);
  return (<g><MGBg kind="roomNight" />
    <Calendar x={800} y={330} page={t > 0.5 ? 'WEEK 3' : 'WEEK 1'} k={t / 0.25} />
    <MGBust x={420} y={820} r={170} who="dev" look={[-0.6, 0.1]} brow="flat" mouth="flat" bl={BL(T)} />
    <Watch x={780} y={1180} s={0.95} lit={1} dull={d} time="9:47" />
    {t > c3 && <g opacity={SM(c3, c3 + 0.3, t)}><text x="780" y="1340" textAnchor="middle" fontFamily={BB} fontSize="56" letterSpacing="4" fill="#8a8fa0">MEH.</text></g>}</g>);
}

/* 4 — study 2003: two cards, EXPERIENCES beats STUFF */
function MGStudy({ T, t, beats }) {
  const c3 = b(beats, 3, 1.3);
  const k1 = EO(t / 0.45), k2 = EO((t - 0.3) / 0.45);
  const card = (x, k, lab, child, win) => (<g transform={`translate(${x} ${lp(1500, 820, k)})`}>
    <rect x="-210" y="-300" width="420" height="560" rx="20" fill={PAPER} stroke={win ? A : K} strokeWidth={win ? 14 : 8} />
    {child}
    <text x="0" y="200" textAnchor="middle" fontFamily={BB} fontSize="70" letterSpacing="4" fill={K}>{lab}</text></g>);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={170} text="CORNELL · COLORADO · 2003" size={38} pop={t / 0.25} />
    {card(290, k1, 'STUFF', <g><Parcel x={0} y={-60} s={0.9} /></g>, false)}
    {card(790, k2, 'EXPERIENCES', <g><Ticket x={0} y={-60} s={0.9} rot={-6} label="TRIP" sub="" /></g>, t > c3)}
    {t > c3 && <g transform={`translate(790 430) scale(${BK((t - c3) / 0.3)})`}><circle r="70" fill={GOOD} stroke={K} strokeWidth="7" />
      <path d="M-32 2 L-8 28 L34 -24" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}</g>);
}

/* 5 — why: the trip turns into stories passed between friends */
function MGStories({ T, t, beats }) {
  return (<g><MGBg kind="party" T={T} />
    <MGPerson x={240} y={1250} s={2.6} who="nia" look={[1, -0.2]} mouth="grin" brow="up" bl={BL(T, 0.3)} />
    <MGPerson x={540} y={1250} s={2.6} who={MG.extra(4)} look={[0, -0.2]} mouth="o" brow="up" bl={BL(T, 0.7)} />
    <MGPerson x={840} y={1250} s={2.6} who="dev" look={[-1, -0.2]} mouth="grin" brow="up" bl={BL(T)} />
    <StoryBits x={240} y={700} t={t} /><StoryBits x={840} y={700} t={t + 0.7} />
    <MGChip x={540} y={170} text="REMEMBER WHEN…" size={44} pop={t / 0.25} /></g>);
}

/* 6 — self-proof: a phone photo of a trip, with heart reactions */
function MGRetell({ T, t, beats }) {
  const c4 = b(beats, 4, 1.8);
  return (<g><MGBg kind="roomNight" />
    <g transform="translate(540 760) rotate(-4)">
      <rect x="-280" y="-520" width="560" height="1040" rx="64" fill="#18161d" stroke={K} strokeWidth="10" />
      <rect x="-250" y="-480" width="500" height="960" rx="40" fill="#f3efe8" />
      <rect x="-220" y="-430" width="440" height="440" rx="10" fill="#7fc4e8" />
      <circle cx="120" cy="-330" r="50" fill={A} /><path d="M-220 -80 L-80 -260 L40 -120 L120 -200 L220 -80 V10 H-220 Z" fill="#4f9d78" stroke={K} strokeWidth="6" />
      <text x="-220" y="70" fontFamily={OS} fontWeight="700" fontSize="34" fill="#1a1720">3 years ago today</text>
      {t > c4 && <text x="-220" y="140" fontFamily={OS} fontWeight="500" fontSize="34" fill="#1a1720">“we HAVE to go back”</text>}
    </g>
    {t > c4 && <MGRing cx={540} cy={540} rx={260} ry={250} p={(t - c4) / 0.4} rot={-4} />}</g>);
}

/* 7 — payoff: Nia hands Dev a gig ticket; stage lights */
function MGGig({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c2 = b(beats, 2, 1.2);
  return (<g><MGBg kind="stage" T={T} />
    <MGPerson x={300} y={1260} s={2.8} who="nia" look={[1, -0.3]} mouth="grin" brow="up" bl={BL(T, 0.3)} />
    <MGPerson x={770} y={1260} s={2.8} who="dev" look={[-0.6, -0.6]} mouth={t > c2 ? 'grin' : 'o'} brow="up" bl={BL(T)} />
    <Ticket x={540} y={lp(900, 560, EO((t - c1) / 0.4))} s={BK((t - c1 + 0.1) / 0.35) * 0.9} rot={-8} />
    {t > c2 && <MGBubble x={800} y={420} text="REMEMBER|THAT GIG?!" k={(t - c2) / 0.3} size={44} />}
    <MGChip x={540} y={150} text={t > c2 ? 'THREE MONTHS LATER' : 'SATURDAY · 8 PM'} size={40} pop={1} /></g>);
}

/* 8 — end: the ticket stub pinned up, the watch in a drawer */
function MGEndTicket({ T, t, beats }) {
  return (<g><MGBg kind="wall" c1="#2f3d5c" c2="#1a2238" />
    <rect x="200" y="300" width="680" height="560" rx="20" fill="#b98e62" stroke={K} strokeWidth="9" />
    <rect x="230" y="330" width="620" height="500" rx="10" fill="#d8b98c" />
    <Ticket x={470} y={500} s={0.9} rot={-8} />
    <Ticket x={680} y={680} s={0.75} rot={10} label="TRIP" sub="LISBON" />
    <circle cx="420" cy="440" r="14" fill={R} stroke={K} strokeWidth="4" /><circle cx="700" cy="620" r="14" fill={R} stroke={K} strokeWidth="4" />
    <MGBust x={540} y={1120} r={115} who="dev" look={[0, -0.8]} brow="up" mouth="grin" bl={BL(T)} />
    <MGChip x={540} y={170} text="TRIP OR THING?" size={44} pop={t / 0.25} /></g>);
}

Object.assign(window, { MGNewWatch, MGSurvey, MGJustAWatch, MGStudy, MGStories, MGRetell, MGGig, MGEndTicket });
})();
