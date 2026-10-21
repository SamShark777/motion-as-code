// art.jsx — scene illustrations for "Walk Longer" (Houston airport bags, Maister 1985). Pure functions of T.
const MOTION = {
  pop: Easing.easeOutBack,     // card pop on every hard cut
  push: Easing.easeInOutSine,  // slow push-in during a scene
  enter: Easing.easeOutCubic,  // illustration beats
};
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => MOTION.enter(clamp((t - s) / d, 0, 1));

function Eye({ cx, cy, T, ph = 0, rx = 24, ry = 22, look = 0 }) {
  const b = blink(T, ph);
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" />
      <circle cx={cx + look} cy={cy + 2} r={11 * Math.min(1, b * 1.6)} fill={INK} />
    </g>
  );
}

const SKINS = [SKIN, '#8A5A3C', '#E0AC86', '#5E3B26', '#F6D2B4'];
const FONT = { fontFamily: 'Montserrat, sans-serif', fontWeight: 900 };

/* shared — a standing person, head centred at (0,0) before translate; mood: smile | angry | calm */
function WtPerson({ x, y, T, ph = 0, s = 1, shirt = '#B3202A', skin = SKIN, hair = INK, mood = 'smile', look = 0, legs = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1="-30" y1="300" x2={-30 - legs} y2="470" stroke={INK} strokeWidth="46" strokeLinecap="round" />
      <line x1="30" y1="300" x2={30 + legs} y2="470" stroke={INK} strokeWidth="46" strokeLinecap="round" />
      <rect x="-80" y="105" width="160" height="230" rx="64" fill={shirt} />
      <ellipse cx="0" cy="0" rx="82" ry="92" fill={skin} />
      <path d="M-84 -8 C-90 -80 -40 -98 0 -98 C56 -98 92 -74 84 -14 C60 -48 30 -54 0 -52 C-36 -54 -66 -38 -84 -8 Z" fill={hair} />
      {mood === 'angry' && <g>
        <line x1="-50" y1="-34" x2="-12" y2="-20" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <line x1="12" y1="-20" x2="50" y2="-34" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      </g>}
      {mood === 'calm'
        ? <g>
          <path d="M-46 4 q16 -14 32 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
          <path d="M14 4 q16 -14 32 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        </g>
        : <g>
          <Eye cx={-30} cy={4} T={T} ph={ph} rx={15} ry={15} look={look} />
          <Eye cx={30} cy={4} T={T} ph={ph} rx={15} ry={15} look={look} />
        </g>}
      {mood === 'angry'
        ? <path d="M-24 52 q24 -16 48 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        : <path d="M-26 42 q26 24 52 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      <ellipse cx="-52" cy="36" rx="16" ry="8" fill="#E8907A" opacity=".55" />
      <ellipse cx="52" cy="36" rx="16" ry="8" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — an angry speech bubble that pops in at `at` and wobbles */
function WtBubble({ x, y, T, t, at = 0, text = '#@!', fill = CREAM, ink = '#B3202A', s = 1 }) {
  const p = clamp((t - at) / 0.35, 0, 1);
  const sc = s * Easing.easeOutBack(p) * (1 + 0.04 * osc(T, 0.4, x));
  return (
    <g transform={`translate(${x} ${y}) rotate(${osc(T, 0.9, y) * 5}) scale(${sc})`} opacity={p > 0 ? 1 : 0}>
      <rect x="-95" y="-60" width="190" height="110" rx="40" fill={fill} />
      <path d="M-30 46 L-56 90 L4 48 Z" fill={fill} />
      <text y="18" textAnchor="middle" {...FONT} fontSize="54" fill={ink}>{text}</text>
    </g>
  );
}

/* shared — a suitcase */
function WtBag({ x, y, c = '#E07A2E', w = 120, h = 90, r = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x={-w / 2 + 26} y={-h / 2 - 22} width={w - 52} height="30" rx="12" fill="none" stroke={INK} strokeWidth="9" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="16" fill={c} />
      <rect x={-w / 2} y="-6" width={w} height="12" fill={INK} opacity=".25" />
    </g>
  );
}

/* 1 — happy traveller striding down a very long corridor */
function ArtWtAirport({ T, t }) {
  const step = osc(T, 0.7);
  const bob = -Math.abs(step) * 12;
  const scroll = (T * 260) % 240;
  return (
    <g>
      <circle cx="486" cy="1200" r="440" fill="#2C4F92" />
      <path d="M0 1520 L972 1520 L972 1728 L0 1728 Z" fill="#17305E" />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={k} x={k * 240 - scroll} y="1580" width="140" height="18" rx="9" fill="#3E63A8" />
      ))}
      {[0, 1, 2, 3].map((k) => {
        const x = ((k * 330 - T * 180) % 1320 + 1320) % 1320 - 170;
        return (
          <g key={k} transform={`translate(${x} 820)`}>
            <rect width="150" height="64" rx="14" fill="#E8C547" />
            <text x="75" y="46" textAnchor="middle" {...FONT} fontSize="38" fill={INK}>{`B${12 + k * 7}`}</text>
          </g>
        );
      })}
      <path d="M720 760 l70 0 l-28 -28 M790 760 l-28 28" fill="none" stroke={CREAM} strokeWidth="10" strokeLinecap="round" opacity={tw(t, 0.4, 0.5)} />
      <g transform={`translate(0 ${bob})`}>
        <line x1="600" y1="1210" x2="660" y2="1330" stroke="#1F3B73" strokeWidth="40" strokeLinecap="round" />
        <line x1="660" y1="1330" x2="660" y2="1430" stroke={INK} strokeWidth="10" />
        <WtBag x={660} y={1480} c="#B3202A" w={110} h={130} />
        <WtPerson x={486} y={1010} T={T} shirt="#E8C547" skin={SKINS[2]} hair="#3A1A14" legs={step * 40} look={10} />
      </g>
      {[0, 1].map((k) => (
        <circle key={k} cx={700 + k * 40} cy={1560 - bob} r="20" fill={INK} />
      ))}
      <g transform={`translate(230 1120) scale(${Easing.easeOutBack(clamp((t - 2.2) / 0.4, 0, 1))})`}>
        <rect x="-130" y="-56" width="260" height="112" rx="56" fill={CREAM} />
        <text y="22" textAnchor="middle" {...FONT} fontSize="58" fill="#1F3B73">+LONGER</text>
      </g>
    </g>
  );
}

