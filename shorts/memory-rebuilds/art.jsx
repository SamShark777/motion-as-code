// art.jsx — scene illustrations for "Your Memory Rebuilds" (Loftus & Palmer 1974). Pure functions of T.
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



/* shared — a person: head centred at (x, y), torso below */
function MrPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0, long = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {long && <path d="M-120 -20 C-150 120 -130 230 -90 260 L90 260 C130 230 150 120 120 -20 Z" fill={hair} />}
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} />
      <circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <Eye cx={-40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      <Eye cx={40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      <ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — a side-view cartoon car facing right (flip = -1 faces left) */
function MrCar({ x, y, color = '#B3202A', flip = 1, s = 1, dent = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip * s} ${s})`}>
      <path d={`M-150 0 L-150 -60 Q-150 -76 -134 -78 L-80 -82 L-40 -140 L60 -140 L110 -82 L${150 - dent} -70 Q${160 - dent} -66 ${160 - dent} -50 L${160 - dent} 0 Z`} fill={color} />
      <path d="M-26 -126 L50 -126 L88 -84 L-56 -84 Z" fill="#CFE6F5" />
      <rect x="10" y="-126" width="12" height="44" fill={color} />
      <rect x={140 - dent} y="-56" width="20" height="18" rx="4" fill="#FFE08A" />
      <circle cx="-88" cy="0" r="36" fill={INK} />
      <circle cx="-88" cy="0" r="14" fill="#C9CCD3" />
      <circle cx="92" cy="0" r="36" fill={INK} />
      <circle cx="92" cy="0" r="14" fill="#C9CCD3" />
    </g>
  );
}

/* 1 — two honest people, two different memories of the same car */
function ArtMrHonest({ T }) {
  const bob = osc(T, 2.4) * 8;
  return (
    <g>
      <circle cx="486" cy="1260" r="430" fill="#264684" />
      {[[250, '#B3202A', 0, '#E8C547', false], [722, '#2B6E7A', 0.5, '#E07A2E', true]].map(([x, car, ph, shirt, long], i) => (
        <g key={i}>
          <g transform={`translate(0 ${i ? -bob : bob})`}>
            <ellipse cx={x} cy="860" rx="200" ry="130" fill={CREAM} />
            <circle cx={x + (i ? -70 : 70)} cy="1010" r="24" fill={CREAM} />
            <circle cx={x + (i ? -40 : 40)} cy="1060" r="14" fill={CREAM} />
            <g transform={`translate(${x} ${900 + osc(T, 0.4, ph) * 3})`}>
              <MrCar x={0} y={0} color={car} s={0.9} flip={i ? -1 : 1} />
            </g>
          </g>
          <MrPerson x={x} y={1330} T={T} ph={ph} shirt={shirt} mouth="smile" long={long} hair={i ? '#5A3A22' : INK} skin={i ? SKIN2 : SKIN} look={i ? -8 : 8} s={0.9} />
        </g>
      ))}
      <text x="486" y={1250 + osc(T, 1, 0.2) * 10} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="120" fill="#E8C547">≠</text>
    </g>
  );
}

/* 2 — a projector plays a car-crash film to an audience */
function ArtMrFilms({ T }) {
  const p = (T % 2.4) / 2.4;
  const meet = Math.min(p / 0.5, 1);
  const hit = p > 0.5 ? Math.exp(-(p - 0.5) * 8) : 0;
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#DDD6C5" />
      <rect x="120" y="720" width="732" height="440" rx="14" fill="#141821" />
      <rect x="140" y="740" width="692" height="400" fill="#F7F4EC" opacity={0.85 + 0.1 * osc(T, 0.13)} />
      <rect x="140" y="1080" width="692" height="60" fill="#BDB6A6" />
      <g transform={`translate(${osc(T, 0.07) * 6 * hit} 0)`}>
        <MrCar x={280 + meet * 150} y={1080} color="#B3202A" s={0.75} dent={hit * 20} />
        <MrCar x={692 - meet * 150} y={1080} color="#1F3B73" s={0.75} flip={-1} dent={hit * 20} />
      </g>
      {hit > 0.05 && [0, 1, 2, 3, 4, 5].map((k) => (
        <line key={k} x1="486" y1="990" x2="486" y2={990 - 60 - hit * 50} stroke="#E8C547" strokeWidth="12" strokeLinecap="round" transform={`rotate(${k * 60 - 150} 486 1000)`} opacity={hit} />
      ))}
      <polygon points="430,1660 542,1660 832,1140 140,1140" fill="#fff" opacity="0.12" />
      <g transform="translate(486 1660)">
        <rect x="-90" y="-50" width="180" height="110" rx="18" fill="#2B2B33" />
        <circle cx="-40" cy="-90" r="50" fill="#2B2B33" />
        <circle cx="50" cy="-90" r="50" fill="#2B2B33" />
        <g transform={`rotate(${T * 220} -40 -90)`}>{[0, 120, 240].map((a) => <circle key={a} cx="-40" cy="-118" r="10" fill="#6A6F7A" transform={`rotate(${a} -40 -90)`} />)}</g>
        <g transform={`rotate(${T * 220} 50 -90)`}>{[0, 120, 240].map((a) => <circle key={a} cx="50" cy="-118" r="10" fill="#6A6F7A" transform={`rotate(${a} 50 -90)`} />)}</g>
      </g>
      {[110, 300, 672, 862].map((x, i) => (
        <g key={x} transform={`translate(${x} ${1560 + osc(T, 1.8, i * 0.2) * 5})`}>
          <circle r="80" fill={i % 2 ? '#2A2A33' : INK} />
          <ellipse cy="200" rx="150" ry="140" fill={i % 2 ? '#2A2A33' : INK} />
        </g>
      ))}
    </g>
  );
}

/* 3 — the question card; the word SMASHED slams into the blank */
function ArtMrWord({ T, t }) {
  const d = tw(t, 0.6, 0.3);
  const shake = t > 0.9 && t < 1.5 ? Math.sin(t * 60) * 10 * (1.5 - t) : 0;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#9E1B24" />
      <g transform={`translate(${shake} 0) rotate(-3 486 1100)`}>
        <rect x="140" y="820" width="692" height="520" rx="26" fill={CREAM} />
        <rect x="390" y="790" width="192" height="70" rx="18" fill="#7A5A2E" />
        <text x="486" y="950" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="56" fill={INK}>HOW FAST</text>
        <text x="486" y="1020" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="46" fill={INK}>were the cars going</text>
        <text x="486" y="1084" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="46" fill={INK}>when they</text>
        <rect x="236" y="1120" width="500" height="120" rx="14" fill="none" stroke={INK} strokeWidth="6" strokeDasharray="18 14" opacity=".4" />
        <text x="486" y="1300" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="40" fill={INK}>into each other?</text>
      </g>
      <g transform={`translate(486 ${1180 - (1 - d) * 420}) rotate(${-4 + (1 - d) * 20}) scale(${1 + (1 - d) * 0.4})`} opacity={d > 0 ? 1 : 0}>
        <rect x="-250" y="-62" width="500" height="124" rx="14" fill="#B3202A" stroke={INK} strokeWidth="8" />
        <text y="28" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="84" fill={CREAM}>SMASHED</text>
      </g>
      {d >= 1 && [-1, 1].map((sd) => [0, 1, 2].map((k) => (
        <line key={`${sd}${k}`} x1={486 + sd * 280} y1={1150 + k * 30} x2={486 + sd * (330 + 20 * Math.abs(osc(T, 0.3, k * 0.2)))} y2={1130 + k * 40} stroke={CREAM} strokeWidth="10" strokeLinecap="round" />
      )))}
      <MrPerson x={190} y={1540} T={T} s={0.62} shirt="#2B6E7A" mouth="o" brow={-12} look={10} />
    </g>
  );
}

/* 4 — two speedometers: "smashed" 41 mph vs "hit" 34 mph */
function ArtMrSpeed({ T, t }) {
  const gauges = [[260, 'SMASHED', 41, '#B3202A'], [712, 'HIT', 34, '#1F3B73']];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D9B53A" />
      {gauges.map(([x, label, v, c], i) => {
        const p = tw(t, 0.3 + i * 0.4, 1.0);
        const val = v * p + (p >= 1 ? osc(T, 0.25, i * 0.3) * 0.8 : 0);
        const ang = -120 + (val / 60) * 240;
        return (
          <g key={i} transform={`translate(${x} 1180)`}>
            <circle r="210" fill={INK} />
            <circle r="188" fill={CREAM} />
            {Array.from({ length: 13 }).map((_, k) => (
              <line key={k} x1="0" y1="-170" x2="0" y2={k % 2 ? -150 : -135} stroke={INK} strokeWidth={k % 2 ? 5 : 9} strokeLinecap="round" transform={`rotate(${-120 + k * 20})`} />
            ))}
            <path d="M-118 120 A170 170 0 0 1 -60 -158" fill="none" stroke="#2B6E7A" strokeWidth="10" opacity=".3" />
            <line x1="0" y1="20" x2="0" y2="-150" stroke={c} strokeWidth="12" strokeLinecap="round" transform={`rotate(${ang})`} />
            <circle r="22" fill={INK} />
            <text y="110" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="72" fill={INK}>{Math.round(v * p)}</text>
            <text y="150" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="28" fill={INK} opacity=".6">MPH</text>
            <g transform={`translate(0 290) rotate(${osc(T, 1.6, i * 0.5) * 3})`}>
              <rect x="-160" y="-50" width="320" height="100" rx="18" fill={c} />
              <text y="22" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={label.length > 3 ? 56 : 64} fill={CREAM}>{label}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

/* 5 — scanning the crash scene for broken glass that was never there */
function ArtMrGlass({ T }) {
  const mx = 486 + osc(T, 2.8) * 250, my = 1500 + osc(T, 1.4) * 40;
  const ghost = 0.25 + 0.25 * Math.abs(osc(T, 1.6));
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#24606B" />
      <rect x="0" y="1300" width="972" height="428" fill="#3C4452" />
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={40 + k * 200} y="1600" width="120" height="16" rx="8" fill="#E8C547" />)}
      <MrCar x={340} y={1290} color="#B3202A" />
      <MrCar x={640} y={1290} color="#1F3B73" flip={-1} />
      {[[400, 1440, 10], [520, 1480, -30], [600, 1420, 40], [460, 1540, 70]].map(([x, y, r], i) => (
        <path key={i} d="M0 -30 L26 10 L-6 30 L-28 0 Z" fill="none" stroke="#9AD8FF" strokeWidth="5" strokeDasharray="10 8" opacity={ghost} transform={`translate(${x} ${y}) rotate(${r})`} />
      ))}
      <g transform={`translate(${mx} ${my})`}>
        <circle r="110" fill="#CFE6F5" opacity=".35" />
        <circle r="110" fill="none" stroke={INK} strokeWidth="22" />
        <line x1="78" y1="78" x2="190" y2="190" stroke={INK} strokeWidth="40" strokeLinecap="round" />
        <text y="40" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="120" fill={CREAM}>?</text>
      </g>
      <g transform={`translate(486 ${880 + osc(T, 1.2) * 10})`}>
        <rect x="-170" y="-60" width="340" height="120" rx="60" fill={CREAM} />
        <text y="22" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="58" fill="#2B6E7A">NO GLASS</text>
      </g>
    </g>
  );
}

/* 6 — hands up: 32% of the "smashed" group vs 14% of the "hit" group */
function ArtMrYes({ T, t }) {
  const p = tw(t, 0.3, 1.1);
  const bars = [[300, 32, 'SMASHED', '#B3202A'], [672, 14, 'HIT', '#1F3B73']];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D26E25" />
      <rect x="100" y="1500" width="772" height="14" rx="7" fill={INK} />
      {bars.map(([x, v, label, c], i) => {
        const h = v * 18 * p;
        return (
          <g key={i}>
            <rect x={x - 110} y={1500 - h} width="220" height={h} rx="14" fill={c} />
            <text x={x} y={1480 - h} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="80" fill={CREAM}>{Math.round(v * p)}%</text>
            <g transform={`translate(${x} ${1440 - h - 120 + osc(T, 0.6, i * 0.3) * 10}) rotate(${osc(T, 0.6, i * 0.3) * 8})`} opacity={p}>
              <rect x="-20" y="10" width="40" height="80" rx="16" fill={i ? SKIN2 : SKIN} />
              <ellipse cx="0" cy="0" rx="36" ry="44" fill={i ? SKIN2 : SKIN} />
              {[-24, -8, 8, 24].map((fx) => <rect key={fx} x={fx - 7} y="-66" width="14" height="40" rx="7" fill={i ? SKIN2 : SKIN} />)}
            </g>
            <text x={x} y="1580" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="50" fill={INK}>{label}</text>
          </g>
        );
      })}
      <text x="486" y="1680" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="40" fill={CREAM}>"I saw broken glass"</text>
    </g>
  );
}

/* 7 — memory rebuilds: blocks drop into a head and stack into a scene; the film strip is crossed out */
function ArtMrRebuild({ T, t }) {
  const blocks = [[360, 1360, '#E8C547'], [470, 1360, '#B3202A'], [580, 1360, '#2B6E7A'], [415, 1250, '#E07A2E'], [525, 1250, '#E9E4D8'], [470, 1140, '#B3202A']];
  const x = tw(t, 1.8, 0.4);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#7B4FB3" />
      <path d="M250 1660 L250 1500 C150 1440 150 1250 190 1150 C240 960 420 880 560 900 C760 930 830 1080 800 1250 L860 1340 L800 1370 L800 1480 C800 1540 740 1550 680 1540 L680 1660 Z" fill="#4E2C7A" />
      {blocks.map(([bx, by, c], i) => {
        const p = ((T * 0.5 + i / blocks.length) % 1);
        const fall = Math.min(p / 0.35, 1);
        const y = by - (1 - MOTION.pop(fall)) * 420;
        return (
          <g key={i} opacity={p > 0.9 ? (1 - p) * 10 : 1}>
            <rect x={bx - 50} y={y - 50} width="100" height="100" rx="12" fill={c} stroke={INK} strokeWidth="6" />
          </g>
        );
      })}
      <g transform={`translate(780 820) rotate(${8 + osc(T, 2) * 3})`}>
        <rect x="-110" y="-70" width="220" height="140" fill={INK} />
        {[-80, -40, 0, 40, 80].map((fx) => <g key={fx}><rect x={fx - 8} y="-60" width="16" height="14" fill={CREAM} /><rect x={fx - 8} y="46" width="16" height="14" fill={CREAM} /></g>)}
        <rect x="-80" y="-34" width="160" height="68" fill="#8A93A6" />
        <line x1="-120" y1="-80" x2={-120 + 240 * x} y2={-80 + 160 * x} stroke="#E8C547" strokeWidth="16" strokeLinecap="round" opacity={x > 0 ? 1 : 0} />
      </g>
      <g transform="translate(330 1020)">
        <Eye cx={0} cy={0} T={T} rx={26} ry={24} look={10} />
      </g>
    </g>
  );
}

/* 8 — write it down soon; two people disagree kindly */
function ArtMrWrite({ T }) {
  const pen = (T * 0.8) % 1;
  const lines = [0, 1, 2, 3];
  return (
    <g>
      <circle cx="486" cy="1250" r="430" fill="#264684" />
      <MrPerson x={250} y={940} T={T} s={0.62} shirt="#E8C547" mouth="smile" look={10} />
      <MrPerson x={722} y={940} T={T} ph={0.7} s={0.62} shirt="#2B6E7A" mouth="smile" long hair="#5A3A22" skin={SKIN2} look={-10} />
      <path d="M380 860 q40 -40 80 0 M512 860 q40 -40 80 0" fill="none" stroke="#E8C547" strokeWidth="8" strokeLinecap="round" opacity={0.5 + 0.5 * Math.abs(osc(T, 1))} />
      <g transform="rotate(-4 486 1450)">
        <rect x="190" y="1220" width="592" height="460" rx="20" fill={CREAM} />
        <rect x="190" y="1220" width="592" height="70" rx="20" fill="#B3202A" />
        {Array.from({ length: 8 }).map((_, k) => <circle key={k} cx={240 + k * 70} cy="1222" r="14" fill={INK} />)}
        {lines.map((k) => {
          const done = Math.floor(T * 0.8) % lines.length;
          const w = k < done ? 440 : k === done ? 440 * pen : 0;
          return <path key={k} d={`M250 ${1360 + k * 80} h${w}`} stroke={INK} strokeWidth="10" strokeLinecap="round" opacity={w > 0 ? 0.8 : 0} />;
        })}
      </g>
      {(() => {
        const k = Math.floor(T * 0.8) % lines.length;
        return (
          <g transform={`translate(${250 + 440 * pen} ${1340 + k * 80 + osc(T, 0.12) * 6}) rotate(30)`}>
            <rect x="-16" y="-170" width="32" height="160" rx="8" fill="#E07A2E" />
            <path d="M-16 -10 L16 -10 L0 26 Z" fill={SKIN} />
            <path d="M-5 14 L5 14 L0 26 Z" fill={INK} />
            <ellipse cx="10" cy="-60" rx="46" ry="38" fill={SKIN} />
          </g>
        );
      })()}
    </g>
  );
}

Object.assign(window, { ArtMrHonest, ArtMrFilms, ArtMrWord, ArtMrSpeed, ArtMrGlass, ArtMrYes, ArtMrRebuild, ArtMrWrite });
