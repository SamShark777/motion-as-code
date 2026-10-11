"""Sound design for the voiceover video.

The cue sheet below is derived from data/lyrics.json — the same word times the plates animate on —
so every effect lands on its visual event. The sounds are the ElevenLabs library in audio/sfx/
(name_1.mp3, name_2.mp3 … alternate takes). Each sound is placed by its transient ('onset'), by its
loudest point ('peak', whooshes), by its end ('end', reverse sucks and risers) or as recorded
('raw', beds). Effects are ducked under the voice, then the whole mix is loudness-normalised.

    python -m uv run --no-project --with numpy python analysis/sfx_mix.py
Writes out/mix.wav (48 kHz stereo) and out/sfx_cues.json; mux with:
    ffmpeg -i out/motion-as-code.mp4 -i out/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest out/…
"""
import json, re, subprocess
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SFX = ROOT / "audio" / "sfx"
SR = 48000
DUR = json.loads((ROOT / 'data' / 'audio.json').read_text())['duration']

# ------------------------------------------------------------------ the script
LY = json.loads((ROOT / "data" / "lyrics.json").read_text(encoding="utf-8"))["lines"]
fold = lambda s: s.lower().replace("’", "'").replace("“", '"').replace("”", '"')
norm = lambda s: re.sub(r"[^a-z0-9()]", "", fold(s))


def line(q, nth=0):
    ls = [l for l in LY if fold(q) in fold(l["text"])]
    return ls[nth]


def W(lq, wq, nth=0):
    ws = [w for w in line(lq)["words"] if norm(w["w"]) == norm(wq)]
    return ws[nth]


def parts(w):
    return w.get("syl") or [[w["start"], w["end"]]]


def cut(q):
    l = line(q)
    i = LY.index(l)
    gap = l["start"] - LY[i - 1]["end"] if i else 1
    return l["start"] - min(0.18, max(0.04, gap * 0.45))


# ------------------------------------------------------------------ the library
MODE = {  # how a sound is placed relative to its cue time
    "whoosh_fast": "peak", "whoosh_soft": "peak", "reverse_suck": "end", "riser": "end",
    "spark_sizzle": "raw", "projector_run": "raw", "tape_rewind": "raw", "tape_ff": "raw", "scan_sweep": "raw", "spark_zip": "raw",
    "falling_pieces": "onset", "paper_slide": "onset",
}
_cache = {}


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def takes(name):
    if name == "tape_ff":  # the rewind, played backwards: a fast-forward
        return [t[::-1].copy() for t in takes("tape_rewind")]
    if name not in _cache:
        fs = sorted(SFX.glob(f"{name}_*.mp3"))
        if not fs:
            raise FileNotFoundError(f"no takes for {name}")
        out = []
        for f in fs:
            x = decode(f)
            x = x - x.mean()
            pk = np.abs(x).max() + 1e-9
            x = x / pk * 10 ** (-1 / 20)  # peak -1 dBFS
            out.append(x)
        _cache[name] = out
    return _cache[name]


def onset(x):
    """Start of the main transient: the first sample above half the peak, less 8 ms of attack
    (a soft pre-noise before the hit must not shift the hit off its frame)."""
    a = np.abs(x)
    idx = np.where(a > 0.5 * a.max())[0]
    return max(0, int(idx[0]) - int(0.008 * SR)) if len(idx) else 0


def peak_at(x):
    env = np.convolve(np.abs(x), np.ones(int(0.02 * SR)) / (0.02 * SR), mode="same")
    return int(np.argmax(env))


def resample(x, rate):
    if abs(rate - 1) < 1e-4:
        return x
    n = int(len(x) / rate)
    return np.interp(np.arange(n) * rate, np.arange(len(x)), x).astype(np.float32)


# ------------------------------------------------------------------ cues
CUES = []
_n = {}


def cue(t, name, db, pan=0.0, rate=1.0, take=None, length=None, fade=0.03, mode=None):
    """Place `name` at time t (seconds). take: 1-based take index (default: alternate)."""
    k = _n.get(name, 0)
    _n[name] = k + 1
    CUES.append(dict(t=float(t), name=name, db=float(db), pan=float(pan), rate=float(rate), take=take if take else None, k=k, length=length, fade=fade, mode=mode or MODE.get(name, "onset")))


