import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { TEAM, VIEWER_ID } from "@/data/mock";
import logo from "@/assets/logo.png";

const NAV_ITEMS = [
  { to: "/welcome", label: "Welcome" },
  { to: "/builders", label: "Builders" },
  { to: "/workspace", label: "Workspace" },
  { to: "/calendar", label: "Calendar" },
  { to: "/submissions", label: "Submissions" },
  { to: "/support", label: "Support" },
];

export const TopNav = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const viewer = TEAM.builders.find((b) => b.id === VIEWER_ID);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md"
      style={{ background: "rgba(10,10,10,0.92)" }}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 md:px-10">
        <Link
          to="/welcome"
          className="font-serif-display text-primary tracking-editorial text-[16px] md:text-[18px] uppercase"
          style={{ letterSpacing: "0.2em" }}
        >
          Skillyme Africa
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.to || (item.to === "/welcome" && pathname === "/");
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`label-nav transition-colors duration-200 ${
                  active ? "text-primary" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Avatar */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center border border-primary/30 text-primary font-serif-display text-sm hover:border-primary transition-colors"
          >
            {viewer?.initials ?? "A"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Menu"
          className="lg:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden absolute left-0 right-0 top-16 border-t border-primary/15"
          style={{ background: "rgba(10,10,10,0.98)" }}
        >
          <nav className="flex flex-col px-6 py-6 gap-5">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`label-nav ${active ? "text-primary" : "text-foreground/70"}`}
                >
                  {item.label}
                </NavLink>
              );
            })}
            <div className="gold-divider my-2" />
            <span className="label-nav text-foreground/50">Profile</span>
            <span className="label-nav text-foreground/50">Logout</span>
          </nav>
        </div>
      )}
    </header>
  );
};
