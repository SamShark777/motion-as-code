// xplog-engine.jsx — "experiment log" Shorts (format "xplog", Shivam 2026-11-09). The page is fixed:
//   HUD (y 300–520): chapter title with a yellow underline, the channel tag, a running clock and a counter;
//   PANEL (y 590–1198): ONE wide 1080×608 picture drawn by art.jsx with xplog-kit.jsx, a new one per line;
//   CAPTION (from y 1250): the line's full sentence in white caps, the emphasis word turning yellow as it is said.
// script.json: "hud": {"clock_label": "LEFT ON READ FOR", "count_label": "SPIRALS", "count_total": 7, "tag": "THE OVERTHINK CLUB"}
// per line "hud": {"title": "MINUTE 4", "clock": 240, "run": true, "count": 1, "count_beat": 1} — all optional and carried
// forward: `clock` = seconds shown when the line starts (it ticks in real time unless "run": false), `count` = the
// counter's value once chunk `count_beat` is spoken (default: the emphasis chunk). Optional per line: "cam":
// [focusX, focusY, scaleFrom, scaleTo] inside the panel (default [540, 304, 1, 1.045]).
const XLG_FONT = "'Poppins', 'Montserrat', sans-serif";

function XLGHud({ T, r, S }) {
  const h = S.hud || {}, sec = r.clock + (r.run ? Math.max(0, T - r.start) : 0);
  const landed = r.countAt != null && T >= r.countAt, n = landed || r.countAt == null ? r.count : r.prevCount;
  const since = landed ? T - r.countAt : 9, pop = since < 0.4 ? 1 + 1.1 * Math.sin((Math.PI * since) / 0.4) : 1;
  const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: `600 27px ${XLG_FONT}`, letterSpacing: '2px', color: XL.GREY, marginTop: 14 };
  return (
    <div style={{ position: 'absolute', left: 60, right: 60, top: 300 }}>
      <div style={{ display: 'inline-block', font: `800 84px/1 ${XLG_FONT}`, letterSpacing: '1px', color: '#fff', paddingBottom: 10, borderBottom: `7px solid ${XL.ACC}` }}>{r.title}</div>
      <div style={{ position: 'absolute', right: 0, top: 26, font: `700 24px ${XLG_FONT}`, letterSpacing: '3px', color: XL.GREY }}>{h.tag || S.handle || ''}</div>
      <div style={{ ...row, marginTop: 26 }}><span>{h.clock_label || 'TIME'}</span>
        <b style={{ font: `800 32px ${XLG_FONT}`, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{XL.clock(sec)}</b></div>
      <div style={row}><span>{h.count_label || 'COUNT'}</span>
        <b style={{ display: 'inline-block', font: `800 32px ${XLG_FONT}`, color: XL.ACC, transform: `scale(${pop})`, transformOrigin: 'right center' }}>{n}/{h.count_total || 0}</b></div>
    </div>
  );
}

function XLGCaption({ T, r }) {
  return (
    <div style={{ position: 'absolute', left: 55, right: 55, top: 1250, textAlign: 'center', font: `800 56px/1.26 ${XLG_FONT}`, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#fff' }}>
      {r.abs.map((c, i) => {
        const emph = String(c.emph || '').toUpperCase().split(/\s+/).filter(Boolean), on = T >= c.at;
        return c.text.split(/\s+/).filter(Boolean).map((w, j) => {
          const hot = on && emph.includes(w.toUpperCase().replace(/[^\w%'-]/g, ''));
          return <span key={`${i}.${j}`} style={{ color: hot ? XL.ACC : '#fff' }}>{w} </span>;
        });
      })}
    </div>
  );
}

function XLGScene({ r, T, S }) {
  const t = T - r.start, dur = Math.max(0.1, r.end - r.start);
  const Art = window[r.art] || (() => null);
  const [fx, fy, s0, s1] = r.cam || [540, 304, 1, 1.045];
  const k = XL.lerp(s0, s1, XL.clamp(t / dur)), u = 'v' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#10131F' }}>
      <XLGHud T={T} r={r} S={S} />
      <svg width="1080" height="608" viewBox="0 0 1080 608" style={{ position: 'absolute', left: 0, top: 590, background: '#151A2E' }}>
        <defs><radialGradient id={u} cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.55" /></radialGradient></defs>
        <g transform={`translate(${fx} ${fy}) scale(${k}) translate(${-fx} ${-fy})`}><Art T={T} t={t} dur={dur} beats={r.beats} /></g>
        <rect width="1080" height="608" fill={`url(#${u})`} />
      </svg>
      <XLGCaption T={T} r={r} />
    </div>
  );
}

function XLGPiece() {
  const { T } = useComposition();
  const S = window.SCRIPT, TM = window.TIMING;
  let title = '', clock = 0, count = 0;
  const ranges = S.lines.map((ln, i) => {
    const start = TM.start[i], end = TM.end[i], h = ln.hud || {};
    const abs = ln.chunks.map((c, j) => ({ at: TM.chunks[i][j], text: c[0], ...(c[1] || {}) }));
    const prevCount = count, run = h.run !== false && h.clock != null;
    if (h.title != null) title = h.title;
    if (h.clock != null) clock = h.clock;
    let countAt = null;
    if (h.count != null && h.count !== count) {
      count = h.count;
      const eb = ln.chunks.findIndex((c) => c[1] && c[1].emph);
      countAt = TM.chunks[i][h.count_beat != null ? h.count_beat : Math.max(0, eb)];
    }
    const r = { name: ln.scene, art: ln.art, cam: ln.cam, start, end, abs, beats: TM.chunks[i].map((a) => a - start), title, clock, run, count, prevCount, countAt };
    if (run) clock += end - start;
    return r;
  });
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#10131F', overflow: 'hidden' }}>
      {ranges.map((r, i) => (
        <Shot key={i} from={r.start} to={r.end}><XLGScene r={r} T={T} S={S} /></Shot>
      ))}
      {window.TitleCover && <window.TitleCover T={T} />}
    </div>
  );
}

function XpLogShortApp() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#10131F">
        <XLGPiece />
      </CompositionStage>
    </div>
  );
}

window.XpLogShortApp = XpLogShortApp;