/* 2 — empty carousel turning, impatient passengers tapping feet */
function ArtWtCarousel({ T, t }) {
  const off = (T * 120) % 90;
  const folks = [[170, '#1F3B73', 0, 0], [380, '#2B6E7A', 1, 0.3], [600, '#6A3FA0', 3, 0.7], [810, '#E07A2E', 4, 1.1]];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#D8D0BE" />
      {folks.map(([x, c, sk, ph], i) => (
        <g key={i}>
          <WtPerson x={x} y={1000 + (i % 2) * 20} s={0.62} T={T} ph={ph} shirt={c} skin={SKINS[sk]} mood="angry" look={osc(T, 2, ph) * 6} />
          <ellipse cx={x + 22} cy={1300 + (i % 2) * 12 - Math.max(0, osc(T, 0.3, ph)) * 14} rx="26" ry="12" fill={INK} />
        </g>
      ))}
      <rect x="40" y="1400" width="892" height="170" rx="85" fill="#7A7F8C" />
      <rect x="80" y="1430" width="812" height="110" rx="55" fill="#565B66" />
      {Array.from({ length: 11 }, (_, k) => (
        <line key={k} x1={80 + k * 90 + off} y1="1432" x2={80 + k * 90 + off} y2="1538" stroke="#3D414A" strokeWidth="8" opacity={80 + k * 90 + off < 880 ? 1 : 0} />
      ))}
      <rect x="380" y="1580" width="212" height="120" rx="12" fill="#3D414A" />
      <path d="M380 1580 h212 v30 h-212 Z" fill={INK} />
      {[0, 1, 2].map((k) => <rect key={k} x={392 + k * 70} y="1612" width="56" height="88" fill={INK} opacity=".55" transform={`skewX(${osc(T, 1.2, k) * 3})`} />)}
      <WtBubble x={250} y={830} T={T} t={t} at={1.2} text="#@!" />
      <WtBubble x={720} y={810} T={T} t={t} at={2.0} text="BAGS?" s={0.9} />
      <WtBubble x={490} y={760} T={T} t={t} at={2.8} text="!!!" fill="#B3202A" ink={CREAM} s={0.8} />
    </g>
  );
}

