// art.jsx — "He Paid $50. Now He Wants $200" (Dev ep. 3, ted-MG motion graphics). Endowment effect
// (Kahneman, Knetsch & Thaler 1990). Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);

// a worn mustard armchair, base centre at (x,y); s = scale
function Chair({ x, y, s = 1, rot = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x="-150" y="-330" width="300" height="250" rx="60" fill="#c98a3a" stroke={K} strokeWidth="8" />
    <rect x="-130" y="-120" width="260" height="90" rx="26" fill="#d99a48" stroke={K} strokeWidth="8" />
    {[-1, 1].map((sd) => <rect key={sd} x={sd > 0 ? 120 : -190} y="-200" width="70" height="190" rx="30" fill="#b97a30" stroke={K} strokeWidth="8" />)}
    <rect x="-160" y="-40" width="320" height="50" rx="14" fill="#a46a28" stroke={K} strokeWidth="8" />
    {[-1, 1].map((sd) => <rect key={'l' + sd} x={sd * 120 - 10} y="8" width="20" height="40" fill={K} />)}
    <path d="M-60 -260 L-30 -230 M40 -280 L60 -250 M-90 -160 L-60 -150" stroke="#8a5a20" strokeWidth="6" strokeLinecap="round" />
    <path d="M70 -110 Q90 -95 80 -80" stroke="#f4efe4" strokeWidth="6" fill="none" /></g>);
}
// swinging price tag on a string from (x,y)
function Tag({ x, y, text, T, col = '#fff', pop = 1 }) {
  const r = Math.sin(T * 2.4) * 6;
  return (<g transform={`translate(${x} ${y}) rotate(${r}) scale(${BK(pop)})`}>
    <line x1="0" y1="0" x2="0" y2="70" stroke={K} strokeWidth="5" />
    <path d="M-110 70 L110 70 L110 200 L-110 200 L-140 135 Z" fill={col} stroke={K} strokeWidth="7" strokeLinejoin="round" />
    <circle cx="-105" cy="135" r="9" fill={K} />
    <text x="10" y="165" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="96" fill={K}>{text}</text></g>);
}

/* 1 — Dev beside his armchair; tag flips $50 → $200 */
function MGChairHook({ T, t, beats }) {
  const c = b(beats, 3), up = t >= c;
  return (<g><MGBg kind="room" />
    <Chair x={720} y={1180} s={1.25} />
    <MGPerson x={300} y={1230} s={2.6} who="dev" mouth={up ? 'grin' : 'smile'} brow={up ? 'up' : 'flat'} look={[0.8, 0]} bl={BL(T)} />
    <Tag x={820} y={620} T={T} text={up ? '$200' : '$50'} col={up ? A : '#fff'} pop={up ? (t - c) / 0.3 : t / 0.3} />
    <MGChip x={540} y={250} text={up ? 'ASKING: $200' : 'PAID: $50'} outline size={48} pop={up ? (t - c) / 0.25 : t / 0.25} />
    <MGChip x={540} y={370} text="DEV · MOVING OUT" size={38} pop={(t - 0.2) / 0.25} /></g>);
}

/* 2 — June's offer, then Dev's offended close-up */
function MGJuneOffer({ T, t, beats }) {
  const c = b(beats, 1);
  if (t < c) return (<g><MGBg kind="wall" c1="#cfe3dc" c2="#94b9b0" />
    <MGBust x={540} y={800} r={230} who="june" mouth="smile" brow="flat" look={[-0.3, 0]} bl={BL(T)} />
    <MGChip x={540} y={250} text="OFFER: $40" size={56} pop={(t - 0.1) / 0.25} /></g>);
  const lt = t - c, sh = Math.sin(lt * 60) * 10 * Math.exp(-lt * 4);
  return (<g><MGBg kind="wall" c1="#e4b07a" c2="#b37a4a" />
    <g transform={`translate(${sh} 0)`}><MGBust x={540} y={800} r={230} who="dev" mouth="o" brow="angry" look={[0, 0]} /></g>
    {[...Array(6)].map((_, i) => { const a = -Math.PI * 0.85 + i * 0.32, k = EO(lt / 0.35); return <line key={i} x1={540 + Math.cos(a) * 300 * k} y1={760 + Math.sin(a) * 300 * k} x2={540 + Math.cos(a) * 380 * k} y2={760 + Math.sin(a) * 380 * k} stroke={R} strokeWidth="14" strokeLinecap="round" />; })}
    <MGChip x={540} y={250} text="$40?!" outline col={R} size={64} pop={lt / 0.25} /></g>);
}

