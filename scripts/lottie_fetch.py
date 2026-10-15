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


GQL = "https://graphql.lottiefiles.com/2022-08"


def gql(query, variables=None):
    body = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(GQL, data=body, headers={**UA, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def search(kw, n):
    q = """query($q: String!, $n: Int) { searchPublicAnimations(query: $q, first: $n) {
      edges { node { id name jsonUrl lottieUrl gifUrl imageUrl createdBy { username firstName } } } } }"""
    r = gql(q, {"q": kw, "n": n})
    if r.get("errors"):
        raise RuntimeError(json.dumps(r["errors"])[:500])
    return [e["node"] for e in r["data"]["searchPublicAnimations"]["edges"]]


def main():
    kws = [k.strip() for k in sys.argv[1].split(",") if k.strip()]
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    OUT.mkdir(parents=True, exist_ok=True)
    index = {}
    for kw in kws:
        d = OUT / kw.replace(" ", "_")
        d.mkdir(exist_ok=True)
        try:
            items = search(kw, 12)
        except Exception as e:
            index[kw] = {"error": str(e)}
            print(kw, "ERROR", e)
            if kw == kws[0]:  # dump the schema's query fields once, to fix the query
                try:
                    sch = gql("{ __schema { queryType { fields { name args { name } } } } }")
                    (OUT / "_schema.json").write_text(json.dumps(sch, indent=1))
                except Exception as e2:
                    (OUT / "_schema.json").write_text(str(e2))
            continue
        (d / "_search.json").write_text(json.dumps(items, indent=1))
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
