import { StatCard } from "portfolio";
import { Briefcase, FolderKanban, Layers } from "lucide-react";

export function Default() {
  return <StatCard label="Experience" value="1+ yr" icon={Briefcase} />;
}

export function WithSub() {
  return (
    <StatCard
      label="Projects shipped"
      value={20}
      icon={FolderKanban}
      sub="4 featured, 16 archived"
    />
  );
}

export function Row() {
  return (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <StatCard label="Experience" value="1+ yr" icon={Briefcase} />
      <StatCard label="Projects" value="20+" icon={FolderKanban} />
      <StatCard label="Stack" value="20+" icon={Layers} />
    </div>
  );
}
