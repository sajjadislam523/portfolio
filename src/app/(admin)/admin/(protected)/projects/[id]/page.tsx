import { notFound } from 'next/navigation'
import { requireSession } from '@/features/auth/session'
import { getProjectById, updateProject } from '@/features/projects/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { ProjectForm } from '../ProjectForm'

export const metadata = { title: 'Edit Project' }

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireSession()
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  const action = updateProject.bind(null, id)

  return (
    <div className="max-w-4xl">
      <PageHeader
        title={`Edit: ${project.title}`}
        description="Update project details"
      />
      <ProjectForm project={project} action={action} />
    </div>
  )
}
