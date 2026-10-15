// art.jsx — scene illustrations for "Highlight Reel" (Ted type 2). Pure functions of T.
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

/* shared — a simple person (head + torso), (x, y) = top of the head */
function HrPal({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', s = 1, look = 0, tired = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-150 420 C-150 300 -90 250 0 250 C90 250 150 300 150 420 Z" fill={shirt} />
      <rect x="-34" y="190" width="68" height="80" rx="24" fill={SKIN2} />
      <circle cx="0" cy="120" r="104" fill={skin} />
      <path d="M-104 112 C-110 30 -50 4 0 4 C62 4 112 34 104 104 C80 70 40 58 0 62 C-44 58 -84 76 -104 112 Z" fill={hair} />
      <Eye cx={-38} cy={128} T={T} ph={ph} rx={17} ry={tired ? 10 : 17} look={look} />
      <Eye cx={38} cy={128} T={T} ph={ph} rx={17} ry={tired ? 10 : 17} look={look} />
      {tired && <path d="M-58 142 q20 10 40 0 M18 142 q20 10 40 0" fill="none" stroke="#9B7FA8" strokeWidth="6" strokeLinecap="round" />}
      {mouth === 'smile' && <path d="M-30 176 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'flat' && <path d="M-24 182 q12 -8 24 0 t24 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'sad' && <path d="M-26 190 q26 -20 52 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'grin' && <path d="M-38 168 A38 32 0 0 0 38 168 Z" fill={INK} />}
      <ellipse cx="-68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — a floating heart (like icon) */
function HrHeart({ x, y, s = 1, fill = '#E2453C', op = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      <rect x="-20" y="-20" width="40" height="40" fill={fill} transform="rotate(45)" />
      <circle cx="-14" cy="-14" r="20" fill={fill} />
      <circle cx="14" cy="-14" r="20" fill={fill} />
    </g>
  );
}

/* shared — a perfect beach-sunset photo, drawn in a w×h box at (x, y) */
function HrSunset({ x, y, w, h, T }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} fill="#F6A86B" />
      <rect width={w} height={h * 0.45} fill="#F27D6B" />
      <circle cx={w * 0.5} cy={h * 0.6} r={h * 0.2} fill="#FFE07A" />
      <rect y={h * 0.62} width={w} height={h * 0.2} fill="#2B6E7A" />
      {[0, 1, 2].map((k) => <rect key={k} x={w * (0.2 + k * 0.22) + osc(T, 2, k * 0.3) * 8} y={h * (0.66 + k * 0.04)} width={w * 0.16} height="6" rx="3" fill="#9FD6DD" />)}
      <rect y={h * 0.82} width={w} height={h * 0.18} fill="#F3D9A4" />
    </g>
  );
}

/* 1 — tired person on the couch scrolling a perfect sunset post */
function ArtHrCouch({ T }) {
  const slouch = osc(T, 3) * 3;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      <g transform={`translate(610 760) rotate(${osc(T, 2.6) * 3})`}>
        <rect x="-150" y="0" width="300" height="420" rx="34" fill={INK} />
        <HrSunset x={-130} y={30} w={260} h={300} T={T} />
        <circle cx="-30" cy="250" r="34" fill={SKIN} />
        <path d="M-58 300 C-58 270 -2 270 -2 300 Z" fill="#E8C547" />
        <path d="M-44 252 q14 12 28 0" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <rect x="-110" y="350" width="140" height="14" rx="7" fill="#5B6378" />
        <HrHeart x={90} y={366} s={0.7} />
      </g>
      {[0, 1, 2, 3].map((k) => {
        const p = ((T + k * 0.6) % 2.4) / 2.4;
        return <HrHeart key={k} x={720 + osc(T, 1.4, k * 0.25) * 30 + k * 30} y={1120 - p * 380} s={0.6 + p * 0.4} op={Math.sin(p * Math.PI)} />;
      })}
      <rect x="60" y="1380" width="852" height="220" rx="60" fill="#6A3FA0" />
      <rect x="60" y="1300" width="200" height="300" rx="60" fill="#5A3290" />
      <rect x="0" y="1590" width="972" height="138" fill="#162B55" />
      <g transform={`rotate(${slouch} 330 1500)`}>
        <HrPal x={330} y={1060} T={T} shirt="#7A8194" hair="#3A1A14" mouth="flat" tired look={8} />
        <path d="M250 1010 l-20 -40 M300 994 l-6 -46 M360 996 l12 -44" stroke="#3A1A14" strokeWidth="14" strokeLinecap="round" />
        <line x1="420" y1="1400" x2="470" y2="1300" stroke="#7A8194" strokeWidth="56" strokeLinecap="round" />
        <rect x="446" y="1236" width="56" height="92" rx="10" fill={INK} transform="rotate(14 474 1282)" />
        <rect x="454" y="1246" width="40" height="64" rx="4" fill="#F6A86B" transform="rotate(14 474 1282)" opacity={0.7 + 0.3 * osc(T, 0.5)} />
      </g>
      <g transform="translate(700 1640)">
        <rect x="-110" y="-28" width="220" height="40" rx="6" fill="#C98A62" />
        <path d="M-90 -28 L-60 -64 L20 -64 L-10 -28 Z" fill="#E8C547" />
        <circle cx="-40" cy="-46" r="7" fill="#B3202A" />
      </g>
    </g>
  );
}

