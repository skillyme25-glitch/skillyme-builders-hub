import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EditorialButton } from "@/components/ui/editorial-button";
import { ChevronDown, ChevronUp, Search, MessageCircle } from "lucide-react";
import { FAQS, FAQ_CATEGORIES, type FAQ, type FAQCategory } from "@/data/faqs";

type Category = FAQCategory;
const CATEGORIES = FAQ_CATEGORIES;

const FAQItem = ({ f }: { f: FAQ }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-primary/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-6 py-6 text-left hover:bg-foreground/[0.02] transition-colors px-2"
      >
        <h4 className="font-serif-display text-foreground text-lg md:text-xl font-light leading-snug">
          {f.q}
        </h4>
        {open
          ? <ChevronUp className="h-4 w-4 text-foreground/50 mt-2 shrink-0" strokeWidth={1.5} />
          : <ChevronDown className="h-4 w-4 text-foreground/50 mt-2 shrink-0" strokeWidth={1.5} />}
      </button>
      {open && (
        <p className="text-muted-foreground text-[15px] leading-relaxed pb-7 px-2 max-w-3xl animate-fade-in">
          {f.a}
        </p>
      )}
    </div>
  );
};

const Support = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category>("Submissions");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return FAQS.filter((f) => f.cat === cat).filter(
      (f) => !term || f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term),
    );
  }, [q, cat]);

  const [ticket, setTicket] = useState({ name: "", email: "", category: "Platform", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <AppShell>
      <section className="px-6 md:px-12 pt-20 pb-12">
        <div className="mx-auto max-w-[1100px]">
          <p className="label-eyebrow mb-5">Support</p>
          <h1 className="font-serif-display text-4xl md:text-6xl font-light">We are here.</h1>
          <p className="mt-6 text-muted-foreground text-base md:text-lg max-w-2xl">
            Most questions have already been asked. Start with the FAQ. If the
            answer is not there, we will find it for you within 24 hours.
          </p>
        </div>
      </section>

      {/* Tier 1 — FAQ */}
      <section className="px-6 md:px-12 pb-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="label-eyebrow mb-8">Frequently Asked Questions</p>

          <div className="relative max-w-xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-card border border-primary/20 focus:border-primary/60 outline-none pl-11 pr-4 py-4 text-[14px] text-foreground placeholder:text-muted-foreground transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-primary/15 mb-2">
            {CATEGORIES.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`label-nav text-[11px] pb-4 -mb-px border-b-2 transition-colors ${
                    active ? "border-primary text-primary" : "border-transparent text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div>
            {filtered.length === 0 ? (
              <p className="text-muted-foreground text-[14px] py-12 italic">
                No matches in this category. Try another category, or open a ticket below.
              </p>
            ) : (
              filtered.map((f, i) => <FAQItem key={i} f={f} />)
            )}
          </div>
        </div>
      </section>

      {/* Tier 2 — Peer support */}
      <section className="px-6 md:px-12 pb-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="label-eyebrow mb-8">Talk to Your Cohort</p>
          <div className="border border-primary/40 bg-card p-10 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h3 className="font-serif-display text-2xl md:text-3xl font-light mb-4">
                The room talks to itself.
              </h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed max-w-2xl">
                The Skillyme Africa builder community is active in a dedicated
                WhatsApp group. Other builders often have the fastest answers —
                they are building the same things you are building. Join the
                cohort group and ask there first.
              </p>
            </div>
            <EditorialButton variant="primary" href="https://chat.whatsapp.com/example">
              <MessageCircle className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Join Cohort WhatsApp
            </EditorialButton>
          </div>
        </div>
      </section>

      {/* Tier 3 — Ticket */}
      <section className="px-6 md:px-12 pb-32">
        <div className="mx-auto max-w-[1100px]">
          <p className="label-eyebrow mb-8">Open a Support Ticket</p>
          <p className="text-muted-foreground text-[15px] max-w-2xl mb-10">
            For anything the FAQ and your cohort cannot answer. We respond
            within 24 hours, every day of the sprint.
          </p>

          {sent ? (
            <div className="bg-success/10 border border-success/40 p-8 max-w-2xl">
              <p className="label-nav text-[11px] text-success mb-3">Ticket submitted</p>
              <p className="text-foreground text-[15px] leading-relaxed">
                Thank you, {ticket.name || "builder"}. Your ticket has been logged. Expect a reply at
                <span className="text-primary"> {ticket.email || "your email"}</span> within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="grid gap-6 max-w-2xl"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="border-l-[3px] border-primary pl-5">
                  <label className="label-eyebrow block mb-3">Your Name</label>
                  <input
                    required
                    value={ticket.name}
                    onChange={(e) => setTicket({ ...ticket, name: e.target.value })}
                    className="w-full bg-card border border-primary/15 focus:border-primary/50 outline-none p-3 text-[14px] text-foreground transition-colors"
                  />
                </div>
                <div className="border-l-[3px] border-primary pl-5">
                  <label className="label-eyebrow block mb-3">Email</label>
                  <input
                    required
                    type="email"
                    value={ticket.email}
                    onChange={(e) => setTicket({ ...ticket, email: e.target.value })}
                    className="w-full bg-card border border-primary/15 focus:border-primary/50 outline-none p-3 text-[14px] text-foreground transition-colors"
                  />
                </div>
              </div>

              <div className="border-l-[3px] border-primary pl-5">
                <label className="label-eyebrow block mb-3">Category</label>
                <select
                  value={ticket.category}
                  onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                  className="w-full bg-card border border-primary/15 focus:border-primary/50 outline-none p-3 text-[14px] text-foreground transition-colors"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="border-l-[3px] border-primary pl-5">
                <label className="label-eyebrow block mb-3">Message</label>
                <textarea
                  required
                  rows={6}
                  value={ticket.message}
                  onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                  placeholder="Describe what is happening, what you have tried, and what you expected to see."
                  className="w-full bg-card border border-primary/15 focus:border-primary/50 outline-none p-4 text-[15px] text-foreground placeholder:text-muted-foreground leading-relaxed resize-y transition-colors"
                />
              </div>

              <div className="pt-2">
                <EditorialButton variant="primary" type="submit">
                  Submit Ticket
                </EditorialButton>
              </div>
            </form>
          )}
        </div>
      </section>
    </AppShell>
  );
};

export default Support;
