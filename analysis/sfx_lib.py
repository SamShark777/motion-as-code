"""Sound-effect library, ported from the "One More Never Enough" build (Shivam's Claude Design export,
tools/audio/sfx.py there). Everything is synthesised with numpy, so it's ours to use.
    from sfx_lib import get   # get("pop") -> float32 mono array at SR (cached in data/sfx/)
"""
import pathlib

import numpy as np
import soundfile as sf

SR = 48000
ROOT = pathlib.Path(__file__).resolve().parents[1]
SFX_DIR = ROOT / "data" / "sfx"
rng = np.random.default_rng(7)


# ---------- building blocks ----------
def t_axis(dur: float) -> np.ndarray:
    return np.arange(int(dur * SR)) / SR


def noise(dur: float) -> np.ndarray:
    return rng.standard_normal(int(dur * SR))


def env_ad(n: int, attack: float, decay: float, curve: float = 4.0) -> np.ndarray:
    """Attack (linear, s) then exponential-ish decay (s) over n samples."""
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    d = np.exp(-curve * np.clip(t - attack, 0, None) / max(decay, 1e-4))
    return a * d


def bell_env(n: int, peak: float = 0.5, sharp: float = 2.0) -> np.ndarray:
    """Smooth swell-and-fall envelope peaking at fraction `peak` of the clip."""
    x = np.linspace(0, 1, n)
    rise = np.clip(x / peak, 0, 1)
    fall = np.clip((1 - x) / (1 - peak), 0, 1)
    return (np.sin(np.pi / 2 * rise) * np.sin(np.pi / 2 * fall)) ** sharp


def svf(x: np.ndarray, fc, q: float = 0.8, mode: str = "bp") -> np.ndarray:
    """Chamberlin state-variable filter; fc may be a scalar or a per-sample array."""
    fc = np.broadcast_to(np.asarray(fc, dtype=np.float64), x.shape)
    f = 2 * np.sin(np.pi * np.clip(fc, 20, SR / 6) / SR)
    damp = 1 / q
    low = band = 0.0
    out = np.empty_like(x)
    for i in range(len(x)):
        high = x[i] - low - damp * band
        band += f[i] * high
        low += f[i] * band
        out[i] = band if mode == "bp" else low if mode == "lp" else high
    return out


def onepole_lp(x: np.ndarray, fc: float) -> np.ndarray:
    a = np.exp(-2 * np.pi * fc / SR)
    out = np.empty_like(x)
    y = 0.0
    for i in range(len(x)):
        y = (1 - a) * x[i] + a * y
        out[i] = y
    return out


def tone(freq, dur: float, partials=((1, 1.0),)) -> np.ndarray:
    """Additive tone; freq may be a scalar or a per-sample array (glide)."""
    n = int(dur * SR)
    f = np.broadcast_to(np.asarray(freq, dtype=np.float64), (n,))
    phase = 2 * np.pi * np.cumsum(f) / SR
    return sum(a * np.sin(k * phase) for k, a in partials)


def norm(x: np.ndarray, peak: float = 0.9) -> np.ndarray:
    return x / max(1e-9, np.abs(x).max()) * peak


def fade_edges(x: np.ndarray, ms: float = 4) -> np.ndarray:
    n = int(ms / 1000 * SR)
    if n and len(x) > 2 * n:
        r = np.linspace(0, 1, n)
        x = x.copy()
        x[:n] *= r
        x[-n:] *= r[::-1]
    return x


def save(name: str, x: np.ndarray, peak: float = 0.9) -> None:
    sf.write(SFX_DIR / f"{name}.wav", fade_edges(norm(x, peak)).astype(np.float32), SR, subtype="PCM_16")
    print(f"sfx/{name}.wav  {len(x) / SR:.2f}s")


# ---------- sound effects ----------
def swipe():
    d = 0.32
    n = int(d * SR)
    fc = np.geomspace(900, 4200, n)
    return svf(noise(d), fc, q=1.4) * bell_env(n, 0.35, 1.5)


