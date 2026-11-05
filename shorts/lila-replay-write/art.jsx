// art.jsx — "Write Down the Thing You Keep Replaying" (Lila ep. 5, with The Critic + Mae; retro modern illustration).
// Expressive writing: Pennebaker & Beall 1986, J Abnormal Psychology (15 min × 4 days; fewer health-centre visits over
// six months). No numbers beyond those on screen. Full 1080×1920 frames with retro-kit.jsx; captions at y ≈ 1540.
(function () {
const { P, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, hsh } = RM;
const bt = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const ink = (w) => ({ stroke: P.blk, strokeWidth: w, strokeLinejoin: 'round', strokeLinecap: 'round' });
const OSW = "'Oswald', sans-serif", BEB = "'Bebas Neue', sans-serif";

// retro TV set; children drawn in screen coords centred at (0,0), screen 520×380
function TV({ x, y, s = 1, children, id = 'tv' }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-330 + 14} y={-250 + 14} width={660} height={500} rx={40} fill={P.blk} />
    <rect x={-330} y={-250} width={660} height={500} rx={40} fill={P.yel} {...ink(8)} />
    <clipPath id={`rmtv${id}`}><rect x={-280} y={-200} width={480} height={400} rx={30} /></clipPath>
    <rect x={-280} y={-200} width={480} height={400} rx={30} fill={P.blue} {...ink(6)} />
    <g clipPath={`url(#rmtv${id})`}>{children}</g>
    {[0, 1].map((i) => <circle key={i} cx={260} cy={-120 + i * 110} r={30} fill={P.cream} {...ink(6)} />)}
    <path d={pts2([[-200, 250], [-240, 330]])} {...ink(10)} /><path d={pts2([[200, 250], [240, 330]])} {...ink(10)} />
  </g>);
}
const pts2 = (a) => 'M' + a.map((p) => p.join(' ')).join(' L');
// notebook, open, with written lines revealed by w (0..1)
function Notebook({ x, y, s = 1, w = 1, rot = 0, closed = false }) {
  if (closed) return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-230 + 12} y={-300 + 12} width={460} height={600} fill={P.blk} /><rect x={-230} y={-300} width={460} height={600} fill={P.blue} {...ink(8)} />
    <rect x={150} y={-300} width={40} height={600} fill={P.red} {...ink(6)} /><rect x={-150} y={-120} width={260} height={110} fill={P.cream} {...ink(5)} />
    <text x={-20} y={-48} textAnchor="middle" fontFamily={BEB} fontSize="64" letterSpacing="4" fill={P.blk}>DONE</text></g>);
  return (<g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-420 + 12} y={-260 + 12} width={840} height={520} fill={P.blk} />
    <rect x={-420} y={-260} width={420} height={520} fill={P.cream} {...ink(7)} /><rect x={0} y={-260} width={420} height={520} fill={P.cream} {...ink(7)} />
    {[...Array(7)].map((_, i) => <g key={i}><line x1={-380} y1={-180 + i * 64} x2={-40} y2={-180 + i * 64} stroke={P.red} strokeOpacity="0.4" strokeWidth="3" />
      <line x1={40} y1={-180 + i * 64} x2={380} y2={-180 + i * 64} stroke={P.red} strokeOpacity="0.4" strokeWidth="3" /></g>)}
    {[...Array(10)].map((_, i) => { const L = 280 - hsh(i + 3) * 120, k = cl(w * 10 - i), side = i < 5 ? -1 : 1, row = i % 5;
      return k > 0 && <path key={'w' + i} d={`M${side < 0 ? -370 : 50} ${-196 + row * 64} q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} fill="none" stroke={P.blk} strokeWidth="6" strokeDasharray={`${L * k} 400`} />; })}
  </g>);
}
// fountain pen: nib at (0,0), pointing down-left by rot
function Pen({ x, y, s = 1, rot = 35 }) {
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 0 L-26 -70 L26 -70 Z" fill={P.yel} {...ink(6)} /><line x1="0" y1="-8" x2="0" y2="-50" stroke={P.blk} strokeWidth="5" />
    <rect x={-34} y={-330} width={68} height={260} rx={14} fill={P.blk} /><rect x={-34} y={-330} width={68} height={50} fill={P.red} />
    <rect x={30} y={-300} width={12} height={150} fill={P.yel} {...ink(4)} /></g>);
}

/* 1 — the replay: Lila cringes at a TV in her head showing the meeting: "THANKS, MUM!" */
function RMReplayMum({ T, t, beats }) {
  const c = bt(beats, 3, 1.4), scan = (T * 200) % 400;
  return (<g><RMBg kind="dark" /><RMBulb x={170} y={260} T={T} />
    <TV x={600} y={560} s={0.95} id="h">
      <rect x={-280} y={-200} width={480} height={400} fill={P.redD} />
      <path d={pts2([[-280, 120], [200, 120]])} {...ink(8)} />
      <rect x={-260} y={60} width={440} height={60} fill={P.blk} />
      <RMOtto x={70} y={30} s={0.32} mouth="flat" brow="up" lid={0.2} look={[-0.5, 0]} />
      <RMLila x={-160} y={60} s={0.3} mouth="open" brow="up" lid={0.1} look={[0.8, 0]} />
      <rect x={-280} y={-200 + scan} width={480} height={6} fill={P.cream} opacity="0.15" />
      <path d="M-250 -170 L-215 -150 L-250 -130 Z" fill={P.cream} />
      <text x={-200} y={-138} fontFamily={OSW} fontWeight="700" fontSize="30" fill={P.cream}>REPLAY</text>
    </TV>
    <RMLila x={250} y={1110} s={0.62} mouth="frown" brow="sad" lid={0.35} look={[0.8, -0.6]} stress />
    {t > c && <RMSpeech x={680} y={1010} text="THANKS, MUM!" size={66} k={(t - c) / 0.3} />}
    <RMChip x={760} y={170} text="REPLAY #47" col={P.cream} size={46} pop={t / 0.25} /></g>);
}

/* 2 — the loop: the Critic's hand keeps pressing REPLAY while the words circle Lila's head */
function RMLoopYou({ T, t, beats }) {
  const press = Math.max(0, Math.sin(T * 5));
  return (<g><RMBg kind="red" />
    <RMLoopRings T={T} text="THANKS, MUM" cx={540} cy={860} />
    <RMLila x={540} y={940} s={0.6} mouth="frown" brow="sad" lid={0.4} look={[0, -0.4]} />
    <g transform="translate(840 330)"><rect x={-110} y={-70} width={220} height={140} fill={P.cream} {...ink(7)} />
      <path d="M-30 -40 L40 0 L-30 40 Z" fill={P.red} {...ink(5)} /><text x={0} y={110} textAnchor="middle" fontFamily={OSW} fontWeight="700" fontSize="34" fill={P.cream}>REPLAY</text></g>
    <RMHand x={860} y={150 + press * 60} s={0.8} rot={Math.PI} press={press} />
    <RMChip x={260} y={200} text="ON LOOP" pop={t / 0.25} size={52} /></g>);
}

/* 3 — snapback: a giant pen slices through the rings; the loop stops on a notebook page */
function RMSnapPen({ T, t, beats }) {
  const c = bt(beats, 2, 1.0), cut = EO((t - c + 0.3) / 0.5), w = cl((t - c) / 1.2);
  return (<g><RMBg kind="blue" />
    {cut < 1 && <g opacity={1 - cut}><RMLoopRings T={T * (1 - cut)} text="THANKS, MUM" cx={540} cy={860} /></g>}
    <Notebook x={540} y={960} s={1.0} w={w} rot={-3} />
    <Pen x={lp(980, 200 + w * 300, cut)} y={lp(260, 860 + Math.sin(T * 14) * 8 * w, cut)} s={1.2} rot={40} />
    <RMChip x={540} y={200} text={t > c ? 'WRITE IT DOWN' : 'FORGET IT?'} col={t > c ? P.yel : P.cream} size={52} pop={t > c ? (t - c) / 0.25 : t / 0.25} /></g>);
}

/* 4 — the study: grid paper; three students writing; an alarm clock; chip with 1986 · 15 MIN × 4 DAYS */
function RMStudyWrite({ T, t, beats }) {
  const c4 = bt(beats, 4, 2.4);
  return (<g><RMBg kind="red" /><RMGrid x={60} y={330} w={960} h={1000} />
    <RMChip x={540} y={200} text="1986 · STUDENTS" pop={t / 0.25} size={46} />
    {[0, 1, 2].map((i) => { const x = 220 + i * 320, y = 980;
      return (<g key={i}><RMHuman x={x} y={y - 120} s={0.26} who={[{ skin: P.pink, skinD: P.pinkD, hair: 'flat', hairCol: P.blk, moustache: false, jacket: P.blue }, { skin: P.yel, skinD: '#D9A62A', hair: 'bob', hairCol: P.red, moustache: false, lips: true, jacket: P.green }, { skin: P.cream, skinD: '#D9C2A0', hair: 'curly', hairCol: P.blk, moustache: false, jacket: P.redD }][i]} mouth="flat" brow="sad" lid={0.5} look={[0, 1]} />
        <rect x={x - 140} y={y + 40} width={280} height={30} fill={P.blk} />
        <rect x={x - 90} y={y - 10} width={180} height={50} fill={P.cream} {...ink(4)} />
        <Pen x={x + 30 + Math.sin(T * 9 + i) * 20} y={y + 10} s={0.35} rot={30} /></g>); })}
    <RMAlarm x={540} y={1240} T={T} ring={0} s={0.45} />
    {t > c4 && <RMChip x={830} y={1240} text="15 MIN × 4 DAYS" col={P.cream} size={40} pop={(t - c4) / 0.25} />}</g>);
}

/* 5 — the result: a health-centre door; the WROTE line of footprints is shorter than the CONTROL line */
function RMClinicLess({ T, t, beats }) {
  const c = bt(beats, 4, 2.0), a = EO((t - 0.2) / 1.2), b2 = EO((t - c + 0.4) / 0.8);
  return (<g><RMBg kind="blue" />
    <RMChip x={540} y={200} text="NEXT 6 MONTHS" pop={t / 0.25} size={46} />
    <g transform="translate(540 600)"><rect x={-260 + 12} y={-200 + 12} width={520} height={400} fill={P.blk} /><rect x={-260} y={-200} width={520} height={400} fill={P.cream} {...ink(8)} />
      <rect x={-90} y={0} width={180} height={200} fill={P.red} {...ink(6)} /><rect x={-22} y={-170} width={44} height={130} fill={P.red} /><rect x={-65} y={-127} width={130} height={44} fill={P.red} />
      <text x={0} y={-10} textAnchor="middle" fontFamily={OSW} fontWeight="700" fontSize="34" fill={P.blk}>HEALTH CENTRE</text></g>
    {[['DIDN\'T WRITE', P.cream, 1, 900], ['WROTE', P.yel, 0.55, 1120]].map(([l, col, len, y], i) => { const k = i ? b2 * len : a * len;
      return (<g key={l}><text x={90} y={y - 30} fontFamily={OSW} fontWeight="700" fontSize="40" fill={P.cream}>{l}</text>
        {[...Array(8)].map((_, j) => j / 8 < k && <ellipse key={j} cx={120 + j * 110} cy={y + 40 + (j % 2) * 30} rx={28} ry={44} fill={col} {...ink(5)} />)}</g>); })}
    {t > c && <RMChip x={760} y={1300} text="FEWER VISITS" pop={(t - c) / 0.25} size={44} />}</g>);
}

/* 6 — name it: cyan sparks run from Lila's head down into a notebook; stacked title */
function RMNameExpressive({ T, t }) {
  return (<g><RMBg kind="redDark" />
    <RMTitle lines={[['EXPRESSIVE', P.cream, 150], ['WRITING', P.yel, 170]]} y={250} a={EO(t / 0.35)} />
    <RMLila x={330} y={860} s={0.5} body={false} mouth="flat" brow="up" lid={0.3} look={[0.8, 0.8]} />
    {[...Array(5)].map((_, i) => <RMBolt key={i} x={460 + i * 40} y={960 + i * 30} len={260} ang={Math.PI * 0.32 + i * 0.05} seed={i + 2} T={T} />)}
    <Notebook x={700} y={1180} s={0.62} w={cl(t / 1.5)} rot={4} /></g>);
}

/* 7 — the Critic, pressed flat onto a page, yawns; written down, he's just a boring paragraph */
function RMCriticPaper({ T, t, beats }) {
  const c = bt(beats, 3, 1.6), sq = EO((t - 0.2) / 0.6);
  return (<g><RMBg kind="red" />
    <RMChip x={540} y={200} text="THE CRITIC" col={P.cream} pop={t / 0.25} size={46} />
    <rect x={160 + 14} y={420 + 14} width={760} height={900} fill={P.blk} /><rect x={160} y={420} width={760} height={900} fill={P.cream} {...ink(8)} />
    {[...Array(11)].map((_, i) => <line key={i} x1={210} y1={500 + i * 70} x2={870} y2={500 + i * 70} stroke={P.red} strokeOpacity="0.35" strokeWidth="3" />)}
    <g transform={`translate(540 ${lp(780, 820, sq)}) scale(${lp(1, 1.3, sq)} ${lp(1, 0.55, sq)})`}><RMCritic x={0} y={0} s={0.5} body={false} mouth={t > c ? 'o' : 'flat'} sad lid={0.75} /></g>
    {[...Array(4)].map((_, i) => <line key={i} x1={230} y1={1010 + i * 70} x2={230 + (i === 3 ? 380 : 620) * sq} y2={1010 + i * 70} stroke={P.blk} strokeWidth="7" strokeLinecap="round" />)}
    {t > c && <RMChip x={760} y={560} text="ZZZ" col={P.yel} pop={(t - c) / 0.25} size={50} rot={0.08} />}</g>);
}

/* 8 — self-proof: Lila in the shower, fist up, winning an argument with no one */
function RMShowerArgue({ T, t, beats }) {
  return (<g><RMBg kind="blue" />
    <g transform="translate(700 260)"><rect x={-200} y={-30} width={260} height={30} fill={P.blk} /><path d="M60 -30 L60 40 L140 40" fill="none" {...ink(18)} />
      <ellipse cx={-70} cy={20} rx={130} ry={40} fill={P.cream} {...ink(7)} />
      {[...Array(9)].map((_, i) => { const x = -170 + i * 25, ph = (T * 2 + i * 0.13) % 1; return <line key={i} x1={x - ph * 40} y1={70 + ph * 600} x2={x - ph * 40 - 8} y2={120 + ph * 600} stroke={P.cyan} strokeWidth="6" strokeLinecap="round" />; })}</g>
    <RMLila x={500} y={1000} s={0.62} mouth="shout" brow="angry" lid={0.1} look={[0.9, -0.3]} />
    <RMSpeech x={560} y={380} text="AND ANOTHER THING!" size={58} k={t / 0.3} />
    <RMChip x={250} y={1300} text="WINNER: YOU" col={P.yel} pop={(t - 0.8) / 0.25} size={40} /></g>);
}

/* 9 — Mae hands Lila a pen; an alarm clock set to fifteen minutes */
function RMMaePen({ T, t, beats }) {
  const c = bt(beats, 2, 1.4);
  return (<g><RMBg kind="red" />
    <RMMae x={760} y={1050} s={0.58} mouth="smile" brow="up" lid={0.25} look={[-0.8, 0]} />
    <RMLila x={260} y={1110} s={0.55} mouth={t > c ? 'smile' : 'flat'} brow="up" lid={0.3} look={[0.8, -0.2]} />
    <Pen x={lp(640, 520, EO(t / 0.6))} y={800} s={0.6} rot={-60} />
    <RMAlarm x={540} y={360} T={T} ring={0} s={0.6} />
    <RMChip x={540} y={580} text="15:00" col={P.cream} pop={t / 0.25} size={52} />
    {t > c && <RMChip x={540} y={130} text="THEN CLOSE IT" pop={(t - c) / 0.25} size={44} />}</g>);
}

/* 10 — end: the notebook snaps shut; Lila smiles; a flower straightens */
function RMEndDown({ T, t, beats }) {
  const shut = t > 0.6;
  return (<g><RMBg kind="redDark" />
    {!shut ? <Notebook x={600} y={700} s={0.7} w={1} rot={-4} /> : <Notebook x={640} y={700} s={0.75} closed rot={6} />}
    <RMFlower x={880} y={1180} s={0.9} droop={1 - EO((t - 0.8) / 0.8)} stem={260} />
    <RMLila x={300} y={1100} s={0.6} mouth="smile" brow="up" lid={0.2} look={[0.8, -0.5]} />
    <RMChip x={540} y={170} text="LOOP: OFF" pop={(t - 0.6) / 0.25} size={52} /></g>);
}

Object.assign(window, { RMReplayMum, RMLoopYou, RMSnapPen, RMStudyWrite, RMClinicLess, RMNameExpressive, RMCriticPaper, RMShowerArgue, RMMaePen, RMEndDown });
})();
