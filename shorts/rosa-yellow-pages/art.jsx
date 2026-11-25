// art.jsx — "5 Signs You're Studying the Way That Feels Good" (Rosa ep. 9, with Theo; ted-MG motion graphics, signs-list).
// Generation effect: Slamecka & Graf 1978 (JEP: Human Learning and Memory) — people read word pairs (RAPID – FAST) or
// generated the second word from a rule + first letter (RAPID – F_); across five experiments the generated words were
// remembered better. No invented numbers on screen. Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 —
// faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const PAPER = '#fbf7ee', HL = '#ffe45c', GOOD = '#5fbf7a', RTOP = '#a46fd1', RSKIN = '#f2dccb';

/* open textbook: lines of text, `hl` 0..1 = share of lines highlighted (animated sweep) */
function Book({ x, y, s = 1, hl = 0, rot = 0, cover = 0 }) {
  const rows = 9;
  const page = (sx) => (<g>
    <path d={`M${sx * 20} -250 Q${sx * 180} -280 ${sx * 340} -250 L${sx * 340} 250 Q${sx * 180} 220 ${sx * 20} 250 Z`} fill={PAPER} stroke={K} strokeWidth="9" strokeLinejoin="round" />
    {[...Array(rows)].map((_, i) => { const yy = -195 + i * 50, w = 260 - (hsh(i * 3 + (sx > 0 ? 9 : 1)) * 70), x0 = sx > 0 ? 50 : -50 - w;
      const k = cl(hl * rows * 2 - (sx > 0 ? rows : 0) - i);
      return (<g key={i}>{k > 0 && <rect x={sx > 0 ? x0 - 6 : x0 + w * (1 - k) - 6} y={yy - 20} width={w * k + 12} height={30} fill={HL} opacity="0.9" />}
        <rect x={x0} y={yy - 6} width={w} height={10} rx="5" fill="#b9b2a3" /></g>); })}</g>);
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-360 -260 L360 -260 L360 270 L-360 270 Z" fill="#5a3f8a" stroke={K} strokeWidth="9" />
    {page(-1)}{page(1)}<line x1="0" y1="-250" x2="0" y2="250" stroke={K} strokeWidth="7" />
    {cover > 0 && <rect x={-350} y={-270} width={700 * cover} height={540} fill="#cfd6dc" stroke={K} strokeWidth="9" />}</g>);
}
function Highlighter({ x, y, rot = -35, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-34" y="-190" width="68" height="250" rx="16" fill={HL} stroke={K} strokeWidth="8" />
    <rect x="-34" y="-190" width="68" height="70" rx="16" fill="#3a3640" stroke={K} strokeWidth="8" />
    <path d="M-34 60 L34 60 L18 110 L-18 110 Z" fill="#3a3640" stroke={K} strokeWidth="8" strokeLinejoin="round" /></g>);
}
function BigNo({ n, t }) {
  return (<g transform={`translate(170 260) scale(${BK(t / 0.3)})`}><circle r="110" fill={A} stroke={K} strokeWidth="9" />
    <text x="0" y="52" textAnchor="middle" fontFamily={BB} fontSize="170" fill={K}>{n}</text></g>);
}
/* word-pair card: left word, right word or blank with first letter */
function Pair({ x, y, a, bw, gen = false, k = 1, s = 1, col = PAPER }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${s * BK(k)})`}>
    <rect x="-300" y="-80" width="600" height="160" rx="22" fill={col} stroke={K} strokeWidth="8" />
    <text x="-150" y="26" textAnchor="middle" fontFamily={BB} fontSize="84" letterSpacing="4" fill={K}>{a}</text>
    <text x="0" y="22" textAnchor="middle" fontFamily={BB} fontSize="70" fill="#9a9384">–</text>
    <text x="150" y="26" textAnchor="middle" fontFamily={BB} fontSize="84" letterSpacing="4" fill={gen ? R : K}>{bw}</text></g>);
}

/* 1 — hook: Rosa at her desk, the whole book glowing yellow; EXAM FRIDAY */
function MGHighlight({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  return (<g><MGBg kind="room" />
    <Book x={540} y={560} s={0.85} hl={SM(0, c2 + 0.6, t)} rot={-3} />
    <Highlighter x={lp(400, 760, SM(0, c2 + 0.6, t))} y={lp(420, 640, SM(0, c2 + 0.6, t)) + osc(T, 0.3) * 6} s={0.7} />
    <MGBust x={540} y={1030} r={140} who="rosa" look={[0, -0.9]} brow={t > c2 ? 'up' : 'flat'} mouth={t > c2 ? 'grin' : 'smile'} bl={BL(T)} />
    <MGChip x={540} y={130} text="EXAM · FRIDAY" size={42} pop={t / 0.25} /></g>);
}
/* 2 — to the viewer: "5 SIGNS" title over a stack of yellow books */
function MGFiveStudy({ T, t, beats }) {
  return (<g><MGBg kind="navy" />
    <MGTitle lines={[['5 SIGNS', A, 200], ['YOU STUDY LIKE ROSA', '#fff', 80]]} y={300} a={EO(t / 0.35)} />
    {[0, 1, 2, 3, 4].map((i) => { const k = BK((t - 0.2 - i * 0.12) / 0.3);
      return <g key={i} transform={`translate(540 ${1240 - i * 90}) scale(${k}) rotate(${(hsh(i) - 0.5) * 8})`}><rect x="-260" y="-40" width="520" height="80" rx="10" fill={[HL, R, HL, '#6a7bd1', HL][i]} stroke={K} strokeWidth="8" />
        <rect x="-240" y="-26" width="440" height="52" fill={PAPER} opacity="0.35" /></g>; })}
    <MGPerson x={860} y={1300} s={2.2} who="rosa" look={[-1, -0.3]} brow="up" mouth="smile" bl={BL(T)} /></g>);
}
/* 3 — snapback: a "READY" gauge full, a "REMEMBERED" gauge nearly empty */
function MGFeelsReady({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9);
  const bar = (y, lab, v, col) => (<g><text x="150" y={y - 40} fontFamily={BB} fontSize="80" letterSpacing="4" fill="#fff">{lab}</text>
    <rect x="150" y={y} width="780" height="90" rx="45" fill="#2a2f45" stroke={K} strokeWidth="8" />
    <rect x="156" y={y + 6} width={768 * v} height="78" rx="39" fill={col} /></g>);
  return (<g><MGBg kind="navy" />
    {bar(520, 'FEELS READY', SM(0, 0.6, t), GOOD)}
    {t > c2 - 0.3 && bar(860, 'REMEMBERED', 0.12 * SM(c2 - 0.3, c2 + 0.3, t), R)}
    {t > c2 && <MGRing cx={330} cy={905} rx={210} ry={110} p={(t - c2) / 0.4} />}
    <MGBust x={540} y={1180} r={70} who="rosa" look={[0, -1]} brow="worried" mouth="o" bl={BL(T)} /></g>);
}
/* 4 — sign 1: a page that is half yellow */
function MGSignYellow({ T, t, beats }) {
  return (<g><MGBg kind="wall" c1="#4a3f63" c2="#2a2238" />
    <BigNo n="1" t={t} />
    <Book x={540} y={830} s={1.15} hl={0.2 + 0.6 * SM(0.2, 1.4, t)} />
    {t > b(beats, 2, 1) && <MGChip x={540} y={1240} text="HIGHLIGHTED ≠ LEARNED" size={40} pop={(t - b(beats, 2, 1)) / 0.25} />}</g>);
}
/* 5 — sign 2: re-reading the same page; a "SEEN IT" eye nods along */
function MGSignReread({ T, t, beats }) {
  const n = Math.max(1, Math.min(4, Math.floor(t / 0.5) + 1));
  return (<g><MGBg kind="roomNight" />
    <BigNo n="2" t={t} />
    {[...Array(n)].map((_, i) => <g key={i} transform={`translate(${i * 18} ${i * 18})`}><rect x="250" y="440" width="560" height="680" rx="16" fill={PAPER} stroke={K} strokeWidth="8" />
      {[...Array(8)].map((_, j) => <rect key={j} x="300" y={520 + j * 70} width={400 - hsh(j) * 120} height="12" rx="6" fill="#b9b2a3" />)}</g>)}
    <MGChip x={760} y={430} text={`READ x${n}`} size={40} pop={1} />
    <MGBust x={250} y={1110} r={95} who="rosa" look={[1, -0.6]} brow="up" mouth="smile" bl={BL(T)} />
    {t > b(beats, 2, 1.2) && <MGBubble x={330} y={880} text="YEP, KNOW|THIS ONE" k={(t - b(beats, 2, 1.2)) / 0.3} size={40} />}</g>);
}
/* 6 — sign 3: peeking at the answer key */
function MGSignPeek({ T, t, beats }) {
  const peek = SM(0.4, 1.2, t);
  return (<g><MGBg kind="wall" c1="#2f3d5c" c2="#1a2238" />
    <BigNo n="3" t={t} />
    <rect x="200" y="520" width="680" height="680" rx="18" fill={PAPER} stroke={K} strokeWidth="9" />
    <text x="540" y="640" textAnchor="middle" fontFamily={BB} fontSize="80" fill={K}>Q4. WHAT IS…?</text>
    <rect x="270" y="700" width="540" height="10" rx="5" fill="#b9b2a3" /><rect x="270" y="760" width="420" height="10" rx="5" fill="#b9b2a3" />
    <g transform={`translate(0 ${lp(0, 220, peek)})`}><rect x="200" y="820" width="680" height="380" rx="18" fill="#cfd6dc" stroke={K} strokeWidth="9" />
      <text x="540" y="930" textAnchor="middle" fontFamily={BB} fontSize="60" fill="#6b7280">ANSWERS</text></g>
    <text x="540" y="1000" textAnchor="middle" fontFamily={BB} fontSize="90" fill={GOOD} opacity={peek}>B) OBVIOUSLY</text>
    <MGHead x={880} y={1160} r={90} who="rosa" look={[-1, -0.4]} brow="up" mouth="o" bl={BL(T)} />
    {t > b(beats, 2, 1) && <MGArrows x={540} y={1000} t={t - b(beats, 2, 1)} n={4} from={420} to={230} />}</g>);
}
/* 7 — sign 4: copying notes word for word, two identical pages */
function MGSignCopy({ T, t, beats }) {
  const k = SM(0.2, 1.8, t);
  const sheet = (x, frac) => (<g><rect x={x - 220} y="500" width="440" height="620" rx="14" fill={PAPER} stroke={K} strokeWidth="8" />
    {[...Array(8)].map((_, j) => { const w = 340 - hsh(j + 5) * 120, f = cl(frac * 8 - j); return f > 0 ? <rect key={j} x={x - 180} y={560 + j * 66} width={w * f} height="12" rx="6" fill="#6a7bd1" /> : null; })}</g>);
  return (<g><MGBg kind="room" />
    <BigNo n="4" t={t} />
    {sheet(300, 1)}{sheet(780, k)}
    <text x="540" y="840" textAnchor="middle" fontFamily={BB} fontSize="110" fill={A}>=</text>
    <MGChip x={540} y={1230} text="COPY · PASTE · BRAIN OFF" size={38} pop={(t - b(beats, 2, 1)) / 0.25} /></g>);
}
/* 8 — sign 5: the video that made sense; then the blank test */
function MGSignVideo({ T, t, beats }) {
  const c2 = b(beats, 2, 1.4), test = SM(c2 - 0.1, c2 + 0.3, t);
  return (<g><MGBg kind="roomNight" />
    <BigNo n="5" t={t} />
    <g opacity={1 - 0.75 * test}><rect x="180" y="460" width="720" height="440" rx="26" fill="#18161d" stroke={K} strokeWidth="10" />
      <rect x="210" y="490" width="660" height="370" rx="14" fill="#2a1c45" />
      <path d="M500 610 L500 740 L610 675 Z" fill="#fff" />
      <text x="540" y="560" textAnchor="middle" fontFamily={BB} fontSize="50" fill={A}>EASY EXPLAINED · 2X SPEED</text></g>
    <MGHead x={300} y={1080} r={90} who="rosa" look={[test > 0.5 ? 1 : 0.6, -0.8]} brow={test > 0.5 ? 'worried' : 'up'} mouth={test > 0.5 ? 'wave' : 'smile'} sweat={test > 0.5 ? (T * 0.8) % 1 : null} bl={BL(T)} />
    {test > 0 && <g transform={`translate(720 1040) scale(${BK(test)}) rotate(4)`}><rect x="-200" y="-200" width="400" height="330" rx="14" fill={PAPER} stroke={K} strokeWidth="8" />
      <text x="0" y="-120" textAnchor="middle" fontFamily={BB} fontSize="70" fill={R}>TEST</text>
      {[0, 1, 2].map((j) => <rect key={j} x="-150" y={-60 + j * 60} width="300" height="8" rx="4" fill="#b9b2a3" />)}</g>}</g>);
}
/* 9 — the study: READ (rapid – fast) vs FILL IN (rapid – f_) */
function MGStudy1978({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={170} text="MEMORY STUDY · 1978" size={40} pop={t / 0.25} />
    <text x="540" y="380" textAnchor="middle" fontFamily={BB} fontSize="80" letterSpacing="6" fill="#fff">READ</text>
    <Pair x={540} y={520} a="RAPID" bw="FAST" k={(t - 0.3) / 0.3} />
    <g opacity={t > c3 - 0.2 ? 1 : 0.3}><text x="540" y="790" textAnchor="middle" fontFamily={BB} fontSize="80" letterSpacing="6" fill={A}>FILL IN</text>
      <Pair x={540} y={930} a="RAPID" bw={t > c3 + 0.8 ? 'FAST' : 'F _ _ _'} gen k={(t - c3 + 0.2) / 0.3} col="#fff3c4" /></g>
    <MGBust x={880} y={1160} r={70} who="theo" look={[-1, -0.6]} brow="up" mouth="smile" bl={BL(T, 0.4)} /></g>);
}
/* 10 — result: memory test, the filled-in words light up */
function MGStuck({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0), k = SM(c2 - 0.2, c2 + 0.3, t);
  const words = [['FAST', 1], ['HOT', 0], ['DOG', 1], ['SEA', 0], ['UP', 1], ['TALL', 0]];
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={170} text="LATER: MEMORY TEST" size={40} pop={t / 0.25} />
    {words.map(([w, g], i) => { const x = 300 + (i % 2) * 480, y = 450 + Math.floor(i / 2) * 260, on = g ? k : 0;
      return (<g key={i}><rect x={x - 200} y={y - 90} width="400" height="180" rx="22" fill={on > 0.5 ? A : '#2a2f45'} stroke={K} strokeWidth="8" opacity={g ? 1 : 1 - 0.4 * k} />
        <text x={x} y={y + 30} textAnchor="middle" fontFamily={BB} fontSize="96" fill={on > 0.5 ? K : '#8a8fa0'}>{w}</text>
        <text x={x} y={y + 76} textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="24" fill={on > 0.5 ? K : '#8a8fa0'}>{g ? 'FILLED IN' : 'READ'}</text></g>); })}
    {t > c2 && <MGChip x={540} y={1250} text="FILLED IN = REMEMBERED BETTER" size={36} col={GOOD} txt="#fff" pop={(t - c2) / 0.25} />}</g>);
}
/* 11 — name it: GENERATION EFFECT; a blank being filled in */
function MGGenEffect({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="wall" c1="#5a3f8a" c2="#2a1b38" />
    <MGTitle lines={[['GENERATION', '#fff', 150], ['EFFECT', A, 150]]} y={330} a={EO(t / 0.35)} />
    <Pair x={540} y={820} a="RAPID" bw={t > c3 ? 'FAST' : 'F _ _ _'} gen k={(t - 0.4) / 0.3} col="#fff3c4" s={1.1} />
    {t > c3 && <g transform={`translate(860 700) scale(${BK((t - c3) / 0.3)})`}><circle r="60" fill={GOOD} stroke={K} strokeWidth="7" />
      <path d="M-28 2 L-6 24 L30 -20" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
    <MGChip x={540} y={1180} text="THE EFFORT IS THE POINT" size={40} pop={(t - c3 + 0.2) / 0.25} /></g>);
}
/* 12 — payoff: Theo covers the notes; Rosa answers from memory */
function MGTheoCover({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c3 = b(beats, 3, 1.8);
  return (<g><MGBg kind="room" />
    <rect x="300" y="1290" width="480" height="40" rx="10" fill="#b98e62" stroke={K} strokeWidth="7" />
    <Book x={540} y={1150} s={0.5} hl={1} cover={SM(0.1, c1 + 0.3, t)} />
    <MGPerson x={190} y={1320} s={2.6} who="theo" look={[1, -0.3]} brow="up" mouth="smile" bl={BL(T, 0.4)} />
    <MGPerson x={880} y={1320} s={2.6} who="rosa" look={[-0.8, -0.2]} brow={t > c3 ? 'up' : 'worried'} mouth={t > c3 ? 'grin' : 'flat'} bl={BL(T)} />
    <MGBubble x={300} y={640} text={"NOW|TELL ME."} k={(t - b(beats, 2, 1.2) + 0.1) / 0.3} size={46} />
    {t > c3 && <MGChip x={540} y={170} text="REMEMBERED ✓" size={42} col={GOOD} txt="#fff" pop={(t - c3) / 0.25} />}</g>);
}
/* 13 — end: the five-sign checklist + the yellow textbook */
function MGEndStudy({ T, t, beats }) {
  const signs = ['HALF THE PAGE YELLOW', 'RE-READ = FAMILIAR', 'PEEK AT THE ANSWER', 'COPY WORD FOR WORD', 'VIDEO MADE SENSE'];
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <MGChip x={540} y={170} text="HOW MANY DID YOU CHECK?" size={40} pop={t / 0.25} />
    {signs.map((s, i) => { const at = 0.4 + i * 0.3, k = SM(at, at + 0.2, t);
      return (<g key={i}><rect x="140" y={330 + i * 140} width="80" height="80" rx="12" fill={PAPER} stroke={K} strokeWidth="7" />
        {k > 0 && <path d={`M156 ${372 + i * 140} l22 24 l38 -50`} fill="none" stroke={GOOD} strokeWidth="13" strokeLinecap="round" opacity={k} />}
        <text x={250} y={392 + i * 140} fontFamily={BB} fontSize="68" letterSpacing="2" fill="#fff">{s}</text></g>); })}
    <Book x={540} y={1150} s={0.42} hl={1} rot={-4} />
    <MGHead x={880} y={1160} r={70} who="rosa" look={[-0.8, -0.4]} brow="up" mouth="grin" bl={BL(T)} /></g>);
}

Object.assign(window, { MGHighlight, MGFiveStudy, MGFeelsReady, MGSignYellow, MGSignReread, MGSignPeek, MGSignCopy, MGSignVideo, MGStudy1978, MGStuck, MGGenEffect, MGTheoCover, MGEndStudy });
})();
