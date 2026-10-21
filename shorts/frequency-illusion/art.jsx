// art.jsx — scene illustrations for "Frequency Illusion" (Arnold Zwicky, 2005). Pure functions of T.
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

const FONT = { fontFamily: 'Montserrat, sans-serif', fontWeight: 900 };
const WORD = 'QUOKKA';
const pop = (t, s) => MOTION.pop(clamp((t - s) / 0.4, 0, 1));

/* shared — a person: head centred at (x, y), torso below */
function FiPerson({ x, y, T, ph = 0, shirt = '#B3202A', hair = INK, skin = SKIN, neck = SKIN2, look = 0, glasses = null, mouth = 'smile' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-175 600 C-175 280 -105 205 0 205 C105 205 175 280 175 600 Z" fill={shirt} />
      <rect x="-34" y="90" width="68" height="135" rx="26" fill={neck} />
      <circle cx="-108" cy="10" r="24" fill={neck} />
      <circle cx="108" cy="10" r="24" fill={neck} />
      <ellipse cx="0" cy="0" rx="108" ry="120" fill={skin} />
      <path d="M-110 -10 C-118 -104 -50 -128 0 -128 C72 -128 120 -96 110 -16 C80 -60 40 -70 0 -66 C-46 -70 -86 -48 -110 -10 Z" fill={hair} />
      <Eye cx={-40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      <Eye cx={40} cy={4} T={T} ph={ph} rx={19} ry={18} look={look} />
      {glasses && (
        <g fill="none" stroke={INK} strokeWidth="8">
          <circle cx="-40" cy="4" r="32" fill={glasses} fillOpacity=".25" />
          <circle cx="40" cy="4" r="32" fill={glasses} fillOpacity=".25" />
          <line x1="-8" y1="2" x2="8" y2="2" />
        </g>
      )}
      {mouth === 'smile' && <path d="M-30 54 q30 26 60 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="0" cy="60" rx="15" ry="19" fill={INK} />}
      <ellipse cx="-66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
      <ellipse cx="66" cy="44" rx="20" ry="10" fill="#E8907A" opacity=".55" />
    </g>
  );
}

/* shared — side-view car, origin at bottom centre */
function FiCar({ x, y, c, s = 1, glow = 0, T = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow > 0 && <ellipse cx="0" cy="-60" rx={150 + 8 * osc(T, 0.6)} ry="100" fill="#FFE27A" opacity={0.45 * glow} />}
      <path d="M-120 -30 L-120 -70 Q-118 -90 -90 -94 L-60 -96 L-30 -140 Q-24 -148 -10 -148 L50 -148 Q64 -148 72 -138 L100 -96 Q124 -92 124 -70 L124 -30 Z" fill={c} />
      <path d="M-20 -136 L-46 -98 L10 -98 L10 -136 Z M24 -136 L24 -98 L84 -98 L62 -136 Z" fill="#CFE6F0" opacity=".9" />
      <rect x="100" y="-84" width="22" height="14" rx="5" fill="#FFE27A" />
      {[-70, 74].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy="-28" r="28" fill={INK} />
          <circle cx={wx} cy="-28" r="11" fill="#9EA3AD" />
        </g>
      ))}
    </g>
  );
}

