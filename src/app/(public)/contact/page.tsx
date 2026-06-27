import { FadeIn } from '@/components/motion/ScrollReveal'
import { ContactForm } from '@/components/sections/contact/ContactForm'
import { connectDB, SiteSettings } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch — I\'m open to new opportunities and collaborations.',
}

export const revalidate = 3600

async function getContact() {
  try {
    await connectDB()
    const doc = await SiteSettings.findOne({}).select('email socialLinks name availableForWork').lean()
    return doc ? JSON.parse(JSON.stringify(doc)) : null
  } catch {
    return null
  }
}

export default async function ContactPage() {
  const settings = await getContact()

  return (
    <div className="pt-28 pb-24">
      <div className="container max-w-2xl">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            Contact
          </p>
          <h1 className="text-h1 mb-4" style={{ color: 'var(--text-primary)' }}>
            Get in touch
          </h1>
          <p className="text-base mb-3" style={{ color: 'var(--text-secondary)' }}>
            I'm currently{' '}
            <span style={{ color: settings?.availableForWork ? '#22C55E' : 'var(--text-secondary)' }}>
              {settings?.availableForWork ? 'open to new opportunities' : 'not actively looking'}
            </span>
            . Whether you have a project, a question, or just want to say hello — my inbox is open.
          </p>
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="inline-flex items-center gap-1.5 text-sm mb-12 transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)' }}
            >
              {settings.email} ↗
            </a>
          )}
        </FadeIn>

        <FadeIn delay={0.08}>
          <div
            className="rounded-xl p-6"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            <p
              className="text-sm font-medium mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              Send a message
            </p>
            <ContactForm />
          </div>
        </FadeIn>

        {/* Social links */}
        {settings?.socialLinks && settings.socialLinks.length > 0 && (
          <FadeIn delay={0.12} className="mt-8">
            <div className="flex items-center gap-4">
              {settings.socialLinks.map((link: { platform: string; url: string }) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {link.platform} ↗
                </a>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
