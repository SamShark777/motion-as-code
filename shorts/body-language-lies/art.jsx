// art.jsx — scene illustrations for "Crossed Arms Myth (lie detection, Bond & DePaulo 2006)". Pure functions of T.
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

/* shared — a person with crossed arms, drawn around (x, y) = top of the head */
function BlCrossed({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, mouth = 'flat', s = 1, look = 0, arms = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-160 520 C-160 320 -100 250 0 250 C100 250 160 320 160 520 Z" fill={shirt} />
      <rect x="-34" y="190" width="68" height="80" rx="24" fill={SKIN2} />
      <circle cx="0" cy="120" r="104" fill={skin} />
      <path d="M-104 112 C-110 30 -50 4 0 4 C62 4 112 34 104 104 C80 70 40 58 0 62 C-44 58 -84 76 -104 112 Z" fill={hair} />
      <Eye cx={-38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      <Eye cx={38} cy={128} T={T} ph={ph} rx={17} ry={17} look={look} />
      {mouth === 'smile' && <path d="M-30 176 q30 26 60 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'flat' && <path d="M-24 182 q12 -8 24 0 t24 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'line' && <line x1="-24" y1="180" x2="24" y2="180" stroke={INK} strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'open' && <ellipse cx="0" cy="182" rx="22" ry={14 + Math.abs(osc(T, 0.6)) * 8} fill="#3A0C10" />}
      <ellipse cx="-68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      <ellipse cx="68" cy="166" rx="18" ry="9" fill="#E8907A" opacity=".55" />
      {arms && (
        <g>
          <path d="M-150 340 Q-40 450 110 372" fill="none" stroke={INK} strokeWidth="84" strokeLinecap="round" opacity=".35" />
          <path d="M-150 340 Q-40 450 110 372" fill="none" stroke={shirt} strokeWidth="68" strokeLinecap="round" />
          <path d="M150 340 Q40 430 -110 392" fill="none" stroke={INK} strokeWidth="84" strokeLinecap="round" opacity=".35" />
          <path d="M150 340 Q40 430 -110 392" fill="none" stroke={shirt} strokeWidth="68" strokeLinecap="round" />
          <ellipse cx="96" cy="376" rx="32" ry="28" fill={skin} />
          <ellipse cx="-118" cy="392" rx="34" ry="30" fill={skin} />
        </g>
      )}
    </g>
  );
}

/* 1 — crossed arms, a question mark wobbling over the head */
function ArtBlArms({ T }) {
  return (
    <g>
      <circle cx="486" cy="1260" r="430" fill="#264684" />
      <g transform={`translate(0 ${osc(T, 2.2) * 4})`}>
        <BlCrossed x={486} y={1060} T={T} shirt="#E07A2E" />
      </g>
      <g transform={`translate(720 ${960 + osc(T, 1.1) * 14}) rotate(${osc(T, 1.8) * 12})`}>
        <circle r="90" fill="#E8C547" />
        <text y="48" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="140" fill={INK}>?</text>
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.7) % 2.1) / 2.1;
        return <circle key={k} cx={250 - p * 40} cy={1000 - p * 140} r={10 + k * 6} fill={CREAM} opacity={Math.sin(p * Math.PI) * 0.6} />;
      })}
    </g>
  );
}

