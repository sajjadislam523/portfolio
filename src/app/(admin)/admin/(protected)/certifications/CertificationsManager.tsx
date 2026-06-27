'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Award } from 'lucide-react'
import {
  createCertification,
  updateCertification,
  deleteCertification,
} from '@/features/certifications/actions'
import { FormField, inputClass } from '@/components/admin/FormField'
import { AdminButton } from '@/components/admin/AdminButton'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { ICertification } from '@/types'

export function CertificationsManager({ certifications }: { certifications: ICertification[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ICertification | null>(null)

  return (
    <div className="flex flex-col gap-3">
      {certifications.map((cert) => (
        <CertRow
          key={cert._id}
          cert={cert}
          onEdit={() => { setEditing(cert); setShowForm(false) }}
        />
      ))}

      {editing && (
        <CertForm
          cert={editing}
          onClose={() => setEditing(null)}
          action={(fd) => updateCertification(editing._id, fd)}
          submitLabel="Save changes"
        />
      )}

      {showForm && !editing ? (
        <CertForm
          onClose={() => setShowForm(false)}
          action={createCertification}
          submitLabel="Add certification"
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
            <Plus className="w-4 h-4" /> Add certification
          </button>
        )
      )}
    </div>
  )
}

function CertRow({ cert, onEdit }: { cert: ICertification; onEdit: () => void }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--accent-glow)' }}
      >
        <Award className="w-4 h-4" style={{ color: 'var(--accent)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cert.name}</p>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {cert.issuer} · {cert.year}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <ConfirmDialog
          title="Delete certification"
          description={`Remove "${cert.name}"?`}
          onConfirm={() =>
            startTransition(async () => {
              const r = await deleteCertification(cert._id)
              r.error ? toast.error(r.error) : toast.success('Deleted')
            })
          }
        >
          {(open) => (
            <button onClick={open} disabled={isPending} className="p-1.5 rounded-lg" style={{ color: '#EF4444' }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </ConfirmDialog>
      </div>
    </div>
  )
}

function CertForm({
  cert,
  onClose,
  action,
  submitLabel,
}: {
  cert?: ICertification
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
        toast.success(cert ? 'Updated' : 'Added')
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
        {cert ? 'Edit certification' : 'Add certification'}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Name" name="name" required>
          <input name="name" defaultValue={cert?.name} placeholder="Complete Web Development Course" className={inputClass} required />
        </FormField>
        <FormField label="Issuer" name="issuer" required>
          <input name="issuer" defaultValue={cert?.issuer} placeholder="Programming Hero" className={inputClass} required />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Year" name="year" required>
          <input name="year" type="number" defaultValue={cert?.year ?? new Date().getFullYear()} min={2000} max={2100} className={inputClass} required />
        </FormField>
        <FormField label="Credential URL" name="credentialUrl">
          <input name="credentialUrl" type="url" defaultValue={cert?.credentialUrl} placeholder="https://..." className={inputClass} />
        </FormField>
      </div>
      <div className="flex gap-2">
        <AdminButton type="submit" loading={isPending}>{submitLabel}</AdminButton>
        <AdminButton type="button" variant="secondary" onClick={onClose}>Cancel</AdminButton>
      </div>
    </form>
  )
}
