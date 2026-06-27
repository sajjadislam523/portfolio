import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind class merging ───────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatDate(date: string | Date | null): string {
  if (!date) return 'Present'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date | null
): string {
  return `${formatDate(startDate)} — ${formatDate(endDate)}`
}

// ─── Slug generation ──────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── MongoDB document serialisation ──────────────────────────────────────────
// Mongoose documents aren't plain objects. This converts them for JSON
// serialisation across the server/client boundary.

export function serialiseDoc<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T
}

// ─── API helpers ──────────────────────────────────────────────────────────────

export function apiError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status })
}

export function apiSuccess<T>(data: T, status = 200): Response {
  return Response.json({ data }, { status })
}

// ─── String helpers ───────────────────────────────────────────────────────────

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return `${str.slice(0, length).trimEnd()}…`
}

export function pluralise(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`)
}

// ─── Server Action result type ────────────────────────────────────────────────
// All Server Actions return this shape so client components can type-check both.
export type ActionResult = { success: true; error?: never } | { success?: never; error: string }
