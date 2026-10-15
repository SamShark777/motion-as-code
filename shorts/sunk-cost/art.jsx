// art.jsx — scene illustrations for "Already Paid Trap" (sunk cost, Arkes & Blumer 1985). Pure functions of T.
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
function ScPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
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
      {mouth === 'frown' && <path d="M-30 66 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      <ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — a ticket with a label */
function ScTicket({ x, y, w = 300, h = 150, fill = CREAM, ink = INK, label, sub, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M${-w / 2} ${-h / 2} H${w / 2} V-22 a22 22 0 0 0 0 44 V${h / 2} H${-w / 2} V22 a22 22 0 0 0 0 -44 Z`} fill={fill} />
      <line x1={w / 2 - 70} y1={-h / 2 + 14} x2={w / 2 - 70} y2={h / 2 - 14} stroke={ink} strokeWidth="5" strokeDasharray="10 10" opacity=".5" />
      <text x={-30} y={-4} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={ink}>{label}</text>
      {sub && <text x={-30} y={42} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="30" fill={ink} opacity=".7">{sub}</text>}
    </g>
  );
}

/* 1 — bored viewer stuck in a bad movie, ticket in hand */
function ArtScMovie({ T }) {
  const flick = 0.75 + 0.25 * Math.abs(osc(T, 0.23));
  const slump = osc(T, 3) * 4;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      <rect x="150" y="720" width="672" height="330" rx="16" fill="#0F1E3D" />
      <rect x="176" y="744" width="620" height="282" rx="8" fill="#8A93A6" opacity={flick} />
      <g opacity={flick}>
        <circle cx="400" cy="890" r="56" fill="#5E677A" />
        <rect x="350" y="940" width="100" height="80" rx="30" fill="#5E677A" />
        <path d="M376 900 q24 -16 48 0" fill="none" stroke="#2E3546" strokeWidth="8" strokeLinecap="round" transform="rotate(180 400 900)" />
        <text x="640" y="910" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="56" fill="#2E3546">. . .</text>
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.8) % 2.4) / 2.4;
        return <text key={k} x={640 + p * 90 + k * 10} y={1180 - p * 170} fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={40 + k * 12} fill={CREAM} opacity={Math.sin(p * Math.PI)}>z</text>;
      })}
      <g transform={`rotate(${slump} 486 1700)`}>
        <rect x="250" y="1300" width="472" height="460" rx="60" fill="#8E151D" />
        <ScPerson x={486} y={1250} T={T} shirt="#E07A2E" mouth="flat" brow={14} look={-6} />
        <g transform={`translate(330 ${1530 + osc(T, 1.6) * 6}) rotate(-14)`}>
          <ScTicket x={0} y={0} w={220} h={110} fill="#E8C547" label="$" sub="PAID" />
        </g>
        <ellipse cx="420" cy="1560" rx="46" ry="38" fill={SKIN} />
        <g transform="translate(650 1520)">
          <path d="M-70 -60 L70 -60 L52 120 L-52 120 Z" fill={CREAM} />
          {[-46, 0, 46].map((dx) => <rect key={dx} x={dx - 12} y="-60" width="24" height="180" fill="#B3202A" />)}
          {[[-50, -78], [-14, -92], [24, -84], [56, -74], [6, -112]].map(([px, py], i) => <circle key={i} cx={px} cy={py + osc(T, 1.3, i * 0.2) * 3} r="26" fill="#FFF4D6" />)}
        </g>
      </g>
      {[110, 862].map((x, i) => <circle key={x} cx={x} cy={1640} r="110" fill="#152A55" />)}
    </g>
  );
}

/* 2 — student dreaming of two ski trips under falling snow */
function ArtScTrips({ T, t }) {
  const a = tw(t, 0.2, 0.5), b = tw(t, 0.6, 0.5);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#DDD6C5" />
      <path d="M90 1160 L330 800 L470 1010 L620 760 L900 1160 Z" fill="#9AB2C8" />
      <path d="M270 890 L330 800 L390 890 L360 870 L330 900 L300 870 Z M560 850 L620 760 L680 850 L650 832 L620 862 L590 832 Z" fill="#fff" />
      {Array.from({ length: 18 }).map((_, i) => {
        const y = ((T * (60 + hsh(i) * 50) + hsh(i + 7) * 700) % 700) + 700;
        const x = hsh(i + 3) * 972 + osc(T, 2 + hsh(i), hsh(i)) * 18;
        return <circle key={i} cx={x} cy={y} r={6 + hsh(i + 9) * 6} fill="#fff" opacity=".9" />;
      })}
      <ScPerson x={486} y={1290} T={T} shirt="#2B6E7A" mouth="smile" look={osc(T, 2) * 8} />
      <g transform={`translate(${300 - (1 - a) * 200} ${1560}) rotate(${-10 + osc(T, 1.8) * 3})`} opacity={a}>
        <ScTicket x={0} y={0} fill="#1F3B73" ink={CREAM} label="MICHIGAN" sub="SKI TRIP" w={330} />
      </g>
      <g transform={`translate(${672 + (1 - b) * 200} ${1600}) rotate(${10 + osc(T, 1.8, 0.4) * 3})`} opacity={b}>
        <ScTicket x={0} y={0} fill="#B3202A" ink={CREAM} label="WISCONSIN" sub="SKI TRIP" w={330} />
      </g>
      <ellipse cx="330" cy="1640" rx="44" ry="36" fill={SKIN} />
      <ellipse cx="642" cy="1680" rx="44" ry="36" fill={SKIN} />
    </g>
  );
}

/* 3 — two swinging price tags; hearts float from the cheaper one */
function ArtScPrices({ T }) {
  const sw = osc(T, 2.2) * 6;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#9E1B24" />
      <line x1="80" y1="760" x2="892" y2="760" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      {[[290, '$100', 'MICHIGAN', '#E9E4D8', 1], [682, '$50', 'WISCONSIN', '#E8C547', -1]].map(([x, price, place, fill, dir], i) => (
        <g key={i} transform={`rotate(${sw * dir} ${x} 760)`}>
          <line x1={x} y1="760" x2={x} y2="900" stroke={CREAM} strokeWidth="6" />
          <path d={`M${x - 150} 950 L${x} 880 L${x + 150} 950 L${x + 150} 1290 Q${x + 150} 1310 ${x + 130} 1310 L${x - 130} 1310 Q${x - 150} 1310 ${x - 150} 1290 Z`} fill={fill} />
          <circle cx={x} cy="930" r="16" fill="#9E1B24" />
          <text x={x} y="1110" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="100" fill={INK}>{price}</text>
          <text x={x} y="1200" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="38" fill={INK}>{place}</text>
        </g>
      ))}
      {[0, 1, 2, 3].map((k) => {
        const p = ((T + k * 0.6) % 2.4) / 2.4;
        const x = 682 + osc(T, 1.1, k * 0.3) * 50 + (k - 1.5) * 40, y = 1420 - p * 300;
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${0.6 + p * 0.6})`} opacity={Math.sin(p * Math.PI)}>
            <path d="M0 18 C-40 -10 -30 -44 0 -26 C30 -44 40 -10 0 18 Z" fill="#FF8FA3" />
          </g>
        );
      })}
      <ScPerson x={486} y={1480} T={T} s={0.7} shirt="#1F3B73" mouth="o" look={osc(T, 2.2) * 10} />
    </g>
  );
}

