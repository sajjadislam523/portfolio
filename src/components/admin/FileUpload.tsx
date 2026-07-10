"use client";

import {
    ExternalLink,
    FileText,
    Image as ImageIcon,
    Loader2,
    Upload,
    X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type UploadPurpose = "resume" | "og" | "project-cover" | "project-gallery";

type UploadState = "idle" | "uploading" | "done" | "error";

interface FileUploadProps {
    purpose: UploadPurpose;
    currentUrl?: string;
    onUploadComplete: (url: string) => void;
    label: string;
    hint?: string;
}

const PURPOSE_CONFIG = {
    resume: {
        accept: ".pdf",
        maxLabel: "5MB PDF",
        icon: FileText,
        previewType: "filename" as const,
    },
    og: {
        accept: ".jpg,.jpeg,.png,.webp",
        maxLabel: "5MB · 1200×630 recommended",
        icon: ImageIcon,
        previewType: "image" as const,
    },
    "project-cover": {
        accept: ".jpg,.jpeg,.png,.webp",
        maxLabel: "5MB · 1200×630 recommended",
        icon: ImageIcon,
        previewType: "image" as const,
    },
    "project-gallery": {
        accept: ".jpg,.jpeg,.png,.webp",
        maxLabel: "5MB per image",
        icon: ImageIcon,
        previewType: "image" as const,
    },
} as const;

export function FileUpload({
    purpose,
    currentUrl,
    onUploadComplete,
    label,
    hint,
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl ?? "");
    const [selectedFilename, setSelectedFilename] = useState<string>("");
    const [dragOver, setDragOver] = useState(false);

    const config = PURPOSE_CONFIG[purpose];
    const Icon = config.icon;
    const displayUrl = uploadedUrl || currentUrl || "";

    async function uploadFile(file: File) {
        setUploadState("uploading");
        setSelectedFilename(file.name);

        const fd = new FormData();
        fd.append("file", file);
        fd.append("purpose", purpose);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error ?? "Upload failed");
                setUploadState("error");
                return;
            }

            setUploadedUrl(data.url);
            onUploadComplete(data.url);
            setUploadState("done");
            toast.success(`${label} uploaded successfully`);
        } catch {
            toast.error("Upload failed. Check your connection.");
            setUploadState("error");
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    }

    function handleClear() {
        setUploadedUrl("");
        setSelectedFilename("");
        setUploadState("idle");
        onUploadComplete("");
        if (inputRef.current) inputRef.current.value = "";
    }

    const isUploading = uploadState === "uploading";

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {label}
                </label>
                {displayUrl && (
                    <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 transition-opacity hover:opacity-70"
                        style={{ color: "var(--accent)" }}
                    >
                        View current <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>

            {/* Drop zone */}
            <div
                className="relative rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                    background: dragOver
                        ? "var(--accent-glow)"
                        : "var(--bg-subtle)",
                    border: `1.5px dashed ${dragOver ? "var(--accent)" : isUploading ? "var(--border)" : "var(--border-strong)"}`,
                    padding: "20px",
                }}
                onClick={() => !isUploading && inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={config.accept}
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />

                <div className="flex items-center gap-4">
                    {/* Icon area */}
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                            background:
                                uploadState === "done"
                                    ? "rgba(34,197,94,0.12)"
                                    : "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        {isUploading ? (
                            <Loader2
                                className="w-5 h-5 animate-spin"
                                style={{ color: "var(--accent)" }}
                            />
                        ) : uploadState === "done" ? (
                            <Icon
                                className="w-5 h-5"
                                style={{ color: "#22C55E" }}
                            />
                        ) : (
                            <Upload
                                className="w-5 h-5"
                                style={{ color: "var(--text-tertiary)" }}
                            />
                        )}
                    </div>

                    {/* Text area */}
                    <div className="flex-1 min-w-0">
                        {isUploading ? (
                            <>
                                <p
                                    className="text-sm font-medium"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    Uploading…
                                </p>
                                <p
                                    className="text-xs mt-0.5 truncate"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    {selectedFilename}
                                </p>
                            </>
                        ) : uploadState === "done" || displayUrl ? (
                            <>
                                <p
                                    className="text-sm font-medium"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {uploadState === "done"
                                        ? "Uploaded"
                                        : "File set"}
                                </p>
                                <p
                                    className="text-xs mt-0.5 truncate"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    {selectedFilename || displayUrl}
                                </p>
                            </>
                        ) : (
                            <>
                                <p
                                    className="text-sm font-medium"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    Drop file here or{" "}
                                    <span style={{ color: "var(--accent)" }}>
                                        browse
                                    </span>
                                </p>
                                <p
                                    className="text-xs mt-0.5"
                                    style={{ color: "var(--text-tertiary)" }}
                                >
                                    {config.maxLabel}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Clear button */}
                    {displayUrl && !isUploading && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            className="p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
                            style={{ color: "var(--text-tertiary)" }}
                            title="Remove"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* OG image preview */}
                {purpose === "og" && displayUrl && (
                    <div
                        className="mt-3 rounded-lg overflow-hidden"
                        style={{ border: "1px solid var(--border)" }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={displayUrl}
                            alt="OG image preview"
                            className="w-full object-cover"
                            style={{ maxHeight: "120px" }}
                        />
                    </div>
                )}
            </div>

            {hint && (
                <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {hint}
                </p>
            )}
        </div>
    );
}
