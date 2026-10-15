// art.jsx — scene illustrations for "Shuffle Your Practice" (interleaving, Ted type 2). Pure functions of T.
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

/* shared — a simple student, (x, y) = top of the head */
function IlPal({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, mouth = 'smile', s = 1, look = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-150 420 C-150 300 -90 250 0 250 C90 250 150 300 150 420 Z" fill={shirt} />
      <rect x="-34" y="190" width="68" height="80" rx="24" fill={SKIN2} />
      <circle cx="0" cy="120" r="104" fill={SKIN} />
      <path d="M-104 112 C-110 30 -50 4 0 4 C62 4 112 34 104 104 C80 70 40 58 0 62 C-44 58 -84 76 -104 112 Z" fill={hair} />
      <Eye cx={-38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      <Eye cx={38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      {mouth === 'smile' && <path d="M-30 176 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'grin' && <path d="M-38 168 A38 32 0 0 0 38 168 Z" fill={INK} />}
      {mouth === 'sad' && <path d="M-26 190 q26 -20 52 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'flat' && <path d="M-24 182 h48" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      <ellipse cx="-68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — four kinds of geometric solid, centred at (x, y) */
const IL_KINDS = ['cube', 'cyl', 'cone', 'wedge'];
const IL_COL = { cube: '#B3202A', cyl: '#2B6E7A', cone: '#E07A2E', wedge: '#6A3FA0' };
function IlSolid({ kind, x, y, s = 1, col }) {
  const c = col || IL_COL[kind];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {kind === 'cube' && (
        <g>
          <path d="M-50 -20 L0 -45 L50 -20 L0 5 Z" fill="#fff" opacity=".45" />
          <path d="M-50 -20 L0 5 L0 60 L-50 35 Z" fill={c} />
          <path d="M50 -20 L0 5 L0 60 L50 35 Z" fill={c} opacity=".75" />
          <path d="M-50 -20 L0 -45 L50 -20 L0 5 Z" fill={c} opacity=".5" />
        </g>
      )}
      {kind === 'cyl' && (
        <g>
          <rect x="-42" y="-40" width="84" height="90" fill={c} />
          <ellipse cx="0" cy="50" rx="42" ry="14" fill={c} />
          <ellipse cx="0" cy="-40" rx="42" ry="14" fill="#fff" opacity=".55" />
          <ellipse cx="0" cy="-40" rx="42" ry="14" fill="none" stroke={c} strokeWidth="4" />
        </g>
      )}
      {kind === 'cone' && (
        <g>
          <path d="M0 -55 L46 48 A46 14 0 0 1 -46 48 Z" fill={c} />
          <path d="M0 -55 L46 48 A46 14 0 0 1 10 60 Z" fill="#000" opacity=".15" />
        </g>
      )}
      {kind === 'wedge' && (
        <g>
          <path d="M-55 50 L45 50 L45 -40 Z" fill={c} />
          <path d="M45 50 L65 34 L65 -56 L45 -40 Z" fill={c} opacity=".7" />
          <path d="M-55 50 L-35 34 L65 -56 L45 -40 Z" fill="#fff" opacity=".35" />
        </g>
      )}
    </g>
  );
}

/* shared — a flashcard showing one solid */
function IlCard({ kind, x, y, r = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x="-70" y="-90" width="140" height="180" rx="14" fill="#fff" stroke={INK} strokeWidth="5" />
      <rect x="-70" y="-90" width="140" height="26" rx="12" fill={IL_COL[kind]} />
      <IlSolid kind={kind} x={0} y={10} s={0.8} />
    </g>
  );
}

/* 1 — a student juggling cards of four problem types */
function ArtIlMix({ T }) {
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      {IL_KINDS.map((k, i) => {
        const p = ((T * 0.45 + i / 4) % 1);
        const a = p * TAU;
        const x = 486 + Math.cos(a) * 260, y = 960 + Math.sin(a) * 150 * (Math.cos(a) > 0 ? 1 : -1) * 0.6 - Math.sin(p * Math.PI) * 60;
        return <IlCard key={k} kind={k} x={x} y={y} r={p * 360} s={0.8} />;
      })}
      <IlPal x={486} y={1180} T={T} shirt="#E8C547" mouth="grin" look={osc(T, 2.2) * 12} />
      {[-1, 1].map((sd) => {
        const up = Math.abs(osc(T, 0.55, sd > 0 ? 0.5 : 0)) * 50;
        return (
          <g key={sd}>
            <line x1={486 + sd * 120} y1="1500" x2={486 + sd * 250} y2={1300 - up} stroke="#E8C547" strokeWidth="52" strokeLinecap="round" />
            <circle cx={486 + sd * 256} cy={1288 - up} r="34" fill={SKIN} />
          </g>
        );
      })}
      <rect x="0" y="1660" width="972" height="68" fill="#162B55" />
    </g>
  );
}

/* 2 — four kinds of solids on the desk; a measuring cup fills to find the volume */
function ArtIlSolids({ T }) {
  const fill = (T * 0.4) % 1;
  return (
    <g>
      <circle cx="486" cy="1220" r="430" fill="#DDD6C5" />
      <rect x="60" y="1400" width="852" height="40" rx="12" fill="#8B5E3C" />
      <rect x="100" y="1440" width="40" height="288" fill="#6E4A2F" />
      <rect x="832" y="1440" width="40" height="288" fill="#6E4A2F" />
      {IL_KINDS.map((k, i) => (
        <g key={k} transform={`translate(0 ${-Math.max(0, osc(T, 1.6, i * 0.25)) * 26})`}>
          <IlSolid kind={k} x={170 + i * 210} y={1150} s={1.5} />
        </g>
      ))}
      {IL_KINDS.map((k, i) => <ellipse key={k} cx={170 + i * 210} cy="1240" rx="70" ry="12" fill="#B9B09C" opacity=".6" />)}
      <g transform="translate(700 1300)">
        <path d="M-60 -60 L-60 90 Q-60 100 -50 100 L50 100 Q60 100 60 90 L60 -60" fill="#fff" opacity=".6" stroke={INK} strokeWidth="6" />
        <rect x="-56" y={96 - fill * 140} width="112" height={fill * 140} fill="#5B8FD6" opacity=".8" />
        {[0, 1, 2, 3].map((k) => <line key={k} x1="30" y1={70 - k * 34} x2="56" y2={70 - k * 34} stroke={INK} strokeWidth="4" />)}
      </g>
      <g transform="translate(260 1340) rotate(-6)">
        <rect x="-150" y="-20" width="300" height="40" rx="6" fill="#E8C547" />
        {Array.from({ length: 12 }, (_, k) => <line key={k} x1={-140 + k * 25} y1="-20" x2={-140 + k * 25} y2={k % 2 ? -6 : 2} stroke={INK} strokeWidth="4" />)}
      </g>
    </g>
  );
}

/* 3 — blocked practice: rows of the same card, a pencil ticking along row by row */
function ArtIlBlocks({ T }) {
  const p = (T * 0.35) % 1;
  const row = Math.floor(p * 4), col = Math.floor((p * 4 - row) * 4);
  return (
    <g>
      <circle cx="486" cy="1180" r="430" fill="#9E1B24" />
      {IL_KINDS.map((k, r) => [0, 1, 2, 3].map((c) => {
        const done = r < row || (r === row && c <= col);
        return (
          <g key={k + c}>
            <IlCard kind={k} x={210 + c * 140} y={830 + r * 150} s={0.66} />
            {done && <path d={`M${232 + c * 140} ${854 + r * 150} l14 14 l26 -30`} fill="none" stroke="#49B07A" strokeWidth="10" strokeLinecap="round" />}
          </g>
        );
      }))}
      <g transform={`translate(${250 + col * 140} ${880 + row * 150 + osc(T, 0.3) * 6}) rotate(30)`}>
        <rect x="-10" y="-100" width="20" height="100" rx="6" fill="#E8C547" />
        <path d="M-10 0 L0 26 L10 0 Z" fill={SKIN2} />
      </g>
      <IlPal x={790} y={1330} T={T} shirt="#2B6E7A" mouth="smile" look={-14} s={0.78} />
    </g>
  );
}

/* 4 — the same cards, riffle-shuffled together */
function ArtIlShuffle({ T }) {
  const cyc = (T * 0.6) % 1;
  const mix = Easing.easeInOutSine(Math.min(1, cyc * 1.6));
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#D9B53A" />
      {Array.from({ length: 8 }, (_, i) => {
        const kind = IL_KINDS[i % 4];
        const side = i % 2 ? 1 : -1;
        const x = 486 + side * 200 * (1 - mix) + (hsh(i) - 0.5) * 30 * mix;
        const y = 1160 - i * 16 * mix - (1 - mix) * Math.floor(i / 2) * 18 + Math.sin(mix * Math.PI) * -80 * (i / 8);
        return <IlCard key={i} kind={kind} x={x} y={y} r={side * 14 * (1 - mix) + (hsh(i + 3) - 0.5) * 16 * mix} s={0.9} />;
      })}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <ellipse cx={486 + sd * 260 * (1 - mix * 0.4)} cy="1290" rx="70" ry="52" fill={SKIN} />
          <rect x={486 + sd * 260 * (1 - mix * 0.4) - 40} y="1300" width="80" height="420" rx="36" fill={sd > 0 ? '#1F3B73' : '#B3202A'} />
        </g>
      ))}
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${340 + k * 140} 960 q20 -30 40 0`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" opacity={Math.sin(mix * Math.PI) * 0.8} />
      ))}
    </g>
  );
}

/* shared — a score bar labelled with a percentage */
function IlBar({ x, base, h, col, label, labelCol = CREAM }) {
  return (
    <g>
      <rect x={x - 80} y={base - h} width="160" height={h} rx="14" fill={col} />
      <text x={x} y={base - h - 24} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="64" fill={labelCol}>{label}</text>
    </g>
  );
}

/* 5 — during practice: blocked 89% looks great, shuffled 60% looks worse */
function ArtIlPractice({ T, t }) {
  const g = tw(t, 0.3, 1.0);
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#1D4E57" />
      <rect x="120" y="1500" width="732" height="14" rx="7" fill={CREAM} />
      <IlBar x={330} base={1500} h={560 * 0.89 * g} col="#E8C547" label={`${Math.round(89 * g)}%`} />
      <IlBar x={640} base={1500} h={560 * 0.6 * g} col="#E07A2E" label={`${Math.round(60 * g)}%`} />
      <g transform={`translate(330 ${1500 - 560 * 0.89 * g - 150}) rotate(${T * 40}) scale(${g})`}>
        <path d="M0 -40 L11 -12 L40 -12 L17 6 L25 36 L0 18 L-25 36 L-17 6 L-40 -12 L-11 -12 Z" fill="#FFE07A" />
      </g>
      <text x="330" y="1580" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>BLOCKED</text>
      <text x="640" y="1580" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>SHUFFLED</text>
      {[0, 1, 2].map((i) => <IlCard key={i} kind="cube" x={250 + i * 80} y={1660} r={(i - 1) * 4} s={0.5} />)}
      {['cone', 'cyl', 'wedge'].map((k, i) => <IlCard key={k} kind={k} x={560 + i * 80} y={1660 + osc(T, 1.4, i * 0.3) * 6} r={(i - 1) * 10} s={0.5} />)}
    </g>
  );
}

/* 6 — a week later: the calendar flips, shuffled 63% beats blocked 20% */
function ArtIlTest({ T, t }) {
  const g = tw(t, 0.6, 1.0);
  const flip = (T * 2) % 1;
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#D26E25" />
      <g transform="translate(486 790)">
        <rect x="-90" y="-60" width="180" height="150" rx="14" fill="#fff" />
        <rect x="-90" y="-60" width="180" height="40" rx="14" fill="#B3202A" />
        <text x="0" y="60" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="64" fill={INK}>+7</text>
        <rect x="-90" y="-20" width="180" height={110 * (1 - flip)} fill="#F4F1EA" opacity={1 - flip} />
      </g>
      <rect x="120" y="1440" width="732" height="14" rx="7" fill={CREAM} />
      <IlBar x={330} base={1440} h={500 * 0.2 * g} col="#E8C547" label={`${Math.round(20 * g)}%`} />
      <IlBar x={640} base={1440} h={500 * 0.63 * g} col="#2B6E7A" label={`${Math.round(63 * g)}%`} />
      <text x="330" y="1500" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={CREAM}>BLOCKED</text>
      <text x="640" y="1500" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={CREAM}>SHUFFLED</text>
      <IlPal x={330} y={1530} T={T} shirt="#E8C547" mouth="sad" s={0.48} look={8} />
      <IlPal x={640} y={1530} T={T} ph={0.4} shirt="#2B6E7A" mouth="grin" s={0.48} />
      {g > 0.9 && [0, 1, 2, 3, 4, 5].map((k) => {
        const a = (k / 6) * TAU + T;
        return <circle key={k} cx={640 + Math.cos(a) * 140} cy={1440 - 315 - 170 + Math.sin(a) * 40} r="10" fill={['#E8C547', '#B3202A', CREAM][k % 3]} />;
      })}
    </g>
  );
}

/* 7 — a cone problem: three method cards, the student must pick the right one */
function ArtIlChoose({ T }) {
  const cyc = T % 3;
  const pick = Math.min(2, Math.floor(cyc));
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#5A3290" />
      <g transform="translate(486 880)">
        <rect x="-150" y="-110" width="300" height="220" rx="18" fill="#fff" />
        <IlSolid kind="cone" x={-50} y={10} s={1.3} />
        <text x="70" y="40" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="110" fill={INK}>?</text>
      </g>
      {['cube', 'cyl', 'cone'].map((k, i) => {
        const x = 240 + i * 246;
        const on = i === pick;
        const right = on && k === 'cone';
        return (
          <g key={k} transform={`translate(${x} ${1170 - (on ? 30 : 0)})`}>
            <circle r="96" fill={right ? '#49B07A' : on ? '#8259BD' : '#4E2C7A'} />
            <IlSolid kind={k} x={0} y={0} s={1} />
            {right && <path d="M40 60 l16 18 l32 -36" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />}
          </g>
        );
      })}
      <g transform={`translate(${240 + pick * 246 + osc(T, 0.5) * 6} 1300)`}>
        <ellipse cx="0" cy="0" rx="40" ry="32" fill={SKIN} />
        <rect x="-10" y="-60" width="22" height="60" rx="10" fill={SKIN} />
        <rect x="-36" y="20" width="72" height="300" rx="30" fill="#E8C547" />
      </g>
      <IlPal x={760} y={1380} T={T} shirt="#E07A2E" mouth="flat" look={-12} s={0.7} />
      {[0, 1, 2].map((k) => <circle key={k} cx={700 - k * 30} cy={1360 - k * 40} r={6 + k * 4} fill={CREAM} opacity={0.4 + 0.5 * Math.abs(osc(T, 1, k * 0.2))} />)}
    </g>
  );
}

/* 8 — tonight: a desk lamp, a mixed fan of flashcards, a student giving a thumbs-up */
function ArtIlDeck({ T }) {
  return (
    <g>
      <circle cx="486" cy="1230" r="430" fill="#264684" />
      <rect x="690" y="760" width="200" height="200" rx="12" fill="#162B55" />
      <circle cx="790" cy="850" r="40" fill="#F2E6B8" />
      <circle cx="808" cy="838" r="36" fill="#162B55" />
      <g transform="translate(220 1260)">
        <path d="M-60 140 L60 140 L40 120 L-40 120 Z" fill={INK} />
        <line x1="0" y1="120" x2="40" y2="-20" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <line x1="40" y1="-20" x2="130" y2="-60" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <path d="M100 -100 L200 -60 L160 -10 Z" fill="#E8C547" />
        <polygon points="180,-40 330,180 120,180 160,-10" fill="#FFE07A" opacity={0.18 + 0.05 * osc(T, 1.2)} />
      </g>
      <rect x="60" y="1440" width="852" height="40" rx="12" fill="#8B5E3C" />
      {['wedge', 'cyl', 'cube', 'cone', 'cyl', 'wedge', 'cube'].map((k, i) => (
        <IlCard key={i} kind={k} x={486 + (i - 3) * 70} y={1350 + Math.abs(i - 3) * 10} r={(i - 3) * 9 + osc(T, 2.2, i * 0.1) * 2} s={0.75} />
      ))}
      <g transform={`translate(0 ${osc(T, 1.8) * 6})`}>
        <IlPal x={760} y={1080} T={T} shirt="#B3202A" mouth="grin" s={0.82} look={-10} />
        <g transform={`translate(640 ${1210 + osc(T, 0.7) * 8})`}>
          <rect x="-30" y="-6" width="60" height="56" rx="18" fill={SKIN} />
          <rect x="-12" y="-46" width="22" height="50" rx="10" fill={SKIN} />
        </g>
      </g>
    </g>
  );
}

Object.assign(window, { ArtIlMix, ArtIlSolids, ArtIlBlocks, ArtIlShuffle, ArtIlPractice, ArtIlTest, ArtIlChoose, ArtIlDeck });
