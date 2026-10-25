// stick-kit.jsx — the recurring cast of the "stick" story Shorts (hand-drawn white line figures on black).
// One source of truth for how each character looks: shorts/characters/cast.json documents the same data for writers.
// Every figure = white line body + black-filled round head + ONE signature accent (colour + silhouette cue),
// so a viewer can tell them apart in silhouette and by colour before reading a name.
(function () {
  const W = '#F2F2F2', BG = '#0b0b0b', Y = '#F5D33A';
  const STK = { stroke: W, strokeWidth: 9, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  const TAU = Math.PI * 2;
  const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);

  // ---- the cast (keep in sync with shorts/characters/cast.json) ----
  const CAST = {
    arjun: { name: 'Arjun', h: 1.0, accent: Y, hair: 'messy', acc: 'scarf', mood: 'worried' },     // the overthinker
    maya: { name: 'Maya', h: 0.88, accent: '#FF6B5B', hair: 'ponytail', acc: 'bow', mood: 'smug' },   // blunt best friend
    kabir: { name: 'Kabir', h: 1.12, accent: '#3FC1C9', hair: 'flat', acc: 'headphones', mood: 'happy' }, // easygoing, oblivious
    zoe: { name: 'Zoe', h: 0.96, accent: '#B79CFF', hair: 'beanie', acc: 'glasses', mood: 'neutral' },  // the people-pleaser
    extra: { name: '', h: 1.0, accent: '#777', hair: 'none', acc: 'none', mood: 'neutral' },           // background crowd
  };

  // ---- faces ----
  function Face({ mood = 'neutral', T = 0, ph = 0, look = 0 }) {
    const blink = ((T + ph) % 3.1) < 0.12;
    const ey = blink ? <g><line x1={-14 + look} y1="-6" x2={-6 + look} y2="-6" {...STK} strokeWidth="5" /><line x1={6 + look} y1="-6" x2={14 + look} y2="-6" {...STK} strokeWidth="5" /></g>
      : <g><circle cx={-10 + look} cy="-6" r="5" fill={W} /><circle cx={10 + look} cy="-6" r="5" fill={W} /></g>;
    const m = {
      happy: <path d="M-14 10 Q0 24 14 10" {...STK} strokeWidth="5" />,
      smug: <path d="M-12 14 Q4 20 14 8" {...STK} strokeWidth="5" />,
      sad: <path d="M-12 18 Q0 8 12 18" {...STK} strokeWidth="5" />,
      worried: <path d="M-12 16 Q-4 10 2 15 Q8 20 12 13" {...STK} strokeWidth="5" />,
      angry: <line x1="-12" y1="15" x2="12" y2="15" {...STK} strokeWidth="5" />,
      shocked: <ellipse cx="0" cy="15" rx="7" ry="9" fill={W} />,
      neutral: <line x1="-10" y1="14" x2="10" y2="14" {...STK} strokeWidth="5" />,
    }[mood] || null;
    const brow = { angry: <g><line x1="-20" y1="-22" x2="-4" y2="-14" {...STK} strokeWidth="5" /><line x1="20" y1="-22" x2="4" y2="-14" {...STK} strokeWidth="5" /></g>,
      worried: <g><line x1="-20" y1="-16" x2="-6" y2="-22" {...STK} strokeWidth="4" /><line x1="20" y1="-16" x2="6" y2="-22" {...STK} strokeWidth="4" /></g>,
      shocked: <g><path d="M-20 -22 q8 -6 14 0" {...STK} strokeWidth="4" /><path d="M6 -22 q8 -6 14 0" {...STK} strokeWidth="4" /></g>,
      smug: <line x1="4" y1="-20" x2="20" y2="-24" {...STK} strokeWidth="4" /> }[mood] || null;
    return <g>{brow}{ey}{m}</g>;
  }

  // ---- signature details per character ----
  function Hair({ c, R }) {
    if (c.hair === 'messy') return <g>{[-30, -12, 8, 26].map((x, i) => <path key={i} d={`M${x} ${-R + 6} l${(i % 2 ? 8 : -6)} -26`} {...STK} strokeWidth="7" />)}</g>;
    if (c.hair === 'ponytail') return <g><path d={`M${R - 4} -${R * 0.5} q46 6 34 70`} {...STK} strokeWidth="8" /><circle cx={R + 18} cy={-R * 0.42} r="9" fill={c.accent} /></g>;
    if (c.hair === 'flat') return <path d={`M${-R + 6} ${-R * 0.55} Q0 ${-R - 16} ${R - 6} ${-R * 0.55}`} {...STK} strokeWidth="10" />;
    if (c.hair === 'beanie') return <g><path d={`M${-R} ${-R * 0.25} Q${-R} ${-R - 30} 0 ${-R - 30} Q${R} ${-R - 30} ${R} ${-R * 0.25} Z`} fill={c.accent} /><line x1={-R - 4} y1={-R * 0.25} x2={R + 4} y2={-R * 0.25} stroke={c.accent} strokeWidth="14" strokeLinecap="round" /><circle cx="0" cy={-R - 34} r="11" fill={c.accent} /></g>;
    return null;
  }
  function Acc({ c, R }) {
    if (c.acc === 'scarf') return <g><path d={`M-26 ${R + 10} Q0 ${R + 26} 26 ${R + 10}`} stroke={c.accent} strokeWidth="16" strokeLinecap="round" fill="none" /><path d={`M16 ${R + 18} l10 46`} stroke={c.accent} strokeWidth="13" strokeLinecap="round" /></g>;
    if (c.acc === 'headphones') return <g><path d={`M${-R - 4} 0 Q${-R - 4} ${-R - 22} 0 ${-R - 22} Q${R + 4} ${-R - 22} ${R + 4} 0`} stroke={c.accent} strokeWidth="9" fill="none" /><rect x={-R - 14} y="-14" width="18" height="34" rx="8" fill={c.accent} /><rect x={R - 4} y="-14" width="18" height="34" rx="8" fill={c.accent} /></g>;
    if (c.acc === 'glasses') return <g stroke={c.accent} strokeWidth="5" fill="none"><circle cx="-11" cy="-5" r="11" /><circle cx="11" cy="-5" r="11" /><line x1="-1" y1="-6" x2="1" y2="-6" /></g>;
    return null;
  }

  // ---- poses: arms + legs as functions of T ----
  function limbs(pose, T, L, ph) {
    const sw = osc(T, 0.55, ph);
    const P = {
      stand: { a: [[-34, 96], [34, 96]], l: [[-26, 0], [26, 0]] },
      walk: { a: [[-30 + sw * 18, 96], [30 - sw * 18, 96]], l: [[-22 + sw * 26, 0], [22 - sw * 26, 0]] },
      wave: { a: [[-34, 96], [40 + osc(T, 0.35) * 14, -30]], l: [[-26, 0], [26, 0]] },
      phone: { a: [[-34, 96], [18, 26]], l: [[-26, 0], [26, 0]] },
      cross: { a: [[24, 70], [-24, 70]], l: [[-26, 0], [26, 0]] },
      shrug: { a: [[-56, 20], [56, 20]], l: [[-26, 0], [26, 0]] },
      head: { a: [[-30, -40], [30, -40]], l: [[-26, 0], [26, 0]] },
      point: { a: [[-34, 96], [86, 40]], l: [[-26, 0], [26, 0]] },
      hips: { a: [[-40, 70], [40, 70]], l: [[-30, 0], [30, 0]] },
      sit: { a: [[-30, 90], [30, 90]], l: [[-40, -60], [40, -60]] },
    }[pose] || null;
    return P || limbs('stand', T, L, ph);
  }

  // A character. (x, y) = feet on the ground line. s = scale. dir = 1 faces right, -1 left.
  function Stick({ who = 'extra', x, y, s = 1, pose = 'stand', mood, T = 0, ph = 0, look = 0, dir = 1, op = 1 }) {
    const c = CAST[who] || CAST.extra;
    const H = 330 * c.h, R = 46, neck = H - 2 * R - 160 - 20;
    const hip = -160, shoulder = hip - 110 - (c.h - 1) * 80;
    const headY = shoulder - 26 - R;
    const { a, l } = limbs(pose, T, H, ph);
    const bob = pose === 'walk' ? Math.abs(osc(T, 0.55, ph)) * -8 : osc(T, 2.4, ph) * 2;
    const elbow = pose === 'cross' || pose === 'hips';
    return (
      <g transform={`translate(${x} ${y}) scale(${1.35 * s * dir} ${1.35 * s})`} opacity={op}>
        <g transform={`translate(0 ${bob})`}>
          {/* legs */}
          {pose === 'sit'
            ? <g><path d={`M0 ${hip} l-50 0 l0 70`} {...STK} /><path d={`M0 ${hip} l50 0 l0 70`} {...STK} /></g>
            : l.map(([dx], i) => <line key={i} x1="0" y1={hip} x2={dx} y2="0" {...STK} />)}
          {/* body */}
          <line x1="0" y1={shoulder} x2="0" y2={hip} {...STK} />
          {/* arms */}
          {a.map(([dx, dy], i) => elbow
            ? <path key={i} d={`M0 ${shoulder + 10} L${(i ? 1 : -1) * 44} ${shoulder + 60} L${dx * 0.3} ${shoulder + dy * 0.9}`} {...STK} />
            : <line key={i} x1="0" y1={shoulder + 10} x2={dx} y2={shoulder + 10 + dy} {...STK} />)}
          {pose === 'phone' && <rect x="8" y={shoulder + 8} width="26" height="44" rx="6" fill={BG} stroke={W} strokeWidth="5" />}
          {/* head */}
          <g transform={`translate(0 ${headY})`}>
            <circle r={R} fill={BG} stroke={W} strokeWidth="9" />
            <Hair c={c} R={R} />
            <Face mood={mood || c.mood} T={T} ph={ph} look={look} />
            <Acc c={c} R={R} />
          </g>
        </g>
      </g>
    );
  }

  // ---- props, all hand-drawn ----
  function Ground({ y = 1500, x1 = 30, x2 = 1050 }) { return <line x1={x1} y1={y} x2={x2} y2={y + 4} {...STK} strokeWidth="7" />; }
  function Bubble({ x, y, w = 360, h = 150, text, size = 54, think = false, color = W, tail = -1 }) {
    return (<g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={think ? h / 2 : 30} fill={BG} stroke={color} strokeWidth="7" />
      {think ? <g><circle cx={tail * w * 0.3} cy={h / 2 + 22} r="12" fill={BG} stroke={color} strokeWidth="5" /><circle cx={tail * w * 0.38} cy={h / 2 + 52} r="7" fill={BG} stroke={color} strokeWidth="4" /></g>
        : <path d={`M${tail * 40} ${h / 2 - 3} l${tail * 34} 50 l${-tail * 4} -50`} fill={BG} stroke={color} strokeWidth="6" strokeLinejoin="round" />}
      <text y={size * 0.36} textAnchor="middle" fontFamily="'Caveat Brush', 'Gochi Hand', cursive" fontSize={size} fill={color}>{text}</text>
    </g>);
  }
  function Mark({ x, y, kind = '?', T = 0, color = Y, size = 90 }) {
    return <text x={x} y={y + osc(T, 0.8) * 6} textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize={size} fill={color}>{kind}</text>;
  }
  function Phone({ x, y, s = 1, lines = [], T = 0 }) {
    return (<g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-150" y="-260" width="300" height="520" rx="36" fill={BG} stroke={W} strokeWidth="9" />
      {lines.map((ln, i) => <g key={i} transform={`translate(${ln.me ? 30 : -30} ${-170 + i * 110})`}>
        <rect x="-100" y="-38" width="200" height="76" rx="22" fill={ln.me ? Y : 'none'} stroke={ln.me ? Y : W} strokeWidth="5" />
        <text y="12" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="38" fill={ln.me ? BG : W}>{ln.t}</text>
        {ln.seen && <text x="90" y="64" textAnchor="end" fontFamily="'Caveat Brush', cursive" fontSize="30" fill="#999">{ln.seen}</text>}
      </g>)}
    </g>);
  }

  Object.assign(window, { STICK_CAST: CAST, Stick, StickGround: Ground, StickBubble: Bubble, StickMark: Mark, StickPhone: Phone, STICK: { W, BG, Y, STK, osc } });
})();
