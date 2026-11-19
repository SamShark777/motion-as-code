// art.jsx — "Why You Hate Photos of Yourself" (Rosa ep. 8, with June; ted-MG motion graphics).
// Mere exposure + mirror images: Mita, Dermer & Knight 1977 (JPSP) — women preferred mirror-reversed prints of their own
// face, their close friends preferred the true prints. No invented numbers on screen.
// Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480 — faces and labels stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, osc, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GOOD = '#5fbf7a', PAPER = '#fbf7ee', GLASS = '#bfe3ef';

/* Rosa's face with a beauty mark on her left cheek, so a flip is visible; flip = -1..1 (scaleX) */
function RosaFace({ x, y, r, flip = 1, ...f }) {
  return (<g transform={`translate(${x} ${y}) scale(${flip} 1)`}>
    <MGHead x={0} y={0} r={r} who="rosa" {...f} />
    <circle cx={-r * 0.5} cy={r * 0.38} r={r * 0.045} fill={K} />
  </g>);
}
/* instant photo: heads = [[who, dx, mood]] (who 'rosa' uses RosaFace) */
function Photo({ x, y, s = 1, rot = 0, label = '', heads, T = 0, flip = 1, lc = K, bg = '#3d2756' }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-250" y="-280" width="500" height="560" rx="14" fill={PAPER} stroke={K} strokeWidth="9" />
    <rect x="-215" y="-245" width="430" height="400" rx="6" fill={bg} stroke={K} strokeWidth="6" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-180 + i * 90} cy={-215} r="9" fill={['#ffcf5a', '#ff6f91', '#7fd6ff', '#b6ff7a', '#ffcf5a'][i]} />)}
    {heads.map(([who, dx, mood], i) => (who === 'rosa'
      ? <RosaFace key={i} x={dx} y={-30} r={78} flip={flip} brow={mood === 'sad' ? 'worried' : 'up'} mouth={mood === 'sad' ? 'wave' : 'grin'} bl={BL(T, i * 0.5)} />
      : <MGHead key={i} x={dx} y={-30} r={70} who={who} mouth="grin" brow="up" bl={BL(T, i * 0.5 + 0.2)} />))}
    {label && <text x="0" y="230" textAnchor="middle" fontFamily={BB} fontSize="64" letterSpacing="4" fill={lc}>{label}</text>}
  </g>);
}
function Heart({ x, y, s = 1, col = R }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 30 C-60 -10 -40 -60 0 -30 C40 -60 60 -10 0 30 Z" fill={col} stroke={K} strokeWidth="6" strokeLinejoin="round" />;
}
function Mirror({ x, y, w = 420, h = 560, children }) {
  return (<g><rect x={x - w / 2 - 22} y={y - h / 2 - 22} width={w + 44} height={h + 44} rx="40" fill="#b98e62" stroke={K} strokeWidth="9" />
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="24" fill={GLASS} stroke={K} strokeWidth="6" />
    <path d={`M${x - w / 2 + 40} ${y - h / 2 + 120} L${x - w / 2 + 120} ${y - h / 2 + 40} M${x - w / 2 + 40} ${y - h / 2 + 200} L${x - w / 2 + 200} ${y - h / 2 + 40}`} stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity="0.6" />
    {children}</g>);
}
function Check({ x, y, k = 1, ok = true }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}><circle r="52" fill={ok ? GOOD : R} stroke={K} strokeWidth="7" />
    {ok ? <path d="M-24 2 L-6 22 L26 -18" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      : <path d="M-20 -20 L20 20 M20 -20 L-20 20" stroke="#fff" strokeWidth="12" strokeLinecap="round" />}</g>);
}

