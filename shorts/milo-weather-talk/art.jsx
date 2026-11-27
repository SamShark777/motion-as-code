// art.jsx — "Stop Talking About the Weather" (Milo ep. 13, with Nia; ted-MG motion graphics, character story).
// Kardas, Kumar & Epley 2021 (JPSP, "Overly Shallow?"): 12 experiments, 1,800+ people, mostly strangers; deep and
// shallow talks felt less awkward and more connecting than expected, more so the deep ones. Full 1080×1920 frames with
// tedmg-kit.jsx; captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh, extra } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif";
const GOOD = '#5fbf7a', SKY = '#8fc6ea';
const STR = extra(3); // the stranger Milo keeps talking to

/* little weather icons: sun / cloud / rain */
function Cloud({ x, y, s = 1, rain = 0, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {rain > 0 && [0, 1, 2, 3].map((i) => { const ph = ((T * 1.6 + i * 0.27) % 1); return <line key={i} x1={-60 + i * 40} y1={40 + ph * 90} x2={-70 + i * 40} y2={70 + ph * 90} stroke={SKY} strokeWidth="9" strokeLinecap="round" opacity={rain * (1 - ph)} />; })}
    <path d="M-90 40 Q-120 40 -120 10 Q-120 -25 -80 -25 Q-70 -70 -20 -70 Q30 -70 40 -30 Q90 -40 100 5 Q105 40 70 40 Z" fill="#eef2f6" stroke={K} strokeWidth="8" strokeLinejoin="round" /></g>);
}
function Sun({ x, y, s = 1, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${T * 20})`}>
    {[...Array(8)].map((_, i) => <line key={i} x1="0" y1="-70" x2="0" y2="-100" stroke={A} strokeWidth="12" strokeLinecap="round" transform={`rotate(${i * 45})`} />)}
    <circle r="55" fill={A} stroke={K} strokeWidth="8" /></g>);
}
function Speech({ x, y, text, k = 1, size = 44, flip = false }) {
  if (k <= 0) return null;
  const lines = text.split('|'), w = Math.max(...lines.map((l) => l.length)) * size * 0.52 + 60, h = lines.length * size * 1.15 + 40;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx="26" fill="#fff" stroke={K} strokeWidth="6" />
    <path d={flip ? `M${w * 0.15} -4 L${w * 0.3} 40 L${w * 0.3 - 40} -4` : `M${-w * 0.15} -4 L${-w * 0.3} 40 L${-w * 0.3 + 40} -4`} fill="#fff" stroke={K} strokeWidth="6" strokeLinejoin="round" />
    <rect x={-w / 2 + 6} y={-10} width={w - 12} height={10} fill="#fff" />
    {lines.map((l, i) => <text key={i} x="0" y={-h + 30 + size * 0.85 + i * size * 1.15} textAnchor="middle" fontFamily={BB} fontSize={size} letterSpacing="2" fill={K}>{l}</text>)}</g>);
}

/* 1 — hook: Milo at the party, cup in hand, a weather bubble over him */
function MGWeather({ T, t, beats }) {
  const c3 = b(beats, 3, 1.2), c4 = b(beats, 4, 1.8);
  return (<g><MGBg kind="party" T={T} />
    <MGPerson x={300} y={1320} s={4.2} who="milo" look={[1, -0.2]} brow="worried" mouth="smile" cup bl={BL(T)} />
    <MGPerson x={790} y={1320} s={4.2} who={STR} look={[-1, -0.2]} brow="flat" mouth={t > c4 ? 'flat' : 'smile'} bl={BL(T, 0.5)} />
    <Speech x={330} y={520} text={'NICE WEATHER,|HUH?'} k={(t - c3 + 0.15) / 0.3} />
    {t > c3 && <Cloud x={820} y={470} s={0.9} rain={1} T={T} />}
    <MGChip x={540} y={140} text="PARTY · 10:42 PM" size={40} pop={t / 0.25} />
    {t > c4 && <MGChip x={540} y={240} text="WEATHER CHAT #3" size={36} col={R} txt="#fff" pop={(t - c4) / 0.25} />}</g>);
}
/* 2 — to the viewer: a ladder of questions, deep ones look scary */
function MGYouToo({ T, t, beats }) {
  const c4 = b(beats, 4, 1.6);
  const rows = [['NICE WEATHER?', GOOD], ['WHAT DO YOU DO?', GOOD], ['WHAT ARE YOU PROUD OF?', A], ['WHEN DID YOU LAST CRY?', R]];
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={160} text="YOU, AT EVERY PARTY" size={40} pop={t / 0.25} />
    {rows.map(([q, c], i) => { const k = BK((t - 0.2 - i * 0.22) / 0.3), y = 360 + i * 190, deep = i >= 2;
      return (<g key={i} transform={`translate(540 ${y}) scale(${k})`} opacity={deep && t > c4 ? 0.45 : 1}>
        <rect x="-400" y="-70" width="800" height="140" rx="22" fill="#232a44" stroke={c} strokeWidth="8" />
        <text x="0" y="22" textAnchor="middle" fontFamily={BB} fontSize="68" letterSpacing="3" fill="#fff">{q}</text></g>); })}
    {t > c4 && <g transform={`translate(860 ${830 + osc(T, 3) * 6})`}><text textAnchor="middle" fontFamily={BB} fontSize="120" fill={R} transform={`scale(${BK((t - c4) / 0.3)})`}>!!</text></g>}
    <MGBust x={540} y={1240} r={80} who="milo" look={[0, -1]} brow="worried" mouth="wave" sweat={(T * 0.8) % 1} bl={BL(T)} /></g>);
}
/* 3 — snapback: the stranger's thought bubble: ASK ME SOMETHING REAL */
function MGWanted({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5);
  return (<g><MGBg kind="wall" c1="#4a3f63" c2="#2a2238" />
    <MGBust x={540} y={860} r={170} who={STR} look={[-0.3, 0]} brow={t > c1 ? 'up' : 'flat'} mouth={t > c1 ? 'smile' : 'flat'} bl={BL(T, 0.5)} />
    <MGBubble x={540} y={560} text={'PLEASE ASK ME|SOMETHING REAL'} k={(t - c1) / 0.3} size={50} />
    {t > c1 && <MGRing cx={540} cy={470} rx={360} ry={120} p={(t - c1 - 0.2) / 0.4} />}</g>);
}
/* 4 — problem: third chat, the topics tick by; Milo yawns at himself */
function MGThirdChat({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c2 = b(beats, 2, 1.2);
  return (<g><MGBg kind="party" T={T} dim={0.3} />
    <g opacity={SM(c1 - 0.2, c1 + 0.1, t)}><Cloud x={260} y={420} s={0.9} rain={1} T={T} /></g>
    <g opacity={SM(c1 + 0.2, c1 + 0.5, t)}><g transform="translate(800 420)"><rect x="-130" y="-60" width="260" height="120" rx="24" fill="#e04a3c" stroke={K} strokeWidth="8" />
      <circle cx="-70" cy="60" r="34" fill="#2a2a33" stroke={K} strokeWidth="7" /><circle cx="70" cy="60" r="34" fill="#2a2a33" stroke={K} strokeWidth="7" />
      <text x="0" y="16" textAnchor="middle" fontFamily={BB} fontSize="50" fill="#fff">TRAFFIC</text></g></g>
    <MGBust x={540} y={900} r={150} who="milo" look={[0, 0.2]} brow="flat" mouth={t > c2 ? 'o' : 'flat'} bl={t > c2 ? 0.7 : BL(T)} />
    {t > c2 && <text x="780" y="760" fontFamily={BB} fontSize="80" fill="#fff" opacity={SM(c2, c2 + 0.3, t)}>Z z z</text>}</g>);
}
/* 5 — Nia leans in with the dare */
function MGNiaDare({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  return (<g><MGBg kind="party" T={T} />
    <MGBust x={330} y={880} r={150} who="nia" look={[1, 0]} brow="up" mouth="grin" bl={BL(T, 0.3)} />
    <MGBust x={820} y={980} r={120} who="milo" look={[-1, -0.3]} brow="worried" mouth="o" bl={BL(T)} />
    <Speech x={420} y={520} text={'ASK SOMETHING|REAL.'} k={(t - 0.3) / 0.3} size={58} flip />
    {t > c2 && <MGArrows x={820} y={900} t={t - c2} n={4} from={380} to={200} />}</g>);
}
/* 6 — fear: Milo freezes, imagined stares */
function MGWeird({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0), k = SM(c2 - 0.2, c2 + 0.3, t);
  return (<g><MGBg kind="dark" />
    <MGSpot x={540} yTop={0} yBot={1300} wTop={180} wBot={700} a={0.45} />
    <MGCrowd T={T} t={t} lookAt={540} lookFrom={c2 - 0.2} mood={k > 0.5 ? 'o' : null} />
    <MGBust x={540} y={760} r={150} who="milo" look={[0, 0]} brow="worried" mouth="wave" sweat={(T * 0.9) % 1} bl={0} />
    <MGBubble x={540} y={470} text={"THEY'LL THINK|I'M WEIRD"} k={(t - 0.5) / 0.3} size={50} /></g>);
}
/* 7 — the study: 12 experiments, 1,800+ people in pairs */
function MGStudy12({ T, t, beats }) {
  const c2 = b(beats, 2, 1.4), n = Math.min(12, Math.floor(SM(0, c2, t) * 12));
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={150} text="CONVERSATION STUDY · 2021" size={38} pop={t / 0.25} />
    {[...Array(12)].map((_, i) => { const x = 240 + (i % 4) * 200, y = 350 + Math.floor(i / 4) * 170, on = i < n;
      return <g key={i} transform={`translate(${x} ${y}) scale(${on ? BK(cl((t - i * 0.08) / 0.3)) : 0})`}><rect x="-80" y="-60" width="160" height="120" rx="18" fill="#232a44" stroke={A} strokeWidth="6" />
        <text x="0" y="26" textAnchor="middle" fontFamily={BB} fontSize="70" fill={A}>{i + 1}</text></g>; })}
    <MGBigNum x={540} y={1150} text="1,800+" col="#fff" size={180} label="PEOPLE · MOSTLY STRANGERS" />
    {t > c2 && [0, 1, 2, 3, 4].map((i) => <MGHead key={i} x={160 + i * 190} y={1270} r={50} who={extra(i + 5)} look={[i < 2 ? 1 : -1, 0]} brow="up" mouth="smile" bl={BL(T, i * 0.3)} />)}</g>);
}
/* 8 — result: EXPECTED vs ACTUAL awkwardness bars */
function MGLessAwkward({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5);
  const bar = (y, lab, v, col) => (<g><text x="150" y={y - 30} fontFamily={BB} fontSize="74" letterSpacing="4" fill="#fff">{lab}</text>
    <rect x="150" y={y} width="780" height="90" rx="45" fill="#2a2f45" stroke={K} strokeWidth="8" />
    <rect x="156" y={y + 6} width={Math.max(0, 768 * v)} height="78" rx="39" fill={col} /></g>);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={160} text="HOW AWKWARD WAS IT?" size={40} pop={t / 0.25} />
    {bar(440, 'EXPECTED', 0.85 * SM(0, 0.5, t), R)}
    {bar(720, 'ACTUALLY', 0.4 * SM(c1, c1 + 0.5, t), GOOD)}
    {t > c1 + 0.4 && <MGRing cx={430} cy={765} rx={300} ry={110} p={(t - c1 - 0.4) / 0.4} />}
    <MGHead x={300} y={1150} r={90} who="milo" look={[1, -0.4]} brow="up" mouth="o" bl={BL(T)} />
    <MGHead x={780} y={1150} r={90} who={STR} look={[-1, -0.4]} brow="up" mouth="smile" bl={BL(T, 0.5)} /></g>);
}
/* 9 — name it: we underestimate how much people want to know us (dial: guess vs real) */
function MGUnderestimate({ T, t, beats }) {
  const c0 = b(beats, 0, 0), k = SM(c0 + 0.3, c0 + 1.2, t);
  return (<g><MGBg kind="wall" c1="#5a3f8a" c2="#2a1b38" />
    <MGTitle lines={[['HOW MUCH THEY', '#fff', 110], ['WANT TO KNOW YOU', A, 110]]} y={240} a={EO(t / 0.35)} />
    <g transform="translate(540 900)">
      <path d="M-340 0 A340 340 0 0 1 340 0" fill="none" stroke="#2a2f45" strokeWidth="60" />
      <path d="M-340 0 A340 340 0 0 1 340 0" fill="none" stroke={A} strokeWidth="60" strokeDasharray={`${1068 * (0.3 + 0.55 * k)} 2000`} />
      <line x1="0" y1="0" x2={-300 * Math.cos(Math.PI * 0.3)} y2={-300 * Math.sin(Math.PI * 0.3)} stroke="#8a8fa0" strokeWidth="14" strokeLinecap="round" />
      <line x1="0" y1="0" x2={-300 * Math.cos(Math.PI * (0.3 + 0.55 * k))} y2={-300 * Math.sin(Math.PI * (0.3 + 0.55 * k))} stroke="#fff" strokeWidth="16" strokeLinecap="round" />
      <circle r="30" fill="#fff" stroke={K} strokeWidth="7" />
      <text x="-330" y="90" textAnchor="middle" fontFamily={BB} fontSize="54" fill="#8a8fa0">YOUR GUESS</text>
      <text x="300" y="90" textAnchor="middle" fontFamily={BB} fontSize="54" fill={A} opacity={k}>REALITY</text></g>
    <MGBust x={540} y={1180} r={70} who="milo" look={[0, -1]} brow="up" mouth="o" bl={BL(T)} /></g>);
}
/* 10 — payoff: Milo asks; the night flies by, the music stops */
function MGMiloAsks({ T, t, beats, dur }) {
  const c4 = b(beats, 4, 2.2), late = SM(c4 - 0.2, c4 + 0.4, t);
  return (<g><MGBg kind="party" T={T} dim={0.5 * late} />
    <MGPerson x={330} y={1320} s={4.2} who="milo" look={[1, -0.2]} brow="up" mouth="grin" cup bl={BL(T)} />
    <MGPerson x={760} y={1320} s={4.2} who={STR} look={[-1, -0.2]} brow="up" mouth="grin" bl={BL(T, 0.5)} />
    <Speech x={330} y={500} text={'WHAT ARE YOU|PROUD OF?'} k={(t - 0.3) / 0.3} />
    <MGChip x={540} y={150} text={late > 0.5 ? 'PARTY · 1:58 AM' : 'PARTY · 10:47 PM'} size={40} pop={1} />
    {late > 0 && <g opacity={late}><MGChip x={540} y={250} text="MUSIC OFF" size={36} col="#2a2f45" txt="#fff" pop={1} /></g>}
    {[0, 1, 2].map((i) => <text key={i} x={540 + (i - 1) * 50} y={760 - ((T * 0.6 + i * 0.33) % 1) * 120} textAnchor="middle" fontFamily={BB} fontSize="60" fill={A} opacity={1 - late}>♪</text>)}</g>);
}
/* 11 — end: WEATHER vs DEEP TALK pick */
function MGEndWeather({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  const card = (x, lab, col, on) => (<g transform={`translate(${x} 700) scale(${on})`}><rect x="-210" y="-260" width="420" height="520" rx="30" fill="#232a44" stroke={col} strokeWidth="10" />
    <text x="0" y="200" textAnchor="middle" fontFamily={BB} fontSize="70" fill="#fff">{lab}</text></g>);
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <MGChip x={540} y={170} text="WHICH ARE YOU?" size={44} pop={t / 0.25} />
    {card(290, 'WEATHER', SKY, BK(cl((t - 0.2) / 0.3)))}
    {card(790, 'DEEP TALK', A, BK(cl((t - 0.4) / 0.3)))}
    {t > 0.3 && <Cloud x={290} y={620} s={0.9} rain={1} T={T} />}
    {t > 0.5 && <MGHead x={790} y={620} r={95} who="milo" look={[0, 0]} brow="up" mouth="grin" bl={BL(T)} />}
    {t > c2 && <MGRing cx={790} cy={700} rx={260} ry={310} p={(t - c2) / 0.4} rot={0} />}
    <MGBust x={540} y={1170} r={60} who="nia" look={[0, -1]} brow="up" mouth="smile" bl={BL(T, 0.3)} /></g>);
}

Object.assign(window, { MGWeather, MGYouToo, MGWanted, MGThirdChat, MGNiaDare, MGWeird, MGStudy12, MGLessAwkward, MGUnderestimate, MGMiloAsks, MGEndWeather });
})();
