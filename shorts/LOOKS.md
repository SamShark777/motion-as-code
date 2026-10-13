# Visual styles ("looks") for the Shorts template

Every Short is built in one look, set per idea in the tracker's **Visual style** column (sheet *Looks*
lists them with what each suits). The pipeline copies it into `script.json` as `"look"`.
A look restyles the same four plates (hook, name, evidence, outro): the ground, palette, typefaces,
how karaoke words are set, the title lock-up, how the avatar, crowd, eyes and spotlight are drawn,
post-processing and a small screen chrome. Code: `app/src/scenes/_looks.ts`.

Palettes, type pairings and conventions are adapted from the film styles of
[lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) by LemoLab (MIT, see `LICENSE.lemo-opuscar`).
Fonts are OFL (see `app/public/fonts/ext/OFL.txt`).

| Look id | Adapted from | Ground | Feel | Best for |
|---|---|---|---|---|
| `pixel-lab` | house style | dark graph paper | ink + signal orange, Archivo | default; being-watched / social ideas |
| `whiteboard` | whiteboard | glossy white board | marker black/blue/orange, handwriting | learning, study techniques, how-tos |
| `data-story` | dataviz | cream paper | serif headlines, unit-chart crowd, red/blue | ideas whose punch is a number |
| `swiss` | swiss-motion | grey page, column grid | Inter, black + one red | decisions, wording, prices |
| `dossier` | halftone-dossier | cream paper + halftone dots | case-file chips, stamps, misprint shadows | classic experiments, myths on trial |
| `riso` | risograph | warm paper, grain | blue + fluorescent pink overprint | light everyday social ideas |
| `blueprint` | blueprint | Prussian-blue sheet + grid | white line work, red stamp | systems: habits, friction, mechanisms |
| `terminal` | ascii-crt | CRT glass, scanlines | amber phosphor, VT323, all caps | screens, feeds, notifications |
| `keynote` | dark-keynote | dark stage, cool light | Inter + lime accent, pictograms | tech/consumer psychology |
| `game-show` | game-show | violet stripes | Fredoka telop text, yellow/pink | quizzes, rewards, playful demos |
| `cartoon-50s` | midcentury-toon | mustard sunburst | brown ink, teal plate | practical everyday tips |
| `spy-noir` | spy-titles | black paper | cream caps, silhouettes, red light | hidden thoughts, things people miss |
| `crayon` | crayon-book | toothy paper | Patrick Hand, boiling text | gentle emotional topics |
| `pixel-quest` | pixel-rpg | dithered pixel sky | dialog boxes, XP bar | progress, motivation, practice |
| `one-line` | one-line | warm white paper | ink-drawn avatar, script title | introspective identity / memory ideas |

Preview any looks on the current `data/script.json`:
`python3 scripts/look_sheet.py 2.2,5.6,13.6,22.6 out/looks.jpg [look,look,...]`

Not adapted (they need 3D scenes or fully hand-painted shots that the template can't produce
reliably every day): brick-toy, tilt-shift, lowpoly-island, glass-product, paper-popup, hd-2d,
cel-anime-80s, impasto, ink-wash, ukiyoe, watercolor, urban-sketch, stained-glass, woodcut, engraving,
art-deco, shadow-puppet, paper-lantern, papercut-red, silkscreen-poster, pictogram-motion, hologram-hud,
living-screencast, iso-infographic, microgame, rubber-hose, scifi-toon, backrooms, silent-film
(silent film also has no narration by definition).
