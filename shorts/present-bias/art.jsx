// art.jsx — scene illustrations for "Present Bias" (Ted type 2). Pure functions of T.
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

/* shared: a bust (head + shoulders) drawn around the head centre */
function PbHead({ x, y, s = 1, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, look = 0, mouth = 'smile', long = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {long && <path d="M-122 -10 C-132 -140 132 -140 122 -10 L130 170 L-130 170 Z" fill={hair} />}
      <path d="M-170 800 L-170 380 C-170 220 -100 160 0 160 C100 160 170 220 170 380 L170 800 Z" fill={shirt} />
      <rect x="-32" y="80" width="64" height="100" rx="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="100" ry="112" fill={skin} />
      <path d="M-100 -6 C-110 -112 -40 -130 0 -130 C66 -130 114 -98 102 -12 C76 -58 36 -68 0 -64 C-40 -68 -80 -50 -100 -6 Z" fill={hair} />
      <Eye cx={-38} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <Eye cx={38} cy={4} T={T} ph={ph} rx={18} ry={17} look={look} />
      <ellipse cx="-62" cy="46" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="62" cy="46" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      {mouth === 'smile' && <path d="M-28 52 q28 24 56 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="16" ry="20" fill="#3A0C10" />}
      {mouth === 'grin' && <path d="M-34 46 A34 30 0 0 0 34 46 Z" fill="#3A0C10" />}
      {mouth === 'flat' && <path d="M-24 58 h48" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
    </g>
  );
}

function PbApple({ x, y, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <circle cx="-22" cy="6" r="40" fill="#D9342B" />
      <circle cx="22" cy="6" r="40" fill="#D9342B" />
      <ellipse cx="-26" cy="-8" rx="10" ry="16" fill="#fff" opacity=".35" />
      <path d="M0 -30 q4 -22 12 -30" stroke="#5A3A1E" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M8 -44 q30 -20 44 0 q-26 16 -44 0 Z" fill="#3E8E5A" />
    </g>
  );
}

function PbChoc({ x, y, s = 1, rot = 0, bite = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x="-70" y="-110" width="140" height="220" rx="12" fill="#5A2E1A" />
      {[0, 1, 2].map((r) => [0, 1].map((c) => (
        <rect key={`${r}${c}`} x={-58 + c * 62} y={-98 + r * 50} width="54" height="42" rx="6" fill="#6E3A22" />
      )))}
      {bite && <circle cx="70" cy="-110" r="36" fill="#E8C547" />}
      <rect x="-76" y="20" width="152" height="96" rx="8" fill="#B3202A" />
      <rect x="-76" y="20" width="152" height="18" fill="#8E151D" />
      <text x="0" y="86" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="34" fill={CREAM}>CHOC</text>
    </g>
  );
}

/* 1 — you making a promise to a faded "future you" stranger */
function ArtPromise({ T, t }) {
  const bob = osc(T, 2.2) * 12;
  const fade = 0.45 + 0.12 * osc(T, 1.8);
  const shake = osc(T, 0.5) * 10;
  const bub = tw(t, 0.3, 0.5);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <g transform={`translate(560 ${720}) scale(${bub})`} opacity={bub}>
        <rect x="-150" y="-70" width="300" height="120" rx="40" fill={CREAM} />
        <path d="M-90 44 L-130 110 L-40 48 Z" fill={CREAM} />
        <text x="0" y="12" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="46" fill={INK}>MONDAY!</text>
      </g>
      <PbHead x={290} y={1170} T={T} shirt="#E07A2E" mouth="grin" look={8} />
      <g opacity={fade} transform={`translate(0 ${bob})`}>
        <path d="M520 1728 C520 1520 590 1460 690 1460 C790 1460 860 1520 860 1728 Z" fill="#8FA6D6" />
        <ellipse cx="690" cy="1300" rx="100" ry="112" fill="#8FA6D6" />
        <text x="690" y="1340" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="130" fill="#1F3B73">?</text>
      </g>
      <g transform={`translate(0 ${shake})`}>
        <line x1="400" y1="1470" x2="520" y2="1440" stroke="#E07A2E" strokeWidth="56" strokeLinecap="round" />
        <line x1="640" y1={1480 + bob} x2="560" y2="1446" stroke="#8FA6D6" strokeWidth="56" strokeLinecap="round" opacity={fade} />
        <ellipse cx="540" cy="1440" rx="44" ry="34" fill={SKIN} />
        <path d="M560 1420 q20 -30 4 -60" stroke={SKIN} strokeWidth="18" fill="none" strokeLinecap="round" />
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.8) % 2.4) / 2.4;
        return <circle key={k} cx={690 + osc(T, 1.3, k) * 60} cy={1250 - p * 300} r={8 + k * 3} fill="#BFD0F2" opacity={Math.sin(p * Math.PI) * 0.7} />;
      })}
    </g>
  );
}

