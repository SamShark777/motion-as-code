// art.jsx — "5 Signs Your Texts Sound Meaner Than You Think" (Dev ep. 9, with Milo; ted-MG motion graphics, signs-list).
// Egocentrism over e-mail: Kruger, Epley, Parker & Ng 2005 (JPSP) — senders predicted ~78% of partners would read their
// sarcastic/serious tone right; over email partners got ~56% (chance = 50%). Numbers on screen sit above y 1300.
// Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const BLUE = '#3f7fbf', GREY = '#e2dccd';

/* "SIGN n OF 5" header + progress dots + a big faded numeral */
function SignHead({ n, t }) {
  return (<g><MGChip x={540} y={230} text={`SIGN ${n} OF 5`} outline size={44} pop={t / 0.25} />
    {[1, 2, 3, 4, 5].map((i) => <circle key={i} cx={540 + (i - 3) * 60} cy={330} r={i === n ? 18 : 12} fill={i <= n ? A : 'rgba(255,255,255,0.25)'} stroke={K} strokeWidth="4" />)}
    <text x={540} y={900} textAnchor="middle" fontFamily={BB} fontSize="560" fill="#fff" opacity="0.07">{n}</text></g>);
}
/* a big chat bubble: mine = blue right */
function Bub({ x, y, text, mine = true, k = 1, size = 64, w }) {
  if (k <= 0) return null;
  const W = w || text.length * size * 0.5 + 90, H = size * 1.7;
  return (<g transform={`translate(${x} ${y}) scale(${BK(cl(k))})`}>
    <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={H / 2} fill={mine ? BLUE : GREY} stroke={K} strokeWidth="7" />
    <path d={mine ? `M${W / 2 - 60} ${H / 2 - 6} L${W / 2 - 10} ${H / 2 + 34} L${W / 2 - 100} ${H / 2 - 4} Z` : `M${-W / 2 + 60} ${H / 2 - 6} L${-W / 2 + 10} ${H / 2 + 34} L${-W / 2 + 100} ${H / 2 - 4} Z`} fill={mine ? BLUE : GREY} stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <rect x={-W / 2 + 6} y={-H / 2 + 6} width={W - 12} height={H - 12} rx={H / 2 - 6} fill={mine ? BLUE : GREY} />
    <text y={size * 0.34} textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize={size} fill={mine ? '#fff' : K}>{text}</text></g>);
}
/* a hand-held phone with a chat: msgs = [[text, mine, at]] */
function ChatPhone({ x, y, s = 1, rot = 0, t, msgs, name = 'MILO', read = '' }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-250" y="-430" width="500" height="860" rx="60" fill="#18161d" stroke={K} strokeWidth="10" />
    <rect x="-222" y="-390" width="444" height="780" rx="40" fill="#f7f5f0" />
    <rect x="-222" y="-390" width="444" height="100" rx="40" fill={GREY} /><text x="0" y="-322" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="38" fill={K}>{name}</text>
    {msgs.map(([m, mine, at], i) => <Bub key={i} x={mine ? 30 : -30} y={-190 + i * 150} text={m} mine={mine} k={(t - at) / 0.3} size={42} />)}
    {read && <text x="200" y={-190 + (msgs.length - 1) * 150 + 80} textAnchor="end" fontFamily={OS} fontSize="26" fill="#8a8a96">{read}</text>}
  </g>);
}
/* a laughing emoji face */
function LaughFace({ x, y, r = 80, k = 1, T = 0 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y + osc(T, 0.4) * 4}) scale(${BK(cl(k))})`}><circle r={r} fill={A} stroke={K} strokeWidth="7" />
    <path d={`M${-r * 0.5} ${-r * 0.2} q${r * 0.15} ${-r * 0.2} ${r * 0.3} 0 M${r * 0.2} ${-r * 0.2} q${r * 0.15} ${-r * 0.2} ${r * 0.3} 0`} fill="none" stroke={K} strokeWidth="7" strokeLinecap="round" />
    <path d={`M${-r * 0.5} ${r * 0.1} Q0 ${r * 0.8} ${r * 0.5} ${r * 0.1} Z`} fill="#fff" stroke={K} strokeWidth="6" strokeLinejoin="round" />
    <ellipse cx={-r * 0.78} cy={-r * 0.05} rx={r * 0.14} ry={r * 0.22} fill="#8fd0f2" stroke={K} strokeWidth="4" /><ellipse cx={r * 0.78} cy={-r * 0.05} rx={r * 0.14} ry={r * 0.22} fill="#8fd0f2" stroke={K} strokeWidth="4" /></g>);
}

/* 1 — Dev, grinning, fires off "nice job, genius" */
function MGDevTexts({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c3 = b(beats, 3, 1.6);
  return (<g><MGBg kind="room" T={T} />
    <MGBust x={330} y={760} r={170} who="dev" look={[1, 0.6]} brow="up" mouth="grin" bl={BL(T)} />
    <ChatPhone x={780} y={950} s={0.74} rot={6} t={t} msgs={[['nice job, genius', true, c1]]} />
    <MGChip x={540} y={170} text="DEV · 6:12 PM" size={42} pop={t / 0.25} />
    {t > c3 && <LaughFace x={420} y={420} r={70} k={(t - c3) / 0.3} T={T} />}
    {t > c3 && <MGChip x={250} y={300} text="(JOKING)" outline size={36} pop={(t - c3) / 0.25} />}</g>);
}

/* 2 — Milo reads the same text as an insult */
function MGMiloInsult({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c2 = b(beats, 2, 1.2);
  return (<g><MGBg kind="roomNight" T={T} />
    <MGBust x={720} y={780} r={170} who="milo" look={[-1, 0.5]} brow="worried" mouth="wave" sweat={t > c1 ? T : null} bl={BL(T)} />
    <ChatPhone x={290} y={950} s={0.68} rot={-6} t={t} name="DEV" msgs={[['nice job, genius', false, -1]]} />
    {t > c1 && <MGRing cx={260} cy={830} rx={190} ry={70} p={(t - c1) / 0.4} />}
    {t > c1 && <MGBubble x={760} y={480} text="IS HE|MAD AT ME?" k={(t - c1) / 0.3} size={42} />}
    {t > c2 && <MGChip x={540} y={170} text="5 SIGNS YOU'RE DEV" size={44} pop={(t - c2) / 0.25} />}</g>);
}

/* 3 — snapback: the laughing voice lives in Dev's head; the text bubble that leaves him is flat */
function MGToneHead({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  const fly = EO((t - 0.3) / 0.9);
  return (<g><MGBg kind="wall" c1="#36507a" c2="#1c2a44" />
    <MGHead x={300} y={880} r={190} who="dev" look={[1, 0]} brow="up" mouth="grin" bl={BL(T)} />
    <g opacity={0.9}><circle cx={300} cy={880} r={250} fill="none" stroke={A} strokeWidth="6" strokeDasharray="18 16" /></g>
    <LaughFace x={300} y={560} r={80} T={T} />
    <MGChip x={300} y={430} text="IN HIS HEAD" outline size={34} pop={t / 0.25} />
    <Bub x={lp(420, 760, fly)} y={lp(880, 900, fly)} text="nice job, genius" mine size={44} k={fly * 1.2} />
    {t > c3 && <MGChip x={780} y={1060} text="TONE: NOT INCLUDED" size={36} pop={(t - c3) / 0.25} />}</g>);
}

/* sign 1 — "ok." with a red ring around the full stop */
function MGSignT1({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9);
  return (<g><MGBg kind="navy" /><SignHead n={1} t={t} />
    <Bub x={540} y={820} text="ok." size={170} w={520} k={(t - 0.1) / 0.3} />
    {t > c2 && <MGRing cx={680} cy={860} rx={70} ry={70} p={(t - c2) / 0.4} />}
    {t > c2 && <MGChip x={540} y={1150} text="FEELS COLD" outline size={40} pop={(t - c2 - 0.2) / 0.25} />}</g>);
}

/* sign 2 — the joke, with an empty dotted slot where the emoji should be */
function MGSignT2({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7);
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" /><SignHead n={2} t={t} />
    <Bub x={480} y={760} text="you're SO funny" size={64} k={(t - 0.1) / 0.3} />
    <circle cx={900} cy={760} r="80" fill="none" stroke="#fff" strokeWidth="7" strokeDasharray="16 14" opacity={0.4 + 0.4 * Math.abs(osc(T, 1.2))} />
    <text x={900} y={790} textAnchor="middle" fontFamily={BB} fontSize="90" fill="#fff" opacity="0.6">?</text>
    {t > c1 && <MGChip x={540} y={1080} text="NO EMOJI = SERIOUS?" size={38} pop={(t - c1) / 0.25} />}</g>);
}

/* sign 3 — after sending: Dev squints at the screen, rereading, "Delivered" under it */
function MGSignT3({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9);
  return (<g><MGBg kind="roomNight" T={T} /><SignHead n={3} t={t} />
    <ChatPhone x={540} y={980} s={0.72} t={t + 5} name="SAM" msgs={[['cool. whatever.', true, 0]]} read="Delivered" />
    <MGHead x={540} y={480} r={110} who="dev" look={[0, 1]} brow="worried" mouth="flat" bl={0.45} />
    {t > c2 && <MGChip x={540} y={1250} text="REREAD × 7" size={40} pop={(t - c2) / 0.25} />}</g>);
}

/* sign 4 — the reply is just "what?" */
function MGSignT4({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6);
  return (<g><MGBg kind="navy" /><SignHead n={4} t={t} />
    <Bub x={600} y={640} text="lol you wish" size={56} k={(t - 0.05) / 0.3} />
    {t > c1 && <Bub x={420} y={900} text="what?" mine={false} size={110} k={(t - c1) / 0.3} />}
    {t > c1 + 0.4 && <MGHead x={880} y={1160} r={100} who="dev" look={[-1, -0.6]} brow="worried" mouth="o" bl={BL(T)} />}</g>);
}

/* sign 5 — Dev, thumbs up, sure they'll know he's kidding; a dotted bubble of "obviously" */
function MGSignT5({ T, t, beats }) {
  const c1 = b(beats, 1, 0.8);
  return (<g><MGBg kind="room" T={T} /><SignHead n={5} t={t} />
    <MGPerson x={540} y={1300} s={3.2} who="dev" look={[0, 0]} brow="up" mouth="grin" bl={BL(T)} />
    <g transform={`translate(${655} ${1040}) scale(${BK(cl((t - 0.3) / 0.3))})`}><circle r="56" fill="#c99b74" stroke={K} strokeWidth="7" /><rect x="-14" y="-110" width="34" height="70" rx="16" fill="#c99b74" stroke={K} strokeWidth="7" /></g>
    {t > c1 && <MGBubble x={360} y={640} text="THEY'LL|KNOW." k={(t - c1) / 0.3} size={46} />}</g>);
}

/* study 2005 — sender cards: "THEY'LL GET MY TONE" → 78% */
function MGToneStudy({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1);
  const n = Math.round(78 * EO((t - c2 + 0.3) / 0.8));
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="EMAIL STUDY · 2005" size={42} pop={t / 0.25} />
    {[0, 1, 2].map((i) => { const k = EO((t - 0.2 - i * 0.15) / 0.4);
      return (<g key={i} transform={`translate(${260 + i * 280} ${lp(1300, 520, k)}) rotate(${(i - 1) * 6})`}><rect x="-110" y="-75" width="220" height="150" rx="12" fill="#fbf7ee" stroke={K} strokeWidth="7" />
        <path d="M-110 -75 L0 15 L110 -75" fill="none" stroke={K} strokeWidth="7" strokeLinejoin="round" /></g>); })}
    <MGBigNum x={540} y={1040} text={`${Math.max(0, n)}%`} col={A} label="SENDERS' GUESS" size={260} />
    <MGHead x={880} y={1220} r={80} who="dev" look={[-1, -0.5]} brow="up" mouth="grin" bl={BL(T)} /></g>);
}

/* result — the real score, 56%, next to a coin flip; you hear your voice, they don't */
function MGCoinFlip({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0), c4 = b(beats, 4, 2.1);
  const flip = Math.abs(Math.cos(T * 9));
  return (<g><MGBg kind="dark" />
    <MGBigNum x={330} y={640} text="56%" col="#fff" label="REAL SCORE" size={220} />
    <g transform={`translate(800 ${520 - Math.abs(Math.sin(T * 3)) * 120})`}><ellipse rx={110} ry={110 * Math.max(0.08, flip)} fill={A} stroke={K} strokeWidth="8" /></g>
    <MGChip x={800} y={710} text="COIN FLIP: 50%" outline size={32} pop={(t - 0.3) / 0.25} />
    {t > c2 && <g><MGHead x={300} y={1080} r={110} who="dev" look={[1, 0]} brow="up" mouth="grin" bl={BL(T)} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${430 + i * 30} ${1020 - i * 10} q30 60 0 120`} fill="none" stroke={A} strokeWidth="8" strokeLinecap="round" opacity={0.5 + 0.5 * Math.abs(osc(T, 0.7, i * 0.2))} />)}</g>}
    {t > c4 && <g><MGHead x={800} y={1080} r={110} who="milo" look={[-1, 0]} brow="worried" mouth="flat" bl={BL(T, 0.4)} />
      <MGChip x={800} y={900} text="NO VOICE" outline size={32} pop={(t - c4) / 0.25} /></g>}</g>);
}

