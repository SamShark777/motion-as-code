// art.jsx — "You'd Defend a Choice You Never Made" (Otto ep. 10, with Lila; retro modern illustration).
// Choice blindness: Johansson, Hall, Sikström & Olsson 2005 (Science) — 120 people chose the more attractive of two faces;
// on swapped trials (sleight of hand) only 13% of the swaps were detected right away, and people explained the "choice".
// Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540, faces stay above y 1400.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";
const FACE_A = { name: 'A', kind: 'human', skin: P.pink, skinD: P.pinkD, hair: 'bob', hairCol: P.blk, moustache: false, lips: true, jacket: P.blue };
const FACE_B = { name: 'B', kind: 'human', skin: P.yel, skinD: '#D9A62A', hair: 'curly', hairCol: P.redD, moustache: false, lips: true, jacket: P.green };

/* a logo card: red circle or blue triangle */
function Logo({ x, y, kind = 'red', s = 1, rot = 0, check = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-190} width={300} height={380} fill={P.blk} transform="translate(12 12)" />
    <rect x={-150} y={-190} width={300} height={380} fill={P.cream} {...ink(7)} />
    {kind === 'red' ? <circle cx={0} cy={-20} r={95} fill={P.red} {...ink(7)} /> : <path d={RM.pts([[0, -130], [105, 70], [-105, 70]])} fill={P.blue} {...ink(7)} />}
    <text x={0} y={150} textAnchor="middle" fontFamily={BEB} fontSize="54" letterSpacing="4" fill={P.blk}>{kind === 'red' ? 'LOGO A' : 'LOGO B'}</text>
    {check > 0 && <g transform={`translate(110 -160) scale(${BK(cl(check))})`}><circle r={52} fill={P.yel} {...ink(6)} /><path d="M-24 0 L-6 20 L26 -20" fill="none" {...ink(10)} /></g>}
  </g>);
}
/* a photo card with a face (FACE_A / FACE_B) */
function FaceCard({ x, y, who, s = 1, rot = 0 }) {
  const id = 'fc' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-160} y={-210} width={320} height={420} fill={P.blk} transform="translate(12 12)" />
    <rect x={-160} y={-210} width={320} height={420} fill={P.cream} {...ink(7)} />
    <clipPath id={id}><rect x={-140} y={-190} width={280} height={380} /></clipPath>
    <g clipPath={`url(#${id})`}><rect x={-140} y={-190} width={280} height={380} fill={P.redD} /><RMHuman who={who} x={0} y={10} s={0.42} mouth="smile" lid={0.2} /></g></g>);
}

/* 1 — Otto at the table, two logo cards; he jabs at the red one: check */
function RMLogoPick({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6), c2 = bt(beats, 2, 1.2);
  return (<g><RMBg kind="blue" />
    <RMOtto x={540} y={520} s={0.62} mouth={t > c2 ? 'smile' : 'flat'} brow={t > c2 ? 'up' : 'angry'} lid={0.25} look={[-0.6, 1]} body />
    <rect x={-20} y={940} width={1120} height={460} fill={P.redD} {...ink(8)} />
    <Logo x={300} y={1150} kind="red" s={0.8} rot={-4} check={(t - c1) / 0.3} />
    <Logo x={780} y={1150} kind="blue" s={0.8} rot={4} />
    {t > c2 && <RMChip x={540} y={140} text="100% SURE" col={P.yel} size={54} pop={(t - c2) / 0.25} />}</g>);
}

/* 2 — Lila's hands shuffle the two cards: the red one slides away, the blue one lands in front of Otto */
function RMSwapRight({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.6);
  const p = EO((t - 0.1) / 0.9);
  return (<g><RMBg kind="blue" />
    <RMLila x={250} y={430} s={0.42} mouth="smile" brow="angry" lid={0.4} look={[1, 1]} />
    <rect x={-20} y={940} width={1120} height={460} fill={P.redD} {...ink(8)} />
    <Logo x={lp(300, 780, p)} y={1150 - Math.sin(p * Math.PI) * 220} kind="red" s={0.8} rot={lp(-4, 4, p)} />
    <Logo x={lp(780, 300, p)} y={1150 + Math.sin(p * Math.PI) * 60} kind="blue" s={0.8} rot={lp(4, -4, p)} />
    {[0, 1].map((k) => <path key={k} d={`M${380 + k * 40} ${720 - k * 30} Q540 ${600 - k * 30} ${700 - k * 40} ${720 - k * 30}`} fill="none" stroke={P.cream} strokeWidth="10" strokeDasharray="24 18" opacity={SM(0.1, 0.4, t)} />)}
    {t > c1 && <RMChip x={760} y={300} text="SWAPPED?" col={P.yel} size={58} pop={(t - c1) / 0.25} rot={0.04} />}</g>);
}

