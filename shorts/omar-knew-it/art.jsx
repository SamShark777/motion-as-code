// art.jsx — "You Didn't Know It All Along" (Ted type 2, Omar + Priya). 972×1728 card; captions sit in the top third,
// so subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene). People via <T2Bust>.
// Hindsight bias: Fischhoff & Beyth 1975 ("I knew it would happen", Nixon's 1972 trips to China and the USSR).
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', TAU = Math.PI * 2;
const OSKIN = '#8A5A3C';
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';
const bt = (beats, i, fb) => (beats && beats[i] != null ? beats[i] : fb);

/* a speech bubble with a tail pointing down-left (dir -1) or down-right (dir 1) */
function Bubble({ x, y, w = 420, h = 120, text, size = 52, k = 1, dir = -1, fill = '#fff', col = INK, rot = 0 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} />
    <path d={`M${dir * w * 0.18 - 26} ${h / 2 - 4} L${dir * w * 0.26} ${h / 2 + 56} L${dir * w * 0.18 + 26} ${h / 2 - 4} Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={col}>{text}</text></g>);
}
/* a raised fist with a red sleeve, pumping */
function Fist({ x, y, s = 1, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-46" y="20" width="92" height="220" rx="40" fill={RED} />
    <rect x="-58" y="-70" width="116" height="104" rx="38" fill={OSKIN} />
    {[0, 1, 2].map((i) => <line key={i} x1={-30 + i * 30} y1="-66" x2={-30 + i * 30} y2="-30" stroke="#6B4129" strokeWidth="7" strokeLinecap="round" />)}
    <rect x="-70" y="-30" width="40" height="56" rx="20" fill="#6B4129" /></g>);
}
/* confetti burst */
const CONF = ['#E8C547', '#B3202A', '#E9E4D8', '#2B6E7A', '#E07A2E'];
function Confetti({ T, x0 = 120, x1 = 860, y0 = 680, y1 = 1500, n = 26, on = 1 }) {
  if (on <= 0) return null;
  return (<g opacity={on}>{[...Array(n)].map((_, i) => {
    const k = (T * (0.35 + hsh(i) * 0.3) + hsh(i + 9)) % 1;
    const x = x0 + hsh(i + 3) * (x1 - x0) + Math.sin(T * 2 + i) * 18, y = y0 + k * (y1 - y0);
    return <rect key={i} x={x} y={y} width="18" height="30" rx="4" fill={CONF[i % 5]} transform={`rotate(${T * 200 + i * 40} ${x + 9} ${y + 15})`} opacity={1 - k * 0.6} />;
  })}</g>);
}
/* a phone; children are drawn in screen coordinates (0,0 = screen top-left), clipped to the screen */
function Phone({ x, y, w = 440, h = 800, rot = 0, id, children }) {
  return (<g transform={`translate(${x - w / 2} ${y - h / 2}) rotate(${rot} ${w / 2} ${h / 2})`}>
    <rect x="-22" y="-22" width={w + 44} height={h + 44} rx="60" fill={INK} />
    <defs><clipPath id={id}><rect width={w} height={h} rx="40" /></clipPath></defs>
    <rect width={w} height={h} rx="40" fill="#F7F4EC" />
    <g clipPath={`url(#${id})`}>{children}</g>
    <rect x={w / 2 - 60} y="-8" width="120" height="22" rx="11" fill={INK} /></g>);
}
/* chat bubble inside the phone */
function Msg({ x, y, w, text, me = false, size = 34, col }) {
  return (<g transform={`translate(${x} ${y})`}>
    <rect width={w} height="84" rx="34" fill={col || (me ? '#2B6E7A' : '#DDD6C8')} />
    <text x="30" y="54" fontFamily={BOLD} fontWeight="800" fontSize={size} fill={me ? '#fff' : INK}>{text}</text></g>);
}
/* a pill chip */
function Chip({ x, y, text, k = 1, fill = YEL, col = INK, size = 34, w }) {
  if (k <= 0) return null;
  const W = w || text.length * size * 0.72 + 60;
  return (<g transform={`translate(${x} ${y}) scale(${k})`}><rect x={-W / 2} y="-34" width={W} height="68" rx="34" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={col}>{text}</text></g>);
}
/* a pencil, tip at (0,0) */
function Pencil({ x, y, s = 1, rot = -35 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 0 L22 -40 L-22 -40 Z" fill="#F1C3A0" /><path d="M0 0 L7 -13 L-7 -13 Z" fill={INK} />
    <rect x="-22" y="-260" width="44" height="220" fill={YEL} /><rect x="-22" y="-290" width="44" height="34" rx="6" fill="#E8907A" />
    <rect x="-22" y="-262" width="44" height="10" fill="#C9C0AE" /></g>);
}
/* a 'how likely' slider with a fill; no numbers (direction only) */
function Gauge({ x, y, w = 640, v = 0, col = YEL, label, sub, lab = INK }) {
  return (<g transform={`translate(${x} ${y})`}>
    {sub && <text x="0" y="-74" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={lab} opacity="0.6">{sub}</text>}
    <text x="0" y="-30" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={lab}>{label}</text>
    <rect x="0" y="0" width={w} height="56" rx="28" fill="#fff" opacity="0.9" /><rect x="0" y="0" width={Math.max(56, w * v)} height="56" rx="28" fill={col} />
    <text x="0" y="100" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={lab} opacity="0.6">NO WAY</text>
    <text x={w} y="100" textAnchor="end" fontFamily={BOLD} fontWeight="700" fontSize="24" fill={lab} opacity="0.6">SURE THING</text></g>);
}
/* TV with a little football pitch */
function TV({ x, y, w = 460, h = 280, T, children }) {
  return (<g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 - 20} y={-h / 2 - 20} width={w + 40} height={h + 40} rx="26" fill={INK} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill="#3E8E4E" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-w / 2 + i * w / 4} y={-h / 2} width={w / 8} height={h} fill="#4FA05E" />)}
    <line x1="0" y1={-h / 2} x2="0" y2={h / 2} stroke="#fff" strokeWidth="5" opacity="0.7" /><circle r={h * 0.22} fill="none" stroke="#fff" strokeWidth="5" opacity="0.7" />
    {children}
    <rect x="-60" y={h / 2 + 20} width="120" height="40" fill={INK} /><rect x="-120" y={h / 2 + 54} width="240" height="16" rx="8" fill={INK} /></g>);
}

