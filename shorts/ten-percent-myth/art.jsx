// art.jsx — scene illustrations for "The 10% Brain Myth" (Ted type 2). Pure functions of T.
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

/* shared — a cartoon brain centred at (x, y); `lit` = per-lobe glow 0..1 (7 lobes) */
const TP_LOBES = [[-106, -60, 120], [14, -125, 135], [126, -52, 116], [-66, 70, 112], [76, 72, 122], [164, 52, 82], [-156, 26, 80]];
function TpBrain({ x, y, s = 1, fill = '#F4A7B9', dim = '#9AA0AE', lit = null, face = false, T = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-30" y="130" width="64" height="120" rx="26" fill="#E58FA3" />
      {TP_LOBES.map(([lx, ly, r], i) => <circle key={i} cx={lx} cy={ly} r={r} fill={lit ? (lit[i] > 0.5 ? fill : dim) : fill} />)}
      {lit && TP_LOBES.map(([lx, ly, r], i) => <circle key={'g' + i} cx={lx} cy={ly} r={r * 0.55} fill="#FFE07A" opacity={lit[i] * 0.55} />)}
      {['M-86 -80 q30 -34 64 -2', 'M34 -170 q16 44 62 26', 'M-30 6 q42 32 86 0', 'M124 -10 q-22 40 18 74', 'M-136 46 q30 22 54 -12', 'M6 110 q20 -30 50 -10'].map((p) => (
        <path key={p} d={p} fill="none" stroke={lit ? '#7E8494' : '#D9778F'} strokeWidth="11" strokeLinecap="round" opacity=".8" />
      ))}
      {face && (
        <g>
          <Eye cx={-46} cy={-6} T={T} rx={22} ry={22} />
          <Eye cx={46} cy={-6} T={T} rx={22} ry={22} ph={0.05} />
          <path d="M-30 50 q30 26 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/* shared — a simple person, (x, y) = top of the head */
function TpPal({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, mouth = 'smile', s = 1, look = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-150 420 C-150 300 -90 250 0 250 C90 250 150 300 150 420 Z" fill={shirt} />
      <rect x="-34" y="190" width="68" height="80" rx="24" fill={SKIN2} />
      <circle cx="0" cy="120" r="104" fill={SKIN} />
      <path d="M-104 112 C-110 30 -50 4 0 4 C62 4 112 34 104 104 C80 70 40 58 0 62 C-44 58 -84 76 -104 112 Z" fill={hair} />
      <Eye cx={-38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      <Eye cx={38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      {mouth === 'smile' && <path d="M-30 176 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="184" rx="14" ry="18" fill="#3A0C10" />}
      {mouth === 'flat' && <path d="M-24 182 q12 -8 24 0 t24 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      <ellipse cx="-68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* 1 — a brain mostly greyed out with cobwebs; a puzzled person looks up */
function ArtTpHook({ T }) {
  const bob = osc(T, 2.4) * 10;
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#264684" />
      <g transform={`translate(0 ${bob})`}>
        <TpBrain x={560} y={980} s={1.05} lit={[1, 0, 0, 0, 0, 0, 0]} />
        <path d="M640 870 l60 -60 M640 870 l84 0 M640 870 l60 60 M664 846 q30 24 60 0 M682 828 q40 42 82 0" fill="none" stroke="#fff" strokeWidth="3" opacity=".7" />
        <g transform={`translate(704 ${930 + Math.abs(osc(T, 2)) * 70})`}>
          <line x1="0" y1={-60 - Math.abs(osc(T, 2)) * 70} x2="0" y2="0" stroke="#fff" strokeWidth="2" opacity=".7" />
          <circle r="10" fill={INK} />
          {[-1, 1].map((sd) => <path key={sd} d={`M0 0 l${sd * 16} -10 M0 0 l${sd * 16} 10`} stroke={INK} strokeWidth="4" />)}
        </g>
      </g>
      <TpPal x={240} y={1240} T={T} shirt="#E8C547" mouth="o" look={10} s={0.92} />
      <line x1="330" y1="1560" x2="380" y2="1300" stroke="#E8C547" strokeWidth="48" strokeLinecap="round" />
      <circle cx="380" cy="1286" r="30" fill={SKIN} />
      <text x={360 + osc(T, 1.2) * 6} y="1200" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="120" fill={CREAM} transform={`rotate(${osc(T, 1.2) * 8} 380 1160)`}>?</text>
      <rect x="0" y="1650" width="972" height="78" fill="#162B55" />
    </g>
  );
}

/* 2 — movie pill: a glowing capsule over a padlocked brain, a clapperboard snapping */
function ArtTpPill({ T }) {
  const snap = Math.max(0, osc(T, 1.4)) * 22;
  const glow = 0.5 + 0.5 * Math.abs(osc(T, 1.1));
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#DDD6C5" />
      <TpBrain x={486} y={1300} s={1} lit={[1, 0, 0, 0, 0, 0, 0]} />
      <g transform={`translate(560 1300) rotate(${osc(T, 1.8) * 6})`}>
        <path d="M-50 -40 v-40 a50 50 0 0 1 100 0 v40" fill="none" stroke="#5B6378" strokeWidth="22" />
        <rect x="-80" y="-44" width="160" height="130" rx="20" fill="#E8C547" />
        <circle cx="0" cy="10" r="18" fill={INK} />
        <rect x="-7" y="10" width="14" height="40" rx="5" fill={INK} />
      </g>
      <g transform={`translate(486 ${840 + osc(T, 1.6) * 20}) rotate(-30)`}>
        <circle r="150" fill="#FFE07A" opacity={glow * 0.3} />
        <rect x="-110" y="-46" width="220" height="92" rx="46" fill="#B3202A" />
        <path d="M0 -46 h64 a46 46 0 0 1 0 92 h-64 Z" fill={CREAM} />
        <rect x="-86" y="-30" width="60" height="16" rx="8" fill="#fff" opacity=".5" />
      </g>
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const a = k * 60 + T * 40;
        return <line key={k} x1="486" y1="690" x2="486" y2="650" stroke="#E8C547" strokeWidth="10" strokeLinecap="round" opacity={glow} transform={`rotate(${a} 486 840)`} />;
      })}
      <g transform="translate(150 1580)">
        <rect x="-90" y="-50" width="180" height="120" rx="8" fill={INK} />
        <g transform={`rotate(${-snap} -90 -50)`}>
          <rect x="-90" y="-84" width="180" height="34" rx="4" fill={INK} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={-80 + k * 46} y="-84" width="22" height="34" fill="#fff" transform={`skewX(-20)`} />)}
        </g>
        <rect x="-70" y="-20" width="140" height="10" rx="5" fill="#5B6378" />
        <rect x="-70" y="10" width="100" height="10" rx="5" fill="#5B6378" />
      </g>
    </g>
  );
}

/* 3 — a scanner sweeps a head; every region lights up as a sun and moon cross the day */
function ArtTpScan({ T }) {
  const sweep = (T * 0.8) % 1;
  const lit = TP_LOBES.map((_, i) => 0.6 + 0.4 * Math.abs(osc(T, 1.6, i * 0.14)));
  const sky = (T * 0.25) % 1;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#9E1B24" />
      <g transform={`rotate(${sky * 360} 486 1700)`}>
        <circle cx="486" cy="900" r="44" fill="#FFE07A" />
        <circle cx="486" cy="2500" r="40" fill={CREAM} />
      </g>
      <path d="M260 1720 C240 1520 220 1440 250 1300 C280 1060 420 960 560 960 C720 960 800 1080 790 1240 C780 1320 760 1380 790 1440 L730 1460 L720 1560 L620 1580 L610 1720 Z" fill="#7E1720" />
      <TpBrain x={530} y={1190} s={0.95} fill="#F4A7B9" lit={lit} dim="#F4A7B9" />
      <rect x="180" y={980 + sweep * 520} width="660" height="12" rx="6" fill="#9AF0FF" opacity={0.8 * Math.sin(sweep * Math.PI)} />
      <rect x="180" y={950 + sweep * 520} width="660" height="40" fill="#9AF0FF" opacity={0.15 * Math.sin(sweep * Math.PI)} />
      <g fill="none" stroke={CREAM} strokeWidth="14">
        <ellipse cx="510" cy="1200" rx="380" ry="380" opacity=".25" />
      </g>
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={300 + k * 180} cy={1660} r="16" fill={k === Math.floor(T * 2) % 3 ? '#9AF0FF' : '#5E0E15'} />
      ))}
    </g>
  );
}

