// art.jsx — scene illustrations for "Availability Heuristic" (Ted type 2). Pure functions of T.
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

/* shared — a simple person, (x, y) = top of the head */
function AvPal({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', s = 1, look = 0, brow = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-150 420 C-150 300 -90 250 0 250 C90 250 150 300 150 420 Z" fill={shirt} />
      <rect x="-34" y="190" width="68" height="80" rx="24" fill={SKIN2} />
      <circle cx="0" cy="120" r="104" fill={skin} />
      <path d="M-104 112 C-110 30 -50 4 0 4 C62 4 112 34 104 104 C80 70 40 58 0 62 C-44 58 -84 76 -104 112 Z" fill={hair} />
      <Eye cx={-38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      <Eye cx={38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      {brow && <path d="M-60 92 l36 -12 M60 92 l-36 -12" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'smile' && <path d="M-30 176 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="184" rx="16" ry="20" fill="#3A0C10" />}
      {mouth === 'wavy' && <path d="M-36 184 q9 -9 18 0 t18 0 t18 0 t18 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />}
      {mouth === 'flat' && <path d="M-24 182 h48" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      <ellipse cx="-68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — a swirling tornado funnel, (x, y) = top centre */
function AvTornado({ x, y, s = 1, T, col = '#8C93A6', col2 = '#B6BBC8' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1, 2, 3, 4, 5, 6].map((k) => {
        const w = 200 - k * 26, yy = k * 58;
        const dx = osc(T, 1.1, k * 0.12) * (10 + k * 5);
        return <ellipse key={k} cx={dx} cy={yy} rx={w} ry="26" fill={k % 2 ? col2 : col} />;
      })}
      {[0, 1, 2].map((k) => {
        const a = T * 300 + k * 120;
        return <rect key={k} x="-10" y="-6" width="20" height="12" rx="3" fill="#6E4A2F" transform={`rotate(${a}) translate(${150 + k * 20} 0) rotate(${a * 2})`} />;
      })}
    </g>
  );
}

/* 1 — a shaking newspaper with a scary headline, the reader sweating */
function ArtAvHeadline({ T }) {
  const shake = osc(T, 0.11) * 4;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#264684" />
      <AvPal x={486} y={1040} T={T} shirt="#2B6E7A" mouth="o" brow look={0} />
      <g transform={`translate(${shake} 0) rotate(${shake * 0.5} 486 1450)`}>
        <rect x="200" y="1290" width="572" height="420" rx="8" fill="#F4F1EA" />
        <rect x="200" y="1290" width="572" height="70" fill="#B3202A" />
        <text x="486" y="1342" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>BREAKING</text>
        <AvTornado x={340} y={1400} s={0.42} T={T} col="#5B6378" col2="#7A8194" />
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x="470" y={1396 + k * 40} width={k === 4 ? 160 : 260} height="14" rx="7" fill="#C9C0AE" />)}
        <rect x="230" y="1620" width="510" height="14" rx="7" fill="#C9C0AE" />
        <ellipse cx="208" cy="1500" rx="44" ry="52" fill={SKIN} />
        <ellipse cx="764" cy="1500" rx="44" ry="52" fill={SKIN} />
      </g>
      {[[360, 1100, 0], [612, 1090, 0.9]].map(([x, y, ph], i) => {
        const p = ((T + ph) % 1.8) / 1.8;
        return (
          <g key={i} transform={`translate(${x} ${y + p * 120}) scale(${0.6 + p * 0.4})`} opacity={1 - p}>
            <path d="M0 -30 C11 -12 18 0 18 9 A18 18 0 0 1 -18 9 C-18 0 -11 -12 0 -30 Z" fill="#9AD8FF" />
          </g>
        );
      })}
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M${486 + sd * 150} 1000 l${sd * 30} -40 M${486 + sd * 190} 1040 l${sd * 44} -20`} stroke={CREAM} strokeWidth="9" strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(osc(T, 0.5))} />
      ))}
    </g>
  );
}

/* 2 — a survey: forty-one cards flip one by one while a participant ponders */
function ArtAvSurvey({ T, t }) {
  const shown = Math.floor(t * 14);
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#DDD6C5" />
      <rect x="150" y="760" width="672" height="560" rx="24" fill="#fff" />
      <rect x="150" y="760" width="672" height="56" rx="24" fill="#1F3B73" />
      <rect x="150" y="790" width="672" height="26" fill="#1F3B73" />
      {Array.from({ length: 41 }, (_, i) => {
        const cx = 200 + (i % 7) * 96, cy = 860 + Math.floor(i / 7) * 74;
        const on = i < (shown % 60);
        const c = ['#B3202A', '#E8C547', '#2B6E7A', '#E07A2E', '#6A3FA0'][i % 5];
        return (
          <g key={i}>
            <rect x={cx - 34} y={cy - 26} width="68" height="52" rx="8" fill={on ? c : '#E2DDD0'} />
            {on && <rect x={cx - 20} y={cy - 4} width={12 + hsh(i) * 28} height="8" rx="4" fill="#fff" opacity=".8" />}
          </g>
        );
      })}
      <AvPal x={360} y={1340} T={T} shirt="#E07A2E" mouth="flat" look={-12} s={0.9} />
      <g transform={`translate(560 ${1520 + osc(T, 0.6) * 10}) rotate(${-30 + osc(T, 0.6) * 8})`}>
        <rect x="-10" y="-90" width="20" height="120" rx="6" fill="#E8C547" />
        <path d="M-10 30 L0 56 L10 30 Z" fill={SKIN2} />
        <rect x="-10" y="-100" width="20" height="16" rx="4" fill="#E8907A" />
      </g>
      <circle cx="560" cy="1530" r="30" fill={SKIN} />
      {[0, 1, 2].map((k) => <circle key={k} cx={500 + k * 40} cy={1330 - k * 30} r={8 + k * 4} fill="#fff" opacity={0.4 + 0.6 * Math.abs(osc(T, 1.2, k * 0.2))} />)}
    </g>
  );
}

/* 3 — the dramatic causes: a tornado, rising flood water, a flashing siren */
function ArtAvStorm({ T }) {
  const siren = Math.floor(T * 4) % 2;
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#9E1B24" />
      <path d="M180 820 C170 760 250 730 300 760 C330 700 450 700 470 770 C540 750 580 820 540 850 L200 850 C160 850 160 830 180 820 Z" fill="#5E0E15" />
      <AvTornado x={330} y={860} s={1.05} T={T} col="#5E0E15" col2="#7E1720" />
      <g transform="translate(700 1320)">
        <rect x="-110" y="-60" width="220" height="180" fill={CREAM} />
        <path d="M-140 -60 L0 -170 L140 -60 Z" fill="#5E0E15" />
        <rect x="-30" y="40" width="60" height="80" fill="#6E4A2F" />
        <rect x="-86" y="-30" width="50" height="50" fill="#9AD8FF" />
        <rect x="36" y="-30" width="50" height="50" fill="#9AD8FF" />
      </g>
      <g transform={`translate(${osc(T, 2) * 30} ${osc(T, 3.3) * 10})`}>
        <path d={`M-40 1480 Q80 ${1440 + osc(T, 1) * 20} 200 1480 T440 1480 T680 1480 T920 1480 T1160 1480 L1160 1728 L-40 1728 Z`} fill="#3F79C9" />
        <path d={`M-40 1540 Q80 ${1510 - osc(T, 1) * 16} 200 1540 T440 1540 T680 1540 T920 1540 T1160 1540 L1160 1728 L-40 1728 Z`} fill="#2C5FA8" />
      </g>
      <g transform="translate(160 1420)">
        <rect x="-50" y="-10" width="100" height="40" rx="8" fill={INK} />
        <path d="M-40 -10 C-40 -80 40 -80 40 -10 Z" fill={siren ? '#5B8FD6' : '#E2453C'} />
        {siren === 1 && [-50, 0, 50].map((a) => <line key={a} x1="0" y1="-90" x2="0" y2="-130" stroke="#9AD8FF" strokeWidth="9" strokeLinecap="round" transform={`rotate(${a} 0 -40)`} />)}
        {siren === 0 && [-50, 0, 50].map((a) => <line key={a} x1="0" y1="-90" x2="0" y2="-130" stroke="#FF9C8A" strokeWidth="9" strokeLinecap="round" transform={`rotate(${a} 0 -40)`} />)}
      </g>
    </g>
  );
}

/* 4 — the quiet killers: a calm armchair, a glucose meter, a pill organiser, a sleeping cat, "shh" */
function ArtAvQuiet({ T }) {
  const breathe = 1 + osc(T, 3) * 0.02;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#D9B53A" />
      <rect x="660" y="780" width="200" height="280" rx="10" fill="#F4F1EA" />
      <rect x="676" y="796" width="168" height="248" rx="6" fill="#9AD8FF" opacity=".6" />
      <line x1="760" y1="796" x2="760" y2="1044" stroke="#F4F1EA" strokeWidth="10" />
      <g transform="translate(420 1140)">
        <rect x="-230" y="60" width="460" height="300" rx="70" fill="#2B6E7A" />
        <rect x="-190" y="-120" width="380" height="300" rx="80" fill="#35808D" />
        <rect x="-250" y="120" width="80" height="220" rx="36" fill="#1D4E57" />
        <rect x="170" y="120" width="80" height="220" rx="36" fill="#1D4E57" />
      </g>
      <g transform={`translate(420 ${1010}) scale(${breathe})`}>
        <AvPal x={0} y={0} T={T} shirt="#B3202A" hair="#D8D2C2" mouth="smile" s={0.8} ph={0.4} />
        <path d="M-60 60 h40 M20 60 h40" stroke="#5B6378" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g transform="translate(790 1500)">
        <rect x="-70" y="40" width="140" height="190" fill="#8B5E3C" />
        <rect x="-90" y="20" width="180" height="30" rx="8" fill="#6E4A2F" />
        <rect x="-60" y="-40" width="64" height="60" rx="10" fill="#5B6378" />
        <rect x="-50" y="-30" width="44" height="22" rx="4" fill="#9AF0FF" />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={14 + (k % 2) * 30} y={-14 + Math.floor(k / 2) * 18} width="26" height="14" rx="4" fill={['#E07A2E', '#6A3FA0', '#2B6E7A', '#B3202A'][k]} />)}
      </g>
      <g transform="translate(250 1650)">
        <ellipse cx="0" cy="0" rx="90" ry={40 * breathe} fill="#E07A2E" />
        <circle cx="70" cy="-20" r="38" fill="#E07A2E" />
        <path d="M50 -50 l10 -26 l14 22 M80 -52 l14 -24 l8 26" fill="#E07A2E" />
        <path d="M56 -18 q8 6 16 0 M80 -18 q8 6 16 0" stroke={INK} strokeWidth="4" fill="none" />
        <path d="M-90 10 q-40 10 -30 -30" fill="none" stroke="#E07A2E" strokeWidth="14" strokeLinecap="round" />
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T * 0.5 + k / 3) % 1);
        return <text key={k} x={330 + p * 60} y={1560 - p * 140} fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={28 + p * 14} fill={INK} opacity={Math.sin(p * Math.PI) * 0.6}>z</text>;
      })}
      <g transform={`translate(600 900) rotate(${osc(T, 2) * 4})`}>
        <ellipse cx="0" cy="0" rx="72" ry="54" fill="#fff" />
        <text x="0" y="16" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="42" fill={INK}>shh</text>
      </g>
    </g>
  );
}

/* 5 — two researchers at a chalkboard: the easiest memory looks the most common */
function ArtAvNames({ T }) {
  const tap = Math.abs(osc(T, 0.8)) * 16;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#1D4E57" />
      <rect x="120" y="780" width="732" height="420" rx="16" fill="#6E4A2F" />
      <rect x="140" y="800" width="692" height="380" rx="8" fill="#24453B" />
      <g stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round" opacity=".9">
        <circle cx="300" cy="950" r="80" />
        <path d="M300 1030 v50 M260 1080 h80" />
        <path d="M270 920 q30 -30 60 0" />
        <path d="M420 960 h120 m-30 -20 l30 20 l-30 20" />
      </g>
      {[0, 1, 2].map((k) => (
        <rect key={k} x={590 + k * 90} y={1050 - k * 90 - (k === 2 ? tap * 0.5 : 0)} width="70" height={80 + k * 90 + (k === 2 ? tap * 0.5 : 0)} rx="6" fill={k === 2 ? '#E8C547' : CREAM} opacity={k === 2 ? 1 : 0.7} />
      ))}
      <g stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round"><path d="M560 1140 h300" /></g>
      <AvPal x={260} y={1260} T={T} shirt="#E9E4D8" hair="#3A1A14" mouth="smile" s={0.88} look={14} />
      <AvPal x={720} y={1290} T={T} ph={0.5} shirt="#E07A2E" hair="#5B6378" mouth="o" s={0.82} look={-10} />
      <line x1="350" y1="1560" x2={470} y2={1190 - tap} stroke="#E9E4D8" strokeWidth="44" strokeLinecap="round" />
      <circle cx="470" cy={1180 - tap} r="28" fill={SKIN} />
      <rect x="464" y={1130 - tap} width="12" height="40" rx="5" fill="#fff" />
    </g>
  );
}

/* 6 — a memory jar: vivid tokens float to the top and get grabbed first, dull ones sink */
function ArtAvMind({ T }) {
  const reach = Math.abs(osc(T, 1.8));
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#D26E25" />
      <rect x="260" y="880" width="452" height="60" rx="20" fill="#8B5E3C" />
      <path d="M270 940 L702 940 C760 1000 770 1100 770 1300 C770 1560 700 1660 486 1660 C272 1660 202 1560 202 1300 C202 1100 212 1000 270 940 Z" fill="#F7C9A0" opacity=".45" stroke={CREAM} strokeWidth="12" />
      <path d="M250 1080 C236 1200 236 1360 262 1480" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" opacity=".6" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={260 + (i % 4) * 110} y={1500 + Math.floor(i / 4) * 70} width="90" height="56" rx="14" fill="#B5743E" opacity=".9" />
      ))}
      {[[340, '#E2453C'], [486, '#E8C547'], [630, '#3F79C9']].map(([x, c], i) => {
        const y = 1010 + osc(T, 1.4, i * 0.3) * 18;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="60" fill={c} opacity={0.35 + 0.2 * osc(T, 0.7, i * 0.2)} />
            <circle cx={x} cy={y} r="44" fill={c} />
            {i === 0 && <path d={`M${x - 20} ${y - 14} h40 l-10 14 h-20 l-6 14 h18`} fill="none" stroke={CREAM} strokeWidth="6" strokeLinecap="round" />}
            {i === 1 && <path d={`M${x} ${y - 24} l-12 22 h12 l-8 22 l22 -28 h-12 l8 -16 Z`} fill={INK} />}
            {i === 2 && <path d={`M${x - 26} ${y + 6} q13 -16 26 0 t26 0`} fill="none" stroke={CREAM} strokeWidth="7" strokeLinecap="round" />}
          </g>
        );
      })}
      <g transform={`translate(0 ${-140 + reach * 120})`}>
        <rect x="446" y="640" width="80" height="300" rx="36" fill="#1F3B73" />
        <ellipse cx="486" cy="950" rx="50" ry="44" fill={SKIN} />
        {[-24, -8, 8, 24].map((dx) => <rect key={dx} x={480 + dx} y="960" width="14" height="44" rx="7" fill={SKIN} />)}
      </g>
      <path d="M760 820 l20 -40 M800 850 l40 -20 M790 900 l44 4" stroke={CREAM} strokeWidth="8" strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(osc(T, 0.6))} />
    </g>
  );
}

/* 7 — the TV news: a tornado on screen, a red LIVE dot, a scrolling ticker */
function ArtAvNews({ T }) {
  const tick = (T * 160) % 380;
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#5A3290" />
      <path d="M430 820 L360 720 M542 820 L612 720" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <rect x="140" y="820" width="692" height="520" rx="40" fill={INK} />
      <clipPath id="avScreen"><rect x="180" y="860" width="612" height="440" rx="16" /></clipPath>
      <g clipPath="url(#avScreen)">
        <rect x="180" y="860" width="612" height="440" fill="#8C93A6" />
        <rect x="180" y="1160" width="612" height="140" fill="#5B6378" />
        <AvTornado x={486} y={920} s={0.8} T={T} col="#3A3F4F" col2="#5B6378" />
        <rect x="180" y="1236" width="612" height="64" fill="#B3202A" />
        {[0, 1, 2].map((k) => <rect key={k} x={800 - tick + k * 380 - 380} y="1258" width="260" height="20" rx="10" fill={CREAM} />)}
        <rect x="204" y="884" width="110" height="44" rx="8" fill="#B3202A" />
        <circle cx="228" cy="906" r="10" fill={Math.floor(T * 2) % 2 ? '#fff' : '#FF9C8A'} />
        <text x="246" y="918" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="30" fill="#fff">LIVE</text>
      </g>
      <rect x="380" y="1340" width="212" height="40" fill={INK} />
      <rect x="260" y="1380" width="452" height="30" rx="10" fill={INK} />
      {[[250, '#E8C547', 0], [500, '#2B6E7A', 0.4], [740, '#E07A2E', 0.8]].map(([x, c, ph], i) => (
        <g key={i} transform={`translate(${x} ${1500 + Math.abs(osc(T, 1.6, ph)) * -8})`}>
          <path d="M-120 228 C-120 120 -70 80 0 80 C70 80 120 120 120 228 Z" fill={c} />
          <circle cx="0" cy="20" r="76" fill={i === 1 ? '#3A1A14' : INK} />
        </g>
      ))}
    </g>
  );
}

/* 8 — check the real number: laptop chart, magnifier, the scary paper crumpled on the floor */
function ArtAvCheck({ T, t }) {
  const grow = tw(t, 0.4, 1.0);
  const mag = osc(T, 2) * 40;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#264684" />
      <rect x="430" y="1060" width="420" height="280" rx="20" fill="#5B6378" />
      <rect x="450" y="1080" width="380" height="240" rx="10" fill="#F4F1EA" />
      {[0, 1, 2, 3, 4].map((k) => {
        const h = [60, 90, 150, 190, 210][k] * grow;
        return <rect key={k} x={480 + k * 68} y={1300 - h} width="44" height={h} rx="6" fill={k < 2 ? '#E2453C' : '#2B6E7A'} />;
      })}
      <path d="M400 1340 L880 1340 L910 1380 L370 1380 Z" fill="#3A3F4F" />
      <g transform={`translate(${600 + mag} 1180)`}>
        <circle r="70" fill="#9AF0FF" opacity=".25" stroke={INK} strokeWidth="14" />
        <rect x="44" y="44" width="26" height="110" rx="10" fill="#6E4A2F" transform="rotate(-45 57 57)" />
      </g>
      <AvPal x={220} y={1150} T={T} shirt="#E8C547" mouth="smile" look={14} s={0.9} />
      <g transform={`translate(740 1600) rotate(${osc(T, 3) * 6})`}>
        <path d="M-60 -20 L-30 -50 L10 -30 L50 -54 L70 -10 L50 30 L10 44 L-40 34 L-70 10 Z" fill="#F4F1EA" />
        <path d="M-40 -10 L0 10 L40 -20 M-20 20 L30 24" stroke="#C9C0AE" strokeWidth="5" fill="none" />
        <path d="M-50 -24 L-20 -40 L20 -24" stroke="#B3202A" strokeWidth="10" fill="none" />
      </g>
      <g transform={`translate(860 960) scale(${grow})`}>
        <circle r="56" fill="#49B07A" />
        <path d="M-24 2 l16 18 l32 -36" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

Object.assign(window, { ArtAvHeadline, ArtAvSurvey, ArtAvStorm, ArtAvQuiet, ArtAvNames, ArtAvMind, ArtAvNews, ArtAvCheck });
