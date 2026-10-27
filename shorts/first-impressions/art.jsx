// art.jsx — "3 Facts About First Impressions" (Rosa ep. 1 + Nia, ted-MG motion graphics). Full 1080×1920 frames, tedmg-kit.jsx.
// Props: T, t, dur, beats. Caption band y ≈ 1370–1590 unless the line sets capY.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const LECT = { hair: 'short', hairCol: '#4a3426', skin: '#e9d2b8', top: '#8c6b4f', pants: '#2f3347', glasses: true };
const STRANGER = { hair: 'curly', hairCol: '#6b4a2f', skin: '#c99b74', top: '#6a7bd1' };

function Card({ x, y, rot = 0, n = 1, s = 1 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-90" y="-60" width="180" height="120" rx="10" fill="#fffdf6" stroke={K} strokeWidth="6" />
    <text x="-70" y="-22" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="30" fill={R}>#{n}</text>
    {[0, 1, 2].map((i) => <rect key={i} x="-70" y={-6 + i * 20} width={[140, 110, 125][i]} height="9" rx="4" fill="#c9d4de" />)}</g>);
}
function FactTag({ n, pop }) {
  return <MGChip x={540} y={380} text={`FACT ${n}`} size={64} pop={pop} />;
}

/* 1 — Rosa buried in 40 rehearsed answers */
function FIHook({ T, t, dur }) {
  const n = Math.min(40, Math.floor(1 + 39 * SM(0, dur * 0.9, t)));
  return (<g><MGBg kind="room" /><rect x="-300" y="-300" width="1680" height="2520" fill="#1a1208" opacity="0.25" />
    {[...Array(14)].map((_, i) => { const k = BK((t - i * 0.12) / 0.3); const a = MG.hsh(i + 2) * 6.28, d = 330 + MG.hsh(i + 9) * 120;
      return k > 0 && <Card key={i} x={540 + Math.cos(a) * d} y={760 + Math.sin(a) * d * 0.9} rot={(MG.hsh(i + 5) - 0.5) * 50 + OS(T, 2, i * 0.1) * 4} n={i * 3 + 1} s={k * 0.9} />; })}
    <MGBust x={540} y={780} r={220} who="rosa" mouth="wave" brow="worried" look={[0.6, -0.3]} sweat={t * 0.6} bl={BL(T)} />
    <MGChip x={540} y={180} text="INTERVIEW · 9:00 AM" outline size={44} pop={t / 0.25} />
    <MGChip x={540} y={280} text={`ANSWERS LEARNED: ${n}`} size={40} pop={(t - 0.15) / 0.25} /></g>);
}

/* 2 — Nia, blunt: they judge your face first */
function FINia({ T, t, beats }) {
  return (<g><MGBg kind="wall" c1="#e0b8c8" c2="#a9788e" />
    <MGBust x={300} y={950} r={160} who="rosa" mouth="o" brow="up" look={[0.9, -0.2]} bl={BL(T, 1)} />
    <MGBust x={720} y={760} r={210} who="nia" mouth="smile" brow="up" browUp={0.5} look={[-0.7, 0.1]} bl={BL(T, 0.2)} />
    <MGBubble x={700} y={430} text="THEY'LL JUDGE|YOUR FACE FIRST." k={(t - b(beats, 1) + 0.1) / 0.3} size={48} /></g>);
}

/* 3 — FACT 1: a face flashes for 0.1 s */
function FIFact1({ T, t, beats }) {
  const flash = Math.floor(t * 10) % 7 < 1, e = b(beats, 4);
  const ms = Math.round(100 * SM(0.2, 0.8, t));
  return (<g><MGBg kind="navy" /><MGChip x={540} y={240} text="PRINCETON STUDY · 2006" outline size={44} pop={t / 0.25} />
    <FactTag n={1} pop={(t - 0.05) / 0.3} />
    <rect x="260" y="520" width="560" height="560" rx="30" fill="#1e2640" stroke={A} strokeWidth="8" />
    <g opacity={flash && t < e ? 0.15 : 1}><MGHead x={540} y={800} r={190} who={STRANGER} mouth="flat" look={[0, 0]} bl={BL(T, 0.5)} /></g>
    <g transform="translate(540 1230)"><text textAnchor="middle" y="40" fontFamily="'Bebas Neue', sans-serif" fontSize="150" fill={t > e ? A : '#fff'}>{(ms / 1000).toFixed(1)} SEC</text></g>
    {t > e + 0.2 && ['TRUSTWORTHY?', 'LIKEABLE?', 'COMPETENT?'].map((s, i) => <MGChip key={i} x={[230, 850, 540][i]} y={[620, 700, 1090][i]} text={s} size={34} col="#fff" pop={(t - e - 0.2 - i * 0.12) / 0.25} />)}</g>);
}

