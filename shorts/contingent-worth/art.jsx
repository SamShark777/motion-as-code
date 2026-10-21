// art.jsx — scene illustrations for "One Grade, Worth" (contingent self-worth, Crocker, Sommers & Luhtanen 2002). Pure functions of T.
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
const SKINS = ['#F1C3A0', '#C98A62', '#8D5A3B', '#E5B48F'];

/* shared — a student: head centred at (x, y), torso below */
function CwKid({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, neck = SKIN2, mouth = 'smile', look = 0, s = 1, brow = 0, tilt = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 640 C-175 280 -105 205 0 205 C105 205 175 280 175 640 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={neck} />
      <g transform={`rotate(${tilt} 0 90)`}>
        <circle cx="-108" cy="10" r="24" fill={neck} />
        <circle cx="108" cy="10" r="24" fill={neck} />
        <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
        <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
        <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <Eye cx={-40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
        <Eye cx={40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
        {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
        {mouth === 'grin' && <path d="M-36 48 A36 30 0 0 0 36 48 Z" fill={INK} />}
        {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
        {mouth === 'frown' && <path d="M-30 68 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
        {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
        <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
        <ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      </g>
    </g>
  );
}

/* 1 — a student holds up a giant "C" whose shadow swallows their whole body */
function ArtCwGrade({ T, t }) {
  const bob = osc(T, 1.8) * 10;
  const sh = tw(t, 0.6, 1.4);
  const shake = t > 3 ? osc(T, 0.12) * 3 : 0;
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#2A4C8C" />
      <CwKid x={486 + shake} y={1270} T={T} s={0.85} shirt="#E8C547" hair="#3A1A14" skin={SKINS[0]} mouth={sh > 0.5 ? 'frown' : 'flat'} brow={sh * 12} look={0} />
      <path d={`M${200 + shake} 1728 L${330} 1080 L${640} 1080 L${772 + shake} 1728 Z`} fill={INK} opacity={0.42 * sh} />
      <line x1="370" y1="1500" x2="356" y2={1050 + bob} stroke="#E8C547" strokeWidth="50" strokeLinecap="round" />
      <line x1="602" y1="1500" x2="616" y2={1050 + bob} stroke="#E8C547" strokeWidth="50" strokeLinecap="round" />
      <g transform={`translate(486 ${880 + bob}) rotate(${osc(T, 2.6) * 3})`}>
        <rect x="-170" y="-200" width="340" height="400" rx="22" fill={CREAM} />
        <rect x="-170" y="-200" width="340" height="60" rx="22" fill="#C9C0AE" />
        <text x="0" y="-158" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill={INK}>GRADE</text>
        <text x="0" y="150" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="300" fill="#B3202A">C</text>
      </g>
      <circle cx="356" cy={1050 + bob} r="34" fill={SKINS[0]} />
      <circle cx="616" cy={1050 + bob} r="34" fill={SKINS[0]} />
    </g>
  );
}

/* 2 — a student waits by a mailbox as acceptance/rejection letters fly in one by one */
function ArtCwLetters({ T, t }) {
  const flag = tw(t, 1.3, 0.35);
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#D8D0BE" />
      <rect x="664" y="1180" width="36" height="548" fill="#7A5A3A" />
      <g transform="translate(682 1110)">
        <path d="M-130 80 L-130 -20 A130 110 0 0 1 130 -20 L130 80 Z" fill="#1F3B73" />
        <rect x="-140" y="70" width="280" height="24" rx="8" fill="#16305E" />
        <rect x="-80" y="-30" width="160" height="22" rx="11" fill={INK} />
        <g transform={`rotate(${-90 + 90 * flag} 130 40)`}>
          <rect x="128" y="-60" width="14" height="100" fill={INK} />
          <rect x="128" y="-60" width="70" height="44" rx="6" fill="#B3202A" />
        </g>
      </g>
      <CwKid x={300} y={1200} T={T} s={0.78} shirt="#2B6E7A" hair="#2A1A10" skin={SKINS[1]} neck="#A86E4B" mouth="o" look={10} brow={6} />
      {[0, 1, 2, 3].map((k) => {
        const p = tw(t, 0.5 + k * 0.9, 0.8);
        if (p <= 0 || p >= 1) return null;
        const x0 = -80 + hsh(k) * 200, y0 = 760 + hsh(k + 5) * 120;
        const x = x0 + (682 - x0) * p, y = y0 + (1090 - y0) * p - Math.sin(p * Math.PI) * 220;
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${(1 - p) * (k % 2 ? 40 : -30)}) scale(${1 - p * 0.45})`}>
            <rect x="-80" y="-52" width="160" height="104" rx="8" fill="#fff" />
            <path d="M-80 -52 L0 8 L80 -52" fill="none" stroke="#C9C0AE" strokeWidth="7" strokeLinejoin="round" />
            <rect x="42" y="-42" width="26" height="30" rx="3" fill={k % 2 ? '#2B6E7A' : '#B3202A'} />
          </g>
        );
      })}
      <g opacity={tw(t, 2.6, 0.5)} transform="translate(682 960)">
        <rect x="-150" y="-46" width="300" height="80" rx="40" fill={INK} />
        <text y="12" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={CREAM}>GRAD SCHOOL</text>
      </g>
    </g>
  );
}

/* 3 — the self-esteem gauge plunges as a REJECTED letter opens; the student slumps */
function ArtCwCrash({ T, t }) {
  const crash = tw(t, 2.6, 0.7);
  const ang = 60 - 140 * crash + osc(T, 0.15) * (crash > 0 && crash < 1 ? 6 : 1.5);
  const stamp = tw(t, 1.2, 0.3);
  return (
    <g>
      <circle cx="486" cy="1240" r="420" fill="#8E151D" />
      <g transform="translate(486 1000)">
        <path d="M-210 0 A210 210 0 0 1 210 0 Z" fill={CREAM} />
        <path d="M-210 0 A210 210 0 0 1 -105 -182 L0 0 Z" fill="#E2453C" />
        <path d="M105 -182 A210 210 0 0 1 210 0 L0 0 Z" fill="#7BC47F" />
        <path d="M-160 0 A160 160 0 0 1 160 0 Z" fill={CREAM} />
        <text y="-60" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="30" fill={INK}>SELF-ESTEEM</text>
        <line x1="0" y1="0" x2="0" y2="-170" stroke={INK} strokeWidth="12" strokeLinecap="round" transform={`rotate(${ang})`} />
        <circle r="18" fill={INK} />
      </g>
      <g transform={`translate(0 ${crash * 50})`}>
        <CwKid x={486} y={1290} T={T} s={0.75} shirt="#1F3B73" hair="#5B3A1E" skin={SKINS[3]} neck={SKIN2} mouth={crash > 0.3 ? 'frown' : 'flat'} brow={-8 * crash} tilt={crash * 14} look={0} />
        <g transform={`translate(486 1560) rotate(${-4 + crash * 6})`}>
          <rect x="-170" y="-100" width="340" height="200" rx="12" fill="#fff" />
          {[0, 1, 2].map((k) => <rect key={k} x="-130" y={-70 + k * 26} width={k === 2 ? 140 : 260} height="10" rx="5" fill="#C9C0AE" />)}
          <g transform={`rotate(-10) scale(${1.4 - 0.4 * stamp})`} opacity={stamp}>
            <rect x="-150" y="-6" width="300" height="76" rx="8" fill="none" stroke="#B3202A" strokeWidth="8" />
            <text y="54" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="50" fill="#B3202A">REJECTED</text>
          </g>
        </g>
        <circle cx="330" cy="1580" r="36" fill={SKINS[3]} />
        <circle cx="642" cy="1580" r="36" fill={SKINS[3]} />
      </g>
    </g>
  );
}

/* 4 — a rollercoaster: up on acceptance days, down on rejection days */
const coastY = (x) => 1290 - 200 * Math.sin((x / 972) * TAU);
function ArtCwCoaster({ T, t }) {
  const pts = [];
  for (let x = -40; x <= 1012; x += 24) pts.push(`${x} ${coastY(x)}`);
  const cx = ((t * 260 + 60) % 1100) - 60;
  const cy = coastY(cx);
  const ang = Math.atan2(coastY(cx + 2) - coastY(cx - 2), 4) * 180 / Math.PI;
  const up = tw(t, 0.4, 0.4), down = tw(t, 1.6, 0.4);
  const scream = cy > 1300;
  return (
    <g>
      <circle cx="486" cy="1260" r="420" fill="#D9B331" />
      {[80, 240, 400, 560, 720, 880].map((x) => <rect key={x} x={x - 7} y={coastY(x)} width="14" height={1728 - coastY(x)} fill="#9C7E1C" />)}
      <path d={'M' + pts.join(' L')} fill="none" stroke={INK} strokeWidth="18" strokeLinejoin="round" />
      <path d={'M' + pts.join(' L')} fill="none" stroke="#B3202A" strokeWidth="6" strokeDasharray="14 18" transform="translate(0 16)" />
      <g transform={`translate(243 ${960 - up * 30}) scale(${0.5 + 0.5 * MOTION.pop(clamp((t - 0.4) / 0.4, 0, 1))})`} opacity={up}>
        <rect x="-170" y="-50" width="340" height="88" rx="44" fill="#2B6E7A" />
        <text y="14" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" fill={CREAM}>ACCEPTED ▲</text>
      </g>
      <g transform="translate(729 1620)" opacity={down}>
        <rect x="-170" y="-50" width="340" height="88" rx="44" fill="#B3202A" />
        <text y="14" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" fill={CREAM}>REJECTED ▼</text>
      </g>
      <g transform={`translate(${cx} ${cy}) rotate(${ang})`}>
        <line x1="-14" y1="-110" x2={-40 + osc(T, 0.3) * 8} y2="-170" stroke={SKINS[2]} strokeWidth="16" strokeLinecap="round" />
        <line x1="14" y1="-110" x2={40 - osc(T, 0.3) * 8} y2="-170" stroke={SKINS[2]} strokeWidth="16" strokeLinecap="round" />
        <circle cx="0" cy="-104" r="40" fill={SKINS[2]} />
        <path d="M-40 -110 C-42 -146 -16 -150 0 -150 C26 -150 42 -136 40 -112 C24 -126 -20 -128 -40 -110 Z" fill={INK} />
        <circle cx="-14" cy="-102" r="6" fill={INK} />
        <circle cx="14" cy="-102" r="6" fill={INK} />
        {scream ? <ellipse cx="0" cy="-80" rx="9" ry="11" fill={INK} /> : <path d="M-14 -86 q14 14 28 0" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />}
        <path d="M-70 -70 L70 -70 L58 -14 L-58 -14 Z" fill="#B3202A" />
        <circle cx="-38" cy="-12" r="14" fill={INK} />
        <circle cx="38" cy="-12" r="14" fill={INK} />
      </g>
    </g>
  );
}

/* 5 — a fanned deck: the grade is one card among friend, kind, funny, curious… */
const CONF = ['#1F3B73', '#B3202A', '#E8C547', '#2B6E7A', '#E07A2E', '#6A3FA0'];
const DECK = ['FRIEND', 'KIND', 'FUNNY', 'CURIOUS', 'C', 'BRAVE', 'LOYAL', 'CREATIVE', 'HONEST'];
function ArtCwDeck({ T, t }) {
  const fan = tw(t, 0.2, 1.1);
  const lift = tw(t, 0.9, 0.4) * (1 - tw(t, 2.4, 0.5));
  const glow = tw(t, 2.4, 0.6);
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#1D5560" />
      {DECK.map((lab, i) => {
        const a = (i - 4) * 13 * fan + osc(T, 3, i * 0.1) * 1.2;
        const g = lab === 'C';
        return (
          <g key={lab} transform={`translate(486 1640) rotate(${a}) translate(0 ${g ? -lift * 70 : 0})`}>
            <rect x="-100" y="-560" width="200" height="300" rx="18" fill={g ? CREAM : '#fff'} stroke={INK} strokeWidth="6" />
            {g
              ? <text y="-345" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="170" fill="#B3202A">C</text>
              : <text y="-500" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="30" fill={INK} textLength={Math.min(170, lab.length * 22)} lengthAdjust="spacingAndGlyphs">{lab}</text>}
            {!g && <circle cy="-380" r={42 + glow * 6 * Math.abs(osc(T, 0.8, i * 0.13))} fill={CONF[i % CONF.length]} opacity={0.35 + 0.65 * glow} />}
          </g>
        );
      })}
      <ellipse cx="486" cy="1640" rx="120" ry="80" fill={SKINS[1]} />
      <ellipse cx="430" cy="1600" rx="40" ry="26" fill={SKINS[1]} transform="rotate(-20 430 1600)" />
      <rect x="380" y="1660" width="212" height="80" fill="#E8C547" />
    </g>
  );
}
/* 6 — a puppet whose mood hangs from one string tied to a grade sheet */
function ArtCwStrings({ T }) {
  const w = osc(T, 3.2);             // +1 = good grade, -1 = bad grade
  const good = w > 0;
  const sway = osc(T, 1.7) * 6;
  const py = 1180 - w * 70;
  return (
    <g>
      <circle cx="486" cy="1260" r="420" fill="#C4621C" />
      <g transform={`rotate(${sway * 0.4} 486 640)`}>
        <rect x="376" y="660" width="220" height="190" rx="12" fill="#fff" transform={`rotate(${sway} 486 755)`} />
        <text x="486" y="810" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="140" fill={good ? '#2B6E7A' : '#B3202A'} transform={`rotate(${sway} 486 755)`}>{good ? 'A' : 'F'}</text>
      </g>
      <line x1="486" y1="850" x2={486 + sway * 3} y2={py - 118} stroke={INK} strokeWidth="5" />
      <g transform={`translate(${sway * 3} 0) rotate(${sway} 486 ${py})`}>
        <line x1="420" y1={py + 190} x2={360} y2={py + 300 - w * 90} stroke="#D9B98C" strokeWidth="30" strokeLinecap="round" />
        <line x1="552" y1={py + 190} x2={612} y2={py + 300 - w * 90} stroke="#D9B98C" strokeWidth="30" strokeLinecap="round" />
        <line x1="450" y1={py + 380} x2={430 - w * 20} y2={py + 520} stroke="#D9B98C" strokeWidth="34" strokeLinecap="round" />
        <line x1="522" y1={py + 380} x2={542 + w * 20} y2={py + 520} stroke="#D9B98C" strokeWidth="34" strokeLinecap="round" />
        <rect x="406" y={py + 140} width="160" height="250" rx="60" fill="#6A3FA0" />
        <circle cx="486" cy={py} r="112" fill="#E8CFA6" />
        <circle cx="486" cy={py - 112} r="12" fill={INK} />
        <Eye cx={448} cy={py - 6} T={T} ph={0.4} rx={18} ry={18} />
        <Eye cx={524} cy={py - 6} T={T} ph={0.4} rx={18} ry={18} />
        <path d={`M446 ${py + 54} q40 ${w * 34} 80 0`} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="420" cy={py + 40} rx="18" ry="10" fill="#E8907A" opacity=".55" />
        <ellipse cx="552" cy={py + 40} rx="18" ry="10" fill="#E8907A" opacity=".55" />
      </g>
    </g>
  );
}

/* 7 — a smiling student writes three things no grade measures, ticking each one */
const LIST = ['I\'M A GOOD FRIEND', 'I KEEP GOING', 'I MAKE PEOPLE LAUGH'];
function ArtCwList({ T, t }) {
  const step = clamp(Math.floor((t - 0.3) / 0.9), 0, 2);
  const px = 560 + tw(t, 0.3 + step * 0.9, 0.7) * 300, pyy = 1060 + step * 130;
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#563087" />
      <g transform="rotate(4 690 1180)">
        <rect x="480" y="900" width="430" height="560" rx="20" fill={CREAM} />
        <rect x="480" y="900" width="430" height="70" rx="20" fill="#E8C547" />
        {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={516 + k * 72} cy="900" r="12" fill={INK} />)}
        {LIST.map((lab, i) => {
          const wr = tw(t, 0.3 + i * 0.9, 0.7), ck = tw(t, 0.9 + i * 0.9, 0.3);
          const y = 1070 + i * 130;
          return (
            <g key={i}>
              <rect x="510" y={y - 34} width="44" height="44" rx="8" fill="none" stroke={INK} strokeWidth="6" />
              <path d={`M516 ${y - 14} l14 16 l30 -40`} fill="none" stroke="#2B6E7A" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="80" strokeDashoffset={80 * (1 - ck)} />
              <text x="574" y={y} fontFamily={FONT} fontWeight="900" fontSize="30" fill={INK} textLength={Math.min(310, lab.length * 19) * Math.max(wr, 0.01)} lengthAdjust="spacingAndGlyphs" opacity={wr > 0 ? 1 : 0}>{lab}</text>
              <line x1="510" y1={y + 30} x2="880" y2={y + 30} stroke="#C9C0AE" strokeWidth="3" />
            </g>
          );
        })}
      </g>
      <CwKid x={250} y={1190} T={T} s={0.78} shirt="#E07A2E" hair="#1C1C2A" skin={SKINS[2]} neck="#6E432A" mouth="grin" look={12} />
      <line x1="330" y1="1500" x2={px - 30} y2={pyy + 60} stroke="#E07A2E" strokeWidth="46" strokeLinecap="round" />
      <g transform={`translate(${px} ${pyy + osc(T, 0.25) * 6}) rotate(30)`}>
        <rect x="-12" y="-110" width="24" height="110" fill="#E8C547" />
        <path d="M-12 0 L12 0 L0 26 Z" fill={INK} />
      </g>
      <circle cx={px - 24} cy={pyy + 56} r="32" fill={SKINS[2]} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${150 + k * 60} ${880 - Math.abs(osc(T, 1.4, k * 0.3)) * 30} l8 -24 l8 24 l24 8 l-24 8 l-8 24 l-8 -24 l-24 -8 Z`} fill="#E8C547" opacity={0.5 + 0.5 * Math.abs(osc(T, 1.1, k * 0.2))} />
      ))}
    </g>
  );
}

Object.assign(window, { ArtCwGrade, ArtCwLetters, ArtCwCrash, ArtCwCoaster, ArtCwDeck, ArtCwStrings, ArtCwList });