/* 1 — the group photo pops up; Rosa recoils; a red DELETE button appears */
function MGGroupPhoto({ T, t, beats }) {
  const c2 = b(beats, 2, 0.8), c3 = b(beats, 3, 1.3);
  const k = EO(t / 0.45);
  return (<g><MGBg kind="party" T={T} />
    <MGBust x={250} y={1030} r={150} who="rosa" look={[0.8, -0.5]} brow="worried" mouth={t > c3 ? 'frown' : 'o'} bl={BL(T)} />
    <Photo x={680} y={lp(1300, 640, k)} rot={lp(14, 5, k)} s={0.95} T={T} heads={[[MG.extra(3), -130], ['rosa', 0, 'sad'], ['june', 130]]} />
    {t > c2 && <MGRing cx={690} cy={600} rx={120} ry={115} p={(t - c2) / 0.4} />}
    {t > c3 && <MGChip x={690} y={1110} text="DELETE?" col={R} txt="#fff" size={48} pop={(t - c3) / 0.25} />}
    <MGChip x={540} y={170} text="GROUP PHOTO · 11:42 PM" size={40} pop={t / 0.25} /></g>);
}

/* 2 — you too: the same photo, but friends' hearts pile up on it */
function MGFriendsPrefer({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <Photo x={540} y={720} s={1.15} rot={-3} T={T} heads={[[MG.extra(3), -130], ['rosa', 0], ['june', 130]]} />
    {[0, 1, 2, 3, 4].map((i) => { const kk = (t - c3 + 0.2 - i * 0.12) / 0.3; if (kk <= 0) return null;
      return <Heart key={i} x={[260, 820, 300, 800, 540][i]} y={[420, 380, 1100, 1120, 260][i] - EO(kk) * 30} s={BK(kk) * 1.2} />; })}
    {t > c3 && <MGChip x={540} y={1260} text="FRIENDS: LOVE IT" size={42} pop={(t - c3) / 0.25} />}
    <MGHead x={150} y={1730} r={90} who="june" look={[1, -0.6]} mouth="grin" brow="up" bl={BL(T, 0.4)} />
    <MGHead x={930} y={1730} r={90} who={MG.extra(5)} look={[-1, -0.6]} mouth="smile" bl={BL(T, 0.9)} /></g>);
}

/* 3 — snapback: Rosa at the mirror; on FLIPPED the reflection swings round (beauty mark jumps sides) */
function MGFlipped({ T, t, beats }) {
  const c3 = b(beats, 3, 1.3);
  const f = lp(-1, 1, SM(c3, c3 + 0.5, t));
  return (<g><MGBg kind="room" />
    <Mirror x={540} y={720} w={460} h={620}>
      <RosaFace x={540} y={700} r={170} flip={Math.abs(f) < 0.06 ? 0.06 : f} brow="worried" mouth="o" bl={BL(T)} />
    </Mirror>
    <g opacity={SM(c3 - 0.3, c3, t)}>
      <path d="M250 1170 Q540 1290 830 1170" stroke={A} strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M830 1170 l-50 -6 l26 44 Z M250 1170 l50 -6 l-26 44 Z" fill={A} />
    </g>
    <MGChip x={540} y={150} text={t > c3 + 0.3 ? 'REAL YOU' : 'MIRROR YOU'} size={44} col={t > c3 + 0.3 ? GOOD : A} pop={1} /></g>);
}

/* 4 — study 1977: two prints of the same woman slide in, TRUE and MIRRORED */
function MGTwoPrints({ T, t, beats }) {
  const c4 = b(beats, 4, 1.6);
  const k1 = EO(t / 0.45), k2 = EO((t - 0.35) / 0.45);
  const W1 = MG.extra(2);
  const face = (flip) => (<g><g transform={`scale(${flip} 1)`}><MGHead x={0} y={-30} r={110} who={W1} mouth="smile" bl={BL(T)} /><circle cx={-50} cy={20} r="6" fill={K} /></g></g>);
  const print = (x, k, flip, lab, hot) => (<g transform={`translate(${x} ${lp(1400, 760, k)}) rotate(${flip > 0 ? -4 : 4})`}>
    <rect x="-200" y="-250" width="400" height="500" rx="12" fill={PAPER} stroke={K} strokeWidth="8" />
    <rect x="-170" y="-220" width="340" height="340" rx="6" fill="#e8b33e" stroke={K} strokeWidth="6" />
    {face(flip)}
    <text x="0" y="200" textAnchor="middle" fontFamily={BB} fontSize="62" letterSpacing="4" fill={hot ? R : K}>{lab}</text></g>);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={200} text="STUDY · 1977" size={44} pop={t / 0.25} />
    {print(300, k1, 1, 'TRUE', false)}{print(780, k2, -1, 'MIRRORED', t > c4)}
    {t > c4 && <MGRing cx={780} cy={960} rx={200} ry={70} p={(t - c4) / 0.4} rot={-4} />}
    <text x="540" y="1250" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="40" letterSpacing="4" fill="#fff" opacity="0.7">SAME FACE · TWO PRINTS</text></g>);
}

