import Link from 'next/link'
import { Plus, Pencil, ExternalLink } from 'lucide-react'
import { requireSession } from '@/features/auth/session'
import { getProjects } from '@/features/projects/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { AdminButton } from '@/components/admin/AdminButton'
import { DeleteProjectButton } from './DeleteProjectButton'

export const metadata = { title: 'Projects' }

export default async function AdminProjectsPage() {
  await requireSession()
  const projects = await getProjects()

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Projects"
        description="Manage your featured projects"
        action={
          <Link href="/admin/projects/new">
            <AdminButton>
              <Plus className="w-4 h-4" /> Add project
            </AdminButton>
          </Link>
        }
      />

      {projects.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            No projects yet.{' '}
            <Link href="/admin/projects/new" style={{ color: 'var(--accent)' }}>
              Add your first project
            </Link>
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                {['Title', 'Year', 'Status', 'Technologies', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project, idx) => (
                <tr
                  key={project._id}
                  style={{
                    background: idx % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {project.title}
                      </p>
                      <p className="text-xs mt-0.5 truncate max-w-[240px]" style={{ color: 'var(--text-tertiary)' }}>
                        {project.tagline}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {project.year}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: project.status === 'featured' ? 'rgba(34,197,94,0.12)' : 'var(--bg-subtle)',
                        color: project.status === 'featured' ? '#22C55E' : 'var(--text-tertiary)',
                        border: `1px solid ${project.status === 'featured' ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                      }}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="pill">{tech}</span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="pill">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Link
                        href={`/admin/projects/${project._id}`}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteProjectButton id={project._id} title={project.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
