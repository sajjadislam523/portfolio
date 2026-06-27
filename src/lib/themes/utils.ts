import { themes, defaultTheme, buildThemeCSS } from './tokens'
import type { ThemeName, ThemeTokens } from '@/types'

export { themes, defaultTheme, buildThemeCSS }

export function getThemeTokens(name: ThemeName): ThemeTokens {
  return themes[name] ?? themes[defaultTheme]
}

// Returns an inline <style> string for server-side rendering.
// Inject this into the <head> via dangerouslySetInnerHTML to prevent
// the flash-of-unstyled-content on first load.
export function getThemeStyleTag(name: ThemeName): string {
  return buildThemeCSS(getThemeTokens(name))
}

// Applies theme CSS variables directly to document.documentElement.
// Called on the client after hydration when theme changes.
export function applyThemeToDOM(name: ThemeName): void {
  if (typeof document === 'undefined') return
  const tokens = getThemeTokens(name)
  const root = document.documentElement

  const kebab = (s: string) => s.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)

  for (const [key, value] of Object.entries(tokens)) {
    root.style.setProperty(`--${kebab(key)}`, value)
  }

  root.setAttribute('data-theme', name)
}

export const THEME_NAMES: ThemeName[] = [
  'midnight',
  'ocean',
  'sunset',
  'matrix',
  'aurora',
]

export const THEME_LABELS: Record<ThemeName, string> = {
  midnight: 'Midnight',
  ocean: 'Ocean',
  sunset: 'Sunset',
  matrix: 'Matrix',
  aurora: 'Aurora',
}
