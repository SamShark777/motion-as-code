// retro-kit.jsx — "retro modern illustration style" (Shivam, 2026-10-26): mid-century editorial illustration.
// Limited palette (vermilion, indigo, pink, mustard, cream, black), stippled grain (added by retro-engine), angular faces
// with big triangle noses and yellow eyes, hatched hair / moustaches / stubble, glowing cyan electricity as the one accent.
// Reference pictures: shorts/styles/retro/. Cast: shorts/characters/retro-cast.json (keep in sync with RM_CAST).
// Pure functions of time only: no state, effects, timers or Math.random (use RM.hsh / RM.rng).
(function () {
  const P = { red: '#D9442E', redD: '#B8321F', blue: '#2E4B8F', blueD: '#223a73', pink: '#F09089', pinkD: '#D9706B', yel: '#F4C437',
    blk: '#17131A', cream: '#F4E7D2', cyan: '#8FEFFF', nose: '#E2402F', green: '#3E7D5A' };
  const W = 1080, H = 1920, PI = Math.PI, TAU = PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const sm = (a, b, t) => { t = clamp((t - a) / (b - a)); return t * t * (3 - 2 * t); }, eo = (t) => 1 - Math.pow(1 - clamp(t), 3);
  const back = (t) => { t = clamp(t); const s = 1.9; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
  const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
  const hsh = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const rng = (seed) => { let k = 0; return () => hsh(seed * 1000 + (k++)); };
  const pts = (a, close = true) => 'M' + a.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + (close ? ' Z' : '');
  const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
  const uid = () => 'u' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const Ln = ({ x1, y1, x2, y2, w = 6, c = P.blk, o = 1 }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round" opacity={o} />;

  // ---- cast (keep in sync with shorts/characters/retro-cast.json) ----
  const CAST = {
    arthur: { name: 'Arthur', kind: 'human', skin: P.pink, skinD: P.pinkD, hair: 'flat', hairCol: P.blk, moustache: true, jacket: P.blk },
    mae: { name: 'Mae', kind: 'human', skin: P.yel, skinD: '#D9A62A', hair: 'bob', hairCol: P.blue, moustache: false, lips: true, jacket: P.green },
    critic: { name: 'The Critic', kind: 'critic' },
  };

  // ---- human face (Arthur / Mae): local units, head ≈ 400 wide; s = scale ----
  // mouth flat|smile|frown|open|shout, brow flat|angry|sad|up, lid 0..1 (heavy lids), look [-1..1,-1..1], tear (seconds) for a running tear
  function Human({ x, y, s = 1, who = 'arthur', rot = 0, body = true, mouth = 'flat', brow = 'flat', lid = 0.3, look = [0, 0], wide = false, tear = null, stress = false }) {
    const C = typeof who === 'string' ? CAST[who] || CAST.arthur : who;
    const bA = brow === 'angry' ? 14 : brow === 'sad' ? -14 : brow === 'up' ? -5 : 0, bU = brow === 'up' ? -25 : 0;
    const face = [[-195, -210], [185, -225], [205, 110], [160, 290], [-160, 290], [-205, 110]];
    const u = uid();
    const hairFlat = [[-205, -140], [-200, -300], [-120, -340], [150, -345], [200, -290], [195, -165], [150, -210], [60, -200], [-60, -215], [-150, -190]];
    return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot * 180 / PI})`}>
      {body && <g><path d={pts([[-330, 700], [-300, 330], [-150, 250], [150, 250], [300, 330], [330, 700]])} fill={C.jacket} />
        <path d={pts([[-60, 250], [0, 330], [60, 250]])} fill={P.cream} {...ink(5)} /><Ln x1={0} y1={330} x2={0} y2={700} w={4} c="#3a3240" /></g>}
      {C.hair === 'bob' && <path d="M-250 160 C-280 -200 -170 -380 0 -380 C170 -380 280 -200 250 160 L170 160 L170 -150 L-170 -150 L-170 160 Z" fill={C.hairCol} {...ink(7)} />}
      <ellipse cx={-200} cy={-10} rx={40} ry={70} fill={C.skinD} {...ink(6)} />
      <path d={pts(face)} fill={C.skin} {...ink(7)} />
      {C.moustache !== false && C.hair !== 'bob' && [...Array(16)].map((_, i) => <Ln key={i} x1={-140 + i * 19} y1={262} x2={-140 + i * 19} y2={288} w={4} />)}
      {C.hair === 'flat' && <g><path d={pts(hairFlat)} fill={C.hairCol} />
        <clipPath id={`hc${u}`}><path d={pts(hairFlat)} /></clipPath>
        <g clipPath={`url(#hc${u})`} stroke={C.skin} strokeOpacity="0.7" strokeWidth="4" fill="none">{[...Array(8)].map((_, k) => <path key={k} d={`M-220 ${-300 + k * 22} C-80 ${-330 + k * 22} 60 ${-300 + k * 24} 220 ${-330 + k * 22}`} />)}</g></g>}
      {C.hair === 'bob' && <path d="M-205 -120 C-190 -330 190 -330 205 -120 C120 -200 40 -170 -20 -230 C-80 -170 -150 -190 -205 -120 Z" fill={C.hairCol} {...ink(6)} />}
      {C.hair === 'bob' && <rect x={110} y={-250} width={70} height={26} rx={8} fill={P.red} {...ink(4)} transform="rotate(-20 145 -237)" />}
      {[-1, 1].map((sd) => <rect key={sd} x={-55} y={-13} width={110} height={26} fill={P.blk} transform={`translate(${sd * 95} ${-120 + bU}) rotate(${sd * bA})`} />)}
      {[-1, 1].map((sd) => { const ex = sd * 95, ey = -55, ly = ey - 40 + 80 * lid; return (<g key={sd}>
        <circle cx={ex} cy={ey} r={40} fill={P.yel} {...ink(6)} />
        <circle cx={ex + look[0] * 14} cy={ey + look[1] * 14} r={wide ? 9 : 12} fill={P.blk} />
        {lid > 0 && <g><clipPath id={`lid${sd}${u}`}><circle cx={ex} cy={ey} r={40} /></clipPath><rect x={ex - 45} y={ey - 45} width={90} height={90 * lid} fill={C.skinD} clipPath={`url(#lid${sd}${u})`} /><Ln x1={ex - 42} y1={ly} x2={ex + 42} y2={ly} /></g>}
        <path d={`M${ex + Math.cos(PI * 0.2) * 52} ${ey + 10 + Math.sin(PI * 0.2) * 52} A52 52 0 0 1 ${ex + Math.cos(PI * 0.8) * 52} ${ey + 10 + Math.sin(PI * 0.8) * 52}`} fill="none" stroke={P.blk} strokeOpacity="0.6" strokeWidth="4" />
        {tear != null && (() => { const ty = ey + 40 + ((tear * 200) % 160); return <path d={`M${ex + sd * 8} ${ty - 26} Q${ex + sd * 8 + 18} ${ty + 4} ${ex + sd * 8} ${ty + 12} Q${ex + sd * 8 - 18} ${ty + 4} ${ex + sd * 8} ${ty - 26} Z`} fill={P.cyan} style={{ filter: 'drop-shadow(0 0 8px #8FEFFF)' }} />; })()}
      </g>); })}
      <path d={pts([[-5, -75], [-75, 115], [70, 105]])} fill={P.nose} {...ink(6)} /><path d={pts([[-5, -75], [-75, 115], [-20, 112]])} fill="rgba(120,20,15,0.25)" />
      {C.moustache && [...Array(22)].map((_, i) => <Ln key={i} x1={-95 + i * 9} y1={128} x2={-95 + i * 9 + (i < 11 ? -6 : 6)} y2={168 + Math.sin(i) * 4} w={5} />)}
      {(mouth === 'open' || mouth === 'shout') && (() => { const h = mouth === 'shout' ? 80 : 52; return (<g>
        <clipPath id={`mo${u}`}><path d={`M-70 190 Q0 175 70 190 Q50 ${190 + h} 0 ${195 + h} Q-50 ${190 + h} -70 190 Z`} /></clipPath>
        <path d={`M-70 190 Q0 175 70 190 Q50 ${190 + h} 0 ${195 + h} Q-50 ${190 + h} -70 190 Z`} fill={P.blk} {...ink(5)} />
        <g clipPath={`url(#mo${u})`} fill={P.yel}>{[...Array(5)].map((_, i) => <rect key={i} x={-55 + i * 24} y={183} width={18} height={22} />)}</g></g>); })()}
      {mouth === 'smile' && <path d="M-70 195 Q0 240 70 195" fill="none" {...ink(8)} />}
      {mouth === 'frown' && <path d="M-60 220 Q0 180 60 220" fill="none" {...ink(8)} />}
      {mouth === 'flat' && <Ln x1={-55} y1={205} x2={55} y2={205} w={8} />}
      {C.lips && mouth !== 'open' && mouth !== 'shout' && <ellipse cx={0} cy={206} rx={44} ry={14} fill={P.red} {...ink(4)} />}
      {stress && [0, 1, 2].map((k) => <path key={k} d={`M-90 ${-175 - k * 14} Q0 ${-188 - k * 14} 90 ${-175 - k * 14}`} fill="none" stroke={P.blk} strokeOpacity="0.5" strokeWidth="3" />)}
    </g>);
  }

  // ---- the Critic: indigo creature, red-spotted dome, droopy yellow eyes, fangs ----
  // mouth grin|o|flat, sad (soft brows), lid 0..1, blink 0..1, pin (tiny pupils)
  function Critic({ x, y, s = 1, rot = 0, body = true, mouth = 'grin', sad = false, lid = 0.5, blink = 0, look = [0, 0], pin = false }) {
    const u = uid();
    const head = 'M-290 -60 C-320 -470 320 -470 290 -60 C280 120 200 300 120 360 L-120 360 C-200 300 -280 120 -290 -60 Z';
    return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot * 180 / PI})`}>
      {body && <path d={pts([[-380, 800], [-330, 380], [-120, 330], [120, 330], [330, 380], [380, 800]])} fill={P.blk} />}
      <path d={head} fill={P.blue} {...ink(8)} />
      <clipPath id={`ch${u}`}><path d={head} /></clipPath>
      <g clipPath={`url(#ch${u})`}><path d="M-320 -150 C-150 -110 150 -110 320 -150 L320 -500 L-320 -500 Z" fill={P.blueD} />
        {[...Array(55)].map((_, i) => { const r = Math.floor(i / 11), k = i % 11; return <circle key={i} cx={-300 + k * 60 + (r % 2) * 30} cy={-400 + r * 55} r={9 + hsh(i + 4) * 7} fill={P.red} />; })}</g>
      <path d="M-300 -150 C-150 -110 150 -110 300 -150" fill="none" {...ink(7)} />
      {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 40} ${-90 - (sad ? 20 : 0)} Q${sd * 130} ${-110 - (sad ? 10 : 0)} ${sd * 230} ${-80 + (sad ? 20 : 0)}`} fill="none" {...ink(7)} />)}
      {[-1, 1].map((sd) => { const ex = sd * 125, ey = -20, ly = ey - 62 + 40 * lid * (1 - blink); return (<g key={sd}>
        {[1, 2, 3, 4].map((k) => <path key={k} d={`M${ex + Math.cos(PI * 0.15) * (72 + k * 13)} ${ey + 8 + Math.sin(PI * 0.15) * (62 + k * 12)} A${72 + k * 13} ${62 + k * 12} 0 0 1 ${ex + Math.cos(PI * 0.85) * (72 + k * 13)} ${ey + 8 + Math.sin(PI * 0.85) * (62 + k * 12)}`} fill="none" stroke={P.blk} strokeOpacity="0.7" strokeWidth="4" />)}
        <g transform={`translate(${ex} ${ey}) scale(1 ${1 - blink * 0.92})`}><ellipse rx={72} ry={62} fill={P.yel} {...ink(7)} />
          <circle cx={look[0] * 22} cy={look[1] * 18} r={pin ? 10 : 18} fill={P.blk} /><rect x={-80} y={-70} width={160} height={40 * lid} fill={P.blueD} /></g>
        <Ln x1={ex - 75} y1={ly} x2={ex + 75} y2={ly} w={7} /></g>); })}
      <Ln x1={-22} y1={95} x2={-12} y2={125} /><Ln x1={22} y1={95} x2={12} y2={125} />
      {[-1, 1].map((sd) => [0, 1, 2].map((k) => <path key={sd + '' + k} d={`M${sd * (150 + k * 18)} ${110 + k * 10} Q${sd * (175 + k * 18)} 200 ${sd * (130 + k * 12)} ${280 + k * 10}`} fill="none" stroke={P.blk} strokeOpacity="0.6" strokeWidth="4" />))}
      {mouth === 'grin' && <g><clipPath id={`gr${u}`}><path d="M-170 190 Q0 330 170 190 Q0 250 -170 190 Z" /></clipPath><path d="M-170 190 Q0 330 170 190 Q0 250 -170 190 Z" fill={P.blk} {...ink(6)} />
        <ellipse cx={0} cy={280} rx={70} ry={40} fill={P.red} clipPath={`url(#gr${u})`} />
        {[-110, -40, 40, 110].map((fx) => <path key={fx} d={pts([[fx - 14, 212 - Math.abs(fx) * 0.12], [fx + 14, 212 - Math.abs(fx) * 0.12], [fx, 262]])} fill={P.yel} {...ink(4)} />)}</g>}
      {mouth === 'o' && <g><ellipse cx={0} cy={240} rx={70} ry={80} fill={P.blk} {...ink(6)} /><ellipse cx={0} cy={275} rx={40} ry={26} fill={P.red} />
        <path d={pts([[-40, 175], [-20, 175], [-30, 205]])} fill={P.yel} {...ink(3)} /><path d={pts([[40, 175], [20, 175], [30, 205]])} fill={P.yel} {...ink(3)} /></g>}
      {mouth === 'flat' && <path d="M-120 250 Q0 215 120 250" fill="none" {...ink(8)} />}
      {[...Array(12)].map((_, i) => <Ln key={i} x1={-100 + i * 18} y1={330} x2={-100 + i * 18} y2={350} w={4} />)}
    </g>);
  }

  // the Critic's long hand pointing down from (x,y) along rot (radians); press 0..1 bends the middle fingers
  function Hand({ x, y, s = 1, rot = 0, press = 0, col = P.blue }) {
    const fl = [[-72, 175], [-24, 230], [24, 236], [72, 190]];
    return (<g transform={`translate(${x} ${y}) rotate(${rot * 180 / PI}) scale(${s})`}>
      <path d={pts([[-70, -900], [70, -900], [60, -150], [-60, -150]])} fill={col} {...ink(7)} />
      {fl.map(([fx, len], i) => { const L = len - ((i === 1 || i === 2) ? press * 0.35 : 0) * 60; return (<g key={i}>
        <path d={`M${fx - 26} -80 Q${fx - 30} ${L * 0.5} ${fx - 20} ${L - 8} Q${fx} ${L + 30} ${fx + 20} ${L - 8} Q${fx + 30} ${L * 0.5} ${fx + 26} -80 Z`} fill={col} {...ink(6)} />
        <path d={`M${fx - 12} ${L * 0.5} Q${fx} ${L * 0.5 + 8} ${fx + 12} ${L * 0.5}`} fill="none" stroke={P.blk} strokeOpacity="0.7" strokeWidth="4" />
        <ellipse cx={fx} cy={L - 6} rx={11} ry={9} fill={P.blueD} /></g>); })}
      <ellipse cx={0} cy={-70} rx={130} ry={105} fill={col} {...ink(7)} />
      <path d="M-120 -40 Q-190 40 -150 120 Q-130 80 -95 10 Z" fill={col} {...ink(6)} />
    </g>);
  }

  // glowing cyan electric bolt (re-rolls 14×/s)
  function Bolt({ x, y, len = 160, ang = 0, seed = 1, T = 0, w = 5 }) {
    const k = Math.floor(T * 14); let px = x, py = y; const a = [[x, y]];
    for (let i = 1; i <= 7; i++) { const aa = ang + (hsh(seed * 77 + k * 31 + i) - 0.5) * 1.2; px += Math.cos(aa) * len / 7; py += Math.sin(aa) * len / 7; a.push([px, py]); }
    const d = pts(a, false);
    return (<g style={{ filter: 'drop-shadow(0 0 12px #8FEFFF) drop-shadow(0 0 22px #8FEFFF)' }}><path d={d} stroke="rgba(143,239,255,0.9)" strokeWidth={w * 2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#f2fdff" strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>);
  }
  // pink brain dome seen from above, black wavy folds radiating from (cx, cy+40)
  function Brain({ cx = 540, cy = 1250, w = 620, h = 520, seed = 1 }) {
    const id = 'br' + uid();
    return (<g><clipPath id={id}><path d={`M${cx - w} ${cy} A${w} ${h} 0 0 1 ${cx + w} ${cy} L${cx + w} ${cy + 2000} L${cx - w} ${cy + 2000} Z`} /></clipPath>
      <path d={`M${cx - w} ${cy} A${w} ${h} 0 0 1 ${cx + w} ${cy} L${cx + w} ${cy + 2000} L${cx - w} ${cy + 2000} Z`} fill={P.pink} />
      <g clipPath={`url(#${id})`}>{[...Array(26)].map((_, k) => { const a0 = PI + k / 25 * PI; const a = [[cx, cy + 40]];
        for (let j = 1; j <= 14; j++) { const rr = j / 14, ang = a0 + Math.sin(j * 0.9 + k) * 0.08; a.push([cx + Math.cos(ang) * w * rr * 1.05, cy + 40 + Math.sin(ang) * h * rr * 1.05 + Math.sin(j + k) * 6]); }
        return <path key={k} d={pts(a, false)} fill="none" {...ink(7)} />; })}</g></g>);
  }

  // ---- backgrounds: red | redDark | dark | blue (+ waves: thin contour lines at the sides) ----
  function Bg({ kind = 'red', waves = true }) {
    const col = { red: P.red, redDark: P.redD, dark: '#2a1416', blue: P.blue }[kind] || kind;
    return (<g><rect x="-300" y="-300" width={W + 600} height={H + 600} fill={col} />
      {waves && kind !== 'dark' && [0, 1].map((side) => [0, 1, 2, 3].map((k) => <path key={side + '' + k} fill="none" stroke="#FFC8B4" strokeOpacity="0.22" strokeWidth="3"
        d={pts([...Array(102)].map((_, j) => { const y = -100 + j * 20; return [(side ? W - 60 : 60) + (side ? -1 : 1) * k * 22 + Math.sin(y / 140 + k * 0.3) * 40, y]; }), false)} />))}</g>);
  }
  // cream grid paper (pillows, lab coats, charts)
  function Grid({ x, y, w, h, step = 34 }) {
    return (<g><rect x={x} y={y} width={w} height={h} fill={P.cream} />
      {[...Array(Math.ceil(w / step))].map((_, i) => <Ln key={'v' + i} x1={x + i * step} y1={y} x2={x + i * step} y2={y + h} w={2} c="rgba(217,68,46,0.5)" />)}
      {[...Array(Math.ceil(h / step))].map((_, j) => <Ln key={'h' + j} x1={x} y1={y + j * step} x2={x + w} y2={y + j * step} w={2} c="rgba(217,68,46,0.5)" />)}
      <rect x={x} y={y} width={w} height={h} fill="none" {...ink(8)} /></g>);
  }
  // hanging light bulb with warm glow
  function Bulb({ x, y, T = 0, on = true }) {
    const u = uid();
    return (<g>{on && <circle cx={x} cy={y} r={260} fill={`url(#bg${u})`} opacity={0.3 + 0.05 * Math.sin(T * 20)} />}
      <defs><radialGradient id={`bg${u}`}><stop offset="0" stopColor="#ffe9a0" /><stop offset="1" stopColor="#ffe9a0" stopOpacity="0" /></radialGradient></defs>
      <Ln x1={x} y1={-50} x2={x} y2={y - 60} w={4} /><rect x={x - 26} y={y - 80} width={52} height={40} fill={P.blk} />
      <circle cx={x} cy={y} r={62} fill={P.yel} {...ink(6)} /></g>);
  }
  // yellow smiley badge (compliments, likes); k = pop progress
  function Badge({ x, y, r = 70, k = 1, col = P.yel }) {
    if (k <= 0) return null;
    return (<g transform={`translate(${x} ${y}) scale(${back(k)})`}><circle r={r} fill={col} {...ink(6)} />
      <circle cx={-r * 0.32} cy={-r * 0.15} r={r * 0.11} fill={P.blk} /><circle cx={r * 0.32} cy={-r * 0.15} r={r * 0.11} fill={P.blk} />
      <path d={`M${-r * 0.37} ${r * 0.2} A${r * 0.45} ${r * 0.45} 0 0 0 ${r * 0.37} ${r * 0.2}`} fill="none" {...ink(r * 0.1)} /></g>);
  }
  // jagged black speech bubble with red text; tail points down-left
  function Speech({ x, y, text, k = 1, size = 88, col = P.red, rot = -0.06 }) {
    if (k <= 0) return null;
    const jag = [[-300, -120], [-200, -150], [-100, -110], [0, -160], [110, -115], [220, -150], [310, -100], [290, 0], [320, 100], [180, 120], [60, 150], [-60, 110], [-200, 140], [-310, 90], [-290, 0]];
    return (<g transform={`translate(${x} ${y}) scale(${back(k)}) rotate(${rot * 180 / PI})`}><path d={pts(jag)} fill={P.blk} /><path d={pts([[-40, 110], [-110, 230], [30, 120]])} fill={P.blk} />
      <text x="0" y={size * 0.34} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize={size} letterSpacing="4" fill={col}>{text}</text></g>);
  }
  // rectangular label with a hard offset shadow
  function Chip({ x, y, text, col = P.yel, size = 44, pop = 1, rot = -0.02 }) {
    const w = text.length * size * 0.56 + 56, h = size * 1.55;
    return (<g transform={`translate(${x} ${y}) scale(${back(pop)}) rotate(${rot * 180 / PI})`}>
      <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w} height={h} fill={P.blk} /><rect x={-w / 2} y={-h / 2} width={w} height={h} fill={col} {...ink(5)} />
      <text x="0" y={size * 0.36} textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize={size} letterSpacing="3" fill={P.blk}>{text}</text></g>);
  }
  // big stacked title with a hard shadow: [['NEGATIVITY', cream, 170], ['BIAS', yel, 170]]
  function Title({ lines, y, a = 1 }) {
    let yy = y;
    return (<g opacity={a}>{lines.map(([t, col, sz], i) => { if (i) yy += sz * 0.6 + lines[i - 1][2] * 0.55;
      return (<g key={i}><text x={W / 2 + 10} y={yy + sz * 0.35 + 10} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize={sz} letterSpacing="8" fill={P.blk}>{t}</text>
        <text x={W / 2} y={yy + sz * 0.35} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize={sz} letterSpacing="8" fill={col}>{t}</text></g>); })}</g>);
  }
  // macro of a yellow eye (the Critic's) with something reflected in the pupil (children drawn around 540,980, clip r=140)
  function EyeMacro({ open = 1, children }) {
    const lidH = lerp(250, 90, open), u = uid();
    return (<g><rect x="-300" y="-300" width={W + 600} height={H + 600} fill={P.blue} />
      {[...Array(16)].map((_, i) => <circle key={i} cx={hsh(i + 7) * W} cy={hsh(i + 70) * 420} r={25 + hsh(i + 700) * 30} fill={P.red} />)}
      {[1, 2, 3, 4, 5, 6].map((k) => <path key={k} d={`M${540 + Math.cos(PI * 0.1) * (430 + k * 40)} ${1000 + Math.sin(PI * 0.1) * (330 + k * 44)} A${430 + k * 40} ${330 + k * 44} 0 0 1 ${540 + Math.cos(PI * 0.9) * (430 + k * 40)} ${1000 + Math.sin(PI * 0.9) * (330 + k * 44)}`} fill="none" {...ink(8)} />)}
      <ellipse cx={540} cy={980} rx={430} ry={330} fill={P.yel} {...ink(10)} /><circle cx={540} cy={980} r={150} fill={P.blk} />
      <clipPath id={`pu${u}`}><circle cx={540} cy={980} r={140} /></clipPath><g clipPath={`url(#pu${u})`}><rect x={380} y={820} width={320} height={320} fill={P.redD} />{children}</g>
      <rect x={-300} y={560} width={W + 600} height={lidH} fill={P.blueD} /><Ln x1={-300} y1={560 + lidH} x2={W + 300} y2={560 + lidH} w={10} /></g>);
  }
  // a seesaw scale: left/right pans at the beam ends; children get the pan positions
  function Scale({ tilt = 0, left, right }) {
    const lx = 540 - 380 * Math.cos(tilt), ly = 1000 - 380 * Math.sin(tilt) + 220, rx = 540 + 380 * Math.cos(tilt), ry = 1000 + 380 * Math.sin(tilt) + 220;
    return (<g><path d={pts([[440, 1350], [640, 1350], [540, 1000]])} fill={P.blk} />
      <g transform={`translate(540 1000) rotate(${tilt * 180 / PI})`}><rect x={-420} y={-14} width={840} height={28} fill={P.blk} />
        {[-1, 1].map((sd) => { const x = sd * 380; return <g key={sd}><Ln x1={x} y1={0} x2={x - 80} y2={220} w={4} /><Ln x1={x} y1={0} x2={x + 80} y2={220} w={4} /><path d={pts([[x - 130, 220], [x + 130, 220], [x + 100, 250], [x - 100, 250]])} fill={P.cream} {...ink(5)} /></g>; })}</g>
      {left && left(lx, ly)}{right && right(rx, ry)}</g>);
  }
  function Flower({ x, y, s = 1, droop = 0, stem = 0 }) {
    return (<g transform={`translate(${x} ${y}) scale(${s})`}>{stem > 0 && <Ln x1={0} y1={0} x2={0} y2={-stem} w={8} />}
      <g transform={`translate(0 ${-stem}) rotate(${-droop * 23})`}>{[...Array(6)].map((_, i) => <ellipse key={i} cx={0} cy={-50} rx={24} ry={40} fill={P.yel} {...ink(5)} transform={`rotate(${i * 60})`} />)}<circle r={26} fill={P.pink} {...ink(5)} /></g></g>);
  }
  function Spiky({ x, y, s = 1, eyes = true }) {
    return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d={pts([...Array(20)].map((_, i) => { const a = i / 20 * TAU, r = i % 2 ? 70 : 130; return [Math.cos(a) * r, Math.sin(a) * r]; }))} fill={P.blk} />
      {eyes && <g fill={P.yel}><circle cx={-25} cy={-10} r={14} /><circle cx={25} cy={-10} r={14} /></g>}</g>);
  }
  // bush with optional glaring eyes (k 0..1)
  function Bush({ x = 770, y = 1050, eyes = 0, seed = 11 }) {
    return (<g>{[...Array(14)].map((_, i) => <circle key={i} cx={x - 210 + hsh(seed + i) * 460} cy={y - 150 + hsh(seed + i + 40) * 420} r={110 + hsh(seed + i + 80) * 80} fill={i % 2 ? P.blue : P.blueD} {...ink(6)} />)}
      {eyes > 0 && [-1, 1].map((sd) => <g key={sd} transform={`translate(${x + sd * 80} ${y}) scale(1 ${eyes})`}><path d="M-55 0 Q0 -45 55 0 Q0 30 -55 0 Z" fill={P.yel} {...ink(6)} /><ellipse cx={0} cy={-2} rx={8} ry={20} fill={P.blk} /></g>)}</g>);
  }
  // old twin-bell alarm clock, ringing when ring > 0 (shakes)
  function Alarm({ x, y, T = 0, ring = 1, s = 1 }) {
    const r = Math.sin(T * 50) * 0.08 * ring;
    return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${r * 180 / PI})`}>
      <Ln x1={-90} y1={-130} x2={-140} y2={-200} w={10} /><Ln x1={90} y1={-130} x2={140} y2={-200} w={10} />
      {[-1, 1].map((sd) => <circle key={sd} cx={sd * 95} cy={-140} r={62} fill={P.yel} {...ink(7)} />)}
      <circle r={170} fill={P.cream} {...ink(9)} /><circle r={140} fill="none" {...ink(4)} />
      {[...Array(12)].map((_, i) => { const a = i / 12 * TAU; return <Ln key={i} x1={Math.cos(a) * 120} y1={Math.sin(a) * 120} x2={Math.cos(a) * 135} y2={Math.sin(a) * 135} />; })}
      <Ln x1={0} y1={0} x2={0} y2={-90} w={9} /><Ln x1={0} y1={0} x2={70} y2={20} w={9} /><Ln x1={-120} y1={150} x2={-150} y2={200} w={10} /><Ln x1={120} y1={150} x2={150} y2={200} w={10} />
      {ring > 0 && [...Array(6)].map((_, i) => { const a = -PI * 0.9 + i * PI * 0.16, r1 = 240 + ((((T * 300) % 60) + 60) % 60); return <Ln key={'r' + i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * (r1 + 50)} y2={Math.sin(a) * (r1 + 50)} w={8} />; })}</g>);
  }
  // concentric rotating rings of repeated words (rumination, loops)
  function LoopRings({ T, text = 'COULD BE BETTER', cx = 540, cy = 900 }) {
    return (<g>{[6, 5, 4, 3, 2, 1, 0].map((k) => { const r = 200 + ((((k * 140 + T * 260) % 980) + 980) % 980), n = Math.max(3, Math.floor(2 * PI * r / (text.length * 26 + 40)));
      return (<g key={k}><circle cx={cx} cy={cy} r={r} fill="none" stroke={k % 2 ? 'rgba(23,19,26,0.85)' : P.redD} strokeWidth={60} />
        <g transform={`translate(${cx} ${cy}) rotate(${(T * 0.4 * (k % 2 ? 1 : -1) + k) * 180 / PI})`}>{[...Array(n)].map((_, j) => <text key={j} transform={`rotate(${j * 360 / n}) translate(0 ${-r + 15})`} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="44" letterSpacing="6" fill={k % 2 ? P.red : P.blk}>{text}</text>)}</g></g>); })}</g>);
  }

  Object.assign(window, {
    RM: { P, W, H, clamp, lerp, sm, eo, back, osc, hsh, rng, pts, ink },
    RM_CAST: CAST, RMHuman: Human, RMArthur: (p) => <Human who="arthur" {...p} />, RMMae: (p) => <Human who="mae" {...p} />, RMCritic: Critic, RMHand: Hand,
    RMBolt: Bolt, RMBrain: Brain, RMBg: Bg, RMGrid: Grid, RMBulb: Bulb, RMBadge: Badge, RMSpeech: Speech, RMChip: Chip, RMTitle: Title, RMLine: Ln,
    RMEyeMacro: EyeMacro, RMScale: Scale, RMFlower: Flower, RMSpiky: Spiky, RMBush: Bush, RMAlarm: Alarm, RMLoopRings: LoopRings,
  });
})();
