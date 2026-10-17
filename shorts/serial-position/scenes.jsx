// Serial-position effect — story Short scenes (980×980 stage). Game-show flat: words on flip cards, a
// U-shaped curve drawn live like a scoreboard, bouncy pops. Pure functions of t; beats[i] = start of
// line i in the scene. Kit: shorts/design_kit/story-kit.jsx.
const { K, L, E, win, kf, camT, burst, sc, md, hsh } = SK;
const VIO = '#4B2AA5', VIO2 = '#3A1F86', GOLD = '#FFD23F', PINK = '#FF4FA3', WHITE = '#FFFFFF', INKC = '#1B0F3B', LILAC = '#7E62D6';
const HEAD = "'Baloo 2', 'Arial Rounded MT Bold', sans-serif";
const BODY = "'Nunito', 'Helvetica Neue', sans-serif";
const WORDS = ['APPLE', 'RIVER', 'CANDLE', 'TIGER', 'JACKET', 'MIRROR', 'PENCIL', 'GARDEN', 'ROCKET', 'BUTTON', 'PILLOW', 'WINDOW'];
const blink = (t, seed = 0) => (md(t + seed, 3.2) < 0.12 ? 0.9 : 0);

/* stage backdrop: violet with spotlight beams and a ring of marquee bulbs */
function Stage({ t, beams = true, bulbs = true }) {
  return <g>
    <rect x="-300" y="-300" width="1580" height="1580" fill={VIO2} />
    {beams && [-1, 1].map((d) => <polygon key={d} points={`${490 + d * 520},-40 ${490 + d * 420},-40 ${490 + d * 60 + 40 * Math.sin(t * 0.9 + d)},1000 ${490 + d * 260 + 40 * Math.sin(t * 0.9 + d)},1000`} fill={GOLD} opacity="0.1" />)}
    <ellipse cx="490" cy="960" rx="520" ry="110" fill={VIO} />
    {bulbs && Array.from({ length: 22 }, (_, i) => {
      const top = i < 11, k = i % 11, x = 40 + k * 90, y = top ? 26 : 954;
      const on = md(Math.floor(t * 4) + i, 2) === 0;
      return <circle key={i} cx={x} cy={y} r="11" fill={on ? GOLD : '#8E6E2A'} stroke={INKC} strokeWidth="3" />;
    })}
  </g>;
}

/* host = the protagonist with a bow tie */
function Host({ x, y, s = 1, t, look = [0, -0.3], smile = 0.6, brow = 0.3, open = 0, tilt = 0 }) {
  return <g>
    <StoryBust x={x} y={y} s={s} look={look} smile={smile} brow={brow} lid={blink(t)} open={open} tilt={tilt} />
    <g transform={`translate(${x} ${y - 88 * s}) scale(${s})`}>
      <path d="M0,0 L-30,-16 L-30,16 Z M0,0 L30,-16 L30,16 Z" fill={GOLD} stroke={INKC} strokeWidth="4" strokeLinejoin="round" />
      <circle r="8" fill={PINK} stroke={INKC} strokeWidth="3.5" />
    </g>
  </g>;
}

/* a flip card centred on the origin; k = flip progress 0…1 (0 shows `a`, 1 shows `b`) */
function FlipCard({ a, b, k, w = 640, h = 300, num }) {
  const half = k < 0.5, sy = Math.abs(Math.cos(k * Math.PI));
  const txt = half ? a : b;
  return <g transform={`scale(1 ${Math.max(0.02, sy)})`}>
    <rect x={-w / 2} y={-h / 2 + 14} width={w} height={h} rx="30" fill={INKC} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="30" fill={WHITE} stroke={INKC} strokeWidth="8" />
    <line x1={-w / 2 + 10} y1="0" x2={w / 2 - 10} y2="0" stroke={INKC} strokeWidth="3" opacity="0.15" />
    {txt && <text x="0" y="45" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="112" fill={VIO}>{txt}</text>}
    {num != null && <text x={-w / 2 + 30} y={-h / 2 + 50} fontFamily={BODY} fontWeight="800" fontSize="34" fill={PINK}>{num}</text>}
  </g>;
}

