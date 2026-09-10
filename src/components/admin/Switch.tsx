"use client";

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

/** Hand-rolled toggle (not a checkbox) — matches the fix already applied
 *  in the old SettingsForm for a hidden-input+checkbox bug; extracted here
 *  so every published/available/visible toggle across the CMS shares one
 *  implementation instead of re-hand-rolling it per page. */
export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
    return (
        <label className="flex items-center gap-3" style={{ opacity: disabled ? 0.5 : 1 }}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200"
                style={{
                    background: checked ? "var(--accent)" : "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                }}
            >
                <span
                    className="inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200"
                    style={{
                        background: "#fff",
                        transform: checked ? "translateX(18px)" : "translateX(2px)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }}
                />
            </button>
            {label && (
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {label}
                </span>
            )}
        </label>
    );
}