/* 1 — the match ends; Omar pumps both fists: "I KNEW IT!" */
function OKHook({ T, t, dur, beats }) {
  const D = Math.max(2.2, dur || 3), b2 = bt(beats, 2, D * 0.55), up = tw(t, b2 - 0.15, 0.3);
  const pump = up * (1 + 0.08 * Math.abs(osc(T, 0.5)));
  return (<g>
    <Confetti T={T} on={up} />
    <TV x={290} y={860} w={420} h={250} T={T}>
      <rect x="-170" y="-90" width="340" height="80" rx="16" fill={INK} opacity="0.85" />
      <text y="-36" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="42" fill={YEL}>FULL TIME</text>
      <circle cx={-60 + osc(T, 1.4) * 20} cy="60" r="20" fill="#fff" /></TV>
    <T2Bust who="omar" x={486} y={1290} s={0.82} T={T} mood={up > 0.5 ? 'happy' : 'shocked'} />
    <g transform={`translate(0 ${-140 * pump})`}><Fist x={175} y={1430} s={0.9} rot={-14} /><Fist x={797} y={1430} s={0.9} rot={14} /></g>
    <Bubble x={690} y={840} w={430} h={130} size={58} k={pop(t, b2)} dir={-1} text="I KNEW IT!" rot={4} />
  </g>);
}

/* 2 — Priya scrolls back up the chat: last week Omar said "no chance" */
function OKReceipts({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), bC = bt(beats, 3, D * 0.5), bY = bt(beats, 4, D * 0.7);
  const scroll = tw(t, 0.15, Math.max(0.6, bC - 0.4)) * 460;
  const ring = cl((t - bC) / 0.45);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#D8CFBD" />
    <Phone x={600} y={1110} w={430} h={780} rot={4} id="okphone">
      <g transform={`translate(0 ${-460 + scroll})`}>
        <Chip x={215} y={150} text="LAST WEEK" fill="#C9C0AE" size={26} />
        <Msg x={30} y={210} w={360} text="They have NO" />
        <Msg x={30} y={306} w={330} text="CHANCE lol" />
        <Msg x={130} y={420} w={270} text="ok bet" me />
        <Chip x={215} y={640} text="TODAY" fill="#C9C0AE" size={26} />
        <Msg x={30} y={700} w={300} text="I KNEW IT!!" />
        <Msg x={30} y={796} w={340} text="called it" />
        <g opacity={ring}><ellipse cx="215" cy="300" rx="215" ry="120" fill="none" stroke={RED} strokeWidth="10"
          strokeDasharray="1400" strokeDashoffset={1400 * (1 - ring)} transform="rotate(-6 215 300)" /></g>
      </g>
      <rect width="430" height="90" fill="#EFEADD" /><circle cx="60" cy="45" r="26" fill={OSKIN} />
      <text x="104" y="57" fontFamily={BOLD} fontWeight="900" fontSize="32" fill={INK}>OMAR</text>
    </Phone>
    <T2Bust who="priya" x={225} y={1390} s={0.64} T={T} mood={t > bY ? 'smug' : 'calm'} look={t > bY ? -2 : 10} disc={false} />
    <g transform={`translate(110 ${930 + osc(T, 0.7) * 30}) scale(${tw(t, 0.1, 0.3)})`} opacity={1 - ring}>
      <path d="M0 -60 L-30 -20 L30 -20 Z" fill={INK} /><rect x="-10" y="-22" width="20" height="70" fill={INK} /></g>
  </g>);
}

