"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    maxWidth?: string;
}

/** A general-purpose modal on the native `<dialog>` element — the same
 *  shell `ConfirmDialog` already uses (showModal()/close() via ref+effect,
 *  backdrop click to close), generalized for non-confirm content like
 *  MediaPicker instead of introducing a second (Radix) modal system. */
export function Modal({ open, onClose, title, description, children, maxWidth = "max-w-lg" }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            className={`w-full ${maxWidth} rounded-xl p-0 shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-sm`}
            style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
            }}
            onClose={onClose}
            onClick={(e) => {
                if (e.target === dialogRef.current) onClose();
            }}
        >
            <div
                className="flex items-start justify-between gap-3 border-b px-5 py-4"
                style={{ borderColor: "var(--border)" }}
            >
                <div>
                    <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                            {description}
                        </p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="shrink-0 rounded-md p-1 transition-colors"
                    style={{ color: "var(--text-tertiary)" }}
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
        </dialog>
    );
}
