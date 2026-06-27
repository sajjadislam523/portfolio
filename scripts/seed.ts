/**
 * Seed script — run once to populate the database with real content.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires MONGODB_URI and a plaintext ADMIN_PASSWORD env var.
 * It hashes the password before storing it.
 */

import bcrypt from "bcryptjs";
import { config } from "dotenv";
import mongoose from "mongoose";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@sajjadulislam.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "changeme123";

if (!MONGODB_URI) {
    console.error("❌  MONGODB_URI is not set");
    process.exit(1);
}

// ── Inline schemas so the seed runs without Next.js context ──────────────────

const ProjectSchema = new mongoose.Schema(
    {
        slug: String,
        title: String,
        tagline: String,
        overview: String,
        challenges: String,
        solutions: String,
        architectureDiagram: String,
        technologies: [String],
        links: { live: String, github: String },
        status: String,
        order: Number,
        year: Number,
    },
    { timestamps: true },
);

const ExperienceSchema = new mongoose.Schema(
    {
        company: String,
        role: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: String,
        accomplishments: [String],
        technologies: [String],
        order: Number,
    },
    { timestamps: true },
);

const SkillSchema = new mongoose.Schema(
    {
        name: String,
        category: String,
        proficiency: String,
        projects: [String],
        order: Number,
    },
    { timestamps: true },
);

const CertSchema = new mongoose.Schema(
    {
        name: String,
        issuer: String,
        year: Number,
        credentialUrl: String,
        order: Number,
    },
    { timestamps: true },
);

const SiteSettingsSchema = new mongoose.Schema(
    {
        name: String,
        tagline: String,
        bio: String,
        email: String,
        phone: String,
        location: String,
        resumeUrl: String,
        activeTheme: String,
        availableForWork: Boolean,
        socialLinks: [{ platform: String, url: String, icon: String }],
        seo: {
            title: String,
            description: String,
            ogImage: String,
            keywords: [String],
        },
    },
    { timestamps: true },
);

