import { requireSession } from '@/features/auth/session'
import { getCertifications } from '@/features/certifications/actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { CertificationsManager } from './CertificationsManager'

export const metadata = { title: 'Certifications' }

export default async function AdminCertificationsPage() {
  await requireSession()
  const certifications = await getCertifications()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Certifications" description="Manage your certifications and courses" />
      <CertificationsManager certifications={certifications} />
    </div>
  )
}
