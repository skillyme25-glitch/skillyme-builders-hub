import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EditorialButton } from "@/components/ui/editorial-button";
import { TEAM, VIEWER_ID } from "@/data/mock";
import {
  PAST_CHECKINS, PAST_TEAM_SUBMISSIONS,
  TOTAL_REQUIRED_SUBMISSIONS, COMPLETED_SUBMISSIONS,
} from "@/data/directory";
import { ChevronDown, ChevronUp, Check, Link2, Upload } from "lucide-react";

type TabKey = "checkin" | "team";

const Status = ({ s }: { s: "upcoming" | "open" | "submitted" | "missed" | "in_review" }) => {
  const m: Record<string, string> = {
    upcoming: "border border-foreground/30 text-foreground/60",
    open: "bg-primary text-primary-foreground",
    submitted: "bg-success text-success-foreground",
    missed: "bg-destructive text-destructive-foreground animate-pulse-danger",
    in_review: "border border-primary text-primary",
  };
  const lbl: Record<string, string> = {
    upcoming: "Upcoming", open: "Open", submitted: "Submitted",
    missed: "Missed", in_review: "In Review",
  };
  return <span className={`inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-nav ${m[s]}`}>{lbl[s]}</span>;
};

/* ---------------- Tab 1 — Wednesday Check-In ---------------- */
const CheckInTab = () => {
  const [responses, setResponses] = useState({ completed: "", stuck: "", commit: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => setSubmitted(true);
  const ready = responses.completed.trim() && responses.stuck.trim() && responses.commit.trim();

  return (
    <div className="space-y-16">
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <p className="label-eyebrow mb-3">Week 2 Check-In</p>
            <p className="text-muted-foreground text-[14px]">Due Wednesday, June 4 · 23:59 EAT</p>
          </div>
          <Status s={submitted ? "submitted" : "open"} />
        </div>

        <div className="gold-divider opacity-30 mt-8 mb-10" />

        {submitted ? (
          <div className="bg-success/10 border border-success/40 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Check className="h-5 w-5 text-success" strokeWidth={1.5} />
              <p className="label-nav text-[11px] text-success">Check-in submitted</p>
            </div>
            <p className="text-foreground text-[15px] leading-relaxed mb-4">
              Timestamp: {new Date().toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} EAT.
              Your response has been recorded and shared with your project coordinator.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl">
            {[
              { k: "completed", label: "What did you complete this week?", rows: 5,
                ph: "Be specific. What did you actually finish — not plan to finish." },
              { k: "stuck", label: "Where are you stuck?", rows: 4,
                ph: "Be honest. Stuck means something is blocking progress. What is that thing?" },
              { k: "commit", label: "What do you commit to by Sunday?", rows: 4,
                ph: "Name the specific deliverable your team will submit this Sunday." },
            ].map((f) => (
              <div key={f.k} className="border-l-[3px] border-primary pl-6">
                <label className="label-eyebrow block mb-3">{f.label}</label>
                <textarea
                  rows={f.rows}
                  value={responses[f.k as keyof typeof responses]}
                  onChange={(e) => setResponses({ ...responses, [f.k]: e.target.value })}
                  placeholder={f.ph}
                  className="w-full bg-card border border-primary/15 focus:border-primary/50 outline-none p-4 text-[15px] text-foreground placeholder:text-muted-foreground leading-relaxed resize-y transition-colors"
                />
              </div>
            ))}

            <div className="pt-4">
              <EditorialButton variant="primary" onClick={handleSubmit} disabled={!ready}>
                Submit Wednesday Check-In
              </EditorialButton>
            </div>
          </div>
        )}
      </div>

      {/* Past check-ins */}
      <div>
        <p className="label-eyebrow mb-6">Previous Check-Ins</p>
        <div className="border-y border-primary/15 divide-y divide-primary/10">
          {PAST_CHECKINS.map((c) => <PastCheckInRow key={c.weekNumber} c={c} />)}
        </div>
      </div>
    </div>
  );
};

const PastCheckInRow = ({ c }: { c: typeof PAST_CHECKINS[number] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left hover:bg-foreground/[0.02] transition-colors"
      >
        <div className="flex items-baseline gap-6">
          <span className="label-eyebrow">Week {String(c.weekNumber).padStart(2, "0")}</span>
          <span className="text-[13px] text-muted-foreground">{c.dateLabel}</span>
        </div>
        <div className="flex items-center gap-4">
          <Status s={c.status} />
          {open ? <ChevronUp className="h-4 w-4 text-foreground/50" /> : <ChevronDown className="h-4 w-4 text-foreground/50" />}
        </div>
      </button>
      {open && c.responses && (
        <div className="pb-8 pt-2 space-y-5 max-w-3xl animate-fade-in">
          {[
            { label: "Completed", v: c.responses.completed },
            { label: "Stuck", v: c.responses.stuck },
            { label: "Committed by Sunday", v: c.responses.commit },
          ].map((f) => (
            <div key={f.label} className="border-l-[3px] border-primary/40 pl-5">
              <p className="label-nav text-[10px] text-primary/80 mb-2">{f.label}</p>
              <p className="text-foreground/80 text-[14px] leading-relaxed">{f.v}</p>
            </div>
          ))}
          <p className="label-nav text-[10px] text-muted-foreground pt-2">{c.timestamp}</p>
        </div>
      )}
    </div>
  );
};

/* ---------------- Tab 2 — Sunday Team Submission ---------------- */
const TeamTab = () => {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set(["b-a-04", "b-a-07"])); // viewer + researcher
  const [mode, setMode] = useState<"file" | "link">("link");
  const [link, setLink] = useState("");
  const [summary, setSummary] = useState("");
  const [reqOpen, setReqOpen] = useState(true);

  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length;
  const REQUIRED_ROLES = ["Technical Lead", "Sales Lead", "Project Manager"];
  const requiredReviewed = TEAM.builders
    .filter((b) => REQUIRED_ROLES.includes(b.role))
    .every((b) => reviewed.has(b.id));

  const submitEnabled = requiredReviewed && (link.trim().length > 0) && wordCount > 0 && wordCount <= 500;

  const markReviewed = () => {
    setReviewed((prev) => {
      const next = new Set(prev);
      next.add(VIEWER_ID);
      return next;
    });
  };

  return (
    <div className="space-y-16">
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <p className="label-eyebrow mb-3">Week 2 Team Submission</p>
            <p className="text-muted-foreground text-[14px]">Due Sunday, June 8 · 23:59 EAT</p>
          </div>
          <Status s="upcoming" />
        </div>

        <div className="gold-divider opacity-30 mt-8 mb-10" />

        {/* Requirements */}
        <div className="border-l-[3px] border-primary pl-6 mb-10">
          <button
            onClick={() => setReqOpen((v) => !v)}
            className="flex items-center justify-between w-full mb-3"
          >
            <p className="label-eyebrow">What is required this week</p>
            {reqOpen ? <ChevronUp className="h-4 w-4 text-foreground/50" /> : <ChevronDown className="h-4 w-4 text-foreground/50" />}
          </button>
          {reqOpen && (
            <ul className="space-y-3 text-[15px] text-foreground/85 leading-relaxed animate-fade-in">
              <li className="flex gap-3"><span className="text-primary">·</span> 3 user interview summaries (PDF or Google Doc link).</li>
              <li className="flex gap-3"><span className="text-primary">·</span> Core product wireframes (PDF, Figma link, or image).</li>
              <li className="flex gap-3"><span className="text-primary">·</span> Chosen technology stack with brief reasoning.</li>
              <li className="flex gap-3"><span className="text-primary">·</span> Written summary — maximum 500 words.</li>
            </ul>
          )}
        </div>

        {/* Team review */}
        <div className="bg-card border border-primary/15 p-8 mb-10">
          <p className="label-eyebrow mb-5">Team Sign-Off</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {TEAM.builders.map((b) => {
              const r = reviewed.has(b.id);
              return (
                <div
                  key={b.id}
                  title={`${b.name} · ${b.role}${r ? " · reviewed" : ""}`}
                  className={`relative flex h-10 w-10 items-center justify-center font-serif-display text-[12px] ${
                    r ? "bg-primary/15 border-2 border-primary text-primary" : "border border-foreground/15 text-foreground/40"
                  }`}
                >
                  {b.initials}
                  {r && <Check className="absolute -top-1.5 -right-1.5 h-3 w-3 text-primary bg-background" strokeWidth={2} />}
                </div>
              );
            })}
          </div>
          <p className="text-[13px] text-muted-foreground mb-5">
            {reviewed.size} of 10 team members have reviewed.
            At least the technical lead, sales lead, and project manager must review before submission is enabled.
          </p>
          <EditorialButton
            variant="secondary"
            onClick={markReviewed}
            disabled={reviewed.has(VIEWER_ID)}
          >
            {reviewed.has(VIEWER_ID) ? "You have reviewed" : "Mark as Reviewed"}
          </EditorialButton>
        </div>

        {/* Form */}
        <div className="space-y-6 max-w-3xl">
          <div className="border-l-[3px] border-primary pl-6">
            <label className="label-eyebrow block mb-4">Your Deliverable</label>
            <div className="inline-flex border border-primary/30 mb-4">
              <button
                onClick={() => setMode("file")}
                className={`label-nav text-[10px] px-4 py-2 transition-colors ${mode === "file" ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"}`}
              >
                <Upload className="inline h-3 w-3 mr-2" strokeWidth={1.5} />Upload File
              </button>
              <button
                onClick={() => setMode("link")}
                className={`label-nav text-[10px] px-4 py-2 transition-colors ${mode === "link" ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"}`}
              >
                <Link2 className="inline h-3 w-3 mr-2" strokeWidth={1.5} />Paste Link
              </button>
            </div>
            {mode === "link" ? (
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://docs.google.com/... or Figma / GitHub URL"
                className="w-full bg-card border border-primary/15 focus:border-primary/50 outline-none p-4 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors"
              />
            ) : (
              <div className="border border-dashed border-primary/30 p-10 text-center bg-card">
                <Upload className="h-6 w-6 text-primary/70 mx-auto mb-3" strokeWidth={1.2} />
                <p className="text-[14px] text-foreground/80 mb-1">Drop a PDF here or click to browse</p>
                <p className="text-[12px] text-muted-foreground">Maximum 20MB</p>
              </div>
            )}
          </div>

          <div className="border-l-[3px] border-primary pl-6">
            <label className="label-eyebrow block mb-3">Submission Summary</label>
            <textarea
              rows={8}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe what you built or produced this week, what you learned from user research or testing, and what you are building toward next week. Maximum 500 words."
              className="w-full bg-card border border-primary/15 focus:border-primary/50 outline-none p-4 text-[15px] text-foreground placeholder:text-muted-foreground leading-relaxed resize-y transition-colors"
            />
            <p className={`label-nav text-[10px] mt-2 ${wordCount > 500 ? "text-destructive" : "text-muted-foreground"}`}>
              {wordCount} / 500 words
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3 max-w-md">
            <EditorialButton variant="primary" disabled={!submitEnabled}>
              Submit Team Deliverable
            </EditorialButton>
            {!requiredReviewed && (
              <p className="text-[12px] text-muted-foreground italic">
                Waiting for team sign-off before submission is enabled.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Past team submissions */}
      <div>
        <p className="label-eyebrow mb-6">Previous Team Submissions</p>
        <div className="border-y border-primary/15 divide-y divide-primary/10">
          {PAST_TEAM_SUBMISSIONS.map((s) => <PastTeamRow key={s.weekNumber} s={s} />)}
        </div>
      </div>
    </div>
  );
};

const PastTeamRow = ({ s }: { s: typeof PAST_TEAM_SUBMISSIONS[number] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left hover:bg-foreground/[0.02] transition-colors"
      >
        <div className="flex items-baseline gap-6">
          <span className="label-eyebrow">Week {String(s.weekNumber).padStart(2, "0")}</span>
          <span className="text-[13px] text-muted-foreground">{s.dateLabel}</span>
        </div>
        <div className="flex items-center gap-4">
          <Status s={s.status} />
          {open ? <ChevronUp className="h-4 w-4 text-foreground/50" /> : <ChevronDown className="h-4 w-4 text-foreground/50" />}
        </div>
      </button>
      {open && (
        <div className="pb-8 pt-2 space-y-6 max-w-3xl animate-fade-in">
          {s.deliverableHref && (
            <div className="border-l-[3px] border-primary/40 pl-5">
              <p className="label-nav text-[10px] text-primary/80 mb-2">Deliverable</p>
              <a href={s.deliverableHref} className="text-foreground hover:text-primary text-[14px] underline underline-offset-4">
                {s.deliverableLabel}
              </a>
            </div>
          )}
          {s.summary && (
            <div className="border-l-[3px] border-primary/40 pl-5">
              <p className="label-nav text-[10px] text-primary/80 mb-2">Summary</p>
              <p className="text-foreground/80 text-[14px] leading-relaxed">{s.summary}</p>
            </div>
          )}
          {s.feedback && (
            <div className="border-l-[3px] border-primary/40 pl-5">
              <p className="label-nav text-[10px] text-primary/80 mb-2">Mentor Feedback</p>
              <p className="text-foreground/80 text-[14px] leading-relaxed italic">{s.feedback}</p>
            </div>
          )}
          <p className="label-nav text-[10px] text-muted-foreground pt-1">
            {s.timestamp}{s.submittedBy ? ` by ${s.submittedBy}` : ""}
          </p>
        </div>
      )}
    </div>
  );
};

/* ---------------- Page ---------------- */
const Submissions = () => {
  // Default tab by weekday
  const initial: TabKey = useMemo(() => {
    const d = new Date().getDay();
    if (d <= 3) return "checkin"; // Sun..Wed → check-in
    return "team";
  }, []);
  const [tab, setTab] = useState<TabKey>(initial);
  const pct = (COMPLETED_SUBMISSIONS / TOTAL_REQUIRED_SUBMISSIONS) * 100;

  return (
    <AppShell>
      <section className="px-6 md:px-12 pt-20 pb-10">
        <div className="mx-auto max-w-[1100px]">
          <p className="label-eyebrow mb-5">Submissions</p>
          <h1 className="font-serif-display text-4xl md:text-6xl font-light max-w-3xl">
            Your Work, on the Record.
          </h1>
          <p className="mt-6 text-muted-foreground text-base md:text-lg max-w-2xl">
            Submissions are timestamped and cannot be edited after the deadline.
            Submit early.
          </p>

          {/* Progress */}
          <div className="mt-12">
            <div className="flex items-baseline justify-between mb-3">
              <p className="label-nav text-[11px] text-muted-foreground">
                {COMPLETED_SUBMISSIONS} of {TOTAL_REQUIRED_SUBMISSIONS} submissions complete
              </p>
              <p className="label-nav text-[11px] text-primary">{Math.round(pct)}%</p>
            </div>
            <div className="relative h-px bg-primary/15">
              <div className="absolute left-0 top-0 h-px bg-primary" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1100px]">
          {/* Tabs */}
          <div className="flex flex-wrap gap-x-10 gap-y-3 border-b border-primary/15 mb-12">
            {[
              { k: "checkin", label: "Wednesday Check-In · Individual" },
              { k: "team", label: "Sunday Submission · Team" },
            ].map((t) => {
              const active = tab === (t.k as TabKey);
              return (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k as TabKey)}
                  className={`label-nav text-[11px] pb-4 -mb-px border-b-2 transition-colors ${
                    active ? "border-primary text-primary" : "border-transparent text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {tab === "checkin" ? <CheckInTab /> : <TeamTab />}
        </div>
      </div>
    </AppShell>
  );
};

export default Submissions;
