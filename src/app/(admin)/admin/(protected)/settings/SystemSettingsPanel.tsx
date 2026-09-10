"use client";

import { AdminCard } from "@/components/admin/AdminCard";
import { FormSection } from "@/components/admin/FormSection";
import { Switch } from "@/components/admin/Switch";
import { updateAvailability } from "@/features/settings/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function SystemSettingsPanel({
    availableForWork,
    accountEmail,
}: {
    availableForWork: boolean;
    accountEmail: string;
}) {
    const [available, setAvailable] = useState(availableForWork);
    const [, startTransition] = useTransition();

    function handleChange(next: boolean) {
        setAvailable(next);
        startTransition(async () => {
            const result = await updateAvailability(next);
            if (result.error) toast.error(result.error);
            else toast.success("Availability updated");
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <AdminCard title="Site status">
                <FormSection title="Availability" className="border-b-0 pb-0">
                    <Switch
                        checked={available}
                        onChange={handleChange}
                        label={available ? "Open to opportunities" : "Not actively looking"}
                    />
                </FormSection>
            </AdminCard>

            <AdminCard title="Account">
                <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        Signed in as
                    </span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {accountEmail}
                    </span>
                </div>
            </AdminCard>
        </div>
    );
}
