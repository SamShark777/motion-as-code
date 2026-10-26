// art.jsx — "Nobody Noticed the Stain" (Milo ep. 1, ted-MG motion graphics). Reference example for format "tedmg".
// Every scene draws the full 1080×1920 frame with tedmg-kit.jsx. Props: T (global s), t (s into scene), dur, beats
// (each caption chunk's start within the scene — key the action to these so it lands on the words).
// Keep faces/props out of the caption band (y ≈ 1370–1590) unless the line sets "capY".
(function () { // scoped so these short helper names can't collide with other scripts
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);

/* 1 — hook: worried Milo with the stain, red circle drawn on the stain */
function MGHook({ T, t, beats }) {
  const bob = OS(T, 2.9) * 4;
  return (<g><MGBg kind="wall" c1="#4a2f5c" c2="#2a1b38" /><MGGlow x={800} y={300} r={500} col="#ff8fb1" a={0.15} />
    <MGBust x={540} y={800 + bob} r={230} who="milo" stain={1} brow="worried" mouth="wave" look={[0.3, 0.9]} sweat={t * 0.5} blush={0.6} bl={BL(T)} />
    <MGRing cx={666} cy={1202 + bob} rx={150} ry={135} p={(t - b(beats, 1) - 0.1) / 0.45} /></g>);
}

/* 2 — title card in the bedroom, then close-up with the countdown */
function MGIntro({ T, t, beats }) {
  const cut = b(beats, 1);
  if (t < cut) return (<g><MGBg kind="room" /><MGPerson x={540} y={1330} s={2.4} who="milo" mouth="smile" brow="up" bl={BL(T)} />
    <rect x="-300" y="-300" width="1680" height="2520" fill="#140e0a" opacity="0.35" />
    <MGTitle lines={[['THE SPOTLIGHT', '#fff', 150], ['PART 1', A, 110]]} y={230} a={EO(t / 0.3)} /></g>);
  const lt = t - cut, secs = 600 - Math.floor(lt);
  return (<g><MGBg kind="wall" c1="#d9c6a6" c2="#b39a78" />
    <MGBust x={540} y={800} r={230} who="milo" mouth="grin" brow="up" bl={BL(T, 0.4)} />
    <MGChip x={540} y={250} text={`PARTY IN ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`} outline size={46} pop={lt / 0.25} />
    <MGChip x={540} y={370} text="MILO · 24" size={40} pop={(lt - 0.15) / 0.25} /></g>);
}

/* 3 — he raises his mug, it tips, the stain blooms */
function MGSpill({ T, t, beats }) {
  const hit = Math.max(0.6, b(beats, 1) - 0.15), tilt = SM(hit - 0.45, hit - 0.1, t), sp = SM(hit, hit + 0.5, t), shock = t > hit;
  const sh = shock ? Math.sin(t * 70) * 12 * Math.exp(-(t - hit) * 6) : 0;
  const ax = lp(1150, 900, EO(t / 0.35)), ay = 1030;
  return (<g><MGBg kind="wall" c1="#d9c6a6" c2="#b39a78" />
    <g transform={`translate(${sh} 0)`}>
      <MGBust x={540} y={800} r={230} who="milo" stain={sp} mouth={shock ? 'o' : 'smile'} brow={shock ? 'up' : 'flat'} browUp={shock ? 1 : 0} look={shock ? [0.2, 0.9] : [0.5, 0.2]} bl={shock ? 0 : BL(T)} />
      <MGArm x1={1250} y1={1700} x2={ax - 10} y2={ay + 40} />
      <MGMug x={ax - 30} y={ay} rot={-tilt * 92} />
      {tilt > 0.6 && t < hit + 0.25 && <path d={`M${ax - 120} ${ay - 40} Q${ax - 200} ${ay + 60} ${ax - 230} ${ay + 60 + cl((t - hit + 0.3) / 0.3) * 140}`} stroke="#6e4224" strokeWidth="26" fill="none" strokeLinecap="round" />}
      {shock && [...Array(10)].map((_, i) => { const a = MG.hsh(i + 4) * 6.28, q = EO((t - hit) / 0.4), d = 40 + MG.hsh(i + 40) * 160;
        return <circle key={i} cx={666 + Math.cos(a) * d * q} cy={1202 + Math.sin(a) * d * q} r={6 + MG.hsh(i + 80) * 10} fill="#7a4a2a" opacity={1 - q * 0.6} />; })}
    </g></g>);
}

/* 4 — the phone: 7:59, "where are u??" */
function MGNoTime({ T, t }) {
  return (<g><MGBg kind="wall" c1="#3a2a3e" c2="#1d1622" />
    <MGPhone x={540} y={900} rot={-5} time="7:59" day="SATURDAY" from="SAM" msg="where are u?? party started" k={(t - 0.2) / 0.35} />
    <MGArm x1={900} y1={1950} x2={730} y2={1260} w={106} /></g>);
}

/* 5 — walks into the party → every head turns → spotlight + arrows on the stain */
function MGWalkIn({ T, t, beats }) {
  const c1 = b(beats, 1), c2 = b(beats, 3);
  if (t < c1) { const mx = lp(-80, 330, EO(t / 1.2));
    return (<g><MGBg kind="party" T={T} /><MGCrowd T={T} t={t} />
      <MGPerson x={mx} y={1340} s={1.85} who="milo" walk={t < 1.2 ? t * 9 : 0} stain brow="worried" look={[1, 0]} /></g>); }
  if (t < c2) { const lt = t - c1;
    return (<g><MGBg kind="party" T={T} dim={0.2} />
      {[...Array(12)].map((_, i) => { const row = Math.floor(i / 4), k = i % 4, e = MG.extra(i + 3), x = 150 + k * 260 + (row % 2) * 90 - 45, y = 520 + row * 420, r = 120 + row * 10, tt = SM(0.05 + i * 0.02, 0.25 + i * 0.02, lt);
        return (<g key={i}><ellipse cx={x} cy={y + r * 2} rx={r * 1.3} ry={r * 1.2} fill={e.top} stroke={K} strokeWidth="6" />
          <MGHead x={x} y={y} r={r} who={e} look={[lp(e.face, (540 - x) / 500, tt), lp(0, 0.15, tt)]} mouth={tt > 0.5 ? 'o' : e.mouth} brow={tt > 0.5 ? 'up' : 'flat'} /></g>); })}</g>); }
  const lt = t - c2;
  return (<g><MGBg kind="dark" /><MGSpot x={540} yTop={-100} yBot={1500} wTop={200} wBot={1000} a={0.5} />
    <MGBust x={540} y={800} r={230} who="milo" stain={1} brow="worried" mouth="wave" look={[0.3, 0.9]} sweat={lt * 0.7} blush={1} />
    <MGArrows x={666} y={1202} t={lt} /></g>);
}

/* 6 — hides behind a red cup, eyes darting → walks home at 9:12 PM */
function MGHide({ T, t, beats }) {
  const c = b(beats, 2);
  if (t < c) { const dart = Math.sign(Math.sin(t * 4.5));
    return (<g><MGBg kind="party" T={T} dim={0.35} />
      <MGBust x={540} y={800} r={230} who="milo" stain={1} brow="worried" mouth="flat" look={[dart * 0.9, 0.1]} sweat={t * 0.6} />
      <MGArm x1={1150} y1={1900} x2={745} y2={1230} /><MGCup x={660} y={1170} /><ellipse cx={745} cy={1230} rx={62} ry={56} fill={MG.CREAM} stroke={K} strokeWidth="8" /></g>); }
  const lt = t - c;
  return (<g><MGBg kind="street" /><MGPerson x={lp(380, 760, lt / 2.2)} y={1500} s={2} who="milo" walk={lt * 8} brow="worried" mouth="frown" look={[1, 0.4]} stain />
    <MGChip x={540} y={300} text="9:12 PM" outline size={48} pop={lt / 0.25} /></g>);
}

/* 7 — REWIND to the party; this time we see everyone's own worries */
const BUB = { 5: 'IS MY HAIR|WEIRD?', 0: 'DID I SAY THAT|OUT LOUD?', 6: 'NOBODY|TEXTED BACK', 9: 'WHY DID I|WEAR THIS?', 10: 'IS MY LAUGH|TOO LOUD?' };
function MGNobody({ T, t, beats }) {
  const c = b(beats, 1);
  const rew = t < c;
  return (<g><g style={rew ? { filter: 'saturate(0.35) brightness(0.9)' } : null}><MGBg kind="party" T={T} />
      <MGCrowd T={T} t={t - c} bubbles={rew ? {} : BUB} bubbleFrom={0.1} />
      <MGPerson x={rew ? lp(330, -80, EO(t / c)) : 540} y={1320} s={1.7} who="milo" walk={rew ? -t * 12 : 0} stain brow="worried" look={[0, 0.5]} /></g>
    {rew && <g>{[...Array(5)].map((_, i) => <rect key={i} x="0" y={MG.hsh(i + Math.floor(t * 20) * 7) * 1920} width="1080" height={6 + MG.hsh(i + 9) * 30} fill="#fff" opacity="0.08" />)}
      <g transform="translate(540 300)" fill="#fff"><path d="M-40 -30 L-90 0 L-40 30 Z" /><path d="M10 -30 L-40 0 L10 30 Z" />
        <text x="40" y="24" fontFamily="'Bebas Neue', sans-serif" fontSize="64">REWIND</text></g></g>}</g>);
}

/* 8 — name it: Milo alone under a stage spotlight */
function MGName({ T, t }) {
  const a = SM(0, 0.3, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1420} wTop={180} wBot={620} a={0.55 * a} />
    {[...Array(40)].map((_, i) => <circle key={i} cx={540 + (MG.hsh(i) - 0.5) * (200 + MG.hsh(i + 50) * 400)} cy={(MG.hsh(i + 100) * 1400 + t * 30 * (MG.hsh(i + 150) + 0.3)) % 1400} r={2 + MG.hsh(i + 200) * 3} fill="#FFF0C8" opacity={0.25 * a} />)}
    <MGPerson x={540} y={1420} s={3} who="milo" stain brow="worried" mouth="wave" look={[0, -0.2]} bl={BL(T)} />
    <MGChip x={540} y={260} text="PSYCHOLOGY" size={44} pop={(t - 0.1) / 0.25} /></g>);
}

