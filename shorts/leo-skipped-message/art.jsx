// art.jsx — "Why a Skipped Message Hurts So Much" (Ted type 2, Leo ep. 8 with Priya). 972×1728 card; captions sit in
// the top third, so subjects stay in the lower 60%. Pure functions of T and t. People via <T2Bust>.
// Ostracism: Williams, Cheung & Choi 2000 (JPSP) — 1,486 people from 62 countries played Cyberball online; a few minutes
// of exclusion lowered belonging and self-esteem and left them sad and angry. Eisenberger, Lieberman & Williams 2003
// (Science) — exclusion raised dACC activity, a region tied to the distress of physical pain.
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
/* a phone; children drawn in screen space (screen 0..420 × 0..760 from its top-left) */
function Phone({ x, y, s = 1, rot = 0, children }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-240" y="-430" width="480" height="860" rx="56" fill={INK} />
    <rect x="-210" y="-380" width="420" height="760" rx="30" fill="#F7F4EC" />
    <rect x="-60" y="-412" width="120" height="16" rx="8" fill="#2a2f3a" />
    <g transform="translate(-210 -380)">{children}</g></g>);
}
/* chat bubble in phone space; mine = right-aligned */
function Msg({ y, text, mine, k = 1, dim = false, who }) {
  if (k <= 0) return null;
  const w = Math.max(150, text.length * 17 + 50), x = mine ? 400 - w : (who ? 80 : 20);
  return (<g opacity={cl(k * 3)} transform={`translate(0 ${(1 - Easing.easeOutCubic(cl(k))) * 30})`}>
    {who && !mine && <circle cx={44} cy={y + 30} r="24" fill={who} />}
    <rect x={x} y={y} width={w} height="62" rx="26" fill={mine ? (dim ? '#B9C3CF' : '#3F7FD0') : '#E2DCCD'} />
    <text x={x + w / 2} y={y + 41} textAnchor="middle" fontFamily={BOLD} fontWeight="800" fontSize="26" fill={mine ? '#fff' : INK}>{text}</text></g>);
}
/* a round avatar token with a face; lit 0..1 */
function Avatar({ x, y, r = 80, col, k = 1, sad = 0, label }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${k})`}><circle r={r} fill={col} opacity={lerp(1, 0.45, sad)} />
    <circle cx={-r * 0.3} cy={-r * 0.1} r={r * 0.11} fill={INK} /><circle cx={r * 0.3} cy={-r * 0.1} r={r * 0.11} fill={INK} />
    <path d={sad > 0.5 ? `M${-r * 0.3} ${r * 0.42} Q0 ${r * 0.22} ${r * 0.3} ${r * 0.42}` : `M${-r * 0.3} ${r * 0.25} Q0 ${r * 0.48} ${r * 0.3} ${r * 0.25}`} fill="none" stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />
    {label && <text y={r + 50} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill="#fff">{label}</text>}</g>);
}
function Ball({ x, y, r = 30 }) {
  return (<g><circle cx={x} cy={y} r={r} fill="#fff" /><path d={`M${x - r} ${y} Q${x} ${y - r * 0.6} ${x + r} ${y}`} fill="none" stroke={RED} strokeWidth="5" /></g>);
}
/* ball thrown between two avatars along an arc; p 0..1 */
const arc = (a, b2, p, h = 160) => [lerp(a[0], b2[0], p), lerp(a[1], b2[1], p) - Math.sin(p * Math.PI) * h];

/* 1 — the group chat: everyone replies to each other, Leo's message sits there, skipped */
function GCChat({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#2C4F92" />
    <Phone x={560} y={1120} s={0.82} rot={4}>
      <rect x="0" y="0" width="420" height="90" fill="#E2DCCD" /><text x="210" y="58" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>THE SQUAD (6)</text>
      <Msg y={120} text="who's in for friday?" who={ORG} k={tw(t, 0.0, 0.3)} />
      <Msg y={210} text="me!! 🎉" mine k={tw(t, 0.2, 0.3)} dim={t > c1} />
      <Msg y={300} text="omg yes" who={PURP} k={tw(t, c1, 0.3)} />
      <Msg y={390} text="same, 8pm?" who={TEAL} k={tw(t, c1 + 0.3, 0.3)} />
      <Msg y={480} text="perfect 🙌" who={ORG} k={tw(t, c1 + 0.6, 0.3)} />
    </Phone>
    <T2Bust who="leo" x={210} y={1390} s={0.42} T={T} mood={t > c1 + 0.5 ? 'sad' : 'calm'} look={10} disc={false} />
    {t > c1 + 0.4 && <Chip x={330} y={760} text="SKIPPED" fill={RED} col="#fff" size={32} k={pop(t, c1 + 0.4)} rot={-5} />}
  </g>);
}

/* 2 — the sting: a tiny pin, then Leo's whole evening deflates */
function GCSting({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), c3 = bt(beats, 3, 1.5);
  return (<g>
    <circle cx="486" cy="1180" r="420" fill="#D8D0BF" />
    <T2Bust who="leo" x={486} y={1130} s={0.66} T={T} mood={t > c3 ? 'sad' : 'nervous'} disc={false} />
    {t > c2 && <g transform={`translate(760 820) rotate(-35) scale(${pop(t, c2)})`}><rect x="-6" y="-90" width="12" height="150" rx="6" fill="#9aa3ad" /><circle cy="-100" r="26" fill={RED} /></g>}
    {t > c2 && <Chip x={760} y={700} text="TINY" fill="#fff" size={30} k={pop(t, c2)} />}
    {t > c3 && <g transform={`translate(230 820) scale(${pop(t, c3)})`}><circle r="70" fill={NAVY} /><circle cx="26" cy="-14" r="60" fill="#D8D0BF" /></g>}
    {t > c3 && <Chip x={230} y={700} text="NIGHT: RUINED" fill={NAVY} col="#fff" size={28} k={pop(t, c3)} rot={-4} />}
  </g>);
}

/* 3 — snapback: an old alarm bell clangs over Leo's head — it's wiring, not drama */
function GCAlarm({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1);
  const sh = Math.sin(T * 40) * 6;
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#F2DA7A" />
    <T2Bust who="leo" x={486} y={1180} s={0.62} T={T} mood="shocked" disc={false} />
    <g transform={`translate(${486 + sh} 760)`}><path d="M-110 70 Q-110 -110 0 -120 Q110 -110 110 70 L140 110 L-140 110 Z" fill={RED} /><circle cy="130" r="26" fill={INK} /><rect x="-12" y="-150" width="24" height="40" rx="8" fill={INK} />
      {[-1, 1].map((s) => [0, 1, 2].map((k) => <line key={s + '' + k} x1={s * (160 + k * 10)} y1={-40 + k * 50} x2={s * (220 + k * 10)} y2={-60 + k * 60} stroke={INK} strokeWidth="9" strokeLinecap="round" opacity={0.5 + 0.5 * Math.abs(osc(T, 0.2, k * 0.3))} />))}</g>
    {t > c2 && <Chip x={486} y={1600} text="WIRED TO BELONG" fill={INK} col="#fff" size={32} k={pop(t, c2)} />}
  </g>);
}

/* 4 — 2000: an online game of catch — three players, one ball, 62 countries */
function GCCatch({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), c3 = bt(beats, 3, 1.5);
  const A = [250, 1000], B = [720, 1000], C = [486, 1400];
  const seq = [A, B, C, A, C, B];
  const ph = (T * 0.9) % seq.length, i = Math.floor(ph), p = ph - i, P = arc(seq[i], seq[(i + 1) % seq.length], p);
  return (<g>
    <rect x="90" y="760" width="792" height="860" rx="40" fill="#1F5560" />
    <rect x="90" y="760" width="792" height="70" rx="35" fill="#163F47" /><text x="486" y="808" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill="#fff">CYBERBALL</text>
    <Avatar x={A[0]} y={A[1]} col={ORG} k={pop(t, 0.1)} /><Avatar x={B[0]} y={B[1]} col={PURP} k={pop(t, 0.2)} /><Avatar x={C[0]} y={C[1]} col={YEL} k={pop(t, 0.3)} label="YOU" />
    {t > 0.4 && <Ball x={P[0]} y={P[1]} />}
    {t > c1 && <Chip x={486} y={690} text="1,486 PLAYERS · 62 COUNTRIES" fill={CREAM} size={26} k={pop(t, c1)} />}
    {t > c3 && <Chip x={486} y={1690} text="STRANGERS, ONLINE" fill={YEL} size={28} k={pop(t, c3)} />}
  </g>);
}

/* 5 — left out: the ball only flies between the other two; YOU fades, sad and angry */
function GCLeftOut({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), c4 = bt(beats, 4, 2.0);
  const A = [250, 1000], B = [720, 1000], C = [486, 1400];
  const ph = (T * 1.1) % 2, p = ph % 1, P = ph < 1 ? arc(A, B, p) : arc(B, A, p);
  const sad = tw(t, c2 - 0.3, 0.8);
  return (<g>
    <rect x="90" y="760" width="792" height="860" rx="40" fill="#7E1720" />
    <Avatar x={A[0]} y={A[1]} col={ORG} /><Avatar x={B[0]} y={B[1]} col={PURP} /><Avatar x={C[0]} y={C[1]} col={YEL} sad={sad} label="YOU" />
    <Ball x={P[0]} y={P[1]} />
    {t > c2 && <Chip x={486} y={690} text="ONLY MINUTES" fill={CREAM} size={30} k={pop(t, c2)} />}
    {t > c4 && <Chip x={300} y={1690} text="SAD" fill="#fff" size={30} k={pop(t, c4)} rot={-4} />}
    {t > c4 && <Chip x={660} y={1690} text="ANGRY" fill={YEL} size={30} k={pop(t, c4 + 0.15)} rot={4} />}
  </g>);
}

/* 6 — brain scans: a brain with one glowing region, next to a bandage — social pain */
function GCBrainPain({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4), c4 = bt(beats, 4, 2.0);
  const glow = tw(t, c3 - 0.3, 0.5);
  return (<g>
    <Chip x={486} y={690} text="BRAIN SCANS · 2003" fill={CREAM} size={30} k={pop(t, 0.05)} />
    <g transform="translate(486 1130)">
      <path d="M-300 40 C-330 -160 -170 -280 -10 -260 C160 -300 330 -170 300 30 C320 160 200 260 40 240 C-60 290 -200 260 -240 180 C-320 160 -330 100 -300 40 Z" fill="#F2B8C6" />
      {[...Array(9)].map((_, i) => <path key={i} d={`M${-260 + i * 60} ${-120 + (i % 3) * 60} q30 -40 60 0 t60 0`} fill="none" stroke="#D98AA0" strokeWidth="12" strokeLinecap="round" />)}
      <line x1="0" y1="-250" x2="0" y2="230" stroke="#D98AA0" strokeWidth="10" />
      <circle cx="0" cy="-60" r={lerp(10, 130, glow) + osc(T, 0.6) * 8 * glow} fill={YEL} opacity={0.45 * glow} />
      <circle cx="0" cy="-60" r={lerp(6, 46, glow)} fill={RED} opacity={glow} />
    </g>
    {t > c4 && <g transform={`translate(760 1530) rotate(-25) scale(${pop(t, c4)})`}><rect x="-130" y="-46" width="260" height="92" rx="46" fill="#E8B38A" /><rect x="-50" y="-46" width="100" height="92" fill="#F3D2B5" />
      {[0, 1, 2, 3].map((k) => <circle key={k} cx={-24 + (k % 2) * 48} cy={-20 + Math.floor(k / 2) * 40} r="6" fill="#C98A62" />)}</g>}
    {t > c4 && <Chip x={330} y={1560} text="SOCIAL PAIN" fill={YEL} size={32} k={pop(t, c4)} />}
  </g>);
}

/* 7 — self-proof: "Seen 9:41 PM" under your message; typing dots appear… and vanish */
function GCSeen({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  const typing = t > 0.4 && t < c2;
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#1F5560" />
    <Phone x={486} y={1180} s={0.8}>
      <rect x="0" y="0" width="420" height="90" fill="#E2DCCD" /><circle cx="60" cy="45" r="28" fill={PURP} /><text x="110" y="56" fontFamily={BOLD} fontWeight="900" fontSize="28" fill={INK}>THEM</text>
      <Msg y={300} text="so... are we ok?" mine k={1} />
      <text x="396" y="398" textAnchor="end" fontFamily={BOLD} fontWeight="700" fontSize="22" fill="#7a8290">Seen 9:41 PM</text>
      {typing && <g><rect x="20" y="440" width="120" height="60" rx="28" fill="#E2DCCD" />{[0, 1, 2].map((k) => <circle key={k} cx={50 + k * 30} cy={470} r="9" fill="#7a8290" opacity={0.4 + 0.6 * Math.abs(osc(T, 0.9, k * 0.2))} />)}</g>}
    </Phone>
    {t > c2 && <Chip x={486} y={760} text="NO REPLY" fill={RED} col="#fff" size={34} k={pop(t, c2)} rot={-3} />}
  </g>);
}

/* outro — Priya puts an arm round Leo's message: you're not too much */
function GCPriya({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6), c4 = bt(beats, 4, 2.0);
  return (<g>
    <circle cx="486" cy="1180" r="430" fill="#2C4F92" />
    <T2Bust who="priya" x={300} y={1240} s={0.5} T={T} mood="happy" look={8} disc={false} />
    <T2Bust who="leo" x={680} y={1270} s={0.5} T={T} mood={t > c1 ? 'happy' : 'calm'} look={-8} ph={0.5} disc={false} />
    <g transform={`translate(486 ${lerp(980, 860, tw(t, 0.1, 0.4))})`} opacity={tw(t, 0.1, 0.3)}><rect x="-260" y="-56" width="520" height="112" rx="50" fill="#fff" />
      <path d="M-120 50 L-150 110 L-80 52 Z" fill="#fff" /><text y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>you're not too much</text></g>
    {t > c4 && <Chip x={486} y={1690} text="SEND IT" fill={YEL} size={32} k={pop(t, c4)} />}
  </g>);
}

Object.assign(window, { GCChat, GCSting, GCAlarm, GCCatch, GCLeftOut, GCBrainPain, GCSeen, GCPriya });
})();
