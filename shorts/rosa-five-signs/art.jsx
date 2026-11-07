// art.jsx — "5 Signs Your Brain Keeps Score of the Bad Stuff" (Rosa ep. 4, with Nia; ted-MG motion graphics, signs-list).
// Negativity bias: Baumeister, Bratslavsky, Finkenauer & Vohs 2001, "Bad Is Stronger Than Good" (Review of General
// Psychology) — a review, no single number, so no stats on screen. Full 1080×1920 frames with tedmg-kit.jsx;
// captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const ROSA = '#a46fd1', ROSA_SKIN = '#f2dccb', NIA = '#e8b33e', NIA_SKIN = '#8d6346';
const GOOD = '#5fbf7a';

// review sheet: rows of green ticks + one red "could improve" row (index bad); k pops it in
function Sheet({ x, y, s = 1, rot = -4, rows = 10, bad = 6, k = 1, badGlow = 0, T = 0 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * BK(k)})`}>
    <rect x="-200" y="-330" width="400" height="660" rx="18" fill="#fbf7ee" stroke={K} strokeWidth="7" />
    <rect x="-200" y="-330" width="400" height="80" rx="18" fill={ROSA} stroke={K} strokeWidth="7" />
    <text x="0" y="-275" textAnchor="middle" fontFamily={BB} fontSize="50" letterSpacing="4" fill="#fff">REVIEW</text>
    {[...Array(rows)].map((_, i) => { const yy = -210 + i * 52, isBad = i === bad;
      return (<g key={i}>{isBad && badGlow > 0 && <rect x="-186" y={yy - 24} width="372" height="46" rx="10" fill={R} opacity={0.25 + 0.15 * Math.sin(T * 6)} />}
        {isBad ? <path d={`M-170 ${yy - 10} L-150 ${yy + 10} M-150 ${yy - 10} L-170 ${yy + 10}`} stroke={R} strokeWidth="7" strokeLinecap="round" />
          : <path d={`M-174 ${yy} L-162 ${yy + 12} L-144 ${yy - 12}`} fill="none" stroke={GOOD} strokeWidth="7" strokeLinecap="round" />}
        {isBad ? <text x="-126" y={yy + 11} fontFamily={OS} fontWeight="700" fontSize="30" fill={R}>COULD IMPROVE</text>
          : <rect x="-126" y={yy - 6} width={150 + hsh(i + 4) * 150} height="12" rx="6" fill="#d8d0c2" />}</g>); })}
  </g>);
}
// little phone comment card
function Comment({ x, y, w = 560, good = true, text, a = 1, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}>
    <rect x={-w / 2} y="-46" width={w} height="92" rx="46" fill={good ? '#fff' : R} stroke={K} strokeWidth="6" />
    <circle cx={-w / 2 + 50} cy="0" r="26" fill={good ? GOOD : '#fff'} stroke={K} strokeWidth="5" />
    <text x={-w / 2 + 96} y="12" fontFamily={OS} fontWeight="700" fontSize="34" fill={good ? '#1a1720' : '#fff'}>{text}</text></g>);
}
// "SIGN n" header + five progress dots; the current one is amber
function SignHead({ n, t }) {
  return (<g><MGChip x={540} y={230} text={`SIGN ${n} OF 5`} outline size={44} pop={t / 0.25} />
    {[1, 2, 3, 4, 5].map((i) => <circle key={i} cx={540 + (i - 3) * 60} cy={330} r={i === n ? 18 : 12} fill={i <= n ? A : 'rgba(255,255,255,0.25)'} stroke={K} strokeWidth="4" />)}
    <text x={540} y={760} textAnchor="middle" fontFamily={BB} fontSize="560" fill="#fff" opacity="0.08">{n}</text></g>);
}
// a small car seen from the side, driver window at the front
function Car({ x, y, col = '#d9534f', honk = 0, T = 0 }) {
  return (<g transform={`translate(${x} ${y})`}>
    <path d="M-260 -40 L-240 -150 Q-230 -190 -180 -190 L90 -190 Q140 -190 170 -140 L220 -70 L270 -60 Q290 -55 290 -20 L290 20 L-260 20 Z" fill={col} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <path d="M-200 -170 L-40 -170 L-40 -80 L-210 -80 Z M-10 -170 L100 -170 Q130 -170 150 -130 L180 -80 L-10 -80 Z" fill="#bfe3f2" stroke={K} strokeWidth="6" strokeLinejoin="round" />
    <MGHead x={60} y={-120} r={36} who={MG.extra(7)} mouth="o" brow="angry" look={[1, 0]} bl={BL(T, 0.4)} />
    {[-150, 170].map((wx) => <g key={wx}><circle cx={wx} cy="20" r="58" fill="#2a2a2a" stroke={K} strokeWidth="8" /><circle cx={wx} cy="20" r="22" fill="#9a9a9a" /></g>)}
    {honk > 0 && [0, 1, 2].map((i) => { const ph = (T * 2.5 + i / 3) % 1; return <path key={i} d={`M${310 + ph * 120} ${-80 - i * 30} q30 ${-20 + i * 20} 60 0`} fill="none" stroke={A} strokeWidth="10" strokeLinecap="round" opacity={1 - ph} />; })}
  </g>);
}
// a bell ringing (the old alarm)
function Bell({ x, y, s = 1, T = 0, ring = 1 }) {
  const r = Math.sin(T * 30) * 12 * ring;
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {ring > 0 && [-1, 1].map((sd) => [0, 1].map((k) => <path key={sd + '' + k} d={`M${sd * (140 + k * 40)} -60 q${sd * 25} 50 0 100`} fill="none" stroke={A} strokeWidth="10" strokeLinecap="round" opacity={0.8 - k * 0.3} />))}
    <g transform={`rotate(${r})`}><path d="M-110 40 Q-110 -120 0 -130 Q110 -120 110 40 L140 70 L-140 70 Z" fill={A} stroke={K} strokeWidth="9" strokeLinejoin="round" />
      <circle cx="0" cy="-140" r="20" fill={A} stroke={K} strokeWidth="7" /><circle cx={r * 1.5} cy="92" r="26" fill="#c98a1e" stroke={K} strokeWidth="7" />
      <path d="M-70 -60 Q-70 -100 -30 -108" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" opacity="0.6" /></g></g>);
}

/* 1 — Rosa's review: nine green ticks, one red "could improve"; at "one could improve" the red row glows + red ring */
function MGReviewHook({ T, t, beats }) {
  const c2 = b(beats, 2, 1.4), c4 = b(beats, 4, 2.6), worry = t > c2;
  return (<g><MGBg kind="wall" c1="#e7d3ee" c2="#b998cc" />
    <MGChip x={540} y={200} text="PERFORMANCE REVIEW · FRIDAY" outline size={40} pop={t / 0.25} />
    <Sheet x={720} y={680} s={0.95} rot={6} k={(t - 0.1) / 0.35} badGlow={worry ? 1 : 0} T={T} />
    <MGRing cx={740} cy={668} rx={220} ry={50} rot={6} p={(t - c2) / 0.4} />
    {t > c4 && <MGArrows x={760} y={670} t={t - c4} n={4} from={460} to={250} />}
    <MGBust x={300} y={900} r={175} who="rosa" mouth={worry ? 'wave' : 'smile'} brow={worry ? 'worried' : 'up'} look={[0.8, -0.3]} sweat={worry ? T * 0.8 : null} bl={BL(T)} /></g>);
}

/* 2 — five numbered circles pop in; then the snapback: "NOT YOUR FAULT" stamp with a punch-in */
function MGFiveSigns({ T, t, beats }) {
  const c4 = b(beats, 4, 2.2), snap = t > c4;
  return (<g><MGBg kind="navy" />
    <MGTitle lines={[['5 SIGNS', A, 220], ['YOU DO THIS TOO', '#fff', 80]]} y={300} a={EO(t / 0.3)} />
    {[0, 1, 2, 3, 4].map((i) => { const k = (t - 0.3 - i * 0.18) / 0.3, x = 180 + i * 180;
      return k > 0 && <g key={i} transform={`translate(${x} 780) scale(${BK(k)})`}><circle r="70" fill={snap ? '#3a4160' : A} stroke={K} strokeWidth="7" />
        <text y="28" textAnchor="middle" fontFamily={BB} fontSize="90" fill={snap ? '#8890aa' : '#1a1720'}>{i + 1}</text></g>; })}
    <MGHead x={330} y={1120} r={120} who="rosa" mouth={snap ? 'o' : 'wave'} brow={snap ? 'up' : 'worried'} look={[0.4, -0.6]} bl={BL(T)} />
    <MGHead x={760} y={1120} r={120} who="nia" mouth={snap ? 'grin' : 'flat'} brow={snap ? 'up' : 'flat'} look={[-0.6, -0.4]} bl={BL(T, 1)} />
    {snap && <g><MGGlow x={540} y={960} r={420} col="#fff3c4" a={0.35} />
      <g transform={`translate(540 960) rotate(-6) scale(${BK((t - c4) / 0.3)})`}><rect x="-360" y="-80" width="720" height="160" rx="20" fill={R} stroke={K} strokeWidth="9" />
        <text y="48" textAnchor="middle" fontFamily={BB} fontSize="130" letterSpacing="6" fill="#fff">NOT YOUR FAULT</text></g></g>}</g>);
}

/* 3 — sign 1: a phone feed of nice comments; one red comment swells while the nice ones fade */
function MGSign1({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), swell = SM(b(beats, 1, 0.5), b(beats, 1, 0.5) + 0.6, t);
  const nice = ['LOVED THIS!', 'SO GOOD', 'GREAT WORK', 'YOU NAILED IT', 'SAVED THIS!'];
  return (<g><MGBg kind="wall" c1="#3d2b52" c2="#1f1630" /><SignHead n={1} t={t} />
    <rect x="200" y="420" width="680" height="900" rx="60" fill="#18161d" stroke={K} strokeWidth="10" /><rect x="226" y="450" width="628" height="840" rx="40" fill="#efe9f6" />
    {nice.map((txt, i) => <Comment key={i} x={540} y={520 + i * 110 + (i > 2 ? 110 : 0)} w={560} text={txt} a={lp(1, 0.25, swell) * cl((t - i * 0.08) / 0.2)} s={0.92} />)}
    <Comment x={540} y={850} w={560} good={false} text="MEH." s={lp(0.92, 1.35, swell)} a={cl((t - 0.3) / 0.2)} />
    {t > c3 && <MGChip x={540} y={1230} text="1 BAD > A PILE OF GOOD" col={A} size={44} pop={(t - c3) / 0.25} />}</g>);
}

/* 4 — sign 2: night, Rosa in bed remembering an old cringe: "YOU TOO!" (to the waiter) */
function MGSign2({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1);
  return (<g><MGBg kind="roomNight" /><SignHead n={2} t={t} />
    <MGBust x={540} y={800} r={170} who="rosa" mouth="wave" brow="worried" look={[0, -0.7]} bl={BL(T)} blush={t > c2 ? 1 : 0} />
    <MGBubble x={760} y={560} text={"'ENJOY YOUR MEAL!'|'YOU TOO!'"} size={44} k={(t - 0.3) / 0.3} />
    {t > c2 && <MGChip x={300} y={460} text="WAITER · 2017" col="#7fd6ff" size={40} pop={(t - c2) / 0.25} />}
    {t > c2 && [0, 1, 2].map((i) => <path key={i} d={`M${330 + i * 40} ${560 + Math.sin(T * 8 + i) * 6} l20 -30 l20 30`} fill="none" stroke={R} strokeWidth="8" strokeLinecap="round" />)}</g>);
}

/* 5 — sign 3: morning street, a car honks at Rosa holding a coffee; her mood chip drops */
function MGSign3({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5), c3 = b(beats, 3, 1.5), cx = lp(1300, 640, EO((t - c1) / 0.6));
  return (<g><MGBg kind="wall" c1="#ffd9a8" c2="#f2a96a" /><SignHead n={3} t={t} />
    <rect x="-300" y="1180" width="1680" height="800" fill="#4a4f60" /><rect x="-300" y="1180" width="1680" height="20" fill="#2f3340" />
    {[...Array(6)].map((_, i) => <rect key={i} x={i * 220 - 40} y="1300" width="120" height="14" fill="#e8d27a" opacity="0.7" />)}
    <MGPerson x={210} y={1180} s={2.4} who="rosa" cup mouth={t > c1 + 0.5 ? 'frown' : 'smile'} brow={t > c1 + 0.5 ? 'angry' : 'flat'} look={[1, 0]} bl={BL(T)} />
    <Car x={cx} y={1150} honk={t > c1 + 0.6 ? 1 : 0} T={T} />
    <MGChip x={760} y={500} text="8:04 AM" outline size={44} pop={t / 0.25} />
    {t > c3 && <MGChip x={760} y={620} text="WHOLE DAY: RUINED" col={R} txt="#fff" size={46} pop={(t - c3) / 0.25} />}</g>);
}

/* 6 — sign 4: phone lights up "Nia: we need to talk"; Rosa's head fills with worst cases */
function MGSign4({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c4 = b(beats, 4, 1.9);
  const worst = [['FIRED?', 200, 820], ['MOVING AWAY?', 520, 700], ['MAD AT ME?', 860, 830]];
  return (<g><MGBg kind="wall" c1="#2a3354" c2="#151a2e" /><SignHead n={4} t={t} />
    <g transform={`translate(780 880) scale(0.62)`}><MGPhone x={0} y={0} rot={6} time="9:41" day="TUESDAY" from="NIA" msg="we need to talk" k={(t - c1) / 0.4} /></g>
    <MGBust x={330} y={1030} r={150} who="rosa" mouth={t > c4 ? 'o' : 'wave'} brow="worried" look={[1, -0.3]} sweat={T} bl={BL(T)} />
    {t > c4 && worst.map(([w, x, y], i) => <MGBubble key={w} x={x} y={y - 260} text={w} size={40} k={(t - c4 - i * 0.15) / 0.3} />)}</g>);
}

/* 7 — sign 5: Rosa rereads the mean comment; a counter ticks 1→5 */
function MGSign5({ T, t, beats }) {
  const c3 = b(beats, 3, 1.5), n = Math.min(5, 1 + Math.floor(cl(t / Math.max(0.5, c3)) * 4.99));
  return (<g><MGBg kind="roomNight" /><SignHead n={5} t={t} />
    <MGGlow x={720} y={1000} r={260} col="#ff8a7a" a={0.35} />
    <MGBust x={330} y={980} r={150} who="rosa" mouth="wave" brow="worried" look={[1, 0.2]} bl={BL(T)} />
    <g transform="translate(760 1010) rotate(6)"><rect x="-110" y="-180" width="220" height="360" rx="30" fill="#18161d" stroke={K} strokeWidth="7" />
      <rect x="-92" y="-158" width="184" height="316" rx="18" fill={R} /><text y="20" textAnchor="middle" fontFamily={BB} fontSize="72" fill="#fff">MEH.</text></g>
    <g transform="translate(540 560)"><text textAnchor="middle" y="0" fontFamily={OS} fontWeight="700" fontSize="44" letterSpacing="4" fill="#fff" opacity="0.7">TIMES READ</text>
      <text key={n} textAnchor="middle" y="190" fontFamily={BB} fontSize="220" fill={n >= 5 ? A : '#fff'}>{n}×</text></g></g>);
}

/* 8 — the study: a balance; one spiky BAD weight outweighs a stack of GOOD stars */
function MGBadStudy({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), tilt = lp(0, 0.28, EO((t - c3 + 0.2) / 0.6)), cx = 540, cy = 980;
  const lx = cx - 330 * Math.cos(tilt), ly = cy - 330 * Math.sin(tilt), rx = cx + 330 * Math.cos(tilt), ry = cy + 330 * Math.sin(tilt);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="REVIEW OF GENERAL PSYCHOLOGY · 2001" outline size={34} pop={t / 0.25} />
    <MGChip x={540} y={320} text="BAUMEISTER ET AL." size={44} pop={(t - b(beats, 1, 0.6)) / 0.25} />
    <path d={`M${cx - 90} 1300 L${cx + 90} 1300 L${cx} ${cy} Z`} fill="#3a4160" stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#cfd6e8" strokeWidth="22" strokeLinecap="round" />
    {[[lx, ly], [rx, ry]].map(([x, y], i) => <g key={i}><line x1={x} y1={y} x2={x - 80} y2={y + 170} stroke="#cfd6e8" strokeWidth="5" /><line x1={x} y1={y} x2={x + 80} y2={y + 170} stroke="#cfd6e8" strokeWidth="5" />
      <path d={`M${x - 120} ${y + 170} L${x + 120} ${y + 170} L${x + 90} ${y + 200} L${x - 90} ${y + 200} Z`} fill="#cfd6e8" stroke={K} strokeWidth="6" /></g>)}
    {[...Array(6)].map((_, i) => { const sx = lx - 70 + (i % 3) * 70, sy = ly + 140 - Math.floor(i / 3) * 62;
      return <path key={i} transform={`translate(${sx} ${sy}) scale(0.9)`} d="M0 -32 L9 -10 L32 -10 L14 4 L20 28 L0 14 L-20 28 L-14 4 L-32 -10 L-9 -10 Z" fill={GOOD} stroke={K} strokeWidth="4" strokeLinejoin="round" />; })}
    <g transform={`translate(${rx} ${ry + 110})`}><path d={MG.pts([...Array(18)].map((_, i) => { const a = i / 18 * Math.PI * 2, r = i % 2 ? 40 : 72; return [Math.cos(a) * r, Math.sin(a) * r]; }))} fill="#1a1720" />
      <circle cx="-16" cy="-6" r="9" fill={R} /><circle cx="16" cy="-6" r="9" fill={R} /></g>
    <text x={lx} y={ly - 40} textAnchor="middle" fontFamily={BB} fontSize="64" fill={GOOD}>GOOD</text>
    <text x={rx} y={ry - 40} textAnchor="middle" fontFamily={BB} fontSize="64" fill={R}>BAD</text>
    {t > c3 && <MGChip x={540} y={560} text="BAD HITS HARDER" col={R} txt="#fff" size={56} pop={(t - c3) / 0.25} />}</g>);
}

/* 9 — name it: stage + spotlight, title, an old brass alarm bell ringing over Rosa */
function MGNameNeg({ T, t, beats }) {
  const c3 = b(beats, 3, 1.8), ring = t > c3 ? 1 : 0.2;
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={720} a={0.55 * SM(0, 0.3, t)} />
    <MGTitle lines={[['NEGATIVITY', A, 170], ['BIAS', '#fff', 120]]} y={250} a={EO((t - 0.2) / 0.35)} />
    <Bell x={540} y={720} s={0.9} T={T} ring={ring} />
    {t > c3 && <MGChip x={540} y={560} text="SAFETY ALARM · FACTORY SETTING" col="#7fd6ff" size={36} pop={(t - c3) / 0.25} />}
    <MGHead x={540} y={1110} r={140} who="rosa" mouth={t > c3 ? 'smile' : 'o'} brow="up" look={[0, -1]} bl={BL(T)} /></g>);
}

/* 10 — end: Nia hands Rosa the review; Rosa reads the nice ones out loud, hearts float up */
function MGEndLoud({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0), c3 = b(beats, 3, 1.6), loud = t > c2;
  return (<g><MGBg kind="wall" c1="#ffe2b8" c2="#f2a96a" /><MGGlow x={540} y={700} r={420} col="#fff6c8" a={0.5} />
    <Sheet x={540} y={520} s={0.62} rot={-3} k={1} T={T} />
    <MGPerson x={330} y={1330} s={2.4} who="rosa" mouth={loud ? 'grin' : 'smile'} brow="up" look={[0.3, -0.8]} bl={BL(T)} />
    <MGPerson x={800} y={1320} s={2.3} who="nia" mouth="grin" brow="up" look={[-1, -0.3]} bl={BL(T, 1)} />
    {loud && [0, 1, 2, 3].map((i) => { const ph = (T * 0.6 + i / 4) % 1; return <path key={i} transform={`translate(${330 + Math.sin(T * 2 + i) * 60} ${880 - ph * 420}) scale(${0.8 + ph * 0.4})`} d="M0 18 C-40 -10 -26 -44 0 -26 C26 -44 40 -10 0 18 Z" fill={R} stroke={K} strokeWidth="5" opacity={Math.sin(ph * Math.PI)} />; })}
    {loud && <MGBubble x={470} y={960} text="'GREAT WORK!'" size={46} k={(t - c2) / 0.3} />}
    {t > c3 && <MGChip x={540} y={200} text="CHECKED ALL 5? SEND IT." size={48} pop={(t - c3) / 0.25} />}</g>);
}

Object.assign(window, { MGReviewHook, MGFiveSigns, MGSign1, MGSign2, MGSign3, MGSign4, MGSign5, MGBadStudy, MGNameNeg, MGEndLoud });
})();
