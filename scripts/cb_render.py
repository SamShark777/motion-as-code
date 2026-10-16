"""Render lines with Chatterbox (MIT, Resemble AI) — runs in its own venv (CHATTERBOX_PY) so its pinned
torch/numpy don't clash with the rest of the pipeline.
    python scripts/cb_render.py <job.json> <outdir>
job.json: {"texts": [...], "exaggeration": 0.35, "cfg_weight": 0.5, "seed": 3, "ref": null|path}
Writes <outdir>/000.wav, 001.wav, ... at the model's sample rate."""
import json, os, sys, time
from pathlib import Path


def main():
    job = json.loads(Path(sys.argv[1]).read_text())
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    import torch, torchaudio
    from chatterbox.tts import ChatterboxTTS
    torch.set_num_threads(max(1, os.cpu_count() or 1))
    t0 = time.time()
    model = ChatterboxTTS.from_pretrained(device="cuda" if torch.cuda.is_available() else "cpu")
    print(f"chatterbox loaded in {time.time() - t0:.0f}s", flush=True)
    for i, t in enumerate(job["texts"]):
        t0 = time.time()
        torch.manual_seed(int(job.get("seed", 3)) + i)
        wav = model.generate(t, audio_prompt_path=job.get("ref"), exaggeration=float(job.get("exaggeration", 0.35)),
                             cfg_weight=float(job.get("cfg_weight", 0.5)))
        torchaudio.save(str(out / f"{i:03d}.wav"), wav, model.sr)
        print(f"line {i + 1}/{len(job['texts'])} in {time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    main()
