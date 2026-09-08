# Handoff: Landing page redesign — hero + project ledger

For Claude Code, working in the `portfolio` repo on branch
`redesign/single-page-landing`.

## Overview

A redesign of two sections of the single-page portfolio landing:

1. **Hero** — asymmetric 7/5 layout, an interactive star field replacing the CSS
   grid background, one directional wash replacing four unshaped effects, and a
   hero ground that is derived from the active theme instead of pinned to black.
2. **Projects** — the two-column `ProjectCard` grid replaced by an indexed
   ledger: one hand-picked lead row at double weight, then dense rows with a
   right-hand meta rail.

It also changes the site accent from purple `#7C6AF7` to a light blue held at
two values, and cools the neutral ramp to match.

Two schema fields are required: `role: string` and `featured: boolean` on
`IProject`.

## About the design files

`reference/Redesign Blueprint.dc.html` is a **design reference created in
HTML** — an annotated document that argues each decision and renders live
previews of the hero and the ledger. It is not production code and nothing in
it should be copied verbatim.

Everything in `components/` and `globals-tokens.css` **is** production code:
real TSX written against this repo's imports, types and Tailwind setup. Those
files are meant to be moved into `src/` as-is, then adjusted if the repo has
moved since. `model-changes.md` is a set of copy-paste diffs, not files.

If a path in `components/` no longer matches the repo, trust the repo and adapt
the import — do not restructure the component.

## Fidelity

**High fidelity.** Colors, type sizes, weights, tracking, line heights,
spacing and interaction states are all final and specified. Recreate exactly.
Where a value appears both here and in the TSX, the TSX wins.

## Sync order

`model-changes.md` first — the ledger will not typecheck without `role` and
`featured`.

1. `model-changes.md` steps 1–5 (types, model, validations, actions, admin form).
2. `model-changes.md` step 6 — the `mongosh` backfill. **Required.** `role` is
   a required field, so every existing project document fails validation on its
   next write until it is backfilled.
3. Paste the two token blocks from `globals-tokens.css` into the existing
   `:root` and `.dark` rules in `src/app/globals.css`, then the
   `@layer components` block after them.
4. Delete the now-dead `.bg-grid` / `.bg-grid-ink` rules and the
   `--grid-opacity` / `--hero-glow-opacity` variables they read.
5. Copy `components/*.tsx` to `src/components/sections/hero/` (`Hero.tsx`,
   `HeroStars.tsx`) and `src/components/sections/projects/`
   (`ProjectLedger.tsx`).
6. Rewire `src/app/(public)/page.tsx` — see "Integration" below.
7. In the admin, set each project's role and check the lead project.

## Integration — `src/app/(public)/page.tsx`

Replace the inline hero `<section>` with:

```tsx
<Hero
  settings={settings}
  latestRole={latestRole}
  experienceLabel={experienceLabel}
  projectsLabel={projectsLabel}
  stackLabel={stackLabel}
  groupedSkills={groupedSkills}
/>
```

Delete from that section: the `.bg-grid` div, the centred radial glow div, and
both blurred orb divs. `Hero` renders `<HeroStars />` and one wash instead.

Replace the projects grid and the inline archive list with:

```tsx
<section id="projects" className="section zone-canvas">
  <div className="container">
    {/* keep the existing section label + h2 */}
    <ProjectLedger projects={featuredProjects} density="full" leadRow />

    {archivedProjects.length > 0 && (
      <div className="mt-16">
        {/* keep the existing Archive rule */}
        <ProjectLedger
          projects={archivedProjects}
          density="compact"
          muted
          indexOffset={featuredProjects.length}
        />
      </div>
    )}
  </div>
</section>
```

`getData()` needs no change — the existing `featuredProjects` /
`archivedProjects` split on `status` still holds, and the ledger finds the lead
inside the featured set.

After this, `ProjectCard.tsx` is unused on the homepage, and `page.tsx` no
longer needs its `Image`, `ArrowUpRight` and `ProjectCard` imports.
`ProjectGallery.tsx` is untouched.

## Screens

### Hero

**Purpose** — name, role, one-line positioning, two CTAs, social links, and the
terminal-style stat card.

**Layout** — `min-h-screen`, `pt-20`, vertically centred content. Inside
`.container` (max-width 1180px, inline padding `clamp(20px, 4vw, 56px)`): a
12-column grid at `lg` and above, `col-span-7` left / `col-span-5` right, gap
`clamp(28px, 4vw, 56px)`, `items-center`. Single column below `lg`, where the
right column is `hidden`. Left column is a `flex-col` with `gap: 22px`.

