// art.jsx — scene illustrations for "First Price Anchor" (Tversky & Kahneman 1974). Pure functions of T.
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


const FONT = 'Montserrat, sans-serif';
function Kid({ x, y, T, ph = 0, s = 1, shirt = '#B3202A', hair = INK, look = 0, mouth = 'smile' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 430 C-175 230 -95 175 0 175 C95 175 175 230 175 430 Z" fill={shirt} />
      <rect x="-40" y="100" width="80" height="100" rx="28" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="120" ry="138" fill={SKIN} />
      <path d="M-122 -6 C-132 -122 -50 -152 0 -152 C72 -152 132 -110 122 -12 C90 -64 40 -74 0 -70 C-46 -74 -96 -54 -122 -6 Z" fill={hair} />
      <Eye cx={-44} cy={12} T={T} ph={ph} rx={20} ry={19} look={look} />
      <Eye cx={44} cy={12} T={T} ph={ph} rx={20} ry={19} look={look} />
      {mouth === 'smile' && <path d="M-34 70 q34 30 68 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'flat' && <path d="M-26 78 h52" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="78" rx="15" ry="19" fill="#3A0C10" />}
      <ellipse cx="-76" cy="56" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      <ellipse cx="76" cy="56" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}
function Burst({ T, x, y, n = 8, r0 = 60, r1 = 120, col = CREAM, period = 1.4, ph = 0 }) {
  const p = ((T + ph) % period) / period;
  const k = MOTION.enter(Math.min(1, p * 3));
  return (
    <g opacity={p < 0.4 ? 1 - p / 0.4 : 0}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * TAU;
        return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * (r0 + (r1 - r0) * k)} y2={y + Math.sin(a) * (r0 + (r1 - r0) * k)} stroke={col} strokeWidth="9" strokeLinecap="round" />;
      })}
    </g>
  );
}

function Tag({ x, y, r = 0, label, fill = CREAM, ink = INK, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M-40 -70 L150 -70 Q170 -70 170 -50 L170 50 Q170 70 150 70 L-40 70 L-110 0 Z" fill={fill} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <circle cx="-62" cy="0" r="14" fill="none" stroke={INK} strokeWidth="6" />
      <text x="60" y="24" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="66" fill={ink}>{label}</text>
    </g>
  );
}
function Shirt({ x, y, col, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -30 q-10 -40 -30 -40 M0 -70 q20 0 20 20" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M-130 20 L0 -30 L130 20" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <path d="M-60 0 L-150 50 L-120 130 L-80 110 L-80 330 L80 330 L80 110 L120 130 L150 50 L60 0 Q0 40 -60 0 Z" fill={col} />
      <path d="M-40 6 Q0 44 40 6" fill="none" stroke="#fff" strokeWidth="8" opacity=".5" />
    </g>
  );
}

/* 1 — a price tag pinned inside a thought bubble */
function ArtPricePin({ T }) {
  const sw = osc(T, 1.6) * 10;
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#284A8A" />
      <Kid x={330} y={1360} T={T} shirt="#E8C547" look={12} mouth="flat" />
      {[[470, 1150, 18], [530, 1080, 28]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y + osc(T, 1.4, i * 0.3) * 6} r={r} fill={CREAM} />)}
      <g transform={`translate(0 ${osc(T, 2) * 8})`}>
        <ellipse cx="660" cy="900" rx="250" ry="180" fill={CREAM} />
        {[[480, 860, 70], [560, 760, 80], [700, 740, 90], [820, 830, 70], [800, 990, 70], [640, 1040, 80], [500, 990, 70]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={CREAM} />)}
        <g transform={`rotate(${sw} 640 830)`}>
          <line x1="640" y1="830" x2="640" y2="880" stroke={INK} strokeWidth="5" />
          <Tag x={640} y={940} r={90} label="$99" fill="#E8C547" s={0.75} />
        </g>
        <circle cx="640" cy="824" r="24" fill="#B3202A" />
        <circle cx="632" cy="816" r="8" fill="#fff" opacity=".6" />
      </g>
    </g>
  );
}

