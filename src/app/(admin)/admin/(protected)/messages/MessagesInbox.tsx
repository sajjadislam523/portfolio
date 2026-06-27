'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Mail, MailOpen, Archive, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { updateMessageStatus, deleteMessage } from '@/features/contact/actions'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { formatDate } from '@/lib/utils'
import type { IContactMessage } from '@/types'

export function MessagesInbox({ messages }: { messages: IContactMessage[] }) {
  if (messages.length === 0) {
    return (
      <div
        className="rounded-xl p-12 text-center"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
      >
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          No messages yet
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg) => (
        <MessageRow key={msg._id} message={msg} />
      ))}
    </div>
  )
}

function MessageRow({ message: msg }: { message: IContactMessage }) {
  const [expanded, setExpanded] = useState(msg.status === 'unread')
  const [isPending, startTransition] = useTransition()

  const isUnread = msg.status === 'unread'

  function act(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn()
    })
  }

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: 'var(--bg-elevated)',
        border: `1px solid ${isUnread ? 'var(--border-strong)' : 'var(--border)'}`,
      }}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => {
          setExpanded((v) => !v)
          if (isUnread) {
            act(() => updateMessageStatus(msg._id, 'read'))
          }
        }}
      >
        <div className="shrink-0">
          {isUnread
            ? <Mail className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            : <MailOpen className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className="text-sm truncate"
              style={{
                color: 'var(--text-primary)',
                fontWeight: isUnread ? '600' : '400',
              }}
            >
              {msg.name}
            </p>
            <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)' }}>
              {msg.email}
            </span>
          </div>
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {msg.subject}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {formatDate(msg.createdAt)}
          </span>

          {msg.status !== 'archived' && (
            <button
              onClick={(e) => { e.stopPropagation(); act(() => updateMessageStatus(msg._id, 'archived')) }}
              disabled={isPending}
              className="p-1.5 rounded-lg disabled:opacity-50"
              style={{ color: 'var(--text-tertiary)' }}
              title="Archive"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}

          <ConfirmDialog
            title="Delete message"
            description={`Delete message from ${msg.name}? This cannot be undone.`}
            onConfirm={() => act(() => deleteMessage(msg._id))}
          >
            {(open) => (
              <button
                onClick={(e) => { e.stopPropagation(); open() }}
                disabled={isPending}
                className="p-1.5 rounded-lg disabled:opacity-50"
                style={{ color: '#EF4444' }}
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </ConfirmDialog>

          <div style={{ color: 'var(--text-tertiary)' }}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <p
            className="text-xs font-medium mt-3 mb-1"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Subject: {msg.subject}
          </p>
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--text-secondary)' }}
          >
            {msg.message}
          </p>
          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            <Mail className="w-3 h-3" /> Reply via email
          </a>
        </div>
      )}
    </div>
  )
}
