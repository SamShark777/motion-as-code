// art.jsx — "Why Second Place Feels Worse Than Third" (Dev ep. 6, with Theo; ted-MG motion graphics, pattern "test").
// Counterfactual thinking: Medvec, Madey & Gilovich 1995 (JPSP) — raters judged 1992 Olympic bronze medalists happier
// than silver medalists; silver compares up ("almost gold"), bronze compares down ("at least a medal"). No study numbers
// on screen. Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif";
const GOLD = '#F2C230', SILV = '#C9CED6', BRON = '#C9824A';
const DEV = '#3f7fbf', DEV_SKIN = '#c99b74', THEO = '#4f9d78', THEO_SKIN = '#e9d2b8';

// a medal on a V ribbon; col = metal, n = place number
function Medal({ x, y, s = 1, col = SILV, n = 2, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-34 -120 L-6 -10 L14 -10 L-12 -120 Z" fill="#3f6fd1" stroke={K} strokeWidth="4" strokeLinejoin="round" />
    <path d="M34 -120 L6 -10 L-14 -10 L12 -120 Z" fill={R} stroke={K} strokeWidth="4" strokeLinejoin="round" />
    <circle cx="0" cy="30" r="46" fill={col} stroke={K} strokeWidth="6" /><circle cx="0" cy="30" r="32" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="4" />
    <text x="0" y="48" textAnchor="middle" fontFamily={BB} fontSize="52" fill={K}>{n}</text></g>);
}
// one podium block, top-centre at (x, top), bottom at y0
function Step({ x, top, y0 = 1350, w = 300, n, col }) {
  return (<g><rect x={x - w / 2} y={top} width={w} height={y0 - top} fill="#f4efe4" stroke={K} strokeWidth="8" />
    <rect x={x - w / 2} y={top} width={w} height="34" fill={col} stroke={K} strokeWidth="8" />
    <text x={x} y={top + 150} textAnchor="middle" fontFamily={BB} fontSize="130" fill={K} opacity="0.85">{n}</text></g>);
}
function Podium() {
  return (<g><Step x={540} top={990} n={1} col={GOLD} /><Step x={230} top={1090} n={2} col={SILV} /><Step x={850} top={1170} n={3} col={BRON} />
    <rect x="-300" y="1350" width="1680" height="600" fill="#6f9a52" /><rect x="-300" y="1350" width="1680" height="14" fill="#557a3e" /></g>);
}
// medal hung on a standing figure's chest (feet at y, figure scale s)
function ChestMedal({ x, y, s, col, n, rot = 0 }) { const ms = s * 0.36; return <Medal x={x} y={y - 128 * s + 120 * ms + 6} s={ms} col={col} n={n} rot={rot} />; }
function Sky() {
  return (<g><MGBg kind="wall" c1="#a9d8ef" c2="#f6dcae" />
    <circle cx="880" cy="300" r="90" fill="#ffe9a0" opacity="0.8" />
    <g transform="translate(540 440)"><rect x="-400" y="-60" width="800" height="110" rx="14" fill={R} stroke={K} strokeWidth="8" />
      <text y="28" textAnchor="middle" fontFamily={BB} fontSize="72" letterSpacing="4" fill="#fff">FUN RUN 5K · FINISH</text>
      <rect x="-420" y="-60" width="22" height="980" fill="#5b5b66" stroke={K} strokeWidth="5" /><rect x="398" y="-60" width="22" height="980" fill="#5b5b66" stroke={K} strokeWidth="5" /></g></g>);
}
// confetti burst (deterministic)
function Confetti({ t, x = 540, y = 600, n = 26, from = 0 }) {
  const k = t - from; if (k <= 0) return null;
  return (<g>{[...Array(n)].map((_, i) => { const a = hsh(i) * Math.PI * 2, v = 260 + hsh(i + 9) * 340, px = x + Math.cos(a) * v * Math.min(1, k * 1.6), py = y + Math.sin(a) * v * Math.min(1, k * 1.6) + k * k * 220;
    return <rect key={i} x={px} y={py} width="18" height="30" rx="4" fill={[A, R, '#7fd6ff', '#b6ff7a', '#ff8fb1'][i % 5]} transform={`rotate(${hsh(i + 3) * 360 + k * 300} ${px + 9} ${py + 15})`} />; })}</g>);
}

