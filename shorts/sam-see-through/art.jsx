// art.jsx — "They Can't See Your Nerves" (Ted type 2, Sam + Grace). 972×1728 card; captions sit in the top third,
// so subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene). People via <T2Bust>.
// Illusion of transparency: Gilovich, Savitsky & Medvec 1998; Savitsky & Gilovich 2003 (impromptu speeches).
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';

/* a flat cartoon eye that opens with k */
function Eye({ x, y, s = 1, k = 1, look = 0 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${s} ${s * k})`}>
    <path d="M-70 0 Q0 -60 70 0 Q0 60 -70 0 Z" fill="#fff" /><circle cx={look * 18} r="24" fill={INK} /><circle cx={look * 18 + 8} cy="-8" r="7" fill="#fff" /></g>);
}
/* a hand with a jitter */
function Hand({ x, y, s = 1, T = 0, shake = 1, skin = '#F1C3A0', rot = 0 }) {
  const j = shake * Math.sin(T * 47) * 6;
  return (<g transform={`translate(${x + j} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-60" y="-40" width="120" height="110" rx="40" fill={skin} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-58 + i * 30} y="-100" width="26" height="80" rx="13" fill={skin} />)}
    <rect x="-60" y="60" width="120" height="120" fill="#E9E4D8" />
    {shake > 0 && [-1, 1].map((sd) => <path key={sd} d={`M${sd * 90} -60 q${sd * 14} 20 0 40 q${-sd * 14} 20 0 40`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />)}</g>);
}
/* heart that thumps at bpm */
function Heart({ x, y, s = 1, T = 0, bpm = 140, col = RED }) {
  const ph = (T * bpm / 60) % 1, k = 1 + 0.14 * Math.exp(-ph * 9);
  return (<g transform={`translate(${x} ${y}) scale(${s * k})`}><path d="M0 70 C-140 -20 -90 -130 0 -60 C90 -130 140 -20 0 70 Z" fill={col} /></g>);
}
/* podium with mic */
function Podium({ x, y, s = 1, label = '', mic = true }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {mic && <g><rect x="-10" y="-220" width="14" height="150" fill="#5B6474" transform="rotate(-18 0 -150)" /><rect x="-40" y="-290" width="44" height="80" rx="22" fill="#2A2F3A" transform="rotate(-18 0 -150)" /></g>}
    <path d="M-200 -80 L200 -80 L170 300 L-170 300 Z" fill="#6B4129" /><rect x="-220" y="-100" width="440" height="40" rx="10" fill="#8A5A3C" />
    {label && <text y="120" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill={CREAM}>{label}</text>}</g>);
}
/* a 0–10 style slider with a fill; no numbers (direction only) */
function Gauge({ x, y, w = 640, v = 0, col = YEL, label, sub }) {
  return (<g transform={`translate(${x} ${y})`}>
    <text x="0" y="-30" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>{label}</text>
    {sub && <text x="0" y="-74" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={INK} opacity="0.6">{sub}</text>}
    <rect x="0" y="0" width={w} height="56" rx="28" fill="#fff" opacity="0.9" /><rect x="0" y="0" width={Math.max(56, w * v)} height="56" rx="28" fill={col} />
    <text x="0" y="100" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={INK} opacity="0.6">CALM</text>
    <text x={w} y="100" textAnchor="end" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={INK} opacity="0.6">VERY NERVOUS</text></g>);
}

/* 1 — Sam, nervous, shaking hands; eyes open all around him */
function STHook({ T, t, dur }) {
  const D = Math.max(2.5, dur || 4), EYES = [[150, 700], [820, 690], [260, 560], [700, 540], [110, 900], [860, 900], [480, 620]];
  return (<g>
    {EYES.map(([x, y], i) => <Eye key={i} x={x} y={y} s={0.8} k={tw(t, D * 0.55 + i * 0.06, 0.25)} look={(486 - x) / 400} />)}
    <T2Bust who="sam" x={486} y={1230} T={T} mood="nervous" />
    <Hand x={250} y={1560} s={0.9} T={T} rot={-10} /><Hand x={722} y={1560} s={0.9} T={T + 0.3} rot={10} />
  </g>);
}

