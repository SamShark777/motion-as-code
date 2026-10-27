# "You just found..." dilemma Shorts: Flux scenes + ElevenLabs (word-timed) + dark-glass UI chips + one-word captions
import json, math, os, sys, time, random, subprocess, shutil, wave, re, base64, urllib.request, urllib.error
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
W, H, FPS = 1080, 1920, 30
def log(*a): print(time.strftime("%H:%M:%S"), *a, flush=True)

# ---------------- fonts / colours ----------------
FD = os.path.join(HERE, "fonts")
CAP = os.path.join(FD, "Bangers.ttf"); UIB = os.path.join(FD, "DejaVuSans-Bold.ttf"); UIR = os.path.join(FD, "DejaVuSans.ttf")
_fc = {}
def F(p, s):
    s = max(6, int(s)); k = (p, s)
    if k not in _fc: _fc[k] = ImageFont.truetype(p, s)
    return _fc[k]
GREEN = (92, 227, 125); PANEL = (16, 19, 21, 225); EDGE = (70, 76, 80, 255); WHITE = (245, 245, 245); MUTE = (190, 196, 200)
def ease(x): x = max(0, min(1, x)); return 0.5 - 0.5 * math.cos(math.pi * x)
def outback(x):
    x = max(0, min(1, x)); c1 = 1.70158; c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2

# ---------------- voice: ElevenLabs with timestamps ----------------
TAG = re.compile(r"\[[^\]]*\]")
def clean_words(text): return TAG.sub(" ", text).split()
def eleven(story, work):
    cfg = story["voice"]; keyf = os.path.join(HERE, "elevenlabs_key.txt")
    key = os.environ.get("ELEVENLABS_API_KEY") or (open(keyf).read().strip() if os.path.exists(keyf) else None)
    if not key: raise RuntimeError("No ElevenLabs key: put it in shorts\\elevenlabs_key.txt")
    cache = os.path.join(work, "voice.json")
    full = " ".join((s.get("tags", "") + " " + s["text"]).strip() for s in story["segments"])
    if os.path.exists(cache) and json.load(open(cache)).get("text") == full:
        r = json.load(open(cache))
    else:
        vid = cfg.get("voice_id")
        if not vid:
            req = urllib.request.Request("https://api.elevenlabs.io/v1/voices", headers={"xi-api-key": key})
            vs = json.loads(urllib.request.urlopen(req).read())["voices"]
            want = cfg.get("name", "Brian").lower()
            m = [v for v in vs if v["name"].lower().startswith(want)] or vs
            vid = m[0]["voice_id"]; log("voice", m[0]["name"], vid)
        body = {"text": full, "model_id": cfg.get("model", "eleven_v3"),
                "voice_settings": {"stability": cfg.get("stability", 0.5), "similarity_boost": 0.8}}
        def call(model):
            body["model_id"] = model
            req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{vid}/with-timestamps?output_format=mp3_44100_128",
                                         data=json.dumps(body).encode(), headers={"xi-api-key": key, "Content-Type": "application/json"})
            return json.loads(urllib.request.urlopen(req, timeout=300).read())
        try: r = call(body["model_id"])
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="ignore")[:400]; log("ElevenLabs error", e.code, msg)
            if e.code in (401, 403): raise
            body["text"] = TAG.sub("", full); r = call("eleven_multilingual_v2")
        except Exception as e:
            log("model failed, falling back to multilingual_v2:", e)
            body["text"] = TAG.sub("", full); r = call("eleven_multilingual_v2")
        r["text"] = full; json.dump(r, open(cache, "w"))
    mp3 = os.path.join(work, "vo.mp3"); open(mp3, "wb").write(base64.b64decode(r["audio_base64"]))
    al = r.get("normalized_alignment") or r["alignment"]
    ch, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    toks, cur, depth = [], None, 0
    for c, a, b in zip(ch, st, en):
        if c == "[": depth += 1
        if depth == 0 and not c.isspace():
            if cur is None: cur = [c, a, b]
            else: cur[0] += c; cur[2] = b
        elif cur is not None: toks.append(cur); cur = None
        if c == "]": depth = max(0, depth - 1)
    if cur: toks.append(cur)
    return mp3, toks

