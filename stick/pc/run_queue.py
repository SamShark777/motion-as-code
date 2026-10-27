# Renders up to N queued stories (stories/*.json without output/*.mp4), oldest filename first.
import os, sys, json, time, traceback
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
N = int(sys.argv[1]) if len(sys.argv) > 1 else 4
def log(*a): print(time.strftime("%Y-%m-%d %H:%M:%S"), *a, flush=True)
sd, od = os.path.join(HERE, "stories"), os.path.join(HERE, "output"); os.makedirs(od, exist_ok=True)
todo = [f for f in sorted(os.listdir(sd)) if f.endswith(".json") and not os.path.exists(os.path.join(od, f[:-5] + ".mp4"))
        and not os.path.exists(os.path.join(od, f[:-5] + ".failed"))]
log(f"queue: {len(todo)} waiting, rendering {min(N, len(todo))}")
for f in todo[:N]:
    p = os.path.join(sd, f)
    try:
        fmt = json.load(open(p, encoding="utf-8")).get("format", "dilemma")
        log("start", f, fmt)
        if fmt == "classic":
            import make_short; make_short.main(p)
        else:
            import make_dilemma; make_dilemma.main(p)
        log("ok", f)
    except Exception:
        log("FAILED", f); err = traceback.format_exc(); print(err, flush=True)
        open(os.path.join(od, f[:-5] + ".failed"), "w").write(err)
log("queue done")
