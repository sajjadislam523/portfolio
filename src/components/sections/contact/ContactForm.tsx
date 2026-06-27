'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle, Loader2 } from 'lucide-react'
import { submitContactMessage } from '@/features/contact/actions'
import { inputClass, textareaClass } from '@/components/admin/FormField'

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
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}
        >
          <CheckCircle className="w-5 h-5" style={{ color: '#22C55E' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Message sent
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Thanks for reaching out. I'll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Name <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            name="name"
            placeholder="Your name"
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Email <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Subject <span style={{ color: 'var(--accent)' }}>*</span>
        </label>
        <input
          name="subject"
          placeholder="What's this about?"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Message <span style={{ color: 'var(--accent)' }}>*</span>
        </label>
        <textarea
          name="message"
          placeholder="Tell me about your project or question..."
          required
          className={textareaClass}
          style={{ minHeight: '120px' }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60 w-full sm:w-auto"
        style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
