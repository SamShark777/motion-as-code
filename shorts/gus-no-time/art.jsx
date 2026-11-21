// art.jsx — "I Said 'No Time' 5 Times in One Day" (Gus ep. 2, experiment log; Finn on the phone).
// Awe and time: Rudd, Vohs & Aaker 2012 (Psychological Science) — Exp 1: a 60-second ad with awe images (waterfalls, whales,
// space) vs a happy ad; the awe group agreed more that they had plenty of time. No numbers on screen (none claimed).
// Each scene draws ONLY the 1080×608 panel with xplog-kit.jsx; the engine draws the HUD and the caption.
(function () {
const { ACC: A, RED: R, INK: K, CREAM: C, NAVY: N, GREY: G, GREEN: GR, BLUE: BL, clamp: cl, eo: EO, osc: OS, hsh, beat: B } = XL;
const blink = (T, ph = 0) => (((T + ph) % 3.4) > 3.26 ? 1 : 0);

function Mug({ x, y, s = 1, steam = 0, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    {steam > 0 && [0, 1].map((i) => <path key={i} d={`M${-16 + i * 32} -70 q-14 -24 0 -46 q14 -22 0 -44`} stroke="#C9CEDF" strokeWidth="7" fill="none" strokeLinecap="round" opacity={0.6 + 0.3 * OS(T, 1.3, i * 0.4)} />)}
    <rect x="-55" y="-60" width="110" height="120" rx="14" fill={C} stroke={K} strokeWidth="7" />
    <path d="M55 -30 a28 28 0 0 1 0 56" stroke={K} strokeWidth="10" fill="none" /><rect x="-45" y="-52" width="90" height="16" rx="6" fill="#6E4224" /></g>);
}
/* the vast thing: night-sky/waterfall/whale vignette in a frame; k = 0..1 reveal */
function AweView({ x, y, w, h, T, k = 1, whale = true, sun = false }) {
  const u = 'xag' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const stars = [...Array(22)].map((_, i) => <circle key={i} cx={x + hsh(i) * w} cy={y + hsh(i + 40) * h * 0.55} r={2 + hsh(i + 9) * 3} fill="#fff" opacity={0.5 + 0.5 * OS(T, 1.5 + hsh(i), i)} />);
  return (<g opacity={k}>
    <defs><linearGradient id={u + "s"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0E1430" /><stop offset="0.6" stopColor="#3B2E7A" /><stop offset="1" stopColor="#E98A5B" /></linearGradient>
      <clipPath id={u + "c"}><rect x={x} y={y} width={w} height={h} rx="18" /></clipPath></defs>
    <g clipPath={`url(#${u}c)`}>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${u}s)`} />{stars}
      {sun && <circle cx={x + w * 0.7} cy={y + h * 0.62} r={h * 0.16} fill="#FFB347" stroke={K} strokeWidth="6" />}
      <path d={`M${x} ${y + h * 0.78} L${x + w * 0.22} ${y + h * 0.42} L${x + w * 0.38} ${y + h * 0.62} L${x + w * 0.55} ${y + h * 0.3} L${x + w * 0.78} ${y + h * 0.66} L${x + w} ${y + h * 0.5} V${y + h} H${x} Z`} fill="#1B2347" stroke={K} strokeWidth="6" />
      <rect x={x + w * 0.5} y={y + h * 0.36} width={w * 0.06} height={h * 0.64} fill="#9AD8FF" opacity="0.85" />
      {[0, 1, 2].map((i) => <line key={i} x1={x + w * (0.51 + i * 0.02)} y1={y + h * 0.36 + ((T * 160 + i * 40) % (h * 0.6))} x2={x + w * (0.51 + i * 0.02)} y2={y + h * 0.36 + ((T * 160 + i * 40) % (h * 0.6)) + 30} stroke="#fff" strokeWidth="5" />)}
      {whale && <g transform={`translate(${x + w * 0.2 + OS(T, 6) * 20} ${y + h * 0.9})`}><path d="M-90 0 Q-40 -50 60 -20 Q90 -10 110 -40 L120 10 Q60 30 -90 0 Z" fill={BL} stroke={K} strokeWidth="5" /></g>}
    </g>
    <rect x={x} y={y} width={w} height={h} rx="18" fill="none" stroke={K} strokeWidth="8" /></g>);
}

/* 1 — Gus speed-walking: coffee in one hand, phone in the other */
function XAGRushed({ T, t, beats }) {
  const bob = Math.abs(OS(T, 0.5)) * 10;
  return (<g><XLBg kind="wall" />
    <g transform={`translate(0 ${-bob})`}><XLChar x={540} y={300} s={1.05} who="gus" mood="worried" look={[10, 0]} sweat bl={blink(T)} /></g>
    <Mug x={300} y={460 - bob} s={0.9} steam={1} T={T} />
    <XLPhone x={790} y={440 - bob} w={150} h={260} rot={10} lit><XLText x={64} y={70} size={22} fill={N} anchor="middle">7:02</XLText>
      <rect x="14" y="100" width="100" height="22" rx="8" fill={R} /><rect x="14" y="134" width="100" height="22" rx="8" fill={R} /></XLPhone>
    <XLPop t={t} at={B(beats, 1)}><XLChip x={790} y={110} text="LATE AGAIN" size={30} rot={-3} /></XLPop></g>);
}
/* 2 — a tally card: NO TIME ×? */
function XAGCount({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" /><XLCard x={250} y={70} w={580} h={470} />
    <XLText x={540} y={170} size={56} fill={K} anchor="middle">"NO TIME"</XLText>
    <line x1="300" y1="210" x2="780" y2="210" stroke={K} strokeWidth="6" />
    <XLPop t={t} at={B(beats, 3) - 0.1}><XLText x={540} y={420} size={170} fill={R} anchor="middle">×?</XLText></XLPop>
    <XLChar x={150} y={420} s={0.7} who="gus" mood="squint" look={[14, -4]} bl={blink(T, 0.5)} /></g>);
}
/* 3 — snapback: the panel opens onto a vast night sky */
function XAGAwe({ T, t, beats }) {
  const k = EO((t - B(beats, 3)) / 0.5);
  return (<g><XLBg kind="wallDark" />
    <XLStopwatch x={540} y={320} r={180} text="+0H" />
    {k > 0 && <AweView x={60} y={30} w={960} h={548} T={T} k={k} />}
    <XLPop t={t} at={B(beats, 4) + 0.1}><XLChip x={540} y={540} text="AWE" fill={A} col={K} size={40} /></XLPop></g>);
}
/* 4 — 9:15: inbox counter explodes */
function XAGInbox({ T, t, beats }) {
  const n = Math.min(99, Math.floor(EO((t - B(beats, 1) + 0.2) / 0.8) * 99));
  return (<g><XLBg kind="wall" />
    <XLCard x={260} y={60} w={560} h={480} />
    <rect x="260" y="60" width="560" height="90" rx="22" fill={N} stroke={K} strokeWidth="7" />
    <XLText x={300} y={120} size={36}>INBOX</XLText>
    {[0, 1, 2, 3].map((i) => <g key={i}><rect x="300" y={180 + i * 85} width="480" height="64" rx="12" fill="#fff" stroke={K} strokeWidth="5" />
      <rect x="320" y={200 + i * 85} width={180 + hsh(i) * 160} height="22" rx="8" fill="#C9CEDF" /></g>)}
    <XLPulse T={T}><circle cx="810" cy="70" r="62" fill={R} stroke={K} strokeWidth="7" /></XLPulse>
    <XLText x={810} y={88} size={52} anchor="middle">{String(n)}</XLText></g>);
}
/* 5 — 1 PM: sad sandwich at the keyboard */
function XAGLunch({ T, t, beats }) {
  return (<g><XLBg kind="woodDark" />
    <rect x="160" y="80" width="460" height="300" rx="18" fill="#18161d" stroke={K} strokeWidth="8" /><rect x="185" y="105" width="410" height="250" rx="8" fill={BL} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="215" y={135 + i * 42} width={300 - i * 30} height="18" rx="6" fill="#C9CEDF" opacity="0.8" />)}
    <rect x="140" y="420" width="520" height="70" rx="12" fill="#C9CEDF" stroke={K} strokeWidth="6" />
    <g transform={`translate(800 ${430 - Math.max(0, OS(T, 1.6)) * 12})`}><path d="M-120 20 L120 20 L100 -40 L-100 -40 Z" fill="#E9B872" stroke={K} strokeWidth="6" strokeLinejoin="round" /><rect x="-110" y="-20" width="220" height="16" fill={GR} /><path d="M-120 20 Q0 60 120 20" fill="#E9B872" stroke={K} strokeWidth="6" /></g>
    <XLPop t={t} at={B(beats, 2)}><XLStamp x={790} y={260} text="AT DESK" size={46} rot={-8} /></XLPop></g>);
}
/* 6 — 5:30: Finn calling; Gus lets it ring */
function XAGCall({ T, t, beats }) {
  const ring = t < B(beats, 3) + 0.8;
  return (<g><XLBg kind="wall" />
    <XLChar x={250} y={300} s={0.95} who="gus" mood="squint" look={[16, 10]} bl={blink(T, 0.3)} />
    <g transform={`rotate(${ring ? OS(T, 0.12) * 4 : 0} 720 320)`}>
      <XLPhone x={720} y={320} w={250} h={440} lit><XLText x={109} y={80} size={24} fill={N} anchor="middle">INCOMING</XLText>
        <g transform="translate(109 180) scale(1.35)"><circle r="48" fill="#C9CEDF" stroke={K} strokeWidth="5" /><circle cy="-10" r="18" fill={G} /><path d="M-30 32 Q0 0 30 32" fill={G} /></g>
        <XLText x={109} y={290} size={34} fill={K} anchor="middle">FINN</XLText>
        <circle cx="50" cy="360" r="30" fill={R} stroke={K} strokeWidth="5" /><circle cx="168" cy="360" r="30" fill={GR} stroke={K} strokeWidth="5" /></XLPhone></g>
    {ring && [0, 1, 2].map((i) => <path key={i} d={`M${880 + i * 30} ${220 - i * 10} q30 100 0 200`} stroke={A} strokeWidth="8" fill="none" strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(OS(T, 0.6, i * 0.2))} />)}
    <XLPop t={t} at={B(beats, 3) + 0.2}><XLChip x={720} y={570} text="MISSED CALL" size={28} /></XLPop></g>);
}
/* 7 — 7 PM: a huge sunset out the window; Gus stares at his phone */
function XAGSunset({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <AweView x={540} y={40} w={480} h={420} T={T} whale={false} sun />
    <XLChar x={300} y={330} s={0.95} who="gus" mood="neutral" look={[0, 24]} bl={blink(T, 0.8)} />
    <XLPhone x={300} y={560} w={160} h={160} rot={0} lit />
    <XLPop t={t} at={B(beats, 3)}><XLStamp x={780} y={520} text="MISSED IT" size={44} rot={-6} /></XLPop></g>);
}
/* 8 — midnight: in bed, the stopwatch reads a blur of a day */
function XAGBed({ T, t, beats }) {
  return (<g><XLBg kind="room" />
    <rect x="360" y="380" width="680" height="160" rx="30" fill="#5B8DEF" stroke={K} strokeWidth="8" />
    <rect x="380" y="330" width="200" height="90" rx="30" fill={C} stroke={K} strokeWidth="7" />
    <XLChar x={500} y={300} s={0.75} who="gus" mood="sleepy" look={[0, -6]} />
    <rect x="360" y="420" width="680" height="140" rx="30" fill="#4C79D6" stroke={K} strokeWidth="8" />
    <XLDial x={880} y={190} r={120} p={EO(t / 1.2)} text="17H" />
    <XLPop t={t} at={B(beats, 2)}><XLChip x={880} y={340} text="WHERE DID IT GO?" size={26} rot={4} /></XLPop></g>);
}
/* 9 — the study: a 60-second screen of waterfalls, whales, space */
function XAGStudy({ T, t, beats }) {
  const k = EO(t / 0.5);
  return (<g><XLBg kind="wallDark" />
    <rect x="130" y="40" width="820" height="500" rx="26" fill="#18161d" stroke={K} strokeWidth="9" />
    <AweView x={160} y={70} w={760} h={440} T={T} k={k} />
    <XLDial x={940} y={120} r={80} p={cl(t / 4)} text="60S" />
    <XLPop t={t} at={0.15}><XLChip x={330} y={40} text="2012 · AWE AD" fill={A} col={K} size={28} rot={-3} /></XLPop></g>);
}
/* 10 — result: awe ad vs happy ad; the awe card fills up with time (no numbers) */
function XAGMore({ T, t, beats }) {
  const c3 = B(beats, 3), k = EO((t - c3 + 0.2) / 0.5);
  const card = (x, lab, win) => (<g><XLCard x={x} y={70} w={380} h={440} fill={win ? C : '#C9CEDF'} />
    <XLText x={x + 190} y={135} size={44} fill={K} anchor="middle">{lab}</XLText>
    <XLStopwatch x={x + 190} y={350} r={win ? 110 + 20 * k : 100} text={win && k > 0.5 ? 'MORE' : 'TIME'} /></g>);
  return (<g><XLBg kind="wallDark" />{card(110, 'HAPPY AD', false)}{card(590, 'AWE AD', true)}
    <XLPop t={t} at={c3}><XLStamp x={780} y={515} text="MORE TIME" size={44} rot={-6} col={GR} /></XLPop>
    <XLText x={540} y={590} size={17} fill={G} anchor="middle">RUDD, VOHS & AAKER 2012 · EXP. 1</XLText></g>);
}
/* 11 — self-proof: a phone gallery, the last sky photo is ages ago */
function XAGLastTime({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <XLPhone x={540} y={304} w={300} h={540} lit>
      <XLText x={134} y={60} size={26} fill={N} anchor="middle">PHOTOS · SKY</XLText>
      <g transform="translate(18 90)"><AweView x={0} y={0} w={232} h={200} T={T} whale={false} /></g>
      <XLText x={134} y={340} size={24} fill={K} anchor="middle">LAST ONE:</XLText>
      <XLPop t={t} at={B(beats, 4) - 0.1}><XLText x={134} y={400} size={44} fill={R} anchor="middle">2019</XLText></XLPop></XLPhone>
    <XLChar x={190} y={330} s={0.8} who="gus" mood="wide" look={[18, 0]} bl={blink(T)} /></g>);
}
/* 12 — payoff: day two, 7:02, Gus at the window with coffee, looking up */
function XAGSky({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <AweView x={420} y={40} w={600} h={420} T={T} />
    <XLChar x={260} y={320} s={1} who="gus" mood="relief" look={[0, -10]} />
    <Mug x={120} y={500} s={0.8} steam={1} T={T} />
    <XLPop t={t} at={B(beats, 2)}><XLChip x={720} y={520} text="1 MINUTE · BEFORE INBOX" fill={A} col={K} size={28} /></XLPop></g>);
}
/* 13 — your turn */
function XAGAsk({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" /><XLCard x={190} y={70} w={700} h={470} />
    <XLText x={540} y={190} size={52} fill={K} anchor="middle">LAST TIME YOU</XLText>
    <XLText x={540} y={260} size={52} fill={K} anchor="middle">FELT AWE?</XLText>
    <rect x="290" y="320" width="500" height="110" rx="18" fill="#fff" stroke={K} strokeWidth="6" />
    <rect x={320 + (Math.floor(T * 2) % 2 ? 0 : 1) * 0} y="350" width="8" height="50" fill={K} opacity={Math.floor(T * 2) % 2} />
    <XLPop t={t} at={B(beats, 1)}><XLChip x={540} y={490} text="COMMENT BELOW" size={28} /></XLPop></g>);
}
/* 14 — share: paper plane to that one friend */
function XAGShare({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <XLPulse T={T}><circle cx="300" cy="300" r="120" fill={A} stroke={K} strokeWidth="8" /></XLPulse>
    <path d="M240 300 L370 240 L330 370 L305 318 Z" fill="#fff" stroke={K} strokeWidth="6" strokeLinejoin="round" />
    <path d="M460 300 H640" stroke="#fff" strokeWidth="10" strokeDasharray="26 18" strokeDashoffset={-T * 60} /><path d="M640 270 L680 300 L640 330" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round" />
    <XLCard x={720} y={120} w={260} h={360} />
    <g transform="translate(850 250)"><circle r="62" fill="#C9CEDF" stroke={K} strokeWidth="6" /><circle cy="-14" r="24" fill={G} /><path d="M-40 42 Q0 0 40 42" fill={G} /></g>
    <XLText x={850} y={390} size={26} fill={K} anchor="middle">"SO BUSY"</XLText>
    <XLText x={850} y={430} size={26} fill={K} anchor="middle">FRIEND</XLText></g>);
}

Object.assign(window, { XAGRushed, XAGCount, XAGAwe, XAGInbox, XAGLunch, XAGCall, XAGSunset, XAGBed, XAGStudy, XAGMore, XAGLastTime, XAGSky, XAGAsk, XAGShare });
})();
