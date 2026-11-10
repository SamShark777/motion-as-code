// xplog-kit.jsx — "experiment log" Shorts (format "xplog", Shivam 2026-11-09): a timed, second-person experiment told
// as a log. The engine (xplog-engine.jsx) draws the page: chapter title + running clock + counter (the HUD) on top, ONE
// wide 1080×608 illustrated panel in the middle, the full sentence as a caption underneath. art.jsx draws ONLY the panel
// (viewBox 0 0 1080 608) with this kit: thick ink outlines, navy striped walls, cream UI cards, yellow accent, red alerts.
// Cast: shorts/characters/xplog-cast.json (keep in sync with CAST). Pictures: shorts/styles/xplog/.
// Everything is a pure function of time: no state, effects, timers or Math.random (use XL.hsh).
(function () {
  const INK = '#0A0C14', CREAM = '#F3E9CF', ACC = '#FFC93C', RED = '#E5484D', NAVY = '#232B47', GREY = '#8E97B8', GREEN = '#3DD68C', BLUE = '#2B3A67';
  const W = 1080, H = 608, FONT = "'Poppins', 'Montserrat', sans-serif";
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sm = (a, b, t) => { t = clamp((t - a) / (b - a)); return t * t * (3 - 2 * t); };
  const eo = (t) => 1 - Math.pow(1 - clamp(t), 3);
  const back = (t) => { t = clamp(t); const s = 1.9; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
  const osc = (T, p, ph = 0) => Math.sin((T / p + ph) * Math.PI * 2);
  const hsh = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const p2 = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');
  const clock = (sec) => `${p2(sec / 3600)}:${p2((sec / 60) % 60)}:${p2(sec % 60)}`;
  const beat = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
  const FB = { transformBox: 'fill-box', transformOrigin: 'center' };

  // ---- motion wrappers (t = seconds into the scene, at = when it lands) ----
  function XLPop({ t, at = 0, children }) { const u = t - at; return u < 0 ? null : <g style={{ ...FB, transform: `scale(${back(u / 0.34)})` }}>{children}</g>; }
  function XLFade({ t, at = 0, out, d = 0.3, children }) { const o = clamp((t - at) / d) * (out != null ? 1 - clamp((t - out) / 0.2) : 1); return o <= 0 ? null : <g opacity={o}>{children}</g>; }
  function XLRise({ t, at = 0, dy = 300, children }) { const u = t - at; return u < 0 ? null : <g transform={`translate(0 ${(1 - eo(u / 0.45)) * dy})`}>{children}</g>; }
  function XLWiggle({ T, amp = 5, p = 0.45, children }) { return <g style={{ ...FB, transform: `rotate(${osc(T, p) * amp}deg)` }}>{children}</g>; }
  function XLPulse({ T, amp = 0.07, p = 0.9, children }) { return <g style={{ ...FB, transform: `scale(${1 + amp * osc(T, p)})` }}>{children}</g>; }

  // ---- basics ----
  function XLText({ x, y, size = 32, fill = '#fff', anchor = 'start', weight = 800, children }) {
    return <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} style={{ fontFamily: FONT, fontWeight: weight }}>{children}</text>;
  }
  function XLCard({ x, y, w, h, r = 22, fill = CREAM, sw = 7, rot = 0 }) {
    return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={INK} strokeWidth={sw} transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined} />;
  }
  function XLGlow({ x, y, r, col = '#CFE6FF', a = 0.75 }) {
    const id = 'g' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
    return (<g><defs><radialGradient id={id}><stop offset="0" stopColor={col} stopOpacity={a} /><stop offset="1" stopColor={col} stopOpacity="0" /></radialGradient></defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} /></g>);
  }
  // backgrounds: wall | wallDark | room | wood | woodDark
  function XLBg({ kind = 'wall' }) {
    if (kind === 'wood' || kind === 'woodDark') {
      const c = kind === 'wood' ? '#4A352B' : '#2A1F1C', l = kind === 'wood' ? '#3D2B23' : '#221815';
      return (<g><rect width={W} height={H} fill={c} />{[100, 225, 350, 475].map((y) => <line key={y} x1="0" y1={y} x2={W} y2={y} stroke={l} strokeWidth="6" />)}
        <path d="M200 100v125M620 225v125M380 350v125M860 100v125M900 475v133" stroke={l} strokeWidth="6" /></g>);
    }
    const [c1, c2] = kind === 'wallDark' ? ['#141A33', '#182040'] : ['#1A2140', '#1F284C'];
    const stripes = []; for (let x = 0; x < W; x += 90) stripes.push(<rect key={x} x={x} y="0" width="45" height={H} fill={c2} />);
    return (<g><rect width={W} height={H} fill={c1} />{stripes}
      {kind === 'room' && (<g><rect x="70" y="60" width="240" height="270" rx="8" fill="#0C1128" stroke={INK} strokeWidth="8" />
        <circle cx="235" cy="125" r="30" fill="#F6EFC8" /><circle cx="248" cy="117" r="26" fill="#0C1128" />
        <rect x="84" y="235" width="50" height="90" fill="#1B2347" /><rect x="140" y="205" width="60" height="120" fill="#222C57" /><rect x="206" y="250" width="90" height="75" fill="#1B2347" />
        <rect x="152" y="220" width="10" height="10" fill={ACC} /><rect x="176" y="250" width="10" height="10" fill={ACC} /><rect x="230" y="270" width="10" height="10" fill={ACC} />
        <line x1="190" y1="60" x2="190" y2="330" stroke={INK} strokeWidth="6" /><line x1="70" y1="195" x2="310" y2="195" stroke={INK} strokeWidth="6" />
        <rect x="-10" y="500" width="1100" height="120" fill="#3B2A24" stroke={INK} strokeWidth="6" /></g>)}</g>);
  }

  // ---- the cast (keep in sync with shorts/characters/xplog-cast.json) ----
  const CAST = {
    finn: { name: 'Finn', skin: '#F0B27A', lid: '#DF9C62', top: '#2FA8A0', hat: 'beanie', hatCol: ACC, band: '#E0A91F', glasses: true },
    ivy: { name: 'Ivy', skin: '#F4D3BC', lid: '#E2B79C', top: '#E4572E', hat: 'bob', hatCol: '#6B4BC2', glasses: false },
    gus: { name: 'Gus', skin: '#B9825A', lid: '#A16E49', top: '#5B8DEF', hat: 'curls', hatCol: '#2A2230', glasses: false },
  };
  const MOODS = {
    neutral: { p: 9, b: [-30, -30], m: 'M-20 66 Q0 72 20 66' }, wide: { p: 6, b: [-44, -46], m: 'O' }, worried: { p: 8, b: [-26, -42], m: 'M-20 72 Q0 60 20 72' },
    squint: { p: 8, b: [-36, -20], m: 'M-18 68 L18 68', lid: 1 }, sleepy: { p: 8, b: [-28, -28], m: 'M-12 68 Q0 71 12 68', lid: 1 },
    relief: { p: 0, b: [-38, -40], m: 'M-26 60 Q0 88 26 60' }, smile: { p: 9, b: [-34, -34], m: 'M-24 60 Q0 82 24 60' },
  };
  // XLChar: bust. who = finn | ivy | gus, mood = neutral | wide | worried | squint | sleepy | relief | smile, look = [dx, dy] px, bl = blink 0/1
  function XLChar({ x, y, s = 1, who = 'finn', mood = 'neutral', look = [0, 0], sweat, bl }) {
    const c = CAST[who] || CAST.finn, E = MOODS[mood] || MOODS.neutral, er = c.glasses ? 33 : 26;
    const eye = (cx) => (<g key={cx}><circle cx={cx} cy="22" r={er} fill="#fff" stroke={INK} strokeWidth="6" />
      {E.p && !bl ? <circle cx={cx + look[0]} cy={24 + look[1]} r={E.p} fill={INK} /> : <path d={`M${cx - 16} 28 Q${cx} ${bl ? 34 : 8} ${cx + 16} 28`} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />}
      {E.lid && !bl ? <path d={`M${cx - er} 22 A${er} ${er} 0 0 1 ${cx + er} 22 Z`} fill={c.lid} stroke={INK} strokeWidth="6" /> : null}</g>);
    return (<g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 320 Q-180 125 -62 98 Q0 128 62 98 Q180 125 175 320 Z" fill={c.top} stroke={INK} strokeWidth="6" />
      <path d="M-22 118 v52 M22 118 v52" stroke="#fff" strokeOpacity="0.85" strokeWidth="6" strokeLinecap="round" />
      {c.hat === 'bob' && <path d="M-112 60 Q-130 -130 0 -128 Q130 -130 112 60 Q90 80 78 40 L-78 40 Q-90 80 -112 60 Z" fill={c.hatCol} stroke={INK} strokeWidth="6" />}
      <circle r="100" fill={c.skin} stroke={INK} strokeWidth="6" />
      {c.hat === 'beanie' && (<g><path d="M-97 -40 Q-96 -138 0 -140 Q96 -138 97 -40 Z" fill={c.hatCol} stroke={INK} strokeWidth="6" />
        <rect x="-104" y="-72" width="208" height="36" rx="14" fill={c.band} stroke={INK} strokeWidth="6" /><circle cy="-146" r="17" fill="#fff" stroke={INK} strokeWidth="6" /></g>)}
      {c.hat === 'bob' && <path d="M-98 -20 Q-90 -112 0 -112 Q90 -112 98 -20 Q40 -70 -98 -20 Z" fill={c.hatCol} stroke={INK} strokeWidth="6" strokeLinejoin="round" />}
      {c.hat === 'curls' && (<g fill={c.hatCol} stroke={INK} strokeWidth="6">{[[-78, -62, 34], [-40, -96, 36], [8, -108, 38], [54, -90, 36], [84, -52, 30]].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={q[2]} />)}
        <path d="M-92 -44 Q0 -84 92 -40 Q0 -64 -92 -44 Z" stroke="none" /></g>)}
      {eye(-42)}{eye(42)}{c.glasses && <line x1="-9" y1="22" x2="9" y2="22" stroke={INK} strokeWidth="6" />}
      <path d={`M-72 ${E.b[0]} L-20 ${E.b[1]} M72 ${E.b[0]} L20 ${E.b[1]}`} stroke={INK} strokeWidth="7" strokeLinecap="round" />
      {E.m === 'O' ? <ellipse cx="0" cy="72" rx="11" ry="14" fill="#5A1F1F" stroke={INK} strokeWidth="5" /> : <path d={E.m} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />}
      {sweat ? <path d="M96 -30 q14 22 0 30 q-14 -8 0 -30z" fill="#9AD8FF" stroke={INK} strokeWidth="4" /> : null}</g>);
  }
  function XLAvatar({ x, y, r = 26 }) {
    return (<g><circle cx={x} cy={y} r={r} fill="#9AA3BF" stroke={INK} strokeWidth="5" /><circle cx={x} cy={y - r * 0.2} r={r * 0.32} fill="#5C6688" />
      <path d={`M${x - r * 0.6} ${y + r * 0.72} Q${x} ${y - r * 0.1} ${x + r * 0.6} ${y + r * 0.72}`} fill="#5C6688" /></g>);
  }

  // ---- phone / chat UI ----
  // XLBubble: a chat bubble. mine = right-hand navy bubble; otherwise white. lines = array of strings (CAPS reads best).
  function XLBubble({ x, y, w, lines, mine, size = 32 }) {
    const h = 46 + lines.length * (size + 10);
    return (<g><rect x={x} y={y} width={w} height={h} rx="26" fill={mine ? BLUE : '#fff'} stroke={INK} strokeWidth="6" />
      {lines.map((s, i) => <XLText key={i} x={mine ? x + w / 2 : x + 30} y={y + 47 + i * (size + 10)} size={size} fill={mine ? '#fff' : INK} anchor={mine ? 'middle' : 'start'}>{s}</XLText>)}</g>);
  }
  // XLChat: the message window (fills the panel). name/status in the header; children are drawn inside (bubbles at
  // x 170–910, y 130–450); input = text shown in the message box (string) or null for the placeholder.
  function XLChat({ name = 'SAM', status = '', input, children }) {
    return (<g><XLBg kind="wallDark" /><XLCard x={140} y={30} w={800} h={548} r={24} />
      <path d="M140 110 V54 a24 24 0 0 1 24 -24 H916 a24 24 0 0 1 24 24 V110 Z" fill={NAVY} stroke={INK} strokeWidth="7" /><XLAvatar x={200} y={70} />
      <XLText x={245} y={84} size={38}>{name}</XLText><XLText x={910} y={82} size={22} fill={GREY} anchor="end">{status}</XLText>
      {children}
      <rect x="170" y="478" width="740" height="70" rx="35" fill="#fff" stroke={INK} strokeWidth="5" />
      {input != null ? <XLText x={205} y={524} size={26} fill={INK}>{input}</XLText> : <XLText x={205} y={524} size={26} fill="#B8B8B8">MESSAGE</XLText>}
      <circle cx="868" cy="513" r="24" fill={ACC} stroke={INK} strokeWidth="5" /><path d="M858 513 h18 m-8 -8 l8 8 l-8 8" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" /></g>);
  }
  // XLPhone: a handset centred on (x, y). back = camera side up; lit = screen on (children drawn on the screen, 0,0 = screen top-left).
  function XLPhone({ x, y, w = 250, h = 440, rot = 0, back: bk, lit, children }) {
    return (<g transform={`rotate(${rot} ${x} ${y}) translate(${x - w / 2} ${y - h / 2})`}>
      <rect x="12" y="14" width={w} height={h} rx="34" fill="#000" opacity="0.3" /><rect width={w} height={h} rx="34" fill="#1C2030" stroke={INK} strokeWidth="7" />
      {bk ? (<g><rect x="20" y="20" width="92" height="92" rx="22" fill="#2A3050" stroke={INK} strokeWidth="5" /><circle cx="48" cy="48" r="14" fill={INK} /><circle cx="84" cy="84" r="14" fill={INK} /><circle cx="86" cy="46" r="7" fill={ACC} /></g>)
        : (<g><rect x="16" y="18" width={w - 32} height={h - 36} rx="18" fill={lit ? '#CFE6FF' : '#0C1128'} /><g transform="translate(16 18)">{children}</g></g>)}</g>);
  }

  // ---- props ----
  function XLChip({ x, y, text, fill = RED, col = '#fff', size = 30, rot = 0 }) {
    const w = String(text).length * size * 0.66 + 54;
    return (<g transform={`rotate(${rot} ${x} ${y})`}><rect x={x - w / 2} y={y - size * 0.95} width={w} height={size * 1.9} rx={size * 0.95} fill={fill} stroke={INK} strokeWidth="6" />
      <XLText x={x} y={y + size * 0.36} size={size} fill={col} anchor="middle">{text}</XLText></g>);
  }
  function XLStamp({ x, y, text, size = 52, rot = -5, col = RED }) {
    const w = String(text).length * size * 0.66 + 60;
    return (<g transform={`rotate(${rot} ${x} ${y})`}><rect x={x - w / 2} y={y - size} width={w} height={size * 1.9} rx="10" fill="none" stroke={col} strokeWidth="9" />
      <XLText x={x} y={y + size * 0.32} size={size} fill={col} anchor="middle">{text}</XLText></g>);
  }
  function XLStopwatch({ x, y, r = 200, text }) {
    return (<g><rect x={x - 34} y={y - r - 62} width="68" height="60" rx="10" fill="#C9CEDF" stroke={INK} strokeWidth="6" /><circle cx={x} cy={y} r={r} fill={CREAM} stroke={INK} strokeWidth="12" />
      <circle cx={x} cy={y} r={r * 0.84} fill="none" stroke={ACC} strokeWidth="10" /><XLText x={x} y={y + r * 0.21} size={r * 0.58} fill={INK} anchor="middle">{text}</XLText></g>);
  }
  // XLDial: round progress timer, p = 0–1
  function XLDial({ x, y, r = 130, p = 0, text }) {
    const c = 2 * Math.PI * (r - 22);
    return (<g><circle cx={x} cy={y} r={r} fill={NAVY} stroke={INK} strokeWidth="8" /><circle cx={x} cy={y} r={r - 22} fill="none" stroke={ACC} strokeWidth="16"
      strokeDasharray={c} strokeDashoffset={c * (1 - clamp(p))} transform={`rotate(-90 ${x} ${y})`} /><XLText x={x} y={y + r * 0.17} size={r * 0.48} anchor="middle">{text}</XLText></g>);
  }
  function XLSpiral({ x, y, r = 120, rot = 0, col = '#fff', sw = 16 }) {
    let d = ''; for (let i = 0; i <= 120; i++) { const a = (i / 120) * 3.2 * 2 * Math.PI, rr = (r * i) / 120; d += (i ? 'L' : 'M') + (x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1); }
    return <path d={d} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" transform={`rotate(${rot} ${x} ${y})`} />;
  }
  function XLBattery({ x, y, w = 270, h = 180, level = 0.12, col = RED }) {
    return (<g><rect x={x} y={y} width={w} height={h} rx="24" fill={CREAM} stroke={INK} strokeWidth="8" /><rect x={x + w} y={y + h / 2 - 35} width="26" height="70" rx="8" fill={CREAM} stroke={INK} strokeWidth="8" />
      <rect x={x + 22} y={y + 22} width={Math.max(8, (w - 44) * level)} height={h - 44} rx="8" fill={col} /></g>);
  }
  function XLBulb({ x, y }) {
    return (<g transform={`translate(${x} ${y})`}><XLGlow x={0} y={0} r={170} col={ACC} a={0.5} /><path d="M0 -80 a62 62 0 0 1 34 114 v26 h-68 v-26 a62 62 0 0 1 34 -114z" fill={ACC} stroke={INK} strokeWidth="7" />
      <rect x="-30" y="66" width="60" height="26" rx="6" fill="#C9CEDF" stroke={INK} strokeWidth="6" /><path d="M0 -130v-34M-110 -80l-28-20M110 -80l28-20M-134 10h-36M134 10h36" stroke={ACC} strokeWidth="9" strokeLinecap="round" /></g>);
  }
  // XLBars: a simple bar chart on a cream card. bars = [{ label: ['TWO', 'LINES'], v: 0–1, col, at }]
  function XLBars({ t, title, bars, note }) {
    return (<g><XLCard x={110} y={40} w={860} h={540} r={20} /><XLText x={160} y={105} size={32} fill={INK}>{title}</XLText>
      <path d="M230 130 V470 H900" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      {bars.map((b, i) => { const x = 300 + i * (560 / bars.length), hh = 320 * b.v * eo((t - (b.at || 0)) / 0.8);
        return (<g key={i}>{hh > 1 && <rect x={x} y={466 - hh} width="170" height={hh} fill={b.col || GREY} stroke={INK} strokeWidth="7" />}
          {b.label.map((s, j) => <XLText key={j} x={x + 85} y={512 + j * 34} size={26} fill={INK} anchor="middle">{s}</XLText>)}</g>); })}
      {note && <XLText x={950} y={562} size={17} fill="#7A705A" anchor="end">{note}</XLText>}</g>);
  }

  window.XL = { INK, CREAM, ACC, RED, NAVY, GREY, GREEN, BLUE, W, H, FONT, CAST, clamp, lerp, sm, eo, back, osc, hsh, p2, clock, beat };
  Object.assign(window, { XLPop, XLFade, XLRise, XLWiggle, XLPulse, XLText, XLCard, XLGlow, XLBg, XLChar, XLAvatar, XLBubble, XLChat, XLPhone, XLChip, XLStamp,
    XLStopwatch, XLDial, XLSpiral, XLBattery, XLBulb, XLBars });
})();
