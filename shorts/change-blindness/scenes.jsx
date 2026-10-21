// Change blindness — story Short scenes (980×980 stage). Bright flat cartoon street, playful and fast:
// spot-the-difference flicker panels, a big door that slides through the frame and hides a swap.
// Pure functions of t (seconds into the scene); beats[i] = when narration line i of the scene starts.
// Kit: shorts/design_kit/story-kit.jsx.
const { K, L, E, win, kf, camT, burst, sc, md, hsh, D2R } = SK;
const HEADF = "'Fredoka', 'Nunito', sans-serif";
const BODYF = "'Nunito', 'Fredoka', sans-serif";
const GRASS = '#7FD36B', GRASS_D = '#5CB84F', SAND = '#FFE9A8', WALK = '#F6E7C1', ROAD = '#5B5B70';

const looks = (P) => ({
  cap: { shirt: '#3E7BE6', pants: '#2F3550', hair: P.hair },
  glasses: { shirt: '#35B67F', pants: '#5A4636', hair: '#4A2E1C' },
  ped: { shirt: P.pop, pants: '#4A4A6A', hair: '#B5532A' },
  worker: { shirt: '#FF9A3C', pants: '#3B5BA5', hair: P.hair },
});

/* folded street map centred on the origin */
function MapProp({ w = 96, h = 70, P }) {
  return <g>
    <path d={`M${-w / 2},${-h / 2} L${-w / 6},${-h / 2 + 6} L${w / 6},${-h / 2} L${w / 2},${-h / 2 + 6} L${w / 2},${h / 2} L${w / 6},${h / 2 - 6} L${-w / 6},${h / 2} L${-w / 2},${h / 2 - 6} Z`}
      fill={P.soft} stroke={P.ink} strokeWidth="4.5" strokeLinejoin="round" />
    <path d={`M${-w / 6},${-h / 2 + 6} L${-w / 6},${h / 2} M${w / 6},${-h / 2} L${w / 6},${h / 2 - 6}`} stroke={P.ink} strokeWidth="2.5" opacity="0.5" />
    <rect x={-w / 2 + 8} y={-h / 2 + 14} width={w * 0.3} height={h * 0.3} rx="4" fill={GRASS} opacity="0.8" />
    <path d={`M${-w / 2 + 10},${h / 4} Q${-w / 8},${-h / 6} ${w / 8},${h / 8} T${w / 2 - 10},${-h / 4}`} fill="none" stroke={P.hot} strokeWidth="4" strokeDasharray="7 6" strokeLinecap="round" />
    <circle cx={w / 2 - 14} cy={-h / 4} r="6" fill={P.hot} stroke={P.ink} strokeWidth="2.5" />
  </g>;
}

/* full-body flat cartoon person, feet at (x, y). who: cap | glasses | ped | worker.
   ph = walk phase, walk 0…1, talk 0…1, map 0/1 (holding), mapUp 0…1, point 0…1 (front arm up-forward) */
