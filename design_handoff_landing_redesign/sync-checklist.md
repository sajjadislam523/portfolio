# Handoff — Redesign Blueprint §01 / §02 / §05 / §06

Rev 2. Written against `redesign/single-page-landing` @ `d694e50b9870`.

Since rev 1: the accent is a light blue at two values, the hero grid is a star
field, the hero ground is derived from the theme instead of pinned to black, the
project ledger is rebuilt, and your three answers are applied — `role` is
required, `featured: boolean` picks the lead row by hand, and the client rail is
gone.

| File | Goes to | Notes |
| --- | --- | --- |
| `globals-tokens.css` | paste into `src/app/globals.css` | Two blocks into the existing `:root` and `.dark`, then the `@layer components` block. **Replaces** the values of `--accent`, `--accent-glow`, `--accent-foreground`. Drops `.bg-grid` / `.bg-grid-ink`; adds `.zone-hero`, the star-field rules, `.ledger-chip`. |
| `HeroStars.tsx` | `src/components/sections/hero/HeroStars.tsx` | New. Client component; seeded at module scope so SSR and client match. |
| `Hero.tsx` | `src/components/sections/hero/Hero.tsx` | Then render `<Hero …/>` from `(public)/page.tsx` in place of the inline hero `<section>`, and delete the grid div, the radial glow and both orbs. |
| `ProjectLedger.tsx` | `src/components/sections/projects/ProjectLedger.tsx` | Replaces the `md:grid-cols-2` `ProjectCard` grid **and** the inline archive list. `ProjectCard.tsx` becomes unused on the homepage. |
| `model-changes.md` | — | The `role` + `featured` edits: types, model, validations, actions, admin form, and the backfill. Do this first; the ledger needs `role`. |

## Your three answers, as applied

1. **`role: string`** — required on `IProject`, the Mongoose model, the Zod
   schema and the admin form. The ledger's meta rail prints it verbatim beside
   the year, with no fallback. Existing documents need the one-line backfill in
   `model-changes.md` §6.
2. **`featured: boolean`** — hand-picked in the admin with a checkbox; setting it
   clears the flag on every other project, so there is always exactly one lead.
   `ProjectLedger` reads it directly and ignores `order` for the lead row.
3. **Client rail** — dropped. `Hero` no longer takes a `clients` prop and the
   plate ends on the CTA row; the bottom rule and the "Shipped for" strip are
   gone from both the component and §05 of the blueprint.

## Two changes outside these files

1. **`layout.tsx`** — the hero no longer asks for weight 800, so Space Grotesk's
   existing `weight: ["500","600","700"]` is now correct. If you would rather
   keep `font-extrabold`, add `"800"` to that array; leaving it as-is means the
   browser synthesises the face.

2. **`RotatingWord.tsx`** — swap `minWidth: "10ch"` for a hidden sizer so the
   headline stops reflowing every three seconds:

   ```tsx
   const LONGEST = WORDS.reduce((a, b) => (b.length > a.length ? b : a));

   <span className="relative inline-block">
     {/* reserves the widest word's real rendered width */}
     <span className="font-script invisible" aria-hidden>{LONGEST}</span>
     <span className="absolute inset-0">
       <AnimatePresence mode="wait">{/* …unchanged… */}</AnimatePresence>
     </span>
   </span>
   ```

## Usage

```tsx
// (public)/page.tsx
<Hero
  settings={settings}
  latestRole={latestRole}
  experienceLabel={experienceLabel}
  projectsLabel={projectsLabel}
  stackLabel={stackLabel}
  groupedSkills={groupedSkills}
/>

<section id="projects" className="section zone-canvas">
  <div className="container">
    {/* …section label + h2… */}
    <ProjectLedger projects={featuredProjects} density="full" leadRow />

    {archivedProjects.length > 0 && (
      <div className="mt-16">
        {/* …Archive rule… */}
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

`getData()` needs no change — `featuredProjects` / `archivedProjects` already
split on `status`, and the ledger finds the lead inside the featured set.

## Sync checklist

1. `model-changes.md` steps 1–5, then the backfill in step 6.
2. Paste `globals-tokens.css` into `globals.css`; delete the old `.bg-grid`
   rule and the `--grid-opacity` / `--hero-glow-opacity` vars it read.
3. Copy `HeroStars.tsx`, `Hero.tsx`, `ProjectLedger.tsx` into place.
4. In `page.tsx`: swap the hero `<section>` for `<Hero />`, swap the
   `ProjectCard` grid and the archive list for `<ProjectLedger />`, drop the
   now-unused `Image` / `ArrowUpRight` / `ProjectCard` imports.
5. Set each project's role and check the lead project in the admin.
