// cover.jsx — title cover shown in the last COVER_S seconds of every vertical Short (the silent tail after
// the narration). Instagram and TikTok use it as the thumbnail (buffer.py sets thumbnailOffset to this
// frame); it also gives the loop a clean end card. Text: script.thumb_text, else the post title without
// "#shorts"; the words in script.thumb_emph (or the last word) are highlighted.
(function () {
  const COVER_S = 0.55;


  // Cover characters: an original cast in the flat One More style (thick ink outline, simple shapes).
  // Each Short gets its own person, picked from its slug (or script.cover_char), with an expression from
  // script.thumb_mood: curious | shocked | smug | worried | happy | thinking.
  const INK = '#210B3D';
  const SKINS = [['#F6D7BD', '#E2B595'], ['#E9B88F', '#C9926A'], ['#C98B61', '#A66E48'], ['#9A6243', '#7A4A30'],
    ['#6E4532', '#553324'], ['#F3D6FB', '#C995EC']];
  const HAIRC = ['#2B1052', '#1E1A1A', '#5A3420', '#A0522D', '#E2B04A', '#8C8C99', '#C2185B'];
  const SHIRTS = [['#7624CE', '#4F1691'], ['#1750C9', '#0F3A94'], ['#E85D3A', '#B8432A'], ['#18A07A', '#0F7458'],
    ['#EA43E8', '#B32DB1'], ['#F2B705', '#C99400'], ['#2C2C3A', '#1A1A24']];
  const ACCENT = ['#59EAF3', '#FFFFFF', '#FFD23F', '#7FFF45', '#FF9EC7'];
  const HAIRS = ['curls', 'short', 'long', 'bun', 'buzz', 'ponytail', 'spiky'];
  const OUTFITS = ['collar', 'tee', 'hoodie'];
  const MOODS = {
    curious: { look: [0.3, -0.7], brow: 0.5, smile: 0.25 },
    shocked: { look: [0, -0.2], brow: 1.1, open: 1, lid: -0.3 },
    smug: { look: [-0.4, 0], brow: -0.2, smile: 0.9, lid: 0.55 },
    worried: { look: [0.2, 0.2], brow: 0.9, smile: -0.7 },
    happy: { look: [0, -0.2], brow: 0.3, smile: 1 },
    thinking: { look: [0.7, -0.9], brow: 0.35, smile: -0.1 },
  };

  function hash(str) { let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

  // The fixed cast Shivam approved (2026-10-18); Shorts cycle through it in posting order
  // (design_build sets script.cover_index from the post date + slot).
  const CAST = [{"skin": 2, "hairColor": "#C2185B", "hair": "short", "shirt": ["#EA43E8", "#B32DB1"], "accent": "#FFFFFF", "outfit": "hoodie", "glasses": false}, {"skin": 4, "hairColor": "#E2B04A", "hair": "curls", "shirt": ["#1750C9", "#0F3A94"], "accent": "#FFFFFF", "outfit": "hoodie", "glasses": false}, {"skin": 3, "hairColor": "#1E1A1A", "hair": "short", "shirt": ["#2C2C3A", "#1A1A24"], "accent": "#FFFFFF", "outfit": "collar", "glasses": false}, {"skin": 1, "hairColor": "#A0522D", "hair": "buzz", "shirt": ["#F2B705", "#C99400"], "accent": "#FFD23F", "outfit": "tee", "glasses": false}, {"skin": 3, "hairColor": "#1E1A1A", "hair": "spiky", "shirt": ["#18A07A", "#0F7458"], "accent": "#FFFFFF", "outfit": "tee", "glasses": false}, {"skin": 1, "hairColor": "#1E1A1A", "hair": "long", "shirt": ["#18A07A", "#0F7458"], "accent": "#7FFF45", "outfit": "tee", "glasses": true}, {"skin": 2, "hairColor": "#1E1A1A", "hair": "ponytail", "shirt": ["#1750C9", "#0F3A94"], "accent": "#FFFFFF", "outfit": "collar", "glasses": false}, {"skin": 0, "hairColor": "#C2185B", "hair": "ponytail", "shirt": ["#E85D3A", "#B8432A"], "accent": "#FFFFFF", "outfit": "tee", "glasses": true}];

  function pickChar(S) {
    if (S.cover_index != null && !S.cover_char) {
      const k = CAST[((S.cover_index % CAST.length) + CAST.length) % CAST.length];
      return { skin: SKINS[k.skin], hairC: k.hairColor, hair: k.hair, shirt: k.shirt, accent: k.accent, outfit: k.outfit, glasses: k.glasses };
    }
    const h = hash(S.slug || (S.post && S.post.title) || 'x');
    const pick = (arr, k) => arr[(h >>> k) % arr.length];
    const c = { skin: pick(SKINS, 0), hairC: pick(HAIRC, 3), hair: pick(HAIRS, 7), shirt: pick(SHIRTS, 11),
      accent: pick(ACCENT, 15), outfit: pick(OUTFITS, 19), glasses: ((h >>> 23) % 4) === 0 };
    const o = S.cover_char || {};
    if (o.hair && HAIRS.includes(o.hair)) c.hair = o.hair;
    if (o.outfit && OUTFITS.includes(o.outfit)) c.outfit = o.outfit;
    if (o.glasses != null) c.glasses = !!o.glasses;
    if (o.skin != null && SKINS[o.skin]) c.skin = SKINS[o.skin];
    if (o.hairColor) c.hairC = o.hairColor;
    if (o.shirt) c.shirt = [o.shirt, o.shirt];
    return c;
  }

  function HairBack({ c }) {
    if (c.hair === 'long') return <path d="M-60,-168 Q-64,-222 0,-224 Q64,-222 60,-168 L70,-84 L40,-92 L46,-150 L-46,-150 L-40,-92 L-70,-84 Z" fill={c.hairC} stroke={INK} strokeWidth="5" strokeLinejoin="round" />;
    if (c.hair === 'ponytail') return <ellipse cx="62" cy="-150" rx="18" ry="44" transform="rotate(18 62 -150)" fill={c.hairC} stroke={INK} strokeWidth="5" />;
    if (c.hair === 'bun') return <circle cx="0" cy="-226" r="24" fill={c.hairC} stroke={INK} strokeWidth="5" />;
    return null;
  }

  function HairFront({ c }) {
    const f = { fill: c.hairC, stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' };
    switch (c.hair) {
      case 'curls':
        return <g>{[[-52, -156, 9], [54, -170, 9], [-48, -176, 13], [-38, -196, 15], [-18, -208, 16], [4, -212, 16], [26, -206, 15], [44, -190, 14], [-28, -186, 10], [14, -194, 11]]
          .map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={c.hairC} stroke={INK} strokeWidth="3.5" />)}</g>;
      case 'buzz':
        return <path d="M-46,-168 Q-46,-206 0,-208 Q46,-206 50,-168 Q22,-186 -8,-184 Q-30,-182 -46,-168 Z" {...f} strokeWidth="4" />;
      case 'spiky':
        return <path d="M-50,-162 L-58,-196 L-36,-190 L-34,-226 L-12,-204 L4,-236 L18,-206 L40,-226 L42,-192 L62,-198 L52,-162 Q20,-184 -10,-180 Q-32,-178 -50,-162 Z" {...f} />;
      case 'long':
      case 'ponytail':
      case 'bun':
      case 'short':
      default:
        return <path d="M-50,-160 Q-54,-214 2,-216 Q54,-214 54,-160 L46,-176 Q24,-192 -6,-188 Q-28,-184 -40,-166 Z" {...f} />;
    }
  }

  function Person({ x, y, s = 1, c, mood }) {
    const m = MOODS[mood] || MOODS.curious;
    const look = m.look || [0, 0], brow = m.brow || 0, smile = m.smile || 0, lid = m.lid || 0, open = m.open || 0;
    const lx = look[0] * 4.5, ly = look[1] * 3.2, b = brow * 6;
    const ry = Math.max(1.6, 8 - lid * 5), pr = Math.min(4.6, ry + 0.4);
    const [skin, skinS] = c.skin, [sh, shD] = c.shirt;
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <HairBack c={c} />
        {c.outfit === 'hoodie' && <path d="M-70,-84 Q-74,-128 -30,-122 L30,-122 Q74,-128 70,-84 Z" fill={shD} stroke={INK} strokeWidth="5" strokeLinejoin="round" />}
        <path d="M-84,-80 L-28,-94 L28,-94 L84,-80 L108,90 L-108,90 Z" fill={sh} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M-84,-80 L-54,-88 L-72,90 L-108,90 Z" fill={shD} />
        <path d="M-13,-114 L13,-114 L14,-88 L-14,-88 Z" fill={skinS} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        {c.outfit === 'collar' && <g>
          <path d="M-26,-94 L26,-94 L10,-24 L0,-12 L-10,-24 Z" fill={c.accent} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M-26,-94 L-36,-68 L-20,-60 L-6,-16 M26,-94 L36,-68 L20,-60 L6,-16" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </g>}
        {c.outfit === 'tee' && <path d="M-24,-94 Q0,-70 24,-94" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />}
        {c.outfit === 'tee' && <rect x="-30" y="-20" width="60" height="44" rx="10" fill={c.accent} stroke={INK} strokeWidth="4" />}
        {c.outfit === 'hoodie' && <g>
          <path d="M-24,-94 Q0,-76 24,-94" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d="M-10,-86 L-12,-40 M10,-86 L12,-40" stroke={c.accent} strokeWidth="5" strokeLinecap="round" />
        </g>}
        <ellipse cx="-45" cy="-148" rx="8" ry="12" fill={skin} stroke={INK} strokeWidth="4" />
        <path d="M-44,-188 L40,-194 L50,-150 L45,-121 L19,-96 L-14,-96 L-41,-122 Z" fill={skin} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M-42,-186 L-31,-187 L-34,-150 L-25,-119 L-13,-98 L-39,-122 Z" fill={skinS} />
        <ellipse cx="-16" cy="-151" rx="9" ry={ry} fill="#fff" stroke={INK} strokeWidth="3.5" />
        <ellipse cx="18" cy="-152" rx="9" ry={ry} fill="#fff" stroke={INK} strokeWidth="3.5" />
        <circle cx={-16 + lx} cy={-151 + (ly * ry) / 8} r={pr} fill={INK} />
        <circle cx={18 + lx} cy={-152 + (ly * ry) / 8} r={pr} fill={INK} />
        {lid > 0.12 && <path d={`M-26,${-151 - ry} L-6,${-151 - ry} M8,${-152 - ry} L28,${-152 - ry}`} stroke={INK} strokeWidth="4" strokeLinecap="round" />}
        {c.glasses && <g fill="none" stroke={INK} strokeWidth="4.5">
          <circle cx="-16" cy="-151" r="16" /><circle cx="18" cy="-152" r="16" /><path d="M0,-153 L2,-153 M-32,-152 L-44,-156 M34,-153 L46,-158" />
        </g>}
        <path d={`M-28,${-165 - b - (c.glasses ? 6 : 0)} L-6,${-169 - b * 1.45 - (c.glasses ? 6 : 0)} M8,${-170 - b * 1.45 - (c.glasses ? 6 : 0)} L30,${-167 - b - (c.glasses ? 6 : 0)}`} stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M3,-148 L-5,-128 L4,-126" fill="none" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
        {open > 0.05
          ? <ellipse cx="2" cy="-112" rx={4 + open * 4} ry={2 + open * 6} fill={INK} />
          : <path d={`M-12,${-113 - Math.min(0, smile) * 2} Q2,${-113 + smile * 9} 15,${-114 - Math.min(0, smile) * 2}`} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />}
        <HairFront c={c} />
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
          <Person x={540} y={1700} s={2.55} c={pickChar(S)} mood={S.thumb_mood || 'curious'} />
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