/* 3 — handlers toss bags fast, clock says 8 min, complaints keep popping */
function ArtWtHandlers({ T, t }) {
  const toss = (T % 0.9) / 0.9;
  const arm = osc(T, 0.9) * 30;
  const mins = Math.round(20 - 12 * tw(t, 0.8, 1.6));
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#8E151D" />
      <g transform="translate(486 830)">
        <circle r="120" fill={CREAM} />
        <circle r="96" fill="#fff" />
        <line x1="0" y1="0" x2="0" y2="-62" stroke={INK} strokeWidth="12" strokeLinecap="round" transform={`rotate(${T * 200})`} />
        <circle r="10" fill={INK} />
        <g transform="translate(0 175)">
          <rect x="-110" y="-46" width="220" height="80" rx="40" fill="#E8C547" />
          <text y="18" textAnchor="middle" {...FONT} fontSize="50" fill={INK}>{`${mins} MIN`}</text>
        </g>
      </g>
      {[[230, SKINS[1], 0], [742, SKINS[0], 0.45]].map(([x, sk, ph], i) => (
        <g key={i}>
          <line x1={x + (i ? -60 : 60)} y1="1360" x2={x + (i ? -150 : 150) } y2={1250 - arm * (i ? -1 : 1)} stroke="#E07A2E" strokeWidth="40" strokeLinecap="round" />
          <WtPerson x={x} y={1240} s={0.8} T={T} ph={ph} shirt="#E07A2E" skin={sk} legs={10} look={i ? -8 : 8} />
          <rect x={x - 70} y="1155" width="140" height="40" rx="18" fill="#E8C547" />
        </g>
      ))}
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.3) % 0.9) / 0.9;
        const x = 320 + p * 330, y = 1260 - Math.sin(p * Math.PI) * 260;
        return <WtBag key={k} x={x} y={y} r={p * 360} c={['#1F3B73', '#2B6E7A', '#6A3FA0'][k]} w={90} h={66} />;
      })}
      <rect x="0" y="1640" width="972" height="88" fill="#6E1016" />
      <WtBubble x={160} y={980} T={T} t={t} at={2.6} text="#@!" s={0.8} />
      <WtBubble x={820} y={990} T={T} t={t} at={3.1} text="STILL!" s={0.8} />
      <WtBubble x={486} y={1500} T={T} t={t} at={3.6} text="!!!" fill="#E8C547" ink={INK} s={0.75} />
    </g>
  );
}

/* 4 — top-down map: far gate, footprints marching a long route, ×6 */
function ArtWtWalk({ T, t }) {
  const route = [[150, 1620], [150, 1300], [820, 1300], [820, 1000], [200, 1000], [200, 780]];
  const seg = route.slice(1).map((p, i) => [route[i], p]);
  const lens = seg.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const total = lens.reduce((a, b) => a + b, 0);
  const prog = (t * 0.32 % 1.25) * total;
  const prints = [];
  let acc = 0;
  seg.forEach(([a, b], i) => {
    for (let d = 0; d < lens[i]; d += 70) {
      const g = acc + d;
      if (g > prog) continue;
      const f = d / lens[i], k = prints.length;
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + 90;
      const side = k % 2 ? 14 : -14;
      prints.push(<ellipse key={k} cx={a[0] + (b[0] - a[0]) * f} cy={a[1] + (b[1] - a[1]) * f} rx="13" ry="22" fill={INK} opacity=".8" transform={`rotate(${ang} ${a[0] + (b[0] - a[0]) * f} ${a[1] + (b[1] - a[1]) * f}) translate(${side} 0)`} />);
    }
    acc += lens[i];
  });
  const x6 = clamp((t - 2.2) / 0.4, 0, 1);
  return (
    <g>
      <circle cx="486" cy="1200" r="450" fill="#D2AF33" />
      <path d={'M' + route.map((p) => p.join(' ')).join(' L')} fill="none" stroke="#F2DE8C" strokeWidth="90" strokeLinejoin="round" strokeLinecap="round" />
      {prints}
      <g transform="translate(200 720)">
        <rect x="-90" y="-70" width="180" height="100" rx="20" fill="#1F3B73" />
        <text y="2" textAnchor="middle" {...FONT} fontSize="46" fill={CREAM}>GATE</text>
      </g>
      <g transform="translate(150 1660)">
        <circle r="48" fill="#B3202A" />
        <WtBag x={0} y={6} c={CREAM} w={50} h={38} />
      </g>
      <text x="300" y="1670" {...FONT} fontSize="40" fill={INK}>BAGS</text>
      <g transform={`translate(700 1560) rotate(${-8 + osc(T, 0.15) * (t > 2.2 && t < 2.8 ? 6 : 0)}) scale(${Easing.easeOutBack(x6)})`}>
        <rect x="-130" y="-90" width="260" height="170" rx="40" fill="#B3202A" />
        <text y="38" textAnchor="middle" {...FONT} fontSize="120" fill={CREAM}>×6</text>
      </g>
    </g>
  );
}