/* 2 — a polaroid smile inside the frame; laundry, rain and dishes outside it */
function ArtHrFrame({ T }) {
  const flash = (T % 2.8) < 0.12 ? 1 : 0;
  const sway = osc(T, 3.2) * 2.5;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#DDD6C5" />
      <g transform="translate(150 1000)">
        <path d="M-90 0 C-90 -50 -40 -70 0 -56 C20 -96 90 -96 104 -50 C150 -60 170 0 130 18 L-70 18 C-110 18 -110 0 -90 0 Z" fill="#8C93A6" />
        {[0, 1, 2, 3].map((k) => {
          const p = ((T * 1.4 + k * 0.27) % 1);
          return <line key={k} x1={-50 + k * 50} y1={40 + p * 140} x2={-58 + k * 50} y2={70 + p * 140} stroke="#5B8FD6" strokeWidth="9" strokeLinecap="round" opacity={1 - p} />;
        })}
      </g>
      <g transform="translate(170 1560)">
        {[['#B3202A', -60, 0], ['#2B6E7A', 30, -10], ['#E8C547', -20, -50], ['#6A3FA0', 50, -60], [CREAM, -40, -96]].map(([c, x, y], i) => (
          <ellipse key={i} cx={x} cy={y + osc(T, 2, i * 0.2) * 3} rx="70" ry="34" fill={c} transform={`rotate(${(i % 2 ? 1 : -1) * 12} ${x} ${y})`} />
        ))}
      </g>
      <g transform="translate(810 1580)">
        <rect x="-100" y="-10" width="200" height="90" rx="14" fill="#9AA0AE" />
        {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={osc(T, 3, k) * 4} cy={-14 - k * 26} rx="86" ry="18" fill={k % 2 ? '#F4F1EA' : '#D8D2C2'} stroke={INK} strokeWidth="4" />)}
        {[0, 1].map((k) => {
          const p = ((T + k) % 2) / 2;
          return <circle key={k} cx={-40 + k * 60} cy={-130 - p * 90} r={10 + p * 10} fill="none" stroke="#9AD8FF" strokeWidth="5" opacity={1 - p} />;
        })}
      </g>
      <g transform={`rotate(${sway} 486 1260)`}>
        <rect x="290" y="960" width="392" height="470" rx="10" fill="#fff" />
        <HrSunset x={316} y={986} w={340} h={340} T={T} />
        <HrPal x={486} y={1110} T={T} s={0.52} shirt="#E8C547" mouth="grin" ph={0.4} />
        <rect x="346" y="1360" width="160" height="16" rx="8" fill="#C9C0AE" />
        <HrHeart x={620} y={1372} s={0.6} />
      </g>
      {[[280, 950], [692, 950], [280, 1440], [692, 1440]].map(([x, y], i) => (
        <path key={i} d={`M${x + (i % 2 ? -50 : 50)} ${y} L${x} ${y} L${x} ${y + (i < 2 ? 50 : -50)}`} fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      ))}
      <rect x="0" y="0" width="972" height="1728" fill="#fff" opacity={flash * 0.35} />
    </g>
  );
}

