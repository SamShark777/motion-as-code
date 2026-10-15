// caption-system.jsx — reusable kinetic-caption system for vertical Shorts.
// Pure function of time: <CaptionTrack T={seconds} chunks={[...]} />
//   chunk = { at, until?, text: "2–3 words", emph?: "WORD", fx?: one of CAPTION_FX,
//             mark?: marker colour, block?: stamp colour, doodle?: "⚡" }
// Only ONE chunk is visible at a time; max 3 words render per chunk.
// Non-emphasis words fade + slide up 12px in sequence. The emphasis word gets its fx.
(function () {
  const E = {
    out: (t) => 1 - Math.pow(1 - t, 3),
    in: (t) => t * t,
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    back: (t) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  };
  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const prog = (u, s, d) => cl((u - s) / d);
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  const ACID = '#FFD23F';
  const SHADOW = '0 6px 28px rgba(0,0,0,.6), 0 2px 4px rgba(0,0,0,.5)';
  const CAPTION_FX = ['pop', 'circle', 'underline', 'stamp', 'type', 'glitch', 'doodle'];
  const STAGGER = 0.09;

  function Plain({ w, u }) {
    const p = E.out(prog(u, 0, 0.28));
    return <span style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>{w}</span>;
  }

  // 1 — scale 1.4× + acid yellow + wobble
  function FxPop({ w, u }) {
    const p = prog(u, 0, 0.45);
    const s = 1 / 1.4 + (1 - 1 / 1.4) * E.back(p);
    const wob = u > 0 ? 6 * Math.sin(u * 15) * Math.exp(-u * 2.4) + 1.6 * Math.sin(u * 4.2) : 0;
    return (
      <span style={{ display: 'inline-block', fontSize: '1.4em', lineHeight: 1, color: ACID, opacity: cl(u / 0.08),
        transform: `scale(${s}) rotate(${wob}deg)` }}>{w}</span>
    );
  }

  // 2/3 — hand-drawn marker circle or underline drawing itself
  const CIRCLE_D = 'M80 7 C56 -1 16 2 5 19 C-4 34 19 48 53 47 C86 46 101 33 95 18 C90 7 69 1 42 5';
  const UNDER_D = 'M3 14 C30 6 66 9 97 4 M14 30 C40 22 68 24 88 20';
  function FxMarker({ w, u, kind, color }) {
    const p = E.inOut(prog(u, 0.22, 0.55));
    const circle = kind === 'circle';
    const box = circle
      ? { left: '-15%', top: '-32%', width: '130%', height: '164%' }
      : { left: '-5%', top: '86%', width: '110%', height: '38%' };
    return (
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <Plain w={w} u={u} />
        <svg viewBox={circle ? '0 0 100 50' : '0 0 100 36'} preserveAspectRatio="none"
          style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', ...box }}>
          <path d={circle ? CIRCLE_D : UNDER_D} fill="none" stroke={color || ACID} strokeWidth={circle ? 10 : 13}
            strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
            pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} />
        </svg>
      </span>
    );
  }

  // 4 — stamps in with a shake + red block behind
  function FxStamp({ w, u, color }) {
    const imp = 0.16;
    const s = u < imp ? 2.3 - 1.3 * E.in(prog(u, 0, imp)) : 1;
    const a = Math.max(0, u - imp);
    const sh = u > imp ? 14 * Math.sin(a * 70) * Math.exp(-a * 9) : 0;
    const block = E.out(prog(u, imp, 0.14));
    return (
      <span style={{ position: 'relative', display: 'inline-block', padding: '0 .16em', opacity: prog(u, 0, 0.05),
        transform: `translate(${sh}px, ${sh * 0.45}px) scale(${s}) rotate(-2.5deg)` }}>
        <span style={{ position: 'absolute', left: 0, right: 0, top: '6%', bottom: '2%', background: color || '#E0262F',
          borderRadius: 8, transform: `scaleX(${block})`, transformOrigin: 'left center',
          boxShadow: '0 10px 30px rgba(0,0,0,.35)' }}></span>
        <span style={{ position: 'relative' }}>{w}</span>
      </span>
    );
  }

  // 5 — types on letter by letter with blinking cursor
  function FxType({ w, u }) {
    const rate = 0.075;
    const n = u < 0 ? 0 : cl(Math.floor(u / rate) + 1, 0, w.length);
    const done = n >= w.length;
    const on = !done || Math.floor((u - w.length * rate) / 0.4) % 2 === 0;
    return (
      <span style={{ display: 'inline-block', whiteSpace: 'nowrap', color: ACID }}>
        <span>{w.slice(0, n)}</span>
        <span style={{ display: 'inline-block', width: '.09em', height: '.86em', marginLeft: '.05em', verticalAlign: '-0.04em',
          background: '#fff', opacity: on ? 1 : 0, boxShadow: '0 0 18px rgba(255,255,255,.6)' }}></span>
        <span style={{ opacity: 0 }}>{w.slice(n)}</span>
      </span>
    );
  }

  // 6 — splits apart / glitches (numbers, surprising facts)
  function FxGlitch({ w, u }) {
    const settle = 1 - E.out(prog(u, 0, 0.7));
    const c = u % 1.7;
    const g = Math.max(settle, c > 1.25 && c < 1.38 ? 0.55 : 0);
    const k = Math.floor(u * 28);
    const j = (i) => (hash(k * 7 + i) - 0.5) * 2;
    const dx = g * 42;
    const L = (st) => <span style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', ...st }}>{w}</span>;
    return (
      <span style={{ position: 'relative', display: 'inline-block', fontSize: '1.18em', lineHeight: 1, opacity: u < 0 ? 0 : 1 }}>
        <span style={{ visibility: 'hidden' }}>{w}</span>
        {L({ color: '#2EF2FF', textShadow: 'none', opacity: g > 0.02 ? 0.9 : 0, transform: `translate(${-g * 14 + j(0) * dx * 0.5}px, ${j(1) * g * 10}px)` })}
        {L({ color: '#FF2E63', textShadow: 'none', opacity: g > 0.02 ? 0.9 : 0, transform: `translate(${g * 14 + j(2) * dx * 0.5}px, ${j(3) * g * 10}px)` })}
        {L({ clipPath: 'inset(0 0 52% 0)', transform: `translateX(${-dx * (0.6 + j(4) * 0.4)}px)` })}
        {L({ clipPath: 'inset(48% 0 0 0)', transform: `translateX(${dx * (0.6 + j(5) * 0.4)}px)` })}
        {g > 0.12 && L({ clipPath: `inset(${38 + j(6) * 22}% 0 ${44 - j(6) * 22}% 0)`, color: ACID, transform: `translateX(${j(7) * g * 70}px)` })}
      </span>
    );
  }

  // 7 — a tiny emoji / doodle pops beside the word
  function FxDoodle({ w, u, doodle }) {
    const p = prog(u, 0.32, 0.42);
    const s = E.back(p);
    const rot = -28 + 38 * E.out(p) + (p >= 1 ? 7 * Math.sin((u - 0.74) * 5) : 0);
    return (
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <Plain w={w} u={u} />
        <span style={{ position: 'absolute', right: '-0.66em', top: '-0.46em', fontSize: '.6em', lineHeight: 1, textShadow: 'none',
          transform: `scale(${s}) rotate(${rot}deg)`, opacity: p > 0 ? 1 : 0,
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))' }}>{doodle || '⚡'}</span>
      </span>
    );
  }

  function EmphasisWord({ w, u, fx, chunk }) {
    switch (fx) {
      case 'pop': return <FxPop w={w} u={u} />;
      case 'circle': return <FxMarker w={w} u={u} kind="circle" color={chunk.mark} />;
      case 'underline': return <FxMarker w={w} u={u} kind="underline" color={chunk.mark} />;
      case 'stamp': return <FxStamp w={w} u={u} color={chunk.block} />;
      case 'type': return <FxType w={w} u={u} />;
      case 'glitch': return <FxGlitch w={w} u={u} />;
      case 'doodle': return <FxDoodle w={w} u={u} doodle={chunk.doodle} />;
      default: return <FxPop w={w} u={u} />;
    }
  }

  function CaptionTrack({ T, chunks, fontSize = 112, uppercase = false, color = '#fff', style }) {
    let idx = -1;
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const until = c.until != null ? c.until : (chunks[i + 1] ? chunks[i + 1].at : Infinity);
      if (T >= c.at && T < until) { idx = i; break; }
    }
    const base = {
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
      columnGap: '.24em', rowGap: '.06em', textAlign: 'center',
      fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif", fontWeight: 900,
      fontSize: +fontSize, lineHeight: 1.04, letterSpacing: '-0.015em', color, textShadow: SHADOW,
      ...style,
    };
    if (idx < 0) return <div style={base}></div>;
    const c = chunks[idx];
    const u = T - c.at;
    const words = c.text.split(/\s+/).filter(Boolean).slice(0, 3);
    return (
      <div key={idx} style={base}>
        {words.map((w, i) => {
          const core = w.replace(/[^\w%']/g, '');
          const isE = c.emph && core.toUpperCase() === String(c.emph).toUpperCase();
          const disp = uppercase || isE ? w.toUpperCase() : w;
          const wu = u - i * STAGGER;
          return isE
            ? <EmphasisWord key={i} w={disp} u={wu} fx={c.fx} chunk={c} />
            : <Plain key={i} w={disp} u={wu} />;
        })}
      </div>
    );
  }

  Object.assign(window, { CaptionTrack, EmphasisWord, CAPTION_FX, CAPTION_ACID: ACID });
})();
