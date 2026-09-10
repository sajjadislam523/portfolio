import mongoose, { Schema, type Document } from "mongoose";
import type { ExplorationStatus } from "@/types";

// DB-layer interface — uses Date (not string) for Mongoose compatibility.
// The serialised API shape (IExploration in types/index.ts) uses string
// dates and is what the client receives after JSON.parse().
export interface ExplorationDocument extends Document {
    title: string;
    description: string;
    topics: string[];
    status: ExplorationStatus;
    startDate: Date;
    link?: string;
    image?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    isPrimary: boolean;
    published: boolean;
    order: number;
}

const ExplorationSchema = new Schema<ExplorationDocument>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        topics: { type: [String], default: [] },
        status: {
            type: String,
            enum: ["active", "experimenting", "completed"] satisfies ExplorationStatus[],
            default: "active",
            index: true,
        },
        startDate: { type: Date, required: true },
        link: { type: String, default: "" },
        image: { type: String, default: "" },
        ctaLabel: { type: String, default: "" },
        ctaUrl: { type: String, default: "" },
        isPrimary: { type: Boolean, default: false, index: true },
        published: { type: Boolean, default: true, index: true },
        order: { type: Number, default: 0, index: true },
    },
    { timestamps: true },
);

ExplorationSchema.index({ status: 1, order: 1 });

export const Exploration =
    mongoose.models.Exploration ??
    mongoose.model<ExplorationDocument>("Exploration", ExplorationSchema);