/* 2 — the $40 shirt looks cheap once a $100 shirt hangs beside it */
function ArtShirts({ T, t }) {
  const inn = tw(t, 1.4, 0.6);
  const glint = Math.abs(osc(T, 0.9));
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#DDD6C5" />
      <rect x="110" y="900" width="752" height="22" rx="11" fill={INK} />
      <rect x="120" y="900" width="18" height="820" fill={INK} /><rect x="834" y="900" width="18" height="820" fill={INK} />
      <g transform={`rotate(${osc(T, 2.2) * 3} 300 910)`}>
        <Shirt x={300} y={990} col="#2B6E7A" />
        <Tag x={300} y={1200} r={-10} label="$40" fill={inn > 0.5 ? '#E8C547' : CREAM} s={0.6} />
      </g>
      <g transform={`translate(${(1 - inn) * 600} 0) rotate(${osc(T, 2.2, 0.3) * 3} 670 910)`}>
        <Shirt x={670} y={990} col="#6A3FA0" />
        <Tag x={670} y={1200} r={8} label="$100" fill="#B3202A" ink={CREAM} s={0.6} />
      </g>
      {inn > 0.5 && [0, 1, 2, 3].map((k) => (
        <path key={k} d="M0 -26 L7 -7 L26 0 L7 7 L0 26 L-7 7 L-26 0 L-7 -7 Z" fill="#E8C547" stroke={INK} strokeWidth="4"
          transform={`translate(${210 + k * 60} ${1110 + (k % 2) * 160}) scale(${0.6 + glint * 0.5 * (k % 2 ? 1 : 0.6)})`} />
      ))}
      <ellipse cx="486" cy="1712" rx="360" ry="24" fill="#CFC7B4" />
    </g>
  );
}

/* 3 — a rigged wheel that only lands on 10 or 65 */
function ArtWheel({ T }) {
  const P = 3.4;
  const c = Math.floor(T / P), p = (T % P) / P;
  const R = (n) => -(n * 1080 + (((n % 2) + 2) % 2) * 45 + 22.5);
  const rot = R(c - 1) + (R(c) - R(c - 1)) * MOTION.enter(Math.min(1, p / 0.7));
  const cols = ['#E8C547', '#2B6E7A', '#E07A2E', '#1F3B73'];
  const landed = p > 0.7;
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#9E1B24" />
      <rect x="456" y="1180" width="60" height="460" fill={INK} />
      <path d="M330 1700 L642 1700 L600 1620 L372 1620 Z" fill={INK} />
      <g transform={`translate(486 1130) rotate(${rot})`}>
        <circle r="330" fill={INK} />
        {Array.from({ length: 8 }, (_, i) => {
          const a0 = ((i * 45 - 90) * Math.PI) / 180, a1 = (((i + 1) * 45 - 90) * Math.PI) / 180;
          const am = (a0 + a1) / 2;
          return (
            <g key={i}>
              <path d={`M0 0 L${Math.cos(a0) * 310} ${Math.sin(a0) * 310} A310 310 0 0 1 ${Math.cos(a1) * 310} ${Math.sin(a1) * 310} Z`} fill={cols[i % 4]} />
              <text x={Math.cos(am) * 210} y={Math.sin(am) * 210 + 22} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill={CREAM}
                transform={`rotate(${i * 45 + 22.5} ${Math.cos(am) * 210} ${Math.sin(am) * 210})`}>{i % 2 ? '65' : '10'}</text>
            </g>
          );
        })}
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={Math.cos((i / 16) * TAU) * 322} cy={Math.sin((i / 16) * TAU) * 322} r="8" fill={CREAM} />)}
        <circle r="44" fill={CREAM} /><circle r="18" fill={INK} />
      </g>
      <path d="M486 840 L446 770 L526 770 Z" fill={CREAM} stroke={INK} strokeWidth="8" strokeLinejoin="round" transform={`rotate(${landed ? 0 : osc(T, 0.12) * 8} 486 780)`} />
      {landed && <Burst T={T} x={486} y={800} r0={60} r1={120} period={P} ph={-0.7 * P} col="#E8C547" />}
    </g>
  );
}

/* 4 — guessing: what percent of African countries are in the UN? */
function ArtUNQuiz({ T }) {
  const spin = (T * 40) % 120;
  const cur = (T % 1) < 0.5;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#D9B53A" />
      <g transform="translate(680 1040)">
        <circle r="170" fill="#2B6E7A" />
        {[-1, 0, 1].map((k) => {
          const x = ((k * 120 + spin + 180) % 360) - 180;
          return <ellipse key={k} cx="0" cy="0" rx={Math.abs(170 * Math.sin((x / 360) * Math.PI)) + 2} ry="170" fill="none" stroke="#9AD8FF" strokeWidth="6" opacity=".7" />;
        })}
        {[-100, -40, 40, 100].map((y) => <line key={y} x1={-Math.sqrt(170 * 170 - y * y)} y1={y} x2={Math.sqrt(170 * 170 - y * y)} y2={y} stroke="#9AD8FF" strokeWidth="6" opacity=".7" />)}
        <path d={`M${-40 + osc(T, 6) * 20} -60 q40 -30 70 10 q10 60 -20 120 q-30 -30 -50 -60 q-20 -40 0 -70 Z`} fill="#8BC34A" />
        <rect x="-14" y="170" width="28" height="70" fill={INK} />
        <rect x="-90" y="236" width="180" height="26" rx="13" fill={INK} />
      </g>
      <g transform={`translate(330 840) rotate(${osc(T, 2) * 3})`}>
        <rect x="-170" y="-80" width="340" height="160" rx="24" fill="#fff" stroke={INK} strokeWidth="8" />
        <rect x="-120" y="-36" width="130" height="80" rx="10" fill="#EEE" />
        {cur && <rect x="-20" y="-26" width="8" height="60" fill={INK} />}
        <text x="70" y="34" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="86" fill="#B3202A">%</text>
      </g>
      <Kid x={300} y={1340} T={T} shirt="#6A3FA0" look={14} mouth="o" />
      <line x1="360" y1="1560" x2="420" y2="1330" stroke="#6A3FA0" strokeWidth="54" strokeLinecap="round" />
      <circle cx="400" cy={1300 + osc(T, 0.7) * 6} r="32" fill={SKIN} />
    </g>
  );
}