/* 2 — racing heart and a wobbly voice wave; Sam sweats */
function STSetup({ T, t, dur }) {
  const D = Math.max(3, dur || 5);
  const wave = [...Array(61)].map((_, i) => { const u = i / 60; return [600 + u * 300, 900 + Math.sin(u * 30 + T * 10) * 30 * Math.sin(u * Math.PI) + Math.sin(T * 23 + i) * 6]; });
  return (<g>
    <T2Bust who="sam" x={360} y={1260} s={0.8} T={T} mood={t > D * 0.6 ? 'shocked' : 'nervous'} />
    <Heart x={760} y={700} s={1.1 * pop(t, 0.1)} T={T} bpm={150} />
    <g opacity={tw(t, D * 0.25, 0.3)}><path d={'M' + wave.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L')} fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" /></g>
    {[0, 1, 2].map((i) => { const k = ((T * 0.9 + i / 3) % 1); return <path key={i} d="M0 -26 Q20 4 0 14 Q-20 4 0 -26 Z" fill="#7FC8F8" transform={`translate(${210 + i * 40} ${1000 + k * 120})`} opacity={1 - k} />; })}
  </g>);
}

/* 3 — the study: an empty podium, a stopwatch, "2003 · SPEAK NOW" */
function STStudy({ T, t, dur }) {
  const D = Math.max(3, dur || 6), k = cl(t / D);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#8E1820" />
    <T2Bust who="leo" x={486} y={1050} s={0.62} T={T} mood="nervous" disc={false} />
    <Podium x={486} y={1330} s={1.05} label="SPEAK NOW" mic={false} />
    <g transform={`translate(800 780) scale(${pop(t, 0.3)})`}><circle r="95" fill={CREAM} /><circle r="78" fill="#fff" />
      <rect x="-14" y="-125" width="28" height="30" rx="6" fill={CREAM} />
      <path d={`M0 0 L${Math.sin(k * TAU) * 60} ${-Math.cos(k * TAU) * 60}`} stroke={RED} strokeWidth="9" strokeLinecap="round" /><circle r="9" fill={INK} /></g>
    <g transform={`translate(190 780) scale(${pop(t, 0.15)})`}><rect x="-110" y="-40" width="220" height="80" rx="40" fill={YEL} />
      <text y="16" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill={INK}>2003</text></g>
  </g>);
}

/* 4 — two clipboards: the speaker rates himself, the audience rates him */
function STRatings({ T, t, dur }) {
  const D = Math.max(3, dur || 5);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#C9A63A" opacity="0.6" />
    <g opacity={tw(t, 0.1, 0.4)}><Gauge x={160} y={820} v={0} label="SPEAKER: I LOOKED…" /></g>
    <g opacity={tw(t, D * 0.55, 0.4)}><Gauge x={160} y={1090} v={0} col="#7FC8F8" label="AUDIENCE: HE LOOKED…" /></g>
    {[0, 1, 2, 3, 4].map((i) => <g key={i} opacity={tw(t, D * 0.55 + i * 0.08, 0.3)}><T2Bust who={['grace', 'omar', 'priya', 'leo', 'grace'][i]} x={170 + i * 158} y={1440} s={0.26} T={T} ph={i * 0.4} mood="calm" disc={false} /></g>)}
  </g>);
}

