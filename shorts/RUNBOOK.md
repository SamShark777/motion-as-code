> **2026-10-25 — Shivam: STICK CHARACTER STORIES replace the explainers.** Every new Short is format `"stick"`
> (look "stick"): recurring cast from `shorts/characters/cast.json` (Arjun, Maya, Kabir, Zoe) drawn ONLY with
> `shorts/design_kit/stick-kit.jsx` components; engine `stick-engine.jsx`. Structure: something happens in the first line
> (character + situation) → problem → escalation → "But…" reveal → name the psychology effect plainly → payoff that
> reframes the opening; optional small unresolved character beat. 25–40 s, 7–9 lines, each with `label` (grey corner
> word) and `tone` (ElevenLabs tags). Real studies: "<Name> isn't real. But in <year>…" with verified numbers.
> Length: ElevenLabs voices with tags run ~35% longer than Heart, so keep stick scripts to 70–85 words (Zoe ep.1 at 97 words ran 54 s).
> Add the episode to the character's `history` in cast.json. Examples: shorts/arjun-mind-reading, zoe-tiny-favor,
> kabir-two-days. Remaining pattern-test Ideas are topics to retell as stories (keep their sources).

# Daily Shorts pipeline — runbook

> **2026-10-15 — Shivam: Ted type 2 is the only Shorts format.** The 8-bit pixel-avatar videos (all the
> Motion-as-Code "looks": pixel-lab, keynote, whiteboard, terminal, game-show, dossier, …) and Ted type 1
> (Lottie) are retired — never write a new script in them. Every new Short is Ted type 2 (`format: "cdesign"`,
> `look: "ted2"`, tracker `Visual style=ted2`), whatever the idea's old Visual style says. Their remaining
> scheduled Buffer posts were cancelled (rows set to `Vetoed`). The 10-video experiment below is over.
> To cancel scheduled posts: run the Daily Shorts workflow with input `buffer_cancel=<slug>,<slug>`
> (`scripts/buffer.py cancel`), then set those rows to `Vetoed` — **only when Shivam asks for it in chat.**

> **2026-10-15 evening — Shivam's plan (standing rules until he changes them):**
> 1. **Format freeze until 2026-10-31** (restarted with the new audio, first Shorts Sat 2026-10-17): every Short
>    is Ted type 2 with the **One More Never Enough audio**: narrator Kokoro `af_heart`, full-precision model
>    (`voice.json` `ted_voice`), scene-timed sound effects + the F-major pad bed ducked under the voice
>    (`analysis/ted2_audio.py`, sounds in `analysis/sfx_lib.py`). Optional per-line `"sfx": [[sound, offset_s, volume]]`
>    overrides the automatic cues (sounds: swipe, whoosh, pop, tick, chime, chime-bright, rising, notification,
>    flip, flip-dull, lightning, airy, card-slide, settle, toggle, drawer, page-turn, wood-tap). Change only topics, hooks and titles — no new
>    formats, looks, voices, music or pacing changes, so the numbers stay comparable.
> 2. **3 Shorts a day** at 09:00, 14:00, 19:00 PT (`SHORTS_PER_DAY=3`). Quality over volume: YouTube limits
>    monetization of mass-produced, repetitive content, so every script needs a specific, surprising hook and
>    a distinct idea — no near-duplicates of recent videos.
> 3. **Measure:** the weekly review pulls views, average view duration / retention and swipe-away data per Short
>    and judges hooks on that.
> 4. **Nova dialogue series** (Ash + robot Nova) is planned as a 3-a-week signature series once Shivam's
>    Claude Design export of the style is plugged in; until then don't write Nova scripts.
> 5. **Long-form is paused** (workflow schedule off) until Shorts show traction; don't write long-form scripts.
> 6. **Background runs never cancel, delete or reschedule posts**, and never change formats, voices or the
>    posting plan. They write scripts, build, and report. Anything else goes to Shivam in chat.

