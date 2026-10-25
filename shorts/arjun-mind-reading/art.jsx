// art.jsx — "Mind Reading" (Arjun ep. 1). Stick cast from stick-kit.jsx; ground line at y=1150.
const GY = 1150, Y = '#F5D33A';

/* 1 — Arjun waves, Kabir (headphones) walks past */
function ArtS1Wave({ T, t }) {
  const kx = 860 - Math.min(1, t / 2.6) * 520;
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={300} y={GY} pose="wave" mood="happy" T={T} />
    <Stick who="kabir" x={kx} y={GY} pose="walk" mood="happy" T={T} dir={-1} look={-4} />
  </g>);
}

/* 2 — thought bubble: "he's mad at me" */
function ArtS1Mad({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={360} y={GY} pose="stand" mood="worried" T={T} look={8} />
    <g opacity={Math.min(1, t / 0.4)}><StickBubble x={700} y={560} w={420} h={170} think text="he's mad at me" size={58} tail={-1} /></g>
    <Stick who="kabir" x={860} y={GY} pose="walk" mood="happy" T={T} s={0.55} op={0.5} />
  </g>);
}

/* 3 — far away: Kabir laughing with Maya; Arjun watching */
function ArtS1Laugh({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={180} y={GY} pose="stand" mood="sad" T={T} look={10} />
    <g transform={`translate(0 ${STICK.osc(T, 0.3) * 4})`}><Stick who="kabir" x={700} y={GY} pose="shrug" mood="happy" T={T} s={0.8} dir={-1} /></g>
    <Stick who="maya" x={860} y={GY} pose="hips" mood="happy" T={T} s={0.8} dir={-1} ph={0.4} />
    <StickMark x={800} y={560} kind="ha ha" T={T} color="#EDEDED" size={64} />
  </g>);
}

/* 4 — hands on head, question marks everywhere */
function ArtS1Sure({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={540} y={GY} pose="head" mood="shocked" T={T} />
    {[[300, 640], [780, 600], [240, 900], [840, 880], [540, 470]].map(([x, y], i) => <StickMark key={i} x={x} y={y} kind={i % 2 ? '!' : '?'} T={T + i * 0.3} size={110} />)}
  </g>);
}

/* 5 — 3 a.m., in bed, phone glowing, replay x5 */
function ArtS1Replay({ T, t }) {
  const n = Math.min(5, 1 + Math.floor(t / 0.5));
  return (<g>
    <path d="M140 1150 L140 980 M140 1060 L940 1060 L940 1150 M940 980 L940 1060" stroke="#F2F2F2" strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M200 1060 Q560 960 900 1060" stroke="#F2F2F2" strokeWidth="9" fill="#0b0b0b" />
    <g transform="translate(300 950) rotate(-80)"><circle r="46" fill="#0b0b0b" stroke="#F2F2F2" strokeWidth="9" />{[-30, -12, 8, 26].map((x, i) => <path key={i} d={`M${x} -40 l${i % 2 ? 8 : -6} -26`} stroke="#F2F2F2" strokeWidth="7" strokeLinecap="round" />)}</g>
    <circle cx="292" cy="935" r="5" fill="#F2F2F2" /><circle cx="300" cy="955" r="5" fill="#F2F2F2" />
    <g transform="translate(420 870) rotate(-10)"><rect x="-40" y="-70" width="80" height="140" rx="14" fill={Y} opacity={0.85 + 0.15 * STICK.osc(T, 0.4)} /></g>
    <text x="760" y="720" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="120" fill={Y}>{'↺ ×' + n}</text>
    <circle cx="880" cy="420" r="50" fill="none" stroke="#8a8a8a" strokeWidth="6" />
  </g>);
}

/* 6 — a puzzle with one missing piece */
function ArtS1Missing({ T, t }) {
  return (<g>
    {[0, 1, 2, 3].map((i) => { const x = 300 + (i % 2) * 240, y = 560 + Math.floor(i / 2) * 240; return i === 3
      ? <rect key={i} x={x} y={y} width="230" height="230" rx="10" fill="none" stroke={Y} strokeWidth="7" strokeDasharray="22 16" />
      : <rect key={i} x={x} y={y} width="230" height="230" rx="10" fill="none" stroke="#F2F2F2" strokeWidth="9" />; })}
    <StickMark x={655} y={760} kind="?" T={T} size={150} />
    <Stick who="arjun" x={200} y={GY} pose="shrug" mood="worried" T={T} s={0.6} />
  </g>);
}

/* 7 — the truth: Kabir with headphones, eyes on music */
function ArtS1Truth({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="kabir" x={540} y={GY} pose="walk" mood="happy" T={T} />
    {[0, 1, 2].map((k) => { const p = ((T * 0.6 + k / 3) % 1); return <text key={k} x={640 + p * 180} y={560 - p * 200} fontSize="80" fill="#3FC1C9" opacity={1 - p} fontFamily="'Caveat Brush', cursive">♪</text>; })}
    <g opacity={0.45}><Stick who="arjun" x={180} y={GY} pose="wave" mood="happy" T={T} s={0.6} /></g>
  </g>);
}

/* 8 — Arjun's head with a made-up angry Kabir inside, crossed out */
function ArtS1Name({ T, t }) {
  const x = Math.min(1, Math.max(0, (t - 1.0) / 0.4));
  return (<g><StickGround y={GY} />
    <Stick who="arjun" x={300} y={GY} pose="stand" mood="worried" T={T} look={10} />
    <StickBubble x={700} y={640} w={380} h={300} think text="" tail={-1} />
    <g transform="translate(700 700) scale(0.5)"><Stick who="kabir" x={0} y={230} pose="cross" mood="angry" T={T} /></g>
    <path d={`M560 520 L${560 + 280 * x} ${520 + 260 * x}`} stroke={Y} strokeWidth="14" strokeLinecap="round" />
    <path d={`M840 520 L${840 - 280 * x} ${520 + 260 * x}`} stroke={Y} strokeWidth="14" strokeLinecap="round" />
  </g>);
}

/* 9 — Arjun texts "you good?"; Kabir: "yeah? why 😄"; Arjun sweats */
function ArtS1Ask({ T, t }) {
  const lines = [{ t: 'you good?', me: true }];
  if (t > 1.2) lines.push({ t: 'yeah? why 😄' });
  return (<g>
    <StickPhone x={680} y={720} s={0.95} lines={lines} T={T} />
    <StickGround y={GY} x1={60} x2={460} />
    <Stick who="arjun" x={260} y={GY} pose="phone" mood={t > 1.2 ? 'smug' : 'worried'} T={T} />
    {t > 1.4 && <path d="M330 700 q14 26 0 40 q-14 -14 0 -40" fill="#9fd8ff" />}
  </g>);
}

Object.assign(window, { ArtS1Ask, ArtS1Laugh, ArtS1Mad, ArtS1Missing, ArtS1Name, ArtS1Replay, ArtS1Sure, ArtS1Truth, ArtS1Wave });
