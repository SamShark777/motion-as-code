// art.jsx — scene illustrations for "Mere Exposure" (Ted type 2). Pure functions of T.
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

/* shared: a bust (head + shoulders), drawn around the head centre */
function MeHead({ x, y, s = 1, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, look = 0, mouth = 'smile', long = false, cut = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {long && <path d="M-122 -10 C-132 -140 132 -140 122 -10 L130 170 L-130 170 Z" fill={hair} />}
      <path d={cut ? 'M-170 380 C-170 220 -100 160 0 160 C100 160 170 220 170 380 Z' : 'M-170 800 L-170 380 C-170 220 -100 160 0 160 C100 160 170 220 170 380 L170 800 Z'} fill={shirt} />
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
const ME_SHIRTS = ['#2B6E7A', '#E07A2E', '#6A3FA0', '#B3202A'];
const meHeart = (x, y, s, fill, op = 1) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <rect x="-20" y="-20" width="40" height="40" fill={fill} transform="rotate(45)" />
    <circle cx="-14" cy="-14" r="20" fill={fill} />
    <circle cx="14" cy="-14" r="20" fill={fill} />
  </g>
);

/* 1 — someone just hanging around; the people nearby start to warm up */
function ArtWave({ T, t }) {
  const wave = osc(T, 0.6) * 22;
  const warm = tw(t, 0.8, 1.2);
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <MeHead x={170} y={1300} s={0.7} T={T} ph={0.9} shirt="#5D79B8" look={14} mouth={warm > 0.5 ? 'smile' : 'flat'} />
      <MeHead x={802} y={1300} s={0.7} T={T} ph={1.7} shirt="#5D79B8" hair="#3A1A14" look={-14} long mouth={warm > 0.5 ? 'smile' : 'flat'} />
      <MeHead x={486} y={1130} T={T} shirt="#E8C547" hair="#3A1A14" long mouth="grin" />
      <g transform={`rotate(${wave} 610 1400)`}>
        <line x1="610" y1="1400" x2="680" y2="1180" stroke="#E8C547" strokeWidth="56" strokeLinecap="round" />
        <circle cx="686" cy="1160" r="38" fill={SKIN} />
      </g>
      {[[170, 1130, 0], [802, 1130, 0.5]].map(([x, y, ph], i) => {
        const p = ((T + ph) % 2) / 2;
        return <g key={i}>{meHeart(x + osc(T, 1.4, ph) * 14, y - p * 160, 0.6 + 0.3 * warm, '#E2453C', warm * Math.sin(p * Math.PI))}</g>;
      })}
      <text x="486" y="860" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="120" fill="#E8C547" opacity={0.6 + 0.4 * Math.abs(osc(T, 1.5))}>?</text>
    </g>
  );
}

