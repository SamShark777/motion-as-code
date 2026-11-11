// art.jsx — "Why You Think It Won't Happen to You" (Rosa ep. 6, with Nia; ted-MG motion graphics).
// Optimism bias: Weinstein 1980 (JPSP) — students rated their own chances of good events above their classmates' and of bad
// events below. No numbers on screen. Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces stay out of
// y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GREEN = '#4f9d78', PURP = '#a46fd1';

// kerb + road with the double yellow line (y = kerb top)
function Street({ y = 1180 }) {
  return (<g><rect x="-60" y={y} width="1200" height="60" fill="#c9c3b6" stroke={K} strokeWidth="6" /><rect x="-60" y={y + 60} width="1200" height="800" fill="#4a4e5a" />
    <rect x="-60" y={y + 66} width="1200" height="12" fill={A} /><rect x="-60" y={y + 86} width="1200" height="12" fill={A} /></g>);
}
function Car({ x, y, s = 1, col = PURP }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-230 0 L-230 -80 Q-220 -110 -170 -115 L-120 -190 Q-100 -210 -60 -210 L90 -210 Q130 -210 150 -180 L190 -115 Q240 -110 240 -70 L240 0 Z" fill={col} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <path d="M-105 -120 L-70 -180 L0 -180 L0 -120 Z M20 -120 L20 -180 L95 -180 L140 -120 Z" fill="#cfe7f2" stroke={K} strokeWidth="6" strokeLinejoin="round" />
    {[-140, 150].map((wx) => <g key={wx}><circle cx={wx} cy="0" r="52" fill="#25212b" /><circle cx={wx} cy="0" r="22" fill="#9aa3b5" /></g>)}
    <rect x="210" y="-90" width="30" height="20" rx="6" fill="#ffe08a" stroke={K} strokeWidth="4" /></g>);
}
function Sign({ x, y, text = 'NO PARKING', s = 1, wob = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${wob}) scale(${s})`}><rect x="-10" y="0" width="20" height="420" fill="#9aa3b5" stroke={K} strokeWidth="5" />
    <rect x="-110" y="-150" width="220" height="160" rx="16" fill="#fff" stroke={K} strokeWidth="7" /><circle cx="0" cy="-70" r="60" fill="none" stroke={R} strokeWidth="14" />
    <line x1="-42" y1="-112" x2="42" y2="-28" stroke={R} strokeWidth="14" /><text y="-62" textAnchor="middle" fontFamily={BB} fontSize="62" fill="#2e4b8f" opacity="0.8">P</text>
    <text y="56" textAnchor="middle" fontFamily={BB} fontSize="34" fill="#fff" stroke={K} strokeWidth="1">{text}</text></g>);
}
function Ticket({ x, y, k = 1, rot = -8, s = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k) * s})`}><rect x="-120" y="-160" width="240" height="320" rx="10" fill="#fff6c8" stroke={K} strokeWidth="7" />
    <rect x="-120" y="-160" width="240" height="70" rx="10" fill={R} stroke={K} strokeWidth="7" /><text y="-110" textAnchor="middle" fontFamily={BB} fontSize="54" fill="#fff">FINE</text>
    {[0, 1, 2, 3].map((i) => <rect key={i} x="-90" y={-60 + i * 50} width={i === 3 ? 100 : 180} height="16" rx="8" fill="#c9bfa0" />)}</g>);
}

