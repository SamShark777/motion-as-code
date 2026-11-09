// art.jsx — "That Compliment You Deleted Would Have Made Their Day" (Rosa ep. 5, with Dev; ted-MG motion graphics).
// Zhao & Epley 2021 (Psychological Science): people sending compliments underestimated how positive recipients would feel
// and overestimated how awkward it would be. No numbers on screen. Full 1080×1920 frames with tedmg-kit.jsx;
// captions at y ≈ 1480 — faces stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const ROSA = '#a46fd1', ROSA_SKIN = '#f2dccb', DEV = '#3f7fbf', DEV_SKIN = '#c99b74';
const DRAFT = 'your talk was amazing!';

// a chat phone (centre x,y): header "to", a message bubble with `msg`, optional sent bubble, blinking cursor
function ChatPhone({ x, y, s = 1, rot = 0, to = 'DEV', msg = '', sent = false, T = 0, flash = 0 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-210" y="-380" width="420" height="760" rx="54" fill="#18161d" stroke={K} strokeWidth="8" /><rect x="-186" y="-348" width="372" height="696" rx="34" fill="#f4efe4" />
    <rect x="-186" y="-348" width="372" height="90" rx="34" fill="#dcd3c3" /><text x="0" y="-290" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="34" fill="#1a1720">{to}</text>
    {sent ? <g><rect x="-150" y="-60" width="320" height="110" rx="34" fill="#3f7fbf" /><text x="10" y="8" textAnchor="middle" fontFamily={OS} fontWeight="500" fontSize="30" fill="#fff">{DRAFT}</text></g>
      : <g><rect x="-170" y="250" width="340" height="70" rx="30" fill="#fff" stroke="#cfc8bb" strokeWidth="4" />
        <text x="-150" y="296" fontFamily={OS} fontWeight="500" fontSize="28" fill="#1a1720">{msg}</text>
        {Math.sin(T * 8) > 0 && <rect x={-148 + msg.length * 13.5} y="266" width="4" height="40" fill={R} />}</g>}
    {flash > 0 && <rect x="-186" y="-348" width="372" height="696" rx="34" fill="#fff" opacity={flash} />}</g>);
}
function Heart({ x, y, s = 1, col = R }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 30 C-60 -10 -50 -60 -18 -60 C-6 -60 0 -50 0 -42 C0 -50 6 -60 18 -60 C50 -60 60 -10 0 30 Z" fill={col} stroke={K} strokeWidth="5" />;
}

/* 1 — Rosa close-up, phone in hand: the draft "your talk was amazing!" types, then gets deleted letter by letter */
function MGRosaDelete({ T, t, beats }) {
  const c2 = b(beats, 2, 1.5), n = t < c2 ? Math.floor(DRAFT.length * EO((t - 0.1) / 0.8)) : Math.max(0, Math.floor(DRAFT.length * (1 - (t - c2) / 0.9)));
  return (<g><MGBg kind="wall" c1="#e9d3f0" c2="#b48ac9" />
    <MGChip x={540} y={200} text="DRAFT · TO: DEV" outline size={44} pop={t / 0.25} />
    <MGBust x={330} y={760} r={150} who="rosa" mouth={t > c2 ? 'wave' : 'smile'} brow={t > c2 ? 'worried' : 'up'} look={[0.9, 0.6]} bl={BL(T)} sweat={t > c2 ? T : null} />
    <ChatPhone x={790} y={980} s={0.95} rot={6} msg={DRAFT.slice(0, n)} T={T} />
    <MGArm x1={540} y1={1300} x2={700} y2={1180} sleeve={ROSA} skin={ROSA_SKIN} w={60} />
    {t > c2 && <MGChip x={790} y={560} text="DELETE" col={R} txt="#fff" size={46} pop={(t - c2) / 0.25} />}</g>);
}

/* 2 — Rosa on the sofa, phone up; worry bubbles pop: TOO WEIRD? TOO MUCH? TOO AWKWARD */
function MGTooAwkward({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c3 = b(beats, 3, 1.8);
  return (<g><MGBg kind="room" />
    <MGPerson x={460} y={1180} s={2.6} who="rosa" mouth="wave" brow="worried" look={[0.5, 0.5]} bl={BL(T)} />
    <g transform="translate(560 960) rotate(-10)"><rect x="-34" y="-58" width="68" height="116" rx="12" fill="#18161d" stroke={K} strokeWidth="5" /><rect x="-26" y="-48" width="52" height="92" rx="6" fill="#bfe3f2" /></g>
    <MGBubble x={250} y={420} text="TOO WEIRD?" k={(t - c1) / 0.3} size={44} />
    <MGBubble x={800} y={360} text="TOO MUCH?" k={(t - c1 - 0.4) / 0.3} size={44} />
    {t > c3 && <MGChip x={560} y={590} text="TOO AWKWARD" col={R} txt="#fff" size={54} pop={(t - c3) / 0.25} />}</g>);
}

/* 3 — snapback: Rosa's giant head; the AWKWARD siren is only inside it (ring + arrows) */
function MGInYourHead({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4), on = Math.sin(T * 10) > 0;
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGHead x={540} y={780} r={250} who="rosa" mouth="o" brow="up" look={[0, -0.2]} bl={BL(T)} />
    <g transform="translate(540 470)"><rect x="-60" y="-10" width="120" height="50" rx="10" fill="#3a3a46" stroke={K} strokeWidth="6" />
      <path d="M-50 -10 Q-50 -100 0 -100 Q50 -100 50 -10 Z" fill={on ? R : '#8a2a22'} stroke={K} strokeWidth="6" />
      {on && <MGGlow x={0} y={-60} r={160} col="#ff6f5a" a={0.6} />}</g>
    <MGRing cx={540} cy={560} rx={320} ry={200} p={(t - c3) / 0.4} />
    {t > c3 && <MGChip x={540} y={1240} text="ONLY IN HERE" col={A} size={52} pop={(t - c3) / 0.25} />}</g>);
}

