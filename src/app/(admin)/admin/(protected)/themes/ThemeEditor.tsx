'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import { updateActiveTheme } from '@/features/settings/actions'
import { themes, THEME_NAMES, THEME_LABELS } from '@/lib/themes/utils'
import { AdminButton } from '@/components/admin/AdminButton'
import type { ThemeName } from '@/types'

export function ThemeEditor({ activeTheme }: { activeTheme: ThemeName }) {
  const [selected, setSelected] = useState<ThemeName>(activeTheme)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      const result = await updateActiveTheme(selected)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Theme changed to ${THEME_LABELS[selected]}`)
        // Apply to current window immediately without full reload
        window.location.reload()
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {THEME_NAMES.map((name) => {
          const t = themes[name]
          const isActive = activeTheme === name
          const isSelected = selected === name

          return (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className="relative rounded-xl p-4 text-left transition-all"
              style={{
                background: t.bgElevated,
                border: `2px solid ${isSelected ? t.accent : t.border}`,
                boxShadow: isSelected ? `0 0 0 1px ${t.accentGlow}` : 'none',
              }}
            >
              {/* Mini preview */}
              <div className="mb-3 rounded-lg overflow-hidden" style={{ background: t.bgPrimary, border: `1px solid ${t.border}`, height: '72px', padding: '10px' }}>
                {/* Fake nav bar */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: t.accent }} />
                  <div className="h-1.5 rounded-full flex-1 opacity-30" style={{ background: t.textSecondary }} />
                </div>
                {/* Fake text lines */}
                <div className="h-2 rounded-full mb-1.5 w-3/4" style={{ background: t.textPrimary, opacity: 0.8 }} />
                <div className="h-1.5 rounded-full w-1/2" style={{ background: t.textSecondary, opacity: 0.4 }} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: t.textPrimary }}>
                    {THEME_LABELS[name]}
                  </p>
                  {isActive && (
                    <p className="text-xs mt-0.5" style={{ color: t.textTertiary }}>
                      Currently active
                    </p>
                  )}
                </div>
                {isSelected && (
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: t.accent }} />
                )}
              </div>

              {/* Accent swatch strip */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl" style={{ background: t.accent }} />
            </button>
          )
        })}
      </div>

      <div
        className="flex items-center gap-3 pt-4 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <AdminButton
          onClick={handleSave}
          loading={isPending}
          disabled={selected === activeTheme}
        >
          Apply theme
        </AdminButton>
        {selected !== activeTheme && (
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Switching to <span style={{ color: 'var(--accent)' }}>{THEME_LABELS[selected]}</span>
          </p>
        )}
      </div>
    </div>
  )
}
