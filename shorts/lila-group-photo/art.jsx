// art.jsx — "Why You Look Better in a Group Photo" (Lila ep. 4, retro modern illustration). The cheerleader effect
// (Walker & Vul, Psychological Science 2014). Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
// two friends in the photo (extras drawn with the kit's human)
const F1 = { skin: P.cream, skinD: '#D9C2A0', hair: 'flat', hairCol: P.blk, moustache: false, jacket: P.blue };
const F2 = { skin: P.pink, skinD: P.pinkD, hair: 'bob', hairCol: P.red, moustache: false, lips: true, jacket: P.yel };
const GROUP = ['lila', 'mae', F1, F2];
const uidOf = (s) => 'lg' + s;

// phone: black body, cream screen; children drawn in screen coords (clipped)
function Phone({ x, y, w = 440, h = 760, rot = 0, id = 'p', children, screen = P.blue }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w} height={h} rx={56} fill={P.blk} opacity="0.5" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={56} fill={P.blk} />
    <clipPath id={uidOf(id)}><rect x={-w / 2 + 24} y={-h / 2 + 60} width={w - 48} height={h - 120} rx={18} /></clipPath>
    <rect x={-w / 2 + 24} y={-h / 2 + 60} width={w - 48} height={h - 120} rx={18} fill={screen} />
    <g clipPath={`url(#${uidOf(id)})`}>{children}</g>
    <rect x={-50} y={-h / 2 + 24} width={100} height={14} rx={7} fill="#3a3240" />
    <circle cx={0} cy={h / 2 - 30} r={14} fill="none" stroke="#3a3240" strokeWidth="4" /></g>);
}
// a row of four friends (Lila, Mae + two extras) centred at (x, y = face centre), head scale s
function Row({ x, y, s, moods = ['smile', 'smile', 'smile', 'smile'], gap = 300, dim = -1 }) {
  return (<g>{GROUP.map((w, i) => { const xx = x + (i - 1.5) * gap * s / 0.3;
    return (<g key={i} opacity={dim >= 0 && dim !== i ? 0.35 : 1}><RMHuman x={xx} y={y + (i % 2) * 20 * s / 0.3} s={s} who={w} mouth={moods[i]} brow={moods[i] === 'smile' ? 'up' : 'flat'} lid={0.2} look={[0, 0]} /></g>); })}</g>);
}
// polaroid of the group photo
function GroupPic({ x, y, w = 760, h = 560, s = 0.26, rot = 0, moods, dim, k = 1 }) {
  if (k <= 0) return null;
  const id = uidOf('gp' + Math.round(x) + Math.round(y));
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k)})`}>
    <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w} height={h + 90} fill={P.blk} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h + 90} fill={P.cream} {...ink(6)} />
    <clipPath id={id}><rect x={-w / 2 + 30} y={-h / 2 + 30} width={w - 60} height={h - 40} /></clipPath>
    <rect x={-w / 2 + 30} y={-h / 2 + 30} width={w - 60} height={h - 40} fill={P.blue} />
    <g clipPath={`url(#${id})`}><Row x={0} y={-h * 0.08} s={s} gap={300 * (w / 760) * (0.26 / s) * 0.62} moods={moods} dim={dim} /></g></g>);
}
// thumb-and-finger zoom pinch
// magnifying glass: lens centre (x, y), radius r, handle down-right
function Magnifier({ x, y, r = 170, k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k)})`}>
    <path d={`M${r * 0.7} ${r * 0.7} L${r * 1.9} ${r * 1.9}`} stroke={P.blk} strokeWidth="64" strokeLinecap="round" />
    <path d={`M${r * 0.8} ${r * 0.8} L${r * 1.0} ${r * 1.0}`} stroke={P.yel} strokeWidth="40" />
    <circle r={r} fill="rgba(143,239,255,0.12)" stroke={P.blk} strokeWidth="34" /><circle r={r} fill="none" stroke={P.yel} strokeWidth="14" />
    <path d={`M${-r * 0.55} ${-r * 0.35} A${r * 0.65} ${r * 0.65} 0 0 1 ${-r * 0.2} ${-r * 0.62}`} fill="none" stroke={P.cream} strokeWidth="12" strokeLinecap="round" /></g>);
}
function RedRing({ x, y, r, k }) {
  if (k <= 0) return null;
  const L = 2 * Math.PI * r;
  return <circle cx={x} cy={y} r={r} fill="none" stroke={P.red} strokeWidth="14" strokeDasharray={`${L * cl(k)} ${L}`} transform={`rotate(-90 ${x} ${y})`} style={{ filter: 'drop-shadow(5px 5px 0 #17131A)' }} />;
}

/* 1 — Lila glares at her selfie on the phone; then the screen flips to the group photo and she smiles */
function RMSelfieVsGroup({ T, t, beats }) {
  const c = bt(beats, 2, 1.0), g = t > c;
  return (<g><RMBg kind="red" />
    <Phone x={700} y={640} w={460} h={800} rot={6} id="hook" screen={g ? P.blue : P.yel}>
      {!g && <RMLila x={0} y={20} s={0.62} mouth="frown" brow="angry" lid={0.4} look={[0, 0]} />}
      {g && <Row x={0} y={-30} s={0.17} gap={170} />}
    </Phone>
    <RMLila x={290} y={1170} s={0.62} mouth={g ? 'smile' : 'frown'} brow={g ? 'up' : 'sad'} lid={g ? 0.15 : 0.35} look={[0.8, -0.6]} stress={!g} />
    <RMChip x={540} y={170} text={g ? 'GROUP PHOTO ♥' : 'SELFIE ✕'} col={g ? P.yel : P.cream} size={50} pop={g ? (t - c) / 0.25 : t / 0.25} /></g>);
}

/* 2 — "you": a thumb pinches into one face of a group photo; the study chip lands */
function RMZoomYou({ T, t, beats }) {
  const c = bt(beats, 2, 1.0), z = EO((t - 0.2) / 0.8);
  return (<g><RMBg kind="blue" />
    <Phone x={540} y={760} w={620} h={1040} id="zoom" screen={P.blue}>
      <g transform={`translate(${lp(0, 150, z)} ${lp(0, 40, z)}) scale(${lp(1, 2.1, z)})`}><Row x={0} y={-120} s={0.17} gap={170} /></g>
    </Phone>
    <Magnifier x={540} y={600} r={175} k={(t - 0.6) / 0.35} />
    {t > c && <RMChip x={540} y={170} text="PSYCHOLOGICAL SCIENCE · 2014" size={40} pop={(t - c) / 0.25} />}</g>);
}

/* 3 — snapback: the ring light gets a NOPE stamp → three faces slide into one over a brain */
function RMSnapAverage({ T, t, beats }) {
  const c = bt(beats, 2, 0.9);
  if (t < c) { const k = EO((t - 0.35) / 0.25);
    return (<g><RMBg kind="blue" />
      <line x1={540} y1={1000} x2={540} y2={1400} stroke={P.blk} strokeWidth="18" />
      {[-1, 0, 1].map((sd) => <line key={sd} x1={540} y1={1380} x2={540 + sd * 180} y2={1520} stroke={P.blk} strokeWidth="14" strokeLinecap="round" />)}
      <circle cx={540} cy={760} r={260} fill="none" stroke={P.cream} strokeWidth="70" style={{ filter: 'drop-shadow(0 0 30px #ffe9a0)' }} />
      <circle cx={540} cy={760} r={260} fill="none" stroke={P.blk} strokeWidth="6" /><circle cx={540} cy={760} r={190} fill={P.blueD} />
      {t > 0.35 && <g transform={`translate(540 760) rotate(-10) scale(${1.6 - 0.6 * k})`} opacity={k}>
        <rect x="-300" y="-110" width="600" height="220" fill="none" stroke={P.red} strokeWidth="22" />
        <text y="70" textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="190" fill={P.red}>NOPE</text></g>}
      <RMChip x={540} y={200} text="THE LIGHTING?" col={P.cream} size={50} pop={t / 0.2} /></g>); }
  const lt = t - c, m = EO((lt - 0.15) / 0.8);
  return (<g><RMBg kind="redDark" /><RMBrain cx={540} cy={1260} w={640} h={520} seed={3} />
    {[...Array(7)].map((_, i) => <RMBolt key={i} x={540 + (i - 3) * 24} y={1020} len={140 + (i % 3) * 40} ang={-Math.PI * 0.5 + (i - 3) * 0.35} seed={i + 3} T={T} />)}
    {['lila', 'mae', F1].map((w, i) => <g key={i} opacity={lp(1, 0.5, m)}><RMHuman x={lp(200 + i * 340, 540, m)} y={lp(700 + (i === 1 ? -60 : 0), 680, m)} s={0.34} who={w} body={false} mouth="flat" lid={0.25} /></g>)}
    <RMChip x={540} y={200} text="BRAIN: AVERAGING…" pop={lt / 0.2} size={48} /></g>);
}

/* 4 — the study: the same face in a group photo, then the same photo cropped down to her alone */
function RMStudyCrop({ T, t, beats }) {
  const c = bt(beats, 3, 1.4), k = EO((t - c) / 0.5);
  const cx = lp(0, 1, k);
  return (<g><RMBg kind="red" /><RMGrid x={70} y={340} w={940} h={1000} />
    <RMChip x={540} y={200} text="UC SAN DIEGO · 130+ STUDENTS" pop={t / 0.25} size={40} />
    <GroupPic x={540} y={640} w={800} h={500} s={0.24} k={(t - 0.1) / 0.35} rot={-2} />
    {t > c && <g transform={`translate(${lp(540, 540, k)} ${lp(640, 1110, k)})`}>
      <rect x={-150 + 8} y={-170 + 8} width={300} height={340} fill={P.blk} /><rect x={-150} y={-170} width={300} height={340} fill={P.cream} {...ink(6)} />
      <rect x={-125} y={-145} width={250} height={250} fill={P.blue} />
      <clipPath id="lgcrop"><rect x={-125} y={-145} width={250} height={250} /></clipPath>
      <g clipPath="url(#lgcrop)"><RMLila x={0} y={-10} s={0.3} mouth="smile" brow="up" lid={0.2} /></g>
      <text y={150} textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="36" fill={P.blk}>ALONE</text></g>}
    {t > c && <g opacity={cx}><rect x={540 - 254 - 85} y={490} width={170} height={200} fill="none" stroke={P.red} strokeWidth="10" strokeDasharray="26 16" /></g>}
    <RMChip x={830} y={420} text="GROUP" col={P.cream} size={36} pop={(t - bt(beats, 2, 0.8)) / 0.25} rot={0.04} /></g>);
}

/* 5 — two scorecards: the group version edges ahead */
function RMScoreHigher({ T, t, beats }) {
  const c = bt(beats, 1, 0.6), base = EO((t - 0.1) / 0.6), up = EO((t - c) / 0.6);
  const card = (x, label, h, col, face) => (<g>
    <rect x={x - 200 + 10} y={330} width={400} height={330} fill={P.blk} /><rect x={x - 200} y={320} width={400} height={330} fill={P.cream} {...ink(6)} />
    <rect x={x - 175} y={345} width={350} height={230} fill={P.blue} />{face}
    <text x={x} y={625} textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="40" fill={P.blk}>{label}</text>
    <rect x={x - 110} y={1290 - 560 * h} width={220} height={560 * h} fill={col} {...ink(7)} /></g>);
  return (<g><RMBg kind="red" /><rect x="80" y="1290" width="920" height="12" fill={P.blk} />
    <clipPath id="lgc1"><rect x={95} y={345} width={350} height={230} /></clipPath><clipPath id="lgc2"><rect x={635} y={345} width={350} height={230} /></clipPath>
    {card(270, 'ALONE', 0.5 * base, P.pink, <g clipPath="url(#lgc1)"><RMLila x={270} y={470} s={0.22} mouth="flat" lid={0.3} /></g>)}
    {card(810, 'IN THE GROUP', (0.5 + 0.12 * up) * base, P.yel, <g clipPath="url(#lgc2)">{['mae', 'lila', F1].map((w, i) => <RMHuman key={i} x={700 + i * 110} y={480} s={0.13} who={w} mouth="smile" brow="up" lid={0.2} />)}</g>)}
    {t > c + 0.5 && <g><path d={`M810 ${1290 - 560 * 0.62 - 30} L810 ${1290 - 560 * 0.62 - 140}`} stroke={P.blk} strokeWidth="10" /><path d={`M780 ${1290 - 560 * 0.62 - 120} L810 ${1290 - 560 * 0.62 - 170} L840 ${1290 - 560 * 0.62 - 120} Z`} fill={P.blk} /></g>}
    <RMChip x={540} y={190} text="5 EXPERIMENTS" size={46} pop={t / 0.25} /></g>);
}

/* 6 — name it: the eye macro with the group reflected in the pupil */
function RMNameCheer({ T, t }) {
  return (<g><RMEyeMacro open={EO(t / 0.5)}><g>{['lila', 'mae', F1].map((w, i) => <RMHuman key={i} x={455 + i * 85} y={1010 + (i % 2) * 8} s={0.12} who={w} mouth="smile" brow="up" lid={0.2} />)}</g></RMEyeMacro>
    <RMTitle lines={[['THE CHEERLEADER', P.cream, 140], ['EFFECT', P.yel, 180]]} y={200} a={EO((t - 0.4) / 0.4)} /></g>);
}

/* 7 — four different faces drift together and blend into one smooth average face */
function RMBlendAverage({ T, t, beats }) {
  const m = EO((t - 0.4) / 1.2), c = bt(beats, 3, 1.5), a = EO((t - c) / 0.5);
  const avg = { skin: '#F2AE7E', skinD: '#D9926A', hair: 'flat', hairCol: P.blk, moustache: false, jacket: P.green };
  const SP = [[230, 600], [850, 600], [230, 1080], [850, 1080]];
  return (<g><RMBg kind="blue" />
    {GROUP.map((w, i) => <g key={i} opacity={lp(1, 0.3, m) * (1 - a * 0.9)}><RMHuman x={lp(SP[i][0], 540, m)} y={lp(SP[i][1], 830, m)} s={0.4} who={w} body={false} mouth="flat" lid={0.25} /></g>)}
    {t > c && <g opacity={a}><RMHuman x={540} y={830} s={0.62 * (0.9 + 0.1 * a)} who={avg} body={false} mouth="smile" brow="up" lid={0.15} /></g>}
    {[[220, 520], [860, 560], [230, 1130], [850, 1110]].map(([x, y], i) => <RMBadge key={i} x={x} y={y} r={55} k={(t - c - 0.3 - i * 0.12) / 0.25} />)}
    <RMChip x={540} y={200} text={t > c ? '= AVERAGE FACE' : 'BLENDING…'} col={t > c ? P.yel : P.cream} size={50} pop={t > c ? (t - c) / 0.25 : t / 0.25} /></g>);
}

/* 8 — honest twist: a percentile ruler, the marker creeps from 49 to 51 */
function RMTinyBoost({ T, t, beats }) {
  const c = bt(beats, 2, 1.0), mv = EO((t - c) / 0.8), v = lp(49, 51, mv);
  const X = (p) => 120 + (p - 40) / 20 * 840;
  return (<g><RMBg kind="red" />
    <RMLila x={540} y={1180} s={0.5} mouth={t > c ? 'open' : 'flat'} brow="up" lid={0.1} wide look={[0, -0.8]} />
    <rect x="100" y="720" width="880" height="120" fill={P.cream} {...ink(7)} />
    {[...Array(21)].map((_, i) => <line key={i} x1={X(40 + i)} y1={720} x2={X(40 + i)} y2={720 + (i % 5 ? 30 : 60)} stroke={P.blk} strokeWidth="5" />)}
    {[40, 45, 50, 55, 60].map((p) => <text key={p} x={X(p)} y={820} textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="34" fill={P.blk}>{p}</text>)}
    <g transform={`translate(${X(v)} 700)`}><path d="M-34 -70 L34 -70 L0 0 Z" fill={P.yel} {...ink(6)} /></g>
    {t > c + 0.5 && <path d={`M${X(49)} 880 Q${X(50)} 940 ${X(51)} 880`} fill="none" stroke={P.cream} strokeWidth="8" strokeDasharray="18 12" />}
    <g opacity={EO((t - 0.2) / 0.3)}><text x={548} y={548} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="230" fill={P.blk}>{`${Math.round(v)}TH`}</text>
      <text x={540} y={540} textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="230" fill={P.yel}>{`${Math.round(v)}TH`}</text></g>
    <RMChip x={540} y={190} text="PERCENTILE · TINY BOOST" col={P.cream} size={44} pop={t / 0.25} /></g>);
}

/* 9 — self-proof: a group photo, every face dims but one; the red ring lands on "YOU" */
function RMOneFace({ T, t, beats }) {
  const c = bt(beats, 3, 1.4), d = t > bt(beats, 2, 1.0) ? 1 : -1;
  return (<g><RMBg kind="dark" /><RMBulb x={540} y={-20} T={T} />
    <GroupPic x={540} y={760} w={940} h={620} s={0.3} k={t / 0.3} dim={d > 0 ? 0 : -1} rot={1} />
    <RedRing x={245} y={690} r={125} k={(t - bt(beats, 2, 1.0)) / 0.4} />
    {t > c && <RMChip x={245} y={480} text="YOU" size={56} pop={(t - c) / 0.25} rot={-0.06} />}
    <RMChip x={540} y={200} text="ZOOM 400%" col={P.cream} size={48} pop={t / 0.2} /></g>);
}

/* 10 — Mae shrugs next to Lila; her bubble: nobody zooms in like you */
function RMMaeShrug({ T, t, beats }) {
  const c = bt(beats, 1, 0.6);
  return (<g><RMBg kind="red" />
    <RMLila x={300} y={1080} s={0.62} mouth={t > bt(beats, 3, 1.6) ? 'smile' : 'flat'} brow="up" lid={0.2} look={[0.8, 0]} />
    <RMMae x={790} y={1040} s={0.62} mouth="smile" brow="up" lid={0.3} look={[-0.8, 0]} />
    {[-1, 1].map((sd) => <path key={sd} d={`M${790 + sd * 200} ${1270} q${sd * 50} -60 ${sd * 30} -110`} fill="none" stroke={P.green} strokeWidth="44" strokeLinecap="round" transform={`translate(0 ${-Math.abs(Math.sin(T * 3)) * 12})`} />)}
    <RMSpeech x={560} y={340} text="NOBODY ZOOMS IN" k={(t - c) / 0.3} size={74} col={P.yel} rot={0.03} /></g>);
}

/* 11 — end: Lila takes the selfie again, smiling; zoom back to 100% */
function RMEndZoomed({ T, t, beats }) {
  const c = bt(beats, 2, 1.0), z = EO((t - c) / 0.6);
  return (<g><RMBg kind="red" />
    <Phone x={540} y={720} w={560} h={900} id="end" screen={P.yel}>
      <g transform={`scale(${lp(1.7, 1, z)})`}><RMLila x={0} y={60} s={0.6} mouth="smile" brow="up" lid={0.15} /></g>
    </Phone>
    {[[150, 520], [930, 760], [160, 1080]].map(([x, y], i) => <RMBadge key={i} x={x} y={y} r={55} k={(t - c - 0.2 - i * 0.12) / 0.25} />)}
    <RMChip x={540} y={170} text={t > c ? 'ZOOM 100% · SAME FACE' : 'ZOOM 400%'} col={t > c ? P.yel : P.cream} size={44} pop={t / 0.2} /></g>);
}

Object.assign(window, { RMSelfieVsGroup, RMZoomYou, RMSnapAverage, RMStudyCrop, RMScoreHigher, RMNameCheer, RMBlendAverage, RMTinyBoost, RMOneFace, RMMaeShrug, RMEndZoomed });
})();