/* 1 — Rosa hops out of her purple car on the double yellow line, keys spinning, NO PARKING sign right beside her */
function MGRosaParking({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="wall" c1="#cfe8f5" c2="#f4dcc0" />
    {[[120, 520, 260], [430, 470, 300], [760, 540, 240], [1000, 500, 280]].map(([x, y, h], i) => <rect key={i} x={x - 110} y={y} width="220" height={1180 - y} fill={['#e9b98a', '#d9a27a', '#e7c79f', '#cf9670'][i]} stroke={K} strokeWidth="6" />)}
    {[[120, 600], [430, 560], [760, 620], [1000, 580], [120, 760], [430, 720], [760, 780], [1000, 740]].map(([x, y], i) => <rect key={i} x={x - 50} y={y} width="100" height="90" rx="8" fill="#fff4dc" stroke={K} strokeWidth="5" />)}
    <Street y={1180} />
    <Sign x={880} y={830} s={1.1} wob={Math.sin(T * 2) * 1.5} />
    <Car x={330} y={1250} s={1.05} />
    <MGPerson x={640} y={1300} s={2.4} who="rosa" mouth="grin" brow="up" look={[0.3, -0.5]} bl={BL(T)} />
    <g transform={`translate(${700} ${830 + Math.sin(T * 5) * 10}) rotate(${T * 300})`}><circle r="16" fill="none" stroke="#c9c3b6" strokeWidth="7" /><rect x="10" y="-6" width="40" height="12" rx="4" fill="#c9c3b6" stroke={K} strokeWidth="3" /></g>
    <MGBubble x={500} y={330} text="5 MINUTES.|NO TICKET." size={60} k={(t - 0.3) / 0.3} />
    {t > c3 && <MGRing cx={880} cy={760} rx={150} ry={130} p={(t - c3) / 0.4} />}</g>);
}

/* 2 — you: a news screen of bad luck (TICKET, FLU, BROKEN PHONE) aimed at "OTHER PEOPLE"; a force field around YOU */
function MGNotMe({ T, t, beats }) {
  const c2 = b(beats, 2, 1.3), sh = SM(c2 - 0.2, c2 + 0.2, t);
  const bad = [['TICKET', 230, 330], ['FLU', 540, 270], ['CRACKED PHONE', 850, 340], ['LATE FEE', 300, 560], ['LOST KEYS', 800, 580]];
  return (<g><MGBg kind="room" />
    {bad.map(([w, x, y], i) => { const k = (t - 0.1 - i * 0.12) / 0.3, dy = lp(0, 260, SM(c2, c2 + 1.2, t)) * (i % 2 ? 1 : 0.6); const dx = (x < 540 ? -1 : x > 540 ? 1 : 0) * dy * 0.8;
      return k > 0 && <g key={w} transform={`translate(${dx} ${-dy * 0.3})`}><MGChip x={x} y={y} text={w} col={R} txt="#fff" size={48} pop={k} /></g>; })}
    <circle cx="540" cy="930" r={330} fill="#8fd3ff" opacity={0.18 * sh} stroke="#8fd3ff" strokeWidth="10" strokeOpacity={0.7 * sh} />
    <MGPerson x={540} y={1300} s={2.8} who="rosa" mouth="smile" brow="up" look={[0, -1]} bl={BL(T)} />
    {t > c2 && <MGChip x={540} y={1180} text="NOT ME" col={A} size={56} pop={(t - c2) / 0.25} />}</g>);
}

/* 3 — snapback: a crowd of heads, every one with the same rosy thought bubble NOT ME — it's normal */
function MGOptimism({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.45 * SM(0, 0.3, t)} />
    <MGHeadGrid T={T} on={lp(0, 20, SM(c2 - 0.2, c2 + 0.8, t))} y0={480} dy={220} />
    {t > c2 && <MGChip x={540} y={240} text="MOST BRAINS DO THIS" col={A} size={54} pop={(t - c2) / 0.25} />}</g>);
}

/* 4 — the study: a questionnaire YOUR FUTURE with scales; journal chip */
function MGWeinsteinStudy({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6);
  const rows = ['OWN A HOME', 'GET A GREAT JOB', 'GET SERIOUSLY ILL', 'GET FIRED'];
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="J. PERS. SOC. PSYCH · 1980" outline size={40} pop={t / 0.25} />
    <g transform="translate(540 760)"><rect x="-420" y="-420" width="840" height="840" rx="26" fill="#f4efe4" stroke={K} strokeWidth="9" />
      <text y="-330" textAnchor="middle" fontFamily={BB} fontSize="80" fill="#1a1720">YOUR FUTURE</text>
      <text y="-270" textAnchor="middle" fontFamily={OS} fontWeight="500" fontSize="32" fill="#5a5560">vs. your classmates</text>
      {rows.map((r, i) => { const y = -170 + i * 150, k = SM(0.3 + i * 0.25, 0.6 + i * 0.25, t), good = i < 2;
        return (<g key={r} opacity={k}><text x="-370" y={y} fontFamily={BB} fontSize="50" fill="#1a1720">{r}</text>
          <line x1="-370" y1={y + 50} x2="370" y2={y + 50} stroke="#9aa3b5" strokeWidth="8" strokeLinecap="round" />
          {[...Array(7)].map((_, j) => <circle key={j} cx={-370 + j * 123} cy={y + 50} r="12" fill="#9aa3b5" />)}
          {t > c3 && <circle cx={good ? 300 : -300} cy={y + 50} r="26" fill={good ? GREEN : R} stroke={K} strokeWidth="5" />}</g>); })}</g>
    </g>);
}