**Components, top to bottom in the left column**

| Element | Spec |
| --- | --- |
| Availability pill | Only when `settings.availableForWork`. `rounded-full`, padding `6px 13px 6px 11px`, background `--accent-glow`, 1px border `color-mix(in srgb, var(--accent) 30%, transparent)`, text `--accent-on-canvas`, mono 12px. Leading 6px dot in `--accent-on-canvas`, `animate-pulse`. Copy: "Open to opportunities". |
| Greeting | Mono 12.5px/1.5, `--hero-fg-faint`, `tracking-wider`, `mb-3`. Copy: `Hi, I'm {name} —`. |
| Headline | Three block lines in one `<h1>`, `line-height: 1` on all three. Lines 1 and 3 (`Full Stack`, `Engineer`): `--font-display`, weight **600** (`font-semibold`), `clamp(3.25rem, 6.4vw, 5.25rem)`, tracking `-0.042em`, `--hero-fg`. Line 2 is `<RotatingWord />` at `clamp(3.8rem, 7.5vw, 6.2rem)` — 1.18× line 1 to compensate for Dancing Script's lower x-height. |
| Bio | `max-w-[54ch]`, 1.0625rem/1.62, tracking `-0.008em`, `--hero-fg-muted`, `text-wrap: pretty`. |
| Meta run | Mono 12.5px/1.5, `--hero-fg-faint`, `gap-3`, `/` separators at `opacity-45`. Name / role / company / location. |
| CTA row | `gap: 10px`. Primary: `rounded-lg`, padding `11px 20px`, 0.9375rem weight 520, background `--hero-cta-bg`, text `--hero-cta-fg`, `box-shadow: var(--hero-cta-shadow)`, trailing `ArrowUpRight` 16px, `hover:opacity-90`. Secondary: same metrics, background `--hero-surface-soft`, 1px `--hero-line`, text `--hero-fg-muted`. |
| Social row | Mono 12.5px, `--hero-fg-faint`, `gap-[18px]`, `↗` suffix, `hover:opacity-70`. Résumé link prefixed with a 14px `FileText`. |

**This is where the hero ends.** There is no client logo rail and no
`TechMarquee` — both were considered and cut. The plate terminates on the
social row.

**Right column** — the existing `HeroVisual` component, unchanged, right-aligned.

**Background, in z-order**

1. `.zone-hero` ground — `--zone-hero`.
2. `<HeroStars count={56} />`.
3. One wash: absolutely positioned `top: -10%`, `right: -6%`, `width: 46%`,
   `height: 78%`, `radial-gradient(ellipse at center, var(--accent-wash) 0%, transparent 70%)`,
   `blur(44px)`, `pointer-events: none`. Aimed at the card, not centred.
4. Content at `z-10`.

### Projects ledger

**Purpose** — scan every project in one vertical pass, with one project clearly
first.

**Container** — no card, no wrapper shadow. A single `1px solid
var(--line-strong)` top rule; each row closes with `1px solid
var(--line-hairline)`. Rows hover to `background: var(--zone-surface)`, so the
lift belongs to the row rather than to a container.

**Lead row** (the project with `featured: true`, falling back to
`projects[0]`) — `grid-cols-1` below `lg`, then
`[minmax(0,1fr)_minmax(0,400px)]`. Padding `py-7 px-1`, gap
`clamp(20px, 3vw, 40px)`.

- Index `01` in mono 12.5px `--text-secondary`, baseline-aligned with a
  "Featured" chip: mono 11px weight 550, uppercase, tracking `0.14em`,
  `rounded-full`, padding `3px 9px`, background `--accent-glow`, text
  `--accent-on-canvas`.
- Title — `--font-display`, `clamp(1.5rem, 2.6vw, 1.875rem)`, weight 520,
  line-height 1.12, tracking `-0.026em`, `max-w-[22ch]`, wrapped in a `Link` to
  `/projects/{slug}` with `group-hover:opacity-70`.
- Tagline — 1.0625rem/1.6, tracking `-0.008em`, `--text-secondary`,
  `max-w-[52ch]`.
- Up to 6 `.pill` technologies.
- Link chips (`Live ↗`, `Source ↗`) then `{year} · {role}` in mono 12.5px.
- Cover — 16:9, `rounded-lg`, `inset 0 0 0 1px var(--line)`, background
  `--zone-canvas-alt`, `next/image` `fill` + `object-cover`, sizes
  `(max-width: 1024px) 100vw, 420px`.

