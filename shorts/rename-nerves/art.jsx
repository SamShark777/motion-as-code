// art.jsx — scene illustrations for "Rename Your Nerves" (from Shivam's Claude Design project). Pure functions of T.
const MOTION = {
  pop: Easing.easeOutBack,     // card pop on every hard cut
  push: Easing.easeInOutSine,  // slow push-in during a scene
  enter: Easing.easeOutCubic,  // illustration beats
};
const INK = '#141821', SKIN = '#F1C3A0', SKIN2 = '#C98A62', CREAM = '#E9E4D8';
const TAU = Math.PI * 2;
const osc = (T, period, ph = 0) => Math.sin((T / period + ph) * TAU);
const blink = (T, ph = 0) => (((T + ph) % 3.3) < 0.13 ? 0.1 : 1);
const hsh = (n) => { const x = Math.sin(n * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
const tw = (t, s, d) => MOTION.enter(clamp((t - s) / d, 0, 1));

function Eye({ cx, cy, T, ph = 0, rx = 24, ry = 22, look = 0 }) {
  const b = blink(T, ph);
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry * b} fill="#fff" />
      <circle cx={cx + look} cy={cy + 2} r={11 * Math.min(1, b * 1.6)} fill={INK} />
    </g>
  );
}

/* 1 — nervous man, sweating */
function ArtNervous({ T }) {
  const jit = osc(T, 0.13) * 3;
  const sec = Math.floor(T * 1.25) * 30;
  const drops = [[362, 1050, 0], [616, 1072, 0.8], [348, 1180, 1.5]];
  return (
    <g>
      <circle cx="486" cy="1230" r="420" fill="#264684" />
      <g transform="translate(205 800)">
        <circle r="122" fill="#2C4F92" />
        <circle r="100" fill={CREAM} />
        {[0, 90, 180, 270].map((a) => <rect key={a} x="-5" y="-92" width="10" height="20" rx="4" fill={INK} transform={`rotate(${a})`} />)}
        <line x1="0" y1="0" x2="0" y2="-56" stroke={INK} strokeWidth="12" strokeLinecap="round" transform="rotate(-50)" />
        <line x1="0" y1="10" x2="0" y2="-80" stroke="#B3202A" strokeWidth="6" strokeLinecap="round" transform={`rotate(${sec})`} />
        <circle r="9" fill={INK} />
      </g>
      <g transform={`translate(${jit} 0)`}>
        <path d="M196 1728 C196 1500 300 1415 486 1415 C672 1415 776 1500 776 1728 Z" fill={CREAM} />
        <path d="M410 1420 L486 1520 L562 1420" fill="none" stroke="#C9C0AE" strokeWidth="16" strokeLinejoin="round" />
        <rect x="436" y="1290" width="100" height="150" rx="30" fill={SKIN2} />
        <circle cx="338" cy="1170" r="30" fill={SKIN2} />
        <circle cx="634" cy="1170" r="30" fill={SKIN2} />
        <ellipse cx="486" cy="1150" rx="150" ry="172" fill={SKIN} />
        <path d="M336 1125 C326 985 420 958 486 958 C584 958 652 1000 640 1115 C600 1062 540 1044 486 1052 C430 1044 372 1072 336 1125 Z" fill={INK} />
        <line x1="392" y1="1106" x2="454" y2="1088" stroke={INK} strokeWidth="11" strokeLinecap="round" />
        <line x1="518" y1="1088" x2="580" y2="1106" stroke={INK} strokeWidth="11" strokeLinecap="round" />
        <Eye cx={425} cy={1150} T={T} look={osc(T, 1.9) * 9} />
        <Eye cx={547} cy={1150} T={T} look={osc(T, 1.9) * 9} />
        <path d="M436 1252 q12.5 -12 25 0 t25 0 t25 0 t25 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="398" cy="1212" rx="26" ry="12" fill="#E8907A" opacity=".55" />
        <ellipse cx="574" cy="1212" rx="26" ry="12" fill="#E8907A" opacity=".55" />
        <ellipse cx="596" cy={1462 + osc(T, 0.7) * 10} rx="56" ry="44" fill={SKIN} />
        {drops.map(([x, y, ph], i) => {
          const p = ((T + ph) % 2.1) / 2.1;
          return (
            <g key={i} transform={`translate(${x} ${y + MOTION.enter(p) * 150}) scale(${0.6 + p * 0.5})`} opacity={p < 0.1 ? p * 10 : 1 - Math.max(0, p - 0.7) / 0.3}>
              <path d="M0 -30 C11 -12 18 0 18 9 A18 18 0 0 1 -18 9 C-18 0 -11 -12 0 -30 Z" fill="#9AD8FF" />
              <circle cx="-5" cy="6" r="5" fill="#fff" opacity=".8" />
            </g>
          );
        })}
      </g>
    </g>
  );
}

