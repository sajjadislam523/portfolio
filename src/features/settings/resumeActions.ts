"use server";

import { requireSession } from "@/features/auth/session";
import { connectDB, SiteSettings } from "@/lib/db";
import { IResumeVersion } from "@/types";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

// Sets a resume URL as the active one visible to visitors
export async function setActiveResume(url: string, label: string) {
    await requireSession();
    await connectDB();

    // Save the active URL to SiteSettings — this is what the public site reads
    await SiteSettings.findOneAndUpdate(
        {},
        {
            resumeUrl: url,
            // Store version history as an array inside SiteSettings
            $pull: { resumeVersions: { url } }, // remove if exists to avoid duplicates
        },
        { upsert: true },
    );

    // Push the version with updated isActive flags
    await SiteSettings.findOneAndUpdate(
        {},
        {
            $push: {
                resumeVersions: {
                    url,
                    label,
                    isActive: true,
                    uploadedAt: new Date(),
                },
            },
        },
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
}

// Deletes a resume from Vercel Blob and removes it from version history
export async function deleteResumeVersion(url: string) {
    await requireSession();

    // Delete from Vercel Blob
    try {
        await del(url);
    } catch (err) {
        console.error("[deleteResumeVersion] blob delete failed:", err);
        // Continue — remove from DB even if blob delete fails
    }

    // Remove from version history in DB
    await connectDB();
    await SiteSettings.findOneAndUpdate(
        {},
        { $pull: { resumeVersions: { url } } },
    );

    revalidatePath("/admin/settings");
    return { success: true };
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(iso));
}

// Fetches all resume versions from DB
export async function getResumeVersions(): Promise<{
    versions: IResumeVersion[];
    activeUrl: string;
}> {
    await requireSession();
    await connectDB();

    const settings = await SiteSettings.findOne({})
        .select("resumeUrl resumeVersions")
        .lean();

    const versions = (settings?.resumeVersions ?? [])
        .map((v: IResumeVersion) => ({
            url: v.url,
            label: v.label,
            size: v.size ?? 0,
            uploadedAt: formatDate(v.uploadedAt),
            isActive: settings?.resumeUrl === v.url,
            filename: v.filename ?? v.label,
        }))
        .sort(
            (a: IResumeVersion, b: IResumeVersion) =>
                new Date(b.uploadedAt).getTime() -
                new Date(a.uploadedAt).getTime(),
        );

    return {
        versions,
        activeUrl: settings?.resumeUrl ?? "",
    };
}
