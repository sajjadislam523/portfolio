import { SkillTabs } from "portfolio";
import { PROFICIENCY_STYLE } from "@/components/sections/stack/constants";
import type { ISkill, SkillCategory } from "@/types";

const SKILLS: ISkill[] = [
  { _id: "1", name: "React", category: "frontend", proficiency: "expert", projects: ["a", "b", "c"], order: 0 },
  { _id: "2", name: "Next.js", category: "frontend", proficiency: "expert", projects: ["a", "b"], order: 1 },
  { _id: "3", name: "TypeScript", category: "frontend", proficiency: "expert", projects: ["a", "b", "c"], order: 2 },
  { _id: "4", name: "Tailwind CSS", category: "frontend", proficiency: "proficient", projects: ["a"], order: 3 },
  { _id: "5", name: "Node.js", category: "backend", proficiency: "expert", projects: ["a", "b"], order: 0 },
  { _id: "6", name: "Express", category: "backend", proficiency: "proficient", projects: ["a"], order: 1 },
  { _id: "7", name: "GraphQL", category: "backend", proficiency: "familiar", projects: [], order: 2 },
  { _id: "8", name: "MongoDB", category: "database", proficiency: "expert", projects: ["a", "b"], order: 0 },
  { _id: "9", name: "PostgreSQL", category: "database", proficiency: "proficient", projects: ["a"], order: 1 },
];

const GROUPED = SKILLS.reduce(
  (acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  },
  {} as Record<SkillCategory, ISkill[]>,
);

export function Default() {
  return (
    <div style={{ maxWidth: "480px" }}>
      <SkillTabs groupedSkills={GROUPED} proficiencyStyle={PROFICIENCY_STYLE} />
    </div>
  );
}
