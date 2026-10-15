// art.jsx — scene illustrations for "Name the Feeling" (procrastination, Tice & Baumeister 1997). Pure functions of T.
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


const PF_FONT = 'Montserrat, sans-serif';
const PF_CONF = ['#1F3B73', '#B3202A', '#E8C547', '#2B6E7A', '#E07A2E', '#6A3FA0'];

/* shared — head + shoulders around (x, y) = top of the head */
function PfPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, mouth = 'smile', look = 0, s = 1, closed = false, brows = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-160 440 C-160 310 -96 262 0 262 C96 262 160 310 160 440 Z" fill={shirt} />
      <rect x="-36" y="196" width="72" height="84" rx="26" fill={SKIN2} />
      <circle cx="-104" cy="128" r="26" fill={SKIN2} />
      <circle cx="104" cy="128" r="26" fill={SKIN2} />
      <ellipse cx="0" cy="124" rx="104" ry="116" fill={SKIN} />
      <path d="M-106 114 C-112 30 -50 4 0 4 C62 4 114 34 106 108 C80 72 40 60 0 64 C-44 60 -86 78 -106 114 Z" fill={hair} />
      {closed ? (
        <g>
          <path d="M-56 132 q18 14 36 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
          <path d="M20 132 q18 14 36 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <Eye cx={-38} cy={132} T={T} ph={ph} rx={17} ry={17} look={look} />
          <Eye cx={38} cy={132} T={T} ph={ph} rx={17} ry={17} look={look} />
        </g>
      )}
      {brows !== 0 && <line x1="-58" y1={100 - brows * 8} x2="-20" y2={100 + brows * 4} stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {brows !== 0 && <line x1="20" y1={100 + brows * 4} x2="58" y2={100 - brows * 8} stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'smile' && <path d="M-30 184 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'frown' && <path d="M-26 196 q26 -20 52 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'wavy' && <path d="M-36 190 q9 -9 18 0 t18 0 t18 0 t18 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-22" y1="190" x2="22" y2="190" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      <ellipse cx="-68" cy="172" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="172" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

function PfCloud({ x, y, T, s = 1, rain = true, face = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {rain && [-60, -20, 20, 60].map((dx, i) => {
        const p = ((T * 1.4 + hsh(i)) % 1);
        return <line key={i} x1={dx} y1={40 + p * 120} x2={dx - 8} y2={70 + p * 120} stroke="#9AD8FF" strokeWidth="8" strokeLinecap="round" opacity={1 - p} />;
      })}
      <circle cx="-60" cy="0" r="54" fill="#7D8496" />
      <circle cx="10" cy="-30" r="72" fill="#7D8496" />
      <circle cx="80" cy="6" r="50" fill="#7D8496" />
      <rect x="-110" y="0" width="240" height="54" rx="27" fill="#7D8496" />
      {face && <circle cx="-14" cy="0" r="8" fill={INK} />}
      {face && <circle cx="34" cy="0" r="8" fill={INK} />}
      {face && <path d="M-8 34 q18 -16 36 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />}
    </g>
  );
}

/* 1 — on the couch with a phone, avoiding the to-do list under a rain cloud */
function ArtPfCouch({ T }) {
  const scroll = (T * 60) % 40;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      <rect x="80" y="1420" width="620" height="200" rx="60" fill="#B3202A" />
      <rect x="60" y="1340" width="120" height="280" rx="50" fill="#8E151D" />
      <rect x="600" y="1340" width="120" height="280" rx="50" fill="#8E151D" />
      <rect x="110" y="1620" width="40" height="80" fill="#6E1018" />
      <rect x="630" y="1620" width="40" height="80" fill="#6E1018" />
      <g transform={`rotate(${osc(T, 3) * 2} 380 1500)`}>
        <PfPerson x={380} y={1040} T={T} shirt="#E8C547" mouth="flat" look={-8} />
        <g transform={`translate(260 1380) rotate(-12)`}>
          <rect x="-46" y="-80" width="92" height="160" rx="16" fill={INK} />
          <rect x="-36" y="-66" width="72" height="132" rx="8" fill="#5B7BC0" />
          {[0, 1, 2, 3].map((k) => <rect key={k} x="-28" y={-58 + ((k * 40 - scroll + 160) % 160) * 0.75} width="56" height="20" rx="5" fill={CREAM} opacity=".8" />)}
        </g>
        <ellipse cx="282" cy="1440" rx="44" ry="36" fill={SKIN} />
      </g>
      <rect x="760" y="1450" width="160" height="30" rx="8" fill="#8B5E3C" />
      <rect x="820" y="1480" width="40" height="220" fill="#6E4A2F" />
      <g transform="translate(840 1380) rotate(6)">
        <rect x="-62" y="-80" width="124" height="150" rx="8" fill={CREAM} />
        <text x="0" y="-38" textAnchor="middle" fontFamily={PF_FONT} fontWeight="900" fontSize="28" fill={INK}>TO DO</text>
        {[0, 1, 2].map((k) => <rect key={k} x="-44" y={-18 + k * 28} width="88" height="10" rx="5" fill="#BDB6A6" />)}
      </g>
      <g transform={`translate(0 ${osc(T, 2.2) * 10})`}>
        <PfCloud x={840} y={1170} T={T} s={0.75} />
      </g>
    </g>
  );
}

/* 2 — a semester of calendar pages flipping past a student */
function ArtPfSemester({ T, t }) {
  const months = ['SEP', 'OCT', 'NOV', 'DEC'];
  const idx = Math.min(3, Math.floor(t / 0.9));
  const flip = clamp((t % 0.9) / 0.35, 0, 1);
  const walk = osc(T, 0.5);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#DDD6C5" />
      <g transform="translate(486 780)">
        <rect x="-170" y="0" width="340" height="300" rx="20" fill="#fff" stroke={INK} strokeWidth="8" />
        <rect x="-170" y="0" width="340" height="80" rx="20" fill="#2B6E7A" />
        <text x="0" y="58" textAnchor="middle" fontFamily={PF_FONT} fontWeight="900" fontSize="48" fill={CREAM}>{months[idx]}</text>
        {Array.from({ length: 15 }).map((_, i) => <rect key={i} x={-140 + (i % 5) * 58} y={104 + Math.floor(i / 5) * 60} width="40" height="40" rx="8" fill={i === (idx * 4 + 2) % 15 ? '#B3202A' : '#E2DCCD'} />)}
        {idx < 3 && <rect x="-170" y="0" width="340" height={300 * (1 - flip)} rx="20" fill="#E9E4D8" stroke={INK} strokeWidth="6" opacity={1 - flip} transform={`skewX(${-flip * 20})`} />}
        {[-120, -40, 40, 120].map((x) => <rect key={x} x={x - 8} y="-20" width="16" height="44" rx="8" fill={INK} />)}
      </g>
      <g transform={`translate(0 ${-Math.abs(walk) * 14})`}>
        <rect x="560" y="1340" width="130" height="190" rx="30" fill="#E07A2E" />
        <rect x="580" y="1430" width="90" height="60" rx="14" fill="#C2621F" />
        <PfPerson x={486} y={1180} T={T} shirt="#1F3B73" mouth="smile" look={-6} />
        <line x1="420" y1="1640" x2={420 + walk * 30} y2="1728" stroke={INK} strokeWidth="56" strokeLinecap="round" />
        <line x1="552" y1="1640" x2={552 - walk * 30} y2="1728" stroke={INK} strokeWidth="56" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* 3 — early on: relaxed in a hammock, the deadline still tiny and far away */
function ArtPfHammock({ T }) {
  const sw = osc(T, 2.8) * 16;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#C2333C" />
      <g transform="translate(780 820)">
        {Array.from({ length: 8 }).map((_, i) => <line key={i} x1="0" y1="-88" x2="0" y2="-118" stroke="#FFD23F" strokeWidth="10" strokeLinecap="round" transform={`rotate(${i * 45 + T * 20})`} />)}
        <circle r="70" fill="#FFD23F" />
      </g>
      <rect x="120" y="1180" width="30" height="520" rx="10" fill="#6E4A2F" />
      <rect x="822" y="1180" width="30" height="520" rx="10" fill="#6E4A2F" />
      <g transform={`rotate(${sw * 0.3} 486 1220)`}>
        <path d="M150 1260 Q486 1560 822 1260" fill="none" stroke={CREAM} strokeWidth="10" />
        <path d={`M200 1300 Q486 ${1600 + sw} 772 1300 Q486 ${1500 + sw} 200 1300 Z`} fill="#2B6E7A" />
        <g transform={`translate(0 ${sw * 0.5})`}>
          <ellipse cx="640" cy="1400" rx="160" ry="56" fill="#E8C547" />
          <circle cx="360" cy="1380" r="78" fill={SKIN} />
          <path d="M290 1360 C290 1300 340 1290 370 1294 C420 1296 440 1330 436 1360 C410 1340 380 1336 360 1338 C330 1336 306 1344 290 1360 Z" fill={INK} />
          <path d="M320 1390 q12 10 24 0 M374 1390 q12 10 24 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          <path d="M340 1420 q20 16 40 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        </g>
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T * 0.4 + k / 3) % 1);
        return <text key={k} x={380 + p * 120 + k * 10} y={1260 - p * 220} fontFamily={PF_FONT} fontWeight="900" fontSize={34 + k * 10} fill={CREAM} opacity={Math.sin(p * Math.PI)}>z</text>;
      })}
      <g transform={`translate(860 1120) rotate(${osc(T, 1.5) * 6})`}>
        <rect x="-26" y="-34" width="52" height="64" rx="5" fill={CREAM} opacity=".8" />
        <rect x="-16" y="-20" width="32" height="6" rx="3" fill="#B3202A" />
      </g>
    </g>
  );
}

