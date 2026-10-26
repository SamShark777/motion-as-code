# Psychology Shorts — the style cycle (Shivam, 2026-10-26)

New Shorts use **three styles picked at random** (no fixed order — `python3 scripts/pick_style.py` chooses one per
script from `styles.json`, never 3 in a row of the same): **Ted type 2** (format `cdesign`, the original — see the
runbook's Ted type 2 section and shorts/rename-nerves), **ted-MG motion graphics** (format `tedmg`) and **retro modern
illustration** (format `retro`). More styles will be added to `styles.json`. The two new ones are recurring-character micro-stories (character → situation →
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
