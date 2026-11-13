// art.jsx — "Why Picking Your Own Lottery Numbers Feels Luckier" (Lila ep. 8, with Otto; retro modern illustration).
// Illusion of control: Langer 1975 (JPSP) — office workers bought $1 lottery tickets; those who chose their own ticket asked
// $8.67 on average to sell it back, those handed one $1.96. Same odds. Full 1080×1920 frames with retro-kit.jsx; captions at
// y ≈ 1540 — faces and numbers stay out of y 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";

/* a lottery ticket: nums = 'chosen' numbers in a heart, or plain random ones */
function Ticket({ x, y, s = 1, rot = 0, k = 1, nums = '04 · 17 · 23', heart = false, col = P.yel }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k) * s})`}>
    <path d="M-220 -110 L220 -110 L220 -40 A30 30 0 0 0 220 20 L220 110 L-220 110 L-220 20 A30 30 0 0 0 -220 -40 Z" fill={col} {...ink(7)} />
    <rect x="-190" y="-90" width="380" height="60" fill={P.blk} /><text y="-44" textAnchor="middle" fontFamily={BEB} fontSize="50" letterSpacing="6" fill={P.cream}>LOTTERY · $1</text>
    <text y="50" textAnchor="middle" fontFamily={BEB} fontSize="70" letterSpacing="3" fill={P.blk}>{nums}</text>
    {heart && <path transform="translate(170 70) scale(0.5)" d="M0 30 C-60 -10 -50 -60 -18 -60 C-6 -60 0 -50 0 -42 C0 -50 6 -60 18 -60 C50 -60 60 -10 0 30 Z" fill={P.red} {...ink(6)} />}</g>);
}
function PriceTag({ x, y, text, s = 1, k = 1, T = 0, col = P.cream }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${Math.sin(T * 2.4) * 6}) scale(${BK(k) * s})`}>
    <path d="M0 -150 L0 -60" {...ink(5)} />
    <path d="M-150 -60 L110 -60 L170 40 L110 140 L-150 140 Z" fill={col} {...ink(8)} /><circle cx="110" cy="40" r="14" fill={P.blk} />
    <text x="-20" y="80" textAnchor="middle" fontFamily={BEB} fontSize="130" letterSpacing="2" fill={P.blk}>{text}</text></g>);
}
function Jar({ x, y, s = 1, label = 'OFFICE LOTTERY', fill = 0, coins = false }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-150 -170 L150 -170 L170 -120 L170 180 Q170 220 130 220 L-130 220 Q-170 220 -170 180 L-170 -120 Z" fill={P.cream} fillOpacity="0.55" {...ink(8)} />
    <rect x="-130" y="-220" width="260" height="56" fill={P.red} {...ink(7)} />
    {coins ? [...Array(Math.round(fill * 14))].map((_, i) => <ellipse key={i} cx={-100 + (i % 5) * 50} cy={190 - Math.floor(i / 5) * 34} rx="34" ry="14" fill={P.yel} {...ink(4)} />)
      : [...Array(9)].map((_, i) => <rect key={i} x={-120 + (i % 3) * 80 + hsh(i) * 20} y={40 + Math.floor(i / 3) * 50} width="90" height="44" fill={[P.yel, P.pink, P.cream][i % 3]} {...ink(4)} transform={`rotate(${(hsh(i + 3) - 0.5) * 50} ${-80 + (i % 3) * 80} ${60 + Math.floor(i / 3) * 50})`} />)}
    <rect x="-130" y="-90" width="260" height="70" fill={P.blk} /><text y="-40" textAnchor="middle" fontFamily={BEB} fontSize="44" letterSpacing="3" fill={P.yel}>{label}</text></g>);
}
function Mug({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M150 -60 C260 -60 260 120 150 120" fill="none" {...ink(22)} /><path d="M150 -60 C260 -60 260 120 150 120" fill="none" stroke={P.red} strokeWidth="10" />
    <path d="M-170 -150 L170 -150 L150 200 L-150 200 Z" fill={P.red} {...ink(9)} />
    <g transform="translate(0 20)">{[0, 90, 180, 270].map((a) => <ellipse key={a} cx={0} cy={-45} rx={38} ry={50} fill={P.green} {...ink(5)} transform={`rotate(${a + 45})`} />)}<circle r="14" fill={P.yel} {...ink(4)} /></g></g>);
}

