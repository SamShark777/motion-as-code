// art.jsx — "5 Signs You're Not Done Changing" (June ep. 6, with Theo; ted-MG motion graphics, signs-list).
// End of history illusion: Quoidbach, Gilbert & Wilson 2013 (Science) — 19,000+ people aged 18–68 reported a lot of change
// in the past decade but expected much less in the next. Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 —
// faces stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GREEN = '#4f9d78', TEAL = '#5bb3b0';
const OLD_JUNE = { name: 'June', hair: 'bun', hairCol: '#b8b8b8', skin: '#f2dccb', top: '#5bb3b0', pants: '#4b3a2e', glasses: true };
const KID_JUNE = { name: 'June', hair: 'long', hairCol: '#c46a3f', skin: '#f2dccb', top: '#e07fa8', pants: '#4b3a2e', glasses: false };
const OLD_THEO = { name: 'Theo', hair: 'curly', hairCol: '#4a3426', skin: '#e9d2b8', top: '#e8b33e', pants: '#4b3a2e', glasses: false };

// the running checklist (top-right): n signs shown, ticks up to `on`
function Checklist({ x = 870, y = 210, n = 5, shown = 1, on = 0, s = 0.78 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-150" y="-70" width="300" height={shown * 70 + 80} rx="20" fill="rgba(10,10,16,0.75)" stroke={A} strokeWidth="4" />
    <text y="-22" textAnchor="middle" fontFamily={BB} fontSize="40" fill={A}>SIGNS</text>
    {[...Array(shown)].map((_, i) => <g key={i} transform={`translate(-110 ${30 + i * 70})`}><rect x="0" y="-24" width="48" height="48" rx="8" fill="#fff" stroke={K} strokeWidth="4" />
      {i < on && <path d="M8 0 L20 14 L42 -14" fill="none" stroke={GREEN} strokeWidth="9" strokeLinecap="round" />}
      <text x="70" y="14" fontFamily={BB} fontSize="44" fill="#fff">{`SIGN ${i + 1}`}</text></g>)}</g>);
}
// big sign number, top-left
function SignNum({ n, t }) {
  return (<g transform={`translate(230 300) scale(${BK(t / 0.3)})`}><circle r="120" fill={A} stroke={K} strokeWidth="8" />
    <text y="58" textAnchor="middle" fontFamily={BB} fontSize="190" fill="#1a1720">{n}</text></g>);
}
function Polaroid({ x, y, s = 1, rot = 0, who, label, T }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><rect x="-150" y="-170" width="300" height="340" rx="8" fill="#fff" stroke={K} strokeWidth="7" />
    <rect x="-125" y="-145" width="250" height="230" fill="#9fd0e0" /><MGHead x={0} y={-30} r={80} who={who} mouth="grin" brow="up" look={[0, 0]} bl={BL(T, 2)} />
    <text y="135" textAnchor="middle" fontFamily={BB} fontSize="46" fill="#1a1720">{label}</text></g>);
}
function Diary({ x, y, s = 1, open = 1, T }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-300 -180 Q-150 -210 0 -180 Q150 -210 300 -180 L300 200 Q150 170 0 200 Q-150 170 -300 200 Z" fill="#fdf3dc" stroke={K} strokeWidth="8" />
    <line x1="0" y1="-180" x2="0" y2="200" stroke="#c9b48a" strokeWidth="6" />
    <text x="-150" y="-110" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="34" fill="#c2449a" transform="rotate(-3 -150 -110)">DEAR DIARY</text>
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M-260 ${-50 + i * 60} q40 -16 80 0 t80 0 t80 0`} fill="none" stroke="#8a7aa6" strokeWidth="6" strokeLinecap="round" />)}
    {[[-90, 150], [-210, 140]].map(([hx, hy], i) => <path key={i} d={`M${hx} ${hy} c-14 -18 -40 -2 -20 16 l20 18 l20 -18 c20 -18 -6 -34 -20 -16 Z`} fill="#e5483b" />)}
    <text x="150" y="-110" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="30" fill="#c2449a">I'M SO DEEP</text>
    {[0, 1, 2].map((i) => <path key={i} d={`M40 ${-30 + i * 60} q40 -16 80 0 t80 0 t60 0`} fill="none" stroke="#8a7aa6" strokeWidth="6" strokeLinecap="round" />)}</g>);
}

/* 1 — June on her bed with the old diary; DEAR DIARY... I'M SO DEEP; she cringes behind her hand */
function MGJuneDiary({ T, t, beats }) {
  const c2 = b(beats, 2, 1.2);
  return (<g><MGBg kind="room" />
    <rect x="-60" y="1080" width="1200" height="300" rx="40" fill="#e07fa8" stroke={K} strokeWidth="8" /><rect x="-60" y="1060" width="1200" height="60" rx="30" fill="#f4c6d8" stroke={K} strokeWidth="6" />
    <Diary x={560} y={560} s={1.25} T={T} />
    <MGBust x={540} y={1060} r={140} who="june" mouth={t > c2 ? 'wave' : 'o'} brow="worried" look={[0, -1]} bl={BL(T)} blush={t > c2 ? 1 : 0} />
    {t > c2 && <MGChip x={540} y={860} text="CRINGE" col={R} txt="#fff" size={54} pop={(t - c2) / 0.25} />}</g>);
}

/* 2 — five numbered cards fan out; the last one flips to a green GOOD NEWS */
function MGFiveSigns({ T, t, beats }) {
  const c3 = b(beats, 3, 1.6);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.45 * SM(0, 0.3, t)} />
    {[0, 1, 2, 3, 4].map((i) => { const k = (t - 0.1 - i * 0.12) / 0.3, a = (i - 2) * 14, x = 540 + (i - 2) * 150, y = 760 + Math.abs(i - 2) * 40;
      return k > 0 && <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${BK(k)})`}><rect x="-110" y="-160" width="220" height="320" rx="20" fill="#fff" stroke={K} strokeWidth="7" />
        <text y="60" textAnchor="middle" fontFamily={BB} fontSize="200" fill={i === 4 && t > c3 ? GREEN : '#1a1720'}>{i + 1}</text></g>; })}
    {t > c3 && <MGChip x={540} y={330} text="THE TWIST: GOOD NEWS" col={GREEN} txt="#fff" size={54} pop={(t - c3) / 0.25} />}
    <MGHead x={540} y={1180} r={110} who="june" mouth="o" brow="up" look={[0, -1]} bl={BL(T)} /></g>);
}

