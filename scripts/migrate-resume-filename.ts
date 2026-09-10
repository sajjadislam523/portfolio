/**
 * One-off migration — renames SiteSettings.resumeVersions[].fileName to
 * .filename, matching the schema fix in ResumeVersionSchema (the app always
 * read `filename`; entries saved before that fix stored the name under the
 * old `fileName` key and show blank in the admin Resume manager).
 *
 * Safe to run more than once — only rewrites entries missing `filename`
 * that still have the legacy `fileName`.
 *
 * Usage:
 *   npx tsx scripts/migrate-resume-filename.ts
 */

import { config } from "dotenv";
import mongoose from "mongoose";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    console.error("❌  MONGODB_URI is not set");
    process.exit(1);
}

interface LegacyResumeVersion {
    fileName?: string;
    filename?: string;
    [key: string]: unknown;
}

async function migrate() {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const collection = mongoose.connection.collection("sitesettings");
    const docs = await collection
        .find({ "resumeVersions.fileName": { $exists: true } })
        .toArray();

    if (docs.length === 0) {
        console.log(
            "· Nothing to migrate — no resumeVersions entries have the legacy fileName key",
        );
    }

    for (const doc of docs) {
        const versions = (doc.resumeVersions ?? []) as LegacyResumeVersion[];
        let changed = 0;
        const next = versions.map((v) => {
            if (v.fileName && !v.filename) {
                changed++;
                const { fileName, ...rest } = v;
                return { ...rest, filename: fileName };
            }
            return v;
        });
        if (changed > 0) {
            await collection.updateOne({ _id: doc._id }, { $set: { resumeVersions: next } });
            console.log(`✓ SiteSettings ${doc._id}: migrated ${changed} resume version(s)`);
        }
    }

    console.log("\n🎉 Migration complete");
    await mongoose.disconnect();
}

migrate().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
