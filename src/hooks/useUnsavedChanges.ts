"use client";

import { useCallback, useEffect, useRef } from "react";

/** Warns before losing unsaved form edits — `beforeunload` covers tab
 *  close/refresh/external navigation; `confirmLeave()` is a manual guard
 *  for in-app "leave this editor" actions (a Cancel button, a sidebar nav
 *  click while dirty) where `beforeunload` doesn't fire. Pragmatic scope:
 *  not a full router-transition-block system, which isn't trivial in the
 *  App Router without an extra dependency. */
export function useUnsavedChanges(isDirty: boolean) {
    const dirtyRef = useRef(isDirty);

    useEffect(() => {
        dirtyRef.current = isDirty;
    }, [isDirty]);

    useEffect(() => {
        function handler(e: BeforeUnloadEvent) {
            if (!dirtyRef.current) return;
            e.preventDefault();
            e.returnValue = "";
        }
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, []);

    const confirmLeave = useCallback(() => {
        if (!dirtyRef.current) return true;
        return window.confirm("You have unsaved changes. Leave without saving?");
    }, []);

    return { confirmLeave };
}
