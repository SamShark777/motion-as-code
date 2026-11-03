// art.jsx — "The Worst Scorers Thought They Were Above Average" (Otto ep. 4, retro modern illustration).
// The Dunning-Kruger effect (Kruger & Dunning 1999). Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
// a study participant (an extra, drawn with the kit's human)
const PT = { skin: P.pink, skinD: P.pinkD, hair: 'flat', hairCol: P.blk, moustache: false, jacket: P.green };
const scaled = (x, y, s, el) => <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{el}</g>;

// quiz table edge with two answer sheets and pencils
function QuizTable({ T, tick = 0 }) {
  return (<g>
    <rect x="-300" y="1200" width="1680" height="900" fill={P.redD} />
    <rect x="-300" y="1186" width="1680" height="28" fill={P.blk} />
    {[[150, -0.06], [650, 0.05]].map(([x, r], i) => (<g key={i} transform={`rotate(${r * 57.3} ${x + 140} 1300)`}>
      <RMGrid x={x} y={1225} w={280} h={170} step={28} />
      {[0, 1, 2].map((k) => <rect key={k} x={x + 30} y={1250 + k * 42} width={150 + hsh(i * 7 + k) * 70} height={10} fill={P.blk} opacity={k / 3 < tick ? 0.8 : 0} />)}
      <path d={`M${x + 200} 1380 L${x + 300} 1250`} stroke={P.yel} strokeWidth="18" strokeLinecap="butt" />
      <path d={`M${x + 200} 1380 L${x + 212} 1364`} stroke={P.blk} strokeWidth="18" /></g>))}
  </g>);
}

/* 1 — quiz night: Otto smug ("EASY!"), Arthur sweating ("I BOMBED") */
function RMQuizNight({ T, t, beats }) {
  const b1 = bt(beats, 1, 0.5), b3 = bt(beats, 3, 1.4);
  const sweat = t > b3 ? ((t - b3) * 1.4) % 1 : -1;
  return (<g><RMBg kind="red" /><RMBulb x={540} y={250} T={T} />
    <RMOtto x={280} y={830} s={0.58} mouth={t > b1 ? 'smile' : 'flat'} brow="flat" lid={0.45} look={[0.3, 0.3]} />
    <RMArthur x={800} y={830} s={0.58} mouth={t > b3 ? 'frown' : 'flat'} brow="sad" lid={0.1} wide look={[-0.2, 0.9]} stress={t > b3} />
    {sweat >= 0 && <path d={`M${900} ${640 + sweat * 120} q14 22 0 34 q-14 -12 0 -34 Z`} fill={P.cyan} opacity={1 - sweat} />}
    <QuizTable T={T} tick={cl(t / 2)} />
    {t > b1 && scaled(280, 400, 0.68, <RMSpeech x={280} y={400} text="EASY!" k={(t - b1) / 0.3} size={120} col={P.yel} />)}
    {t > b3 && scaled(800, 400, 0.68, <RMSpeech x={800} y={400} text="I BOMBED" k={(t - b3) / 0.3} size={100} col={P.pink} rot={0.05} />)}
    <RMChip x={540} y={120} text="QUIZ NIGHT" pop={t / 0.2} size={50} /></g>);
}

