"use client";

import { AdminButton } from "@/components/admin/AdminButton";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FileUpload } from "@/components/admin/FileUpload";
import { FormField, inputClass, selectClass, textareaClass } from "@/components/admin/FormField";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Switch } from "@/components/admin/Switch";
import {
    completeExploration,
    createExploration,
    deleteExploration,
    markExplorationActive,
    reorderExploration,
    setPrimaryExploration,
    updateExploration,
} from "@/features/exploring/actions";
import type { ActionResult } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { IExploration } from "@/types";
import { ArrowDown, ArrowUp, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ExploringManager({ explorations }: { explorations: IExploration[] }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<IExploration | null>(null);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                {explorations.length === 0 && (
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                        No explorations yet — add the one you&apos;re actively working on.
                    </p>
                )}
                {explorations.map((exploration, i) => (
                    <ExplorationRow
                        key={exploration._id}
                        exploration={exploration}
                        isFirst={i === 0}
                        isLast={i === explorations.length - 1}
                        onEdit={() => {
                            setEditing(exploration);
                            setShowForm(false);
                        }}
                    />
                ))}
            </div>

            {editing && (
                <ExplorationForm
                    exploration={editing}
                    onClose={() => setEditing(null)}
                    action={(fd) => updateExploration(editing._id, fd)}
                    submitLabel="Save changes"
                />
            )}

            {showForm && !editing ? (
                <ExplorationForm
                    onClose={() => setShowForm(false)}
                    action={createExploration}
                    submitLabel="Add exploration"
                />
            ) : (
                !editing && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm w-full transition-colors"
                        style={{
                            background: "var(--bg-elevated)",
                            border: "1px dashed var(--border)",
                            color: "var(--text-tertiary)",
                        }}
                    >
                        <Plus className="w-4 h-4" /> Add exploration
                    </button>
                )
            )}
        </div>
    );
}

function ExplorationRow({
    exploration,
    isFirst,
    isLast,
    onEdit,
}: {
    exploration: IExploration;
    isFirst: boolean;
    isLast: boolean;
    onEdit: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    function run(action: () => Promise<ActionResult>, successMessage: string) {
        startTransition(async () => {
            const result = await action();
            if (result.error) toast.error(result.error);
            else toast.success(successMessage);
        });
    }

    return (
        <div
            className="flex items-start gap-3 rounded-xl p-4"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
            <div className="flex flex-col gap-1 pt-0.5">
                <button
                    onClick={() => run(() => reorderExploration(exploration._id, "up"), "Reordered")}
                    disabled={isFirst || isPending}
                    className="disabled:opacity-30"
                    style={{ color: "var(--text-tertiary)" }}
                    aria-label="Move up"
                >
                    <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => run(() => reorderExploration(exploration._id, "down"), "Reordered")}
                    disabled={isLast || isPending}
                    className="disabled:opacity-30"
                    style={{ color: "var(--text-tertiary)" }}
                    aria-label="Move down"
                >
                    <ArrowDown className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {exploration.title}
                    </span>
                    <StatusBadge
                        label={STATUS_LABEL[exploration.status]}
                        tone={exploration.status === "active" ? "success" : "neutral"}
                    />
                    <StatusBadge
                        label={exploration.published ? "Published" : "Draft"}
                        tone={exploration.published ? "accent" : "neutral"}
                    />
                    {exploration.isPrimary && (
                        <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                            style={{
                                background: "rgba(124,106,247,0.12)",
                                color: "#7C6AF7",
                                border: "1px solid rgba(124,106,247,0.3)",
                            }}
                        >
                            <Star className="w-2.5 h-2.5 fill-current" /> Primary
                        </span>
                    )}
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                    {exploration.topics.join(" · ") || "No topics"} — since{" "}
                    {formatDate(exploration.startDate)}
                </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                {exploration.status === "active" && !exploration.isPrimary && (
                    <AdminButton
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                            run(() => setPrimaryExploration(exploration._id), "Set as primary")
                        }
                    >
                        Set primary
                    </AdminButton>
                )}
                {exploration.status === "active" ? (
                    <AdminButton
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => run(() => completeExploration(exploration._id), "Marked completed")}
                    >
                        Complete
                    </AdminButton>
                ) : (
                    <AdminButton
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                            run(() => markExplorationActive(exploration._id), "Marked active")
                        }
                    >
                        Mark active
                    </AdminButton>
                )}
                <button
                    onClick={onEdit}
                    className="p-1.5 opacity-60 hover:opacity-100 transition-opacity"
                    aria-label="Edit"
                >
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <ConfirmDialog
                    title="Delete exploration"
                    description={`Delete "${exploration.title}"? This can't be undone.`}
                    onConfirm={() => run(() => deleteExploration(exploration._id), "Deleted")}
                >
                    {(open) => (
                        <button
                            onClick={open}
                            disabled={isPending}
                            className="p-1.5 opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
                            aria-label="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </ConfirmDialog>
            </div>
        </div>
    );
}

