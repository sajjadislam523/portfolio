import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

/** e.g. "Content / Projects / Edit" — keeps nested editor pages oriented
 *  now that the sidebar groups routes rather than listing every page flat. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav
            className="mb-2 flex items-center gap-1.5 text-xs"
            style={{ color: "var(--text-tertiary)" }}
            aria-label="Breadcrumb"
        >
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden>/</span>}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="transition-colors hover:text-[var(--text-secondary)]"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span>{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
