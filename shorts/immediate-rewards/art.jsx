// art.jsx — scene illustrations for "Treat It Now (immediate rewards, Woolley & Fishbach 2018)". Pure functions of T.
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
function IrKid({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', s = 1, look = 0 }) {
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
      {mouth === 'open' && <ellipse cx="0" cy="182" rx="22" ry={14 + Math.abs(osc(T, 0.6)) * 8} fill="#3A0C10" />}
      <ellipse cx="-68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — a wrapped gift box centred on (0,0) */
function IrGift({ c = '#B3202A', r = '#E8C547', s = 1 }) {
  return (
    <g transform={`scale(${s})`}>
      <rect x="-90" y="-60" width="180" height="130" rx="10" fill={c} />
      <rect x="-104" y="-92" width="208" height="44" rx="10" fill={c} />
      <rect x="-16" y="-92" width="32" height="162" fill={r} />
      <path d="M0 -92 C-30 -150 -90 -130 -60 -100 Z M0 -92 C30 -150 90 -130 60 -100 Z" fill={r} />
    </g>
  );
}

const IR_STAR = (x, y, r, k) => `M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z`;

/* 1 — ringing alarm clock + a gift that pops up right NOW */
function ArtIrClock({ T, t }) {
  const shake = osc(T, 0.09) * 6;
  const pop = tw(t, 0.6, 0.6);
  const bob = osc(T, 1.1) * 12;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#264684" />
      <g transform={`translate(250 960) rotate(${shake})`}>
        <circle cx="-70" cy="-96" r="40" fill="#E8C547" />
        <circle cx="70" cy="-96" r="40" fill="#E8C547" />
        <circle r="120" fill="#B3202A" />
        <circle r="96" fill={CREAM} />
        {[0, 90, 180, 270].map((a) => <rect key={a} x="-5" y="-88" width="10" height="18" rx="4" fill={INK} transform={`rotate(${a})`} />)}
        <line x1="0" y1="0" x2="0" y2="-50" stroke={INK} strokeWidth="11" strokeLinecap="round" transform="rotate(-30)" />
        <line x1="0" y1="8" x2="0" y2="-74" stroke="#B3202A" strokeWidth="6" strokeLinecap="round" transform={`rotate(${T * 360})`} />
        <circle r="9" fill={INK} />
        {[-1, 1].map((s) => <path key={s} d={`M${s * 150} -60 q${s * 22} 30 0 60 M${s * 180} -80 q${s * 30} 50 0 100`} fill="none" stroke={CREAM} strokeWidth="8" strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(osc(T, 0.3))} />)}
      </g>
      <IrKid x={420} y={1250} T={T} shirt="#E07A2E" mouth="open" look={8} />
      <line x1="540" y1="1590" x2="660" y2={1430 + bob} stroke="#E07A2E" strokeWidth="56" strokeLinecap="round" />
      <circle cx="664" cy={1420 + bob} r="34" fill={SKIN} />
      <g transform={`translate(700 ${1290 + bob}) scale(${0.3 + 0.7 * pop})`} opacity={pop}>
        <IrGift c="#2B6E7A" s={0.8} />
      </g>
      {[0, 1, 2, 3].map((k) => {
        const p = ((T + k * 0.4) % 1.6) / 1.6;
        return <path key={k} d={IR_STAR(700 + Math.cos(k * 1.7) * 150 * p, 1260 + bob - Math.sin(k * 1.7 + 1) * 140 * p, 18 * (1 - p) + 6, k)} fill="#E8C547" opacity={pop * (1 - p)} />;
      })}
    </g>
  );
}

