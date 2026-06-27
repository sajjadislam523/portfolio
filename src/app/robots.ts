import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://sajjadulislam.dev'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
