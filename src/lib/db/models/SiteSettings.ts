import mongoose, { Schema, type Document } from 'mongoose'
import type { ISiteSettings, ThemeName } from '@/types'

export interface SiteSettingsDocument
  extends Omit<ISiteSettings, '_id'>,
    Document {}

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: '' },
  },
  { _id: false }
)

const SEOSchema = new Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
)

const SiteSettingsSchema = new Schema<SiteSettingsDocument>(
  {
    name: { type: String, required: true, default: 'Sajjadul Islam' },
    tagline: { type: String, default: '' },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: 'Dhaka, Bangladesh' },
    resumeUrl: { type: String, default: '' },
    activeTheme: {
      type: String,
      enum: ['midnight', 'ocean', 'sunset', 'matrix', 'aurora'] satisfies ThemeName[],
      default: 'midnight',
    },
    availableForWork: { type: Boolean, default: true },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    seo: { type: SEOSchema, default: () => ({}) },
  },
  { timestamps: true }
)

export const SiteSettings =
  mongoose.models.SiteSettings ??
  mongoose.model<SiteSettingsDocument>('SiteSettings', SiteSettingsSchema)
