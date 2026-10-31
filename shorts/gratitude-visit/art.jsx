// art.jsx — "One Letter, a Month of Happiness" (Ted type 2, Omar + Grace). 972×1728 card; captions sit in the top third,
// so subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene; may be negative). People via <T2Bust>.
// Gratitude visit: Seligman, Steen, Park & Peterson 2005 (biggest boost, lasted a month, faded by six months).
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';

/* a letter page with handwriting lines (w ≈ 300) */
function Letter({ x, y, s = 1, rot = 0, lines = 6, k = 1, title = 'DEAR COACH,' }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-150" y="-200" width="300" height="400" rx="10" fill="#fff" />
    <text x="-115" y="-140" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>{title}</text>
    {[...Array(lines)].map((_, i) => { const w = (190 + 60 * hsh(i + 3)) * cl(k * lines - i); return <path key={i} d={`M-115 ${-90 + i * 48} q${w / 4} -12 ${w / 2} 0 t${w / 2} 0`} fill="none" stroke="#5B6474" strokeWidth="7" strokeLinecap="round" />; })}
    <path d="M40 150 q20 -30 40 0 q20 30 40 0" fill="none" stroke={RED} strokeWidth="7" strokeLinecap="round" opacity={cl(k * 2 - 1)} /></g>);
}
/* envelope with a heart seal; open 0..1 lifts the flap */
function Envelope({ x, y, s = 1, open = 0, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-200" y="-130" width="400" height="260" rx="16" fill={CREAM} />
    <path d="M-200 130 L0 0 L200 130 Z" fill="#D8D0BF" />
    <path d={`M-200 -130 L0 ${-130 + 150 * (1 - 2 * open)} L200 -130 Z`} fill="#F4F0E8" />
    <path d="M0 -6 C-30 -40 -70 -10 0 40 C70 -10 30 -40 0 -6 Z" fill={RED} transform={`translate(0 ${-10 * open}) scale(${1 + 0.06 * Math.sin(open * 9)})`} /></g>);
}
const Heart = ({ x, y, s = 1, fill = RED, o = 1 }) => <path d="M0 -10 C-30 -48 -80 -14 0 46 C80 -14 30 -48 0 -10 Z" fill={fill} opacity={o} transform={`translate(${x} ${y}) scale(${s})`} />;
/* the old coach: not a recurring cast member, drawn in the Ted type 2 bust style with T2Face */
function Coach({ x, y, s = 1, T, mood = 'calm' }) {
  const X = 486, Y = 1150;
  return (<g transform={`translate(${x - X * s} ${y - Y * s + osc(T, 2.9) * 4}) scale(${s})`}>
    <path d={`M${X - 290} 1728 C${X - 290} ${Y + 350} ${X - 186} ${Y + 265} ${X} ${Y + 265} C${X + 186} ${Y + 265} ${X + 290} ${Y + 350} ${X + 290} 1728 Z`} fill="#3E8E5A" />
    <path d={`M${X - 60} ${Y + 270} L${X - 30} ${Y + 470} M${X + 60} ${Y + 270} L${X + 30} ${Y + 470}`} stroke="#E9E4D8" strokeWidth="10" />
    <circle cx={X + 30} cy={Y + 480} r="22" fill="#C9C0AE" />
    <rect x={X - 50} y={Y + 140} width="100" height="150" rx="30" fill="#C79B7A" />
    <ellipse cx={X} cy={Y} rx="150" ry="172" fill="#E8B896" />
    <path d={`M${X - 160} ${Y - 60} C${X - 150} ${Y - 200} ${X + 150} ${Y - 200} ${X + 160} ${Y - 60} Z`} fill="#1F3B73" />
    <path d={`M${X - 40} ${Y - 70} L${X + 240} ${Y - 50} L${X + 150} ${Y - 90} Z`} fill="#1F3B73" />
    <T2Face x={X} y={Y + 10} T={T} mood={mood} ph={0.7} />
    <path d={`M${X - 70} ${Y + 75} q70 -26 140 0`} fill="none" stroke="#D8D4CC" strokeWidth="18" strokeLinecap="round" />
  </g>);
}

