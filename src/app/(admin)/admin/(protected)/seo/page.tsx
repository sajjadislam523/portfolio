import { PageHeader } from "@/components/admin/PageHeader";
import { requireSession } from "@/features/auth/session";
import { getSiteSettings } from "@/features/settings/actions";
import { SeoForm } from "./SeoForm";

export const metadata = { title: "SEO" };

export default async function AdminSeoPage() {
    await requireSession();
    const settings = await getSiteSettings();

    return (
        <div className="max-w-2xl">
            <PageHeader title="SEO" description="Search and social sharing metadata" />
            <SeoForm settings={settings} />
        </div>
    );
}
