// art.jsx — scene illustrations for "Same Reading" (Barnum / Forer effect, Forer 1949). Pure functions of T.
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

/* shared — a person: head centred at (x, y), torso below; wide>0 widens the eyes */
function BqPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, neck = SKIN2, mouth = 'smile', look = 0, s = 1, tilt = 0, wide = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={neck} />
      <g transform={`rotate(${tilt} 0 100)`}>
        <circle cx="-108" cy="10" r="24" fill={neck} />
        <circle cx="108" cy="10" r="24" fill={neck} />
        <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
        <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
        <line x1="-62" y1={-30 - wide * 14} x2="-18" y2={-36 - wide * 14} stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <line x1="18" y1={-36 - wide * 14} x2="62" y2={-30 - wide * 14} stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <Eye cx={-40} cy={4} T={T} ph={ph} rx={19 + wide * 5} ry={18 + wide * 8} look={look} />
        <Eye cx={40} cy={4} T={T} ph={ph} rx={19 + wide * 5} ry={18 + wide * 8} look={look} />
        {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
        {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
        {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
        {mouth === 'hmm' && <path d="M-26 64 q26 -14 52 4" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
        <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
        <ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      </g>
    </g>
  );
}

/* shared — the one "personal profile" sheet everyone gets (same lines every time) */
function BqSheet({ x, y, w = 200, h = 260, rot = 0, fill = CREAM, title = 'PROFILE', tc = '#B3202A' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.06} fill={fill} />
      <text y={-h / 2 + w * 0.2} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={w * 0.13} fill={tc}>{title}</text>
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x={-w * 0.38} y={-h / 2 + w * 0.32 + k * h * 0.13} width={w * (0.5 + hsh(k + 7) * 0.26)} height={w * 0.05} rx={w * 0.025} fill="#BDB6A6" />
      ))}
    </g>
  );
}

function Star({ x, y, r, fill, frac = 1, id }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`;
  }).join(' ');
  return (
    <g>
      <clipPath id={id}><rect x={x - r} y={y - r} width={2 * r * frac} height={2 * r} /></clipPath>
      <polygon points={pts} fill="#16284F" />
      <polygon points={pts} fill={fill} clipPath={`url(#${id})`} />
    </g>
  );
}

/* 1 — professor hands the same sheet to a row of students; 4.3/5 rating */
function ArtBqClass({ T, t }) {
  const studs = [[440, '#E07A2E', SKIN, INK], [650, '#2B6E7A', '#8D5A3B', '#3A1A14'], [860, '#6A3FA0', '#E5B38E', '#7A4A1E']];
  const rate = tw(t, 3.2, 0.5);
  return (
    <g>
      <circle cx="486" cy="1240" r="420" fill="#2A4C8C" />
      <BqPerson x={180} y={990} s={0.72} T={T} shirt="#C9C0AE" hair="#9EA3AD" skin={SKIN2} neck="#A86E4B" tilt={osc(T, 2.2) * 4} />
      <line x1="250" y1="1180" x2={330 + osc(T, 1.1) * 10} y2="1120" stroke="#C9C0AE" strokeWidth="44" strokeLinecap="round" />
      {studs.map(([x, sh, sk, hr], i) => (
        <g key={i} transform={`translate(0 ${osc(T, 1.6, i * 0.3) * 5})`}>
          <BqPerson x={x} y={1310} s={0.5} T={T} ph={i * 0.7} shirt={sh} skin={sk} hair={hr} />
        </g>
      ))}
      <rect x="320" y="1470" width="652" height="40" rx="10" fill="#7A4A1E" />
      <rect x="320" y="1510" width="652" height="218" fill="#5C3714" />
      {studs.map(([x], i) => {
        const p = tw(t, 0.6 + i * 0.55, 0.6);
        const sx = 340 + (x - 340) * p, sy = 1110 + (1455 - 1110) * p - Math.sin(p * Math.PI) * 120;
        return <BqSheet key={i} x={sx} y={sy} w={110} h={140} rot={(1 - p) * -30 + (p >= 1 ? -6 : 0)} />;
      })}
      <g transform={`translate(640 820) scale(${0.4 + 0.6 * rate})`} opacity={rate}>
        <rect x="-300" y="-80" width="600" height="160" rx="80" fill={CREAM} />
        {[0, 1, 2, 3, 4].map((k) => <Star key={k} id={`bqst${k}`} x={-240 + k * 76} y={0} r={32} fill="#E8C547" frac={k < 4 ? 1 : 0.3} />)}
        <text x="180" y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill={INK}>4.3/5</text>
      </g>
    </g>
  );
}

