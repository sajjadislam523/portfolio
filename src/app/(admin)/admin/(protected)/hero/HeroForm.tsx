"use client";

import { AdminButton } from "@/components/admin/AdminButton";
import { FormField, inputClass } from "@/components/admin/FormField";
import { FormSection } from "@/components/admin/FormSection";
import { Switch } from "@/components/admin/Switch";
import { updateHero } from "@/features/settings/actions";
import { formatDate } from "@/lib/utils";
import type { IResumeVersion, ISiteSettings } from "@/types";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

export function HeroForm({
    settings,
    activeResume,
}: {
    settings: ISiteSettings | null;
    activeResume: IResumeVersion | null;
}) {
    const [isPending, startTransition] = useTransition();
    const initial = useMemo(
        () => ({
            tagline: settings?.tagline ?? "",
            availableForWork: settings?.availableForWork ?? true,
        }),
        [settings],
    );
    const [tagline, setTagline] = useState(initial.tagline);
    const [availableForWork, setAvailableForWork] = useState(initial.availableForWork);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData();
        fd.set("tagline", tagline);
        fd.set("availableForWork", availableForWork ? "true" : "false");

        startTransition(async () => {
            const result = await updateHero(fd);
            if (result.error) toast.error(result.error);
            else toast.success("Hero updated");
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FormSection title="Headline" description="The one-line statement shown in the hero">
                <FormField label="Tagline" name="tagline">
                    <input
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Full stack engineer. Product-minded. Builder by default."
                        className={inputClass}
                        maxLength={160}
                    />
                </FormField>
            </FormSection>

            <FormSection title="Status">
                <Switch
                    checked={availableForWork}
                    onChange={setAvailableForWork}
                    label={availableForWork ? "Open to opportunities" : "Not actively looking"}
                />
            </FormSection>

            <FormSection title="Resume" description="The hero's resume link — managed on its own page">
                <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {activeResume
                            ? `${activeResume.label || activeResume.filename} · uploaded ${formatDate(activeResume.uploadedAt)}`
                            : "No active resume set yet"}
                    </p>
                    <Link
                        href="/admin/resume"
                        className="text-xs transition-colors hover:opacity-80"
                        style={{ color: "var(--accent)" }}
                    >
                        Manage resume →
                    </Link>
                </div>
            </FormSection>

            <div className="flex gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <AdminButton type="submit" loading={isPending}>
                    Save changes
                </AdminButton>
            </div>
        </form>
    );
}
