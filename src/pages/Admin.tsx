import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Lock, LogOut, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  verifyPassword,
  getStoredPassword,
  clearStoredPassword,
  adminUpsert,
  adminDelete,
  adminCreateBuilder,
  adminDeleteBuilder,
  adminUpdatePassword,
} from "@/admin/api";
import logo from "@/assets/logo.png";

/* ---------- shared UI ---------- */

const input =
  "w-full bg-white border border-slate-200 focus:border-primary outline-none px-3 py-2 text-[14px] text-slate-900 rounded transition-colors";
const textarea = input + " leading-relaxed font-normal resize-y";
const labelCls = "text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1.5 block font-medium";
const btn =
  "inline-flex items-center gap-2 px-4 py-2 rounded text-[13px] font-medium transition-colors";
const btnPrimary = btn + " bg-primary text-primary-foreground hover:bg-primary/90";
const btnGhost = btn + " text-slate-600 hover:bg-slate-100";
const btnDanger = btn + " text-red-600 hover:bg-red-50";
const card = "bg-white border border-slate-200 rounded-lg p-5";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

const useReload = () => {
  const [n, setN] = useState(0);
  return { key: n, reload: () => setN((x) => x + 1) };
};

/* ---------- Lock screen ---------- */

const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await verifyPassword(pw);
      onUnlock();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={submit} className={card + " w-full max-w-md"}>
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="Skillyme" className="h-8 w-auto" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Admin Console</p>
            <h1 className="text-lg font-semibold text-slate-900">Locked</h1>
          </div>
        </div>
        <Field label="Admin password">
          <input
            type="password"
            autoFocus
            className={input}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter password"
          />
        </Field>
        <button type="submit" disabled={busy || !pw} className={btnPrimary + " w-full mt-5 justify-center"}>
          <Lock className="h-4 w-4" />
          {busy ? "Verifying…" : "Unlock"}
        </button>
        <Link to="/welcome" className="block text-center text-[12px] text-slate-500 hover:text-slate-700 mt-4">
          ← Back to platform
        </Link>
      </form>
    </div>
  );
};

/* ---------- Sections ---------- */

type Project = { id: string; number: number; slug: string; name: string; one_liner: string; icon_key: string };
type Team = { id: string; project_id: string; letter: string; name: string };
type Profile = {
  id: string; email: string | null; full_name: string | null; role: string | null;
  role_detail: string | null; country: string | null; country_flag: string | null;
  initials: string | null; team_id: string | null; active_today: boolean; profile_complete: boolean;
};
type Week = {
  id: string; team_id: string | null; number: number; date_range: string; theme: string;
  status: string; expectations: string[]; check_in_due: string | null; check_in_status: string;
  submission_due: string | null; submission_status: string; deliverable_summary: string;
};
type Mentor = { id: string; project_id: string | null; name: string; initials: string | null; bio: string | null; industry: string | null };
type Session = { id: string; mentor_id: string | null; date_label: string | null; focus: string | null; meet_url: string | null; past: boolean; sort_order: number };
type Event = { id: string; date_label: string | null; time_label: string | null; title: string | null; type: string | null; attendees_label: string | null; location: string | null; sort_order: number };
type Faq = { id: string; sort_order: number; question: string; answer: string };
type Settings = { id: number; deadline_title: string | null; deadline_date_label: string | null; hours_remaining: number | null; total_window_hours: number | null; project_brief: string[] };

/* Generic save helper */
const handleSave = async (label: string, fn: () => Promise<unknown>, after?: () => void) => {
  try {
    await fn();
    toast.success(`${label} saved`);
    after?.();
  } catch (err: any) {
    toast.error(err.message);
  }
};

/* ---------- Deadline & Brief ---------- */

