// art.jsx — scene illustrations for "Mind Goes Blank" (Radvansky 2011 · Brenner 1973 · Sparrow 2011). Pure functions of T.
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
const pop = (t, s, d = 0.45) => Easing.easeOutBack(clamp((t - s) / d, 0, 1));
const FONT = 'Montserrat, sans-serif';

function MfEye({ cx, cy, T, ph = 0, rx = 19, ry = 18, look = 0 }) {
  const b = blink(T, ph);
  return (<g><ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" /><circle cx={cx + look} cy={cy + 2} r={10 * Math.min(1, b * 1.6)} fill={INK} /></g>);
}

/* a person: head centred at (x, y), torso below */
function MfPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} /><circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <MfEye cx={-40} cy={4} T={T} ph={ph} look={look} /><MfEye cx={40} cy={4} T={T} ph={ph} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      {mouth === 'sad' && <path d="M-30 70 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" /><ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a rounded label pill */
function MfPill({ x, y, w = 360, fill = INK, ink = CREAM, text, size = 60 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y="-52" width={w} height="104" rx="52" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* a big counting number that pops in */
function MfBig({ x = 486, y = 1150, t, to, suffix = '', size = 260, fill = INK, s = 0.1, d = 1.0 }) {
  const n = Math.round(to * tw(t, s, d));
  return (<text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size * (0.85 + 0.15 * pop(t, s))} fill={fill}>{n}{suffix}</text>);
}

/* a speech bubble with text */
function MfBubble({ x, y, w = 420, h = 160, text, size = 52, fill = '#fff', ink = INK, tail = -1 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 4} l${tail * 50} 70 l${-tail * 10} -70 Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* floor shadow + ground line */
function MfGround({ y = 1600, fill = 'rgba(0,0,0,.18)' }) { return <ellipse cx="486" cy={y} rx="380" ry="40" fill={fill} />; }

/* 1 — a head with a blank, flickering thought bubble and a big 3 */
function ArtMfThree({ T, t }) {
  const flick = osc(T, 0.13) > 0.6 ? 0.4 : 1;
  return (
    <g>
      <MfPerson x={486} y={1180} T={T} shirt="#E07A2E" mouth="o" brow={8} />
      <g transform="translate(700 830)" opacity={flick}><circle r="130" fill="#fff" /><circle cx="-130" cy="150" r="30" fill="#fff" /><circle cx="-170" cy="210" r="16" fill="#fff" />
        <text y="30" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="90" fill="#C9C2B2">. . .</text></g>
      <g transform={`translate(230 860) scale(${pop(t, 0.2)})`}><circle r="100" fill="#E8C547" /><text y="48" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="140" fill={INK}>3</text></g>
    </g>
  );
}

/* 2 — walking through a doorway, the carried item fades */
function ArtMfDoor({ T, t }) {
  const p = ((T * 0.3) % 1);
  const x = 140 + p * 700;
  const fade = x > 486 ? 0.25 : 1;
  return (
    <g>
      <rect x="0" y="1560" width="972" height="168" fill="#C9C2B2" />
      <rect x="436" y="820" width="100" height="740" fill="#6B4A2E" /><rect x="456" y="900" width="60" height="660" fill="#F7F3EA" />
      <g transform={`translate(${x} ${1380 + Math.abs(osc(T, 0.4)) * -12})`}>
        <circle cx="0" cy="-120" r="44" fill={SKIN} /><path d="M-56 120 C-56 -40 -30 -64 0 -64 C30 -64 56 -40 56 120 Z" fill="#1F3B73" />
        <g opacity={fade} transform="translate(60 -40)"><rect x="-26" y="-26" width="52" height="52" rx="8" fill="#E8C547" /><text y="14" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="36" fill={INK}>?</text></g>
      </g>
    </g>
  );
}

/* 3 — two rooms as two separate file cards */
function ArtMfEvent({ T, t }) {
  return (
    <g>
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${300 + i * 380} ${1150 + osc(T, 2, i * 0.5) * 10}) rotate(${i ? 6 : -6}) scale(${pop(t, 0.2 + i * 0.3)})`}>
          <rect x="-160" y="-200" width="320" height="400" rx="20" fill="#fff" />
          <rect x="-160" y="-200" width="320" height="80" rx="20" fill={i ? '#E8C547' : '#E07A2E'} />
          <text y="-145" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={INK}>ROOM {i + 1}</text>
          <path d="M-80 60 h160 v80 h-160 Z M-60 60 v-80 h120 v80" fill="none" stroke="#C9C2B2" strokeWidth="12" />
        </g>
      ))}
    </g>
  );
}

/* 4 — two people talking; one is busy rehearsing */
function ArtMfTurn({ T, t }) {
  return (
    <g>
      <MfPerson x={270} y={1140} T={T} shirt="#2B6E7A" mouth={osc(T, 0.25) > 0 ? 'o' : 'flat'} s={0.75} look={12} />
      <MfPerson x={710} y={1140} T={T} ph={0.5} shirt="#6A3FA0" mouth="flat" s={0.75} look={-4} brow={4} />
      <g transform="translate(270 820)"><MfBubble x={0} y={0} w={300} h={120} text="blah blah" size={48} tail={1} /></g>
      <g transform="translate(720 820)"><circle r="110" fill="#fff" opacity=".9" /><text y="18" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" fill={INK}>my line…</text></g>
    </g>
  );
}

/* 5 — a fact flies into a laptop "saved" while the head stays empty */
function ArtMfPhone({ T, t }) {
  const p = ((T * 0.5) % 1);
  return (
    <g>
      <rect x="236" y="1040" width="500" height="320" rx="20" fill="#1F2430" /><rect x="260" y="1064" width="452" height="272" rx="8" fill="#9FB4D9" />
      <path d="M180 1360 L792 1360 L840 1420 L132 1420 Z" fill="#C9C2B2" />
      <g transform={`translate(${486} ${820 + p * 340})`} opacity={1 - p}><rect x="-70" y="-30" width="140" height="60" rx="12" fill="#E8C547" /><text y="14" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill={INK}>fact</text></g>
      <g transform={`translate(486 1200) scale(${pop(t, 0.4)})`}><rect x="-130" y="-46" width="260" height="92" rx="46" fill="#2B6E7A" /><text y="16" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="48" fill="#fff">SAVED ✓</text></g>
    </g>
  );
}

/* 6 — a brain on an energy-saving dial */
function ArtMfSpace({ T, t }) {
  const a = -60 + 100 * tw(t, 0.2, 1.0) + osc(T, 1.5) * 4;
  return (
    <g>
      <path d="M266 1200 A220 220 0 0 1 706 1200" fill="none" stroke="#fff" strokeWidth="40" strokeLinecap="round" opacity=".35" />
      <path d="M266 1200 A220 220 0 0 1 486 980" fill="none" stroke="#8FD18B" strokeWidth="40" strokeLinecap="round" />
      <rect x="476" y="1010" width="20" height="200" rx="10" fill="#fff" transform={`rotate(${a} 486 1200)`} />
      <circle cx="486" cy="1200" r="30" fill="#fff" />
      <g transform="translate(486 1460)"><ellipse rx="170" ry="120" fill="#F2A7B5" /><path d="M0 -120 V120 M-100 -60 q40 30 0 60 M100 -60 q-40 30 0 60" stroke="#C46A7E" strokeWidth="12" fill="none" /></g>
      <text x="486" y="900" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="60" fill="#fff">ENERGY SAVER</text>
    </g>
  );
}

/* 7 — saying it out loud: sound waves before standing up */
function ArtMfSay({ T, t }) {
  return (
    <g>
      <MfPerson x={400} y={1120} T={T} shirt="#E8C547" mouth={osc(T, 0.2) > 0 ? 'o' : 'smile'} s={0.85} look={10} />
      {[0, 1, 2].map((k) => { const p = ((T * 0.8 + k / 3) % 1); return <path key={k} d={`M${560 + p * 200} ${1000 - p * 120} q${60} ${120 + p * 120} 0 ${240 + p * 240}`} fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity={1 - p} />; })}
    </g>
  );
}

Object.assign(window, { ArtMfDoor, ArtMfEvent, ArtMfPhone, ArtMfSay, ArtMfSpace, ArtMfThree, ArtMfTurn });
