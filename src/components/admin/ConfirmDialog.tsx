'use client'

import { useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  description: string
  onConfirm: () => void
  children: (open: () => void) => React.ReactNode
}

export function ConfirmDialog({
  title,
  description,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  function open() {
    dialogRef.current?.showModal()
  }

  function close() {
    dialogRef.current?.close()
  }

  function handleConfirm() {
    onConfirm()
    close()
  }

  return (
    <>
      {children(open)}

      <dialog
        ref={dialogRef}
        className="rounded-xl p-6 w-full max-w-sm shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(239,68,68,0.12)' }}
          >
            <AlertTriangle className="w-4 h-4" style={{ color: '#EF4444' }} />
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={close}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
            style={{ background: '#EF4444', color: '#fff' }}
          >
            Delete
          </button>
        </div>
      </dialog>
    </>
  )
}