// vertical percentile ladder: real score low, the guess floats up above the average line
const PY = (p) => 1320 - 9.2 * p;
function Ladder({ T, t, rise, real = 1, nums = false }) {
  const gp = lp(12, 62, EO(rise)), gy = PY(gp);
  return (<g>
    <rect x={200} y={PY(100)} width={70} height={PY(0) - PY(100)} fill={P.cream} {...ink(7)} />
    <rect x={200} y={PY(12)} width={70} height={PY(0) - PY(12)} fill={P.red} {...ink(7)} />
    {[...Array(11)].map((_, i) => <RMLine key={i} x1={170} y1={PY(i * 10)} x2={200} y2={PY(i * 10)} w={6} />)}
    <path d={`M150 ${PY(50)} L1010 ${PY(50)}`} stroke={P.cream} strokeWidth="8" strokeDasharray="30 20" />
    <RMChip x={860} y={PY(50) + 2} text="AVERAGE" col={P.cream} size={34} />
    <text x={235} y={PY(100) - 30} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="44" letterSpacing="3" fill={P.cream}>TOP</text>
    <text x={235} y={PY(0) + 62} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="44" letterSpacing="3" fill={P.cream}>BOTTOM</text>
    {real > 0 && <g>
      {scaled(390, PY(12), BK(real), <RMHuman x={390} y={PY(12)} s={0.22} body={false} who={PT} mouth="flat" brow="flat" lid={0.3} look={[0.6, 0]} />)}
      <RMLine x1={280} y1={PY(12)} x2={330} y2={PY(12)} w={6} />
      <RMChip x={720} y={PY(12)} text={nums ? '~12TH PERCENTILE' : 'REAL SCORE'} col={P.pink} size={40} pop={real} /></g>}
    {rise > 0 && <g>
      <path d={`M390 ${PY(12) - 90} L390 ${gy + 80}`} stroke={P.yel} strokeWidth="8" strokeDasharray="18 14" />
      <path d={`M370 ${gy + 100} L390 ${gy + 76} L410 ${gy + 100}`} fill="none" stroke={P.yel} strokeWidth="8" />
      <g opacity={0.92}>{scaled(390, gy, 1, <RMHuman x={390} y={gy} s={0.22} body={false} who={{ ...PT, skin: P.yel, skinD: '#D9A62A' }} mouth="smile" brow="up" lid={0.4} look={[0.6, -0.3]} />)}</g>
      <RMChip x={720} y={gy} text={nums ? 'GUESSED ~62ND' : 'THEIR GUESS'} col={P.yel} size={40} pop={rise / 0.5} /></g>}
  </g>);
}

/* 2 — lean: "you know an Otto" close-up → the ladder: worst scorers rate themselves above average */
function RMRankLean({ T, t, beats }) {
  const c = bt(beats, 2, 1);
  if (t < c) return (<g><RMBg kind="red" />
    <RMOtto x={540} y={950} s={0.92} mouth="smile" brow="flat" lid={0.5} look={[0, 0]} />
    <RMChip x={540} y={230} text="YOU KNOW ONE" pop={t / 0.2} size={52} /></g>);
  const lt = t - c, b3 = bt(beats, 3, c + 0.5) - c, b4 = bt(beats, 4, c + 1) - c;
  return (<g><RMBg kind="blue" />
    <Ladder T={T} t={lt} real={(lt - b3 + 0.15) / 0.3} rise={(lt - b4) / 0.9} />
    <RMChip x={540} y={200} text="IN REAL TESTS" col={P.cream} pop={lt / 0.2} size={46} /></g>);
}

/* 3 — snapback: one bulb above Otto's head does BOTH jobs — answering and judging the answer */
function RMSnapJudge({ T, t, beats }) {
  const b3 = bt(beats, 3, 1), b5 = bt(beats, 5, 1.6), k5 = EO((t - b5) / 0.3);
  return (<g><RMBg kind="dark" />
    <RMBulb x={540} y={470} T={T} on={false} />
    <circle cx={540} cy={470} r={62} fill={P.blk} opacity={0.45} />
    {t > b3 && <g><path d={`M300 ${700} Q380 560 470 500`} fill="none" stroke={P.cream} strokeWidth="8" strokeDasharray="18 12" />
      <RMChip x={260} y={740} text="ANSWER IT" col={P.cream} size={44} pop={(t - b3) / 0.25} /></g>}
    {t > b5 && <g><path d={`M780 ${700} Q700 560 610 500`} fill="none" stroke={P.yel} strokeWidth="8" strokeDasharray="18 12" opacity={k5} />
      <RMChip x={820} y={740} text="JUDGE IT" size={44} pop={(t - b5) / 0.25} /></g>}
    <RMOtto x={540} y={1060} s={0.78} mouth="flat" brow="up" lid={0.15} look={[0, -1]} />
    <RMChip x={540} y={200} text={t > b5 ? 'SAME SKILL' : 'NOT DUMB'} col={t > b5 ? P.yel : P.cream} size={52} pop={t > b5 ? (t - b5) / 0.25 : t / 0.2} /></g>);
}