/* 4 — FACT 2: more time, same verdict, more confidence */
function FIFact2({ T, t, beats }) {
  const g = SM(0.4, 2.6, t), e = b(beats, beats.length - 1);
  const bar = (y, lab, v, col) => (<g><text x="170" y={y - 26} fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="40" fill="#cfd6e6">{lab}</text>
    <rect x="170" y={y} width="740" height="70" rx="35" fill="#232b45" stroke={K} strokeWidth="5" />
    <rect x="170" y={y} width={740 * v} height="70" rx="35" fill={col} /></g>);
  return (<g><MGBg kind="navy" /><MGChip x={540} y={240} text="PRINCETON STUDY · 2006" outline size={44} pop={1} />
    <FactTag n={2} pop={(t - 0.05) / 0.3} />
    {['0.1 S', '0.5 S', '1 S'].map((s, i) => <MGChip key={i} x={300 + i * 240} y={560} text={s} outline size={40} pop={(t - 0.3 - i * 0.5) / 0.25} />)}
    {bar(760, 'THE VERDICT', 0.62 + 0.03 * Math.sin(t * 2), '#6b7488')}
    {bar(960, 'HOW SURE THEY ARE', 0.3 + 0.6 * g, t > e ? A : '#d6a55c')}
    {t > e && <MGRing cx={720} cy={995} rx={260} ry={80} p={(t - e) / 0.4} />}</g>);
}

/* 5 — Rosa panics: hopeless? */
function FIPanic({ T, t }) {
  const sh = Math.sin(t * 40) * 6 * Math.exp(-t * 2);
  return (<g><MGBg kind="wall" c1="#7a2d36" c2="#3f141c" />
    {[...Array(12)].map((_, i) => <Card key={i} x={MG.hsh(i + 7) * 1080} y={((t * (300 + MG.hsh(i) * 200)) + MG.hsh(i + 70) * 1900) % 2100 - 100} rot={t * 60 * (MG.hsh(i + 3) - 0.5) * 3} n={i * 3 + 2} s={0.8} />)}
    <g transform={`translate(${sh} 0)`}><MGBust x={540} y={800} r={230} who="rosa" mouth="wave" brow="worried" look={[0, -0.5]} sweat={t * 0.9} blush={0.8} bl={0} /></g></g>);
}

/* 6 — but fact three is the good news */
function FIBut({ T, t, beats }) {
  const e = b(beats, beats.length - 1), k = SM(e - 0.2, e + 0.4, t);
  return (<g><MGBg kind="wall" c1={k > 0.5 ? '#f0d9a8' : '#7a2d36'} c2={k > 0.5 ? '#d6b37a' : '#3f141c'} />
    <MGGlow x={540} y={760} r={640} col="#fff3c4" a={0.45 * k} />
    {[...Array(12)].map((_, i) => { const a = i / 12 * 6.28 + T * 0.3; return <path key={i} d={`M${540 + Math.cos(a) * 300} ${760 + Math.sin(a) * 300} L${540 + Math.cos(a) * 520} ${760 + Math.sin(a) * 520}`} stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity={0.35 * k} />; })}
    <MGBust x={540} y={820} r={220} who="rosa" mouth={k > 0.5 ? 'grin' : 'flat'} brow="up" browUp={k} look={[0, -0.6]} bl={BL(T)} />
    <FactTag n={3} pop={(t - 0.1) / 0.3} /></g>);
}

