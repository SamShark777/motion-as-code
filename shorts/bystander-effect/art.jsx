// art.jsx — scene illustrations for "Someone Else Bystander" (Darley & Latané 1968). Pure functions of T.
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
function ByPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
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
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      <ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — a headset that sits on a ByPerson head (same transform) */
function ByHeadset({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-118 0 C-118 -150 118 -150 118 0" fill="none" stroke={INK} strokeWidth="16" />
      <rect x="-138" y="-30" width="40" height="70" rx="16" fill={INK} />
      <rect x="98" y="-30" width="40" height="70" rx="16" fill={INK} />
      <path d="M-118 30 Q-110 90 -40 80" fill="none" stroke={INK} strokeWidth="8" />
      <circle cx="-36" cy="80" r="12" fill={INK} />
    </g>
  );
}

/* shared — the intercom box */
function ByIntercomBox({ x, y, s = 1, glow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-90" y="-120" width="180" height="240" rx="24" fill="#2B2B33" />
      <rect x="-70" y="-100" width="140" height="120" rx="14" fill="#4A4F5C" />
      {[-70, -50, -30, -10].map((yy) => <rect key={yy} x="-52" y={yy} width="104" height="8" rx="4" fill="#2B2B33" />)}
      <circle cx="-30" cy="70" r="20" fill="#B3202A" opacity={0.5 + 0.5 * glow} />
      <circle cx="30" cy="70" r="20" fill="#9EA3AD" />
    </g>
  );
}

/* 1 — someone falls; every bystander looks at somebody else */
function ArtByCrowd({ T }) {
  const ppl = [[150, 980, '#E8C547', 18, 0], [360, 900, '#2B6E7A', -18, 0.4], [612, 900, '#E07A2E', 18, 0.8], [822, 980, '#6A3FA0', -18, 1.2]];
  return (
    <g>
      <circle cx="486" cy="1250" r="430" fill="#264684" />
      {ppl.map(([x, y, c, look, ph], i) => (
        <g key={i} transform={`translate(0 ${osc(T, 2.2, ph) * 6})`}>
          <ByPerson x={x} y={y} T={T} ph={ph} s={0.62} shirt={c} mouth="flat" look={look * (osc(T, 3, ph) > 0 ? 1 : -1)} skin={i % 2 ? SKIN2 : SKIN} hair={i === 2 ? '#5A3A22' : INK} />
          <text x={x + 60} y={y - 110 + osc(T, 1, ph) * 8} fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="70" fill={CREAM} opacity={0.5 + 0.5 * Math.abs(osc(T, 1.4, ph))}>?</text>
        </g>
      ))}
      <ellipse cx="486" cy="1610" rx="320" ry="50" fill="#152A55" />
      <g transform="translate(486 1560)">
        <rect x="-60" y="-40" width="260" height="80" rx="40" fill={CREAM} />
        <line x1="190" y1="-10" x2="300" y2="-20" stroke={INK} strokeWidth="40" strokeLinecap="round" />
        <line x1="190" y1="20" x2="300" y2="40" stroke={INK} strokeWidth="40" strokeLinecap="round" />
        <circle cx="-130" cy="-10" r="70" fill={SKIN} />
        <path d="M-196 -30 C-200 -80 -150 -90 -120 -84 C-90 -80 -70 -60 -64 -40 Z" fill={INK} />
        <path d="M-160 -14 l20 12 M-160 -2 l20 -12 M-114 -14 l20 12 M-114 -2 l20 -12" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <line x1="-20" y1="-36" x2="-60" y2="-120" stroke={CREAM} strokeWidth="34" strokeLinecap="round" />
        <circle cx="-62" cy={-128 + osc(T, 0.5) * 6} r="24" fill={SKIN} />
      </g>
    </g>
  );
}