def bed(name, t0, t1, db, pan=0.0, rate=1.0, fin=0.06, fout=0.12):
    CUES.append(dict(t=float(t0), name=name, db=float(db), pan=float(pan), rate=float(rate), take=1, k=0, length=float(t1 - t0), fade=fout, fin=fin, mode="bed"))


def jitter(i, a=0.05):
    """Deterministic ±a pitch jitter for repeated sounds."""
    return 1.0 + a * (((i * 7919) % 101) / 50.0 - 1.0)


def typing(name, t0, t1, db, pan=0.0, step=0.075, start=0):
    """Key strikes from t0 to t1 at ~step intervals (with a little swing)."""
    t, i = t0, start
    while t < t1 - 0.01:
        cue(t, name, db + (((i * 37) % 7) - 3) * 0.6, pan=pan, rate=jitter(i))
        t += step * (0.8 + 0.4 * (((i * 53) % 11) / 10.0))
        i += 1
    return i


def type_words(name, words, db, pan=0.0, frac=0.75, per=2.6):
    """Key clicks for words typed as they are said: ~one strike per `per` chars, over frac of each word."""
    i = 0
    for w in words:
        n = max(1, round(len(w["w"]) / per))
        d = max(0.08, (w["end"] - w["start"]) * frac)
        for j in range(n):
            cue(w["start"] + d * j / n, name, db + (((i * 37) % 7) - 3) * 0.5, pan=pan, rate=jitter(i))
            i += 1


# ================================================================== VERTICAL TEMPLATE (TPL=1)
def template_cues():
    import os
    SC = json.loads((ROOT / "data" / "script.json").read_text(encoding="utf-8"))
    secl = lambda secs: [l for l in LY if l.get("sec") in secs]
    def word(lines, q):
        n = norm(q)
        for l in lines:
            for w in l["words"]:
                if norm(w["w"]) == n:
                    return w
        for l in lines:
            for w in l["words"]:
                if len(n) > 1 and norm(w["w"]).startswith(n):
                    return w
        return None
    def cutl(l):
        i = LY.index(l)
        gap = l["start"] - LY[i - 1]["end"] if i else 1
        return l["start"] - min(0.18, max(0.04, gap * 0.45))
    hook, name, ev, tk = secl(["hook"]), secl(["name"]), secl(["study", "stat"]), secl(["takeaway"])
    cue(0.25, "whoosh_soft", -16)
    if hook:
        ws = [w for l in hook for w in l["words"]]
        t0, t1 = ws[0]["start"], ws[-1]["end"]
        n = 12 if SC.get("hookStyle", "eyes") == "eyes" else 8
        for i in range(n):
            cue(t0 + 0.25 + (t1 - t0) * i / n + 0.04, "ui_blip", -22, pan=((i * 37) % 11 - 5) / 6, rate=jitter(i, 0.12))
    if name:
        cue(cutl(name[0]), "whoosh_fast", -17)
        ws = [w for l in name for w in l["words"]]
        c = word(name, SC.get("titleCue", "")) if SC.get("titleCue") else None
        c = c or ws[max(0, len(ws) - 2)]
        cue(c["start"], "projector_click", -9); cue(c["start"] + 0.11, "projector_click", -15, rate=1.1)
        cue(c["start"], "impact_slam", -15)
        cue(max(ws[-1]["start"], c["start"] + 0.25), "stamp", -10)
    if ev:
        cue(cutl(ev[0]), "whoosh_fast", -16)
        cue(ev[0]["start"] - 0.05, "paper_slide", -16)
        st = SC.get("stat")
        if st:
            wa = word(ev, st["a"]["cue"])
            if wa:
                cue(wa["start"] - 0.05, "ui_tick", -16)
                for k in range(8):
                    cue(wa["start"] + k * 0.035, "ui_blip", -21, pan=-0.6 + 0.15 * k, rate=1.0 + 0.04 * k)
            if st.get("b"):
                wb = word(ev, st["b"]["cue"])
                if wb:
                    typing("typewriter", max(wb["start"] - 0.5, (wa["end"] if wa else wb["start"] - 0.5)), wb["start"], -27, pan=0.4, step=0.05)
                    cue(wb["start"], "ui_tick", -15, pan=0.4)
                    if st["b"]["value"] < st["a"]["value"]:
                        cue(wb["end"] - 0.05, "marker_strike", -11, pan=-0.4)
                    else:
                        cue(wb["end"], "confirm_chime", -13)
    if tk:
        cue(cutl(tk[0]) + 0.05, "whoosh_soft", -15)
        cue(tk[0]["start"], "impact_small", -18)
        last = tk[-1]["words"][-1]
        cue(last["start"] + 0.08, "ui_blip", -14, rate=1.2)
        tE = tk[-1]["end"] + 0.15
        cue(tE, "impact_small", -17); cue(tE + 0.12, "stamp", -11)
        typing("key_click", tE + 0.3, tE + 0.6, -26, step=0.04)


