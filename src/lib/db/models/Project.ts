import type { IProject, ProjectStatus } from "@/types";
import mongoose, { Schema, type Document } from "mongoose";

export interface ProjectDocument extends Omit<IProject, "_id">, Document {}

const ProjectSchema = new Schema<ProjectDocument>(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        title: { type: String, required: true, trim: true },
        tagline: { type: String, required: true, trim: true },
        overview: { type: String, required: true },
        challenges: { type: String, default: "" },
        solutions: { type: String, default: "" },
        architectureDiagram: { type: String, default: "" },
        coverImage: { type: String, default: "" },
        images: { type: [String], default: [] },
        technologies: { type: [String], default: [] },
        links: {
            live: { type: String, default: "" },
            github: { type: String, default: "" },
        },
        status: {
            type: String,
            enum: ["featured", "archived"] satisfies ProjectStatus[],
            default: "featured",
            index: true,
        },
        order: { type: Number, default: 0, index: true },
        year: { type: Number, required: true },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// Compound index for the public-facing query pattern
ProjectSchema.index({ status: 1, order: 1 });

export const Project =
    mongoose.models.Project ??
    mongoose.model<ProjectDocument>("Project", ProjectSchema);
