import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // All colors reference CSS custom properties set by the theme system.
      // This means Tailwind classes like bg-primary, text-accent etc
      // automatically respond to theme switches.
      colors: {
        primary:    'var(--bg-primary)',
        secondary:  'var(--bg-secondary)',
        elevated:   'var(--bg-elevated)',
        subtle:     'var(--bg-subtle)',
        border:     'var(--border)',
        'border-strong': 'var(--border-strong)',
        foreground: 'var(--text-primary)',
        muted:      'var(--text-secondary)',
        faint:      'var(--text-tertiary)',
        accent:     'var(--accent)',
        'accent-glow': 'var(--accent-glow)',
        'accent-fg':   'var(--accent-foreground)',
      },
      fontFamily: {
        // Two voices only: `sans` for reading copy, `display` for headings
        // and numerals, `mono` as the technical/label accent that shows up
        // in eyebrows, meta rows and the index-number motif. No third
        // decorative face — see the 2026-09-08 design-system pass.
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Fira Code', 'monospace'],
        display: ['var(--font-display)', 'var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      // Modular type scale — weight steps DOWN as size steps up, tracking
      // tightens in proportion. The hero headline (`display`) is the one
      // deliberately oversized element on the page; everything else is
      // built to support it, not compete with it.
      fontSize: {
        'display': ['clamp(3.75rem, 2.75rem + 4vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.045em', fontWeight: '600' }],
        'h1':      ['clamp(2.5rem, 1.75rem + 3vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '600' }],
        'h2':      ['clamp(1.875rem, 1.5rem + 1.5vw, 2.75rem)', { lineHeight: '1.12', letterSpacing: '-0.03em', fontWeight: '600' }],
        'h3':      ['1.375rem', { lineHeight: '1.25', letterSpacing: '-0.016em', fontWeight: '560' }],
        'h4':      ['1.125rem', { lineHeight: '1.35', letterSpacing: '-0.008em', fontWeight: '550' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.62', letterSpacing: '-0.006em' }],
        'body':    ['0.9375rem', { lineHeight: '1.65' }],
        'small':   ['0.8125rem', { lineHeight: '1.5' }],
        'eyebrow': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.16em', fontWeight: '550' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      // Radius scale lives in globals.css (`@theme inline`, --radius-*) so
      // there is exactly one source of truth for `rounded-*` utilities —
      // no separate JS scale to drift out of sync with the CSS tokens.
      boxShadow: {
        'glow':    '0 0 24px var(--accent-glow)',
        'glow-sm': '0 0 12px var(--accent-glow)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}

export default config
