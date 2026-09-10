/**
 * Read-only check — reports how many skills have `tier`, `proficiency`,
 * both, or neither. Used to verify migration/restore state without writing
 * anything.
 *
 * Usage:
 *   npx tsx scripts/check-skill-status.ts
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

    const col = mongoose.connection.collection("skills");
    const total = await col.countDocuments();
    const withTier = await col.countDocuments({ tier: { $exists: true } });
    const withProficiency = await col.countDocuments({ proficiency: { $exists: true } });
    const withBoth = await col.countDocuments({
        tier: { $exists: true },
        proficiency: { $exists: true },
    });
    const withNeither = await col.countDocuments({
        tier: { $exists: false },
        proficiency: { $exists: false },
    });

    console.log(`total skills: ${total}`);
    console.log(`with tier: ${withTier}`);
    console.log(`with proficiency: ${withProficiency}`);
    console.log(`with both: ${withBoth}`);
    console.log(`with neither (broken either way): ${withNeither}`);

    await mongoose.disconnect();
}

check().catch((err) => {
    console.error("❌ Check failed:", err);
    process.exit(1);
});
