import mongoose, { Schema, type Document } from 'mongoose'
import type { ISkill, SkillCategory, SkillProficiency } from '@/types'

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
    proficiency: {
      type: String,
      enum: ['expert', 'proficient', 'familiar'] satisfies SkillProficiency[],
      required: true,
    },
    projects: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
)

SkillSchema.index({ category: 1, order: 1 })

export const Skill =
  mongoose.models.Skill ??
  mongoose.model<SkillDocument>('Skill', SkillSchema)
