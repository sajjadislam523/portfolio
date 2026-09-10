'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
} from '@/features/experience/actions'
import { FormField, inputClass, textareaClass } from '@/components/admin/FormField'
import { FormSection } from '@/components/admin/FormSection'
import { AdminButton } from '@/components/admin/AdminButton'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Switch } from '@/components/admin/Switch'
import type { ActionResult } from '@/lib/utils'
import { formatDateRange } from '@/lib/utils'
import type { IExperience } from '@/types'

export function ExperienceManager({ experiences }: { experiences: IExperience[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<IExperience | null>(null)

  return (
    <div className="flex flex-col gap-4">
      {/* List */}
      {experiences.map((exp, i) => (
        <ExperienceRow
          key={exp._id}
          experience={exp}
          isFirst={i === 0}
          isLast={i === experiences.length - 1}
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
  isFirst,
  isLast,
  onEdit,
}: {
  experience: IExperience
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  function run(action: () => Promise<ActionResult>, message: string) {
    startTransition(async () => {
      const r = await action()
      if (r.error) toast.error(r.error)
      else toast.success(message)
    })
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => run(() => reorderExperience(exp._id, 'up'), 'Reordered')}
            disabled={isFirst || isPending}
            className="disabled:opacity-30"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Move up"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => run(() => reorderExperience(exp._id, 'down'), 'Reordered')}
            disabled={isLast || isPending}
            className="disabled:opacity-30"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Move down"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {exp.role}
              <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>
                {' '}— {exp.company}
              </span>
            </p>
            <StatusBadge
              label={exp.published ? 'Published' : 'Draft'}
              tone={exp.published ? 'success' : 'neutral'}
            />
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {formatDateRange(exp.startDate, exp.endDate)} · {exp.location}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() =>
              run(() => updateExperiencePublished(exp, !exp.published), exp.published ? 'Unpublished' : 'Published')
            }
            disabled={isPending}
            className="px-2 py-1 rounded-lg text-xs transition-colors disabled:opacity-50"
            style={{ color: exp.published ? 'var(--text-tertiary)' : 'var(--accent)' }}
          >
            {exp.published ? 'Unpublish' : 'Publish'}
          </button>
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
            onConfirm={() => run(() => deleteExperience(exp._id), 'Deleted')}
          >
            {(open) => (
              <button
                onClick={open}
                disabled={isPending}
                className="p-1.5 rounded-lg disabled:opacity-50"
                style={{ color: 'var(--destructive)' }}
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

// Quick publish/unpublish toggle reuses updateExperience with the full
// existing field set (the action always validates the complete object),
// changing only `published`.
async function updateExperiencePublished(exp: IExperience, published: boolean): Promise<ActionResult> {
  const fd = new FormData()
  fd.set('company', exp.company)
  fd.set('role', exp.role)
  fd.set('location', exp.location)
  fd.set('startDate', exp.startDate.slice(0, 10))
  fd.set('endDate', exp.endDate ? exp.endDate.slice(0, 10) : '')
  fd.set('description', exp.description)
  fd.set('accomplishments', exp.accomplishments.join('\n'))
  fd.set('technologies', exp.technologies.join(', '))
  fd.set('published', published ? 'true' : 'false')
  return updateExperience(exp._id, fd)
}

function ExperienceForm({
  experience,
  onClose,
  action,
  submitLabel,
}: {
  experience?: IExperience
  onClose: () => void
  action: (fd: FormData) => Promise<ActionResult>
  submitLabel: string
}) {
  const [isPending, startTransition] = useTransition()
  const [published, setPublished] = useState(experience?.published ?? true)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('published', published ? 'true' : 'false')
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

      <FormSection title="Role" className="border-b-0 pb-0 gap-3">
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
      </FormSection>

      <FormSection title="Summary" className="border-b-0 pb-0 gap-3">
        <FormField label="Description" name="description">
          <textarea name="description" defaultValue={experience?.description} className={textareaClass} style={{ minHeight: '72px' }} />
        </FormField>

        <FormField label="Achievements" name="accomplishments" hint="One per line">
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
      </FormSection>

      <FormSection title="Publishing" className="border-b-0 pb-0">
        <Switch
          checked={published}
          onChange={setPublished}
          label={published ? 'Published — visible on the public site' : 'Draft — hidden from the public site'}
        />
      </FormSection>

      <div className="flex gap-2">
        <AdminButton type="submit" loading={isPending}>{submitLabel}</AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onClose}>Cancel</AdminButton>
      </div>
    </form>
  )
}
