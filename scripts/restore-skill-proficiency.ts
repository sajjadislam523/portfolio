/**
 * Emergency restore — re-adds the `proficiency` field to skill documents
 * from a backup taken by scripts/backup-collections.ts, WITHOUT touching
 * `tier`. Needed because production (the `main` branch, currently
 * deployed) still reads `skill.proficiency` directly, and
 * migrate-skill-tiers.ts unset that field when it ran against the same
 * database — breaking the live site until `main` is updated to the new
 * schema. Restoring `proficiency` alongside `tier` makes both the old
 * deployed code and the new code work at once.
 *
 * Usage:
 *   npx tsx scripts/restore-skill-proficiency.ts <path-to-backup-skills.json>
 */

import { config } from "dotenv";
import mongoose from "mongoose";
import { resolve } from "path";
import { readFileSync } from "fs";
config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
const backupPath = process.argv[2];

if (!MONGODB_URI) {
    console.error("❌  MONGODB_URI is not set");
    process.exit(1);
}
if (!backupPath) {
    console.error("❌  Usage: npx tsx scripts/restore-skill-proficiency.ts <path-to-backup-skills.json>");
    process.exit(1);
}

interface BackedUpSkill {
    _id: { $oid?: string } | string;
    proficiency?: string;
}

async function restore() {
    const backup: BackedUpSkill[] = JSON.parse(readFileSync(resolve(backupPath), "utf-8"));

    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const collection = mongoose.connection.collection("skills");
    let restored = 0;

    for (const doc of backup) {
        if (!doc.proficiency) continue;
        const id = typeof doc._id === "string" ? doc._id : doc._id.$oid;
        const objectId = new mongoose.Types.ObjectId(id);
        await collection.updateOne({ _id: objectId }, { $set: { proficiency: doc.proficiency } });
        restored++;
    }

    console.log(`✓ Restored proficiency on ${restored} skill(s) — tier left untouched`);

    const missing = await collection.countDocuments({ proficiency: { $exists: false } });
    const withTier = await collection.countDocuments({ tier: { $exists: true } });
    console.log(`skills missing proficiency: ${missing} | skills with tier: ${withTier}`);

    console.log("\n🎉 Restore complete");
    await mongoose.disconnect();
}

restore().catch((err) => {
    console.error("❌ Restore failed:", err);
    process.exit(1);
});