/* 3 — Dev hugs the chair; memory bubbles pop */
function MGMemories({ T, t }) {
  const BUBS = [[260, 520, 'NAPS'], [800, 470, 'PIZZA|NIGHTS'], [540, 330, 'THE BIG|GAME']];
  return (<g><MGBg kind="room" />
    <Chair x={600} y={1250} s={1.5} />
    <MGPerson x={460} y={1290} s={2.4} who="dev" mouth="grin" brow="up" look={[0.6, 0.2]} bl={0} />
    {BUBS.map(([x, y, s], i) => <MGBubble key={i} x={x} y={y + 160} text={s} k={(t - 0.2 - i * 0.25) / 0.3} size={46} />)}
    {[...Array(5)].map((_, i) => { const k = ((t * 0.7 + i / 5) % 1); return <path key={i} transform={`translate(${380 + i * 80} ${900 - k * 260}) scale(${0.6 + k * 0.4})`} d="M0 10 C-30 -20 -10 -40 0 -20 C10 -40 30 -20 0 10 Z" fill="#ff6f91" opacity={1 - k} />; })}</g>);
}

/* 4 — the same chair twice: "DEV'S" $200 vs "JUNE'S" $40, red ring on the only difference */
function MGSameChair({ T, t, beats }) {
  const c = b(beats, 2);
  return (<g><MGBg kind="navy" />
    <Chair x={290} y={1100} s={0.95} /><Chair x={790} y={1100} s={0.95} />
    <text x="540" y="860" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="140" fill="#fff" opacity={SM(0.2, 0.5, t)}>=</text>
    <Tag x={290} y={430} T={T} text="$200" col={A} pop={(t - 0.1) / 0.3} />
    <Tag x={790} y={430} T={T + 1} text="$40" pop={(t - 0.3) / 0.3} />
    <MGChip x={290} y={1240} text="DEV OWNS IT" outline size={38} pop={(t - c) / 0.25} />
    <MGChip x={790} y={1240} text="JUNE WOULD" outline col="#fff" size={38} pop={(t - c - 0.15) / 0.25} />
    <MGRing cx={290} cy={1240} rx={200} ry={70} p={(t - c - 0.4) / 0.4} rot={-4} />
    <MGChip x={540} y={220} text="SAME CHAIR" size={48} pop={t / 0.25} /></g>);
}

/* 5 — the study: a Cornell-style coffee mug spins in on navy */
function MGStudyMug({ T, t, beats }) {
  const k = BK((t - b(beats, 2)) / 0.4);
  return (<g><MGBg kind="navy" /><MGGlow x={540} y={900} r={520} col="#ffd84a" a={0.1} />
    <MGChip x={540} y={250} text="KAHNEMAN · KNETSCH · THALER" outline size={40} pop={t / 0.25} />
    <MGChip x={540} y={360} text="1990" size={44} pop={(t - 0.15) / 0.25} />
    {[...Array(6)].map((_, i) => <MGPerson key={i} x={140 + i * 160} y={1300} s={1.2} who={MG.extra(i + 2)} look={[0, -0.4]} bl={BL(T, i * 0.5)} />)}
    <g transform={`translate(540 860) scale(${Math.max(0, k) * 1.8}) rotate(${Math.sin(T * 2) * 4})`}><MGMug x={0} y={0} /></g></g>);
}

