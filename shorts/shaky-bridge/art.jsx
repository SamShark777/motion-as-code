// art.jsx — "The Shaky Bridge Date" (Milo ep. 2 + Theo, ted-MG motion graphics). Full 1080×1920 frames, tedmg-kit.jsx.
// Props: T, t, dur, beats. Caption band y ≈ 1370–1590 unless the line sets capY.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const WOMAN = { hair: 'long', hairCol: '#3a2a22', skin: '#e9d2b8', top: '#d9534f', pants: '#2f3347' };
const MAN = { hair: 'short', hairCol: '#4a3426', skin: '#f2dccb', top: '#6a7bd1', pants: '#2b2b2b' };

// canyon + bridge; sway 0..1 (0 = solid low bridge)
function Canyon({ T, sway = 1, low = false, children }) {
  const sw = sway * OS(T, 1.3) * 26, y0 = low ? 1180 : 900, sag = low ? 10 : 120;
  const by = (x) => y0 + sag * Math.sin(((x - 60) / 960) * Math.PI) + sw * Math.sin(((x - 60) / 960) * Math.PI);
  return (<g>
    <rect x="-300" y="-300" width="1680" height="2520" fill={low ? '#bfe0e8' : '#2c3a57'} />
    {!low && [...Array(30)].map((_, i) => <rect key={i} x={MG.hsh(i + 3) * 1080} y={MG.hsh(i + 33) * 500} width="3" height="3" fill="#fff" opacity="0.5" />)}
    {low ? <g><rect x="-300" y="1220" width="1680" height="800" fill="#7fb069" /><path d="M-300 1300 Q540 1260 1380 1320 L1380 1420 Q540 1360 -300 1400 Z" fill="#5aa9d6" /></g>
      : <g><path d="M-300 600 L120 640 L60 1920 L-300 1920 Z" fill="#3b2f2a" /><path d="M1380 600 L960 640 L1020 1920 L1380 1920 Z" fill="#3b2f2a" />
        {[...Array(9)].map((_, i) => <path key={i} d={`M${-40 + (i % 2) * 40} ${700 + i * 140} l90 30`} stroke="#2a201c" strokeWidth="10" />)}
        <path d="M120 1820 Q540 1760 960 1820 L960 1920 L120 1920 Z" fill="#4f8fb8" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${200 + i * 200 + (T * 80) % 200} 1840 l60 0`} stroke="#d6f0ff" strokeWidth="6" strokeLinecap="round" />)}
        {[...Array(8)].map((_, i) => <path key={i} d={`M${160 + i * 110} 1700 l40 -120 l40 120 Z`} fill="#1f4a3a" />)}</g>}
    {[...Array(25)].map((_, i) => { const x = 60 + i * 40; return <rect key={i} x={x - 16} y={by(x) - 6} width="32" height="18" rx="3" fill="#8c6a4a" stroke={K} strokeWidth="4" transform={`rotate(${sway * OS(T, 0.9, i * 0.05) * 6} ${x} ${by(x)})`} />; })}
    <path d={`M60 ${y0 - (low ? 60 : 130)} Q540 ${y0 - (low ? 60 : 130) + 2 * (sag + sw) - 60} 1020 ${y0 - (low ? 60 : 130)}`} stroke={K} strokeWidth="7" fill="none" />
    {[...Array(12)].map((_, i) => { const x = 140 + i * 72; return <line key={i} x1={x} y1={by(x) - (low ? 60 : 110) + (low ? 0 : 30 * Math.sin(((x - 60) / 960) * Math.PI))} x2={x} y2={by(x)} stroke={K} strokeWidth="4" />; })}
    {typeof children === 'function' ? children(by) : children}
  </g>);
}

/* 1 — hook: Milo, date in 2 days; Theo pops in: make it scary */
function SBHook({ T, t, beats }) {
  const th = BK((t - b(beats, 3)) / 0.35);
  return (<g><MGBg kind="room" />
    <MGBust x={500} y={820} r={220} who="milo" brow="worried" mouth="wave" look={[0.4, 0.2]} sweat={t * 0.5} bl={BL(T)} />
    <g transform={`translate(${lp(1250, 870, th)} 0)`}><MGHead x={0} y={1080} r={140} who="theo" mouth="grin" brow="up" look={[-0.8, 0]} bl={BL(T, 0.8)} /></g>
    <MGChip x={540} y={220} text="FIRST DATE IN 2 DAYS" outline size={44} pop={t / 0.25} />
    <MGBubble x={800} y={880} text="MAKE IT|SCARY." k={(t - b(beats, 4) + 0.05) / 0.3} size={54} /></g>);
}

/* 2 — Milo: worst advice ever */
function SBWorst({ T, t, beats }) {
  return (<g><MGBg kind="wall" c1="#e6d6bc" c2="#c2a985" />
    <MGBust x={540} y={800} r={230} who="milo" brow="angry" mouth="flat" look={[0, 0]} bl={0} />
    <MGChip x={540} y={240} text="ADVICE RATING: 0/10" size={44} col={R} txt="#fff" pop={(t - b(beats, 2)) / 0.3} /></g>);
}

/* 3 — the canyon, 1974: a woman with a clipboard meets a man mid-bridge */
function SBBridge({ T, t }) {
  return (<g><Canyon T={T} sway={1}>{(by) => <g>
      <MGPerson x={lp(-60, 440, EO(t / 1.6))} y={by(440)} s={2.3} who={MAN} walk={t < 1.6 ? t * 8 : 0} brow="worried" mouth="wave" look={[1, 0.5]} />
      <MGPerson x={620} y={by(620)} s={2.3} who={WOMAN} mouth="smile" look={[-1, 0]} bl={BL(T)} />
      <rect x="660" y={by(620) - 120} width="60" height="80" rx="4" fill="#fff" stroke={K} strokeWidth="4" /></g>}</Canyon>
    <MGChip x={540} y={240} text="VANCOUVER · 1974" outline size={44} pop={t / 0.25} />
    <MGChip x={540} y={340} text="70 M ABOVE THE RIVER" size={38} pop={(t - 0.3) / 0.25} /></g>);
}

/* 4 — her number, "in case you have questions" */
function SBNumber({ T, t, beats }) {
  const k = EO((t - 0.2) / 0.5);
  return (<g><MGBg kind="wall" c1="#3a4a68" c2="#1d2540" />
    <MGArm x1={-100} y1={1500} x2={lp(200, 470, k)} y2={lp(1100, 900, k)} sleeve="#d9534f" skin="#e9d2b8" />
    <g transform={`translate(${lp(260, 560, k)} ${lp(1060, 860, k)}) rotate(${lp(-20, -6, k)})`}>
      <rect x="-200" y="-120" width="400" height="240" rx="10" fill="#fffdf6" stroke={K} strokeWidth="7" />
      <text x="0" y="-40" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="40" fill={K}>QUESTIONS?</text>
      <text x="0" y="20" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="500" fontSize="34" fill={K}>CALL ME</text>
      <text x="0" y="80" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="64" fill={R}>☎ · · · · · ·</text></g>
    <MGHead x={760} y={480} r={150} who={MAN} mouth="o" brow="up" look={[-0.5, 0.8]} blush={SM(b(beats, 2), b(beats, 2) + 0.5, t)} bl={BL(T)} /></g>);
}

// 8 heads, `on` of them lit + a big number
function Row8({ T, on, col }) {
  return (<g>{[...Array(8)].map((_, i) => { const x = 165 + (i % 4) * 250, y = 520 + Math.floor(i / 4) * 280, lit = i < on;
    return (<g key={i} opacity={lit ? 1 : 0.45}>{lit && <MGGlow x={x} y={y} r={130} col={col} a={0.4} />}
      <ellipse cx={x} cy={y + 160} rx="95" ry="70" fill={MG.extra(i + 2).top} stroke={K} strokeWidth="5" />
      <MGHead x={x} y={y} r={80} who={MG.extra(i + 2)} mouth={lit ? 'grin' : 'flat'} bl={BL(T, i * 0.4)} />
      {lit && <text x={x + 70} y={y - 60} fontFamily="'Bebas Neue', sans-serif" fontSize="70" fill={col}>☎</text>}</g>); })}</g>);
}

/* 5 — the solid, low bridge: about 1 in 8 called */
function SBSolid({ T, t, beats }) {
  const e = b(beats, beats.length - 1), on = t > e ? 1 : 0;
  if (t < b(beats, 2)) return (<g><Canyon T={T} sway={0} low />
    <MGChip x={540} y={240} text="SOLID BRIDGE · 3 M HIGH" outline size={44} pop={t / 0.25} /></g>);
  return (<g><MGBg kind="navy" /><MGChip x={540} y={240} text="SOLID BRIDGE" outline size={44} pop={1} />
    <Row8 T={T} on={on} col="#9aa3ad" /><MGBigNum y={1210} text="1 IN 8" col="#fff" label="CALLED HER" size={180} /></g>);
}

/* 6 — the shaky bridge: half called */
function SBShaky({ T, t, beats }) {
  const e = b(beats, 2), on = t > e ? Math.min(4, Math.floor((t - e) / 0.12) + 1) : 0;
  if (t < b(beats, 1)) return (<g><Canyon T={T} sway={1.6} />
    <MGChip x={540} y={240} text="SHAKY BRIDGE · 70 M HIGH" outline size={44} pop={t / 0.25} /></g>);
  return (<g><MGBg kind="navy" /><MGChip x={540} y={240} text="SHAKY BRIDGE" outline size={44} pop={1} />
    <Row8 T={T} on={on} col={A} /><MGBigNum y={1210} text={on >= 4 ? 'HALF' : '…'} col={A} label="CALLED HER" size={200} /></g>);
}

/* 7 — the pounding heart: fear → "it must be her" */
function SBHeart({ T, t, beats }) {
  const beat = 1 + 0.12 * Math.max(0, Math.sin(T * 14)), e = b(beats, beats.length - 1), k = SM(e - 0.1, e + 0.4, t);
  return (<g><MGBg kind="wall" c1="#5a2a3e" c2="#2a1420" />
    <MGBust x={540} y={720} r={210} who={MAN} shirt="#6a7bd1" brow="up" mouth="o" look={[0.6, 0]} blush={0.9} bl={BL(T)} />
    <g transform={`translate(400 1150) scale(${beat})`}><path d="M0 40 C-80 -20 -60 -100 0 -60 C60 -100 80 -20 0 40 Z" fill={R} stroke={K} strokeWidth="7" /></g>
    {[0, 1, 2].map((i) => <path key={i} d={`M${330 - i * 30} ${1080 - i * 20} q-30 70 0 140`} stroke="#fff" strokeWidth="7" fill="none" opacity={0.5 * Math.max(0, Math.sin(T * 14 - i))} />)}
    <MGChip x={250} y={1300} text="BRIDGE" size={40} col="#fff" pop={(t - 0.3) / 0.25} a={1 - k} />
    <path d={`M470 1120 Q${700} ${1000 - 150 * k} 880 ${960}`} stroke={A} strokeWidth="10" fill="none" strokeDasharray="22 16" opacity={k} />
    <g opacity={k}><MGHead x={900} y={880} r={110} who={WOMAN} mouth="smile" look={[-0.8, 0]} bl={BL(T, 1)} /><MGChip x={900} y={1060} text="IT'S HER?" size={40} pop={k} /></g></g>);
}

/* 8 — name it */
function SBName({ T, t }) {
  const a = SM(0, 0.3, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1420} wTop={180} wBot={620} a={0.55 * a} />
    <MGPerson x={540} y={1420} s={3} who="milo" brow="up" mouth="o" look={[0, -0.2]} bl={BL(T)} />
    <g transform={`translate(700 860) scale(${0.9 + 0.1 * Math.max(0, Math.sin(T * 14))})`} opacity={a}><path d="M0 40 C-80 -20 -60 -100 0 -60 C60 -100 80 -20 0 40 Z" fill={R} stroke={K} strokeWidth="7" /></g>
    <MGChip x={540} y={260} text="PSYCHOLOGY" size={44} pop={(t - 0.1) / 0.25} /></g>);
}

/* 9 — Milo books the horror escape room… then the lights go out → PART 2 */
function SBCliff({ T, t, beats }) {
  const c = b(beats, 2), dark = SM(c + 0.3, c + 0.6, t), end = b(beats, beats.length - 1) + 0.6, k = EO((t - end) / 0.35);
  return (<g><MGBg kind="street" />
    <rect x="300" y="620" width="480" height="560" rx="10" fill="#1a1420" stroke={K} strokeWidth="10" />
    <rect x="270" y="520" width="540" height="110" rx="10" fill="#3a0f16" stroke={K} strokeWidth="8" />
    <text x="540" y="598" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="72" fill="#ff5a5a" opacity={0.7 + 0.3 * Math.sign(Math.sin(T * 9))}>ESCAPE ROOM</text>
    <MGChip x={540} y={240} text="LEVEL: TOTAL DARKNESS" size={42} col={R} txt="#fff" pop={(t - 0.3) / 0.25} />
    <MGPerson x={540} y={1300} s={2.6} who="milo" mouth={t > c ? 'wave' : 'grin'} brow={t > c ? 'worried' : 'up'} look={[0, -0.6]} bl={BL(T)} />
    <rect x="-300" y="-300" width="1680" height="2520" fill="#030205" opacity={0.92 * dark} />
    {dark > 0.5 && <g><circle cx="505" cy="1040" r="14" fill="#fff" /><circle cx="575" cy="1040" r="14" fill="#fff" /><circle cx="505" cy="1043" r="6" fill={K} /><circle cx="575" cy="1043" r="6" fill={K} /></g>}
    {t > end && <MGTitle lines={[['PART 2', A, 220], ['FOLLOW FOR THE DATE', '#fff', 64]]} y={760} a={k} />}</g>);
}

Object.assign(window, { SBHook, SBWorst, SBBridge, SBNumber, SBSolid, SBShaky, SBHeart, SBName, SBCliff });
})();
