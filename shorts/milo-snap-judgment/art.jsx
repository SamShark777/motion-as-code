// art.jsx — "He's Late, So He's Unreliable?" (Milo ep. 5 with Dev, ted-MG motion graphics). Fundamental attribution
// error (Jones & Harris 1967; named by Ross 1977). Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OSW = "'Oswald', sans-serif";

// a city bus, front wheels at ground y; broken = bonnet smoke + hazard lights
function Bus({ x, y, s = 1, broken = 0, T = 0, flip = false }) {
  const haz = broken > 0 && Math.sin(T * 9) > 0;
  return (<g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <rect x="-330" y="-330" width="660" height="290" rx="34" fill={A} stroke={K} strokeWidth="9" />
    <rect x="-330" y="-120" width="660" height="34" fill="#d9532f" stroke={K} strokeWidth="6" />
    {[...Array(4)].map((_, i) => <rect key={i} x={-300 + i * 132} y="-295" width="110" height="110" rx="12" fill="#bfe3f2" stroke={K} strokeWidth="6" />)}
    <rect x="232" y="-295" width="74" height="200" rx="10" fill="#8fc6dc" stroke={K} strokeWidth="6" />
    <circle cx="315" cy="-70" r="16" fill={haz ? '#ffb02e' : '#fff3c4'} stroke={K} strokeWidth="5" />
    <circle cx="-315" cy="-70" r="14" fill={haz ? '#ff5a3c' : '#7a2a20'} stroke={K} strokeWidth="5" />
    {[-200, 200].map((wx) => <g key={wx}><circle cx={wx} cy="-30" r="52" fill={K} /><circle cx={wx} cy="-30" r="20" fill="#9aa7ae" /></g>)}
    <rect x="-80" y="-372" width="160" height="44" rx="8" fill={K} /><text x="0" y="-338" textAnchor="middle" fontFamily={BB} fontSize="38" fill="#ffcf5a">{broken > 0 ? 'NOT IN SERVICE' : 'ROUTE 12'}</text>
    {broken > 0 && [...Array(6)].map((_, i) => { const p = ((T * 0.6 + i / 6) % 1);
      return <circle key={i} cx={300 + Math.sin(i * 2 + T) * 30 + p * 60} cy={-120 - p * 380} r={(30 + p * 70) * broken} fill="#8a8794" opacity={(1 - p) * 0.75} stroke={K} strokeWidth="4" />; })}
  </g>);
}
// a sheet of paper with a heading and scribble lines
function Essay({ x, y, rot = 0, head, col = A, s = 1, a = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={a}>
    <rect x="-170" y="-220" width="340" height="440" rx="12" fill="#f8f4ea" stroke={K} strokeWidth="8" />
    <rect x="-170" y="-220" width="340" height="96" rx="12" fill={col} stroke={K} strokeWidth="8" />
    <text x="0" y="-150" textAnchor="middle" fontFamily={BB} fontSize="58" fill={K}>{head}</text>
    {[...Array(7)].map((_, i) => <rect key={i} x="-130" y={-90 + i * 42} width={i === 6 ? 140 : 260 - (i % 3) * 30} height="12" rx="6" fill="#c9c1b1" />)}
  </g>);
}
// a red ink stamp, slammed in by k 0..1
function Stamp({ x, y, text, k, rot = -10, size = 90 }) {
  if (k <= 0) return null;
  const sc = lp(2.2, 1, EO(k)), w = text.length * size * 0.5 + 60;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={cl(k * 2)}>
    <rect x={-w / 2} y={-size * 0.75} width={w} height={size * 1.5} rx="14" fill="none" stroke={R} strokeWidth="12" />
    <text x="0" y={size * 0.34} textAnchor="middle" fontFamily={BB} fontSize={size} letterSpacing="4" fill={R}>{text}</text></g>);
}

