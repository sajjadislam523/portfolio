"use server";

import { requireSession } from "@/features/auth/session";
import { connectDB, Media } from "@/lib/db";
import type { ActionResult } from "@/lib/utils";
import { serialiseDoc } from "@/lib/utils";
import type { IMedia } from "@/types";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function getMedia(): Promise<IMedia[]> {
    await requireSession();
    await connectDB();
    const docs = await Media.find().sort({ uploadedAt: -1 }).lean();
    return serialiseDoc<IMedia[]>(docs);
}

/** Called from /api/upload after every successful blob upload — the single
 *  choke point for every purpose (resume included), so no per-caller
 *  wiring is needed. Best-effort: a failure here must never fail the
 *  upload response itself, since the file is already safely in Blob. */
export async function recordMedia(params: {
    url: string;
    pathname: string;
    filename: string;
    type: string;
    size: number;
    purpose: string;
}): Promise<void> {
    try {
        await connectDB();
        await Media.create({ ...params, uploadedAt: new Date() });
    } catch (err) {
        console.error("[recordMedia] failed to record upload:", err);
    }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
    await requireSession();
    await connectDB();

    const doc = await Media.findById(id);
    if (!doc) return { error: "File not found" };

    try {
        await del(doc.url);
    } catch (err) {
        console.error("[deleteMedia] blob delete failed:", err);
        // Continue — remove the record even if the blob is already gone
    }

    await Media.findByIdAndDelete(id);
    revalidatePath("/admin/media");
    return { success: true };
}
