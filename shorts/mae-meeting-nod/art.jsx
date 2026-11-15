// art.jsx — "Why Nobody Asks the Question in Meetings" (Mae ep. 9, with Otto + Lila; retro modern illustration).
// Pluralistic ignorance: Prentice & Miller 1993 (JPSP) — Princeton students believed they were more uncomfortable with campus
// drinking than the average student. No numbers on screen. Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540,
// faces stay above y 1400.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";
const nod = (T, ph = 0, amp = 18) => Math.max(0, Math.sin(T * 5 + ph)) * amp;

/* whiteboard full of jargon arrows */
function Board({ x, y, s = 1, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-230} width={840} height={460} fill={P.cream} {...ink(9)} />
    <text x={-380} y={-160} fontFamily={BEB} fontSize="62" letterSpacing="3" fill={P.blue}>Q3 SYNERGY PIVOT</text>
    {[[-330, -40, 'KPI'], [-80, 20, 'ROI²'], [170, -60, 'LEVERAGE'], [-250, 140, 'ALIGN'], [120, 130, 'DELTA-X']].map(([a, b, w], i) => (<g key={i}>
      <rect x={a - 20} y={b - 46} width={w.length * 26 + 40} height={64} fill="none" {...ink(5)} /><text x={a} y={b} fontFamily={BEB} fontSize="48" fill={P.red}>{w}</text></g>))}
    <path d="M-200 -20 L-110 0 M60 0 L150 -30 M-150 100 L-60 50 M230 -10 L200 80" fill="none" stroke={P.blk} strokeWidth="6" markerEnd="" />
    <circle cx={330 + Math.sin(T * 3) * 8} cy={150} r={30} fill="none" stroke={P.red} strokeWidth="7" /></g>);
}
function QMark({ x, y, k = 1, s = 1, col = P.yel }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(cl(k)) * s})`}><circle r={48} fill={col} {...ink(6)} />
    <text y={24} textAnchor="middle" fontFamily={BEB} fontSize="80" fill={P.blk}>?</text></g>);
}

/* 1 — the meeting: Otto points at a jargon whiteboard; Mae (foreground) nods, a tiny "???" over her head */
function RMMeetingNod({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.5);
  return (<g><RMBg kind="red" />
    <Board x={540} y={420} s={1.0} T={T} />
    <RMOtto x={880} y={620} s={0.34} mouth="open" brow="up" lid={0.2} look={[-1, -0.4]} body={false} />
    <RMChip x={210} y={110} text="MONDAY 9:00" col={P.cream} size={44} pop={t / 0.25} />
    <RMMae x={460} y={1000 + nod(T)} s={0.56} mouth="smile" brow={t > c3 ? 'sad' : 'up'} lid={0.2} look={[0.6, -0.6]} />
    {t > c3 && [0, 1, 2].map((i) => <QMark key={i} x={300 + i * 110} y={560 - (i % 2) * 40} s={0.8} k={(t - c3 - i * 0.12) / 0.3} />)}</g>);
}

/* 2 — you too: Mae close-up; "MAKES SENSE!" bubble while question marks orbit her head */
function RMNodLost({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.3);
  return (<g><RMBg kind="redDark" />
    <RMMae x={540} y={860 + nod(T, 0, 22)} s={0.95} mouth="smile" brow="up" lid={0.15} look={[osc(T, 1.1), -0.3]} body />
    <RMSpeech x={720} y={240} text="MAKES SENSE!" size={74} k={(t - 0.2) / 0.3} col={P.yel} rot={0.05} />
    {t > c3 && [...Array(6)].map((_, i) => { const a = T * 1.6 + i * 1.05; return <QMark key={i} x={540 + Math.cos(a) * 420} y={700 + Math.sin(a) * 200} s={0.75} k={(t - c3 - i * 0.07) / 0.3} />; })}</g>);
}

/* 3 — snapback: wide shot, the whole row nods in sync; every head gets the same hidden "?" */
function RMRowOfNods({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1);
  const row = [['lila', 160], ['arthur', 420], ['mae', 680], [null, 930]];
  return (<g><RMBg kind="blue" />
    <rect x={-20} y={1180} width={1120} height={70} fill={P.blk} />
    {row.map(([w, x], i) => w ? <RMHuman key={i} who={w} x={x} y={860 + nod(T, 0, 16)} s={0.38} mouth="smile" brow="up" lid={0.2} look={[0, -0.5]} />
      : <g key={i}><RMHuman who={{ name: 'Guy', kind: 'human', skin: P.cream, skinD: '#D9C2A0', hair: 'curly', hairCol: P.blk, moustache: false, jacket: P.yel }} x={x} y={860 + nod(T, 0, 16)} s={0.38} mouth="smile" brow="up" lid={0.2} look={[0, -0.5]} /></g>)}
    {row.map(([, x], i) => <QMark key={'q' + i} x={x} y={640 + nod(T, 0, 16)} s={0.8} k={(t - c2 - i * 0.1) / 0.3} />)}
    <RMChip x={540} y={240} text="ALL NODDING" col={P.cream} size={56} pop={t / 0.25} />
    {t > c2 && <RMChip x={540} y={1330} text="ALL LOST?" col={P.yel} size={60} pop={(t - c2) / 0.25} rot={0.03} />}</g>);
}

/* 4 — the study: PRINCETON · 1993; a survey card on grid paper, red party cups */
function RMPrincetonSurvey({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  const Cup = ({ x, y, r = 0 }) => (<g transform={`translate(${x} ${y}) rotate(${r})`}><path d="M-55 -80 L55 -80 L40 80 L-40 80 Z" fill={P.red} {...ink(6)} /><rect x={-58} y={-90} width={116} height={20} fill={P.cream} {...ink(5)} /></g>);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={170} text="PRINCETON · 1993" col={P.cream} size={50} pop={t / 0.25} />
    <RMGrid x={140} y={330} w={800} h={760} />
    <text x={540} y={450} textAnchor="middle" fontFamily={BEB} fontSize="58" letterSpacing="3" fill={P.blk}>HOW COMFORTABLE ARE YOU</text>
    <text x={540} y={520} textAnchor="middle" fontFamily={BEB} fontSize="58" letterSpacing="3" fill={P.blk}>WITH CAMPUS DRINKING?</text>
    <line x1={220} y1={700} x2={860} y2={700} {...ink(10)} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={220 + i * 106.7} y1={680} x2={220 + i * 106.7} y2={720} {...ink(6)} />)}
    <text x={220} y={790} textAnchor="middle" fontFamily={BEB} fontSize="40" fill={P.redD}>NOT AT ALL</text><text x={860} y={790} textAnchor="middle" fontFamily={BEB} fontSize="40" fill={P.redD}>VERY</text>
    <circle cx={lp(860, 430, EO((t - 0.5) / 1.0))} cy={700} r={30} fill={P.yel} {...ink(6)} />
    {t > c3 && <g><Cup x={250} y={1250} r={-10} /><Cup x={840} y={1240} r={12} /><Cup x={540} y={1270} /></g>}</g>);
}

/* 5 — result: two dials — "ME" sits low, "EVERYONE ELSE" (as they imagined it) sits high */
function RMMeVsThem({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), c3 = bt(beats, 3, 1.5);
  const Gauge = ({ x, y, v, label, col }) => (<g transform={`translate(${x} ${y})`}>
    <path d="M-200 0 A200 200 0 0 1 200 0" fill="none" stroke={P.cream} strokeWidth="46" />
    <path d="M-200 0 A200 200 0 0 1 200 0" fill="none" {...ink(6)} />
    <g transform={`rotate(${-90 + v * 180})`}><path d="M-12 0 L0 -180 L12 0 Z" fill={P.blk} /></g><circle r={24} fill={col} {...ink(6)} />
    <text y={90} textAnchor="middle" fontFamily={BEB} fontSize="58" letterSpacing="4" fill={P.cream}>{label}</text></g>);
  return (<g><RMBg kind="red" />
    <Gauge x={540} y={520} v={lp(0.5, 0.82, EO((t - c3) / 0.6))} label="EVERYONE ELSE (THEY GUESSED)" col={P.yel} />
    <Gauge x={540} y={1060} v={lp(0.5, 0.25, EO((t - c1) / 0.6))} label="ME" col={P.pink} />
    <RMChip x={840} y={1260} text="COMFORT" col={P.cream} size={40} pop={t / 0.25} rot={0.04} /></g>);
}

/* 6 — name: three smiling faces; behind every one hides the same Doubt */
function RMSameDoubt({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.9);
  const xs = [220, 540, 860];
  return (<g><RMBg kind="blue" />
    {xs.map((x, i) => <RMDoubt key={'d' + i} x={x + 120 * SM(0.2 + i * 0.1, 0.6 + i * 0.1, t)} y={800} s={0.36} T={T + i} mood="worried" look={[-1, 0]} />)}
    {xs.map((x, i) => <RMHuman key={i} who={['lila', 'mae', 'otto'][i]} x={x} y={880} s={0.36} mouth="smile" brow="up" lid={0.2} look={[0, 0]} />)}
    {t > c1 && <RMTitle lines={[['PLURALISTIC', P.cream, 120], ['IGNORANCE', P.yel, 130]]} y={300} a={SM(c1, c1 + 0.3, t)} />}
    <RMChip x={540} y={1300} text="SAME DOUBT" col={P.yel} size={52} pop={(t - 0.4) / 0.25} /></g>);
}

/* 7 — self-proof: a question balloon tied to Mae's chair, never let go */
function RMUnasked({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.2);
  const sw = Math.sin(T * 1.5) * 18;
  return (<g><RMBg kind="redDark" />
    <path d={`M${560 + sw} 540 Q${600} 800 ${560} 1050`} fill="none" stroke={P.blk} strokeWidth="5" />
    <g transform={`translate(${560 + sw} 400) scale(${1 + 0.06 * SM(c3, c3 + 0.3, t)})`}><ellipse rx={170} ry={200} fill={P.yel} {...ink(8)} />
      <text y={70} textAnchor="middle" fontFamily={BEB} fontSize="260" fill={P.blk}>?</text><path d="M-20 196 L20 196 L0 225 Z" fill={P.yel} {...ink(5)} /></g>
    <RMMae x={540} y={1000} s={0.5} mouth="flat" brow="sad" lid={0.35} look={[0.2, -1]} />
    <RMChip x={210} y={180} text="LAST WEEK" col={P.cream} size={46} pop={t / 0.25} rot={-0.03} /></g>);
}

/* 8 — payoff: Mae's hand shoots up; Lila beside her mouths THANK YOU, Otto blinks */
function RMMaeAsks({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6), c2 = bt(beats, 2, 1.2);
  const arm = EO((t - 0.05) / 0.35);
  return (<g><RMBg kind="blue" />
    <Board x={540} y={260} s={0.7} T={T} />
    <g transform={`translate(${470} ${lp(1000, 560, arm)})`}><rect x={-34} y={0} width={68} height={460} fill={P.green} {...ink(6)} /><ellipse cx={0} cy={-20} rx={52} ry={64} fill={P.yel} {...ink(6)} /></g>
    <RMMae x={330} y={980} s={0.44} mouth="open" brow="up" lid={0} wide look={[0.4, -1]} />
    <RMLila x={780} y={1000 + nod(T, 1, 10)} s={0.42} mouth={t > c1 ? 'smile' : 'flat'} brow="up" lid={0.1} look={[-1, 0]} />
    <RMChip x={330} y={620} text="WAIT, WHAT'S ROI²?" col={P.cream} size={40} pop={(t - 0.3) / 0.25} rot={-0.03} />
    {t > c2 && <RMSpeech x={790} y={560} text="THANK YOU" size={72} k={(t - c2) / 0.3} col={P.yel} rot={0.05} />}</g>);
}

/* 9 — end: dark room, one raised hand under a bulb; question + send chips */
function RMEndAsk({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6), c3 = bt(beats, 3, 1.8);
  return (<g><RMBg kind="dark" /><RMBulb x={540} y={300} T={T} />
    <g transform={`translate(540 ${lp(1400, 700, EO(t / 0.4))}) rotate(${Math.sin(T * 2) * 3})`}><rect x={-60} y={120} width={120} height={700} fill={P.green} {...ink(7)} />
      <path d="M-80 120 L-90 -40 Q-90 -80 -60 -80 L-50 0 L-40 -150 Q-30 -180 0 -170 L5 -10 L20 -170 Q40 -190 60 -160 L55 0 L75 -120 Q100 -140 110 -100 L95 120 Z" fill={P.yel} {...ink(7)} /></g>
    <RMChip x={540} y={540} text="ASK IT." col={P.yel} size={64} pop={t / 0.25} />
    {t > c1 && <RMChip x={540} y={1330} text="EVER NODDED WHILE LOST?" col={P.pink} size={42} pop={(t - c1) / 0.25} rot={0.02} />}
    {t > c3 && <RMChip x={820} y={180} text="SEND IT" col={P.cream} size={44} pop={(t - c3) / 0.25} rot={-0.05} />}</g>);
}

Object.assign(window, { RMMeetingNod, RMNodLost, RMRowOfNods, RMPrincetonSurvey, RMMeVsThem, RMSameDoubt, RMUnasked, RMMaeAsks, RMEndAsk });
})();