/* 1 — the office lottery jar; Otto holds out a random ticket, Lila waves it off with her own birthday numbers */
function RMOfficePool({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.5);
  return (<g><RMBg kind="dark" />
    <Jar x={540} y={420} s={0.9} />
    <RMOtto x={250} y={860} s={0.5} mouth="flat" brow="flat" lid={0.45} look={[1, 0]} />
    <RMLila x={830} y={860} s={0.5} mouth="smile" brow="up" lid={0.15} look={[-0.6, 0.4]} />
    <Ticket x={300} y={1240} s={0.6} rot={-8} k={(t - 0.6) / 0.3} nums="04 · 17 · 23" col={P.cream} />
    {t > c3 && <Ticket x={770} y={1240} s={0.65} rot={6} k={(t - c3) / 0.3} nums="12 · 07 · 19" heart />}
    {t > c3 && <RMChip x={770} y={1080} text="MY BIRTHDAY!" col={P.yel} size={40} pop={(t - c3 - 0.2) / 0.25} rot={0.04} />}</g>);
}

/* 2 — proof: LANGER · 1975; a chosen $1 ticket gets a swinging price tag that counts up to $8.67 */
function RMNineDollars({ T, t, beats }) {
  const c5 = bt(beats, 5, 2.0), v = 1 + 7.67 * EO((t - c5 + 0.6) / 0.8);
  return (<g><RMBg kind="redDark" />
    <RMChip x={540} y={170} text="LANGER · 1975" col={P.cream} size={50} pop={t / 0.25} />
    <Ticket x={540} y={560} s={1.1} rot={-4} k={(t - 0.3) / 0.3} nums="12 · 07 · 19" heart />
    <RMChip x={540} y={330} text="PICKED IT MYSELF" col={P.yel} size={40} pop={(t - 0.8) / 0.25} rot={0.03} />
    {t > c5 - 0.6 && <PriceTag x={560} y={1050} T={T} text={`$${v.toFixed(2)}`} k={(t - c5 + 0.6) / 0.3} col={P.yel} />}</g>);
}

/* 3 — snapback: the chosen ticket and a random one sit on a perfectly level scale: SAME ODDS */
function RMSameOdds({ T, t, beats }) {
  const c1 = bt(beats, 1, 0.7), wob = Math.sin(T * 3) * 0.04 * (1 - SM(0, 1.2, t));
  return (<g><RMBg kind="blue" />
    <RMScale tilt={wob} left={(x, y) => <Ticket x={x} y={y - 80} s={0.55} nums="12 · 07 · 19" heart />} right={(x, y) => <Ticket x={x} y={y - 80} s={0.55} nums="04 · 17 · 23" col={P.cream} />} />
    {t > c1 && <RMTitle lines={[['SAME ODDS', P.yel, 170]]} y={380} a={EO((t - c1) / 0.3)} />}</g>);
}

/* 4 — handed one: a big hand drops a plain ticket; bars on grid paper: $8.67 chosen vs $1.96 handed */
function RMHandedTwo({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), g = EO((t - c2 + 0.2) / 0.6);
  return (<g><RMBg kind="red" />
    <RMHand x={540} y={lp(-100, 120, EO(t / 0.5))} s={0.55} col={P.blue} />
    <Ticket x={540} y={lp(330, 420, EO(t / 0.5))} s={0.6} nums="04 · 17 · 23" col={P.cream} />
    <RMGrid x={170} y={600} w={740} h={720} />
    <rect x="270" y={1280 - 560 * EO((t - 0.4) / 0.5)} width="200" height={560 * EO((t - 0.4) / 0.5)} fill={P.yel} {...ink(7)} />
    <rect x="610" y={1280 - 127 * g} width="200" height={127 * g} fill={P.cream} {...ink(7)} />
    <text x="370" y={1250 - 560 * EO((t - 0.4) / 0.5) - 30} textAnchor="middle" fontFamily={BEB} fontSize="80" fill={P.blk}>$8.67</text>
    {g > 0 && <text x="710" y={1250 - 127 * g - 30} textAnchor="middle" fontFamily={BEB} fontSize="80" fill={P.blk} opacity={g}>$1.96</text>}
    <text x="370" y="1370" textAnchor="middle" fontFamily={BEB} fontSize="48" letterSpacing="3" fill={P.cream}>CHOSE IT</text>
    <text x="710" y="1370" textAnchor="middle" fontFamily={BEB} fontSize="48" letterSpacing="3" fill={P.cream}>HANDED IT</text></g>);
}

/* 5 — name it: THE ILLUSION OF CONTROL over a steering wheel whose column is connected to nothing */
function RMNameControl({ T, t }) {
  const a = Math.sin(T * 1.6) * 35;
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['THE ILLUSION', P.cream, 140], ['OF CONTROL', P.yel, 170]]} y={250} a={EO((t - 0.15) / 0.35)} />
    <g transform={`translate(540 960) rotate(${a})`}><circle r="260" fill="none" {...ink(60)} /><circle r="260" fill="none" stroke={P.red} strokeWidth="40" />
      {[0, 120, 240].map((r) => <rect key={r} x="-20" y="-250" width="40" height="250" fill={P.red} {...ink(6)} transform={`rotate(${r})`} />)}<circle r="70" fill={P.yel} {...ink(8)} /></g>
    <rect x="515" y="1030" width="50" height="190" fill={P.blk} />
    <path d="M520 1220 L540 1250 L530 1280 M560 1220 L552 1260 L570 1290" {...ink(6)} fill="none" />
    <RMChip x={540} y={1330} text="CONNECTED TO NOTHING" col={P.cream} size={40} pop={(t - 0.8) / 0.25} /></g>);
}

