// art.jsx — scene illustrations for "Missing Out (FOMO, Przybylski et al. 2013)". Pure functions of T.
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

/* shared — a simple person (head + torso), drawn around (x, y) = top of the head */
function FoPal({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', s = 1, look = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-150 420 C-150 300 -90 250 0 250 C90 250 150 300 150 420 Z" fill={shirt} />
      <rect x="-34" y="190" width="68" height="80" rx="24" fill={SKIN2} />
      <circle cx="0" cy="120" r="104" fill={skin} />
      <path d="M-104 112 C-110 30 -50 4 0 4 C62 4 112 34 104 104 C80 70 40 58 0 62 C-44 58 -84 76 -104 112 Z" fill={hair} />
      <Eye cx={-38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      <Eye cx={38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      {mouth === 'smile' && <path d="M-30 176 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'flat' && <path d="M-24 182 q12 -8 24 0 t24 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'sad' && <path d="M-28 190 q28 -22 56 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'open' && <ellipse cx="0" cy="182" rx="22" ry={14 + Math.abs(osc(T, 0.6)) * 8} fill="#3A0C10" />}
      <ellipse cx="-68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a phone centred on (0,0); glow pulses; optional red badge count */
function FoPhone({ T, s = 1, badge = 0, screen = '#9AD8FF' }) {
  return (
    <g transform={`scale(${s})`}>
      <rect x="-60" y="-110" width="120" height="220" rx="20" fill={INK} />
      <rect x="-50" y="-94" width="100" height="180" rx="10" fill={screen} opacity={0.75 + 0.25 * osc(T, 0.8)} />
      <rect x="-18" y="-104" width="36" height="6" rx="3" fill="#3A3F4B" />
      {badge > 0 && (
        <g transform={`translate(54 -104) scale(${1 + 0.15 * Math.abs(osc(T, 0.5))})`}>
          <circle r="28" fill="#E2453C" />
          <text y="11" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="32" fill="#fff">{badge}</text>
        </g>
      )}
    </g>
  );
}

const FO_CONF = ['#1F3B73', '#B3202A', '#E8C547', '#2B6E7A', '#E07A2E', '#6A3FA0'];

/* tiny party: balloons + dancing silhouettes, drawn around (0,0) */
function FoParty({ T, s = 1, tint = 1 }) {
  return (
    <g transform={`scale(${s})`} opacity={tint}>
      {[[-120, '#B3202A'], [-40, '#E8C547'], [60, '#2B6E7A'], [140, '#E07A2E']].map(([x, c], i) => (
        <g key={i} transform={`translate(${x} ${-90 + osc(T, 1.4, i * 0.3) * 10})`}>
          <path d="M0 40 q10 30 -4 60" fill="none" stroke={INK} strokeWidth="3" />
          <ellipse rx="28" ry="36" fill={c} />
        </g>
      ))}
      {[-110, -20, 70, 150].map((x, i) => {
        const b = Math.abs(osc(T, 0.5, i * 0.25)) * 16;
        return (
          <g key={i} transform={`translate(${x} ${40 - b})`}>
            <circle r="22" fill={INK} />
            <path d="M-26 70 Q-26 26 0 26 Q26 26 26 70 Z" fill={INK} />
            <line x1="-20" y1="34" x2={-40} y2={osc(T, 0.5, i * 0.25) * 30} stroke={INK} strokeWidth="10" strokeLinecap="round" />
            <line x1="20" y1="34" x2={40} y2={-osc(T, 0.5, i * 0.25) * 30} stroke={INK} strokeWidth="10" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

/* 1 — lying in bed offline, a thought bubble with a party */
function ArtFoPhone({ T }) {
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      <rect x="80" y="1460" width="812" height="160" rx="30" fill="#8C6A48" />
      <rect x="110" y="1420" width="752" height="90" rx="30" fill={CREAM} />
      <rect x="100" y="1300" width="200" height="140" rx="40" fill="#fff" />
      <g transform="rotate(-90 260 1330)">
        <FoPal x={260} y={1180} T={T} shirt="#E07A2E" mouth="flat" s={0.6} look={-8} />
      </g>
      <path d={`M240 1450 C240 1250 330 1220 400 1290 C480 ${1360 + osc(T, 3) * 8} 820 1380 860 1440 L860 1520 L240 1520 Z`} fill="#6A3FA0" />
      <g transform="translate(700 1430) rotate(80)"><FoPhone T={T} s={0.45} screen="#2A2F3B" /></g>
      <g transform={`translate(0 ${osc(T, 1.6) * 8})`}>
        <circle cx="380" cy="1200" r="16" fill={CREAM} />
        <circle cx="430" cy="1140" r="26" fill={CREAM} />
        <ellipse cx="580" cy="990" rx="250" ry="160" fill={CREAM} />
        <g transform="translate(580 1000)"><FoParty T={T} s={0.95} /></g>
      </g>
    </g>
  );
}

/* 2 — a big party bubble; you outside, checking the phone again */
function ArtFoParty({ T, t }) {
  const peek = Math.abs(osc(T, 1.2));
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#DDD6C5" />
      <circle cx="440" cy="1060" r="250" fill="#1F3B73" />
      {Array.from({ length: 16 }).map((_, i) => {
        const p = ((T * (0.3 + hsh(i) * 0.3) + hsh(i + 7)) % 1);
        const a = hsh(i + 2) * TAU;
        return <rect key={i} x={440 + Math.cos(a) * 200 * hsh(i + 5)} y={860 + p * 380} width="14" height="22" rx="3" fill={FO_CONF[i % 6]} transform={`rotate(${T * 200 + i * 40} ${447 + Math.cos(a) * 200 * hsh(i + 5)} ${871 + p * 380})`} opacity={Math.sin(p * Math.PI)} />;
      })}
      <g transform="translate(440 1100)"><FoParty T={T} s={1.1} /></g>
      <FoPal x={760} y={1330} T={T} shirt="#B3202A" mouth="flat" s={0.85} look={-10} />
      <line x1="700" y1="1700" x2="640" y2={1560 - peek * 20} stroke="#B3202A" strokeWidth="46" strokeLinecap="round" />
      <g transform={`translate(640 ${1520 - peek * 20}) rotate(-10)`}><FoPhone T={T} s={0.5} badge={3 + Math.floor(t * 1.5) % 7} /></g>
    </g>
  );
}

/* 3 — the first FOMO questionnaire: rating dots fill row by row */
function ArtFoScale({ T, t }) {
  const filled = Math.floor(t * 3.2);
  const pen = osc(T, 0.3) * 8;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#9A1B24" />
      <g transform={`rotate(${-3 + osc(T, 2.6) * 1.5} 486 1260)`}>
        <rect x="236" y="880" width="500" height="720" rx="26" fill="#8C6A48" />
        <rect x="266" y="920" width="440" height="650" rx="12" fill="#fff" />
        <rect x="406" y="860" width="160" height="60" rx="14" fill="#C9CCD3" />
        <text x="486" y="1010" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="64" fill="#B3202A">FOMO</text>
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r}>
            <rect x="300" y={1060 + r * 100} width="140" height="14" rx="7" fill="#BDB6A6" />
            {[0, 1, 2, 3, 4].map((c) => {
              const pick = (r * 2 + 3) % 5;
              const on = c === pick && r * 5 + c < filled + r * 5 && filled > r;
              return <circle key={c} cx={470 + c * 50} cy={1068 + r * 100} r="17" fill={on ? '#B3202A' : 'none'} stroke={INK} strokeWidth="5" />;
            })}
          </g>
        ))}
      </g>
      <g transform={`translate(${650 + pen} ${1100 + Math.min(filled, 4) * 100})`}>
        <rect x="-10" y="-150" width="22" height="150" rx="6" fill="#E8C547" transform="rotate(30)" />
        <path d="M-4 0 L10 -8 L0 -24 Z" fill={INK} transform="rotate(30)" />
        <ellipse cx="70" cy="-120" rx="50" ry="40" fill={SKIN} />
        <rect x="80" y="-110" width="200" height="70" rx="35" fill="#1F3B73" />
      </g>
    </g>
  );
}

/* 4 — lower mood: rain cloud over a person scrolling */
function ArtFoMood({ T }) {
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D4B23C" />
      <g transform={`translate(${osc(T, 3) * 20} 0)`}>
        {[[400, 900, 80], [490, 870, 100], [590, 900, 80], [450, 940, 70], [540, 945, 76]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#7E8696" />)}
        {Array.from({ length: 7 }).map((_, i) => {
          const p = ((T * 1.4 + hsh(i)) % 1);
          return <line key={i} x1={380 + i * 38} y1={1000 + p * 200} x2={372 + i * 38} y2={1030 + p * 200} stroke="#1F3B73" strokeWidth="8" strokeLinecap="round" opacity={1 - p} />;
        })}
      </g>
      <FoPal x={486} y={1210} T={T} shirt="#6A3FA0" mouth="sad" look={0} />
      <path d="M430 1290 l-14 -10 M542 1290 l14 -10" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <line x1="590" y1="1620" x2="540" y2="1520" stroke="#6A3FA0" strokeWidth="56" strokeLinecap="round" />
      <g transform="translate(530 1520) rotate(-20)">
        <FoPhone T={T} s={0.55} />
        <rect x="-22" y={-40 + ((T * 60) % 60)} width="44" height="10" rx="5" fill="#fff" opacity=".8" />
        <rect x="-22" y={-10 + ((T * 60) % 60)} width="34" height="10" rx="5" fill="#fff" opacity=".8" />
      </g>
      <ellipse cx="560" cy="1500" rx="40" ry="30" fill={SKIN} />
    </g>
  );
}

/* 5 — checking the phone at the wheel: road rushes by, warning flashes */
function ArtFoDriving({ T }) {
  const road = (T * 600) % 200;
  const flash = Math.abs(osc(T, 0.7)) > 0.5 ? 1 : 0.25;
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#235C66" />
      <path d="M380 800 L592 800 L972 1300 L0 1300 Z" fill="#3A3F4B" />
      {[0, 1, 2, 3].map((k) => {
        const p = ((k * 200 + road) % 800) / 800;
        return <rect key={k} x={486 - 6 - p * 14} y={800 + p * p * 500} width={12 + p * 28} height={20 + p * 70} fill={CREAM} />;
      })}
      <rect x="0" y="1260" width="972" height="468" fill="#14363D" />
      <g transform={`translate(486 1420) rotate(${osc(T, 1.8) * 6})`}>
        <circle r="230" fill="none" stroke={INK} strokeWidth="46" />
        <rect x="-230" y="-20" width="460" height="40" fill={INK} />
        <circle r="60" fill={INK} />
      </g>
      <ellipse cx="270" cy="1400" rx="44" ry="56" fill={SKIN} />
      <line x1="200" y1="1728" x2="260" y2="1440" stroke="#E07A2E" strokeWidth="70" strokeLinecap="round" />
      <line x1="780" y1="1728" x2="720" y2="1360" stroke="#E07A2E" strokeWidth="70" strokeLinecap="round" />
      <g transform="translate(720 1270) rotate(12)"><FoPhone T={T} s={0.62} badge={9} /></g>
      <ellipse cx="716" cy="1350" rx="44" ry="40" fill={SKIN} />
      <g transform="translate(486 960)" opacity={flash}>
        <path d="M0 -90 L95 70 L-95 70 Z" fill="#E8C547" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
        <rect x="-9" y="-40" width="18" height="66" rx="6" fill={INK} />
        <circle cy="48" r="10" fill={INK} />
      </g>
    </g>
  );
}

/* 6 — a link, not a cause: chain between phone and mood, a crossed-out arrow */
function ArtFoLink({ T, t }) {
  const sway = osc(T, 2) * 6;
  const strike = tw(t, 0.8, 0.5);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#C9671F" />
      <g transform="translate(220 1200)"><FoPhone T={T} s={0.9} badge={5} /></g>
      <g transform={`translate(760 ${1200 + osc(T, 1.4) * 8})`}>
        <circle r="110" fill="#E8C547" />
        <circle cx="-36" cy="-20" r="13" fill={INK} />
        <circle cx="36" cy="-20" r="13" fill={INK} />
        <path d="M-40 46 q40 -30 80 0" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      </g>
      <g transform={`rotate(${sway} 486 1220)`}>
        {[0, 1, 2, 3, 4].map((k) => (
          <ellipse key={k} cx={330 + k * 78} cy={1220 + Math.sin(k / 4 * Math.PI) * 40} rx="50" ry="28" fill="none" stroke={CREAM} strokeWidth="16" transform={`rotate(${k % 2 ? 90 : 0} ${330 + k * 78} ${1220 + Math.sin(k / 4 * Math.PI) * 40})`} />
        ))}
      </g>
      <g transform="translate(486 1480)">
        <path d="M-200 0 L170 0 M130 -40 L190 0 L130 40" fill="none" stroke={INK} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={-120} y1={-90} x2={-120 + 240 * strike} y2={-90 + 180 * strike} stroke="#B3202A" strokeWidth="24" strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
        <line x1={120} y1={-90} x2={120 - 240 * strike} y2={-90 + 180 * strike} stroke="#B3202A" strokeWidth="24" strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
      </g>
    </g>
  );
}

/* 7 — phone face-down, the imagined party fades, a real friend and tea */
function ArtFoChoose({ T, t }) {
  const fade = 1 - tw(t, 1.0, 1.6) * 0.85;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#5A3290" />
      <g opacity={fade} transform={`translate(0 ${osc(T, 1.6) * 6})`}>
        <ellipse cx="300" cy="930" rx="190" ry="120" fill={CREAM} opacity=".8" />
        <g transform="translate(300 950)"><FoParty T={T} s={0.65} /></g>
        <circle cx="330" cy="1100" r="18" fill={CREAM} opacity=".8" />
      </g>
      <FoPal x={300} y={1180} T={T} shirt="#E8C547" mouth="smile" look={10} s={0.95} />
      <FoPal x={720} y={1200} T={T} ph={1.4} shirt="#2B6E7A" hair="#5A3A22" skin="#E2AE86" mouth="open" look={-10} s={0.9} />
      <rect x="120" y="1540" width="732" height="40" rx="12" fill="#8C6A48" />
      <rect x="140" y="1580" width="692" height="148" fill="#6E5236" />
      <g transform="translate(486 1520)">
        <rect x="-60" y="-14" width="120" height="16" rx="6" fill={INK} />
        <rect x="-54" y="-10" width="108" height="8" rx="4" fill="#3A3F4B" />
      </g>
      {[[400, '#E07A2E'], [600, '#B3202A']].map(([x, c], i) => (
        <g key={i} transform={`translate(${x} 1470)`}>
          <path d="M-36 -30 L36 -30 L30 60 L-30 60 Z" fill={c} />
          <path d="M36 -10 q30 0 26 26 q-4 20 -30 18" fill="none" stroke={c} strokeWidth="10" />
          {[0, 1].map((k) => {
            const p = ((T + k * 0.8 + i * 0.4) % 1.6) / 1.6;
            return <path key={k} d={`M${-10 + k * 20} ${-44 - p * 80} q12 -16 0 -32 q-12 -16 0 -32`} fill="none" stroke={CREAM} strokeWidth="6" strokeLinecap="round" opacity={Math.sin(p * Math.PI) * 0.8} />;
          })}
        </g>
      ))}
    </g>
  );
}

/* 8 — notifications off for one hour: crossed bell + a draining 60-minute timer */
function ArtFoHour({ T, t }) {
  const left = 1 - ((t * 0.08) % 1);
  const a = left * TAU;
  const ring = osc(T, 0.12) * (t < 1 ? 10 : 0);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      <g transform="translate(486 1180)">
        <circle r="230" fill={CREAM} />
        <path d={`M0 0 L0 -200 A200 200 0 ${left > 0.5 ? 1 : 0} 1 ${Math.sin(a) * 200} ${-Math.cos(a) * 200} Z`} fill="#2B6E7A" />
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x="-5" y="-222" width="10" height="20" rx="4" fill={INK} transform={`rotate(${i * 30})`} />)}
        <circle r="20" fill={INK} />
        <text y="330" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="80" fill={CREAM}>1 HOUR</text>
      </g>
      <g transform={`translate(250 920) rotate(${ring})`}>
        <circle r="96" fill="#E8C547" />
        <path d="M-44 30 L-44 -10 C-44 -50 44 -50 44 -10 L44 30 L56 44 L-56 44 Z" fill={INK} />
        <circle cy="58" r="12" fill={INK} />
        <line x1="-70" y1="-70" x2="70" y2="70" stroke="#B3202A" strokeWidth="18" strokeLinecap="round" />
      </g>
      <g transform={`translate(760 ${1560 + osc(T, 1.8) * 6}) rotate(180)`}><FoPhone T={T} s={0.6} screen="#2A2F3B" /></g>
    </g>
  );
}

Object.assign(window, { ArtFoPhone, ArtFoParty, ArtFoScale, ArtFoMood, ArtFoDriving, ArtFoLink, ArtFoChoose, ArtFoHour });
