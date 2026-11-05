// art.jsx — "Why You Answer Emails Instead of Doing the Big Thing" (Ted type 2, Priya + Sam). 972×1728 card; captions
// sit in the top third, so subjects stay in the lower 60%. Pure functions of T and t. People via <T2Bust>.
// Mere urgency effect: Zhu, Yang & Hsee 2018, J Consumer Research (124 people; 3 vs 5 Hershey's Kisses; 31% took the urgent 3).
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', NAVY = '#1F3B73', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';
const bt = (beats, i, fb) => (beats && beats[i] != null ? beats[i] : fb);
const CHOC = '#5A3A26';

function Chip({ x, y, text, k = 1, fill = YEL, col = INK, size = 34, w, rot = 0 }) {
  if (k <= 0) return null;
  const W = w || text.length * size * 0.72 + 60;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}><rect x={-W / 2} y="-34" width={W} height="68" rx="34" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={col}>{text}</text></g>);
}
/* an envelope icon */
function Env({ x, y, s = 1, fill = '#fff', rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x="-70" y="-48" width="140" height="96" rx="10" fill={fill} />
    <path d="M-70 -44 L0 10 L70 -44" fill="none" stroke={INK} strokeWidth="8" strokeLinejoin="round" /></g>);
}
/* a chocolate kiss */
function Kiss({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 -46 C10 -20 40 0 40 22 C40 40 22 46 0 46 C-22 46 -40 40 -40 22 C-40 0 -10 -20 0 -46 Z" fill={CHOC} />
    <path d="M0 -46 L6 -70 L22 -62" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" /><ellipse cx="-14" cy="10" rx="8" ry="16" fill="#8A6040" /></g>);
}
/* a task card with n chocolates and an optional deadline tag */
function TaskCard({ x, y, n, label, k = 1, tag, tagCol = RED, hot = 0 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${k}) rotate(${osc(hot ? 0.07 * hot : 0, 1) * 0})`}>
    <rect x="-180" y="-220" width="360" height="440" rx="26" fill="#fff" />
    <text x="0" y="-160" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>{label}</text>
    {[...Array(n)].map((_, i) => <Kiss key={i} x={-100 + (i % 3) * 100} y={-50 + Math.floor(i / 3) * 110} s={0.9} />)}
    {tag && <Chip x={0} y={170} text={tag} fill={tagCol} col="#fff" size={34} />}
  </g>);
}
function Laptop({ x, y, w = 440, h = 280, children }) {
  return (<g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 - 18} y={-h / 2 - 18} width={w + 36} height={h + 36} rx="22" fill={INK} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="8" fill="#F7F4EC" />{children}
    <path d={`M${-w / 2 - 70} ${h / 2 + 18} L${w / 2 + 70} ${h / 2 + 18} L${w / 2 + 40} ${h / 2 + 60} L${-w / 2 - 40} ${h / 2 + 60} Z`} fill="#3A3F4B" /></g>);
}
/* project folder, dusty */
function Folder({ x, y, s = 1, label = 'BIG PROJECT', dust = 1, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-170 -120 L-60 -120 L-30 -90 L170 -90 L170 130 L-170 130 Z" fill="#E07A2E" />
    <rect x="-170" y="-70" width="340" height="200" rx="10" fill="#F09A4E" />
    <text y="40" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>{label}</text>
    {dust > 0 && <g opacity={dust}><path d="M120 -90 Q150 -60 170 -40 M140 -90 L170 -60 M100 -90 Q140 -40 170 -10" fill="none" stroke="#fff" strokeWidth="3" opacity="0.8" />
      {[0, 1, 2].map((i) => <circle key={i} cx={-100 + i * 90 + osc(T, 2, i * 0.3) * 6} cy={-100 - ((T * 20 + i * 15) % 40)} r="5" fill="#fff" opacity="0.5" />)}</g>}
  </g>);
}

/* 1 — Priya fires off emails (counter to 20); the BIG PROJECT folder gathers dust beside her */
function UEHook({ T, t, dur, beats }) {
  const D = Math.max(2.5, dur || 4), n = Math.min(20, Math.floor(1 + 19 * tw(t, 0, D * 0.4)));
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#2C4F92" />
    <Laptop x={560} y={850} w={420} h={270}>
      <rect x="-210" y="-135" width="420" height="50" fill="#DDD6C8" />
      <text x="-190" y="-100" fontFamily={BOLD} fontWeight="900" fontSize="26" fill={INK}>INBOX</text>
      <text x="0" y="40" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="96" fill={TEAL}>{n}</text>
      <text x="0" y="96" textAnchor="middle" fontFamily={BOLD} fontWeight="800" fontSize="28" fill={INK}>REPLIES SENT</text>
    </Laptop>
    {[0, 1, 2].map((i) => { const p = (T * 1.6 + i / 3) % 1; return <Env key={i} x={560 + p * 380} y={760 - p * 260} s={0.5 + p * 0.2} rot={20 * p} />; })}
    <Folder x={190} y={1130} s={0.62} T={T} />
    <T2Bust who="priya" x={560} y={1420} s={0.56} T={T} mood="happy" look={4} />
  </g>);
}

/* 2 — the day as a bar from 9 to 6, crammed with tiny tasks; the IMPORTANT slot stays empty */
function UEBusy({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), k = tw(t, 0.2, D * 0.6), bD = bt(beats, 4, D * 0.8);
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#D8CFBD" />
    <rect x="110" y="700" width="752" height="300" rx="26" fill="#fff" />
    <text x="150" y="760" fontFamily={BOLD} fontWeight="900" fontSize="30" fill={INK}>TODAY</text>
    <text x="150" y="980" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={INK} opacity="0.5">9 AM</text>
    <text x="822" y="980" textAnchor="end" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={INK} opacity="0.5">6 PM</text>
    {[...Array(18)].map((_, i) => (i / 18 < k) && <rect key={i} x={150 + i * 37} y={800 + (i % 3) * 44} width="32" height="36" rx="6" fill={['#7FC8F8', '#E07A2E', TEAL][i % 3]} />)}
    <g transform="translate(486 1110)"><rect x="-220" y="-50" width="440" height="100" rx="20" fill="none" stroke={RED} strokeWidth="8" strokeDasharray="20 14" />
      <text y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill={RED}>IMPORTANT: —</text></g>
    <T2Bust who="priya" x={486} y={1440} s={0.5} T={T} mood={t > bD ? 'sad' : 'calm'} look={0} disc={false} />
  </g>);
}

/* 3 — snapback: punch in on a red countdown; Priya's eyes lock on it */
function UESnap({ T, t, dur, beats }) {
  const D = Math.max(2.5, dur || 4), z = 1 + 0.16 * tw(t, 0, 0.6), s = Math.max(0, 9 - Math.floor(t * 2.5));
  const blinkOn = (T * 2) % 1 < 0.6;
  return (<g transform={`translate(486 1200) scale(${z}) translate(-486 -1200)`}>
    <circle cx="486" cy="1260" r="420" fill="#C9A63A" />
    <g transform="translate(486 880)">
      <rect x="-300" y="-130" width="600" height="260" rx="40" fill={INK} />
      <text y="70" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="180" fill={blinkOn ? '#FF4B3E' : '#8E1820'} letterSpacing="6">00:0{s}</text>
    </g>
    <T2Bust who="priya" x={486} y={1400} s={0.6} T={T} mood="shocked" look={0} />
  </g>);
}

/* 4 — the study: two identical review tasks, five kisses vs three */
function UEStudy({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), b3 = bt(beats, 3, D * 0.6), b4 = bt(beats, 4, D * 0.8);
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#1F5560" />
    <Chip x={486} y={640} text="2018 · 124 PEOPLE" k={pop(t, 0.1)} size={32} />
    <TaskCard x={260} y={1000} n={5} label="WRITE A REVIEW" k={0.86 * pop(t, Math.min(0.3, b3 - 0.3))} />
    <TaskCard x={712} y={1000} n={3} label="WRITE A REVIEW" k={0.86 * pop(t, Math.min(0.6, b4 - 0.2))} />
    <text x="486" y="1010" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill="#fff" opacity={tw(t, b4, 0.3)}>OR</text>
  </g>);
}

/* 5 — the three-kiss task gets a 10-minute deadline; a bar fills to 31% */
function UEExpire({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), bP = bt(beats, 2, D * 0.55), f = tw(t, bP - 0.2, 0.8), sh = t > 0.4 && t < bP ? osc(T, 0.1) * 6 : 0;
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#8E1820" />
    <TaskCard x={270} y={950} n={5} label="WRITE A REVIEW" tag="24 HOURS" tagCol={TEAL} />
    <g transform={`translate(${sh} 0)`}><TaskCard x={702} y={950} n={3} label="WRITE A REVIEW" tag="10 MIN!" k={1} /></g>
    <g transform="translate(486 1300)">
      <rect x="-330" y="-50" width="660" height="100" rx="50" fill={CREAM} />
      <rect x="-330" y="-50" width={Math.max(100, 660 * 0.31 * f)} height="100" rx="50" fill={YEL} />
      <text x={-330 + Math.max(100, 660 * 0.31 * f) + 24} y="20" fontFamily={BOLD} fontWeight="900" fontSize="54" fill={INK} opacity={f}>31%</text>
      <text x="0" y="110" textAnchor="middle" fontFamily={BOLD} fontWeight="800" fontSize="26" fill="#fff" opacity={0.8 * f}>CHOSE THE URGENT 3</text>
    </g>
  </g>);
}

/* 6 — name it: a megaphone blares URGENT; the quiet IMPORTANT box waits; busy-people chip */
function UEName({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), bB = bt(beats, 2, D * 0.5);
  return (<g>
    <circle cx="486" cy="1240" r="420" fill="#56328A" />
    <g transform={`translate(330 900) rotate(${-12 + osc(T, 0.2) * 3})`}>
      <path d="M-140 -50 L60 -140 L60 140 L-140 50 Z" fill={RED} /><rect x="-200" y="-50" width="70" height="100" rx="14" fill={INK} />
      {[0, 1, 2].map((i) => { const p = (T * 1.5 + i / 3) % 1; return <path key={i} d={`M${100 + p * 160} -100 Q${150 + p * 180} 0 ${100 + p * 160} 100`} fill="none" stroke={YEL} strokeWidth="12" opacity={1 - p} strokeLinecap="round" />; })}
      <text x="-40" y="16" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff">URGENT</text>
    </g>
    <g transform="translate(720 1150)"><rect x="-150" y="-110" width="300" height="220" rx="24" fill={CREAM} />
      <text y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>IMPORTANT</text>
      <text y="60" textAnchor="middle" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={INK} opacity="0.5">(quiet)</text></g>
    <Chip x={300} y={1180} text="BUSY? MORE PULL" k={pop(t, bB)} size={28} />
  </g>);
}

/* 7 — self-proof: notifications pile up with URGENT!! labels; the badge counter climbs; Priya side-eyes */
function UEProof({ T, t, dur, beats }) {
  const n = 3 + Math.floor(t * 3);
  return (<g>
    <circle cx="486" cy="1300" r="420" fill="#B85E1F" />
    {[0, 1, 2, 3].map((i) => { const k = pop(t, 0.1 + i * 0.3);
      return (<g key={i} transform={`translate(486 ${700 + i * 120}) scale(${k})`}><rect x="-330" y="-48" width="660" height="96" rx="24" fill="#fff" />
        <Env x={-260} y={0} s={0.45} fill={CREAM} /><text x="-200" y="12" fontFamily={BOLD} fontWeight="900" fontSize="32" fill={i % 2 ? RED : INK}>{['URGENT!!', 'quick q', 'ASAP pls', 're: re: re:'][i]}</text></g>); })}
    <g transform="translate(800 640)"><circle r="54" fill={RED} /><text y="20" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="52" fill="#fff">{n}</text></g>
    <T2Bust who="priya" x={486} y={1450} s={0.48} T={T} mood="smug" look={-10} disc={false} />
  </g>);
}

/* 8 — outro: Sam slaps a sticky note on Priya's laptop: BIG THING FIRST; she opens the project folder */
function UEOutro({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5.5), bN = bt(beats, 1, D * 0.25), open = tw(t, bt(beats, 3, D * 0.75), 0.5);
  return (<g>
    <T2Bust who="sam" x={240} y={1390} s={0.54} T={T} mood="smug" look={10} ph={0.4} />
    <T2Bust who="priya" x={730} y={1400} s={0.56} T={T} mood={open > 0.5 ? 'happy' : 'calm'} look={-10} />
    <Laptop x={486} y={880} w={400} h={250}>
      <g opacity={1 - open}><text x="0" y="20" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill={INK} opacity="0.3">INBOX (0)</text></g>
      <g opacity={open}><rect x="-200" y="-125" width="400" height="250" fill="#F09A4E" /><text x="0" y="16" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={INK}>BIG PROJECT</text></g>
    </Laptop>
    <g transform={`translate(660 770) rotate(10) scale(${pop(t, bN)})`}><rect x="-110" y="-90" width="220" height="180" fill={YEL} />
      <text y="-10" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill={INK}>BIG THING</text>
      <text y="38" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill={RED}>FIRST</text></g>
  </g>);
}

Object.assign(window, { UEHook, UEBusy, UESnap, UEStudy, UEExpire, UEName, UEProof, UEOutro });
})();
