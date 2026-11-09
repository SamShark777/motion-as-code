// art.jsx — "Want Someone to Like You? Ask Them for a Favour" (Arthur ep. 8, with Otto; retro modern illustration).
// Ben Franklin effect: Jecker & Landy 1969 (Human Relations) — participants the experimenter personally asked to return
// their winnings liked him more than those not asked or asked by a secretary. Franklin's borrowed-book story is from his
// autobiography. No numbers on screen. Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540 — faces stay
// out of y 1420–1660.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const BEB = "'Bebas Neue', sans-serif";
const PROF = { kind: 'human', skin: P.pink, skinD: P.pinkD, hair: 'bald', hairCol: P.blk, moustache: true, jacket: P.cream };

function Heart({ x, y, s = 1, col = P.pink }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 30 C-60 -10 -50 -60 -18 -60 C-6 -60 0 -50 0 -42 C0 -50 6 -60 18 -60 C50 -60 60 -10 0 30 Z" fill={col} {...ink(5)} />;
}
function Book({ x, y, s = 1, rot = 0, label = 'RARE' }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x="-130" y="-90" width="260" height="180" fill={P.blue} {...ink(7)} />
    <rect x="-118" y="-78" width="236" height="156" fill="none" stroke={P.yel} strokeWidth="4" /><path d="M0 -90 L0 90" {...ink(5)} />
    <text x="64" y="16" textAnchor="middle" fontFamily={BEB} fontSize="44" letterSpacing="3" fill={P.yel}>{label}</text></g>);
}
function Coin({ x, y, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx="70" ry="26" cy="14" fill={P.redD} {...ink(5)} /><ellipse rx="70" ry="26" fill={P.yel} {...ink(5)} /><text y="10" textAnchor="middle" fontFamily={BEB} fontSize="32" fill={P.blk}>$</text></g>);
}
function Pen({ x, y, rot = -30, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x="-110" y="-16" width="200" height="32" fill={P.yel} {...ink(5)} /><path d="M90 -16 L140 0 L90 16 Z" fill={P.cream} {...ink(5)} /><rect x="-110" y="-16" width="40" height="32" fill={P.red} {...ink(5)} /></g>);
}

/* 1 — Otto's office door, ajar: Otto at his desk ignoring everyone; Arthur outside, hand raised to knock */
function RMOttoDoor({ T, t, beats }) {
  const c3 = bt(beats, 3, 1.4), knock = Math.max(0, Math.sin(T * 7)) * 18;
  return (<g><RMBg kind="redDark" />
    <rect x="470" y="300" width="560" height="1000" fill={P.blk} /><rect x="500" y="330" width="500" height="970" fill={P.yel} />
    <RMOtto x={760} y={700} s={0.55} mouth="frown" brow="angry" lid={0.55} look={[1, 0.6]} />
    <rect x="500" y="1050" width="500" height="250" fill={P.cream} {...ink(6)} />
    <path d="M470 300 L470 1300 L330 1360 L330 260 Z" fill={P.red} {...ink(7)} />
    <rect x="560" y="200" width="380" height="80" fill={P.cream} {...ink(6)} /><text x="750" y="258" textAnchor="middle" fontFamily={BEB} fontSize="58" letterSpacing="5" fill={P.blk}>OTTO · BOSS</text>
    <RMArthur x={260} y={980} s={0.7} mouth="flat" brow="sad" lid={0.25} look={[1, 0]} stress />
    <g transform={`translate(${430 + knock * 0.3} ${780 - knock})`}><circle r="44" fill={P.pink} {...ink(6)} /></g>
    {t > c3 && <RMChip x={760} y={1180} text="DO NOT DISTURB" col={P.cream} size={40} pop={(t - c3) / 0.25} rot={0.04} />}
    <RMChip x={260} y={170} text="NEEDS: A FAVOUR" pop={t / 0.25} /></g>);
}

