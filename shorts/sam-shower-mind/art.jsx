// art.jsx — "Your Mind Is Somewhere Else Half the Day" (Ted type 2, Sam ep. 7 with Priya). 972×1728 card; captions sit
// in the top third, so subjects stay in the lower 60%. Pure functions of T and t. People via <T2Bust>.
// Mind wandering: Killingsworth & Gilbert 2010 (Science) — 2,250 adults pinged at random; minds wandered in 46.9% of samples
// ("nearly half" on screen), and people were less happy when their minds wandered.
(function () {
const INK = '#141821', CREAM = '#E9E4D8', YEL = '#FFD23F', RED = '#B3202A', TEAL = '#2B6E7A', NAVY = '#1F3B73', PURP = '#6A3FA0', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
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
/* cloud-shaped thought bubble with three trailing dots toward (tx,ty); children drawn inside */
function Thought({ x, y, k = 1, tx, ty, fill = '#fff', children }) {
  if (k <= 0) return null;
  const puffs = [[-150, 0, 95], [-60, -60, 105], [60, -55, 105], [150, 5, 90], [70, 60, 95], [-70, 60, 95]];
  return (<g><g transform={`translate(${x} ${y}) scale(${k})`}>{puffs.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />)}<rect x="-170" y="-60" width="340" height="140" fill={fill} />{children}</g>
    {[0, 1, 2].map((i) => <circle key={i} cx={x + (tx - x) * (0.55 + i * 0.15)} cy={y + (ty - y) * (0.55 + i * 0.15)} r={22 - i * 6} fill={fill} opacity={cl(k * 3 - i)} />)}</g>);
}
/* shower: tiles, head and falling water (cx = water column) */
function Shower({ T, cx = 486, on = 1 }) {
  return (<g>
    {[...Array(8)].map((_, r) => [...Array(7)].map((_, c) => <rect key={r + '-' + c} x={c * 140} y={680 + r * 140} width="136" height="136" rx="8" fill="#D8E6F0" opacity="0.55" />))}
    <path d={`M${cx + 260} 640 L${cx + 260} 720 L${cx + 120} 720`} fill="none" stroke="#9AA3B5" strokeWidth="18" strokeLinecap="round" />
    <path d={`M${cx + 40} 700 L${cx + 200} 700 L${cx + 170} 760 L${cx + 70} 760 Z`} fill="#9AA3B5" />
    {on > 0 && [...Array(22)].map((_, i) => { const x = cx + 50 + hsh(i) * 140 - 120 * (i % 3 === 0 ? 1 : 0) * 0, y = 780 + ((T * (700 + hsh(i + 5) * 300) + hsh(i + 2) * 900) % 900);
      return <line key={i} x1={x + (y - 780) * -0.18} y1={y} x2={x + (y - 760) * -0.18} y2={y + 40} stroke="#7FC4E8" strokeWidth="7" strokeLinecap="round" opacity={0.85 * on} />; })}
  </g>);
}
function Calendar({ x, y, s = 1, text = '9:00 MEETING' }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-120" y="-90" width="240" height="180" rx="16" fill="#fff" stroke={INK} strokeWidth="6" />
    <rect x="-120" y="-90" width="240" height="56" rx="16" fill={RED} /><text y="-50" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="30" fill="#fff">TOMORROW</text>
    <text y="30" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>{text}</text></g>);
}

/* 1 — Sam in the shower, water running; his thought cloud is full of tomorrow's meeting (calendar + slide) */
function WMShower({ T, t }) {
  return (<g>
    <Shower T={T} cx={420} />
    <T2Bust who="sam" x={420} y={1240} s={0.6} T={T} mood="nervous" look={10} disc={false} />
    <Thought x={700} y={820} k={pop(t, 0.3, 0.45)} tx={540} ty={1040}>
      <Calendar x={-40} y={-10} s={0.85} />
      <g transform="translate(110 40) rotate(8)"><rect x="-60" y="-40" width="120" height="80" rx="8" fill={TEAL} /><rect x="-40" y="10" width="16" height="20" fill={YEL} /><rect x="-16" y="-6" width="16" height="36" fill={YEL} /><rect x="8" y="-20" width="16" height="50" fill={YEL} /></g></Thought>
    <rect x="0" y="1560" width="972" height="168" fill="#B9C9D6" />
  </g>);
}