**Standard rows** — grid `26px minmax(0,1fr)` below `sm`, then
`26px minmax(0,1fr) minmax(0,150px)`. Column gap `clamp(12px, 2.2vw, 26px)`,
row gap 12px, padding `py-5 px-1`.

- Index hangs in the 26px gutter: mono 12.5px/1.7, `--text-secondary`,
  zero-padded.
- Cover plate (full density only) — 96px wide, 3:2.
- Title — `--font-display` 1.1875rem, weight 560, line-height 1.28, tracking
  `-0.014em`. `--text-primary`, or `--text-secondary` when `muted`.
- Tagline (full density only) — 0.9375rem/1.55, `--text-secondary`,
  `max-w-[48ch]`.
- Up to 3 `.pill` technologies.
- Meta rail, right-aligned: year in `--text-primary` over role in
  `--text-secondary`, both mono 12.5px, then the link chips beneath. Below `sm`
  the rail folds under the title as a horizontal `year · role` run and the
  chips move to a full-width row.

**Density** — `density="full"` shows the cover plate and tagline (the
`#projects` section). `density="compact"` drops both (archive, home preview).

**No cover image** — the plate renders the project title at
`--font-display` 1.25rem weight 600 at `opacity: 0.2` in `--accent-on-canvas`,
bottom-left, on `--zone-canvas-alt`.

## Interactions & behavior

**Star field cursor spotlight.** Two copies of the same seeded field. The
resting layer is `--hero-star`, each dot animating `hero-twinkle` — opacity
0.28→1 and `scale(0.9)`→`scale(1)` — over its own `2.9–7.1s` duration with a
`0–6s` delay. The lit layer is the same positions in `--hero-star-lit`, each
dot 1.7px larger with a `0 0 9px var(--hero-star-glow)` halo, revealed through
`mask-image: radial-gradient(circle 200px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.35) 55%, transparent 80%)`.
`--mx` / `--my` are set inline in px from a `pointermove` listener on `window`,
throttled to one `requestAnimationFrame`. The layer's opacity is 0 until the
pointer is inside the hero's bounding rect.

Do **not** add a CSS transition to the lit layer's opacity — an earlier revision
did and it pinned the value at 0, so the spotlight never appeared.

**SSR safety.** Star positions come from a seeded LCG
(`s = (s * 1103515245 + 12345) % 2147483648`, seed `20260907`) evaluated once at
**module scope**, not in the component body — server and client emit identical
markup. `MAX_STARS` is 120 and the field is sliced to `count`, so changing
density never reshuffles positions. Nothing reads `window` during render.

**Reduced motion.** `@media (prefers-reduced-motion: reduce)` sets
`.hero-star { animation: none; opacity: 0.6 }` and `.hero-stars-lit { display: none }`.
`HeroStars` also checks `matchMedia` and skips attaching the listener entirely.

**Row and link targets.** Rows are **not** links — the title is. The `Live` /
`Source` anchors are siblings, never nested inside a row-wide anchor. Every
chip is `min-height: 44px` by default, relaxing to 32px at `min-width: 640px`.
Each carries an `aria-label` naming the project.

**Lead-row exclusivity.** Checking "Lead row on the homepage" in the admin runs
`clearOtherFeatured()` before the write, so exactly one project is ever
flagged. Implementation in `model-changes.md` step 4b.

**Scroll reveal.** The hero keeps the existing `FadeIn` wrapper per element with
staggered delays `0 / 0.05 / 0.1 / 0.15 / 0.2 / 0.25`.

## State

`HeroStars` holds one piece of state: `spot: {x, y} | null` — the pointer
position in px relative to the hero, or `null` when outside. Nothing else in
either component is stateful; both are server components apart from
`HeroStars`, which is `"use client"`.

No data fetching changes. `getData()` in `page.tsx` is untouched.

## Design tokens

Full declarations, both themes, in `globals-tokens.css`. The values:

**Accent — one light blue at two values.** `--accent-bright` `#8CC0E8` (9.8:1
on the dark hero, carries the lit stars), `--accent-strong` `#5D9BC9` (fills,
hover), `--accent-on-canvas` `#2A6A96` (5.3:1 on light canvas),
`--accent-foreground` `#FFFFFF` light / `#0E1218` dark, `--accent-glow` /
`--accent-wash` `rgba(140,192,232,0.18)`.

`--accent` itself is `#2A6A96` on `:root` and `#8CC0E8` on `.dark`, replacing
the old purple `#7C6AF7`. Every existing component that reads `--accent` picks
the blue up automatically — that is intended.

