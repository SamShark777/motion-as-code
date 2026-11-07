// art.jsx — "Why Winning the Lottery Wouldn't Fix It" (Milo ep. 6, with Theo; ted-MG motion graphics).
// Hedonic adaptation: Brickman, Coates & Janoff-Bulman 1978 (JPSP) — 22 major lottery winners vs 22 controls: not happier
// overall, everyday pleasures rated less enjoyable. Only the verified "22" is on screen. Full 1080×1920 frames with
// tedmg-kit.jsx; captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const MILO = '#f7f5f0', MILO_SKIN = '#F4EFE4', THEO = '#4f9d78', THEO_SKIN = '#e9d2b8', GOLD = '#f2c14e';

// lottery ticket card
function Ticket({ x, y, s = 1, rot = -8, nums = [7, 12, 23, 31, 40, 44], k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * BK(k)})`}>
    <rect x="-210" y="-120" width="420" height="240" rx="16" fill={GOLD} stroke={K} strokeWidth="7" />
    <rect x="-210" y="-120" width="420" height="64" rx="16" fill={R} stroke={K} strokeWidth="7" />
    <text x="0" y="-74" textAnchor="middle" fontFamily={BB} fontSize="48" letterSpacing="6" fill="#fff">LOTTO</text>
    {nums.map((n, i) => <g key={i}><circle cx={-170 + i * 68} cy={10} r="28" fill="#fff" stroke={K} strokeWidth="5" />
      <text x={-170 + i * 68} y={22} textAnchor="middle" fontFamily={BB} fontSize="36" fill="#1a1720">{n}</text></g>)}
    {[...Array(18)].map((_, i) => <rect key={i} x={-180 + i * 20} y={66} width={i % 3 ? 8 : 14} height="36" fill={K} />)}
  </g>);
}
function Coin({ x, y, r = 34, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`}><ellipse rx={r} ry={r * 0.9} fill={GOLD} stroke={K} strokeWidth="5" />
    <text y={r * 0.35} textAnchor="middle" fontFamily={BB} fontSize={r * 1.1} fill="#a87a14">$</text></g>);
}
function House({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-120 0 L-120 -130 L0 -230 L120 -130 L120 0 Z" fill="#f4efe4" stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <path d="M-150 -110 L0 -250 L150 -110" fill="none" stroke={R} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="-30" y="-90" width="60" height="90" fill="#8c6b4f" stroke={K} strokeWidth="6" /><rect x="-95" y="-110" width="50" height="45" fill="#7fd6ff" stroke={K} strokeWidth="5" /><rect x="45" y="-110" width="50" height="45" fill="#7fd6ff" stroke={K} strokeWidth="5" /></g>);
}
function Car({ x, y, s = 1, col = R }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-170 -20 L-150 -90 Q-140 -120 -100 -120 L60 -120 Q100 -120 120 -80 L170 -50 Q190 -45 190 -15 L190 10 L-170 10 Z" fill={col} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <path d="M-120 -104 L-20 -104 L-20 -55 L-130 -55 Z M5 -104 L60 -104 Q85 -104 100 -75 L110 -55 L5 -55 Z" fill="#bfe3f2" stroke={K} strokeWidth="5" />
    {[-100, 110].map((wx) => <g key={wx}><circle cx={wx} cy="12" r="38" fill="#2a2a2a" stroke={K} strokeWidth="7" /><circle cx={wx} cy="12" r="14" fill="#bbb" /></g>)}</g>);
}
function Letter({ x, y, s = 1, rot = 6 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x="-110" y="-140" width="220" height="280" rx="10" fill="#fff" stroke={K} strokeWidth="7" />
    <text y="-70" textAnchor="middle" fontFamily={BB} fontSize="64" fill={R}>I QUIT!</text>
    {[0, 1, 2, 3].map((i) => <rect key={i} x="-80" y={-20 + i * 36} width={160 - (i % 2) * 40} height="12" rx="6" fill="#d8d0c2" />)}</g>);
}
// happiness meter (vertical bar) filled to v (0..1)
function Meter({ x, y, v, col, label }) {
  return (<g><rect x={x - 70} y={y - 460} width="140" height="460" rx="24" fill="#2a3150" stroke={K} strokeWidth="7" />
    <rect x={x - 58} y={y - 12 - 436 * v} width="116" height={436 * v} rx="16" fill={col} />
    <text x={x} y={y + 70} textAnchor="middle" fontFamily={BB} fontSize="58" letterSpacing="3" fill="#fff">{label}</text></g>);
}
// a crown above a head (winner marker)
function Crown({ x, y, s = 1 }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-40 20 L-46 -24 L-20 0 L0 -34 L20 0 L46 -24 L40 20 Z" fill={GOLD} stroke={K} strokeWidth="5" strokeLinejoin="round" />;
}
function Toast({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-80 60 L-80 -40 Q-100 -90 -50 -100 L50 -100 Q100 -90 80 -40 L80 60 Z" fill="#e6a85a" stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <path d="M-60 45 L-60 -35 Q-75 -72 -40 -80 L40 -80 Q75 -72 60 -35 L60 45 Z" fill="#f6d79a" /><rect x="-30" y="-30" width="50" height="34" rx="6" fill="#fff3c8" stroke={K} strokeWidth="4" /></g>);
}

/* 1 — Milo holds a lottery ticket at the corner shop; coins and a "MILLIONS" bubble float up as he dreams */
function MGTicketHook({ T, t, beats }) {
  const c1 = Math.min(0.15, b(beats, 1, 0.5)), c3 = b(beats, 3, 1.6), dream = SM(c3 - 0.2, c3 + 0.3, t);
  return (<g><MGBg kind="wall" c1="#f6d8a8" c2="#d98f5a" />
    <MGChip x={540} y={200} text="JACKPOT DRAW · SATURDAY 8 PM" outline size={40} pop={t / 0.25} />
    {[...Array(7)].map((_, i) => { const ph = (T * 0.35 + i / 7) % 1; return <Coin key={i} x={170 + hsh(i + 3) * 740} y={lp(1000, 280, ph)} r={26 + hsh(i + 9) * 16} rot={Math.sin(T * 2 + i) * 30} />; }).filter((_, i) => dream > 0 && i < Math.ceil(dream * 7))}
    {dream > 0 && <MGBubble x={720} y={560} text="MILLIONAIRE MILO" size={46} k={dream * 1.3} />}
    <MGBust x={380} y={850} r={175} who="milo" mouth={dream > 0.5 ? 'grin' : 'smile'} brow="up" look={[0.7, -0.5]} bl={BL(T)} />
    <MGArm x1={600} y1={1300} x2={780} y2={lp(1150, 960, EO((t - c1) / 0.4))} sleeve={MILO} skin={MILO_SKIN} w={84} />
    <Ticket x={800} y={lp(1080, 860, EO((t - c1) / 0.4))} s={0.75} rot={-10 + Math.sin(T * 2) * 2} k={(t - c1 + 0.1) / 0.3} /></g>);
}

/* 2 — "you": the classic dream list pops around Milo's head: house, car, "I QUIT!" */
function MGDreamList({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c2 = b(beats, 2, 1.1), c3 = b(beats, 3, 1.6);
  return (<g><MGBg kind="wall" c1="#4a3a66" c2="#261c3a" /><MGGlow x={540} y={760} r={460} col="#ffd36e" a={0.18} />
    <MGHead x={540} y={1080} r={150} who="milo" mouth="grin" brow="up" look={[0, -1]} bl={BL(T)} />
    {t > c1 && <g transform={`translate(0 ${Math.sin(T * 1.5) * 8})`}><g transform={`translate(250 620) scale(${BK((t - c1) / 0.3)})`}><House x={0} y={100} s={1.1} /></g></g>}
    {t > c2 && <g transform={`translate(0 ${Math.sin(T * 1.5 + 1) * 8})`}><g transform={`translate(800 560) scale(${BK((t - c2) / 0.3)})`}><Car x={0} y={60} s={1.05} col={GOLD} /></g></g>}
    {t > c3 && <g transform={`translate(540 420) scale(${BK((t - c3) / 0.3)})`}><Letter x={0} y={0} s={0.9} rot={-4 + Math.sin(T * 3) * 3} /></g>}
    {[0, 1, 2].map((i) => <circle key={i} cx={540 + (i - 1) * 40} cy={880 - i * 34} r={10 + i * 6} fill="#fff" stroke={K} strokeWidth="4" opacity={SM(0.1, 0.4, t)} />)}</g>);
}

/* 3 — snapback: spotlight on a real winner with a giant cheque — flat face; "NOT HAPPIER" stamps on at the emphasis */
function MGSnapWinners({ T, t, beats }) {
  const c1 = b(beats, 1, 0.4), c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.55 * SM(0, 0.3, t)} />
    {t > c1 && <MGChip x={540} y={220} text="A FAMOUS 1978 STUDY" outline size={44} pop={(t - c1) / 0.25} />}
    <MGPerson x={540} y={1320} s={2.6} who={MG.extra(4)} mouth="flat" brow="flat" look={[0, 0]} bl={BL(T)} />
    <Crown x={540} y={820} s={1.4} />
    <g transform={`translate(540 1080) rotate(-3)`}><rect x="-330" y="-90" width="660" height="180" rx="12" fill="#fff" stroke={K} strokeWidth="8" />
      <text x="-300" y="-30" fontFamily={OS} fontWeight="700" fontSize="30" fill="#6b6b6b">PAY TO: THE WINNER</text>
      <text x="0" y="56" textAnchor="middle" fontFamily={BB} fontSize="96" letterSpacing="4" fill="#2f9a5a">$ JACKPOT</text></g>
    {t > c3 && <g transform={`translate(540 520) rotate(-6) scale(${BK((t - c3) / 0.3)})`}><rect x="-340" y="-80" width="680" height="160" rx="20" fill={R} stroke={K} strokeWidth="9" />
      <text y="48" textAnchor="middle" fontFamily={BB} fontSize="130" letterSpacing="6" fill="#fff">NOT HAPPIER</text></g>}</g>);
}

