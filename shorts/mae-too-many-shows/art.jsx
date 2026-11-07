// art.jsx — "Why You Scroll for an Hour and Watch Nothing" (Mae ep. 7, with The Doubt; retro modern illustration).
// Choice overload: Iyengar & Lepper 2000 (JPSP) jam study — 24 jams: more stopped, ~3% of stoppers bought; 6 jams: ~30%.
// Only those verified numbers are on screen. Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540 — faces and
// numbers stay out of y 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const OSW = "'Oswald', sans-serif", BEB = "'Bebas Neue', sans-serif";
const TILE = [P.red, P.blue, P.yel, P.pink, P.green, P.redD, P.cream];

// TV / screen with a scrolling wall of show tiles (scroll in px); n columns
function Screen({ x, y, w = 820, h = 520, scroll = 0, cols = 4, pick = -1, children }) {
  const u = 'scr' + React.useId().replace(/[^a-zA-Z0-9]/g, ''), tw = (w - 60) / cols, th = tw * 1.35;
  return (<g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w} height={h} fill={P.blk} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#1d1a2a" {...ink(8)} />
    <clipPath id={u}><rect x={-w / 2 + 20} y={-h / 2 + 20} width={w - 40} height={h - 40} /></clipPath>
    <g clipPath={`url(#${u})`}>{children || [...Array(cols * 8)].map((_, i) => { const c = i % cols, r = Math.floor(i / cols), yy = -h / 2 + 30 + r * (th + 16) - (scroll % ((th + 16) * 4));
      return (<g key={i}><rect x={-w / 2 + 30 + c * tw} y={yy} width={tw - 16} height={th} fill={TILE[(i * 3) % TILE.length]} {...ink(4)} />
        <circle cx={-w / 2 + 30 + c * tw + (tw - 16) / 2} cy={yy + th * 0.42} r={tw * 0.16} fill={TILE[(i * 3 + 2) % TILE.length]} {...ink(3)} />
        <rect x={-w / 2 + 40 + c * tw} y={yy + th - 34} width={(tw - 36) * (0.5 + hsh(i) * 0.5)} height="12" fill={P.cream} opacity="0.8" /></g>); })}</g>
    <path d={`M${-80} ${h / 2} L${-120} ${h / 2 + 70} M80 ${h / 2} L120 ${h / 2 + 70}`} {...ink(10)} />
  </g>);
}
// jam jar
function Jar({ x, y, s = 1, col = P.red, label = P.cream }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-46" y="-110" width="92" height="30" fill={P.yel} {...ink(5)} />
    <path d="M-50 -80 L50 -80 Q62 -60 58 0 L58 40 Q58 60 38 60 L-38 60 Q-58 60 -58 40 L-58 0 Q-62 -60 -50 -80 Z" fill={col} {...ink(6)} />
    <rect x="-38" y="-30" width="76" height="46" fill={label} {...ink(4)} /><path d="M-30 -60 L-30 -10" stroke={P.cream} strokeOpacity="0.5" strokeWidth="8" strokeLinecap="round" /></g>);
}
// table with a striped awning: jars laid out in rows
function JamTable({ n, T, s = 1 }) {
  const cols = n > 6 ? 8 : 3, rows = Math.ceil(n / cols), sc = n > 6 ? 0.62 : 1.05;
  return (<g>
    <path d="M90 360 L990 360 L960 470 L120 470 Z" fill={P.cream} {...ink(7)} />
    {[...Array(9)].map((_, i) => <path key={i} d={`M${90 + i * 100} 360 L${190 + i * 100} 360 L${186 + i * 100} 470 L${120 + i * 96} 470 Z`} fill={i % 2 ? P.red : P.cream} {...ink(4)} />)}
    {[...Array(9)].map((_, i) => <path key={'s' + i} d={`M${100 + i * 98} 470 q49 50 98 0`} fill={i % 2 ? P.red : P.cream} {...ink(4)} />)}
    <rect x="140" y="470" width="14" height="560" fill={P.blk} /><rect x="926" y="470" width="14" height="560" fill={P.blk} />
    {[...Array(n)].map((_, i) => { const c = i % cols, r = Math.floor(i / cols), x = 540 + (c - (cols - 1) / 2) * (n > 6 ? 98 : 190), y = 1000 - (rows - 1 - r) * (n > 6 ? 105 : 0) - (n > 6 ? 0 : 20);
      return <Jar key={i} x={x} y={y + Math.sin(T * 2 + i) * 2} s={sc} col={TILE[i % 5]} />; })}
    <rect x="80" y="1060" width="920" height="40" fill={P.blk} /><path d="M100 1100 L980 1100 L940 1340 L140 1340 Z" fill={P.blueD} {...ink(7)} /></g>);
}
// small shopper head for crowds
function Shopper({ x, y, i, s = 0.22, look = [0, -0.5] }) {
  const who = ['arthur', 'otto', 'lila', 'mae'][i % 4];
  return <RMHuman x={x} y={y} s={s} who={who} body={true} mouth={i % 2 ? 'flat' : 'smile'} brow="flat" lid={0.35} look={look} />;
}
function Bag({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-60 -50 L60 -50 L70 70 L-70 70 Z" fill={P.cream} {...ink(6)} />
    <path d="M-30 -50 Q-30 -100 0 -100 Q30 -100 30 -50" fill="none" {...ink(7)} /><Jar x={0} y={-20} s={0.45} col={P.red} /></g>);
}

