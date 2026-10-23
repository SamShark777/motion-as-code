"""Voiceover for the vertical template: data/script.json -> audio/voiceover.mp3 + data/lyrics.json.

Engines (shorts/voice/voice.json picks one; --engine overrides):
  omnivoice  OmniVoice (k2-fsa, Apache-2.0) — zero-shot voice cloning. The narrator is one fixed voice:
             shorts/voice/reference.wav + reference.txt. If they don't exist yet, a voice is *designed*
             once from `instruct` (e.g. "male, middle-aged, low pitch, american accent") and saved there,
             so every later video clones the same voice. Commit those two files when they appear.
             Weights (~3.3 GB) come from Hugging Face; needs huggingface.co and its CDN reachable.
  kokoro     Kokoro (offline ONNX, voice am_michael) — the fallback when OmniVoice is unavailable.

Each script line is spoken separately and lines are joined with short pauses (longer between
sections). Word timings are spread over each line's detected speech span by syllable weight (good
enough for the karaoke wipe and the cuts). Each lyrics line keeps its `sec` for the template timeline.

    python3 analysis/tts_vo.py [--engine omnivoice|kokoro] [--voice am_michael] [--speed 0.92]
Prints "ENGINE: <name>" (and "FALLBACK: <reason>" if it fell back) for the pipeline log.
"""
import argparse, urllib.error, json, os, re, subprocess, sys, time
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
VOICE_DIR = ROOT / "shorts" / "voice"
CACHE = Path.home() / ".cache" / "kokoro"
MODELS = {
    "kokoro.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx",
    "voices.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}
REF_SENTENCE = ("Here is something most people never notice about their own mind. "
                "Once you see it, you will start spotting it everywhere.")


def syl(w):
    w = re.sub(r"[^a-z]", "", w.lower())
    n = len(re.findall(r"[aeiouy]+", w)) - (1 if w.endswith("e") and not w.endswith("le") and len(w) > 3 else 0)
    return max(1, n) + 0.08 * len(w)


def speech_span(x, sr):
    fr = int(sr * 0.01)
    e = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)])
    on = np.where(e > max(e.max() * 0.04, 1e-4))[0]
    return on[0] * 0.01, (on[-1] + 1) * 0.01


# ------------------------------------------------------------------ engines
FP32_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx"


def kokoro_lines(texts, voice, speed, lang="en-us", model="int8"):
    """model "fp32" = the full-precision Kokoro (what the One More Never Enough build used; warmer, cleaner)."""
    CACHE.mkdir(parents=True, exist_ok=True)
    files = dict(MODELS)
    if model == "fp32":
        files["kokoro-fp32.onnx"] = FP32_URL
    for name, url in files.items():
        p = CACHE / name
        if not p.exists() or p.stat().st_size < 1_000_000:
            subprocess.run(["curl", "-sSL", "-o", str(p), url], check=True)
    from kokoro_onnx import Kokoro
    k = Kokoro(str(CACHE / ("kokoro-fp32.onnx" if model == "fp32" else "kokoro.onnx")), str(CACHE / "voices.bin"))
    out = []
    for t in texts:
        a, sr = k.create(t, voice=voice, speed=speed, lang=lang)
        out.append((a.astype(np.float32), sr))
    return out


def eleven_lines(texts, cfg):
    """ElevenLabs TTS, one request per line (with neighbouring text for natural flow). Raises on any
    API problem (no key, out of credits, voice locked) so the caller falls back to Kokoro."""
    import urllib.request
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key:
        raise RuntimeError("ELEVENLABS_API_KEY not set")
    sr = 24000
    out = []
    for i, t in enumerate(texts):
        model = cfg.get("eleven_model", "eleven_multilingual_v2")
        if model == "eleven_v3":  # most expressive model: only stability 0 / 0.5 / 1, no text stitching
            body = {"text": t, "model_id": model, "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}}
        else:
            body = {"text": t, "model_id": model,
                    "voice_settings": {"stability": float(cfg.get("eleven_stability", 0.45)), "similarity_boost": 0.8,
                                       "style": float(cfg.get("eleven_style", 0.25)), "use_speaker_boost": True,
                                       "speed": float(cfg.get("eleven_speed", 1.0))}}
            if i > 0:
                body["previous_text"] = texts[i - 1]
            if i + 1 < len(texts):
                body["next_text"] = texts[i + 1]
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['eleven_voice']}?output_format=pcm_{sr}",
            data=json.dumps(body).encode(), headers={"xi-api-key": key, "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                pcm = r.read()
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"ElevenLabs HTTP {e.code}: {e.read()[:200].decode(errors='replace')}")
        out.append((np.frombuffer(pcm, dtype="<i2").astype(np.float32) / 32768.0, sr))
    return out


