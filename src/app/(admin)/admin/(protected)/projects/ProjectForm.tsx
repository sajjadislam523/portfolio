"use client";

import { AdminButton } from "@/components/admin/AdminButton";
import { FileUpload } from "@/components/admin/FileUpload";
import {
    FormField,
    inputClass,
    selectClass,
    textareaClass,
} from "@/components/admin/FormField";
import { ProjectImagesManager } from "@/components/admin/ProjectImagesManager";
import type { ActionResult } from "@/lib/utils";
import type { IProject } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ProjectFormProps {
    project?: IProject;
    action: (formData: FormData) => Promise<ActionResult>;
}

export function ProjectForm({ project, action }: ProjectFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Images are controlled state — dynamic arrays/upload results can't be
    // captured via plain defaultValue inputs, mirrors the SettingsForm pattern.
    const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
    const [images, setImages] = useState<string[]>(project?.images ?? []);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set("coverImage", coverImage);
        formData.set("images", JSON.stringify(images));

        startTransition(async () => {
            const result = await action(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(project ? "Project updated" : "Project created");
                router.push("/admin/projects");
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
                <FormField label="Title" name="title" required>
                    <input
                        id="title"
                        name="title"
                        defaultValue={project?.title}
                        placeholder="NewsSphere"
                        className={inputClass}
                        required
                    />
                </FormField>

                <FormField
                    label="Slug"
                    name="slug"
                    hint="Auto-generated from title if left blank"
                >
                    <input
                        id="slug"
                        name="slug"
                        defaultValue={project?.slug}
                        placeholder="newssphere"
                        className={inputClass}
                    />
                </FormField>
            </div>

            <FormField
                label="Tagline"
                name="tagline"
                required
                hint="One sentence — shown on project cards"
            >
                <input
                    id="tagline"
                    name="tagline"
                    defaultValue={project?.tagline}
                    placeholder="A news aggregation platform with personalised feeds."
                    className={inputClass}
                    required
                />
            </FormField>

            {/* Cover image — used in list view + this project's OG meta image */}
            <FileUpload
                purpose="project-cover"
                currentUrl={coverImage}
                onUploadComplete={setCoverImage}
                label="Cover image"
                hint="Shown in the projects list and used as this project's social share image. Recommended: 1200×630px."
            />

            {/* Gallery — ordered images shown as a slider on the detail page */}
            <ProjectImagesManager images={images} onChange={setImages} />

            <FormField label="Overview" name="overview" required>
                <textarea
                    id="overview"
                    name="overview"
                    defaultValue={project?.overview}
                    placeholder="Describe what the project does and why it exists..."
                    className={textareaClass}
                    style={{ minHeight: "120px" }}
                    required
                />
            </FormField>

            <FormField
                label="Challenges"
                name="challenges"
                hint="Technical challenges you faced"
            >
                <textarea
                    id="challenges"
                    name="challenges"
                    defaultValue={project?.challenges}
                    placeholder="Describe the main technical challenges..."
                    className={textareaClass}
                />
            </FormField>

            <FormField
                label="Solutions"
                name="solutions"
                hint="How you solved those challenges"
            >
                <textarea
                    id="solutions"
                    name="solutions"
                    defaultValue={project?.solutions}
                    placeholder="Describe how you approached and solved each challenge..."
                    className={textareaClass}
                />
            </FormField>

            <FormField
                label="Technologies"
                name="technologies"
                required
                hint="Comma-separated: React.js, Node.js, MongoDB"
            >
                <input
                    id="technologies"
                    name="technologies"
                    defaultValue={project?.technologies.join(", ")}
                    placeholder="React.js, Node.js, MongoDB, JWT"
                    className={inputClass}
                    required
                />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
                <FormField label="Live URL" name="links.live">
                    <input
                        id="links.live"
                        name="links.live"
                        type="url"
                        defaultValue={project?.links.live}
                        placeholder="https://yourproject.com"
                        className={inputClass}
                    />
                </FormField>

                <FormField label="GitHub URL" name="links.github">
                    <input
                        id="links.github"
                        name="links.github"
                        type="url"
                        defaultValue={project?.links.github}
                        placeholder="https://github.com/you/repo"
                        className={inputClass}
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <FormField label="Status" name="status">
                    <select
                        id="status"
                        name="status"
                        defaultValue={project?.status ?? "featured"}
                        className={selectClass}
                    >
                        <option value="featured">Featured</option>
                        <option value="archived">Archived</option>
                    </select>
                </FormField>

                <FormField label="Year" name="year" required>
                    <input
                        id="year"
                        name="year"
                        type="number"
                        defaultValue={project?.year ?? new Date().getFullYear()}
                        min={2000}
                        max={2100}
                        className={inputClass}
                        required
                    />
                </FormField>

                <FormField
                    label="Order"
                    name="order"
                    hint="Lower = appears first"
                >
                    <input
                        id="order"
                        name="order"
                        type="number"
                        defaultValue={project?.order ?? 0}
                        min={0}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <div
                className="flex items-center gap-3 pt-2 border-t"
                style={{ borderColor: "var(--border)" }}
            >
                <AdminButton type="submit" loading={isPending}>
                    {project ? "Save changes" : "Create project"}
                </AdminButton>
                <AdminButton
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/admin/projects")}
                >
                    Cancel
                </AdminButton>
            </div>
        </form>
    );
}