/* 1 — Mae in the dark facing an endless scrolling wall of shows */
function RMEndlessShows({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), c4 = bt(beats, 4, 2.4);
  return (<g><RMBg kind="dark" />
    <circle cx={540} cy={640} r={520} fill={P.blue} opacity="0.25" />
    <Screen x={540} y={560} w={900} h={700} scroll={T * 180} cols={4} />
    {t > c1 && <RMChip x={540} y={170} text="WHAT TO WATCH?" pop={(t - c1) / 0.25} />}
    <RMMae x={540} y={1150} s={0.8} mouth={t > c4 ? 'frown' : 'flat'} brow={t > c4 ? 'sad' : 'flat'} lid={t > c4 ? 0.55 : 0.25} look={[0, -0.9]} /></g>);
}

/* 2 — "you": 40 minutes later Mae lies on the pillow, phone glow on her face, clock turns to BEDTIME */
function RMScrollBed({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6), c3 = bt(beats, 3, 1.6), mins = Math.round(lp(0, 40, cl((t - c1) / Math.max(0.3, c3 - c1))));
  return (<g><RMBg kind="dark" /><RMBulb x={830} y={230} T={T} on={t < c3} />
    <RMGrid x={110} y={760} w={860} h={420} />
    <RMMae x={470} y={900} s={0.62} rot={-1.45} body={false} mouth="flat" brow="sad" lid={0.6} look={[0.6, -0.3]} />
    <g transform="translate(760 760) rotate(-12)"><rect x="-70" y="-120" width="140" height="240" rx="18" fill={P.blk} /><rect x="-58" y="-104" width="116" height="200" fill={P.cyan} opacity="0.9" />
      {[0, 1, 2].map((i) => <rect key={i} x="-46" y={-90 + ((i * 70 + T * 220) % 210)} width="92" height="50" fill={TILE[i]} />)}</g>
    <circle cx={700} cy={800} r={170} fill={P.cyan} opacity="0.12" />
    <RMChip x={300} y={420} text={t > c3 ? 'BEDTIME' : `SCROLLING: ${mins} MIN`} col={t > c3 ? P.cream : P.yel} pop={t / 0.25} /></g>);
}

/* 3 — snapback: a menu scroll unrolls down the frame and dwarfs Mae; "THE MENU" */
function RMSnapMenu({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.3), roll = EO(t / 0.9);
  return (<g><RMBg kind="red" />
    <g><rect x={260} y={60} width={560} height={lp(200, 1150, roll)} fill={P.cream} {...ink(8)} />
      {[...Array(28)].map((_, i) => 100 + i * 40 < 60 + lp(200, 1150, roll) - 20 && <g key={i}><rect x={300} y={100 + i * 40} width={22} height={22} fill="none" {...ink(4)} />
        <rect x={340} y={104 + i * 40} width={180 + hsh(i) * 220} height={14} fill={P.blk} opacity="0.75" /></g>)}
      <rect x={240} y={40 + lp(200, 1150, roll)} width={600} height={60} rx={30} fill={P.yel} {...ink(8)} /></g>
    <RMMae x={540} y={1280} s={0.38} mouth="open" brow="up" lid={0} look={[0, -1]} wide />
    {t > c3 && <g><RMChip x={540} y={600} text="IT'S THE MENU" col={P.yel} size={70} pop={(t - c3) / 0.25} />
      <RMChip x={540} y={740} text="NOT YOU" col={P.cream} size={50} pop={(t - c3 - 0.15) / 0.25} rot={0.03} /></g>}</g>);
}