/* 5 — the picks: she ticks MIRRORED, her friends tick TRUE */
function MGPicks({ T, t, beats }) {
  const c2 = b(beats, 2, 0.9), c4 = b(beats, 4, 1.6);
  const W1 = MG.extra(2);
  const mini = (x, flip, lab) => (<g transform={`translate(${x} 560)`}>
    <rect x="-170" y="-210" width="340" height="420" rx="12" fill={PAPER} stroke={K} strokeWidth="8" />
    <rect x="-145" y="-185" width="290" height="290" rx="6" fill="#e8b33e" stroke={K} strokeWidth="6" />
    <g transform="translate(0 -40)"><g transform={`scale(${flip} 1)`}><MGHead x={0} y={0} r={95} who={W1} mouth="smile" bl={BL(T)} /><circle cx={-44} cy={42} r="6" fill={K} /></g></g>
    <text x="0" y="165" textAnchor="middle" fontFamily={BB} fontSize="54" letterSpacing="4" fill={K}>{lab}</text></g>);
  return (<g><MGBg kind="navy" />
    {mini(300, 1, 'TRUE')}{mini(780, -1, 'MIRRORED')}
    <Check x={900} y={380} k={(t - 0.25) / 0.3} />
    <MGBust x={790} y={1060} r={95} who={W1} look={[0, -0.8]} mouth="smile" brow="up" bl={BL(T, 0.2)} />
    <text x="790" y="1290" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="38" letterSpacing="3" fill="#fff">SHE PICKS</text>
    {t > c2 && <g><Check x={420} y={380} k={(t - c4 + 0.2) / 0.3} />
      {[0, 1, 2].map((i) => <MGHead key={i} x={190 + i * 110} y={1080 + (i % 2) * 30} r={62} who={MG.extra(i + 6)} look={[0.2, -0.8]} mouth="grin" brow="up" bl={BL(T, i * 0.3)} />)}
      <text x="300" y="1290" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="38" letterSpacing="3" fill="#fff">FRIENDS PICK</text></g>}</g>);
}

/* 6 — name it: a mirror with tally marks piling up each day; the mirror face gets a heart */
function MGSeenMost({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0);
  const n = Math.min(24, Math.floor(t / 0.08));
  return (<g><MGBg kind="wall" c1="#2f3d5c" c2="#1a2238" />
    <Mirror x={540} y={640} w={400} h={520}>
      <RosaFace x={540} y={630} r={140} flip={-1} brow="up" mouth="smile" bl={BL(T)} />
    </Mirror>
    {[...Array(n)].map((_, i) => { const g = Math.floor(i / 5), j = i % 5, x = 170 + (g % 5) * 160 + j * 22, y = 1080 + Math.floor(g / 5) * 90;
      return j === 4 ? <line key={i} x1={x - 96} y1={y + 30} x2={x + 6} y2={y - 30} stroke={A} strokeWidth="9" strokeLinecap="round" />
        : <line key={i} x1={x} y1={y - 36} x2={x} y2={y + 36} stroke="#fff" strokeWidth="9" strokeLinecap="round" />; })}
    {t > c2 && <Heart x={780} y={380} s={BK((t - c2) / 0.3) * 1.4} />}
    <MGChip x={540} y={170} text="MERE EXPOSURE EFFECT" size={42} pop={(t - c2) / 0.25} /></g>);
}

