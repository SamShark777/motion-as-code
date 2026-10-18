import soundfile as sf, numpy as np, json, sys
from kokoro_onnx import Kokoro
k = Kokoro('kokoro.onnx', 'voices.bin')
voice, speed = sys.argv[1], float(sys.argv[2])
lines = [
 (1.0, "Maya and the Tired Butterfly."),
 (3.9, "One sunny morning, Maya went for a walk in the park."),
 (8.8, "Near the big tree... something tiny was resting in the grass."),
 (16.2, "A little butterfly. It was too tired to fly."),
 (25.2, "Maya wondered... what do tired butterflies need?"),
 (34.0, "Flowers! Butterflies love sweet flower nectar."),
 (43.0, "Slowly, slowly... the butterfly followed Maya."),
 (52.8, "A sip of sweet nectar..."),
 (56.4, "and away it flew! Bye-bye, butterfly!"),
]
SR = 24000; out = np.zeros(int(60 * SR)); info = []
for st, txt in lines:
    a, sr = k.create(txt, voice=voice, speed=speed, lang='en-us')
    a = np.asarray(a, dtype=np.float64)
    nz = np.nonzero(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - 600): nz[-1] + 2400] if len(nz) else a
    i = int(st * SR); out[i:i + len(a)] += a[: len(out) - i]
    info.append((st, round(len(a) / SR, 2), round(st + len(a) / SR, 2), txt))
for r in info: print(r)
out = out / (np.abs(out).max() + 1e-9) * 0.9
sf.write(f'narration_{voice}.wav', out, SR)