/* 5 — two people, two anchors, two guesses */
function ArtTwoGuesses({ T, t }) {
  const g = tw(t, 0.4, 1.6);
  const cols = [[300, '10', 25, '#E8C547'], [680, '65', 45, '#E07A2E']];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#255F69" />
      <rect x="150" y="1300" width="672" height="10" rx="5" fill={CREAM} />
      {cols.map(([x, saw, v, c], i) => {
        const h = v * 9 * g;
        return (
          <g key={i}>
            <rect x={x - 70} y={1300 - h} width="140" height={h} rx="12" fill={c} />
            <text x={x} y={1280 - h} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill={CREAM}>{Math.round(v * g)}%</text>
            <g transform={`translate(${x} 1520)`}>
              <circle cx="0" cy="0" r="80" fill={SKIN} />
              <path d="M-82 -6 C-86 -80 -40 -96 0 -96 C50 -96 86 -70 82 -10 C60 -44 30 -50 0 -48 C-30 -50 -60 -36 -82 -6 Z" fill={i ? '#5A3A22' : INK} />
              <Eye cx={-28} cy={8} T={T} ph={i * 0.7} rx={14} ry={14} />
              <Eye cx={28} cy={8} T={T} ph={i * 0.7} rx={14} ry={14} />
              <path d="M-20 44 q20 16 40 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
              <path d="M-130 220 C-130 140 -70 100 0 100 C70 100 130 140 130 220 Z" fill={c} />
              <g transform={`translate(${i ? 110 : -110} ${-110 + osc(T, 1.2, i * 0.5) * 8})`}>
                <circle r="54" fill={CREAM} stroke={INK} strokeWidth="6" />
                <text y="20" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="52" fill={INK}>{saw}</text>
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
}

/* 6 — an anchor (a random number) holds the guess in place */
function ArtAnchorDrop({ T }) {
  const bob = osc(T, 2) * 10;
  const drift = osc(T, 3) * 30;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#D26E25" />
      <rect x="0" y="900" width="972" height="828" fill="#1D4E57" opacity=".45" />
      <path d={`M0 ${900 + osc(T, 1.4) * 6} q60 -20 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 V940 H0 Z`} fill={CREAM} opacity=".5" />
      <g transform={`translate(${300 + drift} ${830 + bob}) rotate(${osc(T, 2) * 4})`}>
        <path d="M-150 30 L150 30 L110 90 L-110 90 Z" fill={CREAM} />
        <rect x="-8" y="-150" width="12" height="180" fill={INK} />
        <path d="M4 -150 L110 -10 L4 -10 Z" fill="#E8C547" />
        <g transform="translate(-110 -150)">
          <rect x="-60" y="-50" width="120" height="100" rx="14" fill="#fff" stroke={INK} strokeWidth="6" transform={`rotate(${osc(T, 1.1) * 6})`} />
          <text x="0" y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="50" fill={INK}>?%</text>
        </g>
      </g>
      <path d={`M${400 + drift} ${920 + bob} Q${520 + drift * 0.5} 1200 560 1440`} fill="none" stroke={INK} strokeWidth="12" strokeDasharray="26 12" />
      <g transform={`translate(560 1500) rotate(${osc(T, 2.6) * 5})`}>
        <circle cx="0" cy="-80" r="30" fill="none" stroke={INK} strokeWidth="18" />
        <rect x="-14" y="-52" width="28" height="200" fill={INK} />
        <rect x="-70" y="-20" width="140" height="24" rx="12" fill={INK} />
        <path d="M-130 80 Q0 210 130 80 L150 60 L130 130 Q0 250 -130 130 L-150 60 Z" fill={INK} />
        <circle r="54" cy="80" fill="#E8C547" />
        <text y="98" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="50" fill={INK}>10</text>
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.7) % 2.1) / 2.1;
        return <circle key={k} cx={620 + osc(T, 0.8, k) * 12} cy={1380 - p * 440} r={10 + k * 4} fill="none" stroke={CREAM} strokeWidth="5" opacity={1 - p} />;
      })}
    </g>
  );
}

