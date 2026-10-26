// tedmg-kit.jsx — "ted-MG motion graphics" (Shivam, 2026-10-26): flat-vector cartoon micro-stories.
// Round cream heads with dot eyes, thick ink outlines, warm muted scenes (party, bedroom, street, stage),
// white + amber kinetic captions, small UI chips ("DAY 1 · 7:10 AM", "VIEWS 50,000,000").
// Reference pictures: shorts/styles/tedmg/. Cast: shorts/characters/tedmg-cast.json (keep in sync with MG_CAST).
// Everything is a pure function of time: no state, effects, timers or Math.random (use MG.hsh / MG.rng).
(function () {
  const INK = '#25212b', AMB = '#F6B92E', RED = '#E5483B', CREAM = '#F4EFE4', W = 1080, H = 1920;
  const PI = Math.PI, TAU = PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sm = (a, b, t) => { t = clamp((t - a) / (b - a)); return t * t * (3 - 2 * t); };
  const eo = (t) => 1 - Math.pow(1 - clamp(t), 3);
  const back = (t) => { t = clamp(t); const s = 1.9; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
  const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
  const hsh = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const rng = (seed) => { let k = 0; return () => hsh(seed * 1000 + (k++)); };
  const blink = (T, ph = 0) => (((T + ph) % 3.3) > 3.17 ? 1 : 0);
  const uid = () => 'u' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const pts = (a, close = true) => 'M' + a.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + (close ? ' Z' : '');

  // ---- the cast (keep in sync with shorts/characters/tedmg-cast.json) ----
  const CAST = {
    milo: { name: 'Milo', hair: 'quiff', hairCol: '#2b2838', skin: CREAM, top: '#f7f5f0', pants: '#33364d' },
    nia: { name: 'Nia', hair: 'curly', hairCol: '#1f1f26', skin: '#8d6346', top: '#e8b33e', pants: '#2f3347' },
    theo: { name: 'Theo', hair: 'short', hairCol: '#9a9a9a', skin: '#e9d2b8', top: '#4f9d78', pants: '#4b3a2e', glasses: true },
    rosa: { name: 'Rosa', hair: 'long', hairCol: '#e0743a', skin: '#f2dccb', top: '#a46fd1', pants: '#2b2b2b' },
    dev: { name: 'Dev', hair: 'buzz', hairCol: '#1f1a17', skin: '#c99b74', top: '#3f7fbf', pants: '#2f3347', beard: true },
    june: { name: 'June', hair: 'bun', hairCol: '#c46a3f', skin: '#f2dccb', top: '#5bb3b0', pants: '#4b3a2e', glasses: true },
  };
  const EX_HAIR = [['long', '#e0743a'], ['short', '#4a3426'], ['bun', '#2a2a2a'], ['curly', '#6b4a2f'], ['long', '#f0c75a'], ['short', '#b8b8b8'], ['curly', '#1f1f26'], ['long', '#3a2a22'], ['bun', '#c46a3f'], ['short', '#d6a55c']];
  const EX_TOP = ['#d9534f', '#e8b33e', '#6a7bd1', '#4f9d78', '#a46fd1', '#e07fa8', '#3f7fbf', '#8c6b4f', '#5bb3b0', '#f08a4b'];
  // background crowd member i (deterministic)
  const extra = (i) => ({ hair: EX_HAIR[i % 10][0], hairCol: EX_HAIR[i % 10][1], top: EX_TOP[(i * 3 + 1) % 10], pants: ['#2f3347', '#4b3a2e', '#2b2b2b'][i % 3],
    skin: [CREAM, '#e9d2b8', '#c99b74', '#f2dccb', '#8d6346'][i % 5], mouth: ['smile', 'flat', 'grin', 'smile', 'o'][(i * 7) % 5], face: hsh(i * 97 + 11) < 0.5 ? -1 : 1 });
  const look = (who) => (typeof who === 'string' ? (CAST[who] || CAST.milo) : who || CAST.milo);

  // ---- hair ----
  function Hair({ x, y, r, style, col }) {
    const s = { fill: col, stroke: INK, strokeWidth: Math.max(3, r * 0.03), strokeLinejoin: 'round' };
    if (style === 'quiff') {
      const d = `M${x - r} ${y - r * 0.05} C${x - r * 1.08} ${y - r * 0.9} ${x - r * 0.5} ${y - r * 1.12} ${x - r * 0.05} ${y - r * 1.08}
        C${x + r * 0.25} ${y - r * 1.45} ${x + r * 0.75} ${y - r * 1.42} ${x + r * 0.95} ${y - r * 1.12}
        C${x + r * 0.8} ${y - r * 1.1} ${x + r * 0.75} ${y - r * 1.05} ${x + r * 0.85} ${y - r * 0.95}
        C${x + r * 1.08} ${y - r * 0.7} ${x + r * 1.06} ${y - r * 0.3} ${x + r} ${y - r * 0.05}
        L${x + r * 0.9} ${y - r * 0.3} L${x + r * 0.7} ${y - r * 0.42} L${x + r * 0.45} ${y - r * 0.36} L${x + r * 0.2} ${y - r * 0.5}
        L${x - r * 0.1} ${y - r * 0.38} L${x - r * 0.38} ${y - r * 0.5} L${x - r * 0.62} ${y - r * 0.36} L${x - r * 0.85} ${y - r * 0.42} Z`;
      return <path d={d} {...s} />;
    }
    if (style === 'bun') return (<g><circle cx={x + r * 0.1} cy={y - r * 1.15} r={r * 0.38} {...s} />
      <path d={`M${x + Math.cos(PI * 1.05) * r * 1.04} ${y + Math.sin(PI * 1.05) * r * 1.04} A${r * 1.04} ${r * 1.04} 0 0 1 ${x + Math.cos(PI * 1.95) * r * 1.04} ${y + Math.sin(PI * 1.95) * r * 1.04} Q${x} ${y - r * 0.45} ${x - r} ${y - r * 0.3} Z`} {...s} /></g>);
    if (style === 'curly') return (<g>{[...Array(9)].map((_, i) => { const a = PI + i * (PI / 8); return <circle key={i} cx={x + Math.cos(a) * r * 0.92} cy={y + Math.sin(a) * r * 0.92 - r * 0.05} r={r * 0.32} {...s} />; })}
      <path d={`M${x - r * 0.9} ${y - r * 0.1} A${r * 0.9} ${r * 0.9} 0 0 1 ${x + r * 0.9} ${y - r * 0.1} Z`} fill={col} /></g>);
    if (style === 'buzz') return <path d={`M${x - r * 0.98} ${y - r * 0.25} A${r} ${r} 0 0 1 ${x + r * 0.98} ${y - r * 0.25} Q${x} ${y - r * 0.62} ${x - r * 0.98} ${y - r * 0.25} Z`} fill={col} opacity="0.9" />;
    if (style === 'short') return <path d={`M${x + Math.cos(PI * 1.02) * r * 1.04} ${y + Math.sin(PI * 1.02) * r * 1.04} A${r * 1.04} ${r * 1.04} 0 0 1 ${x + Math.cos(PI * 1.98) * r * 1.04} ${y + Math.sin(PI * 1.98) * r * 1.04} L${x + r * 0.8} ${y - r * 0.35} Q${x} ${y - r * 0.6} ${x - r * 0.85} ${y - r * 0.3} Z`} {...s} />;
    return null;
  }
  function HairBack({ x, y, r, col }) { // long hair behind the head
    return <path d={`M${x - r * 1.05} ${y + r * 1.2} C${x - r * 1.3} ${y - r * 0.6} ${x - r * 0.7} ${y - r * 1.15} ${x} ${y - r * 1.1} C${x + r * 0.7} ${y - r * 1.15} ${x + r * 1.3} ${y - r * 0.6} ${x + r * 1.05} ${y + r * 1.2} Z`}
      fill={col} stroke={INK} strokeWidth={Math.max(3, r * 0.03)} strokeLinejoin="round" />;
  }
  function HairFringe({ x, y, r, col }) {
    return <path d={`M${x - r * 0.97} ${y - r * 0.2} C${x - r * 0.6} ${y - r * 0.7} ${x + r * 0.2} ${y - r * 0.45} ${x + r * 0.4} ${y - r * 0.6} C${x + r * 0.7} ${y - r * 0.3} ${x + r * 0.9} ${y - r * 0.2} ${x + r * 0.98} ${y - r * 0.1} A${r} ${r} 0 0 0 ${x - r * 0.97} ${y - r * 0.2} Z`} fill={col} />;
  }

  // ---- face: look [-1..1, -1..1], brow flat|worried|angry|up, mouth smile|grin|o|wave|frown|flat ----
  function Face({ x, y, r, look: lk = [0, 0], brow = 'flat', browUp = 0, mouth = 'flat', blush = 0, sweat = null, bl = 0, tiny = false }) {
    const ex = r * 0.34, ey = y - r * 0.02, er = r * 0.2, sw = r * 0.045;
    const brows = [-1, 1].map((s) => {
      const by = ey - er * 1.55 - browUp * r * 0.08;
      let inY = 0, outY = 0;
      if (brow === 'worried') { inY = -r * 0.08; outY = r * 0.03; } if (brow === 'angry') { inY = r * 0.07; outY = -r * 0.04; } if (brow === 'up') { inY = -r * 0.07; outY = -r * 0.07; }
      return <path key={s} d={`M${x + s * (ex + er * 0.9)} ${by + outY} Q${x + s * ex} ${by - r * 0.05 + (inY + outY) / 2} ${x + s * (ex - er * 0.9)} ${by + inY}`}
        stroke={INK} strokeWidth={sw} strokeLinecap="round" fill="none" />;
    });
    const eyes = [-1, 1].map((s) => (
      <g key={s} transform={`translate(${x + s * ex} ${ey}) scale(1 ${1 - bl * 0.9})`}>
        <circle r={er} fill="#fff" stroke={INK} strokeWidth={r * 0.035} />
        <circle cx={lk[0] * er * 0.45} cy={lk[1] * er * 0.45} r={er * (tiny ? 0.28 : 0.4)} fill={INK} />
      </g>));
    const my = y + r * 0.42;
    let m = null;
    if (mouth === 'smile') m = <path d={`M${x - r * 0.18} ${my - r * 0.06} Q${x} ${my + r * 0.12} ${x + r * 0.18} ${my - r * 0.06}`} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" />;
    else if (mouth === 'grin') m = <path d={`M${x - r * 0.24} ${my - r * 0.06} Q${x} ${my + r * 0.28} ${x + r * 0.24} ${my - r * 0.06} Z`} fill="#fff" stroke={INK} strokeWidth={r * 0.04} strokeLinejoin="round" />;
    else if (mouth === 'o') m = <ellipse cx={x} cy={my} rx={r * 0.08} ry={r * 0.11} fill={INK} />;
    else if (mouth === 'wave') m = <path d={pts([[x - r * 0.2, my], [x - r * 0.1, my - r * 0.04], [x, my + r * 0.04], [x + r * 0.1, my - r * 0.04], [x + r * 0.2, my + r * 0.04]], false)} stroke={INK} strokeWidth={sw} fill="none" strokeLinejoin="round" strokeLinecap="round" />;
    else if (mouth === 'frown') m = <path d={`M${x - r * 0.15} ${my + r * 0.05} Q${x} ${my - r * 0.1} ${x + r * 0.15} ${my + r * 0.05}`} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" />;
    else m = <line x1={x - r * 0.12} y1={my} x2={x + r * 0.12} y2={my} stroke={INK} strokeWidth={sw} strokeLinecap="round" />;
    let sweatEl = null;
    if (sweat != null) { const sy = y - r * 0.5 + (sweat % 1) * r * 0.5; sweatEl = <path d={`M${x + r * 0.82} ${sy - r * 0.14} Q${x + r * 0.94} ${sy + r * 0.02} ${x + r * 0.82} ${sy + r * 0.06} Q${x + r * 0.7} ${sy + r * 0.02} ${x + r * 0.82} ${sy - r * 0.14} Z`} fill="#8fd0f2" stroke={INK} strokeWidth={r * 0.025} />; }
    return (<g>{brows}{eyes}{m}
      {blush > 0 && <g opacity={0.25 * blush} fill="#e87a6e"><ellipse cx={x - r * 0.55} cy={y + r * 0.28} rx={r * 0.14} ry={r * 0.08} /><ellipse cx={x + r * 0.55} cy={y + r * 0.28} rx={r * 0.14} ry={r * 0.08} /></g>}
      {sweatEl}</g>);
  }

  // ---- head (who = cast id or a style object; face props pass through) ----
  function Head({ x, y, r, who = 'milo', ...f }) {
    const L = look(who);
    return (<g>
      {L.hair === 'long' && <HairBack x={x} y={y} r={r} col={L.hairCol} />}
      <circle cx={x} cy={y} r={r} fill={L.skin || CREAM} stroke={INK} strokeWidth={Math.max(3, r * 0.035)} />
      {L.hair === 'long' ? <HairFringe x={x} y={y} r={r} col={L.hairCol} /> : <Hair x={x} y={y} r={r} style={L.hair} col={L.hairCol} />}
      {L.beard && <path d={`M${x - r * 0.95} ${y + r * 0.2} C${x - r * 0.85} ${y + r * 0.95} ${x - r * 0.3} ${y + r * 1.02} ${x} ${y + r * 1.02} C${x + r * 0.3} ${y + r * 1.02} ${x + r * 0.85} ${y + r * 0.95} ${x + r * 0.95} ${y + r * 0.2} C${x + r * 0.7} ${y + r * 0.62} ${x + r * 0.3} ${y + r * 0.56} ${x} ${y + r * 0.6} C${x - r * 0.3} ${y + r * 0.56} ${x - r * 0.7} ${y + r * 0.62} ${x - r * 0.95} ${y + r * 0.2} Z`} fill={L.hairCol} stroke={INK} strokeWidth={Math.max(3, r * 0.03)} strokeLinejoin="round" />}
      <Face x={x} y={y} r={r} {...f} />
      {L.glasses && <g fill="none" stroke={INK} strokeWidth={r * 0.03}><circle cx={x - r * 0.34} cy={y - r * 0.02} r={r * 0.27} /><circle cx={x + r * 0.34} cy={y - r * 0.02} r={r * 0.27} /><line x1={x - r * 0.07} y1={y - r * 0.05} x2={x + r * 0.07} y2={y - r * 0.05} /></g>}
    </g>);
  }

  // ---- stain blob (coffee etc.) ----
  function Stain({ x, y, s, seed = 7, col = '#8a5631', col2 = '#6e4224' }) {
    if (s <= 0) return null;
    const blob = (sx, sy, rr, sd) => pts([...Array(15)].map((_, i) => { const a = i / 14 * TAU, rad = rr * (0.75 + 0.35 * Math.sin(a * 3 + sd) + 0.12 * hsh(sd * 31 + i)); return [sx + Math.cos(a) * rad * 1.1, sy + Math.sin(a) * rad]; }));
    return (<g opacity="0.92"><path d={blob(x, y, s, seed)} fill={col} /><path d={blob(x + s * 0.12, y + s * 0.05, s * 0.7, 3)} fill={col2} />
      <ellipse cx={x + s * 0.8} cy={y + s * 1.3} rx={s * 0.17} ry={s * 0.28} fill={col} /></g>);
  }

  // ---- close-up bust: head at (x,y) radius r; stain 0..1 grows on the chest ----
  function Bust({ x, y, r, who = 'milo', shirt, stain = 0, ...f }) {
    const L = look(who), top = shirt || L.top;
    return (<g>
      <ellipse cx={x} cy={y + r * 3.45} rx={r * 2.15} ry={r * 2.45} fill={top} stroke={INK} strokeWidth={r * 0.035} />
      {top === '#f7f5f0' && <g><path d={`M${x - r * 0.42} ${y + r * 1.02} L${x} ${y + r * 1.35} L${x + r * 0.42} ${y + r * 1.02}`} stroke={INK} strokeWidth={r * 0.03} fill="none" strokeLinejoin="round" />
        <line x1={x} y1={y + r * 1.35} x2={x} y2={H + 50} stroke={INK} strokeWidth={r * 0.02} opacity="0.35" />
        {[0, 1, 2].map((i) => <circle key={i} cx={x + r * 0.06} cy={y + r * 1.65 + i * r * 0.42} r={r * 0.035} fill="#cfc8bb" />)}</g>}
      <Stain x={x + r * 0.55} y={y + r * 1.75} s={r * 0.42 * stain} />
      <Head x={x} y={y} r={r} who={who} {...f} />
    </g>);
  }

  // ---- full figure, feet at (x,y); s=1 → head radius 30 ----
  function Person({ x, y, s = 1, who = 'milo', walk = 0, stain = false, cup = false, ...f }) {
    const L = look(who), lw = Math.max(3, 4 * s), sw = Math.sin(walk) * 16 * s, as = Math.sin(walk) * 0.35;
    const top = L.top || '#6a7bd1', pants = L.pants || '#3b3f55';
    const limb = (d, w, col) => <g><path d={d} stroke={INK} strokeWidth={w + lw} strokeLinecap="round" fill="none" /><path d={d} stroke={col} strokeWidth={w} strokeLinecap="round" fill="none" /></g>;
    return (<g>
      {limb(`M${x - 9 * s} ${y - 62 * s} L${x - 9 * s + sw} ${y - 4 * s} M${x + 9 * s} ${y - 62 * s} L${x + 9 * s - sw} ${y - 4 * s}`, 13 * s, pants)}
      <rect x={x - 28 * s} y={y - 128 * s} width={56 * s} height={72 * s} rx={22 * s} fill={top} stroke={INK} strokeWidth={lw} />
      {stain && <Stain x={x + 10 * s} y={y - 100 * s} s={8 * s} />}
      {limb(`M${x - 24 * s} ${y - 118 * s} L${x - 34 * s - as * 20 * s} ${y - 70 * s} M${x + 24 * s} ${y - 118 * s} L${x + 34 * s + as * 20 * s} ${y - 70 * s}`, 10 * s, top)}
      {cup && <rect x={x + 28 * s} y={y - 96 * s} width={18 * s} height={22 * s} rx={3 * s} fill={RED} stroke={INK} strokeWidth={lw * 0.7} />}
      <Head x={x} y={y - 158 * s} r={30 * s} who={L} tiny {...f} />
    </g>);
  }

  // ---- glow / spotlight ----
  function Glow({ x, y, r, col = '#ffffff', a = 1 }) {
    const id = 'mgg' + uid();
    return (<g><defs><radialGradient id={id}><stop offset="0" stopColor={col} /><stop offset="1" stopColor={col} stopOpacity="0" /></radialGradient></defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} opacity={a} /></g>);
  }
  function Spot({ x, yTop, yBot, wTop, wBot, a = 0.5 }) {
    const u = uid();
    return (<g><defs><linearGradient id={`mgSpot${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF4D6" stopOpacity="1" /><stop offset="1" stopColor="#FFF4D6" stopOpacity="0.25" /></linearGradient></defs>
      <path d={pts([[x - wTop / 2, yTop], [x + wTop / 2, yTop], [x + wBot / 2, yBot], [x - wBot / 2, yBot]])} fill={`url(#mgSpot${u})`} opacity={a} />
      <ellipse cx={x} cy={yBot} rx={wBot / 2} ry={wBot * 0.12} fill="#FFF0C8" opacity={a * 0.6} /></g>);
  }

  // ---- backgrounds: party | room | roomNight | street | stage | wall | dark | navy ----
  const vg = (id, stops) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}</linearGradient>;
  function Bg({ kind = 'wall', T = 0, c1, c2, dim = 0 }) {
    const u = uid();
    const big = { x: -300, y: -300, width: W + 600, height: H + 600 };
    let body = null;
    if (kind === 'party') {
      body = (<g><defs>{vg('mgParty' + u, ['#2a1c45', '#3d2756', '#251a36'])}{vg('mgFloorP' + u, ['#1b1426', '#120d1a'])}</defs><rect {...big} fill={`url(#mgParty${u})`} />
        {[0, 1].map((row) => { const y0 = 260 + row * 170; const cy = (x) => y0 + Math.sin(((x + 120) / (W + 240)) * PI) * 120;
          return (<g key={row}><path d={pts([...Array(70)].map((_, k) => { const x = -120 + k * 20; return [x, cy(x)]; }), false)} stroke="#14101c" strokeWidth="3" fill="none" />
            {[...Array(12)].map((_, k) => { const x = -100 + k * (W + 200) / 11, y = cy(x) + 14, col = ['#ffcf5a', '#ff6f91', '#7fd6ff', '#b6ff7a'][(k + row) % 4];
              return <g key={k}><Glow x={x} y={y} r={46} col={col} a={0.55 + 0.1 * osc(T, 1.7, k * 0.3)} /><circle cx={x} cy={y} r="9" fill={col} /></g>; })}</g>); })}
        {[...Array(14)].map((_, i) => <Glow key={i} x={hsh(i + 5) * W} y={500 + hsh(i + 50) * 500} r={40 + hsh(i + 90) * 60} col={['#ff8fb1', '#ffd36e', '#8fd8ff'][i % 3]} a={0.18} />)}
        <rect x="-300" y="1150" width={W + 600} height={H} fill={`url(#mgFloorP${u})`} /><rect x="-300" y="1150" width={W + 600} height="6" fill="#fff" opacity="0.04" /></g>);
    } else if (kind === 'room' || kind === 'roomNight') {
      const n = kind === 'roomNight', fr = n ? '#0b0f20' : '#8a6a4a';
      body = (<g><defs>{vg('mgRoom' + u + (n ? 'N' : ''), n ? ['#1d2540', '#2a3354', '#1a2036'] : ['#e6d6bc', '#d4bf9f', '#c2a985'])}</defs><rect {...big} fill={`url(#mgRoom${n ? 'N' : ''}${u})`} />
        <rect x="110" y="330" width="330" height="380" rx="10" fill={n ? '#0f1530' : '#ffd9a8'} stroke={fr} strokeWidth="8" />
        {n ? <circle cx="350" cy="420" r="32" fill="#e9eefc" /> : <rect x="130" y="350" width="140" height="340" fill="#fff" opacity="0.35" />}
        <rect x="270" y="330" width="8" height="380" fill={fr} /><rect x="110" y="515" width="330" height="8" fill={fr} />
        <rect x="650" y="380" width="250" height="180" rx="6" fill={n ? '#2c3660' : '#b98e62'} stroke={n ? '#0b0f20' : '#6b4d33'} strokeWidth="6" />
        <rect x="-300" y="1180" width={W + 600} height={H} fill={n ? '#151a2e' : '#8c6a4a'} />
        <rect x="140" y="1040" width="820" height="150" rx="14" fill={n ? '#323c66' : '#f2ece2'} stroke={n ? '#0b0f20' : INK} strokeWidth="7" />
        <rect x="140" y="1100" width="820" height="170" rx="14" fill={n ? '#2a2f4f' : '#6b4a32'} stroke={n ? '#0b0f20' : INK} strokeWidth="7" />
        <rect x="700" y="1020" width="240" height="110" rx="16" fill={n ? '#5b3f6a' : '#c9574a'} stroke={n ? '#0b0f20' : INK} strokeWidth="7" /></g>);
    } else if (kind === 'street') {
      body = (<g><defs>{vg('mgSky' + u, ['#0e1430', '#27315a', '#4a3f6a'])}</defs><rect x="-300" y="-300" width={W + 600} height="1450" fill={`url(#mgSky${u})`} />
        {[...Array(40)].map((_, i) => <rect key={i} x={hsh(i + 3) * W} y={hsh(i + 300) * 600} width="3" height="3" fill="#fff" opacity={0.3 + hsh(i + 600) * 0.5} />)}
        {[-60, 260, 560, 840].map((x, i) => { const h = 300 + (i % 2) * 60; return (<g key={i}><rect x={x} y={1150 - h} width="260" height={h} fill="#1b2040" />
          <path d={pts([[x - 20, 1150 - h], [x + 130, 1150 - h - 130], [x + 280, 1150 - h]])} fill="#141834" />
          {[0, 1].map((k) => { const lit = (i + k) % 3 !== 0; return <g key={k}>{lit && <Glow x={x + 70 + k * 120} y={1150 - h + 105} r={90} col="#ffcf73" a={0.25} />}<rect x={x + 40 + k * 120} y={1150 - h + 70} width="60" height="70" fill={lit ? '#ffcf73' : '#262c52'} /></g>; })}</g>); })}
        <rect x="-300" y="1150" width={W + 600} height={H} fill="#22263a" /><rect x="-300" y="1150" width={W + 600} height="90" fill="#2b3048" />
        {[...Array(6)].map((_, i) => <rect key={i} x={i * 220 - 40} y="1520" width="120" height="14" fill="#c9b46a" opacity="0.6" />)}
        {[180, 820].map((x) => <g key={x}><rect x={x} y="700" width="12" height="460" fill="#111" /><rect x={x} y="700" width="70" height="10" fill="#111" /><Glow x={x + 70} y={720} r={260} col="#ffd98a" a={0.35} /><Glow x={x + 70} y={1300} r={260} col="#ffd98a" a={0.12} /></g>)}</g>);
    } else if (kind === 'stage') {
      body = (<g><rect {...big} fill="#0b0a12" /><defs>{vg('mgCurt' + u, ['#7a1622', '#4b0c15'])}</defs>
        {[-1, 1].map((s) => [...Array(5)].map((_, i) => { const x = s < 0 ? -40 + i * 55 : W + 40 - i * 55;
          return <path key={s + '' + i} d={`M${x} 0 Q${x + s * 30} 700 ${x + s * 10} 1300 L${x - s * 50} 1300 Q${x - s * 20} 700 ${x - s * 55} 0 Z`} fill={`url(#mgCurt${u})`} />; }))}
        <rect x="-300" y="1300" width={W + 600} height={H} fill="#2a1b14" /><rect x="-300" y="1300" width={W + 600} height="30" fill="#3a271c" /></g>);
    } else if (kind === 'dark') body = <rect {...big} fill="#0d0a14" />;
    else if (kind === 'navy') body = (<g><defs>{vg('mgNavy' + u, ['#151a2c', '#0d1020'])}</defs><rect {...big} fill={`url(#mgNavy${u})`} /></g>);
    else { // 'wall': soft blurred close-up wall (c1 top → c2 bottom)
      const id = 'mgW' + u;
      body = (<g><defs>{vg(id, [c1 || '#4a2f5c', c2 || '#2a1b38'])}<filter id={`mgSoft${u}`}><feGaussianBlur stdDeviation="14" /></filter></defs><rect {...big} fill={`url(#${id})`} />
        <g filter={`url(#mgSoft${u})`}><rect x="760" y="180" width="260" height="360" fill="#fff" opacity="0.08" /><rect x="60" y="0" width="90" height="900" fill="#000" opacity="0.15" /></g></g>);
    }
    return <g>{body}{dim > 0 && <rect {...big} fill="#05030a" opacity={dim} />}</g>;
  }

  // ---- UI overlays ----
  function Chip({ x, y, text, outline = false, col = AMB, txt = '#1a1720', size = 40, pop = 1, a = 1 }) {
    const w = text.length * size * 0.58 + 56, h = size * 1.6, sc = back(pop);
    return (<g transform={`translate(${x} ${y}) scale(${sc})`} opacity={a}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={outline ? 'rgba(10,10,16,0.75)' : col} stroke={outline ? col : 'none'} strokeWidth="4" />
      <text x="0" y={size * 0.36} textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize={size} letterSpacing="2" fill={outline ? col : txt}>{text}</text></g>);
  }
  // big title, e.g. [['THE SPOTLIGHT','#fff',150],['PART 1',AMB,110]]
  function Title({ lines, y, a = 1 }) {
    let yy = y;
    return (<g opacity={a} style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.55))' }}>{lines.map(([t, col, sz], i) => {
      if (i) yy += sz * 0.6 + lines[i - 1][2] * 0.5;
      return <text key={i} x={W / 2} y={yy + sz * 0.35} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize={sz} letterSpacing="6" fill={col}>{t}</text>; })}</g>);
  }
  // thought bubble; text lines split by '|'; k = pop progress
  function Bubble({ x, y, text, k = 1, size = 40 }) {
    if (k <= 0) return null;
    const lines = text.split('|'), w = Math.max(...lines.map((l) => l.length)) * size * 0.52 + 50, h = lines.length * size * 1.2 + 34;
    const bx = clamp(x - w / 2, 30, W - 30 - w) - x;
    return (<g transform={`translate(${x} ${y}) scale(${back(k)})`}>
      <rect x={bx} y={-h - 40} width={w} height={h} rx="24" fill="#fff" stroke={INK} strokeWidth="5" />
      <circle cx="0" cy="-26" r="10" fill="#fff" stroke={INK} strokeWidth="4" /><circle cx="-6" cy="-6" r="6" fill="#fff" stroke={INK} strokeWidth="3" />
      {lines.map((l, i) => <text key={i} x={bx + w / 2} y={-h - 40 + 17 + size * 0.95 + i * size * 1.2} textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="500" fontSize={size} fill="#1a1720">{l}</text>)}</g>);
  }
  // red circle drawn on over p 0..1
  function Ring({ cx, cy, rx, ry, p = 1, rot = -12 }) {
    if (p <= 0) return null;
    const L = PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} fill="none" stroke={RED} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${L * clamp(p)} ${L}`} />;
  }
  // n red arrows flying in toward (x,y); t = seconds since start
  function Arrows({ x, y, t, n = 6, from = 700, to = 190 }) {
    return <g>{[...Array(n)].map((_, i) => { const a = i / n * TAU + 0.3, k = eo((t - i * 0.06) / 0.3); if (k <= 0) return null; const d = lerp(from, to, k);
      return <path key={i} transform={`translate(${x + Math.cos(a) * d} ${y + Math.sin(a) * d}) rotate(${(a + PI) * 180 / PI})`} d="M60 0 L10 -26 L10 -10 L-70 -10 L-70 10 L10 10 L10 26 Z" fill={RED} />; })}</g>;
  }
  // a thick sleeve + hand from (x1,y1) to (x2,y2)
  function Arm({ x1, y1, x2, y2, sleeve = '#f7f5f0', skin = CREAM, w = 96 }) {
    return (<g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={w + 14} strokeLinecap="round" /><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={sleeve} strokeWidth={w} strokeLinecap="round" />
      <ellipse cx={x2} cy={y2} rx={w * 0.66} ry={w * 0.6} fill={skin} stroke={INK} strokeWidth="8" /></g>);
  }
  function Mug({ x, y, rot = 0, fill = '#e9e2d4' }) {
    return (<g transform={`translate(${x} ${y}) rotate(${rot})`}><rect x="-70" y="-90" width="140" height="150" rx="18" fill={fill} stroke={INK} strokeWidth="8" />
      <path d="M70 -49 A34 34 0 0 1 70 19" stroke={INK} strokeWidth="14" fill="none" /><rect x="-58" y="-84" width="116" height="18" rx="8" fill="#6e4224" /></g>);
  }
  function Cup({ x, y, s = 1, col = RED }) {
    return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-95 -150 L95 -150 L72 150 L-72 150 Z" fill={col} stroke={INK} strokeWidth="8" strokeLinejoin="round" /><rect x="-60" y="-120" width="22" height="240" fill="#fff" opacity="0.25" /></g>);
  }
  // phone held up: big time + optional notification sliding in (k 0..1)
  function Phone({ x, y, rot = -5, time = '7:59', day = 'SATURDAY', from = '', msg = '', k = 0 }) {
    const u = uid();
    return (<g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>{vg('mgScr' + u, ['#3a4a8a', '#1c2244'])}</defs>
      <rect x="-250" y="-460" width="500" height="920" rx="60" fill="#18161d" stroke={INK} strokeWidth="10" /><rect x="-222" y="-420" width="444" height="840" rx="40" fill={`url(#mgScr${u})`} />
      <text x="0" y="-200" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="160" fill="#fff">{time}</text>
      <text x="0" y="-120" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="500" fontSize="34" fill="#fff">{day}</text>
      {k > 0 && msg && <g transform={`translate(0 ${lerp(-120, 40, clamp(back(k)))})`}><rect x="-200" y="-70" width="400" height="140" rx="26" fill="#fff" opacity="0.92" />
        <text x="-170" y="-20" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="30" fill="#1a1720">{from}</text>
        <text x="-170" y="30" fontFamily="'Oswald', sans-serif" fontWeight="500" fontSize="30" fill="#1a1720">{msg}</text></g>}</g>);
  }
  // a room of people at a party: positions sorted back→front. lookAt: x the crowd turns to after lookFrom seconds.
  const PARTY = [[520, 1200, 1.35], [600, 1210, 1.3], [420, 1215, 1.3], [330, 1230, 1.5], [700, 1240, 1.5], [150, 1250, 1.55], [880, 1260, 1.6], [90, 1420, 1.9], [990, 1430, 1.95], [260, 1500, 2.1], [820, 1520, 2.15]];
  function Crowd({ T, t = 0, layout = PARTY, lookAt = null, lookFrom = 0, spot = 0, bubbles = {}, bubbleFrom = 0.25, mood = null, skip = [] }) {
    const order = Object.keys(bubbles).map(Number);
    return <g>{layout.map(([x, y, s], i) => {
      if (skip.includes(i)) return null;
      const e = extra(i + 1); let lk = [e.face * 0.6, 0];
      if (lookAt != null) { const k = sm(lookFrom, lookFrom + 0.25, t); lk = [lerp(lk[0], clamp((lookAt - x) / 400, -1, 1), k), lerp(0, 0.3, k)]; }
      const worried = bubbles[i] != null;
      return (<g key={i}>{spot > 0 && <Spot x={x} yTop={y - s * 380} yBot={y} wTop={30 * s} wBot={90 * s} a={0.32 * spot} />}
        <Person x={x} y={y + osc(T, 2.1, i * 0.37) * 3} s={s} who={e} look={lk} cup={i % 3 === 0} mouth={mood || (worried ? 'wave' : e.mouth)} brow={worried ? 'worried' : 'flat'} bl={blink(T, i * 0.7)} />
        {worried && <Bubble x={x} y={y - s * 230} text={bubbles[i]} k={(t - bubbleFrom - order.indexOf(i) * 0.22) / 0.3} />}</g>);
    })}</g>;
  }
  // 20-head grid that lights a share of people (stat scenes). on = count lit (fractional fades)
  function HeadGrid({ T, on = 0, x0 = 180, y0 = 470, dx = 180, dy = 220, cols = 5, rows = 4, litOrder = [0, 2, 4, 6, 8, 11, 13, 15, 17, 19, 1, 3, 5, 7, 9, 10, 12, 14, 16, 18] }) {
    return <g>{[...Array(cols * rows)].map((_, i) => {
      const x = x0 + (i % cols) * dx, y = y0 + Math.floor(i / cols) * dy, e = extra(i), rank = litOrder.indexOf(i), lit = clamp(on - rank);
      return (<g key={i}><path d={`M${x - 70} ${y + 120} A70 46 0 0 1 ${x + 70} ${y + 120} Z`} fill={lit > 0.5 ? '#e8a83a' : '#3a4160'} stroke={INK} strokeWidth="5" />
        <Head x={x} y={y} r={62} who={e} look={lit > 0.5 ? [(540 - x) / 500, 0.4] : [e.face * 0.5, 0]} brow={lit > 0.5 ? 'up' : 'flat'} mouth={lit > 0.5 ? 'o' : 'flat'} bl={blink(T, i * 0.4)} />
        {lit > 0 && <circle cx={x} cy={y} r="72" fill="none" stroke={AMB} strokeWidth="7" opacity={lit} />}</g>);
    })}</g>;
  }
  // big number counter (e.g. "50%")
  function BigNum({ x = 540, y = 1570, text, col = '#fff', label = '', size = 210 }) {
    return (<g style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.5))' }}>
      {label && <text x={x} y={y - size * 0.9} textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="36" letterSpacing="4" fill="#fff" opacity="0.7">{label}</text>}
      <text x={x} y={y} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize={size} fill={col}>{text}</text></g>);
  }
  // mic stand on an empty stage
  function Mic({ x = 540, y = 1350 }) {
    return (<g><path d={`M${x} ${y} L${x} ${y - 530} M${x - 90} ${y + 10} L${x} ${y - 50} L${x + 90} ${y + 10}`} stroke="#15131a" strokeWidth="14" fill="none" strokeLinecap="round" />
      <rect x={x - 28} y={y - 620} width="56" height="110" rx="26" fill="#3a3a46" stroke={INK} strokeWidth="7" transform={`rotate(-23 ${x} ${y - 560})`} /></g>);
  }

  Object.assign(window, {
    MG: { INK, AMB, RED, CREAM, W, H, clamp, lerp, sm, eo, back, osc, hsh, rng, blink, pts, extra },
    MG_CAST: CAST, MGHead: Head, MGFace: Face, MGBust: Bust, MGPerson: Person, MGStain: Stain, MGGlow: Glow, MGSpot: Spot, MGBg: Bg,
    MGChip: Chip, MGTitle: Title, MGBubble: Bubble, MGRing: Ring, MGArrows: Arrows, MGArm: Arm, MGMug: Mug, MGCup: Cup, MGPhone: Phone,
    MGCrowd: Crowd, MGHeadGrid: HeadGrid, MGBigNum: BigNum, MGMic: Mic, MG_PARTY: PARTY,
  });
})();
