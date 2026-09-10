"use server";

import { requireSession } from "@/features/auth/session";
import { connectDB, SiteSettings } from "@/lib/db";
import type { ActionResult } from "@/lib/utils";
import { serialiseDoc } from "@/lib/utils";
import type { ISiteSettings, ISocialLink } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getSiteSettings(): Promise<ISiteSettings | null> {
    await connectDB();
    const doc = await SiteSettings.findOne({}).lean();
    return doc ? serialiseDoc<ISiteSettings>(doc) : null;
}

function revalidateSite() {
    // Revalidate root layout so metadata/nav takes effect immediately.
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/profile");
    revalidatePath("/admin/hero");
    revalidatePath("/admin/social-links");
    revalidatePath("/admin/seo");
}

// Each page below owns one slice of the SiteSettings singleton and writes
// it with `$set` on only its own keys — never the whole document — so
// splitting the old one-page form into Profile/Hero/Social Links/SEO pages
// can't silently blank out fields another page owns.

// ─── Profile ────────────────────────────────────────────────────────────────

const profileSchema = z.object({
    name: z.string().min(2).max(80),
    location: z.string().max(80),
    bio: z.string().max(1000),
    email: z.string().email(),
    phone: z.string().max(20).optional().or(z.literal("")),
    avatarUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData): Promise<ActionResult> {
    await requireSession();

    const raw = {
        name: formData.get("name"),
        location: formData.get("location") ?? "",
        bio: formData.get("bio") ?? "",
        email: formData.get("email"),
        phone: formData.get("phone") ?? "",
        avatarUrl: formData.get("avatarUrl") ?? "",
    };

    const parsed = profileSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    await connectDB();
    await SiteSettings.findOneAndUpdate({}, { $set: parsed.data }, { upsert: true });
    revalidateSite();
    return { success: true };
}

// ─── Hero (tagline + availability) ────────────────────────────────────────────

export async function updateHero(formData: FormData): Promise<ActionResult> {
    await requireSession();

    const tagline = formData.get("tagline")?.toString() ?? "";
    if (tagline.length > 160) {
        return { error: "Tagline is too long" };
    }

    await connectDB();
    await SiteSettings.findOneAndUpdate(
        {},
        { $set: { tagline, availableForWork: formData.get("availableForWork") === "true" } },
        { upsert: true },
    );
    revalidateSite();
    return { success: true };
}

// ─── Availability only — used by both Hero and System > Settings ────────────

export async function updateAvailability(available: boolean): Promise<ActionResult> {
    await requireSession();
    await connectDB();
    await SiteSettings.findOneAndUpdate(
        {},
        { $set: { availableForWork: available } },
        { upsert: true },
    );
    revalidateSite();
    return { success: true };
}

// ─── Social links ─────────────────────────────────────────────────────────────

const socialLinksSchema = z.array(
    z.object({
        platform: z.string().min(1),
        url: z.string().url(),
        icon: z.string().optional(),
    }),
);

export async function updateSocialLinks(formData: FormData): Promise<ActionResult> {
    await requireSession();

    const socialLinks: ISocialLink[] = [];
    let i = 0;
    while (formData.get(`socialLinks[${i}].platform`)) {
        socialLinks.push({
            platform: formData.get(`socialLinks[${i}].platform`)?.toString() ?? "",
            url: formData.get(`socialLinks[${i}].url`)?.toString() ?? "",
            icon: formData.get(`socialLinks[${i}].icon`)?.toString() ?? "",
        });
        i++;
    }

    const parsed = socialLinksSchema.safeParse(socialLinks);
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    await connectDB();
    await SiteSettings.findOneAndUpdate(
        {},
        { $set: { socialLinks: parsed.data } },
        { upsert: true },
    );
    revalidateSite();
    return { success: true };
}

// ─── SEO ────────────────────────────────────────────────────────────────────
// ogImage is intentionally excluded — it's persisted immediately on upload
// by updateOgImage below, and submitting a stale copy from this form would
// silently revert whatever was last uploaded.

export async function updateSeo(formData: FormData): Promise<ActionResult> {
    await requireSession();

    const title = formData.get("seo.title")?.toString() ?? "";
    const description = formData.get("seo.description")?.toString() ?? "";
    const keywords = (formData.get("seo.keywords")?.toString() ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (title.length > 70) return { error: "Page title is too long" };
    if (description.length > 160) return { error: "Meta description is too long" };

    await connectDB();
    await SiteSettings.findOneAndUpdate(
        {},
        {
            $set: {
                "seo.title": title,
                "seo.description": description,
                "seo.keywords": keywords,
            },
        },
        { upsert: true },
    );
    revalidateSite();
    return { success: true };
}

export async function updateOgImage(url: string): Promise<ActionResult> {
    await requireSession();
    await connectDB();

    await SiteSettings.findOneAndUpdate({}, { "seo.ogImage": url }, { upsert: true });
    revalidateSite();
    return { success: true };
}
