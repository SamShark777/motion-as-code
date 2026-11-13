// art.jsx — "Why Picturing Your Dream Can Stop You Chasing It" (Ted type 2, Leo ep. 7 with Priya). 972×1728 card; captions sit
// in the top third, so subjects stay in the lower 60%. Pure functions of T and t. People via <T2Bust>.
// Positive fantasies: Kappes & Oettingen 2011 (JESP) — imagining an idealized future lowered energy (systolic blood pressure,
// self-reported energization); dreaming of an ideal week → less accomplished a week later. Fix: mental contrasting (Oettingen).
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', NAVY = '#1F3B73', PURP = '#6A3FA0', GRN = '#4E9A6A', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const BOLD = 'Montserrat, sans-serif';
const bt = (beats, i, fb) => (beats && beats[i] != null ? beats[i] : fb);

function Chip({ x, y, text, k = 1, fill = YEL, col = INK, size = 34, w, rot = 0 }) {
  if (k <= 0) return null;
  const W = w || text.length * size * 0.72 + 60;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}><rect x={-W / 2} y="-34" width={W} height="68" rx="34" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={col}>{text}</text></g>);
}
function Thought({ x, y, k = 1, tx, ty, fill = '#fff', children }) {
  if (k <= 0) return null;
  const puffs = [[-150, 0, 95], [-60, -60, 105], [60, -55, 105], [150, 5, 90], [70, 60, 95], [-70, 60, 95]];
  return (<g><g transform={`translate(${x} ${y}) scale(${k})`}>{puffs.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />)}<rect x="-170" y="-60" width="340" height="140" fill={fill} />{children}</g>
    {[0, 1, 2].map((i) => <circle key={i} cx={x + (tx - x) * (0.55 + i * 0.15)} cy={y + (ty - y) * (0.55 + i * 0.15)} r={22 - i * 6} fill={fill} opacity={cl(k * 3 - i)} />)}</g>);
}
/* a dream office: glass desk, plant, nameplate */
function DreamOffice({ s = 1 }) {
  return (<g transform={`scale(${s})`}><rect x="-130" y="-70" width="260" height="140" rx="12" fill="#BFE3F2" /><rect x="-130" y="20" width="260" height="20" fill="#7FB7CF" />
    <rect x="-70" y="-30" width="140" height="34" rx="6" fill={YEL} /><text y="-6" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="18" fill={INK}>LEO · LEAD</text>
    <rect x="80" y="-60" width="30" height="50" rx="6" fill={RED} /><circle cx="95" cy="-70" r="24" fill={GRN} /></g>);
}
/* laptop with a job form; apply button greyed or lit */
function Laptop({ x, y, s = 1, lit = 0, cursor = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-230" y="-170" width="460" height="300" rx="20" fill={INK} /><rect x="-210" y="-150" width="420" height="260" rx="10" fill="#F7F4EC" />
    <text x="-180" y="-100" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>DREAM JOB</text>
    {[0, 1, 2].map((i) => <rect key={i} x="-180" y={-70 + i * 44} width={300 - i * 50} height="22" rx="11" fill="#D6CFC0" />)}
    <rect x="40" y="50" width="150" height="46" rx="23" fill={lit ? GRN : '#B8B1A3'} /><text x="115" y="82" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="24" fill="#fff">APPLY</text>
    <path d="M-300 130 L300 130 L270 170 L-270 170 Z" fill="#9AA3B5" />
    {cursor > 0 && <path transform={`translate(${lerp(260, 120, cursor)} ${lerp(160, 70, cursor)})`} d="M0 0 L0 50 L13 38 L23 60 L33 56 L23 34 L40 34 Z" fill="#fff" stroke={INK} strokeWidth="4" />}</g>);
}
const lerp = (a, b, t) => a + (b - a) * t;
/* battery: level 0..1 */
function Battery({ x, y, s = 1, level = 1 }) {
  const c = level > 0.5 ? GRN : level > 0.25 ? YEL : RED;
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-80" y="-150" width="160" height="300" rx="24" fill="none" stroke={INK} strokeWidth="16" /><rect x="-36" y="-180" width="72" height="30" rx="8" fill={INK} />
    <rect x="-56" y={126 - 256 * level} width="112" height={256 * level} rx="10" fill={c} /></g>);
}

/* 1 — Leo at his kitchen table, eyes up, thought cloud = the dream office; the laptop's APPLY button sits untouched */
function DJDream({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.5);
  return (<g>
    <circle cx="486" cy="1200" r="430" fill="#2C4F92" />
    <Thought x={600} y={800} k={pop(t, 0.2, 0.45)} tx={420} ty={1020}><DreamOffice s={1.15} /></Thought>
    <T2Bust who="leo" x={360} y={1180} s={0.5} T={T} mood="happy" look={10} disc={false} />
    <Laptop x={640} y={1430} s={0.62} lit={0} />
    {t > c3 && <Chip x={640} y={1260} text="NOT SENT" fill={RED} col="#fff" size={30} k={pop(t, c3)} />}
  </g>);
}