/* 3 — a researcher with a clipboard surveys students under campus arches */
function ArtHrCampus({ T, t }) {
  const ticks = [0, 1, 2].map((k) => tw(t, 0.6 + k * 0.6, 0.3));
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#9E1B24" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <rect x={90 + k * 220} y="820" width="70" height="380" fill="#E9C9A0" />
          <path d={`M${160 + k * 220} 820 A80 80 0 0 1 ${310 + k * 220} 820`} fill="none" stroke="#E9C9A0" strokeWidth="40" opacity={k < 3 ? 1 : 0} />
        </g>
      ))}
      <rect x="40" y="780" width="892" height="40" fill="#D6AF7E" />
      <rect x="0" y="1200" width="972" height="528" fill="#7E1720" />
      <g transform={`translate(0 ${osc(T, 1.6) * 4})`}>
        <HrPal x={250} y={1120} T={T} shirt="#2B6E7A" mouth="smile" look={14} />
        <line x1="340" y1="1440" x2="400" y2="1380" stroke="#2B6E7A" strokeWidth="50" strokeLinecap="round" />
        <g transform="rotate(8 420 1380)">
          <rect x="370" y="1290" width="130" height="170" rx="10" fill="#C98A62" />
          <rect x="384" y="1312" width="102" height="138" rx="4" fill="#fff" />
          <rect x="414" y="1280" width="42" height="22" rx="6" fill="#9AA0AE" />
          {ticks.map((k, i) => (
            <g key={i}>
              <rect x="396" y={1330 + i * 40} width="20" height="20" rx="3" fill="none" stroke={INK} strokeWidth="4" />
              <path d={`M398 ${1340 + i * 40} l8 8 l14 -18`} fill="none" stroke="#B3202A" strokeWidth="6" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={40 - 40 * k} />
              <rect x="428" y={1336 + i * 40} width="46" height="8" rx="4" fill="#C9C0AE" />
            </g>
          ))}
        </g>
      </g>
      {[[620, '#E8C547', 0.2, '#3A1A14'], [800, '#E07A2E', 0.5, INK]].map(([x, c, ph, hair], i) => {
        const raise = Math.max(0, osc(T, 1.8, ph)) * 40;
        return (
          <g key={i}>
            <line x1={x + 60} y1="1440" x2={x + 90} y2={1180 - raise} stroke={c} strokeWidth="40" strokeLinecap="round" />
            <circle cx={x + 92} cy={1166 - raise} r="26" fill={SKIN} />
            <HrPal x={x} y={1200} T={T} ph={ph} s={0.72} shirt={c} hair={hair} mouth={i ? 'smile' : 'flat'} look={-10} />
          </g>
        );
      })}
    </g>
  );
}