const SettingsSection = () => {
  const { key, reload } = useReload();
  const [s, setS] = useState<Settings | null>(null);
  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data }) => setS(data as Settings));
  }, [key]);
  if (!s) return <p className="text-slate-500">Loading…</p>;
  const update = (patch: Partial<Settings>) => setS({ ...s, ...patch });
  const save = () =>
    handleSave("Settings", () => adminUpsert("site_settings", [{ ...s, updated_at: new Date().toISOString() }]), reload);
  return (
    <div className="space-y-6 max-w-3xl">
      <div className={card + " space-y-4"}>
        <h3 className="font-semibold text-slate-900">Deadline banner</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title"><input className={input} value={s.deadline_title ?? ""} onChange={(e) => update({ deadline_title: e.target.value })} /></Field>
          <Field label="Date label"><input className={input} value={s.deadline_date_label ?? ""} onChange={(e) => update({ deadline_date_label: e.target.value })} /></Field>
          <Field label="Hours remaining"><input type="number" className={input} value={s.hours_remaining ?? 0} onChange={(e) => update({ hours_remaining: Number(e.target.value) })} /></Field>
          <Field label="Total window (hours)"><input type="number" className={input} value={s.total_window_hours ?? 0} onChange={(e) => update({ total_window_hours: Number(e.target.value) })} /></Field>
        </div>
      </div>
      <div className={card + " space-y-4"}>
        <h3 className="font-semibold text-slate-900">Project brief paragraphs</h3>
        {s.project_brief.map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea rows={4} className={textarea + " flex-1"} value={p} onChange={(e) => {
              const next = [...s.project_brief]; next[i] = e.target.value; update({ project_brief: next });
            }} />
            <button className={btnDanger} onClick={() => update({ project_brief: s.project_brief.filter((_, j) => j !== i) })}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button className={btnGhost} onClick={() => update({ project_brief: [...s.project_brief, ""] })}>
          <Plus className="h-4 w-4" /> Add paragraph
        </button>
      </div>
      <button className={btnPrimary} onClick={save}><Save className="h-4 w-4" /> Save settings</button>
    </div>
  );
};

/* ---------- Projects ---------- */

const ICONS = ["building", "sprout", "wallet", "graduation-cap", "heart-pulse", "truck", "leaf", "users", "briefcase", "bar-chart"];

