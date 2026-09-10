"use server";

import { requireSession } from "@/features/auth/session";
import { connectDB, Exploration } from "@/lib/db";
import type { ActionResult } from "@/lib/utils";
import { serialiseDoc } from "@/lib/utils";
import { explorationSchema } from "@/lib/validations";
import type { IExploration } from "@/types";
import { revalidatePath } from "next/cache";

function withPublishedDefault(doc: IExploration): IExploration {
    return { ...doc, published: doc.published ?? true };
}

export async function getExplorations(): Promise<IExploration[]> {
    await connectDB();
    const docs = await Exploration.find().sort({ order: 1 }).lean();
    return serialiseDoc<IExploration[]>(docs).map(withPublishedDefault);
}

function parseExplorationFormData(formData: FormData) {
    return {
        title: formData.get("title"),
        description: formData.get("description"),
        topics: (formData.get("topics")?.toString() ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        status: formData.get("status") ?? "active",
        startDate: formData.get("startDate"),
        link: formData.get("link") ?? "",
        image: formData.get("image") ?? "",
        ctaLabel: formData.get("ctaLabel") ?? "",
        ctaUrl: formData.get("ctaUrl") ?? "",
        isPrimary: formData.get("isPrimary") === "on",
        published: formData.get("published") !== "false",
        order: Number(formData.get("order") ?? 0),
    };
}

async function clearOtherPrimary(keepId?: string) {
    await Exploration.updateMany(
        { isPrimary: true, ...(keepId ? { _id: { $ne: keepId } } : {}) },
        { $set: { isPrimary: false } },
    );
}

function revalidateExploring(id?: string) {
    revalidatePath("/admin/exploring");
    if (id) revalidatePath(`/admin/exploring/${id}`);
    revalidatePath("/");
}

export async function createExploration(formData: FormData): Promise<ActionResult> {
    await requireSession();

    const raw = parseExplorationFormData(formData);
    const parsed = explorationSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    await connectDB();

    if (parsed.data.isPrimary) await clearOtherPrimary();

    await Exploration.create(parsed.data);
    revalidateExploring();
    return { success: true };
}

export async function updateExploration(
    id: string,
    formData: FormData,
): Promise<ActionResult> {
    await requireSession();

    const raw = parseExplorationFormData(formData);
    const parsed = explorationSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    await connectDB();

    if (parsed.data.isPrimary) await clearOtherPrimary(id);

    await Exploration.findByIdAndUpdate(id, parsed.data);
    revalidateExploring(id);
    return { success: true };
}

export async function deleteExploration(id: string): Promise<ActionResult> {
    await requireSession();
    await connectDB();
    await Exploration.findByIdAndDelete(id);
    revalidateExploring();
    return { success: true };
}

/** Quick action — promotes one exploration to the public section's primary
 *  focus, demoting whichever else held that singleton (same pattern as
 *  Project.featured). Doesn't touch status: an archived item can't become
 *  primary since the public query only ever looks at active ones, but the
 *  flag itself is orthogonal to active/archived here. */
export async function setPrimaryExploration(id: string): Promise<ActionResult> {
    await requireSession();
    await connectDB();
    await clearOtherPrimary(id);
    await Exploration.findByIdAndUpdate(id, { isPrimary: true });
    revalidateExploring(id);
    return { success: true };
}

export async function markExplorationActive(id: string): Promise<ActionResult> {
    await requireSession();
    await connectDB();
    await Exploration.findByIdAndUpdate(id, { status: "active" });
    revalidateExploring(id);
    return { success: true };
}

/** Completing an exploration also clears its primary flag — a completed
 *  item should never be the one the public section leads with. */
export async function completeExploration(id: string): Promise<ActionResult> {
    await requireSession();
    await connectDB();
    await Exploration.findByIdAndUpdate(id, { status: "completed", isPrimary: false });
    revalidateExploring(id);
    return { success: true };
}

export async function reorderExploration(
    id: string,
    direction: "up" | "down",
): Promise<ActionResult> {
    await requireSession();
    await connectDB();

    const items = await Exploration.find().sort({ order: 1 });
    const index = items.findIndex((item) => item._id.toString() === id);
    if (index === -1) return { error: "Exploration not found" };

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return { success: true };

    const current = items[index];
    const swapWith = items[swapIndex];
    const currentOrder = current.order;
    current.order = swapWith.order;
    swapWith.order = currentOrder;

    await current.save();
    await swapWith.save();
    revalidateExploring();
    return { success: true };
}