/* 2 — a long week of work, the gift waits on Sunday */
function ArtIrCalendar({ T, t }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const write = osc(T, 0.25) * 10;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#DDD6C5" />
      {days.map((d, i) => {
        const x = 66 + i * 124;
        const done = i < 6 && t > 0.3 + i * 0.35;
        return (
          <g key={i}>
            <rect x={x} y="780" width="108" height="140" rx="16" fill="#fff" />
            <rect x={x} y="780" width="108" height="38" rx="16" fill={i === 6 ? '#B3202A' : '#1F3B73'} />
            <text x={x + 54} y="810" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="26" fill="#fff">{d}</text>
            {done && <path d={`M${x + 24} 846 L${x + 84} 900 M${x + 84} 846 L${x + 24} 900`} stroke="#B3202A" strokeWidth="10" strokeLinecap="round" />}
            {i === 6 && <g transform={`translate(${x + 54} ${870 + osc(T, 0.9) * 5})`}><IrGift c="#E8C547" r="#B3202A" s={0.28} /></g>}
          </g>
        );
      })}
      <rect x="140" y="1440" width="692" height="40" rx="10" fill="#8C6A48" />
      <rect x="180" y="1480" width="30" height="248" fill="#6E5236" />
      <rect x="762" y="1480" width="30" height="248" fill="#6E5236" />
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={620 - k * 4} y={1410 - k * 44} width="170" height="40" rx="6" fill={['#1F3B73', '#B3202A', '#2B6E7A', '#6A3FA0', '#E07A2E'][k]} />)}
      <IrKid x={380} y={1000} T={T} shirt="#1F3B73" mouth="flat" s={1.05} />
      <rect x="290" y="1400" width="220" height="44" rx="6" fill="#fff" />
      <line x1="480" y1="1470" x2={430 + write} y2="1405" stroke="#1F3B73" strokeWidth="44" strokeLinecap="round" />
      <rect x={414 + write} y="1366" width="12" height="54" rx="4" fill="#E8C547" transform={`rotate(20 ${420 + write} 1393)`} />
      {(() => { const p = (T % 1.8) / 1.8; return <path d="M0 -26 C10 -10 16 0 16 8 A16 16 0 0 1 -16 8 C-16 0 -10 -10 0 -26 Z" fill="#9AD8FF" transform={`translate(${280} ${1080 + p * 110})`} opacity={1 - p} />; })()}
    </g>
  );
}

/* 3 — two researchers with clipboards and a bubbling flask */
function ArtIrLab({ T }) {
  const tick = Math.floor(T * 2) % 4;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#9A1B24" />
      <rect x="0" y="1560" width="972" height="168" fill="#7A121A" />
      <IrKid x={250} y={1050} T={T} shirt={CREAM} hair="#5A3A22" />
      <IrKid x={722} y={1050} T={T} ph={1.1} shirt={CREAM} hair="#2A1A12" skin="#E2AE86" />
      {[[250, 0], [722, 1]].map(([x, k]) => (
        <g key={k} transform={`translate(${x + (k ? -90 : 90)} 1440) rotate(${(k ? 8 : -8) + osc(T, 1.6, k * 0.3) * 4})`}>
          <rect x="-70" y="-90" width="140" height="180" rx="12" fill="#8C6A48" />
          <rect x="-56" y="-70" width="112" height="146" rx="6" fill="#fff" />
          <rect x="-26" y="-100" width="52" height="24" rx="6" fill="#C9CCD3" />
          {[0, 1, 2, 3].map((r) => <g key={r}><rect x="-40" y={-50 + r * 32} width="54" height="9" rx="4" fill="#BDB6A6" />{r <= tick && <path d={`M24 ${-50 + r * 32} l8 8 l14 -16`} fill="none" stroke="#2B6E7A" strokeWidth="6" strokeLinecap="round" />}</g>)}
        </g>
      ))}
      <g transform="translate(486 1420)">
        <path d="M-30 -150 L30 -150 L30 -60 L100 90 Q110 120 80 120 L-80 120 Q-110 120 -100 90 L-30 -60 Z" fill={CREAM} opacity=".9" />
        <path d="M-62 30 L62 30 L94 96 Q100 112 82 112 L-82 112 Q-100 112 -94 96 Z" fill="#E8C547" />
        {[0, 1, 2, 3].map((k) => {
          const p = ((T + k * 0.45) % 1.8) / 1.8;
          return <circle key={k} cx={osc(T, 1, k * 0.25) * 18} cy={60 - p * 260} r={8 + p * 10} fill="#E8C547" opacity={1 - p} />;
        })}
      </g>
    </g>
  );
}

