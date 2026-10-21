// art.jsx — scene illustrations for "Not Starting Perfect" (Ted type 2). Pure functions of T / t.
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

/* shared — head centred at (0,0): skin, hair, brows, eyes, mouth */
function PsHead({ T, ph = 0, skin = SKIN, hair = INK, brow = 0, look = 0, mouth = 'flat' }) {
  return (
    <g>
      <circle cx="-108" cy="10" r="24" fill={skin} />
      <circle cx="108" cy="10" r="24" fill={skin} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-30 - brow} x2="-18" y2={-34 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1={-34 + brow} x2="62" y2={-30 - brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <Eye cx={-40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      <Eye cx={40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-24" y1="60" x2="24" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'wavy' && <path d="M-36 62 q9 -10 18 0 t18 0 t18 0 t18 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="14" ry="18" fill={INK} />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      <ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

function Drop({ x, y, T, ph = 0, fall = 140 }) {
  const p = ((T + ph) % 2.1) / 2.1;
  return (
    <g transform={`translate(${x} ${y + MOTION.enter(p) * fall}) scale(${0.6 + p * 0.5})`} opacity={p < 0.1 ? p * 10 : 1 - Math.max(0, p - 0.7) / 0.3}>
      <path d="M0 -30 C11 -12 18 0 18 9 A18 18 0 0 1 -18 9 C-18 0 -11 -12 0 -30 Z" fill="#9AD8FF" />
      <circle cx="-5" cy="6" r="5" fill="#fff" opacity=".8" />
    </g>
  );
}

/* 1 — frozen at a desk before a blank page */
function ArtPsBlank({ T, t }) {
  const shake = osc(T, 0.11) * 2.5;
  const stamp = tw(t, 2.6, 0.3);
  return (
    <g>
      <circle cx="486" cy="1180" r="420" fill="#264684" />
      <g transform={`translate(${486 + shake} 1060)`}>
        <path d="M-190 560 C-190 260 -110 190 0 190 C110 190 190 260 190 560 Z" fill="#E07A2E" />
        <rect x="-32" y="90" width="64" height="120" rx="24" fill={SKIN2} />
        <PsHead T={T} skin={SKIN} brow={8} mouth="wavy" look={0} />
      </g>
      <Drop x={612} y={1010} T={T} />
      <Drop x={370} y={1040} T={T} ph={1.1} />
      <rect x="40" y="1430" width="892" height="40" rx="12" fill="#5A3A22" />
      <rect x="40" y="1470" width="892" height="260" fill="#6E4A2E" />
      <g transform="rotate(-3 486 1360)">
        <rect x="336" y="1250" width="300" height="190" rx="8" fill="#fff" />
        <rect x="336" y="1250" width="300" height="190" rx="8" fill="none" stroke="#C9C0AE" strokeWidth="5" />
      </g>
      <ellipse cx="300" cy="1420" rx="56" ry="40" fill={SKIN} />
      <ellipse cx="672" cy="1420" rx="56" ry="40" fill={SKIN} />
      <g transform={`rotate(${-35 + osc(T, 0.11) * 1.5} 672 1410)`}>
        <rect x="660" y="1250" width="22" height="170" rx="8" fill="#E8C547" />
        <path d="M660 1420 L671 1450 L682 1420 Z" fill={INK} />
      </g>
      <g transform={`translate(486 1345) rotate(-8) scale(${0.4 + 0.6 * stamp})`} opacity={stamp}>
        <rect x="-140" y="-48" width="280" height="96" rx="12" fill="none" stroke="#B3202A" strokeWidth="10" />
        <text x="0" y="24" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#B3202A">0 WORDS</text>
      </g>
    </g>
  );
}

/* 2 — laptop with a blinking cursor, crumpled balls piling up */
function ArtPsCursor({ T, t }) {
  const on = (T % 1) < 0.55 ? 1 : 0;
  const n = Math.min(9, Math.floor(t * 2));
  const pile = [[250, 1650], [340, 1660], [430, 1655], [300, 1590], [390, 1595], [345, 1530], [700, 1655], [780, 1650], [740, 1590]];
  const ul = tw(t, 1.2, 0.5);
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#DDD6C5" />
      <rect x="0" y="1690" width="972" height="38" fill="#CFC7B4" />
      <path d="M216 1440 L756 1440 L820 1520 L152 1520 Z" fill="#9EA3AD" />
      <rect x="236" y="1090" width="500" height="350" rx="20" fill="#2B2B33" />
      <rect x="260" y="1114" width="452" height="302" rx="8" fill="#fff" />
      <rect x="296" y="1160" width="12" height="56" fill={INK} opacity={on} />
      <text x="486" y="1350" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="52" fill="#B3202A" opacity={ul}>FLAWLESS?</text>
      <line x1="330" y1="1372" x2={330 + 312 * ul} y2="1372" stroke="#B3202A" strokeWidth="9" strokeLinecap="round" />
      {pile.slice(0, n).map(([x, y], i) => {
        const land = tw(t, i * 0.5, 0.35);
        return (
          <g key={i} transform={`translate(${x} ${y - (1 - land) * 700}) rotate(${hsh(i) * 360 + (1 - land) * 200})`}>
            <circle r="44" fill="#fff" />
            <path d="M-30 -10 L-6 6 L10 -20 L28 4 M-24 22 L4 14 L20 30" fill="none" stroke="#BDB6A6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
}

/* 3 — ten thousand people pooled, 2017 */
function ArtPsData({ T, t }) {
  const out = [];
  for (let i = 0; i < 80; i++) {
    const c = i % 10, r = Math.floor(i / 10);
    const a = tw(t, 1.0 + i * 0.03, 0.3);
    const bob = osc(T, 1.8, hsh(i)) * 3;
    out.push(
      <g key={i} transform={`translate(${216 + c * 60} ${1060 + r * 74 + bob}) scale(${a})`}>
        <circle cx="0" cy="-16" r="14" fill={i % 7 === 3 ? '#E8C547' : CREAM} />
        <path d="M-19 26 C-19 4 -10 0 0 0 C10 0 19 4 19 26 Z" fill={i % 7 === 3 ? '#E8C547' : CREAM} />
      </g>
    );
  }
  const big = tw(t, 3.2, 0.4);
  return (
    <g>
      <circle cx="486" cy="1250" r="420" fill="#9A1A23" />
      <g transform={`translate(760 820) rotate(${8 + osc(T, 2.4) * 3})`} opacity={tw(t, 0, 0.4)}>
        <rect x="-110" y="-56" width="220" height="112" rx="16" fill={CREAM} />
        <text x="0" y="24" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="64" fill="#B3202A">2017</text>
      </g>
      <rect x="170" y="1010" width="632" height="620" rx="30" fill="none" stroke={CREAM} strokeWidth="6" strokeDasharray="20 16" opacity=".5" />
      {out}
      <g transform={`translate(486 1560) scale(${0.5 + 0.5 * big})`} opacity={big}>
        <rect x="-230" y="-80" width="460" height="130" rx="24" fill={INK} />
        <text x="0" y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="96" fill="#E8C547">10,000</text>
      </g>
    </g>
  );
}

/* 4 — worry cloud raining red X marks, calendar pages slipping by */
function ArtPsWorry({ T, t }) {
  const cx = 486 + osc(T, 3) * 14;
  return (
    <g>
      <circle cx="486" cy="1240" r="420" fill="#D9B53A" />
      {[0, 1, 2, 3].map((k) => {
        const p = ((T * 0.45 + k * 0.25) % 1);
        return (
          <g key={k} transform={`translate(${800 - p * 120} ${1000 + p * 560}) rotate(${p * 160 - 20})`} opacity={Math.sin(p * Math.PI)}>
            <rect x="-62" y="-70" width="124" height="140" rx="10" fill="#fff" />
            <rect x="-62" y="-70" width="124" height="34" rx="10" fill="#B3202A" />
            <text x="0" y="46" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="60" fill={INK}>{12 + k * 3}</text>
          </g>
        );
      })}
      {[0, 1, 2, 3, 4].map((k) => {
        const p = ((T + k * 0.42) % 2.1) / 2.1;
        const x = cx - 160 + k * 80 + (hsh(k) - 0.5) * 30;
        return (
          <g key={k} transform={`translate(${x} ${930 + p * 190}) rotate(${hsh(k + 9) * 40 - 20})`} opacity={p < 0.1 ? p * 10 : 1 - p}>
            <path d="M-16 -16 L16 16 M16 -16 L-16 16" stroke="#B3202A" strokeWidth="10" strokeLinecap="round" />
          </g>
        );
      })}
      <g transform={`translate(${cx} 840)`}>
        <circle cx="-120" cy="20" r="80" fill="#5A5E6B" />
        <circle cx="0" cy="-20" r="110" fill="#5A5E6B" />
        <circle cx="120" cy="20" r="80" fill="#5A5E6B" />
        <rect x="-200" y="20" width="400" height="80" rx="40" fill="#5A5E6B" />
        {Math.abs(osc(T, 1.6)) > 0.93 && <path d="M10 90 L-20 160 L10 160 L-14 230" fill="none" stroke="#fff" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />}
      </g>
      <g transform={`translate(${430 + osc(T, 0.15) * 2} 1260)`}>
        <path d="M-190 470 C-190 210 -110 160 0 160 C110 160 190 210 190 470 Z" fill="#2B6E7A" />
        <rect x="-32" y="80" width="64" height="110" rx="24" fill="#8A5A3C" />
        <PsHead T={T} ph={0.7} skin="#A86E4B" hair="#3A1A14" brow={10} mouth="o" look={-6} />
        <ellipse cx="-130" cy="250" rx="48" ry="40" fill="#A86E4B" transform={`translate(0 ${osc(T, 0.5) * 6})`} />
      </g>
      <Drop x={540} y={1170} T={T} ph={0.4} fall={110} />
    </g>
  );
}

/* 5 — confident climber, stairs toward a high flag */
function ArtPsStairs({ T, t }) {
  const p = clamp(t / 4.5, 0, 1);
  const step = Math.min(4, p * 5);
  const sx = 210 + step * 130, sy = 1520 - step * 120 - Math.abs(osc(T, 0.5)) * 18;
  const less = tw(t, 3.2, 0.35);
  return (
    <g>
      <circle cx="560" cy="1200" r="420" fill="#347F8C" />
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x={150 + k * 130} y={1600 - k * 120} width={972 - 150 - k * 130} height={130 + k * 120} fill={k % 2 ? '#1F5560' : '#22606B'} />
      ))}
      <rect x="150" y="1600" width="822" height="14" fill={CREAM} opacity=".25" />
      <line x1="840" y1="1120" x2="840" y2="820" stroke={CREAM} strokeWidth="12" strokeLinecap="round" />
      <path d={`M846 830 L960 ${860 + osc(T, 0.8) * 10} L846 900 Z`} fill="#E8C547" />
      <g transform={`translate(${sx} ${sy})`}>
        <line x1="-20" y1="-10" x2={-30 + osc(T, 0.5) * 20} y2="80" stroke={INK} strokeWidth="34" strokeLinecap="round" />
        <line x1="20" y1="-10" x2={30 - osc(T, 0.5) * 20} y2="80" stroke={INK} strokeWidth="34" strokeLinecap="round" />
        <rect x="-56" y="-190" width="112" height="200" rx="48" fill="#E07A2E" />
        <line x1="40" y1="-160" x2="110" y2={-240 + osc(T, 0.5) * 10} stroke="#E07A2E" strokeWidth="30" strokeLinecap="round" />
        <circle cx="112" cy={-244 + osc(T, 0.5) * 10} r="20" fill="#E0A97E" />
        <g transform="translate(0 -270) scale(0.62)">
          <PsHead T={T} ph={1.3} skin="#E0A97E" hair="#6B3E1F" brow={-4} mouth="smile" look={10} />
        </g>
      </g>
      <g transform={`translate(330 1060) scale(${0.5 + 0.5 * less}) rotate(-6)`} opacity={less}>
        <rect x="-150" y="-60" width="300" height="110" rx="20" fill={CREAM} />
        <text x="0" y="22" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="60" fill="#2B6E7A">↓ DELAY</text>
      </g>
    </g>
  );
}

/* 6 — messy real draft (green check) vs empty "perfect" outline fading */
function ArtPsDraft({ T, t }) {
  const chk = tw(t, 2.2, 0.4);
  const fade = 1 - 0.8 * tw(t, 3.6, 1.2);
  const lines = [0, 1, 2, 3, 4, 5, 6];
  return (
    <g>
      <circle cx="486" cy="1220" r="420" fill="#CC6A22" />
      <g transform={`rotate(${-5 + osc(T, 2.6) * 1.5} 290 1250)`}>
        <rect x="120" y="1000" width="340" height="460" rx="12" fill="#fff" />
        {lines.map((k) => (
          <path key={k} d={`M150 ${1060 + k * 54} q40 ${-10 + hsh(k) * 20} 80 0 t80 0 t${60 + hsh(k + 3) * 50} 0`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" opacity=".75" />
        ))}
        <line x1="160" y1="1220" x2="400" y2="1214" stroke="#B3202A" strokeWidth="7" strokeLinecap="round" />
        <circle cx="400" cy="1400" r="22" fill="#C98A62" opacity=".35" />
      </g>
      <g transform={`translate(290 1260) scale(${chk})`} opacity={chk}>
        <circle r="96" fill="#2E9E5B" />
        <path d="M-44 0 L-12 34 L48 -32" fill="none" stroke="#fff" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g opacity={fade}>
        <rect x="540" y="1000" width="320" height="460" rx="12" fill="none" stroke={CREAM} strokeWidth="8" strokeDasharray="26 18" strokeDashoffset={T * 30} />
        <text x="700" y="1250" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="54" fill={CREAM}>PERFECT</text>
        <text x="700" y="1320" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="80" fill={CREAM} opacity=".6">?</text>
      </g>
      <g transform="translate(486 1600)">
        <path d="M-170 140 C-170 20 -100 -10 0 -10 C100 -10 170 20 170 140 Z" fill="#1F3B73" />
        <g transform="translate(0 -110) scale(0.7)">
          <PsHead T={T} ph={2} skin="#D9A07A" hair="#2A1A10" mouth="smile" look={-14} />
        </g>
      </g>
    </g>
  );
}

/* 7 — kitchen timer at 10:00 and a pencil scribbling fast */
function ArtPsTimer({ T, t }) {
  const left = Math.max(0, 600 - Math.floor(t));
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0');
  const draw = clamp(t / 6, 0, 1);
  let d = 'M240 1400';
  const segs = Math.floor(4 + draw * 36);
  for (let i = 0; i < segs; i++) {
    const row = Math.floor(i / 10), col = i % 10;
    d += ` L${260 + col * 46} ${1340 + row * 60 + (i % 2 ? -22 : 22)}`;
  }
  const lastI = segs - 1, lr = Math.floor(lastI / 10), lc = lastI % 10;
  const px = 260 + lc * 46, py = 1340 + lr * 60 + (lastI % 2 ? -22 : 22);
  const wob = osc(T, 0.12) * 6;
  return (
    <g>
      <circle cx="486" cy="1200" r="420" fill="#7A4DB3" />
      <g transform={`translate(486 960) rotate(${osc(T, 0.2) * 2})`}>
        <rect x="-26" y="-190" width="52" height="40" rx="10" fill={INK} />
        <circle r="170" fill="#E07A2E" />
        <circle r="130" fill={CREAM} />
        <text x="0" y="24" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="80" fill={INK}>{`${mm}:${ss}`}</text>
        <line x1="0" y1="0" x2="0" y2="-110" stroke="#B3202A" strokeWidth="6" strokeLinecap="round" transform={`rotate(${t * 36})`} opacity=".7" />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M${150 + k * 22} ${-120 - k * 10} l${20} ${-20}`} stroke={CREAM} strokeWidth="8" strokeLinecap="round" opacity={(T * 2 + k * 0.3) % 1 < 0.5 ? 1 : 0.2} />
        ))}
      </g>
      <g transform="rotate(-3 486 1460)">
        <rect x="200" y="1260" width="572" height="400" rx="12" fill="#fff" />
        <path d={d} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <text x="486" y="1630" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill="#B3202A" opacity={tw(t, 1.5, 0.4)}>WORST DRAFT ✓</text>
      </g>
      <g transform={`translate(${px + wob} ${py - 4}) rotate(30)`}>
        <rect x="-14" y="-190" width="28" height="160" rx="6" fill="#E8C547" />
        <rect x="-14" y="-210" width="28" height="28" rx="6" fill="#E58FA3" />
        <path d="M-14 -32 L0 0 L14 -32 Z" fill="#F1C3A0" />
        <path d="M-5 -12 L0 0 L5 -12 Z" fill={INK} />
      </g>
    </g>
  );
}

Object.assign(window, { ArtPsBlank, ArtPsCursor, ArtPsData, ArtPsWorry, ArtPsStairs, ArtPsDraft, ArtPsTimer });
