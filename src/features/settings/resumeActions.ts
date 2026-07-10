"use server";

import { requireSession } from "@/features/auth/session";
import { connectDB, SiteSettings } from "@/lib/db";
import type { IResumeVersion } from "@/types";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

// ── recordResumeUpload ────────────────────────────────────────────────────────
// Called after a NEW file is uploaded to Vercel Blob.
// Stores full metadata, sets this version as active, deactivates all others.
export async function recordResumeUpload(
    url: string,
    label: string,
    filename: string,
    size: number,
) {
    await requireSession();
    await connectDB();

    const newVersion = {
        url,
        label,
        filename,
        size,
        uploadedAt: new Date(),
    };

    await SiteSettings.findOneAndUpdate(
        {},
        {
            resumeUrl: url,
            $push: { resumeVersions: newVersion },
        },
        { upsert: true },
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
}

// ── setActiveResumeUrl ────────────────────────────────────────────────────────
// Called when the admin clicks "Set as active" on an EXISTING version.
// Only updates the active pointer — never mutates version history timestamps.
export async function setActiveResumeUrl(url: string) {
    await requireSession();
    await connectDB();

    await SiteSettings.findOneAndUpdate(
        {},
        { resumeUrl: url },
        { upsert: true },
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
}

// ── deleteResumeVersion ───────────────────────────────────────────────────────
// Deletes a resume from Vercel Blob and removes it from version history.
// Guarded in the UI so the active version cannot be deleted — but we
// double-check here for safety.
export async function deleteResumeVersion(url: string) {
    await requireSession();
    await connectDB();

    const settings = (await SiteSettings.findOne({})
        .select("resumeUrl")
        .lean()) as any;
    if (settings?.resumeUrl === url) {
        return {
            error: "Cannot delete the active resume. Set another version as active first.",
        };
    }

    // Delete from Vercel Blob
    try {
        await del(url);
    } catch (err) {
        console.error("[deleteResumeVersion] blob delete failed:", err);
        // Continue — remove from DB even if blob delete fails (blob may already be gone)
    }

    await SiteSettings.findOneAndUpdate(
        {},
        { $pull: { resumeVersions: { url } } },
    );

    revalidatePath("/admin/settings");
    return { success: true };
}

// ── getResumeVersions ─────────────────────────────────────────────────────────
// Returns all resume versions sorted newest-first with isActive computed.
export async function getResumeVersions(): Promise<{
    versions: IResumeVersion[];
    activeUrl: string;
}> {
    await requireSession();
    await connectDB();

    const settings = (await SiteSettings.findOne({})
        .select("resumeUrl resumeVersions")
        .lean()) as any;

    const activeUrl = settings?.resumeUrl ?? "";

    const versions: IResumeVersion[] = (settings?.resumeVersions ?? [])
        .map((v: any) => ({
            url: v.url,
            label: v.label ?? "",
            filename: v.filename ?? v.label ?? "",
            size: v.size ?? 0,
            uploadedAt:
                v.uploadedAt instanceof Date
                    ? v.uploadedAt.toISOString()
                    : (v.uploadedAt ?? new Date().toISOString()),
            isActive: activeUrl === v.url,
        }))
        .sort(
            (a: IResumeVersion, b: IResumeVersion) =>
                new Date(b.uploadedAt).getTime() -
                new Date(a.uploadedAt).getTime(),
        );

    return { versions, activeUrl };
}