function Person({ x, y, s = 1, dir = 1, ph = 0, walk = 0, who = 'cap', talk = 0, t = 0, map = 0, mapUp = 0, point = 0, seed = 0, P }) {
  const C = looks(P)[who];
  const a = Math.sin(ph) * 24 * walk * D2R;
  const hipY = -128, LL = 128;
  const f1 = [-12 + Math.sin(a) * LL, hipY + Math.cos(a) * LL], f2 = [12 - Math.sin(a) * LL, hipY + Math.cos(a) * LL];
  const bob = walk > 0 ? -Math.abs(Math.cos(ph)) * 7 * walk : Math.sin(t * 2.2 + seed) * 2.5;
  const sw = Math.sin(ph) * 22 * walk;
  const open = talk * Math.max(0, Math.sin(t * 13 + seed));
  const blink = md(t + seed * 0.7, 3.1) < 0.12;
  const backS = [-dir * 34, -232], frontS = [dir * 34, -232];
  const mapY = L(-178, -228, mapUp);
  const backH = map ? [dir * 30, mapY + 6] : [backS[0] - sw * 0.6, -138];
  const frontH = point > 0.01 ? [L(frontS[0] + sw * 0.6, dir * 132, point), L(-138, -292, point)] : map ? [dir * 70, mapY + 4] : [frontS[0] + sw * 0.6, -138];
  const eyeY = -308, e1 = dir * 12, e2 = dir * 33;
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="2" rx="62" ry="10" fill={P.ink} opacity="0.13" />
    <g transform={`translate(0 ${bob})`}>
      <StoryCap d={`M12,${hipY} L${f2[0].toFixed(1)},${f2[1].toFixed(1)}`} w={26} c={C.pants} o={4} />
      <ellipse cx={f2[0] + dir * 10} cy={f2[1] - 4} rx="20" ry="10" fill={P.ink} />
      <StoryCap d={`M-12,${hipY} L${f1[0].toFixed(1)},${f1[1].toFixed(1)}`} w={26} c={C.pants} o={4} />
      <ellipse cx={f1[0] + dir * 10} cy={f1[1] - 4} rx="20" ry="10" fill={P.ink} />
      <StoryCap d={`M${backS[0]},${backS[1]} L${backH[0].toFixed(1)},${backH[1].toFixed(1)}`} w={20} c={C.shirt} o={4} />
      <circle cx={backH[0]} cy={backH[1]} r="11" fill={P.skin} stroke={P.ink} strokeWidth="4" />
      <rect x="-50" y="-262" width="100" height="150" rx="34" fill={C.shirt} stroke={P.ink} strokeWidth="5" />
      <path d={`M${-dir * 50},-200 Q${-dir * 50},-118 ${-dir * 18},-112 L${-dir * 40},-112 Q${-dir * 50},-130 ${-dir * 50},-200 Z`} fill={P.ink} opacity="0.12" />
      {who === 'worker' && <path d="M-30,-262 L-30,-150 M30,-262 L30,-150" stroke={P.pop} strokeWidth="9" />}
      {map > 0 && <g transform={`translate(${dir * 48} ${mapY}) rotate(${dir * -6})`}><MapProp P={P} /></g>}
      <StoryCap d={`M${frontS[0]},${frontS[1]} L${frontH[0].toFixed(1)},${frontH[1].toFixed(1)}`} w={20} c={C.shirt} o={4} />
      <circle cx={frontH[0]} cy={frontH[1]} r="11" fill={P.skin} stroke={P.ink} strokeWidth="4" />
      {/* head */}
      <rect x="-13" y="-276" width="26" height="22" fill={P.skinShade} stroke={P.ink} strokeWidth="4" />
      <circle cx={dir * 4} cy="-305" r="46" fill={P.skin} stroke={P.ink} strokeWidth="5" />
      <ellipse cx={-dir * 24} cy="-300" rx="8" ry="11" fill={P.skin} stroke={P.ink} strokeWidth="4" />
      {blink
        ? <path d={`M${e1 - 6},${eyeY} L${e1 + 6},${eyeY} M${e2 - 6},${eyeY} L${e2 + 6},${eyeY}`} stroke={P.ink} strokeWidth="4" strokeLinecap="round" />
        : <g><circle cx={e1} cy={eyeY} r="5.5" fill={P.ink} /><circle cx={e2} cy={eyeY} r="5.5" fill={P.ink} /></g>}
      <circle cx={dir * 42} cy="-288" r="6" fill={P.hot} opacity="0.35" />
      {open > 0.12
        ? <ellipse cx={dir * 26} cy="-280" rx={5 + open * 2} ry={3 + open * 6} fill={P.ink} />
        : <path d={`M${dir * 14},-282 Q${dir * 26},-274 ${dir * 36},-283`} fill="none" stroke={P.ink} strokeWidth="4" strokeLinecap="round" />}
      {who === 'cap' && <g>
        <path d={`M${-dir * 44},-312 Q${-dir * 50},-290 ${-dir * 38},-280`} fill="none" stroke={C.hair} strokeWidth="9" strokeLinecap="round" />
        <path d="M-49,-316 Q-48,-364 4,-366 Q55,-364 54,-316 Z" fill={P.hot} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />
        <path d="M-10,-364 Q2,-340 4,-316" fill="none" stroke={P.ink} strokeWidth="3" opacity="0.5" />
        <rect x={dir > 0 ? 6 : -96} y="-324" width="90" height="15" rx="7" fill={P.accentDark} stroke={P.ink} strokeWidth="4.5" />
        <circle cx="4" cy="-366" r="6" fill={P.pop} stroke={P.ink} strokeWidth="3" />
      </g>}
      {who === 'glasses' && <g>
        {[[-30, -338, 20], [-8, -350, 22], [18, -350, 21], [38, -334, 17], [-42, -318, 15], [-dir * 40, -296, 12]].map(([cx, cy, r], i) =>
          <circle key={i} cx={cx} cy={cy} r={r} fill={C.hair} stroke={P.ink} strokeWidth="4" />)}
        <path d="M-40,-336 Q4,-368 46,-332 Q20,-342 -40,-326 Z" fill={C.hair} />
        <circle cx={e1} cy={eyeY} r="15" fill={P.paper} fillOpacity="0.25" stroke={P.ink} strokeWidth="4.5" />
        <circle cx={e2} cy={eyeY} r="15" fill={P.paper} fillOpacity="0.25" stroke={P.ink} strokeWidth="4.5" />
        <path d={`M${dir * 21},-309 L${dir * 24},-309 M${-dir * 3},-309 L${-dir * 22},-304`} stroke={P.ink} strokeWidth="4" strokeLinecap="round" />
      </g>}
      {who === 'ped' && <g>
        <path d="M-48,-300 Q-52,-362 6,-358 Q52,-356 50,-318 Q20,-336 -10,-330 Q-30,-326 -48,-300 Z" fill={C.hair} stroke={P.ink} strokeWidth="4.5" strokeLinejoin="round" />
        <circle cx={-dir * 46} cy="-344" r="17" fill={C.hair} stroke={P.ink} strokeWidth="4.5" />
      </g>}
      {who === 'worker' && <g>
        <path d="M-50,-318 Q-48,-368 4,-368 Q56,-368 56,-318 Z" fill={P.pop} stroke={P.ink} strokeWidth="5" />
        <rect x="-60" y="-324" width="124" height="12" rx="6" fill={P.pop} stroke={P.ink} strokeWidth="4" />
      </g>}
    </g>
  </g>;
}

/* tiny walker for backgrounds */
function Tiny({ x, y, s = 0.4, dir = 1, ph = 0, shirt, P }) {
  const a = Math.sin(ph) * 25 * D2R;
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <StoryCap d={`M0,-120 L${Math.sin(a) * 120},0`} w={22} c={P.ink} o={2} />
    <StoryCap d={`M0,-120 L${-Math.sin(a) * 120},0`} w={22} c={P.ink} o={2} />
    <rect x="-38" y="-250" width="76" height="140" rx="30" fill={shirt} stroke={P.ink} strokeWidth="6" />
    <circle cx={dir * 4} cy="-290" r="40" fill={P.skin} stroke={P.ink} strokeWidth="6" />
  </g>;
}