/* 1 — reader learns a new word; it pops up on a billboard, a phone, a mug */
function ArtFiWord({ T, t }) {
  const bob = osc(T, 2.2) * 5;
  const spots = [[250, 820, 0.9, -6], [760, 940, 1.5, 7], [200, 1180, 2.1, -4]];
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#264684" />
      <FiPerson x={486} y={1290 + bob} T={T} shirt="#E07A2E" skin="#E7B48F" neck="#B97A55" look={-6} mouth="o" />
      <g transform={`translate(486 ${1560 + bob}) rotate(${osc(T, 2.6) * 2})`}>
        <path d="M-230 -110 L0 -84 L0 120 L-230 96 Z" fill={CREAM} />
        <path d="M230 -110 L0 -84 L0 120 L230 96 Z" fill="#FFF7E6" />
        <rect x="-4" y="-86" width="8" height="208" fill="#C9C0AE" />
        <text x="115" y="-10" textAnchor="middle" {...FONT} fontSize="44" fill="#B3202A" textLength="190" lengthAdjust="spacingAndGlyphs">{WORD}</text>
        {[0, 1, 2].map((k) => <rect key={k} x="30" y={18 + k * 26} width={170 - k * 30} height="10" rx="5" fill="#C9C0AE" />)}
        {[0, 1, 2, 3].map((k) => <rect key={k} x="-200" y={-40 + k * 30} width={170 - (k % 2) * 40} height="10" rx="5" fill="#C9C0AE" />)}
        <ellipse cx="-236" cy="20" rx="46" ry="36" fill="#E7B48F" />
        <ellipse cx="236" cy="20" rx="46" ry="36" fill="#E7B48F" />
      </g>
      {spots.map(([x, y, s, rot], i) => {
        const p = pop(t, s);
        return (
          <g key={i} transform={`translate(${x} ${y + osc(T, 1.6, i * 0.3) * 8}) rotate(${rot}) scale(${p})`} opacity={p > 0 ? 1 : 0}>
            {i === 0 && <g><rect x="-10" y="40" width="20" height="120" fill={INK} /><rect x="-150" y="-70" width="300" height="130" rx="12" fill="#E8C547" stroke={INK} strokeWidth="8" /></g>}
            {i === 1 && <g><rect x="-90" y="-150" width="180" height="300" rx="28" fill={INK} /><rect x="-74" y="-120" width="148" height="240" rx="14" fill="#9AD8FF" /></g>}
            {i === 2 && <g><path d="M70 -40 q60 0 56 44 q-4 40 -56 36" fill="none" stroke={CREAM} strokeWidth="18" /><rect x="-90" y="-80" width="160" height="160" rx="20" fill={CREAM} /></g>}
            <text x={i === 2 ? -10 : 0} y="12" textAnchor="middle" {...FONT} fontSize="40" fill="#B3202A" textLength={i === 0 ? 240 : 130} lengthAdjust="spacingAndGlyphs">{WORD}</text>
          </g>
        );
      })}
    </g>
  );
}

/* 2 — you buy a red car; now red cars light up one by one */
function ArtFiCars({ T, t }) {
  const back = [[170, '#9EA3AD'], [486, '#B3202A'], [802, '#3C6E9E']];
  const front = [[170, '#B3202A'], [802, '#B3202A']];
  const hits = [[486, 1100, 1.8], [170, 1520, 2.4], [802, 1520, 3.0]];
  const glowOf = (x, y) => { const h = hits.find((q) => q[0] === x && q[1] === y); return h ? tw(t, h[2], 0.3) : 0; };
  return (
    <g>
      <circle cx="486" cy="1240" r="420" fill="#DDD6C5" />
      <rect x="0" y="1100" width="972" height="20" fill="#BDB6A6" />
      <rect x="0" y="1520" width="972" height="208" fill="#55565E" />
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={k * 220 - (T * 60) % 220} y="1612" width="120" height="14" rx="7" fill={CREAM} />)}
      {back.map(([x, c], i) => <FiCar key={i} x={x} y={1100} s={0.85} c={c} glow={glowOf(x, 1100)} T={T} />)}
      {front.map(([x, c], i) => <FiCar key={i} x={x} y={1520} s={0.85} c={c} glow={glowOf(x, 1520)} T={T} />)}
      <g transform={`translate(0 ${-Math.abs(osc(T, 0.9)) * 6})`}>
        <FiCar x={486} y={1500} s={1.25} c="#B3202A" />
        <g transform={`translate(486 1240) scale(${pop(t, 0.4)})`}>
          <rect x="-90" y="-40" width="180" height="70" rx="16" fill={INK} />
          <text x="0" y="12" textAnchor="middle" {...FONT} fontSize="40" fill={CREAM}>MINE</text>
          <path d="M-14 30 L0 52 L14 30 Z" fill={INK} />
        </g>
      </g>
      {hits.map(([x, y, s], i) => {
        const p = pop(t, s);
        return <circle key={i} cx={x} cy={y - 70} r={140 * p} fill="none" stroke="#B3202A" strokeWidth="10" opacity={p > 0 ? 0.9 : 0} />;
      })}
    </g>
  );
}

