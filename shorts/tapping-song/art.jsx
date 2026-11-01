// art.jsx — "He Tapped Happy Birthday. Nobody Got It" (Otto ep. 3, retro modern illustration). Curse of knowledge
// (Elizabeth Newton, Stanford, 1990). Full 1080×1920 frames with retro-kit.jsx; captions sit at y ≈ 1540.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });

// a desk top across the frame
function Desk({ y = 1300 }) {
  return (<g><rect x="-300" y={y} width="1680" height="900" fill={P.blk} />
    <rect x="-300" y={y} width="1680" height="38" fill={P.redD} stroke={P.blk} strokeWidth="6" />
    {[...Array(5)].map((_, k) => <path key={k} d={`M-100 ${y + 90 + k * 70} Q540 ${y + 60 + k * 70} 1180 ${y + 90 + k * 70}`} fill="none" stroke={P.pink} strokeOpacity="0.25" strokeWidth="3" />)}</g>);
}
// a fist knocking on the desk; hit 0..1 (1 = on the desk)
function Fist({ x, y, hit = 0, skin = P.cream, sleeve = P.blue, s = 1 }) {
  const yy = y - (1 - hit) * 90;
  return (<g transform={`translate(${x} ${yy}) scale(${s})`}>
    <path d="M60 -40 L320 -120 L340 -20 L90 50 Z" fill={sleeve} {...ink(6)} />
    <rect x="-90" y="-80" width="170" height="130" rx="40" fill={skin} {...ink(7)} />
    {[0, 1, 2].map((k) => <path key={k} d={`M${-70 + k * 45} -78 Q${-50 + k * 45} -50 ${-70 + k * 45} -20`} fill="none" {...ink(5)} />)}
    <path d="M-60 20 Q-10 40 40 20" fill="none" {...ink(5)} /></g>);
}
// knock flash where the fist lands
function Knock({ x, y, k }) {
  if (k <= 0 || k >= 1) return null;
  return (<g opacity={1 - k}>{[...Array(7)].map((_, i) => { const a = Math.PI * (1.05 + i * 0.15), r1 = 60 + k * 80;
    return <line key={i} x1={x + Math.cos(a) * r1} y1={y + Math.sin(a) * r1} x2={x + Math.cos(a) * (r1 + 50)} y2={y + Math.sin(a) * (r1 + 50)} stroke={P.yel} strokeWidth="9" strokeLinecap="round" />; })}</g>);
}
// a music note
function Note({ x, y, s = 1, col = P.yel, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <ellipse cx={-14} cy={30} rx={30} ry={22} transform="rotate(-20 -14 30)" fill={col} {...ink(5)} />
    <rect x={10} y={-80} width={10} height={112} fill={P.blk} /><path d="M18 -80 Q60 -60 50 -20 Q44 -50 18 -50 Z" fill={P.blk} /></g>);
}
// tap rhythm of "Happy Birthday" (s): hap-py birth-day to you
const TAPS = [0, 0.22, 0.45, 0.9, 1.35, 1.8, 2.4, 2.62, 2.85, 3.3, 3.75];
const tapK = (t, t0 = 0) => { let k = 0; for (const s of TAPS) { const d = t - t0 - s; if (d >= 0 && d < 0.18) k = 1 - d / 0.18; } return k; };
const lastTap = (t, t0 = 0) => { let l = -9; for (const s of TAPS) if (t - t0 >= s) l = t - t0 - s; return l; };

/* 1 — Otto, smug, knocking a song on his desk; notes pop out of each knock */
function RMTapHook({ T, t, beats }) {
  const hit = tapK(t, 0.3);
  return (<g><RMBg kind="red" />
    <RMOtto x={540} y={760} s={0.95} mouth={t > bt(beats, 3) ? 'smile' : 'flat'} brow="up" lid={0.45} look={[0.5, 0.8]} />
    <Desk y={1300} />
    <Fist x={700} y={1260} hit={hit} />
    <Knock x={650} y={1300} k={lastTap(t, 0.3) / 0.35} />
    {TAPS.map((s, i) => { const lt = t - 0.3 - s; if (lt < 0) return null; const k = EO(lt / 1.2);
      return <Note key={i} x={700 + (hsh(i + 3) * 0.8 + 0.1) * 260 * k} y={1230 - k * 520} s={0.9} rot={(hsh(i + 9) - 0.5) * 40} col={i % 2 ? P.yel : P.cream} />; })}
    <RMChip x={540} y={200} text="OTTO · THE BOSS" pop={t / 0.2} size={48} /></g>);
}