/* 2 — office worker filling in a snack order for next week */
function ArtOffice({ T, t }) {
  const tick = tw(t, 1.6, 0.4);
  const pen = osc(T, 0.35) * 6;
  return (
    <g>
      <circle cx="486" cy="1180" r="420" fill="#DDD6C5" />
      <g transform="translate(700 800)">
        <rect x="-120" y="-100" width="240" height="220" rx="16" fill={CREAM} stroke={INK} strokeWidth="8" />
        <rect x="-120" y="-100" width="240" height="60" rx="16" fill="#B3202A" />
        <text x="0" y="-56" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="34" fill={CREAM}>NEXT WEEK</text>
        <text x="0" y="74" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="96" fill={INK}>+7</text>
      </g>
      <PbHead x={330} y={1060} T={T} shirt="#1F3B73" look={14} mouth="flat" ph={0.4} />
      <rect x="80" y="1400" width="812" height="40" rx="10" fill="#8E6B48" />
      <rect x="120" y="1440" width="30" height="288" fill="#6E5236" />
      <rect x="822" y="1440" width="30" height="288" fill="#6E5236" />
      <g transform="translate(150 1230)">
        <rect x="0" y="0" width="230" height="160" rx="10" fill="#2B2B33" />
        <rect x="14" y="14" width="202" height="132" rx="6" fill="#4A6FB5" />
        <rect x="-30" y="160" width="290" height="20" rx="6" fill="#3A3A44" />
      </g>
      <g transform="translate(600 1250) rotate(-4)">
        <rect x="-150" y="-130" width="300" height="270" rx="14" fill="#fff" />
        <rect x="-110" y="-90" width="44" height="44" rx="6" fill="none" stroke={INK} strokeWidth="6" />
        <PbApple x={30} y={-66} s={0.55} />
        <rect x="-110" y="20" width="44" height="44" rx="6" fill="none" stroke={INK} strokeWidth="6" />
        <PbChoc x={30} y={42} s={0.32} rot={90} />
        <path d="M-102 -70 l14 16 l26 -34" fill="none" stroke="#2B6E7A" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="70" strokeDashoffset={70 * (1 - tick)} />
      </g>
      <g transform={`translate(${520 + pen} ${1170 + tick * 40}) rotate(30)`}>
        <rect x="-10" y="-90" width="20" height="110" rx="6" fill="#E07A2E" />
        <path d="M-10 20 L0 44 L10 20 Z" fill={INK} />
        <ellipse cx="6" cy="40" rx="40" ry="30" fill={SKIN} />
      </g>
    </g>
  );
}

/* 3 — 100 snack orders: about 74 apples */
function ArtFruit({ T, t }) {
  const n = Math.floor(74 * tw(t, 0.2, 1.6));
  const cells = [];
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10;
    const x = 162 + c * 72, y = 860 + r * 72;
    const on = i < n;
    const wob = on ? osc(T, 1.2, hsh(i)) * 3 : 0;
    cells.push(on
      ? <g key={i} transform={`translate(${x} ${y + wob}) scale(.42)`}><PbApple x={0} y={0} /></g>
      : <rect key={i} x={x - 22} y={y - 22} width="44" height="44" rx="10" fill="#8E151D" />);
  }
  return (
    <g>
      <circle cx="486" cy="1200" r="440" fill="#C42E37" />
      <rect x="100" y="800" width="772" height="772" rx="40" fill="#9C1C24" />
      {cells}
      <g transform={`translate(486 1650) scale(${0.9 + 0.1 * Math.abs(osc(T, 1.1))})`}>
        <rect x="-150" y="-50" width="300" height="100" rx="50" fill={CREAM} />
        <text x="0" y="20" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="64" fill="#B3202A">{`~${n}%`}</text>
      </g>
    </g>
  );
}

