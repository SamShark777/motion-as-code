// art.jsx — "Your Favourite Letter Is Probably In Your Name" (Gus ep. 4, experiment log; Ivy cameo).
// Name-letter effect: Nuttin 1985 (European Journal of Social Psychology): people circled the letter they liked more in letter
// pairs and preferred letters from their own name; Nuttin 1987: 12 European languages, 2,047 students, the effect was clear for
// initials in every language. Each scene draws ONLY the 1080×608 panel with xplog-kit.jsx; the engine draws HUD + caption.
(function () {
const { ACC: A, RED: R, INK: K, CREAM: C, NAVY: N, GREY: G, GREEN: GR, BLUE: BL, clamp: cl, eo: EO, back: BK, osc: OS, hsh, beat: B } = XL;
const blink = (T, ph = 0) => (((T + ph) % 3.4) > 3.26 ? 1 : 0);
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/* a letter tile; hot = highlighted, circ = 0..1 ring drawn around it */
function Tile({ x, y, ch, s = 1, hot = false, circ = 0, dim = false }) {
  const len = 2 * Math.PI * 64;
  return (<g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? 0.35 : 1}>
    <rect x={-52} y={-52} width={104} height={104} rx={16} fill={K} transform="translate(6 6)" />
    <rect x={-52} y={-52} width={104} height={104} rx={16} fill={hot ? A : C} stroke={K} strokeWidth="6" />
    <XLText x={0} y={22} size={64} fill={K} anchor="middle">{ch}</XLText>
    {circ > 0 && <circle r={64} fill="none" stroke={R} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${len * cl(circ)} ${len}`} transform="rotate(-90)" />}</g>);
}
/* a letter pair card for one round: left vs right; pick = 'L' | 'R'; at = when the circle starts */
function PairRound({ t, a, b, pick = 'L', at = 1, n }) {
  const c = cl((t - at) / 0.4);
  return (<g>
    <XLCard x={250} y={90} w={580} h={330} r={26} />
    <XLText x={540} y={150} size={30} fill={G} anchor="middle">{`PAIR ${n} · CIRCLE THE ONE YOU LIKE`}</XLText>
    <Tile x={370} y={280} ch={a} s={1.4} circ={pick === 'L' ? c : 0} hot={pick === 'L' && c > 0.9} />
    <XLText x={540} y={300} size={44} fill={G} anchor="middle">OR</XLText>
    <Tile x={710} y={280} ch={b} s={1.4} circ={pick === 'R' ? c : 0} hot={pick === 'R' && c > 0.9} dim={c > 0.9 && pick === 'L'} /></g>);
}

/* 1 — the alphabet; a finger hovering; "PICK ONE" */
function XGLetter({ T, t, beats }) {
  const n = Math.max(0, Math.min(26, Math.floor(t * 30)));
  return (<g><XLBg kind="wall" />
    {ABC.split('').slice(0, n).map((ch, i) => <Tile key={i} x={110 + (i % 9) * 107} y={110 + Math.floor(i / 9) * 150} ch={ch} s={0.8} hot={B(beats, 2, 1.2) < t && ch === 'G' && OS(T, 0.6) > 0} />)}
    <XLPop t={t} at={B(beats, 2, 1.2)}><XLChip x={540} y={545} text="PICK YOUR FAVOURITE" fill={A} col={K} size={30} /></XLPop></g>);
}
/* 2 — Gus picks G, "it just looks nice" */
function XGLooks({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" />
    <XLChar x={300} y={320} s={1.15} who="gus" mood="smile" look={[18, -6]} bl={blink(T)} />
    <XLPop t={t} at={0.2}><g transform={`rotate(${OS(T, 2) * 3} 760 230)`}><Tile x={760} y={230} ch="G" s={2.2} hot /></g></XLPop>
    <XLFade t={t} at={B(beats, 1, 0.6)}><XLCard x={560} y={420} w={420} h={110} r={18} />
      <XLText x={770} y={490} size={34} fill={K} anchor="middle">"IT JUST LOOKS NICE."</XLText></XLFade></g>);
}
/* 3 — snapback: a name tag slides in under the G: HELLO MY NAME IS … */
function XGName({ T, t, beats }) {
  const b3 = B(beats, 3, 1.3), k = EO((t - b3 + 0.3) / 0.4);
  return (<g><XLBg kind="wall" />
    <Tile x={540} y={170} ch="?" s={1.6} hot />
    {k > 0 && <g transform={`translate(0 ${(1 - k) * 320})`}>
      <rect x={250} y={300} width={580} height={250} rx={24} fill={R} stroke={K} strokeWidth="7" />
      <XLText x={540} y={350} size={30} fill="#fff" anchor="middle">HELLO, MY NAME IS</XLText>
      <rect x={280} y={370} width={520} height={150} rx={12} fill="#fff" stroke={K} strokeWidth="5" />
      <XLText x={540} y={475} size={80} fill={K} anchor="middle">YOU</XLText></g>}</g>);
}
/* 4–6 — the rounds: G or P, S or T, U or R */
function XGRound1({ T, t, beats }) { return (<g><XLBg kind="wall" /><PairRound t={t} a="G" b="P" pick="L" at={B(beats, 2, 1.0) - 0.2} n={1} />
  <XLChar x={130} y={470} s={0.7} who="gus" mood="smile" look={[14, -10]} bl={blink(T)} /></g>); }
function XGRound2({ T, t, beats }) { return (<g><XLBg kind="wall" /><PairRound t={t} a="T" b="S" pick="R" at={B(beats, 2, 1.0) - 0.2} n={2} />
  <XLChar x={130} y={470} s={0.7} who="gus" mood="neutral" look={[14, -10]} bl={blink(T, 0.7)} /></g>); }
function XGRound3({ T, t, beats }) {
  const b2 = B(beats, 2, 1.0), b3 = B(beats, 3, 1.6), done = t > b3 - 0.1;
  return (<g><XLBg kind={done ? 'wallDark' : 'wall'} />
    {!done && <PairRound t={t} a="U" b="R" pick="L" at={0.5} n={3} />}
    {!done && t > b2 - 0.1 && <XLChar x={130} y={470} s={0.7} who="gus" mood="wide" look={[14, -10]} bl={0} />}
    {done && <g><XLGlow x={540} y={260} r={330} col={A} a={0.4} />
      {['G', 'U', 'S'].map((ch, i) => <XLPop key={i} t={t} at={b3 - 0.1 + i * 0.12}><Tile x={360 + i * 180} y={250} ch={ch} s={1.5} hot /></XLPop>)}
      <XLFade t={t} at={b3 + 0.3}><XLStamp x={540} y={480} text="IT'S HIS NAME" size={44} /></XLFade></g>}</g>);
}
/* 7 — the study: a 1985 answer sheet of letter pairs, some circled */
function XGStudy({ T, t, beats }) {
  const pairs = [['B', 'K'], ['M', 'A'], ['E', 'Z'], ['L', 'H'], ['N', 'W'], ['O', 'X']];
  return (<g><XLBg kind="wood" />
    <XLCard x={190} y={40} w={700} h={530} r={14} rot={-2} />
    <XLText x={540} y={110} size={34} fill={K} anchor="middle">LETTER TEST · 1985</XLText>
    {pairs.map(([a, b], i) => { const x = 330 + (i % 2) * 400, y = 210 + Math.floor(i / 2) * 120, at = 0.6 + i * 0.3;
      return (<g key={i}><Tile x={x - 70} y={y} ch={a} s={0.75} circ={i % 3 !== 1 ? (t - at) / 0.3 : 0} /><Tile x={x + 50} y={y} ch={b} s={0.75} circ={i % 3 === 1 ? (t - at) / 0.3 : 0} /></g>); })}
    <XLFade t={t} at={B(beats, 4, 2.2)}><XLChip x={540} y={575} text="CIRCLE ONE IN EACH PAIR" fill={A} col={K} size={24} /></XLFade></g>);
}
/* 8 — result: name letters lit up more often (bars: own-name letters vs other letters, no numbers) */
function XGResult({ T, t, beats }) {
  const k = EO((t - 0.3) / 1.0), b3 = B(beats, 2, 1.0);
  return (<g><XLBg kind="wallDark" />
    <XLText x={540} y={70} size={30} fill={G} anchor="middle">LETTERS PEOPLE PICKED</XLText>
    {[['OTHER LETTERS', 0.5, G], ['LETTERS IN THEIR NAME', 0.82, A]].map(([lab, v, col], i) => { const show = i === 0 ? k : EO((t - b3 + 0.3) / 0.8);
      return (<g key={i}><XLText x={120} y={180 + i * 190} size={30} fill="#fff">{lab}</XLText>
        <rect x={120} y={200 + i * 190} width={840} height={80} rx={40} fill={N} stroke={K} strokeWidth="6" />
        {show > 0 && <rect x={126} y={206 + i * 190} width={828 * v * show} height={68} rx={34} fill={col} />}</g>); })}
    <XLText x={540} y={580} size={22} fill={G} anchor="middle">ILLUSTRATION · NOT TO SCALE</XLText></g>);
}
/* 9 — 1987: twelve language flags-as-cards popping in a grid, initials highlighted */
function XGLanguages({ T, t, beats }) {
  const hello = ['HALLO', 'HELLO', 'BONJOUR', 'CIAO', 'HOLA', 'OLÁ', 'HEJ', 'MOI', 'HEI', 'ΓΕΙΑ', 'SZIA', 'AHOJ'];
  return (<g><XLBg kind="wall" />
    {hello.map((h, i) => { const x = 150 + (i % 4) * 260, y = 90 + Math.floor(i / 4) * 160;
      return <XLPop key={i} t={t} at={0.1 + i * 0.09}><XLCard x={x - 110} y={y - 50} w={220} h={110} r={16} fill={i % 3 === 0 ? A : C} />
        <XLText x={x} y={y + 18} size={40} fill={K} anchor="middle">{h}</XLText></XLPop>; })}
    <XLFade t={t} at={B(beats, 2, 1.8)}><XLChip x={540} y={560} text="12 LANGUAGES · 2,047 STUDENTS" fill={R} size={28} /></XLFade></g>);
}
/* 10 — name it: NAME-LETTER EFFECT on a case-file card */
function XGEffect({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" />
    <XLRise t={t} at={0}><XLCard x={190} y={110} w={700} h={390} r={20} />
      <XLText x={540} y={190} size={30} fill={G} anchor="middle">CASE FILE · 1985</XLText>
      <XLText x={540} y={300} size={78} fill={K} anchor="middle">NAME-LETTER</XLText>
      <XLText x={540} y={400} size={78} fill={R} anchor="middle">EFFECT</XLText></XLRise>
    <XLPop t={t} at={B(beats, 1, 0.6)}><XLStamp x={820} y={130} text="REAL" size={40} rot={8} /></XLPop></g>);
}
/* 11 — self-proof: a username field with the initials glowing */
function XGUsername({ T, t, beats }) {
  const typed = 'gus_g92'.slice(0, Math.max(0, Math.min(7, Math.floor(t * 9))));
  const b2 = B(beats, 2, 1.4);
  return (<g><XLBg kind="room" />
    <XLCard x={190} y={120} w={700} h={360} r={24} />
    <XLText x={250} y={200} size={32} fill={G}>USERNAME</XLText>
    <rect x={250} y={230} width={580} height={110} rx={16} fill="#fff" stroke={K} strokeWidth="6" />
    {typed.split('').map((ch, i) => <XLText key={i} x={300 + i * 62} y={305} size={60} fill={K} anchor="middle">{ch}</XLText>)}
    {OS(T, 0.5) > 0 && typed.length < 7 && <rect x={272 + typed.length * 62} y={250} width={6} height={70} fill={K} />}
    {t > b2 && <g><circle cx={300} cy={287} r={40} fill="none" stroke={R} strokeWidth="8" /><circle cx={548} cy={287} r={40} fill="none" stroke={R} strokeWidth="8" /></g>}
    <XLFade t={t} at={b2}><XLText x={540} y={440} size={34} fill={K} anchor="middle">INITIALS IN IT?</XLText></XLFade></g>);
}
/* 12 — payoff: Gus hugging his G; Ivy rolling her eyes with an I */
function XGMine({ T, t, beats }) {
  return (<g><XLBg kind="wall" />
    <XLChar x={280} y={320} s={1} who="gus" mood="relief" look={[0, 0]} bl={blink(T)} />
    <Tile x={420} y={420} ch="G" s={1.1} hot />
    <XLChar x={800} y={320} s={1} who="ivy" mood="squint" look={[-16, 0]} bl={blink(T, 1.2)} />
    <XLPop t={t} at={B(beats, 3, 1.4)}><Tile x={660} y={420} ch="I" s={1.1} hot /></XLPop>
    <XLPop t={t} at={B(beats, 3, 1.4) + 0.2}><XLChip x={540} y={80} text="NOT VANITY · OWNERSHIP" fill={A} col={K} size={28} /></XLPop></g>);
}
/* 13 — your turn: an empty tile with a blinking ? and a name tag */
function XGAsk({ T, t, beats }) {
  return (<g><XLBg kind="wallDark" />
    <XLPulse T={T}><Tile x={360} y={300} ch="?" s={2.2} hot /></XLPulse>
    <rect x={560} y={190} width={380} height={220} rx={22} fill={R} stroke={K} strokeWidth="7" />
    <XLText x={750} y={240} size={26} fill="#fff" anchor="middle">MY NAME IS</XLText>
    <rect x={585} y={260} width={330} height={120} rx={12} fill="#fff" stroke={K} strokeWidth="5" />
    <rect x={620} y={330} width={260} height={6} rx={3} fill={G} />
    <XLFade t={t} at={B(beats, 1, 0.6)}><XLText x={540} y={540} size={34} fill={A} anchor="middle">IN YOUR NAME? COMMENT IT.</XLText></XLFade></g>);
}
/* 14 — share: a paper plane flies to "THAT FRIEND" */
function XGShare({ T, t, beats }) {
  const k = EO(t / 1.2);
  return (<g><XLBg kind="wall" />
    <g transform={`translate(${230 + k * 40} ${300 - k * 10})`}><circle r={110} fill={A} stroke={K} strokeWidth="7" />
      <path d="M-50 10 L60 -45 L20 60 L5 20 Z" fill="#fff" stroke={K} strokeWidth="6" strokeLinejoin="round" /></g>
    <path d={`M380 300 L${380 + 260 * k} 300`} stroke="#fff" strokeWidth="8" strokeDasharray="22 16" />
    <XLPop t={t} at={0.9}><XLCard x={690} y={150} w={250} h={300} r={20} />
      <Tile x={815} y={260} ch="A" s={1} hot /><XLText x={815} y={400} size={26} fill={K} anchor="middle">THAT FRIEND</XLText></XLPop></g>);
}

Object.assign(window, { XGLetter, XGLooks, XGName, XGRound1, XGRound2, XGRound3, XGStudy, XGResult, XGLanguages, XGEffect, XGUsername, XGMine, XGAsk, XGShare });
})();