/* 4 — the study: journal chip; a heart card flies from a sender to a receiver */
function MGComplimentStudy({ T, t, beats }) {
  const c4 = b(beats, 4, 2.3), p = ((t * 0.7) % 1);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="PSYCHOLOGICAL SCIENCE · 2021" outline size={40} pop={t / 0.25} />
    <MGPerson x={240} y={1240} s={2.4} who={MG.extra(2)} mouth="flat" brow="worried" look={[1, 0]} bl={BL(T)} />
    <MGPerson x={840} y={1240} s={2.4} who={MG.extra(7)} mouth={p > 0.8 ? 'grin' : 'smile'} brow="up" look={[-1, 0]} bl={BL(T, 1)} />
    <g transform={`translate(${lp(320, 760, p)} ${780 - Math.sin(p * Math.PI) * 260})`}><rect x="-80" y="-56" width="160" height="112" rx="14" fill="#fff" stroke={K} strokeWidth="6" /><Heart x={0} y={10} s={0.8} /></g>
    <MGChip x={240} y={640} text="SENDER" size={40} pop={(t - 0.4) / 0.25} /><MGChip x={840} y={640} text="RECEIVER" size={40} pop={(t - 0.6) / 0.25} />
    {t > c4 && <MGChip x={540} y={330} text="REAL COMPLIMENTS" col={A} size={48} pop={(t - c4) / 0.25} />}</g>);
}

/* 5 — result: two bars, GUESSED (short) vs FELT (tall); the receiver grins on top */
function MGFeltBetter({ T, t, beats }) {
  const c2 = b(beats, 2, 1.2), g = EO((t - 0.2) / 0.8), g2 = EO((t - c2 + 0.2) / 0.9);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="HOW GOOD IT FELT" outline size={44} pop={t / 0.25} />
    {[[300, 0.35 * g, 'GUESSED', '#7a86b8'], [780, 0.9 * g2, 'REALLY FELT', A]].map(([x, h, w, col], i) => { const H = 620 * h;
      return (<g key={i}><rect x={x - 120} y={1300 - 620} width="240" height="620" rx="20" fill="#2a3150" stroke={K} strokeWidth="6" />
        <rect x={x - 120} y={1300 - H} width="240" height={H} rx="20" fill={col} stroke={K} strokeWidth="6" />
        <text x={x} y={1350} textAnchor="middle" fontFamily={BB} fontSize="60" fill="#fff">{w}</text>
        {i === 1 && H > 40 && <MGHead x={x} y={1300 - H - 95} r={80} who={MG.extra(7)} mouth="grin" brow="up" look={[0, 0]} bl={BL(T, 1)} />}</g>); })}
    {t > c2 && <MGChip x={780} y={330} text="WAY BETTER" col={R} txt="#fff" size={50} pop={(t - c2) / 0.25} />}</g>);
}

/* 6 — the cringe scale: a seesaw where CRINGE looks huge and JOY tiny, then it tips the other way */
function MGCringeScale({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1), tip = lp(-14, 14, EO((t - c2) / 0.6));
  return (<g><MGBg kind="wall" c1="#ffe2b8" c2="#f2a96a" />
    <MGChip x={540} y={200} text="WHAT WE EXPECT vs WHAT HAPPENS" outline size={36} pop={t / 0.25} />
    <path d="M540 1120 L470 1260 L610 1260 Z" fill="#5b5b66" stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <g transform={`rotate(${tip} 540 1110)`}><rect x="140" y="1095" width="800" height="30" rx="14" fill="#8c6b4f" stroke={K} strokeWidth="7" />
      <g transform="translate(260 1095)"><rect x={-lp(120, 60, EO((t - c2) / 0.6))} y={-lp(240, 120, EO((t - c2) / 0.6))} width={lp(240, 120, EO((t - c2) / 0.6))} height={lp(240, 120, EO((t - c2) / 0.6))} rx="20" fill={R} stroke={K} strokeWidth="7" />
        <text y={-lp(100, 45, EO((t - c2) / 0.6))} textAnchor="middle" fontFamily={BB} fontSize={lp(70, 40, EO((t - c2) / 0.6))} fill="#fff">CRINGE</text></g>
      <g transform="translate(820 1095)"><circle cy={-lp(60, 140, EO((t - c2) / 0.6))} r={lp(60, 140, EO((t - c2) / 0.6))} fill={A} stroke={K} strokeWidth="7" />
        <text y={-lp(48, 120, EO((t - c2) / 0.6))} textAnchor="middle" fontFamily={BB} fontSize={lp(40, 80, EO((t - c2) / 0.6))} fill={K}>JOY</text></g></g>
    <MGPerson x={170} y={1340} s={1.9} who="rosa" mouth={t > c2 + 0.6 ? 'grin' : 'o'} brow="up" look={[0, -1]} bl={BL(T)} /></g>);
}