/* 4 — end of term: crunch at the desk, sweat, a thermometer, grades sliding */
function ArtPfCrunch({ T }) {
  const shake = osc(T, 0.11) * 3;
  const drops = [[330, 1120, 0], [640, 1140, 0.7], [310, 1230, 1.4]];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D9B63A" />
      <g transform="translate(180 820)">
        <rect x="-110" y="-60" width="220" height="200" rx="16" fill={CREAM} stroke={INK} strokeWidth="8" />
        <polyline points="-80,-20 -30,10 10,0 70,100" fill="none" stroke="#B3202A" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 100 L82 106 L76 72" fill="none" stroke="#B3202A" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {[0, 1, 2, 3].map((k) => {
        const p = ((T * 0.5 + k / 4) % 1);
        return (
          <g key={k} transform={`translate(${640 + k * 60 + osc(T, 1, k) * 30} ${800 + p * 300}) rotate(${p * 200 + k * 40})`} opacity={1 - p * 0.6}>
            <rect x="-40" y="-50" width="80" height="100" rx="6" fill="#fff" />
            <rect x="-26" y="-30" width="52" height="8" rx="4" fill="#BDB6A6" />
          </g>
        );
      })}
      <g transform={`translate(${shake} 0)`}>
        <PfPerson x={486} y={1060} T={T} shirt="#6A3FA0" mouth="wavy" brows={-1} />
        <g transform="rotate(-20 560 1250)">
          <rect x="530" y="1244" width="110" height="18" rx="9" fill="#fff" stroke={INK} strokeWidth="4" />
          <circle cx="640" cy="1253" r="14" fill="#E2453C" />
        </g>
        {drops.map(([x, y, ph], i) => {
          const p = ((T + ph) % 2) / 2;
          return (
            <g key={i} transform={`translate(${x} ${y + p * 130})`} opacity={1 - p}>
              <path d="M0 -26 C10 -10 16 0 16 8 A16 16 0 0 1 -16 8 C-16 0 -10 -10 0 -26 Z" fill="#9AD8FF" />
            </g>
          );
        })}
      </g>
      <rect x="60" y="1560" width="852" height="40" rx="10" fill="#8B5E3C" />
      <rect x="380" y="1500" width="210" height="64" rx="6" fill={CREAM} />
      <rect x="400" y="1516" width="120" height="10" rx="5" fill="#BDB6A6" />
    </g>
  );
}

