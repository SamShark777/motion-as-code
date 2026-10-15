// art.jsx — scene illustrations for "Would You Post It If Likes Were Hidden?" (Sherman et al. 2016). Pure functions of T.
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


const RED = '#E2453C';
const FONT = 'Montserrat, sans-serif';
function Heart({ x, y, s = 1, fill = RED, stroke }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 34 C-44 4 -64 -18 -64 -42 C-64 -64 -46 -78 -28 -78 C-14 -78 -5 -70 0 -60 C5 -70 14 -78 28 -78 C46 -78 64 -64 64 -42 C64 -18 44 4 0 34 Z"
        fill={fill} stroke={stroke || 'none'} strokeWidth={stroke ? 10 : 0} strokeLinejoin="round" />
    </g>
  );
}
function Phone({ x, y, w = 300, h = 540, r = 0, children }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="42" fill={INK} />
      <rect x={-w / 2 + 16} y={-h / 2 + 44} width={w - 32} height={h - 76} rx="20" fill="#fff" />
      <rect x="-34" y={-h / 2 + 18} width="68" height="11" rx="5" fill="#2E3340" />
      {children}
    </g>
  );
}
function Snap({ x, y, w, h, sky = '#9AD8FF', hill = '#2B6E7A' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill={sky} />
      <circle cx={x + w * 0.74} cy={y + h * 0.3} r={h * 0.13} fill="#E8C547" />
      <path d={`M${x} ${y + h} L${x + w * 0.34} ${y + h * 0.48} L${x + w * 0.58} ${y + h * 0.8} L${x + w * 0.78} ${y + h * 0.6} L${x + w} ${y + h} Z`} fill={hill} />
    </g>
  );
}
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

/* 1 — teen hesitating over POST while the like count is hidden */
function ArtPostHidden({ T }) {
  const hov = osc(T, 1.7) * 26;
  const q = Math.abs(osc(T, 1.2));
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#284A8A" />
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.8) % 2.4) / 2.4;
        return <text key={k} x={210 + k * 90} y={930 - p * 160} fontFamily={FONT} fontWeight="900" fontSize={70 + k * 12} fill={CREAM} opacity={Math.sin(p * Math.PI)} transform={`rotate(${osc(T, 1.3, k) * 12} ${210 + k * 90} ${930 - p * 160})`}>?</text>;
      })}
      <Kid x={320} y={1230} T={T} shirt="#E07A2E" look={10} mouth="flat" />
      <line x1="420" y1="1520" x2="620" y2="1470" stroke="#E07A2E" strokeWidth="64" strokeLinecap="round" />
      <Phone x={690} y={1180} w={310} h={560} r={6}>
        <Snap x={-130} y={-210} w={260} h={250} />
        <Heart x={-92} y={102} s={0.42} />
        <rect x="-50" y="68" width="160" height="58" rx="14" fill="#D6D9E0" />
        <text x="30" y="112" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={INK} opacity={0.35 + 0.65 * q}>???</text>
        <rect x="-112" y="160" width="224" height="66" rx="33" fill="#2B6E7A" />
        <text x="0" y="205" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="36" fill="#fff">POST</text>
        <g transform={`translate(${hov} ${Math.abs(hov) * 0.6})`}>
          <ellipse cx="20" cy="300" rx="80" ry="64" fill={SKIN} />
          <rect x="-6" y="196" width="48" height="110" rx="24" fill={SKIN} />
        </g>
      </Phone>
    </g>
  );
}

/* 2 — same photo, two counts: the bigger number looks better */
function ArtLikeCompare({ T }) {
  const big = 1200 + Math.floor(T * 410) % 8000;
  const bob = 1 + 0.04 * Math.abs(osc(T, 0.9));
  const card = (x, n, sc, glow) => (
    <g transform={`translate(${x} 960) scale(${sc}) translate(${-x} -960)`}>
      {glow && <circle cx={x} cy="960" r="230" fill="#F6F1E4" />}
      <rect x={x - 160} y="790" width="320" height="380" rx="24" fill="#fff" stroke={INK} strokeWidth="8" />
      <Snap x={x - 136} y={812} w={272} h={250} />
      <Heart x={x - 100} y={1124} s={0.36} />
      <text x={x - 64} y={1136} fontFamily={FONT} fontWeight="900" fontSize="42" fill={INK}>{n}</text>
    </g>
  );
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#DDD6C5" />
      {card(250, '12', 0.9, false)}
      {card(722, big.toLocaleString('en-US'), bob, true)}
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.6) % 1.8) / 1.8;
        return <Heart key={k} x={760 + osc(T, 1.1, k) * 40 + (k - 1) * 70} y={780 - p * 200} s={0.25} fill={RED} />;
      })}
      <Kid x={486} y={1430} T={T} s={0.85} shirt="#1F3B73" look={12} mouth="o" />
      <path d="M560 1380 L660 1220" stroke={CREAM} strokeWidth="10" strokeLinecap="round" strokeDasharray="4 22" />
    </g>
  );
}

