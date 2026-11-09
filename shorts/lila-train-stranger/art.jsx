// art.jsx — "Headphones In on the Train? Science Says Try This" (Lila ep. 7, with The Doubt; retro modern illustration).
// Mistakenly seeking solitude: Epley & Schroeder 2014 (J Exp Psych: General) — Chicago commuters told to talk to a stranger
// reported a more pleasant ride than those told to sit in solitude, though commuters predicted the opposite. No study
// numbers on screen. Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540 — faces stay out of y 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const OSW = "'Oswald', sans-serif", BEB = "'Bebas Neue', sans-serif";
const STRANGER = { kind: 'human', skin: P.cream, skinD: '#D9C2A0', hair: 'bob', hairCol: P.blk, moustache: false, lips: true, jacket: P.blue };

// the inside of a train carriage: window band with the city sliding past, a grab rail, seat backs
function Carriage({ T, dark = false }) {
  const off = (T * 260) % 420;
  return (<g><RMBg kind={dark ? 'dark' : 'blue'} />
    <rect x="-300" y="280" width="1680" height="360" fill={P.cream} {...ink(8)} />
    <g>{[...Array(7)].map((_, i) => { const x = i * 420 - off - 200, h = 120 + hsh(i + Math.floor((T * 260) / 420)) * 160;
      return <g key={i}><rect x={x} y={640 - h} width="150" height={h} fill={P.blue} /><rect x={x + 180} y={640 - h * 0.6} width="110" height={h * 0.6} fill={P.redD} />
        {[0, 1].map((k) => <rect key={k} x={x + 30 + k * 60} y={640 - h + 30} width="30" height="30" fill={P.yel} />)}</g>; })}</g>
    <rect x="-300" y="280" width="1680" height="360" fill="none" {...ink(10)} />{[180, 540, 900].map((x) => <rect key={x} x={x - 8} y="280" width="16" height="360" fill={P.blk} />)}
    <rect x="-300" y="190" width="1680" height="18" fill={P.yel} {...ink(5)} />{[120, 400, 680, 960].map((x) => <g key={x}><path d={`M${x} 208 L${x} 250`} {...ink(5)} /><circle cx={x} cy="268" r="20" fill="none" {...ink(6)} /></g>)}
    <rect x="-300" y="1290" width="1680" height="700" fill={P.blk} /></g>);
}
// over-ear headphones drawn over a human face (face local units, s = human scale)
function Phones({ x, y, s = 1, neck = false }) {
  if (neck) return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-170 300 Q0 400 170 300" fill="none" {...ink(22)} /><rect x="-230" y="260" width="80" height="110" rx="30" fill={P.blk} /><rect x="150" y="260" width="80" height="110" rx="30" fill={P.blk} /></g>);
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-230 -20 C-240 -420 240 -420 230 -20" fill="none" stroke={P.blk} strokeWidth="34" />
    <rect x="-280" y="-90" width="100" height="170" rx="36" fill={P.blk} /><rect x="180" y="-90" width="100" height="170" rx="36" fill={P.yel} {...ink(8)} /></g>);
}
function Cloud({ x, y, s = 1, T = 0, rain = true }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {rain && [...Array(8)].map((_, i) => { const ph = (T * 1.4 + hsh(i)) % 1; return <path key={i} d={`M${-150 + i * 42} ${60 + ph * 260} l-8 30`} {...ink(6)} stroke={P.cyan} opacity={1 - ph} />; })}
    {[[-110, 10, 80], [-30, -40, 100], [80, -20, 90], [140, 30, 70], [0, 30, 90]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#5b5566" {...ink(7)} />)}
    {[[-110, 10, 72], [-30, -40, 92], [80, -20, 82], [140, 30, 62], [0, 30, 82]].map(([cx, cy, r], i) => <circle key={'f' + i} cx={cx} cy={cy} r={r} fill="#5b5566" />)}</g>);
}

/* 1 — the morning train: Lila, headphones on, eyes down at her phone; the city slides past the window */
function RMTrainQuiet({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2);
  return (<g><Carriage T={T} />
    <RMChip x={540} y={120} text="7:42 AM · MORNING TRAIN" pop={t / 0.25} />
    <RMLila x={540} y={880} s={0.82} mouth="flat" brow="flat" lid={0.6} look={[0, 1]} />
    {t > c2 - 0.2 && <Phones x={540} y={880} s={0.82} />}
    <g transform="translate(560 1300) rotate(-6)"><rect x="-90" y="-150" width="180" height="300" rx="26" fill={P.blk} /><rect x="-72" y="-130" width="144" height="250" rx="12" fill={P.cyan} opacity="0.85" /></g>
    {t > c2 && <RMChip x={830} y={1120} text="DO NOT DISTURB" col={P.cream} size={38} pop={(t - c2) / 0.25} rot={0.05} />}</g>);
}

/* 2 — a carriage of strangers, all heads down at phones; counter WORDS SPOKEN: 0 */
function RMZeroWords({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.6);
  const seats = [[200, 760], [540, 760], [880, 760], [200, 1180], [540, 1180], [880, 1180]];
  const who = [STRANGER, 'arthur', 'mae', 'otto', 'lila', { ...STRANGER, hair: 'flat', skin: P.pink, skinD: P.pinkD, jacket: P.green, lips: false, moustache: true }];
  return (<g><RMBg kind="redDark" />
    {seats.map(([x, y], i) => <g key={i} opacity={SM(i * 0.12, i * 0.12 + 0.3, t)}><rect x={x - 150} y={y - 170} width="300" height="400" rx="30" fill={P.blue} {...ink(6)} />
      <RMHuman x={x} y={y} s={0.36} who={who[i]} mouth="flat" lid={0.65} look={[0, 1]} />
      <rect x={x - 30} y={y + 150} width="60" height="90" rx="10" fill={P.blk} /><rect x={x - 22} y={y + 158} width="44" height="70" rx="5" fill={P.cyan} opacity="0.8" /></g>)}
    <RMChip x={540} y={240} text={t > c3 ? 'WORDS SPOKEN: 0' : 'STRANGERS: 20'} col={t > c3 ? P.cream : P.yel} size={56} pop={t > c3 ? (t - c3) / 0.25 : t / 0.25} /></g>);
}

/* 3 — snapback: a grey rain cloud parks over Lila's head; WORSE stamp */
function RMSnapWorse({ T, t, beats }) {
  const c2 = bt(beats, 3, 1.2);
  return (<g><RMBg kind="blue" />
    <RMLila x={540} y={900} s={0.9} mouth="frown" brow="sad" lid={0.55} look={[0, 1]} />
    <Phones x={540} y={900} s={0.9} />
    <Cloud x={540} y={lp(-200, 400, EO((t - 0.1) / 0.6))} s={1.3} T={T} />
    {t > c2 && <RMChip x={540} y={1290} text="THE WORSE RIDE" col={P.yel} size={56} pop={(t - c2) / 0.25} rot={-0.05} />}</g>);
}

/* 4 — The Doubt perches on Lila's shoulder and whispers AWKWARD into her headphone */
function RMDoubtWhisper({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.9);
  return (<g><RMBg kind="blue" />
    <RMLila x={420} y={860} s={0.85} mouth="flat" brow="sad" lid={0.3} look={[0.9, 0]} stress={t > c1} />
    <Phones x={420} y={860} s={0.85} />
    <RMDoubt x={820} y={1000} s={0.55} T={T} mood="sly" look={[-1, 0]} />
    <RMSpeech x={680} y={380} text="IT'LL BE AWKWARD" size={64} k={(t - c1) / 0.3} col={P.yel} /></g>);
}

/* 5 — the study: journal chip; three condition cards; a CHICAGO train badge */
function RMCommuterStudy({ T, t, beats }) {
  const c3 = bt(beats, 3, 2.0);
  const cards = [['TALK TO A STRANGER', P.yel, c3], ['SIT ALONE', P.cream, c3 + 0.25], ['RIDE AS USUAL', P.pink, c3 + 0.5]];
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={200} text="J. EXP. PSYCH: GENERAL · 2014" col={P.cream} size={40} pop={t / 0.25} />
    <g transform={`translate(540 520) scale(${BK((t - 0.3) / 0.4)})`}><rect x="-260" y="-110" width="520" height="220" rx="40" fill={P.red} {...ink(8)} />
      {[-150, -50, 50, 150].map((x) => <rect key={x} x={x - 40} y="-70" width="80" height="70" fill={P.cream} {...ink(5)} />)}
      <circle cx="-170" cy="110" r="34" fill={P.blk} /><circle cx="170" cy="110" r="34" fill={P.blk} />
      <text y="80" textAnchor="middle" fontFamily={BEB} fontSize="56" letterSpacing="6" fill={P.cream}>CHICAGO</text></g>
    {cards.map(([txt, col, s0], i) => <RMChip key={i} x={540} y={830 + i * 160} text={txt} col={col} size={48} pop={(t - s0) / 0.3} rot={(i - 1) * 0.02} />)}</g>);
}

