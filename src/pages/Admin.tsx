import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EditorialButton } from "@/components/ui/editorial-button";
import { toast } from "sonner";
import {
  loadOverrides,
  saveOverrides,
  resetOverrides,
  currentSnapshot,
  type AdminOverrides,
} from "@/admin/overrides";

type SectionKey =
  | "deadline"
  | "brief"
  | "weeks"
  | "mentor"
  | "team"
  | "projects"
  | "events"
  | "faqs";

const SECTIONS: { key: SectionKey; label: string; desc: string }[] = [
  { key: "deadline", label: "Deadline Banner", desc: "Edit the global countdown banner shown across the platform." },
  { key: "brief", label: "Project Brief", desc: "Paragraphs that appear in the workspace project brief." },
  { key: "weeks", label: "Weekly Plan", desc: "All six weeks: theme, expectations, deliverables, due labels, statuses." },
  { key: "mentor", label: "Mentor", desc: "Mentor profile, industry blurb, and scheduled sessions." },
  { key: "team", label: "Your Team", desc: "Team name + project label + the 10 builders on your team." },
  { key: "projects", label: "Industry Projects", desc: "Names and one-liners for the 5 industry projects." },
  { key: "events", label: "Calendar Events", desc: "All entries on the program calendar." },
  { key: "faqs", label: "FAQs", desc: "Support page knowledge base." },
];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="border-l-[3px] border-primary pl-5">
    <label className="label-eyebrow block mb-3">{label}</label>
    {children}
  </div>
);

const inputCls =
  "w-full bg-card border border-primary/15 focus:border-primary/50 outline-none p-3 text-[14px] text-foreground transition-colors";
const textareaCls = inputCls + " font-mono text-[12px] leading-relaxed resize-y";

const JsonEditor = ({
  value,
  onChange,
  rows = 18,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
  rows?: number;
}) => {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      <textarea
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            const parsed = JSON.parse(e.target.value);
            setErr(null);
            onChange(parsed);
          } catch (ex: any) {
            setErr(ex.message);
          }
        }}
        className={textareaCls}
        spellCheck={false}
      />
      {err && <p className="mt-2 text-[12px] text-destructive">Invalid JSON: {err}</p>}
    </div>
  );
};