def whoosh():
    d = 0.8
    n = int(d * SR)
    fc = np.concatenate([np.geomspace(300, 2600, n // 2), np.geomspace(2600, 600, n - n // 2)])
    return svf(noise(d), fc, q=1.8) * bell_env(n, 0.55, 1.6)


def pop():
    d = 0.14
    n = int(d * SR)
    f = np.geomspace(780, 240, n)
    return tone(f, d, ((1, 1), (2, 0.15))) * env_ad(n, 0.003, 0.09, 5)


def tick():
    d = 0.05
    n = int(d * SR)
    click = svf(noise(d), 3500, q=3) * env_ad(n, 0.0005, 0.02, 6)
    return click + 0.4 * tone(2400, d) * env_ad(n, 0.0005, 0.015, 6)


def chime(notes=(880.0, 1318.5), d=1.4, stagger=0.0):
    n = int(d * SR)
    out = np.zeros(n)
    for i, f in enumerate(notes):
        s = int(i * stagger * SR)
        m = n - s
        out[s:] += tone(f, m / SR, ((1, 1), (2.76, 0.18), (5.4, 0.05))) * env_ad(m, 0.004, 0.9, 4)
    return out


def rising():
    d = 0.75
    n = int(d * SR)
    f = np.geomspace(440, 880, n)
    return tone(f, d, ((1, 1), (2, 0.2), (3, 0.06))) * bell_env(n, 0.7, 1.2)


def notification():
    """Soft two-note ping (G5 → D6)."""
    d = 0.7
    n = int(d * SR)
    out = np.zeros(n)
    for start, f in ((0.0, 783.99), (0.11, 1174.66)):
        s = int(start * SR)
        m = n - s
        out[s:] += tone(f, m / SR, ((1, 1), (2, 0.12))) * env_ad(m, 0.003, 0.45, 5)
    return out


def flip_dull():
    d = 0.16
    n = int(d * SR)
    body = svf(noise(d), np.geomspace(1400, 500, n), q=1.2) * env_ad(n, 0.004, 0.07, 5)
    thump = tone(np.geomspace(190, 110, n), d) * env_ad(n, 0.002, 0.06, 5)
    return body + 0.6 * thump


def flip():
    d = 0.16
    n = int(d * SR)
    return svf(noise(d), np.geomspace(2200, 900, n), q=1.3) * env_ad(n, 0.003, 0.06, 5)


def lightning():
    d = 0.5
    n = int(d * SR)
    crack = svf(noise(d), np.geomspace(5000, 900, n), q=0.9) * env_ad(n, 0.002, 0.18, 5)
    zap = tone(np.geomspace(1800, 160, n), d, ((1, 1), (3, 0.3), (5, 0.15))) * env_ad(n, 0.002, 0.3, 4)
    return crack + 0.45 * zap


def airy():
    d = 0.9
    n = int(d * SR)
    return svf(noise(d), np.geomspace(1800, 3200, n), q=0.7) * bell_env(n, 0.45, 1.8)


def card_slide():
    d = 0.45
    n = int(d * SR)
    return svf(noise(d), np.geomspace(2600, 1400, n), q=0.9) * bell_env(n, 0.3, 1.6)


def settle():
    d = 0.35
    n = int(d * SR)
    thud = tone(np.geomspace(160, 90, n), d, ((1, 1), (2, 0.2))) * env_ad(n, 0.004, 0.2, 5)
    brush = svf(noise(d), 900, q=0.8) * env_ad(n, 0.004, 0.1, 5)
    return thud + 0.35 * brush


def toggle_click():
    d = 0.06
    n = int(d * SR)
    a = svf(noise(d), 4200, q=4) * env_ad(n, 0.0005, 0.012, 6)
    b = np.zeros(n)
    s = int(0.022 * SR)
    b[s:] = svf(noise(d - s / SR), 2600, q=4) * env_ad(n - s, 0.0005, 0.015, 6)
    return a + 0.7 * b


def drawer():
    """Wooden drawer sliding shut, ending in a soft thunk."""
    d = 1.0
    n = int(d * SR)
    slide_n = int(0.72 * SR)
    grain = svf(noise(slide_n / SR), 420, q=1.1) * (1 + 0.5 * np.sin(2 * np.pi * 23 * np.arange(slide_n) / SR))
    rumble = grain * bell_env(slide_n, 0.6, 1.2)
    out = np.zeros(n)
    out[:slide_n] += rumble
    s = int(0.68 * SR)
    m = n - s
    out[s:] += 2.2 * tone(np.geomspace(130, 85, m), m / SR, ((1, 1), (2.3, 0.3))) * env_ad(m, 0.002, 0.18, 5)
    out[s:] += 0.8 * svf(noise(m / SR), 1100, q=1.5) * env_ad(m, 0.001, 0.05, 6)
    return out


def page_turn():
    d = 0.75
    n = int(d * SR)
    rustle = svf(noise(d), np.geomspace(2200, 6000, n), q=0.6)
    flutter = 1 + 0.6 * np.sin(2 * np.pi * np.cumsum(np.linspace(18, 6, n)) / SR)
    return rustle * flutter * bell_env(n, 0.4, 1.5)


def wood_tap(f=620.0):
    d = 0.3
    n = int(d * SR)
    body = tone(f, d, ((1, 1), (2.57, 0.35), (4.1, 0.12))) * env_ad(n, 0.001, 0.12, 5)
    knock = svf(noise(d), 2400, q=2) * env_ad(n, 0.0005, 0.012, 6)
    return body + 0.5 * knock



GEN = {"swipe": swipe, "whoosh": whoosh, "pop": pop, "tick": tick, "chime": chime, "rising": rising,
       "notification": notification, "flip-dull": flip_dull, "flip": flip,
       "chime-bright": lambda: chime((1046.5, 1318.5, 1568.0, 2093.0), d=1.6, stagger=0.07),
       "lightning": lightning, "airy": airy, "card-slide": card_slide, "settle": settle, "toggle": toggle_click,
       "drawer": drawer, "page-turn": page_turn, "wood-tap": wood_tap}


def get(name: str) -> np.ndarray:
    p = SFX_DIR / f"{name}.wav"
    if not p.exists():
        SFX_DIR.mkdir(parents=True, exist_ok=True)
        save(name, GEN[name]())
    x, sr = sf.read(str(p), dtype="float32")
    return x


# ---------- music bed (any length) ----------

def midi(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def pad_voice(freq: float, dur: float, bright: float) -> np.ndarray:
    """Soft synth pad: two detuned voices with a few gentle partials."""
    partials = ((1, 1.0), (2, 0.22 * bright), (3, 0.08 * bright), (4, 0.03 * bright))
    return 0.5 * (tone(freq * 1.0025, dur, partials) + tone(freq / 1.0025, dur, partials))


def music_fixed() -> np.ndarray:
    """Original 58 s bed in F major: pads change every 4 s, a sparse keys motif on top.

    Full texture to 44 s, thins (keys out, upper pad voices drop) 44–51 s,
    settles on the tonic by 51 s and resolves through to 58 s.
    """
    total = 58.0
    n = int(total * SR)
    out = np.zeros(n)
    # (start, dur, midi notes, brightness)
    F, Am, Dm, Bb, C, Gm = (
        [41, 53, 57, 60, 64],  # Fmaj7
        [45, 52, 57, 60, 64],  # Am7
        [38, 50, 57, 60, 65],  # Dm9-ish
        [46, 53, 57, 62, 65],  # Bbmaj7
        [48, 52, 55, 60, 67],  # C
        [43, 50, 58, 62, 65],  # Gm7
    )
    prog = [F, Am, Dm, Bb, F, Am, Gm, C, F, Am, Dm, Bb]  # 12 × 4 s = 48 s
    chords = [(i * 4.0, 4.6, c, 1.0) for i, c in enumerate(prog)]
    # thin-out section: fewer voices from 44 s
    chords[-1] = (44.0, 4.0, [46, 53, 57], 0.6)
    chords.append((47.5, 4.2, [48, 55, 60], 0.45))
    chords.append((51.0, 7.0, [41, 53, 57, 60], 0.4))  # settle + resolve on F
    for start, dur, notes, bright in chords:
        dur = min(dur, total - start)
        m = int(dur * SR)
        attack = 0.9 if start < 51 else 1.4
        env = np.clip(np.arange(m) / (attack * SR), 0, 1) * np.clip((m - np.arange(m)) / (0.9 * SR), 0, 1)
        voice = sum(pad_voice(midi(p), dur, bright) / (1 + 0.15 * k) for k, p in enumerate(notes))
        s = int(start * SR)
        out[s:s + m] += voice * env
    out = onepole_lp(out, 2400)
    # keys motif: gentle electric-piano plucks, only while the full texture plays
    motif = [72, 69, 67, 69, 72, 74, 72, 67]
    for i in range(22):
        at = 2.0 + i * 2.0
        if at >= 44.0:
            break
        f = midi(motif[i % len(motif)])
        d = 1.6
        m = int(d * SR)
        pluck = tone(f, d, ((1, 1), (2, 0.25), (3, 0.06))) * env_ad(m, 0.005, 1.1, 4)
        s = int(at * SR)
        out[s:s + m] += 0.22 * pluck
    # global envelope: fade in, thin from 44 s, settle by 51 s, resolve and fade at the end
    tt = np.arange(n) / SR
    g = np.interp(tt, [0, 1.5, 44, 51, 55.5, 58], [0, 1, 1, 0.7, 0.7, 0])
    return norm(out * g, 0.8)




# Per-video variation (Shivam 2026-10-19: one identical bed on every Short can read as repetitive content).
# Same calm family, but each video gets its own key, chord progression, tempo, lead instrument, motif,
# pad colour and optional soft pulse, all chosen from a seed (the slug).
PROGS = {  # chord roots as scale degrees in a major key, with 7th/9th colour
    "lift":   [[0, 4, 7, 11, 14], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 17]],      # I vi IV V
    "drift":  [[0, 4, 7, 11], [5, 9, 12, 16], [9, 12, 16, 19], [7, 11, 14, 17]],         # I IV vi V
    "night":  [[9, 12, 16, 19], [5, 9, 12, 16], [0, 4, 7, 11], [7, 11, 14, 17]],         # vi IV I V
    "float":  [[0, 4, 7, 11, 14], [2, 5, 9, 12], [5, 9, 12, 16], [0, 4, 7, 11]],         # I ii IV I
    "dusk":   [[9, 12, 16, 19], [2, 5, 9, 12], [7, 11, 14, 17], [0, 4, 7, 11]],          # vi ii V I
    "glide":  [[0, 4, 7, 11], [4, 7, 11, 14], [5, 9, 12, 16], [5, 8, 12, 15]],           # I iii IV iv
}
MOTIFS = [[12, 9, 7, 9, 12, 14, 12, 7], [7, 9, 12, 14, 12, 9], [16, 14, 12, 9, 7, 9], [12, 14, 16, 19, 16, 14, 12, 9],
          [7, 12, 9, 14, 12, 16], [19, 16, 14, 12, 14, 16]]
SCALE = [0, 2, 4, 5, 7, 9, 11]


def _lead(kind, f, d):
    m = int(d * SR)
    if kind == "bell":
        return tone(f, d, ((1, 1), (2.76, 0.25), (5.4, 0.07))) * env_ad(m, 0.003, 1.3, 4)
    if kind == "marimba":
        return tone(f, d, ((1, 1), (4, 0.18), (9.2, 0.04))) * env_ad(m, 0.002, 0.45, 5)
    if kind == "glass":
        return tone(f, d, ((1, 1), (2, 0.08), (3, 0.04))) * env_ad(m, 0.05, 1.4, 3) * (1 + 0.15 * np.sin(2 * np.pi * 5 * np.arange(m) / SR))
    return tone(f, d, ((1, 1), (2, 0.25), (3, 0.06))) * env_ad(m, 0.005, 1.1, 4)  # e-piano pluck


def music(total: float, seed=None) -> np.ndarray:
    """Calm pad bed of any length. seed=None reproduces the original One More bed; any other seed (e.g. the
    slug) picks a different key, progression, tempo, lead, motif and texture. Thins over the last ~14 s,
    settles on the tonic for the last ~7 s and fades out."""
    n = int(total * SR)
    out = np.zeros(n)
    if seed is None:
        key, prog, bar, lead, motif, bright, pulse, lp = 41, "lift", 4.0, "epiano", MOTIFS[0], 1.0, False, 2400
        prog_chords = [[41, 53, 57, 60, 64], [45, 52, 57, 60, 64], [38, 50, 57, 60, 65], [46, 53, 57, 62, 65],
                       [41, 53, 57, 60, 64], [45, 52, 57, 60, 64], [43, 50, 58, 62, 65], [48, 52, 55, 60, 67]]
    else:
        r = np.random.default_rng(abs(hash_seed(seed)))
        key = int(r.choice([36, 37, 38, 39, 40, 41, 42, 43]))          # C .. G (low root)
        prog = str(r.choice(list(PROGS)))
        bar = float(r.choice([3.2, 3.6, 4.0, 4.4, 5.0]))
        lead = str(r.choice(["epiano", "bell", "marimba", "glass"]))
        motif = MOTIFS[int(r.integers(len(MOTIFS)))]
        bright = float(r.uniform(0.6, 1.2))
        pulse = bool(r.random() < 0.5)
        lp = float(r.choice([1800, 2200, 2600, 3000]))
        prog_chords = [[key + 12 + d if j else key + d for j, d in enumerate(ch)] for ch in PROGS[prog]]
    thin, settle = max(bar, total - 14.0), max(6.0, total - 7.0)
    chords, t, i = [], 0.0, 0
    while t < thin:
        chords.append((t, bar + 0.6, prog_chords[i % len(prog_chords)], bright))
        t += bar
        i += 1
    tonic = [key, key + 12, key + 16, key + 19]
    chords.append((thin, settle - thin + 0.6, tonic[:3], 0.6 * bright))
    chords.append((settle, total - settle, tonic, 0.4 * bright))
    for start, dur, notes, br in chords:
        dur = min(dur, total - start)
        if dur <= 0.05:
            continue
        m = int(dur * SR)
        attack = 0.9 if start < settle else 1.4
        env = np.clip(np.arange(m) / (attack * SR), 0, 1) * np.clip((m - np.arange(m)) / (0.9 * SR), 0, 1)
        voice = sum(pad_voice(midi(p), dur, br) / (1 + 0.15 * k) for k, p in enumerate(notes))
        s0 = int(start * SR)
        out[s0:s0 + m] += voice[: n - s0] * env[: n - s0]
    out = onepole_lp(out, lp)
    # lead motif (in key), every half bar
    step = bar / 2
    k = 0
    while 2.0 + k * step < thin:
        at = 2.0 + k * step
        deg = motif[k % len(motif)]
        f = midi(key + 24 + deg)
        d = 1.6
        pl = _lead(lead, f, d)
        s0 = int(at * SR)
        e = min(n, s0 + len(pl))
        out[s0:e] += 0.22 * pl[: e - s0]
        k += 1
    if pulse:  # very soft low heartbeat on each bar
        k = 0
        while k * bar < thin:
            s0 = int(k * bar * SR)
            d = 0.35
            m = int(d * SR)
            th = 0.35 * tone(np.geomspace(midi(key + 12), midi(key), m), d) * env_ad(m, 0.004, 0.25, 5)
            e = min(n, s0 + m)
            out[s0:e] += th[: e - s0]
            k += 1
    tt = np.arange(n) / SR
    g = np.interp(tt, [0, 1.5, thin, settle, max(settle + 0.1, total - 2.5), total], [0, 1, 1, 0.7, 0.7, 0])
    return norm(out * g, 0.8)


def hash_seed(x) -> int:
    h = 2166136261
    for c in str(x):
        h = ((h ^ ord(c)) * 16777619) & 0xFFFFFFFF
    return h


def describe(seed) -> str:
    r = np.random.default_rng(abs(hash_seed(seed)))
    names = ["C", "C#", "D", "D#", "E", "F", "F#", "G"]
    key = names[int(r.choice([36, 37, 38, 39, 40, 41, 42, 43])) - 36]
    prog = str(r.choice(list(PROGS))); bar = float(r.choice([3.2, 3.6, 4.0, 4.4, 5.0]))
    lead = str(r.choice(["epiano", "bell", "marimba", "glass"]))
    return f"{key} major, {prog}, {60 * 4 / bar:.0f} bpm, {lead}"
