// Default effect — story Short scenes (980×980 stage). Minimal Swiss: white grid, black type, one red
// accent, a giant checkbox, crisp sliding panels and bar charts. Objects only (forms, checkboxes, a pen).
// Pure functions of t (seconds into the scene); beats[i] = when narration line i of the scene starts.
// Kit: shorts/design_kit/story-kit.jsx.
const { K, L, E, win, kf, sc, md } = SK;
const HEAD = "'Inter Tight', 'Helvetica Neue', Arial, sans-serif";
const GREY = '#9A9A9A', RULE = '#E4E4E4', LIGHT = '#CFCFCF';

/* white Swiss grid that drifts very slowly, red corner mark, scene index */
function Grid({ t, P, n }) {
  const o = md(t * 7, 70);
  return <g>
    <rect x="-200" y="-200" width="1380" height="1380" fill={P.paper} />
    {Array.from({ length: 17 }, (_, i) => <line key={'v' + i} x1={i * 70 - 70 + o} y1="-200" x2={i * 70 - 70 + o} y2="1180" stroke={RULE} strokeWidth="1.5" />)}
    {Array.from({ length: 17 }, (_, i) => <line key={'h' + i} x1="-200" y1={i * 70 - 70} x2="1180" y2={i * 70 - 70} stroke={RULE} strokeWidth="1.5" />)}
    <rect x="40" y="40" width="22" height="22" fill={P.accent} />
    {n && <text x="940" y="940" textAnchor="end" fontFamily={HEAD} fontWeight="700" fontSize="24" fill={P.ink} letterSpacing="2">{n}</text>}
  </g>;
}

/* text helper */
const Tx = ({ x, y, s = 40, w = 800, c, a = 'start', ls = 0, o = 1, children, P }) =>
  <text x={x} y={y} textAnchor={a} fontFamily={HEAD} fontWeight={w} fontSize={s} fill={c || P.ink} letterSpacing={ls} opacity={o}>{children}</text>;

/* checkbox centred on (x, y); tick 0…1 draws the red check */
const TICK = 'M0.2,0.53 L0.43,0.76 L0.84,0.25';
function tickPt(p) {
  const s1 = 0.337;
  if (p < s1) { const k = p / s1; return [L(0.2, 0.43, k), L(0.53, 0.76, k)]; }
  const k = (p - s1) / (1 - s1); return [L(0.43, 0.84, k), L(0.76, 0.25, k)];
}
function Box({ x, y, size, tick = 0, s = 1, col, P, fill }) {
  const h = size / 2, sw = Math.max(5, size * 0.07);
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-h} y={-h} width={size} height={size} fill={fill || P.paper} stroke={P.ink} strokeWidth={sw} />
    {tick > 0 && <path d={TICK} transform={`translate(${-h} ${-h}) scale(${size})`} pathLength="1" fill="none" stroke={col || P.accent}
      strokeWidth={0.13} strokeLinecap="square" strokeLinejoin="miter" strokeDasharray="1" strokeDashoffset={1 - tick} />}
  </g>;
}

/* pen with its tip at the origin, body going up-right */
function Pen({ x, y, rot = -50, P }) {
  return <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <polygon points="0,0 46,-14 46,14" fill={P.ink} />
    <polygon points="0,0 16,-5 16,5" fill={P.accent} />
    <rect x="46" y="-17" width="230" height="34" fill={P.ink} />
    <rect x="210" y="-19" width="76" height="38" fill={P.accent} />
    <rect x="226" y="-27" width="50" height="10" fill={P.accent} />
  </g>;
}

/* map-ish blocks */
const AUSTRIA = 'M-180,15 L-140,-15 L-60,-5 L-10,-35 L70,-25 L140,-45 L180,-5 L160,45 L80,65 L-20,55 L-90,75 L-160,55 Z';
const GERMANY = 'M-15,-100 L25,-88 L37,-64 L67,-52 L73,-4 L61,38 L73,80 L31,98 L-11,92 L-53,80 L-65,32 L-77,-16 L-59,-58 L-35,-76 Z';