/* 1 — night street: Milo waits under the lamp, checks his watch; the clock ticks past +20; verdict bubble */
function MGLateHook({ T, t, beats }) {
  const c = b(beats, 2), mins = 18 + Math.min(2, Math.floor(t * 1.5));
  return (<g><MGBg kind="street" T={T} />
    <MGPerson x={330} y={1250} s={2.55} who="milo" mouth={t > c ? 'frown' : 'flat'} brow={t > c ? 'angry' : 'worried'} look={t > c ? [0.4, 0] : [0.6, 0.6]} bl={BL(T)} />
    <g transform="translate(790 760)"><circle r="150" fill="#f8f4ea" stroke={K} strokeWidth="10" />
      {[...Array(12)].map((_, i) => <rect key={i} x="-5" y="-138" width="10" height="24" fill={K} transform={`rotate(${i * 30})`} />)}
      <line x1="0" y1="0" x2="0" y2="-80" stroke={K} strokeWidth="12" strokeLinecap="round" transform={`rotate(${210 + t * 10})`} />
      <line x1="0" y1="0" x2="0" y2="-118" stroke={R} strokeWidth="8" strokeLinecap="round" transform={`rotate(${t * 140})`} /><circle r="12" fill={K} /></g>
    <MGChip x={540} y={240} text={`DEV · ${mins} MIN LATE`} outline size={48} pop={t / 0.25} />
    <MGChip x={790} y={1000} text="7:20 PM" size={40} pop={(t - 0.2) / 0.25} />
    <MGBubble x={360} y={560} text="DEV =|UNRELIABLE." k={(t - c) / 0.3} size={48} /></g>);
}

/* 2 — the viewer's phone: "running late, sorry!" → UNRELIABLE stamp slams over it */
function MGJudgePhone({ T, t, beats }) {
  const c = b(beats, 4, 1.8);
  return (<g><MGBg kind="wall" c1="#3a2a3e" c2="#1d1622" />
    <MGPhone x={540} y={840} rot={-4} time="7:20" day="FRIDAY" from="DEV" msg="running late, sorry!!" k={(t - 0.3) / 0.35} />
    <MGArm x1={900} y1={1950} x2={720} y2={1220} w={106} />
    <Stamp x={540} y={1070} text="UNRELIABLE" k={(t - c) / 0.25} size={100} />
    <MGChip x={540} y={200} text="YOU, EVERY TIME" size={44} pop={t / 0.25} /></g>);
}

/* 3 — snapback: Milo close-up; the scale tips — "DEV LATE = HIS FAULT" vs "ME LATE = TRAFFIC" */
function MGDoubleStandard({ T, t, beats }) {
  const c = b(beats, 2, 1.2), k = SM(c - 0.05, c + 0.35, t);
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" /><MGGlow x={540} y={700} r={560} col="#ff8fb1" a={0.14} />
    <MGBust x={540} y={980} r={210} who="milo" mouth={k > 0.5 ? 'o' : 'flat'} brow={k > 0.5 ? 'up' : 'angry'} browUp={k} look={k > 0.5 ? [0, -0.1] : [-0.7, -0.3]} blush={k * 0.8} sweat={k > 0.5 ? (t - c) * 0.6 : null} bl={BL(T)} />
    <MGChip x={290} y={330} text="DEV LATE" outline col={R} size={44} pop={t / 0.25} />
    <MGChip x={290} y={430} text="= WHO HE IS" size={40} col={R} txt="#fff" pop={(t - 0.2) / 0.25} />
    <MGChip x={790} y={330} text="ME LATE" outline size={44} pop={(t - c) / 0.25} />
    <MGChip x={790} y={430} text="= BAD LUCK" size={40} pop={(t - c - 0.15) / 0.25} />
    {k > 0 && <text x={540} y={410} textAnchor="middle" fontFamily={BB} fontSize={90 * BK(k)} fill="#fff">≠</text>}</g>);
}

