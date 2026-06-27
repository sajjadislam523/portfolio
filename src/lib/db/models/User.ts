import mongoose, { Schema, type Document } from 'mongoose'

export interface UserDocument extends Document {
  email: string
  passwordHash: string
  role: 'admin'
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
)

export const User =
  mongoose.models.User ??
  mongoose.model<UserDocument>('User', UserSchema)
