import { requireSession } from '@/features/auth/session'
import { getSiteSettings } from '@/features/settings/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { ThemeEditor } from './ThemeEditor'

export const metadata = { title: 'Themes' }

export default async function AdminThemesPage() {
  await requireSession()
  const settings = await getSiteSettings()

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Themes"
        description="Switch the active theme for your portfolio"
      />
      <ThemeEditor activeTheme={settings?.activeTheme ?? 'midnight'} />
    </div>
  )
}
