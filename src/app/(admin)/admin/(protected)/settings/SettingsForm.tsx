"use client";

import { AdminButton } from "@/components/admin/AdminButton";
import {
    FormField,
    inputClass,
    textareaClass,
} from "@/components/admin/FormField";
import { updateSiteSettings } from "@/features/settings/actions";
import type { ISiteSettings, ISocialLink } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface SettingsFormProps {
    settings: ISiteSettings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();
    const [socialLinks, setSocialLinks] = useState<ISocialLink[]>(
        settings?.socialLinks ?? [],
    );

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const base = new FormData(e.currentTarget);

        // Inject social links manually since they're managed in state
        const fd = new FormData();
        for (const [k, v] of base.entries()) {
            fd.append(k, v);
        }
        socialLinks.forEach((link, i) => {
            fd.append(`socialLinks[${i}].platform`, link.platform);
            fd.append(`socialLinks[${i}].url`, link.url);
            fd.append(`socialLinks[${i}].icon`, link.icon ?? "");
        });

        startTransition(async () => {
            const result = await updateSiteSettings(fd);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Settings saved");
            }
        });
    }

    function addSocialLink() {
        setSocialLinks((prev) => [
            ...prev,
            { platform: "", url: "", icon: "" },
        ]);
    }

    function removeSocialLink(idx: number) {
        setSocialLinks((prev) => prev.filter((_, i) => i !== idx));
    }

    function updateSocialLink(
        idx: number,
        field: keyof ISocialLink,
        value: string,
    ) {
        setSocialLinks((prev) =>
            prev.map((link, i) =>
                i === idx ? { ...link, [field]: value } : link,
            ),
        );
    }

    const s = settings;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* ── Identity ── */}
            <Section title="Identity">
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Your name" name="name" required>
                        <input
                            name="name"
                            defaultValue={s?.name}
                            className={inputClass}
                            required
                        />
                    </FormField>
                    <FormField label="Location" name="location">
                        <input
                            name="location"
                            defaultValue={s?.location}
                            placeholder="Dhaka, Bangladesh"
                            className={inputClass}
                        />
                    </FormField>
                </div>
                <FormField
                    label="Tagline"
                    name="tagline"
                    hint="One-line description shown in the hero"
                >
                    <input
                        name="tagline"
                        defaultValue={s?.tagline}
                        placeholder="Full stack engineer. Product-minded."
                        className={inputClass}
                    />
                </FormField>
                <FormField
                    label="Bio"
                    name="bio"
                    hint="Short paragraph about you"
                >
                    <textarea
                        name="bio"
                        defaultValue={s?.bio}
                        className={textareaClass}
                        style={{ minHeight: "90px" }}
                    />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Email" name="email" required>
                        <input
                            name="email"
                            type="email"
                            defaultValue={s?.email}
                            className={inputClass}
                            required
                        />
                    </FormField>
                    <FormField label="Phone" name="phone">
                        <input
                            name="phone"
                            type="tel"
                            defaultValue={s?.phone}
                            className={inputClass}
                        />
                    </FormField>
                </div>
                <FormField
                    label="Resume URL"
                    name="resumeUrl"
                    hint="Direct link to your PDF resume"
                >
                    <input
                        name="resumeUrl"
                        type="url"
                        defaultValue={s?.resumeUrl}
                        placeholder="https://..."
                        className={inputClass}
                    />
                </FormField>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            name="availableForWork"
                            type="hidden"
                            value="false"
                        />
                        <input
                            name="availableForWork"
                            type="checkbox"
                            value="true"
                            defaultChecked={s?.availableForWork ?? true}
                            className="w-4 h-4 rounded"
                            style={{ accentColor: "var(--accent)" }}
                        />
                        <span
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Available for work
                        </span>
                    </label>
                </div>
            </Section>

            {/* ── Social links ── */}
            <Section title="Social links">
                <div className="flex flex-col gap-2">
                    {socialLinks.map((link, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end"
                        >
                            <FormField
                                label={idx === 0 ? "Platform" : ""}
                                name={`_sl_platform_${idx}`}
                            >
                                <input
                                    placeholder="GitHub"
                                    value={link.platform}
                                    onChange={(e) =>
                                        updateSocialLink(
                                            idx,
                                            "platform",
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                            <FormField
                                label={idx === 0 ? "URL" : ""}
                                name={`_sl_url_${idx}`}
                            >
                                <input
                                    placeholder="https://github.com/..."
                                    value={link.url}
                                    onChange={(e) =>
                                        updateSocialLink(
                                            idx,
                                            "url",
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                            <FormField
                                label={idx === 0 ? "Icon key" : ""}
                                name={`_sl_icon_${idx}`}
                            >
                                <input
                                    placeholder="github / linkedin / twitter"
                                    value={link.icon ?? ""}
                                    onChange={(e) =>
                                        updateSocialLink(
                                            idx,
                                            "icon",
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                            <button
                                type="button"
                                onClick={() => removeSocialLink(idx)}
                                className="mb-0 p-2 rounded-lg cursor-pointer"
                                style={{ color: "#EF4444" }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSocialLink}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors w-fit cursor-pointer"
                        style={{
                            color: "var(--accent)",
                            background: "var(--accent-glow)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <Plus className="w-4 h-4" /> Add link
                    </button>
                </div>
            </Section>

            {/* ── SEO ── */}
            <Section title="SEO & metadata">
                <FormField
                    label="Page title"
                    name="seo.title"
                    hint="Shown in browser tab and search results (max 70 chars)"
                >
                    <input
                        name="seo.title"
                        defaultValue={s?.seo.title}
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
                        name="seo.description"
                        defaultValue={s?.seo.description}
                        className={textareaClass}
                        style={{ minHeight: "72px" }}
                        maxLength={160}
                    />
                </FormField>
                <FormField
                    label="OG image URL"
                    name="seo.ogImage"
                    hint="1200×630 image for social sharing"
                >
                    <input
                        name="seo.ogImage"
                        type="url"
                        defaultValue={s?.seo.ogImage}
                        placeholder="https://..."
                        className={inputClass}
                    />
                </FormField>
                <FormField
                    label="Keywords"
                    name="seo.keywords"
                    hint="Comma-separated"
                >
                    <input
                        name="seo.keywords"
                        defaultValue={s?.seo.keywords.join(", ")}
                        placeholder="react developer, next.js, typescript"
                        className={inputClass}
                    />
                </FormField>
            </Section>

            {/* ── Active theme (hidden — managed from /admin/themes) ── */}
            <input
                type="hidden"
                name="activeTheme"
                value={s?.activeTheme ?? "midnight"}
            />

            <div
                className="flex gap-3 pt-2 border-t"
                style={{ borderColor: "var(--border)" }}
            >
                <AdminButton type="submit" loading={isPending}>
                    Save settings
                </AdminButton>
            </div>
        </form>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <fieldset className="flex flex-col gap-4">
            <legend
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--text-tertiary)" }}
            >
                {title}
            </legend>
            {children}
        </fieldset>
    );
}