/* 4 — a tiny bandage on the brain switches off one lamp on its control panel */
function ArtTpDamage({ T, t }) {
  const hit = tw(t, 0.8, 0.4);
  const flick = hit > 0.9 ? 0.15 : (Math.floor(T * 8) % 2 ? 1 : 0.6);
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#D9B53A" />
      <TpBrain x={330} y={1100} s={0.85} face T={T} />
      <g transform={`translate(${330 + 126 * 0.85} ${1100 - 52 * 0.85}) rotate(-30) scale(${0.4 + 0.6 * hit})`} opacity={hit}>
        <rect x="-60" y="-22" width="120" height="44" rx="20" fill="#F6E7D0" stroke="#C9A97E" strokeWidth="4" />
        <rect x="-20" y="-22" width="40" height="44" fill="#E9D3B2" />
        {[-10, 10].map((dx) => [-8, 8].map((dy) => <circle key={dx + '_' + dy} cx={dx} cy={dy} r="3" fill="#C9A97E" />))}
      </g>
      {[0, 1, 2, 3].map((k) => (
        <path key={k} d={`M${420 + k * 18} 1230 C${520 + k * 10} ${1330 + k * 30} ${560} ${1360 + k * 40} 620 ${1330 + k * 50}`} fill="none" stroke={INK} strokeWidth="7" opacity=".7" />
      ))}
      <rect x="600" y="1280" width="300" height="260" rx="24" fill="#5B6378" />
      <rect x="620" y="1300" width="260" height="220" rx="14" fill="#3A3F4F" />
      {[0, 1, 2, 3].map((k) => {
        const off = k === 1;
        const on = off ? flick : 1;
        const cx = 690 + (k % 2) * 120, cy = 1360 + Math.floor(k / 2) * 110;
        return (
          <g key={k}>
            <circle cx={cx} cy={cy} r="40" fill="#FFE07A" opacity={on * 0.3} />
            <circle cx={cx} cy={cy} r="28" fill={on > 0.5 ? '#FFE07A' : '#2A2E3A'} />
          </g>
        );
      })}
      {hit > 0.9 && <text x="750" y="1260" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="54" fill={INK} opacity={0.6 + 0.4 * osc(T, 0.8)}>!</text>}
      <rect x="0" y="1640" width="972" height="88" fill="#C9A22E" />
    </g>
  );
}

