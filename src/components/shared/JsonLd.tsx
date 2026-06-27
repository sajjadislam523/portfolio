interface JsonLdPersonProps {
  name: string
  url: string
  email?: string
  jobTitle?: string
  description?: string
  sameAs?: string[]
}

export function JsonLdPerson({
  name,
  url,
  email,
  jobTitle,
  description,
  sameAs = [],
}: JsonLdPersonProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${url}/#person`,
        name,
        url,
        email,
        jobTitle,
        description,
        sameAs,
        knowsAbout: ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Full Stack Development'],
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name,
        description,
        author: { '@id': `${url}/#person` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
