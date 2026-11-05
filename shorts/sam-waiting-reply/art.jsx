// art.jsx — "Why Waiting for a Text Feels Worse Than a No" (Ted type 2, Sam + Priya). 972×1728 card; captions sit in
// the top third, so subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene). People via <T2Bust>.
// Uncertainty and stress: de Berker et al. 2016, Nature Communications (45 volunteers, 50% shock chance most stressful).
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', NAVY = '#1F3B73', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';
const bt = (beats, i, fb) => (beats && beats[i] != null ? beats[i] : fb);

/* a phone; children are drawn in screen coordinates (0,0 = screen top-left), clipped to the screen */
function Phone({ x, y, w = 440, h = 800, rot = 0, id, children, face = '#F7F4EC' }) {
  return (<g transform={`translate(${x - w / 2} ${y - h / 2}) rotate(${rot} ${w / 2} ${h / 2})`}>
    <rect x="-22" y="-22" width={w + 44} height={h + 44} rx="60" fill={INK} />
    <defs><clipPath id={id}><rect width={w} height={h} rx="40" /></clipPath></defs>
    <rect width={w} height={h} rx="40" fill={face} />
    <g clipPath={`url(#${id})`}>{children}</g>
    <rect x={w / 2 - 60} y="-8" width="120" height="22" rx="11" fill={INK} /></g>);
}
function Msg({ x, y, w, text, me = false, size = 34 }) {
  return (<g transform={`translate(${x} ${y})`}>
    <rect width={w} height="84" rx="34" fill={me ? TEAL : '#DDD6C8'} />
    <text x="30" y="54" fontFamily={BOLD} fontWeight="800" fontSize={size} fill={me ? '#fff' : INK}>{text}</text></g>);
}
function Chip({ x, y, text, k = 1, fill = YEL, col = INK, size = 34, w }) {
  if (k <= 0) return null;
  const W = w || text.length * size * 0.72 + 60;
  return (<g transform={`translate(${x} ${y}) scale(${k})`}><rect x={-W / 2} y="-34" width={W} height="68" rx="34" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={col}>{text}</text></g>);
}
/* typing dots that appear, pulse, then vanish (on 0..1) */
function Dots({ x, y, T, on = 1 }) {
  if (on <= 0) return null;
  return (<g transform={`translate(${x} ${y})`} opacity={on}><rect x="0" y="0" width="150" height="74" rx="37" fill="#DDD6C8" />
    {[0, 1, 2].map((i) => <circle key={i} cx={42 + i * 33} cy={37 + osc(T, 0.6, i * 0.2) * 7} r="11" fill="#8A8478" />)}</g>);
}
/* simple clock face */
function Clock({ x, y, r = 90, T, spin = 1 }) {
  return (<g transform={`translate(${x} ${y})`}><circle r={r + 16} fill={INK} /><circle r={r} fill={CREAM} />
    {[0, 90, 180, 270].map((a) => <rect key={a} x="-5" y={-r + 8} width="10" height="18" rx="4" fill={INK} transform={`rotate(${a})`} />)}
    <line x1="0" y1="0" x2="0" y2={-r * 0.55} stroke={INK} strokeWidth="11" strokeLinecap="round" transform={`rotate(${T * 30 * spin})`} />
    <line x1="0" y1="0" x2="0" y2={-r * 0.8} stroke={RED} strokeWidth="6" strokeLinecap="round" transform={`rotate(${T * 360 * spin})`} />
    <circle r="9" fill={INK} /></g>);
}

/* 1 — Sam stares at his phone: his text, "Read 9:14", typing dots that come and go; a clock spins */
function SWHook({ T, t, dur, beats }) {
  const D = Math.max(2.5, dur || 4), on = cl(osc(T, 2.2) * 2 + 0.3);
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#2C4F92" />
    <Clock x={170} y={760} r={78} T={T} spin={1.6} />
    <Phone x={600} y={1030} w={420} h={700} rot={5} id="swp1">
      <rect width="420" height="90" fill="#EFEADD" /><circle cx="58" cy="45" r="26" fill="#C98A62" />
      <text x="100" y="57" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>JAY</text>
      <Msg x={110} y={170} w={290} text="hey :)" me />
      <Msg x={50} y={276} w={350} text="are we good?" me />
      <text x="390" y="400" textAnchor="end" fontFamily={BOLD} fontWeight="800" fontSize="36" fill="#8A8478">Read 9:14</text>
      <Dots x={30} y={440} T={T} on={on} />
    </Phone>
    <T2Bust who="sam" x={260} y={1390} s={0.62} T={T} mood="nervous" look={14} />
    <Chip x={600} y={590} text="1 HOUR LATER" k={pop(t, D * 0.45)} fill={CREAM} size={30} />
  </g>);
}

