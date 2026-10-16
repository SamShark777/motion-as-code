// Stroop effect — story Short scenes (980×980 stage). Pure functions of t (seconds into the scene);
// beats[i] = when narration line i of the scene starts. Kit: shorts/design_kit/story-kit.jsx.
const { K, L, E, win, kf, camT, burst, sc, md } = SK;
const INKS = { red: '#F0303C', blue: '#1750C9', green: '#22B04B', pink: '#EA43E8', orange: '#F07A1A' };
const HEADF = "'Barlow Condensed', 'Arial Narrow', sans-serif";
const blink = (t, seed = 0) => (md(t + seed, 3.3) < 0.12 ? 0.9 : 0);

function Word({ x, y, text, ink, size = 160, s = 1, rot = 0, o = 1, P }) {
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <text x="0" y={size * 0.35} textAnchor="middle" fontFamily={HEADF} fontWeight="800" fontSize={size} fill={ink}
      stroke={P.ink} strokeWidth={size * 0.035} paintOrder="stroke" letterSpacing="2">{text}</text>
  </g>;
}

function Stopwatch({ x, y, r = 64, ang, P }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-12" y={-r - 26} width="24" height="20" rx="4" fill={P.ink} />
    <circle r={r} fill={P.paper} stroke={P.ink} strokeWidth="8" />
    {[0, 90, 180, 270].map((a) => <line key={a} x1="0" y1={-r + 12} x2="0" y2={-r + 24} stroke={P.ink} strokeWidth="5" transform={`rotate(${a})`} />)}
    <line x1="0" y1="0" x2="0" y2={-r + 16} stroke={P.hot} strokeWidth="7" strokeLinecap="round" transform={`rotate(${ang})`} />
    <circle r="7" fill={P.ink} />
  </g>;
}

/* 1 — a giant RED in blue ink; the protagonist reaches for it and stalls */
function SceneHook({ t, beats, dur, P }) {
  const b1 = beats[1] ?? 99;
  const cam = { fx: 490, fy: 520, s: L(1, 1.08, E(t, 0, dur, 'draw')), px: 490, py: 520 };
  const wp = E(t, 0.15, 0.6, 'pop');
  const jit = t > b1 ? 14 * Math.sin((t - b1) * 42) * Math.exp(-(t - b1) * 3.2) : 0;
  const ghost = win(t, b1, b1 + 0.9, 0.08);
  const stall = win(t, b1, b1 + 1.0, 0.15);
  const raise = E(t, 0.5, 1.0, 'draw');
  const q = E(t, b1 + 0.15, b1 + 0.5, 'pop');
  return <g transform={camT(cam)}>
    <rect x="-200" y="-200" width="1380" height="1380" fill={P.paper} />
    <circle cx="560" cy="420" r="330" fill={P.soft} opacity="0.55" />
    <polygon points="-40,-40 260,-40 -40,420" fill={P.cool} opacity="0.35" />
    {ghost > 0 && <Word x={490 - jit * 1.6} y={400} text="RED" ink={INKS.red} size={300} s={wp} o={0.45 * ghost} P={P} />}
    <Word x={490 + jit} y={400} text="RED" ink={INKS.blue} size={300} s={wp} rot={jit * 0.2} P={P} />
    <StoryBust x={300} y={1010} s={1.45} look={[0.7, -0.95]} brow={L(0.2, 1, stall)} lid={blink(t)} smile={L(0.35, -0.3, stall)} open={0.35 * stall} tilt={L(-3, 5, stall)} />
    <StoryArm x={422} y={894} s={1.4} a1={L(40, -55, raise)} a2={L(80, -70, raise)} hand="point" />
    {q > 0 && <g>
      <text x="170" y="560" fontFamily={HEADF} fontWeight="800" fontSize={110 * q} fill={P.accent} stroke={P.ink} strokeWidth="4" paintOrder="stroke" transform="rotate(-12 170 560)">?</text>
      <text x="80" y="650" fontFamily={HEADF} fontWeight="800" fontSize={70 * q} fill={P.hot} stroke={P.ink} strokeWidth="3" paintOrder="stroke" transform="rotate(10 80 650)">?</text>
    </g>}
  </g>;
}

