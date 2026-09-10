/**
 * One-off migration — renames Skill.proficiency ("expert"/"proficient"/
 * "familiar") to Skill.tier ("core"/"working-knowledge"/"exploring").
 *
 * This is a rename, not a re-scoring: "expert" becomes "core" (what you use
 * daily), and both "proficient" and "familiar" collapse into
 * "working-knowledge" (used capably, just not primary) — the new "exploring"
 * tier is reserved for technology you're actively adopting right now, which
 * nothing in the old proficiency scale mapped to, so it starts empty. Set it
 * per-skill afterwards from the admin panel if that applies to anything.
 *
 * Safe to run more than once — skips any document that already has a `tier`.
 * Does not touch `name`, `category`, `projects`, or `order`.
 *
 * Usage:
 *   npx tsx scripts/migrate-skill-tiers.ts
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

const PROFICIENCY_TO_TIER: Record<string, "core" | "working-knowledge"> = {
    expert: "core",
    proficient: "working-knowledge",
    familiar: "working-knowledge",
};

async function migrate() {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const collection = mongoose.connection.collection("skills");
    const docs = await collection
        .find({ tier: { $exists: false } })
        .toArray();

    if (docs.length === 0) {
        console.log("· Nothing to migrate — every skill already has a tier");
    } else {
        for (const doc of docs) {
            const proficiency = doc.proficiency as string | undefined;
            const tier = proficiency ? PROFICIENCY_TO_TIER[proficiency] : undefined;
            if (!tier) {
                console.warn(
                    `⚠️  Skipping "${doc.name}" — unrecognised proficiency "${proficiency}"`,
                );
                continue;
            }
            await collection.updateOne(
                { _id: doc._id },
                { $set: { tier }, $unset: { proficiency: "" } },
            );
            console.log(`✓ ${doc.name}: ${proficiency} → ${tier}`);
        }
    }

    console.log("\n🎉 Migration complete");
    await mongoose.disconnect();
}

migrate().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