const ProjectsSection = () => {
  const { key, reload } = useReload();
  const [rows, setRows] = useState<Project[]>([]);
  useEffect(() => {
    supabase.from("projects").select("*").order("number").then(({ data }) => setRows((data ?? []) as Project[]));
  }, [key]);
  const patch = (i: number, p: Partial<Project>) => {
    const next = [...rows]; next[i] = { ...next[i], ...p }; setRows(next);
  };
  const saveOne = (p: Project) => handleSave("Project", () => adminUpsert("projects", [p]), reload);
  const removeOne = (p: Project) => {
    if (!confirm(`Delete project "${p.name}"? Teams and weeks under it will also be removed.`)) return;
    handleSave("Project", () => adminDelete("projects", [p.id]), reload);
  };
  const addOne = () => {
    const nextNum = Math.max(0, ...rows.map((r) => r.number)) + 1;
    handleSave("Project", () =>
      adminUpsert("projects", [{ number: nextNum, slug: `project-${nextNum}`, name: "New project", one_liner: "", icon_key: "briefcase" }]),
      reload);
  };
  return (
    <div className="space-y-4 max-w-3xl">
      {rows.map((p, i) => (
        <div key={p.id} className={card + " space-y-3"}>
          <div className="grid sm:grid-cols-[80px_1fr_180px] gap-3">
            <Field label="#"><input type="number" className={input} value={p.number} onChange={(e) => patch(i, { number: Number(e.target.value) })} /></Field>
            <Field label="Name"><input className={input} value={p.name} onChange={(e) => patch(i, { name: e.target.value })} /></Field>
            <Field label="Icon">
              <select className={input} value={p.icon_key} onChange={(e) => patch(i, { icon_key: e.target.value })}>
                {ICONS.map((k) => <option key={k}>{k}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Slug"><input className={input} value={p.slug} onChange={(e) => patch(i, { slug: e.target.value })} /></Field>
          <Field label="One-liner"><textarea rows={2} className={textarea} value={p.one_liner} onChange={(e) => patch(i, { one_liner: e.target.value })} /></Field>
          <div className="flex gap-2 pt-2">
            <button className={btnPrimary} onClick={() => saveOne(p)}><Save className="h-4 w-4" /> Save</button>
            <button className={btnDanger} onClick={() => removeOne(p)}><Trash2 className="h-4 w-4" /> Delete</button>
          </div>
        </div>
      ))}
      <button className={btnGhost} onClick={addOne}><Plus className="h-4 w-4" /> Add project</button>
    </div>
  );
};

/* ---------- Teams ---------- */

const TeamsSection = () => {
  const { key, reload } = useReload();
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    Promise.all([
      supabase.from("teams").select("*").order("name"),
      supabase.from("projects").select("*").order("number"),
    ]).then(([t, p]) => {
      setTeams((t.data ?? []) as Team[]);
      setProjects((p.data ?? []) as Project[]);
    });
  }, [key]);
  const patch = (i: number, p: Partial<Team>) => {
    const next = [...teams]; next[i] = { ...next[i], ...p }; setTeams(next);
  };
  const saveOne = (t: Team) => handleSave("Team", () => adminUpsert("teams", [t]), reload);
  const removeOne = (t: Team) => {
    if (!confirm(`Delete team "${t.name}"?`)) return;
    handleSave("Team", () => adminDelete("teams", [t.id]), reload);
  };
  const addOne = () => {
    if (!projects[0]) return toast.error("Create a project first.");
    handleSave("Team", () =>
      adminUpsert("teams", [{ project_id: projects[0].id, letter: "C", name: "New team" }]),
      reload);
  };
  return (
    <div className="space-y-4 max-w-3xl">
      {teams.map((t, i) => (
        <div key={t.id} className={card + " grid sm:grid-cols-[1fr_120px_1fr_auto] gap-3 items-end"}>
          <Field label="Name"><input className={input} value={t.name} onChange={(e) => patch(i, { name: e.target.value })} /></Field>
          <Field label="Letter"><input className={input} value={t.letter} onChange={(e) => patch(i, { letter: e.target.value })} /></Field>
          <Field label="Project">
            <select className={input} value={t.project_id} onChange={(e) => patch(i, { project_id: e.target.value })}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <div className="flex gap-1">
            <button className={btnPrimary} onClick={() => saveOne(t)}><Save className="h-4 w-4" /></button>
            <button className={btnDanger} onClick={() => removeOne(t)}><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
      <button className={btnGhost} onClick={addOne}><Plus className="h-4 w-4" /> Add team</button>
    </div>
  );
};

/* ---------- Builders ---------- */

const initialsOf = (n: string) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const BuildersSection = () => {
  const { key, reload } = useReload();
  const [rows, setRows] = useState<Profile[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filter, setFilter] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    email: "", full_name: "", role: "", role_detail: "",
    country: "", country_flag: "", team_id: "",
  });

  useEffect(() => {
    Promise.all([
      supabase.from("profiles").select("*").order("full_name"),
      supabase.from("teams").select("*").order("name"),
    ]).then(([p, t]) => {
      setRows((p.data ?? []) as Profile[]);
      setTeams((t.data ?? []) as Team[]);
    });
  }, [key]);

  const patch = (i: number, p: Partial<Profile>) => {
    const next = [...rows]; next[i] = { ...next[i], ...p }; setRows(next);
  };
  const saveOne = (p: Profile) =>
    handleSave("Builder", () => adminUpsert("profiles", [{
      id: p.id, full_name: p.full_name, role: p.role, role_detail: p.role_detail,
      country: p.country, country_flag: p.country_flag,
      initials: p.initials ?? (p.full_name ? initialsOf(p.full_name) : null),
      team_id: p.team_id, active_today: p.active_today, profile_complete: p.profile_complete,
    }]), reload);
  const removeOne = (p: Profile) => {
    if (!confirm(`Delete builder ${p.full_name ?? p.email}? Their account will also be removed.`)) return;
    handleSave("Builder", () => adminDeleteBuilder(p.id), reload);
  };
  const createOne = async () => {
    if (!draft.email || !draft.full_name) return toast.error("Email and name required.");
    await handleSave("Builder", () =>
      adminCreateBuilder({ ...draft, initials: initialsOf(draft.full_name), team_id: draft.team_id || null }),
      () => {
        setAdding(false);
        setDraft({ email: "", full_name: "", role: "", role_detail: "", country: "", country_flag: "", team_id: "" });
        reload();
      });
  };

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      (r.full_name ?? "").toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      (r.role ?? "").toLowerCase().includes(q),
    );
  }, [rows, filter]);

  const teamLabel = (id: string | null) => teams.find((t) => t.id === id)?.name ?? "—";

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center gap-3">
        <input className={input + " max-w-sm"} placeholder="Search by name, email, role…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <button className={btnPrimary} onClick={() => setAdding((v) => !v)}><Plus className="h-4 w-4" /> Add builder</button>
        <span className="text-[12px] text-slate-500">{rows.length} total</span>
      </div>

      {adding && (
        <div className={card + " space-y-3 bg-amber-50/40 border-amber-200"}>
          <h4 className="font-semibold text-slate-900">New builder</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Email"><input className={input} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
            <Field label="Full name"><input className={input} value={draft.full_name} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} /></Field>
            <Field label="Role"><input className={input} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></Field>
            <Field label="Country"><input className={input} value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} /></Field>
            <Field label="Flag emoji"><input className={input} value={draft.country_flag} onChange={(e) => setDraft({ ...draft, country_flag: e.target.value })} /></Field>
            <Field label="Team">
              <select className={input} value={draft.team_id} onChange={(e) => setDraft({ ...draft, team_id: e.target.value })}>
                <option value="">(unassigned)</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Role detail"><textarea rows={2} className={textarea} value={draft.role_detail} onChange={(e) => setDraft({ ...draft, role_detail: e.target.value })} /></Field>
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={createOne}><Save className="h-4 w-4" /> Create</button>
            <button className={btnGhost} onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((p) => {
          const i = rows.findIndex((r) => r.id === p.id);
          return (
            <details key={p.id} className={card + " group"}>
              <summary className="cursor-pointer flex items-center gap-4 list-none">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-slate-700 text-[12px] font-semibold">
                  {p.initials ?? (p.full_name ? initialsOf(p.full_name) : "?")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-slate-900 truncate">{p.full_name ?? <span className="italic text-slate-400">No name</span>}</p>
                  <p className="text-[12px] text-slate-500 truncate">{p.role ?? "—"} · {teamLabel(p.team_id)}</p>
                </div>
                <span className="text-[11px] text-slate-400">{p.email}</span>
              </summary>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <Field label="Full name"><input className={input} value={p.full_name ?? ""} onChange={(e) => patch(i, { full_name: e.target.value })} /></Field>
                <Field label="Role"><input className={input} value={p.role ?? ""} onChange={(e) => patch(i, { role: e.target.value })} /></Field>
                <Field label="Country"><input className={input} value={p.country ?? ""} onChange={(e) => patch(i, { country: e.target.value })} /></Field>
                <Field label="Flag emoji"><input className={input} value={p.country_flag ?? ""} onChange={(e) => patch(i, { country_flag: e.target.value })} /></Field>
                <Field label="Team">
                  <select className={input} value={p.team_id ?? ""} onChange={(e) => patch(i, { team_id: e.target.value || null })}>
                    <option value="">(unassigned)</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </Field>
                <Field label="Active today">
                  <select className={input} value={p.active_today ? "y" : "n"} onChange={(e) => patch(i, { active_today: e.target.value === "y" })}>
                    <option value="y">Yes</option><option value="n">No</option>
                  </select>
                </Field>
              </div>
              <Field label="Role detail"><textarea rows={2} className={textarea} value={p.role_detail ?? ""} onChange={(e) => patch(i, { role_detail: e.target.value })} /></Field>
              <div className="flex gap-2 mt-3">
                <button className={btnPrimary} onClick={() => saveOne(p)}><Save className="h-4 w-4" /> Save</button>
                <button className={btnDanger} onClick={() => removeOne(p)}><Trash2 className="h-4 w-4" /> Delete</button>
              </div>
            </details>
          );
        })}
        {filtered.length === 0 && <p className="text-slate-500 text-[13px]">No builders match.</p>}
      </div>
    </div>
  );
};