/* 4 — candy now vs. the same candy after the hourglass */
function ArtIrTwoGroups({ T, t }) {
  const drop = (T % 2) / 2;
  const sand = (T % 4) / 4;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D4B23C" />
      <line x1="486" y1="820" x2="486" y2="1700" stroke={INK} strokeWidth="8" strokeDasharray="22 18" opacity=".5" />
      <IrKid x={250} y={1180} T={T} shirt="#2B6E7A" mouth="open" s={0.92} />
      <line x1="170" y1="1560" x2="120" y2="1340" stroke="#2B6E7A" strokeWidth="50" strokeLinecap="round" />
      <ellipse cx="120" cy="1318" rx="48" ry="26" fill={SKIN} />
      <g transform={`translate(120 ${880 + MOTION.enter(Math.min(drop * 1.4, 1)) * 384}) rotate(${T * 200}) scale(0.8)`}>
        <circle r="34" fill="#B3202A" />
        <path d="M-34 0 L-64 -22 L-64 22 Z M34 0 L64 -22 L64 22 Z" fill="#B3202A" />
        <path d="M-18 -18 Q0 0 -18 18 M2 -28 Q20 0 2 28" fill="none" stroke="#fff" strokeWidth="6" opacity=".7" />
      </g>
      <IrKid x={722} y={1180} T={T} ph={0.8} shirt="#6A3FA0" mouth="flat" s={0.92} look={-6} />
      <g transform={`translate(722 ${980 + osc(T, 1.5) * 6})`}>
        <rect x="-80" y="-130" width="160" height="22" rx="8" fill="#8C6A48" />
        <rect x="-80" y="108" width="160" height="22" rx="8" fill="#8C6A48" />
        <path d="M-64 -108 L64 -108 L8 0 L64 108 L-64 108 L-8 0 Z" fill={CREAM} opacity=".85" />
        <path d={`M${-50 + sand * 42} ${-98 + sand * 80} L${50 - sand * 42} ${-98 + sand * 80} L4 -6 L-4 -6 Z`} fill="#E07A2E" />
        <path d={`M${-56 + (1 - sand) * 40} 100 L${56 - (1 - sand) * 40} 100 L${30 - (1 - sand) * 20} ${100 - sand * 70} L${-30 + (1 - sand) * 20} ${100 - sand * 70} Z`} fill="#E07A2E" />
        <line x1="0" y1="0" x2="0" y2="96" stroke="#E07A2E" strokeWidth="4" strokeDasharray="6 8" strokeDashoffset={-T * 60} />
      </g>
    </g>
  );
}

/* 5 — absorbed in a puzzle task, sparkles of interest */
function ArtIrEngaged({ T, t }) {
  const pen = osc(T, 0.3) * 14;
  const n = Math.min(4, Math.floor(t / 0.6));
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#235C66" />
      <IrKid x={486} y={930} T={T} shirt="#E8C547" mouth="open" s={1.05} look={osc(T, 2) * 6} />
      <rect x="150" y="1420" width="672" height="40" rx="10" fill="#8C6A48" />
      <rect x="196" y="1460" width="30" height="268" fill="#6E5236" />
      <rect x="746" y="1460" width="30" height="268" fill="#6E5236" />
      <g transform="rotate(-4 486 1360)">
        <rect x="330" y="1290" width="312" height="140" rx="10" fill="#fff" />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect x={354 + k * 72} y="1316" width="56" height="56" rx="8" fill={['#1F3B73', '#B3202A', '#2B6E7A', '#6A3FA0'][k]} opacity={k < n ? 1 : 0.2} />
            {k < n && <path d={`M${366 + k * 72} 1394 l10 10 l20 -22`} fill="none" stroke="#2B6E7A" strokeWidth="7" strokeLinecap="round" />}
          </g>
        ))}
      </g>
      <line x1="640" y1="1440" x2={600 + pen} y2="1330" stroke="#E8C547" strokeWidth="48" strokeLinecap="round" />
      <rect x={588 + pen} y="1280" width="12" height="60" rx="4" fill="#E07A2E" transform={`rotate(14 ${594 + pen} 1310)`} />
      {[0, 1, 2, 3, 4].map((k) => {
        const a = k * 1.25 + T * 0.6;
        const r = 300 + osc(T, 1.3, k * 0.2) * 20;
        return <path key={k} d={IR_STAR(486 + Math.cos(a) * r, 1080 + Math.sin(a) * r * 0.55, 20 + 8 * Math.abs(osc(T, 0.8, k * 0.3)))} fill="#E8C547" opacity={0.6 + 0.4 * osc(T, 0.8, k * 0.3)} />;
      })}
    </g>
  );
}

