// art.jsx — "Falling Blocks" (Kabir ep. 2, the Tetris effect). Stick cast from stick-kit.jsx; ground at y=1150.
const GY = 1150, Y = '#F5D33A', W = '#F2F2F2', TEAL = '#3FC1C9';
const HW = "'Caveat Brush', cursive";
// a 4-square block piece (white outline), cell size c
function Piece({ x, y, c = 60, shape = 'L', col = W, rot = 0 }) {
  const S = { L: [[0, 0], [0, 1], [0, 2], [1, 2]], T: [[0, 0], [1, 0], [2, 0], [1, 1]], I: [[0, 0], [0, 1], [0, 2], [0, 3]], O: [[0, 0], [1, 0], [0, 1], [1, 1]], S: [[1, 0], [2, 0], [0, 1], [1, 1]] }[shape];
  return <g transform={`translate(${x} ${y}) rotate(${rot})`}>{S.map(([i, j], k) => <rect key={k} x={i * c} y={j * c} width={c - 6} height={c - 6} rx="6" fill="none" stroke={col} strokeWidth="7" />)}</g>;
}
function Fall({ T, x0 = 0, n = 5, area = [160, 920], top = 440, bottom = 1100, s = 1 }) {
  const shapes = ['L', 'T', 'I', 'O', 'S'];
  return <g>{Array.from({ length: n }).map((_, i) => { const p = (T * 0.32 + i / n) % 1; const x = area[0] + ((i * 337) % (area[1] - area[0]));
    return <g key={i} opacity={Math.min(1, (1 - p) * 4)}><Piece x={x + x0} y={top + p * (bottom - top)} c={50 * s} shape={shapes[i % 5]} col={i % 2 ? Y : W} /></g>; })}</g>;
}

/* 1 — Kabir on the couch with a controller, TV full of blocks */
function ArtS4Game({ T, t }) {
  return (<g><StickGround y={GY} />
    <rect x="560" y="560" width="440" height="300" rx="16" fill="#0b0b0b" stroke={W} strokeWidth="9" />
    <line x1="780" y1="860" x2="780" y2="940" stroke={W} strokeWidth="9" /><line x1="700" y1="940" x2="860" y2="940" stroke={W} strokeWidth="9" strokeLinecap="round" />
    <g transform="translate(620 600) scale(0.55)"><Fall T={T} n={4} area={[20, 500]} top={0} bottom={360} /></g>
    <Stick who="kabir" x={300} y={GY} pose="sit" mood="happy" T={T} />
    <rect x="320" y="780" width="70" height="40" rx="14" fill={TEAL} />
  </g>);
}

/* 2 — in bed, eyes shut, blocks raining above */
function ArtS4Bed({ T, t }) {
  return (<g>
    <path d="M140 1150 L140 980 M140 1060 L940 1060 L940 1150 M940 980 L940 1060" stroke={W} strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M200 1060 Q560 960 900 1060" stroke={W} strokeWidth="9" fill="#0b0b0b" />
    <g transform="translate(300 950) rotate(-80)"><circle r="46" fill="#0b0b0b" stroke={W} strokeWidth="9" />
      <path d="M-42 0 Q-42 -68 0 -68 Q42 -68 42 0" stroke={TEAL} strokeWidth="9" fill="none" /></g>
    <line x1="284" y1="930" x2="290" y2="946" stroke={W} strokeWidth="5" strokeLinecap="round" /><line x1="300" y1="960" x2="306" y2="976" stroke={W} strokeWidth="5" strokeLinecap="round" />
    <Fall T={T} n={6} area={[200, 900]} top={440} bottom={900} />
  </g>);
}

/* 3 — class: Kabir stacking Arjun's books into neat rows, Arjun confused */
function ArtS4Books({ T, t }) {
  const k = Math.min(4, Math.floor(t / 0.45));
  return (<g><StickGround y={GY} />
    <line x1="420" y1="930" x2="780" y2="930" stroke={W} strokeWidth="9" strokeLinecap="round" /><line x1="450" y1="930" x2="450" y2={GY} stroke={W} strokeWidth="9" /><line x1="750" y1="930" x2="750" y2={GY} stroke={W} strokeWidth="9" />
    {Array.from({ length: k }).map((_, i) => <rect key={i} x={460 + (i % 2) * 150} y={866 - Math.floor(i / 2) * 64} width="140" height="56" rx="6" fill="none" stroke={i === k - 1 ? Y : W} strokeWidth="7" />)}
    <Stick who="kabir" x={260} y={GY} pose="point" mood="happy" T={T} />
    <Stick who="arjun" x={900} y={GY} pose="shrug" mood="worried" T={T} dir={-1} s={0.85} />
    {t > 1 && <StickMark x={900} y={560} kind="?" T={T} size={90} color={W} />}
  </g>);
}

