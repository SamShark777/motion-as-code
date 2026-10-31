// art.jsx — "The Reverse of Stockholm Syndrome" (Rosa ep. 2 with Milo + June, ted-MG motion graphics).
// Lima syndrome: named after the 1996–97 Japanese embassy hostage crisis in Lima (600+ hostages taken 17 Dec 1996,
// hundreds released within weeks). One case, not lab studies — the script says so.
// Full 1080×1920 frames with tedmg-kit.jsx. Props: T, t, dur, beats. Caption band y ≈ 1370–1590 (capY lines move it).
(function () {
const { AMB: A, RED: R, INK: K, CREAM: CR, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BEB = "'Bebas Neue', sans-serif", OSW = "'Oswald', sans-serif";
const ROOM = { c1: '#3b2f4f', c2: '#1f1830' };
const mmss = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

/* escape-room set: brick wall, clue board, shelf with a chest, the locked door (open 0..1) */
function Set({ T, open = 0, dim = 0 }) {
  return (<g>
    <MGBg kind="wall" {...ROOM} />
    {[...Array(9)].map((_, r) => [...Array(7)].map((_, c) => <rect key={r + '-' + c} x={-60 + c * 180 + (r % 2) * 90} y={140 + r * 110} width="170" height="100" rx="6" fill="#4a3a5e" opacity={0.35 + 0.2 * hsh(r * 7 + c)} />))}
    <g transform="translate(250 560)"><rect x="-170" y="-200" width="340" height="320" rx="10" fill="#c9a27a" stroke={K} strokeWidth="7" />
      {[[-90, -110, '#f4efe4'], [50, -90, A], [-60, 20, '#8fd0f2'], [80, 40, '#f4efe4']].map(([x, y, c], i) => <g key={i}><rect x={x - 55} y={y - 45} width="110" height="90" fill={c} stroke={K} strokeWidth="5" transform={`rotate(${(i % 2 ? 6 : -5)} ${x} ${y})`} /><circle cx={x} cy={y - 40} r="9" fill={R} /></g>)}
      <path d="M-90 -110 L50 -90 L-60 20 L80 40" stroke={R} strokeWidth="5" fill="none" /></g>
    <g transform="translate(790 470)"><rect x="-210" y="-140" width="420" height="300" rx="12" fill="#2a2036" stroke={K} strokeWidth="9" />
      <g transform={`translate(-210 -140) scale(${1 - 0.85 * open} 1)`}><rect x="0" y="0" width="420" height="300" rx="12" fill="#7a4a32" stroke={K} strokeWidth="9" />
        {[60, 150, 240].map((y) => <rect key={y} x="20" y={y - 18} width="380" height="10" rx="5" fill="#5e3826" />)}
        <g transform="translate(330 150)"><path d="M-30 -10 L-30 -40 A30 30 0 0 1 30 -40 L30 -10" fill="none" stroke="#c9c9c9" strokeWidth="12" /><rect x="-44" y="-12" width="88" height="70" rx="10" fill={A} stroke={K} strokeWidth="6" /><circle cx="0" cy="18" r="9" fill={K} /></g></g>
      {open > 0.2 && <MGGlow x={0} y={20} r={300} col="#fff3c4" a={0.5 * open} />}</g>
    <rect x="-300" y="1250" width="1680" height="800" fill="#241b2e" /><rect x="-300" y="1250" width="1680" height="10" fill="#fff" opacity="0.05" />
    {dim > 0 && <rect x="-300" y="-300" width="1680" height="2520" fill="#05030a" opacity={dim} />}
  </g>);
}
/* big countdown chip */
const Clock = ({ y = 250, left, t, col = A }) => <MGChip x={540} y={y} text={`ESCAPE ROOM · ${mmss(left)} LEFT`} size={44} col={col} pop={t / 0.25} />;

/* 1 — Rosa, game master, keys on a ring; the clock starts */
function LHook({ T, t, beats }) {
  const c = b(beats, 3, 1.5);
  return (<g><Set T={T} />
    <MGBust x={540} y={900} r={220} who="rosa" brow="up" mouth={t > c ? 'grin' : 'smile'} look={[0.3, 0]} bl={BL(T)} />
    <g transform={`translate(${830 + OS(T, 1.3) * 6} 1180) rotate(${OS(T, 1.7) * 12})`}><circle r="46" fill="none" stroke="#d6d6d6" strokeWidth="12" />
      {[0, 1, 2].map((i) => <g key={i} transform={`rotate(${60 + i * 40}) translate(0 70)`}><rect x="-10" y="-30" width="20" height="70" rx="6" fill={A} stroke={K} strokeWidth="4" /><circle cy="-38" r="18" fill={A} stroke={K} strokeWidth="4" /></g>)}</g>
    <Clock left={3600 - Math.max(0, t) * 3} t={t} />
    <MGChip x={540} y={360} text="GAME MASTER · DAY 1" outline size={36} pop={(t - 0.2) / 0.25} /></g>);
}

/* 2 — Rule one: no hints (clipboard) */
function LRule({ T, t, beats }) {
  const c = b(beats, 2, 0.9);
  return (<g><Set T={T} dim={0.35} />
    <MGBust x={760} y={980} r={180} who="rosa" brow="angry" mouth="flat" look={[-0.5, 0]} bl={BL(T)} />
    <g transform={`translate(340 ${lp(1500, 760, EO((t - 0.1) / 0.4))}) rotate(-6)`}>
      <rect x="-210" y="-280" width="420" height="560" rx="18" fill="#a0764e" stroke={K} strokeWidth="8" />
      <rect x="-180" y="-240" width="360" height="490" rx="6" fill={CR} stroke={K} strokeWidth="5" /><rect x="-60" y="-300" width="120" height="50" rx="12" fill="#888" stroke={K} strokeWidth="6" />
      <text x="0" y="-160" textAnchor="middle" fontFamily={BEB} fontSize="64" fill={K}>RULE 1</text>
      <text x="0" y="-60" textAnchor="middle" fontFamily={BEB} fontSize="96" fill={R} opacity={SM(c - 0.1, c + 0.2, t)}>NO HINTS</text>
      {[0, 1, 2].map((i) => <rect key={i} x="-140" y={10 + i * 50} width={280 - i * 60} height="16" rx="8" fill="#c8bfae" />)}</g>
    <Clock left={3540} t={1} /></g>);
}

/* 3 — Milo talks about his speech; June shares her snacks (Rosa listening by the door) */
function LBond({ T, t, beats }) {
  const c3 = b(beats, 3, 2.0);
  return (<g><Set T={T} />
    <MGPerson x={260} y={1530} s={3.0} who="milo" brow="worried" mouth={Math.floor(T * 5) % 2 ? 'o' : 'flat'} look={[1, 0]} bl={BL(T)} />
    <MGPerson x={560} y={1540} s={3.0} who="june" brow="up" mouth="smile" look={[1, 0]} bl={BL(T, 0.5)} />
    <MGPerson x={860} y={1550} s={3.1} who="rosa" brow={t > c3 ? 'up' : 'flat'} mouth={t > c3 ? 'grin' : 'smile'} look={[-1, 0]} bl={BL(T, 1)} />
    <MGBubble x={300} y={760} text={'MY SPEECH IS|TOMORROW…'} size={44} k={(t - 0.3) / 0.3} />
    {t > c3 - 0.1 && <g transform={`translate(${lp(600, 720, EO((t - c3) / 0.5))} ${1080 + OS(T, 0.8) * 4}) rotate(-12)`}>
      <path d="M-50 -70 L50 -70 L60 70 L-60 70 Z" fill={R} stroke={K} strokeWidth="6" /><rect x="-55" y="-80" width="110" height="20" fill={A} stroke={K} strokeWidth="5" />
      <text y="20" textAnchor="middle" fontFamily={BEB} fontSize="42" fill="#fff">CHIPS</text></g>}
    <Clock left={2880} t={1} /></g>);
}

/* 4 — minute twenty: Rosa leans in and whispers the code */
function LAnswers({ T, t, beats }) {
  const c = b(beats, 3, 1.4);
  return (<g><Set T={T} dim={0.45} />
    <MGBust x={420} y={980} r={240} who="rosa" brow="worried" mouth="o" look={[1, -0.2]} bl={BL(T)} blush={1} />
    {t > c - 0.1 && <MGBubble x={760} y={640} text={'PSST…|4 · 7 · 1 · 9'} size={58} k={(t - c + 0.1) / 0.3} />}
    {[0, 1, 2].map((i) => <path key={i} d={`M${700 + i * 26} ${880 - i * 10} q20 20 0 40`} stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" opacity={0.5 + 0.5 * OS(T, 0.6, i / 3)} />)}
    <Clock left={2400 - Math.max(0, t) * 2} t={t} col="#ff8a7a" /></g>);
}

/* 5 — minute thirty: the door swings open */
function LDoor({ T, t, beats }) {
  const c = b(beats, 3, 1.4), o = EO((t - c + 0.2) / 0.6), w = SM(c, c + 2.2, t);
  return (<g><Set T={T} open={o} />
    <MGPerson x={lp(380, 700, w)} y={1530} s={2.6} who="milo" walk={w * 14} brow="up" mouth="grin" look={[1, 0]} bl={BL(T)} />
    <MGPerson x={lp(160, 520, w)} y={1540} s={2.6} who="june" walk={w * 14 + 1} brow="up" mouth="grin" look={[1, 0]} bl={BL(T, 0.4)} />
    <MGPerson x={930} y={1560} s={2.9} who="rosa" brow="up" mouth="smile" look={[-1, 0]} bl={BL(T, 1)} />
    <Clock left={1800} t={1} col="#ff8a7a" />
    {t > c && <MGRing cx={790} cy={480} rx={260} ry={200} p={(t - c) / 0.45} />}</g>);
}

/* 6 — Stockholm vs the reverse: the arrow of attachment flips */
function LReverse({ T, t, beats }) {
  const c = b(beats, 4, 2.4), f = EO((t - c + 0.1) / 0.45), L = (x, label, who) => (<g>
    <MGHead x={x} y={840} r={130} who={who} brow="flat" mouth="flat" look={[(540 - x) / 400, 0]} bl={BL(T, x / 300)} />
    <MGChip x={x} y={1060} text={label} size={40} col={label === 'CAPTOR' ? '#ff8a7a' : A} pop={(t - 0.2) / 0.25} /></g>);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={260} text={f > 0.5 ? 'LIMA SYNDROME' : 'STOCKHOLM SYNDROME'} size={52} pop={1} />
    {L(240, 'HOSTAGE', MG.extra(3))}{L(840, 'CAPTOR', MG.extra(6))}
    <g transform={`translate(540 840) scale(${1 - 2 * f} 1)`}>
      <path d="M-170 0 L120 0" stroke={R} strokeWidth="26" strokeLinecap="round" /><path d="M170 0 L100 -50 L100 50 Z" fill={R} />
      <path d="M-30 -60 C-50 -90 -95 -70 -30 -20 C35 -70 -10 -90 -30 -60 Z" fill={R} transform="translate(30 -10)" /></g></g>);
}

/* 7 — Lima, December 1996: the residence, a counter to 600+ */
function LLima({ T, t, beats }) {
  const c = b(beats, 3, 1.6), n = Math.round(600 * SM(c - 0.6, c + 0.2, t));
  return (<g><MGBg kind="street" T={T} />
    <rect x="-300" y="-300" width="1680" height="2520" fill="#05030a" opacity="0.35" />
    <g transform="translate(540 1150)"><rect x="-380" y="-360" width="760" height="360" fill="#e9e1cf" stroke={K} strokeWidth="9" />
      <path d="M-420 -360 L0 -520 L420 -360 Z" fill="#b5523e" stroke={K} strokeWidth="9" strokeLinejoin="round" />
      {[-280, -140, 0, 140, 280].map((x, i) => <rect key={i} x={x - 45} y="-300" width="90" height="120" fill={(Math.floor(T * 2) + i) % 3 ? '#ffcf73' : '#2a3354'} stroke={K} strokeWidth="6" />)}
      <rect x="-60" y="-150" width="120" height="150" fill="#5e3826" stroke={K} strokeWidth="7" /></g>
    <MGChip x={540} y={240} text="LIMA, PERU · 17 DEC 1996" outline size={42} pop={t / 0.25} />
    <MGBigNum y={1480} text={(n >= 600 ? '600+' : String(n))} size={200} col={n >= 600 ? A : '#fff'} label="HOSTAGES" /></g>);
}

/* 8 — released: the grid of hostages lights up as they walk free; a heart on a captor */
function LReleased({ T, t, beats }) {
  const c = b(beats, 2, 1.2), on = 15 * SM(0.1, c + 0.3, t), h = EO((t - b(beats, 3, 2.0)) / 0.4);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={250} text="WITHIN WEEKS" outline size={44} pop={t / 0.25} />
    <MGHeadGrid T={T} on={on} y0={520} dy={190} />
    {on > 0.5 && <MGChip x={540} y={1300} text="HUNDREDS RELEASED" size={48} pop={(t - c) / 0.25} />}
    {h > 0 && <g transform={`translate(880 380) scale(${BK(h)})`}><MGHead x={0} y={0} r={80} who={MG.extra(6)} brow="up" mouth="smile" bl={BL(T)} />
      <path d="M0 -12 C-26 -50 -75 -20 0 34 C75 -20 26 -50 0 -12 Z" fill={R} stroke={K} strokeWidth="5" transform="translate(70 -80) scale(0.7)" /></g>}</g>);
}

/* 9 — name it, with the honest caveat stamped on */
function LName({ T, t, beats }) {
  const c = b(beats, 3, 1.6);
  return (<g><MGBg kind="dark" /><MGGlow x={540} y={640} r={600} col="#ff8a7a" a={0.12} />
    <MGChip x={540} y={240} text="PSYCHOLOGY" size={44} pop={t / 0.25} />
    <MGTitle lines={[['LIMA', '#fff', 220], ['SYNDROME', A, 150]]} y={520} a={SM(0, 0.4, t)} />
    <MGBust x={540} y={1180} r={150} who="rosa" brow="up" mouth="smile" look={[0, -0.6]} bl={BL(T)} />
    {t > c && <g transform={`translate(540 920) rotate(-6) scale(${BK((t - c) / 0.3)})`}>
      <rect x="-330" y="-60" width="660" height="120" rx="14" fill="none" stroke="#ff8a7a" strokeWidth="10" />
      <text y="22" textAnchor="middle" fontFamily={BEB} fontSize="64" fill="#ff8a7a">ONE CASE · NOT A LAB STUDY</text></g>}</g>);
}

/* 10 — payoff: the manager looks at the clock; Rosa shrugs, Milo and June wave from the hall */
function LPayoff({ T, t, beats }) {
  const c = b(beats, 3, 1.6);
  return (<g><Set T={T} open={1} />
    <MGPerson x={250} y={1540} s={3.2} who={MG.extra(5)} brow="angry" mouth="o" look={[1, 0]} bl={BL(T)} />
    <MGPerson x={620} y={1550} s={3.2} who="rosa" brow="up" mouth={t > c ? 'grin' : 'wave'} look={[-1, 0]} bl={BL(T, 0.6)} />
    {[0, 1].map((i) => <MGHead key={i} x={720 + i * 140} y={470 + OS(T, 0.7, i / 2) * 8} r={56} who={i ? 'june' : 'milo'} brow="up" mouth="grin" bl={BL(T, i)} />)}
    <Clock left={1800} t={1} col="#ff8a7a" />
    {t < c && <MGBubble x={300} y={820} text="30 MINUTES LEFT?" size={44} k={(t - 0.2) / 0.3} />}
    {t > c && <MGBubble x={640} y={850} text="THEY WERE NICE!" size={48} k={(t - c) / 0.3} />}</g>);
}

Object.assign(window, { LHook, LRule, LBond, LAnswers, LDoor, LReverse, LLima, LReleased, LName, LPayoff });
})();