/* 4 — scoreboard: Otto LAST, Arthur near the top */
function RMScoreboard({ T, t, beats }) {
  const b1 = bt(beats, 1, 0.5), b3 = bt(beats, 3, 1.3);
  const ROWS = ['ARTHUR', 'MAE', 'LILA', 'OTTO'];
  return (<g><RMBg kind="red" />
    <rect x={110} y={210} width={880} height={700} fill={P.blk} />
    <rect x={140} y={240} width={820} height={640} fill={P.blue} {...ink(6)} />
    <text x={540} y={340} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="90" letterSpacing="10" fill={P.yel}>SCORES</text>
    {ROWS.map((n, i) => { const y = 460 + i * 120, k = EO((t - i * 0.12) / 0.3);
      return (<g key={n} opacity={k}><text x={210} y={y + 26} fontFamily="'Bebas Neue', sans-serif" fontSize="76" letterSpacing="6" fill={P.cream}>{n}</text>
        <path d={`M500 ${y + 12} L860 ${y + 12}`} stroke={P.cream} strokeOpacity="0.5" strokeWidth="6" strokeDasharray="6 18" /></g>); })}
    {t > b1 && <g transform={`translate(760 ${460 + 3 * 120}) rotate(-8) scale(${1.5 - 0.5 * EO((t - b1) / 0.25)})`} opacity={EO((t - b1) / 0.25)}>
      <rect x={-130} y={-56} width={260} height={112} fill={P.red} {...ink(6)} />
      <text y={34} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="100" letterSpacing="6" fill={P.cream}>LAST</text></g>}
    {t > b3 && <RMBadge x={800} y={460} r={52} k={(t - b3) / 0.3} />}
    <RMOtto x={280} y={1170} s={0.5} mouth={t > b1 ? 'open' : 'flat'} brow="up" lid={0} wide look={[0, -1]} />
    <RMArthur x={800} y={1170} s={0.5} mouth={t > b3 ? 'open' : 'flat'} brow="up" lid={0} wide look={[0, -1]} /></g>);
}

/* 5 — proof: Kruger & Dunning 1999 — bottom quarter ~12th percentile, guessed ~62nd */
function RMRankProof({ T, t, beats }) {
  const b3 = bt(beats, 3, 1.2), b5 = bt(beats, 5, 2.2);
  return (<g><RMBg kind="blue" />
    <Ladder T={T} t={t} nums real={(t - b3 + 0.2) / 0.3} rise={(t - bt(beats, 4, 1.8)) / 0.8} />
    <RMChip x={540} y={200} text="KRUGER & DUNNING · 1999" pop={t / 0.25} size={42} />
    {t > b5 && <RMBadge x={900} y={PY(62) - 120} r={46} k={(t - b5) / 0.3} />}</g>);
}

/* 6 — name it: the eye macro with smug Otto in the pupil */
function RMNameDK({ T, t }) {
  return (<g><RMEyeMacro open={EO(t / 0.5)}><RMOtto x={540} y={1010} s={0.3} mouth="smile" brow="flat" lid={0.5} /></RMEyeMacro>
    <RMTitle lines={[['DUNNING-KRUGER', P.cream, 130], ['EFFECT', P.yel, 180]]} y={190} a={EO((t - 0.3) / 0.4)} /></g>);
}

