// art.jsx — scene illustrations for "Hear Your Name" (cocktail party effect, Moray 1959). Pure functions of T.
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


const CP_FONT = 'Montserrat, sans-serif';

/* shared — head + shoulders around (x, y) = top of the head */
function CpPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, ears = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-160 440 C-160 310 -96 262 0 262 C96 262 160 310 160 440 Z" fill={shirt} />
      <rect x="-36" y="196" width="72" height="84" rx="26" fill={SKIN2} />
      {ears && <circle cx="-104" cy="128" r="26" fill={SKIN2} />}
      {ears && <circle cx="104" cy="128" r="26" fill={SKIN2} />}
      <ellipse cx="0" cy="124" rx="104" ry="116" fill={skin} />
      <path d="M-106 114 C-112 30 -50 4 0 4 C62 4 114 34 106 108 C80 72 40 60 0 64 C-44 60 -86 78 -106 114 Z" fill={hair} />
      <Eye cx={-38} cy={132} T={T} ph={ph} rx={17} ry={17} look={look} />
      <Eye cx={38} cy={132} T={T} ph={ph} rx={17} ry={17} look={look} />
      {mouth === 'smile' && <path d="M-30 184 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-22" y1="190" x2="22" y2="190" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'open' && <ellipse cx="0" cy="190" rx="22" ry={12 + Math.abs(osc(T, 0.4, ph)) * 12} fill="#3A0C10" />}
      {mouth === 'o' && <ellipse cx="0" cy="192" rx="16" ry="20" fill="#3A0C10" />}
      <ellipse cx="-68" cy="172" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="172" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

