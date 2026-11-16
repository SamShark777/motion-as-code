#!/usr/bin/env python3
"""Daily news-psych Short builder — Gus + Nell talk through today's story (HyperFrames, newsprint collage).

Usage:  python3 tools/news_short/build_news.py shorts/<slug>/news.json [--snap] [--render]
  (no flag)  voices + timing + index.html in /tmp/news/<slug>
  --snap     also writes a contact sheet of every line to /tmp/news/<slug>/snap (look at it!)
  --render   also renders, mixes music, writes shorts/<slug>/source/final.mp4

news.json:
{ "slug": "x", "masthead": "MON · NOV 16", "music": "<music-branch file id e.g. 3aab69285b.ogg>",
  "lines": [ { "who": "gus"|"nell", "text": "spoken line", "brow": "up"|"down" (optional),
               "board": { ...optional, replaces the board; omit to keep the previous one... } } ] }
board (all optional; laid out top→bottom automatically in the y 250–900 zone):
  "headline": "TWO LINE\\nHEADLINE"      big Anton card (≤ 2 lines, ≤ 14 chars a line)
  "card": {"title": "REPORTS ALLEGE", "body": "one or two short sentences"}
  "big": {"text": "VILLAIN?", "color": "teal|red|ink|mus"}
  "rating": {"title": "RATING CARD", "source": "THORNDIKE · 1920", "rows": ["Intelligence", ...]}
  "figure": {"mark": "halo"|"horns"|"none"}   faceless silhouette for a public figure (never a likeness)
  "chips": [{"text": "FBI INVESTIGATING", "color": "mus|red|paper|teal", "at": 0.8}]   (at = seconds into the line)
  "stamp": {"text": "NOTHING PROVEN", "at": 3.0}
  "scrawl": {"text": "\\"I KNEW IT!\\"", "at": 1.0}
  "bar": {"label": "INVESTIGATION ONGOING", "sub": "your brain: ALREADY DECIDED", "fill": 0.6}
  "vote": ["GENIUS", "VILLAIN", "TOO EARLY?"]   (use on the last line; adds "comment below")
Voices: Gus = Kokoro am_michael ×1.05, Nell = bf_isabella ×1.0. No swoosh sounds, ever.
"""
import json, subprocess, re, sys, os, shutil, glob, html as H
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chars import GUS, NELL, SIL

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
spec_path = os.path.abspath(sys.argv[1]); SP = json.load(open(spec_path))
SLUG = SP['slug']; L = SP['lines']
W = f'/tmp/news/{SLUG}'
os.makedirs(W + '/vo', exist_ok=True)
shutil.copytree(os.path.join(os.path.dirname(__file__), 'template'), W, dirs_exist_ok=True)
os.chdir(W)
BROWSER = (glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome') + glob.glob('/opt/pw-browsers/chromium_headless_shell-*/chrome-linux*/headless_shell'))[0]
ENV = dict(os.environ, HYPERFRAMES_BROWSER_PATH=BROWSER)
def run(*a, **k): return subprocess.run(a, check=True, env=ENV, **k)

# ---------- voices ----------
V = {'gus': ('am_michael', '1.05'), 'nell': ('bf_isabella', '1.0')}
for i, ln in enumerate(L):
    f = f'vo/{i:02d}.wav'
    say = ln.get('say', ln['text'])
    key = f'vo/{i:02d}.txt'
    if os.path.exists(f) and os.path.exists(key) and open(key).read() == ln['who'] + '|' + say: continue
    v, s = V[ln['who']]
    run('npx', 'hyperframes', 'tts', say, '-v', v, '-s', s, '-o', f, capture_output=True)
    open(key, 'w').write(ln['who'] + '|' + say)
durs = [float(subprocess.check_output(['ffprobe', '-v', '0', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'vo/{i:02d}.wav'])) for i in range(len(L))]
GAP, START = 0.28, 0.45
starts, t = [], START
for d in durs: starts.append(round(t, 3)); t += d + GAP
TOTAL = round(t + 1.6, 2)
inputs, filt = [], []
for i, s in enumerate(starts):
    inputs += ['-i', f'vo/{i:02d}.wav']
    filt.append(f'[{i}:a]aresample=48000,adelay={int(s*1000)}|{int(s*1000)},apad[a{i}]')
filt.append(''.join(f'[a{i}]' for i in range(len(L))) + f'amix=inputs={len(L)}:normalize=0,atrim=0:{TOTAL}[out]')
run('ffmpeg', '-y', '-v', 'error', *inputs, '-filter_complex', ';'.join(filt), '-map', '[out]', '-ac', '1', 'dialogue.wav')
json.dump({'starts': starts, 'durs': durs, 'total': TOTAL}, open('timing.json', 'w'))

COL = {'gus': '#2F7F86', 'nell': '#D2382B'}
CC = {'mus': ('#E8B931', '#1A1A1A'), 'red': ('#D2382B', '#F7F2E6'), 'paper': ('#F7F2E6', '#1A1A1A'), 'teal': ('#2F7F86', '#F7F2E6'), 'ink': ('#1A1A1A', '#F7F2E6')}
e = lambda s: H.escape(str(s))

# ---------- captions ----------
caps = []
for i, ln in enumerate(L):
    words = ln['text'].split(); groups, g = [], []
    for w in words:
        g.append(w)
        if len(g) == 3 or re.search(r'[.,?!…:;]$', w): groups.append(' '.join(g)); g = []
    if g: groups.append(' '.join(g))
    tot = sum(len(x) + 3 for x in groups); tt = starts[i]
    for k, x in enumerate(groups):
        d = durs[i] * (len(x) + 3) / tot
        caps.append((round(tt, 3), round(d + (GAP * 0.8 if k == len(groups) - 1 else 0), 3), ln['who'], x)); tt += d
cap_html = '\n'.join(f'<div class="clip cap" data-start="{s}" data-duration="{d}" data-track-index="9" style="--c:{COL[w]}"><span class="who">{w.upper()}</span><span class="txt">{e(x)}</span></div>' for s, d, w, x in caps)

# ---------- boards ----------
spans = []  # (line index, board, start, duration)
for i, ln in enumerate(L):
    if 'board' in ln:
        if spans: spans[-1][3] = round(starts[i] - spans[-1][2], 3)
        spans.append([i, ln['board'], starts[i] - 0.1, None])
if spans: spans[-1][3] = round(TOTAL - spans[-1][2], 3)
boards, anims = [], []
for n, (li, b, st, du) in enumerate(spans):
    bid = f'b{n}'; kids = []
    def add(html, at=0.0, kind='pop'):
        cid = f'{bid}k{len(kids)}'; kids.append(html.replace('<div ', f'<div id="{cid}" ', 1)); anims.append((cid, round(st + 0.1 + at, 3), kind))
    if 'headline' in b:
        rows = b['headline'].split('\n'); fs = min(150, int(1700 / max(9, max(len(r) for r in rows))))
        add(f'<div class="card head" style="font-size:{fs}px">{"<br/>".join(e(r) for r in rows)}</div>')
    if 'figure' in b:
        mk = b['figure'].get('mark', 'none')
        mark = {'halo': '<svg class="mark" viewBox="0 0 300 120" width="300" height="120" style="top:-60px"><ellipse cx="150" cy="60" rx="110" ry="28" fill="none" stroke="#E8B931" stroke-width="18"/><ellipse cx="150" cy="60" rx="110" ry="28" fill="none" stroke="#1A1A1A" stroke-width="4"/></svg>',
                'horns': '<svg class="mark" viewBox="0 0 300 140" width="300" height="140" style="top:-50px"><path d="M80 130 Q50 60 70 0 Q100 70 120 120 Z M220 130 Q250 60 230 0 Q200 70 180 120 Z" fill="#D2382B" stroke="#1A1A1A" stroke-width="6"/></svg>'}.get(mk, '')
        add(f'<div class="fig{" dark" if mk == "horns" else ""}">{SIL}{mark}</div>')
    if 'card' in b:
        c = b['card']; add(f'<div class="card body"><div class="ct">{e(c.get("title", ""))}</div>{e(c.get("body", ""))}</div>')
    if 'big' in b:
        add(f'<div class="bigw" style="color:{CC.get(b["big"].get("color", "teal"))[0]}">{e(b["big"]["text"])}</div>')
    if 'rating' in b:
        r = b['rating']; rows = ''.join(f'<div class="row"><span>{e(x)}</span><span class="tick">★★★★★</span></div>' for x in r['rows'])
        add(f'<div class="card rate"><div class="rh"><span>{e(r.get("title", "RATING CARD"))}</span><span style="color:#D2382B">{e(r.get("source", ""))}</span></div>{rows}</div>')
    if 'bar' in b:
        r = b['bar']; add(f'<div class="card barc"><div class="ct" style="font-size:72px">{e(r["label"])}</div><div class="track"><div class="fill" data-fill="{r.get("fill", 0.6)}"></div></div><div class="sub">{e(r.get("sub", ""))}</div></div>', 0, 'bar')
    if 'chips' in b:
        ch = ''.join(f'<span class="chip" data-at="{c.get("at", 0)}" style="background:{CC.get(c.get("color", "paper"))[0]};color:{CC.get(c.get("color", "paper"))[1]}">{e(c["text"])}</span>' for c in b['chips'])
        kids.append(f'<div class="chips">{ch}</div>')
    if 'vote' in b:
        cols = ['mus', 'red', 'paper', 'teal']
        ch = ''.join(f'<span class="chip vote" data-at="{0.2 + k * 0.45}" style="background:{CC[cols[k % 4]][0]};color:{CC[cols[k % 4]][1]}">{e(v)}</span>' for k, v in enumerate(b['vote']))
        kids.append(f'<div class="chips">{ch}</div><div class="cmt chip vote" data-at="{0.2 + len(b["vote"]) * 0.45}" style="background:none;border:0;box-shadow:none;font-family:Elite">↓ comment below ↓</div>')
    over = ''
    if 'stamp' in b: over += f'<div id="{bid}st" class="stamp">{e(b["stamp"]["text"])}</div>'; anims.append((f'{bid}st', round(st + 0.1 + b['stamp'].get('at', 0), 3), 'stamp'))
    if 'scrawl' in b: over += f'<div id="{bid}sc" class="scrawl">{e(b["scrawl"]["text"])}</div>'; anims.append((f'{bid}sc', round(st + 0.1 + b['scrawl'].get('at', 0), 3), 'pop'))
    boards.append(f'<div id="{bid}" class="clip board" data-start="{round(st, 3)}" data-duration="{du}" data-track-index="{1 + n % 2}" data-layout-allow-overflow>{"".join(kids)}{over}</div>')

brows = [(i, ln['who'], ln['brow']) for i, ln in enumerate(L) if ln.get('brow')]
html = f'''<!doctype html>
<html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<script src="assets/gsap.min.js"></script>
<style>
@font-face{{font-family:Anton;src:url(assets/anton-latin-400-normal.woff2)}}
@font-face{{font-family:Elite;src:url(assets/special-elite-latin-400-normal.woff2)}}
@font-face{{font-family:Archivo;src:url(assets/archivo-black-latin-400-normal.woff2)}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden;background:#EDE6D6}}
#root{{position:relative;width:1080px;height:1920px;overflow:hidden;background:#EDE6D6;font-family:Archivo,sans-serif;color:#1A1A1A}}
.dots{{position:absolute;inset:0;background-image:radial-gradient(rgba(26,26,26,.09) 1.6px,transparent 1.8px);background-size:14px 14px}}
.fold{{position:absolute;left:0;right:0;top:1520px;bottom:0;background:#E3DAC6;border-top:6px solid #1A1A1A}}
.mast{{position:absolute;left:60px;right:60px;top:150px;border-top:6px solid #1A1A1A;border-bottom:3px solid #1A1A1A;padding:10px 0 8px;display:flex;justify-content:space-between;align-items:baseline;font-family:Elite;font-size:30px}}
.mast b{{font-family:Anton;font-size:56px;letter-spacing:2px;font-weight:400}}
.board{{position:absolute;left:60px;top:250px;width:960px;height:660px;display:flex;flex-direction:column;align-items:center;gap:28px}}
.card{{background:#F7F2E6;border:5px solid #1A1A1A;box-shadow:12px 12px 0 #1A1A1A;width:100%}}
.head{{font-family:Anton;line-height:.98;text-align:center;padding:16px 24px 6px}}
.body{{font-family:Elite;font-size:46px;line-height:1.28;padding:24px 30px}}
.ct{{font-family:Anton;font-size:64px;margin-bottom:8px;line-height:1.05}}
.bigw{{font-family:Anton;font-size:170px;line-height:.95;text-align:center;letter-spacing:2px;margin-top:60px}}
.rate{{padding:22px 38px}} .rh{{display:flex;justify-content:space-between;font-family:Anton;font-size:56px}}
.row{{display:flex;justify-content:space-between;font-family:Elite;font-size:40px;padding:10px 0;border-bottom:3px dashed #999}} .tick{{color:#2F7F86;font-family:Archivo}}
.barc{{padding:28px;text-align:center}} .track{{margin:20px auto 0;width:720px;height:46px;border:5px solid #1A1A1A;background:#F7F2E6}}
.fill{{width:0;height:100%;background:repeating-linear-gradient(45deg,#E8B931 0 22px,#1A1A1A 22px 30px)}} .sub{{font-family:Elite;font-size:40px;margin-top:14px}}
.chips{{display:flex;flex-wrap:wrap;justify-content:center;gap:22px 26px;width:100%}}
.chip{{font-family:Archivo;font-size:40px;padding:10px 20px;border:5px solid #1A1A1A;box-shadow:8px 8px 0 #1A1A1A;white-space:nowrap;display:inline-block}}
.chip.vote{{font-size:70px}} .cmt{{font-size:58px!important;margin-top:10px}}
.fig{{position:relative;width:300px;height:380px;margin-top:70px}} .fig .mark{{position:absolute;left:0}} .fig.dark > svg:first-child{{filter:brightness(.5) sepia(1) hue-rotate(-30deg)}}
.stamp{{position:absolute;left:50%;top:470px;transform:translateX(-50%) rotate(-8deg);font-family:Anton;color:#D2382B;border:10px solid #D2382B;padding:4px 26px;font-size:100px;letter-spacing:4px;mix-blend-mode:multiply;white-space:nowrap}}
.scrawl{{position:absolute;left:10px;top:80px;font-family:Elite;color:#D2382B;font-size:64px;transform:rotate(-9deg)}}
.char{{position:absolute;overflow:visible}} #gus{{left:70px;top:960px}} #nell{{left:600px;top:860px}}
.cap{{position:absolute;left:60px;right:60px;top:1600px;display:flex;flex-direction:column;align-items:center;gap:6px}}
.cap .who{{font-family:Elite;font-size:30px;color:var(--c);letter-spacing:6px}}
.cap .txt{{font-family:Archivo;font-size:66px;line-height:1.05;text-align:center;background:#1A1A1A;color:#EDE6D6;padding:8px 22px;box-shadow:8px 8px 0 var(--c)}}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
 <div class="dots" data-layout-ignore></div><div class="fold" data-layout-ignore></div>
 <div class="mast" data-layout-ignore><b>THE DAILY OVERTHINK</b><span>{e(SP.get("masthead", ""))}</span></div>
 {"".join(boards)}
 {GUS}
 {NELL}
{cap_html}
</div>
<script>
const tl = gsap.timeline({{paused:true}});
const S = {json.dumps(starts)}, D = {json.dumps(durs)}, WHO = {json.dumps([l["who"] for l in L])}, TOTAL = {TOTAL};
const A = {json.dumps(anims)};
A.forEach(([id, t, kind]) => {{
  const el = document.getElementById(id); if (!el) return;
  if (kind === 'stamp') tl.fromTo(el, {{scale:1.8, opacity:0}}, {{scale:1, opacity:.92, duration:0.22, ease:'power4.in'}}, t);
  else tl.fromTo(el, {{scale:0.86, opacity:0}}, {{scale:1, opacity:1, duration:0.32, ease:'back.out(2)'}}, t);
  if (kind === 'bar') {{ const f = el.querySelector('.fill'); const bi = S.findIndex(s => s >= t - 0.2); tl.fromTo(f, {{width:'0%'}}, {{width: (parseFloat(f.dataset.fill)*100)+'%', duration: Math.max(1.5, D[Math.max(0,bi)] || 2), ease:'power1.out'}}, t); }}
}});
document.querySelectorAll('.board').forEach(b => {{
  const st = parseFloat(b.dataset.start);
  b.querySelectorAll('.chip').forEach(c => tl.fromTo(c, {{scale:0.6, opacity:0}}, {{scale:1, opacity:1, duration:0.3, ease:'back.out(2.2)'}}, st + 0.1 + parseFloat(c.dataset.at || 0)));
  b.querySelectorAll('.tick').forEach((c, j) => tl.fromTo(c, {{opacity:0}}, {{opacity:1, duration:0.2}}, st + 1.2 + j * 0.5));
}});
document.querySelectorAll('.cap').forEach(el => tl.fromTo(el.querySelector('.txt'), {{y:16, opacity:0}}, {{y:0, opacity:1, duration:0.12, ease:'power2.out'}}, parseFloat(el.dataset.start)));
['gus','nell'].forEach((c, k) => {{
  const el = '#' + c; tl.set(el, {{transformOrigin:'50% 100%'}}, 0);
  for (let t = 0; t < TOTAL; t += 2.4) tl.to(el, {{rotation:(k ? -1.2 : 1.2) * ((t/2.4) % 2 ? 1 : -1), duration:1.2, ease:'sine.inOut'}}, t);
  for (let b = 1.7 + k * 0.6; b < TOTAL; b += 4.3 + k) {{ tl.set(el + ' .e', {{scaleY:0.1, transformOrigin:'50% 50%'}}, b); tl.set(el + ' .e', {{scaleY:1}}, b + 0.12); }}
}});
WHO.forEach((w, i) => {{
  const el = '#' + w, other = w === 'gus' ? '#nell' : '#gus';
  tl.to(el, {{y:-14, scale:1.03, duration:0.18, ease:'power2.out'}}, S[i] - 0.05); tl.to(other, {{y:0, scale:1, duration:0.18}}, S[i] - 0.05);
  for (let t = S[i]; t < S[i] + D[i] - 0.1; t += 0.13) {{ const o = Math.round((t - S[i]) / 0.13) % 2 === 0; tl.set(el + ' .m-open', {{opacity:o?1:0}}, t); tl.set(el + ' .m-closed', {{opacity:o?0:1}}, t); }}
  tl.set(el + ' .m-open', {{opacity:0}}, S[i] + D[i]); tl.set(el + ' .m-closed', {{opacity:1}}, S[i] + D[i]);
}});
{json.dumps(brows)}.forEach(([i, w, d]) => {{ tl.to('#' + w + ' .brow', {{y: d === 'up' ? -12 : 8, duration:0.15}}, S[i]); tl.to('#' + w + ' .brow', {{y:0, duration:0.2}}, S[i] + D[i]); }});
window.__timelines['main'] = tl; tl.seek(0);
</script></body></html>'''
open('index.html', 'w').write(html)
print('built', W, 'total', TOTAL, 's')

if '--snap' in sys.argv or '--render' in sys.argv:
    at = ','.join(str(round(s + d * 0.85, 2)) for s, d in zip(starts, durs))
    shutil.rmtree('snap', ignore_errors=True)
    run('npx', 'hyperframes', 'snapshot', '--at', at, '--no-end', '-o', 'snap', capture_output=True)
    print('contact sheets:', sorted(glob.glob(W + '/snap/contact-sheet*.jpg')))
if '--render' in sys.argv:
    run('npx', 'hyperframes', 'render', '-o', 'silent.mp4', capture_output=True)
    mus = SP.get('music', '3aab69285b.ogg')
    with open('music.ogg', 'wb') as f: f.write(subprocess.check_output(['git', '-C', ROOT, 'show', f'origin/music:{mus}']))
    out = os.path.join(ROOT, 'shorts', SLUG, 'source'); os.makedirs(out, exist_ok=True)
    run('ffmpeg', '-y', '-v', 'error', '-i', 'silent.mp4', '-i', 'dialogue.wav', '-stream_loop', '-1', '-i', 'music.ogg', '-filter_complex',
        f'[2:a]atrim=0:{TOTAL},volume=0.13,afade=t=in:d=0.8,afade=t=out:st={TOTAL - 2.5}:d=2.5[m];[1:a][m]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=11[a]',
        '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-crf', '21', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', out + '/final.mp4')
    print('final', out + '/final.mp4', TOTAL)
