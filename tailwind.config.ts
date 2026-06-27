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
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '700' }],
        'h1':      ['3rem', { lineHeight: '1.1',  letterSpacing: '-0.03em', fontWeight: '600' }],
        'h2':      ['2rem', { lineHeight: '1.2',  letterSpacing: '-0.02em', fontWeight: '600' }],
        'h3':      ['1.5rem',{ lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        'h4':      ['1.25rem',{ lineHeight: '1.4',fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'sm':  '6px',
        DEFAULT: '8px',
        'md':  '10px',
        'lg':  '14px',
        'xl':  '18px',
        '2xl': '24px',
      },
      boxShadow: {
        'glow':    '0 0 24px var(--accent-glow)',
        'glow-sm': '0 0 12px var(--accent-glow)',
        'card':    '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px var(--border)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px var(--border-strong)',
      },
      animation: {
        'fade-in':     'fadeIn 0.25s ease-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config