def kokoro_voice(story, work):
    from kokoro_onnx import Kokoro
    WAN = os.path.dirname(HERE)
    k = Kokoro(os.path.join(WAN, "voice", "kokoro-v1.0.onnx"), os.path.join(WAN, "voice", "voices-v1.0.bin"))
    parts, toks, t, sr = [], [], 0.25, 24000
    parts.append(np.zeros(int(0.25 * sr), np.float32))
    for s in story["segments"]:
        txt = TAG.sub("", s["text"]).strip()
        a, sr = k.create(txt, voice=story.get("voice", {}).get("kokoro", "am_michael"), speed=1.0, lang="en-us")
        a = np.asarray(a, np.float32); nz = np.where(np.abs(a) > 0.01)[0]
        if len(nz): a = a[max(0, nz[0] - 240): nz[-1] + 2400]
        dur = len(a) / sr; ws = clean_words(s["text"]); L = [len(w) + 2 for w in ws]; tot = sum(L); c = t
        for w, l in zip(ws, L): d = dur * l / tot; toks.append([w, c, c + d]); c += d
        gap = 0.3; parts += [a, np.zeros(int(gap * sr), np.float32)]; t += dur + gap
    vo = np.concatenate(parts); p = os.path.join(work, "vo_kokoro.wav")
    w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(vo, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
    return p, toks

def assign_times(story, toks):
    exp = []; seg_of = []
    for i, s in enumerate(story["segments"]):
        for w in clean_words(s["text"]): exp.append(w); seg_of.append(i)
    if len(toks) != len(exp):
        log(f"word count mismatch {len(toks)} vs {len(exp)}; stretching")
        T0, T1 = toks[0][1], toks[-1][2]; L = [len(w) + 2 for w in exp]; tot = sum(L); c = T0; toks = []
        for w, l in zip(exp, L): d = (T1 - T0) * l / tot; toks.append([w, c, c + d]); c += d
    words = [[exp[k], toks[k][1], toks[k][2], seg_of[k]] for k in range(len(exp))]
    return words

# ---------------- UI chips ----------------
def rr(layer, box, fill, outline, width=3, r=22):
    d = ImageDraw.Draw(layer); d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)
def ctext(d, cx, y, s, f, fill): d.text((cx - d.textlength(s, font=f) / 2, y), s, font=f, fill=fill)
def fit(d, s, path, size, maxw=840):
    """Largest font <= size whose rendering of s fits maxw px."""
    while size > 24 and d.textlength(s, font=F(path, size)) > maxw: size -= 2
    return F(path, size)
def ctext_fit(d, cx, y, s, path, size, fill, maxw=840):
    f = fit(d, s, path, size, maxw); dy = (size - f.size) * 0.55
    d.text((cx - d.textlength(s, font=f) / 2, y + dy), s, font=f, fill=fill)
def chip_size(c):
    t = c["type"]
    if t == "msg": return 70 + 74 * max(1, len(wrap(c["text"], 26))) + 40
    if t == "counter": return 230 if c.get("sub") else 200
    return {"value": 200, "reply": 150, "call": 210, "choice": 320, "banner": 150, "clock": 210, "battery": 0}.get(t, 180)
def wrap(s, n, px=820, size=58):
    f = F(UIB, size); d = ImageDraw.Draw(Image.new("L", (1, 1))); out, line = [], ""
    for w in s.split():
        cand = (line + " " + w).strip()
        if line and d.textlength(cand, font=f) > px: out.append(line); line = w
        else: line = cand
    if line: out.append(line)
    return out
def fmt_num(c, v):
    f = c.get("fmt", "{:,.0f}")
    return f.format(v)
