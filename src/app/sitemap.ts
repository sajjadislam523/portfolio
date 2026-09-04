import type { MetadataRoute } from 'next'
import { connectDB, Project } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://sajjadulislam.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // /projects, /experience, /stack, /contact now just redirect back to
  // section anchors on the single-page landing — no longer distinct
  // indexable URLs, so only the homepage is listed here.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
  ]

  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    await connectDB()
    const projects = await Project.find({ status: 'featured' })
      .select('slug updatedAt')
      .lean()

    projectRoutes = projects.map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch {
    // If DB is unavailable at build time, skip project routes
  }

  return [...staticRoutes, ...projectRoutes]
}