/* the street panel used by the flicker scene: 760×720, the middle person is `who` */
function StreetPanel({ id, who, t, P }) {
  const bld = [[-20, 180, 340, P.hot], [160, 150, 250, P.pop], [310, 170, 370, P.paper], [480, 150, 280, P.hot], [630, 150, 350, P.pop]];
  return <g>
    <clipPath id={id}><rect width="760" height="720" rx="30" /></clipPath>
    <g clipPath={`url(#${id})`}>
      <rect width="760" height="720" fill={P.cool} />
      <circle cx="640" cy="105" r="52" fill={P.pop} stroke={P.ink} strokeWidth="5" />
      {[0, 1].map((i) => { const cx = md(140 + t * 24 + i * 420, 980) - 110; return <g key={i}>
        <ellipse cx={cx} cy={70 + i * 50} rx="62" ry="22" fill={P.paper} />
        <ellipse cx={cx + 30} cy={58 + i * 50} rx="36" ry="24" fill={P.paper} /></g>; })}
      {bld.map(([bx, bw, bh, c], i) => <g key={i}>
        <rect x={bx} y={480 - bh} width={bw} height={bh} fill={c} stroke={P.ink} strokeWidth="5" />
        <rect x={bx} y={480 - bh} width={bw} height="18" fill={P.ink} opacity="0.15" />
        {Array.from({ length: 3 }, (_, r) => Array.from({ length: 2 }, (_, q) =>
          <rect key={`${r}${q}`} x={bx + 28 + q * (bw - 90)} y={480 - bh + 44 + r * 78} width="34" height="46" rx="6"
            fill={hsh(i * 7 + r * 3 + q) > 0.7 ? P.pop : P.cool} stroke={P.ink} strokeWidth="4" />)).flat().filter((_, k) => 480 - bh + 44 + Math.floor(k / 2) * 78 < 400)}
      </g>)}
      <rect x="0" y="480" width="760" height="170" fill={WALK} stroke={P.ink} strokeWidth="5" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={i * 150 - 30} y1="482" x2={i * 150 - 90} y2="648" stroke={P.ink} strokeWidth="3" opacity="0.15" />)}
      <rect x="0" y="650" width="760" height="70" fill={ROAD} />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 150 + 20} y="680" width="80" height="10" rx="5" fill={P.pop} />)}
      <rect x="96" y="360" width="22" height="130" fill="#8A5A3C" stroke={P.ink} strokeWidth="4" />
      <circle cx="107" cy="330" r="72" fill={GRASS} stroke={P.ink} strokeWidth="5" />
      <circle cx="80" cy="310" r="16" fill={GRASS_D} />
      <rect x="652" y="300" width="12" height="190" fill={P.ink} />
      <rect x="632" y="282" width="52" height="30" rx="10" fill={P.pop} stroke={P.ink} strokeWidth="4" />
      {[0, 1].map((i) => <Tiny key={i} x={md(t * 70 + i * 470, 900) - 70} y={560 + i * 30} s={0.32} ph={t * 9 + i} shirt={i ? P.hot : P.paper} P={P} />)}
      <Person x={380} y={640} s={1.05} who={who} map={1} t={t} talk={0.4} seed={who === 'cap' ? 0 : 1.7} P={P} />
    </g>
    <rect width="760" height="720" rx="30" fill="none" stroke={P.ink} strokeWidth="9" />
  </g>;
}

/* 1 — two near-identical street panels flicker; the person in the middle changes (cap → glasses) */
function SceneFlicker({ t, dur, P }) {
  const FL = 0.9, flick = t < 3.15;
  const phase = Math.floor(t / FL), inF = md(t, FL);
  const blank = flick && t > 0.1 && inF > FL - 0.11;
  const who = phase % 2 ? 'glasses' : 'cap';
  const k = E(t, 3.1, 3.6, 'enter');
  const ring = E(t, 3.4, 3.8, 'pop');
  const cam = { fx: 490, fy: 490, s: L(1, 1.05, E(t, 0, dur, 'draw')), px: 490, py: 490 };
  const a0 = { x: 110, y: 130, s: 1 };
  const A = { x: L(a0.x, 32, k), y: L(a0.y, 270, k), s: L(1, 0.58, k) };
  const B = { x: L(a0.x, 508, k), y: L(a0.y, 270, k), s: L(1, 0.58, k) };
  const ringG = (o) => ring > 0 && <g transform={`translate(384 320) scale(${ring}) rotate(${t * 40})`} opacity={o}>
    <circle r="92" fill="none" stroke={P.hot} strokeWidth="14" strokeDasharray="38 18" strokeLinecap="round" />
  </g>;
  return <g transform={camT(cam)}>
    <rect x="-100" y="-100" width="1180" height="1180" fill={P.cool} />
    <g transform={`rotate(${t * 6} 490 490)`}>
      {Array.from({ length: 12 }, (_, i) => <path key={i} d="M490,490 L1290,430 L1290,550 Z" fill={P.paper} opacity="0.18" transform={`rotate(${i * 30} 490 490)`} />)}
    </g>
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={hsh(i + 2) * 980} cy={hsh(i + 30) * 980} r={8 + hsh(i + 5) * 10}
      fill={i % 2 ? P.pop : P.hot} opacity={0.5 + 0.3 * Math.sin(t * 3 + i)} />)}
    {k <= 0
      ? <g transform={`translate(${a0.x} ${a0.y})`}>
          <StreetPanel id="flkMain" who={who} t={t} P={P} />
          {blank && <rect width="760" height="720" rx="30" fill={P.paper} stroke={P.ink} strokeWidth="9" />}
          <g opacity={blank ? 0 : 1}><StoryTag x={60} y={50} text={who === 'cap' ? 'A' : 'B'} size={40} /></g>
        </g>
      : <g>
          <g transform={`translate(${A.x} ${A.y}) scale(${A.s})`}>
            <StreetPanel id="flkA" who="cap" t={t} P={P} />{ringG(1)}
            <StoryTag x={60} y={50} text="A" size={56} />
          </g>
          <g transform={`translate(${B.x} ${B.y}) scale(${B.s})`}>
            <StreetPanel id="flkB" who="glasses" t={t} P={P} />{ringG(1)}
            <StoryTag x={60} y={50} text="B" size={56} />
          </g>
          {ring > 0 && <g transform={`translate(490 ${200 + 8 * Math.sin(t * 5)}) scale(${ring})`}>
            <circle r="62" fill={P.pop} stroke={P.ink} strokeWidth="7" />
            <text y="30" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="88" fill={P.ink}>?</text>
          </g>}
          <g transform={`translate(490 ${790 + 6 * Math.sin(t * 4)}) scale(${E(t, 3.7, 4.1, 'pop')})`}>
            <StoryTag x={0} y={0} text="SPOT THE CHANGE" size={44} />
          </g>
        </g>}
  </g>;
}