const UserSchema = new mongoose.Schema(
    {
        email: String,
        passwordHash: String,
        role: String,
        lastLogin: Date,
    },
    { timestamps: true },
);

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const Project =
        mongoose.models.Project ?? mongoose.model("Project", ProjectSchema);
    const Experience =
        mongoose.models.Experience ??
        mongoose.model("Experience", ExperienceSchema);
    const Skill = mongoose.models.Skill ?? mongoose.model("Skill", SkillSchema);
    const Cert =
        mongoose.models.Certification ??
        mongoose.model("Certification", CertSchema);
    const Settings =
        mongoose.models.SiteSettings ??
        mongoose.model("SiteSettings", SiteSettingsSchema);
    const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

    // ── Clear existing data ───────────────────────────────────────────────────
    await Promise.all([
        Project.deleteMany({}),
        Experience.deleteMany({}),
        Skill.deleteMany({}),
        Cert.deleteMany({}),
        Settings.deleteMany({}),
    ]);
    console.log("✓ Cleared existing data");

    // ── Admin user ────────────────────────────────────────────────────────────
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    if (!existingUser) {
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        await User.create({ email: ADMIN_EMAIL, passwordHash, role: "admin" });
        console.log(`✓ Admin user created: ${ADMIN_EMAIL}`);
    } else {
        console.log(`· Admin user already exists: ${ADMIN_EMAIL}`);
    }

    // ── Site settings ─────────────────────────────────────────────────────────
    await Settings.create({
        name: "Sajjadul Islam",
        tagline: "Full stack engineer. Product-minded. Builder by default.",
        bio: "I build production-grade web applications using React, Next.js, and Node.js. Currently based in Dhaka, Bangladesh. I care about clean architecture, thoughtful UI, and shipping things that work.",
        email: "sajjadulislam523@gmail.com",
        location: "Dhaka, Bangladesh",
        resumeUrl: "",
        activeTheme: "midnight",
        availableForWork: true,
        socialLinks: [
            {
                platform: "GitHub",
                url: "https://github.com/sajjadulislam523",
                icon: "github",
            },
            {
                platform: "LinkedIn",
                url: "https://linkedin.com/in/sajjadulislam",
                icon: "linkedin",
            },
        ],
        seo: {
            title: "Sajjadul Islam — Full Stack Engineer",
            description:
                "Full stack engineer specialising in React, Next.js, TypeScript and Node.js. Building production-grade web applications from Dhaka, Bangladesh.",
            ogImage: "",
            keywords: [
                "full stack engineer",
                "react developer",
                "next.js",
                "typescript",
                "node.js",
                "mongodb",
                "dhaka",
            ],
        },
    });
    console.log("✓ Site settings seeded");

    // ── Experience ────────────────────────────────────────────────────────────
    await Experience.create({
        company: "AlgoHat Technology",
        role: "Frontend Developer",
        location: "Mohammadpur, Dhaka",
        startDate: new Date("2025-05-01"),
        endDate: new Date("2025-10-01"),
        description:
            "Built and maintained client-facing React applications within an Agile team, translating Figma designs to pixel-perfect, accessible UI with TailwindCSS and shadcn/ui.",
        accomplishments: [
            "Built 10+ reusable React and TypeScript components used across multiple products",
            "Translated Figma designs to pixel-perfect TailwindCSS and shadcn/ui implementations",
            "Implemented code splitting and lazy loading, reducing initial bundle size",
            "Integrated 5+ REST APIs using Axios and TanStack Query with optimistic updates",
            "Reduced bounce rate through targeted UX and performance improvements",
            "Participated in Agile code reviews, raising overall code quality across the team",
        ],
        technologies: [
            "React.js",
            "TypeScript",
            "Next.js",
            "TailwindCSS",
            "shadcn/ui",
            "TanStack Query",
            "Axios",
            "Git",
        ],
        order: 0,
    });
    console.log("✓ Experience seeded");

    // ── Projects ──────────────────────────────────────────────────────────────
    await Project.insertMany([
        {
            slug: "newssphere",
            title: "NewsSphere",
            tagline:
                "A full-stack news aggregation platform with personalised feeds and JWT authentication.",
            overview:
                "NewsSphere aggregates news from multiple sources into a single, personalised reading experience. Users can filter by category, save articles, and manage their preferences through a responsive dashboard.",
            challenges:
                "Handling high-frequency API polling without overwhelming the server, and keeping the UI responsive during data fetching across multiple concurrent sources.",
            solutions:
                "Implemented TanStack Query with stale-while-revalidate caching and request deduplication. Designed a category-based query key strategy that minimised redundant network requests.",
            technologies: [
                "React.js",
                "Node.js",
                "Express.js",
                "MongoDB",
                "JWT",
                "TanStack Query",
                "TailwindCSS",
            ],
            links: { live: "", github: "" },
            status: "featured",
            order: 0,
            year: 2024,
        },
        {
            slug: "traceback",
            title: "TraceBack",
            tagline:
                "A lost and found platform with Stripe-powered reward payments and JWT-secured listings.",
            overview:
                "TraceBack connects people who have lost items with those who have found them. Finders can list items, owners can claim them, and Stripe handles optional reward payments securely.",
            challenges:
                "Designing a claim verification flow that prevented fraudulent claims while remaining frictionless for legitimate users. Integrating Stripe webhooks reliably in a stateless REST API.",
            solutions:
                "Built a multi-step claim flow with image verification and admin moderation. Implemented idempotent Stripe webhook handlers with event deduplication using MongoDB unique indexes.",
            technologies: [
                "React.js",
                "Node.js",
                "Express.js",
                "MongoDB",
                "Stripe",
                "JWT",
                "TailwindCSS",
            ],
            links: { live: "", github: "" },
            status: "featured",
            order: 1,
            year: 2024,
        },
    ]);
    console.log("✓ Projects seeded");

    // ── Skills ────────────────────────────────────────────────────────────────
    const skills = [
        // Frontend
        {
            name: "React.js",
            category: "frontend",
            proficiency: "expert",
            projects: ["newssphere", "traceback"],
            order: 0,
        },
        {
            name: "Next.js",
            category: "frontend",
            proficiency: "expert",
            projects: ["newssphere"],
            order: 1,
        },
        {
            name: "TypeScript",
            category: "frontend",
            proficiency: "expert",
            projects: ["newssphere", "traceback"],
            order: 2,
        },
        {
            name: "TailwindCSS",
            category: "frontend",
            proficiency: "expert",
            projects: ["newssphere", "traceback"],
            order: 3,
        },
        {
            name: "shadcn/ui",
            category: "frontend",
            proficiency: "expert",
            projects: ["newssphere"],
            order: 4,
        },
        {
            name: "Framer Motion",
            category: "frontend",
            proficiency: "proficient",
            projects: [],
            order: 5,
        },
        {
            name: "TanStack Query",
            category: "frontend",
            proficiency: "proficient",
            projects: ["newssphere"],
            order: 6,
        },
        // Backend
        {
            name: "Node.js",
            category: "backend",
            proficiency: "proficient",
            projects: ["newssphere", "traceback"],
            order: 0,
        },
        {
            name: "Express.js",
            category: "backend",
            proficiency: "proficient",
            projects: ["newssphere", "traceback"],
            order: 1,
        },
        {
            name: "JWT",
            category: "backend",
            proficiency: "proficient",
            projects: ["newssphere", "traceback"],
            order: 2,
        },
        {
            name: "Stripe",
            category: "backend",
            proficiency: "proficient",
            projects: ["traceback"],
            order: 3,
        },
        // Database
        {
            name: "MongoDB",
            category: "database",
            proficiency: "proficient",
            projects: ["newssphere", "traceback"],
            order: 0,
        },
        {
            name: "Mongoose",
            category: "database",
            proficiency: "proficient",
            projects: ["newssphere", "traceback"],
            order: 1,
        },
        {
            name: "Firebase",
            category: "database",
            proficiency: "familiar",
            projects: [],
            order: 2,
        },
        // DevOps
        {
            name: "Docker",
            category: "devops",
            proficiency: "familiar",
            projects: [],
            order: 0,
        },
        {
            name: "Vercel",
            category: "devops",
            proficiency: "proficient",
            projects: ["newssphere"],
            order: 1,
        },
        {
            name: "Netlify",
            category: "devops",
            proficiency: "proficient",
            projects: [],
            order: 2,
        },
        {
            name: "Hostinger",
            category: "devops",
            proficiency: "familiar",
            projects: [],
            order: 3,
        },
        // Tooling
        {
            name: "Git & GitHub",
            category: "tooling",
            proficiency: "expert",
            projects: [],
            order: 0,
        },
        {
            name: "Figma",
            category: "tooling",
            proficiency: "proficient",
            projects: [],
            order: 1,
        },
        {
            name: "Postman",
            category: "tooling",
            proficiency: "proficient",
            projects: [],
            order: 2,
        },
        {
            name: "Vite",
            category: "tooling",
            proficiency: "proficient",
            projects: [],
            order: 3,
        },
    ];
    await Skill.insertMany(skills);
    console.log("✓ Skills seeded");

    // ── Certifications ────────────────────────────────────────────────────────
    await Cert.create({
        name: "Complete Web Development Course",
        issuer: "Programming Hero",
        year: 2025,
        credentialUrl: "",
        order: 0,
    });
    console.log("✓ Certifications seeded");

    console.log("\n🎉 Seed complete");
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