/* 4 — next week: the bus pulls away, Milo runs in late; Dev waits; "THE BUS!" */
function MGBusExcuse({ T, t, beats }) {
  const c = b(beats, 3, 1.6), bx = lp(760, 1500, EO(t / 2.2)), mx = lp(1150, 640, EO(t / 1.3));
  return (<g><MGBg kind="street" T={T} />
    <Bus x={bx} y={1180} s={0.95} />
    <MGPerson x={250} y={1250} s={2.3} who="dev" mouth="flat" brow="flat" look={[1, 0]} bl={BL(T, 0.6)} />
    <MGPerson x={mx} y={1250} s={2.3} who="milo" walk={t < 1.3 ? t * 14 : 0} mouth={t > c ? 'grin' : 'o'} brow={t > c ? 'up' : 'worried'} look={[-1, 0]} sweat={t * 0.8} bl={BL(T)} />
    <MGChip x={540} y={240} text="NEXT WEEK · 7:25 PM" outline size={46} pop={t / 0.25} />
    <MGBubble x={640} y={600} text="THE BUS!" k={(t - c) / 0.3} size={56} />
    {t > b(beats, 2) && t < c && <text x={640} y={560} textAnchor="middle" fontFamily={BB} fontSize="150" fill={A} stroke={K} strokeWidth="5">!</text>}</g>);
}

/* 5 — the study: Duke 1967; a reader between two essays, FOR and AGAINST */
function MGDuke({ T, t, beats }) {
  const c = b(beats, 2, 0.8);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={240} text="DUKE UNIVERSITY · 1967" outline size={46} pop={t / 0.25} />
    <Essay x={290} y={760} rot={-6} head="FOR CASTRO" col="#7fd6a0" s={lp(0.6, 1, EO((t - c) / 0.4))} a={cl((t - c) / 0.2)} />
    <Essay x={790} y={760} rot={6} head="AGAINST" col="#ff8f7a" s={lp(0.6, 1, EO((t - c - 0.2) / 0.4))} a={cl((t - c - 0.2) / 0.2)} />
    <MGHead x={540} y={1150} r={120} who={MG.extra(2)} look={[OS(T, 2.4) * 0.8, -0.6]} brow="flat" mouth="flat" bl={BL(T)} />
    <path d="M380 1300 A160 70 0 0 1 700 1300 Z" fill="#6a7bd1" stroke={K} strokeWidth="6" />
    <MGChip x={540} y={420} text="GUESS THE WRITER'S REAL VIEW" size={34} pop={(t - b(beats, 3)) / 0.25} /></g>);
}

/* 6 — the debate coach hands out sides: ASSIGNED stamp on the essay */
function MGAssigned({ T, t, beats }) {
  const c = b(beats, 2, 1.0);
  return (<g><MGBg kind="navy" />
    <MGPerson x={230} y={1280} s={2.2} who={MG.extra(5)} mouth="smile" brow="up" look={[1, 0]} bl={BL(T)} />
    <MGArm x1={300} y1={1010} x2={470} y2={880} sleeve={MG.extra(5).top} skin={MG.extra(5).skin} w={40} />
    <MGChip x={230} y={640} text="DEBATE COACH" size={34} pop={t / 0.25} />
    <Essay x={720} y={830} rot={4} head="FOR CASTRO" col="#7fd6a0" />
    <Stamp x={720} y={900} text="ASSIGNED" k={(t - c) / 0.25} size={90} rot={-12} />
    <MGChip x={540} y={240} text="THE WRITER DIDN'T CHOOSE" outline size={44} pop={(t - 0.2) / 0.25} /></g>);
}