/* 2 — campus path: the stranger in a cap with a map stops a pedestrian; "1998" sign */
function SceneAsk({ t, dur, P }) {
  const cam = { fx: 500, fy: 640, s: L(1, 1.14, E(t, 2.6, dur, 'draw')), px: 490, py: 600 };
  const sx = kf(t, [[0.6, -140], [3.0, 400]], 'enter'), sWalk = win(t, 0.6, 2.9, 0.2);
  const px = kf(t, [[2.0, 1120], [4.4, 640]], 'enter'), pWalk = win(t, 2.0, 4.3, 0.2);
  const mapUp = E(t, 4.6, 5.0, 'pop') * (1 - 0.6 * E(t, 6.6, 7.0));
  const bub = E(t, 5.3, 5.7, 'pop');
  const point = E(t, 6.3, 6.8, 'pop');
  const sign = E(t, 0.1, 0.5, 'pop'), sw = Math.sin(t * 2.4) * 3;
  const tag = E(t, 0.8, 1.2, 'pop');
  return <g transform={camT(cam)}>
    <rect x="-200" y="-200" width="1380" height="1380" fill={P.cool} />
    {[0, 1, 2].map((i) => { const cx = md(100 + t * 18 + i * 360, 1200) - 120; return <g key={i}>
      <ellipse cx={cx} cy={90 + (i % 2) * 60} rx="70" ry="24" fill={P.paper} /><ellipse cx={cx + 30} cy={76 + (i % 2) * 60} rx="40" ry="26" fill={P.paper} /></g>; })}
    {/* campus hall */}
    <g>
      <rect x="250" y="230" width="500" height="230" fill={P.paper} stroke={P.ink} strokeWidth="6" />
      <polygon points="230,232 500,120 770,232" fill={P.hot} stroke={P.ink} strokeWidth="6" strokeLinejoin="round" />
      <circle cx="500" cy="188" r="30" fill={P.paper} stroke={P.ink} strokeWidth="5" />
      <path d={`M500,188 L500,168 M500,188 L${500 + 14 * Math.cos(t * 2)},${188 + 14 * Math.sin(t * 2)}`} stroke={P.ink} strokeWidth="4" strokeLinecap="round" />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={282 + i * 80} y="252" width="34" height="200" fill={P.soft} stroke={P.ink} strokeWidth="4" />)}
      <rect x="455" y="370" width="90" height="90" rx="8" fill={P.accentDark} stroke={P.ink} strokeWidth="5" />
    </g>
    <rect x="-200" y="450" width="1380" height="800" fill={GRASS} />
    <path d="M440,452 L560,452 Q620,640 900,1200 L60,1200 Q360,640 440,452 Z" fill={SAND} stroke={P.ink} strokeWidth="5" />
    {[[90, 420, 70], [870, 410, 80], [-10, 520, 90], [990, 540, 90]].map(([x, y, r], i) => <g key={i} transform={`rotate(${Math.sin(t * 1.5 + i) * 2} ${x} ${y + r})`}>
      <rect x={x - 10} y={y} width="20" height={r + 40} fill="#8A5A3C" stroke={P.ink} strokeWidth="4" />
      <circle cx={x} cy={y} r={r} fill={i % 2 ? GRASS_D : GRASS} stroke={P.ink} strokeWidth="5" /></g>)}
    {/* 1998 sign */}
    <g transform={`translate(150 860) rotate(${sw}) scale(${sign})`}>
      <rect x="-10" y="-230" width="20" height="230" fill="#8A5A3C" stroke={P.ink} strokeWidth="4" />
      <rect x="-110" y="-300" width="220" height="100" rx="18" fill={P.pop} stroke={P.ink} strokeWidth="7" />
      <text x="0" y="-222" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="74" fill={P.ink}>1998</text>
    </g>
    {tag > 0 && <g transform={sc(500, 60, tag)}><StoryTag x={500} y={60} text="SIMONS & LEVIN" size={38} /></g>}
    <Person x={px} y={830} s={1} dir={-1} who="ped" ph={t * 9} walk={pWalk} t={t} talk={win(t, 6.4, dur, 0.2) * 0.8} point={point} seed={2} P={P} />
    <Person x={sx} y={840} s={1} dir={1} who="cap" ph={t * 9} walk={sWalk} t={t} map={1} mapUp={mapUp} talk={win(t, 4.8, 6.5, 0.2)} P={P} />
    {bub > 0 && <g transform={`translate(${sx + 40} ${370 + 5 * Math.sin(t * 4)}) scale(${bub})`}>
      <path d="M-90,-60 L90,-60 Q110,-60 110,-40 L110,30 Q110,50 90,50 L10,50 L-20,86 L-20,50 L-90,50 Q-110,50 -110,30 L-110,-40 Q-110,-60 -90,-60 Z" fill={P.paper} stroke={P.ink} strokeWidth="6" strokeLinejoin="round" />
      <g transform="translate(-40 -5) scale(0.7)"><MapProp P={P} /></g>
      <text x="55" y="26" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="80" fill={P.hot} stroke={P.ink} strokeWidth="3" paintOrder="stroke">?</text>
    </g>}
  </g>;
}

