// art.jsx — scene illustrations for "Follow The Crowd (social proof, Goldstein, Cialdini & Griskevicius 2008)". Pure functions of T.
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
function SoGuy({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', s = 1, look = 0 }) {
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
      {mouth === 'yawn' && <ellipse cx="0" cy="182" rx="26" ry={10 + Math.abs(osc(T, 2.4)) * 26} fill="#3A0C10" />}
      <ellipse cx="-68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

const SO_SHIRTS = ['#B3202A', '#2B6E7A', '#E8C547', '#6A3FA0', '#E07A2E', CREAM];
const SO_HAIR = [INK, '#5A3A22', '#2A1A12', '#8A4B2A', INK, '#3A1A14'];
const SO_SKIN = [SKIN, '#E2AE86', SKIN2, SKIN, '#D9A07A', SKIN];

/* a queue of people seen from the side, each bobbing on its own beat */
function SoQueue({ T, n = 5, x0 = 120, gap = 150, y = 1230, s = 0.62 }) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} transform={`translate(0 ${osc(T, 1.3 + hsh(i) * 0.6, hsh(i + 4)) * 6})`}>
          <SoGuy x={x0 + i * gap} y={y} T={T} ph={i * 0.7} s={s} shirt={SO_SHIRTS[i % 6]} hair={SO_HAIR[i % 6]} skin={SO_SKIN[i % 6]} mouth={i % 2 ? 'flat' : 'smile'} look={10} />
        </g>
      ))}
    </g>
  );
}

/* 1 — a long line at a food stall, a big question mark */
function ArtSoLine({ T }) {
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      <g transform="translate(700 860)">
        <rect x="0" y="0" width="250" height="520" rx="14" fill={CREAM} />
        <path d="M-20 0 L270 0 L250 70 L0 70 Z" fill="#B3202A" />
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${k * 58} 70 q29 40 58 0`} fill={k % 2 ? CREAM : '#B3202A'} />)}
        <rect x="30" y="140" width="190" height="130" rx="10" fill={INK} />
        <g transform={`translate(125 205) rotate(${osc(T, 1.4) * 6})`}>
          <path d="M-56 -6 C-56 -50 56 -50 56 -6 Z" fill="#E8A33D" />
          <rect x="-60" y="-4" width="120" height="14" rx="6" fill="#6BA24A" />
          <rect x="-58" y="10" width="116" height="18" rx="8" fill="#7A3E1E" />
          <path d="M-56 28 L56 28 Q56 44 40 44 L-40 44 Q-56 44 -56 28 Z" fill="#E8A33D" />
        </g>
      </g>
      <SoQueue T={T} n={4} x0={110} gap={150} y={1340} />
      <rect x="0" y="1600" width="972" height="128" fill="#1A3266" />
      <g transform={`translate(330 ${960 + osc(T, 1.2) * 14}) rotate(${osc(T, 2.2) * 8})`}>
        <text x="0" y="0" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="190" fill="#E8C547">?</text>
      </g>
    </g>
  );
}

/* 2 — footprints of others lead the way; a magnifier reads the clue */
function ArtSoClue({ T, t }) {
  const sweep = osc(T, 2.6) * 120;
  const steps = [[170, 1640], [250, 1560], [300, 1460], [390, 1390], [450, 1290], [550, 1240], [610, 1140], [700, 1100], [760, 1000]];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#DDD6C5" />
      {steps.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${38 - i * 4})`} opacity={tw(t, i * 0.15, 0.3)}>
          <ellipse cx="0" cy="0" rx="22" ry="34" fill="#8C6A48" />
          {[-14, -4, 6, 15].map((dx, k) => <circle key={k} cx={dx} cy={-44 + Math.abs(dx) * 0.3} r="6" fill="#8C6A48" />)}
        </g>
      ))}
      <g transform="translate(800 900)">
        <rect x="-70" y="-90" width="140" height="190" rx="70" fill="#1F3B73" />
        <rect x="-50" y="-70" width="100" height="170" rx="50" fill="#E8C547" />
        <circle cx="30" cy="20" r="9" fill={INK} />
      </g>
      <g transform={`translate(${480 + sweep} ${1300 - sweep * 0.6})`}>
        <line x1="70" y1="70" x2="170" y2="170" stroke={INK} strokeWidth="34" strokeLinecap="round" />
        <circle r="100" fill="#fff" opacity=".35" />
        <circle r="100" fill="none" stroke="#B3202A" strokeWidth="22" />
        <path d="M-50 -40 q20 -26 50 -30" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* 3 — hotel bathroom: towel rack and a swinging door-hanger card */