/* 7 — the result: guessed attitude on a 10–70 scale; assigned sides still far apart */
function MGStill({ T, t, beats }) {
  const x0 = 140, x1 = 940, X = (v) => lp(x0, x1, (v - 10) / 60), k = EO((t - 0.3) / 0.8);
  const mark = (v, y, label, col, a = 1) => { const x = lp(X(40), X(v), k);
    return (<g opacity={a}><path d={`M${x} ${y + 12} L${x - 24} ${y - 26} L${x + 24} ${y - 26} Z`} fill={col} stroke={K} strokeWidth="5" />
      <text x={x} y={y - 46} textAnchor="middle" fontFamily={BB} fontSize="74" fill={col}>{(lp(40, v, k)).toFixed(1)}</text>
      <text x={x} y={y + 70} textAnchor="middle" fontFamily={OSW} fontWeight="700" fontSize="30" fill="#fff" opacity="0.85">{label}</text></g>); };
  const bar = (y) => <rect x={x0} y={y - 14} width={x1 - x0} height="28" rx="14" fill="#3a4160" />;
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={230} text="SIDE WAS ASSIGNED" size={46} pop={t / 0.25} />
    <text x={540} y={380} textAnchor="middle" fontFamily={OSW} fontWeight="700" fontSize="34" letterSpacing="3" fill="#fff" opacity="0.75">GUESSED REAL VIEW OF THE WRITER</text>
    <text x={x0} y={480} textAnchor="middle" fontFamily={BB} fontSize="46" fill="#ff8f7a">ANTI</text>
    <text x={x1} y={480} textAnchor="middle" fontFamily={BB} fontSize="46" fill="#7fd6a0">PRO</text>
    {bar(680)}{mark(22.9, 680, 'READ AGAINST', '#ff8f7a')}
    {bar(960)}{mark(44.1, 960, 'READ FOR', '#7fd6a0')}
    <MGChip x={540} y={1130} text="STILL FAR APART" col={R} txt="#fff" size={44} pop={(t - 1.0) / 0.25} />
    <MGChip x={540} y={1250} text="FREE CHOICE: 17.4 VS 59.6" outline col="#cfd6ff" size={30} pop={(t - b(beats, 1, 1.2)) / 0.25} />
    <text x={540} y={545} textAnchor="middle" fontFamily={OSW} fontSize="28" fill="#cfd6ff" opacity="0.6">SCALE 10 = ANTI · 70 = PRO</text></g>);
}

/* 8 — name it: Dev alone in the spotlight, red arrows of blame; the broken bus hidden in the dark */
function MGNameFAE({ T, t, beats }) {
  const a = SM(0, 0.3, t), c = b(beats, 3, 1.4);
  return (<g><MGBg kind="stage" />
    <g opacity={0.18 + 0.5 * SM(c, c + 0.4, t)}><Bus x={900} y={1300} s={0.55} broken={1} T={T} /></g>
    <MGSpot x={430} yTop={-80} yBot={1320} wTop={160} wBot={560} a={0.55 * a} />
    <MGPerson x={430} y={1300} s={2.1} who="dev" mouth="frown" brow="worried" look={[0, 0]} bl={BL(T, 0.3)} />
    <MGArrows x={430} y={1000} t={t - 0.4} n={5} from={650} to={210} />
    <MGTitle lines={[['FUNDAMENTAL', '#fff', 120], ['ATTRIBUTION', '#fff', 120], ['ERROR', A, 150]]} y={170} a={EO((t - 0.2) / 0.35)} />
    <MGChip x={540} y={600} text="NAMED BY LEE ROSS · 1977" outline size={34} pop={(t - 0.6) / 0.25} />
    {t > c && <MGChip x={860} y={1040} text="THE SITUATION" size={34} pop={(t - c - 0.2) / 0.25} />}</g>);
}

