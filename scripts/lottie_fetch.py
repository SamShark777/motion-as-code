"""Fetch free Lottie animations from LottieFiles for keywords (runs in CI, where lottiefiles.com is reachable).
    python3 scripts/lottie_fetch.py "brain,eye,coin" [per_keyword]
Writes out/lottie/<keyword>/<n>_<id>.json + out/lottie/index.json (name, author, urls, raw metadata)."""
import json, sys, urllib.parse, urllib.request
from pathlib import Path

OUT = Path("out/lottie")
UA = {"User-Agent": "Mozilla/5.0 (motion-as-code)", "Accept": "application/json"}


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def urls_in(o, acc):
    if isinstance(o, dict):
        for v in o.values():
            urls_in(v, acc)
    elif isinstance(o, list):
        for v in o:
            urls_in(v, acc)
    elif isinstance(o, str) and o.startswith("http") and (o.endswith(".json") or ".json?" in o):
        acc.append(o)
    return acc


def main():
    kws = [k.strip() for k in sys.argv[1].split(",") if k.strip()]
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    OUT.mkdir(parents=True, exist_ok=True)
    index = {}
    for kw in kws:
        d = OUT / kw.replace(" ", "_")
        d.mkdir(exist_ok=True)
        q = urllib.parse.urlencode({"query": kw, "page": 1, "limit": 20, "format": "json"})
        try:
            raw = json.loads(get(f"https://lottiefiles.com/api/search/get-animations?{q}"))
        except Exception as e:
            index[kw] = {"error": str(e)}
            print(kw, "ERROR", e)
            continue
        items = raw.get("data", {}).get("data", []) if isinstance(raw.get("data"), dict) else raw.get("data", [])
        (d / "_search.json").write_text(json.dumps(raw)[:200000])
        got = []
        for it in items:
            if len(got) >= n:
                break
            premium = any(str(it.get(k, "")).lower() in ("true", "1", "premium") for k in ("isPremium", "is_premium", "premium", "price"))
            if premium:
                continue
            cands = urls_in(it, [])
            for u in cands:
                try:
                    data = get(u)
                    j = json.loads(data)
                    if "layers" not in j:
                        continue
                except Exception:
                    continue
                fid = str(it.get("id") or it.get("fileId") or len(got))
                f = d / f"{len(got)}_{fid}.json"
                f.write_bytes(data)
                got.append({"file": str(f), "name": it.get("name") or it.get("title"), "id": fid, "url": u,
                            "author": (it.get("createdBy") or it.get("user") or {}) if isinstance(it.get("createdBy") or it.get("user"), dict) else it.get("createdBy"),
                            "w": j.get("w"), "h": j.get("h"), "fr": j.get("fr"), "frames": (j.get("op", 0) - j.get("ip", 0))})
                break
        index[kw] = got
        print(kw, len(items), "results,", len(got), "saved")
    (OUT / "index.json").write_text(json.dumps(index, indent=1, default=str))


if __name__ == "__main__":
    main()