/* 3 — two workers carry a big door between them; behind it the cap stranger becomes the glasses stranger */
function SceneDoor({ t, dur, beats, P }) {
  const b1 = beats[1] ?? 3.5;
  const G = 860, SX = 360;
  const doorX = kf(t, [[0.2, -280], [1.4, 330], [b1 + 0.3, 380], [b1 + 1.0, 410], [b1 + 1.9, 1320]], 'draw');
  const swp = E(t, b1 + 0.35, b1 + 1.0, 'draw');
  const capX = L(SX, doorX - 75, swp), glX = L(doorX - 75, SX, swp);
  const reveal = E(t, b1 + 2.0, b1 + 2.4, 'pop');
  const sh = t > 1.4 ? 7 * Math.sin((t - 1.4) * 40) * Math.exp(-(t - 1.4) * 5) : 0;
  const cam = { fx: 500, fy: 600, s: L(1, 1.07, E(t, 0, dur, 'draw')), px: 490 + sh, py: 590 };
  const ph = doorX * 0.055;
  const DW = 290, DH = 480, DT = G - 30 - DH;
  const dl = doorX - DW / 2;
  const bubArr = Math.floor(t / 0.8) % 3;
  return <g transform={camT(cam)}>
    <rect x="-200" y="-200" width="1380" height="1380" fill={P.cool} />
    {/* brick campus wall */}
    <rect x="-200" y="250" width="1380" height="620" fill="#FFB3A1" />
    {Array.from({ length: 9 }, (_, r) => Array.from({ length: 13 }, (_, c) =>
      <rect key={`${r}-${c}`} x={-200 + c * 110 + (r % 2) * 55} y={262 + r * 50} width="96" height="38" rx="4" fill={P.hot} opacity={0.25 + 0.2 * hsh(r * 13 + c)} />))}
    {[160, 820].map((wx, i) => <g key={i}>
      <rect x={wx - 80} y="300" width="160" height="190" rx="12" fill={P.cool} stroke={P.ink} strokeWidth="6" />
      <path d={`M${wx},300 L${wx},490 M${wx - 80},395 L${wx + 80},395`} stroke={P.ink} strokeWidth="5" />
      <path d={`M${wx - 60},330 L${wx - 30},300`} stroke={P.paper} strokeWidth="6" opacity="0.7" /></g>)}
    <rect x="-200" y={G - 10} width="1380" height="400" fill={WALK} stroke={P.ink} strokeWidth="5" />
    {/* pedestrian keeps giving directions, unaware */}
    <Person x={650} y={G} s={1.1} dir={-1} who="ped" t={t} talk={0.9} point={E(t, 0.3, 0.8, 'pop') * (0.75 + 0.25 * Math.sin(t * 3))} seed={2} P={P} />
    <g transform={`translate(${745} ${300 + 6 * Math.sin(t * 3.4)})`}>
      <path d="M-80,-55 L80,-55 Q100,-55 100,-35 L100,30 Q100,50 80,50 L-20,50 L-50,82 L-44,50 L-80,50 Q-100,50 -100,30 L-100,-35 Q-100,-55 -80,-55 Z" fill={P.paper} stroke={P.ink} strokeWidth="6" strokeLinejoin="round" />
      <g transform={`rotate(${[0, -90, 180][bubArr]})`}>
        <path d="M-40,0 L32,0 M10,-24 L36,0 L10,24" fill="none" stroke={P.hot} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
    {/* the strangers and the hidden carriers (behind the door) */}
    <Person x={glX} y={G} s={1.1} dir={1} who="glasses" t={t} ph={ph} walk={1 - swp} map={swp > 0.5 ? 1 : 0} talk={swp * 0.5} seed={1.7} P={P} />
    <Person x={capX} y={G} s={1.1} dir={1} who="cap" t={t} ph={ph} walk={swp} map={swp < 0.5 ? 1 : 0} talk={0.5 * (1 - swp)} P={P} />
    <Person x={doorX + 75} y={G} s={1.1} dir={1} who="worker" t={t} ph={ph + 1.6} walk={1} P={P} />
    {/* the door, with a window you can peek through */}
    <g transform={`rotate(${Math.sin(ph) * 1.2} ${doorX} ${DT + DH})`}>
      <path d={`M${dl},${DT} h${DW} v${DH} h${-DW} Z M${doorX - 75},${DT + 60} v120 h150 v-120 Z`} fillRule="evenodd" fill={P.pop} stroke={P.ink} strokeWidth="8" strokeLinejoin="round" />
      <rect x={doorX - 75} y={DT + 60} width="150" height="120" fill={P.cool} opacity="0.3" stroke={P.ink} strokeWidth="6" />
      <path d={`M${doorX - 55},${DT + 150} L${doorX - 10},${DT + 80} M${doorX - 30},${DT + 165} L${doorX + 5},${DT + 112}`} stroke={P.paper} strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <rect x={dl + 36} y={DT + 220} width={DW - 72} height="90" rx="10" fill="#F2B92E" stroke={P.ink} strokeWidth="5" />
      <rect x={dl + 36} y={DT + 330} width={DW - 72} height="110" rx="10" fill="#F2B92E" stroke={P.ink} strokeWidth="5" />
      <circle cx={dl + DW - 30} cy={DT + 270} r="13" fill={P.hot} stroke={P.ink} strokeWidth="5" />
      <circle cx={dl - 4} cy={DT + 290} r="14" fill={P.skin} stroke={P.ink} strokeWidth="4" />
      <circle cx={dl + DW + 4} cy={DT + 300} r="14" fill={P.skin} stroke={P.ink} strokeWidth="4" />
    </g>
    {/* motion lines while it slides */}
    {[0, 1, 2].map((i) => <path key={i} d={`M${dl - 40 - i * 18},${DT + 80 + i * 130} l${-90 + i * 20},0`} stroke={P.ink} strokeWidth="7" strokeLinecap="round"
      opacity={0.5 * (win(t, 0.3, 1.3, 0.15) + win(t, b1 + 1.1, b1 + 1.8, 0.15))} />)}
    {/* reveal: a new face, and nobody noticed */}
    {reveal > 0 && <g>
      <g transform={`translate(${SX + 5} ${G - 330}) scale(${reveal}) rotate(${t * 50})`}>
        <circle r="92" fill="none" stroke={P.hot} strokeWidth="13" strokeDasharray="36 18" strokeLinecap="round" />
      </g>
      <g transform={`translate(${SX - 30} ${G - 470}) rotate(-8) scale(${reveal})`}>
        <polygon points={burst(52, 84, 10)} fill={P.pop} stroke={P.ink} strokeWidth="6" strokeLinejoin="round" />
        <text y="26" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="72" fill={P.ink}>!</text>
      </g>
      <StoryTag x={SX + 5} y={G + 60} text="NEW PERSON" size={36} o={E(t, b1 + 2.2, b1 + 2.6)} />
    </g>}
  </g>;
}