/* 4 — the study: a grid of 22 winners (crowned heads) pops in; journal chip */
function MGBrickman({ T, t, beats }) {
  const c2 = b(beats, 2, 1.4), c3 = b(beats, 3, 2.0);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="J. PERS. SOC. PSYCHOLOGY · 1978" outline size={38} pop={t / 0.25} />
    {[...Array(22)].map((_, i) => { const col = i % 5, row = Math.floor(i / 5), n = row === 4 ? 2 : 5, x = 540 + (col - (n - 1) / 2) * 170, y = 420 + row * 190, k = (t - c2 + 0.3 - i * 0.03) / 0.25;
      return k > 0 && <g key={i} transform={`translate(${x} ${y}) scale(${BK(k)})`}><MGHead x={0} y={0} r={60} who={MG.extra(i)} mouth={MG.extra(i).mouth} look={[0, 0.3]} bl={BL(T, i * 0.3)} /><Crown x={0} y={-74} s={0.8} /></g>; })}
    {t > c3 && <MGChip x={540} y={1300} text="22 LOTTERY WINNERS" size={56} pop={(t - c3) / 0.25} />}</g>);
}

/* 5 — compare: WINNERS vs NON-WINNERS happiness meters fill to about the same level */
function MGNoHappier({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), f = EO((t - 0.3) / 1.2);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="HOW HAPPY ARE YOU?" outline size={44} pop={t / 0.25} />
    <Meter x={330} y={1120} v={0.62 * f} col={GOLD} label="WINNERS" />
    <Meter x={750} y={1120} v={0.6 * f} col="#7fd6ff" label="NON-WINNERS" />
    <MGHead x={330} y={560} r={70} who={MG.extra(2)} mouth="flat" look={[0.4, 0]} bl={BL(T)} /><Crown x={330} y={480} s={0.9} />
    <MGHead x={750} y={560} r={70} who={MG.extra(5)} mouth="smile" look={[-0.4, 0]} bl={BL(T, 1)} />
    {t > c3 && <g><line x1={230} y1={1108 - 436 * 0.61} x2={850} y2={1108 - 436 * 0.61} stroke={A} strokeWidth="8" strokeDasharray="22 14" />
      <MGChip x={540} y={340} text="NO HAPPIER" col={R} txt="#fff" size={60} pop={(t - c3) / 0.25} /></g>}</g>);
}

