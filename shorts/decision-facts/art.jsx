// art.jsx — "3 Facts About How You Decide" (Theo ep. 2 / Dev ep. 2, ted-MG motion graphics).
// Full 1080×1920 frames with tedmg-kit.jsx. Props: T, t, dur, beats (chunk starts in the scene).
// Caption band y ≈ 1370–1590 (lines that need the space set capY). t can be negative before a scene starts.
(function () {
const { AMB: A, RED: R, INK: K, CREAM: CR, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const FONT = "'Bebas Neue', sans-serif", OSW = "'Oswald', sans-serif";
const LOBBY = { c1: '#6a2230', c2: '#34101a' };

// cinema popcorn bucket (bottom centre at x,y)
function Popcorn({ x, y, s = 1, a = 1, label = '', price = '' }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}>
    {[...Array(9)].map((_, i) => <circle key={i} cx={-70 + (i % 5) * 35 + (i > 4 ? 17 : 0)} cy={-215 - (i > 4 ? 30 : 0) + MG.hsh(i + 3) * 10} r={28} fill="#fff4c9" stroke={K} strokeWidth="5" />)}
    <path d="M-100 -200 L100 -200 L75 0 L-75 0 Z" fill="#fff" stroke={K} strokeWidth="7" strokeLinejoin="round" />
    {[-60, -10, 40].map((sx, i) => <path key={i} d={`M${sx} -200 L${sx + 25} -200 L${sx * 0.75 + 19} 0 L${sx * 0.75} 0 Z`} fill={R} />)}
    <path d="M-100 -200 L100 -200 L75 0 L-75 0 Z" fill="none" stroke={K} strokeWidth="7" strokeLinejoin="round" />
    {label && <text x="0" y="70" textAnchor="middle" fontFamily={FONT} fontSize="54" fill="#fff">{label}</text>}
    {price && <g transform="translate(0 135)"><rect x="-80" y="-40" width="160" height="72" rx="14" fill={A} stroke={K} strokeWidth="5" /><text x="0" y="16" textAnchor="middle" fontFamily={FONT} fontSize="54" fill={K}>{price}</text></g>}</g>);
}
// jam jar
const JAM = ['#c0392b', '#8e44ad', '#e67e22', '#d35490', '#6d2a3a', '#f1c40f'];
function Jar({ x, y, s = 1, i = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-42" y="-105" width="84" height="105" rx="16" fill={JAM[i % 6]} stroke={K} strokeWidth="6" />
    <rect x="-46" y="-128" width="92" height="28" rx="6" fill={['#f4efe4', '#e8b33e', '#d9534f'][i % 3]} stroke={K} strokeWidth="6" />
    <rect x="-28" y="-72" width="56" height="38" rx="5" fill="#f4efe4" stroke={K} strokeWidth="4" />
    <rect x="-30" y="-98" width="10" height="70" rx="5" fill="#fff" opacity="0.3" /></g>);
}
function Table({ y = 1180, cloth = '#d9534f' }) {
  return (<g><rect x="-300" y={y} width="1680" height="900" fill="#6b4a32" />
    <rect x="60" y={y - 20} width="960" height="380" fill={cloth} stroke={K} strokeWidth="7" />
    {[...Array(8)].map((_, i) => <rect key={i} x={60 + i * 120} y={y - 20} width="60" height="380" fill="#fff" opacity="0.35" />)}</g>);
}
// organ-donor form card
function Form({ x = 540, y = 380, ticked = false, k = 1, tickK = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}>
    <rect x="-370" y="-120" width="740" height="240" rx="22" fill="#f4efe4" stroke={K} strokeWidth="8" />
    <text x="-320" y="-30" fontFamily={OSW} fontWeight="700" fontSize="54" fill={K}>ORGAN DONOR?</text>
    <rect x="-320" y="10" width="76" height="76" rx="10" fill="#fff" stroke={K} strokeWidth="7" />
    {ticked && <path d="M-305 48 L-285 72 L-250 18" stroke="#2e9e5b" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${110 * cl(tickK)} 200`} />}
    <text x="-220" y="68" fontFamily={OSW} fontWeight="500" fontSize="40" fill="#555">{ticked ? 'YES (UNTICK TO LEAVE)' : 'TICK TO JOIN'}</text></g>);
}

/* 1 — hook: Dev, smug in the cinema lobby */
function DFHook({ T, t, beats }) {
  return (<g><MGBg kind="wall" {...LOBBY} />
    {[...Array(14)].map((_, i) => <circle key={i} cx={60 + i * 74} cy={110} r="13" fill="#ffd36e" opacity={0.5 + 0.5 * (Math.floor(T * 4 + i) % 2)} />)}
    <MGGlow x={540} y={700} r={600} col="#ffb36e" a={0.15} />
    <MGBust x={540} y={840} r={230} who="dev" brow="up" browUp={0.6} mouth={t > b(beats, 2) ? 'grin' : 'smile'} look={[0.4, 0]} bl={BL(T)} />
    <MGBubble x={560} y={560} text={"NOBODY TELLS|ME WHAT TO PICK."} k={(t - 0.2) / 0.3} size={48} />
    <MGChip x={540} y={250} text="CINEMA · 7:40 PM" outline size={44} pop={t / 0.25} /></g>);
}

/* 2 — Theo raises three fingers: three facts */
function DFTheo({ T, t, beats }) {
  const c = b(beats, 1);
  return (<g><MGBg kind="wall" c1="#2f4d3e" c2="#16261e" /><MGGlow x={760} y={400} r={500} col="#bfffd8" a={0.1} />
    <MGBust x={540} y={860} r={230} who="theo" brow="up" mouth="smile" look={[-0.3, 0]} bl={BL(T)} />
    {[0, 1, 2].map((i) => <MGChip key={i} x={300 + i * 240} y={400} text={String(i + 1)} size={90} pop={(t - c - i * 0.15) / 0.25} />)}
    <MGChip x={540} y={250} text="THEO · RETIRED TEACHER" outline size={38} pop={t / 0.25} /></g>);
}

/* 3 — fact one: opt-in form, 42% */
const ORDER = [0, 6, 12, 18, 2, 8, 14, 4, 10, 16, 1, 7, 13, 19, 3, 9, 15, 5, 11, 17];
function DFOrgan({ T, t, beats }) {
  const c = b(beats, 4), on = 8.4 * SM(c - 0.2, c + 0.4, t);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={240} text="JOHNSON & GOLDSTEIN · 2003" outline size={40} pop={t / 0.25} />
    <Form y={430} k={(t - b(beats, 1)) / 0.35} />
    <MGHeadGrid T={T} on={on} y0={680} dy={178} litOrder={ORDER} />
    {t > c - 0.1 && <MGBigNum y={1480} text={Math.round(on / 20 * 100) + '%'} size={180} label="SAID YES" />}</g>);
}

/* 4 — opt out: the same form, already ticked → 82% */
function DFOptOut({ T, t, beats }) {
  const c = b(beats, 2), on = lp(8.4, 16.4, SM(c - 0.3, c + 0.4, t));
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={240} text="SAME QUESTION · NEW DEFAULT" outline size={40} pop={t / 0.25} />
    <Form y={430} ticked tickK={(t - b(beats, 1)) / 0.3} />
    <MGHeadGrid T={T} on={on} y0={680} dy={178} litOrder={ORDER} />
    <MGBigNum y={1480} text={Math.round(on / 20 * 100) + '%'} size={180} col={t > c ? A : '#fff'} label="STAYED DONORS" /></g>);
}

/* 5 — fact two: 24 jams vs 6 jams */
function DFJam({ T, t, beats }) {
  const c3 = b(beats, 3), many = t < c3;
  const jars = many ? [...Array(24)].map((_, i) => [150 + (i % 8) * 112, 820 + Math.floor(i / 8) * 150, 0.95, i]) : [...Array(6)].map((_, i) => [230 + (i % 3) * 310, 860 + Math.floor(i / 3) * 230, 1.7, i]);
  const lt = many ? t : t - c3;
  return (<g><MGBg kind="wall" c1="#e8d2a8" c2="#c7a678" />
    <MGChip x={540} y={250} text="IYENGAR & LEPPER · 2000" outline size={40} pop={t / 0.25} />
    <MGChip x={540} y={380} text={many ? '24 JAMS' : '6 JAMS'} size={52} pop={lt / 0.25} />
    <rect x="60" y="1160" width="960" height="30" fill="#8c6a4a" stroke={K} strokeWidth="6" />
    {jars.map(([x, y, s, i], j) => <g key={(many ? 'm' : 's') + j} transform={`translate(0 ${(1 - EO((lt - j * 0.02) / 0.3)) * -300})`}><Jar x={x} y={y + (many ? 0 : 0)} s={s} i={i} /></g>)}
    <Table y={1190} />
    {many && t > b(beats, 2) && <MGBigNum y={1480} text="3%" size={180} label="BOUGHT" />}
    {!many && t > b(beats, 4) && <MGBigNum y={1480} text="30%" size={180} col={A} label="BOUGHT" />}</g>);
}

/* 6 — but: later studies — the jam result doesn't always hold */
function DFBut({ T, t, beats }) {
  const k = SM(0, 0.5, t), c = b(beats, 2);
  return (<g><g style={{ filter: `saturate(${1 - k * 0.8}) brightness(${1 - k * 0.25})` }}><MGBg kind="wall" c1="#e8d2a8" c2="#c7a678" />
      <rect x="60" y="1160" width="960" height="30" fill="#8c6a4a" stroke={K} strokeWidth="6" />
      {[...Array(6)].map((_, i) => <Jar key={i} x={230 + (i % 3) * 310} y={860 + Math.floor(i / 3) * 230} s={1.7} i={i} />)}
      <Table y={1190} /></g>
    <MGChip x={540} y={240} text="50 STUDIES LATER" size={50} pop={(t - 0.1) / 0.25} />
    <MGChip x={540} y={360} text="MIXED RESULTS" outline col="#ff8a7a" size={44} pop={(t - c) / 0.25} />
    <MGBubble x={760} y={700} text="?" k={(t - c - 0.15) / 0.3} size={90} /></g>);
}

/* 7 — fact three: the decoy — a worse medium makes the large look like a steal */
function DFDecoy({ T, t, beats }) {
  const c1 = b(beats, 1), c4 = b(beats, 5), mk = EO((t - c1) / 0.4), win = SM(c4 - 0.1, c4 + 0.3, t);
  return (<g><MGBg kind="dark" /><MGGlow x={540} y={900} r={700} col="#ff6f91" a={0.12} />
    <MGChip x={540} y={250} text="HUBER, PAYNE & PUTO · 1982" outline size={40} pop={t / 0.25} />
    <MGChip x={540} y={370} text="THE DECOY" size={48} pop={(t - c1) / 0.25} />
    <Popcorn x={200} y={980} s={0.85} label="SMALL" price="$4" a={1 - win * 0.5} />
    <g transform={`translate(0 ${(1 - mk) * -900})`}><Popcorn x={520} y={1000} s={1.05} label="MEDIUM" price="$7.50" a={mk > 0 ? 1 - win * 0.5 : 0} /></g>
    <g transform={`translate(840 1030) scale(${1 + win * 0.12}) translate(-840 -1030)`}>{win > 0 && <MGGlow x={840} y={850} r={330} col="#ffd36e" a={0.5 * win} />}<Popcorn x={840} y={1030} s={1.3} label="LARGE" price="$8" /></g>
    {win > 0 && <MGArrows x={840} y={840} t={t - c4} n={5} from={600} to={260} />}</g>);
}

/* 8 — name it: Theo, the three "architects" orbiting */
function DFName({ T, t, beats }) {
  const k = EO((t - b(beats, 1)) / 0.4);
  const items = [0, 1, 2].map((i) => { const a = T * 0.9 + i * 2.094; return [540 + Math.cos(a) * 370, 450 + Math.sin(a) * 80]; });
  return (<g><MGBg kind="wall" c1="#2f4d3e" c2="#16261e" />
    <MGChip x={540} y={200} text="PSYCHOLOGY" size={44} pop={t / 0.25} />
    <MGBust x={540} y={900} r={220} who="theo" brow="flat" mouth="smile" look={[0, -0.6]} bl={BL(T)} />
    <g opacity={k}>
      <g transform={`translate(${items[0][0]} ${items[0][1]}) scale(0.5)`}><Form x={0} y={0} ticked /></g>
      <Jar x={items[1][0]} y={items[1][1] + 60} s={1.3} i={1} />
      <Popcorn x={items[2][0]} y={items[2][1] + 110} s={0.65} /></g></g>);
}

/* 9 — payoff: Dev walks off with the large popcorn; Theo smiles */
function DFPayoff({ T, t, beats }) {
  const c = b(beats, 3), lt = Math.max(0, t);
  return (<g><MGBg kind="wall" {...LOBBY} />
    {[...Array(14)].map((_, i) => <circle key={i} cx={60 + i * 74} cy={110} r="13" fill="#ffd36e" opacity={0.5 + 0.5 * (Math.floor(T * 4 + i) % 2)} />)}
    <MGPerson x={830} y={1520} s={3.1} who="theo" brow="up" mouth={t > c ? 'grin' : 'smile'} look={[-1, 0]} bl={BL(T, 0.3)} />
    <MGPerson x={330} y={1520} s={3.5} who="dev" mouth={t < b(beats, 1) ? 'grin' : 'smile'} brow="up" look={[1, 0]} bl={BL(T)} />
    <g transform={`translate(0 ${OS(T, 1.4) * 4})`}><Popcorn x={560} y={1400} s={1.1} /></g>
    <MGChip x={540} y={260} text="LARGE · $8" size={48} pop={(t - b(beats, 2)) / 0.25} />
    {t > c && <MGRing cx={560} cy={1250} rx={175} ry={210} p={(t - c) / 0.45} />}</g>);
}

Object.assign(window, { DFHook, DFTheo, DFOrgan, DFOptOut, DFJam, DFBut, DFDecoy, DFName, DFPayoff });
})();