/* 5 — a small brain, a big battery: energy flows from the body's battery into the head */
function ArtTpEnergy({ T }) {
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#1D4E57" />
      <TpPal x={290} y={1080} T={T} shirt="#E07A2E" mouth="smile" s={1} />
      <g transform="translate(290 1060)">
        <TpBrain x={0} y={0} s={0.22} />
      </g>
      <text x="290" y="980" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="64" fill={CREAM}>2%</text>
      <g transform="translate(700 1060)">
        <rect x="-36" y="-30" width="72" height="30" rx="8" fill={CREAM} />
        <rect x="-110" y="0" width="220" height="520" rx="26" fill="none" stroke={CREAM} strokeWidth="14" />
        {[0, 1, 2, 3, 4].map((k) => (
          <rect key={k} x="-90" y={20 + k * 100} width="180" height="84" rx="10" fill={k === 0 ? '#E8C547' : '#49B07A'} opacity={k === 0 ? 0.6 + 0.4 * Math.abs(osc(T, 0.9)) : 1} />
        ))}
        <text x="0" y="78" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="54" fill={INK}>20%</text>
      </g>
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const p = ((T * 0.7 + k / 6) % 1);
        const x = 590 - p * 220, y = 1110 - Math.sin(p * Math.PI) * 120;
        return <path key={k} d={`M${x} ${y} l-14 22 h14 l-10 22 l26 -30 h-14 l10 -14 Z`} fill="#E8C547" opacity={Math.sin(p * Math.PI)} />;
      })}
    </g>
  );
}

