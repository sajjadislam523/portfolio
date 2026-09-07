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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