/* sign 1 — old photo: June at 14 with braces-era fringe; present June winces */
function MGSign1({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  return (<g><MGBg kind="wall" c1="#ffe2b8" c2="#e9b98a" />
    <SignNum n={1} t={t} /><Checklist shown={1} on={t > c2 ? 1 : 0} />
    <Polaroid x={540} y={760} s={1.35} rot={Math.sin(T * 1.2) * 3 - 4} who={KID_JUNE} label="JUNE, 2014" T={T} />
    <MGBust x={540} y={1180} r={110} who="june" mouth={t > c2 ? 'wave' : 'flat'} brow="worried" look={[0, -1]} bl={BL(T)} />
    {t > c2 && <MGArrows x={540} y={760} t={t - c2} n={5} from={520} to={300} />}</g>);
}

/* sign 2 — the SCHOOL MIX playlist; June hides behind the phone */
function MGSign2({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  const songs = ['EMO ANTHEM (LIVE)', 'BOY BAND LOVE SONG', 'RINGTONE REMIX', 'SAD PIANO COVER'];
  return (<g><MGBg kind="wall" c1="#e9d3f0" c2="#b48ac9" />
    <SignNum n={2} t={t} /><Checklist shown={2} on={t > c2 ? 2 : 1} />
    <g transform="translate(540 820) rotate(-4)"><rect x="-260" y="-360" width="520" height="720" rx="56" fill="#18161d" stroke={K} strokeWidth="9" /><rect x="-232" y="-326" width="464" height="652" rx="34" fill="#2a2440" />
      <text y="-250" textAnchor="middle" fontFamily={BB} fontSize="70" fill={A}>SCHOOL MIX</text>
      {songs.map((s, i) => <g key={i} opacity={SM(0.1 + i * 0.12, 0.3 + i * 0.12, t)}><rect x="-200" y={-190 + i * 120} width="80" height="80" rx="10" fill={['#e5483b', '#6a7bd1', '#4f9d78', '#e8b33e'][i]} />
        <text x="-100" y={-138 + i * 120} fontFamily={OS} fontWeight="700" fontSize="34" fill="#fff">{s}</text></g>)}
      <rect x="-200" y={290 - 20} width={400 * ((T * 0.15) % 1)} height="10" rx="5" fill={A} /></g>
    <MGHead x={780} y={1220} r={100} who="june" mouth="wave" brow="worried" look={[-1, -0.6]} bl={BL(T)} blush={t > c2 ? 1 : 0} />
    <MGRing cx={540} cy={680} rx={300} ry={80} p={(t - c2) / 0.4} rot={-4} /></g>);
}

/* sign 3 — café: June and an old best friend, awkward silence; the speech bubble is just "SO... UM..." */
function MGSign3({ T, t, beats }) {
  const c2 = b(beats, 2, 1.1);
  return (<g><MGBg kind="wall" c1="#d9e3ee" c2="#9fb0c4" />
    <SignNum n={3} t={t} /><Checklist shown={3} on={t > c2 ? 3 : 2} />
    <rect x="200" y="1110" width="680" height="34" rx="12" fill="#8c6a4a" stroke={K} strokeWidth="6" /><rect x="520" y="1140" width="40" height="200" fill="#6b4d33" />
    <MGMug x={420} y={1060} /><MGMug x={660} y={1060} rot={4} fill="#f4c6d8" />
    <MGPerson x={260} y={1300} s={2.3} who="june" mouth="flat" brow="worried" look={[1, 0]} bl={BL(T)} />
    <MGPerson x={820} y={1300} s={2.3} who={MG.extra(4)} mouth="flat" brow="flat" look={[-1, 0]} bl={BL(T, 1)} />
    <MGBubble x={540} y={660} text="SO... UM..." size={64} k={(t - 0.3) / 0.3} />
    {t > c2 && <MGChip x={540} y={860} text="BEST FRIENDS · 2015" outline size={44} pop={(t - c2) / 0.25} />}</g>);
}

/* sign 4 — June happily hugging a coffee; a quote card: "COFFEE IS DISGUSTING" — JUNE, AGE 14 */
function MGSign4({ T, t, beats }) {
  const c3 = b(beats, 3, 1.3);
  return (<g><MGBg kind="wall" c1="#f3e2c8" c2="#d9b48a" />
    <SignNum n={4} t={t} /><Checklist shown={4} on={t > c3 ? 4 : 3} />
    <g transform={`translate(560 640) rotate(3) scale(${BK((t - 0.2) / 0.3)})`}><rect x="-330" y="-110" width="660" height="220" rx="18" fill="#fff" stroke={K} strokeWidth="7" />
      <text y="-10" textAnchor="middle" fontFamily={BB} fontSize="72" fill="#1a1720">"COFFEE IS DISGUSTING."</text>
      <text y="70" textAnchor="middle" fontFamily={OS} fontWeight="500" fontSize="36" fill="#5a5560">— JUNE, AGE 14</text></g>
    {t > c3 && <g transform="translate(560 640) rotate(-8)"><rect x="-300" y="-14" width={600 * EO((t - c3) / 0.3)} height="28" rx="14" fill={R} /></g>}
    <MGPerson x={540} y={1320} s={2.6} who="june" mouth="grin" brow="up" look={[0, -1]} bl={BL(T)} />
    <MGMug x={620} y={1080} rot={-6} />
    {[0, 1, 2].map((i) => { const p = (T * 0.7 + i / 3) % 1; return <path key={i} d={`M${590 + i * 30} ${980 - p * 120} q14 -20 0 -40 q-14 -20 0 -40`} fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity={Math.sin(p * Math.PI) * 0.9} />; })}</g>);
}

/* sign 5 — a file icon JUNE_FINAL_v7; the "FINAL" stamp lands, then a new v8 slides in behind it */
function MGSign5({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0), v8 = SM(c2 + 0.9, c2 + 1.4, t);
  const File = ({ x, y, label, k = 1, col = '#fff' }) => (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}><path d="M-170 -220 L90 -220 L170 -140 L170 220 L-170 220 Z" fill={col} stroke={K} strokeWidth="8" strokeLinejoin="round" />
    <path d="M90 -220 L90 -140 L170 -140" fill="none" stroke={K} strokeWidth="8" /><MGHead x={0} y={-30} r={90} who="june" mouth="smile" brow="flat" look={[0, 0]} bl={0} />
    <text y="170" textAnchor="middle" fontFamily={BB} fontSize="56" fill="#1a1720">{label}</text></g>);
  return (<g><MGBg kind="navy" />
    <SignNum n={5} t={t} /><Checklist shown={5} on={t > c2 ? 5 : 4} />
    {v8 > 0 && <g opacity={v8}><File x={700} y={820} label="JUNE_v8" k={v8} col="#e6f4ef" /></g>}
    <g transform={`translate(${-160 * v8} 0)`}><File x={540} y={820} label="JUNE_FINAL_v7" k={(t - 0.1) / 0.3} /></g>
    {t > c2 && <g transform={`translate(${540 - 160 * v8} 700) rotate(-14) scale(${BK((t - c2) / 0.25)})`}><rect x="-180" y="-60" width="360" height="120" rx="12" fill="none" stroke={R} strokeWidth="12" />
      <text y="38" textAnchor="middle" fontFamily={BB} fontSize="110" fill={R}>FINAL?</text></g>}</g>);
}

/* study — a grid of people of all ages; chip: LAST 10 YEARS → CHANGED LOTS */
function MGQuoidbach({ T, t, beats }) {
  const c3 = b(beats, 3, 1.8);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={220} text="SCIENCE · 2013 · 19,000+ PEOPLE" outline size={40} pop={t / 0.25} />
    <MGHeadGrid T={T} on={lp(0, 20, SM(0.3, 1.6, t))} y0={420} dy={210} />
    {t > c3 && <MGChip x={540} y={1250} text="LAST 10 YEARS: CHANGED LOTS" col={A} size={46} pop={(t - c3) / 0.25} />}</g>);
}

