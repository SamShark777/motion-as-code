// Social loafing — story Short scenes (980×980 stage). Warm risograph print: grainy riso blue and
// fluorescent pink overprint, slightly misregistered; a tug-of-war rope and bouncy little figures.
// Pure functions of t; beats[i] = start of line i in the scene. Kit: shorts/design_kit/story-kit.jsx.
const { K, L, E, win, kf, camT, burst, sc, md, hsh } = SK;
const RB = '#0078BF', RP = '#FF48B0', PAPER = '#F4EEE2', NAVY = '#14213D', YEL = '#FFE45C';
const FONT = "'Rubik', 'Helvetica Neue', sans-serif";

/* label pill sized for Rubik */
function Tag({ x, y, text, size = 30, o = 1, fill = NAVY }) {
  const w = text.length * size * 0.66 + 44;
  return <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-w / 2 + 5} y={-size * 0.75 + 4} width={w} height={size * 1.5} rx={size * 0.4} fill={RP} opacity="0.8" />
    <rect x={-w / 2} y={-size * 0.75} width={w} height={size * 1.5} rx={size * 0.4} fill={fill} />
    <text x="0" y={size * 0.36} textAnchor="middle" fill={PAPER} fontFamily={FONT} fontWeight="800" fontSize={size} letterSpacing="1">{text}</text>
  </g>;
}

/* paper + riso grain (two misregistered dot screens) */
function Paper({ id, tint }) {
  return <g>
    <defs>
      <pattern id={`${id}b`} width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1.3" fill={RB} opacity="0.22" /><circle cx="10" cy="11" r="0.9" fill={RB} opacity="0.18" /></pattern>
      <pattern id={`${id}p`} width="17" height="17" patternUnits="userSpaceOnUse"><circle cx="8" cy="3" r="1.1" fill={RP} opacity="0.2" /><circle cx="2" cy="12" r="0.8" fill={RP} opacity="0.16" /></pattern>
    </defs>
    <rect x="-300" y="-300" width="1580" height="1580" fill={tint || PAPER} />
    <rect x="-300" y="-300" width="1580" height="1580" fill={`url(#${id}b)`} />
    <rect x="-300" y="-300" width="1580" height="1580" fill={`url(#${id}p)`} />
  </g>;
}

/* misregistered overprint: the same shape in pink (offset) under blue, multiplied like riso ink */
function Riso({ children, dx = 7, dy = 5, under = RP }) {
  return <g>
    <g transform={`translate(${dx} ${dy})`} style={{ mixBlendMode: 'multiply' }} opacity="0.85">{children(under)}</g>
    <g style={{ mixBlendMode: 'multiply' }}>{children(RB)}</g>
  </g>;
}

/* a bouncy little figure; (x, y) at the feet. lean (deg, + = leaning back right-to-left pull), arms reach to (ax, ay) relative */
function Fig({ x, y, s = 1, c = RB, lean = 0, bob = 0, mouth = 0, eyes = 'dot', ax = 40, ay = -60, sweat = 0, t = 0, seed = 0 }) {
  const by = -Math.abs(Math.sin(bob)) * 10;
  const hx = Math.sin(-lean * Math.PI / 180) * 90;
  return <g transform={`translate(${x} ${y + by}) scale(${s})`}>
    <path d="M-14,0 L-6,-38 M14,0 L6,-38" stroke={NAVY} strokeWidth="9" strokeLinecap="round" />
    <g transform={`rotate(${-lean} 0 -38)`}>
      <rect x="-24" y="-100" width="48" height="66" rx="22" fill={c} style={{ mixBlendMode: 'multiply' }} />
      <rect x="-24" y="-100" width="48" height="66" rx="22" fill="none" stroke={NAVY} strokeWidth="4" />
      <path d={`M0,-80 L${ax},${ay}`} stroke={NAVY} strokeWidth="9" strokeLinecap="round" />
      <circle cx="0" cy="-128" r="27" fill="#FFD4C4" stroke={NAVY} strokeWidth="4" />
      {eyes === 'dot' && <g><circle cx="-9" cy="-131" r="3.6" fill={NAVY} /><circle cx="9" cy="-131" r="3.6" fill={NAVY} /></g>}
      {eyes === 'squeeze' && <path d="M-15,-134 L-5,-130 L-15,-126 M15,-134 L5,-130 L15,-126" fill="none" stroke={NAVY} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}
      {eyes === 'sleepy' && <path d="M-14,-130 L-4,-130 M4,-130 L14,-130" stroke={NAVY} strokeWidth="3.5" strokeLinecap="round" />}
      {eyes === 'blind' && <rect x="-28" y="-140" width="56" height="16" rx="6" fill={NAVY} />}
      {mouth > 0.05 ? <ellipse cx="0" cy="-113" rx={5 + mouth * 5} ry={3 + mouth * 9} fill={NAVY} /> : <path d="M-7,-114 Q0,-109 7,-114" fill="none" stroke={NAVY} strokeWidth="3.5" strokeLinecap="round" />}
      {sweat > 0 && [0, 1].map((i) => { const k = md(t * 1.4 + i * 0.5 + seed, 1); return <path key={i} d="M0,-8 Q6,2 0,6 Q-6,2 0,-8 Z" fill="#7FC4EA" stroke={NAVY} strokeWidth="2" opacity={sweat * (1 - k)} transform={`translate(${26 + i * 8} ${-150 + k * 40})`} />; })}
    </g>
  </g>;
}

