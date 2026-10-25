// art.jsx — "Two Days, Tops" (Kabir ep. 1). Stick cast from stick-kit.jsx; ground at y=1150.
const GY = 1150, Y = '#F5D33A', W = '#F2F2F2';
const HW = "'Caveat Brush', cursive";
function Cal({ x, y, mark = 0, labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] }) {
  return (<g transform={`translate(${x} ${y})`}>{labels.map((d, i) => <g key={i} transform={`translate(${(i - 3) * 110} 0)`}>
    <rect x="-46" y="-56" width="92" height="112" rx="12" fill={i < mark ? '#2a2a2a' : '#0b0b0b'} stroke={W} strokeWidth="6" />
    <text y="22" textAnchor="middle" fontFamily={HW} fontSize="60" fill={W}>{d}</text></g>)}</g>);
}
function Desk({ y = GY }) { return <g><line x1="560" y1={y - 200} x2="960" y2={y - 200} stroke={W} strokeWidth="9" strokeLinecap="round" /><line x1="600" y1={y - 200} x2="600" y2={y} stroke={W} strokeWidth="9" /><line x1="920" y1={y - 200} x2="920" y2={y} stroke={W} strokeWidth="9" />
  <rect x="660" y={y - 330} width="200" height="130" rx="10" fill="#0b0b0b" stroke={W} strokeWidth="8" /></g>; }
function ArtS3Week({ T, t }) { return (<g><Cal x={540} y={540} /><StickGround y={GY} /><Stick who="kabir" x={540} y={GY} pose="shrug" mood="happy" T={T} s={0.78} /></g>); }
function ArtS3Plan({ T, t }) { return (<g><Cal x={540} y={540} />
  <path d="M260 540 h220" stroke={Y} strokeWidth="14" strokeLinecap="round" opacity={0.85} />
  <text x="370" y="460" textAnchor="middle" fontFamily={HW} fontSize="70" fill={Y}>essay</text>
  <StickGround y={GY} /><Stick who="kabir" x={540} y={GY} pose="point" mood="smug" T={T} s={0.78} /></g>); }
function ArtS3Zero({ T, t }) { return (<g><StickGround y={GY} /><Desk /><text x="760" y="910" textAnchor="middle" fontFamily={HW} fontSize="56" fill={Y}>0 words</text>
  <Stick who="kabir" x={340} y={GY} pose="phone" mood="happy" T={T} /></g>); }
function ArtS3Night({ T, t }) { return (<g><StickGround y={GY} /><Desk />
  {[0, 1, 2].map((i) => <rect key={i} x={680 + i * 50} y={GY - 270} width="34" height="70" rx="8" fill="#3FC1C9" />)}
  <Stick who="kabir" x={420} y={GY} pose="head" mood="shocked" T={T} /><Stick who="arjun" x={180} y={GY} pose="cross" mood="worried" T={T} s={0.8} />
  <circle cx="900" cy="420" r="50" fill="none" stroke="#8a8a8a" strokeWidth="6" /></g>); }
function ArtS3Dream({ T, t }) { const p = Math.min(1, t / 1.4);
  return (<g><StickGround y={GY} /><Stick who="kabir" x={260} y={GY} pose="stand" mood="happy" T={T} look={10} />
    <StickBubble x={680} y={660} w={500} h={340} think text="" tail={-1} />
    <path d={`M480 700 L${480 + 400 * p} 700`} stroke={Y} strokeWidth="12" strokeLinecap="round" />
    <text x="680" y="620" textAnchor="middle" fontFamily={HW} fontSize="60" fill={W}>the plan ✨</text></g>); }
function ArtS3Study({ T, t }) { return (<g><g transform="translate(540 720)"><rect x="-220" y="-260" width="440" height="520" rx="16" fill="#0b0b0b" stroke={W} strokeWidth="9" />
  {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="-160" y1={-170 + i * 80} x2={i % 2 ? 100 : 160} y2={-170 + i * 80} stroke="#8a8a8a" strokeWidth="10" strokeLinecap="round" />)}</g>
  <text x="540" y="1110" textAnchor="middle" fontFamily={HW} fontSize="140" fill={Y}>34 days?</text></g>); }
function ArtS3Real({ T, t }) { const bars = [[34, W, 'guess'], [55, Y, 'real']];
  return (<g>{bars.map(([v, c, l], i) => { const h = v * 10 * Math.min(1, (t - i * 0.4) / 0.7 > 0 ? (t - i * 0.4) / 0.7 : 0);
    return (<g key={i} transform={`translate(${400 + i * 280} ${GY})`}><rect x="-80" y={-h} width="160" height={h} rx="10" fill="none" stroke={c} strokeWidth="9" />
      <text y={-h - 30} textAnchor="middle" fontFamily={HW} fontSize="80" fill={c}>{v}</text><text y={-h - 110} textAnchor="middle" fontFamily={HW} fontSize="56" fill="#8a8a8a">{l}</text></g>); })}
    <StickGround y={GY} /></g>); }
function ArtS3Name({ T, t }) { return (<g><StickGround y={GY} />
  <path d="M120 900 L960 900" stroke={Y} strokeWidth="10" strokeLinecap="round" /><text x="230" y="860" fontFamily={HW} fontSize="56" fill={Y}>best case</text>
  <path d="M120 1050 C260 960 340 1120 480 1020 S700 960 960 1060" fill="none" stroke={W} strokeWidth="10" strokeLinecap="round" /><text x="700" y="1120" fontFamily={HW} fontSize="56" fill={W}>usual</text>
  </g>); }
function ArtS3Fix({ T, t }) { return (<g><StickGround y={GY} /><Stick who="kabir" x={380} y={GY} pose="wave" mood="happy" T={T} />
  <Stick who="arjun" x={760} y={GY} pose="cross" mood="smug" T={T} dir={-1} /><StickBubble x={760} y={560} w={300} h={130} text="sure 🙄" size={60} tail={1} /></g>); }

Object.assign(window, { ArtS3Dream, ArtS3Fix, ArtS3Name, ArtS3Night, ArtS3Plan, ArtS3Real, ArtS3Study, ArtS3Week, ArtS3Zero });