/* 1 — Austria 99.98% (ticked) vs Germany 12% (empty) */
function SceneHook({ t, dur, P }) {
  const zoom = L(1, 1.05, E(t, 0, dur, 'draw'));
  const aIn = E(t, 0, 0.55), gIn = E(t, 3.1, 3.6);
  const aTick = E(t, 0.3, 0.55, 'draw'), aPop = 1 + 0.12 * win(t, 0.3, 0.45, 0.12);
  const aN = 99.98 * E(t, 0.45, 1.8, 'draw'), gN = 12 * E(t, 3.5, 4.3, 'draw');
  const col = (cx, dx, name, path, ms, dot, box, num, bar, barCol, o) => <g transform={`translate(${dx} 0)`} opacity={o}>
    <Tx x={cx - 190} y={140} s={30} w={800} ls={4} P={P}>{name}</Tx>
    <line x1={cx - 190} y1={160} x2={cx + 190} y2={160} stroke={P.ink} strokeWidth="4" />
    <g transform={`translate(${cx} 270) scale(${ms})`}><path d={path} fill={P.ink} /></g>
    <circle cx={cx + dot[0]} cy={270 + dot[1]} r="9" fill={P.accent} />
    {box}
    <Tx x={cx - 190} y={810} s={110} w={900} ls={-4} c={barCol === P.accent ? P.accent : P.ink} P={P}>{num}</Tx>
    <rect x={cx - 190} y={845} width={380} height="22" fill={P.soft} />
    <rect x={cx - 190} y={845} width={380 * bar} height="22" fill={barCol} />
  </g>;
  return <g transform={sc(490, 490, zoom)}>
    <Grid t={t} P={P} n="01" />
    <line x1="490" y1="110" x2="490" y2={L(110, 880, E(t, 0.2, 1.0, 'draw'))} stroke={P.ink} strokeWidth="2" />
    {col(275, L(-560, 0, aIn), 'AUSTRIA', AUSTRIA, 1, [150, -10],
      <Box x={275} y={545} size={230} s={aPop} tick={aTick} P={P} />, `${aN.toFixed(2)}%`, aN / 100, P.accent, 1)}
    {col(705, L(560, 0, gIn), 'GERMANY', GERMANY, 0.95, [30, -60],
      <Box x={705} y={545} size={230} s={1 + 0.02 * Math.sin(t * 3)} P={P} />, `${Math.round(gN)}%`, gN / 100, P.ink, gIn)}
    {gIn < 0.5 && <rect x="590" y="430" width="230" height="230" fill="none" stroke={LIGHT} strokeWidth="4" strokeDasharray="14 12" opacity={1 - gIn * 2} />}
  </g>;
}

