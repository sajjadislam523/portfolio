# Engineering notes

## Available skills (`.claude/skills/`)

| Skill | What it actually is |
| --- | --- |
| `ui-ux-pro-max` | Real design-intelligence database (styles, palettes, font pairings, UX rules) queried via `scripts/search.py`. Useful for picking/validating design tokens and running the accessibility/interaction/layout checklist in its `SKILL.md`. |
| `frontend-design` | Anthropic's built-in guidance for building distinctive, non-generic UI. Reference when designing new pages or components from scratch. |
| `code-reviewer`, `senior-frontend`, `senior-backend` | Their `scripts/*.py` are unimplemented boilerplate stubs (always report zero findings) — don't run them expecting real analysis. Their value is the markdown under `references/` (checklists, antipatterns, security/perf practices); read those and apply them manually, the way this pass did. |

## 2026-09-05 audit

Ran a manual review against the checklists in the skills above (UX/accessibility from `ui-ux-pro-max`, security practices from `senior-backend`, React/Next.js correctness from `senior-frontend`, plus `tsc --noEmit`, `eslint`, and `npm audit`). Fixed:

- **`ConfirmDialog.tsx`** — refactored from ref-reads-during-render to a `useEffect`-driven open/close, fixing a real `react-hooks/refs` lint error (build-breaking under the current React 19 rules).
- **Lint/type cleanliness** — eliminated all remaining ESLint errors and warnings (`any` types in `resumeActions.ts` and `[slug]/page.tsx`, unescaped entities, ternary-as-statement in the three admin `*Manager.tsx` delete handlers, dead imports/vars). `npm run lint` and `npx tsc --noEmit` are both clean.
- **Stale-state bug in `SettingsForm.tsx`** — the general settings form held its own `resumeUrl` state and resubmitted it on every save, silently reverting whatever `<ResumeManager>` (a separate, independently-persisting flow) had last set as the active resume. `resumeUrl` is no longer read or written by the settings form or `updateSiteSettings`; `<ResumeManager>` is its sole owner.
- **Dead code** — deleted `src/features/certification/` (singular), an unused duplicate of `src/features/certifications/actions.ts` that nothing imported.
- **`getMessages()`** in `contact/actions.ts` now calls `requireSession()` like every other private-data accessor in the codebase. It was previously relying solely on the `(protected)` layout's auth check — not a live vulnerability, but inconsistent with the rest of the codebase's defense-in-depth pattern.
- **Dependencies** — `npm audit` found 6 vulnerabilities (2 moderate, 4 high) in `next`'s bundled `postcss`, `sharp`, and `undici`. Bumped `next` 16.2.9 → 16.3.4 (patch release, same major) and `eslint-config-next` to match. `npm audit` now reports 0 vulnerabilities. `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass on the updated version.
- **`MessagesInbox.tsx`** — delete/archive/mark-read actions had no error feedback; added toast feedback consistent with the pattern used in the other admin `*Manager.tsx` components.

No open priority items from this pass. The previous priority-fix list (hero typography, ghost button border, `h-screen` on the experience page, accent-color consistency, section padding, etc.) was fully implemented in commit `3c61094` and has been removed from this file.

Note: the `SettingsForm.tsx` / `updateSiteSettings` reference above is now historical. Commit `925cbf5` ("redesign the admin CMS into a real content-management system") replaced that single settings form with dedicated pages/forms — `ProfileForm`, `HeroForm`, `SocialLinksForm`, `SeoForm`, `ResumeManager`, `MediaManager`, `ExploringManager`, and a slimmed-down `SystemSettingsPanel` for what's left (the availability toggle) — organized under `AdminSidebar.tsx`'s four groups (Content / Media / Site / System) plus a standalone Dashboard. `src/features/settings/actions.ts` now exports one server action per concern (`updateProfile`, `updateHero`, `updateSocialLinks`, `updateSeo`, `updateAvailability`, `updateOgImage`) instead of one combined `updateSiteSettings`. `README.md`'s admin-panel tables and project-structure tree have been re-synced to this structure as of 2026-09-10.

## 2026-09-10 index & documentation pass

Indexed the full `src/` tree against `README.md` and found it had drifted significantly behind the `925cbf5` admin CMS redesign — the README still described the pre-redesign six-section admin (Projects/Experience/Skills/Certifications/Messages/Settings) and a project-structure tree missing `profile/`, `hero/`, `exploring/`, `media/`, `resume/`, `navigation/`, `social-links/`, `seo/`. Updated `README.md`'s Features, Admin CMS, Admin panel, and Project structure sections to match the current `AdminSidebar.tsx` grouping and the actual `src/features/*` action modules. Also verified `src/app/globals.css` (the design-system source of truth) against its own header comment and found no drift — every token section it claims to have (color ramp, motion, shadows, radius scale, component classes) is present and current; the two places with hardcoded hex colors outside the token system (`HeroVisual.tsx` / `ProjectPreview.tsx` traffic-light dots, `ProjectGallery.tsx` white-on-scrim controls) are pre-existing, already commented as deliberate exceptions (real-world OS-chrome color, always-white text over a photo regardless of theme), and were left as-is rather than "fixed" into tokens.

