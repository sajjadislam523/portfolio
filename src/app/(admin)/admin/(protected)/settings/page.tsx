import { requireSession } from '@/features/auth/session'
import { getSiteSettings } from '@/features/settings/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { SettingsForm } from './SettingsForm'

export const metadata = { title: 'Settings' }

export default async function AdminSettingsPage() {
  await requireSession()
  const settings = await getSiteSettings()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Manage your site-wide configuration" />
      <SettingsForm settings={settings} />
    </div>
  )
}
