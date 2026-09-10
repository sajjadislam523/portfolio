'use server'

import { revalidatePath } from 'next/cache'
import { connectDB, Skill } from '@/lib/db'
import { skillSchema } from '@/lib/validations'
import { requireSession } from '@/features/auth/session'
import type { ActionResult } from '@/lib/utils'
import { serialiseDoc } from '@/lib/utils'
import type { ISkill } from '@/types'

function withVisibleDefault(doc: ISkill): ISkill {
  return { ...doc, visible: doc.visible ?? true }
}

export async function getSkills(): Promise<ISkill[]> {
  await connectDB()
  const docs = await Skill.find().sort({ order: 1 }).lean()
  return serialiseDoc<ISkill[]>(docs).map(withVisibleDefault)
}

export async function createSkill(formData: FormData): Promise<ActionResult> {
  await requireSession()

  const raw = {
    name:        formData.get('name'),
    category:    formData.get('category'),
    tier:        formData.get('tier'),
    icon:        formData.get('icon') ?? '',
    description: formData.get('description') ?? '',
    visible:     formData.get('visible') !== 'false',
    projects:    (formData.get('projects')?.toString() ?? '')
                   .split(',').map(s => s.trim()).filter(Boolean),
    order:       Number(formData.get('order') ?? 0),
  }

  const parsed = skillSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await connectDB()
  await Skill.create(parsed.data)

  revalidatePath('/admin/skills')
  revalidatePath('/stack')
  revalidatePath('/')
  return { success: true }
}

export async function updateSkill(id: string, formData: FormData): Promise<ActionResult> {
  await requireSession()

  const raw = {
    name:        formData.get('name'),
    category:    formData.get('category'),
    tier:        formData.get('tier'),
    icon:        formData.get('icon') ?? '',
    description: formData.get('description') ?? '',
    visible:     formData.get('visible') !== 'false',
    projects:    (formData.get('projects')?.toString() ?? '')
                   .split(',').map(s => s.trim()).filter(Boolean),
    order:       Number(formData.get('order') ?? 0),
  }

  const parsed = skillSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await connectDB()
  await Skill.findByIdAndUpdate(id, parsed.data)

  revalidatePath('/admin/skills')
  revalidatePath('/stack')
  revalidatePath('/')
  return { success: true }
}

export async function deleteSkill(id: string): Promise<import('@/lib/utils').ActionResult> {
  await requireSession()
  await connectDB()
  await Skill.findByIdAndDelete(id)
  revalidatePath('/admin/skills')
  revalidatePath('/stack')
  revalidatePath('/')
  return { success: true }
}
