// art.jsx — scene illustrations for "The Fake Patients" (Rosenhan · Science 1973). Pure functions of T.
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
const pop = (t, s, d = 0.45) => Easing.easeOutBack(clamp((t - s) / d, 0, 1));
const FONT = 'Montserrat, sans-serif';

function RhEye({ cx, cy, T, ph = 0, rx = 19, ry = 18, look = 0 }) {
  const b = blink(T, ph);
  return (<g><ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" /><circle cx={cx + look} cy={cy + 2} r={10 * Math.min(1, b * 1.6)} fill={INK} /></g>);
}

/* a person: head centred at (x, y), torso below */
function RhPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} /><circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <RhEye cx={-40} cy={4} T={T} ph={ph} look={look} /><RhEye cx={40} cy={4} T={T} ph={ph} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      {mouth === 'sad' && <path d="M-30 70 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" /><ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a rounded label pill */
function RhPill({ x, y, w = 360, fill = INK, ink = CREAM, text, size = 60 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y="-52" width={w} height="104" rx="52" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* a big counting number that pops in */
function RhBig({ x = 486, y = 1150, t, to, suffix = '', size = 260, fill = INK, s = 0.1, d = 1.0 }) {
  const n = Math.round(to * tw(t, s, d));
  return (<text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size * (0.85 + 0.15 * pop(t, s))} fill={fill}>{n}{suffix}</text>);
}

/* a speech bubble with text */
function RhBubble({ x, y, w = 420, h = 160, text, size = 52, fill = '#fff', ink = INK, tail = -1 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 4} l${tail * 50} 70 l${-tail * 10} -70 Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* floor shadow + ground line */
function RhGround({ y = 1600, fill = 'rgba(0,0,0,.18)' }) { return <ellipse cx="486" cy={y} rx="380" ry="40" fill={fill} />; }

/* 1 — eight people walk into a hospital */
function ArtRhDoors({ T, t }) {
  return (
    <g>
      <rect x="196" y="820" width="580" height="660" rx="16" fill={CREAM} />
      <rect x="196" y="820" width="580" height="90" rx="16" fill="#D9D3C4" />
      <rect x="456" y="836" width="60" height="60" rx="8" fill="#B3202A" /><rect x="476" y="830" width="20" height="72" fill={CREAM} /><rect x="452" y="856" width="68" height="20" fill={CREAM} />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={r * 4 + c} x={240 + c * 130} y={950 + r * 120} width="90" height="80" rx="8" fill="#9FB4D9" />))}
      <rect x="406" y="1300" width="160" height="180" rx="10" fill={INK} />
      {Array.from({ length: 8 }).map((_, i) => {
        const p = ((T * 0.22 + i / 8) % 1);
        const x = 60 + p * 430, y = 1560 - p * 70;
        return (<g key={i} transform={`translate(${x} ${y + Math.abs(osc(T, 0.5, i * 0.13)) * -10}) scale(${1 - p * 0.45})`} opacity={p > 0.93 ? (1 - p) / 0.07 : 1}>
          <circle cx="0" cy="-60" r="26" fill={SKIN} /><path d="M-30 30 C-30 -20 -18 -30 0 -30 C18 -30 30 -20 30 30 Z" fill={i % 2 ? '#E8C547' : '#E07A2E'} />
        </g>);
      })}
      <RhPill x={486} y={1660} w={420} text="ADMITTED" fill="#B3202A" />
    </g>
  );
}

/* 2 — a person whispers "thud" to a psychiatrist */
function ArtRhThud({ T, t }) {
  return (
    <g>
      <RhPerson x={280} y={1080} T={T} shirt="#2B6E7A" mouth="o" s={0.8} look={10} />
      <RhPerson x={720} y={1080} T={T} ph={0.4} shirt="#FFFFFF" hair="#6B4A2E" mouth="flat" s={0.8} look={-10} brow={-6} />
      <rect x="660" y="1330" width="120" height="160" rx="8" fill="#E8C547" transform={`rotate(-8 720 1400)`} />
      <g transform={`translate(${486 + osc(T, 0.15) * 6} 860) scale(${0.8 + 0.2 * pop(t, 0.2)})`}>
        <RhBubble x={0} y={0} w={380} h={170} text="THUD." size={84} tail={-1} />
      </g>
    </g>
  );
}

/* 3 — acting normal: reading calmly */
function ArtRhNormal({ T, t }) {
  return (
    <g>
      <RhPerson x={486} y={1040} T={T} shirt="#E8C547" mouth="smile" look={osc(T, 3) * 8} />
      <g transform={`translate(486 ${1390 + osc(T, 2) * 6})`}>
        <path d="M-230 -90 L0 -60 L230 -90 L230 90 L0 120 L-230 90 Z" fill="#fff" />
        <line x1="0" y1="-60" x2="0" y2="120" stroke={INK} strokeWidth="6" />
        {[0, 1, 2, 3].map((k) => <g key={k}><line x1="-190" y1={-40 + k * 34} x2="-40" y2={-30 + k * 34} stroke="#B0A99A" strokeWidth="10" strokeLinecap="round" /><line x1="40" y1={-30 + k * 34} x2="190" y2={-40 + k * 34} stroke="#B0A99A" strokeWidth="10" strokeLinecap="round" /></g>)}
      </g>
      <RhPill x={486} y={1620} w={360} text="NORMAL" fill={INK} />
    </g>
  );
}

