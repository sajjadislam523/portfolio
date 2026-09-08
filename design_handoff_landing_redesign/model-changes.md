# Model changes — `role: string` + `featured: boolean`

Five files, in the order they should be edited. Written against
`portfolio/src` as it stands (`redesign/single-page-landing`). Run the backfill
in step 6 before deploying — `role` is required, so existing documents need a
value.

> **Naming note.** `status: "featured" | "archived"` already exists and decides
> which shelf a project sits on. The new `featured: boolean` decides which
> single project takes the lead row. Both names are now in play on one model. If
> that reads badly to you in six months, rename the new one to `isLead` — it is
> referenced in exactly two places (`ProjectLedger.tsx` and the admin form).

---

## 1. `src/types/index.ts`

Add two fields to `IProject`, after `status`:

```ts
export interface IProject {
    // …unchanged…
    status: ProjectStatus;
    /** Shown in the ledger's meta rail — "Full stack", "Frontend", "Lead". */
    role: string;
    /** Hand-picked lead row on the projects section. One project at a time. */
    featured: boolean;
    order: number;
    year: number;
    createdAt: string;
    updatedAt: string;
}
```

## 2. `src/lib/db/models/Project.ts`

Add both fields to the schema, and widen the compound index so the lead row
sorts first in the public query:

```ts
        status: {
            type: String,
            enum: ["featured", "archived"] satisfies ProjectStatus[],
            default: "featured",
            index: true,
        },
        role: { type: String, required: true, trim: true },
        featured: { type: Boolean, default: false, index: true },
        order: { type: Number, default: 0, index: true },
        year: { type: Number, required: true },
```

```ts
// Compound index for the public-facing query pattern
ProjectSchema.index({ status: 1, order: 1 });
ProjectSchema.index({ featured: -1, status: 1, order: 1 });
```

## 3. `src/lib/validations/index.ts`

In `projectSchema`, beside `status`:

```ts
    status: z.enum(["featured", "archived"]).default("featured"),
    role: z
        .string()
        .min(2, "Add a role — it shows in the projects ledger")
        .max(60),
    featured: z.boolean().default(false),
    order: z.number().int().min(0).default(0),
```

## 4. `src/features/projects/actions.ts`

**a. `parseProjectFormData`** — an unchecked checkbox sends nothing, so test for
`"on"` rather than coercing:

```ts
        status: formData.get("status") ?? "featured",
        role: formData.get("role")?.toString().trim() ?? "",
        featured: formData.get("featured") === "on",
        order: Number(formData.get("order") ?? 0),
```

**b. Keep `featured` exclusive.** Hand-picking a lead only works if picking one
un-picks the last. Add this helper and call it from both mutations:

```ts
async function clearOtherFeatured(keepId?: string) {
    await Project.updateMany(
        { featured: true, ...(keepId ? { _id: { $ne: keepId } } : {}) },
        { $set: { featured: false } },
    );
}
```

In `createProject`, after the slug check:

```ts
    if (parsed.data.featured) await clearOtherFeatured();

    const created = await Project.create(parsed.data);
```

In `updateProject`, before the write:

```ts
    if (parsed.data.featured) await clearOtherFeatured(id);

    await Project.findByIdAndUpdate(id, parsed.data, { new: true });
```

## 5. `src/app/(admin)/admin/(protected)/projects/ProjectForm.tsx`

Role belongs beside Status. Replace the existing `grid-cols-3` block with a
`grid-cols-2` row plus a `grid-cols-3` row, and add the lead-row checkbox under
them:

```tsx
            <div className="grid grid-cols-2 gap-4">
                <FormField label="Status" name="status">
                    <select
                        id="status"
                        name="status"
                        defaultValue={project?.status ?? "featured"}
                        className={selectClass}
                    >
                        <option value="featured">Featured</option>
                        <option value="archived">Archived</option>
                    </select>
                </FormField>

                <FormField
                    label="Role"
                    name="role"
                    required
                    hint="Your role on this project — shown in the projects ledger"
                >
                    <input
                        id="role"
                        name="role"
                        defaultValue={project?.role}
                        placeholder="Full stack"
                        className={inputClass}
                        required
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField label="Year" name="year" required>
                    <input
                        id="year"
                        name="year"
                        type="number"
                        defaultValue={project?.year ?? new Date().getFullYear()}
                        min={2000}
                        max={2100}
                        className={inputClass}
                        required
                    />
                </FormField>

                <FormField label="Order" name="order" hint="Lower = appears first">
                    <input
                        id="order"
                        name="order"
                        type="number"
                        defaultValue={project?.order ?? 0}
                        min={0}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <label
                className="flex items-start gap-3 rounded-lg p-4"
                style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border)",
                }}
            >
                <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={project?.featured ?? false}
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ accentColor: "var(--accent)" }}
                />
                <span className="flex flex-col gap-1">
                    <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Lead row on the homepage
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        Renders this project first, at double weight, with a 16:9
                        cover. Checking it clears the flag on every other project.
                    </span>
                </span>
            </label>
```

## 6. Backfill existing documents

`role` is required, so any project saved before this change will fail
validation on its next write. One pass in `mongosh`:

```js
db.projects.updateMany(
  { role: { $exists: false } },
  { $set: { role: "Full stack", featured: false } }
);
```

Then pick your lead project in the admin, and set each project's real role.
Alternatively add the same two `$set` fields to `scripts/seed.ts` and reseed.

---

## Where the ledger reads them

`ProjectLedger` takes `IProject[]` and, with `leadRow`, renders
`projects.find((p) => p.featured)` first — falling back to `projects[0]` if
nothing is flagged, so the section never renders empty mid-migration. `role`
prints verbatim in the meta rail beside `year`; there is no fallback now that
the field is required.