/* little figure icon centred on its middle */
function Fig({ x, y, s = 1, fill, P }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-38,58 L-38,20 Q-38,-8 -10,-8 L10,-8 Q38,-8 38,20 L38,58 Z" fill={fill} stroke={P.ink} strokeWidth="6" strokeLinejoin="round" />
    <circle cx="0" cy="-34" r="22" fill={P.skin} stroke={P.ink} strokeWidth="6" />
  </g>;
}

/* 4 — 15 figures: 8 coral with "?" (didn't notice), 7 with "!" */
const MISSED = [0, 2, 3, 6, 8, 9, 11, 13];
function SceneStat({ t, dur, P }) {
  const cam = { fx: 490, fy: 470, s: L(1, 1.04, E(t, 0, dur, 'draw')), px: 490, py: 480 };
  const tally = E(t, 2.4, 2.8, 'pop');
  return <g transform={camT(cam)}>
    <rect x="-100" y="-100" width="1180" height="1180" fill={P.paper} />
    {Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, j) =>
      <circle key={`${i}-${j}`} cx={50 + i * 98} cy={50 + j * 98} r="5" fill={P.cool} opacity="0.6" />))}
    {Array.from({ length: 15 }, (_, k) => {
      const c = k % 5, r = Math.floor(k / 5);
      const x = 170 + c * 160, y = 200 + r * 210;
      const p = E(t, 0.1 + k * 0.07, 0.45 + k * 0.07, 'pop');
      const mi = MISSED.indexOf(k), missed = mi >= 0;
      const hk = missed ? E(t, 1.3 + mi * 0.11, 1.6 + mi * 0.11, 'pop') : E(t, 2.15, 2.45, 'pop');
      const bob = Math.sin(t * 4 + k) * 4 * p;
      const fill = missed && hk > 0.3 ? P.hot : hk > 0.3 ? P.pop : P.cool;
      return p > 0 && <g key={k} transform={sc(x, y, p)}>
        <Fig x={x} y={y + bob} s={1.2} fill={fill} P={P} />
        {hk > 0 && <g transform={`translate(${x + 46} ${y - 64 + bob}) scale(${hk}) rotate(${missed ? -10 : 8})`}>
          <circle r="28" fill={missed ? P.paper : P.ink} stroke={P.ink} strokeWidth="5" />
          <text y="15" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="44" fill={missed ? P.hot : P.pop}>{missed ? '?' : '!'}</text>
        </g>}
      </g>;
    })}
    {tally > 0 && <g transform={`translate(490 860) scale(${tally})`}>
      <rect x="-380" y="-52" width="360" height="104" rx="52" fill={P.hot} stroke={P.ink} strokeWidth="7" />
      <text x="-200" y="20" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="54" fill={P.paper}>8 ? missed</text>
      <rect x="20" y="-52" width="360" height="104" rx="52" fill={P.pop} stroke={P.ink} strokeWidth="7" />
      <text x="200" y="20" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="54" fill={P.ink}>7 ! saw it</text>
    </g>}
  </g>;
}