/* 4 — right now: grabbing the chocolate, apple ignored */
function ArtChocolate({ T, t }) {
  const reach = tw(t, 0.3, 0.6);
  const chew = Math.abs(osc(T, 0.45));
  const lean = osc(T, 2) * 3;
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#D9B53A" />
      <g transform="translate(790 820)">
        <circle r="96" fill={CREAM} stroke={INK} strokeWidth="10" />
        <line x1="0" y1="0" x2="0" y2="-62" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <line x1="0" y1="0" x2="0" y2="-74" stroke="#B3202A" strokeWidth="6" strokeLinecap="round" transform={`rotate(${T * 360})`} />
        <text x="0" y="150" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={INK}>NOW</text>
      </g>
      <g transform={`rotate(${lean} 420 1700)`}>
        <PbHead x={400} y={1110} T={T} shirt="#2B6E7A" mouth={reach > 0.9 ? 'o' : 'grin'} look={12} ph={1.1} />
        <line x1="500" y1="1360" x2={560 + reach * 40} y2={1300 - reach * 60} stroke="#2B6E7A" strokeWidth="56" strokeLinecap="round" />
        <PbChoc x={600 + reach * 40} y={1250 - reach * 60} s={0.7} rot={-18} bite={reach > 0.9} />
        <ellipse cx={570 + reach * 40} cy={1300 - reach * 60} rx="40" ry="32" fill={SKIN} />
      </g>
      {[0, 1, 2, 3].map((k) => {
        const p = ((T + k * 0.4) % 1.6) / 1.6;
        return <rect key={k} x={470 + k * 18 + osc(T, 0.7, k) * 10} y={1180 + p * 300} width="10" height="10" fill="#5A2E1A" opacity={1 - p} transform={`rotate(${T * 200 + k * 40} ${475 + k * 18} ${1185 + p * 300})`} />;
      })}
      <rect x="100" y="1560" width="772" height="40" rx="10" fill="#8E6B48" />
      <g opacity=".75"><PbApple x={760} y={1500} s={0.9} rot={osc(T, 3) * 4} /></g>
      <path d="M720 1430 q20 -40 70 -30" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" opacity={0.4 + 0.3 * osc(T, 1)} />
    </g>
  );
}

/* 5 — a scale: NOW outweighs LATER */
function ArtScale({ T, t }) {
  const tilt = 14 * tw(t, 0.2, 0.9) + osc(T, 1.6) * 2.5;
  const rad = tilt * Math.PI / 180;
  const L = { x: 486 - 280 * Math.cos(rad), y: 1060 + 280 * Math.sin(rad) };
  const R = { x: 486 + 280 * Math.cos(rad), y: 1060 - 280 * Math.sin(rad) };
  const pan = (p, label, child) => (
    <g transform={`translate(${p.x} ${p.y})`}>
      <line x1="-90" y1="200" x2="0" y2="0" stroke={CREAM} strokeWidth="6" />
      <line x1="90" y1="200" x2="0" y2="0" stroke={CREAM} strokeWidth="6" />
      {child}
      <path d="M-130 200 L130 200 Q110 250 0 250 Q-110 250 -130 200 Z" fill="#E8C547" />
      <text x="0" y="320" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="54" fill={CREAM}>{label}</text>
    </g>
  );
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#24606B" />
      <path d="M486 1080 L420 1600 L552 1600 Z" fill="#1A4A52" />
      <rect x="340" y="1590" width="292" height="40" rx="14" fill="#1A4A52" />
      <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke="#E8C547" strokeWidth="26" strokeLinecap="round" />
      <circle cx="486" cy="1060" r="30" fill="#E8C547" />
      {pan(L, 'NOW', <PbChoc x={0} y={110} s={0.75} rot={-6} />)}
      {pan(R, 'LATER', <PbApple x={0} y={160} s={0.55} />)}
      {[0, 1].map((k) => (
        <path key={k} d={`M${L.x - 150 - k * 30} ${L.y + 140} q-20 40 0 80`} fill="none" stroke={CREAM} strokeWidth="8" strokeLinecap="round" opacity={0.3 + 0.5 * Math.abs(osc(T, 0.8, k * 0.3))} />
      ))}
    </g>
  );
}

