// Halo effect — story Short scenes (980×980 stage). Soft glow editorial: dusk gradient, a literal halo
// ring that tints everything it touches, slow push-ins. Pure functions of t; beats[i] = start of line i
// in the scene. Kit: shorts/design_kit/story-kit.jsx.
const { K, L, E, win, kf, camT, burst, sc, md, hsh } = SK;
const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Barlow', 'Helvetica Neue', sans-serif";
const GOLD = '#FFD66B', PEACH = '#FFB38A', CREAM = '#FFF4E6', VIOLET = '#2D1B69', FROST = '#9DB4E0', SLATE = '#5B6A8C';
const blink = (t, seed = 0) => (md(t + seed, 3.4) < 0.12 ? 0.9 : 0);

/* dusk gradient + a few slow stars */
function Dusk({ id, top = VIOLET, mid = '#6B3FA0', low = PEACH, t, stars = 14 }) {
  return <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={top} /><stop offset="0.6" stopColor={mid} /><stop offset="1" stopColor={low} />
    </linearGradient></defs>
    <rect x="-300" y="-300" width="1580" height="1580" fill={`url(#${id})`} />
    {Array.from({ length: stars }, (_, i) => <circle key={i} cx={hsh(i + 3) * 980} cy={hsh(i + 40) * 420} r={2 + hsh(i + 9) * 3}
      fill={CREAM} opacity={0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.7 + i))} />)}
  </g>;
}

/* the ring: a soft glow, the gold band and a cream glint */
function Halo({ x, y, rx = 90, o = 1, t = 0 }) {
  const ry = rx * 0.26, by = y + 6 * Math.sin(t * 2.1);
  return <g opacity={o}>
    <ellipse cx={x} cy={by} rx={rx * 1.1} ry={ry * 1.6} fill="none" stroke={GOLD} strokeWidth={rx * 0.42} opacity="0.18" />
    <ellipse cx={x} cy={by} rx={rx} ry={ry} fill="none" stroke="#1A1033" strokeWidth={rx * 0.2} />
    <ellipse cx={x} cy={by} rx={rx} ry={ry} fill="none" stroke={GOLD} strokeWidth={rx * 0.13} />
    <path d={`M${x - rx * 0.7},${by - ry * 0.72} Q${x},${by - ry * 1.12} ${x + rx * 0.5},${by - ry * 0.86}`} fill="none" stroke={CREAM} strokeWidth={rx * 0.04} strokeLinecap="round" />
  </g>;
}