/* 1 — hook: a group-project cover with five names; four lounge, one works; the protagonist notices */
const NAMES = ['MAYA', 'LEO', 'PRIYA', 'SAM', 'JONAH'];
function SceneHook({ t, beats, dur, P }) {
  const cam = { fx: 490, fy: 500, s: L(1, 1.08, E(t, 0, dur, 'draw')), px: 490, py: 500 };
  const cover = E(t, 0.1, 0.6, 'pop');
  const spot = E(t, 2.9, 3.3, 'pop');
  return <g transform={camT(cam)}>
    <Paper id="hk" />
    <Riso>{(c) => <circle cx="640" cy="420" r="300" fill={c} opacity="0.2" />}</Riso>
    <g transform={`translate(380 420) rotate(-5) scale(${cover})`}>
      <rect x="-230" y="-300" width="460" height="600" rx="16" fill="#FFFFFF" stroke={NAVY} strokeWidth="7" />
      <rect x="-230" y="-300" width="460" height="130" rx="16" fill={RB} style={{ mixBlendMode: 'multiply' }} />
      <text x="0" y="-222" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="50" fill="#FFFFFF">GROUP</text>
      <text x="0" y="-176" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="50" fill="#FFFFFF">PROJECT</text>
      {NAMES.map((n, i) => {
        const p = E(t, 0.9 + i * 0.18, 1.2 + i * 0.18, 'pop');
        const y = -90 + i * 84, hot = i === 2;
        return <g key={n} opacity={Math.min(1, p)} transform={`translate(${(1 - p) * -30} 0)`}>
          <circle cx="-170" cy={y - 12} r="20" fill={hot ? RP : RB} opacity="0.85" />
          <text x="-135" y={y} fontFamily={FONT} fontWeight="700" fontSize="44" fill={NAVY}>{n}</text>
          {hot && spot > 0 && <ellipse cx="-50" cy={y - 14} rx={200 * spot} ry={42 * spot} fill="none" stroke={RP} strokeWidth="9" transform={`rotate(-3 -50 ${y - 14})`} />}
          {!hot && spot > 0 && <text x="120" y={y} fontFamily={FONT} fontWeight="700" fontSize="34" fill={RB} opacity={spot}>zzz</text>}
        </g>;
      })}
    </g>
    {/* the protagonist, the one who notices */}
    <StoryBust x={800} y={960} s={1.3} look={[-0.9, -0.6]} brow={L(0, 0.9, spot)} lid={md(t, 3.2) < 0.12 ? 0.9 : 0} smile={L(0.2, -0.2, spot)} tilt={L(0, -6, spot)} />
    {spot > 0 && <g transform={`translate(660 560) scale(${spot}) rotate(-10)`}>
      <text fontFamily={FONT} fontWeight="900" fontSize="120" fill={RP} stroke={NAVY} strokeWidth="4" paintOrder="stroke">?</text>
    </g>}
  </g>;
}

