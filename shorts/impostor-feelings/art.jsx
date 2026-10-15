// art.jsx — scene illustrations for "Feel Like A Fraud?" (impostor phenomenon, Clance & Imes 1978). Pure functions of T.
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

/* shared bust: head centre at (x, y), scale s */
function ImpBust({ x, y, s = 1, T, ph = 0, shirt = '#B3202A', hair = '#3A1A14', skin = SKIN, hairStyle = 'long', mouth = 'smile', look = 0, rot = 0, worried = false }) {
  const M = {
    smile: <path d="M-30 50 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
    flat: <path d="M-26 58 h52" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />,
    wavy: <path d="M-36 60 q9 -9 18 0 t18 0 t18 0 t18 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />,
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot} 0 200)`}>
      {hairStyle === 'long' && <path d="M-134 -10 C-146 -150 -50 -156 0 -156 C60 -156 146 -140 134 -10 L146 190 L-146 190 Z" fill={hair} />}
      <path d="M-210 700 L-210 330 C-210 210 -130 160 0 160 C130 160 210 210 210 330 L210 700 Z" fill={shirt} />
      <rect x="-36" y="70" width="72" height="110" rx="26" fill={SKIN2} />
      <circle cx="-106" cy="12" r="22" fill={SKIN2} />
      <circle cx="106" cy="12" r="22" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="104" ry="118" fill={skin} />
      <path d="M-108 -6 C-114 -112 -40 -130 0 -130 C66 -130 118 -98 106 -12 C80 -62 40 -72 0 -68 C-40 -72 -84 -52 -108 -6 Z" fill={hair} />
      {worried && <path d="M-62 -36 l40 -12 M62 -36 l-40 -12" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      <Eye cx={-40} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <Eye cx={40} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <ellipse cx="-62" cy="40" rx="18" ry="9" fill="#E8907A" opacity=".5" />
      <ellipse cx="62" cy="40" rx="18" ry="9" fill="#E8907A" opacity=".5" />
      {M[mouth]}
    </g>
  );
}

function ImpSparkle({ x, y, s }) {
  return <path d="M0 -30 L8 -8 L30 0 L8 8 L0 30 L-8 8 L-30 0 L-8 -8 Z" fill="#E8C547" transform={`translate(${x} ${y}) scale(${s})`} />;
}

/* 1 — holding a trophy, worried, sweat drop, a question mark overhead */
function ArtImpTrophy({ T }) {
  const p = (T % 2) / 2;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <ImpBust x={486} y={1130} s={1} T={T} shirt="#6A3FA0" hair="#2A1A10" mouth="wavy" look={osc(T, 1.8) * 8} worried />
      <path d="M0 -30 C11 -12 18 0 18 9 A18 18 0 0 1 -18 9 C-18 0 -11 -12 0 -30 Z" fill="#9AD8FF" transform={`translate(600 ${1080 + p * 90})`} opacity={1 - p} />
      <g transform={`translate(486 ${1440 + osc(T, 1.2) * 8}) rotate(${osc(T, 1.6) * 4})`}>
        <path d="M-110 -150 h220 v40 c0 90 -50 140 -110 140 c-60 0 -110 -50 -110 -140 Z" fill="#E8C547" />
        <path d="M-110 -120 c-70 0 -70 90 10 90 M110 -120 c70 0 70 90 -10 90" fill="none" stroke="#E8C547" strokeWidth="18" />
        <rect x="-24" y="20" width="48" height="60" fill="#D1A92E" />
        <rect x="-80" y="78" width="160" height="40" rx="10" fill="#8A6A44" />
        <ellipse cx="-60" cy="40" rx="50" ry="40" fill={SKIN} />
        <ellipse cx="60" cy="40" rx="50" ry="40" fill={SKIN} />
        <rect x="-60" y="-120" width="22" height="70" rx="11" fill="#fff" opacity=".35" />
      </g>
      {[0, 1, 2, 3].map((k) => (
        <ImpSparkle key={k} x={300 + k * 120 + (k % 2) * 30} y={1300 + (k % 2 ? -60 : 40)} s={0.5 + 0.5 * Math.abs(osc(T, 0.9, k * 0.25))} />
      ))}
      <g transform={`translate(486 ${870 + osc(T, 1.1) * 12}) rotate(${osc(T, 2) * 8})`}>
        <circle r="60" fill={CREAM} />
        <text y="30" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="88" fill="#B3202A">?</text>
      </g>
    </g>
  );
}

/* 2 — a 1978 study clipboard filling with many successful women */
function ArtImpStudy({ T, t }) {
  const cols = 6, rows = 5;
  const hair = ['#3A1A14', INK, '#8A5A2B', '#5A2E1A'];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#DDD6C5" />
      <g transform={`rotate(${osc(T, 3) * 1.5} 486 1240)`}>
        <rect x="186" y="800" width="600" height="840" rx="28" fill="#8A6A44" />
        <rect x="216" y="850" width="540" height="770" rx="12" fill="#F7F4EC" />
        <rect x="396" y="776" width="180" height="70" rx="18" fill="#9EA3AD" />
        <text x="486" y="940" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="52" fill={INK}>STUDY · 1978</text>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          const x = 276 + c * 84, y = 1030 + r * 116;
          const a = MOTION.pop(clamp((t - 0.2 - i * 0.06) / 0.35, 0, 1));
          return (
            <g key={i} transform={`translate(${x} ${y + osc(T, 1.2, hsh(i)) * 3}) scale(${a})`}>
              <path d="M-30 50 C-30 20 -18 12 0 12 C18 12 30 20 30 50 Z" fill={['#B3202A', '#2B6E7A', '#6A3FA0', '#E07A2E', '#1F3B73'][i % 5]} />
              <circle cx="0" cy="-12" r="24" fill={hair[i % 4]} />
              <circle cx="0" cy="-8" r="19" fill={i % 3 ? SKIN : SKIN2} />
              <path d="M-19 -12 C-18 -30 18 -30 19 -12 C8 -20 -8 -20 -19 -12 Z" fill={hair[i % 4]} />
            </g>
          );
        })}
      </g>
      <ImpSparkle x={820} y={860} s={0.6 + 0.4 * Math.abs(osc(T, 1))} />
      <ImpSparkle x={150} y={1060} s={0.6 + 0.4 * Math.abs(osc(T, 1, 0.4))} />
    </g>
  );
}

/* 3 — graduate with diploma, privately thinking she fooled everyone */
function ArtImpGrad({ T, t }) {
  const th = tw(t, 1.2, 0.6);
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#9E1B24" />
      <g transform={`rotate(${osc(T, 2.4) * 2} 486 1500)`}>
        <ImpBust x={486} y={1170} s={1} T={T} shirt={INK} hair="#3A1A14" mouth="flat" look={-10} worried={th > 0.5} />
        <path d="M416 1330 L486 1420 L556 1330" fill="none" stroke="#E8C547" strokeWidth="18" strokeLinejoin="round" />
        <g transform="translate(486 1030)">
          <path d="M-170 0 L0 -70 L170 0 L0 70 Z" fill={INK} />
          <rect x="-90" y="10" width="180" height="56" rx="10" fill={INK} />
          <line x1="150" y1="6" x2={170 + osc(T, 1.2) * 8} y2="110" stroke="#E8C547" strokeWidth="8" />
          <circle cx={170 + osc(T, 1.2) * 8} cy="118" r="12" fill="#E8C547" />
        </g>
      </g>
      <g transform={`translate(700 ${1480 + osc(T, 1.4) * 6}) rotate(-24)`}>
        <rect x="-150" y="-36" width="300" height="72" rx="36" fill={CREAM} />
        <rect x="-30" y="-38" width="30" height="76" fill="#B3202A" />
        <ellipse cx="-110" cy="0" rx="30" ry="36" fill="#D9D1BF" />
      </g>
      <ellipse cx="660" cy="1500" rx="50" ry="40" fill={SKIN} />
      <g opacity={th}>
        {[0, 1].map((k) => <circle key={k} cx={300 - k * 40} cy={900 - k * 46} r={14 + k * 8} fill={CREAM} />)}
        <g transform={`translate(190 ${760 + osc(T, 2) * 8})`}>
          <ellipse rx="130" ry="90" fill={CREAM} />
          <path d="M-80 -6 c20 -40 140 -40 160 0 c-10 40 -40 48 -60 26 c-14 -14 -26 -14 -40 0 c-20 22 -50 14 -60 -26 Z" fill={INK} />
          <circle cx="-40" cy="-4" r="12" fill={CREAM} />
          <circle cx="40" cy="-4" r="12" fill={CREAM} />
        </g>
      </g>
    </g>
  );
}

/* 4 — mirror: the reflection wears a silly disguise */
function ArtImpMirror({ T }) {
  const sway = osc(T, 2.2) * 3;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#DDB93A" />
      <rect x="520" y="780" width="360" height="760" rx="180" fill="#8A6A44" />
      <rect x="546" y="806" width="308" height="708" rx="154" fill="#BFE3EE" />
      <path d="M600 900 l60 -60 M600 980 l120 -120" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity=".5" />
      <g transform={`rotate(${-sway} 700 1500)`}>
        <ImpBust x={700} y={1180} s={0.72} T={T} ph={0.3} shirt="#2B6E7A" hair="#3A1A14" mouth="flat" look={-8} />
        <circle cx="671" cy="1183" r="26" fill="none" stroke={INK} strokeWidth="8" />
        <circle cx="729" cy="1183" r="26" fill="none" stroke={INK} strokeWidth="8" />
        <path d="M697 1183 h6" stroke={INK} strokeWidth="8" />
        <ellipse cx="700" cy="1212" rx="18" ry="22" fill="#E8907A" />
        <path d="M660 1232 q20 -14 40 0 q20 -14 40 0 q-20 18 -40 6 q-20 12 -40 -6 Z" fill={INK} />
      </g>
      <rect x="520" y="1500" width="360" height="40" rx="12" fill="#6E5236" />
      <g transform={`rotate(${sway} 300 1600)`}>
        <ImpBust x={300} y={1250} s={0.9} T={T} shirt="#2B6E7A" hair="#3A1A14" mouth="wavy" look={12} worried />
      </g>
    </g>
  );
}

/* 5 — a stack of 62 studies and a range slider from 9% to 82% */
function ArtImpRange({ T, t }) {
  const grow = tw(t, 0.3, 1.2);
  const m = 0.5 + 0.5 * osc(T, 2.6);
  const x0 = 200, x1 = 772;
  const a = x0 + (x1 - x0) * 0.09, b = x0 + (x1 - x0) * 0.82;
  const b2 = a + (b - a) * grow;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#24606B" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={340 + osc(T, 3, i * 0.11) * 6 + (hsh(i) - 0.5) * 20} y={1500 - i * 26} width="292" height="22" rx="4"
          fill={i % 2 ? CREAM : '#F7F4EC'} stroke="#1B4C55" strokeWidth="3" />
      ))}
      <text x="486" y="1620" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="46" fill={CREAM}>62 STUDIES</text>
      <rect x={x0} y="1030" width={x1 - x0} height="30" rx="15" fill="#1B4C55" />
      <rect x={a} y="1030" width={b2 - a} height="30" rx="15" fill="#E8C547" />
      {[[a, '9%'], [b2, '82%']].map(([x, l], i) => (
        <g key={i}>
          <circle cx={x} cy="1045" r="30" fill={CREAM} stroke={INK} strokeWidth="6" />
          <text x={x} y={i ? 1140 : 980} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="58" fill={CREAM} opacity={i ? grow : 1}>{l}</text>
        </g>
      ))}
      <g transform={`translate(${a + (b2 - a) * m} ${1210 + osc(T, 0.5) * 4})`} opacity={grow}>
        <circle cy="-40" r="26" fill={SKIN} />
        <path d="M-36 40 C-36 0 -20 -10 0 -10 C20 -10 36 0 36 40 Z" fill="#E07A2E" />
        <path d="M0 -76 l-14 -16 h28 Z" fill={CREAM} />
      </g>
    </g>
  );
}

/* 6 — a feeling cloud floats free; the diagnosis chart gets crossed out */
function ArtImpCloud({ T, t }) {
  const x = tw(t, 1.6, 0.6);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#C9692A" />
      <g transform={`translate(${300 + osc(T, 3) * 20} ${1060 + osc(T, 1.8) * 16})`}>
        <circle cx="-70" cy="10" r="70" fill={CREAM} />
        <circle cx="0" cy="-30" r="90" fill={CREAM} />
        <circle cx="80" cy="10" r="70" fill={CREAM} />
        <rect x="-140" y="10" width="290" height="70" rx="35" fill={CREAM} />
        <Eye cx={-30} cy={0} T={T} rx={14} ry={14} />
        <Eye cx={30} cy={0} T={T} rx={14} ry={14} />
        <path d="M-24 44 q24 -14 48 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <text x="0" y="150" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>FEELING</text>
      </g>
      <g transform={`translate(680 1400) rotate(${6 + osc(T, 2.4) * 2})`}>
        <rect x="-140" y="-190" width="280" height="380" rx="20" fill="#8A6A44" />
        <rect x="-118" y="-160" width="236" height="330" rx="10" fill="#F7F4EC" />
        <rect x="-50" y="-206" width="100" height="40" rx="12" fill="#9EA3AD" />
        <path d="M-20 -110 h40 M0 -130 v40" stroke="#B3202A" strokeWidth="12" strokeLinecap="round" />
        {[0, 1, 2, 3].map((k) => <rect key={k} x="-90" y={-50 + k * 46} width={k % 2 ? 130 : 180} height="14" rx="7" fill="#CFC7B4" />)}
        <g opacity={x}>
          <path d={`M-110 -150 L${-110 + 220 * x} ${-150 + 300 * x}`} stroke="#B3202A" strokeWidth="22" strokeLinecap="round" />
          <path d={`M110 -150 L${110 - 220 * x} ${-150 + 300 * x}`} stroke="#B3202A" strokeWidth="22" strokeLinecap="round" />
        </g>
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.8) % 2.4) / 2.4;
        return <circle key={k} cx={180 + k * 80 + osc(T, 1, k * 0.3) * 10} cy={1300 + 260 * (1 - p)} r={10 + k * 4} fill={CREAM} opacity={Math.sin(p * Math.PI) * 0.6} />;
      })}
    </g>
  );
}

/* 7 — notebook: feeling on one side, evidence ticking in on the other */
function ArtImpNotebook({ T, t }) {
  const items = [['RESULTS', 0.5], ['FEEDBACK', 1.1], ['PRAISE', 1.7]];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#5C3590" />
      <g transform={`rotate(${-3 + osc(T, 3) * 1} 486 1260)`}>
        <rect x="110" y="860" width="752" height="700" rx="24" fill="#3E2266" />
        <rect x="130" y="876" width="356" height="668" rx="14" fill="#F7F4EC" />
        <rect x="486" y="876" width="356" height="668" rx="14" fill="#FFFDF7" />
        <line x1="486" y1="880" x2="486" y2="1540" stroke="#CFC7B4" strokeWidth="6" />
        <text x="308" y="960" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill="#B3202A">FEELING</text>
        <text x="664" y="960" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill="#2B6E7A">EVIDENCE</text>
        <g transform={`translate(308 1180) scale(${1 + 0.04 * osc(T, 1.4)})`}>
          <circle r="80" fill="#E9E4D8" stroke={INK} strokeWidth="6" />
          <circle cx="-26" cy="-10" r="9" fill={INK} />
          <circle cx="26" cy="-10" r="9" fill={INK} />
          <path d="M-30 36 q30 -24 60 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          <text y="160" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="34" fill={INK}>"I'M A FRAUD"</text>
        </g>
        {items.map(([l, s], i) => {
          const a = tw(t, s, 0.4);
          return (
            <g key={l} opacity={a} transform={`translate(${520 + (1 - a) * 30} ${1060 + i * 150})`}>
              <path d="M0 0 l18 20 l34 -42" fill="none" stroke="#2B6E7A" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <text x="70" y="14" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="38" fill={INK}>{l}</text>
            </g>
          );
        })}
      </g>
      <g transform={`translate(${780 + osc(T, 0.5) * 14} ${1450 + osc(T, 0.25) * 6}) rotate(30)`}>
        <rect x="-14" y="0" width="28" height="220" rx="6" fill="#E8C547" stroke={INK} strokeWidth="5" />
        <path d="M-14 0 L0 -40 L14 0 Z" fill={SKIN} stroke={INK} strokeWidth="5" />
      </g>
    </g>
  );
}

/* 8 — hand holding a phone with the evidence list, a brain giving a thumbs up */
function ArtImpPhone({ T, t }) {
  const glow = 0.5 + 0.5 * Math.abs(osc(T, 1.4));
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <circle cx="486" cy="1160" r={300 + 10 * glow} fill="#E8C547" opacity={0.08 + 0.06 * glow} />
      <g transform={`translate(486 ${1180 + osc(T, 2) * 10}) rotate(${osc(T, 2.6) * 3})`}>
        <rect x="-170" y="-340" width="340" height="640" rx="48" fill={INK} />
        <rect x="-148" y="-300" width="296" height="560" rx="26" fill="#F7F4EC" />
        <rect x="-40" y="-326" width="80" height="12" rx="6" fill="#2A2A33" />
        <text x="0" y="-230" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="36" fill="#1F3B73">EVIDENCE</text>
        {[0, 1, 2, 3].map((k) => {
          const a = tw(t, 0.3 + k * 0.4, 0.35);
          return (
            <g key={k} opacity={a} transform={`translate(${-110 + (1 - a) * 20} ${-150 + k * 90})`}>
              <circle r="22" fill="#2B6E7A" />
              <path d="M-10 0 l7 8 l13 -16" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="40" y="-10" width={k % 2 ? 130 : 170} height="20" rx="10" fill="#CFC7B4" />
            </g>
          );
        })}
        <ellipse cx="-150" cy="200" rx="60" ry="90" fill={SKIN} />
        <ellipse cx="150" cy="180" rx="44" ry="80" fill={SKIN} />
        <rect x="-160" y="260" width="320" height="300" rx="60" fill={SKIN} />
      </g>
      <g transform={`translate(800 ${900 + osc(T, 1.2) * 12}) scale(${0.95 + 0.05 * osc(T, 0.6)})`}>
        <circle cx="-30" cy="0" r="54" fill="#F4A7B9" />
        <circle cx="30" cy="-10" r="58" fill="#F4A7B9" />
        <circle cx="10" cy="40" r="48" fill="#F4A7B9" />
        <path d="M-40 -20 q20 -20 40 0 M10 30 q20 -20 40 0" fill="none" stroke="#D9778F" strokeWidth="8" strokeLinecap="round" />
        <Eye cx={-14} cy={6} T={T} rx={10} ry={10} />
        <Eye cx={26} cy={6} T={T} rx={10} ry={10} />
      </g>
    </g>
  );
}

Object.assign(window, { ArtImpTrophy, ArtImpStudy, ArtImpGrad, ArtImpMirror, ArtImpRange, ArtImpCloud, ArtImpNotebook, ArtImpPhone });
