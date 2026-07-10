"use client";

import { ChevronDown, ChevronUp, ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ProjectImagesManagerProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export function ProjectImagesManager({
    images,
    onChange,
}: ProjectImagesManagerProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    async function uploadFiles(files: FileList) {
        setUploading(true);
        const uploaded: string[] = [];

        for (const file of Array.from(files)) {
            if (
                !["image/jpeg", "image/png", "image/webp"].includes(file.type)
            ) {
                toast.error(`${file.name}: only JPEG, PNG, or WebP allowed`);
                continue;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name}: must be under 5MB`);
                continue;
            }

            const fd = new FormData();
            fd.append("file", file);
            fd.append("purpose", "project-gallery");

            try {
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: fd,
                });
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.error ?? `Failed to upload ${file.name}`);
                    continue;
                }
                uploaded.push(data.url);
            } catch {
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        if (uploaded.length > 0) {
            onChange([...images, ...uploaded]);
            toast.success(
                `${uploaded.length} image${uploaded.length > 1 ? "s" : ""} added`,
            );
        }

        setUploading(false);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            uploadFiles(e.target.files);
        }
        e.target.value = "";
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            uploadFiles(e.dataTransfer.files);
        }
    }

    function removeAt(idx: number) {
        onChange(images.filter((_, i) => i !== idx));
    }

    function moveUp(idx: number) {
        if (idx === 0) return;
        const next = [...images];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        onChange(next);
    }

    function moveDown(idx: number) {
        if (idx === images.length - 1) return;
        const next = [...images];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        onChange(next);
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                >
                    Gallery images
                </label>
                <span
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {images.length} image{images.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Drop zone */}
            <div
                className="rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                    background: dragOver
                        ? "var(--accent-glow)"
                        : "var(--bg-subtle)",
                    border: `1.5px dashed ${dragOver ? "var(--accent)" : "var(--border-strong)"}`,
                    padding: "16px",
                }}
                onClick={() => !uploading && inputRef.current?.click()}
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
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
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
                            <ImagePlus
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
                                    Drop images here or{" "}
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
                            JPEG, PNG, WebP · Max 5MB each · Select multiple
                        </p>
                    </div>
                </div>
            </div>

            {/* Thumbnail grid with reorder + remove */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {images.map((url, idx) => (
                        <div
                            key={url}
                            className="relative rounded-lg overflow-hidden group"
                            style={{
                                border: "1px solid var(--border)",
                                aspectRatio: "4/3",
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={url}
                                alt={`Gallery image ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay controls */}
                            <div
                                className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: "rgba(0,0,0,0.55)" }}
                            >
                                <button
                                    type="button"
                                    onClick={() => moveUp(idx)}
                                    disabled={idx === 0}
                                    className="p-1.5 rounded-md disabled:opacity-30"
                                    style={{
                                        background: "rgba(255,255,255,0.15)",
                                        color: "#fff",
                                    }}
                                    title="Move earlier"
                                >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveDown(idx)}
                                    disabled={idx === images.length - 1}
                                    className="p-1.5 rounded-md disabled:opacity-30"
                                    style={{
                                        background: "rgba(255,255,255,0.15)",
                                        color: "#fff",
                                    }}
                                    title="Move later"
                                >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeAt(idx)}
                                    className="p-1.5 rounded-md"
                                    style={{
                                        background: "rgba(239,68,68,0.85)",
                                        color: "#fff",
                                    }}
                                    title="Remove"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Order badge */}
                            <span
                                className="absolute top-1 left-1 text-xs px-1.5 rounded"
                                style={{
                                    background: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                }}
                            >
                                {idx + 1}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