/* 2 — Lila, puzzled: the knocks arrive as dots and dashes */
function RMLilaGuess({ T, t, beats }) {
  const c = bt(beats, 2), code = '·  ·  —  ·  ·  —  ·  ·  —';
  const shown = Math.min(code.length, Math.floor(t * 9));
  return (<g><RMBg kind="redDark" />
    <RMLila x={540} y={880} s={0.95} mouth={t > c ? 'open' : 'flat'} brow={t > c ? 'up' : 'sad'} lid={0.2} look={[-0.7, -0.4]} />
    <g transform={`translate(540 ${300 + Math.sin(T * 3) * 6})`}><rect x="-430" y="-80" width="860" height="160" fill={P.blk} />
      <text x="0" y="30" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="96" letterSpacing="6" fill={P.yel}>{code.slice(0, shown)}</text></g>
    {t > c && <RMChip x={540} y={480} text="MORSE CODE?" col={P.cream} size={56} pop={(t - c) / 0.25} rot={0.03} />}
    {[0, 1, 2].map((k) => { const kk = ((t * 1.6 + k / 3) % 1); return <text key={k} x={140 + k * 60} y={1020 - kk * 200} fontFamily="'Bebas Neue', sans-serif" fontSize="70" fill={P.cream} opacity={1 - kk}>?</text>; })}</g>);
}

/* 3 — Otto explodes: "HAPPY BIRTHDAY!" */
function RMOttoMad({ T, t, beats }) {
  const c = bt(beats, 1) - 0.05, lt = t - c, sh = lt > 0 ? Math.sin(lt * 60) * 12 * Math.exp(-lt * 3) : 0;
  return (<g><RMBg kind="red" />
    <RMOtto x={540 + sh} y={980} s={1.05} mouth={lt > 0 ? 'shout' : 'open'} brow="angry" lid={0} wide stress />
    {lt > 0 && <RMSpeech x={560} y={330} text="HAPPY BIRTHDAY!" k={lt / 0.3} size={100} col={P.yel} />}
    {lt > 0.2 && [...Array(8)].map((_, i) => { const a = -Math.PI + 0.2 + i * Math.PI / 8.5; return <RMBolt key={i} x={540 + Math.cos(a) * 330} y={640 + Math.sin(a) * 230} len={120} ang={a} seed={i + 30} T={T} />; })}</g>);
}

/* 4 — inside Otto's head a whole band plays (notes swirl around his dome) → cut to Lila: one lonely knuckle "TOK" */
function RMHeadTune({ T, t, beats }) {
  const c = bt(beats, 3);
  if (t < c) {
    const k = EO(t / 0.5);
    return (<g><RMBg kind="blue" />
      <circle cx={540} cy={760} r={lp(200, 460, k)} fill={P.redD} {...ink(8)} />
      {[...Array(14)].map((_, i) => { const a = i / 14 * Math.PI * 2 + T * 0.9, r = 330 + Math.sin(T * 2 + i) * 30;
        return <Note key={i} x={540 + Math.cos(a) * r} y={760 + Math.sin(a) * r * 0.8} s={0.9 * k} rot={Math.sin(T * 4 + i) * 20} col={[P.yel, P.cream, P.pink][i % 3]} />; })}
      {/* drum + trumpet inside the bubble */}
      <g transform={`translate(540 ${800 + Math.sin(T * 8) * 6}) scale(${k})`}>
        <ellipse cx="-90" cy="40" rx="110" ry="40" fill={P.cream} {...ink(6)} /><path d="M-200 40 L-200 160 Q-90 200 20 160 L20 40" fill={P.yel} {...ink(6)} />
        {[...Array(5)].map((_, i) => <line key={i} x1={-190 + i * 50} y1="60" x2={-170 + i * 50} y2="170" stroke={P.blk} strokeWidth="5" />)}
        <path d="M60 -10 L190 -60 L200 40 L60 10 Z" fill={P.yel} {...ink(6)} /><rect x="40" y="-20" width="40" height="40" fill={P.yel} {...ink(5)} /></g>
      <RMOtto x={540} y={1180} s={0.55} mouth="smile" brow="up" lid={0.5} look={[0, -1]} />
      <RMChip x={540} y={180} text="INSIDE OTTO'S HEAD" col={P.cream} size={46} pop={t / 0.2} /></g>);
  }
  const lt = t - c, hit = lt > 0.35 && lt < 0.5 ? 1 - (lt - 0.35) / 0.15 : lt >= 0.5 ? 0 : SM(0, 0.35, lt);
  return (<g><RMBg kind="dark" /><RMBulb x={540} y={300} T={T} />
    <RMLila x={540} y={880} s={0.9} mouth="flat" brow="flat" lid={0.55} look={[0.4, 0.6]} />
    <Desk y={1300} /><Fist x={720} y={1260} hit={hit} />
    {lt > 0.35 && <text x={420} y={1220} fontFamily="'Bebas Neue', sans-serif" fontSize="110" fill={P.yel} opacity={1 - SM(0.6, 1.4, lt)}>TOK.</text>}
    <RMChip x={540} y={160} text="WHAT LILA HEARS" size={46} pop={lt / 0.2} /></g>);
}

