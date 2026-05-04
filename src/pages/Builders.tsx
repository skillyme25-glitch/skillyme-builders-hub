import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PROJECTS, VIEWER_BUILDER_ID, type DirectoryBuilder, type DirectoryTeam } from "@/data/directory";
import { Search } from "lucide-react";

const BuilderSeat = ({ b }: { b: DirectoryBuilder }) => {
  const isViewer = b.id === VIEWER_BUILDER_ID;
  return (
    <div
      className={`group relative flex items-start gap-3 p-4 transition-all duration-200 hover:translate-y-[-1px] ${
        isViewer
          ? "bg-primary/[0.06] border border-primary/40"
          : "border border-primary/10 hover:border-primary/30 bg-card"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center font-serif-display text-[14px] ${
          isViewer ? "border-2 border-primary text-primary" : "border border-primary/30 text-foreground/80"
        }`}
      >
        {b.initials}
      </div>
      <div className="flex-1 min-w-0">
        {isViewer && <p className="label-nav text-[9px] text-primary mb-1">You</p>}
        <p className="text-[14px] text-foreground truncate leading-tight">{b.name}</p>
        <p className="label-nav text-[10px] text-primary/80 mt-1 truncate">{b.role}</p>
        <p className="text-[11px] text-muted-foreground mt-1.5 truncate">
          <span className="mr-1">{b.countryFlag}</span>{b.country}
        </p>
      </div>
      {/* Tooltip on hover */}
      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="bg-surface border border-primary/30 p-3 text-[12px] text-foreground/90 leading-relaxed">
          {b.roleDetail}
        </div>
      </div>
    </div>
  );
};

const TeamCard = ({ team, filter }: { team: DirectoryTeam; filter: string }) => {
  const filtered = team.builders.map((b) => {
    const match =
      !filter ||
      b.name.toLowerCase().includes(filter) ||
      b.role.toLowerCase().includes(filter);
    return { b, match };
  });
  return (
    <div className="bg-card border border-primary/15 p-8">
      <div className="flex items-baseline justify-between mb-6">
        <p className="label-eyebrow">Team {team.letter}</p>
        <span className="label-nav text-[10px] text-muted-foreground">10 builders</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(({ b, match }) => (
          <div key={b.id} className={match ? "" : "opacity-25"}>
            <BuilderSeat b={b} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Builders = () => {
  const [q, setQ] = useState("");
  const filter = q.trim().toLowerCase();

  const totalMatches = useMemo(() => {
    if (!filter) return null;
    return PROJECTS.reduce((sum, p) =>
      sum + p.teams.reduce((s, t) =>
        s + t.builders.filter((b) =>
          b.name.toLowerCase().includes(filter) || b.role.toLowerCase().includes(filter)
        ).length, 0), 0);
  }, [filter]);

  return (
    <AppShell>
      <section className="px-6 md:px-12 pt-20 pb-16">
        <div className="mx-auto max-w-[1400px]">
          <p className="label-eyebrow mb-5">The Builders</p>
          <h1 className="font-serif-display text-4xl md:text-6xl font-light max-w-4xl">
            One Hundred Builders. Ten Teams. Five Industries.
          </h1>
          <p className="mt-6 text-muted-foreground text-base md:text-lg max-w-2xl">
            Every seat in this room is filled. Find your team and meet the
            people you are competing alongside.
          </p>

          <div className="relative mt-12 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or role..."
              className="w-full bg-card border border-primary/20 focus:border-primary/60 outline-none pl-11 pr-4 py-4 text-[14px] text-foreground placeholder:text-muted-foreground transition-colors"
            />
            {totalMatches !== null && (
              <p className="label-nav text-[10px] text-muted-foreground mt-3">
                {totalMatches} builder{totalMatches === 1 ? "" : "s"} match
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="px-6 md:px-12 pb-24 space-y-20">
        <div className="mx-auto max-w-[1400px] space-y-20">
          {PROJECTS.map((p) => {
            const Icon = p.icon;
            return (
              <section key={p.slug}>
                <div className="flex items-start gap-6 border-l-[3px] border-primary pl-6 mb-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <p className="label-eyebrow">Project {p.number}</p>
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.2} />
                    </div>
                    <h2 className="font-serif-display text-3xl md:text-4xl font-light mb-3">
                      {p.name}
                    </h2>
                    <p className="text-muted-foreground text-[15px] max-w-2xl">{p.oneLiner}</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {p.teams.map((t) => (
                    <TeamCard key={t.id} team={t} filter={filter} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
};

export default Builders;
