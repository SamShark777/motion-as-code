// art.jsx — "The Doodler Remembered More" (June ep. 1, ted-MG motion graphics). Full 1080×1920 frames with tedmg-kit.jsx.
// Props: T, t, dur, beats. Caption band y ≈ 1370–1590 (lines that need the space set capY).
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const MEET = { c1: '#9fb3c4', c2: '#6f8597' };

// a spiral, drawn up to p (0..1)
function spiral(cx, cy, turns, step, p) {
  const n = Math.max(2, Math.floor(80 * turns * cl(p)));
  let d = '';
  for (let i = 0; i < n; i++) { const a = i / 80 * Math.PI * 2, r = 4 + a * step; d += (i ? ' L' : 'M') + (cx + Math.cos(a) * r).toFixed(1) + ' ' + (cy + Math.sin(a) * r).toFixed(1); }
  return d;
}
// notebook page with doodles: kind 'spiral' | 'shark'
function Note({ x, y, w = 420, h = 300, rot = -6, p = 1, kind = 'spiral', names = 0 }) {
  const sw = 9;
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w} height={h} rx="14" fill="#000" opacity="0.18" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="14" fill="#fffdf6" stroke={K} strokeWidth="7" />
    {[...Array(5)].map((_, i) => <line key={i} x1={-w / 2 + 24} x2={w / 2 - 24} y1={-h / 2 + 60 + i * 50} y2={-h / 2 + 60 + i * 50} stroke="#9cc3e6" strokeWidth="3" />)}
    <line x1={-w / 2 + 60} x2={-w / 2 + 60} y1={-h / 2 + 8} y2={h / 2 - 8} stroke="#f29a9a" strokeWidth="3" />
    {kind === 'spiral' && [[-90, -10, 1], [40, 30, 0.8], [130, -50, 0.6]].map(([sx, sy, sc], i) =>
      <path key={i} d={spiral(sx, sy, 3.2 * sc, 3.4 * sc, p * 3 - i)} stroke={i === 1 ? '#3f7fbf' : K} strokeWidth={sw * 0.7} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
    {kind === 'shark' && [-110, 20, 140].map((sx, i) => { const k = cl(p * 3 - i); return k > 0 && (<g key={i} opacity={k}>
      <path d={`M${sx - 50} ${30} L${sx} ${-50 * k + 30} L${sx + 25} ${30}`} fill="#8aa0b4" stroke={K} strokeWidth="6" strokeLinejoin="round" />
      <path d={`M${sx - 70} 40 Q${sx - 45} 25 ${sx - 20} 40 T${sx + 30} 40 T${sx + 80} 40`} stroke="#3f7fbf" strokeWidth="5" fill="none" /></g>); })}
    {names > 0 && ['SAT · 7PM', 'MAYA', 'LEO', 'PIZZA'].map((s, i) => <text key={i} x={w / 2 - 30} y={-h / 2 + 52 + i * 52} textAnchor="end" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="34" fill={R} opacity={cl(names * 4 - i)}>{s}</text>)}
  </g>);
}
function Table({ y = 1180, col = '#6b4a32' }) {
  return <g><rect x="-300" y={y} width="1680" height="1100" fill={col} /><rect x="-300" y={y} width="1680" height="26" fill="#000" opacity="0.18" /><rect x="-300" y={y - 18} width="1680" height="22" fill="#8c6a4a" stroke={K} strokeWidth="5" /></g>;
}
function Pen({ x, y, rot = 30 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`}><rect x="-12" y="-170" width="24" height="160" rx="8" fill={A} stroke={K} strokeWidth="5" />
    <path d="M-12 -10 L0 22 L12 -10 Z" fill="#f2dccb" stroke={K} strokeWidth="5" strokeLinejoin="round" /><circle cx="0" cy="16" r="4" fill={K} /></g>);
}

/* 1 — hook: June looks down, spirals spreading across her notebook */
function DDHook({ T, t, dur, beats }) {
  const p = SM(0, dur * 0.95, t), a = p * 3 * 3.2 * 0.8 * Math.PI * 2;
  const px = 540 + 40 + Math.cos(a) * 30, py = 1330 + 30 + Math.sin(a) * 30;
  return (<g><MGBg kind="wall" {...MEET} /><MGGlow x={820} y={300} r={460} col="#fff" a={0.12} />
    <MGBust x={540} y={700 + OS(T, 3) * 3} r={220} who="june" brow="flat" mouth="smile" look={[0.1, 0.9]} bl={BL(T)} />
    <Table y={1150} />
    <Note x={540} y={1330} w={600} h={380} rot={-4} p={p} />
    <MGArm x1={1180} y1={1980} x2={px + 60} y2={py - 50} sleeve="#5bb3b0" skin="#f2dccb" w={66} />
    <Pen x={px + 30} y={py - 20} rot={35} />
    <MGChip x={540} y={240} text="TEAM MEETING · 10:00" outline size={44} pop={t / 0.25} /></g>);
}

/* 2 — Dev leans in from the right: "not even listening?" */
function DDDev({ T, t, beats }) {
  const lean = EO(t / 0.5);
  return (<g><MGBg kind="wall" {...MEET} />
    <MGBust x={310} y={880} r={170} who="june" mouth="flat" look={[0.2, 0.9]} bl={BL(T, 1)} />
    <MGBust x={lp(1100, 780, lean)} y={760} r={200} who="dev" mouth="smile" brow="up" browUp={0.6} look={[-0.9, 0.4]} bl={BL(T, 0.4)} />
    <Table y={1260} /><Note x={330} y={1380} w={420} h={260} rot={-8} p={1} />
    <MGBubble x={760} y={470} text="YOU'RE NOT EVEN|LISTENING." k={(t - b(beats, 1) + 0.15) / 0.3} size={50} /></g>);
}

/* 3 — the boss turns from the board: one question */
function DDBoss({ T, t, beats }) {
  const q = BK((t - b(beats, 2)) / 0.35), boss = MG.extra(5);
  return (<g><MGBg kind="wall" c1="#b7c6d3" c2="#7d93a6" />
    <rect x="170" y="260" width="740" height="500" rx="16" fill="#f7f7f2" stroke={K} strokeWidth="8" />
    {[0, 1, 2].map((i) => <rect key={i} x="230" y={330 + i * 90} width={[520, 380, 450][i]} height="26" rx="13" fill="#c9d4de" />)}
    <path d="M240 650 L360 590 L470 620 L600 520 L720 560" stroke="#3f7fbf" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <MGPerson x={540} y={1250} s={3.2} who={boss} mouth={t > b(beats, 2) ? 'o' : 'flat'} brow="up" look={[0, 0.2]} bl={BL(T)} />
    {q > 0 && <text x="830" y="760" fontFamily="'Bebas Neue', sans-serif" fontSize={320 * q} fill={A} stroke={K} strokeWidth="8" textAnchor="middle" transform={`rotate(${OS(T, 1.2) * 6} 830 660)`}>?</text>}
    <Table y={1240} col="#5a3f2b" />
    {[150, 930].map((x, i) => <MGHead key={i} x={x} y={1330} r={120} who={MG.extra(i * 3 + 1)} look={[i ? -0.6 : 0.6, -0.6]} />)}
    <MGChip x={540} y={170} text="10:47 AM" outline size={44} pop={t / 0.25} /></g>);
}

/* 4 — Dev's mind: blank */
function DDBlank({ T, t, beats }) {
  const k = SM(b(beats, 1) - 0.2, b(beats, 1) + 0.3, t);
  return (<g><MGBg kind="wall" c1="#3c4a5c" c2="#202a36" /><MGSpot x={540} yTop={-100} yBot={1400} wTop={200} wBot={900} a={0.3} />
    <MGBust x={540} y={860} r={230} who="dev" brow="worried" mouth={k > 0.5 ? 'wave' : 'flat'} look={[0, -0.3]} sweat={t * 0.8} blush={k} bl={0} />
    <g opacity={k} transform={`translate(780 330) scale(${0.6 + 0.4 * BK(k)})`}>
      <ellipse cx="0" cy="0" rx="230" ry="150" fill="#fff" stroke={K} strokeWidth="7" />
      {[...Array(70)].map((_, i) => <rect key={i} x={-180 + MG.hsh(i + Math.floor(T * 12) * 3) * 360} y={-100 + MG.hsh(i * 7 + Math.floor(T * 12)) * 200} width="12" height="12" fill="#9aa3ad" opacity="0.6" />)}
      <circle cx="-150" cy="190" r="26" fill="#fff" stroke={K} strokeWidth="6" /><circle cx="-210" cy="250" r="14" fill="#fff" stroke={K} strokeWidth="5" /></g>
    <MGChip x={540} y={170} text="MEMORY: 0 FILES" size={42} pop={(t - b(beats, 2)) / 0.25} col={R} txt="#fff" /></g>);
}

/* 5 — But June remembers: names pop off her page */
function DDAnswer({ T, t, beats }) {
  const k = SM(b(beats, 1), b(beats, 1) + 1.2, t);
  return (<g><MGBg kind="wall" c1="#f0d9a8" c2="#d6b37a" /><MGGlow x={540} y={760} r={600} col="#fff3c4" a={0.35} />
    <MGBust x={540} y={700} r={220} who="june" mouth="grin" brow="up" browUp={0.5} look={[0, 0]} bl={BL(T, 0.3)} />
    <Note x={540} y={1180} w={560} h={330} rot={3} p={1} names={k} />
    {['SATURDAY', '7 PM', 'MAYA + LEO', 'BRING PIZZA'].map((s, i) => { const kk = (t - b(beats, 1) - i * 0.18) / 0.3;
      return <MGChip key={i} x={[230, 860, 220, 850][i]} y={[330, 300, 560, 540][i]} text={s} size={40} pop={kk} a={cl(kk * 3)} />; })}</g>);
}

/* 6 — the study: a dull voicemail, zzz */
function DDStudy({ T, t, beats }) {
  return (<g><MGBg kind="navy" /><MGChip x={540} y={240} text="PLYMOUTH STUDY · 2009" outline size={44} pop={t / 0.25} />
    <MGGlow x={540} y={880} r={520} col="#8fd8ff" a={0.08} />
    <MGPhone x={540} y={900} rot={-4} time="2:30" day="VOICEMAIL" from="UNKNOWN" msg="hi... so... about the party..." k={(t - 0.2) / 0.35} />
    {[...Array(3)].map((_, i) => { const p = ((t * 0.5 + i / 3) % 1); return <text key={i} x={800 + p * 120} y={560 - p * 260} fontFamily="'Bebas Neue', sans-serif" fontSize={70 + i * 20} fill="#fff" opacity={Math.sin(p * Math.PI) * SM(0.4, 0.9, t)}>Z</text>; })}
    {[0, 1, 2].map((i) => <path key={i} d={`M${330 - i * 40} ${700 - i * 30} Q${290 - i * 50} 900 ${330 - i * 40} ${1100 + i * 30}`} stroke="#8fd8ff" strokeWidth="8" fill="none" strokeLinecap="round" opacity={0.25 + 0.5 * Math.max(0, OS(T, 0.8, i * 0.2))} />)}
    <MGChip x={540} y={1260} text="40 PEOPLE · 2.5 MINUTES" size={42} pop={(t - b(beats, 3)) / 0.3} /></g>);
}

/* 7 — half of them shaded shapes */
function DDHalf({ T, t, beats }) {
  const on = 10 * SM(0.1, 1.2, t);
  return (<g><MGBg kind="navy" /><MGChip x={540} y={240} text="PLYMOUTH STUDY · 2009" outline size={44} pop={1} />
    <MGHeadGrid T={T} on={on} litOrder={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]} />
    {[...Array(10)].map((_, i) => { const k = BK((t - 0.3 - i * 0.06) / 0.3); const x = 180 + (i % 5) * 180 + 55, y = 470 + Math.floor(i / 5) * 220 + 70;
      return k > 0 && <g key={i} transform={`translate(${x} ${y}) scale(${k * 0.45})`}><Pen x={0} y={0} rot={30} /></g>; })}
    <MGChip x={330} y={1390} text="DOODLED" size={44} pop={(t - 0.5) / 0.3} />
    <MGChip x={740} y={1390} text="JUST LISTENED" size={44} col="#9aa3ad" pop={(t - 0.7) / 0.3} /></g>);
}

/* 8 — the result: 7.5 vs 5.8 details → +29% */
function DDStat({ T, t, beats }) {
  const g = SM(0.1, 1.4, t), e = b(beats, 3);
  const bar = (x, v, col, lab) => (<g><rect x={x - 110} y={1100 - v * 70 * g} width="220" height={v * 70 * g} rx="12" fill={col} stroke={K} strokeWidth="7" />
    <text x={x} y={1080 - v * 70 * g} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="80" fill="#fff" opacity={g}>{(v * g).toFixed(1)}</text>
    <text x={x} y="1170" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="40" fill="#cfd6e6">{lab}</text></g>);
  const k = BK((t - e) / 0.35);
  return (<g><MGBg kind="navy" /><MGChip x={540} y={240} text="SURPRISE MEMORY TEST" outline size={44} pop={t / 0.25} />
    {bar(330, 5.8, '#6b7488', 'LISTENED')}{bar(750, 7.5, A, 'DOODLED')}
    <text x="540" y="1210" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontSize="30" fill="#8d95a8">AVERAGE DETAILS RECALLED</text>
    {k > 0 && <g transform={`translate(330 450) rotate(-8) scale(${k})`}><circle r="150" fill={R} stroke={K} strokeWidth="8" />
      <text y="40" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="130" fill="#fff">+29%</text></g>}</g>);
}

/* 9 — why: daydream bubbles pop while the pen keeps moving */
function DDWhy({ T, t, dur, beats }) {
  const e = b(beats, 3), DAY = ['LUNCH?', 'BEACH...', 'MY EX?', 'CAT VIDEOS'];
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <MGBust x={540} y={760} r={210} who="june" mouth="smile" look={[0.1, 0.9]} bl={BL(T)} />
    <Table y={1180} col="#4b3428" /><Note x={540} y={1320} w={560} h={320} rot={-3} p={0.6 + 0.4 * SM(0, dur, t)} />
    {DAY.map((s, i) => { const at = 0.1 + i * 0.25, pop = t > e + i * 0.12; const k = pop ? 0 : (t - at) / 0.3;
      const x = [220, 860, 250, 840][i], y = [380, 330, 640, 600][i];
      return (<g key={i}>{k > 0 && <MGBubble x={x} y={y + OS(T, 2, i * 0.3) * 8} text={s} k={k} size={40} />}
        {pop && t < e + i * 0.12 + 0.35 && [...Array(8)].map((_, j) => { const a = j / 8 * 6.28, d = 30 + 120 * EO((t - e - i * 0.12) / 0.35);
          return <circle key={j} cx={x + Math.cos(a) * d} cy={y - 70 + Math.sin(a) * d} r="9" fill="#fff" />; })}</g>); })}</g>);
}

/* 10 — payoff: she was holding on to it */
function DDPayoff({ T, t, beats }) {
  const e = b(beats, 3);
  return (<g><MGBg kind="wall" c1="#f0d9a8" c2="#d6b37a" />
    {[...Array(14)].map((_, i) => <path key={i} d={spiral(MG.hsh(i + 3) * 1080, 200 + MG.hsh(i + 30) * 900, 2, 3, 1)} stroke="#fff" strokeWidth="5" fill="none" opacity="0.25" transform={`rotate(${T * 20 * (i % 2 ? 1 : -1)} ${MG.hsh(i + 3) * 1080} ${200 + MG.hsh(i + 30) * 900})`} />)}
    <MGBust x={540} y={720} r={220} who="june" mouth="smile" brow="up" browUp={0.3} look={[0, 0]} bl={BL(T, 0.6)} blush={0.6} />
    <g transform={`translate(540 ${1180 - 40 * EO((t - e) / 0.4)})`}><Note x={0} y={0} w={560} h={330} rot={OS(T, 2) * 3} p={1} /></g>
    <MGChip x={540} y={240} text="NOT DISTRACTED. ANCHORED." size={44} pop={(t - e) / 0.3} /></g>);
}

/* 11 — next meeting: Dev doodles too… sharks */
function DDCliff({ T, t, dur, beats }) {
  const e = b(beats, 3);
  return (<g><MGBg kind="wall" {...MEET} />
    <MGBust x={540} y={720} r={220} who="dev" mouth="grin" brow="flat" look={[0.2, 0.9]} bl={BL(T)} />
    <Table y={1160} /><Note x={540} y={1330} w={600} h={360} rot={4} kind="shark" p={SM(e - 0.6, e + 0.6, t)} />
    <MGHead x={150} y={1000} r={110} who="june" mouth="smile" brow="up" look={[0.9, 0.5]} bl={BL(T, 1.2)} />
    <MGChip x={540} y={240} text="NEXT MEETING · 10:00" outline size={44} pop={t / 0.25} /></g>);
}

Object.assign(window, { DDHook, DDDev, DDBoss, DDBlank, DDAnswer, DDStudy, DDHalf, DDStat, DDWhy, DDPayoff, DDCliff });
})();