/* 2 — three clashing words pop in; a stopwatch ticks */
const TRY = [['GREEN', 'pink', -4], ['BLUE', 'orange', 3], ['PINK', 'green', -2]];
function SceneTry({ t, P }) {
  return <g>
    <rect width="980" height="980" fill="#EEFBFD" />
    {Array.from({ length: 11 }, (_, i) => Array.from({ length: 11 }, (_, j) =>
      <circle key={`${i}-${j}`} cx={45 + i * 90} cy={45 + j * 90} r="4" fill={P.cool} opacity="0.7" />))}
    {TRY.map(([w, ink, rot], i) => {
      const p = E(t, 0.3 + i * 0.45, 0.75 + i * 0.45, 'pop');
      const y = 250 + i * 235, x = 430 + (i - 1) * 40;
      return <g key={w} transform={`translate(${x} ${y}) rotate(${rot}) scale(${p})`}>
        <rect x="-300" y="-100" width="600" height="200" rx="26" fill={P.paper} stroke={P.ink} strokeWidth="8" />
        <Word x={0} y={0} text={w} ink={INKS[ink]} size={170} P={P} />
      </g>;
    })}
    <g transform={sc(835, 170, E(t, 0.1, 0.5, 'pop'))}>
      <Stopwatch x={835} y={170} r={80} ang={Math.floor(Math.max(0, t - 1.5) * 2) * 30} P={P} />
    </g>
    <StoryMini x={860} y={930} dir={-1} reach={win(t, 1.3, 9, 0.3)} s={2.2} />
  </g>;
}

/* 3 — Stroop, 1935: a sheet of colour squares, a sheet of clashing words, a hundred students */
const SQ = ['red', 'blue', 'green', 'pink', 'orange'];
const WORDS = [['RED', 'green'], ['BLUE', 'pink'], ['GREEN', 'red'], ['PINK', 'blue'], ['BLUE', 'orange'], ['RED', 'blue']];
function SceneStudy({ t, P }) {
  const s1 = E(t, 0.15, 0.75), s2 = E(t, 0.7, 1.3);
  return <g>
    <rect width="980" height="980" fill="#F5ECFF" />
    <StoryTag x={490} y={92} text="J. R. STROOP · 1935" size={40} o={E(t, 0, 0.4)} />
    <g transform={`translate(${280} ${L(1100, 400, s1)}) rotate(-5)`}>
      <rect x="-190" y="-230" width="380" height="460" rx="14" fill={P.paper} stroke={P.ink} strokeWidth="7" />
      {Array.from({ length: 30 }, (_, k) => {
        const i = k % 5, j = Math.floor(k / 5);
        const p = E(t, 0.6 + k * 0.03, 0.9 + k * 0.03, 'pop');
        return <rect key={k} x={-150 + i * 62} y={-195 + j * 66} width={46 * p} height={46 * p} rx="6" fill={INKS[SQ[(i + j * 2) % 5]]} stroke={P.ink} strokeWidth="3" />;
      })}
    </g>
    <g transform={`translate(${700} ${L(1100, 410, s2)}) rotate(4)`}>
      <rect x="-190" y="-230" width="380" height="460" rx="14" fill={P.paper} stroke={P.ink} strokeWidth="7" />
      {WORDS.map(([w, ink], j) => <text key={j} x={j % 2 ? 60 : -60} y={-170 + j * 74} textAnchor="middle" fontFamily={HEADF} fontWeight="800" fontSize="58" fill={INKS[ink]}
        opacity={E(t, 1.2 + j * 0.08, 1.45 + j * 0.08)}>{w}</text>)}
    </g>
    {Array.from({ length: 10 }, (_, i) => {
      const p = E(t, 1.8 + i * 0.09, 2.2 + i * 0.09, 'pop');
      return p > 0 ? <g key={i} transform={sc(85 + i * 90, 880, p)}><StoryMini x={85 + i * 90} y={880} dir={i % 2 ? -1 : 1} ph={t * 9 + i} s={1.25} /></g> : null;
    })}
    <StoryTag x={490} y={935} text="100 STUDENTS" size={30} o={E(t, 2.6, 3.0)} />
  </g>;
}

