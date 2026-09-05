import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  sub?: string
}

export function StatCard({ label, value, icon: Icon, sub }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--accent-glow)' }}
      >
        <Icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </p>
        <p
          className="text-2xl font-semibold tracking-tight mt-0.5"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}