/* ---------- Weeks ---------- */

const WeeksSection = () => {
  const { key, reload } = useReload();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState<string>("");
  const [weeks, setWeeks] = useState<Week[]>([]);
  useEffect(() => {
    supabase.from("teams").select("*").order("name").then(({ data }) => {
      const ts = (data ?? []) as Team[];
      setTeams(ts);
      if (!teamId && ts[0]) setTeamId(ts[0].id);
    });
  }, [key]);
  useEffect(() => {
    if (!teamId) return;
    supabase.from("weeks").select("*").eq("team_id", teamId).order("number")
      .then(({ data }) => setWeeks((data ?? []) as Week[]));
  }, [teamId, key]);

  const patch = (i: number, p: Partial<Week>) => {
    const next = [...weeks]; next[i] = { ...next[i], ...p }; setWeeks(next);
  };
  const saveOne = (w: Week) => handleSave("Week", () => adminUpsert("weeks", [w]), reload);
  const removeOne = (w: Week) => {
    if (!confirm(`Delete Week ${w.number}?`)) return;
    handleSave("Week", () => adminDelete("weeks", [w.id]), reload);
  };
  const addOne = () => {
    const next = Math.max(0, ...weeks.map((w) => w.number)) + 1;
    handleSave("Week", () =>
      adminUpsert("weeks", [{ team_id: teamId, number: next, date_range: "", theme: "", status: "upcoming", expectations: [], check_in_status: "upcoming", submission_status: "upcoming", deliverable_summary: "" }]),
      reload);
  };

  const STATUSES = ["upcoming", "active", "submitted", "missed", "open", "in_review"];

  return (
    <div className="space-y-4 max-w-4xl">
      <Field label="Team">
        <select className={input + " max-w-md"} value={teamId} onChange={(e) => setTeamId(e.target.value)}>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </Field>
      {weeks.map((w, i) => (
        <div key={w.id} className={card + " space-y-3"}>
          <div className="grid sm:grid-cols-[80px_1fr_1fr_140px] gap-3">
            <Field label="Week #"><input type="number" className={input} value={w.number} onChange={(e) => patch(i, { number: Number(e.target.value) })} /></Field>
            <Field label="Date range"><input className={input} value={w.date_range} onChange={(e) => patch(i, { date_range: e.target.value })} /></Field>
            <Field label="Theme"><input className={input} value={w.theme} onChange={(e) => patch(i, { theme: e.target.value })} /></Field>
            <Field label="Status">
              <select className={input} value={w.status} onChange={(e) => patch(i, { status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Expectations (one per line)">
            <textarea rows={4} className={textarea} value={w.expectations.join("\n")}
              onChange={(e) => patch(i, { expectations: e.target.value.split("\n").filter(Boolean) })} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Check-in due"><input className={input} value={w.check_in_due ?? ""} onChange={(e) => patch(i, { check_in_due: e.target.value })} /></Field>
            <Field label="Check-in status">
              <select className={input} value={w.check_in_status} onChange={(e) => patch(i, { check_in_status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Submission due"><input className={input} value={w.submission_due ?? ""} onChange={(e) => patch(i, { submission_due: e.target.value })} /></Field>
            <Field label="Submission status">
              <select className={input} value={w.submission_status} onChange={(e) => patch(i, { submission_status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Deliverable summary"><textarea rows={2} className={textarea} value={w.deliverable_summary} onChange={(e) => patch(i, { deliverable_summary: e.target.value })} /></Field>
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={() => saveOne(w)}><Save className="h-4 w-4" /> Save</button>
            <button className={btnDanger} onClick={() => removeOne(w)}><Trash2 className="h-4 w-4" /> Delete</button>
          </div>
        </div>
      ))}
      <button className={btnGhost} onClick={addOne} disabled={!teamId}><Plus className="h-4 w-4" /> Add week</button>
    </div>
  );
};

/* ---------- Mentor & Sessions ---------- */

const MentorSection = () => {
  const { key, reload } = useReload();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    Promise.all([
      supabase.from("mentors").select("*").order("name"),
      supabase.from("mentor_sessions").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("number"),
    ]).then(([m, s, p]) => {
      setMentors((m.data ?? []) as Mentor[]);
      setSessions((s.data ?? []) as Session[]);
      setProjects((p.data ?? []) as Project[]);
    });
  }, [key]);

  const patchMentor = (i: number, p: Partial<Mentor>) => {
    const next = [...mentors]; next[i] = { ...next[i], ...p }; setMentors(next);
  };
  const patchSession = (i: number, p: Partial<Session>) => {
    const next = [...sessions]; next[i] = { ...next[i], ...p }; setSessions(next);
  };
  const projectLabel = (id: string | null) => projects.find((p) => p.id === id)?.name ?? "—";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Mentors</h3>
        {mentors.map((m, i) => (
          <div key={m.id} className={card + " space-y-3"}>
            <div className="grid sm:grid-cols-[1fr_100px_1fr] gap-3">
              <Field label="Name"><input className={input} value={m.name} onChange={(e) => patchMentor(i, { name: e.target.value })} /></Field>
              <Field label="Initials"><input className={input} value={m.initials ?? ""} onChange={(e) => patchMentor(i, { initials: e.target.value })} /></Field>
              <Field label="Project">
                <select className={input} value={m.project_id ?? ""} onChange={(e) => patchMentor(i, { project_id: e.target.value || null })}>
                  <option value="">(none)</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Industry"><input className={input} value={m.industry ?? ""} onChange={(e) => patchMentor(i, { industry: e.target.value })} /></Field>
            <Field label="Bio"><textarea rows={3} className={textarea} value={m.bio ?? ""} onChange={(e) => patchMentor(i, { bio: e.target.value })} /></Field>
            <div className="flex gap-2">
              <button className={btnPrimary} onClick={() => handleSave("Mentor", () => adminUpsert("mentors", [m]), reload)}><Save className="h-4 w-4" /> Save</button>
              <button className={btnDanger} onClick={() => {
                if (!confirm(`Delete mentor "${m.name}"?`)) return;
                handleSave("Mentor", () => adminDelete("mentors", [m.id]), reload);
              }}><Trash2 className="h-4 w-4" /> Delete</button>
            </div>
          </div>
        ))}
        <button className={btnGhost} onClick={() =>
          handleSave("Mentor", () => adminUpsert("mentors", [{ name: "New mentor", project_id: projects[0]?.id ?? null }]), reload)
        }><Plus className="h-4 w-4" /> Add mentor</button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Sessions</h3>
        {sessions.map((s, i) => (
          <div key={s.id} className={card + " space-y-3"}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Mentor">
                <select className={input} value={s.mentor_id ?? ""} onChange={(e) => patchSession(i, { mentor_id: e.target.value || null })}>
                  <option value="">(unassigned)</option>
                  {mentors.map((m) => <option key={m.id} value={m.id}>{m.name} — {projectLabel(m.project_id)}</option>)}
                </select>
              </Field>
              <Field label="Date label"><input className={input} value={s.date_label ?? ""} onChange={(e) => patchSession(i, { date_label: e.target.value })} /></Field>
              <Field label="Focus"><input className={input} value={s.focus ?? ""} onChange={(e) => patchSession(i, { focus: e.target.value })} /></Field>
              <Field label="Meet URL"><input className={input} value={s.meet_url ?? ""} onChange={(e) => patchSession(i, { meet_url: e.target.value })} /></Field>
              <Field label="Sort order"><input type="number" className={input} value={s.sort_order} onChange={(e) => patchSession(i, { sort_order: Number(e.target.value) })} /></Field>
              <Field label="Past?">
                <select className={input} value={s.past ? "y" : "n"} onChange={(e) => patchSession(i, { past: e.target.value === "y" })}>
                  <option value="n">No</option><option value="y">Yes</option>
                </select>
              </Field>
            </div>
            <div className="flex gap-2">
              <button className={btnPrimary} onClick={() => handleSave("Session", () => adminUpsert("mentor_sessions", [s]), reload)}><Save className="h-4 w-4" /> Save</button>
              <button className={btnDanger} onClick={() => {
                if (!confirm(`Delete this session?`)) return;
                handleSave("Session", () => adminDelete("mentor_sessions", [s.id]), reload);
              }}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        <button className={btnGhost} onClick={() =>
          handleSave("Session", () => adminUpsert("mentor_sessions", [{ mentor_id: mentors[0]?.id ?? null, date_label: "", focus: "", meet_url: "", past: false, sort_order: sessions.length }]), reload)
        }><Plus className="h-4 w-4" /> Add session</button>
      </div>
    </div>
  );
};

/* ---------- Events ---------- */

const EventsSection = () => {
  const { key, reload } = useReload();
  const [rows, setRows] = useState<Event[]>([]);
  useEffect(() => {
    supabase.from("events").select("*").order("sort_order").then(({ data }) => setRows((data ?? []) as Event[]));
  }, [key]);
  const patch = (i: number, p: Partial<Event>) => {
    const next = [...rows]; next[i] = { ...next[i], ...p }; setRows(next);
  };
  return (
    <div className="space-y-4 max-w-4xl">
      {rows.map((ev, i) => (
        <div key={ev.id} className={card + " space-y-3"}>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Date label"><input className={input} value={ev.date_label ?? ""} onChange={(e) => patch(i, { date_label: e.target.value })} /></Field>
            <Field label="Time label"><input className={input} value={ev.time_label ?? ""} onChange={(e) => patch(i, { time_label: e.target.value })} /></Field>
            <Field label="Type"><input className={input} value={ev.type ?? ""} onChange={(e) => patch(i, { type: e.target.value })} /></Field>
          </div>
          <Field label="Title"><input className={input} value={ev.title ?? ""} onChange={(e) => patch(i, { title: e.target.value })} /></Field>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Attendees"><input className={input} value={ev.attendees_label ?? ""} onChange={(e) => patch(i, { attendees_label: e.target.value })} /></Field>
            <Field label="Location"><input className={input} value={ev.location ?? ""} onChange={(e) => patch(i, { location: e.target.value })} /></Field>
            <Field label="Sort"><input type="number" className={input} value={ev.sort_order} onChange={(e) => patch(i, { sort_order: Number(e.target.value) })} /></Field>
          </div>
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={() => handleSave("Event", () => adminUpsert("events", [ev]), reload)}><Save className="h-4 w-4" /> Save</button>
            <button className={btnDanger} onClick={() => {
              if (!confirm("Delete event?")) return;
              handleSave("Event", () => adminDelete("events", [ev.id]), reload);
            }}><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
      <button className={btnGhost} onClick={() =>
        handleSave("Event", () => adminUpsert("events", [{ date_label: "", time_label: "", title: "New event", type: "milestone", attendees_label: "", location: "", sort_order: rows.length }]), reload)
      }><Plus className="h-4 w-4" /> Add event</button>
    </div>
  );
};

/* ---------- FAQs ---------- */

const FaqsSection = () => {
  const { key, reload } = useReload();
  const [rows, setRows] = useState<Faq[]>([]);
  useEffect(() => {
    supabase.from("faqs").select("*").order("sort_order").then(({ data }) => setRows((data ?? []) as Faq[]));
  }, [key]);
  const patch = (i: number, p: Partial<Faq>) => {
    const next = [...rows]; next[i] = { ...next[i], ...p }; setRows(next);
  };
  return (
    <div className="space-y-4 max-w-3xl">
      {rows.map((f, i) => (
        <div key={f.id} className={card + " space-y-3"}>
          <div className="grid sm:grid-cols-[1fr_100px] gap-3">
            <Field label="Question"><input className={input} value={f.question} onChange={(e) => patch(i, { question: e.target.value })} /></Field>
            <Field label="Sort"><input type="number" className={input} value={f.sort_order} onChange={(e) => patch(i, { sort_order: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Answer"><textarea rows={4} className={textarea} value={f.answer} onChange={(e) => patch(i, { answer: e.target.value })} /></Field>
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={() => handleSave("FAQ", () => adminUpsert("faqs", [f]), reload)}><Save className="h-4 w-4" /> Save</button>
            <button className={btnDanger} onClick={() => {
              if (!confirm("Delete FAQ?")) return;
              handleSave("FAQ", () => adminDelete("faqs", [f.id]), reload);
            }}><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
      <button className={btnGhost} onClick={() =>
        handleSave("FAQ", () => adminUpsert("faqs", [{ question: "New question", answer: "", sort_order: rows.length }]), reload)
      }><Plus className="h-4 w-4" /> Add FAQ</button>
    </div>
  );
};

/* ---------- Password ---------- */

const PasswordSection = () => {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  return (
    <div className={card + " max-w-md space-y-4"}>
      <h3 className="font-semibold text-slate-900">Change admin password</h3>
      <Field label="New password"><input type="password" className={input} value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
      <Field label="Confirm"><input type="password" className={input} value={pw2} onChange={(e) => setPw2(e.target.value)} /></Field>
      <button className={btnPrimary} onClick={async () => {
        if (pw.length < 6) return toast.error("Min 6 characters.");
        if (pw !== pw2) return toast.error("Passwords don't match.");
        await handleSave("Password", () => adminUpdatePassword(pw), () => { setPw(""); setPw2(""); });
      }}><Save className="h-4 w-4" /> Update password</button>
    </div>
  );
};

/* ---------- Shell ---------- */

const SECTIONS = [
  { key: "settings", label: "Deadline & Brief", render: () => <SettingsSection /> },
  { key: "projects", label: "Projects", render: () => <ProjectsSection /> },
  { key: "teams", label: "Teams", render: () => <TeamsSection /> },
  { key: "builders", label: "Builders", render: () => <BuildersSection /> },
  { key: "weeks", label: "Weekly plan", render: () => <WeeksSection /> },
  { key: "mentor", label: "Mentor & sessions", render: () => <MentorSection /> },
  { key: "events", label: "Calendar events", render: () => <EventsSection /> },
  { key: "faqs", label: "FAQs", render: () => <FaqsSection /> },
  { key: "password", label: "Admin password", render: () => <PasswordSection /> },
] as const;

const Admin = () => {
  const [unlocked, setUnlocked] = useState(!!getStoredPassword());
  const [section, setSection] = useState<(typeof SECTIONS)[number]["key"]>("settings");

  if (!unlocked) return <LockScreen onUnlock={() => setUnlocked(true)} />;

  const current = SECTIONS.find((s) => s.key === section)!;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="mx-auto max-w-[1400px] px-6 h-14 flex items-center gap-4">
          <img src={logo} alt="Skillyme" className="h-7 w-auto" />
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 leading-none">Skillyme Africa</p>
            <p className="text-[13px] font-semibold leading-tight">Admin Console</p>
          </div>
          <Link to="/welcome" className={btnGhost}><ArrowLeft className="h-4 w-4" /> Platform</Link>
          <button className={btnGhost} onClick={() => { clearStoredPassword(); setUnlocked(false); }}>
            <LogOut className="h-4 w-4" /> Lock
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <aside>
          <nav className="space-y-0.5 sticky top-20">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`w-full text-left px-3 py-2 rounded text-[13px] transition-colors ${
                  section === s.key ? "bg-primary/10 text-primary font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <h2 className="text-2xl font-semibold mb-6">{current.label}</h2>
          {current.render()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
