"use client";

import { AdminButton } from "@/components/admin/AdminButton";
import { FileUpload } from "@/components/admin/FileUpload";
import { FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import { FormSection } from "@/components/admin/FormSection";
import { updateProfile } from "@/features/settings/actions";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import type { ISiteSettings } from "@/types";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

interface ProfileFields {
    name: string;
    location: string;
    bio: string;
    email: string;
    phone: string;
    avatarUrl: string;
}

function fieldsFrom(settings: ISiteSettings | null): ProfileFields {
    return {
        name: settings?.name ?? "",
        location: settings?.location ?? "",
        bio: settings?.bio ?? "",
        email: settings?.email ?? "",
        phone: settings?.phone ?? "",
        avatarUrl: settings?.avatarUrl ?? "",
    };
}

export function ProfileForm({ settings }: { settings: ISiteSettings | null }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const initial = useMemo(() => fieldsFrom(settings), [settings]);
    const [fields, setFields] = useState<ProfileFields>(initial);

    const isDirty = JSON.stringify(fields) !== JSON.stringify(initial);
    const { confirmLeave } = useUnsavedChanges(isDirty);

    function set<K extends keyof ProfileFields>(key: K, value: ProfileFields[K]) {
        setFields((prev) => ({ ...prev, [key]: value }));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(fields).forEach(([k, v]) => fd.set(k, v));

        startTransition(async () => {
            const result = await updateProfile(fd);
            if (result.error) toast.error(result.error);
            else toast.success("Profile saved");
        });
    }

    function handleCancel() {
        if (!confirmLeave()) return;
        setFields(initial);
        router.push("/admin/dashboard");
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FormSection title="Identity">
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Name" name="name" required>
                        <input
                            value={fields.name}
                            onChange={(e) => set("name", e.target.value)}
                            className={inputClass}
                            required
                        />
                    </FormField>
                    <FormField label="Location" name="location">
                        <input
                            value={fields.location}
                            onChange={(e) => set("location", e.target.value)}
                            placeholder="Dhaka, Bangladesh"
                            className={inputClass}
                        />
                    </FormField>
                </div>
            </FormSection>

            <FormSection title="Contact">
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Email" name="email" required>
                        <input
                            type="email"
                            value={fields.email}
                            onChange={(e) => set("email", e.target.value)}
                            className={inputClass}
                            required
                        />
                    </FormField>
                    <FormField label="Phone" name="phone">
                        <input
                            type="tel"
                            value={fields.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            className={inputClass}
                        />
                    </FormField>
                </div>
            </FormSection>

            <FormSection title="About" description="Shown on the public site as your bio">
                <FormField label="Bio" name="bio">
                    <textarea
                        value={fields.bio}
                        onChange={(e) => set("bio", e.target.value)}
                        className={textareaClass}
                        style={{ minHeight: "120px" }}
                    />
                </FormField>
            </FormSection>

            <FormSection title="Media">
                <FileUpload
                    purpose="avatar"
                    currentUrl={fields.avatarUrl}
                    onUploadComplete={(url) => set("avatarUrl", url)}
                    label="Profile image"
                    hint="Optional — not yet wired into a public component"
                />
            </FormSection>

            <div className="flex gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <AdminButton type="submit" loading={isPending}>
                    Save changes
                </AdminButton>
                <AdminButton type="button" variant="secondary" onClick={handleCancel}>
                    Cancel
                </AdminButton>
            </div>
        </form>
    );
}
