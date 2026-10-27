// art.jsx — "Ask What You'd Tell a Friend" (Ted type 2, Sam + Grace). 972×1728 card; captions sit in the top third,
// so subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene). People via <T2Bust>.
(function () {
const INK = '#141821', CREAM = '#E9E4D8', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';

/* 1 — Sam, stuck: a tangle of thoughts scribbles itself above his head */
function ArtStuck({ T, t }) {
  const n = 90, p = tw(t, 0.1, 2.2);
  let d = '', x = 486, y = 760;
  for (let i = 0; i < n * p; i++) { x = 486 + Math.sin(i * 0.9 + hsh(i) * 2) * (120 + hsh(i + 7) * 60); y = 760 + Math.cos(i * 1.3) * (60 + hsh(i + 3) * 40); d += (i ? ' L' : 'M') + x.toFixed(0) + ' ' + y.toFixed(0); }
  return (<g>
    <T2Bust who="sam" x={486} y={1230} T={T} mood="nervous" look={osc(T, 1.7) * 8} />
    <path d={d} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" transform={`rotate(${osc(T, 3) * 3} 486 760)`} />
    {[0, 1, 2].map((i) => <circle key={i} cx={420 + i * 50} cy={930 - i * 50} r={10 + i * 6} fill={INK} opacity={tw(t, 0.2 + i * 0.15, 0.2)} />)}
  </g>);
}

/* 2 — weeks of going in circles: arrows orbit, calendar flips */
function ArtCircles({ T, t }) {
  const wk = Math.min(4, 1 + Math.floor(t / 0.9));
  return (<g>
    <circle cx="486" cy="1180" r="400" fill="#D8D0BF" />
    <g transform={`rotate(${T * 70} 486 1150)`}>{[0, 1, 2].map((i) => (
      <g key={i} transform={`rotate(${i * 120} 486 1150)`}>
        <path d="M486 790 A360 360 0 0 1 790 960" fill="none" stroke="#1F3B73" strokeWidth="22" strokeLinecap="round" />
        <path d="M770 920 L820 990 L735 990 Z" fill="#1F3B73" transform="rotate(10 790 960)" /></g>))}</g>
    <T2Bust who="sam" x={486} y={1180} s={0.82} T={T} mood="sad" disc={false} />
    <g transform={`translate(170 760) rotate(-8) scale(${pop(t, 0.1)})`}>
      <rect x="-90" y="-80" width="180" height="170" rx="14" fill="#fff" />
      <rect x="-90" y="-80" width="180" height="50" rx="14" fill="#B3202A" />
      <text x="0" y="-44" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill="#fff">WEEK</text>
      <text x="0" y="62" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="96" fill={INK}>{wk}</text></g>
  </g>);
}

/* 3 — Grace, a retired therapist, with tea: "what would you tell a friend?" */
function ArtGrace({ T, t }) {
  return (<g>
    <T2Bust who="grace" x={486} y={1160} T={T} mood="smug" />
    <g transform={`translate(720 1500)`}>
      <path d="M-70 -60 L70 -60 L56 60 Q0 80 -56 60 Z" fill="#fff" /><path d="M70 -36 Q120 -30 112 10 Q104 40 64 30" fill="none" stroke="#fff" strokeWidth="16" />
      {[0, 1, 2].map((i) => { const p = ((T * 0.6 + i / 3) % 1); return <path key={i} d={`M${-30 + i * 30} -80 q-20 -30 0 -60 q20 -30 0 -60`} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity={Math.sin(p * Math.PI) * 0.8} transform={`translate(0 ${-p * 60})`} />; })}</g>
    <g transform={`translate(760 760) scale(${pop(t, 0.6)})`}>
      <circle r="110" fill="#FFD23F" /><text y="52" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="150" fill={INK}>?</text>
      <path d="M-60 80 L-110 150 L-10 100 Z" fill="#FFD23F" /></g>
  </g>);
}

/* 4 — Sam answers instantly: a two-step plan ticks itself */
function ArtAnswer({ T, t }) {
  const rows = ['TALK TO BOSS', 'THEN DECIDE'];
  return (<g>
    <T2Bust who="sam" x={360} y={1220} s={0.9} T={T} mood="happy" />
    <g transform={`translate(700 860) rotate(4) scale(${pop(t, 0.15)})`}>
      <rect x="-200" y="-150" width="400" height="300" rx="20" fill="#fff" />
      <rect x="-200" y="-150" width="400" height="64" rx="20" fill="#1F3B73" />
      <text x="0" y="-106" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="32" fill="#fff">ADVICE FOR A FRIEND</text>
      {rows.map((r, i) => { const k = tw(t, 0.6 + i * 0.7, 0.3); return (<g key={i} transform={`translate(-160 ${-10 + i * 100})`}>
        <rect x="0" y="-34" width="56" height="56" rx="10" fill="none" stroke={INK} strokeWidth="7" />
        <path d="M8 -6 L26 14 L60 -40" fill="none" stroke="#3E8E5A" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset={100 - 100 * k} />
        <text x="80" y="6" fontFamily={BOLD} fontWeight="900" fontSize="36" fill={INK}>{r}</text></g>); })}</g>
  </g>);
}

/* 5 — the study: reasoning about YOU vs A FRIEND, the friend's bar is taller */
function ArtStudy({ T, t }) {
  const g = tw(t, 0.4, 1.6);
  const col = (x, who, mood, v, lab, c) => (<g>
    <T2Bust who={who} x={x} y={1440} s={0.5} T={T} mood={mood} disc={false} />
    <rect x={x - 70} y={1180 - 420 * v * g} width="140" height={420 * v * g} rx="16" fill={c} />
    <text x={x} y={1240} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill="#fff">{lab}</text></g>);
  return (<g>
    <rect x="96" y="1180" width="780" height="8" rx="4" fill="#fff" opacity="0.5" />
    {col(290, 'sam', 'nervous', 0.38, 'YOUR PROBLEM', '#F4A7B9')}
    {col(682, 'leo', 'happy', 0.9, "A FRIEND'S", '#FFD23F')}
    <text x="486" y="660" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill="#fff" opacity={tw(t, 0.2, 0.4)}>WISE REASONING</text>
  </g>);
}

/* 6 — the turn: Sam looks at his own problem through a frame, from outside → bars level */
function ArtOutside({ T, t }) {
  const k = tw(t, 1.0, 1.2);
  return (<g>
    <circle cx="486" cy="1200" r="400" fill="#7E55B5" />
    <g transform={`translate(590 1110) rotate(${-4 + osc(T, 3) * 1.5})`}>
      <rect x="-220" y="-250" width="440" height="460" rx="12" fill="#C9A63A" /><rect x="-190" y="-220" width="380" height="400" fill="#264684" />
      <g transform="translate(-486 -1150)"><T2Bust who="sam" x={486} y={1110} s={0.55} T={T} mood="nervous" disc={false} /></g>
      <text y="250" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill="#fff">"SAM"</text></g>
    <T2Bust who="sam" x={230} y={1480} s={0.62} T={T} mood={k > 0.5 ? 'happy' : 'calm'} look={14} disc={false} />
    <g transform="translate(486 650)">{[['YOU', 0.38 + 0.52 * k, '#F4A7B9'], ['FRIEND', 0.9, '#FFD23F']].map(([l, v, c], i) => (
      <g key={i} transform={`translate(-300 ${i * 90 - 40})`}><text x="0" y="22" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff">{l}</text>
        <rect x="170" y="-10" width={430 * v} height="44" rx="22" fill={c} /></g>))}</g>
  </g>);
}

/* 7 — name it: Solomon's crown */
function ArtSolomon({ T, t }) {
  const p = pop(t, 0.2, 0.45);
  return (<g>
    <T2Bust who="sam" x={486} y={1250} T={T} mood="smug" />
    <g transform={`translate(486 ${1010 - 40 * (1 - p) + osc(T, 1.6) * 6}) scale(${p})`}>
      <path d="M-150 60 L-170 -80 L-90 -10 L0 -120 L90 -10 L170 -80 L150 60 Z" fill="#FFD23F" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
      <rect x="-155" y="40" width="310" height="44" rx="10" fill="#F2B705" stroke={INK} strokeWidth="8" />
      {[-90, 0, 90].map((x, i) => <circle key={i} cx={x} cy={62} r="12" fill={['#B3202A', '#2B6E7A', '#B3202A'][i]} />)}</g>
    {[...Array(10)].map((_, i) => { const a = hsh(i) * TAU, r = 260 + hsh(i + 9) * 140, tt = (T * 0.8 + hsh(i + 4)) % 1;
      return <path key={i} d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill="#fff" opacity={Math.sin(tt * Math.PI)} transform={`translate(${486 + Math.cos(a) * r} ${980 + Math.sin(a) * r * 0.6}) scale(${0.8 + tt})`} />; })}
  </g>);
}

/* 8 — outro: Sam and his reflection, thumbs up */
function ArtMirror({ T, t }) {
  const k = tw(t, 0.8, 0.4);
  return (<g>
    <g transform="translate(486 1180)"><ellipse rx="250" ry="330" fill="#C9A63A" /><ellipse rx="220" ry="300" fill="#9FC3E6" />
      <path d="M-120 -200 L-60 -240 M-160 -120 L-40 -210" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity="0.6" /></g>
    <g transform="translate(972 0) scale(-1 1)"><T2Bust who="sam" x={486} y={1180} s={0.62} T={T} mood="happy" disc={false} /></g>
    <g transform={`translate(${720} ${1420 - 60 * k}) scale(${0.4 + 0.6 * k})`} opacity={k}>
      <rect x="-40" y="-20" width="90" height="110" rx="24" fill="#F1C3A0" /><rect x="-26" y="-110" width="44" height="110" rx="22" fill="#F1C3A0" /></g>
    <text x="486" y="1640" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill="#fff" opacity={tw(t, 0.3, 0.4)}>BE YOUR OWN FRIEND</text>
  </g>);
}

Object.assign(window, { ArtStuck, ArtCircles, ArtGrace, ArtAnswer, ArtStudy, ArtOutside, ArtSolomon, ArtMirror });
})();