/* 7 — self-proof: a sticky note memory "love your jacket!" glows above Rosa, years later */
function MGStillRemember({ T, t, beats }) {
  const c4 = b(beats, 5, 2.6);
  return (<g><MGBg kind="roomNight" /><MGGlow x={540} y={560} r={360} col="#fff3c4" a={0.35 + 0.1 * Math.sin(T * 2)} />
    <g transform={`translate(540 560) rotate(-4) scale(${BK((t - 0.2) / 0.4)})`}><rect x="-260" y="-120" width="520" height="240" fill="#ffe680" stroke={K} strokeWidth="7" />
      <text y="-10" textAnchor="middle" fontFamily={BB} fontSize="74" fill={K}>"LOVE YOUR</text><text y="70" textAnchor="middle" fontFamily={BB} fontSize="74" fill={K}>JACKET!"</text></g>
    <MGChip x={540} y={240} text="A STRANGER · YEARS AGO" outline size={40} pop={t / 0.25} />
    <MGBust x={540} y={1030} r={130} who="rosa" mouth="smile" brow="up" look={[0, -1]} bl={BL(T)} />
    {t > c4 && <MGChip x={540} y={820} text="STILL REMEMBER IT" col={A} size={44} pop={(t - c4) / 0.25} />}</g>);
}

/* 8 — Rosa hits send; Dev reads it, grins, and screenshots (white flash + "SAVED") */
function MGDevScreenshot({ T, t, beats }) {
  const c1 = b(beats, 1, 0.9), fl = t > c1 + 0.3 ? Math.max(0, 1 - (t - c1 - 0.3) / 0.3) : 0;
  return (<g><MGBg kind="wall" c1="#cfe3f5" c2="#7aa3cf" />
    <MGBust x={290} y={800} r={140} who="dev" mouth={t > c1 ? 'grin' : 'smile'} brow="up" look={[0.9, 0.7]} bl={BL(T)} />
    <ChatPhone x={790} y={950} s={0.9} rot={-5} to="ROSA" sent T={T} flash={fl} />
    <MGArm x1={500} y1={1320} x2={690} y2={1200} sleeve={DEV} skin={DEV_SKIN} w={60} />
    <MGChip x={540} y={200} text="DELIVERED" outline size={44} pop={t / 0.25} />
    {t > c1 + 0.3 && <MGChip x={790} y={460} text="SAVED TO PHOTOS" col={A} size={44} pop={(t - c1 - 0.3) / 0.25} />}</g>);
}

/* 9 — end: Rosa and Dev wave; a gift box with a heart pops between them; question + send chips */
function MGEndGift({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), c2 = b(beats, 2, 1.2), c4 = b(beats, 4, 2.3);
  return (<g><MGBg kind="party" T={T} />
    <MGPerson x={260} y={1300} s={2.4} who="rosa" mouth="grin" brow="up" look={[1, -0.2]} bl={BL(T)} />
    <MGPerson x={820} y={1300} s={2.4} who="dev" mouth="grin" brow="up" look={[-1, -0.2]} bl={BL(T, 1)} />
    <g transform={`translate(540 ${1180 + Math.sin(T * 3) * 8}) scale(${BK((t - c1) / 0.4)})`}><rect x="-110" y="-90" width="220" height="180" fill={R} stroke={K} strokeWidth="7" />
      <rect x="-20" y="-90" width="40" height="180" fill={A} stroke={K} strokeWidth="5" /><rect x="-130" y="-120" width="260" height="50" fill={R} stroke={K} strokeWidth="7" /><Heart x={0} y={-150} s={0.9} col={A} /></g>
    {t > c2 && <MGChip x={540} y={240} text="WHO DESERVES ONE?" col={A} size={50} pop={(t - c2) / 0.25} />}
    {t > c4 && <MGChip x={540} y={350} text="SEND IT TO THAT FRIEND" outline size={40} pop={(t - c4) / 0.25} />}</g>);
}

Object.assign(window, { MGRosaDelete, MGTooAwkward, MGInYourHead, MGComplimentStudy, MGFeltBetter, MGCringeScale, MGStillRemember, MGDevScreenshot, MGEndGift });
})();
