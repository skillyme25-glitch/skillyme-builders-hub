import { AppShell } from "@/components/layout/AppShell";
import { EditorialButton } from "@/components/ui/editorial-button";
import { ChevronDown, Play, ArrowUpRight } from "lucide-react";
import heroNairobi from "@/assets/hero-nairobi.jpg";
import overviewOffice from "@/assets/overview-office.jpg";

const stats = [
  { num: "100", label: "Builders in the room" },
  { num: "5", label: "African industries" },
  { num: "6", label: "Weeks to ship" },
  { num: "1", label: "Product per industry goes to market" },
];

const cards = [
  {
    n: "01",
    title: "Your Team Workspace",
    body:
      "See your project, your team, your deliverables, and your mentor. Everything you need for the sprint is here.",
    to: "/workspace",
  },
  {
    n: "02",
    title: "The Sprint Calendar",
    body:
      "Every deadline, every meeting, every milestone across 40 days. Know what is coming before it arrives.",
    to: "/calendar",
  },
  {
    n: "03",
    title: "Submit Your Check-In",
    body:
      "Every Wednesday, tell your team and leadership what you are working on and where you need help.",
    to: "/submissions",
  },
];

const Welcome = () => {
  return (
    <AppShell fullBleedHero>
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={heroNairobi}
          alt="Nairobi skyline at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(212 55% 7% / 0.65) 0%, hsl(212 55% 7% / 0.9) 100%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center animate-fade-in-slow">
          <span className="block h-px w-[120px] bg-primary/70" />
          <p className="label-eyebrow mt-8">Skillyme Africa — Track One</p>
          <h1 className="font-serif-display text-foreground mt-8 text-[40px] md:text-[72px] leading-[1.05] font-light max-w-4xl">
            You are in.
            <br />
            The room is now open.
          </h1>
          <p className="mt-8 max-w-xl text-foreground/80 text-base md:text-lg">
            Six weeks. Five industries. One hundred builders.
            <br />
            The sprint begins May 25, 2026.
          </p>
          <span className="mt-10 block h-px w-[120px] bg-primary/70" />
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <EditorialButton variant="primary" to="/workspace">
              Enter Your Workspace
            </EditorialButton>
            <EditorialButton variant="ghost" to="/calendar">
              View the Full Program
            </EditorialButton>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="h-5 w-5 text-primary animate-chevron" strokeWidth={1.2} />
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="bg-card py-24 md:py-32 px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="label-eyebrow mb-12 text-center">From the Track Architect</p>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="relative aspect-video bg-background border border-primary/40 flex items-center justify-center group cursor-pointer hover:border-primary transition-colors">
              <div className="flex h-20 w-20 items-center justify-center border border-primary/60 group-hover:border-primary transition-colors">
                <Play className="h-7 w-7 text-primary ml-1" strokeWidth={1} fill="currentColor" />
              </div>
            </div>

            <div>
              <p className="label-eyebrow mb-5">Track Architect</p>
              <h3 className="font-serif-display text-3xl md:text-4xl font-light mb-6">
                Fredrick Ochieng
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                Before you open your workspace, take 90 seconds to hear directly
                from the founder of this program. This video tells you what the
                next six weeks are built for — and what is expected of you
                inside this room.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE CARDS */}
      <section className="african-pattern py-24 md:py-32 px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="label-eyebrow">Begin Here</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {cards.map((c) => (
              <a
                key={c.n}
                href={c.to}
                className="group editorial-card relative flex flex-col p-10 hover:translate-y-[-2px]"
              >
                <span className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />
                <span className="font-serif-display text-primary text-2xl mb-8">
                  {c.n}
                </span>
                <h3 className="font-serif-display text-2xl md:text-[28px] font-light mb-5">
                  {c.title}
                </h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed flex-1">
                  {c.body}
                </p>
                <span className="mt-10 inline-flex items-center gap-3 label-nav text-primary">
                  Open
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.5} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM OVERVIEW */}
      <section className="relative py-32 md:py-40 px-6 md:px-12 overflow-hidden">
        <img
          src={overviewOffice}
          alt="Modern Nairobi office at night"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(212 55% 7% / 0.78) 0%, hsl(212 55% 7% / 0.95) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <p className="label-eyebrow text-center mb-16">The Program at a Glance</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-20">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif-display font-light text-primary text-[64px] md:text-[80px] leading-none mb-4">
                  {s.num}
                </div>
                <p className="label-nav text-foreground/80 max-w-[180px] mx-auto">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <span className="mx-auto block h-px w-[120px] bg-primary/60" />

          <p className="mx-auto mt-12 max-w-[680px] text-center text-foreground text-lg md:text-xl leading-[1.7]">
            This is not a course. There are no lectures. There are no
            certificates for attendance. There is a room, a problem, a team,
            and a deadline. The gala on July 2 and 3 in Nairobi is where the
            work is judged. Real buyers will be in the room.
          </p>
        </div>
      </section>
    </AppShell>
  );
};

export default Welcome;
