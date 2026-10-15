// art.jsx — scene illustrations for "The Cost Of Hiding" (expressive suppression, Butler et al. 2003). Pure functions of T.
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
function SupBust({ x, y, s = 1, T, ph = 0, shirt = '#B3202A', hair = '#3A1A14', skin = SKIN, hairStyle = 'long', mouth = 'smile', mo = 0, look = 0, rot = 0 }) {
  const M = {
    smile: <path d="M-30 50 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
    flat: <path d="M-26 58 h52" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
    frown: <path d="M-28 66 q28 -20 56 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
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
      {hairStyle === 'bun' && <circle cx="0" cy="-140" r="44" fill={hair} />}
      <Eye cx={-40} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <Eye cx={40} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <ellipse cx="-62" cy="40" rx="18" ry="9" fill="#E8907A" opacity=".5" />
      <ellipse cx="62" cy="40" rx="18" ry="9" fill="#E8907A" opacity=".5" />
      {M[mouth]}
    </g>
  );
}

/* 1 — one person talking with feelings flying, the other a blank poker face */
function ArtSupHide({ T }) {
  const talk = Math.abs(osc(T, 0.32));
  const icons = ['#E8C547', '#E2453C', '#9AD8FF'];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <SupBust x={250} y={1180} s={0.95} T={T} shirt="#E07A2E" hair="#5A2E1A" mouth="open" mo={talk} look={8} rot={osc(T, 1.3) * 3} />
      <SupBust x={722} y={1180} s={0.95} T={T} ph={1.4} shirt={CREAM} hair={INK} hairStyle="bun" mouth="flat" look={-6} />
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.7) % 2.1) / 2.1;
        const x = 360 + p * 250, y = 940 - Math.sin(p * Math.PI) * 120;
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * Math.sin(p * Math.PI)})`} opacity={Math.sin(p * Math.PI)}>
            <circle r="34" fill={icons[k]} />
            <circle cx="-11" cy="-6" r="5" fill={INK} />
            <circle cx="11" cy="-6" r="5" fill={INK} />
            <path d={k === 2 ? 'M-12 16 q12 -12 24 0' : 'M-14 8 q14 14 28 0'} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          </g>
        );
      })}
      <g transform={`translate(722 ${905 + osc(T, 1.6) * 6})`}>
        <rect x="-70" y="-50" width="140" height="70" rx="20" fill="#1A2F5C" />
        <path d="M-42 -16 h84" stroke={CREAM} strokeWidth="9" strokeLinecap="round" opacity=".7" />
        <path d="M-16 20 L0 44 L16 20 Z" fill="#1A2F5C" />
      </g>
      <rect x="120" y="1500" width="732" height="40" rx="14" fill="#16294F" />
    </g>
  );
}

/* 2 — two women on a couch watching a war documentary, then talking */
function ArtSupFilm({ T, t }) {
  const fl = 0.5 + 0.5 * Math.abs(osc(T, 0.37));
  const boom = ((T % 1.6) / 1.6);
  const talk = tw(t, 2.4, 0.5);
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#DDD6C5" />
      <rect x="196" y="740" width="580" height="380" rx="26" fill={INK} />
      <rect x="222" y="766" width="528" height="328" rx="12" fill="#3D3B36" />
      <rect x="222" y="1010" width="528" height="84" fill="#2A2824" />
      <g transform={`translate(${520 + osc(T, 3) * 30} 1010)`}>
        <rect x="-90" y="-46" width="180" height="56" rx="14" fill="#55573E" />
        <rect x="-40" y="-82" width="90" height="40" rx="10" fill="#55573E" />
        <rect x="40" y="-70" width="110" height="14" rx="6" fill="#55573E" />
        {[-60, -20, 20, 60].map((cx) => <circle key={cx} cx={cx} cy="14" r="18" fill="#2A2824" />)}
      </g>
      <g transform={`translate(330 940) scale(${0.4 + boom * 0.9})`} opacity={(1 - boom) * fl}>
        <circle r="70" fill="#E07A2E" />
        <circle r="44" fill="#E8C547" />
        {[0, 1, 2, 3, 4, 5].map((a) => <circle key={a} cx={Math.cos(a) * 80} cy={Math.sin(a) * 60} r="26" fill="#8E8A80" />)}
      </g>
      <rect x="196" y="740" width="580" height="380" rx="26" fill="#fff" opacity={0.05 * fl} />
      <rect x="456" y="1120" width="60" height="70" fill={INK} />
      <path d="M100 1460 Q100 1340 220 1340 L752 1340 Q872 1340 872 1460 L872 1728 L100 1728 Z" fill="#B3202A" />
      <rect x="140" y="1430" width="692" height="300" rx="40" fill="#8E151D" />
      {[[350, '#3A1A14', -1], [622, INK, 1]].map(([x, hc, sd], i) => (
        <g key={i} transform={`rotate(${sd * talk * 12 + osc(T, 2.2, i * 0.3) * 2} ${x} 1520)`}>
          <path d={`M${x - 130} 1728 C${x - 130} 1560 ${x - 80} 1500 ${x} 1500 C${x + 80} 1500 ${x + 130} 1560 ${x + 130} 1728 Z`} fill={i ? '#2B6E7A' : '#6A3FA0'} />
          <circle cx={x} cy="1400" r="96" fill={hc} />
          <ellipse cx={x + sd * 92} cy="1410" rx="16" ry="26" fill={SKIN2} />
        </g>
      ))}
      <g opacity={talk} transform={`translate(486 ${1250 - talk * 30})`}>
        <rect x="-80" y="-50" width="160" height="90" rx="40" fill="#fff" />
        {[-36, 0, 36].map((cx, k) => <circle key={cx} cx={cx} cy="-5" r={9 + 4 * Math.abs(osc(T, 0.6, k * 0.2))} fill={INK} />)}
      </g>
    </g>
  );
}

/* 3 — researcher secretly whispering an instruction card */
function ArtSupSecret({ T, t }) {
  const card = tw(t, 0.6, 0.6);
  const lean = osc(T, 1.8) * 3;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#9E1B24" />
      <g transform={`rotate(${lean - 6} 280 1500)`}>
        <SupBust x={280} y={1150} s={0.9} T={T} shirt="#F4F1EA" hair="#6B6B6B" hairStyle="short" mouth="open" mo={0.3 + 0.3 * Math.abs(osc(T, 0.4))} look={10} />
        <path d="M262 1470 L280 1560 L298 1470" fill="none" stroke="#C9C0AE" strokeWidth="10" />
        <ellipse cx={360} cy={1160} rx="34" ry="48" fill={SKIN} />
      </g>
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${410 + k * 30} ${1100 - k * 8} q20 30 0 60`} fill="none" stroke={CREAM} strokeWidth="7" strokeLinecap="round"
          opacity={0.25 + 0.75 * Math.abs(osc(T, 0.9, k * 0.2))} />
      ))}
      <SupBust x={700} y={1170} s={0.9} T={T} ph={0.9} shirt="#2B6E7A" hair="#3A1A14" mouth="flat" look={-9} />
      <g transform={`translate(${700 - 40 * (1 - card)} ${1520 - 80 * card}) rotate(${-8 + osc(T, 2) * 3})`} opacity={card}>
        <rect x="-120" y="-70" width="240" height="140" rx="12" fill={CREAM} />
        <text x="0" y="-8" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill="#B3202A">HIDE IT</text>
        <rect x="-80" y="22" width="160" height="10" rx="5" fill="#BDB6A6" />
        <rect x="-60" y="42" width="120" height="10" rx="5" fill="#BDB6A6" />
      </g>
      <g transform={`translate(160 860) rotate(${osc(T, 1.1) * 8})`}>
        <circle r="54" fill={CREAM} />
        <text y="18" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="48" fill={INK}>shh</text>
      </g>
    </g>
  );
}