/* 1 — the 5K podium: Dev on the silver step, arms crossed, sulking; a ring lands on his face at "sulking" */
function MGSilverSulk({ T, t, beats }) {
  const c2 = b(beats, 2, 1.4);
  return (<g><Sky /><Podium />
    <MGChip x={540} y={200} text="RESULTS · 2ND PLACE: DEV" outline size={42} pop={t / 0.25} />
    <MGPerson x={540} y={990} s={2.0} who={MG.extra(4)} mouth="grin" brow="up" look={[0, -0.3]} bl={BL(T, 2)} />
    <MGPerson x={230} y={1090} s={2.7} who="dev" mouth="frown" brow="angry" look={[-0.6, 0.4]} bl={BL(T)} />
    <ChestMedal x={230} y={1090} s={2.7} col={SILV} n={2} rot={Math.sin(T * 2) * 4} />
    <MGRing cx={230} cy={663} rx={130} ry={120} p={(t - c2) / 0.4} />
    {t > c2 && <MGChip x={330} y={310} text="SULKING" col={R} txt="#fff" size={44} pop={(t - c2) / 0.25} />}</g>);
}

/* 2 — the test: two big medals with a "?" each; PAUSE & PICK chip; a pause icon pulses */
function MGPickTest({ T, t, beats }) {
  const c2 = b(beats, 2, 1.2), pulse = 1 + 0.06 * Math.sin(T * 6);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={210} text="PAUSE & PICK" size={56} pop={t / 0.25} />
    <g transform={`translate(540 380) scale(${pulse})`}><circle r="70" fill="none" stroke="#fff" strokeWidth="8" /><rect x="-26" y="-34" width="18" height="68" fill="#fff" /><rect x="8" y="-34" width="18" height="68" fill="#fff" /></g>
    {[[290, SILV, 2, 'SILVER', 0.1], [790, BRON, 3, 'BRONZE', c2]].map(([x, col, n, w, d]) => { const k = EO((t - d) / 0.4);
      return (<g key={n} opacity={k}><Medal x={x} y={760} s={2.6} col={col} n={n} />
        <text x={x} y={1210} textAnchor="middle" fontFamily={BB} fontSize="92" fill={col}>{w}</text>
        <text x={x} y={1330} textAnchor="middle" fontFamily={BB} fontSize="110" fill="#fff" opacity={0.6 + 0.4 * Math.sin(T * 4 + n)}>?</text></g>); })}</g>);
}

/* 3 — snapback: Theo on the bronze step beams with confetti; Dev still sulks; ring on both faces */
function MGTheoGrin({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c2 = b(beats, 2, 1.2);
  return (<g><Sky /><Podium />
    <MGPerson x={230} y={1090} s={2.7} who="dev" mouth="frown" brow="angry" look={[1, 0.2]} bl={BL(T)} />
    <ChestMedal x={230} y={1090} s={2.7} col={SILV} n={2} />
    <MGPerson x={850} y={1170} s={2.7} who="theo" mouth="grin" brow="up" look={[-0.3, -0.4]} bl={BL(T, 1)} />
    <ChestMedal x={850} y={1170} s={2.7} col={BRON} n={3} rot={Math.sin(T * 5) * 8} />
    <Confetti t={t} x={850} y={620} from={c1} />
    {t > c2 && <g><MGRing cx={230} cy={663} rx={130} ry={120} p={(t - c2) / 0.4} /><MGRing cx={850} cy={743} rx={130} ry={120} p={(t - c2 - 0.15) / 0.4} />
      <MGChip x={540} y={240} text="BRONZE IS HAPPIER?!" col={R} txt="#fff" size={50} pop={(t - c2) / 0.25} /></g>}</g>);
}

/* 4 — the study: a TV with the Olympic podium; journal chip; an AGONY ↔ ECSTASY slider being rated */
function MGOlympicTV({ T, t, beats }) {
  const c3 = b(beats, 3, 1.8), sl = 0.5 + 0.35 * Math.sin(T * 1.6);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={190} text="J. PERS. SOC. PSYCHOLOGY · 1995" outline size={38} pop={t / 0.25} />
    <MGChip x={540} y={300} text="BARCELONA OLYMPICS · 1992" size={40} pop={(t - 0.3) / 0.25} />
    <g transform="translate(540 760)"><rect x="-400" y="-280" width="800" height="520" rx="40" fill="#2a2a34" stroke={K} strokeWidth="10" />
      <rect x="-360" y="-245" width="720" height="450" rx="18" fill="#bfe3f2" />
      <rect x="-360" y="95" width="720" height="110" fill="#6f9a52" />
      {[[-200, 40, SILV], [0, -10, GOLD], [200, 70, BRON]].map(([x, top, col], i) => <g key={i}><rect x={x - 90} y={top} width="180" height={205 - top} fill="#f4efe4" stroke={K} strokeWidth="5" /><rect x={x - 90} y={top} width="180" height="16" fill={col} />
        <MGPerson x={x} y={top} s={0.9} who={MG.extra(i + 6)} mouth={['flat', 'grin', 'grin'][i]} look={[0, 0]} bl={BL(T, i)} /></g>)}
      <rect x="-60" y="240" width="120" height="70" fill="#2a2a34" /></g>
    <g transform="translate(540 1200)" opacity={SM(c3 - 0.4, c3, t)}><rect x="-380" y="-14" width="760" height="28" rx="14" fill="#3a4060" />
      <circle cx={lp(-380, 380, sl)} cy="0" r="36" fill={A} stroke={K} strokeWidth="6" />
      <text x="-380" y="-50" fontFamily={BB} fontSize="54" fill="#fff">AGONY</text><text x="380" y="-50" textAnchor="end" fontFamily={BB} fontSize="54" fill="#fff">ECSTASY</text></g></g>);
}