> **Thumbnails (2026-10-18, Shivam):** every vertical Ted type 2 / story Short ends with a **title cover**
> (`shorts/design_kit/cover.jsx`, last 0.55 s, during the silent tail). Instagram and TikTok get it as the
> thumbnail (`thumbnailOffset`, set by ci_shorts). Write `"thumb_text"` (3–6 punchy words that say what the
> title promises, e.g. "Why Likes Hook You") and `"thumb_emph"` (the 1–2 words to highlight) in every
> script.json. YouTube picks Shorts thumbnails itself; Buffer can't set them.
> The cover shows an **original character** (flat One More style). Shorts **cycle through a fixed cast of 8** in
> posting order (`CAST` in cover.jsx; `cover_index` from the post date + slot). Set `"thumb_mood"` to match the title: curious | shocked | smug | worried | happy | thinking.
> Optional `"cover_char"`: {"hair": curls|short|long|bun|buzz|ponytail|spiky, "outfit": collar|tee|hoodie,
> "glasses": true|false, "skin": 0–5}.
> **Music (2026-10-19, Shivam):** every Short gets its own generated bed (analysis/sfx_lib.py `music`), never the
> same twice. Set `"music_vibe"` to fit the video: calm | uplifting | playful | mystery | tense | lofi
> (myth-busting / "you've been fooled" → mystery or tense; tips and wins → uplifting; quirky effects → playful;
> reflective habits / study → lofi or calm). Without it the vibe follows `thumb_mood`.

> **Pattern test (2026-10-22, Shivam — overrides older topic rules):** the old idea queue was shelved (rows `Vetoed`,
> note "replaced by the pattern test"). The **Ideas** are now 30 rows built on 10 patterns taken from the top
> psychology Shorts (tracker `Theme` = `Pattern: …`, also in `Hook formula (3-act)`): Experiment story · Protect
> yourself · Psychology of people who · Numbered facts · Therapist tip · Relationships & likability · Strange named
> effect · Quiz / test yourself · Presence & influence rules · Psychology says (15 s loop). `Priority` 1–30 orders them
> so **each day's 3 Shorts are 3 different patterns** (day 1 = patterns 1-3, day 2 = 4-6, …); write scripts strictly
> in Priority order and never reorder. Each row's `Opening hook` and `Content outline` (with sources) is the
> starting point — verify every number as usual. Script rules for the test: **25–32 s** (≈70–85 words; the "Psychology
> says" loop 12–18 s), 6–7 scenes, the hook speaks to the viewer ("you") in the first line, plain-language titles (no
> jargon in the title), the 3-act Turn ("But…") stays. Add `"pattern": "<pattern name>"` to script.json. After the 30,
> the weekly review ranks patterns by views and retention and Shivam picks what continues.
> **Emotion tags (2026-10-24, Shivam):** give every line a `"tone"` for the ElevenLabs v3 voices (Shivam / Jessica / Brian):
> 1–2 delivery tags that fit that line, e.g. "curious", "excited", "surprised", "whispers", "thoughtfully", "warmly",
> "mischievously", "sarcastic", "laughs", "sighs", "serious" (comma-separated). The hook is usually curious/excited, the
> "But…" turn surprised or whispers, the payoff thoughtfully, the outro warmly. Tags are never spoken or captioned;
> Heart (Kokoro) ignores them.
> Examples: shorts/rosenhan-fake-patients, foot-in-the-door, always-late, mind-goes-blank, five-minute-sigh,
> coffee-spill-effect.

