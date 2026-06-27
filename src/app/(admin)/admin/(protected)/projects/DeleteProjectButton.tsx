'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteProject } from '@/features/projects/actions'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProject(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`"${title}" deleted`)
      }
    })
  }

  return (
    <ConfirmDialog
      title="Delete project"
      description={`"${title}" will be permanently deleted. This cannot be undone.`}
      onConfirm={handleDelete}
    >
      {(open) => (
        <button
          onClick={open}
          disabled={isPending}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
          style={{ color: '#EF4444' }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </ConfirmDialog>
  )
}