/* 3 — snapback: punch in on Omar; the memory card rewrites itself */
function OKSnap({ T, t, dur, beats }) {
  const D = Math.max(2.5, dur || 4), z = 1 + 0.16 * tw(t, 0, 0.6);
  const bR = bt(beats, 3, D * 0.55), erase = cl((t - bR + 0.6) / 0.6), write = cl((t - bR) / 0.8);
  const px = 220 + (erase < 1 ? erase * 520 : write * 520), py = erase < 1 ? 905 + osc(T, 0.15) * 14 : 1000 + osc(T, 0.2) * 8;
  return (<g transform={`translate(486 1200) scale(${z}) translate(-486 -1200)`}>
    <circle cx="486" cy="1300" r="420" fill="#C9A63A" />
    <T2Bust who="omar" x={486} y={1380} s={0.72} T={T} mood="calm" disc={false} />
    {[0, 1].map((i) => <circle key={i} cx={430 + i * 50} cy={1150 - i * 50} r={14 + i * 8} fill="#fff" />)}
    <g transform="rotate(-3 486 950)">
      <path d="M150 960 C110 860 230 760 330 800 C380 720 560 720 610 790 C720 740 850 840 810 940 C860 1040 740 1110 650 1080 C580 1130 380 1130 320 1080 C210 1110 110 1050 150 960 Z" fill="#fff" />
      <text x="300" y="830" fontFamily={BOLD} fontWeight="800" fontSize="24" fill={INK} opacity="0.5">MEMORY: MY GUESS</text>
      <g opacity={1 - erase}><text x="486" y="935" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="64" fill={INK}>NO CHANCE</text></g>
      {erase > 0 && erase < 1 && <g opacity="0.25">{[0, 1, 2].map((i) => <path key={i} d={`M${230 + i * 30} ${880 + i * 20} q60 -30 120 0 t120 0`} fill="none" stroke="#999" strokeWidth="10" />)}</g>}
      <defs><clipPath id="okwrite"><rect x="200" y="950" width={560 * write} height="110" /></clipPath></defs>
      <text x="486" y="1035" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="70" fill={RED} clipPath="url(#okwrite)">I KNEW IT</text>
    </g>
    {erase < 1 ? <g transform={`translate(${px} ${py}) rotate(-30)`}><rect x="-40" y="-90" width="80" height="120" rx="14" fill="#E8907A" /><rect x="-40" y="-150" width="80" height="70" rx="8" fill="#2B6E7A" /></g>
      : <Pencil x={px} y={py} s={0.75} rot={30} />}
  </g>);
}