/* 2 — two equal panels slide in; culture, wealth, values; "=" signs */
function Icon({ k, P }) {
  if (k === 0) return <g fill={P.ink}>
    <polygon points="-44,-14 0,-44 44,-14" />
    {[-32, -8, 16].map((x) => <rect key={x} x={x} y="-8" width="16" height="36" />)}
    <rect x="-46" y="30" width="92" height="10" />
  </g>;
  if (k === 1) return <g>
    <circle r="38" fill={P.paper} stroke={P.ink} strokeWidth="8" />
    <text x="0" y="17" textAnchor="middle" fontFamily={HEAD} fontWeight="900" fontSize="48" fill={P.ink}>€</text>
  </g>;
  return <path d="M0,34 C-56,0 -46,-42 -16,-38 C-5,-36 0,-27 0,-22 C0,-27 5,-36 16,-38 C46,-42 56,0 0,34 Z" fill={P.accent} />;
}
const ROWS = ['CULTURE', 'WEALTH', 'VALUES'];
function SceneNeighbours({ t, dur, P }) {
  const zoom = L(1.02, 1.07, E(t, 0, dur, 'draw'));
  const panel = (cx, dx, code, name, t0) => <g transform={`translate(${dx} 0)`}>
    <rect x={cx - 175} y="130" width="350" height="740" fill={P.paper} stroke={P.ink} strokeWidth="5" />
    <Tx x={cx - 145} y={265} s={130} w={900} ls={-4} P={P}>{code}</Tx>
    <Tx x={cx - 145} y={310} s={26} w={700} ls={4} P={P}>{name}</Tx>
    <rect x={cx - 145} y="330" width={290 * E(t, t0 + 0.3, t0 + 0.8, 'draw')} height="8" fill={P.accent} />
    {ROWS.map((r, i) => {
      const p = E(t, t0 + 0.35 + i * 0.15, t0 + 0.7 + i * 0.15, 'pop');
      const y = 440 + i * 150;
      return <g key={r}>
        <line x1={cx - 145} y1={y + 70} x2={cx + 145} y2={y + 70} stroke={RULE} strokeWidth="3" />
        <g transform={`translate(${cx - 95} ${y}) scale(${p})`}><Icon k={i} P={P} /></g>
        <Tx x={cx - 30} y={y + 11} s={30} w={800} ls={2} o={p > 0 ? 1 : 0} P={P}>{r}</Tx>
      </g>;
    })}
  </g>;
  return <g transform={sc(490, 490, zoom)}>
    <Grid t={t} P={P} n="02" />
    {panel(265, L(-700, 0, E(t, 0, 0.5)), 'AT', 'AUSTRIA', 0)}
    {panel(715, L(700, 0, E(t, 0.8, 1.3)), 'DE', 'GERMANY', 0.8)}
    {[1.5, 2.1, 2.7].map((t0, i) => {
      const p = E(t, t0, t0 + 0.3, 'pop'), y = 440 + i * 150;
      return <g key={i} transform={`translate(490 ${y}) scale(${p})`}>
        <rect x="-22" y="-16" width="44" height="10" fill={P.accent} />
        <rect x="-22" y="6" width="44" height="10" fill={P.accent} />
      </g>;
    })}
  </g>;
}

/* 3 — JOHNSON & GOLDSTEIN 2003 in Swiss type; one checkbox zooms up */
function SceneStudy({ t, dur, P }) {
  const zoom = L(1, 1.04, E(t, 0, dur, 'draw'));
  const z = E(t, 2.9, 3.7, 'draw'), tick = E(t, 3.9, 4.2, 'draw');
  const fade = L(1, 0.12, z);
  const slide = (t0) => L(-700, 0, E(t, t0, t0 + 0.5));
  const bx = L(840, 490, z), by = L(840, 540, z), bs = L(70, 420, z);
  const bump = 1 + 0.06 * win(t, 3.9, 4.1, 0.1);
  return <g transform={sc(490, 490, zoom)}>
    <Grid t={t} P={P} n="03" />
    <g opacity={fade} transform={`translate(0 ${-60 * z})`}>
      <Tx x={90} y={150} s={26} w={700} ls={5} o={E(t, 0, 0.3)} P={P}>STUDY · SCIENCE</Tx>
      <g transform={`translate(${slide(0.15)} 0)`}><Tx x={84} y={370} s={240} w={900} ls={-10} c={P.accent} P={P}>2003</Tx></g>
      <g transform={`translate(${slide(0.9)} 0)`}><Tx x={90} y={500} s={100} w={900} ls={-3} P={P}>JOHNSON</Tx></g>
      <g transform={`translate(${slide(1.5)} 0)`}><Tx x={90} y={605} s={100} w={900} ls={-3} P={P}>&amp; GOLDSTEIN</Tx></g>
      <rect x="90" y="640" width={800 * E(t, 1.9, 2.5, 'draw')} height="6" fill={P.ink} />
      <Tx x={90} y={690} s={28} w={600} ls={2} o={E(t, 2.2, 2.6)} P={P}>“Do Defaults Save Lives?”</Tx>
    </g>
    {t > 2.6 && <g transform={sc(bx, by, E(t, 2.6, 2.9, 'pop') * bump)}>
      <Box x={bx} y={by} size={bs} tick={tick} P={P} />
    </g>}
    <Tx x={490} y={850} s={34} w={800} ls={6} a="middle" o={E(t, 4.0, 4.4)} P={P}>ONE CHECKBOX</Tx>
  </g>;
}

