// art.jsx — "Why 'Don't' Makes You Want It More" (Milo ep. 12, with Nia + Theo; ted-MG motion graphics).
// Reactance: Brehm 1966; Pennebaker & Sanders 1976 PSPB "American Graffiti" — graffiti on the no-graffiti placards rose with
// the threat level and the authority of the sign. No invented numbers on screen.
// Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const CARD = '#c99a5e', CARD2 = '#a97d45', PAPER = '#fbf7ee', GOOD = '#5fbf7a', TABLE = '#7a5236';

/* cardboard box with a taped note; lid = 0..1 opens the flaps */
function Box({ x, y, s = 1, lid = 0, note = true, glow = 0, T = 0 }) {
  const fl = lid * 110;
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0 && <MGGlow x={0} y={-60} r={330} col={A} a={glow * (0.55 + 0.15 * osc(T, 1.2))} />}
    <path d={`M-170 -120 L${-170 - fl * 0.4} ${-190 - fl * 0.3} L${-20 - fl * 0.2} ${-190 - fl * 0.6} L0 -120 Z`} fill={CARD2} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <path d={`M170 -120 L${170 + fl * 0.4} ${-190 - fl * 0.3} L${20 + fl * 0.2} ${-190 - fl * 0.6} L0 -120 Z`} fill={CARD2} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <rect x="-170" y="-120" width="340" height="240" rx="10" fill={CARD} stroke={K} strokeWidth="8" />
    <rect x="-24" y="-120" width="48" height="240" fill="#e3c17f" opacity="0.7" />
    {note && <g transform="rotate(-5)"><rect x="-120" y="-70" width="240" height="140" rx="6" fill={PAPER} stroke={K} strokeWidth="6" />
      <rect x="-40" y="-84" width="80" height="26" fill="#f3e6b0" opacity="0.9" />
      <text x="0" y="-8" textAnchor="middle" fontFamily={BB} fontSize="50" letterSpacing="3" fill={R}>DON'T OPEN</text>
      <text x="40" y="46" textAnchor="middle" fontFamily={OS} fontWeight="500" fontSize="30" fill={K}>— Theo</text></g>}
  </g>);
}
function Table({ y = 1180 }) {
  return (<g><rect x="-40" y={y} width="1160" height="60" fill={TABLE} stroke={K} strokeWidth="8" /><rect x="-40" y={y + 60} width="1160" height="40" fill="#5c3c27" /></g>);
}
function Sock({ x, y, rot = 0, s = 1, col = '#e07fa8' }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-30 -110 L30 -110 L30 10 Q30 60 80 60 L100 60 Q130 60 130 90 Q130 120 100 120 L10 120 Q-30 120 -30 70 Z" fill={col} stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <rect x="-30" y="-110" width="60" height="30" fill="#fff" opacity="0.5" /></g>);
}
/* toilet-stall door with a placard; strict = big red sign; n = scribbles shown */
function Stall({ x, y, strict, n = 0, ring = 0 }) {
  const marks = [...Array(Math.max(0, Math.floor(n)))].map((_, i) => {
    const px = -150 + hsh(i * 3.1 + (strict ? 7 : 1)) * 300, py = -330 + hsh(i * 5.7 + (strict ? 3 : 9)) * 200;
    const c = ['#2b2838', '#3f7fbf', '#d9534f', '#4f9d78'][i % 4];
    return <path key={i} d={`M${px} ${py} q20 -24 40 0 t40 0 t40 0`} stroke={c} strokeWidth="7" fill="none" strokeLinecap="round" transform={`rotate(${(hsh(i) - 0.5) * 40} ${px} ${py})`} />;
  });
  return (<g transform={`translate(${x} ${y})`}>
    <rect x="-210" y="-470" width="420" height="860" rx="14" fill="#8fb3c9" stroke={K} strokeWidth="9" />
    <rect x="-190" y="-450" width="380" height="820" rx="8" fill="#a5c6d8" />
    <circle cx="160" cy="0" r="16" fill="#cfd6dc" stroke={K} strokeWidth="6" />
    <g transform="translate(0 -230)">
      <rect x="-175" y="-130" width="350" height="260" rx="10" fill={strict ? R : PAPER} stroke={K} strokeWidth="7" />
      {(strict ? ['DO NOT', 'WRITE ON', 'THESE WALLS!'] : ['please', "don't write", 'on the walls']).map((l, i) => (
        <text key={i} x="0" y={-46 + i * 66} textAnchor="middle" fontFamily={strict ? BB : OS} fontWeight={strict ? 400 : 500} fontSize={strict ? 64 : 44} letterSpacing={strict ? 3 : 0} fill={strict ? '#fff' : K}>{l}</text>))}
    </g>
    <g transform="translate(0 -20)">{marks}</g>
    {ring > 0 && <MGRing cx={0} cy={-240} rx={230} ry={190} p={ring} />}
  </g>);
}
function Meter({ x, y, v, label = 'WANT' }) {
  return (<g transform={`translate(${x} ${y})`}>
    <rect x="-60" y="-420" width="120" height="440" rx="30" fill="#1b1426" stroke={K} strokeWidth="8" />
    <rect x="-44" y={-404 + 408 * (1 - cl(v))} width="88" height={408 * cl(v)} rx="20" fill={v > 0.75 ? R : A} />
    <text x="0" y="90" textAnchor="middle" fontFamily={BB} fontSize="64" letterSpacing="4" fill="#fff">{label}</text></g>);
}

