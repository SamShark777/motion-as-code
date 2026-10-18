// cover.jsx — title cover shown in the last COVER_S seconds of every vertical Short (the silent tail after
// the narration). Instagram and TikTok use it as the thumbnail (buffer.py sets thumbnailOffset to this
// frame); it also gives the loop a clean end card. Text: script.thumb_text, else the post title without
// "#shorts"; the words in script.thumb_emph (or the last word) are highlighted.
(function () {
  const COVER_S = 0.55;

  function coverWords(S) {
    const raw = (S.thumb_text || (S.post && S.post.title) || '').replace(/#\w+/g, '').trim();
    const words = raw.split(/\s+/).filter(Boolean);
    const emph = (S.thumb_emph || words[words.length - 1] || '').toLowerCase().split(/\s+/);
    return words.map((w) => ({ w, hi: emph.includes(w.toLowerCase().replace(/[^\w']/g, '')) || emph.includes(w.toLowerCase()) }));
  }

  function TitleCover({ T }) {
    const S = window.SCRIPT, TM = window.TIMING;
    if (!S || !TM || S.orientation === 'landscape' || S.cover === false) return null;
    const total = TM.end[TM.end.length - 1];
    const t0 = total - COVER_S;
    if (T < t0) return null;
    const o = Math.min(1, (T - t0) / 0.12);
    const words = coverWords(S);
    const n = words.reduce((a, x) => a + x.w.length + 1, 0);
    const size = n > 44 ? 104 : n > 32 ? 118 : n > 22 ? 134 : 150;
    return (
      <div style={{ position: 'absolute', inset: 0, opacity: o, zIndex: 50,
        background: 'radial-gradient(120% 80% at 50% 30%, #2a2f6b 0%, #14163a 55%, #0b0c1f 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 86px' }}>
        <div style={{ font: "800 34px 'Montserrat', 'Barlow Condensed', 'Arial Black', sans-serif", letterSpacing: '0.22em',
          color: '#FFD23F', textTransform: 'uppercase', marginBottom: 44 }}>Psychology</div>
        <div style={{ font: `900 ${size}px/1.04 'Montserrat', 'Barlow Condensed', 'Arial Black', sans-serif`, color: '#fff',
          textTransform: 'uppercase', letterSpacing: '-0.01em', textWrap: 'balance', textShadow: '0 8px 40px rgba(0,0,0,.45)' }}>
          {words.map((x, i) => (
            <span key={i} style={x.hi ? { color: '#FFD23F' } : null}>{x.w}{i < words.length - 1 ? ' ' : ''}</span>
          ))}
        </div>
        <div style={{ width: 160, height: 14, borderRadius: 7, background: '#FFD23F', marginTop: 56 }}></div>
        {S.handle && (
          <div style={{ position: 'absolute', bottom: 150, left: 0, right: 0, textAlign: 'center',
            font: "700 34px 'Montserrat', 'Barlow', sans-serif", color: 'rgba(255,255,255,.75)' }}>{S.handle}</div>
        )}
      </div>
    );
  }

  Object.assign(window, { TitleCover, COVER_S });
})();
