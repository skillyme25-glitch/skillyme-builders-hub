import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EditorialButton } from "@/components/ui/editorial-button";
import { EVENTS, type CalendarEvent, type EventType } from "@/data/directory";
import { X, ExternalLink } from "lucide-react";

const TYPE_META: Record<EventType, { label: string; dot: string; chip: string }> = {
  mentor:     { label: "Mentor Sessions",     dot: "bg-primary",                chip: "bg-primary/20 text-primary border-primary/40" },
  checkin:    { label: "Check-In (Wednesday)", dot: "bg-foreground/80",         chip: "bg-foreground/10 text-foreground border-foreground/30" },
  submission: { label: "Team Submission (Sunday)", dot: "bg-[#7a93a8]",         chip: "bg-[#7a93a8]/20 text-[#a8c0d0] border-[#7a93a8]/40" },
  milestone:  { label: "Milestones & Events", dot: "bg-[#e0a878]",              chip: "bg-[#e0a878]/20 text-[#e0a878] border-[#e0a878]/50" },
};

const SPRINT_START = new Date("2026-05-25");
const SPRINT_END = new Date("2026-07-03");

/* Build month grid for given month (year, monthIdx 0-based) */
function buildMonth(year: number, monthIdx: number) {
  const first = new Date(year, monthIdx, 1);
  const startWeekday = first.getDay(); // 0=Sun
  const lastDay = new Date(year, monthIdx + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(new Date(year, monthIdx, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const fmtISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const eventsForDate = (iso: string) => EVENTS.filter((e) => e.date === iso);

/* ---------------- Month view ---------------- */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthView = ({ onSelect }: { onSelect: (e: CalendarEvent) => void }) => {
  const months = [
    { year: 2026, m: 4, label: "May 2026" },
    { year: 2026, m: 5, label: "June 2026" },
  ];

  return (
    <div className="space-y-16">
      {months.map((mo) => {
        const cells = buildMonth(mo.year, mo.m);
        return (
          <div key={mo.label}>
            <h3 className="font-serif-display text-2xl md:text-3xl font-light mb-6">{mo.label}</h3>
            <div className="grid grid-cols-7 border-l border-t border-primary/15">
              {WEEKDAYS.map((w) => (
                <div key={w} className="label-nav text-[10px] text-muted-foreground p-3 border-r border-b border-primary/15 bg-card/40">
                  {w}
                </div>
              ))}
              {cells.map((d, i) => {
                const inSprint = d && d >= SPRINT_START && d <= SPRINT_END;
                const iso = d ? fmtISO(d) : "";
                const evs = d ? eventsForDate(iso) : [];
                return (
                  <div
                    key={i}
                    className={`min-h-[110px] border-r border-b border-primary/15 p-2 flex flex-col gap-1 ${
                      d ? (inSprint ? "bg-card" : "bg-background opacity-30") : "bg-background/40"
                    }`}
                  >
                    {d && (
                      <span className={`text-[12px] mb-1 ${inSprint ? "text-foreground/80" : "text-muted-foreground"}`}>
                        {d.getDate()}
                      </span>
                    )}
                    {evs.slice(0, 3).map((e) => {
                      const meta = TYPE_META[e.type];
                      return (
                        <button
                          key={e.id}
                          onClick={() => onSelect(e)}
                          className={`text-left text-[10px] uppercase tracking-nav truncate px-1.5 py-1 border ${meta.chip} hover:opacity-80 transition`}
                        >
                          {e.title}
                        </button>
                      );
                    })}
                    {evs.length > 3 && (
                      <button
                        onClick={() => onSelect(evs[3])}
                        className="text-[10px] text-muted-foreground hover:text-foreground text-left"
                      >
                        +{evs.length - 3} more
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* July strip */}
      <div>
        <h3 className="font-serif-display text-2xl md:text-3xl font-light mb-6">July 2026</h3>
        <div className="grid grid-cols-3 border-l border-t border-primary/15">
          {[1, 2, 3].map((day) => {
            const d = new Date(2026, 6, day);
            const iso = fmtISO(d);
            const evs = eventsForDate(iso);
            return (
              <div key={day} className="min-h-[140px] border-r border-b border-primary/15 p-3 bg-card flex flex-col gap-2">
                <span className="text-[12px] text-foreground/80 mb-1">
                  {WEEKDAYS[d.getDay()]} · {day}
                </span>
                {evs.map((e) => {
                  const meta = TYPE_META[e.type];
                  return (
                    <button
                      key={e.id}
                      onClick={() => onSelect(e)}
                      className={`text-left text-[10px] uppercase tracking-nav truncate px-1.5 py-1 border ${meta.chip}`}
                    >
                      {e.title}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Week view ---------------- */
const FragmentRow = ({ h, days, onSelect }: { h: number; days: Date[]; onSelect: (e: CalendarEvent) => void }) => (
  <>
    <div className="border-r border-b border-primary/15 px-2 py-3 text-[10px] text-muted-foreground bg-card/20">
      {String(h).padStart(2, "0")}:00
    </div>
    {days.map((d) => {
      const iso = fmtISO(d);
      const slots = EVENTS.filter((e) => e.date === iso && e.type === "mentor" && e.time && parseInt(e.time.split(":")[0], 10) === h);
      return (
        <div key={`${iso}-${h}`} className="border-r border-b border-primary/15 min-h-[44px] p-1 bg-card flex flex-col gap-1">
          {slots.map((e) => {
            const meta = TYPE_META[e.type];
            return (
              <button
                key={e.id}
                onClick={() => onSelect(e)}
                className={`text-left text-[10px] uppercase tracking-nav truncate px-1.5 py-1 border ${meta.chip}`}
              >
                {e.time} · {e.title.replace("Mentor Session — ", "")}
              </button>
            );
          })}
        </div>
      );
    })}
  </>
);

const WeekView = ({ onSelect }: { onSelect: (e: CalendarEvent) => void }) => {
  const [weekStart, setWeekStart] = useState(() => new Date("2026-06-01")); // Monday June 1
  // Make sure starts on Monday
  const start = new Date(weekStart);
  while (start.getDay() !== 1) start.setDate(start.getDate() - 1);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8..20

  const shift = (n: number) => {
    const d = new Date(start);
    d.setDate(start.getDate() + n);
    setWeekStart(d);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif-display text-2xl font-light">
          Week of {start.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
        </h3>
        <div className="flex items-center gap-3">
          <button onClick={() => shift(-7)} className="label-nav text-[11px] text-muted-foreground hover:text-foreground transition-colors">← Previous</button>
          <button onClick={() => shift(7)} className="label-nav text-[11px] text-muted-foreground hover:text-foreground transition-colors">Next →</button>
        </div>
      </div>

      <div className="grid border-l border-t border-primary/15" style={{ gridTemplateColumns: "60px repeat(7, minmax(0, 1fr))" }}>
        <div className="border-r border-b border-primary/15 p-2 bg-card/40" />
        {days.map((d) => (
          <div key={d.toISOString()} className="border-r border-b border-primary/15 p-2 bg-card/40">
            <p className="label-nav text-[10px] text-muted-foreground">
              {WEEKDAYS[d.getDay()].slice(0, 3)}
            </p>
            <p className="font-serif-display text-foreground text-lg leading-none mt-1">{d.getDate()}</p>
          </div>
        ))}

        {/* All-day banners row */}
        <div className="border-r border-b border-primary/15 p-2 text-[10px] uppercase tracking-nav text-muted-foreground bg-card/20">
          All-day
        </div>
        {days.map((d) => {
          const iso = fmtISO(d);
          const all = eventsForDate(iso).filter((e) => !e.time || e.type === "checkin" || e.type === "submission" || e.type === "milestone");
          return (
            <div key={iso + "-all"} className="border-r border-b border-primary/15 p-1 min-h-[42px] bg-card/20 flex flex-col gap-1">
              {all.filter((e) => e.type !== "mentor").map((e) => {
                const meta = TYPE_META[e.type];
                return (
                  <button
                    key={e.id}
                    onClick={() => onSelect(e)}
                    className={`text-left text-[9px] uppercase tracking-nav truncate px-1 py-0.5 border ${meta.chip}`}
                  >
                    {e.title}
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Hourly grid (mentor sessions only as time blocks) */}
        {hours.map((h) => (
          <FragmentRow key={`row-${h}`} h={h} days={days} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};

/* ---------------- Event detail panel ---------------- */
const EventPanel = ({ event, onClose }: { event: CalendarEvent | null; onClose: () => void }) => {
  if (!event) return null;
  const meta = TYPE_META[event.type];
  const date = new Date(event.date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      <button className="flex-1 bg-background/70 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <aside className="w-full max-w-md bg-surface border-l border-primary/20 p-8 md:p-10 overflow-y-auto">
        <div className="flex items-start justify-between mb-8">
          <span className={`inline-flex px-3 py-1 text-[10px] uppercase tracking-nav border ${meta.chip}`}>
            {meta.label}
          </span>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <h3 className="font-serif-display text-3xl font-light mb-3">{event.title}</h3>
        <p className="label-nav text-[11px] text-primary mb-2">{date}</p>
        {event.time && (
          <p className="text-[13px] text-muted-foreground mb-6">
            {event.time}{event.endTime ? ` — ${event.endTime}` : ""} EAT
          </p>
        )}

        <div className="gold-divider opacity-30 my-6" />

        <p className="text-[15px] text-foreground/90 leading-relaxed mb-8">
          {event.description}
        </p>

        {event.actionLabel && event.actionHref && (
          event.actionHref.startsWith("http") ? (
            <EditorialButton variant="primary" href={event.actionHref} className="w-full">
              {event.actionLabel}
              <ExternalLink className="h-4 w-4 ml-2" strokeWidth={1.5} />
            </EditorialButton>
          ) : (
            <EditorialButton variant="primary" to={event.actionHref} className="w-full">
              {event.actionLabel}
            </EditorialButton>
          )
        )}
      </aside>
    </div>
  );
};

/* ---------------- Page ---------------- */
const Calendar = () => {
  const [view, setView] = useState<"month" | "week">("month");
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  return (
    <AppShell>
      <section className="px-6 md:px-12 pt-20 pb-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="label-eyebrow mb-5">The Sprint Calendar</p>
              <h1 className="font-serif-display text-4xl md:text-6xl font-light max-w-3xl">
                May 25 to July 3, 2026
              </h1>
              <p className="mt-6 text-muted-foreground text-base md:text-lg max-w-2xl">
                Every deadline, every session, every milestone across 40 days.
                Missing a deadline is visible to your team and to leadership.
              </p>
            </div>
            <div className="inline-flex border border-primary/30 self-start">
              {(["month", "week"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`label-nav text-[11px] px-5 py-3 transition-colors ${
                    view === v ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {v === "month" ? "Month" : "Week"}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {(Object.keys(TYPE_META) as EventType[]).map((t) => {
              const meta = TYPE_META[t];
              return (
                <div key={t} className="flex items-center gap-3">
                  <span className={`inline-block h-2 w-2 ${meta.dot}`} />
                  <span className="label-nav text-[10px] text-muted-foreground">{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-[1400px]">
          {view === "month" ? <MonthView onSelect={setSelected} /> : <WeekView onSelect={setSelected} />}
        </div>
      </div>

      <EventPanel event={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
};

export default Calendar;
