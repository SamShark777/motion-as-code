// art.jsx — scene illustrations for "Left Brain? Myth" (Nielsen et al. 2013). Pure functions of T.
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

const BLUE = '#5B8DEF', PINK = '#F4A7B9', PINK2 = '#D9778F';
function HalfBrain({ x, y, side = -1, fill = PINK, line = PINK2, s = 1 }) {
  // top-view hemisphere; side -1 = left, 1 = right
  return (
    <g transform={`translate(${x} ${y}) scale(${side * s} ${s})`}>
      <path d="M-8 -190 C-90 -200 -170 -140 -176 -40 C-182 60 -150 170 -60 196 C-30 204 -12 196 -8 180 Z" fill={fill} />
      {['M-40 -150 q-50 20 -40 70', 'M-130 -60 q40 10 70 -20', 'M-150 50 q50 -10 80 30', 'M-60 120 q-40 0 -60 40', 'M-40 10 q-30 30 0 60'].map((d) => (
        <path key={d} d={d} fill="none" stroke={line} strokeWidth="10" strokeLinecap="round" />
      ))}
    </g>
  );
}

/* 1 — a "which brain are you?" quiz, kid scratching head */
function ArtBrainQuiz({ T }) {
  const pen = osc(T, 0.5) * 10;
  const scratch = osc(T, 0.35) * 14;
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#284A8A" />
      <g transform={`rotate(${-6 + osc(T, 3) * 2} 640 1150)`}>
        <rect x="470" y="850" width="360" height="520" rx="24" fill="#B98A55" />
        <rect x="496" y="890" width="308" height="456" rx="10" fill="#fff" />
        <rect x="590" y="830" width="120" height="50" rx="14" fill="#8C8F99" />
        <text x="650" y="966" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill={INK}>WHICH BRAIN</text>
        <text x="650" y="1008" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill={INK}>ARE YOU?</text>
        {[['LEFT · logic', 1080], ['RIGHT · art', 1180]].map(([s, y], i) => (
          <g key={s}>
            <rect x="524" y={y - 34} width="44" height="44" rx="8" fill="none" stroke={INK} strokeWidth="6" />
            {i === Math.floor(T / 1.5) % 2 && <path d={`M530 ${y - 14} l12 14 l24 -30`} fill="none" stroke="#B3202A" strokeWidth="8" strokeLinecap="round" />}
            <text x="584" y={y} fontFamily={FONT} fontWeight="800" fontSize="32" fill={INK}>{s}</text>
          </g>
        ))}
        <g transform={`translate(${720 + pen} ${1260}) rotate(35)`}>
          <rect x="-12" y="-120" width="24" height="120" fill="#E8C547" />
          <path d="M-12 0 L12 0 L0 26 Z" fill={SKIN2} />
          <rect x="-12" y="-136" width="24" height="18" fill="#E2453C" />
        </g>
      </g>
      <Kid x={300} y={1290} T={T} shirt="#E07A2E" look={14} mouth="flat" />
      <line x1="200" y1="1500" x2={170} y2={1150 + scratch} stroke="#E07A2E" strokeWidth="60" strokeLinecap="round" />
      <circle cx={180} cy={1120 + scratch} r="36" fill={SKIN} />
      {[0, 1].map((k) => {
        const p = ((T + k * 1.1) % 2.2) / 2.2;
        return <text key={k} x={350 + k * 70} y={1000 - p * 140} fontFamily={FONT} fontWeight="900" fontSize="80" fill={CREAM} opacity={Math.sin(p * Math.PI)}>?</text>;
      })}
    </g>
  );
}

