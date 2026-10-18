// cover.jsx — title cover shown in the last COVER_S seconds of every vertical Short (the silent tail after
// the narration). Instagram and TikTok use it as the thumbnail (buffer.py sets thumbnailOffset to this
// frame); it also gives the loop a clean end card. Text: script.thumb_text, else the post title without
// "#shorts"; the words in script.thumb_emph (or the last word) are highlighted.
(function () {
  const COVER_S = 0.55;


  // The One More Never Enough protagonist (from that build's src/lib/kit.tsx), head and shoulders.
  const P = { ink: '#210B3D', violet: '#7624CE', violetD: '#4F1691', magenta: '#EA43E8', cyan: '#59EAF3',
    white: '#FFFFFF', skin: '#F3D6FB', skinS: '#C995EC', hair: '#2B1052' };
  const CURLS = [[-52, -156, 9], [54, -170, 9], [-48, -176, 13], [-38, -196, 15], [-18, -208, 16],
    [4, -212, 16], [26, -206, 15], [44, -190, 14], [-28, -186, 10], [14, -194, 11]];
  function Bust({ x, y, s = 1, look = [0, 0], brow = 0, lid = 0, smile = 0, tilt = 0 }) {
    const lx = look[0] * 4.5, ly = look[1] * 3.2, b = brow * 6;
    const ry = Math.max(1.6, 8 - lid * 5), pr = Math.min(4.6, ry + 0.4);
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-84,-80 L-28,-94 L28,-94 L84,-80 L108,90 L-108,90 Z" fill={P.violet} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
        <path d="M-84,-80 L-54,-88 L-72,90 L-108,90 Z" fill={P.violetD} />
        <path d="M-13,-114 L13,-114 L14,-88 L-14,-88 Z" fill={P.skinS} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
        <path d="M-26,-94 L26,-94 L10,-24 L0,-12 L-10,-24 Z" fill={P.cyan} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
        <path d="M-26,-94 L-36,-68 L-20,-60 L-6,-16 M26,-94 L36,-68 L20,-60 L6,-16" fill="none" stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />
        <g transform={`rotate(${tilt} 0 -104)`}>
          <ellipse cx="-45" cy="-148" rx="8" ry="12" fill={P.skin} stroke={P.ink} strokeWidth="4" />
          <path d="M-44,-188 L40,-194 L50,-150 L45,-121 L19,-96 L-14,-96 L-41,-122 Z" fill={P.skin} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
          <path d="M-42,-186 L-31,-187 L-34,-150 L-25,-119 L-13,-98 L-39,-122 Z" fill={P.skinS} />
          <path d="M42,-186 L48,-150 L43,-123 L21,-100" fill="none" stroke={P.magenta} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="-16" cy="-151" rx="9" ry={ry} fill={P.white} stroke={P.ink} strokeWidth="3.5" />
          <ellipse cx="18" cy="-152" rx="9" ry={ry} fill={P.white} stroke={P.ink} strokeWidth="3.5" />
          <circle cx={-16 + lx} cy={-151 + (ly * ry) / 8} r={pr} fill={P.ink} />
          <circle cx={18 + lx} cy={-152 + (ly * ry) / 8} r={pr} fill={P.ink} />
          <path d={`M-28,${-165 - b} L-6,${-169 - b * 1.45} M8,${-170 - b * 1.45} L30,${-167 - b}`} stroke={P.ink} strokeWidth="5.5" strokeLinecap="round" />
          <path d="M3,-148 L-5,-128 L4,-126" fill="none" stroke={P.ink} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
          <path d={`M-12,-113 Q2,${-113 + smile * 9} 15,-114`} fill="none" stroke={P.ink} strokeWidth="4.5" strokeLinecap="round" />
          {CURLS.map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill={P.hair} stroke={P.ink} strokeWidth="3.5" />
              <path d={`M${cx - r * 0.5},${cy - r * 0.15} A${r * 0.6} ${r * 0.6} 0 0 1 ${cx + r * 0.3},${cy - r * 0.55}`}
                fill="none" stroke={P.violet} strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
        </g>
      </g>
    );
  }

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
      <div style={{ position: 'absolute', inset: 0, opacity: o, zIndex: 50, overflow: 'hidden',
        background: 'radial-gradient(120% 80% at 50% 30%, #2a2f6b 0%, #14163a 55%, #0b0c1f 100%)' }}>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="540" cy="1560" r="430" fill="#FFD23F" opacity="0.12" />
          <circle cx="540" cy="1560" r="300" fill="#FFD23F" opacity="0.14" />
          <Bust x={540} y={1700} s={2.55} look={[0.25, -0.9]} brow={0.6} smile={0.35} tilt={-4} />
        </svg>
        <div style={{ position: 'absolute', left: 86, right: 86, top: 210 }}>
          <div style={{ font: "800 34px 'Montserrat', 'Barlow Condensed', 'Arial Black', sans-serif", letterSpacing: '0.22em',
            color: '#FFD23F', textTransform: 'uppercase', marginBottom: 40 }}>Psychology</div>
          <div style={{ font: `900 ${size}px/1.04 'Montserrat', 'Barlow Condensed', 'Arial Black', sans-serif`, color: '#fff',
            textTransform: 'uppercase', letterSpacing: '-0.01em', textWrap: 'balance', textShadow: '0 8px 40px rgba(0,0,0,.45)' }}>
            {words.map((x, i) => (
              <span key={i} style={x.hi ? { color: '#FFD23F' } : null}>{x.w}{i < words.length - 1 ? ' ' : ''}</span>
            ))}
          </div>
          <div style={{ width: 160, height: 14, borderRadius: 7, background: '#FFD23F', marginTop: 48 }}></div>
        </div>
        {S.handle && (
          <div style={{ position: 'absolute', top: 96, left: 86, font: "700 30px 'Montserrat', 'Barlow', sans-serif", color: 'rgba(255,255,255,.7)' }}>{S.handle}</div>
        )}
      </div>
    );
  }

  Object.assign(window, { TitleCover, COVER_S });
})();
