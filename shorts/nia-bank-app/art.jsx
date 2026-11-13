// art.jsx — "Why You Stop Checking Your Bank App When It's Bad" (Nia ep. 10, with Milo; ted-MG motion graphics).
// Ostrich effect: Karlsson, Loewenstein & Seppi 2009 (J Risk & Uncertainty) — Swedish pension savers and US Vanguard clients
// looked up their portfolios more in rising markets, less in flat or falling ones. No numbers on screen. Full 1080×1920 frames
// with tedmg-kit.jsx; captions at y ≈ 1480 — faces stay out of y 1370–1590.
(function () {
const { AMB: A, RED: R, INK: K, clamp: cl, lerp: lp, sm: SM, eo: EO, back: BK, blink: BL, hsh } = MG;
const b = (beats, i, d = 99) => (beats && beats[i] != null ? beats[i] : d);
const BB = "'Bebas Neue', sans-serif", OS = "'Oswald', sans-serif";
const GREEN = '#4f9d78', BLUE = '#3f7fbf';

/* a phone; flip 0 = screen up (bank app), 1 = face down (back of the phone) */
function BankPhone({ x, y, s = 1, rot = 0, flip = 0, T = 0, ping = 0, bal = '-£48', red = true }) {
  const sx = Math.cos(flip * Math.PI), back = flip > 0.5;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * Math.max(0.04, Math.abs(sx))} ${s})`}>
    <rect x="-150" y="-280" width="300" height="560" rx="44" fill={back ? '#3a3550' : '#1c1a26'} stroke={K} strokeWidth="9" />
    {back ? (<g><circle cx="-80" cy="-210" r="26" fill="#25212b" stroke="#57506e" strokeWidth="6" /><circle cx="-80" cy="-150" r="18" fill="#25212b" stroke="#57506e" strokeWidth="5" /></g>)
      : (<g><rect x="-128" y="-250" width="256" height="500" rx="26" fill="#f4efe4" />
        <rect x="-128" y="-250" width="256" height="90" rx="26" fill={BLUE} /><text y="-192" textAnchor="middle" fontFamily={BB} fontSize="46" fill="#fff">MY BANK</text>
        <text y="-110" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="24" fill="#6b6478">BALANCE</text>
        <text y="-40" textAnchor="middle" fontFamily={BB} fontSize="92" fill={red ? R : GREEN}>{bal}</text>
        {[0, 1, 2].map((i) => <g key={i}><rect x="-104" y={20 + i * 70} width="208" height="52" rx="10" fill="#e6dfd2" /><rect x="-90" y={38 + i * 70} width={90 + hsh(i) * 40} height="16" rx="8" fill="#b9b0a2" /><text x="92" y={52 + i * 70} textAnchor="end" fontFamily={OS} fontWeight="700" fontSize="24" fill={R}>-£{12 + i * 9}</text></g>)}</g>)}
    {ping > 0 && !back && <g transform={`translate(120 -260) scale(${BK(ping)})`}><circle r="40" fill={R} stroke={K} strokeWidth="6" /><text y="16" textAnchor="middle" fontFamily={BB} fontSize="48" fill="#fff">!</text></g>}</g>);
}
function Envelope({ x, y, s = 1, rot = 0, label = 'BILL', col = '#f4efe4', k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${BK(k) * s})`}><rect x="-150" y="-95" width="300" height="190" rx="10" fill={col} stroke={K} strokeWidth="7" />
    <path d="M-150 -95 L0 15 L150 -95" fill="none" stroke={K} strokeWidth="6" strokeLinejoin="round" />
    <rect x="-70" y="35" width="140" height="44" rx="6" fill={R} stroke={K} strokeWidth="5" /><text y="68" textAnchor="middle" fontFamily={BB} fontSize="36" fill="#fff">{label}</text></g>);
}
/* simple ostrich, side view; head = 0 up, 1 buried */
function Ostrich({ x, y, s = 1, head = 0, T = 0 }) {
  const hx = lp(170, 150, head), hy = lp(-330, 120, head);
  return (<g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 60 L-50 260 M40 60 L60 260" stroke={K} strokeWidth="14" strokeLinecap="round" />
    <path d="M-60 260 L-20 260 M50 260 L90 260" stroke={K} strokeWidth="12" strokeLinecap="round" />
    <path d={`M80 -40 Q${150} ${lp(-180, -40, head)} ${hx} ${hy}`} fill="none" stroke={K} strokeWidth="34" strokeLinecap="round" />
    <path d={`M80 -40 Q${150} ${lp(-180, -40, head)} ${hx} ${hy}`} fill="none" stroke="#e9c7b0" strokeWidth="22" strokeLinecap="round" />
    <ellipse cx="0" cy="0" rx="170" ry="110" fill="#2b2838" stroke={K} strokeWidth="8" />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-150 + i * 20} ${-50 + i * 25} q-60 ${-30 + Math.sin(T * 3 + i) * 10} -90 10`} fill="none" stroke="#f4efe4" strokeWidth="12" strokeLinecap="round" />)}
    {head < 0.6 && <g><circle cx={hx} cy={hy} r="34" fill="#e9c7b0" stroke={K} strokeWidth="6" /><circle cx={hx + 8} cy={hy - 6} r="7" fill={K} /><path d={`M${hx + 28} ${hy} l40 8 l-40 8`} fill={A} stroke={K} strokeWidth="5" strokeLinejoin="round" /></g>}</g>);
}
function Arrow({ x, y, up = true, col = GREEN, s = 1, k = 1 }) {
  if (k <= 0) return null;
  return (<g transform={`translate(${x} ${y}) scale(${BK(k) * s}) rotate(${up ? 0 : 180})`}><path d="M0 -130 L100 -10 L40 -10 L40 120 L-40 120 L-40 -10 L-100 -10 Z" fill={col} stroke={K} strokeWidth="9" strokeLinejoin="round" /></g>);
}

/* 1 — Nia at the kitchen table, bank app pings red; on "flips" she turns the phone face down */
function MGNiaBankPing({ T, t, beats }) {
  const c1 = b(beats, 1, 0.6), c3 = b(beats, 3, 1.4), f = SM(c3, c3 + 0.5, t);
  const shake = t > c1 && f < 0.1 ? Math.sin(T * 60) * 8 : 0;
  return (<g><MGBg kind="room" />
    <rect x="-40" y="1060" width="1160" height="80" fill="#a87a52" stroke={K} strokeWidth="8" />
    <MGBust x={540} y={690} r={170} who="nia" mouth={f > 0.5 ? 'flat' : 'o'} brow="worried" look={[0, 1]} bl={BL(T)} />
    <MGMug x={850} y={980} />
    <BankPhone x={540 + shake} y={980 - f * 40} s={0.62} rot={lp(-6, 4, f)} flip={f} T={T} ping={(t - c1) / 0.25} />
    <MGChip x={540} y={240} text="FRIDAY · BAD WEEK" size={46} pop={t / 0.25} />
    {t > c1 && f < 0.5 && <MGChip x={820} y={430} text="NEW ALERT" col={R} txt="#fff" size={40} pop={(t - c1) / 0.25} />}</g>);
}

/* 2 — you: a doormat pile of unopened envelopes and red notification bubbles, a hand covering eyes */
function MGYouUnopened({ T, t, beats }) {
  const c3 = b(beats, 3, 1.3);
  const env = [['BILL', 260, 420, -10], ['BANK', 800, 380, 8], ['DENTIST', 300, 760, 6], ['TAX', 790, 740, -6], ['RESULTS', 540, 560, 2]];
  return (<g><MGBg kind="wall" c1="#5a3a6c" c2="#2a1b38" />
    {env.map(([l, x, y, r], i) => <Envelope key={l} x={x} y={y + Math.sin(T * 1.4 + i) * 6} s={0.85} rot={r} label={l} k={(t - 0.1 - i * 0.12) / 0.3} />)}
    <MGBust x={540} y={1150} r={150} who="nia" mouth="wave" brow="worried" look={[0, 0]} bl={1} />
    {t > c3 - 0.2 && <g transform={`translate(0 ${lp(200, 0, EO((t - c3 + 0.2) / 0.3))})`}><MGArm x1={300} y1={1350} x2={470} y2={1120} sleeve="#e8b33e" skin="#8d6346" w={90} /><MGArm x1={780} y1={1350} x2={610} y2={1120} sleeve="#e8b33e" skin="#8d6346" w={90} /></g>}
    {t > c3 && <MGChip x={540} y={220} text="DON'T LOOK" col={R} txt="#fff" size={62} pop={(t - c3) / 0.25} />}</g>);
}

/* 3 — snapback: a stinging red bolt flies at Nia's brain; a little shield (her brain) swings up and blocks it */
function MGDodgeSting({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4), p = cl((t - c3 + 0.6) / 0.6), hit = t > c3;
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={220} text="NOT LAZY" outline size={50} pop={(t - b(beats, 1, 0.5)) / 0.25} />
    <MGBust x={540} y={900} r={210} who="nia" mouth={hit ? 'smile' : 'flat'} brow={hit ? 'up' : 'worried'} look={[1, -0.3]} bl={BL(T)} />
    <g transform={`translate(${lp(1150, 820, p)} ${lp(400, 640, p)}) rotate(${hit ? 30 : 0})`} opacity={hit ? cl(1 - (t - c3) * 2) : 1}>
      <path d="M-60 -20 L20 -20 L-10 20 L70 20 L-30 90 L0 40 L-70 40 Z" fill={R} stroke={K} strokeWidth="7" strokeLinejoin="round" /><text x="0" y="-40" textAnchor="middle" fontFamily={BB} fontSize="44" fill="#fff">STING</text></g>
    {t > c3 - 0.3 && <g transform={`translate(760 620) rotate(${lp(-60, 0, BK((t - c3 + 0.3) / 0.3))} -40 120) `}>
      <path d="M0 -100 L90 -70 Q90 60 0 110 Q-90 60 -90 -70 Z" fill={A} stroke={K} strokeWidth="9" strokeLinejoin="round" /><path d="M-30 0 Q0 -40 30 0 Q0 30 -30 0" fill="#e07fa8" stroke={K} strokeWidth="5" /></g>}
    {hit && <MGChip x={540} y={1250} text="DODGE!" col={A} size={64} pop={(t - c3) / 0.25} />}</g>);
}

/* 4 — the study: data card, Sweden + USA flags, login counter ticking on two laptops */
function MGInvestorStudy({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4), n = Math.floor(SM(0.3, 3, t) * 9000 + 1000);
  const laptop = (x, label, flag) => (<g transform={`translate(${x} 760)`}><rect x="-190" y="-140" width="380" height="260" rx="16" fill="#2a3150" stroke={K} strokeWidth="8" /><rect x="-240" y="120" width="480" height="40" rx="12" fill="#9aa3b5" stroke={K} strokeWidth="7" />
    {flag}<text y="20" textAnchor="middle" fontFamily={BB} fontSize="58" fill="#fff">LOG IN</text>
    <text y="-200" textAnchor="middle" fontFamily={BB} fontSize="54" fill={A}>{label}</text></g>);
  return (<g><MGBg kind="navy" />
    <MGChip x={540} y={210} text="JOURNAL OF RISK & UNCERTAINTY · 2009" outline size={34} pop={t / 0.25} />
    {laptop(280, 'SWEDEN', <g><rect x="-150" y="-110" width="80" height="54" fill="#3f7fbf" /><rect x="-128" y="-110" width="14" height="54" fill={A} /><rect x="-150" y="-90" width="80" height="14" fill={A} /></g>)}
    {laptop(800, 'USA', <g><rect x="-150" y="-110" width="80" height="54" fill="#f4efe4" />{[0, 1, 2].map((i) => <rect key={i} x="-150" y={-110 + i * 18} width="80" height="8" fill={R} />)}<rect x="-150" y="-110" width="34" height="26" fill="#3f6fbf" /></g>)}
    <g transform="translate(540 1180)"><rect x="-300" y="-80" width="600" height="150" rx="20" fill="#151a2c" stroke={A} strokeWidth="6" />
      <text y="22" textAnchor="middle" fontFamily={BB} fontSize="90" fill="#fff">{t > 0 ? 'LOGINS · ' + n.toLocaleString('en-US') : 'LOGINS'}</text></g>
    {t > c3 && <MGRing cx={540} cy={1180} rx={340} ry={110} p={(t - c3) / 0.4} rot={0} />}</g>);
}

/* 5 — result: split screen; market up (green arrow) → crowd of heads leaning in to screens; market down → backs turned */
function MGUpDown({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4), down = t > c3 - 0.1;
  return (<g><MGBg kind="navy" />
    <rect x="0" y="0" width="540" height="1920" fill="#1f3a2e" opacity="0.6" /><rect x="540" y="0" width="540" height="1920" fill="#4a1f24" opacity={down ? 0.7 : 0.25} />
    <Arrow x={270} y={420 + Math.sin(T * 2) * 10} up col={GREEN} k={(t - 0.1) / 0.3} />
    <Arrow x={810} y={420} up={false} col={R} k={(t - c3 + 0.1) / 0.3} />
    {[0, 1, 2, 3].map((i) => { const x = 130 + (i % 2) * 280, y = 830 + Math.floor(i / 2) * 240;
      return <MGHead key={'u' + i} x={x} y={y} r={78} who={MG.extra(i)} mouth="grin" brow="up" look={[0, -1]} bl={BL(T, i * 0.5)} />; })}
    {[0, 1, 2, 3].map((i) => { const x = 670 + (i % 2) * 280, y = 830 + Math.floor(i / 2) * 240, hide = down;
      return hide ? <g key={'d' + i}><circle cx={x} cy={y} r="78" fill={MG.extra(i + 4).hairCol} stroke={K} strokeWidth="6" /></g>
        : <MGHead key={'d' + i} x={x} y={y} r={78} who={MG.extra(i + 4)} mouth="flat" look={[0, 0]} bl={BL(T, i)} />; })}
    <MGChip x={270} y={640} text="LOOK MORE" col={GREEN} txt="#fff" size={40} pop={(t - b(beats, 2, 0.9)) / 0.25} />
    {down && <MGChip x={810} y={640} text="LOOK AWAY" col={R} txt="#fff" size={40} pop={(t - c3) / 0.25} />}</g>);
}

/* 6 — name it: THE OSTRICH EFFECT, an ostrich dipping its head into the sand */
function MGNameOstrich({ T, t }) {
  const h = SM(0.6, 1.6, t);
  return (<g><MGBg kind="stage" /><MGSpot x={540} yTop={-80} yBot={1320} wTop={180} wBot={760} a={0.5 * SM(0, 0.3, t)} />
    <MGTitle lines={[['THE', '#fff', 130], ['OSTRICH', A, 190], ['EFFECT', '#fff', 150]]} y={230} a={EO((t - 0.15) / 0.35)} />
    <path d="M60 1300 Q540 1120 1020 1300 Z" fill="#d9b26a" stroke={K} strokeWidth="8" />
    <Ostrich x={470} y={1010} s={1} head={h} T={T} /></g>);
}

/* 7 — self-proof: inbox with one bold unread email at the top, cursor hovering but never clicking */
function MGUnreadEmail({ T, t, beats }) {
  const c3 = b(beats, 3, 1.4), hov = Math.sin(T * 2.2) * 30;
  return (<g><MGBg kind="dark" />
    <g transform="translate(540 760)"><rect x="-420" y="-460" width="840" height="900" rx="30" fill="#f4efe4" stroke={K} strokeWidth="9" />
      <rect x="-420" y="-460" width="840" height="110" rx="30" fill={BLUE} /><text x="-370" y="-385" fontFamily={BB} fontSize="64" fill="#fff">INBOX · 300</text>
      {[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x="-380" y={-320 + i * 150} width="760" height="120" rx="14" fill={i === 0 ? '#fff6dc' : '#e6dfd2'} stroke={i === 0 ? A : 'none'} strokeWidth="6" />
        <circle cx="-320" cy={-260 + i * 150} r="30" fill={MG.extra(i).top} />
        <rect x="-270" y={-290 + i * 150} width={i === 0 ? 420 : 300 + hsh(i) * 200} height="22" rx="11" fill={i === 0 ? K : '#b9b0a2'} />
        <rect x="-270" y={-250 + i * 150} width={260 + hsh(i + 4) * 200} height="16" rx="8" fill="#b9b0a2" /></g>)}</g>
    <g transform={`translate(${660 + hov} ${520 + Math.abs(hov) * 0.4})`}><path d="M0 0 L0 90 L24 68 L42 108 L60 100 L42 62 L74 62 Z" fill="#fff" stroke={K} strokeWidth="6" strokeLinejoin="round" /></g>
    <MGChip x={540} y={150} text="RE: THAT THING" col={A} size={48} pop={t / 0.25} />
    {t > c3 && <MGChip x={540} y={1280} text="STILL UNOPENED" col={R} txt="#fff" size={48} pop={(t - c3) / 0.25} />}</g>);
}

/* 8 — end: Nia turns the phone over and looks; Milo beside her; balance is just a number; question + send chips */
function MGEndOpen({ T, t, beats }) {
  const c2 = b(beats, 2, 1.0), c3 = b(beats, 3, 1.4), c5 = b(beats, 5, 2.4), f = 1 - SM(0.1, 0.6, t);
  return (<g><MGBg kind="room" />
    <rect x="-40" y="1180" width="1160" height="80" fill="#a87a52" stroke={K} strokeWidth="8" />
    <MGPerson x={300} y={1240} s={2.4} who="nia" mouth={t > c2 ? 'smile' : 'flat'} brow="up" look={[1, 0.3]} bl={BL(T)} />
    <MGPerson x={820} y={1240} s={2.2} who="milo" mouth="grin" brow="up" look={[-1, 0]} bl={BL(T, 1)} cup />
    <BankPhone x={560} y={880} s={0.55} rot={-4} flip={f} T={T} bal="-£48" />
    {t > c2 && <MGChip x={560} y={600} text="JUST A NUMBER" col="#fff" size={40} pop={(t - c2) / 0.25} />}
    {t > c3 && <MGChip x={540} y={210} text="WHICH APP DO YOU AVOID?" col={A} size={44} pop={(t - c3) / 0.25} />}
    {t > c5 && <MGChip x={540} y={310} text="SEND IT TO THAT FRIEND" outline size={40} pop={(t - c5) / 0.25} />}</g>);
}

Object.assign(window, { MGNiaBankPing, MGYouUnopened, MGDodgeSting, MGInvestorStudy, MGUpDown, MGNameOstrich, MGUnreadEmail, MGEndOpen });
})();
