// art.jsx — "Angry? Say This One Word Out Loud" (Otto ep. 7, with Lila; retro modern illustration).
// Affect labeling: Lieberman, Eisenberger, Crockett, Tom, Pfeifer & Way 2007 (Psychological Science) — labeling the
// emotion in angry/fearful faces lowered amygdala activity. No numbers on screen. Full 1080×1920 frames with
// retro-kit.jsx; captions at y ≈ 1540 — faces stay out of y 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const OSW = "'Oswald', sans-serif", BEB = "'Bebas Neue', sans-serif";

// luggage-style word tag on a string from (x, y0) to the tag at (x, y)
function Tag({ x, y, y0 = -60, text, col = P.yel, k = 1, rot = 0 }) {
  if (k <= 0) return null;
  const w = text.length * 40 + 90;
  return (<g><line x1={x} y1={y0} x2={x} y2={y - 50} stroke={P.blk} strokeWidth="5" />
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k)})`}>
      <path d={`M${-w / 2 + 12} 50 L${-w / 2 + 12} -30 L${-w / 2 + 50} -60 L${w / 2 - 50} -60 L${w / 2 - 12} -30 L${w / 2 - 12} 50 Z`} transform="translate(10 10)" fill={P.blk} />
      <path d={`M${-w / 2} 50 L${-w / 2} -30 L${-w / 2 + 40} -60 L${w / 2 - 40} -60 L${w / 2} -30 L${w / 2} 50 Z`} fill={col} {...ink(6)} />
      <circle cx="0" cy="-34" r="10" fill={P.cream} {...ink(4)} />
      <text y="36" textAnchor="middle" fontFamily={BEB} fontSize="72" letterSpacing="4" fill={P.blk}>{text}</text></g></g>);
}
// office printer with a jammed, crumpled page; jam 0..1 shakes it
function Printer({ x, y, s = 1, jam = 1, T = 0 }) {
  const sh = Math.sin(T * 40) * 4 * jam;
  return (<g transform={`translate(${x + sh} ${y}) scale(${s})`}>
    <rect x="-230" y="-90" width="460" height="200" fill={P.cream} {...ink(8)} /><rect x="-230" y="-150" width="460" height="70" fill="#d9c7a8" {...ink(8)} />
    <rect x="-150" y="20" width="300" height="20" fill={P.blk} /><circle cx="170" cy="-40" r="16" fill={jam > 0 ? P.red : P.green} {...ink(4)} />
    <path d="M-120 25 L-80 -10 L-30 40 L10 -20 L60 30 L110 -5 L120 70 L-110 80 Z" fill="#fff" {...ink(6)} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${-60 + i * 50} ${40} l14 -24 l14 24`} fill="none" {...ink(4)} />)}
    <rect x="-240" y="100" width="480" height="40" fill={P.blk} /></g>);
}
// fMRI-style scanner ring, side view with a head inside
function Scanner({ x, y, s = 1, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-420" y="80" width="840" height="60" fill={P.cream} {...ink(7)} />
    <circle r="300" fill={P.cream} {...ink(9)} /><circle r="190" fill={P.blk} />
    <RMHuman x={0} y={10} s={0.4} who="arthur" body={false} rot={-Math.PI / 2} mouth="flat" brow="flat" lid={0.3} look={[0, -1]} />
    {[0, 1, 2].map((i) => { const ph = (T * 0.7 + i / 3) % 1; return <circle key={i} r={190 + ph * 160} fill="none" stroke={P.cyan} strokeWidth="5" opacity={0.6 * (1 - ph)} />; })}</g>);
}
// a heavy black stone with a label
function Stone({ x, y, s = 1, text = 'STRESS' }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-170 60 Q-200 -40 -110 -100 Q0 -150 110 -100 Q200 -40 170 60 Q0 110 -170 60 Z" fill={P.blk} />
    <text y="20" textAnchor="middle" fontFamily={BEB} fontSize="80" letterSpacing="4" fill={P.cream}>{text}</text></g>);
}
function Steam({ x, y, T, a = 1 }) {
  return <g opacity={a}>{[0, 1, 2].map((i) => { const ph = (T * 1.2 + i / 3) % 1; return <path key={i} d={`M${x + (i - 1) * 90} ${y - ph * 160} q20 -25 0 -50 q-20 -25 0 -50`} fill="none" stroke={P.cream} strokeWidth="10" strokeLinecap="round" opacity={Math.sin(ph * Math.PI)} />; })}</g>;
}