/* 4 — both tickets on the same weekend, NO REFUNDS stamp slams down */
function ArtScClash({ T, t }) {
  const st = tw(t, 0.9, 0.25);
  const shake = t > 0.9 && t < 1.4 ? osc(T, 0.06) * 6 * (1.4 - t) * 2 : 0;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#D9B53A" />
      <g transform={`translate(${shake} 0)`}>
        <rect x="200" y="820" width="572" height="700" rx="30" fill={CREAM} />
        <rect x="200" y="820" width="572" height="150" rx="30" fill="#B3202A" />
        <rect x="200" y="930" width="572" height="40" fill="#B3202A" />
        {[290, 400, 572, 682].map((x) => <rect key={x} x={x - 12} y="780" width="24" height="80" rx="12" fill={INK} />)}
        <text x="486" y="925" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="64" fill={CREAM}>SATURDAY</text>
        <text x="486" y="1170" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="190" fill={INK} opacity=".15">14</text>
        <ScTicket x={420} y={1180} w={300} h={130} fill="#1F3B73" ink={CREAM} label="MICHIGAN" rot={-12 + osc(T, 1.5) * 2} />
        <ScTicket x={556} y={1320} w={300} h={130} fill="#2B6E7A" ink={CREAM} label="WISCONSIN" rot={10 - osc(T, 1.5) * 2} />
      </g>
      <g transform={`translate(486 1290) rotate(-14) scale(${2.2 - 1.2 * st})`} opacity={st}>
        <rect x="-250" y="-70" width="500" height="140" rx="16" fill="none" stroke="#B3202A" strokeWidth="14" />
        <text x="0" y="24" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="66" fill="#B3202A">NO REFUNDS</text>
      </g>
      {[0, 1, 2].map((k) => (
        <line key={k} x1={180 + k * 300} y1="1620" x2={220 + k * 300} y2="1680" stroke={INK} strokeWidth="10" strokeLinecap="round" opacity={st * (0.4 + 0.6 * Math.abs(osc(T, 0.5, k * 0.3)))} />
      ))}
    </g>
  );
}