function CpNoise({ x, y, T, ph = 0, c = CREAM, w = 110 }) {
  const j = osc(T, 0.3, ph) * 6;
  return (
    <g transform={`translate(${x} ${y + j})`} opacity={0.55 + 0.35 * Math.abs(osc(T, 0.9, ph))}>
      <path d={`M0 0 q${w / 8} -20 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0`} fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

/* 1 — noisy party; the listener's ear pricks up at a name tag */
function ArtCpParty({ T, t }) {
  const crowd = [[90, '#2A2F45'], [250, '#33395A'], [720, '#2A2F45'], [890, '#33395A']];
  const ping = tw(t, 1.0, 0.35);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      {crowd.map(([x, c], i) => (
        <g key={i} transform={`translate(0 ${osc(T, 1.4, i * 0.3) * 8})`}>
          <circle cx={x} cy={1090} r="74" fill={c} />
          <path d={`M${x - 120} 1500 C${x - 120} 1260 ${x - 60} 1190 ${x} 1190 C${x + 60} 1190 ${x + 120} 1260 ${x + 120} 1500 Z`} fill={c} />
          <g transform={`translate(${x + (i < 2 ? 90 : -90)} ${1250}) rotate(${osc(T, 1.6, i * 0.2) * 8})`}>
            <path d="M-22 -50 L22 -50 L4 0 L4 40 L18 46 L-18 46 L-4 40 L-4 0 Z" fill="#9AD8FF" opacity=".8" />
          </g>
        </g>
      ))}
      {[[110, 860], [700, 820], [300, 760], [560, 900]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y - 46} width="170" height="80" rx="30" fill={CREAM} opacity=".22" />
          <CpNoise x={x + 30} y={y - 6} T={T} ph={i * 0.25} w={110} />
        </g>
      ))}
      <CpPerson x={486} y={1290} T={T} shirt="#E8C547" mouth="o" look={-6} />
      <g transform={`translate(${380 - 120 * ping} ${1300 - 40 * ping}) scale(${ping})`} opacity={ping}>
        <rect x="-110" y="-50" width="220" height="90" rx="20" fill="#B3202A" />
        <rect x="-90" y="-30" width="180" height="50" rx="10" fill={CREAM} />
        <text x="0" y="8" textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize="34" fill={INK}>YOUR NAME</text>
      </g>
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${360 - k * 26} ${1380 - k * 26} q-${20 + k * 10} 40 0 ${80 + k * 30}`} fill="none" stroke="#FFD23F" strokeWidth="9" strokeLinecap="round" opacity={ping * (0.4 + 0.6 * Math.abs(osc(T, 0.6, k * 0.2)))} />
      ))}
    </g>
  );
}

/* 2 — big headphones, a different message pours into each ear */
function ArtCpHeadphones({ T }) {
  const off = (T * 220) % 120;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#DDD6C5" />
      <g transform={`translate(${off - 120} 0)`}>
        <path d={'M-80 1290' + ' q15 -60 30 0 t30 0'.repeat(7)} fill="none" stroke="#B3202A" strokeWidth="12" strokeLinecap="round" />
      </g>
      <g transform={`translate(${120 - off} 0)`}>
        <path d={'M640 1290' + ' l15 -40 l15 80 l15 -40 l15 0'.repeat(6)} fill="none" stroke="#2B6E7A" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <CpPerson x={486} y={1160} T={T} shirt="#6A3FA0" mouth="flat" ears={false} look={osc(T, 2) * 8} />
      <path d="M356 1270 C356 1060 616 1060 616 1270" fill="none" stroke={INK} strokeWidth="30" strokeLinecap="round" />
      <rect x="326" y="1230" width="70" height="130" rx="30" fill="#B3202A" stroke={INK} strokeWidth="8" />
      <rect x="576" y="1230" width="70" height="130" rx="30" fill="#2B6E7A" stroke={INK} strokeWidth="8" />
      <g transform={`translate(160 ${900 + osc(T, 1.3) * 10})`}>
        <rect x="-90" y="-50" width="180" height="100" rx="24" fill="#B3202A" />
        <text x="0" y="16" textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize="46" fill={CREAM}>A</text>
      </g>
      <g transform={`translate(812 ${900 - osc(T, 1.3) * 10})`}>
        <rect x="-90" y="-50" width="180" height="100" rx="24" fill="#2B6E7A" />
        <text x="0" y="16" textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize="46" fill={CREAM}>B</text>
      </g>
    </g>
  );
}

/* 3 — repeating one message aloud; words from the other ear fall away */
function ArtCpRepeat({ T }) {
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#9E1B24" />
      <CpPerson x={486} y={1200} T={T} shirt="#2B6E7A" mouth="open" look={8} />
      <g transform={`translate(760 ${1060 + osc(T, 0.8) * 8})`}>
        <path d="M-120 -80 h240 a30 30 0 0 1 30 30 v100 a30 30 0 0 1 -30 30 h-170 l-50 40 l10 -40 h-30 a30 30 0 0 1 -30 -30 v-100 a30 30 0 0 1 30 -30 Z" fill={CREAM} />
        {[0, 1, 2].map((k) => <rect key={k} x="-100" y={-50 + k * 36} width={200 - k * 50} height="16" rx="8" fill={INK} opacity={0.4 + 0.6 * Math.abs(osc(T, 0.5, k * 0.2))} />)}
      </g>
      {[0, 1, 2, 3].map((k) => {
        const p = ((T + k * 0.6) % 2.4) / 2.4;
        const x = 340 - p * 220 + osc(T, 1, k) * 20, y = 1290 + p * 360;
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${p * 160 * (k % 2 ? 1 : -1)})`} opacity={Math.max(0, 1 - p * 1.2)}>
            <rect x="-60" y="-26" width="120" height="52" rx="12" fill={CREAM} />
            <rect x="-40" y="-6" width="80" height="12" rx="6" fill="#B3202A" />
          </g>
        );
      })}
      <g transform="translate(220 860)" opacity={0.6 + 0.4 * osc(T, 0.7)}>
        <circle r="60" fill="none" stroke={CREAM} strokeWidth="10" />
        <line x1="-42" y1="-42" x2="42" y2="42" stroke={CREAM} strokeWidth="10" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* 4 — a word list on a loop, counter running to 35, nothing sticks */