def draw_chip(base, c, y, t, seg_t0):
    """t: seconds since chip appear. returns height used"""
    if t < 0: return
    a = min(1, t / 0.25); s = 0.9 + 0.1 * outback(t / 0.3)
    typ = c["type"]; h = chip_size(c); x0, x1 = 90, W - 90
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    green = c.get("green", typ in ("reply", "counter", "clock", "call"))
    if typ == "battery":
        bx, by = W - 260, 60
        rr(layer, [bx, by, bx + 170, by + 70], PANEL, EDGE, 3, 14)
        d.rectangle([bx + 22, by + 22, bx + 66, by + 48], outline=GREEN, width=3); d.rectangle([bx + 66, by + 30, bx + 71, by + 40], fill=GREEN)
        d.rectangle([bx + 26, by + 26, bx + 30, by + 44], fill=(230, 70, 60))
        d.text((bx + 86, by + 16), c.get("value", "1%"), font=F(UIB, 32), fill=WHITE)
    else:
        rr(layer, [x0, y, x1, y + h], PANEL, GREEN + (255,) if green else EDGE, 4 if green else 3, 24)
        cx = W / 2
        if typ == "counter":
            ctext_fit(d, cx, y + 28, c["label"], UIB, 34, MUTE)
            v = c["from"] + (c["to"] - c["from"]) * ease((t - 0.1) / c.get("dur", 1.6))
            ctext_fit(d, cx, y + 80, c.get("prefix", "") + fmt_num(c, v) + c.get("suffix", ""), UIB, 92, WHITE)
            if c.get("sub"): ctext(d, cx, y + 182, c["sub"], F(UIB, 30), GREEN)
        elif typ == "value":
            ctext_fit(d, cx, y + 28, c["label"], UIB, 32, MUTE)
            ctext_fit(d, cx, y + 76, c["value"], UIB, 78, WHITE)
            bw = 520 * ease((t - 0.15) / 0.5); d.rounded_rectangle([cx - 260, y + 168, cx - 260 + bw, y + 176], radius=4, fill=GREEN)
        elif typ == "clock":
            ctext(d, cx, y + 24, c["label"], F(UIB, 32), MUTE)
            ctext_fit(d, cx, y + 68, c["value"], UIB, 92, WHITE)
            if c.get("sub"): ctext(d, cx, y + 170, c["sub"], F(UIB, 28), GREEN)
        elif typ == "msg":
            d.rectangle([x0 + 30, y + 32, x0 + 36, y + 64], fill=GREEN)
            d.text((x0 + 52, y + 34), c.get("sender", "UNKNOWN SENDER"), font=F(UIB, 26), fill=MUTE)
            n = int(len(c["text"]) * min(1, max(0, t - 0.2) / max(0.4, len(c["text"]) * 0.045)))
            full = wrap(c["text"], 26); left = n
            for i, line in enumerate(full):
                d.text((x0 + 48, y + 92 + 74 * i), line[:max(0, left)], font=F(UIB, 58), fill=WHITE); left -= len(line) + 1
        elif typ == "reply":
            n = int(len(c["text"]) * min(1, max(0, t - 0.15) / max(0.3, len(c["text"]) * 0.07)))
            d.text((x0 + 48, y + 40), c["text"][:n], font=F(UIB, 70), fill=WHITE)
            tw = d.textlength(c["text"][:n], font=F(UIB, 70)); d.rectangle([x0 + 50, y + 122, x0 + 50 + tw * 0.6, y + 128], fill=GREEN)
        elif typ == "call":
            ctext(d, cx, y + 26, c.get("label", "UNKNOWN SENDER"), F(UIB, 28), MUTE)
            r = 44 + 6 * math.sin(t * 9); d.ellipse([cx - r, y + 70 + 44 - r, cx + r, y + 70 + 44 + r], fill=(40, 170, 80))
            d.text((cx - 18, y + 88), "☎", font=F(UIR, 44), fill=WHITE)
            ctext(d, cx, y + 168, c.get("value", "INCOMING CALL"), F(UIB, 32), WHITE)
        elif typ == "banner":
            ctext_fit(d, cx, y + 34, c["title"], UIB, 44, WHITE)
            if c.get("sub"): ctext(d, cx, y + 94, c["sub"], F(UIB, 28), GREEN)
        elif typ == "choice":
            for k, (big, small) in enumerate(c["options"]):
                yy = y + k * 170; b = outback((t - 0.25 * k) / 0.35)
                if b <= 0: continue
                if k: rr(layer, [x0, yy, x1, yy + 150], PANEL, GREEN + (255,), 4, 24)
                ctext(d, cx, yy + 22, big, F(UIB, 66), WHITE); ctext(d, cx, yy + 104, small, F(UIB, 26), GREEN)
            # first box drawn by generic panel; resize generic panel to first option
    if typ == "choice":
        # redraw: generic panel covered both; fix by drawing only option boxes
        layer2 = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d2 = ImageDraw.Draw(layer2)
        for k, (big, small) in enumerate(c["options"]):
            yy = y + k * 170; b = (t - 0.25 * k) / 0.35
            if b <= 0: continue
            rr(layer2, [x0, yy, x1, yy + 150], PANEL, GREEN + (255,), 4, 24)
            ctext(d2, W / 2, yy + 22, big, F(UIB, 66), WHITE); ctext(d2, W / 2, yy + 104, small, F(UIB, 26), GREEN)
        layer = layer2
    if s != 1 or a < 1:
        cy = y + h / 2
        layer = layer.resize((int(W * s), int(H * s)), Image.BILINEAR)
        ox, oy = int(W / 2 - W * s / 2), int(cy - cy * s)
        tmp = Image.new("RGBA", (W, H), (0, 0, 0, 0)); tmp.paste(layer, (ox, oy)); layer = tmp
        if a < 1: layer.putalpha(layer.getchannel("A").point(lambda p: int(p * a)))
    base.alpha_composite(layer)

