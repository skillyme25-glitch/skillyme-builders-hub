import { NEXT_DEADLINE } from "@/data/mock";

export const DeadlineBanner = () => {
  const { title, dateLabel, hoursRemaining, totalWindowHours } = NEXT_DEADLINE;
  const passed = hoursRemaining <= 0;

  // Only render if deadline within 48 hours or already passed.
  if (!passed && hoursRemaining > 48) return null;

  const pct = Math.max(0, Math.min(100, (hoursRemaining / totalWindowHours) * 100));

  return (
    <div
      className="w-full"
      style={{
        background: passed ? "rgba(192,57,43,0.15)" : "rgba(201,168,76,0.12)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between md:px-10">
        <p
          className={`label-nav ${passed ? "text-destructive" : "text-primary"}`}
        >
          {passed
            ? "Deadline passed. Submit immediately or contact support."
            : `Next deadline: ${title} — ${dateLabel} — ${hoursRemaining} hours remaining`}
        </p>
        {!passed && (
          <div className="flex items-center gap-3 md:w-72">
            <div className="relative h-px flex-1 bg-primary/20">
              <div
                className="absolute left-0 top-0 h-px bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="label-nav text-primary/80">{Math.round(pct)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