/* 4 — donor forms: Austria pre-ticked (opt out), then Germany empty and a pen ticks it (opt in) */
function Form({ dx, rot, name, line1, line2, tag, tagCol, tick, boxS, stamp, P }) {
  return <g transform={`translate(${dx} 0) rotate(${rot} 490 490)`}>
    <rect x="198" y="142" width="600" height="720" fill={LIGHT} />
    <rect x="190" y="130" width="600" height="720" fill={P.paper} stroke={P.ink} strokeWidth="5" />
    <Tx x={230} y={200} s={22} w={700} ls={4} P={P}>ORGAN DONOR REGISTER</Tx>
    <Tx x={230} y={262} s={66} w={900} ls={-2} P={P}>{name}</Tx>
    <rect x="610" y="164" width="150" height="46" fill={tagCol} />
    <Tx x={685} y={196} s={24} w={800} ls={3} a="middle" c={P.paper} P={P}>{tag}</Tx>
    <rect x="230" y="285" width="520" height="8" fill={P.accent} />
    {[['NAME', 360], ['DATE OF BIRTH', 450]].map(([l, y]) => <g key={l}>
      <Tx x={230} y={y - 20} s={18} w={700} ls={3} c={GREY} P={P}>{l}</Tx>
      <line x1="230" y1={y + 18} x2="750" y2={y + 18} stroke={P.ink} strokeWidth="2.5" />
    </g>)}
    <g transform={sc(300, 610, boxS)}><Box x={300} y={610} size={120} tick={tick} P={P} /></g>
    <Tx x={395} y={605} s={50} w={900} ls={-1} P={P}>{line1}</Tx>
    <Tx x={395} y={648} s={28} w={500} P={P}>{line2}</Tx>
    <line x1="230" y1="780" x2="560" y2="780" stroke={P.ink} strokeWidth="2.5" />
    <Tx x={230} y={812} s={18} w={700} ls={3} c={GREY} P={P}>SIGNATURE</Tx>
    {stamp > 0 && <g transform={`translate(680 770) rotate(-10) scale(${stamp})`}>
      <rect x="-100" y="-40" width="200" height="80" fill="none" stroke={tagCol} strokeWidth="7" />
      <Tx x={0} y={14} s={38} w={900} ls={2} a="middle" c={tagCol} P={P}>{tag}</Tx>
    </g>}
  </g>;
}
function SceneForms({ t, beats, dur, P }) {
  const b1 = beats[1] ?? 99;
  const zoom = L(1, 1.04, E(t, 0, dur, 'draw'));
  const aIn = E(t, 0, 0.5), aOut = E(t, b1, b1 + 0.45, 'draw'), gIn = E(t, b1 + 0.05, b1 + 0.55);
  const aTick = E(t, 1.1, 1.35, 'draw');
  const gTick = E(t, b1 + 1.6, b1 + 2.0, 'draw');
  // pen: in from bottom-right, hover above the box, draw the tick, lift away
  const bx = 240, by = 550, bsz = 120; // box top-left on the form
  const [ux, uy] = tickPt(gTick);
  const tipX = bx + ux * bsz, tipY = by + uy * bsz;
  const enter = E(t, b1 + 0.6, b1 + 1.4), lift = E(t, b1 + 2.1, b1 + 2.8, 'draw');
  const hover = (1 - K(t, b1 + 1.5, b1 + 1.6)) * (18 + 6 * Math.sin(t * 6));
  const px = L(1050, tipX, enter) + lift * 160, py = L(1100, tipY, enter) - hover - lift * 120;
  return <g transform={sc(490, 490, zoom)}>
    <Grid t={t} P={P} n="04" />
    {aOut < 1 && <Form dx={L(-900, 0, aIn) - 1000 * aOut} rot={L(-4, 0, aIn) - 6 * aOut} name="AUSTRIA" line1="DONOR" line2="unless you opt out"
      tag="OPT-OUT" tagCol={P.accent} tick={aTick} boxS={1 + 0.15 * win(t, 1.1, 1.25, 0.1)} stamp={E(t, 1.7, 2.0, 'pop')} P={P} />}
    {t > b1 && <Form dx={L(1000, 0, gIn)} rot={L(5, 0, gIn)} name="GERMANY" line1="DONOR?" line2="tick the box to opt in"
      tag="OPT-IN" tagCol={P.ink} tick={gTick} boxS={1 + 0.1 * win(t, b1 + 2.0, b1 + 2.15, 0.1)} stamp={E(t, b1 + 2.4, b1 + 2.7, 'pop')} P={P} />}
    {t > b1 + 0.5 && <Pen x={px} y={py} rot={-50 + 6 * Math.sin(t * 3)} P={P} />}
  </g>;
}

