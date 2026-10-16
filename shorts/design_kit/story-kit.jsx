// story-kit.jsx — timing helpers + drawing kit for "story" Shorts (format "story"), from the
// "One More Never Enough" build. Scene files (shorts/<slug>/scenes.jsx) use them through window:
//   const { K, L, E, win, kf, camT, lerpCam, ellPts, burst, sc, md, D2R, hsh, pal } = SK;
//   <StoryBust x y s look brow lid smile open tilt /> <StoryArm .../> <StoryPhone .../> …
// Everything is a pure function of time — no state, effects, timers or Math.random (use hsh).
// Colours come from the script's style.palette (see DEFAULT_PAL), so one character kit can wear
// any video's palette.
(function () {
  const DEFAULT_PAL = {
    ink: '#210B3D', accent: '#7624CE', accentDark: '#4F1691', hot: '#EA43E8', cool: '#59EAF3', deep: '#1750C9',
    pop: '#7FFF45', soft: '#E8C7FF', paper: '#FFFFFF', skin: '#F3D6FB', skinShade: '#C995EC', hair: '#2B1052',
  };
  const pal = () => ({ ...DEFAULT_PAL, ...((window.SCRIPT && window.SCRIPT.style && window.SCRIPT.style.palette) || {}) });

  // ---------- timing ----------
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  /** Linear progress of t through [a, b], clamped to [0, 1]. */
  const K = (t, a, b) => (b === a ? (t >= a ? 1 : 0) : clamp01((t - a) / (b - a)));
  const L = (a, b, k) => a + (b - a) * k;
  const MOTION = {
    enter: (k) => Easing.easeOutCubic(clamp01(k)),
    draw: (k) => Easing.easeInOutCubic(clamp01(k)),
    pop: (k) => Easing.easeOutBack(clamp01(k)),
  };
  /** Eased progress of t through [a, b] ('enter' | 'draw' | 'pop'). */
  const E = (t, a, b, m = 'enter') => MOTION[m](K(t, a, b));
  /** 0→1 fade-in at a, 1→0 fade-out at b, each over f seconds. */
  const win = (t, a, b, f = 0.3) => K(t, a, a + f) * (1 - K(t, b, b + f));
  /** Keyframes [[time, value], …], eased per segment. */
  function kf(t, fr, m = 'draw') {
    if (t <= fr[0][0]) return fr[0][1];
    for (let i = 0; i < fr.length - 1; i++) if (t < fr[i + 1][0]) return L(fr[i][1], fr[i + 1][1], MOTION[m](K(t, fr[i][0], fr[i + 1][0])));
    return fr[fr.length - 1][1];
  }
  /** Camera {fx, fy, s, px, py}: focus point (fx, fy) at scale s, placed at screen point (px, py). */
  const camT = (c) => `translate(${c.px} ${c.py}) scale(${c.s}) translate(${-c.fx} ${-c.fy})`;
  const lerpCam = (a, b, k) => ({ fx: L(a.fx, b.fx, k), fy: L(a.fy, b.fy, k), s: L(a.s, b.s, k), px: L(a.px, b.px, k), py: L(a.py, b.py, k) });
  const D2R = Math.PI / 180;
  function ellPts(cx, cy, rx, ry, a0, a1, n = 72) {
    const s = [];
    for (let i = 0; i <= n; i++) { const a = (a0 + ((a1 - a0) * i) / n) * D2R; s.push((cx + rx * Math.cos(a)).toFixed(1) + ',' + (cy + ry * Math.sin(a)).toFixed(1)); }
    return s.join(' ');
  }
  function burst(r1, r2, n) {
    const p = [];
    for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r1 : r2, a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2; p.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1)); }
    return p.join(' ');
  }
  const sc = (cx, cy, s) => `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`;
  const md = (v, m) => ((v % m) + m) % m;
  /** Deterministic pseudo-random in [0, 1) for an integer/float seed. */
  const hsh = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  // ---------- drawing kit ----------
  function StoryCap({ d, w, c, o = 4 }) {
    const P = pal();
    return <g>
      <path d={d} fill="none" stroke={P.ink} strokeWidth={w + o * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c || P.skin} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>;
  }
  const FING = {
    open: ['M26,-9 L44,-19', 'M29,-3 L50,-7', 'M29,3 L50,4', 'M26,9 L43,15', 'M12,-11 L22,-27'],
    point: ['M28,-5 L53,-7', 'M28,1 L36,5', 'M27,6 L34,10', 'M24,10 L30,14', 'M12,-11 L22,-21'],
    relax: ['M27,-6 L38,-4 L42,4', 'M28,0 L38,3 L40,10', 'M26,6 L34,10 L35,15', 'M12,-11 L24,-17'],
    grip: ['M26,-8 L34,-2 L33,8', 'M27,-1 L35,5 L33,14', 'M25,6 L31,12 L29,19', 'M12,-11 L28,-15'],
  };
  /** Hand at the origin pointing +x. pose: open | point | relax | grip. children draw under the fingers (a held prop). */
  function StoryHand({ pose = 'open', children }) {
    const P = pal();
    return <g>
      {children}
      {FING[pose].map((d, i) => <StoryCap key={i} d={d} w={6.5} o={2.3} />)}
      <path d="M-2,-12 L20,-14 L30,-6 L30,8 L18,14 L0,12 Z" fill={P.skin} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-2,4 L18,14 L0,12 Z" fill={P.skinShade} />
    </g>;
  }
  /** Two-segment arm from the shoulder (x, y): a1 upper-arm angle, a2 forearm angle (degrees, 0 = right, 90 = down). */
  function StoryArm({ x, y, s = 1, a1, a2, hand = 'open', flip = false, sleeve, children }) {
    const P = pal();
    const ex = Math.cos(a1 * D2R) * 75, ey = Math.sin(a1 * D2R) * 75;
    const wx = ex + Math.cos(a2 * D2R) * 70, wy = ey + Math.sin(a2 * D2R) * 70;
    return <g transform={`translate(${x} ${y}) scale(${s})`}>
      <StoryCap d={`M0,0 L${ex.toFixed(1)},${ey.toFixed(1)} L${wx.toFixed(1)},${wy.toFixed(1)}`} w={24} c={sleeve || P.accent} o={4.5} />
      <g transform={`translate(${wx} ${wy}) rotate(${a2}) scale(1 ${flip ? -1 : 1})`}>
        <rect x="-6" y="-13" width="9" height="26" rx="3" fill={P.cool} stroke={P.ink} strokeWidth="3" />
        <StoryHand pose={hand}>{children}</StoryHand>
      </g>
    </g>;
  }
  const CURLS = [[-52, -156, 9], [54, -170, 9], [-48, -176, 13], [-38, -196, 15], [-18, -208, 16], [4, -212, 16], [26, -206, 15], [44, -190, 14], [-28, -186, 10], [14, -194, 11]];
  /** The protagonist, head and shoulders; (x, y) is the bottom centre of the torso (torso spans y-94…y+90, head up to y-228).
   *  look ∈ [-1,1]² (eye direction), brow (-1 sad … 1 raised), lid (0 open … 1 sleepy), smile (-1 … 1), open (mouth, 0…1), tilt (deg). */
  function StoryBust({ x, y, s = 1, look = [0, 0], brow = 0, lid = 0, smile = 0, open = 0, tilt = 0, rim = true, shirt }) {
    const P = pal();
    const lx = look[0] * 4.5, ly = look[1] * 3.2, b = brow * 6, ry = Math.max(1.6, 8 - lid * 5), pr = Math.min(4.6, ry + 0.4);
    return <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-84,-80 L-28,-94 L28,-94 L84,-80 L108,90 L-108,90 Z" fill={shirt || P.accent} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-84,-80 L-54,-88 L-72,90 L-108,90 Z" fill={P.accentDark} opacity="0.85" />
      <path d="M-13,-114 L13,-114 L14,-88 L-14,-88 Z" fill={P.skinShade} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-26,-94 L26,-94 L10,-24 L0,-12 L-10,-24 Z" fill={P.cool} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-26,-94 L-36,-68 L-20,-60 L-6,-16 M26,-94 L36,-68 L20,-60 L6,-16" fill="none" stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
      <g transform={`rotate(${tilt} 0 -104)`}>
        <ellipse cx="-45" cy="-148" rx="8" ry="12" fill={P.skin} stroke={P.ink} strokeWidth="4" />
        <path d="M-44,-188 L40,-194 L50,-150 L45,-121 L19,-96 L-14,-96 L-41,-122 Z" fill={P.skin} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
        <path d="M-42,-186 L-31,-187 L-34,-150 L-25,-119 L-13,-98 L-39,-122 Z" fill={P.skinShade} />
        {rim && <path d="M42,-186 L48,-150 L43,-123 L21,-100" fill="none" stroke={P.hot} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />}
        <ellipse cx="-16" cy="-151" rx="9" ry={ry} fill={P.paper} stroke={P.ink} strokeWidth="3.5" />
        <ellipse cx="18" cy="-152" rx="9" ry={ry} fill={P.paper} stroke={P.ink} strokeWidth="3.5" />
        <circle cx={-16 + lx} cy={-151 + (ly * ry) / 8} r={pr} fill={P.ink} />
        <circle cx={18 + lx} cy={-152 + (ly * ry) / 8} r={pr} fill={P.ink} />
        {lid > 0.12 && <path d={`M-26,${-151 - ry} L-6,${-151 - ry} M8,${-152 - ry} L28,${-152 - ry}`} stroke={P.ink} strokeWidth="4" strokeLinecap="round" />}
        <path d={`M-28,${-165 - b} L-6,${-169 - b * 1.45} M8,${-170 - b * 1.45} L30,${-167 - b}`} stroke={P.ink} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M3,-148 L-5,-128 L4,-126" fill="none" stroke={P.ink} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
        {open > 0.05
          ? <ellipse cx="2" cy="-112" rx={4 + open * 3} ry={2 + open * 5} fill={P.ink} />
          : <path d={`M-12,-113 Q2,${-113 + smile * 9} 15,-114`} fill="none" stroke={P.ink} strokeWidth="4.5" strokeLinecap="round" />}
        {CURLS.map(([cx, cy, r], i) => <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={P.hair} stroke={P.ink} strokeWidth="3.5" />
          <path d={`M${cx - r * 0.5},${cy - r * 0.15} A${r * 0.6} ${r * 0.6} 0 0 1 ${cx + r * 0.3},${cy - r * 0.55}`} fill="none" stroke={P.accent} strokeWidth="3" strokeLinecap="round" />
        </g>)}
      </g>
    </g>;
  }
  /** Small full-body protagonist; (x, y) at the feet. dir ±1 faces right/left, ph = walk phase (e.g. t*13), reach 0…1. */
  function StoryMini({ x, y, dir = 1, ph = 0, reach = 0, s = 1.25 }) {
    const P = pal();
    const a = Math.sin(ph) * 26 * D2R;
    const f1 = [Math.sin(a) * 24, -24 + Math.cos(a) * 24], f2 = [-Math.sin(a) * 24, -24 + Math.cos(a) * 24];
    const hx = dir * (17 + reach * 9), hy = -44 - reach * 9;
    return <g transform={`translate(${x} ${y}) scale(${s})`}>
      <StoryCap d={`M0,-24 L${f2[0]},${f2[1]}`} w={6} c={P.ink} o={1} />
      <StoryCap d={`M0,-24 L${f1[0]},${f1[1]}`} w={6} c={P.ink} o={1} />
      <path d="M-11,-50 L11,-50 L13,-22 L-13,-22 Z" fill={P.accent} stroke={P.ink} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-4,-50 L4,-50 L0,-37 Z" fill={P.cool} />
      <StoryCap d={`M${dir * 6},-46 L${hx},${hy}`} w={6} c={P.accent} o={2} />
      <circle cx={hx} cy={hy} r="4" fill={P.skin} stroke={P.ink} strokeWidth="2.5" />
      <circle cx={dir * 2} cy="-62" r="12" fill={P.skin} stroke={P.ink} strokeWidth="3" />
      {[[-9, -70, 6], [-1, -75, 7], [7, -73, 6.5], [-12, -61, 4.5]].map(([cx, cy, r], i) => <circle key={i} cx={cx * dir} cy={cy} r={r} fill={P.hair} stroke={P.ink} strokeWidth="2.5" />)}
      <circle cx={dir * 7} cy="-62" r="1.9" fill={P.ink} />
    </g>;
  }
  /** Phone centred on the origin. clip = a unique id to clip children to the screen. */
  function StoryPhone({ w, h, screen, sw = 5, clip, children }) {
    const P = pal();
    return <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.15} fill={P.ink} />
      <rect x={-w / 2 + sw} y={-h / 2 + sw * 1.6} width={w - 2 * sw} height={h - sw * 3.2} rx={w * 0.1} fill={screen || P.hot} />
      {clip && <clipPath id={clip}><rect x={-w / 2 + sw} y={-h / 2 + sw * 1.6} width={w - 2 * sw} height={h - sw * 3.2} rx={w * 0.1} /></clipPath>}
      <g clipPath={clip ? `url(#${clip})` : undefined}>{children}</g>
    </g>;
  }
  /** Feed card centred on the origin. */
  function StoryCard({ w, h, fill, thumb, sw = 4, glow, glowO = 1 }) {
    const P = pal();
    return <g>
      {glow && <rect x={-w / 2 - 9} y={-h / 2 - 9} width={w + 18} height={h + 18} rx="14" fill="none" stroke={glow} strokeWidth="9" opacity={0.6 * glowO} />}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(10, w * 0.08)} fill={fill || P.paper} stroke={P.ink} strokeWidth={sw} />
      <rect x={-w / 2 + w * 0.08} y={-h / 2 + h * 0.1} width={w * 0.84} height={h * 0.48} rx="4" fill={thumb || P.hot} stroke={P.ink} strokeWidth={sw * 0.6} />
      <path d={`M${-w * 0.3},${-h * 0.02} L${-w * 0.08},${-h * 0.32} L${w * 0.12},${-h * 0.02} Z`} fill={P.paper} opacity="0.55" />
      <rect x={-w / 2 + w * 0.08} y={h * 0.16} width={w * 0.6} height={h * 0.09} rx="2" fill={P.ink} />
      <rect x={-w / 2 + w * 0.08} y={h * 0.31} width={w * 0.38} height={h * 0.08} rx="2" fill={P.ink} opacity="0.45" />
    </g>;
  }
  function StoryToggle({ x, y, on }) {
    const P = pal();
    return <g transform={`translate(${x} ${y})`}>
      <rect x="-15" y="-8" width="30" height="16" rx="8" fill={P.soft} stroke={P.ink} strokeWidth="2.5" />
      <rect x="-15" y="-8" width="30" height="16" rx="8" fill={P.pop} opacity={on} stroke={P.ink} strokeWidth="2.5" />
      <circle cx={L(-7, 7, on)} cy="0" r="6" fill={P.paper} stroke={P.ink} strokeWidth="2.5" />
    </g>;
  }
  /** Bell icon ~100 px tall centred on the origin. */
  function StoryBell({ muted = false, fill, line, sw = 7 }) {
    const P = pal();
    const f = fill || P.cool, l = line || P.accent;
    return <g>
      <circle cx="0" cy="-50" r="6" fill={f} stroke={l} strokeWidth={sw * 0.8} />
      <path d="M-34,20 C-34,-12 -28,-42 0,-45 C28,-42 34,-12 34,20 L44,32 L-44,32 Z" fill={f} stroke={l} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M-10,40 A10 10 0 0 0 10,40" fill="none" stroke={l} strokeWidth={sw} strokeLinecap="round" />
      {muted && <g><path d="M-48,-48 L48,48" stroke={P.paper} strokeWidth={sw * 2.4} strokeLinecap="round" /><path d="M-48,-48 L48,48" stroke={l} strokeWidth={sw} strokeLinecap="round" /></g>}
    </g>;
  }
  /** Dark label pill centred at (x, y). */
  function StoryTag({ x, y, text, o = 1, size = 23 }) {
    const P = pal(), st = (window.SCRIPT && window.SCRIPT.style) || {};
    const w = text.length * size * 0.5 + 26;
    return <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect x={-w / 2} y={-size * 0.7} width={w} height={size * 1.4} rx="6" fill={P.ink} />
      <text x="0" y={size * 0.35} textAnchor="middle" fill={P.paper} fontFamily={`'${st.head || 'Barlow Condensed'}', sans-serif`} fontWeight="700" fontSize={size} letterSpacing="1.2">{text}</text>
    </g>;
  }
  /** Rounded, clipped, outlined panel; id must be unique in the video. */
  function StoryBox({ x, y, w = 150, h = 96, rot = 0, s = 1, fill, id, children }) {
    const P = pal();
    return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <clipPath id={id}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" /></clipPath>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill={fill || P.soft} />
      <g clipPath={`url(#${id})`}>{children}</g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill="none" stroke={P.ink} strokeWidth="5" />
    </g>;
  }

  const SK = { pal, DEFAULT_PAL, clamp01, K, L, MOTION, E, win, kf, camT, lerpCam, D2R, ellPts, burst, sc, md, hsh };
  Object.assign(window, { SK, StoryCap, StoryHand, StoryArm, StoryBust, StoryMini, StoryPhone, StoryCard, StoryToggle, StoryBell, StoryTag, StoryBox });
})();