/* 4 — the real peer has a big storm cloud; the guess pictures a tiny one */
function ArtHrClouds({ T }) {
  const drift = osc(T, 2.2) * 10;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D9B53A" />
      <g transform={`translate(${620 + drift} 800)`}>
        <path d="M-180 60 C-190 -10 -110 -50 -60 -20 C-30 -100 90 -100 110 -20 C190 -40 220 60 150 80 L-150 80 C-200 80 -200 60 -180 60 Z" fill="#5C6273" />
        {[0, 1, 2, 3, 4].map((k) => {
          const p = ((T * 1.2 + k * 0.21) % 1);
          return <line key={k} x1={-120 + k * 60} y1={100 + p * 260} x2={-128 + k * 60} y2={136 + p * 260} stroke="#3F79C9" strokeWidth="10" strokeLinecap="round" opacity={1 - p} />;
        })}
      </g>
      <HrPal x={640} y={1150} T={T} ph={0.3} shirt="#6A3FA0" mouth="sad" look={-6} />
      <path d={`M560 1250 q-8 ${20 + osc(T, 1.1) * 6} 0 34`} fill="none" stroke="#9AD8FF" strokeWidth="10" strokeLinecap="round" />
      <g transform={`translate(240 830) scale(${1 + osc(T, 2.4) * 0.02})`}>
        <ellipse cx="0" cy="0" rx="190" ry="150" fill="#fff" />
        <circle cx="-30" cy="190" r="26" fill="#fff" />
        <circle cx="-50" cy="250" r="16" fill="#fff" />
        <path d="M-64 138 C-64 106 -34 96 0 96 C34 96 64 106 64 138 Z" fill="#6A3FA0" />
        <circle cx="0" cy="40" r="56" fill={SKIN} />
        <path d="M-56 30 C-58 -20 -20 -32 0 -32 C34 -32 60 -14 56 26 C40 8 20 2 0 4 C-24 2 -46 12 -56 30 Z" fill={INK} />
        <path d="M-18 60 q18 14 36 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <g transform={`translate(${osc(T, 1.5) * 8} -70) scale(0.28)`}>
          <path d="M-180 60 C-190 -10 -110 -50 -60 -20 C-30 -100 90 -100 110 -20 C190 -40 220 60 150 80 L-150 80 C-200 80 -200 60 -180 60 Z" fill="#9AA0AE" />
        </g>
      </g>
      <HrPal x={200} y={1300} T={T} s={0.8} shirt="#2B6E7A" mouth="smile" look={12} ph={0.8} />
      <rect x="0" y="1660" width="972" height="68" fill="#C9A22E" />
    </g>
  );
}

/* 5 — the guess blows up a peer's party: balloons, party hat, confetti */
const HR_CONF = ['#1F3B73', '#B3202A', '#E8C547', '#E07A2E', '#6A3FA0', CREAM];
function ArtHrParty({ T, t }) {
  const grow = 0.7 + 0.3 * tw(t, 0.3, 1.2);
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#35808D" />
      <g transform={`translate(486 1010) scale(${grow}) translate(-486 -1010)`}>
        <ellipse cx="486" cy="1010" rx="360" ry="290" fill="#fff" />
        {Array.from({ length: 18 }, (_, i) => {
          const y = 760 + ((T * (90 + hsh(i) * 80) + hsh(i + 5) * 480) % 480);
          const x = 200 + hsh(i + 2) * 570 + osc(T, 1.3, hsh(i)) * 16;
          return <rect key={i} x={-7} y={-12} width="14" height="24" rx="3" fill={HR_CONF[i % HR_CONF.length]} transform={`translate(${x} ${y}) rotate(${T * 200 * (hsh(i + 9) - 0.5)})`} />;
        })}
        {[[330, '#B3202A', 0], [640, '#E8C547', 0.4], [720, '#6A3FA0', 0.8]].map(([x, c, ph], i) => (
          <g key={i} transform={`translate(${x} ${860 + osc(T, 1.8, ph) * 14})`}>
            <path d="M0 70 q-14 50 6 110" fill="none" stroke={INK} strokeWidth="4" />
            <ellipse cx="0" cy="0" rx="50" ry="64" fill={c} />
            <ellipse cx="-16" cy="-22" rx="10" ry="18" fill="#fff" opacity=".4" />
          </g>
        ))}
        <HrPal x={486} y={890} T={T} s={0.62} shirt="#E07A2E" mouth="grin" ph={0.2} />
        <path d="M440 900 L486 790 L532 900 Z" fill="#B3202A" />
        <circle cx="486" cy="790" r="14" fill="#E8C547" />
        {[0, 1, 2].map((k) => <circle key={k} cx={466 + k * 20} cy={870 - k * 26} r="6" fill="#E8C547" />)}
      </g>
      <circle cx="380" cy="1340" r="26" fill="#fff" />
      <circle cx="330" cy="1400" r="16" fill="#fff" />
      <HrPal x={250} y={1420} T={T} s={0.72} shirt="#1F3B73" mouth="flat" look={10} />
      <rect x="0" y="1690" width="972" height="38" fill="#1D4E57" />
    </g>
  );
}

