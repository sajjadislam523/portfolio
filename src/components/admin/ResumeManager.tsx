"use client";

import {
    deleteResumeVersion,
    recordResumeUpload,
    setActiveResumeUrl,
} from "@/features/settings/resumeActions";
import type { IResumeVersion } from "@/types";
import {
    CheckCircle,
    Clock,
    ExternalLink,
    FileText,
    Loader2,
    Tag,
    Trash2,
    Upload,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ResumeManagerProps {
    versions: IResumeVersion[];
    activeUrl: string;
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(iso));
}

export function ResumeManager({
    versions: initial,
    activeUrl: initialActive,
}: ResumeManagerProps) {
    const [versions, setVersions] = useState<IResumeVersion[]>(initial);
    const [activeUrl, setActiveUrl] = useState(initialActive);
    const [uploading, setUploading] = useState(false);
    const [labelInput, setLabelInput] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const [, startTransition] = useTransition();

    async function handleUpload(file: File) {
        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File must be under 5MB");
            return;
        }

        setUploading(true);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("purpose", "resume");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error ?? "Upload failed");
                return;
            }

            const label = labelInput.trim() || file.name.replace(/\.pdf$/i, "");
            const newVersion: IResumeVersion = {
                url: data.url,
                label,
                filename: file.name,
                size: file.size,
                uploadedAt: new Date().toISOString(),
                isActive: true,
            };

            // Optimistically update UI
            setVersions((prev) => [
                newVersion,
                ...prev.map((v) => ({ ...v, isActive: false })),
            ]);
            setActiveUrl(data.url);
            setLabelInput("");

            // Persist to DB
            startTransition(async () => {
                await recordResumeUpload(data.url, label, file.name, file.size);
            });

            toast.success("Resume uploaded and set as active");
        } catch {
            toast.error("Upload failed. Check your connection.");
        } finally {
            setUploading(false);
        }
    }

    function handleSetActive(version: IResumeVersion) {
        setActiveUrl(version.url);
        setVersions((prev) =>
            prev.map((v) => ({ ...v, isActive: v.url === version.url })),
        );
        startTransition(async () => {
            await setActiveResumeUrl(version.url);
        });
        toast.success(`"${version.label}" set as active`);
    }

    function handleDelete(version: IResumeVersion) {
        if (version.isActive) {
            toast.error(
                "Cannot delete the active resume. Set another active first.",
            );
            return;
        }
        setVersions((prev) => prev.filter((v) => v.url !== version.url));
        startTransition(async () => {
            const r = await deleteResumeVersion(version.url);
            if (r.error) toast.error(r.error);
            else toast.success("Resume deleted");
        });
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                >
                    Resume versions
                </p>
                <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {versions.length} version{versions.length !== 1 ? "s" : ""}{" "}
                    · Active shown to visitors
                </p>
            </div>

            {/* Upload drop zone */}
            <div
                className="rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                    background: dragOver
                        ? "var(--accent-glow)"
                        : "var(--bg-subtle)",
                    border: `1.5px dashed ${dragOver ? "var(--accent)" : "var(--border-strong)"}`,
                    padding: "16px",
                }}
                onClick={() => {
                    if (uploading) return;
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf";
                    input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleUpload(file);
                    };
                    input.click();
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleUpload(f);
                }}
            >
                {/* Label input — stop propagation so it doesn't trigger file picker */}
                <div
                    className="flex gap-2 mb-3"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="flex items-center gap-1.5 flex-1 rounded-lg px-3 py-1.5"
                        style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <Tag
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: "var(--text-tertiary)" }}
                        />
                        <input
                            type="text"
                            placeholder='Label e.g. "MERN focused - June 2026"'
                            value={labelInput}
                            onChange={(e) => setLabelInput(e.target.value)}
                            className="flex-1 bg-transparent text-xs outline-none"
                            style={{ color: "var(--text-primary)" }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        {uploading ? (
                            <Loader2
                                className="w-4 h-4 animate-spin"
                                style={{ color: "var(--accent)" }}
                            />
                        ) : (
                            <Upload
                                className="w-4 h-4"
                                style={{ color: "var(--text-tertiary)" }}
                            />
                        )}
                    </div>
                    <div>
                        <p
                            className="text-sm"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {uploading ? (
                                "Uploading…"
                            ) : (
                                <>
                                    Drop PDF here or{" "}
                                    <span style={{ color: "var(--accent)" }}>
                                        browse
                                    </span>
                                </>
                            )}
                        </p>
                        <p
                            className="text-xs"
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            PDF only · Max 5MB · Add a label before uploading
                        </p>
                    </div>
                </div>
            </div>

            {/* Version list */}
            {versions.length === 0 ? (
                <p
                    className="text-sm text-center py-6"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    No resumes uploaded yet
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {versions.map((version) => (
                        <div
                            key={version.url}
                            className="rounded-xl px-4 py-3 flex items-center gap-3 transition-all"
                            style={{
                                background: version.isActive
                                    ? "var(--accent-glow)"
                                    : "var(--bg-elevated)",
                                border: `1px solid ${version.isActive ? "var(--accent)" : "var(--border)"}`,
                            }}
                        >
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{
                                    background: version.isActive
                                        ? "var(--accent)"
                                        : "var(--bg-subtle)",
                                }}
                            >
                                <FileText
                                    className="w-4 h-4"
                                    style={{
                                        color: version.isActive
                                            ? "var(--accent-foreground)"
                                            : "var(--text-tertiary)",
                                    }}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p
                                        className="text-sm font-medium truncate"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {version.label || version.filename}
                                    </p>
                                    {version.isActive && (
                                        <span
                                            className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                                            style={{
                                                background:
                                                    "rgba(34,197,94,0.12)",
                                                color: "#22C55E",
                                                border: "1px solid rgba(34,197,94,0.25)",
                                            }}
                                        >
                                            Active
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Clock
                                        className="w-3 h-3"
                                        style={{
                                            color: "var(--text-tertiary)",
                                        }}
                                    />
                                    <span
                                        className="text-xs"
                                        style={{
                                            color: "var(--text-tertiary)",
                                        }}
                                    >
                                        {formatDate(version.uploadedAt)} ·{" "}
                                        {formatSize(version.size)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <a
                                    href={version.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ color: "var(--text-tertiary)" }}
                                    title="Open PDF"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>

                                {!version.isActive && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetActive(version)}
                                        className="p-1.5 rounded-lg transition-colors"
                                        style={{ color: "var(--accent)" }}
                                        title="Set as active"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleDelete(version)}
                                    disabled={version.isActive}
                                    className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                                    style={{ color: "#EF4444" }}
                                    title={
                                        version.isActive
                                            ? "Cannot delete active resume"
                                            : "Delete"
                                    }
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