/* 5 — result: two columns, silver vs bronze; the bronze joy bar grows taller; faces frown vs grin */
function MGJoyMeter({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), g = EO((t - 0.2) / 1.2);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="HOW HAPPY THEY LOOKED" outline size={42} pop={t / 0.25} />
    {[[300, SILV, 2, 0.45, 'frown'], [780, BRON, 3, 0.85, 'grin']].map(([x, col, n, h, m]) => { const H = 640 * h * g;
      return (<g key={n}><rect x={x - 110} y={1300 - 640} width="220" height="640" rx="20" fill="#2a3150" stroke={K} strokeWidth="6" />
        <rect x={x - 110} y={1300 - H} width="220" height={H} rx="20" fill={col} stroke={K} strokeWidth="6" />
        <MGHead x={x} y={1300 - H - 110} r={80} who={n === 2 ? 'dev' : 'theo'} mouth={m} brow={n === 2 ? 'worried' : 'up'} look={[0, 0]} bl={BL(T, n)} />
        <Medal x={x} y={1220} s={0.9} col={col} n={n} /></g>); })}
    {t > c1 && <MGChip x={780} y={330} text="BRONZE WINS" col={R} txt="#fff" size={48} pop={(t - c1) / 0.25} />}</g>);
}

/* 6 — silver compares UP: Dev looks up at a glowing gold medal just out of reach; arrows point up */
function MGCompareUp({ T, t, beats }) {
  const c2 = b(beats, 2, 1.3), reach = SM(0.2, 1.2, t);
  return (<g><MGBg kind="wall" c1="#3d4c78" c2="#1f2440" />
    <MGGlow x={700} y={420} r={300} col="#ffe08a" a={0.55} />
    <Medal x={700} y={420 + Math.sin(T * 2) * 10} s={2.2} col={GOLD} n={1} />
    <MGChip x={300} y={210} text="SO CLOSE" outline size={46} pop={t / 0.25} />
    <MGBust x={420} y={1000} r={150} who="dev" mouth="frown" brow="worried" look={[0.6, -1]} bl={BL(T)} />
    <MGArm x1={560} y1={1260} x2={lp(600, 650, reach)} y2={lp(1000, 780, reach)} sleeve={DEV} skin={DEV_SKIN} w={64} />
    {t > c2 && <MGChip x={700} y={700} text="ALMOST GOLD" col={R} txt="#fff" size={50} pop={(t - c2) / 0.25} />}</g>);
}

/* 7 — bronze compares DOWN: Theo looks down at the empty 4th-place spot and grins */
function MGCompareDown({ T, t, beats }) {
  const c2 = b(beats, 2, 1.4);
  return (<g><MGBg kind="wall" c1="#ffe2b8" c2="#f2a96a" />
    <MGChip x={540} y={200} text="COULD'VE BEEN 4TH" outline size={46} pop={t / 0.25} />
    <g transform="translate(830 1220)"><rect x="-210" y="-40" width="420" height="80" fill="#f4efe4" stroke={K} strokeWidth="7" /><text y="20" textAnchor="middle" fontFamily={BB} fontSize="56" fill={K}>4TH · NO MEDAL</text></g>
    <MGBust x={330} y={760} r={150} who="theo" mouth="grin" brow="up" look={[0.7, 0.9]} bl={BL(T, 1)} />
    <Medal x={370} y={1150} s={1.3} col={BRON} n={3} rot={Math.sin(T * 3) * 6} />
    {t > c2 && <MGChip x={540} y={330} text="AT LEAST I MEDALED" col={A} size={48} pop={(t - c2) / 0.25} />}</g>);
}