const Admin = () => {
  const initial = (() => {
    const snap = currentSnapshot();
    const stored = loadOverrides();
    return { ...snap, ...stored } as ReturnType<typeof currentSnapshot> & AdminOverrides;
  })();

  const [section, setSection] = useState<SectionKey>("deadline");
  const [draft, setDraft] = useState(initial);

  const save = () => {
    const payload: AdminOverrides = {
      deadline: draft.deadline,
      projectBrief: draft.projectBrief,
      weeks: draft.weeks,
      mentor: draft.mentor,
      teamMeta: draft.teamMeta,
      teamBuilders: draft.teamBuilders,
      projects: draft.projects,
      events: draft.events,
      faqs: draft.faqs,
    };
    saveOverrides(payload);
    toast.success("Saved. Reloading to apply changes…");
    setTimeout(() => window.location.reload(), 600);
  };

  const reset = () => {
    if (!confirm("Reset all admin edits and restore defaults?")) return;
    resetOverrides();
    toast.success("Reset. Reloading…");
    setTimeout(() => window.location.reload(), 400);
  };

  return (
    <AppShell>
      <section className="px-6 md:px-12 pt-20 pb-10">
        <div className="mx-auto max-w-[1280px]">
          <p className="label-eyebrow mb-5">Admin</p>
          <h1 className="font-serif-display text-4xl md:text-5xl font-light">Content Studio.</h1>
          <p className="mt-6 text-muted-foreground text-base max-w-2xl">
            Every variable on the participant platform — deadlines, briefs, teams,
            calendar, mentor, FAQs — is editable here. Saved changes are stored
            locally in this browser and applied on reload.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-32">
        <div className="mx-auto max-w-[1280px] grid lg:grid-cols-[240px_1fr] gap-10">
          {/* Side nav */}
          <aside>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto">
              {SECTIONS.map((s) => {
                const active = section === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSection(s.key)}
                    className={`text-left px-4 py-3 border-l-2 transition-colors whitespace-nowrap ${
                      active
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-transparent text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <span className="label-nav text-[11px] block">{s.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-8 flex flex-col gap-3">
              <EditorialButton variant="primary" onClick={save}>Save All</EditorialButton>
              <button
                onClick={reset}
                className="label-nav text-[11px] text-destructive/80 hover:text-destructive py-2 text-left"
              >
                Reset to Defaults
              </button>
            </div>
          </aside>

          {/* Editors */}
          <div className="min-w-0">
            <div className="mb-8 pb-6 border-b border-primary/10">
              <h2 className="font-serif-display text-2xl md:text-3xl font-light">
                {SECTIONS.find((s) => s.key === section)?.label}
              </h2>
              <p className="text-muted-foreground text-[14px] mt-2">
                {SECTIONS.find((s) => s.key === section)?.desc}
              </p>
            </div>

            {section === "deadline" && (
              <div className="grid gap-6 max-w-2xl">
                <Field label="Title">
                  <input
                    className={inputCls}
                    value={draft.deadline.title}
                    onChange={(e) =>
                      setDraft({ ...draft, deadline: { ...draft.deadline, title: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Date Label">
                  <input
                    className={inputCls}
                    value={draft.deadline.dateLabel}
                    onChange={(e) =>
                      setDraft({ ...draft, deadline: { ...draft.deadline, dateLabel: e.target.value } })
                    }
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Hours Remaining">
                    <input
                      type="number"
                      className={inputCls}
                      value={draft.deadline.hoursRemaining}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          deadline: { ...draft.deadline, hoursRemaining: Number(e.target.value) },
                        })
                      }
                    />
                  </Field>
                  <Field label="Total Window (hours)">
                    <input
                      type="number"
                      className={inputCls}
                      value={draft.deadline.totalWindowHours}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          deadline: { ...draft.deadline, totalWindowHours: Number(e.target.value) },
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            )}

            {section === "brief" && (
              <div className="grid gap-6 max-w-3xl">
                {draft.projectBrief.map((p, i) => (
                  <Field key={i} label={`Paragraph ${i + 1}`}>
                    <textarea
                      rows={5}
                      className={inputCls + " leading-relaxed"}
                      value={p}
                      onChange={(e) => {
                        const next = [...draft.projectBrief];
                        next[i] = e.target.value;
                        setDraft({ ...draft, projectBrief: next });
                      }}
                    />
                    <button
                      onClick={() =>
                        setDraft({
                          ...draft,
                          projectBrief: draft.projectBrief.filter((_, j) => j !== i),
                        })
                      }
                      className="mt-2 label-nav text-[11px] text-destructive/70 hover:text-destructive"
                    >
                      Remove
                    </button>
                  </Field>
                ))}
                <button
                  onClick={() =>
                    setDraft({ ...draft, projectBrief: [...draft.projectBrief, "New paragraph…"] })
                  }
                  className="label-nav text-[11px] text-primary hover:text-primary/80 text-left"
                >
                  + Add Paragraph
                </button>
              </div>
            )}

            {section === "mentor" && (
              <div className="grid gap-6 max-w-2xl">
                <Field label="Name">
                  <input
                    className={inputCls}
                    value={draft.mentor.name}
                    onChange={(e) =>
                      setDraft({ ...draft, mentor: { ...draft.mentor, name: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Initials">
                  <input
                    className={inputCls}
                    value={draft.mentor.initials}
                    onChange={(e) =>
                      setDraft({ ...draft, mentor: { ...draft.mentor, initials: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Industry">
                  <input
                    className={inputCls}
                    value={draft.mentor.industry}
                    onChange={(e) =>
                      setDraft({ ...draft, mentor: { ...draft.mentor, industry: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Bio">
                  <textarea
                    rows={4}
                    className={inputCls + " leading-relaxed"}
                    value={draft.mentor.bio}
                    onChange={(e) =>
                      setDraft({ ...draft, mentor: { ...draft.mentor, bio: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Sessions (JSON)">
                  <JsonEditor
                    value={draft.mentor.sessions}
                    rows={14}
                    onChange={(v) =>
                      setDraft({ ...draft, mentor: { ...draft.mentor, sessions: v as any } })
                    }
                  />
                </Field>
              </div>
            )}

            {section === "team" && (
              <div className="grid gap-6 max-w-3xl">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Team Name">
                    <input
                      className={inputCls}
                      value={draft.teamMeta.name}
                      onChange={(e) =>
                        setDraft({ ...draft, teamMeta: { ...draft.teamMeta, name: e.target.value } })
                      }
                    />
                  </Field>
                  <Field label="Project">
                    <input
                      className={inputCls}
                      value={draft.teamMeta.project}
                      onChange={(e) =>
                        setDraft({ ...draft, teamMeta: { ...draft.teamMeta, project: e.target.value } })
                      }
                    />
                  </Field>
                </div>
                <Field label="Builders (JSON array)">
                  <JsonEditor
                    value={draft.teamBuilders}
                    rows={26}
                    onChange={(v) => setDraft({ ...draft, teamBuilders: v as any })}
                  />
                </Field>
              </div>
            )}

            {section === "projects" && (
              <div className="grid gap-8 max-w-3xl">
                {draft.projects.map((p, i) => (
                  <div key={p.slug} className="border-l-[3px] border-primary pl-5">
                    <p className="label-eyebrow mb-3">Project {i + 1} — {p.slug}</p>
                    <input
                      className={inputCls + " mb-3"}
                      value={p.name}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[i] = { ...p, name: e.target.value };
                        setDraft({ ...draft, projects: next });
                      }}
                    />
                    <textarea
                      rows={2}
                      className={inputCls}
                      value={p.oneLiner}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[i] = { ...p, oneLiner: e.target.value };
                        setDraft({ ...draft, projects: next });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {section === "weeks" && (
              <Field label="Weeks (JSON array)">
                <JsonEditor
                  value={draft.weeks}
                  rows={32}
                  onChange={(v) => setDraft({ ...draft, weeks: v as any })}
                />
              </Field>
            )}

            {section === "events" && (
              <Field label="Calendar Events (JSON array)">
                <JsonEditor
                  value={draft.events}
                  rows={32}
                  onChange={(v) => setDraft({ ...draft, events: v as any })}
                />
              </Field>
            )}

            {section === "faqs" && (
              <Field label="FAQs (JSON array — cat: Submissions|Platform|Mentors|Payments|Gala)">
                <JsonEditor
                  value={draft.faqs}
                  rows={28}
                  onChange={(v) => setDraft({ ...draft, faqs: v as any })}
                />
              </Field>
            )}

            <div className="mt-10 pt-6 border-t border-primary/10 flex gap-4">
              <EditorialButton variant="primary" onClick={save}>Save All Changes</EditorialButton>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Admin;
