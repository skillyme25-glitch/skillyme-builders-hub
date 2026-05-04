import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-primary/25 mt-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p
              className="font-serif-display text-primary text-lg uppercase mb-4"
              style={{ letterSpacing: "0.2em" }}
            >
              Skillyme Africa
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A six-week competitive builder program. Five industries.
              One hundred builders. One product per industry, shipped.
            </p>
          </div>

          <div>
            <p className="label-eyebrow mb-5">Quick Links</p>
            <ul className="space-y-3">
              {[
                { to: "/welcome", label: "Welcome" },
                { to: "/builders", label: "Builders" },
                { to: "/workspace", label: "Workspace" },
                { to: "/calendar", label: "Calendar" },
                { to: "/submissions", label: "Submissions" },
                { to: "/support", label: "Support" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-eyebrow mb-5">Contact</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:support@skillyme.africa"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  support@skillyme.africa
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/254700000000"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-divider mt-16 mb-6 opacity-40" />
        <p className="text-muted-foreground text-xs uppercase tracking-nav">
          Skillyme Africa Track One — Confidential. Participants only.
        </p>
      </div>
    </footer>
  );
};
