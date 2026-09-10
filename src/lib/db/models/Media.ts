import mongoose, { Schema, type Document } from "mongoose";

// A tracked record of every file uploaded through /api/upload, going
// forward — before this model existed, uploads went straight to Vercel
// Blob with no database trace, so nothing could be browsed, reused, or
// safely deleted from admin. Historical (pre-existing) blobs are not
// backfilled automatically; see scripts/backfill-media-from-blob.ts.
export interface MediaDocument extends Document {
    url: string;
    pathname: string;
    filename: string;
    type: string;
    size: number;
    purpose: string;
    uploadedAt: Date;
}

const MediaSchema = new Schema<MediaDocument>({
    url: { type: String, required: true },
    pathname: { type: String, required: true },
    filename: { type: String, default: "" },
    type: { type: String, default: "" },
    size: { type: Number, default: 0 },
    purpose: { type: String, default: "", index: true },
    uploadedAt: { type: Date, default: Date.now, index: true },
});

export const Media =
    mongoose.models.Media ?? mongoose.model<MediaDocument>("Media", MediaSchema);
