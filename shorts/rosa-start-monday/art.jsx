// art.jsx — "Why 'I'll Start Monday' Isn't Just an Excuse" (Rosa ep. 3, with Nia; ted-MG motion graphics).
// Fresh start effect (Dai, Milkman & Riis 2014, Management Science). Full 1080×1920 frames with tedmg-kit.jsx;
// captions at y ≈ 1480 — keep faces and labels out of y 1370–1590. No study numbers on screen (none verified).
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const ROSA = '#a46fd1', ROSA_SKIN = '#f2dccb', NIA = '#e8b33e', NIA_SKIN = '#8d6346';

// crisps bag (open, a crisp sticking out)
function Crisps({ x, y, s = 1, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <ellipse cx="-10" cy="-150" rx="40" ry="20" fill="#f3c25a" stroke={K} strokeWidth="6" />
    <ellipse cx="30" cy="-160" rx="34" ry="17" fill="#f6cf6c" stroke={K} strokeWidth="6" transform="rotate(-25 30 -160)" />
    <path d="M-110 -140 L110 -140 L95 130 Q0 150 -95 130 Z" fill={R} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <path d="M-110 -140 L-90 -120 L-70 -140 L-50 -120 L-30 -140 L-10 -120 L10 -140 L30 -120 L50 -140 L70 -120 L90 -140 L110 -140" fill="none" stroke={K} strokeWidth="6" />
    <circle cx="0" cy="10" r="58" fill={A} stroke={K} strokeWidth="6" />
    <text x="0" y="26" textAnchor="middle" fontFamily={BB} fontSize="50" fill={K}>CRISPS</text></g>);
}
// gym duffel bag
function GymBag({ x, y, s = 1, col = '#3f7fbf' }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70 -70 Q0 -170 70 -70" fill="none" stroke={K} strokeWidth="22" strokeLinecap="round" />
    <path d="M-70 -70 Q0 -170 70 -70" fill="none" stroke="#2b2b2b" strokeWidth="12" strokeLinecap="round" />
    <rect x="-150" y="-80" width="300" height="160" rx="70" fill={col} stroke={K} strokeWidth="8" />
    <line x1="-110" y1="-40" x2="110" y2="-40" stroke={K} strokeWidth="6" strokeDasharray="14 10" />
    <rect x="-40" y="0" width="80" height="44" rx="10" fill={A} stroke={K} strokeWidth="5" /></g>);
}
// a sofa seen from the front, seat at y
function Sofa({ x, y, w = 900, col = '#5b3f6a' }) {
  return (<g><rect x={x - w / 2} y={y - 330} width={w} height="340" rx="60" fill={col} stroke={K} strokeWidth="9" />
    <rect x={x - w / 2 - 50} y={y - 150} width="130" height="300" rx="50" fill={col} stroke={K} strokeWidth="9" />
    <rect x={x + w / 2 - 80} y={y - 150} width="130" height="300" rx="50" fill={col} stroke={K} strokeWidth="9" />
    <rect x={x - w / 2 + 70} y={y - 20} width={w - 140} height="170" rx="30" fill="#6e4f80" stroke={K} strokeWidth="9" /></g>);
}
// tear-off calendar page
function CalPage({ x, y, s = 1, top = 'MONDAY', big = 'MON', rot = 0, col = R }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x="-210" y="-250" width="420" height="500" rx="26" fill="#f4efe4" stroke={K} strokeWidth="10" />
    <path d="M-210 -150 L-210 -224 Q-210 -250 -184 -250 L184 -250 Q210 -250 210 -224 L210 -150 Z" fill={col} stroke={K} strokeWidth="10" />
    {[-120, 0, 120].map((rx) => <rect key={rx} x={rx - 12} y="-290" width="24" height="70" rx="12" fill="#9aa7ae" stroke={K} strokeWidth="6" />)}
    <text x="0" y="-178" textAnchor="middle" fontFamily={BB} fontSize="64" letterSpacing="4" fill="#fff">{top}</text>
    <text x="0" y="110" textAnchor="middle" fontFamily={BB} fontSize="230" fill={K}>{big}</text></g>);
}
function Cake({ x, y, s = 1, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-120" y="-60" width="240" height="120" rx="20" fill="#e07fa8" stroke={K} strokeWidth="8" />
    <path d="M-120 -40 Q-90 0 -60 -40 Q-30 0 0 -40 Q30 0 60 -40 Q90 0 120 -40 L120 -60 L-120 -60 Z" fill="#f4efe4" stroke={K} strokeWidth="6" />
    {[-60, 0, 60].map((cx) => <g key={cx}><rect x={cx - 9} y="-130" width="18" height="70" fill="#7fd6ff" stroke={K} strokeWidth="5" />
      <path d={`M${cx} ${-170 + Math.sin(T * 9 + cx) * 4} Q${cx + 16} -145 ${cx} -134 Q${cx - 16} -145 ${cx} ${-170 + Math.sin(T * 9 + cx) * 4} Z`} fill={A} stroke={K} strokeWidth="4" /></g>)}</g>);
}
// "I'LL START MONDAY" speech pill with a tail
function Say({ x, y, text, k = 1, size = 56, tail = -1 }) {
  if (k <= 0) return null;
  const w = text.length * size * 0.5 + 70, h = size * 1.6;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}>
    <path d={`M${tail * 40} ${h / 2 - 6} L${tail * 90} ${h / 2 + 60} L${tail * 100} ${h / 2 - 6} Z`} fill="#fff" stroke={K} strokeWidth="6" strokeLinejoin="round" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill="#fff" stroke={K} strokeWidth="6" />
    <rect x={tail * 40 - 2} y={h / 2 - 12} width="64" height="12" fill="#fff" transform={tail < 0 ? 'translate(-60 0)' : ''} />
    <text x="0" y={size * 0.36} textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize={size} fill="#1a1720">{text}</text></g>);
}