/* 9 — the Cornell T-shirt → 20-person room: 10 guessed, ~5 actually noticed */
function MGStudy({ T, t, beats }) {
  const g0 = b(beats, 2), g1 = b(beats, 6);
  const chip = <MGChip x={540} y={240} text="CORNELL STUDY · 2000" outline size={44} pop={t / 0.25} />;
  if (t < g0) { const k = BK((t - 0.1) / 0.4);
    return (<g><MGBg kind="navy" />{chip}<MGGlow x={540} y={850} r={520} col="#ffd84a" a={0.08} />
      <g transform={`translate(540 850) scale(${k}) rotate(${Math.sin(t * 2) * 2.3})`}>
        <path d="M-150 -280 L-330 -180 L-250 -40 L-190 -80 L-190 300 L190 300 L190 -80 L250 -40 L330 -180 L150 -280 Q0 -180 -150 -280 Z" fill="#ffd84a" stroke={K} strokeWidth="9" strokeLinejoin="round" />
        <MGHead x={0} y={40} r={95} who={{ hair: 'none', skin: '#ff9ec4' }} mouth="grin" brow="up" look={[0.3, 0]} />
        <text x="0" y="250" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="64" fill={K}>#1 FAN</text></g></g>); }
  const after = t >= g1, kk = SM(g1, g1 + 0.5, t);
  const on = after ? lp(10, 5, kk) : 10 * SM(g0, g0 + 0.8, t);
  const pct = after ? Math.round(lp(50, 25, kk)) : Math.round(5 * on);
  return (<g><MGBg kind="navy" />{chip}<MGHeadGrid T={T} on={on} litOrder={[2, 8, 11, 17, 19, 0, 4, 6, 13, 15, 1, 3, 5, 7, 9, 10, 12, 14, 16, 18]} />
    <MGBigNum y={1560} text={(after && kk > 0.95 ? '~' : '') + pct + '%'} col={after ? A : '#fff'} label={after ? 'ACTUALLY NOTICED' : 'THEY GUESSED'} /></g>);
}

/* 10 — everyone has their own spotlight */
function MGMovie({ T, t }) {
  const k = SM(0, 0.6, t);
  return (<g><MGBg kind="party" T={T} dim={0.45} /><MGCrowd T={T} t={t} spot={k} mood="smile" />
    <MGSpot x={540} yTop={520} yBot={1320} wTop={40} wBot={200} a={0.4 * SM(0.2, 0.8, t)} />
    <MGPerson x={540} y={1320} s={1.7} who="milo" stain mouth="smile" bl={BL(T)} />
    {[...Array(12)].map((_, i) => { const tw = 0.5 + 0.5 * Math.sin(t * 6 + i * 2); return <g key={i} transform={`translate(${MG.hsh(i + 12) * 1080} ${400 + MG.hsh(i + 120) * 700}) rotate(45)`} opacity={tw * SM(0.3, 0.8, t)} fill="#FFE28C"><rect x="-4" y="-14" width="8" height="28" /><rect x="-14" y="-4" width="28" height="8" /></g>; })}</g>);
}

/* 11 — unaware Milo at night → empty stage, mic, TOMORROW · 9:00 AM → PART 2 */
function MGCliff({ T, t, beats }) {
  const c = b(beats, 2);
  if (t < c) return (<g><MGBg kind="wall" c1="#1d2540" c2="#141a30" /><MGGlow x={300} y={300} r={500} col="#9fb4ff" a={0.12} />
    <MGBust x={540} y={800} r={230} who="milo" stain={1} mouth="flat" look={[-0.6, 0.2]} bl={BL(T, 0.2)} /></g>);
  const lt = t - c, end = b(beats, 4) + 0.7, k = EO((t - end) / 0.35);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1360} wTop={160} wBot={560} a={0.5 * SM(0, 0.4, lt)} /><MGMic />
    <MGChip x={540} y={260} text="TOMORROW · 9:00 AM" outline size={46} pop={lt / 0.25} />
    {t > end && <g><rect x="-300" y="-300" width="1680" height="2520" fill="#050408" opacity={0.55 * k} />
      <MGTitle lines={[['PART 2', A, 220], ["FOLLOW SO YOU DON'T MISS IT", '#fff', 64]]} y={820} a={k} /></g>}</g>);
}

Object.assign(window, { MGHook, MGIntro, MGSpill, MGNoTime, MGWalkIn, MGHide, MGNobody, MGName, MGStudy, MGMovie, MGCliff });
})();
