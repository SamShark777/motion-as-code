"""Calm night-time bed for dialogue Shorts (the Nova / "robot" style): soft electric-piano chords
(Fmaj7 - Em7 - Dm7 - Cmaj7), a warm sub, brushed noise and vinyl hiss, ducked under the voice.
Synthesised here, so it's ours to use.
    python3 analysis/calm_music.py <voice.wav> <out.wav> [--bpm 70] [--level -17 (dB under the speech)] [--seconds N]"""
import argparse
import numpy as np
import soundfile as sf

SR = 48000
CHORDS = [  # MIDI notes
    [41, 53, 57, 60, 64],  # Fmaj7
    [40, 52, 55, 59, 62],  # Em7
    [38, 50, 53, 57, 60],  # Dm7
    [36, 48, 52, 55, 59],  # Cmaj7
]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def epiano(f, dur, vel=0.5):
    t = np.arange(int(dur * SR)) / SR
    env = np.exp(-t * 1.6) * (1 - np.exp(-t * 300))
    tone = np.sin(2 * np.pi * f * t + 0.9 * np.exp(-t * 4) * np.sin(2 * np.pi * f * 2 * t))  # soft FM bell
    tone += 0.25 * np.sin(2 * np.pi * f * 2.001 * t) * np.exp(-t * 3)
    return (vel * env * tone).astype(np.float32)


def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):  # one-pole, fine for a few seconds of audio
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def bed(n, bpm):
    out = np.zeros(n, np.float32)
    beat = 60 / bpm
    bar = 4 * beat
    rng = np.random.default_rng(3)
    i = 0
    while i * bar * SR < n:
        notes = CHORDS[i % 4]
        s0 = int(i * bar * SR)
        for j, m in enumerate(notes):  # gently strummed
            off = s0 + int(j * 0.035 * SR)
            x = epiano(hz(m), bar + 1.5, 0.22 if j else 0.3)
            e = min(n, off + len(x))
            if off < n:
                out[off:e] += x[: e - off]
        for b in (2.5,):  # a soft answering note
            off = s0 + int(b * beat * SR)
            x = epiano(hz(notes[-1] + 12), 1.8, 0.09)
            e = min(n, off + len(x))
            if off < n:
                out[off:e] += x[: e - off]
        # warm sub on the root
        t = np.arange(int(bar * SR)) / SR
        sub = 0.18 * np.sin(2 * np.pi * hz(notes[0] - 12) * t) * np.minimum(1, t / 0.2) * np.minimum(1, (bar - t) / 0.3)
        e = min(n, s0 + len(sub))
        out[s0:e] += sub[: e - s0].astype(np.float32)
        i += 1
    # brushed off-beat hats + vinyl hiss
    noise = rng.standard_normal(n).astype(np.float32)
    hiss = noise - lowpass(noise, 3000)
    k = 0
    while k * beat * SR < n:
        s = int((k + 0.5) * beat * SR)
        L = int(0.09 * SR)
        if s + L < n:
            out[s:s + L] += 0.035 * hiss[s:s + L] * np.exp(-np.arange(L) / (0.025 * SR))
        k += 1
    out += 0.006 * hiss
    crack = (rng.random(n) > 0.99985).astype(np.float32) * rng.uniform(0.02, 0.06, n).astype(np.float32)
    out += crack
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("voice")
    ap.add_argument("out")
    ap.add_argument("--bpm", type=float, default=70)
    ap.add_argument("--level", type=float, default=-17)
    ap.add_argument("--seconds", type=float, default=0)
    a = ap.parse_args()
    v, sr = sf.read(a.voice, dtype="float32")
    if v.ndim > 1:
        v = v.mean(1)
    if sr != SR:
        idx = np.arange(int(len(v) * SR / sr)) * sr / SR
        v = np.interp(idx, np.arange(len(v)), v).astype(np.float32)
    n = max(len(v), int(a.seconds * SR))
    v = np.pad(v, (0, n - len(v)))
    m = bed(n, a.bpm)
    m /= np.sqrt(np.mean(m ** 2)) + 1e-9
    act = np.abs(v) > 0.01
    vr = np.sqrt(np.mean(v[act] ** 2)) if act.any() else 0.1
    m *= vr * 10 ** (a.level / 20)  # --level is dB relative to the speech level
    # duck under speech (smoothed envelope)
    env = np.abs(v)
    w = int(0.25 * SR)
    env = np.convolve(env, np.ones(w) / w, mode="same")
    duck = 1 - 0.45 * np.clip(env / (env.max() * 0.25 + 1e-9), 0, 1)
    m *= duck
    fade = np.ones(n, np.float32)
    fi, fo = int(1.2 * SR), int(2.0 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    fade[-fo:] = np.linspace(1, 0, fo)
    mix = v + m * fade
    mix /= max(1.0, np.abs(mix).max() / 0.95)
    sf.write(a.out, np.stack([mix, mix], 1), SR)


if __name__ == "__main__":
    main()
