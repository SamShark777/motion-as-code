// art.jsx — "The Tiny Favor" (Zoe ep. 1). Stick cast from stick-kit.jsx; ground at y=1150.
const GY = 1150, Y = '#F5D33A', W = '#F2F2F2';
function Cup({ x, y, s = 1 }) { return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-22 -30 h44 l-6 60 h-32 Z" fill="#0b0b0b" stroke={W} strokeWidth="6" strokeLinejoin="round" /><path d="M22 -16 c18 0 18 24 0 24" fill="none" stroke={W} strokeWidth="6" /></g>; }
function ArtS2Coffee({ T, t }) { const p = Math.min(1, t / 1.2);
  return (<g><StickGround y={GY} /><Stick who="maya" x={330} y={GY} pose="point" mood="smug" T={T} /><Stick who="zoe" x={760} y={GY} pose="stand" mood="neutral" T={T} dir={-1} />
    <Cup x={480 + p * 140} y={760} s={1.3} /></g>); }
function ArtS2Hold({ T, t }) { return (<g><StickGround y={GY} /><Stick who="zoe" x={480} y={GY} pose="phone" mood="happy" T={T} /><Cup x={540} y={770} s={1.1} />
  <Stick who="maya" x={880} y={GY} pose="walk" mood="happy" T={T} s={0.7} /></g>); }
function ArtS2Text({ T, t }) { const lines = [{ t: 'can u cover my' }, { t: 'sat shift? 🙏' }]; if (t > 1.3) lines.push({ t: 'umm sure!', me: true });
  return (<g><StickPhone x={540} y={760} lines={lines} T={T} /></g>); }
function ArtS2Sigh({ T, t }) { return (<g><StickGround y={GY} /><Stick who="zoe" x={380} y={GY} pose="stand" mood="sad" T={T} look={8} />
  <g transform="translate(760 700)"><rect x="-150" y="-170" width="300" height="320" rx="20" fill="#0b0b0b" stroke={W} strokeWidth="8" /><rect x="-150" y="-170" width="300" height="70" rx="20" fill="#B79CFF" />
    <text y="40" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="110" fill={W}>SAT</text>
    <path d="M-100 -60 L100 120 M100 -60 L-100 120" stroke={Y} strokeWidth="12" strokeLinecap="round" opacity={Math.min(1, t / 0.6)} /></g></g>); }
function ArtS2But({ T, t }) { return (<g><StickGround y={GY} /><Stick who="zoe" x={380} y={GY} pose="shrug" mood="worried" T={T} /><Stick who="maya" x={740} y={GY} pose="hips" mood="smug" T={T} dir={-1} />
  <StickMark x={560} y={600} kind="?" T={T} size={140} /></g>); }
function ArtS2Sign({ T, t }) { const p = Math.min(1, t / 0.6);
  return (<g><StickGround y={GY} /><path d="M640 1150 L640 900 L780 800 L920 900 L920 1150" fill="none" stroke={W} strokeWidth="8" strokeLinejoin="round" />
    <g transform={`translate(380 ${1150 - 60 * p})`}><line x1="0" y1="0" x2="0" y2="-200" stroke={W} strokeWidth="9" />
      <rect x="-280" y="-520" width="560" height="330" rx="8" fill="#0b0b0b" stroke={Y} strokeWidth="10" />
      <text y="-400" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="100" fill={Y}>DRIVE</text><text y="-290" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="100" fill={Y}>CAREFULLY</text></g>
    <text x="780" y="560" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="130" fill={W}>17%</text></g>); }
function ArtS2Sticker({ T, t }) { const p = Math.min(1, t / 0.8);
  return (<g><rect x="300" y="600" width="480" height="440" rx="10" fill="none" stroke={W} strokeWidth="9" /><line x1="540" y1="600" x2="540" y2="1040" stroke={W} strokeWidth="7" /><line x1="300" y1="820" x2="780" y2="820" stroke={W} strokeWidth="7" />
    <g transform={`translate(${680 - (1 - p) * 300} ${950 - (1 - p) * 300}) rotate(${(1 - p) * 30})`}><rect x="-60" y="-34" width="120" height="68" rx="8" fill={Y} /><text y="12" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="30" fill="#0b0b0b">safe driver</text></g>
    <text x="540" y="520" textAnchor="middle" fontFamily="'Caveat Brush', cursive" fontSize="140" fill={Y} opacity={Math.min(1, Math.max(0, t - 0.8) / 0.3)}>76%</text></g>); }
function ArtS2Door({ T, t }) { const o = 0.18 + 0.03 * STICK.osc(T, 1.2);
  return (<g><StickGround y={GY} /><rect x="560" y="560" width="300" height="590" fill="none" stroke={W} strokeWidth="9" />
    <g transform={`translate(560 560) skewY(${-o * 30}) scale(${1 - o} 1)`}><rect x="0" y="0" width="300" height="590" fill="#0b0b0b" stroke={W} strokeWidth="9" /><circle cx="260" cy="300" r="12" fill={W} /></g>
    <Stick who="zoe" x={360} y={GY} pose="point" mood="neutral" T={T} /></g>); }
function ArtS2Rule({ T, t }) { return (<g><StickGround y={GY} /><Stick who="zoe" x={380} y={GY} pose="cross" mood="smug" T={T} />
  <Stick who="maya" x={800} y={GY} pose="walk" mood="happy" T={T} s={0.75} dir={-1} />{t > 1.0 && <StickMark x={800} y={640} kind="?" T={T} size={90} color={W} />}</g>); }

Object.assign(window, { ArtS2But, ArtS2Coffee, ArtS2Door, ArtS2Hold, ArtS2Rule, ArtS2Sigh, ArtS2Sign, ArtS2Sticker, ArtS2Text });
