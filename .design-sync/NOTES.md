# design-sync notes for this repo

## What this repo actually is

This is a private Next.js portfolio app (`package.json` name `portfolio`), not a
publishable component library. It has no `main`/`module`/`exports`/`types`
field, no `dist/`, and no Storybook. The sync runs in synth-entry mode,
scanning source files directly for PascalCase exports.

## Scope: why only 12 components are synced

A first scan of the full `src/` tree found ~39 PascalCase exports. Most were
excluded because they fundamentally cannot render outside this specific
Next.js app, not because of a fixable build issue:

- **Next.js route `page.tsx` files** — async Server Components that fetch
  data; not meant to be imported standalone.
- **Admin CRUD screens** (`CertificationsManager`, `ExperienceManager`,
  `MessagesInbox`, `ProjectForm`, `SettingsForm`, `SkillsManager`,
  `ResumeManager`, `FileUpload`, `DeleteProjectButton`) — wired directly to
  Next.js Server Actions (`"use server"`), which themselves import Mongoose/
  the MongoDB driver. A plain esbuild bundle can't handle `"use server"` as a
  compiler directive — it just inlines the real function body, dragging in
  `fs`/`net`/`tls`/`dns`/`crypto`/etc. and failing to bundle for a browser
  target.
- **`NavClient`, `CommandPalette`, `SiteFooter`** — use `next/navigation`
  hooks (`usePathname`, `useRouter`) that throw outside a mounted Next.js App
  Router.
- **`TechMarquee`, `ProjectCard`** — import `next/image`/`next/link`, which
  pull in large chunks of Next's internal framework code (routing, image
  optimization config, i18n) referencing dozens of `process.env.*` values
  with no browser shim. This crashes the bundle at evaluation time (`Reference
  Error: process is not defined`) before ANY component can attach to
  `window.PortfolioDS` — it's not per-component, it kills the whole bundle.
  Swapping in plain `<img>`/`<a>` tags was considered and rejected: that
  would be rewriting the component, not composing with it, which is out of
  scope for this skill.

The synced 12 (all under `.design-sync/src-subset/`, a curated copy — see
below) are the self-contained subset with a clean dependency closure: admin UI
primitives (`AdminButton`, `FormField`, `StatCard`, `ConfirmDialog`), motion
wrappers (`ScrollReveal`/`FadeIn`/`StaggerContainer`/`StaggerItem`), and
portfolio-section pieces (`HeroVisual`, `RotatingWord`, `ExperienceTimeline`,
`SkillTabs`).

## Why `cfg.srcDir` points at `.design-sync/src-subset`, not `src/`

