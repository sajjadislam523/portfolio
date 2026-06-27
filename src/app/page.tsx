// Next.js requires a page at the root app level.
// The actual homepage lives in (public)/page.tsx.
// This redirect ensures /  resolves correctly.
export { default } from './(public)/page'
export { generateMetadata } from './(public)/page'