/* 6 — everyday pleasures: breakfast and a joke land flat for the crowned winner */
function MGLessFun({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c3 = b(beats, 3, 1.5);
  return (<g><MGBg kind="room" />
    <MGPerson x={330} y={1300} s={2.5} who={MG.extra(4)} mouth={t > c3 ? 'frown' : 'flat'} brow="flat" look={[1, 0.3]} bl={BL(T)} />
    <Crown x={330} y={830} s={1.3} />
    <g transform="translate(720 980)"><ellipse rx="190" ry="60" fill="#fff" stroke={K} strokeWidth="7" /><ellipse cx="-40" rx="70" ry="30" fill="#ffd36e" stroke={K} strokeWidth="5" /><circle cx="-40" r="20" fill="#f2a33a" />
      <Toast x={90} y={-40} s={0.6} /></g>
    <MGChip x={720} y={820} text="BREAKFAST" outline size={40} pop={t / 0.25} />
    {t > c1 && <MGBubble x={780} y={640} text="KNOCK KNOCK..." size={44} k={(t - c1) / 0.3} />}
    {t > c3 && <g><g transform="translate(540 330)"><rect x="-300" y="-40" width="600" height="80" rx="40" fill="#2a3150" stroke={K} strokeWidth="6" />
      <rect x="-288" y="-28" width={576 * lp(0.85, 0.35, EO((t - c3) / 0.5))} height="56" rx="28" fill={GOLD} /><text x="-270" y="-60" fontFamily={OS} fontWeight="700" fontSize="34" fill="#fff">ENJOYMENT</text></g>
      <MGChip x={760} y={250} text="LESS" col={R} txt="#fff" size={52} pop={(t - c3) / 0.25} /></g>}</g>);
}

/* 7 — name it: Milo on a treadmill; the world (house, car) slides by and he stays in place */
function MGNameHedonic({ T, t, beats }) {
  const belt = (T * 260) % 80;
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGTitle lines={[['HEDONIC', A, 180], ['ADAPTATION', '#fff', 110]]} y={240} a={EO((t - 0.2) / 0.35)} />
    {[0, 1].map((i) => { const x = ((T * 220 + i * 560) % 1120) - 40; return <g key={i} opacity="0.35">{i ? <Car x={1100 - x} y={1010} s={0.8} col={GOLD} /> : <House x={1100 - x} y={1010} s={0.8} />}</g>; })}
    <g><rect x="260" y="1230" width="560" height="60" rx="30" fill="#3a3a46" stroke={K} strokeWidth="8" />
      {[...Array(8)].map((_, i) => <line key={i} x1={280 + ((i * 80 - belt + 640) % 640) * 0.82} y1="1236" x2={280 + ((i * 80 - belt + 640) % 640) * 0.82} y2="1284" stroke="#22222c" strokeWidth="6" />)}
      <path d="M780 1230 L840 900 L880 900" fill="none" stroke="#3a3a46" strokeWidth="18" strokeLinecap="round" /></g>
    <MGPerson x={540} y={1240} s={2.2} who="milo" walk={T * 9} mouth="flat" brow="flat" look={[1, 0]} bl={BL(T)} /></g>);
}

