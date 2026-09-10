"use server";

import { requireSession } from "@/features/auth/session";
import { connectDB, Project } from "@/lib/db";
import type { ActionResult } from "@/lib/utils";
import { serialiseDoc, slugify } from "@/lib/utils";
import { projectSchema } from "@/lib/validations";
import type { IProject } from "@/types";
import { revalidatePath } from "next/cache";

// `.lean()` skips Mongoose defaults, so a project saved before `published`
// existed comes back with the key entirely absent — coalesce here rather
// than relying on the schema default, or every pre-existing project would
// silently vanish from admin lists (though not from the public site, which
// separately treats a missing field as published via `{ $ne: false }`).
function withPublishedDefault(doc: IProject): IProject {
    return { ...doc, published: doc.published ?? true };
}

export async function getProjects(): Promise<IProject[]> {
    await connectDB();
    const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    return serialiseDoc<IProject[]>(docs).map(withPublishedDefault);
}

export async function getProjectById(id: string): Promise<IProject | null> {
    await connectDB();
    const doc = await Project.findById(id).lean();
    return doc ? withPublishedDefault(serialiseDoc<IProject>(doc)) : null;
}

function parseProjectFormData(formData: FormData) {
    // images comes in as a JSON-stringified array — controlled state in
    // ProjectForm since a dynamic list of uploaded URLs can't be captured
    // via plain defaultValue inputs.
    let images: string[] = [];
    try {
        images = JSON.parse(formData.get("images")?.toString() ?? "[]");
    } catch {
        images = [];
    }

    return {
        slug:
            formData.get("slug")?.toString().trim() ||
            slugify(formData.get("title")?.toString() ?? ""),
        title: formData.get("title"),
        tagline: formData.get("tagline"),
        overview: formData.get("overview"),
        challenges: formData.get("challenges") ?? "",
        solutions: formData.get("solutions") ?? "",
        architectureDiagram: formData.get("architectureDiagram") ?? "",
        coverImage: formData.get("coverImage") ?? "",
        images,
        technologies: (formData.get("technologies")?.toString() ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        links: {
            live: formData.get("links.live") ?? "",
            github: formData.get("links.github") ?? "",
        },
        status: formData.get("status") ?? "featured",
        role: formData.get("role")?.toString().trim() ?? "",
        featured: formData.get("featured") === "on",
        // Explicit "true"/"false" (not a bare checkbox) — the sticky action
        // bar's Save Draft / Publish buttons set this before submitting,
        // rather than a checkbox whose "unchecked" state is indistinguishable
        // from "field never rendered."
        published: formData.get("published") !== "false",
        order: Number(formData.get("order") ?? 0),
        year: Number(formData.get("year") ?? new Date().getFullYear()),
    };
}

async function clearOtherFeatured(keepId?: string) {
    await Project.updateMany(
        { featured: true, ...(keepId ? { _id: { $ne: keepId } } : {}) },
        { $set: { featured: false } },
    );
}

export async function createProject(formData: FormData): Promise<ActionResult> {
    await requireSession();

    const raw = parseProjectFormData(formData);
    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    await connectDB();

    const existing = await Project.findOne({ slug: parsed.data.slug });
    if (existing) {
        return { error: "A project with this slug already exists." };
    }

    if (parsed.data.featured) await clearOtherFeatured();

    await Project.create(parsed.data);

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true };
}

export async function updateProject(
    id: string,
    formData: FormData,
): Promise<ActionResult> {
    await requireSession();

    const raw = parseProjectFormData(formData);
    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    await connectDB();

    const existing = await Project.findOne({
        slug: parsed.data.slug,
        _id: { $ne: id },
    });
    if (existing) {
        return { error: "A project with this slug already exists." };
    }

    if (parsed.data.featured) await clearOtherFeatured(id);

    await Project.findByIdAndUpdate(id, parsed.data, { new: true });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/projects");
    revalidatePath(`/projects/${parsed.data.slug}`);
    revalidatePath("/");

    return { success: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
    await requireSession();
    await connectDB();
    await Project.findByIdAndDelete(id);
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
}

export async function togglePublished(id: string, published: boolean): Promise<ActionResult> {
    await requireSession();
    await connectDB();
    await Project.findByIdAndUpdate(id, { published });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
}

export async function setProjectStatus(
    id: string,
    status: "featured" | "archived",
): Promise<ActionResult> {
    await requireSession();
    await connectDB();
    await Project.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
}

export async function duplicateProject(id: string): Promise<ActionResult> {
    await requireSession();
    await connectDB();

    const original = await Project.findById(id).lean();
    if (!original) return { error: "Project not found" };

    const baseSlug = `${original.slug}-copy`;
    let slug = baseSlug;
    let n = 2;
    while (await Project.findOne({ slug })) {
        slug = `${baseSlug}-${n}`;
        n++;
    }

    const maxOrder = await Project.findOne().sort({ order: -1 }).select("order").lean();

    const rest = { ...original };
    delete (rest as { _id?: unknown })._id;
    delete (rest as { createdAt?: unknown }).createdAt;
    delete (rest as { updatedAt?: unknown }).updatedAt;
    await Project.create({
        ...rest,
        slug,
        title: `${original.title} (copy)`,
        featured: false,
        published: false,
        order: (maxOrder?.order ?? 0) + 1,
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
}

export async function reorderProject(
    id: string,
    direction: "up" | "down",
): Promise<ActionResult> {
    await requireSession();
    await connectDB();

    const items = await Project.find().sort({ order: 1 });
    const index = items.findIndex((item) => item._id.toString() === id);
    if (index === -1) return { error: "Project not found" };

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return { success: true };

    const current = items[index];
    const swapWith = items[swapIndex];
    const currentOrder = current.order;
    current.order = swapWith.order;
    swapWith.order = currentOrder;

    await current.save();
    await swapWith.save();
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true };
}
