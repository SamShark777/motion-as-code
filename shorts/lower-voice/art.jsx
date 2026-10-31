// art.jsx — "Lower Voice, More Votes" (Ted type 2, Priya + Grace). 972×1728 card; captions sit in the top third,
// so subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene; may be negative). People via <T2Bust>.
// Klofstad, Anderson & Peters 2012: lower-pitched versions of the same voice were "elected" by men and women listeners.
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';

/* a sound wave; pitch 0.5 (low, long waves) .. 2 (high, tight waves); a = amplitude */
function Wave({ x, y, w = 600, pitch = 1, a = 60, T = 0, col = '#fff', sw = 12, end = 0 }) {
  const n = 80, pts = [...Array(n + 1)].map((_, i) => { const u = i / n, env = Math.sin(u * Math.PI);
    const rise = end * Math.max(0, u - 0.7) * 3.3 * -a * 1.4;
    return [x + u * w, y + rise + Math.sin(u * 14 * pitch * Math.PI - T * 8) * a * env]; });
  return <path d={'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L')} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />;
}
/* microphone on a stand */
function Mic({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-10" y="0" width="20" height="300" fill="#5B6474" /><rect x="-80" y="290" width="160" height="20" rx="10" fill="#5B6474" />
    <rect x="-44" y="-130" width="88" height="140" rx="44" fill="#2A2F3A" />{[0, 1, 2, 3].map((i) => <rect key={i} x="-36" y={-100 + i * 26} width="72" height="8" rx="4" fill="#5B6474" />)}</g>);
}
/* ballot box with n slips dropped */
function Ballot({ x, y, s = 1, n = 0, label, col = YEL }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {[...Array(Math.floor(n))].map((_, i) => <rect key={i} x={-40 + (hsh(i) - 0.5) * 70} y={-30 - 18 * (i % 6)} width="80" height="50" rx="4" fill="#fff" transform={`rotate(${(hsh(i + 5) - 0.5) * 30})`} opacity={0.95} />)}
    <rect x="-150" y="-40" width="300" height="240" rx="16" fill={col} /><rect x="-80" y="-48" width="160" height="16" rx="8" fill={INK} />
    <text y="120" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill={INK}>{label}</text></g>);
}

/* 1 — hook: one face, two waves — high and tight vs low and long */
function LVHook({ T, t, dur }) {
  const D = Math.max(2.5, dur || 4), sw = cl((t - D * 0.55) / 0.6);
  return (<g>
    <T2Bust who="priya" x={486} y={1270} T={T} mood={sw > 0.5 ? 'smug' : 'calm'} />
    <g opacity={1 - 0.6 * sw}><Wave x={180} y={760} w={612} pitch={2.2} a={46} T={T} col="#9FE8FF" /></g>
    <g opacity={tw(t, D * 0.5, 0.4)}><Wave x={180} y={880} w={612} pitch={0.7} a={70} T={T} col={YEL} sw={16} /></g>
    <g transform={`translate(830 700) scale(${pop(t, 0.3)})`}><rect x="-60" y="-30" width="120" height="60" rx="30" fill="#9FE8FF" /><text y="12" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>HIGH</text></g>
    <g transform={`translate(830 960) scale(${pop(t, D * 0.55)})`}><rect x="-60" y="-30" width="120" height="60" rx="30" fill={YEL} /><text y="12" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>LOW</text></g>
  </g>);
}

