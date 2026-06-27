import Link from 'next/link'
import {
  FolderKanban,
  Briefcase,
  Zap,
  MessageSquare,
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { requireSession } from '@/features/auth/session'
import { connectDB, Project, Experience, Skill, ContactMessage, Certification } from '@/lib/db'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatCard } from '@/components/admin/StatCard'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Dashboard' }

// Runs on the server — no loading state needed, data is ready at render
async function getDashboardData() {
  await connectDB()

  const [
    projectCount,
    experienceCount,
    skillCount,
    certCount,
    unreadMessages,
    recentMessages,
  ] = await Promise.all([
    Project.countDocuments({ status: 'featured' }),
    Experience.countDocuments(),
    Skill.countDocuments(),
    Certification.countDocuments(),
    ContactMessage.countDocuments({ status: 'unread' }),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  return {
    projectCount,
    experienceCount,
    skillCount,
    certCount,
    unreadMessages,
    recentMessages,
  }
}

const QUICK_LINKS = [
  { href: '/admin/projects/new',  label: 'Add project',       icon: FolderKanban },
  { href: '/admin/experience',    label: 'Edit experience',   icon: Briefcase    },
  { href: '/admin/skills',        label: 'Manage skills',     icon: Zap          },
  { href: '/admin/themes',        label: 'Change theme',      icon: null         },
]

export default async function AdminDashboardPage() {
  await requireSession()
  const data = await getDashboardData()

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio content"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Featured projects" value={data.projectCount}   icon={FolderKanban} />
        <StatCard label="Experience entries" value={data.experienceCount} icon={Briefcase}   />
        <StatCard label="Skills"            value={data.skillCount}     icon={Zap}          />
        <StatCard
          label="Unread messages"
          value={data.unreadMessages}
          icon={MessageSquare}
          sub={data.unreadMessages > 0 ? 'Needs attention' : 'All caught up'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent messages */}
        <div
          className="rounded-xl p-4"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Recent messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data.recentMessages.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
              No messages yet
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {data.recentMessages.map((msg) => (
                <Link
                  key={String(msg._id)}
                  href="/admin/messages"
                  className="flex items-start gap-2.5 p-2.5 rounded-lg transition-colors"
                  style={{ background: 'var(--bg-subtle)' }}
                >
                  {msg.status === 'unread' ? (
                    <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {msg.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                      {msg.subject}
                    </p>
                  </div>
                  <span className="text-xs ml-auto shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                    {formatDate(String(msg.createdAt))}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div
          className="rounded-xl p-4"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          <h2
            className="text-sm font-medium mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Quick actions
          </h2>
          <div className="flex flex-col gap-2">
            {[
              { href: '/admin/projects/new',   label: 'Add a new project'      },
              { href: '/admin/experience',      label: 'Update experience'      },
              { href: '/admin/skills',          label: 'Edit skills'            },
              { href: '/admin/themes',          label: 'Switch active theme'    },
              { href: '/admin/settings',        label: 'Update site settings'   },
              { href: '/admin/messages',        label: `View messages${data.unreadMessages > 0 ? ` (${data.unreadMessages} unread)` : ''}` },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors group"
                style={{
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  border: '1px solid transparent',
                }}
              >
                {label}
                <ArrowRight
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--accent)' }}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
