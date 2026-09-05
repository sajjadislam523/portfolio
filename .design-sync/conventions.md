## Theming — CSS custom properties, no provider needed

Every component reads color from CSS custom properties, not hardcoded hex or
Tailwind color classes. There is no theme provider/context to wrap — a light
palette lives on `:root` and a dark palette on `.dark`; toggle theme by
adding/removing a `dark` class on any ancestor element (typically `<html>`
or `<body>`). Components re-render correctly either way with zero prop
changes.

Real tokens (see `styles.css`'s import closure for the full set):

| Token | Use |
|---|---|
| `--bg-primary` / `--bg-secondary` / `--bg-elevated` / `--bg-subtle` | page background, section tint, card surface, hover/recessed surface |
| `--border` / `--border-strong` | default and emphasized borders |
| `--text-primary` / `--text-secondary` / `--text-tertiary` | heading/body, secondary copy, muted/meta text |
| `--accent` / `--accent-glow` / `--accent-foreground` | brand color, its translucent glow (halos, active-state backgrounds), text-on-accent |
| `--success` / `--success-glow` | positive/current-state indicators (e.g. an in-progress badge) |

Apply these via inline `style` (`style={{ color: "var(--text-primary)" }}`),
matching how every synced component is written — not via a CSS-in-JS theme
object or styled-components.

## Typography

Three font-family variables, each with a real fallback stack already baked
in — reference them directly, don't hardcode a font name:

- `--font-geist-sans` — body/default text.
- `--font-geist-mono` — code, timestamps, tag-like labels (Tailwind's
  `font-mono` utility resolves to this).
- `--font-display` (Space Grotesk) — headings.
- `--font-script` (Dancing Script) — a decorative cursive accent for a single
  emphasized word or short phrase, never body copy (Tailwind's `font-script`
  utility resolves to this — see `RotatingWord` for the reference usage).

## Layout and spacing — Tailwind utility classes

Structure, spacing, radius, and flex/grid layout are plain Tailwind
utilities (`flex`, `gap-*`, `rounded-*`, `px-*`/`py-*`, `text-sm`, etc.) —
there's no custom spacing/radius scale to relearn. Color always comes from
the CSS variables above, layered on top via inline `style`, never a Tailwind
color class like `bg-blue-500`.

## Where the truth lives

Read `styles.css` (and what it `@import`s — the font faces and the compiled
component stylesheet) before styling anything new; it's the actual shipped
CSS, not a summary. Each component's own `.prompt.md` documents its props.

## Reference composition

A themed card built the way this system's own components are, using the
real tokens rather than inventing new ones:

```tsx
<div
  style={{
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: "12px",
    padding: "1rem",
  }}
  className="flex flex-col gap-2"
>
  <span style={{ fontFamily: "var(--font-display)" }} className="text-lg">
    Section title
  </span>
  <span style={{ color: "var(--text-secondary)" }} className="text-sm">
    Supporting copy in the secondary text color.
  </span>
</div>
```
