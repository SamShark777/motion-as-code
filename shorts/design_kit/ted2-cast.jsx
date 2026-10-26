// ted2-cast.jsx — the recurring cast of Ted type 2 (format "cdesign"), drawn in the Rename Your Nerves style:
// flat shapes, no outlines, egg-shaped faces, ink hair, white eyes with ink pupils, soft blush, big soft circle behind.
// Use <T2Bust who="sam" x={486} y={1150} T={T} mood="nervous" /> inside art.jsx (972×1728 card; y = face centre).
// Cast data for writers: shorts/characters/ted2-cast.json (keep in sync). Pure function of T (no state/random).
(function () {
  const INK = '#141821', TAU = Math.PI * 2;
  const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * TAU);
  const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);

  const CAST = {
    sam:   { name: 'Sam',   skin: '#F1C3A0', skin2: '#C98A62', hair: 'swept', hairCol: INK,       top: '#E9E4D8', collar: '#C9C0AE', disc: '#264684' },
    priya: { name: 'Priya', skin: '#C98A62', skin2: '#A86E4A', hair: 'long',  hairCol: '#1d1418', top: '#E8C547', collar: '#C9A63A', disc: '#B3202A' },
    leo:   { name: 'Leo',   skin: '#F6D3B8', skin2: '#D9A07C', hair: 'curls', hairCol: '#E07A2E', top: '#2B6E7A', collar: '#1F5560', disc: '#E8C547', freckles: true },
    grace: { name: 'Grace', skin: '#EBC4A6', skin2: '#C79B7A', hair: 'bun',   hairCol: '#D8D4CC', top: '#6A3FA0', collar: '#56328A', disc: '#2B6E7A', glasses: true },
    omar:  { name: 'Omar',  skin: '#8A5A3C', skin2: '#6B4129', hair: 'buzz',  hairCol: '#141821', top: '#B3202A', collar: '#8E1820', disc: '#E07A2E', beard: true },
  };

  // mood: calm | happy | nervous | shocked | sad | smug | angry
  function T2Face({ x, y, T, mood, look, ph }) {
    const lk = look != null ? look : osc(T, 2.3, ph) * 6;
    const b = mood === 'shocked' ? 1 : blink(T, ph);
    const eye = (cx) => (<g><ellipse cx={cx} cy={y} rx={24} ry={(mood === 'shocked' ? 28 : 22) * b} fill="#fff" />
      <circle cx={cx + lk} cy={y + 2} r={(mood === 'shocked' ? 9 : 11) * Math.min(1, b * 1.6)} fill={INK} /></g>);
    const tilt = { nervous: -13, sad: -15, angry: 14, smug: 0 }[mood] || 0, lift = { shocked: -16, happy: -6, smug: 0 }[mood] || 0;
    const mouths = {
      happy: <path d={`M${x - 40} ${y + 92} Q${x} ${y + 140} ${x + 40} ${y + 92} Z`} fill={INK} />,
      smug: <path d={`M${x - 34} ${y + 104} Q${x + 6} ${y + 120} ${x + 40} ${y + 92}`} fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
      nervous: <path d={`M${x - 50} ${y + 102} q12.5 -12 25 0 t25 0 t25 0 t25 0`} fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
      shocked: <ellipse cx={x} cy={y + 108} rx="22" ry="28" fill={INK} />,
      sad: <path d={`M${x - 34} ${y + 116} Q${x} ${y + 88} ${x + 34} ${y + 116}`} fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
      angry: <line x1={x - 34} y1={y + 106} x2={x + 34} y2={y + 106} stroke={INK} strokeWidth="9" strokeLinecap="round" />,
    };
    return (<g>
      <line x1={x - 94} y1={y - 58 + lift} x2={x - 30} y2={y - 58 + lift} stroke={INK} strokeWidth="11" strokeLinecap="round" transform={`rotate(${tilt} ${x - 62} ${y - 58 + lift})`} />
      <line x1={x + 30} y1={y - 58 + lift + (mood === 'smug' ? -10 : 0)} x2={x + 94} y2={y - 58 + lift - (mood === 'smug' ? 14 : 0)} stroke={INK} strokeWidth="11" strokeLinecap="round" transform={`rotate(${-tilt} ${x + 62} ${y - 58 + lift})`} />
      {eye(x - 61)}{eye(x + 61)}
      {mouths[mood] || <path d={`M${x - 30} ${y + 100} Q${x} ${y + 116} ${x + 30} ${y + 100}`} fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
    </g>);
  }

  function T2Bust({ who = 'sam', x = 486, y = 1150, s = 1, T = 0, mood = 'calm', look = null, ph = 0, disc = true }) {
    const C = CAST[who] || CAST.sam, X = 486, Y = 1150, bob = osc(T, 2.6, ph) * 4;
    return (<g transform={`translate(${x - X * s} ${y - Y * s + bob}) scale(${s})`}>
      {disc && <circle cx={X} cy={Y + 80} r="420" fill={C.disc} opacity="0.9" />}
      {C.hair === 'long' && <path d={`M${X - 175} ${Y + 230} C${X - 205} ${Y - 60} ${X - 120} ${Y - 205} ${X} ${Y - 205} C${X + 120} ${Y - 205} ${X + 205} ${Y - 60} ${X + 175} ${Y + 230} Z`} fill={C.hairCol} />}
      <path d={`M${X - 290} 1728 C${X - 290} ${Y + 350} ${X - 186} ${Y + 265} ${X} ${Y + 265} C${X + 186} ${Y + 265} ${X + 290} ${Y + 350} ${X + 290} 1728 Z`} fill={C.top} />
      <path d={`M${X - 76} ${Y + 270} L${X} ${Y + 370} L${X + 76} ${Y + 270}`} fill="none" stroke={C.collar} strokeWidth="16" strokeLinejoin="round" />
      <rect x={X - 50} y={Y + 140} width="100" height="150" rx="30" fill={C.skin2} />
      <circle cx={X - 148} cy={Y + 20} r="30" fill={C.skin2} /><circle cx={X + 148} cy={Y + 20} r="30" fill={C.skin2} />
      <ellipse cx={X} cy={Y} rx="150" ry="172" fill={C.skin} />
      {C.beard && <path d={`M${X - 148} ${Y + 10} C${X - 140} ${Y + 170} ${X - 60} ${Y + 175} ${X} ${Y + 175} C${X + 60} ${Y + 175} ${X + 140} ${Y + 170} ${X + 148} ${Y + 10} C${X + 120} ${Y + 90} ${X + 60} ${Y + 80} ${X} ${Y + 84} C${X - 60} ${Y + 80} ${X - 120} ${Y + 90} ${X - 148} ${Y + 10} Z`} fill={C.hairCol} opacity="0.92" />}
      {C.hair === 'swept' && <path d={`M${X - 150} ${Y - 25} C${X - 160} ${Y - 165} ${X - 66} ${Y - 192} ${X} ${Y - 192} C${X + 98} ${Y - 192} ${X + 166} ${Y - 150} ${X + 154} ${Y - 35} C${X + 114} ${Y - 88} ${X + 54} ${Y - 106} ${X} ${Y - 98} C${X - 56} ${Y - 106} ${X - 114} ${Y - 78} ${X - 150} ${Y - 25} Z`} fill={C.hairCol} />}
      {C.hair === 'long' && <path d={`M${X - 152} ${Y - 10} C${X - 150} ${Y - 160} ${X - 60} ${Y - 190} ${X} ${Y - 190} C${X + 70} ${Y - 190} ${X + 150} ${Y - 160} ${X + 152} ${Y - 10} C${X + 100} ${Y - 120} ${X + 20} ${Y - 110} ${X - 10} ${Y - 150} C${X - 40} ${Y - 100} ${X - 110} ${Y - 110} ${X - 152} ${Y - 10} Z`} fill={C.hairCol} />}
      {C.hair === 'curls' && [...Array(11)].map((_, i) => { const a = Math.PI * (1.05 + i * 0.09); return <circle key={i} cx={X + Math.cos(a) * 150} cy={Y - 30 + Math.sin(a) * 160} r="48" fill={C.hairCol} />; })}
      {C.hair === 'bun' && <g fill={C.hairCol}><circle cx={X} cy={Y - 205} r="62" /><path d={`M${X - 152} ${Y - 20} C${X - 150} ${Y - 170} ${X - 60} ${Y - 192} ${X} ${Y - 192} C${X + 60} ${Y - 192} ${X + 150} ${Y - 170} ${X + 152} ${Y - 20} C${X + 90} ${Y - 110} ${X - 90} ${Y - 110} ${X - 152} ${Y - 20} Z`} /></g>}
      {C.hair === 'buzz' && <path d={`M${X - 148} ${Y - 40} C${X - 150} ${Y - 160} ${X - 66} ${Y - 180} ${X} ${Y - 180} C${X + 66} ${Y - 180} ${X + 150} ${Y - 160} ${X + 148} ${Y - 40} C${X + 100} ${Y - 110} ${X - 100} ${Y - 110} ${X - 148} ${Y - 40} Z`} fill={C.hairCol} opacity="0.85" />}
      <T2Face x={X} y={Y} T={T} mood={mood} look={look} ph={ph} />
      {C.glasses && <g fill="none" stroke={INK} strokeWidth="7"><circle cx={X - 61} cy={Y} r="40" /><circle cx={X + 61} cy={Y} r="40" /><line x1={X - 21} y1={Y - 4} x2={X + 21} y2={Y - 4} /></g>}
      {C.freckles && [-1, 1].map((sd) => [0, 1, 2].map((k) => <circle key={sd + '' + k} cx={X + sd * (80 + k * 14)} cy={Y + 52 + (k % 2) * 10} r="4" fill={C.skin2} />))}
      <ellipse cx={X - 88} cy={Y + 62} rx="26" ry="12" fill="#E8907A" opacity={mood === 'nervous' || mood === 'shocked' ? 0.7 : 0.45} />
      <ellipse cx={X + 88} cy={Y + 62} rx="26" ry="12" fill="#E8907A" opacity={mood === 'nervous' || mood === 'shocked' ? 0.7 : 0.45} />
    </g>);
  }

  Object.assign(window, { T2_CAST: CAST, T2Bust, T2Face });
})();