/* 3 — teen in a brain scanner, scrolling a feed */
function ArtScanner({ T }) {
  const rot = T * 70;
  const scroll = (T * 60) % 120;
  const pulse = 0.5 + 0.5 * Math.abs(osc(T, 0.8));
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#9E1B24" />
      <rect x="120" y="1440" width="732" height="70" rx="20" fill={CREAM} />
      <rect x="170" y="1510" width="40" height="200" fill="#C9C0AE" />
      <rect x="762" y="1510" width="40" height="200" fill="#C9C0AE" />
      <circle cx="486" cy="1180" r="330" fill={CREAM} />
      <circle cx="486" cy="1180" r="330" fill="none" stroke="#C9C0AE" strokeWidth="18" />
      <g transform={`rotate(${rot} 486 1180)`}>
        <path d="M486 900 A280 280 0 0 1 766 1180" fill="none" stroke="#E8C547" strokeWidth="14" strokeLinecap="round" opacity=".8" />
        <path d="M486 1460 A280 280 0 0 1 206 1180" fill="none" stroke="#9AD8FF" strokeWidth="14" strokeLinecap="round" opacity=".8" />
      </g>
      <circle cx="486" cy="1180" r="210" fill="#3B0B10" />
      <Kid x={486} y={1270} T={T} s={0.62} shirt="#2B6E7A" look={0} mouth="smile" />
      <g transform="translate(486 1062)">
        <rect x="-70" y="-50" width="140" height="100" rx="16" fill={INK} />
        <rect x="-60" y="-42" width="120" height="84" rx="8" fill="#fff" />
        {[0, 1].map((k) => <rect key={k} x="-50" y={-36 + ((k * 60 + 120 - scroll) % 120) - 20} width="100" height="40" rx="6" fill={k ? '#F4A7B9' : '#9AD8FF'} opacity=".9" />)}
        <ellipse cx="-74" cy="40" rx="24" ry="20" fill={SKIN} />
        <ellipse cx="74" cy="40" rx="24" ry="20" fill={SKIN} />
      </g>
      <g transform="translate(790 1600)">
        <rect x="-90" y="-80" width="180" height="140" rx="14" fill={INK} />
        <circle cx="0" cy="-10" r="48" fill="#F4A7B9" />
        <circle cx="10" cy="0" r={10 + pulse * 8} fill="#E8C547" opacity={0.5 + pulse * 0.5} />
      </g>
    </g>
  );
}

/* 4 — finger taps like on a risky photo that already has lots of likes */
function ArtLikeTap({ T }) {
  const p = (T % 1.4) / 1.4;
  const down = p < 0.12 ? 1 : 0;
  const filled = p < 0.8;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#D9B53A" />
      <Phone x={486} y={1200} w={460} h={780}>
        <rect x="-198" y="-326" width="396" height="380" rx="14" fill="#9AD8FF" />
        <path d="M-198 54 L-198 -30 C-110 -30 -60 0 -20 54 Z" fill="#8A6A4A" />
        <path d="M198 54 L198 -60 L120 -60 L120 54 Z" fill="#8A6A4A" />
        <g transform={`translate(${30 + osc(T, 2) * 10} ${-150 + osc(T, 1) * 12}) rotate(-18)`}>
          <rect x="-60" y="40" width="120" height="16" rx="8" fill="#B3202A" />
          <circle cx="-38" cy="64" r="11" fill={INK} /><circle cx="38" cy="64" r="11" fill={INK} />
          <rect x="-16" y="-50" width="32" height="90" rx="14" fill="#E07A2E" />
          <circle cx="0" cy="-74" r="26" fill={SKIN} />
          <line x1="-14" y1="-30" x2="-60" y2="-60" stroke="#E07A2E" strokeWidth="16" strokeLinecap="round" />
          <line x1="14" y1="-30" x2="60" y2="-60" stroke="#E07A2E" strokeWidth="16" strokeLinecap="round" />
        </g>
        <g transform={`translate(-150 120) scale(${0.5 + down * 0.08})`}>
          <Heart x={0} y={0} fill={filled ? RED : '#fff'} stroke={INK} />
        </g>
        <text x="-100" y="140" fontFamily={FONT} fontWeight="900" fontSize="46" fill={INK}>{(9812 + Math.floor(T / 1.4)).toLocaleString('en-US')}</text>
        {[0, 1, 2, 3].map((k) => <rect key={k} x="-180" y={196 + k * 34} width={k % 2 ? 260 : 340} height="16" rx="8" fill="#D6D9E0" />)}
        <Burst T={T} x={-150} y={110} col={RED} />
      </Phone>
      {[0, 1, 2, 3].map((k) => {
        const q = ((T + k * 0.5) % 2) / 2;
        return <Heart key={k} x={170 + k * 210 + osc(T, 1.3, k) * 30} y={1000 - q * 260} s={0.3} fill={k % 2 ? RED : '#fff'} />;
      })}
      <g transform={`translate(${-down * 6} ${down * 26})`}>
        <ellipse cx="400" cy="1440" rx="70" ry="90" fill={SKIN} />
        <rect x="312" y="1290" width="46" height="130" rx="23" fill={SKIN} transform="rotate(-10 335 1355)" />
        <rect x="380" y="1520" width="130" height="220" rx="40" fill="#1F3B73" />
      </g>
    </g>
  );
}