/* 4 — Kabir's head with a little brain "practising" blocks */
function ArtS4Brain({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="kabir" x={300} y={GY} pose="head" mood="shocked" T={T} />
    <StickBubble x={720} y={660} w={460} h={360} think text="" tail={-1} />
    <path d="M620 700 q-40 -90 50 -110 q40 -60 110 -10 q90 0 70 90 q30 70 -60 90 q-60 40 -120 0 q-80 0 -50 -60" fill="none" stroke={W} strokeWidth="8" />
    <g transform={`translate(${690 + STICK.osc(T, 1.2) * 20} 640)`}><Piece x={0} y={0} c={36} shape="T" col={Y} rot={(Math.floor(T * 1.5) % 4) * 90} /></g>
    <text x="720" y="910" textAnchor="middle" fontFamily={HW} fontSize="56" fill={Y}>practice mode</text>
  </g>);
}

/* 5 — the study: sleepers in a row, blocks above most heads (17 of 27) */
function ArtS4Study({ T, t }) {
  return (<g>
    {Array.from({ length: 9 }).map((_, i) => { const x = 140 + (i % 3) * 400, y = 640 + Math.floor(i / 3) * 190, on = [0, 1, 3, 4, 6, 8].includes(i);
      return <g key={i} opacity={Math.min(1, Math.max(0, t * 3 - i * 0.25))}>
        <rect x={x - 90} y={y + 30} width="210" height="40" rx="12" fill="none" stroke={W} strokeWidth="6" />
        <circle cx={x - 60} cy={y + 14} r="24" fill="#0b0b0b" stroke={W} strokeWidth="6" />
        {on && <Piece x={x - 10} y={y - 70 + STICK.osc(T, 1, i * 0.2) * 6} c={26} shape={['L', 'T', 'S'][i % 3]} col={Y} />}
      </g>; })}
    <text x="540" y="560" textAnchor="middle" fontFamily={HW} fontSize="96" fill={Y}>17 of 27</text>
  </g>);
}

/* 6 — amnesia: a blank memory bubble, but blocks still falling */
function ArtS4Amnesia({ T, t }) {
  return (<g><StickGround y={GY} />
    <Stick who="extra" x={320} y={GY} pose="shrug" mood="shocked" T={T} />
    <StickBubble x={740} y={600} w={420} h={170} think text="played what?" size={58} tail={-1} />
    <g opacity={Math.min(1, t / 0.6)}><Fall T={T} n={4} area={[560, 920]} top={760} bottom={1120} s={0.8} /></g>
  </g>);
}

/* 7 — the loop: game → brain → game */
function ArtS4Name({ T, t }) {
  const a = (T * 90) % 360;
  return (<g><StickGround y={GY} />
    <circle cx="540" cy="730" r="230" fill="none" stroke={W} strokeWidth="8" strokeDasharray="28 22" transform={`rotate(${a} 540 730)`} />
    <Piece x={330} y={610} c={50} shape="L" col={Y} />
    <path d="M700 690 q-40 -70 30 -86 q30 -46 84 -8 q70 0 54 70 q24 54 -46 70 q-46 30 -92 0 q-62 0 -40 -46" fill="none" stroke={W} strokeWidth="8" />
    <text x="540" y="1060" textAnchor="middle" fontFamily={HW} fontSize="80" fill={Y}>repeat → replay</text>
  </g>);
}

/* 8 — books on one side, game on the other; Kabir picks the game */
function ArtS4Again({ T, t }) {
  const pick = t > 1.6;
  return (<g><StickGround y={GY} />
    <g opacity={pick ? 0.35 : 1}>{[0, 1, 2].map((i) => <rect key={i} x="120" y={1090 - i * 60} width="200" height="54" rx="6" fill="none" stroke={W} strokeWidth="7" />)}</g>
    <g transform="translate(860 980)"><rect x="-90" y="-50" width="180" height="100" rx="40" fill={pick ? TEAL : 'none'} stroke={TEAL} strokeWidth="8" /><circle cx="-40" cy="0" r="12" fill={W} /><circle cx="40" cy="0" r="12" fill={W} /></g>
    <Stick who="kabir" x={540} y={GY} pose={pick ? 'point' : 'stand'} mood={pick ? 'happy' : 'neutral'} T={T} look={pick ? 10 : -10} />
    {pick && <Fall T={T} n={3} area={[700, 960]} top={440} bottom={860} s={0.7} />}
  </g>);
}

Object.assign(window, { ArtS4Again, ArtS4Amnesia, ArtS4Bed, ArtS4Books, ArtS4Brain, ArtS4Game, ArtS4Name, ArtS4Study });
