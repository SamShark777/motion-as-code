// art.jsx — scene illustrations for "Space Your Study" (spacing effect, Cepeda et al. 2006). Pure functions of T.
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


/* shared — a simple student (head + torso), drawn around (x, y) = top of the head */
function SpKid({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-150 420 C-150 300 -90 250 0 250 C90 250 150 300 150 420 Z" fill={shirt} />
      <rect x="-34" y="190" width="68" height="80" rx="24" fill={SKIN2} />
      <circle cx="0" cy="120" r="104" fill={skin} />
      <path d="M-104 112 C-110 30 -50 4 0 4 C62 4 112 34 104 104 C80 70 40 58 0 62 C-44 58 -84 76 -104 112 Z" fill={hair} />
      <Eye cx={-38} cy={128} T={T} ph={ph} rx={17} ry={17} />
      <Eye cx={38} cy={128} T={T} ph={ph} rx={17} ry={17} />
      {mouth === 'smile' && <path d="M-30 176 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'flat' && <path d="M-24 182 q12 -8 24 0 t24 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'open' && <ellipse cx="0" cy="182" rx="22" ry={14 + Math.abs(osc(T, 0.6)) * 8} fill="#3A0C10" />}
      <ellipse cx="-68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

const CONF_SP = ['#1F3B73', '#B3202A', '#E8C547', '#2B6E7A', '#E07A2E', '#6A3FA0'];
const SP_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/* 1 — a week of day cards, a book lands on Mon / Wed / Fri */
function ArtSpWeek({ T, t }) {
  const hop = -Math.abs(osc(T, 1.2)) * 16;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      {SP_DAYS.map((d, i) => {
        const x = 66 + i * 124;
        const study = i === 0 || i === 2 || i === 4;
        const k = study ? tw(t, 0.4 + i * 0.35, 0.5) : 0;
        return (
          <g key={i}>
            <rect x={x} y="760" width="108" height="150" rx="16" fill={CREAM} />
            <rect x={x} y="760" width="108" height="40" rx="16" fill="#B3202A" />
            <rect x={x} y="784" width="108" height="16" fill="#B3202A" />
            <text x={x + 54} y="792" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="30" fill={CREAM}>{d}</text>
            {study && (
              <g transform={`translate(${x + 54} ${860 - (1 - k) * 80 + osc(T, 1.6, i * 0.2) * 3}) scale(${k})`}>
                <rect x="-32" y="-26" width="64" height="48" rx="6" fill={['#E8C547', '#2B6E7A', '#E07A2E'][i / 2]} />
                <rect x="-26" y="14" width="52" height="8" fill="#fff" />
                <line x1="0" y1="-26" x2="0" y2="14" stroke={INK} strokeWidth="4" />
              </g>
            )}
          </g>
        );
      })}
      <path d={`M100 1000 Q300 ${960 + osc(T, 2) * 10} 486 1000 T872 1000`} fill="none" stroke="#5B7BC0" strokeWidth="8" strokeDasharray="4 22" strokeLinecap="round" />
      <g transform={`translate(0 ${hop})`}>
        <SpKid x={486} y={1210} T={T} shirt="#E8C547" mouth="smile" />
        <line x1="600" y1="1500" x2={720} y2={1100 + osc(T, 0.8) * 14} stroke="#E8C547" strokeWidth="52" strokeLinecap="round" />
        <circle cx={724} cy={1090 + osc(T, 0.8) * 14} r="32" fill={SKIN} />
      </g>
    </g>
  );
}

/* 2 — late-night cram: tall wobbling book stack, coffee, ticking clock */
function ArtSpCram({ T }) {
  const wob = osc(T, 1.3) * 3;
  const sec = T * 120;
  const nod = Math.max(0, osc(T, 2.4)) * 10;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#DDD6C5" />
      <rect x="610" y="740" width="250" height="250" rx="16" fill="#1F3B73" />
      <circle cx="770" cy="820" r="44" fill="#F2E6B8" />
      <circle cx="790" cy="808" r="40" fill="#1F3B73" />
      {[0, 1, 2].map((k) => <circle key={k} cx={650 + k * 50} cy={900 + (k % 2) * 30} r={4 + 2 * Math.abs(osc(T, 1.1, k * 0.3))} fill="#F2E6B8" />)}
      <g transform="translate(220 840)">
        <circle r="86" fill={CREAM} stroke={INK} strokeWidth="10" />
        <line x1="0" y1="0" x2="0" y2="-50" stroke={INK} strokeWidth="10" strokeLinecap="round" transform="rotate(-5)" />
        <line x1="0" y1="8" x2="0" y2="-66" stroke="#B3202A" strokeWidth="5" strokeLinecap="round" transform={`rotate(${sec})`} />
        <circle r="8" fill={INK} />
      </g>
      <rect x="80" y="1480" width="812" height="40" rx="10" fill="#8B5E3C" />
      <rect x="120" y="1520" width="40" height="208" fill="#6E4A2F" />
      <rect x="812" y="1520" width="40" height="208" fill="#6E4A2F" />
      <g transform={`rotate(${wob} 720 1480)`}>
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <rect key={k} x={640 + hsh(k) * 30} y={1430 - k * 52} width={150 - hsh(k + 9) * 30} height="48" rx="6" fill={CONF_SP[k % CONF_SP.length]} />
        ))}
      </g>
      <g transform={`translate(0 ${nod})`}>
        <SpKid x={420} y={1080} T={T} ph={0.4} shirt="#2B6E7A" mouth="flat" />
        <path d="M356 1196 h50 M434 1196 h50" stroke="#7B5A8F" strokeWidth="8" strokeLinecap="round" opacity=".5" />
      </g>
      <g transform="translate(230 1420)">
        <rect x="-44" y="-60" width="88" height="70" rx="10" fill="#B3202A" />
        <path d="M44 -44 q34 0 30 26 q-4 22 -34 18" fill="none" stroke="#B3202A" strokeWidth="10" />
        {[0, 1].map((k) => {
          const p = ((T + k * 0.8) % 1.6) / 1.6;
          return <path key={k} d={`M${-12 + k * 24} ${-74 - p * 80} q12 -16 0 -32 q-12 -16 0 -32`} fill="none" stroke="#9A917E" strokeWidth="6" strokeLinecap="round" opacity={Math.sin(p * Math.PI)} />;
        })}
      </g>
    </g>
  );
}
/* 3 — one 3-hour block splits into three 1-hour blocks on separate days */
function ArtSpSplit({ T, t }) {
  const sp = tw(t, 0.8, 0.9);
  const days = [[190, 'MON'], [486, 'WED'], [782, 'FRI']];
  return (
    <g>
      <circle cx="486" cy="1250" r="430" fill="#9E1B24" />
      {days.map(([x, d], i) => (
        <g key={d}>
          <rect x={x - 120} y="1040" width="240" height="250" rx="20" fill={CREAM} opacity={0.3 + 0.7 * sp} />
          <text x={x} y="1100" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={INK} opacity={sp}>{d}</text>
        </g>
      ))}
      {days.map(([x], i) => {
        const by = 820 + sp * 330 + (sp > 0.99 ? osc(T, 1.4, i * 0.3) * 6 : 0);
        return (
          <g key={i}>
            <rect x={(1 - sp) * (270 + i * 146) + sp * (x - 90)} y={by} width={(1 - sp) * 146 + sp * 180} height="100" rx="18" fill="#E8C547" stroke={INK} strokeWidth="8" />
            <text x={(1 - sp) * (343 + i * 146) + sp * x} y={by + 66} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="46" fill={INK}>1h</text>
          </g>
        );
      })}
      <g opacity={1 - sp}>
        <text x="486" y="790" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="60" fill={CREAM}>3 HOURS</text>
      </g>
      <g transform={`translate(0 ${osc(T, 2.2) * 6})`}>
        <SpKid x={486} y={1330} T={T} ph={1.1} shirt="#1F3B73" mouth="smile" s={0.9} />
        <g transform={`rotate(${osc(T, 1.8) * 4} 486 1650)`}>
          <path d="M376 1600 L486 1630 L596 1600 L596 1700 L486 1728 L376 1700 Z" fill={CREAM} stroke={INK} strokeWidth="6" />
          <line x1="486" y1="1630" x2="486" y2="1728" stroke={INK} strokeWidth="6" />
        </g>
      </g>
    </g>
  );
}

