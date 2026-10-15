// Deterministic capture of a Claude Design (OM CompositionStage) page: seek every frame, screenshot, pipe to ffmpeg.
// node scripts/cap_design.mjs <serveDir> <page.html> <out.mp4> [fps] [maxSeconds]   (LOCAL_NM=<node_modules> serves React/Babel/fonts offline)


import { chromium } from '../app/node_modules/playwright-core/index.mjs';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const [dir, file, out, fpsArg, maxArg] = process.argv.slice(2);
const fps = +(fpsArg || 30);
const NM = process.env.LOCAL_NM || '';
const local = {
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js': `${NM}/react/umd/react.production.min.js`,
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js': `${NM}/react-dom/umd/react-dom.production.min.js`,
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js': `${NM}/@babel/standalone/babel.min.js`,
};
const srv = http.createServer((req, res) => {
  const p = path.join(path.resolve(dir), decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200); fs.createReadStream(p).pipe(res);
}).listen(8799);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--disable-web-security'] });
const ctx = await b.newContext({ viewport: { width: 1084, height: 1965 }, deviceScaleFactor: 1 });
const offline = !!process.env.LOCAL_NM;
if (offline) {
  await ctx.route('**/*', async (route) => {
    const u = route.request().url();
    if (local[u]) return route.fulfill({ path: local[u], contentType: 'application/javascript' });
    if (u.startsWith('https://fonts.googleapis.com/css')) {
      const css = [700, 800, 900].map((w) => `@font-face{font-family:'Montserrat';font-weight:${w};font-style:normal;src:url(/__font/${w}.woff2) format('woff2');}`).join('\n');
      return route.fulfill({ body: css, contentType: 'text/css' });
    }
    const m = /\/__font\/(\d+)\.woff2/.exec(u);
    if (m) return route.fulfill({ path: `${NM}/@fontsource/montserrat/files/montserrat-latin-${m[1]}-normal.woff2`, contentType: 'font/woff2' });
    if (u.startsWith('http://localhost:8799')) return route.continue();
    return route.abort();
  });
}
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('PAGEERR', e.message));
await page.goto(`http://localhost:8799/${encodeURI(file)}`);
const sel = '[data-om-exportable-video-with-duration-secs]';
await page.waitForSelector(sel, { timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
const dur = Math.min(+(maxArg || 1e9), +(await page.getAttribute(sel, 'data-om-exportable-video-with-duration-secs')));
const el = await page.$(sel);
const bb = await el.boundingBox();
console.log('duration', dur, 'box', bb);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-vf', 'scale=1080:1920:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const n = Math.round(dur * fps);
const t0 = Date.now();
for (let i = 0; i < n; i++) {
  await page.evaluate(([s, t]) => { const e = document.querySelector(s); e.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: t, sync: true } })); }, [sel, i / fps]);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95, clip: bb });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % 60 === 0) process.stdout.write(`\r${i}/${n} ${(i / ((Date.now() - t0) / 1000)).toFixed(1)} fps   `);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await b.close(); srv.close();
console.log('\nwrote', out, ((Date.now() - t0) / 1000).toFixed(0) + 's');
