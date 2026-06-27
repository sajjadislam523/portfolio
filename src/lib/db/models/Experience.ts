import mongoose, { Schema, type Document } from 'mongoose'

// DB-layer interface — uses Date (not string) for Mongoose compatibility.
// The serialised API shape (IExperience in types/index.ts) uses string dates
// and is what the client receives after JSON.parse().
export interface ExperienceDocument extends Document {
  company: string
  role: string
  location: string
  startDate: Date
  endDate: Date | null
  description: string
  accomplishments: string[]
  technologies: string[]
  order: number
}

const ExperienceSchema = new Schema<ExperienceDocument>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    description: { type: String, default: '' },
    accomplishments: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

export const Experience =
  mongoose.models.Experience ??
  mongoose.model<ExperienceDocument>('Experience', ExperienceSchema)
