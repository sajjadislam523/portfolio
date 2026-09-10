"use client";

import { AdminButton } from "@/components/admin/AdminButton";
import { FormField, inputClass } from "@/components/admin/FormField";
import { updateSocialLinks } from "@/features/settings/actions";
import type { ISocialLink } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function SocialLinksForm({ initialLinks }: { initialLinks: ISocialLink[] }) {
    const [isPending, startTransition] = useTransition();
    const [links, setLinks] = useState<ISocialLink[]>(initialLinks);

    function add() {
        setLinks((prev) => [...prev, { platform: "", url: "", icon: "" }]);
    }

    function remove(idx: number) {
        setLinks((prev) => prev.filter((_, i) => i !== idx));
    }

    function update(idx: number, field: keyof ISocialLink, value: string) {
        setLinks((prev) => prev.map((link, i) => (i === idx ? { ...link, [field]: value } : link)));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData();
        links.forEach((link, i) => {
            fd.append(`socialLinks[${i}].platform`, link.platform);
            fd.append(`socialLinks[${i}].url`, link.url);
            fd.append(`socialLinks[${i}].icon`, link.icon ?? "");
        });

        startTransition(async () => {
            const result = await updateSocialLinks(fd);
            if (result.error) toast.error(result.error);
            else toast.success("Social links saved");
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {links.map((link, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2">
                        <FormField label={idx === 0 ? "Platform" : ""} name={`_sl_platform_${idx}`}>
                            <input
                                placeholder="GitHub"
                                value={link.platform}
                                onChange={(e) => update(idx, "platform", e.target.value)}
                                className={inputClass}
                            />
                        </FormField>
                        <FormField label={idx === 0 ? "URL" : ""} name={`_sl_url_${idx}`}>
                            <input
                                placeholder="https://github.com/..."
                                value={link.url}
                                onChange={(e) => update(idx, "url", e.target.value)}
                                className={inputClass}
                            />
                        </FormField>
                        <FormField label={idx === 0 ? "Icon key" : ""} name={`_sl_icon_${idx}`}>
                            <input
                                placeholder="github / linkedin / twitter"
                                value={link.icon ?? ""}
                                onChange={(e) => update(idx, "icon", e.target.value)}
                                className={inputClass}
                            />
                        </FormField>
                        <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="mb-0 rounded-lg p-2"
                            style={{ color: "var(--destructive)" }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={add}
                    className="flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                    style={{
                        color: "var(--accent)",
                        background: "var(--accent-glow)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <Plus className="h-4 w-4" /> Add link
                </button>
            </div>

            <div className="flex gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <AdminButton type="submit" loading={isPending}>
                    Save changes
                </AdminButton>
            </div>
        </form>
    );
}
