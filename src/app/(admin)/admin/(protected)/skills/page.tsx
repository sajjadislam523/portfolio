import { requireSession } from '@/features/auth/session'
import { getSkills } from '@/features/skills/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { SkillsManager } from './SkillsManager'

export const metadata = { title: 'Skills' }

export default async function AdminSkillsPage() {
  await requireSession()
  const skills = await getSkills()

  return (
    <div className="max-w-3xl">
      <PageHeader title="Skills" description="Manage your technology stack" />
      <SkillsManager skills={skills} />
    </div>
  )
}
