"""Chatterbox voice samples (free, open-source, MIT). Each reference is a ~12 s clip from one of our
free Kokoro voices (Apache-2.0, so we may reuse it); Chatterbox re-voices our sample line in that
timbre at a calm and an expressive setting. Also renders Chatterbox's own built-in voice.
    python3 scripts/chatterbox_test.py "af_river,af_kore,af_sarah"   -> out/chatterbox/*.mp3"""
import subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "analysis"))
TEXT = ("That's not insomnia. That's your brain keeping the open loops... open. "
        "Write the next step, then close the laptop.")
REF_TEXT = ("Most of us think memory works like a recording. It doesn't. Every time you remember something, "
            "your brain rebuilds it from pieces, and it fills the gaps with whatever fits.")
SETTINGS = {"calm": dict(exaggeration=0.35, cfg_weight=0.5), "expressive": dict(exaggeration=0.7, cfg_weight=0.35)}


def main():
    import numpy as np, soundfile as sf, torch, torchaudio
    from chatterbox.tts import ChatterboxTTS
    out = ROOT / "out" / "chatterbox"
    out.mkdir(parents=True, exist_ok=True)
    torch.set_num_threads(max(1, __import__("os").cpu_count() or 1))
    t0 = time.time()
    model = ChatterboxTTS.from_pretrained(device="cpu")
    print(f"loaded in {time.time() - t0:.0f}s")
    jobs = [("default", None)]
    for v in [x.strip() for x in sys.argv[1].split(",") if x.strip()]:
        ref = ROOT / "shorts" / "voice" / "refs" / f"{v}.wav"  # made with Kokoro (REF_TEXT), committed
        jobs.append((v, ref))
    for name, ref in jobs:
        for tag, kw in SETTINGS.items():
            t0 = time.time()
            torch.manual_seed(3)
            wav = model.generate(TEXT, audio_prompt_path=str(ref) if ref else None, **kw)
            wavp = out / f"cb_{name}_{tag}.wav"
            torchaudio.save(str(wavp), wav, model.sr)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wavp), "-ac", "1", "-b:a", "96k", str(wavp.with_suffix(".mp3"))], check=True)
            print(f"{name}/{tag}: ok in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