/* 5 — a thought bubble keeps only three icons (a guy, a map, a ?) while detail fades; then CHANGE BLINDNESS */
function SceneGist({ t, dur, beats, P }) {
  const b1 = beats[1] ?? 7.2;
  const cam = { fx: 490, fy: 470, s: L(1.06, 1, E(t, 0, b1, 'draw')) * (1 + 0.04 * E(t, b1, dur, 'draw')), px: 490, py: 470 };
  const BX = 560, BY = 360;
  const fade = E(t, 1.8, 3.4, 'draw');
  const strike = E(t, 0.5, 1.1, 'draw'), stupidO = win(t, 0.2, 1.9, 0.25);
  const ic = [3.6, 4.2, 4.8].map((a) => E(t, a, a + 0.35, 'pop'));
  const swap = t > b1 - 0.3 && md(t, 0.5) > 0.25; // the guy icon flickers cap/glasses — nobody minds
  const title = E(t, b1 + 0.1, b1 + 0.5, 'pop');
  const shrink = L(1, 0.8, E(t, b1, b1 + 0.4));
  return <g transform={camT(cam)}>
    <rect x="-100" y="-100" width="1180" height="1180" fill={P.cool} />
    <g transform={`rotate(${-t * 5} ${BX} ${BY})`}>
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${BX},${BY} L${BX + 900},${BY - 70} L${BX + 900},${BY + 70} Z`} fill={P.paper} opacity="0.16" transform={`rotate(${i * 30} ${BX} ${BY})`} />)}
    </g>
    <StoryBust x={210} y={1030} s={1.25} look={[0.8, -0.9]} brow={0.3} lid={md(t, 3.2) < 0.12 ? 0.9 : 0} smile={L(0.2, 0.7, E(t, b1, b1 + 0.5))} tilt={3 * Math.sin(t * 1.2)} />
    {[[300, 700, 18], [350, 640, 26], [410, 575, 34]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y + 4 * Math.sin(t * 3 + i)} r={r * E(t, 0.1 + i * 0.1, 0.4 + i * 0.1, 'pop')} fill={P.paper} stroke={P.ink} strokeWidth="6" />)}
    <g transform={sc(BX, BY, E(t, 0.3, 0.8, 'pop') * shrink)}>
      <path d={`M${BX - 330},${BY} ${Array.from({ length: 12 }, (_, i) => {
        const a0 = (i / 12) * Math.PI * 2, a1 = ((i + 1) / 12) * Math.PI * 2, am = (a0 + a1) / 2;
        return `Q${(BX + Math.cos(am + Math.PI) * 400).toFixed(1)},${(BY + Math.sin(am + Math.PI) * 300).toFixed(1)} ${(BX + Math.cos(a1 + Math.PI) * 330).toFixed(1)},${(BY + Math.sin(a1 + Math.PI) * 250).toFixed(1)}`;
      }).join(' ')} Z`} fill={P.paper} stroke={P.ink} strokeWidth="8" strokeLinejoin="round" />
      {/* the full, detailed scene — fading away */}
      <g opacity={1 - fade}>
        {Array.from({ length: 26 }, (_, i) => {
          const x = BX - 260 + hsh(i + 1) * 520, y = BY - 180 + hsh(i + 50) * 360;
          const dr = fade * (120 + 160 * hsh(i + 9));
          const c = [P.hot, P.pop, GRASS, P.cool, P.accentDark][i % 5];
          const kind = i % 3;
          return <g key={i} transform={`translate(${x + (hsh(i + 3) - 0.5) * dr} ${y - dr}) rotate(${fade * 200 * (hsh(i + 7) - 0.5)})`}>
            {kind === 0 ? <rect x="-16" y="-16" width="32" height="32" rx="6" fill={c} stroke={P.ink} strokeWidth="4" />
              : kind === 1 ? <circle r="16" fill={c} stroke={P.ink} strokeWidth="4" />
              : <polygon points="0,-20 18,14 -18,14" fill={c} stroke={P.ink} strokeWidth="4" strokeLinejoin="round" />}
          </g>;
        })}
        <g transform={`translate(${BX} ${BY + 170 - fade * 60}) scale(0.62)`}><Person x={0} y={0} who="cap" map={1} t={t} P={P} /></g>
      </g>
      {/* only the gist survives */}
      {ic[0] > 0 && <g transform={sc(BX - 200, BY + 10, ic[0])}>
        <circle cx={BX - 200} cy={BY + 10} r="92" fill={P.cool} stroke={P.ink} strokeWidth="6" />
        <Fig x={BX - 200} y={BY + 20} s={1.3} fill={swap ? '#35B67F' : '#3E7BE6'} P={P} />
        {swap
          ? <g><circle cx={BX - 208} cy={BY - 25} r="9" fill="none" stroke={P.ink} strokeWidth="4" /><circle cx={BX - 186} cy={BY - 25} r="9" fill="none" stroke={P.ink} strokeWidth="4" /></g>
          : <path d={`M${BX - 228},${BY - 40} Q${BX - 200},${BY - 86} ${BX - 172},${BY - 40} Z M${BX - 200},${BY - 46} L${BX - 150},${BY - 42}`} fill={P.hot} stroke={P.ink} strokeWidth="5" strokeLinejoin="round" />}
      </g>}
      {ic[1] > 0 && <g transform={`translate(${BX} ${BY + 10}) scale(${ic[1] * 1.4}) rotate(${4 * Math.sin(t * 2)})`}><MapProp P={P} /></g>}
      {ic[2] > 0 && <g transform={sc(BX + 200, BY + 10, ic[2])}>
        <circle cx={BX + 200} cy={BY + 10} r="92" fill={P.pop} stroke={P.ink} strokeWidth="6" />
        <text x={BX + 200} y={BY + 52} textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="130" fill={P.ink}>?</text>
      </g>}
    </g>
    {/* "stupid?" — crossed out */}
    {stupidO > 0 && <g opacity={stupidO} transform={`translate(760 760) rotate(-6) scale(${E(t, 0.2, 0.5, 'pop')})`}>
      <rect x="-150" y="-50" width="300" height="100" rx="20" fill={P.paper} stroke={P.ink} strokeWidth="7" />
      <text y="22" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="64" fill={P.ink}>stupid?</text>
      <path d="M-130,30 L130,-30" stroke={P.hot} strokeWidth="14" strokeLinecap="round" strokeDasharray="270" strokeDashoffset={270 * (1 - strike)} />
    </g>}
    {title > 0 && <g transform={`translate(560 790) rotate(-4) scale(${title})`}>
      <polygon points={burst(150, 205, 16)} fill={P.pop} stroke={P.ink} strokeWidth="7" strokeLinejoin="round" transform={`scale(2.1 0.9) rotate(${t * 10})`} />
      <rect x="-380" y="-78" width="760" height="156" rx="30" fill={P.hot} stroke={P.ink} strokeWidth="8" />
      <text y="-4" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="72" fill={P.paper} letterSpacing="3">CHANGE</text>
      <text y="62" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="72" fill={P.paper} letterSpacing="3">BLINDNESS</text>
    </g>}
  </g>;
}

/* 6 — a magnifier passes over a name tag, a number and a face, ticking each; check twice; follow */
function Cards({ P, t }) {
  return <g>
    <g transform="translate(190 520) rotate(-4)">
      <rect x="-125" y="-150" width="250" height="300" rx="22" fill={P.paper} stroke={P.ink} strokeWidth="7" />
      <path d="M-125,-128 Q-125,-150 -103,-150 L103,-150 Q125,-150 125,-128 L125,-50 L-125,-50 Z" fill={P.hot} stroke={P.ink} strokeWidth="7" />
      <text y="-104" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="40" fill={P.paper}>HELLO</text>
      <text y="-66" textAnchor="middle" fontFamily={BODYF} fontWeight="800" fontSize="22" fill={P.paper}>my name is</text>
      <text y="40" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="72" fill={P.ink}>Dan</text>
      <path d="M-80,80 L80,80" stroke={P.ink} strokeWidth="4" opacity="0.3" />
    </g>
    <g transform="translate(490 520) rotate(2)">
      <rect x="-125" y="-150" width="250" height="300" rx="22" fill={P.pop} stroke={P.ink} strokeWidth="7" />
      <text y="-60" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="38" fill={P.ink}>#</text>
      <text y="20" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="66" fill={P.ink}>555-</text>
      <text y="86" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="66" fill={P.ink}>0142</text>
    </g>
    <g transform="translate(790 520) rotate(-2)">
      <rect x="-125" y="-150" width="250" height="300" rx="22" fill={P.cool} stroke={P.ink} strokeWidth="7" />
      <g transform="translate(0 140) scale(0.62)"><Person x={0} y={0} who="glasses" t={t} seed={1.7} P={P} /></g>
      <rect x="-125" y="-150" width="250" height="300" rx="22" fill="none" stroke={P.ink} strokeWidth="7" />
    </g>
  </g>;
}
function Tick({ x, y, k, k2 = 0, P }) {
  const dash = (kk) => ({ strokeDasharray: 140, strokeDashoffset: 140 * (1 - kk) });
  return k > 0 && <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * E(k, 0, 0.5, 'pop')})`}>
    <circle r="46" fill={P.paper} stroke={P.ink} strokeWidth="6" />
    <path d="M-24,0 L-6,18 L24,-16" fill="none" stroke="#22B04B" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" {...dash(k)} />
    {k2 > 0 && <path d="M-14,14 L4,32 L34,-2" fill="none" stroke="#22B04B" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" {...dash(k2)} transform="translate(4 -14)" />}
  </g>;
}
function SceneOutro({ t, dur, P }) {
  const cam = { fx: 490, fy: 520, s: L(1, 1.06, E(t, 0, dur, 'draw')), px: 490, py: 510 };
  const mx = kf(t, [[0, -150], [0.6, 190], [1.0, 190], [1.3, 490], [1.7, 490], [2.0, 790], [2.5, 790], [2.9, 190], [3.2, 490], [3.5, 790], [4.4, 490]], 'draw');
  const my = kf(t, [[0, 520], [3.5, 520], [4.4, 230]], 'draw') + 10 * Math.sin(t * 3);
  const pass1 = [E(t, 0.8, 1.2), E(t, 1.5, 1.9), E(t, 2.2, 2.6)];
  const pass2 = [E(t, 2.9, 3.15), E(t, 3.2, 3.45), E(t, 3.45, 3.7)];
  const glow = win(t, 3.6, 4.4, 0.15);
  const eye = E(t, 4.4, 4.8, 'pop');
  const blinkE = md(t, 1.6) < 0.14 ? 0.15 : 1;
  const fol = E(t, 5.0, 5.4, 'pop');
  const R = 92;
  return <g transform={camT(cam)}>
    <rect x="-100" y="-100" width="1180" height="1180" fill={P.soft} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 130 - 60} y="-100" width="56" height="1200" fill={P.pop} opacity="0.22" transform="skewX(-14)" />)}
    <circle cx="490" cy="520" r={420 + 30 * glow} fill={P.pop} opacity={0.25 * glow} />
    <Cards P={P} t={t} />
    {[190, 490, 790].map((x, i) => <Tick key={i} x={x + 118} y={362} k={pass1[i]} k2={pass2[i]} P={P} />)}
    {/* the magnifier: the lens shows what's under it, bigger */}
    <g transform={`rotate(${-12 + 6 * Math.sin(t * 2)} ${mx} ${my})`}>
      <clipPath id="outLens"><circle cx={mx} cy={my} r={R} /></clipPath>
      <rect x={mx + R * 0.62} y={my + R * 0.62} width="34" height="150" rx="16" fill={P.accentDark} stroke={P.ink} strokeWidth="7" transform={`rotate(-45 ${mx + R * 0.62} ${my + R * 0.62})`} />
      <circle cx={mx} cy={my} r={R} fill={P.paper} />
      <g clipPath="url(#outLens)">
        <g transform={sc(mx, my, 1.6)}><rect x="-100" y="-100" width="1180" height="1180" fill={P.soft} /><Cards P={P} t={t} /></g>
        {eye > 0 && <g transform={sc(mx, my, eye)}>
          <circle cx={mx} cy={my} r={R} fill={P.paper} />
          <ellipse cx={mx} cy={my} rx="66" ry={38 * blinkE} fill={P.paper} stroke={P.ink} strokeWidth="7" />
          {blinkE > 0.5 && <circle cx={mx + 6 * Math.sin(t * 2)} cy={my} r="22" fill={P.hot} stroke={P.ink} strokeWidth="5" />}
          {blinkE > 0.5 && <circle cx={mx + 6 * Math.sin(t * 2)} cy={my} r="9" fill={P.ink} />}
        </g>}
        <path d={`M${mx - 60},${my - 30} Q${mx - 40},${my - 70} ${mx},${my - 76}`} fill="none" stroke={P.paper} strokeWidth="10" strokeLinecap="round" opacity="0.8" />
      </g>
      <circle cx={mx} cy={my} r={R} fill="none" stroke={P.ink} strokeWidth="14" />
      <circle cx={mx} cy={my} r={R - 9} fill="none" stroke={P.cool} strokeWidth="5" />
    </g>
    {fol > 0 && <g transform={`translate(490 860) scale(${fol}) rotate(${-3 + 2 * Math.sin(t * 3)})`}>
      <rect x="-230" y="-56" width="460" height="112" rx="56" fill={P.hot} stroke={P.ink} strokeWidth="8" />
      <text y="22" textAnchor="middle" fontFamily={HEADF} fontWeight="700" fontSize="60" fill={P.paper}>FOLLOW</text>
    </g>}
  </g>;
}

Object.assign(window, { SceneFlicker, SceneAsk, SceneDoor, SceneStat, SceneGist, SceneOutro });