/* 2 — a student in a booth talking over the intercom */
function ArtByIntercom({ T }) {
  const talk = 0.4 + 0.6 * Math.abs(osc(T, 0.35));
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#DDD6C5" />
      <rect x="100" y="760" width="772" height="968" fill="#CFC7B4" />
      <rect x="100" y="760" width="40" height="968" fill="#BDB6A6" />
      <rect x="832" y="760" width="40" height="968" fill="#BDB6A6" />
      <ByIntercomBox x={700} y={1000} glow={Math.abs(osc(T, 1))} />
      {[0, 1, 2].map((k) => {
        const p = ((T * 0.9 + k / 3) % 1);
        return <path key={k} d={`M${470 + p * 110} ${1290 - p * 40} q${30 + p * 10} ${50 + p * 20} 0 ${100 + p * 40}`} fill="none" stroke="#1F3B73" strokeWidth="10" strokeLinecap="round" opacity={1 - p} />;
      })}
      <ByPerson x={360} y={1300} T={T} shirt="#B3202A" mouth="smile" look={12} />
      <ByHeadset x={360} y={1300} />
      <ellipse cx="370" cy="1360" rx="26" ry={8 + talk * 16} fill={INK} />
      <rect x="100" y="1560" width="772" height="168" fill="#8A6A44" />
      <rect x="100" y="1560" width="772" height="24" fill="#A8845A" />
    </g>
  );
}

/* 3 — the voice on the intercom seems to have a seizure */
function ArtBySeizure({ T }) {
  const flash = osc(T, 0.5) > 0 ? 1 : 0.35;
  const jit = osc(T, 0.09) * 6;
  const drops = [[300, 1100, 0], [660, 1120, 0.9]];
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#9E1B24" />
      <g transform={`translate(${jit} 0)`}>
        <ByIntercomBox x={486} y={900} s={1.1} glow={flash} />
      </g>
      {[-1, 1].map((sd) => [0, 1, 2].map((k) => {
        const p = ((T * 1.2 + k / 3) % 1);
        const x0 = 486 + sd * (130 + p * 200);
        return <path key={`${sd}${k}`} d={`M${x0} 800 l${sd * 30} 40 l${-sd * 30} 40 l${sd * 30} 40 l${-sd * 30} 40 l${sd * 30} 40`} fill="none" stroke={CREAM} strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" opacity={1 - p} />;
      }))}
      <g transform="translate(486 690)" opacity={flash}>
        <path d="M0 -70 L74 60 L-74 60 Z" fill="#E8C547" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
        <rect x="-7" y="-30" width="14" height="52" rx="6" fill={INK} />
        <circle cx="0" cy="40" r="9" fill={INK} />
      </g>
      <ByPerson x={486} y={1400} T={T} shirt="#2B6E7A" mouth="o" brow={-14} look={osc(T, 0.7) * 10} />
      <ByHeadset x={486} y={1400} />
      {drops.map(([x, y, ph], i) => {
        const p = ((T + ph) % 1.8) / 1.8;
        return (
          <g key={i} transform={`translate(${x} ${y + p * 130})`} opacity={1 - p}>
            <path d="M0 -26 C10 -10 16 0 16 8 A16 16 0 0 1 -16 8 C-16 0 -10 -10 0 -26 Z" fill="#9AD8FF" />
          </g>
        );
      })}
    </g>
  );
}

/* 4 — alone on the line: the student runs out to get help (85%) */
function ArtByAlone({ T, t }) {
  const run = osc(T, 0.45);
  const n = Math.round(85 * tw(t, 0.2, 1.0));
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D9B53A" />
      <rect x="560" y="800" width="300" height="760" rx="10" fill="#7A5A2E" />
      <rect x="586" y="826" width="248" height="734" fill="#F7F4EC" />
      <path d="M586 826 L760 880 L760 1500 L586 1560 Z" fill="#A8845A" />
      <circle cx="730" cy="1200" r="14" fill="#E8C547" />
      <rect x="0" y="1560" width="972" height="168" fill="#B8962E" />
      {[0, 1, 2].map((k) => <line key={k} x1={110 + k * 20} y1={1140 + k * 80} x2={200 + k * 20} y2={1140 + k * 80} stroke={INK} strokeWidth="10" strokeLinecap="round" opacity={0.3 + 0.5 * Math.abs(osc(T, 0.3, k * 0.2))} />)}
      <g transform={`translate(${380} ${-Math.abs(run) * 20}) rotate(8 0 1400)`}>
        <line x1="-30" y1="1400" x2={-30 - run * 90} y2="1560" stroke={INK} strokeWidth="44" strokeLinecap="round" />
        <line x1="30" y1="1400" x2={30 + run * 90} y2="1560" stroke={INK} strokeWidth="44" strokeLinecap="round" />
        <line x1="-60" y1="1240" x2={-60 + run * 100} y2="1360" stroke="#B3202A" strokeWidth="40" strokeLinecap="round" />
        <line x1="60" y1="1240" x2={60 - run * 100} y2="1360" stroke="#B3202A" strokeWidth="40" strokeLinecap="round" />
        <rect x="-85" y="1200" width="170" height="230" rx="60" fill="#B3202A" />
        <circle cx="0" cy="1110" r="90" fill={SKIN} />
        <path d="M-92 1100 C-96 1020 -40 1004 0 1004 C56 1004 98 1030 90 1090 C64 1060 30 1052 0 1054 C-36 1052 -70 1066 -92 1100 Z" fill={INK} />
        <Eye cx={-30} cy={1112} T={T} rx={15} ry={15} look={8} />
        <Eye cx={34} cy={1112} T={T} rx={15} ry={15} look={8} />
        <path d="M-16 1158 q18 -10 36 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      </g>
      <g transform={`translate(486 ${880 + osc(T, 1.4) * 8})`}>
        <rect x="-150" y="-70" width="300" height="140" rx="70" fill={INK} />
        <text y="30" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="92" fill="#E8C547">{n}%</text>
      </g>
    </g>
  );
}