def chatterbox_lines(texts, cfg):
    """Chatterbox (free, open-source) via scripts/cb_render.py in its own venv; raises so the caller falls back."""
    import soundfile as sf, tempfile
    py = os.environ.get("CHATTERBOX_PY") or sys.executable
    d = Path(tempfile.mkdtemp())
    job = {"texts": texts, "exaggeration": cfg.get("cb_exaggeration", 0.35), "cfg_weight": cfg.get("cb_cfg_weight", 0.5),
           "seed": cfg.get("cb_seed", 3), "ref": cfg.get("cb_ref")}
    (d / "job.json").write_text(json.dumps(job))
    r = subprocess.run([py, str(ROOT / "scripts" / "cb_render.py"), str(d / "job.json"), str(d / "out")], capture_output=True, text=True)
    print(r.stdout[-1500:])
    if r.returncode != 0:
        raise RuntimeError("chatterbox failed: " + r.stderr[-400:])
    out = []
    for i in range(len(texts)):
        a, sr = sf.read(str(d / "out" / f"{i:03d}.wav"), dtype="float32")
        out.append((a if a.ndim == 1 else a.mean(1), sr))
    return out


def ensure_omnivoice():
    try:
        import omnivoice  # noqa: F401
        return
    except ImportError:
        pass
    # CPU torch first (the default Linux wheel drags in ~3 GB of CUDA libraries)
    has_cuda = subprocess.run(["bash", "-lc", "command -v nvidia-smi"], capture_output=True).returncode == 0
    pip = [sys.executable, "-m", "pip", "install", "-q", "--break-system-packages"]
    if not has_cuda:
        r = subprocess.run(pip + ["torch", "torchaudio", "--index-url", "https://download.pytorch.org/whl/cpu"], capture_output=True)
        if r.returncode != 0:
            subprocess.run(pip + ["torch", "torchaudio"], check=True)
    subprocess.run(pip + ["omnivoice"], check=True)


def hf_reachable():
    r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-m", "15", "-w", "%{http_code}", "https://huggingface.co/api/models/k2-fsa/OmniVoice"],
                       capture_output=True, text=True)
    return r.stdout.strip() == "200"


def omnivoice_lines(texts, cfg):
    if not (VOICE_DIR / "reference.wav").exists() and os.environ.get("NO_VOICE_DESIGN"):
        raise RuntimeError("no voice reference (shorts/voice/reference.wav); in CI it comes from the VOICE_REF_OPUS_B64 secret")
    if not os.environ.get("HF_HUB_OFFLINE") and not hf_reachable():
        raise RuntimeError("huggingface.co is not reachable from this environment (network allowlist)")
    ensure_omnivoice()
    import torch
    import soundfile as sf
    from omnivoice import OmniVoice, OmniVoiceGenerationConfig
    cuda = torch.cuda.is_available()
    torch.set_num_threads(max(1, os.cpu_count() or 1))
    t0 = time.time()
    model = OmniVoice.from_pretrained(cfg.get("model", "k2-fsa/OmniVoice"), device_map="cuda:0" if cuda else "cpu",
                                      dtype=torch.float16 if cuda else torch.float32)
    print(f"omnivoice loaded in {time.time() - t0:.0f}s on {'cuda' if cuda else 'cpu'}")
    gc = OmniVoiceGenerationConfig(num_step=int(cfg.get("num_step", 16)))
    ref_wav, ref_txt = VOICE_DIR / "reference.wav", VOICE_DIR / "reference.txt"
    if not ref_wav.exists():
        # design the narrator once, then clone it so every video has the same voice
        torch.manual_seed(int(cfg.get("seed", 7)))
        a = model.generate(text=REF_SENTENCE, instruct=cfg.get("instruct", "male, middle-aged, low pitch, american accent"),
                           language="English", generation_config=OmniVoiceGenerationConfig(num_step=32))[0]
        VOICE_DIR.mkdir(parents=True, exist_ok=True)
        sf.write(str(ref_wav), a, model.sampling_rate)
        ref_txt.write_text(REF_SENTENCE, encoding="utf-8")
        print(f"NEW_VOICE_REFERENCE: designed from '{cfg.get('instruct')}' -> {ref_wav} (commit it)")
    prompt = model.create_voice_clone_prompt(ref_audio=str(ref_wav), ref_text=ref_txt.read_text(encoding="utf-8").strip())
    torch.manual_seed(int(cfg.get("seed", 7)))
    t0 = time.time()
    outs = model.generate(text=texts, voice_clone_prompt=prompt, language="English", speed=cfg.get("speed"), generation_config=gc)
    print(f"omnivoice generated {len(texts)} lines in {time.time() - t0:.0f}s")
    return [(np.asarray(a, dtype=np.float32), model.sampling_rate) for a in outs]