/* 4 — the partner's blood pressure climbing on a cuff gauge */
function ArtSupPressure({ T, t }) {
  const rise = tw(t, 0.4, 2.2);
  const needle = -120 + rise * 170 + osc(T, 0.25) * 4;
  const drops = [[560, 1040, 0], [420, 1060, 0.9]];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#DDB93A" />
      <SupBust x={420} y={1140} s={1} T={T} shirt="#1F3B73" hair="#2A1A10" hairStyle="short" mouth="wavy" look={osc(T, 1.7) * 7} />
      <rect x="560" y="1370" width="150" height="120" rx="30" fill="#2A2A33" />
      <path d="M635 1370 C640 1250 700 1180 730 1100" fill="none" stroke="#2A2A33" strokeWidth="12" />
      <g transform="translate(740 980)">
        <circle r="128" fill={INK} />
        <circle r="108" fill={CREAM} />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x="-4" y="-100" width="8" height={i % 2 ? 14 : 24} rx="3" fill={i > 6 ? '#B3202A' : INK} transform={`rotate(${-120 + i * 30})`} />
        ))}
        <path d="M0 -96 A96 96 0 0 1 83 48" fill="none" stroke="#B3202A" strokeWidth="10" opacity=".35" transform="rotate(60)" />
        <line x1="0" y1="12" x2="0" y2="-82" stroke="#B3202A" strokeWidth="9" strokeLinecap="round" transform={`rotate(${needle})`} />
        <circle r="14" fill={INK} />
      </g>
      <g transform="translate(160 1040)">
        <rect x="-26" y="-180" width="52" height="300" rx="26" fill={CREAM} />
        <rect x="-14" y={100 - 240 * rise} width="28" height={240 * rise + 10} rx="14" fill="#B3202A" />
        <circle cy="130" r="40" fill="#B3202A" />
        <path d="M60 -150 l0 -60 m-24 24 l24 -24 l24 24" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" opacity={rise} />
      </g>
      {drops.map(([x, y, ph], i) => {
        const p = ((T + ph) % 1.8) / 1.8;
        return (
          <path key={i} d="M0 -30 C11 -12 18 0 18 9 A18 18 0 0 1 -18 9 C-18 0 -11 -12 0 -30 Z" fill="#9AD8FF"
            transform={`translate(${x} ${y + p * 120}) scale(${0.6 + p * 0.5})`} opacity={rise * (1 - p)} />
        );
      })}
    </g>
  );
}

