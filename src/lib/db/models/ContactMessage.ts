import mongoose, { Schema, type Document } from 'mongoose'
import type { IContactMessage, MessageStatus } from '@/types'

export interface ContactMessageDocument
  extends Omit<IContactMessage, '_id'>,
    Document {}

const ContactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'] satisfies MessageStatus[],
      default: 'unread',
      index: true,
    },
  },
  { timestamps: true }
)

// Most common query: unread messages sorted newest-first
ContactMessageSchema.index({ status: 1, createdAt: -1 })

export const ContactMessage =
  mongoose.models.ContactMessage ??
  mongoose.model<ContactMessageDocument>('ContactMessage', ContactMessageSchema)