/* 5 — 54% pie, a glum skier heading to Michigan anyway */
function ArtScChoice({ T, t }) {
  const p = tw(t, 0.2, 1.0) * 0.54;
  const a = p * TAU - Math.PI / 2;
  const large = p > 0.5 ? 1 : 0;
  const bob = osc(T, 0.9) * 8;
  return (
    <g>
      <circle cx="486" cy="1250" r="430" fill="#24606B" />
      <g transform="translate(330 900)">
        <circle r="210" fill={CREAM} opacity=".25" />
        {p > 0.001 && <path d={`M0 0 L0 -210 A210 210 0 ${large} 1 ${Math.cos(a) * 210} ${Math.sin(a) * 210} Z`} fill="#E8C547" />}
        <circle r="90" fill="#24606B" />
        <text y="22" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="64" fill={CREAM}>{Math.round(p * 100)}%</text>
      </g>
      <path d="M0 1440 L972 1330 L972 1728 L0 1728 Z" fill="#F4F7FA" />
      <g transform={`translate(660 ${1340 + bob}) rotate(-6)`}>
        <line x1="-140" y1="190" x2="160" y2="160" stroke="#B3202A" strokeWidth="14" strokeLinecap="round" />
        <path d="M-60 40 L-70 180 M40 40 L60 170" stroke={INK} strokeWidth="40" strokeLinecap="round" />
        <rect x="-80" y="-120" width="160" height="190" rx="50" fill="#1F3B73" />
        <circle cx="0" cy="-190" r="78" fill={SKIN} />
        <path d="M-80 -200 C-80 -270 80 -270 80 -200 Z" fill="#B3202A" />
        <circle cx="0" cy="-272" r="18" fill={CREAM} />
        <Eye cx={-26} cy={-180} T={T} rx={13} ry={13} />
        <Eye cx={26} cy={-180} T={T} rx={13} ry={13} />
        <path d="M-20 -136 q20 -16 40 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <line x1="-80" y1="-80" x2="-150" y2="60" stroke={INK} strokeWidth="10" />
        <line x1="80" y1="-80" x2="150" y2="50" stroke={INK} strokeWidth="10" />
      </g>
      <g transform="translate(150 1300)">
        <line x1="0" y1="0" x2="0" y2="200" stroke={INK} strokeWidth="10" />
        <path d={`M0 0 L150 ${30 + osc(T, 0.8) * 8} L0 70 Z`} fill="#1F3B73" />
        <text x="50" y="50" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="34" fill={CREAM}>MI</text>
      </g>
    </g>
  );
}

/* 6 — a money bag sinking, its rope tugging at a person's wrist */
function ArtScSunk({ T }) {
  const sink = osc(T, 2.6) * 14;
  const lean = osc(T, 2.6) * 3;
  return (
    <g>
      <circle cx="486" cy="1100" r="400" fill="#D26E25" />
      <g transform={`rotate(${lean} 300 1180)`}>
        <ScPerson x={300} y={860} T={T} s={0.8} shirt="#6A3FA0" mouth="o" brow={-10} look={14} />
        <line x1="380" y1="1100" x2="330" y2="1040" stroke="#6A3FA0" strokeWidth="44" strokeLinecap="round" />
        <circle cx="330" cy="1040" r="30" fill={SKIN} />
      </g>
      <rect x="0" y="1150" width="440" height="40" rx="8" fill="#7A5A2E" />
      <rect x="0" y="1180" width="972" height="548" fill="#1F4E79" />
      <path d={`M0 1180 ${Array.from({ length: 13 }).map((_, i) => `Q${i * 81 + 40} ${1160 + osc(T, 1.4, i * 0.15) * 10} ${(i + 1) * 81} 1180`).join(' ')}`} fill="#2C6A9E" />
      {Array.from({ length: 8 }).map((_, i) => {
        const p = ((T * 0.5 + hsh(i)) % 1);
        return <circle key={i} cx={560 + hsh(i + 4) * 160 + osc(T, 1, i * 0.2) * 10} cy={1640 - p * 440} r={6 + hsh(i + 2) * 8} fill="none" stroke="#9AD8FF" strokeWidth="4" opacity={1 - p} />;
      })}
      <path d={`M330 ${1040} Q480 ${1300} 640 ${1520 + sink}`} fill="none" stroke="#C9A06A" strokeWidth="10" strokeLinecap="round" />
      <g transform={`translate(640 ${1560 + sink}) rotate(${osc(T, 2.6) * 5})`}>
        <path d="M-40 -60 L40 -60 L30 -36 Q120 0 110 70 Q100 130 0 130 Q-100 130 -110 70 Q-120 0 -30 -36 Z" fill="#C9A06A" />
        <text x="0" y="80" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="96" fill="#7A5A2E">$</text>
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T * 0.4 + k / 3) % 1);
        return <circle key={k} cx={500 + k * 90} cy={1250 + p * 420} r="22" fill="#E8C547" opacity={1 - p} />;
      })}
    </g>
  );
}

