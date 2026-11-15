// art.jsx — "5 Signs You're Quietly Building Your Excuse" (June ep. 7, with Theo; ted-MG motion graphics, signs-list).
// Self-handicapping: Berglas & Jones 1978 (JPSP) — after "noncontingent" success (partly unsolvable puzzles), students chose
// between a pill said to boost and one said to impair performance before a retest; the unsure group more often chose the
// impairing one (all pills were inert). No numbers on screen. Full 1080×1920 frames with tedmg-kit.jsx;
// captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GOOD = '#5fbf7a', JUNE_TOP = '#5bb3b0', JUNE_SKIN = '#f2dccb';

/* "SIGN n OF 5" header + five progress dots, a big faded numeral */
function SignHead({ n, t }) {
  return (<g><MGChip x={540} y={230} text={`SIGN ${n} OF 5`} outline size={44} pop={t / 0.25} />
    {[1, 2, 3, 4, 5].map((i) => <circle key={i} cx={540 + (i - 3) * 60} cy={330} r={i === n ? 18 : 12} fill={i <= n ? A : 'rgba(255,255,255,0.25)'} stroke={K} strokeWidth="4" />)}
    <text x={540} y={860} textAnchor="middle" fontFamily={BB} fontSize="560" fill="#fff" opacity="0.07">{n}</text></g>);
}
/* desk with neatly lined-up pencils, a closed textbook, a lamp */
function Desk({ y = 1180, T = 0, neat = 1 }) {
  return (<g><rect x={-40} y={y} width={1160} height={60} rx="10" fill="#6b4a32" stroke={K} strokeWidth="8" />
    <rect x={-40} y={y + 60} width={1160} height={900} fill="#3a2a20" />
    <g transform={`translate(760 ${y - 70})`}><rect x="-120" y="-30" width="240" height="70" rx="8" fill="#d9534f" stroke={K} strokeWidth="7" /><rect x="-120" y="-60" width="240" height="40" rx="8" fill="#e8b33e" stroke={K} strokeWidth="7" />
      <text x="0" y="20" textAnchor="middle" fontFamily={BB} fontSize="44" fill="#fff">EXAM PREP</text></g>
    {[...Array(7)].map((_, i) => { const x = 140 + i * 48, r = lp((hsh(i) - 0.5) * 60, 0, neat); return <g key={i} transform={`translate(${x} ${y - 70}) rotate(${r})`}><rect x="-12" y="-60" width="24" height="120" rx="4" fill={['#F6B92E', '#E5483B', '#5bb3b0', '#a46fd1', '#3f7fbf', '#4f9d78', '#f08a4b'][i]} stroke={K} strokeWidth="5" /><path d="M-12 60 L0 84 L12 60 Z" fill="#f2dccb" stroke={K} strokeWidth="4" /></g>; })}
    <g transform={`translate(960 ${y})`}><path d="M0 0 L-40 -260 L60 -330" fill="none" stroke={K} strokeWidth="14" strokeLinecap="round" /><path d="M20 -380 L140 -330 L90 -260 Z" fill="#e8b33e" stroke={K} strokeWidth="7" strokeLinejoin="round" />
      <MGGlow x={70} y={-250} r={260} col="#ffe2a0" a={0.35 + 0.03 * osc(T, 1.3)} /></g></g>);
}
/* a pill: col, label */
function Pill({ x, y, col, label, s = 1, rot = 0, k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(cl(k)) * s})`}>
    <rect x="-150" y="-60" width="300" height="120" rx="60" fill="#f7f5f0" stroke={K} strokeWidth="9" /><path d="M0 -60 H90 A60 60 0 0 1 90 60 H0 Z" fill={col} stroke={K} strokeWidth="9" />
    <path d="M-110 -30 Q-90 -45 -50 -45" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
    <text x="0" y="140" textAnchor="middle" fontFamily={BB} fontSize="72" letterSpacing="4" fill="#fff">{label}</text></g>);
}

/* 1 — 2 AM, exam tomorrow: June lines up her pencils instead of studying */
function MGExamDesk({ T, t, beats }) {
  const c1 = b(beats, 1, 0.8);
  return (<g><MGBg kind="roomNight" T={T} />
    <MGBust x={420} y={760} r={170} who="june" look={[0.8, 0.9]} brow="up" mouth="smile" bl={BL(T)} />
    <Desk y={1180} T={T} neat={SM(c1, c1 + 1.0, t)} />
    <MGChip x={540} y={170} text="EXAM · 9:00 AM" size={42} pop={t / 0.25} />
    {t > c1 && <MGChip x={820} y={290} text="NOW: 2:07 AM" outline size={40} pop={(t - c1) / 0.25} />}</g>);
}

/* 2 — five sign cards deal in like a hand of cards */
function MGFiveCards({ T, t, beats }) {
  return (<g><MGBg kind="wall" c1="#2c3a5c" c2="#151a2c" />
    {[1, 2, 3, 4, 5].map((n, i) => { const k = EO((t - 0.1 - i * 0.12) / 0.4), a = (i - 2) * 11;
      return (<g key={n} transform={`translate(${540 + (i - 2) * 120 * k} ${lp(1500, 860, k) + Math.abs(i - 2) * 30}) rotate(${a * k})`}>
        <rect x="-120" y="-180" width="240" height="360" rx="22" fill="#fbf7ee" stroke={K} strokeWidth="8" />
        <text x="0" y="40" textAnchor="middle" fontFamily={BB} fontSize="180" fill={i === 4 ? R : A}>{n}</text>
        <path d="M-60 110 L60 110" stroke="#d8d0c2" strokeWidth="12" strokeLinecap="round" /></g>); })}
    <MGHead x={540} y={380} r={110} who="june" look={[0, 0.6]} brow="worried" mouth="wave" bl={BL(T, 0.4)} /></g>);
}

/* 3 — snapback: June crouched behind a big shield marked EXCUSE */
function MGShield({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7);
  const k = BK(cl((t - c1 + 0.1) / 0.35));
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <MGBust x={540} y={720} r={160} who="june" look={[0, 0]} brow="worried" mouth="o" bl={BL(T)} />
    <g transform={`translate(540 1060) scale(${k})`}><path d="M-260 -230 L260 -230 L240 60 Q200 230 0 300 Q-200 230 -240 60 Z" fill="#8fa3c8" stroke={K} strokeWidth="12" strokeLinejoin="round" />
      <path d="M-210 -190 L210 -190 L195 50 Q160 190 0 250 Q-160 190 -195 50 Z" fill="#5d6f9a" />
      <text x="0" y="40" textAnchor="middle" fontFamily={BB} fontSize="120" letterSpacing="6" fill="#fff">EXCUSE</text></g>
    <MGChip x={540} y={200} text="NOT LAZY" outline size={48} pop={t / 0.25} />
    {t > c1 && <MGChip x={540} y={310} text="PROTECTION" size={50} pop={(t - c1) / 0.25} />}</g>);
}

/* sign 1 — the night before: a clock jumps to 11:58 PM, the textbook finally opens */
function MGSignJ1({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9);
  return (<g><MGBg kind="roomNight" T={T} /><SignHead n={1} t={t} />
    <g transform="translate(540 760)"><circle r="190" fill="#fbf7ee" stroke={K} strokeWidth="12" />
      {[...Array(12)].map((_, i) => { const a = i / 12 * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 150} y1={Math.sin(a) * 150} x2={Math.cos(a) * 172} y2={Math.sin(a) * 172} stroke={K} strokeWidth="8" />; })}
      <line x1="0" y1="0" x2="0" y2="-120" stroke={K} strokeWidth="14" strokeLinecap="round" transform={`rotate(${lp(-60, -6, EO(t / 0.8))})`} />
      <line x1="0" y1="0" x2="0" y2="-150" stroke={R} strokeWidth="8" strokeLinecap="round" transform={`rotate(${lp(-200, -12, EO(t / 0.8))})`} /><circle r="14" fill={K} /></g>
    {t > c2 && <MGChip x={540} y={1060} text="NIGHT BEFORE · 11:58 PM" size={40} pop={(t - c2) / 0.25} />}
    <MGHead x={230} y={1200} r={90} who="june" look={[1, -0.5]} brow="worried" mouth="wave" bl={BL(T, 0.2)} /></g>);
}

/* sign 2 — "I BARELY STUDIED" comes out first, to friends at the exam door */
function MGSignJ2({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5);
  return (<g><MGBg kind="wall" c1="#36507a" c2="#1c2a44" /><SignHead n={2} t={t} />
    <MGPerson x={300} y={1300} s={2.6} who="june" look={[1, 0]} brow="up" mouth="grin" bl={BL(T)} />
    <MGPerson x={800} y={1300} s={2.4} who={MG.extra(3)} look={[-1, 0]} mouth="o" bl={BL(T, 0.5)} />
    <MGBubble x={420} y={620} text={"I BARELY|STUDIED!"} k={(t - c1) / 0.3} size={56} />
    <MGChip x={800} y={560} text="BEFORE ANYONE ASKED" outline size={32} pop={(t - c1 - 0.6) / 0.25} /></g>);
}

/* sign 3 — big day tomorrow, June walks into a party */
function MGSignJ3({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9);
  return (<g><MGBg kind="party" T={T} /><SignHead n={3} t={t} />
    <MGCrowd T={T} t={t} skip={[3, 9]} />
    <MGPerson x={lp(-100, 360, EO(t / 1.0))} y={1340} s={2.0} who="june" walk={T * 8} look={[1, 0]} brow="up" mouth="grin" bl={BL(T)} />
    {t > c2 && <MGChip x={540} y={470} text="BIG DAY TOMORROW" size={42} pop={(t - c2) / 0.25} />}</g>);
}

/* sign 4 — the effort battery stops at 50% */
function MGSignJ4({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  const lvl = lp(0, 0.5, EO((t - 0.2) / 1.0));
  return (<g><MGBg kind="navy" /><SignHead n={4} t={t} />
    <g transform="translate(540 820)"><rect x="-300" y="-150" width="600" height="300" rx="40" fill="none" stroke="#fff" strokeWidth="18" /><rect x="300" y="-60" width="50" height="120" rx="12" fill="#fff" />
      <rect x="-270" y="-120" width={540 * lvl} height="240" rx="22" fill={A} />
      <text x="0" y="40" textAnchor="middle" fontFamily={BB} fontSize="140" fill="#fff">{Math.round(lvl * 100)}%</text></g>
    <MGChip x={540} y={1060} text="EFFORT" outline size={44} pop={t / 0.25} />
    {t > c2 && <MGHead x={880} y={1180} r={100} who="june" look={[-1, -0.5]} brow="flat" mouth="smile" bl={BL(T)} />}</g>);
}

/* sign 5 — two doors after failing: "NOT SMART ENOUGH" (dark) vs "NO SLEEP" (glowing, comfy) */
function MGSignJ5({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  const glow = SM(c2, c2 + 0.4, t);
  const Door = ({ x, label, lit }) => (<g transform={`translate(${x} 860)`}>{lit > 0 && <MGGlow x={0} y={0} r={330} col="#ffe2a0" a={0.5 * lit} />}
    <rect x="-150" y="-260" width="300" height="520" rx="14" fill={lit ? '#e8b33e' : '#2f3347'} stroke={K} strokeWidth="10" /><circle cx="100" cy="20" r="16" fill={K} />
    <rect x="-140" y="-360" width="280" height="80" rx="12" fill="#fbf7ee" stroke={K} strokeWidth="6" />
    <text x="0" y="-306" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="36" fill="#1a1720">{label}</text></g>);
  return (<g><MGBg kind="wall" c1="#3d2b4f" c2="#1f1630" /><SignHead n={5} t={t} />
    <Door x={290} label="NOT SMART" lit={0} /><Door x={790} label="NO SLEEP" lit={glow} />
    <MGChip x={540} y={1240} text="IF I FAIL…" outline size={42} pop={t / 0.25} /></g>);
}

/* the study: 1978 — two pills on a navy card, BOOST (green) and IMPAIR (red) */
function MGPillStudy({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4), c4 = b(beats, 4, 2.0);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={220} text="BERGLAS & JONES · 1978" size={42} pop={t / 0.25} />
    <MGChip x={540} y={330} text="PILL BEFORE THE RETEST" outline size={36} pop={(t - 0.6) / 0.25} />
    <Pill x={300} y={800} col={GOOD} label="BOOST" s={0.95} rot={-8} k={(t - c3 + 0.2) / 0.35} />
    <Pill x={790} y={800} col={R} label="IMPAIR" s={0.95} rot={8} k={(t - c4 + 0.1) / 0.35} />
    <text x={540} y={1180} textAnchor="middle" fontFamily={OS} fontWeight="500" fontSize="34" fill="#fff" opacity={SM(c4, c4 + 0.4, t) * 0.7}>(BOTH WERE FAKE)</text></g>);
}

/* result: the unsure students' hands reach for IMPAIR; a "?" hangs over the head grid */
function MGUnsurePick({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7);
  const k = EO((t - c1 + 0.1) / 0.5);
  return (<g><MGBg kind="navy" />
    <Pill x={300} y={760} col={GOOD} label="BOOST" s={0.8} rot={-8} />
    <g transform={`translate(0 ${-k * 60})`}><Pill x={790} y={760} col={R} label="IMPAIR" s={0.8 + 0.1 * k} rot={8} /></g>
    <MGArm x1={1200} y1={1350} x2={lp(1100, 840, k)} y2={lp(1250, 860, k)} sleeve="#6a7bd1" skin="#e9d2b8" w={90} />
    <MGChip x={540} y={300} text="UNSURE WHY THEY'D DONE WELL" outline size={34} pop={t / 0.25} />
    {t > c1 && <MGRing cx={790} cy={760} rx={200} ry={110} p={(t - c1) / 0.4} />}</g>);
}

/* name: SELF-HANDICAPPING; Theo taps the shield with a pointer */
function MGNameSH({ T, t, beats }) {
  const c1 = b(beats, 1, 1.1);
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <MGTitle lines={[['SELF-', '#fff', 170], ['HANDICAPPING', A, 150]]} y={330} a={SM(0, 0.3, t)} />
    <MGBust x={340} y={900} r={130} who="theo" look={[1, 0.2]} brow="up" mouth="smile" bl={BL(T)} />
    <g transform={`translate(780 980) scale(${0.62})`}><path d="M-260 -230 L260 -230 L240 60 Q200 230 0 300 Q-200 230 -240 60 Z" fill="#8fa3c8" stroke={K} strokeWidth="14" strokeLinejoin="round" />
      <text x="0" y="40" textAnchor="middle" fontFamily={BB} fontSize="120" letterSpacing="6" fill="#fff">EXCUSE</text></g>
    {t > c1 && <MGChip x={780} y={1260} text="READY-MADE" size={40} pop={(t - c1) / 0.25} />}</g>);
}

/* end: June asleep, alarm set; question + send chips */
function MGEndBed({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c3 = b(beats, 3, 1.7);
  return (<g><MGBg kind="roomNight" T={T} />
    <rect x={120} y={940} width={840} height={260} rx="30" fill="#323c66" stroke={K} strokeWidth="8" />
    <rect x={160} y={880} width={260} height={120} rx="40" fill="#f2ece2" stroke={K} strokeWidth="7" />
    <MGHead x={290} y={850} r={95} who="june" look={[0, 0]} mouth="smile" bl={1} />
    <path d="M330 1000 Q600 900 940 960 L940 1180 L330 1180 Z" fill="#5bb3b0" stroke={K} strokeWidth="8" />
    {[0, 1, 2].map((i) => { const ph = (T * 0.6 + i / 3) % 1; return <text key={i} x={420 + ph * 120 + i * 20} y={760 - ph * 200} fontFamily={BB} fontSize={50 + i * 14} fill="#fff" opacity={1 - ph}>Z</text>; })}
    <MGChip x={540} y={200} text="GO TO BED" size={56} pop={t / 0.25} />
    {t > c1 && <MGChip x={540} y={320} text="HOW MANY DID YOU CHECK?" outline size={38} pop={(t - c1) / 0.25} />}
    {t > c3 && <MGChip x={760} y={1260} text="SEND IT" size={42} pop={(t - c3) / 0.25} />}</g>);
}

Object.assign(window, { MGExamDesk, MGFiveCards, MGShield, MGSignJ1, MGSignJ2, MGSignJ3, MGSignJ4, MGSignJ5, MGPillStudy, MGUnsurePick, MGNameSH, MGEndBed });
})();
