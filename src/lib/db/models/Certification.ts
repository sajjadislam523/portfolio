import mongoose, { Schema, type Document } from 'mongoose'
import type { ICertification } from '@/types'

export interface CertificationDocument
  extends Omit<ICertification, '_id'>,
    Document {}

const CertificationSchema = new Schema<CertificationDocument>(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    credentialUrl: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
)

export const Certification =
  mongoose.models.Certification ??
  mongoose.model<CertificationDocument>('Certification', CertificationSchema)