/* 2 — the myth picture: a head split into logic half and art half */
function ArtSplitHead({ T, t }) {
  const gap = 10 + Math.abs(osc(T, 2)) * 26;
  const g1 = T * 60;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#DDD6C5" />
      <path d="M296 1728 C296 1540 380 1480 486 1480 C592 1480 676 1540 676 1728 Z" fill="#2B6E7A" />
      <rect x="446" y="1380" width="80" height="120" rx="28" fill={SKIN2} />
      <g transform={`translate(${-gap} 0)`}>
        <path d="M486 900 C380 900 300 980 300 1110 C300 1240 360 1330 420 1370 C450 1400 486 1410 486 1410 Z" fill="#3E6FD1" />
        {[[400, 1060, 50, 0], [440, 1210, 36, 1]].map(([x, y, r, i]) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${i ? -g1 * 1.4 : g1})`}>
            {[0, 45, 90, 135].map((a) => <rect key={a} x={-10} y={-r - 14} width="20" height={2 * r + 28} rx="5" fill={CREAM} transform={`rotate(${a})`} />)}
            <circle r={r} fill={CREAM} /><circle r={r * 0.4} fill="#3E6FD1" />
          </g>
        ))}
        <text x="350" y="1320" fontFamily={FONT} fontWeight="900" fontSize="44" fill={CREAM}>2+2</text>
      </g>
      <g transform={`translate(${gap} 0)`}>
        <path d="M486 900 C592 900 672 980 672 1110 C672 1240 612 1330 552 1370 C522 1400 486 1410 486 1410 Z" fill="#E07A2E" />
        {[[560, 1020, 38, '#E8C547'], [620, 1140, 30, '#B3202A'], [540, 1250, 42, '#6A3FA0'], [610, 1290, 22, '#2B6E7A']].map(([x, y, r, c], i) => (
          <circle key={i} cx={x} cy={y} r={r * (1 + 0.12 * osc(T, 1.2, i * 0.2))} fill={c} />
        ))}
        <g transform={`translate(640 960) rotate(${30 + osc(T, 0.8) * 10})`}>
          <rect x="-8" y="0" width="16" height="110" rx="6" fill="#8A6A4A" />
          <path d="M-14 0 L14 0 L6 -40 L-6 -40 Z" fill="#B3202A" />
        </g>
      </g>
      <Eye cx={430} cy={1180} T={T} rx={22} ry={22} />
      <Eye cx={542} cy={1180} T={T} rx={22} ry={22} />
    </g>
  );
}

/* 3 — over a thousand brain scans popping in, researcher counting */
function ArtScanStack({ T, t }) {
  const shown = Math.floor((T * 9) % 36);
  const count = Math.min(1000, Math.floor(tw(t, 0.2, 3.2) * 1000));
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#9E1B24" />
      {Array.from({ length: 24 }, (_, i) => {
        const cx = 200 + (i % 6) * 114, cy = 820 + Math.floor(i / 6) * 120;
        const on = (i + 36 - shown) % 36 < 24;
        return (
          <g key={i} opacity={on ? 1 : 0.25}>
            <rect x={cx - 50} y={cy - 50} width="100" height="100" rx="14" fill="#3B0B10" />
            <ellipse cx={cx - 13} cy={cy} rx="22" ry="34" fill={PINK} />
            <ellipse cx={cx + 13} cy={cy} rx="22" ry="34" fill={PINK} />
            <circle cx={cx + (hsh(i) > 0.5 ? -14 : 14)} cy={cy - 8 + hsh(i + 9) * 16} r="8" fill="#E8C547" opacity={0.5 + 0.5 * Math.abs(osc(T, 1.1, hsh(i)))} />
          </g>
        );
      })}
      <rect x="300" y="1310" width="372" height="96" rx="48" fill={CREAM} />
      <text x="486" y="1376" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="58" fill="#B3202A">{count >= 1000 ? '1,000+' : count}</text>
      <Kid x={486} y={1560} T={T} s={0.7} shirt={CREAM} hair="#5A3A22" look={osc(T, 2) * 10} mouth="o" />
      <g transform={`translate(${486 - 95} ${1560 - 10})`} fill="none" stroke={INK} strokeWidth="7">
        <circle cx="64" cy="18" r="26" /><circle cx="126" cy="18" r="26" /><path d="M90 18 h10" />
      </g>
    </g>
  );
}

/* 4 — some jobs lean to one side: language left, attention right */
function ArtLanguage({ T }) {
  const a = Math.abs(osc(T, 1.6));
  const b = Math.abs(osc(T, 1.6, 0.25));
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#D9B53A" />
      <HalfBrain x={476} y={1200} side={-1} fill={a > 0.5 ? '#F7B8C7' : PINK} />
      <HalfBrain x={496} y={1200} side={1} />
      <circle cx="380" cy="1150" r={50 + a * 30} fill="#fff" opacity={0.25 * a} />
      <circle cx="600" cy="1240" r={40 + b * 24} fill="#fff" opacity={0.2 * b} />
      <g transform={`translate(240 ${880 + osc(T, 1.2) * 10})`}>
        <path d="M-110 -70 h220 a30 30 0 0 1 30 30 v80 a30 30 0 0 1 -30 30 h-150 l-40 40 v-40 h-30 a30 30 0 0 1 -30 -30 v-80 a30 30 0 0 1 30 -30 Z" fill="#fff" />
        <text x="0" y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="60" fill={INK}>abc</text>
      </g>
      <line x1="280" y1="990" x2="370" y2="1110" stroke={INK} strokeWidth="8" strokeDasharray="6 16" strokeLinecap="round" />
      <g transform={`translate(740 ${900 + osc(T, 1.4) * 10})`}>
        <ellipse rx="100" ry="58" fill="#fff" />
        <circle r="38" fill="#2B6E7A" /><circle r="18" fill={INK} />
        <circle cx="-12" cy="-12" r="8" fill="#fff" />
        <rect x="-100" y={-60} width="200" height={60 * (1 - blink(T, 0.4)) * 1.1} fill="#D9B53A" />
      </g>
      <line x1="700" y1="980" x2="610" y2="1180" stroke={INK} strokeWidth="8" strokeDasharray="6 16" strokeLinecap="round" />
      <text x="300" y="1480" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill={INK}>LEFT</text>
      <text x="672" y="1480" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill={INK}>RIGHT</text>
    </g>
  );
}

/* 5 — a balance scale: neither half is stronger overall */
function ArtBalance({ T }) {
  const tilt = osc(T, 2.4) * 4 * (0.6 + 0.4 * Math.abs(osc(T, 7)));
  const rad = (tilt * Math.PI) / 180;
  const ly = -Math.sin(rad) * 260, ry = Math.sin(rad) * 260;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#255F69" />
      <path d="M380 1660 L592 1660 L540 1600 L432 1600 Z" fill={INK} />
      <rect x="474" y="1000" width="24" height="610" rx="10" fill={INK} />
      <circle cx="486" cy="990" r="26" fill="#E8C547" />
      <g transform={`rotate(${tilt} 486 1000)`}>
        <rect x="216" y="988" width="540" height="24" rx="12" fill={INK} />
      </g>
      {[[226, ly, -1], [746, ry, 1]].map(([x, dy, side]) => (
        <g key={side} transform={`translate(0 ${dy})`}>
          <line x1={x} y1="1000" x2={x - 100} y2="1260" stroke={CREAM} strokeWidth="6" />
          <line x1={x} y1="1000" x2={x + 100} y2="1260" stroke={CREAM} strokeWidth="6" />
          <path d={`M${x - 130} 1260 h260 q-20 60 -130 60 q-110 0 -130 -60 Z`} fill={CREAM} />
          <HalfBrain x={x - side * 30} y={1170} side={side} s={0.45} />
        </g>
      ))}
      <text x="486" y="1430" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="120" fill={CREAM} opacity={0.7 + 0.3 * Math.abs(osc(T, 1.5))}>=</text>
    </g>
  );
}

/* 6 — one kid painting and calculating, both halves lit */
function ArtBothSides({ T }) {
  const sw = osc(T, 0.8) * 30;
  const tap = Math.abs(osc(T, 0.4));
  const glow = 0.6 + 0.4 * Math.abs(osc(T, 1.2));
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#D26E25" />
      <circle cx="486" cy="880" r={150 + glow * 20} fill="#FFE27A" opacity={0.25 * glow} />
      <HalfBrain x={476} y={880} side={-1} s={0.55} fill="#F7B8C7" />
      <HalfBrain x={496} y={880} side={1} s={0.55} fill="#F7B8C7" />
      {[-1, 1].map((s) => [0, 1, 2].map((k) => (
        <line key={`${s}${k}`} x1={486 + s * 120} y1={830 + k * 50} x2={486 + s * (150 + glow * 20)} y2={810 + k * 60} stroke="#FFD23F" strokeWidth="8" strokeLinecap="round" />
      )))}
      <Kid x={486} y={1270} T={T} s={0.8} shirt="#2B6E7A" look={0} mouth="smile" />
      <line x1="380" y1="1460" x2={250} y2={1340 + sw * 0.3} stroke="#2B6E7A" strokeWidth="54" strokeLinecap="round" />
      <g transform={`translate(240 ${1320 + sw * 0.3}) rotate(${-30 + sw})`}>
        <rect x="-9" y="-130" width="18" height="130" rx="6" fill="#8A6A4A" />
        <path d="M-14 -130 L14 -130 L6 -170 L-6 -170 Z" fill="#6A3FA0" />
      </g>
      <circle cx="240" cy={1330 + sw * 0.3} r="32" fill={SKIN} />
      <path d={`M120 1620 q60 ${-40 + sw} 140 0 t140 0`} fill="none" stroke="#6A3FA0" strokeWidth="18" strokeLinecap="round" opacity=".85" />
      <line x1="592" y1="1460" x2="720" y2="1400" stroke="#2B6E7A" strokeWidth="54" strokeLinecap="round" />
      <g transform="translate(760 1360)">
        <rect x="-70" y="-110" width="140" height="200" rx="16" fill={INK} />
        <rect x="-54" y="-94" width="108" height="44" rx="6" fill="#9AD8FF" />
        <text x="44" y="-60" textAnchor="end" fontFamily={FONT} fontWeight="900" fontSize="30" fill={INK}>{Math.floor(T * 3) % 2 ? '4' : '2+2'}</text>
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-50 + (i % 3) * 36} y={-36 + Math.floor(i / 3) * 36} width="28" height="26" rx="5" fill={i === Math.floor(T * 2.5) % 9 ? '#E8C547' : '#3A3F4D'} />)}
      </g>
      <ellipse cx="730" cy={1420 - tap * 10} rx="34" ry="30" fill={SKIN} />
    </g>
  );
}

/* 7 — the quiz label crumpled into the bin */
function ArtQuizTrash({ T }) {
  const p = (T % 2.2) / 2.2;
  const bx = 330 + p * 330, by = 1050 - Math.sin(p * Math.PI) * 220 + p * 320;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#7A4DB2" />
      <Kid x={290} y={1300} T={T} s={0.85} shirt="#E8C547" look={14} mouth="smile" />
      <g transform={`translate(${p < 0.15 ? 380 : 2000} 980) rotate(-8)`}>
        <rect x="-150" y="-50" width="300" height="100" rx="16" fill="#fff" />
        <text x="0" y="16" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill="#B3202A">LEFT-BRAINED</text>
      </g>
      {p >= 0.15 && p < 0.92 && (
        <g transform={`translate(${bx} ${by}) rotate(${T * 400})`}>
          <circle r="46" fill="#fff" />
          <path d="M-30 -10 l20 14 l14 -24 l22 18 M-20 24 l24 -10 l18 12" fill="none" stroke="#C9CCD3" strokeWidth="6" />
        </g>
      )}
      <g transform="translate(700 1420)">
        <path d="M-120 -20 L120 -20 L96 260 L-96 260 Z" fill="#C9CCD3" />
        <rect x="-136" y="-50" width="272" height="40" rx="12" fill="#9EA3AD" />
        {[-60, 0, 60].map((x) => <line key={x} x1={x} y1="20" x2={x * 0.85} y2="230" stroke="#9EA3AD" strokeWidth="10" strokeLinecap="round" />)}
      </g>
      {p > 0.9 && <Burst T={T} x={700} y={1360} r0={90} r1={160} period={2.2} ph={-0.9 * 2.2} col={CREAM} />}
    </g>
  );
}

/* 8 — the MYTH balloon inflates and pops */
function ArtMythPop({ T }) {
  const P = 3;
  const p = (T % P) / P;
  const grow = 0.6 + 0.4 * MOTION.push(Math.min(1, p / 0.7));
  const popped = p > 0.72;
  const ph = (p - 0.72) / 0.28;
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#284A8A" />
      {!popped && (
        <g transform={`translate(486 1080) scale(${grow}) rotate(${osc(T, 1.4) * 4})`}>
          <ellipse rx="210" ry="250" fill="#B3202A" />
          <ellipse cx="-80" cy="-110" rx="40" ry="70" fill="#fff" opacity=".25" transform="rotate(25 -80 -110)" />
          <path d="M-20 248 L20 248 L0 276 Z" fill="#8E151D" />
          <text x="0" y="30" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="100" fill={CREAM}>MYTH</text>
        </g>
      )}
      {!popped && <path d={`M486 ${1080 + 276 * grow} q-30 80 0 160 t0 160`} fill="none" stroke={CREAM} strokeWidth="5" />}
      {popped && Array.from({ length: 22 }, (_, i) => {
        const a = hsh(i) * TAU, d = 80 + ph * (260 + hsh(i + 5) * 220);
        return <rect key={i} x="-14" y="-24" width="28" height="48" rx="4" fill={i % 3 ? '#B3202A' : CREAM} opacity={1 - ph}
          transform={`translate(${486 + Math.cos(a) * d} ${1080 + Math.sin(a) * d + ph * ph * 200}) rotate(${a * 57 + ph * 400})`} />;
      })}
      <g transform={`translate(${780 - (popped ? 0 : (1 - grow) * 100)} 1180) rotate(-35)`}>
        <rect x="-8" y="0" width="16" height="190" rx="6" fill="#C9CCD3" />
        <circle cx="0" cy="-6" r="28" fill="#E8C547" />
      </g>
      <Kid x={250} y={1500} T={T} s={0.7} shirt="#E07A2E" look={12} mouth={popped ? 'o' : 'smile'} />
    </g>
  );
}

Object.assign(window, { ArtBrainQuiz, ArtSplitHead, ArtScanStack, ArtLanguage, ArtBalance, ArtBothSides, ArtQuizTrash, ArtMythPop });
