// art.jsx — "Asking for Help Looks Braver Than You Think" (Ted type 2, Omar ep. 4 with Grace). 972×1728 card; captions
// sit in the top third, so subjects stay in the lower 60%. Pure functions of T and t. People via <T2Bust>.
// Beautiful mess effect: Bruk, Scholl & Bless 2018 (JPSP) — people judge their own vulnerability more negatively than
// the same vulnerability shown by others. No numbers on screen.
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', NAVY = '#1F3B73', PURP = '#6A3FA0', TAU = Math.PI * 2;
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
/* rounded speech bubble with a tail at the bottom-left; text is drawn by the caller */
function Bubble({ x, y, w = 420, h = 130, k = 1, fill = '#fff', children }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${k})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${-w / 2 + 60} ${h / 2 - 4} L${-w / 2 + 40} ${h / 2 + 50} L${-w / 2 + 120} ${h / 2 - 4} Z`} fill={fill} />{children}</g>);
}
function Cup({ x, y, s = 1, fill = CREAM }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-50 -60 L50 -60 L40 40 Q0 56 -40 40 Z" fill={fill} />
    <path d="M48 -40 Q86 -36 80 -6 Q74 18 44 14" fill="none" stroke={fill} strokeWidth="12" /><ellipse cx="0" cy="-60" rx="50" ry="12" fill="#6B4129" /></g>);
}
function Heart({ x, y, s = 1, fill = RED }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 30 C-60 -10 -50 -60 -18 -60 C-6 -60 0 -50 0 -42 C0 -50 6 -60 18 -60 C50 -60 60 -10 0 30 Z" fill={fill} />;
}
function Table({ y = 1500 }) {
  return (<g><rect x="40" y={y} width="892" height="40" rx="20" fill="#8A5A3C" /><rect x="60" y={y + 40} width="852" height="200" fill="#6B4129" /></g>);
}

/* 1 — café: Omar opens his mouth to say "I need help"; the words type in, then get backspaced; Grace waits */
function BMHook({ T, t, dur, beats }) {
  const c2 = bt(beats, 2, 1.3), full = "I need help.", D = Math.max(2.4, dur || 3);
  const typed = t < c2 ? Math.floor(full.length * tw(t, 0.2, 0.9)) : Math.max(4, Math.floor(full.length * (1 - tw(t, c2 + 0.4, 0.8))));
  return (<g>
    <circle cx="486" cy="1260" r="440" fill="#2C4F92" />
    <T2Bust who="grace" x={790} y={1250} s={0.5} T={T} mood="calm" look={-6} ph={0.4} disc={false} />
    <T2Bust who="omar" x={330} y={1180} s={0.62} T={T} mood="nervous" look={6} />
    <Table y={1530} /><Cup x={600} y={1500} s={0.9} /><Cup x={860} y={1500} s={0.8} fill="#F09A4E" />
    <Bubble x={540} y={820} w={480} h={140} k={pop(t, 0.1)}>
      <text x="-200" y="18" fontFamily={BOLD} fontWeight="900" fontSize="54" fill={INK}>{full.slice(0, Math.max(0, typed))}</text>
      {osc(T, 0.8) > 0 && <rect x={-200 + typed * 30} y="-28" width="6" height="56" fill={RED} />}</Bubble>
  </g>);
}

/* 2 — "all good": Omar gives a thumbs-up sign while water rises around him */
function BMYou({ T, t, dur }) {
  const lvl = 1560 - 250 * tw(t, 0.2, Math.max(1.5, (dur || 3) - 0.6));
  return (<g>
    <circle cx="486" cy="1180" r="420" fill={TEAL} opacity="0.85" />
    <T2Bust who="omar" x={486} y={1150} s={0.6} T={T} mood="happy" look={0} disc={false} />
    <g transform={`translate(760 ${960 + osc(T, 1.2) * 8}) rotate(8)`}><rect x="-130" y="-60" width="260" height="120" rx="18" fill={YEL} />
      <text y="16" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="48" fill={INK}>ALL GOOD!</text>
      <rect x="-8" y="60" width="16" height="200" fill="#8A5A3C" /></g>
    <path d={`M0 ${lvl} ${[...Array(13)].map((_, i) => `Q${i * 81 + 40} ${lvl + (i % 2 ? 22 : -22) + osc(T, 1.4, i * 0.2) * 8} ${(i + 1) * 81} ${lvl}`).join(' ')} L972 1728 L0 1728 Z`} fill="#2C4F92" opacity="0.92" />
    {[0, 1, 2].map((i) => { const p = (T * 0.6 + i / 3) % 1; return <circle key={i} cx={380 + i * 110} cy={lvl - p * 160} r={10 + i * 3} fill="none" stroke="#fff" strokeWidth="4" opacity={1 - p} />; })}
  </g>);
}

/* 3 — snapback: a BRAVE badge pins onto Omar's chest; Grace looks on approvingly */
function BMSnap({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4), k = pop(t, c3 - 0.1, 0.4);
  return (<g>
    <T2Bust who="grace" x={800} y={1290} s={0.42} T={T} mood="happy" look={-8} ph={0.3} disc={false} />
    <T2Bust who="omar" x={430} y={1160} s={0.66} T={T} mood={t > c3 ? 'shocked' : 'nervous'} look={4} />
    {k > 0 && <g transform={`translate(560 1470) rotate(-8) scale(${k})`}><circle r="110" fill={YEL} /><circle r="92" fill="none" stroke={INK} strokeWidth="6" strokeDasharray="10 10" />
      <text y="18" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="48" fill={INK}>BRAVE</text>
      <path d="M-60 100 L-80 200 L-30 170 L0 210 L0 110 Z" fill={RED} /><path d="M60 100 L80 200 L30 170 L0 210 L0 110 Z" fill={RED} /></g>}
  </g>);
}

/* 4 — the study: scenario cards slide in; journal chip */
function BMStudy({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.8);
  const cards = [['ADMIT A MISTAKE', RED, c3], ['SAY "I LOVE YOU" FIRST', PURP, 0.5], ['ASK FOR HELP', NAVY, 1.0]];
  return (<g>
    <Chip x={486} y={700} text="J. PERS. SOC. PSYCH · 2018" k={pop(t, 0)} size={30} />
    {cards.map(([txt, col, s0], i) => { const k = tw(t, s0, 0.45), y = 880 + i * 210;
      return (<g key={i} transform={`translate(${486 + (1 - k) * 700} ${y}) rotate(${(i - 1) * 2})`} opacity={k}><rect x="-360" y="-80" width="720" height="160" rx="28" fill="#fff" />
        <rect x="-360" y="-80" width="30" height="160" rx="14" fill={col} /><text x="-300" y="16" fontFamily={BOLD} fontWeight="900" fontSize="46" fill={INK}>{txt}</text>
        <circle cx="300" cy="0" r="34" fill="none" stroke={INK} strokeWidth="6" />{i === 0 && t > c3 + 0.3 && <path d="M282 0 L296 16 L322 -18" fill="none" stroke={RED} strokeWidth="9" strokeLinecap="round" />}</g>); })}
    <g transform="translate(486 1560)"><rect x="-150" y="-40" width="300" height="80" rx="16" fill={TEAL} stroke="#fff" strokeWidth="4" /><text y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill="#fff">ME · OR · THEM</text></g>
  </g>);
}

/* 5 — split: left "ME" (mirror) labelled WEAK, right "THEM" labelled BRAVE */
function BMSplit({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2);
  return (<g>
    <rect x="0" y="640" width="486" height="1088" fill="#8E1820" /><rect x="486" y="640" width="486" height="1088" fill="#2C4F92" opacity={tw(t, c2 - 0.3, 0.4)} />
    <ellipse cx="243" cy="1150" rx="200" ry="290" fill="#D8E6F0" /><ellipse cx="243" cy="1150" rx="200" ry="290" fill="none" stroke="#8A5A3C" strokeWidth="18" />
    <T2Bust who="omar" x={243} y={1110} s={0.42} T={T} mood="sad" look={0} disc={false} />
    <Chip x={243} y={760} text="ME" fill={CREAM} size={36} k={pop(t, 0)} />
    <Chip x={243} y={1520} text="WEAK" fill={INK} col={RED} size={40} k={pop(t, 0.4)} />
    {t > c2 - 0.2 && <g><T2Bust who="omar" x={729} y={1150} s={0.42} T={T} mood="happy" look={0} disc={false} />
      <Chip x={729} y={760} text="THEM" fill={CREAM} size={36} k={pop(t, c2 - 0.2)} />
      <Chip x={729} y={1520} text="BRAVE" fill={YEL} size={40} k={pop(t, c2 + 0.2)} />
      {[0, 1, 2].map((i) => <Heart key={i} x={620 + i * 110} y={900 - ((T * 60 + i * 50) % 160)} s={0.5} fill={YEL} />)}</g>}
  </g>);
}

/* 6 — name it: a messy scribble draws itself, then a heart is found inside it */
function BMName({ T, t }) {
  const d = 'M300 1200 C360 900 620 980 560 1150 C500 1320 300 1260 380 1100 C460 940 760 1060 660 1260 C600 1380 420 1380 460 1240 C500 1100 700 1140 640 1300';
  const draw = tw(t, 0.1, 1.2), hk = pop(t, 1.0, 0.5);
  return (<g>
    <circle cx="486" cy="1180" r="420" fill="#8A5FC4" opacity="0.8" />
    <path d={d} fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" strokeDasharray="3000" strokeDashoffset={3000 * (1 - draw)} />
    {hk > 0 && <g transform={`translate(486 1180) scale(${hk * (1 + 0.04 * osc(T, 0.9))})`}><Heart x={0} y={40} s={3.2} fill={YEL} /></g>}
  </g>);
}

/* 7 — self-proof: a friend's message "honestly... I'm struggling", Omar reads it and replies with a heart */
function BMProof({ T, t, beats }) {
  const c7 = bt(beats, 7, 3.2);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#F09A4E" />
    <g transform="translate(640 1060) rotate(4)"><rect x="-230" y="-380" width="460" height="760" rx="56" fill={INK} /><rect x="-205" y="-345" width="410" height="690" rx="34" fill="#F7F4EC" />
      <Bubble x={-10} y={-200} w={340} h={150} k={pop(t, 0.2)} fill="#DDD6C8"><text x="-150" y="-10" fontFamily={BOLD} fontWeight="800" fontSize="30" fill={INK}>honestly...</text><text x="-150" y="34" fontFamily={BOLD} fontWeight="800" fontSize="30" fill={INK}>I'm struggling</text></Bubble>
      {t > c7 - 0.2 && <g transform={`translate(90 40) scale(${pop(t, c7 - 0.2)})`}><rect x="-110" y="-60" width="220" height="120" rx="40" fill={TEAL} /><Heart x={0} y={10} s={0.9} fill="#fff" /></g>}</g>
    <T2Bust who="omar" x={290} y={1300} s={0.5} T={T} mood={t > c7 ? 'happy' : 'calm'} look={8} disc={false} />
  </g>);
}

/* 8 — outro: Omar and Grace at the café, both smiling; question chip, then send chip */
function BMOutro({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.4), c5 = bt(beats, 5, 2.8);
  return (<g>
    <circle cx="486" cy="1260" r="440" fill="#2C4F92" />
    <T2Bust who="omar" x={320} y={1170} s={0.58} T={T} mood="happy" look={6} />
    <T2Bust who="grace" x={720} y={1210} s={0.54} T={T} mood={t > 0.6 ? 'happy' : 'calm'} look={-6} ph={0.4} disc={false} />
    <Table y={1530} /><Cup x={560} y={1500} s={0.9} /><Cup x={860} y={1500} s={0.8} fill="#F09A4E" />
    {t > 0.6 && t < c2 + 0.2 && <Heart x={720} y={900 - (t - 0.6) * 80} s={0.8} fill={YEL} />}
    {t > c2 && <Chip x={486} y={760} text="'I'M FINE' PERSON?" k={pop(t, c2)} fill={YEL} size={38} />}
    {t > c5 && <Chip x={486} y={860} text="SEND IT TO THAT FRIEND" k={pop(t, c5)} fill={RED} col="#fff" size={32} />}
  </g>);
}

Object.assign(window, { BMHook, BMYou, BMSnap, BMStudy, BMSplit, BMName, BMProof, BMOutro });
})();
