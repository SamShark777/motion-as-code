#!/usr/bin/env bash
# Build one vertical Short from shorts/<slug>/script.json:
#   voiceover (Kokoro) -> audio envelopes -> 1080x1920 render -> SFX mix -> mux -> phone-size MP4
#   + a 6-frame preview sheet.
# Output: shorts/<slug>/<slug>.mp4 and shorts/<slug>/preview.jpg
#   bash scripts/build_short.sh spotlight-effect
set -euo pipefail
SLUG="$1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/shorts/$SLUG"
[ -f "$DIR/script.json" ] || { echo "missing $DIR/script.json"; exit 1; }

# one-time setup (no-op when already installed)
python3 -c "import kokoro_onnx, soundfile" 2>/dev/null || pip install --break-system-packages -q kokoro-onnx soundfile
python3 -c "import PIL" 2>/dev/null || pip install --break-system-packages -q pillow
( cd "$ROOT/app" && [ -d node_modules ] || bun install )
if [ -z "${CHROME_PATH:-}" ]; then
  CHROME_PATH="$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | head -1 || true)"
  export CHROME_PATH
fi

FORMAT0=$(python3 -c "import json;print(json.load(open('$DIR/script.json')).get('format','tpl'))")
if [ "$FORMAT0" = "prebuilt" ]; then
  # finished elsewhere (e.g. a Claude Design export that Claude voiced and scored): just copy it + preview strip
  cp "$DIR/source/final.mp4" "$DIR/$SLUG.mp4"
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DIR/$SLUG.mp4")
  ffmpeg -v error -y -i "$DIR/$SLUG.mp4" -vf "fps=6/$DUR,scale=270:480,tile=6x1" -frames:v 1 "$DIR/preview.jpg"
  echo "ENGINE: kokoro"
  exit 0
fi
if [ "$FORMAT0" = "cdesign" ]; then
  # Claude Design style: React/SVG scenes captured frame by frame (scripts/design_build.py)
  ( cd "$ROOT/app" && [ -d node_modules ] || bun install )
  [ -n "${CHROME_PATH:-}" ] || export CHROME_PATH="$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | head -1 || command -v google-chrome)"
  python3 "$ROOT/scripts/design_build.py" "$SLUG"
  exit 0
fi
cp "$DIR/script.json" "$ROOT/data/script.json"
FORMAT=$(python3 -c "import json;print(json.load(open('$DIR/script.json')).get('format','tpl'))")
if [ "$FORMAT" = "ted1" ]; then
  mkdir -p "$ROOT/data/lottie"
  cp "$DIR"/lottie/*.json "$ROOT/data/lottie/" 2>/dev/null || true
  [ -d "$ROOT/shorts/lottie" ] && cp "$ROOT"/shorts/lottie/*.json "$ROOT/data/lottie/" 2>/dev/null || true
fi
python3 "$ROOT/analysis/tts_vo.py"
python3 "$ROOT/analysis/audio_vo.py"

cd "$ROOT/app"
bun scripts/render.ts video --vertical --samples 1 --crf 18 --noaudio --out "$ROOT/out/$SLUG.raw.mp4"
cd "$ROOT"
if [ "$FORMAT" = "ted1" ]; then python3 analysis/ted_music.py; else TPL=1 python3 analysis/sfx_mix.py; fi
ffmpeg -v error -y -i "out/$SLUG.raw.mp4" -i out/mix.wav -map 0:v -map 1:a \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart \
  "$DIR/$SLUG.mp4"

# preview sheet: 6 evenly spaced frames
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DIR/$SLUG.mp4")
python3 - "$DIR/$SLUG.mp4" "$DUR" "$DIR/preview.jpg" <<'EOF'
import subprocess, sys, io
from PIL import Image
src, dur, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
ts = [dur * (i + 0.5) / 6 for i in range(6)]
W, H = 270, 480
sheet = Image.new("RGB", (W * 6, H))
for i, t in enumerate(ts):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", src, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True, check=True).stdout
    sheet.paste(Image.open(io.BytesIO(png)).convert("RGB").resize((W, H)), (i * W, 0))
sheet.save(out, quality=85)
EOF
rm -f "out/$SLUG.raw.mp4"
echo "built $DIR/$SLUG.mp4 ($(du -h "$DIR/$SLUG.mp4" | cut -f1), ${DUR}s)"