/* 2 — four ordinary reasons light up in turn: cold, comfy, tired, habit */
function ArtBlReasons({ T, t }) {
  const on = Math.floor(t / 0.8) % 4;
  const shiver = on === 0 ? osc(T, 0.08) * 4 : 0;
  const spots = [[200, 920], [772, 920], [190, 1340], [782, 1340]];
  return (
    <g>
      <circle cx="486" cy="1260" r="430" fill="#DDD6C5" />
      <g transform={`translate(${shiver} 0)`}>
        <BlCrossed x={486} y={1080} T={T} shirt="#2B6E7A" mouth={on === 1 ? 'smile' : 'flat'} s={0.9} />
      </g>
      {spots.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${i === on ? 1.12 : 0.9})`} opacity={i === on ? 1 : 0.45}>
          <circle r="96" fill={i === on ? '#fff' : '#CFC7B4'} />
          {i === 0 && [0, 60, 120].map((a) => <line key={a} x1="0" y1="-56" x2="0" y2="56" stroke="#4A8FD0" strokeWidth="12" strokeLinecap="round" transform={`rotate(${a + T * 30})`} />)}
          {i === 1 && <g><rect x="-64" y="-6" width="128" height="44" rx="16" fill="#E07A2E" /><rect x="-56" y="-44" width="112" height="44" rx="16" fill="#E8A33D" /><rect x="-76" y="-20" width="24" height="58" rx="10" fill="#C9671F" /><rect x="52" y="-20" width="24" height="58" rx="10" fill="#C9671F" /></g>}
          {i === 2 && <g>{[0, 1, 2].map((k) => <text key={k} x={-30 + k * 22} y={30 - k * 26 + osc(T, 1.2, k * 0.2) * 4} fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize={40 + k * 10} fill="#6A3FA0">z</text>)}</g>}
          {i === 3 && <g transform={`rotate(${T * 90})`} fill="none" stroke="#B3202A" strokeWidth="12" strokeLinecap="round"><path d="M-46 0 A46 46 0 1 1 0 46" /><path d="M0 46 l-18 -10 M0 46 l-12 18" /></g>}
        </g>
      ))}
    </g>
  );
}

/* 3 — 206 studies: papers fly into one big stack, a crowd of tiny judges */
function ArtBlStudies({ T, t }) {
  const h = Math.min(14, 4 + Math.floor(t * 4));
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#9A1B24" />
      {Array.from({ length: h }).map((_, k) => (
        <rect key={k} x={386 + (hsh(k) - 0.5) * 30} y={1480 - k * 28} width="200" height="24" rx="4" fill={k % 2 ? '#fff' : CREAM} transform={`rotate(${(hsh(k + 5) - 0.5) * 6} 486 ${1492 - k * 28})`} />
      ))}
      {[0, 1, 2].map((k) => {
        const p = ((T * 0.8 + k / 3) % 1);
        const sx = k === 1 ? 900 : (k === 0 ? 60 : 860), sy = 820 + k * 40;
        const x = sx + (486 - sx) * p, y = sy + (1080 - sy) * p - Math.sin(p * Math.PI) * 120;
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${T * 200 + k * 90})`} opacity={1 - Math.max(0, p - 0.85) / 0.15}>
            <rect x="-50" y="-64" width="100" height="128" rx="8" fill="#fff" />
            {[0, 1, 2].map((r) => <rect key={r} x="-34" y={-40 + r * 26} width="68" height="9" rx="4" fill="#BDB6A6" />)}
          </g>
        );
      })}
      {Array.from({ length: 24 }).map((_, i) => {
        const c = i % 12, r = Math.floor(i / 12);
        const x = 80 + c * 74 + r * 36, y = 1620 + r * 60 + Math.abs(osc(T, 0.9, hsh(i))) * -8;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="22" fill={['#E8C547', CREAM, '#E07A2E', SKIN][i % 4]} />
            <path d={`M${x - 30} ${y + 70} Q${x - 30} ${y + 26} ${x} ${y + 26} Q${x + 30} ${y + 26} ${x + 30} ${y + 70} Z`} fill="#7A121A" />
          </g>
        );
      })}
    </g>
  );
}

/* 4 — a scoreboard gauge sweeps to 54% */
function ArtBlScore({ T, t }) {
  const v = 54 * tw(t, 0.3, 1.4);
  const a = -90 + v * 1.8 + osc(T, 0.4) * 1.2 * tw(t, 1.7, 0.2);
  return (
    <g>
      <circle cx="486" cy="1260" r="430" fill="#D4B23C" />
      <g transform="translate(486 1360)">
        <path d="M-300 0 A300 300 0 0 1 300 0" fill="none" stroke={CREAM} strokeWidth="70" />
        <path d="M-300 0 A300 300 0 0 1 0 -300" fill="none" stroke="#B3202A" strokeWidth="70" opacity=".35" />
        <path d="M0 -300 A300 300 0 0 1 300 0" fill="none" stroke="#2B6E7A" strokeWidth="70" opacity=".35" />
        {Array.from({ length: 11 }).map((_, i) => <rect key={i} x="-4" y="-356" width="8" height="26" rx="3" fill={INK} transform={`rotate(${-90 + i * 18})`} />)}
        <line x1="0" y1="0" x2="0" y2="-250" stroke={INK} strokeWidth="18" strokeLinecap="round" transform={`rotate(${a})`} />
        <circle r="34" fill={INK} />
        <text y="140" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="120" fill={INK}>{Math.round(v)}%</text>
        <text x="-300" y="70" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={INK}>0</text>
        <text x="300" y="70" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill={INK}>100</text>
      </g>
    </g>
  );
}