/* 2 — tug of war: one figure pulls hard; as more join, each leans back a little less */
const JOIN = [0, 2.6, 3.2, 3.8, 4.4];
function SceneRope({ t, dur, P }) {
  const cam = { fx: 490, fy: 560, s: L(1.12, 0.98, E(t, 0, 5.2, 'draw')), px: 490, py: 560 };
  const n = JOIN.filter((j) => t >= j).length;
  const per = [1, 0.86, 0.74, 0.62, 0.5][n - 1];
  return <g transform={camT(cam)}>
    <Paper id="rp" />
    <Riso>{(c) => <rect x="-200" y="700" width="1400" height="400" fill={c} opacity="0.18" />}</Riso>
    {/* the anchor: a heavy crate with a pull meter */}
    <g transform="translate(860 640)">
      <rect x="-70" y="-60" width="140" height="120" rx="10" fill={RP} stroke={NAVY} strokeWidth="6" style={{ mixBlendMode: 'multiply' }} />
      <path d="M-70,-60 L70,60 M70,-60 L-70,60" stroke={NAVY} strokeWidth="5" opacity="0.6" />
    </g>
    <path d={`M790,600 Q500,${612 + 6 * Math.sin(t * 5)} 60,600`} fill="none" stroke="#C9A36B" strokeWidth="16" strokeLinecap="round" />
    <path d={`M790,600 Q500,${612 + 6 * Math.sin(t * 5)} 60,600`} fill="none" stroke={NAVY} strokeWidth="3" strokeDasharray="10 14" opacity="0.6" />
    {JOIN.map((j, i) => {
      const p = E(t, j, j + 0.45, 'pop');
      if (p <= 0) return null;
      const x = 640 - i * 130;
      const myEff = n === 1 ? 1 : per * (1 - i * 0.04);
      const lean = L(4, 26, myEff);
      return <g key={i} transform={sc(x, 760, Math.min(p, 1.05))}>
        <Fig x={x} y={760} s={1.25} c={i % 2 ? RP : RB} lean={lean} bob={t * 3 + i} ax={60} ay={-60} eyes={myEff > 0.8 ? 'squeeze' : myEff > 0.6 ? 'dot' : 'sleepy'} sweat={myEff > 0.8 ? 1 : 0} t={t} seed={i} />
        {/* each person's effort bar */}
        <g transform={`translate(${x - 40} 520)`}>
          <rect x="0" y="0" width="80" height="18" rx="9" fill="#FFFFFF" stroke={NAVY} strokeWidth="3" />
          <rect x="0" y="0" width={80 * myEff} height="18" rx="9" fill={myEff > 0.8 ? RP : RB} />
        </g>
      </g>;
    })}
    <Tag x={400} y={420} text="EACH PULLS LESS" size={36} o={E(t, 4.8, 5.3)} />
  </g>;
}