/* 5 — the study: grid-paper lab sheet, a tapper and a listener back to back */
function RMStudyRoom({ T, t, beats }) {
  const hit = tapK(t, 0.6);
  return (<g><RMBg kind="blue" />
    <RMGrid x={90} y={420} w={900} h={900} />
    <RMChip x={540} y={240} text="STANFORD · 1990" pop={t / 0.25} size={50} />
    <RMHuman x={330} y={880} s={0.5} who={{ skin: P.pink, skinD: P.pinkD, hair: 'curly', hairCol: P.blk, moustache: false, lips: true, jacket: P.red }} mouth="smile" brow="up" lid={0.3} look={[-0.6, 0.6]} />
    <RMHuman x={750} y={880} s={0.5} who={{ skin: P.yel, skinD: '#D9A62A', hair: 'flat', hairCol: P.blk, moustache: false, jacket: P.green }} mouth="flat" brow="sad" lid={0.2} look={[-0.9, -0.2]} />
    <rect x="520" y="560" width="40" height="720" fill={P.blk} />
    <Fist x={380} y={1240} hit={hit} s={0.7} sleeve={P.red} skin={P.pink} />
    <rect x="90" y="1250" width="900" height="70" fill={P.blk} />
    <RMChip x={300} y={1180} text="TAPPER" col={P.cream} size={36} pop={(t - bt(beats, 2)) / 0.25} />
    <RMChip x={760} y={1180} text="LISTENER" col={P.cream} size={36} pop={(t - bt(beats, 2) - 0.15) / 0.25} /></g>);
}

// 120 dots (12 × 10) for the stat scenes; lit = how many glow
function Dots({ lit, y0 = 430 }) {
  return <g>{[...Array(120)].map((_, i) => { const x = 130 + (i % 12) * 75, y = y0 + Math.floor(i / 12) * 75, on = cl(lit - i);
    return <circle key={i} cx={x} cy={y} r={26} fill={on > 0.5 ? P.yel : P.redD} stroke={P.blk} strokeWidth="5" />; })}</g>;
}
/* 6 — tappers' guess: 60 of 120 light up → 50% */
function RMStatGuess({ T, t, beats }) {
  const lit = 60 * SM(bt(beats, 1), bt(beats, 2) + 0.4, t);
  return (<g><RMBg kind="red" /><RMChip x={540} y={240} text="TAPPERS' GUESS" pop={t / 0.25} size={48} />
    <Dots lit={lit} />
    <text x={540} y={1330} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="230" fill={P.blk}>{Math.round(lit / 1.2)}%</text>
    <text x={530} y={1320} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="230" fill={P.cream}>{Math.round(lit / 1.2)}%</text></g>);
}
/* 7 — reality: the lights drain to 3 of 120 */
function RMStatReal({ T, t, beats }) {
  const c = bt(beats, 3), lit = lp(60, 3, SM(c - 0.3, c + 0.3, t)), done = t > c + 0.3;
  return (<g><RMBg kind={done ? 'redDark' : 'red'} /><RMChip x={540} y={240} text={done ? 'LISTENERS GOT' : '120 SONGS TAPPED'} col={done ? P.cream : P.yel} pop={1} size={48} />
    <Dots lit={lit} />
    <text x={550} y={1350} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="240" fill={P.blk}>{done ? '3 / 120' : Math.round(lit / 1.2) + '%'}</text>
    <text x={540} y={1340} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="240" fill={done ? P.yel : P.cream}>{done ? '3 / 120' : Math.round(lit / 1.2) + '%'}</text>
    {done && <RMChip x={540} y={1470} text="2.5%" col={P.cream} size={60} pop={(t - c - 0.3) / 0.25} rot={0.04} />}</g>);
}