/* 5 — mood repair: avoiding the task snaps the mood needle to "better" — for now */
function ArtPfMood({ T, t }) {
  const k = tw(t, 0.8, 0.5);
  const ang = -60 + k * 120 + osc(T, 0.4) * 4;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#235E69" />
      <g transform="translate(486 1250)">
        <path d="M-300 0 A300 300 0 0 1 300 0 Z" fill={CREAM} />
        <path d="M-300 0 A300 300 0 0 1 -150 -260 L0 0 Z" fill="#E2453C" />
        <path d="M-150 -260 A300 300 0 0 1 150 -260 L0 0 Z" fill="#E8C547" />
        <path d="M150 -260 A300 300 0 0 1 300 0 L0 0 Z" fill="#3FAF7A" />
        <path d="M-230 -70 q20 -20 40 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" transform="rotate(180 -210 -75)" />
        <path d="M190 -80 q20 20 40 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <g transform={`rotate(${ang})`}>
          <path d="M-14 0 L0 -250 L14 0 Z" fill={INK} />
        </g>
        <circle r="34" fill={INK} />
        <rect x="-330" y="0" width="660" height="40" rx="14" fill="#1D4E57" />
      </g>
      <g transform={`translate(${720 - 90 * k} ${1500 + osc(T, 1.4) * 8}) rotate(${-20 + k * 10})`}>
        <rect x="-110" y="-40" width="220" height="80" rx="40" fill="#F2C69B" />
        <rect x="-40" y="-40" width="80" height="80" fill="#E5AE7C" />
        {[[-20, -16], [20, -16], [-20, 16], [20, 16]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill="#C98A62" />)}
      </g>
      <g transform={`translate(230 ${1520 + osc(T, 2) * 6})`} opacity={1 - 0.5 * k}>
        <rect x="-70" y="-90" width="140" height="170" rx="10" fill="#fff" />
        <text x="0" y="-40" textAnchor="middle" fontFamily={PF_FONT} fontWeight="900" fontSize="30" fill={INK}>TASK</text>
        {[0, 1, 2].map((i) => <rect key={i} x="-50" y={-14 + i * 28} width="100" height="10" rx="5" fill="#BDB6A6" />)}
      </g>
    </g>
  );
}