# ------------------------------------------------------------------ polish
# Light "broadcast" chain for cloned voices: rumble cut, less mud, a little presence, tame
# sibilance, gentle compression, then level. No delay-adding filters, so word timings hold.
POLISH = ("highpass=f=75,equalizer=f=250:t=q:w=1.0:g=-2.5,equalizer=f=3200:t=q:w=1.2:g=2.5,"
          "equalizer=f=9000:t=h:w=0.7:g=1.5,deesser=i=0.35,"
          "acompressor=threshold=-21dB:ratio=2.5:attack=6:release=80:makeup=2,"
          "alimiter=limit=0.89:level=false")


def polish(src, dst):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-af", POLISH, "-ar", "24000", str(dst)], check=True)


# ------------------------------------------------------------------ main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", default=None)
    ap.add_argument("--voice", default="am_michael")
    ap.add_argument("--speed", type=float, default=0.92)
    a = ap.parse_args()
    cfg_path = VOICE_DIR / "voice.json"
    cfg = json.loads(cfg_path.read_text()) if cfg_path.exists() else {}
    engine = a.engine or cfg.get("engine", "kokoro")
    import soundfile as sf
    script = json.loads((ROOT / "data" / "script.json").read_text(encoding="utf-8"))
    if script.get("format") in ("ted1", "cdesign", "story") and not script.get("voice"):
        # Ted narrator: ElevenLabs "River" for Shorts (falls back to Kokoro Onyx when the key/credits run out);
        # long-form (landscape) stays on Kokoro so it doesn't burn the monthly ElevenLabs characters
        script["voice"] = {"engine": "kokoro", "kokoro_voice": "am_onyx", "kokoro_lang": "en-us", "kokoro_speed": 1.08}
    ted_engine = cfg.get("ted_engine") or ("elevenlabs" if cfg.get("ted_eleven_voice") else None)
    if script.get("format") in ("ted1", "cdesign", "story") and script.get("orientation") != "landscape" and ted_engine:
        # overrides the scripts' own Kokoro setting, which stays as the fallback
        script["voice"] = {**script["voice"], "engine": ted_engine}
        if cfg.get("ted_voice"):  # e.g. {"kokoro_voice": "af_heart", "kokoro_speed": 1.0, "kokoro_model": "fp32"}
            script["voice"].update(cfg["ted_voice"])
        if ted_engine == "elevenlabs":
            script["voice"]["eleven_voice"] = cfg["ted_eleven_voice"]
    # daily ElevenLabs experiment: one posting slot a day gets an expressive ElevenLabs voice (alternating by day)
    # so the weekly review can compare it against Heart; falls back to Heart when the free credits run out
    exp = cfg.get("eleven_experiment") or {}
    voice_name = None
    slots = exp.get("slots") or ({exp["slot"]: exp["voices"]} if exp.get("voices") else {})
    pool = slots.get(os.environ.get("COVER_SLOT") or "")
    if (pool and os.environ.get("COVER_DATE")
            and script.get("format") in ("ted1", "cdesign", "story") and script.get("orientation") != "landscape"):
        import datetime as _dt
        voice_name, vid = pool[_dt.date.fromisoformat(os.environ["COVER_DATE"]).toordinal() % len(pool)]
        script["voice"] = {**(script.get("voice") or {}), "engine": "elevenlabs", "eleven_voice": vid,
                           "eleven_model": exp.get("model", "eleven_v3")}
    cfg.update(script.get("voice") or {})  # per-script voice override (e.g. Ted type 1: deep male)
    if script.get("voice", {}).get("engine"):
        engine = script["voice"]["engine"]
    lines = script["lines"]
    texts = [ln.get("say") or ln["text"] for ln in lines]
    rendered = None
    if engine == "omnivoice":
        try:
            rendered = omnivoice_lines(texts, cfg)
        except Exception as e:  # never lose a day's video to the voice step
            print(f"FALLBACK: omnivoice failed ({type(e).__name__}: {str(e)[:300]}) -> kokoro", file=sys.stderr)
            print(f"FALLBACK: {type(e).__name__}: {str(e)[:300]}")
            engine = "kokoro"
    if engine == "chatterbox":
        try:
            rendered = chatterbox_lines(texts, cfg)
        except Exception as e:
            print(f"FALLBACK: chatterbox failed ({str(e)[:300]}) -> kokoro", file=sys.stderr)
            print(f"FALLBACK: {str(e)[:300]}")
            engine = "kokoro"
    if engine == "elevenlabs":
        try:
            rendered = eleven_lines(texts, cfg)
        except Exception as e:
            print(f"FALLBACK: elevenlabs failed ({str(e)[:300]}) -> kokoro", file=sys.stderr)
            print(f"FALLBACK: {str(e)[:300]}")
            engine = "kokoro"
    if rendered is None:
        kv = cfg.get("kokoro_voice") or a.voice
        rendered = kokoro_lines(texts, kv, float(cfg.get("kokoro_speed") or a.speed),
                                cfg.get("kokoro_lang") or ("en-gb" if kv[:1] == "b" else "en-us"), cfg.get("kokoro_model", "int8"))
    print(f"ENGINE: {engine}")
    if engine == "elevenlabs" and voice_name:
        print(f"VOICE_NAME: ElevenLabs {voice_name}")

    LEAD, TAIL = (0.15, 1.0) if script.get("format") in ("ted1", "cdesign", "story") else (0.35, 1.9)
    sr0 = rendered[0][1]
    chunks, out_lines, t = [], [], 0.0
    for i, (ln, (audio, sr)) in enumerate(zip(lines, rendered)):
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
        if ln["sec"] in ("ted", "cd") and nxt is not None:
            pause = float(cfg.get("ted_pause", 0.24))  # continuous narration
        if ln.get("pause_after") is not None and nxt is not None:
            pause = float(ln["pause_after"])  # story scripts: a deliberate beat after this line
        chunks += [audio, np.zeros(int(pause * sr), np.float32)]
        t += dur + pause
    full = np.concatenate([np.zeros(int(LEAD * sr0), np.float32)] + chunks + [np.zeros(int(TAIL * sr0), np.float32)])
    full = full / max(1e-6, np.abs(full).max()) * 0.89
    wav = ROOT / "audio" / "voiceover.wav"
    sf.write(str(wav), full, sr0)
    if engine == "omnivoice" and cfg.get("polish", True):
        tmp = wav.with_suffix(".raw.wav")
        wav.rename(tmp)
        polish(tmp, wav)
        tmp.unlink()
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "192k", str(ROOT / "audio" / "voiceover.mp3")], check=True)
    (ROOT / "data" / "lyrics.json").write_text(json.dumps({"lines": out_lines}, indent=1), encoding="utf-8")
    (ROOT / "out").mkdir(exist_ok=True)
    (ROOT / "out" / "tts_engine.txt").write_text(engine)
    (ROOT / "out" / "tts_voice_name.txt").write_text(f"ElevenLabs {voice_name}" if engine == "elevenlabs" and voice_name else "")
    print(f"voiceover {len(full) / sr0:.2f}s, {len(out_lines)} lines")
    if len(full) / sr0 > 59:
        print("WARNING: longer than 59 s — too long for a Short; trim the script", file=sys.stderr)


if __name__ == "__main__":
    main()
