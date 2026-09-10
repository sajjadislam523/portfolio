/**
 * Optional one-off backfill — explicitly sets the new visibility fields
 * added by the CMS redesign (Project.published, Experience.published,
 * Exploration.published, Skill.visible) on every existing document that's
 * missing them. Not required for correctness: every read path already
 * treats a missing field as "visible" (`{ $ne: false }` queries, or an
 * `?? true` coalesce on the admin read side) — this is purely for DB
 * hygiene, so a `db.projects.find({ published: false })`-style query
 * behaves the same as the app's own logic without relying on "field
 * absent" as an implicit third state.
 *
 * Safe to run more than once — only touches documents missing the field.
 *
 * Usage:
 *   npx tsx scripts/backfill-cms-defaults.ts
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

async function backfill() {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const jobs: [string, string, unknown][] = [
        ["projects", "published", true],
        ["experiences", "published", true],
        ["explorations", "published", true],
        ["skills", "visible", true],
    ];

    for (const [collectionName, field, value] of jobs) {
        const collection = mongoose.connection.collection(collectionName);
        const result = await collection.updateMany(
            { [field]: { $exists: false } },
            { $set: { [field]: value } },
        );
        console.log(`✓ ${collectionName}.${field}: ${result.modifiedCount} document(s) backfilled`);
    }

    console.log("\n🎉 Backfill complete");
    await mongoose.disconnect();
}

backfill().catch((err) => {
    console.error("❌ Backfill failed:", err);
    process.exit(1);
});