/* 5 — split: a seesaw, GOOD THINGS → ME side up; BAD THINGS → OTHERS side */
function MGAboveBelow({ T, t, beats }) {
  const c4 = b(beats, 4, 1.8);
  return (<g><MGBg kind="wall" c1="#d9e3ee" c2="#9fb0c4" />
    <g transform="translate(540 520)"><rect x="-470" y="-170" width="440" height="340" rx="24" fill="#fff" stroke={K} strokeWidth="8" /><rect x="30" y="-170" width="440" height="340" rx="24" fill="#fff" stroke={K} strokeWidth="8" />
      <text x="-250" y="-90" textAnchor="middle" fontFamily={BB} fontSize="60" fill={GREEN}>GOOD THINGS</text>
      <text x="250" y="-90" textAnchor="middle" fontFamily={BB} fontSize="60" fill={R}>BAD THINGS</text>
      <g transform={`translate(-250 0) scale(${BK((t - 0.3) / 0.3)})`}><text y="50" textAnchor="middle" fontFamily={BB} fontSize="110" fill="#1a1720">ME: MORE</text></g>
      {t > c4 && <g transform={`translate(250 0) scale(${BK((t - c4) / 0.3)})`}><text y="50" textAnchor="middle" fontFamily={BB} fontSize="110" fill="#1a1720">ME: LESS</text></g>}</g>
    <MGPerson x={330} y={1300} s={2.4} who="rosa" mouth="grin" brow="up" look={[1, -0.3]} bl={BL(T)} />
    <MGPerson x={760} y={1300} s={2.4} who="nia" mouth={t > c4 ? 'o' : 'flat'} brow="angry" look={[-1, -0.3]} bl={BL(T, 1)} /></g>);
}

/* 6 — turn: a bell curve where every little head squeezes onto the right side; the AVERAGE line in the middle */
function MGAverage({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0), go = EO((t - 0.2) / 1.2);
  return (<g><MGBg kind="navy" />
    <path d="M90 1100 C330 1100 380 520 540 520 C700 520 750 1100 990 1100 Z" fill="#3a4160" stroke="#fff" strokeWidth="6" />
    <line x1="540" y1="460" x2="540" y2="1120" stroke={A} strokeWidth="8" strokeDasharray="20 16" />
    <text x="540" y="430" textAnchor="middle" fontFamily={BB} fontSize="60" fill={A}>AVERAGE</text>
    {[...Array(12)].map((_, i) => { const x0 = 140 + i * 72, x1 = 640 + (i % 6) * 66, y1 = 880 + Math.floor(i / 6) * 120;
      return <MGHead key={i} x={lp(x0, x1, go)} y={lp(1040, y1, go) + Math.sin(T * 6 + i) * 4} r={42} who={MG.extra(i)} mouth="smile" brow="up" look={[1, 0]} bl={BL(T, i * 0.3)} />; })}
    {t > c2 && <MGChip x={540} y={1220} text="EVERYONE ABOVE AVERAGE?" col={R} txt="#fff" size={44} pop={(t - c2) / 0.25} />}</g>);
}