/* 1 — the printer jams before the meeting; Otto shouts, steam rising */
function RMPrinterRage({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={190} text="MEETING IN 2 MINUTES" pop={t / 0.25} />
    <Steam x={430} y={470} T={T} a={SM(0, 0.3, t)} />
    <RMOtto x={430} y={720} s={0.85} mouth="shout" brow="angry" lid={0.05} look={[0.7, 0.4]} stress />
    <Printer x={800} y={1210} s={0.95} jam={1} T={T} />
    {t > c1 && [0, 1].map((i) => <RMBolt key={i} x={760 + i * 100} y={1080} len={160} ang={-Math.PI / 2 - 0.3 + i * 0.6} seed={i + 3} T={T} />)}
    {t > c1 && <RMChip x={800} y={960} text="PAPER JAM" col={P.cream} size={40} pop={(t - c1) / 0.25} rot={0.05} />}</g>);
}

/* 2 — "you": jaw tight, typing in caps — "I'M FINE." */
function RMFineCaps({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), c4 = bt(beats, 4, 2.0), typ = t > c2 ? Math.floor(T * 8) % 2 : 0;
  return (<g><RMBg kind="redDark" />
    <RMOtto x={540} y={760} s={0.85} mouth="flat" brow="angry" lid={0.25} look={[0, 0.6]} stress />
    <g transform="translate(540 1230)"><rect x="-400" y="-70" width="800" height="150" fill={P.cream} {...ink(8)} />
      {[...Array(24)].map((_, i) => <rect key={i} x={-380 + (i % 12) * 64} y={-55 + Math.floor(i / 12) * 66} width="54" height="54" fill={(i + typ) % 5 === 0 && t > c2 ? P.yel : '#e6d6b8'} {...ink(4)} />)}
      <text x={-380 + 64 * 0 + 27} y={-14} textAnchor="middle" fontFamily={BEB} fontSize="34" fill={P.blk}>⇪</text></g>
    {t > c2 && <RMChip x={250} y={540} text="CAPS LOCK: ON" col={P.cream} size={40} pop={(t - c2) / 0.25} />}
    {t > c4 && <RMSpeech x={680} y={330} text="I'M FINE." size={96} col={P.yel} k={(t - c4) / 0.3} />}</g>);
}

/* 3 — snapback: a spiky anger blob shrinks the moment a word tag is hung on it */
function RMSnapName({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2), sh = lp(1.5, 0.75, EO((t - c2 - 0.1) / 0.6));
  return (<g><RMBg kind="blue" />
    <g transform={`rotate(${(T * 20) % 360} 540 900)`}><RMSpiky x={540} y={900} s={sh * 1.6} /></g>
    {t < c2 && <RMChip x={540} y={330} text="CALM DOWN!" col={P.cream} size={60} pop={t / 0.25} rot={-0.04} />}
    {t < c2 && <RMLine x1={330} y1={330} x2={330 + 420 * SM(0.6, 1.0, t)} y2={330} w={14} c={P.red} />}
    <Tag x={540} y={lp(-200, 720, EO((t - c2) / 0.45))} y0={-60} text="FRUSTRATED" k={(t - c2 + 0.05) / 0.3} rot={Math.sin(T * 2) * 4} />
    {t > c2 && <RMChip x={540} y={1260} text="NAME IT" size={70} pop={(t - c2 - 0.2) / 0.25} />}</g>);
}

/* 4 — the study: a brain scanner; a screen above shows an angry face and a scared face */
function RMFacesScan({ T, t, beats }) {
  const c4 = bt(beats, 4, 2.2);
  return (<g><RMBg kind="dark" />
    <RMChip x={540} y={170} text="PSYCHOLOGICAL SCIENCE · 2007" size={38} pop={t / 0.25} />
    <g transform="translate(540 500)"><rect x="-370" y="-190" width="740" height="380" fill={P.blue} {...ink(8)} />
      <RMLila x={-180} y={-10} s={0.36} body={false} mouth="shout" brow="angry" lid={0} look={[0, 0]} />
      <RMMae x={180} y={-10} s={0.36} body={false} mouth="open" brow="up" lid={0} look={[0, 0]} wide /></g>
    {t > c4 && <g><RMChip x={360} y={760} text="ANGRY" size={40} pop={(t - c4) / 0.25} /><RMChip x={720} y={760} text="SCARED" col={P.cream} size={40} pop={(t - c4 - 0.1) / 0.25} /></g>}
    <Scanner x={540} y={1110} s={0.85} T={T} /></g>);
}