/* 5 — five booths; only one of them gets up (31%) */
function ArtByGroup({ T, t }) {
  const xs = [100, 293, 486, 679, 872];
  const n = Math.round(31 * tw(t, 0.2, 1.0));
  const up = tw(t, 0.6, 0.5);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#24606B" />
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - 92} y="1180" width="184" height="548" fill={i % 2 ? '#1D4E57' : '#20565F'} />
          <g transform={`translate(0 ${i === 2 ? -up * 120 : osc(T, 2.4, i * 0.3) * 4})`}>
            <ByPerson x={x} y={1360} T={T} ph={i * 0.4} s={0.5} shirt={['#E8C547', '#B3202A', '#E07A2E', '#6A3FA0', CREAM][i]} mouth={i === 2 ? 'o' : 'flat'} look={i === 2 ? 0 : (i < 2 ? 12 : -12) * (osc(T, 2.6, i * 0.2) > 0 ? 1 : -1)} skin={i % 2 ? SKIN2 : SKIN} />
            <ByHeadset x={x} y={1360} s={0.5} />
          </g>
          <rect x={x - 92} y="1600" width="184" height="128" fill="#8A6A44" />
          <rect x={x - 96} y="1180" width="8" height="548" fill="#163E45" />
        </g>
      ))}
      <g transform={`translate(486 ${900 + osc(T, 1.4) * 8})`}>
        <rect x="-150" y="-70" width="300" height="140" rx="70" fill={CREAM} />
        <text y="30" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="92" fill="#2B6E7A">{n}%</text>
      </g>
    </g>
  );
}

/* 6 — responsibility split into pieces; everybody points at somebody else */
function ArtByDiffusion({ T, t }) {
  const split = tw(t, 0.4, 0.9);
  const xs = [140, 313, 486, 659, 832];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#D26E25" />
      {xs.map((x, i) => {
        const tx = 486 + (x - 486) * split, ty = 860 + split * 180 + osc(T, 1.6, i * 0.2) * 10;
        return (
          <g key={i} transform={`translate(${tx} ${ty}) scale(${1 - 0.6 * split})`}>
            <rect x="-60" y="-60" width="120" height="120" rx="18" fill="#B3202A" stroke={INK} strokeWidth="8" />
            <text y="34" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="96" fill={CREAM}>!</text>
          </g>
        );
      })}
      {xs.map((x, i) => {
        const dir = i === 4 ? -1 : 1;
        const shrug = Math.abs(osc(T, 1.2, i * 0.25)) * 14;
        return (
          <g key={`p${i}`}>
            <ByPerson x={x} y={1370 - shrug * 0.4} T={T} ph={i * 0.5} s={0.52} shirt={['#1F3B73', '#E8C547', '#2B6E7A', '#6A3FA0', CREAM][i]} mouth="flat" look={dir * 12} skin={i % 2 ? SKIN2 : SKIN} hair={i === 3 ? '#5A3A22' : INK} />
            <line x1={x + dir * 40} y1="1520" x2={x + dir * 110} y2={1470 - shrug} stroke={['#1F3B73', '#E8C547', '#2B6E7A', '#6A3FA0', CREAM][i]} strokeWidth="30" strokeLinecap="round" />
            <circle cx={x + dir * 116} cy={1466 - shrug} r="16" fill={i % 2 ? SKIN2 : SKIN} />
          </g>
        );
      })}
    </g>
  );
}