/* 4 — the study: 1972, two trips (China, USSR); people write down their odds first */
function OKStudy({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 6), k = tw(t, 0.3, D * 0.5), bG = bt(beats, 5, D * 0.75);
  const ax = 200, ay = 900, bx = 772, by = 900, cx = 486, cy = 720;
  const u = k, plx = (1 - u) * (1 - u) * ax + 2 * u * (1 - u) * cx + u * u * bx, ply = (1 - u) * (1 - u) * ay + 2 * u * (1 - u) * cy + u * u * by;
  const ang = Math.atan2(2 * (1 - u) * (cy - ay) + 2 * u * (by - cy), 2 * (1 - u) * (cx - ax) + 2 * u * (bx - cx)) * 180 / Math.PI;
  const rows = [0.7, 0.35, 0.5];
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#8E1820" />
    <path d={`M${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`} fill="none" stroke={CREAM} strokeWidth="8" strokeDasharray="22 18" opacity="0.7" />
    <Chip x={ax} y={ay + 70} text="CHINA" k={pop(t, 0.1)} fill={CREAM} size={36} />
    <Chip x={bx} y={by + 70} text="USSR" k={pop(t, 0.25)} fill={CREAM} size={36} />
    <g transform={`translate(${plx} ${ply}) rotate(${ang})`}><path d="M-50 -8 L40 -8 Q62 0 40 8 L-50 8 Z" fill="#fff" /><path d="M-6 -6 L-30 -46 L-12 -46 L18 -6 Z M-6 6 L-30 46 L-12 46 L18 6 Z M-50 -4 L-62 -26 L-50 -26 L-38 -4 Z" fill="#fff" /></g>
    <Chip x={486} y={1000} text="1972" k={pop(t, 0.5)} size={44} />
    <g transform={`translate(486 1290) rotate(-2) scale(${pop(t, D * 0.35)})`}>
      <rect x="-320" y="-200" width="640" height="400" rx="20" fill="#fff" />
      <text x="-280" y="-130" fontFamily={BOLD} fontWeight="900" fontSize="38" fill={INK}>BEFORE: MY ODDS</text>
      {rows.map((v, i) => { const f = tw(t, bG - 0.3 + i * 0.25, 0.5); return (<g key={i} transform={`translate(-280 ${-60 + i * 90})`}>
        <circle cx="16" cy="18" r="16" fill="none" stroke={INK} strokeWidth="5" />
        <rect x="60" y="0" width="480" height="36" rx="18" fill="#E9E4D8" /><rect x="60" y="0" width={Math.max(36, 480 * v * f)} height="36" rx="18" fill={i === 0 ? TEAL : '#E07A2E'} /></g>); })}
    </g>
  </g>);
}

/* 5 — the turn: what you guessed vs what you remember guessing, for the outcome that happened */
function OKTurn({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5), a = tw(t, 0.15, 0.6), bH = bt(beats, 2, D * 0.4), b = tw(t, bH - 0.2, 1.0);
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#1F5560" />
    <rect x="110" y="700" width="752" height="600" rx="30" fill={CREAM} />
    <Chip x={486} y={760} text="IT HAPPENED" fill={TEAL} col="#fff" size={30} k={pop(t, 0.1)} />
    <Gauge x={160} y={900} v={0.32 * a} col="#7FC8F8" label="WHAT I GUESSED" sub="BEFORE THE TRIP" />
    <Gauge x={160} y={1170} v={(0.32 + 0.36 * b)} col={RED} label="WHAT I “REMEMBER”" sub="AFTER THE TRIP" />
    {b > 0.3 && <g transform={`translate(${160 + 640 * (0.32 + 0.36 * b)} 1262)`} opacity={cl((b - 0.3) * 3)}>
      <path d="M-26 0 L0 -34 L26 0 Z" fill={RED} /></g>}
    <T2Bust who="omar" x={486} y={1560} s={0.36} T={T} mood={b > 0.6 ? 'smug' : 'calm'} disc={false} />
  </g>);
}

/* 6 — name it: the old prediction file gets quietly edited; "last modified: today" */
function OKName({ T, t, dur, beats }) {
  const D = Math.max(2.5, dur || 4.5), bE = bt(beats, 3, D * 0.6), sw = cl((t - bE) / 0.5);
  const gl = sw > 0 && sw < 1 ? Math.sin(T * 60) * 8 : 0;
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#56328A" />
    <g transform={`translate(486 1180) rotate(-3) scale(${pop(t, 0.1)})`}>
      <path d="M-330 -330 L-120 -330 L-90 -290 L330 -290 L330 330 L-330 330 Z" fill="#E8C547" />
      <rect x="-290" y="-250" width="580" height="540" rx="14" fill="#fff" />
      <text x="-250" y="-180" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK} opacity="0.55">MY PREDICTION</text>
      {[0, 1, 2].map((i) => <rect key={i} x="-250" y={-130 + i * 34} width={[440, 380, 300][i]} height="12" rx="6" fill="#DDD6C8" />)}
      <g transform={`translate(${gl} 0)`}>
        <text x="0" y="60" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="60" fill={INK} opacity={1 - sw}>NO CHANCE</text>
        <text x="0" y="60" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="60" fill={RED} opacity={sw}>SAW IT COMING</text>
      </g>
      <text x="-250" y="250" fontFamily={BOLD} fontWeight="700" fontSize="26" fill={INK} opacity={0.5}>LAST EDITED: <tspan fontWeight="900" fill={sw > 0.5 ? RED : INK}>{sw > 0.5 ? 'TODAY' : 'LAST WEEK'}</tspan></text>
      <g transform={`translate(170 170) rotate(-12) scale(${pop(t, bE + 0.5, 0.3) * (1 + 0.3 * (1 - cl((t - bE - 0.5) / 0.3)))})`} opacity={cl((t - bE - 0.5) / 0.15)}>
        <rect x="-120" y="-44" width="240" height="88" rx="10" fill="none" stroke={RED} strokeWidth="9" />
        <text y="18" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="50" fill={RED}>EDITED</text></g>
    </g>
  </g>);
}