/* 2 — you: a progress bar that fills while you only daydream (the bar is a mirage: 'FEELS LIKE' label) */
function DJYou({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), p = tw(t, 0.2, 1.6);
  return (<g>
    <circle cx="486" cy="1180" r="420" fill="#C9D8C5" />
    <T2Bust who="leo" x={486} y={1300} s={0.5} T={T} mood="smug" look={0} disc={false} />
    <g transform="translate(486 830)"><rect x="-340" y="-50" width="680" height="100" rx="50" fill="#fff" /><rect x="-330" y="-40" width={660 * p} height="80" rx="40" fill={GRN} opacity={0.5 + 0.5 * osc(T, 0.8) * 0.3} />
      <text y="16" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={INK}>{Math.round(p * 100)}%</text></g>
    <Chip x={486} y={720} text="FEELS LIKE PROGRESS" fill={INK} col={YEL} size={30} k={pop(t, c2 - 0.2)} />
  </g>);
}

/* 3 — snapback: Leo's battery drains as the dream glows; he slumps */
function DJDrain({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2), lv = 1 - tw(t, c2 - 0.6, 0.9) * 0.8;
  return (<g>
    <circle cx="486" cy="1200" r="440" fill="#F4D77A" />
    <g transform={`translate(260 ${900 + osc(T, 2.4) * 10})`}><circle r="120" fill="#fff" opacity="0.85" /><DreamOffice s={0.7} /></g>
    <Battery x={720} y={980} s={1.1} level={lv} />
    <T2Bust who="leo" x={420} y={1430} s={0.42} T={T} mood={lv < 0.5 ? 'sad' : 'calm'} look={8} disc={false} />
  </g>);
}

/* 4 — the study: a journal page + three imagined perfect futures (week, essay prize, shoes) popping as cards */
function DJStudy({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.6);
  const cards = [['PERFECT WEEK', 0, YEL], ['WIN THE PRIZE', 1, CREAM], ['NAILED IT', 2, '#F09A4E']];
  const icon = (e) => e === 0 ? (<g><rect x="-60" y="-60" width="120" height="110" rx="12" fill="#fff" /><rect x="-60" y="-60" width="120" height="30" rx="12" fill={RED} />{[0, 1, 2, 3, 4, 5].map((j) => <path key={j} transform={`translate(${-36 + (j % 3) * 36} ${-8 + Math.floor(j / 3) * 34})`} d="M-10 0 L-3 8 L10 -8" fill="none" stroke={GRN} strokeWidth="6" strokeLinecap="round" />)}</g>)
    : e === 1 ? (<g><path d="M-50 -60 L50 -60 L40 0 Q0 30 -40 0 Z" fill={YEL} /><rect x="-10" y="10" width="20" height="30" fill={YEL} /><rect x="-40" y="40" width="80" height="20" rx="6" fill={INK} /><path d="M-50 -50 Q-90 -40 -60 -10 M50 -50 Q90 -40 60 -10" fill="none" stroke={YEL} strokeWidth="10" /></g>)
    : (<path d="M0 -70 L20 -22 L70 -22 L30 10 L44 60 L0 30 L-44 60 L-30 10 L-70 -22 L-20 -22 Z" fill={YEL} stroke={INK} strokeWidth="5" strokeLinejoin="round" />);
  return (<g>
    <Chip x={486} y={700} text="JESP · 2011" k={pop(t, 0)} size={34} fill={CREAM} />
    {cards.map(([l, e, c], i) => { const k = pop(t, 0.4 + i * 0.25); return k > 0 && (<g key={l} transform={`translate(${486 + (i - 1) * 280} ${1050 + Math.abs(i - 1) * 60 + osc(T, 2.2, i * 0.3) * 8}) rotate(${(i - 1) * 6}) scale(${k})`}>
      <rect x="-125" y="-170" width="250" height="340" rx="24" fill={c} /><g transform="translate(0 -10)">{icon(e)}</g>
      <text y="120" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="26" fill={INK}>{l}</text></g>); })}
    {t > c3 && <Chip x={486} y={1420} text="IMAGINE IT. PERFECTLY." fill={INK} col="#fff" size={30} k={pop(t, c3)} />}
  </g>);
}

/* 5 — energy dropped: a blood-pressure gauge needle sinks; Leo yawns */
function DJPressure({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), a = lerp(-30, -120, tw(t, c2 - 0.3, 0.8)) + osc(T, 0.4) * 2;
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#8E1820" />
    <g transform="translate(486 1060)"><path d="M-280 0 A280 280 0 0 1 280 0" fill="none" stroke={CREAM} strokeWidth="60" />
      <path d="M-280 0 A280 280 0 0 1 -198 -198" fill="none" stroke="#7FB7CF" strokeWidth="60" /><path d="M198 -198 A280 280 0 0 1 280 0" fill="none" stroke={YEL} strokeWidth="60" />
      <g transform={`rotate(${a + 90})`}><path d="M-12 0 L0 -250 L12 0 Z" fill={INK} /></g><circle r="34" fill={INK} />
      <text y="90" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={CREAM}>SYSTOLIC PRESSURE</text></g>
    <T2Bust who="leo" x={486} y={1500} s={0.36} T={T} mood="sad" look={0} disc={false} />
    <Chip x={486} y={760} text="ENERGY ↓" fill={YEL} size={40} k={pop(t, 0.2)} />
  </g>);
}