/* 5 — same photo with few likes: thumb scrolls right past it */
function ArtFewLikes({ T }) {
  const p = (T % 1.6) / 1.6;
  const sw = MOTION.push(Math.min(1, p * 1.6));
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#255F69" />
      <Phone x={486} y={1180} w={420} h={720}>
        <g transform={`translate(0 ${-sw * 60})`}>
          <rect x="-178" y="-290" width="356" height="330" rx="14" fill="#9AD8FF" />
          <path d="M-178 40 L-178 -20 C-100 -20 -50 10 -10 40 Z" fill="#8A6A4A" />
          <circle cx="90" cy="-200" r="40" fill="#E8C547" />
          <Heart x={-130} y={100} s={0.46} fill="#fff" stroke={INK} />
          <text x="-80" y="122" fontFamily={FONT} fontWeight="900" fontSize="50" fill={INK}>3</text>
          {[0, 1, 2].map((k) => <rect key={k} x="-160" y={170 + k * 34} width={k % 2 ? 220 : 300} height="16" rx="8" fill="#D6D9E0" />)}
        </g>
      </Phone>
      {[0, 1, 2].map((k) => <line key={k} x1={720 + k * 40} y1={1180 + k * 30} x2={720 + k * 40} y2={1060 + k * 30} stroke={CREAM} strokeWidth="10" strokeLinecap="round" opacity={p < 0.6 ? 0.8 : 0.2} />)}
      <path d="M790 980 l40 -50 l40 50" fill="none" stroke={CREAM} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity={0.4 + 0.6 * Math.abs(osc(T, 1.6))} />
      <g transform={`translate(0 ${-sw * 140 + 60})`}>
        <ellipse cx="560" cy="1450" rx="60" ry="80" fill={SKIN} />
        <rect x="560" y="1500" width="120" height="240" rx="40" fill="#E07A2E" />
      </g>
      <text x="170" y="1650" fontFamily={FONT} fontWeight="900" fontSize="70" fill={CREAM} opacity={0.5 + 0.5 * Math.abs(osc(T, 2))}>meh</text>
    </g>
  );
}

/* 6 — own photo gets likes, reward region in the brain glows */
function ArtReward({ T }) {
  const br = 1 + osc(T, 2.6) * 0.015;
  const glow = 0.5 + 0.5 * Math.abs(osc(T, 1.1));
  const lobes = [[380, 1000, 120], [500, 935, 135], [612, 1008, 116], [420, 1130, 112], [562, 1132, 122], [650, 1112, 82], [330, 1086, 80]];
  return (
    <g>
      <circle cx="486" cy="1180" r="420" fill="#D26E25" />
      <g transform={`translate(486 1060) scale(${br}) translate(-486 -1060)`}>
        {lobes.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#F4A7B9" />)}
        {['M400 980 q30 -34 64 -2', 'M520 890 q16 44 62 26', 'M610 1050 q-22 40 18 74', 'M350 1106 q30 22 54 -12'].map((d) => (
          <path key={d} d={d} fill="none" stroke="#D9778F" strokeWidth="11" strokeLinecap="round" />
        ))}
        <circle cx="500" cy="1080" r={60 + glow * 50} fill="#FFE27A" opacity={0.25 * glow} />
        <circle cx="500" cy="1080" r="34" fill="#FFD23F" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="500" y1="1020" x2="500" y2={1000 - glow * 20} stroke="#FFD23F" strokeWidth="8" strokeLinecap="round" transform={`rotate(${i * 60} 500 1080)`} />
        ))}
      </g>
      <Phone x={300} y={1470} w={240} h={400} r={-8}>
        <rect x="-104" y="-150" width="208" height="200" rx="10" fill="#2B6E7A" />
        <circle cx="0" cy="-60" r="44" fill={SKIN} />
        <path d="M-80 50 C-80 -10 -40 -20 0 -20 C40 -20 80 -10 80 50 Z" fill="#B3202A" />
        <path d="M-22 -48 q22 18 44 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <Heart x={-60} y={110} s={0.3} />
        <text x="-30" y="124" fontFamily={FONT} fontWeight="900" fontSize="34" fill={INK}>{(2400 + Math.floor(T * 230)).toLocaleString('en-US')}</text>
      </Phone>
      {[0, 1, 2, 3].map((k) => {
        const q = ((T + k * 0.45) % 1.8) / 1.8;
        return <Heart key={k} x={330 + q * 170 + osc(T, 1, k) * 16} y={1300 - q * 200} s={0.22 + q * 0.06} opacity={1} fill={RED} />;
      })}
    </g>
  );
}

