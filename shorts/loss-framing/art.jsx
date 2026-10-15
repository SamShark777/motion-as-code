// art.jsx — scene illustrations for "Same Facts Frame" (framing effect, Tversky & Kahneman 1981). Pure functions of T.
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



/* shared — a person: head centred at (x, y), torso below */
function LfPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'smile', look = 0, s = 1, brow = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={SKIN2} />
      <circle cx="-108" cy="10" r="24" fill={SKIN2} />
      <circle cx="108" cy="10" r="24" fill={SKIN2} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <line x1="-62" y1={-28 + brow} x2="-18" y2={-34} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1="18" y1="-34" x2="62" y2={-28 + brow} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <Eye cx={-40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      <Eye cx={40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      {mouth === 'smile' && <path d="M-32 52 q32 28 64 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'flat' && <line x1="-26" y1="60" x2="26" y2="60" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      <ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — a grid of 60 little people (each one stands for 10 of the 600); fillOf(i) picks colour */
function LfGrid({ x, y, T, fillOf, gap = 64, s = 1 }) {
  const out = [];
  for (let i = 0; i < 60; i++) {
    const c = i % 10, r = Math.floor(i / 10);
    const bob = osc(T, 1.8, hsh(i)) * 2;
    out.push(
      <g key={i} transform={`translate(${c * gap} ${r * gap * 1.25 + bob})`}>
        <circle cx="0" cy="-14" r="13" fill={fillOf(i)} />
        <path d="M-18 24 C-18 4 -10 0 0 0 C10 0 18 4 18 24 Z" fill={fillOf(i)} />
      </g>
    );
  }
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{out}</g>;
}

/* shared — a label pill */
function LfPill({ x, y, w = 340, fill = INK, ink = CREAM, text, size = 64 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y="-56" width={w} height="112" rx="56" fill={fill} />
      <text y={size * 0.36} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={size} fill={ink}>{text}</text>
    </g>
  );
}

/* 1 — two signs pull at one shopper: loud "don't miss out" vs calm "you could gain" */
function ArtLfMiss({ T }) {
  const pulse = 1 + 0.06 * Math.abs(osc(T, 0.5));
  const look = osc(T, 2.4) > 0 ? 14 : -14;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      <g transform={`translate(250 900) rotate(-6) scale(${pulse})`}>
        <rect x="-200" y="-90" width="400" height="180" rx="20" fill="#B3202A" stroke={CREAM} strokeWidth="8" />
        <text y="-8" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="56" fill={CREAM}>DON'T</text>
        <text y="56" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="56" fill={CREAM}>MISS OUT!</text>
      </g>
      {[0, 1, 2].map((k) => <line key={k} x1="40" y1={780 + k * 60} x2="0" y2={770 + k * 70} stroke="#E8C547" strokeWidth="9" strokeLinecap="round" opacity={Math.abs(osc(T, 0.5, k * 0.2))} />)}
      <g transform={`translate(722 ${920 + osc(T, 2.2) * 8}) rotate(5)`}>
        <rect x="-200" y="-90" width="400" height="180" rx="20" fill="#2B6E7A" stroke={CREAM} strokeWidth="8" />
        <text y="-8" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="50" fill={CREAM}>YOU COULD</text>
        <text y="56" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="56" fill={CREAM}>GAIN</text>
      </g>
      <LfPerson x={486} y={1330} T={T} shirt="#E8C547" mouth="o" look={look} brow={-8} />
      <g transform={`translate(486 ${1610 + osc(T, 1.3) * 6})`}>
        <rect x="-60" y="-100" width="120" height="200" rx="18" fill={INK} />
        <rect x="-48" y="-84" width="96" height="160" rx="8" fill="#5A7BD8" />
        <ellipse cx="-70" cy="20" rx="36" ry="30" fill={SKIN} />
        <ellipse cx="70" cy="20" rx="36" ry="30" fill={SKIN} />
      </g>
    </g>
  );
}

/* 2 — six hundred people (each icon = ten) facing an unusual disease */
function ArtLfDisease({ T, t }) {
  const a = tw(t, 0.1, 0.8);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#DDD6C5" />
      <g opacity={a}>
        <LfGrid x={198} y={1080} T={T} fillOf={() => '#1F3B73'} />
      </g>
      {[[200, 860, 0], [790, 900, 0.5], [700, 1640, 1.1]].map(([x, y, ph], i) => (
        <g key={i} transform={`translate(${x + osc(T, 2.4, ph) * 20} ${y + osc(T, 1.9, ph) * 16}) rotate(${T * 30 + i * 40})`}>
          <circle r="46" fill="#6A9A3A" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
            <g key={ang} transform={`rotate(${ang})`}>
              <line x1="0" y1="-46" x2="0" y2="-70" stroke="#6A9A3A" strokeWidth="8" />
              <circle cx="0" cy="-72" r="10" fill="#6A9A3A" />
            </g>
          ))}
          <circle cx="-14" cy="-10" r="10" fill="#8DBA5A" />
        </g>
      ))}
      <LfPill x={486} y={1610} w={300} fill={INK} text="600" size={80} />
    </g>
  );
}

