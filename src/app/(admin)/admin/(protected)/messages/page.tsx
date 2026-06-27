import { requireSession } from '@/features/auth/session'
import { getMessages } from '@/features/contact/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { MessagesInbox } from './MessagesInbox'

export const metadata = { title: 'Messages' }

export default async function AdminMessagesPage() {
  await requireSession()
  const messages = await getMessages()

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Messages"
        description={`${messages.filter((m) => m.status === 'unread').length} unread`}
      />
      <MessagesInbox messages={messages} />
    </div>
  )
}
