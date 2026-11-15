// art.jsx — "You Think You Know Them Better Than They Know You" (Ted type 2, Omar ep. 5 with Grace). 972×1728 card;
// captions sit in the top third, so subjects stay in the lower 60%. Pure functions of T and t. People via <T2Bust>.
// Illusion of asymmetric insight: Pronin, Kruger, Savitsky & Ross 2001 (JPSP) — six studies with friends and roommates;
// on average people believed they knew their peers better than their peers knew them. No percentages on screen.
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', NAVY = '#1F3B73', PURP = '#6A3FA0', ORG = '#E07A2E', GRN = '#4E9A6A', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
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
/* an open book; each page holds a small face (who) and a few text lines */
function Book({ x, y, s = 1, T, left = 'sam', right = 'priya', moodL = 'happy', moodR = 'nervous', flip = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-330 -200 Q-170 -240 0 -190 Q170 -240 330 -200 L330 210 Q170 170 0 220 Q-170 170 -330 210 Z" fill={INK} />
    <path d="M-310 -190 Q-160 -225 -8 -178 L-8 200 Q-160 160 -310 196 Z" fill="#fff" />
    <path d="M310 -190 Q160 -225 8 -178 L8 200 Q160 160 310 196 Z" fill="#F7F4EC" />
    <g transform="translate(-160 -40)"><T2Bust who={left} x={0} y={0} s={0.28} T={T} mood={moodL} disc={false} /></g>
    <g transform="translate(160 -40)"><T2Bust who={right} x={0} y={0} s={0.28} T={T} mood={moodR} ph={0.7} disc={false} /></g>
    <rect x={-310} y={60} width={302} height={140} fill="#fff" /><rect x={8} y={60} width={302} height={140} fill="#F7F4EC" />
    {[0, 1, 2].map((i) => <g key={i}><rect x={-270} y={80 + i * 34} width={220 - i * 40} height="14" rx="7" fill="#D6CFC0" /><rect x={50} y={80 + i * 34} width={220 - i * 30} height="14" rx="7" fill="#D6CFC0" /></g>)}
    {flip > 0 && <path d={`M8 -178 Q${160 - flip * 300} -230 ${310 - flip * 600} -190 L${310 - flip * 600} 196 Q${160 - flip * 300} 160 8 200 Z`} fill="#fff" stroke="#D6CFC0" strokeWidth="3" opacity={1 - flip} />}
  </g>);
}
function Check({ x, y, k = 1, col = GRN }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${k})`}><circle r="46" fill={col} /><path d="M-22 2 L-6 18 L24 -16" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" /></g>);
}

/* 1 — Omar holds an open book: his friends' faces are the pages */
function AIBook({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#2C4F92" />
    <T2Bust who="omar" x={486} y={1010} s={0.62} T={T} mood="smug" look={0} disc={false} />
    <Book x={486} y={1360} s={0.95} T={T} flip={cl((t - c1) / 0.6)} />
    {t > c1 && <Chip x={486} y={720} text="EASY READ" k={pop(t, c1)} size={30} rot={-4} />}
  </g>);
}

/* 2 — you too: a friend glances up from a phone; one look and a check mark lands on "UPSET?" */
function AIOneLook({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g>
    <circle cx="486" cy="1180" r="420" fill="#D8D0BF" />
    <T2Bust who="sam" x={486} y={1120} s={0.66} T={T} mood="sad" look={-6} disc={false} />
    <rect x={560} y={1390} width="150" height="240" rx="22" fill={INK} /><rect x={574} y={1404} width="122" height="200" rx="12" fill="#9FC6E8" />
    <g transform="translate(250 760)"><ellipse rx="110" ry="62" fill="#fff" stroke={INK} strokeWidth="10" /><circle cx={lerp(-30, 26, tw(t, 0.2, 0.5))} r="30" fill={INK} /></g>
    {[0, 1, 2].map((i) => <line key={i} x1={360} y1={760 + (i - 1) * 30} x2={lerp(360, 470, tw(t, 0.3 + i * 0.08, 0.4))} y2={lerp(760 + (i - 1) * 30, 900 + (i - 1) * 40, tw(t, 0.3 + i * 0.08, 0.4))} stroke={INK} strokeWidth="6" strokeDasharray="14 12" />)}
    <Chip x={720} y={760} text="UPSET?" k={pop(t, 0.6)} fill="#fff" size={32} />
    <Check x={850} y={760} k={pop(t, c3)} />
  </g>);
}

/* 3 — snapback: Omar behind frosted glass, only a blur; the friends squint and see nothing */
function AIFrosted({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#F2DA7A" />
    <T2Bust who="omar" x={486} y={1080} s={0.62} T={T} mood="smug" disc={false} />
    <rect x={150} y={650} width={672} height={1000} rx="26" fill="#EAF4FA" opacity="0.86" />
    {[...Array(24)].map((_, i) => <circle key={i} cx={180 + hsh(i) * 610} cy={680 + hsh(i + 9) * 940} r={20 + hsh(i + 30) * 50} fill="#fff" opacity="0.35" />)}
    <rect x={150} y={650} width={672} height={1000} rx="26" fill="none" stroke={INK} strokeWidth="12" />
    {t > c2 && <Chip x={486} y={1150} text="CAN'T READ ME" fill={RED} col="#fff" size={34} k={pop(t, c2)} rot={-3} />}
  </g>);
}

/* 4 — the study: PRONIN ET AL · 2001; two roommates on facing beds hold up answer cards */
function AIStudy({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g>
    <Chip x={486} y={690} text="PRONIN ET AL · 2001" fill={CREAM} size={30} k={pop(t, 0.05)} />
    <rect x={40} y={1420} width="400" height="120" rx="20" fill="#E9E4D8" /><rect x={530} y={1420} width="400" height="120" rx="20" fill="#E9E4D8" />
    <T2Bust who="priya" x={250} y={1130} s={0.42} T={T} mood="calm" look={10} disc={false} />
    <T2Bust who="sam" x={720} y={1130} s={0.42} T={T} mood="calm" look={-10} ph={0.5} disc={false} />
    {[[250, 0], [720, 0.15]].map(([x, d], i) => <g key={i} transform={`translate(${x} ${lerp(1700, 900, tw(t, 0.5 + d, 0.45))})`}>
      <rect x="-90" y="-110" width="180" height="200" rx="14" fill="#fff" stroke={INK} strokeWidth="6" />
      <text y="-60" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="21" fill={INK}>WHO KNOWS</text>
      <text y="-28" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="21" fill={INK}>WHOM?</text>
      {[0, 1].map((k) => <rect key={k} x="-60" y={10 + k * 36} width="120" height="16" rx="8" fill="#D6CFC0" />)}</g>)}
    {t > c3 && <Chip x={486} y={790} text="ROOMMATES" k={pop(t, c3)} size={32} />}
  </g>);
}

/* 5 — the result: two bars — "I KNOW YOU" towers over "YOU KNOW ME" */
function AIBars({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.5);
  const hi = 560 * tw(t, 0.3, 0.8), lo = 250 * tw(t, c3 - 0.2, 0.6);
  return (<g>
    <rect x={120} y={1560} width="732" height="12" rx="6" fill="#fff" />
    <rect x={190} y={1560 - hi} width="250" height={hi} rx="16" fill={YEL} />
    <rect x={532} y={1560 - lo} width="250" height={lo} rx="16" fill="#F2B8B8" />
    <text x={315} y={1620} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="32" fill="#fff">I KNOW YOU</text>
    <text x={657} y={1620} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="32" fill="#fff">YOU KNOW ME</text>
    <g transform={`translate(315 ${1560 - hi - 110})`}><T2Bust who="omar" x={0} y={0} s={0.24} T={T} mood="smug" disc={false} /></g>
    <g transform={`translate(657 ${1560 - lo - 110})`} opacity={cl(lo / 60)}><T2Bust who="omar" x={0} y={0} s={0.24} T={T} mood="nervous" ph={0.4} disc={false} /></g>
    <Chip x={486} y={720} text="ON AVERAGE" fill={CREAM} size={30} k={pop(t, 0.05)} />
  </g>);
}

/* 6 — the turn: two coffee spills. Theirs = "REVEALING!", yours = "ACCIDENT" */
function AISlips({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), c5 = bt(beats, 5, 2.6);
  const Spill = ({ x, k }) => (<g transform={`translate(${x} 1420)`}><g transform={`rotate(${lerp(0, 75, tw(k, 0, 0.4))} 0 -40)`}><rect x="-50" y="-140" width="100" height="120" rx="12" fill="#fff" stroke={INK} strokeWidth="7" /><path d="M50 -120 q40 10 0 60" fill="none" stroke={INK} strokeWidth="7" /></g>
    <ellipse cx={60} cy={30} rx={120 * tw(k, 0.25, 0.5)} ry={30 * tw(k, 0.25, 0.5)} fill="#7A4A2A" /></g>);
  return (<g>
    <line x1={486} y1={680} x2={486} y2={1640} stroke="#fff" strokeOpacity="0.5" strokeWidth="6" strokeDasharray="22 18" />
    <T2Bust who="sam" x={250} y={1000} s={0.36} T={T} mood="shocked" disc={false} />
    <T2Bust who="omar" x={720} y={1000} s={0.36} T={T} mood="nervous" ph={0.3} disc={false} />
    <Spill x={250} k={t - 0.1} /><Spill x={720} k={t - c2} />
    <Chip x={250} y={760} text="REVEALING!" fill={YEL} size={28} k={pop(t, 0.5)} rot={-4} />
    {t > c2 && <Chip x={720} y={760} text="ACCIDENT" fill="#fff" size={28} k={pop(t, c2 + 0.3)} rot={4} />}
    {t > c5 && <Chip x={486} y={1600} text="ASYMMETRIC INSIGHT" fill={YEL} size={30} k={pop(t, c5)} />}
  </g>);
}

/* 7 — self-proof: Omar starts a sentence; Priya finishes it */
function AIFinish({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.3);
  return (<g>
    <T2Bust who="omar" x={260} y={1150} s={0.44} T={T} mood={t > c3 ? 'shocked' : 'calm'} look={10} disc={false} />
    <T2Bust who="priya" x={720} y={1150} s={0.44} T={T} mood={t > c3 ? 'smug' : 'calm'} look={-10} ph={0.6} disc={false} />
    <g transform={`translate(270 790) scale(${pop(t, 0.2)})`}><rect x="-190" y="-60" width="380" height="120" rx="40" fill="#fff" /><path d="M-30 58 L-60 110 L10 58 Z" fill="#fff" />
      <text y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>I WAS GONNA…</text></g>
    {t > c3 && <g transform={`translate(700 880) scale(${pop(t, c3)})`}><rect x="-170" y="-60" width="340" height="120" rx="40" fill={YEL} /><path d="M30 58 L60 110 L-10 58 Z" fill={YEL} />
      <text y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>…SAY PIZZA?</text></g>}
  </g>);
}

/* 8 — outro: Grace holds up a mirror; in it Omar's face is an open book too */
function AIMirror({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4), c5 = bt(beats, 5, 2.4);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#2C4F92" />
    <T2Bust who="grace" x={260} y={1150} s={0.46} T={T} mood="happy" look={12} disc={false} />
    <g transform={`translate(700 1080) rotate(${osc(T, 3) * 3})`}>
      <rect x="-26" y="210" width="52" height="220" rx="20" fill={ORG} />
      <ellipse rx="190" ry="230" fill={ORG} /><ellipse rx="160" ry="200" fill="#CFE6F2" />
      <clipPath id="aimir"><ellipse rx="160" ry="200" /></clipPath>
      <g clipPath="url(#aimir)"><T2Bust who="omar" x={0} y={-20} s={0.5} T={T} mood={t > c3 ? 'shocked' : 'calm'} disc={false} />
        <g opacity={tw(t, 0.6, 0.5)}><Book x={0} y={140} s={0.36} T={T} left="omar" right="omar" moodL="nervous" moodR="smug" /></g></g></g>
    {t > c3 && <Chip x={486} y={720} text="WHO READS YOU BEST?" fill="#fff" size={28} k={pop(t, c3)} />}
    {t > c5 && <Chip x={486} y={1620} text="SEND IT" fill={YEL} size={32} k={pop(t, c5)} rot={-3} />}
  </g>);
}

Object.assign(window, { AIBook, AIOneLook, AIFrosted, AIStudy, AIBars, AISlips, AIFinish, AIMirror });
})();
