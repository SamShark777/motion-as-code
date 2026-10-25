// art.jsx — "Word for Word" (Zoe ep. 2, mirroring and tips). Stick cast from stick-kit.jsx; ground at y=1150.
const GY = 1150, Y = '#F5D33A', W = '#F2F2F2', LAV = '#B79CFF';
const HW = "'Caveat Brush', cursive";
function Counter({ x = 540 }) { return <g><line x1={x - 200} y1="900" x2={x + 200} y2="900" stroke={W} strokeWidth="9" strokeLinecap="round" /><line x1={x - 170} y1="900" x2={x - 170} y2={GY} stroke={W} strokeWidth="9" /><line x1={x + 170} y1="900" x2={x + 170} y2={GY} stroke={W} strokeWidth="9" /></g>; }
function Jar({ x, y, fill = 0.1, s = 1 }) { const h = 160 * Math.min(1, fill);
  return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-60" y={-h} width="120" height={h} fill={Y} opacity="0.85" /><path d="M-70 -200 L-70 0 L70 0 L70 -200" fill="none" stroke={W} strokeWidth="8" strokeLinejoin="round" /><line x1="-80" y1="-200" x2="80" y2="-200" stroke={W} strokeWidth="8" strokeLinecap="round" />
    <text y="-90" textAnchor="middle" fontFamily={HW} fontSize="44" fill={W}>tips</text></g>; }
function Say({ x, y, txt, col = W, w = 380 }) { return <StickBubble x={x} y={y} w={w} h={130} text={txt} size={52} color={col} tail={-1} />; }

/* 1 — Zoe behind the café counter, near-empty tip jar */
function ArtS6Cafe({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="zoe" x={420} y={GY} pose="stand" mood="neutral" T={T} />
    <Counter x={540} /><Jar x={660} y={900} fill={0.08} s={0.8} />
    <Stick who="extra" x={900} y={GY} pose="walk" mood="neutral" T={T} dir={-1} s={0.85} />
  </g>);
}

/* 2 — big smile, "coming right up!" — jar still empty */
function ArtS6Smile({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="zoe" x={360} y={GY} pose="wave" mood="happy" T={T} />
    <Say x={640} y={500} txt="coming right up!" w={440} />
    <Jar x={800} y={1150} fill={0.08} />
    {t > 1.2 && <StickMark x={800} y={820} kind="…" T={T} size={110} color={W} />}
  </g>);
}

/* 3 — Maya drops a single coin, smug */
function ArtS6Coin({ T, t }) {
  const p = Math.min(1, t / 0.9);
  return (<g><StickGround y={GY} />
    <Stick who="maya" x={760} y={GY} pose="point" mood="smug" T={T} dir={-1} />
    <Stick who="zoe" x={240} y={GY} pose="stand" mood="sad" T={T} s={0.85} />
    <Jar x={500} y={1150} fill={0.1} />
    <circle cx="500" cy={720 + p * 300} r="22" fill={Y} />
    {p >= 1 && <text x="500" y="660" textAnchor="middle" fontFamily={HW} fontSize="70" fill={Y}>clink.</text>}
  </g>);
}

/* 4 — Zoe puzzled, one missing puzzle piece */
function ArtS6But({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="zoe" x={300} y={GY} pose="shrug" mood="worried" T={T} />
    <rect x="600" y="560" width="300" height="300" rx="16" fill="none" stroke={Y} strokeWidth="8" strokeDasharray="24 16" />
    <StickMark x={750} y={760} kind="?" T={T} size={150} />
  </g>);
}

/* 5 — 2003: waitress repeats the order back, word for word */
function ArtS6Study({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="extra" x={240} y={GY} pose="sit" mood="neutral" T={T} />
    <Say x={300} y={500} txt="soup, no onions" w={400} />
    <Stick who="extra" x={820} y={GY} pose="stand" mood="happy" T={T} dir={-1} />
    {t > 1.1 && <Say x={770} y={560} txt="soup, no onions" col={Y} w={400} />}
  </g>);
}

/* 6 — two tip jars: before and after, the second nearly double */
function ArtS6Double({ T, t }) {
  const p = Math.min(1, t / 1.0);
  return (<g><StickGround y={GY} />
    <Jar x={340} y={1100} fill={0.4} s={1.3} /><Jar x={740} y={1100} fill={0.4 + 0.38 * p} s={1.3} />
    <text x="340" y="760" textAnchor="middle" fontFamily={HW} fontSize="64" fill="#8a8a8a">before</text>
    <text x="740" y="640" textAnchor="middle" fontFamily={HW} fontSize="100" fill={Y} opacity={p}>×2</text>
  </g>);
}

/* 7 — mirroring: two figures, matching speech bubbles, a heart between */
function ArtS6Name({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="zoe" x={300} y={GY} pose="wave" mood="happy" T={T} />
    <Stick who="extra" x={780} y={GY} pose="wave" mood="happy" T={T} dir={-1} />
    <path d="M540 700 c-40 -50 -100 -10 -60 40 l60 60 l60 -60 c40 -50 -20 -90 -60 -40" fill={Y} transform={`translate(540 760) scale(${1 + 0.06 * STICK.osc(T, 0.8)}) translate(-540 -760)`} />
    <text x="540" y="560" textAnchor="middle" fontFamily={HW} fontSize="72" fill={LAV}>same words</text>
  </g>);
}

/* 8 — next shift: Zoe repeats, Maya at the counter, parrot squawk */
function ArtS6Next({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="zoe" x={300} y={GY} pose="point" mood="happy" T={T} />
    <Say x={380} y={500} txt="one oat latte!" col={Y} w={360} />
    <Jar x={560} y={1150} fill={0.75} s={0.75} />
    <Stick who="maya" x={860} y={GY} pose="hips" mood="smug" T={T} dir={-1} />
    {t > 1.6 && <StickBubble x={840} y={500} w={260} h={110} text="squawk?" size={52} color="#FF6B5B" tail={1} />}
  </g>);
}

Object.assign(window, { ArtS6But, ArtS6Cafe, ArtS6Coin, ArtS6Double, ArtS6Name, ArtS6Next, ArtS6Smile, ArtS6Study });
