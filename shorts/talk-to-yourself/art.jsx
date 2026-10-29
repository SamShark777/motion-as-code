// art.jsx — "Why She Talks to Herself by Name" (Nia ep. 2 / Milo ep. 3, ted-MG motion graphics).
// Full 1080×1920 frames with tedmg-kit.jsx. Props: T, t, dur, beats (chunk starts in the scene).
// Caption band y ≈ 1370–1590 (lines that need the space set capY). t can be negative before a scene starts.
(function () {
const { AMB: A, RED: R, INK: K, CREAM: CR, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const TILE = '#2b5560', TILE2 = '#24474f';

// bathroom tiles + a mirror; `children` is drawn inside the glass
const uid = () => 'nt' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
function Mirror({ T, children, glow = 0 }) {
  const u = uid();
  return (<g>
    <rect x="-300" y="-300" width="1680" height="2520" fill={TILE} />
    {[...Array(24)].map((_, i) => <line key={'h' + i} x1="-300" x2="1380" y1={i * 110 - 200} y2={i * 110 - 200} stroke={TILE2} strokeWidth="6" />)}
    {[...Array(14)].map((_, i) => <line key={'v' + i} y1="-300" y2="2220" x1={i * 110 - 200} x2={i * 110 - 200} stroke={TILE2} strokeWidth="6" />)}
    <defs><clipPath id={`clip${u}`}><rect x="150" y="290" width="780" height="1090" rx="70" /></clipPath>
      <linearGradient id={`glass${u}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#cfe4df" /><stop offset="1" stopColor="#8fb5b4" /></linearGradient></defs>
    <rect x="132" y="272" width="816" height="1126" rx="84" fill="#d9cbb0" stroke={K} strokeWidth="9" />
    <g clipPath={`url(#clip${u})`}><rect x="150" y="290" width="780" height="1090" fill={`url(#glass${u})`} />
      <MGGlow x={540} y={700} r={520} col="#fff8e0" a={0.35 + glow * 0.3} />
      {children}
      <path d="M260 290 L420 290 L180 700 L150 700 L150 470 Z" fill="#fff" opacity="0.18" />
      <path d="M840 1000 L930 860 L930 960 L880 1040 Z" fill="#fff" opacity="0.15" /></g>
    <rect x="150" y="290" width="780" height="1090" rx="70" fill="none" stroke={K} strokeWidth="9" />
    {[0, 1, 2].map((i) => <circle key={i} cx={420 + i * 120} cy={240 + OS(T, 1.6, i * 0.3) * 2} r="20" fill="#ffe7a8" stroke={K} strokeWidth="5" />)}
    <rect x="-300" y="1620" width="1680" height="400" fill="#e9e2d4" stroke={K} strokeWidth="9" />
    <ellipse cx="540" cy="1700" rx="300" ry="50" fill="#cfc6b4" stroke={K} strokeWidth="7" />
  </g>);
}
// talking mouth (alternates while speaking)
const talk = (t, from, to) => (t > from && t < to && Math.floor(t * 7) % 2 ? 'o' : 'grin');

/* 1 — hook: Nia hypes herself up in the mirror, using her own name */
function NTHook({ T, t, beats }) {
  const nm = b(beats, 3);
  return (<g><Mirror T={T} glow={SM(nm, nm + 0.3, t)}>
      <MGBust x={540} y={820} r={220} who="nia" mouth={talk(t, 0.1, nm + 0.6)} brow="angry" look={[0, 0.1]} bl={BL(T)} />
    </Mirror>
    <MGChip x={540} y={160} text="8:55 AM" outline size={42} pop={t / 0.25} />
    <MGBubble x={600} y={540} text={"OKAY, NIA.|YOU'VE GOT THIS."} k={(t - 0.25) / 0.3} size={46} />
    <MGRing cx={510} cy={360} rx={110} ry={58} p={(t - nm) / 0.4} /></g>);
}

/* 2 — Milo walks in behind her; countdown to his speech (the cliffhanger from ep. 1) */
function NTMilo({ T, t, beats }) {
  const c = b(beats, 1), secs = 300 - Math.max(0, Math.floor((t - c) * 3));
  const mx = lp(1180, 790, EO(t / 1.1));
  return (<g><MGBg kind="wall" c1="#d9c6a6" c2="#b39a78" />
    <rect x="30" y="300" width="260" height="400" rx="40" fill="#bcd7d3" stroke={K} strokeWidth="8" />
    <MGPerson x={320} y={1460} s={3.2} who="nia" mouth={talk(t, 0, 9)} brow="angry" look={[-1, 0]} bl={BL(T)} />
    <MGBubble x={330} y={740} text="YOU'RE READY, NIA." k={(t - 0.1) / 0.3} size={36} />
    <MGPerson x={mx} y={1460} s={3.3} who="milo" walk={t < 1.1 ? t * 9 : 0} brow={t > c ? 'worried' : 'flat'} mouth={t > 1.2 ? 'o' : 'flat'} look={[-1, 0]} sweat={t * 0.6} bl={BL(T, 0.5)} />
    {t > c && <MGChip x={540} y={240} text={`SPEECH IN ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`} outline size={48} pop={(t - c) / 0.25} />}
    <MGChip x={790} y={300} text="MILO · 24" size={36} pop={(t - 0.5) / 0.25} a={t < c ? 1 : 0} /></g>);
}

/* 3 — Milo's face: she's talking to herself?! */
function NTWeird({ T, t, beats }) {
  const c = b(beats, 1);
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" /><MGGlow x={300} y={400} r={500} col="#ff8fb1" a={0.12} />
    <MGBust x={540} y={820} r={230} who="milo" brow="up" browUp={t > c ? 1 : 0.4} mouth={t > c ? 'o' : 'flat'} look={[-0.9, -0.1]} bl={BL(T)} />
    <MGBubble x={760} y={520} text={"SHE'S TALKING|TO HERSELF?!"} k={(t - 0.15) / 0.3} size={44} />
    {[0, 1, 2].map((i) => { const k = BK((t - c - i * 0.1) / 0.3); return k > 0 && <text key={i} x={180 + i * 70} y={420 - i * 50} fontFamily="'Bebas Neue', sans-serif" fontSize={90 + i * 20} fill={A} transform={`rotate(${-12 + i * 10} ${180 + i * 70} ${420 - i * 50})`} opacity={cl(k)}>?</text>; })}</g>);
}

/* 4 — inside Milo's head: the "I" spiral */
const SPIRAL = [[300, 520, "I'LL FORGET IT"], [800, 430, "I'LL FREEZE"], [520, 270, "I'M DOOMED"]];
function NTSpiral({ T, t, beats }) {
  const ats = [b(beats, 1), b(beats, 2), b(beats, 2) + 0.45];
  const shake = t > ats[1] ? Math.sin(t * 60) * 7 * Math.exp(-(t - ats[1]) * 3) : 0;
  return (<g><MGBg kind="dark" /><MGGlow x={540} y={800} r={700} col="#c0392b" a={0.22 + 0.08 * OS(T, 0.9)} />
    <g transform={`translate(${shake} 0)`}>
      <MGBust x={540} y={860} r={220} who="milo" brow="worried" mouth="wave" look={[0, 0.6]} sweat={t * 0.8} blush={0.8} bl={BL(T)} />
      {SPIRAL.map(([x, y, s], i) => <MGBubble key={i} x={x} y={y} text={s} k={(t - ats[i]) / 0.3} size={46} />)}
    </g>
    {t > ats[1] && <MGArrows x={540} y={860} t={t - ats[1]} n={8} from={800} to={330} />}</g>);
}

/* 5 — 2014: Ethan Kross tests 89 students */
function NTKross({ T, t, beats }) {
  const c1 = b(beats, 1), c2 = b(beats, 2), c3 = b(beats, 3);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={250} text="KROSS ET AL. · 2014" outline size={46} pop={(t - c1) / 0.25} />
    <MGHeadGrid T={T} on={20 * SM(c2, c2 + 0.9, t)} y0={480} dy={210} />
    {t > c2 && <MGBigNum x={540} y={1440} text="89" size={190} col={A} />}
    <MGRing cx={540} cy={800} rx={470} ry={420} rot={-4} p={(t - c3) / 0.45} /></g>);
}

/* 6 — five minutes to prepare a speech for judges */
function NTStudy({ T, t, beats }) {
  const c = b(beats, 2), secs = Math.max(0, 300 - Math.floor(Math.max(0, t) * 55));
  const st = MG.extra(4);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1340} wTop={160} wBot={600} a={0.5} />
    <MGPerson x={540} y={1340} s={2.3} who={st} brow="worried" mouth="wave" look={[0, 0.4]} sweat={t * 0.6} bl={BL(T)} />
    <MGMic x={540} y={1360} />
    <MGChip x={540} y={240} text={`PREP ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`} outline size={52} pop={t / 0.25} />
    {[250, 830].map((x, i) => { const e = MG.extra(6 + i * 3), k = EO((t - c - i * 0.12) / 0.35);
      return (<g key={i} transform={`translate(0 ${(1 - k) * 400})`}>
        <ellipse cx={x} cy={1880} rx={210} ry={190} fill={e.top} stroke={K} strokeWidth="7" />
        <MGHead x={x} y={1720} r={115} who={e} brow="angry" mouth="flat" look={[(540 - x) / 400, -0.8]} bl={BL(T, i)} />
        <rect x={x + (i ? -250 : 120)} y={1700} width="120" height="160" rx="10" fill="#f4efe4" stroke={K} strokeWidth="6" transform={`rotate(${i ? 8 : -8} ${x} 1800)`} /></g>); })}</g>);
}

/* 7 — split screen: "I" vs own name */
function NTSplit({ T, t, beats }) {
  const c2 = b(beats, 2), c3 = b(beats, 3), L = MG.extra(4), Rr = MG.extra(7), u = uid();
  return (<g><defs><clipPath id={`L${u}`}><rect x="-300" y="-300" width="840" height="2520" /></clipPath><clipPath id={`R${u}`}><rect x="540" y="-300" width="840" height="2520" /></clipPath></defs>
    <g clipPath={`url(#L${u})`}><MGBg kind="wall" c1="#5a2a3a" c2="#2c1520" />
      <MGBust x={270} y={830} r={150} who={L} brow="worried" mouth="wave" look={[0, 0.5]} sweat={t * 0.6} bl={BL(T)} /></g>
    <g clipPath={`url(#R${u})`}><MGBg kind="wall" c1="#2a5a50" c2="#15302a" />
      <MGBust x={810} y={830} r={150} who={Rr} brow={t > c3 ? 'up' : 'worried'} mouth={t > c3 + 0.3 ? 'smile' : 'flat'} look={[0, 0.2]} bl={BL(T, 0.6)} /></g>
    <rect x="532" y="-300" width="16" height="2520" fill={K} />
    <MGChip x={270} y={240} text="“I”" size={60} pop={(t - c2) / 0.25} />
    <MGChip x={810} y={240} text="OWN NAME" size={50} pop={(t - c3) / 0.25} />
    <MGBubble x={270} y={600} text={"I CAN'T|DO THIS"} k={(t - c2 - 0.1) / 0.3} size={40} />
    <MGBubble x={810} y={600} text={"ALEX, YOU|CAN DO THIS"} k={(t - c3 - 0.15) / 0.3} size={40} /></g>);
}

/* 8 — the ratings: name group better, and less shame afterwards */
function NTResult({ T, t, beats }) {
  const c2 = b(beats, 2), c3 = b(beats, 3);
  const g = EO((t - 0.2) / 0.7), hL = 360 * g, hR = lp(360, 640, EO((t - c2) / 0.5)) * g;
  const L = MG.extra(4), Rr = MG.extra(7);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={230} text="SPEECH RATINGS" outline size={46} pop={t / 0.25} />
    <line x1="140" x2="940" y1="1260" y2="1260" stroke="#8a90b0" strokeWidth="6" />
    {[[330, hL, '#6a5a7a', L, '“I”'], [750, hR, A, Rr, 'NAME']].map(([x, h, col, who, lab], i) => (
      <g key={i}><rect x={x - 130} y={1260 - h} width="260" height={h} rx="14" fill={col} stroke={K} strokeWidth="7" />
        <MGHead x={x} y={1260 - h - 100} r={85} who={who} brow={i ? 'up' : 'worried'} mouth={i ? (t > c2 ? 'grin' : 'smile') : 'wave'} blush={i ? 0 : SM(c3, c3 + 0.4, t)} bl={BL(T, i)} look={[0, 0.2]} />
        <text x={x} y="1335" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="64" fill="#fff">{lab}</text></g>))}
    {[...Array(10)].map((_, i) => { const k = cl((t - c2 - 0.1) / 0.5), a = i / 10 * 6.28; return k > 0 && k < 1 && <circle key={i} cx={750 + Math.cos(a) * 200 * k} cy={1260 - hR - 100 + Math.sin(a) * 200 * k} r="9" fill={A} opacity={1 - k} />; })}
    <MGChip x={750} y={330} text="LESS SHAME" size={42} pop={(t - c3 - 0.2) / 0.25} /></g>);
}