/* 1 — hook: the host introduces the test; a 12-WORDS sign pops, READY? */
function SceneHook({ t, dur, P }) {
  const cam = { fx: 490, fy: 560, s: L(1.06, 1, E(t, 0, dur, 'draw')), px: 490, py: 520 };
  const sign = E(t, 1.0, 1.4, 'pop');
  const ready = E(t, 1.9, 2.3, 'pop');
  return <g transform={camT(cam)}>
    <Stage t={t} />
    <g transform={`translate(490 250) rotate(${-3 + 2 * Math.sin(t * 2)}) scale(${sign})`}>
      <rect x="-290" y="-100" width="580" height="200" rx="36" fill={GOLD} stroke={INKC} strokeWidth="8" />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-215 + i * 39} cy="-78" r="8" fill={md(Math.floor(t * 5) + i, 2) ? WHITE : PINK} />)}
      <text x="0" y="52" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="108" fill={INKC}>12 WORDS</text>
    </g>
    <Host x={490} y={1010} s={1.5} t={t} look={[0, -0.8]} smile={0.8} open={win(t, 0, 2.6) * Math.max(0, Math.sin(t * 10)) * 0.4} />
    <StoryArm x={612} y={896} s={1.45} a1={L(60, -40, E(t, 0.6, 1.1, 'draw'))} a2={L(90, -60, E(t, 0.6, 1.1, 'draw'))} hand="open" />
    {ready > 0 && <g transform={`translate(780 480) rotate(8) scale(${ready})`}>
      <polygon points={burst(100, 140, 12)} fill={PINK} stroke={INKC} strokeWidth="6" strokeLinejoin="round" />
      <text x="0" y="22" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="50" fill={WHITE}>READY?</text>
    </g>}
  </g>;
}

/* 2 — the list: one flip card per word, keyed to each word's line; progress dots below */
function SceneList({ t, beats, P }) {
  const n = beats.filter((b) => t >= b).length; // words shown so far
  const i = Math.max(0, n - 1);
  const k = E(t, beats[i], beats[i] + 0.28, 'draw');
  const prev = i > 0 ? WORDS[i - 1] : '';
  const bump = 1 + 0.06 * Math.exp(-(t - beats[i]) * 6);
  return <g>
    <Stage t={t} beams={false} />
    <circle cx="490" cy="470" r="360" fill={VIO} />
    <g transform={`translate(490 470) scale(${bump})`}>
      <FlipCard a={prev} b={WORDS[i]} k={k} num={n} />
    </g>
    {/* progress: 12 bulbs */}
    {WORDS.map((w, j) => <circle key={w} cx={490 - 5.5 * 62 + j * 62} cy="760" r="20" fill={j < n ? GOLD : LILAC} stroke={INKC} strokeWidth="4"
      transform={sc(490 - 5.5 * 62 + j * 62, 760, j === i ? bump : 1)} />)}
    <StoryMini x={140} y={920} dir={1} ph={t * 6} reach={0.5 + 0.5 * Math.sin(t * 4)} s={2} />
    {/* stopwatch tick */}
    <g transform="translate(850 870)">
      <circle r="52" fill={WHITE} stroke={INKC} strokeWidth="7" />
      <line x1="0" y1="0" x2="0" y2="-38" stroke={PINK} strokeWidth="7" strokeLinecap="round" transform={`rotate(${n * 30})`} />
      <circle r="6" fill={INKC} />
    </g>
  </g>;
}

/* 3 — which ones stuck: the grid of 12; the first few and the last few glow, the middle fades */
function SceneRecall({ t, P }) {
  const first = E(t, 2.0, 2.5, 'pop'), last = E(t, 3.2, 3.7, 'pop');
  return <g>
    <Stage t={t} beams={false} />
    {WORDS.map((w, j) => {
      const col = j % 3, row = Math.floor(j / 3);
      const x = 190 + col * 300, y = 200 + row * 170;
      const p = E(t, 0.1 + j * 0.06, 0.4 + j * 0.06, 'pop');
      const isF = j < 3, isL = j > 8;
      const glow = isF ? first : isL ? last : 0;
      const fade = !isF && !isL ? E(t, 2.6, 3.4) : 0;
      return <g key={w} transform={`translate(${x} ${y - 14 * glow}) scale(${p * (1 + 0.06 * glow)})`} opacity={1 - 0.6 * fade}>
        {glow > 0 && <rect x="-142" y="-72" width="284" height="144" rx="28" fill={GOLD} opacity={0.5 * Math.min(1, glow)} />}
        <rect x="-128" y="-60" width="256" height="120" rx="22" fill={glow > 0.5 ? GOLD : WHITE} stroke={INKC} strokeWidth="6" />
        <text x="0" y="22" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="44" fill={fade > 0.5 ? LILAC : VIO}>{fade > 0.7 ? '? ? ?' : w}</text>
        <text x="-108" y="-30" fontFamily={BODY} fontWeight="800" fontSize="24" fill={PINK}>{j + 1}</text>
      </g>;
    })}
  </g>;
}

