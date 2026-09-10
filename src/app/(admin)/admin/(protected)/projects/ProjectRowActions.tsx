"use client";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
    deleteProject,
    duplicateProject,
    reorderProject,
    setProjectStatus,
    togglePublished,
} from "@/features/projects/actions";
import type { ActionResult } from "@/lib/utils";
import type { IProject } from "@/types";
import { Archive, ArchiveRestore, ArrowDown, ArrowUp, Copy, ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

export function ProjectRowActions({
    project,
    isFirst,
    isLast,
}: {
    project: IProject;
    isFirst: boolean;
    isLast: boolean;
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
        <div className="flex items-center gap-1">
            <button
                onClick={() => run(() => reorderProject(project._id, "up"), "Reordered")}
                disabled={isFirst || isPending}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                style={{ color: "var(--text-tertiary)" }}
                aria-label="Move up"
            >
                <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => run(() => reorderProject(project._id, "down"), "Reordered")}
                disabled={isLast || isPending}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                style={{ color: "var(--text-tertiary)" }}
                aria-label="Move down"
            >
                <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {project.links.live && (
                <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                    aria-label="Open live URL"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            )}

            <button
                onClick={() =>
                    run(
                        () => togglePublished(project._id, !project.published),
                        project.published ? "Unpublished" : "Published",
                    )
                }
                disabled={isPending}
                className="px-2 py-1 rounded-lg text-xs transition-colors disabled:opacity-50"
                style={{ color: project.published ? "var(--text-tertiary)" : "var(--accent)" }}
            >
                {project.published ? "Unpublish" : "Publish"}
            </button>

            <button
                onClick={() =>
                    run(
                        () =>
                            setProjectStatus(
                                project._id,
                                project.status === "featured" ? "archived" : "featured",
                            ),
                        project.status === "featured" ? "Moved to archive" : "Moved to showcase",
                    )
                }
                disabled={isPending}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                style={{ color: "var(--text-tertiary)" }}
                aria-label={project.status === "featured" ? "Archive" : "Restore to showcase"}
                title={project.status === "featured" ? "Move to archive" : "Move to showcase"}
            >
                {project.status === "featured" ? (
                    <Archive className="w-3.5 h-3.5" />
                ) : (
                    <ArchiveRestore className="w-3.5 h-3.5" />
                )}
            </button>

            <button
                onClick={() => run(() => duplicateProject(project._id), "Duplicated as draft")}
                disabled={isPending}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                style={{ color: "var(--text-tertiary)" }}
                aria-label="Duplicate"
                title="Duplicate"
            >
                <Copy className="w-3.5 h-3.5" />
            </button>

            <Link
                href={`/admin/projects/${project._id}`}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                aria-label="Edit"
            >
                <Pencil className="w-3.5 h-3.5" />
            </Link>

            <ConfirmDialog
                title="Delete project"
                description={`"${project.title}" will be permanently deleted. This cannot be undone.`}
                onConfirm={() => run(() => deleteProject(project._id), "Deleted")}
            >
                {(open) => (
                    <button
                        onClick={open}
                        disabled={isPending}
                        className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                        style={{ color: "var(--destructive)" }}
                        aria-label="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                )}
            </ConfirmDialog>
        </div>
    );
}
