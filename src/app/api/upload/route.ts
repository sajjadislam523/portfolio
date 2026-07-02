import { getSession } from "@/features/auth/session";
import { apiError } from "@/lib/utils";
import { put } from "@vercel/blob";
import { NextRequest } from "next/server";

// File type allowlists per upload purpose
const ALLOWED_TYPES = {
    resume: ["application/pdf"],
    og: ["image/jpeg", "image/png", "image/webp"],
} as const;

type UploadPurpose = keyof typeof ALLOWED_TYPES;

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
    // ── Auth ───────────────────────────────────────────────────────────────────
    const session = await getSession();
    if (!session) {
        return apiError("Unauthorized", 401);
    }

    // ── Parse form data ────────────────────────────────────────────────────────
    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return apiError("Invalid form data", 400);
    }

    const file = form.get("file") as File | null;
    const purpose = form.get("purpose") as UploadPurpose | null;

    if (!file || !(file instanceof File)) {
        return apiError("No file provided", 400);
    }

    if (!purpose || !(purpose in ALLOWED_TYPES)) {
        return apiError(
            'Invalid upload purpose. Must be "resume" or "og"',
            400,
        );
    }

    // ── Validate file type ─────────────────────────────────────────────────────
    const allowedTypes = ALLOWED_TYPES[purpose] as readonly string[];
    if (!allowedTypes.includes(file.type)) {
        return apiError(
            `Invalid file type. ${purpose === "resume" ? "Only PDF files are allowed." : "Only JPEG, PNG, or WebP images are allowed."}`,
            400,
        );
    }

    // ── Validate file size ─────────────────────────────────────────────────────
    if (file.size > MAX_SIZE_BYTES) {
        return apiError("File must be under 5MB", 400);
    }

    // ── Sanitise filename ──────────────────────────────────────────────────────
    // Remove special characters, prepend purpose + timestamp for uniqueness
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const safeName = `${purpose}-${Date.now()}.${extension}`;

    // ── Upload to Vercel Blob ──────────────────────────────────────────────────
    try {
        const blob = await put(safeName, file, {
            access: "public", // publicly readable URL
            addRandomSuffix: false, // we handle uniqueness via timestamp
        });

        return Response.json({
            url: blob.url,
            pathname: blob.pathname,
            size: file.size,
            type: file.type,
        });
    } catch (err) {
        console.error("[api/upload]", err);
        return apiError("Upload failed. Please try again.", 500);
    }
}