/* 6 — a brain lounging idle in a hammock while the energy meter spins and coins fly away */
function ArtTpIdle({ T }) {
  const swing = osc(T, 2.6) * 5;
  const spin = T * 220;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#D26E25" />
      <rect x="110" y="1000" width="26" height="680" fill="#6E4A2F" />
      <rect x="836" y="1000" width="26" height="680" fill="#6E4A2F" />
      <g transform={`rotate(${swing} 486 1000)`}>
        <path d="M123 1020 C250 1420 720 1420 849 1020" fill="none" stroke={CREAM} strokeWidth="10" />
        <path d="M150 1110 C270 1430 700 1430 822 1110 C700 1340 270 1340 150 1110 Z" fill="#2B6E7A" />
        <TpBrain x={486} y={1180} s={0.6} face T={T} />
      </g>
      <g transform="translate(486 830)">
        <circle r="110" fill={CREAM} stroke={INK} strokeWidth="12" />
        <path d="M-80 30 A86 86 0 0 1 80 30" fill="none" stroke="#B3202A" strokeWidth="16" strokeDasharray="20 10" />
        <line x1="0" y1="0" x2="0" y2="-80" stroke={INK} strokeWidth="10" strokeLinecap="round" transform={`rotate(${spin})`} />
        <circle r="12" fill={INK} />
      </g>
      {[0, 1, 2, 3].map((k) => {
        const p = ((T * 0.8 + k / 4) % 1);
        const x = 600 + p * 300 + hsh(k) * 30, y = 860 - Math.sin(p * Math.PI) * 140 + p * 200;
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${Math.abs(Math.cos(T * 4 + k))} 1)`} opacity={1 - p}>
            <circle r="30" fill="#E8C547" stroke="#B88A1E" strokeWidth="6" />
            <text y="12" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="34" fill="#B88A1E">$</text>
          </g>
        );
      })}
      {[0, 1, 2].map((k) => {
        const p = ((T * 0.5 + k / 3) % 1);
        return <text key={k} x={560 + p * 80} y={1100 - p * 120} fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={34 + p * 20} fill={CREAM} opacity={Math.sin(p * Math.PI)}>z</text>;
      })}
    </g>
  );
}

/* 7 — a psychologist with a magnifier pops the "10%" myth balloon */
function ArtTpDebunk({ T }) {
  const cyc = T % 3;
  const popped = cyc > 2.2;
  const inflate = clamp(cyc / 2.2, 0, 1);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#5A3290" />
      {!popped && (
        <g transform={`translate(640 ${940 + osc(T, 1.4) * 10}) scale(${0.6 + 0.4 * inflate})`}>
          <path d="M0 150 q-20 80 10 180" fill="none" stroke={CREAM} strokeWidth="5" />
          <ellipse rx="150" ry="170" fill="#E07A2E" />
          <path d="M-12 168 L12 168 L0 186 Z" fill="#E07A2E" />
          <ellipse cx="-56" cy="-70" rx="26" ry="46" fill="#fff" opacity=".35" />
          <text y="30" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="96" fill={CREAM}>10%</text>
        </g>
      )}
      {popped && Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * TAU, d = 120 + (cyc - 2.2) * 400;
        return <path key={i} d="M-16 -8 L16 -12 L8 12 Z" fill="#E07A2E" transform={`translate(${640 + Math.cos(a) * d} ${940 + Math.sin(a) * d}) rotate(${i * 40 + cyc * 300})`} opacity={1 - (cyc - 2.2) / 0.8} />;
      })}
      {popped && [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="640" y1="760" x2="640" y2="720" stroke="#E8C547" strokeWidth="12" strokeLinecap="round" transform={`rotate(${a} 640 940)`} />
      ))}
      <TpPal x={300} y={1180} T={T} shirt={CREAM} hair="#8C93A6" mouth={popped ? 'o' : 'smile'} look={12} />
      <line x1="400" y1="1520" x2="470" y2="1290" stroke={CREAM} strokeWidth="50" strokeLinecap="round" />
      <g transform={`translate(${500 + osc(T, 1.5) * 10} 1220)`}>
        <rect x="-12" y="40" width="24" height="110" rx="10" fill="#6E4A2F" transform="rotate(-30)" />
        <circle r="62" fill="#9AF0FF" opacity=".35" stroke={INK} strokeWidth="14" />
        <circle cx="-18" cy="-20" r="14" fill="#fff" opacity=".6" />
      </g>
      <circle cx="470" cy="1290" r="30" fill={SKIN} />
      <rect x="0" y="1660" width="972" height="68" fill="#4E2C7A" />
    </g>
  );
}

/* 8 — the brain trains: lifting a dumbbell, a bed for sleep, piano keys for practice, the pill in the bin */
function ArtTpTrain({ T }) {
  const lift = Math.abs(osc(T, 1.4)) * 80;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <g transform={`translate(0 ${-lift * 0.15})`}>
        <TpBrain x={486} y={1120} s={0.8} face T={T} />
        <line x1="380" y1="1110" x2="300" y2={1020 - lift} stroke="#F4A7B9" strokeWidth="34" strokeLinecap="round" />
        <line x1="592" y1="1110" x2="672" y2={1020 - lift} stroke="#F4A7B9" strokeWidth="34" strokeLinecap="round" />
        <g transform={`translate(486 ${1000 - lift})`}>
          <rect x="-220" y="-10" width="440" height="20" rx="10" fill="#5B6378" />
          {[-1, 1].map((sd) => <rect key={sd} x={sd * 200 - 26} y="-60" width="52" height="120" rx="12" fill={INK} />)}
        </g>
        {[0, 1].map((k) => {
          const p = ((T + k * 0.9) % 1.8) / 1.8;
          return <path key={k} d="M0 -24 C9 -10 14 0 14 7 A14 14 0 0 1 -14 7 C-14 0 -9 -10 0 -24 Z" fill="#9AD8FF" transform={`translate(${380 + k * 210} ${1060 + p * 100})`} opacity={1 - p} />;
        })}
      </g>
      <g transform="translate(160 1520)">
        <rect x="-120" y="20" width="240" height="70" rx="14" fill="#6A3FA0" />
        <rect x="-120" y="-20" width="70" height="60" rx="16" fill={CREAM} />
        <path d="M-40 20 h160 v-10 a20 20 0 0 0 -20 -20 h-140 Z" fill="#8259BD" />
        <text x={-10 + osc(T, 1.6) * 6} y={-40 - Math.abs(osc(T, 1.6)) * 20} fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>z</text>
      </g>
      <g transform="translate(486 1580)">
        <rect x="-140" y="0" width="280" height="90" rx="10" fill={CREAM} />
        {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={-140 + k * 47} y1="0" x2={-140 + k * 47} y2="90" stroke={INK} strokeWidth="4" />)}
        {[0, 1, 3, 4].map((k) => <rect key={k} x={-112 + k * 47} y="0" width="26" height="54" fill={INK} />)}
        <circle cx={-90 + ((Math.floor(T * 3) % 5) * 47)} cy="74" r="10" fill="#E8C547" />
      </g>
      <g transform="translate(812 1560)">
        <path d="M-70 -30 L70 -30 L56 110 L-56 110 Z" fill="#5B6378" />
        <rect x="-80" y="-44" width="160" height="22" rx="8" fill="#3A3F4F" />
        <g transform={`translate(0 ${-70 + Math.abs(osc(T, 1)) * 10}) rotate(${-40 + osc(T, 2) * 6})`}>
          <rect x="-50" y="-20" width="100" height="40" rx="20" fill="#B3202A" />
          <path d="M0 -20 h30 a20 20 0 0 1 0 40 h-30 Z" fill={CREAM} />
        </g>
      </g>
    </g>
  );
}

Object.assign(window, { ArtTpHook, ArtTpPill, ArtTpScan, ArtTpDamage, ArtTpEnergy, ArtTpIdle, ArtTpDebunk, ArtTpTrain });