/* 7 — a crossed-out "was" price makes the real one look small */
function ArtWasPrice({ T, t }) {
  const strike = tw(t, 0.8, 0.5);
  const now = tw(t, 1.4, 0.5);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#7A4DB2" />
      <g transform={`rotate(${osc(T, 2) * 4} 486 860)`}>
        <line x1="486" y1="820" x2="486" y2="920" stroke={CREAM} strokeWidth="6" />
        <path d="M286 960 L486 900 L686 960 L686 1400 Q686 1430 656 1430 L316 1430 Q286 1430 286 1400 Z" fill={CREAM} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
        <circle cx="486" cy="960" r="20" fill="none" stroke={INK} strokeWidth="8" />
        <text x="486" y="1050" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="40" fill="#6B6B6B">WAS</text>
        <text x="486" y="1150" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="96" fill="#6B6B6B">$99</text>
        <line x1="360" y1="1124" x2={360 + 252 * strike} y2={1112} stroke="#B3202A" strokeWidth="14" strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
        <g transform={`translate(486 1320) scale(${MOTION.pop(now) * (1 + 0.05 * osc(T, 0.8))})`} opacity={now}>
          <rect x="-150" y="-90" width="300" height="140" rx="24" fill="#B3202A" />
          <text x="0" y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="100" fill={CREAM}>$49</text>
        </g>
      </g>
      <Kid x={180} y={1560} T={T} s={0.6} shirt="#2B6E7A" look={14} mouth={now > 0.5 ? 'o' : 'smile'} />
      <g transform="translate(800 1560)">
        <path d="M-90 -80 L90 -80 L110 160 L-110 160 Z" fill="#E8C547" />
        <path d="M-40 -80 q0 -70 40 -70 q40 0 40 70" fill="none" stroke={INK} strokeWidth="10" />
      </g>
    </g>
  );
}

/* 8 — write your own number down before you shop */
function ArtOwnNumber({ T, t }) {
  const w = tw(t, 0.3, 1.6);
  const px = 380 + w * 230 + osc(T, 0.25) * 8;
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#284A8A" />
      {[[160, 860, '$99', -12], [820, 900, '$249', 10], [150, 1300, '$75', 8]].map(([x, y, s, r], i) => (
        <g key={i} opacity={0.35 + 0.15 * osc(T, 2, i * 0.3)} transform={`translate(0 ${osc(T, 2.4, i * 0.3) * 12})`}>
          <Tag x={x} y={y} r={r} label={s} s={0.5} fill="#C9CCD3" />
        </g>
      ))}
      <g transform={`rotate(${-4 + osc(T, 3) * 1.5} 486 1200)`}>
        <rect x="300" y="940" width="380" height="500" rx="20" fill="#fff" />
        {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1="330" y1={1060 + k * 60} x2="650" y2={1060 + k * 60} stroke="#9AD8FF" strokeWidth="4" />)}
        {[0, 1, 2, 3, 4, 5, 6].map((k) => <circle key={k} cx={340 + k * 50} cy="955" r="12" fill="#284A8A" />)}
        <text x="340" y="1040" fontFamily={FONT} fontWeight="800" fontSize="40" fill={INK}>MY MAX:</text>

          <text x="350" y="1170" fontFamily={FONT} fontWeight="900" fontSize="110" fill="#B3202A" opacity={w > 0.05 ? 1 : 0} textLength={Math.max(1, 250 * w)} lengthAdjust="spacingAndGlyphs">$30</text>
        <path d={`M350 1200 q${120 * w} 20 ${240 * w} 0`} fill="none" stroke="#B3202A" strokeWidth="8" strokeLinecap="round" opacity={w > 0.6 ? 1 : 0} />
      </g>
      <g transform={`translate(${px} 1160) rotate(30)`}>
        <rect x="-16" y="-200" width="32" height="200" fill="#E8C547" />
        <path d="M-16 0 L16 0 L0 34 Z" fill={SKIN2} />
        <rect x="-16" y="-224" width="32" height="26" rx="6" fill="#E2453C" />
      </g>
      <ellipse cx={px + 60} cy="1290" rx="60" ry="74" fill={SKIN} />
      <line x1={px + 90} y1="1330" x2="860" y2="1640" stroke="#E07A2E" strokeWidth="80" strokeLinecap="round" />
    </g>
  );
}

Object.assign(window, { ArtPricePin, ArtShirts, ArtWheel, ArtUNQuiz, ArtTwoGuesses, ArtAnchorDrop, ArtWasPrice, ArtOwnNumber });