/* 3 — snapback: a giant eye; the blue card sits in its pupil and the heavy lid half-closes */
function RMDontNotice({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5);
  return (<g><RMEyeMacro open={lp(1, 0.55, EO((t - c1) / 0.5))}>
      <g transform="translate(540 980) scale(0.42)"><Logo x={0} y={0} kind="blue" /></g></RMEyeMacro>
    {t > c1 && <RMChip x={540} y={1330} text="NOT NOTICED" col={P.yel} size={60} pop={(t - c1) / 0.25} />}</g>);
}

/* 4 — the study: SCIENCE · 2005, 120 PEOPLE; two face photos side by side */
function RMFacesStudy({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5), c4 = bt(beats, 4, 2.0);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={170} text="SCIENCE · 2005" col={P.cream} size={52} pop={t / 0.25} />
    {t > c1 && <RMChip x={540} y={300} text="120 PEOPLE" col={P.yel} size={48} pop={(t - c1) / 0.25} rot={-0.03} />}
    <g opacity={SM(0.2, 0.5, t)}><FaceCard x={300} y={850} who={FACE_A} s={1.0} rot={-3} /><FaceCard x={780} y={850} who={FACE_B} s={1.0} rot={3} /></g>
    {t > c4 && <RMChip x={540} y={1240} text="WHICH IS MORE ATTRACTIVE?" col={P.cream} size={38} pop={(t - c4) / 0.25} />}</g>);
}

