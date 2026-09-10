/**
 * Read-only check — prints SiteSettings.resumeUrl (the active link the
 * navbar/hero use) and every entry in resumeVersions, so it's clear whether
 * the active pointer matches an uploaded Blob file or a stale external link.
 *
 * Usage:
 *   npx tsx scripts/check-resume-status.ts
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

async function check() {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const doc = await mongoose.connection
        .collection("sitesettings")
        .findOne({}, { projection: { resumeUrl: 1, resumeVersions: 1 } });

    console.log("\nactive resumeUrl:", doc?.resumeUrl ?? "(none)");
    console.log("\nresumeVersions:");
    for (const v of doc?.resumeVersions ?? []) {
        console.log(
            `  - url: ${v.url}\n    filename: ${v.filename ?? v.fileName ?? "(none)"}\n    version: ${v.version ?? "(none)"}\n    uploadedAt: ${v.uploadedAt}\n    isActive: ${v.url === doc?.resumeUrl}`,
        );
    }

    await mongoose.disconnect();
}

check().catch((err) => {
    console.error("❌ Check failed:", err);
    process.exit(1);
});