/* 2 — a university lecture hall; one quiet woman sits among the students */
function ArtLecture({ T, t }) {
  const point = osc(T, 1.4) * 10;
  const glow = 0.5 + 0.2 * osc(T, 1.2);
  const rows = [[1290, 7, 0.55], [1450, 6, 0.7], [1640, 5, 0.9]];
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#DDD6C5" />
      <rect x="150" y="730" width="672" height="300" rx="12" fill="#2F4A3E" />
      <rect x="150" y="1030" width="672" height="20" fill="#8E6B48" />
      <path d="M210 820 h220 M210 880 h300 M210 940 h180" stroke={CREAM} strokeWidth="10" strokeLinecap="round" opacity=".8" />
      <circle cx="660" cy="880" r="70" fill="none" stroke={CREAM} strokeWidth="8" opacity=".8" />
      <g transform="translate(740 1000)">
        <rect x="-50" y="0" width="100" height="160" rx="40" fill="#1F3B73" />
        <circle cx="0" cy="-40" r="52" fill={SKIN2} />
        <path d="M-52 -50 C-52 -100 52 -100 52 -50 C30 -70 -30 -70 -52 -50 Z" fill="#9A938A" />
        <line x1="-40" y1="30" x2={-130} y2={-60 + point} stroke="#1F3B73" strokeWidth="30" strokeLinecap="round" />
      </g>
      {rows.map(([y, n, s], r) => (
        <g key={r}>
          <rect x="0" y={y + 60 * s} width="972" height={60 * s} fill="#8E6B48" />
          {Array.from({ length: n }).map((_, i) => {
            const x = 972 / (n + 1) * (i + 1);
            const her = r === 1 && i === 3;
            const bob = osc(T, 2 + hsh(r * 9 + i), hsh(i + r)) * 4;
            return (
              <g key={i} transform={`translate(${x} ${y + bob}) scale(${s})`}>
                {her && <circle cx="0" cy="0" r="150" fill="#E8C547" opacity={glow} />}
                <path d="M-110 120 C-110 50 -60 30 0 30 C60 30 110 50 110 120 Z" fill={her ? '#B3202A' : ['#2B6E7A', '#6A3FA0', '#E07A2E', '#1F3B73'][(i + r) % 4]} />
                {her && <path d="M-80 -10 C-90 -110 90 -110 80 -10 L84 80 L-84 80 Z" fill="#3A1A14" />}
                {!her && <circle cx="0" cy="-20" r="70" fill={['#3A1A14', INK, '#7A4A2A'][(i * 3 + r) % 3]} />}
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

/* 3 — four similar women; they came to 0, 5, 10 or 15 classes */
function ArtCalendar({ T, t }) {
  const counts = [0, 5, 10, 15];
  return (
    <g>
      <circle cx="486" cy="1200" r="440" fill="#C42E37" />
      {counts.map((c, i) => {
        const x = 132 + i * 236;
        const d = tw(t, 0.2 + i * 0.25, 0.5);
        const shown = Math.round(c * tw(t, 0.6 + i * 0.25, 0.8));
        return (
          <g key={i} transform={`translate(${x} ${820 + (1 - d) * 80})`} opacity={d}>
            <clipPath id={`meCard${i}`}><rect x="-100" y="0" width="200" height="250" rx="16" /></clipPath>
            <rect x="-100" y="0" width="200" height="250" rx="16" fill={CREAM} />
            <g clipPath={`url(#meCard${i})`}><g transform="translate(0 120)">
              <MeHead x={0} y={0} s={0.55} T={T} ph={i * 0.7} shirt={ME_SHIRTS[i]} hair="#3A1A14" long look={osc(T, 3, i * 0.2) * 6} />
            </g></g>
            <text x="0" y="420" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="110" fill={CREAM}>{shown}</text>
            {Array.from({ length: 15 }).map((_, k) => (
              <rect key={k} x={-84 + (k % 5) * 36} y={470 + Math.floor(k / 5) * 64} width="24" height="48" rx="6"
                fill={k < shown ? '#E8C547' : '#8E151D'} />
            ))}
          </g>
        );
      })}
      <path d="M120 1680 h732" stroke={CREAM} strokeWidth="8" strokeLinecap="round" opacity=".5" />
    </g>
  );
}

/* 4 — at the end of term, students rate a photo of each woman */
function ArtPhotos({ T, t }) {
  const nod = osc(T, 1.8) * 3;
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#D9B53A" />
      <g transform={`rotate(${nod} 486 1400)`}>
        <rect x="140" y="760" width="692" height="900" rx="24" fill="#fff" />
        <rect x="400" y="730" width="172" height="60" rx="16" fill="#9A938A" />
        {[0, 1, 2, 3].map((i) => {
          const y = 840 + i * 200;
          const stars = Math.round((1.5 + i) * tw(t, 0.4 + i * 0.4, 0.5));
          return (
            <g key={i}>
              <rect x="190" y={y} width="170" height="170" rx="12" fill={['#BFD0F2', '#F6D9B8', '#CFE6D9', '#E6D2F2'][i]} />
              <clipPath id={`mePh${i}`}><rect x="190" y={y} width="170" height="170" rx="12" /></clipPath>
              <g clipPath={`url(#mePh${i})`}><g transform={`translate(275 ${y + 80})`}>
                <MeHead x={0} y={0} s={0.42} T={T} ph={i * 0.5} shirt={ME_SHIRTS[i]} hair="#3A1A14" long />
              </g></g>
              {[0, 1, 2, 3, 4].map((k) => (
                <path key={k} transform={`translate(${430 + k * 76} ${y + 90}) scale(${k < stars ? 1 : 0.85})`}
                  d="M0 -32 L9 -10 L32 -10 L14 4 L20 28 L0 14 L-20 28 L-14 4 L-32 -10 L-9 -10 Z"
                  fill={k < stars ? '#E8C547' : '#E5E0D4'} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
              ))}
            </g>
          );
        })}
      </g>
      <g transform={`translate(${860 + osc(T, 0.4) * 10} ${1500 + osc(T, 1.6) * 30}) rotate(-30)`}>
        <rect x="-14" y="-170" width="28" height="170" rx="8" fill="#1F3B73" />
        <path d="M-14 0 L0 34 L14 0 Z" fill={INK} />
        <ellipse cx="10" cy="-50" rx="52" ry="42" fill={SKIN} />
      </g>
    </g>
  );
}

/* 5 — the more classes she came to, the more likeable she seemed */
function ArtHearts({ T, t }) {
  const hs = [0.25, 0.42, 0.6, 0.82];
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#24606B" />
      <path d="M110 1600 h760" stroke={CREAM} strokeWidth="10" strokeLinecap="round" />
      {hs.map((h, i) => {
        const x = 200 + i * 190;
        const g = tw(t, 0.2 + i * 0.3, 0.8);
        const top = 1600 - 640 * h * g;
        return (
          <g key={i}>
            <rect x={x - 60} y={top} width="120" height={1600 - top} rx="14" fill={['#5FA2AD', '#7DB8C0', '#A9D3D8', '#E8C547'][i]} />
            <g transform={`translate(${x} ${top - 140})`}>
              <MeHead cut x={0} y={0} s={0.36} T={T} ph={i * 0.4} shirt={ME_SHIRTS[i]} hair="#3A1A14" long mouth={i > 1 ? 'grin' : 'smile'} />
            </g>
            <text x={x} y="1670" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="54" fill={CREAM}>{[0, 5, 10, 15][i]}</text>
            {Array.from({ length: i }).map((_, k) => {
              const p = ((T + k * 0.6 + i * 0.3) % 1.8) / 1.8;
              return <g key={k}>{meHeart(x + osc(T, 1.2, k * 0.3 + i) * 30, top - 170 - p * 160, 0.5 + 0.1 * i, '#E2453C', g * Math.sin(p * Math.PI))}</g>;
            })}
          </g>
        );
      })}
    </g>
  );
}

/* 6 — a student who barely remembers her, but still likes her */
function ArtForget({ T, t }) {
  const scratch = osc(T, 0.3) * 14;
  const bub = tw(t, 0.3, 0.6);
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#C9661F" />
      <g transform={`translate(640 860) scale(${bub})`} opacity={bub}>
        <ellipse cx="0" cy="0" rx="210" ry="150" fill={CREAM} />
        <circle cx="-150" cy="190" r="26" fill={CREAM} />
        <circle cx="-200" cy="250" r="16" fill={CREAM} />
        <g opacity={0.35 + 0.15 * osc(T, 1.6)}>
          <path d="M-90 -10 C-96 -110 96 -110 90 -10 L94 90 L-94 90 Z" fill="#3A1A14" />
          <ellipse cx="0" cy="-10" rx="66" ry="76" fill={SKIN} />
          <path d="M-110 150 C-110 90 -60 70 0 70 C60 70 110 90 110 150 Z" fill="#B3202A" />
        </g>
        <text x="110" y="10" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="120" fill={INK}>?</text>
      </g>
      <MeHead x={340} y={1240} T={T} shirt="#1F3B73" look={osc(T, 2.6) * 10 + 6} mouth="smile" ph={0.3} />
      <line x1="460" y1="1560" x2={470} y2={1170 + scratch} stroke="#1F3B73" strokeWidth="56" strokeLinecap="round" />
      <ellipse cx={460} cy={1130 + scratch} rx="40" ry="34" fill={SKIN} />
      {meHeart(200, 1080 - Math.abs(osc(T, 1.4)) * 30, 0.7, '#E2453C', 0.85)}
    </g>
  );
}

/* 7 — a regular at the café: the barista greets them warmly */
function ArtCoffee({ T, t }) {
  const wave = osc(T, 0.55) * 18;
  const hi = tw(t, 0.6, 0.5);
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#5A3290" />
      <rect x="560" y="740" width="320" height="200" rx="14" fill="#2E1A4E" />
      <text x="720" y="830" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="50" fill="#E8C547">CAFÉ</text>
      <path d="M600 870 h240" stroke="#E8C547" strokeWidth="6" strokeLinecap="round" opacity=".6" />
      <MeHead x={690} y={1150} s={0.85} T={T} ph={0.8} shirt="#2B6E7A" hair="#3A1A14" mouth="grin" look={-12} />
      <g transform={`rotate(${wave} 800 1360)`}>
        <line x1="800" y1="1360" x2="850" y2="1180" stroke="#2B6E7A" strokeWidth="46" strokeLinecap="round" />
        <circle cx="854" cy="1162" r="34" fill={SKIN2} />
      </g>
      <g transform={`translate(560 1000) scale(${hi})`} opacity={hi}>
        <rect x="-170" y="-60" width="240" height="100" rx="36" fill={CREAM} />
        <path d="M20 36 L60 90 L-20 38 Z" fill={CREAM} />
        <text x="-50" y="8" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={INK}>HI AGAIN!</text>
      </g>
      <MeHead x={250} y={1250} T={T} shirt="#E07A2E" look={14} mouth="smile" />
      <rect x="440" y="1420" width="532" height="308" fill="#8E6B48" />
      <rect x="430" y="1400" width="542" height="34" rx="8" fill="#6E5236" />
      <g transform="translate(560 1340)">
        <path d="M-50 -50 L50 -50 L40 60 L-40 60 Z" fill={CREAM} />
        <path d="M50 -24 q34 0 30 28 q-4 24 -36 20" fill="none" stroke={CREAM} strokeWidth="12" />
        {[0, 1].map((k) => {
          const p = ((T + k * 0.9) % 1.8) / 1.8;
          return <path key={k} d={`M${-14 + k * 28} ${-70 - p * 110} q14 -20 0 -40 q-14 -20 0 -40`} fill="none" stroke={CREAM} strokeWidth="8" strokeLinecap="round" opacity={Math.sin(p * Math.PI) * 0.8} />;
        })}
      </g>
    </g>
  );
}

/* 8 — keep showing up: a week of check marks */
function ArtDoor({ T, t }) {
  const step = osc(T, 0.7);
  const days = ['M', 'T', 'W', 'T', 'F'];
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#264684" />
      <g transform="translate(486 800)">
        <rect x="-330" y="-70" width="660" height="150" rx="20" fill={CREAM} />
        {days.map((d, i) => {
          const c = tw(t, 0.3 + i * 0.35, 0.35);
          return (
            <g key={i} transform={`translate(${-264 + i * 132} 0)`}>
              <text x="0" y="-12" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="36" fill="#9A938A">{d}</text>
              <circle cx="0" cy="34" r="30" fill={c > 0.5 ? '#2B6E7A' : '#DDD6C5'} />
              <path d="M-14 34 l10 12 l20 -24" fill="none" stroke={CREAM} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - c)} />
            </g>
          );
        })}
      </g>
      <rect x="560" y="1000" width="300" height="640" rx="16" fill="#1A2F5C" />
      <rect x="590" y="1030" width="240" height="610" rx="8" fill="#E8C547" opacity={0.75 + 0.1 * osc(T, 1.3)} />
      <circle cx="610" cy="1340" r="12" fill="#1A2F5C" />
      <rect x="0" y="1640" width="972" height="88" fill="#1A2F5C" />
      <g transform={`translate(${380 + osc(T, 2.8) * 30} ${-Math.abs(step) * 12})`}>
        <line x1="-30" y1="1460" x2={-30 - step * 50} y2="1630" stroke={INK} strokeWidth="50" strokeLinecap="round" />
        <line x1="30" y1="1460" x2={30 + step * 50} y2="1630" stroke={INK} strokeWidth="50" strokeLinecap="round" />
        <path d="M-90 1480 L-90 1300 C-90 1240 -50 1220 0 1220 C50 1220 90 1240 90 1300 L90 1480 Z" fill="#B3202A" />
        <line x1="-80" y1="1270" x2={-120 - step * 30} y2="1430" stroke="#B3202A" strokeWidth="40" strokeLinecap="round" />
        <line x1="80" y1="1270" x2={120 + step * 30} y2="1430" stroke="#B3202A" strokeWidth="40" strokeLinecap="round" />
        <rect x="-24" y="1180" width="48" height="50" rx="16" fill={SKIN2} />
        <circle cx="0" cy="1120" r="80" fill={SKIN} />
        <path d="M-80 1112 C-86 1030 -30 1016 0 1016 C52 1016 90 1040 82 1104 C60 1070 30 1064 0 1066 C-32 1064 -64 1080 -80 1112 Z" fill={INK} />
        <Eye cx={-24} cy={1124} T={T} ph={0.5} rx={13} ry={13} look={6} />
        <Eye cx={30} cy={1124} T={T} ph={0.5} rx={13} ry={13} look={6} />
        <path d="M-16 1160 q20 16 40 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      </g>
    </g>
  );
}

Object.assign(window, { ArtWave, ArtLecture, ArtCalendar, ArtPhotos, ArtHearts, ArtForget, ArtCoffee, ArtDoor });