/* 4 — Murdock, 1962: people hear lists, then write down what they remember, in any order */
function SceneStudy({ t, P }) {
  return <g>
    <Stage t={t} />
    <g opacity={E(t, 0, 0.4)}><StoryTag x={490} y={110} text="B. B. MURDOCK · 1962" size={40} /></g>
    {/* word cards streaming past */}
    {Array.from({ length: 8 }, (_, i) => {
      const x = md(1100 - (t - 0.8) * 260 + i * 170, 1360) - 190;
      const show = E(t, 0.8, 1.2);
      return <g key={i} transform={`translate(${x} 300) rotate(${(hsh(i) - 0.5) * 10})`} opacity={show}>
        <rect x="-78" y="-38" width="156" height="76" rx="16" fill={WHITE} stroke={INKC} strokeWidth="5" />
        <text x="0" y="14" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="36" fill={VIO}>{WORDS[(i * 5) % 12]}</text>
      </g>;
    })}
    {/* participants writing */}
    {Array.from({ length: 4 }, (_, i) => {
      const x = 170 + i * 215, p = E(t, 1.4 + i * 0.12, 1.8 + i * 0.12, 'pop');
      const write = E(t, 3.4, 3.8);
      return p > 0 ? <g key={i} transform={sc(x, 860, p)}>
        <StoryMini x={x} y={860} dir={i % 2 ? -1 : 1} reach={write * (0.5 + 0.5 * Math.sin(t * 9 + i))} s={2.4} />
        <g transform={`translate(${x + (i % 2 ? -88 : 88)} 790) rotate(${i % 2 ? 6 : -6}) scale(0.75)`} opacity={write}>
          <rect x="-56" y="-70" width="112" height="140" rx="10" fill={WHITE} stroke={INKC} strokeWidth="5" />
          {[0, 1, 2, 3].map((r) => <line key={r} x1="-38" y1={-40 + r * 28} x2={-38 + 76 * E(t, 3.6 + r * 0.35 + i * 0.1, 3.9 + r * 0.35 + i * 0.1)} y2={-40 + r * 28} stroke={VIO} strokeWidth="6" strokeLinecap="round" />)}
        </g>
      </g> : null;
    })}
    <g opacity={E(t, 3.4, 3.8)}><StoryTag x={490} y={480} text="RECALL · ANY ORDER" size={34} /></g>
  </g>;
}

