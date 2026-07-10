"use client";

import { AdminButton } from "@/components/admin/AdminButton";
import { FileUpload } from "@/components/admin/FileUpload";
import {
    FormField,
    inputClass,
    textareaClass,
} from "@/components/admin/FormField";
import { ResumeManager } from "@/components/admin/ResumeManager";
import { updateOgImage, updateSiteSettings } from "@/features/settings/actions";
import type { IResumeVersion, ISiteSettings, ISocialLink } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface SettingsFormProps {
    settings: ISiteSettings | null;
    resumeVersions: IResumeVersion[];
    activeResumeUrl: string;
}

export function SettingsForm({
    settings,
    resumeVersions,
    activeResumeUrl,
}: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();

    // Social links — managed in state so rows can be added/removed
    const [socialLinks, setSocialLinks] = useState<ISocialLink[]>(
        settings?.socialLinks ?? [],
    );

    // Availability toggle — controlled to fix the hidden+checkbox bug
    const [availableForWork, setAvailableForWork] = useState(
        settings?.availableForWork ?? true,
    );

    // File URLs — managed in state so FileUpload can update them
    const [resumeUrl, setResumeUrl] = useState(settings?.resumeUrl ?? "");
    const [ogImageUrl, setOgImageUrl] = useState(settings?.seo?.ogImage ?? "");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const base = new FormData(e.currentTarget);
        const fd = new FormData();

        for (const [k, v] of base.entries()) {
            fd.append(k, v);
        }

        // Inject controlled values — not safe to rely on hidden inputs
        fd.set("availableForWork", availableForWork ? "true" : "false");
        fd.set("resumeUrl", resumeUrl);
        fd.set("seo.ogImage", ogImageUrl);

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

    function handleOgImageUpload(url: string) {
        setOgImageUrl(url);
        startTransition(async () => {
            const result = await updateOgImage(url);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("OG image saved");
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

                {/* Resume upload */}
                <ResumeManager
                    versions={resumeVersions}
                    activeUrl={activeResumeUrl}
                />

                {/* Availability toggle */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        role="switch"
                        aria-checked={availableForWork}
                        onClick={() => setAvailableForWork((v) => !v)}
                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 shrink-0 cursor-pointer"
                        style={{
                            background: availableForWork
                                ? "var(--accent)"
                                : "var(--bg-subtle)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <span
                            className="inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200"
                            style={{
                                background: "#fff",
                                transform: availableForWork
                                    ? "translateX(18px)"
                                    : "translateX(2px)",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                            }}
                        />
                    </button>
                    <span
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Available for work
                    </span>
                    <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                            background: availableForWork
                                ? "rgba(34,197,94,0.1)"
                                : "var(--bg-subtle)",
                            color: availableForWork
                                ? "#22C55E"
                                : "var(--text-tertiary)",
                            border: `1px solid ${availableForWork ? "rgba(34,197,94,0.25)" : "var(--border)"}`,
                        }}
                    >
                        {availableForWork
                            ? "Open to opportunities"
                            : "Not available"}
                    </span>
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

                {/* OG image upload */}
                <FileUpload
                    purpose="og"
                    currentUrl={ogImageUrl}
                    onUploadComplete={handleOgImageUpload}
                    label="OG image"
                    hint="Used for social sharing previews. Recommended size: 1200×630px."
                />

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

            <input
                type="hidden"
                name="activeTheme"
                value={s?.activeTheme ?? "midnight"}
            />

            <div
                className="flex gap-3 pt-2 border-t"
                style={{ borderColor: "var(--border)" }}
            >
                <AdminButton
                    type="submit"
                    loading={isPending}
                    className="cursor-pointer"
                >
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
