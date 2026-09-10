import { z } from "zod";

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(80, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    subject: z
        .string()
        .min(4, "Subject must be at least 4 characters")
        .max(120, "Subject is too long"),
    message: z
        .string()
        .min(20, "Message must be at least 20 characters")
        .max(2000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Project ──────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
    slug: z
        .string()
        .min(2)
        .max(80)
        .regex(
            /^[a-z0-9-]+$/,
            "Slug can only contain lowercase letters, numbers, and hyphens",
        ),
    title: z.string().min(2).max(100),
    tagline: z.string().min(10).max(180),
    overview: z.string().min(20),
    challenges: z.string().default(""),
    solutions: z.string().default(""),
    architectureDiagram: z.string().default(""),
    coverImage: z.string().url().optional().or(z.literal("")),
    images: z.array(z.string().url()).default([]),
    technologies: z.array(z.string()).min(1, "Add at least one technology"),
    links: z.object({
        live: z.string().url().optional().or(z.literal("")),
        github: z.string().url().optional().or(z.literal("")),
    }),
    status: z.enum(["featured", "archived"]).default("featured"),
    role: z
        .string()
        .min(2, "Add a role — it shows in the projects ledger")
        .max(60),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    year: z.number().int().min(2000).max(2100),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// ─── Experience ───────────────────────────────────────────────────────────────

export const experienceSchema = z.object({
    company: z.string().min(2).max(100),
    role: z.string().min(2).max(100),
    location: z.string().min(2).max(100),
    startDate: z.string().date(),
    endDate: z.string().date().nullable(),
    description: z.string().default(""),
    accomplishments: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    published: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// ─── Skill ────────────────────────────────────────────────────────────────────

export const skillSchema = z.object({
    name: z.string().min(1).max(60),
    category: z.enum(["frontend", "backend", "database", "devops", "tooling"]),
    tier: z.enum(["core", "working-knowledge", "exploring"]),
    icon: z.string().max(60).optional().or(z.literal("")),
    description: z.string().max(200).optional().or(z.literal("")),
    visible: z.boolean().default(true),
    projects: z.array(z.string()).default([]),
    order: z.number().int().min(0).default(0),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// ─── Exploration ──────────────────────────────────────────────────────────────

export const explorationSchema = z
    .object({
        title: z.string().min(2).max(100),
        description: z.string().min(10).max(400),
        topics: z.array(z.string()).default([]),
        status: z.enum(["active", "experimenting", "completed"]).default("active"),
        startDate: z.string().date(),
        link: z.string().url().optional().or(z.literal("")),
        image: z.string().url().optional().or(z.literal("")),
        ctaLabel: z.string().max(40).optional().or(z.literal("")),
        ctaUrl: z.string().url().optional().or(z.literal("")),
        isPrimary: z.boolean().default(false),
        published: z.boolean().default(true),
        order: z.number().int().min(0).default(0),
    })
    .refine((data) => Boolean(data.ctaLabel) === Boolean(data.ctaUrl), {
        message: "A CTA needs both a label and a URL",
        path: ["ctaUrl"],
    });

export type ExplorationFormData = z.infer<typeof explorationSchema>;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Site settings validation is scoped per-page (profile/hero/social
// links/SEO), each with its own small schema, directly in
// src/features/settings/actions.ts — there's no single monolithic
// site-settings schema/action anymore now that the CMS settings form is
// split across dedicated pages.
