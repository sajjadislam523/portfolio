import { z } from 'zod'

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z
    .string()
    .min(4, 'Subject must be at least 4 characters')
    .max(120, 'Subject is too long'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message is too long'),
})

export type ContactFormData = z.infer<typeof contactSchema>

// ─── Project ──────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  title: z.string().min(2).max(100),
  tagline: z.string().min(10).max(180),
  overview: z.string().min(20),
  challenges: z.string().default(''),
  solutions: z.string().default(''),
  architectureDiagram: z.string().default(''),
  technologies: z.array(z.string()).min(1, 'Add at least one technology'),
  links: z.object({
    live: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
  }),
  status: z.enum(['featured', 'archived']).default('featured'),
  order: z.number().int().min(0).default(0),
  year: z.number().int().min(2000).max(2100),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// ─── Experience ───────────────────────────────────────────────────────────────

export const experienceSchema = z.object({
  company: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  location: z.string().min(2).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable(),
  description: z.string().default(''),
  accomplishments: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  order: z.number().int().min(0).default(0),
})

export type ExperienceFormData = z.infer<typeof experienceSchema>

// ─── Skill ────────────────────────────────────────────────────────────────────

export const skillSchema = z.object({
  name: z.string().min(1).max(60),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'tooling']),
  proficiency: z.enum(['expert', 'proficient', 'familiar']),
  projects: z.array(z.string()).default([]),
  order: z.number().int().min(0).default(0),
})

export type SkillFormData = z.infer<typeof skillSchema>

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ─── Site Settings ────────────────────────────────────────────────────────────

export const siteSettingsSchema = z.object({
  name: z.string().min(2).max(80),
  tagline: z.string().max(160),
  bio: z.string().max(1000),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  location: z.string().max(80),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  activeTheme: z.enum(['midnight', 'ocean', 'sunset', 'matrix', 'aurora']),
  availableForWork: z.boolean(),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url(),
      icon: z.string().optional(),
    })
  ),
  seo: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    ogImage: z.string().url().optional().or(z.literal('')),
    keywords: z.array(z.string()),
  }),
})

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>