/* 2 — Arthur staggers under a tower of boxes rather than ask; "I'LL DO IT MYSELF" */
function RMRatherStruggle({ T, t, beats }) {
  const wob = Math.sin(T * 3) * 0.05;
  return (<g><RMBg kind="red" />
    <RMArthur x={540} y={1060} s={0.62} mouth="frown" brow="sad" lid={0.3} look={[0, -1]} stress />
    <g transform={`rotate(${wob * 57} 540 760)`}>{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${540 + (i % 2 ? 30 : -20)} ${700 - i * 130})`}><rect x="-150" y="-60" width="300" height="120" fill="#C9965A" {...ink(7)} /><path d="M-150 -10 L150 -10" {...ink(4)} /></g>)}</g>
    <RMSpeech x={560} y={180} text="I'LL DO IT MYSELF" size={64} k={(t - 0.5) / 0.3} col={P.yel} />
    <g transform="translate(860 1240)"><RMChip x={0} y={0} text="ASK? NEVER." col={P.cream} size={38} pop={(t - bt(beats, 2, 1.2)) / 0.25} rot={0.05} /></g></g>);
}

/* 3 — snapback: Otto's face softens; pink hearts float up as a LIKE YOU MORE chip pops */
function RMSnapMore({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.1);
  return (<g><RMBg kind="blue" />
    <RMOtto x={540} y={860} s={0.95} mouth={t > c2 ? 'smile' : 'flat'} brow={t > c2 ? 'up' : 'flat'} lid={t > c2 ? 0.15 : 0.5} look={[0, 0]} />
    {t > c2 && [0, 1, 2, 3].map((i) => { const ph = ((t - c2) * 0.6 + i * 0.25) % 1; return <Heart key={i} x={240 + i * 200} y={560 - ph * 380} s={0.9 + hsh(i) * 0.5} col={i % 2 ? P.pink : P.yel} />; })}
    {t > c2 && <RMChip x={540} y={1330} text="LIKE YOU MORE" col={P.yel} size={58} pop={(t - c2) / 0.25} rot={-0.04} />}</g>);
}

/* 4 — Franklin's book: a rare book passes from one hand to another across a desk; autobiography chip */
function RMFranklinBook({ T, t, beats }) {
  const c3 = bt(beats, 4, 1.8), p = EO((t - 0.3) / 1.2);
  return (<g><RMBg kind="redDark" />
    <RMChip x={540} y={200} text="FRANKLIN'S AUTOBIOGRAPHY" col={P.cream} size={42} pop={t / 0.25} />
    <RMGrid x={140} y={420} w={800} h={540} />
    <g transform="translate(540 690)"><text y="-130" textAnchor="middle" fontFamily={BEB} fontSize="64" letterSpacing="6" fill={P.blk}>"MAY I BORROW IT?"</text></g>
    <RMHand x={lp(220, 520, p)} y={980} s={0.6} rot={-0.9} col={P.blue} />
    <RMHand x={900} y={1000} s={0.6} rot={0.9} col={P.cream} />
    <Book x={lp(780, 560, p)} y={1180} s={1.1} rot={lp(8, -6, p)} />
    {t > c3 && <RMChip x={540} y={1360} text="RIVAL → FRIEND" col={P.yel} size={48} pop={(t - c3) / 0.25} />}</g>);
}

/* 5 — the study: journal chip; a pile of prize coins on lab grid paper */
function RMPrizeMoney({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.4);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={200} text="HUMAN RELATIONS · 1969" col={P.cream} size={44} pop={t / 0.25} />
    <RMGrid x={140} y={420} w={800} h={820} />
    {[...Array(9)].map((_, i) => <Coin key={i} x={380 + (i % 3) * 160 + hsh(i) * 20} y={lp(300, 980 - Math.floor(i / 3) * 70, EO((t - 0.2 - i * 0.08) / 0.5))} s={1} />)}
    {t > c2 && <RMChip x={540} y={560} text="PRIZE MONEY" col={P.yel} size={56} pop={(t - c2) / 0.25} rot={-0.03} />}</g>);
}

/* 6 — result: the researcher asks for the money back in person; afterwards a heart floats over the giver */
function RMGaveBack({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.3), p = EO((t - 0.3) / 0.8);
  return (<g><RMBg kind="red" />
    <RMHuman x={290} y={860} s={0.55} who={PROF} mouth="smile" brow="up" lid={0.2} look={[1, 0]} />
    <RMHuman x={800} y={900} s={0.55} who={{ ...PROF, skin: P.yel, skinD: '#D9A62A', hair: 'bob', hairCol: P.blue, moustache: false, lips: true, jacket: P.green }} mouth={t > c2 ? 'smile' : 'flat'} brow="flat" lid={0.25} look={[-1, 0]} />
    <Coin x={lp(760, 360, p)} y={lp(1180, 1150, p)} s={1.1} />
    <RMChip x={290} y={330} text="'IT'S MY OWN MONEY...'" col={P.cream} size={36} pop={(t - 0.1) / 0.25} />
    {t > c2 && <g><Heart x={800} y={380 - (t - c2) * 40} s={1.4} col={P.yel} /><RMChip x={540} y={1340} text="LIKED HIM BETTER" col={P.yel} size={54} pop={(t - c2) / 0.25} /></g>}</g>);
}

/* 7 — name it: BEN FRANKLIN EFFECT, the borrowed book spinning slowly below */
function RMNameFranklin({ T, t }) {
  return (<g><RMBg kind="blue" />
    <RMTitle lines={[['THE BEN', P.cream, 150], ['FRANKLIN', P.yel, 190], ['EFFECT', P.cream, 150]]} y={260} a={EO((t - 0.15) / 0.35)} />
    <Book x={540} y={1120 + Math.sin(T * 2) * 14} s={1.5} rot={Math.sin(T) * 6} label="BORROWED" /></g>);
}

/* 8 — the theory: Arthur's brain sparks a cyan bolt: "I HELPED HIM... SO I MUST LIKE HIM" */
function RMHelpedHim({ T, t, beats }) {
  const c3 = bt(beats, 4, 1.8);
  return (<g><RMBg kind="redDark" />
    <RMBrain cx={540} cy={1080} w={480} h={420} />
    {[0, 1, 2].map((i) => <RMBolt key={i} x={440 + i * 100} y={900} len={180} ang={-Math.PI / 2 + (i - 1) * 0.4} seed={i + 2} T={T} />)}
    <RMSpeech x={540} y={300} text="I HELPED HIM..." size={70} k={(t - 0.3) / 0.3} col={P.cream} />
    {t > c3 - 0.3 && <RMSpeech x={540} y={560} text="SO I LIKE HIM?" size={74} k={(t - c3 + 0.3) / 0.3} col={P.yel} rot={0.05} />}</g>);
}

/* 9 — Arthur borrows Otto's pen; next day Otto beams and says HELLO */
function RMBorrowPen({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.2), day2 = t > c2;
  return (<g><RMBg kind={day2 ? 'blue' : 'red'} />
    <RMArthur x={280} y={900} s={0.6} mouth="smile" brow="up" lid={0.2} look={[1, 0]} />
    <RMOtto x={800} y={900} s={0.6} mouth={day2 ? 'open' : 'flat'} brow={day2 ? 'up' : 'flat'} lid={day2 ? 0.1 : 0.45} look={[-1, 0]} />
    {!day2 && <Pen x={lp(700, 420, EO((t - 0.2) / 0.6))} y={1150} rot={-20} />}
    <RMChip x={540} y={180} text={day2 ? 'NEXT DAY' : 'MAY I BORROW YOUR PEN?'} col={day2 ? P.yel : P.cream} size={40} pop={day2 ? (t - c2) / 0.25 : t / 0.25} />
    {day2 && <RMSpeech x={760} y={420} text="HELLO!" size={100} k={(t - c2 - 0.3) / 0.3} col={P.yel} />}</g>);
}

/* 10 — end: Arthur and Otto side by side, both smiling; question + send chips */
function RMEndSmallAsk({ T, t, beats }) {
  const c2 = bt(beats, 2, 1.0), c4 = bt(beats, 4, 1.9);
  return (<g><RMBg kind="red" />
    <RMArthur x={300} y={930} s={0.62} mouth="smile" brow="up" lid={0.15} look={[0.6, 0]} />
    <RMOtto x={790} y={930} s={0.62} mouth="smile" brow="up" lid={0.15} look={[-0.6, 0]} />
    <Pen x={790} y={1290} rot={-10} s={0.9} />
    <RMChip x={540} y={170} text="SMALL ASK · BIG WIN" pop={t / 0.25} />
    {t > c2 && <RMChip x={540} y={300} text="WOULD YOU DARE ASK?" col={P.cream} size={46} pop={(t - c2) / 0.25} rot={0.03} />}
    {t > c4 && <RMChip x={540} y={1330} text="SEND IT TO THAT FRIEND" col={P.yel} size={40} pop={(t - c4) / 0.25} />}</g>);
}

Object.assign(window, { RMOttoDoor, RMRatherStruggle, RMSnapMore, RMFranklinBook, RMPrizeMoney, RMGaveBack, RMNameFranklin, RMHelpedHim, RMBorrowPen, RMEndSmallAsk });
})();