/* 5 — a coin flips between two hands: 50 / 50 */
function ArtBlCoin({ T }) {
  const p = (T % 1.4) / 1.4;
  const y = 1380 - Math.sin(p * Math.PI) * 420;
  const sq = Math.cos(T * 14);
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#235C66" />
      <ellipse cx="486" cy="1690" rx="300" ry="30" fill="#14363D" />
      <line x1="660" y1="1728" x2="560" y2="1500" stroke="#E07A2E" strokeWidth="80" strokeLinecap="round" />
      <ellipse cx="540" cy="1460" rx="80" ry="54" fill={SKIN} />
      <ellipse cx="470" cy="1440" rx="40" ry="22" fill={SKIN} transform={`rotate(${-30 + (p < 0.1 ? 20 : 0)} 470 1440)`} />
      <g transform={`translate(486 ${y}) scale(1 ${Math.max(0.08, Math.abs(sq))})`}>
        <circle r="90" fill={sq > 0 ? '#E8C547' : '#CFAE34'} />
        <circle r="70" fill="none" stroke="#A88A20" strokeWidth="8" />
        <text y="30" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="80" fill="#7A5E10">{sq > 0 ? 'H' : 'T'}</text>
      </g>
      {[[180, 'HEADS'], [792, 'TAILS']].map(([x, l], i) => (
        <g key={i} transform={`translate(${x} ${1100 + osc(T, 1.4, i * 0.5) * 10})`}>
          <rect x="-120" y="-60" width="240" height="120" rx="24" fill={CREAM} />
          <text y="-6" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="36" fill="#2B6E7A">{l}</text>
          <text y="44" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="44" fill={INK}>50%</text>
        </g>
      ))}
    </g>
  );
}

/* 6 — a crossed-arms photo pinned as "evidence", stamped NOT PROOF */
function ArtBlGesture({ T, t }) {
  const st = tw(t, 1.0, 0.25);
  const sc = 1 + (1 - st) * 1.5;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#C9671F" />
      <rect x="140" y="860" width="692" height="760" rx="20" fill="#8C6A48" />
      <rect x="170" y="890" width="632" height="700" rx="10" fill="#C9A26E" />
      <g transform={`rotate(${-4 + osc(T, 2.4) * 1.5} 486 1220)`}>
        <rect x="296" y="940" width="380" height="520" rx="8" fill="#fff" />
        <rect x="320" y="964" width="332" height="400" fill="#DDE6F0" />
        <g transform="translate(0 0)">
          <svg x="320" y="964" width="332" height="400" viewBox="0 0 332 400">
            <BlCrossed x={166} y={60} T={T} shirt="#1F3B73" s={0.62} />
          </svg>
        </g>
        <circle cx="486" cy="944" r="18" fill="#B3202A" />
      </g>
      <g transform={`translate(486 1440) rotate(-12) scale(${sc})`} opacity={st}>
        <rect x="-230" y="-66" width="460" height="132" rx="16" fill="none" stroke="#B3202A" strokeWidth="14" />
        <text y="28" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="76" fill="#B3202A">NOT PROOF</text>
      </g>
      {[[230, 1000], [740, 1100], [700, 1500]].map(([x, y], i) => (
        <text key={i} x={x} y={y + osc(T, 1.3, i * 0.3) * 8} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="70" fill={CREAM} opacity=".85">?</text>
      ))}
    </g>
  );
}