/* 7 — self-proof: the plot twist on TV; Omar "called it", Priya side-eyes */
function OKProof({ T, t, dur, beats }) {
  const D = Math.max(2.5, dur || 4), bS = bt(beats, 2, D * 0.45), fl = Math.max(0, 1 - Math.abs(t - 0.5) * 3);
  return (<g>
    <circle cx="486" cy="1300" r="420" fill="#B85E1F" />
    <g transform="translate(486 880)">
      <rect x="-300" y="-170" width="600" height="340" rx="26" fill={INK} />
      <rect x="-280" y="-150" width="560" height="300" rx="10" fill="#2A2F3A" />
      <rect x="-280" y="-150" width="560" height="300" rx="10" fill="#fff" opacity={fl * 0.8} />
      <g transform={`scale(${pop(t, 0.35)}) rotate(${osc(T, 0.8) * 3})`}><text y="22" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="72" fill={YEL}>PLOT TWIST!</text></g>
      <rect x="-60" y="170" width="120" height="30" fill={INK} />
    </g>
    <T2Bust who="omar" x={300} y={1370} s={0.55} T={T} mood={t > bS ? 'happy' : 'shocked'} disc={false} />
    <T2Bust who="priya" x={690} y={1390} s={0.55} T={T} mood="smug" look={-12} ph={0.6} disc={false} />
    <Bubble x={260} y={1110} w={330} h={100} size={44} k={pop(t, bS)} dir={1} text="CALLED IT" fill={YEL} />
  </g>);
}

/* 8 — outro: Priya hands Omar a notebook of written-down guesses; snap, it's on record */
function OKOutro({ T, t, dur, beats }) {
  const D = Math.max(3, dur || 5.5), bD = bt(beats, 3, D * 0.45), bS = bt(beats, 6, D * 0.85);
  const write = cl((t - bD + 0.3) / 0.9), flash = Math.max(0, 1 - Math.abs(t - bS - 0.1) * 4);
  return (<g>
    <T2Bust who="omar" x={260} y={1380} s={0.58} T={T} mood={t > bS ? 'happy' : 'calm'} look={8} />
    <T2Bust who="priya" x={712} y={1400} s={0.55} T={T} mood="smug" look={-8} ph={0.5} />
    <g transform={`translate(486 920) rotate(-4) scale(${pop(t, 0.15)})`}>
      <rect x="-280" y="-190" width="560" height="380" rx="18" fill="#fff" />
      <rect x="-280" y="-190" width="560" height="70" rx="18" fill={RED} />
      <text x="0" y="-142" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill="#fff">MY GUESSES</text>
      {[0, 1, 2].map((i) => <line key={i} x1="-250" y1={-50 + i * 80} x2="250" y2={-50 + i * 80} stroke="#C9C0AE" strokeWidth="4" />)}
      <text x="-240" y="-62" fontFamily={BOLD} fontWeight="800" fontSize="30" fill={INK} opacity="0.5">SAT</text>
      <defs><clipPath id="okguess"><rect x="-170" y="-120" width={420 * write} height="80" /></clipPath></defs>
      <text x="-160" y="-62" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={TEAL} clipPath="url(#okguess)">they lose</text>
      <g opacity={tw(t, bS - 0.2, 0.3)}><Chip x={150} y={110} text="ON RECORD" fill={YEL} size={30} /></g>
      {write > 0 && write < 1 && <Pencil x={-160 + 300 * write} y={-70 + osc(T, 0.12) * 6} s={0.4} rot={40} />}
      <rect x="-300" y="-210" width="600" height="420" rx="24" fill="none" stroke="#fff" strokeWidth="14" opacity={flash} />
    </g>
    <rect x="0" y="0" width="972" height="1728" fill="#fff" opacity={flash * 0.35} />
  </g>);
}

Object.assign(window, { OKHook, OKReceipts, OKSnap, OKStudy, OKTurn, OKName, OKProof, OKOutro });
})();