/* 4 — researcher with a magnifier over a wall of studies */
function ArtSpReview({ T, t }) {
  const scan = osc(T, 2.6) * 130;
  const shown = Math.floor(clamp(t / 2.2, 0, 1) * 40);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D9B63A" />
      {Array.from({ length: 40 }).map((_, i) => {
        const cx = 120 + (i % 8) * 104, cy = 760 + Math.floor(i / 8) * 96;
        return (
          <g key={i} opacity={i < shown ? 1 : 0.15} transform={`rotate(${(hsh(i) - 0.5) * 8} ${cx + 40} ${cy + 40})`}>
            <rect x={cx} y={cy} width="80" height="80" rx="6" fill={CREAM} />
            <rect x={cx + 12} y={cy + 14} width="40" height="8" rx="4" fill="#B3202A" />
            <rect x={cx + 12} y={cy + 32} width="56" height="6" rx="3" fill="#BDB6A6" />
            <rect x={cx + 12} y={cy + 48} width="50" height="6" rx="3" fill="#BDB6A6" />
          </g>
        );
      })}
      <path d="M216 1728 C216 1520 320 1440 486 1440 C652 1440 756 1520 756 1728 Z" fill="#fff" />
      <path d="M440 1446 L486 1540 L532 1446 Z" fill="#2B6E7A" />
      <rect x="440" y="1330" width="92" height="130" rx="28" fill={SKIN2} />
      <ellipse cx="486" cy="1230" rx="130" ry="146" fill={SKIN} />
      <path d="M356 1210 C350 1110 420 1090 486 1090 C560 1090 624 1120 616 1200 C580 1160 530 1150 486 1154 C440 1150 386 1170 356 1210 Z" fill="#B9B4AA" />
      <Eye cx={436} cy={1240} T={T} ph={0.9} look={scan / 20} />
      <Eye cx={536} cy={1240} T={T} ph={0.9} look={scan / 20} />
      <circle cx="436" cy="1240" r="40" fill="none" stroke={INK} strokeWidth="8" />
      <circle cx="536" cy="1240" r="40" fill="none" stroke={INK} strokeWidth="8" />
      <line x1="476" y1="1240" x2="496" y2="1240" stroke={INK} strokeWidth="8" />
      <path d="M450 1316 q36 20 72 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <g transform={`translate(${486 + scan} 1000)`}>
        <line x1="50" y1="50" x2="120" y2="300" stroke={INK} strokeWidth="26" strokeLinecap="round" />
        <circle r="78" fill="#BFE8F2" opacity=".55" stroke={INK} strokeWidth="16" />
        <path d="M-40 -30 q20 -24 46 -24" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
        <circle cx="122" cy="300" r="34" fill={SKIN} />
      </g>
    </g>
  );
}

