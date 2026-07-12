import { FadeIn } from "@/components/motion/ScrollReveal";
import { ExperienceTimeline } from "@/components/sections/experience/ExperienceTimeline";
import { connectDB, Experience } from "@/lib/db";
import type { IExperience } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Experience",
    description: "My professional experience and career timeline.",
};

export const revalidate = 60;

async function getExperiences(): Promise<IExperience[]> {
    try {
        await connectDB();
        const docs = await Experience.find().sort({ order: 1 }).lean();
        return JSON.parse(JSON.stringify(docs));
    } catch {
        return [];
    }
}

export default async function ExperiencePage() {
    const experiences = await getExperiences();

    return (
        <div className="pt-28 pb-24 h-screen">
            <div className="container max-w-2xl">
                <FadeIn>
                    <p
                        className="text-xs font-medium uppercase tracking-widest mb-3"
                        style={{ color: "var(--accent)" }}
                    >
                        Career
                    </p>
                    <h1
                        className="text-h1 mb-4"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Experience
                    </h1>
                    <p
                        className="text-base mb-16"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        My professional journey as an engineer.
                    </p>
                </FadeIn>

                <ExperienceTimeline experiences={experiences} />
            </div>
        </div>
    );
}
