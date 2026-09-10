"use client";

import { FileUpload } from "@/components/admin/FileUpload";
import { FormField, inputClass, selectClass, textareaClass } from "@/components/admin/FormField";
import { FormSection } from "@/components/admin/FormSection";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Modal } from "@/components/admin/Modal";
import { ProjectImagesManager } from "@/components/admin/ProjectImagesManager";
import { StickyActionBar } from "@/components/admin/StickyActionBar";
import { ProjectShowcase } from "@/components/sections/projects/ProjectShowcase";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import type { ActionResult } from "@/lib/utils";
import type { IProject } from "@/types";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

interface ProjectFormProps {
    project?: IProject;
    action: (formData: FormData) => Promise<ActionResult>;
}

export function ProjectForm({ project, action }: ProjectFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);
    const publishIntent = useRef<boolean | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    // Images are controlled state — dynamic arrays/upload results can't be
    // captured via plain defaultValue inputs, mirrors the old settings pattern.
    const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
    const [images, setImages] = useState<string[]>(project?.images ?? []);
    const [title, setTitle] = useState(project?.title ?? "");
    const [tagline, setTagline] = useState(project?.tagline ?? "");
    const [technologies, setTechnologies] = useState(project?.technologies.join(", ") ?? "");

    const isDirty =
        coverImage !== (project?.coverImage ?? "") ||
        JSON.stringify(images) !== JSON.stringify(project?.images ?? []);
    const { confirmLeave } = useUnsavedChanges(isDirty);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set("coverImage", coverImage);
        formData.set("images", JSON.stringify(images));
        if (publishIntent.current !== null) {
            formData.set("published", publishIntent.current ? "true" : "false");
        }

        startTransition(async () => {
            const result = await action(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(project ? "Project saved" : "Project created");
                router.push("/admin/projects");
            }
        });
    }

    function handleCancel() {
        if (!confirmLeave()) return;
        router.push("/admin/projects");
    }

    function triggerSubmit(published: boolean) {
        publishIntent.current = published;
        formRef.current?.requestSubmit();
    }

    const previewProject: IProject = {
        _id: project?._id ?? "preview",
        slug: project?.slug ?? "preview",
        title: title || "Untitled project",
        tagline: tagline || "Add a short description to see it here.",
        overview: project?.overview ?? "",
        challenges: project?.challenges ?? "",
        solutions: project?.solutions ?? "",
        coverImage,
        images,
        technologies: technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        links: project?.links ?? {},
        status: "featured",
        role: project?.role ?? "",
        featured: project?.featured ?? false,
        published: true,
        order: project?.order ?? 0,
        year: project?.year ?? new Date().getFullYear(),
        createdAt: project?.createdAt ?? new Date().toISOString(),
        updatedAt: project?.updatedAt ?? new Date().toISOString(),
    };

    return (
        <>
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl pb-4">
                <FormSection title="Basic information">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Title" name="title" required>
                            <input
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="NewsSphere"
                                className={inputClass}
                                required
                            />
                        </FormField>
                        <FormField label="Slug" name="slug" hint="Auto-generated from title if left blank">
                            <input
                                name="slug"
                                defaultValue={project?.slug}
                                placeholder="newssphere"
                                className={inputClass}
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Short description"
                        name="tagline"
                        required
                        hint="One sentence — shown on project cards"
                    >
                        <input
                            name="tagline"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="A news aggregation platform with personalised feeds."
                            className={inputClass}
                            required
                        />
                    </FormField>

                    <FormField label="Long description" name="overview" required>
                        <textarea
                            name="overview"
                            defaultValue={project?.overview}
                            placeholder="Describe what the project does and why it exists..."
                            className={textareaClass}
                            style={{ minHeight: "120px" }}
                            required
                        />
                    </FormField>

                    <FormField label="Challenges" name="challenges" hint="Technical challenges you faced">
                        <textarea
                            name="challenges"
                            defaultValue={project?.challenges}
                            className={textareaClass}
                        />
                    </FormField>

                    <FormField label="Solutions" name="solutions" hint="How you solved those challenges">
                        <textarea
                            name="solutions"
                            defaultValue={project?.solutions}
                            className={textareaClass}
                        />
                    </FormField>
                </FormSection>

                <FormSection title="Classification">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="Role"
                            name="role"
                            required
                            hint="Your role on this project — shown in the projects ledger"
                        >
                            <input
                                name="role"
                                defaultValue={project?.role}
                                placeholder="Full stack"
                                className={inputClass}
                                required
                            />
                        </FormField>
                        <FormField label="Year" name="year" required>
                            <input
                                name="year"
                                type="number"
                                defaultValue={project?.year ?? new Date().getFullYear()}
                                min={2000}
                                max={2100}
                                className={inputClass}
                                required
                            />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Technologies">
                    <FormField
                        label="Technologies"
                        name="technologies"
                        required
                        hint="Comma-separated — the first few read as primary in the list"
                    >
                        <input
                            name="technologies"
                            value={technologies}
                            onChange={(e) => setTechnologies(e.target.value)}
                            placeholder="React.js, Node.js, MongoDB, JWT"
                            className={inputClass}
                            required
                        />
                    </FormField>
                </FormSection>

                <FormSection title="Media">
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <span />
                            <MediaPicker purpose="project-cover" onSelect={setCoverImage} />
                        </div>
                        <FileUpload
                            purpose="project-cover"
                            currentUrl={coverImage}
                            onUploadComplete={setCoverImage}
                            label="Cover image"
                            hint="Shown in the projects list and used as this project's social share image. Recommended: 1200×630px."
                        />
                    </div>
                    <ProjectImagesManager images={images} onChange={setImages} />
                </FormSection>

                <FormSection title="Links">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Live URL" name="links.live">
                            <input
                                name="links.live"
                                type="url"
                                defaultValue={project?.links.live}
                                placeholder="https://yourproject.com"
                                className={inputClass}
                            />
                        </FormField>
                        <FormField label="GitHub URL" name="links.github">
                            <input
                                name="links.github"
                                type="url"
                                defaultValue={project?.links.github}
                                placeholder="https://github.com/you/repo"
                                className={inputClass}
                            />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Publishing" className="border-b-0 pb-0">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Showcase placement" name="status">
                            <select name="status" defaultValue={project?.status ?? "featured"} className={selectClass}>
                                <option value="featured">Main showcase</option>
                                <option value="archived">Archive</option>
                            </select>
                        </FormField>
                        <FormField label="Order" name="order" hint="Lower = appears first">
                            <input
                                name="order"
                                type="number"
                                defaultValue={project?.order ?? 0}
                                min={0}
                                className={inputClass}
                            />
                        </FormField>
                    </div>

                    <label
                        className="flex items-start gap-3 rounded-lg p-4"
                        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                    >
                        <input
                            type="checkbox"
                            name="featured"
                            defaultChecked={project?.featured ?? false}
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ accentColor: "var(--accent)" }}
                        />
                        <span className="flex flex-col gap-1">
                            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                Lead row on the homepage
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                Renders this project first, at double weight, with a 16:9 cover.
                                Checking it clears the flag on every other project.
                            </span>
                        </span>
                    </label>

                    <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="w-fit text-xs transition-colors hover:opacity-80"
                        style={{ color: "var(--accent)" }}
                    >
                        Preview →
                    </button>
                </FormSection>

                <StickyActionBar
                    onCancel={handleCancel}
                    onSaveDraft={() => triggerSubmit(false)}
                    onPublish={() => triggerSubmit(true)}
                    saving={isPending}
                    publishLabel={project ? "Save & publish" : "Publish"}
                />
            </form>

            <Modal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title="Preview"
                description="Renders the actual public showcase component with your current, unsaved changes."
                maxWidth="max-w-3xl"
            >
                <div style={{ background: "var(--bg-primary)" }} className="rounded-lg p-6">
                    <ProjectShowcase project={previewProject} displayIndex="01" />
                </div>
            </Modal>
        </>
    );
}