/* 8 — name it: the eye macro with Otto in the pupil */
function RMNameCurse({ T, t }) {
  return (<g><RMEyeMacro open={EO(t / 0.5)}><RMOtto x={540} y={1010} s={0.3} mouth="smile" brow="up" lid={0.4} /></RMEyeMacro>
    <RMTitle lines={[['THE CURSE', P.cream, 150], ['OF KNOWLEDGE', P.yel, 150]]} y={200} a={EO((t - 0.4) / 0.4)} /></g>);
}

/* 9 — you can't unhear it: the tune loops around Otto forever */
function RMCantUnhear({ T, t }) {
  return (<g><RMBg kind="red" waves={false} /><RMLoopRings T={t} text="HAPPY BIRTHDAY" cx={540} cy={860} />
    <RMOtto x={540} y={980} s={0.85} mouth="smile" brow="up" lid={0.5} look={[0, -0.6]} />
    {[...Array(6)].map((_, i) => { const a = i / 6 * Math.PI * 2 + T * 1.2; return <Note key={i} x={540 + Math.cos(a) * 300} y={650 + Math.sin(a) * 110} s={0.7} col={P.yel} />; })}</g>);
}

/* 10 — tomorrow: Otto at a chaotic whiteboard, Arthur sweating at his desk → PART 2 */
function RMTrainingCliff({ T, t, beats }) {
  const c = bt(beats, 2), end = bt(beats, 3) + 0.9, k = EO((t - end) / 0.35);
  if (t < c) return (<g><RMBg kind="blue" />
    <rect x="90" y="280" width="900" height="620" fill={P.cream} {...ink(10)} />
    {[...Array(9)].map((_, i) => <path key={i} d={`M${160 + hsh(i) * 600} ${350 + hsh(i + 20) * 460} L${200 + hsh(i + 40) * 700} ${340 + hsh(i + 60) * 480}`} stroke={[P.red, P.blue, P.blk][i % 3]} strokeWidth="9" strokeLinecap="round" />)}
    {['API', 'SYNC', 'Q3', '→→', 'OBVIOUSLY'].map((w, i) => <text key={i} x={180 + (i % 3) * 270} y={420 + Math.floor(i / 3) * 300 + (i % 2) * 90} fontFamily="'Bebas Neue', sans-serif" fontSize="80" fill={P.blk} transform={`rotate(${(hsh(i + 5) - 0.5) * 20} ${200 + i * 150} 500)`}>{w}</text>)}
    <RMOtto x={760} y={1260} s={0.6} mouth="open" brow="up" lid={0.4} look={[-0.8, -0.6]} />
    <RMChip x={540} y={170} text="TOMORROW · 9:00 AM" pop={t / 0.25} size={46} /></g>);
  return (<g><RMBg kind="redDark" />
    <RMArthur x={540} y={900} s={1.0} mouth="frown" brow="sad" lid={0} wide stress tear={t} look={[-0.6, -0.5]} />
    {t > end && <g><rect x="-300" y="-300" width="1680" height="2520" fill={P.blk} opacity={0.6 * k} />
      <RMTitle lines={[['PART 2', P.yel, 240], ["FOLLOW SO YOU DON'T MISS IT", P.cream, 70]]} y={800} a={k} /></g>}</g>);
}

Object.assign(window, { RMTapHook, RMLilaGuess, RMOttoMad, RMHeadTune, RMStudyRoom, RMStatGuess, RMStatReal, RMNameCurse, RMCantUnhear, RMTrainingCliff });
})();