**Hero zone — derived from the theme, not pinned.** Light: ground `#E7EDF5`,
raised `#FFFFFF`, fg `#131820`, muted `#4A5563`, faint `#5C6675`, star
`rgba(42,106,150,0.30)`, star-lit `#2A6A96`. Dark: ground `#0E1218`, raised
`#151A21`, fg `#EEF2F7`, muted `#AEB7C2`, faint `#7F8996`, star
`rgba(190,212,238,0.42)`, star-lit `#8CC0E8`. In both directions the hero sits
one clear step off the canvas, so it still reads as its own plate while the
theme toggle visibly reaches it.

**Canvas zone.** Light: `#F5F7FA` / alt `#EEF1F5` / surface `#FFFFFF`. Dark:
`#161A20` / alt `#1C2129` / surface `#20262F`.

**Lines.** Light: hairline `rgba(19,24,32,0.08)`, default `0.12`, strong
`0.18`. Dark: `rgba(255,255,255,0.06)` / `0.09` / `0.16`.

**Type scale** — weight decreases as size increases; tracking tightens in
proportion. display `clamp(2.75rem, 6.5vw, 4.75rem)`/0.98/`-0.042em`/600 ·
h1 `clamp(2rem, 4vw, 3rem)`/1.04/`-0.032em`/500 · h2 1.75rem/1.12/`-0.026em`/520 ·
h3 1.1875rem/1.28/`-0.014em`/560 · body-lg 1.0625rem/1.62/`-0.008em`/400 ·
body 0.9375rem/1.65/`-0.004em`/400 · meta 0.8125rem mono/1.5/450 ·
label 0.6875rem mono caps/1.4/`+0.14em`/550.

**Rhythm** — `--rhythm: 7rem` symmetric block padding, replacing the current
`.section`'s asymmetric 5rem/3rem. `--rhythm-sm: 4.5rem`, `--rhythm-lg: 10rem`.

**Radius** — 7px chips, 8px buttons, 10px small plates, 12px panels, 14px cards,
999px pills.

**Elevation** — blue-tinted so shadows sit in the accent's family; `--elev-1`
through `--elev-3` plus `--elev-3-hero`, all in `globals-tokens.css`.

## Two changes outside these files

1. **`layout.tsx`** — the hero no longer requests weight 800, so Space
   Grotesk's existing `weight: ["500","600","700"]` is now correct. Previously
   `font-extrabold` forced the browser to synthesise the face, which is what
   made the headline look muddy at display sizes. If you keep `font-extrabold`
   anywhere, add `"800"` to that array.

2. **`RotatingWord.tsx`** — replace `minWidth: "10ch"` with a hidden sizer, so
   the headline stops reflowing every three seconds:

   ```tsx
   const LONGEST = WORDS.reduce((a, b) => (b.length > a.length ? b : a));

   <span className="relative inline-block">
     <span className="font-script invisible" aria-hidden>{LONGEST}</span>
     <span className="absolute inset-0">
       <AnimatePresence mode="wait">{/* unchanged */}</AnimatePresence>
     </span>
   </span>
   ```

   `10ch` is measured against the *body* font, not Dancing Script, so it was
   both wrong and unstable.

## One naming judgement to make

`status: "featured" | "archived"` already exists and decides which shelf a
project sits on. The new `featured: boolean` decides which single project takes
the lead row. Both names now live on one model. If that reads badly, rename the
new field to `isLead` — it is referenced in exactly two places
(`ProjectLedger.tsx` and the admin form).

## Assets

None. No images, no icon files. Icons are `lucide-react` (`ArrowUpRight`,
`FileText`, `ExternalLink`), already a dependency; the GitHub mark is an inline
`<svg>` inside `ProjectLedger.tsx`. Project cover images come from
`project.coverImage` at runtime. Fonts are unchanged — Space Grotesk, Geist,
Geist Mono, Dancing Script, all already loaded in `layout.tsx`.

## Files in this bundle

| Path | What it is |
| --- | --- |
| `components/Hero.tsx` | Production. → `src/components/sections/hero/Hero.tsx` |
| `components/HeroStars.tsx` | Production, new. → `src/components/sections/hero/HeroStars.tsx` |
| `components/ProjectLedger.tsx` | Production, new. → `src/components/sections/projects/ProjectLedger.tsx` |
| `globals-tokens.css` | Paste into `src/app/globals.css` — not a new file |
| `model-changes.md` | Copy-paste diffs for 5 files + the backfill. Do first |
| `sync-checklist.md` | Condensed version of the above, with the rationale |
| `reference/Redesign Blueprint.dc.html` | Design reference. Open in a browser (`support.js` sits beside it) |
