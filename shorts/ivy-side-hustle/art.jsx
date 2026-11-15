// art.jsx — "I Turned My Hobby Into a Side Hustle for 6 Weeks" (Ivy ep. 1, experiment log; Gus cameo).
// Overjustification effect: Lepper, Greene & Nisbett 1973 (JPSP) — preschoolers who already liked drawing; those promised a
// "Good Player" certificate (gold seal, ribbon) later spent about half as much free time drawing (≈8.6% vs ≈16.7% no award,
// ≈18.1% unexpected award). Bars on screen are relative, no % printed. Each scene draws ONLY the 1080×608 panel (xplog-kit.jsx).
(function () {
const { ACC: A, RED: R, INK: K, CREAM: C, NAVY: N, GREY: G, GREEN: GR, clamp: cl, eo: EO, osc: OS, hsh, beat: B } = XL;

/* a sketchbook with a little doodle (a smiling sun); open = 1 open, 0 closed */
function Sketchbook({ x, y, s = 1, open = 1, T = 0, tag }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {open ? (<g><rect x="-230" y="-150" width="460" height="300" rx="14" fill="#fff" stroke={K} strokeWidth="7" /><line x1="0" y1="-150" x2="0" y2="150" stroke={K} strokeWidth="5" />
      <circle cx="-115" cy="-10" r="52" fill="none" stroke={K} strokeWidth="6" /><path d="M-140 -20 v4 M-90 -20 v4 M-140 14 Q-115 34 -90 14" stroke={K} strokeWidth="6" fill="none" strokeLinecap="round" />
      {[...Array(8)].map((_, i) => { const a = i / 8 * Math.PI * 2; return <line key={i} x1={-115 + Math.cos(a) * 66} y1={-10 + Math.sin(a) * 66} x2={-115 + Math.cos(a) * 88} y2={-10 + Math.sin(a) * 88} stroke={A} strokeWidth="7" strokeLinecap="round" />; })}
      <path d={`M40 60 Q90 ${-20 + OS(T, 1.2) * 10} 140 40 T 200 -40`} fill="none" stroke={N} strokeWidth="6" strokeLinecap="round" /></g>)
      : (<g><rect x="-230" y="-150" width="460" height="300" rx="14" fill="#6B4BC2" stroke={K} strokeWidth="7" /><rect x="-200" y="-150" width="22" height="300" fill="#4B3392" /></g>)}
    {tag && <g transform="rotate(-8)"><rect x="40" y="70" width="190" height="70" rx="10" fill={A} stroke={K} strokeWidth="6" /><XLText x={135} y={117} size={30} fill={K} anchor="middle">{tag}</XLText></g>}
  </g>);
}
function Pencil({ x, y, rot = -35, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x="-14" y="-150" width="28" height="150" fill={A} stroke={K} strokeWidth="6" /><path d="M-14 0 L0 36 L14 0 Z" fill="#F4D3BC" stroke={K} strokeWidth="6" strokeLinejoin="round" /><rect x="-14" y="-170" width="28" height="22" fill="#F09089" stroke={K} strokeWidth="6" /></g>);
}
function Tag({ x, y, text, k = 1, rot = 0 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${XL.back(cl(k))})`}><path d="M-60 -34 H50 L80 0 L50 34 H-60 Z" fill={R} stroke={K} strokeWidth="5" strokeLinejoin="round" />
    <circle cx="48" cy="0" r="7" fill="#fff" stroke={K} strokeWidth="3" /><XLText x={-8} y={12} size={32} anchor="middle">{text}</XLText></g>);
}

/* 1 — Ivy at her desk at night, happily drawing: JUST FOR FUN */
function XHHobby({ T, t, beats }) {
  return (<g><XLBg kind="room" /><XLGlow x={640} y={430} r={300} col={A} a={0.35} />
    <XLChar x={420} y={300} s={1.05} who="ivy" mood="smile" look={[8, 10]} bl={T % 3.6 > 3.45 ? 1 : 0} />
    <Sketchbook x={720} y={420} s={0.62} T={T} /><g transform={`translate(${OS(T, 0.6) * 14} 0)`}><Pencil x={800} y={440} s={0.7} /></g>
    <XLPop t={t} at={B(beats, 2)}><XLChip x={840} y={110} text="JUST FOR FUN" fill={A} col={K} size={30} rot={4} /></XLPop></g>);
}
/* 2 — a friend's message: YOU SHOULD SELL THESE */
function XHSell({ t, beats }) {
  return (<XLChat name="A FRIEND" status="8:02 PM"><XLPop t={t} at={0.1}><XLBubble x={175} y={140} w={520} lines={['OMG THESE ARE SO GOOD']} size={30} /></XLPop>
    <XLPop t={t} at={B(beats, 1) - 0.05}><XLBubble x={175} y={250} w={600} lines={['YOU SHOULD SELL THESE!!']} size={34} /></XLPop>
    <XLPop t={t} at={B(beats, 1) + 0.4}><XLText x={760} y={410} size={60} fill={A}>$ $ $</XLText></XLPop></XLChat>);
}
/* 3 — snapback: the sketchbook under a price tag; a red stamp lands */
function XHKills({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" /><Sketchbook x={480} y={300} s={0.95} T={T} />
    <Tag x={760} y={140} text="$25" k={(t - 0.2) / 0.3} rot={12} />
    <XLPop t={t} at={B(beats, 2)}><XLStamp x={540} y={330} text="FUN: FADING?" size={64} rot={-8} /></XLPop></g>);
}
/* 4 — day one: phone lights up, NEW ORDER #001 */
function XHFirstOrder({ T, t, beats }) {
  return (<g><XLBg kind="wall" /><XLGlow x={540} y={304} r={360} col={A} a={0.4} />
    <XLChar x={230} y={300} s={0.95} who="ivy" mood="wide" look={[16, 0]} />
    <XLPhone x={640} y={304} w={250} h={440} rot={-6} lit><XLText x={109} y={90} size={30} fill={N} anchor="middle">IVY'S SHOP</XLText>
      <XLPop t={t} at={B(beats, 2) - 0.1}><XLCard x={12} y={140} w={194} h={150} r={16} fill="#fff" sw={5} /><XLText x={109} y={190} size={22} fill={K} anchor="middle">NEW ORDER</XLText>
        <XLText x={109} y={232} size={30} fill={R} anchor="middle">#001</XLText><XLText x={109} y={272} size={26} fill={GR} anchor="middle">$25</XLText></XLPop></XLPhone>
    {t > B(beats, 2) && [...Array(14)].map((_, i) => { const u = t - B(beats, 2); return <rect key={i} x={640 + (hsh(i) - 0.5) * 700 * EO(u / 0.8)} y={300 - 260 * EO(u / 0.6) + u * u * 260 * hsh(i + 5)} width="18" height="10" fill={[A, R, GR, '#fff'][i % 4]} transform={`rotate(${i * 40 + u * 300} ${640} ${300})`} />; })}</g>);
}
/* 5 — day three: the client wants it MORE FUN */
function XHRevision({ t, beats }) {
  return (<XLChat name="CLIENT #001" status="DAY 3"><XLBubble x={175} y={140} w={560} lines={['LOVE IT! SMALL THING…']} size={30} />
    <XLPop t={t} at={B(beats, 2) - 0.1}><XLBubble x={175} y={245} w={640} lines={['CAN YOU MAKE IT', 'MORE… FUN?']} size={34} /></XLPop>
    <XLPop t={t} at={B(beats, 2) + 0.3}><XLChip x={850} y={420} text="REVISION 1/∞" size={24} rot={-6} /></XLPop></XLChat>);
}
/* 6 — week two: drawing against the clock */
function XHDeadline({ T, t, beats }) {
  return (<g><XLBg kind="wall" /><XLChar x={260} y={290} s={1.0} who="ivy" mood="worried" look={[18, 4]} sweat />
    <XLStopwatch x={760} y={330} r={190} text={'4' + (8 - Math.min(7, Math.floor(t * 2))) + 'H'} />
    <XLPop t={t} at={B(beats, 2)}><XLChip x={760} y={80} text="DUE FRIDAY" size={30} /></XLPop></g>);
}
/* 7 — week four: every doodle on the wall gets a red price tag */
function XHPriceTags({ T, t, beats }) {
  const prices = ['$5', '$10', '$15', '$8', '$20', '$12'];
  return (<g><XLBg kind="wallDark" />
    {prices.map((p, i) => { const x = 160 + (i % 3) * 300, y = 90 + Math.floor(i / 3) * 250; return (<g key={i}>
      <XLCard x={x} y={y} w={200} h={180} r={10} fill="#fff" sw={6} rot={(i % 2 ? 3 : -3)} />
      <circle cx={x + 100} cy={y + 90} r={40 - (i % 3) * 6} fill="none" stroke={K} strokeWidth="6" /><path d={`M${x + 60} ${y + 140} q40 -30 80 0`} fill="none" stroke={N} strokeWidth="6" />
      <Tag x={x + 170} y={y + 30} text={p} k={(t - B(beats, 2) + 0.3 - i * 0.12) / 0.3} rot={14} /></g>); })}</g>);
}
/* 8 — week six: free Sunday, sketchbook closed, pen untouched, Ivy on the sofa */
function XHSunday({ T, t, beats }) {
  return (<g><XLBg kind="woodDark" />
    <XLChar x={260} y={300} s={1.0} who="ivy" mood="sleepy" look={[0, 0]} />
    <Sketchbook x={720} y={380} s={0.6} open={0} /><Pencil x={720} y={300} rot={80} s={0.9} />
    {[...Array(6)].map((_, i) => <circle key={i} cx={620 + hsh(i) * 220} cy={260 + ((t * 30 + i * 37) % 80)} r="5" fill="#C9CEDF" opacity="0.6" />)}
    <XLChip x={760} y={90} text="SUNDAY · FREE" fill={A} col={K} size={30} />
    <XLPop t={t} at={B(beats, 3)}><XLStamp x={720} y={520} text="UNTOUCHED" size={40} rot={-4} /></XLPop></g>);
}
/* 9 — 1973: the "Good Player" certificate with a gold seal and red ribbon, crayons */
function XHAward({ T, t, beats }) {
  return (<g><XLBg kind="wall" /><XLChip x={540} y={70} text="1973 · PRESCHOOL STUDY" fill={C} col={K} size={28} />
    <XLRise t={t} at={0.25} dy={500}><XLCard x={260} y={130} w={560} h={380} r={10} fill="#fff" sw={8} />
      <rect x="282" y="152" width="516" height="336" fill="none" stroke={A} strokeWidth="6" />
      <XLText x={540} y={230} size={48} fill={K} anchor="middle">GOOD PLAYER</XLText><XLText x={540} y={282} size={36} fill={K} anchor="middle">AWARD</XLText>
      <path d="M680 380 l-30 110 l40 -24 l20 40 l20 -120 Z" fill={R} stroke={K} strokeWidth="5" />
      <XLPulse T={T}><circle cx="700" cy="380" r="58" fill={A} stroke={K} strokeWidth="6" /><circle cx="700" cy="380" r="38" fill="none" stroke={K} strokeWidth="4" strokeDasharray="8 6" /></XLPulse></XLRise>
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${110 + i * 40} ${470}) rotate(${-20 + i * 6})`}><rect x="-14" y="-90" width="28" height="110" fill={[R, A, GR, '#5B8DEF'][i]} stroke={K} strokeWidth="5" /></g>)}</g>);
}
/* 10 — later, free play: promised-award kids drew about half as much */
function XHHalf({ t, beats }) {
  return (<XLBars t={t} title="FREE-PLAY DRAWING, LATER" note="LEPPER, GREENE & NISBETT 1973"
    bars={[{ label: ['PROMISED', 'AWARD'], v: 0.47, col: R, at: B(beats, 2) - 0.3 }, { label: ['NO', 'AWARD'], v: 0.92, col: G, at: 0.2 }]} />);
}
/* 11 — the surprise-award kids: no drop */
function XHSurprise({ t, beats }) {
  return (<XLBars t={t + 5} title="FREE-PLAY DRAWING, LATER" note="LEPPER, GREENE & NISBETT 1973"
    bars={[{ label: ['PROMISED', 'AWARD'], v: 0.47, col: R }, { label: ['NO', 'AWARD'], v: 0.92, col: G }, { label: ['SURPRISE', 'AWARD'], v: 1.0 * EO((t - 0.15) / 0.8), col: GR }]} />);
}
/* 12 — the trick: WHY DRAW? "FUN" gets crossed out, "FOR THE AWARD" written in */
function XHReason({ T, t, beats }) {
  const x1 = B(beats, 1);
  return (<g><XLBg kind="wallDark" /><XLCard x={170} y={60} w={740} h={490} />
    <XLText x={540} y={150} size={50} fill={K} anchor="middle">WHY DRAW?</XLText>
    <XLText x={540} y={290} size={96} fill={GR} anchor="middle">FUN</XLText>
    {t > x1 && <line x1={400} y1={262} x2={400 + 280 * EO((t - x1) / 0.3)} y2={258} stroke={R} strokeWidth="16" strokeLinecap="round" />}
    <XLPop t={t} at={x1 + 0.3}><XLText x={540} y={410} size={64} fill={R} anchor="middle">FOR THE REWARD</XLText></XLPop>
    <XLPop t={t} at={B(beats, 3) - 0.1}><XLChip x={540} y={500} text="OVERJUSTIFICATION" fill={A} col={K} size={32} /></XLPop></g>);
}
/* 13 — payoff: Ivy drawing again, one sketchbook stickered NOT FOR SALE */
function XHUnpaid({ T, t, beats }) {
  return (<g><XLBg kind="room" /><XLGlow x={680} y={420} r={300} col={A} a={0.35} />
    <XLChar x={400} y={300} s={1.05} who="ivy" mood="relief" look={[10, 8]} />
    <Sketchbook x={720} y={420} s={0.62} T={T} tag={t > B(beats, 1) - 0.1 ? 'NOT FOR SALE' : null} /><g transform={`translate(${OS(T, 0.6) * 14} 0)`}><Pencil x={820} y={440} s={0.7} /></g></g>);
}
/* 14 — the comment question; Gus thinks about it too */
function XHAsk({ T, t, beats }) {
  return (<g><XLBg kind="wall" /><XLCard x={110} y={70} w={620} h={460} r={24} />
    <XLText x={420} y={170} size={40} fill={K} anchor="middle">WHICH HOBBY DID</XLText><XLText x={420} y={225} size={40} fill={K} anchor="middle">YOU TURN INTO</XLText>
    <XLText x={420} y={280} size={40} fill={K} anchor="middle">A JOB?</XLText>
    <XLCard x={160} y={330} w={520} h={110} r={20} fill="#fff" sw={6} />{Math.floor(T * 2.5) % 2 ? <rect x="190" y="352" width="8" height="66" fill={K} /> : null}
    <XLText x={215} y={403} size={40} fill="#A9A9A9">MY ______</XLText>
    <XLPop t={t} at={B(beats, 1)}><XLChar x={890} y={320} s={0.85} who="gus" mood="squint" look={[-10, -6]} /></XLPop></g>);
}
/* 15 — share ending */
function XHShare({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" /><XLPulse T={T}><circle cx="240" cy="304" r="135" fill={A} stroke={K} strokeWidth="8" />
    <path d="M165 300 L320 235 L275 385 L240 325 Z M240 325 L320 235" fill="#fff" stroke={K} strokeWidth="8" strokeLinejoin="round" /></XLPulse>
    <XLFade t={t} at={0.3}><path d="M410 304 H640" stroke="#fff" strokeWidth="12" strokeDasharray="26 22" strokeLinecap="round" /><path d="M640 270 l44 34 l-44 34" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" /></XLFade>
    <XLPop t={t} at={B(beats, 1)}><XLCard x={720} y={120} w={290} h={370} r={24} /><XLAvatar x={865} y={250} r={85} /><XLText x={865} y={395} size={28} fill={K} anchor="middle">THAT FRIEND</XLText></XLPop>
    <XLPop t={t} at={B(beats, 2)}><g transform="translate(865 458)"><Tag x={0} y={0} text="$$$" k={1} rot={-6} /></g></XLPop></g>);
}

Object.assign(window, { XHHobby, XHSell, XHKills, XHFirstOrder, XHRevision, XHDeadline, XHPriceTags, XHSunday, XHAward, XHHalf, XHSurprise, XHReason, XHUnpaid, XHAsk, XHShare });
})();