/* 3 — the 1979 study: students shouting and clapping, a sound meter in the middle */
function SceneStudy({ t, P }) {
  const meter = 0.55 + 0.35 * Math.abs(Math.sin(t * 6)) * E(t, 3.3, 3.8);
  return <g>
    <Paper id="st" tint="#EEF4F8" />
    <Tag x={490} y={90} text="LATANÉ · WILLIAMS · HARKINS · 1979" size={30} o={E(t, 0, 0.4)} />
    {/* the meter */}
    <g transform={`translate(490 470) scale(${E(t, 0.3, 0.8, 'pop')})`}>
      <path d="M-160,40 A160 160 0 0 1 160,40" fill="none" stroke={NAVY} strokeWidth="30" strokeLinecap="round" />
      <path d="M-160,40 A160 160 0 0 1 160,40" fill="none" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" />
      <path d="M-160,40 A160 160 0 0 1 160,40" fill="none" stroke={RP} strokeWidth="20" strokeLinecap="round" strokeDasharray="503" strokeDashoffset={503 * (1 - meter)} />
      <line x1="0" y1="40" x2={Math.cos(Math.PI * (1 + meter)) * 130} y2={40 + Math.sin(Math.PI * (1 + meter)) * 130} stroke={NAVY} strokeWidth="10" strokeLinecap="round" />
      <circle cx="0" cy="40" r="16" fill={NAVY} />
      <text x="0" y="110" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="40" fill={NAVY}>dB</text>
    </g>
    {/* a semicircle of students: shout, then clap */}
    {Array.from({ length: 6 }, (_, i) => {
      const a = Math.PI * (0.08 + i * 0.168), x = 490 - Math.cos(a) * 380, y = 880 - Math.sin(a) * 120;
      const p = E(t, 0.8 + i * 0.12, 1.2 + i * 0.12, 'pop');
      const shout = win(t, 1.8 + i * 0.1, 9, 0.2);
      const clap = t > 3.4 ? Math.abs(Math.sin(t * 9 + i)) : 0;
      return p > 0 ? <g key={i} transform={sc(x, y, p)}>
        <Fig x={x} y={y} s={1.0} c={i % 2 ? RP : RB} bob={t * 4 + i} mouth={shout * (0.6 + 0.4 * Math.abs(Math.sin(t * 7 + i)))} ax={x < 490 ? 30 + 20 * clap : -30 - 20 * clap} ay={-100} eyes="squeeze" />
        {shout > 0 && [0, 1, 2].map((k) => { const r = 20 + md(t * 60 + k * 25, 75); return <path key={k} d={`M${-r * 0.5},${-r} A${r} ${r} 0 0 1 ${r * 0.5},${-r}`} fill="none" stroke={i % 2 ? RP : RB} strokeWidth="5" strokeLinecap="round" opacity={shout * (1 - r / 95)} transform={`translate(${x} ${y - 140})`} />; })}
      </g> : null;
    })}
    <Tag x={490} y={170} text="SHOUT · CLAP · AS LOUD AS YOU CAN" size={26} fill={RB} o={E(t, 3.4, 3.8)} />
  </g>;
}

/* 4 — noise per person: alone 100%, pairs 71%, six 40% */
const BARS = [['ALONE', 100, 1], ['PAIRS', 71, 2], ['SIX', 40, 6]];
function SceneStat({ t, beats, P }) {
  const b0 = beats[0], b1 = beats[1] ?? 99;
  const at = [b0 + 0.1, b0 + 1.0, b1 + 0.3];
  const BASE = 820, MAXH = 520;
  return <g>
    <Paper id="sa" />
    <line x1="80" y1={BASE} x2="900" y2={BASE} stroke={NAVY} strokeWidth="6" strokeLinecap="round" />
    {BARS.map(([label, v, n], i) => {
      const k = E(t, at[i], at[i] + 1.4, 'draw');
      const x = 230 + i * 260, h = MAXH * (v / 100) * k;
      return <g key={label} opacity={E(t, at[i], at[i] + 0.3)}>
        <rect x={x - 82} y={BASE - h - 6} width="180" height={h} rx="14" fill={RP} opacity="0.55" style={{ mixBlendMode: 'multiply' }} />
        <rect x={x - 90} y={BASE - h} width="180" height={h} rx="14" fill={[ '#7FC4EA', RB, RP ][i]} />
        <rect x={x - 90} y={BASE - h} width="180" height={h} rx="14" fill="none" stroke={NAVY} strokeWidth="5" />
        <text x={x} y={BASE - h - 26} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="72" fill={NAVY}>{Math.round(v * k)}%</text>
        <text x={x} y={BASE + 60} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="40" fill={NAVY}>{label}</text>
        {/* little heads showing the group size */}
        {Array.from({ length: n }, (_, j) => <circle key={j} cx={x - (n - 1) * 13 + j * 26} cy={BASE + 100} r="10" fill={j % 2 ? RP : RB} stroke={NAVY} strokeWidth="2.5" opacity={E(t, at[i] + 0.2 + j * 0.08, at[i] + 0.4 + j * 0.08)} />)}
      </g>;
    })}
    <text x="490" y="120" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="38" fill={RB}>each person's noise vs. alone</text>
    {t > b1 + 1.6 && <g transform={`translate(${750} ${300 + 30 * E(t, b1 + 1.6, b1 + 3)})`} opacity={1 - E(t, b1 + 2.4, b1 + 3.2)}>
      <path d="M-30,0 Q0,-30 30,0 Q60,30 90,0" fill="none" stroke={RB} strokeWidth="6" strokeLinecap="round" />
    </g>}
  </g>;
}