function ArtCpLoop({ T, t }) {
  const n = Math.min(35, 1 + Math.floor(t * 14));
  const words = ['TREE', 'LAMP', 'BOAT', 'COIN'];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D9B63A" />
      <rect x="140" y="760" width="692" height="300" rx="150" fill="none" stroke={INK} strokeWidth="14" strokeDasharray="30 18" strokeDashoffset={-T * 120} />
      {words.map((w, i) => {
        const a = ((T * 0.35 + i / words.length) % 1) * TAU;
        const x = 486 + Math.cos(a) * 346, y = 910 + Math.sin(a) * 150;
        return (
          <g key={w} transform={`translate(${x} ${y})`}>
            <rect x="-90" y="-36" width="180" height="72" rx="16" fill={CREAM} stroke={INK} strokeWidth="6" />
            <text x="0" y="16" textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize="40" fill={INK}>{w}</text>
          </g>
        );
      })}
      <text x="486" y="935" textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize="92" fill="#B3202A" transform={`translate(${n < 35 ? osc(T, 0.07) * 4 : 0} 0)`}>×{n}</text>
      <CpPerson x={486} y={1270} T={T} shirt="#1F3B73" mouth="flat" look={osc(T, 3) * 10} />
      <g transform={`translate(660 ${1250 + osc(T, 1.2) * 10})`}>
        <circle r="54" fill={CREAM} />
        <text x="0" y="26" textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize="76" fill={INK}>?</text>
      </g>
    </g>
  );
}

/* 5 — three listeners; one of them turns when their name slips in */
function ArtCpThird({ T, t }) {
  const hit = tw(t, 1.0, 0.3);
  const xs = [190, 486, 782];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#235E69" />
      {xs.map((x, i) => {
        const lit = i === 2;
        return (
          <g key={i} transform={`translate(0 ${lit ? -hit * 30 - Math.abs(osc(T, 0.7)) * 10 * hit : osc(T, 2, i * 0.3) * 4})`}>
            {lit && <circle cx={x} cy="1290" r={170 + 10 * osc(T, 0.5)} fill="#FFD23F" opacity={0.3 * hit} />}
            <CpPerson x={x} y={1180} T={T} ph={i * 0.6} s={0.72} shirt={['#E07A2E', '#6A3FA0', '#B3202A'][i]} mouth={lit && hit > 0.5 ? 'o' : 'flat'} look={lit ? -9 * hit : 0} />
            <path d={`M${x - 80} 1270 C${x - 80} 1130 ${x + 80} 1130 ${x + 80} 1270`} fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" />
            <rect x={x - 100} y="1244" width="44" height="80" rx="18" fill={INK} />
            <rect x={x + 56} y="1244" width="44" height="80" rx="18" fill={INK} />
            {lit && <text x={x - 130} y={1230} textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize={110 * hit} fill="#FFD23F">!</text>}
          </g>
        );
      })}
      <g transform={`translate(${972 - 190 * hit} 1080) scale(${0.4 + 0.6 * hit})`} opacity={hit}>
        <rect x="-80" y="-32" width="160" height="64" rx="16" fill={CREAM} />
        <text x="0" y="12" textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize="32" fill={INK}>NAME</text>
      </g>
      <rect x="120" y="1660" width="732" height="40" rx="20" fill="#1D4E57" />
      <rect x="120" y="1660" width={244 * hit} height="40" rx="20" fill="#FFD23F" />
    </g>
  );
}

