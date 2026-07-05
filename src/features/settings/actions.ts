"use server";

import { requireSession } from "@/features/auth/session";
import { connectDB, SiteSettings } from "@/lib/db";
import { serialiseDoc } from "@/lib/utils";
import { siteSettingsSchema } from "@/lib/validations";
import type { ISiteSettings } from "@/types";
import { revalidatePath } from "next/cache";

export async function getSiteSettings(): Promise<ISiteSettings | null> {
    await connectDB();
    const doc = await SiteSettings.findOne({}).lean();
    return doc ? serialiseDoc<ISiteSettings>(doc) : null;
}

export async function updateSiteSettings(formData: FormData) {
    await requireSession();

    // Parse social links from indexed form fields: socialLinks[0].platform, etc.
    const socialLinks: { platform: string; url: string; icon: string }[] = [];
    let i = 0;
    while (formData.get(`socialLinks[${i}].platform`)) {
        socialLinks.push({
            platform:
                formData.get(`socialLinks[${i}].platform`)?.toString() ?? "",
            url: formData.get(`socialLinks[${i}].url`)?.toString() ?? "",
            icon: formData.get(`socialLinks[${i}].icon`)?.toString() ?? "",
        });
        i++;
    }

    const raw = {
        name: formData.get("name"),
        tagline: formData.get("tagline") ?? "",
        bio: formData.get("bio") ?? "",
        email: formData.get("email"),
        phone: formData.get("phone") ?? "",
        location: formData.get("location") ?? "",
        resumeUrl: formData.get("resumeUrl") ?? "",
        activeTheme: formData.get("activeTheme") ?? "midnight",
        availableForWork: formData.get("availableForWork") === "true",
        socialLinks,
        seo: {
            title: formData.get("seo.title") ?? "",
            description: formData.get("seo.description") ?? "",
            ogImage: formData.get("seo.ogImage") ?? "",
            keywords: (formData.get("seo.keywords")?.toString() ?? "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
        },
    };

    const parsed = siteSettingsSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    await connectDB();
    await SiteSettings.findOneAndUpdate({}, parsed.data, {
        upsert: true,
        new: true,
    });

    // Revalidate root layout so the new theme / metadata takes effect immediately
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");

    return { success: true };
}

export async function updateActiveTheme(theme: string) {
    await requireSession();

    const validThemes = ["midnight", "ocean", "sunset", "matrix", "aurora"];
    if (!validThemes.includes(theme)) return { error: "Invalid theme" };

    await connectDB();
    await SiteSettings.findOneAndUpdate(
        {},
        { activeTheme: theme },
        { upsert: true },
    );

    revalidatePath("/", "layout");
    revalidatePath("/admin/themes");

    return { success: true };
}

export async function updateOgImage(
    url: string,
): Promise<{ success?: boolean; error?: string }> {
    await requireSession();
    await connectDB();

    await SiteSettings.findOneAndUpdate(
        {},
        { "seo.ogImage": url },
        { upsert: true },
    );

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");

    return { success: true };
}
