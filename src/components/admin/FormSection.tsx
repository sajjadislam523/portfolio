import { cn } from "@/lib/utils";

interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

/** A titled field group — "BASIC INFORMATION", "CLASSIFICATION", etc. —
 *  used by every redesigned editor instead of one long undifferentiated
 *  form. */
export function FormSection({ title, description, children, className }: FormSectionProps) {
    return (
        <fieldset
            className={cn(
                "flex flex-col gap-4 border-b pb-6 last:border-b-0 last:pb-0",
                className,
            )}
            style={{ borderColor: "var(--border)" }}
        >
            <div>
                <legend
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text-tertiary)" }}
                >
                    {title}
                </legend>
                {description && (
                    <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {description}
                    </p>
                )}
            </div>
            {children}
        </fieldset>
    );
}