/* 5 — bar chart: opt-out countries rise near 100 (red), opt-in stay low (black/grey), then settle */
const OUT = [['AT', 99.98], ['BE', 98], ['FR', 99.9], ['HU', 99.99], ['PL', 99.5], ['SE', 85.9]];
const IN = [['DK', 4.25], ['UK', 17.2], ['NL', 27.5], ['DE', 12]];
function SceneBars({ t, dur, P }) {
  const zoom = L(1, 1.05, E(t, 0, dur, 'draw'));
  const X0 = 110, BASE = 820, TOP = 250, H = BASE - TOP, BW = 56, GAP = 22;
  const yOf = (v) => BASE - (H * v) / 100;
  const bar = (i, lab, v, k, fill, gx) => {
    const x = X0 + gx + i * (BW + GAP), h = (H * v * k) / 100;
    return <g key={lab}>
      <rect x={x} y={BASE - h} width={BW} height={Math.max(0, h)} fill={fill} />
      <Tx x={x + BW / 2} y={BASE + 40} s={24} w={800} ls={1} a="middle" o={k > 0 ? 1 : 0.25} P={P}>{lab}</Tx>
      {k > 0.05 && <Tx x={x + BW / 2} y={BASE - h - 12} s={20} w={700} a="middle" c={fill === P.accent ? P.accent : P.ink} P={P}>{Math.round(v * Math.min(1, k))}</Tx>}
    </g>;
  };
  const outK = (i) => E(t, 0.3 + i * 0.12, 1.9 + i * 0.12, 'pop');
  const inK = (i) => E(t, 3.0 + i * 0.12, 3.6 + i * 0.12, 'enter');
  const gx2 = 6 * (BW + GAP) + 30;
  const settle = win(t, 2.55, 3.0, 0.08);
  return <g transform={sc(490, 520, zoom)}>
    <Grid t={t} P={P} n="05" />
    {[0, 50, 100].map((v) => <g key={v}>
      <line x1={X0 - 20} y1={yOf(v)} x2="900" y2={yOf(v)} stroke={v === 0 ? P.ink : LIGHT} strokeWidth={v === 0 ? 4 : 2} strokeDasharray={v === 100 ? '10 8' : undefined} />
      <Tx x={X0 - 28} y={yOf(v) + 8} s={20} w={600} a="end" c={GREY} P={P}>{v}</Tx>
    </g>)}
    <Tx x={X0} y={170} s={30} w={900} ls={4} c={P.accent} o={E(t, 0, 0.3)} P={P}>OPT-OUT</Tx>
    <rect x={X0} y="185" width={6 * (BW + GAP) - GAP} height="6" fill={P.accent} opacity={E(t, 0, 0.3)} />
    <Tx x={X0 + gx2} y={170} s={30} w={900} ls={4} o={E(t, 2.9, 3.2)} P={P}>OPT-IN</Tx>
    <rect x={X0 + gx2} y="185" width={4 * (BW + GAP) - GAP} height="6" fill={P.ink} opacity={E(t, 2.9, 3.2)} />
    {OUT.map(([l, v], i) => bar(i, l, v, outK(i), P.accent, 0))}
    {IN.map(([l, v], i) => bar(i, l, v, inK(i), i === 3 ? P.ink : GREY, gx2))}
    <rect x={X0 - 6} y={yOf(100) - 6} width={6 * (BW + GAP) - GAP + 12} height="12" fill={P.accent} opacity={0.35 * settle} />
    <Tx x={900} y={BASE + 95} s={20} w={600} a="end" c={GREY} o={E(t, 3.8, 4.3)} P={P}>% OF PEOPLE WHO ARE DONORS · JOHNSON &amp; GOLDSTEIN 2003</Tx>
  </g>;
}