/* 6 — the task isn't the problem; the gloomy cloud it brings is */
function ArtPfCloud({ T, t }) {
  const rise = tw(t, 0.4, 0.8);
  const duck = Math.abs(osc(T, 1.6)) * 30;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D26E25" />
      <g transform="translate(280 1500)">
        <rect x="-170" y="-200" width="340" height="220" rx="16" fill={INK} />
        <rect x="-150" y="-182" width="300" height="184" rx="8" fill={CREAM} />
        {[0, 1, 2, 3].map((k) => <rect key={k} x="-120" y={-150 + k * 40} width={k === 0 ? 140 : 230} height="14" rx="7" fill={k === 0 ? '#E07A2E' : '#BDB6A6'} />)}
        <path d="M-220 20 L220 20 L190 60 L-190 60 Z" fill="#3A3F4B" />
      </g>
      <g transform={`translate(0 ${-rise * 380 + osc(T, 1.8) * 10})`} opacity={rise}>
        <path d={`M280 1300 q${osc(T, 1) * 20} -100 0 -200`} fill="none" stroke="#7D8496" strokeWidth="18" strokeLinecap="round" opacity=".6" />
        <PfCloud x={300} y={1220} T={T} s={1.05} />
      </g>
      <g transform={`translate(${duck * 0.6} ${duck}) rotate(${10 + duck * 0.2} 700 1700)`}>
        <PfPerson x={700} y={1140} T={T} ph={0.5} s={0.85} shirt="#1F3B73" mouth="frown" look={-12} brows={1} />
        <line x1="620" y1="1460" x2="560" y2="1220" stroke="#1F3B73" strokeWidth="44" strokeLinecap="round" />
        <circle cx="556" cy="1206" r="32" fill={SKIN} />
      </g>
    </g>
  );
}

