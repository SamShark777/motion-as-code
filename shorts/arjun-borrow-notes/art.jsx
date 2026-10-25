// art.jsx — "The Favor Trick" (Arjun ep. 2, the Ben Franklin effect). Stick cast from stick-kit.jsx; ground at y=1150.
const GY = 1150, Y = '#F5D33A', W = '#F2F2F2', LAV = '#B79CFF';
const HW = "'Caveat Brush', cursive";
function Cup({ x, y, s = 1 }) { return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-22 -30 h44 l-6 60 h-32 Z" fill="#0b0b0b" stroke={W} strokeWidth="6" strokeLinejoin="round" /><path d="M22 -16 c18 0 18 24 0 24" fill="none" stroke={W} strokeWidth="6" /></g>; }
function Book({ x, y, s = 1, col = W }) { return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-60" y="-80" width="120" height="160" rx="8" fill="#0b0b0b" stroke={col} strokeWidth="7" /><line x1="-40" y1="-40" x2="40" y2="-40" stroke={col} strokeWidth="5" /><line x1="-40" y1="-10" x2="30" y2="-10" stroke={col} strokeWidth="5" /></g>; }
function Pen({ x, y, rot = -30, col = Y }) { return <g transform={`translate(${x} ${y}) rotate(${rot})`}><rect x="-8" y="-60" width="16" height="110" rx="6" fill={col} /><path d="M-8 50 L0 72 L8 50 Z" fill={W} /></g>; }
function Heart({ x, y, s = 1, col = Y }) { return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 30 C-60 -10 -40 -60 0 -30 C40 -60 60 -10 0 30 Z" fill={col} />; }

/* 1 — Arjun hands Zoe a coffee, little hearts over his head */
function ArtS7Crush({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={320} y={GY} pose="point" mood="happy" T={T} />
    <Cup x={460} y={760} s={1.2} />
    <Stick who="zoe" x={780} y={GY} pose="stand" mood="neutral" T={T} dir={-1} />
    <Heart x={320} y={540 + STICK.osc(T, 1.2) * 8} s={0.9} />
  </g>);
}

/* 2 — montage: coffee, notes, books stacking up in Arjun's arms */
function ArtS7Favors({ T, t }) {
  const n = Math.min(3, 1 + Math.floor(t / 0.6));
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={420} y={GY} pose="cross" mood="worried" T={T} />
    {n > 0 && <Cup x={720} y={600} s={1.4} />}
    {n > 1 && <Book x={860} y={760} s={0.9} />}
    {n > 2 && <g><Book x={560} y={840} s={0.8} /><Book x={560} y={780} s={0.8} /></g>}
    <text x="760" y="1080" textAnchor="middle" fontFamily={HW} fontSize="66" fill={Y}>{'day ' + n}</text>
  </g>);
}

/* 3 — Zoe: "thanks!" ×3, Arjun deflates */
function ArtS7Thanks({ T, t }) {
  const n = Math.min(3, 1 + Math.floor(t / 0.5));
  return (<g><StickGround y={GY} />
    <Stick who="zoe" x={760} y={GY} pose="wave" mood="happy" T={T} dir={-1} />
    {Array.from({ length: n }).map((_, i) => <text key={i} x={520} y={480 + i * 90} textAnchor="middle" fontFamily={HW} fontSize="66" fill={LAV}>thanks!</text>)}
    <Stick who="arjun" x={260} y={GY} pose="stand" mood="sad" T={T} s={0.85} />
  </g>);
}

/* 4 — Maya rolls her eyes, points at Zoe */
function ArtS7Maya({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="maya" x={420} y={GY} pose="point" mood="smug" T={T} />
    <StickBubble x={420} y={540} w={360} h={130} text="ask HER" size={60} color="#FF6B5B" tail={1} />
    <Stick who="arjun" x={150} y={GY} pose="shrug" mood="shocked" T={T} s={0.8} />
    <Stick who="zoe" x={880} y={GY} pose="stand" mood="neutral" T={T} dir={-1} s={0.75} op={0.6} />
  </g>);
}

/* 5 — Arjun asks to borrow her notes; Zoe lights up */
function ArtS7Borrow({ T, t }) {
  const lit = t > 1.4;
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={300} y={GY} pose="point" mood="worried" T={T} />
    <Book x={540} y={800} s={0.9} col={lit ? Y : W} />
    <Stick who="zoe" x={780} y={GY} pose={lit ? 'wave' : 'stand'} mood={lit ? 'happy' : 'neutral'} T={T} dir={-1} />
    {lit && [0, 1, 2].map((i) => <line key={i} x1={780 + (i - 1) * 70} y1={560} x2={780 + (i - 1) * 100} y2={500} stroke={Y} strokeWidth="8" strokeLinecap="round" />)}
  </g>);
}

/* 6 — 1969: a participant hands back prize money; liking meter rises */
function ArtS7Study({ T, t }) {
  const p = Math.min(1, t / 1.6);
  return (<g><StickGround y={GY} />
    <Stick who="extra" x={260} y={GY} pose="point" mood="neutral" T={T} />
    <g transform={`translate(${400 + p * 160} 800)`}><rect x="-60" y="-34" width="120" height="68" rx="8" fill="none" stroke={Y} strokeWidth="7" /><text y="18" textAnchor="middle" fontFamily={HW} fontSize="52" fill={Y}>$</text></g>
    <Stick who="extra" x={720} y={GY} pose="stand" mood="smug" T={T} dir={-1} />
    <g transform="translate(940 1100)"><rect x="-34" y="-460" width="68" height="460" rx="20" fill="none" stroke={W} strokeWidth="7" /><rect x="-24" y={-450 * (0.3 + 0.6 * p)} width="48" height={450 * (0.3 + 0.6 * p) - 10} rx="14" fill={Y} /></g>
    <text x="940" y="600" textAnchor="middle" fontFamily={HW} fontSize="44" fill={W}>liking</text>
  </g>);
}

/* 7 — the loop: I helped her → I must like her */
function ArtS7Name({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="zoe" x={300} y={GY} pose="stand" mood="happy" T={T} look={8} />
    <StickBubble x={720} y={640} w={480} h={260} think text="" tail={-1} />
    <text x="720" y="610" textAnchor="middle" fontFamily={HW} fontSize="54" fill={W}>I helped him…</text>
    <text x="720" y="690" textAnchor="middle" fontFamily={HW} fontSize="54" fill={Y}>so I like him?</text>
    <Book x={420} y={1080} s={0.5} />
  </g>);
}

/* 8 — a pile of borrowed pens; Maya facepalms */
function ArtS7Pens({ T, t }) {
  const n = Math.min(7, 1 + Math.floor(t / 0.3));
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={300} y={GY} pose="shrug" mood="happy" T={T} />
    {Array.from({ length: n }).map((_, i) => <Pen key={i} x={520 + (i % 4) * 50} y={1070 - Math.floor(i / 4) * 40} rot={-70 + i * 22} col={i % 2 ? Y : LAV} />)}
    <Stick who="maya" x={860} y={GY} pose="head" mood="angry" T={T} dir={-1} s={0.85} />
  </g>);
}

Object.assign(window, { ArtS7Borrow, ArtS7Crush, ArtS7Favors, ArtS7Maya, ArtS7Name, ArtS7Pens, ArtS7Study, ArtS7Thanks });
