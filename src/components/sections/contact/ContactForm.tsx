'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle, Loader2 } from 'lucide-react'
import { submitContactMessage } from '@/features/contact/actions'

// Underline-only fields, not boxed shadcn-style inputs — the form is meant
// to read as quiet and secondary to the section's own CTA, not as a
// component-library demo. Border color is set via a class (not inline
// style) on both the resting and focus states so the `focus:` variant can
// actually win the cascade instead of losing to an inline style.
// pt-3/pb-3.5 (up from pt-1/pb-2.5) brings the tappable height to ~44px —
// underline-only inputs have no visible box, so the padding has to do all
// the work of a comfortable touch target.
const fieldClass =
  'w-full border-0 border-b border-[var(--line)] bg-transparent px-0 pb-3.5 pt-3 text-base text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)]'
const labelClass = 'font-mono text-[11px] uppercase tracking-wide'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await submitContactMessage(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        setSubmitted(true)
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-8 gap-3 text-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'var(--success-glow)', border: '1px solid color-mix(in srgb, var(--success) 30%, transparent)' }}
        >
          <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Message sent
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={{ color: 'var(--text-tertiary)' }}>
            Name <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            name="name"
            placeholder="Your name"
            required
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelClass} style={{ color: 'var(--text-tertiary)' }}>
            Email <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} style={{ color: 'var(--text-tertiary)' }}>
          Subject <span style={{ color: 'var(--accent)' }}>*</span>
        </label>
        <input
          name="subject"
          placeholder="What's this about?"
          required
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} style={{ color: 'var(--text-tertiary)' }}>
          Message <span style={{ color: 'var(--accent)' }}>*</span>
        </label>
        <textarea
          name="message"
          placeholder="Tell me about your project or question..."
          required
          className={`${fieldClass} resize-y`}
          style={{ minHeight: '96px' }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary-canvas mt-1 w-full disabled:opacity-60 sm:w-auto"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