/* 2 — two doors in Sam's head: a calm "NO" card vs a spinning "MAYBE?" storm; his eyes slide to the NO */
function SWRatherNo({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), bN = bt(beats, 5, D * 0.75), k = tw(t, bN - 0.2, 0.5);
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#D8CFBD" />
    <g transform={`translate(270 820) rotate(${osc(T, 0.9) * 6}) scale(${pop(t, 0.2)})`}>
      <rect x="-170" y="-130" width="340" height="260" rx="30" fill={NAVY} />
      <text y="30" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="64" fill={YEL}>MAYBE?</text>
      {[0, 1, 2, 3].map((i) => <text key={i} x={-150 + i * 95} y={-150 - (T * 60 + i * 40) % 80} fontFamily={BOLD} fontWeight="900" fontSize="48" fill={NAVY} opacity="0.6">?</text>)}
    </g>
    <g transform={`translate(700 820) scale(${pop(t, 0.5)})`}>
      <rect x="-150" y="-130" width="300" height="260" rx="30" fill="#fff" />
      <text y="38" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="110" fill={RED}>NO</text>
    </g>
    <T2Bust who="sam" x={486} y={1400} s={0.62} T={T} mood={k > 0.5 ? 'sad' : 'nervous'} look={-14 + 28 * k} />
  </g>);
}

/* 3 — snapback: punch in on a lab gauge; the needle jumps; a pupil widens */
function SWSnap({ T, t, dur, beats }) {
  const D = Math.max(2.5, dur || 4), z = 1 + 0.16 * tw(t, 0, 0.6), bM = bt(beats, 3, D * 0.6), m = tw(t, bM - 0.2, 0.5);
  const ang = -70 + 120 * m + osc(T, 0.15) * 4 * m;
  return (<g transform={`translate(486 1200) scale(${z}) translate(-486 -1200)`}>
    <circle cx="486" cy="1260" r="420" fill="#C9A63A" />
    <g transform="translate(486 1100)">
      <path d="M-300 0 A300 300 0 0 1 300 0 Z" fill="#fff" />
      {[...Array(9)].map((_, i) => { const a = Math.PI + i * Math.PI / 8; return <line key={i} x1={Math.cos(a) * 250} y1={Math.sin(a) * 250} x2={Math.cos(a) * 285} y2={Math.sin(a) * 285} stroke={INK} strokeWidth="8" />; })}
      <path d="M180 -150 A235 235 0 0 1 240 -40" fill="none" stroke={RED} strokeWidth="26" />
      <text x="0" y="-120" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>STRESS</text>
      <line x1="0" y1="0" x2="0" y2="-230" stroke={INK} strokeWidth="14" strokeLinecap="round" transform={`rotate(${ang})`} />
      <circle r="24" fill={INK} />
      <rect x="-320" y="0" width="640" height="70" rx="14" fill={INK} />
      <text x="0" y="48" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="32" fill={YEL}>SWEAT · PUPILS</text>
    </g>
    <g transform="translate(486 1430)">
      <ellipse rx="190" ry="100" fill="#fff" /><circle r="80" fill="#5B8FB0" /><circle r={30 + 34 * m} fill={INK} />
      <circle cx="-22" cy="-24" r="12" fill="#fff" />
    </g>
  </g>);
}