/* 8 — self-proof: the phone you HAD to have sparkles, then goes dull; Milo shrugs */
function MGPhoneHadTo({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9), c4 = b(beats, 4, 1.9), shine = t < c4 ? SM(c2 - 0.2, c2 + 0.2, t) : 1 - SM(c4, c4 + 0.4, t);
  return (<g><MGBg kind="wall" c1="#c9dff0" c2="#8fb2cf" />
    <MGGlow x={720} y={720} r={360} col="#fff6c8" a={0.8 * shine} />
    <g transform="translate(720 760) scale(0.7)"><MGPhone x={0} y={0} rot={8} time="NEW" day={t > c4 ? 'JUST A PHONE' : 'MUST. HAVE.'} /></g>
    {shine > 0.1 && [...Array(6)].map((_, i) => { const a = i / 6 * Math.PI * 2 + T; return <path key={i} transform={`translate(${720 + Math.cos(a) * 300} ${760 + Math.sin(a) * 360}) scale(${shine})`} d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z" fill={A} />; })}
    <MGBust x={290} y={990} r={150} who="milo" mouth={t > c4 ? 'flat' : 'grin'} brow={t > c4 ? 'flat' : 'up'} look={[1, -0.3]} bl={BL(T)} />
    {t > c4 && <MGChip x={720} y={300} text="DAY 90" outline size={48} pop={(t - c4) / 0.25} />}</g>);
}

/* 9 — end: no win; Theo hands Milo a warm slice of toast and they laugh; ticket in the bin */
function MGTheoToast({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), hand = EO(t / 0.6);
  return (<g><MGBg kind="room" /><MGGlow x={540} y={760} r={460} col="#fff3c4" a={0.45} />
    <MGChip x={540} y={200} text="RESULTS: NO WIN" outline size={44} pop={t / 0.25} />
    <g transform="translate(910 1210)"><path d="M-80 -110 L80 -110 L64 100 L-64 100 Z" fill="#9aa3b5" stroke={K} strokeWidth="7" strokeLinejoin="round" /><Ticket x={10} y={-130} s={0.35} rot={-30} /></g>
    <MGPerson x={300} y={1310} s={2.4} who="milo" mouth="grin" brow="up" look={[1, -0.3]} bl={BL(T)} />
    <MGPerson x={700} y={1300} s={2.3} who="theo" mouth="smile" brow="up" look={[-1, -0.2]} bl={BL(T, 1)} />
    <MGArm x1={650} y1={1030} x2={lp(620, 470, hand)} y2={960} sleeve={THEO} skin={THEO_SKIN} w={38} />
    <Toast x={lp(620, 470, hand)} y={900} s={0.55} />
    {[0, 1, 2].map((i) => { const ph = (T * 0.5 + i / 3) % 1; return <path key={i} d={`M${450 + i * 24} ${840 - ph * 120} q12 -18 0 -36 q-12 -18 0 -36`} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity={0.7 * Math.sin(ph * Math.PI)} />; })}
    {t > c3 && <MGChip x={540} y={330} text="THE SMALL STUFF ISN'T SMALL" size={46} pop={(t - c3) / 0.25} />}</g>);
}

Object.assign(window, { MGTicketHook, MGDreamList, MGSnapWinners, MGBrickman, MGNoHappier, MGLessFun, MGNameHedonic, MGPhoneHadTo, MGTheoToast });
})();
