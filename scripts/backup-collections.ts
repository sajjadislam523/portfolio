/**
 * Read-only safety net — dumps the collections a migration script is about
 * to touch to local timestamped JSON files, before you run anything that
 * writes. Never modifies the database.
 *
 * Usage:
 *   npx tsx scripts/backup-collections.ts [collection ...]
 *   # defaults to the collections migrate-skill-tiers.ts and
 *   # migrate-resume-filename.ts touch:
 *   npx tsx scripts/backup-collections.ts
 *   npx tsx scripts/backup-collections.ts skills sitesettings explorations
 *
 * To restore a collection from a backup file later (manual, deliberate):
 *   mongosh "<uri>" --eval '
 *     const docs = JSON.parse(require("fs").readFileSync("./backups/<ts>/skills.json"));
 *     db.skills.deleteMany({});
 *     db.skills.insertMany(docs);
 *   '
 */

import { config } from "dotenv";
import mongoose from "mongoose";
import { resolve } from "path";
import { mkdirSync, writeFileSync } from "fs";
config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    console.error("❌  MONGODB_URI is not set");
    process.exit(1);
}

const DEFAULT_COLLECTIONS = ["skills", "sitesettings"];

async function backup() {
    const collections = process.argv.slice(2).length
        ? process.argv.slice(2)
        : DEFAULT_COLLECTIONS;

    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const dir = resolve(process.cwd(), "backups", stamp);
    mkdirSync(dir, { recursive: true });

    for (const name of collections) {
        const docs = await mongoose.connection.collection(name).find({}).toArray();
        const file = resolve(dir, `${name}.json`);
        writeFileSync(file, JSON.stringify(docs, null, 2));
        console.log(`✓ ${name}: ${docs.length} document(s) -> ${file}`);
    }

    console.log(`\n🎉 Backup complete: ${dir}`);
    await mongoose.disconnect();
}

backup().catch((err) => {
    console.error("❌ Backup failed:", err);
    process.exit(1);
});