/* 6 — the reward jar is empty, but the pages keep piling up */
function ArtIrKeepGoing({ T, t }) {
  const pen = osc(T, 0.22) * 12;
  const pages = Math.min(9, 3 + Math.floor(t * 2));
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#C9671F" />
      <g transform="translate(220 1150)">
        <rect x="-80" y="-120" width="160" height="30" rx="10" fill="#8C6A48" />
        <path d="M-90 -90 L90 -90 L100 130 Q100 160 70 160 L-70 160 Q-100 160 -100 130 Z" fill={CREAM} opacity=".55" />
        <text x="0" y="60" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="96" fill="#fff" opacity=".9">0</text>
        <line x1="-130" y1="-160" x2="130" y2="190" stroke="#B3202A" strokeWidth="18" strokeLinecap="round" opacity={0.7 + 0.3 * osc(T, 1)} />
      </g>
      <rect x="380" y="1460" width="560" height="40" rx="10" fill="#8C6A48" />
      {Array.from({ length: pages }).map((_, k) => (
        <rect key={k} x={760 + hsh(k) * 16 - 8} y={1446 - k * 16} width="150" height="14" rx="3" fill={k % 2 ? '#fff' : '#F3EEE2'} />
      ))}
      <IrKid x={580} y={1010} T={T} shirt="#2B6E7A" mouth="smile" look={6} />
      <rect x="470" y="1420" width="220" height="44" rx="6" fill="#fff" />
      <line x1="680" y1="1500" x2={620 + pen} y2="1424" stroke="#2B6E7A" strokeWidth="44" strokeLinecap="round" />
      <rect x={606 + pen} y="1378" width="12" height="54" rx="4" fill="#1F3B73" transform={`rotate(18 ${612 + pen} 1405)`} />
      {[0, 1].map((k) => {
        const p = ((T + k) % 2) / 2;
        return <path key={k} d={`M${500 + k * 120} ${1400 - p * 90} q14 -16 28 0`} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity={1 - p} />;
      })}
    </g>
  );
}