/* 6 — a lone student on a bench under a streetlamp, leaves falling */
function ArtHrBench({ T }) {
  const glow = 0.5 + 0.15 * osc(T, 1.7);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#C9661F" />
      <circle cx="790" cy="820" r="70" fill="#F7D9A8" />
      <circle cx="818" cy="804" r="62" fill="#C9661F" />
      <polygon points="230,860 300,860 470,1640 60,1640" fill="#FFE3A3" opacity={glow * 0.4} />
      <rect x="252" y="840" width="26" height="820" fill={INK} />
      <path d="M220 860 L310 860 L290 820 L240 820 Z" fill={INK} />
      <ellipse cx="265" cy="872" rx="30" ry="12" fill="#FFE3A3" opacity={glow + 0.3} />
      <rect x="340" y="1490" width="520" height="30" rx="10" fill="#6E4A2F" />
      <rect x="340" y="1420" width="520" height="24" rx="10" fill="#6E4A2F" />
      <rect x="370" y="1520" width="24" height="140" fill="#4A3020" />
      <rect x="806" y="1520" width="24" height="140" fill="#4A3020" />
      <g transform={`translate(0 ${Math.max(0, osc(T, 3)) * 8})`}>
        <path d="M480 1500 L460 1640 M560 1500 L580 1640" stroke="#3A3F4F" strokeWidth="44" strokeLinecap="round" />
        <HrPal x={520} y={1100} T={T} ph={1.1} s={0.9} shirt="#5B6378" hair="#3A1A14" mouth="sad" look={-4} />
        <path d="M430 1420 q90 40 180 0" fill="none" stroke="#5B6378" strokeWidth="46" strokeLinecap="round" />
      </g>
      {[0, 1, 2, 3].map((k) => {
        const p = ((T * 0.35 + hsh(k)) % 1);
        const x = 380 + hsh(k + 3) * 480 + Math.sin(p * 9 + k) * 40;
        return <ellipse key={k} cx={x} cy={760 + p * 900} rx="18" ry="9" fill={k % 2 ? '#B3202A' : '#E8C547'} transform={`rotate(${p * 540} ${x} ${760 + p * 900})`} opacity={1 - Math.max(0, p - 0.85) / 0.15} />;
      })}
      <rect x="0" y="1660" width="972" height="68" fill="#A8521A" />
    </g>
  );
}

/* 7 — the post shows a perfect cake; outside the phone, the kitchen mess */
function ArtHrOutside({ T, t }) {
  const point = tw(t, 0.5, 0.6);
  const tap = Math.abs(osc(T, 1.2)) * 10;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#5A3290" />
      <g transform="translate(250 1180) rotate(-4)">
        <rect x="-170" y="-330" width="340" height="560" rx="40" fill={INK} />
        <rect x="-150" y="-290" width="300" height="400" rx="8" fill="#F6E7D0" />
        <rect x="-100" y="-60" width="200" height="120" rx="10" fill="#F4A7B9" />
        <rect x="-100" y="-60" width="200" height="30" rx="10" fill="#fff" />
        <rect x="-110" y="56" width="220" height="16" rx="8" fill="#C9C0AE" />
        {[-50, 0, 50].map((x, i) => (
          <g key={x}>
            <rect x={x - 6} y="-110" width="12" height="50" fill="#E8C547" />
            <ellipse cx={x} cy={-122 + osc(T, 0.4, i * 0.3) * 3} rx="9" ry="16" fill="#E07A2E" />
          </g>
        ))}
        <HrHeart x={110} y={150} s={0.7} />
        <rect x="-130" y="140" width="160" height="14" rx="7" fill="#5B6378" />
      </g>
      <g transform="translate(700 1440)">
        <rect x="-190" y="40" width="380" height="40" rx="10" fill="#8B5E3C" />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={-130 + osc(T, 2.5, k * 0.2) * 3} y={20 - k * 30} width="180" height="26" rx="12" fill={k % 2 ? '#F4F1EA' : '#D8D2C2'} stroke={INK} strokeWidth="4" />)}
        <path d="M60 40 C60 -20 160 -20 160 40 Z" fill="#7A8194" />
        <path d="M150 0 l50 -40" stroke="#7A8194" strokeWidth="14" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={-160 + hsh(k) * 340} cy={-30 - hsh(k + 4) * 60 - Math.abs(osc(T, 1.5, k * 0.2)) * 20} r={8 + hsh(k + 7) * 8} fill="#FFF6E6" opacity=".9" />)}
        <path d="M-170 30 C-140 -10 -100 10 -90 -20 C-70 10 -40 -10 -20 30 Z" fill="#3A1A14" />
      </g>
      <g opacity={point}>
        <path d="M430 1060 C560 960 640 1060 650 1300" fill="none" stroke="#E8C547" strokeWidth="12" strokeDasharray="22 18" strokeLinecap="round" />
        <path d="M624 1270 L650 1316 L684 1276" fill="none" stroke="#E8C547" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform={`translate(0 ${tap})`}>
        <ellipse cx="430" cy="1050" rx="44" ry="34" fill={SKIN} />
        <rect x="380" y="1050" width="60" height="200" rx="26" fill={SKIN} transform="rotate(-30 410 1050)" />
        <rect x="414" y="980" width="26" height="80" rx="13" fill={SKIN} transform="rotate(30 427 1020)" />
      </g>
    </g>
  );
}