/* 2 — Priya pitches; every sentence's wave curls up into a question mark */
function LVPriya({ T, t, dur }) {
  const D = Math.max(3, dur || 5), q = tw(t, D * 0.6, 0.5);
  return (<g>
    <rect x="120" y="640" width="420" height="300" rx="14" fill="#fff" /><rect x="120" y="640" width="420" height="50" rx="14" fill="#2B6E7A" />
    <text x="330" y="676" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="26" fill="#fff">PROJECT LEAD?</text>
    {[0, 1, 2].map((i) => <rect key={i} x="150" y={730 + i * 60} width={360 - i * 70} height="24" rx="12" fill="#C9C0AE" />)}
    <T2Bust who="priya" x={600} y={1300} s={0.68} T={T} mood={q > 0.5 ? 'nervous' : 'calm'} look={-12} />
    <Wave x={140} y={1120} w={330} pitch={1.6} a={30} T={T} col="#B3202A" end={q} sw={10} />
    <g transform={`translate(800 760) rotate(10) scale(${pop(t, D * 0.62, 0.35)})`}><circle r="80" fill="#B3202A" />
      <text y="38" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="110" fill="#fff">?</text></g>
  </g>);
}

/* 3 — 2012: the recording booth, "I URGE YOU TO VOTE FOR ME THIS NOVEMBER" */
function LVStudy({ T, t, dur }) {
  const D = Math.max(3, dur || 6), k = tw(t, D * 0.45, D * 0.4);
  const words = 'I URGE YOU TO VOTE FOR ME THIS NOVEMBER'.split(' ');
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#8E1820" />
    <rect x="160" y="900" width="652" height="640" rx="30" fill="#2A2F3A" />
    {[...Array(6)].map((_, r) => [...Array(5)].map((_, c) => <path key={r + '-' + c} d="M0 0 L40 40 L80 0 L120 40" fill="none" stroke="#3B4150" strokeWidth="8" transform={`translate(${190 + c * 120} ${940 + r * 95})`} />))}
    <Mic x={486} y={1200} s={1.1} />
    <g transform={`translate(486 750) scale(${pop(t, 0.2, 0.4)})`}><rect x="-120" y="-36" width="240" height="72" rx="36" fill={RED} />
      <circle cx="-80" cy="0" r="14" fill="#fff" opacity={0.5 + 0.5 * osc(T, 0.8)} /><text x="16" y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill="#fff">REC 2012</text></g>
    <g transform="translate(486 860)" opacity={k > 0 ? 1 : 0}>
      <text textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={YEL}>{words.slice(0, Math.min(5, Math.ceil(k * words.length))).join(' ')}</text>
      <text y="52" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={YEL}>{words.slice(5, Math.max(5, Math.ceil(k * words.length))).join(' ')}</text></g>
  </g>);
}

/* 4 — the slider: the same voice, nudged up and down */
function LVPitch({ T, t, dur }) {
  const D = Math.max(3, dur || 5), up = tw(t, D * 0.25, 0.5), dn = tw(t, D * 0.65, 0.5), p = 1 + 0.9 * up - 1.4 * dn;
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#1F5560" />
    <rect x="160" y="760" width="652" height="300" rx="24" fill="#123C44" />
    <Wave x={200} y={910} w={572} pitch={Math.max(0.5, p)} a={80} T={T} col={dn > 0.5 ? YEL : '#9FE8FF'} sw={14} />
    <g transform="translate(486 1200)"><rect x="-300" y="-12" width="600" height="24" rx="12" fill="#0E2C33" />
      <circle cx={-300 + 300 * cl(p / 1.9 * 2 - 1 + 1) * 0.5 + 0} cy="0" r="40" fill={dn > 0.5 ? YEL : '#9FE8FF'} />
      <text x="-300" y="80" fontFamily={BOLD} fontWeight="900" fontSize="32" fill="#fff">LOWER</text>
      <text x="300" y="80" textAnchor="end" fontFamily={BOLD} fontWeight="900" fontSize="32" fill="#fff">HIGHER</text></g>
    <T2Bust who="grace" x={780} y={1560} s={0.3} T={T} mood="calm" disc={false} look={-14} />
  </g>);
}