/* 9 — name it: Milo steps outside himself (the coach version of him) */
function NTName({ T, t, beats }) {
  const c = b(beats, 1), k = EO((t - c) / 0.8);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1360} wTop={170} wBot={620} a={0.5} />
    <g opacity={0.5 * cl(k * 3)}><MGPerson x={lp(540, 800, k)} y={lp(1360, 1300, k)} s={lp(2.6, 2.1, k)} who="milo" brow="up" mouth="smile" look={[-1, 0.2]} /></g>
    <MGPerson x={lp(540, 420, k)} y={1360} s={2.6} who="milo" brow={k > 0.5 ? 'flat' : 'worried'} mouth={k > 0.7 ? 'smile' : 'wave'} look={[k * 0.8, 0]} bl={BL(T)} />
    <MGChip x={540} y={250} text="PSYCHOLOGY" size={44} pop={t / 0.25} />
    {k > 0.3 && <MGBubble x={830} y={640} text={"YOU KNOW|THIS, MILO."} k={(t - c - 0.3) / 0.3} size={38} />}</g>);
}

/* 10 — payoff: Milo coaches himself in the mirror, then the stage — calm */
function NTPayoff({ T, t, beats }) {
  const c1 = b(beats, 2), c2 = b(beats, 3), cut = c2 + 0.55;
  if (t < cut) return (<g><Mirror T={T} glow={SM(c2, c2 + 0.3, t)}>
      <MGBust x={540} y={820} r={220} who="milo" brow={t > c2 ? 'up' : 'worried'} mouth={t > c2 ? 'smile' : talk(t, c1, c2)} look={[0, 0.1]} bl={BL(T)} />
    </Mirror>
    <MGBubble x={560} y={540} text={"MILO, YOU'VE DONE|HARDER THINGS."} k={(t - c1) / 0.3} size={44} /></g>);
  const lt = t - cut;
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1360} wTop={160} wBot={560} a={0.55 * SM(0, 0.3, lt)} /><MGMic x={560} y={1370} />
    <MGPerson x={470} y={1360} s={2.4} who="milo" brow="up" mouth="grin" bl={BL(T)} />
    <MGPerson x={1000} y={1380} s={1.7} who="nia" brow="up" mouth="grin" look={[-1, 0]} />
    <MGChip x={540} y={250} text="9:00 AM · ON STAGE" outline size={46} pop={lt / 0.25} /></g>);
}

Object.assign(window, { NTHook, NTMilo, NTWeird, NTSpiral, NTKross, NTStudy, NTSplit, NTResult, NTName, NTPayoff });
})();