/* turn — two bars: PAST 10 YEARS (tall) vs NEXT 10 YEARS (expected, short, dashed) */
function MGExpectLess({ T, t, beats }) {
  const c1 = b(beats, 1, 0.7), hP = 620, hN = 200 * EO((t - c1) / 0.6);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={220} text="CHANGE" col={A} size={56} pop={t / 0.25} />
    <rect x="160" y={1150 - hP} width="300" height={hP} rx="20" fill={GREEN} stroke={K} strokeWidth="8" />
    <rect x="620" y={1150 - hN} width="300" height={hN} rx="20" fill="#6a7bd1" stroke="#fff" strokeWidth="8" strokeDasharray="22 14" />
    <rect x="100" y="1150" width="880" height="14" rx="7" fill="#fff" />
    <text x="310" y="1240" textAnchor="middle" fontFamily={BB} fontSize="56" fill="#fff">LAST 10 YEARS</text>
    <text x="770" y="1240" textAnchor="middle" fontFamily={BB} fontSize="56" fill="#fff">NEXT 10 (EXPECTED)</text>
    {t > c1 + 0.3 && <MGChip x={770} y={1150 - hN - 90} text="FAR LESS" col={R} txt="#fff" size={52} pop={(t - c1 - 0.3) / 0.25} />}</g>);
}