/* 1 — Thursday night: Rosa on the sofa, TV glow, crisps in hand; "I'LL START MONDAY" */
function MGCouchHook({ T, t, beats }) {
  const c = b(beats, 3), chew = Math.abs(Math.sin(T * 7)) * (t < c ? 1 : 0);
  return (<g><MGBg kind="roomNight" />
    <MGGlow x={540} y={1250} r={700} col="#7fb4ff" a={0.25 + 0.05 * Math.sin(T * 13)} />
    <Sofa x={540} y={1270} />
    <MGBust x={500} y={830} r={170} who="rosa" mouth={t > c ? 'grin' : chew > 0.5 ? 'o' : 'smile'} brow={t > c ? 'up' : 'flat'} look={t > c ? [0.5, -0.2] : [0, 0.3]} bl={BL(T)} />
    <MGArm x1={780} y1={1500} x2={830} y2={1110} sleeve={ROSA} skin={ROSA_SKIN} w={70} />
    <Crisps x={830} y={1040} s={0.85} rot={-8} />
    <Say x={520} y={440} text="I'LL START MONDAY" k={(t - c) / 0.3} size={58} tail={1} />
    <MGChip x={540} y={240} text="THURSDAY · 11:40 PM" outline size={44} pop={t / 0.25} /></g>);
}

/* 2 — Nia leans in, smirking, eyes rolled up; Rosa small and guilty; "DATA" chip lands on the beat */
function MGNiaSmirk({ T, t, beats }) {
  const c = b(beats, 4);
  return (<g><MGBg kind="wall" c1="#4a3a66" c2="#261c3a" />
    <MGPerson x={840} y={1260} s={2.0} who="rosa" mouth="wave" brow="worried" look={[-1, 0]} bl={BL(T, 1)} />
    <Crisps x={930} y={1130} s={0.32} />
    <MGBust x={380} y={820} r={210} who="nia" mouth="smile" brow="up" browUp={1} look={t < b(beats, 1) ? [0.4, -0.9] : [0, 0.1]} bl={BL(T)} />
    {t > b(beats, 1) && t < c && <MGChip x={540} y={420} text="YOU TOO?" size={56} pop={(t - b(beats, 1)) / 0.25} />}
    {t > c && <g><MGChip x={540} y={420} text="THERE'S DATA" size={56} pop={(t - c) / 0.25} />
</g>}
    <MGChip x={540} y={240} text="NIA · GYM BUDDY" outline size={40} pop={t / 0.25} /></g>);
}

/* 3 — snapback: the MONDAY page under a spotlight; an "EXCUSE" stamp lands… then cracks and falls away */
function MGSnapExcuse({ T, t, beats }) {
  const s1 = b(beats, 1), s3 = b(beats, 3), stamp = BK((t - s1) / 0.25), drop = EO((t - s3) / 0.5);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={720} a={0.55 * SM(0, 0.3, t)} />
    <CalPage x={540} y={850} s={1.15} />
    {t > s1 && <g transform={`translate(540 ${880 + drop * 700}) rotate(${-14 + drop * 40}) scale(${stamp})`} opacity={1 - drop}>
      <rect x="-300" y="-90" width="600" height="180" rx="20" fill="none" stroke={R} strokeWidth="18" />
      <text x="0" y="52" textAnchor="middle" fontFamily={BB} fontSize="160" letterSpacing="10" fill={R}>EXCUSE</text></g>}
    {t > s3 && <MGTitle lines={[['NOT JUST AN', '#fff', 90], ['EXCUSE', A, 130]]} y={290} a={EO((t - s3) / 0.3)} />}
    <MGHead x={lp(1180, 880, EO(t / 0.5))} y={1180} r={95} who="rosa" mouth={t > s3 ? 'o' : 'flat'} brow="up" look={[-1, -0.3]} bl={BL(T)} /></g>);
}

