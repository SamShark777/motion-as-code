// engine.jsx — generic player for "Claude Design style" Shorts (format "cdesign"), adapted from Shivam's
// Claude Design project "Rename Your Nerves Short". Everything is a pure function of time T, so the
// capture script can seek frame by frame.
// Inputs (set by scripts/design_build.py in index.html):
//   window.SCRIPT  — the video's script.json (lines = scenes: {scene, color, light, art, chunks:[[text, fx?]]})
//   window.TIMING  — {start:[s], end:[s], chunks:[[absAt,...]]} from the voiceover's word timings
//   window.OM_SCENES / OM_PLAYBACK — the stage's section list (names + durations)
// Per-video art lives in shorts/<slug>/art.jsx, which must end with Object.assign(window, { ArtA, ArtB, … }).
const EMOTION = {
  pop: Easing.easeOutBack,     // card pop on every hard cut
  push: Easing.easeInOutSine,  // slow push-in during a scene
  enter: Easing.easeOutCubic,  // illustration beats
};

function IgGlyph() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" style={{ display: 'block' }}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="#fff" strokeWidth="2.1" />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="#fff" strokeWidth="2.1" />
      <circle cx="17.4" cy="6.6" r="1.35" fill="#fff" />
    </svg>
  );
}

function MissingArt() {
  return <g><circle cx="486" cy="1200" r="300" fill="rgba(255,255,255,.08)" /></g>;
}

function Card({ r, T }) {
  const t = T - r.start, dur = r.end - r.start;
  const pop = 1.04 - 0.04 * EMOTION.pop(clamp(t / 0.3, 0, 1));
  const push = 1 + 0.06 * EMOTION.push(clamp(t / dur, 0, 1));
  const Art = window[r.art] || MissingArt;
  const S = window.SCRIPT;
  return (
    <div style={{ position: 'absolute', left: 54, top: 96, width: 972, height: 1728, borderRadius: 54, overflow: 'hidden',
      background: r.color, transform: `scale(${pop})`, boxShadow: '0 40px 140px rgba(0,0,0,.9)' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '50% 64%' }}>
        <svg width="972" height="1728" viewBox="0 0 972 1728" style={{ display: 'block' }}>
          <Art T={T} t={t} dur={dur} />
        </svg>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,${r.light ? 0.5 : 0.34}) 0%, rgba(0,0,0,0) 42%)` }}></div>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 78% 64% at 50% 54%, rgba(0,0,0,0) 40%, rgba(0,0,0,.58) 78%, rgba(0,0,0,.9) 100%)' }}></div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 54, boxShadow: 'inset 0 0 160px 40px rgba(0,0,0,.55)' }}></div>
      {S.handle && (
        <div style={{ position: 'absolute', top: 50, right: 52, display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 27, color: '#fff', opacity: 0.92,
          textShadow: '0 2px 10px rgba(0,0,0,.5)' }}>
          <IgGlyph />
          <span>{S.handle}</span>
        </div>
      )}
      <div style={{ position: 'absolute', left: 64, right: 150, top: 200, height: 440, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CaptionTrack T={T} chunks={r.abs} fontSize={S.captionSize || 125} uppercase={false} style={{ width: '100%' }} />
      </div>
    </div>
  );
}

function Piece() {
  const { T } = useComposition();
  const S = window.SCRIPT, TM = window.TIMING;
  const ranges = S.lines.map((ln, i) => {
    const start = TM.start[i], end = TM.end[i];
    const abs = ln.chunks.map((c, j) => ({
      at: TM.chunks[i][j], until: j === ln.chunks.length - 1 ? end : TM.chunks[i][j + 1], text: c[0], ...(c[1] || {}),
    }));
    return { name: ln.scene, color: ln.color, light: !!ln.light, art: ln.art, start, end, abs };
  });
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }}>
      {ranges.map((r, i) => (
        <Shot key={i} from={r.start} to={r.end}>
          <Card r={r} T={T} />
        </Shot>
      ))}
    </div>
  );
}

function DesignShortApp() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#000">
        <Piece />
      </CompositionStage>
    </div>
  );
}

window.DesignShortApp = DesignShortApp;
