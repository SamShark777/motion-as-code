"""Pick the style for the next psychology Short AT RANDOM from shorts/styles/styles.json (Shivam, 2026-10-26:
"don't switch every single time, just randomly"). The only rule: never more than `max_in_a_row` Shorts in the same
style in a row (looks at the most recent scripts by tracker No.). Prints the chosen style as JSON.
    python3 scripts/pick_style.py            # one pick (run it once per new script, after writing the previous one)"""
import json, random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
cfg = json.loads((ROOT / "shorts" / "styles" / "styles.json").read_text())
styles = cfg["styles"]
by_look = {s["look"]: s["id"] for s in styles}
by_format = {s["format"]: s["id"] for s in styles}
recent = []
for p in (ROOT / "shorts").glob("*/script.json"):
    try:
        S = json.loads(p.read_text())
    except Exception:
        continue
    sid = by_look.get(S.get("look")) or by_format.get(S.get("format"))
    if sid and isinstance(S.get("no"), int) and S["no"] > 0:
        recent.append((S["no"], sid))
recent = [sid for _, sid in sorted(recent)]
k = cfg.get("max_in_a_row", 2)
pool = [s for s in styles]
if len(recent) >= k and len(set(recent[-k:])) == 1:
    pool = [s for s in styles if s["id"] != recent[-1]] or styles
print(json.dumps(random.choice(pool)))
