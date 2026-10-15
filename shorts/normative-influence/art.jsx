// art.jsx — scene illustrations for "Just To Fit In" (normative social influence, Asch 1956). Pure functions of T.
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

/* shared bust: head centre at (x, y), scale s */
function NormBust({ x, y, s = 1, T, ph = 0, shirt = '#B3202A', hair = '#3A1A14', skin = SKIN, hairStyle = 'short', mouth = 'smile', mo = 0, look = 0, rot = 0 }) {
  const M = {
    smile: <path d="M-30 50 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
    flat: <path d="M-26 58 h52" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
    wavy: <path d="M-36 60 q9 -9 18 0 t18 0 t18 0 t18 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />,
    open: <ellipse cx="0" cy="58" rx="22" ry={8 + mo * 16} fill="#3A0C10" />,
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot} 0 200)`}>
      {hairStyle === 'long' && <path d="M-134 -10 C-146 -150 -50 -156 0 -156 C60 -156 146 -140 134 -10 L146 190 L-146 190 Z" fill={hair} />}
      <path d="M-210 700 L-210 330 C-210 210 -130 160 0 160 C130 160 210 210 210 330 L210 700 Z" fill={shirt} />
      <rect x="-36" y="70" width="72" height="110" rx="26" fill={SKIN2} />
      <circle cx="-106" cy="12" r="22" fill={SKIN2} />
      <circle cx="106" cy="12" r="22" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="104" ry="118" fill={skin} />
      <path d="M-108 -6 C-114 -112 -40 -130 0 -130 C66 -130 118 -98 106 -12 C80 -62 40 -72 0 -68 C-40 -72 -84 -52 -108 -6 Z" fill={hair} />
      <Eye cx={-40} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <Eye cx={40} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <ellipse cx="-62" cy="40" rx="18" ry="9" fill="#E8907A" opacity=".5" />
      <ellipse cx="62" cy="40" rx="18" ry="9" fill="#E8907A" opacity=".5" />
      {M[mouth]}
    </g>
  );
}

/* little sign card held up with a letter */
function NormSign({ x, y, ch, fill = CREAM, color = INK, r = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x="-6" y="0" width="12" height="110" rx="5" fill="#8A6A44" />
      <rect x="-56" y="-90" width="112" height="100" rx="14" fill={fill} />
      <text x="0" y="-12" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="68" fill={color}>{ch}</text>
    </g>
  );
}

/* 1 — nodding with a thumbs up while the thought bubble says no */
function ArtNormNod({ T }) {
  const nod = Math.abs(osc(T, 0.7)) * 8;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#264684" />
      <NormBust x={486} y={1150} s={1.05} T={T} shirt="#E8C547" hair="#2A1A10" mouth="smile" look={-4} rot={nod} />
      <g transform={`translate(700 ${1420 - nod * 2}) rotate(${-10 + osc(T, 0.7) * 6})`}>
        <rect x="-50" y="-30" width="100" height="90" rx="30" fill={SKIN} />
        <rect x="-26" y="-110" width="44" height="100" rx="22" fill={SKIN} />
        {[0, 1, 2].map((k) => <path key={k} d={`M-50 ${-4 + k * 24} h40`} stroke={SKIN2} strokeWidth="6" strokeLinecap="round" />)}
      </g>
      {[0, 1].map((k) => <circle key={k} cx={300 - k * 46} cy={930 - k * 50} r={14 + k * 8} fill={CREAM} />)}
      <g transform={`translate(190 ${790 + osc(T, 2) * 8})`}>
        <ellipse rx="120" ry="84" fill={CREAM} />
        <g transform={`scale(${0.9 + 0.1 * Math.abs(osc(T, 0.9))})`}>
          <path d="M-40 -40 L40 40 M40 -40 L-40 40" stroke="#B3202A" strokeWidth="22" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/* 2 — Asch line card; the actors all hold up the same wrong letter */
function ArtNormLines({ T, t }) {
  const up = tw(t, 0.8, 0.6);
  const xs = [150, 340, 530, 720];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#DDD6C5" />
      <rect x="140" y="720" width="692" height="340" rx="22" fill="#F7F4EC" stroke={INK} strokeWidth="8" />
      <line x1="230" y1="1000" x2="230" y2="800" stroke={INK} strokeWidth="16" strokeLinecap="round" />
      <line x1="320" y1="740" x2="320" y2="1040" stroke="#BDB6A6" strokeWidth="5" strokeDasharray="14 14" />
      {[[440, 120, 'A'], [580, 200, 'B'], [720, 280, 'C']].map(([x, h, l]) => (
        <g key={l}>
          <line x1={x} y1="1000" x2={x} y2={1000 - h} stroke={INK} strokeWidth="16" strokeLinecap="round" />
          <text x={x} y="1050" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={INK}>{l}</text>
        </g>
      ))}
      <circle cx="580" cy="900" r={30 + 6 * osc(T, 0.8)} fill="none" stroke="#2B6E7A" strokeWidth="6" opacity=".7" />
      {xs.map((x, i) => {
        const b = osc(T, 0.9, i * 0.2) * 6;
        return (
          <g key={i}>
            <NormSign x={x + 70} y={1300 - up * 140 + b} ch="A" fill="#B3202A" color={CREAM} r={osc(T, 1.3, i * 0.3) * 5} />
            <NormBust x={x} y={1420 + b} s={0.55} T={T} ph={i * 0.7} shirt={['#1F3B73', '#2B6E7A', '#6A3FA0', '#E07A2E'][i]} hair={i % 2 ? INK : '#5A2E1A'} mouth="open" mo={Math.abs(osc(T, 0.4, i * 0.3))} />
          </g>
        );
      })}
    </g>
  );
}

/* 3 — the real participant at the end of the row, sweating, saying "A..." too */
function ArtNormAlong({ T, t }) {
  const turn = tw(t, 0.5, 0.8);
  const drops = [[860, 1080, 0], [610, 1100, 1]];
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#9E1B24" />
      {[140, 330].map((x, i) => (
        <g key={i} opacity=".85">
          <NormBust x={x} y={1240} s={0.62} T={T} ph={i} shirt={i ? '#1F3B73' : '#6A3FA0'} hair={INK} mouth="smile" look={10} />
          <rect x={x - 40} y="890" width="80" height="70" rx="16" fill="#E9E4D8" />
          <text x={x} y="945" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="54" fill="#B3202A">A</text>
        </g>
      ))}
      <g transform={`translate(${osc(T, 0.15) * 2} 0)`}>
        <NormBust x={720} y={1180} s={0.95} T={T} ph={1.7} shirt="#E8C547" hair="#3A1A14" mouth="wavy" look={-14 * turn} rot={-4 * turn} />
      </g>
      <g opacity={turn} transform={`translate(560 ${900 - turn * 20})`}>
        <path d="M-90 -60 h180 a30 30 0 0 1 30 30 v70 a30 30 0 0 1 -30 30 h-120 l-40 40 l6 -40 h-26 a30 30 0 0 1 -30 -30 v-70 a30 30 0 0 1 30 -30 Z" fill={CREAM} />
        <text x="0" y="22" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="60" fill={INK}>A...</text>
      </g>
      {drops.map(([x, y, ph], i) => {
        const p = ((T + ph) % 2) / 2;
        return (
          <path key={i} d="M0 -30 C11 -12 18 0 18 9 A18 18 0 0 1 -18 9 C-18 0 -11 -12 0 -30 Z" fill="#9AD8FF"
            transform={`translate(${x} ${y + p * 130}) scale(${0.6 + p * 0.4})`} opacity={1 - p} />
        );
      })}
    </g>
  );
}

/* 4 — writing the true answer down privately, shielded by a hand */
function ArtNormWrite({ T, t }) {
  const draw = tw(t, 0.6, 1.4);
  const px = 500 + draw * 60, py = 1180 - Math.sin(draw * Math.PI) * 60;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#DDB93A" />
      <rect x="0" y="1480" width="972" height="248" fill="#B98F2A" />
      <g transform="rotate(-6 486 1250)">
        <rect x="270" y="960" width="430" height="520" rx="18" fill="#F7F4EC" />
        {[0, 1, 2].map((k) => <rect key={k} x="310" y={1010 + k * 40} width={k ? 260 : 180} height="14" rx="7" fill="#CFC7B4" />)}
        <rect x="430" y="1120" width="170" height="200" rx="14" fill="none" stroke="#BDB6A6" strokeWidth="6" />
        <path d="M480 1290 V1150 H530 a36 36 0 0 1 0 72 H480 M530 1222 a38 38 0 0 1 0 68 H480" fill="none" stroke="#2B6E7A" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="620" strokeDashoffset={620 * (1 - draw)} />
      </g>
      <g transform={`translate(${px + osc(T, 0.2) * 4} ${py}) rotate(30)`}>
        <rect x="-14" y="0" width="28" height="240" rx="6" fill="#E8C547" stroke={INK} strokeWidth="5" />
        <path d="M-14 0 L0 -40 L14 0 Z" fill={SKIN} stroke={INK} strokeWidth="5" />
        <path d="M-5 -26 L0 -40 L5 -26 Z" fill={INK} />
        <ellipse cx="10" cy="150" rx="60" ry="50" fill={SKIN} />
      </g>
      <g transform={`translate(240 ${1260 + osc(T, 2.4) * 6}) rotate(-20)`}>
        <ellipse cx="0" cy="0" rx="90" ry="70" fill={SKIN2} />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={-80 + k * 40} y="-130" width="34" height="100" rx="17" fill={SKIN2} />)}
        <rect x="-140" y="30" width="100" height="320" rx="40" fill="#6A3FA0" transform="rotate(20)" />
      </g>
      <g transform={`translate(800 ${830 + osc(T, 1.6) * 8})`}>
        <circle r="60" fill={INK} />
        <rect x="-26" y="-6" width="52" height="40" rx="8" fill="#E8C547" />
        <path d="M-16 -6 v-14 a16 16 0 0 1 32 0 v14" fill="none" stroke="#E8C547" strokeWidth="8" />
      </g>
    </g>
  );
}

/* 5 — two bars: out loud vs private, the private one dropping */
function ArtNormDrop({ T, t }) {
  const fall = tw(t, 0.6, 1.2);
  const h1 = 420, h2 = 420 - fall * 300;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#24606B" />
      <line x1="150" y1="1560" x2="822" y2="1560" stroke={CREAM} strokeWidth="10" strokeLinecap="round" />
      <rect x="230" y={1560 - h1} width="200" height={h1} rx="18" fill="#E07A2E" />
      <rect x="542" y={1560 - h2} width="200" height={h2} rx="18" fill="#E8C547" />
      <g transform={`translate(330 ${1060 + osc(T, 0.5) * 4})`}>
        <path d="M-40 -40 h30 l40 -30 v120 l-40 -30 h-30 Z" fill={CREAM} />
        {[0, 1].map((k) => <path key={k} d={`M${44 + k * 22} -30 q20 30 0 60`} fill="none" stroke={CREAM} strokeWidth="7" strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(osc(T, 0.5, k * 0.3))} />)}
      </g>
      <g transform={`translate(642 ${1560 - h2 - 120})`}>
        <rect x="-50" y="-60" width="100" height="120" rx="8" fill={CREAM} />
        <rect x="-30" y="-36" width="60" height="10" rx="5" fill="#BDB6A6" />
        <rect x="-30" y="-12" width="44" height="10" rx="5" fill="#BDB6A6" />
        <rect x="20" y="10" width="14" height="60" rx="4" fill={INK} transform="rotate(30 27 40)" />
      </g>
      <g opacity={fall} transform={`translate(800 ${900 + fall * 120 + osc(T, 0.8) * 8})`}>
        <path d="M-24 -80 h48 v80 h40 l-64 76 l-64 -76 h40 Z" fill="#B3202A" />
      </g>
      <text x="330" y="1640" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>OUT LOUD</text>
      <text x="642" y="1640" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>PRIVATE</text>
    </g>
  );
}

/* 6 — holding up an agreeable mask; the real face behind is unsure */
function ArtNormMask({ T }) {
  const slide = 60 + osc(T, 2.6) * 40;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#C9692A" />
      {[110, 862].map((x, i) => (
        <g key={i} opacity=".55">
          <circle cx={x} cy="1250" r="70" fill="#9A4F1E" />
          <path d={`M${x - 110} 1728 C${x - 110} 1400 ${x + 110} 1400 ${x + 110} 1728 Z`} fill="#9A4F1E" />
        </g>
      ))}
      <NormBust x={486} y={1150} s={1} T={T} shirt="#2B6E7A" hair={INK} mouth="wavy" look={10} />
      <path d="M440 1080 l-30 -26 M532 1080 l30 -26" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <g transform={`translate(${486 - slide} 1150) rotate(${-8 + osc(T, 1.3) * 3})`}>
        <line x1="-20" y1="90" x2="-80" y2="400" stroke="#8A6A44" strokeWidth="16" strokeLinecap="round" />
        <ellipse cx="0" cy="0" rx="110" ry="124" fill="#F4F1EA" />
        <path d="M-60 -20 q20 -24 40 0 M20 -20 q20 -24 40 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M-50 40 q50 50 100 0" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="-70" cy="28" rx="18" ry="9" fill="#FF8FA3" opacity=".7" />
        <ellipse cx="70" cy="28" rx="18" ry="9" fill="#FF8FA3" opacity=".7" />
        <ellipse cx={-80 - 10} cy="420" rx="40" ry="34" fill={SKIN} />
      </g>
      <g transform={`translate(700 ${880 + osc(T, 1.2) * 10})`}>
        <circle r="44" fill={CREAM} />
        <text y="22" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="62" fill={INK}>?</text>
      </g>
    </g>
  );
}

/* 7 — meeting table, notes dropping into a box before anyone speaks */
function ArtNormBallot({ T }) {
  const notes = [0, 1, 2];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#5C3590" />
      {[160, 812].map((x, i) => (
        <NormBust key={i} x={x} y={1240} s={0.6} T={T} ph={i * 1.3} shirt={i ? '#E07A2E' : '#2B6E7A'} hair={i ? '#5A2E1A' : INK} hairStyle={i ? 'long' : 'short'} mouth="flat" look={i ? -10 : 10} />
      ))}
      <rect x="60" y="1500" width="852" height="60" rx="20" fill="#3E2266" />
      <rect x="0" y="1560" width="972" height="168" fill="#2C1849" />
      <path d="M346 1180 L626 1180 L606 1500 L366 1500 Z" fill={CREAM} />
      <rect x="326" y="1150" width="320" height="50" rx="12" fill="#F7F4EC" />
      <rect x="416" y="1166" width="140" height="16" rx="8" fill={INK} />
      <text x="486" y="1380" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="48" fill="#6A3FA0">VOTES</text>
      {notes.map((k) => {
        const p = ((T + k * 0.8) % 2.4) / 2.4;
        const y = 760 + MOTION.push(clamp(p * 1.25, 0, 1)) * 410;
        return (
          <g key={k} transform={`translate(${486 + osc(T, 1.2, k * 0.3) * 30 * (1 - p)} ${y}) rotate(${(1 - p) * (k - 1) * 20})`} opacity={p > 0.8 ? (1 - p) * 5 : 1}>
            <rect x="-60" y="-40" width="120" height="80" rx="8" fill="#E8C547" />
            <rect x="-40" y="-18" width="80" height="10" rx="5" fill="#B98F2A" />
            <rect x="-40" y="4" width="54" height="10" rx="5" fill="#B98F2A" />
          </g>
        );
      })}
    </g>
  );
}

/* 8 — a crowd walking one way at a signpost while one person stops to choose */
function ArtNormFollow({ T }) {
  const walk = (T * 70) % 140;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <rect x="470" y="880" width="32" height="760" rx="12" fill="#8A6A44" />
      <path d="M502 920 h240 l50 50 l-50 50 h-240 Z" fill={CREAM} />
      <path d="M470 1060 h-240 l-50 50 l50 50 h240 Z" fill="#E8C547" />
      <text x="630" y="990" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={INK}>CROWD</text>
      <text x="330" y="1130" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={INK}>YOU</text>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 520 + ((i * 140 + walk) % 560);
        const bob = -Math.abs(osc(T, 0.5, i * 0.2)) * 14;
        return (
          <g key={i} transform={`translate(${x} ${1500 + bob})`} opacity={clamp(x - 540, 0, 80) / 80 * clamp(1000 - x, 0, 80) / 80}>
            <circle cy="-120" r="40" fill="#16294F" />
            <rect x="-40" y="-76" width="80" height="140" rx="36" fill="#16294F" />
          </g>
        );
      })}
      <g transform={`rotate(${osc(T, 2.2) * 4} 300 1600)`}>
        <rect x="250" y="1380" width="100" height="220" rx="40" fill="#B3202A" />
        <circle cx="300" cy="1320" r="64" fill={SKIN} />
        <path d="M238 1310 C236 1250 270 1240 300 1240 C340 1240 366 1260 362 1300 C340 1280 320 1276 300 1278 C276 1276 252 1290 238 1310 Z" fill={INK} />
        <Eye cx={280} cy={1320} T={T} rx={12} ry={12} look={osc(T, 2.2) * 5} />
        <Eye cx={322} cy={1320} T={T} rx={12} ry={12} look={osc(T, 2.2) * 5} />
        <path d="M282 1356 q18 12 36 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      </g>
      <g transform={`translate(${130 + osc(T, 1.4) * 10} 1240)`}>
        <path d="M0 -60 L30 -10 L0 0 L30 50" fill="none" stroke="#E8C547" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity={0.4 + 0.6 * Math.abs(osc(T, 0.7))} />
      </g>
    </g>
  );
}

Object.assign(window, { ArtNormNod, ArtNormLines, ArtNormAlong, ArtNormWrite, ArtNormDrop, ArtNormMask, ArtNormBallot, ArtNormFollow });