/* 4 — 19 days on a calendar */
function ArtRhDays({ T, t }) {
  const shown = Math.round(19 * tw(t, 0.2, 1.4));
  return (
    <g>
      <rect x="186" y="900" width="600" height="640" rx="30" fill="#fff" />
      <rect x="186" y="900" width="600" height="120" rx="30" fill="#B3202A" />
      <rect x="186" y="980" width="600" height="40" fill="#B3202A" />
      {[290, 682].map((x) => <rect key={x} x={x - 14} y="868" width="28" height="80" rx="14" fill={INK} />)}
      {Array.from({ length: 28 }).map((_, i) => {
        const c = i % 7, r = Math.floor(i / 7);
        return (<g key={i}><rect x={216 + c * 80} y={1050 + r * 110} width="62" height="80" rx="10" fill="#F1ECE0" />
          {i < shown && <path d={`M${226 + c * 80} ${1062 + r * 110} l42 56 M${268 + c * 80} ${1062 + r * 110} l-42 56`} stroke="#B3202A" strokeWidth="9" strokeLinecap="round" />}</g>);
      })}
      <RhBig x={486} y={1720} t={t} to={19} suffix=" days" size={150} />
    </g>
  );
}

/* 5 — 118 patients, 35 of them notice */
function ArtRhPatients({ T, t }) {
  const lit = Math.round(35 * tw(t, 0.4, 1.4));
  return (
    <g>
      {Array.from({ length: 118 }).map((_, i) => {
        const c = i % 11, r = Math.floor(i / 11);
        const sus = ((i * 37) % 118) < lit;
        return (<g key={i} transform={`translate(${136 + c * 70} ${820 + r * 74 + osc(T, 1.6, hsh(i)) * 3})`}>
          <circle cx="0" cy="-12" r="14" fill={sus ? '#E8C547' : 'rgba(255,255,255,.45)'} />
          <path d="M-18 26 C-18 6 -10 2 0 2 C10 2 18 6 18 26 Z" fill={sus ? '#E8C547' : 'rgba(255,255,255,.45)'} />
        </g>);
      })}
      <RhBig x={486} y={1720} t={t} to={35} suffix=" / 118" size={120} fill="#fff" s={0.4} d={1.4} />
    </g>
  );
}

/* 6 — the records don't match */
function ArtRhFiles({ T, t }) {
  return (
    <g>
      {[[-1, -8], [1, 6]].map(([k, r], i) => (
        <g key={i} transform={`translate(${486 + k * 150} ${1180 + osc(T, 2.2, i * 0.5) * 8}) rotate(${r})`}>
          <rect x="-180" y="-250" width="360" height="480" rx="14" fill={i ? '#fff' : CREAM} />
          {[0, 1, 2, 3, 4, 5].map((l) => <rect key={l} x="-140" y={-190 + l * 60} width={l % 2 ? 200 : 270} height="18" rx="9" fill="#C9C2B2" />)}
          <text x="0" y="190" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="54" fill={i ? '#B3202A' : INK}>{i ? '8?' : '8'}</text>
        </g>
      ))}
      <g transform={`translate(486 1520) rotate(-12) scale(${pop(t, 0.6)})`}>
        <rect x="-230" y="-70" width="460" height="140" rx="16" fill="none" stroke="#fff" strokeWidth="12" />
        <text y="26" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="80" fill="#fff">DOESN'T MATCH</text>
      </g>
    </g>
  );
}

/* 7 — a label sticks to a perfectly ordinary person */
function ArtRhLabel({ T, t }) {
  const drop = tw(t, 0.2, 0.7);
  return (
    <g>
      <RhPerson x={486} y={1060} T={T} shirt="#E07A2E" mouth="flat" look={osc(T, 2.5) * 10} />
      <g transform={`translate(${486} ${700 + drop * 640}) rotate(${-10 + drop * 4})`}>
        <path d="M-210 -70 L170 -70 L230 0 L170 70 L-210 70 Z" fill="#E8C547" />
        <circle cx="160" cy="0" r="16" fill={INK} />
        <text x="-30" y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="58" fill={INK}>LABEL</text>
      </g>
    </g>
  );
}

Object.assign(window, { ArtRhDays, ArtRhDoors, ArtRhFiles, ArtRhLabel, ArtRhNormal, ArtRhPatients, ArtRhThud });