/* 5 — the amygdala alarm on the brain rings, then quiets the moment a word tag lands */
function RMAlarmDown({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.7), ring = 1 - SM(c1, c1 + 0.4, t);
  return (<g><RMBg kind="blue" />
    <RMBrain cx={540} cy={1180} w={560} h={480} />
    <RMAlarm x={540} y={830} T={T} ring={ring} s={0.9} />
    {ring > 0.3 && [0, 1, 2].map((i) => <RMBolt key={i} x={540 + (i - 1) * 240} y={1040} len={150} ang={-Math.PI / 2 + (i - 1) * 0.5} seed={i + 9} T={T} />)}
    <Tag x={830} y={lp(-200, 560, EO((t - 0.1) / 0.5))} text="ANGRY" k={(t - 0.05) / 0.3} rot={Math.sin(T * 2) * 5} />
    <RMChip x={360} y={250} text="AMYGDALA = ALARM" size={44} pop={(t - b2(beats)) / 0.25} rot={-0.03} /></g>);
}
const b2 = (beats) => bt(beats, 2, 1.3);

/* 6 — name it: title with three swinging word tags */
function RMNameAffect({ T, t }) {
  return (<g><RMBg kind="red" />
    <RMTitle lines={[['AFFECT', P.cream, 190], ['LABELING', P.yel, 190]]} y={250} a={EO((t - 0.15) / 0.35)} />
    {[['ANGRY', 250, 900, P.yel], ['SCARED', 560, 1060, P.cream], ['SAD', 850, 880, P.pink]].map(([w, x, y, c], i) => <Tag key={w} x={x} y={y} y0={620} text={w} col={c} k={(t - 0.3 - i * 0.15) / 0.3} rot={Math.sin(T * 1.8 + i) * 6} />)}</g>);
}

/* 7 — Lila asks "FRUSTRATED?"; Otto nods and his jaw unclenches */
function RMLilaAsks({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), c3 = bt(beats, 3, 1.5), calm = SM(c3, c3 + 0.4, t), nod = t > bt(beats, 2, 1.0) && t < c3 + 0.3 ? Math.sin(T * 10) * 0.05 : 0;
  return (<g><RMBg kind="dark" />
    <RMLila x={260} y={960} s={0.62} mouth="smile" brow="up" lid={0.25} look={[0.8, 0]} />
    <RMOtto x={760} y={900 + nod * 200} s={0.72} mouth={calm > 0.5 ? 'smile' : 'flat'} brow={calm > 0.5 ? 'flat' : 'angry'} lid={lp(0.1, 0.4, calm)} look={[-0.6, 0]} stress={calm < 0.5} />
    {t > c1 && <RMSpeech x={400} y={330} text="FRUSTRATED?" size={86} col={P.yel} k={(t - c1) / 0.3} />}
    {t > c3 && <RMChip x={760} y={1290} text="JAW: UNCLENCHED" col={P.cream} size={40} pop={(t - c3) / 0.25} />}</g>);
}

/* 8 — self-proof: saying "I'm just stressed" lifts the stone off Otto's head */
function RMStressedLighter({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), c2 = bt(beats, 2, 1.2), lift = EO((t - c2) / 0.8);
  return (<g><RMBg kind="redDark" />
    <RMOtto x={540} y={1020} s={0.72} mouth={lift > 0.5 ? 'smile' : 'frown'} brow={lift > 0.5 ? 'up' : 'sad'} lid={0.3} look={[0, -0.8]} />
    <Stone x={540} y={lp(700, 260, lift) + Math.sin(T * 2) * 8 * lift} s={1.1} text="STRESS" />
    {lift > 0 && [0, 1].map((i) => <path key={i} d={`M${420 + i * 240} ${lp(780, 340, lift) + 80} l0 -60 m-20 20 l20 -20 l20 20`} fill="none" stroke={P.cream} strokeWidth="8" strokeLinecap="round" opacity={lift} />)}
    {t > c1 && <RMChip x={540} y={1300} text="'I'M JUST STRESSED'" size={44} pop={(t - c1) / 0.25} />}</g>);
}

/* 9 — end: calm Otto and Lila back at the (fixed) printer; ONE WORD. OUT LOUD. */
function RMEndOneWord({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g><RMBg kind={P.yel} />
    <Printer x={540} y={600} s={0.75} jam={0} T={T} />
    <RMOtto x={330} y={1060} s={0.62} mouth="smile" brow="flat" lid={0.35} look={[0.6, 0]} />
    <RMLila x={790} y={1080} s={0.58} mouth="smile" brow="up" lid={0.3} look={[-0.6, 0]} />
    <RMChip x={540} y={200} text="ONE WORD. OUT LOUD." col={P.cream} pop={t / 0.25} />
    {t > c3 && <Tag x={540} y={360} y0={-60} text="NAME IT" k={(t - c3) / 0.3} rot={Math.sin(T * 2) * 4} />}</g>);
}

Object.assign(window, { RMPrinterRage, RMFineCaps, RMSnapName, RMFacesScan, RMAlarmDown, RMNameAffect, RMLilaAsks, RMStressedLighter, RMEndOneWord });
})();
