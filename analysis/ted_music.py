"""Ted type 1 sound: a dark, low ambient bed (synthesised here, so it's ours to use) under the voice,
ducked while the narrator speaks. audio/voiceover.wav -> out/mix.wav
    python3 analysis/ted_music.py [--bpm 92] [--level -21]"""
import argparse
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bpm", type=float, default=92)
    ap.add_argument("--level", type=float, default=-21)
    a = ap.parse_args()
    v, sr = sf.read(str(ROOT / "audio" / "voiceover.wav"), dtype="float32")
    if v.ndim > 1:
        v = v.mean(1)
    n = len(v)
    t = np.arange(n) / sr
    rng = np.random.default_rng(7)
    # pad: A minor (A1, E2, A2, C3) with slow detune + tremolo, then a bar-long chord change to F
    bar = 4 * 60 / a.bpm
    prog_roots = [55.0, 55.0, 43.65, 49.0]  # A, A, F, G
    chord = np.zeros(n, np.float32)
    for i, root in enumerate(prog_roots * 64):
        s0, s1 = int(i * bar * sr), int((i + 1) * bar * sr)
        if s0 >= n:
            break
        s1 = min(s1, n)
        tt = t[s0:s1]
        seg = np.zeros(s1 - s0, np.float32)
        for mult, amp in ((1, 0.5), (1.5, 0.28), (2, 0.25), (2.38, 0.16), (4, 0.06)):
            f = root * mult
            seg += amp * (np.sin(2 * np.pi * f * tt) + 0.6 * np.sin(2 * np.pi * f * 1.004 * tt + 1.3))
        env = np.minimum(1, (tt - tt[0]) / 0.6) * np.minimum(1, (tt[-1] - tt + 1e-3) / 0.6)
        chord[s0:s1] += seg * env
    chord *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * t)
    # soft sub pulse on every beat + airy filtered noise
    beat = 60 / a.bpm
    pulse = np.zeros(n, np.float32)
    k = np.arange(int(0.35 * sr)) / sr
    thump = (np.sin(2 * np.pi * (48 * np.exp(-k * 6)) * k) * np.exp(-k * 9)).astype(np.float32)
    for b in np.arange(0, n / sr, beat):
        s0 = int(b * sr)
        e = min(n, s0 + len(thump))
        pulse[s0:e] += thump[: e - s0] * 0.9
    noise = rng.standard_normal(n).astype(np.float32)
    kern = np.ones(400, np.float32) / 400
    air = np.convolve(noise, kern, mode="same") * 3 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t))
    bed = chord * 0.6 + pulse * 0.5 + air * 0.25
    bed /= max(1e-6, np.abs(bed).max())
    # duck under speech
    win = int(0.05 * sr)
    venv = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, mode="same"))
    duck = 1 - 0.45 * np.clip(venv / (venv.max() * 0.25 + 1e-6), 0, 1)
    duck = np.convolve(duck, np.ones(int(0.12 * sr)) / int(0.12 * sr), mode="same")
    fade = np.minimum(1, t / 0.8) * np.minimum(1, (t[-1] - t) / 0.9)
    bed = bed * duck * fade * (10 ** (a.level / 20))
    mix = v + bed
    mix /= max(1.0, np.abs(mix).max() / 0.95)
    (ROOT / "out").mkdir(exist_ok=True)
    sf.write(str(ROOT / "out" / "mix.wav"), np.stack([mix, mix], 1), sr)
    print(f"ted bed {n / sr:.1f}s at {a.level} dB")


if __name__ == "__main__":
    main()