function ArtSoHotel({ T }) {
  const swing = osc(T, 1.8) * 7;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#9A1B24" />
      {Array.from({ length: 6 }).map((_, r) => Array.from({ length: 7 }).map((_, c) => (
        <rect key={`${r}-${c}`} x={70 + c * 120} y={870 + r * 120} width="112" height="112" fill="#fff" opacity=".07" />
      )))}
      <rect x="160" y="1000" width="420" height="22" rx="11" fill="#C9CCD3" />
      {[0, 1].map((k) => (
        <g key={k} transform={`rotate(${osc(T, 2.4, k * 0.4) * 1.5} ${260 + k * 220} 1010)`}>
          <path d={`M${180 + k * 210} 1004 L${340 + k * 210} 1004 L${340 + k * 210} 1400 Q${260 + k * 210} 1420 ${180 + k * 210} 1400 Z`} fill={k ? '#E8C547' : CREAM} />
          <rect x={180 + k * 210} y="1320" width="160" height="24" fill={k ? '#CFAE34' : '#C9C0AE'} />
        </g>
      ))}
      <rect x="640" y="900" width="240" height="828" rx="10" fill="#7A121A" />
      <circle cx="680" cy="1260" r="22" fill="#E8C547" />
      <g transform={`rotate(${swing} 680 1260)`}>
        <path d="M680 1260 m-26 0 a26 26 0 1 0 52 0" fill="none" stroke={CREAM} strokeWidth="10" />
        <rect x="620" y="1286" width="120" height="250" rx="16" fill={CREAM} />
        <g transform="translate(680 1380)" stroke="#2B6E7A" strokeWidth="10" fill="none" strokeLinecap="round">
          {[0, 120, 240].map((a) => <path key={a} d="M-30 -20 A36 36 0 0 1 22 -28 l-6 -14 m6 14 l-14 6" transform={`rotate(${a + T * 40})`} />)}
        </g>
        <rect x="644" y="1450" width="72" height="10" rx="5" fill="#BDB6A6" />
        <rect x="644" y="1474" width="54" height="10" rx="5" fill="#BDB6A6" />
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.6) % 1.8) / 1.8;
        return <circle key={k} cx={300 + k * 120 + osc(T, 1, k * 0.3) * 10} cy={1460 - p * 200} r={10 + k * 4} fill="#fff" opacity={0.5 * (1 - p)} />;
      })}
    </g>
  );
}

