// story-engine.jsx — player for "story" Shorts (format "story"), the "One More Never Enough" layout made
// vertical: animated headline on top, a rounded illustration stage in the middle, the narration line as a
// caption underneath. Every frame is a pure function of time T, so scripts/cap_design.mjs can seek it.
// Inputs (set by scripts/design_build.py in index.html):
//   window.SCRIPT  — shorts/<slug>/script.json: style {…} + lines [{art, text, headline?, caption?, cut?}]
//   window.TIMING  — {start:[s], end:[s]} per narration line, from the voiceover's word timings
// Per-video scenes live in shorts/<slug>/scenes.jsx and end with Object.assign(window, { SceneA, … }).
// Consecutive lines with the same `art` form ONE scene; the component gets
//   { t (s since the scene started), T (global s), dur, beats (line starts, s from scene start), ends, W, H, P (palette) }.
(function () {
  const STAGES = { square: { top: 600, h: 980 }, tall: { top: 520, h: 1180 } };
  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const eo = (k) => Easing.easeOutCubic(cl(k));

  function styleOf(S) {
    const st = S.style || {};
    const P = SK.pal();
    return {
      bg: st.bg || P.paper, ink: st.ink || P.ink, accent: st.accent || P.accent, highlight: st.highlight || P.pop,
      stageBg: st.stageBg || P.paper, stageRadius: st.stageRadius == null ? 30 : st.stageRadius, stageBorder: st.stageBorder || null,
      head: st.head || 'Barlow Condensed', headWeight: st.headWeight || 800, headSize: st.headSize || 96, headCase: st.headCase || 'uppercase',
      body: st.body || 'Barlow', bodyWeight: st.bodyWeight || 500, captionSize: st.captionSize || 46, captions: st.captions !== false,
      stage: STAGES[st.stage] || STAGES.square, xfade: st.xfade == null ? 0.25 : st.xfade, P,
    };
  }

  /** "Why is *‘one more’* never ==enough?==" → [{w, em}] (em 1 = accent colour, 2 = accent + highlighter). */
  function parseHeadline(s) {
    const out = [];
    for (const seg of String(s).split(/(\*[^*]+\*|==[^=]+==)/)) {
      if (!seg) continue;
      const em = /^\*.*\*$/.test(seg) ? 1 : /^==.*==$/.test(seg) ? 2 : 0;
      const txt = em === 1 ? seg.slice(1, -1) : em === 2 ? seg.slice(2, -2) : seg;
      for (const w of txt.split(/\s+/)) if (w) out.push({ w, em });
    }
    return out;
  }

  function Headline({ T, at, until, text, st }) {
    if (T < at - 0.01 || T >= until) return null;
    const out = cl((T - (until - 0.3)) / 0.3);
    return (
      <div style={{ position: 'absolute', left: 70, right: 70, bottom: 1920 - st.stage.top + 40, opacity: 1 - out, transform: `translateY(${-12 * out}px)`,
        fontFamily: `'${st.head}', 'Arial Narrow', sans-serif`, fontWeight: st.headWeight, fontSize: st.headSize, lineHeight: 0.95,
        textTransform: st.headCase, color: st.ink, display: 'flex', flexWrap: 'wrap', columnGap: '0.22em' }}>
        {parseHeadline(text).map(({ w, em }, k) => {
          const p = eo((T - at - k * 0.08) / 0.45);
          return <span key={k} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 30}px)`, color: em ? st.accent : st.ink,
            background: em === 2 ? `linear-gradient(transparent 64%, ${st.highlight} 64%, ${st.highlight} 90%, transparent 90%)` : 'none' }}>{w}</span>;
        })}
      </div>
    );
  }

  function Missing({ name, W, H }) {
    return <g><rect width={W} height={H} fill="#f3f0f6" /><text x={W / 2} y={H / 2} textAnchor="middle" fontSize="40" fill="#999">missing {name}</text></g>;
  }

  function StoryPiece() {
    const { T } = useComposition();
    const S = window.SCRIPT, TM = window.TIMING, st = styleOf(S);
    const W = 980, H = st.stage.h;
    // scenes = runs of consecutive lines sharing one art component
    const runs = [];
    S.lines.forEach((ln, i) => {
      const last = runs[runs.length - 1];
      if (last && last.art === ln.art) { last.lines.push(i); last.end = TM.end[i]; }
      else runs.push({ art: ln.art, lines: [i], start: TM.start[i], end: TM.end[i], cut: !!ln.cut });
    });
    // headlines persist until the next line that sets one
    const heads = [];
    S.lines.forEach((ln, i) => { if (ln.headline != null) heads.push({ at: i === 0 ? 0.1 : TM.start[i] + 0.1, text: ln.headline }); });
    heads.forEach((h, k) => { h.until = k + 1 < heads.length ? heads[k + 1].at - 0.05 : Infinity; });
    const li = S.lines.findIndex((_, i) => T >= TM.start[i] && T < TM.end[i]);
    const ln = li >= 0 ? S.lines[li] : null;
    const capO = ln ? cl(Math.min((T - TM.start[li]) / 0.18, (TM.end[li] - T) / 0.18)) : 0;
    return (
      <div style={{ position: 'absolute', inset: 0, background: st.bg, overflow: 'hidden' }}>
        {heads.map((h, k) => h.text ? <Headline key={k} T={T} at={h.at} until={h.until} text={h.text} st={st} /> : null)}
        <div style={{ position: 'absolute', left: 50, top: st.stage.top, width: W, height: H, borderRadius: st.stageRadius, overflow: 'hidden',
          background: st.stageBg, boxShadow: st.stageBorder ? `inset 0 0 0 6px ${st.stageBorder}` : 'none' }}>
          {runs.map((r, k) => {
            const next = runs[k + 1];
            const tail = next && !next.cut ? st.xfade : 0;
            if (T < r.start || T >= r.end + tail) return null;
            const Scene = window[r.art];
            const o = k === 0 || r.cut ? 1 : cl((T - r.start) / st.xfade);
            const beats = r.lines.map((i) => TM.start[i] - r.start), ends = r.lines.map((i) => TM.end[i] - r.start);
            return (
              <svg key={k} viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', inset: 0, display: 'block', opacity: o }}>
                {Scene ? <Scene t={T - r.start} T={T} dur={r.end - r.start} beats={beats} ends={ends} W={W} H={H} P={st.P} /> : <Missing name={r.art} W={W} H={H} />}
              </svg>
            );
          })}
        </div>
        {st.captions && ln && (
          <div style={{ position: 'absolute', top: st.stage.top + H + 44, left: 90, right: 90, textAlign: 'center', opacity: capO,
            font: `${st.bodyWeight} ${st.captionSize}px/1.28 '${st.body}', 'Helvetica Neue', sans-serif`, color: st.ink, textWrap: 'balance' }}>
            {ln.caption || ln.text}
          </div>
        )}
        {S.handle && (
          <div style={{ position: 'absolute', top: 54, left: 0, right: 0, textAlign: 'center', font: `600 30px '${st.body}', sans-serif`, color: st.ink, opacity: 0.55 }}>{S.handle}</div>
        )}
      </div>
    );
  }

  function StoryShortApp() {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
        <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#fff">
          <StoryPiece />
        </CompositionStage>
      </div>
    );
  }

  Object.assign(window, { StoryShortApp, parseStoryHeadline: parseHeadline });
})();