/* 7 + 8 — the same lecturer, warm vs cold → appealing vs irritating */
function Split({ T, t, verdict = 0 }) {
  const panel = (x, warm) => (<g><rect x={x} y="460" width="500" height="900" rx="30" fill={warm ? '#f2c46a' : '#6f8fb3'} stroke={K} strokeWidth="8" />
    <MGGlow x={x + 250} y={800} r={300} col={warm ? '#fff3c4' : '#d6e6ff'} a={0.35} />
    <MGPerson x={x + 250} y={1330} s={3.6} who={LECT} mouth={warm ? 'grin' : 'frown'} brow={warm ? 'up' : 'angry'} look={warm ? [0.2, 0] : [0, -0.2]} bl={BL(T, warm ? 0 : 1)} />
    <MGChip x={x + 250} y={530} text={warm ? 'WARM' : 'COLD'} size={42} col={warm ? '#fff' : '#1a1720'} txt={warm ? '#1a1720' : '#fff'} pop={(t - (warm ? 0.2 : 0.5)) / 0.25} />
    {verdict > 0 && <g transform={`translate(${x + 250} 1240) rotate(${warm ? -8 : 8}) scale(${BK(verdict)})`}>
      <rect x="-210" y="-55" width="420" height="110" rx="12" fill={warm ? A : R} stroke={K} strokeWidth="7" />
      <text y="30" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="86" fill={warm ? '#1a1720' : '#fff'}>{warm ? 'APPEALING' : 'IRRITATING'}</text></g>}</g>);
  return (<g><MGBg kind="navy" />{panel(30, true)}{panel(550, false)}
    <MGChip x={540} y={250} text="NISBETT & WILSON · 1977" outline size={44} pop={1} /></g>);
}
function FIHalo({ T, t }) { return <Split T={T} t={t} />; }
function FIHalo2({ T, t, beats }) {
  return (<g><Split T={T} t={9} verdict={(t - b(beats, 1) + 0.1) / 0.35} />
    {t > b(beats, 1) && ['LOOKS', 'ACCENT', 'MANNERISMS'].map((s, i) => <MGChip key={i} x={280} y={1430 + i * 64} text={s + ' ✓'} size={34} col="#fff" pop={(t - b(beats, 1) - 0.3 - i * 0.1) / 0.25} />)}</g>);
}

/* 9 — name it: the halo over Rosa */
function FIName({ T, t, beats }) {
  const k = SM(0, 0.5, t), e = b(beats, 2);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1420} wTop={180} wBot={640} a={0.5 * k} />
    <ellipse cx="540" cy={852} rx={110} ry={26} fill="none" stroke="#FFE28C" strokeWidth="16" opacity={k} style={{ filter: 'drop-shadow(0 0 18px #FFD84A)' }} transform={`translate(0 ${OS(T, 1.8) * 8})`} />
    <MGPerson x={540} y={1420} s={3} who="rosa" mouth="smile" brow="up" look={[0, -0.3]} bl={BL(T)} />
    {t > e && ['WARM', '→ BETTER LOOKING', '→ NICER ACCENT', '→ MORE LIKEABLE'].map((s, i) => <MGChip key={i} x={540} y={300 + i * 90} text={s} size={i ? 36 : 44} col={i ? '#fff' : A} pop={(t - e - i * 0.15) / 0.25} />)}
    {t <= e && <MGChip x={540} y={260} text="PSYCHOLOGY" size={44} pop={(t - 0.1) / 0.25} />}</g>);
}

/* 10 — payoff: Rosa bins the cards, smiles at the receptionist first */
function FIPayoff({ T, t, beats }) {
  const e = b(beats, 2);
  return (<g><MGBg kind="wall" c1="#e6d6bc" c2="#c2a985" />
    <MGPerson x={790} y={1180} s={2.6} who={MG.extra(3)} mouth={t > e + 0.3 ? 'grin' : 'flat'} brow="up" look={[-0.8, 0]} bl={BL(T, 0.7)} />
    <rect x="560" y="900" width="460" height="420" rx="18" fill="#6b4a32" stroke={K} strokeWidth="8" /><rect x="540" y="880" width="500" height="40" rx="10" fill="#8c6a4a" stroke={K} strokeWidth="6" />
    <path d="M120 1320 L150 1080 L330 1080 L360 1320 Z" fill="#9aa3ad" stroke={K} strokeWidth="7" />
    {[0, 1, 2].map((i) => { const k = EO((t - 0.2 - i * 0.2) / 0.4); return <Card key={i} x={lp(330, 240, k)} y={lp(700, 1060, k)} rot={40 * k + i * 20} n={i * 13 + 4} s={0.7} />; })}
    <MGPerson x={430} y={1330} s={2.8} who="rosa" mouth={t > e ? 'grin' : 'smile'} brow="up" look={[0.8, 0]} bl={BL(T)} />
        <MGChip x={540} y={240} text="8:59 AM" outline size={44} pop={t / 0.25} /></g>);
}

Object.assign(window, { FIHook, FINia, FIFact1, FIFact2, FIPanic, FIBut, FIHalo, FIHalo2, FIName, FIPayoff });
})();
