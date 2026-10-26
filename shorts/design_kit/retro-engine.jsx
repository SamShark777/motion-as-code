// retro-engine.jsx — "retro modern illustration style" Shorts (format "retro"). Full-bleed 1080×1920 scenes drawn by
// art.jsx with retro-kit.jsx, a slow camera push per scene with a punch on every cut, a stipple + paper-grain texture
// over everything (the risograph feel), a warm vignette, and one caption chunk at a time in bold condensed cream type
// with a hard black offset shadow; emphasis words mustard.
// Per line (optional): "cam": [focusX, focusY, scaleFrom, scaleTo] (default [540, 960, 1, 1.06]), "capY" (default 1540).
const RM_CAP_FONT = "'Oswald', 'Bebas Neue', sans-serif";

function RMCaption({ T, r }) {
  let cur = -1;
  r.abs.forEach((c, i) => { if (T >= c.at) cur = i; });
  if (cur < 0) return null;
  const c = r.abs[cur], p = T - c.at;
  const sc = 0.85 + 0.15 * RM.back(p / 0.15);
  const emph = String(c.emph || '').toUpperCase().split(/\s+/).filter(Boolean);
  return (
    <div style={{ position: 'absolute', left: 70, right: 70, top: (r.capY || 1540) - 120, height: 240, display: 'flex', flexWrap: 'wrap',
      justifyContent: 'center', alignContent: 'center', columnGap: '0.26em', font: `700 96px/1.08 ${RM_CAP_FONT}`, textAlign: 'center',
      transform: `scale(${sc})` }}>
      {c.text.toUpperCase().split(/\s+/).filter(Boolean).map((w, j) => {
        const core = w.replace(/[^\w%'-]/g, '');
        const hot = emph.includes(core) || emph.includes(w);
        return <span key={j} style={{ color: hot ? '#F4C437' : '#F4E7D2', WebkitTextStroke: '6px #17131A', paintOrder: 'stroke fill',
          textShadow: '8px 8px 0 #17131A' }}>{w}</span>;
      })}
    </div>
  );
}

function RMTexture({ T }) {
  const seed = Math.floor(T * 10) % 4, u = 'u' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <g>
      <defs>
        <filter id={`rmSpk${seed}${u}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed={seed + 1} />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 -0.62" />
          <feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0.55 0.85 1" /></feComponentTransfer>
        </filter>
        <filter id={`rmLt${seed}${u}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed={seed + 9} />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 1.7 0 0 -0.78" />
          <feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0.5 0.9" /></feComponentTransfer>
        </filter>
        <radialGradient id={`rmVig${u}`} cx="0.5" cy="0.45" r="0.75"><stop offset="0.5" stopColor="#140505" stopOpacity="0" /><stop offset="1" stopColor="#140505" stopOpacity="0.45" /></radialGradient>
      </defs>
      <rect width="1080" height="1920" filter={`url(#rmSpk${seed}${u})`} opacity="0.45" />
      <rect width="1080" height="1920" filter={`url(#rmLt${seed}${u})`} opacity="0.12" />
      <rect width="1080" height="1920" fill={`url(#rmVig${u})`} />
    </g>
  );
}

function RMScene({ r, T }) {
  const t = T - r.start, dur = Math.max(0.1, r.end - r.start);
  const Art = window[r.art] || (() => null);
  const [fx, fy, s0, s1] = r.cam || [540, 960, 1, 1.06];
  const k = RM.lerp(s0, s1, RM.clamp(t / dur)) * (1 + 0.04 * Math.exp(-Math.max(0, t) * 14));
  const tx = (540 - fx) * (k - 1) / k, ty = (960 - fy) * (k - 1) / k;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#D9442E' }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(540 960) scale(${k}) translate(-540 -960) translate(${tx} ${ty})`}>
          <Art T={T} t={t} dur={dur} beats={r.beats} />
        </g>
        <RMTexture T={T} />
      </svg>
      <RMCaption T={T} r={r} />
    </div>
  );
}

function RMPiece() {
  const { T } = useComposition();
  const S = window.SCRIPT, TM = window.TIMING;
  const ranges = S.lines.map((ln, i) => {
    const start = TM.start[i], end = TM.end[i];
    const abs = ln.chunks.map((c, j) => ({ at: TM.chunks[i][j], text: c[0], ...(c[1] || {}) }));
    return { name: ln.scene, art: ln.art, cam: ln.cam, capY: ln.capY, start, end, abs, beats: TM.chunks[i].map((a) => a - start) };
  });
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
      {ranges.map((r, i) => (
        <Shot key={i} from={r.start} to={r.end}><RMScene r={r} T={T} /></Shot>
      ))}
      {S.handle && <div style={{ position: 'absolute', top: 110, right: 60, font: "700 28px 'Oswald', sans-serif", letterSpacing: '0.04em', color: 'rgba(244,231,210,.7)' }}>{S.handle}</div>}
      {window.TitleCover && <window.TitleCover T={T} />}
    </div>
  );
}

function RetroShortApp() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#000">
        <RMPiece />
      </CompositionStage>
    </div>
  );
}

window.RetroShortApp = RetroShortApp;
