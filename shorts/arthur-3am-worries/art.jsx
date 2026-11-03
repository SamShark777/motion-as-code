// art.jsx — "Most 3 AM Worries Never Come True" (Arthur ep. 6 with The Doubt, retro modern illustration).
// Worry's deceit: LaFreniere & Newman 2020 (Behavior Therapy) — ~91% of worry predictions did not come true.
// Full 1080×1920 frames with retro-kit.jsx; captions sit at y ≈ 1540 (band 1420–1660) unless a line sets capY.
// Pure functions of T, t, dur, beats. t can be negative before a scene starts — everything is clamped.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const FONT = "'Oswald', sans-serif", BEB = "'Bebas Neue', sans-serif";
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });

/* Arthur lying in bed on a grid pillow, blanket in front (shared by the hook and the end) */
function Bed({ T, asleep = false }) {
  return (<g><RMGrid x={80} y={860} w={920} h={520} />
    <RMArthur x={470} y={1140} s={0.72} rot={-1.45} body={false} brow={asleep ? 'flat' : 'sad'} lid={asleep ? 1 : 0} wide={!asleep}
      look={[0.4, -1]} stress={!asleep} mouth={asleep ? 'smile' : 'flat'} />
    <path d="M-40 1300 L1120 1260 L1120 2000 L-40 2000 Z" fill={P.blue} />
    {[...Array(6)].map((_, k) => <path key={k} d={`M0 ${1330 + k * 60} Q540 ${1290 + k * 60} 1100 ${1310 + k * 60}`} fill="none" stroke={P.blk} strokeOpacity="0.35" strokeWidth="3" />)}</g>);
}
/* bedside digital clock */
function Clock({ x, y, text = '3:00', s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-150 + 12} y={-80 + 12} width={300} height={160} fill={P.blk} />
    <rect x={-150} y={-80} width={300} height={160} rx={14} fill={P.blk} stroke={P.cream} strokeWidth="6" />
    <text y={38} textAnchor="middle" fontFamily={BEB} fontSize="120" letterSpacing="6" fill={P.red} style={{ filter: 'drop-shadow(0 0 10px #D9442E)' }}>{text}</text></g>);
}
/* envelope icon */
function Envelope({ x, y, s = 1, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}><rect x={-130 + 10} y={-85 + 10} width={260} height={170} fill={P.blk} />
    <rect x={-130} y={-85} width={260} height={170} fill={P.cream} {...ink(7)} /><path d="M-130 -85 L0 20 L130 -85" fill="none" {...ink(7)} />
    <circle cx={110} cy={-80} r={34} fill={P.red} {...ink(5)} /><text x={110} y={-66} textAnchor="middle" fontFamily={BEB} fontSize="44" fill={P.cream}>!</text></g>);
}
/* meeting calendar card */
function MeetCard({ x, y, s = 1, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}><rect x={-120 + 10} y={-110 + 10} width={240} height={220} fill={P.blk} />
    <rect x={-120} y={-110} width={240} height={220} fill={P.cream} {...ink(7)} /><rect x={-120} y={-110} width={240} height={64} fill={P.red} {...ink(7)} />
    <text y={-62} textAnchor="middle" fontFamily={BEB} fontSize="48" letterSpacing="4" fill={P.cream}>MEETING</text>
    <text y={70} textAnchor="middle" fontFamily={BEB} fontSize="110" fill={P.blk}>9:00</text></g>);
}
/* little car with a "clunk" mark */
function Car({ x, y, s = 1, T = 0 }) {
  const j = Math.sin(T * 40) * 3;
  return (<g transform={`translate(${x} ${y + j}) scale(${s})`}>
    <path d="M-170 30 L-150 -30 L-80 -40 L-40 -100 L80 -100 L130 -40 L170 -30 L180 40 L-170 40 Z" fill={P.yel} {...ink(7)} />
    <path d="M-25 -88 L70 -88 L105 -42 L-60 -42 Z" fill={P.cream} {...ink(5)} />
    {[-100, 110].map((wx) => <g key={wx}><circle cx={wx} cy={45} r={42} fill={P.blk} /><circle cx={wx} cy={45} r={16} fill={P.cream} /></g>)}
    {[0, 1, 2].map((k) => <path key={k} d={`M${200 + k * 22} ${-70 + k * 30} l40 -20`} {...ink(8)} />)}</g>);
}
/* a worry note: cream slip with "WHAT IF…" scrawl; stamp: 0 none, 1 = red X */
function Note({ x, y, w = 220, h = 70, rot = 0, k = 1, x1 = 0, col = P.cream, text = 'WHAT IF…', fs = 40 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)}) rotate(${rot})`}>
    <rect x={-w / 2 + 6} y={-h / 2 + 6} width={w} height={h} fill={P.blk} /><rect x={-w / 2} y={-h / 2} width={w} height={h} fill={col} {...ink(4)} />
    <text y={fs * 0.36} textAnchor="middle" fontFamily={BEB} fontSize={fs} letterSpacing="3" fill={P.blk}>{text}</text>
    {x1 > 0 && <g opacity={x1}><path d={`M${-w * 0.32} ${-h * 0.4} L${w * 0.32} ${h * 0.4} M${w * 0.32} ${-h * 0.4} L${-w * 0.32} ${h * 0.4}`} stroke={P.red} strokeWidth={h * 0.14} strokeLinecap="round" /></g>}</g>);
}

/* 1 — 3 AM: Arthur wide awake in bed, the Doubt perched on the headboard whispering WHAT IF… */
function AW3am({ T, t, beats }) {
  const d = bt(beats, 2, 1.2), up = EO((t - d + 0.3) / 0.5);
  return (<g><RMBg kind="dark" />
    <Clock x={830} y={330} text="3:00" s={0.9} />
    <rect x={40} y={780} width={1000} height={90} fill={P.blk} />
    <Bed T={T} />
    <RMDoubt x={lp(1250, 860, up)} y={720} s={0.42} T={T} mood="sly" look={[-0.9, 0.6]} blink={T % 3 > 2.88 ? 1 : 0} />
    <RMChip x={330} y={230} text="3 AM WORRIES" col={P.cream} size={56} pop={t / 0.2} />
    <RMSpeech x={430} y={520} text={'“WHAT IF…”'} size={80} col={P.yel} k={(t - bt(beats, 3, 1.8)) / 0.3} rot={-0.04} /></g>);
}

/* 2 — the what-ifs orbit Arthur's head: email, meeting, car noise; then he looks straight at us */
function AWWhatIfs({ T, t, beats }) {
  const you = bt(beats, 3, 2.2), fl = (i) => Math.sin(T * 2 + i) * 10;
  return (<g><RMBg kind="redDark" />
    <RMArthur x={540} y={1020} s={0.95} mouth="frown" brow="sad" lid={t > you ? 0.25 : 0} wide={t < you} stress look={t > you ? [0, 0] : [[-0.8, -0.6], [0.8, -0.7], [0.9, -0.2]][Math.min(2, t > bt(beats, 2) ? 2 : t > bt(beats, 1) ? 1 : 0)]} />
    {t > bt(beats, 0, 0) - 0.1 && <Envelope x={210} y={330 + fl(0)} s={BK((t - bt(beats, 0, 0)) / 0.3) * 0.95} rot={-8} />}
    {t > bt(beats, 1) - 0.1 && <MeetCard x={850} y={300 + fl(1)} s={BK((t - bt(beats, 1)) / 0.3) * 0.9} rot={7} />}
    {t > bt(beats, 2) - 0.1 && <Car x={820} y={600 + fl(2)} s={BK((t - bt(beats, 2)) / 0.3) * 0.75} T={T} />}
    <RMDoubt x={170} y={720} s={0.3} T={T} mood="sly" look={[1, 0.4]} />
    {t > you && <RMChip x={500} y={500} text="YOU TOO?" col={P.yel} size={50} pop={(t - you) / 0.25} />}</g>);
}

/* 3 — snapback: the Doubt's WHAT IF bubble gets a giant red WRONG stamp; it gapes */
function AWSnapWrong({ T, t, beats }) {
  const c = bt(beats, 2, 0.9), k = EO((t - c) / 0.25), sh = t > c && t < c + 0.25 ? Math.sin(T * 80) * 10 : 0;
  return (<g transform={`translate(${sh} 0)`}><RMBg kind="blue" />
    <RMSpeech x={560} y={430} text={'“WHAT IF…”'} size={110} col={P.yel} k={t / 0.25} rot={-0.05} />
    <RMDoubt x={540} y={1000} s={0.95} T={T} mood={t > c ? 'shocked' : 'sly'} look={t > c ? [0, -0.6] : [0, 0.3]} />
    {t > c && <g transform={`translate(540 440) rotate(-9) scale(${1.6 - 0.6 * k})`} opacity={k}>
      <rect x="-340" y="-115" width="680" height="230" fill="none" stroke={P.red} strokeWidth="24" />
      <rect x="-340" y="-115" width="680" height="230" fill={P.cream} opacity="0.12" />
      <text y="72" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="196" fill={P.red}>WRONG</text></g>}</g>);
}

/* 4 — the study: a worry journal fills with WHAT IF lines; 29 people · 10 days */
function AWNotebook({ T, t, beats }) {
  const w = bt(beats, 2, 1.4), n = Math.floor(cl((t - w + 0.2) / 1.4) * 8);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={190} text="BEHAVIOR THERAPY · 2020" col={P.cream} size={42} pop={t / 0.25} />
    <g transform="rotate(-3 540 820)"><rect x={170 + 16} y={360 + 16} width={740} height={900} fill={P.blk} />
      <RMGrid x={170} y={360} w={740} h={900} step={40} />
      <rect x={170} y={360} width={60} height={900} fill={P.red} {...ink(6)} />
      <text x={570} y={450} textAnchor="middle" fontFamily={BEB} fontSize="64" letterSpacing="6" fill={P.blk}>MY WORRIES</text>
      {[...Array(8)].map((_, i) => i < n && <g key={i}><text x={270} y={540 + i * 88} fontFamily={BEB} fontSize="50" letterSpacing="2" fill={P.blue}>{['WHAT IF THE EMAIL…', 'WHAT IF I FORGET…', 'WHAT IF THE CAR…', 'WHAT IF THEY…', 'WHAT IF I’M LATE…', 'WHAT IF IT’S BAD…', 'WHAT IF…', 'WHAT IF…'][i]}</text></g>)}
      {/* pencil */}
      <g transform={`translate(${380 + (t * 260) % 360} ${560 + Math.min(7, n) * 88}) rotate(30)`}><rect x={-14} y={-200} width={28} height={180} fill={P.yel} {...ink(4)} /><path d="M-14 -20 L14 -20 L0 20 Z" fill={P.cream} {...ink(4)} /></g></g>
    <RMChip x={300} y={1330} text="29 PEOPLE" col={P.yel} size={44} pop={(t - bt(beats, 1, 0.8)) / 0.25} rot={0.02} />
    <RMChip x={780} y={1330} text="10 DAYS" col={P.cream} size={44} pop={(t - bt(beats, 2, 1.4)) / 0.25} rot={-0.03} /></g>);
}

/* 5 — a 30-day calendar: each day gets checked; a big HAPPENED? chip */
function AWCalendar({ T, t, beats }) {
  const h = bt(beats, 3, 1.8), n = Math.floor(cl(t / 1.8) * 30);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={200} text="30 DAYS" col={P.cream} size={56} pop={t / 0.2} />
    <rect x={130 + 16} y={340 + 16} width={820} height={860} fill={P.blk} />
    <rect x={130} y={340} width={820} height={860} fill={P.cream} {...ink(8)} />
    <rect x={130} y={340} width={820} height={110} fill={P.blue} {...ink(8)} />
    {[0, 1].map((k) => <rect key={k} x={300 + k * 440} y={300} width={40} height={90} rx={14} fill={P.blk} />)}
    {[...Array(30)].map((_, i) => { const cx = 190 + (i % 6) * 140, cy = 520 + Math.floor(i / 6) * 140, on = i < n;
      return (<g key={i}><rect x={cx - 55} y={cy - 55} width={110} height={110} fill="none" stroke={P.blk} strokeOpacity="0.35" strokeWidth="3" />
        <text x={cx - 44} y={cy - 22} fontFamily={FONT} fontWeight="700" fontSize="26" fill={P.blk} opacity="0.6">{i + 1}</text>
        {on && <path d={`M${cx - 26} ${cy + 4} L${cx - 6} ${cy + 26} L${cx + 30} ${cy - 22}`} fill="none" stroke={P.red} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />}</g>); })}
    <RMSpeech x={720} y={1290} text="HAPPENED?" size={78} col={P.yel} k={(t - h) / 0.3} rot={0.04} />
    <RMDoubt x={150} y={1270} s={0.26} T={T} mood="worried" look={[0.8, -0.6]} /></g>);
}

/* 6 — 100 worry notes; ~91 get crossed out; the number counts up */
function AW91({ T, t, beats }) {
  const g = EO(cl((t - 0.1) / 1.4)), num = Math.round(91 * g);
  return (<g><RMBg kind="redDark" />
    <text x={550} y={430} textAnchor="middle" fontFamily={BEB} fontSize="300" letterSpacing="6" fill={P.blk}>{num}%</text>
    <text x={540} y={420} textAnchor="middle" fontFamily={BEB} fontSize="300" letterSpacing="6" fill={P.yel}>{num}%</text>
    <RMChip x={540} y={520} text="NEVER CAME TRUE" col={P.cream} size={46} pop={(t - bt(beats, 1, 0.6)) / 0.25} />
    {[...Array(100)].map((_, i) => { const cx = 135 + (i % 10) * 90, cy = 660 + Math.floor(i / 10) * 72;
      const keep = [7, 18, 26, 41, 53, 60, 74, 88, 95].includes(i), crossed = !keep && (i / 100) < g * 1.02;
      return (<g key={i}><rect x={cx - 38} y={cy - 26} width={76} height={52} fill={keep ? P.yel : P.cream} stroke={P.blk} strokeWidth="4" opacity={crossed ? 0.55 : 1} />
        {crossed && <path d={`M${cx - 26} ${cy - 18} L${cx + 26} ${cy + 18} M${cx + 26} ${cy - 18} L${cx - 26} ${cy + 18}`} stroke={P.red} strokeWidth="8" strokeLinecap="round" />}</g>); })}
    <RMChip x={540} y={1390} text="IN ONE STUDY" col={P.yel} size={34} pop={(t - 0.3) / 0.25} /></g>);
}

/* 7 — the most common result: a scoreboard reading CAME TRUE: 0; the Doubt gapes */
function AWZero({ T, t, beats }) {
  const e = bt(beats, 2, 1.0), z = t > e;
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={200} text="MOST COMMON RESULT" col={P.cream} size={48} pop={t / 0.2} />
    <rect x={170 + 16} y={330 + 16} width={740} height={560} fill={P.blk} />
    <rect x={170} y={330} width={740} height={560} fill={P.blk} stroke={P.cream} strokeWidth="8" />
    <text x={540} y={430} textAnchor="middle" fontFamily={BEB} fontSize="74" letterSpacing="10" fill={P.cream}>CAME TRUE</text>
    <text x={540} y={810} textAnchor="middle" fontFamily={BEB} fontSize="380" fill={z ? P.yel : P.red}
      style={{ filter: `drop-shadow(0 0 16px ${z ? '#F4C437' : '#D9442E'})` }} transform={z ? `translate(540 700) scale(${BK((t - e) / 0.3)}) translate(-540 -700)` : undefined}>{z ? '0' : String(Math.floor(T * 17) % 10)}</text>
    <RMDoubt x={540} y={1190} s={0.55} T={T} mood={z ? 'shocked' : 'worried'} look={[0, -0.8]} /></g>);
}

/* 8 — name it: the macro eye with the Doubt in the pupil; WORRY'S DECEIT */
function AWDeceit({ T, t }) {
  return (<g><RMEyeMacro open={EO(t / 0.5)}><RMDoubt x={540} y={1010} s={0.22} T={T} mood="sly" look={[0, 0]} /></RMEyeMacro>
    <RMTitle lines={[["WORRY'S", P.cream, 170], ['DECEIT', P.yel, 190]]} y={210} a={EO((t - 0.4) / 0.4)} /></g>);
}

/* 9 — self-proof: a torn LAST MONTH page with a BIG WORRY note; Arthur squints at it, then at us */
function AWLastMonth({ T, t, beats }) {
  const a = bt(beats, 3, 1.6), x1 = SM(a, a + 0.4, t);
  return (<g><RMBg kind="blue" />
    <g transform="rotate(4 540 520)"><rect x={250 + 14} y={260 + 14} width={580} height={520} fill={P.blk} />
      <rect x={250} y={260} width={580} height={520} fill={P.cream} {...ink(8)} />
      <rect x={250} y={260} width={580} height={100} fill={P.red} {...ink(8)} />
      <text x={540} y={335} textAnchor="middle" fontFamily={BEB} fontSize="72" letterSpacing="8" fill={P.cream}>LAST MONTH</text>
      <Note x={540} y={560} w={440} h={150} rot={-4} text="BIG WORRY" fs={96} k={(t - 0.3) / 0.3} x1={x1} col={P.yel} /></g>
    <RMArthur x={540} y={1180} s={0.78} mouth={t > a ? 'smile' : 'flat'} brow={t > a ? 'up' : 'flat'} lid={t > a ? 0.2 : 0.45} look={t > a ? [0, 0] : [0, -1]} />
    <RMChip x={500} y={190} text="DID IT HAPPEN?" col={P.yel} size={48} pop={(t - bt(beats, 2, 1.2)) / 0.25} /></g>);
}

/* 10 — payoff: Arthur writes the worry down, ticks NO later; the Doubt shrinks to a speck */
function AWWriteDown({ T, t, beats }) {
  const c = bt(beats, 2, 1.0), d = bt(beats, 3, 1.6), sh = SM(d - 0.1, d + 1.0, t);
  return (<g><RMBg kind="red" />
    <rect x={150 + 14} y={300 + 14} width={780} height={560} fill={P.blk} />
    <RMGrid x={150} y={300} w={780} h={560} step={40} />
    <text x={200} y={420} fontFamily={BEB} fontSize="68" letterSpacing="3" fill={P.blue} opacity={SM(0, 0.6, t)}>WORRY: THE EMAIL</text>
    <text x={200} y={540} fontFamily={BEB} fontSize="58" letterSpacing="3" fill={P.blk} opacity={SM(c - 0.2, c, t)}>CAME TRUE?</text>
    {[0, 1].map((k) => <g key={k} opacity={SM(c - 0.2, c, t)}><rect x={200 + k * 320} y={590} width={90} height={90} fill={P.cream} {...ink(6)} />
      <text x={310 + k * 320} y={662} fontFamily={BEB} fontSize="74" fill={P.blk}>{k ? 'NO' : 'YES'}</text></g>)}
    {t > c + 0.2 && <path d="M538 640 L568 668 L620 600" fill="none" stroke={P.red} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity={SM(c + 0.2, c + 0.45, t)} />}
    <text x={200} y={790} fontFamily={FONT} fontWeight="700" fontSize="40" letterSpacing="2" fill={P.blk} opacity={SM(c - 0.2, c, t) * 0.7}>CHECKED: LATER</text>
    <RMArthur x={380} y={1160} s={0.62} mouth={t > c ? 'smile' : 'flat'} brow="up" lid={0.25} look={[0.6, -0.9]} />
    <RMDoubt x={lp(820, 900, sh)} y={lp(1080, 1180, sh)} s={lp(0.5, 0.12, sh)} T={T} mood={sh > 0.3 ? 'shocked' : 'sly'} look={[-0.9, -0.5]} />
    <RMChip x={540} y={190} text="WRITE IT · CHECK IT" col={P.cream} size={48} pop={t / 0.2} /></g>);
}

/* 11 — end: 3 AM again, Arthur asleep smiling; the Doubt is a speck; comment prompt */
function AWEnd({ T, t, beats }) {
  const c = bt(beats, 3, 2.0);
  return (<g><RMBg kind="dark" />
    <Clock x={830} y={330} text="3:00" s={0.9} />
    <rect x={40} y={780} width={1000} height={90} fill={P.blk} />
    <Bed T={T} asleep />
    {[0, 1, 2].map((k) => { const ph = ((T * 0.5 + k / 3) % 1); return <text key={k} x={640 + ph * 120 + k * 10} y={860 - ph * 260} fontFamily={BEB} fontSize={50 + k * 16} fill={P.cream} opacity={1 - ph}>Z</text>; })}
    <RMDoubt x={930} y={760} s={0.12} T={T} mood="worried" look={[-1, 0.5]} />
    <RMChip x={330} y={230} text={t > c ? 'COMMENT: GOT ME' : 'FORTUNE TELLER?'} col={t > c ? P.yel : P.cream} size={48} pop={t > c ? (t - c) / 0.25 : t / 0.2} /></g>);
}

Object.assign(window, { AW3am, AWWhatIfs, AWSnapWrong, AWNotebook, AWCalendar, AW91, AWZero, AWDeceit, AWLastMonth, AWWriteDown, AWEnd });
})();