/* 2 — you: Sam on the sofa while Priya talks ('SAM?'); a dotted line leads from his head to somewhere else */
function WMYou({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1), k = tw(t, c2 - 0.4, 0.6);
  return (<g>
    <circle cx="486" cy="1180" r="420" fill="#C9D8C5" />
    <rect x="160" y="1300" width="652" height="200" rx="60" fill="#8A5A3C" /><rect x="120" y="1230" width="120" height="270" rx="50" fill="#6B4129" /><rect x="732" y="1230" width="120" height="270" rx="50" fill="#6B4129" />
    <T2Bust who="priya" x={690} y={1210} s={0.42} T={T} mood={t > c2 ? 'smug' : 'happy'} look={-8} ph={0.4} disc={false} />
    <T2Bust who="sam" x={300} y={1150} s={0.5} T={T} mood="calm" look={0} disc={false} />
    <g transform={`translate(560 ${1000}) scale(${pop(t, 0.3)})`}><rect x="-90" y="-40" width="180" height="80" rx="30" fill="#fff" /><text y="14" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="36" fill={INK}>SAM?</text></g>
    <path d={`M330 960 Q500 ${800 - 60 * k} ${300 + 400 * k} ${900 - 120 * k}`} fill="none" stroke={INK} strokeWidth="8" strokeDasharray="14 16" strokeDashoffset={-T * 40} opacity={k} />
    {k > 0 && <g transform={`translate(720 ${760 + osc(T, 2.4) * 12}) scale(${0.6 + 0.4 * k})`} opacity={k}><circle r="120" fill="#fff" /><text y="-20" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={INK}>THAT EMAIL</text>
      <text y="30" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill={RED}>THE BILL</text><text y="78" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="28" fill={TEAL}>WHAT SHE SAID</text></g>}
    <Chip x={300} y={1600} text="BODY: HERE" fill={CREAM} size={32} k={pop(t, 0.2)} />
    {t > c2 && <Chip x={700} y={1000} text="HEAD: ELSEWHERE" fill={RED} col="#fff" size={30} k={pop(t, c2)} />}
  </g>);
}

/* 3 — snapback: a big DOING vs THINKING scale; the THINKING pan drops hard; Sam shocked */
function WMSnap({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.5), tip = tw(t, c3 - 0.1, 0.5) * 18;
  return (<g>
    <circle cx="486" cy="1200" r="440" fill="#F4D77A" />
    <g transform={`translate(486 860)`}><rect x="-12" y="0" width="24" height="420" fill={INK} /><path d="M-90 440 L90 440 L60 400 L-60 400 Z" fill={INK} />
      <g transform={`rotate(${tip})`}><rect x="-330" y="-12" width="660" height="24" rx="12" fill={INK} />
        {[[-300, 'DOING', TEAL], [300, 'THINKING', RED]].map(([x, l, c], i) => (<g key={i} transform={`translate(${x} 0) rotate(${-tip})`}><line x1="0" y1="0" x2="0" y2="120" stroke={INK} strokeWidth="6" />
          <path d="M-130 120 L130 120 Q110 190 0 190 Q-110 190 -130 120 Z" fill={c} /><text y="172" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={i ? 32 : 36} fill="#fff">{l}</text></g>))}</g></g>
    <T2Bust who="sam" x={486} y={1500} s={0.4} T={T} mood={t > c3 ? 'shocked' : 'calm'} look={8} disc={false} />
  </g>);
}