/* 8 — relaxed person scrolling, a feed of study cards floating up, feather drifting */
function ArtHrScroll({ T }) {
  const scroll = (T * 120) % 200;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#264684" />
      <g>
        <rect x="560" y="760" width="320" height="600" rx="40" fill={INK} />
        <clipPath id="hrFeedClip"><rect x="580" y="790" width="280" height="540" rx="10" /></clipPath>
        <g clipPath="url(#hrFeedClip)">
          <rect x="580" y="790" width="280" height="540" fill="#F4F1EA" />
          {[0, 1, 2, 3, 4].map((k) => {
            const y = 800 + k * 200 - scroll;
            const c = ['#E8C547', '#2B6E7A', '#E07A2E', '#B3202A', '#6A3FA0'][k];
            return (
              <g key={k}>
                <rect x="596" y={y} width="248" height="180" rx="14" fill={c} />
                <rect x="630" y={y + 40} width="80" height="62" rx="6" fill={CREAM} />
                <line x1="670" y1={y + 40} x2="670" y2={y + 102} stroke={INK} strokeWidth="4" />
                <rect x="726" y={y + 46} width="96" height="12" rx="6" fill={CREAM} opacity=".8" />
                <rect x="726" y={y + 72} width="70" height="12" rx="6" fill={CREAM} opacity=".8" />
                <rect x="616" y={y + 130} width="190" height="12" rx="6" fill={INK} opacity=".25" />
              </g>
            );
          })}
        </g>
      </g>
      <g transform={`translate(${200 + osc(T, 3) * 80} ${860 + Math.abs(osc(T, 1.5)) * 40}) rotate(${osc(T, 1.5) * 30})`}>
        <path d="M0 -70 C40 -40 40 40 0 70 C-40 40 -40 -40 0 -70 Z" fill={CREAM} />
        <line x1="0" y1="-60" x2="0" y2="90" stroke="#C9C0AE" strokeWidth="5" />
      </g>
      <g transform={`translate(0 ${osc(T, 2.2) * 6})`}>
        <HrPal x={340} y={1140} T={T} shirt="#E8C547" mouth="smile" look={14} ph={0.5} />
        <line x1="440" y1="1500" x2="560" y2="1340" stroke="#E8C547" strokeWidth="54" strokeLinecap="round" />
        <circle cx="568" cy="1330" r="34" fill={SKIN} />
        <ellipse cx="584" cy={1300 - Math.abs(osc(T, 0.8)) * 14} rx="12" ry="20" fill={SKIN} />
      </g>
      <rect x="0" y="1650" width="972" height="78" fill="#162B55" />
    </g>
  );
}

Object.assign(window, { ArtHrCouch, ArtHrFrame, ArtHrCampus, ArtHrClouds, ArtHrParty, ArtHrBench, ArtHrOutside, ArtHrScroll });