/* 4 — the study: a search bar typing "diet", then a line that spikes at each new week, bigger at month and year */
function MGSearchGraph({ T, t, beats }) {
  const typ = cl((t - b(beats, 2)) / 0.6), q = 'diet'.slice(0, Math.round(typ * 4));
  const draw = cl((t - b(beats, 3)) / Math.max(0.8, b(beats, 6, 4) - b(beats, 3)));
  const x0 = 110, x1 = 970, yb = 1180, N = 120;
  const spike = (i) => { const w = i % 12 === 0 ? 1 : 0, m = i % 48 === 0 ? 1 : 0, y = i === 96 ? 1 : 0; return w * 0.35 + m * 0.3 + y * 0.35; };
  const P = [...Array(N + 1)].map((_, i) => { const base = 0.12 + 0.05 * MG.hsh(i * 7.3); let v = base; for (let d = -2; d <= 2; d++) v += spike(i + d) * Math.max(0, 1 - Math.abs(d) * 0.45); return [lp(x0, x1, i / N), yb - v * 520]; });
  const vis = P.slice(0, Math.max(2, Math.round(draw * N) + 1));
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={240} text="MANAGEMENT SCIENCE · 2014" outline size={40} pop={t / 0.25} />
    <g transform={`translate(540 410) scale(${BK((t - b(beats, 1)) / 0.3)})`}>
      <rect x="-380" y="-60" width="760" height="120" rx="60" fill="#fff" stroke={K} strokeWidth="6" />
      <circle cx="-300" cy="-6" r="22" fill="none" stroke="#7a7f99" strokeWidth="7" /><line x1="-284" y1="10" x2="-266" y2="28" stroke="#7a7f99" strokeWidth="8" strokeLinecap="round" />
      <text x="-230" y="22" fontFamily={OS} fontWeight="500" fontSize="58" fill="#1a1720">{q}{typ < 1 && (T * 2) % 1 < 0.5 ? '|' : ''}</text></g>
    <line x1={x0} y1={yb} x2={x1} y2={yb} stroke="#3a4160" strokeWidth="6" />
    <path d={MG.pts(vis, false)} fill="none" stroke={A} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
    {[[48, 'NEW MONTH', 560], [96, 'NEW YEAR', 690]].map(([i, l, ly]) => draw * N >= i && <MGChip key={i} x={lp(x0, x1, i / N)} y={yb - ly} text={l} size={30} pop={(draw * N - i) / 6} />)}
    {[...Array(10)].map((_, k) => { const i = k * 12; return draw * N >= i && <circle key={k} cx={lp(x0, x1, i / N)} cy={yb + 40} r="9" fill="#cfd6ff" />; })}
    <text x={540} y={yb + 110} textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="32" letterSpacing="4" fill="#cfd6ff" opacity={SM(0, 0.3, draw)}>● = START OF A WEEK</text></g>);
}

/* 5 — the campus gym door: people stream in; landmark chips pop on each beat */
function MGGymVisits({ T, t, beats }) {
  const tags = [[2, 'NEW WEEK', 250, 420], [3, 'NEW SEMESTER', 790, 420], [4, 'BIRTHDAY', 540, 880]];
  const n = 1 + tags.filter(([i]) => t > b(beats, i)).length;
  return (<g><MGBg kind="wall" c1="#e8d9b8" c2="#b9a27c" />
    <rect x="-300" y="1240" width="1680" height="800" fill="#7b6a58" />
    <rect x="300" y="620" width="480" height="640" fill="#2a2030" stroke={K} strokeWidth="10" />
    <rect x="260" y="560" width="560" height="90" rx="12" fill={R} stroke={K} strokeWidth="8" />
    <text x="540" y="628" textAnchor="middle" fontFamily={BB} fontSize="74" letterSpacing="8" fill="#fff">CAMPUS GYM</text>
    {[...Array(9)].map((_, i) => { const st = i * 0.45, k = (t - st) / 2.2; if (i >= n * 3 || k <= 0 || k >= 1) return null;
      const x = lp(-80 + (i % 2) * 1240, 540, EO(k)), y = 1290 + (i % 3) * 30;
      return <MGPerson key={i} x={x} y={y} s={1.5} who={MG.extra(i + 2)} walk={T * 9 + i} look={[x < 540 ? 1 : -1, 0]} bl={BL(T, i)} />; })}
    {tags.map(([i, l, x, y]) => t > b(beats, i) && <g key={l}>{l === 'BIRTHDAY' && <Cake x={x} y={y - 130} s={0.7} T={T} />}
      <MGChip x={x} y={y} text={l} size={42} pop={(t - b(beats, i)) / 0.25} /></g>)}
    <MGChip x={540} y={240} text="UNIVERSITY GYM VISITS" outline size={40} pop={t / 0.25} /></g>);
}