/* 4 — the study: a jam-tasting table in a store */
function RMJamTable({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={200} text="J. PERS. SOC. PSYCHOLOGY · 2000" size={38} pop={t / 0.25} />
    <JamTable n={6} T={T} />
    {t > c3 && <RMChip x={540} y={290} text="FREE TASTING" col={P.cream} size={48} pop={(t - c3) / 0.25} rot={0.02} />}
    {[0, 1, 2].map((i) => <Shopper key={i} x={250 + i * 290} y={lp(1500, 1290, EO((t - 0.4 - i * 0.2) / 0.5))} i={i} s={0.24} look={[0, -0.8]} />)}</g>);
}

/* 5 — 24 jams: a crowd stops, but only a sliver buys: "3%" */
function RMJam24({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.8), c3 = bt(beats, 3, 1.8);
  return (<g><RMBg kind="red" />
    {t < c3 && <RMChip x={540} y={200} text="24 JAMS" size={56} pop={t / 0.25} />}
    <JamTable n={24} T={T} />
    {t > c1 && [...Array(6)].map((_, i) => <Shopper key={i} x={150 + i * 156} y={lp(1500, 1300, EO((t - c1 - i * 0.08) / 0.4))} i={i + 1} s={0.2} look={[(i - 2.5) * 0.2, -0.9]} />)}
    {t > c3 && <g><rect x={300} y={240 - 12} width={480} height={0} /><g transform={`translate(540 290) scale(${BK((t - c3) / 0.3)})`}>
      <text x={10} y={10} textAnchor="middle" fontFamily={BEB} fontSize="128" fill={P.blk}>24 JAMS: 3% BOUGHT</text>
      <text x={0} y={0} textAnchor="middle" fontFamily={BEB} fontSize="128" fill={P.yel}>24 JAMS: 3% BOUGHT</text></g></g>}</g>);
}

/* 6 — 6 jams: fewer stop, but bags fill up: "30%" */
function RMJam6({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6);
  return (<g><RMBg kind="blue" />
    {t < c1 && <RMChip x={540} y={200} text="6 JAMS" size={56} pop={t / 0.25} />}
    <JamTable n={6} T={T} />
    {t > c1 && <g><g transform={`translate(540 290) scale(${BK((t - c1) / 0.3)})`}>
      <text x={10} y={10} textAnchor="middle" fontFamily={BEB} fontSize="128" fill={P.blk}>6 JAMS: 30% BOUGHT</text>
      <text x={0} y={0} textAnchor="middle" fontFamily={BEB} fontSize="128" fill={P.yel}>6 JAMS: 30% BOUGHT</text></g>
      {[0, 1, 2].map((i) => <Bag key={i} x={260 + i * 280} y={lp(1500, 1240, EO((t - c1 - i * 0.12) / 0.4))} s={1.1} />)}</g>}</g>);
}

/* 7 — name it: an overloaded brain sparking under the title */
function RMNameChoice({ T, t, beats }) {
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['CHOICE', P.cream, 190], ['OVERLOAD', P.yel, 190]]} y={250} a={EO((t - 0.15) / 0.35)} />
    <RMBrain cx={540} cy={1140} w={520} h={460} />
    {[...Array(6)].map((_, i) => <RMBolt key={i} x={540 + (i - 2.5) * 140} y={760 + (i % 2) * 60} len={220} ang={-Math.PI / 2 + (i - 2.5) * 0.25} seed={i + 1} T={T} />)}
    {[...Array(10)].map((_, i) => { const a = i / 10 * Math.PI * 2 + T * 0.6; return <rect key={'t' + i} x={540 + Math.cos(a) * 430 - 40} y={1000 + Math.sin(a) * 220 - 55} width="80" height="110" fill={TILE[i % 7]} {...ink(4)} opacity={SM(0.2, 0.6, t)} />; })}</g>);
}