/* 2 — a 1948 personality test, pencil ticking boxes */
function ArtBqTest({ T, t }) {
  const rows = [0, 1, 2, 3, 4];
  const k = clamp(Math.floor(t / 0.7), 0, 4);
  const lp = (t % 0.7) / 0.7;
  const px = 300 + osc(T, 0.18) * (lp < 0.5 ? 8 : 0), py = 1060 + k * 110;
  const tag = tw(t, 0.1, 0.45);
  return (
    <g>
      <circle cx="486" cy="1220" r="420" fill="#D8D0BE" />
      <g transform={`rotate(${-3 + osc(T, 3) * 1} 486 1220)`}>
        <rect x="196" y="830" width="580" height="780" rx="18" fill="#F7F3E8" />
        <rect x="196" y="830" width="580" height="120" rx="18" fill="#1F3B73" />
        <text x="486" y="908" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill={CREAM}>PERSONALITY TEST</text>
        {rows.map((r) => {
          const done = r < k || (r === k && lp > 0.5);
          return (
            <g key={r}>
              <rect x="250" y={1020 + r * 110} width="62" height="62" rx="8" fill="none" stroke={INK} strokeWidth="7" />
              {done && <path d={`M262 ${1052 + r * 110} l16 18 l28 -36`} fill="none" stroke="#B3202A" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />}
              <rect x="340" y={1036 + r * 110} width={220 + hsh(r) * 160} height="14" rx="7" fill="#BDB6A6" />
              <rect x="340" y={1062 + r * 110} width={120 + hsh(r + 3) * 120} height="12" rx="6" fill="#D6CFBF" />
            </g>
          );
        })}
      </g>
      <g transform={`translate(${px} ${py}) rotate(35)`}>
        <rect x="-16" y="-260" width="32" height="220" fill="#E8C547" />
        <rect x="-16" y="-290" width="32" height="34" rx="6" fill="#E8907A" />
        <rect x="-16" y="-262" width="32" height="14" fill="#9EA3AD" />
        <path d="M-16 -40 L16 -40 L0 0 Z" fill="#F1C3A0" />
        <path d="M-5 -12 L5 -12 L0 0 Z" fill={INK} />
      </g>
      <g transform={`translate(760 800) rotate(${12 - (1 - tag) * 40}) scale(${0.3 + 0.7 * tag})`} opacity={tag}>
        <circle r="100" fill="#B3202A" />
        <circle r="84" fill="none" stroke={CREAM} strokeWidth="5" strokeDasharray="10 8" />
        <text y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="60" fill={CREAM}>1948</text>
      </g>
    </g>
  );
}

/* 3 — a stack of "personal" profiles fans out: every one identical */
function ArtBqCopies({ T, t }) {
  const fan = tw(t, 0.3, 1.2);
  const flash = t > 2.2 ? 0.5 + 0.5 * Math.abs(osc(T, 0.5)) : 0;
  const cards = [-2, -1, 0, 1, 2];
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#8E151D" />
      {cards.map((c, i) => {
        const x = 486 + c * 170 * fan, y = 1210 + Math.abs(c) * 50 * fan + osc(T, 1.8, i * 0.2) * 6;
        return (
          <g key={c} transform={`translate(${x} ${y}) rotate(${c * 9 * fan})`}>
            <rect x="-118" y="-170" width="236" height="340" rx="16" fill={INK} opacity=".25" transform="translate(8 10)" />
            <rect x="-118" y="-170" width="236" height="340" rx="16" fill={CREAM} />
            <circle cx="0" cy="-92" r="40" fill="#B3202A" />
            <circle cx="0" cy="-104" r="16" fill={CREAM} />
            <path d="M-26 -62 C-26 -82 26 -82 26 -62 Z" fill={CREAM} />
            <text y="-20" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="30" fill={INK}>YOU</text>
            {[0, 1, 2, 3].map((k) => <rect key={k} x="-86" y={10 + k * 34} width={110 + hsh(k + 11) * 62} height="14" rx="7" fill="#BDB6A6" />)}
          </g>
        );
      })}
      {[-1.5, -0.5, 0.5, 1.5].map((c, i) => (
        <g key={c} transform={`translate(${486 + c * 170} ${1440 + Math.abs(c) * 30}) scale(${0.8 + 0.3 * flash})`} opacity={flash}>
          <circle r="36" fill="#E8C547" />
          <rect x="-18" y="-12" width="36" height="8" rx="4" fill={INK} />
          <rect x="-18" y="4" width="36" height="8" rx="4" fill={INK} />
        </g>
      ))}
    </g>
  );
}

