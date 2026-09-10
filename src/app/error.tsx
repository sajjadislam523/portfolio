"use client";

import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import { useEffect } from "react";

// Mirrors not-found.tsx's pattern exactly (grid background, centered card,
// same button style) rather than inventing a second error-page language —
// this is the one boundary that catches an uncaught render error anywhere
// in the app, so without it a real error shows Next's raw default screen.
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ background: "var(--bg-primary)" }}
        >
            <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

            <div className="relative text-center max-w-md">
                <p
                    className="text-8xl font-bold tracking-tighter mb-4"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--text-primary) 30%, var(--accent))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    Error
                </p>
                <h1
                    className="text-xl font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                >
                    Something went wrong
                </h1>
                <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                    An unexpected error occurred. You can try again, or head back home.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                        style={{
                            background: "var(--accent)",
                            color: "var(--accent-foreground)",
                        }}
                    >
                        <RotateCw className="w-4 h-4" /> Try again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        style={{
                            border: "1px solid var(--border-strong)",
                            color: "var(--text-secondary)",
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" /> Back home
                    </Link>
                </div>
            </div>
        </div>
    );
}
