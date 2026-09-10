"use client";

import { AdminButton } from "@/components/admin/AdminButton";

interface StickyActionBarProps {
    onCancel: () => void;
    onSaveDraft: () => void;
    onPublish?: () => void;
    saving?: boolean;
    /** Only rendered where the entity actually has a publish concept. */
    showPublish?: boolean;
    publishLabel?: string;
}

/** Fixed-bottom Cancel / Save Draft / Publish bar for long editor forms —
 *  sticks to the bottom of the scrollable admin `<main>` region. Purely
 *  callback-driven so each page decides how "save as draft" vs "publish"
 *  actually differ (usually: same submit, different `published` value). */
export function StickyActionBar({
    onCancel,
    onSaveDraft,
    onPublish,
    saving,
    showPublish = true,
    publishLabel = "Publish",
}: StickyActionBarProps) {
    return (
        <div
            className="sticky bottom-0 -mx-4 mt-8 flex items-center justify-between gap-3 border-t px-4 py-4 backdrop-blur lg:-mx-6 lg:px-6"
            style={{
                background: "color-mix(in srgb, var(--bg-primary) 92%, transparent)",
                borderColor: "var(--border)",
            }}
        >
            <AdminButton type="button" variant="ghost" onClick={onCancel} disabled={saving}>
                Cancel
            </AdminButton>
            <div className="flex items-center gap-2">
                <AdminButton type="button" variant="secondary" onClick={onSaveDraft} loading={saving}>
                    Save Draft
                </AdminButton>
                {showPublish && onPublish && (
                    <AdminButton type="button" variant="primary" onClick={onPublish} loading={saving}>
                        {publishLabel}
                    </AdminButton>
                )}
            </div>
        </div>
    );
}