/* 4 — a student reads the line, eyes widen, nods; hearts float up */
function ArtBqQuote({ T, t }) {
  const wide = tw(t, 1.8, 0.4);
  const nod = t > 2.4 ? osc(T, 0.7) * 5 : 0;
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#D4B232" />
      {[0, 1, 2, 3, 4].map((k) => {
        const p = ((T + k * 0.55) % 2.75) / 2.75;
        const x = 486 + (k - 2) * 150 + osc(T, 1.3, k * 0.2) * 24, y = 1150 - p * 420;
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${0.6 + p * 0.5})`} opacity={wide * Math.min(p * 5, 1 - p)}>
            {k % 2 ? (
              <g>
                <circle cx="-18" cy="-8" r="22" fill="#E2453C" />
                <circle cx="18" cy="-8" r="22" fill="#E2453C" />
                <path d="M-38 2 L0 42 L38 2 Z" fill="#E2453C" />
              </g>
            ) : (
              <g>
                <circle r="36" fill="#1F3B73" />
                <path d="M-14 16 L-14 -6 L-2 -6 L6 -24 Q14 -24 12 -10 L22 -10 Q28 -8 24 2 L18 16 Z" fill={CREAM} />
              </g>
            )}
          </g>
        );
      })}
      <g transform={`rotate(${nod} 486 1300)`}>
        <BqPerson x={486} y={1180} T={T} shirt="#2B6E7A" skin="#8D5A3B" neck="#6E432B" hair="#3A1A14" look={-6} wide={wide} mouth={wide > 0.5 ? 'o' : 'flat'} s={0.95} />
      </g>
      <g transform={`rotate(-4 486 1520)`}>
        <rect x="236" y="1420" width="500" height="320" rx="16" fill="#F7F3E8" />
        <text x="486" y="1488" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill={INK}>YOU HAVE A GREAT</text>
        <text x="486" y="1556" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="60" fill="#B3202A">NEED</text>
        <text x="486" y="1606" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="30" fill={INK}>TO BE LIKED</text>
        <ellipse cx="486" cy="1536" rx={90 * tw(t, 1.6, 0.5)} ry={42 * tw(t, 1.6, 0.5)} fill="none" stroke="#B3202A" strokeWidth="6" />
        <ellipse cx="290" cy="1660" rx="44" ry="36" fill="#8D5A3B" />
        <ellipse cx="682" cy="1660" rx="44" ry="36" fill="#8D5A3B" />
      </g>
    </g>
  );
}

/* 5 — one profile card slides over different people; each nods "that's me" */
function ArtBqFits({ T, t }) {
  const ppl = [[150, '#E07A2E', '#F1C3A0', INK], [380, '#E8C547', '#6E432B', '#141821'], [600, '#B3202A', '#E5B38E', '#C77A2E'], [830, '#6A3FA0', '#A86E4B', '#3A1A14']];
  const cx = 150 + ((t * 230) % 900);
  return (
    <g>
      <circle cx="486" cy="1260" r="430" fill="#1D4E57" />
      {ppl.map(([x, sh, sk, hr], i) => {
        const near = Math.max(0, 1 - Math.abs(cx - x) / 120);
        const hit = tw(t, (x - 150) / 230 + 0.2, 0.3);
        return (
          <g key={i}>
            <g transform={`rotate(${near * osc(T, 0.45) * 8} ${x} 1420)`}>
              <BqPerson x={x} y={1330} s={0.56} T={T} ph={i * 0.6} shirt={sh} skin={sk} hair={hr} mouth={near > 0.2 ? 'smile' : 'flat'} look={(cx - x) * 0.04} />
            </g>
            <g transform={`translate(${x} 1610) scale(${hit})`} opacity={hit}>
              <circle r="38" fill="#E8C547" />
              <path d="M-16 0 l10 12 l22 -24" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        );
      })}
      <BqSheet x={cx} y={1000 + osc(T, 0.9) * 10} w={190} h={230} rot={osc(T, 1.2) * 6} title="YOU" />
      <path d={`M${cx} 1128 L${cx - 30} 1158 L${cx + 30} 1158 Z`} fill={CREAM} />
    </g>
  );
}

/* 6 — horoscope wheel + phone quiz result, sparkles */
function ArtBqStars({ T, t }) {
  const res = tw(t, 1.6, 0.5);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#C8641E" />
      <g transform={`translate(300 1120) rotate(${T * 14})`}>
        <circle r="210" fill="#1F3B73" />
        <circle r="150" fill="none" stroke="#E8C547" strokeWidth="6" />
        <circle r="70" fill="#E8C547" />
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 30})`}>
            <line x1="0" y1="-150" x2="0" y2="-210" stroke="#E8C547" strokeWidth="5" />
            <circle cx="0" cy="-180" r={i % 3 ? 9 : 14} fill={CREAM} transform="rotate(15)" />
          </g>
        ))}
      </g>
      <g transform={`translate(670 1300) rotate(${8 + osc(T, 2.4) * 3})`}>
        <rect x="-140" y="-260" width="280" height="520" rx="36" fill={INK} />
        <rect x="-120" y="-226" width="240" height="452" rx="20" fill={CREAM} />
        <text y="-160" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="30" fill="#6A3FA0">WHICH ARE YOU?</text>
        <g transform={`scale(${0.5 + 0.5 * res})`} opacity={res}>
          <circle cy="-50" r="62" fill="#E07A2E" />
          <text y="-30" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="56" fill={CREAM}>98%</text>
          <text y="60" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="32" fill={INK}>SO TRUE!</text>
        </g>
        {[0, 1, 2].map((k) => <rect key={k} x="-90" y={110 + k * 34} width={180 - k * 40} height="14" rx="7" fill="#BDB6A6" />)}
      </g>
      {[[160, 860], [520, 840], [860, 1000], [480, 1500], [880, 1620], [130, 1450]].map(([x, y], i) => {
        const s = 0.4 + 0.6 * Math.abs(osc(T, 0.9, i * 0.23));
        return (
          <path key={i} transform={`translate(${x} ${y}) scale(${s}) rotate(${T * 40})`} d="M0 -40 Q6 -6 40 0 Q6 6 0 40 Q-6 6 -40 0 Q-6 -6 0 -40 Z" fill="#FFE08A" />
        );
      })}
    </g>
  );
}