/* 5 — complaint counter rolls to 0, calm passengers pick up bags */
function ArtWtZero({ T, t }) {
  const n = Math.round(99 * (1 - tw(t, 0.3, 1.8)));
  const folks = [[220, '#E8C547', 0, 0], [486, '#E07A2E', 3, 0.4], [752, '#B3202A', 2, 0.9]];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#1D5560" />
      <g transform="translate(486 820)">
        <rect x="-200" y="-90" width="400" height="180" rx="36" fill={INK} />
        <rect x="-176" y="-68" width="352" height="136" rx="20" fill="#0B0E14" />
        <text y="44" textAnchor="middle" {...FONT} fontSize="120" fill={n ? '#E2453C' : '#7BE0A0'}>{String(n).padStart(2, '0')}</text>
        <text y="-110" textAnchor="middle" {...FONT} fontSize="36" fill={CREAM} opacity=".8">COMPLAINTS</text>
      </g>
      <rect x="0" y="1560" width="972" height="168" fill="#174750" />
      {folks.map(([x, c, sk, ph], i) => {
        const bob = osc(T, 1.6, ph) * 6;
        return (
          <g key={i} transform={`translate(0 ${bob})`}>
            <WtPerson x={x} y={1150} s={0.72} T={T} ph={ph} shirt={c} skin={SKINS[sk]} mood="calm" />
            <line x1={x + 50} y1="1290" x2={x + 80} y2="1420" stroke={c} strokeWidth="30" strokeLinecap="round" />
            <WtBag x={x + 84} y={1470} c={['#1F3B73', '#6A3FA0', CREAM][i]} w={100} h={80} />
          </g>
        );
      })}
      {[0, 1, 2].map((k) => {
        const p = clamp((t - 2.1 - k * 0.15) / 0.5, 0, 1);
        return <path key={k} d={`M${300 + k * 186} 1020 l12 -26 l12 26 l-12 26 Z`} fill="#E8C547" opacity={p * (0.5 + 0.5 * Math.abs(osc(T, 0.6, k)))} transform={`scale(1)`} />;
      })}
    </g>
  );
}

/* 6 — two clocks: empty time drooping and crawling vs busy time zipping */
function ArtWtClock({ T, t }) {
  const sag = tw(t, 3.0, 1.2);
  const crawl = T * 6, zip = T * 720;
  return (
    <g>
      <circle cx="486" cy="1220" r="440" fill="#C8651F" />
      <g transform={`translate(260 1150) scale(1 ${1 + 0.35 * sag}) skewX(${-10 * sag})`}>
        <path d={`M-140 0 A140 140 0 0 1 140 0 C140 ${110 + 60 * sag} ${60} ${160 + 80 * sag} 0 ${150 + 90 * sag} C-70 ${160 + 60 * sag} -140 ${90 + 40 * sag} -140 0 Z`} fill={CREAM} />
        <line x1="0" y1="20" x2="0" y2="-80" stroke={INK} strokeWidth="12" strokeLinecap="round" transform={`rotate(${crawl} 0 20)`} />
        <circle cy="20" r="10" fill={INK} />
        <Eye cx={-46} cy={-60} T={T} rx={14} ry={9} />
        <Eye cx={46} cy={-60} T={T} ph={0.2} rx={14} ry={9} />
        <path d="M-26 100 q26 -14 52 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      </g>
      <text x="260" y="1520" textAnchor="middle" {...FONT} fontSize="54" fill={CREAM}>EMPTY</text>
      <g transform={`translate(712 1130) rotate(${osc(T, 0.2) * 4})`}>
        <circle r="150" fill="#2B6E7A" />
        <circle r="120" fill={CREAM} />
        <line x1="0" y1="0" x2="0" y2="-90" stroke={INK} strokeWidth="12" strokeLinecap="round" transform={`rotate(${zip})`} />
        <line x1="0" y1="0" x2="0" y2="-56" stroke={INK} strokeWidth="14" strokeLinecap="round" transform={`rotate(${zip / 12})`} />
        <circle r="10" fill={INK} />
        <Eye cx={-44} cy={40} T={T} ph={0.8} rx={14} ry={14} />
        <Eye cx={44} cy={40} T={T} ph={0.8} rx={14} ry={14} />
        <path d="M-24 76 q24 20 48 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      </g>
      {[0, 1, 2].map((k) => (
        <line key={k} x1={530 - k * 10} y1={1060 + k * 60} x2={490 - k * 30} y2={1060 + k * 60} stroke={CREAM} strokeWidth="10" strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(osc(T, 0.3, k * 0.2))} />
      ))}
      <text x="712" y="1360" textAnchor="middle" {...FONT} fontSize="54" fill={CREAM}>BUSY</text>
      {[0, 1].map((k) => {
        const p = ((T + k * 1.1) % 2.2) / 2.2;
        return <text key={k} x={150 + k * 240} y={880 - p * 120} {...FONT} fontSize="56" fill={CREAM} opacity={Math.sin(p * Math.PI) * 0.8}>z</text>;
      })}
    </g>
  );
}

