// art.jsx — scene illustrations for "Skill or Ref?" (self-serving bias, Lau & Russell 1980). Pure functions of T.
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
const DARK = '#3A1A14', TAN = '#E0A97E', DEEP = '#8A5A3C';

/* shared — a person: head centred at (x, y), torso below; arms are drawn by each scene */
function SsPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, neck = SKIN2, mouth = 'smile', look = 0, s = 1, brow = 0, cap }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={neck} />
      <circle cx="-108" cy="10" r="24" fill={neck} />
      <circle cx="108" cy="10" r="24" fill={neck} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      {cap && <path d="M-112 -40 C-110 -130 110 -130 112 -40 Z M60 -48 L190 -40 L180 -22 L60 -26 Z" fill={cap} />}
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34 - brow * 0.4} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1={-34 - brow * 0.4} x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <Eye cx={-40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      <Eye cx={40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      {mouth === 'smile' && <path d="M-34 50 q34 34 68 0 Z" fill={INK} />}
      {mouth === 'frown' && <path d="M-28 70 q28 -24 56 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'shout' && <ellipse cx="0" cy="62" rx={20} ry={18 + Math.abs(osc(T, 0.3)) * 10} fill={INK} />}
      {mouth === 'talk' && <ellipse cx="0" cy="60" rx="22" ry={6 + Math.abs(osc(T, 0.26)) * 14} fill={INK} />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      <ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — an arm as a bent stroke ending in a hand */
function SsArm({ pts, c, w = 46, hand = SKIN }) {
  const d = 'M' + pts.map(([a, b]) => `${a} ${b}`).join(' L');
  const [hx, hy] = pts[pts.length - 1];
  return (
    <g>
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={hx} cy={hy} r={w * 0.62} fill={hand} />
    </g>
  );
}

/* shared — a striped referee with a whistle, head at (x, y) */
function SsRef({ x, y, T, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-150" y="190" width="300" height="420" rx="110" fill="#F7F3EA" />
      {[-105, -35, 35, 105].map((sx) => <rect key={sx} x={sx - 18} y="200" width="36" height="400" fill={INK} />)}
      <rect x="-30" y="90" width="60" height="120" rx="24" fill={DEEP} />
      <ellipse cx="0" cy="0" rx="100" ry="112" fill={TAN} />
      <path d="M-100 -20 C-104 -110 104 -110 100 -20 C70 -60 -70 -60 -100 -20 Z" fill={INK} />
      <Eye cx={-36} cy={6} T={T} ph={1.1} rx={17} ry={16} look={-8} />
      <Eye cx={36} cy={6} T={T} ph={1.1} rx={17} ry={16} look={-8} />
      <line x1="-24" y1="62" x2="24" y2="62" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M0 150 L-20 200 M0 150 L20 200" stroke="#B3202A" strokeWidth="6" />
      <rect x="-22" y="190" width="44" height="26" rx="10" fill="#C9CCD3" />
    </g>
  );
}

/* 1 — split: proud flex by the WIN board | same player blaming the ref by the LOSS board */
function ArtSsScore({ T, t }) {
  const flex = osc(T, 0.9) * 8;
  const lose = tw(t, 1.8, 0.5);
  const jab = osc(T, 0.35) * 14;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#2A4C8C" />
      <g transform={`translate(0 ${osc(T, 2.2) * 4})`}>
        <rect x="80" y="790" width="320" height="170" rx="22" fill={INK} />
        <text x="240" y="860" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="52" fill="#7BD88F">WIN</text>
        <text x="240" y="935" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#E8C547">3–1</text>
        <SsArm pts={[[180, 1340], [118, 1290], [140, 1210 + flex]]} c="#E8C547" w={40} />
        <circle cx="128" cy={1262 + flex * 0.5} r="30" fill="#E8C547" />
        <SsPerson x={240} y={1170} s={0.62} T={T} shirt="#E8C547" mouth="smile" brow={-4} />
        <SsArm pts={[[300, 1340], [362, 1290], [340, 1210 - flex]]} c="#E8C547" w={40} />
        <circle cx="352" cy={1262 - flex * 0.5} r="30" fill="#E8C547" />
      </g>
      <line x1="486" y1="800" x2="486" y2="1728" stroke={CREAM} strokeWidth="8" strokeDasharray="28 22" opacity=".6" />
      <g opacity={0.25 + 0.75 * lose} transform={`translate(${(1 - lose) * 60} 0)`}>
        <rect x="572" y="790" width="320" height="170" rx="22" fill={INK} />
        <text x="732" y="860" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="52" fill="#FF6B5E">LOSS</text>
        <text x="732" y="935" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#E8C547">1–3</text>
        <SsRef x={880} y={1300} s={0.42} T={T} />
        <SsPerson x={660} y={1170} s={0.62} T={T} ph={0.7} shirt="#E8C547" skin="#F4A08A" mouth="shout" brow={12} look={9} />
        <SsArm pts={[[720, 1350], [790 + jab * 0.4, 1300], [836 + jab, 1268]]} c="#E8C547" w={40} />
        {[0, 1, 2].map((k) => (
          <line key={k} x1="560" y1={1040 + k * 26} x2="590" y2={1030 + k * 26} stroke="#FF6B5E" strokeWidth="8" strokeLinecap="round" opacity={0.5 + 0.5 * Math.abs(osc(T, 0.4, k * 0.2))} />
        ))}
      </g>
    </g>
  );
}

/* 2 — 1980 sports pages flipping under a magnifying glass, two researchers peeking */
function ArtSsPaper({ T, t }) {
  const flip = Math.cos(((T % 1.8) / 1.8) * Math.PI);
  const gx = 486 + osc(T, 3.2) * 170, gy = 1180 + osc(T, 1.6) * 90;
  const stamp = tw(t, 0.2, 0.5);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#DDD6C5" />
      <g transform="rotate(-3 486 1200)">
        <rect x="160" y="830" width="652" height="740" rx="10" fill="#F7F3EA" stroke={INK} strokeWidth="8" />
        <text x="486" y="920" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="74" fill={INK}>SPORTS</text>
        <line x1="190" y1="950" x2="782" y2="950" stroke={INK} strokeWidth="6" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
          <g key={k}>
            <rect x="196" y={990 + k * 52} width={220 - (k % 3) * 30} height="16" rx="8" fill="#BDB6A6" />
            <rect x="196" y={1012 + k * 52} width={200} height="10" rx="5" fill="#D6CFBF" />
          </g>
        ))}
        <rect x="440" y="980" width="340" height="200" rx="8" fill="#2B6E7A" />
        <circle cx="610" cy="1080" r="56" fill={CREAM} />
        <path d="M570 1060 q40 -20 80 0 M570 1100 q40 20 80 0" fill="none" stroke={INK} strokeWidth="6" />
        <g transform={`translate(486 0) scale(${flip} 1) translate(-486 0)`}>
          <rect x="486" y="1210" width="300" height="330" fill={flip > 0 ? '#EFE9DC' : '#E2DACA'} stroke={INK} strokeWidth="5" />
          {[0, 1, 2, 3, 4].map((k) => <rect key={k} x="510" y={1240 + k * 56} width="240" height="14" rx="7" fill="#BDB6A6" />)}
        </g>
      </g>
      <g transform={`translate(760 820) rotate(${-12 + (1 - stamp) * 30}) scale(${0.5 + 0.5 * stamp})`} opacity={stamp}>
        <rect x="-120" y="-56" width="240" height="112" rx="16" fill="#B3202A" />
        <text y="26" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="76" fill={CREAM}>1980</text>
      </g>
      <g transform={`translate(${gx} ${gy})`}>
        <line x1="62" y1="62" x2="150" y2="150" stroke={INK} strokeWidth="30" strokeLinecap="round" />
        <circle r="92" fill="#fff" opacity=".35" stroke={INK} strokeWidth="18" />
        <path d="M-50 -30 q20 -30 50 -40" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      </g>
      {[[300, SKIN, INK, 0], [672, SKIN2, DARK, 0.9]].map(([x, sk, hr, ph], i) => (
        <g key={i} transform={`translate(${x} ${1690 - Math.abs(osc(T, 1.4, ph)) * 14})`}>
          <ellipse rx="110" ry="100" fill={sk} />
          <path d="M-110 -10 C-110 -110 110 -110 110 -10 C70 -50 -70 -50 -110 -10 Z" fill={hr} />
          <Eye cx={-38} cy={-14} T={T} ph={ph} rx={18} ry={18} look={-6 + i * 12} />
          <Eye cx={38} cy={-14} T={T} ph={ph} rx={18} ry={18} look={-6 + i * 12} />
        </g>
      ))}
    </g>
  );
}