> **3-act scripts (2026-10-18, Shivam — applies now, overrides the "change only topics, hooks and titles" part of the
> freeze; only the visual format stays locked):** every new or still-`Scripted` (not yet built) Short follows the
> 3-act arc. Starting point: the tracker's **3-Act Scripts** sheet (7 beats per idea: Hook 0–3 s → Setup → Evidence →
> Escalation → **Turn** ("But…") → Payoff (name the effect) → Outro with a concrete action). Its studies and numbers
> were written from memory: verify every "Claim to verify" with a web search as usual, keep what checks out, fix or
> replace the rest, then expand to the format's word count. Map the beats onto the format's scenes/lines (Ted type 2:
> 6–8 scenes; story: its lines). Hook rules: a bold claim, result-first number or "you" callout beats a soft question;
> on-screen text and voice say the hook together in the first frame. Record the hook formula in the tracker column
> `Hook formula (3-act)` (already filled for all 102 ideas) so the weekly review can compare formulas.
> Never rewrite rows that are already `Scheduled` or `Published`.

**3 psychology Shorts a day** (was up to 5) (repo variable `SHORTS_PER_DAY`), made with the Motion as Code kit
(vertical template + Shivam's pixel avatar, narrated by a British TTS voice — Kokoro `bf_emma`, set in `shorts/voice/voice.json`; Shivam rejected his cloned voice as mechanical, don't switch back without asking), posted to YouTube Shorts,
Instagram Reels and TikTok through **Buffer (free plan)**, scheduled **the day before** so Shivam can veto.

Who does what:
- **Claude — script writer** (scheduled task, every 2 days): researches and writes scripts ahead of time
  (`shorts/<slug>/script.json`, tracker `Status=Scripted`). This is the only creative step.
