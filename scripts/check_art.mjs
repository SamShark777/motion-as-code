// Syntax-check a Claude Design style video before pushing: node scripts/check_art.mjs <slug>
// (needs @babel/standalone: `npm i --prefix /tmp/babel @babel/standalone` and BABEL=/tmp/babel/node_modules/@babel/standalone)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Babel = require(process.env.BABEL || '@babel/standalone');
const slug = process.argv[2];
const S0 = JSON.parse(fs.readFileSync(`../shorts/${slug}/script.json`, 'utf8'));
if (S0.format === 'story') process.exit(checkStory(S0) ? 0 : 1);
const art = fs.readFileSync(`../shorts/${slug}/art.jsx`, 'utf8');
Babel.transform(art, { presets: ['react'] });
const S = JSON.parse(fs.readFileSync(`../shorts/${slug}/script.json`, 'utf8'));
const exported = /Object\.assign\(window,\s*\{([^}]*)\}/.exec(art)?.[1].split(',').map((s) => s.trim()) || [];
let ok = true;
for (const [i, ln] of S.lines.entries()) {
  if (!exported.includes(ln.art)) { console.error(`line ${i}: art ${ln.art} not exported by art.jsx`); ok = false; }
  for (const c of ln.chunks) if (c[0].split(/\s+/).length > 3) { console.error(`line ${i}: chunk "${c[0]}" has more than 3 words`); ok = false; }
  if (ln.chunks.filter((c) => c[1]?.emph).length !== 1) { console.error(`line ${i}: needs exactly one emphasis chunk`); ok = false; }
}
console.log(ok ? `ok: ${S.lines.length} scenes, art compiles` : 'FAILED');
process.exit(ok ? 0 : 1);

// story Shorts: scenes.jsx compiles and exports every art; lines, headlines, sound cues and length are sane
function checkStory(S) {
  const src = fs.readFileSync(`../shorts/${slug}/scenes.jsx`, 'utf8');
  let ok = true;
  const bad = (m) => { console.error(m); ok = false; };
  try { Babel.transform(src, { presets: ['react'] }); } catch (e) { bad(`scenes.jsx does not compile: ${e.message}`); }
  if (/Math\.random|useState|useEffect|setTimeout|setInterval|Date\.now/.test(src)) bad('scenes.jsx must be a pure function of time (no Math.random, state, effects, timers or clocks)');
  const exported = /Object\.assign\(window,\s*\{([^}]*)\}/.exec(src)?.[1].split(',').map((x) => x.trim()) || [];
  const SOUNDS = 'swipe whoosh pop tick chime chime-bright rising notification flip flip-dull lightning airy card-slide settle toggle drawer page-turn wood-tap'.split(' ');
  let words = 0;
  for (const [i, ln] of S.lines.entries()) {
    if (!ln.art) bad(`line ${i}: missing art`);
    else if (!exported.includes(ln.art)) bad(`line ${i}: art ${ln.art} not exported by scenes.jsx`);
    if (!ln.text || !ln.text.trim()) bad(`line ${i}: empty text`);
    words += (ln.say || ln.text || '').split(/\s+/).filter(Boolean).length;
    if (ln.headline != null && (String(ln.headline).split('*').length % 2 === 0 || String(ln.headline).split('==').length % 2 === 0)) bad(`line ${i}: unbalanced * or == in headline`);
    for (const c of ln.sfx || []) if (!Array.isArray(c) || c.length !== 3 || !SOUNDS.includes(c[0])) bad(`line ${i}: bad sfx cue ${JSON.stringify(c)} (sounds: ${SOUNDS.join(', ')})`);
  }
  if (S.lines[0]?.headline == null) bad('line 0 needs a headline');
  if (words > 140) bad(`${words} spoken words: too long for a Short (keep it under ~130)`);
  console.log(ok ? `ok: story, ${S.lines.length} lines, ${new Set(S.lines.map((l) => l.art)).size} scenes, ${words} words, scenes compile` : 'FAILED');
  return ok;
}