/* 5 — the turn: the speaker's gauge shoots up, the audience's stays much lower */
function STTurn({ T, t, dur }) {
  const D = Math.max(3, dur || 5), a = tw(t, 0.2, 0.8), b = tw(t, D * 0.35, 0.8);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#1F5560" />
    <rect x="110" y="700" width="752" height="560" rx="30" fill={CREAM} />
    <Gauge x={160} y={850} v={0.78 * a} col={RED} label="SPEAKER THOUGHT" sub="HOW NERVOUS I LOOKED" />
    <Gauge x={160} y={1110} v={0.5 * b} col="#7FC8F8" label="AUDIENCE SAW" sub="HOW NERVOUS HE LOOKED" />
    {b > 0.9 && <g transform={`translate(${160 + 640 * 0.64} 1030) scale(${pop(t, D * 0.35 + 0.8)})`}><rect x="-70" y="-34" width="140" height="68" rx="34" fill={YEL} />
      <text y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="38" fill={INK}>GAP</text></g>}
    <T2Bust who="sam" x={486} y={1560} s={0.4} T={T} mood="shocked" disc={false} />
  </g>);
}

/* 6 — name it: Sam behind a pane of frosted glass; he thinks it's clear, it isn't */
function STName({ T, t, dur }) {
  const D = Math.max(2.5, dur || 4), frost = tw(t, D * 0.35, 0.6);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#56328A" />
    <T2Bust who="sam" x={486} y={1200} s={0.9} T={T} mood="nervous" disc={false} />
    <rect x="150" y="760" width="672" height="900" rx="20" fill="#fff" opacity={0.12 + 0.68 * frost} />
    {[...Array(26)].map((_, i) => <circle key={i} cx={170 + hsh(i) * 630} cy={780 + hsh(i + 30) * 860} r={8 + hsh(i + 60) * 20} fill="#fff" opacity={0.35 * frost} />)}
    <rect x="150" y="760" width="672" height="900" rx="20" fill="none" stroke={CREAM} strokeWidth="16" />
    <path d="M200 820 L330 950 M240 820 L420 1000" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity={0.7 * (1 - frost)} />
  </g>);
}

/* 7 — bonus: a note card "THEY CAN'T SEE IT", then stars light up over the speech */
function STBonus({ T, t, dur }) {
  const D = Math.max(3, dur || 5);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#B85E1F" />
    <g transform={`translate(486 860) rotate(-4) scale(${pop(t, 0.2)})`}><rect x="-300" y="-110" width="600" height="220" rx="14" fill="#fff" />
      {[0, 1, 2, 3].map((i) => <line key={i} x1="-270" y1={-60 + i * 44} x2="270" y2={-60 + i * 44} stroke="#C9C0AE" strokeWidth="4" />)}
      <text y="-5" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="46" fill={INK}>THEY CAN'T</text>
      <text y="50" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="46" fill={RED}>SEE IT (MUCH)</text></g>
    <Podium x={486} y={1430} s={0.8} />
    <T2Bust who="sam" x={486} y={1220} s={0.45} T={T} mood={t > D * 0.6 ? 'happy' : 'calm'} disc={false} />
    {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${246 + i * 120} 1060) scale(${pop(t, D * 0.6 + i * 0.1)})`}>
      <path d="M0 -40 L12 -12 L42 -12 L18 6 L27 36 L0 18 L-27 36 L-18 6 L-42 -12 L-12 -12 Z" fill={YEL} /></g>)}
  </g>);
}

/* 8 — outro: Grace beside a calmer Sam; his heart slows */
function STOutro({ T, t, dur }) {
  const D = Math.max(3, dur || 5), calm = tw(t, D * 0.3, 0.8);
  return (<g>
    <T2Bust who="grace" x={250} y={1340} s={0.55} T={T} mood="happy" ph={0.5} />
    <T2Bust who="sam" x={640} y={1230} s={0.8} T={T} mood={calm > 0.5 ? 'happy' : 'calm'} />
    <Heart x={830} y={760} s={0.6} T={T} bpm={150 - 80 * calm} col={calm > 0.5 ? '#E07A2E' : RED} />
    <g opacity={tw(t, D * 0.6, 0.4)}><rect x="186" y="700" width="420" height="80" rx="40" fill={YEL} />
      <text x="396" y="754" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill={INK}>SAVE FOR LATER</text></g>
  </g>);
}

Object.assign(window, { STHook, STSetup, STStudy, STRatings, STTurn, STName, STBonus, STOutro });
})();
