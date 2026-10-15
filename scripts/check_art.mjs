// Syntax-check a Claude Design style video before pushing: node scripts/check_art.mjs <slug>
// (needs @babel/standalone: `npm i --prefix /tmp/babel @babel/standalone` and BABEL=/tmp/babel/node_modules/@babel/standalone)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Babel = require(process.env.BABEL || '@babel/standalone');
const slug = process.argv[2];
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
