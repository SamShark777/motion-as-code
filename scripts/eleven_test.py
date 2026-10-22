"""ElevenLabs voice samples: each voice id reads the sample lines -> out/eleven/<label>.mp3
    ELEVENLABS_API_KEY=... python3 scripts/eleven_test.py "IjnA9kwZJHJ20Fp7Vmy6:matthew,L0Dsvb3SLTyegXwtm47J:archer"
Prints one line per voice (ok / the API's error) so the workflow can show it as an annotation."""
import json, os, sys, urllib.error, urllib.request
from pathlib import Path

TEXT = os.environ.get("ELEVEN_TEXT") or ("That's not insomnia. That's your brain keeping the open loops... open. "
        "Write the next step, then close the laptop. "
        "Nova... my brain won't let me sleep. It keeps replaying my unfinished to-do list.")
MODEL = os.environ.get("ELEVEN_MODEL", "eleven_multilingual_v2")


def tts(voice_id, text, key):
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128",
        data=json.dumps({"text": text, "model_id": MODEL,
                         "voice_settings": {"stability": 0.5, "similarity_boost": 0.8} if MODEL == "eleven_v3" else
                         {"stability": 0.4, "similarity_boost": 0.8, "style": 0.3, "use_speaker_boost": True}}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def main():
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key:
        print("ERROR: ELEVENLABS_API_KEY secret is not set")
        sys.exit(1)
    out = Path("out/eleven")
    out.mkdir(parents=True, exist_ok=True)
    ok = 0
    for item in [x.strip() for x in sys.argv[1].split(",") if x.strip()]:
        vid, _, label = item.partition(":")
        label = (label or vid).strip().lower().replace(" ", "-")
        try:
            (out / f"{label}.mp3").write_bytes(tts(vid.strip(), TEXT, key))
            print(f"{label}: ok")
            ok += 1
        except urllib.error.HTTPError as e:
            print(f"{label}: HTTP {e.code} {e.read()[:300].decode(errors='replace')}")
        except Exception as e:
            print(f"{label}: {e}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
