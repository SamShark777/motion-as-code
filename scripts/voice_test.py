"""Quick voice check (CI `voice_test` mode): speak the first lines of a script with OmniVoice in two
settings and save MP3s for Shivam to compare:
  A = num_step 16, raw            (what the videos used until 2026-10-14)
  B = current voice.json settings + polish chain
    python3 scripts/voice_test.py <slug>   -> out/voice_A.mp3, out/voice_B.mp3
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "analysis"))
import tts_vo  # noqa: E402

slug = sys.argv[1]
S = json.loads((ROOT / "shorts" / slug / "script.json").read_text())
texts = [ln.get("say") or ln["text"] for ln in S["lines"][:4]]
cfg = json.loads((ROOT / "shorts" / "voice" / "voice.json").read_text())
out = ROOT / "out"
out.mkdir(exist_ok=True)
for tag, steps, pol in (("A", 16, False), ("B", int(cfg.get("num_step", 32)), True)):
    c = dict(cfg, num_step=steps)
    parts = []
    for a, sr in tts_vo.omnivoice_lines(texts, c):
        s0, s1 = tts_vo.speech_span(a, sr)
        parts += [a[int(s0 * sr): int(s1 * sr)], np.zeros(int(0.45 * sr), np.float32)]
    y = np.concatenate(parts)
    y = y / max(1e-6, np.abs(y).max()) * 0.89
    wav = out / f"voice_{tag}.wav"
    sf.write(str(wav), y, sr)
    if pol:
        tts_vo.polish(wav, out / f"voice_{tag}.p.wav")
        wav = out / f"voice_{tag}.p.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "192k", str(out / f"voice_{tag}.mp3")], check=True)
    print(f"voice_{tag}: steps={steps} polish={pol} {len(y) / sr:.1f}s")