/* 7 — name it: OPTIMISM BIAS title with rose-tinted glasses */
function MGNameOptimism({ T, t }) {
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGTitle lines={[['OPTIMISM', A, 170], ['BIAS', '#fff', 170]]} y={250} a={EO((t - 0.15) / 0.35)} />
    <g transform={`translate(540 ${880 + Math.sin(T * 2) * 10}) scale(${BK((t - 0.3) / 0.4)})`}>
      <circle cx="-150" cy="0" r="120" fill="#f39aa8" opacity="0.75" stroke={K} strokeWidth="12" /><circle cx="150" cy="0" r="120" fill="#f39aa8" opacity="0.75" stroke={K} strokeWidth="12" />
      <path d="M-30 -10 Q0 -40 30 -10" fill="none" stroke={K} strokeWidth="12" /><line x1="-270" y1="-20" x2="-380" y2="-60" stroke={K} strokeWidth="12" strokeLinecap="round" /><line x1="270" y1="-20" x2="380" y2="-60" stroke={K} strokeWidth="12" strokeLinecap="round" />
      <path d="M-200 -50 Q-170 -80 -130 -70" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.7" /></g></g>);
}

/* 8 — self-proof: rain starts; Rosa (no umbrella) glances at the umbrella left by the door */
function MGUmbrella({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6), rain = SM(0.2, 0.8, t);
  return (<g><MGBg kind="wall" c1="#b9c4d6" c2="#7d8aa3" />
    {[...Array(40)].map((_, i) => { const x = hsh(i) * 1100, sp = 900 + hsh(i + 9) * 500, y = ((T * sp + hsh(i + 3) * 2000) % 1500) - 100; return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 50} stroke="#e6f2ff" strokeWidth="5" strokeLinecap="round" opacity={0.7 * rain} />; })}
    <g transform="translate(860 700)"><rect x="-150" y="-350" width="300" height="700" rx="12" fill="#a8744c" stroke={K} strokeWidth="8" /><circle cx="100" cy="0" r="14" fill={A} stroke={K} strokeWidth="4" />
      <g transform="translate(-230 160) rotate(-10)"><line x1="0" y1="-200" x2="0" y2="160" stroke={K} strokeWidth="10" /><path d="M-60 -200 Q0 -260 60 -200 L30 120 L-30 120 Z" fill={R} stroke={K} strokeWidth="7" /><path d="M0 160 Q0 200 -30 196" fill="none" stroke={K} strokeWidth="10" strokeLinecap="round" /></g></g>
    <MGPerson x={360} y={1300} s={2.6} who="rosa" mouth="wave" brow="worried" look={[1, -0.3]} bl={BL(T)} />
    <MGRing cx={630} cy={760} rx={130} ry={260} p={(t - c3) / 0.4} rot={-6} /></g>);
}

/* 9 — end: back at the car, a ticket under the wiper; Nia laughs, Rosa shrugs; question + send chips */
function MGEndTicket({ T, t, beats }) {
  const c1 = b(beats, 1, 0.8), c3 = b(beats, 3, 2.0), c5 = b(beats, 5, 3.0);
  return (<g><MGBg kind="wall" c1="#cfe8f5" c2="#f4dcc0" />
    <Street y={1180} />
    <Car x={540} y={1250} s={1.25} />
    <Ticket x={420} y={980} s={0.55} k={(t - 0.1) / 0.3} rot={-14} />
    <MGPerson x={150} y={1300} s={2.3} who="rosa" mouth={t > c1 ? 'smile' : 'frown'} brow={t > c1 ? 'up' : 'worried'} look={[1, -0.2]} bl={BL(T)} />
    <MGPerson x={930} y={1300} s={2.3} who="nia" mouth="grin" brow="up" look={[-1, -0.2]} bl={BL(T, 1)} />
    {t > c1 && <MGChip x={540} y={560} text="HOPE: GOOD · SIGNS: READ THEM" col="#fff" size={40} pop={(t - c1) / 0.25} />}
    {t > c3 && <MGChip x={540} y={240} text="'I'LL BE FINE' TYPE?" col={A} size={50} pop={(t - c3) / 0.25} />}
    {t > c5 && <MGChip x={540} y={350} text="SEND IT TO THAT FRIEND" outline size={40} pop={(t - c5) / 0.25} />}</g>);
}

Object.assign(window, { MGRosaParking, MGNotMe, MGOptimism, MGWeinsteinStudy, MGAboveBelow, MGAverage, MGNameOptimism, MGUmbrella, MGEndTicket });
})();
