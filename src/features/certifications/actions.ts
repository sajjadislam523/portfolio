'use server'

import { revalidatePath } from 'next/cache'
import { connectDB, Certification } from '@/lib/db'
import { requireSession } from '@/features/auth/session'
import { serialiseDoc } from '@/lib/utils'
import { z } from 'zod'
import type { ICertification } from '@/types'

const certSchema = z.object({
  name:          z.string().min(2).max(120),
  issuer:        z.string().min(2).max(100),
  year:          z.number().int().min(2000).max(2100),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  order:         z.number().int().min(0).default(0),
})

export async function getCertifications(): Promise<ICertification[]> {
  await connectDB()
  const docs = await Certification.find().sort({ order: 1 }).lean()
  return serialiseDoc<ICertification[]>(docs)
}

export async function createCertification(formData: FormData) {
  await requireSession()

  const raw = {
    name:          formData.get('name'),
    issuer:        formData.get('issuer'),
    year:          Number(formData.get('year')),
    credentialUrl: formData.get('credentialUrl') ?? '',
    order:         Number(formData.get('order') ?? 0),
  }

  const parsed = certSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await connectDB()
  await Certification.create(parsed.data)

  revalidatePath('/admin/certifications')
  revalidatePath('/')
  return { success: true }
}

export async function updateCertification(id: string, formData: FormData) {
  await requireSession()

  const raw = {
    name:          formData.get('name'),
    issuer:        formData.get('issuer'),
    year:          Number(formData.get('year')),
    credentialUrl: formData.get('credentialUrl') ?? '',
    order:         Number(formData.get('order') ?? 0),
  }

  const parsed = certSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await connectDB()
  await Certification.findByIdAndUpdate(id, parsed.data)

  revalidatePath('/admin/certifications')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCertification(id: string): Promise<import('@/lib/utils').ActionResult> {
  await requireSession()
  await connectDB()
  await Certification.findByIdAndDelete(id)
  revalidatePath('/admin/certifications')
  revalidatePath('/')
  return { success: true }
}
