"use client";

import { FileUpload, type UploadPurpose } from "@/components/admin/FileUpload";
import { Modal } from "@/components/admin/Modal";
import { getMedia } from "@/features/media/actions";
import type { IMedia } from "@/types";
import { ImageOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaPickerProps {
    purpose: UploadPurpose;
    onSelect: (url: string) => void;
    label?: string;
}

/** "Browse library" trigger next to a FileUpload dropzone — lets an existing
 *  upload be reused instead of re-uploading the same file. Two tabs: browse
 *  the tracked Media library, or fall through to the same FileUpload used
 *  everywhere else for a fresh upload. */
export function MediaPicker({ purpose, onSelect, label = "Browse library" }: MediaPickerProps) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<"browse" | "upload">("browse");
    const [items, setItems] = useState<IMedia[] | null>(null);

    useEffect(() => {
        if (!open || items !== null) return;
        getMedia()
            .then(setItems)
            .catch(() => setItems([]));
    }, [open, items]);

    function select(url: string) {
        onSelect(url);
        setOpen(false);
    }

    const images = (items ?? []).filter((m) => m.type.startsWith("image/"));

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-xs transition-colors hover:opacity-80"
                style={{ color: "var(--accent)" }}
            >
                {label}
            </button>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Media library"
                description="Reuse a previously uploaded file, or upload a new one."
            >
                <div
                    className="mb-4 flex gap-1 rounded-lg p-1"
                    style={{ background: "var(--bg-subtle)" }}
                    role="tablist"
                >
                    <TabButton active={tab === "browse"} onClick={() => setTab("browse")}>
                        Browse library
                    </TabButton>
                    <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
                        Upload new
                    </TabButton>
                </div>

                {tab === "upload" ? (
                    <FileUpload purpose={purpose} onUploadComplete={select} label="Upload file" />
                ) : items === null ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--accent)" }} />
                    </div>
                ) : images.length === 0 ? (
                    <div
                        className="flex flex-col items-center gap-2 py-10 text-center"
                        style={{ color: "var(--text-tertiary)" }}
                    >
                        <ImageOff className="h-5 w-5" />
                        <p className="text-sm">No images in the library yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {images.map((item) => (
                            <button
                                key={item._id}
                                type="button"
                                onClick={() => select(item.url)}
                                className="relative aspect-square overflow-hidden rounded-lg transition-opacity hover:opacity-80"
                                style={{ border: "1px solid var(--border)" }}
                                title={item.filename}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.url}
                                    alt={item.filename}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </Modal>
        </>
    );
}

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
                background: active ? "var(--bg-elevated)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-tertiary)",
            }}
        >
            {children}
        </button>
    );
}