/* 4 — the plain save-the-planet card: one bar fills to 35% */
function ArtSoCard({ T, t }) {
  const f = tw(t, 0.5, 1.2) * 0.35;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D4B23C" />
      <g transform={`rotate(${-5 + osc(T, 2.4) * 2} 290 1230)`}>
        <rect x="140" y="960" width="300" height="440" rx="20" fill={CREAM} />
        <g transform={`translate(290 1130) rotate(${T * 20})`}>
          <circle r="96" fill="#2B6E7A" />
          <path d="M-60 -50 C-30 -70 10 -40 -10 -10 C-30 20 0 40 -20 70 C-60 60 -90 0 -60 -50 Z" fill="#6BA24A" />
          <path d="M30 -80 C70 -60 90 -20 80 10 C60 0 40 -30 30 -80 Z M40 40 C60 30 80 40 70 60 C50 70 40 60 40 40 Z" fill="#6BA24A" />
        </g>
        <rect x="180" y="1270" width="220" height="16" rx="8" fill="#BDB6A6" />
        <rect x="180" y="1306" width="180" height="16" rx="8" fill="#BDB6A6" />
        <rect x="180" y="1342" width="200" height="16" rx="8" fill="#BDB6A6" />
      </g>
      <rect x="560" y="900" width="200" height="620" rx="20" fill="#fff" opacity=".45" />
      <rect x="560" y={1520 - 620 * f / 0.5} width="200" height={620 * f / 0.5} rx="20" fill="#1F3B73" />
      <text x="660" y={1500 - 620 * f / 0.5} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="76" fill={INK}>{Math.round(f * 100)}%</text>
      <rect x="520" y="1520" width="280" height="16" rx="8" fill={INK} />
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${590 + k * 70} ${1600 + osc(T, 0.9, k * 0.3) * 6})`}>
          <rect x="-26" y="-18" width="52" height="60" rx="8" fill={k < 1 ? '#2B6E7A' : CREAM} />
          <rect x="-26" y="-18" width="52" height="14" rx="6" fill={k < 1 ? '#1D4E57' : '#C9C0AE'} />
        </g>
      ))}
    </g>
  );
}

/* 5 — three bars 35 / 44 / 49, the "this room" bar wins */
function ArtSoRoom({ T, t }) {
  const bars = [[35, CREAM, 'CARD'], [44, '#E8C547', 'GUESTS'], [49, '#E07A2E', 'ROOM']];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#235C66" />
      {bars.map(([v, c, lab], i) => {
        const k = tw(t, 0.3 + i * 0.5, 0.8);
        const h = v * 13 * k;
        const x = 150 + i * 240;
        return (
          <g key={i}>
            <rect x={x} y={1560 - h} width="180" height={h} rx="16" fill={c} />
            <text x={x + 90} y={1530 - h} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="72" fill="#fff" opacity={k}>{Math.round(v * k)}</text>
            <text x={x + 90} y="1620" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={CREAM}>{lab}</text>
          </g>
        );
      })}
      <rect x="110" y="1560" width="760" height="14" rx="7" fill={CREAM} />
      <g transform={`translate(720 ${760 + osc(T, 1.1) * 10}) scale(0.7)`} opacity={tw(t, 1.6, 0.4)}>
        <rect x="-60" y="-70" width="120" height="170" rx="10" fill="#7A121A" />
        <rect x="-40" y="-50" width="80" height="40" rx="6" fill={CREAM} />
        <text x="0" y="-18" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="30" fill={INK}>312</text>
        <circle cx="34" cy="30" r="9" fill="#E8C547" />
      </g>
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const p = ((T * 0.8 + hsh(k)) % 1);
        return <circle key={k} cx={640 + hsh(k + 3) * 180} cy={820 - p * 120} r={7} fill={SO_SHIRTS[k % 5]} opacity={tw(t, 1.6, 0.4) * (1 - p)} />;
      })}
    </g>
  );
}

/* 6 — the long line is just slow service: snail, yawns, a slow clock */
function ArtSoSlow({ T }) {
  const crawl = (T * 16) % 300;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#C9671F" />
      <g transform="translate(150 860)">
        <circle r="80" fill={CREAM} />
        <line x1="0" y1="0" x2="0" y2="-56" stroke={INK} strokeWidth="9" strokeLinecap="round" transform={`rotate(${T * 6})`} />
        <line x1="0" y1="0" x2="36" y2="0" stroke={INK} strokeWidth="11" strokeLinecap="round" />
        <circle r="8" fill={INK} />
      </g>
      <SoQueue T={T} n={4} x0={190} gap={170} y={1300} s={0.66} />
      {[0, 1].map((k) => {
        const p = ((T + k * 1.2) % 2.4) / 2.4;
        return <text key={k} x={300 + k * 340 + p * 40} y={1260 - p * 120} fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={40 + p * 20} fill={CREAM} opacity={Math.sin(p * Math.PI)}>z</text>;
      })}
      <rect x="0" y="1590" width="972" height="138" fill="#A95418" />
      <g transform={`translate(${120 + crawl} 1700)`}>
        <path d={`M-70 0 Q-80 -24 -40 -26 L${50 + osc(T, 0.8) * 6} -26 Q70 -26 80 0 Z`} fill="#E9B98E" />
        <circle cx="-10" cy="-70" r="58" fill="#8C4A2A" />
        <path d="M-10 -70 m0 -36 a36 36 0 1 1 -30 20 a22 22 0 1 1 28 -10" fill="none" stroke="#E9B98E" strokeWidth="9" strokeLinecap="round" />
        <line x1="62" y1="-24" x2="70" y2="-70" stroke="#E9B98E" strokeWidth="7" strokeLinecap="round" />
        <circle cx="70" cy="-72" r="9" fill={INK} />
      </g>
    </g>
  );
}

/* 7 — following the crowd, stopping to think */
function ArtSoThink({ T }) {
  const walk = (T * 40) % 160;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#5A3290" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${-walk * 0.3} ${-Math.abs(osc(T, 0.6, i * 0.25)) * 14})`}>
          <SoGuy x={130 + i * 130} y={1320} T={T} ph={i * 0.4} s={0.5} shirt="#3C2366" hair="#26143F" skin="#4A2E78" mouth="flat" look={-10} />
        </g>
      ))}
      <SoGuy x={720} y={1150} T={T} shirt="#E8C547" mouth="flat" look={-8} s={0.85} />
      <line x1="800" y1="1460" x2="790" y2="1330" stroke="#E8C547" strokeWidth="44" strokeLinecap="round" />
      <circle cx="780" cy="1316" r="30" fill={SKIN} />
      <g transform={`translate(0 ${osc(T, 1.4) * 10})`}>
        <circle cx="640" cy="1110" r="14" fill={CREAM} />
        <circle cx="610" cy="1060" r="22" fill={CREAM} />
        <ellipse cx="520" cy="930" rx="160" ry="110" fill={CREAM} />
        <text x="470" y="975" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="130" fill="#6A3FA0">?</text>
        <g transform="translate(580 930)" opacity={0.5 + 0.5 * Math.abs(osc(T, 1.6))}>
          <circle cx="0" cy="-10" r="40" fill="#E8C547" />
          <rect x="-18" y="26" width="36" height="26" rx="6" fill="#8C6A48" />
        </g>
      </g>
    </g>
  );
}