/* 3 — "200 people will be saved": a third of the crowd lights up under a shield */
function ArtLfSaved({ T, t }) {
  const p = tw(t, 0.4, 1.0);
  const lit = Math.round(20 * p);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#9E1B24" />
      <g transform={`translate(486 ${930 + osc(T, 1.6) * 6}) scale(${0.8 + 0.2 * p})`} opacity={p}>
        <path d="M0 -120 L110 -80 C110 30 70 90 0 130 C-70 90 -110 30 -110 -80 Z" fill="#E8C547" />
        <path d="M-44 0 L-10 36 L50 -34" fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <LfGrid x={198} y={1130} T={T} fillOf={(i) => (i < lit ? '#E8C547' : '#6E1218')} />
      {p > 0.95 && [0, 1, 2, 3, 4, 5].map((k) => (
        <path key={k} d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill={CREAM}
          transform={`translate(${200 + k * 110} ${1090 + (k % 2) * 30}) scale(${0.5 + 0.7 * Math.abs(osc(T, 0.9, k * 0.17))})`} />
      ))}
      <LfPill x={486} y={1640} w={420} fill={CREAM} ink="#B3202A" text="200 SAVED" size={60} />
    </g>
  );
}

/* 4 — 72% vote for the "saved" plan: ballots drop into a box */
function ArtLfVote({ T, t }) {
  const n = Math.round(72 * tw(t, 0.1, 1.0));
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D9B53A" />
      <text x="486" y="950" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="200" fill={INK}>{n}%</text>
      {[0, 1, 2].map((k) => {
        const p = ((T * 0.8 + k / 3) % 1);
        return (
          <g key={k} transform={`translate(${486 + (k - 1) * 60} ${1110 + p * 220}) rotate(${(k - 1) * 12 + osc(T, 0.6, k) * 6})`} opacity={p < 0.85 ? 1 : (1 - p) / 0.15}>
            <rect x="-60" y="-80" width="120" height="160" rx="8" fill="#fff" stroke={INK} strokeWidth="5" />
            <path d="M-28 0 L-6 24 L32 -26" fill="none" stroke="#2B6E7A" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
      <rect x="250" y="1330" width="472" height="340" rx="20" fill="#1F3B73" />
      <rect x="250" y="1330" width="472" height="70" rx="20" fill="#2C4F92" />
      <rect x="350" y="1350" width="272" height="24" rx="12" fill={INK} />
      <text x="486" y="1560" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="64" fill={CREAM}>VOTE</text>
      {[[150, 0], [822, 0.3]].map(([x, ph], i) => (
        <g key={i} transform={`translate(${x} ${1380 + osc(T, 0.7, ph) * 16}) rotate(${osc(T, 0.7, ph) * 10})`}>
          <rect x="-24" y="20" width="48" height="140" rx="20" fill={i ? SKIN2 : SKIN} />
          <ellipse cx="0" cy="0" rx="44" ry="54" fill={i ? SKIN2 : SKIN} />
          {[-28, -10, 8, 26].map((fx) => <rect key={fx} x={fx - 8} y="-86" width="16" height="50" rx="8" fill={i ? SKIN2 : SKIN} />)}
        </g>
      ))}
    </g>
  );
}

/* 5 — same outcome, worded as "400 people will die": the other two-thirds go grey */
function ArtLfDie({ T, t }) {
  const p = tw(t, 0.4, 1.0);
  const grey = Math.round(40 * p);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#24606B" />
      <LfGrid x={198} y={1060} T={T} fillOf={(i) => (i >= 60 - grey ? '#3E4A52' : CREAM)} />
      <g transform={`translate(486 ${880 + osc(T, 2) * 6})`}>
        <circle cx="-70" cy="10" r="60" fill="#3E4A52" />
        <circle cx="10" cy="-20" r="80" fill="#3E4A52" />
        <circle cx="90" cy="16" r="56" fill="#3E4A52" />
        <rect x="-130" y="10" width="276" height="62" rx="31" fill="#3E4A52" />
        {[-80, -20, 40, 100].map((dx, k) => {
          const q = ((T * 1.1 + k * 0.27) % 1);
          return <line key={dx} x1={dx} y1={90 + q * 60} x2={dx - 8} y2={110 + q * 60} stroke="#9AD8FF" strokeWidth="8" strokeLinecap="round" opacity={1 - q} />;
        })}
      </g>
      {[0, 1, 2].map((k) => {
        const q = ((T * 0.3 + k / 3) % 1);
        return <circle key={k} cx={300 + k * 190} cy={1600 - q * 120} r={30 + q * 30} fill={CREAM} opacity={0.12 * (1 - q)} />;
      })}
      <LfPill x={486} y={1640} w={400} fill={INK} text="400 DIE" size={64} />
    </g>
  );
}

/* 6 — identical pictures in two different frames: 72% vs 22% */
function ArtLfFrame({ T, t }) {
  const sw = tw(t, 0.3, 0.6);
  const frames = [[260, '#E8C547', 'SAVED', 72], [712, INK, 'DIE', 22]];
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#D26E25" />
      {frames.map(([x, fc, word, pct], i) => (
        <g key={i} transform={`rotate(${(i ? 4 : -4) + osc(T, 2.4, i * 0.5) * 2} ${x} 1180)`}>
          <rect x={x - 200} y="900" width="400" height="500" rx="10" fill={fc} />
          <rect x={x - 168} y="932" width="336" height="436" fill={CREAM} />
          {Array.from({ length: 15 }).map((_, k) => (
            <circle key={k} cx={x - 120 + (k % 5) * 60} cy={1010 + Math.floor(k / 5) * 90} r="20" fill={k < 5 ? '#2B6E7A' : '#9EA3AD'} />
          ))}
          <text x={x} y="1320" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="56" fill={i ? INK : '#2B6E7A'}>{word}</text>
          <text x={x} y="1530" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="110" fill={i ? INK : CREAM} opacity={sw}>{Math.round(pct * sw)}%</text>
        </g>
      ))}
      <text x="486" y={1200 + osc(T, 1) * 8} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="120" fill={CREAM}>=</text>
      <LfPill x={486} y={1660} w={520} fill="#6A3FA0" text="SAME FACTS" size={56} />
    </g>
  );
}

/* 7 — a phone ad shouts "don't miss out"; one person grabs, one shrugs */
function ArtLfAds({ T }) {
  const flash = osc(T, 0.6) > 0;
  const secs = 59 - (Math.floor(T) % 60);
  return (
    <g>
      <circle cx="486" cy="1180" r="420" fill="#7B4FB3" />
      <g transform={`translate(486 ${1060 + osc(T, 2) * 8}) rotate(${osc(T, 2.6) * 2})`}>
        <rect x="-190" y="-320" width="380" height="640" rx="44" fill={INK} />
        <rect x="-166" y="-290" width="332" height="580" rx="22" fill={CREAM} />
        <rect x="-166" y="-240" width="332" height="140" fill={flash ? '#B3202A' : '#E07A2E'} />
        <text y="-188" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>DON'T</text>
        <text y="-132" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={CREAM}>MISS OUT!</text>
        <rect x="-110" y="-70" width="220" height="150" rx="14" fill="#E8C547" />
        <path d="M-50 40 L0 -40 L50 40 Z" fill="#B3202A" opacity=".8" />
        <text y="150" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="60" fill={INK}>0:{secs < 10 ? `0${secs}` : secs}</text>
        <rect x="-120" y="190" width="240" height="70" rx="35" fill="#B3202A" />
        <text y="238" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="38" fill={CREAM}>BUY NOW</text>
      </g>
      <LfPerson x={170} y={1500} T={T} s={0.55} shirt="#E8C547" mouth="o" look={12} brow={-10} />
      <line x1="240" y1="1650" x2={330 + osc(T, 0.4) * 14} y2="1480" stroke="#E8C547" strokeWidth="36" strokeLinecap="round" />
      <LfPerson x={802} y={1500} T={T} ph={0.8} s={0.55} shirt="#2B6E7A" mouth="flat" look={-6} skin={SKIN2} hair="#5A3A22" />
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${802 + sd * 110} ${1600 - Math.abs(osc(T, 1.6)) * 20})`}>
          <line x1="0" y1="60" x2={sd * 40} y2="-20" stroke="#2B6E7A" strokeWidth="30" strokeLinecap="round" />
          <circle cx={sd * 44} cy="-28" r="18" fill={SKIN2} />
        </g>
      ))}
    </g>
  );
}

/* 8 — flip the frame: the card turns from "don't miss out" to "I could gain…" */
function ArtLfFlip({ T }) {
  const ang = (T * 0.5) % 1;
  const sx = Math.cos(ang * TAU);
  const front = sx >= 0;
  return (
    <g>
      <circle cx="486" cy="1250" r="430" fill="#264684" />
      <g transform={`translate(486 1000) scale(${Math.max(0.04, Math.abs(sx))} 1)`}>
        <rect x="-260" y="-150" width="520" height="300" rx="28" fill={front ? '#B3202A' : '#2B6E7A'} stroke={CREAM} strokeWidth="10" />
        <text y="-16" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="66" fill={CREAM}>{front ? "DON'T" : 'I COULD'}</text>
        <text y="70" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="66" fill={CREAM}>{front ? 'MISS OUT' : 'GAIN…'}</text>
      </g>
      <path d="M220 820 q-60 180 40 300" fill="none" stroke="#E8C547" strokeWidth="12" strokeLinecap="round" />
      <path d="M244 1130 l20 -12 l-22 -14" fill="none" stroke="#E8C547" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M752 1180 q60 -180 -40 -300" fill="none" stroke="#E8C547" strokeWidth="12" strokeLinecap="round" />
      <path d="M728 870 l-20 12 l22 14" fill="none" stroke="#E8C547" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <LfPerson x={486} y={1420} T={T} s={0.8} shirt="#E07A2E" mouth={front ? 'flat' : 'smile'} look={osc(T, 1.6) * 8} brow={front ? -6 : 0} />
      <text x={760} y={1380 + osc(T, 1.2) * 10} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="140" fill={CREAM} opacity=".85">?</text>
    </g>
  );
}

Object.assign(window, { ArtLfMiss, ArtLfDisease, ArtLfSaved, ArtLfVote, ArtLfDie, ArtLfFrame, ArtLfAds, ArtLfFlip });
