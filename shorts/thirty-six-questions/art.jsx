// art.jsx — "36 Questions Made Strangers Close" (Otto ep. 2 with Arthur + Mae, retro modern illustration).
// Aron, Melinat, Aron, Vallone & Bator 1997: 45 minutes, three sets of 12 escalating questions; closer than small-talk pairs.
// Full 1080×1920 frames with retro-kit.jsx; captions sit at y ≈ 1540 (band 1420–1660) unless a line sets capY.
// Pure functions of T, t, dur, beats. t can be negative before a scene starts — everything is clamped.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, hsh, ink } = RM;
const FONT = "'Oswald', sans-serif", BEB = "'Bebas Neue', sans-serif";
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
// two strangers for the study scene (not recurring cast: plain style objects for RMHuman)
const S1 = { kind: 'human', skin: P.cream, skinD: '#D9C2A0', hair: 'bob', hairCol: P.blk, moustache: false, lips: true, jacket: P.yel };
const S2 = { kind: 'human', skin: P.yel, skinD: '#D9A62A', hair: 'flat', hairCol: P.blue, moustache: false, jacket: P.blue };

/* teacup with rising steam */
function Tea({ x, y, s = 1, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => { const r = ((T * 0.6 + i / 3) % 1); return <path key={i} d={`M${-40 + i * 40} ${-90 - r * 160} q-25 -30 0 -60 q25 -30 0 -60`} fill="none" stroke={P.cream} strokeWidth="9" strokeLinecap="round" opacity={(1 - r) * 0.8} />; })}
    <path d="M-110 -80 L110 -80 L85 70 L-85 70 Z" fill={P.blk} transform="translate(10 10)" />
    <path d="M-110 -80 L110 -80 L85 70 L-85 70 Z" fill={P.cream} {...ink(7)} />
    <path d="M110 -40 C175 -40 175 40 95 40" fill="none" {...ink(14)} />
    <rect x={-110} y={-48} width={220} height={26} fill={P.red} />
    <ellipse cx={0} cy={86} rx={150} ry={22} fill={P.cream} {...ink(6)} /></g>);
}
/* a question card (cream, hard shadow); lines split with | */
function QCard({ x, y, text, k = 1, rot = -0.04, size = 54, w = 760, col = P.cream, num }) {
  if (k <= 0) return null;
  const ls = text.split('|'), h = ls.length * size * 1.15 + 70;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)}) rotate(${rot * 180 / Math.PI})`}>
    <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w} height={h} fill={P.blk} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={col} {...ink(6)} />
    {num && <text x={-w / 2 + 26} y={-h / 2 + 46} fontFamily={BEB} fontSize="44" fill={P.red}>{num}</text>}
    {ls.map((l, i) => <text key={i} x={0} y={-h / 2 + 35 + size * 0.95 + i * size * 1.15} textAnchor="middle" fontFamily={BEB} fontSize={size} letterSpacing="3" fill={P.blk}>{l}</text>)}</g>);
}
/* an office desk edge */
const Desk = ({ y = 1380 }) => (<g><rect x={-300} y={y} width={1680} height={700} fill={P.blk} /><rect x={-300} y={y} width={1680} height={36} fill={P.redD} {...ink(6)} /></g>);

/* 1 — ten years side by side, never looking at each other; calendar pages fly off */
function QHook({ T, t, beats }) {
  const yrs = Math.min(10, Math.floor(cl((t - 0.2) / 1.6) * 10) + 1);
  return (<g><RMBg kind="red" />
    {[...Array(10)].map((_, i) => { const k = cl((t - 0.2) * 6 - i * 0.9); if (k <= 0 || i >= yrs) return null;
      return <g key={i} transform={`translate(${300 + i * 55 + k * 120} ${430 + hsh(i) * 120 - k * 80}) rotate(${(hsh(i + 9) - 0.5) * 60 + k * 30})`} opacity={1 - k * 0.5}>
        <rect x={-55} y={-65} width={110} height={130} fill={P.cream} {...ink(5)} /><rect x={-55} y={-65} width={110} height={30} fill={P.blue} {...ink(5)} />
        <text y={40} textAnchor="middle" fontFamily={BEB} fontSize="56" fill={P.blk}>{2016 + i}</text></g>; })}
    <RMOtto x={300} y={1000} s={0.72} mouth="flat" brow="flat" lid={0.45} look={[-0.6, 0]} />
    <RMArthur x={790} y={1010} s={0.7} mouth="flat" brow="flat" lid={0.5} look={[0.6, 0]} />
    <Desk />
    <RMChip x={540} y={200} text={`DESK 4 · DESK 5 · YEAR ${yrs}`} col={P.cream} size={44} pop={t / 0.25} /></g>);
}

/* 2 — Otto's entire file on Arthur: one line, TEA */
function QTea({ T, t, beats }) {
  const c = bt(beats, 3, 1.6);
  return (<g><RMBg kind="blue" />
    <g transform="translate(540 560) rotate(-3)"><RMGrid x={-330} y={-250} w={660} h={500} />
      <text x={-290} y={-170} fontFamily={BEB} fontSize="64" letterSpacing="4" fill={P.blk}>FILE: ARTHUR</text>
      <text x={-290} y={-90} fontFamily={FONT} fontWeight="700" fontSize="40" fill={P.blk}>KNOWN FACTS: 1</text>
      {t > c - 0.1 && <g><rect x={-300} y={-40} width={420 * EO((t - c + 0.1) / 0.3)} height={90} fill={P.yel} /><text x={-280} y={30} fontFamily={BEB} fontSize="80" fill={P.blk}>LIKES TEA</text></g>}
      {[0, 1, 2].map((i) => <rect key={i} x={-290} y={90 + i * 50} width={560} height={20} fill={P.blk} opacity="0.85" />)}</g>
    <RMOtto x={360} y={1260} s={0.62} mouth="frown" brow="up" lid={0.3} look={[0.4, -0.6]} />
    <Tea x={820} y={1330} s={1.1} T={T} /></g>);
}

/* 3 — Mae slaps down a list: 36 */
function QList({ T, t, beats }) {
  const c = bt(beats, 3, 1.6), k = EO((t - c + 0.2) / 0.4);
  return (<g><RMBg kind="red" />
    <RMMae x={540} y={1180} s={0.78} mouth="smile" brow="up" lid={0.2} look={[0, 0.6]} />
    <g transform={`translate(540 ${lp(1700, 470, EO((t - 0.2) / 0.5))}) rotate(-4) scale(0.85)`}>
      <rect x={-250 + 14} y={-300 + 14} width={500} height={600} fill={P.blk} />
      <rect x={-250} y={-300} width={500} height={600} fill={P.cream} {...ink(7)} />
      <text y={-150} textAnchor="middle" fontFamily={BEB} fontSize={110 + 130 * k} fill={P.red}>36</text>
      {[...Array(9)].map((_, i) => <rect key={i} x={-190} y={-60 + i * 36} width={300 + 80 * hsh(i)} height={14} fill={P.blk} opacity={0.75} />)}</g>
    <RMChip x={540} y={170} text="45 MINUTES" col={P.yel} size={48} pop={(t - c) / 0.25} /></g>);
}

/* 4 — easy question: Otto, already imagining his statue */
function QFamous({ T, t, beats }) {
  const c = bt(beats, 3, 1.6);
  return (<g><RMBg kind="red" />
    <QCard x={540} y={330} text="WOULD YOU LIKE|TO BE FAMOUS?" num="Q2" size={68} w={820} k={(t - bt(beats, 1, 0.5)) / 0.3} />
    {t > c && [...Array(10)].map((_, i) => { const a = -Math.PI + i * Math.PI / 9; return <RMLine key={i} x1={300 + Math.cos(a) * 300} y1={1000 + Math.sin(a) * 300} x2={300 + Math.cos(a) * (360 + 30 * Math.sin(T * 8 + i))} y2={1000 + Math.sin(a) * (360 + 30 * Math.sin(T * 8 + i))} w={10} c={P.yel} />; })}
    <RMOtto x={300} y={1030} s={0.62} mouth={t > c ? 'open' : 'smile'} brow="up" lid={0.1} look={[0, -1]} />
    <RMArthur x={820} y={1110} s={0.56} mouth="flat" brow="up" lid={0.4} look={[-0.8, 0]} /></g>);
}

/* 5 — deeper: lights go down, the two lean in */
function QDeep({ T, t, beats }) {
  const k = SM(0, 0.8, t);
  return (<g><RMBg kind="dark" waves={false} /><RMBulb x={540} y={240} T={T} />
    <QCard x={540} y={560} text="WHAT DO YOU VALUE|MOST IN A FRIENDSHIP?" num="Q16" size={60} w={900} k={(t - bt(beats, 1, 0.5)) / 0.3} rot={0.03} />
    <RMOtto x={lp(240, 300, k)} y={1180} s={0.6} rot={0.08 * k} mouth="flat" brow="sad" lid={0.35} look={[0.8, 0.2]} />
    <RMArthur x={lp(840, 780, k)} y={1190} s={0.58} rot={-0.08 * k} mouth="flat" brow="sad" lid={0.35} look={[-0.8, 0.2]} /></g>);
}

/* 6 — forty-five minutes later: Otto wipes his eyes, a glowing tear */
function QTears({ T, t, beats }) {
  const c = bt(beats, 2, 1.4);
  return (<g><RMBg kind="redDark" />
    <RMAlarm x={850} y={370} T={T} ring={t < 0.8 ? 1 : 0} s={0.6} />
    <RMChip x={330} y={240} text="45:00" col={P.cream} size={64} pop={t / 0.25} />
    <RMOtto x={540} y={1020} s={1.0} mouth="frown" brow="sad" lid={0.45} look={[0, 0.4]} tear={t > c ? t - c : null} />
    {t > c && <RMHand x={lp(1150, 760, EO((t - c) / 0.4))} y={1010} s={0.42} rot={-1.3} col={P.blue} />}</g>);
}

/* 7 — 1997: the other Arthur (Aron) pairs two strangers across a table, list in between */
function QAron({ T, t, beats }) {
  const c = bt(beats, 3, 1.6), k = EO((t - bt(beats, 4, 2.2)) / 0.5);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={190} text="ARON ET AL · 1997" col={P.cream} size={50} pop={t / 0.25} />
    <QCard x={540} y={400} text="ARTHUR ARON" size={72} w={600} col={P.yel} k={(t - c + 0.2) / 0.3} rot={0.03} />
    <RMHuman who={S1} x={lp(-200, 270, k)} y={1130} s={0.5} mouth="flat" brow="up" lid={0.3} look={[0.9, 0]} />
    <RMHuman who={S2} x={lp(1280, 810, k)} y={1130} s={0.5} mouth="flat" brow="up" lid={0.3} look={[-0.9, 0]} />
    <rect x={180} y={1300} width={720} height={40} fill={P.blk} />
    <g transform={`translate(540 1250) scale(${BK((t - bt(beats, 4, 2.2) - 0.3) / 0.3)})`}><rect x={-70} y={-60} width={140} height={110} fill={P.cream} {...ink(5)} /><text y={22} textAnchor="middle" fontFamily={BEB} fontSize="64" fill={P.red}>36</text></g>
    <RMChip x={540} y={1260 - 170} text="STRANGERS" col={P.pink} size={40} pop={(t - bt(beats, 4, 2.2) - 0.4) / 0.25} /></g>);
}

/* 8 — closer than small talk: two pairs, one far apart, one linked by cyan electricity */
function QCloser({ T, t, beats }) {
  const k = EO((t - bt(beats, 2, 1.0)) / 0.6);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={170} text="AFTER 45 MINUTES" col={P.cream} size={44} pop={t / 0.25} />
    <g><RMChip x={540} y={330} text="SMALL TALK" col={P.pink} size={44} pop={(t - 0.3) / 0.25} />
      <RMHuman who={S1} x={260} y={560} s={0.32} body={false} mouth="flat" lid={0.6} look={[-0.6, 0]} />
      <RMHuman who={S2} x={820} y={560} s={0.32} body={false} mouth="flat" lid={0.6} look={[0.6, 0]} /></g>
    <g><RMChip x={540} y={830} text="36 QUESTIONS" col={P.yel} size={44} pop={(t - bt(beats, 1, 0.6)) / 0.25} />
      <RMHuman who={S1} x={lp(260, 400, k)} y={1110} s={0.36} body={false} mouth="smile" brow="up" lid={0.1} look={[0.9, 0]} />
      <RMHuman who={S2} x={lp(820, 680, k)} y={1110} s={0.36} body={false} mouth="smile" brow="up" lid={0.1} look={[-0.9, 0]} />
      {k > 0.5 && [0, 1, 2].map((i) => <RMBolt key={i} x={480} y={1060 + i * 30} len={120} ang={0.1 * (i - 1)} seed={i + 4} T={T} />)}</g></g>);
}

/* 9 — escalating self-disclosure: a staircase of cards, each one a bit deeper */
function QStep({ T, t, beats }) {
  const steps = ['NAME', 'HOBBIES', 'HOPES', 'FEARS', 'MEMORIES'];
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['SELF', P.cream, 140], ['DISCLOSURE', P.yel, 140]]} y={230} a={SM(0, 0.4, t)} />
    {steps.map((s, i) => { const k = (t - 0.3 - i * 0.3) / 0.3;
      return <g key={i}><QCard x={200 + i * 170} y={1290 - i * 150} text={s} size={44} w={260} k={k} rot={0} col={[P.cream, P.pink, P.yel, P.pink, P.cream][i]} /></g>; })}
    {(() => { const i = Math.min(4, Math.max(0, Math.floor((t - 0.4) / 0.3))); return <g transform={`translate(${200 + i * 170} ${1200 - i * 150 + Math.abs(Math.sin(T * 5)) * -20})`}><circle r={26} fill={P.red} {...ink(5)} /></g>; })()}</g>);
}

/* 10 — payoff: Otto brings Arthur a tea */
function QPayoff({ T, t, beats }) {
  const c = bt(beats, 3, 1.4), k = EO((t - 0.2) / 0.8);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={200} text="NEXT MORNING · 8:59" col={P.cream} size={44} pop={t / 0.25} />
    <RMArthur x={800} y={1060} s={0.66} mouth={t > c ? 'smile' : 'flat'} brow="up" lid={0.15} look={[-0.8, 0.3]} />
    <RMOtto x={lp(-100, 280, k)} y={1060} s={0.66} mouth="smile" brow="up" lid={0.2} look={[0.8, 0.2]} />
    <Tea x={lp(100, 540, k)} y={1260} s={0.8} T={T} />
    <Desk y={1400} />
    {t > c && <RMBadge x={900} y={520} r={80} k={(t - c) / 0.3} />}</g>);
}

Object.assign(window, { QHook, QTea, QList, QFamous, QDeep, QTears, QAron, QCloser, QStep, QPayoff });
})();