/* 7 — name the feeling on a sticky note, then a two-minute timer */
function ArtPfTimer({ T, t }) {
  const sweep = clamp(t / 4, 0, 1) * 360;
  const tap = Math.abs(osc(T, 0.25));
  const labels = ['BORED?', 'ANXIOUS?'];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#7A4FB2" />
      <g transform="translate(700 900)">
        <rect x="-20" y="-150" width="40" height="40" rx="8" fill={INK} />
        <circle r="120" fill={CREAM} stroke={INK} strokeWidth="14" />
        <path d={`M0 0 L0 -100 A100 100 0 ${sweep > 180 ? 1 : 0} 1 ${Math.sin(sweep * Math.PI / 180) * 100} ${-Math.cos(sweep * Math.PI / 180) * 100} Z`} fill="#E8C547" opacity=".8" />
        <line x1="0" y1="0" x2="0" y2="-92" stroke="#B3202A" strokeWidth="8" strokeLinecap="round" transform={`rotate(${sweep})`} />
        <circle r="10" fill={INK} />
        <text x="0" y="66" textAnchor="middle" fontFamily={PF_FONT} fontWeight="900" fontSize="40" fill={INK}>2:00</text>
      </g>
      {labels.map((l, i) => (
        <g key={l} transform={`translate(${200 + i * 30} ${820 + i * 150}) rotate(${(i ? 5 : -6) + osc(T, 2, i * 0.3) * 2}) scale(${tw(t, 0.2 + i * 0.4, 0.35)})`}>
          <rect x="-120" y="-56" width="240" height="112" rx="6" fill={i ? '#9AD8FF' : '#FFE27A'} />
          <text x="0" y="16" textAnchor="middle" fontFamily={PF_FONT} fontWeight="900" fontSize="42" fill={INK}>{l}</text>
        </g>
      ))}
      <PfPerson x={486} y={1180} T={T} ph={0.3} shirt="#E07A2E" mouth="smile" look={6} />
      <path d="M200 1560 L772 1560 L740 1660 L232 1660 Z" fill="#3A3F4B" />
      <rect x="250" y="1576" width="472" height="60" rx="8" fill="#5A606E" />
      <ellipse cx="380" cy={1580 - tap * 14} rx="56" ry="34" fill={SKIN} />
      <ellipse cx="592" cy={1580 - (1 - tap) * 14} rx="56" ry="34" fill={SKIN} />
    </g>
  );
}

/* 8 — first box ticked, thumbs up, confetti */
function ArtPfCheck({ T, t }) {
  const tick = tw(t, 0.6, 0.4);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      {Array.from({ length: 22 }).map((_, i) => {
        const p = ((T * (0.3 + hsh(i) * 0.3) + hsh(i + 7)) % 1);
        const x = 80 + hsh(i + 3) * 812 + osc(T, 1.3, hsh(i)) * 20;
        return <rect key={i} x="-9" y="-15" width="18" height="30" rx="3" fill={PF_CONF[i % 6]} transform={`translate(${x} ${720 + p * 1000}) rotate(${T * 200 + i * 40})`} opacity={tick} />;
      })}
      <g transform={`translate(300 1180) rotate(${-5 + osc(T, 2.4) * 2})`}>
        <rect x="-170" y="-260" width="340" height="460" rx="20" fill="#8B5E3C" />
        <rect x="-140" y="-220" width="280" height="400" rx="8" fill={CREAM} />
        <rect x="-60" y="-280" width="120" height="50" rx="14" fill="#9EA3AD" />
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x="-110" y={-170 + k * 110} width="60" height="60" rx="10" fill="#fff" stroke={INK} strokeWidth="6" />
            <rect x="-30" y={-150 + k * 110} width={k ? 110 : 130} height="16" rx="8" fill={k ? '#BDB6A6' : INK} />
          </g>
        ))}
        <path d="M-100 -142 l18 18 l34 -40" fill="none" stroke="#3FAF7A" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - tick)} />
      </g>
      <g transform={`translate(0 ${-Math.abs(osc(T, 1)) * 14})`}>
        <PfPerson x={680} y={1240} T={T} ph={1.2} s={0.9} shirt="#2B6E7A" mouth="smile" look={-6} />
        <line x1="790" y1="1520" x2="850" y2={1300 + osc(T, 0.8) * 10} stroke="#2B6E7A" strokeWidth="46" strokeLinecap="round" />
        <g transform={`translate(856 ${1270 + osc(T, 0.8) * 10})`}>
          <rect x="-34" y="-20" width="68" height="60" rx="18" fill={SKIN} />
          <rect x="-14" y="-62" width="26" height="54" rx="13" fill={SKIN} />
        </g>
      </g>
    </g>
  );
}

Object.assign(window, { ArtPfCouch, ArtPfSemester, ArtPfHammock, ArtPfCrunch, ArtPfMood, ArtPfCloud, ArtPfTimer, ArtPfCheck });