/* 5 — why: a blindfolded shouter who only believes others are shouting eases off; then the crowd hides effort */
function SceneWhy({ t, beats, P }) {
  const b1 = beats[1] ?? 99;
  const ghosts = E(t, 1.0, 1.6);
  const ease = E(t, 2.2, 3.4, 'draw');
  const crowd = E(t, b1, b1 + 1.2, 'draw');
  const cam = { fx: 490, fy: 560, s: L(1.15, 0.9, crowd), px: 490, py: 540 };
  return <g transform={camT(cam)}>
    <Paper id="wy" />
    <Riso>{(c) => <circle cx="490" cy="560" r={L(260, 520, crowd)} fill={c} opacity="0.16" />}</Riso>
    {/* imagined partners */}
    {[-1, 1].map((d) => <g key={d} opacity={ghosts * (1 - crowd)}>
      <g transform={`translate(${490 + d * 210} 780) scale(1.4)`}>
        <rect x="-24" y="-100" width="48" height="66" rx="22" fill="none" stroke={NAVY} strokeWidth="4" strokeDasharray="8 8" />
        <circle cx="0" cy="-128" r="27" fill="none" stroke={NAVY} strokeWidth="4" strokeDasharray="8 8" />
        <path d="M-14,0 L-6,-34 M14,0 L6,-34" stroke={NAVY} strokeWidth="4" strokeDasharray="8 8" />
      </g>
      <text x={490 + d * 210} y="560" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="60" fill={RP}>?</text>
    </g>)}
    {/* the crowd that fills in */}
    {Array.from({ length: 14 }, (_, i) => {
      const row = i < 7 ? 0 : 1, col = i % 7;
      const x = 130 + col * 120 + (row ? 60 : 0), y = row ? 900 : 1000;
      const p = E(t, b1 + 0.2 + hsh(i) * 0.9, b1 + 0.6 + hsh(i) * 0.9, 'pop');
      return p > 0 ? <g key={i} transform={sc(x, y, p)}><Fig x={x} y={y} s={1.1} c={i % 2 ? RP : RB} bob={t * 3 + i} eyes={hsh(i + 2) > 0.5 ? 'sleepy' : 'dot'} ax={i % 2 ? -30 : 30} ay={-40} /></g> : null;
    })}
    {/* the blindfolded shouter with headphones */}
    <g transform={`translate(490 ${L(800, 860, crowd)})`}>
      <Fig x={0} y={0} s={L(1.6, 1.1, crowd)} c={RB} eyes="blind" mouth={L(1, 0.25, ease) * (0.7 + 0.3 * Math.abs(Math.sin(t * 6)))} bob={t * 3} ax={0} ay={-40} />
      <g transform={`scale(${L(1.6, 1.1, crowd)})`}>
        <path d="M-30,-140 A32 32 0 0 1 30,-140" fill="none" stroke={NAVY} strokeWidth="7" />
        <rect x="-38" y="-142" width="14" height="28" rx="6" fill={RP} stroke={NAVY} strokeWidth="3" />
        <rect x="24" y="-142" width="14" height="28" rx="6" fill={RP} stroke={NAVY} strokeWidth="3" />
        {[0, 1, 2].map((k) => { const r = 24 + md(t * 50 + k * 22, 66) * L(1, 0.35, ease); return <path key={k} d={`M${-r * 0.5},${-r} A${r} ${r} 0 0 1 ${r * 0.5},${-r}`} fill="none" stroke={RP} strokeWidth="6" strokeLinecap="round" opacity={(1 - crowd * 0.6) * (1 - md(t * 50 + k * 22, 66) / 70)} transform="translate(0 -150)" />; })}
      </g>
    </g>
    {/* effort meter for the shouter, draining */}
    <g transform="translate(700 330)" opacity={1 - crowd}>
      <rect x="0" y="0" width="200" height="34" rx="17" fill="#FFFFFF" stroke={NAVY} strokeWidth="4" />
      <rect x="0" y="0" width={200 * L(1, 0.74, ease)} height="34" rx="17" fill={RP} />
      <text x="100" y="-14" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="28" fill={NAVY}>EFFORT</text>
    </g>
    {crowd > 0.6 && <g transform={`translate(490 380) scale(${E(t, b1 + 1.2, b1 + 1.6, 'pop')})`}>
      <rect x="-210" y="-50" width="420" height="100" rx="50" fill={YEL} stroke={NAVY} strokeWidth="6" />
      <text x="0" y="18" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="50" fill={NAVY}>WHO DID WHAT?</text>
    </g>}
  </g>;
}

