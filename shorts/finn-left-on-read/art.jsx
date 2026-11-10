// art.jsx — "Left on Read for 24 Hours" (Finn ep. 1, experiment log). Reference example for format "xplog".
// Every scene draws ONLY the 1080×608 panel with xplog-kit.jsx (the engine adds the HUD above and the caption below).
// Props: T (global s), t (s into scene), dur, beats (each caption chunk's start within the scene — land actions on these).
(function () { // scoped so these short helper names can't collide with other scripts
const { ACC: A, RED: R, INK: K, CREAM: C, NAVY: N, GREY: G, GREEN: GR, clamp: cl, eo: EO, osc: OS, p2: P2, beat: B } = XL;
const Mine = () => <XLBubble x={400} y={135} w={500} lines={['WE STILL ON FOR', 'SATURDAY?']} mine />;
const Seen = () => <XLText x={900} y={292} size={26} fill={R} anchor="end">SEEN · 9:15 PM</XLText>;

/* 1 — the text goes out, then "seen" */
function XLSent({ t, beats }) {
  const s = B(beats, 2);
  return (<XLChat status={t < s ? '9:14 PM' : '9:15 PM'}><XLPop t={t} at={0.35}><Mine /></XLPop>
    <XLFade t={t} at={1.0} out={s}><XLText x={900} y={292} size={26} fill={G} anchor="end">DELIVERED</XLText></XLFade>
    <XLPop t={t} at={B(beats, 3) - 0.05}><Seen /></XLPop></XLChat>);
}
/* 2 — typing dots vanish; the 24:00:00 card lands */
function XLNothing({ T, t, beats }) {
  return (<g><XLBg kind="room" /><XLGlow x={600} y={500} r={260} /><XLChar x={600} y={300} s={1.15} who="finn" mood="worried" look={[0, 10]} />
    <XLPhone x={600} y={545} w={160} h={210} rot={-6} lit />
    <XLPop t={t} at={B(beats, 1)}><XLCard x={770} y={70} w={270} h={110} r={14} fill="#0C1128" sw={6} /><XLText x={905} y={112} size={20} fill={G} anchor="middle">ON READ FOR</XLText>
      <XLText x={905} y={160} size={44} fill={A} anchor="middle">24:00:00</XLText></XLPop></g>);
}
/* 3 — the open loop: three hidden words */
function XLReply({ t, beats }) {
  return (<g><XLBg kind="wallDark" /><XLCard x={170} y={90} w={740} h={430} /><XLText x={540} y={175} size={44} fill={K} anchor="middle">THE REPLY</XLText>
    <line x1="230" y1="205" x2="850" y2="205" stroke={K} strokeWidth="5" strokeDasharray="14 12" />
    {[0, 1, 2].map((i) => (<g key={i}><XLCard x={238 + i * 208} y={260} w={188} h={170} r={18} fill={N} sw={6} />
      <XLPop t={t} at={B(beats, 2) + i * 0.25}><XLText x={332 + i * 208} y={385} size={110} fill={A} anchor="middle">?</XLText></XLPop></g>))}</g>);
}
/* 4 — rereading your own message */
function XLReread({ T, t, beats }) {
  const mx = OS(T, 2.8) * 46, my = OS(T, 2.0, 0.25) * 10;
  return (<XLChat status="9:18 PM"><Mine /><Seen />
    <g transform={`translate(${mx} ${my})`}><line x1="610" y1="300" x2="700" y2="400" stroke={K} strokeWidth="26" strokeLinecap="round" /><line x1="610" y1="300" x2="700" y2="400" stroke="#8B5A3C" strokeWidth="14" strokeLinecap="round" />
      <circle cx="540" cy="225" r="105" fill="#fff" fillOpacity="0.18" stroke={K} strokeWidth="12" /></g>
    <XLPop t={t} at={B(beats, 1)}><XLCard x={170} y={330} w={250} h={90} r={16} fill={R} sw={6} /><XLText x={190} y={392} size={30}>REREAD ×</XLText>
      <XLText x={400} y={394} size={40} anchor="end">{Math.min(14, 1 + Math.floor(Math.max(0, t - B(beats, 1)) * 6))}</XLText></XLPop></XLChat>);
}
/* 5 — checking… online now */
function XLOnline({ T, t, beats }) {
  const on = B(beats, 3);
  return (<g><XLBg kind="wallDark" /><XLCard x={100} y={140} w={880} h={330} r={30} fill={N} /><XLAvatar x={260} y={305} r={100} /><XLText x={400} y={300} size={110}>SAM</XLText>
    {t < on && <XLText x={402} y={370} size={34} fill={G}>{'CHECKING' + '.'.repeat(1 + (Math.floor(Math.max(0, t) * 3) % 3))}</XLText>}
    <XLPop t={t} at={on}><XLPulse T={T}><circle cx="420" cy="358" r="18" fill={GR} stroke={K} strokeWidth="5" /></XLPulse><XLText x={452} y={372} size={40} fill={GR}>ONLINE NOW</XLText></XLPop></g>);
}
/* 6 — phone face down… for eleven seconds */
function XLFaceDown({ t, beats }) {
  const sw = B(beats, 2);
  if (t < sw) return (<g><XLBg kind="wood" /><circle cx="170" cy="150" r="80" fill="#EDE6D6" stroke={K} strokeWidth="7" /><circle cx="170" cy="150" r="58" fill="#3A2416" stroke={K} strokeWidth="5" />
    <XLPop t={t} at={B(beats, 1) - 0.1}><XLPhone x={520} y={304} w={270} h={460} rot={-9} back /></XLPop>
    <XLPop t={t} at={B(beats, 1) + 0.35}><g transform="rotate(7 850 300)"><XLCard x={740} y={190} w={220} h={220} r={4} fill={A} sw={6} /><XLText x={850} y={275} size={34} fill={K} anchor="middle">I DO NOT</XLText><XLText x={850} y={335} size={46} fill={K} anchor="middle">CARE.</XLText></g></XLPop></g>);
  const lt = t - sw, flip = 0.95;
  return (<g><XLBg kind="wall" /><XLStopwatch x={300} y={320} text={'0:' + P2(Math.min(11, (lt / flip) * 11))} />
    {lt < flip ? <XLPhone x={780} y={310} w={220} h={400} rot={8} back />
      : (<XLPop t={lt} at={flip}><XLGlow x={780} y={310} r={270} /><XLPhone x={780} y={310} w={220} h={400} rot={-6} lit><XLText x={94} y={172} size={28} fill={N} anchor="middle">NO NEW</XLText><XLText x={94} y={212} size={28} fill={N} anchor="middle">MESSAGES</XLText></XLPhone></XLPop>)}</g>);
}
/* 7 — the brain archive opens */
function XLArchive({ t, beats }) {
  const files = [['SAID', '"YOU TOO"', 'TO THE WAITER'], ['THAT', 'VOICE NOTE', 'FROM 2019'], ['WAVED BACK.', 'IT WAS NOT', 'FOR ME.'], ['HIT', 'REPLY', 'ALL.']];
  return (<g><XLBg kind="wallDark" />
    {files.map((l, i) => (<XLRise key={i} t={t} at={B(beats, 1) + i * 0.3}><g transform={`rotate(${[-4, 3, -2, 4][i]} ${200 + i * 226} 260)`}>
      <XLCard x={96 + i * 226} y={110} w={208} h={300} r={10} sw={6} /><rect x={96 + i * 226} y="110" width="208" height="44" rx="10" fill={R} stroke={K} strokeWidth="6" />
      <XLText x={200 + i * 226} y={142} size={22} anchor="middle">{'FILE ' + (i + 1)}</XLText>
      {l.map((s, j) => <XLText key={j} x={200 + i * 226} y={215 + j * 42} size={22.5} fill={K} anchor="middle">{s}</XLText>)}</g></XLRise>))}
    <XLCard x={50} y={390} w={980} h={260} r={16} fill="#2B3352" /><XLCard x={360} y={440} w={360} h={84} r={10} sw={6} /><XLText x={540} y={497} size={36} fill={K} anchor="middle">BRAIN ARCHIVE</XLText>
    <rect x="470" y="548" width="140" height="22" rx="11" fill={G} stroke={K} strokeWidth="5" /></g>);
}
/* 8 — typing a follow-up, then deleting it */
function XLFollowUp({ T, t, beats }) {
  const f = 'HEY, JUST CHECKING YOU SAW MY', a = B(beats, 1), d = B(beats, 3);
  const n = t < a ? 0 : t < d ? Math.floor(cl((t - a) / Math.max(0.4, d - a - 0.3)) * f.length) : Math.max(0, f.length - Math.floor(((t - d) / 0.6) * f.length));
  return (<XLChat status="2:14 AM" input={f.slice(0, n) + (Math.floor(T * 3) % 2 ? '|' : '')}><Mine /><Seen /></XLChat>);
}
/* 9 — the verdict, with zero evidence */
function XLVerdict({ T, t, beats }) {
  return (<g><XLBg kind="wall" /><XLChar x={205} y={340} s={1.15} who="finn" mood="squint" />
    <g transform="rotate(2 720 304)"><XLCard x={430} y={60} w={590} h={490} r={12} /><XLText x={470} y={125} size={30} fill="#7A705A">CASE FILE #6</XLText>
      <line x1="470" y1="148" x2="980" y2="148" stroke={K} strokeWidth="5" /><XLText x={470} y={215} size={40} fill={K}>VERDICT:</XLText>
      <XLPop t={t} at={B(beats, 1)}><XLStamp x={725} y={297} text="THEY HATE YOU" /></XLPop>
      <XLText x={470} y={465} size={40} fill={K}>EVIDENCE:</XLText><XLPop t={t} at={B(beats, 3)}><XLText x={880} y={490} size={130} fill={K} anchor="middle">0</XLText></XLPop></g></g>);
}
/* 10 — bad news crossed out; no news lights up */
function XLNoNews({ t, beats }) {
  return (<g><XLBg kind="wallDark" /><XLCard x={90} y={130} w={400} h={350} /><XLText x={290} y={290} size={74} fill={K} anchor="middle">BAD</XLText><XLText x={290} y={375} size={74} fill={K} anchor="middle">NEWS</XLText>
    <XLPop t={t} at={B(beats, 1)}><path d="M130 170 L450 440 M450 170 L130 440" stroke={R} strokeWidth="18" strokeLinecap="round" /></XLPop>
    <XLPop t={t} at={B(beats, 4)}><XLGlow x={790} y={305} r={290} col={A} a={0.5} /><XLCard x={590} y={130} w={400} h={350} fill={A} />
      <XLText x={790} y={290} size={74} fill={K} anchor="middle">NO</XLText><XLText x={790} y={375} size={74} fill={K} anchor="middle">NEWS</XLText></XLPop></g>);
}
/* 11 — the blank gets filled with the worst version */
function XLBlank({ T, t, beats }) {
  const w = B(beats, 2), s = 'THEY HATE ME.';
  return (<g><XLBg kind="wall" /><XLChar x={200} y={350} s={1.1} who="finn" mood="worried" look={[8, -8]} sweat />
    <circle cx="372" cy="250" r="16" fill={C} stroke={K} strokeWidth="6" /><circle cx="416" cy="212" r="24" fill={C} stroke={K} strokeWidth="6" /><XLCard x={450} y={80} w={580} h={330} r={90} />
    {t < w ? (<g><line x1="530" y1="270" x2="950" y2="270" stroke={K} strokeWidth="8" strokeDasharray="30 20" /><XLText x={740} y={225} size={40} fill="#9A8F76" anchor="middle">( BLANK )</XLText></g>)
      : <XLText x={740} y={272} size={66} fill={R} anchor="middle">{s.slice(0, Math.floor((t - w) * 14))}</XLText>}</g>);
}
/* 12 — the phone lights up; you stare at it */
function XLLightsUp({ T, t, dur, beats }) {
  const on = B(beats, 1), st = B(beats, 2);
  if (t < st) return (<g><XLBg kind="woodDark" />
    <XLPop t={t} at={on}><XLGlow x={540} y={304} r={420} /><path d="M250 150l-70-50M830 150l70-50M210 304h-90M870 304h90M250 460l-70 50M830 460l70 50" stroke="#CFE6FF" strokeWidth="12" strokeLinecap="round" /></XLPop>
    <XLPhone x={540} y={304} w={270} h={490} rot={-8} lit={t >= on}>{t >= on && (<g><XLText x={119} y={110} size={34} fill={N} anchor="middle">8:14 PM</XLText>
      <XLPop t={t} at={on + 0.2}><XLCard x={14} y={150} w={210} h={110} r={16} fill="#fff" sw={5} /><XLAvatar x={48} y={205} r={20} /><XLText x={78} y={197} size={24} fill={K}>SAM</XLText><XLText x={78} y={228} size={17} fill={R}>1 MESSAGE</XLText></XLPop></g>)}</XLPhone></g>);
  const p = cl((t - st) / Math.max(0.5, dur - st - 0.25));
  return (<g><XLBg kind="wall" /><XLGlow x={400} y={650} r={380} /><XLChar x={390} y={400} s={1.6} who="finn" mood="wide" look={[0, 14]} sweat />
    <XLDial x={860} y={290} p={p} text={p >= 1 ? '1:00' : '0:' + P2(p * 60)} /></g>);
}
/* 13 — the reply; seven spirals = one dead battery */
function XLDied({ T, t, beats }) {
  const eq = B(beats, 1);
  if (t < eq) return (<XLChat status="8:15 PM"><Mine /><Seen /><XLPop t={t} at={0.1}><XLBubble x={175} y={316} w={560} lines={['SORRY!! MY PHONE DIED.', 'YES, SATURDAY!']} size={33} /></XLPop></XLChat>);
  const lt = t - eq;
  return (<g><XLBg kind="wallDark" /><XLText x={170} y={385} size={240} fill={A} anchor="middle">7</XLText><XLSpiral x={400} y={304} rot={T * 70} />
    <XLPop t={lt} at={B(beats, 2) - eq - 0.15}><XLText x={612} y={360} size={150} anchor="middle">=</XLText></XLPop>
    <XLPop t={lt} at={B(beats, 2) - eq}><XLBattery x={710} y={215} level={Math.floor(T * 2.5) % 2 ? 0.12 : 0.02} /></XLPop></g>);
}
/* 14 — the comment question */
function XLAsk({ T, t, beats }) {
  return (<g><XLBg kind="wall" /><XLCard x={130} y={90} w={820} h={430} r={24} /><XLText x={540} y={190} size={42} fill={K} anchor="middle">HOW LONG WERE YOU</XLText>
    <XLText x={540} y={246} size={42} fill={K} anchor="middle">LEFT ON READ?</XLText><XLCard x={190} y={300} w={700} h={120} r={20} fill="#fff" sw={6} />
    {Math.floor(T * 2.5) % 2 ? <rect x="225" y="325" width="8" height="70" fill={K} /> : null}<XLText x={250} y={378} size={46} fill="#A9A9A9">___ HOURS</XLText>
    <XLPop t={t} at={B(beats, 1)}><g transform={`translate(0 ${OS(T, 2.4) * 8})`}><path d="M860 40 h150 a20 20 0 0 1 20 20 v90 a20 20 0 0 1 -20 20 h-60 l-40 40 v-40 h-50 a20 20 0 0 1 -20 -20 v-90 a20 20 0 0 1 20 -20z" fill={A} stroke={K} strokeWidth="7" />
      <circle cx="895" cy="105" r="10" fill={K} /><circle cx="935" cy="105" r="10" fill={K} /><circle cx="975" cy="105" r="10" fill={K} /></g></XLPop></g>);
}
/* 15 — share ending */
function XLShare({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" /><XLPulse T={T}><circle cx="240" cy="304" r="135" fill={A} stroke={K} strokeWidth="8" />
    <path d="M165 300 L320 235 L275 385 L240 325 Z M240 325 L320 235" fill="#fff" stroke={K} strokeWidth="8" strokeLinejoin="round" /></XLPulse>
    <XLFade t={t} at={0.3}><path d="M410 304 H640" stroke="#fff" strokeWidth="12" strokeDasharray="26 22" strokeLinecap="round" /><path d="M640 270 l44 34 l-44 34" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" /></XLFade>
    <XLPop t={t} at={B(beats, 1)}><XLCard x={720} y={120} w={290} h={370} r={24} /><XLAvatar x={865} y={250} r={85} /><XLText x={865} y={395} size={28} fill={K} anchor="middle">THAT FRIEND</XLText></XLPop>
    <XLPop t={t} at={B(beats, 3)}><XLChip x={865} y={458} text="REPLIES IN 9 HRS" size={26} rot={-5} /></XLPop></g>);
}
Object.assign(window, { XLSent, XLNothing, XLReply, XLReread, XLOnline, XLFaceDown, XLArchive, XLFollowUp, XLVerdict, XLNoNews, XLBlank, XLLightsUp, XLDied, XLAsk, XLShare });
})();
