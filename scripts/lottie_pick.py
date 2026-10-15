"""Ted type 1: pick a free LottieFiles animation for every script line (CI, where lottiefiles.com is reachable).
Each line in shorts/<slug>/script.json has "q" (search words, most specific first, comma-separated
alternatives, e.g. "helping hand, favor, teamwork"). Picks the most illustration-like result (many
layers, decent size, not an icon/loader), never reusing one within a video, saves
shorts/<slug>/lottie/<shot>.json, writes "shot" back into the script and records credits.
    python3 scripts/lottie_pick.py <slug>
Free LottieFiles animations are under the Lottie Simple License (free for commercial use)."""
import json, re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GQL = "https://graphql.lottiefiles.com/2022-08"
UA = {"User-Agent": "Mozilla/5.0 (motion-as-code)", "Accept": "application/json"}
BAD = re.compile(r"load|spinner|icon|button|logo|emoji|text|arrow|check|tick|success|error|404|toggle|switch|menu|"
                 r"notification|badge|progress|swipe|scroll|bar|ui\b|app\b|website|banner|christmas|xmas|halloween", re.I)
LANDSCAPE = False
FALLBACK = ["person thinking", "people talking", "brain", "idea", "man", "woman"]


def gql(query, variables):
    body = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(GQL, data=body, headers={**UA, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        out = json.loads(r.read())
    if out.get("errors"):
        raise RuntimeError(json.dumps(out["errors"])[:300])
    return out["data"]


def search(q, n=16):
    d = gql("""query($q: String!, $n: Int) { searchPublicAnimations(query: $q, first: $n) {
      edges { node { id name jsonUrl lottieUrl createdBy { username firstName } } } } }""", {"q": q, "n": n})
    return [e["node"] for e in d["searchPublicAnimations"]["edges"]]


def count_layers(j):
    n = len(j.get("layers", []))
    for a in j.get("assets", []) or []:
        n += len(a.get("layers", []) or [])
    return n


def score(node, j):
    w, h = j.get("w", 0), j.get("h", 0)
    frames = j.get("op", 0) - j.get("ip", 0)
    if w < 250 or h < 250 or frames < 20 or BAD.search(node.get("name") or ""):
        return -1
    if any(a.get("p") and not str(a.get("p", "")).startswith("data:") and a.get("u") is not None for a in j.get("assets", []) or []):
        return -1  # external images we can't load
    ar = h / max(1, w)
    lo = 0.55 if LANDSCAPE else 0.8  # vertical cards: wide clips leave a band (often with their own backdrop)
    if ar < lo or ar > 2.2:
        return -1
    s = min(count_layers(j), 60) + (10 if w >= 800 else 0) + (5 if frames >= 60 else 0)
    return s


def main():
    global LANDSCAPE
    slug = sys.argv[1]
    LANDSCAPE = slug.startswith("long/")
    sp = ROOT / "shorts" / slug / "script.json"
    S = json.loads(sp.read_text())
    out = ROOT / "shorts" / slug / "lottie"
    out.mkdir(parents=True, exist_ok=True)
    used, credits = set(), {}
    for i, ln in enumerate(S["lines"]):
        if ln.get("shot") and (out / f"{ln['shot']}.json").exists():
            continue
        queries = [q.strip() for q in (ln.get("q") or "").split(",") if q.strip()] + FALLBACK
        best = None
        for q in queries:
            try:
                nodes = search(q)
            except Exception as e:
                print(f"line {i}: search '{q}' failed: {e}")
                continue
            for node in nodes[:12]:
                if node["id"] in used or not node.get("jsonUrl"):
                    continue
                try:
                    with urllib.request.urlopen(urllib.request.Request(node["jsonUrl"], headers=UA), timeout=60) as r:
                        raw = r.read()
                    if len(raw) > 3_000_000:
                        continue
                    j = json.loads(raw)
                except Exception:
                    continue
                sc = score(node, j)
                if sc > (best[0] if best else 0):
                    best = (sc, node, raw, q)
            if best and best[0] >= 8:
                break
        if not best:
            print(f"line {i}: nothing usable")
            continue
        sc, node, raw, q = best
        name = f"l{i}"
        (out / f"{name}.json").write_bytes(raw)
        ln["shot"] = name
        used.add(node["id"])
        credits[name] = {"query": q, "id": node["id"], "name": node.get("name"), "url": node.get("jsonUrl"),
                         "author": (node.get("createdBy") or {}).get("username"), "score": sc}
        print(f"line {i}: '{q}' -> {node.get('name')} (score {sc})")
    sp.write_text(json.dumps(S, indent=1))
    (out / "CREDITS.json").write_text(json.dumps(credits, indent=1))


if __name__ == "__main__":
    main()