/* payoff — Dev sends a laugh-face; Milo cracks up */
function MGLaughFace({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c2 = b(beats, 2, 1.2);
  return (<g><MGBg kind="roomNight" T={T} />
    <ChatPhone x={330} y={880} s={0.66} rot={-5} t={t} name="DEV" msgs={[['nice job, genius', false, -1]]} />
    <LaughFace x={420} y={1000} r={70} k={(t - c1) / 0.3} T={T} />
    <MGBust x={790} y={760} r={150} who="milo" look={[-0.8, 0.6]} brow="up" mouth={t > c2 ? 'grin' : 'o'} bl={t > c2 ? 0.8 : BL(T)} />
    {t > c2 && <MGChip x={790} y={460} text="HA! OK, GENIUS." size={40} pop={(t - c2) / 0.25} />}</g>);
}

/* end — five ticked boxes; question + send chips */
function MGEndTextChecks({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1);
  const items = ['FULL STOP', 'NO EMOJI', 'REREAD', "'WHAT?'", "THEY'LL KNOW"];
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="HOW MANY DID YOU CHECK?" size={44} pop={t / 0.25} />
    {items.map((it, i) => { const k = (t - 0.2 - i * 0.18) / 0.25, y = 380 + i * 165;
      return (<g key={i}><rect x={200} y={y - 50} width="100" height="100" rx="16" fill="#fff" stroke={K} strokeWidth="7" />
        {k > 0 && <path d={`M${220} ${y} L${245} ${y + 28} L${285} ${y - 32}`} fill="none" stroke="#5fbf7a" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity={cl(k)} />}
        <text x={340} y={y + 26} fontFamily={BB} fontSize="80" letterSpacing="3" fill="#fff">{it}</text></g>); })}
    {t > c2 && <MGChip x={540} y={1270} text="SEND IT" size={46} pop={(t - c2) / 0.25} />}</g>);
}

Object.assign(window, { MGDevTexts, MGMiloInsult, MGToneHead, MGSignT1, MGSignT2, MGSignT3, MGSignT4, MGSignT5, MGToneStudy, MGCoinFlip, MGLaughFace, MGEndTextChecks });
})();
