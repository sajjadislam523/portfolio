/**
 * One-off migration — renames Exploration.status "archived" to "completed"
 * now that the status enum has a real 3-stage workflow (active →
 * experimenting → completed) instead of the old 2-value active/archived.
 *
 * Safe to run more than once — only touches documents whose status is
 * still literally "archived". Does not touch any other field.
 *
 * Usage:
 *   npx tsx scripts/migrate-exploration-status.ts
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

async function migrate() {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const collection = mongoose.connection.collection("explorations");
    const result = await collection.updateMany(
        { status: "archived" },
        { $set: { status: "completed" } },
    );

    console.log(`✓ ${result.modifiedCount} exploration(s) migrated: archived → completed`);
    if (result.modifiedCount === 0) {
        console.log("· Nothing to migrate — no explorations had status \"archived\"");
    }

    console.log("\n🎉 Migration complete");
    await mongoose.disconnect();
}

migrate().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