/* 9 — payoff: last week, Dev's bus broken down on the road, Dev stuck beside it */
function MGBrokenBus({ T, t, beats }) {
  const c = b(beats, 2, 1.0);
  return (<g><MGBg kind="street" T={T} />
    <Bus x={560} y={1200} s={0.8} broken={SM(c - 0.2, c + 0.3, t)} T={T} />
    <MGPerson x={140} y={1260} s={2.1} who="dev" mouth="wave" brow="worried" look={[0.2, 0.7]} sweat={t * 0.7} bl={BL(T, 0.2)} />
    <g transform="translate(195 985) rotate(-10)"><rect x="-26" y="-44" width="52" height="88" rx="10" fill="#18161d" stroke={K} strokeWidth="5" /><rect x="-18" y="-34" width="36" height="64" rx="5" fill="#3a4a8a" /></g>
    <MGRing cx={810} cy={900} rx={140} ry={200} p={(t - c) / 0.45} />
    <MGChip x={540} y={240} text="LAST WEEK · 7:00 PM" outline size={46} pop={t / 0.25} />
    <MGBubble x={200} y={780} text="ugh, 20 min|walk…" k={(t - c - 0.3) / 0.3} size={36} /></g>);
}

/* 10 — reframe: Milo thinks; in his head Dev is huge and lit, the bus tiny and grey */
function MGPeopleFirst({ T, t, beats }) {
  const c = b(beats, 2, 1.0), k = SM(c - 0.1, c + 0.4, t);
  return (<g><MGBg kind="wall" c1="#e8d9b8" c2="#cdb68e" />
    <rect x="410" y="200" width="620" height="900" rx="40" fill="#151a2c" stroke={K} strokeWidth="8" />
    <circle cx="380" cy="1060" r="20" fill="#151a2c" stroke={K} strokeWidth="6" /><circle cx="340" cy="1110" r="12" fill="#151a2c" stroke={K} strokeWidth="5" />
    <MGSpot x={720} yTop={210} yBot={960} wTop={90} wBot={lp(260, 420, k)} a={0.5} />
    <MGPerson x={720} y={960} s={lp(1.8, 2.6, k)} who="dev" mouth="flat" brow="flat" look={[0, 0]} bl={BL(T, 0.5)} />
    <g opacity={lp(0.9, 0.35, k)}><Bus x={960} y={1060} s={lp(0.3, 0.16, k)} /></g>
    <MGChip x={720} y={290} text="PERSON" size={44} pop={(t - c) / 0.25} />
    <MGChip x={930} y={1020} text="SITUATION" outline col="#9aa3c8" size={24} pop={(t - c - 0.2) / 0.25} />
    <MGBust x={250} y={1150} r={150} who="milo" mouth="smile" brow="up" look={[0.8, -0.6]} blush={0.5} bl={BL(T)} /></g>);
}

/* 11 — end: Milo and Dev laughing at the stop; a bus finally rolls in behind them */
function MGEndBus({ T, t, beats }) {
  const c = b(beats, 2, 1.0), bx = lp(1700, 760, EO((t - c) / 1.2));
  return (<g><MGBg kind="street" T={T} />
    {t > c && <Bus x={bx} y={1160} s={0.8} flip />}
    <MGPerson x={350} y={1260} s={2.45} who="milo" mouth="grin" brow="up" look={[0.7, 0]} bl={BL(T)} />
    <MGPerson x={720} y={1260} s={2.45} who="dev" mouth="grin" brow="up" look={[-0.7, 0]} bl={BL(T, 0.8)} />
    {[0, 1, 2].map((k) => <text key={k} x={440 + k * 80} y={500 - k * 30 + Math.sin(T * 8 + k) * 8} fontFamily={BB} fontSize="80" fill={A} opacity={SM(0.1 + k * 0.15, 0.3 + k * 0.15, t)}>HA</text>)}
    <MGChip x={540} y={240} text="IT'S USUALLY THE BUS" size={52} pop={t / 0.25} /></g>);
}

Object.assign(window, { MGLateHook, MGJudgePhone, MGDoubleStandard, MGBusExcuse, MGDuke, MGAssigned, MGStill, MGNameFAE, MGBrokenBus, MGPeopleFirst, MGEndBus });
})();