/* 5 — sleight of hand: the picked card slides into a sleeve, the other slides out */
function RMSleight({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  const p = EO((t - 0.2) / 0.8);
  return (<g><RMBg kind="redDark" />
    <path d={RM.pts([[-40, 640], [420, 760], [420, 1040], [-40, 1020]])} fill={P.blk} />
    <path d={RM.pts([[1120, 640], [660, 760], [660, 1040], [1120, 1020]])} fill={P.blk} />
    <FaceCard x={lp(540, -260, p)} y={900} who={FACE_A} s={0.9} rot={lp(0, -20, p)} />
    <FaceCard x={lp(1340, 540, p)} y={900} who={FACE_B} s={0.9} rot={lp(20, 0, p)} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${300 + i * 60} ${560 - i * 30} l40 -50`} {...ink(9)} opacity={SM(0.3, 0.6, t)} />)}
    <RMChip x={540} y={240} text="SLEIGHT OF HAND" col={P.cream} size={50} pop={t / 0.25} />
    {t > c2 && <RMChip x={540} y={1300} text="THE OTHER FACE" col={P.yel} size={54} pop={(t - c2) / 0.25} />}</g>);
}

/* 6 — result: 100 swap cards; only 13 flip yellow (CAUGHT) */
function RMThirteen({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4);
  const caught = new Set([3, 17, 22, 38, 41, 49, 56, 63, 70, 77, 84, 91, 98]);
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['13%', P.yel, 220]]} y={250} a={SM(0, 0.3, t)} />
    {[...Array(100)].map((_, i) => { const x = 165 + (i % 10) * 78, y = 520 + Math.floor(i / 10) * 82, on = caught.has(i) && t > 0.5 + [...caught].indexOf(i) * 0.06;
      return <rect key={i} x={x - 28} y={y - 32} width={56} height={64} fill={on ? P.yel : P.cream} {...ink(4)} opacity={on ? 1 : 0.8} />; })}
    {t > c3 && <RMChip x={540} y={1360} text="CAUGHT RIGHT AWAY" col={P.yel} size={44} pop={(t - c3) / 0.25} />}</g>);
}

/* 7 — the explanation: a participant points at the face they never picked: "HER SMILE!" */
function RMExplain({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.8);
  return (<g><RMBg kind="red" />
    <FaceCard x={720} y={760} who={FACE_B} s={0.95} rot={4} />
    <RMHuman who={{ name: 'P', kind: 'human', skin: P.cream, skinD: '#D9C2A0', hair: 'flat', hairCol: P.blk, moustache: false, jacket: P.blue }} x={300} y={980} s={0.5} mouth="open" brow="up" lid={0.1} look={[1, -0.3]} />
    <RMSpeech x={330} y={420} text="HER SMILE!" size={84} k={(t - c1) / 0.3} col={P.yel} rot={-0.05} />
    {t > c1 + 0.4 && <RMChip x={720} y={1180} text="NEVER PICKED HER" col={P.cream} size={40} pop={(t - c1 - 0.4) / 0.25} rot={0.03} />}</g>);
}

/* 8 — name: CHOICE BLINDNESS over two cards, one with a blindfold */
function RMBlindName({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.5);
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['CHOICE', P.cream, 170], ['BLINDNESS', P.yel, 170]]} y={330} a={SM(c1 - 0.2, c1 + 0.2, t)} />
    <g transform={`translate(540 ${1000 + Math.sin(T * 2) * 10})`}><Logo x={0} y={0} kind="red" s={0.95} />
      <path d={RM.pts([[-200, -60], [200, -80], [200, 20], [-200, 40]])} fill={P.blk} transform={`scale(${SM(0.1, 0.5, t)} 1)`} />
      <path d="M200 -30 l90 -40 M200 -10 l100 30" {...ink(14)} opacity={SM(0.4, 0.6, t)} /></g></g>);
}

/* 9 — self-proof: Lila guards her pick like a trophy */
function RMDefend({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  return (<g><RMBg kind="blue" />
    <RMLila x={540} y={840} s={0.55} mouth="flat" brow="angry" lid={0.35} look={[0, 0]} />
    <g transform={`translate(540 ${lp(1500, 1150, EO((t - 0.1) / 0.4))})`}><path d="M-110 -120 L110 -120 L80 40 Q0 90 -80 40 Z" fill={P.yel} {...ink(8)} />
      <path d="M-110 -100 Q-190 -90 -160 -20 Q-140 20 -90 10 M110 -100 Q190 -90 160 -20 Q140 20 90 10" fill="none" {...ink(10)} />
      <rect x={-30} y={60} width={60} height={70} fill={P.yel} {...ink(6)} /><rect x={-110} y={130} width={220} height={50} fill={P.blk} />
      <text x={0} y={-40} textAnchor="middle" fontFamily={BEB} fontSize="58" fill={P.blk}>MY PICK</text></g>
    {t > c2 && <RMChip x={540} y={260} text="DEFENDED FOREVER" col={P.cream} size={48} pop={(t - c2) / 0.25} />}</g>);
}

/* 10 — payoff: Otto waves the BLUE logo, shouting its praises; Lila holds the red card behind her back */
function RMOttoSpeech({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1);
  return (<g><RMBg kind="dark" />
    <RMOtto x={360} y={700} s={0.5} mouth="shout" brow="up" lid={0} wide look={[0.6, -0.2]} />
    <Logo x={740 + Math.sin(T * 8) * 8} y={560} kind="blue" s={0.62} rot={8 + Math.sin(T * 8) * 4} />
    <RMSpeech x={380} y={250} text="SO BOLD! SO BLUE!" size={66} k={(t - 0.15) / 0.3} col={P.yel} />
    <RMLila x={820} y={1080} s={0.32} mouth="smile" lid={0.4} look={[-1, -0.5]} />
    {t > c2 && <g><Logo x={980} y={1230} kind="red" s={0.42} rot={-12} /><RMChip x={600} y={1280} text="HIS PICK: RED" col={P.yel} size={46} pop={(t - c2) / 0.25} /></g>}</g>);
}

/* 11 — end: both cards face down; question + send chips */
function RMEndSwap({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.6);
  const flip = EO((t - 0.3) / 0.6);
  return (<g><RMBg kind="dark" />
    {[[300, 'red'], [780, 'blue']].map(([x, k], i) => <g key={i} transform={`translate(${x} 900) scale(${Math.cos(flip * Math.PI) || 0.001} 1)`}>
      {flip < 0.5 ? <Logo x={0} y={0} kind={k} s={0.9} /> : <g><rect x={-135} y={-171} width={270} height={342} fill={P.red} {...ink(7)} /><text x={0} y={30} textAnchor="middle" fontFamily={BEB} fontSize="160" fill={P.cream}>?</text></g>}</g>)}
    <RMChip x={540} y={330} text="YOUR PICK… OR THEIRS?" col={P.yel} size={48} pop={t / 0.25} />
    {t > c3 && <RMChip x={540} y={1300} text="SEND IT" col={P.cream} size={48} pop={(t - c3) / 0.25} rot={-0.03} />}</g>);
}

Object.assign(window, { RMLogoPick, RMSwapRight, RMDontNotice, RMFacesStudy, RMSleight, RMThirteen, RMExplain, RMBlindName, RMDefend, RMOttoSpeech, RMEndSwap });
})();
