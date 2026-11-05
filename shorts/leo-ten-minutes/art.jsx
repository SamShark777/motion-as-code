// art.jsx — "Why 'It'll Take 10 Minutes' Never Does" (Ted type 2, Leo + Grace). 972×1728 card; captions sit in the top
// third, so subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene). People via <T2Bust>.
// Planning fallacy: Buehler, Griffin & Ross 1994 (thesis guessed 33.9 days, took 55.5; worst case 48.6).
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', NAVY = '#1F3B73', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';
const bt = (beats, i, fb) => (beats && beats[i] != null ? beats[i] : fb);

function Chip({ x, y, text, k = 1, fill = YEL, col = INK, size = 34, w, rot = 0 }) {
  if (k <= 0) return null;
  const W = w || text.length * size * 0.72 + 60;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}><rect x={-W / 2} y="-34" width={W} height="68" rx="34" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={col}>{text}</text></g>);
}
/* wall clock showing h:m (hour hand from h + m/60) */
function Clock({ x, y, r = 90, h = 7, m = 0 }) {
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  return (<g transform={`translate(${x} ${y})`}><circle r={r + 16} fill={INK} /><circle r={r} fill={CREAM} />
    {[...Array(12)].map((_, i) => <rect key={i} x="-4" y={-r + 8} width="8" height={i % 3 ? 10 : 18} rx="3" fill={INK} transform={`rotate(${i * 30})`} />)}
    <line x1="0" y1="0" x2="0" y2={-r * 0.5} stroke={INK} strokeWidth="12" strokeLinecap="round" transform={`rotate(${ha})`} />
    <line x1="0" y1="0" x2="0" y2={-r * 0.78} stroke={RED} strokeWidth="7" strokeLinecap="round" transform={`rotate(${ma})`} />
    <circle r="9" fill={INK} /></g>);
}
/* laptop seen from the front, screen at (x,y) */
function Laptop({ x, y, w = 420, h = 270, lines = 1, title = 'ESSAY.doc', glow = 0 }) {
  return (<g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 - 18} y={-h / 2 - 18} width={w + 36} height={h + 36} rx="22" fill={INK} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="8" fill="#F7F4EC" />
    <rect x={-w / 2} y={-h / 2} width={w} height="46" fill="#DDD6C8" />
    <text x={-w / 2 + 20} y={-h / 2 + 32} fontFamily={BOLD} fontWeight="800" fontSize="24" fill={INK}>{title}</text>
    {[...Array(5)].map((_, i) => i < lines && <rect key={i} x={-w / 2 + 24} y={-h / 2 + 70 + i * 36} width={[340, 300, 360, 220, 310][i]} height="14" rx="7" fill="#C9C0AE" />)}
    <path d={`M${-w / 2 - 70} ${h / 2 + 18} L${w / 2 + 70} ${h / 2 + 18} L${w / 2 + 40} ${h / 2 + 60} L${-w / 2 - 40} ${h / 2 + 60} Z`} fill="#3A3F4B" />
    {glow > 0 && <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#fff" opacity={glow} />}</g>);
}
function Sticky({ x, y, text, k = 1, rot = -6, size = 50, fill = YEL }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}><rect x="-110" y="-100" width="220" height="200" fill={fill} />
    <path d="M60 100 L110 50 L110 100 Z" fill="#C9A63A" />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={INK}>{text}</text></g>);
}

/* 1 — 7 PM: Leo grins at his laptop; a "10 MIN" sticky slaps on the screen */
function LTHook({ T, t, dur, beats }) {
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#2C4F92" />
    <Clock x={200} y={760} r={86} h={7} m={0} />
    <Chip x={200} y={900} text="7:00 PM" k={pop(t, bt(beats, 3, 2))} fill={CREAM} size={28} />
    <Laptop x={600} y={900} w={400} h={260} lines={0} />
    <Sticky x={720} y={760} text="10 MIN" k={pop(t, 0.2)} rot={8} size={48} />
    <T2Bust who="leo" x={486} y={1400} s={0.62} T={T} mood="happy" look={8} />
  </g>);
}