The public site (`src/app/(public)/`) has an established art direction:
**Cinematic Technical / Sci-Fi Editorial.** A near-black environment lit by
one cold blue accent used as a light source, not a decoration; strong,
oversized typography as the primary hierarchy tool; restrained monospace
technical metadata; subtle atmospheric lighting (never a big glow); editorial,
asymmetric spacing; thin low-contrast borders; minimal surface treatment (no
heavy cards or glassmorphism); understated Motion — one-time entrance
reveals plus small, purposeful hover feedback, never continuous or decorative
animation.

The tokens in `src/app/globals.css` (`:root`, `.dark`, `@theme inline`) are
the actual source of truth, not this description — read them before adding a
color, radius, shadow, or spacing value, and reuse an existing token rather
than inventing a new one.

Before adding or modifying any component on the public site, check:

1. Does it belong to this visual language?
2. Does it improve hierarchy?
3. Does it add useful interaction?
4. Is it visually consistent with existing components?
5. Could the design be stronger without it?

Do not introduce purple/rainbow gradients, heavy glassmorphism, neon glow,
3D objects, particle effects, excessive rounded "cards," pill-badge overuse,
or an animation style that doesn't match the rest of the site's restrained,
one-time-reveal-plus-quiet-hover motion language — regardless of how good it
looks in isolation or in a component-library demo. When in doubt, prefer
removing a visual element over adding one; that has been the deciding rule
through every redesign pass so far, and a 2026-09-09 QA pass already used it
to delete a marquee component and an unused shadcn `Card` that had drifted
from this direction.

## 2026-09-11 session — navigation, responsive QA, production audit, favicon

Five passes in one session, each building on the last:

- **Global navigation redesign** — replaced the previous navbar with a
  minimal HUD command bar (`NavClient.tsx`): a three-zone grid (monogram /
  centered index-numbered links / instrument cluster), a `layoutId`-animated
  active-link indicator, scroll-aware translucency, and a full-screen mobile
  overlay with its own reveal choreography. A follow-up polish pass trimmed
  redundant chrome (a section counter, a boxed theme toggle) and tightened
  the mobile menu's animation from three beats to two. Introduced
  `Logo.tsx` — the reusable monogram component the favicon (below) now
  derives from.
- **Responsive/mobile QA pass** — audited 320–1440px and fixed real
  breakpoint bugs: the nav logo's touch target was under 44px; the hero
  scroll-cue overlapped `HeroVisual`'s stats row across the entire
  640–1023px band (it's `hidden` below `lg` now, matching where the hero
  stops being two-column); the About section's paragraph-length statement
  used the hero's display type scale and filled most of one mobile screen
  on its own (now `text-h2` below `sm`); the project detail page's title +
  year badge didn't wrap, overflowing at 320–390px for single-word titles.
- **Production-readiness audit** — found and fixed: unpublished projects
  were reachable via direct `/projects/[slug]` URL despite being correctly
  filtered from the listing; the admin's "Lead row on the homepage" toggle
  (`project.featured`) did nothing on the public site (now wired to sort
  that project first and render it at 16:9, matching what the admin copy
  already promised — no live project currently has the flag set, so this
  changed nothing about today's rendered output); the homepage `<title>`
  was duplicated because its own complete title still got the root
  layout's `%s | Sajjadul Islam` template applied (fixed with
  `title.absolute`); `settings?.seo.title` was missing a `?.` before
  `.title` in both the homepage and the admin SEO form itself — the second
  one would have locked the owner out of the one page that fixes it;
  `generateMetadata` and the page body were independently calling the same
  5-query data loader (10 DB queries per homepage request, now wrapped in
  `cache()`); no `error.tsx` existed anywhere; removed 15 confirmed-unused
  dependencies (all `@radix-ui/*`, `class-variance-authority`, `cmdk`,
  `react-dropzone` — zero imports anywhere in `src/`, consistent with the
  "shadcn is for functional primitives only" rule below).
- **Hero terminal responsive fix** — `HeroVisual` (the floating code panel)
  was visible at every width, but the grid only puts it beside the text at
  `lg` (1024px); below that it stacked in its own full-width row under all
  the text content, and with an unconditional `min-h-screen` this made the
  hero ~1235px tall on a 375px phone before the next section even started.
  Now hidden below `lg` (matching `ScrollCue`'s existing cutoff, for the
  same reason) with `min-h-screen` restricted to `lg:` too, so mobile
  height is content-driven. Desktop is pixel-identical to before.
- **Favicon** — `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico` now
  derive from `Logo.tsx`'s actual monogram (bordered box, "S", opposing
  corner-tick brackets) instead of a generic unrelated placeholder. The "S"
  itself was extracted from JetBrains Mono Bold's real glyph outline via
  `opentype.js` rather than hand-approximated. `icon.svg` adapts dark/light
  via an embedded `prefers-color-scheme` media query — one file, not a
  parallel light/dark asset system. Added the `viewport` export
  (`themeColor` light/dark pair) to `layout.tsx` — `metadata.themeColor` is
  deprecated as of Next 14; this project's own
  `node_modules/next/dist/docs` was the source for the current API, not
  training-data memory (see the NOT-the-Next.js-you-know block below).

Every pass was verified against real production data (this dev environment
connects to the live MongoDB Atlas cluster, not a local database — no test
data was ever written to it) and a local production build (`next build` +
`next start`), not just `next dev`. `tsc --noEmit`, `eslint`, and
`npm audit` are all clean as of this entry.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