/* 7 — self-proof: a phone, a thumb hits UNTAG on a photo */
function MGUntagged({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4);
  const press = SM(c3 - 0.25, c3, t);
  return (<g><MGBg kind="roomNight" />
    <g transform="translate(540 760) rotate(-4)">
      <rect x="-280" y="-520" width="560" height="1040" rx="64" fill="#18161d" stroke={K} strokeWidth="10" />
      <rect x="-250" y="-480" width="500" height="960" rx="40" fill="#f3efe8" />
      <rect x="-220" y="-430" width="440" height="440" rx="10" fill="#3d2756" />
      <MGHead x={0} y={-210} r={120} who={MG.extra(8)} brow="worried" mouth="wave" bl={BL(T)} />
      <text x="-220" y="60" fontFamily={OS} fontWeight="700" fontSize="34" fill="#1a1720">you were tagged in a photo</text>
      <rect x="-220" y="110" width="440" height="110" rx="55" fill={t > c3 ? R : '#d8d0c2'} stroke={K} strokeWidth="6" />
      <text x="0" y="184" textAnchor="middle" fontFamily={BB} fontSize="64" letterSpacing="4" fill={t > c3 ? '#fff' : K}>{t > c3 ? 'UNTAGGED' : 'UNTAG'}</text>
    </g>
    <MGArm x1={1150} y1={1900} x2={lp(760, 600, press)} y2={lp(1150, 940, press)} sleeve="#a46fd1" skin="#f2dccb" w={90} /></g>);
}

/* 8 — payoff: June shrugs, Rosa grins and saves the photo */
function MGKeepsIt({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c2 = b(beats, 2, 1.2);
  return (<g><MGBg kind="party" T={T} />
    <MGPerson x={330} y={1300} s={2.5} who="june" look={[1, -0.3]} mouth="grin" brow="up" bl={BL(T, 0.3)} />
    <MGPerson x={760} y={1300} s={2.5} who="rosa" look={[-1, -0.3]} mouth={t > c2 ? 'grin' : 'o'} brow={t > c2 ? 'up' : 'flat'} bl={BL(T)} />
    <MGBubble x={330} y={560} text={"THAT'S JUST|YOUR FACE"} k={(t - 0.1) / 0.3} size={46} />
    {t > c2 && <g><Photo x={760} y={420} s={0.55} rot={6} T={T} heads={[[MG.extra(3), -130], ['rosa', 0], ['june', 130]]} />
      <MGChip x={760} y={640} text="SAVED" col={GOOD} txt="#fff" size={40} pop={(t - c2) / 0.25} /></g>}
    {t > c1 && t < c2 && <MGRing cx={330} cy={480} rx={230} ry={110} p={(t - c1) / 0.4} />}</g>);
}

/* 9 — end: the mirror gets a LIAR stamp; Rosa grins beside it */
function MGEndMirror({ T, t, beats }) {
  const c1 = b(beats, 1, 0.5);
  const k = (t - c1) / 0.25;
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" />
    <Mirror x={420} y={680} w={420} h={560}>
      <RosaFace x={420} y={680} r={140} flip={-1} brow="flat" mouth="flat" bl={BL(T)} />
    </Mirror>
    {k > 0 && <g transform={`translate(420 700) rotate(-12) scale(${lp(1.6, 1, EO(k))})`} opacity={cl(k * 2)}>
      <rect x="-210" y="-70" width="420" height="140" rx="12" fill="none" stroke={R} strokeWidth="12" />
      <text x="0" y="42" textAnchor="middle" fontFamily={BB} fontSize="120" letterSpacing="10" fill={R}>LIAR</text></g>}
    <MGBust x={860} y={1040} r={120} who="rosa" look={[-0.8, -0.4]} brow="up" mouth="grin" bl={BL(T, 0.5)} />
    <MGChip x={540} y={150} text="MIRROR OR PHOTO?" size={44} pop={t / 0.25} /></g>);
}

Object.assign(window, { MGGroupPhoto, MGFriendsPrefer, MGFlipped, MGTwoPrints, MGPicks, MGSeenMost, MGUntagged, MGKeepsIt, MGEndMirror });
})();