/* 7 — the last "EASY" that wasn't: the bubble cracks and drops, Otto deflates */
function RMEasyCrack({ T, t, beats }) {
  const b2 = bt(beats, 2, 1), b3 = bt(beats, 3, 1.6), f = EO((t - b2) / 0.7), cracked = t > b2;
  return (<g><RMBg kind="red" />
    <g transform={`translate(0 ${f * 260}) rotate(${f * 14} 560 420)`} opacity={1 - SM(0.5, 1, f)}>
      <RMSpeech x={560} y={420} text="EASY!" k={t / 0.3} size={150} col={P.yel} />
      {cracked && <path d="M520 290 L560 380 L520 430 L580 500 L540 560" fill="none" stroke={P.cream} strokeWidth="12" strokeLinejoin="miter" />}</g>
    <RMOtto x={540} y={1060} s={0.8} mouth={cracked ? 'frown' : 'smile'} brow={cracked ? 'sad' : 'flat'} lid={cracked ? 0.05 : 0.45} wide={cracked} look={cracked ? [0.3, -0.8] : [0, 0]} stress={cracked} />
    {t > b3 && <RMChip x={540} y={200} text="YEAH, THAT ONE" pop={(t - b3) / 0.25} size={50} />}</g>);
}

/* 8 — everyone's a beginner somewhere → Arthur's "maybe I don't know" lights the bulb */
function RMBeginner({ T, t, beats }) {
  const c = bt(beats, 3, 1.4);
  if (t < c) return (<g><RMBg kind="red" />
    {[['otto', 220], ['arthur', 540], ['lila', 860]].map(([w, x], i) => <g key={w}>
      <RMHuman who={w} x={x} y={940} s={0.42} mouth="flat" brow="up" lid={0.15} look={[0, -0.6]} />
      <RMChip x={x} y={670} text="BEGINNER" col={P.cream} size={34} pop={(t - 0.25 - i * 0.18) / 0.25} rot={(i - 1) * 0.04} /></g>)}
    <RMChip x={540} y={230} text="EVERYONE" pop={t / 0.2} size={52} /></g>);
  const lt = t - c;
  return (<g><RMBg kind="red" /><RMBulb x={540} y={330} T={T} on />
    {[...Array(8)].map((_, i) => { const a = Math.PI * (0.05 + i / 7 * 0.9), k = EO(lt / 0.4); return <RMLine key={i} x1={540 + Math.cos(a) * 95} y1={330 + Math.sin(-a) * 95 + 30} x2={540 + Math.cos(a) * (95 + 60 * k)} y2={330 + Math.sin(-a) * (95 + 60 * k) + 30} w={8} c={P.yel} />; })}
    <RMArthur x={540} y={1060} s={0.78} mouth="smile" brow="up" lid={0.15} look={[0, -0.7]} />
    {scaled(540, 560, 0.8, <RMSpeech x={540} y={560} text="MAYBE I DON'T KNOW" k={lt / 0.3} size={66} col={P.cream} rot={0.03} />)}</g>);
}

/* 9 — end: back at the quiz table; Otto humbled, Arthur smiling under a lit bulb; comment prompt */
function RMEndDoubt({ T, t, beats }) {
  const c = bt(beats, 2, 1.2);
  return (<g><RMBg kind="red" /><RMBulb x={800} y={260} T={T} on />
    <RMOtto x={280} y={830} s={0.58} mouth="flat" brow="up" lid={0.1} look={[0.8, 0]} />
    <RMArthur x={800} y={830} s={0.58} mouth="smile" brow="up" lid={0.15} look={[-0.8, 0]} />
    <QuizTable T={T} tick={1} />
    <RMChip x={t > c ? 540 : 540} y={120} text={t > c ? 'COMMENT: OTTO' : "DOUBT ISN'T DUMB"} pop={t > c ? (t - c) / 0.25 : t / 0.2} size={50} /></g>);
}

Object.assign(window, { RMQuizNight, RMRankLean, RMSnapJudge, RMScoreboard, RMRankProof, RMNameDK, RMEasyCrack, RMBeginner, RMEndDoubt });
})();