/* 5 — the U-curve, drawn live like a scoreboard; PRIMACY, RECENCY, the middle sinks */
const CURVE = [0.62, 0.5, 0.41, 0.34, 0.3, 0.27, 0.25, 0.24, 0.23, 0.23, 0.23, 0.24, 0.25, 0.27, 0.31, 0.38, 0.5, 0.64, 0.79, 0.9];
function SceneCurve({ t, beats, P }) {
  const b1 = beats[1] ?? 99;
  const X0 = 140, X1 = 880, Y0 = 820, Y1 = 230;
  const draw = E(t, 0.4, 2.8, 'draw');
  const pts = CURVE.map((v, i) => [L(X0 + 20, X1 - 20, i / (CURVE.length - 1)), L(Y0, Y1, v)]);
  const nShow = draw * (CURVE.length - 1);
  const shown = pts.filter((_, i) => i <= nShow);
  const path = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const prim = E(t, b1 + 0.5, b1 + 0.9, 'pop'), rec = E(t, b1 + 2.5, b1 + 2.9, 'pop'), sink = E(t, b1 + 4.4, b1 + 4.9, 'pop');
  return <g>
    <rect x="-100" y="-100" width="1180" height="1180" fill={INKC} />
    {/* LED grid */}
    {Array.from({ length: 16 }, (_, i) => Array.from({ length: 12 }, (_, j) => <circle key={`${i}-${j}`} cx={X0 + i * 49} cy={Y1 + j * 54} r="3" fill={LILAC} opacity="0.35" />))}
    <path d={`M${X0},${Y1 - 40} L${X0},${Y0} L${X1},${Y0}`} fill="none" stroke={WHITE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <text x={X0} y={Y0 + 60} fontFamily={BODY} fontWeight="800" fontSize="32" fill={WHITE}>first</text>
    <text x={X1} y={Y0 + 60} textAnchor="end" fontFamily={BODY} fontWeight="800" fontSize="32" fill={WHITE}>last</text>
    <text x={490} y={Y0 + 60} textAnchor="middle" fontFamily={BODY} fontWeight="700" fontSize="30" fill={LILAC}>position in the list</text>
    <text x={X0 - 30} y={Y1 + 40} fontFamily={BODY} fontWeight="700" fontSize="30" fill={LILAC} transform={`rotate(-90 ${X0 - 30} ${Y1 + 40})`} textAnchor="end">recalled</text>
    {/* sink shading in the middle */}
    <rect x={X0 + 200} y={Y1} width={X1 - X0 - 420} height={Y0 - Y1} fill={PINK} opacity={0.14 * sink} />
    <path d={path} fill="none" stroke={GOLD} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
    <path d={path} fill="none" stroke={GOLD} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    {shown.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === Math.floor(nShow) && draw < 1 ? 14 : 9} fill={WHITE} stroke={GOLD} strokeWidth="4" />)}
    {prim > 0 && <g transform={`translate(${X0 + 150} ${Y1 + 80}) scale(${prim}) rotate(-6)`}>
      <rect x="-130" y="-40" width="260" height="80" rx="40" fill={GOLD} stroke={WHITE} strokeWidth="5" />
      <text x="0" y="16" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="48" fill={INKC}>PRIMACY</text>
    </g>}
    {rec > 0 && <g transform={`translate(${X1 - 170} ${Y1 - 10}) scale(${rec}) rotate(5)`}>
      <rect x="-130" y="-40" width="260" height="80" rx="40" fill={PINK} stroke={WHITE} strokeWidth="5" />
      <text x="0" y="16" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="48" fill={WHITE}>RECENCY</text>
    </g>}
    {sink > 0 && <g transform={`translate(490 ${L(560, 640, sink)})`} opacity={sink}>
      <path d="M0,-50 L0,40 M-30,10 L0,44 L30,10" fill="none" stroke={PINK} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </g>}
  </g>;
}

/* 6 — why: early words loop through rehearsal; the last ones still echo; the middle drifts off */
function SceneWhy({ t, beats, dur, P }) {
  const b1 = beats[1] ?? beats[0] + dur * 0.45; // second sentence of the line: the last words still echo
  const loop = E(t, 0.3, 0.8);
  const echo = E(t, b1, b1 + 0.5);
  return <g>
    <Stage t={t} beams={false} />
    {WORDS.map((w, j) => {
      const y = 120 + j * 64;
      const isF = j < 3, isL = j > 8;
      const drift = !isF && !isL ? E(t, 1.0 + j * 0.1, 3.4 + j * 0.1) : 0;
      const pulse = isF ? 1 + 0.06 * Math.sin(t * 8 - j) * loop : isL ? 1 + 0.06 * Math.sin(t * 6 - j) * echo : 1;
      return <g key={w} transform={`translate(${300 + 60 * drift} ${y}) scale(${pulse})`} opacity={1 - 0.75 * drift}>
        <rect x="-110" y="-25" width="220" height="50" rx="14" fill={isF ? GOLD : isL ? PINK : WHITE} stroke={INKC} strokeWidth="4" />
        <text x="0" y="12" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="34" fill={isL ? WHITE : VIO}>{w}</text>
      </g>;
    })}
    {/* rehearsal loop around the first words */}
    <g transform="translate(560 184)" opacity={loop}>
      <path d={`M0,-60 A60 60 0 1 1 -52,30`} fill="none" stroke={GOLD} strokeWidth="10" strokeLinecap="round" transform={`rotate(${t * 220})`} />
      <polygon points="-70,22 -40,44 -36,10" fill={GOLD} transform={`rotate(${t * 220})`} />
      <text x="90" y="12" fontFamily={HEAD} fontWeight="800" fontSize="40" fill={GOLD}>rehearsed</text>
    </g>
    {/* the head with the last words still echoing */}
    <g opacity={echo}>
      <Host x={790} y={990} s={1.15} t={t} look={[-0.9, -0.4]} smile={0.4} />
      {[0, 1, 2].map((k) => { const r = 30 + md(t * 70 + k * 30, 90); return <circle key={k} cx="610" cy="830" r={r} fill="none" stroke={PINK} strokeWidth="6" opacity={1 - r / 125} />; })}
      <text x="700" y="700" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="40" fill={PINK}>still echoing</text>
    </g>
  </g>;
}

