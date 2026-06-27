import { requireSession } from '@/features/auth/session'
import { getExperiences } from '@/features/experience/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { ExperienceManager } from './ExperienceManager'

export const metadata = { title: 'Experience' }

export default async function AdminExperiencePage() {
  await requireSession()
  const experiences = await getExperiences()

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Experience"
        description="Manage your work history"
      />
      <ExperienceManager experiences={experiences} />
    </div>
  )
}