/* 7 — flip on "hide like counts", decide first */
function ArtHideToggle({ T, t }) {
  const on = tw(t, 1.0, 0.35);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#7A4DB2" />
      <Kid x={250} y={1350} T={T} s={0.8} shirt="#2B6E7A" look={12} mouth="smile" />
      <g transform={`translate(240 1000) rotate(${osc(T, 1.4) * 8})`}>
        <ellipse cx="0" cy="0" rx="72" ry="56" fill="#fff" />
        <circle cx="-60" cy="60" r="14" fill="#fff" />
        <path d="M-24 0 l16 18 l34 -38" fill="none" stroke="#2B6E7A" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Phone x={660} y={1220} w={360} h={640} r={4}>
        <Snap x={-148} y={-250} w={296} h={250} />
        <Heart x={-110} y={60} s={0.4} />
        <rect x="-70" y="30" width="190" height="56" rx="12" fill={'#E8C547'} opacity={on} />
        <rect x="-70" y="30" width="190" height="56" rx="12" fill="#D6D9E0" opacity={1 - on} />
        <text x="25" y="72" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill={INK} opacity={1 - on}>5,231</text>
        <text x="-140" y="160" fontFamily={FONT} fontWeight="800" fontSize="26" fill={INK}>Hide like counts</text>
        <rect x="60" y="190" width="100" height="54" rx="27" fill={on > 0.5 ? '#2B6E7A' : '#C9CCD3'} />
        <circle cx={88 + on * 44} cy="217" r="22" fill="#fff" />
      </Phone>
      <g transform={`translate(${-on * 30} ${on * 10})`}>
        <ellipse cx="880" cy="1520" rx="56" ry="70" fill={SKIN} />
        <rect x="820" y="1560" width="120" height="200" rx="40" fill="#E07A2E" />
      </g>
    </g>
  );
}

/* 8 — magnifying glass sweeping a feed full of numbers */
function ArtFollowLens({ T }) {
  const lx = 486 + osc(T, 3) * 190;
  const ly = 1180 + osc(T, 1.5) * 60;
  const nums = [['♥ 8,402', 300, 900], ['★ 4.9', 650, 1000], ['1.2M views', 320, 1240], ['#1 trending', 620, 1380], ['♥ 17', 360, 1560]];
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#284A8A" />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <rect x="196" y={830 + k * 280} width="580" height="240" rx="22" fill={CREAM} />
          <rect x="222" y={856 + k * 280} width="170" height="188" rx="12" fill={['#9AD8FF', '#F4A7B9', '#E8C547'][k]} />
          {[0, 1, 2].map((j) => <rect key={j} x="414" y={880 + k * 280 + j * 50} width={j === 1 ? 260 : 330} height="20" rx="10" fill="#C9C0AE" />)}
        </g>
      ))}
      {nums.map(([s, x, y], i) => {
        const d = Math.hypot(lx - x, ly - y);
        const v = clamp(1 - d / 260, 0, 1);
        return (
          <g key={i} opacity={0.15 + v} transform={`translate(${x} ${y}) scale(${0.8 + v * 0.5})`}>
            <rect x="-120" y="-44" width="240" height="72" rx="36" fill="#B3202A" />
            <text x="0" y="6" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill="#fff">{s}</text>
          </g>
        );
      })}
      <g transform={`translate(${lx} ${ly})`}>
        <line x1="110" y1="110" x2="230" y2="230" stroke={INK} strokeWidth="44" strokeLinecap="round" />
        <circle r="150" fill="#fff" opacity=".18" />
        <circle r="150" fill="none" stroke={INK} strokeWidth="26" />
        <path d="M-90 -50 A100 100 0 0 1 -40 -100" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
      </g>
    </g>
  );
}

Object.assign(window, { ArtPostHidden, ArtLikeCompare, ArtScanner, ArtLikeTap, ArtFewLikes, ArtReward, ArtHideToggle, ArtFollowLens });