/* 1 — hook: one envelope opens, a month-long calendar fills with hearts */
function GVHook({ T, t }) {
  const op = tw(t, 0.4, 0.6);
  return (<g>
    <circle cx="486" cy="1200" r="420" fill="#264684" />
    <g transform={`translate(486 ${1020 + osc(T, 2.4) * 10})`}>
      <g transform={`translate(0 ${-140 * op})`} opacity={op}><Letter x={0} y={0} s={0.7} k={op} title="THANK YOU" /></g>
      <Envelope x={0} y={80} s={1.05} open={op} rot={osc(T, 3) * 2} /></g>
    <g transform={`translate(486 1480) scale(${pop(t, 0.9, 0.4)})`}>
      <rect x="-330" y="-80" width="660" height="190" rx="22" fill={CREAM} />
      <rect x="-330" y="-80" width="660" height="44" rx="22" fill={RED} />
      <text y="-48" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="28" fill="#fff">ONE MONTH</text>
      {[...Array(30)].map((_, i) => { const on = cl((t - 1.1) * 14 - i); return (<g key={i}>
        <rect x={-310 + (i % 15) * 42} y={-20 + Math.floor(i / 15) * 60} width="34" height="48" rx="6" fill="#D8D0BF" />
        {on > 0 && <Heart x={-293 + (i % 15) * 42} y={2 + Math.floor(i / 15) * 60} s={0.28 * Easing.easeOutBack(on)} />}</g>); })}</g>
    {[...Array(7)].map((_, i) => { const a = i / 7 * TAU + T * 0.5; return <Heart key={i} x={486 + Math.cos(a) * 330} y={1000 + Math.sin(a) * 140} s={0.35 + 0.1 * hsh(i)} fill={YEL} o={0.8 * op} />; })}
  </g>);
}

/* 2 — Omar, unimpressed: thank-you notes = wedding cards */
function GVOmar({ T, t, dur }) {
  const st = pop(t, Math.max(0.5, dur - 1.2), 0.3);
  return (<g>
    <T2Bust who="omar" x={486} y={1240} T={T} mood="smug" look={osc(T, 2) * 8} />
    <g transform={`translate(260 ${820 + osc(T, 2.6) * 8}) rotate(-8) scale(${pop(t, 0.2)})`}>
      <rect x="-130" y="-90" width="260" height="180" rx="14" fill="#fff" />
      <circle cx="-22" cy="-10" r="34" fill="none" stroke="#C9A63A" strokeWidth="12" /><circle cx="22" cy="-10" r="34" fill="none" stroke="#C9A63A" strokeWidth="12" />
      <text y="66" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="24" fill={INK}>THANK YOU!</text></g>
    <g transform={`translate(720 ${820 + osc(T, 2.2, 0.3) * 8}) rotate(6) scale(${pop(t, 0.5)})`}>
      <rect x="-120" y="-90" width="240" height="180" rx="14" fill="#fff" />
      <path d="M-60 40 L-60 -30 L0 -60 L60 -30 L60 40 Z" fill="#E07A2E" /><rect x="-18" y="0" width="36" height="40" fill={INK} />
      <text y="72" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="22" fill={INK}>NEW HOME</text></g>
    <g transform={`translate(486 640) rotate(-6) scale(${st})`} opacity={st > 0 ? 1 : 0}>
      <rect x="-250" y="-60" width="500" height="120" rx="16" fill={RED} />
      <text y="22" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="58" fill="#fff">ONLY FOR THESE</text></g>
  </g>);
}

/* 3 — Grace hands Omar a pen; the brief appears on a card */
function GVPen({ T, t, dur }) {
  const D = Math.max(3, dur || 5), hand = tw(t, 0.3, 0.8);
  return (<g>
    <T2Bust who="grace" x={300} y={1300} s={0.62} T={T} mood="happy" look={14} />
    <T2Bust who="omar" x={720} y={1380} s={0.55} T={T} mood={t > D * 0.6 ? 'calm' : 'smug'} look={-12} disc={false} />
    <g transform={`translate(${380 + 220 * hand} ${1100 - 60 * hand}) rotate(${-40 + 20 * hand})`}>
      <rect x="-12" y="-120" width="24" height="200" rx="10" fill={YEL} /><path d="M-12 80 L0 120 L12 80 Z" fill={INK} /><rect x="-12" y="-120" width="24" height="34" rx="8" fill={RED} /></g>
    <g transform={`translate(486 700) rotate(-3) scale(${pop(t, D * 0.25, 0.4)})`}>
      <rect x="-330" y="-120" width="660" height="240" rx="22" fill={CREAM} />
      {['SOMEONE WHO', 'CHANGED YOUR LIFE', 'NEVER THANKED'].map((s, i) => <text key={i} y={-48 + i * 62} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill={i === 2 ? RED : INK} opacity={tw(t, D * 0.3 + i * D * 0.17, 0.3)}>{s}</text>)}</g>
  </g>);
}