/* 5 — two people drifting apart, the friendship heart cracking */
function ArtSupApart({ T, t }) {
  const gap = tw(t, 0.5, 1.8);
  const crack = tw(t, 1.6, 0.8);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#24606B" />
      <rect x="140" y="1470" width="692" height="40" rx="16" fill="#1B4C55" />
      <SupBust x={300 - gap * 70} y={1180} s={0.9} T={T} shirt="#E8C547" hair="#3A1A14" hairStyle="bun" mouth="flat" look={-4} rot={-gap * 6} />
      <SupBust x={672 + gap * 70} y={1180} s={0.9} T={T} ph={1.1} shirt="#E07A2E" hair={INK} mouth="frown" look={-12 * gap} rot={gap * 6} />
      <g transform={`translate(486 ${960 + osc(T, 1.4) * 10}) scale(0.8)`}>
        <g transform={`translate(${-crack * 26} ${crack * 12}) rotate(${-crack * 14})`}>
          <path d="M0 -40 C-30 -110 -130 -90 -120 -10 C-112 50 -40 90 0 130 L-20 60 L14 20 L-12 -14 Z" fill="#E2453C" />
        </g>
        <g transform={`translate(${crack * 26} ${crack * 12}) rotate(${crack * 14})`}>
          <path d="M0 -40 C30 -110 130 -90 120 -10 C112 50 40 90 0 130 L-20 60 L14 20 L-12 -14 Z" fill="#C93A32" />
        </g>
      </g>
      <g opacity={gap}>
        {[-1, 1].map((sd) => (
          <path key={sd} d={`M${486 + sd * 40} 1300 h${sd * 70} m${-sd * 22} -20 l${sd * 22} 20 l${-sd * 22} 20`} fill="none" stroke={CREAM} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </g>
    </g>
  );
}

/* 6 — balance: poker face helps at a tense table, open face matters with a close friend */
function ArtSupBalance({ T }) {
  const tilt = osc(T, 3.2) * 9;
  const pan = (side) => {
    const a = (tilt * Math.PI) / 180;
    return [486 + side * 260 * Math.cos(a), 1050 + side * 260 * Math.sin(a)];
  };
  const [lx, ly] = pan(-1), [rx, ry] = pan(1);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#C9692A" />
      <path d="M396 1640 L576 1640 L536 1580 L436 1580 Z" fill={INK} />
      <rect x="474" y="1050" width="24" height="540" rx="10" fill={INK} />
      <circle cx="486" cy="1040" r="30" fill={INK} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      {[[lx, ly, 0], [rx, ry, 1]].map(([x, y, k]) => (
        <g key={k}>
          <line x1={x} y1={y} x2={x - 90} y2={y + 180} stroke={INK} strokeWidth="5" />
          <line x1={x} y1={y} x2={x + 90} y2={y + 180} stroke={INK} strokeWidth="5" />
          <path d={`M${x - 120} ${y + 180} h240 a120 50 0 0 1 -240 0 Z`} fill={CREAM} />
          {k === 0 ? (
            <g transform={`translate(${x} ${y + 120})`}>
              <rect x="-70" y="-60" width="140" height="120" rx="36" fill="#F4F1EA" />
              <circle cx="-28" cy="-12" r="9" fill={INK} />
              <circle cx="28" cy="-12" r="9" fill={INK} />
              <path d="M-26 26 h52" stroke={INK} strokeWidth="8" strokeLinecap="round" />
            </g>
          ) : (
            <g transform={`translate(${x} ${y + 120}) scale(${1 + 0.06 * Math.abs(osc(T, 0.8))})`}>
              <rect x="-50" y="-50" width="100" height="100" fill="#E2453C" transform="rotate(45)" />
              <circle cx="-35" cy="-35" r="50" fill="#E2453C" />
              <circle cx="35" cy="-35" r="50" fill="#E2453C" />
            </g>
          )}
        </g>
      ))}
      <text x={lx} y={ly + 300} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={CREAM}>SOMETIMES</text>
      <text x={rx} y={ry + 300} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={CREAM}>CLOSE TALKS</text>
    </g>
  );
}

/* 7 — two friends leaning in, one letting a little feeling show; hearts drift up */
function ArtSupShow({ T, t }) {
  const warm = tw(t, 0.4, 1.2);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#5C3590" />
      <circle cx="486" cy="1160" r={220 + 20 * osc(T, 2)} fill="#E8C547" opacity={0.12 * warm} />
      <SupBust x={300} y={1180} s={0.92} T={T} shirt="#2B6E7A" hair="#5A2E1A" hairStyle="long" mouth={warm > 0.5 ? 'smile' : 'flat'} look={8} rot={4 * warm + osc(T, 2.4) * 2} />
      <path d={`M${262} ${1200} q-6 ${20 + 10 * Math.abs(osc(T, 1.6))} 0 30`} fill="none" stroke="#9AD8FF" strokeWidth="8" strokeLinecap="round" opacity={warm} />
      <SupBust x={672} y={1180} s={0.92} T={T} ph={2} shirt="#E8C547" hair={INK} hairStyle="short" mouth="smile" look={-8} rot={-4 * warm} />
      <ellipse cx={560} cy={1440} rx="60" ry="44" fill={SKIN} />
      <ellipse cx={420} cy={1450} rx="60" ry="44" fill={SKIN2} />
      {[0, 1, 2, 3].map((k) => {
        const p = ((T + k * 0.55) % 2.2) / 2.2;
        const x = 486 + osc(T, 1.1, k * 0.25) * 40 + (k - 1.5) * 30;
        return (
          <g key={k} transform={`translate(${x} ${1300 - p * 420}) scale(${0.4 + 0.4 * p})`} opacity={warm * Math.sin(p * Math.PI)}>
            <rect x="-30" y="-30" width="60" height="60" fill="#FF8FA3" transform="rotate(45)" />
            <circle cx="-21" cy="-21" r="30" fill="#FF8FA3" />
            <circle cx="21" cy="-21" r="30" fill="#FF8FA3" />
          </g>
        );
      })}
    </g>
  );
}

Object.assign(window, { ArtSupHide, ArtSupFilm, ArtSupSecret, ArtSupPressure, ArtSupApart, ArtSupBalance, ArtSupShow });