/* the lecturer: the protagonist with glasses; mood 1 = warm, -1 = cold, 0 = neutral */
function Lecturer({ x, y, s = 1, mood = 0, t = 0, seed = 0, look = [0, -0.3], talk = 0 }) {
  const tilt = mood > 0 ? 4 * Math.sin(t * 1.3 + seed) : mood < 0 ? -2 : 1.5 * Math.sin(t + seed);
  const open = talk > 0 ? Math.max(0, Math.sin(t * 11 + seed)) * 0.5 * talk : 0;
  return <g>
    <StoryBust x={x} y={y} s={s} look={look} brow={mood > 0 ? 0.45 * mood : 0.8 * mood} lid={Math.max(blink(t, seed), mood < 0 ? 0.35 : 0)}
      smile={mood > 0 ? 0.85 * mood : 0.55 * mood} open={open} tilt={tilt} rim={mood >= 0} shirt={mood < 0 ? SLATE : undefined} />
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${tilt} 0 -104)`}>
      <circle cx="-16" cy="-151" r="16" fill={CREAM} fillOpacity="0.18" stroke="#1A1033" strokeWidth="4.5" />
      <circle cx="18" cy="-152" r="16" fill={CREAM} fillOpacity="0.18" stroke="#1A1033" strokeWidth="4.5" />
      <path d="M0,-153 Q1,-157 2,-153 M-32,-152 L-44,-156 M34,-153 L45,-158" fill="none" stroke="#1A1033" strokeWidth="4" strokeLinecap="round" />
    </g>
  </g>;
}

/* 1 — hook: the halo lands on the lecturer and its gold spreads to everything around him */
function SceneHook({ t, dur, P }) {
  const cam = { fx: 490, fy: 560, s: L(1, 1.1, E(t, 0, dur, 'draw')), px: 490, py: 560 };
  const drop = E(t, 0.9, 1.6, 'pop');
  const spread = E(t, 1.4, 3.6, 'draw');
  const R = L(0, 700, spread);
  return <g transform={camT(cam)}>
    <Dusk id="hkDusk" t={t} />
    <defs><radialGradient id="hkGlow"><stop offset="0" stopColor={GOLD} stopOpacity="0.75" /><stop offset="0.7" stopColor={GOLD} stopOpacity="0.28" /><stop offset="1" stopColor={GOLD} stopOpacity="0" /></radialGradient></defs>
    {/* chalkboard, books and a mug — things the glow will reach */}
    <g transform="translate(110 250) rotate(-4)">
      <rect x="0" y="0" width="300" height="190" rx="12" fill="#2E3B3A" stroke={P.ink} strokeWidth="7" />
      <path d="M30,60 Q80,30 130,60 T230,60 M30,110 L190,110 M30,145 L140,145" fill="none" stroke={CREAM} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
    </g>
    {[0, 1, 2].map((i) => <rect key={i} x={710 + i * 4} y={700 - i * 46} width="180" height="42" rx="6" fill={[PEACH, '#7E5BC9', '#E0567A'][i]} stroke={P.ink} strokeWidth="5" />)}
    <g transform="translate(190 780)">
      <path d="M-50,-60 L50,-60 L42,40 Q40,55 25,55 L-25,55 Q-40,55 -42,40 Z" fill={CREAM} stroke={P.ink} strokeWidth="6" strokeLinejoin="round" />
      <path d="M50,-35 Q85,-30 80,0 Q76,25 46,22" fill="none" stroke={P.ink} strokeWidth="6" />
      {[0, 1].map((i) => <path key={i} d={`M${-15 + i * 25},-80 q-10,-18 0,-36`} fill="none" stroke={CREAM} strokeWidth="4" strokeLinecap="round" opacity={0.6 * win(t, 0, dur)} transform={`translate(0 ${-6 * md(t + i * 0.5, 1)})`} />)}
    </g>
    <Lecturer x={490} y={1000} s={1.7} mood={L(0, 1, spread)} t={t} look={[0, -0.6 + 0.4 * drop]} />
    {/* the glow that tints everything it touches */}
    <circle cx="490" cy="560" r={R} fill="url(#hkGlow)" style={{ mixBlendMode: 'screen' }} />
    {Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2 + t * 0.4, r = R * (0.5 + 0.4 * hsh(i));
      return <g key={i} transform={`translate(${490 + Math.cos(a) * r} ${560 + Math.sin(a) * r * 0.8}) scale(${spread * (0.6 + 0.5 * hsh(i + 7))})`}>
        <polygon points={burst(4, 14, 4)} fill={GOLD} />
      </g>;
    })}
    <Halo x={490} y={L(-120, 570, drop)} rx={120} t={t} />
  </g>;
}

/* 2 — one filmed teacher, then split into a warm version and a cold version */
function SceneTwins({ t, beats, P }) {
  const b1 = beats[1] ?? 99;
  const one = E(t, 0.1, 0.6, 'pop') * (1 - E(t, b1 - 0.1, b1 + 0.3));
  const warm = E(t, b1 + 0.1, b1 + 0.6, 'pop');
  const cold = E(t, b1 + 1.6, b1 + 2.1, 'pop');
  const holes = (w, h) => Array.from({ length: 9 }, (_, i) => <g key={i}>
    <rect x={-w / 2 + 20 + i * (w - 40) / 8 - 10} y={-h / 2 + 10} width="20" height="16" rx="3" fill={CREAM} opacity="0.8" />
    <rect x={-w / 2 + 20 + i * (w - 40) / 8 - 10} y={h / 2 - 26} width="20" height="16" rx="3" fill={CREAM} opacity="0.8" />
  </g>);
  return <g>
    <Dusk id="twDusk" t={t} mid="#4A2C8F" low="#7E5BC9" stars={18} />
    {one > 0.01 && <g transform={`translate(490 520) scale(${one})`}>
      <rect x="-360" y="-330" width="720" height="660" rx="26" fill="#1A1033" stroke={P.ink} strokeWidth="8" />
      {holes(720, 660)}
      <StoryBox x={0} y={0} w={640} h={540} fill="#E9DCF5" id="twFilm">
        <Lecturer x={0} y={300} s={1.25} mood={0} t={t} talk={1} />
      </StoryBox>
      <StoryTag x={-230} y={-290} text="● REC 1977" size={30} />
    </g>}
    {warm > 0.01 && <g transform={`translate(260 500) rotate(-3) scale(${warm})`}>
      <StoryBox x={0} y={0} w={420} h={580} fill="#FFE2C9" id="twWarm">
        <circle cx="0" cy="40" r="230" fill={GOLD} opacity="0.45" />
        <Lecturer x={0} y={330} s={1.05} mood={1} t={t} seed={0.7} talk={0.6} />
        <Halo x={0} y={50} rx={70} t={t} />
      </StoryBox>
      <StoryTag x={0} y={330} text="WARM & FRIENDLY" size={30} />
    </g>}
    {cold > 0.01 && <g transform={`translate(720 500) rotate(3) scale(${cold})`}>
      <StoryBox x={0} y={0} w={420} h={580} fill="#C9D6EE" id="twCold">
        <circle cx="0" cy="40" r="230" fill={FROST} opacity="0.5" />
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-180 + hsh(i) * 360} cy={-280 + md(t * 40 + hsh(i + 5) * 560, 560)} r="4" fill="#FFFFFF" opacity="0.8" />)}
        <Lecturer x={0} y={330} s={1.05} mood={-1} t={t} seed={1.9} />
      </StoryBox>
      <StoryTag x={0} y={330} text="COLD & STRICT" size={30} />
    </g>}
    {cold > 0.5 && <text x="490" y="930" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight="700" fontSize="44" fill={CREAM} opacity={E(t, b1 + 2.4, b1 + 2.9)}>same man · same face · same voice</text>}
  </g>;
}

/* 3 — the rating sheet: looks, mannerisms, accent; warm marks drift to APPEALING, cold to IRRITATING */
const TRAITS = [['LOOKS', 0.8, 0.22], ['MANNERISMS', 0.74, 0.26], ['ACCENT', 0.52, 0.12]];
const ROWT = [1.2, 1.9, 2.8];
function SceneRate({ t, beats, P }) {
  const b1 = beats[1] ?? 99;
  const wk = E(t, b1 + 0.3, b1 + 2.2, 'draw');
  const ck = E(t, b1 + 3.0, b1 + 4.6, 'draw');
  const X0 = 150, X1 = 830;
  return <g>
    <rect width="980" height="980" fill="#F7EBDD" />
    <circle cx="820" cy="140" r="220" fill={GOLD} opacity="0.25" />
    <circle cx="140" cy="900" r="240" fill={FROST} opacity="0.3" />
    <g transform={`translate(0 ${L(40, 0, E(t, 0, 0.5))})`} opacity={E(t, 0, 0.4)}>
      <rect x="80" y="70" width="820" height="840" rx="26" fill={CREAM} stroke={P.ink} strokeWidth="7" />
      <text x="490" y="150" textAnchor="middle" fontFamily={SERIF} fontWeight="800" fontSize="54" fill={VIOLET}>Rate the teacher</text>
      <line x1="140" y1="180" x2="840" y2="180" stroke={P.ink} strokeWidth="4" opacity="0.3" />
    </g>
    {TRAITS.map(([name, w, c], i) => {
      const y = 300 + i * 220, p = E(t, ROWT[i] - 0.15, ROWT[i] + 0.25, 'pop');
      const wx = L(490, L(X0, X1, w), wk), cx = L(490, L(X0, X1, c), ck);
      return <g key={name} opacity={Math.min(1, p)} transform={`translate(0 ${(1 - p) * 30})`}>
        <text x={X0} y={y - 40} fontFamily={SANS} fontWeight="700" fontSize="38" letterSpacing="3" fill={P.ink}>{name}</text>
        <rect x={X0} y={y - 10} width={X1 - X0} height="22" rx="11" fill="#E4D6F2" stroke={P.ink} strokeWidth="4" />
        <text x={X0} y={y + 62} fontFamily={SANS} fontWeight="600" fontSize="26" fill={SLATE}>irritating</text>
        <text x={X1} y={y + 62} textAnchor="end" fontFamily={SANS} fontWeight="600" fontSize="26" fill="#C26A3A">appealing</text>
        {wk > 0 && <g transform={`translate(${wx} ${y + 1})`}>
          <circle r="30" fill={GOLD} stroke={P.ink} strokeWidth="5" />
          <ellipse cx="0" cy="-44" rx="24" ry="7" fill="none" stroke={GOLD} strokeWidth="6" />
        </g>}
        {ck > 0 && <g transform={`translate(${cx} ${y + 1})`}>
          <circle r="30" fill={FROST} stroke={P.ink} strokeWidth="5" />
          <path d="M-14,-4 L14,-4 M0,-18 L0,10" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        </g>}
      </g>;
    })}
    <g opacity={E(t, b1 + 0.2, b1 + 0.6)}><StoryTag x={300} y={948} text="● WARM" size={30} /></g>
    <g opacity={E(t, b1 + 3.0, b1 + 3.4)}><StoryTag x={680} y={948} text="● COLD" size={30} /></g>
  </g>;
}

/* 4 — the students deny it: liking him had nothing to do with it (the halo they can't see) */
function SceneBlind({ t, beats, dur, P }) {
  const cam = { fx: 490, fy: 600, s: L(1.05, 1.0, E(t, 0, dur, 'draw')), px: 490, py: 560 };
  const tagp = E(t, 1.6, 2.0, 'pop');
  return <g transform={camT(cam)}>
    <Dusk id="blDusk" t={t} mid="#5A3596" low="#E09A86" />
    {/* the unseen halo hovering over their rating cards */}
    <Halo x={490} y={250} rx={300} o={0.35 + 0.15 * Math.sin(t * 2)} t={t} />
    <path d="M200,300 Q490,520 780,300" fill="none" stroke={GOLD} strokeWidth="6" strokeDasharray="4 18" strokeLinecap="round" opacity="0.6" />
    {Array.from({ length: 5 }, (_, i) => {
      const x = 130 + i * 180, p = E(t, 0.1 + i * 0.12, 0.5 + i * 0.12, 'pop');
      const shake = 6 * Math.sin(t * 9 + i * 1.3) * win(t, 0.6 + i * 0.15, 2.4 + i * 0.15);
      const sayP = E(t, 0.5 + i * 0.22, 0.85 + i * 0.22, 'pop');
      const said = ['NOPE.', 'NOT AT ALL.', 'NO WAY.', 'NOPE.', 'NOT ME.'][i];
      return <g key={i}>
        <g transform={`${sc(x, 840, p)} rotate(${shake} ${x} 760)`}><StoryMini x={x} y={840} dir={i < 2 ? 1 : -1} reach={0.6} s={2.6} /></g>
        <g transform={`translate(${x} ${L(800, 600, p)}) rotate(${(i - 2) * 4})`} opacity={p}>
          <rect x="-56" y="-40" width="112" height="80" rx="8" fill={CREAM} stroke={P.ink} strokeWidth="5" />
          <circle cx="-26" cy="-8" r="9" fill={GOLD} stroke={P.ink} strokeWidth="3" />
          <path d="M-8,-10 L38,-10 M-8,8 L30,8" stroke={P.ink} strokeWidth="5" strokeLinecap="round" />
        </g>
        {sayP > 0 && <g transform={`translate(${x} ${i % 2 ? 500 : 385}) scale(${sayP})`}>
          <rect x={-said.length * 11 - 18} y="-34" width={said.length * 22 + 36} height="68" rx="30" fill={CREAM} stroke={P.ink} strokeWidth="5" />
          <path d="M-8,32 L0,52 L12,32" fill={CREAM} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
          <text x="0" y="13" textAnchor="middle" fontFamily={SANS} fontWeight="800" fontSize="34" fill={VIOLET}>{said}</text>
        </g>}
      </g>;
    })}
    {tagp > 0 && <g transform={`translate(490 150) scale(${tagp}) rotate(-4)`}>
      <rect x="-200" y="-46" width="400" height="92" rx="16" fill="#E0567A" stroke={P.ink} strokeWidth="6" />
      <text x="0" y="18" textAnchor="middle" fontFamily={SERIF} fontWeight="800" fontSize="52" fill={CREAM}>blind spot</text>
    </g>}
  </g>;
}

/* 5 — the halo effect: one impression glows over every other trait, badge by badge */
const BADGES = ['SMART', 'KIND', 'HONEST', 'FUNNY', 'TALENTED', 'GOOD TASTE'];
function SceneWhy({ t, dur, P }) {
  const cam = { fx: 490, fy: 500, s: L(1, 1.12, E(t, 0, dur, 'draw')), px: 490, py: 500 };
  const spread = E(t, 0.6, 3.6, 'draw');
  return <g transform={camT(cam)}>
    <Dusk id="whDusk" t={t} top="#1E1150" mid={VIOLET} low="#6B3FA0" />
    <defs><radialGradient id="whGlow"><stop offset="0" stopColor={GOLD} stopOpacity="0.6" /><stop offset="1" stopColor={GOLD} stopOpacity="0" /></radialGradient></defs>
    <circle cx="490" cy="520" r={L(120, 520, spread)} fill="url(#whGlow)" />
    <Lecturer x={490} y={780} s={1.0} mood={1} t={t} />
    <Halo x={490} y={500} rx={78} t={t} />
    {BADGES.map((b, i) => {
      const a = Math.PI + (i / (BADGES.length - 1)) * Math.PI;
      const x = 490 + Math.cos(a) * 300, y = 560 + Math.sin(a) * 340 + 10 * Math.sin(t * 1.6 + i);
      const lit = E(t, 0.8 + i * 0.45, 1.2 + i * 0.45, 'pop');
      const w = b.length * 24 + 50;
      return <g key={b} transform={`translate(${x} ${y}) scale(${0.85 + 0.15 * lit})`}>
        <rect x={-w / 2} y="-36" width={w} height="72" rx="36" fill={lit > 0.5 ? GOLD : '#4A3A7A'} stroke={P.ink} strokeWidth="5" />
        <text x="0" y="13" textAnchor="middle" fontFamily={SANS} fontWeight="800" fontSize="34" letterSpacing="1.5" fill={lit > 0.5 ? VIOLET : '#B9A8E0'}>{b}</text>
        {lit > 0.5 && lit < 1.05 && <polygon points={burst(6, 22, 4)} fill={CREAM} transform={`translate(${w / 2 - 6} -30) scale(${win(t, 1.0 + i * 0.45, 1.5 + i * 0.45, 0.15)})`} />}
      </g>;
    })}
  </g>;
}

/* 6 — takeaway: lift the halo off, check each trait on its own; save it */
const CARDS = ['LOOKS', 'SKILL', 'KINDNESS', 'HONESTY'];
function SceneTakeaway({ t, beats, P }) {
  const b1 = beats[1] ?? 99;
  const lift = E(t, 0.6, 1.6, 'draw');
  const save = E(t, b1 + 0.2, b1 + 0.6, 'pop');
  return <g>
    <rect width="980" height="980" fill="#F7EBDD" />
    <circle cx="490" cy="520" r="400" fill={PEACH} opacity="0.25" />
    {/* the halo lifted off and set aside */}
    <Halo x={L(490, 820, lift)} y={L(300, 140, lift)} rx={L(120, 70, lift)} o={L(1, 0.55, lift)} t={t} />
    {CARDS.map((c, i) => {
      const x = 170 + i * 213, y = 520;
      const p = E(t, 1.0 + i * 0.3, 1.4 + i * 0.3, 'pop');
      const chk = E(t, 2.2 + i * 0.55, 2.6 + i * 0.55, 'draw');
      const focus = win(t, 2.0 + i * 0.55, 2.6 + i * 0.55, 0.15);
      return <g key={c} transform={`translate(${x} ${y - 30 * focus}) scale(${p * (1 + 0.08 * focus)}) rotate(${(i - 1.5) * 3})`}>
        <rect x="-92" y="-130" width="184" height="260" rx="18" fill={CREAM} stroke={P.ink} strokeWidth="6" />
        <text x="0" y="-70" textAnchor="middle" fontFamily={SANS} fontWeight="800" fontSize={c.length > 6 ? 30 : 36} letterSpacing="1" fill={VIOLET}>{c}</text>
        <circle cx="0" cy="30" r="48" fill={chk > 0 ? '#E3F5D9' : '#EFE3F7'} stroke={P.ink} strokeWidth="5" />
        <path d="M-22,30 L-6,46 L24,12" fill="none" stroke="#2E9B4F" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70" strokeDashoffset={70 * (1 - chk)} />
      </g>;
    })}
    {/* a magnifier moving card to card */}
    <g transform={`translate(${kf(t, [[2.0, 170], [2.6, 383], [3.15, 596], [3.7, 809]]) + 40} ${700 + 8 * Math.sin(t * 3)}) rotate(-30)`} opacity={E(t, 1.8, 2.1)}>
      <circle r="58" fill={CREAM} fillOpacity="0.35" stroke={P.ink} strokeWidth="12" />
      <rect x="-12" y="58" width="24" height="110" rx="10" fill={VIOLET} stroke={P.ink} strokeWidth="5" />
    </g>
    {save > 0 && <g transform={`translate(160 170) scale(${save})`}>
      <path d="M-50,-72 L50,-72 L50,72 L0,36 L-50,72 Z" fill={VIOLET} stroke={P.ink} strokeWidth="7" strokeLinejoin="round" />
      <polygon points={burst(12, 26, 5)} fill={GOLD} stroke={P.ink} strokeWidth="3" transform="translate(0 -18)" />
    </g>}
  </g>;
}

Object.assign(window, { SceneHook, SceneTwins, SceneRate, SceneBlind, SceneWhy, SceneTakeaway });
