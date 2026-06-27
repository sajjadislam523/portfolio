'use server'

import { revalidatePath } from 'next/cache'
import { connectDB, Project } from '@/lib/db'
import { projectSchema } from '@/lib/validations'
import { requireSession } from '@/features/auth/session'
import { slugify, serialiseDoc } from '@/lib/utils'
import type { IProject } from '@/types'

export async function getProjects(): Promise<IProject[]> {
  await connectDB()
  const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean()
  return serialiseDoc<IProject[]>(docs)
}

export async function getProjectById(id: string): Promise<IProject | null> {
  await connectDB()
  const doc = await Project.findById(id).lean()
  return doc ? serialiseDoc<IProject>(doc) : null
}

export async function createProject(formData: FormData) {
  await requireSession()

  const raw = {
    slug:               formData.get('slug')?.toString().trim() || slugify(formData.get('title')?.toString() ?? ''),
    title:              formData.get('title'),
    tagline:            formData.get('tagline'),
    overview:           formData.get('overview'),
    challenges:         formData.get('challenges') ?? '',
    solutions:          formData.get('solutions') ?? '',
    architectureDiagram:formData.get('architectureDiagram') ?? '',
    technologies:       (formData.get('technologies')?.toString() ?? '')
                          .split(',').map(s => s.trim()).filter(Boolean),
    links: {
      live:   formData.get('links.live') ?? '',
      github: formData.get('links.github') ?? '',
    },
    status: formData.get('status') ?? 'featured',
    order:  Number(formData.get('order') ?? 0),
    year:   Number(formData.get('year') ?? new Date().getFullYear()),
  }

  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  await connectDB()

  const existing = await Project.findOne({ slug: parsed.data.slug })
  if (existing) {
    return { error: 'A project with this slug already exists.' }
  }

  await Project.create(parsed.data)

  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath('/')

  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  await requireSession()

  const raw = {
    slug:               formData.get('slug'),
    title:              formData.get('title'),
    tagline:            formData.get('tagline'),
    overview:           formData.get('overview'),
    challenges:         formData.get('challenges') ?? '',
    solutions:          formData.get('solutions') ?? '',
    architectureDiagram:formData.get('architectureDiagram') ?? '',
    technologies:       (formData.get('technologies')?.toString() ?? '')
                          .split(',').map(s => s.trim()).filter(Boolean),
    links: {
      live:   formData.get('links.live') ?? '',
      github: formData.get('links.github') ?? '',
    },
    status: formData.get('status') ?? 'featured',
    order:  Number(formData.get('order') ?? 0),
    year:   Number(formData.get('year') ?? new Date().getFullYear()),
  }

  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  await connectDB()
  await Project.findByIdAndUpdate(id, parsed.data, { new: true })

  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${id}`)
  revalidatePath('/projects')
  revalidatePath(`/projects/${parsed.data.slug}`)
  revalidatePath('/')

  return { success: true }
}

export async function deleteProject(id: string): Promise<import('@/lib/utils').ActionResult> {
  await requireSession()
  await connectDB()
  await Project.findByIdAndDelete(id)
  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath('/')
  return { success: true }
}