# ---------------- camera ----------------
MOVES = {"push": ((0.5, 0.5, 1.03), (0.5, 0.52, 1.2)), "pull": ((0.5, 0.5, 1.22), (0.5, 0.5, 1.03)),
         "up": ((0.5, 0.62, 1.15), (0.5, 0.42, 1.15)), "down": ((0.5, 0.42, 1.15), (0.5, 0.62, 1.15)),
         "left": ((0.6, 0.5, 1.22), (0.42, 0.5, 1.22)), "right": ((0.42, 0.5, 1.22), (0.6, 0.5, 1.22)),
         "hold": ((0.5, 0.5, 1.04), (0.5, 0.5, 1.09)), "punch": ((0.5, 0.5, 1.0), (0.5, 0.5, 1.12))}
def cam(v):
    if "from" in v: return v["from"], v["to"]
    a, b = MOVES[v.get("move", "push")]
    if "focus" in v:
        fx, fy = v["focus"]; z = v.get("zoom", 1.6); a = (fx, fy, z); b = (fx, fy, z * 1.1)
    return a, b
def shot_img(im, a, b, p, punch=False):
    e = ease(p)
    if punch: e = 1 - (1 - min(1, p * 4)) ** 3 if p < 0.25 else 1 + (p - 0.25) * 0.15
    cx = a[0] + (b[0] - a[0]) * e; cy = a[1] + (b[1] - a[1]) * e; z = a[2] + (b[2] - a[2]) * e
    IW, IH = im.size; cw = IW / z; ch = cw * 16 / 9
    if ch > IH: ch = IH; cw = ch * 9 / 16
    x0 = min(max(cx * IW - cw / 2, 0), IW - cw); y0 = min(max(cy * IH - ch / 2, 0), IH - ch)
    return im.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + cw, y0 + ch))

