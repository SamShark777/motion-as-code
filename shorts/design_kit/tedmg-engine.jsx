// tedmg-engine.jsx — "ted-MG motion graphics" Shorts (format "tedmg"). Full-bleed 1080×1920 flat-cartoon scenes
// (art.jsx draws the whole frame with tedmg-kit.jsx), a slow camera push per scene with a small punch on every cut,
// vignette + film grain, and one caption chunk at a time in big condensed white type with the emphasis words amber.
// Per line (optional): "cam": [focusX, focusY, scaleFrom, scaleTo] (default [540, 960, 1, 1.06]), "capY" (caption
// centre, default 1480 — move it if the subject sits there).
const MG_CAP_FONT = "'Bebas Neue', 'Oswald', sans-serif";

function MGCaption({ T, r }) {
  let cur = -1;
  r.abs.forEach((c, i) => { if (T >= c.at) cur = i; });
  if (cur < 0) return null;
  const c = r.abs[cur], p = T - c.at;
  const sc = 0.86 + 0.14 * MG.back(p / 0.16), op = MG.clamp(p / 0.06);
  const emph = String(c.emph || '').toUpperCase().split(/\s+/).filter(Boolean);
  const words = c.text.toUpperCase().split(/\s+/).filter(Boolean);
  return (
    <div style={{ position: 'absolute', left: 70, right: 70, top: (r.capY || 1480) - 110, height: 220, display: 'flex', flexWrap: 'wrap',
      justifyContent: 'center', alignContent: 'center', columnGap: '0.24em', font: `400 112px/0.98 ${MG_CAP_FONT}`, letterSpacing: '0.02em',
      textAlign: 'center', transform: `scale(${sc})`, opacity: op }}>
      {words.map((w, j) => {
        const core = w.replace(/[^\w%'-]/g, '');
        const hot = emph.includes(core) || emph.includes(w);
        return <span key={j} style={{ color: hot ? '#F6B92E' : '#FFFFFF', WebkitTextStroke: '7px rgba(15,12,20,.9)', paintOrder: 'stroke fill',
          textShadow: '0 5px 22px rgba(0,0,0,.75)' }}>{w}</span>;
      })}
    </div>
  );
}

function MGScene({ r, T }) {
  const t = T - r.start, dur = Math.max(0.1, r.end - r.start);
  const Art = window[r.art] || (() => null);
  const [fx, fy, s0, s1] = r.cam || [540, 960, 1, 1.06];
  const k = MG.lerp(s0, s1, MG.clamp(t / dur)) * (1 + 0.035 * Math.exp(-Math.max(0, t) * 14));
  const tx = (540 - fx) * (k - 1) / k, ty = (960 - fy) * (k - 1) / k;
  const seed = Math.floor(T * 12) % 4, u = 'u' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#000' }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(540 960) scale(${k}) translate(-540 -960) translate(${tx} ${ty})`}>
          <Art T={T} t={t} dur={dur} beats={r.beats} />
        </g>
        <defs>
          <radialGradient id={`mgVig${u}`} cx="0.5" cy="0.45" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.55" /></radialGradient>
          <filter id={`mgGrain${seed}${u}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed={seed + 3} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="1080" height="1920" fill={`url(#mgVig${u})`} />
        <rect width="1080" height="1920" filter={`url(#mgGrain${seed}${u})`} opacity="0.06" style={{ mixBlendMode: 'overlay' }} />
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: (r.capY || 1480) - 260, height: 520,
        background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(10,8,14,.55) 0%, rgba(10,8,14,.25) 55%, rgba(10,8,14,0) 100%)' }}></div>
      <MGCaption T={T} r={r} />
    </div>
  );
}

function MGPiece() {
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
        <Shot key={i} from={r.start} to={r.end}><MGScene r={r} T={T} /></Shot>
      ))}
      {S.handle && <div style={{ position: 'absolute', top: 110, right: 60, font: "700 28px 'Oswald', sans-serif", letterSpacing: '0.04em', color: 'rgba(255,255,255,.6)' }}>{S.handle}</div>}
      {window.TitleCover && <window.TitleCover T={T} />}
    </div>
  );
}

function TedMGShortApp() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#000">
        <MGPiece />
      </CompositionStage>
    </div>
  );
}

window.TedMGShortApp = TedMGShortApp;
