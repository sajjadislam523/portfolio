'use server'

import { revalidatePath } from 'next/cache'
import { connectDB, Experience } from '@/lib/db'
import { experienceSchema } from '@/lib/validations'
import { requireSession } from '@/features/auth/session'
import type { ActionResult } from '@/lib/utils'
import { serialiseDoc } from '@/lib/utils'
import type { IExperience } from '@/types'

function withPublishedDefault(doc: IExperience): IExperience {
  return { ...doc, published: doc.published ?? true }
}

export async function getExperiences(): Promise<IExperience[]> {
  await connectDB()
  const docs = await Experience.find().sort({ order: 1 }).lean()
  return serialiseDoc<IExperience[]>(docs).map(withPublishedDefault)
}

export async function getExperienceById(id: string): Promise<IExperience | null> {
  await connectDB()
  const doc = await Experience.findById(id).lean()
  return doc ? withPublishedDefault(serialiseDoc<IExperience>(doc)) : null
}

export async function createExperience(formData: FormData): Promise<ActionResult> {
  await requireSession()

  const raw = {
    company:         formData.get('company'),
    role:            formData.get('role'),
    location:        formData.get('location'),
    startDate:       formData.get('startDate'),
    endDate:         formData.get('endDate') || null,
    description:     formData.get('description') ?? '',
    accomplishments: (formData.get('accomplishments')?.toString() ?? '')
                       .split('\n').map(s => s.trim()).filter(Boolean),
    technologies:    (formData.get('technologies')?.toString() ?? '')
                       .split(',').map(s => s.trim()).filter(Boolean),
    published:       formData.get('published') !== 'false',
    order:           Number(formData.get('order') ?? 0),
  }

  const parsed = experienceSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await connectDB()
  await Experience.create(parsed.data)

  revalidatePath('/admin/experience')
  revalidatePath('/experience')
  revalidatePath('/')
  return { success: true }
}

export async function updateExperience(id: string, formData: FormData): Promise<ActionResult> {
  await requireSession()

  const raw = {
    company:         formData.get('company'),
    role:            formData.get('role'),
    location:        formData.get('location'),
    startDate:       formData.get('startDate'),
    endDate:         formData.get('endDate') || null,
    description:     formData.get('description') ?? '',
    accomplishments: (formData.get('accomplishments')?.toString() ?? '')
                       .split('\n').map(s => s.trim()).filter(Boolean),
    technologies:    (formData.get('technologies')?.toString() ?? '')
                       .split(',').map(s => s.trim()).filter(Boolean),
    published:       formData.get('published') !== 'false',
    order:           Number(formData.get('order') ?? 0),
  }

  const parsed = experienceSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await connectDB()
  await Experience.findByIdAndUpdate(id, parsed.data)

  revalidatePath('/admin/experience')
  revalidatePath('/experience')
  revalidatePath('/')
  return { success: true }
}

export async function deleteExperience(id: string): Promise<import('@/lib/utils').ActionResult> {
  await requireSession()
  await connectDB()
  await Experience.findByIdAndDelete(id)
  revalidatePath('/admin/experience')
  revalidatePath('/experience')
  revalidatePath('/')
  return { success: true }
}

export async function reorderExperience(
  id: string,
  direction: 'up' | 'down',
): Promise<import('@/lib/utils').ActionResult> {
  await requireSession()
  await connectDB()

  const items = await Experience.find().sort({ order: 1 })
  const index = items.findIndex((item) => item._id.toString() === id)
  if (index === -1) return { error: 'Experience not found' }

  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= items.length) return { success: true }

  const current = items[index]
  const swapWith = items[swapIndex]
  const currentOrder = current.order
  current.order = swapWith.order
  swapWith.order = currentOrder

  await current.save()
  await swapWith.save()
  revalidatePath('/admin/experience')
  return { success: true }
}
