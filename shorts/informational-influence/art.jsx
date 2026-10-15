// art.jsx — scene illustrations for "Informational Influence" (Ted type 2). Pure functions of T.
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
function IiHead({ x, y, s = 1, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, look = 0, mouth = 'smile', long = false, cut = false }) {
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

/* a guess = a speech bubble holding an arrow of some length */
function IiGuess({ x, y, len, col = '#B3202A', s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-120" y="-60" width="240" height="110" rx="34" fill="#fff" />
      <path d="M-20 46 L-40 96 L20 48 Z" fill="#fff" />
      <line x1={-len / 2} y1="-5" x2={len / 2 - 14} y2="-5" stroke={col} strokeWidth="12" strokeLinecap="round" />
      <path d={`M${len / 2 - 26} -27 L${len / 2 + 4} -5 L${len / 2 - 26} 17 Z`} fill={col} />
    </g>
  );
}

/* 1 — everyone looks one way; the unsure one copies */
function ArtCrowd({ T, t }) {
  const turn = tw(t, 1.2, 0.5);
  const look = -14 + 30 * turn + osc(T, 0.5) * (1 - turn) * 12;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      {[[150, 1250, '#2B6E7A', 0.3], [330, 1330, '#6A3FA0', 1.2], [820, 1250, '#E07A2E', 2.1], [650, 1330, '#B3202A', 0.7]].map(([x, y, c, ph], i) => (
        <IiHead key={i} x={x} y={y} s={0.7} T={T} ph={ph} shirt={c} look={16} hair={i % 2 ? '#3A1A14' : INK} long={i === 2} mouth="flat" />
      ))}
      <g transform={`translate(${860 + osc(T, 1) * 8} 900)`}>
        <path d="M-60 -30 L20 -30 L20 -70 L90 0 L20 70 L20 30 L-60 30 Z" fill="#E8C547" />
      </g>
      <IiHead x={486} y={1150} T={T} shirt="#E8C547" look={look} mouth={turn > 0.5 ? 'smile' : 'o'} />
      <text x={486 + osc(T, 0.9) * 10} y="940" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="130" fill={CREAM} opacity={1 - turn * 0.6}>?</text>
    </g>
  );
}

/* 2 — Sherif's pitch-dark room: one still dot of light */
function ArtDarkRoom({ T, t }) {
  const on = tw(t, 0.4, 0.6);
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#DDD6C5" />
      <rect x="110" y="730" width="752" height="920" rx="36" fill="#0E1118" />
      <rect x="110" y="730" width="752" height="920" rx="36" fill="none" stroke="#9A938A" strokeWidth="14" />
      <circle cx="660" cy="900" r={60 * on} fill="#FFF4C2" opacity={0.15 + 0.05 * osc(T, 1.4)} />
      <circle cx="660" cy="900" r={13 * on} fill="#FFF4C2" />
      <g transform="translate(330 1300)">
        <path d="M-130 340 L-130 120 C-130 40 -80 0 0 0 C80 0 130 40 130 120 L130 340 Z" fill="#1E2433" />
        <circle cx="0" cy="-90" r="96" fill="#1E2433" />
        <Eye cx={-12} cy={-104} T={T} rx={16} ry={14} look={8} />
        <Eye cx={42} cy={-104} T={T} rx={16} ry={14} look={8} />
        <rect x="-150" y="200" width="300" height="40" rx="10" fill="#2A3142" />
        <rect x="-140" y="240" width="24" height="110" fill="#2A3142" />
        <rect x="116" y="240" width="24" height="110" fill="#2A3142" />
      </g>
      <g transform="translate(660 1450)" opacity=".8">
        <rect x="-60" y="-50" width="120" height="100" rx="12" fill="#1E2433" />
        <text x="0" y="16" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill="#5C6680">1935</text>
      </g>
    </g>
  );
}

/* 3 — the still dot seems to wander (the autokinetic effect) */
function ArtDot({ T, t }) {
  const pos = (u) => [486 + osc(u, 2.3) * 130 + osc(u, 0.9, 0.3) * 40, 1200 + osc(u, 1.7, 0.2) * 100 + osc(u, 0.7) * 30];
  const trail = [];
  for (let k = 12; k >= 1; k--) {
    const [x, y] = pos(T - k * 0.06);
    trail.push(<circle key={k} cx={x} cy={y} r={14 - k * 0.6} fill="#FFF4C2" opacity={0.5 - k * 0.04} />);
  }
  const [dx, dy] = pos(T);
  const truth = 0.5 + 0.5 * osc(T, 1.6);
  return (
    <g>
      <circle cx="486" cy="1200" r="440" fill="#0E1118" />
      <circle cx="486" cy="1200" r="440" fill="none" stroke="#8E151D" strokeWidth="20" />
      <circle cx="486" cy="1200" r="34" fill="none" stroke="#E8C547" strokeWidth="6" strokeDasharray="12 10" opacity={truth} />
      <circle cx="486" cy="1200" r="6" fill="#E8C547" opacity={truth} />
      {trail}
      <circle cx={dx} cy={dy} r="34" fill="#FFF4C2" opacity=".18" />
      <circle cx={dx} cy={dy} r="15" fill="#FFF4C2" />
      {[[330, 1520], [640, 1520]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="50" ry={46 * blink(T, i * 0.1)} fill="#fff" />
          <circle cx={x + (dx - 486) * 0.18} cy={y + (dy - 1200) * 0.15} r={20 * Math.min(1, blink(T, i * 0.1) * 1.6)} fill={INK} />
        </g>
      ))}
    </g>
  );
}