/* 8 — one person stops the crowd and spots the pull: big "!" */
function ArtSoSpot({ T, t }) {
  const bang = 1 + 0.15 * Math.abs(osc(T, 0.7));
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = ((T * 70 + i * 220) % 1100) - 120;
        return (
          <g key={i} transform={`translate(0 ${-Math.abs(osc(T, 0.55, i * 0.2)) * 12})`} opacity=".9">
            <SoGuy x={x} y={1400} T={T} ph={i * 0.5} s={0.42} shirt="#16294F" hair="#0E1A33" skin="#33507F" mouth="flat" look={10} />
          </g>
        );
      })}
      <SoGuy x={486} y={1080} T={T} shirt="#E07A2E" mouth="open" s={0.95} />
      <line x1="380" y1="1440" x2="300" y2="1240" stroke="#E07A2E" strokeWidth="50" strokeLinecap="round" />
      <ellipse cx="296" cy="1220" rx="34" ry="42" fill={SKIN} />
      <g transform={`translate(486 ${940}) scale(${bang * tw(t, 0.3, 0.4)})`}>
        <circle r="78" fill="#E8C547" />
        <rect x="-12" y="-52" width="24" height="64" rx="10" fill={INK} />
        <circle cy="38" r="13" fill={INK} />
      </g>
      {[-1, 1].map((s) => <path key={s} d={`M${486 + s * 110} 900 l${s * 40} -30 M${486 + s * 120} 960 l${s * 50} 0`} stroke={CREAM} strokeWidth="9" strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(osc(T, 0.7))} />)}
    </g>
  );
}

Object.assign(window, { ArtSoLine, ArtSoClue, ArtSoHotel, ArtSoCard, ArtSoRoom, ArtSoSlow, ArtSoThink, ArtSoSpot });