/* 6 — nobody forced: a pen that never moves, the easy path to the pre-ticked box; then THE DEFAULT EFFECT */
function SceneWhy({ t, beats, dur, P }) {
  const b1 = beats[1] ?? 99;
  const out = E(t, b1 - 0.1, b1 + 0.35, 'draw');
  const zoom = L(1, 1.05, E(t, 0, b1, 'draw'));
  const path = E(t, 1.4, 2.6, 'draw');
  const pulse = 1 + 0.1 * win(t, 3.0, 3.18, 0.1);
  const adv = E(t, 3.0, 3.35, 'pop');
  const w1 = (k) => L(250, 0, E(t, b1 + k, b1 + k + 0.45));
  const push = L(1, 1.05, E(t, b1, dur, 'draw'));
  return <g>
    <Grid t={t} P={P} n="06" />
    {out < 1 && <g opacity={1 - out} transform={`${sc(490, 490, zoom)} translate(0 ${-200 * out})`}>
      <g transform={sc(490, 190, E(t, 0, 0.35, 'pop'))}>
        <rect x="430" y="160" width="120" height="60" fill={P.ink} />
        <Tx x={490} y={202} s={30} w={900} ls={3} a="middle" c={P.paper} P={P}>YOU</Tx>
      </g>
      <path d="M470,225 C420,330 300,380 265,520" fill="none" stroke={P.accent} strokeWidth="14" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - path} />
      {path > 0.95 && <polygon points="265,555 238,505 292,505" fill={P.accent} />}
      <Tx x={240} y={360} s={28} w={900} ls={3} c={P.accent} a="end" o={E(t, 2.0, 2.4)} P={P}>EASY PATH</Tx>
      <path d="M510,225 L560,300 L620,300 L660,380 L720,380 L735,520" fill="none" stroke={LIGHT} strokeWidth="6" strokeDasharray="12 12" opacity={E(t, 0.5, 0.9)} />
      <g transform={sc(265, 650, pulse)}><Box x={265} y={650} size={200} tick={1} P={P} /></g>
      <Tx x={265} y={800} s={30} w={900} ls={4} a="middle" P={P}>DEFAULT</Tx>
      <Box x={735} y={650} size={200} P={P} />
      <Tx x={735} y={800} s={30} w={900} ls={4} a="middle" c={GREY} P={P}>CHANGE IT</Tx>
      <Pen x={760} y={470 + 10 * Math.sin(t * 2.4)} rot={-55 + 3 * Math.sin(t * 1.7)} P={P} />
      {adv > 0 && <g transform={`translate(265 885) scale(${adv})`}>
        <rect x="-140" y="-30" width="280" height="56" fill={P.accent} />
        <Tx x={0} y={9} s={26} w={900} ls={4} a="middle" c={P.paper} P={P}>RECOMMENDED</Tx>
      </g>}
    </g>}
    {t > b1 - 0.05 && <g transform={sc(490, 490, push)}>
      <g transform={`translate(0 ${w1(0.05)})`} opacity={E(t, b1 + 0.05, b1 + 0.3)}><Tx x={90} y={330} s={80} w={900} ls={-2} P={P}>THE</Tx></g>
      <g transform={`translate(0 ${w1(0.18)})`} opacity={E(t, b1 + 0.18, b1 + 0.43)}><Tx x={82} y={530} s={196} w={900} ls={-9} c={P.accent} P={P}>DEFAULT</Tx></g>
      <g transform={`translate(0 ${w1(0.31)})`} opacity={E(t, b1 + 0.31, b1 + 0.56)}><Tx x={82} y={720} s={196} w={900} ls={-9} P={P}>EFFECT</Tx></g>
      <rect x="90" y="770" width={800 * E(t, b1 + 0.5, b1 + 1.0, 'draw')} height="16" fill={P.accent} />
      <g transform={sc(820, 280, E(t, b1 + 0.6, b1 + 0.9, 'pop'))}><Box x={820} y={280} size={110} tick={E(t, b1 + 0.8, b1 + 1.05, 'draw')} P={P} /></g>
    </g>}
  </g>;
}

