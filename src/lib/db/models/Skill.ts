import mongoose, { Schema, type Document } from 'mongoose'
import type { ISkill, SkillCategory, SkillTier } from '@/types'

export interface SkillDocument extends Omit<ISkill, '_id'>, Document {}

const SkillSchema = new Schema<SkillDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'devops', 'tooling'] satisfies SkillCategory[],
      required: true,
      index: true,
    },
    tier: {
      type: String,
      enum: ['core', 'working-knowledge', 'exploring'] satisfies SkillTier[],
      required: true,
      index: true,
    },
    icon: { type: String, default: "" },
    description: { type: String, default: "" },
    visible: { type: Boolean, default: true, index: true },
    projects: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
)

SkillSchema.index({ tier: 1, order: 1 })

export const Skill =
  mongoose.models.Skill ??
  mongoose.model<SkillDocument>('Skill', SkillSchema)
