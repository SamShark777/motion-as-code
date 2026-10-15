// art.jsx — scene illustrations for "Better-Than-Average Effect" (Ted type 2). Pure functions of T.
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

/* shared: a bust (head + shoulders), drawn around the head centre */
function BtHead({ x, y, s = 1, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, look = 0, mouth = 'smile', long = false, cut = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {long && <path d="M-122 -10 C-132 -140 132 -140 122 -10 L130 170 L-130 170 Z" fill={hair} />}
      <path d={cut ? 'M-170 380 C-170 220 -100 160 0 160 C100 160 170 220 170 380 Z' : 'M-170 800 L-170 380 C-170 220 -100 160 0 160 C100 160 170 220 170 380 L170 800 Z'} fill={shirt} />
      <rect x="-32" y="80" width="64" height="100" rx="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="100" ry="112" fill={skin} />
      <path d="M-100 -6 C-110 -112 -40 -130 0 -130 C66 -130 114 -98 102 -12 C76 -58 36 -68 0 -64 C-40 -68 -80 -50 -100 -6 Z" fill={hair} />
      <Eye cx={-38} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <Eye cx={38} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <ellipse cx="-62" cy="46" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="62" cy="46" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      {mouth === 'smile' && <path d="M-28 52 q28 24 56 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="16" ry="20" fill="#3A0C10" />}
      {mouth === 'grin' && <path d="M-34 46 A34 30 0 0 0 34 46 Z" fill="#3A0C10" />}
      {mouth === 'flat' && <path d="M-24 58 h48" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
    </g>
  );
}

/* small person pictogram */
function BtPip({ x, y, s = 1, fill }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-22" r="14" fill={fill} />
      <path d="M-20 26 L-20 4 C-20 -4 -12 -8 0 -8 C12 -8 20 -4 20 4 L20 26 Z" fill={fill} />
    </g>
  );
}

/* 100 people, n of them rate themselves in the more skilled half */
function BtWaffle({ T, t, n, on, off, panel, chip, label }) {
  const k = Math.floor(n * tw(t, 0.2, 1.6));
  const cells = [];
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10;
    const lit = i < k;
    const hop = lit ? -Math.max(0, osc(T, 0.9, hsh(i))) * 6 : 0;
    cells.push(<BtPip key={i} x={162 + c * 72} y={872 + r * 72 + hop} s={0.95} fill={lit ? on : off} />);
  }
  return (
    <g>
      <rect x="100" y="800" width="772" height="772" rx="40" fill={panel} />
      {cells}
      <g transform={`translate(486 1650) scale(${0.92 + 0.08 * Math.abs(osc(T, 1.1))})`}>
        <rect x="-240" y="-50" width="480" height="100" rx="50" fill={chip} />
        <text x="0" y="20" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="50" fill={INK}>{`${k}% ${label}`}</text>
      </g>
    </g>
  );
}