import os as _os
if _os.environ.get("TPL"):
    template_cues()
else:
    # ================================================================== SPOTLIGHT EFFECT
    L1, L2, L3, L4, L5, L6, L7 = "Ever feel", "Psychologists", "In one study", "They guessed", "The real number", "Everyone else", "So relax"
    cue(0.25, "whoosh_soft", -16)
    e0, e1 = W(L1, "everyone")["start"] - 0.05, W(L1, "you?")["end"]
    EYES_X = [-860, -120, -700, -300, 880, -900, 820, -60, 300, -900, 620, -150, 880, -50]
    for i, x in enumerate(EYES_X):
        cue(e0 + (e1 - e0) * i / len(EYES_X) + 0.04, "ui_blip", -22, pan=x / 1100, rate=jitter(i, 0.12))
    type_words("key_click", [w for w in line(L2)["words"][:6]], -30, pan=0.3)
    cue(W(L2, "the")["start"], "impact_small", -17)
    cue(W(L2, "spotlight")["start"], "projector_click", -9)
    cue(W(L2, "spotlight")["start"] + 0.11, "projector_click", -15, rate=1.1)
    cue(W(L2, "spotlight")["start"], "impact_slam", -15)
    cue(W(L2, "effect.")["start"], "stamp", -10)
    # study
    cue(cut(L3), "whoosh_fast", -16)
    cue(W(L3, "students")["start"] + 0.1, "paper_slide", -16)
    t = W(L3, "students")["start"] + 0.2
    i = 0
    while t < W(L3, "room")["end"]:
        cue(t, "pen_tick", -24, pan=-0.6, rate=0.8 * jitter(i)); t += 0.24; i += 1
    cue(W(L3, "embarrassing")["start"], "zap_slash", -13, pan=-0.5)
    cue(W(L3, "embarrassing")["start"] + 0.05, "scan_sweep", -20, pan=-0.5)
    cue(W(L3, "T-shirt.")["start"], "ui_tick", -18, pan=-0.5)
    cue(W(L4, "guessed")["start"], "ui_tick", -16, pan=0.7)
    for k in range(10):
        cue(W(L4, "half")["start"] + k * 0.035, "ui_blip", -20, pan=-0.2 + 0.08 * k, rate=1.0 + 0.04 * k)
    cue(W(L5, "real")["start"], "ui_tick", -16, pan=0.7)
    typing("typewriter", W(L5, "real")["start"] + 0.1, W(L5, "About")["start"], -26, pan=0.7, step=0.05)
    for k in range(5):
        cue(W(L5, "About")["start"] + 0.05 + k * 0.08, "ui_blip", -21, pan=0.1 * k, rate=0.9 - 0.04 * k)
    cue(W(L5, "quarter.")["end"] - 0.1, "marker_strike", -11, pan=0.7)
    # close
    cue(cut(L6), "whoosh_soft", -16)
    s0 = W(L6, "starring")["start"]
    for k, d in enumerate([0.0, 0.06, 0.12, 0.17, 0.23, 0.3, 0.35]):
        cue(s0 + d, "projector_click", -17, pan=-0.8 + 0.27 * k, rate=jitter(k, 0.1))
    cue(W(L6, "movie.")["start"], "whoosh_fast", -18)
    bed("projector_run", W(L6, "movie.")["start"], line(L7)["start"], -22)
    cue(line(L7)["start"] - 0.1, "whoosh_soft", -15)
    cue(W(L7, "relax.")["start"], "impact_small", -18)
    cue(W(L7, "think.")["start"] + 0.08, "ui_blip", -14, rate=1.2)
    tE = line(L7)["end"] + 0.15
    cue(tE, "impact_small", -17); cue(tE + 0.06, "projector_click", -15); cue(tE + 0.14, "stamp", -11)



