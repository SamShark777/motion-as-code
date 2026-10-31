// art.jsx — "Why Your Wobbly Shelf Feels Priceless" (Nia ep. 3 with Theo, ted-MG motion graphics).
// IKEA effect: Norton, Mochon & Ariely 2012 — builders paid 63% more for a box they assembled; needs a finished build.
// Full 1080×1920 frames with tedmg-kit.jsx. Props: T, t, dur, beats. Caption band y ≈ 1370–1590 (capY lines move it).
(function () {
const { AMB: A, RED: R, INK: K, CREAM: CR, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BEB = "'Bebas Neue', sans-serif", OSW = "'Oswald', sans-serif";
const WOOD = '#d9a86a', WOODD = '#a8743e';

/* the shelf Nia built: three boards on two sides; wob = wobble amount, lean in degrees */
function Shelf({ x, y, s = 1, wob = 0, T = 0, glow = 0 }) {
  const r = Math.sin(T * 9) * 3 * wob - 2 * wob;
  return (<g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    {glow > 0 && <MGGlow x={0} y={-260} r={420} col="#ffd36e" a={0.45 * glow} />}
    {[-1, 1].map((sd) => <rect key={sd} x={sd * 200 - 18} y="-560" width="36" height="560" rx="6" fill={WOODD} stroke={K} strokeWidth="7" />)}
    {[-520, -330, -140].map((yy, i) => <g key={i} transform={`rotate(${i === 1 ? 3 : 0} 0 ${yy})`}><rect x="-230" y={yy} width="460" height="34" rx="6" fill={WOOD} stroke={K} strokeWidth="7" /></g>)}
    <g transform="translate(-120 -420)"><rect x="-26" y="-60" width="52" height="60" rx="6" fill={R} stroke={K} strokeWidth="5" /><rect x="34" y="-80" width="40" height="80" rx="6" fill="#5bb3b0" stroke={K} strokeWidth="5" /></g>
    <g transform="translate(90 -230)"><circle cx="0" cy="-36" r="36" fill="#4f9d78" stroke={K} strokeWidth="5" /><rect x="-30" y="-20" width="60" height="22" rx="6" fill="#c46a3f" stroke={K} strokeWidth="5" /></g></g>);
}
/* flat-pack box */
function Box({ x, y, s = 1, label = 'SHELF', price = '' }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-200 -120 L0 -200 L200 -120 L0 -40 Z" fill="#e8c48a" stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <path d="M-200 -120 L0 -40 L0 220 L-200 140 Z" fill="#c99b62" stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <path d="M200 -120 L0 -40 L0 220 L200 140 Z" fill="#d9ad72" stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <rect x="30" y="-10" width="140" height="70" fill="#3f7fbf" stroke={K} strokeWidth="5" transform="skewY(-22)" />
    <text x="100" y="60" textAnchor="middle" fontFamily={BEB} fontSize="44" fill="#fff" transform="skewY(-22)">{label}</text>
    {price && <g transform="translate(-100 -10)"><rect x="-80" y="-44" width="160" height="80" rx="14" fill={A} stroke={K} strokeWidth="6" /><text y="20" textAnchor="middle" fontFamily={BEB} fontSize="60" fill={K}>{price}</text></g>}</g>);
}
const Screw = ({ x, y, s = 1, rot = 0 }) => (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
  <rect x="-8" y="0" width="16" height="70" fill="#b8b8c2" stroke={K} strokeWidth="4" />{[0, 1, 2, 3].map((i) => <line key={i} x1="-8" y1={14 + i * 14} x2="8" y2={20 + i * 14} stroke={K} strokeWidth="3" />)}
  <ellipse cx="0" cy="0" rx="22" ry="10" fill="#d6d6de" stroke={K} strokeWidth="4" /></g>);
const ROOM = { kind: 'room', T: 0 };

/* 1 — Nia, proud, sweating, next to her shelf; a clock chip ticks to six hours */
function IKHook({ T, t, beats }) {
  const h = Math.min(6, 6 * SM(0.1, b(beats, 2, 1.4), t));
  return (<g><MGBg kind="room" T={T} />
    <Shelf x={760} y={1330} s={0.95} T={T} wob={0.2} />
    <MGPerson x={330} y={1520} s={3.3} who="nia" brow="up" mouth={t > b(beats, 3, 2) ? 'grin' : 'smile'} look={[1, 0]} bl={BL(T)} />
    <MGChip x={540} y={250} text={`BUILD TIME · ${h.toFixed(1)} HRS`} size={44} pop={t / 0.25} />
    {t > b(beats, 3, 2) && <MGArrows x={760} y={1050} t={t - b(beats, 3, 2)} n={4} from={500} to={300} />}</g>);
}

/* 2 — close-up: it wobbles, one screw left over */
function IKWobble({ T, t, beats }) {
  const c = b(beats, 3, 1.2);
  return (<g><MGBg kind="wall" c1="#e6d6bc" c2="#c2a985" />
    <Shelf x={540} y={1300} s={1.3} T={T} wob={1} />
    {t > c - 0.2 && <g><Screw x={850} y={lp(300, 1280, EO((t - c + 0.2) / 0.4))} s={1.6} rot={-30} /><MGRing cx={860} cy={1320} rx={90} ry={70} p={(t - c) / 0.4} /></g>}
    <MGChip x={540} y={250} text="SPARE PARTS: 1" outline size={42} pop={(t - c) / 0.25} /></g>);
}

/* 3 — Theo offers $20; Nia: $100 */
function IKOffer({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c5 = b(beats, 5, 2.2);
  return (<g><MGBg kind="room" T={T} />
    <Shelf x={540} y={1180} s={0.62} T={T} wob={0.3} />
    <MGPerson x={240} y={1540} s={3.2} who="theo" brow="up" mouth="smile" look={[1, 0]} bl={BL(T)} />
    <MGPerson x={850} y={1540} s={3.2} who="nia" brow={t > c5 ? 'angry' : 'flat'} mouth={t > c5 ? 'o' : 'flat'} look={[-1, 0]} bl={BL(T, 0.4)} />
    <MGBubble x={280} y={820} text="$20?" size={72} k={(t - c1) / 0.3} />
    {t > c5 - 0.1 && <MGBubble x={790} y={760} text="$100." size={96} k={(t - c5 + 0.1) / 0.3} />}</g>);
}

/* 4 — the same shelf, new in the box: $40 */
function IKBox({ T, t, beats }) {
  const c = b(beats, 2, 1.5);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={250} text="SAME SHELF · STORE PRICE" outline size={40} pop={t / 0.25} />
    <g transform={`translate(0 ${(1 - EO((t - 0.1) / 0.4)) * -800})`}><Box x={540} y={920} s={1.5} price={t > c - 0.1 ? '$40' : ''} /></g>
    {t > c && <MGRing cx={390} cy={905} rx={150} ry={95} p={(t - c) / 0.4} />}</g>);
}

/* 5 — name it: the shelf in a golden spotlight on a stage */
function IKName({ T, t, beats }) {
  const k = SM(0.2, 0.8, t);
  return (<g><MGBg kind="stage" />
    <MGSpot x={540} yTop={-50} yBot={1320} wTop={120} wBot={560} a={0.45 * k} />
    <Shelf x={540} y={1300} s={0.8} T={T} glow={k} />
    <MGChip x={540} y={250} text="PSYCHOLOGY" size={44} pop={t / 0.25} />
    <MGTitle lines={[['THE IKEA', '#fff', 150], ['EFFECT', A, 170]]} y={430} a={SM(b(beats, 2, 1) - 0.2, b(beats, 2, 1) + 0.2, t)} /></g>);
}

/* 6 — the study: hands with an Allen key build a plain storage box */
function IKStudy({ T, t, beats }) {
  const c = b(beats, 3, 1.4), bld = SM(c - 0.2, c + 1.0, t);
  return (<g><MGBg kind="wall" c1="#2f4d3e" c2="#16261e" />
    <MGChip x={540} y={250} text="NORTON, MOCHON & ARIELY" outline size={40} pop={t / 0.25} />
    <g transform="translate(540 1000)">
      {[0, 1, 2, 3].map((i) => { const tgt = [[-170, 0, 0], [170, 0, 0], [0, 150, 90], [0, -150, 90]][i], from = [[-360, 220, 30], [360, 240, -25], [-260, 330, 60], [280, -320, 120]][i], k = SM(i * 0.2, i * 0.2 + 0.4, bld);
        return <rect key={i} x={-20} y={-170} width="40" height="340" rx="6" fill="#f2ece2" stroke={K} strokeWidth="7" transform={`translate(${lp(from[0], tgt[0], k)} ${lp(from[1], tgt[1], k)}) rotate(${lp(from[2], tgt[2], k)})`} />; })}
      {bld > 0.95 && <rect x="-150" y="-130" width="300" height="260" fill="#f7f5f0" opacity="0.5" />}
      <g transform={`translate(${200 + OS(T, 0.4) * 10} ${-200}) rotate(${OS(T, 0.5) * 30})`}><path d="M0 0 L0 -120 L60 -120" fill="none" stroke="#5c5c66" strokeWidth="18" strokeLinejoin="round" strokeLinecap="round" /></g></g>
    <MGChip x={540} y={1300} text="PLAIN STORAGE BOX" size={44} pop={(t - c) / 0.25} /></g>);
}

/* 7 — 63% more: two price tags; the builder's tag stretches */
function IKStat({ T, t, beats }) {
  const c = b(beats, 1, 0.9), g = SM(c - 0.3, c + 0.5, t), v = Math.round(63 * g);
  const tag = (x, h, label, col) => (<g><rect x={x - 130} y={1240 - h} width="260" height={h} rx="20" fill={col} stroke={K} strokeWidth="7" />
    <text x={x} y={1310} textAnchor="middle" fontFamily={OSW} fontWeight="700" fontSize="38" fill="#fff">{label}</text></g>);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={250} text="WILLINGNESS TO PAY" outline size={40} pop={t / 0.25} />
    {tag(300, 380, 'PRE-BUILT', '#6a7bd1')}
    {tag(780, 380 * (1 + 0.63 * g), 'BUILT IT', A)}
    <MGHead x={780} y={1240 - 380 * (1 + 0.63 * g) - 100} r={80} who="nia" brow="up" mouth="grin" bl={BL(T)} />
    <MGBigNum x={300} y={720} text={`+${v}%`} size={170} col={v >= 63 ? A : '#fff'} /></g>);
}

/* 8 — effort makes us love it: Nia hugs the shelf, hearts float */
function IKLove({ T, t, beats }) {
  return (<g><MGBg kind="wall" c1="#6a2230" c2="#34101a" />
    <Shelf x={830} y={1250} s={0.7} T={T} glow={0.6} />
    <MGBust x={380} y={940} r={190} who="nia" brow="up" mouth="smile" look={[0.6, 0.3]} bl={BL(T)} blush={1} />
    {[...Array(6)].map((_, i) => { const r = ((T * 0.4 + i / 6) % 1); return <path key={i} d="M0 -12 C-26 -50 -75 -20 0 34 C75 -20 26 -50 0 -12 Z" fill={R} stroke={K} strokeWidth="4" opacity={1 - r} transform={`translate(${620 + (hsh(i) - 0.5) * 400} ${1000 - r * 700}) scale(${0.6 + hsh(i + 9) * 0.5})`} />; })}
    <MGChip x={540} y={250} text="LABOR → LOVE" size={46} pop={t / 0.25} /></g>);
}

/* 9 — the catch: a half-built box, the glow switches off */
function IKBut({ T, t, beats }) {
  const c = b(beats, 3, 1.4), off = SM(c - 0.2, c + 0.3, t);
  return (<g><MGBg kind="dark" />
    <MGGlow x={540} y={1000} r={500} col="#ffd36e" a={0.35 * (1 - off)} />
    <g transform="translate(540 1050)">
      <rect x={-190} y={-170} width="40" height="340" rx="6" fill="#f2ece2" stroke={K} strokeWidth="7" />
      <rect x={-20} y={-20} width="40" height="340" rx="6" fill="#f2ece2" stroke={K} strokeWidth="7" transform="rotate(90) translate(130 -130)" />
      <rect x={120} y={60} width="40" height="300" rx="6" fill="#f2ece2" stroke={K} strokeWidth="7" transform="rotate(35 140 210)" /></g>
    <MGChip x={540} y={300} text="UNFINISHED" outline col="#ff8a7a" size={52} pop={(t - 0.2) / 0.25} />
    <MGHead x={830} y={640} r={90} who="theo" brow="up" mouth="flat" look={[-0.6, 0.5]} bl={BL(T)} /></g>);
}

/* 10 — payoff: Theo slides a big flat-pack desk box to Nia */
function IKPayoff({ T, t, beats }) {
  const c = b(beats, 1, 0.8), k = EO((t - c) / 0.6);
  return (<g><MGBg kind="room" T={T} />
    <MGPerson x={170} y={1540} s={3.1} who="theo" brow="up" mouth="grin" look={[1, 0]} bl={BL(T)} />
    <MGPerson x={880} y={1540} s={3.1} who="nia" brow={t > b(beats, 3, 1.8) ? 'worried' : 'up'} mouth={t > b(beats, 3, 1.8) ? 'o' : 'smile'} look={[-1, 0]} bl={BL(T, 0.4)} sweat={t > b(beats, 3, 1.8) ? T * 0.8 : null} />
    <g transform={`translate(${lp(380, 560, k)} 0)`}><Box x={0} y={1280} s={0.95} label="DESK" /></g>
    <MGChip x={540} y={250} text="BUILD TIME · ??? HRS" size={44} pop={(t - b(beats, 3, 1.8)) / 0.25} /></g>);
}

Object.assign(window, { IKHook, IKWobble, IKOffer, IKBox, IKName, IKStudy, IKStat, IKLove, IKBut, IKPayoff });
})();