/* 4 — the study: phones buzzing on a grid, each asking "WHAT ARE YOU THINKING ABOUT?" */
function WMStudy({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.8);
  return (<g>
    <Chip x={486} y={700} text="SCIENCE · 2010" k={pop(t, 0)} size={32} />
    {[...Array(6)].map((_, i) => { const x = 206 + (i % 3) * 280, y = 950 + Math.floor(i / 3) * 400, k = pop(t, 0.3 + i * 0.18), buzz = t > c3 ? osc(T, 0.08, i) * 4 : 0;
      return k > 0 && (<g key={i} transform={`translate(${x + buzz} ${y}) scale(${k}) rotate(${(i % 2 ? 4 : -4)})`}><rect x="-100" y="-170" width="200" height="340" rx="28" fill={INK} /><rect x="-86" y="-150" width="172" height="300" rx="16" fill="#F7F4EC" />
        <rect x="-70" y="-110" width="140" height="110" rx="14" fill={i === 2 ? YEL : '#DDD6C8'} /><text y="-62" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="22" fill={INK}>WHAT ARE</text>
        <text y="-34" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="22" fill={INK}>YOU THINKING?</text>
        {[0, 1, 2].map((j) => <rect key={j} x="-70" y={30 + j * 34} width={140 - j * 30} height="18" rx="9" fill="#C9C1B0" />)}</g>); })}
    <Chip x={486} y={1660} text="2,250 PEOPLE · RANDOM PINGS" fill={CREAM} size={28} k={pop(t, 0.9)} />
  </g>);
}

/* 5 — nearly half: a big pie fills to just under 50% (red = elsewhere) */
function WMHalf({ T, t }) {
  const p = 0.469 * tw(t, 0.2, 1.0), a = p * TAU, r = 300, cx = 486, cy = 1130;
  const x = cx + r * Math.sin(a), y = cy - r * Math.cos(a);
  return (<g>
    <circle cx={cx} cy={cy} r={r + 30} fill="#8E1820" />
    <circle cx={cx} cy={cy} r={r} fill={CREAM} />
    {p > 0 && <path d={`M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${x} ${y} Z`} fill={YEL} />}
    <text x={cx + 120} y={cy + 20} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="44" fill={INK}>ELSEWHERE</text>
    <text x={cx - 130} y={cy + 20} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="40" fill={INK}>HERE</text>
    <Chip x={486} y={1560} text="NEARLY HALF" fill={INK} col={YEL} size={40} k={pop(t, 0.9)} />
  </g>);
}

/* 6 — turn: two moods side by side; focused Sam smiles, drifting Sam has a little rain cloud */
function WMUnhappy({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.9);
  return (<g>
    <rect x="0" y="700" width="486" height="1028" fill="#2C4F92" /><rect x="486" y="700" width="486" height="1028" fill="#4A2E78" />
    <Chip x={243} y={790} text="HERE" fill={CREAM} size={34} k={pop(t, 0)} />
    <Chip x={729} y={790} text="DRIFTING" fill={CREAM} size={34} k={pop(t, 0.2)} />
    <T2Bust who="sam" x={243} y={1260} s={0.4} T={T} mood="happy" look={0} disc={false} />
    <T2Bust who="sam" x={729} y={1260} s={0.4} T={T} mood={t > c1 ? 'sad' : 'calm'} look={0} ph={0.5} disc={false} />
    {t > c1 - 0.2 && <g transform={`translate(729 ${960 + osc(T, 2) * 8}) scale(${pop(t, c1 - 0.2)})`}><circle cx="-60" cy="0" r="50" fill="#9AA3B5" /><circle cx="10" cy="-26" r="62" fill="#9AA3B5" /><circle cx="70" cy="4" r="46" fill="#9AA3B5" /><rect x="-110" y="0" width="226" height="46" rx="23" fill="#9AA3B5" />
      {[0, 1, 2, 3].map((i) => { const p = (T * 1.6 + i / 4) % 1; return <line key={i} x1={-70 + i * 46} y1={56 + p * 120} x2={-78 + i * 46} y2={80 + p * 120} stroke="#7FC4E8" strokeWidth="7" strokeLinecap="round" opacity={1 - p} />; })}</g>}
    {[0, 1, 2].map((i) => <circle key={i} cx={160 + i * 80} cy={960 - ((T * 50 + i * 40) % 120)} r="10" fill={YEL} opacity={0.8} />)}
  </g>);
}