/* 6 — you: the lift call button; a hand presses it again and again — x2, x3 */
function RMLiftButton({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.3), press = Math.max(0, Math.sin((t - 0.3) * 9)) * (t > 0.3 ? 1 : 0), n = t < c3 ? 1 : 1 + Math.floor((t - c3) * 2.2);
  return (<g><RMBg kind="red" />
    <rect x="200" y="200" width="680" height="1140" fill="#B9B2A6" {...ink(9)} /><line x1="540" y1="200" x2="540" y2="1340" {...ink(8)} />
    <rect x="300" y="110" width="480" height="90" fill={P.blk} /><text x="540" y="180" textAnchor="middle" fontFamily={BEB} fontSize="70" letterSpacing="6" fill={P.yel}>▼ 7</text>
    <g transform="translate(940 760)"><rect x="-90" y="-180" width="180" height="360" fill={P.cream} {...ink(7)} /><circle cy="0" r="62" fill={press > 0.5 ? P.yel : P.cream} {...ink(7)} /><path d="M-22 12 L0 -18 L22 12 Z" fill={P.blk} /></g>
    <RMHand x={960 - press * 10} y={760 + 30 - press * 25} s={0.42} rot={-1.7} press={press} col={P.pink} />
    {t > c3 && <RMChip x={540} y={420} text={`PRESSED × ${Math.min(n, 5)}`} col={P.yel} size={54} pop={(t - c3) / 0.25} rot={0.04} />}</g>);
}

/* 7 — self-proof: the lucky mug with a four-leaf clover, glowing on a desk */
function RMLuckyMug({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  return (<g><RMBg kind="blue" />
    {[...Array(10)].map((_, i) => { const a = i / 10 * Math.PI * 2 + T * 0.3; return <path key={i} d={`M${540 + Math.cos(a) * 330} ${820 + Math.sin(a) * 330} L${540 + Math.cos(a) * 440} ${820 + Math.sin(a) * 440}`} stroke={P.yel} strokeWidth="14" strokeLinecap="round" opacity={SM(0.2, 0.6, t)} />; })}
    <Mug x={520} y={820 + Math.sin(T * 2) * 10} s={1.05} />
    <rect x="-20" y="1080" width="1120" height="300" fill="#8C5228" {...ink(8)} />
    {t > c2 && <RMChip x={540} y={1250} text="LUCKY. DEFINITELY." col={P.yel} size={50} pop={(t - c2) / 0.25} rot={-0.04} />}</g>);
}

/* 8 — payoff: Lila's coins go into a SAVINGS jar instead of more tickets — control she really has */
function RMRealControl({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4), f = SM(0.2, 2.2, t);
  return (<g><RMBg kind="blue" />
    <RMLila x={300} y={760} s={0.55} mouth="smile" brow="up" lid={0.15} look={[1, 0.6]} />
    <Jar x={790} y={1060} s={0.85} label="SAVINGS" fill={f} coins />
    {[0, 1, 2].map((i) => { const p = ((t * 0.9 + i / 3) % 1); return t > 0.2 && <ellipse key={i} cx={lp(470, 790, p)} cy={lp(1000, 900, p) - Math.sin(p * Math.PI) * 220} rx="34" ry="14" fill={P.yel} {...ink(4)} />; })}
    {t > c3 && <RMChip x={540} y={200} text="REAL CONTROL" col={P.yel} size={56} pop={(t - c3) / 0.25} />}</g>);
}

/* 9 — end: Lila keeps her lucky ticket pinned up, Otto shrugs; question + send chips */
function RMEndLucky({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0);
  return (<g><RMBg kind="dark" />
    <RMLila x={300} y={900} s={0.58} mouth="smile" brow="up" lid={0.15} look={[0.6, 0]} />
    <RMOtto x={790} y={900} s={0.58} mouth="smile" brow="flat" lid={0.35} look={[-0.6, 0]} />
    <Ticket x={540} y={1260} s={0.6} rot={-5} nums="12 · 07 · 19" heart />
    <RMChip x={540} y={170} text="WHAT'S YOUR LUCKY THING?" col={P.yel} size={42} pop={t / 0.25} />
    {t > c2 && <RMChip x={540} y={300} text="SEND IT TO THAT FRIEND" col={P.cream} size={40} pop={(t - c2) / 0.25} rot={0.03} />}</g>);
}

Object.assign(window, { RMOfficePool, RMNineDollars, RMSameOdds, RMHandedTwo, RMNameControl, RMLiftButton, RMLuckyMug, RMRealControl, RMEndLucky });
})();