/* 4 — the timing bars: squares 63 s vs clashing words 110 s, +74% */
function SceneStat({ t, beats, P }) {
  const b0 = beats[0], b1 = beats[1] ?? 99;
  const k1 = E(t, b0 + 0.4, b0 + 2.4, 'draw'), k2 = E(t, b1 + 0.3, b1 + 2.9, 'draw');
  const MAX = 700, X0 = 140;
  const stamp = E(t, b1 + 3.2, b1 + 3.6, 'pop');
  const bar = (y, w, fill, label, val, show) => <g opacity={show}>
    <text x={X0} y={y - 50} fontFamily={HEADF} fontWeight="800" fontSize="44" fill={P.ink} letterSpacing="1.5">{label}</text>
    <rect x={X0} y={y - 30} width={MAX} height="96" rx="20" fill={P.soft} opacity="0.5" />
    <rect x={X0} y={y - 30} width={Math.max(0, w)} height="96" rx="20" fill={fill} stroke={P.ink} strokeWidth="6" />
    {w > 40 && <text x={X0 + w + 18} y={y + 38} fontFamily={HEADF} fontWeight="800" fontSize="64" fill={P.ink}>{val}</text>}
  </g>;
  return <g>
    <rect width="980" height="980" fill={P.paper} />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 140 - 40} y="0" width="60" height="980" fill={P.soft} opacity="0.18" transform="skewX(-12)" />)}
    <g transform={sc(840, 120, E(t, 0, 0.4, 'pop'))}><Stopwatch x={840} y={120} r={62} ang={t * 140} P={P} /></g>
    {bar(300, MAX * 63 / 110 * k1, P.cool, 'COLOR SQUARES', `${Math.round(63 * k1)} s`, E(t, b0, b0 + 0.4))}
    {[0, 1, 2, 3].map((i) => <rect key={i} x={X0 + 410 + i * 52} y={222} width="40" height="40" rx="6" fill={INKS[SQ[i]]} stroke={P.ink} strokeWidth="3" opacity={E(t, b0 + 0.2, b0 + 0.6)} />)}
    {bar(580, MAX * k2, INKS.pink, 'INK vs WORD', `${Math.round(110 * k2)} s`, E(t, b1, b1 + 0.4))}
    <text x={X0 + 330} y={530} fontFamily={HEADF} fontWeight="800" fontSize="44" fill={INKS.blue} opacity={E(t, b1 + 0.2, b1 + 0.6)}>RED</text>
    {stamp > 0 && <g transform={`translate(650 820) rotate(-8) scale(${stamp})`}>
      <polygon points={burst(105, 150, 14)} fill={P.pop} stroke={P.ink} strokeWidth="6" strokeLinejoin="round" />
      <text x="0" y="34" textAnchor="middle" fontFamily={HEADF} fontWeight="800" fontSize="104" fill={P.ink}>+74%</text>
    </g>}
  </g>;
}

/* 5 — why: reading takes the fast lane and has to be braked; the colour arrives after */
function SceneWhy({ t, beats, P }) {
  const b0 = beats[0], b1 = beats[1] ?? 99;
  const fast = E(t, b0 + 0.3, b0 + 1.1, 'enter');
  const gate = E(t, b1 + 0.6, b1 + 1.0, 'pop');
  const shove = t > b1 + 0.9 ? 10 * Math.sin((t - b1 - 0.9) * 38) * Math.exp(-(t - b1 - 0.9) * 4) : 0;
  const slow = E(t, b0 + 0.6, b1 + 1.9, 'draw');
  const ans = E(t, b1 + 2.0, b1 + 2.4, 'pop');
  const topX = L(300, 640, fast) - 50 * E(t, b1 + 0.9, b1 + 1.3) + shove;
  const lane = (y, label, tagY) => <g>
    <rect x="270" y={y - 55} width="500" height="110" rx="55" fill={P.paper} opacity="0.14" />
    <line x1="310" y1={y} x2="730" y2={y} stroke={P.paper} strokeWidth="5" strokeDasharray="24 20" opacity="0.5" />
    <StoryTag x={520} y={tagY} text={label} size={34} />
  </g>;
  return <g>
    <rect width="980" height="980" fill={P.deep} />
    <circle cx="840" cy="500" r="260" fill={P.accent} opacity="0.35" />
    {lane(360, 'READING · FAST', 270)}
    {lane(640, 'COLOR · SLOW', 735)}
    <g transform="translate(150 500) rotate(-6)">
      <rect x="-120" y="-80" width="240" height="160" rx="20" fill={P.paper} stroke={P.ink} strokeWidth="7" />
      <Word x={0} y={0} text="BLUE" ink={INKS.red} size={110} P={P} />
    </g>
    {/* fast chip: the word's meaning */}
    <g transform={`translate(${topX} 360)`} opacity={1 - 0.45 * E(t, b1 + 1.0, b1 + 1.4)}>
      <rect x="-80" y="-42" width="160" height="84" rx="42" fill={P.paper} stroke={P.ink} strokeWidth="6" />
      <text x="0" y="22" textAnchor="middle" fontFamily={HEADF} fontWeight="800" fontSize="58" fill={P.ink}>“BLUE”</text>
      {fast < 1 && fast > 0 && <path d="M-100,-20 L-170,-20 M-100,0 L-200,0 M-100,20 L-160,20" stroke={P.cool} strokeWidth="6" strokeLinecap="round" />}
    </g>
    {/* the brake */}
    {gate > 0 && <g transform={`translate(720 ${L(180, 360, gate)})`}>
      <rect x="-16" y="-90" width="32" height="180" rx="10" fill={P.paper} stroke={P.ink} strokeWidth="6" />
      {[-60, -10, 40].map((y) => <rect key={y} x="-16" y={y} width="32" height="26" fill={INKS.red} />)}
    </g>}
    {/* slow chip: the ink colour */}
    <g transform={`translate(${L(300, 700, slow)} 640)`}>
      <circle r="42" fill={INKS.red} stroke={P.ink} strokeWidth="6" />
    </g>
    {/* the answer */}
    <g transform="translate(860 500)">
      <path d="M-90,-80 L90,-80 Q110,-80 110,-60 L110,50 Q110,70 90,70 L-10,70 L-50,110 L-40,70 L-90,70 Q-110,70 -110,50 L-110,-60 Q-110,-80 -90,-80 Z" fill={P.paper} stroke={P.ink} strokeWidth="7" strokeLinejoin="round" transform="scale(0.85)" />
      {ans > 0 && <text x="0" y="16" textAnchor="middle" fontFamily={HEADF} fontWeight="800" fontSize={70 * ans} fill={INKS.red} stroke={P.ink} strokeWidth="3" paintOrder="stroke">RED!</text>}
    </g>
  </g>;
}

