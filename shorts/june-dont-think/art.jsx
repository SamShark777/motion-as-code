// art.jsx — "Why You Can't Stop Thinking About Your Ex" (June ep. 5, with Nia; ted-MG motion graphics).
// Thought suppression / rebound: Wegner, Schneider, Carter & White 1987 (JPSP) — don't think of a white bear, ring a bell
// when you do; suppressors later thought of it more; a single specific distracter (a red Volkswagen) reduced the rebound.
// No numbers on screen. Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const JUNE = '#5bb3b0', JUNE_SKIN = '#f2dccb', NIA = '#e8b33e', NIA_SKIN = '#8d6346';
const EX = { hair: 'short', hairCol: '#4a3426', skin: '#e9d2b8', top: '#6a7bd1', pants: '#2f3347' };

// a white bear head (r = head radius)
function Bear({ x, y, r = 120, rot = 0, mouth = 'smile', T = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {[-1, 1].map((s) => <g key={s}><circle cx={s * r * 0.72} cy={-r * 0.72} r={r * 0.32} fill="#fbfbf7" stroke={K} strokeWidth={r * 0.06} /><circle cx={s * r * 0.72} cy={-r * 0.72} r={r * 0.15} fill="#e9c9c0" /></g>)}
    <circle r={r} fill="#fbfbf7" stroke={K} strokeWidth={r * 0.06} />
    <ellipse cy={r * 0.32} rx={r * 0.42} ry={r * 0.32} fill="#efe8dc" stroke={K} strokeWidth={r * 0.04} />
    <ellipse cy={r * 0.18} rx={r * 0.14} ry={r * 0.1} fill={K} />
    {[-1, 1].map((s) => <circle key={s} cx={s * r * 0.36} cy={-r * 0.1} r={r * (BL(T, s) ? 0.02 : 0.08)} fill={K} />)}
    {mouth === 'smile' ? <path d={`M${-r * 0.16} ${r * 0.38} Q0 ${r * 0.52} ${r * 0.16} ${r * 0.38}`} fill="none" stroke={K} strokeWidth={r * 0.05} strokeLinecap="round" />
      : <ellipse cy={r * 0.44} rx={r * 0.08} ry={r * 0.1} fill={K} />}
  </g>);
}
// big thought cloud with content drawn by children (centre 0,0)
function Cloud({ x, y, s = 1, k = 1, children }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${s * BK(k)})`}>
    {[[-150, 0, 120], [-60, -70, 130], [70, -70, 130], [160, 0, 115], [80, 70, 120], [-70, 75, 120]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" stroke={K} strokeWidth="7" />)}
    {[[-150, 0, 112], [-60, -70, 122], [70, -70, 122], [160, 0, 107], [80, 70, 112], [-70, 75, 112], [0, 0, 150]].map(([cx, cy, r], i) => <circle key={'f' + i} cx={cx} cy={cy} r={r} fill="#fff" />)}
    {children}</g>);
}
// bold red "no" sign
function NoSign({ x, y, r = 170, k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}><circle r={r} fill="none" stroke={R} strokeWidth={r * 0.16} />
    <line x1={-r * 0.7} y1={-r * 0.7} x2={r * 0.7} y2={r * 0.7} stroke={R} strokeWidth={r * 0.16} strokeLinecap="round" /></g>);
}
// desk bell
function DeskBell({ x, y, s = 1, press = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-130" y="0" width="260" height="40" rx="12" fill="#3a3a46" stroke={K} strokeWidth="7" />
    <path d="M-110 0 Q-110 -120 0 -125 Q110 -120 110 0 Z" fill={A} stroke={K} strokeWidth="8" />
    <rect x="-10" y={-160 + press * 22} width="20" height="40" fill="#3a3a46" stroke={K} strokeWidth="5" /><ellipse cx="0" cy={-162 + press * 22} rx="32" ry="12" fill="#3a3a46" stroke={K} strokeWidth="5" />
    <path d="M-70 -60 Q-70 -95 -35 -105" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.6" /></g>);
}
function RedCar({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-150 10 L-150 -40 Q-150 -60 -120 -64 L-80 -110 Q-60 -130 0 -130 Q60 -130 80 -110 L120 -64 Q150 -60 150 -40 L150 10 Z" fill={R} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <path d="M-70 -100 L-10 -100 L-10 -66 L-100 -66 Z M10 -100 L70 -100 L100 -66 L10 -66 Z" fill="#bfe3f2" stroke={K} strokeWidth="5" />
    {[-90, 90].map((wx) => <g key={wx}><circle cx={wx} cy="14" r="34" fill="#2a2a2a" stroke={K} strokeWidth="7" /><circle cx={wx} cy="14" r="12" fill="#bbb" /></g>)}</g>);
}

/* 1 — 1 AM: June in bed, a thought cloud with her ex; at "not to think" a red NO stamps on; at "EX" he grows back bigger */
function MGJuneEx({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5), c2 = b(beats, 2, 1.1), grow = SM(c2, c2 + 0.4, t);
  return (<g><MGBg kind="roomNight" />
    <MGChip x={540} y={200} text="1:12 AM · STILL AWAKE" outline size={42} pop={t / 0.25} />
    <Cloud x={650} y={540} s={lp(0.85, 1.05, grow)} k={(t - 0.1) / 0.35}>
      <MGHead x={0} y={0} r={lp(95, 120, grow)} who={EX} mouth="smile" look={[-0.4, 0.2]} bl={BL(T, 2)} />
      {t > c1 && t < c2 && <NoSign x={0} y={0} r={150} k={(t - c1) / 0.25} />}
    </Cloud>
    {[0, 1, 2].map((i) => <circle key={i} cx={430 - i * 50} cy={760 + i * 50} r={22 - i * 6} fill="#fff" stroke={K} strokeWidth="4" />)}
    <MGBust x={330} y={1000} r={150} who="june" mouth="wave" brow="worried" look={[0.8, -0.8]} bl={BL(T)} sweat={t > c2 ? T : null} />
    <g transform="translate(820 1200) rotate(8)"><rect x="-80" y="-24" width="160" height="48" rx="12" fill="#18161d" stroke={K} strokeWidth="5" /><MGGlow x={0} y={30} r={90} col="#9ad7ff" a={0.4} /></g></g>);
}

/* 2 — "you": June walks down the street; everything is him: OUR SONG, OUR CAFÉ, HIS STREET */
function MGEverySong({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5), c2 = b(beats, 2, 1.0), c3 = b(beats, 3, 1.5);
  const tags = [['OUR SONG', 260, 520, c1], ['OUR CAFÉ', 800, 470, c2]];
  return (<g><MGBg kind="street" />
    {tags.map(([w, x, y, c]) => t > c && <g key={w}><MGChip x={x} y={y} text={w} size={44} pop={(t - c) / 0.25} />
      <MGHead x={x} y={y + 110} r={50} who={EX} mouth="smile" look={[0, 0.3]} bl={BL(T, x)} /></g>)}
    <g transform={`translate(${200 + Math.sin(T * 2) * 20} 360)`} opacity={t > c1 ? 1 : 0}><ellipse cx="0" cy="40" rx="26" ry="20" fill={A} stroke={K} strokeWidth="5" transform="rotate(-20 0 40)" /><line x1="22" y1="34" x2="22" y2="-60" stroke={K} strokeWidth="8" /></g>
    <MGPerson x={lp(380, 600, cl(t / 3))} y={1300} s={2.4} who="june" walk={T * 8} mouth="frown" brow="worried" look={[0.4, -0.5]} bl={BL(T)} />
    {t > c3 && <g><MGGlow x={540} y={760} r={300} col="#ffd0e0" a={0.5} /><MGHead x={540} y={760} r={130} who={EX} mouth="grin" look={[0, 0.4]} bl={BL(T, 1)} />
      <MGChip x={540} y={560} text="HIM. AGAIN." col={R} txt="#fff" size={52} pop={(t - c3) / 0.25} /></g>}</g>);
}

/* 3 — snapback: June holds a door shut on the thought; the harder she pushes, the more it bulges */
function MGSnapTrying({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), push = SM(0, 0.5, t), bulge = 18 * Math.sin(T * 9) * push;
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <g transform={`translate(640 860) scale(${1 + 0.02 * Math.sin(T * 9) * push})`}><rect x="-170" y="-420" width="340" height="740" fill="#8c6b4f" stroke={K} strokeWidth="10" />
      <rect x="-130" y="-370" width="260" height="280" fill="#7a5c42" stroke={K} strokeWidth="6" /><circle cx="120" cy="-20" r="20" fill={A} stroke={K} strokeWidth="5" />
      <rect x="-150" y="-470" width="300" height="70" rx="10" fill="#fff" stroke={K} strokeWidth="6" /><text y="-422" textAnchor="middle" fontFamily={BB} fontSize="54" fill={R}>DON'T THINK</text>
      <MGHead x={0} y={-230 + bulge} r={70} who={EX} mouth="o" look={[0, 0]} bl={0} /></g>
    <MGPerson x={300} y={1290} s={2.4} who="june" mouth="wave" brow="worried" look={[1, -0.2]} bl={BL(T)} sweat={T} />
    <MGArm x1={340} y1={1010} x2={470} y2={900} sleeve={JUNE} skin={JUNE_SKIN} w={36} />
    {t > c1 && <g><MGChip x={540} y={250} text="THE TRYING = THE PROBLEM" col={R} txt="#fff" size={50} pop={(t - c1) / 0.25} />
      <MGArrows x={640} y={700} t={t - c1} n={5} from={520} to={300} /></g>}</g>);
}

/* 4 — the study: a white bear with a red NO sign; journal chip */
function MGWhiteBear({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), c5 = b(beats, 5, 2.3);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="J. PERS. SOC. PSYCHOLOGY · 1987" outline size={38} pop={t / 0.25} />
    <MGChip x={540} y={320} text="RULE: DON'T THINK OF IT" size={44} pop={(t - c3) / 0.25} />
    <Bear x={540} y={850} r={lp(0, 240, EO((t - c5 + 0.3) / 0.4))} T={T} />
    {t > c5 && <NoSign x={540} y={850} r={330} k={(t - c5 - 0.2) / 0.3} />}
    {t < c5 && <text x={540} y={880} textAnchor="middle" fontFamily={BB} fontSize="120" fill="#fff" opacity={SM(0.2, 0.5, t)}>?</text>}</g>);
}

/* 5 — the bell: a hand rings a desk bell over and over; DING chips pile up, little bears pop in each thought */
function MGBells({ T, t, beats }) {
  const c4 = b(beats, 4, 2.0), rate = t > c4 ? 3 : 1.4, ph = (T * rate) % 1, press = ph < 0.2 ? Math.sin(ph / 0.2 * Math.PI) : 0, n = Math.max(0, Math.min(9, Math.floor(t * rate)));
  return (<g><MGBg kind="wall" c1="#d9e3ee" c2="#9fb0c4" />
    <rect x="-300" y="1150" width="1680" height="800" fill="#8c6a4a" /><rect x="-300" y="1150" width="1680" height="24" fill="#6b4d33" />
    <DeskBell x={540} y={1110} s={1.3} press={press} />
    <MGArm x1={980} y1={760} x2={560} y2={lp(860, 900, press)} sleeve={MG.extra(3).top} skin={MG.extra(3).skin} w={70} />
    {[...Array(n)].map((_, i) => <g key={i} transform={`translate(${170 + (i % 3) * 320 + hsh(i) * 40} ${300 + Math.floor(i / 3) * 170})`}><MGChip x={0} y={0} text="DING!" size={40} pop={1} /><Bear x={110} y={0} r={36} T={T} /></g>)}
    {t > c4 && <MGChip x={540} y={1290} text="STILL RINGING" col={R} txt="#fff" size={46} pop={(t - c4) / 0.25} />}</g>);
}

/* 6 — the rebound: two thought tallies; the "fought it first" side fills with more bears */
function MGRebound({ T, t, beats }) {
  const c4 = b(beats, 4, 1.9), fill = (t - 0.3) / 1.6;
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="LATER: THINK ABOUT ANYTHING" outline size={40} pop={t / 0.25} />
    {[0, 1].map((side) => { const x0 = side ? 640 : 120, n = side ? 7 : 12;
      return (<g key={side}><rect x={x0} y={380} width={320} height={860} rx="26" fill="#2a3150" stroke={K} strokeWidth="7" />
        {[...Array(n)].map((_, i) => { const k = (fill * n - i); return k > 0 && <Bear key={i} x={x0 + 85 + (i % 2) * 150} y={1160 - Math.floor(i / 2) * 135} r={52 * BK(Math.min(1, k))} T={T + i} />; })}
        <text x={x0 + 160} y={1310} textAnchor="middle" fontFamily={BB} fontSize="52" fill="#fff">{side ? 'NEVER FOUGHT IT' : 'FOUGHT IT FIRST'}</text></g>); })}
    {t > c4 && <MGChip x={280} y={330} text="MORE" col={R} txt="#fff" size={56} pop={(t - c4) / 0.25} />}</g>);
}

/* 7 — name it: the bear bounces back up off the floor under the title */
function MGNameRebound({ T, t }) {
  const ph = (T * 0.9) % 1, y = 1240 - Math.abs(Math.sin(ph * Math.PI)) * 420, sq = ph < 0.08 || ph > 0.92 ? 0.85 : 1;
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={720} a={0.55 * SM(0, 0.3, t)} />
    <MGTitle lines={[['REBOUND', A, 200], ['EFFECT', '#fff', 120]]} y={250} a={EO((t - 0.2) / 0.35)} />
    <ellipse cx={540} cy={1320} rx={lp(170, 90, (1240 - y) / 420)} ry={24} fill="#000" opacity="0.35" />
    <g transform={`translate(540 ${y}) scale(${1 / sq} ${sq})`}><Bear x={0} y={0} r={130} T={T} /></g></g>);
}

/* 8 — self-proof: a box with a DON'T LOOK sign; June's eyes slide straight to it */
function MGDontLook({ T, t, beats }) {
  const c4 = b(beats, 4, 2.0), lk = SM(c4 - 0.3, c4, t);
  return (<g><MGBg kind="wall" c1="#f3e2c0" c2="#d9b98a" />
    <g transform="translate(780 900)"><rect x="-170" y="-150" width="340" height="300" fill="#c9965a" stroke={K} strokeWidth="8" /><path d="M-170 -150 L-120 -220 L220 -220 L170 -150 Z" fill="#dcae74" stroke={K} strokeWidth="8" strokeLinejoin="round" />
      <rect x="-140" y="-80" width="280" height="100" rx="10" fill="#fff" stroke={K} strokeWidth="6" transform="rotate(-6)" /><text y="-12" textAnchor="middle" fontFamily={BB} fontSize="64" fill={R} transform="rotate(-6)">DON'T LOOK</text></g>
    <MGBust x={300} y={880} r={160} who="june" mouth={lk > 0.5 ? 'o' : 'flat'} brow={lk > 0.5 ? 'up' : 'flat'} look={[lp(-0.6, 1, lk), lp(0, 0.2, lk)]} bl={BL(T)} />
    <MGRing cx={780} cy={890} rx={230} ry={190} p={(t - c4) / 0.4} />
    {t > c4 && <MGChip x={540} y={330} text="LOOKED." size={60} pop={(t - c4) / 0.25} />}</g>);
}

/* 9 — Nia's trick: pick ONE other thing (a red car) and think about that on purpose; the bear fades */
function MGNiaTrick({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c4 = b(beats, 4, 2.0), swap = SM(c1, c1 + 0.6, t);
  return (<g><MGBg kind="wall" c1="#ffe2b8" c2="#f2a96a" />
    <Cloud x={540} y={520} s={0.95} k={(t - 0.1) / 0.3}>
      <g opacity={1 - swap}><Bear x={0} y={0} r={110} T={T} /></g>
      <g opacity={swap} transform={`scale(${0.6 + 0.4 * swap})`}><RedCar x={0} y={30} s={1.1} /></g></Cloud>
    <MGPerson x={300} y={1320} s={2.3} who="june" mouth={swap > 0.5 ? 'smile' : 'flat'} brow="up" look={[0.3, -1]} bl={BL(T)} />
    <MGPerson x={790} y={1310} s={2.3} who="nia" mouth="grin" brow="up" look={[-1, -0.3]} bl={BL(T, 1)} />
    <MGChip x={540} y={200} text="NIA'S TRICK" outline size={46} pop={t / 0.25} />
    {t > c4 && <MGChip x={540} y={830} text="ONE THING · ON PURPOSE" size={44} pop={(t - c4) / 0.25} />}</g>);
}

/* 10 — end: June relaxed with tea; the little bear waves and walks off frame */
function MGEndPush({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), bx = lp(700, 1250, SM(0.4, 3.0, t));
  return (<g><MGBg kind="room" /><MGGlow x={460} y={800} r={420} col="#fff3c4" a={0.45} />
    <MGPerson x={380} y={1300} s={2.5} who="june" mouth="smile" brow="flat" look={[1, 0]} bl={BL(T)} />
    <g transform="translate(560 1080)"><rect x="-40" y="-50" width="80" height="90" rx="10" fill="#fff" stroke={K} strokeWidth="6" /><path d="M40 -30 q30 0 30 25 q0 25 -32 22" fill="none" stroke={K} strokeWidth="6" /></g>
    <g transform={`translate(${bx} ${1210 + Math.abs(Math.sin(T * 6)) * -14})`}><Bear x={0} y={0} r={70} T={T} /></g>
    <MGChip x={540} y={220} text="LET IT PASS" size={52} pop={t / 0.25} />
    {t > c3 && <MGChip x={540} y={340} text="SEND IT TO THAT FRIEND" outline size={42} pop={(t - c3) / 0.25} />}</g>);
}

Object.assign(window, { MGJuneEx, MGEverySong, MGSnapTrying, MGWhiteBear, MGBells, MGRebound, MGNameRebound, MGDontLook, MGNiaTrick, MGEndPush });
})();