/* 4 — the study: rocks on a grid; one flips to reveal a snake; a zap hits a hand. UCL · 2016 · 45 people */
function SWStudy({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 6), bZ = bt(beats, 5, D * 0.8), flip = tw(t, bZ - 0.5, 0.4), zap = cl((t - bZ) / 0.2) * (osc(T, 0.08) > 0 ? 1 : 0.4);
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#1F5560" />
    <Chip x={300} y={640} text="UCL · 2016" k={pop(t, 0.1)} size={32} />
    <Chip x={690} y={640} text="45 PEOPLE" k={pop(t, bt(beats, 2, 1.2))} fill={CREAM} size={32} />
    <rect x="150" y="740" width="672" height="460" rx="30" fill="#2E8090" />
    {[...Array(6)].map((_, i) => { const x = 270 + (i % 3) * 216, y = 860 + Math.floor(i / 3) * 220, me = i === 4;
      const lift = me ? flip : 0;
      return (<g key={i}>
        {me && flip > 0.3 && <g transform={`translate(${x} ${y + 20})`}><path d="M-80 10 C-40 -30 -10 40 30 0 C55 -25 75 -10 85 -20" fill="none" stroke="#7FB04A" strokeWidth="22" strokeLinecap="round" />
          <circle cx="85" cy="-22" r="18" fill="#7FB04A" /><circle cx="90" cy="-28" r="5" fill={INK} /></g>}
        <ellipse cx={x} cy={y - 90 * lift} rx="90" ry="62" fill="#8B8174" transform={`rotate(${-30 * lift} ${x} ${y})`} />
        <ellipse cx={x - 20} cy={y - 18 - 90 * lift} rx="40" ry="16" fill="#A79D90" />
      </g>); })}
    <g transform="translate(486 1430)">
      <rect x="-110" y="150" width="220" height="200" rx="40" fill={CREAM} />
      <rect x="-95" y="-10" width="190" height="180" rx="60" fill="#F1C3A0" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-90 + i * 47} y={-110 + Math.abs(i - 1.5) * 18} width="40" height="140" rx="20" fill="#F1C3A0" />)}
      <rect x="-100" y="90" width="200" height="34" rx="8" fill={INK} />
      {zap > 0 && <path d="M0 -80 L-40 -170 L10 -170 L-30 -260" fill="none" stroke={YEL} strokeWidth="16" strokeLinejoin="round" opacity={zap} />}
    </g>
  </g>);
}

/* 5 — chance of shock (0 / 50 / 100%) vs stress: the curve rises, peaks at 50%, drops at a sure shock */
function SWPeak({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), k = tw(t, 0.3, D * 0.55), bS = bt(beats, 3, D * 0.6);
  const X0 = 150, X1 = 822, Y0 = 1300, f = (u) => Y0 - 30 - 430 * Math.sin(Math.PI * u);
  const N = 60, pts = [...Array(N + 1)].map((_, i) => i / N).filter((u) => u <= k).map((u) => `${X0 + u * (X1 - X0)} ${f(u)}`);
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#8E1820" />
    <rect x="110" y="740" width="752" height="680" rx="30" fill={CREAM} />
    <text x="150" y="800" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>STRESS</text>
    <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke={INK} strokeWidth="8" strokeLinecap="round" />
    {pts.length > 1 && <path d={'M' + pts.join(' L')} fill="none" stroke={RED} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />}
    {[[0, '0%'], [0.5, '50%'], [1, '100%']].map(([u, l]) => <text key={l} x={X0 + u * (X1 - X0)} y={Y0 + 60} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>{l}</text>)}
    <text x="486" y={Y0 + 100} textAnchor="middle" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={INK} opacity="0.6">CHANCE OF A SHOCK</text>
    {k > 0.5 && <g transform={`translate(486 ${f(0.5) - 60}) scale(${pop(t, 0.3 + D * 0.3)})`}><Chip x={0} y={0} text="PEAK" fill={RED} col="#fff" size={34} /></g>}
    {t > bS && <g transform={`translate(${X1 - 40} ${f(1) - 70}) scale(${pop(t, bS)})`}><Chip x={0} y={0} text="SURE SHOCK" fill={TEAL} col="#fff" size={26} /></g>}
  </g>);
}