/* 5 — the vote: two ballot boxes, the LOW box fills up */
function LVVotes({ T, t, dur }) {
  const D = Math.max(3, dur || 6);
  return (<g>
    <Ballot x={270} y={1240} s={1.1} n={5 * tw(t, 0.4, D * 0.6)} label="HIGH" col="#9FE8FF" />
    <Ballot x={700} y={1240} s={1.1} n={9 * tw(t, 0.4, D * 0.6)} label="LOW" col={YEL} />
    {[...Array(6)].map((_, i) => { const r = ((T * 0.7 + i / 6) % 1); return <rect key={i} x={640 + (hsh(i) - 0.5) * 80} y={760 + r * 380} width="70" height="44" rx="4" fill="#fff" opacity={1 - r} transform={`rotate(${(hsh(i + 3) - 0.5) * 40} ${675} ${780 + r * 380})`} />; })}
    <g transform={`translate(486 1620)`} opacity={tw(t, D * 0.55, 0.4)}>
      <text textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff">MALE + FEMALE CANDIDATES</text></g>
  </g>);
}

/* 6 — traits: badges STRONG and COMPETENT pin onto a low wave */
function LVTraits({ T, t, dur }) {
  const D = Math.max(3, dur || 5);
  const badge = (x, y, txt, k, rot) => (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
    <circle r="120" fill={YEL} /><circle r="100" fill="none" stroke={INK} strokeWidth="6" strokeDasharray="10 10" />
    <text y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={txt.length > 8 ? 30 : 40} fill={INK}>{txt}</text></g>);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#B85A1E" />
    <Wave x={150} y={1150} w={672} pitch={0.6} a={90} T={T} col="#fff" sw={18} />
    {badge(300, 860, 'STRONGER', pop(t, D * 0.35), -8)}
    {badge(680, 900, 'COMPETENT', pop(t, D * 0.7), 8)}
    <T2Bust who="priya" x={486} y={1560} s={0.32} T={T} mood="happy" disc={false} />
  </g>);
}

/* 7 — the turn: it's a lab with headphones, not a ballot box; LAB TEST stamp */
function LVBut({ T, t, dur }) {
  const D = Math.max(3, dur || 5);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#264684" />
    <g transform="translate(486 1160)">
      <path d="M-170 40 C-170 -200 170 -200 170 40" fill="none" stroke="#2A2F3A" strokeWidth="40" />
      <rect x="-215" y="0" width="90" height="170" rx="40" fill={RED} /><rect x="125" y="0" width="90" height="170" rx="40" fill={RED} />
      <Wave x={-110} y={90} w={220} pitch={0.8} a={30} T={T} col={YEL} sw={10} /></g>
    <g transform={`translate(486 820) rotate(-8) scale(${pop(t, D * 0.25, 0.35)})`}>
      <rect x="-230" y="-70" width="460" height="140" rx="12" fill="none" stroke="#fff" strokeWidth="12" />
      <text y="26" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="70" fill="#fff">LAB TEST</text></g>
    <g transform={`translate(760 1500) scale(${pop(t, D * 0.7, 0.35)})`}><Ballot x={0} y={0} s={0.6} n={0} label="REAL?" col="#9FA7B5" />
      <path d="M-110 -50 L110 140 M110 -50 L-110 140" stroke={RED} strokeWidth="18" strokeLinecap="round" /></g>
  </g>);
}

/* 8 — payoff: Priya's sentence wave now lands down with a full stop; Grace nods */
function LVFix({ T, t, dur }) {
  const D = Math.max(3, dur || 6), k = tw(t, D * 0.35, 0.6);
  return (<g>
    <T2Bust who="priya" x={420} y={1290} s={0.75} T={T} mood={k > 0.5 ? 'smug' : 'calm'} look={8} />
    <Wave x={150} y={780} w={520} pitch={1} a={40} T={T} col={INK} end={-1.2 * k} sw={12} />
    <circle cx="700" cy={780 + 40 * 1.4 * k} r={22 * k} fill={INK} />
    <T2Bust who="grace" x={800} y={1330} s={0.36} T={T} mood={t > D * 0.6 ? 'happy' : 'calm'} disc={false} look={-14} />
  </g>);
}

Object.assign(window, { LVHook, LVPriya, LVStudy, LVPitch, LVVotes, LVTraits, LVBut, LVFix });
})();