/* 7 — ask questions, check facts: notepad with ticks and a magnifier */
function ArtBlDetective({ T, t }) {
  const n = Math.min(3, Math.floor(t / 0.7));
  const talk = Math.abs(osc(T, 0.5));
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#5A3290" />
      {[0, 1].map((k) => <path key={k} d={`M${420 + k * 26} ${1010 - k * 20} q20 20 0 40`} fill="none" stroke={CREAM} strokeWidth="8" strokeLinecap="round" opacity={0.3 + 0.7 * talk} />)}
      <BlCrossed x={260} y={1170} T={T} shirt="#E8C547" mouth="open" s={0.8} look={8} arms={false} />
      <line x1="330" y1="1460" x2={420} y2={1330 + talk * 30} stroke="#E8C547" strokeWidth="48" strokeLinecap="round" />
      <circle cx="424" cy={1320 + talk * 30} r="28" fill={SKIN} />
      <g transform={`translate(330 ${930 + osc(T, 1.2) * 8})`}>
        <path d="M-90 -60 L90 -60 Q110 -60 110 -40 L110 40 Q110 60 90 60 L-20 60 L-60 100 L-50 60 L-90 60 Q-110 60 -110 40 L-110 -40 Q-110 -60 -90 -60 Z" fill={CREAM} />
        <text y="30" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="90" fill="#6A3FA0">?</text>
      </g>
      <g transform="rotate(5 700 1360)">
        <rect x="560" y="1100" width="290" height="400" rx="16" fill="#fff" />
        <rect x="560" y="1100" width="290" height="50" rx="16" fill="#B3202A" />
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x="590" y={1190 + k * 90} width="150" height="14" rx="7" fill="#BDB6A6" />
            {k < n && <path d={`M770 ${1196 + k * 90} l16 16 l30 -34`} fill="none" stroke="#2B6E7A" strokeWidth="10" strokeLinecap="round" />}
          </g>
        ))}
      </g>
      <g transform={`translate(${700 + osc(T, 2.2) * 60} ${1260 + osc(T, 1.6) * 40})`}>
        <circle r="74" fill="#fff" opacity=".3" />
        <circle r="74" fill="none" stroke={INK} strokeWidth="16" />
        <line x1="52" y1="52" x2="130" y2="130" stroke={INK} strokeWidth="26" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* 8 — myth bubbles grow and get popped by a pin */
function ArtBlMyths({ T }) {
  const cyc = T % 2.2;
  const grow = Math.min(1, cyc / 1.6);
  const popped = cyc > 1.6;
  const burst = popped ? (cyc - 1.6) / 0.6 : 0;
  return (
    <g>
      <circle cx="486" cy="1240" r="430" fill="#264684" />
      {!popped && (
        <g transform={`translate(560 ${1080 - grow * 40}) scale(${0.5 + grow * 0.5})`}>
          <circle r="170" fill="#E8C547" opacity=".9" />
          <path d="M-90 -90 A130 130 0 0 1 20 -150" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" opacity=".7" />
          <text y="30" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="88" fill={INK}>MYTH</text>
        </g>
      )}
      {popped && Array.from({ length: 10 }).map((_, i) => {
        const a = i / 10 * TAU;
        return <line key={i} x1={560 + Math.cos(a) * (60 + burst * 160)} y1={1040 + Math.sin(a) * (60 + burst * 160)} x2={560 + Math.cos(a) * (100 + burst * 200)} y2={1040 + Math.sin(a) * (100 + burst * 200)} stroke="#E8C547" strokeWidth="14" strokeLinecap="round" opacity={1 - burst} />;
      })}
      <BlCrossed x={260} y={1210} T={T} shirt="#B3202A" mouth={popped ? 'open' : 'smile'} s={0.8} look={10} arms={false} />
      <line x1="330" y1="1500" x2={390 + grow * 40} y2={1320 - grow * 30} stroke="#B3202A" strokeWidth="48" strokeLinecap="round" />
      <g transform={`translate(${400 + grow * 40} ${1250 - grow * 30}) rotate(37)`}>
        <rect x="-8" y="-10" width="16" height="140" rx="4" fill="#C9CCD3" />
        <circle cx="0" cy="130" r="30" fill="#E2453C" />
        <path d="M-6 -10 L0 -40 L6 -10 Z" fill="#C9CCD3" />
      </g>
    </g>
  );
}

Object.assign(window, { ArtBlArms, ArtBlReasons, ArtBlStudies, ArtBlScore, ArtBlCoin, ArtBlGesture, ArtBlDetective, ArtBlMyths });