/* 6 — Sam's head runs the odds: a coin flips forever above him, "?" orbiting */
function SWOdds({ T, t, dur, beats }) {
  const fl = Math.cos(T * 9), up = Math.abs(Math.sin(T * 3)) * 60;
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#56328A" />
    {[0, 1, 2, 3, 4].map((i) => { const a = T * 1.4 + i * TAU / 5; return <text key={i} x={486 + Math.cos(a) * 300} y={900 + Math.sin(a) * 90} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="64" fill={YEL} opacity={0.5 + 0.5 * Math.sin(a)}>?</text>; })}
    <g transform={`translate(486 ${880 - up}) scale(${fl} 1)`}>
      <circle r="120" fill={fl > 0 ? YEL : '#C9A63A'} /><circle r="96" fill="none" stroke={INK} strokeWidth="6" opacity="0.3" />
      <text y="30" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="84" fill={INK}>{fl > 0 ? 'NO' : '?'}</text>
    </g>
    <T2Bust who="sam" x={486} y={1400} s={0.66} T={T} mood="nervous" look={osc(T, 0.7) * 12} />
  </g>);
}

/* 7 — self-proof: thumb pulls the chat down to refresh, again and again */
function SWProof({ T, t, dur, beats }) {
  const p = (T * 0.9) % 1, pull = p < 0.6 ? Easing.easeOutCubic(p / 0.6) : 1 - (p - 0.6) / 0.4;
  return (<g>
    <circle cx="486" cy="1300" r="420" fill="#B85E1F" />
    <Phone x={486} y={1080} w={420} h={680} id="swp7">
      <rect width="420" height="90" fill="#EFEADD" />
      <g transform={`translate(210 ${130 + pull * 90}) rotate(${pull * 300})`} opacity={pull}>
        <path d="M-30 -10 A32 32 0 1 1 -10 28" fill="none" stroke={TEAL} strokeWidth="10" strokeLinecap="round" /><path d="M-48 -18 L-28 -36 L-14 -6 Z" fill={TEAL} /></g>
      <g transform={`translate(0 ${pull * 120})`}>
        <Msg x={110} y={140} w={290} text="hey :)" me />
        <Msg x={50} y={246} w={350} text="are we good?" me />
        <text x="390" y="370" textAnchor="end" fontFamily={BOLD} fontWeight="800" fontSize="26" fill="#8A8478">Read 9:14</text>
      </g>
    </Phone>
    <g transform={`translate(650 ${930 + pull * 200})`}>
      <rect x="-50" y="0" width="100" height="420" rx="50" fill="#F1C3A0" /><rect x="-36" y="10" width="72" height="60" rx="26" fill="#F7D9C2" /></g>
    <T2Bust who="sam" x={210} y={1480} s={0.4} T={T} mood="nervous" look={10} disc={false} />
  </g>);
}

/* 8 — outro: Priya flips the phone face down; Sam exhales. "NOT NEEDY" chip */
function SWOutro({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5.5), fl = tw(t, 0.4, 0.6), bM = bt(beats, 4, D * 0.75);
  const sx = Math.cos(fl * Math.PI);
  return (<g>
    <T2Bust who="sam" x={250} y={1380} s={0.58} T={T} mood={t > bM ? 'calm' : 'nervous'} look={10} />
    <T2Bust who="priya" x={720} y={1400} s={0.56} T={T} mood="smug" look={-10} ph={0.5} />
    <g transform={`translate(486 900) scale(${sx} 1) rotate(-6)`}>
      <rect x="-140" y="-230" width="280" height="460" rx="40" fill={INK} />
      {sx > 0 ? <g><rect x="-120" y="-210" width="240" height="420" rx="28" fill="#F7F4EC" /><text y="10" textAnchor="middle" fontFamily={BOLD} fontWeight="800" fontSize="28" fill="#8A8478">Read 9:14</text></g>
        : <g><circle cx="-60" cy="-150" r="30" fill="#2A2F3A" /><circle cx="-60" cy="-150" r="16" fill="#3E4554" /></g>}
    </g>
    <Chip x={486} y={1210} text="NOT NEEDY" k={pop(t, bt(beats, 2, D * 0.35))} size={34} />
  </g>);
}

Object.assign(window, { SWHook, SWRatherNo, SWSnap, SWStudy, SWPeak, SWOdds, SWProof, SWOutro });
})();