/* 2 — midnight: same desk, the clock at 12, crumpled pages, Leo slumps; a finger points back at him */
function LTMidnight({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), bY = bt(beats, 4, D * 0.75);
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#2A2F45" />
    <circle cx="790" cy="740" r="60" fill={CREAM} /><circle cx="815" cy="725" r="54" fill="#2A2F45" />
    <Clock x={200} y={760} r={86} h={11} m={59} />
    <Chip x={200} y={900} text="11:59 PM" k={pop(t, 0.2)} fill={RED} col="#fff" size={28} />
    <Laptop x={560} y={930} w={380} h={240} lines={1} glow={0.05 + 0.03 * osc(T, 0.3)} />
    {[[180, 1180], [790, 1210], [700, 1150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={34 + i * 6} fill="#fff" opacity="0.9" />)}
    <T2Bust who="leo" x={486} y={1420} s={0.6} T={T} mood={t > bY ? 'sad' : 'shocked'} look={0} />
  </g>);
}

/* 3 — snapback: punch in on the whole cast, each with a "10 MIN" bubble — everyone guesses wrong */
function LTSnap({ T, t, dur, beats }) {
  const D = Math.max(2.5, dur || 4), z = 1 + 0.16 * tw(t, 0, 0.6), bE = bt(beats, 2, D * 0.5);
  const cast = [['sam', 170, 1150], ['priya', 486, 1080], ['omar', 800, 1150], ['grace', 300, 1450], ['leo', 670, 1450]];
  return (<g transform={`translate(486 1200) scale(${z}) translate(-486 -1200)`}>
    <circle cx="486" cy="1260" r="420" fill="#C9A63A" />
    {cast.map(([w, x, y], i) => <g key={w}>
      <T2Bust who={w} x={x} y={y} s={0.36} T={T} mood={t > bE ? 'shocked' : 'happy'} ph={i * 0.4} disc={false} />
      <Chip x={x} y={y - 140} text="10 MIN" k={pop(t, 0.1 + i * 0.12)} size={26} fill="#fff" rot={osc(T, 1, i * 0.2) * 4} /></g>)}
  </g>);
}

/* 4 — the study: a calendar fills 34 days, labelled GUESS; 1994 chip */
function LTStudy({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5.5), n = Math.floor(34 * tw(t, 0.4, D * 0.65));
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#1F5560" />
    <Chip x={486} y={640} text="1994 · THESIS STUDENTS" k={pop(t, 0.1)} size={30} />
    <rect x="130" y="720" width="712" height="640" rx="26" fill={CREAM} />
    <rect x="130" y="720" width="712" height="90" rx="26" fill={RED} /><rect x="130" y="780" width="712" height="30" fill={RED} />
    <text x="486" y="782" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="42" fill="#fff">MY GUESS</text>
    {[...Array(56)].map((_, i) => { const x = 160 + (i % 7) * 96, y = 840 + Math.floor(i / 7) * 62;
      return <rect key={i} x={x} y={y} width="84" height="50" rx="8" fill={i < n ? TEAL : '#fff'} opacity={i < 34 ? 1 : 0.35} />; })}
    <Chip x={486} y={1430} text={`${n} DAYS`} k={pop(t, 0.4)} size={46} fill={YEL} />
  </g>);
}

/* 5 — three bars: GUESS 34, WORST CASE 49, ACTUAL 56 */
function LTActual({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), bW = bt(beats, 2, D * 0.45);
  const rows = [['GUESS', 34, TEAL, 0.2], ['WORST CASE', 49, '#E07A2E', bW - 0.2], ['ACTUAL', 56, YEL, 0.6]];
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#8E1820" />
    <rect x="100" y="740" width="772" height="640" rx="30" fill={CREAM} />
    {rows.map(([l, v, c, s], i) => { const k = tw(t, s, 0.7), y = 820 + i * 180;
      return (<g key={l}><text x="140" y={y} fontFamily={BOLD} fontWeight="900" fontSize="32" fill={INK}>{l}</text>
        <rect x="140" y={y + 20} width={640 * (v / 56) * k} height="80" rx="20" fill={c} />
        <text x={150 + 640 * (v / 56) * k} y={y + 80} textAnchor="end" dx="-20" fontFamily={BOLD} fontWeight="900" fontSize="44" fill={INK} opacity={k}>{v}</text></g>); })}
    <text x="486" y="1350" textAnchor="middle" fontFamily={BOLD} fontWeight="700" fontSize="26" fill={INK} opacity="0.6">DAYS TO FINISH (AVERAGE)</text>
  </g>);
}

