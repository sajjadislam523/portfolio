'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from '@/features/experience/actions'
import { FormField, inputClass, textareaClass } from '@/components/admin/FormField'
import { AdminButton } from '@/components/admin/AdminButton'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { formatDateRange } from '@/lib/utils'
import type { IExperience } from '@/types'

export function ExperienceManager({ experiences }: { experiences: IExperience[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<IExperience | null>(null)

  return (
    <div className="flex flex-col gap-4">
      {/* List */}
      {experiences.map((exp) => (
        <ExperienceRow
          key={exp._id}
          experience={exp}
          onEdit={() => { setEditing(exp); setShowForm(false) }}
        />
      ))}

      {/* Edit form */}
      {editing && (
        <ExperienceForm
          experience={editing}
          onClose={() => setEditing(null)}
          action={(fd) => updateExperience(editing._id, fd)}
          submitLabel="Save changes"
        />
      )}

      {/* Create form */}
      {showForm && !editing ? (
        <ExperienceForm
          onClose={() => setShowForm(false)}
          action={createExperience}
          submitLabel="Add experience"
        />
      ) : (
        !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-colors"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px dashed var(--border)',
              color: 'var(--text-tertiary)',
            }}
          >
            <Plus className="w-4 h-4" /> Add experience
          </button>
        )
      )}
    </div>
  )
}

function ExperienceRow({
  experience: exp,
  onEdit,
}: {
  experience: IExperience
  onEdit: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {exp.role}
            <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>
              {' '}— {exp.company}
            </span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {formatDateRange(exp.startDate, exp.endDate)} · {exp.location}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-lg"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={onEdit} className="p-1.5 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <ConfirmDialog
            title="Delete experience"
            description={`Remove "${exp.role} at ${exp.company}"?`}
            onConfirm={() =>
              startTransition(async () => {
                const r = await deleteExperience(exp._id)
                r.error ? toast.error(r.error) : toast.success('Deleted')
              })
            }
          >
            {(open) => (
              <button
                onClick={open}
                disabled={isPending}
                className="p-1.5 rounded-lg disabled:opacity-50"
                style={{ color: '#EF4444' }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </ConfirmDialog>
        </div>
      </div>

      {expanded && exp.accomplishments.length > 0 && (
        <div
          className="px-4 pb-3 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <ul className="mt-2 flex flex-col gap-1">
            {exp.accomplishments.map((a, i) => (
              <li key={i} className="text-xs flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent)' }}>·</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ExperienceForm({
  experience,
  onClose,
  action,
  submitLabel,
}: {
  experience?: IExperience
  onClose: () => void
  action: (fd: FormData) => Promise<{ success?: boolean; error?: string }>
  submitLabel: string
}) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await action(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(experience ? 'Experience updated' : 'Experience added')
        onClose()
      }
    })
  }

  const startVal = experience?.startDate
    ? new Date(experience.startDate).toISOString().slice(0, 10)
    : ''
  const endVal = experience?.endDate
    ? new Date(experience.endDate).toISOString().slice(0, 10)
    : ''

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-4 flex flex-col gap-4"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent)', boxShadow: '0 0 0 1px var(--accent-glow)' }}
    >
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {experience ? 'Edit experience' : 'Add experience'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Company" name="company" required>
          <input name="company" defaultValue={experience?.company} className={inputClass} required />
        </FormField>
        <FormField label="Role" name="role" required>
          <input name="role" defaultValue={experience?.role} className={inputClass} required />
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <FormField label="Location" name="location" required>
          <input name="location" defaultValue={experience?.location} className={inputClass} required />
        </FormField>
        <FormField label="Start date" name="startDate" required>
          <input name="startDate" type="date" defaultValue={startVal} className={inputClass} required />
        </FormField>
        <FormField label="End date" name="endDate" hint="Leave blank if current">
          <input name="endDate" type="date" defaultValue={endVal} className={inputClass} />
        </FormField>
      </div>

      <FormField label="Description" name="description">
        <textarea name="description" defaultValue={experience?.description} className={textareaClass} style={{ minHeight: '72px' }} />
      </FormField>

      <FormField label="Accomplishments" name="accomplishments" hint="One per line">
        <textarea
          name="accomplishments"
          defaultValue={experience?.accomplishments.join('\n')}
          className={textareaClass}
          style={{ minHeight: '100px' }}
          placeholder="Built 10+ reusable React components&#10;Integrated 5+ REST APIs..."
        />
      </FormField>

      <FormField label="Technologies" name="technologies" hint="Comma-separated">
        <input
          name="technologies"
          defaultValue={experience?.technologies.join(', ')}
          placeholder="React.js, TypeScript, TailwindCSS"
          className={inputClass}
        />
      </FormField>

      <div className="flex gap-2">
        <AdminButton type="submit" loading={isPending}>{submitLabel}</AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onClose}>Cancel</AdminButton>
      </div>
    </form>
  )
}
