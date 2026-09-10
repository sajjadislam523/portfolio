import { PageHeader } from "@/components/admin/PageHeader";
import { ResumeManager } from "@/components/admin/ResumeManager";
import { requireSession } from "@/features/auth/session";
import { getResumeVersions } from "@/features/settings/resumeActions";

export const metadata = { title: "Resume" };

export default async function AdminResumePage() {
    await requireSession();
    const { versions, activeUrl } = await getResumeVersions();

    return (
        <div className="max-w-2xl">
            <PageHeader
                title="Resume"
                description="Upload new versions, switch which one is active, and download past versions. The public site's Resume link always points to whichever version is active here."
            />
            <ResumeManager versions={versions} activeUrl={activeUrl} />
        </div>
    );
}