/* 7 — the task itself glows: an open book radiating light */
function ArtIrTask({ T }) {
  const br = 1 + osc(T, 1.6) * 0.04;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#5A3290" />
      <g transform={`rotate(${T * 12} 486 1230)`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d="M486 1230 L466 860 L506 860 Z" fill="#E8C547" opacity={0.15 + 0.15 * Math.abs(osc(T, 1.4, i * 0.12))} transform={`rotate(${i * 30} 486 1230)`} />
        ))}
      </g>
      <g transform={`translate(486 1250) scale(${br}) translate(-486 -1250)`}>
        <path d="M486 1150 C400 1100 280 1100 200 1130 L200 1400 C280 1370 400 1370 486 1420 Z" fill="#fff" />
        <path d="M486 1150 C572 1100 692 1100 772 1130 L772 1400 C692 1370 572 1370 486 1420 Z" fill={CREAM} />
        <path d="M486 1150 L486 1420" stroke="#C9C0AE" strokeWidth="6" />
        {[0, 1, 2, 3].map((k) => <line key={k} x1="250" y1={1180 + k * 50} x2="430" y2={1170 + k * 50} stroke="#BDB6A6" strokeWidth="9" strokeLinecap="round" />)}
        {[0, 1, 2, 3].map((k) => <line key={k} x1="540" y1={1170 + k * 50} x2="720" y2={1180 + k * 50} stroke="#BDB6A6" strokeWidth="9" strokeLinecap="round" />)}
        <path d="M486 1320 C460 1290 420 1300 430 1330 C440 1360 486 1380 486 1380 C486 1380 532 1360 542 1330 C552 1300 512 1290 486 1320 Z" fill="#B3202A" />
      </g>
      <ellipse cx="220" cy={1440 + osc(T, 1.6) * 6} rx="70" ry="50" fill={SKIN} />
      <ellipse cx="752" cy={1440 + osc(T, 1.6) * 6} rx="70" ry="50" fill={SKIN} />
      <rect x="120" y="1470" width="150" height="260" rx="60" fill="#E07A2E" />
      <rect x="702" y="1470" width="150" height="260" rx="60" fill="#E07A2E" />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const p = ((T * 0.7 + hsh(k)) % 1);
        return <path key={k} d={IR_STAR(300 + hsh(k + 9) * 372, 1100 - p * 300, 14 + 10 * (1 - p))} fill="#fff" opacity={Math.sin(p * Math.PI)} />;
      })}
    </g>
  );
}

/* 8 — study block done: headphones on, snack in hand, notes floating */
function ArtIrSong({ T }) {
  const nod = osc(T, 0.6) * 5;
  const munch = Math.abs(osc(T, 0.8));
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#264684" />
      <g transform="translate(200 1500) rotate(-6)">
        <rect x="-110" y="-30" width="220" height="60" rx="8" fill="#B3202A" />
        <rect x="-100" y="-80" width="200" height="50" rx="8" fill="#2B6E7A" />
        <circle cx="70" cy="-120" r="40" fill="#E8C547" />
        <path d="M50 -120 l14 14 l26 -30" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      </g>
      <g transform={`rotate(${nod} 540 1300)`}>
        <IrKid x={540} y={1000} T={T} shirt="#E07A2E" mouth="smile" />
        <path d="M418 1110 C418 960 662 960 662 1110" fill="none" stroke={INK} strokeWidth="20" />
        <rect x="400" y="1080" width="40" height="80" rx="16" fill="#B3202A" />
        <rect x="640" y="1080" width="40" height="80" rx="16" fill="#B3202A" />
      </g>
      <line x1="430" y1="1400" x2="360" y2="1250" stroke="#E07A2E" strokeWidth="56" strokeLinecap="round" />
      <g transform={`translate(352 ${1214 - munch * 12})`}>
        <circle r="54" fill="#C98A4E" />
        <path d="M30 -44 A54 54 0 0 1 54 0 L36 -6 L40 -26 Z" fill="#264684" />
        {[[-20, -14], [12, 10], [-8, 26], [18, -20]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="#4A2A18" />)}
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.8) % 2.4) / 2.4;
        const x = 700 + p * 160 + osc(T, 1.1, k) * 20, y = 1060 - p * 300;
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${osc(T, 1, k) * 12})`} opacity={Math.min(p * 5, 1 - p)}>
            <ellipse cx="0" cy="0" rx="22" ry="16" fill={CREAM} transform="rotate(-20)" />
            <rect x="15" y="-76" width="8" height="76" fill={CREAM} />
            <path d="M19 -76 q28 10 32 36" fill="none" stroke={CREAM} strokeWidth="8" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

Object.assign(window, { ArtIrClock, ArtIrCalendar, ArtIrLab, ArtIrTwoGroups, ArtIrEngaged, ArtIrKeepGoing, ArtIrTask, ArtIrSong });