/* 6 — name it: spotlight, title, a calendar page with a sunrise */
function MGNameFresh({ T, t }) {
  const a = SM(0, 0.3, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={680} a={0.55 * a} />
    <g transform={`translate(540 ${lp(1100, 980, EO(t / 0.6))})`}>
      <rect x="-200" y="-230" width="400" height="460" rx="26" fill="#f4efe4" stroke={K} strokeWidth="10" />
      <MGGlow x={0} y={80} r={260} col="#ffd36e" a={0.8} />
      <path d="M-150 80 A150 150 0 0 1 150 80 Z" fill={A} stroke={K} strokeWidth="8" />
      {[...Array(7)].map((_, i) => { const an = Math.PI + (i + 0.5) * Math.PI / 7; return <line key={i} x1={Math.cos(an) * 180} y1={80 + Math.sin(an) * 180} x2={Math.cos(an) * (220 + 10 * Math.sin(T * 4 + i))} y2={80 + Math.sin(an) * (220 + 10 * Math.sin(T * 4 + i))} stroke={A} strokeWidth="10" strokeLinecap="round" />; })}
      <rect x="-200" y="80" width="400" height="12" fill={K} /></g>
    <MGHead x={lp(-120, 180, EO((t - 0.3) / 0.5))} y={1150} r={90} who="rosa" mouth="grin" brow="up" look={[1, -0.4]} bl={BL(T)} />
    <MGTitle lines={[['THE FRESH START', '#fff', 130], ['EFFECT', A, 150]]} y={270} a={EO((t - 0.3) / 0.35)} /></g>);
}

/* 7 — a glowing line on the floor: old Rosa (sofa, crisps) on the left, new Rosa (gym bag) steps over to the right */
function MGOldNew({ T, t, beats }) {
  const c3 = b(beats, 3), lineK = EO((t - b(beats, 1)) / 0.5), step = EO((t - c3) / 0.6);
  return (<g><MGBg kind="wall" c1="#cfe3dc" c2="#94b9b0" />
    <rect x="-300" y="1230" width="1680" height="800" fill="#7a9690" />
    <MGGlow x={540} y={900} r={260} col="#ffd36e" a={0.5 * lineK} />
    <rect x="530" y={1290 - 900 * lineK} width="20" height={900 * lineK} rx="10" fill={A} stroke={K} strokeWidth="5" />
    <g opacity={t > b(beats, 2) ? 1 : 0.35}>
      <MGPerson x={250} y={1300} s={2.0} who="rosa" mouth="flat" brow="flat" look={[0.4, 0.4]} bl={BL(T, 1)} />
      <Crisps x={320} y={1120} s={0.3} />
      <MGChip x={250} y={520} text="OLD YOU" outline col="#fff" size={44} pop={(t - b(beats, 2)) / 0.25} /></g>
    {t > c3 && <g><MGPerson x={lp(560, 820, step)} y={1300} s={2.0} who="rosa" walk={step < 1 ? T * 9 : 0} mouth="grin" brow="up" look={[1, -0.2]} bl={BL(T)} />
      <GymBag x={lp(560, 820, step) + 85} y={1140} s={0.42} />
      <MGChip x={820} y={520} text="NEW YOU" size={48} pop={(t - c3) / 0.25} /></g>}
    <MGChip x={540} y={240} text="A TEMPORAL LANDMARK" outline size={40} pop={t / 0.25} /></g>);
}