/* 4 — read it in person: a door, a letter, two speech arcs */
function GVRead({ T, t }) {
  const op = tw(t, 0.2, 0.7);
  return (<g>
    <circle cx="486" cy="1210" r="420" fill="#C9A63A" />
    <g transform="translate(250 1180)">
      <rect x="-150" y="-380" width="300" height="760" rx="10" fill="#8E5A3C" />
      <g transform={`translate(-150 0) scale(${1 - 0.7 * op} 1) translate(150 0)`}><rect x="-150" y="-380" width="300" height="760" rx="10" fill="#B47A52" /><circle cx="105" cy="20" r="18" fill={YEL} /></g>
      <rect x="-170" y="-400" width="340" height="30" rx="8" fill="#6B4129" /></g>
    <T2Bust who="omar" x={660} y={1330} s={0.62} T={T} mood="nervous" look={-14} disc={false} />
    <Letter x={520} y={1260} s={0.5} rot={-8} k={1} />
    {[0, 1, 2].map((i) => { const r = ((T * 0.8 + i / 3) % 1); return <path key={i} d={`M${420 - r * 120} ${1100 - r * 40} q-30 40 0 80`} fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity={(1 - r) * op} />; })}
    <g transform={`translate(700 760) scale(${pop(t, 1.0, 0.4)})`}><rect x="-150" y="-55" width="300" height="110" rx="55" fill={INK} />
      <text y="18" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill={YEL}>OUT LOUD</text></g>
  </g>);
}

/* 5 — 2005: a laptop with a list of happiness exercises; one gets ticked */
function GVStudy({ T, t, dur }) {
  const D = Math.max(3, dur || 5), rows = ['THREE GOOD THINGS', 'YOU AT YOUR BEST', 'GRATITUDE VISIT', 'USE YOUR STRENGTHS'];
  return (<g>
    <circle cx="486" cy="1200" r="420" fill="#8E1820" />
    <g transform={`translate(486 1180) scale(${pop(t, 0.1, 0.45)})`}>
      <rect x="-380" y="-300" width="760" height="500" rx="28" fill="#2A2F3A" />
      <rect x="-350" y="-270" width="700" height="440" rx="12" fill={CREAM} />
      <path d="M-450 200 L450 200 L400 250 L-400 250 Z" fill="#9FA7B5" />
      <text x="-310" y="-200" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={RED}>2005 · ONLINE</text>
      {rows.map((r, i) => { const k = tw(t, 0.5 + i * D * 0.12, 0.3), me = i === 2;
        return (<g key={i} transform={`translate(-310 ${-120 + i * 74})`} opacity={k}>
          <rect x="0" y="-34" width="44" height="44" rx="8" fill={me ? YEL : '#fff'} stroke={INK} strokeWidth="5" />
          <text x="64" y="0" fontFamily={BOLD} fontWeight={me ? 900 : 800} fontSize="34" fill={INK}>{r}</text></g>); })}</g>
    <g transform={`translate(${800 + osc(T, 1.6) * 6} 1020) scale(${pop(t, D * 0.7, 0.35)})`}><Heart x={0} y={0} s={1.2} fill={YEL} /></g>
  </g>);
}

/* 6 — biggest boost: bars race; the gratitude bar towers, a calendar page reads "1 MONTH LATER" */
function GVBiggest({ T, t, dur }) {
  const D = Math.max(3, dur || 5), hs = [0.38, 0.45, 1.0, 0.5], cols = ['#9FA7B5', '#9FA7B5', YEL, '#9FA7B5'];
  return (<g>
    <rect x="90" y="1560" width="792" height="10" rx="5" fill="#fff" opacity="0.6" />
    {hs.map((h, i) => { const g = tw(t, 0.2 + i * 0.1, i === 2 ? 1.2 : 0.6), H = 640 * h * g, x = 200 + i * 192;
      return (<g key={i}><rect x={x - 70} y={1560 - H} width="140" height={H} rx="16" fill={cols[i]} />
        {i === 2 && <g transform={`translate(${x} ${1500 - H})`}><Heart x={0} y={0} s={0.8 * g} /></g>}</g>); })}
    <text x="584" y="1625" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={YEL}>GRATITUDE VISIT</text>
    <g transform={`translate(760 760) rotate(8) scale(${pop(t, D * 0.55, 0.4)})`}>
      <rect x="-120" y="-110" width="240" height="220" rx="18" fill={CREAM} /><rect x="-120" y="-110" width="240" height="60" rx="18" fill={RED} />
      <text y="-68" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="28" fill="#fff">1 MONTH</text>
      <text y="40" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="70" fill={INK}>STILL</text>
      <text y="90" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="32" fill={INK}>HAPPIER</text></g>
  </g>);
}