/* 5 — crammer vs spacer: memory dots fade in one head, glow in the other */
function ArtSpBetter({ T, t }) {
  const heads = [[260, '#E07A2E', 'CRAM', false], [712, '#E8C547', 'SPACED', true]];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#235E69" />
      {heads.map(([x, shirt, lab, good], h) => (
        <g key={lab} transform={`translate(0 ${good ? -Math.abs(osc(T, 1.1)) * 14 : 0})`}>
          <SpKid x={x} y={1150} T={T} ph={h * 0.7} shirt={shirt} mouth={good ? 'open' : 'flat'} s={0.95} />
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (i / 7) * TAU + T * 0.6;
            const fade = good ? 1 : clamp(1 - (t - 0.6 - i * 0.25) / 0.6, 0.12, 1);
            return <circle key={i} cx={x + Math.cos(a) * 140} cy={1000 + Math.sin(a) * 50} r={good ? 18 + 4 * osc(T, 0.7, i * 0.1) : 16} fill={good ? '#FFE27A' : CREAM} opacity={fade} />;
          })}
          {good && (
            <g transform={`translate(${x} 880)`} opacity={0.8 + 0.2 * osc(T, 0.5)}>
              <circle r="48" fill="#FFE27A" />
              <rect x="-22" y="40" width="44" height="30" rx="6" fill={CREAM} />
              {[0, 60, 120, 180, 240, 300].map((r) => <line key={r} x1="0" y1="-70" x2="0" y2="-92" stroke="#FFE27A" strokeWidth="8" strokeLinecap="round" transform={`rotate(${r})`} />)}
            </g>
          )}
          {!good && <text x={x} y={900 + osc(T, 1.5) * 8} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="110" fill={CREAM} opacity=".8">?</text>}
          <rect x={x - 110} y="1640" width="220" height="64" rx="32" fill={CREAM} />
          <text x={x} y="1686" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="36" fill={INK}>{lab}</text>
        </g>
      ))}
    </g>
  );
}