/* 7 — settings list: each default gets checked and switched off, one by one; then follow */
function Switch({ x, y, on, P }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-66" y="-34" width="132" height="68" rx="34" fill={on > 0.5 ? P.accent : P.soft} stroke={P.ink} strokeWidth="5" />
    <circle cx={L(-32, 32, on)} cy="0" r="24" fill={P.paper} stroke={P.ink} strokeWidth="5" />
  </g>;
}
const SET = [['SUBSCRIPTIONS', 'Premium plan · auto-billed'], ['AUTO-RENEW', 'Renews every year'], ['PRIVACY', 'Share my data']];
const CT = [0.4, 1.2, 2.2];
function SceneOutro({ t, dur, P }) {
  const zoom = L(1, 1.04, E(t, 0, dur, 'draw'));
  const bsz = 76, bx0 = 120 - bsz / 2;
  const rowY = (i) => 320 + i * 150;
  // pen tip: in from the right, draws each tick, travels between rows, then leaves
  let tip = [1080, 1100];
  const tk = (i) => E(t, CT[i], CT[i] + 0.25, 'draw');
  const at = (i, p) => { const [u, v] = tickPt(p); return [bx0 + u * bsz, rowY(i) - bsz / 2 + v * bsz]; };
  if (t < CT[0]) tip = [L(1080, at(0, 0)[0], E(t, 0, CT[0])), L(1100, at(0, 0)[1], E(t, 0, CT[0]))];
  else for (let i = 0; i < 3; i++) {
    const nx = i < 2 ? at(i + 1, 0) : [1080, 1100];
    const tEnd = i < 2 ? CT[i + 1] : CT[2] + 1.0;
    if (t < CT[i] + 0.25) { tip = at(i, tk(i)); break; }
    if (t < tEnd || i === 2) { const k = E(t, CT[i] + 0.25, tEnd, 'draw'); const e = at(i, 1); tip = [L(e[0], nx[0], k), L(e[1], nx[1], k) - 30 * Math.sin(Math.PI * k)]; break; }
  }
  const fol = E(t, 3.4, 4.0, 'pop');
  return <g transform={sc(490, 490, zoom)}>
    <Grid t={t} P={P} n="07" />
    <g transform={`translate(${L(-600, 0, E(t, 0, 0.4))} 0)`}>
      <Tx x={90} y={190} s={76} w={900} ls={-2} P={P}>SETTINGS</Tx>
      <rect x="90" y="215" width="800" height="8" fill={P.ink} />
    </g>
    {SET.map(([a, b], i) => {
      const y = rowY(i), k = tk(i), slide = L(800, 0, E(t, 0.05 + i * 0.1, 0.45 + i * 0.1));
      return <g key={a} transform={`translate(${slide} 0)`}>
        <rect x="90" y={y - 65} width="800" height="130" fill={P.accent} opacity={0.08 * win(t, CT[i], CT[i] + 0.5, 0.1)} />
        <line x1="90" y1={y + 70} x2="890" y2={y + 70} stroke={RULE} strokeWidth="3" />
        <g transform={sc(120, y, 1 + 0.12 * win(t, CT[i] + 0.2, CT[i] + 0.35, 0.08))}><Box x={120} y={y} size={bsz} tick={k} P={P} /></g>
        <Tx x={190} y={y + 2} s={46} w={900} ls={-1} P={P}>{a}</Tx>
        <Tx x={190} y={y + 42} s={24} w={500} c={GREY} P={P}>{b}</Tx>
        <Switch x={800} y={y} on={1 - E(t, CT[i] + 0.15, CT[i] + 0.4, 'draw')} P={P} />
      </g>;
    })}
    <Pen x={tip[0]} y={tip[1]} rot={-50} P={P} />
    {fol > 0 && <g transform={`translate(0 ${L(220, 0, fol)})`}>
      <rect x="90" y="790" width="800" height="110" fill={P.accent} />
      <Tx x={130} y={862} s={52} w={900} ls={1} c={P.paper} P={P}>FOLLOW FOR MORE</Tx>
      <g transform="translate(830 845)"><Box x={0} y={0} size={60} tick={E(t, 3.9, 4.15, 'draw')} col={P.ink} P={P} /></g>
    </g>}
  </g>;
}

Object.assign(window, { SceneHook, SceneNeighbours, SceneStudy, SceneForms, SceneBars, SceneWhy, SceneOutro });
