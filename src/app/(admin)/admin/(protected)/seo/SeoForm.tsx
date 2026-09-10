"use client";

import { AdminButton } from "@/components/admin/AdminButton";
import { FileUpload } from "@/components/admin/FileUpload";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { updateOgImage, updateSeo } from "@/features/settings/actions";
import type { ISiteSettings } from "@/types";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function SeoForm({ settings }: { settings: ISiteSettings | null }) {
    const [isPending, startTransition] = useTransition();
    const [title, setTitle] = useState(settings?.seo.title ?? "");
    const [description, setDescription] = useState(settings?.seo.description ?? "");
    const [keywords, setKeywords] = useState(settings?.seo.keywords.join(", ") ?? "");
    // ogImage is persisted immediately on upload (see handleOgImageUpload) —
    // not part of the main submit, same reasoning as the old SettingsForm.
    const [ogImageUrl, setOgImageUrl] = useState(settings?.seo.ogImage ?? "");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData();
        fd.set("seo.title", title);
        fd.set("seo.description", description);
        fd.set("seo.keywords", keywords);

        startTransition(async () => {
            const result = await updateSeo(fd);
            if (result.error) toast.error(result.error);
            else toast.success("SEO settings saved");
        });
    }

    function handleOgImageUpload(url: string) {
        setOgImageUrl(url);
        startTransition(async () => {
            const result = await updateOgImage(url);
            if (result.error) toast.error(result.error);
            else toast.success("OG image saved");
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
                label="Page title"
                name="seo.title"
                hint="Shown in browser tab and search results (max 70 chars)"
            >
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                    maxLength={70}
                />
            </FormField>

            <FormField
                label="Meta description"
                name="seo.description"
                hint="Shown in search result snippets (max 160 chars)"
            >
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={textareaClass}
                    style={{ minHeight: "72px" }}
                    maxLength={160}
                />
            </FormField>

            <div>
                <div className="mb-1.5 flex items-center justify-between">
                    <span />
                    <MediaPicker purpose="og" onSelect={handleOgImageUpload} />
                </div>
                <FileUpload
                    purpose="og"
                    currentUrl={ogImageUrl}
                    onUploadComplete={handleOgImageUpload}
                    label="OG image"
                    hint="Used for social sharing previews. Recommended size: 1200×630px."
                />
            </div>

            <FormField label="Keywords" name="seo.keywords" hint="Comma-separated">
                <input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="react developer, next.js, typescript"
                    className={inputClass}
                />
            </FormField>

            <div className="flex gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <AdminButton type="submit" loading={isPending}>
                    Save changes
                </AdminButton>
            </div>
        </form>
    );
}
