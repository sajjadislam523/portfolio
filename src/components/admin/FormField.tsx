import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  name: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  name,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={name}
        className="text-sm font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: 'var(--accent)' }}>*</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs" style={{ color: '#EF4444' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// Shared input style — use with style prop to pick up theme vars
export const inputClass =
  'w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)]'

export const textareaClass =
  'w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] resize-y min-h-[100px]'

export const selectClass =
  'w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--accent)]'
