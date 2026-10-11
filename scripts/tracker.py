"""Read/write shorts/Psychology_Shorts_Tracker.xlsx without breaking its formatting or formulas.

    python3 scripts/tracker.py next                 # JSON of the next idea (Status Idea, lowest Priority)
    python3 scripts/tracker.py get <No>              # JSON of one row
    python3 scripts/tracker.py set <No> "Header=value" ...   # write input cells by header name
    python3 scripts/tracker.py due [YYYY-MM-DD]      # published rows needing d7 / d14 / d30 stats today
    python3 scripts/tracker.py scheduled             # rows with Status Scheduled
    python3 scripts/tracker.py dump > out.csv        # every row as CSV (inputs + idea text), for reviews

Numbers are stored as numbers, dates (YYYY-MM-DD) as dates. Formula columns are never written.
"""
import csv, datetime, json, sys
from pathlib import Path
import openpyxl

PATH = Path(__file__).resolve().parent.parent / "shorts" / "Psychology_Shorts_Tracker.xlsx"
HR, R0 = 5, 6


def load():
    wb = openpyxl.load_workbook(PATH)
    ws = wb["Shorts ideas"]
    H = {ws.cell(HR, c).value: c for c in range(1, ws.max_column + 1) if ws.cell(HR, c).value}
    rows = {ws.cell(r, 1).value: r for r in range(R0, ws.max_row + 1) if isinstance(ws.cell(r, 1).value, int)}
    return wb, ws, H, rows


def row_dict(ws, H, r):
    out = {}
    for h, c in H.items():
        v = ws.cell(r, c).value
        if isinstance(v, str) and v.startswith("="):
            continue  # formula: not meaningful without recalculation
        if isinstance(v, (datetime.date, datetime.datetime)):
            v = v.strftime("%Y-%m-%d")
        out[h] = v
    return out


def coerce(h, v):
    if v == "":
        return None
    if h == "Post date":
        return datetime.date.fromisoformat(v)
    if h in ("Metricool ID", "Slug", "Title used", "Source checked", "Lesson / notes", "Status", "Hook style", "Template fit"):
        return v
    try:
        return int(v)
    except ValueError:
        try:
            return float(v)
        except ValueError:
            return v


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "next"
    wb, ws, H, rows = load()
    if cmd == "next":
        cands = [(ws.cell(r, H["Priority"]).value or 999, no, r) for no, r in rows.items() if ws.cell(r, H["Status"]).value == "Idea"]
        if not cands:
            print("{}"); return
        _, no, r = min(cands)
        print(json.dumps(row_dict(ws, H, r), indent=1))
    elif cmd == "get":
        print(json.dumps(row_dict(ws, H, rows[int(sys.argv[2])]), indent=1))
    elif cmd == "set":
        r = rows[int(sys.argv[2])]
        for kv in sys.argv[3:]:
            h, v = kv.split("=", 1)
            if h not in H:
                sys.exit(f"unknown column: {h}")
            cell = ws.cell(r, H[h])
            if isinstance(cell.value, str) and cell.value.startswith("="):
                sys.exit(f"{h} is a formula column")
            cell.value = coerce(h, v)
        wb.save(PATH)
        print("ok")
    elif cmd in ("due", "scheduled"):
        today = datetime.date.fromisoformat(sys.argv[2]) if len(sys.argv) > 2 else datetime.date.today()
        out = []
        for no, r in rows.items():
            st = ws.cell(r, H["Status"]).value
            if cmd == "scheduled":
                if st == "Scheduled":
                    out.append(row_dict(ws, H, r))
                continue
            d = ws.cell(r, H["Post date"]).value
            if st != "Published" or not d:
                continue
            d = d.date() if isinstance(d, datetime.datetime) else d
            age = (today - d).days
            need = [k for k, col in ((7, "YT views d7"), (14, "YT views d14"), (30, "YT views d30")) if age >= k and ws.cell(r, H[col]).value in (None, "")]
            if need:
                out.append({"No.": no, "age_days": age, "needs": need, **row_dict(ws, H, r)})
        print(json.dumps(out, indent=1))
    elif cmd == "dump":
        w = csv.writer(sys.stdout)
        w.writerow(list(H))
        for no, r in rows.items():
            d = row_dict(ws, H, r)
            w.writerow([d.get(h, "") for h in H])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
