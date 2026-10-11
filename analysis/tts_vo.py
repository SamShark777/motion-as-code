"""Voiceover for the vertical template: data/script.json -> audio/voiceover.mp3 + data/lyrics.json.

Kokoro TTS (offline ONNX, voice am_michael) speaks each script line; lines are joined with short
pauses (longer between sections). Word timings are spread over each line's detected speech span
by syllable weight (good enough for the karaoke wipe and the cuts). Each lyrics line keeps its
`sec` (hook / name / study / stat / takeaway) for the template timeline.

    python3 analysis/tts_vo.py [--voice am_michael] [--speed 0.92]
Models are fetched once into ~/.cache/kokoro (GitHub releases of kokoro-onnx).
"""
import argparse, json, re, subprocess, sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path.home() / ".cache" / "kokoro"
MODELS = {
    "kokoro.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx",
    "voices.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}


def ensure_models():
    CACHE.mkdir(parents=True, exist_ok=True)
    for name, url in MODELS.items():
        p = CACHE / name
        if not p.exists() or p.stat().st_size < 1_000_000:
            subprocess.run(["curl", "-sSL", "-o", str(p), url], check=True)


def syl(w):
    w = re.sub(r"[^a-z]", "", w.lower())
    n = len(re.findall(r"[aeiouy]+", w)) - (1 if w.endswith("e") and not w.endswith("le") and len(w) > 3 else 0)
    return max(1, n) + 0.08 * len(w)


def speech_span(x, sr):
    fr = int(sr * 0.01)
    e = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)])
    on = np.where(e > max(e.max() * 0.04, 1e-4))[0]
    return on[0] * 0.01, (on[-1] + 1) * 0.01


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="am_michael")
    ap.add_argument("--speed", type=float, default=0.92)
    a = ap.parse_args()
    ensure_models()
    import soundfile as sf
    from kokoro_onnx import Kokoro
    k = Kokoro(str(CACHE / "kokoro.onnx"), str(CACHE / "voices.bin"))
    script = json.loads((ROOT / "data" / "script.json").read_text(encoding="utf-8"))
    lines = script["lines"]
    LEAD, TAIL = 0.35, 1.9
    chunks, out_lines, t, sr0 = [], [], 0.0, 24000
    for i, ln in enumerate(lines):
        audio, sr = k.create(ln.get("say") or ln["text"], voice=a.voice, speed=a.speed, lang="en-us")
        sr0 = sr
        audio = audio.astype(np.float32)
        s0, s1 = speech_span(audio, sr)
        audio = audio[int(s0 * sr): int(s1 * sr) + int(0.04 * sr)]
        dur = len(audio) / sr
        st = LEAD + t
        words = ln["text"].split()
        wts = [syl(w) for w in words]
        tot = sum(wts) + sum(0.6 for w in words[:-1] if w[-1] in ",.:?!;")
        cur, ws = st, []
        for j, (w, wt) in enumerate(zip(words, wts)):
            d = dur * wt / tot
            ws.append({"w": w, "start": round(cur, 3), "end": round(cur + d * 0.94, 3)})
            cur += d + (dur * 0.6 / tot if w[-1] in ",.:?!;" and j < len(words) - 1 else 0)
        out_lines.append({"text": ln["text"], "sec": ln["sec"], "start": round(st, 3), "end": round(st + dur, 3), "words": ws})
        nxt = lines[i + 1]["sec"] if i + 1 < len(lines) else None
        pause = 0.0 if nxt is None else (0.68 if nxt != ln["sec"] else 0.5)
        chunks += [audio, np.zeros(int(pause * sr), np.float32)]
        t += dur + pause
    full = np.concatenate([np.zeros(int(LEAD * sr0), np.float32)] + chunks + [np.zeros(int(TAIL * sr0), np.float32)])
    full = full / max(1e-6, np.abs(full).max()) * 0.89
    wav = ROOT / "audio" / "voiceover.wav"
    sf.write(str(wav), full, sr0)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "192k", str(ROOT / "audio" / "voiceover.mp3")], check=True)
    (ROOT / "data" / "lyrics.json").write_text(json.dumps({"lines": out_lines}, indent=1), encoding="utf-8")
    print(f"voiceover {len(full) / sr0:.2f}s, {len(out_lines)} lines")
    if len(full) / sr0 > 59:
        print("WARNING: longer than 59 s — too long for a Short; trim the script", file=sys.stderr)


if __name__ == "__main__":
    main()