/* 7 — the turn: a happiness line rises, holds a month, then drifts back to where it started by six months */
function GVFade({ T, t, dur }) {
  const D = Math.max(2.5, dur || 4), p = tw(t, 0.1, D * 0.75);
  const X = (m) => 150 + m * 115, Y = (v) => 1500 - v * 380;
  const val = (m) => (m < 0.3 ? 0 : m < 1 ? (m - 0.3) / 0.7 : m < 1.6 ? 1 : Math.max(0, 1 - (m - 1.6) / 3.6));
  const pts = [...Array(61)].map((_, i) => { const m = i / 10; return [X(m), Y(val(m))]; }).filter((_, i) => i / 60 <= p);
  const last = pts[pts.length - 1] || [X(0), Y(0)];
  return (<g>
    <circle cx="486" cy="1230" r="420" fill="#264684" />
    <line x1={X(0)} y1={Y(0)} x2={X(6)} y2={Y(0)} stroke="#fff" strokeWidth="6" strokeDasharray="14 14" opacity="0.6" />
    <text x={X(6)} y={Y(0) + 50} textAnchor="end" fontFamily={BOLD} fontWeight="800" fontSize="28" fill="#fff" opacity="0.8">BEFORE</text>
    {[['1 MONTH', 1], ['6 MONTHS', 6]].map(([l, m], i) => <text key={i} x={X(m)} y={Y(0) + 100} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={YEL}>{l}</text>)}
    {pts.length > 1 && <path d={'M' + pts.map((q) => q.join(' ')).join(' L')} fill="none" stroke={YEL} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />}
    <g transform={`translate(${last[0]} ${last[1] - 40})`}><Heart x={0} y={0} s={0.7 * (0.6 + 0.4 * (1 - last[1] / 1500 + 0.75))} fill={RED} /></g>
    <T2Bust who="grace" x={760} y={860} s={0.38} T={T} mood={p > 0.8 ? 'sad' : 'calm'} disc={false} />
  </g>);
}

/* 8 — payoff: Omar reads to his old coach, a tear; Grace slides him another blank page */
function GVCoach({ T, t, dur }) {
  const D = Math.max(4, dur || 7), late = t > D * 0.62, drop = (t * 0.9) % 1;
  return (<g>
    <circle cx="486" cy="1200" r="420" fill="#B85A1E" />
    <Coach x={270} y={1290} s={0.58} T={T} mood={t > D * 0.35 ? 'happy' : 'calm'} />
    <T2Bust who="omar" x={700} y={1260} s={0.62} T={T} mood={late ? 'happy' : 'nervous'} look={-14} disc={false} />
    {t > D * 0.3 && !late && <ellipse cx={700 - 38} cy={1270 + drop * 90} rx="9" ry="14" fill="#9FE8FF" opacity={1 - drop} />}
    <Letter x={590} y={1520} s={0.42} rot={-10} k={1} />
    {late && <g transform={`translate(486 720) rotate(-4) scale(${pop(t, D * 0.62, 0.4)})`}>
      <rect x="-200" y="-150" width="400" height="300" rx="16" fill="#fff" />
      <text y="-70" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={INK}>DEAR ___,</text>
      {[0, 1, 2].map((i) => <rect key={i} x="-150" y={-20 + i * 50} width="300" height="10" rx="5" fill="#C9C0AE" />)}
      <text y="200" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill={YEL}>LETTER #2</text></g>}
    {late && <T2Bust who="grace" x={180} y={760} s={0.3} T={T} mood="smug" disc={false} />}
  </g>);
}

Object.assign(window, { GVHook, GVOmar, GVPen, GVRead, GVStudy, GVBiggest, GVFade, GVCoach });
})();