/* 6 — result: a scale where TALKED (smiley badge) outweighs QUIET (grey cloud); "THEY PREDICTED THE OPPOSITE" */
function RMPleasantRide({ T, t, beats }) {
  const c2 = bt(beats, 3, 1.6), tilt = lp(-0.18, 0.2, EO((t - 0.3) / 0.8)) * (t > c2 ? 1 : 1);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={200} text="MORE PLEASANT RIDE" pop={t / 0.25} />
    <RMScale tilt={-tilt} left={(x, y) => <g><RMBadge x={x} y={y - 110} r={95} k={1} /><RMChip x={x} y={y + 70} text="TALKED" col={P.cream} size={34} /></g>}
      right={(x, y) => <g><Cloud x={x} y={y - 100} s={0.7} T={T} rain={false} /><RMChip x={x} y={y + 70} text="QUIET" col={P.cream} size={34} /></g>} />
    {t > c2 && <RMChip x={540} y={420} text="THEY PREDICTED THE OPPOSITE" col={P.cream} size={38} pop={(t - c2) / 0.25} rot={0.03} />}</g>);
}

/* 7 — name it: stacked title; a pair of headphones floats like a shield */
function RMNameSolitude({ T, t }) {
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['MISTAKENLY', P.cream, 150], ['SEEKING', P.cream, 150], ['SOLITUDE', P.yel, 170]]} y={250} a={EO((t - 0.15) / 0.35)} />
    <g transform={`translate(0 ${Math.sin(T * 2) * 14})`}><Phones x={540} y={1150} s={1.1} /></g></g>);
}

