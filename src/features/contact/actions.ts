'use server'

import { revalidatePath } from 'next/cache'
import { connectDB, ContactMessage } from '@/lib/db'
import { requireSession } from '@/features/auth/session'
import { serialiseDoc } from '@/lib/utils'
import type { IContactMessage, MessageStatus } from '@/types'

export async function getMessages(status?: MessageStatus): Promise<IContactMessage[]> {
  await connectDB()
  const query = status ? { status } : {}
  const docs = await ContactMessage.find(query).sort({ createdAt: -1 }).lean()
  return serialiseDoc<IContactMessage[]>(docs)
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  await requireSession()

  const validStatuses: MessageStatus[] = ['unread', 'read', 'archived']
  if (!validStatuses.includes(status)) return { error: 'Invalid status' }

  await connectDB()
  await ContactMessage.findByIdAndUpdate(id, { status })

  revalidatePath('/admin/messages')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function deleteMessage(id: string): Promise<import('@/lib/utils').ActionResult> {
  await requireSession()
  await connectDB()
  await ContactMessage.findByIdAndDelete(id)
  revalidatePath('/admin/messages')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

// Public action — called from the contact form on the public site
export async function submitContactMessage(formData: FormData) {
  const name    = formData.get('name')?.toString().trim() ?? ''
  const email   = formData.get('email')?.toString().trim() ?? ''
  const subject = formData.get('subject')?.toString().trim() ?? ''
  const message = formData.get('message')?.toString().trim() ?? ''

  if (!name || !email || !subject || !message) {
    return { error: 'All fields are required.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Invalid email address.' }
  }
  if (message.length < 20) {
    return { error: 'Message must be at least 20 characters.' }
  }

  await connectDB()
  await ContactMessage.create({ name, email, subject, message, status: 'unread' })

  return { success: true }
}
