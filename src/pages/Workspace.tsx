import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EditorialButton } from "@/components/ui/editorial-button";
import { TEAM, MENTOR, PROJECT_BRIEF, WEEKS, VIEWER_ID, type WeekPlan, type SubmissionStatus } from "@/data/mock";
import { ChevronDown, ChevronUp, ExternalLink, Mail, MessageCircle } from "lucide-react";

/* ---------- Status badge ---------- */
const StatusBadge = ({ status }: { status: WeekPlan["status"] | SubmissionStatus }) => {
  const map: Record<string, { label: string; cls: string; pulse?: boolean }> = {
    upcoming: { label: "Upcoming", cls: "border border-foreground/30 text-foreground/60" },
    active:   { label: "Active", cls: "bg-primary text-primary-foreground" },
    open:     { label: "Open", cls: "bg-primary text-primary-foreground" },
    in_review:{ label: "In Review", cls: "border border-primary text-primary" },
    submitted:{ label: "Submitted", cls: "bg-success text-success-foreground" },
    missed:   { label: "Missed", cls: "bg-destructive text-destructive-foreground", pulse: true },
  };
  const it = map[status];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-nav font-medium ${it.cls} ${it.pulse ? "animate-pulse-danger" : ""}`}
    >
      {it.label}
    </span>
  );
};

/* ---------- Member row (left sidebar) ---------- */
const MemberRow = ({ b }: { b: typeof TEAM.builders[number] }) => (
  <div className="flex items-center gap-3 py-3">
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center font-serif-display text-[13px] ${
        b.isViewer
          ? "border-2 border-primary text-primary bg-primary/10"
          : "border border-primary/30 text-foreground/80"
      }`}
    >
      {b.initials}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] truncate text-foreground">
        {b.name} {b.isViewer && <span className="text-primary text-[10px] tracking-nav uppercase ml-1">You</span>}
      </p>
      <p className="text-[10px] uppercase tracking-nav text-primary/80 truncate">{b.role}</p>
    </div>
    <span
      className={`h-1.5 w-1.5 rounded-full shrink-0 ${b.activeToday ? "bg-success" : "bg-foreground/20"}`}
      aria-label={b.activeToday ? "Active today" : "Not seen today"}
    />
  </div>
);

