// art.jsx — "5 Signs You're Playing It Too Safe" (Mae ep. 12, with The Doubt; retro modern illustration; signs-list).
// Regret over time: Gilovich & Medvec 1995 (Psychological Review) — short term people regret actions more, long term
// they regret inactions more. The chart is schematic (no numbers).
// Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540; keep faces/numbers out of 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif", OSW = "'Oswald', sans-serif";

// numbered sign card at the top (same layout as the six-signs episode)
function SignCard({ n, label, t, col = P.yel }) {
  const k = EO(t / 0.3);
  return (<g opacity={k} transform={`translate(0 ${lp(-40, 0, k)})`}>
    <circle cx={190} cy={250} r={96} fill={P.blk} transform="translate(10 10)" /><circle cx={190} cy={250} r={96} fill={col} {...ink(8)} />
    <text x={190} y={292} textAnchor="middle" fontFamily={BEB} fontSize="130" fill={P.blk}>{n}</text>
    <text x={320} y={235} fontFamily={OSW} fontWeight="700" fontSize="46" fill={P.cream}>SIGN {n} OF 5</text>
    <text x={320} y={300} fontFamily={BEB} fontSize="62" letterSpacing="2" fill={col}>{label}</text></g>);
}
// a door with a sign; open 0..1
function Door({ x, y, s = 1, sign = 'AUDITIONS', open = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-190" y="-440" width="380" height="880" fill={P.blk} transform="translate(12 12)" />
    <rect x="-190" y="-440" width="380" height="880" fill={P.yel} {...ink(8)} />
    <path d={`M-170 -420 L${lp(170, 60, open)} ${lp(-420, -380, open)} L${lp(170, 60, open)} ${lp(420, 380, open)} L-170 420 Z`} fill={P.blue} {...ink(7)} />
    <circle cx={lp(120, 30, open)} cy="20" r="18" fill={P.yel} {...ink(5)} />
    <rect x="-150" y="-300" width="300" height="110" fill={P.cream} {...ink(6)} />
    <text x="0" y="-228" textAnchor="middle" fontFamily={BEB} fontSize="52" letterSpacing="2" fill={P.red}>{sign}</text></g>);
}
// a phone with an unsent draft
function Phone({ x, y, s = 1, T = 0, typed = 1 }) {
  const msg = 'I WANT TO TRY';
  return (<g transform={`translate(${x} ${y}) rotate(-6) scale(${s})`}>
    <rect x="-200" y="-380" width="400" height="760" rx="40" fill={P.blk} transform="translate(12 12)" />
    <rect x="-200" y="-380" width="400" height="760" rx="40" fill={P.blk} {...ink(6)} />
    <rect x="-172" y="-340" width="344" height="660" rx="20" fill={P.cream} />
    <rect x="-150" y="80" width="300" height="110" rx="20" fill={P.blue} />
    <text x="-130" y="150" fontFamily={OSW} fontWeight="700" fontSize="34" fill={P.cream}>{msg.slice(0, Math.max(0, Math.round(msg.length * cl(typed))))}{osc(T, 0.8) > 0 ? '|' : ''}</text>
    <rect x="-150" y="220" width="300" height="70" rx="35" fill="#bdb3a3" {...ink(5)} />
    <text x="0" y="268" textAnchor="middle" fontFamily={BEB} fontSize="48" letterSpacing="4" fill={P.cream}>SEND</text></g>);
}
// regret-over-time chart on grid paper; p = how far the lines are drawn (0..1)
function RegretChart({ p, T, hot = false }) {
  const x0 = 170, x1 = 910, y0 = 1260, y1 = 640;
  const did = (u) => y0 - (y0 - y1) * (0.85 - 0.6 * u), didnt = (u) => y0 - (y0 - y1) * (0.25 + 0.65 * u);
  const path = (f) => 'M' + [...Array(31)].map((_, i) => { const u = i / 30 * cl(p); return `${lp(x0, x1, u).toFixed(1)} ${f(u).toFixed(1)}`; }).join(' L');
  return (<g><rect x="110" y="520" width="860" height="860" fill={P.blk} transform="translate(14 14)" /><RMGrid x={110} y={520} w={860} h={860} />
    <path d={`M${x0} ${y1 - 40} L${x0} ${y0} L${x1 + 20} ${y0}`} fill="none" {...ink(8)} />
    <text x={x0} y={y0 + 70} fontFamily={OSW} fontWeight="700" fontSize="38" fill={P.blk}>SHORT TERM</text>
    <text x={x1} y={y0 + 70} textAnchor="end" fontFamily={OSW} fontWeight="700" fontSize="38" fill={P.blk}>LONG TERM</text>
    <path d={path(did)} fill="none" stroke={P.red} strokeWidth="16" strokeLinecap="round" />
    <path d={path(didnt)} fill="none" stroke={P.blue} strokeWidth="16" strokeLinecap="round" />
    <RMChip x={330} y={did(0) - 70} text="WHAT WE DID" col={P.red} size={34} pop={1} />
    {p > 0.75 && <RMChip x={760} y={didnt(1) - 70} text="WHAT WE DIDN'T" col={hot ? P.yel : P.cream} size={34} pop={(p - 0.75) / 0.2} />}
  </g>);
}