/* 6 — stepping stones that get further apart; a little learner hops across */
function ArtSpGaps({ T }) {
  const stones = [130, 260, 450, 780];
  const cyc = (T % 4) / 4 * 3;
  const seg = Math.min(2, Math.floor(cyc)), p = cyc - seg;
  const x = stones[seg] + (stones[seg + 1] - stones[seg]) * Easing.easeInOutSine(p);
  const y = 1300 - Math.sin(p * Math.PI) * (110 + seg * 80);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D26E25" />
      <rect x="0" y="1420" width="972" height="308" fill="#2B6E7A" />
      {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${(k * 230 + T * 40) % 1100 - 80} ${1520 + k * 40} q30 -14 60 0 t60 0`} fill="none" stroke="#5FA3AE" strokeWidth="7" strokeLinecap="round" />)}
      {stones.map((sx, i) => (
        <g key={i}>
          <ellipse cx={sx} cy="1440" rx="90" ry="34" fill="#8C8577" />
          <ellipse cx={sx} cy="1430" rx="84" ry="26" fill="#B9B2A3" />
        </g>
      ))}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <line x1={stones[k] + 30} y1="1530" x2={stones[k + 1] - 30} y2="1530" stroke={CREAM} strokeWidth="6" strokeDasharray="10 12" />
          <path d={`M${stones[k + 1] - 44} 1516 l14 14 l-14 14`} fill="none" stroke={CREAM} strokeWidth="6" strokeLinecap="round" />
        </g>
      ))}
      <g transform={`translate(${x - 486} ${y - 1300})`}>
        <g transform="translate(486 1060)">
          <path d="M-56 200 C-56 150 -30 130 0 130 C30 130 56 150 56 200 L56 320 L-56 320 Z" fill="#6A3FA0" />
          <line x1="-30" y1="310" x2={-40 - p * 10} y2="370" stroke={INK} strokeWidth="26" strokeLinecap="round" />
          <line x1="30" y1="310" x2={40 + p * 10} y2="370" stroke={INK} strokeWidth="26" strokeLinecap="round" />
          <circle cx="0" cy="70" r="66" fill={SKIN} />
          <path d="M-66 60 C-66 10 -30 0 0 0 C40 0 66 16 64 58 C40 36 20 32 0 34 C-24 32 -50 42 -66 60 Z" fill={INK} />
          <Eye cx={-22} cy={78} T={T} rx={12} ry={12} />
          <Eye cx={22} cy={78} T={T} rx={12} ry={12} />
          <path d="M-18 106 q18 16 36 0" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/* 7 — planner on a phone, three sessions get ticked off */
function ArtSpPlan({ T, t }) {
  const rows = ['MON', 'WED', 'FRI'];
  return (
    <g>
      <circle cx="486" cy="1250" r="430" fill="#7A4FB2" />
      <g transform={`rotate(${-4 + osc(T, 2.4) * 2} 486 1240)`}>
        <rect x="286" y="820" width="400" height="760" rx="56" fill={INK} />
        <rect x="310" y="880" width="352" height="660" rx="24" fill={CREAM} />
        <rect x="436" y="842" width="100" height="16" rx="8" fill="#3A3F4B" />
        <text x="486" y="950" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill="#6A3FA0">THIS WEEK</text>
        {rows.map((d, i) => {
          const k = tw(t, 0.6 + i * 0.6, 0.35);
          const y = 1010 + i * 170;
          return (
            <g key={d}>
              <rect x="336" y={y} width="300" height="130" rx="20" fill={['#E8C547', '#2B6E7A', '#E07A2E'][i]} />
              <text x="370" y={y + 80} fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={INK}>{d} · 1h</text>
              <circle cx="590" cy={y + 65} r="30" fill={CREAM} />
              <path d={`M574 ${y + 66} l12 12 l22 -26`} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset={60 * (1 - k)} />
            </g>
          );
        })}
      </g>
      <g transform={`translate(${osc(T, 0.9) * 10} 0)`}>
        <ellipse cx="760" cy="1560" rx="70" ry="60" fill={SKIN} />
        <rect x="738" y="1430" width="44" height="90" rx="22" fill={SKIN} transform={`rotate(${-10 + osc(T, 0.45) * 8} 760 1520)`} />
        <line x1="700" y1="1728" x2="760" y2="1600" stroke="#E8C547" strokeWidth="90" strokeLinecap="round" />
      </g>
      {Array.from({ length: 10 }).map((_, i) => {
        const p = ((T * 0.5 + hsh(i)) % 1);
        return <circle key={i} cx={120 + hsh(i + 5) * 740} cy={1700 - p * 1000} r={6 + hsh(i + 2) * 6} fill={CONF_SP[i % 6]} opacity={Math.sin(p * Math.PI) * 0.9} />;
      })}
    </g>
  );
}

Object.assign(window, { ArtSpWeek, ArtSpCram, ArtSpSplit, ArtSpReview, ArtSpBetter, ArtSpGaps, ArtSpPlan });
