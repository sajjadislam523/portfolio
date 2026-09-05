import { FormField, inputClass, textareaClass } from "portfolio";

export function Default() {
  return (
    <div style={{ maxWidth: "320px" }}>
      <FormField label="Project title" name="title" hint="Shown on the projects page">
        <input className={inputClass} name="title" placeholder="e.g. Portfolio Site" />
      </FormField>
    </div>
  );
}

export function Required() {
  return (
    <div style={{ maxWidth: "320px" }}>
      <FormField label="Email" name="email" required>
        <input className={inputClass} name="email" type="email" placeholder="you@example.com" />
      </FormField>
    </div>
  );
}

export function WithError() {
  return (
    <div style={{ maxWidth: "320px" }}>
      <FormField label="Slug" name="slug" required error="This slug is already taken">
        <input className={inputClass} name="slug" defaultValue="portfolio-site" />
      </FormField>
    </div>
  );
}

export function Textarea() {
  return (
    <div style={{ maxWidth: "320px" }}>
      <FormField label="Description" name="description" hint="Markdown supported">
        <textarea
          className={textareaClass}
          name="description"
          defaultValue="A full-stack portfolio built with Next.js, MongoDB, and Tailwind."
        />
      </FormField>
    </div>
  );
}
