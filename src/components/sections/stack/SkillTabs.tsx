"use client";

import { CATEGORY_LABELS, CATEGORY_ORDER, PROFICIENCY_STYLE } from "@/components/sections/stack/constants";
import type { ISkill, SkillCategory } from "@/types";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";

interface SkillTabsProps {
    groupedSkills: Record<SkillCategory, ISkill[]>;
    proficiencyStyle: typeof PROFICIENCY_STYLE;
}

export function SkillTabs({ groupedSkills, proficiencyStyle }: SkillTabsProps) {
    const availableCategories = CATEGORY_ORDER.filter(
        (cat) => groupedSkills[cat]?.length > 0,
    );

    if (availableCategories.length === 0) return null;

    return (
        <Tabs.Root defaultValue={availableCategories[0]}>
            <Tabs.List
                className="flex flex-wrap gap-1 border-b mb-8"
                style={{ borderColor: "var(--border)" }}
            >
                {availableCategories.map((cat) => (
                    <Tabs.Trigger
                        key={cat}
                        value={cat}
                        className="px-4 py-2 text-sm rounded-t-lg transition-colors border-b-2 border-transparent text-[var(--text-tertiary)] data-[state=active]:text-[var(--accent)] data-[state=active]:bg-[var(--accent-glow)] data-[state=active]:border-[var(--accent)]"
                    >
                        {CATEGORY_LABELS[cat]}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            {availableCategories.map((cat) => (
                <Tabs.Content key={cat} value={cat}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={cat}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-wrap gap-2"
                        >
                            {groupedSkills[cat].map((skill) => {
                                const style = proficiencyStyle[skill.proficiency];
                                return (
                                    <span
                                        key={skill._id}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                                        style={{
                                            background: style.bg,
                                            border: `1px solid ${style.border}`,
                                            color: style.color,
                                        }}
                                        title={`${skill.proficiency.charAt(0).toUpperCase() + skill.proficiency.slice(1)}${skill.projects.length > 0 ? ` · used in ${skill.projects.length} project${skill.projects.length > 1 ? "s" : ""}` : ""}`}
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full shrink-0"
                                            style={{
                                                background: style.color,
                                                opacity:
                                                    skill.proficiency === "familiar"
                                                        ? 0.4
                                                        : 1,
                                                outline:
                                                    skill.proficiency === "familiar"
                                                        ? "1px solid currentColor"
                                                        : "none",
                                            }}
                                        />
                                        {skill.name}
                                    </span>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
