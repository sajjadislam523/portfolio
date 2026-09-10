import { requireSession } from '@/features/auth/session'
import { getSkills } from '@/features/skills/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { SkillsManager } from './SkillsManager'

export const metadata = { title: 'Stack' }

export default async function AdminSkillsPage() {
  await requireSession()
  const skills = await getSkills()

  return (
    <div className="max-w-3xl">
      <PageHeader title="Stack" description="Manage the technologies shown on the public site" />
      <SkillsManager skills={skills} />
    </div>
  )
}
