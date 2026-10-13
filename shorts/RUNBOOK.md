# Daily Shorts pipeline — runbook

Up to **5 psychology Shorts a day** (repo variable `SHORTS_PER_DAY`), made with the Motion as Code kit
(vertical template + Shivam's pixel avatar, in Shivam's own cloned voice), posted to YouTube Shorts,
Instagram Reels and TikTok through **Buffer (free plan)**, scheduled **the day before** so Shivam can veto.

Who does what:
- **Claude — script writer** (scheduled task, every 2 days): researches and writes scripts ahead of time
  (`shorts/<slug>/script.json`, tracker `Status=Scripted`). This is the only creative step.
- **GitHub Actions — `Daily Shorts`** (`.github/workflows/daily-shorts.yml` on `main`, 09:17 PT daily): takes
  the next `Scripted` rows (lowest Priority first), builds them in parallel (OmniVoice voice, render, SFX),
  runs QA checks (1080×1920, 12–59.5 s, audible audio, not frozen), hosts them on the `media` branch
  (`media/<date>/<slug>.mp4`, last 4 dates kept), schedules each on Buffer for tomorrow at the slots in
  `SLOTS` (default 08:00, 11:00, 14:00, 17:00, 20:00 PT), sets the tracker (`Scheduled`, `Post date`,
  `Metricool ID=buffer:youtube=…;instagram=…;tiktok=…`), and opens a GitHub issue with previews. It marks
  earlier Buffer posts `Published`, or `Vetoed` when Shivam deleted them in Buffer. A failed build or QA
  check marks the row `Failed` with the reason. Without the `BUFFER_API_KEY` secret it only dry-runs.
  Secrets: `BUFFER_API_KEY`, `VOICE_REF_OPUS_B64` (Shivam's voice reference — never commit his voice).
- **Claude — weekly review** (Sundays): stats, analysis, tuning (below).

State lives in this repo on the **`shorts` branch** (main stays the original kit + the workflow):
- `shorts/Psychology_Shorts_Tracker.xlsx` — ideas + production and performance columns.
  Always read and write it with `scripts/tracker.py` (never rebuild it), so formatting and formulas survive.
  Status flow: `Idea` → `Scripted` → `Scheduled` → `Published` | `Vetoed` | `Failed`.
  `Priority`: the lowest number goes first. `tracker.py add "Theme=…" "Video idea=…" …` appends a new idea.
- `shorts/<slug>/script.json` — the script of each video (the build input); `post.json` — what CI scheduled.
- `shorts/reviews/<date>.md` — the weekly reviews.

Analytics still come from **Metricool** (brand `blogId 7365379`, same accounts connected; reading stats
doesn't use its post quota). Rows No. 1, 11, 22 were posted through Metricool (numeric `Metricool ID`).

## Script writer run (every 2 days, ≈ 30–60 min)

1. **Setup.** Call `add_repo` (owner SamShark777, repo motion-as-code, access push), then
   `git clone --depth 1 --branch shorts https://github.com/SamShark777/motion-as-code` and `cd` into it.
   `pip install --break-system-packages -q openpyxl`.
2. **How much to write.** `python3 scripts/tracker.py counts`. Write scripts until `Scripted` reaches
   **3 × SHORTS_PER_DAY** (15 at 5/day), at most 12 per run. Also read the latest `Daily Shorts` issue
   (`gh api "repos/SamShark777/motion-as-code/issues?state=all&per_page=3"`): note failures and fallback
   voices for the message to Shivam; for a row marked `Failed` by a QA check that a shorter or simpler
   script would fix, fix the script and set it back to `Scripted` (once only).
3. **Ideas running low.** If fewer than 20 rows are at `Status=Idea`, add 10 new ideas with `tracker.py add`
   (Theme, Video idea, Opening hook, Content outline, Priority after the last, Template fit, Visual style
   from the Looks sheet) — lean toward the themes, hooks and looks the reviews show winning; only topics
   with well-established research.
4. For each script: `python3 scripts/tracker.py next`, verify, write (rules below), then
   `tracker.py set <No> "Status=Scripted" "Slug=<slug>" "Source checked=…" "Hook style=…"`.
   (Don't build videos here — the workflow does that.)
5. Commit "scripts: <n> new" and push to `shorts` (fetch + rebase on rejection; on an xlsx conflict,
   re-apply your `set`/`add` calls on theirs).

**Writing a script** (`shorts/<slug>/script.json`, format below). Before writing, verify the core
   finding with a web search; record the source in `Source checked`. Rules:
   - Only well-established findings. Name the researchers and year in `credit` exactly as published.
     If you can't find a solid source, set `Status=Failed` with the reason in `Lesson / notes` and take the next idea.
   - Start from Shivam's `Opening hook` and `Content outline`; tighten them for the format.
   - 55–85 spoken words → 22–35 s. Short sentences.
   - Sections in order: `hook` (1 line, a question or surprising claim to the viewer), `name`
     (1 line ending in the concept's name), `study` (1–2 lines), `stat` (1–2 lines carrying the numbers),
     `takeaway` (1–2 lines; the last line is the punchline).
   - The stat cue words must appear verbatim in the stat lines. Use `%` stats when possible (they light
     that share of the 20-person room); otherwise give `lit` (0–20) or `display`.
   - Titles: `title[0]` is the big word(s) (≤ 14 characters reads best), `title[1]` the pill (one word).
   - `hookStyle`: `eyes` for social/being-watched topics, `thoughts` for thinking/memory/decision topics.
   - Add `say` with a phonetic spelling when TTS would misread a word (e.g. "T-shirt" → "tee shirt").
   - Apply the "Rules from reviews" section below (the weekly review keeps it current).
   - Set `"no"` to the idea's `No.` and `"look"` to its `Visual style` from the tracker (see shorts/LOOKS.md;
     empty → `pixel-lab`). Write the lines so they suit the look's voice (e.g. `dossier` reads like a case
     file, `game-show` like a quiz round, `crayon` gently) — the facts and structure rules stay the same.
   - Looks set in all caps (`terminal`, `spy-noir`, `pixel-quest`) fit fewer characters per line: keep
     their hook and takeaway lines short (≤ 9 words).

## Building one locally (debugging only)

`bash scripts/build_short.sh <slug>` → `shorts/<slug>/<slug>.mp4` + `preview.jpg`. The voice comes from
`analysis/tts_vo.py` (engine in `shorts/voice/voice.json`: OmniVoice cloning `shorts/voice/reference.wav`,
Kokoro fallback). In CI the reference is decoded from the `VOICE_REF_OPUS_B64` secret; it is gitignored and
must never be committed (the repo is public). Test the workflow on existing scripts with
`gh api -X POST repos/SamShark777/motion-as-code/actions/workflows/daily-shorts.yml/dispatches -f ref=main -f 'inputs[only_slugs]=<slug>,<slug>'` (always a dry run).

## Weekly review (Sundays)

Rows posted through Metricool (numeric `Metricool ID`) still at `Scheduled` past their post date → `Published` (check with Metricool `getScheduledPosts` whether they went out). First fill due stats: `python3 scripts/tracker.py due` lists published rows that reached 7, 14 or 30 days
without numbers. Pull them from Metricool with `getAnalyticsDataByMetrics` (YouTube "all videos": YTVV17 title,
YTVV06 views, YTVV08 avg view duration, YTVV09 likes, YTVV11 comments, YTVV12 shares; Instagram reels and
TikTok: find field ids with `getAnalyticsAvailableMetrics`), matching each video by its title, and write them
with `tracker.py set <No> "YT views d7=…" …`. Then `python3 scripts/tracker.py dump > /tmp/t.csv` and analyse the published vertical Shorts (skip No. 1, the
horizontal pilot): total views and engagement at d7 (d14/d30 when present), YouTube retention (avg view ÷
length) — compared across theme, visual style, hook style, length, title wording, opening-hook type (question vs claim),
template fit and weekday. Then:
- Write `shorts/reviews/<date>.md`: what worked, what didn't, with the numbers.
- Fill `Lesson / notes` on reviewed rows with a one-line takeaway.
- **Tune the looks:** once a look has ≥ 3 Shorts past day 7, reassign the `Visual style` of upcoming ideas
  away from clearly losing looks toward winning ones that fit the topic (keep at least 4 looks in rotation
  so the comparison stays alive). Say which changed and why.
- **Tune the queue:** renumber `Priority` on upcoming `Idea` rows to move the patterns that win forward,
  and rewrite weak `Opening hook`s of upcoming ideas in the winning style (keep the old hook in
  `Lesson / notes` as "was: …"). Add or update up to 5 bullet rules under "Rules from reviews" below.
- With fewer than 5 Shorts past day 7, say the sample is too small: describe only, change nothing.
Commit, push and send Shivam the headline findings plus what was changed.

## Rules from reviews

- (none yet)

## script.json

```json
{
  "slug": "spotlight-effect",
  "title": ["SPOTLIGHT", "EFFECT"],
  "hookStyle": "eyes",
  "titleCue": "spotlight",
  "credit": "Gilovich, Medvec & Savitsky · 2000",
  "stat": { "unit": "%",
            "a": { "label": "Guessed", "value": 50, "cue": "half" },
            "b": { "label": "Actual", "value": 23, "cue": "quarter." } },
  "cta": "Follow for more psychology",
  "lines": [
    { "sec": "hook", "text": "Ever feel like everyone is staring at you?" },
    { "sec": "name", "text": "Psychologists call it the spotlight effect." },
    { "sec": "study", "text": "In one study, students wore an embarrassing T-shirt into a full room.", "say": "... tee shirt ..." },
    { "sec": "stat", "text": "They guessed half the room noticed." },
    { "sec": "stat", "text": "The real number? About a quarter." },
    { "sec": "takeaway", "text": "Everyone else is busy starring in their own movie." },
    { "sec": "takeaway", "text": "So relax. Nobody's watching as closely as you think." }
  ],
  "post": { "title": "Why It Feels Like Everyone's Watching You #shorts",
            "description": "Psychologists call it the spotlight effect.",
            "tags": ["spotlight effect", "psychology"] }
}
```