/* 1 — everyone squeezing onto the top step of the podium */
function ArtPodium({ T, t }) {
  const wob = osc(T, 0.5) * 3;
  const crowd = [[-150, '#B3202A', 0.1], [-60, '#2B6E7A', 0.5], [30, '#E07A2E', 0.9], [120, '#6A3FA0', 1.3]];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <rect x="110" y="1440" width="250" height="288" fill="#5D79B8" />
      <rect x="612" y="1500" width="250" height="228" fill="#5D79B8" />
      <rect x="330" y="1320" width="312" height="408" fill={CREAM} />
      <text x="486" y="1520" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="150" fill="#1F3B73">1</text>
      <text x="235" y="1600" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="90" fill="#1F3B73" opacity=".5">2</text>
      <text x="737" y="1640" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="90" fill="#1F3B73" opacity=".5">3</text>
      <g transform={`rotate(${wob} 486 1320)`}>
        {crowd.map(([dx, c, ph], i) => {
          const bob = -Math.abs(osc(T, 0.7, ph)) * 16;
          return (
            <g key={i} transform={`translate(${486 + dx * 1.1} ${1080 + bob + (i % 2) * 30})`}>
              <path d="M-70 240 L-70 120 C-70 70 -40 50 0 50 C40 50 70 70 70 120 L70 240 Z" fill={c} />
              <circle cx="0" cy="-10" r="64" fill={i % 2 ? SKIN2 : SKIN} />
              <path d="M-64 -14 C-70 -80 -24 -90 0 -90 C40 -90 72 -70 64 -18 C40 -46 18 -48 0 -46 C-24 -48 -48 -36 -64 -14 Z" fill={INK} />
              <Eye cx={-22} cy={-8} T={T} ph={ph} rx={11} ry={11} look={(i - 1.5) * -2} />
              <Eye cx={22} cy={-8} T={T} ph={ph} rx={11} ry={11} look={(i - 1.5) * -2} />
              <path d="M-20 24 A20 16 0 0 0 20 24 Z" fill="#3A0C10" />
              <line x1="50" y1="110" x2="80" y2={-10 + bob} stroke={c} strokeWidth="28" strokeLinecap="round" />
            </g>
          );
        })}
      </g>
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${300 + k * 180} ${1000 - Math.abs(osc(T, 0.6, k * 0.3)) * 20} l0 -40`} stroke={CREAM} strokeWidth="8" strokeLinecap="round" opacity=".6" />
      ))}
    </g>
  );
}

/* 2 — you behind the wheel, rating yourself */
function ArtDriver({ T, t }) {
  const steer = osc(T, 1.8) * 10;
  const knob = 0.85 + 0.03 * osc(T, 1.2);
  const roll = (T * 200) % 160;
  return (
    <g>
      <circle cx="486" cy="1180" r="420" fill="#DDD6C5" />
      <BtHead x={486} y={1060} s={0.9} T={T} shirt="#1F3B73" mouth="grin" look={osc(T, 3) * 6} />
      <rect x="100" y="1340" width="772" height="388" rx="40" fill="#B3202A" />
      <rect x="100" y="1340" width="772" height="60" rx="30" fill="#8E151D" />
      <g transform={`rotate(${steer} 486 1440)`}>
        <circle cx="486" cy="1440" r="150" fill="none" stroke={INK} strokeWidth="34" />
        <circle cx="486" cy="1440" r="40" fill={INK} />
        <line x1="336" y1="1440" x2="636" y2="1440" stroke={INK} strokeWidth="26" />
        <ellipse cx="346" cy="1420" rx="40" ry="34" fill={SKIN} />
        <ellipse cx="626" cy="1420" rx="40" ry="34" fill={SKIN} />
      </g>
      {[0, 1].map((k) => (
        <rect key={k} x={k ? 760 : 150} y={1600 + ((roll + k * 80) % 160) - 80} width="20" height="60" rx="8" fill={CREAM} opacity=".5" />
      ))}
      <g transform="translate(486 780)">
        <rect x="-300" y="-16" width="600" height="32" rx="16" fill="#C9C0AE" />
        <rect x="-300" y="-16" width={600 * knob} height="32" rx="16" fill="#B3202A" />
        <circle cx={-300 + 600 * knob} cy="0" r="38" fill="#fff" stroke={INK} strokeWidth="8" />
        <text x="-300" y="80" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill="#9A938A">WORSE</text>
        <text x="300" y="80" textAnchor="end" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill="#9A938A">BETTER</text>
      </g>
    </g>
  );
}

/* 3 — Svenson asks a room of students to rate their driving */
function ArtClassroom({ T, t }) {
  const desks = [[230, 1250], [742, 1250], [230, 1560], [742, 1560]];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#C42E37" />
      {desks.map(([x, y], i) => {
        const w = osc(T, 0.3, i * 0.2) * 8;
        return (
          <g key={i}>
            <BtHead x={x} y={y - 150} s={0.5} T={T} ph={i * 0.6} shirt={['#1F3B73', '#E8C547', '#2B6E7A', '#6A3FA0'][i]} hair={i % 2 ? '#3A1A14' : INK} long={i === 1 || i === 2} mouth="flat" look={6} cut />
            <rect x={x - 150} y={y - 40} width="300" height="30" rx="8" fill="#8E6B48" />
            <rect x={x - 70} y={y - 70} width="120" height="40" rx="4" fill="#fff" transform={`rotate(-6 ${x} ${y - 50})`} />
            <g transform={`translate(${x + 60 + w} ${y - 80}) rotate(30)`}>
              <rect x="-6" y="-60" width="12" height="60" fill="#E8C547" />
              <ellipse cx="0" cy="0" rx="22" ry="18" fill={SKIN} />
            </g>
          </g>
        );
      })}
      <g transform="translate(486 1030)">
        <rect x="-90" y="-60" width="180" height="230" rx="20" fill={CREAM} stroke={INK} strokeWidth="8" />
        <rect x="-40" y="-76" width="80" height="34" rx="10" fill="#9A938A" />
        <text x="0" y="10" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="30" fill={INK}>RATE YOUR</text>
        <text x="0" y="50" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="30" fill={INK}>DRIVING</text>
        {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={-64 + k * 32} cy="110" r="12" fill={k === Math.floor((T * 1.5) % 5) ? '#B3202A' : '#C9C0AE'} />)}
      </g>
    </g>
  );
}

/* 4 — 93 out of 100 American students: "I'm in the better half" */
function ArtBars({ T, t }) {
  return (
    <g>
      <circle cx="486" cy="1200" r="440" fill="#D9B53A" />
      <BtWaffle T={T} t={t} n={93} on="#B3202A" off="#C9A227" panel="#F2D766" chip={CREAM} label="US" />
    </g>
  );
}

/* 5 — Swedish students: 69 out of 100 */
function ArtSweden({ T, t }) {
  return (
    <g>
      <circle cx="486" cy="1200" r="440" fill="#24606B" />
      <BtWaffle T={T} t={t} n={69} on="#E8C547" off="#3D7F8A" panel="#1F4C9C" chip="#E8C547" label="SWEDEN" />
    </g>
  );
}

/* 6 — only half can be above the middle: the left half keeps trying to hop across */
function ArtMedian({ T, t }) {
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#C9661F" />
      <rect x="486" y="900" width="400" height="660" rx="30" fill="#E8C547" opacity=".25" />
      <line x1="486" y1="860" x2="486" y2="1640" stroke={CREAM} strokeWidth="10" strokeDasharray="30 22" />
      <text x="486" y="840" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="48" fill={CREAM}>MEDIAN</text>
      <line x1="80" y1="1440" x2="892" y2="1440" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      {Array.from({ length: 10 }).map((_, i) => {
        const left = i < 5;
        const x = 120 + i * 82 + (left ? 0 : 20);
        const hop = left ? -Math.max(0, osc(T, 0.8, i * 0.17)) * 70 : 0;
        return (
          <g key={i} transform={`translate(${x} ${1360 + hop})`}>
            <path d="M-26 70 L-26 10 C-26 -6 -14 -12 0 -12 C14 -12 26 -6 26 10 L26 70 Z" fill={left ? '#8E5A2E' : '#1F3B73'} />
            <circle cx="0" cy="-40" r="26" fill={i % 3 ? SKIN : SKIN2} />
            <circle cx="-8" cy="-42" r="4" fill={INK} />
            <circle cx="8" cy="-42" r="4" fill={INK} />
            {left && <path d="M30 -30 q20 -20 40 0" fill="none" stroke={CREAM} strokeWidth="6" strokeLinecap="round" />}
          </g>
        );
      })}
      <text x="280" y="1530" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={CREAM}>BOTTOM HALF</text>
      <text x="690" y="1530" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={CREAM}>TOP HALF</text>
    </g>
  );
}

/* 7 — your mirror says "great"; ask someone outside for a real score */
function ArtMirror({ T, t }) {
  const shine = Math.abs(osc(T, 1.2));
  const hold = tw(t, 0.8, 0.6);
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#5A3290" />
      <g transform="translate(250 1080)">
        <ellipse cx="0" cy="0" rx="170" ry="250" fill="#E8C547" />
        <ellipse cx="0" cy="0" rx="146" ry="226" fill="#BFD0F2" />
        <g transform="translate(0 30) scale(0.55)">
          <BtHead x={0} y={0} T={T} shirt="#2B6E7A" mouth="grin" look={10} cut />
          <path d="M-80 -110 L-60 -190 L-20 -140 L0 -210 L20 -140 L60 -190 L80 -110 Z" fill="#E8C547" />
        </g>
        <path d="M-90 -150 l50 -50 M-100 -100 l90 -90" stroke="#fff" strokeWidth="12" strokeLinecap="round" opacity={0.3 + 0.4 * shine} />
        <rect x="-20" y="250" width="40" height="300" fill="#C9A227" />
      </g>
      <BtHead x={330} y={1440} s={0.8} T={T} shirt="#2B6E7A" mouth="smile" look={-12} />
      <BtHead x={760} y={1260} s={0.8} T={T} ph={1.2} shirt="#E07A2E" hair="#3A1A14" long mouth="smile" look={-16} />
      <g transform={`translate(${640} ${1200 - hold * 60}) rotate(${-8 + osc(T, 2) * 2})`} opacity={hold}>
        <rect x="-110" y="-150" width="220" height="280" rx="16" fill={CREAM} stroke={INK} strokeWidth="6" />
        <text x="0" y="-96" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="32" fill={INK}>FEEDBACK</text>
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x="-80" y={-60 + k * 60} width="160" height="26" rx="13" fill="#DDD6C5" />
            <rect x="-80" y={-60 + k * 60} width={160 * [0.7, 0.45, 0.6][k] * hold} height="26" rx="13" fill="#6A3FA0" />
          </g>
        ))}
        <ellipse cx="-110" cy="60" rx="34" ry="28" fill={SKIN} />
      </g>
    </g>
  );
}

/* 8 — rate yourself in the comments */
function ArtComment({ T, t }) {
  const bubbles = [['ME? 9/10', '#E8C547'], ['8/10 FOR SURE', '#BFD0F2'], ['TOP HALF!', '#F6D9B8']];
  const dots = Math.floor(T * 3) % 3;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <g transform={`translate(486 1220) rotate(${osc(T, 3) * 2})`}>
        <rect x="-250" y="-480" width="500" height="900" rx="60" fill={INK} />
        <rect x="-226" y="-440" width="452" height="820" rx="36" fill={CREAM} />
        <rect x="-60" y="-466" width="120" height="16" rx="8" fill="#2A2A33" />
        {bubbles.map(([s, c], i) => {
          const g = tw(t, 0.3 + i * 0.6, 0.4);
          return (
            <g key={i} transform={`translate(${i % 2 ? 30 : -30} ${-330 + i * 170}) scale(${g})`} opacity={g}>
              <circle cx="-150" cy="0" r="34" fill={['#B3202A', '#2B6E7A', '#6A3FA0'][i]} />
              <rect x="-100" y="-46" width="290" height="92" rx="30" fill={c} />
              <text x="45" y="14" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="34" fill={INK}>{s}</text>
            </g>
          );
        })}
        <rect x="-200" y="250" width="400" height="90" rx="45" fill="#fff" stroke="#C9C0AE" strokeWidth="6" />
        {[0, 1, 2].map((k) => <circle key={k} cx={-150 + k * 40} cy="295" r="12" fill={k === dots ? INK : '#C9C0AE'} />)}
      </g>
      <g transform={`translate(780 1560) rotate(${-20 + osc(T, 0.5) * 6})`}>
        <ellipse cx="0" cy="0" rx="70" ry="56" fill={SKIN} />
        <rect x="-18" y="-120" width="36" height="110" rx="18" fill={SKIN} />
      </g>
    </g>
  );
}

Object.assign(window, { ArtPodium, ArtDriver, ArtClassroom, ArtBars, ArtSweden, ArtMedian, ArtMirror, ArtComment });