/* 7 — thinking person; the "PAID" receipt in the bubble gets crossed out */
function ArtScAsk({ T, t }) {
  const x1 = tw(t, 1.2, 0.35), x2 = tw(t, 1.5, 0.35);
  const q = osc(T, 1.2) * 12;
  return (
    <g>
      <circle cx="486" cy="1260" r="420" fill="#7B4FB3" />
      <circle cx="390" cy="1080" r="20" fill={CREAM} />
      <circle cx="440" cy="1020" r="30" fill={CREAM} />
      <ellipse cx="620" cy="880" rx="240" ry="170" fill={CREAM} />
      <g transform={`translate(620 880) rotate(${osc(T, 2) * 3})`}>
        <path d="M-90 -120 L90 -120 L90 110 l-22 -16 l-22 16 l-22 -16 l-22 16 l-22 -16 l-22 16 l-22 -16 l-22 16 Z" fill="#fff" stroke={INK} strokeWidth="5" />
        {[0, 1, 2].map((k) => <rect key={k} x="-64" y={-90 + k * 34} width={k === 2 ? 70 : 128} height="12" rx="6" fill="#BDB6A6" />)}
        <text x="0" y="60" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={INK}>PAID</text>
        <line x1="-110" y1="-130" x2={-110 + 220 * x1} y2={-130 + 250 * x1} stroke="#B3202A" strokeWidth="16" strokeLinecap="round" opacity={x1 > 0 ? 1 : 0} />
        <line x1="110" y1="-130" x2={110 - 220 * x2} y2={-130 + 250 * x2} stroke="#B3202A" strokeWidth="16" strokeLinecap="round" opacity={x2 > 0 ? 1 : 0} />
      </g>
      <ScPerson x={400} y={1330} T={T} shirt="#E8C547" mouth="flat" look={10} brow={-6} />
      <line x1="260" y1="1640" x2="330" y2="1460" stroke="#E8C547" strokeWidth="60" strokeLinecap="round" />
      <ellipse cx="338" cy="1440" rx="40" ry="34" fill={SKIN} />
      <text x={790} y={1300 + q} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="200" fill={CREAM} transform={`rotate(${q * 0.6} 790 1240)`}>?</text>
    </g>
  );
}

/* 8 — walking out free: receipt blows away, exit sign glows */
function ArtScQuit({ T }) {
  const step = osc(T, 0.8);
  return (
    <g>
      <circle cx="486" cy="1250" r="430" fill="#264684" />
      <rect x="640" y="820" width="250" height="760" rx="10" fill="#0F1E3D" />
      <rect x="664" y="844" width="202" height="736" fill="#E8C547" opacity={0.75 + 0.15 * osc(T, 1.4)} />
      <rect x="650" y="740" width="230" height="64" rx="12" fill="#2B6E7A" />
      <text x="765" y="788" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>EXIT →</text>
      {[0, 1].map((k) => {
        const p = ((T * 0.45 + k * 0.5) % 1);
        return (
          <g key={k} transform={`translate(${200 - p * 260} ${1000 - p * 260 + osc(T, 0.7, k) * 30}) rotate(${p * 540})`} opacity={1 - p}>
            <rect x="-50" y="-30" width="100" height="60" rx="6" fill="#fff" />
            <text y="12" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="26" fill={INK}>PAID</text>
          </g>
        );
      })}
      <g transform={`translate(${osc(T, 1.6) * 10} ${-Math.abs(step) * 14})`}>
        <line x1="400" y1="1560" x2={370 + step * 40} y2="1740" stroke={INK} strokeWidth="60" strokeLinecap="round" />
        <line x1="480" y1="1560" x2={510 - step * 40} y2="1740" stroke={INK} strokeWidth="60" strokeLinecap="round" />
        <ScPerson x={440} y={1080} T={T} s={0.85} shirt="#B3202A" mouth="smile" look={10} />
        <line x1="560" y1="1330" x2="640" y2={1200 + step * 10} stroke="#B3202A" strokeWidth="50" strokeLinecap="round" />
        <circle cx="648" cy={1190 + step * 10} r="30" fill={SKIN} />
      </g>
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d="M0 -18 L5 -5 L18 0 L5 5 L0 18 L-5 5 L-18 0 L-5 -5 Z" fill={CREAM}
          transform={`translate(${120 + hsh(i) * 480} ${780 + hsh(i + 5) * 300}) scale(${0.6 + 0.6 * Math.abs(osc(T, 1.2, hsh(i)))})`} />
      ))}
    </g>
  );
}

Object.assign(window, { ArtScMovie, ArtScTrips, ArtScPrices, ArtScClash, ArtScChoice, ArtScSunk, ArtScAsk, ArtScQuit });