/* 7 — the same quiz card held up to two friends; would it fit them too? */
function ArtBqFriend({ T, t }) {
  const sw = osc(T, 2.2);
  const think = tw(t, 1.8, 0.5);
  return (
    <g>
      <circle cx="486" cy="1260" r="430" fill="#5A3290" />
      <BqPerson x={290} y={1230} s={0.68} T={T} shirt="#E8C547" skin={SKIN} hair="#7A4A1E" look={sw > 0 ? 10 : 4} mouth="hmm" />
      <BqPerson x={690} y={1230} s={0.68} T={T} ph={0.9} shirt="#2B6E7A" skin="#8D5A3B" neck="#6E432B" hair={INK} look={sw < 0 ? -10 : -4} mouth="smile" tilt={osc(T, 1.4) * 3} />
      <line x1={486 + sw * 200} y1="1060" x2={486 + sw * 200} y2="980" stroke={CREAM} strokeWidth="6" />
      <BqSheet x={486 + sw * 200} y={890} w={170} h={210} rot={sw * 8} title="YOU" tc="#6A3FA0" />
      <g transform={`translate(486 1100) scale(${think})`} opacity={think}>
        <circle cx="-30" cy="90" r="12" fill={CREAM} />
        <circle cx="-10" cy="56" r="20" fill={CREAM} />
        <circle r="62" fill={CREAM} />
        <text y="26" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="76" fill="#6A3FA0">=?</text>
      </g>
    </g>
  );
}

Object.assign(window, { ArtBqClass, ArtBqTest, ArtBqCopies, ArtBqQuote, ArtBqFits, ArtBqStars, ArtBqFriend });