/* 8 — name it: title, with two thought paths "WHAT HAPPENED" vs "WHAT ALMOST HAPPENED" */
function MGNameCounter({ T, t }) {
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGTitle lines={[['COUNTERFACTUAL', A, 116], ['THINKING', '#fff', 150]]} y={230} a={EO((t - 0.15) / 0.35)} />
    <MGBubble x={300} y={760} text="WHAT HAPPENED" k={(t - 0.5) / 0.3} size={40} />
    <MGBubble x={780} y={700} text="WHAT ALMOST HAPPENED" k={(t - 0.9) / 0.3} size={38} />
    <MGPerson x={540} y={1300} s={2.3} who="dev" mouth="flat" brow="worried" look={[Math.sin(T * 1.5), -0.8]} bl={BL(T)} /></g>);
}

/* 9 — self-proof: the train door closes as Dev arrives; "MISSED BY 2 SECONDS" */
function MGAlmostDay({ T, t, beats }) {
  const c4 = b(beats, 4, 2.4), shut = SM(0.2, 0.9, t);
  return (<g><MGBg kind="wall" c1="#cfd9e6" c2="#8fa0b8" />
    <rect x="-300" y="1260" width="1680" height="700" fill="#5c6270" /><rect x="-300" y="1240" width="1680" height="30" fill={A} />
    <rect x="80" y="380" width="920" height="880" rx="30" fill="#c43c32" stroke={K} strokeWidth="10" />
    {[0, 1].map((s) => <g key={s}><rect x={s ? lp(800, 545, shut) : lp(80, 335, shut) - 0} y="520" width="200" height="740" fill="#d9d9de" stroke={K} strokeWidth="8" transform={s ? '' : `translate(${0} 0)`} />
      <rect x={(s ? lp(800, 545, shut) : lp(80, 335, shut)) + 30} y="580" width="140" height="240" rx="12" fill="#bfe3f2" stroke={K} strokeWidth="6" /></g>)}
    <MGPerson x={lp(-80, 380, EO(t / 1.0))} y={1300} s={2.4} who="dev" walk={T * 10 * (t < 1 ? 1 : 0)} mouth={t > 1 ? 'o' : 'flat'} brow="worried" look={[1, 0]} bl={BL(T)} sweat={T} />
    <MGChip x={540} y={240} text="MISSED BY 2 SECONDS" col={R} txt="#fff" size={48} pop={(t - 0.9) / 0.25} />
    {t > c4 && <MGChip x={540} y={350} text="YEAH, THAT ONE" size={44} pop={(t - c4) / 0.25} />}</g>);
}

/* 10 — end: Dev steps down to stand with Theo; both smile; question + send chips */
function MGEndStepThree({ T, t, beats }) {
  const c2 = b(beats, 2, 1.4), c4 = b(beats, 4, 2.6);
  return (<g><Sky /><Podium />
    <MGPerson x={lp(230, 770, EO((t - 0.2) / 1.2))} y={lp(1090, 1170, EO((t - 0.2) / 1.2))} s={2.5} who="dev" mouth={t > 1 ? 'smile' : 'flat'} brow="up" look={[1, -0.2]} bl={BL(T)} />
    <MGPerson x={930} y={1170} s={2.5} who="theo" mouth="grin" brow="up" look={[-1, -0.2]} bl={BL(T, 1)} />
    <MGChip x={540} y={200} text="SAME RACE" size={52} pop={t / 0.25} />
    {t > c2 && <MGChip x={540} y={320} text="SILVER OR BRONZE?" col={R} txt="#fff" size={48} pop={(t - c2) / 0.25} />}
    {t > c4 && <MGChip x={540} y={430} text="SEND IT TO THAT FRIEND" outline size={40} pop={(t - c4) / 0.25} />}</g>);
}

Object.assign(window, { MGSilverSulk, MGPickTest, MGTheoGrin, MGOlympicTV, MGJoyMeter, MGCompareUp, MGCompareDown, MGNameCounter, MGAlmostDay, MGEndStepThree });
})();
