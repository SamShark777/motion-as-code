# Psychology Shorts — the style cycle (Shivam, 2026-10-26)

New Shorts use **three styles picked at random** (no fixed order — `python3 scripts/pick_style.py` chooses one per
script from `styles.json`, never 3 in a row of the same): **Ted type 2** (format `cdesign`, the original — see the
runbook's Ted type 2 section and shorts/rename-nerves), **ted-MG motion graphics** (format `tedmg`) and **retro modern
illustration** (format `retro`). **Experiment log** (format `xplog`, added 2026-11-09 — its own section below) is the fourth. More styles will be added to `styles.json`. The two new ones are recurring-character micro-stories (character → situation →
conflict → "But…" psychology reveal → name the effect → payoff/cliffhanger) and are described here. Look at the pictures in this folder before
writing or drawing anything: `reference-*.jpg` are frames from the reels Shivam picked; `ours-*.jpg` are frames
our pipeline actually rendered — that is the quality bar.

| | ted-MG motion graphics | retro modern illustration |
|---|---|---|
| format / look | `tedmg` | `retro` |
| reference | `tedmg/reference-sheet.jpg`, `reference-01…10.jpg` | `retro/reference-sheet.jpg`, `reference-01…08.jpg` |
| ours | `tedmg/ours-milo-coffee-stain.jpg` (+ frames) | `retro/ours-arthur-the-critic.jpg` (+ frames) |
| example episode | `shorts/milo-coffee-stain/` | `shorts/arthur-the-critic/` |
| kit / engine | `design_kit/tedmg-kit.jsx` / `tedmg-engine.jsx` | `design_kit/retro-kit.jsx` / `retro-engine.jsx` |
| cast | `characters/tedmg-cast.json`: Milo, Nia, Theo, Rosa, Dev, June — `tedmg/cast-sheet.jpg` | `characters/retro-cast.json`: Arthur, Mae, Otto, Lila, The Critic, The Doubt — `retro/cast-sheet.jpg` |

## ted-MG motion graphics
- **Look:** flat-vector cartoon, round cream heads with dot eyes and expressive brows, thick ink outlines;
  warm muted sets (party with string lights, bedroom, night street, theatre stage, soft close-up walls, navy data
  cards). A new shot every 2–3 s, slow push-ins, close-ups for emotion, wides for the world.
- **Type:** captions one chunk at a time in big condensed white type (Bebas Neue), emphasis words amber `#F6B92E`.
  UI chips for time/place/data ("DAY 1 · 7:10 AM", "PARTY IN 10:00", "CORNELL STUDY · 2000"), red rings and arrows
  to point at the detail that matters, a counter or head-grid for numbers, "PART 2" end card for cliffhangers.
- **Kit:** `MGBg` (party | room | roomNight | street | stage | wall c1/c2 | dark | navy), `MGBust` (close-up, with
  `stain`), `MGPerson` (full figure, `walk`, `cup`), `MGHead`, `MGCrowd` (party room; `lookAt`, `bubbles`, `spot`),
  `MGHeadGrid` + `MGBigNum` (stats), `MGChip`, `MGTitle`, `MGBubble`, `MGRing`, `MGArrows`, `MGSpot`, `MGGlow`,
  `MGArm`, `MGMug`, `MGCup`, `MGPhone`, `MGMic`; helpers on `MG` (sm, eo, back, osc, blink, hsh, extra).

## Retro modern illustration
- **Look:** mid-century editorial illustration. Palette ONLY vermilion `#D9442E` (+ dark `#B8321F`), indigo
  `#2E4B8F`, pink `#F09089`, mustard `#F4C437`, cream `#F4E7D2`, black `#17131A`; glowing cyan `#8FEFFF` is the one
  accent (electricity, tears). Angular faces, big triangle noses, yellow eyes with heavy lids, hatching for hair,
  moustaches, stubble and wrinkles; stipple grain on everything (the engine adds it). Surreal metaphors over
  literal scenes: a creature pressing a button in the brain, an eye with the hero reflected in the pupil, a scale,
  a bush with eyes, an alarm clock.
- **Type:** captions one chunk at a time in bold condensed cream (Oswald) with a hard black offset shadow,
  emphasis words mustard. Labels are rectangles with a hard shadow (`RMChip`); titles stacked with a hard shadow.
- **Kit:** `RMBg` (red | redDark | dark | blue), `RMArthur` / `RMMae` / `RMHuman`, `RMCritic`, `RMHand`, `RMBrain`,
  `RMBolt`, `RMEyeMacro`, `RMScale`, `RMFlower`, `RMSpiky`, `RMBush`, `RMAlarm`, `RMLoopRings`, `RMGrid`, `RMBulb`,
  `RMBadge`, `RMSpeech`, `RMChip`, `RMTitle`, `RMLine`; helpers on `RM` (P palette, sm, eo, back, osc, hsh).

## Writing a script in either style
Same `script.json` shape as the stick stories (see the two examples): `format` + `look` = `tedmg` or `retro`,
`series`, `episode`, `cast`, `title`, `credit`, `handle`, `lines`, `post`, `thumb_text`, `thumb_emph`, `thumb_mood`,
`music_vibe`, `pattern: "Character story"`, `thumb_scene`.
- 8–11 lines, **75–100 spoken words** (ElevenLabs voices run long; QA fails anything over 59.5 s).
- Each line: `scene`, `art`, `chunks` (1–3 words each, exactly ONE emphasis chunk `{"emph": "WORD"}` with the word in
  CAPS), `text`, `tone` (ElevenLabs v3 tags), optional `say` (phonetic), `cam` `[focusX, focusY, scaleFrom, scaleTo]`,
  `capY` (caption centre; tedmg default 1480, retro 1540 — move it when a number or face sits there).
- `art.jsx`: one component per `art`, drawing the FULL 1080×1920 frame (background included) as a pure function of
  `T`, `t`, `dur`, `beats` (chunk start times within the scene — switch shots and land actions on these). Wrap the
  file in `(function () { … Object.assign(window, { … }); })();` so helper names never collide. No Math.random,
  state, effects or timers (use `MG.hsh` / `RM.hsh`). Compose kit components; draw extra props in the same style.
- Validate: `cd scripts && BABEL=/tmp/babel/node_modules/@babel/standalone node check_art.mjs <slug>` → ok.
- Real studies: verify every number with a web search; name researchers + year in `credit` and `post.description`.

## Casts in every style (Shivam, 2026-10-26)
Each style has its own recurring cast — see the `cast-sheet.jpg` in each folder before writing:
- **Ted type 2:** `characters/ted2-cast.json` — Sam, Priya, Leo, Grace, Omar, drawn with `<T2Bust who=… mood=… />` from
  `design_kit/ted2-cast.jsx` (loaded automatically for format `cdesign`). Use them whenever a Ted type 2 scene needs a person.
- **ted-MG:** Milo, Nia, Theo, Rosa, Dev, June (`MGBust` / `MGPerson` / `MGHead` with `who=`).
- **retro:** Arthur, Mae, Otto, Lila (`RMArthur` / `RMMae` / `RMOtto` / `RMLila`, or `RMHuman who=`) and two creatures that
  personify the voices in our heads: The Critic (`RMCritic`, harsh self-judgement) and The Doubt (`RMDoubt`, "what if…" worry).
Give episodes 2–3 characters, rotate who leads, keep personalities and relationships consistent, update `history`.

## Experiment log (`xplog`, Shivam 2026-11-09)
Modelled on a reel Shivam shared ("I tested the hot-singles ads for 24 hours": HOUR 1 header, trial countdown, FAKES FOUND 0/7,
one wide cartoon panel, sentence captions). We keep the **structure**, not their character, palette or handle (reference frames are
third-party and are not committed). Ours: `xplog/ours-finn-left-on-read.jpg`, `ours-frame-*.jpg`, cast `xplog/cast-sheet.jpg`.
- **What it is:** a timed experiment told in second person ("You send one text."), as a log. The viewer is the subject; a cast
  member (Finn, Ivy or Gus — `characters/xplog-cast.json`) is their stand-in on screen. One everyday overthinking situation, a
  clock that jumps forward chapter by chapter (MINUTE 4 → HOUR 2 → HOUR 23), and a counter that fills up (SPIRALS 0/7,
  EXCUSES 0/5, REWRITES 0/6). The hook opens a loop the last chapter closes ("Stay for the reply. It is three words.").
- **Page (the engine draws it, never art.jsx):** HUD on top = chapter title with a yellow underline, the tag
  "THE OVERTHINK CLUB", the running clock and the counter; ONE wide panel in the middle; the line's full sentence underneath
  in white caps (Poppins 800), the emphasis word turning yellow as it is spoken. Navy `#10131F` page.
- **Look of the panel:** thick ink outlines, navy striped walls, cream cards `#F3E9CF`, yellow `#FFC93C`, red `#E5484D` for alerts
  and stamps, green only for "online". Mostly objects and UI close-ups (the chat window, a phone face down, a stopwatch, a case
  file, a filing drawer), with a character close-up every 3–4 lines for the emotion. One idea per panel; text in panels in CAPS, ≥ 22 px.
- **Kit (`design_kit/xplog-kit.jsx`, engine `xplog-engine.jsx`):** `XLBg` (wall | wallDark | room | wood | woodDark), `XLChar`
  (who, mood = neutral | wide | worried | squint | sleepy | relief | smile, look, sweat, bl), `XLAvatar`, `XLChat` + `XLBubble`,
  `XLPhone` (back | lit), `XLCard`, `XLText`, `XLChip`, `XLStamp`, `XLStopwatch`, `XLDial`, `XLSpiral`, `XLBattery`, `XLBulb`,
  `XLBars`, `XLGlow`; motion wrappers `XLPop`, `XLFade`, `XLRise`, `XLWiggle`, `XLPulse` (all take `t` + `at`); helpers on `XL`
  (palette, clamp, eo, back, osc, hsh, p2, clock, beat).
- **script.json:** `format` + `look` = `xplog`, `pattern: "Experiment log"`, plus top-level
  `"hud": {"clock_label": "LEFT ON READ FOR", "count_label": "SPIRALS", "count_total": 7, "tag": "THE OVERTHINK CLUB"}` and per line
  an optional `"hud": {"title": "MINUTE 4", "clock": 240, "run": true, "count": 1, "count_beat": 1}` (carried forward: `clock` =
  seconds shown when the line starts, ticking in real time unless `"run": false`; `count` lands on chunk `count_beat`, default the
  emphasis chunk). Lines keep the usual shape (`scene`, `art`, `chunks` of 1–3 words with exactly ONE emphasis chunk, `text`,
  `tone`); the caption shows the whole line, so write each line as one or two short complete sentences.
- **Length:** 12–16 lines, **100–125 spoken words** (the example: 15 lines, 118 words, 42 s). Chapters are short: time stamp
  first ("Hour two."), then what you do, then the sting. 5–7 counter steps, then the "But…" reveal in plain words, the payoff
  that closes the hook's loop, the comment question, the share line.
- **art.jsx:** one component per `art`, drawing ONLY the panel — `viewBox 0 0 1080 608`, background included — as a pure function
  of `T`, `t`, `dur`, `beats`. Every scene is also rendered before it starts, so guard anything that breaks on a negative `t`
  (`'.'.repeat(n)`, array indexes). Wrap in `(function () { … Object.assign(window, { … }); })();`. Set `thumb_scene` to a line
  whose subject sits in the middle of the panel (the cover crops the panel's centre).
- **Rules that still apply:** Context → Lean → Snapback hook, "that's me" beats, comment question before the share ending, real
  studies only with verified numbers (the example cites none on purpose), no whoosh sounds.

## German Expressionism (`expressionism`, Shivam 2026-11-04)
Look: 1920s silent-film expressionism (Caligari-style crooked sets). Bold black ink outlines, jagged geometric shapes, walls and buildings tilted at impossible angles, one hard light source (bare bulb, candle, window beam) with long angular shadows, thick textured oil paint mixed with woodcut cross-hatching, paper grain. Palette: deep black, bone white #EFE6CF, muted olive green, oxblood red #9E2B22, ochre #D9A441. Figures elongated, huge haunted round eyes, long fingers. Recurring motifs: staring eyes, stairs/doorways, monstrous shadows cast by ordinary objects.
Shivam's reference board (14 images, not committed: third-party art) covered expressionist film posters, ink shadow monsters, cubist-expressionist paintings, crooked cityscapes and eye-filled corridors.
Cast: shorts/characters/expressionism-cast.json, sheet shorts/styles/expressionism/cast-sheet.jpg. Example: money-evil (ours-money-evil.jpg).
Build: Higgsfield gpt_image_2_6, 9:16, quality medium, 2k, cast sheet job as image reference, prompts end with the palette + "No text, no watermark"; 8 scenes ≈ 8 credits. Images are fetched with the Daily Shorts `asset_fetch` input (the image host is blocked in Claude's workspace), then a HyperFrames build: slow push-ins, bulb flicker, League Gothic bone-white titles with hard black shadow, Inter captions on a dark chip at y 1190, dark piano bed. Never draw a real person or a group as the villain; The Shadow is always the fear itself.
Status: saved, not in the automatic rotation yet ("auto": false) — each video costs Higgsfield credits and the scheduled script writer can't generate art.
