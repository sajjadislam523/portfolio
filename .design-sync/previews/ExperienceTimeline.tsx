import { ExperienceTimeline } from "portfolio";

const EXPERIENCES = [
  {
    _id: "1",
    company: "Freelance",
    role: "Full Stack Engineer",
    location: "Remote",
    startDate: "2025-01-01",
    endDate: null,
    description:
      "Building production web applications for small businesses and startups, from database schema to deployed UI.",
    accomplishments: [
      "Shipped a booking platform handling real-time availability for 3 clients",
      "Migrated a legacy PHP app to Next.js, cutting page load time by 60%",
    ],
    technologies: ["Next.js", "TypeScript", "MongoDB", "Tailwind"],
    order: 0,
  },
  {
    _id: "2",
    company: "Acme Software",
    role: "Frontend Developer",
    location: "Dhaka, Bangladesh",
    startDate: "2023-06-01",
    endDate: "2024-12-01",
    description:
      "Owned the customer-facing dashboard, working closely with design to ship a full UI rebuild.",
    accomplishments: [
      "Rebuilt the dashboard in React + TypeScript, reducing bug reports by 40%",
    ],
    technologies: ["React", "TypeScript", "Redux"],
    order: 1,
  },
];

export function Default() {
  return (
    <div style={{ maxWidth: "420px" }}>
      <ExperienceTimeline experiences={EXPERIENCES} />
    </div>
  );
}

export function SingleEntry() {
  return (
    <div style={{ maxWidth: "420px" }}>
      <ExperienceTimeline experiences={[EXPERIENCES[0]]} />
    </div>
  );
}