# ------------------------------------------------------------------ render the mix
def main():
    n = int(DUR * SR)
    bus = np.zeros((2, n), np.float32)
    report = []
    for c in CUES:
        tk = takes(c["name"])
        x = tk[(c["take"] - 1) % len(tk)] if c["take"] else tk[c["k"] % len(tk)]
        x = resample(x, c["rate"])
        mode = c["mode"]
        if mode == "onset":
            x = x[onset(x):]
            start = c["t"]
        elif mode == "peak":
            start = c["t"] - peak_at(x) / SR
        elif mode == "end":
            start = c["t"] - len(x) / SR
        else:
            start = c["t"]
        if mode == "bed":
            L = int(c["length"] * SR)
            reps = int(np.ceil(L / len(x))) + 1
            x = np.tile(x, reps)[:L].copy()
            fi = int(c.get("fin", 0.06) * SR)
            if fi:
                x[:fi] *= np.linspace(0, 1, fi)
        if c.get("length") and mode != "bed":
            x = x[: int(c["length"] * SR)].copy()
        fo = min(len(x), int(c["fade"] * SR))
        if fo > 1:
            x[-fo:] *= np.linspace(1, 0, fo)
        g = 10 ** (c["db"] / 20)
        a = (c["pan"] + 1) * np.pi / 4
        i0 = int(round(start * SR))
        j0 = max(0, -i0)
        i0 = max(0, i0)
        seg = x[j0:]
        m = min(len(seg), n - i0)
        if m <= 0:
            continue
        bus[0, i0:i0 + m] += seg[:m] * g * np.cos(a)
        bus[1, i0:i0 + m] += seg[:m] * g * np.sin(a)
        report.append({**{k: c[k] for k in ("t", "name", "db", "pan", "rate", "mode")}, "start": round(start, 3)})
    # the voice
    vo = decode(ROOT / "audio" / "voiceover.mp3")[:n]
    vo = np.pad(vo, (0, n - len(vo)))
    # ducking: effects dip up to 7 dB while the voice is speaking (10 ms attack, 180 ms release)
    hop = int(0.005 * SR)
    env = np.sqrt(np.convolve(vo ** 2, np.ones(hop * 4) / (hop * 4), mode="same"))
    env = env / (np.percentile(env, 99) + 1e-9)
    sm = np.zeros_like(env)
    a_att, a_rel = np.exp(-1 / (0.010 * SR)), np.exp(-1 / (0.180 * SR))
    prev = 0.0
    for i in range(0, n, hop):  # one-pole follower at 5 ms steps
        e = float(env[i])
        coef = a_att if e > prev else a_rel
        coef = coef ** hop
        prev = coef * prev + (1 - coef) * e
        sm[i:i + hop] = prev
    duck = 10 ** (-7 * np.clip(sm, 0, 1) / 20)
    mix = bus * duck[None, :] + vo[None, :]
    peak = np.abs(mix).max()
    if peak > 0.99:
        mix *= 0.99 / peak
    out = ROOT / "out" / "mix_raw.wav"
    import wave
    pcm = (np.clip(mix.T, -1, 1) * 32767).astype("<i2")
    with wave.open(str(out), "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(pcm.tobytes())
    (ROOT / "out" / "sfx_cues.json").write_text(json.dumps(report, indent=1), encoding="utf-8")
    sfx_rms = float(np.sqrt((bus ** 2).mean())); vo_rms = float(np.sqrt((vo ** 2).mean()))
    print(f"{len(report)} cues; SFX bus {20*np.log10(sfx_rms+1e-9):.1f} dB RMS vs voice {20*np.log10(vo_rms+1e-9):.1f} dB RMS; mix peak {20*np.log10(peak+1e-9):.1f} dBFS")
    # loudness: two-pass loudnorm to -14 LUFS, true peak -1.5
    meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(out), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(meas[meas.rindex("{"): meas.rindex("}") + 1])
    af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
          f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out), "-af", af, "-ar", str(SR), str(ROOT / "out" / "mix.wav")], check=True)
    print(f"input {j['input_i']} LUFS -> -14 LUFS; wrote out/mix.wav")


if __name__ == "__main__":
    main()
