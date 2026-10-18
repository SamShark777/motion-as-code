# Gentle music-box score for Episode 1 (60 s): soft pad chords + pentatonic music-box melody,
# a lift when the butterfly flies away, light reverb. Writes audio/ep1_music.wav (48 kHz stereo).
import numpy as np, wave, struct, sys, os

SR, DUR = 48000, 60.0
N = int(SR * DUR)
t = np.arange(N) / SR
BPM = 72; BEAT = 60 / BPM
L = np.zeros(N); R = np.zeros(N)
midi = lambda m: 440.0 * 2 ** ((m - 69) / 12)
rng = np.random.default_rng(7)

def add(sig, start, pan=0.0):
    i = int(start * SR); j = min(N, i + len(sig)); s = sig[: j - i]
    L[i:j] += s * np.sqrt(0.5 * (1 - pan)); R[i:j] += s * np.sqrt(0.5 * (1 + pan))

def bell(m, dur=2.6, amp=0.16):
    n = int(dur * SR); tt = np.arange(n) / SR; f = midi(m)
    s = (np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.2) + 0.35 * np.sin(2 * np.pi * f * 4.01 * tt) * np.exp(-tt * 6)
         + 0.12 * np.sin(2 * np.pi * f * 2.0 * tt) * np.exp(-tt * 4))
    s *= np.minimum(1, tt / 0.004)
    return s * amp

def pad(ms, dur, amp=0.05):
    n = int(dur * SR); tt = np.arange(n) / SR
    env = np.minimum(1, tt / 1.2) * np.minimum(1, (dur - tt) / 1.4).clip(0, 1)
    s = sum(np.sin(2 * np.pi * midi(m) * tt + k) + 0.3 * np.sin(2 * np.pi * midi(m) * 1.003 * tt) for k, m in enumerate(ms))
    return s * env * amp / len(ms)

# chords: C, Am, F, G (4 beats each) through the piece; brighter ending
prog = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]
bar = 4 * BEAT
for b in range(int(DUR / bar) + 1):
    add(pad(prog[b % 4], bar + 1.2), b * bar, pan=-0.15 if b % 2 else 0.15)

# melody (C major pentatonic), two-bar phrases, gentle; rests leave room for quiet moments
phrA = [(0, 72), (1, 76), (2, 79), (3, 76), (4, 74), (6, 72), (7, 69)]
phrB = [(0, 72), (1, 74), (2, 76), (4, 79), (5, 81), (6, 79), (7, 76)]
phrC = [(0, 81), (1, 79), (2, 76), (3, 74), (4, 76), (6, 72)]
plan = [phrA, phrB, phrA, phrC, phrA, phrB, phrC, phrB, phrA]
for p, phr in enumerate(plan):
    t0 = 1.6 + p * 8 * BEAT
    for beat, m in phr:
        st = t0 + beat * BEAT + rng.normal(0, 0.008)
        if st < DUR - 3.5: add(bell(m, amp=0.13 if p % 2 else 0.12), st, pan=rng.uniform(-0.4, 0.4))
# fly-away lift (≈56 s): rising arpeggio, then a final soft chord
for k, m in enumerate([72, 76, 79, 84, 88, 91]):
    add(bell(m, 2.4, 0.11), 56.2 + k * 0.22, pan=-0.5 + k * 0.2)
for m in [60, 64, 67, 72]: add(bell(m, 3.5, 0.07), 57.7)

# reverb: convolve with decaying noise tail
ir_n = int(1.8 * SR); it = np.arange(ir_n) / SR
ir = rng.normal(0, 1, ir_n) * np.exp(-it * 3.2); ir[0] = 0; ir /= np.sqrt((ir ** 2).sum()) * 2.5
def conv(x):
    n = 1 << int(np.ceil(np.log2(len(x) + ir_n)))
    return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x)]
L, R = L + 0.35 * conv(L), R + 0.35 * conv(R)
fade = np.minimum(1, t / 1.5) * np.clip((DUR - t) / 2.0, 0, 1)
L *= fade; R *= fade
peak = max(np.abs(L).max(), np.abs(R).max()); L *= 0.5 / peak; R *= 0.5 / peak  # ~ -6 dBFS peak, gentle
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'audio', 'ep1_music.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.stack([L, R], 1) * 32767).astype('<i2').tobytes())
print('wrote', out)