/* 7 — person in a queue doing a crossword, clock hands spinning */
function ArtWtPuzzle({ T, t }) {
  const fill = Math.floor(clamp((t - 0.6) / 3.2, 0, 1) * 6);
  const pen = osc(T, 0.35) * 10;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#55308A" />
      {[[90, '#2B6E7A', 4], [880, '#1F3B73', 1]].map(([x, c, sk], i) => (
        <WtPerson key={i} x={x} y={1060} s={0.55} T={T} ph={i} shirt={c} skin={SKINS[sk]} mood="angry" />
      ))}
      <g transform="translate(790 820)">
        <circle r="90" fill={CREAM} />
        <line x1="0" y1="0" x2="0" y2="-64" stroke={INK} strokeWidth="9" strokeLinecap="round" transform={`rotate(${T * 540})`} />
        <line x1="0" y1="0" x2="0" y2="-42" stroke={INK} strokeWidth="11" strokeLinecap="round" transform={`rotate(${T * 45})`} />
        <circle r="8" fill={INK} />
      </g>
      <g transform={`translate(0 ${osc(T, 2.2) * 5})`}>
        <WtPerson x={486} y={980} T={T} shirt="#E8C547" skin={SKINS[1]} hair="#2A1A10" look={0} />
        <g transform="translate(486 1250) rotate(-4)">
          <rect x="-150" y="-110" width="300" height="220" rx="16" fill={CREAM} />
          {Array.from({ length: 12 }, (_, k) => {
            const c = k % 4, r = Math.floor(k / 4);
            const dark = hsh(k + 3) > 0.75;
            const done = !dark && k % 2 === 0 && k / 2 < fill;
            return (
              <g key={k}>
                <rect x={-120 + c * 60} y={-90 + r * 60} width="54" height="54" fill={dark ? INK : '#fff'} />
                {done && <text x={-93 + c * 60} y={-48 + r * 60} textAnchor="middle" {...FONT} fontSize="36" fill="#6A3FA0">{'TASKED'[k / 2]}</text>}
              </g>
            );
          })}
        </g>
        <ellipse cx="380" cy="1340" rx="46" ry="36" fill={SKINS[1]} />
        <g transform={`translate(${600 + pen} ${1300 - Math.abs(pen)}) rotate(30)`}>
          <rect x="-10" y="-90" width="20" height="100" rx="6" fill="#B3202A" />
          <path d="M-10 10 L0 34 L10 10 Z" fill={INK} />
        </g>
        <ellipse cx={600 + pen} cy="1330" rx="44" ry="34" fill={SKINS[1]} />
      </g>
      <g transform={`translate(760 1520) scale(${Easing.easeOutBack(clamp((t - 1.6) / 0.4, 0, 1))}) rotate(${osc(T, 1.5) * 8})`}>
        <path d="M-50 -50 h36 a16 16 0 1 1 28 0 h36 v36 a16 16 0 1 1 0 28 v36 h-100 Z" fill="#E8C547" />
      </g>
    </g>
  );
}

Object.assign(window, { ArtWtAirport, ArtWtCarousel, ArtWtHandlers, ArtWtWalk, ArtWtZero, ArtWtClock, ArtWtPuzzle });
