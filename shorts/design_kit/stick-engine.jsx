// stick-engine.jsx — "stick" story Shorts: hand-drawn white stick figures on black, a small grey scene label
// top-left, and handwritten captions that light up chunk by chunk (spoken = white, coming = grey, key word = yellow
// with an underline). Reads the same script.json / TIMING as Ted type 2 (lines → scenes, chunks → captions).
// Optional per line: "label" (grey corner word, e.g. "left out").
const STK_FONT = "'Caveat Brush', 'Gochi Hand', cursive";

function StickBoil({ children, T }) {
  // hand-drawn "boil": the line wobble re-rolls 8 times a second
  const seed = Math.floor(T * 8) % 6;
  return (
    <g>
      <defs>
        <filter id={`boil${seed}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed={seed + 1} />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
      </defs>
      <g filter={`url(#boil${seed})`}>{children}</g>
    </g>
  );
}

function StickCaption({ T, r }) {
  // whole line visible; chunks already spoken are white, upcoming grey; the emphasis word of a spoken chunk turns yellow
  let cur = -1;
  r.abs.forEach((c, i) => { if (T >= c.at) cur = i; });
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: 1230, minHeight: 300, display: 'flex', flexWrap: 'wrap',
      justifyContent: 'center', alignContent: 'flex-start', columnGap: '0.28em', rowGap: '0.05em',
      font: `400 100px/1.12 ${STK_FONT}`, textAlign: 'center' }}>
      {r.abs.flatMap((c, i) => c.text.split(/\s+/).filter(Boolean).map((w, j) => {
        const core = w.replace(/[^\w%'-]/g, '');
        const isE = c.emph && core.toUpperCase() === String(c.emph).toUpperCase();
        const spoken = i <= cur;
        const fresh = i === cur ? Math.min(1, (T - c.at) / 0.18) : 1;
        const col = !spoken ? '#5a5a5a' : isE ? '#F5D33A' : '#EDEDED';
        const shown = isE ? w.replace(core, core.toLowerCase()) : w;
        return (
          <span key={`${i}-${j}`} style={{ color: col, position: 'relative', display: 'inline-block',
            transform: `translateY(${(1 - fresh) * 10}px)`, textShadow: '0 4px 18px rgba(0,0,0,.6)' }}>
            {shown}
            {isE && spoken && <span style={{ position: 'absolute', left: '22%', right: '22%', bottom: 4, height: 7, borderRadius: 4,
              background: '#F5D33A', transform: `scaleX(${Math.min(1, (T - c.at) / 0.3)})`, transformOrigin: 'left' }}></span>}
          </span>
        );
      }))}
    </div>
  );
}

function StickScene({ r, T }) {
  const t = T - r.start, dur = r.end - r.start;
  const Art = window[r.art] || (() => null);
  const fade = Math.min(1, t / 0.15);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fade,
      background: 'radial-gradient(ellipse 70% 55% at 50% 45%, #1d1d1d 0%, #0b0b0b 60%, #050505 100%)' }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <StickBoil T={T}><Art T={T} t={t} dur={dur} /></StickBoil>
      </svg>
      {r.label && <div style={{ position: 'absolute', left: 90, top: 330, font: `400 92px ${STK_FONT}`, color: '#8a8a8a',
        opacity: Math.min(1, t / 0.3) }}>{r.label}</div>}
      <StickCaption T={T} r={r} />
    </div>
  );
}

function StickPiece() {
  const { T } = useComposition();
  const S = window.SCRIPT, TM = window.TIMING;
  const ranges = S.lines.map((ln, i) => {
    const start = TM.start[i], end = TM.end[i];
    const abs = ln.chunks.map((c, j) => ({ at: TM.chunks[i][j], text: c[0], ...(c[1] || {}) }));
    return { name: ln.scene, color: ln.color, art: ln.art, label: ln.label, start, end, abs };
  });
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
      {ranges.map((r, i) => (
        <Shot key={i} from={r.start} to={r.end}><StickScene r={r} T={T} /></Shot>
      ))}
      {S.handle && <div style={{ position: 'absolute', top: 120, right: 70, font: "700 30px 'Montserrat', sans-serif", color: 'rgba(255,255,255,.55)' }}>{S.handle}</div>}
      {window.TitleCover && <window.TitleCover T={T} />}
    </div>
  );
}

function StickShortApp() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#000">
        <StickPiece />
      </CompositionStage>
    </div>
  );
}

window.StickShortApp = StickShortApp;