/* 7 — name it: the paper's title as a journal page, a rain cloud over UNHAPPY */
function WMName({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.6);
  return (<g>
    <circle cx="486" cy="1180" r="420" fill="#F09A4E" />
    <g transform={`translate(486 1150) rotate(-3) scale(${pop(t, 0.1, 0.45)})`}><rect x="-300" y="-380" width="600" height="760" rx="20" fill="#F7F4EC" />
      <rect x="-300" y="-380" width="600" height="90" rx="20" fill={INK} /><text y="-322" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="34" fill="#fff">SCIENCE</text>
      {[['A WANDERING', -170], ['MIND IS AN', -90], ['UNHAPPY', 10], ['MIND', 90]].map(([w, y], i) => <text key={i} y={y} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={i === 2 ? 80 : 56} fill={i === 2 ? RED : INK}>{w}</text>)}
      {[0, 1, 2, 3].map((i) => <rect key={i} x="-240" y={170 + i * 40} width={480 - i * 60} height="16" rx="8" fill="#C9C1B0" />)}</g>
    {t > c2 && <circle cx="486" cy="1160" r="170" fill="none" stroke={YEL} strokeWidth="10" strokeDasharray="1070" strokeDashoffset={1070 * (1 - tw(t, c2, 0.5))} />}
  </g>);
}

/* 8 — self-proof: a book; the same page's line-highlight goes back to the top three times; Sam squints */
function WMProof({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.8), lap = cl(t / 0.8), n = Math.min(3, Math.floor(t / 0.8) + 1), y = 900 + ((t / 0.8) % 1) * 400;
  return (<g>
    <circle cx="486" cy="1220" r="420" fill="#3E8A94" />
    <g transform="translate(486 1100)"><path d="M-380 -260 Q-190 -300 0 -250 Q190 -300 380 -260 L380 280 Q190 240 0 290 Q-190 240 -380 280 Z" fill="#F7F4EC" /><line x1="0" y1="-250" x2="0" y2="290" stroke="#C9C1B0" strokeWidth="6" />
      {[...Array(9)].map((_, i) => <g key={i}><rect x="-340" y={-200 + i * 52} width={300 - (i % 3) * 30} height="16" rx="8" fill="#C9C1B0" /><rect x="40" y={-200 + i * 52} width={300 - (i % 4) * 25} height="16" rx="8" fill="#C9C1B0" /></g>)}</g>
    <rect x="130" y={y - 20} width="320" height="34" rx="10" fill={YEL} opacity="0.6" />
    <Chip x={760} y={820} text={`READ: ${n}×`} fill={RED} col="#fff" size={36} k={pop(t, 0.1)} />
    <T2Bust who="sam" x={486} y={1520} s={0.38} T={T} mood={t > c3 ? 'smug' : 'nervous'} look={0} disc={false} />
  </g>);
}

/* 9 — outro: back in the shower, the thought cloud pops and Sam just feels the water; question + send chips */
function WMOutro({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.9), c3 = bt(beats, 3, 1.8), cloud = 1 - tw(t, 0.2, 0.4);
  return (<g>
    <Shower T={T} cx={420} />
    <T2Bust who="sam" x={420} y={1240} s={0.6} T={T} mood="happy" look={0} disc={false} />
    {cloud > 0.05 && <Thought x={700} y={820} k={cloud} tx={540} ty={1040}><Calendar x={0} y={0} s={0.8} /></Thought>}
    {t > 0.5 && [0, 1, 2, 3, 4].map((i) => { const p = cl((t - 0.5) * 1.5); return <circle key={i} cx={700 + Math.cos(i * 1.3) * 200 * p} cy={820 + Math.sin(i * 1.3) * 160 * p} r={14 * (1 - p)} fill="#fff" />; })}
    <rect x="0" y="1560" width="972" height="168" fill="#B9C9D6" />
    {t > c1 && <Chip x={486} y={760} text="WHERE DID YOUR MIND GO?" k={pop(t, c1)} fill={YEL} size={34} />}
    {t > c3 && <Chip x={486} y={860} text="SEND IT TO THAT FRIEND" k={pop(t, c3)} fill={RED} col="#fff" size={30} />}
  </g>);
}

Object.assign(window, { WMShower, WMYou, WMSnap, WMStudy, WMHalf, WMUnhappy, WMName, WMProof, WMOutro });
})();