/* 4 — alone, each person's guess is very different */
function ArtGuesses({ T, t }) {
  const lens = [70, 200, 130];
  const cols = ['#B3202A', '#1F3B73', '#2B6E7A'];
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#D9B53A" />
      {[0, 1, 2].map((i) => {
        const x = 170 + i * 316;
        const g = tw(t, 0.3 + i * 0.4, 0.5);
        return (
          <g key={i}>
            <IiHead x={x} y={1330} s={0.62} T={T} ph={i * 0.8} shirt={cols[i]} hair={i === 1 ? '#3A1A14' : INK} long={i === 1} mouth="flat" look={osc(T, 2.2, i * 0.3) * 8} />
            <g opacity={g}><IiGuess x={x} y={1060 - (1 - g) * 40 + osc(T, 1.7, i * 0.2) * 8} len={lens[i] * g} col={cols[i]} s={0.95} /></g>
          </g>
        );
      })}
      {[328, 644].map((x) => <rect key={x} x={x - 10} y="900" width="20" height="828" rx="8" fill="#8E6B48" />)}
    </g>
  );
}

/* 5 — in a group, saying guesses aloud, the arrows drift to one answer */
function ArtHuddle({ T, t }) {
  const m = tw(t, 1.0, 1.6);
  const start = [70, 200, 130];
  const cols = ['#B3202A', '#E8C547', '#E07A2E'];
  const pos = [[220, 1180], [486, 1080], [752, 1180]];
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#24606B" />
      {pos.map(([x, y], i) => (
        <IiHead key={i} x={x} y={y + 160} s={0.62} T={T} ph={i * 0.6} shirt={cols[i]} hair={i === 2 ? '#3A1A14' : INK} long={i === 2} mouth={m > 0.8 ? 'smile' : 'o'} look={(486 - x) * 0.05} />
      ))}
      <ellipse cx="486" cy="1620" rx="400" ry="90" fill="#1A4A52" />
      <ellipse cx="486" cy="1600" rx="400" ry="90" fill="#8E6B48" />
      {pos.map(([x, y], i) => {
        const len = start[i] + (130 - start[i]) * m;
        return <IiGuess key={i} x={x} y={y - 180 + osc(T, 1.5, i * 0.3) * 8} len={len} col={cols[i] === '#E8C547' ? '#C9A227' : cols[i]} s={0.85} />;
      })}
      {m > 0.95 && [0, 1, 2].map((k) => {
        const p = ((T + k * 0.5) % 1.5) / 1.5;
        return <circle key={k} cx={486 + osc(T, 0.8, k * 0.3) * 200} cy={850 - p * 80} r="10" fill="#E8C547" opacity={1 - p} />;
      })}
    </g>
  );
}

/* 6 — tested alone later, they kept the group's answer */
function ArtKept({ T, t }) {
  const sway = osc(T, 2.4) * 3;
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#C9661F" />
      {[[220, 1220], [752, 1220]].map(([x, y], i) => (
        <g key={i} opacity={0.3 + 0.08 * osc(T, 2, i * 0.5)}>
          <circle cx={x} cy={y} r="80" fill="none" stroke={CREAM} strokeWidth="6" strokeDasharray="16 12" />
          <path d={`M${x - 120} 1500 C${x - 120} 1380 ${x - 70} 1330 ${x} 1330 C${x + 70} 1330 ${x + 120} 1380 ${x + 120} 1500`} fill="none" stroke={CREAM} strokeWidth="6" strokeDasharray="16 12" />
        </g>
      ))}
      <g transform={`rotate(${sway} 486 1700)`}>
        <IiHead x={486} y={1230} s={0.8} T={T} shirt="#B3202A" look={-4} mouth="smile" />
      </g>
      <g transform={`translate(486 ${940 + osc(T, 1.6) * 8}) rotate(${-3 + sway})`}>
        <rect x="-170" y="-90" width="340" height="180" rx="14" fill={CREAM} />
        <circle cx="0" cy="-76" r="22" fill="#B3202A" />
        <rect x="-4" y="-76" width="8" height="30" fill="#8E151D" />
        <line x1="-65" y1="10" x2="51" y2="10" stroke="#E07A2E" strokeWidth="14" strokeLinecap="round" />
        <path d="M39 -14 L73 10 L39 34 Z" fill="#E07A2E" />
        <text x="0" y="74" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="30" fill="#9A938A">GROUP ANSWER</text>
      </g>
      <g transform="translate(486 1500)">
        <line x1="-40" y1="-60" x2="-70" y2="-280" stroke="#B3202A" strokeWidth="44" strokeLinecap="round" />
        <circle cx="-74" cy="-300" r="32" fill={SKIN} />
      </g>
    </g>
  );
}