/* 1 — kitchen: the box with Theo's note; Milo pretends not to care */
function MGNoteBox({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5), c3 = b(beats, 3, 1.5);
  return (<g><MGBg kind="room" />
    <MGBust x={250} y={800} r={140} who="milo" look={[t > c3 ? -0.6 : 0.9, 0.2]} brow={t > c3 ? 'up' : 'flat'} mouth={t > c3 ? 'smile' : 'flat'} bl={BL(T)} />
    <Table y={1180} />
    <Box x={700} y={1060} s={1.1} T={T} />
    {t > c1 && <MGRing cx={690} cy={1050} rx={170} ry={110} p={(t - c1) / 0.4} />}
    {t > c3 && <MGBubble x={300} y={560} text="DON'T CARE." k={(t - c3) / 0.3} size={50} />}
    <MGChip x={540} y={170} text="KITCHEN · 8:02 PM" size={40} pop={t / 0.25} /></g>);
}

/* 2 — ten minutes later: a close-up, Milo's eyes locked on the glowing box */
function MGStaring({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  const z = lp(1, 1.08, SM(0, 3, t));
  return (<g><MGBg kind="roomNight" />
    <g transform={`translate(540 700) scale(${z}) translate(-540 -700)`}>
      <MGBust x={360} y={640} r={185} who="milo" look={[0.9, 0.8]} brow="worried" mouth="wave" sweat={t > c2 ? (t * 0.7) % 1 : null} bl={0} />
    </g>
    <Box x={820} y={1190} s={0.8} glow={SM(c2 - 0.3, c2 + 0.3, t)} T={T} />
    {t > c2 && <MGArrows x={820} y={1150} t={t - c2} n={6} from={560} to={250} />}
    <MGChip x={540} y={170} text="8:12 PM" size={44} pop={t / 0.25} /></g>);
}

/* 3 — snapback: the DON'T stamp slams on and the WANT meter shoots up */
function MGWantMore({ T, t, beats }) {
  const c2 = b(beats, 2, 0.8), c4 = b(beats, 4, 1.4);
  const v = lp(0.15, 0.25, SM(0, c2, t)) + SM(c2, c4 + 0.3, t) * 0.75;
  const k = (t - c2) / 0.22;
  return (<g><MGBg kind="dark" />
    <Box x={430} y={900} s={1.25} note={false} glow={SM(c4 - 0.3, c4 + 0.2, t)} T={T} />
    {k > 0 && <g transform={`translate(430 880) rotate(-10) scale(${lp(1.8, 1, EO(k))})`} opacity={cl(k * 2)}>
      <rect x="-230" y="-80" width="460" height="160" rx="14" fill="none" stroke={R} strokeWidth="14" />
      <text x="0" y="50" textAnchor="middle" fontFamily={BB} fontSize="150" letterSpacing="10" fill={R}>DON'T</text></g>}
    <Meter x={880} y={1120} v={v} />
    <MGChip x={540} y={170} text="THE RULE, NOT THE BOX" size={40} pop={(t - c2) / 0.25} /></g>);
}

/* 4 — study 1976: two stall doors, a polite sign and a strict sign */
function MGStallSigns({ T, t, beats }) {
  const k1 = EO(t / 0.45), k2 = EO((t - 0.3) / 0.45);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={170} text="STUDY · 1976" size={44} pop={t / 0.25} />
    <g transform={`translate(0 ${lp(900, 0, k1)})`}><Stall x={295} y={830} strict={false} /></g>
    <g transform={`translate(0 ${lp(900, 0, k2)})`}><Stall x={785} y={830} strict={true} /></g>
    <text x="540" y="1300" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="40" letterSpacing="4" fill="#fff" opacity="0.75">POLITE SIGN · STRICT SIGN</text></g>);
}

/* 5 — result: scribbles pile up, far more on the strict sign */
function MGMoreGraffiti({ T, t, beats }) {
  const c3 = b(beats, 3, 1.3);
  return (<g><MGBg kind="navy" />
    <Stall x={295} y={830} strict={false} n={Math.min(3, t / 0.6)} />
    <Stall x={785} y={830} strict={true} n={Math.min(16, t / 0.12)} ring={(t - c3) / 0.4} />
    <MGChip x={785} y={170} text="MORE GRAFFITI" col={R} txt="#fff" size={42} pop={(t - 0.2) / 0.25} />
    <text x="540" y="1300" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="40" letterSpacing="4" fill="#fff" opacity="0.75">ON THE SIGN ITSELF</text></g>);
}

/* 6 — name it: a hand grabs the freedom back (a key pulled from a padlocked chain) */
function MGReactance({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c2 = b(beats, 2, 1.4);
  const g = SM(c2 - 0.2, c2 + 0.3, t);
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <MGTitle lines={[['REACTANCE', A, 170]]} y={300} a={SM(0, 0.3, t)} />
    <g transform="translate(540 760)">
      <rect x="-260" y="-110" width="520" height="220" rx="24" fill={PAPER} stroke={K} strokeWidth="8" />
      <text x="0" y="30" textAnchor="middle" fontFamily={BB} fontSize="110" letterSpacing="6" fill={K}>FREEDOM</text>
      {t > c1 && <g opacity={1 - g}><path d="M-300 -60 L300 60 M-300 60 L300 -60" stroke="#9aa0ad" strokeWidth="26" strokeLinecap="round" strokeDasharray="34 14" />
        <rect x="-60" y="-20" width="120" height="100" rx="14" fill={A} stroke={K} strokeWidth="7" /><path d="M-36 -20 v-40 a36 36 0 0 1 72 0 v40" stroke={K} strokeWidth="12" fill="none" /></g>}
    </g>
    <MGArm x1={1180} y1={1300} x2={lp(980, 820, g)} y2={lp(1100, 880, g)} sleeve="#f7f5f0" w={90} />
    <MGBust x={240} y={1110} r={110} who="milo" look={[1, -0.4]} brow={t > c2 ? 'angry' : 'flat'} mouth={t > c2 ? 'grin' : 'flat'} bl={BL(T)} /></g>);
}

/* 7 — self-proof: a phone buzzes with a 'you can't' */
function MGYouCant({ T, t, beats }) {
  const c3 = b(beats, 3, 1.3);
  return (<g><MGBg kind="roomNight" />
    <MGPhone x={540} y={760} rot={-4} time="11:48" day="TUESDAY" from="FLATMATE" msg="don't eat my cake." k={(t - 0.2) / 0.4} />
    {t > c3 && <MGRing cx={540} cy={800} rx={230} ry={90} p={(t - c3) / 0.4} rot={-4} />}
    <MGArm x1={-120} y1={1900} x2={lp(200, 320, SM(c3 - 0.2, c3 + 0.3, t))} y2={1230} sleeve="#f7f5f0" w={90} /></g>);
}

/* 8 — payoff: Nia flips the lid open — socks — Milo shrugs */
function MGSocks({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c2 = b(beats, 2, 1.3);
  const lid = SM(0.1, c1, t), pop = (t - c1) / 0.35;
  return (<g><MGBg kind="room" />
    <Table y={1180} />
    <Box x={540} y={1060} s={1} lid={lid} T={T} />
    {pop > 0 && <g><Sock x={480} y={lp(1000, 760, EO(pop))} rot={-25} s={BK(pop)} /><Sock x={610} y={lp(1000, 720, EO(pop - 0.2))} rot={20} s={BK(pop - 0.2)} col="#6a7bd1" /></g>}
    {t > c1 && <MGChip x={540} y={420} text="THEO'S SOCKS" size={44} pop={(t - c1) / 0.25} />}
    <MGPerson x={170} y={1180} s={2.8} who="nia" look={[1, 0]} mouth="smile" brow="up" bl={BL(T, 0.3)} />
    <MGPerson x={910} y={1180} s={2.8} who="milo" look={[-1, 0]} mouth={t > c2 ? 'flat' : 'o'} brow={t > c2 ? 'flat' : 'up'} bl={BL(T)} />
    {t > c2 && <MGBubble x={860} y={640} text="OH. NEVER|MIND." k={(t - c2) / 0.3} size={42} />}
    <MGChip x={540} y={170} text="8:14 PM" size={40} pop={t / 0.25} /></g>);
}

/* 9 — end: the note dangles on a fishing hook; Milo grins */
function MGEndBait({ T, t, beats }) {
  const sw = osc(T, 2.4) * 5;
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <g transform={`rotate(${sw} 540 -40)`}>
      <line x1="540" y1="-40" x2="540" y2="520" stroke="#e9e2d4" strokeWidth="5" />
      <path d="M540 520 v60 a40 40 0 1 1 -60 30" stroke="#cfd6dc" strokeWidth="12" fill="none" strokeLinecap="round" />
      <g transform="translate(540 760) rotate(-6)"><rect x="-200" y="-120" width="400" height="240" rx="10" fill={PAPER} stroke={K} strokeWidth="8" />
        <text x="0" y="20" textAnchor="middle" fontFamily={BB} fontSize="84" letterSpacing="4" fill={R}>DON'T OPEN</text></g>
    </g>
    <MGBust x={540} y={1120} r={120} who="milo" look={[0, -0.8]} brow="up" mouth="grin" bl={BL(T)} />
    <MGChip x={540} y={170} text="WOULD YOU OPEN IT?" size={44} pop={t / 0.25} /></g>);
}

Object.assign(window, { MGNoteBox, MGStaring, MGWantMore, MGStallSigns, MGMoreGraffiti, MGReactance, MGYouCant, MGSocks, MGEndBait });
})();
