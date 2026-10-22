// art.jsx — scene illustrations for "The Tiny Yes" (Freedman & Fraser · 1966). Pure functions of T.
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
const pop = (t, s, d = 0.45) => Easing.easeOutBack(clamp((t - s) / d, 0, 1));
const FONT = 'Montserrat, sans-serif';

function FdEye({ cx, cy, T, ph = 0, rx = 19, ry = 18, look = 0 }) {
  const b = blink(T, ph);
  return (<g><ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" /><circle cx={cx + look} cy={cy + 2} r={10 * Math.min(1, b * 1.6)} fill={INK} /></g>);
}

/* a person: head centred at (x, y), torso below */
function FdPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} /><circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <FdEye cx={-40} cy={4} T={T} ph={ph} look={look} /><FdEye cx={40} cy={4} T={T} ph={ph} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      {mouth === 'sad' && <path d="M-30 70 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" /><ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* a rounded label pill */
function FdPill({ x, y, w = 360, fill = INK, ink = CREAM, text, size = 60 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y="-52" width={w} height="104" rx="52" fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* a big counting number that pops in */
function FdBig({ x = 486, y = 1150, t, to, suffix = '', size = 260, fill = INK, s = 0.1, d = 1.0 }) {
  const n = Math.round(to * tw(t, s, d));
  return (<text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size * (0.85 + 0.15 * pop(t, s))} fill={fill}>{n}{suffix}</text>);
}

/* a speech bubble with text */
function FdBubble({ x, y, w = 420, h = 160, text, size = 52, fill = '#fff', ink = INK, tail = -1 }) {
  return (<g transform={`translate(${x} ${y})`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="40" fill={fill} />
    <path d={`M${tail * 60} ${h / 2 - 4} l${tail * 50} 70 l${-tail * 10} -70 Z`} fill={fill} />
    <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={size} fill={ink}>{text}</text></g>);
}

/* floor shadow + ground line */
function FdGround({ y = 1600, fill = 'rgba(0,0,0,.18)' }) { return <ellipse cx="486" cy={y} rx="380" ry="40" fill={fill} />; }

/* 1 — a foot wedged in a door, a little hand holding out a tiny card */
function ArtFdTiny({ T, t }) {
  const open = 0.25 + 0.05 * osc(T, 1.2);
  return (
    <g>
      <rect x="236" y="760" width="500" height="900" fill="#7A1520" />
      <g transform={`translate(236 760) skewY(${-open * 20}) scale(${1 - open} 1)`}><rect x="0" y="0" width="500" height="900" fill="#E9E4D8" /><circle cx="440" cy="470" r="22" fill="#C9A13B" /></g>
      <g transform="translate(600 1600)"><path d="M-40 -60 L160 -60 C230 -60 250 0 230 30 L-40 30 Z" fill={INK} /><rect x="-40" y="-150" width="80" height="100" fill="#1F3B73" /></g>
      <g transform={`translate(${380 + osc(T, 0.8) * 10} ${1200}) scale(${pop(t, 0.3)})`}>
        <rect x="-60" y="-40" width="120" height="80" rx="10" fill="#fff" /><text y="14" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="34" fill={INK}>yes?</text>
      </g>
    </g>
  );
}

/* 2 — a huge, ugly "DRIVE CAREFULLY" sign in front of a little house */
function ArtFdSign({ T, t }) {
  return (
    <g>
      <rect x="0" y="1460" width="972" height="268" fill="#8FB46A" />
      <path d="M260 1000 L486 820 L712 1000 Z" fill="#B3202A" /><rect x="290" y="1000" width="392" height="300" fill="#fff" />
      <rect x="450" y="1160" width="72" height="140" fill="#6B4A2E" /><rect x="320" y="1060" width="90" height="80" fill="#9FB4D9" /><rect x="560" y="1060" width="90" height="80" fill="#9FB4D9" />
      <g transform={`translate(486 ${1360 - 40 * pop(t, 0.2)}) rotate(${osc(T, 1.4) * 2})`}>
        <rect x="-20" y="0" width="40" height="200" fill="#6B4A2E" />
        <rect x="-400" y="-260" width="800" height="300" rx="10" fill="#E8C547" stroke={INK} strokeWidth="10" />
        <text y="-150" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="96" fill={INK}>DRIVE</text>
        <text y="-40" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="96" fill={INK}>CAREFULLY</text>
      </g>
    </g>
  );
}

/* 3 — 17% of doors say yes */
function ArtFdNo({ T, t }) {
  const yes = Math.round(17 * tw(t, 0.2, 1.0) / 100 * 30);
  return (
    <g>
      {Array.from({ length: 30 }).map((_, i) => {
        const c = i % 6, r = Math.floor(i / 6), on = i < yes;
        return (<g key={i} transform={`translate(${176 + c * 124} ${860 + r * 130})`}>
          <rect x="-44" y="-56" width="88" height="112" rx="8" fill={on ? '#8FD18B' : 'rgba(255,255,255,.18)'} />
          <text y="16" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={on ? INK : 'rgba(255,255,255,.5)'}>{on ? '✓' : '✕'}</text>
        </g>);
      })}
      <FdBig x={486} y={1570} t={t} to={17} suffix="%" size={200} fill="#fff" />
    </g>
  );
}

/* 4 — a tiny sticker goes on the window */
function ArtFdSticker({ T, t }) {
  const p = tw(t, 0.2, 0.8);
  return (
    <g>
      <rect x="216" y="860" width="540" height="620" rx="20" fill="#9FB4D9" stroke="#fff" strokeWidth="24" />
      <line x1="486" y1="860" x2="486" y2="1480" stroke="#fff" strokeWidth="18" /><line x1="216" y1="1170" x2="756" y2="1170" stroke="#fff" strokeWidth="18" />
      <g transform={`translate(${620 - (1 - p) * 300} ${1320 - (1 - p) * 240}) rotate(${(1 - p) * 30}) scale(${0.6 + 0.4 * p})`}>
        <rect x="-80" y="-50" width="160" height="100" rx="12" fill="#fff" stroke={INK} strokeWidth="6" />
        <text y="-6" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="26" fill={INK}>BE A SAFE</text>
        <text y="28" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="26" fill={INK}>DRIVER</text>
      </g>
      <FdPill x={486} y={1570} w={300} text="tiny" fill={INK} />
    </g>
  );
}

/* 5 — 76%: most doors say yes */
function ArtFdYes({ T, t }) {
  const yes = Math.round(76 * tw(t, 0.2, 1.2) / 100 * 30);
  return (
    <g>
      {Array.from({ length: 30 }).map((_, i) => {
        const c = i % 6, r = Math.floor(i / 6), on = i < yes;
        return (<g key={i} transform={`translate(${176 + c * 124} ${860 + r * 130 + (on ? osc(T, 0.6, i * 0.07) * 4 : 0)})`}>
          <rect x="-44" y="-56" width="88" height="112" rx="8" fill={on ? '#E8C547' : 'rgba(255,255,255,.18)'} />
          <text y="16" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill={on ? INK : 'rgba(255,255,255,.5)'}>{on ? '✓' : '✕'}</text>
        </g>);
      })}
      <FdBig x={486} y={1570} t={t} to={76} suffix="%" size={200} fill="#fff" />
    </g>
  );
}

/* 6 — a person sees "a helpful person" in the mirror */
function ArtFdMirror({ T, t }) {
  return (
    <g>
      <FdPerson x={300} y={1100} T={T} shirt="#E07A2E" mouth="smile" s={0.85} look={14} />
      <ellipse cx="700" cy="1150" rx="190" ry="330" fill="#C9D6EA" stroke="#C9A13B" strokeWidth="22" />
      <g opacity={0.85}><FdPerson x={700} y={1080} T={T} shirt="#E07A2E" mouth="smile" s={0.6} look={-10} /></g>
      <g transform={`translate(700 ${1360}) scale(${pop(t, 0.5)})`}><rect x="-150" y="-40" width="300" height="80" rx="40" fill={INK} /><text y="16" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill="#fff">"I say yes"</text></g>
    </g>
  );
}

/* 7 — two separate scales: each ask weighed on its own */
function ArtFdJudge({ T, t }) {
  const tilt = osc(T, 2.5) * 4;
  return (
    <g>
      {[[290, 'small', 0.6], [682, 'BIG', 1]].map(([x, label, s], i) => (
        <g key={i} transform={`translate(${x} 1200)`}>
          <rect x="-12" y="-200" width="24" height="420" fill="#E9E4D8" /><rect x="-110" y="210" width="220" height="30" rx="10" fill="#E9E4D8" />
          <g transform={`rotate(${i ? -tilt : tilt})`}>
            <rect x="-170" y="-210" width="340" height="16" rx="8" fill="#E9E4D8" />
            <path d="M-170 -200 l-50 120 h100 Z M170 -200 l-50 120 h100 Z" fill="#E8C547" />
            <rect x={-60 * s} y={-260 - 60 * s} width={120 * s} height={60 * s + 50} rx="10" fill="#fff" />
          </g>
          <text y="330" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="58" fill="#fff">{label}</text>
        </g>
      ))}
    </g>
  );
}

Object.assign(window, { ArtFdJudge, ArtFdMirror, ArtFdNo, ArtFdSign, ArtFdSticker, ArtFdTiny, ArtFdYes });