/* 7 — in the fog, we follow other people's footprints */
function ArtSigns({ T, t }) {
  const walk = (T * 120) % 240;
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#5A3290" />
      <path d="M486 1728 L430 1340 L230 980 L330 980 L486 1260 L640 980 L740 980 L540 1340 Z" fill="#7B57B5" />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const f = (k * 80 + walk * 0.33) % 480;
        const x = 600 + f * 0.25 + (k % 2 ? 18 : -18), y = 1340 - f * 0.75;
        return <ellipse key={k} cx={x} cy={y} rx="12" ry="18" fill="#3E2466" opacity={0.3 + 0.7 * (f / 480)} transform={`rotate(25 ${x} ${y})`} />;
      })}
      {[0, 1].map((k) => {
        const p = ((T * 0.25 + k * 0.5) % 1);
        const x = 560 + p * 140, y = 1250 - p * 230, s = 0.32 - p * 0.14;
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - p * 0.7}>
            <path d="M-90 360 L-90 160 C-90 100 -50 80 0 80 C50 80 90 100 90 160 L90 360 Z" fill={k ? '#2B6E7A' : '#E07A2E'} />
            <circle cx="0" cy="0" r="80" fill={SKIN} />
          </g>
        );
      })}
      {[0, 1, 2].map((k) => (
        <ellipse key={k} cx={486 + osc(T, 6, k * 0.33) * 300} cy={900 + k * 70} rx="320" ry="40" fill={CREAM} opacity="0.12" />
      ))}
      <IiHead x={330} y={1360} s={0.7} T={T} shirt="#E8C547" look={18} mouth="o" />
    </g>
  );
}

/* 8 — check: does the crowd actually know more? */
function ArtCheck({ T, t }) {
  const sweep = osc(T, 2.4);
  const found = tw(t, 2.0, 0.5);
  const gx = 486 + sweep * 220;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      {[[200, '#2B6E7A', false], [486, '#6A3FA0', true], [772, '#E07A2E', false]].map(([x, c, map], i) => (
        <g key={i}>
          <IiHead x={x} y={1020} s={0.55} T={T} ph={i * 0.7} shirt={c} hair={i === 1 ? '#3A1A14' : INK} long={i === 1} mouth={map ? 'smile' : 'flat'} />
          {map && (
            <g transform="translate(486 1210) rotate(-6)">
              <rect x="-80" y="-56" width="160" height="112" rx="8" fill={CREAM} />
              <path d="M-80 -56 L-26 -40 L26 -56 L80 -40" fill="none" stroke="#9A938A" strokeWidth="4" />
              <path d="M-50 30 q30 -60 60 -20 t30 -30" fill="none" stroke="#B3202A" strokeWidth="6" strokeDasharray="10 8" />
              <path d="M44 -42 l8 8 m0 -8 l-8 8" stroke="#B3202A" strokeWidth="6" />
            </g>
          )}
        </g>
      ))}
      <rect x="0" y="1340" width="972" height="40" fill="#1A2F5C" />
      <IiHead x={486} y={1520} s={0.9} T={T} shirt="#E8C547" look={sweep * 14} mouth="smile" />
      <g transform={`translate(${gx} 1100)`}>
        <circle r="110" fill="#BFD0F2" opacity=".25" />
        <circle r="110" fill="none" stroke="#E8C547" strokeWidth="18" />
        <line x1="70" y1="90" x2="150" y2="210" stroke="#E8C547" strokeWidth="30" strokeLinecap="round" />
      </g>
      <g transform="translate(486 830)" opacity={found}>
        <circle r={60 * found} fill="#2B6E7A" />
        <path d="M-26 0 l18 20 l36 -42" fill="none" stroke={CREAM} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

Object.assign(window, { ArtCrowd, ArtDarkRoom, ArtDot, ArtGuesses, ArtHuddle, ArtKept, ArtSigns, ArtCheck });