/* 7 — pick ONE person: a pointing hand singles out the red jacket */
function ArtByOne({ T, t }) {
  const sp = tw(t, 0.5, 0.5);
  const crowd = [[120, 1200], [300, 1150], [672, 1150], [852, 1200], [210, 1420], [762, 1420]];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#7B4FB3" />
      <polygon points="430,700 542,700 700,1700 272,1700" fill="#FFF4D6" opacity={0.25 * sp} />
      {crowd.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y + osc(T, 2, i * 0.3) * 6})`} opacity={1 - 0.35 * sp}>
          <circle r="80" fill="#4E2C7A" />
          <ellipse cy="210" rx="140" ry="130" fill="#4E2C7A" />
        </g>
      ))}
      <ByPerson x={486} y={1180} T={T} s={0.72} shirt="#B3202A" mouth={sp > 0.5 ? 'o' : 'flat'} brow={sp > 0.5 ? -12 : 0} />
      <path d="M486 1330 L486 1640" stroke="#8E151D" strokeWidth="10" />
      {[1430, 1500, 1570].map((y) => <circle key={y} cx="470" cy={y} r="8" fill={INK} />)}
      <g transform={`translate(${760 + osc(T, 1.2) * 8} ${1780 - sp * 80}) rotate(-38) scale(1.5)`}>
        <rect x="-50" y="-30" width="100" height="160" rx="40" fill={SKIN2} />
        <rect x="-16" y="-190" width="32" height="180" rx="16" fill={SKIN2} />
        <rect x="-60" y="60" width="120" height="120" fill="#1F3B73" />
      </g>
    </g>
  );
}

/* 8 — "You in the red jacket, call an ambulance": phone call, ambulance arrives */
function ArtByJacket({ T, t }) {
  const drive = tw(t, 0.2, 1.4);
  const siren = osc(T, 0.4) > 0;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <rect x="0" y="1560" width="972" height="168" fill="#2E3546" />
      {[0, 1, 2, 3].map((k) => <rect key={k} x={60 + k * 240} y="1640" width="130" height="14" rx="7" fill={CREAM} opacity=".6" />)}
      <g transform={`translate(${1150 - drive * 480} 1560)`}>
        <rect x="-180" y="-220" width="360" height="200" rx="20" fill="#F7F4EC" />
        <path d="M180 -150 L260 -150 L300 -80 L300 -20 L180 -20 Z" fill="#F7F4EC" />
        <path d="M196 -136 L252 -136 L280 -86 L196 -86 Z" fill="#CFE6F5" />
        <rect x="-180" y="-110" width="480" height="22" fill="#B3202A" />
        <rect x="-30" y="-200" width="40" height="110" fill="#B3202A" />
        <rect x="-65" y="-165" width="110" height="40" fill="#B3202A" />
        <rect x="-60" y="-250" width="60" height="30" rx="8" fill={siren ? '#E2453C' : '#7A1B1B'} />
        <rect x="10" y="-250" width="60" height="30" rx="8" fill={siren ? '#5A7BD8' : '#E2453C'} />
        <circle cx="-100" cy="0" r="42" fill={INK} />
        <circle cx="200" cy="0" r="42" fill={INK} />
        {siren && [-1, 1].map((sd) => <path key={sd} d={`M${sd * 90 - 5} -280 l${sd * 30} -30`} stroke="#E8C547" strokeWidth="9" strokeLinecap="round" />)}
      </g>
      <g transform={`translate(0 ${osc(T, 1.8) * 6})`}>
        <ByPerson x={300} y={1080} T={T} s={0.72} shirt="#B3202A" mouth="flat" look={14} brow={-6} />
        <line x1="380" y1="1300" x2="400" y2="1110" stroke="#B3202A" strokeWidth="46" strokeLinecap="round" />
        <rect x="370" y="1020" width="56" height="100" rx="12" fill={INK} />
        <circle cx="398" cy="1110" r="28" fill={SKIN} />
        {[0, 1].map((k) => <path key={k} d={`M${450 + k * 26} ${1030 - k * 6} q20 30 0 60`} fill="none" stroke={CREAM} strokeWidth="7" strokeLinecap="round" opacity={0.3 + 0.7 * Math.abs(osc(T, 0.6, k * 0.25))} />)}
      </g>
    </g>
  );
}

Object.assign(window, { ArtByCrowd, ArtByIntercom, ArtBySeizure, ArtByAlone, ArtByGroup, ArtByDiffusion, ArtByOne, ArtByJacket });