/* 8 — landmark cards slide in: birthday, the 1st of the month, a new term; the MONDAY page shrinks to one of many */
function MGLandmarks({ T, t, beats }) {
  const card = (x, y, rot, k, inner, label) => k > 0 && (<g transform={`translate(${x} ${lp(y + 500, y, EO(k))}) rotate(${rot})`} opacity={cl(k * 3)}>
    <rect x="-160" y="-190" width="320" height="380" rx="24" fill="#f4efe4" stroke={K} strokeWidth="8" />
    {inner}<MGChip x={0} y={140} text={label} size={32} /></g>);
  const lm = b(beats, 4);
  return (<g><MGBg kind="navy" />
    {card(280, 640, -6, (t - b(beats, 1)) / 0.4, <Cake x={0} y={-10} s={0.8} T={T} />, 'BIRTHDAY')}
    {card(800, 640, 5, (t - b(beats, 2)) / 0.4, <g><text x="0" y="40" textAnchor="middle" fontFamily={BB} fontSize="200" fill={K}>1ST</text><MGRing cx={0} cy={-20} rx={140} ry={100} p={(t - b(beats, 3)) / 0.4} /></g>, 'NEW MONTH')}
    {card(280, 1110, 4, (t - b(beats, 3)) / 0.4, <g><rect x="-90" y="-120" width="180" height="200" rx="10" fill="#4f9d78" stroke={K} strokeWidth="7" /><rect x="-60" y="-80" width="120" height="30" fill="#f4efe4" /></g>, 'NEW TERM')}
    {card(800, 1110, -5, (t - b(beats, 0)) / 0.4, <text x="0" y="40" textAnchor="middle" fontFamily={BB} fontSize="170" fill={K}>MON</text>, 'MONDAY')}
    {t > lm && [[280, 640], [800, 640], [280, 1110], [800, 1110]].map(([x, y], i) => <MGGlow key={i} x={x} y={y} r={240} col="#ffd36e" a={0.35 * SM(lm, lm + 0.3, t)} />)}
    <MGChip x={540} y={240} text={t > lm ? 'ANY LANDMARK' : 'SKIP THE WAIT'} size={48} pop={t > lm ? (t - lm) / 0.25 : t / 0.25} /></g>);
}

/* 9 — Rosa checks her phone: it's nearly midnight, tomorrow is the 1st; gym bag drops in; Nia's text */
function MGRosaFirst({ T, t, beats }) {
  const c = b(beats, 2), bag = b(beats, 3);
  return (<g><MGBg kind="roomNight" />
    <MGPhone x={720} y={760} rot={5} time="11:58" day="TOMORROW: THE 1ST" from="NIA" msg="gym? 7am. no excuses" k={(t - c) / 0.4} />
    <MGPerson x={250} y={1300} s={2.3} who="rosa" mouth={t > c ? 'grin' : 'flat'} brow={t > c ? 'up' : 'flat'} look={[1, -0.4]} bl={BL(T)} />
    {t > bag && <GymBag x={250} y={lp(700, 1235, EO((t - bag) / 0.35))} s={0.6} />}
    {t > c && <MGChip x={250} y={460} text="NEW MONTH!" size={46} pop={(t - c) / 0.25} />}</g>);
}

/* 10 — Friday morning: Rosa and Nia stride across an amber start line, gym bags on shoulders */
function MGEndLine({ T, t, beats }) {
  const c = b(beats, 2, 1.6), k = EO(t / 1.6);
  return (<g><MGBg kind="street" />
    <MGGlow x={540} y={700} r={600} col="#ffb46e" a={0.35} />
    <rect x="-300" y="1230" width="1680" height="26" fill={A} stroke={K} strokeWidth="5" />
    <text x="560" y="1310" textAnchor="middle" fontFamily={BB} fontSize="54" letterSpacing="14" fill={A} opacity="0.9">START</text>
    <MGPerson x={lp(260, 360, k)} y={1340} s={2.2} who="nia" walk={T * 8} mouth="grin" brow="up" look={[1, 0]} bl={BL(T, 0.7)} />
    <GymBag x={lp(260, 360, k) - 95} y={1215} s={0.36} col={R} />
    <MGPerson x={lp(640, 760, k)} y={1300} s={2.2} who="rosa" walk={T * 8 + 1} mouth="grin" brow="up" look={[-0.6, 0]} bl={BL(T)} />
    <GymBag x={lp(640, 760, k) + 95} y={1175} s={0.36} />
    <MGChip x={540} y={240} text="FRIDAY · 7:00 AM" outline size={44} pop={t / 0.25} />
    {t > c && <MGChip x={540} y={420} text="DRAW YOUR OWN LINE" size={56} pop={(t - c) / 0.25} />}</g>);
}

Object.assign(window, { MGCouchHook, MGNiaSmirk, MGSnapExcuse, MGSearchGraph, MGGymVisits, MGNameFresh, MGOldNew, MGLandmarks, MGRosaFirst, MGEndLine });
})();
