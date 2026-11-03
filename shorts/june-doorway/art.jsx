// art.jsx — "You Forgot Why You Walked In? Blame the Door" (June ep. 3, ted-MG motion graphics). Doorway effect
// (Radvansky, Krawietz & Tamplin 2011). Full 1080×1920 frames with tedmg-kit.jsx; captions at y ≈ 1480.
(function () {
const { AMB: A, RED: R, INK: K, CREAM: CR, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, osc: OS, blink: BL } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif";

// kitchen: warm wall, tiles, counter
function Kitchen() {
  return (<g><MGBg kind="wall" c1="#e8d9b8" c2="#cdb68e" />
    {[...Array(8)].map((_, i) => [...Array(4)].map((_, j) => <rect key={i + '-' + j} x={-20 + i * 140} y={820 + j * 90} width="136" height="86" fill="#f4efe4" opacity="0.5" />))}
    <rect x="-300" y="1180" width="1680" height="800" fill="#8c6a4a" /><rect x="-300" y="1160" width="1680" height="40" fill="#5f4530" /></g>);
}
// fridge with optional magnet "eyes"
function Fridge({ x, y, s = 1, eyes = 0, T = 0 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-170" y="-760" width="340" height="760" rx="30" fill="#dfe6ea" stroke={K} strokeWidth="9" />
    <line x1="-170" y1="-500" x2="170" y2="-500" stroke={K} strokeWidth="7" />
    <rect x="120" y="-700" width="20" height="150" rx="8" fill="#9aa7ae" stroke={K} strokeWidth="5" /><rect x="120" y="-440" width="20" height="200" rx="8" fill="#9aa7ae" stroke={K} strokeWidth="5" />
    {eyes > 0 && [-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 60 - 20} -620) scale(1 ${eyes * (1 - MG.blink(T, 1.3) * 0.9)})`}><circle r="40" fill="#fff" stroke={K} strokeWidth="6" /><circle cx={-12} r="17" fill={K} /></g>)}
    <rect x="-120" y="-400" width="90" height="110" fill={A} stroke={K} strokeWidth="5" transform="rotate(-6 -75 -345)" /></g>);
}
// a door frame (open doorway) at floor (x,y)
function Doorway({ x, y, w = 300, h = 640, open = 1 }) {
  return (<g><rect x={x - w / 2 - 26} y={y - h - 26} width={w + 52} height={h + 26} fill="#6b4d33" stroke={K} strokeWidth="8" />
    <rect x={x - w / 2} y={y - h} width={w} height={h} fill="#2a2030" />
    <path d={`M${x - w / 2} ${y - h} L${x - w / 2 + w * (1 - open * 0.75)} ${y - h + 40} L${x - w / 2 + w * (1 - open * 0.75)} ${y + 20} L${x - w / 2} ${y} Z`} fill="#c98a3a" stroke={K} strokeWidth="7" strokeLinejoin="round" /></g>);
}
function Scissors({ x, y, s = 1, rot = 0, open = 0.3 }) {
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    {[-1, 1].map((sd) => <g key={sd} transform={`rotate(${sd * open * 20})`}><path d="M0 0 L200 -8 L200 8 Z" fill="#cfd6db" stroke={K} strokeWidth="6" strokeLinejoin="round" />
      <ellipse cx={-60} cy={sd * 34} rx={44} ry={30} fill="none" stroke={R} strokeWidth="16" /></g>)}
    <circle r="9" fill={K} /></g>);
}

/* 1 — June walks in through the kitchen door… and stops. A "?" pops over her head */
function MGKitchenHook({ T, t, beats }) {
  const stop = b(beats, 2), x = lp(150, 470, EO(t / Math.max(0.6, stop - 0.1)));
  return (<g><Kitchen /><Fridge x={850} y={1180} s={0.95} />
    <Doorway x={150} y={1180} w={260} h={600} />
    <MGPerson x={x} y={1240} s={2.5} who="june" walk={t < stop ? t * 9 : 0} mouth={t > stop ? 'flat' : 'smile'} brow={t > stop ? 'up' : 'flat'} look={t > stop ? [0, -0.5] : [1, 0]} bl={BL(T)} />
    {t > b(beats, 3) && <text x={x} y={540} textAnchor="middle" fontFamily={BB} fontSize={200 * BK((t - b(beats, 3)) / 0.3)} fill={A} stroke={K} strokeWidth="6">?</text>}
    <MGChip x={540} y={240} text="JUNE · 10:42 AM" outline size={44} pop={t / 0.25} /></g>);
}

/* 2 — June close-up, blank; the fridge opens its eyes */
function MGFridge({ T, t, beats }) {
  const c = b(beats, 3);
  return (<g><Kitchen /><Fridge x={820} y={1200} s={1.15} eyes={SM(c - 0.1, c + 0.25, t)} T={T} />
    <MGBust x={360} y={820} r={200} who="june" mouth="flat" brow="flat" look={[1, -0.1]} bl={BL(T, 0.5)} />
    {[...Array(3)].map((_, i) => <text key={i} x={180 + i * 50} y={500 - ((t * 60 + i * 30) % 90)} fontFamily={BB} fontSize="60" fill={K} opacity="0.4">.</text>)}</g>);
}

/* 3 — back at her desk: lightbulb, "SCISSORS!" */
function MGBackToDesk({ T, t, beats }) {
  const c = b(beats, 2), on = t > c;
  return (<g><MGBg kind="room" />
    <MGPerson x={540} y={1240} s={2.6} who="june" mouth={on ? 'grin' : 'flat'} brow={on ? 'up' : 'flat'} look={on ? [0, -0.6] : [0.5, 0.3]} bl={BL(T)} />
    {on && <g transform={`translate(540 360) scale(${BK((t - c) / 0.3)})`}><MGGlow x={0} y={0} r={200} col="#ffe38a" a={0.7} />
      <circle r="70" fill="#ffe38a" stroke={K} strokeWidth="7" /><rect x="-34" y="60" width="68" height="50" fill="#9aa7ae" stroke={K} strokeWidth="6" /></g>}
    {t > b(beats, 3) && <MGChip x={540} y={560} text="SCISSORS!" size={60} pop={(t - b(beats, 3)) / 0.25} />}</g>);
}

/* 4 — Theo laughing, door with a red ring */
function MGTheoDoor({ T, t, beats }) {
  const c = b(beats, 2);
  return (<g><MGBg kind="wall" c1="#cfe3dc" c2="#94b9b0" />
    <Doorway x={830} y={1200} w={260} h={620} open={0.4} />
    <MGBust x={380} y={820} r={210} who="theo" mouth="grin" brow="up" look={[0.8, -0.2]} bl={BL(T)} />
    <MGArm x1={600} y1={1500} x2={680} y2={1000} sleeve="#4f9d78" skin="#e9d2b8" w={80} />
    <MGRing cx={830} cy={890} rx={200} ry={360} p={(t - c) / 0.45} rot={0} />
    {[0, 1, 2].map((k) => <text key={k} x={560 + k * 70} y={420 - k * 40 + Math.sin(T * 8 + k) * 8} fontFamily={BB} fontSize="80" fill={A} opacity={SM(0.1 + k * 0.15, 0.3 + k * 0.15, t)}>HA</text>)}</g>);
}

/* 5 — the study: a floor plan, a little figure carrying a box from room to room */
function MGStudyRooms({ T, t, beats }) {
  const k = cl((t - b(beats, 2)) / 2.4), px = lp(260, 820, k), py = 900;
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={240} text="NOTRE DAME · 2011" outline size={46} pop={t / 0.25} />
    <g stroke="#cfd6ff" strokeWidth="10" fill="none" opacity="0.9"><rect x="110" y="560" width="860" height="680" />
      <path d="M540 560 L540 820 M540 980 L540 1240" /></g>
    <rect x="530" y="820" width="20" height="160" fill={A} opacity={0.4 + 0.3 * Math.sin(T * 6)} />
    <MGChip x={320} y={640} text="ROOM A" outline col="#cfd6ff" size={32} /><MGChip x={760} y={640} text="ROOM B" outline col="#cfd6ff" size={32} />
    {[[240, 1120], [840, 1120]].map(([x, y], i) => <rect key={i} x={x - 60} y={y - 30} width="120" height="60" fill="#6b4d33" stroke={K} strokeWidth="5" />)}
    <MGPerson x={px} y={py + 120} s={1.3} who={MG.extra(3)} walk={k > 0 && k < 1 ? t * 9 : 0} look={[1, 0]} />
    <rect x={px - 34} y={py - 10} width="68" height="56" fill={k > 0 ? '#c98a3a' : 'none'} stroke={k > 0 ? K : 'none'} strokeWidth="5" />
    <MGChip x={540} y={1340} text="VIRTUAL + REAL ROOMS" size={34} pop={(t - b(beats, 3)) / 0.25} /></g>);
}

/* 6 — two lanes: same distance; the doorway lane's memory bubble goes foggy */
function MGDoorResult({ T, t, beats }) {
  const fog = SM(b(beats, 2), b(beats, 2) + 0.6, t);
  const lane = (y, door, label) => (<g>
    <rect x="80" y={y - 10} width="920" height="20" rx="10" fill="#3a4160" />
    {door && <g><rect x="520" y={y - 230} width="40" height="240" fill="#6b4d33" stroke={K} strokeWidth="5" /><rect x="560" y={y - 230} width="20" height="240" fill={A} opacity="0.5" /></g>}
    <MGPerson x={lp(160, 900, cl(t / 3))} y={y} s={1.3} who="june" walk={t * 9} look={[1, 0]} bl={BL(T)} />
    <MGChip x={540} y={y + 70} text={label} outline col={door ? A : '#fff'} size={34} /></g>);
  return (<g><MGBg kind="navy" />
    {lane(720, false, 'SAME ROOM')}{lane(1220, true, 'THROUGH A DOOR')}
    <MGBubble x={lp(160, 900, cl(t / 3))} y={720 - 220} text="BOX: RED CUBE" k={(t - 0.2) / 0.3} size={34} />
    <g opacity={1 - fog * 0.85}><MGBubble x={lp(160, 900, cl(t / 3))} y={1220 - 220} text="BOX: RED CUBE" k={(t - 0.2) / 0.3} size={34} /></g>
    {fog > 0 && <MGBubble x={lp(160, 900, cl(t / 3))} y={1220 - 220} text="BOX: …???" k={fog} size={34} />}
    <MGChip x={540} y={240} text="SLOWER · LESS ACCURATE" size={40} pop={(t - b(beats, 2)) / 0.25} /></g>);
}

/* 7 — name it: a lone doorway under the spotlight, June peeking round it */
function MGNameDoor({ T, t }) {
  const a = SM(0, 0.3, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={640} a={0.55 * a} />
    <Doorway x={540} y={1300} w={320} h={700} open={0.6} />
    <MGHead x={lp(760, 700, EO(t / 0.6))} y={760} r={90} who="june" mouth="o" brow="up" look={[-1, 0]} bl={BL(T)} />
    <MGTitle lines={[['THE DOORWAY', '#fff', 140], ['EFFECT', A, 150]]} y={230} a={EO((t - 0.3) / 0.35)} /></g>);
}

/* 8 — memories as scene cards; the door slams a new card over the old one */
function MGScenes({ T, t, beats }) {
  const c = b(beats, 2), k = EO((t - c) / 0.45);
  const card = (x, y, label, col, rot, a = 1) => (<g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={a}>
    <rect x="-300" y="-220" width="600" height="440" rx="24" fill={col} stroke={K} strokeWidth="8" />
    <rect x="-300" y="-220" width="600" height="70" rx="24" fill={K} />
    {[...Array(6)].map((_, i) => <rect key={i} x={-270 + i * 95} y="-202" width="50" height="34" rx="6" fill="#fff" opacity="0.8" />)}
    <text x="0" y="60" textAnchor="middle" fontFamily={BB} fontSize="110" fill={K}>{label}</text></g>);
  return (<g><MGBg kind="dark" />
    {card(540, 840, 'DESK', '#cfe3dc', -4, 1 - k * 0.5)}
    {k > 0 && card(lp(1400, 560, k), lp(700, 900, k), 'KITCHEN', '#e8d9b8', 5)}
    {k > 0 && <g transform={`translate(${lp(1400, 560, k) + 220} ${lp(700, 900, k) - 260})`}><MGChip x={0} y={0} text="NEW SCENE" size={40} pop={(t - c - 0.2) / 0.25} /></g>}
    <MGChip x={540} y={240} text="HOW YOUR BRAIN FILES IT" outline size={42} pop={t / 0.25} /></g>);
}

/* 9 — June holds the scissors… and no idea why; Theo snickers behind */
function MGScissors({ T, t, beats }) {
  const c = b(beats, 2);
  return (<g><MGBg kind="room" />
    <MGPerson x={170} y={1250} s={1.9} who="theo" mouth="grin" brow="up" look={[1, 0]} bl={BL(T, 1)} />
    <MGBust x={560} y={800} r={220} who="june" mouth={t > c ? 'wave' : 'smile'} brow={t > c ? 'worried' : 'up'} look={t > c ? [0.6, -0.8] : [0.8, 0.2]} sweat={t > c ? (t - c) * 0.7 : null} bl={BL(T)} />
    <MGArm x1={1150} y1={1900} x2={860} y2={1060} sleeve="#5bb3b0" skin="#f2dccb" w={86} />
    <Scissors x={860} y={980} s={1.3} rot={-75} open={0.3 + 0.2 * Math.sin(T * 6)} />
    {t > c && <text x={560} y={430} textAnchor="middle" fontFamily={BB} fontSize={180 * BK((t - c) / 0.3)} fill={A} stroke={K} strokeWidth="6">?</text>}</g>);
}

/* 10 — end: June grinning with the scissors, a "NEW SCENE" chip; comment prompt */
function MGEndGotMe({ T, t, beats }) {
  const c = b(beats, 3, 1.4);
  return (<g><MGBg kind="wall" c1="#f0d9a8" c2="#d7a85e" />
    <Doorway x={250} y={1250} w={240} h={600} open={0.6} />
    <MGBust x={620} y={860} r={230} who="june" mouth="grin" brow="up" look={[-0.3, 0]} bl={BL(T)} />
    <Scissors x={780} y={1180} s={0.8} rot={-30} open={0.2 + 0.2 * Math.abs(Math.sin(T * 3))} />
    <MGChip x={540} y={360} text={t > c ? "COMMENT 'GOT ME'" : 'NEW SCENE'} size={60} pop={t / 0.25} /></g>);
}

Object.assign(window, { MGEndGotMe, MGKitchenHook, MGFridge, MGBackToDesk, MGTheoDoor, MGStudyRooms, MGDoorResult, MGNameDoor, MGScenes, MGScissors });
})();
