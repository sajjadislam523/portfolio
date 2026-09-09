"use client";

import { useSyncExternalStore } from "react";

// framer-motion's own `useReducedMotion` reads `window.matchMedia` via a
// lazy `useState` initializer, so it resolves the real OS preference
// synchronously on the client's very first render — before hydration can
// compare that render against the server's (which always assumes `false`,
// having no `window`). On any device with the preference already on, this
// produces a hydration mismatch on every single page load.
//
// `useSyncExternalStore` is the API React designed for exactly this case
// (same pattern as `useHasMounted` in NavClient.tsx): the server snapshot
// always returns `false`, so the client's hydration render matches it
// exactly, and only after hydration does React re-read the live snapshot
// and update — normal reactivity, not a mismatch. It also stays live if
// the setting changes while the page is open, which framer-motion's own
// hook does not.
function subscribe(onChange: () => void) {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
    return false;
}

export function useReducedMotionSafe(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