/* 6 — turn: a week planner; dreamed-of week glows, but the real ticks stay few */
function DJWeek({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], done = [1, 0, 0, 1, 0, 0, 0];
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#4A2E78" />
    <g transform="translate(486 1060)"><rect x="-380" y="-250" width="760" height="500" rx="30" fill="#F7F4EC" />
      <text y="-180" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={INK}>THE PERFECT WEEK</text>
      {days.map((d, i) => { const x = -320 + i * 107; return (<g key={i}><text x={x} y="-100" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={TEAL}>{d}</text>
        <rect x={x - 40} y="-70" width="80" height="80" rx="14" fill="#E2DACB" />
        {t > c2 && done[i] ? <path transform={`translate(${x} -30) scale(${pop(t, c2 + i * 0.05)})`} d="M-22 0 L-6 18 L24 -20" fill="none" stroke={GRN} strokeWidth="10" strokeLinecap="round" /> : null}
        {t > c2 && !done[i] ? <g transform={`translate(${x} -30) scale(${pop(t, c2 + i * 0.05)})`}><path d="M-16 -16 L16 16 M16 -16 L-16 16" stroke={RED} strokeWidth="9" strokeLinecap="round" /></g> : null}</g>); })}
      {[0, 1, 2].map((i) => <rect key={i} x="-320" y={60 + i * 50} width={600 - i * 120} height="22" rx="11" fill="#D6CFC0" />)}</g>
    <T2Bust who="leo" x={790} y={1460} s={0.3} T={T} mood="nervous" look={-8} disc={false} />
  </g>);
}

/* 7 — self-proof: a wall of the same dream pinned as a vision board, a hundred sticky notes, the same goal on each */
function DJProof({ T, t, beats }) {
  const c4 = bt(beats, 4, 1.8), n = Math.floor(tw(t, 0, 1.6) * 24);
  return (<g>
    <circle cx="486" cy="1220" r="430" fill="#3E8A94" />
    {[...Array(24)].map((_, i) => { if (i >= n) return null; const x = 180 + (i % 6) * 122, y = 820 + Math.floor(i / 6) * 130;
      return <g key={i} transform={`translate(${x} ${y}) rotate(${(hsh(i) - 0.5) * 16})`}><rect x="-52" y="-52" width="104" height="104" fill={[YEL, '#F09A4E', CREAM, '#E07FA8'][i % 4]} />
        <text y="8" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="20" fill={INK}>DREAM</text></g>; })}
    {t > c4 && <Chip x={486} y={1420} text="PICTURED: 100×  ·  DONE: 0" fill={RED} col="#fff" size={28} k={pop(t, c4)} />}
  </g>);
}

/* 8 — outro: Priya points at a brick wall in the path to the dream (the obstacle); Leo grins and clicks APPLY */
function DJOutro({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4), c4 = bt(beats, 4, 1.8), c5 = bt(beats, 5, 2.4), click = tw(t, c4, 0.6);
  return (<g>
    <circle cx="486" cy="1200" r="430" fill="#2C4F92" />
    <g transform={`translate(486 ${800 + osc(T, 2.2) * 6})`}><circle r="110" fill="#fff" opacity="0.85" /><DreamOffice s={0.6} /></g>
    {t > c3 - 0.2 && <g transform={`translate(486 1010) scale(${pop(t, c3 - 0.2)})`}>{[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={r + '-' + c} x={-200 + c * 100 + (r % 2) * 50 - 25} y={-60 + r * 40} width="96" height="36" rx="4" fill="#C0583A" />))}
      <text y="-80" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={YEL}>OBSTACLE #1</text></g>}
    <T2Bust who="priya" x={230} y={1350} s={0.36} T={T} mood="smug" look={10} ph={0.3} disc={false} />
    <T2Bust who="leo" x={740} y={1350} s={0.36} T={T} mood={click > 0.9 ? 'happy' : 'calm'} look={-8} disc={false} />
    <Laptop x={486} y={1560} s={0.42} lit={click > 0.9 ? 1 : 0} cursor={click} />
    {t > c4 && <Chip x={486} y={690} text="WHAT'S YOURS?" fill={YEL} size={34} k={pop(t, c4)} />}
    {t > c5 && <Chip x={486} y={1180} text="SEND IT TO THAT FRIEND" fill={RED} col="#fff" size={28} k={pop(t, c5)} />}
  </g>);
}

Object.assign(window, { DJDream, DJYou, DJDrain, DJStudy, DJPressure, DJWeek, DJProof, DJOutro });
})();
