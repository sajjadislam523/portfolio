'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { createSkill, updateSkill, deleteSkill } from '@/features/skills/actions'
import { FormField, inputClass, selectClass } from '@/components/admin/FormField'
import { AdminButton } from '@/components/admin/AdminButton'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { ISkill, SkillCategory } from '@/types'

const CATEGORIES: SkillCategory[] = ['frontend', 'backend', 'database', 'devops', 'tooling']

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: 'Frontend',
  backend:  'Backend',
  database: 'Database',
  devops:   'DevOps',
  tooling:  'Tooling',
}

const PROFICIENCY_COLORS = {
  expert:     { bg: 'rgba(124,106,247,0.12)', color: '#7C6AF7', border: 'rgba(124,106,247,0.3)' },
  proficient: { bg: 'rgba(56,189,248,0.12)',  color: '#38BDF8', border: 'rgba(56,189,248,0.3)' },
  familiar:   { bg: 'var(--bg-subtle)',        color: 'var(--text-tertiary)', border: 'var(--border)' },
}

export function SkillsManager({ skills }: { skills: ISkill[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ISkill | null>(null)

  const grouped = CATEGORIES.reduce<Record<SkillCategory, ISkill[]>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat)
    return acc
  }, {} as Record<SkillCategory, ISkill[]>)

  return (
    <div className="flex flex-col gap-6">
      {CATEGORIES.map((cat) => (
        <div key={cat}>
          <h3
            className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {CATEGORY_LABELS[cat]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {grouped[cat].map((skill) => (
              <SkillPill
                key={skill._id}
                skill={skill}
                onEdit={() => { setEditing(skill); setShowForm(false) }}
              />
            ))}
          </div>
        </div>
      ))}

      {editing && (
        <SkillForm
          skill={editing}
          onClose={() => setEditing(null)}
          action={(fd) => updateSkill(editing._id, fd)}
          submitLabel="Save changes"
        />
      )}

      {showForm && !editing ? (
        <SkillForm
          onClose={() => setShowForm(false)}
          action={createSkill}
          submitLabel="Add skill"
        />
      ) : (
        !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm w-full transition-colors"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px dashed var(--border)',
              color: 'var(--text-tertiary)',
            }}
          >
            <Plus className="w-4 h-4" /> Add skill
          </button>
        )
      )}
    </div>
  )
}

function SkillPill({ skill, onEdit }: { skill: ISkill; onEdit: () => void }) {
  const [isPending, startTransition] = useTransition()
  const colors = PROFICIENCY_COLORS[skill.proficiency]

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}
    >
      {skill.name}
      <button onClick={onEdit} className="opacity-60 hover:opacity-100 transition-opacity ml-0.5">
        <Pencil className="w-3 h-3" />
      </button>
      <ConfirmDialog
        title="Remove skill"
        description={`Remove "${skill.name}" from your stack?`}
        onConfirm={() =>
          startTransition(async () => {
            const r = await deleteSkill(skill._id)
            r.error ? toast.error(r.error) : toast.success('Skill removed')
          })
        }
      >
        {(open) => (
          <button
            onClick={open}
            disabled={isPending}
            className="opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </ConfirmDialog>
    </div>
  )
}

function SkillForm({
  skill,
  onClose,
  action,
  submitLabel,
}: {
  skill?: ISkill
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
        toast.success(skill ? 'Skill updated' : 'Skill added')
        onClose()
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-4 flex flex-col gap-4"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent)' }}
    >
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {skill ? 'Edit skill' : 'Add skill'}
      </p>

      <div className="grid grid-cols-3 gap-3">
        <FormField label="Name" name="name" required>
          <input name="name" defaultValue={skill?.name} placeholder="React.js" className={inputClass} required />
        </FormField>

        <FormField label="Category" name="category" required>
          <select name="category" defaultValue={skill?.category ?? 'frontend'} className={selectClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Proficiency" name="proficiency" required>
          <select name="proficiency" defaultValue={skill?.proficiency ?? 'proficient'} className={selectClass}>
            <option value="expert">Expert</option>
            <option value="proficient">Proficient</option>
            <option value="familiar">Familiar</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Projects" name="projects" hint="Comma-separated slugs">
          <input
            name="projects"
            defaultValue={skill?.projects.join(', ')}
            placeholder="newssphere, traceback"
            className={inputClass}
          />
        </FormField>
        <FormField label="Order" name="order" hint="Lower = appears first">
          <input name="order" type="number" defaultValue={skill?.order ?? 0} min={0} className={inputClass} />
        </FormField>
      </div>

      <div className="flex gap-2">
        <AdminButton type="submit" loading={isPending}>{submitLabel}</AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onClose}>Cancel</AdminButton>
      </div>
    </form>
  )
}
