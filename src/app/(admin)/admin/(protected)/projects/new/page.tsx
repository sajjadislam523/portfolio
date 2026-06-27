import { requireSession } from '@/features/auth/session'
import { createProject } from '@/features/projects/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { ProjectForm } from '../ProjectForm'

export const metadata = { title: 'New Project' }

export default async function NewProjectPage() {
  await requireSession()
  return (
    <div className="max-w-4xl">
      <PageHeader
        title="New project"
        description="Add a project to your portfolio"
      />
      <ProjectForm action={createProject} />
    </div>
  )
}