# ---------------- sound design ----------------
SR2 = 48000
def sfx_track(N, events):
    tt = np.arange(N) / SR2; out = np.zeros(N); rng = np.random.default_rng(7)
    def at(t0, sig):
        i = int(t0 * SR2); j = min(N, i + len(sig))
        if 0 <= i < N: out[i:j] += sig[:j - i]
    def env(n, k): x = np.arange(n) / SR2; return np.exp(-x * k)
    for kind, t0, extra in events:
        if kind == "pop":
            n = int(0.06 * SR2); x = np.arange(n) / SR2; at(t0, np.sin(2 * np.pi * 1200 * x) * env(n, 60) * 0.12)
        elif kind == "type":
            for k in range(int(extra)):
                n = int(0.02 * SR2); at(t0 + k * 0.045, rng.standard_normal(n) * env(n, 300) * 0.10)
        elif kind == "buzz":
            for k in range(2):
                n = int(0.35 * SR2); x = np.arange(n) / SR2
                at(t0 + k * 0.5, np.sign(np.sin(2 * np.pi * 150 * x)) * (0.5 + 0.5 * np.sin(2 * np.pi * 30 * x)) * 0.07)
        elif kind == "boom":
            n = int(1.4 * SR2); x = np.arange(n) / SR2; f = 38 + 70 * np.exp(-x * 7)
            at(t0, np.sin(2 * np.pi * np.cumsum(f) / SR2) * np.exp(-x * 3) * 0.55)
        elif kind == "riser":
            n = int(1.5 * SR2); x = np.arange(n) / SR2; nz = rng.standard_normal(n)
            nz = np.convolve(nz, np.ones(8) / 8, "same"); at(t0 - 1.5, nz * (x / 1.5) ** 2 * 0.25)
        elif kind == "heart":
            k = 0
            while k * 0.9 < extra:
                for d0, a0 in ((0, 0.5), (0.22, 0.35)):
                    n = int(0.18 * SR2); x = np.arange(n) / SR2
                    at(t0 + k * 0.9 + d0, np.sin(2 * np.pi * 55 * x) * np.exp(-x * 25) * a0)
                k += 1
        elif kind == "cash":
            n = int(0.5 * SR2); nz = rng.standard_normal(n); x = np.arange(n) / SR2
            mod = (np.sin(2 * np.pi * 38 * x) > 0.2).astype(float)
            at(t0, np.diff(np.concatenate([[0], nz])) * mod * np.exp(-x * 4) * 0.12)
        elif kind == "ring":
            for k in range(int(extra)):
                n = int(0.8 * SR2); x = np.arange(n) / SR2
                at(t0 + k * 1.6, (np.sin(2 * np.pi * 880 * x) + np.sin(2 * np.pi * 1320 * x)) * (np.sin(2 * np.pi * 20 * x) > 0) * 0.05 * np.exp(-x))
    return out