/* 6 — takeaway: pause, raise a finger, check; save it */
function SceneTakeaway({ t, beats, P }) {
  const b1 = beats[1] ?? 99, b2 = beats[2] ?? 99;
  const lift = E(t, b1 + 1.6, b1 + 2.2, 'draw');
  const pause = E(t, b1 + 2.3, b1 + 2.7, 'pop');
  const check = E(t, b1 + 3.3, b1 + 3.9, 'draw');
  const save = E(t, b2 + 0.25, b2 + 0.7, 'pop');
  return <g>
    <rect width="980" height="980" fill={P.paper} />
    <circle cx="490" cy="640" r="380" fill={P.pop} opacity={0.18 + 0.12 * check} />
    <StoryBust x={490} y={1020} s={1.6} look={[0.15 * Math.sin(t * 0.8), -0.5]} brow={0.15} lid={blink(t, 1.1)} smile={L(0.25, 0.7, Math.max(check, E(t, 0.2, 1)))} />
    <StoryArm x={624} y={892} s={1.5} a1={L(80, -75, lift)} a2={L(100, -100, lift)} hand={lift > 0.5 ? 'point' : 'relax'} />
    <StoryArm x={356} y={892} s={1.5} a1={100} a2={95} hand="relax" flip />
    {pause > 0 && <g transform={`translate(220 300) scale(${pause})`}>
      <circle r="105" fill={P.cool} stroke={P.ink} strokeWidth="8" />
      <rect x="-38" y="-48" width="26" height="96" rx="8" fill={P.ink} /><rect x="12" y="-48" width="26" height="96" rx="8" fill={P.ink} />
    </g>}
    {check > 0 && <g transform="translate(760 300)">
      <circle r="105" fill={P.paper} stroke={P.ink} strokeWidth="8" />
      <path d="M-50,0 L-14,38 L54,-42" fill="none" stroke={P.ink} strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" strokeDashoffset={200 * (1 - check)} />
      <path d="M-50,0 L-14,38 L54,-42" fill="none" stroke={INKS.green} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" strokeDashoffset={200 * (1 - check)} />
    </g>}
    {save > 0 && <g transform={`translate(490 190) scale(${save})`}>
      <path d="M-55,-80 L55,-80 L55,80 L0,40 L-55,80 Z" fill={P.accent} stroke={P.ink} strokeWidth="8" strokeLinejoin="round" />
      <polygon points={burst(14, 30, 5)} fill={P.pop} stroke={P.ink} strokeWidth="4" transform="translate(0 -20)" />
    </g>}
  </g>;
}

Object.assign(window, { SceneHook, SceneTry, SceneStudy, SceneStat, SceneWhy, SceneTakeaway });
