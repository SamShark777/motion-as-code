// art.jsx — "I Tried to Hang Up 5 Times" (Finn ep. 2, experiment log; Ivy on the other end of the call).
// Conversation endings: Mastroianni, Gilbert, Cooney & Wilson 2021 (PNAS, "Do conversations end when people want them to?"):
// 932 conversations; only about 2% ended when both people wanted; people were far off guessing what their partner wanted.
// Each scene draws ONLY the 1080×608 panel with xplog-kit.jsx; the engine draws the HUD and the caption.
(function () {
const { ACC: A, RED: R, INK: K, CREAM: C, NAVY: N, GREY: G, GREEN: GR, BLUE: BL, clamp: cl, eo: EO, osc: OS, hsh, beat: B } = XL;
const blink = (T, ph = 0) => (((T + ph) % 3.4) > 3.26 ? 1 : 0);

/* a character holding a phone to the ear (right side by default) */
function OnCall({ x, y, s = 1, who, mood, look, sweat, bl, side = 1 }) {
  return (<g><XLChar x={x} y={y} s={s} who={who} mood={mood} look={look} sweat={sweat} bl={bl} />
    <XLPhone x={x + side * 112 * s} y={y + 10 * s} w={74 * s} h={136 * s} rot={side * 14} back /></g>);
}
/* speech bubble with a tail; lines in caps */
function Say({ x, y, w, lines, mine, size = 30, tail = 'left' }) {
  const h = 46 + lines.length * (size + 10);
  const tx = tail === 'left' ? x + 40 : x + w - 40;
  return (<g><path d={`M${tx - 18} ${y + h - 4} L${tx + (tail === 'left' ? -30 : 30)} ${y + h + 34} L${tx + 22} ${y + h - 4} Z`} fill={mine ? BL : '#fff'} stroke={K} strokeWidth="6" strokeLinejoin="round" />
    <XLBubble x={x} y={y} w={w} lines={lines} mine={mine} size={size} /></g>);
}
/* wall clock */
function WallClock({ x, y, r = 80, T, m = 0 }) {
  const a = (m / 60) * 360 + T * 30;
  return (<g transform={`translate(${x} ${y})`}><circle r={r} fill={C} stroke={K} strokeWidth="8" />
    {[...Array(12)].map((_, i) => <line key={i} x1={0} y1={-r + 12} x2={0} y2={-r + 24} stroke={K} strokeWidth="5" transform={`rotate(${i * 30})`} />)}
    <line x1="0" y1="0" x2="0" y2={-r * 0.7} stroke={K} strokeWidth="7" strokeLinecap="round" transform={`rotate(${a})`} />
    <line x1="0" y1="0" x2="0" y2={-r * 0.45} stroke={R} strokeWidth="9" strokeLinecap="round" transform={`rotate(${a / 12 + 120})`} /><circle r="8" fill={K} /></g>);
}

/* 1 — Finn on the phone, 20 minutes in, staring at the clock */
function XFHCall({ T, t, beats }) {
  return (<g><XLBg kind="room" />
    <OnCall x={330} y={330} s={1.05} who="finn" mood="worried" look={[16, -10]} sweat bl={blink(T)} />
    <WallClock x={800} y={200} r={110} T={T} m={20} />
    <XLPop t={t} at={B(beats, 1, 0.4)}><XLChip x={800} y={420} text="WANTS TO HANG UP" size={30} rot={-3} /></XLPop>
    <XLFade t={t} at={B(beats, 3, 1.2)}><XLText x={800} y={520} size={30} fill={A} anchor="middle">SINCE MINUTE 10</XLText></XLFade></g>);
}
/* 2 — "anyway…" — Ivy keeps going */
function XFHAnyway({ T, t, beats }) {
  const b1 = B(beats, 1, 0.8), n = Math.max(0, Math.min(4, Math.floor((t - b1) / 0.3) + 1));
  return (<g><XLBg kind="wallDark" />
    <OnCall x={210} y={380} s={0.85} who="finn" mood="neutral" look={[14, -8]} bl={blink(T, 0.4)} />
    <Say x={130} y={40} w={300} lines={['ANYWAY…']} mine />
    <XLChar x={870} y={400} s={0.8} who="ivy" mood="smile" look={[-12, 0]} bl={blink(T, 1.3)} />
    {['AND THEN', 'OH! ALSO', 'WAIT, SO', 'AND HE SAID'].slice(0, n).map((s, i) => <g key={i} transform={`translate(${(i % 2) * 40} 0)`}><Say x={500} y={40 + i * 74} w={290} lines={[s]} size={26} tail="right" /></g>)}</g>);
}
/* 3 — snapback: split screen, both stuck */
function XFHToo({ T, t, beats }) {
  const k = EO((t - B(beats, 1, 0.5)) / 0.4);
  return (<g><XLBg kind="wallDark" />
    <rect x="0" y="0" width="540" height="608" fill={N} /><line x1="540" y1="0" x2="540" y2="608" stroke={A} strokeWidth="8" />
    <OnCall x={270} y={330} s={0.9} who="finn" mood="worried" look={[10, -6]} sweat bl={blink(T)} />
    <g opacity={0.35 + 0.65 * k}><OnCall x={810} y={330} s={0.9} who="ivy" mood={k > 0.5 ? 'worried' : 'smile'} look={[-10, -6]} sweat={k > 0.5} side={-1} bl={blink(T, 0.7)} /></g>
    <XLPop t={t} at={B(beats, 1, 0.5)}><XLChip x={540} y={540} text="BOTH STUCK?" fill={A} col={K} size={36} /></XLPop></g>);
}
/* 4 — a loud yawn */
function XFHYawn({ T, t, beats }) {
  const k = EO((t - B(beats, 1, 0.5)) / 0.3);
  return (<g><XLBg kind="room" />
    <OnCall x={420} y={330} s={1.1} who="finn" mood={k > 0 ? 'wide' : 'sleepy'} look={[0, -10]} />
    {k > 0 && <g opacity={k}><XLText x={780} y={220} size={110} fill={C} anchor="middle">YAWN</XLText>
      {[0, 1, 2].map((i) => <path key={i} d={`M${560 + i * 8} ${380 - i * 50} q40 -10 80 0`} stroke={A} strokeWidth="8" fill="none" strokeLinecap="round" />)}</g>}
    <XLPop t={t} at={B(beats, 1, 0.5) + 0.3}><XLChip x={780} y={330} text="EXIT ATTEMPT #2" size={28} /></XLPop></g>);
}
/* 5 — "I should let you go" — she laughs, new topic */
function XFHLetGo({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" />
    <OnCall x={210} y={400} s={0.8} who="finn" mood={t > B(beats, 2, 1) ? 'squint' : 'smile'} look={[14, -8]} bl={blink(T)} />
    <Say x={110} y={40} w={420} lines={['I SHOULD', 'LET YOU GO']} mine />
    <XLPop t={t} at={B(beats, 2, 1)}><Say x={560} y={60} w={380} lines={['HAHA! OH, THAT', 'REMINDS ME…']} tail="right" /></XLPop>
    <XLChar x={860} y={420} s={0.75} who="ivy" mood="relief" look={[-10, 0]} />
    <XLPop t={t} at={B(beats, 3, 1.4)}><XLStamp x={560} y={320} text="NEW TOPIC" size={42} rot={-6} /></XLPop></g>);
}
/* 6 — checking the time, out loud */
function XFHTime({ T, t, beats }) {
  return (<g><XLBg kind="room" />
    <OnCall x={260} y={330} s={1} who="finn" mood="squint" look={[20, -12]} bl={blink(T, 0.2)} />
    <XLStopwatch x={720} y={320} r={170} text="31:00" />
    <XLPop t={t} at={B(beats, 2, 1)}><Say x={480} y={20} w={420} lines={["WOW, IT'S LATE"]} mine size={28} /></XLPop></g>);
}
/* 7 — "okay bye!" … and the goodbyes pile up */
function XFHBye({ T, t, beats }) {
  const b1 = B(beats, 1, 0.6), n = Math.max(0, Math.min(5, Math.floor((t - b1) / 0.35) + 1));
  const L2 = ['OK BYE!', 'BYE!', 'OH AND—', 'LOVE YOU, BYE', 'BYEEE'];
  return (<g><XLBg kind="wallDark" />
    <Say x={80} y={40} w={330} lines={['OKAY, BYE!']} mine />
    {L2.slice(0, n).map((s, i) => <g key={i}><Say x={i % 2 ? 640 : 440} y={60 + i * 92} w={300} lines={[s]} size={26} mine={i % 2 === 1} tail={i % 2 ? 'right' : 'left'} /></g>)}
    <XLDial x={210} y={400} r={120} p={cl((t - b1) / 2)} text="+10" /></g>);
}
/* 8 — the 2021 survey card */
function XFHStudy({ T, t, beats }) {
  const box = (y, s, on, at) => (<g><rect x="200" y={y - 32} width="44" height="44" rx="8" fill="#fff" stroke={K} strokeWidth="5" />
    <XLFade t={t} at={at}>{on && <path d={`M208 ${y - 12} l12 14 l20 -30`} stroke={R} strokeWidth="8" fill="none" strokeLinecap="round" />}</XLFade>
    <XLText x={270} y={y} size={30} fill={K}>{s}</XLText></g>);
  return (<g><XLBg kind="wallDark" /><XLCard x={140} y={40} w={800} h={530} />
    <XLText x={180} y={100} size={24} fill={G}>PNAS · 2021 · 932 CONVERSATIONS</XLText>
    <XLText x={180} y={160} size={38} fill={K}>WHEN DID YOU WANT IT TO END?</XLText>
    {box(260, 'WHEN IT ENDED', false, 0)}{box(340, 'EARLIER', true, B(beats, 4, 1.6))}{box(420, 'LATER', false, 0)}
    <XLPop t={t} at={B(beats, 1, 0.5)}><XLChip x={760} y={500} text="BOTH PEOPLE ASKED" fill={N} size={24} /></XLPop></g>);
}
/* 9 — 2%: one dot in fifty */
function XFHTwo({ T, t, beats }) {
  const k = EO((t - B(beats, 1, 0.5)) / 0.4);
  return (<g><XLBg kind="wallDark" /><XLCard x={80} y={50} w={540} h={510} />
    {[...Array(50)].map((_, i) => { const cx = 140 + (i % 10) * 47, cy = 110 + Math.floor(i / 10) * 95, hit = i === 23;
      return <circle key={i} cx={cx} cy={cy} r="18" fill={hit && k > 0 ? GR : '#C9CEDF'} stroke={K} strokeWidth="4" transform={hit ? `translate(${cx} ${cy}) scale(${1 + 0.6 * k}) translate(${-cx} ${-cy})` : undefined} />; })}
    <XLText x={840} y={300} size={170} fill={A} anchor="middle">{k > 0 ? '2%' : '?'}</XLText>
    <XLText x={840} y={380} size={30} fill={C} anchor="middle">ENDED WHEN</XLText>
    <XLText x={840} y={420} size={30} fill={C} anchor="middle">BOTH WANTED</XLText></g>);
}
/* 10 — way off: what Finn guesses vs what Ivy wants */
function XFHOff({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <XLChar x={200} y={420} s={0.75} who="finn" mood="worried" look={[14, -14]} bl={blink(T)} />
    <XLCard x={70} y={40} w={420} h={200} />
    <XLText x={280} y={100} size={24} fill={G} anchor="middle">FINN'S GUESS</XLText><XLText x={280} y={170} size={40} fill={K} anchor="middle">SHE WANTS MORE</XLText>
    <XLChar x={880} y={420} s={0.75} who="ivy" mood="sleepy" look={[-14, -14]} />
    <XLFade t={t} at={B(beats, 2, 1)}><XLCard x={590} y={40} w={420} h={200} />
      <XLText x={800} y={100} size={24} fill={G} anchor="middle">IVY, REALLY</XLText><XLText x={800} y={170} size={40} fill={K} anchor="middle">I'M SO TIRED</XLText></XLFade>
    <XLPop t={t} at={B(beats, 1, 0.5)}><XLStamp x={540} y={360} text="WAY OFF" size={46} rot={-8} /></XLPop></g>);
}
/* 11 — both guessing wrong: two thought clouds that point at each other */
function XFHWrong({ T, t, beats }) {
  const cloud = (x, y, s) => (<g><ellipse cx={x} cy={y} rx="190" ry="80" fill="#fff" stroke={K} strokeWidth="6" />
    <circle cx={x - 120} cy={y + 110} r="16" fill="#fff" stroke={K} strokeWidth="5" /><XLText x={x} y={y - 6} size={26} fill={K} anchor="middle">THEY WANT TO</XLText><XLText x={x} y={y + 30} size={26} fill={K} anchor="middle">KEEP TALKING</XLText></g>);
  return (<g><XLBg kind="wallDark" />
    <OnCall x={200} y={420} s={0.75} who="finn" mood="worried" look={[10, -10]} sweat />
    <OnCall x={880} y={420} s={0.75} who="ivy" mood="worried" look={[-10, -10]} sweat side={-1} />
    {cloud(320, 110)}{cloud(760, 110)}
    <XLPop t={t} at={B(beats, 2, 1)}><XLStamp x={540} y={330} text="WRONG" size={60} rot={-6} /></XLPop></g>);
}
/* 12 — self-proof: the call log */
function XFHProof({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <XLPhone x={540} y={304} w={320} h={560} lit>
      <XLText x={144} y={60} size={28} fill={N} anchor="middle">RECENT CALLS</XLText>
      {[['MUM', '0:04'], ['WORK', '0:12'], ['DENTIST', '0:02']].map((r, i) => <g key={i}><rect x="14" y={90 + i * 84} width="260" height="66" rx="12" fill="#fff" stroke={K} strokeWidth="4" />
        <XLText x={34} y={133 + i * 84} size={24} fill={K}>{r[0]}</XLText><XLText x={254} y={133 + i * 84} size={24} fill={G} anchor="end">{r[1]}</XLText></g>)}
      <XLPop t={t} at={B(beats, 3, 1.4)}><g><rect x="14" y="350" width="260" height="110" rx="12" fill={A} stroke={K} strokeWidth="5" />
        <XLText x={34} y={398} size={26} fill={K}>THAT ONE</XLText><XLText x={254} y={440} size={34} fill={R} anchor="end">1:47:09</XLText></g></XLPop></XLPhone>
    <XLChar x={170} y={380} s={0.8} who="finn" mood="squint" look={[20, -4]} bl={blink(T)} /></g>);
}
/* 13 — payoff: "I've got to go" — both relieved */
function XFHRelieved({ T, t, beats }) {
  const k = t > B(beats, 3, 1.4) - 0.1;
  return (<g><XLBg kind="wall" />
    <OnCall x={230} y={380} s={0.85} who="finn" mood={k ? 'relief' : 'neutral'} look={[12, -6]} />
    <Say x={110} y={30} w={420} lines={["I'VE GOT TO GO.", 'TALK SOON!']} mine size={28} />
    <OnCall x={850} y={380} s={0.85} who="ivy" mood={k ? 'relief' : 'neutral'} look={[-12, -6]} side={-1} />
    <XLPop t={t} at={B(beats, 3, 1.4)}><Say x={600} y={60} w={360} lines={['OH THANK GOD.', 'BYE!']} size={28} tail="right" /></XLPop>
    <XLPop t={t} at={B(beats, 3, 1.4) + 0.2}><XLChip x={540} y={560} text="RELIEVED" fill={GR} size={34} /></XLPop></g>);
}
/* 14 — your turn */
function XFHAsk({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" /><XLCard x={190} y={60} w={700} h={480} />
    <XLText x={540} y={180} size={50} fill={K} anchor="middle">WHO ENDS</XLText>
    <XLText x={540} y={250} size={50} fill={K} anchor="middle">YOUR CALLS?</XLText>
    <XLPop t={t} at={B(beats, 1, 0.4)}><XLChip x={400} y={380} text="ME" fill={GR} size={46} /></XLPop>
    <XLPop t={t} at={B(beats, 2, 0.8)}><XLChip x={680} y={380} text="THEM" fill={R} size={46} /></XLPop>
    <XLText x={540} y={500} size={26} fill={G} anchor="middle">COMMENT BELOW</XLText></g>);
}
/* 15 — share: paper plane to the ten-minute-goodbye friend */
function XFHShare({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <XLPulse T={T}><circle cx="300" cy="300" r="120" fill={A} stroke={K} strokeWidth="8" /></XLPulse>
    <path d="M240 300 L370 240 L330 370 L305 318 Z" fill="#fff" stroke={K} strokeWidth="6" strokeLinejoin="round" />
    <path d="M460 300 H640" stroke="#fff" strokeWidth="10" strokeDasharray="26 18" strokeDashoffset={-T * 60} /><path d="M640 270 L680 300 L640 330" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round" />
    <XLCard x={720} y={120} w={260} h={360} />
    <g transform="translate(850 240)"><circle r="62" fill="#C9CEDF" stroke={K} strokeWidth="6" /><circle cy="-14" r="24" fill={G} /><path d="M-40 42 Q0 0 40 42" fill={G} /></g>
    <XLText x={850} y={380} size={26} fill={K} anchor="middle">10-MINUTE</XLText>
    <XLText x={850} y={420} size={28} fill={R} anchor="middle">GOODBYES</XLText></g>);
}

Object.assign(window, { XFHCall, XFHAnyway, XFHToo, XFHYawn, XFHLetGo, XFHTime, XFHBye, XFHStudy, XFHTwo, XFHOff, XFHWrong, XFHProof, XFHRelieved, XFHAsk, XFHShare });
})();