/* 3 — linguist Arnold Zwicky with dictionary and magnifier, 2005 tag */
function ArtFiLinguist({ T, t }) {
  const sway = osc(T, 2.4) * 3;
  const mag = osc(T, 1.8) * 14;
  const tag = pop(t, 0.2);
  return (
    <g>
      <circle cx="486" cy="1220" r="420" fill="#8E151D" />
      <g transform={`rotate(${sway} 486 1700)`}>
        <FiPerson x={486} y={1130} T={T} ph={0.4} shirt="#2B6E7A" hair="#B8B2A6" skin="#F4CDB0" neck="#D7A07C" glasses="#9AD8FF" />
        <path d="M410 1190 Q486 1260 562 1190 Q550 1250 486 1262 Q422 1250 410 1190 Z" fill="#B8B2A6" />
        <g transform="translate(486 1500) rotate(-4)">
          <rect x="-190" y="-120" width="380" height="250" rx="16" fill="#1F3B73" />
          <rect x="-170" y="-104" width="340" height="218" rx="10" fill="#264684" />
          <text x="0" y="-12" textAnchor="middle" {...FONT} fontSize="46" fill="#E8C547" textLength="300" lengthAdjust="spacingAndGlyphs">DICTIONARY</text>
          <text x="0" y="62" textAnchor="middle" {...FONT} fontSize="40" fill={CREAM}>A–Z</text>
          <ellipse cx="-196" cy="10" rx="40" ry="34" fill="#D7A07C" />
        </g>
        <g transform={`translate(${690 + mag * 0.4} ${1360 + mag})`}>
          <line x1="40" y1="60" x2="110" y2="150" stroke={INK} strokeWidth="26" strokeLinecap="round" />
          <circle r="80" fill="#CFE6F0" fillOpacity=".55" stroke={INK} strokeWidth="16" />
          <path d="M-40 -30 q20 -24 46 -24" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="110" cy="150" rx="40" ry="34" fill="#D7A07C" />
        </g>
      </g>
      <g transform={`translate(250 ${850 + osc(T, 1.4) * 8}) rotate(${-8 + osc(T, 2) * 4}) scale(${tag})`} opacity={tag > 0 ? 1 : 0}>
        <rect x="-110" y="-56" width="220" height="112" rx="18" fill="#E8C547" />
        <circle cx="-80" cy="0" r="12" fill="#8E151D" />
        <text x="16" y="24" textAnchor="middle" {...FONT} fontSize="66" fill={INK}>2005</text>
      </g>
    </g>
  );
}