/* name it — title + a little "THE END" film card being torn away */
function MGNameHistory({ T, t, beats }) {
  const c2 = b(beats, 2, 1.2), tear = SM(c2, c2 + 0.6, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGTitle lines={[['THE END OF HISTORY', '#fff', 110], ['ILLUSION', A, 180]]} y={240} a={EO((t - 0.15) / 0.35)} />
    <g transform={`translate(${540 - tear * 120} ${880 + tear * 60}) rotate(${-tear * 18})`} opacity={1 - tear * 0.4}><rect x="-300" y="-170" width="300" height="340" fill="#18161d" stroke={K} strokeWidth="6" /><text x="-150" y="30" textAnchor="middle" fontFamily={BB} fontSize="110" fill="#fff">THE</text></g>
    <g transform={`translate(${540 + tear * 120} ${880 + tear * 60}) rotate(${tear * 18})`} opacity={1 - tear * 0.4}><rect x="0" y="-170" width="300" height="340" fill="#18161d" stroke={K} strokeWidth="6" /><text x="150" y="30" textAnchor="middle" fontFamily={BB} fontSize="110" fill="#fff">END</text></g>
    {tear > 0.3 && <MGChip x={540} y={900} text="TO BE CONTINUED" col={A} size={56} pop={(tear - 0.3) / 0.4} />}</g>);
}