/* 2 — person cheering, confetti */
const CONF = ['#1F3B73', '#B3202A', '#E8C547', '#2B6E7A', '#E07A2E', '#6A3FA0'];
function Confetti({ T, from, to }) {
  const out = [];
  for (let i = from; i < to; i++) {
    const sp = 230 + hsh(i + 1) * 220;
    const y = ((T * sp + hsh(i + 2) * 1900) % 1900) - 120;
    const x = hsh(i) * 972 + osc(T, 1.4 + hsh(i + 3), hsh(i)) * 34;
    const r = T * (180 + hsh(i + 4) * 320);
    const c = CONF[i % CONF.length];
    out.push(i % 3 === 0
      ? <circle key={i} cx={x} cy={y} r={11} fill={c} />
      : <rect key={i} x={-10} y={-17} width={20} height={34} rx="3" fill={c} transform={`translate(${x} ${y}) rotate(${r}) scale(1 ${Math.abs(Math.cos(r / 40))})`} />);
  }
  return <g>{out}</g>;
}
function ArtCheer({ T }) {
  const hop = -Math.abs(osc(T, 1.1)) * 34;
  const pump = osc(T, 0.55) * 26;
  return (
    <g>
      <circle cx="486" cy="1200" r="430" fill="#DDD6C5" />
      <Confetti T={T} from={0} to={24} />
      <ellipse cx="486" cy="1712" rx={190 + hop * 0.8} ry="26" fill="#CFC7B4" />
      <g transform={`translate(0 ${hop})`}>
        <line x1="446" y1="1500" x2="404" y2="1690" stroke={INK} strokeWidth="72" strokeLinecap="round" />
        <line x1="526" y1="1500" x2="568" y2="1690" stroke={INK} strokeWidth="72" strokeLinecap="round" />
        <line x1="404" y1="1236" x2={292} y2={930 + pump} stroke="#B3202A" strokeWidth="60" strokeLinecap="round" />
        <line x1="568" y1="1236" x2={680} y2={930 - pump} stroke="#B3202A" strokeWidth="60" strokeLinecap="round" />
        <circle cx={286} cy={912 + pump} r="40" fill={SKIN} />
        <circle cx={686} cy={912 - pump} r="40" fill={SKIN} />
        <rect x="372" y="1180" width="228" height="370" rx="96" fill="#B3202A" />
        <rect x="446" y="1140" width="80" height="70" rx="24" fill={SKIN2} />
        <circle cx="486" cy="1050" r="118" fill={SKIN} />
        <path d="M368 1040 C364 930 430 912 486 912 C560 912 612 944 604 1030 C570 990 520 980 486 984 C440 980 392 1000 368 1040 Z" fill={INK} />
        <path d="M430 1048 q20 -22 40 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M502 1048 q20 -22 40 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d={`M446 1092 A40 ${34 + osc(T, 0.55) * 6} 0 0 0 526 1092 Z`} fill={INK} />
        <ellipse cx="400" cy="1088" rx="22" ry="11" fill="#E8907A" opacity=".6" />
        <ellipse cx="572" cy="1088" rx="22" ry="11" fill="#E8907A" opacity=".6" />
      </g>
      <Confetti T={T} from={24} to={44} />
    </g>
  );
}