# ---------------- main ----------------
def main(story_path, test=False):
    story = json.load(open(story_path, encoding="utf-8"))
    name = os.path.splitext(os.path.basename(story_path))[0]
    work = os.path.join(HERE, "work", name); os.makedirs(work, exist_ok=True)
    outdir = os.path.join(HERE, "output"); os.makedirs(outdir, exist_ok=True)
    segs = story["segments"]
    # images
    need = [k for k in story["scenes"] if not os.path.exists(os.path.join(work, k + ".png"))]
    if need and not test:
        from make_short import start_comfy, gen_image
        start_comfy()
        for k in need:
            log("image", k)
            sc = story["scenes"][k]; pov = isinstance(sc, dict) and sc.get("pov"); txt = sc["prompt"] if isinstance(sc, dict) else sc
            gen_image(f"{story['style']} {'' if pov else story['character']} SCENE: {txt} No text, no letters, no watermark.",
                      random.randint(1, 2 ** 31), os.path.join(work, k + ".png"))
    imgs = {}
    for k in story["scenes"]:
        p = os.path.join(work, k + ".png")
        if os.path.exists(p): imgs[k] = Image.open(p).convert("RGB")
        else:  # placeholder (test mode)
            im = Image.new("RGB", (896, 1600), (60 + hash(k) % 120, 50, 40)); ImageDraw.Draw(im).text((300, 700), k, font=F(UIB, 200), fill=(255, 255, 255)); imgs[k] = im
    # voice
    if test:
        toks = []; t = 0.3
        for s in segs:
            for w in clean_words(s["text"]): d = 0.12 + 0.055 * len(w); toks.append([w, t, t + d]); t += d + 0.06
            t += 0.35
        vo_path = None
    else:
        log("voice")
        prov = story.get("voice", {}).get("provider", "elevenlabs")
        try:
            if prov != "elevenlabs": raise RuntimeError("kokoro requested")
            vo_path, toks = eleven(story, work)
        except Exception as e:
            log("ElevenLabs unavailable -> Kokoro fallback:", str(e)[:200])
            vo_path, toks = kokoro_voice(story, work)
    words = assign_times(story, toks)
    seg_t = []
    for i in range(len(segs)):
        ws = [w for w in words if w[3] == i]; seg_t.append([ws[0][1], ws[-1][2]])
    starts = [0.0] + [seg_t[i][0] - 0.05 for i in range(1, len(segs))]
    END = seg_t[-1][1] + story.get("tail", 3.0)
    shots = []
    for i, s in enumerate(segs):
        en = starts[i + 1] if i + 1 < len(segs) else END
        v = s.get("visual", {"continue": True})
        if v.get("continue") and shots: shots[-1]["end"] = en
        else: shots.append({"start": starts[i], "end": en, "v": v})
    # chips timeline
    chips = []; active = []
    events = []
    for i, s in enumerate(segs):
        t0 = starts[i]
        if "ui" in s:
            if not s.get("keep_ui"):
                for c in active: c["end"] = t0
                active = [c for c in active if c.get("sticky")]
            for k, c in enumerate(s["ui"]):
                c = dict(c); delay = c.get("delay", 0.15 + 0.3 * k)
                if "at_word" in c:
                    ws = [w for w in words if w[3] == i]; delay = ws[min(c["at_word"], len(ws) - 1)][1] - t0
                c["start"] = t0 + delay; c["end"] = END; chips.append(c); active.append(c)
                events.append(("pop", c["start"], 0))
                if c["type"] in ("msg", "reply"): events.append(("type", c["start"] + 0.2, min(30, len(c["text"]))))
        for e in s.get("sfx", []):
            kind, _, ex = (e + "::").split(":")[:3]
            events.append((kind, t0 + (float(ex) if ex and kind not in ("heart", "type", "ring") else 0), float(ex) if ex else 3))
        if s.get("flash") == "black" or "card" in s.get("visual", {}): events.append(("boom", t0, 0))
        if s.get("flash") == "invert": events.append(("riser", t0, 0)); events.append(("boom", t0, 0))
    flashes = [(starts[i], s["flash"]) for i, s in enumerate(segs) if s.get("flash")]
    # captions: one word at a time
    def caption(base, t):
        cur = None
        for w in words:
            if w[1] - 0.02 <= t < (w[2] + 0.25): cur = w
        if cur is None or segs[cur[3]].get("nocaps") or "card" in segs[cur[3]].get("visual", {}): return
        txt = cur[0].strip(".,!?;:\"'").upper()
        if not txt: return
        f = F(CAP, 130 * (0.88 + 0.12 * outback((t - cur[1]) / 0.12)))
        d = ImageDraw.Draw(base); tw = d.textlength(txt, font=f)
        d.text((W / 2 - tw / 2 + 5, 1530 + 7), txt, font=f, fill=(0, 0, 0), stroke_width=10, stroke_fill=(0, 0, 0))
        d.text((W / 2 - tw / 2, 1530), txt, font=f, fill=(255, 255, 255), stroke_width=10, stroke_fill=(0, 0, 0))
    def frame(t):
        sh = next((s for s in shots if s["start"] <= t < s["end"]), shots[-1]); v = sh["v"]
        p = (t - sh["start"]) / max(0.01, sh["end"] - sh["start"])
        if "card" in v:
            im = Image.new("RGB", (W, H), (12, 13, 16)); d = ImageDraw.Draw(im); tt0 = t - sh["start"]
            f = F(CAP, 190 * (0.9 + 0.1 * outback(tt0 / 0.3))); lbl = v.get("label", "")
            d.text((W / 2 - d.textlength(lbl, font=f) / 2, H / 2 - 150), lbl, font=f, fill=(255, 255, 255))
            if v.get("sub"): ctext(d, W / 2, H / 2 + 80, v["sub"], F(UIB, 44), GREEN)
        else:
            a, b = cam(v); im = shot_img(imgs[v["scene"]], a, b, p, v.get("move") == "punch")
        for ft, kind in flashes:
            dt = t - ft
            if kind == "black" and 0 <= dt < 0.12: im = Image.new("RGB", (W, H), (0, 0, 0))
            if kind == "invert" and 0 <= dt < 0.9 and not (0.3 < dt < 0.45):
                im = ImageOps.invert(ImageOps.grayscale(im)).convert("RGB")
        base = im.convert("RGBA")
        # vignette for chip legibility
        stack_y = 170 if any(c["type"] == "battery" and c["start"] <= t < c["end"] for c in chips) else 80
        for c in chips:
            if c["start"] <= t < c["end"]:
                pos = c.get("pos", "top")
                if pos == "top": y = stack_y; stack_y += chip_size(c) + 22
                elif pos == "bottom": y = 1140 - chip_size(c) if c["type"] != "choice" else 1050
                else: y = int(pos)
                draw_chip(base, c, y, t - c["start"], 0)
        im = base.convert("RGB"); caption(im, t)
        if t > END - 0.5: im = Image.blend(im, Image.new("RGB", (W, H)), (t - (END - 0.5)) / 0.5)
        return im
    if test or "--preview" in sys.argv:
        times = [((s["start"] + s["end"]) / 2) for s in shots] + [c["start"] + 1.2 for c in chips]
        for i, tm in enumerate(sorted(times)):
            frame(tm).resize((360, 640)).save(os.path.join(work, f"prev_{i:02d}.jpg"), quality=80)
        log("previews", len(times), f"END={END:.1f}")
        if test: return
    # audio
    log("audio")
    N = int(END * SR2); tt = np.arange(N) / SR2
    ff = shutil.which("ffmpeg") or "ffmpeg"
    raw = subprocess.run([ff, "-v", "error", "-i", vo_path, "-ac", "1", "-ar", str(SR2), "-f", "s16le", "-"], capture_output=True).stdout
    vo = np.frombuffer(raw, np.int16).astype(np.float32) / 32768; VO = np.zeros(N); VO[:min(N, len(vo))] = vo[:N]
    drone = np.zeros(N)
    for k, f in enumerate(story.get("pad", [55, 82.4, 110, 130.8])):
        drone += np.sin(2 * np.pi * f * tt + k) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * tt + k))
    drone = drone / 4 * 0.06 * np.clip(tt / 2, 0, 1)
    pulse = np.sin(2 * np.pi * 45 * tt) * np.exp(-((tt % 1.0) * 9)) * 0.05
    mix = VO + drone + pulse + sfx_track(N, events)
    mix *= np.clip((END - tt) / 1.0, 0, 1); mix /= max(1, np.abs(mix).max() / 0.95)
    wav = os.path.join(work, "mix.wav"); w = wave.open(wav, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR2)
    w.writeframes((np.repeat(mix[:, None], 2, 1) * 32767).astype(np.int16).tobytes()); w.close()
    out = os.path.join(outdir, name + ".mp4"); tmp = os.path.join(work, "video.mp4")
    log("render", f"{END:.1f}s")
    p = subprocess.Popen([ff, "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", tmp], stdin=subprocess.PIPE)
    for n in range(int(END * FPS)): p.stdin.write(frame(n / FPS).tobytes())
    p.stdin.close(); p.wait()
    subprocess.run([ff, "-y", "-v", "error", "-i", tmp, "-i", wav, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000",
                    "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out], check=True)
    log("DONE", out)

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    for a in args: main(a, test="--test" in sys.argv)