/* 6 — name it: the PLAN (straight dashed line) vs REALITY (a long squiggle through phone, snack, nap) */
function LTName({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), bR = bt(beats, 2, D * 0.4), k = tw(t, bR, D * 0.5);
  const N = 80, path = [...Array(N + 1)].map((_, i) => i / N).filter((u) => u <= k).map((u) => `${180 + u * 612} ${1150 + Math.sin(u * TAU * 3) * 110 + Math.sin(u * 23) * 20}`);
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#56328A" />
    <circle cx="180" cy="900" r="26" fill={YEL} /><circle cx="792" cy="900" r="26" fill={YEL} />
    <line x1="180" y1="900" x2="792" y2="900" stroke="#fff" strokeWidth="10" strokeDasharray="26 18" />
    <Chip x={486} y={830} text="THE PLAN" k={pop(t, 0.15)} size={30} fill="#fff" />
    <circle cx="180" cy="1150" r="26" fill={RED} />
    {path.length > 1 && <path d={'M' + path.join(' L')} fill="none" stroke={RED} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />}
    {[['📱', 0.2], ['🍪', 0.5], ['💤', 0.8]].map(([e, u]) => k > u && <text key={e} x={180 + u * 612} y={1150 + Math.sin(u * TAU * 3) * 110 - 70} textAnchor="middle" fontSize="70">{e}</text>)}
    <Chip x={486} y={1420} text="REALITY" k={pop(t, bR)} size={34} fill={RED} col="#fff" />
  </g>);
}

/* 7 — self-proof: a "QUICK" sticky, the clock hands whirl, Leo grins guiltily */
function LTProof({ T, t, dur, beats }) {
  const m = (T * 400) % 60, h = (T * 6.6) % 12;
  return (<g>
    <circle cx="486" cy="1300" r="420" fill="#B85E1F" />
    <Clock x={486} y={880} r={150} h={h} m={m} />
    <Sticky x={250} y={760} text="QUICK" k={pop(t, 0.2)} rot={-10} size={46} />
    <T2Bust who="leo" x={486} y={1420} s={0.56} T={T} mood="nervous" look={-8} disc={false} />
  </g>);
}

/* 8 — outro: Grace hands Leo a notebook; "LAST TIME: 2 HRS" gets underlined; Leo nods */
function LTOutro({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5.5), bL = bt(beats, 1, D * 0.25), u = tw(t, bL + 0.2, 0.6);
  return (<g>
    <T2Bust who="grace" x={250} y={1400} s={0.56} T={T} mood="smug" look={10} />
    <T2Bust who="leo" x={720} y={1390} s={0.56} T={T} mood={t > bL ? 'happy' : 'calm'} look={-10} ph={0.5} />
    <g transform={`translate(486 920) rotate(-4) scale(${pop(t, 0.15)})`}>
      <rect x="-270" y="-180" width="540" height="360" rx="18" fill="#fff" />
      <rect x="-270" y="-180" width="540" height="70" rx="18" fill={TEAL} />
      <text x="0" y="-133" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff">LAST ESSAY</text>
      <text x="-230" y="-30" fontFamily={BOLD} fontWeight="800" fontSize="32" fill={INK} opacity="0.5">GUESSED: 10 MIN</text>
      <text x="-230" y="60" fontFamily={BOLD} fontWeight="900" fontSize="46" fill={RED}>TOOK: 2 HRS</text>
      <line x1="-230" y1="85" x2={-230 + 340 * u} y2="85" stroke={RED} strokeWidth="10" strokeLinecap="round" />
    </g>
  </g>);
}

Object.assign(window, { LTHook, LTMidnight, LTSnap, LTStudy, LTActual, LTName, LTProof, LTOutro });
})();