/* 1 — hook: Mae walks past the audition door; The Doubt rides on her shoulder */
function RMAudition({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5);
  return (<g><RMBg kind="red" />
    <Door x={780} y={820} s={0.8} sign="AUDITIONS" open={0.15 + 0.05 * osc(T, 2)} />
    <RMMae x={lp(470, 400, SM(0, 2, t))} y={980} s={0.58} mouth="flat" brow="sad" lid={0.45} look={[-0.6, 0]} />
    <RMDoubt x={190} y={620} s={0.38} T={T} mood="sly" look={[0.8, 0.3]} />
    {t > c1 && <RMChip x={780} y={420} text="TODAY · 6 PM" col={P.cream} pop={(t - c1) / 0.25} size={44} />}
    <RMChip x={360} y={200} text="OPEN AUDITION" col={P.yel} pop={t / 0.25} size={52} /></g>);
}
/* 2 — to the viewer: "5 SIGNS" title; The Doubt grins */
function RMFiveSigns({ T, t, beats }) {
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['5 SIGNS', P.yel, 210], ['YOU PLAY IT SAFE', P.cream, 110]]} y={260} a={EO(t / 0.35)} />
    <RMDoubt x={540} y={960} s={0.85} T={T} mood="sly" look={[0, 0.4]} blink={Math.sin(T * 2.3) > 0.97 ? 1 : 0} /></g>);
}
/* 3 — snapback: a scale; MISSED CHANCES outweighs MISTAKES */
function RMTwist({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  const tilt = lp(-0.12, 0.26, SM(c2 - 0.3, c2 + 0.4, t));
  return (<g><RMBg kind="redDark" />
    <RMScale tilt={tilt}
      left={(x, y) => <g><path d={`M${x - 70} ${y - 10} L${x + 70} ${y - 10} L${x + 50} ${y - 90} L${x - 50} ${y - 90} Z`} fill={P.cream} {...ink(6)} /><RMChip x={Math.max(x, 230)} y={y - 180} text="MISTAKES" col={P.cream} size={40} pop={1} /></g>}
      right={(x, y) => <g><RMSpiky x={x} y={y - 120} s={1} /><RMChip x={Math.min(x, 800)} y={y - 290} text="MISSED CHANCES" col={P.yel} size={40} pop={SM(0, 0.3, t)} /></g>} />
    <RMTitle lines={[['WHAT YOU\'LL', P.cream, 110], ['REGRET', t > c2 ? P.yel : P.cream, 170]]} y={230} a={EO(t / 0.3)} /></g>);
}
/* 4 — sign 1: calendar pages flip, each stamped NEXT YEAR */
function RMSign1({ T, t, beats }) {
  const n = Math.max(0, Math.min(3, Math.floor(t / 0.45) + 1));
  return (<g><RMBg kind="red" /><SignCard n={1} label="'MAYBE NEXT YEAR'" t={t} />
    {[...Array(n)].map((_, i) => (<g key={i} transform={`translate(${540 + (i - 1) * 40} ${860 + i * 30}) rotate(${(i - 1) * 6})`}>
      <rect x="-260" y="-300" width="520" height="560" fill={P.blk} transform="translate(12 12)" /><rect x="-260" y="-300" width="520" height="560" fill={P.cream} {...ink(7)} />
      <rect x="-260" y="-300" width="520" height="120" fill={P.blue} {...ink(7)} />
      <text x="0" y="-215" textAnchor="middle" fontFamily={BEB} fontSize="72" letterSpacing="6" fill={P.cream}>JANUARY</text>
      <RMGrid x={-220} y={-150} w={440} h={340} step={63} />
      <g transform="rotate(-14)"><rect x="-200" y="-60" width="400" height="110" fill="none" stroke={P.red} strokeWidth="10" />
        <text x="0" y="20" textAnchor="middle" fontFamily={BEB} fontSize="80" letterSpacing="4" fill={P.red}>NEXT YEAR</text></g></g>))}
    <RMMae x={880} y={1250} s={0.3} mouth="smile" brow="up" lid={0.3} look={[-0.6, -0.3]} /></g>);
}
/* 5 — sign 2: the message typed, never sent */
function RMSign2({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.2);
  return (<g><RMBg kind="blue" /><SignCard n={2} label="THE UNSENT TEXT" t={t} />
    <Phone x={540} y={860} s={1} T={T} typed={t / 0.9} />
    {t > c3 && <g transform="translate(700 1070) rotate(-14)" opacity={SM(c3, c3 + 0.2, t)}><rect x="-170" y="-55" width="340" height="110" fill="none" stroke={P.red} strokeWidth="10" />
      <text x="0" y="24" textAnchor="middle" fontFamily={BEB} fontSize="78" letterSpacing="4" fill={P.red}>DRAFTS</text></g>}</g>);
}
/* 6 — sign 3: Mae slipping out before anyone can say no */
function RMSign3({ T, t, beats }) {
  const out = SM(0.2, 1.6, t);
  return (<g><RMBg kind="redDark" /><SignCard n={3} label="LEAVE BEFORE THE NO" t={t} />
    <Door x={760} y={900} s={0.8} sign="EXIT" open={0.9} />
    <RMMae x={lp(420, 640, out)} y={960} s={0.5} mouth="flat" brow="sad" lid={0.35} look={[0.8, 0]} />
    <RMSpeech x={300} y={560} text="NO?" k={(t - 0.5) / 0.3} size={110} col={P.cream} /></g>);
}
/* 7 — sign 4: lying awake replaying the moment she stayed quiet */
function RMSign4({ T, t, beats }) {
  return (<g><RMBg kind="dark" />
    <RMLoopRings T={T} text="I SHOULD HAVE SAID IT" cx={540} cy={940} />
    <rect x="80" y="130" width="920" height="230" fill={P.blk} opacity="0.92" /><SignCard n={4} label="THE NIGHT REPLAY" t={t} />
    <RMBulb x={830} y={460} T={T} on />
    <g transform="translate(540 980) rotate(-90)"><RMMae x={0} y={0} s={0.45} body={false} mouth="frown" brow="sad" lid={0.5} look={[0, -0.5]} /></g>
    <RMGrid x={170} y={1120} w={740} h={180} /></g>);
}
/* 8 — sign 5: The Doubt shouts WHAT IF? over a tiny Mae */
function RMSign5({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.9);
  return (<g><RMBg kind="red" /><SignCard n={5} label="'WHAT IF?' WINS" t={t} />
    <RMDoubt x={600} y={880} s={lp(0.6, 0.9, SM(0, c2, t))} T={T} mood="shocked" look={[-0.5, 0.4]} />
    <RMSpeech x={560} y={470} text="WHAT IF?" k={(t - 0.2) / 0.3} size={100} />
    <RMMae x={230} y={1180} s={0.25} mouth="frown" brow="sad" lid={0.3} look={[0.8, -0.6]} /></g>);
}
/* 9 — study: the regret chart draws its short-term half */
function RMRegretStudy({ T, t, beats }) {
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={220} text="GILOVICH & MEDVEC · 1995" col={P.cream} pop={t / 0.25} size={44} />
    <RegretChart p={lp(0.05, 0.45, SM(0, 1.6, t))} T={T} /></g>);
}
/* 10 — long term: the lines cross; DIDN'T wins */
function RMLongTerm({ T, t, beats }) {
  const c2 = bt(beats, 2, 0.9);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={220} text="LOOKING BACK" col={P.yel} pop={t / 0.25} size={48} />
    <RegretChart p={lp(0.45, 1, SM(0, c2 + 0.2, t))} T={T} hot={t > c2} /></g>);
}
/* 11 — payoff: Mae signs up; The Doubt shrinks to a pea */
function RMBooksIt({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  const sh = SM(c2 - 0.1, c2 + 0.5, t);
  return (<g><RMBg kind="red" />
    <g transform="translate(760 760) rotate(5)"><rect x="-200" y="-260" width="400" height="520" fill={P.blk} transform="translate(12 12)" /><RMGrid x={-200} y={-260} w={400} h={520} />
      <text x="0" y="-190" textAnchor="middle" fontFamily={BEB} fontSize="60" letterSpacing="3" fill={P.red}>SIGN-UP</text>
      <text x="-160" y={-90} fontFamily={BEB} fontSize="64" fill={P.blue} opacity={SM(0.2, 0.6, t)}>MAE ✓</text></g>
    <RMMae x={360} y={960} s={0.55} mouth="smile" brow="up" lid={0.15} look={[0.6, -0.2]} />
    <RMDoubt x={lp(840, 900, sh)} y={lp(1180, 1280, sh)} s={lp(0.32, 0.06, sh)} T={T} mood="worried" look={[-0.6, -0.4]} />
    <RMChip x={540} y={200} text="NEXT AUDITION" col={P.yel} pop={t / 0.25} size={50} /></g>);
}
/* 12 — end: five ticked boxes + the line */
function RMEndFive({ T, t, beats }) {
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['MISSED CHANCES', P.cream, 120], ['STAY', P.yel, 200]]} y={220} a={EO(t / 0.3)} />
    {[0, 1, 2, 3, 4].map((i) => { const k = (t - 0.4 - i * 0.22) / 0.25; const y = 720 + i * 120;
      return (<g key={i}><rect x="250" y={y - 40} width="80" height="80" fill={P.cream} {...ink(6)} />
        {k > 0 && <path d={`M262 ${y} L285 ${y + 25} L320 ${y - 30}`} fill="none" stroke={P.red} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity={cl(k)} />}
        <text x="360" y={y + 22} fontFamily={BEB} fontSize="64" letterSpacing="3" fill={P.cream}>{['NEXT YEAR', 'UNSENT TEXT', 'LEFT EARLY', 'NIGHT REPLAY', 'WHAT IF?'][i]}</text></g>); })}
    <RMMae x={880} y={1300} s={0.26} mouth="smile" brow="up" lid={0.2} look={[-0.6, -0.5]} /></g>);
}

Object.assign(window, { RMAudition, RMFiveSigns, RMTwist, RMSign1, RMSign2, RMSign3, RMSign4, RMSign5, RMRegretStudy, RMLongTerm, RMBooksIt, RMEndFive });
})();