/* 6 — deciding in advance: a written plan, chocolate crossed out */
function ArtList({ T, t }) {
  const items = [['APPLE', '#3E8E5A'], ['NUTS', '#3E8E5A'], ['WATER', '#3E8E5A']];
  const strike = tw(t, 2.2, 0.5);
  const pen = Math.min(2.99, t / 0.7);
  const row = Math.floor(pen);
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#C9661F" />
      <g transform={`rotate(${-3 + osc(T, 4) * 1}) translate(0 0)`}>
        <rect x="236" y="780" width="500" height="820" rx="26" fill="#8E5A2E" />
        <rect x="266" y="840" width="440" height="730" rx="12" fill="#fff" />
        <rect x="406" y="760" width="160" height="70" rx="18" fill="#B9B9C2" />
        <text x="486" y="940" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="50" fill={INK}>THE PLAN</text>
        {items.map(([w, c], i) => {
          const d = tw(t, i * 0.7 + 0.3, 0.4);
          return (
            <g key={w}>
              <rect x="310" y={1010 + i * 130} width="60" height="60" rx="10" fill="none" stroke={INK} strokeWidth="7" />
              <path d={`M320 ${1040 + i * 130} l16 18 l30 -40`} fill="none" stroke={c} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="80" strokeDashoffset={80 * (1 - d)} />
              <text x="400" y={1060 + i * 130} fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="54" fill={INK}>{w}</text>
            </g>
          );
        })}
        <text x="400" y="1450" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="54" fill="#9A938A">CANDY</text>
        <line x1="390" y1="1432" x2={390 + 230 * strike} y2="1428" stroke="#B3202A" strokeWidth="12" strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
      </g>
      <g transform={`translate(${700 + osc(T, 0.25) * 8} ${1040 + row * 130 + (t > 2.2 ? 380 - row * 130 : 0)}) rotate(28)`}>
        <rect x="-12" y="-150" width="24" height="160" rx="8" fill="#1F3B73" />
        <path d="M-12 10 L0 40 L12 10 Z" fill={INK} />
        <ellipse cx="10" cy="-40" rx="50" ry="40" fill={SKIN} />
      </g>
    </g>
  );
}

/* 7 — packing tomorrow's snack tonight */
function ArtLunchbox({ T, t }) {
  const drop = tw(t, 0.4, 0.7);
  const sway = osc(T, 2.6) * 3;
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#5A3290" />
      <rect x="600" y="720" width="260" height="300" rx="14" fill="#2E1A4E" />
      <circle cx="770" cy="810" r="46" fill="#F5E6A8" />
      <circle cx="790" cy="796" r="40" fill="#2E1A4E" />
      {[[650, 780], [700, 930], [820, 960], [660, 880]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5 + 3 * Math.abs(osc(T, 1.1, i * 0.25))} fill="#F5E6A8" />
      ))}
      <rect x="600" y="864" width="260" height="10" fill="#5A3290" />
      <rect x="724" y="720" width="10" height="300" fill="#5A3290" />
      <g transform={`rotate(${sway} 300 1700)`}>
        <PbHead x={300} y={1080} T={T} shirt="#E8C547" hair="#3A1A14" mouth="smile" look={16} long />
      </g>
      <rect x="60" y="1500" width="852" height="40" rx="10" fill="#3E2466" />
      <g transform="translate(600 1420)">
        <path d="M-180 -90 L180 -90 L160 80 L-160 80 Z" fill="#2B6E7A" />
        <path d="M-180 -90 L180 -90 L150 -200 L-150 -200 Z" fill="#3A8A97" />
        <rect x="-40" y="-120" width="80" height="20" rx="8" fill="#1D4E57" />
        <g transform={`translate(${-60} ${-260 + drop * 220})`}><PbApple x={0} y={0} s={0.8} /></g>
        <g transform={`translate(70 ${-230 + tw(t, 1.0, 0.7) * 190})`}>
          <path d="M-70 0 L70 0 L60 40 L-60 40 Z" fill="#E8C547" />
          <path d="M-74 -6 Q0 -60 74 -6 Z" fill="#D9A55A" />
        </g>
      </g>
      <line x1="430" y1="1340" x2={500 + drop * 40} y2={1210 + drop * 120} stroke="#E8C547" strokeWidth="54" strokeLinecap="round" />
      <ellipse cx={510 + drop * 40} cy={1200 + drop * 120} rx="40" ry="32" fill={SKIN} />
      <g transform="translate(180 820)">
        <text x="0" y="0" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="64" fill="#F5E6A8" opacity={0.5 + 0.5 * Math.abs(osc(T, 2.2))}>z</text>
        <text x="40" y="-50" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill="#F5E6A8" opacity={0.5 + 0.5 * Math.abs(osc(T, 2.2, 0.3))}>z</text>
      </g>
    </g>
  );
}

Object.assign(window, { ArtPromise, ArtOffice, ArtFruit, ArtChocolate, ArtScale, ArtList, ArtLunchbox });