/* 6 — the brain's quiet radar, one blip flagged as "about you" */
function ArtCpRadar({ T }) {
  const sweep = (T * 90) % 360;
  const blips = [[-120, -60, false], [90, -130, false], [140, 80, false], [-60, 120, true], [30, 30, false]];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D26E25" />
      <g transform="translate(486 1300)">
        <circle r="300" fill="#143A2F" stroke={INK} strokeWidth="14" />
        {[100, 200].map((r) => <circle key={r} r={r} fill="none" stroke="#3FAF7A" strokeWidth="4" opacity=".6" />)}
        <line x1="-300" y1="0" x2="300" y2="0" stroke="#3FAF7A" strokeWidth="3" opacity=".5" />
        <line x1="0" y1="-300" x2="0" y2="300" stroke="#3FAF7A" strokeWidth="3" opacity=".5" />
        <path d="M0 0 L300 0 A300 300 0 0 0 260 -150 Z" fill="#3FAF7A" opacity=".45" transform={`rotate(${sweep})`} />
        {blips.map(([x, y, me], i) => {
          const ang = ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
          const since = ((sweep - ang) + 360) % 360;
          const glow = Math.max(0, 1 - since / 200);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={me ? 20 + glow * 10 : 12} fill={me ? '#FFD23F' : '#7CF0B0'} opacity={me ? 1 : 0.25 + 0.75 * glow} />
              {me && (
                <g transform={`translate(${x} ${y - 70})`}>
                  <rect x="-60" y="-28" width="120" height="52" rx="14" fill="#FFD23F" />
                  <text x="0" y="10" textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize="32" fill={INK}>YOU</text>
                </g>
              )}
            </g>
          );
        })}
      </g>
      <g transform={`translate(486 860) rotate(${osc(T, 3) * 10})`}>
        <path d="M-120 40 C-150 -40 -80 -110 0 -100 C80 -110 150 -40 120 40 C110 80 -110 80 -120 40 Z" fill="#F4A7B9" />
        <path d="M-70 -30 q30 -30 60 0 M10 -40 q30 30 70 10 M-60 30 q40 20 90 0" fill="none" stroke="#D9778F" strokeWidth="10" strokeLinecap="round" />
        <line x1="0" y1="-100" x2="0" y2="-150" stroke={INK} strokeWidth="10" />
        <path d="M-50 -150 A50 30 0 0 0 50 -150 Z" fill={CREAM} stroke={INK} strokeWidth="6" transform={`rotate(${osc(T, 1.2) * 25} 0 -150)`} />
      </g>
    </g>
  );
}

/* 7 — calling a name across a loud room; the friend turns and waves */
function ArtCpCall({ T, t }) {
  const turn = tw(t, 0.9, 0.4);
  const wave = osc(T, 0.5) * 18;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#7A4FB2" />
      {[0, 1, 2, 3, 4, 5].map((k) => <CpNoise key={k} x={300 + (k % 3) * 120} y={1020 + Math.floor(k / 3) * 70} T={T} ph={k * 0.2} w={80} c="#C9B5E8" />)}
      <CpPerson x={220} y={1240} T={T} s={0.85} shirt="#E8C547" mouth="open" look={8} />
      <path d="M296 1400 q40 -10 50 20 q-10 30 -50 20" fill={SKIN} />
      {[0, 1, 2].map((k) => {
        const p = ((T * 1.2 + k / 3) % 1);
        return <path key={k} d={`M${360 + p * 200} ${1320 - p * 140} q20 30 0 60`} fill="none" stroke="#FFD23F" strokeWidth="9" strokeLinecap="round" opacity={Math.sin(p * Math.PI)} />;
      })}
      <g transform={`translate(470 ${1130 + osc(T, 1.1) * 6})`}>
        <rect x="-110" y="-46" width="220" height="80" rx="24" fill={CREAM} />
        <text x="0" y="10" textAnchor="middle" fontFamily={CP_FONT} fontWeight="900" fontSize="38" fill="#6A3FA0">HEY, SAM!</text>
      </g>
      <g transform={`translate(752 1240) scale(${1 - 0.2 * (1 - turn)} 1) translate(-752 -1240)`}>
        <CpPerson x={752} y={1240} T={T} ph={0.8} s={0.85} shirt="#2B6E7A" mouth={turn > 0.5 ? 'smile' : 'flat'} look={-10 * turn} />
      </g>
      <g opacity={turn} transform={`rotate(${wave} 880 1500)`}>
        <line x1="880" y1="1520" x2="900" y2="1330" stroke="#2B6E7A" strokeWidth="44" strokeLinecap="round" />
        <circle cx="902" cy="1310" r="36" fill={SKIN} />
      </g>
    </g>
  );
}

Object.assign(window, { ArtCpParty, ArtCpHeadphones, ArtCpRepeat, ArtCpLoop, ArtCpThird, ArtCpRadar, ArtCpCall });
