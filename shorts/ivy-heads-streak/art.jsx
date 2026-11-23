// art.jsx — "I Bet Tails After 6 Heads in a Row" (Ivy ep. 2, experiment log; Gus flips the coin).
// Gambler's fallacy: Tversky & Kahneman 1971 (Psychological Bulletin, "Belief in the law of small numbers"): people expect
// short random runs to look balanced. Monte Carlo Casino, 1913: black came up 26 times in a row. A fair coin is 50/50 every flip.
// Each scene draws ONLY the 1080×608 panel with xplog-kit.jsx; the engine draws the HUD and the caption.
(function () {
const { ACC: A, RED: R, INK: K, CREAM: C, NAVY: N, GREY: G, GREEN: GR, BLUE: BL, clamp: cl, eo: EO, back: BK, osc: OS, hsh, beat: B } = XL;
const blink = (T, ph = 0) => (((T + ph) % 3.4) > 3.26 ? 1 : 0);

/* a coin; spin = 0..1 flips it (squashes on Y), face 'H' | 'T' | '' */
function Coin({ x, y, r = 70, face = 'H', spin = 0, col = A }) {
  const sy = Math.max(0.08, Math.abs(Math.cos(spin * Math.PI * 6)));
  return (<g transform={`translate(${x} ${y}) scale(1 ${sy})`}>
    <circle r={r} fill="#D9A520" stroke={K} strokeWidth="7" transform="translate(0 8)" />
    <circle r={r} fill={col} stroke={K} strokeWidth="7" /><circle r={r * 0.78} fill="none" stroke="#D9A520" strokeWidth="5" />
    {sy > 0.45 && face && <XLText x={0} y={r * 0.34} size={r * 0.95} fill={K} anchor="middle">{face}</XLText>}</g>);
}
/* a row of results so far: n heads, slots up to tot */
function Row({ x, y, n, tot = 7, r = 34, gap = 84, at = [], t = 0 }) {
  return (<g>{[...Array(tot)].map((_, i) => i < n
    ? <g key={i} transform={`translate(${x + i * gap} ${y}) scale(${at[i] != null ? BK(cl((t - at[i]) / 0.34)) : 1})`}><Coin x={0} y={0} r={r} face="H" /></g>
    : <circle key={i} cx={x + i * gap} cy={y} r={r} fill="none" stroke={G} strokeWidth="5" strokeDasharray="10 8" />)}</g>);
}
/* bet slip */
function Slip({ x, y, text, rot = -4, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><XLCard x={-130} y={-70} w={260} h={140} r={14} />
    <XLText x={0} y={-22} size={24} fill={G} anchor="middle">YOUR BET</XLText><XLText x={0} y={40} size={52} fill={R} anchor="middle">{text}</XLText></g>);
}
/* roulette wheel, rotating; pockets alternate red/black, green zero */
function Wheel({ x, y, r = 230, T, ball = 0 }) {
  const n = 18, rot = T * 70;
  return (<g transform={`translate(${x} ${y})`}>
    <circle r={r + 26} fill="#6E4224" stroke={K} strokeWidth="9" />
    <g transform={`rotate(${rot})`}>{[...Array(n)].map((_, i) => { const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI;
      return <path key={i} d={`M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`} fill={i === 0 ? GR : i % 2 ? '#17131A' : R} stroke={K} strokeWidth="4" />; })}
      <circle r={r * 0.55} fill="#8A5A34" stroke={K} strokeWidth="7" /><circle r={r * 0.16} fill={A} stroke={K} strokeWidth="6" />
      <circle cx={r * 0.85 * Math.cos(((1.5) / n) * 2 * Math.PI)} cy={r * 0.85 * Math.sin(((1.5) / n) * 2 * Math.PI)} r="16" fill="#fff" stroke={K} strokeWidth="4" opacity={ball} /></g></g>);
}

/* 1 — Gus flips, Ivy watches; the coin lands heads */
function XIVCoin({ T, t, beats }) {
  const land = B(beats, 3, 1.6), u = cl(t / Math.max(0.4, land)), y = 330 - Math.sin(u * Math.PI) * 230;
  return (<g><XLBg kind="wall" />
    <XLChar x={230} y={300} s={0.95} who="ivy" mood={t > land ? 'wide' : 'neutral'} look={[18, -12]} bl={blink(T)} />
    <XLChar x={850} y={300} s={0.95} who="gus" mood="smile" look={[-18, -8]} bl={blink(T, 1.1)} />
    <Coin x={540} y={y} r={66} face="H" spin={t < land ? u : 0} />
    <XLPop t={t} at={land}><XLChip x={540} y={500} text="HEADS" fill={A} col={K} size={36} /></XLPop></g>);
}
/* 2 — Ivy close-up; three heads in a row; a glowing T in her head */
function XIVFeel({ T, t, beats }) {
  const b2 = B(beats, 2, 1);
  return (<g><XLBg kind="wallDark" />
    <XLChar x={300} y={330} s={1.15} who="ivy" mood="squint" look={[16, -10]} bl={blink(T, 0.4)} />
    <Row x={600} y={120} n={3} tot={3} r={40} gap={110} at={[0, 0.3, B(beats, 1, 0.6)]} t={t} />
    {t > b2 - 0.1 && <g><XLGlow x={790} y={380} r={180} col={A} a={0.55 * EO((t - b2 + 0.1) / 0.4)} />
      <XLWiggle T={T} amp={4}><Coin x={790} y={380} r={90} face="T" col="#FFE08A" /></XLWiggle>
      <XLText x={790} y={540} size={30} fill={A} anchor="middle">TAILS NEXT?</XLText></g>}</g>);
}
/* 3 — snapback: the coin is just metal; 1913 lands */
function XIVNothing({ T, t, beats }) {
  const b2 = B(beats, 2, 1.4);
  return (<g><XLBg kind="wallDark" />
    <Coin x={540} y={290} r={170} face="" />
    <XLText x={540} y={315} size={64} fill={K} anchor="middle">· · ·</XLText>
    <XLPop t={t} at={B(beats, 1, 0.5)}><XLChip x={540} y={530} text="NO MEMORY" size={34} /></XLPop>
    <XLPop t={t} at={b2}><XLStamp x={860} y={130} text="1913" size={58} rot={8} col={A} /></XLPop></g>);
}
/* 4 — heads #4; Ivy slides a TAILS bet across */
function XIVFour({ T, t, beats }) {
  return (<g><XLBg kind="wood" />
    <Row x={150} y={110} n={4} tot={7} r={38} gap={130} at={[-1, -1, -1, B(beats, 0, 0.2)]} t={t} />
    <XLChar x={230} y={400} s={0.85} who="ivy" mood="smile" look={[20, 0]} bl={blink(T)} />
    <XLRise t={t} at={B(beats, 1, 0.8)} dy={200}><Slip x={700} y={390} text="TAILS" /></XLRise></g>);
}
/* 5 — five heads: "due" — the bet doubles */
function XIVDue({ T, t, beats }) {
  const b2 = B(beats, 2, 1.2), k = EO((t - b2) / 0.4);
  return (<g><XLBg kind="wood" />
    <Row x={150} y={100} n={5} tot={7} r={38} gap={130} at={[-1, -1, -1, -1, 0.1]} t={t} />
    <XLChar x={220} y={400} s={0.85} who="ivy" mood="wide" look={[20, 0]} sweat bl={blink(T, 0.6)} />
    <Slip x={600} y={420} text="TAILS" s={1} />
    {k > 0 && <g opacity={k}><Slip x={760 + 90 * k} y={420 - 40 * k} text="TAILS ×2" rot={6} /></g>}
    <XLPop t={t} at={B(beats, 1, 0.6)}><XLStamp x={860} y={190} text="DUE" size={56} rot={-10} /></XLPop></g>);
}
/* 6 — six heads: Ivy inspects the coin with a loupe */
function XIVBroken({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" />
    <Row x={120} y={80} n={6} tot={7} r={30} gap={78} at={[-1, -1, -1, -1, -1, 0.1]} t={t} />
    <XLChar x={260} y={380} s={1} who="ivy" mood="squint" look={[22, -6]} bl={blink(T, 0.2)} />
    <Coin x={680} y={360} r={110} face="H" />
    <circle cx={720} cy={330} r={120} fill="#CFE6FF" opacity="0.25" stroke={K} strokeWidth="12" />
    <path d="M805 415 L900 510" stroke={K} strokeWidth="26" strokeLinecap="round" />
    <XLPop t={t} at={B(beats, 2, 1)}><XLStamp x={880} y={150} text="BROKEN?" size={48} rot={6} /></XLPop></g>);
}
/* 7 — Monte Carlo 1913: the roulette wheel */
function XIVCasino({ T, t, beats }) {
  return (<g><XLBg kind="woodDark" />
    <rect x="0" y="0" width="1080" height="608" fill="#1F5A3A" opacity="0.55" />
    <Wheel x={420} y={320} r={220} T={T} ball={1} />
    <XLPop t={t} at={0.1}><XLChip x={840} y={110} text="MONTE CARLO · 1913" fill={A} col={K} size={28} rot={3} /></XLPop>
    <XLPop t={t} at={B(beats, 1, 0.8)}><XLChip x={840} y={300} text="BLACK" fill="#17131A" size={36} /></XLPop>
    <XLPop t={t} at={B(beats, 3, 1.8)}><XLChip x={840} y={420} text="BLACK" fill="#17131A" size={36} rot={-4} /></XLPop></g>);
}
/* 8 — 26 black results pop in one after another */
function XIVTwentySix({ T, t, beats }) {
  const n = Math.min(26, Math.floor(cl(t / 1.6) * 26) + (t > 0 ? 1 : 0));
  return (<g><XLBg kind="woodDark" /><rect x="60" y="110" width="960" height="140" rx="24" fill="#1F7A4A" stroke={K} strokeWidth="7" />
    {[...Array(26)].map((_, i) => { const cx = 120 + (i % 13) * 70, cy = 145 + Math.floor(i / 13) * 70;
      return i < n ? <circle key={i} cx={cx} cy={cy} r="27" fill="#17131A" stroke={K} strokeWidth="5" /> : <circle key={i} cx={cx} cy={cy} r="27" fill="none" stroke="#8FC9A5" strokeWidth="4" strokeDasharray="8 6" />; })}
    <XLText x={540} y={440} size={140} fill={C} anchor="middle">{String(n)}</XLText>
    <XLText x={540} y={500} size={30} fill={G} anchor="middle">BLACKS IN A ROW</XLText>
    <XLPop t={t} at={B(beats, 2, 1.6)}><XLChip x={850} y={555} text="BETS ON RED" fill={R} size={28} rot={-3} /></XLPop></g>);
}
/* 9 — every flip starts fresh: 50 / 50 */
function XIVFresh({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" />
    <XLBars t={t} title="THE NEXT FLIP" bars={[{ v: 0.5, label: ['HEADS', '50%'], col: A, at: B(beats, 1, 0.5) }, { v: 0.5, label: ['TAILS', '50%'], col: A, at: B(beats, 1, 0.5) }]} note="A FAIR COIN · EVERY FLIP" />
    <XLPop t={t} at={B(beats, 1, 0.5)}><XLStamp x={820} y={190} text="FRESH" size={46} rot={-6} col={GR} /></XLPop></g>);
}
/* 10 — the name */
function XIVName({ T, t, beats }) {
  return (<g><XLBg kind="wall" /><XLCard x={170} y={80} w={740} h={440} />
    <XLText x={540} y={200} size={40} fill={G} anchor="middle">THE</XLText>
    <XLText x={540} y={300} size={84} fill={K} anchor="middle">GAMBLER'S</XLText>
    <XLPop t={t} at={B(beats, 1, 0.4)}><XLText x={540} y={420} size={96} fill={R} anchor="middle">FALLACY</XLText></XLPop>
    <Coin x={170} y={90} r={60} face="H" /><Coin x={910} y={510} r={60} face="T" /></g>);
}
/* 11 — the 1971 paper: which run "looks" random? */
function XIVStudy({ T, t, beats }) {
  const seq = (y, s, hl) => s.split('').map((c, i) => <Coin key={i} x={240 + i * 105} y={y} r={40} face={c} col={hl ? A : '#F7E3A0'} />);
  return (<g><XLBg kind="wallDark" /><XLCard x={110} y={40} w={860} h={530} />
    <XLText x={150} y={100} size={26} fill={G}>PSYCHOLOGICAL BULLETIN · 1971</XLText>
    <XLText x={150} y={145} size={30} fill={K}>"THE LAW OF SMALL NUMBERS"</XLText>
    {seq(260, 'HTHHTH', false)}{seq(400, 'HHHHHH', false)}
    <XLPop t={t} at={B(beats, 2, 1.4)}><XLChip x={540} y={330} text="WE EXPECT THIS TO EVEN OUT" fill={N} size={24} /></XLPop>
    <XLPop t={t} at={B(beats, 4, 2.4)}><XLStamp x={540} y={510} text="SAME ODDS" size={40} rot={-3} col={GR} /></XLPop></g>);
}
/* 12 — self-proof: "I'm so due" in the group chat */
function XIVProof({ T, t, beats }) {
  return (<XLChat name="GROUP CHAT" status="ONLINE" input={null}>
    <XLAvatar x={200} y={185} /><XLBubble x={240} y={140} w={430} lines={['WORST WEEK EVER']} />
    <XLPop t={t} at={B(beats, 3, 1)}><XLBubble x={500} y={260} w={400} lines={["I'M SO DUE", 'FOR SOME LUCK']} mine /></XLPop>
  </XLChat>);
}
/* 13 — payoff: flip seven is heads too; Ivy laughs, the scoreboard is crossed out */
function XIVPayoff({ T, t, beats }) {
  const k = EO((t - B(beats, 2, 1)) / 0.5);
  return (<g><XLBg kind="wall" />
    <Row x={140} y={90} n={7} tot={7} r={32} gap={82} at={[-1, -1, -1, -1, -1, -1, 0.1]} t={t} />
    <XLChar x={260} y={380} s={0.95} who="ivy" mood="relief" look={[0, -4]} />
    <XLChar x={880} y={380} s={0.85} who="gus" mood="smile" look={[-12, 0]} bl={blink(T, 0.9)} />
    <XLCard x={470} y={250} w={280} h={240} r={16} />
    <XLText x={610} y={310} size={30} fill={K} anchor="middle">SCORE</XLText>
    <XLText x={610} y={400} size={56} fill={K} anchor="middle">H 7 · T 0</XLText>
    {k > 0 && <path d={`M490 ${470} L${490 + 240 * k} ${270 + (1 - k) * 200}`} stroke={R} strokeWidth="14" strokeLinecap="round" />}</g>);
}
/* 14 — your turn */
function XIVAsk({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" /><XLCard x={190} y={60} w={700} h={480} />
    <XLText x={540} y={170} size={48} fill={K} anchor="middle">6 HEADS IN A ROW.</XLText>
    <XLText x={540} y={240} size={48} fill={K} anchor="middle">BET TAILS?</XLText>
    <XLPop t={t} at={B(beats, 0, 0.2)}><XLChip x={390} y={380} text="YES" fill={GR} size={44} /></XLPop>
    <XLPop t={t} at={B(beats, 1, 0.5)}><XLChip x={690} y={380} text="NO" fill={R} size={44} /></XLPop>
    <XLText x={540} y={500} size={26} fill={G} anchor="middle">COMMENT BELOW</XLText></g>);
}
/* 15 — share: paper plane to the "due" friend */
function XIVShare({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <XLPulse T={T}><circle cx="300" cy="300" r="120" fill={A} stroke={K} strokeWidth="8" /></XLPulse>
    <path d="M240 300 L370 240 L330 370 L305 318 Z" fill="#fff" stroke={K} strokeWidth="6" strokeLinejoin="round" />
    <path d="M460 300 H640" stroke="#fff" strokeWidth="10" strokeDasharray="26 18" strokeDashoffset={-T * 60} /><path d="M640 270 L680 300 L640 330" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round" />
    <XLCard x={720} y={120} w={260} h={360} />
    <g transform="translate(850 240)"><circle r="62" fill="#C9CEDF" stroke={K} strokeWidth="6" /><circle cy="-14" r="24" fill={G} /><path d="M-40 42 Q0 0 40 42" fill={G} /></g>
    <Coin x={940} y={150} r={34} face="H" />
    <XLText x={850} y={380} size={26} fill={K} anchor="middle">ALWAYS</XLText>
    <XLText x={850} y={420} size={30} fill={R} anchor="middle">"DUE"</XLText></g>);
}

Object.assign(window, { XIVCoin, XIVFeel, XIVNothing, XIVFour, XIVDue, XIVBroken, XIVCasino, XIVTwentySix, XIVFresh, XIVName, XIVStudy, XIVProof, XIVPayoff, XIVAsk, XIVShare });
})();