/* 3 — singer with mic, spotlight */
function ArtSinger({ T }) {
  const sway = osc(T, 2.4) * 4;
  const mouth = 0.55 + 0.45 * Math.abs(osc(T, 0.9));
  return (
    <g>
      <polygon points="400,0 572,0 900,1728 72,1728" fill="#fff" opacity={0.08 + 0.025 * osc(T, 0.7)} />
      <ellipse cx="486" cy="1710" rx="420" ry="70" fill="#8E151D" />
      {[0, 1, 2].map((k) => {
        const p = ((T + k * 0.75) % 2.25) / 2.25;
        const x = 600 + p * 210 + osc(T, 1.2, k) * 20, y = 1200 - p * 420;
        return (
          <g key={k} transform={`translate(${x} ${y}) rotate(${osc(T, 1, k) * 12})`} opacity={Math.min(p * 5, 1 - p)}>
            <ellipse cx="0" cy="0" rx="24" ry="17" fill={CREAM} transform="rotate(-20)" />
            <rect x="17" y="-82" width="9" height="82" fill={CREAM} />
            <path d="M22 -82 q30 10 34 40" fill="none" stroke={CREAM} strokeWidth="9" strokeLinecap="round" />
          </g>
        );
      })}
      <g transform={`rotate(${sway} 486 1600)`}>
        <path d="M266 1728 C270 1480 352 1398 486 1398 C620 1398 702 1480 706 1728 Z" fill={INK} />
        <path d="M430 1400 L486 1470 L542 1400 Z" fill="#E8C547" />
        <circle cx="486" cy="1110" r="180" fill="#3A1A14" />
        <path d="M330 1150 C320 1300 360 1400 400 1420 L400 1150 Z" fill="#3A1A14" />
        <path d="M642 1150 C652 1300 612 1400 572 1420 L572 1150 Z" fill="#3A1A14" />
        <rect x="438" y="1280" width="96" height="140" rx="30" fill={SKIN2} />
        <g transform={`rotate(${-6 + sway * 0.6} 486 1160)`}>
          <ellipse cx="486" cy="1165" rx="134" ry="152" fill={SKIN} />
          <path d="M352 1120 C360 1010 430 990 486 992 C560 994 620 1030 622 1110 C580 1070 530 1060 470 1066 C420 1072 380 1090 352 1120 Z" fill="#3A1A14" />
          <path d="M412 1158 q20 16 40 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <path d="M520 1158 q20 16 40 0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="486" cy="1245" rx={26 + mouth * 4} ry={14 + mouth * 22} fill="#3A0C10" />
        </g>
        <line x1="604" y1="1478" x2="562" y2="1350" stroke={INK} strokeWidth="64" strokeLinecap="round" />
        <rect x="540" y="1270" width="34" height="130" rx="14" fill="#2B2B33" transform="rotate(-22 557 1335)" />
        <circle cx="540" cy="1272" r="42" fill="#C9CCD3" />
        <path d="M506 1258 h68 M502 1282 h76" stroke="#9EA3AD" strokeWidth="5" />
        <ellipse cx="565" cy="1350" rx="40" ry="34" fill={SKIN} />
      </g>
    </g>
  );
}

/* 4 — speaker on stage, applause */
function ArtSpeaker({ T }) {
  const gest = osc(T, 1.6) * 12;
  const aud = [[96, '#2A2A33', 0], [300, INK, 0.13], [520, '#2A2A33', 0.07], [740, INK, 0.2], [940, '#2A2A33', 0.04]];
  return (
    <g>
      <rect x="0" y="1320" width="972" height="408" fill="#CFAE34" />
      <ellipse cx="486" cy="1400" rx="330" ry="60" fill="#F2D766" opacity=".7" />
      <g>
        <line x1="580" y1="1110" x2={700} y2={930 + gest} stroke="#1F3B73" strokeWidth="52" strokeLinecap="round" />
        <circle cx={706} cy={918 + gest} r="34" fill={SKIN} />
        <rect x="380" y="1050" width="212" height="300" rx="80" fill="#1F3B73" />
        <path d="M456 1056 L486 1110 L516 1056 Z" fill={CREAM} />
        <circle cx="486" cy="970" r="88" fill={SKIN} />
        <path d="M398 962 C394 880 446 866 486 866 C540 866 580 892 574 956 C548 926 512 920 486 922 C450 920 418 934 398 962 Z" fill={INK} />
        <Eye cx={456} cy={978} T={T} ph={0.6} rx={14} ry={14} />
        <Eye cx={516} cy={978} T={T} ph={0.6} rx={14} ry={14} />
        <path d="M462 1016 q24 18 48 0" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <path d="M352 1180 L620 1180 L584 1530 L388 1530 Z" fill="#B3202A" />
        <rect x="336" y="1162" width="300" height="34" rx="12" fill="#8E151D" />
        <path d="M486 1162 C486 1110 470 1090 500 1070" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <circle cx="486" cy="1340" r="38" fill={CREAM} opacity=".9" />
      </g>
      {aud.map(([x, c, ph], i) => {
        const clap = Math.abs(osc(T, 0.42, ph));
        const gap = 6 + clap * 30;
        const hy = 1430 + (i % 2) * 26;
        return (
          <g key={i}>
            {i !== 2 && (
              <g>
                <ellipse cx={x - gap} cy={hy} rx="26" ry="40" fill={c} transform={`rotate(${18} ${x - gap} ${hy})`} />
                <ellipse cx={x + gap} cy={hy} rx="26" ry="40" fill={c} transform={`rotate(${-18} ${x + gap} ${hy})`} />
                {clap < 0.25 && [-40, 0, 40].map((a) => (
                  <line key={a} x1={x} y1={hy - 62} x2={x} y2={hy - 96} stroke={INK} strokeWidth="7" strokeLinecap="round" transform={`rotate(${a} ${x} ${hy})`} />
                ))}
              </g>
            )}
            <circle cx={x} cy={1570} r="78" fill={c} />
            <ellipse cx={x} cy={1745} rx="150" ry="120" fill={c} />
          </g>
        );
      })}
    </g>
  );
}