/* reframe — June now and June in ten years; future June looks at today's photo and laughs kindly */
function MGFutureYou({ T, t, beats }) {
  const c2 = b(beats, 2, 1.4);
  return (<g><MGBg kind="room" />
    <MGChip x={300} y={260} text="JUNE · NOW" outline size={44} pop={t / 0.25} />
    <MGChip x={790} y={260} text="JUNE · 10 YEARS ON" col={A} size={44} pop={(t - 0.3) / 0.25} />
    <MGPerson x={300} y={1300} s={2.6} who="june" mouth="smile" brow="up" look={[1, -0.2]} bl={BL(T)} />
    <MGPerson x={800} y={1300} s={2.6} who={OLD_JUNE} mouth={t > c2 ? 'grin' : 'smile'} brow="up" look={[-0.4, 0.4]} bl={BL(T, 1)} />
    <Polaroid x={690} y={640} s={0.8} rot={-8} who="june" label="2026" T={T} />
    {t > c2 && <MGChip x={540} y={1180} text="THAT'S GROWTH" col={GREEN} txt="#fff" size={54} pop={(t - c2) / 0.25} />}</g>);
}

/* end — Theo shows June his own 1980s photo; all five boxes ticked; question + send chips */
function MGEndSigns({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0), c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="room" />
    <Checklist x={790} y={520} s={1} shown={5} on={Math.min(5, Math.floor(t / 0.18))} />
    <MGPerson x={230} y={1300} s={2.3} who="june" mouth="grin" brow="up" look={[1, -0.2]} bl={BL(T)} />
    <MGPerson x={560} y={1300} s={2.3} who="theo" mouth="smile" brow="up" look={[-1, -0.2]} bl={BL(T, 1)} />
    <Polaroid x={420} y={700} s={0.85} rot={6} who={OLD_THEO} label="THEO, 1984" T={T} />
    {t > 0.1 && <MGChip x={540} y={230} text="HOW MANY DID YOU CHECK?" col={A} size={44} pop={(t - 0.1) / 0.25} />}
    {t > c2 && <MGChip x={540} y={330} text="SEND IT TO THAT FRIEND" outline size={40} pop={(t - c2) / 0.25} />}</g>);
}

Object.assign(window, { MGJuneDiary, MGFiveSigns, MGSign1, MGSign2, MGSign3, MGSign4, MGSign5, MGQuoidbach, MGExpectLess, MGNameHistory, MGFutureYou, MGEndSigns });
})();