/* 4 — brain filter: matching words drop through into a tally, misses fade away */
function ArtFiFilter({ T, t }) {
  const items = [0, 1, 2, 3, 4, 5];
  const count = Math.floor(Math.max(0, t - 0.8) / 0.9);
  const br = 1 + osc(T, 2.2) * 0.015;
  return (
    <g>
      <circle cx="486" cy="1200" r="420" fill="#CFAE34" />
      <g transform={`translate(486 900) scale(${br})`}>
        {[[-90, 10, 90], [0, -30, 100], [90, 10, 90], [-50, 70, 80], [60, 70, 84]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#F4A7B9" />)}
        {['M-110 -10 q30 -30 60 0', 'M10 -80 q16 40 56 20', 'M-40 60 q40 30 80 0', 'M80 30 q-20 30 20 50'].map((d) => <path key={d} d={d} fill="none" stroke="#D9778F" strokeWidth="11" strokeLinecap="round" />)}
        <Eye cx={-40} cy={20} T={T} rx={20} ry={18} look={osc(T, 1.5) * 6} />
        <Eye cx={40} cy={20} T={T} rx={20} ry={18} look={osc(T, 1.5) * 6} />
      </g>
      <path d="M250 1100 L722 1100 L540 1300 L540 1400 L432 1400 L432 1300 Z" fill={CREAM} stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      <path d="M300 1100 L672 1100" stroke="#B3202A" strokeWidth="10" opacity={0.5 + 0.5 * Math.abs(osc(T, 0.8))} />
      {items.map((i) => {
        const p = ((T * 0.55 + i / items.length) % 1);
        const hit = i % 2 === 0;
        const x = 300 + hsh(i) * 372;
        if (hit) {
          const y = 1030 + p * 520;
          const xx = x + (486 - x) * Math.min(1, p * 2);
          return <text key={i} x={xx} y={y} textAnchor="middle" {...FONT} fontSize="36" fill="#B3202A" opacity={p > 0.92 ? (1 - p) * 12 : 1}>{WORD}</text>;
        }
        const side = x < 486 ? -1 : 1;
        return <text key={i} x={x + side * p * 260} y={1050 + p * 160 - p * p * 200} textAnchor="middle" {...FONT} fontSize="32" fill="#6B6656" opacity={Math.max(0, 0.8 - p * 1.1)}>word</text>;
      })}
      <g transform={`translate(486 1560) scale(${1 + 0.06 * Math.exp(-(((t - 0.8) % 0.9) * 8))})`}>
        <rect x="-150" y="-60" width="300" height="140" rx="26" fill={INK} />
        <rect x="-120" y="-36" width="240" height="92" rx="14" fill="#2B6E7A" />
        <text x="0" y="40" textAnchor="middle" {...FONT} fontSize="72" fill="#E8C547">{String(count).padStart(3, '0')}</text>
        <rect x="160" y="-40" width="40" height="40" rx="8" fill="#B3202A" />
      </g>
    </g>
  );
}

/* 5 — lights come on: the red cars were always there */
function ArtFiAlways({ T, t }) {
  const on = tw(t, 1.2, 0.5);
  const cars = [[160, 1180, '#B3202A'], [486, 1180, '#3C6E9E'], [812, 1180, '#B3202A'], [160, 1560, '#9EA3AD'], [486, 1560, '#B3202A'], [812, 1560, '#B3202A']];
  return (
    <g>
      <circle cx="486" cy="1240" r="420" fill="#1D4E57" />
      <rect x="0" y="1180" width="972" height="20" fill="#174049" />
      <rect x="0" y="1560" width="972" height="168" fill="#33444A" />
      {[120, 852].map((lx, i) => (
        <g key={lx}>
          <polygon points={`${lx},860 ${lx - 200},1560 ${lx + 200},1560`} fill="#FFE27A" opacity={0.22 * on * (0.9 + 0.1 * osc(T, 0.3, i))} />
          <rect x={lx - 8} y="840" width="16" height="720" fill={INK} />
          <rect x={lx - 40} y="826" width="80" height="34" rx="12" fill={INK} />
          <ellipse cx={lx} cy="864" rx="30" ry="10" fill={on > 0.05 ? '#FFE27A' : '#4A5A5E'} />
        </g>
      ))}
      {cars.map(([x, y, c], i) => <FiCar key={i} x={x} y={y} s={0.82} c={c} T={T} glow={c === '#B3202A' ? tw(t, 1.9 + (i % 3) * 0.12, 0.3) : 0} />)}
      <rect x="0" y="700" width="972" height="1028" fill="#06161A" opacity={0.6 * (1 - on)} />
      <g transform={`translate(486 860) rotate(${-4 + osc(T, 2) * 2}) scale(${pop(t, 2.2)})`} opacity={t > 2.2 ? 1 : 0}>
        <rect x="-190" y="-50" width="380" height="100" rx="22" fill="#E8C547" />
        <text x="0" y="20" textAnchor="middle" {...FONT} fontSize="52" fill={INK}>ALWAYS HERE</text>
      </g>
    </g>
  );
}

/* 6 — person with glowing glasses and brain; the world beside them is unchanged */
function ArtFiBrain({ T, t }) {
  const glow = 0.5 + 0.5 * Math.abs(osc(T, 1.2));
  const check = tw(t, 2.6, 0.4);
  return (
    <g>
      <circle cx="486" cy="1220" r="420" fill="#D26E25" />
      <FiPerson x={330} y={1210} T={T} shirt="#1F3B73" hair="#3A1A14" skin="#C98A62" neck="#A86E4B" glasses="#FFE27A" look={8} />
      <g transform={`translate(330 ${960 + osc(T, 1.6) * 8}) scale(${0.5 + 0.5 * tw(t, 0.2, 0.6)})`}>
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <line key={a} x1="0" y1="-100" x2="0" y2="-130" stroke="#FFE27A" strokeWidth="10" strokeLinecap="round" opacity={0.3 + 0.7 * Math.abs(osc(T, 1, i * 0.17))} transform={`rotate(${a})`} />
        ))}
        {[[-36, 0, 50], [16, -20, 56], [44, 20, 46], [-6, 30, 46]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#F4A7B9" />)}
        <path d="M-40 -6 q24 -20 46 0 M10 26 q20 -18 40 4" fill="none" stroke="#D9778F" strokeWidth="9" strokeLinecap="round" />
      </g>
      <g transform="translate(-3 0)">
        {[-1, 1].map((s) => <circle key={s} cx={330 + s * 40} cy={1214} r={44} fill="#FFE27A" opacity={0.3 * glow} />)}
      </g>
      <g transform={`translate(720 1360) rotate(${T * 6})`}>
        <circle r="150" fill="#2B6E7A" />
        <path d="M-90 -80 q40 -30 80 10 q20 40 -30 60 q-50 10 -50 -70 Z M30 30 q60 -20 90 30 q-20 70 -80 60 q-30 -40 -10 -90 Z M40 -120 q40 0 60 30 q-40 10 -60 -30 Z" fill="#7BB662" />
      </g>
      <g transform={`translate(720 1580) scale(${MOTION.pop(check)})`} opacity={check > 0 ? 1 : 0}>
        <rect x="-110" y="-44" width="220" height="88" rx="20" fill={CREAM} />
        <text x="0" y="18" textAnchor="middle" {...FONT} fontSize="48" fill={INK}>SAME</text>
      </g>
    </g>
  );
}

/* 7 — big scanning eyes, comment bubbles popping */
function ArtFiEyes({ T, t }) {
  const look = osc(T, 1.6) * 46;
  const b = blink(T, 0.5);
  const bubbles = [[210, 840, 2.4, 'I SAW IT!'], [770, 900, 3.2, 'AGAIN!'], [250, 1560, 4.0, '+1']];
  return (
    <g>
      <circle cx="486" cy="1220" r="420" fill="#5A3290" />
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${486 + s * 150} 1210)`}>
          <ellipse rx="130" ry={150 * b} fill="#fff" stroke={INK} strokeWidth="12" />
          <circle cx={look} cy={osc(T, 2.3) * 16} r={58 * Math.min(1, b * 1.6)} fill={INK} />
          <circle cx={look + 20} cy={osc(T, 2.3) * 16 - 22} r={16 * b} fill="#fff" />
          <path d={`M-120 ${-170 + osc(T, 1.6) * 6} q120 -60 240 0`} fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" />
        </g>
      ))}
      {bubbles.map(([x, y, s, txt], i) => {
        const p = pop(t, s);
        return (
          <g key={i} transform={`translate(${x} ${y + osc(T, 1.3, i * 0.4) * 8}) scale(${p})`} opacity={p > 0 ? 1 : 0}>
            <rect x="-130" y="-56" width="260" height="104" rx="30" fill={CREAM} />
            <path d="M-50 44 L-70 90 L-10 44 Z" fill={CREAM} />
            <text x="0" y="16" textAnchor="middle" {...FONT} fontSize="44" fill="#6A3FA0">{txt}</text>
          </g>
        );
      })}
      <g transform={`translate(740 1540) scale(${pop(t, 5.2)})`} opacity={t > 5.2 ? 1 : 0}>
        <circle r="70" fill="#E8C547" />
        <path d="M-30 0 H30 M0 -30 V30" stroke={INK} strokeWidth="16" strokeLinecap="round" />
      </g>
    </g>
  );
}

Object.assign(window, { ArtFiWord, ArtFiCars, ArtFiLinguist, ArtFiFilter, ArtFiAlways, ArtFiBrain, ArtFiEyes });