/* 8 — The Doubt whispers into Mae's ear: "WHAT IF THE OTHER ONE'S BETTER?" */
function RMDoubtMenu({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.9), c5 = bt(beats, 5, 2.2);
  return (<g><RMBg kind="red" />
    <RMMae x={360} y={980} s={0.85} mouth="frown" brow="sad" lid={0.3} look={[0.7, 0]} stress={t > c5} />
    <RMDoubt x={820} y={720 + Math.sin(T * 2) * 10} s={0.95} T={T} mood="sly" look={[-1, 0.3]} />
    {t > c2 && <RMSpeech x={560} y={300} text={t > c5 ? 'THE OTHER ONE?' : 'WHAT IF...'} size={80} col={P.yel} k={(t - c2) / 0.3} />}
    {[0, 1, 2].map((i) => { const ph = (T * 0.8 + i / 3) % 1; return <path key={i} d={`M${700 - ph * 150} ${640 + i * 20} q-20 -20 -40 0`} fill="none" stroke={P.cream} strokeWidth="6" strokeLinecap="round" opacity={1 - ph} />; })}</g>);
}

/* 9 — self-proof: a giant restaurant menu; Mae peeks over it, eyes wide; "READY TO ORDER?" */
function RMMenuStare({ T, t, beats }) {
  const c4 = bt(beats, 4, 2.0);
  return (<g><RMBg kind="redDark" />
    <RMMae x={540} y={760} s={0.7} body={false} mouth="flat" brow="up" lid={0} look={[0, 0.6]} wide />
    <g transform={`rotate(${Math.sin(T * 1.2) * 1.2} 540 1100)`}><rect x={160 + 12} y={820 + 12} width={760} height={560} fill={P.blk} />
      <rect x={160} y={820} width={760} height={560} fill={P.cream} {...ink(8)} /><line x1={540} y1={820} x2={540} y2={1380} {...ink(5)} />
      <text x={350} y={890} textAnchor="middle" fontFamily={BEB} fontSize="56" fill={P.red}>MAINS</text><text x={730} y={890} textAnchor="middle" fontFamily={BEB} fontSize="56" fill={P.red}>MORE MAINS</text>
      {[...Array(18)].map((_, i) => <rect key={i} x={i < 9 ? 200 : 580} y={930 + (i % 9) * 46} width={140 + hsh(i + 2) * 150} height={14} fill={P.blk} opacity="0.7" />)}</g>
    <RMChip x={540} y={240} text="READY TO ORDER?" pop={(t - 0.3) / 0.25} />
    {t > c4 && <RMChip x={540} y={370} text="...FIVE MORE MINUTES" col={P.cream} size={40} pop={(t - c4) / 0.25} rot={0.03} />}</g>);
}

/* 10 — end: three tiles, one picked and playing; Mae relaxed with tea */
function RMEndThree({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), c3 = bt(beats, 3, 1.4), pick = t > c1 + 0.3;
  const tiles = (<g>{[0, 1, 2].map((i) => { const x = -280 + i * 280, sel = pick && i === 1, k = sel ? 1 + 0.06 * SM(c1, c1 + 0.4, t) : 1;
    return (<g key={i} transform={`translate(${x} 0) scale(${k})`}><rect x="-110" y="-160" width="220" height="300" fill={TILE[i * 2]} {...ink(sel ? 10 : 5)} />
      <circle cx="0" cy="-30" r="50" fill={TILE[i * 2 + 1]} {...ink(4)} />
      {sel && t > c3 && <path d="M-34 -70 L46 -30 L-34 10 Z" fill={P.cream} {...ink(5)} />}</g>); })}</g>);
  return (<g><RMBg kind="blue" />
    <Screen x={540} y={560} w={900} h={560}>{tiles}</Screen>
    <RMChip x={540} y={190} text={t > c3 ? 'NOW PLAYING' : 'PICK FROM 3'} pop={t / 0.25} />
    <RMMae x={470} y={1190} s={0.72} mouth="smile" brow="flat" lid={0.35} look={[0.3, -0.8]} />
    <g transform="translate(820 1290)"><path d="M-60 -60 L60 -60 L50 60 L-50 60 Z" fill={P.cream} {...ink(6)} /><path d="M60 -30 q40 0 40 30 q0 30 -45 28" fill="none" {...ink(7)} />
      {[0, 1].map((i) => { const ph = (T * 0.5 + i / 2) % 1; return <path key={i} d={`M${-15 + i * 30} ${-80 - ph * 90} q12 -18 0 -36 q-12 -18 0 -36`} fill="none" stroke={P.cream} strokeWidth="6" strokeLinecap="round" opacity={0.8 * Math.sin(ph * Math.PI)} />; })}</g></g>);
}

Object.assign(window, { RMEndlessShows, RMScrollBed, RMSnapMenu, RMJamTable, RMJam24, RMJam6, RMNameChoice, RMDoubtMenu, RMMenuStare, RMEndThree });
})();