- **GitHub Actions — `Daily Shorts`** (`.github/workflows/daily-shorts.yml` on `main`, 09:17 PT daily): takes
  the next `Scripted` rows (lowest Priority first), builds them in parallel (OmniVoice voice, render, SFX),
  runs QA checks (1080×1920, 12–59.5 s, audible audio, not frozen), hosts them on the `media` branch
  (`media/<date>/<slug>.mp4`, last 4 dates kept), schedules each on Buffer for tomorrow at the slots in
  `SLOTS` (default 09:00, 14:00, 19:00 PT), sets the tracker (`Scheduled`, `Post date`,
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
   - Structure: the 3-act arc from the **3-Act Scripts** sheet (see the 2026-10-18 note at the top).
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

## (Ended) Ted type 1 experiment (2026-10-14) — superseded, kept for history

Shivam's call: the **next 10 videos are all Ted type 1** (format `ted1`), kept consistent so their
numbers can be compared with the earlier pixel-avatar Shorts. Videos No. 35 and 43 are the first two.
Write every new script in this format until 10 `ted1` rows exist (count rows with `Visual style=ted1`),
then go back to the normal template and say so in the message to Shivam; the weekly review decides
which format wins. Set `Visual style=ted1` on each of these rows.

**What it is:** modelled on faceless dark-psychology tip channels. A flat illustration clip per
line (free LottieFiles animations, picked automatically in CI from each line's `q`) in a rounded card
on black with a vignette, hard cuts on every line, 2–3-word white captions, the handle in the corner,
a deep male narrator (Kokoro `am_onyx`, fast, short pauses) over a dark synth bed.

**Script rules (on top of the accuracy rules above):**
- 7–9 lines, 85–115 spoken words (about 30–40 s). Short, punchy, second person ("you").
- Line 1 is the hook: a tip that sounds like a secret or a surprising claim, no throat-clearing.
- Structure: situation → the move → why it works (name the effect and the study in a few words:
  "Harvard researcher Alison Brooks had people…"). One or two tips per video; number the second
  ("Two.") when there are two.
- The **last line or two are a real outro, never just "Follow for more"**: tell them what to do with the
  trick and give a reason to follow, e.g. "Save this for your next interview. And follow, because
  tomorrow's trick works on other people." Vary the wording every video.
- Every line has `"q"`: 2–3 comma-separated search words for a **concrete picture** of that line
  (people, objects, actions: "job interview, handshake", "chocolate, dessert"), most specific first.
  Avoid abstract words (bias, effect, psychology) and words that return UI icons.
- Every line has `"bg"`: the card colour behind the illustration. Alternate dark and light, rotating
  through #1F3B73 #E9E4D8 #B3202A #E8C547 #2B6E7A #E07A2E #6A3FA0 #3E8E5A #F1ECE2 #6B2D1F.
- Script fields: `"format": "ted1"`, `"look": "ted1"`, `"handle": "@aroundthestrangeai"`, every line
  `"sec": "ted"`. `title`, `credit`, `post` as usual; no `stat` or `hookStyle`.
- Example: shorts/reappraisal/script.json.

## Ted type 2 — Claude Design style (format `cdesign`) — current Shorts format (from 2026-10-14 evening)

Shivam designed this look in Claude Design ("Rename Your Nerves Short") and wants it instead of the
LottieFiles version of Ted type 1, and named it **Ted type 2**. **All new Shorts in the 10-video
experiment are Ted type 2** (`format: "cdesign"`, `look: "ted2"`, tracker `Visual style=ted2`); the
experiment counts ted1 + ted2 rows together toward 10. Convert any still-Scripted `ted1` (Lottie)
script to Ted type 2 when you next write.

How it renders: `scripts/design_build.py` voices the script (deep Onyx narrator), times every caption
chunk to the words, writes `shorts/<slug>/index.html` (Claude Design runtime in shorts/design_kit/ +
`engine.jsx`) and captures it frame by frame. **You write two files per video:**

1. `shorts/<slug>/script.json` — `format: "cdesign"`, `handle: "@aroundthestrangeai"`, `title`, `credit`,
   `post`, `no`, `look: "ted2"`, and `lines` = one per scene (6–8 scenes, 25–40 s total):
   `{"scene": "Calm", "color": "#1F3B73", "light": false, "art": "ArtNervous",
     "chunks": [["Nervous before"], ["a big moment?"], ["Don't tell"], ["yourself to"],
                ["CALM down.", {"emph": "CALM", "fx": "doodle", "doodle": "❌"}]]}`
   - The narration is the chunks joined; each chunk 1–3 words, in reading order.
   - Exactly ONE emphasis chunk per scene; its word is in CAPS in the chunk text and in `emph`.
     Vary `fx` across scenes: `pop`, `circle` (+`mark` colour), `underline` (+`mark`), `stamp`
     (+`block` colour), `type`, `glitch` (numbers, surprising facts), `doodle` (+ one emoji).
   - `color` rotates #1F3B73 #E9E4D8 #B3202A #E8C547 #2B6E7A #E07A2E #6A3FA0; `light: true` on light colours.
   - Same writing rules as Ted type 1: hook first, situation → move → why (study named), a real outro.
   - Follow the 3-act arc (3-Act Scripts sheet): hook scene → setup → study → escalation → a "But…" turn scene → payoff → outro.
2. `shorts/<slug>/art.jsx` — one animated SVG illustration component per scene, drawn in a 972×1728
   viewBox (the card), as pure functions of time `T` (seconds, global) and `t` (seconds into the scene):
   no state, no effects, no timers, no Math.random (use the `hsh` helper). Flat vector style like the
   example: bold shapes, ink #141821, skin tones, a big soft circle behind the subject, characters with
   blinking eyes / small loops (sway, bob, confetti, sweat drops). Keep the subject in the lower 60%
   (captions sit in the top third). Copy the helper block (MOTION, INK, SKIN…, osc, blink, hsh, tw, Eye)
   from `shorts/rename-nerves/art.jsx` — the reference for quality and style — and end the file with
   `Object.assign(window, { ArtA, ArtB, … })` exporting every `art` named in the script.
3. Check before pushing: `npm i --prefix /tmp/babel @babel/standalone` once, then
   `cd scripts && BABEL=/tmp/babel/node_modules/@babel/standalone node check_art.mjs <slug>` must print ok.

## Story Shorts — fully art-directed from the tracker (format `story`) — built now, posted from 2026-11-01

Shivam (2026-10-16): rows can describe the whole video in the tracker. A row with **`Format=story`** is made as a
story Short: the One More Never Enough layout made vertical (animated headline on top, a rounded 980×980
illustration stage, the narration line as a caption below), drawn and animated per video from the row's STORY
columns, with the One More audio (Kokoro `af_heart`, the sound effects of `analysis/sfx_lib.py`, the F-major pad bed).
Rows without `Format` (or `ted2`) are Ted type 2 as before.

**Freeze:** story Shorts don't count toward the freeze and don't change the Ted type 2 rules. Until **2026-11-01**
(`STORY_FROM` in `scripts/ci_shorts.py`) the daily plan **holds** Scripted story rows (log line "hold No.…"), so they
are never posted before then. Build one for review any time with the Daily Shorts workflow input `only_slugs=<slug>`
(a dry run; the issue shows the preview). From 2026-11-01 they post in Priority order with everything else.

**The tracker columns** (sheet "Shorts ideas", group STORY; `scripts/add_story_columns.py` added them):
`Format` (ted2 | story), `Animation style`, `Storyboard`, `Palette & type`, `Characters`, `Sound cues`, plus the usual
`Theme`, `Video idea`, `Opening hook`, `Content outline`, `Visual / filming idea`. Whatever Shivam wrote there is the
brief: follow it closely; fill gaps yourself. Empty Storyboard → plan 5–7 scenes from the hook and outline.

**Script writer run:** write story rows as well as Ted type 2 rows (same accuracy rules: verify with a web search,
name the researchers and year, record `Source checked`). Story rows **don't count toward the Scripted target**
(3 × SHORTS_PER_DAY) before 2026-11-01. Per story row write three things, then `tracker.py set <No> "Status=Scripted" "Slug=<slug>" …`:

1. `shorts/<slug>/script.json`:
   `format: "story"`, `look: "story"`, `slug`, `no`, `title`, `credit`, `handle: "@aroundthestrangeai"`, `post`
   (as Ted type 2), `"auto_sfx": false` when every line carries its own sound cues, and
   - `style`: `stage` (`square` 980×980, or `tall` 980×1180), `bg`, `head` / `body` (any Google Font family),
     `headSize` (≈ 90–110), optional `stageBg`, `stageRadius`, `captions: false`, and `palette` with keys
     ink, accent, accentDark, hot, cool, deep, pop, soft, paper, skin, skinShade, hair (hex) — from Palette & type.
   - `lines`: one narration line each, `{"art": "SceneHook", "text": "…", "headline"?: "…", "sfx"?: [[sound, offset_s, volume]],
     "pause_after"?: seconds, "say"?: "phonetic text", "caption"?: "shorter on-screen text", "cut"?: true}`.
     Consecutive lines with the same `art` are one scene (5–7 scenes). `headline` sets the big text above the stage
     until the next one: `*words*` in the accent colour, `==words==` with the highlighter. Sounds: swipe, whoosh,
     pop, tick, chime, chime-bright, rising, notification, flip, flip-dull, lightning, airy, card-slide, settle,
     toggle, drawer, page-turn, wood-tap (volumes 0.2–0.4; offsets in seconds from the line's start, may be
     negative). Without `sfx`, a whoosh/swipe plays where the scene changes (unless `auto_sfx: false`).
   - 80–130 spoken words (about 35–55 s; QA fails anything over 59.5 s). Hook line first, a real outro last. Follow the 3-act arc (3-Act Scripts sheet), with a "But…" turn line.
2. `shorts/<slug>/scenes.jsx`: one component per `art`, drawing the 980×W stage in SVG as a **pure function of
   time** (no state, effects, timers, Math.random — use `SK.hsh`). Props: `t` (s since the scene started), `T`,
   `dur`, `beats` (each line's start within the scene — key the action to these so it lands on the words), `ends`,
   `W`, `H`, `P` (palette). Use the kit in `shorts/design_kit/story-kit.jsx`: timing helpers on `SK`
   (K, L, E, win, kf, camT, lerpCam, ellPts, burst, sc, md, hsh) and the One More drawing kit (StoryBust, StoryArm,
   StoryHand, StoryMini, StoryPhone, StoryCard, StoryToggle, StoryBell, StoryTag, StoryBox), or draw your own
   to match the row's Animation style. Every scene should keep moving (camera push, bobbing, pops on beats).
   End with `Object.assign(window, { SceneA, … })`. Reference: `shorts/stroop-ink/` (row 21).
3. Check: `cd scripts && BABEL=/tmp/babel/node_modules/@babel/standalone node check_art.mjs <slug>` must print ok.
   If you can, build it (`python3 scripts/design_build.py <slug>`) and look at `shorts/<slug>/preview.jpg`.

## Long-form (Ted type 1, 16:9, YouTube, twice a week)

Shivam asked for long-form Ted type 1 videos twice a week alongside the Shorts.
- **Format: Ted type 2 in 16:9** (Shivam, 2026-10-14): `format: "cdesign"`, `orientation: "landscape"`,
  written exactly like a Ted type 2 Short (script.json lines with `scene`/`color`/`light`/`art`/`chunks`
  + `shorts/long/<slug>/art.jsx`). The engine shows the same 972×1728 portrait drawings in a panel on
  the right of the 16:9 card with big captions on the left and the current chapter title on top, so
  draw art the same way (subject in the lower part of the 972×1728 viewBox). Lines may reuse one art
  component (8–14 arts per video is plenty; vary `color` so reused art still feels new). Any long-form
  script still in the old `ted1` (Lottie) format must be converted before its build (e.g.
  seven-tricks-liked → rewrite its lines into chunks + draw its art).
- **Queue:** the tracker's **"Long form"** sheet (Status Idea → Scripted → Scheduled → Published).
  Scripts live in `shorts/long/<slug>/script.json`, plus `"chapter": "<title>"` on the first line of each chapter
  (becomes YouTube chapters), optional `"thumb_text"` (2–4 punchy words for the thumbnail) and
  `"thumb_at"` (seconds into the video for the thumbnail frame). Example: shorts/long/seven-tricks-liked.
- **Build:** the "Long-form" workflow (`.github/workflows/longform.yml` on main) runs Mon & Thu, builds
  the lowest-Priority Scripted row in ~75 s chunks in parallel, adds the music bed, thumbnail and
  chapters, and schedules it on Buffer (YouTube only) for the next day 12:00 PT (Tue & Fri). It opens a
  GitHub issue "Long-form: <slug>" for the veto.
- **Writing (Claude, "Long-form script writer" task, Sun & Wed):** keep at least one long-form row
  Scripted ahead of each build. Pick the next Idea row (or add new ones in the same spirit — practical
  psychology people can use, listicle or "why you…" angles that won on Shorts). Rules:
  - 1,100–1,500 spoken words (about 7–10 minutes; over 8 minutes allows mid-roll ads).
  - Hook in the first 15 seconds that promises the payoff ("…and the last one changes how you'll see
    every conversation"); then 5–8 chapters, one idea each: the move → the study (researchers + year,
    what they did, what they found, in plain words) → how to use it today.
  - Every claim checked against a real source (web search); list the studies in `post.description`
    with authors and years; `credit` lists them briefly.
  - Each line is a scene of 1–3-word chunks with one emphasis chunk (see Ted type 2); check with check_art.mjs before pushing.
  - Outro: recap the moves in one line, give a small challenge ("try one this week"), then a reason to
    subscribe that names the schedule (new videos every Tuesday and Friday). Never a bare "subscribe".
  - `post.title`: curiosity + promise, ≤ 70 characters, no #shorts. Set the row to Scripted with its Slug.

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