/* 3 — coach at a post-game press table, quotes being tagged SKILL / LUCK */
function SsTag({ x, y, p, text, fill, rot = -8 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.4 + 0.6 * p})`} opacity={p}>
      <rect x="-110" y="-38" width="220" height="76" rx="38" fill={fill} />
      <text y="18" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="48" fill={INK}>{text}</text>
    </g>
  );
}
function ArtSsMic({ T, t }) {
  const q1 = tw(t, 0.5, 0.45), q2 = tw(t, 1.7, 0.45), g1 = tw(t, 1.1, 0.35), g2 = tw(t, 2.4, 0.35);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#8E151D" />
      {[0, 1, 2, 3].map((k) => <circle key={k} cx={150 + k * 224} cy={1040} r="36" fill={CREAM} opacity={0.08 + 0.1 * Math.abs(osc(T, 0.9, k * 0.3))} />)}
      <SsPerson x={486} y={1150} s={0.78} T={T} shirt="#1F3B73" skin={TAN} neck={DEEP} mouth="talk" cap="#E8C547" look={osc(T, 2) * 8} />
      <rect x="110" y="1480" width="752" height="248" fill={INK} />
      <rect x="110" y="1470" width="752" height="28" rx="10" fill="#2A2A33" />
      {[[380, -18], [486, 0], [592, 18]].map(([x, a], i) => (
        <g key={i} transform={`rotate(${a} ${x} 1480)`}>
          <rect x={x - 8} y="1340" width="16" height="140" fill="#2B2B33" />
          <ellipse cx={x} cy="1330" rx="30" ry="40" fill={['#C9CCD3', '#E07A2E', '#2B6E7A'][i]} />
        </g>
      ))}
      <g transform={`translate(250 860) scale(${q1})`} opacity={q1}>
        <path d="M-170 -80 H170 V60 H-40 L-90 120 L-80 60 H-170 Z" fill={CREAM} />
        <text y="10" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={INK}>"WE WON IT!"</text>
      </g>
      <g transform={`translate(722 960) scale(${q2})`} opacity={q2}>
        <path d="M-170 -80 H170 V60 H80 L90 120 L40 60 H-170 Z" fill={CREAM} />
        <text y="10" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={INK}>"BAD CALLS!"</text>
      </g>
      <SsTag x={330} y={790} p={g1} text="SKILL" fill="#7BD88F" />
      <SsTag x={800} y={890} p={g2} text="REF" fill="#E8C547" rot={8} />
    </g>
  );
}

/* 4 — winner hugging a trophy: "we worked hard" + muscle */
function ArtSsTrophy({ T, t }) {
  const sway = osc(T, 2) * 3;
  const pop = tw(t, 0.6, 0.5);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D9B53A" />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const a = (k / 6) * TAU + T * 0.4, r = 360 + osc(T, 1.2, k * 0.2) * 20;
        return <path key={k} d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z" fill="#fff" opacity={0.5 + 0.5 * Math.abs(osc(T, 0.8, k * 0.15))} transform={`translate(${486 + Math.cos(a) * r} ${1300 + Math.sin(a) * r * 0.7})`} />;
      })}
      <g transform={`rotate(${sway} 486 1700)`}>
        <SsPerson x={430} y={1120} s={0.82} T={T} shirt="#2B6E7A" skin={SKIN} hair={DARK} mouth="smile" brow={-5} />
        <g transform="translate(470 1440)">
          <path d="M-110 -90 H110 C110 30 60 80 0 80 C-60 80 -110 30 -110 -90 Z" fill="#F2C230" stroke={INK} strokeWidth="8" />
          <path d="M-110 -60 q-70 0 -60 60 q10 40 70 40 M110 -60 q70 0 60 60 q-10 40 -70 40" fill="none" stroke="#F2C230" strokeWidth="18" />
          <rect x="-22" y="80" width="44" height="70" fill="#D9A21E" />
          <rect x="-80" y="150" width="160" height="50" rx="10" fill={INK} />
          <text y="10" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="56" fill={INK}>#1</text>
          <ellipse cx="-60" cy="-50" rx="14" ry="30" fill="#fff" opacity=".5" />
        </g>
        <SsArm pts={[[300, 1360], [330, 1470], [420, 1480]]} c="#2B6E7A" w={52} />
        <SsArm pts={[[560, 1360], [600, 1460], [520, 1490]]} c="#2B6E7A" w={52} />
      </g>
      <g transform={`translate(740 860) scale(${0.3 + 0.7 * pop}) rotate(${(1 - pop) * -20})`} opacity={pop}>
        <ellipse rx="210" ry="120" fill="#fff" />
        <path d="M-120 80 L-170 160 L-60 100 Z" fill="#fff" />
        <text x="-30" y="-14" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="42" fill={INK}>WE WORKED</text>
        <text x="-30" y="40" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="42" fill={INK}>HARD</text>
        <g transform={`translate(130 0) rotate(${osc(T, 0.7) * 10})`}>
          <path d="M-40 40 L10 40 Q50 40 50 0 Q50 -40 20 -40 L0 -10 Q-10 10 -40 10 Z" fill="#E07A2E" />
          <circle cx="16" cy="-46" r="20" fill="#E07A2E" />
        </g>
      </g>
    </g>
  );
}

/* 5 — loser under a rain cloud blaming the ref, broken shoe, black cat */
function ArtSsRain({ T, t }) {
  const point = tw(t, 1.0, 0.5);
  const catX = 1060 - ((t * 140) % 1300);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#1D4E57" />
      {Array.from({ length: 14 }, (_, i) => {
        const p = ((T * 1.6 + hsh(i)) % 1);
        return <line key={i} x1={200 + hsh(i + 9) * 340} y1={880 + p * 380} x2={192 + hsh(i + 9) * 340} y2={910 + p * 380} stroke="#9AD8FF" strokeWidth="7" strokeLinecap="round" opacity={1 - p} />;
      })}
      <g transform={`translate(${osc(T, 3) * 12} 0)`}>
        {[[290, 830, 70], [370, 800, 90], [460, 830, 70], [370, 860, 80]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#5B6B7A" />)}
      </g>
      <SsRef x={810} y={1220} s={0.55} T={T} />
      <SsPerson x={370} y={1140} s={0.78} T={T} ph={0.4} shirt="#B3202A" skin={SKIN2} neck={DEEP} hair={INK} mouth="frown" brow={14} look={10} />
      <SsArm pts={[[470, 1350], [560 + point * 30, 1310 - point * 30], [600 + point * 70, 1290 - point * 60]]} c="#B3202A" w={44} hand={SKIN2} />
      <g transform={`translate(230 1660) rotate(${-6})`}>
        <path d="M-80 -40 Q-80 -80 -30 -80 L40 -60 Q80 -40 80 0 L-80 0 Z" fill={CREAM} />
        <path d={`M-80 4 L80 4 L80 ${16 + Math.abs(osc(T, 0.5)) * 26} L-80 16 Z`} fill={INK} />
        <path d="M-20 -78 l10 30 l-14 10 l12 26" fill="none" stroke={INK} strokeWidth="6" />
      </g>
      <g transform={`translate(${catX} 1640)`}>
        <ellipse rx="70" ry="38" fill={INK} />
        <circle cx="-70" cy="-34" r="34" fill={INK} />
        <path d="M-96 -56 L-92 -86 L-74 -64 Z M-66 -64 L-52 -88 L-46 -58 Z" fill={INK} />
        <circle cx="-82" cy="-36" r="6" fill="#E8C547" />
        <circle cx="-60" cy="-36" r="6" fill="#E8C547" />
        <path d={`M66 -10 q40 ${-30 + osc(T, 0.8) * 20} 30 -70`} fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" />
        {[-40, -10, 20, 50].map((lx, k) => <rect key={k} x={lx} y={20 + (k % 2 ? osc(T, 0.3) * 6 : -osc(T, 0.3) * 6)} width="14" height="36" rx="7" fill={INK} />)}
      </g>
    </g>
  );
}

/* 6 — office worker + student: a win earns a gold ME star, a loss gets a pointing finger */
function SsBadge({ x, y, win, T }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${1 + 0.05 * osc(T, 0.6)})`}>
      <circle r="78" fill={win ? '#E8C547' : CREAM} stroke={INK} strokeWidth="8" />
      {win
        ? <g><path d="M0 -50 L14 -16 L50 -14 L22 8 L32 44 L0 24 L-32 44 L-22 8 L-50 -14 L-14 -16 Z" fill="#fff" opacity=".7" /><text y="18" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill={INK}>ME</text></g>
        : <g><rect x="-46" y="-14" width="60" height="36" rx="16" fill={SKIN} stroke={INK} strokeWidth="5" /><rect x="6" y="-8" width="56" height="16" rx="8" fill={SKIN} stroke={INK} strokeWidth="5" /><text y="-30" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="30" fill="#B3202A">THEM</text></g>}
    </g>
  );
}
function ArtSsYou({ T, t }) {
  const a = Math.floor(T / 1.4) % 2 === 0, b = Math.floor(T / 1.4 + 0.5) % 2 === 0;
  const pop = tw(t, 0.3, 0.5);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#C9641F" />
      <g transform={`translate(0 ${(1 - pop) * 120})`} opacity={pop}>
        <SsPerson x={270} y={1170} s={0.64} T={T} shirt="#F7F3EA" skin={SKIN} hair={DARK} mouth={a ? 'smile' : 'frown'} brow={a ? -4 : 12} />
        <path d="M270 1302 L254 1330 L270 1440 L286 1330 Z" fill="#1F3B73" />
        <g transform="translate(270 1520)">
          <rect x="-130" y="-80" width="260" height="160" rx="12" fill="#2A2A33" />
          <rect x="-112" y="-64" width="224" height="124" rx="6" fill={a ? '#7BD88F' : '#FF6B5E'} />
          <path d={a ? 'M-60 30 L-10 -10 L20 10 L70 -40' : 'M-60 -40 L-10 0 L20 -20 L70 30'} fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <SsBadge x={270} y={880} win={a} T={T} />
        <SsPerson x={700} y={1170} s={0.64} T={T} ph={1.3} shirt="#6A3FA0" skin={TAN} neck={DEEP} hair={INK} mouth={b ? 'smile' : 'frown'} brow={b ? -4 : 12} />
        <g transform={`translate(700 1520) rotate(${osc(T, 1.6) * 4})`}>
          <rect x="-110" y="-110" width="220" height="200" rx="10" fill="#F7F3EA" stroke={INK} strokeWidth="6" />
          <text y="40" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="120" fill={b ? '#2B6E7A' : '#B3202A'}>{b ? 'A' : 'F'}</text>
        </g>
        <SsBadge x={700} y={880} win={b} T={T} />
      </g>
    </g>
  );
}