/* 8 — Lila (headphones round her neck) chats with the stranger opposite; a clock spins */
function RMGoodBook({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.3), spin = t > c2 ? (t - c2) * 6 : 0;
  return (<g><Carriage T={T} dark />
    <RMLila x={290} y={920} s={0.6} mouth="smile" brow="up" lid={0.15} look={[1, 0]} />
    <Phones x={290} y={920} s={0.6} neck />
    <RMHuman x={800} y={940} s={0.6} who={STRANGER} mouth={t > 0.8 ? 'smile' : 'flat'} brow="up" lid={0.2} look={[-1, 0]} />
    <g transform="translate(800 1280) rotate(-8)"><rect x="-110" y="-70" width="220" height="140" fill={P.yel} {...ink(6)} /><path d="M0 -70 L0 70" {...ink(5)} /></g>
    <RMSpeech x={330} y={360} text="GOOD BOOK?" size={66} k={(t - 0.2) / 0.3} col={P.yel} />
    {t > c2 && <g transform="translate(860 360) scale(0.45)"><circle r="170" fill={P.cream} {...ink(9)} /><path d={`M0 0 L${Math.sin(spin) * 100} ${-Math.cos(spin) * 100}`} {...ink(12)} /><path d={`M0 0 L${Math.sin(spin * 12) * 130} ${-Math.cos(spin * 12) * 130}`} {...ink(8)} /></g>}</g>);
}

/* 9 — self-proof: Lila says HI and The Doubt shrinks to a pea, shocked */
function RMDreadedChat({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.5), sh = lp(0.55, 0.16, EO((t - c3) / 0.5));
  return (<g><RMBg kind="dark" />
    <RMLila x={400} y={820} s={0.8} mouth={t > c3 ? 'smile' : 'flat'} brow={t > c3 ? 'up' : 'sad'} lid={0.2} look={[0.8, 0.3]} />
    <RMSpeech x={720} y={330} text="HI!" size={110} k={(t - 0.3) / 0.3} col={P.yel} />
    <RMDoubt x={830} y={lp(1020, 1220, EO((t - c3) / 0.5))} s={sh} T={T} mood={t > c3 ? 'shocked' : 'sly'} look={[-1, 0]} />
    {t > c3 && <RMChip x={540} y={1300} text="PROBABLY FINE" col={P.cream} size={48} pop={(t - c3) / 0.25} />}</g>);
}

/* 10 — end: Lila waves, headphones round her neck; a tiny Doubt; question + send chips */
function RMEndHello({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.7), c5 = bt(beats, 5, 2.8);
  return (<g><RMBg kind="blue" />
    <RMLila x={540} y={900} s={0.88} mouth="smile" brow="up" lid={0.15} look={[0, 0]} />
    <Phones x={540} y={900} s={0.88} neck />
    <RMDoubt x={930} y={1250} s={0.16} T={T} mood="shocked" look={[-1, -1]} />
    <RMChip x={540} y={150} text="STRANGERS ARE KINDER" pop={t / 0.25} />
    {t > c3 && <RMChip x={540} y={280} text="SAY HI FIRST?" col={P.cream} size={50} pop={(t - c3) / 0.25} rot={0.03} />}
    {t > c5 && <RMChip x={540} y={1300} text="SEND IT TO THAT FRIEND" col={P.yel} size={40} pop={(t - c5) / 0.25} />}</g>);
}

Object.assign(window, { RMTrainQuiet, RMZeroWords, RMSnapWorse, RMDoubtWhisper, RMCommuterStudy, RMPleasantRide, RMNameSolitude, RMGoodBook, RMDreadedChat, RMEndHello });
})();
