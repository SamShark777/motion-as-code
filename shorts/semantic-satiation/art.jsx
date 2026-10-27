// art.jsx — "Say It Until It Breaks" (Ted type 2, Leo + Priya). 972×1728 card; captions sit in the top third,
// subjects stay in the lower 60%. Pure functions of T (global s) and t (s into the scene). People via <T2Bust>.
(function () {
const INK = '#141821', CREAM = '#E9E4D8', TAU = Math.PI * 2;
const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const tw = (t, s, d) => Easing.easeOutCubic(cl((t - s) / d));
const pop = (t, s, d = 0.35) => Easing.easeOutBack(cl((t - s) / d));
const BOLD = 'Montserrat, sans-serif';

// a word whose letters drift apart and spin by `mess` (0 = clean)
function Word({ x, y, text, size = 120, mess = 0, col = INK, seed = 1 }) {
  const w = size * 0.72;
  return (<g>{text.split('').map((c, i) => { const ox = (i - (text.length - 1) / 2) * w;
    const dx = (hsh(i + seed) - 0.5) * 220 * mess, dy = (hsh(i * 3 + seed) - 0.5) * 260 * mess, r = (hsh(i * 7 + seed) - 0.5) * 140 * mess;
    return <text key={i} x={x + ox + dx} y={y + dy} textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize={size} fill={col} transform={`rotate(${r} ${x + ox + dx} ${y + dy - size * 0.35})`}>{c}</text>; })}</g>);
}
function Spoon({ x, y, rot = 0, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx="0" cy="-150" rx="70" ry="100" fill="#C9CED6" /><ellipse cx="-14" cy="-170" rx="30" ry="50" fill="#fff" opacity="0.6" />
    <rect x="-16" y="-60" width="32" height="300" rx="16" fill="#C9CED6" /></g>);
}

/* 1 — hook: Leo repeats a word; it flies out of his mouth and frays */
function ArtRepeat({ T, t }) {
  return (<g>
    <T2Bust who="leo" x={486} y={1250} T={T} mood="happy" />
    {[0, 1, 2, 3].map((i) => { const p = ((t * 0.55 + i / 4) % 1);
      return <g key={i} opacity={Math.sin(p * Math.PI)}><Word x={486 + (i % 2 ? 1 : -1) * 120 * p} y={1000 - p * 330} text="WORD" size={78 + p * 30} mess={p * 0.9} col="#fff" seed={i + 3} /></g>; })}
  </g>);
}

/* 2 — spoon, spoon, spoon (counter climbs) */
function ArtSpoon({ T, t }) {
  const n = Math.min(20, 1 + Math.floor(t * 3.2));
  return (<g>
    <T2Bust who="leo" x={420} y={1260} s={0.95} T={T} mood="smug" />
    <Spoon x={760} y={1300} rot={12 + osc(T, 0.6) * 10} s={1.1} />
    <g transform={`translate(760 760) scale(${pop(t, 0.1)})`}><circle r="110" fill="#E07A2E" />
      <text y="30" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="86" fill="#fff">×{n}</text></g>
  </g>);
}

/* 3 — by the twentieth spoon it's a weird noise: letters scatter, Leo baffled */
function ArtNoise({ T, t }) {
  const m = tw(t, 0.3, 1.8);
  return (<g>
    <T2Bust who="leo" x={486} y={1300} s={0.9} T={T} mood="shocked" />
    <Word x={486} y={820} text="SPOON" size={130} mess={m} col={INK} seed={11} />
    {[...Array(6)].map((_, i) => <path key={i} d={`M${200 + i * 110} ${640 + osc(T, 0.5, i * 0.2) * 20} q20 -30 40 0 t40 0`} fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" opacity={m * 0.7} />)}
  </g>);
}

/* 4 — 1907: stare at one word for three minutes */
function ArtStare({ T, t }) {
  const sec = Math.min(180, Math.floor(t * 50)), mm = Math.floor(sec / 60), ss = String(sec % 60).padStart(2, '0');
  const open = blinkOpen(T);
  return (<g>
    <g transform="translate(486 1180) rotate(-3)"><rect x="-300" y="-200" width="600" height="400" rx="8" fill="#F3E9D2" />
      <rect x="-300" y="-200" width="600" height="400" rx="8" fill="none" stroke="#C9B48A" strokeWidth="10" />
      <text x="0" y="40" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="130" fill={INK}>chair</text>
      <text x="0" y="160" textAnchor="middle" fontFamily="Georgia, serif" fontSize="34" fill="#8A7A5A">— 1907 —</text></g>
    <g transform="translate(486 720)"><ellipse rx="210" ry={110 * open} fill="#fff" /><circle r={70 * Math.min(1, open * 1.5)} fill="#2B6E7A" /><circle r={34 * Math.min(1, open * 1.5)} fill={INK} />
      <path d="M-230 0 Q0 -170 230 0" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" /></g>
    <g transform="translate(486 1520)"><rect x="-150" y="-60" width="300" height="110" rx="55" fill={INK} />
      <text y="22" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="64" fill="#FFD23F">{mm}:{ss}</text></g>
  </g>);
}
const blinkOpen = (T) => (((T % 2.7) < 0.12) ? 0.1 : 1);

/* 5 — the word turns into meaningless shapes */
function ArtShapes({ T, t }) {
  const k = tw(t, 0.4, 1.4), L = 'chair'.split('');
  return (<g>
    <circle cx="486" cy="1150" r="400" fill="#C42A34" />
    {L.map((c, i) => { const x = 486 + (i - 2) * 140, y = 1150, sp = osc(T, 3, i * 0.2) * 10;
      return (<g key={i} transform={`translate(${x} ${y + sp})`}>
        <text y="45" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="160" fill="#fff" opacity={1 - k}>{c}</text>
        <g opacity={k} transform={`rotate(${k * (hsh(i) - 0.5) * 120}) scale(${0.5 + 0.5 * k})`}>
          {i % 3 === 0 && <rect x="-50" y="-50" width="100" height="100" fill="#FFD23F" />}
          {i % 3 === 1 && <circle r="55" fill="#fff" />}
          {i % 3 === 2 && <path d="M0 -60 L55 45 L-55 45 Z" fill="#1F3B73" />}</g></g>); })}
  </g>);
}

/* 6 — Priya explains: the meaning cells get tired (sleepy neurons) */
function ArtTired({ T, t }) {
  const droop = tw(t, 1.2, 1.0);
  const cell = (x, y, i) => (<g key={i} transform={`translate(${x} ${y}) rotate(${droop * (i % 2 ? 18 : -18)})`}>
    {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M0 0 Q${Math.cos(k * 1.26) * 60} ${Math.sin(k * 1.26) * 60 + droop * 30} ${Math.cos(k * 1.26) * 110} ${Math.sin(k * 1.26) * 110 + droop * 60}`} fill="none" stroke="#FFD23F" strokeWidth="10" strokeLinecap="round" />)}
    <circle r="46" fill="#FFD23F" /><path d={`M-22 -4 q11 ${8 - droop * 8} 22 0 M2 -4 q11 ${8 - droop * 8} 22 0`} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" transform="translate(-2 0)" />
    {droop > 0.5 && <text x="40" y={-60 - ((T * 40) % 40)} fontFamily={BOLD} fontWeight="900" fontSize="40" fill="#fff" opacity={0.8}>z</text>}</g>);
  return (<g>
    <T2Bust who="priya" x={600} y={1260} s={0.9} T={T} mood="smug" />
    {[[200, 760], [430, 640], [250, 1010]].map(([x, y], i) => cell(x, y + osc(T, 2, i * 0.3) * 8, i))}
    {[[200, 760, 430, 640], [430, 640, 250, 1010]].map(([a, b2, c, d], i) => <line key={i} x1={a} y1={b2} x2={c} y2={d} stroke="#FFD23F" strokeWidth="5" opacity={0.5 - droop * 0.3} />)}
  </g>);
}

/* 7 — name it: a dictionary entry stamped 1962 */
function ArtName({ T, t }) {
  const s = pop(t, 0.9, 0.3);
  return (<g>
    <g transform={`translate(486 1180) rotate(${-4 + osc(T, 3) * 1})`}>
      <rect x="-330" y="-240" width="660" height="480" rx="16" fill="#8E1820" /><rect x="-310" y="-220" width="620" height="440" rx="8" fill={CREAM} />
      <text x="-270" y="-120" fontFamily="Georgia, serif" fontWeight="700" fontSize="56" fill={INK}>semantic</text>
      <text x="-270" y="-50" fontFamily="Georgia, serif" fontWeight="700" fontSize="56" fill={INK}>satiation (n.)</text>
      {[0, 1, 2].map((i) => <rect key={i} x="-270" y={10 + i * 50} width={[500, 420, 460][i]} height="18" rx="9" fill="#C9C0AE" />)}</g>
    <g transform={`translate(700 1430) rotate(-14) scale(${2 - s})`} opacity={cl(s * 2)}>
      <rect x="-170" y="-60" width="340" height="120" rx="12" fill="none" stroke="#B3202A" strokeWidth="12" />
      <text y="26" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="72" fill="#B3202A">1962</text></g>
  </g>);
}

/* 8 — outro: Leo's own name tag wobbles apart… then snaps back */
function ArtName2({ T, t }) {
  const m = tw(t, 0.2, 1.0) * (1 - tw(t, 2.2, 0.5));
  return (<g>
    <T2Bust who="leo" x={486} y={1180} s={0.85} T={T} mood={m > 0.5 ? 'shocked' : 'happy'} />
    <g transform="translate(486 1520) rotate(-3)"><rect x="-230" y="-110" width="460" height="220" rx="18" fill="#fff" />
      <rect x="-230" y="-110" width="460" height="80" rx="18" fill="#B3202A" /><rect x="-230" y="-50" width="460" height="20" fill="#B3202A" />
      <text y="-58" textAnchor="middle" fontFamily={BOLD} fontWeight="900" fontSize="38" fill="#fff">HELLO, MY NAME IS</text>
      <Word x={0} y={80} text="LEO" size={100} mess={m} col={INK} seed={5} /></g>
  </g>);
}

Object.assign(window, { ArtRepeat, ArtSpoon, ArtNoise, ArtStare, ArtShapes, ArtTired, ArtName, ArtName2 });
})();