/* 7 — outro: a lucky clover in one hand, a steering wheel with a check in the other */
function ArtSsClover({ T, t }) {
  const luck = tw(t, 0.4, 0.5), ctrl = tw(t, 2.8, 0.5), tick = tw(t, 3.4, 0.4);
  const bob = osc(T, 1.4) * 8;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#59338A" />
      <SsPerson x={486} y={1130} s={0.82} T={T} shirt="#E07A2E" skin={SKIN} hair="#7A3E1C" mouth="smile" look={osc(T, 2.5) * 10} />
      <SsArm pts={[[370, 1340], [250, 1300 - luck * 60], [220, 1260 - luck * 180 + bob]]} c="#E07A2E" w={48} />
      <g transform={`translate(220 ${1120 - luck * 40 + bob}) rotate(${osc(T, 1.1) * 10}) scale(${luck})`}>
        <path d="M0 40 q10 50 -10 100" fill="none" stroke="#2E8B3E" strokeWidth="12" strokeLinecap="round" />
        {[0, 90, 180, 270].map((r) => (
          <g key={r} transform={`rotate(${r + 45})`}>
            <circle cx="-22" cy="-46" r="34" fill="#4CB860" />
            <circle cx="22" cy="-46" r="34" fill="#4CB860" />
            <path d="M-50 -40 L0 10 L50 -40 Z" fill="#4CB860" />
          </g>
        ))}
        <circle r="12" fill="#2E8B3E" />
      </g>
      <SsArm pts={[[602, 1340], [720, 1300 - ctrl * 60], [752, 1260 - ctrl * 180 - bob]]} c="#E07A2E" w={48} />
      <g transform={`translate(752 ${1120 - ctrl * 40 - bob}) rotate(${osc(T, 1.8) * 20}) scale(${ctrl})`} opacity={ctrl}>
        <circle r="110" fill="none" stroke={INK} strokeWidth="26" />
        <circle r="30" fill={INK} />
        {[90, 210, 330].map((r) => <rect key={r} x="0" y="-10" width="96" height="20" fill={INK} transform={`rotate(${r})`} />)}
      </g>
      <g transform={`translate(840 940) scale(${tick})`} opacity={tick}>
        <circle r="62" fill="#7BD88F" stroke={INK} strokeWidth="8" />
        <path d="M-28 2 L-6 26 L32 -24" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {[0, 1, 2].map((k) => (
        <path key={k} d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill="#E8C547" opacity={luck * Math.abs(osc(T, 0.9, k * 0.3))} transform={`translate(${140 + k * 70} ${960 + (k % 2) * 60})`} />
      ))}
    </g>
  );
}

Object.assign(window, { ArtSsScore, ArtSsPaper, ArtSsMic, ArtSsTrophy, ArtSsRain, ArtSsYou, ArtSsClover });
