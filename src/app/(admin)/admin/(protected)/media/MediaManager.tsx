"use client";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deleteMedia } from "@/features/media/actions";
import { formatDate } from "@/lib/utils";
import type { IMedia } from "@/types";
import { FileText, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaManager({ items }: { items: IMedia[] }) {
    if (items.length === 0) {
        return (
            <p className="py-12 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
                No files uploaded yet — files appear here automatically the next time you upload
                one anywhere in the CMS.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
                <MediaTile key={item._id} item={item} />
            ))}
        </div>
    );
}

function MediaTile({ item }: { item: IMedia }) {
    const [isPending, startTransition] = useTransition();
    const isImage = item.type.startsWith("image/");

    function handleDelete() {
        startTransition(async () => {
            const r = await deleteMedia(item._id);
            if (r.error) toast.error(r.error);
            else toast.success("File deleted");
        });
    }

    return (
        <div
            className="flex flex-col overflow-hidden rounded-lg border"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
        >
            <div
                className="flex aspect-square items-center justify-center"
                style={{ background: "var(--bg-subtle)" }}
            >
                {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.filename} className="h-full w-full object-cover" />
                ) : (
                    <FileText className="h-8 w-8" style={{ color: "var(--text-tertiary)" }} />
                )}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-2.5">
                <p
                    className="truncate text-xs font-medium"
                    style={{ color: "var(--text-primary)" }}
                    title={item.filename}
                >
                    {item.filename || "Untitled"}
                </p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {formatSize(item.size)} · {formatDate(item.uploadedAt)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-1">
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs transition-colors hover:opacity-80"
                        style={{ color: "var(--accent)" }}
                    >
                        View
                    </a>
                    <ConfirmDialog
                        title="Delete file"
                        description={`Delete "${item.filename}"? This can't be undone.`}
                        onConfirm={handleDelete}
                    >
                        {(open) => (
                            <button
                                onClick={open}
                                disabled={isPending}
                                className="p-1 opacity-60 transition-opacity hover:opacity-100 disabled:opacity-30"
                                aria-label="Delete"
                            >
                                <Trash2 className="h-3.5 w-3.5" style={{ color: "var(--destructive)" }} />
                            </button>
                        )}
                    </ConfirmDialog>
                </div>
            </div>
        </div>
    );
}
