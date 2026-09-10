import { PageHeader } from "@/components/admin/PageHeader";
import { requireSession } from "@/features/auth/session";
import { getSiteSettings } from "@/features/settings/actions";
import { getResumeVersions } from "@/features/settings/resumeActions";
import { HeroForm } from "./HeroForm";

export const metadata = { title: "Hero" };

export default async function AdminHeroPage() {
    await requireSession();
    const [settings, resume] = await Promise.all([getSiteSettings(), getResumeVersions()]);
    const activeResume = resume.versions.find((v) => v.isActive) ?? null;

    return (
        <div className="max-w-2xl">
            <PageHeader
                title="Hero"
                description="The headline and status shown at the top of the public site"
            />
            <HeroForm settings={settings} activeResume={activeResume} />
        </div>
    );
}