const STATUS_LABEL: Record<IExploration["status"], string> = {
    active: "Active",
    experimenting: "Experimenting",
    completed: "Completed",
};

function ExplorationForm({
    exploration,
    onClose,
    action,
    submitLabel,
}: {
    exploration?: IExploration;
    onClose: () => void;
    action: (fd: FormData) => Promise<ActionResult>;
    submitLabel: string;
}) {
    const [isPending, startTransition] = useTransition();
    const [image, setImage] = useState(exploration?.image ?? "");
    const [published, setPublished] = useState(exploration?.published ?? true);
    const startDateVal = exploration?.startDate
        ? new Date(exploration.startDate).toISOString().slice(0, 10)
        : "";

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set("image", image);
        formData.set("published", published ? "true" : "false");

        startTransition(async () => {
            const result = await action(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(exploration ? "Exploration updated" : "Exploration added");
                onClose();
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl p-4 flex flex-col gap-4"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--accent)" }}
        >
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {exploration ? "Edit exploration" : "Add exploration"}
            </p>

            <FormField label="Title" name="title" required>
                <input
                    name="title"
                    defaultValue={exploration?.title}
                    placeholder="AI-powered product interfaces"
                    className={inputClass}
                    required
                />
            </FormField>

            <FormField label="Description" name="description" required hint="One or two sentences">
                <textarea
                    name="description"
                    defaultValue={exploration?.description}
                    placeholder="Exploring how AI workflows can improve modern web products and developer experiences."
                    className={textareaClass}
                    required
                />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
                <FormField label="Topics" name="topics" hint="Comma-separated">
                    <input
                        name="topics"
                        defaultValue={exploration?.topics.join(", ")}
                        placeholder="AI, Product Engineering, Interactive Web"
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Start date" name="startDate" required>
                    <input
                        name="startDate"
                        type="date"
                        defaultValue={startDateVal}
                        className={inputClass}
                        required
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FormField label="Status" name="status">
                    <select name="status" defaultValue={exploration?.status ?? "active"} className={selectClass}>
                        <option value="active">Active</option>
                        <option value="experimenting">Experimenting</option>
                        <option value="completed">Completed</option>
                    </select>
                </FormField>
                <FormField label="Order" name="order" hint="Lower = appears first">
                    <input
                        name="order"
                        type="number"
                        defaultValue={exploration?.order ?? 0}
                        min={0}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <FormField label="Link" name="link" hint="Optional — a repo, write-up, or demo">
                <input
                    name="link"
                    type="url"
                    defaultValue={exploration?.link}
                    placeholder="https://..."
                    className={inputClass}
                />
            </FormField>

            <div>
                <div className="mb-1.5 flex items-center justify-between">
                    <span />
                    <MediaPicker purpose="exploration-cover" onSelect={setImage} />
                </div>
                <FileUpload
                    purpose="exploration-cover"
                    currentUrl={image}
                    onUploadComplete={setImage}
                    label="Image"
                    hint="Optional"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FormField label="CTA label" name="ctaLabel" hint="Optional — both fields, or neither">
                    <input
                        name="ctaLabel"
                        defaultValue={exploration?.ctaLabel}
                        placeholder="Read the notes"
                        className={inputClass}
                    />
                </FormField>
                <FormField label="CTA URL" name="ctaUrl">
                    <input
                        name="ctaUrl"
                        type="url"
                        defaultValue={exploration?.ctaUrl}
                        placeholder="https://..."
                        className={inputClass}
                    />
                </FormField>
            </div>

            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <input
                    type="checkbox"
                    name="isPrimary"
                    defaultChecked={exploration?.isPrimary}
                    className="rounded"
                />
                Primary — the one focus the public section leads with
            </label>

            <Switch
                checked={published}
                onChange={setPublished}
                label={published ? "Published — visible on the public site" : "Draft — hidden from the public site"}
            />

            <div className="flex gap-2">
                <AdminButton type="submit" loading={isPending}>
                    {submitLabel}
                </AdminButton>
                <AdminButton type="button" variant="secondary" onClick={onClose}>
                    Cancel
                </AdminButton>
            </div>
        </form>
    );
}
