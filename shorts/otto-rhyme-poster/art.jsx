// art.jsx — "Why Rhymes Sound More True" (Otto ep. 5, with Arthur; retro modern illustration). Rhyme-as-reason effect:
// McGlone & Tofighbakhsh 2000, Psychological Science ("Woes unite foes" rated more accurate than "Woes unite enemies";
// the edge shrank when people were told to judge meaning). No numbers on screen. Full 1080×1920 frames; captions y ≈ 1540.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const OSW = "'Oswald', sans-serif", BEB = "'Bebas Neue', sans-serif";

// framed motivational poster; l1/l2 lines; fix (0..1) strikes GREAT and writes TIRED
function Poster({ x, y, s = 1, l1 = 'WORK LATE,', l2 = 'FEEL GREAT', fix = 0, rot = 0, glow = 0, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-300 + 16} y={-380 + 16} width={600} height={760} fill={P.blk} />
    <rect x={-300} y={-380} width={600} height={760} fill={P.blk} />
    <rect x={-270} y={-350} width={540} height={700} fill={P.blue} />
    <circle cx={0} cy={-120} r={150} fill={P.yel} {...ink(6)} />
    {[...Array(10)].map((_, i) => { const a = i / 10 * Math.PI * 2 + T * 0.3; return <path key={i} d={`M${Math.cos(a) * 170} ${-120 + Math.sin(a) * 170} L${Math.cos(a) * 220} ${-120 + Math.sin(a) * 220}`} {...ink(10)} stroke={P.yel} />; })}
    <path d="M-270 60 L-120 -40 L-20 40 L90 -60 L270 80 L270 350 L-270 350 Z" fill={P.redD} {...ink(6)} />
    <text x={0} y={180} textAnchor="middle" fontFamily={BEB} fontSize="96" letterSpacing="6" fill={P.cream}>{l1}</text>
    <text x={0} y={290} textAnchor="middle" fontFamily={BEB} fontSize="96" letterSpacing="6" fill={P.yel} opacity={1 - cl((fix - 0.6) * 4)}>{l2}</text>
    {fix > 0.6 && <text x={0} y={290} textAnchor="middle" fontFamily={BEB} fontSize="96" letterSpacing="6" fill={P.cream} opacity={cl((fix - 0.6) * 4)}>FEEL <tspan fill={P.red}>TIRED</tspan></text>}
    {glow > 0 && <g opacity={glow}><path d="M-120 210 q120 40 240 0" fill="none" stroke={P.cyan} strokeWidth="10" strokeLinecap="round" />
      <text x={190} y={180} fontFamily={BEB} fontSize="60" fill={P.cyan}>♪</text><text x={-230} y={300} fontFamily={BEB} fontSize="60" fill={P.cyan}>♪</text></g>}
    {fix > 0 && fix <= 0.75 && <line x1={-10} y1={256} x2={-10 + 230 * cl(fix / 0.5)} y2={250} stroke={P.red} strokeWidth="16" strokeLinecap="round" />}
  </g>);
}
// a saying card with five stars filled to `stars`
function Card({ x, y, text, stars = 0, k = 1, col = P.cream, rot = -0.02, s = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k) * s}) rotate(${rot * 180 / Math.PI})`}>
    <rect x={-330 + 12} y={-150 + 12} width={660} height={300} fill={P.blk} /><rect x={-330} y={-150} width={660} height={300} fill={col} {...ink(7)} />
    <text x={0} y={-10} textAnchor="middle" fontFamily={BEB} fontSize="96" letterSpacing="4" fill={P.blk}>{text}</text>
    {[...Array(5)].map((_, i) => { const f = cl(stars - i); return (<g key={i} transform={`translate(${-160 + i * 80} 85)`}>
      <path d="M0 -32 L9 -10 L32 -10 L14 4 L20 28 L0 14 L-20 28 L-14 4 L-32 -10 L-9 -10 Z" fill={f > 0.5 ? P.yel : P.cream} {...ink(4)} /></g>); })}
  </g>);
}
function Marker({ x, y, rot = 30, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><path d="M0 0 L-16 -40 L16 -40 Z" fill={P.red} {...ink(5)} />
    <rect x={-26} y={-260} width={52} height={220} fill={P.cream} {...ink(6)} /><rect x={-26} y={-110} width={52} height={40} fill={P.red} {...ink(5)} /></g>);
}

/* 1 — Otto unveils his new poster: WORK LATE, FEEL GREAT; the rhyme glows */
function RMPosterHook({ T, t, beats }) {
  const c = bt(beats, 1, 0.8);
  return (<g><RMBg kind="red" />
    <Poster x={620} y={640} s={0.85} glow={SM(c, c + 0.4, t)} T={T} rot={2} />
    <RMOtto x={250} y={1080} s={0.62} mouth="smile" brow="up" lid={0.2} look={[0.8, -0.6]} />
    <RMChip x={620} y={160} text="NEW POSTER" col={P.cream} size={48} pop={t / 0.25} />
    {t > c && <RMChip x={860} y={1100} text="IT RHYMES!" pop={(t - c) / 0.25} size={46} rot={0.06} />}</g>);
}

/* 2 — Arthur nods along; a rating card fills its stars */
function RMArthurNods({ T, t, beats }) {
  const c = bt(beats, 4, 2.0), nod = Math.max(0, Math.sin(T * 6)) * 0.06;
  return (<g><RMBg kind="blue" />
    <Poster x={820} y={420} s={0.45} T={T} rot={4} />
    <g transform={`rotate(${nod * 57} 360 900)`}><RMArthur x={360} y={1040} s={0.6} mouth="smile" brow="up" lid={0.3} look={[0.8, -0.8]} /></g>
    <Card x={540} y={820} text="SOUNDS TRUE" stars={EO((t - c + 0.5) / 0.8) * 4.5} k={(t - c + 0.6) / 0.35} s={0.75} rot={0.04} /></g>);
}

/* 3 — snapback: a smooth golden slide into a glowing brain vs a rough rocky path; EASY → TRUE */
function RMSnapEasy({ T, t, beats }) {
  const c = bt(beats, 3, 1.2), p = ((T * 0.7) % 1);
  return (<g><RMBg kind="redDark" />
    <RMBrain cx={540} cy={1180} w={620} h={480} seed={4} />
    {[...Array(6)].map((_, i) => <RMBolt key={i} x={540 + (i - 2.5) * 40} y={980} len={150} ang={-Math.PI / 2 + (i - 2.5) * 0.3} seed={i + 1} T={T} />)}
    <path d="M120 300 C320 360 420 600 540 930" fill="none" stroke={P.yel} strokeWidth="60" strokeLinecap="round" />
    <path d="M120 300 C320 360 420 600 540 930" fill="none" stroke={P.blk} strokeWidth="6" strokeDasharray="1 30" />
    {(() => { const u = p, x = (1 - u) ** 3 * 120 + 3 * (1 - u) ** 2 * u * 320 + 3 * (1 - u) * u * u * 420 + u ** 3 * 540, y = (1 - u) ** 3 * 300 + 3 * (1 - u) ** 2 * u * 360 + 3 * (1 - u) * u * u * 600 + u ** 3 * 930;
      return <g transform={`translate(${x} ${y})`}><rect x={-80} y={-34} width={160} height={68} fill={P.cream} {...ink(5)} /><text y={14} textAnchor="middle" fontFamily={BEB} fontSize="44" fill={P.blk}>RHYME</text></g>; })()}
    <path d="M960 300 L900 380 L960 470 L870 560 L930 650 L840 760" fill="none" stroke={P.blk} strokeWidth="40" strokeLinejoin="round" />
    {[0, 1, 2].map((i) => <RMSpiky key={i} x={900 + (i % 2) * 40} y={380 + i * 150} s={0.25} eyes={false} />)}
    <RMChip x={540} y={170} text={t > c ? 'EASY = FEELS TRUE' : 'WISDOM?'} col={t > c ? P.yel : P.cream} size={48} pop={t > c ? (t - c) / 0.25 : t / 0.25} /></g>);
}

/* 4 — the study: a card "WOES UNITE FOES" gets rated; journal chip */
function RMStudyFoes({ T, t, beats }) {
  const c = bt(beats, 3, 2.0);
  return (<g><RMBg kind="red" /><RMGrid x={70} y={330} w={940} h={1020} />
    <RMChip x={540} y={200} text="PSYCHOLOGICAL SCIENCE · 2000" pop={t / 0.25} size={40} />
    <Card x={540} y={820} text="WOES UNITE FOES" stars={EO((t - c - 0.2) / 0.8) * 4} k={(t - c + 0.4) / 0.35} />
    <RMHuman x={300} y={1180} s={0.32} who={{ skin: P.yel, skinD: '#D9A62A', hair: 'bob', hairCol: P.red, moustache: false, lips: true, jacket: P.green }} mouth="smile" brow="up" lid={0.3} look={[0.7, -0.8]} />
    <RMHuman x={780} y={1180} s={0.32} who={{ skin: P.cream, skinD: '#D9C2A0', hair: 'curly', hairCol: P.blk, moustache: false, jacket: P.blue }} mouth="flat" brow="up" lid={0.3} look={[-0.7, -0.8]} /></g>);
}

/* 5 — the scale: the rhyming card sinks (judged truer), "ENEMIES" floats up */
function RMEnemiesScale({ T, t, beats }) {
  const c = bt(beats, 2, 1.4), tilt = -0.22 * EO((t - 0.4) / 0.8);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={200} text="SAME MEANING" col={P.cream} pop={(t - c) / 0.25} size={48} />
    <RMScale tilt={tilt} left={(x, y) => <Card x={x} y={y - 60} text="FOES" stars={4} s={0.56} />} right={(x, y) => <Card x={x} y={y - 60} text="ENEMIES" stars={2.5} s={0.56} col={P.pink} />} /></g>);
}

/* 6 — name it: stacked title with music notes; Otto's head bobbing to the beat */
function RMNameRhyme({ T, t }) {
  return (<g><RMBg kind="redDark" />
    <RMTitle lines={[['RHYME', P.yel, 190], ['AS REASON', P.cream, 130]]} y={230} a={EO(t / 0.35)} />
    {[0, 1, 2, 3].map((i) => { const ph = (T * 0.5 + i / 4) % 1; return <text key={i} x={200 + i * 230} y={1000 - ph * 300} fontFamily={BEB} fontSize="110" fill={P.cyan} opacity={Math.sin(ph * Math.PI)}>♪</text>; })}
    <g transform={`translate(0 ${Math.abs(Math.sin(T * 4)) * -20})`}><RMOtto x={540} y={1050} s={0.55} body={false} mouth="smile" brow="up" lid={0.4} look={[0, -0.3]} /></g></g>);
}

/* 7 — told to judge the meaning: a magnifier over the words, an ear crossed out; the scale levels */
function RMJudgeMeaning({ T, t, beats }) {
  const c = bt(beats, 3, 1.6), lv = EO((t - c + 0.3) / 0.8), tilt = -0.22 * (1 - lv);
  return (<g><RMBg kind="red" />
    <g transform="translate(250 330)"><path d="M-40 -90 C60 -110 90 0 30 40 C0 60 10 100 -30 100 C-70 100 -80 60 -60 40" fill="none" {...ink(16)} />
      <line x1={-110} y1={-120} x2={110} y2={120} stroke={P.red} strokeWidth="24" strokeLinecap="round" /></g>
    <g transform="translate(740 340)"><circle r={130} fill="rgba(143,239,255,0.25)" {...ink(20)} /><circle r={130} fill="none" stroke={P.yel} strokeWidth="8" />
      <line x1={95} y1={95} x2={200} y2={200} {...ink(40)} /><text y={18} textAnchor="middle" fontFamily={BEB} fontSize="60" fill={P.cream}>MEANING</text></g>
    <RMScale tilt={tilt} left={(x, y) => <Card x={x} y={y - 60} text="FOES" stars={4 - lv} s={0.56} />} right={(x, y) => <Card x={x} y={y - 60} text="ENEMIES" stars={2.5 + 0.5 * lv} s={0.56} col={P.pink} />} /></g>);
}

/* 8 — self-proof: the slogan circling in Arthur's head */
function RMSloganHead({ T, t }) {
  return (<g><RMBg kind="red" />
    <RMLoopRings T={T} text="WORK LATE, FEEL GREAT" cx={540} cy={860} />
    <RMArthur x={540} y={940} s={0.6} mouth="flat" brow="up" lid={0.5} look={[0.3, -0.6]} /></g>);
}

/* 9 — Arthur fixes the poster with a marker; Otto gasps */
function RMArthurFix({ T, t, beats }) {
  const c = bt(beats, 2, 1.2), fix = cl((t - c + 0.4) / 1.2);
  return (<g><RMBg kind="blue" />
    <Poster x={620} y={640} s={0.85} fix={fix} T={T} rot={2} />
    {fix > 0 && fix < 1 && <Marker x={lp(560, 760, fix)} y={lp(860, 900, fix) + Math.sin(T * 30) * 5} s={0.8} />}
    <RMArthur x={230} y={1100} s={0.55} mouth="smile" brow="flat" lid={0.45} look={[0.8, -0.6]} />
    {t > c + 0.8 && <g><RMOtto x={880} y={1260} s={0.42} body={false} mouth="open" brow="up" lid={0} look={[-0.8, -0.6]} wide /></g>}</g>);
}

/* 10 — end: the fixed poster; Otto shrugs, Arthur smirks; CHECK IT chip */
function RMEndCatchy({ T, t, beats }) {
  const c = bt(beats, 2, 1.0);
  return (<g><RMBg kind="redDark" />
    <Poster x={540} y={560} s={0.7} fix={1} T={T} />
    <RMArthur x={270} y={1150} s={0.5} mouth="smile" brow="flat" lid={0.45} look={[0.8, -0.3]} />
    <RMOtto x={810} y={1150} s={0.5} mouth="frown" brow="up" lid={0.3} look={[-0.8, -0.3]} />
    {t > c && <RMChip x={540} y={1060} text="CATCHY ≠ TRUE" pop={(t - c) / 0.25} size={52} />}</g>);
}

Object.assign(window, { RMPosterHook, RMArthurNods, RMSnapEasy, RMStudyFoes, RMEnemiesScale, RMNameRhyme, RMJudgeMeaning, RMSloganHead, RMArthurFix, RMEndCatchy });
})();