/* 5 — heart with racing pulse line */
function ArtHeart({ T }) {
  const m = T % 0.44;
  const beat = 1 + 0.13 * Math.exp(-Math.pow(m / 0.05, 2)) + 0.06 * Math.exp(-Math.pow((m - 0.14) / 0.05, 2));
  const seg = 324, off = (T * 640) % seg;
  let pts = [];
  for (let k = -1; k < 5; k++) {
    const b = k * seg;
    pts.push([b, 0], [b + 90, 0], [b + 112, -26], [b + 134, 0], [b + 160, 0], [b + 180, 70], [b + 204, -170], [b + 228, 90], [b + 250, 0], [b + seg, 0]);
  }
  const d = 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L');
  return (
    <g>
      <path d="M96 1728 C110 1420 250 1300 486 1300 C722 1300 862 1420 876 1728 Z" fill="#1D4E57" />
      <rect x="430" y="1180" width="112" height="150" rx="36" fill="#1D4E57" />
      <circle cx="486" cy="1060" r="150" fill="#1D4E57" />
      <g transform={`translate(0 1500)`}>
        <path d={d} transform={`translate(${-off} 0)`} fill="none" stroke={CREAM} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" opacity=".9" />
      </g>
      <circle cx="486" cy="1490" r={170 * beat} fill="#E2453C" opacity=".18" />
      <g transform={`translate(486 1510) scale(${beat})`}>
        <rect x="-80" y="-80" width="160" height="160" fill="#E2453C" transform="rotate(45)" />
        <circle cx="-56.6" cy="-56.6" r="80" fill="#E2453C" />
        <circle cx="56.6" cy="-56.6" r="80" fill="#E2453C" />
        <circle cx="-62" cy="-74" r="22" fill="#fff" opacity=".35" />
      </g>
      {[-1, 1].map((s) => (
        <g key={s} opacity={0.4 + 0.6 * (beat - 1) / 0.13}>
          <path d={`M${486 + s * 210} 1420 q${s * 30} 70 0 140`} fill="none" stroke={CREAM} strokeWidth="9" strokeLinecap="round" />
          <path d={`M${486 + s * 250} 1395 q${s * 42} 95 0 190`} fill="none" stroke={CREAM} strokeWidth="9" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

/* 6 — brain with a label tag (ANXIETY → EXCITEMENT) */
function ArtBrain({ T, t }) {
  const br = 1 + osc(T, 2.6) * 0.015;
  const swing = osc(T, 2.2) * 7 + (t > 2.5 ? 10 * Math.sin((t - 2.5) * 9) * Math.exp(-(t - 2.5) * 3) : 0);
  const strike = tw(t, 2.0, 0.4);
  const swap = tw(t, 2.5, 0.35);
  const lobes = [[380, 1120, 120], [500, 1055, 135], [612, 1128, 116], [420, 1250, 112], [562, 1252, 122], [650, 1232, 82], [330, 1206, 80]];
  return (
    <g>
      <circle cx="486" cy="1180" r="380" fill="#D26E25" />
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <line key={a} x1="486" y1="840" x2="486" y2="800" stroke="#FFD9B3" strokeWidth="10" strokeLinecap="round"
          opacity={0.3 + 0.7 * Math.abs(osc(T, 1.2, i * 0.17))} transform={`rotate(${a - 150} 486 1170)`} />
      ))}
      <g transform={`translate(486 1180) scale(${br}) translate(-486 -1180)`}>
        <rect x="456" y="1310" width="64" height="120" rx="26" fill="#E58FA3" />
        {lobes.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#F4A7B9" />)}
        {['M400 1100 q30 -34 64 -2', 'M520 1010 q16 44 62 26', 'M456 1186 q42 32 86 0', 'M610 1170 q-22 40 18 74', 'M350 1226 q30 22 54 -12', 'M492 1290 q20 -30 50 -10'].map((p) => (
          <path key={p} d={p} fill="none" stroke="#D9778F" strokeWidth="11" strokeLinecap="round" />
        ))}
      </g>
      <g transform={`rotate(${swing} 404 1312)`}>
        <path d="M404 1312 L404 1478" stroke={CREAM} strokeWidth="7" strokeLinecap="round" />
        <path d="M444 1440 L820 1440 Q842 1440 842 1462 L842 1598 Q842 1620 820 1620 L444 1620 L398 1530 Z" fill={CREAM} />
        <circle cx="430" cy="1530" r="13" fill="#E07A2E" />
        <g opacity={1 - swap}>
          <text x="638" y="1550" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="58" fill={INK}>ANXIETY</text>
          <line x1="510" y1="1532" x2={510 + 256 * strike} y2="1528" stroke="#B3202A" strokeWidth="12" strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
        </g>
        <g transform={`translate(638 1530) scale(${0.6 + 0.4 * swap}) translate(-638 -1530)`} opacity={swap}>
          <text x="638" y="1548" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="50" fill="#B3202A" textLength="330" lengthAdjust="spacingAndGlyphs">EXCITEMENT</text>
        </g>
      </g>
    </g>
  );
}

/* 7 — job interview handshake */
function ArtHandshake({ T }) {
  const dy = osc(T, 0.55) * 18;
  return (
    <g>
      <rect x="610" y="760" width="260" height="330" rx="14" fill="#5A3290" />
      <rect x="634" y="784" width="212" height="282" rx="8" fill="#8259BD" />
      <circle cx="740" cy="900" r="46" fill="#E8C547" opacity=".85" />
      <rect x="0" y="1460" width="972" height="268" fill="#4E2C7A" />
      <rect x="0" y="1460" width="972" height="22" fill="#8259BD" />
      <g transform="rotate(-7 230 1590)">
        <rect x="120" y="1520" width="220" height="150" rx="8" fill={CREAM} />
        {[0, 1, 2, 3].map((k) => <rect key={k} x="146" y={1548 + k * 28} width={k === 0 ? 110 : 168} height="11" rx="5" fill={k === 0 ? '#6A3FA0' : '#BDB6A6'} />)}
      </g>
      <g transform="translate(760 1520)">
        <path d="M-56 -80 L56 -80 L44 40 L-44 40 Z" fill="#E07A2E" />
        <path d="M56 -50 q42 0 38 34 q-4 30 -44 26" fill="none" stroke="#E07A2E" strokeWidth="14" />
        {[0, 1].map((k) => {
          const p = ((T + k * 0.9) % 1.8) / 1.8;
          return <path key={k} d={`M${-16 + k * 32} ${-100 - p * 120} q16 -22 0 -44 q-16 -22 0 -44`} fill="none" stroke={CREAM} strokeWidth="8" strokeLinecap="round" opacity={Math.sin(p * Math.PI) * 0.8} />;
        })}
      </g>
      <line x1="-60" y1="1330" x2="400" y2={1236 + dy} stroke="#1F3B73" strokeWidth="150" />
      <line x1="1032" y1="1330" x2="574" y2={1236 + dy} stroke="#E8C547" strokeWidth="150" />
      <line x1="372" y1="1242" x2="404" y2={1236 + dy} stroke={CREAM} strokeWidth="150" />
      <line x1="602" y1="1242" x2="570" y2={1236 + dy} stroke={CREAM} strokeWidth="150" />
      <g transform={`translate(0 ${dy})`}>
        <ellipse cx="456" cy="1228" rx="96" ry="64" fill={SKIN} />
        <ellipse cx="520" cy="1214" rx="96" ry="64" fill={SKIN2} />
        <ellipse cx="470" cy="1170" rx="58" ry="22" fill={SKIN} transform="rotate(-12 470 1170)" />
        {[0, 1, 2].map((k) => <path key={k} d={`M${540 + k * 20} ${1206 + k * 4} q14 22 0 46`} fill="none" stroke="#A86E4B" strokeWidth="6" strokeLinecap="round" />)}
      </g>
      {[-1, 1].map((s) => (
        <path key={s} d={`M${430} ${1236 + s * 130} q56 ${-s * 18} 112 0`} fill="none" stroke={CREAM} strokeWidth="9" strokeLinecap="round" opacity={0.3 + 0.5 * Math.abs(osc(T, 0.55))} />
      ))}
    </g>
  );
}


Object.assign(window, { ArtNervous, ArtCheer, ArtSinger, ArtSpeaker, ArtHeart, ArtBrain, ArtHandshake });