/* ---------- Submission block ---------- */
const SubmissionBlock = ({
  label,
  due,
  status,
  reviewedBy,
  showReview,
  ctaTo,
  ctaLabel,
}: {
  label: string;
  due: string;
  status: SubmissionStatus;
  reviewedBy?: string[];
  showReview?: boolean;
  ctaTo: string;
  ctaLabel: string;
}) => {
  const missed = status === "missed";
  return (
    <div
      className={`border p-6 flex flex-col gap-4 ${
        missed ? "border-destructive/40 bg-destructive/5" : "border-primary/15 bg-background"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="label-eyebrow text-[10px]">{label}</p>
        <StatusBadge status={status} />
      </div>
      <p className="text-[13px] text-muted-foreground">{due}</p>

      {showReview && reviewedBy && (
        <div>
          <p className="label-nav text-[10px] text-foreground/60 mb-3">
            Team sign-off · {reviewedBy.length}/10
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TEAM.builders.map((b) => {
              const reviewed = reviewedBy.includes(b.id);
              return (
                <span
                  key={b.id}
                  title={`${b.name}${reviewed ? " · reviewed" : " · not reviewed"}`}
                  className={`flex h-6 w-6 items-center justify-center text-[9px] font-serif-display ${
                    reviewed
                      ? "bg-primary/15 border border-primary text-primary"
                      : "border border-foreground/15 text-foreground/40"
                  }`}
                >
                  {b.initials}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-2">
        {missed ? (
          <>
            <p className="text-[12px] text-destructive mb-3">
              This submission is overdue. Submit immediately or contact support.
            </p>
            <EditorialButton variant="danger" to={ctaTo} className="w-full">
              Submit Now (Overdue)
            </EditorialButton>
          </>
        ) : status === "submitted" ? (
          <EditorialButton variant="ghost" to={ctaTo} className="w-full">
            View Submission
          </EditorialButton>
        ) : (
          <EditorialButton
            variant={status === "open" || status === "active" ? "primary" : "secondary"}
            to={ctaTo}
            className="w-full"
          >
            {ctaLabel}
          </EditorialButton>
        )}
      </div>
    </div>
  );
};

/* ---------- Week card ---------- */
const WeekCard = ({ week, defaultOpen }: { week: WeekPlan; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  const missed = week.status === "missed";

  return (
    <article
      className={`border ${
        missed
          ? "border-destructive/40 bg-destructive/5"
          : "border-primary/15 bg-card"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-8 py-7 text-left hover:bg-foreground/[0.02] transition-colors"
      >
        <div className="flex items-baseline gap-6 flex-1 min-w-0">
          <span className="label-eyebrow shrink-0">Week {String(week.number).padStart(2, "0")}</span>
          <span className="text-[12px] uppercase tracking-nav text-muted-foreground shrink-0 hidden md:inline">
            {week.dateRange}
          </span>
          <h3 className="font-serif-display text-xl md:text-2xl font-light truncate">
            {week.theme}
          </h3>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <StatusBadge status={week.status} />
          {open ? (
            <ChevronUp className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
          )}
        </div>
      </button>

      {open && (
        <div className="px-8 pb-8 animate-fade-in">
          <div className="gold-divider opacity-30 mb-8" />

          <p className="label-eyebrow mb-5">What is expected this week</p>
          <ul className="space-y-3 mb-10">
            {week.expectations.map((e, i) => (
              <li key={i} className="flex gap-4 text-[15px] text-foreground/90">
                <span className="text-primary mt-1">·</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            <SubmissionBlock
              label="Wednesday Check-In · Individual"
              due={week.checkIn.dueLabel}
              status={week.checkIn.status}
              ctaTo="/submissions"
              ctaLabel="Submit Check-In"
            />
            <SubmissionBlock
              label="Sunday Submission · Team"
              due={week.teamSubmission.dueLabel}
              status={week.teamSubmission.status}
              reviewedBy={week.teamSubmission.reviewedBy}
              showReview
              ctaTo="/submissions"
              ctaLabel="Submit Team Deliverable"
            />
          </div>

          <p className="text-[13px] italic text-muted-foreground leading-relaxed">
            {week.teamSubmission.deliverableSummary}
          </p>
        </div>
      )}
    </article>
  );
};

/* ============================================================ */

const Workspace = () => {
  const viewer = TEAM.builders.find((b) => b.id === VIEWER_ID);

  return (
    <AppShell>
      {/* Page header */}
      <section className="px-6 md:px-12 pt-20 pb-12">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-eyebrow mb-5">Your Workspace</p>
          <h1 className="font-serif-display text-4xl md:text-6xl font-light max-w-3xl">
            {TEAM.name}
          </h1>
          <p className="mt-6 text-muted-foreground text-base md:text-lg max-w-2xl">
            Welcome back, {viewer?.name?.split(" ")[0]}. Your project, your team,
            your deliverables — everything for the sprint lives here.
          </p>
        </div>
      </section>

      <div className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 lg:grid-cols-[240px_1fr_280px]">

            {/* LEFT — TEAM */}
            <aside className="space-y-8">
              <div>
                <p className="label-eyebrow mb-5">Your Team</p>
                <h2 className="font-serif-display text-2xl font-light mb-6">
                  {TEAM.name}
                </h2>
                <div className="gold-divider opacity-40" />
                <div className="divide-y divide-primary/10 mt-2">
                  {TEAM.builders.map((b) => (
                    <MemberRow key={b.id} b={b} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <EditorialButton variant="secondary" href="https://chat.whatsapp.com/example" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Open Team WhatsApp
                </EditorialButton>
                <EditorialButton variant="ghost" href="mailto:team-a-realestate@skillyme.africa" className="w-full">
                  <Mail className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Email Your Team
                </EditorialButton>
              </div>
            </aside>

            {/* CENTER — BRIEF + WEEKS */}
            <div className="min-w-0">
              <div>
                <p className="label-eyebrow mb-5">Your Project</p>
                <h2 className="font-serif-display text-3xl md:text-4xl font-light mb-8">
                  {TEAM.project}
                </h2>
                <div className="space-y-5 max-w-2xl">
                  {PROJECT_BRIEF.map((p, i) => (
                    <p key={i} className="text-foreground/85 text-[16px] leading-[1.8]">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-8">
                  <EditorialButton variant="secondary" href="#">
                    Read Full Brief
                    <ExternalLink className="h-4 w-4 ml-2" strokeWidth={1.5} />
                  </EditorialButton>
                </div>
                <div className="gold-divider opacity-30 my-16" />
              </div>

              <p className="label-eyebrow mb-8">The Sprint — Week by Week</p>
              <div className="space-y-4">
                {WEEKS.map((w) => (
                  <WeekCard key={w.number} week={w} defaultOpen={w.status === "active"} />
                ))}
              </div>
            </div>

            {/* RIGHT — MENTOR */}
            <aside className="space-y-8">
              <div>
                <p className="label-eyebrow mb-6">Your Mentor</p>
                <div className="flex items-center justify-center h-20 w-20 border border-primary/40 font-serif-display text-2xl text-primary mb-5">
                  {MENTOR.initials}
                </div>
                <h3 className="font-serif-display text-2xl font-light mb-3">
                  {MENTOR.name}
                </h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed mb-4">
                  {MENTOR.bio}
                </p>
                <p className="label-nav text-primary/80 text-[10px]">
                  {MENTOR.industry}
                </p>
              </div>

              <div className="gold-divider opacity-40" />

              <div>
                <p className="label-eyebrow mb-5">Scheduled Sessions</p>
                <ul className="space-y-5">
                  {MENTOR.sessions.map((s, i) => (
                    <li
                      key={i}
                      className={`flex flex-col gap-2 ${s.past ? "opacity-40" : ""}`}
                    >
                      <span className="label-nav text-[10px] text-primary/80">{s.date}</span>
                      <span className="text-[14px] text-foreground">{s.focus}</span>
                      {!s.past && (
                        <a
                          href={s.meetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="label-nav text-[11px] text-primary hover:underline inline-flex items-center gap-2 mt-1"
                        >
                          Join Session
                          <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Workspace;