/* 6 — takeaway: named jobs, each part visible, every bar fills; then the group chat */
const JOBS = [['MAYA', 'slides'], ['LEO', 'research'], ['PRIYA', 'script'], ['SAM', 'edit']];
function SceneTakeaway({ t, beats, P }) {
  const b1 = beats[1] ?? 99;
  const phone = E(t, b1 - 0.1, b1 + 0.5, 'pop');
  const board = 1 - 0.25 * phone;
  return <g>
    <Paper id="tk" />
    <Riso>{(c) => <circle cx="490" cy="520" r="400" fill={c} opacity="0.14" />}</Riso>
    <g transform={`${sc(490, 480, board)} translate(${-230 * phone} 0)`}>
      <rect x="150" y="140" width="680" height="660" rx="24" fill="#FFFFFF" stroke={NAVY} strokeWidth="7" />
      <text x="490" y="220" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="54" fill={RB}>WHO DOES WHAT</text>
      {JOBS.map(([n, job], i) => {
        const y = 320 + i * 125;
        const p = E(t, 0.4 + i * 0.25, 0.75 + i * 0.25, 'pop');
        const fill = E(t, 1.6 + i * 0.4, 2.6 + i * 0.4, 'draw');
        return <g key={n} opacity={Math.min(1, p)}>
          <circle cx="215" cy={y} r="30" fill={i % 2 ? RP : RB} stroke={NAVY} strokeWidth="4" />
          <text x="265" y={y - 6} fontFamily={FONT} fontWeight="800" fontSize="38" fill={NAVY}>{n}</text>
          <text x="265" y={y + 30} fontFamily={FONT} fontWeight="500" fontSize="28" fill={RB}>{job}</text>
          <rect x="480" y={y - 18} width="280" height="36" rx="18" fill="#EEF4F8" stroke={NAVY} strokeWidth="4" />
          <rect x="480" y={y - 18} width={280 * fill} height="36" rx="18" fill={i % 2 ? RP : RB} />
          <path d={`M770,${y - 4} L784,${y + 10} L808,${y - 18}`} fill="none" stroke={NAVY} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={60 * (1 - E(t, 2.6 + i * 0.4, 2.9 + i * 0.4))} />
        </g>;
      })}
    </g>
    {/* the protagonist approves */}
    <g opacity={1 - phone}><StoryBust x={150} y={1060} s={1.0} look={[0.8, -0.5]} smile={0.8} brow={0.3} lid={md(t, 3.1) < 0.12 ? 0.9 : 0} /></g>
    {phone > 0 && <g transform={`translate(700 520) rotate(6) scale(${phone})`}>
      <StoryPhone w={300} h={560} screen="#EEF4F8" clip="tkPhone">
        <rect x="-150" y="-270" width="300" height="70" fill={RB} />
        <text x="0" y="-225" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="28" fill="#FFFFFF">Group chat</text>
        {[0, 1].map((k) => { const q = E(t, b1 + 0.3 + k * 0.7, b1 + 0.6 + k * 0.7, 'pop'); return <g key={k} transform={`translate(${k ? 30 : -20} ${-120 + k * 120}) scale(${q})`}>
          <rect x="-100" y="-40" width="200" height="80" rx="22" fill={k ? RP : '#FFFFFF'} stroke={NAVY} strokeWidth="4" />
          <text x="0" y="12" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="30" fill={k ? '#FFFFFF' : NAVY}>{k ? 'who, me?' : 'read this'}</text>
        </g>; })}
      </StoryPhone>
    </g>}
  </g>;
}

Object.assign(window, { SceneHook, SceneRope, SceneStudy, SceneStat, SceneWhy, SceneTakeaway });