/* 6 — owners: person clutching the mug, "$7.12" */
function MGOwners({ T, t, beats }) {
  const n = lp(0, 7.12, EO((t - b(beats, 2)) / 0.6));
  return (<g><MGBg kind="wall" c1="#3a2a3e" c2="#1d1622" />
    <MGBust x={540} y={600} r={190} who={MG.extra(4)} mouth="frown" brow="angry" look={[0, 0.3]} bl={BL(T)} />
    <MGArm x1={180} y1={1500} x2={470} y2={1040} sleeve={MG.extra(4).top} skin={MG.extra(4).skin} w={80} />
    <MGMug x={560} y={1010} />
    <MGChip x={540} y={200} text="OWNERS WANTED" size={44} pop={t / 0.25} />
    <MGBigNum y={1320} text={'$' + n.toFixed(2)} col={A} size={200} /></g>);
}

/* 7 — buyers: a shrug, "$2.87" */
function MGBuyers({ T, t, beats }) {
  const n = lp(0, 2.87, EO((t - b(beats, 1)) / 0.5));
  return (<g><MGBg kind="wall" c1="#21304a" c2="#141c2e" />
    <MGBust x={540} y={600} r={190} who={MG.extra(7)} mouth="flat" brow="up" look={[0.5, 0]} bl={BL(T)} />
    <MGMug x={820} y={1080} rot={10} />
    <MGChip x={540} y={200} text="BUYERS OFFERED" outline size={44} pop={t / 0.25} />
    <MGBigNum y={1320} text={'$' + n.toFixed(2)} col="#fff" size={200} />
</g>);
}

/* 8 — name it: Dev on stage, spotlit, hugging his chair */
function MGNameEndow({ T, t }) {
  const a = SM(0, 0.3, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1330} wTop={180} wBot={720} a={0.55 * a} />
    <Chair x={640} y={1310} s={1.2} />
    <MGPerson x={430} y={1330} s={2.4} who="dev" mouth="smile" brow="worried" look={[0.7, 0]} bl={BL(T)} />
    <MGTitle lines={[['THE ENDOWMENT', '#fff', 120], ['EFFECT', A, 140]]} y={230} a={EO((t - 0.3) / 0.35)} /></g>);
}

/* 9 — June's question, then the deal: Dev with $40, June walks off with the chair */
function MGBuyToday({ T, t, beats }) {
  const c = b(beats, 4);
  if (t < c) return (<g><MGBg kind="wall" c1="#cfe3dc" c2="#94b9b0" />
    <MGBust x={540} y={820} r={230} who="june" mouth="smile" brow="up" look={[0.4, 0]} bl={BL(T)} />
    <MGBubble x={540} y={520} text="WOULD YOU BUY IT|TODAY FOR $200?" k={(t - b(beats, 1)) / 0.3} size={50} /></g>);
  const lt = t - c, jx = lp(640, 1250, SM(0.9, 3.2, lt));
  return (<g><MGBg kind="room" />
    <MGPerson x={300} y={1260} s={2.4} who="dev" mouth="grin" brow="up" look={[1, 0]} bl={BL(T)} />
    <g transform={`translate(${jx - 640} 0)`}><Chair x={760} y={1150} s={0.9} rot={-6} /><MGPerson x={640} y={1260} s={2.4} who="june" walk={lt > 0.5 ? lt * 8 : 0} mouth="smile" look={[1, 0]} /></g>
    <MGChip x={540} y={260} text="SOLD · $40" size={56} pop={lt / 0.25} /></g>);
}

Object.assign(window, { MGChairHook, MGJuneOffer, MGMemories, MGSameChair, MGStudyMug, MGOwners, MGBuyers, MGNameEndow, MGBuyToday });
})();