The synth-entry mode's bundle entry does `export * from <every .tsx/.jsx file
under srcRoot>` **unconditionally** — `componentSrcMap: {X: null}` only prunes
the *reported component list*, not what gets swept into the bundle entry
file. Since admin manager components transitively pull in Mongoose et al.
(see above), pointing `srcDir` at the real `src/` tree fails to bundle no
matter which components are excluded from the list. The fix: `.design-sync/
src-subset/` is a **curated copy** (not a rewrite — byte-identical to the
real files at copy time) of just the 12 wanted components plus their clean
dependency closure (`lib/utils.ts`, `types/index.ts`,
`components/sections/stack/constants.ts`). `.design-sync/tsconfig.subset.json`
remaps `@/*` to `./src-subset/*` so the copied files' imports still resolve.

**Re-sync risk**: if the real components under `src/` change, `.design-sync/
src-subset/` must be re-copied by hand (`cp` the same file list — see the
list above) before re-running the build, or the sync will silently ship
stale component code. There is no automated mechanism keeping the subset in
sync with `src/`.

## `node_modules/portfolio` symlink

The converter's non-`--entry` path resolves the package as
`<node_modules>/<pkg>/package.json`, which never exists for a repo that
doesn't self-install. Fixed with `ln -sfn .. node_modules/portfolio` (a
self-referencing symlink so the package "resolves" to the repo root). This
symlink is NOT committed (node_modules is gitignored) — **recreate it on every
fresh clone / CI run** before building: `ln -sfn .. node_modules/portfolio`.

## No compiled CSS or fonts exist as static build output — both are generated

This repo's styling is Tailwind v4, compiled at Next.js build/dev time; there
is no static `dist/*.css`. `.design-sync/generated/compiled.css` is produced
by running PostCSS + `@tailwindcss/postcss` directly against
`src/app/globals.css` (which itself has an `@config "../../tailwind.config.ts"`
directive — without that this project's entire custom theme, added in a
separate piece of work, silently does nothing; see git history). Regenerate
with:

```js
// .design-sync/generated/regenerate-css.mjs (not committed — recreate if missing)
import postcss from 'postcss';
import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/postcss';
const input = fs.readFileSync('src/app/globals.css', 'utf8');
const result = await postcss([tailwindcss({ base: process.cwd() })]).process(input, {
  from: path.resolve('src/app/globals.css'),
});
fs.writeFileSync('.design-sync/generated/compiled.css', result.css);
```
Run from the repo root (needs `postcss`/`@tailwindcss/postcss`, both already
repo deps). After regenerating, **the `--font-*` variable block at the bottom
of `compiled.css` must be re-appended by hand** (see next section) — the
PostCSS run overwrites the whole file.

**Re-sync risk**: if `globals.css`'s custom properties change (new tokens,
renamed vars), this generated file goes stale until manually regenerated.
There is no watch/hook tying the two together.

## Fonts: sourced from this repo's own next/font build cache, not fabricated

`--font-geist-sans`, `--font-geist-mono`, `--font-display` (Space Grotesk),
`--font-script` (Dancing Script) are all `next/font`-managed and normally
only materialize as real files inside `.next/` after a build/dev run. The
actual `@font-face` rules + woff2 files were harvested from
`.next/dev/static/chunks/*.module.css` and `.next/dev/static/media/*.woff2`
(run `npm run dev` once and let it compile the homepage if `.next/dev` is
missing) into `.design-sync/generated/fonts.css` +
`.design-sync/generated/media/`, wired via `cfg.extraFonts`.

The CSS variable *definitions* (`--font-geist-sans: "GeistSans", ...` etc.)
had to be appended directly to `.design-sync/generated/compiled.css` instead
of living in `fonts.css` — `extraFonts` processing (`lib/css.mjs`) only
regex-extracts `@font-face { ... }` blocks and discards everything else, so a
`:root` block placed in `fonts.css` is silently dropped.

**Accepted substitutes (recorded per the skill's guidance):** the shipped CSS
also references "Inter", "Fira Code", "Roboto Mono" as distant fallback
families (behind the always-shipped Geist/Space Grotesk/Dancing Script
primaries) plus the `local(Arial)`-based metric-matched fallback faces
("GeistSans Fallback" etc., which validate's font checker doesn't recognize
as "shipped" since they have no url() — this is a checker limitation, not a
real gap, those `@font-face` blocks are already correctly present). None of
these are worth sourcing real files for since they're vanishingly unlikely to
ever actually render. Decided without a per-item user round-trip, consistent
with the user's earlier approval of the overall sync approach — flagged here
for visibility.

## Playwright/Chromium

Not previously installed in this environment. `npx playwright install
chromium` (without `--with-deps`, which needs sudo and fails in sandboxed
environments) worked fine for the render check — the default fallback build
for the detected OS was sufficient.

## Known render warns

**`package-capture.mjs`'s review-grading screenshots show blank for
animation-driven components — this is a capture-tool timing limitation, not
a component defect.** `settle()` (in `.ds-sync/package-capture.mjs`) only
waits for `document.fonts.ready` and image `decode()` before screenshotting;
it does not wait for framer-motion transitions or IntersectionObserver
(`useInView`) callbacks to fire and complete. Affected on this repo:
`FadeIn`, `ScrollReveal`, `StaggerContainer`, `StaggerItem` (all from
`ScrollReveal.tsx`'s `useInView`/CSS-animation reveals), `ExperienceTimeline`
(composes `StaggerContainer`/`StaggerItem` internally), and `SkillTabs` (a
0.2s mount-triggered framer-motion fade on the active tab panel — no
`useInView`, just too fast for the near-instant `settle()`).

Verified independently for each (not just asserted) two ways: (1) a direct
Playwright load of the component's `?story=<name>` URL with an explicit
`waitForTimeout(1500)` shows full, correctly-styled content (real colors,
text, transforms resolved to `opacity: 1; transform: none`); (2)
`package-validate.mjs`'s own product-card screenshot (a different capture
path — the full `<Name>.html` product card, not `package-capture.mjs`'s
per-story `?story=` review sheet) independently shows `ExperienceTimeline`
rendering fully settled and correct.

There is no `cfg.*` knob to extend `package-capture.mjs`'s wait — it has no
config surface at all — and it's a top-level script, not a `lib/<name>.mjs`
adapter, so the `.design-sync/overrides/` fork mechanism doesn't apply to it
either. Graded `good` on all affected cells per user sign-off (asked
explicitly, since grading off-sheet deviates from the documented "grade from
the sheet" process) rather than reverting to floor cards or leaving them
permanently `needs-work` with no real fix available.

**Re-sync risk**: if a re-sync ever re-runs `package-capture.mjs --force` (or
the grade key changes for any of these 6 components), the carried-forward
`good` grade clears and re-grading will hit the same blank sheets again.
Future syncs should re-apply this same reasoning (or actually fix
`package-capture.mjs`'s settle strategy, e.g. an additional fixed
`waitForTimeout` after `page.goto` — a legitimate fork if someone wants to
invest in it) rather than treating the blank sheet as a real regression.