/* 7 — takeaway: the key point moves to the first slot (or last), never the middle; save it */
function SceneTakeaway({ t, beats, P }) {
  const b1 = beats[1] ?? 99;
  const move = E(t, 2.1, 3.0, 'draw');
  const star = E(t, 3.3, 3.7, 'pop');
  const zap = E(t, b1 + 0.5, b1 + 0.9, 'pop');
  const save = E(t, b1 + 2.1, b1 + 2.5, 'pop');
  const slots = [[220, 'FIRST'], [490, 'MIDDLE'], [760, 'LAST']];
  return <g>
    <Stage t={t} />
    {slots.map(([x, label], i) => <g key={label}>
      <rect x={x - 120} y="300" width="240" height="320" rx="26" fill={i === 1 ? VIO : WHITE} stroke={INKC} strokeWidth="7" opacity={i === 1 ? 0.8 : 1} />
      <text x={x} y="680" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="44" fill={i === 1 ? LILAC : GOLD}>{label}</text>
      {i !== 1 && [0, 1, 2].map((r) => <rect key={r} x={x - 80} y={510 + r * 30} width={i === 0 && r === 0 ? 0 : 160 - r * 30} height="12" rx="6" fill={LILAC} opacity="0.5" />)}
    </g>)}
    {/* the key point card */}
    <g transform={`translate(${L(490, 220, move)} ${L(420, 400, move) - 40 * Math.sin(move * Math.PI)}) rotate(${-8 * Math.sin(move * Math.PI)})`}>
      <rect x="-100" y="-80" width="200" height="160" rx="22" fill={GOLD} stroke={INKC} strokeWidth="7" />
      <text x="0" y="-10" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="40" fill={INKC}>KEY</text>
      <text x="0" y="36" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="40" fill={INKC}>POINT</text>
      {star > 0 && <polygon points={burst(18, 40, 5)} fill={PINK} stroke={INKC} strokeWidth="4" transform={`translate(90 -80) scale(${star}) rotate(${t * 40})`} />}
    </g>
    {zap > 0 && <g transform={`translate(490 460) scale(${zap}) rotate(-10)`}>
      <rect x="-150" y="-50" width="300" height="100" rx="18" fill={PINK} stroke={INKC} strokeWidth="6" />
      <text x="0" y="22" textAnchor="middle" fontFamily={HEAD} fontWeight="800" fontSize="58" fill={WHITE}>NOT HERE</text>
    </g>}
    <Host x={490} y={1040} s={1.0} t={t} look={[-0.6 + 0.6 * zap, -0.6]} smile={0.8} brow={0.4} />
    {save > 0 && <g transform={`translate(850 160) scale(${save})`}>
      <path d="M-50,-72 L50,-72 L50,72 L0,36 L-50,72 Z" fill={GOLD} stroke={INKC} strokeWidth="7" strokeLinejoin="round" />
      <polygon points={burst(12, 26, 5)} fill={PINK} stroke={INKC} strokeWidth="3" transform="translate(0 -18)" />
    </g>}
  </g>;
}

Object.assign(window, { SceneHook, SceneList, SceneRecall, SceneStudy, SceneCurve, SceneWhy, SceneTakeaway });
